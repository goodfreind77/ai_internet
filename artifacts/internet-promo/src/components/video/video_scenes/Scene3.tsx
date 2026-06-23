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
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: '-10%' }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene3_gift.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      />

      <div className="relative z-10 w-full px-6 flex flex-col items-center gap-6">
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            className="text-center"
          >
            <h2 className="text-[8.5vw] font-black leading-tight text-white drop-shadow-lg" style={{ fontFamily: 'var(--font-display)' }}>
              인터넷 최대 사은품,
            </h2>
            <h2 className="text-[9vw] font-black leading-tight text-[#00E5FF] drop-shadow-lg mt-2" style={{ fontFamily: 'var(--font-display)' }}>
              혜택 받는법~!
            </h2>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="bg-white text-blue-700 px-8 py-4 rounded-full shadow-2xl border-4 border-[#00E5FF]"
          >
            <span className="text-[10vw] font-black" style={{ fontFamily: 'var(--font-display)' }}>AI인터넷</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}