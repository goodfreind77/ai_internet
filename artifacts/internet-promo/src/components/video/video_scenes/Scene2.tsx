import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BRANDS = [
  { name: 'SK', color: '#4b7baa' },
  { name: 'KT', color: '#aa4b4b' },
  { name: 'LG', color: '#aa4b7b' },
  { name: 'SKY', color: '#4b8a5a' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [setTimeout(() => setPhase(1), 200)];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#0d1117]"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Floating brand names background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => {
          const brand = BRANDS[i % BRANDS.length];
          return (
            <motion.div
              key={i}
              className="absolute font-black text-xl"
              style={{
                color: brand.color,
                left: `${(i * 17 + 5) % 90}%`,
                top: `${(i * 23 + 3) % 90}%`,
              }}
              animate={{
                x: [0, ((i % 3) - 1) * 80],
                y: [0, ((i % 5) - 2) * 60],
                rotate: [0, ((i % 7) - 3) * 40],
              }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, repeatType: 'reverse' }}
            >
              {i % 4 === 0 ? '✨' : brand.name}
            </motion.div>
          );
        })}
      </div>

      {/* Center card */}
      <motion.div
        className="relative z-10 text-center mx-6 px-6 py-8 rounded-2xl"
        style={{
          background: 'rgba(17,24,39,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(252,211,77,0.3)',
          boxShadow: '0 0 40px rgba(252,211,77,0.08)',
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.25 }}>
          <span className="block text-white" style={{ fontSize: '9.5vw', textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}>여기저기</span>
          <span className="block text-white" style={{ fontSize: '9.5vw', textShadow: '0 4px 16px rgba(0,0,0,0.9)' }}>찾아봐야</span>
          <span className="block text-[#fcd34d] mt-2" style={{ fontSize: '10vw', textShadow: '0 4px 20px rgba(252,211,77,0.3), 0 4px 16px rgba(0,0,0,0.9)' }}>
            눈만 아파! 😵‍💫
          </span>
        </h2>
      </motion.div>
    </motion.div>
  );
}
