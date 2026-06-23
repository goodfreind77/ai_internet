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
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 w-full px-6 flex flex-col items-center gap-6">
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg"
          >
            <h2 className="text-[6vw] font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              인터넷 가입 상담전화
            </h2>
          </motion.div>
        )}

        {phase >= 2 && (
          <motion.div className="flex font-black text-blue-900 text-[16vw]" style={{ fontFamily: 'var(--font-display)' }}>
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
        )}
      </div>
    </motion.div>
  );
}