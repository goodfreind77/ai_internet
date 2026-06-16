import React from 'react';
import { motion } from 'framer-motion';

const managers = [
  {
    name: '곽희연',
    team: '영업 1팀',
    title: '팀장',
    initial: '곽',
    color: '#0064D2',
  },
  {
    name: '이미선',
    team: '영업 2팀',
    title: '팀장',
    initial: '이',
    color: '#E30000',
  },
  {
    name: '나은영',
    team: '영업 4팀',
    title: '팀장',
    initial: '나',
    color: '#E5005A',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20" style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #ffedd5 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">전담 팀장이 직접 상담해드립니다</h2>
          <p className="text-orange-400 text-lg">10년 이상의 노하우로 고객님께 최고의 혜택을 찾아드립니다.</p>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory justify-center">
          {managers.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all text-center flex flex-col items-center px-8 py-10 flex-shrink-0 w-[72vw] sm:w-[45vw] md:w-auto snap-start"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-black mb-5 shadow-md"
                style={{ backgroundColor: m.color }}
              >
                {m.initial}
              </div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-1">{m.team}</p>
              <h3 className="text-2xl font-black text-gray-900 mb-1">{m.name}</h3>
              <span
                className="text-sm font-bold px-4 py-1 rounded-full text-white mt-2"
                style={{ backgroundColor: m.color }}
              >
                {m.title}
              </span>
              <p className="text-gray-500 text-sm mt-5 leading-relaxed">
                최고의 혜택으로<br />직접 상담해드립니다.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
