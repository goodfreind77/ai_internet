import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { TipCover } from '@/components/TipCover';
import { RichArticle, isRichContent } from '@/components/RichArticle';
import { LEGACY_TIP_DATES } from '@/lib/tip-publication-dates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, DollarSign, Zap, MessageSquare, Shield, Check } from 'lucide-react';

/* ──────────────────────────────────────────────
   WhyUs 페이지
────────────────────────────────────────────── */
function WhyUsContent() {
  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          인터넷가입은 AI인터넷에서!!
        </h1>
        <p className="text-muted-foreground text-base">
          10년 차 통신비 절약 해결사가 알려드리는 실패 없는 인터넷 가입 이유
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
        <p className="text-base font-semibold">안녕하세요, 동네 이웃님들! 👋</p>
        <p className="text-base leading-relaxed">
          <strong className="text-primary">10년 차 통신비 절약 해결사</strong>인 제가, 오늘만큼은
          이웃님들의 지갑을 지켜드리기 위해 조금 진지하고 긴 글을 남겨보려 합니다.
        </p>
        <p className="text-base leading-relaxed">
          <strong>"당일 설치 + 현금 당일 지급"</strong>이라는 문구, 보셨나요? 인터넷 가입 알아보실
          때 가장 많이 보시는 문구지만, 동시에 <strong>"진짜일까?"</strong> 하고 가장 많이 의심하는
          문구이기도 하죠.
        </p>
        <p className="text-base leading-relaxed">
          수많은 업체 중에서 왜 굳이{' '}
          <strong className="text-primary">'AI인터넷'</strong>이라는 곳을 선택해야 하는지,
          가입하는 고객님 입장에서{' '}
          <strong>"아, 여기 아니면 안 되겠구나"</strong>라는 생각이 확신으로 바뀔 수밖에 없는 이유를
          10년 경력의 양심을 걸고 조목조목 설명해 드리겠습니다.
        </p>
      </div>

      <div className="text-center py-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          왜 다들 'AI인터넷'에서 가입할까요?
        </h2>
        <p className="text-muted-foreground font-medium mb-3">실패 없는 3가지 이유</p>
        <p className="text-base text-muted-foreground max-w-[800px] mx-auto">
          인터넷 가입 시장, 솔직히 말씀드리면 '정글'입니다. "현금 100만 원 준다"는 말도 안 되는
          과장 광고에 속아 가입했다가, 약속한 날짜에 입금은 안 되고 업체가 연락 두절되는 소위
          '먹튀' 사건... 10년 동안 일하면서 너무 많이 봤습니다.
        </p>
        <p className="text-base text-muted-foreground max-w-[800px] mx-auto mt-4">
          이웃님들이 더 이상 그런 불안함에 떨지 않으셔도 되는 이유, 바로 여기에 있습니다.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</span>
            <div>
              <div className="flex items-center gap-2 text-xl font-bold">
                <DollarSign className="w-6 h-6 text-primary" />
                <span>의심할 틈을 주지 않습니다</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">업계 유일, 설치 당일 입금 원칙</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg space-y-4">
            <p className="text-base">보통 다른 업체들은 이렇게 말합니다.</p>
            <div className="space-y-2 pl-4">
              <p className="text-sm text-muted-foreground italic">"고객님, 설치받으시고 다음 주 금요일에 입금돼요~"</p>
              <p className="text-sm text-muted-foreground italic">혹은 "월말 정산이라 기다려주세요~"</p>
            </div>
            <p className="text-base font-bold text-primary">왜 내 돈 받는데 기다려야 하죠?</p>
          </div>
          <div className="space-y-4">
            <p className="text-base font-bold">저희 'AI인터넷'은 다릅니다.</p>
            <p className="text-base">
              설치 기사님이 다녀가시고{' '}
              <strong className="text-primary">"설치 완료"</strong> 전산이 뜨는 그 즉시! 묻지도
              따지지도 않고 약속된 현금 사은품을{' '}
              <strong className="text-primary">고객님 계좌로 당일 입금</strong>해 드립니다.
            </p>
            <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary">
              <h4 className="font-bold text-lg mb-3">왜 이게 중요할까요?</h4>
              <p className="text-base mb-3">
                '당일 지급'을 할 수 있다는 건, 그만큼 회사의 자금력이 탄탄하고 운영이 투명하다는
                가장 확실한 증거입니다.
              </p>
              <p className="text-base">
                내일 줄 돈을 오늘 당겨서 줄 수 있는 능력, 그게 바로 고객님께 드리는{' '}
                <strong className="text-primary">'신뢰의 증표'</strong>입니다. 저녁에 치킨 시켜
                드시기 전에 입금 알림이 먼저 울릴 거예요. 🍗
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</span>
            <div>
              <div className="flex items-center gap-2 text-xl font-bold">
                <Zap className="w-6 h-6 text-primary" />
                <span>성격 급한 한국인을 위한 속도전</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">가능한 지역 당일 설치</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="text-base">
              이사 갔는데 며칠 동안 와이파이 없이 지내는 고통, 겪어보셨나요? 데이터 아끼느라
              유튜브도 못 보고... 생각만 해도 답답하죠.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-base font-bold">
              저희는{' '}
              <strong className="text-primary">'고객님의 시간은 돈이다'</strong>라는 철칙을 가지고
              있습니다.
            </p>
            <p className="text-base">
              오전에 일찍 접수하시면, 최대한 각 통신사 스케줄을 조율해서{' '}
              <strong className="text-primary">'당일 설치'</strong>가 가능하도록 10년 짬바(노하우)로
              밀어붙입니다.
            </p>
            <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-7 h-7 text-primary" />
                <h4 className="font-bold text-xl text-primary">원스톱 서비스</h4>
              </div>
              <div className="space-y-3">
                {[['오전', '전화해서 상담받고'], ['오후', '설치받고'], ['저녁', '사은품 받는']].map(([t, d]) => (
                  <div key={t} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-base"><strong>{t}</strong>에 {d}</span>
                  </div>
                ))}
              </div>
              <p className="text-base mt-4 font-bold">
                이 속도감 한번 맛보시면 다른 곳은 답답해서 못 쓰실걸요? 😎
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-border px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</span>
            <div className="flex items-center gap-2 text-xl font-bold">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span>가입 유도가 아닌, '요금 컨설팅'을 합니다</span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-primary/10 p-6 rounded-lg border-l-4 border-primary">
            <p className="text-base font-bold mb-3">이게 제가 이 일을 10년 동안 할 수 있었던 비결입니다.</p>
            <p className="text-base">
              다른 곳은 무조건 비싼 요금제(1기가 인터넷, 프리미엄 TV)를 팔아야 자기들 수당이
              떨어지니까 강요합니다.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-base font-bold text-primary">하지만 저는 '통신비 절약 해결사'입니다.</p>
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <div className="flex gap-3">
                <span className="text-primary font-bold text-lg">💬</span>
                <p className="text-base italic">"고객님, 유튜브랑 넷플릭스만 보시는데 1기가는 돈 낭비예요. 500메가나 100메가로 충분합니다."</p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold text-lg">💬</span>
                <p className="text-base italic">"이 부가서비스는 3개월만 쓰고 해지하셔도 위약금 없으니 그때 알람 맞춰두세요."</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg border-2 border-primary">
              <p className="text-lg font-bold mb-3 text-primary">남들은 '가입'을 시키지만, 저는 '절약'을 시켜드립니다.</p>
              <p className="text-base">
                매월 5천 원, 1만 원 줄어든 요금이 3년 약정이면{' '}
                <strong className="text-primary text-xl">36만 원</strong>입니다.
              </p>
              <p className="text-base mt-2">
                사은품은 사은품대로 받고, 고정 지출은 줄이는 것. 이게 진짜 재테크 아닐까요?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-border px-6 py-5">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Shield className="w-7 h-7 text-primary" />
            <div>
              <div>"법적 한도 내 최대치"를 약속합니다</div>
              <p className="text-sm font-normal text-muted-foreground mt-1">경품고시제 준수</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="text-base mb-4">
              <strong>"다른 데는 70만 원 준다던데 여긴 왜 적어요?"</strong> 라고 물으신다면, 그곳은{' '}
              <strong className="text-red-500">불법 업체</strong>일 확률이 99%입니다.
            </p>
            <p className="text-base">
              정부는 시장 혼란을 막기 위해 <strong>'경품고시제'</strong>라는 법을 만들었고, 합법적으로
              드릴 수 있는 현금의 상한선이 정해져 있습니다.
            </p>
          </div>
          <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary">
            <p className="text-base mb-4">
              저희 <strong className="text-primary">'AI인터넷'</strong>은 법을 어기고 몰래 더
              준다고 거짓말하지 않습니다.
            </p>
            <p className="text-base mb-4">
              대신,{' '}
              <strong className="text-primary">
                법 테두리 안에서 드릴 수 있는 1원 한 푼까지 탈탈 털어서 '최대치(MAX)'
              </strong>
              로 꽉 채워드립니다.
            </p>
            <p className="text-base font-bold">
              나중에 위약금 폭탄 맞거나 사기당할 걱정 없이,{' '}
              <strong className="text-primary">가장 안전하고 가장 많이 받을 수 있는 곳.</strong> 그게
              바로 여기입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">이웃님께 드리는 마지막 한마디</h2>
        <p className="text-base mb-6">
          인터넷 가입, 3년에 한 번 하는 거라 참 귀찮고 어렵죠?<br />
          그 귀찮음과 불안함, 제가 싹 해결해 드리겠습니다.
        </p>
        <div className="space-y-3 mb-6">
          {['가장 빠르게 설치받고,', '가장 많은 현금을 당일에 받고,', '가장 저렴한 요금제로 앞으로 3년을 편안하게 쓰세요.'].map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-bold text-xl">{i + 1}.</span>
              <span className="text-base"><strong>{t}</strong></span>
            </div>
          ))}
        </div>
        <p className="text-xl font-black text-center text-white bg-white/20 rounded-lg py-4 px-6">
          여기, AI인터넷 말고는 없습니다.
        </p>
      </div>

      <div className="text-center py-6 border-t border-border">
        <p className="text-lg font-bold mb-2 text-primary">📞 지금 바로 상담 받으세요!</p>
        <a href="tel:1666-3233" className="text-3xl font-black text-primary hover:underline">1666-3233</a>
        <p className="text-sm text-muted-foreground mt-2">연중무휴 상담 가능</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   LG 결합할인 페이지
