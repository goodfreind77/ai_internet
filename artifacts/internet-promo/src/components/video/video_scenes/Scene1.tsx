import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BENEFITS = [
  { icon: '🎁', text: '가입만 해도 현금 지급!' },
  { icon: '💰', text: '최대 현금 지급 보장!' },
  { icon: '⚡', text: '당일 지급, 빠른 처리!' },
];

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 550),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.4 }}
    >
      {/* Person — slides in from right */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: '62%', zIndex: 2 }}
        initial={{ x: '35%', opacity: 0 }}
        animate={phase >= 1 ? { x: '0%', opacity: 1 } : { x: '35%', opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Warm glow under person */}
        <div className="absolute bottom-0 right-0 w-full" style={{
          height: '60%',
          background: 'radial-gradient(ellipse 70% 45% at 55% 95%, rgba(255,230,80,0.35) 0%, transparent 70%)',
        }} />
        <img
          src={`${import.meta.env.BASE_URL}images/person1.png`}
          alt=""
          className="w-full h-auto object-contain"
          style={{ filter: 'drop-shadow(0 6px 24px rgba(0,0,0,0.3))' }}
        />
      </motion.div>

      {/* Text — left/top */}
      <div className="relative z-10 flex flex-col px-[7%] pt-[7%] gap-[2.5%]" style={{ width: '65%' }}>
        {/* Badge */}
        {phase >= 1 && (
          <motion.div
            className="self-start flex items-center gap-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.5)', padding: '1.2% 4%' }}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38 }}
          >
            <span style={{ fontSize: '2.2vh' }}>⭐</span>
            <span style={{ fontSize: '2.4vh', color: '#FFF700', fontWeight: 800, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>인터넷 가입</span>
          </motion.div>
        )}

        {/* Headline */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '9vh', lineHeight: 1.0, color: '#FFE500', textShadow: '0 2px 16px rgba(255,200,0,0.5), 0 4px 0px rgba(0,0,0,0.15)' }}>
              현금,
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '5.8vh', lineHeight: 1.1, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,80,0.3)', whiteSpace: 'nowrap' }}>
              만 받은거징?
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom benefit chips */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-[1.8%] px-[5%] pb-[5%]">
        {BENEFITS.map((b, i) => (
          phase >= 3 && (
            <motion.div
              key={b.text}
              className="flex items-center gap-[3%] rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(255,255,255,0.4)', padding: '2% 4%' }}
              initial={{ opacity: 0, x: -22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{ fontSize: '3.2vh' }}>{b.icon}</span>
              <span style={{ fontSize: '2.8vh', color: 'white', fontWeight: 800, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>{b.text}</span>
            </motion.div>
          )
        ))}

        {phase >= 4 && (
          <motion.div
            className="rounded-2xl flex items-center justify-center gap-2 mt-[1%]"
            style={{ background: 'linear-gradient(90deg, #FFE500 0%, #FFCA00 100%)', padding: '3% 5%', boxShadow: '0 4px 20px rgba(255,200,0,0.5)' }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '4vh', color: '#0A2A8A' }}>지금 바로 가입하세요!</span>
            <span style={{ fontSize: '3vh' }}>→</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
