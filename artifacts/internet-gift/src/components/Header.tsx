import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

export function Header() {
  const [, setLocation] = useLocation();
  return (
    <header className="w-full bg-white border-b border-gray-100 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLocation('/')}
          className="flex items-center hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
          data-testid="logo-home"
        >
          <img src="/logo-trim.png" alt="AI인터넷" className="h-16 sm:h-20 w-auto object-contain" />
        </button>
        <a href="tel:16663233" className="flex flex-col leading-tight hover:opacity-80 transition-opacity">
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">가입상담 (연중무휴)</span>
          <span className="text-base sm:text-xl font-black text-primary whitespace-nowrap">1666-3233</span>
        </a>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        <Link href="/ai-quote" className="hidden sm:block">
          <Button className="bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 text-white font-bold rounded-full px-3 sm:px-4 border-none shadow-none text-xs sm:text-sm h-8 sm:h-9 flex items-center gap-1">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            AI 추천
          </Button>
        </Link>
        <Link href="/apply" className="hidden sm:block">
          <Button className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold rounded-full px-3 sm:px-5 border-none shadow-none text-xs sm:text-sm h-8 sm:h-9">
            신청서 작성
          </Button>
        </Link>
        <Link href="/event" className="hidden md:block">
          <Button className="bg-[#fab1a0] hover:bg-[#f19066] text-white font-bold rounded-full px-3 sm:px-5 shadow-none border-none text-xs sm:text-sm h-8 sm:h-9">
            이벤트
          </Button>
        </Link>
        <Link href="/tip" className="hidden md:block">
          <Button className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold rounded-full px-3 sm:px-5 border-none shadow-none text-xs sm:text-sm h-8 sm:h-9">
            꿀TIP
          </Button>
        </Link>
        <Link href="/review" className="hidden md:block">
          <Button className="bg-[#55efc4] hover:bg-[#00b894] text-white font-bold rounded-full px-3 sm:px-5 border-none shadow-none text-xs sm:text-sm h-8 sm:h-9">
            후기
          </Button>
        </Link>
      </div>
    </header>
  );
}
