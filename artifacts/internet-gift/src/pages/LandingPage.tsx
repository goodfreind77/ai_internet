import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'wouter';
import { ArrowDownRight, ArrowRight, Check, ChevronDown, ChevronRight, CircleHelp, Headphones, Layers3, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export type LandingPage = {
  id: number;
  slug: string;
  title: string;
  category: '당근마켓' | '구글광고' | '일반/기타';
  eyebrow: string;
  headline: string;
  description: string;
  benefits: string;
  comparison: string;
  faqs: string;
  galleryImages: string;
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export function safeCtaUrl(url: string): string | null {
  const value = url.trim();
  if (value === '#landing-consultation') return value;
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:') return value;
  } catch { /* invalid URL */ }
  return null;
}

export function safeImageUrl(url: string | null): string | null {
  if (!url?.trim()) return null;
  const value = url.trim();
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:') return value;
  } catch { /* invalid URL */ }
  return null;
}

const lines = (value?: string | null) => (value || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

function LandingConsultation({ slug, preview }: { slug: string; preview: boolean }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredProvider, setPreferredProvider] = useState('미정');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || submitting.current || status === 'success') return;
    const normalizedPhone = phone.replace(/[\s-]/g, '');
    if (!name.trim() || !/^01[016789]\d{7,8}$/.test(normalizedPhone) || !consent) {
      setMessage('이름과 올바른 휴대폰 번호를 입력하고 개인정보 수집에 동의해 주세요.');
      setStatus('error');
      return;
    }
    submitting.current = true;
    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch(`/api/landing-pages/${encodeURIComponent(slug)}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: normalizedPhone, preferredProvider, consent: true }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(typeof data?.error === 'string' ? data.error : '상담 신청을 접수하지 못했습니다. 다시 시도해 주세요.');
      }
      setStatus('success');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '잠시 연결에 문제가 생겼습니다. 다시 시도해 주세요.');
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  const field = 'w-full rounded-xl border border-[#d6dfe8] bg-[#fbfcfe] px-4 py-3.5 text-[#192d48] outline-none transition-colors focus:border-[#d66142] focus:ring-2 focus:ring-[#d66142]/15 placeholder:text-[#9ba8b6] disabled:opacity-60';
  return (
    <section id="landing-consultation" className="scroll-mt-6 bg-[#e9eef4] px-5 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:items-center">
        <div>
          <p className="text-xs font-black tracking-[.2em] text-[#c45c3d]">LET'S TALK / 상담 신청</p>
          <h2 className="mt-5 text-[clamp(2.4rem,5vw,4.5rem)] font-black leading-[1.16] tracking-[-.06em] text-[#162c49] break-keep">고민되는 조건,<br />함께 살펴볼까요?</h2>
          <p className="mt-6 max-w-md text-[#607188] leading-[1.9] break-keep">연락처를 남겨주시면 인터넷 가입에 필요한 조건과 궁금한 점을 상담해 드립니다. 신청 전, 충분히 비교해 보세요.</p>
          <div className="mt-10 space-y-4 border-t border-[#cad5e1] pt-7 text-sm font-semibold text-[#38516e]">
            <p className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#dbe6ef]"><Layers3 size={17} /></span> 원하는 통신사와 조건부터 확인</p>
            <p className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#dbe6ef]"><Headphones size={17} /></span> 궁금한 내용을 상담으로 안내</p>
            <p className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#dbe6ef]"><LockKeyhole size={17} /></span> 상담에 필요한 정보만 입력</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-[1.5rem] border border-[#d9e1e9] bg-[#fcfbf8] shadow-[0_24px_65px_-38px_rgba(19,44,76,.32)]">
          <div className="flex items-center justify-between border-b border-[#e6e9ec] px-6 py-5 md:px-8">
            <div><span className="text-[10px] font-black tracking-[.2em] text-[#c36449]">AI INTERNET</span><h3 className="mt-1 text-xl font-black text-[#192e4c]">상담 신청</h3></div>
            <span className="grid size-11 place-items-center rounded-full bg-[#f3e8e1] text-[#bb6148]"><ArrowDownRight size={22} /></span>
          </div>
          {status === 'success' && !preview ? <div data-testid="status-landing-lead-success" role="status" className="px-7 py-16 text-center md:px-10"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e4efe9] text-[#257357]"><Check size={30} /></span><h4 className="mt-6 text-2xl font-black text-[#192e4c]">상담 신청이 접수되었습니다.</h4><p className="mt-3 text-[#68798c] leading-relaxed">남겨주신 연락처로 상담을 안내해 드리겠습니다.</p></div> :
            <form onSubmit={submit} className="space-y-5 px-6 py-7 md:px-8 md:py-9">
              {preview && <p data-testid="status-landing-preview-form" className="rounded-lg bg-[#e7eef7] p-3 text-xs font-bold text-[#476589]">미리보기에서는 상담 신청이 전송되지 않습니다.</p>}
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label htmlFor="landing-lead-name" className="mb-2 block text-sm font-bold text-[#2c425d]">이름 <span className="text-[#cf6548]">*</span></label><input data-testid="input-landing-lead-name" id="landing-lead-name" className={field} value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="성함을 입력해 주세요" required disabled={preview || status === 'sending'} /></div>
                <div><label htmlFor="landing-lead-phone" className="mb-2 block text-sm font-bold text-[#2c425d]">휴대폰 번호 <span className="text-[#cf6548]">*</span></label><input data-testid="input-landing-lead-phone" id="landing-lead-phone" className={field} type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" placeholder="010-1234-5678" pattern="01[016789][- ]?[0-9]{3,4}[- ]?[0-9]{4}" title="올바른 한국 휴대폰 번호를 입력해 주세요" required disabled={preview || status === 'sending'} /></div>
              </div>
              <div><label htmlFor="landing-lead-provider" className="mb-2 block text-sm font-bold text-[#2c425d]">관심 통신사 <span className="font-normal text-[#8998a9]">(선택)</span></label><select data-testid="select-landing-lead-provider" id="landing-lead-provider" className={field} value={preferredProvider} onChange={e => setPreferredProvider(e.target.value)} disabled={preview || status === 'sending'}><option value="미정">아직 미정</option><option value="KT">KT</option><option value="SK">SK</option><option value="LG">LG</option></select></div>
              <div className="rounded-xl border border-[#e0e6eb] bg-[#f3f6f7] p-4">
                <label className="flex cursor-pointer items-start gap-3 text-sm font-bold leading-relaxed text-[#2c425d]"><input data-testid="checkbox-landing-lead-consent" type="checkbox" className="mt-1 size-4 shrink-0 accent-[#c65d40]" checked={consent} onChange={e => setConsent(e.target.checked)} required disabled={preview || status === 'sending'} /><span>[필수] 상담을 위한 개인정보 수집 및 이용에 동의합니다.</span></label>
                <p className="mt-2 pl-7 text-xs leading-relaxed text-[#718197]">수집 항목: 이름, 휴대폰 번호 (관심 통신사 선택 시 해당 정보 포함) · 이용 목적: 인터넷 가입 상담 및 연락 · 보유 기간: 수집일로부터 3년. 동의하지 않으셔도 되지만 상담 신청은 진행할 수 없습니다. 자세한 사항은 하단 개인정보처리방침에서 확인할 수 있습니다.</p>
              </div>
              {status === 'error' && <p data-testid="error-landing-lead" role="alert" className="rounded-lg bg-[#fff0ea] px-4 py-3 text-sm font-semibold text-[#ac4933]">{message}</p>}
              <button data-testid="button-landing-lead-submit" type="submit" disabled={preview || status === 'sending'} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#e16848] px-5 py-4 text-base font-black text-white transition-colors hover:bg-[#c95639] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e16848] disabled:cursor-not-allowed disabled:opacity-55">{status === 'sending' ? '신청을 보내는 중...' : '상담 신청하기'} <ArrowRight size={19} /></button>
              <p className="text-center text-xs text-[#8794a5]">상담 신청은 인터넷 가입 계약이 아닙니다.</p>
            </form>}
        </div>
      </div>
    </section>
  );
}

export function LandingContent({ page, preview = false }: { page: LandingPage; preview?: boolean }) {
  const benefits = lines(page.benefits);
  const comparison = lines(page.comparison).map(line => line.split('|').map(part => part.trim())).filter(parts => parts.length === 4 && parts.every(Boolean));
  const faqs = lines(page.faqs).map(line => line.split('|').map(part => part.trim())).filter(parts => parts.length === 2 && parts.every(Boolean));
  const gallery = lines(page.galleryImages).map(safeImageUrl).filter((url): url is string => !!url);
  const image = safeImageUrl(page.imageUrl);
  const cta = safeCtaUrl(page.ctaUrl || '#landing-consultation');
  return (
    <div className="bg-[#f5f7f8] text-[#172b46]">
      {preview && <div className="bg-[#172a4b] py-2.5 text-center text-xs font-bold tracking-wide text-white">관리자 미리보기 · 상담 신청은 전송되지 않습니다</div>}
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[#102744] text-white">
          <div className="pointer-events-none absolute -right-44 -top-64 size-[42rem] rounded-full border-[1px] border-white/10 md:size-[58rem]" />
          <div className="pointer-events-none absolute -right-20 -top-40 size-[31rem] rounded-full border-[1px] border-white/10 md:size-[45rem]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.08fr_.92fr] md:gap-12 md:py-24 lg:py-32">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-extrabold tracking-[.08em] text-[#c0d9f4]"><Sparkles size={14} className="text-[#f49472]" /> {page.eyebrow || 'AI인터넷 상담 안내'}</div>
              <h1 data-testid="text-landing-headline" className="max-w-2xl whitespace-pre-line text-[clamp(2.65rem,5.4vw,5.25rem)] font-black leading-[1.12] tracking-[-.065em] break-keep">{page.headline || page.title}</h1>
              <div className="mt-7 h-1 w-14 rounded-full bg-[#eb7957]" />
              <p className="mt-7 max-w-xl whitespace-pre-line text-base leading-[1.85] text-[#bfd0e2] md:text-lg break-keep">{page.description || '인터넷 가입 조건, 혼자 고민하지 마세요. 필요한 내용을 함께 확인해 드립니다.'}</p>
              {cta && <a data-testid="link-landing-cta" href={cta} className="mt-9 inline-flex items-center gap-8 rounded-xl bg-[#e87655] px-7 py-4 font-black text-white transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{page.ctaLabel || '상담 신청하기'} <ArrowRight size={19} /></a>}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[#a9bed4]"><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-[#f39c7d]" /> 필요한 조건을 확인하고</span><span className="inline-flex items-center gap-2"><Check size={17} className="text-[#f39c7d]" /> 충분히 비교한 뒤 결정하세요</span></div>
            </div>
            <div className="relative mx-auto w-full max-w-lg">
              {image ? <img data-testid="img-landing-hero" src={image} alt={page.title} className="aspect-[5/4] w-full rounded-[1.5rem] object-cover shadow-[0_32px_70px_-22px_rgba(3,14,30,.55)]" /> :
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#244262] shadow-[0_32px_70px_-22px_rgba(3,14,30,.55)]">
                  <div className="absolute -right-20 -top-16 size-80 rounded-full border-[50px] border-[#355677]" />
                  <div className="absolute -bottom-32 -left-20 size-72 rounded-full border-[45px] border-[#315274]" />
                  <div className="absolute left-[15%] top-[19%] w-[69%] rotate-[-7deg] rounded-2xl bg-[#f8f5ee] p-5 shadow-2xl sm:p-7">
                    <span className="text-[10px] font-black tracking-[.2em] text-[#d36142]">AI INTERNET / NOTE 01</span>
                    <div className="mt-6 h-2 w-1/2 rounded-full bg-[#dce2e4]" /><div className="mt-2 h-2 w-3/4 rounded-full bg-[#dce2e4]" /><div className="mt-2 h-2 w-3/5 rounded-full bg-[#dce2e4]" />
                    <div className="mt-8 flex items-center justify-between rounded-xl bg-[#183455] px-4 py-4 text-sm font-black text-white sm:px-6 sm:text-lg"><span>조건부터, 차근차근.</span><ArrowRight size={20} className="text-[#ee9a7b]" /></div>
                  </div>
                  <div className="absolute bottom-[10%] right-[5%] rotate-[8deg] rounded-lg border border-white/20 bg-[#e67856] px-4 py-3 text-xs font-black tracking-widest shadow-xl">COMPARE / CHOOSE</div>
                </div>}
              <div className="absolute -bottom-5 left-5 rounded-lg border border-[#d9e3e9] bg-[#f5f7f8] px-5 py-3 text-xs font-extrabold tracking-[.14em] text-[#315172] shadow-lg">AI인터넷 · 상담 안내</div>
            </div>
          </div>
        </section>
        <div className="border-b border-[#dbe3e8] bg-[#eef2f4] px-5 py-4"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 text-[11px] font-bold tracking-[.08em] text-[#637c95]"><span className="text-[#c46344]">BEFORE YOU DECIDE</span><span>01 / 조건 확인</span><span>02 / 상품 비교</span><span>03 / 상담 신청</span></div></div>
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <div className="grid gap-6 md:grid-cols-[.95fr_1.05fr] md:gap-16">
            <div><p className="text-xs font-black tracking-[.2em] text-[#c46143]">01 / WHY AI INTERNET</p><h2 className="mt-5 text-[clamp(2.15rem,4vw,3.75rem)] font-black leading-[1.18] tracking-[-.055em] break-keep">인터넷 가입 전,<br />먼저 살펴볼 것들.</h2><p className="mt-6 max-w-sm leading-[1.85] text-[#64768b] break-keep">요금과 구성, 설치 일정까지. 궁금한 내용을 하나씩 확인하고 자신에게 맞는 선택을 해보세요.</p></div>
            <div className="border-t border-[#cdd8df]">
              {(benefits.length ? benefits : ['이용 환경에 맞는 상품 구성을 확인해 드립니다.', '가입 전 요금과 조건을 함께 살펴봅니다.', '신청부터 설치 과정까지 필요한 내용을 안내합니다.']).map((benefit, i) =>
                <div key={i} data-testid={`text-landing-benefit-${i}`} className="grid grid-cols-[2.5rem_1fr_1.25rem] items-start gap-4 border-b border-[#cdd8df] py-6 md:py-8"><span className="pt-1 text-xs font-black text-[#cb6748]">0{i + 1}</span><span className="text-lg font-bold leading-snug tracking-[-.025em] md:text-xl break-keep">{benefit}</span><ArrowDownRight size={20} className="text-[#7a91a5]" /></div>)}
            </div>
          </div>
        </section>
        {comparison.length > 0 && <section className="bg-[#e8eef2] px-5 py-20 sm:px-8 md:py-28"><div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-black tracking-[.2em] text-[#c46143]">02 / PLAN COMPARISON</p><h2 className="mt-5 text-3xl font-black tracking-[-.05em] md:text-5xl break-keep">한눈에 보는 상품 조건</h2></div><p className="max-w-sm text-sm leading-relaxed text-[#687b90]">아래 내용은 페이지에 기재된 정보입니다. 실제 적용 조건은 상담 시 다시 확인해 주세요.</p></div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-[#d3dee6] bg-[#fafbf9]"><div className="hidden grid-cols-[1fr_1.35fr_1fr_1.5fr] gap-4 bg-[#1c3858] px-7 py-4 text-xs font-black text-[#c8d8e7] md:grid"><span>통신사</span><span>상품</span><span>월 요금</span><span>주요 내용</span></div>{comparison.map(([provider, plan, price, benefit], i) => <div data-testid={`row-landing-comparison-${i}`} key={i} className="grid gap-4 border-t border-[#e1e8eb] px-6 py-6 first:border-t-0 md:grid-cols-[1fr_1.35fr_1fr_1.5fr] md:items-center md:px-7"><div><span className="mb-1 block text-[10px] font-bold text-[#8293a4] md:hidden">통신사</span><strong className="text-lg text-[#203d5b]">{provider}</strong></div><div><span className="mb-1 block text-[10px] font-bold text-[#8293a4] md:hidden">상품</span><span className="font-semibold">{plan}</span></div><div><span className="mb-1 block text-[10px] font-bold text-[#8293a4] md:hidden">월 요금</span><span className="font-black text-[#bd5b3f]">{price}</span></div><div><span className="mb-1 block text-[10px] font-bold text-[#8293a4] md:hidden">주요 내용</span><span className="text-sm leading-relaxed text-[#62758a]">{benefit}</span></div></div>)}</div>
        </div></section>}
        {gallery.length > 0 && <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28"><p className="text-xs font-black tracking-[.2em] text-[#c46143]">A CLOSER LOOK</p><h2 className="mt-5 text-3xl font-black tracking-[-.05em] md:text-5xl">이미지로 더 살펴보기</h2><div className="mt-10 grid gap-4 sm:grid-cols-2">{gallery.map((url, i) => <img data-testid={`img-landing-gallery-${i}`} key={`${url}-${i}`} src={url} alt={`${page.title} 안내 이미지 ${i + 1}`} loading="lazy" className={`aspect-[4/3] w-full rounded-2xl bg-[#e3eaf0] object-cover ${gallery.length % 2 === 1 && i === 0 ? 'sm:col-span-2 sm:aspect-[2/1]' : ''}`} />)}</div></section>}
        <section className="bg-[#193656] px-5 py-14 text-white sm:px-8 md:py-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div><p className="text-xs font-black tracking-[.2em] text-[#e89b7e]">NOT SURE YET?</p><h2 className="mt-3 text-3xl font-black tracking-[-.05em] md:text-4xl break-keep">조건은 확인하고, 결정은 천천히.</h2></div>{cta && <a data-testid="link-landing-cta-bottom" href={cta} className="inline-flex items-center gap-7 rounded-xl bg-[#f4f2ed] px-6 py-4 font-black text-[#193656] transition-transform hover:-translate-y-1">{page.ctaLabel || '상담 신청하기'} <ChevronRight size={19} /></a>}</div></section>
        {faqs.length > 0 && <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:gap-16 md:py-28"><div><p className="text-xs font-black tracking-[.2em] text-[#c46143]">QUESTIONS & ANSWERS</p><h2 className="mt-5 text-3xl font-black tracking-[-.05em] md:text-5xl">자주 묻는 질문</h2><CircleHelp size={52} strokeWidth={1} className="mt-10 text-[#b2c4d0]" /></div><div className="border-t border-[#cbd8df]">{faqs.map(([question, answer], i) => <details data-testid={`item-landing-faq-${i}`} key={i} className="group border-b border-[#cbd8df] py-1"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left font-bold text-[#213b59] marker:hidden [&::-webkit-details-marker]:hidden"><span className="flex gap-4"><span className="text-[#c46143]">Q.</span>{question}</span><ChevronDown size={19} className="shrink-0 transition-transform group-open:rotate-180" /></summary><p className="pb-6 pl-8 text-sm leading-[1.85] text-[#64788e] whitespace-pre-line">{answer}</p></details>)}</div></section>}
        <LandingConsultation key={page.slug} slug={page.slug} preview={preview} />
      </main>
      <Footer />
    </div>
  );
}

export default function PublicLandingPage({ slug }: { slug: string }) {
  const [page, setPage] = useState<LandingPage | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    setState('loading');
    fetch(`/api/landing-pages/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async res => {
        if (res.status === 404) { setState('missing'); return; }
        if (!res.ok) throw new Error('페이지를 불러오지 못했습니다.');
        const data: LandingPage = await res.json();
        if (!data.isPublished) { setState('missing'); return; }
        setPage(data); setState('ready');
      })
      .catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, [slug]);
  if (state === 'ready' && page) return <LandingContent page={page} />;
  return <div className="min-h-[100dvh] bg-[#f5f7fb] flex flex-col"><Header /><main className="flex-1 flex items-center justify-center px-6">
    {state === 'loading' ? <div data-testid="status-landing-loading" className="w-full max-w-xl space-y-5 animate-pulse"><div className="h-5 w-32 bg-[#dce4ef] rounded" /><div className="h-12 w-4/5 bg-[#dce4ef] rounded" /><div className="h-5 w-3/5 bg-[#dce4ef] rounded" /></div> :
      <div className="text-center max-w-md py-24"><span className="text-xs font-black tracking-[.2em] text-[#e16b48]">{state === 'missing' ? '404 / NOT FOUND' : 'CONNECTION ERROR'}</span><h1 className="text-3xl font-black text-[#172a4b] mt-5 break-keep">{state === 'missing' ? '페이지를 찾을 수 없습니다.' : '페이지를 불러오지 못했습니다.'}</h1><p className="text-[#66758a] mt-4 leading-relaxed">{state === 'missing' ? '주소가 변경되었거나 아직 공개되지 않은 페이지입니다.' : '잠시 후 다시 시도해 주세요.'}</p><div className="flex justify-center gap-3 mt-8"><Link href="/" data-testid="link-landing-home" className="bg-[#172a4b] text-white px-5 py-3 rounded-lg text-sm font-bold">홈으로 돌아가기</Link>{state === 'error' && <button data-testid="button-landing-retry" onClick={() => window.location.reload()} className="border border-[#cbd6e4] px-5 py-3 rounded-lg text-sm font-bold">다시 시도</button>}</div></div>}
  </main><Footer /></div>;
}