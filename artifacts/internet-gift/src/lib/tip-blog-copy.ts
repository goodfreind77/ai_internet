import { isRichContent, sanitizeTipHtml } from '@/components/RichArticle';

// Verified published origin: copied image/link URLs must work outside the preview.
const PUBLISHED_ORIGIN = new URL(
  import.meta.env?.VITE_PUBLIC_SITE_URL || 'https://xn--ai-y14i784ep9k.com',
).origin;

export type BlogCopyTip = {
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
};

export type BlogCopyContent = {
  html: string;
  text: string;
  images: { src: string; alt: string }[];
};

function publicUrl(value: string, slug: string): string | null {
  if (!value.trim()) return null;
  try {
    let url = new URL(value, `${PUBLISHED_ORIGIN}/tip/${encodeURIComponent(slug)}`);
    if (url.origin === window.location.origin) {
      url = new URL(`${url.pathname}${url.search}${url.hash}`, PUBLISHED_ORIGIN);
    }
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function buildTipBlogCopy(tip: BlogCopyTip): BlogCopyContent {
  const body = document.createElement('div');
  if (isRichContent(tip.content)) {
    body.innerHTML = sanitizeTipHtml(tip.content, { allowImages: true });
  } else {
    for (const paragraph of tip.content.split(/\n{2,}/)) {
      const p = document.createElement('p');
      paragraph.split('\n').forEach((line, index) => {
        if (index) p.append(document.createElement('br'));
        p.append(document.createTextNode(line));
      });
      body.append(p);
    }
  }
  body.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const absolute = publicUrl(href, tip.slug);
    if (absolute) link.href = absolute;
  });
  body.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
    const src = publicUrl(image.getAttribute('src') || '', tip.slug);
    if (!src) image.remove();
    else image.src = src;
  });

  const article = document.createElement('article');
  article.style.cssText = 'font-family:Arial,sans-serif;font-size:16px;line-height:1.8;color:#222';
  const title = document.createElement('h1');
  title.textContent = tip.title;
  article.append(title);
  const cover = publicUrl(tip.thumbnail || '', tip.slug);
  if (cover && !Array.from(body.querySelectorAll('img')).some((img) => img.src === cover)) {
    const image = document.createElement('img');
    image.src = cover;
    image.alt = tip.title;
    article.append(image);
  }
  article.append(...Array.from(body.childNodes));
  const images: BlogCopyContent['images'] = [];
  article.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
    image.style.cssText = 'display:block;max-width:100%;height:auto;margin:16px 0';
    if (!images.some((item) => item.src === image.src)) {
      images.push({ src: image.src, alt: image.alt || tip.title });
    }
  });

  const plain = article.cloneNode(true) as HTMLElement;
  plain.querySelectorAll('img').forEach((image) => image.remove());
  plain.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  plain.querySelectorAll('li').forEach((li) => li.prepend('• '));
  plain.querySelectorAll('th,td').forEach((cell) => cell.append('\t'));
  plain.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,tr,blockquote,div,figure').forEach((block) => block.append('\n\n'));
  return {
    html: article.outerHTML,
    text: (plain.textContent || '').replace(/\n{3,}/g, '\n\n').trim(),
    images,
  };
}

export function selectBlogPreview(preview: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(preview);
  const selection = window.getSelection();
  if (!selection) throw new Error('미리보기를 길게 누르거나 마우스로 선택해 복사해 주세요.');
  selection.removeAllRanges();
  selection.addRange(range);
}

export async function copyBlogContent(content: BlogCopyContent, preview: HTMLElement): Promise<void> {
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') throw new Error('Rich clipboard unavailable');
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([content.html], { type: 'text/html' }),
      'text/plain': new Blob([content.text], { type: 'text/plain' }),
    })]);
  } catch {
    selectBlogPreview(preview);
    if (!document.execCommand('copy')) {
      throw new Error('자동 복사가 차단되었습니다. 선택된 미리보기를 Ctrl+C(맥: ⌘C)로 복사하거나 모바일의 복사 메뉴를 이용해 주세요.');
    }
  }
}

export async function copyBlogText(text: string): Promise<void> {
  if (!navigator.clipboard?.writeText) {
    throw new Error('이 브라우저는 텍스트 자동 복사를 지원하지 않습니다. 미리보기 선택 기능을 이용해 주세요.');
  }
  await navigator.clipboard.writeText(text);
}

export async function tipImagePng(src: string): Promise<Blob> {
  const url = new URL(src);
  // Public App Storage is accessible through this workspace too; avoid preview CORS.
  const fetchUrl = url.origin === PUBLISHED_ORIGIN && url.pathname.startsWith('/api/storage/public-objects/')
    ? `${url.pathname}${url.search}` : src;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 30000);
  let blob: Blob;
  try {
    const response = await fetch(fetchUrl, { credentials: 'omit', signal: controller.signal });
    if (!response.ok) throw new Error(`이미지를 불러오지 못했습니다 (${response.status}).`);
    blob = await response.blob();
  } finally {
    window.clearTimeout(timeout);
  }
  if (!blob.type.startsWith('image/') || blob.size > 20 * 1024 * 1024) {
    throw new Error('이미지가 아니거나 20MB를 초과합니다. 미리보기에서 원본 이미지를 확인해 주세요.');
  }
  const objectUrl = URL.createObjectURL(blob);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('이미지를 변환하지 못했습니다.'));
      image.src = objectUrl;
    });
    const scale = Math.min(1, 4096 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('이미지 변환 기능을 사용할 수 없습니다.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      (png) => png ? resolve(png) : reject(new Error('PNG 변환에 실패했습니다.')), 'image/png',
    ));
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function copyTipImage(src: string): Promise<void> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
    throw new Error('이 브라우저는 이미지 복사를 지원하지 않습니다. PNG 저장을 이용해 주세요.');
  }
  // Pass the promise immediately so Safari retains the click's user activation.
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': tipImagePng(src) })]);
}

export async function downloadTipImage(src: string, title: string, index: number): Promise<void> {
  const png = await tipImagePng(src);
  const url = URL.createObjectURL(png);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').slice(0, 70) || '꿀팁'}-${index + 1}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
