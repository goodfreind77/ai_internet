import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const BASE = 'https://xn--t60b460am2elgi85b30e.com/assets/';

type Card = {
  id: string;
  provider: string;
  name: string;
  cardCompany: string;
  benefit: string;
  image: string;
  link: string;
  details: string[];
};

const CARDS: Card[] = [
  {
    id: 'sk-1', provider: 'sk',
    name: 'B롯데카드', cardCompany: '롯데카드',
    benefit: '50만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762237936494-CZuTlytn.png',
    link: 'https://www.lottecard.co.kr/app/LPBOHAA_V100.lc?bId=92417&vtCdKndC=P02117-A02117',
    details: ['B롯데카드로 SK브로드밴드 통신료 자동이체 결제 시 1~2만원 할인제공', '사용등록 후 2개월간 이용실적 관계없이 1만원까지 할인 제공됩니다.', 'SK브로드밴드 통신료할인은 자동이체에 한하여 할인이 적용됩니다.', '할부 이용 시에는 이용일 기준으로 총 금액이 이용기준금액에 합산됩니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'sk-2', provider: 'sk',
    name: 'SK브로드밴드 OCEAN Edition', cardCompany: '롯데카드',
    benefit: '지난달 50만원 이상 이용시 50만원 초과금액의 3% B포인트 적립',
    image: BASE + 'image_1762237943181-BkF2AfHn.png',
    link: 'https://www.lottecard.co.kr/app/LPBOHAA_V100.lc?bId=63704&vtCdKndC=P13768-A13768&skbYn=Y',
    details: ['지난달 50만원 이상 이용시 50만원 초과금액의 3% B포인트 적립', '이용실적은 지난달 1일~말일 본인의 일시불, 할부 이용 금액을 합산합니다.', '할부 이용금액은 이용일을 기준으로 총 금액이 이용실적에 합산되며, 무이자할부 이용금액은 제외됩니다.', '해외 및 무승인 결제 건(예: 대중교통, 이동통신 자동납부)은 롯데카드에 접수되는 일자를 기준으로 이용실적에 포함됩니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'sk-3', provider: 'sk',
    name: 'SK브로드밴드 삼성카드', cardCompany: '삼성카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762237949276-DdmrXzvJ.png',
    link: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1752&alncmpC=QKSKBROAD&affcode=QKSKBROAD&webViewFirstPage=true',
    details: ['이용요금 월 최대 1만 6천원 청구 할인', '30만원 이상 사용 시 월 7,000원 ~ 10,000원 할인', '70만원 이상 사용 시 월 10,000원 ~ 13,000원 할인', '120만원 이상 사용 시 월 13,000원 ~ 16,000원 할인', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-1', provider: 'kt',
    name: 'KB국민 CLIP카드', cardCompany: '국민카드',
    benefit: '30만원 이상 실적 12,000원 할인',
    image: BASE + 'image_1762239182692-Cj1BQree.png',
    link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?cooperationcode=04489&mainCC=a&solicitorcode=7024489000',
    details: ['30만원 이상 실적 12,000원 할인', '최초 카드 사용등록일로부터 다음달 말일까지는 CLiP카드 전월 이용실적이 없는 경우에도 1구간 (전월 이용실적 30만원 이상)에 해당하는 1만2천원 청구할인 서비스가 적용됩니다.', 'KT통신 요금 자동이체 승인건이 여러 건인 경우 합산하여 월 할인금액 내에서 할인됩니다.', '할인 금액보다 자동이체 승인금액이 작을 경우 승인금액만큼 할인 적용됩니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-2', provider: 'kt',
    name: 'kt BC 바로 SUPER', cardCompany: '바로카드',
    benefit: '30만원 이상 실적 20,000원 할인',
    image: BASE + 'image_1762239189148-DB3TVHF6.png',
    link: 'https://paybooc.co.kr/app/paybooc/REventDetail.do?evntNo=2023120048',
    details: ['30만원 이상 실적 20,000원 할인', '70만원 이상 실적 25,000원 할인', '1~24개월차 월 최대 26,000원 할인', '25개월차부터 월 6,000원 할인 SUPER 카드 전월이용금액 30만원 이상 시 (요금제 무관)', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-3', provider: 'kt',
    name: 'kt BC 바로 SUPER+', cardCompany: '바로카드',
    benefit: '50만원 이상 실적 20,000원 할인',
    image: BASE + 'image_1762239195451-D1cSlRlf.png',
    link: 'https://paybooc.co.kr/app/paybooc/REventDetail.do?evntNo=2023120048',
    details: ['30만원 이상 실적 20,000원 할인', '70만원 이상 실적 30,000원 할인', '1~24개월차 월 최대 35,000원 할인', '25개월차부터 월 6,000원 할인 SUPER+ 카드 전월이용금액 50만원 이상 시 (요금제 무관)', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-4', provider: 'kt',
    name: 'KT DC Plus BC바로 카드', cardCompany: '바로카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762239206997-DMMP-awD.png',
    link: 'https://paybooc.co.kr/app/paybooc/AppPbCard.do?exec=detail&cardGdsNo=103125&chnlCd=Mobile',
    details: ['30만원 이상 실적 7,000원 할인', '70만원 이상 실적 13,000원 할인', '전원실적 별 월 최대 13,000원 할인', '자동이체 등록한 KT통신요금이 카드사에 청구되는 시점부터 할인 혜택 적용', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-5', provider: 'kt',
    name: 'KT DC Plus 고객용 더 심플 하나카드', cardCompany: '하나카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239213612-4QrIcxZi.png',
    link: 'https://www.hanacard.co.kr/OPI42000000D.web?CD_PD_SEQ=17453#none',
    details: ['30만원 이상 실적 10,000원 할인', '80만원 이상 실적 15,000원 할인', '횟수 제한 없이 월 할인 한도 내에서 합산 할인', '월납 요금 승인 금액이 할인 한도보다 적을 경우 승인 금액만큼 할인 적용', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-6', provider: 'kt',
    name: 'KT DC Plus 롯데카드', cardCompany: '롯데카드',
    benefit: '40만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239220701-fWZFM9AW.png',
    link: 'https://www.lottecard.co.kr/app/LPBOHAA_V100.lc?bId=92294&vtCdKndC=P14445-A14445',
    details: ['40만원 이상 실적 10,000원 할인', '80만원 이상 실적 13,000원 할인', '지난달 이용 실적 산정 시 카드 사용일(승인)기준으로 적용합니다.', '결제일 할인 금액이 청구금액보다 큰 경우 청구금액까지만 할인 적용됩니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-7', provider: 'kt',
    name: 'KT LOCA X 구독 롯데카드', cardCompany: '롯데카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239230131-Co0an_Jm.png',
    link: 'https://www.lottecard.co.kr/app/LPBOHAA_V100.lc?bId=93203&vtCdKndC=P14850-A14850',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', '150만원 이상 실적 25,000원 할인', 'KT LOCA X구독 롯데카드로 제휴사 렌탈료 자동납부 연결 시에만 결제일 할인 혜택을 받으실 수 있습니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-8', provider: 'kt',
    name: 'KT Super DC 롯데카드', cardCompany: '롯데카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239237716-fGf0nPSp.png',
    link: 'https://www.lottecard.co.kr/app/LPBOHAA_V100.lc?bId=92295&vtCdKndC=P14262-A14262',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', '120만원 이상 실적 20,000원 할인', '지난달 이용실적 산정 시 카드사용일(승인) 기준으로 적용됩니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-9', provider: 'kt',
    name: 'KT Super 할부 하나BC카드', cardCompany: '하나카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239244116-FXUh4hR9.png',
    link: 'https://www.hanacard.co.kr/OPI42000000D.web?_frame=no&CD_PD_SEQ=5349#none',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', 'KT 통신 이용요금 자동이체 시 KT통신 이용요금에서 월 5,000원 청구 할인', '지난달 이용금액 30만원 이상 이용 시 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-10', provider: 'kt',
    name: 'KT 가족만족 DC 신한카드', cardCompany: '신한카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762239269373-BQ8EpNEF.png',
    link: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1223352_2207.html?empSeq=501&btnApp=dp01',
    details: ['30만원 이상 실적 7,000원 할인', '70만원 이상 실적 15,000원 할인', 'KT통신요금 가맹점은 신한카드 가맹점 등록 기준을 따릅니다.', 'KT통신요금 자동납부 및 전월 이용금액 조건 충족 시 결제일 할인이 적용됩니다.', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-11', provider: 'kt',
    name: 'KT 가족만족 할부 신한카드', cardCompany: '신한카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239277660-CnEP3Ng0.png',
    link: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1221484_2207.html?EntryLoc=3298&empSeq=501&btnApp=dp01',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', '통신기기(휴대폰/태블릿등),인터넷,TV,집전화 상관없이 KT 요금 통합 청구할인', 'Super할부 서비스 2회 이상 이용 시에도 할인 서비스는 중복 적용 불가', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-12', provider: 'kt',
    name: 'KT 삼성카드', cardCompany: '삼성카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762239590116-CwI9AfH0.png',
    link: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1665&alncmpC=QKCWHP&affcode=QKCWHP&webViewFirstPage=true',
    details: ['30만원 이상 실적 7,000원 할인', '70만원 이상 실적 10,000원 할인', '120만원 이상 실적 13,000원 할인', 'KT통신요금 2건 이상 자동납부 시에도 혜택은 통합 월1회 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-13', provider: 'kt',
    name: 'KT 신한 체크카드', cardCompany: '신한카드',
    benefit: '30만원 이상 실적 3,000원 캐시백',
    image: BASE + 'image_1762239598635-DyPAmDWz.png',
    link: 'https://www.shinhancard.com/pconts/html/card/apply/check/1188338_2206.html',
    details: ['30만원 이상 실적 3,000원 캐시백', '50만원 이상 실적 5,000원 캐시백', 'KT통신요금(휴대폰,인터넷,TV,집전화,인터넷전화,유무선결합상품)자동납부 시 캐시백적용', '통신요금이 캐시백금액보다 적을 시 통신요금만큼 캐시백 적용', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-14', provider: 'kt',
    name: 'KT 할부 Plus KB국민카드', cardCompany: '국민카드',
    benefit: '30만원 이상 실적 8,000원 할인',
    image: BASE + 'image_1762239607314-C1e4k62f.png',
    link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09328&solicitorcode=7029328000',
    details: ['30만원 이상 실적 8,000원 할인', '70만원 이상 실적 12,000원 할인', '100만원 이상 실적 14,000원 할인', 'KT 장기 할부서비스 5만원이상 24~36개월 할부결제 시(5.9~7.0%)', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-15', provider: 'kt',
    name: 'kt-현대카드M Edition3(청구할인형)', cardCompany: '현대카드',
    benefit: '30만원 이상 실적 13,000원 할인',
    image: BASE + 'image_1762239620867-NSsDbqTT.png',
    link: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc',
    details: ['30만원 이상 실적 13,000원 할인', '70만원 이상 실적 18,000원 할인', '120만원 이상 실적 23,000원 할인', 'kt 통신요금 자동이체 결제 시 청구할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-16', provider: 'kt',
    name: 'KT 현대카드M Edition3 (통신할인형2.0)', cardCompany: '현대카드',
    benefit: '50만원 이상 실적 15,000원 할인',
    image: BASE + 'image_1762239630307-nRw4jYbB.png',
    link: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc',
    details: ['50만원 이상 실적 15,000원 할인', '70만원 이상 실적 18,000원 할인', '100만원 이상 실적 22,000원 할인', 'kt 통신요금 자동이체 결제 시 통신할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-17', provider: 'kt',
    name: 'KT 현대카드M Edition3(청구할인형2.0)', cardCompany: '현대카드',
    benefit: '100만원 이상 실적 22,000원 할인',
    image: BASE + 'image_1762239637075-BI0OvWn8.png',
    link: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc',
    details: ['100만원 이상 실적 22,000원 할인', 'kt 통신요금 자동이체 결제 시 청구할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-18', provider: 'kt',
    name: 'KT멤버십xKBK 케이뱅크 더블혜택 체크카드', cardCompany: '케이뱅크',
    benefit: '20만원 이상 실적, 카드이용금액 5%(최대 5,000원) 캐시백',
    image: BASE + 'image_1762239645548-BzUtMnBb.png',
    link: 'https://www.kbanknow.com',
    details: ['20만원 이상 실적, 카드이용금액 5%(최대 5,000원) 캐시백', 'KT 멤버십 회원 대상 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'kt-19', provider: 'kt',
    name: 'kt super DC 하나카드', cardCompany: '하나카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762239652995-CgoF1KkI.png',
    link: 'https://www.hanacard.co.kr',
    details: ['30만원 이상 실적 7,000원 할인', 'kt 통신요금 자동이체 결제 시 할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-1', provider: 'lg',
    name: '더 심플 하나카드', cardCompany: '하나카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762239996363-Du5AtSl7.png',
    link: 'https://www.hanacard.co.kr/OPI42000000D.web?CD_PD_SEQ=17160#none',
    details: ['30만원 이상 실적 10,000원 할인', '80만원 이상 실적 15,000원 할인', '횟수 제한 없이 월 할인 한도 내에서 합산 할인', '월납 요금 승인 금액이 할인 한도보다 적을 경우 승인 금액만큼 할인 적용', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-2', provider: 'lg',
    name: 'LG U+ 스마트플랜 Plus 신한카드(유플러스 요금할인형)', cardCompany: '신한카드',
    benefit: '30만원 이상 실적 3,000원 할인',
    image: BASE + 'image_1762240005283-BkQqjvxq.png',
    link: 'https://www.shinhancard.com',
    details: ['30만원 이상 실적 3,000원 할인', '50만원 이상 실적 5,000원 할인', '70만원 이상 실적 7,000원 할인', 'LG U+ 통신요금 자동이체 납부 및 전월 이용금액 조건 충족 시 할인 서비스 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-3', provider: 'lg',
    name: 'LG U+ 스마트플랜 Plus 신한카드', cardCompany: '신한카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762240014588-CM6IVUI-.png',
    link: 'https://paybooc.co.kr/app/paybooc/REventDetail.do?evntNo=2023120048',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', 'LG U+ 통신요금 자동이체 납부 및 전월 이용금액 조건 충족 시 결제일 할인 서비스 제공', '통신요금이 할인 한도보다 적을 경우, 통신요금 만큼 할인', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-4', provider: 'lg',
    name: 'LG U+ X LOCA 롯데카드', cardCompany: '롯데카드',
    benefit: '30만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762240030971-CvA9UEeL.png',
    link: 'https://www.lottecard.co.kr',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', '150만원 이상 실적 25,000원 할인', 'LG U+ 통신요금 자동이체 결제 시 할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-5', provider: 'lg',
    name: 'LG U+ FAMILY 하나카드', cardCompany: '하나카드',
    benefit: '30만원 이상 실적 17,000원 할인',
    image: BASE + 'image_1762240037194-BauiWWOY.png',
    link: 'https://www.hanacard.co.kr',
    details: ['30만원 이상 실적 17,000원 할인', 'LG U+ 통신요금 자동이체 결제 시 할인 혜택 제공', '가족 요금 통합 할인', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-6', provider: 'lg',
    name: 'LG U+ 현대카드M Edition3(통신할인형2.0)', cardCompany: '현대카드',
    benefit: '50만원 이상 실적 15,000원 할인',
    image: BASE + 'image_1762240044875-CCxuWKXT.png',
    link: 'https://www.hyundaicard.com/cpc/cr/CPCCR0201_01.hc',
    details: ['50만원 이상 실적 15,000원 할인', '70만원 이상 실적 18,000원 할인', '100만원 이상 실적 22,000원 할인', 'LG U+ 통신요금 자동이체 결제 시 통신할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-7', provider: 'lg',
    name: 'LG U+ 삼성카드', cardCompany: '삼성카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762240060140-P1zAHThu.png',
    link: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1663&alncmpC=QKCWHP&affcode=QKCWHP&webViewFirstPage=true',
    details: ['30만원 이상 실적 7,000원 할인', '70만원 이상 실적 10,000원 할인', '120만원 이상 실적 13,000원 할인', '통신요금 자동납부 합산 금액이 월 할인한도보다 적은 경우, 자동납부금액만큼 해당월 카드 결제대금에서 자동 차감', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-8', provider: 'lg',
    name: 'LG U+ 사장님 통할인 신한카드', cardCompany: '신한카드',
    benefit: '70만원 이상 실적 10,000원 할인',
    image: BASE + 'image_1762240066979-Bf8EQwOO.png',
    link: 'https://www.shinhancard.com',
    details: ['70만원 이상 실적 10,000원 할인', '100만원 이상 실적 15,000원 할인', '사업자 대상 특화 혜택', 'LG U+ 통신요금 자동이체 결제 시 할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-9', provider: 'lg',
    name: 'LG U+ 심플라이트 KB국민카드', cardCompany: '국민카드',
    benefit: '30만원 이상 실적 12,000원 할인',
    image: BASE + 'image_1762240077603-wwi4YiHN.png',
    link: 'https://card.kbcard.com',
    details: ['30만원 이상 실적 12,000원 할인', '70만원 이상 실적 17,000원 할인', 'LG U+ 통신요금 자동이체 결제 시 할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'lg-10', provider: 'lg',
    name: 'NH올원 LG U+ 카드', cardCompany: 'NH농협카드',
    benefit: '30만원 이상 실적 9,000원 할인',
    image: BASE + 'image_1762240086299-DDGZssbT.png',
    link: 'https://card.nonghyup.com',
    details: ['30만원 이상 실적 9,000원 할인', 'LG U+ 통신요금 자동이체 결제 시 할인 혜택 제공', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'skylife-1', provider: 'skylife',
    name: 'KT 마이알뜰폰 우리카드', cardCompany: '우리카드',
    benefit: '30만원 이상 실적 7,000원 할인',
    image: BASE + 'image_1762240256810-BSnfzQgM.png',
    link: 'https://pc.wooricard.com/dcpc/yh1/crd/crd01/H1CRD101S02.do?cdPrdCd=102982&canvasser=SKY00000',
    details: ['30만원 이상 실적 7,000원 할인', '70만원 이상 실적 10,000원 할인', 'KT 알뜰폰 사업자의 통신요금에 한해 청구할인 서비스 제공', 'KT 마이알뜰폰 우리카드로 통신요금 이용금액을 자동납부 연결 시에만 청구할인 적용', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'skylife-2', provider: 'skylife',
    name: '롯데카드 LOCA X 구독카드', cardCompany: '롯데카드',
    benefit: '90만원 이상 실적 15,000원 할인',
    image: BASE + 'image_1762240266627-CH5rQQKA.png',
    link: 'https://www.lottecard.co.kr/app/LPCDMAA_V100.lc?bId=92622&vtCdKndC=P14247-A14247',
    details: ['30만원 이상 실적 10,000원 할인', '70만원 이상 실적 15,000원 할인', '150만원 이상 실적 25,000원 할인', '추가적인 혜택(포인트 및 할인혜택 등)에는 제공조건 및 한도 등이 적용', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
  {
    id: 'hello-1', provider: 'hello',
    name: 'LG헬로비전 KB국민카드', cardCompany: '국민카드',
    benefit: '30만원 이상 실적 12,000원 할인',
    image: BASE + 'image_1762240415082-wDxcuaKx.png',
    link: 'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=102170QF5KyThphbI/3m8lcbaSV3toenurl',
    details: ['30만원 이상 실적 12,000원 할인', '70만원 이상 실적 17,000원 할인', '할인금액보다 자동납부 승인금액이 작을 경우 승인금액만큼 할인 적용', 'LG 헬로비전 자동납부 승인 건이 여러 건인 경우 합산하여 월 할인한도 내에서 할인', '자세한 내용은 카드사 홈페이지를 참고해주세요'],
  },
];

const PROVIDERS = [
  { id: 'all', name: '전체', color: '#5b4cdb' },
  { id: 'sk', name: 'SK브로드밴드', color: '#E60000' },
  { id: 'kt', name: 'KT', color: '#E30000' },
  { id: 'lg', name: 'LG유플러스', color: '#E5005A' },
  { id: 'skylife', name: 'KT스카이라이프', color: '#16A34A' },
  { id: 'hello', name: 'LG헬로비전', color: '#E5005A' },
];

interface CardPageProps {
  providerKey?: string;
}

export default function CardPage({ providerKey = 'all' }: CardPageProps) {
  const [, setLocation] = useLocation();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const activeProvider = PROVIDERS.find(p => p.id === providerKey) ?? PROVIDERS[0];
  const filtered = providerKey === 'all' ? CARDS : CARDS.filter(c => c.provider === providerKey);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <ISPNav />

      <section className="py-10" style={{ backgroundColor: '#5b4cdb' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white text-center">
            제휴카드 할인
          </h1>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex items-center justify-center gap-2 py-3 flex-wrap">
            {PROVIDERS.map((p) => {
              const isActive = activeProvider.id === p.id;
              return (
                <button
                  key={p.id}
                  data-testid={`button-card-provider-${p.id}`}
                  onClick={() => setLocation(p.id === 'all' ? '/cards' : `/cards/${p.id}`)}
                  className="font-bold rounded-full px-5 py-2 text-sm transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? p.color : 'transparent',
                    color: isActive ? 'white' : '#374151',
                    border: isActive ? `2px solid ${p.color}` : '2px solid transparent',
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="py-10 flex-1" style={{ backgroundColor: '#f5f3ff' }}>
        <div className="max-w-6xl mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">등록된 제휴카드가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  data-testid={`card-${card.id}`}
                  onClick={() => setSelectedCard(card)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                >
                  <div className="bg-white p-5 flex items-center justify-center min-h-[180px]">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-auto object-contain max-h-[160px]"
                      style={{ filter: 'contrast(1.05) brightness(1.02)' }}
                      data-testid={`img-card-${card.id}`}
                    />
                  </div>
                  <div className="px-5 pb-5">
                    <p className="text-xs text-gray-400 mb-1">{card.cardCompany}</p>
                    <p className="font-black text-sm text-gray-900 mb-2 leading-tight">{card.name}</p>
                    <p className="text-xs text-primary font-semibold">{card.benefit}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCard(null)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden z-10"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              <div className="bg-white p-6 flex items-center justify-center min-h-[360px] border-b border-gray-100">
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="max-h-[300px] w-auto object-contain"
                />
              </div>

              <div className="p-6">
                <p className="text-xs text-gray-400 mb-1">{selectedCard.cardCompany}</p>
                <h2 className="text-lg font-black text-gray-900 mb-1 leading-snug">{selectedCard.name}</h2>
                <p className="text-sm font-bold text-primary mb-4">{selectedCard.benefit}</p>

                <ul className="space-y-2 mb-6">
                  {selectedCard.details.map((d, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={selectedCard.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#5b4cdb' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  카드사 홈페이지 바로가기
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
