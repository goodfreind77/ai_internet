export function MidnightGold() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#f9fafb' }}>
      {/* Benefits section */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: '#fef9c3', color: '#854d0e' }}>AI인터넷 선택 이유</div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">왜 AI인터넷을 선택해야 할까요?</h2>
            <p className="text-amber-500 text-base">10년 이상의 노하우로 고객님께 최고의 혜택을 찾아드립니다.</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: '🚀', title: '빠른 설치', desc: '신청 당일 즉시 설치 가능' },
              { icon: '💰', title: '최대 지원금', desc: '업계 최고 수준 현금 사은품' },
              { icon: '🛡️', title: '정식 대리점', desc: '방통위 사전승낙 공식 센터' },
              { icon: '📞', title: '365일 상담', desc: '연중무휴 전문 상담사 대기' },
            ].map((b, i) => (
              <div key={i} className="rounded-2xl p-5 text-center border-l-4 bg-gray-50" style={{ borderLeftColor: '#f59e0b' }}>
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{b.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ISP Plans section */}
      <section className="py-16 px-8" style={{ background: 'linear-gradient(160deg, #111827 0%, #1f2937 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-[11px] font-bold px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(245,158,11,0.2)', color: '#fcd34d' }}>BEST PLANS</div>
            <h2 className="text-3xl font-black text-white mb-2">통신사별 베스트 요금제</h2>
            <p className="text-sm" style={{ color: '#9ca3af' }}>가장 많이 가입하는 인기 요금제입니다.</p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { name: 'SK브로드밴드', plan: '기가라이트 500M', price: '39,400', color: '#F97316', badge: '' },
              { name: 'KT', plan: '인터넷베이직 500M', price: '39,600', color: '#D97706', badge: '' },
              { name: 'LG유플러스', plan: '와이파이기본 500M', price: '34,100', color: '#DC2626', badge: '가장인기!' },
              { name: 'KT스카이라이프', plan: '와이파이 100M+TV', price: '22,000', color: '#059669', badge: '' },
              { name: 'LG헬로비전', plan: '광랜라이트 100M', price: '29,530', color: '#7C3AED', badge: '' },
            ].map((plan, i) => (
              <div key={i} className="rounded-2xl p-4 shadow-xl relative" style={{ background: '#1f2937', border: '1px solid #374151' }}>
                {plan.badge && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: '#f59e0b', color: '#111827' }}>{plan.badge}</div>
                )}
                <p className="text-[11px] font-bold mb-1" style={{ color: '#9ca3af' }}>{plan.name}</p>
                <p className="text-xs font-semibold mb-3 leading-tight text-white">{plan.plan}</p>
                <div className="border-t pt-2" style={{ borderColor: '#374151' }}>
                  <p className="text-[10px]" style={{ color: '#6b7280' }}>월정액</p>
                  <p className="text-base font-black" style={{ color: plan.color }}>월 {plan.price}원</p>
                </div>
                <div className="mt-3 flex gap-1">
                  <button className="flex-1 text-[10px] py-1 rounded-lg font-semibold" style={{ border: '1px solid #374151', color: '#d1d5db', background: 'transparent' }}>자세히</button>
                  <button className="flex-1 text-white text-[10px] py-1 rounded-lg font-semibold" style={{ background: plan.color }}>신청</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[11px]" style={{ color: '#6b7280' }}>※ 3년약정, 휴대폰 1회선 결합 할인 기준, VAT포함가</p>
        </div>
      </section>

      {/* Label */}
      <div className="py-4 px-8 text-center" style={{ background: '#111827' }}>
        <span className="font-bold text-sm" style={{ color: '#fcd34d' }}>✨ 미드나잇 골드 테마</span>
        <span className="text-xs ml-2" style={{ color: '#6b7280' }}>— 고급스럽고 세련된 프리미엄 느낌</span>
      </div>
    </div>
  );
}
