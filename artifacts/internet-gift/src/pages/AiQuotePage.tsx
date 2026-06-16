import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLocation } from 'wouter';
import { Sparkles, Users, Tv, Wifi, Smartphone, ChevronRight, RotateCcw, PhoneCall, FileText, Star, Check } from 'lucide-react';

type Answers = {
  household: 'solo' | 'couple' | 'family' | null;
  iptv: 'yes' | 'no' | null;
  usage: 'video' | 'game' | 'basic' | null;
  phone: 'skt' | 'kt' | 'lgu' | 'other' | null;
};

type Plan = {
  provider: string;
  providerKey: string;
  color: string;
  name: string;
  speed: string;
  monthlyFee: number;
  discountedFee?: number;
  features: string[];
  badge?: string;
  reason: string;
};

const QUESTIONS = [
  {
    id: 'household',
    icon: <Users className="w-7 h-7" />,
    title: '가구 인원이 어떻게 되시나요?',
    subtitle: '인원에 맞는 최적 속도를 추천해 드려요',
    options: [
      { value: 'solo', label: '혼자 살아요', emoji: '🙋', desc: '1인 가구' },
      { value: 'couple', label: '2~3명이에요', emoji: '👨‍👩‍👧', desc: '소형 가구' },
      { value: 'family', label: '4명 이상이에요', emoji: '👨‍👩‍👧‍👦', desc: '대형 가구' },
    ],
  },
  {
    id: 'iptv',
    icon: <Tv className="w-7 h-7" />,
    title: 'TV는 어떻게 사용하시나요?',
    subtitle: 'IPTV 결합 시 채널과 혜택이 추가돼요',
    options: [
      { value: 'no', label: '인터넷만 사용해요', emoji: '💻', desc: 'TV 없음' },
      { value: 'yes', label: 'IPTV도 함께 쓸게요', emoji: '📺', desc: 'IPTV 결합' },
    ],
  },
  {
    id: 'usage',
    icon: <Wifi className="w-7 h-7" />,
    title: '인터넷을 주로 어떻게 쓰시나요?',
    subtitle: '사용 목적에 따라 필요한 속도가 달라요',
    options: [
      { value: 'video', label: '유튜브·넷플릭스', emoji: '🎬', desc: '영상 스트리밍' },
      { value: 'game', label: '게임·재택근무', emoji: '🎮', desc: '빠른 속도 필요' },
      { value: 'basic', label: '웹서핑·SNS', emoji: '📱', desc: '가벼운 사용' },
    ],
  },
  {
    id: 'phone',
    icon: <Smartphone className="w-7 h-7" />,
    title: '휴대폰 통신사가 어디세요?',
    subtitle: '같은 통신사 결합 시 최대 할인을 받아요',
    options: [
      { value: 'skt', label: 'SKT', emoji: '🔴', desc: 'SK텔레콤' },
      { value: 'kt', label: 'KT', emoji: '⬛', desc: 'KT 올레' },
      { value: 'lgu', label: 'LG U+', emoji: '🔵', desc: 'LG 유플러스' },
      { value: 'other', label: '알뜰폰·기타', emoji: '📶', desc: '기타 통신사' },
    ],
  },
];

