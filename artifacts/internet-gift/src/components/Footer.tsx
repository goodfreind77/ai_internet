import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-white font-bold text-lg mb-4">AI인터넷</h4>
            <p className="text-sm leading-relaxed mb-4">
              고객님의 통신비 절감을 위해 최선을 다하겠습니다.<br/>
              업계 최대 현금 사은품 당일 지급 원칙!
            </p>
            <a href="tel:1666-3233" className="font-bold text-xl text-primary hover:underline">1666-3233</a>
          </div>
          
          <div className="col-span-2">
            <div className="text-sm space-y-2">
              <p><strong>상호명:</strong> 주식회사 이좋은사람들 | <strong>대표자:</strong> 이미선</p>
              <p><strong>사업자등록번호:</strong> 813-88-00631 | <strong>통신판매업신고번호:</strong> 제2019-인천미추홀-0455호</p>
              <p><strong>주소:</strong> 인천 미추홀구 주안로70 301호</p>
              <p><strong>개인정보보호책임자:</strong> 이미선 (msjs0416@nate.com)</p>
            </div>
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
