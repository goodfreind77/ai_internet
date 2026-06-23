import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';

export const SCENE_DURATIONS: Record<string, number> = {
  scene1: 5000,
  scene2: 4000,
  scene3: 5000,
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

const NARRATION_TEXT = '인터넷 가입, 이제 AI가 직접 추천해 드립니다. SK, KT, LG 전 통신사 비교부터 신청까지 한 번에! 지금 바로 상담받으세요. 1666-3233';

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
  const prevBaseSceneKey = useRef<string>('');

  useEffect(() => {
    onSceneChange?.(currentSceneKey);
  }, [currentSceneKey, onSceneChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    const target = SCENE_START_SEC[baseSceneKey] ?? 0;
    if (Math.abs(audio.currentTime - target) > 0.25) audio.currentTime = target;
    audio.play().catch(() => {});
  }, [currentSceneKey, baseSceneKey, muted]);

  useEffect(() => {
    if (muted) return;
    if (!('speechSynthesis' in window)) return;
    if (baseSceneKey !== 'scene1') return;
    if (prevBaseSceneKey.current === 'scene1') return;
    prevBaseSceneKey.current = 'scene1';

    const speak = () => {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(NARRATION_TEXT);
      utter.lang = 'ko-KR';
      utter.rate = 1.05;
      utter.pitch = 1.7;
      utter.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const koVoices = voices.filter(v => v.lang.startsWith('ko'));
      const femaleKeywords = ['female', 'woman', 'yuna', 'heami', 'seoyeon', 'google 여성', '여성', 'google 한국어', 'korean'];
      const femaleVoice = koVoices.find(v => femaleKeywords.some(k => v.name.toLowerCase().includes(k))) || koVoices[0];
      if (femaleVoice) utter.voice = femaleVoice;

      window.speechSynthesis.speak(utter);
    };

    const timer = setTimeout(() => {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = speak;
      } else {
        speak();
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [baseSceneKey, muted]);

  useEffect(() => {
    if (baseSceneKey !== 'scene1') {
      prevBaseSceneKey.current = baseSceneKey;
    }
  }, [baseSceneKey]);

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div
          className="relative overflow-hidden w-full h-full"
          style={{
            aspectRatio: '9 / 16',
            maxHeight: '100vh',
            maxWidth: 'calc(100vh * 9 / 16)',
            backgroundColor: '#000',
            fontFamily: 'var(--font-body)',
          }}
        >
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