import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { ConsultationModal } from '@/components/ConsultationModal';
import { motion } from 'framer-motion';
import { ChevronDown, Wifi, Tv, Box, Smartphone, PhoneCall, FileText } from 'lucide-react';

type FilterOptions = {
  internet: string[];
  wifi?: string[];
  iptv: string[];
  box?: string[];
  phone: string[];
};

type Provider = {
  key: string;
  name: string;
  color: string;
  plans: Plan[];
  filterOptions?: FilterOptions;
};

type Plan = {
  name: string;
  internet: string;
  monthlyFee: number;
  discountedFee?: number;
  gift: number;
  features: string[];
  badge?: string;
};

const PROVIDERS: Record<string, Provider> = {
  sk: {
    key: 'sk',
    name: 'SK브로드밴드',
    color: '#0064D2',
    filterOptions: {
      internet: ['100MB', '500MB', '1G'],
      wifi: ['미포함', '기본와이파이', '기가와이파이', '윙즈(와이파이증폭기)'],
      iptv: ['미결합', '이코노미(183채널)', '스탠다드(233채널)', 'ALL(233채널)', 'ALL(플러스)'],
      box: ['미포함', '스마트3셋탑', '애플TV셋탑', 'AI4 셋탑', 'AI 스피커형셋탑', 'AI Sound Max 셋탑'],
      phone: ['미결합', '결합'],
    },
    plans: [
      {
        name: '기가라이트인터넷 + B TV ALL',
        internet: '500MB',
        monthlyFee: 49500,
        discountedFee: 42900,
        gift: 470000,
        features: ['500MB 기가 인터넷', 'B TV ALL (233채널)', 'WiFi 공유기 포함'],
        badge: 'HOT',
      },
      {
        name: '기가인터넷 + B TV All',
        internet: '1G',
        monthlyFee: 53900,
        discountedFee: 45100,
        gift: 520000,
        features: ['1G 기가 인터넷', 'B TV All (263채널)', 'WiFi 공유기 포함'],
        badge: '인기',
      },
      {
        name: '광랜인터넷 + B tv 스탠다드',
        internet: '100MB',
        monthlyFee: 39600,
        discountedFee: 35200,
        gift: 300000,
        features: ['100MB 광랜 인터넷', 'B tv 스탠다드 (233채널)', 'WiFi 공유기 포함'],
      },
    ],
  },
  kt: {
    key: 'kt',
    name: 'KT 올레',
    color: '#E30000',
    filterOptions: {
      internet: ['100MB', '500MB', '1G'],
      wifi: ['미포함', '기본와이파이', 'KT WiFi 6D', '버디(와이파이증폭기)'],
      iptv: ['미결합', '베이직(233채널)', '라이트(237채널)', '에센스(263채널)', '모든G(256채널)', '모든G 플러스(256채널)'],
      box: ['미포함', '기가지니3 셋탑', '기가지니A 셋탑', '기가지니3A 셋탑', '지니TV사운드바 셋탑'],
      phone: ['미결합'],
    },
    plans: [
      {
        name: '인터넷 베이직 + OTV 베이직',
        internet: '500MB',
        monthlyFee: 45100,
        discountedFee: 39600,
        gift: 450000,
        features: ['500MB 기가 인터넷', 'OTV 베이직 (233채널)', '기가 WiFi 제공'],
        badge: '인기',
      },
      {
        name: '인터넷 에센스 + OTV 에센스',
        internet: '1G',
        monthlyFee: 49500,
        discountedFee: 44000,
        gift: 560000,
        features: ['1G 기가 인터넷', 'OTV 에센스 (263채널)', '기가 WiFi 6 제공'],
        badge: 'HOT',
      },
      {
        name: '인터넷 슬림 + OTV 베이직',
        internet: '100MB',
        monthlyFee: 39600,
        discountedFee: 34100,
        gift: 280000,
        features: ['100MB 인터넷', 'OTV 베이직 (233채널)', 'WiFi 제공'],
      },
    ],
  },
  lg: {
    key: 'lg',
    name: 'LG유플러스',
    color: '#E5005A',
    filterOptions: {
      internet: ['와이파이기본광랜(100M)', '와이파이기본기가슬림(500M)', '와이파이기본기가(1G)', '프리미엄안심100M', '프리미엄안심500M', '프리미엄안심1G', '프리미엄안심보상 100M', '프리미엄안심보상 500M', '프리미엄안심보상 1G'],
      wifi: ['미포함', 'WiFi6', 'WiFi6+WiFi6', 'WiFi6+스마트홈스피커'],
      iptv: ['미결합', '실속형(211채널)', '고급형(231채널)', '프리미엄(252채널)'],
      box: ['미포함', '4K UHD4셋탑', '고급형 셋탑', 'U+tv 사운드바 셋탑'],
      phone: ['미결합', 'LGU+ 결합'],
    },
    plans: [
      {
        name: '와이파이기본 500MB + TV 실속형',
        internet: '500MB',
        monthlyFee: 45100,
        discountedFee: 35200,
        gift: 470000,
        features: ['500MB 기가 인터넷', 'U+tv 실속형 (211채널)', '기가 WiFi 6 제공'],
        badge: 'HOT',
      },
      {
        name: '와이파이기본 1G + TV 실속형',
        internet: '1G',
        monthlyFee: 53900,
        discountedFee: 40700,
        gift: 520000,
        features: ['1G 기가 인터넷', 'U+tv 실속형 (211채널)', '기가 WiFi 6E 제공'],
        badge: '인기',
      },
      {
        name: '와이파이기본 100MB + TV 실속형',
        internet: '100MB',
        monthlyFee: 39600,
        discountedFee: 34100,
        gift: 380000,
        features: ['100MB 기가 인터넷', 'U+tv 실속형 (211채널)', '기가 WiFi 6 제공'],
      },
    ],
  },
  skylife: {
    key: 'skylife',
    name: 'KT스카이라이프',
    color: '#16A34A',
    filterOptions: {
      internet: ['100MB', '200MB', '500MB', '1G'],
      wifi: ['미포함', '기본와이파이'],
      iptv: ['미결합', 'IPTV플러스(209채널)'],
      box: ['미포함', '기본셋탑포함'],
      phone: ['미결합'],
    },
    plans: [
      {
        name: '인터넷 100M + IPTV플러스',
        internet: '100MB',
        monthlyFee: 25300,
        gift: 350000,
        features: ['100MB 인터넷', 'SKYiptv (209채널)'],
      },
      {
        name: '인터넷 500M + IPTV플러스',
        internet: '500MB',
        monthlyFee: 41800,
        gift: 440000,
        features: ['500MB 기가 인터넷', 'SKYiptv (209채널)'],
        badge: '인기',
      },
      {
        name: '인터넷 200M + IPTV플러스',
        internet: '200MB',
        monthlyFee: 36300,
        gift: 390000,
        features: ['200MB 인터넷', 'SKYiptv (209채널)'],
        badge: 'HOT',
      },
    ],
  },
  hellovision: {
    key: 'hellovision',
    name: 'LG헬로비전',
    color: '#7C3AED',
    filterOptions: {
      internet: ['광랜 100M', '광랜 160M', '기가라이트 500M', '플래티넘기가 1G'],
      iptv: ['미결합', 'UHD이코노미(111채널)', '뉴베이직(245채널)', '뉴프리미엄(245채널)'],
      box: ['미포함', '포함(UHD셋탑)'],
      phone: ['미결합', '결합'],
    },
    plans: [
      {
        name: '광랜라이트 + TV UHD이코노미',
        internet: '100MB',
        monthlyFee: 32830,
        gift: 350000,
        features: ['100MB 광랜 인터넷', 'TV UHD이코노미 (111채널)', 'UHD 셋탑 포함'],
      },
      {
        name: '기가라이트 + TV 뉴베이직',
        internet: '500MB',
        monthlyFee: 42790,
        gift: 440000,
        features: ['500MB 기가 인터넷', 'TV 뉴베이직 (245채널)', 'UHD 셋탑 포함'],
        badge: '판매 1위',
      },
      {
        name: '광랜 160M + TV 뉴베이직',
        internet: '160MB',
        monthlyFee: 39760,
        gift: 390000,
        features: ['160MB 광랜 인터넷', 'TV 뉴베이직 (245채널)', 'UHD 셋탑 포함'],
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

const INTERNET_OPTIONS = ['100MB', '500MB', '1GB'];
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

type OptionGroup = { label: string; items: string[] };

function DropdownFilter({
  icon,
  label,
  value,
  options,
  groups,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: string[];
  groups?: OptionGroup[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full lg:flex-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex flex-col items-center gap-1 border border-gray-200 rounded-lg px-2 py-2.5 bg-white hover:border-primary transition-colors"
      >
        <div className="text-gray-400">{icon}</div>
        <span className="text-xs text-gray-500">{label}</span>
        <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-center leading-tight">
          <span className="line-clamp-2">{value}</span>
          <ChevronDown className="w-3 h-3 flex-shrink-0" />
        </div>
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 min-w-[180px] w-max max-w-[260px]">
          {groups ? (
            groups.map((group, gi) => (
              <div key={gi}>
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 border-b border-gray-100 sticky top-0">
                  {group.label}
                </div>
                {group.items.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 whitespace-nowrap ${value === opt ? 'text-primary font-bold' : 'text-gray-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))
          ) : (
            options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 whitespace-nowrap ${value === opt ? 'text-primary font-bold' : 'text-gray-700'}`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function buildPhoneGroups(options: string[]): OptionGroup[] {
  const noBundle = options.filter(o => o === '미결합');
  const bundle = options.filter(o => o !== '미결합');
  return [
    { label: '미결합', items: noBundle },
    ...(bundle.length > 0 ? [{ label: '결합', items: bundle }] : []),
  ];
}


interface ProviderPageProps {
  providerKey: string;
}

export default function ProviderPage({ providerKey }: ProviderPageProps) {
  const [, setLocation] = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const provider = PROVIDERS[providerKey] || PROVIDERS['sk'];

  const [filters, setFilters] = useState<FilterState>({
    internet: '100MB',
    wifi: '미포함',
    iptv: '미결합',
    box: '미포함',
    phone: '미결합',
  });

  useEffect(() => {
    const fo = provider.filterOptions;
    setFilters({
      internet: fo?.internet?.[0] ?? '100MB',
      wifi: fo?.wifi?.[0] ?? '미포함',
      iptv: fo?.iptv?.[0] ?? '미결합',
      box: fo?.box?.[0] ?? '미포함',
      phone: fo?.phone?.[0] ?? '미결합',
    });
  }, [providerKey]);

  const isHellovision = providerKey === 'hellovision';

  // KT: 인터넷 속도에 따라 휴대폰 결합 옵션이 달라짐
  const ktPhoneOptions = filters.internet === '100MB'
    ? ['미결합', '100M (휴대폰요금제 65,000원미만)결합', '100M (휴대폰요금제 65,000원이상)결합']
    : ['미결합', '결합'];

  const opts = {
    internet: provider.filterOptions?.internet ?? INTERNET_OPTIONS,
    wifi: provider.filterOptions?.wifi ?? WIFI_OPTIONS,
    iptv: provider.filterOptions?.iptv ?? IPTV_OPTIONS,
    box: provider.filterOptions?.box ?? BOX_OPTIONS,
    phone: providerKey === 'kt' ? ktPhoneOptions : (provider.filterOptions?.phone ?? PHONE_OPTIONS),
  };

  // KT: 인터넷 변경 시 해당 속도에 없는 휴대폰 옵션이면 리셋
  useEffect(() => {
    if (providerKey === 'kt' && !ktPhoneOptions.includes(filters.phone)) {
      setFilters(f => ({ ...f, phone: '미결합' }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.internet, providerKey]);

  useEffect(() => {
    const el = document.getElementById('page-top');
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [providerKey]);

  const internetPriceMap: Record<string, number> = {
    '100MB': 22000, '200MB': 27500, '500MB': 33000, '1G': 38500, '1GB': 38500,
    '광랜 100M': 21890, '광랜 160M': 26620, '기가라이트 500M': 27330, '플래티넘기가 1G': 30800,
    '와이파이기본광랜(100M)': 22000, '와이파이기본기가슬림(500M)': 33000, '와이파이기본기가(1G)': 38500,
    '프리미엄안심100M': 25300, '프리미엄안심500M': 37400, '프리미엄안심1G': 42900,
    '프리미엄안심보상 100M': 27500, '프리미엄안심보상 500M': 39600, '프리미엄안심보상 1G': 45100,
  };
  const iptvPriceMap: Record<string, number> = {
    '이코노미(183채널)': 12100,
    '스탠다드(233채널)': 15400, '스탠다드(234채널)': 15400,
    'ALL(233채널)': 18700, 'ALL(257채널)': 18700, 'ALL(플러스)': 24200,
    '베이직(233채널)': 14740, '라이트(237채널)': 15840, '에센스(263채널)': 20240,
    '모든G(256채널)': 21340, '모든G 플러스(256채널)': 23640,
    '실속형(211채널)': 15400, '실속형(217채널)': 15400,
    '고급형(223채널)': 16500, '고급형(231채널)': 16500, '기본형(223채널)': 16500,
    '프리미엄(252채널)': 18700,
    'UHD이코노미(111채널)': 11000, '뉴베이직(245채널)': 13200, '뉴프리미엄(245채널)': 15400,
    'SKY ALL(238채널)': 7000,
  };
  const boxFeeMap: Record<string, number> = {
    '스마트3셋탑': 4400, '애플TV셋탑': 4400, 'AI4 셋탑': 8800, 'AI 스피커형셋탑': 6600, 'AI Sound Max 셋탑': 8800,
    '기가지니3 셋탑': 4400, '기가지니A 셋탑': 5500, '기가지니3A 셋탑': 6600, '지니TV사운드바 셋탑': 7700,
    '4K UHD4셋탑': 4400, '고급형 셋탑': 3300, 'U+tv 사운드바 셋탑': 6600,
    '기본셋탑포함': 0,
    '포함(UHD셋탑)': 5500,
  };
  const wifiPriceMap: Record<string, number> = {
    '기본와이파이': 1100, 'KT WiFi 6D': 3300, '버디(와이파이증폭기)': 2750, '기가WIFI프리미엄': 3300,
    'WiFi6': 0, 'WiFi6+WiFi6': 4400, 'WiFi6+스마트홈스피커': 5500,
    '기가와이파이': 3300, '윙즈(와이파이증폭기)': 2750,
  };

  const BASE_PRICE = (() => {
    if (providerKey === 'skylife') {
      const hasSkyAll = filters.iptv === 'SKY ALL(238채널)';
      if (filters.internet === '100MB') return hasSkyAll ? 22000 : 15000;
      if (filters.internet === '200MB') return hasSkyAll ? 23100 : 16000;
      if (filters.internet === '500MB') return hasSkyAll ? 37400 : 25000;
      if (filters.internet === '1G') return hasSkyAll ? 42000 : 30000;
      return 15000;
    }
    return internetPriceMap[filters.internet] ?? 22000;
  })();
  const wifiAdd = (isHellovision || providerKey === 'skylife') ? 0 : (wifiPriceMap[filters.wifi] ?? 0);
  const iptvAdd = providerKey === 'skylife' ? 0 : (iptvPriceMap[filters.iptv] ?? 0);
  const boxAdd = boxFeeMap[filters.box] ?? 0;

  // 통신사별 결합 할인 계산 (참조 사이트 E() 함수 로직과 동일)
  const getPhoneDiscount = (): number => {
    const internet = filters.internet;
    const iptv = filters.iptv;
    const phone = filters.phone;
    const hasIptv = iptv !== '미결합';

    if (providerKey === 'sk') {
      const hasPhone = phone === '결합';
      if (hasIptv && hasPhone) {
        if (internet === '100MB') return -7700;
        if (internet === '500MB') return -14300;
        if (internet === '1G') return -16500;
      }
      if (hasIptv && !hasPhone) {
        if (internet === '100MB') return -3300;
        if (internet === '500MB' || internet === '1G') return -7700;
      }
      if (!hasIptv && hasPhone) {
        if (internet === '100MB') return -4400;
        if (internet === '500MB') return -11000;
        if (internet === '1G') return -13200;
      }
      return 0;
    }

    if (providerKey === 'kt') {
      const isPremium = ['에센스(263채널)', '모든G(256채널)', '모든G 플러스(256채널)'].includes(iptv);
      if (hasIptv && phone === '미결합') {
        if (internet === '100MB') return isPremium ? -3740 : -2640;
        if (internet === '500MB' || internet === '1G') return isPremium ? -9240 : -8140;
      }
      if (hasIptv && internet === '100MB') {
        if (phone === '100M (휴대폰요금제 65,000원미만)결합') return isPremium ? -7040 : -5940;
        if (phone === '100M (휴대폰요금제 65,000원이상)결합') return isPremium ? -9240 : -8140;
      }
      if (hasIptv && (internet === '500MB' || internet === '1G') && phone === '결합') {
        return isPremium ? -14740 : -13640;
      }
      if (!hasIptv) {
        if (internet === '100MB') {
          if (phone === '100M (휴대폰요금제 65,000원미만)결합') return -3300;
          if (phone === '100M (휴대폰요금제 65,000원이상)결합') return -5500;
        }
        if ((internet === '500MB' || internet === '1G') && phone === '결합') return -9240;
      }
      return 0;
    }

    if (providerKey === 'lg') {
      const hasPhone = phone === 'LGU+ 결합';
      const is100M = internet === '와이파이기본광랜(100M)' || internet === '프리미엄안심100M' || internet === '프리미엄안심보상 100M';
      const is500M = internet === '와이파이기본기가슬림(500M)' || internet === '프리미엄안심500M' || internet === '프리미엄안심보상 500M';
      const is1G = internet === '와이파이기본기가(1G)' || internet === '프리미엄안심1G' || internet === '프리미엄안심보상 1G';
      if (hasPhone) {
        if (hasIptv) {
          if (is100M) return -7700;
          if (is500M) return -17600;
          if (is1G) return -20900;
        } else {
          if (is100M) return -5500;
          if (is500M) return -9900;
          if (is1G) return -13200;
        }
      }
      if (!hasPhone && hasIptv) {
        if (is100M) return -2200;
        if (is500M || is1G) return -7700;
      }
      return 0;
    }

    if (providerKey === 'hellovision') {
      if (hasIptv) {
        if (internet === '광랜 100M') return -4460;
        if (internet === '광랜 160M') return -4460;
        if (internet === '기가라이트 500M') return -13470;
        if (internet === '플래티넘기가 1G') return -13470;
      }
      return 0;
    }

    return 0;
  };

  const phoneDiscount = getPhoneDiscount();
  const totalFee = BASE_PRICE + wifiAdd + iptvAdd + boxAdd + phoneDiscount;

  const handleConsult = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <ConsultationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Header />
      <ISPNav />

      <main id="page-top" className="max-w-5xl mx-auto px-4 pt-4 pb-12 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-center text-2xl sm:text-4xl font-black mb-1 leading-tight">
            <span style={{ color: provider.color }}>{provider.name}</span>
            <span className="text-gray-900">의</span>
          </h1>
          <p className="text-center text-base sm:text-3xl font-black text-gray-900 mb-4 sm:mb-8 px-2">
            상품, 혜택, 요금을 직접 확인하고 비교해보세요!
          </p>

          {/* HOT 인터넷/IPTV 상품 - 최상단 고정 */}
          <div id="plan-cards" className="text-center mb-4">
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="bg-yellow-400 text-gray-900 font-black text-sm px-3 py-1 rounded-full">HOT</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">인터넷/IPTV 상품</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {provider.plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                data-testid={`card-plan-${idx}`}
                className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow relative ${
                  plan.badge === 'HOT' ? 'border-primary' : 'border-gray-200'
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
                  {plan.discountedFee ? (
                    <>
                      <span className="text-xs text-gray-400 line-through block">
                        월 {plan.monthlyFee.toLocaleString()}원
                      </span>
                      <p className="text-2xl font-black" style={{ color: provider.color }}>
                        월 {plan.discountedFee.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 ml-1">원</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-500">월 요금</span>
                      <p className="text-2xl font-black" style={{ color: provider.color }}>
                        {plan.monthlyFee.toLocaleString()}
                        <span className="text-sm font-normal text-gray-500 ml-1">원</span>
                      </p>
                    </>
                  )}
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
                  className="w-full py-2.5 font-bold rounded-xl text-sm text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: provider.color }}
                >
                  상담 신청
                </button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 -mt-6 mb-8">
            {['sk', 'kt', 'lg'].includes(providerKey)
              ? '※ 3년약정, VAT 포함가 -휴대폰한대 결합 기준 !-'
              : '※ 3년약정, VAT 포함가'}
          </p>

          <div id="filter-section" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2 sm:gap-3">
              <DropdownFilter
                icon={<Wifi className="w-5 h-5" />}
                label="인터넷"
                value={filters.internet}
                options={opts.internet}
                onChange={(v) => setFilters({ ...filters, internet: v })}
              />
              {isHellovision ? (
                <div className="relative flex-1">
                  <div className="w-full flex flex-col items-center gap-1 border border-gray-200 rounded-lg px-3 py-3 bg-white">
                    <div className="text-gray-400"><Wifi className="w-4 h-4" /></div>
                    <span className="text-xs text-gray-500">와이파이</span>
                    <span className="font-bold text-sm">포함</span>
                  </div>
                </div>
              ) : (
                <DropdownFilter
                  icon={<Wifi className="w-4 h-4" />}
                  label="와이파이"
                  value={filters.wifi}
                  options={opts.wifi}
                  onChange={(v) => setFilters({ ...filters, wifi: v })}
                />
              )}
              <DropdownFilter
                icon={<Tv className="w-5 h-5" />}
                label="IPTV"
                value={filters.iptv}
                options={opts.iptv}
                onChange={(v) => setFilters({ ...filters, iptv: v })}
              />
              {isHellovision ? (
                <div className="relative flex-1">
                  <div className="w-full flex flex-col items-center gap-1 border border-gray-200 rounded-lg px-3 py-3 bg-white">
                    <div className="text-gray-400"><Box className="w-5 h-5" /></div>
                    <span className="text-xs text-gray-500">셋톱박스</span>
                    <span className="font-bold text-sm">포함(UHD셋탑)</span>
                  </div>
                </div>
              ) : (
                <DropdownFilter
                  icon={<Box className="w-5 h-5" />}
                  label="셋톱박스"
                  value={filters.box}
                  options={opts.box}
                  onChange={(v) => setFilters({ ...filters, box: v })}
                />
              )}
              <DropdownFilter
                icon={<Smartphone className="w-5 h-5" />}
                label="휴대폰"
                value={filters.phone}
                options={opts.phone}
                onChange={(v) => setFilters({ ...filters, phone: v })}
              />
            </div>

            <div className="flex flex-wrap justify-between items-center mt-4 border-t border-gray-100 pt-4 gap-2">
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span>인터넷 {BASE_PRICE.toLocaleString()}원</span>
                {wifiAdd > 0 && <span>+ 와이파이 {wifiAdd.toLocaleString()}원</span>}
                {iptvAdd > 0 && <span>+ IPTV {iptvAdd.toLocaleString()}원</span>}
                {boxAdd > 0 && <span>+ 셋탑박스 {boxAdd.toLocaleString()}원</span>}
                {phoneDiscount < 0 && <span className="text-green-600 font-semibold">- 휴대폰결합 {Math.abs(phoneDiscount).toLocaleString()}원 할인</span>}
              </div>
              <span className="text-sm font-bold text-gray-700">▶ 합계 <span className="text-primary">{totalFee.toLocaleString()}원</span></span>
            </div>
          </div>

          <motion.div
            className="rounded-2xl p-8 text-center text-white mb-8 shadow-md"
            style={{ background: `linear-gradient(to right, ${provider.color}, ${provider.color}cc)` }}
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14 px-2 sm:px-0">
            <button
              onClick={handleConsult}
              data-testid="button-quick-consult"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full text-base sm:text-lg hover:bg-primary/90 transition-colors shadow-md"
            >
              <PhoneCall className="w-5 h-5" />
              빠른 견적
            </button>
            <button
              onClick={() => setLocation('/apply')}
              data-testid="button-apply"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white font-bold rounded-full text-base sm:text-lg hover:bg-gray-700 transition-colors shadow-md"
            >
              <FileText className="w-5 h-5" />
              신청서 작성
            </button>
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

          {/* KT 결합 할인표 + 안내 */}
          {provider.key === 'kt' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-10"
            >
              {/* KT 총액 결합할인 */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1 h-6 rounded-full bg-[#E30000] inline-block" />
                  <h2 className="text-xl font-black text-gray-900">KT 총액 결합할인</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5 ml-4">유무선결합 할인</p>

                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-3 py-3 text-center font-bold border-r border-gray-700" rowSpan={2}>인터넷 종류</th>
                        <th className="px-3 py-3 text-center font-bold border-r border-gray-700" rowSpan={2}>할인상품</th>
                        <th className="px-3 py-3 text-center font-bold" colSpan={6}>모바일 요금 총액에 따른 할인</th>
                      </tr>
                      <tr className="bg-gray-700 text-white text-xs">
                        <th className="px-2 py-2 text-center font-semibold border-r border-l border-gray-600">22,000원 미만</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">22,000원 이상</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">64,900원 이상</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">108,900원 이상</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">141,900원 이상</th>
                        <th className="px-2 py-2 text-center font-semibold">174,900원 이상</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 기가 1G/콤팩트 500M */}
                      <tr className="bg-white border-t border-gray-100">
                        <td className="px-3 py-2.5 text-center font-semibold text-gray-800 border-r border-gray-100" rowSpan={3}>기가 1G<br/>콤팩트 500M</td>
                        <td className="px-3 py-2.5 text-center text-gray-600 border-r border-gray-100">인터넷 할인</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">2,200원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000]">5,500원</td>
                      </tr>
                      <tr className="bg-gray-50 border-t border-gray-100">
                        <td className="px-3 py-2.5 text-center text-gray-600 border-r border-gray-100">모바일 할인</td>
                        <td className="px-3 py-2.5 text-center text-gray-400 border-r border-gray-100">0</td>
                        <td className="px-3 py-2.5 text-center text-gray-400 border-r border-gray-100">0</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 border-r border-gray-100">16,610원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 border-r border-gray-100">22,110원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600">27,610원</td>
                      </tr>
                      <tr className="bg-white border-t border-gray-100">
                        <td className="px-3 py-2.5 text-center font-bold text-gray-800 border-r border-gray-100 bg-gray-100">총 할인금액</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">2,200원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">11,000원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">22,110원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">27,610원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100">33,110원</td>
                      </tr>
                      {/* 슬림 100M */}
                      <tr className="bg-white border-t-2 border-gray-300">
                        <td className="px-3 py-2.5 text-center font-semibold text-gray-800 border-r border-gray-100" rowSpan={3}>슬림 (100M)</td>
                        <td className="px-3 py-2.5 text-center text-gray-600 border-r border-gray-100">인터넷 할인</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">2,200원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">3,300원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000] border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-[#E30000]">5,500원</td>
                      </tr>
                      <tr className="bg-gray-50 border-t border-gray-100">
                        <td className="px-3 py-2.5 text-center text-gray-600 border-r border-gray-100">모바일 할인</td>
                        <td className="px-3 py-2.5 text-center text-gray-400 border-r border-gray-100">0</td>
                        <td className="px-3 py-2.5 text-center text-gray-400 border-r border-gray-100">0</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 border-r border-gray-100">16,610원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600 border-r border-gray-100">22,110원</td>
                        <td className="px-3 py-2.5 text-center font-bold text-blue-600">27,610원</td>
                      </tr>
                      <tr className="bg-white border-t border-gray-100">
                        <td className="px-3 py-2.5 text-center font-bold text-gray-800 border-r border-gray-100 bg-gray-100">총 할인금액</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">2,200원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">5,500원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">11,000원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">22,110원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100 border-r border-gray-100">27,610원</td>
                        <td className="px-3 py-2.5 text-center font-black text-gray-900 bg-gray-100">33,110원</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-1.5">
                  {[
                    'LTE/3G 구분 없이 휴대폰 최대 5대 결합 가능',
                    '상기 할인액은 부가세(VAT)가 포함된 금액이며, 모바일 총액 산정 시에도 VAT 포함 금액으로 산정됩니다.',
                    '가구에서 이용하는 모바일의 월 정액을 모두 합하여 총액을 구해 구간별로 할인됩니다.',
                  ].map((note, idx) => (
                    <p key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                      <span className="shrink-0">·</span><span>{note}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* KT 안내 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-[#E30000] inline-block" />
                  <h2 className="text-xl font-black text-gray-900">안내</h2>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-sm font-black text-gray-800 mb-3">KT 인터넷 가입 시 유의사항</h3>
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
                        <span className="text-[#E30000] mt-0.5 shrink-0">·</span>
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

          {/* LG유플러스 결합 할인표 + 안내 */}
          {provider.key === 'lg' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-10"
            >
              {/* 참 쉬운 가족결합 */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-1 h-6 rounded-full bg-[#E5005A] inline-block" />
                  <h2 className="text-xl font-black text-gray-900">참 쉬운 가족결합</h2>
                </div>
                <p className="text-xs text-gray-500 mb-5 ml-4">유무선/무선간 결합 할인</p>

                <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="px-3 py-3 text-center font-bold border-r border-gray-700" rowSpan={2}>모바일<br/>결합 회선수</th>
                        <th className="px-3 py-3 text-center font-bold border-r border-gray-700" colSpan={3}>모바일 요금에 따른 모바일 요금할인<br/><span className="font-normal text-xs text-gray-400">(최대 10회선)</span></th>
                        <th className="px-3 py-3 text-center font-bold border-r border-gray-700" rowSpan={2}>가족 데이터</th>
                        <th className="px-3 py-3 text-center font-bold" colSpan={3}>인터넷 속도에 따른 월 인터넷 요금 할인<br/><span className="font-normal text-xs text-gray-400">(최대 3회선)</span></th>
                      </tr>
                      <tr className="bg-gray-700 text-white text-xs">
                        <th className="px-2 py-2 text-center font-semibold border-r border-l border-gray-600">69,000원 미만</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">69,000원 이상</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">88,000원 이상</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">100M</th>
                        <th className="px-2 py-2 text-center font-semibold border-r border-gray-600">500M</th>
                        <th className="px-2 py-2 text-center font-semibold">1Giga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { lines: '1명', m69l: '0', m69h: '0', m88: '0', data: '결합 1명당 1,000MB', i100: '5,500원', i500: '9,900원', i1g: '13,200원' },
                        { lines: '2명', m69l: '2,200원', m69h: '3,300원', m88: '4,400원', data: '', i100: '', i500: '', i1g: '' },
                        { lines: '3명', m69l: '3,300원', m69h: '5,500원', m88: '6,600원', data: '', i100: '', i500: '', i1g: '' },
                        { lines: '4명', m69l: '4,400원', m69h: '6,600원', m88: '8,800원', data: '', i100: '', i500: '', i1g: '' },
                      ].map((row, idx) => (
                        <tr key={idx} className={`border-t border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-3 py-3 text-center font-bold text-gray-800 border-r border-gray-100">{row.lines}</td>
                          <td className={`px-3 py-3 text-center border-r border-gray-100 font-bold ${row.m69l === '0' ? 'text-gray-400' : 'text-[#E5005A]'}`}>{row.m69l}</td>
                          <td className={`px-3 py-3 text-center border-r border-gray-100 font-bold ${row.m69h === '0' ? 'text-gray-400' : 'text-[#E5005A]'}`}>{row.m69h}</td>
                          <td className={`px-3 py-3 text-center border-r border-gray-100 font-bold ${row.m88 === '0' ? 'text-gray-400' : 'text-[#E5005A]'}`}>{row.m88}</td>
                          <td className="px-3 py-3 text-center border-r border-gray-100 text-blue-600 font-semibold text-xs">{row.data || '-'}</td>
                          <td className={`px-3 py-3 text-center border-r border-gray-100 font-bold ${row.i100 ? 'text-[#E5005A]' : 'text-gray-300'}`}>{row.i100 || '↑'}</td>
                          <td className={`px-3 py-3 text-center border-r border-gray-100 font-bold ${row.i500 ? 'text-[#E5005A]' : 'text-gray-300'}`}>{row.i500 || '↑'}</td>
                          <td className={`px-3 py-3 text-center font-bold ${row.i1g ? 'text-[#E5005A]' : 'text-gray-300'}`}>{row.i1g || '↑'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-1.5">
                  {[
                    '유무선 결합: 모바일+인터넷 (인터넷끼리만은 결합할 수 없습니다.)',
                    '모바일 월 정액 22,000원 이상의 LTE 요금제를 사용하는 휴대폰만 결합하여 할인받을 수 있습니다.',
                    '결합할인, 제공 할인 등 할인 혜택 적용 후 최종 요금을 기준으로 가족결합 구간이 결정됩니다.',
                    '가족 데이터는 매월 1일 가족 대표자에게 제공되며, 제공받은 달에만 이용 가능하고 다음 달로 이월되지 않습니다.',
                  ].map((note, idx) => (
                    <p key={idx} className="text-xs text-gray-400 flex items-start gap-1">
                      <span className="shrink-0">·</span><span>{note}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* LG 안내 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 rounded-full bg-[#E5005A] inline-block" />
                  <h2 className="text-xl font-black text-gray-900">안내</h2>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-sm font-black text-gray-800 mb-3">LG유플러스 인터넷 가입 시 유의사항</h3>
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
                        <span className="text-[#E5005A] mt-0.5 shrink-0">·</span>
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

          {/* KT스카이라이프 안내 */}
          {provider.key === 'skylife' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-[#16A34A] inline-block" />
                <h2 className="text-xl font-black text-gray-900">안내</h2>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-sm font-black text-gray-800 mb-3">KT스카이라이프 인터넷 가입 시 유의사항</h3>
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
                      <span className="text-[#16A34A] mt-0.5 shrink-0">·</span>
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
            </motion.div>
          )}

          {/* LG헬로비전 안내 */}
          {provider.key === 'hellovision' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-[#E5005A] inline-block" />
                <h2 className="text-xl font-black text-gray-900">안내</h2>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <h3 className="text-sm font-black text-gray-800 mb-3">LG헬로비전 인터넷 가입 시 유의사항</h3>
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
                      <span className="text-[#E5005A] mt-0.5 shrink-0">·</span>
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
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
