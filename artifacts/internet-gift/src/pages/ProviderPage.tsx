import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ChevronDown, Wifi, Tv, Box, Smartphone, PhoneCall, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Provider = {
  key: string;
  name: string;
  color: string;
  plans: Plan[];
};

type Plan = {
  name: string;
  internet: string;
  monthlyFee: number;
  gift: number;
  features: string[];
  badge?: string;
};

const PROVIDERS: Record<string, Provider> = {
  sk: {
    key: 'sk',
    name: 'SK브로드밴드',
    color: '#E60000',
    plans: [
      {
        name: '기가라이트인터넷 + B TV ALL',
        internet: '500MB',
        monthlyFee: 44000,
        gift: 470000,
        features: ['500MB 기가 인터넷', 'B TV ALL (200여개 채널)', 'WiFi 공유기 무료 제공', '설치비 무료'],
        badge: 'HOT',
      },
      {
        name: '기가인터넷 + B TV All',
        internet: '1GB',
        monthlyFee: 55000,
        gift: 520000,
        features: ['1GB 기가 인터넷', 'B TV All (250여개 채널)', '기가 WiFi 공유기 무료 제공', '설치비 무료'],
        badge: '인기',
      },
      {
        name: '광랜인터넷 + B tv 스탠다드',
        internet: '100MB',
        monthlyFee: 33000,
        gift: 300000,
        features: ['100MB 광랜 인터넷', 'B tv 스탠다드', 'WiFi 공유기 제공', '설치비 무료'],
      },
    ],
  },
  kt: {
    key: 'kt',
    name: 'KT 올레',
    color: '#000000',
    plans: [
      {
        name: '기가인터넷 + 지니 TV 베이직',
        internet: '500MB',
        monthlyFee: 44000,
        gift: 450000,
        features: ['500MB 기가 인터넷', '지니 TV 베이직 (100여개 채널)', '기가 WiFi 제공', '설치비 무료'],
        badge: '인기',
      },
      {
        name: '기가프리미엄 + 지니 TV 프리미엄',
        internet: '1GB',
        monthlyFee: 60000,
        gift: 560000,
        features: ['1GB 기가 인터넷', '지니 TV 프리미엄 (230여개 채널)', '기가 WiFi 6 제공', '설치비 무료'],
        badge: 'HOT',
      },
      {
        name: '슬림인터넷 단독',
        internet: '100MB',
        monthlyFee: 27500,
        gift: 250000,
        features: ['100MB 인터넷', 'TV 미포함', 'WiFi 제공', '설치비 무료'],
      },
    ],
  },
  lg: {
    key: 'lg',
    name: 'LG유플러스',
    color: '#E5005A',
    plans: [
      {
        name: '기가인터넷 + U+tv 프리미엄',
        internet: '500MB',
        monthlyFee: 44000,
        gift: 470000,
        features: ['500MB 기가 인터넷', 'U+tv 프리미엄 (200여개 채널)', '기가 WiFi 6 제공', '설치비 무료'],
        badge: 'HOT',
      },
      {
        name: '10기가 인터넷 + U+tv 프리미엄',
        internet: '10GB',
        monthlyFee: 77000,
        gift: 650000,
        features: ['10GB 초고속 인터넷', 'U+tv 프리미엄', '기가 WiFi 6E 제공', '설치비 무료'],
        badge: '신상품',
      },
      {
        name: '광랜인터넷 단독',
        internet: '100MB',
        monthlyFee: 22000,
        gift: 220000,
        features: ['100MB 인터넷', 'TV 미포함', 'WiFi 제공', '설치비 무료'],
      },
    ],
  },
  skylife: {
    key: 'skylife',
    name: 'KT스카이라이프',
    color: '#0047AB',
    plans: [
      {
        name: '스카이라이프 기가인터넷 + HD방송',
        internet: '500MB',
        monthlyFee: 44000,
        gift: 380000,
        features: ['500MB 기가 인터넷', 'HD방송 100여개 채널', '위성방송 수신', '설치비 무료'],
        badge: '인기',
      },
      {
        name: '스카이라이프 UHD방송 프리미엄',
        internet: '500MB',
        monthlyFee: 55000,
        gift: 440000,
        features: ['500MB 기가 인터넷', 'UHD방송 150여개 채널', '위성방송 수신', '설치비 무료'],
        badge: 'HOT',
      },
    ],
  },
  hellovision: {
    key: 'hellovision',
    name: 'LG헬로비전',
    color: '#FF6600',
    plans: [
      {
        name: '헬로 기가인터넷 + 케이블TV',
        internet: '500MB',
        monthlyFee: 38500,
        gift: 350000,
        features: ['500MB 기가 인터넷', '케이블 TV 80여개 채널', 'WiFi 공유기 제공', '설치비 무료'],
        badge: '인기',
      },
      {
        name: '헬로 기가프리미엄 + VOD무제한',
        internet: '1GB',
        monthlyFee: 49500,
        gift: 430000,
        features: ['1GB 기가 인터넷', 'VOD 무제한 이용', 'WiFi 6 공유기 제공', '설치비 무료'],
        badge: 'HOT',
      },
    ],
  },
  card: {
    key: 'card',
    name: '제휴카드',
    color: '#6C3483',
    plans: [
      {
        name: '현대카드 통신특화 M포인트',
        internet: '-',
        monthlyFee: 0,
        gift: 300000,
        features: ['통신요금 10% 청구할인', 'M포인트 적립', '인터넷 결합 시 추가 할인', '연회비 면제 조건 있음'],
        badge: '추천',
      },
      {
        name: '삼성카드 인터넷 결합 특화',
        internet: '-',
        monthlyFee: 0,
        gift: 250000,
        features: ['인터넷 요금 자동납부 할인', '포인트 2배 적립', '결합 상품 추가 혜택', '연회비 면제 조건 있음'],
        badge: '인기',
      },
    ],
  },
};

