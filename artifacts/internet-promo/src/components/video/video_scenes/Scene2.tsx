import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BRANDS = [
  { name: 'SK', color: '#4b5563' },
  { name: 'KT', color: '#6b7280' },
  { name: 'LG', color: '#4b5563' },
  { name: 'KT스카이라이프', color: '#6b7280' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 200),
    ];
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
      {/* Chaotic background */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(24)].map((_, i) => {
          const brand = BRANDS[i % BRANDS.length];
          return (
            <motion.div
              key={i}
              className="absolute font-black text-2xl flex items-center justify-center gap-1"
              style={{
                color: brand.color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                rotate: [0, (Math.random() - 0.5) * 360],
              }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {i % 3 === 0 ? <span className="opacity-30">✨</span> : brand.name}
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="relative z-10 text-center px-8 py-10 rounded-2xl bg-[#111827]/80 backdrop-blur-md border border-[#fcd34d]/30"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ boxShadow: '0 0 40px rgba(252,211,77,0.1)' }}
      >
        <h2 
          className="text-[11vw] font-black leading-tight"
          style={{
            fontFamily: 'var(--font-display)',
            textShadow: '0 4px 16px rgba(0,0,0,0.9)',
          }}
        >
          <span className="text-white block mb-2 text-[10vw]">여기저기</span>
          <span className="text-white block mb-4 text-[10vw]">찾아봐야</span>
          <span className="text-[#fcd34d] block relative">눈만 아파!
            <motion.span 
              className="absolute -inset-4 border-2 border-[#fcd34d] rounded-xl opacity-0"
              animate={{ opacity: [0, 0.5, 0], scale: [0.95, 1.05, 1.1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </span>
        </h2>
      </motion.div>
    </motion.div>
  );
}