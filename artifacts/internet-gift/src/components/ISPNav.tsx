import React from 'react';
import { useLocation } from 'wouter';

const TABS = [
  { label: 'SK브로드밴드', path: '/provider/sk' },
  { label: 'KT', path: '/provider/kt' },
  { label: 'LG유플러스', path: '/provider/lg' },
  { label: 'KT스카이라이프', path: '/provider/skylife' },
  { label: 'LG헬로비전', path: '/provider/hellovision' },
  { label: '제휴카드', path: '/provider/card' },
];

export function ISPNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="w-full bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center">
        {TABS.map((tab) => {
          const isActive = location === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              data-testid={`nav-${tab.path.split('/').pop()}`}
              className={`flex-1 py-4 text-center font-bold text-sm transition-colors hover:bg-gray-100 hover:text-primary ${
                isActive
                  ? 'text-white bg-primary border-b-2 border-primary'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
