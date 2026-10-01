import { useEffect, useState } from 'react';
import savings from '@/assets/tips-savings.jpg';
import devices from '@/assets/tips-devices.jpg';
import guides from '@/assets/tips-guides.jpg';
import news from '@/assets/tips-news.jpg';
import articleCoverManifest from '@/lib/article-cover-manifest.json';

export const TIP_CATEGORIES = ['요금할인', '꼭 읽어보기', '최신기기', '새로운소식'] as const;

const COVERS: Record<string, string> = {
  '요금할인': savings,
  '최신기기': devices,
  '꼭 읽어보기': guides,
  '새로운소식': news,
};

const ARTICLE_COVERS = articleCoverManifest as Record<string, string>;

export function coverFor(category?: string) {
  return COVERS[category || ''] || guides;
}

interface TipCoverProps {
  category?: string;
  title: string;
  slug?: string;
  caption?: string;
  thumbnail?: string | null;
  variant?: 'card' | 'hero';
  testId?: string;
}

export function TipCover({ category, title, slug, caption, thumbnail, variant = 'card', testId }: TipCoverProps) {
  const generatedCover = slug ? ARTICLE_COVERS[slug] : undefined;
  const categoryCover = coverFor(category);
  const candidates = [thumbnail || undefined, generatedCover, categoryCover]
    .filter((source): source is string => Boolean(source))
    .filter((source, index, sources) => sources.indexOf(source) === index);
  const inputKey = `${slug || ''}|${category || ''}|${thumbnail || ''}`;
  const [failureState, setFailureState] = useState<{ inputKey: string; sources: string[] }>({ inputKey, sources: [] });
  const failedSources = failureState.inputKey === inputKey ? failureState.sources : [];
  useEffect(() => {
    setFailureState({ inputKey, sources: [] });
  }, [inputKey]);

  const source = candidates.find((candidate) => !failedSources.includes(candidate));
  const sourceIsGenerated = Boolean(generatedCover && source === generatedCover);
  const sourceIsCustom = Boolean(thumbnail && source === thumbnail && !sourceIsGenerated);
  const hero = variant === 'hero';
  return (
    <div
      className={`relative w-full overflow-hidden bg-muted ${hero ? 'aspect-[16/9] sm:aspect-[2/1] rounded-lg' : 'aspect-square'}`}
      data-testid={testId}
    >
      {source && (
        <img
          src={source}
          alt={`${title} 관련 이미지`}
          onError={() => setFailureState((current) => ({
            inputKey,
            sources: [...(current.inputKey === inputKey ? current.sources : []), source],
          }))}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {!sourceIsCustom && (
        <>
          <div className={`absolute inset-0 ${sourceIsGenerated ? 'bg-gradient-to-t from-black/35 via-transparent to-black/10' : 'bg-gradient-to-t from-black/75 via-black/25 to-black/5'}`} />
          <div className={`absolute inset-0 flex flex-col justify-between ${hero ? 'p-5 md:p-8' : 'p-3'}`}>
            <div className="flex items-center gap-2">
              <span className={`bg-primary text-primary-foreground font-bold rounded ${sourceIsGenerated ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'}`}>AI인터넷</span>
              {category && <span className={`text-white/90 font-medium ${sourceIsGenerated ? 'text-[10px]' : 'text-[11px]'}`}>{category}</span>}
            </div>
            {(!sourceIsGenerated || hero) && (
              <div className="min-w-0">
                <p className={`text-white font-bold leading-snug break-keep line-clamp-3 ${hero ? (sourceIsGenerated ? 'text-base md:text-xl' : 'text-xl md:text-3xl') : 'text-sm'}`}>{title}</p>
                {caption && <p className={`text-white/80 mt-1 line-clamp-1 ${hero ? 'text-sm' : 'text-[11px]'}`}>{caption}</p>}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
