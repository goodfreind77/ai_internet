import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, DollarSign, Zap, MessageSquare, Shield, Check } from 'lucide-react';

function WhyUsContent() {
  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          인터넷가입은 인터넷사은품에서!!
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
          <strong className="text-primary">'인터넷사은품'</strong>이라는 곳을 선택해야 하는지,
          가입하는 고객님 입장에서{' '}
          <strong>"아, 여기 아니면 안 되겠구나"</strong>라는 생각이 확신으로 바뀔 수밖에 없는 이유를
          10년 경력의 양심을 걸고 조목조목 설명해 드리겠습니다.
        </p>
      </div>

      <div className="text-center py-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          왜 다들 '인터넷사은품'에서 가입할까요?
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
            <span className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </span>
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
              <p className="text-sm text-muted-foreground italic">
                "고객님, 설치받으시고 다음 주 금요일에 입금돼요~"
              </p>
              <p className="text-sm text-muted-foreground italic">
                혹은 "월말 정산이라 기다려주세요~"
              </p>
            </div>
            <p className="text-base font-bold text-primary">왜 내 돈 받는데 기다려야 하죠?</p>
          </div>
          <div className="space-y-4">
            <p className="text-base font-bold">저희 '인터넷사은품'은 다릅니다.</p>
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
            <span className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </span>
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
            <p className="text-sm text-muted-foreground italic">
              (물론 기사님 스케줄이 꽉 찬 경우는 어쩔 수 없지만, 비집고 들어갈 틈이 있다면 어떻게든
              만들어냅니다!)
            </p>
            <div className="bg-primary/10 p-6 rounded-lg border-2 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-7 h-7 text-primary" />
                <h4 className="font-bold text-xl text-primary">원스톱 서비스</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-base">
                    <strong>오전</strong>에 전화해서 상담받고
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-base">
                    <strong>오후</strong>에 설치받고
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-base">
                    <strong>저녁</strong>에 사은품 받는
                  </span>
                </div>
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
            <span className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </span>
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
                <p className="text-base italic">
                  "고객님, 유튜브랑 넷플릭스만 보시는데 1기가는 돈 낭비예요. 500메가나 100메가로
                  충분합니다."
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-primary font-bold text-lg">💬</span>
                <p className="text-base italic">
                  "이 부가서비스는 3개월만 쓰고 해지하셔도 위약금 없으니 그때 알람 맞춰두세요."
                </p>
              </div>
            </div>
            <p className="text-base">
              이렇게 고객님 댁의 사용 패턴을 분석해서{' '}
              <strong className="text-primary">최적의 요금제(가장 싼 요금)</strong>를 설계해 드립니다.
            </p>
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-6 rounded-lg border-2 border-primary">
              <p className="text-lg font-bold mb-3 text-primary">
                남들은 '가입'을 시키지만, 저는 '절약'을 시켜드립니다.
              </p>
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
              저희 <strong className="text-primary">'인터넷사은품'</strong>은 법을 어기고 몰래 더
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          이웃님께 드리는 마지막 한마디
        </h2>
        <p className="text-base mb-6">
          인터넷 가입, 3년에 한 번 하는 거라 참 귀찮고 어렵죠?
          <br />
          그 귀찮음과 불안함, 제가 싹 해결해 드리겠습니다.
        </p>
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <span className="font-bold text-xl">1.</span>
            <span className="text-base">
              <strong>가장 빠르게 설치받고,</strong>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-xl">2.</span>
            <span className="text-base">
              <strong>가장 많은 현금을 당일에 받고,</strong>
            </span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-xl">3.</span>
            <span className="text-base">
              <strong>가장 저렴한 요금제로</strong> 앞으로 3년을 편안하게 쓰세요.
            </span>
          </div>
        </div>
        <p className="text-base mb-6">
          이 세 가지를 동시에 만족시켜드릴 수 있는 곳, 제가 10년 동안 이 일을 해오면서 자신 있게
          말씀드릴 수 있는 건 딱 하나입니다.
        </p>
        <p className="text-xl font-black text-center text-white bg-white/20 rounded-lg py-4 px-6">
          여기, 인터넷사은품 말고는 없습니다.
        </p>
      </div>

      <div className="text-center py-6 border-t border-border">
        <p className="text-lg font-bold mb-2 text-primary">📞 지금 바로 상담 받으세요!</p>
        <p className="text-3xl font-black text-primary">010-8475-7854</p>
        <p className="text-sm text-muted-foreground mt-2">연중무휴 상담 가능</p>
      </div>
    </div>
  );
}

const TIP_CONTENTS: Record<string, { title: string; subtitle: string; views: number; date: string }> = {
  'why-us': {
    title: '인터넷가입은 인터넷사은품에서!!',
    subtitle: '10년 차 통신비 절약 해결사가 알려드리는 실패 없는 인터넷 가입 이유',
    views: 1129,
    date: '2025-11-07',
  },
  'lg-discount': {
    title: 'LG U+ 결합할인, 가족만 된다고요? 당신이 몰랐던 5가지 숨겨진 꿀팁',
    subtitle: 'LG유플러스 결합할인 완벽 정리',
    views: 712,
    date: '2025-11-07',
  },
  'kt-discount': {
    title: 'KT 결합할인 완벽 정리',
    subtitle: 'KT 인터넷+휴대폰 결합 시 최대 절약 방법',
    views: 559,
    date: '2025-11-07',
  },
  'sk-discount': {
    title: 'SK브로드밴드 결합할인 완벽 정리',
    subtitle: 'SK브로드밴드 인터넷+B tv+휴대폰 결합 혜택',
    views: 613,
    date: '2025-11-07',
  },
  'new-vs-renewal': {
    title: '신규가입 VS 재약정, 뭐가 더 유리할까?',
    subtitle: '상황별 최적 선택 가이드',
    views: 743,
    date: '2025-11-07',
  },
  '84': {
    title: 'KT 천만 프로모션이라고 아시나요? KT 인터넷 가입자 1,000만명 돌파 이벤트!',
    subtitle: 'KT 인터넷 가입자 1,000만명 돌파 특별 혜택',
    views: 314,
    date: '2025-11-07',
  },
};

function GenericTipContent({ slug }: { slug: string }) {
  const info = TIP_CONTENTS[slug];
  if (!info) return null;
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <p className="text-base leading-relaxed text-muted-foreground">
          이 꿀팁 페이지는 준비 중입니다. 자세한 내용은 상담을 통해 안내해 드리겠습니다.
        </p>
        <p className="mt-4 text-lg font-bold text-primary">📞 010-8475-7854</p>
        <p className="text-sm text-muted-foreground">연중무휴 상담 가능</p>
      </div>
    </div>
  );
}

export default function TipDetailPage({ slug }: { slug: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const info = TIP_CONTENTS[slug];

  if (!info) {
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

          {slug === 'why-us' ? (
            <WhyUsContent />
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{info.title}</h1>
              <p className="text-muted-foreground mb-8">{info.subtitle}</p>
              <GenericTipContent slug={slug} />
            </>
          )}

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
