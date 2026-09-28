import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Check, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
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
  ctaLabel: string;
  ctaUrl: string;
  imageUrl: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export function safeCtaUrl(url: string): string | null {
  const value = url.trim();
  if (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return value;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'https:') return value;
  } catch { /* invalid URL */ }
  return null;
}

export function safeImageUrl(url: string | null): string | null {
  if (!url?.trim()) return null;
  return safeCtaUrl(url);
}

export function LandingContent({ page, preview = false }: { page: LandingPage; preview?: boolean }) {
  const benefits = page.benefits.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const image = safeImageUrl(page.imageUrl);
  const cta = safeCtaUrl(page.ctaUrl);
  return (
    <div className="bg-[#f5f7fb] text-[#172338]">
      {preview && <div className="bg-[#172a4b] text-white text-center text-xs font-bold tracking-wide py-2.5">관리자 미리보기 · 이 화면은 공개되지 않습니다</div>}
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[#102344] text-white">
          <div className="absolute -top-40 -right-28 w-[34rem] h-[34rem] rounded-full bg-[#21487c] opacity-50 pointer-events-none" />
          <div className="absolute bottom-[-14rem] right-[30%] w-[26rem] h-[26rem] rounded-full bg-[#ef734b] opacity-[.08] pointer-events-none" />
          <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[1.1fr_.9fr] items-center gap-14">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 rounded-full px-4 py-2 text-xs font-bold tracking-wide text-[#b9d9ff] mb-8">
                <Sparkles size={14} /> {page.eyebrow || 'AI인터넷 특별 혜택'}
              </div>
              <h1 data-testid="text-landing-headline" className="text-[clamp(2.6rem,5vw,4.8rem)] font-black leading-[1.17] tracking-[-.055em] whitespace-pre-line break-keep">{page.headline || page.title}</h1>
              <p className="mt-7 text-[#c5d2e7] text-base md:text-lg leading-[1.85] whitespace-pre-line break-keep max-w-xl">{page.description}</p>
              {cta && <a data-testid="link-landing-cta" href={cta} className="mt-9 inline-flex items-center gap-4 bg-[#f0734e] hover:bg-[#d85f3e] text-white font-bold px-7 py-4 rounded-lg transition-colors shadow-lg shadow-[#07172b]/30">{page.ctaLabel || '상담 신청하기'} <ArrowRight size={19} /></a>}
              {!cta && preview && <span className="mt-9 inline-flex bg-white/10 text-white/60 px-7 py-4 rounded-lg text-sm">유효한 CTA 주소를 입력하면 버튼이 표시됩니다</span>}
              <div className="mt-9 flex gap-5 text-xs text-[#9bb5d5]"><span className="flex items-center gap-1.5"><ShieldCheck size={15} /> 믿을 수 있는 상담</span><span className="flex items-center gap-1.5"><Check size={15} /> 가입 전 꼼꼼한 비교</span></div>
            </div>
            <div className="relative">
              {image ? <img data-testid="img-landing-hero" src={image} alt={page.title} className="relative w-full aspect-[5/4] rounded-2xl object-cover shadow-2xl shadow-[#07172b]/40" /> :
                <div className="relative aspect-[5/4] rounded-2xl bg-[#23446f] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shadow-[#07172b]/40">
                  <div className="absolute w-72 h-72 rounded-full border-[40px] border-[#345c8b] -right-16 -top-14" />
                  <div className="relative w-[70%] rounded-2xl bg-[#f7f9fc] p-6 md:p-8 shadow-2xl rotate-[-5deg]">
                    <span className="block w-14 h-1.5 bg-[#f0734e] rounded-full mb-7" />
                    <span className="block h-3 bg-[#d7e0eb] rounded-full w-4/5 mb-3" />
                    <span className="block h-3 bg-[#d7e0eb] rounded-full w-3/5 mb-8" />
                    <span className="block bg-[#17345b] text-white text-center font-black py-4 rounded-lg">AI인터넷</span>
                  </div>
                </div>}
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="flex items-center gap-3 text-[#d76647] text-xs font-extrabold tracking-[.18em] uppercase"><span className="w-8 h-px bg-[#d76647]" /> WHY AI INTERNET</div>
          <div className="mt-6 md:flex items-end justify-between gap-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-[-.05em] leading-tight break-keep">가입 전 꼭 확인할<br />혜택을 모았습니다.</h2>
            <p className="mt-5 md:mt-0 text-[#62728a] leading-relaxed max-w-xs">필요한 정보만 빠르게 확인하고, 나에게 맞는 조건을 비교해 보세요.</p>
          </div>
          <div className="mt-12 border-t border-[#dce3eb]">
            {(benefits.length ? benefits : ['조건에 맞는 인터넷 상품을 함께 비교해 드립니다.', '가입부터 설치까지 친절하게 안내해 드립니다.']).map((benefit, i) =>
              <div key={i} className="grid grid-cols-[3rem_1fr_auto] gap-3 items-center py-6 border-b border-[#dce3eb]">
                <span className="text-xs font-bold text-[#d76647]">0{i + 1}</span><span className="font-bold md:text-xl break-keep">{benefit}</span><Check size={20} className="text-[#3d6ca1]" />
              </div>)}
          </div>
        </section>
        <section className="bg-[#e9eff6] px-6 py-16 md:py-20">
          <div className="max-w-6xl mx-auto md:flex items-center justify-between gap-10">
            <div><span className="text-xs font-bold text-[#48688e] tracking-widest">AI INTERNET</span><h2 className="text-3xl md:text-4xl font-black mt-4 tracking-[-.04em] break-keep">내게 맞는 인터넷,<br />지금 확인해 보세요.</h2></div>
            {cta && <a data-testid="link-landing-cta-bottom" href={cta} className="mt-8 md:mt-0 inline-flex items-center gap-8 bg-[#172a4b] text-white font-bold px-7 py-4 rounded-lg hover:bg-[#294b78] transition-colors">{page.ctaLabel || '상담 신청하기'} <ChevronRight size={20} /></a>}
          </div>
        </section>
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