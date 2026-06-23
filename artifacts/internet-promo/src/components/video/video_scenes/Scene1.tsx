import { motion } from 'framer-motion';

export function Scene1() {
  const words = ['너만', '몰랐던거', '알려줄께', '~!'];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a0533 0%, #0d0d1a 40%, #001a33 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background image */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene1_shh.png`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.45, mixBlendMode: 'luminosity' }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />

      {/* Colour overlays */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 20% 30%, rgba(139,92,246,0.35) 0%, transparent 60%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 80% 70%, rgba(236,72,153,0.25) 0%, transparent 55%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(10,5,30,0.55) 0%, transparent 35%, rgba(10,5,30,0.65) 100%)'
      }} />

      {/* Text */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ gap: '1.5vh', paddingLeft: '10%', paddingRight: '10%' }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={word}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.14 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '7.5vh',
              fontWeight: 900,
              lineHeight: 1.1,
              display: 'block',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              /* Purple → Gold gradient text */
              background: idx % 2 === 0
                ? 'linear-gradient(135deg, #f0abfc 0%, #fcd34d 60%, #fb923c 100%)'
                : 'linear-gradient(135deg, #fcd34d 0%, #f0abfc 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 8px rgba(139,92,246,0.5))',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
