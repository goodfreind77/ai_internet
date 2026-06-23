import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [setTimeout(() => setPhase(1), 200)];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: '0%' }}
      exit={{ opacity: 0, x: '-100%' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Teal-to-emerald-to-indigo vibrant background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, #00695c 0%, #004d90 40%, #1a237e 75%, #00897b 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 25%, rgba(0,230,180,0.5) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 80% 75%, rgba(100,120,255,0.45) 0%, transparent 50%)',
      }} />

      {/* Floating brand names (decorative) */}
      <div className="absolute inset-0 overflow-hidden opacity-15">
        {['SK', 'KT', 'LG', 'SKY', 'LG헬로', 'SK', 'KT', 'LG'].map((name, i) => (
          <motion.div
            key={i}
            className="absolute font-black text-white"
            style={{
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
          background: 'rgba(0,20,40,0.55)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          boxShadow: '0 0 40px rgba(0,0,0,0.4)',
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={phase >= 1 ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      >
        {[
          { text: '여기저기', color: '#ffffff' },
          { text: '찾아봐야', color: '#e0f7fa' },
          { text: '눈만 아파! 😵‍💫', color: '#fcd34d' },
        ].map((line) => (
          <span
            key={line.text}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7vh',
              lineHeight: 1.3,
              display: 'block',
              whiteSpace: 'nowrap',
              color: line.color,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}
          >
            {line.text}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
