import { motion } from 'framer-motion';

export function Scene1() {
  const words = ['너만', '몰랐던거', '알려줄께', '~!'];

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {/* Rich purple-to-blue-to-magenta gradient background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(145deg, #4f008c 0%, #1a0050 25%, #00208c 55%, #8c0066 100%)',
      }} />

      {/* Colour blobs */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 15% 20%, rgba(255,100,200,0.5) 0%, transparent 45%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 85% 80%, rgba(0,180,255,0.45) 0%, transparent 45%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(120,0,200,0.3) 0%, transparent 60%)',
      }} />

      {/* Background image sits on top of colour, blended */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/scene1_shh.png`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.25, mixBlendMode: 'overlay' }}
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: 'easeOut' }}
      />

      {/* Text — solid gold, crisp */}
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
              color: '#fcd34d',
              textShadow: '0 2px 16px rgba(0,0,0,0.6)',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
