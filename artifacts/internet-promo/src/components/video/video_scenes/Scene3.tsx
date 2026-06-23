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
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#ffffff' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-10%' }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle warm accent blobs on white */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 15% 15%, rgba(255,200,50,0.2) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 85% 85%, rgba(255,100,50,0.15) 0%, transparent 50%)',
      }} />

      {/* Gift image — light blend on white */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene3_gift.png`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.08 }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />

      <div className="relative z-10 w-[80%] flex flex-col items-center" style={{ gap: '4vh' }}>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            className="text-center w-full"
          >
            {/*
             * Split into 3 shorter lines so no character overflows the card.
             * Card content width (w-[80%]) = 45vh. Each line is ≤7 chars × 6vh = 42vh ✓
             */}
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '6.5vh',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              color: '#111827',
            }}>
              인터넷 최대
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '6.5vh',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              color: '#e65100',
            }}>
              사은품 혜택~!
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '5.5vh',
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              color: '#555',
            }}>
              받는 방법 알려드려요
            </p>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{
              borderRadius: 999,
              padding: '2vh 8%',
              background: 'linear-gradient(90deg, #e65100 0%, #f59e0b 100%)',
              boxShadow: '0 8px 32px rgba(230,81,0,0.3)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              color: '#ffffff',
              fontWeight: 900,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              AI인터넷
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