const INTERNET_OPTIONS = ['100MB', '500MB', '1GB', '10GB'];
const WIFI_OPTIONS = ['미포함', '포함'];
const IPTV_OPTIONS = ['미결합', '기본', '프리미엄'];
const BOX_OPTIONS = ['미포함', '포함'];
const PHONE_OPTIONS = ['미결합', '결합'];

type FilterState = {
  internet: string;
  wifi: string;
  iptv: string;
  box: string;
  phone: string;
};

function DropdownFilter({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex flex-col items-center gap-1 border border-gray-200 rounded-lg px-3 py-3 bg-white hover:border-primary transition-colors"
      >
        <div className="text-gray-400">{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
        <div className="flex items-center gap-1 font-bold text-sm">
          {value}
          <ChevronDown className="w-3 h-3" />
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${value === opt ? 'text-primary font-bold' : 'text-gray-700'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ProviderPageProps {
  providerKey: string;
}

export default function ProviderPage({ providerKey }: ProviderPageProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const provider = PROVIDERS[providerKey] || PROVIDERS['sk'];

  const [filters, setFilters] = useState<FilterState>({
    internet: '100MB',
    wifi: '미포함',
    iptv: '미결합',
    box: '미포함',
    phone: '미결합',
  });

  const BASE_PRICE = 22000;
  const wifiAdd = filters.wifi === '포함' ? 5500 : 0;
  const iptvAdd = filters.iptv === '기본' ? 8800 : filters.iptv === '프리미엄' ? 14300 : 0;
  const internetAdd =
    filters.internet === '500MB' ? 22000 :
    filters.internet === '1GB' ? 33000 :
    filters.internet === '10GB' ? 55000 : 0;
  const totalFee = BASE_PRICE + internetAdd + wifiAdd + iptvAdd;

  const handleConsult = () => {
    toast({
      title: '상담 신청 완료',
      description: '빠른 시간 내에 연락드리겠습니다.',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <ISPNav />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-center text-4xl font-black mb-3 leading-tight">
            <span style={{ color: provider.color }}>{provider.name}</span>
            <span className="text-gray-900">의</span>
          </h1>
          <p className="text-center text-3xl font-black text-gray-900 mb-10">
            상품, 혜택, 요금을 직접 확인하고 비교해보세요!
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex gap-3">
              <DropdownFilter
                icon={<Wifi className="w-5 h-5" />}
                label="인터넷"
                value={filters.internet}
                options={INTERNET_OPTIONS}
                onChange={(v) => setFilters({ ...filters, internet: v })}
              />
              <DropdownFilter
                icon={<Wifi className="w-4 h-4" />}
                label="와이파이"
                value={filters.wifi}
                options={WIFI_OPTIONS}
                onChange={(v) => setFilters({ ...filters, wifi: v })}
              />
              <DropdownFilter
                icon={<Tv className="w-5 h-5" />}
                label="IPTV"
                value={filters.iptv}
                options={IPTV_OPTIONS}
                onChange={(v) => setFilters({ ...filters, iptv: v })}
              />
              <DropdownFilter
                icon={<Box className="w-5 h-5" />}
                label="셋톱박스"
                value={filters.box}
                options={BOX_OPTIONS}
                onChange={(v) => setFilters({ ...filters, box: v })}
              />
              <DropdownFilter
                icon={<Smartphone className="w-5 h-5" />}
                label="휴대폰"
                value={filters.phone}
                options={PHONE_OPTIONS}
                onChange={(v) => setFilters({ ...filters, phone: v })}
              />
            </div>

            <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-4">
              <div className="flex gap-4 text-sm text-gray-500">
                <span>인터넷 {totalFee.toLocaleString()}원</span>
                {wifiAdd > 0 && <span>+ 와이파이 {wifiAdd.toLocaleString()}원</span>}
                {iptvAdd > 0 && <span>+ IPTV {iptvAdd.toLocaleString()}원</span>}
              </div>
              <span className="text-xs text-gray-400">▶ 합계</span>
            </div>
          </div>

          <motion.div
            className="bg-gradient-to-r from-primary to-orange-400 rounded-2xl p-8 text-center text-white mb-8 shadow-md"
            initial={{ scale: 0.97 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-lg font-semibold mb-1 opacity-90">월 요금</p>
            <p className="text-5xl font-black">
              {totalFee.toLocaleString()}
              <span className="text-2xl ml-1">원</span>
            </p>
          </motion.div>

          <div className="flex gap-3 justify-center mb-14">
            <button
              onClick={handleConsult}
              data-testid="button-quick-consult"
              className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full text-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              <PhoneCall className="w-5 h-5" />
              빠른 견적
            </button>
            <button
              onClick={handleConsult}
              data-testid="button-apply"
              className="flex items-center gap-2 px-8 py-4 bg-gray-800 text-white font-bold rounded-full text-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              <FileText className="w-5 h-5" />
              신청서 작성
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="bg-yellow-400 text-gray-900 font-black text-sm px-3 py-1 rounded-full">HOT</span>
              <h2 className="text-2xl font-black text-gray-900">인터넷/IPTV 상품</h2>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleConsult}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                비밀지원금 확인하기
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {provider.plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                data-testid={`card-plan-${idx}`}
                className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow relative ${
                  idx === 0 ? 'border-primary' : 'border-gray-200'
                }`}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
                      plan.badge === 'HOT' ? 'bg-primary' :
                      plan.badge === '인기' ? 'bg-green-500' :
                      plan.badge === '신상품' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-black text-base text-gray-900 mb-3 leading-tight">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-xs text-gray-500">월 요금</span>
                  <p className="text-2xl font-black text-gray-900">
                    {plan.monthlyFee.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500 ml-1">원</span>
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-xs text-gray-500">최대 사은품</span>
                  <p className="text-xl font-black text-primary">
                    {plan.gift.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500 ml-1">원</span>
                  </p>
                </div>
                <ul className="space-y-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleConsult}
                  className={`w-full py-2.5 font-bold rounded-xl text-sm transition-colors ${
                    idx === 0
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  상담 신청
                </button>
              </motion.div>
            ))}
          </div>

          {/* SK 결합 할인표 */}
          {provider.key === 'sk' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-10"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  <h2 className="text-xl font-black text-gray-900">요금가족결합</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5 ml-4">SKB인터넷 + SKT이동전화 결합 3년 약정시</p>

                <h3 className="text-sm font-bold text-gray-700 mb-2">광랜 계열 인터넷 결합</h3>
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-5">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">이동전화 회선수</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">이동전화 할인</th>
                        <th className="px-4 py-3 text-center font-bold">광랜계열 인터넷 할인</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { lines: '1회선', mobile: '3,500원 (회선당 3,500원)', internet: '-' },
                        { lines: '2회선', mobile: '7,000원 (회선당 3,500원)', internet: '4,400원' },
                        { lines: '3회선', mobile: '18,000원 (회선당 6,000원)', internet: '-' },
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-100">{row.lines}</td>
                          <td className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{row.mobile}</td>
                          <td className={`px-4 py-3 text-center font-bold ${row.internet !== '-' ? 'text-primary' : 'text-gray-400'}`}>{row.internet}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-sm font-bold text-gray-700 mb-2">기가 계열 인터넷 결합</h3>
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">이동전화 회선수</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">이동전화 할인</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">500M</th>
                        <th className="px-4 py-3 text-center font-bold">1G</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { lines: '1회선', mobile: '3,500원 (회선당 3,500원)', m500: '-', m1g: '-' },
                        { lines: '2회선', mobile: '7,000원 (회선당 3,500원)', m500: '-', m1g: '-' },
                        { lines: '3회선', mobile: '18,000원 (회선당 6,000원)', m500: '11,100원', m1g: '13,200원' },
                        { lines: '4회선', mobile: '24,000원 (회선당 6,000원)', m500: '-', m1g: '-' },
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-100">{row.lines}</td>
                          <td className="px-4 py-3 text-center text-gray-700 border-r border-gray-100">{row.mobile}</td>
                          <td className={`px-4 py-3 text-center font-bold border-r border-gray-100 ${row.m500 !== '-' ? 'text-primary' : 'text-gray-400'}`}>{row.m500}</td>
                          <td className={`px-4 py-3 text-center font-bold ${row.m1g !== '-' ? 'text-primary' : 'text-gray-400'}`}>{row.m1g}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  <h2 className="text-xl font-black text-gray-900">요금가족결합 IPTV 추가혜택</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5 ml-4">이동전화 + 인터넷 + IPTV 결합 시</p>
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">항목</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">TV 할인</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">이동전화</th>
                        <th className="px-4 py-3 text-center font-bold">혜택</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-t border-gray-100">
                        <td className="px-4 py-3.5 text-center font-semibold text-gray-800 border-r border-gray-100">요금가족결합 + IPTV</td>
                        <td className="px-4 py-3.5 text-center font-bold text-primary border-r border-gray-100">-1,150원</td>
                        <td className="px-4 py-3.5 text-center text-gray-700 border-r border-gray-100">이동전화 결합 시</td>
                        <td className="px-4 py-3.5 text-center text-blue-600 font-semibold">모바일 BTV 데이터팩 무료<br/><span className="text-gray-500 font-normal text-xs">(5,500원 할인)</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  <h2 className="text-xl font-black text-gray-900">New TV 플러스</h2>
                </div>
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">항목</th>
                        <th className="px-4 py-3 text-center font-bold">할인 금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-t border-gray-100">
                        <td className="px-4 py-3.5 text-center font-semibold text-gray-800 border-r border-gray-100">TV</td>
                        <td className="px-4 py-3.5 text-center font-bold text-primary">-1,100원</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  <h2 className="text-xl font-black text-gray-900">요금우리집 결합할인</h2>
                </div>
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700" rowSpan={2}>구분</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700" colSpan={2}>인터넷</th>
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700" rowSpan={2}>TV</th>
                        <th className="px-4 py-3 text-center font-bold" rowSpan={2}>전화</th>
                      </tr>
                      <tr className="bg-gray-700 text-white">
                        <th className="px-4 py-2 text-center font-semibold border-r border-gray-600 text-xs">기가/라이트</th>
                        <th className="px-4 py-2 text-center font-semibold border-r border-gray-600 text-xs">다이렉트</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: '인터넷 + 전화', giga: '-1,100원', direct: '-2,200원', tv: '-', phone: '-1,100원 (기본요금제)' },
                        { label: '인터넷 + TV + 전화', giga: '-2,200원', direct: '-5,500원', tv: '-2,200원 (베이직 이상)', phone: '-1,100원 (기본요금제)' },
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800 border-r border-gray-100">{row.label}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary border-r border-gray-100">{row.giga}</td>
                          <td className="px-4 py-3 text-center font-bold text-primary border-r border-gray-100">{row.direct}</td>
                          <td className={`px-4 py-3 text-center border-r border-gray-100 ${row.tv !== '-' ? 'font-bold text-primary' : 'text-gray-400'}`}>{row.tv}</td>
                          <td className={`px-4 py-3 text-center ${row.phone !== '-' ? 'text-gray-700' : 'text-gray-400'}`}>{row.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  <h2 className="text-xl font-black text-gray-900">요금우리집결합 IPTV 추가혜택</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5 ml-4">인터넷 결합 시</p>
                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-4 py-3 text-center font-bold border-r border-gray-700">항목</th>
                        <th className="px-4 py-3 text-center font-bold">혜택</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-t border-gray-100">
                        <td className="px-4 py-3.5 text-center font-semibold text-gray-800 border-r border-gray-100">TV</td>
                        <td className="px-4 py-3.5 text-center text-blue-600 font-semibold">VOD 쿠폰 3,300원/월<br/><span className="text-gray-500 font-normal text-xs">(3개월권)</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-400 mt-5 leading-relaxed">
                  ※ 영업점에서는 SK 인터넷 결합 신청 시 할인을 1회선만 결합이 가능하며, 추가 휴대폰 결합 신청은 고객센터로 가능합니다.<br/>
                  ※ 추가 결합 및 약정에 관련 사항은 고객센터를 통하여 신청하시면 됩니다.
                </p>
              </div>

              {/* 안내 섹션 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                  <h2 className="text-xl font-black text-gray-900">안내</h2>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-sm font-black text-gray-800 mb-3">SK브로드밴드 인터넷 가입 시 유의사항</h3>
                  <ul className="space-y-2">
                    {[
                      '동일 장소 3개월 이내 해지접수 건이 있을 경우 사은품 전액 환수됩니다.',
                      '1년 이내 해지(위임해지, 직권 해지 포함) 및 정지 시 현금 사은품은 전액 영업점으로 반납됩니다.',
                      '동일 명의 / 동일 통신사를 이용 중인 상품은 신규 가입 후 4개월(120일) 이내 명의변경, 일시정지, 해지할 경우 사은품은 전액 반환됩니다.',
                      '휴대폰 결합은 본사에서만 결합이 가능하오니 인터넷 설치 후 30일 이내에 본사 고객센터로 결합신청하시면 됩니다.',
                      '명의변경은 개통 후 6개월(180일) 내로 명의변경이 불가하며, 명의변경 시 사은품은 전액 반환됩니다.',
                      '기존에 사용하시던 인터넷은 설치 받으신 후 직접 해지해 주셔야 합니다.',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-primary mt-0.5 shrink-0">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <h3 className="text-sm font-black text-orange-800 mb-3">사은품 반환 조건 사항</h3>
                  <ul className="space-y-2">
                    {[
                      '동일 명의나 동일 청구 계정 등 동일한 정보로 사용 중이던 다른 지역 같은 통신사 상품을 6개월 이내 해지하실 경우',
                      '동일 명의, 동일 장소로 사용 중이던 같은 통신사 상품을 3개월 안에 해지했을 경우',
                      '인터넷 설치 후 1년 내에 개인에서 사업자명으로 변경하는 경우',
                      '인터넷 사용기간 중 이용정지를 90일 초과할 경우',
                      '인터넷 설치 후 1년 이내 해지 또는 요금 미납, 직권해지, 사용중지되는 경우',
                      '개통 후 1년 이내 다른 상품으로 변경할 경우',
                      '자동이체를 가입 후 1년 이내 지로청구로 변경하는 경우',
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-orange-700">
                        <span className="text-orange-500 mt-0.5 shrink-0">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
