import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { ALL_REVIEWS } from './ReviewPage';

export default function ReviewDetailPage({ reviewId }: { reviewId?: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => { window.scrollTo(0, 0); }, [reviewId]);

  const review = ALL_REVIEWS.find((r) => r.id === reviewId);

  if (!review) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <ISPNav />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-16 max-w-[800px] text-center">
            <p className="text-muted-foreground text-lg">후기를 찾을 수 없습니다.</p>
            <Button className="mt-6" onClick={() => setLocation('/review')}>목록으로</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[800px]">

          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setLocation('/review')}
            data-testid="button-back-to-list"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
            <h1
              className="text-2xl md:text-3xl font-bold mb-6"
              data-testid="text-review-detail-title"
            >
              {review.title}
            </h1>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-6 pb-6 border-b">
              <div className="flex items-center gap-4">
                <span data-testid="text-review-detail-author">작성자: {review.author}</span>
                <span data-testid="text-review-detail-views">조회수: {review.views}</span>
              </div>
              <span data-testid="text-review-detail-date">{review.date}</span>
            </div>

            <div className="mb-6">
              <img
                src={review.thumbnail}
                alt={review.title}
                className="w-full rounded-lg"
                data-testid="img-review-detail-thumbnail"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>

            <div
              className="prose prose-sm md:prose-base max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed"
              data-testid="text-review-detail-content"
            >
              {review.content}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="default"
              onClick={() => setLocation('/review')}
              data-testid="button-back-to-list-bottom"
            >
              목록으로
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
