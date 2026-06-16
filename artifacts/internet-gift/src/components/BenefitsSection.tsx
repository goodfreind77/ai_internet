import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ConsultationModal } from './ConsultationModal';

const managers = [
  {
    name: '곽희연',
    team: '영업 1팀',
    initial: '곽',
    gradientFrom: '#f97316',
    gradientTo: '#ef4444',
    ringColor: '#f97316',
    desc: '고객 만족 최우선!\n최고의 조건으로 안내해 드립니다.',
    years: '15년',
  },
  {
    name: '이미선',
    team: '영업 2팀',
    initial: '이',
    gradientFrom: '#667eea',
    gradientTo: '#764ba2',
    ringColor: '#667eea',
    desc: '빠르고 정확한 상담!\n꼼꼼하게 챙겨드립니다.',
    years: '13년',
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

export function BenefitsSection({ onConsult }: { onConsult?: () => void } = {}) {
  const [showModal, setShowModal] = useState(false);

  function handleOpen() {
    onConsult?.();
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
  }

  return (
    <>
      <ConsultationModal open={showModal} onClose={handleClose} />

      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #ffedd5 100%)' }}>
        {/* decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#fdba74', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#fde68a', transform: 'translate(30%, 30%)' }} />

        <div className="relative max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-orange-200">
              EXPERT TEAM
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">전담 팀장이 직접 상담해드립니다</h2>
            <p className="text-orange-400 text-lg">10년 이상의 노하우로 고객님께 최고의 혜택을 찾아드립니다.</p>
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
                <div className="flex flex-col items-center">
                  <div className="bg-white p-10 text-center shadow-md border border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1" style={{ borderRadius: '50%', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* 팀 뱃지 */}
                    <div className="inline-block bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-6 border border-orange-200">
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
                    <h3 className="text-2xl font-black text-gray-900 mb-1">{m.name}</h3>
                    <div
                      className="h-0.5 w-12 mx-auto rounded-full my-4 opacity-60"
                      style={{ background: `linear-gradient(90deg, ${m.gradientFrom}, ${m.gradientTo})` }}
                    />

                    {/* 소개 */}
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line mb-6">
                      {m.desc}
                    </p>

                    {/* 상담 버튼 — 타원 카드 안에 배치 */}
                    <button
                      type="button"
                      onClick={handleOpen}
                      className="inline-flex items-center gap-2 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-md cursor-pointer"
                      style={{ background: `linear-gradient(135deg, ${m.gradientFrom}, ${m.gradientTo})`, touchAction: 'manipulation' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                      상담 연결하기
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
