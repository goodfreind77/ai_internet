import React from 'react';
import { Phone } from 'lucide-react';
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
        <img src="/logo.png" alt="AI인터넷" className="h-12 sm:h-16 w-auto object-contain" />
      </button>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        <Link href="/apply">
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

        <a href="tel:1666-3233" className="hidden md:block ml-2 pl-4 border-l border-gray-200 flex-shrink-0 hover:opacity-80 transition-opacity">
          <span className="text-xs text-gray-500 block mb-0.5 font-medium">가입상담 (연중무휴)</span>
          <span className="text-xl font-black text-primary whitespace-nowrap">1666-3233</span>
        </a>

        <a href="tel:1666-3233" className="md:hidden flex-shrink-0">
          <Button className="bg-primary text-white font-bold rounded-full px-3 border-none shadow-none text-xs h-8 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            1666-3233
          </Button>
        </a>
      </div>
    </header>
  );
}
