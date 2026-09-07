import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Eye } from 'lucide-react';

const BANNER_BASE = 'https://xn--t60bm44a12c2wap96ap6f.com/resource/images/banner/';

const BANNERS = [
  { id: 1, desktop: `${BANNER_BASE}banner_01.png`, mobile: `${BANNER_BASE}m_benner_01.png` },
  { id: 2, desktop: `${BANNER_BASE}banner_02.png`, mobile: `${BANNER_BASE}m_benner_02.png` },
  { id: 3, desktop: `${BANNER_BASE}banner_03.png`, mobile: `${BANNER_BASE}m_benner_03.png` },
  { id: 4, desktop: `${BANNER_BASE}banner_04.png`, mobile: `${BANNER_BASE}m_benner_04.png` },
];

const TIP_BASE = 'https://xn--t60bm44a12c2wap96ap6f.com/upload/tip/';

const FEATURED_TIPS = [
  {
    id: 1,
    slug: 'why-us',
    thumbnail: `${TIP_BASE}20240321104125_%ED%98%84%EA%B8%88%EB%8B%B9%EC%9D%BC%EC%A7%80%EA%B8%89.png`,
    title: '인터넷가입은 AI인터넷에서!!',
    views: 1129,
    date: '2025-11-07',
  },
  {
    id: 2,
    slug: 'lg-discount',
    thumbnail: `${TIP_BASE}20240320162057_4.png`,
    title: 'LG유플러스 결합할인',
    views: 712,
    date: '2025-11-07',
  },
  {
    id: 3,
    slug: 'kt-discount',
    thumbnail: `${TIP_BASE}20240320162112_%EC%A0%9C%EB%AA%A9%20%EC%97%86%EC%9D%8C-1.png`,
    title: 'KT 결합할인',
    views: 559,
    date: '2025-11-07',
  },
  {
    id: 4,
    slug: 'sk-discount',
    thumbnail: `${TIP_BASE}20240320162119_2.png`,
    title: 'SK브로드밴드 결합할인',
    views: 613,
    date: '2025-11-07',
  },
  {
    id: 5,
    slug: 'new-vs-renewal',
    thumbnail: `${TIP_BASE}20240320162129_3.png`,
    title: '신규가입 VS 재약정',
    views: 743,
    date: '2025-11-07',
  },
];

const ALL_TIPS = [
  {
    id: 1,
    slug: '84',
    thumbnail: `${TIP_BASE}20250703150733_%EC%A0%9C%EB%AA%A9%EC%9D%84-%EC%9E%85%EB%A0%A5%ED%95%B4%EC%A3%BC%EC%84%B8%EC%9A%94_-001%20(52).png`,
    title: 'KT 천만 프로모션이라고 아시나요? KT 인터넷 가입자 1,000만명 돌파 이벤트!',
    views: 314,
    date: '2025-11-07',
  },
];

interface Tip {
  id: string | number;
  slug: string;
  thumbnail: string;
  title: string;
  views: number;
  date: string;
}

interface ManagedTip {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnail: string | null;
  views: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const toTip = (tip: ManagedTip): Tip => ({
  id: tip.id,
  slug: tip.slug,
  thumbnail: tip.thumbnail || '',
  title: tip.title,
  views: tip.views,
  date: (tip.createdAt || tip.updatedAt || '').slice(0, 10),
});

const BANNER_FALLBACK_COLORS = ['#e74c3c', '#2ecc71', '#3498db', '#9b59b6'];
const BANNER_FALLBACK_TEXTS = ['TV + 인터넷 결합할인', '당일 설치 당일 입금!', '꿀TIP으로 통신비 절약'];

function BannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [loadFailed, setLoadFailed] = React.useState<Record<number, boolean>>({});

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(scrollNext, 3000);
    return () => clearInterval(timer);
  }, [emblaApi, scrollNext]);

  return (
    <div className="overflow-hidden rounded-xl" ref={emblaRef}>
      <div className="flex">
        {BANNERS.map((b, idx) => (
          <div key={b.id} className="flex-[0_0_100%] min-w-0">
            <a href="#" data-testid={`link-banner-${b.id}`} className="block">
              {loadFailed[b.id] ? (
                <div
                  className="w-full flex items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: BANNER_FALLBACK_COLORS[idx % BANNER_FALLBACK_COLORS.length],
                    height: '200px',
                  }}
                >
                  <span className="text-white font-black text-2xl md:text-3xl text-center px-4">
                    {BANNER_FALLBACK_TEXTS[idx % BANNER_FALLBACK_TEXTS.length]}
                  </span>
                </div>
              ) : (
                <>
                  <img
                    src={b.desktop}
                    alt={`배너 ${b.id}`}
                    className="hidden md:block w-full h-auto rounded-xl"
                    onError={() => setLoadFailed(prev => ({ ...prev, [b.id]: true }))}
                  />
                  <img
                    src={b.mobile}
                    alt={`배너 ${b.id}`}
                    className="md:hidden w-full h-auto rounded-xl"
                    onError={() => setLoadFailed(prev => ({ ...prev, [b.id]: true }))}
                  />
                </>
              )}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipCard({
  tip,
  testIdPrefix,
}: {
  tip: Tip;
  testIdPrefix: string;
}) {
  const [, setLocation] = useLocation();
  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      data-testid={`card-tip-${testIdPrefix}-${tip.id}`}
      onClick={() => setLocation(`/tip/${tip.slug}`)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={tip.thumbnail}
          alt={tip.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-bold text-sm md:text-base mb-3 line-clamp-2 min-h-[2.5rem]"
          data-testid={`text-tip-title-${tip.id}`}
        >
          {tip.title}
        </h3>
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mt-auto">
          <span className="flex items-center gap-1" data-testid={`text-tip-views-${tip.id}`}>
            <Eye className="w-3 h-3" />
            {tip.views}
          </span>
          <span data-testid={`text-tip-date-${tip.id}`}>{tip.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function TipPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [managedTips, setManagedTips] = React.useState<{ tip: Tip; isFeatured: boolean }[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/tips', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('꿀팁을 불러올 수 없습니다.')))
      .then((tips: ManagedTip[]) => setManagedTips(Array.isArray(tips) ? tips.map((tip) => ({ tip: toTip(tip), isFeatured: tip.isFeatured })) : []))
      .catch((error: unknown) => {
        if ((error as Error).name !== 'AbortError') setManagedTips([]);
      });
    return () => controller.abort();
  }, []);

  const featuredTips = [...managedTips.filter(({ isFeatured }) => isFeatured).map(({ tip }) => tip), ...FEATURED_TIPS];
  const allTips = [...managedTips.filter(({ isFeatured }) => !isFeatured).map(({ tip }) => tip), ...ALL_TIPS];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">

          <div className="mb-12">
            <BannerCarousel />
          </div>

          <div className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              data-testid="text-section-title-featured"
            >
              필수 추천 꿀팁 !
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {featuredTips.map((tip) => (
                <TipCard key={tip.id} tip={tip} testIdPrefix="featured" />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2
              className="text-2xl font-bold mb-6"
              data-testid="text-section-title-all"
            >
              전체 꿀팁
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {allTips.map((tip) => (
                <TipCard key={tip.id} tip={tip} testIdPrefix="all" />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
