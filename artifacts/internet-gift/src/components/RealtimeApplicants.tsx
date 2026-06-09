import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';

const REGIONS = ['서울', '부산', '인천', '대구', '대전', '광주', '수원', '고양', '용인', '성남', '창원', '제주', '울산', '청주', '전주', '포항'];
const NAMES = ['김*현', '이*준', '박*영', '최*민', '정*수', '강*진', '조*희', '윤*호', '장*아', '임*서', '한*지', '신*빈', '오*라', '서*원', '권*현', '홍*기'];
const STATUSES = ['접수완료', '설치완료', '접수완료', '설치완료', '설치완료', '상담중', '설치완료', '설치완료', '접수완료', '설치완료'];

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

type Row = { id: number; date: string; region: string; name: string; status: string; gift: string };

function giftForStatus(status: string): string {
  if (status === '설치완료') return '입금완료';
  if (status === '접수완료') return '입금대기';
  if (status === '상담중') return '입금대기';
  return '입금대기';
}
function makeRow(id: number, offsetMin = 0): Row {
  const status = randomItem(STATUSES);
  return { id, date: nowMinutes(offsetMin), region: randomItem(REGIONS), name: randomItem(NAMES), status, gift: giftForStatus(status) };
}

export function RealtimeApplicants() {
  const [, setLocation] = useLocation();
  const [count, setCount] = useState(randomBetween(28, 42));
  const [rows, setRows] = useState<Row[]>(() =>
    Array.from({ length: 7 }, (_, i) => makeRow(i, (7 - i) * 2))
  );
  const idRef = useRef(7);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => Math.max(20, Math.min(62, c + (Math.random() < 0.55 ? 1 : -1))));
    }, 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      idRef.current += 1;
      setRows(prev => [makeRow(idRef.current), ...prev.slice(0, 6)]);
    }, 2800);
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
    return 'text-gray-400 font-semibold';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-14">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">

        {/* ── 왼쪽: 실시간 신청자 표 ── */}
        <div className="flex-1 rounded-2xl overflow-hidden border border-orange-200 shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 bg-red-500 text-white">
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

          {/* Column headers */}
          <div className="grid grid-cols-4 bg-orange-50 border-b border-orange-100 text-xs font-black text-gray-600">
            <div className="px-3 py-2 text-center">날짜</div>
            <div className="px-3 py-2 text-center">이름(지역)</div>
            <div className="px-3 py-2 text-center">접수현황</div>
            <div className="px-3 py-2 text-center">사은품</div>
          </div>

          {/* Rows */}
          <div className="bg-white overflow-hidden">
            <AnimatePresence initial={false}>
              {rows.map((row, idx) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`grid grid-cols-4 text-xs border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50/40'}`}
                >
                  <div className="px-2 py-2.5 text-center text-gray-400 whitespace-nowrap">{row.date}</div>
                  <div className="px-2 py-2.5 text-center font-semibold text-gray-800">{row.name} ({row.region})</div>
                  <div className={`px-2 py-2.5 text-center ${statusColor(row.status)}`}>{row.status}</div>
                  <div className={`px-2 py-2.5 text-center ${giftColor(row.gift)}`}>{row.gift}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── 오른쪽: CTA 박스 ── */}
        <div className="lg:w-72 flex flex-col gap-4">
          {/* 빠른 상담 카드 */}
          <div className="rounded-2xl border-2 border-orange-300 bg-white shadow-md p-6 flex flex-col items-center text-center">
            <div className="text-3xl mb-2">📞</div>
            <p className="text-xs font-bold text-orange-500 mb-1">가입상담 (연중무휴)</p>
            <a href="tel:16663233" className="text-2xl font-black text-gray-900 tracking-tight mb-4">1666-3233</a>
            <button
              onClick={() => setLocation('/apply')}
              className="w-full py-3 rounded-xl text-white font-black text-sm shadow"
              style={{ background: 'linear-gradient(135deg, #ea580c, #f97316)' }}
            >
              신청서 작성하기 →
            </button>
            <p className="text-[11px] text-gray-400 mt-2">3년약정 기준 · VAT 포함</p>
          </div>

          {/* 혜택 요약 */}
          <div className="rounded-2xl bg-orange-500 text-white p-5 shadow-md">
            <p className="text-xs font-bold opacity-80 mb-2">🎁 지금 가입하면</p>
            <ul className="space-y-1.5 text-sm font-semibold">
              <li className="flex items-center gap-2"><span className="text-yellow-300">✓</span> 최대 현금 사은품 지급</li>
              <li className="flex items-center gap-2"><span className="text-yellow-300">✓</span> 당일 설치 가능</li>
              <li className="flex items-center gap-2"><span className="text-yellow-300">✓</span> 비밀 추가 지원금</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
