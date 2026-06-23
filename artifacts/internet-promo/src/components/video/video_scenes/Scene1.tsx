import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [setTimeout(() => setPhase(1), 300)];
    return () => ts.forEach(clearTimeout);
  }, []);

  const words = ["너만", "몰랐던거", "알려줄께", "~!"];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col overflow-hidden bg-[#0d1117]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background image */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene1_shh.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      {/* Bottom dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent" />

      {/* Text block — top third, safely within frame */}
      <div className="relative z-10 w-full flex flex-col items-center" style={{ paddingTop: '12%' }}>
        <h1 className="flex flex-col items-center gap-1">
          {words.map((word, wordIdx) => (
            <div key={wordIdx} className="flex">
              {word.split('').map((char, charIdx) => {
                const i = wordIdx * 8 + charIdx;
                return (
                  <motion.span
                    key={charIdx}
                    className="inline-block"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '13.5vw',
                      lineHeight: 1.15,
                      color: '#fcd34d',
                      textShadow: '0 4px 12px rgba(0,0,0,0.9), 0 0 24px rgba(252,211,77,0.25)',
                    }}
                    initial={{ opacity: 0, y: 40, scale: 0.6, rotate: -15 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 300, damping: 14, delay: i * 0.07 }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </div>
          ))}
        </h1>
      </div>
    </motion.div>
  );
}
