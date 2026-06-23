import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface VideoResult {
  videoId: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelName: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  subscriberCount: number;
  channelCreatedAt: string;
  channelAgeMonths: number;
  engagementRate: number;
  grade: 'S' | 'A' | 'B' | 'C';
}

export function formatKoreanNumber(num: number): string {
  if (num === 0) return '0';
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '억';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  }
  return num.toLocaleString();
}

export function formatChannelAge(months: number): string {
  if (months < 12) {
    return `${months}개월`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years}년`;
  }
  return `${years}년 ${remainingMonths}개월`;
}

export function calculateGrade(engagementRate: number): 'S' | 'A' | 'B' | 'C' {
  if (engagementRate >= 5) return 'S';
  if (engagementRate >= 3) return 'A';
  if (engagementRate >= 1) return 'B';
  return 'C';
}
