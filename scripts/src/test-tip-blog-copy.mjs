import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'tip-blog-copy-'));
execFileSync('pnpm', [
  '--filter', '@workspace/api-server', 'exec', 'esbuild',
  join(root, 'artifacts/internet-gift/src/lib/tip-blog-copy.ts'),
  '--bundle', '--platform=node', '--format=esm',
  `--alias:@=${join(root, 'artifacts/internet-gift/src')}`,
  `--outfile=${join(temp, 'copy.mjs')}`,
], { cwd: root, stdio: 'pipe' });
const dom = new JSDOM('', { url: 'https://preview.replit.dev/admin' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
const copy = await import(pathToFileURL(join(temp, 'copy.mjs')).href);
const marker = '<!-- aiinternet-html -->';
const tip = {
  title: '테스트 <제목>',
  slug: 'sample',
  thumbnail: '/api/storage/public-objects/tip-covers/sample.webp',
  content: `${marker}<p>첫 문단 <strong>굵게</strong></p><h3>소제목</h3><ul><li>목록</li></ul><a href="/tip/other">관련 글</a>`,
};
after(() => { dom.window.close(); rmSync(temp, { recursive: true, force: true }); });

test('rich export preserves text, title, headings, lists and stable image/link URLs', () => {
  const result = copy.buildTipBlogCopy(tip);
  const doc = new JSDOM(result.html).window.document;
  assert.equal(doc.querySelector('h1').textContent, tip.title);
  assert.equal(doc.querySelector('strong').textContent, '굵게');
  assert.equal(doc.querySelector('h3').textContent, '소제목');
  assert.equal(doc.querySelector('li').textContent, '목록');
  assert.equal(doc.querySelector('a').href, 'https://xn--ai-y14i784ep9k.com/tip/other');
  assert.equal(result.images.length, 1);
  assert.match(result.images[0].src, /^https:\/\/xn--ai-y14i784ep9k.com\/api\/storage/);
  assert.ok(result.text.includes('첫 문단 굵게'));
  assert.ok(result.text.includes('• 목록'));
  assert.ok(!result.text.includes(marker));
});

test('unsafe tags, event handlers and image URL schemes are excluded', () => {
  const result = copy.buildTipBlogCopy({
    ...tip, thumbnail: 'javascript:alert(1)',
    content: `${marker}<script>alert(1)</script><iframe src="https://bad.example"></iframe><p onclick="alert(1)">정상</p><img src="javascript:alert(1)" onerror="alert(1)"><img src="data:image/png;base64,AAA">`,
  });
  assert.equal(result.images.length, 0);
  assert.ok(!/script|iframe|onclick|onerror|javascript:|data:image/i.test(result.html));
  assert.ok(result.text.includes('정상'));
});

test('inline images retain order, omit duplicate cover and rewrite preview URLs', () => {
  const result = copy.buildTipBlogCopy({
    ...tip, thumbnail: 'https://preview.replit.dev/api/storage/public-objects/cover.webp',
    content: `${marker}<p>앞</p><img src="/api/storage/public-objects/cover.webp" alt="표지"><p>중간</p><img src="https://images.example/test.png" alt="두 번째"><p>뒤</p>`,
  });
  assert.equal(result.images.length, 2);
  assert.equal((result.html.match(/<img /g) || []).length, 2);
  assert.equal(result.images[0].alt, '표지');
  assert.ok(!result.html.includes('preview.replit.dev'));
  assert.ok(result.html.indexOf('앞') < result.html.indexOf('<img '));
});

test('plain content stays literal, keeps line breaks and supports no image', () => {
  const result = copy.buildTipBlogCopy({ ...tip, thumbnail: '', content: '첫 줄\n둘째 줄\n\n<script>글자 그대로</script>' });
  assert.equal(result.images.length, 0);
  assert.match(result.html, /첫 줄<br>둘째 줄/);
  assert.ok(result.html.includes('&lt;script&gt;'));
  assert.ok(result.text.includes('<script>글자 그대로</script>'));
});

test('all 179 imported articles retain their complete article text', () => {
  const tips = JSON.parse(readFileSync(join(root, 'artifacts/api-server/src/data/source-tips.json'), 'utf8'));
  assert.equal(tips.length, 179);
  for (const source of tips) {
    const result = copy.buildTipBlogCopy(source);
    const sourceDoc = new dom.window.DOMParser().parseFromString(source.content.slice(marker.length), 'text/html');
    const expected = sourceDoc.body.textContent.replace(/\s/g, '');
    const exportedDoc = new dom.window.DOMParser().parseFromString(result.html, 'text/html');
    assert.ok(exportedDoc.body.textContent.replace(/\s/g, '').includes(expected), source.slug);
    assert.ok(!result.html.includes(marker));
  }
});

test('rich clipboard includes HTML and plain text; text-only copy is exact', async () => {
  let items;
  let text;
  globalThis.ClipboardItem = class { constructor(data) { this.data = data; } };
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    write: async (value) => { items = value; },
    writeText: async (value) => { text = value; },
  } });
  const result = copy.buildTipBlogCopy(tip);
  await copy.copyBlogContent(result, document.createElement('div'));
  assert.equal(await items[0].data['text/html'].text(), result.html);
  assert.equal(await items[0].data['text/plain'].text(), result.text);
  await copy.copyBlogText(tip.title);
  assert.equal(text, tip.title);
});

test('denied clipboard uses selected preview; blocked fallback reports failure', async () => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    write: async () => { throw new Error('denied'); },
  } });
  const preview = document.createElement('div');
  preview.textContent = '수동 복사';
  document.body.append(preview);
  document.execCommand = (command) => command === 'copy';
  await copy.copyBlogContent(copy.buildTipBlogCopy(tip), preview);
  assert.equal(window.getSelection().toString(), '수동 복사');
  document.execCommand = () => false;
  await assert.rejects(() => copy.copyBlogContent(copy.buildTipBlogCopy(tip), preview), /자동 복사가 차단/);
  preview.remove();
});

test('image copy converts to PNG using the same-origin public image route', async () => {
  let requested;
  let clipboard;
  globalThis.fetch = async (url) => {
    requested = url;
    return new Response(new Uint8Array([1, 2, 3]), { headers: { 'Content-Type': 'image/webp' } });
  };
  globalThis.Image = class {
    naturalWidth = 1000;
    naturalHeight = 600;
    set src(value) { queueMicrotask(() => this.onload()); }
  };
  dom.window.HTMLCanvasElement.prototype.getContext = () => ({ drawImage() {} });
  dom.window.HTMLCanvasElement.prototype.toBlob = function (callback, type) {
    assert.equal(this.width, 1000);
    assert.equal(type, 'image/png');
    callback(new Blob(['png'], { type }));
  };
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    write: async (items) => { clipboard = await items[0].data['image/png']; },
  } });
  await copy.copyTipImage('https://xn--ai-y14i784ep9k.com/api/storage/public-objects/cover.webp?v=abc');
  assert.equal(requested, '/api/storage/public-objects/cover.webp?v=abc');
  assert.equal(clipboard.type, 'image/png');
});

test('missing image clipboard support reports the PNG download alternative', async () => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  await assert.rejects(() => copy.copyTipImage('https://example.com/image.png'), /PNG 저장/);
});
