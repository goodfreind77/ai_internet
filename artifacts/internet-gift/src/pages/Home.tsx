import React from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { HeroSection } from '@/components/HeroSection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { Footer } from '@/components/Footer';
import { SiLg } from 'react-icons/si';
import { RealtimeApplicants } from '@/components/RealtimeApplicants';

export default function Home() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      <ISPNav />
      <HeroSection />
      <BenefitsSection />
      
      {/* ISP Best Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">통신사별 베스트 요금제</h2>
          <p className="text-gray-500 mb-12">가장 많이 가입하는 인기 요금제입니다.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* SK브로드밴드 */}
            <div onClick={() => setLocation('/provider/sk')} className="bg-white border-2 border-[#E60000] rounded-2xl p-6 shadow hover:shadow-lg transition-all cursor-pointer flex flex-col">
              <div className="bg-[#E60000] text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">SK브로드밴드</div>
              <p className="text-sm font-bold text-gray-800 mb-1 text-left">기가라이트인터넷 500M + B tv ALL</p>
              <p className="text-xs text-gray-500 mb-4 text-left">Giga 찬 인터넷 속도와 B tv 모든 채널을 한번에!</p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                <li>+ 와이파이</li>
                <li>+ tv <span className="font-semibold">257개 채널</span></li>
                <li>+ 사은품 <span className="font-semibold text-orange-500">47만원</span></li>
                <li>+ 비밀지원금</li>
              </ul>
              <div className="mt-auto">
                <p className="text-xs text-gray-400 line-through text-right">49,500원</p>
                <p className="text-xl font-black text-[#E60000] text-right">월 39,400원</p>
              </div>
              <button className="mt-4 w-full py-2 bg-[#E60000] text-white text-sm font-bold rounded-lg hover:bg-[#E60000]/90 transition-colors">자세히 보기</button>
            </div>

            {/* KT */}
            <div onClick={() => setLocation('/provider/kt')} className="bg-white border-2 border-gray-800 rounded-2xl p-6 shadow hover:shadow-lg transition-all cursor-pointer flex flex-col">
              <div className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">KT 올레</div>
              <p className="text-sm font-bold text-gray-800 mb-1 text-left">인터넷베이직 500M + TV베이직</p>
              <p className="text-xs text-gray-500 mb-4 text-left">빠른 인터넷속도로 영상은 끊김없이, 인기 채널 모두 담은!</p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                <li>+ 와이파이</li>
                <li>+ tv <span className="font-semibold">233개 채널</span></li>
                <li>+ 사은품 <span className="font-semibold text-orange-500">45만원</span></li>
                <li>+ 비밀지원금</li>
              </ul>
              <div className="mt-auto">
                <p className="text-xs text-gray-400 line-through text-right">45,100원</p>
                <p className="text-xl font-black text-gray-800 text-right">월 39,600원</p>
              </div>
              <button className="mt-4 w-full py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition-colors">자세히 보기</button>
            </div>

            {/* LG유플러스 */}
            <div onClick={() => setLocation('/provider/lg')} className="bg-white border-2 border-[#E5005A] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">가장 인기!</div>
              <div className="bg-[#E5005A] text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4 mt-2">LG유플러스</div>
              <p className="text-sm font-bold text-gray-800 mb-1 text-left">와이파이기본 500M + TV실속형</p>
              <p className="text-xs text-gray-500 mb-4 text-left">기가 인터넷 속도로 영상 강의 신청, 원격 근무도 편하게!</p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                <li>+ 와이파이</li>
                <li>+ tv <span className="font-semibold">211개 채널</span></li>
                <li>+ 사은품 <span className="font-semibold text-orange-500">47만원</span></li>
                <li>+ 비밀지원금</li>
              </ul>
              <div className="mt-auto">
                <p className="text-xs text-gray-400 line-through text-right">44,000원</p>
                <p className="text-xl font-black text-[#E5005A] text-right">월 34,100원</p>
              </div>
              <button className="mt-4 w-full py-2 bg-[#E5005A] text-white text-sm font-bold rounded-lg hover:bg-[#E5005A]/90 transition-colors">자세히 보기</button>
            </div>

            {/* KT스카이라이프 */}
            <div onClick={() => setLocation('/provider/skylife')} className="bg-white border-2 border-[#16A34A] rounded-2xl p-6 shadow hover:shadow-lg transition-all cursor-pointer flex flex-col">
              <div className="bg-[#16A34A] text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">KT스카이라이프</div>
              <p className="text-sm font-bold text-gray-800 mb-1 text-left">와이파이 100M + TV SKY ALL</p>
              <p className="text-xs text-gray-500 mb-4 text-left">모든 채널을 가장 저렴하고 합리적이게!</p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                <li>+ 와이파이</li>
                <li>+ tv <span className="font-semibold">238개 채널</span></li>
                <li>+ 사은품 <span className="font-semibold text-orange-500">35만원</span></li>
                <li>+ 비밀지원금</li>
              </ul>
              <div className="mt-auto">
                <p className="text-xs text-gray-400 line-through text-right">30,800원</p>
                <p className="text-xl font-black text-[#16A34A] text-right">월 22,000원</p>
              </div>
              <button className="mt-4 w-full py-2 bg-[#16A34A] text-white text-sm font-bold rounded-lg hover:bg-[#16A34A]/90 transition-colors">자세히 보기</button>
            </div>

            {/* LG헬로비전 */}
            <div onClick={() => setLocation('/provider/hellovision')} className="bg-white border-2 border-[#E5005A] rounded-2xl p-6 shadow hover:shadow-lg transition-all cursor-pointer flex flex-col">
              <div className="bg-[#E5005A] text-white text-xs font-bold px-3 py-1 rounded-full self-start mb-4">LG헬로비전</div>
              <p className="text-sm font-bold text-gray-800 mb-1 text-left">광랜라이트 100M + TV 이코노미</p>
              <p className="text-xs text-gray-500 mb-4 text-left">웹서핑, 문서 작업을 편리하고 저렴하게!</p>
              <ul className="text-xs text-gray-600 space-y-1 mb-4 text-left">
                <li>+ 와이파이</li>
                <li>+ tv <span className="font-semibold">109개 채널</span></li>
                <li>+ 사은품 <span className="font-semibold text-orange-500">30만원</span></li>
                <li>+ 비밀지원금</li>
              </ul>
              <div className="mt-auto">
                <p className="text-xl font-black text-[#E5005A] text-right">월 29,530원</p>
              </div>
              <button className="mt-4 w-full py-2 bg-[#E5005A] text-white text-sm font-bold rounded-lg hover:bg-[#E5005A]/90 transition-colors">자세히 보기</button>
            </div>
          </div>

          <p className="mt-6 text-xs text-gray-400">※ 3년약정, 휴대폰 1회선 결합 할인 기준, VAT포함가</p>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <RealtimeApplicants />
      </section>

      <Footer />
    </div>
  );
}
