import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Sparkles, Zap, FileText, Phone, X } from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';

export function MobileBottomNav() {
  const [, setLocation] = useLocation();
  const [showQuote, setShowQuote] = useState(false);

  return (
    <>
      {/* 빠른견적 모달 */}
      {showQuote && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:hidden"
          onClick={() => setShowQuote(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-h-[90vh] overflow-y-auto rounded-t-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQuote(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <ConsultationForm onSuccess={() => setShowQuote(false)} />
          </div>
        </div>
      )}

      {/* 하단 네비게이션 바 */}
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
            onClick={() => setShowQuote(true)}
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
    </>
  );
}
