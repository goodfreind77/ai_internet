import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">AI인터넷</h4>
            <p className="text-sm leading-relaxed mb-4">
              고객님의 통신비 절감을 위해 최선을 다하겠습니다.
            </p>
            <a href="tel:1666-3233" className="font-bold text-3xl text-primary hover:underline">1666-3233</a>
          </div>

          <div className="text-sm space-y-2">
            <p><strong>상호명:</strong> 주식회사 이좋은사람들 | <strong>대표자:</strong> 이미선</p>
            <p><strong>사업자등록번호:</strong> 813-88-00632 | <strong>통신판매업신고번호:</strong> 제2019-인천미추홀-0455호</p>
            <p><strong>주소:</strong> 인천 미추홀구 주안로70 301호</p>
            <p><strong>개인정보보호책임자:</strong> 이미선 (msjs0416@nate.com)</p>
          </div>

          <div className="flex flex-col items-start justify-center">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-300 rounded-full px-6 py-3 text-sm font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              AI인터넷 문서
            </a>
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
  );
}
