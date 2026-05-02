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

type TableRow = {
  name: string;
  speed: string;
  tv: string;
  contract: string;
  monthlyFee: number;
  gift: number;
  secretGift: string;
};

type ProviderWithTable = Provider & { tableRows: TableRow[] };

const PROVIDERS: Record<string, ProviderWithTable> = {
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
    tableRows: [
      { name: '기가라이트인터넷 + B TV ALL', speed: '500Mbps', tv: 'B TV ALL (200채널)', contract: '3년', monthlyFee: 44000, gift: 470000, secretGift: '별도 문의' },
      { name: '기가인터넷 + B TV All', speed: '1Gbps', tv: 'B TV All (250채널)', contract: '3년', monthlyFee: 55000, gift: 520000, secretGift: '별도 문의' },
      { name: '광랜인터넷 + B tv 스탠다드', speed: '100Mbps', tv: 'B tv 스탠다드', contract: '3년', monthlyFee: 33000, gift: 300000, secretGift: '별도 문의' },
      { name: '기가인터넷 단독', speed: '1Gbps', tv: '미포함', contract: '3년', monthlyFee: 38500, gift: 350000, secretGift: '별도 문의' },
      { name: '광랜인터넷 단독', speed: '100Mbps', tv: '미포함', contract: '2년', monthlyFee: 22000, gift: 200000, secretGift: '별도 문의' },
      { name: '10기가인터넷 + B TV 프리미엄', speed: '10Gbps', tv: 'B TV 프리미엄', contract: '3년', monthlyFee: 77000, gift: 650000, secretGift: '별도 문의' },
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
    tableRows: [
      { name: '기가인터넷 + 지니 TV 베이직', speed: '500Mbps', tv: '지니 TV 베이직 (100채널)', contract: '3년', monthlyFee: 44000, gift: 450000, secretGift: '별도 문의' },
      { name: '기가프리미엄 + 지니 TV 프리미엄', speed: '1Gbps', tv: '지니 TV 프리미엄 (230채널)', contract: '3년', monthlyFee: 60000, gift: 560000, secretGift: '별도 문의' },
      { name: '슬림인터넷 단독', speed: '100Mbps', tv: '미포함', contract: '2년', monthlyFee: 27500, gift: 250000, secretGift: '별도 문의' },
      { name: '기가인터넷 단독', speed: '1Gbps', tv: '미포함', contract: '3년', monthlyFee: 38500, gift: 370000, secretGift: '별도 문의' },
      { name: '10기가 인터넷 + 지니 TV', speed: '10Gbps', tv: '지니 TV 프리미엄', contract: '3년', monthlyFee: 77000, gift: 620000, secretGift: '별도 문의' },
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
    tableRows: [
      { name: '기가인터넷 + U+tv 프리미엄', speed: '500Mbps', tv: 'U+tv 프리미엄 (200채널)', contract: '3년', monthlyFee: 44000, gift: 470000, secretGift: '별도 문의' },
      { name: '10기가 인터넷 + U+tv 프리미엄', speed: '10Gbps', tv: 'U+tv 프리미엄', contract: '3년', monthlyFee: 77000, gift: 650000, secretGift: '별도 문의' },
      { name: '광랜인터넷 단독', speed: '100Mbps', tv: '미포함', contract: '2년', monthlyFee: 22000, gift: 220000, secretGift: '별도 문의' },
      { name: '기가인터넷 단독', speed: '1Gbps', tv: '미포함', contract: '3년', monthlyFee: 33000, gift: 330000, secretGift: '별도 문의' },
      { name: '기가인터넷 + U+tv 베이직', speed: '500Mbps', tv: 'U+tv 베이직 (100채널)', contract: '3년', monthlyFee: 36300, gift: 380000, secretGift: '별도 문의' },
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
    tableRows: [
      { name: '스카이라이프 기가인터넷 + HD방송', speed: '500Mbps', tv: 'HD방송 (100채널)', contract: '3년', monthlyFee: 44000, gift: 380000, secretGift: '별도 문의' },
      { name: '스카이라이프 UHD방송 프리미엄', speed: '500Mbps', tv: 'UHD방송 (150채널)', contract: '3년', monthlyFee: 55000, gift: 440000, secretGift: '별도 문의' },
      { name: '스카이라이프 인터넷 단독', speed: '500Mbps', tv: '미포함', contract: '2년', monthlyFee: 33000, gift: 280000, secretGift: '별도 문의' },
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
    tableRows: [
      { name: '헬로 기가인터넷 + 케이블TV', speed: '500Mbps', tv: '케이블TV (80채널)', contract: '3년', monthlyFee: 38500, gift: 350000, secretGift: '별도 문의' },
      { name: '헬로 기가프리미엄 + VOD무제한', speed: '1Gbps', tv: 'VOD 무제한', contract: '3년', monthlyFee: 49500, gift: 430000, secretGift: '별도 문의' },
      { name: '헬로 광랜인터넷 단독', speed: '100Mbps', tv: '미포함', contract: '2년', monthlyFee: 22000, gift: 200000, secretGift: '별도 문의' },
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
    tableRows: [
      { name: '현대카드 통신특화 M포인트', speed: '-', tv: '-', contract: '1년', monthlyFee: 0, gift: 300000, secretGift: '별도 문의' },
      { name: '삼성카드 인터넷 결합 특화', speed: '-', tv: '-', contract: '1년', monthlyFee: 0, gift: 250000, secretGift: '별도 문의' },
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

          {/* 상품 비교 표 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1 h-6 rounded-full bg-primary inline-block" />
              <h2 className="text-xl font-black text-gray-900">{provider.name} 전체 상품 요금 비교표</h2>
            </div>

            <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-4 py-3 text-left font-bold border-r border-gray-700 min-w-[200px]">상품명</th>
                    <th className="px-4 py-3 text-center font-bold border-r border-gray-700">인터넷 속도</th>
                    <th className="px-4 py-3 text-center font-bold border-r border-gray-700">TV 서비스</th>
                    <th className="px-4 py-3 text-center font-bold border-r border-gray-700">약정기간</th>
                    <th className="px-4 py-3 text-center font-bold border-r border-gray-700">월 요금</th>
                    <th className="px-4 py-3 text-center font-bold border-r border-gray-700 text-orange-300">기본 사은품</th>
                    <th className="px-4 py-3 text-center font-bold text-yellow-300">비밀 지원금</th>
                  </tr>
                </thead>
                <tbody>
                  {provider.tableRows.map((row, idx) => (
                    <tr
                      key={row.name}
                      data-testid={`table-row-${idx}`}
                      className={`border-t border-gray-100 hover:bg-orange-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold text-gray-900 border-r border-gray-100">
                        {idx === 0 && (
                          <span className="inline-block bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 align-middle">HOT</span>
                        )}
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-700 border-r border-gray-100 font-medium">{row.speed}</td>
                      <td className="px-4 py-3.5 text-center text-gray-700 border-r border-gray-100">{row.tv}</td>
                      <td className="px-4 py-3.5 text-center text-gray-600 border-r border-gray-100">{row.contract}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-gray-900 border-r border-gray-100">
                        {row.monthlyFee > 0 ? `${row.monthlyFee.toLocaleString()}원` : '무료'}
                      </td>
                      <td className="px-4 py-3.5 text-center font-black text-primary border-r border-gray-100">
                        {row.gift.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={handleConsult}
                          className="text-xs bg-gray-900 text-white font-bold px-3 py-1.5 rounded-full hover:bg-primary transition-colors"
                        >
                          {row.secretGift}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              ※ 상기 요금은 부가세(VAT) 포함 금액이며, 설치 환경 및 약정 조건에 따라 달라질 수 있습니다.
            </p>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
