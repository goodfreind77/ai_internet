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
      
      {/* ISP Logos / Pricing placeholders - minimal implementation for vibe */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">통신사별 베스트 요금제</h2>
          <p className="text-gray-600 mb-12">가장 많이 가입하는 인기 요금제입니다.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => setLocation('/provider/sk')} className="border border-gray-200 rounded-2xl p-8 hover:border-[#E60000] hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-2xl font-black text-[#E60000] mb-2 flex items-center justify-center gap-2">SK 브로드밴드</h3>
              <ul className="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li>• 인터넷 500M + Btv All</li>
                <li>• WiFi 기본 제공</li>
                <li>• 월 44,000원 (VAT포함)</li>
              </ul>
              <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg transition-colors text-gray-900">자세히 보기</button>
            </div>
            
            <div onClick={() => setLocation('/provider/kt')} className="border border-gray-200 rounded-2xl p-8 hover:border-[#000000] hover:shadow-lg transition-all cursor-pointer">
              <h3 className="text-2xl font-black text-[#000000] mb-2 flex items-center justify-center gap-2">KT 올레</h3>
              <ul className="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li>• 인터넷 500M + 지니 TV 베이직</li>
                <li>• 기가 WiFi 기본 제공</li>
                <li>• 월 44,000원 (VAT포함)</li>
              </ul>
              <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 font-bold rounded-lg transition-colors text-gray-900">자세히 보기</button>
            </div>

            <div onClick={() => setLocation('/provider/lg')} className="border-2 border-[#E5005A] rounded-2xl p-8 shadow-md relative cursor-pointer md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E5005A] text-white text-xs font-bold px-4 py-1 rounded-full">가장 인기!</div>
              <h3 className="text-xl font-black text-[#E5005A] mb-2 flex items-center justify-center gap-2"><SiLg className="text-[#E5005A] text-5xl" /> 유플러스</h3>
              <ul className="text-left text-sm text-gray-600 space-y-3 mb-8">
                <li>• 인터넷 500M + U+tv 프리미엄</li>
                <li>• 기가 WiFi 6 기본 제공</li>
                <li>• 월 44,000원 (VAT포함)</li>
              </ul>
              <button className="w-full py-3 bg-[#E5005A] hover:bg-[#E5005A]/90 text-white font-bold rounded-lg transition-colors">자세히 보기</button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <RealtimeApplicants />
      </section>

      <Footer />
    </div>
  );
}
