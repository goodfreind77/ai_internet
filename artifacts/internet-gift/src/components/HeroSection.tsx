import React from 'react';
import { motion } from 'framer-motion';
import { ConsultationForm } from './ConsultationForm';

export function HeroSection() {
  return (
    <div className="relative min-h-[500px] sm:min-h-[600px] w-full flex items-center bg-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt="Korean family watching TV"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 py-10 sm:py-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center text-white"
        >
          <div className="inline-block bg-secondary text-primary font-black px-4 py-1.5 rounded-full text-sm w-max mb-4 sm:mb-6">
            이번주 한정!
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-3 sm:mb-4 tracking-tight">
            인터넷 가입상담
          </h1>

          <p className="text-gray-300 text-base sm:text-lg mb-4 sm:mb-6">전국 최대 사은품 지급하는 AI인터넷</p>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 sm:p-4 rounded-xl flex items-center gap-3">
            <span className="bg-primary text-white px-3 py-1 text-xs font-bold rounded-full flex-shrink-0">공지</span>
            <span className="text-xs sm:text-sm font-medium">비밀지원금은 빠른견적을 통해 문의하세요.</span>
          </div>

          <p className="text-gray-400 text-xs mt-6 sm:mt-8">
            * 3년 약정 기준 최대 지원금액이며, 가입 상품 및 요금제에 따라 상이할 수 있습니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center lg:justify-end"
        >
          <div className="w-full max-w-md">
            <ConsultationForm />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
