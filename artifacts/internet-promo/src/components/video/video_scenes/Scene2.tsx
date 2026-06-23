import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ORBS = [
  { color: '#7c3aed', x: '15%', y: '20%', size: '40%' },
  { color: '#db2777', x: '70%', y: '60%', size: '35%' },
  { color: '#0891b2', x: '50%', y: '10%', size: '30%' },
  { color: '#d97706', x: '20%', y: '75%', size: '25%' },
];

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [setTimeout(() => setPhase(1), 200)];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#080818' }}
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Coloured ambient orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size, height: orb.size,
            left: orb.x, top: orb.y,
            background: orb.color,
            filter: 'blur(60px)',
            opacity: 0.4,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}

      {/* Floating brand labels */}
      <div className="absolute inset-0 opacity-20">
        {['SK', 'KT', 'LG', 'SKY', 'LG헬로', 'SK', 'KT', 'LG'].map((name, i) => (
          <motion.div
            key={i}
            className="absolute font-black"
            style={{
              color: ['#a78bfa', '#f472b6', '#38bdf8', '#34d399'][i % 4],
              fontSize: '2.8vh',
              left: `${(i * 21 + 5) % 82}%`,
              top: `${(i * 27 + 7) % 82}%`,
            }}
            animate={{
              x: [0, ((i % 3) - 1) * 35],
              y: [0, ((i % 5) - 2) * 25],
              rotate: [0, ((i % 7) - 3) * 25],
            }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, repeatType: 'reverse' }}
          >
            {name}
          </motion.div>
        ))}
      </div>

      {/* Card */}
      <motion.div
        className="relative z-10 w-[80%] rounded-2xl text-center"
        style={{
          padding: '5% 6%',
          background: 'rgba(15,8,40,0.75)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(167,139,250,0.4)',
          boxShadow: '0 0 40px rgba(124,58,237,0.2), inset 0 0 20px rgba(167,139,250,0.05)',
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {[
          { text: '여기저기', color: '#e0e7ff' },
          { text: '찾아봐야', color: '#c4b5fd' },
          { text: '눈만 아파! 😵‍💫', gradient: 'linear-gradient(90deg, #f9a8d4 0%, #fcd34d 50%, #fb923c 100%)' },
        ].map((line, i) => (
          <span
            key={line.text}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              lineHeight: 1.3,
              display: 'block',
              whiteSpace: 'nowrap',
              ...(line.gradient
                ? {
                    background: line.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 6px rgba(252,211,77,0.4))',
                  }
                : {
                    color: line.color,
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }),
            }}
          >
            {line.text}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
