import { useState } from 'react';
import savings from '@/assets/tips-savings.jpg';
import devices from '@/assets/tips-devices.jpg';
import guides from '@/assets/tips-guides.jpg';
import news from '@/assets/tips-news.jpg';

export const TIP_CATEGORIES = ['요금할인', '꼭 읽어보기', '최신기기', '새로운소식'] as const;

const COVERS: Record<string, string> = {
  '요금할인': savings,
  '최신기기': devices,
  '꼭 읽어보기': guides,
  '새로운소식': news,
};

export function coverFor(category?: string) {
  return COVERS[category || ''] || guides;
}

interface TipCoverProps {
  category?: string;
  title: string;
  caption?: string;
  thumbnail?: string | null;
  variant?: 'card' | 'hero';
  testId?: string;
}

export function TipCover({ category, title, caption, thumbnail, variant = 'card', testId }: TipCoverProps) {
  const [failed, setFailed] = useState(false);
  const hero = variant === 'hero';
  const custom = thumbnail && !failed ? thumbnail : null;
  return (
    <div
      className={`relative w-full overflow-hidden bg-muted ${hero ? 'aspect-[16/9] sm:aspect-[2/1] rounded-lg' : 'aspect-square'}`}
      data-testid={testId}
    >
      <img
        src={custom || coverFor(category)}
        alt=""
        onError={() => setFailed(true)}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {!custom && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
          <div className={`absolute inset-0 flex flex-col justify-between ${hero ? 'p-5 md:p-8' : 'p-3'}`}>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5 rounded">AI인터넷</span>
              {category && <span className="text-white/90 text-[11px] font-medium">{category}</span>}
            </div>
            <div className="min-w-0">
              <p className={`text-white font-bold leading-snug break-keep line-clamp-3 ${hero ? 'text-xl md:text-3xl' : 'text-sm'}`}>{title}</p>
              {caption && <p className={`text-white/80 mt-1 line-clamp-1 ${hero ? 'text-sm' : 'text-[11px]'}`}>{caption}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
