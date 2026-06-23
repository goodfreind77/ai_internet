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
      {/* Background image */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene1_shh.png`}
        className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity"
        style={{ opacity: 0.6 }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/60 via-transparent to-[#0d1117]/70" />

      {/* Words — all appear together, centred, never clipped */}
      <div className="relative z-10 flex flex-col items-center" style={{ gap: '1vmin' }}>
        {words.map((word, wordIdx) => (
          <motion.div
            key={wordIdx}
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: wordIdx * 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                /*
                 * vmin = min(vw, vh). In a wide canvas iframe the card is
                 * height-constrained, so vmin == vh → font scales with card height.
                 * On a portrait phone vmin == vw → matches original intent.
                 * 12vmin keeps "몰랐던거" (4 chars) at 48vmin ≤ card width (56.25vmin).
                 */
                fontSize: '12vmin',
                lineHeight: 1.15,
                fontWeight: 900,
                color: '#fcd34d',
                textShadow:
                  '0 3px 10px rgba(0,0,0,0.95), 0 0 24px rgba(252,211,77,0.25)',
                whiteSpace: 'nowrap',
              }}
            >
              {word}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
