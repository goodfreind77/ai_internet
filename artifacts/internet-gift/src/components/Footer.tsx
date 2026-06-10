import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">

        {/* 상단: 전화번호 + 문서 버튼 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-gray-700 mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 mb-1">가입 신청하기 (연중무휴)</span>
            <a href="tel:1666-3233" className="font-black text-4xl text-primary hover:underline tracking-tight">
              1666-3233
            </a>
            <span className="text-sm text-gray-500 mt-1">평일 오전 9시 ~ 오후 7시 (토요일·공휴일 포함 연중무휴)</span>
          </div>

          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 border border-gray-500 text-gray-300 hover:text-white hover:border-gray-300 rounded-full px-5 py-3 text-sm font-semibold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            AI인터넷 문서
          </a>
        </div>

        {/* 하단: 링크 + 사업자 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col gap-2 text-sm">
            <a href="/" className="hover:text-white transition-colors">인터넷 가격비교</a>
            <a href="/cards" className="hover:text-white transition-colors">제휴카드 혜택</a>
            <a href="/tips" className="hover:text-white transition-colors">꿀TIP</a>
            <a href="/reviews" className="hover:text-white transition-colors">후기</a>
          </div>
          <div className="col-span-2 text-sm space-y-1.5">
            <p><strong className="text-gray-300">상호명:</strong> 주식회사 이좋은사람들 | <strong className="text-gray-300">대표자:</strong> 이미선</p>
            <p><strong className="text-gray-300">사업자등록번호:</strong> 813-88-00632 | <strong className="text-gray-300">통신판매업신고번호:</strong> 제2019-인천미추홀-0455호</p>
            <p><strong className="text-gray-300">주소:</strong> 인천 미추홀구 주안로70 301호</p>
            <p><strong className="text-gray-300">개인정보보호책임자:</strong> 이미선 (msjs0416@nate.com)</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 text-xs text-center space-y-1">
          <p>본 사이트는 방통위 사전승낙서를 취득한 공식 대리점입니다. 사은품 지급 금액은 관련 법령(경품고시제)을 준수합니다.</p>
          <p>© {new Date().getFullYear()} AI인터넷. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
