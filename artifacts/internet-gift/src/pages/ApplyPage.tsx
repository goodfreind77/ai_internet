import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/* ─── 토글 버튼 컴포넌트 ─── */
function ToggleBtn({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2.5 rounded border text-sm font-medium transition-colors ${
        selected
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
      }`}
    >
      {selected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
      {label}
    </button>
  );
}

/* ─── 섹션 라벨 ─── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <p className="text-base font-semibold mb-3">
      {children}
      {required && <span className="text-primary ml-1 text-sm font-normal">(필수)</span>}
    </p>
  );
}

const CURRENT_PROVIDERS = ['SK브로드밴드', 'KT', 'LG유플러스', '지역케이블', '없음', '기타'];
const APPLY_PROVIDERS = ['SK브로드밴드', 'KT', 'LG유플러스', 'KT스카이라이프', 'LG헬로비전'];
const INTERNET_OPTIONS = ['100M', '500M', '1G'];
const TV_OPTIONS = ['이코노미(183채널)', '스탠다드(234채널)', 'All(257채널)', '선택안함'];
const CUSTOMER_TYPES = ['개인', '개인사업자', '법인', '미성년자', '외국인'];
const PHONE_CARRIERS = ['KT', 'SKT', 'LG U+', '알뜰폰'];
const PAYMENT_METHODS = ['자동이체', '카드자동이체'];
const BANKS = [
  '은행선택', 'KB국민은행', '신한은행', '우리은행', 'NH농협은행', '하나은행',
  'IBK기업은행', 'SC제일은행', '씨티은행', '카카오뱅크', '케이뱅크', '토스뱅크',
  '새마을금고', '신협', '우체국', '대구은행', '부산은행', '경남은행', '광주은행',
  '전북은행', '제주은행', '수협은행', '산업은행',
];
const CARD_COMPANIES = [
  '카드사 선택', '삼성카드', '현대카드', 'KB국민카드', '신한카드', '롯데카드',
  '우리카드', '하나카드', 'NH농협카드', 'BC카드', '씨티카드',
];

export default function ApplyPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [currentProvider, setCurrentProvider] = useState('');
  const [applyProvider, setApplyProvider] = useState('');
  const [internet, setInternet] = useState('');
  const [tv, setTv] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [payBank, setPayBank] = useState('은행선택');
  const [payAccount, setPayAccount] = useState('');
  const [payAccountHolder, setPayAccountHolder] = useState('');
  const [cardCompany, setCardCompany] = useState('카드사 선택');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [giftBank, setGiftBank] = useState('은행선택');
  const [giftAccount, setGiftAccount] = useState('');
  const [giftAccountHolder, setGiftAccountHolder] = useState('');
  const [name, setName] = useState('');
  const [phoneCarrier, setPhoneCarrier] = useState('KT');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentProvider) {
      toast({ variant: 'destructive', title: '기존 인터넷 통신사를 선택해주세요.' });
      return;
    }
    if (!applyProvider) {
      toast({ variant: 'destructive', title: '가입신청 통신사를 선택해주세요.' });
      return;
    }
    if (!internet) {
      toast({ variant: 'destructive', title: '인터넷 상품을 선택해주세요.' });
      return;
    }
    if (!customerType) {
      toast({ variant: 'destructive', title: '고객유형을 선택해주세요.' });
      return;
    }
    if (!name.trim()) {
      toast({ variant: 'destructive', title: '이름을 입력해주세요.' });
      return;
    }
    if (!phone.trim()) {
      toast({ variant: 'destructive', title: '휴대폰 번호를 입력해주세요.' });
      return;
    }
    if (!email.trim()) {
      toast({ variant: 'destructive', title: '이메일을 입력해주세요.' });
      return;
    }
    if (!address.trim()) {
      toast({ variant: 'destructive', title: '설치주소를 입력해주세요.' });
      return;
    }
    if (!paymentMethod) {
      toast({ variant: 'destructive', title: '요금 납부방법을 선택해주세요.' });
      return;
    }
    if (paymentMethod === '자동이체') {
      if (payBank === '은행선택' || !payAccount.trim() || !payAccountHolder.trim()) {
        toast({ variant: 'destructive', title: '자동이체 은행 정보를 모두 입력해주세요.' });
        return;
      }
    }
    if (paymentMethod === '카드자동이체') {
      if (cardCompany === '카드사 선택' || !cardNumber.trim() || !cardExpiry.trim()) {
        toast({ variant: 'destructive', title: '카드자동이체 정보를 모두 입력해주세요.' });
        return;
      }
    }
    if (giftBank === '은행선택' || !giftAccount.trim() || !giftAccountHolder.trim()) {
      toast({ variant: 'destructive', title: '사은품 입금 계좌 정보를 모두 입력해주세요.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentProvider,
          applyProvider,
          internet,
          tv,
          customerType,
          paymentMethod,
          payBank: paymentMethod === '자동이체' ? payBank : null,
          payAccount: paymentMethod === '자동이체' ? payAccount : null,
          payAccountHolder: paymentMethod === '자동이체' ? payAccountHolder : null,
          cardCompany: paymentMethod === '카드자동이체' ? cardCompany : null,
          cardNumber: paymentMethod === '카드자동이체' ? cardNumber : null,
          cardExpiry: paymentMethod === '카드자동이체' ? cardExpiry : null,
          giftBank,
          giftAccount,
          giftAccountHolder,
          name,
          phoneCarrier,
          phone,
          email,
          address,
          memo,
        }),
      });
      if (!res.ok) throw new Error('서버 오류');
      toast({ title: '신청이 완료되었습니다!', description: '빠른 시일 내에 연락 드리겠습니다.' });
      setLocation('/');
      window.scrollTo(0, 0);
    } catch {
      toast({ variant: 'destructive', title: '오류가 발생했습니다.', description: '잠시 후 다시 시도해주세요.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-10 max-w-[760px]">

          {/* 제목 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-3" data-testid="text-page-title">
              신청서 작성 페이지
            </h1>
            <p className="text-base text-gray-600">
              <a href="tel:010-8475-7854" className="text-primary font-semibold hover:underline">
                010-8475-7854
              </a>
              {' '}으로 전화하시거나{' '}
              <span className="text-primary font-semibold">신청서를 작성</span>해 남겨주시면
            </p>
            <p className="text-base font-bold text-primary mt-1">빠른 시일에 연락 드리겠습니다.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-8">

            {/* 기존 인터넷 통신사 */}
            <div>
              <FieldLabel required>기존 인터넷 통신사</FieldLabel>
              <div className="flex flex-wrap gap-2" data-testid="group-current-provider">
                {CURRENT_PROVIDERS.map((p) => (
                  <ToggleBtn
                    key={p}
                    label={p}
                    selected={currentProvider === p}
                    onClick={() => setCurrentProvider(p)}
                  />
                ))}
              </div>
            </div>

            {/* 가입신청 통신사 */}
            <div>
              <FieldLabel required>가입신청 통신사</FieldLabel>
              <div className="flex flex-wrap gap-2" data-testid="group-apply-provider">
                {APPLY_PROVIDERS.map((p) => (
                  <ToggleBtn
                    key={p}
                    label={p}
                    selected={applyProvider === p}
                    onClick={() => setApplyProvider(p)}
                  />
                ))}
              </div>
            </div>

            {/* 인터넷 상품 */}
            <div>
              <FieldLabel required>인터넷 상품</FieldLabel>
              <div className="flex flex-wrap gap-2" data-testid="group-internet">
                {INTERNET_OPTIONS.map((opt) => (
                  <ToggleBtn
                    key={opt}
                    label={opt}
                    selected={internet === opt}
                    onClick={() => setInternet(opt)}
                  />
                ))}
              </div>
            </div>

            {/* TV 상품 */}
            <div>
              <FieldLabel>TV 상품</FieldLabel>
              <div className="flex flex-wrap gap-2" data-testid="group-tv">
                {TV_OPTIONS.map((opt) => (
                  <ToggleBtn
                    key={opt}
                    label={opt}
                    selected={tv === opt}
                    onClick={() => setTv(opt)}
                  />
                ))}
              </div>
            </div>

            {/* 고객유형 */}
            <div>
              <FieldLabel required>고객유형</FieldLabel>
              <div className="flex flex-wrap gap-2" data-testid="group-customer-type">
                {CUSTOMER_TYPES.map((t) => (
                  <ToggleBtn
                    key={t}
                    label={t}
                    selected={customerType === t}
                    onClick={() => setCustomerType(t)}
                  />
                ))}
              </div>
            </div>

            {/* 이름 + 휴대폰 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  이름 <span className="text-primary text-sm font-normal">(필수)</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해주세요"
                  data-testid="input-name"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  휴대폰 <span className="text-primary text-sm font-normal">(필수)</span>
                </Label>
                <div className="flex gap-2">
                  <select
                    value={phoneCarrier}
                    onChange={(e) => setPhoneCarrier(e.target.value)}
                    className="border border-input rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    data-testid="select-carrier"
                  >
                    {PHONE_CARRIERS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="-(하이픈) 을 빼고 입력해주세요"
                    data-testid="input-phone"
                    className="flex-1 min-h-[44px]"
                    type="tel"
                  />
                </div>
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                이메일 <span className="text-primary text-sm font-normal">(필수)</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                data-testid="input-email"
                className="min-h-[44px]"
              />
            </div>

            {/* 설치주소 */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-semibold">
                설치주소 <span className="text-primary text-sm font-normal">(필수)</span>
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="설치 주소를 입력해주세요"
                data-testid="input-address"
                className="min-h-[44px]"
              />
            </div>

            {/* 요금 납부방법 */}
            <div className="space-y-4">
              <div>
                <FieldLabel required>요금 납부방법</FieldLabel>
                <div className="flex flex-wrap gap-2" data-testid="group-payment-method">
                  {PAYMENT_METHODS.map((m) => (
                    <ToggleBtn
                      key={m}
                      label={m}
                      selected={paymentMethod === m}
                      onClick={() => setPaymentMethod(m)}
                    />
                  ))}
                </div>
              </div>

              {/* 자동이체 상세 */}
              {paymentMethod === '자동이체' && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">자동이체 정보 입력</p>
                  <div className="grid md:grid-cols-[180px_1fr] gap-3">
                    <select
                      value={payBank}
                      onChange={(e) => setPayBank(e.target.value)}
                      className="border border-input rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                      data-testid="select-pay-bank"
                    >
                      {BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <Input
                      value={payAccount}
                      onChange={(e) => setPayAccount(e.target.value)}
                      placeholder="계좌번호 (숫자만 입력)"
                      data-testid="input-pay-account"
                      className="min-h-[44px]"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">예금주</Label>
                    <Input
                      value={payAccountHolder}
                      onChange={(e) => setPayAccountHolder(e.target.value)}
                      placeholder="예금주 이름을 입력해주세요"
                      data-testid="input-pay-account-holder"
                      className="min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* 카드자동이체 상세 */}
              {paymentMethod === '카드자동이체' && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">카드자동이체 정보 입력</p>
                  <select
                    value={cardCompany}
                    onChange={(e) => setCardCompany(e.target.value)}
                    className="w-full border border-input rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    data-testid="select-card-company"
                  >
                    {CARD_COMPANIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="카드번호 (숫자만 입력)"
                    data-testid="input-card-number"
                    className="min-h-[44px]"
                    inputMode="numeric"
                    maxLength={16}
                  />
                  <div className="space-y-1">
                    <Label className="text-sm text-gray-600">유효기간</Label>
                    <Input
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/[^0-9]/g, '');
                        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                        setCardExpiry(v);
                      }}
                      placeholder="MM/YY"
                      data-testid="input-card-expiry"
                      className="min-h-[44px]"
                      maxLength={5}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 사은품 입금 계좌번호 */}
            <div className="space-y-3">
              <FieldLabel required>사은품 입금 계좌번호</FieldLabel>
              <p className="text-sm text-gray-500 -mt-2">사은품(현금)을 받으실 계좌 정보를 입력해주세요.</p>
              <div className="grid md:grid-cols-[180px_1fr] gap-3">
                <select
                  value={giftBank}
                  onChange={(e) => setGiftBank(e.target.value)}
                  className="border border-input rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  data-testid="select-gift-bank"
                >
                  {BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <Input
                  value={giftAccount}
                  onChange={(e) => setGiftAccount(e.target.value)}
                  placeholder="계좌번호 (숫자만 입력)"
                  data-testid="input-gift-account"
                  className="min-h-[44px]"
                  type="text"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="gift-account-holder" className="text-sm text-gray-600">예금주</Label>
                <Input
                  id="gift-account-holder"
                  value={giftAccountHolder}
                  onChange={(e) => setGiftAccountHolder(e.target.value)}
                  placeholder="예금주 이름을 입력해주세요"
                  data-testid="input-gift-account-holder"
                  className="min-h-[44px]"
                />
              </div>
            </div>

            {/* 메모 */}
            <div className="space-y-2">
              <Label htmlFor="memo" className="text-base font-semibold">
                메모 / 기타문의 <span className="text-gray-400 text-sm font-normal">(선택)</span>
              </Label>
              <Textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="궁금한 점이나 추가로 전달하실 내용을 입력해주세요."
                rows={4}
                data-testid="input-memo"
                className="resize-y"
              />
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              className="w-full min-h-[52px] text-lg font-bold bg-primary hover:bg-primary/90"
              disabled={submitting}
              data-testid="button-submit"
            >
              {submitting ? '신청 중...' : '신청하기'}
            </Button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
