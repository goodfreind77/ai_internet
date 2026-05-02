import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/Header';
import { ISPNav } from '@/components/ISPNav';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReviewWritePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', author: '', content: '', password: '' });
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast({ variant: 'destructive', title: '제목을 입력해주세요.' }); return; }
    if (!form.author.trim()) { toast({ variant: 'destructive', title: '작성자를 입력해주세요.' }); return; }
    if (!form.content.trim()) { toast({ variant: 'destructive', title: '내용을 입력해주세요.' }); return; }
    if (!form.password.trim()) { toast({ variant: 'destructive', title: '비밀번호를 입력해주세요.' }); return; }

    setSubmitting(true);
    setTimeout(() => {
      toast({ title: '후기가 등록되었습니다.', description: '감사합니다!' });
      setSubmitting(false);
      setLocation('/review');
      window.scrollTo(0, 0);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ISPNav />

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8 max-w-[900px]">

          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setLocation('/review')}
            data-testid="button-back-to-list"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>

          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">후기 작성</h1>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  제목 <span className="text-primary">*필수</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="제목을 입력해주세요"
                  data-testid="input-title"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-base font-semibold">
                  작성자 <span className="text-primary">*필수</span>
                </Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="작성자명을 입력해주세요"
                  data-testid="input-author"
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail" className="text-base font-semibold">
                  썸네일 <span className="text-muted-foreground">*선택</span>
                </Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  data-testid="input-thumbnail"
                  className="min-h-[44px] cursor-pointer"
                />
                {preview && (
                  <div className="mt-4">
                    <img src={preview} alt="미리보기" className="max-w-xs rounded-md border border-border" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-semibold">
                  내용 <span className="text-primary">*필수</span>
                </Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="후기 내용을 입력해주세요"
                  rows={15}
                  data-testid="input-content"
                  className="resize-y"
                />
                <p className="text-sm text-muted-foreground">
                  아래 영역을 드래그하여 입력창 크기를 조절할 수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold">
                  비밀번호 <span className="text-primary">*필수</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="비밀번호를 입력해주세요"
                  data-testid="input-password"
                  className="min-h-[44px]"
                />
                <p className="text-sm text-muted-foreground">
                  작성하신 후기를 수정/삭제할 때 사용됩니다.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/review')}
                  data-testid="button-cancel"
                  className="flex-1 min-h-[44px]"
                >
                  돌아가기
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  data-testid="button-submit"
                  className="flex-1 min-h-[44px]"
                  disabled={submitting}
                >
                  {submitting ? '등록중...' : '등록하기'}
                </Button>
              </div>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
