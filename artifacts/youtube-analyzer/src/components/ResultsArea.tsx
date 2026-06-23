import { useAppContext } from '@/contexts/AppContext';
import { VideoResult, formatKoreanNumber, formatChannelAge } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { KeyRound, SearchX, AlertCircle } from 'lucide-react';
import { useApiKey } from '@/hooks/use-api-key';

interface ResultsAreaProps {
  results: VideoResult[];
  isLoading: boolean;
  error: Error | null;
  hasSearched: boolean;
}

const GradeBadge = ({ grade }: { grade: string }) => {
  const colors = {
    S: 'bg-primary text-primary-foreground',
    A: 'bg-green-500/20 text-green-500 hover:bg-green-500/30',
    B: 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30',
    C: 'bg-muted text-muted-foreground',
  };
  return (
    <Badge variant="secondary" className={`font-bold ${colors[grade as keyof typeof colors] || colors.C}`}>
      {grade}등급
    </Badge>
  );
};

export function ResultsArea({ results, isLoading, error, hasSearched }: ResultsAreaProps) {
  const { viewMode } = useAppContext();
  const { apiKey } = useApiKey();

  if (!apiKey && !hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">API 키가 필요합니다</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          상단의 설정에서 YouTube Data API v3 키를 입력해주세요. <br />
          Google Cloud Console에서 무료로 발급받을 수 있습니다.
        </p>
      </div>
    );
  }

  if (!hasSearched && !isLoading && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">트렌드 검색 시작하기</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          상단 검색바에 키워드를 입력하고 검색을 시작하세요. <br />
          다양한 필터를 적용하여 원하는 영상을 찾을 수 있습니다.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-destructive">오류가 발생했습니다</h3>
        <p className="text-sm text-muted-foreground max-w-md break-words">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-muted-foreground">
        총 {isLoading ? '-' : results.length}개 영상
      </div>

      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-border bg-card">
                <Skeleton className="w-full aspect-video rounded-none" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">썸네일</TableHead>
                  <TableHead>제목 / 채널</TableHead>
                  <TableHead>조회수 / 참여율</TableHead>
                  <TableHead>구독자 / 채널나이</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="w-[120px] aspect-video" /></TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[250px] mb-2" />
                      <Skeleton className="h-3 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px] mb-2" />
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px] mb-2" />
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center px-4">
          <SearchX className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-1">검색 결과가 없습니다</h3>
          <p className="text-sm text-muted-foreground">
            필터 조건을 변경하거나 다른 검색어를 입력해보세요.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {results.map((video) => (
            <a 
              key={video.videoId} 
              href={`https://youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noreferrer"
              className="block group"
            >
              <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-colors h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <GradeBadge grade={video.grade} />
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 truncate">{video.channelName}</p>
                  
                  <div className="mt-auto space-y-2">
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">조회수</span>
                        <span className="font-mono">{formatKoreanNumber(video.viewCount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">참여율</span>
                        <span className="font-mono text-primary font-medium">{video.engagementRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">좋아요</span>
                        <span className="font-mono">{formatKoreanNumber(video.likeCount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">구독자</span>
                        <span className="font-mono">{formatKoreanNumber(video.subscriberCount)}</span>
                      </div>
                      <div className="col-span-2 flex justify-between border-t border-border pt-1 mt-1">
                        <span className="text-muted-foreground">채널 나이</span>
                        <span className="font-mono">{formatChannelAge(video.channelAgeMonths)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">썸네일</TableHead>
                  <TableHead className="min-w-[250px]">제목 / 채널</TableHead>
                  <TableHead className="text-right">조회수</TableHead>
                  <TableHead className="text-right">좋아요</TableHead>
                  <TableHead className="text-right">참여율</TableHead>
                  <TableHead className="text-right">구독자수</TableHead>
                  <TableHead className="text-right">채널나이</TableHead>
                  <TableHead className="text-center">등급</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((video) => (
                  <TableRow key={video.videoId} className="group hover:bg-muted/50 cursor-pointer" onClick={() => window.open(`https://youtube.com/watch?v=${video.videoId}`, '_blank')}>
                    <TableCell>
                      <div className="relative w-[120px] aspect-video rounded overflow-hidden bg-muted">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {video.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{video.channelName}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatKoreanNumber(video.viewCount)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatKoreanNumber(video.likeCount)}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-medium text-primary">{video.engagementRate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatKoreanNumber(video.subscriberCount)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatChannelAge(video.channelAgeMonths)}</TableCell>
                    <TableCell className="text-center"><GradeBadge grade={video.grade} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