function getRecommendations(answers: Answers): Plan[] {
  const { household, iptv, usage, phone } = answers;
  const withTV = iptv === 'yes';

  const isFast = usage === 'game' || household === 'family';
  const speed = household === 'solo' && usage === 'basic' ? '100MB' : household === 'family' || isFast ? '1GB' : '500MB';

  const plans: Plan[] = [];

  // 같은 통신사 결합 여부에 따라 할인가 적용
  const skDiscount  = phone === 'skt' ? 23100 : undefined;
  const ktDiscount  = phone === 'kt'  ? 28600 : undefined;
  const lgDiscount  = phone === 'lgu' ? 23100 : undefined;

  // SK브로드밴드 (SKT 또는 알뜰폰·기타)
  if (phone === 'skt' || phone === 'other') {
    if (withTV) {
      plans.push({
        provider: 'SK브로드밴드', providerKey: 'sk', color: '#0064D2',
        name: speed === '1GB' ? '기가인터넷 + B TV ALL' : speed === '100MB' ? '광랜인터넷 + B TV 스탠다드' : '기가라이트인터넷 + B TV ALL',
        speed,
        monthlyFee: speed === '1GB' ? 46200 : speed === '100MB' ? 35200 : 42900,
        features: [`${speed} 인터넷`, speed === '100MB' ? 'B TV 스탠다드 (226채널)' : 'B TV ALL (256채널)', 'WiFi 공유기 포함'],
        badge: phone === 'skt' ? 'SKT 결합 추천' : undefined,
        reason: phone === 'skt' ? 'SKT 휴대폰과 결합하면 인터넷·TV·휴대폰 3종 할인을 받아요.' : '가성비 뛰어난 SK 인터넷+TV 결합 상품이에요.',
      });
    } else {
      plans.push({
        provider: 'SK브로드밴드', providerKey: 'sk', color: '#0064D2',
        name: speed === '1GB' ? '기가 인터넷' : speed === '100MB' ? '광랜 인터넷' : '기가라이트 인터넷',
        speed,
        monthlyFee: 34100, discountedFee: skDiscount,
        features: [`${speed} 인터넷`, 'WiFi 공유기 포함', '3년 약정 기준'],
        badge: phone === 'skt' ? 'SKT 결합 추천' : undefined,
        reason: phone === 'skt'
          ? 'SKT 휴대폰 결합 시 월 11,000원 할인! 유튜브·넷플릭스에 딱 맞는 속도예요.'
          : '가성비 뛰어난 SK 기가라이트 인터넷이에요.',
      });
    }
  }

  // KT 올레 (KT 또는 알뜰폰·기타)
  if (phone === 'kt' || phone === 'other') {
    if (withTV) {
      plans.push({
        provider: 'KT 올레', providerKey: 'kt', color: '#E30000',
        name: speed === '1GB' ? '인터넷 에센스 + 지니TV모든G' : speed === '100MB' ? '인터넷 슬림 + 지니TV슬림' : '인터넷 베이직 + 지니TV모든G',
        speed,
        monthlyFee: speed === '1GB' ? 50600 : speed === '100MB' ? 34100 : 45100,
        features: [`${speed} 인터넷`, speed === '100MB' ? '지니TV슬림 (217채널)' : '지니TV모든G (255채널)', '기가 WiFi 제공'],
        badge: phone === 'kt' ? 'KT 결합 추천' : undefined,
        reason: phone === 'kt' ? 'KT 휴대폰 결합으로 TV·인터넷을 한 번에 저렴하게 이용하세요.' : 'KT 안정적인 인터넷과 풍성한 TV 채널을 한 번에.',
      });
    } else {
      plans.push({
        provider: 'KT 올레', providerKey: 'kt', color: '#E30000',
        name: speed === '1GB' ? '인터넷 에센스' : speed === '100MB' ? '인터넷 슬림' : '인터넷 베이직',
        speed,
        monthlyFee: 34100, discountedFee: ktDiscount,
        features: [`${speed} 인터넷`, '기가 WiFi 제공', '3년 약정 기준'],
        badge: phone === 'kt' ? 'KT 결합 추천' : undefined,
        reason: phone === 'kt'
          ? 'KT 휴대폰 결합 시 월 5,500원 할인! 유튜브·넷플릭스를 쾌적하게 즐겨요.'
          : 'KT 안정적인 네트워크로 끊김 없는 인터넷을 경험해요.',
      });
    }
  }

  // LG유플러스 (LGU+ 또는 알뜰폰·기타)
  if (phone === 'lgu' || phone === 'other') {
    const is1G = speed === '1GB';
    if (withTV) {
      plans.push({
        provider: 'LG유플러스', providerKey: 'lg', color: '#E5005A',
        name: is1G ? '와이파이기본 1G + U+tv 프리미엄' : '와이파이기본 500M + U+tv 실속형',
        speed: is1G ? '1GB' : '500MB',
        monthlyFee: is1G ? 40700 : 35200,
        features: [is1G ? '1GB 기가 인터넷' : '500MB 기가 인터넷', is1G ? 'U+tv 프리미엄 (252채널)' : 'U+tv 실속형 (217채널)', '기가 WiFi 6 제공'],
        badge: phone === 'lgu' ? 'LG 결합 추천' : undefined,
        reason: phone === 'lgu' ? 'LG U+ 휴대폰 결합 시 최대 할인! TV·인터넷을 함께 즐겨요.' : '가격 대비 최고의 LG U+ 인터넷+TV 결합 상품이에요.',
      });
    } else {
      plans.push({
        provider: 'LG유플러스', providerKey: 'lg', color: '#E5005A',
        name: is1G ? '와이파이기본 1G' : '와이파이기본 500M',
        speed: is1G ? '1GB' : '500MB',
        monthlyFee: 33000, discountedFee: lgDiscount,
        features: [is1G ? '1GB 기가 인터넷' : '500MB 기가 인터넷', '기가 WiFi 6 제공', '3년 약정 기준'],
        badge: phone === 'lgu' ? 'LG 결합 추천' : undefined,
        reason: phone === 'lgu'
          ? 'LG U+ 휴대폰 결합 시 월 9,900원 할인! 합리적인 가격에 빠른 속도를 누려요.'
          : '가격 대비 최고의 LG U+ 인터넷 상품이에요.',
      });
    }
  }

  // 3개 미만이면 채우기 (extras는 할인 없음 — 같은 통신사 아님)
  if (plans.length < 3) {
    const extras: Plan[] = withTV ? [
      { provider: 'SK브로드밴드', providerKey: 'sk', color: '#0064D2', name: '기가라이트인터넷 + B TV ALL', speed: '500MB', monthlyFee: 42900, features: ['500MB 기가 인터넷', 'B TV ALL (256채널)', 'WiFi 공유기 포함'], reason: '가성비 뛰어난 SK 기가라이트 + TV 결합 상품이에요.' },
      { provider: 'KT 올레', providerKey: 'kt', color: '#E30000', name: '인터넷 베이직 + 지니TV모든G', speed: '500MB', monthlyFee: 45100, features: ['500MB 기가 인터넷', '지니TV모든G (255채널)', '기가 WiFi 제공'], reason: 'KT 안정적인 인터넷과 풍성한 TV 채널을 한 번에.' },
      { provider: 'LG유플러스', providerKey: 'lg', color: '#E5005A', name: '와이파이기본 500M + U+tv 실속형', speed: '500MB', monthlyFee: 35200, features: ['500MB 기가 인터넷', 'U+tv 실속형 (217채널)', '기가 WiFi 6 제공'], reason: '가격 대비 최고의 LG U+ 인터넷+TV 결합 상품이에요.' },
    ] : [
      { provider: 'SK브로드밴드', providerKey: 'sk', color: '#0064D2', name: '기가라이트 인터넷', speed: '500MB', monthlyFee: 34100, features: ['500MB 기가라이트 인터넷', 'WiFi 공유기 포함', '3년 약정 기준'], reason: '가성비 뛰어난 SK 기가라이트 인터넷이에요.' },
      { provider: 'KT 올레', providerKey: 'kt', color: '#E30000', name: '인터넷 베이직', speed: '500MB', monthlyFee: 34100, features: ['500MB 기가 인터넷', '기가 WiFi 제공', '3년 약정 기준'], reason: 'KT 안정적인 네트워크로 끊김 없는 인터넷을 경험해요.' },
      { provider: 'LG유플러스', providerKey: 'lg', color: '#E5005A', name: '와이파이기본 500M', speed: '500MB', monthlyFee: 33000, features: ['500MB 기가 인터넷', '기가 WiFi 6 제공', '3년 약정 기준'], reason: '가격 대비 최고의 LG U+ 인터넷 상품이에요.' },
    ];
    for (const e of extras) {
      if (plans.length >= 3) break;
      if (!plans.find(p => p.providerKey === e.providerKey)) plans.push(e);
    }
  }

  return plans.slice(0, 3);
}

