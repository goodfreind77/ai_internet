import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BULLETS = [
  { icon: '💰', text: '요금·할인·혜택 모두 안내' },
  { icon: '📋', text: '내 상황에 맞는 상품 추천' },
  { icon: '🛡️', text: '개인정보 걱정 없이 안심 상담' },
];

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 750),
      setTimeout(() => setPhase(3), 1550),
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
      {/* Person — right side */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: '55%', zIndex: 2 }}
        initial={{ x: '28%', opacity: 0 }}
        animate={phase >= 1 ? { x: '0%', opacity: 1 } : { x: '28%', opacity: 0 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute bottom-0 right-0 w-full" style={{
          height: '60%',
          background: 'radial-gradient(ellipse 65% 45% at 60% 95%, rgba(150,220,255,0.3) 0%, transparent 70%)',
        }} />
        <img
          src={`${import.meta.env.BASE_URL}images/person3.png`}
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.3))' }}
        />
        {phase >= 2 && (
          <motion.div
            className="absolute rounded-2xl rounded-br-sm"
            style={{ top: '18%', right: '62%', background: 'white', padding: '2% 3.5%', boxShadow: '0 4px 18px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' }}
            initial={{ opacity: 0, scale: 0.7, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          >
            <div style={{ fontSize: '2vh', color: '#1A65EE', fontWeight: 800 }}>궁금한 거 다 물어보세요!</div>
            <div style={{ fontSize: '1.6vh', color: '#666' }}>친절하게 안내해 드릴게요 💙</div>
          </motion.div>
        )}
      </motion.div>

      {/* Text — left */}
      <div className="relative z-10 flex flex-col px-[7%] pt-[6%] gap-[2.5%]" style={{ width: '65%' }}>
        {phase >= 1 && (
          <motion.div
            className="self-start flex items-center gap-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.45)', padding: '1.2% 4%' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
          >
            <span style={{ fontSize: '2.2vh' }}>📞</span>
            <span style={{ fontSize: '2.2vh', color: 'white', fontWeight: 700 }}>무료 상담</span>
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '7.5vh', color: 'white', lineHeight: 1.1, textShadow: '0 2px 8px rgba(0,0,80,0.25)' }}>
              상담은
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10vh', color: '#FFE500', lineHeight: 1, textShadow: '0 2px 20px rgba(255,200,0,0.55)' }}>
              공짜!
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '6.5vh', color: 'white', lineHeight: 1.1 }}>
              0원입니다
            </div>
          </motion.div>
        )}
      </div>

      {/* Bullets + CTA */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-[1.5%] px-[5%] pb-[5%]">
        {BULLETS.map((b, i) => (
          phase >= 2 && (
            <motion.div
              key={b.text}
              className="flex items-center gap-[3%] rounded-xl"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.38)', padding: '2% 4%' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{ fontSize: '3vh' }}>{b.icon}</span>
              <span style={{ fontSize: '2.6vh', color: 'white', fontWeight: 700 }}>{b.text}</span>
            </motion.div>
          )
        ))}

        {phase >= 3 && (
          <motion.div
            className="rounded-2xl flex items-center justify-center gap-2 mt-[1%]"
            style={{ background: 'linear-gradient(90deg, #FFE500 0%, #FFCA00 100%)', padding: '3.2% 5%', boxShadow: '0 4px 20px rgba(255,200,0,0.45)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '4.2vh', color: '#0A2A8A' }}>지금 상담 신청하세요~</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
