import React from 'react';
import { useLocation } from 'wouter';
import { Sparkles, Zap, FileText, Phone } from 'lucide-react';

export function MobileBottomNav() {
  const [, setLocation] = useLocation();

  return (
    <div
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t-2 border-gray-100"
    >
      <div className="grid grid-cols-4 h-16">

        <button
          onClick={() => setLocation('/ai-quote')}
          className="flex flex-col items-center justify-center gap-1 text-primary bg-white"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">AI 추천</span>
        </button>

        <a
          href="tel:16663233"
          className="flex flex-col items-center justify-center gap-1 text-green-600 bg-white"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-bold">전화상담</span>
        </a>

        <button
          onClick={() => setLocation('/apply')}
          className="flex flex-col items-center justify-center gap-1 text-orange-500 bg-white"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-bold">빠른견적</span>
        </button>

        <button
          onClick={() => setLocation('/apply')}
          className="flex flex-col items-center justify-center gap-1 bg-primary text-white"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">신청서작성</span>
        </button>

      </div>
    </div>
  );
}
