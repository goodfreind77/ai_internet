import React from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

export function Header() {
  const [, setLocation] = useLocation();
  return (
    <header className="w-full bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <button
        onClick={() => setLocation('/')}
        className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
        data-testid="logo-home"
      >
        <Gift className="w-7 h-7 text-primary" />
        <span>인터넷 사은품</span>
      </button>
      
      <div className="flex items-center gap-3">
        <Button className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold rounded-full px-5 border-none shadow-none">신청서 작성</Button>
        <Link href="/event">
          <Button className="bg-[#fab1a0] hover:bg-[#f19066] text-white font-bold rounded-full px-5 shadow-none border-none">이벤트</Button>
        </Link>
        <Button className="bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold rounded-full px-5 border-none shadow-none">꿀TIP</Button>
        <Button className="bg-[#55efc4] hover:bg-[#00b894] text-white font-bold rounded-full px-5 border-none shadow-none">후기</Button>
        
        <div className="ml-4 pl-4 border-l border-gray-200">
          <span className="text-xs text-gray-500 block mb-1 font-medium">가입상담 (연중무휴)</span>
          <span className="text-2xl font-black text-primary">010-8475-7854</span>
        </div>
      </div>
    </header>
  );
}
