const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const cleanup = require('./cleanup-unused-images.cjs');

const config = { r2Url: 'https://assets.test/bucket', staticUrl: 'https://static.test' };
const old = '2020-01-01T00:00:00.000Z';
const commands = Object.fromEntries(['ListObjectsV2Command', 'HeadObjectCommand', 'DeleteObjectCommand'].map((name) => [name, class { constructor(input) { this.input = input; this.kind = name; } }]));

test('collects MCQ URLs, written filenames, nested HTML answers, lecture notes and attachments', () => {
  const refs = cleanup.collectReferences([
    { data: { image: 'https://assets.test/bucket/question-images/a%20b.jpeg?x=1' } },
    { data: { image: 'written.jpeg', subQuestions: [{ answer: '<p><img src="/image/answer%20image.png"></p>' }] } },
    { data: { note: '<img srcset="https://static.test/image/small.png 1x, https://static.test/image/big.png 2x">' } },
    { data: { urls: ['https://assets.test/bucket/attachment.jpg'] } },
    { data: { note: '<div style="background-image:url(/image/background.png)"></div>' } },
  ], config);
  for (const key of ['written.jpeg', 'answer image.png', 'small.png', 'big.png', 'background.png']) assert.ok(refs.local.has(key), key);
  for (const key of ['question-images/a b.jpeg', 'question-images/a%20b.jpeg', 'attachment.jpg']) assert.ok(refs.r2.has(key), key);
});

test('external images with matching filenames do not protect unrelated local files', () => {
  const refs = cleanup.collectReferences([{ data: { image: 'https://other.test/image/orphan.png' } }], config);
  assert.equal(refs.local.size, 0);
  assert.equal(refs.r2.size, 0);
});

test('a failed database reference scan aborts instead of returning an empty reference set', async () => {
  await assert.rejects(cleanup.loadReferences({ query: async () => { throw new Error('Permission denied'); } }, config), /Permission denied/);
  const refs = await cleanup.loadReferences({ query: async (sql) => {
    assert.match(sql, /FROM "Question"/);
    assert.match(sql, /FROM "WrittenQuestion"/);
    assert.match(sql, /FROM "SubQuestion"/);
    assert.match(sql, /FROM "Lecture"/);
    return { rows: [{ data: { image: 'keep.jpeg' } }] };
  } }, config);
  assert.ok(refs.local.has('keep.jpeg'));
});

test('only old, unreferenced images qualify; unknown dates remain untouched', () => {
  const refs = { local: new Set(['keep.jpg']), r2: new Set(['question-images/keep.jpg']) };
  const candidates = cleanup.findUnused([
    { store: 'local', key: 'keep.jpg', modified: old },
    { store: 'r2', key: 'question-images/keep.jpg', modified: old },
    { store: 'local', key: 'orphan.jpg', modified: old },
    { store: 'r2', key: 'new.jpg', modified: '2030-01-01T00:00:00Z' },
    { store: 'r2', key: 'unknown.jpg', modified: 'invalid' },
  ], refs, Date.parse('2025-01-01T00:00:00Z'));
  assert.deepEqual(candidates.map((image) => image.key), ['orphan.jpg']);
});

test('local cleanup skips symlinks and non-images; dry-run does not remove files', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'image-cleanup-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.mkdir(path.join(root, 'nested'));
  for (const name of ['keep.jpg', 'orphan.png', 'nested/other.gif', 'document.pdf']) {
    await fs.writeFile(path.join(root, name), 'fixture');
    await fs.utimes(path.join(root, name), new Date(old), new Date(old));
  }
  await fs.symlink(path.join(root, 'keep.jpg'), path.join(root, 'link.jpg'));
  const images = await cleanup.listLocalImages(root);
  assert.deepEqual(images.map((image) => image.key).sort(), ['keep.jpg', 'nested/other.gif', 'orphan.png']);
  const refs = { local: new Set(['keep.jpg']), r2: new Set() };
  const candidates = cleanup.findUnused(images, refs, Date.now());
  assert.equal(candidates.length, 2);
  await fs.access(path.join(root, 'orphan.png'));
  // A reference created after the initial scan must still protect its image.
  refs.local.add('nested/other.gif');
  const results = await cleanup.deleteImages(candidates, refs, {});
  assert.equal(results.find((image) => image.key === 'orphan.png').result, 'deleted');
  assert.equal(results.find((image) => image.key === 'nested/other.gif').result, 'skipped-new-reference');
  await assert.rejects(fs.access(path.join(root, 'orphan.png')), { code: 'ENOENT' });
  for (const name of ['keep.jpg', 'nested/other.gif', 'document.pdf']) await fs.access(path.join(root, name));
});

