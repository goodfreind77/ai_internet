import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1800),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const phone = '1666-3233';

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d001a 0%, #000d1a 50%, #1a0d00 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient colour orbs */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 25% 35%, rgba(124,58,237,0.4) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 75% 65%, rgba(236,72,153,0.3) 0%, transparent 50%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.25) 0%, transparent 45%)'
      }} />

      <div className="relative z-10 w-[80%] flex flex-col items-center" style={{ gap: '3vh' }}>

        {/* Badge */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              borderRadius: 999,
              padding: '1.5vh 6%',
              display: 'flex',
              alignItems: 'center',
              gap: '1vh',
              background: 'linear-gradient(90deg, #7c3aed 0%, #db2777 100%)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            }}
          >
            <span style={{ fontSize: '2.5vh' }}>📞</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8vh',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              인터넷 가입 상담전화
            </span>
          </motion.div>
        )}

        {/* Phone number with gradient */}
        {phase >= 2 && (
          <motion.div
            className="flex items-baseline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '5vh',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              background: 'linear-gradient(90deg, #fcd34d 0%, #fb923c 40%, #f472b6 70%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 10px rgba(252,211,77,0.5))',
            }}
          >
            {phone.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.2 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Subtitle */}
        {phase >= 2 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '2.2vh',
              color: '#c4b5fd',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            AI인터넷 전문 상담 센터
          </motion.p>
        )}

        {/* CTA — rainbow gradient */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(90deg, #7c3aed 0%, #db2777 35%, #f59e0b 65%, #10b981 100%)',
              borderRadius: 14,
              padding: '2vh 0',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 6px 24px rgba(124,58,237,0.35)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '2.8vh',
              fontWeight: 800,
              color: '#ffffff',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}>
              지금 바로 전화하세요
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
