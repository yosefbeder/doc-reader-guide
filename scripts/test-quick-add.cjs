const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports, require: (name) => { if (!(name in mocks)) throw new Error(`Unexpected import: ${name}`); return mocks[name]; },
    FormData, File, Blob, process: { env: { NEXT_PUBLIC_API_URL: 'https://api.test' } }, ...globals,
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
function actions(kind, respond) {
  const calls = [], paths = [];
  const instance = load(`lib/actions/${kind}Quizzes.ts`, {
    'next/headers': { cookies: async () => ({ get: () => ({ value: 'test-token' }) }) },
    'next/cache': { revalidatePath: (path) => paths.push(path) },
    '@/utils/getNumber': { default: (data, key) => Number(data.get(key)) },
    '@/utils/quickAddImages': helpers,
    '@/utils/parseSubQuestions': { default: () => [] },
    '@/utils/parseOptions': { default: () => ({}) },
    '@/utils/sendAutoNotification': { sendAutoNotification: () => {} },
  }, { fetch: async (url, options) => { calls.push({ url, ...options }); return respond?.(calls.length) ?? { ok: true, json: async () => ({ totalCount: 1 }) }; } });
  const submit = (questions, files = []) => {
    const data = new FormData(); data.set('quiz-id', '7'); data.set('questions', JSON.stringify(questions));
    for (const file of files) data.append('images', file);
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
