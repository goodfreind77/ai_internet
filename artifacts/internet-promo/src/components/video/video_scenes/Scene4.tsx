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
      {/* Ambient glow */}
      <div
        className="absolute"
        style={{
          width: '60%',
          height: '30%',
          top: '35%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(252,211,77,0.07) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative z-10 w-[84%] flex flex-col items-center" style={{ gap: '4%' }}>
        {/* Badge */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{
              background: '#fcd34d',
              borderRadius: 999,
              padding: '2% 6%',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 'min(4vw, 2.25vh)' }}>📞</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                /* "인터넷 가입 상담전화" = 11 chars — cap by vh to fit card */
                fontSize: 'min(4.5vw, 2.5vh)',
                fontWeight: 700,
                color: '#0d1117',
                whiteSpace: 'nowrap',
              }}
            >
              인터넷 가입 상담전화
            </span>
          </motion.div>
        )}

        {/* Phone number — "1666-3233" = 9 chars, capped to fit card width */}
        {phase >= 2 && (
          <motion.div
            className="flex items-baseline"
            style={{
              fontFamily: 'var(--font-display)',
              /* 9 chars × font-size ≤ card width; min(10.5vw, 5.9vh) stays within 527px on canvas */
              fontSize: 'min(10.5vw, 5.9vh)',
              fontWeight: 900,
              color: '#fcd34d',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textShadow:
                '0 0 40px rgba(252,211,77,0.35), 0 4px 16px rgba(0,0,0,0.8)',
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
              fontSize: 'min(3.8vw, 2.1vh)',
              color: '#9ca3af',
              letterSpacing: '0.06em',
            }}
          >
            AI인터넷 전문 상담 센터
          </motion.p>
        )}

        {/* CTA */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
              borderRadius: 14,
              padding: '3.5% 0',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 8px 28px rgba(245,158,11,0.3)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'min(4.5vw, 2.5vh)',
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
