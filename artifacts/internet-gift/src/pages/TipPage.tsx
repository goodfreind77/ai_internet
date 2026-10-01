import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { TipCover, TIP_CATEGORIES } from '@/components/TipCover';
import savings from '@/assets/tips-savings.jpg';
import devices from '@/assets/tips-devices.jpg';
import guides from '@/assets/tips-guides.jpg';
import news from '@/assets/tips-news.jpg';
import { Eye, Search } from 'lucide-react';

const PAGE_SIZE = 20;

function dedup(list: Tip[]): Tip[] {
  const seen = new Set<string>();
  return list.filter((t) => (seen.has(t.slug) ? false : (seen.add(t.slug), true)));
}

interface LegacyTip { id: number; slug: string; category: string; title: string; views: number; date: string; }

const FEATURED_TIPS: LegacyTip[] = [
  { id: 1, slug: 'why-us', category: '꼭 읽어보기', title: '인터넷가입은 AI인터넷에서!!', views: 1129, date: '2025-11-07' },
  { id: 2, slug: 'lg-discount', category: '요금할인', title: 'LG유플러스 결합할인', views: 712, date: '2025-11-07' },
  { id: 3, slug: 'kt-discount', category: '요금할인', title: 'KT 결합할인', views: 559, date: '2025-11-07' },
  { id: 4, slug: 'sk-discount', category: '요금할인', title: 'SK브로드밴드 결합할인', views: 613, date: '2025-11-07' },
  { id: 5, slug: 'new-vs-renewal', category: '꼭 읽어보기', title: '신규가입 VS 재약정', views: 743, date: '2025-11-07' },
];

const ALL_TIPS: LegacyTip[] = [
  { id: 101, slug: '84', category: '새로운소식', title: 'KT 천만 프로모션이라고 아시나요? KT 인터넷 가입자 1,000만명 돌파 이벤트!', views: 314, date: '2025-11-07' },
];

interface Tip {
  id: string | number;
  slug: string;
  category: string;
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
  category: tip.category,
  thumbnail: tip.thumbnail || '',
  title: tip.title,
  views: tip.views,
  date: (tip.createdAt || tip.updatedAt || '').slice(0, 10),
});

function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl h-[160px] md:h-[220px]" data-testid="banner-tips">
      <div className="absolute inset-0 grid grid-cols-4">
        {[savings, devices, guides, news].map((src, i) => (
          <img key={i} src={src} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white">
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded w-fit mb-3">AI인터넷</span>
        <p className="text-xl md:text-3xl font-black break-keep">가입 전에 읽는 요금 · 장비 · 약정 가이드</p>
        <p className="text-sm md:text-base text-white/85 mt-2 break-keep">고지서와 계약서를 이해하는 데 필요한 정보만 모았습니다.</p>
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
      <TipCover category={tip.category} title={tip.title} thumbnail={tip.thumbnail} />
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

  const [category, setCategory] = React.useState('전체');
  const [query, setQuery] = React.useState('');
  const [visible, setVisible] = React.useState(PAGE_SIZE);
  useEffect(() => { setVisible(PAGE_SIZE); }, [category, query]);

  const toLegacy = (t: LegacyTip): Tip => ({ ...t, thumbnail: '' });
  const featuredTips = dedup([...managedTips.filter(({ isFeatured }) => isFeatured).map(({ tip }) => tip), ...FEATURED_TIPS.map(toLegacy)]);
  const featuredSlugs = new Set(featuredTips.map((t) => t.slug));
  const allTips = dedup([...managedTips.filter(({ isFeatured }) => !isFeatured).map(({ tip }) => tip), ...ALL_TIPS.map(toLegacy)]).filter((t) => !featuredSlugs.has(t.slug));
  const q = query.trim().toLowerCase();
  const filtered = allTips.filter((t) => (category === '전체' || t.category === category) && (!q || t.title.toLowerCase().includes(q)));
  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">

          <div className="mb-12">
            <HeroBanner />
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
                <TipCard key={tip.slug} tip={tip} testIdPrefix="featured" />
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
            <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
              <div className="flex flex-wrap gap-2 flex-1">
                {['전체', ...TIP_CATEGORIES].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    data-testid={`button-category-${c}`}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${category === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-white text-foreground border-border hover:bg-muted'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="제목으로 검색"
                  data-testid="input-tip-search"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            {shown.length === 0 ? (
              <p className="text-center text-muted-foreground py-12" data-testid="text-tips-empty">조건에 맞는 꿀팁이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {shown.map((tip) => (
                  <TipCard key={tip.slug} tip={tip} testIdPrefix="all" />
                ))}
              </div>
            )}
            {filtered.length > shown.length && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  data-testid="button-load-more"
                  className="px-6 h-11 rounded-md border border-border bg-white text-sm font-semibold hover:bg-muted"
                >
                  꿀팁 {Math.min(PAGE_SIZE, filtered.length - shown.length)}개 더 보기 ({shown.length}/{filtered.length})
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
