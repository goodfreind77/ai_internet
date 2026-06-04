import React from 'react';
import { useLocation } from 'wouter';
import { Sparkles, FileText, Phone } from 'lucide-react';

export function MobileBottomNav() {
  const [, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-3 h-16">

        {/* AI 추천 */}
        <button
          onClick={() => setLocation('/ai-quote')}
          className="flex flex-col items-center justify-center gap-1 text-primary active:bg-primary/5 transition-colors"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[11px] font-bold">AI 추천</span>
        </button>

        {/* 신청서 — 중앙 강조 */}
        <button
          onClick={() => setLocation('/apply')}
          className="flex flex-col items-center justify-center gap-1 relative"
        >
          <div className="absolute -top-5 w-14 h-14 rounded-full bg-primary flex flex-col items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-[11px] font-bold text-primary mt-6">신청서</span>
        </button>

        {/* 전화 */}
        <a
          href="tel:16663233"
          className="flex flex-col items-center justify-center gap-1 text-green-600 active:bg-green-50 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[11px] font-bold">전화상담</span>
        </a>

      </div>
    </div>
  );
}
