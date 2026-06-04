import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

export function Header() {
  const [, setLocation] = useLocation();
  return (
    <header className="w-full bg-white border-b border-gray-100 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <button
        onClick={() => setLocation('/')}
        className="flex items-center hover:opacity-80 transition-opacity cursor-pointer flex-shrink-0"
        data-testid="logo-home"
      >
        <img src="/logo-trim.png" alt="AI인터넷" className="h-16 sm:h-20 w-auto object-contain" />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
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
