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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

const STATUS_STYLES: Record<Status, string> = {
  '처리중':  'bg-yellow-100 text-yellow-700 border-yellow-200',
  '접수완료': 'bg-green-100 text-green-700 border-green-200',
  '개통완료': 'bg-blue-100 text-blue-700 border-blue-200',
  '취소':    'bg-red-100 text-red-600 border-red-200',
};

function StatusSelect({
  value,
  onChange,
  loading,
}: {
  value: Status;
  onChange: (s: Status) => void;
  loading: boolean;
}) {
  return (
    <select
      value={value}
      disabled={loading}
      onChange={e => onChange(e.target.value as Status)}
      className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer transition-colors disabled:opacity-60 ${STATUS_STYLES[value]}`}
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

function AdminLoginForm({ onLogin }: { onLogin: (token: string) => void }) {
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
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? '로그인에 실패했습니다.'); return; }
      onLogin(data.token);
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
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="text-3xl mb-3">🔒</div>
            <h1 className="text-2xl font-black text-gray-900">어드민 로그인</h1>
            <p className="text-gray-500 text-sm mt-1">관리자 비밀번호를 입력해주세요.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm"
                autoFocus
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
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

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [tab, setTab] = useState<'consultations' | 'applications'>('consultations');
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const knownCIds = useRef<Set<number>>(new Set());
  const knownAIds = useRef<Set<number>>(new Set());
  const isFirst = useRef(true);

  const pushToast = useCallback((message: string, kind: Toast['kind']) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 7000);
  }, []);

  const handleLogin = (newToken: string) => {
    setStoredToken(newToken);
    setToken(newToken);
  };

  const handleLogout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setConsultations([]);
    setApplications([]);
  }, []);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [cRes, aRes] = await Promise.all([
        fetch('/api/consultations', { headers }),
        fetch('/api/applications', { headers }),
      ]);
      if (cRes.status === 401) { handleLogout(); return; }

      if (cRes.ok) {
        const cData: ConsultationRequest[] = await cRes.json();
        setConsultations(cData);
        if (!isFirst.current) {
          for (const c of cData.filter(c => !knownCIds.current.has(c.id))) {
            const msg = `📋 새 빠른견적 문의: ${c.name} (${c.phone})`;
            pushToast(msg, 'consultation');
            if (Notification.permission === 'granted') {
              new Notification('AI인터넷 — 새 빠른견적 문의', {
                body: `${c.name}님 (${c.phone})이 빠른견적을 문의했습니다.`,
              });
            }
          }
        }
        knownCIds.current = new Set(cData.map(c => c.id));
      }

      if (aRes.ok) {
        const aData: Application[] = await aRes.json();
        setApplications(aData);
        if (!isFirst.current) {
          for (const a of aData.filter(a => !knownAIds.current.has(a.id))) {
            const msg = `📝 새 신청서: ${a.name ?? '이름없음'} (${a.phone ?? '-'})`;
            pushToast(msg, 'application');
            if (Notification.permission === 'granted') {
              new Notification('AI인터넷 — 새 신청서 접수', {
                body: `${a.name ?? '고객'}님이 신청서를 제출했습니다.`,
              });
            }
          }
        }
        knownAIds.current = new Set(aData.map(a => a.id));
      }

      isFirst.current = false;
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, handleLogout, pushToast]);

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // 초기 로드 + 30초 폴링
  useEffect(() => {
    if (!token) return;
    isFirst.current = true;
    load(false);
    const interval = setInterval(() => load(true), 30_000);
    return () => clearInterval(interval);
  }, [token, load]);

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

  if (!token) return <AdminLoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 토스트 알림 */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold max-w-xs animate-bounce-in ${
              t.kind === 'application' ? 'bg-primary' : 'bg-orange-500'
            }`}
          >
            <span className="text-lg leading-none">{t.kind === 'application' ? '📝' : '📋'}</span>
            <div>
              <p className="font-black text-xs mb-0.5">{t.kind === 'application' ? '새 신청서 접수!' : '새 빠른견적 문의!'}</p>
              <p className="opacity-90 text-xs font-normal">{t.message.replace(/^[📋📝]\s*새\s*(빠른견적 문의|신청서):\s*/, '')}</p>
            </div>
          </div>
        ))}
      </div>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-black text-gray-900">어드민 페이지</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-200"
          >
            로그아웃
          </button>
        </div>
        <p className="text-gray-500 mb-8">빠른 견적 문의 및 신청서 제출 내역을 확인합니다.</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('consultations')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
              tab === 'consultations'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            빠른 견적 문의 ({consultations.length})
          </button>
          <button
            onClick={() => setTab('applications')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
              tab === 'applications'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            신청서 작성 ({applications.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">불러오는 중...</div>
        ) : tab === 'consultations' ? (
          <ConsultationsTable data={consultations} onStatusChange={updateConsultationStatus} />
        ) : (
          <ApplicationsTable
            data={applications}
            onStatusChange={updateApplicationStatus}
            onMemoSave={updateApplicationMemo}
            onHistoryAdd={addConsultationHistory}
            onHistoryDelete={deleteConsultationHistory}
            onNotify={sendKakaoNotify}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

function ConsultationsTable({
  data,
  onStatusChange,
}: {
  data: ConsultationRequest[];
  onStatusChange: (id: number, status: Status) => void;
}) {
  const [updating, setUpdating] = useState<number | null>(null);

  const handleChange = async (id: number, status: Status) => {
    setUpdating(id);
    await onStatusChange(id, status);
    setUpdating(null);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
        아직 견적 문의가 없습니다.
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-bold text-gray-600 w-12">번호</th>
            <th className="px-4 py-3 text-left font-bold text-gray-600">이름</th>
            <th className="px-4 py-3 text-left font-bold text-gray-600">연락처</th>
            <th className="px-4 py-3 text-left font-bold text-gray-600">상태</th>
            <th className="px-4 py-3 text-left font-bold text-gray-600">접수일시</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
              <td className="px-4 py-3 text-gray-400">{row.id}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">{row.name}</td>
              <td className="px-4 py-3 text-gray-700">{row.phone}</td>
              <td className="px-4 py-3">
                <StatusSelect
                  value={row.status ?? '처리중'}
                  onChange={s => handleChange(row.id, s)}
                  loading={updating === row.id}
                />
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationsTable({
  data,
  onStatusChange,
  onMemoSave,
  onHistoryAdd,
  onHistoryDelete,
  onNotify,
}: {
  data: Application[];
  onStatusChange: (id: number, status: Status) => void;
  onMemoSave: (id: number, memo: string) => Promise<void>;
  onHistoryAdd: (id: number, note: string) => Promise<boolean>;
  onHistoryDelete: (id: number, index: number) => Promise<void>;
  onNotify: (id: number, variables: Record<string, string>) => Promise<{ success: boolean; mock?: boolean; error?: string }>;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleChange = async (id: number, status: Status) => {
    setUpdating(id);
    await onStatusChange(id, status);
    setUpdating(null);
  };

  const filtered = data.filter((row) => {
    const d = new Date(row.createdAt);
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (d < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (d > end) return false;
    }
    return true;
  });

  const hasFilter = startDate || endDate;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-black text-gray-900">신청서 작성 리스트</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              전체 {data.length}건
              {hasFilter && (
                <span className="ml-1.5 text-primary font-semibold">· 조회 결과 {filtered.length}건</span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">시작일</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            <span className="text-gray-300">~</span>
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">종료일</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
            {hasFilter && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
          {hasFilter ? '조회된 신청서가 없습니다.' : '아직 신청서가 없습니다.'}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex-1 flex items-center gap-4 text-xs font-bold text-gray-500">
              <span className="w-8 flex-shrink-0">번호</span>
              <span className="w-24 flex-shrink-0">이름</span>
              <span className="w-28 flex-shrink-0">가입 통신사</span>
              <span className="w-24 flex-shrink-0">인터넷</span>
              <span className="w-20 flex-shrink-0">동의여부</span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xs font-bold text-gray-500 w-16 text-center">접수여부</span>
              <span className="text-xs font-bold text-gray-500 w-36">접수일시</span>
              <span className="w-4"></span>
            </div>
          </div>

          {filtered.map((row) => (
            <div key={row.id} className="border-b border-gray-100 last:border-b-0">
              <div className="w-full flex items-center justify-between px-6 py-4">
                <button
                  className="flex-1 flex items-center gap-4 text-left hover:opacity-80 transition-opacity"
                  onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                >
                  <span className="text-gray-400 text-xs w-8 flex-shrink-0">#{row.id}</span>
                  <span className="font-bold text-gray-900 w-24 flex-shrink-0 truncate">{row.name ?? '-'}</span>
                  <span className="text-gray-500 text-sm w-28 flex-shrink-0 truncate">{row.applyProvider ?? '-'}</span>
                  <span className="text-gray-500 text-sm w-24 flex-shrink-0 truncate">{row.internet ?? '-'}</span>
                  {row.consentedAt ? (
                    <span className="text-xs bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-semibold w-20 flex-shrink-0 text-center whitespace-nowrap">✓ 동의완료</span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-400 border border-gray-200 rounded-full px-2 py-0.5 w-20 flex-shrink-0 text-center whitespace-nowrap">동의대기</span>
                  )}
                </button>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-16 flex justify-center">
                    <StatusSelect
                      value={row.status ?? '처리중'}
                      onChange={s => handleChange(row.id, s)}
                      loading={updating === row.id}
                    />
                  </div>
                  <span className="text-gray-400 text-xs w-36">{formatDate(row.createdAt)}</span>
                  <button
                    onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                    className="text-gray-400"
                  >
                    {expanded === row.id ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {expanded === row.id && (
            <div className="border-t border-gray-100">
              <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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

              <div className="border-t border-gray-100 px-6 py-5 space-y-6">
                {row.consentedAt && (
                  <ConsentPdfButton id={row.id} name={row.name} consentedAt={row.consentedAt} />
                )}
                <KakaoNotifySection
                  id={row.id}
                  phone={row.phone}
                  consentedAt={row.consentedAt}
                  onNotify={onNotify}
                />
                <AdminMemoSection
                  id={row.id}
                  initialMemo={row.adminMemo ?? ''}
                  onSave={onMemoSave}
                />
                <ConsultationHistorySection
                  id={row.id}
                  history={row.consultationHistory ? JSON.parse(row.consultationHistory) as HistoryEntry[] : []}
                  onAdd={onHistoryAdd}
                  onDelete={onHistoryDelete}
                />
              </div>
            </div>
          )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsentPdfButton({
  id,
  name,
  consentedAt,
}: {
  id: number;
  name: string | null;
  consentedAt: string;
}) {
  const handleDownload = () => {
    const base = window.location.origin + import.meta.env.BASE_URL;
    const url = `${base}consent/${id}?print=1`.replace(/([^:])\/\//g, '$1/');
    window.open(url, '_blank');
  };

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-green-800">✅ 동의 완료</p>
        <p className="text-xs text-green-600 mt-0.5">
          {name ?? '-'} · {formatDate(consentedAt)}
        </p>
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
      >
        <span>📄</span>
        PDF 다운로드
      </button>
    </div>
  );
}

function KakaoNotifySection({
  id,
  phone,
  consentedAt,
  onNotify,
}: {
  id: number;
  phone: string | null;
  consentedAt: string | null;
  onNotify: (id: number, variables: Record<string, string>) => Promise<{ success: boolean; mock?: boolean; error?: string }>;
}) {
  const consentUrl = `${window.location.origin}${import.meta.env.BASE_URL}consent/${id}`.replace(/([^:])\/\//g, '$1/');
  const [extraVars, setExtraVars] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'mock' | 'error'; text: string } | null>(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    // 기본 변수 + 사용자 입력 추가 변수 병합
    const variables: Record<string, string> = {};
    if (extraVars.trim()) {
      extraVars.split('\n').forEach(line => {
        const [k, ...v] = line.split('=');
        if (k && v.length) variables[k.trim()] = v.join('=').trim();
      });
    }
    const res = await onNotify(id, variables);
    setSending(false);
    if (res.success && res.mock) {
      setResult({ type: 'mock', text: 'API 키 미설정 — 실제 발송은 생략됐습니다. (테스트 성공)' });
    } else if (res.success) {
      setResult({ type: 'success', text: '알림톡이 성공적으로 발송됐습니다.' });
    } else {
      setResult({ type: 'error', text: res.error ?? '발송에 실패했습니다.' });
    }
    setTimeout(() => setResult(null), 6000);
  };

  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">💬</span>
        <h3 className="text-sm font-bold text-yellow-800">카카오 알림톡 발송</h3>
        <div className="ml-auto flex items-center gap-2">
          {consentedAt ? (
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-semibold">✓ 동의완료 {formatDate(consentedAt)}</span>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">동의 미완료</span>
          )}
          {phone && <span className="text-xs text-yellow-600">수신: {phone}</span>}
        </div>
      </div>

      {!phone && (
        <p className="text-xs text-yellow-700 mb-2">휴대폰 번호가 없어 발송할 수 없습니다.</p>
      )}

      <div className="space-y-2">
        {/* 자동 포함되는 기본 변수 안내 */}
        <div className="bg-white border border-yellow-200 rounded-lg px-3 py-2 text-xs text-gray-500 space-y-1">
          <p><span className="font-semibold text-yellow-700">자동 포함 변수:</span></p>
          <p><code>{'#{name}'}</code> → 신청자 이름</p>
          <p className="flex items-center gap-1">
            <code>{'#{agreement_api}'}</code> → 동의서 링크
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(consentUrl)}
              className="underline text-yellow-600 hover:text-yellow-800 ml-1"
            >
              복사
            </button>
          </p>
        </div>

        {/* 추가 템플릿 변수 입력 */}
        <div>
          <label className="text-xs text-yellow-700 font-medium mb-1 block">
            추가 변수 (선택, 한 줄에 하나씩: <code>{'#{변수명}=값'}</code>)
          </label>
          <textarea
            value={extraVars}
            onChange={e => setExtraVars(e.target.value)}
            rows={2}
            placeholder={'#{내용}=설치 일정을 안내드립니다.\n#{날짜}=2026-06-07'}
            disabled={!phone}
            className="w-full px-3 py-2 text-xs font-mono border border-yellow-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors resize-none disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs">
            {result && (
              <span className={result.type === 'error' ? 'text-red-500' : result.type === 'mock' ? 'text-blue-500' : 'text-green-600'}>
                {result.type === 'error' ? '✗' : '✓'} {result.text}
              </span>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !phone}
            className="px-4 py-1.5 rounded-lg bg-yellow-400 text-yellow-900 text-xs font-bold hover:bg-yellow-500 transition-colors disabled:opacity-40"
          >
            {sending ? '발송 중...' : '알림톡 발송'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminMemoSection({
  id,
  initialMemo,
  onSave,
}: {
  id: number;
  initialMemo: string;
  onSave: (id: number, memo: string) => Promise<void>;
}) {
  const [memo, setMemo] = useState(initialMemo);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setMemo(initialMemo); }, [initialMemo]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(id, memo);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-700">📝 어드민 메모</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? '저장 중...' : saved ? '✓ 저장됨' : '저장'}
        </button>
      </div>
      <textarea
        value={memo}
        onChange={e => setMemo(e.target.value)}
        rows={3}
        placeholder="관리자 메모를 입력하세요..."
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
      />
    </div>
  );
}

function ConsultationHistorySection({
  id,
  history,
  onAdd,
  onDelete,
}: {
  id: number;
  history: HistoryEntry[];
  onAdd: (id: number, note: string) => Promise<boolean>;
  onDelete: (id: number, index: number) => Promise<void>;
}) {
  const [note, setNote] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!note.trim()) return;
    setAdding(true);
    const ok = await onAdd(id, note);
    if (ok) setNote('');
    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAdd();
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3">📋 상담 이력</h3>

      {history.length === 0 ? (
        <p className="text-xs text-gray-400 mb-3">아직 상담 이력이 없습니다.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {history.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{formatDate(entry.date)}</p>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{entry.note}</p>
              </div>
              <button
                onClick={() => onDelete(id, i)}
                className="text-gray-300 hover:text-red-400 transition-colors text-xs flex-shrink-0 mt-0.5"
                title="삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="상담 내용을 입력하세요... (Ctrl+Enter로 추가)"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !note.trim()}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700 transition-colors disabled:opacity-40 self-end"
        >
          {adding ? '추가 중...' : '추가'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, span }: { label: string; value: string | null | undefined; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2 md:col-span-3' : ''}>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="font-medium text-gray-800">{value || '-'}</p>
    </div>
  );
}
