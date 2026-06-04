import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REGIONS = ['서울', '부산', '인천', '대구', '대전', '광주', '수원', '고양', '용인', '성남', '창원', '제주', '울산', '청주', '전주'];
const NAMES = ['김*현', '이*준', '박*영', '최*민', '정*수', '강*진', '조*희', '윤*호', '장*아', '임*서', '한*지', '신*빈', '오*라', '서*원', '권*현'];
const PROVIDERS = ['SK브로드밴드', 'KT', 'LG유플러스', 'KT스카이라이프'];
const TIME_AGO = ['방금 전', '1분 전', '2분 전', '3분 전', '4분 전'];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

type TickerItem = {
  id: number;
  text: string;
};

export function RealtimeApplicants() {
  const [count, setCount] = useState(randomBetween(28, 42));
  const [ticker, setTicker] = useState<TickerItem[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const initial: TickerItem[] = Array.from({ length: 4 }, () => ({
      id: idRef.current++,
      text: `${randomItem(REGIONS)} ${randomItem(NAMES)}님이 ${randomItem(PROVIDERS)} 신청 중`,
    }));
    setTicker(initial);
  }, []);

  useEffect(() => {
    const countTimer = setInterval(() => {
      setCount(c => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        const next = c + delta;
        return Math.max(18, Math.min(58, next));
      });
    }, randomBetween(2500, 4000));
    return () => clearInterval(countTimer);
  }, []);

  useEffect(() => {
    const tickerTimer = setInterval(() => {
      const newItem: TickerItem = {
        id: idRef.current++,
        text: `${randomItem(REGIONS)} ${randomItem(NAMES)}님이 ${randomItem(PROVIDERS)} 신청 중`,
      };
      setTicker(prev => [newItem, ...prev.slice(0, 3)]);
    }, randomBetween(2000, 3500));
    return () => clearInterval(tickerTimer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-lg mb-10 rounded-2xl border border-red-200 bg-red-50 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-red-500 text-white">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="font-black text-sm tracking-tight">실시간 신청자 현황</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-0.5">
          <span className="font-black text-lg leading-none">{count}</span>
          <span className="text-xs font-semibold opacity-90">명 신청 중</span>
        </div>
      </div>

      {/* Ticker */}
      <div className="px-4 py-2 space-y-1.5">
        <AnimatePresence initial={false}>
          {ticker.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 text-xs text-gray-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span>{item.text}</span>
              <span className="text-gray-400 ml-auto flex-shrink-0">{randomItem(TIME_AGO)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200 text-center">
        <span className="text-xs font-black text-yellow-700">🔥 너빼고 다 신청중! 지금 바로 확인하세요</span>
      </div>
    </motion.div>
  );
}
