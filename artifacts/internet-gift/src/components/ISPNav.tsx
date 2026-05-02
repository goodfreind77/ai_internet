import React from 'react';

export function ISPNav() {
  const tabs = ["SK브로드밴드", "KT", "LG유플러스", "KT스카이라이프", "LG헬로비전", "제휴카드"];

  return (
    <nav className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`flex-1 py-4 text-center font-bold text-sm transition-colors hover:bg-gray-100 hover:text-primary ${
              idx === 0 ? 'text-primary border-b-2 border-primary bg-white' : 'text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}
