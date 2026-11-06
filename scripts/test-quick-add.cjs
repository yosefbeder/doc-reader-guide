const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports, require: (name) => { if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`); return mocks[name]; },
    FormData, File, Blob, Response, Error, process: { env: { NEXT_PUBLIC_API_URL: 'https://api.test' } }, ...globals,
  });
  return exports;
}
const helpers = load('utils/quickAddImages.ts');
const written = (image) => ({ ...(image ? { image } : {}), subQuestions: [{ text: '[Identify] The tissue.', answer: '<p>Liver</p>' }], tapes: [], masks: [] });
const mcq = (image) => ({ ...(image ? { image } : {}), text: 'Identify.', options: ['Liver', 'Kidney'], correctOptionIndex: 0 });
const jpeg = (name = 'figure.jpeg') => new File(['image'], name, { type: 'image/jpeg' });

test('text-only and image schemas remain valid; MCQ URLs are preserved', () => {
  assert.equal(helpers.parseQuickAdd(JSON.stringify([written()]), 'written').length, 1);
  assert.equal(helpers.imageFilenames(helpers.parseQuickAdd(JSON.stringify([mcq('https://image.test/a.jpg')]), 'mcq')).length, 0);
  assert.equal(helpers.imageFilenames([written('figure.jpeg'), written('figure.jpeg')]).length, 1);
});
test('invalid JSON and malformed question schemas are rejected before writes', () => {
  for (const raw of ['bad', '{}', '[]', '[null]', '[1]', '[[]]']) assert.throws(() => helpers.parseQuickAdd(raw, 'written'));
  assert.throws(() => helpers.parseQuickAdd(JSON.stringify([{ subQuestions: [] }]), 'written'));
  assert.throws(() => helpers.parseQuickAdd(JSON.stringify([{ ...mcq(), correctOptionIndex: 3 }]), 'mcq'));
  assert.throws(() => helpers.parseQuickAdd(JSON.stringify([written('../image.jpeg')]), 'written'));
  assert.throws(() => helpers.parseQuickAdd(JSON.stringify([written('https://image.test/a.jpg')]), 'written'));
});
test('folder matches exact names and rejects missing, duplicate, empty and unsupported images', () => {
  const file = jpeg();
  assert.equal(helpers.matchQuestionImages(['figure.jpeg'], [file, jpeg('ignored.jpeg')]).get('figure.jpeg'), file);
  assert.throws(() => helpers.matchQuestionImages(['FIGURE.jpeg'], [file]), /Missing/);
  assert.throws(() => helpers.matchQuestionImages(['figure.jpeg'], [file, jpeg()]), /Duplicate/);
  assert.throws(() => helpers.matchQuestionImages(['figure.jpeg'], [new File([], 'figure.jpeg', { type: 'image/jpeg' })]), /Invalid/);
  assert.throws(() => helpers.matchQuestionImages(['figure.jpeg'], [new File(['bad'], 'figure.jpeg', { type: 'text/plain' })]), /Invalid/);
});
function actions(kind, respond, readUpload) {
  const calls = [], paths = [];
  const fetchMock = async (url, options) => {
    if (url.startsWith('https://images.test/')) return readUpload(url, options);
    calls.push({ url, ...options });
    return respond?.(calls.length) ?? { ok: true, json: async () => ({ totalCount: 1 }) };
  };
  const resolver = load('lib/resolveWrittenImages.ts', { '@/utils/quickAddImages': helpers }, {
    fetch: fetchMock,
    process: { env: { NEXT_PUBLIC_R2_URL: 'https://images.test' } },
  }).default;
  const instance = load(`lib/actions/${kind}Quizzes.ts`, {
    'next/headers': { cookies: async () => ({ get: () => ({ value: 'test-token' }) }) },
    'next/cache': { revalidatePath: (path) => paths.push(path) },
    '@/utils/getNumber': { default: (data, key) => Number(data.get(key)) },
    '@/utils/quickAddImages': helpers,
    '@/lib/resolveWrittenImages': { default: resolver },
    '@/utils/parseSubQuestions': { default: () => [] },
    '@/utils/parseOptions': { default: () => ({}) },
    '@/utils/sendAutoNotification': { sendAutoNotification: () => {} },
  }, { fetch: fetchMock });
  const submit = (questions, files = [], uploads) => {
    const data = new FormData(); data.set('quiz-id', '7'); data.set('questions', JSON.stringify(questions));
    for (const file of files) data.append('images', file);
    if (uploads) data.set('uploaded-images', JSON.stringify(uploads));
    return instance.quickAdd({}, data);
  };
  return { submit, calls, paths };
}
test('written import forwards actual files and dimensions as multipart', async () => {
  const { submit, calls, paths } = actions('written');
  const result = await submit([{ ...written('figure.jpeg'), width: 640, height: 480 }], [jpeg()]);
  assert.equal(result.type, 'success');
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.get('image').name, 'figure.jpeg');
  assert.equal(calls[0].body.get('width'), '640');
  assert.match(calls[0].body.get('subQuestions'), /Liver/);
  assert.ok(paths.includes('/written-quizzes/7/update'));
});
test('missing image or dimensions prevents every written write', async () => {
  for (const [questions, files] of [
    [[written(), { ...written('missing.jpeg'), width: 5, height: 5 }], []],
    [[written('figure.jpeg')], [jpeg()]],
  ]) {
    const { submit, calls } = actions('written');
    assert.equal((await submit(questions, files)).type, 'fail');
    assert.equal(calls.length, 0);
  }
});
test('MCQ import forwards resolved URLs and invalidates MCQ quiz paths', async () => {
  const { submit, calls, paths } = actions('mcq');
  assert.equal((await submit([mcq('https://images.test/a.jpeg')])).type, 'success');
  assert.equal(JSON.parse(calls[0].body)[0].image, 'https://images.test/a.jpeg');
  assert.ok(paths.includes('/mcq-quizzes/7/update'));
  assert.ok(!paths.some((path) => path.includes('written')));
});
test('unresolved MCQ filenames are rejected on the server', async () => {
  const { submit, calls } = actions('mcq');
  assert.equal((await submit([mcq('figure.jpeg')])).type, 'fail');
  assert.equal(calls.length, 0);
});
test('partial written failure reports added count and warns against duplicate retries', async () => {
  const { submit } = actions('written', (count) => ({ ok: count === 1 }));
  const result = await submit([written(), written()]);
  assert.equal(result.type, 'fail');
  assert.match(result.message, /Added 1 group\(s\), 1 failed/);
  assert.match(result.message, /avoid duplicates/);
});

const stagedUrl = 'https://images.test/question-images/00000000-0000-4000-8000-000000000001.jpeg';
test('staged written images reach the question API without being sent in the browser form', async () => {
  let downloads = 0;
  const { submit, calls } = actions('written', undefined, (url, options) => {
    downloads++;
    assert.equal(url, stagedUrl);
    assert.equal(options.redirect, 'error');
    return new Response(new Uint8Array(2 * 1024 * 1024), { headers: { 'content-type': 'image/jpeg' } });
  });
  const result = await submit([{ ...written('figure.jpeg'), width: 640, height: 480 }], [], { 'figure.jpeg': stagedUrl });
  assert.equal(result.type, 'success');
  assert.equal(downloads, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body.get('image').size, 2 * 1024 * 1024);
  assert.equal(calls[0].body.get('image').name, 'figure.jpeg');
});
test('untrusted staged URLs are rejected before any download or question write', async () => {
  for (const url of ['https://evil.test/a.jpeg', stagedUrl + '?redirect=evil', stagedUrl + '/../secret', stagedUrl.replace('/question-images/', '/other/')]) {
    const { submit, calls } = actions('written', undefined, () => { throw new Error('Must not fetch'); });
    const result = await submit([{ ...written('figure.jpeg'), width: 640, height: 480 }], [], { 'figure.jpeg': url });
    assert.equal(result.type, 'fail');
    assert.match(result.message, /invalid upload/);
    assert.equal(calls.length, 0);
  }
});
test('unavailable or invalid staged images prevent question writes', async () => {
  for (const response of [new Response('Missing', { status: 404 }), new Response('HTML', { headers: { 'content-type': 'text/html' } }), new Response('', { headers: { 'content-type': 'image/jpeg' } })]) {
    const { submit, calls } = actions('written', undefined, () => response);
    const result = await submit([{ ...written('figure.jpeg'), width: 640, height: 480 }], [], { 'figure.jpeg': stagedUrl });
    assert.equal(result.type, 'fail');
    assert.equal(calls.length, 0);
  }
});
test('staged image downloads enforce the total size limit', async () => {
  const { submit, calls } = actions('written', undefined, () => new Response(new Uint8Array(helpers.MAX_QUICK_ADD_BYTES + 1), { headers: { 'content-type': 'image/jpeg' } }));
  const result = await submit([{ ...written('figure.jpeg'), width: 640, height: 480 }], [], { 'figure.jpeg': stagedUrl });
  assert.equal(result.type, 'fail');
  assert.match(result.message, /exceeds 45 MB/);
  assert.equal(calls.length, 0);
});

test('both browser forms send metadata only after direct image uploads', async () => {
  for (const kind of ['written', 'mcq']) {
    const file = new File([new Uint8Array(2 * 1024 * 1024)], 'figure.jpeg', { type: 'image/jpeg' });
    const raw = JSON.stringify([kind === 'written' ? written('figure.jpeg') : mcq('figure.jpeg')]);
    let hook = 0, clientAction, submitted, uploaded = 0;
    const Form = load('components/QuickAddQuestionsForm.tsx', {
      react: {
        useId: () => 'test',
        useState: (initial) => {
          const index = hook++;
          return [index === 0 ? raw : index === 1 ? [file] : typeof initial === 'function' ? initial() : initial, () => {}];
        },
        useActionState: (action) => { clientAction = action; return [{}, action, false]; },
      },
      'react/jsx-runtime': { jsx: () => null, jsxs: () => null },
      '@/components/ButtonSubmit': { default: () => null },
      '@/components/Checkbox': { default: () => null },
      '@/components/Message': { default: () => null },
      '@/utils/quickAddImages': helpers,
    }, {
      Image: class { naturalWidth = 640; naturalHeight = 480; set src(value) { this.onload(); } },
      URL, URLSearchParams, crypto: require('node:crypto').webcrypto,
      fetch: async (url, options) => {
        if (url.startsWith('/api/r2/presigned-url?')) return Response.json({ signedUrl: 'https://storage.test/upload', publicUrl: stagedUrl });
        assert.equal(url, 'https://storage.test/upload');
        assert.equal(options.method, 'PUT');
        assert.equal(options.body, file);
        uploaded++;
        return new Response(null, { status: 200 });
      },
    }).default;
    Form({ quizId: 7, kind, action: async (_, data) => { submitted = data; return { type: 'success' }; } });
    const data = new FormData(); data.set('questions', raw); data.set('quiz-id', '7');
    const result = await clientAction({}, data);
    assert.equal(result.type, 'success', result.message);
    assert.equal(uploaded, 1);
    assert.equal(submitted.getAll('images').length, 0);
    assert.ok([...submitted.values()].every((value) => typeof value === 'string'));
    assert.ok(new Blob([...submitted.values()]).size < 1024);
    const question = JSON.parse(submitted.get('questions'))[0];
    if (kind === 'written') {
      assert.equal(question.image, 'figure.jpeg');
      assert.equal(question.width, 640);
      assert.equal(JSON.parse(submitted.get('uploaded-images'))['figure.jpeg'], stagedUrl);
    } else assert.equal(question.image, stagedUrl);
  }
});
