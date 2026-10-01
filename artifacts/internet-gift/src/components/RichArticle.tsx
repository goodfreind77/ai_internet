import { useMemo } from 'react';
import DOMPurify from 'dompurify';

export const RICH_MARKER = '<!-- aiinternet-html -->';
export const isRichContent = (content: string) => content.startsWith(RICH_MARKER);

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 's',
  'ul', 'ol', 'li', 'blockquote', 'a', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'colgroup', 'col', 'sup', 'sub', 'small', 'mark', 'figure', 'figcaption', 'dl', 'dt', 'dd',
];

let hooked = false;
function ensureHook() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      if (node.hasAttribute('href')) {
        node.setAttribute('rel', 'noopener noreferrer nofollow');
        const href = node.getAttribute('href') || '';
        if (/^https?:/i.test(href)) node.setAttribute('target', '_blank');
        else node.removeAttribute('target');
      }
    }
  });
}

export function sanitizeTipHtml(html: string): string {
  ensureHook();
  return DOMPurify.sanitize(html.slice(RICH_MARKER.length), {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'colspan', 'rowspan', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ALLOWED_URI_REGEXP: /^(?:https?:|tel:|\/(?!\/)|#)/i,
    FORBID_TAGS: ['img', 'picture', 'source', 'iframe', 'script', 'style', 'svg', 'video', 'audio', 'object', 'embed', 'form', 'input', 'link', 'meta'],
    FORBID_ATTR: ['style', 'srcset', 'src', 'class', 'id'],
  });
}

export function RichArticle({ content }: { content: string }) {
  const html = useMemo(() => sanitizeTipHtml(content), [content]);
  return <div className="tip-rich" data-testid="text-tip-detail-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
