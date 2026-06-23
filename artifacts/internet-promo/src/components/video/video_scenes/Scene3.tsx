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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-10%' }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene3_gift.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-[#0d1117]/60" />

      <div className="relative z-10 w-full px-6 flex flex-col items-center gap-8">
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="text-center"
          >
            <h2 className="text-[8.5vw] font-black leading-tight text-white drop-shadow-2xl" style={{ fontFamily: 'var(--font-display)', textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
              인터넷 최대 사은품,
            </h2>
            <h2 className="text-[9vw] font-black leading-tight text-[#f59e0b] mt-3" style={{ fontFamily: 'var(--font-display)', textShadow: '0 4px 20px rgba(245,158,11,0.4), 0 2px 10px rgba(0,0,0,0.9)' }}>
              혜택 받는법~!
            </h2>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="bg-[#111827] text-[#fcd34d] px-8 py-4 rounded-full shadow-2xl border border-[#fcd34d]"
            style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(252,211,77,0.2)' }}
          >
            <span className="text-[10vw] font-black tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>AI인터넷</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}