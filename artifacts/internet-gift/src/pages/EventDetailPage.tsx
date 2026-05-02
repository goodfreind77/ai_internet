import React from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { ChevronLeft } from 'lucide-react';

type SectionRow = string[];

type Subsection = {
  subtitle: string;
  type: 'table' | 'list';
  headers?: string[];
  rows?: SectionRow[];
  items?: string[];
  note?: string;
};

type Section = {
  title: string;
  description?: string;
  type: 'table' | 'list' | 'info' | 'info-highlight';
  headers?: string[];
  rows?: SectionRow[];
  items?: string[];
  content?: string;
  highlight?: string;
  link?: string;
  note?: string;
  subsections?: Subsection[];
};

type EventDetail = {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  views: number;
  image?: string;
  sections: Section[];
};

const EVENT_DETAILS: Record<number, EventDetail> = {
  2: {
    id: 2,
    title: '통신사별 제휴카드 할인 혜택 안내',
    subtitle: '통신비 자동이체 및 장기할부 조건 충족 시 제휴카드를 활용하여 실속 있는 통신비 할인 혜택을 받아보세요',
    date: '2025-11-07',
    views: 304,
    sections: [
      {
        title: '1. KT',
        description: 'KT는 다양한 카드사와의 제휴를 통해 폭넓은 할인 혜택을 제공하고 있으며, 할인 유형(청구할인 또는 장기할부) 및 필수 조건을 충족해야 할인을 받을 수 있습니다.',
        type: 'table',
        headers: ['카드사', '카드명', '할인 유형', '월 통신비 할인 금액', '필수 조건'],
        rows: [
          ['신한카드', 'KT 으랏차차 신한카드', '청구할인', '월 17,000원 ~ 45,000원', '통신요금 자동이체 필수'],
          ['', 'KT 가족만족 할부 신한카드', '장기할부', '월 10,000원 ~ 15,000원', '통신요금 자동이체 필수'],
          ['', 'KT 가족만족 DC 신한카드', '청구할인', '월 7,000원 ~ 15,000원', '통신요금 자동이체 필수'],
          ['', 'KT 신한 체크카드', '청구할인', '월 3,000원 ~ 5,000원', '통신요금 자동이체 필수'],
          ['BC카드', 'KT SUPER DC BC바로카드', '청구할인/장기할부', '월 5,000원 ~ 9,000원', '자동이체 또는 장기할부 수납 & 자동이체 필수'],
          ['', 'KT DC Plus BC바로카드', '청구할인', '월 7,000원 ~ 13,000원', '통신요금 자동이체 필수'],
          ['삼성카드', 'KT 할부 S 삼성카드', '장기할부', '월 10,000원 ~ 20,000원', '장기할부 수납 필수'],
          ['', 'KT 삼성카드', '장기할부/청구할인', '월 7,000원 ~ 16,000원', '통신요금 자동이체 필수'],
          ['KB국민카드', 'KT DC Plus KB국민카드', '청구할인', '월 7,000원 ~ 11,000원', '통신요금 자동이체 필수'],
          ['', 'KT 할부 Plus KB국민카드', '장기할부', '월 8,000원 ~ 14,000원', '통신요금 자동이체 필수'],
          ['현대카드', 'KT 현대카드M Edition3 (통신할인형2.0)', '청구할인/장기할부', '월 15,000원 ~ 25,000원', '자동이체 또는 장기할부 수납 & 자동이체 필수'],
          ['', 'KT 현대카드M Edition3 (청구할인형) (현대 2.5)', '청구할인/장기할부', '월 13,000원 ~ 18,000원', '자동이체 또는 장기할부 수납 & 자동이체 필수'],
          ['', 'KT 현대카드M Edition3 (청구할인형2.0)', '청구할인/장기할부', '월 22,000원 ~ 40,000원', '자동이체 또는 장기할부 수납 & 자동이체 필수'],
          ['우리카드', 'KT Plus 우리카드', '청구할인/장기할부', '월 10,000원 ~ 20,000원', '장기할부 수납 & 자동이체 또는 통신요금 자동이체 필수'],
          ['NH농협카드', 'KT 할부 Plus NH농협카드', '청구할인/장기할부', '월 5,000원 ~ 15,000원', '장기할부 수납 & 자동이체 또는 통신요금 자동이체 필수'],
          ['하나카드', 'KT DC Plus 고객용 더 심플 하나카드', '청구할인', '월 10,000원 ~ 15,000원', '통신요금 자동이체 필수'],
          ['롯데카드', 'KT DC Plus 롯데카드', '청구할인', '월 10,000원 ~ 13,000원', '통신요금 자동이체 필수'],
          ['', 'KT Super DC 롯데카드', '장기할부', '월 10,000원 ~ 20,000원', '장기할부수납 & 통신요금 자동이체 필수'],
          ['IBK카드', 'olleh super DC IBK카드', '청구할인', '월 7,000원 ~ 15,000원', '통신요금 자동이체 필수'],
          ['케이뱅크', 'KT멤버십x케이뱅크 더블혜택 체크카드', '청구할인 (캐시백)', '월 5% ~ 20% 캐시백', '통신요금 자동이체 필수'],
        ],
        note: "KT 제휴 카드는 '카드 더블할인'을 통해 최대 144만원(카드 A 72만원 + 카드 B 72만원) 할인을 받을 수 있습니다 (할인 조건 충족 및 통신요금 자동이체 시).",
      },
      {
        title: '2. SK브로드밴드',
        description: 'SK브로드밴드는 통신요금 자동이체 시 전월 실적에 따라 결제일 할인을 제공하는 제휴카드를 운영하고 있습니다.',
        type: 'table',
        headers: ['카드사', '카드명', '월 할인 금액 (결제일 할인)', '전월 실적 조건', '추가 정보'],
        rows: [
          ['하나카드', '더 심플 하나카드', '월 1만 원', '30만 원 이상', '연회비: 국내 25,000원, 해외겸용(Master) 25,000원'],
          ['', '', '월 1만 5천 원', '80만 원 이상', ''],
          ['롯데카드', 'SK브로드밴드 B롯데카드', '월 1만 1천 원', '30만 원 이상', '연회비: 국내 5,000원, 해외겸용(Master) 10,000원'],
          ['', '', '월 1만 3천 원', '50만 원 이상', '프로모션 혜택(24개월) 포함 금액'],
          ['', '', '월 2만 원', '100만 원 이상', ''],
          ['삼성카드', 'T나는혜택 삼성카드', '월 7천 원 ~ 1만 원', '30만 원 이상', '전월 이용 실적 및 생활요금 정기결제 건수에 따라 할인 적용'],
          ['', '', '월 1만 원 ~ 1만 3천 원', '70만 원 이상', ''],
          ['', '', '월 1만 3천 원 ~ 1만 6천 원', '120만 원 이상', ''],
        ],
        note: "SK브로드밴드 B롯데카드의 경우, 프로모션 대상 고객(직전 6개월 동안 롯데 개인 신용카드 결제 이력 없는 회원)에게는 최대 24개월간 추가 할인이 제공됩니다.",
      },
      {
        title: '3. LG유플러스',
        description: 'LG U+는 제휴카드 할인을 제공하고 있으며, 해당 혜택은 청구할인형과 혜택형으로 구분하여 확인이 가능합니다.',
        type: 'info',
        content: 'LG U+ 공식 홈페이지의 이벤트/혜택 메뉴에서 제휴카드 할인 정보를 제공하지만, 구체적인 카드명이나 월별 할인 금액에 대한 정보는 고객센터 문의를 통해 확인하실 수 있습니다.',
        link: 'https://www.lguplus.com/benefit-affiliate/card-discount',
      },
      {
        title: '4. KT스카이라이프',
        description: "KT스카이라이프는 홈페이지 메뉴 구조상 '할인카드' 항목을 별도로 안내하고 있습니다.",
        type: 'info',
        content: 'KT스카이라이프와 제휴된 특정 카드사 또는 할인 금액에 대한 상세 내용은 고객센터 문의를 통해 확인하실 수 있습니다.',
        link: 'https://www.skylife.co.kr/search?word=%EC%B9%B4%EB%93%9C%ED%95%A0%EC%9D%B8',
      },
      {
        title: '5. LG헬로비전',
        description: 'LG헬로비전은 하나카드, KB국민카드, 롯데카드 등과 제휴하여 인터넷, TV, 렌탈 요금에 대한 청구할인 혜택을 제공합니다.',
        type: 'table',
        headers: ['카드사', '카드명', '월 할인 금액 (청구할인)', '전월 실적 조건', '추가 정보 및 혜택'],
        rows: [
          ['하나카드', 'LG헬로비전 렌탈플러스 하나카드', '월 1만 3천원', '30만 원 이상', '인터넷, TV, 렌탈 요금 자동이체 시 청구 할인. 연회비: 국내전용 18,000원'],
          ['KB국민카드', 'KB국민카드 LG헬로비전 II 카드', '월 최대 17,000원', '30만 원 이상', '(프로모션 기간: 2025.11.01 ~ 2025.11.30) 추가할인 프로모션 혜택(최대 24개월) 포함. 3만원 이상 이용 시 3만원 캐시백 혜택도 제공됨'],
          ['', '', '월 최대 19,000원', '70만 원 이상', ''],
          ['롯데카드', 'LG헬로비전 롯데카드', '월 15,000원', '30만 원 이상', '(행사 기간: 25.11.01~25.11.30) 추가할인 프로모션 혜택(최대 24개월) 포함. 25개월 이후 할인가가 변동됨'],
          ['', '', '월 18,000원', '70만 원 이상', ''],
          ['', '', '월 22,000원', '100만 원 이상', ''],
        ],
        note: 'KB국민카드와 롯데카드의 월 최대 할인 금액은 프로모션 혜택(최대 24개월)이 포함된 금액이며, 이는 직전 6개월간 해당 카드사의 개인 신용카드 결제 이력이 없는 고객을 대상으로 합니다.',
      },
    ],
  },
  3: {
    id: 3,
    title: 'LG U+ 소상공인 매장/사무실 인터넷 상품 안내',
    subtitle: '우리가게무선인터넷 프리미엄',
    date: '2025-11-07',
    views: 280,
    sections: [
      {
        title: '주요 상품 정보',
        type: 'table',
        headers: ['구분', '내용', '참고'],
        rows: [
          ['상품명', '우리가게무선인터넷 프리미엄', ''],
          ['주요 기능', '카드 결제기, 인터넷 전화를 어디서나 무선으로 이용 가능. 간단한 웹서핑, 동영상 시청도 가능함.', ''],
          ['데이터 제공량', '일 1GB 제공. 일 이용량 초과 후에도 3Mbps 속도로 무제한 이용 가능.', ''],
          ['서비스 제한', 'PC 성능, 네트워크 상태, 서버 지연 등에 따라 인터넷 속도가 달라질 수 있음. 건물의 특성이나 네트워크 환경에 따라 개통이 불가하거나 요금제 선택에 제한이 있을 수 있음.', ''],
        ],
      },
      {
        title: '이용 요금 (우리가게무선인터넷 프리미엄 기준)',
        type: 'list',
        items: [],
        subsections: [
          {
            subtitle: 'A. 약정별 월정액 (부가세 포함 금액)',
            type: 'table',
            headers: ['구분', '3년 약정', '2년 약정', '1년 약정', '무약정'],
            rows: [['월정액', '38,500원', '40,700원', '42,900원', '44,000원']],
          },
          {
            subtitle: 'B. 온라인 단독 할인 적용 시 (7% 할인)',
            type: 'table',
            headers: ['구분', '3년 약정', '2년 약정', '1년 약정', '무약정'],
            rows: [
              ['할인 금액', '-2,695원', '-2,849원', '-3,003원', '-3,080원'],
              ['월 납부 금액', '35,800원', '37,850원', '39,890원', '40,920원'],
            ],
            note: '선택한 결합 할인에 따라 온라인 7% 요금 할인 금액이 변동될 수 있습니다.',
          },
        ],
      },
      {
        title: '설치비 및 방문 A/S 안내',
        type: 'table',
        headers: ['구분', '금액 (부가세 포함)', '상세 내용'],
        rows: [
          ['설치비', '36,300원', '신규 가입 시 첫 달 요금에 합산되어 한 번만 청구됨. 신규 가입, 이전 설치, 요금제 변경 시 설치비는 동일함.'],
          ['설치 할증 요금', '(설치비의 25% 추가)', '2023년 12월 1일(금)부터 평일 야간(오후 7시~다음날 오전 9시), 주말 및 공휴일 설치 시 할증 부과.'],
          ['출동비', '15,400원', '2023년 9월 1일(금)부터 인터넷 설치 매니저 방문 시 고객 소유 기기 장애일 경우 청구됨.'],
        ],
      },
      {
        title: '필수/선택 부가서비스',
        type: 'list',
        items: [],
        subsections: [
          {
            subtitle: 'A. 무료 제공 서비스',
            type: 'table',
            headers: ['서비스명', '월 이용요금', '내용', '문의처'],
            rows: [
              ['U+ 사장님광장', '무료', '사장님이 자주 쓰는 매장 관리 기능을 모아 제공하는 무료 혜택. 인터넷 가입 시 무료 제공.', '☎1800-8700 (평일 9시~18시)'],
            ],
          },
          {
            subtitle: 'B. 제휴 부가서비스 (선택 사항)',
            type: 'table',
            headers: ['서비스명', '월 이용요금 (3년 약정 기준)', '주요 내용', '문의처'],
            rows: [
              ['에스원 HD아날로그CCTV', '31,900원 (카메라 4,400원 + DVR 27,500원)', '200만 화소 Full HD 고화질 제공, 야간에도 선명한 영상 제공. (공사비 및 모니터 비용 별도)', '가입문의: ☎1544-0001 / AS문의: ☎1588-3112'],
              ['LG헬로비전 헬로tv (HD이코노미)', '7,700원', '106개 채널 제공.', '가입문의: ☎1544-0001 / 이용/해지문의: ☎1588-1000 (평일 9시~18시)'],
              ['LG헬로비전 헬로tv (UHD뉴베이직)', '11,000원', '236개 채널 제공. 유튜브, U+아이들나라, 디즈니+, 넷플릭스 가입/이용 가능. STB 임대료 별도.', ''],
            ],
          },
        ],
      },
      {
        title: '할인 혜택',
        type: 'list',
        items: [],
        subsections: [
          {
            subtitle: 'A. 참 쉬운 가족 결합 (유무선 결합)',
            type: 'list',
            items: [
              '결합한 휴대폰 수와 요금제에 따라 휴대폰 요금 할인 및 인터넷 요금 할인 혜택 제공.',
              '알뜰폰 결합 시 추가 할인 제공 (알뜰폰 번호 개수 X 440원 추가 할인).',
              '결합한 휴대폰 수에 따라 가족 사랑 데이터 제공 (휴대폰 수 X 1,000MB).',
            ],
          },
          {
            subtitle: 'B. 제휴카드 할인',
            type: 'list',
            items: [
              '제휴카드로 통신료 납부 시 이용요금을 최대 전액 할인 받을 수 있음.',
              '할인 금액은 지난달 사용 금액 및 카드 종류에 따라 다름.',
              '문의는 소상공인 전용 고객센터 (1800-8000)로 필요함.',
            ],
          },
        ],
      },
      {
        title: '해지 및 위약금 안내 (필수 확인 사항)',
        type: 'list',
        items: [
          '할인 반환금 발생: 약정 기간 내 고객 사정으로 해지하거나 약정 기간을 단축하면 할인 반환금이 발생함.',
          '할인 반환금 계산: (할인 금액 X 월별 할인 반환율)의 합으로 계산됨.',
          '결합 서비스: 결합 서비스가 있는 경우 결합 할인 받은 금액에 대한 할인 반환금이 추가됨.',
          '사은품 반환: 개통 완료 후 1년 이내 해지하거나 기존 요금제보다 저렴한 요금제로 변경 시 가입 시 받은 사은품을 반환해야 함.',
          '이용요금 청구: 월 중간에 해지 시 사용 일수에 따라 요금이 계산되어 청구됨.',
          '기기 변상금: 서비스 이용을 위해 설치된 기기는 LG유플러스 소유이므로 분실 또는 파손 시 기기 변상금이 청구됨.',
        ],
      },
      {
        title: '문의 및 신청',
        type: 'table',
        headers: ['구분', '연락처', '운영 시간', '내용'],
        rows: [
          ['소상공인 전용 고객센터', '1800-8000', '평일 오전 9시 ~ 오후 6시', '요금제 비교, 제휴카드 할인, 기타 자세한 내용 문의.'],
          ['온라인 문의', '홈페이지 내 1:1 문의', '-', '온라인 문의.'],
          ['방문 신청', '홈페이지 내 통화품질 점검, AS 신청 등', '-', '서비스 신청 및 변경.'],
        ],
      },
      {
        title: '기타 매장/사무실 인터넷 요금제 비교',
        type: 'table',
        headers: ['요금제명', '최대속도/데이터제공량', '3년 약정 (월정액)', '온라인 단독 할인 (3년 약정 기준)', '혜택'],
        rows: [
          ['인터넷 1G', '1G', '38,500원', '36,300원', '사장님광장 363만원 상당 추가혜택'],
          ['인터넷 500M', '500M', '33,000원', '31,350원', '사장님광장 363만원 상당 추가혜택'],
          ['인터넷 100M', '100M', '22,000원', '20,600원', '사장님광장 363만원 상당 추가혜택'],
          ['우리가게무선인터넷 베이직', '500MB/일 제공', '30,250원', '28,130원', '사장님광장 363만원 상당 추가혜택'],
          ['우리가게무선인터넷 라이트', '40MB/월', '7,700원', '7,700원', '사장님광장 363만원 상당 추가혜택'],
        ],
      },
    ],
  },
  4: {
    id: 4,
    title: '전 고객 대상 후기 이벤트',
    subtitle: '스타벅스 기프티콘 100% 증정',
    date: '2025-11-07',
    views: 245,
    image: 'https://xn--t60b460am2elgi85b30e.com/assets/image_1763343593778-5ZHJ5hvq.png',
    sections: [
      {
        title: '이벤트 개요',
        type: 'info-highlight',
        content: '설치 완료 후 후기를 남기는 모든 고객에게 스타벅스 기프티콘을 100% 증정합니다!',
        highlight: '인터넷 설치를 완료한 고객에 한해 참여할 수 있습니다.',
      },
      {
        title: '참여 방법',
        type: 'list',
        items: [
          '1단계: 인터넷 설치 완료',
          '2단계: 설치 및 이용 경험에 대한 솔직하고 생생한 후기 작성',
          '3단계: 작성한 후기의 스크린샷을 제출하여 인증 신청 완료',
          '💡 팁: 설치 과정이나 사용 모습을 담은 사진을 함께 올리면 당첨 확률 100%!',
        ],
      },
      {
        title: '기간 및 발송 정보',
        type: 'table',
        headers: ['구분', '내용'],
        rows: [
          ['이벤트 기간', '2025년 11월 1일(토)부터 지속적으로 진행'],
          ['기프티콘 발송', '인증 확인 후 영업일 기준 3일 이내 일괄 발송'],
        ],
      },
      {
        title: '유의사항',
        type: 'list',
        items: [
          '본 이벤트는 인터넷 설치를 완료한 고객에 한합니다.',
          '1인당 1회만 참여 가능합니다.',
          '더 자세한 내용은 고객센터로 문의해주세요.',
        ],
      },
    ],
  },
};

