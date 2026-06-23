import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const BRANDS = [
  { name: 'SK', color: '#0064D2' },
  { name: 'KT', color: '#E30000' },
  { name: 'LG', color: '#E5005A' },
  { name: 'KT스카이라이프', color: '#16A34A' },
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
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-zinc-900"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Chaotic background */}
      <div className="absolute inset-0 opacity-50">
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
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                rotate: [0, (Math.random() - 0.5) * 360],
              }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {i % 3 === 0 ? '🎁' : brand.name}
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="relative z-10 text-center px-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <h2 
          className="text-[12vw] font-black leading-tight"
          style={{
            fontFamily: 'var(--font-display)',
            color: '#FFE500',
            textShadow: '0 4px 16px rgba(0,0,0,0.8)',
          }}
        >
          여기저기<br/>
          찾아봐야<br/>
          <span className="text-white">눈만 아파!</span> 😵‍💫
        </h2>
      </motion.div>
    </motion.div>
  );
}