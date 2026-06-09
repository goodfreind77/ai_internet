import React, { useCallback } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { HeroSection } from '@/components/HeroSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { Footer } from '@/components/Footer';
import { RealtimeApplicants } from '@/components/RealtimeApplicants';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ISP_PLANS = [
  {
    key: 'sk',
    provider: 'SK브로드밴드',
    logo: '/logos/sk_logo.png',
    logoHeight: 'h-12',
    color: '#E60000',
    name: '기가라이트인터넷 500M + B tv ALL',
    desc: 'Giga 찬 인터넷 속도와 B tv 모든 채널을 한번에!',
    channels: 257,
    gift: 47,
    originalPrice: '49,500원',
    price: '월 39,400원',
    popular: false,
  },
  {
    key: 'kt',
    provider: 'KT 올레',
    logo: '/logos/kt_logo.png',
    color: '#1a1a1a',
    name: '인터넷베이직 500M + TV베이직',
    desc: '빠른 인터넷속도로 영상은 끊김없이, 인기 채널 모두 담은!',
    channels: 233,
    gift: 45,
    originalPrice: '45,100원',
    price: '월 39,600원',
    popular: false,
  },
  {
    key: 'lg',
    provider: 'LG유플러스',
    logo: '/logos/lg_logo.png',
    color: '#E5005A',
    name: '와이파이기본 500M + TV실속형',
    desc: '기가 인터넷 속도로 영상 강의 신청, 원격 근무도 편하게!',
    channels: 211,
    gift: 47,
    originalPrice: '44,000원',
    price: '월 34,100원',
    popular: true,
  },
  {
    key: 'skylife',
    provider: 'KT스카이라이프',
    logo: '/logos/kt_logo_sky.png',
    color: '#16A34A',
    name: '와이파이 100M + TV SKY ALL',
    desc: '모든 채널을 가장 저렴하고 합리적이게!',
    channels: 238,
    gift: 35,
    originalPrice: '30,800원',
    price: '월 22,000원',
    popular: false,
  },
  {
    key: 'hellovision',
    provider: 'LG헬로비전',
    logo: '/logos/lg_vision.png',
    color: '#E5005A',
    name: '광랜라이트 100M + TV 이코노미',
    desc: '웹서핑, 문서 작업을 편리하고 저렴하게!',
    channels: 109,
    gift: 30,
    originalPrice: null,
    price: '월 29,530원',
    popular: false,
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <ISPNav />
      <HeroSection />
      <BenefitsSection />

      {/* ISP Best Plans Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">통신사별 베스트 요금제</h2>
            <p className="text-gray-500">가장 많이 가입하는 인기 요금제입니다.</p>
          </div>

          <div className="relative">
            {/* Prev button */}
            <button
              onClick={scrollPrev}
              className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Carousel viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 pl-1 pr-1">
                {ISP_PLANS.map((plan) => (
                  <div
                    key={plan.key}
                    className="flex-none w-[80vw] sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(20%-13px)]"
                  >
                    <div
                      onClick={() => setLocation(`/provider/${plan.key}`)}
                      className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all cursor-pointer flex flex-col h-full relative"
                      style={{ border: `2px solid ${plan.popular ? plan.color : plan.color + '55'}` }}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          가장 인기!
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-4" style={{ marginTop: plan.popular ? '8px' : '0' }}>
                        <img
                          src={plan.logo}
                          alt={plan.provider}
                          className={`${(plan as any).logoHeight ?? 'h-7'} object-contain`}
                          draggable={false}
                        />
                      </div>
                      <p className="text-sm font-bold text-gray-800 mb-1 text-left">{plan.name}</p>
                      <p className="text-xs text-gray-500 mb-4 text-left">{plan.desc}</p>
                      <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                        <li>+ 와이파이</li>
                        <li>+ tv <span className="font-semibold">{plan.channels}개 채널</span></li>
                        <li>+ 사은품 <span className="font-semibold text-orange-500">{plan.gift}만원</span></li>
                        <li>+ 비밀지원금</li>
                      </ul>
                      <div className="mt-auto">
                        {plan.originalPrice && (
                          <p className="text-xs text-gray-400 line-through text-right">{plan.originalPrice}</p>
                        )}
                        <p className="text-xl font-black text-right" style={{ color: plan.color }}>
                          {plan.price}
                        </p>
                      </div>
                      <button
                        className="mt-4 w-full py-2 text-white text-sm font-bold rounded-lg transition-colors"
                        style={{ backgroundColor: plan.color }}
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={scrollNext}
              className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">※ 3년약정, 휴대폰 1회선 결합 할인 기준, VAT포함가</p>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <RealtimeApplicants />
      </section>

      <Footer />
    </div>
  );
}