export default function AiQuotePage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ household: null, iptv: null, usage: null, phone: null });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const totalSteps = QUESTIONS.length;
  const currentQ = QUESTIONS[step];

  const handleSelect = (value: string) => {
    const key = currentQ.id as keyof Answers;
    const newAnswers = { ...answers, [key]: value as never };
    setAnswers(newAnswers);

    if (step < totalSteps - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2000);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ household: null, iptv: null, usage: null, phone: null });
    setShowResult(false);
    setIsAnalyzing(false);
  };

  const recommendations = showResult ? getRecommendations(answers) : [];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI 추천
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">나에게 맞는 요금제 찾기</h1>
          <p className="text-gray-500">몇 가지 질문에 답하면 AI가 최적의 요금제를 추천해 드려요</p>
        </div>

        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">AI 분석 중...</h2>
              <p className="text-gray-500">최적의 요금제를 찾고 있어요</p>
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </motion.div>
          )}

          {showResult && !isAnalyzing && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-sm mb-3">
                  <Check className="w-4 h-4" />
                  AI 분석 완료!
                </div>
                <h2 className="text-2xl font-black text-gray-900">맞춤 추천 요금제 TOP 3</h2>
              </div>

              <div className="space-y-4 mb-8">
                {recommendations.map((plan, idx) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${idx === 0 ? 'border-primary' : 'border-gray-200'}`}
                  >
                    {idx === 0 && (
                      <div className="inline-flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                        <Star className="w-3 h-3 fill-white" />
                        AI 최우선 추천
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: plan.color }}>
                            {plan.provider}
                          </span>
                          {plan.badge && (
                            <span className="text-xs font-bold text-primary">{plan.badge}</span>
                          )}
                        </div>
                        <h3 className="font-black text-gray-900 text-base mb-1">{plan.name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{plan.reason}</p>
                        <ul className="space-y-1">
                          {plan.features.map(f => (
                            <li key={f} className="text-xs text-gray-600 flex items-center gap-1">
                              <span className="text-primary">•</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {plan.discountedFee ? (
                          <>
                            <p className="text-xs text-gray-400 line-through mb-0.5">{plan.monthlyFee.toLocaleString()}원</p>
                            <p className="text-2xl font-black" style={{ color: plan.color }}>{plan.discountedFee.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">원 <span className="text-xs text-green-600 font-bold">결합후</span></p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-gray-400 mb-0.5">월 요금</p>
                            <p className="text-2xl font-black text-gray-900">{plan.monthlyFee.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">원</p>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setLocation(`/provider/${plan.providerKey}`)}
                      className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold transition-colors"
                      style={idx === 0 ? { backgroundColor: plan.color, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#1f2937' }}
                    >
                      자세히 보기 →
                    </button>
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-xs text-gray-400 mb-6">※ 3년약정, VAT 포함가 · 휴대폰 결합 할인 기준</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:border-gray-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  다시 견적 받기
                </button>
                <button
                  onClick={() => setLocation('/apply')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  신청서 작성하기
                </button>
              </div>
            </motion.div>
          )}

          {!isAnalyzing && !showResult && (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>{step + 1} / {totalSteps}</span>
                  <span>{Math.round(((step) / totalSteps) * 100)}% 완료</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: `${(step / totalSteps) * 100}%` }}
                    animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-2xl mb-4">
                  {currentQ.icon}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{currentQ.title}</h2>
                <p className="text-gray-500 text-sm">{currentQ.subtitle}</p>
              </div>

              {/* Options */}
              <div className={`grid gap-3 ${currentQ.options.length === 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {currentQ.options.map(opt => (
                  <motion.button
                    key={opt.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelect(opt.value)}
                    className="flex items-center gap-4 p-5 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto transition-colors" />
                  </motion.button>
                ))}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ← 이전으로
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}