────────────────────────────────────────────── */
function LgDiscountContent() {
  const sections = [
    {
      title: '1. 친구나 연인과도 OK! \'가족\'의 범위를 넓히다',
      content: `LG U+의 'U+투게더 결합'은 '가족'의 개념을 과감하게 확장했습니다. 이 요금제는 친구나 연인, 함께 사는 룸메이트 등 지인끼리도 결합 그룹을 만들어 할인을 받을 수 있는 '지인 결합' 기능을 제공합니다.

물론 한 가지 조건이 있습니다. 결합을 신청한 대표자 한 사람이 그룹 구성원 모두의 통신 요금을 한 번에 납부해야 합니다.

하지만 함께 사는 커플이나 비용을 공동으로 관리하는 룸메이트, 혹은 친한 친구들끼리 통신비를 절약하고자 할 때 이보다 더 유용한 방법은 없을 것입니다. 현대인의 다양한 라이프스타일을 반영한 똑똑한 혜택이라고 할 수 있습니다.`,
    },
    {
      title: '2. 심지어 알뜰폰, 다른 케이블 인터넷과도 묶을 수 있다',
      content: `보통 통신사 결합 상품은 자사 서비스로만 구성하는 것이 일반적입니다. 하지만 LG U+는 놀랍게도 타사 서비스와도 결합할 수 있는 길을 열어두었습니다.

• 알뜰폰 결합: '참 쉬운 가족 결합' 상품을 이용하면 U+ 휴대폰과 인터넷을 사용하면서 가족이 쓰는 알뜰폰까지 묶을 수 있습니다. 이렇게 결합할 경우, 기존 U+ 휴대폰 회선에 월 440원의 추가 할인이 제공됩니다.

• 케이블 인터넷 결합: '참 쉬운 케이블 가족 결합'을 통해서는 U+ 휴대폰을 LG헬로비전, 현대HCN, 서경방송 등 특정 케이블 방송사의 인터넷 서비스와 결합할 수 있습니다. 내가 사는 지역의 케이블 인터넷이 더 저렴하거나 유리한 조건이라면, 굳이 U+ 인터넷을 고집하지 않고도 결합 혜택을 누릴 수 있는 것입니다.`,
    },
    {
      title: '3. 혼족 주목! 혼자서도 4인 결합 혜택을 누리는 프로모션',
      content: `함께 결합할 가족이나 지인이 없어 아쉬웠던 1인 가구라면 '투게더 1인 결합 프로모션'을 주목해야 합니다. 이 프로모션은 한시적으로 운영되지만, 그 혜택은 매우 강력합니다.

핵심은 혼자서 U+ 휴대폰과 인터넷을 결합해도, 마치 4명이 결합한 것과 동일한 월 20,000원의 휴대폰 요금 할인을 3개월 동안 받을 수 있다는 점입니다.

가입 조건:
• 2025년 9월 1일 이후 월 85,000원 이상 요금제에 신규 가입
• 2025년 10월 1일부터 12월 31일 사이 인터넷과 결합 신청

결합할 사람이 없어 그룹 할인 혜택에서 소외되었던 개인 사용자에게는 놓치기 아까운 파격적인 기회입니다.`,
    },
    {
      title: '4. 흩어진 가족의 \'사용 기간\'을 합산해 할인을 받는다',
      content: `'U+가족무한사랑' 결합 상품에는 매우 독특한 할인 제도가 있습니다. 바로 결합된 가족 구성원 각자의 U+ 이용 기간을 모두 합산해 추가 할인을 제공하는 '장기고객할인'입니다.

할인 기준은 합산된 총 사용 기간에 따라 달라집니다:
• 15~29년 합산: 월 11,000원 할인
• 30년 이상 합산: 월 22,000원 할인

예를 들어 4인 가족이 각자 8년씩만 U+를 사용했어도 합산 기간은 32년이 되어 월 22,000원의 최대 할인을 받을 수 있습니다. 개인의 가입 기간이 짧더라도 온 가족의 사용 기간을 합쳐 수십 년에 달하는 장기 고객 혜택을 받을 수 있는 매우 독특하고 강력한 제도입니다.`,
    },
    {
      title: '5. 우리집 인터넷, 부모님 댁 인터넷을 묶어 추가 할인을 받는다',
      content: `'인터넷 가족끼리 모여 할인'은 여러 장소에서 인터넷을 사용하는 가족에게 매우 실용적인 플랜입니다. 이름 그대로, 각기 다른 주소지에 설치된 가족 명의의 인터넷 회선들을 하나로 묶어 할인을 제공합니다.

예를 들어, 내가 사는 집과 운영하는 가게에 각각 인터넷을 설치하거나, 부모님 댁에서 독립해 새로운 집에 인터넷을 설치해야 할 때 유용합니다. 이 플랜을 이용하면 추가로 설치하는 인터넷(자회선) 회선마다 매월 5,500원의 요금 할인을 받을 수 있습니다.

여기서 끝이 아닙니다. 이 플랜의 진짜 강력함은 바로 '할인 중첩'에 있습니다. 추가 회선(자회선)은 월 5,500원 할인을 그대로 받으면서, 기준이 되는 첫 번째 인터넷(모회선)은 별도로 휴대폰과 결합해 또 다른 할인을 받을 수 있습니다.

즉, 여러 장소의 인터넷 요금과 휴대폰 요금 할인을 동시에 챙기는, 할인 혜택을 극대화하는 최고의 방법입니다.`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
        <p className="text-base leading-relaxed">
          매달 빠져나가는 통신비, 조금이라도 줄일 수 없을까 고민해 본 적 있으신가요?
        </p>
        <p className="text-base leading-relaxed">
          많은 분이 통신비 절약 방법으로 '가족 결합'을 떠올립니다. 하지만 LG U+의 결합 할인은 우리가 생각하는 것보다 훨씬 더 유연하고 폭넓은 혜택을 제공합니다.
        </p>
        <p className="text-base leading-relaxed">
          꼭 혈연으로 맺어진 가족이 아니어도, 심지어 혼자 살아도 쏠쏠한 할인을 챙길 수 있다는 사실, 알고 계셨나요?
        </p>
      </div>

      {sections.map((sec, i) => (
        <div key={i} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-border px-6 py-4">
            <h3 className="text-lg font-bold">{sec.title}</h3>
          </div>
          <div className="p-6">
            {sec.content.split('\n\n').map((para, j) => (
              <p key={j} className="text-base leading-relaxed mb-3 last:mb-0 whitespace-pre-line">{para}</p>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-8">
        <h2 className="text-xl font-bold mb-4">마무리하며</h2>
        <p className="text-base leading-relaxed mb-4">
          지금까지 살펴본 것처럼, LG U+의 결합할인 혜택은 단순히 '가족'이라는 틀에 갇혀 있지 않습니다.
        </p>
        <p className="text-base leading-relaxed mb-4">
          친구나 룸메이트와 함께, 알뜰폰이나 타사 인터넷과 함께, 그리고 심지어 혼자서도 통신비를 절약할 수 있는 다양한 방법이 존재합니다.
        </p>
        <p className="text-base leading-relaxed mb-4">
          더 자세한 상담이 필요하시다면 AI인터넷으로 언제든 문의해주세요. 감사합니다.
        </p>
        <a href="tel:1666-3233" className="text-2xl font-black text-center bg-white/20 rounded-lg py-3 px-6 block hover:opacity-80 transition-opacity">
          📞 1666-3233
        </a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   KT 결합할인 페이지
────────────────────────────────────────────── */
function KtDiscountContent() {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">KT 결합할인 유형별 안내</h1>
        <p className="text-muted-foreground text-base">
          KT 결합할인은 고객님 가정에서 이용하는 다양한 통신 상품(모바일, 인터넷, TV 등)을 함께 묶어 더 큰 할인 혜택을 드리는 서비스입니다.
        </p>
      </div>

      {/* 총액 결합할인 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">1</span>
            총액 결합할인 (모바일 이용료 합산 기준)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base">
            총액 결합할인은 <strong>가구 내에서 이용하는 모바일 상품들의 월정액을 모두 합산한 총액</strong>에 따라 할인 금액이 달라지는 방식입니다.
          </p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <h4 className="font-bold text-base mb-3">핵심 특징 및 가입 조건</h4>
            {[
              ['할인 대상 상품:', '모바일(5G, LTE, 3G), 인터넷, TV, 집전화, 인터넷전화 등 여러 상품을 결합할 수 있습니다.'],
              ['약정 조건:', '3년 약정 외 1년 약정 선택 시 3년 약정 금액의 1/4, 2년 약정 선택 시 1/2 할인액이 제공됩니다.'],
              ['가입 조건:', '인터넷 명의자와 모바일 명의자가 동일인이거나 가족관계(직계존비속, 형제자매, 사위·며느리 포함)인 경우 결합 가능합니다.'],
              ['최대 할인:', '모바일, 인터넷 에센스, 지니 TV 에센스, 집전화를 결합할 경우 매월 최대 46,310원 할인이 가능합니다. (3년 약정 기준)'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-bold text-base mb-3">프리미엄급/에센스/베이직 인터넷 기준</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-center font-bold">모바일 요금 총액</th>
                    <th className="border border-border p-3 text-center font-bold text-primary">총 할인금액</th>
                    <th className="border border-border p-3 text-center font-bold">인터넷 할인</th>
                    <th className="border border-border p-3 text-center font-bold">모바일 할인</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['22,000원 미만', '2,200원 할인', '2,200원 할인', '-'],
                    ['22,000원 이상', '5,500원 할인', '5,500원 할인', '-'],
                    ['64,900원 이상', '11,000원 할인', '5,500원 할인', '5,500원 할인'],
                    ['108,900원 이상', '22,110원 할인', '5,500원 할인', '16,610원 할인'],
                    ['141,900원 이상', '27,610원 할인', '5,500원 할인', '22,110원 할인'],
                    ['174,900원 이상', '33,110원 할인', '5,500원 할인', '27,610원 할인'],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="border border-border p-3 text-center">{row[0]}</td>
                      <td className="border border-border p-3 text-center font-bold text-primary">{row[1]}</td>
                      <td className="border border-border p-3 text-center">{row[2]}</td>
                      <td className="border border-border p-3 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">*프리미엄급 인터넷: 슈퍼프리미엄(10G), 프리미엄플러스(5G), 프리미엄(2.5G)</p>
          </div>

          <div>
            <h4 className="font-bold text-base mb-3">인터넷 슬림 100M 기준</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-center font-bold">모바일 요금 총액</th>
                    <th className="border border-border p-3 text-center font-bold text-primary">총 할인금액</th>
                    <th className="border border-border p-3 text-center font-bold">인터넷 할인</th>
                    <th className="border border-border p-3 text-center font-bold">모바일 할인</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['22,000원 미만', '1,100원 할인', '1,100원 할인', '-'],
                    ['22,000원 이상', '3,300원 할인', '3,300원 할인', '-'],
                    ['64,900원 이상', '8,800원 할인', '3,300원 할인', '5,500원 할인'],
                    ['108,900원 이상', '19,910원 할인', '3,300원 할인', '16,610원 할인'],
                    ['141,900원 이상', '25,410원 할인', '3,300원 할인', '22,110원 할인'],
                    ['174,900원 이상', '30,910원 할인', '3,300원 할인', '27,610원 할인'],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      <td className="border border-border p-3 text-center">{row[0]}</td>
                      <td className="border border-border p-3 text-center font-bold text-primary">{row[1]}</td>
                      <td className="border border-border p-3 text-center">{row[2]}</td>
                      <td className="border border-border p-3 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 정액 결합할인 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">2</span>
            정액 결합할인 (모바일 요금제별 고정 할인)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base">
            정액 결합할인은 모바일 요금제에 따라 <strong>정해진 금액</strong>을 할인받는 방식입니다.
          </p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <h4 className="font-bold text-base mb-3">핵심 특징 및 가입 조건</h4>
            {[
              ['할인 방식:', '모바일 요금제별로 할인이 적용됩니다.'],
              ['가입 고객:', '신규 고객 및 기존 고객 모두 결합이 가능합니다.'],
              ['최대 할인:', '모바일 월정액 77,000원 이상 요금제 사용 시, 회선당 최대 7,000원 할인이 제공됩니다.'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">할인 유형</th>
                  <th className="border border-border p-3 text-center font-bold">할인 조건</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">회선당 최대 할인 금액</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50">
                  <td className="border border-border p-3 text-center">정액 결합할인</td>
                  <td className="border border-border p-3 text-center">모바일 월정액 77,000원 이상 기준</td>
                  <td className="border border-border p-3 text-center font-bold text-primary">7,000원 할인</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 따로 살아도 가족결합 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">3</span>
            따로 살아도 가족결합 (가족 구성원 결합)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base">
            따로 살아도 가족결합은 가족 구성원이 <strong>함께 거주하지 않더라도</strong> 모바일, 인터넷, TV 서비스를 결합하여 할인받을 수 있는 상품입니다.
          </p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <h4 className="font-bold text-base mb-3">핵심 특징 및 가입 조건</h4>
            {[
              ['결합 규모:', '무선(모바일)은 최대 10회선, 인터넷/TV는 최대 5회선까지 결합할 수 있습니다.'],
              ['추가 할인:', '인터넷/TV는 2번째 회선부터 추가 할인이 적용됩니다.'],
              ['할인 옵션:', '모바일 할인 옵션 선택이 가능합니다.'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">할인 유형</th>
                  <th className="border border-border p-3 text-center font-bold">결합 기준 (예시)</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">가구당 최대 할인 금액</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50">
                  <td className="border border-border p-3 text-center">따로 살아도 가족결합</td>
                  <td className="border border-border p-3 text-center">인터넷 에센스와 TV 베이직 결합 기준</td>
                  <td className="border border-border p-3 text-center font-bold text-primary">최대 19,140원 할인</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold mb-3">더 자세한 상담이 필요하신가요?</h3>
        <a href="tel:1666-3233" className="text-3xl font-black text-primary hover:underline block mb-2">1666-3233</a>
        <p className="text-sm text-muted-foreground">연중무휴 상담 가능 · AI인터넷</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   SK 결합할인 페이지
────────────────────────────────────────────── */
function SkDiscountContent() {
  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">SK 결합 할인 혜택 안내</h1>
        <p className="text-muted-foreground text-base">
          SK브로드밴드는 고객님의 이용 환경과 조건에 맞춰 다양한 결합 할인 상품을 제공합니다. 모바일(SKT) 결합부터 알뜰폰, 그리고 유선 상품끼리의 결합까지 다양한 할인 혜택을 확인해 보세요.
        </p>
      </div>

      {/* 요즘가족결합 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">1</span>
            요즘가족결합 이용 요금
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base"><strong>요즘가족결합</strong>은 누구나 쉽게 결합하고 더 많이 할인받을 수 있는 유무선 결합상품입니다.</p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <h4 className="font-bold text-base mb-3">상품 개요 및 혜택</h4>
            {[
              ['결합 대상:', '기가인터넷, B tv, SKT 이동전화 1회선을 결합합니다.'],
              ['가입 조건:', '나 혼자도, 동거 부부도 결합 할인이 제공됩니다. 주소지가 동일하며 주민등록등본상 \'동거인\' 표기된 서류 증빙이 필요합니다.'],
              ['B tv 조건:', 'B tv 이코노미 이상 요금제 가입 시 결합이 가능하며, B tv pop, B tv cable은 결합 대상에서 제외됩니다.'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-bold text-base mb-3">결합 할인 요금 (부가세 포함, 3년 약정 기준)</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-3 text-center font-bold">인터넷</th>
                    <th className="border border-border p-3 text-center font-bold">인터넷 할인(회선당)</th>
                    <th className="border border-border p-3 text-center font-bold">B tv 할인(회선당)</th>
                    <th className="border border-border p-3 text-center font-bold">SKT 결합 회선 수</th>
                    <th className="border border-border p-3 text-center font-bold">휴대폰 할인</th>
                    <th className="border border-border p-3 text-center font-bold text-primary">총 할인 혜택</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['기가', '-13,200원', '-1,100원', '1회선', '-2,200원', '-16,500원'],
                    ['기가', '-13,200원', '-1,100원', '2회선', '-7,000원', '-21,300원'],
                    ['기가', '-13,200원', '-1,100원', '3회선', '-18,000원', '-32,300원'],
                    ['기가', '-13,200원', '-1,100원', '4회선', '-24,000원', '-38,300원'],
                    ['기가라이트', '-11,000원', '-1,100원', '1회선', '-2,200원', '-14,300원'],
                    ['기가라이트', '-11,000원', '-1,100원', '2회선', '-7,000원', '-19,100원'],
                    ['기가라이트', '-11,000원', '-1,100원', '3회선', '-18,000원', '-30,100원'],
                    ['기가라이트', '-11,000원', '-1,100원', '4회선', '-24,000원', '-36,100원'],
                    ['광랜', '-4,400원', '-1,100원', '1회선', '-2,200원', '-7,700원'],
                    ['광랜', '-4,400원', '-1,100원', '2회선', '-7,000원', '-12,500원'],
                    ['광랜', '-4,400원', '-1,100원', '3회선', '-18,000원', '-23,500원'],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      {row.map((cell, j) => (
                        <td key={j} className={`border border-border p-3 text-center${j === 5 ? ' font-bold text-primary' : ''}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">*인터넷과 B tv 이용 시 결합 할인금액 2,200원이 추가로 적용됩니다.</p>
          </div>
        </CardContent>
      </Card>

      {/* 알뜰한 결합 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">2</span>
            알뜰한 결합 이용 요금
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base"><strong>알뜰한 결합</strong>은 SKT망 알뜰폰 고객을 위한 결합 상품입니다.</p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <h4 className="font-bold text-base mb-3">상품 개요 및 혜택</h4>
            {[
              ['결합 대상:', '기가인터넷, B tv, SKT망 알뜰폰 1회선.'],
              ['가입 조건:', 'SKT망 알뜰폰(SK세븐모바일, 리브모바일, 이야기모바일, 아이즈모바일, 토스모바일, 모빙, 티플러스, 스마텔) 고객만 결합 가능합니다.'],
              ['주요 혜택:', '1인 가구라도 혼자서 결합 혜택 가능. 인터넷과 B tv를 함께 이용하면 월 1,100원 추가 할인 제공 (B tv 이코노미 이상).'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">인터넷</th>
                  <th className="border border-border p-3 text-center font-bold">인터넷 할인(회선당)</th>
                  <th className="border border-border p-3 text-center font-bold">B tv 할인(회선당)</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">총 할인 혜택</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['기가', '-13,200원', '-1,100원', '최대 -14,300원'],
                  ['기가라이트', '-11,000원', '-1,100원', '-12,100원'],
                  ['광랜', '-4,400원', '-1,100원', '-5,500원'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`border border-border p-3 text-center${j === 3 ? ' font-bold text-primary' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">*B tv 이코노미 요금제 이상 가입 시 결합 할인을 받을 수 있습니다.</p>
        </CardContent>
      </Card>

      {/* 요즘우리집결합 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">3</span>
            요즘우리집결합 이용 요금
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base"><strong>요즘우리집결합</strong>은 우리집 인터넷, B tv, 집전화를 결합해 요금 할인과 콘텐츠 혜택을 챙기는 상품입니다.</p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            <h4 className="font-bold text-base mb-3">상품 개요 및 혜택</h4>
            {[
              ['결합 대상:', '인터넷, B tv, 집전화 유선 상품.'],
              ['예시 할인:', '기가라이트와 B tv All 결합 시 월 7,700원 할인 (3년 약정 기준).'],
              ['주요 혜택:', '기가계열 인터넷 + B tv All 이용 시 매달 VOD 콘텐츠 3,300원 쿠폰 제공, AI 스피커형 셋톱박스 이용료 2,200원 할인.'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">구분</th>
                  <th className="border border-border p-3 text-center font-bold">요금제</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">3년 약정 할인 금액</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['인터넷+TV+집전화 / 인터넷+TV', '인터넷 (기가 계열)', '-5,500원'],
                  ['', '인터넷 (광랜 계열)', '-1,100원'],
                  ['', 'B tv (이코노미 이상)', '-2,200원'],
                  ['', 'B tv pop (pop 180, pop 230)', '-3,300원'],
                  ['', 'B tv cable (cable 100, cable 200)', '-1,100원'],
                  ['', '전화 (인터넷전화 기본)', '-1,100원'],
                  ['인터넷+집전화', '인터넷 (기가 계열)', '-2,200원'],
                  ['', '광랜인터넷', '-1,100원'],
                  ['', '전화 (인터넷전화 기본)', '-1,100원'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="border border-border p-3 text-center font-bold">{row[0]}</td>
                    <td className="border border-border p-3 text-center">{row[1]}</td>
                    <td className="border border-border p-3 text-center font-bold text-primary">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* T+B인터넷 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">4</span>
            T+B인터넷 할인 산정 방법
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base">
            <strong>T+B인터넷</strong>은 SKT 이동전화와 SKB 인터넷 결합 시 가입 기간 합산 연수에 따라 할인 혜택을 제공하며, 초고속인터넷을 <span className="text-primary font-bold">최대 50%</span>까지 할인받을 수 있습니다.
          </p>
          <div className="bg-muted/50 p-5 rounded-lg">
            <h4 className="font-bold text-base mb-2">할인 산정 기준</h4>
            <p className="text-sm">할인율은 가족들의 <strong>이동전화 가입 합산 기간</strong>과 <strong>인터넷 가입 합산 기간</strong>을 합산하여 산정합니다.</p>
          </div>
          <div className="overflow-x-auto">
            <h4 className="font-bold text-base mb-3">이동전화 월정액 할인</h4>
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">구분</th>
                  <th className="border border-border p-3 text-center font-bold">이동전화 월정액 할인(합산 기간 기준)</th>
                  <th className="border border-border p-3 text-center font-bold">10년 미만</th>
                  <th className="border border-border p-3 text-center font-bold">20년 미만</th>
                  <th className="border border-border p-3 text-center font-bold">30년 미만</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">30년 이상</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['이동전화 할인', '2015.4월 이전 출시 요금제', '10%', '20%', '30%', '50%'],
                  ['', '2015.4월 이후 출시 요금제', '0%', '10%', '30%', '50%'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`border border-border p-3 text-center${j === 5 ? ' font-bold text-primary' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <h4 className="font-bold text-base mb-3">초고속인터넷 기본료 할인 (2025.8.31 이후 가입 고객)</h4>
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">인터넷 가입기간</th>
                  <th className="border border-border p-3 text-center font-bold">합산 10년 미만</th>
                  <th className="border border-border p-3 text-center font-bold">합산 20년 미만</th>
                  <th className="border border-border p-3 text-center font-bold">합산 30년 미만</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">합산 30년 이상</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1년 미만', '0%', '0%', '5%', '10%'],
                  ['1년~2년 미만', '0%', '5%', '10%', '20%'],
                  ['2년~3년 미만', '5%', '10%', '20%', '30%'],
                  ['3년 이상', '10%', '20%', '30%', '50%'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="border border-border p-3 text-center">{row[0]}</td>
                    <td className="border border-border p-3 text-center">{row[1]}</td>
                    <td className="border border-border p-3 text-center">{row[2]}</td>
                    <td className="border border-border p-3 text-center">{row[3]}</td>
                    <td className="border border-border p-3 text-center font-bold text-primary">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-muted-foreground mt-2">*2025년 8월 30일 이전 T+B인터넷 결합상품 가입 고객의 인터넷 할인율: 10년 미만 10%, 20년 미만 29%, 30년 미만 30%, 30년 이상 50%</p>
          </div>
        </CardContent>
      </Card>

      {/* 케이블 결합상품 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">5</span>
            케이블 결합상품 이용 요금
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base"><strong>케이블 결합상품</strong>은 케이블 인터넷과 TV를 함께 사용하는 고객에게 할인 혜택을 제공합니다.</p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            {[
              ['결합 대상:', '케이블 인터넷 + B tv cable.'],
              ['예시 할인:', '케이블 광랜(100M)과 B tv cable 200 결합 시 월 20,900원 (3년 약정, 강서방송 기준).'],
              ['유의사항:', '지역에 따라 요금이 상이할 수 있으며, B tv cable 100·200 요금제는 셋톱박스 임대요금이 별도로 부과됩니다.'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <h4 className="font-bold text-base mb-3">케이블 결합상품 이용 요금 (부가세 포함)</h4>
            <table className="w-full border-collapse border border-border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-3 text-center font-bold">케이블 인터넷</th>
                  <th className="border border-border p-3 text-center font-bold">케이블 방송</th>
                  <th className="border border-border p-3 text-center font-bold text-primary">특가(3년 약정)</th>
                  <th className="border border-border p-3 text-center font-bold">3년 약정</th>
                  <th className="border border-border p-3 text-center font-bold">2년 약정</th>
                  <th className="border border-border p-3 text-center font-bold">1년 약정</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['케이블 기가인터넷(1G)', 'B tv cable 200', '29,700원', '40,392원', '54,384원', '60,984원'],
                  ['케이블 기가인터넷(1G)', 'B tv cable 100', '29,700원', '33,660원', '44,880원', '50,820원'],
                  ['케이블 기가인터넷(1G)', 'B tv cable 60', '-', '34,848원', '43,296원', '48,576원'],
                  ['케이블 기가라이트(320M)', 'B tv cable 200', '29,700원', '33,099원', '44,803원', '49,973원'],
                  ['케이블 기가라이트(320M)', 'B tv cable 100', '25,300원', '26,367원', '35,299원', '39,809원'],
                  ['케이블 기가라이트(320M)', 'B tv cable 60', '-', '27,555원', '33,715원', '37,565원'],
                  ['케이블 광랜(100M)', 'B tv cable 200', '27,500원', '31,977원', '43,329원', '48,279원'],
                  ['케이블 광랜(100M)', 'B tv cable 100', '23,100원', '25,245원', '33,825원', '38,115원'],
                  ['케이블 광랜(100M)', 'B tv cable 60', '18,700원', '26,433원', '32,241원', '35,871원'],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    {row.map((cell, j) => (
                      <td key={j} className={`border border-border p-3 text-center${j === 2 ? ' font-bold text-primary' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 케이블 가족 결합 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-9 h-9 rounded-full flex items-center justify-center font-bold text-base">6</span>
            케이블 가족 결합 이용 요금
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base"><strong>케이블 가족 결합</strong>은 휴대폰과 케이블 인터넷 요금을 결합하여 통신비 부담을 줄이는 상품입니다.</p>
          <div className="bg-muted/50 p-5 rounded-lg space-y-3">
            {[
              ['결합 대상:', '케이블 인터넷 (기가라이트 320M 등) + SKT 이동전화 1회선.'],
              ['가입 조건:', '케이블 인터넷 신규 고객만 가입 가능하며, 기존 이용 고객은 약정 만료 후 결합 가능합니다. 휴대폰 최대 5회선, 인터넷 최대 2회선 결합 가능합니다.'],
              ['가족 범위:', '본인 및 배우자의 직계 존·비속, 형제·자매, 사위 및 며느리 포함.'],
              ['예시 할인:', '케이블 기가라이트(320M)와 SKT 이동전화 1회선 결합 시 월 8,890원 할인 (3년 약정 기준).'],
            ].map(([k, v], i) => (
              <div key={i} className="flex gap-2">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div><strong>{k}</strong> {v}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/10 border-2 border-primary rounded-xl p-6 text-center">
        <h3 className="text-lg font-bold mb-3">더 자세한 상담이 필요하신가요?</h3>
        <a href="tel:1666-3233" className="text-3xl font-black text-primary hover:underline block mb-2">1666-3233</a>
        <p className="text-sm text-muted-foreground">연중무휴 상담 가능 · AI인터넷</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   신규 vs 재약정 페이지
────────────────────────────────────────────── */
function NewVsRenewalContent() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
        <p className="text-base leading-relaxed">
          인터넷 약정이 끝나갈 때 "그냥 재약정 할까? 아니면 신규로 옮길까?" 고민해 보신 적 있으신가요?
        </p>
        <p className="text-base leading-relaxed">
          두 가지 선택지 모두 장단점이 있습니다. 상황에 따라 유리한 방향이 달라지니, 꼭 비교해보시고 결정하세요.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border-2 border-primary shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h3 className="text-xl font-bold text-white">신규 가입</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h4 className="font-bold text-base text-primary mb-2">장점</h4>
              <ul className="space-y-2">
                {['현금 사은품 최대 지급 가능', '신규 요금제 혜택 적용', '최신 장비로 교체 가능', '통신사 변경으로 더 좋은 조건'].map((v, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base text-red-500 mb-2">단점</h4>
              <ul className="space-y-2">
                {['기존 번호 이전 과정 필요', '설치 기사 방문 일정 조율 필요', '가입 서류 준비 필요'].map((v, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400">✕</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="bg-muted px-6 py-4">
            <h3 className="text-xl font-bold">재약정</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h4 className="font-bold text-base text-primary mb-2">장점</h4>
              <ul className="space-y-2">
                {['절차가 간단하고 빠름', '장기 고객 우대 혜택 가능', '기존 결합 상품 유지 가능'].map((v, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base text-red-500 mb-2">단점</h4>
              <ul className="space-y-2">
                {['현금 사은품 지급이 없거나 적음', '신규 가입자 대비 혜택 부족', '장비 교체 안 될 수도 있음'].map((v, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400">✕</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border-2 border-primary rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3 text-primary">결론: 대부분의 경우 신규가 유리합니다!</h3>
        <p className="text-base mb-4">현금 사은품을 최대한 받고, 최신 요금제와 장비를 사용하려면 신규 가입이 훨씬 유리합니다. 특히 AI인터넷을 통해 신규 가입하시면 법적 최대 사은품 + 당일 입금 서비스를 받으실 수 있습니다.</p>
        <a href="tel:1666-3233" className="text-2xl font-black text-primary hover:underline block text-center">📞 1666-3233</a>
        <p className="text-sm text-muted-foreground text-center mt-1">연중무휴 무료 상담</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   KT 천만 프로모션 페이지
────────────────────────────────────────────── */
function Kt84Content() {
  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
        <p className="text-base leading-relaxed">안녕하세요 AI인터넷입니다.</p>
        <p className="text-base leading-relaxed">
          인터넷 가입자가 가장 많은 통신사가 어디일까요? 바로 <strong>KT</strong>입니다!
        </p>
        <p className="text-base leading-relaxed">
          유선 통신의 선두주자인 만큼, KT의 인터넷 가입 고객이 <strong className="text-primary">천만명을 돌파</strong>했습니다! 🎉🎉🎉
        </p>
        <p className="text-base leading-relaxed">
          1,000만명을 돌파하면서 이번에 KT에서 천만 프로모션을 진행하고 있는데요. 자세한 내용을 알아보겠습니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">KT 천만 프로모션 주요 혜택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 p-5 rounded-lg border-l-4 border-primary">
            <h4 className="font-bold text-base mb-2">🎁 프로모션 개요</h4>
            <p className="text-base">KT 인터넷 가입자 1,000만명 돌파를 기념하여 신규 가입 고객에게 특별 혜택을 제공합니다.</p>
          </div>
          <div className="space-y-4">
            {[
              { title: '현금 사은품 최대 지급', desc: '법적 최대 한도 내에서 현금 사은품을 최대로 지급합니다.' },
              { title: '당일 설치 서비스', desc: '접수 당일 설치가 가능하도록 최대한 스케줄을 조율해 드립니다.' },
              { title: 'KT 기가인터넷 가입 혜택', desc: '기가인터넷 신규 가입 시 3년 약정 기준 최저 요금으로 안내해 드립니다.' },
              { title: '결합 할인 동시 적용', desc: '휴대폰, TV 결합 할인을 동시에 적용받아 통신비를 더욱 절약할 수 있습니다.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 bg-muted/50 p-4 rounded-lg">
                <span className="bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{i + 1}</span>
                <div>
                  <h5 className="font-bold text-base">{item.title}</h5>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">지금 바로 KT 천만 프로모션 혜택 받으세요!</h2>
        <p className="text-base mb-6">AI인터넷을 통해 KT 가입 시 당일 입금 + 법적 최대 사은품을 받으실 수 있습니다.</p>
        <a href="tel:1666-3233" className="text-3xl font-black text-white block mb-2">📞 1666-3233</a>
        <p className="text-sm opacity-80">연중무휴 상담 가능</p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   메타 정보
────────────────────────────────────────────── */
const TIP_CONTENTS: Record<string, { title: string; subtitle: string; views: number; date: string }> = {
  'why-us': {
    title: '인터넷가입은 AI인터넷에서!!',
    subtitle: '10년 차 통신비 절약 해결사가 알려드리는 실패 없는 인터넷 가입 이유',
    views: 1129,
    date: LEGACY_TIP_DATES['why-us'],
  },
  'lg-discount': {
    title: 'LG U+ 결합할인, 가족만 된다고요? 당신이 몰랐던 5가지 숨겨진 꿀팁',
    subtitle: 'LG유플러스 결합할인 완벽 정리',
    views: 712,
    date: LEGACY_TIP_DATES['lg-discount'],
  },
  'kt-discount': {
    title: 'KT 결합할인 완벽 정리',
    subtitle: 'KT 인터넷+휴대폰 결합 시 최대 절약 방법',
    views: 559,
    date: LEGACY_TIP_DATES['kt-discount'],
  },
  'sk-discount': {
    title: 'SK브로드밴드 결합할인 완벽 정리',
    subtitle: 'SK브로드밴드 인터넷+B tv+휴대폰 결합 혜택',
    views: 613,
    date: LEGACY_TIP_DATES['sk-discount'],
  },
  'new-vs-renewal': {
    title: '신규가입 VS 재약정, 뭐가 더 유리할까?',
    subtitle: '상황별 최적 선택 가이드',
    views: 743,
    date: LEGACY_TIP_DATES['new-vs-renewal'],
  },
  '84': {
    title: 'KT 천만 프로모션이라고 아시나요? KT 인터넷 가입자 1,000만명 돌파 이벤트!',
    subtitle: 'KT 인터넷 가입자 1,000만명 돌파 특별 혜택',
    views: 314,
    date: LEGACY_TIP_DATES['84'],
  },
};

const LEGACY_TIP_CATEGORIES: Record<string, string> = {
  'why-us': '꼭 읽어보기',
  'lg-discount': '요금할인',
  'kt-discount': '요금할인',
  'sk-discount': '요금할인',
  'new-vs-renewal': '꼭 읽어보기',
  '84': '새로운소식',
};

interface ManagedTip {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnail: string | null;
  views: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ──────────────────────────────────────────────
   메인 export
────────────────────────────────────────────── */
export default function TipDetailPage({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();
  const isLegacyTip = Boolean(TIP_CONTENTS[slug]);
  const [managedTip, setManagedTip] = React.useState<ManagedTip | null>(null);
  const [loading, setLoading] = React.useState(!isLegacyTip);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);
  useEffect(() => {
    if (isLegacyTip) {
      setLoading(false);
      setManagedTip(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/tips/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((tip: ManagedTip | null) => setManagedTip(tip))
      .catch((error: unknown) => {
        if ((error as Error).name !== 'AbortError') setManagedTip(null);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [isLegacyTip, slug]);

  const info = TIP_CONTENTS[slug];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header /><ISPNav />
        <main className="flex-1 bg-background"><div className="container mx-auto px-4 py-16 max-w-[900px] text-center text-muted-foreground">꿀팁을 불러오는 중입니다.</div></main>
        <Footer />
      </div>
    );
  }

  if (!info && !managedTip) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <ISPNav />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-16 max-w-[900px] text-center">
            <p className="text-muted-foreground text-lg">꿀팁을 찾을 수 없습니다.</p>
            <Button className="mt-6" onClick={() => setLocation('/tip')}>목록으로</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (managedTip) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <ISPNav />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-8 max-w-[900px]">
            <Button variant="ghost" className="mb-6" onClick={() => setLocation('/tip')} data-testid="button-back-to-list">
              <ChevronLeft className="w-4 h-4 mr-2" />목록으로
            </Button>
            <article className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
              <p className="text-sm font-semibold text-primary mb-3">{managedTip.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-tip-detail-title">{managedTip.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
                <span>조회수 {managedTip.views}</span>
                <span>{(managedTip.createdAt || managedTip.updatedAt || '').slice(0, 10)}</span>
              </div>
              <div className="mb-6"><TipCover variant="hero" slug={managedTip.slug} category={managedTip.category} title={managedTip.title} caption="AI인터넷 통신 가이드" thumbnail={managedTip.thumbnail} testId="img-tip-cover" /></div>
              {isRichContent(managedTip.content)
                ? <RichArticle content={managedTip.content} />
                : <div className="whitespace-pre-wrap text-gray-700 leading-relaxed break-words" data-testid="text-tip-detail-content">{managedTip.content}</div>}
            </article>
            <div className="mt-10 flex justify-center">
              <Button variant="outline" onClick={() => setLocation('/tip')} data-testid="button-back-to-list-bottom">
                <ChevronLeft className="w-4 h-4 mr-2" />목록으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderContent = () => {
    switch (slug) {
      case 'why-us': return <WhyUsContent />;
      case 'lg-discount': return <LgDiscountContent />;
      case 'kt-discount': return <KtDiscountContent />;
      case 'sk-discount': return <SkDiscountContent />;
      case 'new-vs-renewal': return <NewVsRenewalContent />;
      case '84': return <Kt84Content />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[900px]">

          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setLocation('/tip')}
            data-testid="button-back-to-list"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-4 border-b">
            <span>조회수 {info.views}</span>
            <span>{info.date}</span>
          </div>

          <div className="mb-6">
            <TipCover variant="hero" slug={slug} category={LEGACY_TIP_CATEGORIES[slug]} title={info.title} testId="img-tip-cover" />
          </div>

          {renderContent()}

          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setLocation('/tip')}
              data-testid="button-back-to-list-bottom"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              목록으로 돌아가기
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
