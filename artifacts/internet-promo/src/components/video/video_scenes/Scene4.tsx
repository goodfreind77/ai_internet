import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 1000),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const phone = "1666-3233";

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #1a2332 0%, #0d1117 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 w-full px-6 flex flex-col items-center gap-8">
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#fcd34d] text-[#0d1117] px-8 py-2.5 rounded-full shadow-lg border border-[#fbbf24] flex items-center gap-2"
          >
            <span className="text-xl">📞</span>
            <h2 className="text-[5vw] font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              인터넷 가입 상담전화
            </h2>
          </motion.div>
        )}

        {phase >= 2 && (
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              className="flex font-black text-[#fcd34d] text-[16vw] tracking-tighter" 
              style={{ 
                fontFamily: 'var(--font-display)',
                textShadow: '0 0 30px rgba(252,211,77,0.4), 0 4px 10px rgba(0,0,0,0.8)'
              }}
            >
              {phone.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.2 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-[#9ca3af] text-lg font-medium tracking-wide"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              AI인터넷 전문 상담 센터
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring' }}
              className="mt-4 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0d1117] font-bold text-xl px-10 py-4 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] w-full max-w-xs"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              지금 바로 전화하세요
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}