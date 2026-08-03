import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Eye } from 'lucide-react';

type EventItem = {
  id: number;
  thumbnail: string;
  title: string;
  views: number;
  date: string;
};

const EVENTS: EventItem[] = [
  {
    id: 3,
    thumbnail: 'https://xn--t60bm44a12c2wap96ap6f.com/upload/event/20240320160018_%EC%82%AC%EC%97%85%EC%9E%A5,%EC%86%8C%EC%83%81%EA%B3%B5%EC%9D%B8_450x450.png',
    title: '사업장, 소상공인 신청 인터넷',
    views: 280,
    date: '2025-11-07',
  },
  {
    id: 2,
    thumbnail: 'https://xn--t60bm44a12c2wap96ap6f.com/upload/event/20240320160024_%EC%8B%A0%EC%9A%A9%EC%B9%B4%EB%93%9C%20%EC%82%AC%EC%9A%A9%ED%95%98%EC%8B%9C%EB%82%98%EC%9A%94_450x450.png',
    title: '신용카드 사용하시나요?',
    views: 304,
    date: '2025-12-02',
  },
  {
    id: 4,
    thumbnail: 'https://xn--t60bm44a12c2wap96ap6f.com/upload/event/20240320160009_%EC%8A%A4%ED%83%80%EB%B2%85%EC%8A%A4%EC%9D%B4%EB%B2%A4%ED%8A%B8_450x450.png',
    title: '전 고객 대상 후기 이벤트',
    views: 245,
    date: '2026-01-05',
  },
  {
    id: 1,
    thumbnail: 'https://xn--t60bm44a12c2wap96ap6f.com/upload/event/20240320160029_%EA%B0%80%EC%A0%84%EC%A0%9C%ED%92%88%20%EC%8B%A0%EC%B2%AD%ED%95%98%EA%B3%A0%20%EC%82%AC%EC%9D%80%ED%92%88_450x450.png',
    title: '현금 사은품받자~',
    views: 517,
    date: '2026-02-11',
  },
];

export default function EventPage() {
  const [tab, setTab] = useState<'event' | 'notice'>('event');
  const [, setLocation] = useLocation();

  const handleCardClick = (ev: EventItem) => {
    if (ev.id === 2 || ev.id === 3 || ev.id === 4) {
      setLocation(`/event/${ev.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="text-page-title"
            >
              이벤트 &amp; 공지사항 게시판
            </h1>
          </div>

          <div className="flex gap-2 mb-8 justify-center">
            <button
              onClick={() => setTab('event')}
              data-testid="button-tab-event"
              className={`min-w-[120px] py-2 px-6 rounded-md font-semibold border transition-colors ${
                tab === 'event'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              이벤트
            </button>
            <button
              onClick={() => setTab('notice')}
              data-testid="button-tab-notice"
              className={`min-w-[120px] py-2 px-6 rounded-md font-semibold border transition-colors ${
                tab === 'notice'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              공지사항
            </button>
          </div>

          {tab === 'event' ? (
            <div className="mb-12">
              <h2
                className="text-2xl font-bold mb-6"
                data-testid="text-section-title"
              >
                진행중인 이벤트
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {EVENTS.map((ev) => {
                  const hasDetail = ev.id === 2 || ev.id === 3 || ev.id === 4;
                  return (
                    <div
                      key={ev.id}
                      data-testid={`card-event-${ev.id}`}
                      onClick={() => handleCardClick(ev)}
                      className={`bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-shadow ${
                        hasDetail ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                      }`}
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={ev.thumbnail}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-2 md:p-4">
                        <h3
                          className="font-bold text-sm md:text-base mb-1 md:mb-2 leading-snug"
                          data-testid={`text-event-title-${ev.id}`}
                        >
                          {ev.title}
                        </h3>
                        <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                          <span
                            className="flex items-center gap-1"
                            data-testid={`text-event-views-${ev.id}`}
                          >
                            <Eye className="w-3 h-3" />
                            {ev.views}
                          </span>
                          <span data-testid={`text-event-date-${ev.id}`}>
                            {ev.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">공지사항이 없습니다.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
