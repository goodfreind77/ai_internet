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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Deep royal blue to indigo-violet background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, #0d47a1 0%, #1a237e 35%, #311b92 65%, #0d47a1 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 30%, rgba(100,181,246,0.4) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 70% 70%, rgba(179,136,255,0.4) 0%, transparent 50%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.08) 0%, transparent 60%)',
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
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}
          >
            <span style={{ fontSize: '2.5vh' }}>📞</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.8vh',
              fontWeight: 700,
              color: '#ffffff',
              whiteSpace: 'nowrap',
            }}>
              인터넷 가입 상담전화
            </span>
          </motion.div>
        )}

        {/* Phone number — solid gold */}
        {phase >= 2 && (
          <motion.div
            className="flex items-baseline"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '5vh',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: '#fcd34d',
              textShadow: '0 2px 16px rgba(252,211,77,0.5)',
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
              color: '#bfdbfe',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            AI인터넷 전문 상담 센터
          </motion.p>
        )}

        {/* CTA — bright gold button */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'linear-gradient(90deg, #fbbf24 0%, #fcd34d 50%, #fbbf24 100%)',
              borderRadius: 14,
              padding: '2vh 0',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 6px 24px rgba(252,211,77,0.35)',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '2.8vh',
              fontWeight: 800,
              color: '#1a237e',
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
