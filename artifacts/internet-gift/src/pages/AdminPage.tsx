import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type Status = '처리중' | '접수완료' | '개통완료' | '취소';
const STATUSES: Status[] = ['처리중', '접수완료', '개통완료', '취소'];

type HistoryEntry = { date: string; note: string };

type ConsultationRequest = {
  id: number;
  name: string;
  phone: string;
  status: Status;
  createdAt: string;
};

type Application = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  currentProvider: string | null;
  applyProvider: string | null;
  internet: string | null;
  tv: string | null;
  customerType: string | null;
  paymentMethod: string | null;
  payBank: string | null;
  payAccount: string | null;
  payAccountHolder: string | null;
  cardCompany: string | null;
  cardNumber: string | null;
  cardExpiry: string | null;
  giftBank: string | null;
  giftAccount: string | null;
  giftAccountHolder: string | null;
  address: string | null;
  memo: string | null;
  adminMemo: string | null;
  consultationHistory: string | null;
  consentedAt: string | null;
  phoneCarrier: string | null;
  status: Status;
  createdAt: string;
};

type AdminResource = { id: number; title: string; category: string; description: string; fileUrl: string; previewUrl: string; isPublished: boolean; createdAt: string; updatedAt: string };
type ManagedReview = { id: number; title: string; author: string; content: string; thumbnail: string; views: number; isBest: boolean; isPublished: boolean; createdAt: string; updatedAt: string };
type ManagedTip = { id: number; title: string; slug: string; category: string; content: string; thumbnail: string; views: number; isFeatured: boolean; isPublished: boolean; createdAt: string; updatedAt: string };

type AdminRole = 'owner' | 'full' | 'limited';

type AdminAccount = {
  id: number;
  username: string;
  displayName: string;
  role: AdminRole;
  permissions: string[];
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
};

const PERMISSION_OPTIONS = [
  { value: 'consultations', label: '문의 관리' },
  { value: 'applications', label: '신청서 관리' },
  { value: 'content', label: '콘텐츠 관리' },
] as const;

function permissionLabel(permission: string) {
  return PERMISSION_OPTIONS.find(option => option.value === permission)?.label ?? permission;
}

const ALL_ADMIN_TABS = [
  { id: 'consultations', label: '견적 문의', permission: 'consultations' },
  { id: 'applications', label: '신청서', permission: 'applications' },
  { id: 'resources', label: '관리자 자료', permission: 'content' },
  { id: 'reviews', label: '후기 관리', permission: 'content' },
  { id: 'tips', label: '꿀팁 관리', permission: 'content' },
  { id: 'accounts', label: '관리자 관리', roles: ['owner', 'full'] },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' });
}

const STATUS_STYLES: Record<Status, string> = {
  '처리중':  'bg-white text-gray-700 border-gray-300',
  '접수완료': 'bg-blue-50 text-blue-700 border-blue-200',
  '개통완료': 'bg-green-50 text-green-700 border-green-200',
  '취소':    'bg-red-50 text-red-600 border-red-200',
};

