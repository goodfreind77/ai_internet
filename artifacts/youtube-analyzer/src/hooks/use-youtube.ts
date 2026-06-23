import { useQuery } from '@tanstack/react-query';
import { VideoResult, calculateGrade } from '@/lib/utils';
import { differenceInMonths } from 'date-fns';

export interface SearchQuery {
  keyword: string;
  region: string;
  period: string;
  duration: string;
  sort: string;
}

const getPublishedAfter = (period: string) => {
  const now = new Date();
  switch (period) {
    case 'today':
      now.setDate(now.getDate() - 1);
      break;
    case 'week':
      now.setDate(now.getDate() - 7);
      break;
    case 'month':
      now.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      now.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return undefined;
  }
  return now.toISOString();
};

export function useYouTubeSearch(apiKey: string, query: SearchQuery | null) {
  return useQuery({
    queryKey: ['youtube-search', query],
    queryFn: async (): Promise<VideoResult[]> => {
      if (!apiKey) throw new Error('API Key가 없습니다.');
      if (!query?.keyword) return [];

      // 1. Search Videos
      const searchParams = new URLSearchParams({
        part: 'snippet',
        q: query.keyword,
        type: 'video',
        regionCode: query.region,
        maxResults: '50',
        order: query.sort,
        key: apiKey,
      });

      const publishedAfter = getPublishedAfter(query.period);
      if (publishedAfter) {
        searchParams.append('publishedAfter', publishedAfter);
      }
      if (query.duration !== 'any') {
        searchParams.append('videoDuration', query.duration);
      }

      const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`);
      const searchData = await searchRes.json();

      if (searchData.error) {
        throw new Error(searchData.error.message || '검색 중 오류가 발생했습니다.');
      }

      const items = searchData.items || [];
      if (items.length === 0) return [];

      const videoIds = items.map((item: any) => item.id.videoId).join(',');
      const channelIdsArr = Array.from(new Set(items.map((item: any) => item.snippet.channelId)));
      const channelIds = channelIdsArr.join(',');

      // 2. Get Video Stats
      const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`);
      const videoData = await videoRes.json();

      // 3. Get Channel Stats
      const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelIds}&key=${apiKey}`);
      const channelData = await channelRes.json();

      const videoMap = new Map(videoData.items?.map((item: any) => [item.id, item]) || []);
      const channelMap = new Map(channelData.items?.map((item: any) => [item.id, item]) || []);

      const results: VideoResult[] = items.map((item: any): VideoResult | null => {
        const v = videoMap.get(item.id.videoId);
        const c = channelMap.get(item.snippet.channelId);
        if (!v || !c) return null;

        const viewCount = parseInt(v.statistics.viewCount || '0', 10);
        const likeCount = parseInt(v.statistics.likeCount || '0', 10);
        const commentCount = parseInt(v.statistics.commentCount || '0', 10);
        const subscriberCount = parseInt(c.statistics.subscriberCount || '0', 10);

        const engagementRate = viewCount > 0 ? ((likeCount + commentCount) / viewCount) * 100 : 0;
        
        const channelCreatedAt = c.snippet.publishedAt;
        const channelAgeMonths = differenceInMonths(new Date(), new Date(channelCreatedAt));

        return {
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          channelId: item.snippet.channelId,
          channelName: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount,
          likeCount,
          commentCount,
          subscriberCount,
          channelCreatedAt,
          channelAgeMonths,
          engagementRate,
          grade: calculateGrade(engagementRate),
        };
      }).filter(Boolean) as VideoResult[];

      return results;
    },
    enabled: !!apiKey && !!query,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 mins cache
  });
}
