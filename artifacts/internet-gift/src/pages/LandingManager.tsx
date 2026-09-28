import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, Eye, FilePlus2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { LandingContent, safeCtaUrl, safeImageUrl, type LandingPage } from './LandingPage';

type Category = LandingPage['category'];
type Fields = Pick<LandingPage, 'slug' | 'title' | 'category' | 'eyebrow' | 'headline' | 'description' | 'benefits' | 'ctaLabel' | 'ctaUrl' | 'imageUrl' | 'isPublished'>;
const categories: Category[] = ['당근마켓', '구글광고', '일반/기타'];
const blank: Fields = { slug: '', title: '', category: '일반/기타', eyebrow: '', headline: '', description: '', benefits: '', ctaLabel: '무료 상담 신청하기', ctaUrl: '/apply', imageUrl: null, isPublished: false };

async function adminRequest<T>(url: string, token: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!res.ok) {
    let detail = '';
    try { const data = await res.json(); detail = data.error || data.message || ''; } catch { /* no response body */ }
    throw new Error(detail || (res.status === 401 || res.status === 403 ? '권한이 없거나 로그인이 만료되었습니다. 다시 로그인해 주세요.' : `요청에 실패했습니다. (${res.status})`));
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? JSON.parse(text) as T : undefined as T;
}

function validate(fields: Fields): string | null {
  if (!fields.title.trim()) return '관리용 제목을 입력해 주세요.';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug.trim())) return '주소는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.';
  if (!fields.headline.trim()) return '메인 문구를 입력해 주세요.';
  if (!fields.ctaLabel.trim()) return '버튼 문구를 입력해 주세요.';
  if (!safeCtaUrl(fields.ctaUrl)) return '버튼 주소는 /로 시작하는 내부 경로 또는 https:// 주소여야 합니다.';
  if (fields.imageUrl?.trim() && !safeImageUrl(fields.imageUrl)) return '이미지 주소는 /로 시작하는 내부 경로 또는 https:// 주소여야 합니다.';
  return null;
}

