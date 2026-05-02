import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type ConsultationRequest = {
  id: number;
  name: string;
  phone: string;
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
  phoneCarrier: string | null;
  createdAt: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

const TOKEN_KEY = 'adminToken';

function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
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
      if (!res.ok) {
        setError(data.error ?? '로그인에 실패했습니다.');
        return;
      }
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                비밀번호
              </label>
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
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
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

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [tab, setTab] = useState<'consultations' | 'applications'>('consultations');
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (newToken: string) => {
    setStoredToken(newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    clearStoredToken();
    setToken(null);
    setConsultations([]);
    setApplications([]);
  };

  useEffect(() => {
    if (!token) return;
    async function load() {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [cRes, aRes] = await Promise.all([
          fetch('/api/consultations', { headers }),
          fetch('/api/applications', { headers }),
        ]);
        if (cRes.status === 401) { handleLogout(); return; }
        if (cRes.ok) setConsultations(await cRes.json());
        if (aRes.ok) setApplications(await aRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (!token) {
    return <AdminLoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
          <ConsultationsTable data={consultations} />
        ) : (
          <ApplicationsTable data={applications} />
        )}
      </main>

      <Footer />
    </div>
  );
}

function ConsultationsTable({ data }: { data: ConsultationRequest[] }) {
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
            <th className="px-4 py-3 text-left font-bold text-gray-600">접수일시</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
              <td className="px-4 py-3 text-gray-400">{row.id}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">{row.name}</td>
              <td className="px-4 py-3 text-gray-700">{row.phone}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationsTable({ data }: { data: Application[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-400">
        아직 신청서가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((row) => (
        <div key={row.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(expanded === row.id ? null : row.id)}
          >
            <div className="flex items-center gap-6 text-left">
              <span className="text-gray-400 text-xs w-6">#{row.id}</span>
              <span className="font-bold text-gray-900">{row.name ?? '-'}</span>
              <span className="text-gray-600">{row.phone ?? '-'}</span>
              <span className="text-gray-500 text-sm">{row.applyProvider ?? '-'}</span>
              <span className="text-gray-400 text-xs">{row.internet ?? '-'}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs">{formatDate(row.createdAt)}</span>
              <span className="text-gray-400">{expanded === row.id ? '▲' : '▼'}</span>
            </div>
          </button>

          {expanded === row.id && (
            <div className="border-t border-gray-100 px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
              {row.memo && <Field label="메모" value={row.memo} span />}
            </div>
          )}
        </div>
      ))}
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
