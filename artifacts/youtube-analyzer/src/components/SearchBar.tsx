import { Button } from '@/components/ui/button';
import { SearchQuery } from '@/hooks/use-youtube';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: SearchQuery) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('KR');
  const [period, setPeriod] = useState('any');
  const [duration, setDuration] = useState('any');
  const [sort, setSort] = useState('relevance');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch({ keyword, region, period, duration, sort });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 bg-card p-4 rounded-lg border border-border shadow-sm mb-6">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력하세요..." 
          className="pl-9 bg-background"
        />
      </div>

      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger className="w-[120px] bg-background">
          <SelectValue placeholder="지역" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="KR">한국</SelectItem>
          <SelectItem value="US">미국</SelectItem>
          <SelectItem value="JP">일본</SelectItem>
          <SelectItem value="GB">영국</SelectItem>
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="w-[120px] bg-background">
          <SelectValue placeholder="기간" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">무제한</SelectItem>
          <SelectItem value="today">오늘</SelectItem>
          <SelectItem value="week">이번 주</SelectItem>
          <SelectItem value="month">이번 달</SelectItem>
          <SelectItem value="year">올해</SelectItem>
        </SelectContent>
      </Select>

      <Select value={duration} onValueChange={setDuration}>
        <SelectTrigger className="w-[120px] bg-background">
          <SelectValue placeholder="영상 길이" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">전체</SelectItem>
          <SelectItem value="short">짧은 영상(&lt;4분)</SelectItem>
          <SelectItem value="medium">중간(4~20분)</SelectItem>
          <SelectItem value="long">긴 영상(&gt;20분)</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-[120px] bg-background">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">관련성</SelectItem>
          <SelectItem value="date">날짜</SelectItem>
          <SelectItem value="viewCount">조회수</SelectItem>
          <SelectItem value="rating">평점</SelectItem>
        </SelectContent>
      </Select>

      <Button type="submit" disabled={isLoading || !keyword.trim()} className="min-w-[80px]">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : '검색'}
      </Button>
    </form>
  );
}
