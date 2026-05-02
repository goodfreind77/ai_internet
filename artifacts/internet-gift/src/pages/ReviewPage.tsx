import React, { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Star, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BANNER_BASE = 'https://xn--t60bm44a12c2wap96ap6f.com/resource/images/banner/';
const BANNERS = [
  { id: 1, desktop: `${BANNER_BASE}banner_01.png`, mobile: `${BANNER_BASE}m_benner_01.png` },
  { id: 2, desktop: `${BANNER_BASE}banner_02.png`, mobile: `${BANNER_BASE}m_benner_02.png` },
  { id: 3, desktop: `${BANNER_BASE}banner_03.png`, mobile: `${BANNER_BASE}m_benner_03.png` },
  { id: 4, desktop: `${BANNER_BASE}banner_04.png`, mobile: `${BANNER_BASE}m_benner_04.png` },
];
const BANNER_FALLBACK_COLORS = ['#e74c3c', '#2ecc71', '#3498db', '#9b59b6'];
const BANNER_FALLBACK_TEXTS = ['인터넷 최대 222만원 지원금', 'TV + 인터넷 결합할인', '당일 설치 당일 입금!', '꿀TIP으로 통신비 절약'];

const REVIEW_BASE = 'https://xn--t60bm44a12c2wap96ap6f.com/upload/review/';
const DEFAULT_THUMB = 'https://xn--t60bm44a12c2wap96ap6f.com/resource/images/common/default_thum.png';

export const ALL_REVIEWS: Review[] = [
  {
    id: 'best-1',
    thumbnail: `${REVIEW_BASE}20240522021808_IMG_6203.jpeg`,
    title: '만족스럽네요',
    author: '김**',
    content: '처음에는 걱정했는데 설치 기사님이 정말 친절하시고 꼼꼼하게 해주셨습니다. 인터넷 속도도 빠르고 가격도 저렴해서 매우 만족합니다!',
    views: 574,
    date: '2025-11-07',
    isBest: true,
  },
  {
    id: 'best-2',
    thumbnail: `${REVIEW_BASE}20240503172441_20240503_171848.jpg`,
    title: '겁나빠른설치!',
    author: '이**',
    content: '신청하고 바로 다음날 설치 완료! 기사님도 친절하시고 작업도 깔끔하게 잘 해주셨어요. 강력 추천합니다!',
    views: 548,
    date: '2025-11-07',
    isBest: true,
  },
  {
    id: 'best-3',
    thumbnail: `${REVIEW_BASE}20240404163445_IMG_4005.jpeg`,
    title: 'SK브로드밴드 (인터넷, IPTV)설치 후기',
    author: '박**',
    content: '인터넷과 IPTV 동시에 설치했는데 정말 만족스럽습니다. 화질도 좋고 속도도 빠릅니다. 사은품도 받아서 더욱 좋았어요!',
    views: 551,
    date: '2025-11-07',
    isBest: true,
  },
  {
    id: 'best-4',
    thumbnail: `${REVIEW_BASE}20240315114634_%ED%9B%84%EA%B8%B03.png`,
    title: '정리 확실하고 만족스럽습니다. 감사합니다.^^',
    author: '최**',
    content: '배선 정리도 깔끔하게 해주시고 설명도 자세히 해주셔서 좋았습니다. 다음에도 이용하겠습니다!',
    views: 468,
    date: '2025-11-07',
    isBest: true,
  },
  {
    id: 'best-5',
    thumbnail: `${REVIEW_BASE}20240315114302_%ED%9B%84%EA%B8%B04.png`,
    title: '후기 잘 안 남기는 사람으로서 한 말씀 올립니다.',
    author: '정**',
    content: '평소에 후기 잘 안 남기는데 이번엔 정말 만족해서 남깁니다. 상담부터 설치까지 모두 완벽했어요. 추천합니다!',
    views: 653,
    date: '2025-11-07',
    isBest: true,
  },
  {
    id: 'all-1',
    thumbnail: `${REVIEW_BASE}20250625151711_20250625_151401.jpg`,
    title: '빠른설치~감솨함돠~~',
    author: '홍**',
    content: '신청하고 빠르게 설치해주셔서 감사합니다! 속도도 빠르고 너무 만족스럽습니다.',
    views: 96,
    date: '2025-11-07',
    isBest: false,
  },
  {
    id: 'all-2',
    thumbnail: DEFAULT_THUMB,
    title: '빠른 설지 감사합니다',
    author: '강**',
    content: '설치 정말 빠르게 잘 해주셨어요. 기사님도 친절하시고 좋았습니다!',
    views: 109,
    date: '2025-11-07',
    isBest: false,
  },
  {
    id: 'all-3',
    thumbnail: `${REVIEW_BASE}20250520190022_IMG_8746.jpeg`,
    title: '인터넷 신청부터 설치까지 완벽케어!',
    author: '윤**',
    content: '신청 상담부터 설치까지 모든 과정이 완벽했습니다. 강력 추천드립니다!',
    views: 141,
    date: '2025-11-07',
    isBest: false,
  },
  {
    id: 'all-4',
    thumbnail: `${REVIEW_BASE}20250513170624_20250512_212459.jpg`,
    title: '설치가 빠르네요',
    author: '임**',
    content: '설치 정말 빠르게 끝났어요. 만족합니다!',
    views: 110,
    date: '2025-11-07',
    isBest: false,
  },
  {
    id: 'all-5',
    thumbnail: `${REVIEW_BASE}20250513170613_20250512_212459.jpg`,
    title: '설치가 빠르네요',
    author: '한**',
    content: '빠른 설치 정말 감사합니다. 기사님 친절하세요!',
    views: 117,
    date: '2025-11-07',
    isBest: false,
  },
];

export interface Review {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  content: string;
  views: number;
  date: string;
  isBest: boolean;
}

const BEST_REVIEWS = ALL_REVIEWS.filter((r) => r.isBest);
const OTHER_REVIEWS = ALL_REVIEWS.filter((r) => !r.isBest);

const PAGE_SIZE = 5;

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
                  style={{ backgroundColor: BANNER_FALLBACK_COLORS[idx % 4], height: '200px' }}
                >
                  <span className="text-white font-black text-2xl md:text-3xl text-center px-4">
                    {BANNER_FALLBACK_TEXTS[idx % 4]}
                  </span>
                </div>
              ) : (
                <>
                  <img
                    src={b.desktop}
                    alt={`배너 ${b.id}`}
                    className="hidden md:block w-full h-auto rounded-xl"
                    onError={() => setLoadFailed((p) => ({ ...p, [b.id]: true }))}
                  />
                  <img
                    src={b.mobile}
                    alt={`배너 ${b.id}`}
                    className="md:hidden w-full h-auto rounded-xl"
                    onError={() => setLoadFailed((p) => ({ ...p, [b.id]: true }))}
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

function ReviewCard({
  review,
  isBest,
  testIdPrefix,
}: {
  review: Review;
  isBest?: boolean;
  testIdPrefix: string;
}) {
  const [, setLocation] = useLocation();
  return (
    <div
      className="bg-white rounded-lg overflow-hidden border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
      data-testid={`card-review-${testIdPrefix}-${review.id}`}
      onClick={() => { setLocation(`/review/${review.id}`); window.scrollTo(0, 0); }}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <img
          src={review.thumbnail}
          alt={review.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_THUMB;
          }}
        />
        {isBest && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            BEST
          </div>
        )}
      </div>
      <div className="p-2 md:p-4 flex flex-col flex-1" style={{ minHeight: '120px' }}>
        <h3
          className="font-bold text-sm md:text-base mb-2 md:mb-3 line-clamp-2 flex-1"
          data-testid={`text-review-title-${review.id}`}
        >
          {review.title}
        </h3>
        <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mt-auto">
          <span className="flex items-center gap-1" data-testid={`text-review-views-${review.id}`}>
            <Eye className="w-3 h-3" />
            {review.views}
          </span>
          <span data-testid={`text-review-date-${review.id}`}>{review.date}</span>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  total,
  pageSize,
  onChange,
  testId,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
  testId: string;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        data-testid={`${testId}-prev`}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          variant={page === p ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(p)}
          data-testid={`${testId}-page-${p}`}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        data-testid={`${testId}-next`}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function ReviewPage() {
  const [, setLocation] = useLocation();
  const [bestPage, setBestPage] = React.useState(1);
  const [allPage, setAllPage] = React.useState(1);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const bestSlice = BEST_REVIEWS.slice((bestPage - 1) * PAGE_SIZE, bestPage * PAGE_SIZE);
  const allSlice = OTHER_REVIEWS.slice((allPage - 1) * PAGE_SIZE, allPage * PAGE_SIZE);

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
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold text-base shadow">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                베스트 후기 !
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
            </div>

            {BEST_REVIEWS.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">아직 베스트 후기가 없습니다.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                  {bestSlice.map((r) => (
                    <ReviewCard key={r.id} review={r} isBest testIdPrefix="best" />
                  ))}
                </div>
                <Pagination
                  page={bestPage}
                  total={BEST_REVIEWS.length}
                  pageSize={PAGE_SIZE}
                  onChange={setBestPage}
                  testId="button-best"
                />
              </>
            )}
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" data-testid="text-section-title-all">
                전체 후기
              </h2>
              <Button
                variant="default"
                data-testid="button-write-review"
                onClick={() => { setLocation('/review/write'); window.scrollTo(0, 0); }}
              >
                후기쓰기
              </Button>
            </div>

            {OTHER_REVIEWS.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">아직 등록된 후기가 없습니다.</p>
                <p className="text-sm mt-2">첫 번째 후기를 작성해보세요!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                  {allSlice.map((r) => (
                    <ReviewCard key={r.id} review={r} testIdPrefix="all" />
                  ))}
                </div>
                <Pagination
                  page={allPage}
                  total={OTHER_REVIEWS.length}
                  pageSize={PAGE_SIZE}
                  onChange={setAllPage}
                  testId="button-all"
                />
              </>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
