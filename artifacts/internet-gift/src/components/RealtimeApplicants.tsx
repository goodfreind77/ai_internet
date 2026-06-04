import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const REGIONS = ['서울', '부산', '인천', '대구', '대전', '광주', '수원', '고양', '용인', '성남', '창원', '제주', '울산', '청주', '전주', '포항'];
const NAMES = ['김*현', '이*준', '박*영', '최*민', '정*수', '강*진', '조*희', '윤*호', '장*아', '임*서', '한*지', '신*빈', '오*라', '서*원', '권*현', '홍*기'];
const STATUSES = ['접수완료', '설치완료', '접수완료', '설치완료', '설치완료', '상담중', '설치완료', '설치완료', '접수완료', '설치완료'];
const GIFTS = ['현금 10만원', '현금 15만원', '상품권 5만원', '현금 20만원', '갤럭시탭', '에어팟', '현금 8만원', '현금 12만원'];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function nowMinutes(offset = 0) {
  const d = new Date(Date.now() - offset * 60000);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${mm}/${dd} ${hh}:${min}`;
}

type Row = {
  id: number;
  date: string;
  region: string;
  name: string;
  status: string;
  gift: string;
};

function giftForStatus(status: string): string {
  if (status === '설치완료') return '입금완료';
  if (status === '접수완료') return '입금대기';
  if (status === '상담중') return '입금대기';
  return randomItem(GIFTS);
}

function makeRow(id: number, offsetMin = 0): Row {
  const status = randomItem(STATUSES);
  return {
    id,
    date: nowMinutes(offsetMin),
    region: randomItem(REGIONS),
    name: randomItem(NAMES),
    status,
    gift: giftForStatus(status),
  };
}

export function RealtimeApplicants() {
  const [, setLocation] = useLocation();
  const [count, setCount] = useState(randomBetween(28, 42));
  const [rows, setRows] = useState<Row[]>(() =>
    Array.from({ length: 8 }, (_, i) => makeRow(i, (8 - i) * 2))
  );
  const idRef = useRef(8);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => Math.max(20, Math.min(62, c + (Math.random() < 0.55 ? 1 : -1))));
    }, randomBetween(2500, 4000));
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setRows(prev => [makeRow(idRef.current++, 0), ...prev.slice(0, 7)]);
    }, randomBetween(2500, 4000));
    return () => clearInterval(t);
  }, []);

  const statusColor = (s: string) => {
    if (s === '설치완료') return 'text-green-600 font-bold';
    if (s === '접수완료') return 'text-blue-600 font-bold';
    if (s === '상담중') return 'text-orange-500 font-bold';
    return 'text-purple-600 font-bold';
  };

  const giftColor = (gift: string) => {
    if (gift === '입금완료') return 'text-green-600 font-bold';
    if (gift === '입금대기') return 'text-gray-500 font-semibold';
    return 'text-red-600 font-bold';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-14">
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">

        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-red-500 text-white">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <span className="font-black text-base">실시간 신청자 현황</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full px-4 py-1 flex items-center gap-1.5">
              <span className="font-black text-xl leading-none">{count}</span>
              <span className="text-sm font-semibold opacity-90">명 신청중</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row">
          {/* Table section */}
          <div className="flex-1 bg-white overflow-hidden">
            {/* Column headers */}
            <div className="grid grid-cols-5 bg-gray-100 border-b border-gray-200 text-xs font-black text-gray-600">
              <div className="px-3 py-2 text-center">날짜</div>
              <div className="px-3 py-2 text-center">지역</div>
              <div className="px-3 py-2 text-center">이름</div>
              <div className="px-3 py-2 text-center">접수현황</div>
              <div className="px-3 py-2 text-center">사은품</div>
            </div>

            {/* Rows */}
            <div className="overflow-hidden">
              <AnimatePresence initial={false}>
                {rows.map((row, idx) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: -28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`grid grid-cols-5 text-xs border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <div className="px-2 py-2.5 text-center text-gray-500 whitespace-nowrap">{row.date}</div>
                    <div className="px-2 py-2.5 text-center font-semibold text-gray-800">{row.region}</div>
                    <div className="px-2 py-2.5 text-center text-gray-700">{row.name}</div>
                    <div className={`px-2 py-2.5 text-center ${statusColor(row.status)}`}>{row.status}</div>
                    <div className={`px-2 py-2.5 text-center ${giftColor(row.gift)}`}>{row.gift}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-gray-200" />

          {/* Right — 비밀 지원금 */}
          <div className="sm:w-56 bg-gradient-to-br from-orange-50 to-red-50 flex flex-col items-center justify-center px-5 py-6 gap-3 text-center">
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
    </div>
  );
}