function Editor({ initial, saving, error, onClose, onSave }: { initial: LandingPage | null; saving: boolean; error: string; onClose: () => void; onSave: (fields: Fields) => void }) {
  const [form, setForm] = useState<Fields>(initial ? {
    slug: initial.slug, title: initial.title, category: initial.category, eyebrow: initial.eyebrow,
    headline: initial.headline, description: initial.description, benefits: initial.benefits,
    ctaLabel: initial.ctaLabel, ctaUrl: initial.ctaUrl, imageUrl: initial.imageUrl, isPublished: initial.isPublished,
  } : blank);
  const [validation, setValidation] = useState('');
  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => setForm(prev => ({ ...prev, [key]: value }));
  const input = 'w-full rounded-lg border border-[#d6dfeb] bg-white px-3.5 py-2.5 text-sm text-[#1a2c45] outline-none focus:border-[#35639f] focus:ring-2 focus:ring-[#35639f]/10';
  const label = 'block text-xs font-bold text-[#43536c] mb-1.5';
  const previewPage: LandingPage = { ...form, id: initial?.id ?? 0, createdAt: initial?.createdAt ?? '', updatedAt: initial?.updatedAt ?? '' };
  const [preview, setPreview] = useState(false);
  return <div role="dialog" aria-modal="true" aria-label={preview ? '랜딩페이지 미리보기' : '랜딩페이지 편집'} className="fixed inset-0 z-[100] bg-[#0d1b30]/70 p-3 md:p-7 flex items-center justify-center" onMouseDown={e => { if (e.target === e.currentTarget && !saving) onClose(); }}>
    <div className={`bg-[#f8fafc] rounded-xl shadow-2xl w-full ${preview ? 'max-w-6xl' : 'max-w-3xl'} max-h-[94dvh] flex flex-col overflow-hidden`}>
      <div className="shrink-0 px-5 md:px-7 py-4 border-b border-[#dbe3ec] flex items-center justify-between bg-white">
        <div><div className="text-[11px] tracking-widest font-black text-[#dc704d]">LANDING PAGE STUDIO</div><h2 className="font-black text-xl text-[#172a4b] mt-1">{preview ? '작성 중인 화면 미리보기' : initial ? '랜딩페이지 수정' : '새 랜딩페이지'}</h2></div>
        <div className="flex gap-2"><button data-testid="button-editor-preview" type="button" onClick={() => setPreview(v => !v)} className="px-3 py-2 rounded-lg border border-[#cfdae8] text-[#27466c] text-xs font-bold hover:bg-[#eff4f9]">{preview ? '편집으로 돌아가기' : '미리보기'}</button><button data-testid="button-editor-close" type="button" onClick={onClose} disabled={saving} aria-label="닫기" className="p-2 text-[#62728a] hover:bg-[#edf2f8] rounded-lg"><X size={20} /></button></div>
      </div>
      {preview ? <div className="overflow-y-auto"><LandingContent page={previewPage} preview /></div> :
      <form id="landing-editor-form" onSubmit={e => { e.preventDefault(); const message = validate(form); setValidation(message || ''); if (!message) onSave({ ...form, slug: form.slug.trim(), title: form.title.trim(), headline: form.headline.trim(), ctaUrl: form.ctaUrl.trim(), imageUrl: form.imageUrl?.trim() || null }); }} className="overflow-y-auto p-5 md:p-7 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div><label htmlFor="landing-title" className={label}>관리용 제목 <span className="text-[#cf5f44]">*</span></label><input data-testid="input-landing-title" id="landing-title" className={input} value={form.title} onChange={e => update('title', e.target.value)} placeholder="예: 당근마켓 설치 당일 혜택" required /></div>
          <div><label htmlFor="landing-category" className={label}>유입 채널</label><select data-testid="select-landing-category" id="landing-category" className={input} value={form.category} onChange={e => update('category', e.target.value as Category)}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
          <div className="md:col-span-2"><label htmlFor="landing-slug" className={label}>공개 주소 <span className="text-[#cf5f44]">*</span></label><div className="flex items-center rounded-lg border border-[#d6dfeb] bg-white overflow-hidden"><span className="text-xs text-[#75839a] px-3 border-r border-[#d6dfeb] whitespace-nowrap">/landing/</span><input data-testid="input-landing-slug" id="landing-slug" className="w-full px-3.5 py-2.5 text-sm outline-none" value={form.slug} onChange={e => update('slug', e.target.value.toLowerCase())} placeholder="campaign-name" required /></div><p className="text-[11px] text-[#8190a4] mt-1.5">영문 소문자·숫자·하이픈 사용. 발행 전에는 이 주소로 접속할 수 없습니다.</p></div>
        </div>
        <div className="border-t border-[#dce4ed] pt-6 space-y-4"><p className="text-xs font-black tracking-widest text-[#214875]">화면 내용</p>
          <div><label htmlFor="landing-eyebrow" className={label}>상단 작은 문구</label><input data-testid="input-landing-eyebrow" id="landing-eyebrow" className={input} value={form.eyebrow} onChange={e => update('eyebrow', e.target.value)} placeholder="이달의 인터넷 가입 혜택" /></div>
          <div><label htmlFor="landing-headline" className={label}>메인 문구 <span className="text-[#cf5f44]">*</span></label><textarea data-testid="input-landing-headline" id="landing-headline" className={input} rows={2} value={form.headline} onChange={e => update('headline', e.target.value)} placeholder="우리 집 인터넷, 더 좋은 조건으로" required /></div>
          <div><label htmlFor="landing-description" className={label}>소개 문구</label><textarea data-testid="input-landing-description" id="landing-description" className={input} rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="고객에게 전할 내용을 입력하세요." /></div>
          <div><label htmlFor="landing-benefits" className={label}>혜택 항목</label><textarea data-testid="input-landing-benefits" id="landing-benefits" className={input} rows={4} value={form.benefits} onChange={e => update('benefits', e.target.value)} placeholder={'혜택 한 줄씩 입력\n가입 전 요금 비교\n설치 일정 안내'} /><p className="text-[11px] text-[#8190a4] mt-1.5">줄바꿈으로 항목을 구분합니다.</p></div>
          <div><label htmlFor="landing-image" className={label}>대표 이미지 URL (선택)</label><input data-testid="input-landing-image" id="landing-image" type="text" className={input} value={form.imageUrl || ''} onChange={e => update('imageUrl', e.target.value)} placeholder="https:// 또는 /images/..." /></div>
        </div>
        <div className="border-t border-[#dce4ed] pt-6 grid md:grid-cols-2 gap-4"><div className="md:col-span-2 text-xs font-black tracking-widest text-[#214875]">행동 버튼</div><div><label htmlFor="landing-cta-label" className={label}>버튼 문구 <span className="text-[#cf5f44]">*</span></label><input data-testid="input-landing-cta-label" id="landing-cta-label" className={input} value={form.ctaLabel} onChange={e => update('ctaLabel', e.target.value)} required /></div><div><label htmlFor="landing-cta-url" className={label}>이동 주소 <span className="text-[#cf5f44]">*</span></label><input data-testid="input-landing-cta-url" id="landing-cta-url" className={input} value={form.ctaUrl} onChange={e => update('ctaUrl', e.target.value)} placeholder="/apply 또는 https://..." required /></div></div>
        <label className="flex gap-3 items-center border border-[#d6dfeb] bg-white p-4 rounded-lg cursor-pointer"><input data-testid="checkbox-landing-published" type="checkbox" checked={form.isPublished} onChange={e => update('isPublished', e.target.checked)} className="accent-[#284f82] w-4 h-4" /><span><strong className="block text-sm text-[#172a4b]">바로 공개하기</strong><small className="text-[#75839a]">끄면 초안으로 저장됩니다. 관리자 미리보기에서만 확인할 수 있습니다.</small></span></label>
        {(validation || error) && <p data-testid="error-landing-editor" role="alert" className="text-sm font-bold text-[#b43f35] bg-[#fff0ed] p-3 rounded-lg">{validation || error}</p>}
      </form>}
      {!preview && <div className="shrink-0 bg-white border-t border-[#dbe3ec] px-5 md:px-7 py-4 flex justify-end gap-2"><button data-testid="button-editor-cancel" type="button" onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-bold border border-[#d6dfeb]">취소</button><button data-testid="button-editor-save" type="submit" form="landing-editor-form" disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#193b68] text-white disabled:opacity-50">{saving ? '저장 중...' : initial ? '변경사항 저장' : '랜딩페이지 만들기'}</button></div>}
    </div>
  </div>;
}

export default function LandingManager({ token }: { token: string }) {
  const [items, setItems] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState<number | 'save' | null>(null);
  const [editor, setEditor] = useState<LandingPage | null | 'new'>(null);
  const [preview, setPreview] = useState<LandingPage | null>(null);
  const [category, setCategory] = useState<Category | '전체'>('전체');
  const [status, setStatus] = useState<'전체' | '공개' | '초안'>('전체');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const result = await adminRequest<LandingPage[]>('/api/admin/landing-pages', token); setItems(Array.isArray(result) ? result : []); }
    catch (e) { setError(e instanceof Error ? e.message : '목록을 불러오지 못했습니다.'); }
    finally { setLoading(false); }
  }, [token]);
  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => items.filter(item =>
    (category === '전체' || item.category === category) &&
    (status === '전체' || (status === '공개' ? item.isPublished : !item.isPublished)) &&
    (!query.trim() || `${item.title} ${item.slug} ${item.headline}`.toLowerCase().includes(query.trim().toLowerCase()))
  ), [items, category, status, query]);
  const fail = (e: unknown) => setError(e instanceof Error ? e.message : '요청을 처리하지 못했습니다.');
  const save = async (fields: Fields) => {
    setBusy('save'); setError('');
    try {
      const existing = editor !== 'new' ? editor : null;
      const result = await adminRequest<LandingPage>(existing ? `/api/admin/landing-pages/${existing.id}` : '/api/admin/landing-pages', token, { method: existing ? 'PATCH' : 'POST', body: JSON.stringify(fields) });
      if (result?.id) setItems(prev => existing ? prev.map(p => p.id === existing.id ? result : p) : [result, ...prev]);
      else await load();
      setEditor(null); setNotice(existing ? '변경사항을 저장했습니다.' : '랜딩페이지를 만들었습니다.');
    } catch (e) { setError(e instanceof Error ? e.message : '저장에 실패했습니다.'); }
    finally { setBusy(null); }
  };
  const changePublished = async (item: LandingPage) => {
    setBusy(item.id); setError(''); setNotice('');
    try {
      const result = await adminRequest<LandingPage>(`/api/admin/landing-pages/${item.id}`, token, { method: 'PATCH', body: JSON.stringify({ isPublished: !item.isPublished }) });
      setItems(prev => prev.map(p => p.id === item.id ? { ...p, ...(result || {}), isPublished: !item.isPublished } : p));
      setNotice(item.isPublished ? '페이지를 비공개로 전환했습니다.' : '페이지가 공개되었습니다.');
    } catch (e) { fail(e); } finally { setBusy(null); }
  };
  const duplicate = async (item: LandingPage) => {
    setBusy(item.id); setError(''); setNotice('');
    try {
      const result = await adminRequest<LandingPage>(`/api/admin/landing-pages/${item.id}/duplicate`, token, { method: 'POST' });
      setItems(prev => [result, ...prev]); setNotice('복제한 초안을 만들었습니다. 주소와 내용을 확인해 주세요.');
      setEditor(result);
    } catch (e) { fail(e); } finally { setBusy(null); }
  };
  const remove = async (item: LandingPage) => {
    if (!window.confirm(`"${item.title}" 페이지를 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) return;
    setBusy(item.id); setError(''); setNotice('');
    try {
      await adminRequest<void>(`/api/admin/landing-pages/${item.id}`, token, { method: 'DELETE' });
      setItems(prev => prev.filter(p => p.id !== item.id)); setNotice('랜딩페이지를 삭제했습니다.');
    } catch (e) { fail(e); } finally { setBusy(null); }
  };
  const copy = async (item: LandingPage) => {
    if (!item.isPublished) return;
    try { await navigator.clipboard.writeText(`${window.location.origin}/landing/${encodeURIComponent(item.slug)}`); setNotice('공개 링크를 복사했습니다.'); setError(''); }
    catch { setError('링크를 복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요.'); }
  };
  const action = 'inline-flex items-center justify-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-md border border-[#d9e1eb] bg-white text-[#42546d] hover:bg-[#edf3fa] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  return <section data-testid="section-landing-management" className="pb-16">
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-6">
      <div><p className="text-[11px] font-black tracking-[.18em] text-[#d56e50] mb-2">CAMPAIGN PAGES</p><h2 className="text-xl md:text-2xl font-black text-[#172a4b]">랜딩페이지 통합 관리</h2><p className="text-sm text-[#728099] mt-1">광고 채널별 페이지를 만들고, 미리 보고, 공개 상태를 관리합니다.</p></div>
      <button data-testid="button-landing-create" onClick={() => { setError(''); setEditor('new'); }} className="inline-flex items-center justify-center gap-2 bg-[#234c83] hover:bg-[#173b70] text-white text-sm font-bold px-5 py-3 rounded-lg shadow-sm"><Plus size={17} /> 새 랜딩페이지 만들기</button>
    </div>
    <div className="bg-white border border-[#dfe6ef] rounded-xl p-4 mb-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
      <div className="flex flex-wrap gap-2">{(['전체', ...categories] as const).map(c => <button key={c} data-testid={`button-landing-filter-${c}`} onClick={() => setCategory(c)} className={`text-xs font-bold px-3.5 py-2 rounded-full border transition-colors ${category === c ? 'bg-[#182f50] text-white border-[#182f50]' : 'text-[#53627a] border-[#d9e1eb] hover:bg-[#f3f6fa]'}`}>{c} <span className="opacity-70 ml-1">{c === '전체' ? items.length : items.filter(p => p.category === c).length}</span></button>)}</div>
      <div className="flex items-center gap-2"><select data-testid="select-landing-status" aria-label="공개 상태 필터" className="border border-[#d9e1eb] rounded-lg px-3 py-2 text-xs text-[#42546d] bg-white" value={status} onChange={e => setStatus(e.target.value as typeof status)}><option>전체</option><option>공개</option><option>초안</option></select><div className="relative flex-1 md:w-52"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8290a4]" /><input data-testid="input-landing-search" aria-label="랜딩페이지 검색" placeholder="제목, 주소 검색" value={query} onChange={e => setQuery(e.target.value)} className="w-full border border-[#d9e1eb] rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-[#35639f]" /></div></div>
    </div>
    {error && <div data-testid="error-landing-management" role="alert" className="flex items-center justify-between gap-3 bg-[#fff0ed] text-[#a63e34] border border-[#f2c8c0] rounded-lg px-4 py-3 mb-4 text-sm font-bold"><span>{error}</span><button data-testid="button-landing-dismiss-error" onClick={() => setError('')} aria-label="오류 닫기"><X size={16} /></button></div>}
    {notice && <div data-testid="status-landing-notice" role="status" className="flex items-center justify-between gap-3 bg-[#e9f4ed] text-[#23654b] border border-[#c6e5d2] rounded-lg px-4 py-3 mb-4 text-sm font-bold"><span>{notice}</span><button data-testid="button-landing-dismiss-notice" onClick={() => setNotice('')} aria-label="알림 닫기"><X size={16} /></button></div>}
    {loading ? <div data-testid="status-landing-loading" className="space-y-3 animate-pulse">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-[#e4eaf2] rounded-xl" />)}</div> :
      !items.length ? <div className="border border-dashed border-[#bacbde] bg-[#f5f8fc] rounded-xl text-center px-5 py-16"><FilePlus2 size={32} className="mx-auto text-[#456b99] mb-4" /><h3 className="font-black text-lg text-[#172a4b]">첫 랜딩페이지를 만들어 보세요</h3><p className="text-[#6e7d93] text-sm mt-2">캠페인에 맞는 메시지를 작성하고 미리보기로 확인할 수 있습니다.</p><button data-testid="button-landing-create-empty" onClick={() => setEditor('new')} className="mt-6 bg-[#234c83] text-white rounded-lg px-5 py-2.5 text-sm font-bold">페이지 만들기</button></div> :
      !filtered.length ? <div className="border border-[#dfe6ef] bg-white rounded-xl text-center py-14 px-5"><Search size={28} className="mx-auto text-[#8aa0bb] mb-3" /><h3 className="font-bold text-[#172a4b]">조건에 맞는 페이지가 없습니다</h3><p className="text-sm text-[#728099] mt-2">다른 검색어나 필터로 다시 찾아보세요.</p><button data-testid="button-landing-reset-filters" onClick={() => { setQuery(''); setCategory('전체'); setStatus('전체'); }} className="mt-5 text-sm font-bold text-[#27558d] underline">필터 초기화</button></div> :
      <div className="space-y-2.5">{filtered.map(item => <article data-testid={`card-landing-${item.id}`} key={item.id} className="bg-white border border-[#dfe6ef] rounded-xl px-4 md:px-5 py-4 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:border-[#adbfda] transition-colors">
        <div className="min-w-0"><div className="flex flex-wrap gap-2 items-center"><span className={`text-[11px] font-bold rounded px-2 py-1 ${item.category === '당근마켓' ? 'bg-[#fff0e7] text-[#bc6632]' : item.category === '구글광고' ? 'bg-[#eaf1fc] text-[#305d9c]' : 'bg-[#f1f2f5] text-[#586578]'}`}>{item.category}</span><span className={`text-[11px] font-bold rounded px-2 py-1 ${item.isPublished ? 'bg-[#e8f6ed] text-[#24764d]' : 'bg-[#f1f2f5] text-[#69788c]'}`}>{item.isPublished ? '공개' : '초안'}</span><h3 data-testid={`text-landing-title-${item.id}`} className="font-black text-[#172a4b] break-keep">{item.title}</h3><span className="text-[11px] text-[#9ba7b7]">#{item.id}</span></div><p className="text-xs text-[#6882a4] mt-2 truncate">/landing/{item.slug}</p></div>
        <div className="flex flex-wrap gap-1.5 lg:justify-end shrink-0">
          <button data-testid={`button-landing-copy-${item.id}`} title={item.isPublished ? '공개 링크 복사' : '초안은 링크를 복사할 수 없습니다'} disabled={!item.isPublished || busy !== null} onClick={() => void copy(item)} className={action}><Copy size={13} /> 링크 복사</button>
          <button data-testid={`button-landing-preview-${item.id}`} onClick={() => setPreview(item)} className={action}><Eye size={13} /> 미리보기</button>
          <button data-testid={`button-landing-edit-${item.id}`} disabled={busy !== null} onClick={() => { setError(''); setEditor(item); }} className={action}><Pencil size={13} /> 수정</button>
          <button data-testid={`button-landing-duplicate-${item.id}`} disabled={busy !== null} onClick={() => void duplicate(item)} className={action}><Copy size={13} /> 복제</button>
          <button data-testid={`button-landing-publish-${item.id}`} disabled={busy !== null} onClick={() => void changePublished(item)} className={action}>{busy === item.id ? '처리 중...' : item.isPublished ? '비공개' : '공개'}</button>
          <button data-testid={`button-landing-delete-${item.id}`} disabled={busy !== null} onClick={() => void remove(item)} className={`${action} !text-[#b7443d] !border-[#f0d7d1]`}><Trash2 size={13} /> 삭제</button>
          {item.isPublished && <a data-testid={`link-landing-open-${item.id}`} href={`/landing/${encodeURIComponent(item.slug)}`} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} 공개 페이지 열기`} className={action}><ExternalLink size={13} /></a>}
        </div>
      </article>)}</div>}
    {editor !== null && <Editor key={editor === 'new' ? 'new' : editor.id} initial={editor === 'new' ? null : editor} saving={busy === 'save'} error={error} onClose={() => { setEditor(null); setError(''); }} onSave={fields => void save(fields)} />}
    {preview && <div role="dialog" aria-modal="true" aria-label="랜딩페이지 미리보기" className="fixed inset-0 z-[100] bg-[#0d1b30]/70 p-3 md:p-6 flex items-center justify-center" onMouseDown={e => { if (e.target === e.currentTarget) setPreview(null); }}><div className="bg-white w-full max-w-6xl max-h-[95dvh] flex flex-col rounded-xl overflow-hidden shadow-2xl"><div className="flex items-center justify-between p-4 bg-white border-b border-[#dce4ed]"><div><b className="text-[#172a4b]">{preview.title}</b><span className="text-xs text-[#7c8ba0] ml-3">{preview.isPublished ? '공개 페이지 미리보기' : '비공개 초안 미리보기'}</span></div><button data-testid="button-landing-preview-close" onClick={() => setPreview(null)} aria-label="미리보기 닫기" className="p-2 hover:bg-[#eef3f8] rounded"><X size={20} /></button></div><div className="overflow-y-auto"><LandingContent page={preview} preview /></div></div></div>}
  </section>;
}