import React from 'react';
import { useLocation } from 'wouter';

const TABS = [
  { label: 'LG유플러스', path: '/provider/lg', color: '#E5005A' },
  { label: 'SK브로드밴드', path: '/provider/sk', color: '#0064D2' },
  { label: 'KT', path: '/provider/kt', color: '#E30000' },
  { label: 'KT스카이라이프', path: '/provider/skylife', color: '#16A34A' },
  { label: 'LG헬로비전', path: '/provider/hellovision', color: '#7C3AED' },
  { label: '제휴카드', path: '/cards', color: '#374151' },
];

export function ISPNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="w-full bg-gray-50 border-b border-gray-200 sticky top-[88px] sm:static z-40">
      <div className="max-w-6xl mx-auto flex overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = location === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              data-testid={`nav-${tab.path.split('/').pop()}`}
              className="flex-shrink-0 sm:flex-1 py-3.5 px-4 sm:px-2 text-center font-black text-xs sm:text-lg whitespace-nowrap transition-colors"
              style={
                isActive
                  ? { backgroundColor: tab.color, color: '#fff', borderBottom: `2px solid ${tab.color}` }
                  : { color: '#1f2937' }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
