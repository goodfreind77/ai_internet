import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE_ORIGIN = "https://xn--t60b460am2elgi85b30e.com";
const SOURCE_HOST = new URL(SOURCE_ORIGIN).hostname;
const CONCURRENCY = 6;
const MAX_ATTEMPTS = 4;
// With permission, the project owner transcribed this entry from its original image.
// Keep this text override repeatable; the source image itself is never bundled.
const AUTHORIZED_TEXT_OVERRIDES: Record<string, string> = {
  "abebebee-65e0-40c9-8f9e-71acbff7cd4c": `<h2>정리 전 네 가지 확인</h2><h3>회선 목록</h3><p>인터넷 방송 전화 확인</p><h3>결합 구조</h3><p>가족 회선과 묶였는지</p><h3>거주 계획</h3><p>계속 살 사람이 있는지</p><h3>납부 수단</h3><p>어느 계좌에서 빠지는지</p><blockquote><p><strong>사망 사유임을 먼저 밝히고 접수하세요</strong></p><p>위약금 면제 여부를 항목별로 확인하세요</p></blockquote>`,
};
const BROKEN_SOURCE_ARTICLE_LINKS = new Set([
  "33ac19e2-e6ed-478c-b07b-49fc8e487fc8",
  "eb44d0d4-d11f-4656-8088-69b4074bfde5",
  "648088a5-56ea-493d-ba4b-c711fcb486e9",
]);
const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const outputPath = path.join(
  workspaceRoot,
  "artifacts/api-server/src/data/source-tips.json",
);

type SourceListTip = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type SourceDetail = SourceListTip & {
  content: string;
};

