import { useAppContext, DEFAULT_FILTERS } from '@/contexts/AppContext';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, LayoutGrid, List } from 'lucide-react';
import { formatKoreanNumber } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { VideoResult } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface SidebarProps {
  currentResults: VideoResult[];
}

export function Sidebar({ currentResults }: SidebarProps) {
  const { filters, setFilters, viewMode, setViewMode, resetFilters } = useAppContext();

  const handleExport = () => {
    if (currentResults.length === 0) {
      toast({ title: '내보낼 데이터가 없습니다.' });
      return;
    }
    const data = currentResults.map(r => ({
      '제목': r.title,
      '채널명': r.channelName,
      '조회수': r.viewCount,
      '좋아요': r.likeCount,
      '댓글수': r.commentCount,
      '참여율(%)': r.engagementRate.toFixed(2),
      '구독자수': r.subscriberCount,
      '채널나이(개월)': r.channelAgeMonths,
      '성과등급': r.grade,
      'URL': `https://youtube.com/watch?v=${r.videoId}`
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "트렌드분석");
    XLSX.writeFile(wb, `YouTube_Trend_${new Date().getTime()}.xlsx`);
  };

  return (
    <aside className="w-[260px] border-r border-border bg-card flex flex-col h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold">필터</h2>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs h-7">
          초기화
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* 구독자 수 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-muted-foreground">구독자 수</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sub-all" 
                checked={filters.subscriberCount[0] === 0 && filters.subscriberCount[1] === 100000000}
                onCheckedChange={(checked) => {
                  if (checked) setFilters(f => ({ ...f, subscriberCount: [0, 100000000] }));
                }}
              />
              <label htmlFor="sub-all" className="text-[10px] text-muted-foreground leading-none">전체</label>
            </div>
          </div>
          <Slider 
            defaultValue={[0, 100]} 
            max={10000000} 
            step={10000} 
            value={filters.subscriberCount}
            onValueChange={(val) => setFilters(f => ({ ...f, subscriberCount: val as [number, number] }))}
            className="my-4"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>{formatKoreanNumber(filters.subscriberCount[0])}</span>
            <span>{formatKoreanNumber(filters.subscriberCount[1])}+</span>
          </div>
        </div>

        {/* 조회수 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-muted-foreground">조회수</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="view-all" 
                checked={filters.viewCount[0] === 0 && filters.viewCount[1] === 100000000}
                onCheckedChange={(checked) => {
                  if (checked) setFilters(f => ({ ...f, viewCount: [0, 100000000] }));
                }}
              />
              <label htmlFor="view-all" className="text-[10px] text-muted-foreground leading-none">전체</label>
            </div>
          </div>
          <Slider 
            max={50000000} 
            step={10000} 
            value={filters.viewCount}
            onValueChange={(val) => setFilters(f => ({ ...f, viewCount: val as [number, number] }))}
            className="my-4"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>{formatKoreanNumber(filters.viewCount[0])}</span>
            <span>{formatKoreanNumber(filters.viewCount[1])}+</span>
          </div>
        </div>

        {/* 참여율 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-muted-foreground">참여율 (%)</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="eng-all" 
                checked={filters.engagementRate[0] === 0 && filters.engagementRate[1] === 100}
                onCheckedChange={(checked) => {
                  if (checked) setFilters(f => ({ ...f, engagementRate: [0, 100] }));
                }}
              />
              <label htmlFor="eng-all" className="text-[10px] text-muted-foreground leading-none">전체</label>
            </div>
          </div>
          <Slider 
            max={100} 
            step={0.5} 
            value={filters.engagementRate}
            onValueChange={(val) => setFilters(f => ({ ...f, engagementRate: val as [number, number] }))}
            className="my-4"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>{filters.engagementRate[0].toFixed(1)}%</span>
            <span>{filters.engagementRate[1].toFixed(1)}%</span>
          </div>
        </div>

        {/* 채널 나이 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-semibold text-muted-foreground">채널 나이 (개월)</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="age-all" 
                checked={filters.channelAgeMonths[0] === 0 && filters.channelAgeMonths[1] === 240}
                onCheckedChange={(checked) => {
                  if (checked) setFilters(f => ({ ...f, channelAgeMonths: [0, 240] }));
                }}
              />
              <label htmlFor="age-all" className="text-[10px] text-muted-foreground leading-none">전체</label>
            </div>
          </div>
          <Slider 
            max={240} 
            step={1} 
            value={filters.channelAgeMonths}
            onValueChange={(val) => setFilters(f => ({ ...f, channelAgeMonths: val as [number, number] }))}
            className="my-4"
          />
          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>{filters.channelAgeMonths[0]}개월</span>
            <span>{filters.channelAgeMonths[1]}개월+</span>
          </div>
        </div>

        {/* 성과등급 */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">성과등급</Label>
          <Select value={filters.grade} onValueChange={(val) => setFilters(f => ({ ...f, grade: val }))}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="등급 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="S">S 등급 (≥5%)</SelectItem>
              <SelectItem value="A">A 등급 (3~5%)</SelectItem>
              <SelectItem value="B">B 등급 (1~3%)</SelectItem>
              <SelectItem value="C">C 등급 (&lt;1%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      <div className="p-4 border-t border-border bg-muted/20 space-y-3">
        <div className="flex bg-background rounded-md p-1 border border-border">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            className="flex-1 h-8"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
            className="flex-1 h-8"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
        <Button className="w-full" variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          엑셀 내보내기
        </Button>
      </div>
    </aside>
  );
}
