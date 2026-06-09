export function DeepBlue() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Benefits section */}
      <section className="py-16 px-8" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3">AI인터넷 선택 이유</div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">왜 AI인터넷을 선택해야 할까요?</h2>
            <p className="text-blue-400 text-base">10년 이상의 노하우로 고객님께 최고의 혜택을 찾아드립니다.</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: '🚀', title: '빠른 설치', desc: '신청 당일 즉시 설치 가능' },
              { icon: '💰', title: '최대 지원금', desc: '업계 최고 수준 현금 사은품' },
              { icon: '🛡️', title: '정식 대리점', desc: '방통위 사전승낙 공식 센터' },
              { icon: '📞', title: '365일 상담', desc: '연중무휴 전문 상담사 대기' },
            ].map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 text-center">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISP Plans section */}
      <section className="py-16 px-8" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #0ea5e9 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">BEST PLANS</div>
            <h2 className="text-3xl font-black text-white mb-2">통신사별 베스트 요금제</h2>
            <p className="text-blue-200 text-sm">가장 많이 가입하는 인기 요금제입니다.</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: 'SK브로드밴드', plan: '기가라이트 500M', price: '39,400', color: '#F97316', badge: '' },
              { name: 'KT', plan: '인터넷베이직 500M', price: '39,600', color: '#D97706', badge: '' },
              { name: 'LG유플러스', plan: '와이파이기본 500M', price: '34,100', color: '#DC2626', badge: '가장인기!' },
              { name: 'KT스카이라이프', plan: '와이파이 100M+TV', price: '22,000', color: '#059669', badge: '' },
              { name: 'LG헬로비전', plan: '광랜라이트 100M', price: '29,530', color: '#7C3AED', badge: '' },
            ].map((plan, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-lg relative">
                {plan.badge && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{plan.badge}</div>
                )}
                <p className="text-[11px] font-bold text-gray-400 mb-1">{plan.name}</p>
                <p className="text-xs font-semibold text-gray-700 mb-3 leading-tight">{plan.plan}</p>
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-[10px] text-gray-400 line-through">정가</p>
                  <p className="text-base font-black" style={{ color: plan.color }}>월 {plan.price}원</p>
                </div>
                <div className="mt-3 flex gap-1">
                  <button className="flex-1 border text-[10px] py-1 rounded-lg font-semibold text-gray-600">자세히</button>
                  <button className="flex-1 text-white text-[10px] py-1 rounded-lg font-semibold" style={{ background: plan.color }}>신청</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px] text-blue-200">※ 3년약정, 휴대폰 1회선 결합 할인 기준, VAT포함가</p>
        </div>
      </section>

      {/* Label */}
      <div className="bg-blue-50 py-4 px-8 text-center">
        <span className="text-blue-700 font-bold text-sm">💙 딥 오션 블루 테마</span>
        <span className="text-blue-400 text-xs ml-2">— 신뢰감 있고 시원한 통신 느낌</span>
      </div>
    </div>
  );
}
