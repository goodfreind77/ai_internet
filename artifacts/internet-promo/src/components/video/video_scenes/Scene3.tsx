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
      style={{ background: 'linear-gradient(160deg, #0a0a1f 0%, #0f1a0a 60%, #1a0f00 100%)' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-10%' }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene3_gift.png`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.3, mixBlendMode: 'luminosity' }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />

      {/* Colour glows */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 40%, rgba(16,185,129,0.3) 0%, transparent 55%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 75% 65%, rgba(245,158,11,0.25) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(5,10,5,0.6) 0%, transparent 30%, rgba(5,10,5,0.7) 100%)'
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
              background: 'linear-gradient(90deg, #6ee7b7 0%, #a7f3d0 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 10px rgba(16,185,129,0.5))',
            }}>
              인터넷 최대 사은품,
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              lineHeight: 1.35,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(90deg, #fcd34d 0%, #fb923c 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 12px rgba(251,146,60,0.5))',
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
              background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 50%, #d97706 100%)',
              boxShadow: '0 8px 32px rgba(124,58,237,0.4), 0 0 20px rgba(219,39,119,0.3)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              color: '#ffffff',
              fontWeight: 900,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}>
              AI인터넷
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
