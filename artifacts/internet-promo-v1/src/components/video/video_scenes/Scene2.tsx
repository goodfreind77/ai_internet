import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DISCOUNTS = [
  { icon: '🏠', label: '결합 할인' },
  { icon: '💳', label: '제휴 카드' },
  { icon: '📅', label: '장기 이용' },
  { icon: '🎁', label: '사은품' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 750),
      setTimeout(() => setPhase(3), 1550),
      setTimeout(() => setPhase(4), 2400),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0, x: 35 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -35 }}
      transition={{ duration: 0.42 }}
    >
      <motion.div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: '55%', zIndex: 2 }}
        initial={{ x: '-28%', opacity: 0 }}
        animate={phase >= 1 ? { x: '0%', opacity: 1 } : { x: '-28%', opacity: 0 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute bottom-0 left-0 w-full" style={{
          height: '60%',
          background: 'radial-gradient(ellipse 65% 45% at 40% 95%, rgba(100,200,255,0.3) 0%, transparent 70%)',
        }} />
        <img
          src={`${import.meta.env.BASE_URL}images/person2.png`}
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.3))' }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-end px-[6%] pt-[6%] gap-[2.5%]">
        {phase >= 1 && (
          <motion.div
            className="self-end flex items-center gap-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.45)', padding: '1.2% 4%' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
          >
            <span style={{ fontSize: '2.2vh' }}>✅</span>
            <span style={{ fontSize: '2.2vh', color: 'white', fontWeight: 700 }}>월요금 비교</span>
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            className="text-right"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '6.5vh', lineHeight: 1.1, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,80,0.25)' }}>
              어디서 가입해도
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '7.5vh', lineHeight: 1.05, color: '#FFE500', textShadow: '0 2px 16px rgba(255,200,0,0.5)' }}>
              월요금 동일!
            </div>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            className="self-end rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(255,255,255,0.4)', padding: '3% 4%', width: '62%' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.38 }}
          >
            <div style={{ fontSize: '2.2vh', color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: '2%', fontWeight: 600 }}>
              통신사 가격 동일
            </div>
            <div className="flex items-center justify-center gap-2">
              {[['LGU+', '#E60012'], ['SKT', '#CF4000'], ['KT', '#CC0000']].map(([b, c], i) => (
                <div key={b} className="flex items-center gap-2">
                  <div className="rounded-lg font-black flex items-center justify-center" style={{ background: c, color: 'white', width: '7.5vh', height: '4vh', fontSize: '2vh', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                    {b}
                  </div>
                  {i < 2 && <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 900, fontSize: '2.5vh' }}>=</span>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-[5%] pb-[5%]">
        {phase >= 3 && (
          <motion.div
            className="rounded-2xl flex items-center gap-3 mb-[2%]"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(255,255,255,0.35)', padding: '2.5% 4%' }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
          >
            <span style={{ fontSize: '3.5vh' }}>💡</span>
            <div>
              <div style={{ fontSize: '2.2vh', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>중요한 건!</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '5.5vh', color: '#FFE500', lineHeight: 1, textShadow: '0 2px 12px rgba(255,200,0,0.4)' }}>
                '할인' 입니다!
              </div>
            </div>
          </motion.div>
        )}

        {phase >= 4 && (
          <motion.div
            className="grid gap-[2%]"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38 }}
          >
            {DISCOUNTS.map((d, i) => (
              <motion.div
                key={d.label}
                className="flex flex-col items-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.35)', padding: '3.5% 2%', gap: '5%' }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <span style={{ fontSize: '4vh' }}>{d.icon}</span>
                <div style={{ fontSize: '2vh', color: 'white', fontWeight: 800, textAlign: 'center' }}>{d.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
