import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';

export const SCENE_DURATIONS: Record<string, number> = {
  scene1: 5000,
  scene2: 5000,
  scene3: 4000,
  scene4: 4000,
};

const SCENE_COMPONENTS: Record<string, React.ComponentType> = {
  scene1: Scene1,
  scene2: Scene2,
  scene3: Scene3,
  scene4: Scene4,
};

const SCENE_START_SEC: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let ms = 0;
  for (const [key, dur] of Object.entries(SCENE_DURATIONS)) {
    out[key] = ms / 1000;
    ms += dur;
  }
  return out;
})();

/* Floating confetti squares */
const CONFETTI = [
  { top: '4%',  left: '8%',  color: '#FFD600', size: 8,  delay: 0,    dur: 2.2 },
  { top: '10%', left: '82%', color: '#FF4D6D', size: 6,  delay: 0.5,  dur: 1.8 },
  { top: '20%', left: '90%', color: '#00D97E', size: 9,  delay: 1.0,  dur: 2.4 },
  { top: '45%', left: '3%',  color: '#4DAFFF', size: 7,  delay: 0.3,  dur: 2.0 },
  { top: '60%', left: '94%', color: '#FFD600', size: 10, size2: 5, delay: 0.8,  dur: 1.9 },
  { top: '75%', left: '14%', color: '#FF4D6D', size: 6,  delay: 1.3,  dur: 2.3 },
  { top: '85%', left: '88%', color: '#00D97E', size: 8,  delay: 0.2,  dur: 2.1 },
  { top: '30%', left: '92%', color: '#4DAFFF', size: 5,  delay: 0.7,  dur: 2.5 },
  { top: '92%', left: '55%', color: '#FFD600', size: 7,  delay: 1.1,  dur: 2.2 },
];

function Confetti() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {CONFETTI.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-sm animate-twinkle"
          style={{
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.dur}s`,
            opacity: 0.85,
            transform: `rotate(${i * 23}deg)`,
          }}
        />
      ))}
      {/* Star sparkles */}
      {[
        { top: '8%',  left: '72%', delay: '0.4s' },
        { top: '18%', left: '7%',  delay: '1.1s' },
        { top: '55%', left: '88%', delay: '0.7s' },
      ].map((s, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-twinkle"
          style={{ top: s.top, left: s.left, width: 14, height: 14, animationDelay: s.delay }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2l1.9 5.8L20 12l-6.1 4.2L12 22l-1.9-5.8L4 12l6.1-4.2z" fill="#FFD600" />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function VideoTemplate({
  durations = SCENE_DURATIONS,
  loop = true,
  muted = false,
  onSceneChange,
}: {
  durations?: Record<string, number>;
  loop?: boolean;
  muted?: boolean;
  onSceneChange?: (sceneKey: string) => void;
} = {}) {
  const { currentSceneKey } = useVideoPlayer({ durations, loop });
  const baseSceneKey = currentSceneKey.replace(/_r[12]$/, '');
  const SceneComponent = SCENE_COMPONENTS[baseSceneKey];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    const target = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - target) > 0.25) audio.currentTime = target;
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  return (
    <>
      {/* Outer stage — bright sky blue */}
      <div
        className="w-full h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #C8E8FF 0%, #D8EEFF 50%, #BEE0FF 100%)' }}
      >
        {/* Portrait card 9:16 — bright vibrant blue */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '9 / 16',
            height: '100%',
            maxHeight: '100vh',
            maxWidth: 'calc(100vh * 9 / 16)',
            background: 'linear-gradient(160deg, #2A7FFF 0%, #1A65EE 40%, #0D50D8 100%)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 12px 60px rgba(26,101,238,0.45), 0 4px 24px rgba(0,0,0,0.2)',
          }}
        >
          {/* Top-centre bright spotlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 90% 55% at 50% 10%, rgba(255,255,255,0.22) 0%, transparent 65%)' }}
          />
          {/* Side highlights */}
          <div
            className="absolute top-0 left-0 w-1/2 h-1/3 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 0% 0%, rgba(100,200,255,0.18) 0%, transparent 70%)' }}
          />

          <Confetti />

          <AnimatePresence mode="popLayout">
            {SceneComponent && <SceneComponent key={currentSceneKey} />}
          </AnimatePresence>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}audio/bg_music.mp3`}
        preload="auto"
        autoPlay
        muted={muted}
      />
    </>
  );
}
