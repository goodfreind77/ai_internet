import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1200),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#0d1117]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-10%' }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene3_gift.png`}
        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity"
        style={{ opacity: 0.35 }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(13,17,23,0.55)' }} />

      <div className="relative z-10 w-[86%] flex flex-col items-center" style={{ gap: '5%' }}>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            className="text-center w-full"
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'min(7.5vw, 4.2vh)',
                lineHeight: 1.4,
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0,0,0,0.9)',
              }}
            >
              인터넷 최대 사은품,
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'min(8vw, 4.5vh)',
                lineHeight: 1.4,
                color: '#f59e0b',
                marginTop: '3%',
                textShadow:
                  '0 4px 20px rgba(245,158,11,0.4), 0 2px 10px rgba(0,0,0,0.9)',
              }}
            >
              혜택 받는 법~!
            </p>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{
              background: '#111827',
              border: '2px solid #fcd34d',
              borderRadius: 999,
              padding: '3% 8%',
              boxShadow:
                '0 10px 30px rgba(0,0,0,0.8), 0 0 24px rgba(252,211,77,0.2)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'min(9vw, 5.1vh)',
                color: '#fcd34d',
                fontWeight: 900,
                letterSpacing: '0.04em',
              }}
            >
              AI인터넷
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