type BundledTip = {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function requireString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Source tip has missing or empty "${key}".`);
  }
  return value;
}

function normalizeListEntry(value: unknown): SourceListTip {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Source tips list contains an invalid entry.");
  }
  const record = value as Record<string, unknown>;
  return {
    id: requireString(record, "id"),
    title: requireString(record, "title"),
    category: requireString(record, "category"),
    createdAt: requireString(record, "createdAt"),
    updatedAt: requireString(record, "updatedAt"),
  };
}

function removeMediaAndEmbeds(html: string): string {
  return html
    .replace(/<(picture|iframe|video|audio|object|embed)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(?:img|source|embed)\b[^>]*\/?>/gi, "")
    .replace(/<iframe\b[^>]*\/?>/gi, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+style\s*=\s*(["'])[^]*?\1/gi, (attribute) =>
      /url\s*\(/i.test(attribute) ? "" : attribute,
    );
}

function isSourceDomain(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return normalized === SOURCE_HOST || normalized === `www.${SOURCE_HOST}`;
}

function rehomeAndUpdateCtas(html: string): {
  content: string;
  sourceDomainLinks: number;
  remappedPhoneCtas: number;
} {
  let sourceDomainLinks = 0;
  let remappedPhoneCtas = 0;

  let content = html.replace(
    /<a\b[^>]*>[\s\S]*?<\/a\s*>/gi,
    (anchor) => {
      const openingTag = anchor.match(/^<a\b[^>]*>/i)?.[0];
      if (!openingTag) return anchor;

      let updatedOpeningTag = openingTag;
      const hrefMatch = openingTag.match(
        /\bhref\s*=\s*(["'])(.*?)\1/i,
      );
      let href = hrefMatch?.[2].replace(/&amp;/gi, "&");
      let isSiteCta = false;

      if (href && /^tel:/i.test(href)) {
        isSiteCta = true;
        if (href.replace(/\D/g, "") === "15225990") {
          href = "tel:1666-3233";
          remappedPhoneCtas += 1;
        }
      } else if (href && /^(?:https?:)?\/\//i.test(href)) {
        try {
          const url = new URL(href, SOURCE_ORIGIN);
          if (isSourceDomain(url.hostname)) {
            sourceDomainLinks += 1;
            href = `${url.pathname}${url.search}${url.hash}`;
          }
        } catch {
          // Keep non-URL href values unchanged unless they are executable schemes.
          if (/^\s*(?:javascript|data):/i.test(href)) href = "#";
        }
      } else if (href && /^\s*(?:javascript|data):/i.test(href)) {
        href = "#";
      }

      if (href && hrefMatch) {
        updatedOpeningTag = updatedOpeningTag.replace(
          hrefMatch[0],
          `href=${hrefMatch[1]}${href.replace(/&/g, "&amp;")}${hrefMatch[1]}`,
        );
      }

      const body = anchor.slice(openingTag.length, anchor.lastIndexOf("</a"));
      if (/\b(?:consult|join|apply|contact|phone|가입|상담|신청|문의|전화)/i.test(`${openingTag} ${body}`)) {
        isSiteCta = true;
      }

      const updatedBody = isSiteCta
        ? body.replace(/1522(?:[-\s]?5990)/g, "1666-3233")
        : body;

      return `${updatedOpeningTag}${updatedBody}</a>`;
    },
  );

  content = content.replace(
    /(상담은\s*)1522(?:[-\s]?5990)(?=\s*으로\s*문의)/g,
    (_match, prefix: string) => {
      remappedPhoneCtas += 1;
      return `${prefix}1666-3233`;
    },
  );

  return { content, sourceDomainLinks, remappedPhoneCtas };
}

function unwrapKnownBrokenArticleLinks(
  html: string,
): { content: string; unwrappedCounts: Record<string, number> } {
  const unwrappedCounts: Record<string, number> = {};
  const content = html.replace(
    /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a\s*>/gi,
    (anchor, _quote: string, href: string, visibleContent: string) => {
      const target = href.match(/(?:^|\/)tip\/([^/?#]+)/i)?.[1];
      if (!target || !BROKEN_SOURCE_ARTICLE_LINKS.has(target)) return anchor;
      unwrappedCounts[target] = (unwrappedCounts[target] ?? 0) + 1;
      return visibleContent;
    },
  );
  return { content, unwrappedCounts };
}

function hasVisibleText(html: string): boolean {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi, "x")
    .replace(/\s+/g, "")
    .length > 0;
}

async function loadMetadata(): Promise<SourceListTip[]> {
  const metadataArgumentIndex = process.argv.indexOf("--metadata");
  if (metadataArgumentIndex !== -1) {
    const metadataPath = process.argv[metadataArgumentIndex + 1];
    if (!metadataPath) {
      throw new Error("--metadata requires a path to the downloaded source list.");
    }
    const resolvedPath = path.resolve(metadataPath);
    const parsed: unknown = JSON.parse(await readFile(resolvedPath, "utf8"));
    if (!Array.isArray(parsed)) {
      throw new Error(`Metadata file ${resolvedPath} must contain a JSON array.`);
    }
    return parsed.map(normalizeListEntry);
  }

  const response = await fetch(`${SOURCE_ORIGIN}/api/tips`, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Source list request failed with HTTP ${response.status}.`);
  }
  const parsed: unknown = await response.json();
  if (!Array.isArray(parsed)) {
    throw new Error("Source list endpoint did not return a JSON array.");
  }
  return parsed.map(normalizeListEntry);
}

