import React from 'react';
import { motion } from 'framer-motion';

const managers = [
  {
    name: '곽희연',
    team: '영업 1팀',
    initial: '곽',
    gradientFrom: '#667eea',
    gradientTo: '#764ba2',
    ringColor: '#667eea',
    desc: '고객 만족 최우선!\n최고의 조건으로 안내해 드립니다.',
    years: '12년',
  },
  {
    name: '이미선',
    team: '영업 2팀',
    initial: '이',
    gradientFrom: '#f97316',
    gradientTo: '#ef4444',
    ringColor: '#f97316',
    desc: '빠르고 정확한 상담!\n꼼꼼하게 챙겨드립니다.',
    years: '10년',
  },
  {
    name: '나은영',
    team: '영업 4팀',
    initial: '나',
    gradientFrom: '#06b6d4',
    gradientTo: '#6366f1',
    ringColor: '#06b6d4',
    desc: '친절하고 전문적인 상담!\n최대 혜택을 찾아드립니다.',
    years: '8년',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)' }}>
      {/* decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#818cf8', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#f97316', transform: 'translate(30%, 30%)' }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-white/10 text-white/80 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-white/20">
            EXPERT TEAM
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">전담 팀장이 직접 상담해드립니다</h2>
          <p className="text-indigo-200 text-lg">10년 이상의 노하우로 고객님께 최고의 혜택을 찾아드립니다.</p>
        </motion.div>

        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory">
          {managers.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-auto snap-start"
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 text-center hover:bg-white/15 transition-all hover:-translate-y-1 hover:shadow-2xl">
                {/* 팀 뱃지 */}
                <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 border border-white/30">
                  {m.team} 팀장
                </div>

                {/* 아바타 */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                  >
                    {m.initial}
                  </div>
                  {/* 경력 뱃지 */}
                  <div
                    className="absolute -bottom-1 -right-1 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md"
                    style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                  >
                    {m.years} 경력
                  </div>
                </div>

                {/* 이름 */}
                <h3 className="text-2xl font-black text-white mb-1">{m.name}</h3>
                <div
                  className="h-0.5 w-12 mx-auto rounded-full my-4 opacity-60"
                  style={{ background: `linear-gradient(90deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                />

                {/* 소개 */}
                <p className="text-indigo-200 text-sm leading-relaxed whitespace-pre-line">
                  {m.desc}
                </p>

                {/* 상담 버튼 */}
                <a
                  href="tel:1666-3233"
                  className="mt-6 inline-flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-md"
                  style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  상담 연결하기
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
