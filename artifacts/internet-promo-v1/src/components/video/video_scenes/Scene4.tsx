import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 850),
      setTimeout(() => setPhase(3), 1650),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="absolute" style={{
        width: '85%', height: '55%', top: '22%',
        background: 'radial-gradient(ellipse, rgba(255,240,80,0.25) 0%, rgba(100,180,255,0.1) 50%, transparent 80%)',
        filter: 'blur(18px)',
      }} />

      {phase >= 1 && [1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: `${55 + i * 18}%`, height: `${27 + i * 9}%`, border: '2px solid rgba(255,230,80,0.3)' }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, delay: i * 0.45, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-[2.5%] px-[6%] w-full">
        {phase >= 1 && (
          <motion.div
            className="flex items-center gap-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,0.4)', padding: '1.8% 6%' }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42 }}
          >
            <span style={{ fontSize: '2.8vh' }}>✨</span>
            <span style={{ fontSize: '3vh', color: 'white', fontWeight: 800, letterSpacing: '0.04em' }}>인터넷 가입 상담 전화</span>
            <span style={{ fontSize: '2.8vh' }}>✨</span>
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            className="rounded-full flex items-center justify-center"
            style={{ width: '12vh', height: '12vh', background: 'linear-gradient(135deg, #FFE500 0%, #FFAA00 100%)', boxShadow: '0 0 40px rgba(255,220,0,0.55), 0 4px 16px rgba(0,0,0,0.2)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <span style={{ fontSize: '6vh' }}>📞</span>
          </motion.div>
        )}

        {phase >= 1 && (
          <motion.div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13.5vh',
              color: '#FFE500',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textShadow: '0 0 50px rgba(255,230,0,0.7), 0 4px 24px rgba(0,0,0,0.3)',
            }}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, type: 'spring', stiffness: 270, damping: 22 }}
          >
            1666-3233
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            style={{ fontSize: '2.8vh', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.05em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38 }}
          >
            인터넷 가입 전문 상담 센터
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            className="w-full rounded-full flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(90deg, #FFE500 0%, #FFCA00 100%)', padding: '4% 6%', boxShadow: '0 6px 28px rgba(255,210,0,0.5)' }}
            initial={{ opacity: 0, y: 22, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '5.5vh', color: '#0A2080' }}>지금 바로 전화하세요!</span>
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            className="flex gap-[3%] justify-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {['🕐 24시간 상담', '🚀 당일 가입', '🆓 설치비 무료'].map((t, i) => (
              <motion.div
                key={t}
                className="rounded-full"
                style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.4)', padding: '1.5% 4%', fontSize: '2.4vh', color: 'white', fontWeight: 700, backdropFilter: 'blur(8px)', whiteSpace: 'nowrap' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09 }}
              >
                {t}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