async function fetchDetail(listEntry: SourceListTip): Promise<SourceDetail> {
  let lastError: unknown;
  const url = `${SOURCE_ORIGIN}/api/tips/${encodeURIComponent(listEntry.id)}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const value: unknown = await response.json();
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Detail response is not a JSON object.");
      }
      const record = value as Record<string, unknown>;
      const detail: SourceDetail = {
        id: requireString(record, "id"),
        title: requireString(record, "title"),
        category: listEntry.category,
        content: requireString(record, "content"),
        createdAt: listEntry.createdAt,
        updatedAt: listEntry.updatedAt,
      };

      if (detail.id !== listEntry.id) {
        throw new Error(`Detail id ${detail.id} does not match list id ${listEntry.id}.`);
      }
      if (detail.title !== listEntry.title) {
        throw new Error(`Detail title does not match list title for ${listEntry.id}.`);
      }
      return detail;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
      }
    }
  }

  throw new Error(
    `Failed to acquire tip ${listEntry.id} after ${MAX_ATTEMPTS} attempts: ${String(lastError)}`,
  );
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (true) {
        const index = nextIndex;
        nextIndex += 1;
        if (index >= items.length) return;
        results[index] = await mapper(items[index]);
      }
    }),
  );

  return results;
}

async function main(): Promise<void> {
  const list = await loadMetadata();
  if (list.length !== 179) {
    throw new Error(`Expected 179 source tips, received ${list.length}.`);
  }
  if (new Set(list.map((tip) => tip.id)).size !== list.length) {
    throw new Error("Source list contains duplicate tip ids.");
  }

  let mediaReferencesRemaining = 0;
  let sourceLinksRemaining = 0;
  let mediaOnlyBodiesRetainedAsAltText = 0;
  const authorizedTextOverridesApplied: Record<string, number> = {};
  let totalSourceDomainLinks = 0;
  let totalRemappedPhoneCtas = 0;
  const unwrappedBrokenLinkCounts: Record<string, number> = {};

  const details = await mapWithConcurrency(list, CONCURRENCY, fetchDetail);
  const bundled: BundledTip[] = details.map((detail) => {
    let stripped = removeMediaAndEmbeds(detail.content);
    const authorizedOverride = AUTHORIZED_TEXT_OVERRIDES[detail.id];
    if (authorizedOverride) {
      stripped = authorizedOverride;
      authorizedTextOverridesApplied[detail.id] =
        (authorizedTextOverridesApplied[detail.id] ?? 0) + 1;
    } else if (!hasVisibleText(stripped)) {
      const imageAlt = detail.content.match(
        /<img\b[^>]*\balt\s*=\s*(["'])(.*?)\1/i,
      )?.[2];
      if (imageAlt?.trim()) {
        stripped = `<p>${imageAlt.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`;
        mediaOnlyBodiesRetainedAsAltText += 1;
      }
    }
    const rehomed = rehomeAndUpdateCtas(stripped);
    const unwrapped = unwrapKnownBrokenArticleLinks(rehomed.content);
    for (const [target, count] of Object.entries(unwrapped.unwrappedCounts)) {
      unwrappedBrokenLinkCounts[target] = (unwrappedBrokenLinkCounts[target] ?? 0) + count;
    }
    totalSourceDomainLinks += rehomed.sourceDomainLinks;
    totalRemappedPhoneCtas += rehomed.remappedPhoneCtas;

    if (/<(?:img|picture|source|iframe|video|audio|object|embed)\b/i.test(unwrapped.content)) {
      mediaReferencesRemaining += 1;
    }
    if (new RegExp(SOURCE_HOST.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(unwrapped.content)) {
      sourceLinksRemaining += 1;
    }
    return {
      id: detail.id,
      slug: detail.id,
      title: detail.title,
      category: detail.category,
      content: `<!-- aiinternet-html -->\n${unwrapped.content}`,
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
    };
  });

  if (mediaReferencesRemaining !== 0) {
    throw new Error(`${mediaReferencesRemaining} entries still contain media elements.`);
  }
  if (sourceLinksRemaining !== 0) {
    throw new Error(`${sourceLinksRemaining} entries still reference the source domain.`);
  }
  if (bundled.some((tip) => /\bthumbnail\b|cloudinary\.com/i.test(JSON.stringify(tip)))) {
    throw new Error("Bundled content unexpectedly contains thumbnail/media URLs.");
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(bundled)}\n`, "utf8");

  process.stdout.write(
    JSON.stringify(
      {
        acquired: details.length,
        expected: list.length,
        concurrency: CONCURRENCY,
        retries: MAX_ATTEMPTS,
        outputPath,
        outputBytes: Buffer.byteLength(JSON.stringify(bundled)),
        sourceDomainLinksRehomed: totalSourceDomainLinks,
        sourcePhoneCtasRemapped: totalRemappedPhoneCtas,
        unwrappedBrokenArticleLinks: unwrappedBrokenLinkCounts,
        remainingMediaEntries: mediaReferencesRemaining,
        remainingSourceDomainLinks: sourceLinksRemaining,
        mediaOnlyBodiesRetainedAsAltText,
        authorizedTextOverridesApplied,
        imported: "startup import",
        skipped: "startup import",
      },
      null,
      2,
    ) + "\n",
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`Source tips acquisition failed: ${String(error)}\n`);
  process.exitCode = 1;
});