export interface IspPlan {
  key: string;
  name: string;
  shortName: string;
  color: string;
  plans: Plan[];
  popular?: boolean;
}

export interface Plan {
  id: string;
  internet: string;
  tv: string | null;
  gift: number; // 사은품 금액 (원)
  price: number; // 월 요금 (원)
  popular?: boolean;
}

export const ISP_PLANS: IspPlan[] = [
  {
    key: 'sk',
    name: 'SK브로드밴드',
    shortName: 'SK',
    color: '#F97316',
    popular: true,
    plans: [
      { id: 'sk-100', internet: '100M', tv: null, gift: 180000, price: 28600 },
      { id: 'sk-500', internet: '500M', tv: null, gift: 200000, price: 33000 },
      { id: 'sk-1g', internet: '1G', tv: null, gift: 230000, price: 38500, popular: true },
      { id: 'sk-1g-tv', internet: '1G', tv: '표준형', gift: 250000, price: 49500 },
    ],
  },
  {
    key: 'kt',
    name: 'KT 올레',
    shortName: 'KT',
    color: '#1A1A1A',
    plans: [
      { id: 'kt-100', internet: '100M', tv: null, gift: 200000, price: 29700 },
      { id: 'kt-500', internet: '500M', tv: null, gift: 220000, price: 34100 },
      { id: 'kt-1g', internet: '1G', tv: null, gift: 250000, price: 39600, popular: true },
      { id: 'kt-1g-tv', internet: '1G', tv: '스카이TV', gift: 270000, price: 52800 },
    ],
  },
  {
    key: 'lgu',
    name: 'LG U+',
    shortName: 'LGU+',
    color: '#E5005A',
    plans: [
      { id: 'lgu-100', internet: '100M', tv: null, gift: 170000, price: 28600 },
      { id: 'lgu-500', internet: '500M', tv: null, gift: 190000, price: 33000 },
      { id: 'lgu-1g', internet: '1G', tv: null, gift: 220000, price: 38500, popular: true },
      { id: 'lgu-1g-tv', internet: '1G', tv: 'UHD', gift: 240000, price: 50600 },
    ],
  },
  {
    key: 'skylife',
    name: 'KT Skylife',
    shortName: 'Skylife',
    color: '#16A34A',
    plans: [
      { id: 'sky-100', internet: '100M', tv: null, gift: 150000, price: 26400 },
      { id: 'sky-500', internet: '500M', tv: '기본형', gift: 170000, price: 39600, popular: true },
      { id: 'sky-1g', internet: '1G', tv: '표준형', gift: 200000, price: 52800 },
    ],
  },
  {
    key: 'hellovi',
    name: 'LG헬로비전',
    shortName: 'LG헬로',
    color: '#0055B3',
    plans: [
      { id: 'hv-100', internet: '100M', tv: null, gift: 130000, price: 22000 },
      { id: 'hv-500', internet: '500M', tv: null, gift: 160000, price: 28600, popular: true },
      { id: 'hv-1g', internet: '1G', tv: '기본형', gift: 190000, price: 40700 },
    ],
  },
];

export const MAX_GIFT = Math.max(...ISP_PLANS.flatMap((isp) => isp.plans.map((p) => p.gift)));

export function formatGift(amount: number): string {
  return `${(amount / 10000).toFixed(0)}만원`;
}

export function formatPrice(amount: number): string {
  return `월 ${amount.toLocaleString()}원`;
}
