#!/usr/bin/env node
/** Find orphaned quiz images in R2 and/or the backend's public/image directory. */
const fs = require('node:fs/promises');
const path = require('node:path');
const { parseArgs } = require('node:util');
const { JSDOM } = require('jsdom');

class CleanupError extends Error {}

const IMAGE_EXTENSION = /\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?|heic|ico)$/i;
const REFERENCE_SQL = `
  SELECT to_jsonb(q) AS data FROM "Question" q
  UNION ALL SELECT to_jsonb(q) FROM "WrittenQuestion" q
  UNION ALL SELECT to_jsonb(q) FROM "SubQuestion" q
  UNION ALL SELECT jsonb_build_object('note', note) FROM "Lecture"
  UNION ALL SELECT jsonb_build_object('urls', urls) FROM "LectureLink"
`;

function addReference(value, references, config) {
  if (typeof value !== 'string' || !value.trim()) return;
  value = value.trim();
  const bases = [
    [config.r2Url, references.r2],
    [config.staticUrl && `${config.staticUrl.replace(/\/$/, '')}/image`, references.local],
  ];
  if (/^https?:\/\//i.test(value)) {
    const url = new URL(value);
    for (const [base, set] of bases) {
      if (!base) continue;
      const root = new URL(`${base.replace(/\/$/, '')}/`);
      if (url.origin === root.origin && url.pathname.startsWith(root.pathname)) {
        const key = url.pathname.slice(root.pathname.length);
        set.add(key);
        set.add(decodeURIComponent(key));
      }
    }
    return;
  }
  // WrittenQuestion.image is a bare filename. Embedded HTML uses /image/name.
  const clean = value.split(/[?#]/)[0];
  if (/^(?:\/)?image\//.test(clean)) {
    const key = clean.replace(/^\/?image\//, '');
    references.local.add(key);
    references.local.add(decodeURIComponent(key));
  } else if (IMAGE_EXTENSION.test(clean) && !/[<>\n\r]/.test(clean)) {
    references.local.add(clean);
    references.local.add(decodeURIComponent(clean));
    references.r2.add(clean);
    references.r2.add(decodeURIComponent(clean));
  }
}

function collectReferences(rows, config) {
  const references = { local: new Set(), r2: new Set() };
  function visit(value) {
    if (Array.isArray(value)) { value.forEach(visit); return; }
    if (value && typeof value === 'object') { Object.values(value).forEach(visit); return; }
    if (typeof value !== 'string') return;
    addReference(value, references, config);
    // Include URLs in rich text, CSS, and ordinary question/answer text.
    for (const match of value.matchAll(/https?:\/\/[^\s<>"']+/gi)) {
      addReference(match[0].replace(/&amp;/g, '&'), references, config);
    }
    for (const match of value.matchAll(/(?<![\w/:.])\/image\/[^\s<>\"'()]+/gi)) addReference(match[0], references, config);
    if (!value.includes('<')) return;
    const dom = new JSDOM(value);
    try {
      for (const element of dom.window.document.querySelectorAll('*')) {
        for (const attribute of ['src', 'href', 'poster', 'data-src']) {
          addReference(element.getAttribute(attribute), references, config);
        }
        for (const item of (element.getAttribute('srcset') || '').split(',')) {
          addReference(item.trim().split(/\s+/)[0], references, config);
        }
      }
    } finally { dom.window.close(); }
  }
  rows.forEach((row) => visit(row.data));
  return references;
}

async function loadReferences(client, config) {
  // One statement reads all tables from one PostgreSQL snapshot. Errors abort
  // cleanup; an inaccessible table must never be mistaken for no references.
  const result = await client.query(REFERENCE_SQL);
  if (!Array.isArray(result.rows)) throw new CleanupError('Invalid database reference result.');
  return collectReferences(result.rows, config);
}

async function listLocalImages(directory) {
  const root = await fs.realpath(directory);
  if (!(await fs.stat(root)).isDirectory()) throw new CleanupError('images-dir must be a directory.');
  const images = [];
  async function visit(folder) {
    for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
      const filename = path.join(folder, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) { await visit(filename); continue; }
      if (!entry.isFile() || !IMAGE_EXTENSION.test(entry.name)) continue;
      const stat = await fs.lstat(filename);
      if (!stat.isFile()) continue;
      images.push({ store: 'local', key: path.relative(root, filename).split(path.sep).join('/'),
        filename, size: stat.size, modified: stat.mtime.toISOString(), ino: stat.ino, dev: stat.dev });
    }
  }
  await visit(root);
  return images;
}

async function listR2Images(s3, bucket, prefix, commands) {
  const images = [];
  const seen = new Set();
  let token;
  do {
    const page = await s3.send(new commands.ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }));
    for (const object of page.Contents || []) {
      if (!object.Key || !IMAGE_EXTENSION.test(object.Key) || !object.LastModified) continue;
      images.push({ store: 'r2', key: object.Key, size: object.Size, modified: object.LastModified.toISOString(), etag: object.ETag });
    }
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
    if (page.IsTruncated && (!token || seen.has(token))) throw new CleanupError('Incomplete R2 listing; cleanup aborted.');
    if (token) seen.add(token);
  } while (token);
  return images;
}

function findUnused(images, references, cutoff) {
  return images.filter((image) => !references[image.store].has(image.key) &&
    Number.isFinite(Date.parse(image.modified)) && Date.parse(image.modified) < cutoff);
}

async function deleteImages(candidates, references, { s3, bucket, commands }) {
  const results = [];
  for (const image of candidates) {
    if (references[image.store].has(image.key)) {
      results.push({ ...image, result: 'skipped-new-reference' });
      continue;
    }
    try {
      if (image.store === 'local') {
        const stat = await fs.lstat(image.filename);
        if (!stat.isFile() || stat.ino !== image.ino || stat.dev !== image.dev ||
          stat.size !== image.size || stat.mtime.toISOString() !== image.modified) {
          results.push({ ...image, result: 'skipped-changed' });
          continue;
        }
        await fs.unlink(image.filename);
      } else {
        const current = await s3.send(new commands.HeadObjectCommand({ Bucket: bucket, Key: image.key }));
        if (!image.etag || current.ETag !== image.etag || current.ContentLength !== image.size ||
          current.LastModified?.toISOString() !== image.modified) {
          results.push({ ...image, result: 'skipped-changed' });
          continue;
        }
        await s3.send(new commands.DeleteObjectCommand({ Bucket: bucket, Key: image.key }));
      }
      results.push({ ...image, result: 'deleted' });
    } catch (error) {
      if (error.code === 'ENOENT' || error.$metadata?.httpStatusCode === 404) {
        results.push({ ...image, result: 'already-missing' });
      } else {
        // Keep error text out of reports: SDK/DB messages may contain credentials.
        results.push({ ...image, result: 'failed', error: error.code || error.name || 'Error' });
      }
    }
  }
  return results;
}

const HELP = `Usage: node scripts/cleanup-unused-images.cjs [options]

Dry-run is the default. No files or objects are deleted without --delete.

  --r2                    Scan R2 (defaults to question-images/ prefix)
  --r2-prefix PREFIX      Change prefix; use --r2-prefix '' for all image keys
  --bucket NAME           R2 bucket (default: S3_BUCKET or drg)
  --images-dir DIRECTORY  Scan the backend's public/image folder (recursive)
  --min-age-hours HOURS   Skip recent images (default: 24; 0 includes recent files)
  --report FILE           Write a JSON report before deletion, then update outcomes
  --dry-run               List unreferenced images without deleting (default)
  --delete                Delete unreferenced images; incompatible with --dry-run
  --help                  Show this help

Required: DATABASE_URL for the backend PostgreSQL database.
R2: S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, NEXT_PUBLIC_R2_URL.
Local: NEXT_PUBLIC_STATIC_URL, plus access to the backend image directory.
Loads .env from the working directory. You may also use Node's --env-file flag.
Pause imports and edits during --delete to avoid concurrent reference changes.
`;

async function main() {
  const { values } = parseArgs({ options: {
    r2: { type: 'boolean' }, 'r2-prefix': { type: 'string', default: 'question-images/' },
    bucket: { type: 'string' }, 'images-dir': { type: 'string' },
    'min-age-hours': { type: 'string', default: '24' }, report: { type: 'string' },
    'dry-run': { type: 'boolean' }, delete: { type: 'boolean' }, help: { type: 'boolean' },
  } });
  if (values.help) { console.log(HELP); return; }
  if (values['dry-run'] && values.delete) throw new CleanupError('Use either --dry-run or --delete, not both.');
  if (!values.r2 && !values['images-dir']) throw new CleanupError('Select --r2 and/or --images-dir. Use --help for details.');
  const age = Number(values['min-age-hours']);
  if (!values['min-age-hours'].trim() || !Number.isFinite(age) || age < 0) throw new CleanupError('min-age-hours must be nonnegative.');
  require('dotenv').config({ quiet: true });
  const required = ['DATABASE_URL'];
  if (values.r2) required.push('S3_ENDPOINT', 'S3_ACCESS_KEY', 'S3_SECRET_KEY', 'NEXT_PUBLIC_R2_URL');
  if (values['images-dir']) required.push('NEXT_PUBLIC_STATIC_URL');
  for (const name of required) if (!process.env[name]) throw new CleanupError(`Missing environment variable: ${name}`);
  const config = { r2Url: process.env.NEXT_PUBLIC_R2_URL, staticUrl: process.env.NEXT_PUBLIC_STATIC_URL };
  for (const url of [config.r2Url, config.staticUrl].filter(Boolean)) {
    if (!/^https?:$/.test(new URL(url).protocol)) throw new CleanupError('Storage URLs must use HTTP or HTTPS.');
  }
  const bucket = values.bucket || process.env.S3_BUCKET || 'drg';
  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, statement_timeout: 60000 });
  let s3, commands;
  try {
    await client.connect();
    // The script must never write to the database.
    await client.query('SET default_transaction_read_only = on');
    const references = await loadReferences(client, config);
    const images = [];
    if (values['images-dir']) images.push(...await listLocalImages(values['images-dir']));
    if (values.r2) {
      commands = require('@aws-sdk/client-s3');
      s3 = new commands.S3Client({ region: 'auto', endpoint: process.env.S3_ENDPOINT,
        credentials: { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY } });
      images.push(...await listR2Images(s3, bucket, values['r2-prefix'], commands));
    }
    const cutoff = Date.now() - age * 3600000;
    const candidates = findUnused(images, references, cutoff);
    const report = { createdAt: new Date().toISOString(), mode: values.delete ? 'delete' : 'dry-run',
      bucket: values.r2 ? bucket : undefined, prefix: values.r2 ? values['r2-prefix'] : undefined,
      scanned: images.length, candidateCount: candidates.length,
      candidateBytes: candidates.reduce((sum, image) => sum + (image.size || 0), 0), candidates };
    if (values.report) {
      const target = path.resolve(values.report);
      if (images.some((image) => image.filename === target)) throw new CleanupError('Report path points to an image; choose another path.');
      await fs.writeFile(target, JSON.stringify(report, null, 2) + '\n');
    }
    console.log(`${report.mode}: scanned ${images.length} images; ${candidates.length} unreferenced images older than ${age} hours (${report.candidateBytes} bytes).`);
    for (const image of candidates) console.log(`${image.store}: ${JSON.stringify(image.key)} (${image.size} bytes)`);
    if (values.delete) {
      // A second authoritative query protects references added during scanning.
      const freshReferences = await loadReferences(client, config);
      report.results = await deleteImages(candidates, freshReferences, { s3, bucket, commands });
      if (values.report) await fs.writeFile(values.report, JSON.stringify(report, null, 2) + '\n');
      const failed = report.results.filter((result) => result.result === 'failed').length;
      console.log(`Deleted ${report.results.filter((result) => result.result === 'deleted').length}; failed ${failed}; others skipped or already missing.`);
      if (failed) process.exitCode = 1;
    } else console.log('Dry-run only. Review the results, then rerun with --delete to remove them.');
  } finally {
    await client.end();
    s3?.destroy();
  }
}

module.exports = { addReference, collectReferences, loadReferences, listLocalImages, listR2Images, findUnused, deleteImages, REFERENCE_SQL };
if (require.main === module) main().catch((error) => {
  console.error(error instanceof CleanupError ? error.message : `Cleanup failed (${error.code || error.name || 'Error'}). Check database/storage access, configuration and paths. No further deletions will run.`);
  process.exitCode = 1;
});
