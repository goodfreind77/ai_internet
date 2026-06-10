import { useEffect, useState } from 'react';

type ConsentData = {
  id: number;
  name: string | null;
  phone: string | null;
  consentedAt: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}

function formatDateOnly(date: Date) {
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CHECKLIST = [
  '본인은 위 동의서 전문을 읽고 내용을 충분히 이해하였습니다.',
  '본 동의서의 전체 항목에 동의하며, 동의 완료 시 전화 상담 시 약속된 사은품 금액이 지급됨을 확인하였습니다.',
  '개통 완료일로부터 1년 이내 가입 상품 (인터넷/TV/전화/CCTV 등) 중 1개 이상의 해지/정지/상품변경 시 사은품 전액 또는 일부를 반환할 의무가 있음을 동의합니다.',
  '가입 상품 일부만 해지/정지/변경하는 경우에도 사은품 전액 또는 일부 반환 의무가 적용됨을 동의합니다.',
  '반환 사유가 통신사 측 사정으로 인한 경우에도 사은품 반환 의무가 있음을 동의합니다.',
  '반환 불이행 시 법적 절차가 진행될 수 있음을 동의합니다.',
  '본 동의서 작성을 위한 개인정보 수집 및 활용에 동의합니다.',
];

export default function ConsentPage({ id }: { id: string }) {
  const isPrintMode = new URLSearchParams(window.location.search).get('print') === '1';

  const [data, setData] = useState<ConsentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [agreedAt, setAgreedAt] = useState<string | null>(null);

  const now = new Date();
  const todayStr = formatDateOnly(now);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/consent/${id}`);
        if (!res.ok) {
          const d = await res.json();
          setError(d.error ?? '동의서를 불러올 수 없습니다.');
          return;
        }
        const d: ConsentData = await res.json();
        setData(d);
        if (d.consentedAt) {
          setAgreed(true);
          setAgreedAt(d.consentedAt);
        }
      } catch {
        setError('서버 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (isPrintMode && !loading && data) {
      setTimeout(() => window.print(), 300);
    }
  }, [isPrintMode, loading, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (confirmation !== '동의합니다.') {
      setSubmitError("'동의합니다.'를 정확히 입력해주세요.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/consent/${id}/agree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation }),
      });
      const d = await res.json();
      if (!res.ok) {
        setSubmitError(d.error ?? '동의 처리에 실패했습니다.');
        return;
      }
      setAgreed(true);
      setAgreedAt(d.consentedAt);
    } catch {
      setSubmitError('서버 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">동의서를 찾을 수 없습니다.</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const consentDateTime = agreed && agreedAt ? formatDate(agreedAt) : todayStr;

  if (isPrintMode) {
    return (
      <>
        <style>{`
          @page { size: A4; margin: 20mm 15mm; }
          body { margin: 0; font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @media print {
            .no-print { display: none !important; }
          }
        `}</style>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 8px', fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif" }}>
          <div style={{ borderBottom: '3px solid #e53e1e', paddingBottom: '12px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#666', margin: '0 0 4px 0' }}>주식회사이좋은사람들(ai인터넷.com)</p>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#1a1a1a', margin: 0 }}>인터넷 가입 사은품 지급 및 반환 동의서</h1>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '14px 16px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#666', marginBottom: '8px', marginTop: 0 }}>고객정보</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr>
                  <td style={{ color: '#888', width: '70px', paddingBottom: '4px' }}>고객명</td>
                  <td style={{ fontWeight: '700', color: '#111' }}>{data.name ?? '-'}</td>
                </tr>
                <tr>
                  <td style={{ color: '#888', paddingBottom: '4px' }}>연락처</td>
                  <td style={{ fontWeight: '700', color: '#111' }}>{data.phone ?? '-'}</td>
                </tr>
                <tr>
                  <td style={{ color: '#888' }}>동의일시</td>
                  <td style={{ fontWeight: '700', color: '#111' }}>{consentDateTime}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#444', marginBottom: '16px' }}>
            주식회사이좋은사람들(ai인터넷.com)은 고객님의 통신 서비스 가입을 축하 드리며, 사은품 지급과 관련하여 아래 내용에 대한 동의를 받고자 합니다. 아래 내용을 충분히 읽으신 후 동의해 주시기 바랍니다.
          </p>

          {[
            {
              title: '제1조 (사은품 지급 조건)',
              content: [
                '회사는 아래 두 가지 조건이 모두 충족된 경우에 한하여 고객님께 사은품을 현금으로 지급합니다.',
                '1호: 고객님이 가입하신 통신 서비스(인터넷, TV, 전화, cctv 등 가입 상품 전체)의 정상 개통이 완료된 경우',
                '2호: 고객님의 본 동의서의 전체 항목에 동의한 경우',
                '사은품 금액은 가입하신 통신사, 가입 상품 구성(인터넷/TV/전화/CCTV 등) 및 고객별 조건에 따라 전화 상담 시 약속된 금액으로 확정됩니다. 본 동의서 작성 완료 후 회사가 지정한 방법으로 위 금액이 지급됩니다.',
              ],
            },
            {
              title: '제2조 (사은품 반환 의무)',
              content: [
                '고객님은 가입 상품 개통 완료 처리일(개통일 당일 포함)로부터 1년(12개월) 이내에 아래 각 호에 해당하는 행위를 하는 경우, 지급받은 사은품 전액 또는 일부를 회사에 반환하여야 합니다.',
                '1호: 가입 상품(인터넷/TV/전화/CCTV 등) 중 1개 이상의 서비스 해지',
                '2호: 가입 상품 중 1개 이상의 서비스 일시정지',
                '3호: 가입 당시 계약한 상품의 임의 변경 (상위 상품으로의 변경 제외)',
                '4호: 가입 상품 전체 또는 일부의 명의 변경 (회사의 동의를 통해 명의변경 하는 경우 제외)',
                '가입 상품(인터넷/TV/전화/CCTV 등) 중 일부만 해지/정지/변경하는 경우에도 사은품 전액 또는 일부 반환 의무가 동일하게 적용됩니다.',
                '위 사유가 통신사 측 서비스 불가, 이사, 기타 불가피한 사정으로 인한 경우에도 사은품 반환 의무는 동일하게 적용됩니다. 단, 해당 사유로 인한 통신사 위약금은 고객센터 판단에 따라 고객님께 청구되지 않습니다.',
                '반환 의무 기산일은 통신사 개통 완료 처리일을 기준으로 하며, 개통일 당일을 포함하여 산정합니다.',
              ],
            },
            {
              title: '제3조 (반환 방법 및 기한)',
              content: ['사은품 반환은 고객님이 해지/정지/변경 신청을 한 즉시 회사가 지정하는 계좌로 현금 이체하는 방법으로 이루어집니다. 반환 계좌 정보는 반환 사유 발생 시 회사에서 별도 안내 드립니다.'],
            },
            {
              title: '제4조 (반환 불이행 시 조치)',
              content: ['고객님이 정당한 사유 없이 사은품 반환을 거부하거나 기한 내 이행하지 않을 경우, 회사는 민사상 청구 등 법적 절차를 진행할 수 있습니다.'],
            },
            {
              title: '제5조 (개인정보 활용 동의)',
              content: ['본 동의서 작성 및 보관을 위해 고객님의 성명, 연락처, 가입 정보가 활용됩니다. 수집된 개인정보는 사은품 지급 및 반환 관리 목적으로만 사용되며, 관련 법령에 따라 보관됩니다.'],
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#111', marginBottom: '6px', marginTop: 0 }}>{section.title}</p>
              {section.content.map((line, i) => (
                <p key={i} style={{ fontSize: '12px', lineHeight: '1.65', color: '#444', margin: '0 0 3px 8px' }}>{line}</p>
              ))}
            </div>
          ))}

          <div style={{ border: '1px solid #c3d9f0', borderRadius: '8px', padding: '14px 16px', backgroundColor: '#f0f7ff', marginTop: '16px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#1a5276', marginBottom: '8px', marginTop: 0 }}>동의 항목 체크리스트</p>
            {CHECKLIST.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                <span style={{ color: '#e53e1e', fontWeight: '700', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '11.5px', lineHeight: '1.55', color: '#333' }}>{i + 1}. {item}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '11px', color: '#999', marginBottom: '20px' }}>
            본 동의서는 전자적으로 작성 및 보관되며, 분쟁 발생 시 법적 증거로 활용될 수 있습니다. 동의 완료 후 PDF로 저장되어 AI인터넷(AI인터넷.com)에 보관됩니다.
          </p>

          <div style={{ borderTop: '2px solid #222', paddingTop: '16px', marginTop: '8px' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#111', marginBottom: '10px', marginTop: 0 }}>전자 서명 (동의 완료)</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <tbody>
                <tr>
                  <td style={{ color: '#555', width: '100px', paddingBottom: '8px' }}>서명자</td>
                  <td style={{ fontWeight: '700', color: '#111', borderBottom: '1px solid #333', paddingBottom: '8px' }}>{data.name ?? '-'}</td>
                </tr>
                <tr>
                  <td style={{ color: '#555', paddingTop: '8px' }}>동의일시</td>
                  <td style={{ fontWeight: '700', color: '#111', paddingTop: '8px' }}>{consentDateTime}</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: '11px', color: '#666', marginTop: '12px' }}>
              위 서명자는 본 동의서의 전체 내용을 확인하고 "동의합니다."를 입력하여 전자적으로 동의하였습니다.
            </p>
          </div>

          <div style={{ borderTop: '1px solid #eee', marginTop: '24px', paddingTop: '10px', textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: '#aaa', margin: 0 }}>© AI인터넷(ai인터넷.com) | 주식회사이좋은사람들 | 문서번호: CONSENT-{data.id}-{data.name}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary px-8 py-6 text-center">
            <p className="text-white/80 text-sm mb-1">주식회사이좋은사람들(ai인터넷.com)</p>
            <h1 className="text-2xl font-black text-white">인터넷 가입 사은품 지급 및 반환 동의서</h1>
          </div>

          <div className="px-8 py-6">
            <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
              <h2 className="text-sm font-bold text-gray-500 mb-3">고객정보</h2>
              <div className="space-y-1.5 text-sm">
                <div className="flex gap-4">
                  <span className="text-gray-500 w-16">고객명</span>
                  <span className="font-semibold text-gray-900">{data.name ?? '-'}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-16">연락처</span>
                  <span className="font-semibold text-gray-900">{data.phone ?? '-'}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-16">동의일시</span>
                  <span className="font-semibold text-gray-900">{consentDateTime}</span>
                </div>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 space-y-4 text-[14px] leading-relaxed">
              <p>
                주식회사이좋은사람들(ai인터넷.com)은 고객님의 통신 서비스 가입을 축하 드리며, 사은품 지급과 관련하여 아래 내용에 대한 동의를 받고자 합니다.
                아래 내용을 충분히 읽으신 후 동의해 주시기 바랍니다.
              </p>

              <Section title="제1조 (사은품 지급 조건)">
                <p>회사는 아래 두 가지 조건이 모두 충족된 경우에 한하여 고객님께 사은품을 현금으로 지급합니다.</p>
                <p>1호: 고객님이 가입하신 통신 서비스(인터넷, TV, 전화, cctv 등 가입 상품 전체)의 정상 개통이 완료된 경우</p>
                <p>2호: 고객님의 본 동의서의 전체 항목에 동의한 경우</p>
                <p>사은품 금액은 가입하신 통신사, 가입 상품 구성(인터넷/TV/전화/CCTV 등) 및 고객별 조건에 따라 전화 상담 시 약속된 금액으로 확정됩니다. 본 동의서 작성 완료 후 회사가 지정한 방법으로 위 금액이 지급됩니다.</p>
              </Section>

              <Section title="제2조 (사은품 반환 의무)">
                <p>고객님은 가입 상품 개통 완료 처리일(개통일 당일 포함)로부터 1년(12개월) 이내에 아래 각 호에 해당하는 행위를 하는 경우, 지급받은 사은품 전액 또는 일부를 회사에 반환하여야 합니다.</p>
                <p>1호: 가입 상품(인터넷/TV/전화/CCTV 등) 중 1개 이상의 서비스 해지</p>
                <p>2호: 가입 상품 중 1개 이상의 서비스 일시정지</p>
                <p>3호: 가입 당시 계약한 상품의 임의 변경 (상위 상품으로의 변경 제외)</p>
                <p>4호: 가입 상품 전체 또는 일부의 명의 변경 (회사의 동의를 통해 명의변경 하는 경우 제외)</p>
                <p>가입 상품(인터넷/TV/전화/CCTV 등) 중 일부만 해지/정지/변경하는 경우에도 사은품 전액 또는 일부 반환 의무가 동일하게 적용됩니다.</p>
                <p>위 사유가 통신사 측 서비스 불가, 이사, 기타 불가피한 사정으로 인한 경우에도 사은품 반환 의무는 동일하게 적용됩니다. 단, 해당 사유로 인한 통신사 위약금은 고객센터 판단에 따라 고객님께 청구되지 않습니다.</p>
                <p>반환 의무 기산일은 통신사 개통 완료 처리일을 기준으로 하며, 개통일 당일을 포함하여 산정합니다.</p>
              </Section>

              <Section title="제3조 (반환 방법 및 기한)">
                <p>사은품 반환은 고객님이 해지/정지/변경 신청을 한 즉시 회사가 지정하는 계좌로 현금 이체하는 방법으로 이루어집니다. 반환 계좌 정보는 반환 사유 발생 시 회사에서 별도 안내 드립니다.</p>
              </Section>

              <Section title="제4조 (반환 불이행 시 조치)">
                <p>고객님이 정당한 사유 없이 사은품 반환을 거부하거나 기한 내 이행하지 않을 경우, 회사는 민사상 청구 등 법적 절차를 진행할 수 있습니다.</p>
              </Section>

              <Section title="제5조 (개인정보 활용 동의)">
                <p>본 동의서 작성 및 보관을 위해 고객님의 성명, 연락처, 가입 정보가 활용됩니다. 수집된 개인정보는 사은품 지급 및 반환 관리 목적으로만 사용되며, 관련 법령에 따라 보관됩니다.</p>
              </Section>

              <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/50 mt-4">
                <h3 className="font-bold text-gray-800 mb-3">동의 항목 체크리스트</h3>
                <div className="space-y-2">
                  {CHECKLIST.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold text-base mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-sm text-gray-700">{i + 1}. {item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                본 동의서는 전자적으로 작성 및 보관되며, 분쟁 발생 시 법적 증거로 활용될 수 있습니다. 동의 완료 후 PDF로 저장되어 AI인터넷(AI인터넷.com)에 보관됩니다.
              </p>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              {agreed ? (
                <div className="rounded-xl bg-green-50 border border-green-200 px-6 py-5 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="font-bold text-green-700 text-lg mb-1">동의가 완료되었습니다.</p>
                  <p className="text-green-600 text-sm">동의일시: {agreedAt ? formatDate(agreedAt) : todayStr}</p>
                  <p className="text-gray-500 text-xs mt-2">전자 서명(동의 완료): {data.name ?? '-'}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-6 py-5">
                    <p className="text-sm font-semibold text-amber-800 mb-1">전자 서명 (동의 완료)</p>
                    <p className="text-xs text-amber-700 mb-4">
                      위 동의서의 모든 내용을 확인하셨다면 아래 입력란에{' '}
                      <strong className="text-amber-900">"동의합니다."</strong>를 입력해주세요.
                      <br />
                      웹페이지 내에서 '동의합니다.'를 입력하는 경우 위의 동의서에 동의한 것으로 간주합니다.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={confirmation}
                        onChange={e => setConfirmation(e.target.value)}
                        placeholder="동의합니다."
                        className="flex-1 px-4 py-3 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-sm transition-colors"
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={submitting || confirmation !== '동의합니다.'}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 whitespace-nowrap"
                      >
                        {submitting ? '처리 중...' : '동의 완료'}
                      </button>
                    </div>
                    {submitError && (
                      <p className="text-red-500 text-xs mt-2">{submitError}</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © AI인터넷(ai인터넷.com) | 주식회사이좋은사람들
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-bold text-gray-800 mt-5 mb-2">{title}</h3>
      <div className="space-y-1.5 pl-1">{children}</div>
    </div>
  );
}
