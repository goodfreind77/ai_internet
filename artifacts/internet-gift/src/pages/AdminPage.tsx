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

export default function AdminPage() {
  const [tab, setTab] = useState<'consultations' | 'applications'>('consultations');
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cRes, aRes] = await Promise.all([
          fetch('/api/consultations'),
          fetch('/api/applications'),
        ]);
        if (cRes.ok) setConsultations(await cRes.json());
        if (aRes.ok) setApplications(await aRes.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-2">어드민 페이지</h1>
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