function renderSubsection(sub: Subsection, idx: number) {
  return (
    <div key={idx} className="ml-4 space-y-3">
      <h4 className="text-base font-semibold text-primary">{sub.subtitle}</h4>
      {sub.type === 'table' && sub.headers && sub.rows && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {sub.headers.map((h, i) => (
                    <th key={i} className="border border-gray-200 p-2 text-left font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sub.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-gray-200 p-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sub.note && (
            <p className="text-xs text-gray-500 italic mt-1">* {sub.note}</p>
          )}
        </>
      )}
      {sub.type === 'list' && sub.items && (
        <ul className="space-y-2 ml-2">
          {sub.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-primary font-bold shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function renderSection(sec: Section, idx: number) {
  return (
    <div key={idx} className="space-y-4">
      <h3 className="text-xl font-bold border-l-4 border-primary pl-3">{sec.title}</h3>
      {sec.description && (
        <p className="text-sm text-gray-500 ml-3">{sec.description}</p>
      )}

      {sec.type === 'table' && sec.headers && sec.rows && (
        <div className="ml-3 space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {sec.headers.map((h, i) => (
                    <th key={i} className="border border-gray-200 p-3 text-left font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sec.rows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-gray-200 p-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sec.note && (
            <p className="text-xs text-gray-500 italic">* {sec.note}</p>
          )}
        </div>
      )}

      {sec.type === 'info-highlight' && (
        <div className="ml-3 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-primary rounded-lg p-6 space-y-3">
          <p className="text-lg font-bold text-primary">{sec.content}</p>
          {sec.highlight && (
            <p className="text-sm font-medium bg-primary/10 rounded-md p-3 border-l-4 border-primary">
              {sec.highlight}
            </p>
          )}
        </div>
      )}

      {sec.type === 'info' && sec.content && (
        <div className="ml-3 bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3">
          <p className="text-sm">{sec.content}</p>
          {sec.link && (
            <a
              href={sec.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-primary hover:underline break-all"
            >
              {sec.link}
            </a>
          )}
        </div>
      )}

      {sec.type === 'list' && sec.items && sec.items.length > 0 && (
        <ul className="space-y-2 ml-4">
          {sec.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-700">
              <span className="text-primary font-bold shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {sec.subsections && sec.subsections.map((sub, si) => renderSubsection(sub, si))}
    </div>
  );
}

interface EventDetailPageProps {
  eventId: string;
}

export default function EventDetailPage({ eventId }: EventDetailPageProps) {
  const [, setLocation] = useLocation();
  const id = parseInt(eventId, 10);
  const ev = EVENT_DETAILS[id];

  if (!ev) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <ISPNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
            <button
              onClick={() => setLocation('/event')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
              목록보기
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[1000px]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <div className="p-6 md:p-8">
              <h1
                className="text-2xl md:text-3xl font-black mb-2"
                data-testid="text-event-detail-title"
              >
                {ev.title}
              </h1>
              {ev.subtitle && (
                <h2 className="text-lg md:text-xl font-bold text-primary mb-6">
                  {ev.subtitle}
                </h2>
              )}

              {ev.image && (
                <div className="mb-8 flex justify-center">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="max-w-full rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-8">
                {ev.sections.map((sec, i) => renderSection(sec, i))}
              </div>

              <div className="mt-10 text-center">
                <button
                  onClick={() => setLocation('/event')}
                  data-testid="button-back-to-list"
                  className="inline-flex items-center gap-2 px-10 py-3 bg-primary text-white rounded-full font-bold text-base hover:opacity-90 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                  목록보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
