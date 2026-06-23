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
      {/* Subtle gold ring glow */}
      <div
        className="absolute"
        style={{
          width: '70%',
          height: '35%',
          top: '32%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(252,211,77,0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10 w-full px-5 flex flex-col items-center gap-5">
        {/* Badge */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              background: '#fcd34d',
              borderRadius: 999,
              padding: '2.5% 7%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: '4.5vw' }}>📞</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '5vw',
                fontWeight: 700,
                color: '#0d1117',
                whiteSpace: 'nowrap',
              }}
            >
              인터넷 가입 상담전화
            </span>
          </motion.div>
        )}

        {/* Phone number */}
        {phase >= 2 && (
          <motion.div
            className="flex items-baseline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13.5vw',
              fontWeight: 900,
              color: '#fcd34d',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textShadow: '0 0 40px rgba(252,211,77,0.35), 0 4px 16px rgba(0,0,0,0.8)',
            }}
          >
            {phone.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, duration: 0.22 }}
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
            transition={{ delay: 1.1 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '4vw',
              color: '#9ca3af',
              letterSpacing: '0.06em',
            }}
          >
            AI인터넷 전문 상담 센터
          </motion.p>
        )}

        {/* CTA button */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: 16,
              padding: '4% 0',
              width: '80%',
              textAlign: 'center',
              boxShadow: '0 8px 28px rgba(245,158,11,0.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '5vw',
                fontWeight: 800,
                color: '#0d1117',
              }}
            >
              지금 바로 전화하세요
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
