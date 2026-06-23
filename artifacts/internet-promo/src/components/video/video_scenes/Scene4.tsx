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
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #1a2332 0%, #0d1117 70%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 w-[80%] flex flex-col items-center" style={{ gap: '3vh' }}>

        {/* Badge */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: '#fcd34d',
              borderRadius: 999,
              padding: '1.5vh 6%',
              display: 'flex',
              alignItems: 'center',
              gap: '1vh',
            }}
          >
            <span style={{ fontSize: '2.5vh' }}>📞</span>
            {/* vh-only: "인터넷 가입 상담전화" always fits in card */}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8vh',
              fontWeight: 700,
              color: '#0d1117',
              whiteSpace: 'nowrap',
            }}>
              인터넷 가입 상담전화
            </span>
          </motion.div>
        )}

        {/* Phone number — "1666-3233" = 9 chars at 5vh = 45vh = 80% of card (56.25vh) ✓ */}
        {phase >= 2 && (
          <motion.div
            className="flex items-baseline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '5vh',
              fontWeight: 900,
              color: '#fcd34d',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textShadow: '0 3px 8px rgba(0,0,0,0.8)',
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
              color: '#9ca3af',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}
          >
            AI인터넷 전문 상담 센터
          </motion.p>
        )}

        {/* CTA */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: 14,
              padding: '2vh 0',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(245,158,11,0.25)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '2.8vh',
              fontWeight: 800,
              color: '#0d1117',
              whiteSpace: 'nowrap',
            }}>
              지금 바로 전화하세요
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
