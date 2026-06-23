import { motion } from 'framer-motion';

export function Scene1() {
  const words = ['너만', '몰랐던거', '알려줄께', '~!'];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#0d1117]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene1_shh.png`}
        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity"
        style={{ opacity: 0.6 }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/50 via-transparent to-[#0d1117]/60" />

      {/*
       * vh-only font sizing: vh is always iframe-height / 100, unaffected by
       * the viewport meta width=device-width.
       *
       * Card width = 100vh × 9/16 = 56.25vh.
       * At 7.5vh per char, "몰랐던거" (4 chars) = 30vh = 53% of card — safe margin.
       * Horizontal padding 10% keeps glow well inside overflow-hidden boundary.
       */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ gap: '1.5vh', paddingLeft: '10%', paddingRight: '10%' }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={word}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.12 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7.5vh',
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#fcd34d',
              textShadow: '0 3px 8px rgba(0,0,0,0.95)',
              whiteSpace: 'nowrap',
              display: 'block',
              textAlign: 'center',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
