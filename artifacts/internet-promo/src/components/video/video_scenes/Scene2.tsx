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
      {/* Floating brand names */}
      <div className="absolute inset-0 opacity-25">
        {[...Array(16)].map((_, i) => {
          const brand = BRANDS[i % BRANDS.length];
          return (
            <motion.div
              key={i}
              className="absolute font-black"
              style={{
                color: brand.color,
                fontSize: '3vh',
                left: `${(i * 19 + 5) % 85}%`,
                top: `${(i * 23 + 3) % 85}%`,
              }}
              animate={{
                x: [0, ((i % 3) - 1) * 40],
                y: [0, ((i % 5) - 2) * 30],
                rotate: [0, ((i % 7) - 3) * 30],
              }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, repeatType: 'reverse' }}
            >
              {i % 4 === 0 ? '✨' : brand.name}
            </motion.div>
          );
        })}
      </div>

      {/*
       * vh-only sizing. Card width = 56.25vh.
       * At 7vh per line, "여기저기" (4 chars) = 28vh = 49.8% of card. Safe.
       * Padding 10% keeps content and glow away from overflow-hidden edges.
       */}
      <motion.div
        className="relative z-10 w-[80%] px-5 py-7 rounded-2xl text-center"
        style={{
          background: 'rgba(17,24,39,0.88)',
          backdropFilter: 'blur(12px)',
          border: '1.5px solid rgba(252,211,77,0.3)',
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {['여기저기', '찾아봐야', '눈만 아파! 😵‍💫'].map((line, i) => (
          <span
            key={line}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              lineHeight: 1.3,
              display: 'block',
              color: i === 2 ? '#fcd34d' : '#ffffff',
              textShadow: '0 3px 8px rgba(0,0,0,0.9)',
              whiteSpace: 'nowrap',
            }}
          >
            {line}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