test('local files changed after scanning are not deleted', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'image-cleanup-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, 'changed.jpg'), 'before');
  const images = await cleanup.listLocalImages(root);
  await fs.writeFile(path.join(root, 'changed.jpg'), 'different content');
  const results = await cleanup.deleteImages(images, { local: new Set(), r2: new Set() }, {});
  assert.equal(results[0].result, 'skipped-changed');
  await fs.access(path.join(root, 'changed.jpg'));
});

test('R2 listing follows every page and restricts the configured prefix', async () => {
  let count = 0;
  const s3 = { send: async (command) => {
    assert.equal(command.input.Prefix, 'question-images/');
    count++;
    if (count === 1) return { Contents: [{ Key: 'question-images/one.jpg', Size: 5, ETag: 'a', LastModified: new Date(old) }], IsTruncated: true, NextContinuationToken: 'next' };
    assert.equal(command.input.ContinuationToken, 'next');
    return { Contents: [{ Key: 'question-images/two.jpeg', Size: 10, ETag: 'b', LastModified: new Date(old) }, { Key: 'question-images/notes.pdf', LastModified: new Date(old) }], IsTruncated: false };
  } };
  const images = await cleanup.listR2Images(s3, 'drg', 'question-images/', commands);
  assert.equal(count, 2);
  assert.equal(images.length, 2);
  await assert.rejects(cleanup.listR2Images({ send: async () => ({ IsTruncated: true }) }, 'drg', '', commands), /Incomplete/);
});

test('R2 deletion rechecks metadata and reports provider failures', async () => {
  const deleted = [];
  const s3 = { send: async (command) => {
    if (command.kind === 'HeadObjectCommand') return { ETag: command.input.Key === 'changed.jpg' ? 'changed' : 'original', ContentLength: 5, LastModified: new Date(old) };
    if (command.input.Key === 'failed.jpg') throw Object.assign(new Error('Denied'), { name: 'AccessDenied' });
    deleted.push(command.input.Key);
    return {};
  } };
  const images = ['orphan.jpg', 'changed.jpg', 'failed.jpg', 'keep.jpg'].map((key) => ({ store: 'r2', key, size: 5, modified: old, etag: 'original' }));
  const results = await cleanup.deleteImages(images, { local: new Set(), r2: new Set(['keep.jpg']) }, { s3, bucket: 'drg', commands });
  assert.deepEqual(deleted, ['orphan.jpg']);
  assert.deepEqual(results.map((image) => image.result), ['deleted', 'skipped-changed', 'failed', 'skipped-new-reference']);
});

test('CLI accepts explicit dry-run and rejects conflicting deletion flags before connecting', () => {
  const { spawnSync } = require('node:child_process');
  const script = path.join(__dirname, 'cleanup-unused-images.cjs');
  const accepted = spawnSync(process.execPath, [script, '--dry-run'], { encoding: 'utf8' });
  assert.equal(accepted.status, 1);
  assert.match(accepted.stderr, /Select --r2 and\/or --images-dir/);
  const conflict = spawnSync(process.execPath, [script, '--r2', '--dry-run', '--delete'], { encoding: 'utf8' });
  assert.equal(conflict.status, 1);
  assert.match(conflict.stderr, /Use either --dry-run or --delete, not both/);
});
