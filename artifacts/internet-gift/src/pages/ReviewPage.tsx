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
const BANNER_FALLBACK_TEXTS = ['TV + 인터넷 결합할인', '당일 설치 당일 입금!', '꿀TIP으로 통신비 절약'];

const REVIEW_BASE = 'https://xn--t60bm44a12c2wap96ap6f.com/upload/review/';
const DEFAULT_THUMB = `${import.meta.env.BASE_URL}images/home_screenshot.jpg`;

export const ALL_REVIEWS: Review[] = [
  {
    id: 'best-1',
    thumbnail: `${REVIEW_BASE}20240522021808_IMG_6203.jpeg`,
    title: '만족스럽네요',
    author: '김**',
    content: '처음에는 걱정했는데 설치 기사님이 정말 친절하시고 꼼꼼하게 해주셨습니다. 인터넷 속도도 빠르고 가격도 저렴해서 매우 만족합니다!',
    views: 574,
    date: '2026-06-20',
    isBest: true,
  },
  {
    id: 'best-2',
    thumbnail: `${REVIEW_BASE}20240503172441_20240503_171848.jpg`,
    title: '겁나빠른설치!',
    author: '이**',
    content: '신청하고 바로 다음날 설치 완료! 기사님도 친절하시고 작업도 깔끔하게 잘 해주셨어요. 강력 추천합니다!',
    views: 548,
    date: '2026-06-18',
    isBest: true,
  },
  {
    id: 'best-3',
    thumbnail: `${REVIEW_BASE}20240404163445_IMG_4005.jpeg`,
    title: 'SK브로드밴드 (인터넷, IPTV)설치 후기',
    author: '박**',
    content: '인터넷과 IPTV 동시에 설치했는데 정말 만족스럽습니다. 화질도 좋고 속도도 빠릅니다. 사은품도 받아서 더욱 좋았어요!',
    views: 551,
    date: '2026-06-15',
    isBest: true,
  },
  {
    id: 'best-4',
    thumbnail: `${REVIEW_BASE}20240315114634_%ED%9B%84%EA%B8%B03.png`,
    title: '정리 확실하고 만족스럽습니다. 감사합니다.^^',
    author: '최**',
    content: '배선 정리도 깔끔하게 해주시고 설명도 자세히 해주셔서 좋았습니다. 다음에도 이용하겠습니다!',
    views: 468,
    date: '2026-06-10',
    isBest: true,
  },
  {
    id: 'best-5',
    thumbnail: `${REVIEW_BASE}20240315114302_%ED%9B%84%EA%B8%B04.png`,
    title: '후기 잘 안 남기는 사람으로서 한 말씀 올립니다.',
    author: '정**',
    content: '평소에 후기 잘 안 남기는데 이번엔 정말 만족해서 남깁니다. 상담부터 설치까지 모두 완벽했어요. 추천합니다!',
    views: 653,
    date: '2026-06-05',
    isBest: true,
  },
  {
    id: 'all-1',
    thumbnail: `${REVIEW_BASE}20250625151711_20250625_151401.jpg`,
    title: '빠른설치~감솨함돠~~',
    author: '홍**',
    content: '신청하고 빠르게 설치해주셔서 감사합니다! 속도도 빠르고 너무 만족스럽습니다.',
    views: 96,
    date: '2026-06-22',
    isBest: false,
  },
  {
    id: 'all-2',
    thumbnail: `${import.meta.env.BASE_URL}images/home_screenshot.jpg`,
    title: '빠른 설지 감사합니다',
    author: '강**',
    content: '설치 정말 빠르게 잘 해주셨어요. 기사님도 친절하시고 좋았습니다!',
    views: 109,
    date: '2026-06-19',
    isBest: false,
  },
  {
    id: 'all-3',
    thumbnail: `${REVIEW_BASE}20250520190022_IMG_8746.jpeg`,
    title: '인터넷 신청부터 설치까지 완벽케어!',
    author: '윤**',
    content: '신청 상담부터 설치까지 모든 과정이 완벽했습니다. 강력 추천드립니다!',
    views: 141,
    date: '2026-06-14',
    isBest: false,
  },
  {
    id: 'all-4',
    thumbnail: `${REVIEW_BASE}20250513170624_20250512_212459.jpg`,
    title: '설치가 빠르네요',
    author: '임**',
    content: '설치 정말 빠르게 끝났어요. 만족합니다!',
    views: 110,
    date: '2026-06-08',
    isBest: false,
  },
  {
    id: 'all-5',
    thumbnail: `${REVIEW_BASE}20250513170613_20250512_212459.jpg`,
    title: '설치가 빠르네요',
    author: '한**',
    content: '빠른 설치 정말 감사합니다. 기사님 친절하세요!',
    views: 117,
    date: '2026-06-03',
    isBest: false,
  },
  {
    id: 'all-6',
    thumbnail: DEFAULT_THUMB,
    title: 'KT 인터넷 설치 완료! 대만족이에요',
    author: '오**',
    content: 'KT 인터넷으로 바꿨는데 속도가 확실히 달라요. 유튜브 4K도 끊김 없이 잘 나오고 게임도 쾌적하게 즐기고 있습니다. 기사님도 친절하게 설명해 주셔서 감사해요!',
    views: 88,
    date: '2026-06-21',
    isBest: false,
  },
  {
    id: 'all-7',
    thumbnail: DEFAULT_THUMB,
    title: '현금 사은품 당일 입금 확인했어요',
    author: '서**',
    content: '신청하면서 사은품 준다고 했는데 설치 당일 바로 입금됐습니다. 믿고 신청하시면 됩니다. 인터넷 속도도 만족스러워요!',
    views: 203,
    date: '2026-06-20',
    isBest: false,
  },
  {
    id: 'all-8',
    thumbnail: DEFAULT_THUMB,
    title: '이사하면서 새로 신청했는데 최고예요',
    author: '권**',
    content: '이사 당일에 맞춰서 설치 예약 잡아주셨고 이삿날 바로 인터넷 사용할 수 있었어요. 이런 서비스는 처음이에요. 너무 만족합니다!',
    views: 176,
    date: '2026-06-17',
    isBest: false,
  },
  {
    id: 'all-9',
    thumbnail: DEFAULT_THUMB,
    title: 'LG유플러스 기가 인터넷, 진짜 빠릅니다',
    author: '황**',
    content: '기존에 쓰던 인터넷이 너무 느려서 바꿨는데 확실히 다르네요. 재택근무도 화상회의도 전혀 끊김이 없어요. 좀 더 일찍 바꿀걸 싶어요.',
    views: 134,
    date: '2026-06-16',
    isBest: false,
  },
  {
    id: 'all-10',
    thumbnail: DEFAULT_THUMB,
    title: '상담부터 설치까지 하루만에 끝!',
    author: '안**',
    content: '어제 오전에 전화 상담하고 오후에 바로 설치 완료했습니다. 이렇게 빠른 줄 몰랐어요. 기사님도 꼼꼼하게 체크해 주시고 너무 감사합니다.',
    views: 97,
    date: '2026-06-13',
    isBest: false,
  },
  {
    id: 'all-11',
    thumbnail: DEFAULT_THUMB,
    title: '아파트 이사 후 인터넷 설치 후기',
    author: '송**',
    content: '새 아파트로 이사 후 인터넷 신청했습니다. 상담사분이 우리 집에 맞는 요금제 잘 추천해 주셔서 가격도 합리적으로 계약했어요. 설치 기사님도 깔끔하게 잘 해주셨습니다.',
    views: 155,
    date: '2026-06-12',
    isBest: false,
  },
  {
    id: 'all-12',
    thumbnail: DEFAULT_THUMB,
    title: 'SK브로드밴드로 변경 후 속도 대만족',
    author: '전**',
    content: '타사에서 SK브로드밴드로 바꿨는데 속도 차이가 확실히 느껴집니다. 특히 저녁 시간대 속도가 안정적이에요. 변경하길 잘했습니다!',
    views: 112,
    date: '2026-06-11',
    isBest: false,
  },
  {
    id: 'all-13',
    thumbnail: DEFAULT_THUMB,
    title: '가족 결합 할인으로 통신비 반값!',
    author: '조**',
    content: '인터넷에 모바일까지 결합하니까 통신비가 거의 반값이 됐어요. 상담사님이 꼼꼼하게 비교해서 최적 요금제 찾아주셨습니다. 이런 꿀팁은 직접 상담해봐야 알 수 있어요!',
    views: 289,
    date: '2026-06-09',
    isBest: false,
  },
  {
    id: 'all-14',
    thumbnail: DEFAULT_THUMB,
    title: '설치 기사님 너무 친절하셨어요',
    author: '장**',
    content: '설치하면서 공유기 위치 잡는 것도 도와주시고 와이파이 비밀번호 설정까지 다 해주셨어요. 이렇게까지 해주시는 분은 처음이에요. 진심으로 감사드립니다.',
    views: 143,
    date: '2026-06-07',
    isBest: false,
  },
  {
    id: 'all-15',
    thumbnail: DEFAULT_THUMB,
    title: '인터넷+TV 결합 설치 완료',
    author: '임**',
    content: 'TV랑 인터넷 같이 신청했더니 할인도 많이 되고 설치도 한 번에 끝났어요. 채널도 풍부하고 화질도 선명합니다. 온 가족이 다 만족하고 있어요!',
    views: 198,
    date: '2026-06-04',
    isBest: false,
  },
  {
    id: 'all-16',
    thumbnail: DEFAULT_THUMB,
    title: '재약정 도움 주셔서 감사해요',
    author: '나**',
    content: '약정 만료 됐는데 어떻게 해야할지 몰랐는데 상담사님이 친절하게 설명해 주시고 더 저렴한 요금제로 재약정할 수 있도록 도와주셨어요. 감사합니다!',
    views: 87,
    date: '2026-05-30',
    isBest: false,
  },
  {
    id: 'all-17',
    thumbnail: DEFAULT_THUMB,
    title: 'KT스카이라이프 위성방송까지 한 번에',
    author: '류**',
    content: '시골 집인데 KT스카이라이프로 인터넷이랑 위성방송 동시에 신청했습니다. 도서 산간지역이라 걱정했는데 깔끔하게 설치해 주셨어요. 덕분에 TV도 잘 나오네요!',
    views: 164,
    date: '2026-05-27',
    isBest: false,
  },
  {
    id: 'all-18',
    thumbnail: DEFAULT_THUMB,
    title: '다음에도 꼭 여기서 신청할게요!',
    author: '하**',
    content: '2년 전에도 여기서 신청했고 이번에 이사하면서 또 신청했어요. 그때도 지금도 서비스가 정말 좋습니다. 믿고 맡길 수 있는 곳이에요!',
    views: 221,
    date: '2026-05-22',
    isBest: false,
  },
  {
    id: 'all-19',
    thumbnail: DEFAULT_THUMB,
    title: '게임용 인터넷으로 딱이에요',
    author: '문**',
    content: '온라인 게임 많이 하는데 기존 인터넷이 저녁마다 렉이 심했어요. 기가 인터넷으로 바꾸고 나서 핑도 낮아지고 끊김도 없어졌습니다. 게이머라면 꼭 바꾸세요!',
    views: 307,
    date: '2026-05-18',
    isBest: false,
  },
  {
    id: 'all-20',
    thumbnail: DEFAULT_THUMB,
    title: '사은품 종류가 정말 다양해요',
    author: '배**',
    content: '신청할 때 사은품 선택지가 많아서 원하는 걸로 고를 수 있었어요. 현금으로 받을 수 있어서 더 좋았습니다. 설치도 빠르고 인터넷 품질도 만족해요!',
    views: 175,
    date: '2026-05-14',
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
