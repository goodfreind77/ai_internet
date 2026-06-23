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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-10%' }}
      transition={{ duration: 0.5 }}
    >
      {/* Warm coral-to-orange-to-crimson background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, #b71c1c 0%, #e65100 35%, #bf360c 65%, #880e4f 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 25% 30%, rgba(255,200,0,0.45) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 75% 70%, rgba(255,80,80,0.4) 0%, transparent 50%)',
      }} />

      {/* Gift image */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene3_gift.png`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.2, mixBlendMode: 'overlay' }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />
      {/* Darken bottom */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 100%)'
      }} />

      <div className="relative z-10 w-[80%] flex flex-col items-center" style={{ gap: '4vh' }}>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            className="text-center w-full"
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '6.5vh',
              lineHeight: 1.35,
              whiteSpace: 'nowrap',
              color: '#ffffff',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              인터넷 최대 사은품,
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              lineHeight: 1.35,
              whiteSpace: 'nowrap',
              color: '#fcd34d',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
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
              borderRadius: 999,
              padding: '2vh 8%',
              background: 'rgba(0,0,0,0.45)',
              border: '2.5px solid #fcd34d',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(252,211,77,0.25)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              color: '#fcd34d',
              fontWeight: 900,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}>
              AI인터넷
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