function StatusSelect({ value, onChange, loading }: { value: Status; onChange: (s: Status) => void; loading: boolean }) {
  return (
    <select
      value={value}
      disabled={loading}
      onChange={e => onChange(e.target.value as Status)}
      className={`text-xs font-semibold px-2 py-1.5 rounded-sm border cursor-pointer transition-colors disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-blue-500 ${STATUS_STYLES[value]}`}
    >
      {STATUSES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

const TOKEN_KEY = 'adminToken';

function getStoredToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
function setStoredToken(token: string) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}
function clearStoredToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
}

function AdminLoginForm({ onLogin }: { onLogin: (token: string, admin: AdminAccount) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(username.trim() ? { username: username.trim(), password } : { password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '로그인에 실패했습니다.'); return; }
      onLogin(data.token, data.admin);
    } catch {
      setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900">어드민 로그인</h1>
            <p className="text-gray-500 text-sm mt-2">대표 관리자는 아이디를 비워두고 로그인할 수 있습니다.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">관리자 아이디 <span className="text-gray-400 font-normal text-xs">(선택)</span></label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="아이디 입력 (대표 관리자는 비워두세요)"
                className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-2.5 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm text-center font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-sm bg-[#1e293b] text-white font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-60 shadow-sm"
            >
              {loading ? '확인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

type Toast = { id: number; message: string; kind: 'consultation' | 'application' };

type FilterState = {
  period: 'today' | '7d' | '30d' | 'all';
  startDate: string;
  endDate: string;
  status: string;
  checked: string;
  searchField: string;
  searchQuery: string;
};

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [admin, setAdmin] = useState<AdminAccount | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(!!getStoredToken());
  const [tab, setTab] = useState<string>('');

  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [reviews, setReviews] = useState<ManagedReview[]>([]);
  const [tips, setTips] = useState<ManagedTip[]>([]);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const knownCIds = useRef<Set<number>>(new Set());
  const knownAIds = useRef<Set<number>>(new Set());
  const isFirst = useRef(true);

  // Filters
  const [filter, setFilter] = useState<FilterState>({
    period: 'all',
    startDate: '',
    endDate: '',
    status: '전체',
    checked: '전체',
    searchField: '전체',
    searchQuery: '',
  });
  const [searchDraft, setSearchDraft] = useState('');

  // Modals
  const [activeModal, setActiveModal] = useState<{ type: 'resources'|'reviews'|'tips'|'accounts', item: any } | null>(null);

  const pushToast = useCallback((message: string, kind: Toast['kind']) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 7000);
  }, []);

  const handleLogin = (newToken: string, adminData: AdminAccount) => {
    setStoredToken(newToken);
    setToken(newToken);
    setAdmin(adminData);
  };

  const handleLogout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setAdmin(null);
    setIsCheckingAuth(false);
    setConsultations([]);
    setApplications([]);
    setResources([]);
    setReviews([]);
    setTips([]);
    setAccounts([]);
  }, []);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const hasPerm = (p: string) => admin?.role === 'owner' || admin?.role === 'full' || admin?.permissions?.includes(p);
      const hasRoleFull = () => admin?.role === 'owner' || admin?.role === 'full';

      const pC = hasPerm('문의 관리') ? fetch('/api/consultations', { headers }).catch(() => null) : Promise.resolve(null);
      const pA = hasPerm('신청서 관리') ? fetch('/api/applications', { headers }).catch(() => null) : Promise.resolve(null);
      const pRes = hasPerm('콘텐츠 관리') ? fetch('/api/admin/resources', { headers }).catch(() => null) : Promise.resolve(null);
      const pRev = hasPerm('콘텐츠 관리') ? fetch('/api/admin/reviews', { headers }).catch(() => null) : Promise.resolve(null);
      const pTip = hasPerm('콘텐츠 관리') ? fetch('/api/admin/tips', { headers }).catch(() => null) : Promise.resolve(null);
      const pAcc = hasRoleFull() ? fetch('/api/admin/accounts', { headers }).catch(() => null) : Promise.resolve(null);

      const [cRes, aRes, resRes, revRes, tipRes, accRes] = await Promise.all([pC, pA, pRes, pRev, pTip, pAcc]);

      if ([cRes, aRes, resRes, revRes, tipRes, accRes].some(r => r?.status === 401)) {
        handleLogout();
        return;
      }

      if (cRes?.ok) {
        const cData: ConsultationRequest[] = await cRes.json();
        setConsultations(cData);
        if (!isFirst.current) {
          for (const c of cData.filter(c => !knownCIds.current.has(c.id))) {
            const msg = `새 빠른견적 문의: ${c.name} (${c.phone})`;
            pushToast(msg, 'consultation');
            if (Notification.permission === 'granted') {
              new Notification('AI인터넷 — 새 빠른견적 문의', { body: `${c.name}님 (${c.phone})이 빠른견적을 문의했습니다.` });
            }
          }
        }
        knownCIds.current = new Set(cData.map(c => c.id));
      }

      if (aRes?.ok) {
        const aData: Application[] = await aRes.json();
        setApplications(aData);
        if (!isFirst.current) {
          for (const a of aData.filter(a => !knownAIds.current.has(a.id))) {
            const msg = `새 신청서: ${a.name ?? '이름없음'} (${a.phone ?? '-'})`;
            pushToast(msg, 'application');
            if (Notification.permission === 'granted') {
              new Notification('AI인터넷 — 새 신청서 접수', { body: `${a.name ?? '고객'}님이 신청서를 제출했습니다.` });
            }
          }
        }
        knownAIds.current = new Set(aData.map(a => a.id));
      }

      if (resRes?.ok) setResources(await resRes.json());
      if (revRes?.ok) setReviews(await revRes.json());
      if (tipRes?.ok) setTips(await tipRes.json());
      if (accRes?.ok) setAccounts(await accRes.json());

      isFirst.current = false;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, handleLogout, pushToast, admin]);

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setIsCheckingAuth(false);
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/admin/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) { handleLogout(); return; }
        const adminData = await res.json();
        setAdmin(adminData);
      } catch {
        handleLogout();
      } finally {
        setIsCheckingAuth(false);
      }
    };
    fetchMe();
  }, [token, handleLogout]);

  useEffect(() => {
    if (!admin) return;
    const tabs = ALL_ADMIN_TABS.filter(t => {
      if (admin.role === 'owner' || admin.role === 'full') return true;
      if (t.roles) return false;
      return admin.permissions?.includes(t.permission as string);
    });
    if (tabs.length > 0 && !tabs.find(t => t.id === tab)) {
      setTab(tabs[0].id);
    }
  }, [admin, tab]);

  useEffect(() => {
    if (!token || isCheckingAuth || !admin) return;
    isFirst.current = true;
    load(false);
    const interval = setInterval(() => load(true), 30_000);
    return () => clearInterval(interval);
  }, [token, isCheckingAuth, admin, load]);

  const updateConsultationStatus = async (id: number, status: Status) => {
    if (!token) return;
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, _updating: true } as any : c));
    try {
      const res = await fetch(`/api/consultations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setConsultations(prev => prev.map(c => c.id === id ? updated : c));
      }
    } catch {}
  };

  const updateApplicationStatus = async (id: number, status: Status) => {
    if (!token) return;
    setApplications(prev => prev.map(a => a.id === id ? { ...a, _updating: true } as any : a));
    try {
      const res = await fetch(`/api/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch {}
  };

  const updateApplicationMemo = async (id: number, adminMemo: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/applications/${id}/memo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminMemo }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch {}
  };

  const addConsultationHistory = async (id: number, note: string) => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/applications/${id}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ note }),
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.id === id ? updated : a));
        return true;
      }
    } catch {}
    return false;
  };

  const deleteConsultationHistory = async (id: number, index: number) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/applications/${id}/history/${index}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updated = await res.json();
        setApplications(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch {}
  };

  const sendKakaoNotify = async (id: number, variables: Record<string, string>): Promise<{ success: boolean; mock?: boolean; error?: string }> => {
    if (!token) return { success: false, error: '인증 오류' };
    try {
      const res = await fetch(`/api/applications/${id}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ variables }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error ?? '발송 실패' };
      return { success: true, mock: data.mock };
    } catch {
      return { success: false, error: '네트워크 오류' };
    }
  };

  const handleCrud = async (type: 'resources'|'reviews'|'tips'|'accounts', action: 'save'|'delete', data?: any) => {
    if (!token) return false;
    const isEdit = action === 'save' && data && data.id !== undefined && data.id !== null;
    const url = `/api/admin/${type}${action === 'delete' ? `/${data}` : isEdit ? `/${data.id}` : ''}`;
    const method = action === 'delete' ? 'DELETE' : (isEdit ? 'PATCH' : 'POST');
    const body = action === 'delete' ? undefined : JSON.stringify(data);

    let errorMessage = '작업에 실패했습니다.';
    try {
      const res = await fetch(url, {
        method,
        headers: { ...(body ? {'Content-Type': 'application/json'} : {}), Authorization: `Bearer ${token}` },
        body
      });
      if (res.ok) {
        load(true);
        setActiveModal(null);
        return true;
      }
      const result = await res.json().catch(() => null);
      if (result?.error) errorMessage = result.error;
    } catch {}
    alert(errorMessage);
    return false;
  };

  const setPeriod = (period: FilterState['period']) => {
    const today = new Date();
    let start = '';
    let end = '';
    if (period === 'today') {
      start = today.toISOString().split('T')[0];
      end = start;
    } else if (period === '7d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      start = d.toISOString().split('T')[0];
      end = today.toISOString().split('T')[0];
    } else if (period === '30d') {
      const d = new Date(today);
      d.setDate(d.getDate() - 30);
      start = d.toISOString().split('T')[0];
      end = today.toISOString().split('T')[0];
    }
    setFilter(f => ({ ...f, period, startDate: start, endDate: end }));
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-gray-500 font-semibold text-sm">로딩 중...</div>
      </div>
    );
  }

  if (!token || !admin) return <AdminLoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-md shadow-lg text-white text-sm font-semibold max-w-xs animate-bounce-in ${
              t.kind === 'application' ? 'bg-blue-600' : 'bg-gray-800'
            }`}
          >
            <div>
              <p className="font-bold text-xs mb-1">{t.kind === 'application' ? '새 신청서 접수' : '새 빠른견적 문의'}</p>
              <p className="opacity-90 text-xs font-normal leading-relaxed">{t.message}</p>
            </div>
          </div>
        ))}
      </div>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              통합 관리자
              {admin.role === 'limited' ? (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-sm font-bold">제한 권한</span>
              ) : admin.role === 'owner' ? (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-sm font-bold">대표 권한</span>
              ) : (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-sm font-bold">전체 권한</span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{admin.displayName} 님, 환영합니다.</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-sm border border-gray-300 hover:bg-gray-100 bg-white"
          >
            로그아웃
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 flex flex-col p-5 shadow-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-4 items-end">
            <div className="space-y-2">
              <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden h-9">
                {[
                  { id: 'today', label: '오늘' },
                  { id: '7d', label: '지난 7일' },
                  { id: '30d', label: '지난 30일' },
                  { id: 'all', label: '전체' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id as any)}
                    className={`px-4 py-1.5 text-xs font-bold border-r border-gray-200 last:border-0 transition-colors ${filter.period === p.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] text-gray-500 font-bold px-1">시작일</label>
                <input
                  type="date"
                  value={filter.startDate}
                  onChange={e => setFilter(f => ({ ...f, startDate: e.target.value, period: 'all' }))}
                  className="border border-gray-200 rounded-sm px-3 h-9 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <span className="text-gray-300 mb-1">-</span>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[11px] text-gray-500 font-bold px-1">종료일</label>
                <input
                  type="date"
                  value={filter.endDate}
                  onChange={e => setFilter(f => ({ ...f, endDate: e.target.value, period: 'all' }))}
                  className="border border-gray-200 rounded-sm px-3 h-9 text-sm w-36 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-[11px] text-gray-500 font-bold px-1">진행상태</label>
              <select
                value={filter.status}
                onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                className="border border-gray-200 rounded-sm px-3 h-9 text-sm w-28 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 font-medium"
              >
                <option value="전체">전체</option>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-[11px] text-gray-500 font-bold px-1">확인여부</label>
              <select
                value={filter.checked}
                onChange={e => setFilter(f => ({ ...f, checked: e.target.value }))}
                className="border border-gray-200 rounded-sm px-3 h-9 text-sm w-28 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 font-medium"
              >
                <option value="전체">전체</option>
                <option value="확인">확인</option>
                <option value="미확인">미확인</option>
              </select>
            </div>

            <div className="space-y-1.5 flex flex-col flex-1 min-w-[320px]">
              <label className="text-[11px] text-gray-500 font-bold px-1 flex justify-between">
                <span>검색 항목</span>
                <span>검색어</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={filter.searchField}
                  onChange={e => setFilter(f => ({ ...f, searchField: e.target.value }))}
                  className="border border-gray-200 rounded-sm px-3 h-9 text-sm w-28 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 shrink-0 font-medium"
                >
                  <option value="전체">전체</option>
                  <option value="이름">이름</option>
                  <option value="연락처">연락처</option>
                  <option value="제목">제목</option>
                </select>
                <input
                  type="text"
                  placeholder="검색어 입력"
                  value={searchDraft}
                  onChange={e => setSearchDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && setFilter(f => ({ ...f, searchQuery: searchDraft }))}
                  className="border border-gray-200 rounded-sm px-3 h-9 text-sm flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => setFilter(f => ({ ...f, searchQuery: searchDraft }))}
                  className="bg-blue-600 text-white px-5 h-9 rounded-sm text-xs font-bold hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
                >
                  검색
                </button>
                <button
                  onClick={() => {
                    setFilter({ period: 'all', startDate: '', endDate: '', status: '전체', checked: '전체', searchField: '전체', searchQuery: '' });
                    setSearchDraft('');
                  }}
                  className="border border-gray-200 bg-white text-gray-600 px-4 h-9 rounded-sm text-xs font-bold hover:bg-gray-50 transition-colors shrink-0"
                >
                  전체 초기화
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
          {ALL_ADMIN_TABS.filter(t => {
            if (admin.role === 'owner' || admin.role === 'full') return true;
            if (t.roles) return false;
            return admin.permissions?.includes(t.permission as string);
          }).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {t.label} {t.id === 'consultations' ? `(${consultations.length})` : t.id === 'applications' ? `(${applications.length})` : ''}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-semibold text-sm">불러오는 중...</div>
        ) : (
          <>
            {tab === 'consultations' && (
              <ConsultationsTable data={consultations} filter={filter} onStatusChange={updateConsultationStatus} />
            )}
            {tab === 'applications' && (
              <ApplicationsTable
                data={applications}
                filter={filter}
                token={token}
                onStatusChange={updateApplicationStatus}
                onMemoSave={updateApplicationMemo}
                onHistoryAdd={addConsultationHistory}
                onHistoryDelete={deleteConsultationHistory}
                onNotify={sendKakaoNotify}
              />
            )}
            {tab === 'resources' && (
              <ResourcesTable
                data={resources}
                filter={filter}
                onEdit={item => setActiveModal({ type: 'resources', item })}
                onDelete={id => handleCrud('resources', 'delete', id)}
                onCreate={() => setActiveModal({ type: 'resources', item: null })}
              />
            )}
            {tab === 'reviews' && (
              <ReviewsTable
                data={reviews}
                filter={filter}
                onEdit={item => setActiveModal({ type: 'reviews', item })}
                onDelete={id => handleCrud('reviews', 'delete', id)}
                onCreate={() => setActiveModal({ type: 'reviews', item: null })}
              />
            )}
            {tab === 'tips' && (
              <TipsTable
                data={tips}
                filter={filter}
                onEdit={item => setActiveModal({ type: 'tips', item })}
                onDelete={id => handleCrud('tips', 'delete', id)}
                onCreate={() => setActiveModal({ type: 'tips', item: null })}
              />
            )}
            {tab === 'accounts' && (
              <AccountsTable
                data={accounts}
                onEdit={item => setActiveModal({ type: 'accounts', item })}
                onDelete={id => handleCrud('accounts', 'delete', id)}
                onCreate={() => setActiveModal({ type: 'accounts', item: null })}
              />
            )}
          </>
        )}
      </main>
      <Footer />

      {activeModal && activeModal.type === 'tips' && (
        <TipFormModal tip={activeModal.item} onClose={() => setActiveModal(null)} onSave={d => handleCrud('tips', 'save', d)} />
      )}
      {activeModal && activeModal.type === 'reviews' && (
        <ReviewFormModal item={activeModal.item} onClose={() => setActiveModal(null)} onSave={d => handleCrud('reviews', 'save', d)} />
      )}
      {activeModal && activeModal.type === 'resources' && (
        <ResourceFormModal item={activeModal.item} onClose={() => setActiveModal(null)} onSave={d => handleCrud('resources', 'save', d)} />
      )}
      {activeModal && activeModal.type === 'accounts' && (
        <AccountFormModal account={activeModal.item} onClose={() => setActiveModal(null)} onSave={d => handleCrud('accounts', 'save', d)} />
      )}
    </div>
  );
}

function applyFilters<T extends { createdAt: string; status?: string; name?: string | null; phone?: string | null; title?: string; author?: string; category?: string; }>(data: T[], filter: FilterState): T[] {
  return data.filter(row => {
    const d = new Date(row.createdAt);
    if (filter.startDate) {
      const start = new Date(filter.startDate); start.setHours(0,0,0,0);
      if (d < start) return false;
    }
    if (filter.endDate) {
      const end = new Date(filter.endDate); end.setHours(23,59,59,999);
      if (d > end) return false;
    }
    if (filter.status !== '전체' && row.status && row.status !== filter.status) return false;

    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      let match = false;
      const searchableTexts = [
        row.name, row.phone, row.title, row.author, row.category
      ].filter(Boolean).map(s => String(s).toLowerCase());

      if (filter.searchField === '전체') {
        match = searchableTexts.some(t => t.includes(q));
      } else {
        if (filter.searchField === '이름') match = Boolean(row.name?.toLowerCase().includes(q) || row.author?.toLowerCase().includes(q));
        if (filter.searchField === '연락처') match = Boolean(row.phone?.includes(q));
        if (filter.searchField === '제목') match = Boolean(row.title?.toLowerCase().includes(q));
      }
      if (!match) return false;
    }
    return true;
  });
}

function ConsultationsTable({ data, filter, onStatusChange }: { data: ConsultationRequest[]; filter: FilterState; onStatusChange: (id: number, status: Status) => void; }) {
  const [updating, setUpdating] = useState<number | null>(null);
  const filtered = applyFilters(data, filter);

  const handleChange = async (id: number, status: Status) => {
    setUpdating(id);
    await onStatusChange(id, status);
    setUpdating(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-base md:text-lg">견적 문의 목록</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#1e293b] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-16">번호</th>
              <th className="px-4 py-3 font-semibold text-center">이름</th>
              <th className="px-4 py-3 font-semibold text-center">연락처</th>
              <th className="px-4 py-3 font-semibold text-center w-32">상태</th>
              <th className="px-4 py-3 font-semibold text-center w-40">접수일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400 font-semibold text-sm">데이터가 없습니다.</td></tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-center text-gray-500 font-medium">{row.id}</td>
                <td className="px-4 py-4 text-center font-bold text-gray-900">{row.name}</td>
                <td className="px-4 py-4 text-center text-gray-700 font-medium">{row.phone}</td>
                <td className="px-4 py-4 text-center">
                  <StatusSelect value={row.status ?? '처리중'} onChange={s => handleChange(row.id, s)} loading={updating === row.id} />
                </td>
                <td className="px-4 py-4 text-center text-gray-500 tabular-nums">{formatDate(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApplicationsTable({ data, filter, token, onStatusChange, onMemoSave, onHistoryAdd, onHistoryDelete, onNotify }: { data: Application[]; filter: FilterState; token: string; onStatusChange: (id: number, status: Status) => void; onMemoSave: (id: number, memo: string) => Promise<void>; onHistoryAdd: (id: number, note: string) => Promise<boolean>; onHistoryDelete: (id: number, index: number) => Promise<void>; onNotify: (id: number, variables: Record<string, string>) => Promise<{ success: boolean; mock?: boolean; error?: string }>; }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const filtered = applyFilters(data, filter);

  const handleChange = async (id: number, status: Status) => {
    setUpdating(id);
    await onStatusChange(id, status);
    setUpdating(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-base md:text-lg">신청서 목록</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#1e293b] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-16">번호</th>
              <th className="px-4 py-3 font-semibold text-center">이름</th>
              <th className="px-4 py-3 font-semibold text-center">가입 통신사</th>
              <th className="px-4 py-3 font-semibold text-center">인터넷</th>
              <th className="px-4 py-3 font-semibold text-center w-28">동의여부</th>
              <th className="px-4 py-3 font-semibold text-center w-32">상태</th>
              <th className="px-4 py-3 font-semibold text-center w-40">접수일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-semibold text-sm">데이터가 없습니다.</td></tr>
            ) : filtered.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
                  <td className="px-4 py-4 text-center text-gray-500 font-medium">{row.id}</td>
                  <td className="px-4 py-4 text-center font-bold text-gray-900">{row.name ?? '-'}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{row.applyProvider ?? '-'}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{row.internet ?? '-'}</td>
                  <td className="px-4 py-4 text-center">
                    {row.consentedAt ? (
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-sm px-2.5 py-1 font-bold">동의완료</span>
                    ) : (
                      <span className="text-xs bg-gray-50 text-gray-500 border border-gray-200 rounded-sm px-2.5 py-1 font-bold">동의대기</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center" onClick={e => e.stopPropagation()}>
                    <StatusSelect value={row.status ?? '처리중'} onChange={s => handleChange(row.id, s)} loading={updating === row.id} />
                  </td>
                  <td className="px-4 py-4 text-center text-gray-500 tabular-nums">{formatDate(row.createdAt)}</td>
                </tr>
                {expanded === row.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50/50 p-0 border-b-2 border-gray-200 whitespace-normal">
                      <div className="w-full min-w-0 p-6 border-t border-gray-100">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm bg-white p-5 rounded-md border border-gray-200 mb-6">
                          <Field label="기존 통신사" value={row.currentProvider} />
                          <Field label="가입신청 통신사" value={row.applyProvider} />
                          <Field label="인터넷" value={row.internet} />
                          <Field label="TV" value={row.tv} />
                          <Field label="고객유형" value={row.customerType} />
                          <Field label="납부방법" value={row.paymentMethod} />
                          <Field label="이름" value={row.name} />
                          <Field label="휴대폰" value={`${row.phoneCarrier ?? ''} ${row.phone ?? ''}`} />
                          <Field label="이메일" value={row.email} />
                          <Field label="설치주소" value={row.address} span />
                          {row.paymentMethod === '자동이체' && (
                            <>
                              <Field label="납부은행" value={row.payBank} />
                              <Field label="계좌번호" value={row.payAccount} />
                              <Field label="예금주" value={row.payAccountHolder} />
                            </>
                          )}
                          {row.paymentMethod === '카드자동이체' && (
                            <>
                              <Field label="카드사" value={row.cardCompany} />
                              <Field label="카드번호" value={row.cardNumber} />
                              <Field label="유효기간" value={row.cardExpiry} />
                            </>
                          )}
                          <Field label="사은품 은행" value={row.giftBank} />
                          <Field label="사은품 계좌" value={row.giftAccount} />
                          <Field label="사은품 예금주" value={row.giftAccountHolder} />
                          {row.memo && <Field label="신청 메모" value={row.memo} span />}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-6 min-w-0">
                            {row.consentedAt && <ConsentPdfButton id={row.id} name={row.name} consentedAt={row.consentedAt} token={token} />}
                            <KakaoNotifySection id={row.id} phone={row.phone} onNotify={onNotify} />
                          </div>
                          <div className="space-y-6 min-w-0">
                            <AdminMemoSection id={row.id} initialMemo={row.adminMemo ?? ''} onSave={onMemoSave} />
                          </div>
                        </div>
                        <ConsultationHistorySection id={row.id} history={row.consultationHistory ? JSON.parse(row.consultationHistory) as HistoryEntry[] : []} onAdd={onHistoryAdd} onDelete={onHistoryDelete} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResourcesTable({ data, filter, onEdit, onDelete, onCreate }: { data: AdminResource[]; filter: FilterState; onEdit: (i: AdminResource) => void; onDelete: (id: number) => void; onCreate: () => void; }) {
  const filtered = applyFilters(data, filter);
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-base md:text-lg">관리자 자료 목록</h3>
        <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-xs font-bold shadow-sm transition-colors">
          + 자료 추가
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#1e293b] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-28">작성일</th>
              <th className="px-4 py-3 font-semibold text-center w-28">카테고리</th>
              <th className="px-4 py-3 font-semibold">자료명</th>
              <th className="px-4 py-3 font-semibold text-center w-20">상태</th>
              <th className="px-4 py-3 font-semibold text-center w-32">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400 font-semibold text-sm">데이터가 없습니다.</td></tr>
            ) : filtered.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-center text-gray-600 tabular-nums">{formatDateOnly(row.createdAt)}</td>
                <td className="px-4 py-4 text-center">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-sm text-xs font-semibold">{row.category || '-'}</span>
                </td>
                <td className="px-4 py-4 text-gray-900 font-bold truncate max-w-sm">{row.title}</td>
                <td className="px-4 py-4 text-center">
                   {row.isPublished ? (
                    <span className="text-blue-600 text-xs font-bold">공개</span>
                  ) : (
                    <span className="text-gray-400 text-xs font-bold">비공개</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => onEdit(row)} className="border border-gray-300 bg-white text-gray-600 px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-gray-50 transition-colors">수정</button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) onDelete(row.id) }} className="bg-[#dc2626] text-white px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-red-700 transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsTable({ data, filter, onEdit, onDelete, onCreate }: { data: ManagedReview[]; filter: FilterState; onEdit: (i: ManagedReview) => void; onDelete: (id: number) => void; onCreate: () => void; }) {
  const filtered = applyFilters(data, filter);
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-base md:text-lg">후기 관리</h3>
        <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-xs font-bold shadow-sm transition-colors">
          + 후기 작성
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#1e293b] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-28">작성일</th>
              <th className="px-4 py-3 font-semibold text-center w-28">작성자</th>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold text-center w-20">조회수</th>
              <th className="px-4 py-3 font-semibold text-center w-20">분류</th>
              <th className="px-4 py-3 font-semibold text-center w-20">상태</th>
              <th className="px-4 py-3 font-semibold text-center w-32">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-semibold text-sm">데이터가 없습니다.</td></tr>
            ) : filtered.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-center text-gray-600 tabular-nums">{formatDateOnly(row.createdAt)}</td>
                <td className="px-4 py-4 text-center font-medium text-gray-900">{row.author}</td>
                <td className="px-4 py-4 text-gray-900 font-bold truncate max-w-sm">{row.title}</td>
                <td className="px-4 py-4 text-center text-gray-600">{row.views}</td>
                <td className="px-4 py-4 text-center">
                  {row.isBest ? (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-sm text-[11px] font-bold border border-blue-200">베스트</span>
                  ) : (
                    <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-sm text-[11px] font-bold border border-gray-200">일반</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                   {row.isPublished ? (
                    <span className="text-blue-600 text-[11px] font-bold">발행</span>
                  ) : (
                    <span className="text-gray-400 text-[11px] font-bold">숨김</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => onEdit(row)} className="border border-gray-300 bg-white text-gray-600 px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-gray-50 transition-colors">수정</button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) onDelete(row.id) }} className="bg-[#dc2626] text-white px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-red-700 transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TipsTable({ data, filter, onEdit, onDelete, onCreate }: { data: ManagedTip[]; filter: FilterState; onEdit: (i: ManagedTip) => void; onDelete: (id: number) => void; onCreate: () => void; }) {
  const filtered = applyFilters(data, filter);
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center bg-white border-b border-gray-200">
        <h3 className="font-bold text-gray-900 text-base md:text-lg">꿀팁 목록</h3>
        <button onClick={onCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm text-xs font-bold shadow-sm transition-colors">
          + 꿀팁 작성
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#1e293b] text-white">
            <tr>
              <th className="px-4 py-3 font-semibold text-center w-28">작성일</th>
              <th className="px-4 py-3 font-semibold text-center w-28">카테고리</th>
              <th className="px-4 py-3 font-semibold">제목</th>
              <th className="px-4 py-3 font-semibold text-center w-20">조회수</th>
              <th className="px-4 py-3 font-semibold text-center w-20">추천</th>
              <th className="px-4 py-3 font-semibold text-center w-20">상태</th>
              <th className="px-4 py-3 font-semibold text-center w-32">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400 font-semibold text-sm">데이터가 없습니다.</td></tr>
            ) : filtered.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-center text-gray-600 tabular-nums">{formatDateOnly(row.createdAt)}</td>
                <td className="px-4 py-4 text-center">
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-sm text-[11px] font-bold">{row.category || '일반'}</span>
                </td>
                <td className="px-4 py-4 text-gray-900 font-bold truncate max-w-[200px] md:max-w-md">{row.title}</td>
                <td className="px-4 py-4 text-center text-gray-600">{row.views}</td>
                <td className="px-4 py-4 text-center">
                  {row.isFeatured ? (
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-sm text-[11px] font-bold border border-blue-200">추천</span>
                  ) : (
                    <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-sm text-[11px] font-bold border border-gray-200">일반</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                   {row.isPublished ? (
                    <span className="text-blue-600 text-[11px] font-bold">발행</span>
                  ) : (
                    <span className="text-gray-400 text-[11px] font-bold">숨김</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => onEdit(row)} className="border border-gray-300 bg-white text-gray-600 px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-gray-50 transition-colors">수정</button>
                    <button onClick={() => { if(confirm('삭제하시겠습니까?')) onDelete(row.id) }} className="bg-[#dc2626] text-white px-2.5 py-1 rounded-sm text-[11px] font-bold hover:bg-red-700 transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-xl font-bold transition-colors">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

function ResourceFormModal({ item, onClose, onSave }: { item?: AdminResource | null, onClose: () => void, onSave: (d: any) => void }) {
  const [formData, setFormData] = useState<Partial<AdminResource>>(item || {
    title: '', category: '', description: '', fileUrl: '', previewUrl: '', isPublished: true
  });

  return (
    <Modal title={item ? '자료 수정' : '자료 추가'} onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(formData); }} className="space-y-5">
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">자료명</label>
           <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">카테고리</label>
            <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">설명</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">파일 URL</label>
            <input required type="text" value={formData.fileUrl} onChange={e => setFormData({...formData, fileUrl: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">미리보기 URL</label>
           <input type="text" value={formData.previewUrl} onChange={e => setFormData({...formData, previewUrl: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div className="py-2 border-t border-gray-100">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer w-max">
              <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
              자료 공개
            </label>
         </div>
         <div className="pt-2 flex justify-end gap-2">
           <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">취소</button>
           <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors">저장</button>
         </div>
      </form>
    </Modal>
  )
}

function ReviewFormModal({ item, onClose, onSave }: { item?: ManagedReview | null, onClose: () => void, onSave: (d: any) => void }) {
  const [formData, setFormData] = useState<Partial<ManagedReview>>(item || {
    title: '', author: '', content: '', thumbnail: '', views: 0, isBest: false, isPublished: true
  });

  return (
    <Modal title={item ? '후기 수정' : '후기 작성'} onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(formData); }} className="space-y-5">
         <div className="grid grid-cols-[1fr_120px] gap-4">
           <div>
             <label className="block text-[11px] font-bold text-gray-500 mb-1.5">제목</label>
             <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
           <div>
             <label className="block text-[11px] font-bold text-gray-500 mb-1.5">작성자</label>
             <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">내용</label>
           <textarea required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">썸네일 URL</label>
           <input type="text" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div className="flex flex-wrap gap-x-8 gap-y-4 items-center py-4 border-t border-gray-100 mt-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer">
              <input type="checkbox" checked={formData.isBest} onChange={e => setFormData({...formData, isBest: e.target.checked})} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
              베스트 후기 지정
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
              발행 (공개)
            </label>
            <div className="ml-auto flex items-center gap-3">
              <label className="text-[11px] font-bold text-gray-500">조회수</label>
              <input type="number" value={formData.views} onChange={e => setFormData({...formData, views: parseInt(e.target.value) || 0})} className="w-24 border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
         </div>
         <div className="pt-2 flex justify-end gap-2">
           <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">취소</button>
           <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors">저장</button>
         </div>
      </form>
    </Modal>
  )
}

function TipFormModal({ tip, onClose, onSave }: { tip?: ManagedTip | null, onClose: () => void, onSave: (d: any) => void }) {
  const [formData, setFormData] = useState<Partial<ManagedTip>>(tip || {
    title: '', slug: '', category: '', content: '', thumbnail: '', views: 0, isFeatured: false, isPublished: true
  });

  return (
    <Modal title={tip ? '꿀팁 수정' : '꿀팁 작성'} onClose={onClose}>
      <form onSubmit={e => { e.preventDefault(); onSave(formData); }} className="space-y-5">
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">제목</label>
           <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-[11px] font-bold text-gray-500 mb-1.5">슬러그 (URL용)</label>
              <input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="영문 소문자, 숫자, 하이픈만 입력하세요." type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
           <div>
             <label className="block text-[11px] font-bold text-gray-500 mb-1.5">카테고리</label>
              <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
           </div>
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">썸네일 URL</label>
           <input type="text" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
         </div>
         <div>
           <label className="block text-[11px] font-bold text-gray-500 mb-1.5">내용 (Markdown 등 지원 형태에 맞게 입력)</label>
           <textarea required rows={8} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
         </div>
         <div className="flex flex-wrap gap-x-8 gap-y-4 items-center py-4 border-t border-gray-100 mt-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
              추천 (Best) 표시
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 cursor-pointer">
              <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
              발행 (공개)
            </label>
            <div className="ml-auto flex items-center gap-3">
              <label className="text-[11px] font-bold text-gray-500">조회수</label>
              <input type="number" value={formData.views} onChange={e => setFormData({...formData, views: parseInt(e.target.value) || 0})} className="w-24 border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
         </div>
         <div className="pt-2 flex justify-end gap-2">
           <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">취소</button>
           <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors">저장</button>
         </div>
      </form>
    </Modal>
  )
}

function Field({ label, value, span }: { label: string; value: string | null; span?: boolean }) {
  if (!value) return null;
  return (
    <div className={span ? 'col-span-full' : ''}>
      <span className="block text-[11px] font-bold text-gray-400 mb-0.5">{label}</span>
      <span className="block text-sm font-bold text-gray-900 break-words">{value}</span>
    </div>
  );
}

function ConsentPdfButton({ id, name, consentedAt, token }: { id: number; name: string | null; consentedAt: string; token: string; }) {
  const [downloading, setDownloading] = useState(false);
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/consent/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('PDF 저장 실패');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `동의서_${name ?? id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert('PDF 저장에 실패했습니다.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-gray-900">개인정보 동의 완료</p>
        <p className="text-xs text-gray-500 mt-1">{name ?? '-'} · {formatDate(consentedAt)}</p>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="text-xs px-4 py-2 bg-white border border-gray-300 rounded-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
      >
        {downloading ? '저장 중...' : 'PDF 저장'}
      </button>
    </div>
  );
}

function KakaoNotifySection({ id, phone, onNotify }: { id: number; phone: string | null; onNotify: (id: number, vars: Record<string, string>) => Promise<{success: boolean; mock?: boolean; error?: string}> }) {
  const [loading, setLoading] = useState(false);

  const handleSend = async (type: string) => {
    if (!phone) return alert('연락처가 없습니다.');
    if (!confirm(`${type} 알림톡을 ${phone} 번호로 발송하시겠습니까?`)) return;
    setLoading(true);
    const res = await onNotify(id, { type });
    setLoading(false);
    if (res.success) {
      alert(res.mock ? `[테스트 모드] ${type} 발송 성공` : `${type} 발송이 완료되었습니다.`);
    } else {
      alert(`발송 실패: ${res.error}`);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white px-5 py-5 shadow-sm">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h4 className="text-sm font-black text-gray-900">수동 알림톡 발송</h4>
        <p className="mt-1 text-xs text-gray-500">발송 대상: {phone ?? '연락처 없음'}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => handleSend('접수완료')}
          disabled={loading || !phone}
          className="rounded-sm border border-gray-200 px-4 py-3 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="block text-sm font-bold text-gray-800">접수 안내톡 발송</span>
        </button>
        <button
          onClick={() => handleSend('개통완료')}
          disabled={loading || !phone}
          className="rounded-sm border border-gray-200 px-4 py-3 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="block text-sm font-bold text-gray-800">개통 완료톡 발송</span>
        </button>
      </div>
    </div>
  );
}

function AdminMemoSection({ id, initialMemo, onSave }: { id: number; initialMemo: string; onSave: (id: number, memo: string) => Promise<void> }) {
  const [memo, setMemo] = useState(initialMemo);
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    await onSave(id, memo);
    setSaving(false);
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white px-5 py-5 shadow-sm flex flex-col h-full min-h-[200px]">
      <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
        <h4 className="text-sm font-black text-gray-900">관리자 메모</h4>
        <button
          onClick={handleSave}
          disabled={saving || memo === initialMemo}
          className="text-xs px-3 py-1.5 bg-[#1e293b] text-white rounded-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-sm"
        >
          {saving ? '저장 중' : '메모 저장'}
        </button>
      </div>
      <textarea
        value={memo}
        onChange={e => setMemo(e.target.value)}
        placeholder="이 신청건에 대한 관리자 전용 메모를 입력하세요."
        className="w-full flex-1 min-h-[100px] border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium"
      />
    </div>
  );
}

function ConsultationHistorySection({ id, history, onAdd, onDelete }: { id: number; history: HistoryEntry[]; onAdd: (id: number, n: string) => Promise<boolean>; onDelete: (id: number, i: number) => Promise<void> }) {
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setAdding(true);
    if (await onAdd(id, note)) setNote('');
    setAdding(false);
  };

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm whitespace-normal">
      <div className="mb-4 border-b border-gray-100 pb-3">
        <h4 className="px-5 pt-5 text-sm font-black text-gray-900">상담 이력 ({history.length})</h4>
      </div>
      <div className="max-h-64 overflow-auto border-b border-gray-100">
        <table className="w-full table-fixed text-sm">
          <thead className="sticky top-0 bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-200">
              <th className="w-44 px-4 py-3 text-left font-bold">일시</th>
              <th className="px-4 py-3 text-left font-bold">상담 내용</th>
              <th className="w-20 px-4 py-3 text-center font-bold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-xs font-medium text-gray-400">등록된 상담 이력이 없습니다.</td>
              </tr>
            ) : (
              history.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 align-top text-xs font-semibold text-gray-500 tabular-nums whitespace-nowrap">{formatDate(h.date)}</td>
                  <td className="px-4 py-3 align-top font-medium leading-relaxed text-gray-800 break-words whitespace-normal">{h.note}</td>
                  <td className="px-4 py-3 text-center align-top">
                    <button
                      onClick={() => { if(confirm('삭제하시겠습니까?')) onDelete(id, i) }}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline whitespace-nowrap"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col gap-2 p-4 sm:flex-row">
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="새로운 상담 이력 입력..."
          className="min-w-0 flex-1 border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
        />
        <button
          type="submit"
          disabled={adding || !note.trim()}
          className="px-4 py-2 bg-[#1e293b] text-white rounded-sm text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap shadow-sm"
        >
          기록
        </button>
      </form>
    </div>
  );
}


function AccountsTable({ data, onEdit, onDelete, onCreate }: { data: AdminAccount[], onEdit: (a: AdminAccount) => void, onDelete: (id: number) => void, onCreate: () => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h2 className="text-sm font-bold text-gray-800">관리자 목록</h2>
        <button onClick={onCreate} className="bg-blue-600 text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
          관리자 추가
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">이름</th>
              <th className="px-4 py-3 font-semibold text-gray-600">아이디</th>
              <th className="px-4 py-3 font-semibold text-gray-600">권한</th>
              <th className="px-4 py-3 font-semibold text-gray-600">상태</th>
              <th className="px-4 py-3 font-semibold text-gray-600">최근 로그인</th>
              <th className="px-4 py-3 font-semibold text-gray-600">생성일</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-24 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{a.displayName}</td>
                <td className="px-4 py-3 text-gray-600">{a.username || '-'}</td>
                <td className="px-4 py-3">
                  {a.role === 'owner' && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-sm text-xs font-bold">대표 권한</span>}
                  {a.role === 'full' && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-sm text-xs font-bold">전체 권한</span>}
                  {a.role === 'limited' && (
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-sm text-[10px] font-bold">제한 권한</span>
                      {a.permissions?.map(p => <span key={p} className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm text-[10px] font-semibold">{permissionLabel(p)}</span>)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {a.isActive === false ? <span className="text-red-500 font-semibold text-xs">비활성</span> : <span className="text-green-600 font-semibold text-xs">활성</span>}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{a.lastLoginAt ? formatDateOnly(a.lastLoginAt) : '-'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDateOnly(a.createdAt)}</td>
                <td className="px-4 py-3 text-center">
                  {a.role !== 'owner' && (
                    <div className="flex justify-center gap-2">
                      <button onClick={() => onEdit(a)} className="text-blue-600 hover:text-blue-800 font-semibold text-xs">수정</button>
                      <button onClick={() => {
                        if (confirm('정말 삭제하시겠습니까?')) onDelete(a.id);
                      }} className="text-red-600 hover:text-red-800 font-semibold text-xs">삭제</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">등록된 관리자가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AccountFormModal({ account, onClose, onSave }: { account: AdminAccount | null, onClose: () => void, onSave: (data: any) => Promise<boolean> }) {
  const [displayName, setDisplayName] = useState(account?.displayName || '');
  const [username, setUsername] = useState(account?.username || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'full' | 'limited'>(account?.role === 'full' ? 'full' : 'limited');
  const [permissions, setPermissions] = useState<string[]>(account?.permissions || []);
  const [isActive, setIsActive] = useState(account?.isActive !== false);
  const [saving, setSaving] = useState(false);

  const isEdit = !!account;

  const togglePerm = (p: string) => {
    if (permissions.includes(p)) setPermissions(permissions.filter(x => x !== p));
    else setPermissions([...permissions, p]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !username) {
      alert('이름과 아이디를 입력해주세요.'); return;
    }
    if (!isEdit && !password) {
      alert('비밀번호를 입력해주세요.'); return;
    }
    if (role === 'limited' && permissions.length === 0) {
      alert('제한 권한인 경우 최소 하나의 권한을 선택해야 합니다.'); return;
    }

    setSaving(true);
    const payload: any = {
      displayName, username, role, permissions, isActive
    };
    if (password) payload.password = password;
    if (isEdit) payload.id = account.id;

    const ok = await onSave(payload);
    if (ok) onClose();
    else setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? '관리자 수정' : '관리자 추가'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">이름</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="홍길동" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">아이디</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required disabled={isEdit} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100" placeholder="admin01" />
            {isEdit && <p className="text-xs text-gray-500 mt-1">아이디는 수정할 수 없습니다.</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">비밀번호 {isEdit && <span className="text-gray-400 font-normal">(변경시에만 입력)</span>}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required={!isEdit} className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder={isEdit ? "변경할 비밀번호 입력" : "비밀번호 입력"} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">권한 설정</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="role" value="full" checked={role === 'full'} onChange={() => setRole('full')} className="text-blue-600 focus:ring-blue-500" /> 전체 권한
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="role" value="limited" checked={role === 'limited'} onChange={() => setRole('limited')} className="text-blue-600 focus:ring-blue-500" /> 제한 권한
              </label>
            </div>
            {role === 'limited' && (
              <div className="bg-gray-50 p-3 rounded-sm border border-gray-200 flex flex-wrap gap-4">
                {PERMISSION_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="checkbox" checked={permissions.includes(option.value)} onChange={() => togglePerm(option.value)} className="text-blue-600 rounded-sm focus:ring-blue-500" />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
          {isEdit && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">계정 상태</label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="text-blue-600 rounded-sm focus:ring-blue-500" /> 활성화 (체크 해제 시 로그인 불가)
              </label>
            </div>
          )}
          <div className="pt-4 flex justify-end gap-2 border-t border-gray-200 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">취소</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
