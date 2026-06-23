import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 300),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  const textStr = "너만 몰랐던거 알려줄께 ~!";

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene1_shh.png`}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        initial={{ scale: 1.1, y: '5%' }}
        animate={{ scale: 1, y: '0%' }}
        transition={{ duration: 4, ease: "easeOut" }}
      />
      
      <div className="relative z-10 w-full px-4 pt-12" style={{ marginTop: '-40%' }}>
        <h1 className="text-center font-black flex flex-wrap justify-center gap-x-2 gap-y-1">
          {textStr.split(' ').map((word, wordIdx) => (
            <div key={wordIdx} className="flex">
              {word.split('').map((char, charIdx) => {
                const i = wordIdx * 10 + charIdx;
                return (
                  <motion.span
                    key={charIdx}
                    className="inline-block text-[11vw]"
                    style={{ 
                      fontFamily: 'var(--font-display)',
                      color: '#FFF',
                      textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
                      lineHeight: 1.1
                    }}
                    initial={{ opacity: 0, y: 50, scale: 0.5, rotate: -20 }}
                    animate={phase >= 1 ? { opacity: 1, y: 0, scale: 1, rotate: 0 } : {}}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 12,
                      delay: i * 0.08
                    }}
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