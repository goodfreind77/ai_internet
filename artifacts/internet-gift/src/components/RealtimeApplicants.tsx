import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const REGIONS = ['서울', '부산', '인천', '대구', '대전', '광주', '수원', '고양', '용인', '성남', '창원', '제주', '울산', '청주', '전주'];
const NAMES = ['김*현', '이*준', '박*영', '최*민', '정*수', '강*진', '조*희', '윤*호', '장*아', '임*서', '한*지', '신*빈', '오*라', '서*원', '권*현'];
const PROVIDERS = ['SK브로드밴드', 'KT', 'LG유플러스', 'KT스카이라이프'];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type TickerItem = { id: number; text: string };

export function RealtimeApplicants() {
  const [, setLocation] = useLocation();
  const [count, setCount] = useState(randomBetween(28, 42));
  const [ticker, setTicker] = useState<TickerItem[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    setTicker(Array.from({ length: 4 }, () => ({
      id: idRef.current++,
      text: `${randomItem(REGIONS)} ${randomItem(NAMES)}님 ${randomItem(PROVIDERS)} 신청 중`,
    })));
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => Math.max(18, Math.min(58, c + (Math.random() < 0.5 ? 1 : -1))));
    }, randomBetween(2500, 4000));
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTicker(prev => [
        { id: idRef.current++, text: `${randomItem(REGIONS)} ${randomItem(NAMES)}님 ${randomItem(PROVIDERS)} 신청 중` },
        ...prev.slice(0, 3),
      ]);
    }, randomBetween(2000, 3500));
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-14">
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md flex flex-col sm:flex-row">

        {/* Left — 실시간 신청자 현황 */}
        <div className="flex-1 bg-white">
          <div className="flex items-center justify-between px-4 py-2.5 bg-red-500 text-white">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
              </span>
              <span className="font-black text-sm">실시간 신청자 현황</span>
            </div>
            <div className="bg-white/20 rounded-full px-3 py-0.5 flex items-center gap-1">
              <span className="font-black text-lg leading-none">{count}</span>
              <span className="text-xs font-semibold opacity-90">명 신청중</span>
            </div>
          </div>

          <div className="px-4 py-3 space-y-2 min-h-[110px]">
            <AnimatePresence initial={false}>
              {ticker.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 text-xs text-gray-700"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-center">
            <span className="text-xs font-black text-yellow-700">🔥 너빼고 다 신청중!</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-gray-200" />

        {/* Right — 비밀 지원금 */}
        <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 flex flex-col items-center justify-center px-5 py-5 gap-3 text-center">
          <div className="text-xs font-bold text-gray-500 tracking-wide">📢 공식 홈페이지엔 안보임</div>
          <p className="font-black text-gray-900 text-base leading-snug">
            오직 여기서만 가능한<br />
            <span className="text-primary">지원금 이벤트!</span>
          </p>
          <p className="text-sm text-gray-600 font-semibold">💰 현금 주는건 비밀~!</p>
          <button
            onClick={() => setLocation('/tip')}
            className="mt-1 w-full bg-primary text-white font-black py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            🎁 비밀 지원금 확인하기
          </button>
        </div>

      </div>
    </div>
  );
}
