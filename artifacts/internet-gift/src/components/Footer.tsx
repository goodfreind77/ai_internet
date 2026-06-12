import React, { useState } from 'react';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-black text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-sm text-gray-700 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function TermsContent() {
  return (
    <>
      <h3 className="font-bold text-base text-gray-900">서비스 이용약관</h3>

      <div>
        <p className="font-semibold mb-1">제 1 장 총칙</p>
        <p className="font-semibold mb-1">제 1 조 (목적)</p>
        <p>이 약관은 주식회사 이좋은사람들(이하 "회사"라 한다)이 운영하는 AI인터넷 온라인 서비스(이하 "서비스"라 한다)를 이용함에 있어 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
      </div>

      <div>
        <p className="font-semibold mb-1">제 2 조 (약관의 효력 및 변경)</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>이 약관은 홈페이지에 게시함으로써 효력을 발생합니다.</li>
          <li>회사는 합리적인 사유가 있는 경우 법령에 위배되지 않는 범위 내에서 약관을 변경할 수 있습니다.</li>
          <li>회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있으며, 계속 이용 시 동의한 것으로 간주됩니다.</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 3 조 (약관 외 준칙)</p>
        <p>이 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법 등 관계법령에 따릅니다.</p>
      </div>

      <div>
        <p className="font-semibold mb-1">제 4 조 (용어의 정의)</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>"이용자"란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 사람을 말합니다.</li>
          <li>"회원"이란 이용약관에 동의한 후 가입한 사람을 말합니다.</li>
          <li>"서비스해지"란 회사 또는 회원이 서비스 개시 후 이용계약을 해지하는 것을 말합니다.</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 5 조 (개인정보 보호정책)</p>
        <p>회사는 관계법령이 정하는 바에 따라 회원의 개인정보를 보호하고 존중합니다. 회원의 개인정보는 서비스 제공을 위한 목적으로만 사용됩니다.</p>
      </div>

      <div>
        <p className="font-semibold mb-1">제 2 장 서비스 가입신청</p>
        <p className="font-semibold mb-1">제 6 조 (회원가입)</p>
        <p>이용자는 회사가 정한 양식에 따라 회원정보를 기입한 후 이 약관에 동의함으로써 회원 가입을 신청합니다. 다음의 경우 가입이 제한될 수 있습니다.</p>
        <ul className="list-disc ml-5 space-y-1 mt-1">
          <li>실명이 아니거나 타인명의를 이용한 경우</li>
          <li>필요한 사항을 허위로 기재하거나 오기가 있는 경우</li>
          <li>기타 회사가 합리적인 판단에 의하여 필요하다고 인정하는 경우</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 3 장 회사와 회원의 의무</p>
        <p className="font-semibold mb-1">제 7 조 (회사의 의무)</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>회사는 특별한 사정이 없는 한 신청한 서비스 제공 개시일에 서비스를 이용할 수 있도록 합니다.</li>
          <li>설비에 장애가 생긴 때에는 지체 없이 수리복구합니다.</li>
          <li>회원의 정당한 불만이 있는 경우 적절한 절차를 거쳐 처리합니다.</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 8 조 (회원의 의무)</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>회원은 관계법령 및 이 약관의 규정을 준수하여야 합니다.</li>
          <li>아이디와 비밀번호의 관리 책임은 회원에게 있습니다.</li>
          <li>회사의 사전승낙 없이 서비스를 이용한 광고·영업 활동을 할 수 없습니다.</li>
          <li>다른 회원의 개인정보를 무단 수집·저장하는 행위를 금지합니다.</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 pt-2">© {new Date().getFullYear()} 주식회사 이좋은사람들 All rights reserved.</p>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <h3 className="font-bold text-base text-gray-900">개인정보처리방침</h3>

      <div>
        <p className="font-semibold mb-1">제 1 조 (개인정보의 처리목적)</p>
        <p>주식회사 이좋은사람들(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다.</p>
        <ul className="list-disc ml-5 space-y-1 mt-1">
          <li>회원가입, 서비스 신청, 본인인증, 홍보·프로모션 제공</li>
          <li>계약 유지여부 확인 및 사은품 반환사유 발생 시 반환절차 이행</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 2 조 (수집하는 개인정보의 항목 및 보유기간)</p>
        <p>수집 항목:</p>
        <ul className="list-disc ml-5 space-y-1 mt-1">
          <li>성명, 생년월일, 휴대폰번호, 이메일, 주소</li>
          <li>사용료 자동이체 및 사은품 지급을 위한 계좌 관련 정보</li>
        </ul>
        <p className="mt-2"><span className="font-medium">보유 및 이용기간:</span> 개인정보 수집일로부터 3년. 단, 사은품 반환사유가 있을 경우 반환절차 완료 시까지.</p>
      </div>

      <div>
        <p className="font-semibold mb-1">제 3 조 (개인정보의 파기절차 및 방법)</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>개인정보 보유기간 경과 또는 처리목적 달성 시 지체 없이 파기합니다.</li>
          <li>전자적 파일 형태는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
          <li>법령에 따라 보존이 필요한 경우 별도 DB로 분리 보관합니다.</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 4 조 (정보주체의 권리·의무)</p>
        <p>정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 서면, 전자우편 등을 통하여 요청하시면 지체 없이 조치합니다.</p>
      </div>

      <div>
        <p className="font-semibold mb-1">제 5 조 (개인정보의 안전성 확보조치)</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>개인정보 접근권한 부여·변경·말소를 통한 접근 통제</li>
          <li>접속기록 최소 1년 이상 보관 및 위변조 방지</li>
          <li>비밀번호 암호화 저장 및 중요 데이터 암호화</li>
          <li>해킹·바이러스 대비 보안프로그램 설치 및 주기적 점검</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 6 조 (쿠키의 운영)</p>
        <p>회사는 맞춤 서비스 제공을 위해 쿠키를 사용합니다. 브라우저 설정(도구 &gt; 인터넷 옵션 &gt; 개인정보)을 통해 쿠키 저장을 거부할 수 있으며, 거부 시 일부 서비스 이용에 제약이 있을 수 있습니다.</p>
      </div>

      <div>
        <p className="font-semibold mb-1">제 7 조 (개인정보 보호책임자)</p>
        <ul className="list-none space-y-0.5 ml-2">
          <li>성명: 김정수</li>
          <li>직책: 개인정보 보호책임자</li>
          <li>연락처: 1666-3233</li>
        </ul>
      </div>

      <div>
        <p className="font-semibold mb-1">제 8 조 (권익침해 구제방법)</p>
        <p>개인정보침해로 인한 구제를 받기 위해 아래 기관에 문의하실 수 있습니다.</p>
        <ul className="list-disc ml-5 space-y-1 mt-1">
          <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
          <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
          <li>대검찰청: 1301 (www.spo.go.kr)</li>
          <li>경찰청: 182 (ecrm.cyber.go.kr)</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 pt-2">본 개인정보처리방침은 2024년 10월 1일부터 적용됩니다.</p>
    </>
  );
}

const DOCS = [
  { label: '사업자등록증', file: '사업자등록증.pdf', image: '/doc-images/사업자등록증-1.png' },
  { label: '사전승낙서', file: '사전승락서.pdf', image: '/doc-images/사전승락서-1.png' },
  { label: '전화권유판매업신고증', file: '전화권유판매업신고증.pdf', image: '/doc-images/전화권유판매업신고증-1.png' },
  { label: '통신판매업신고증', file: '통신판매업신고증.pdf', image: '/doc-images/통신판매업신고증-1.png' },
];

function DocsModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-5xl"
        style={{ height: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0">
          <h2 className="text-lg font-black text-gray-900">AI인터넷 공식 문서</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="w-48 flex-shrink-0 border-r bg-gray-50 p-3 space-y-1">
            {DOCS.map((doc, i) => (
              <button
                key={doc.file}
                onClick={() => setSelected(i)}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  selected === i
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span className="leading-tight">{doc.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 flex-shrink-0">
              <span className="text-sm font-semibold text-gray-700">{DOCS[selected].label}</span>
              <a
                href={`/docs/${DOCS[selected].file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                PDF 다운로드
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </a>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-100 flex items-start justify-center p-4">
              <img
                key={DOCS[selected].image}
                src={DOCS[selected].image}
                alt={DOCS[selected].label}
                className="max-w-full shadow-lg rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [modal, setModal] = useState<'terms' | 'privacy' | 'docs' | null>(null);

  return (
    <>
      {modal === 'terms' && (
        <Modal title="서비스 이용약관" onClose={() => setModal(null)}>
          <TermsContent />
        </Modal>
      )}
      {modal === 'privacy' && (
        <Modal title="개인정보처리방침" onClose={() => setModal(null)}>
          <PrivacyContent />
        </Modal>
      )}
      {modal === 'docs' && <DocsModal onClose={() => setModal(null)} />}

      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-3">AI인터넷</h4>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4 text-sm">
                <a href="/" className="text-gray-300 hover:text-white transition-colors">인터넷 가격비교</a>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setModal('terms')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  이용약관
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setModal('privacy')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  개인정보처리방침
                </button>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                고객님의 통신비 절감을 위해 최선을 다하겠습니다.
              </p>
              <a href="tel:1666-3233" className="font-bold text-3xl text-primary hover:underline">1666-3233</a>
            </div>

            <div className="text-sm space-y-2">
              <p><strong>상호명:</strong> 주식회사 이좋은사람들 | <strong>대표자:</strong> 이미선</p>
              <p><strong>사업자등록번호:</strong> 813-88-00632 | <strong>통신판매업신고번호:</strong> 제2019-인천미추홀-0455호</p>
              <p><strong>주소:</strong> 인천 미추홀구 주안로70 301호</p>
              <p><strong>개인정보보호책임자:</strong> 김정수</p>
            </div>

            <div className="flex flex-col items-start justify-center">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">공식 문서</p>
              <button
                onClick={() => setModal('docs')}
                className="inline-flex items-center gap-2 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-300 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                AI인터넷 문서보기
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-xs text-center">
            <p className="mb-2">
              본 사이트는 방통위 사전승낙서를 취득한 공식 대리점입니다.
              사은품 지급 금액은 관련 법령(경품고시제)을 준수합니다.
            </p>
            <p>© {new Date().getFullYear()} AI인터넷. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
