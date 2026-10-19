import { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  buildTipBlogCopy, copyBlogContent, copyBlogText, copyTipImage, downloadTipImage, selectBlogPreview,
  type BlogCopyTip,
} from '@/lib/tip-blog-copy';

export function TipBlogCopyDialog({ tip, onClose }: { tip: BlogCopyTip; onClose: () => void }) {
  const content = useMemo(() => buildTipBlogCopy(tip), [tip]);
  const preview = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ error: boolean; text: string } | null>(null);
  const button = 'rounded border px-3 py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-wait hover:bg-gray-50';

  async function run(label: string, action: () => Promise<void>, success: string) {
    if (busy) return;
    setBusy(label);
    setNotice(null);
    try {
      await action();
      setNotice({ error: false, text: success });
    } catch (error) {
      const detail = error instanceof Error ? error.message : '';
      setNotice({ error: true, text: `${detail || '복사하지 못했습니다.'} 복사가 제한되면 미리보기 선택 또는 PNG 저장을 이용해 주세요.` });
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl w-[calc(100%_-_2rem)] max-h-[90dvh] flex flex-col overflow-hidden p-4 sm:p-6">
        <DialogHeader className="pr-6">
          <DialogTitle>블로그에 옮기기</DialogTitle>
          <DialogDescription>
            제목·대표 이미지·본문을 함께 복사합니다. 블로그 편집기에서 붙여넣기(Ctrl+V / ⌘V) 해 주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!!busy} className={`${button} !bg-blue-600 text-white border-blue-600 hover:!bg-blue-700`}
              onClick={() => void run('전체 복사', async () => {
                if (!preview.current) throw new Error('미리보기를 불러오지 못했습니다.');
                await copyBlogContent(content, preview.current);
              }, '제목·본문·이미지를 복사했습니다. 블로그 편집기에 붙여넣어 주세요.')}>
              내용·이미지 복사
            </button>
            <button type="button" disabled={!!busy} className={button}
              onClick={() => void run('제목 복사', () => copyBlogText(tip.title), '제목을 복사했습니다. 블로그 제목란에 붙여넣어 주세요.')}>제목 복사</button>
            <button type="button" disabled={!!busy} className={button}
              onClick={() => void run('텍스트 복사', () => copyBlogText(content.text), '이미지를 제외한 텍스트를 복사했습니다.')}>텍스트만 복사</button>
            <button type="button" disabled={!!busy} className={button} onClick={() => {
              if (preview.current) {
                selectBlogPreview(preview.current);
                setNotice({ error: false, text: '미리보기를 선택했습니다. Ctrl+C(맥: ⌘C) 또는 모바일 복사 메뉴를 이용해 주세요.' });
              }
            }}>미리보기 선택</button>
          </div>
          {busy && <p role="status" className="text-sm text-blue-700">{busy} 처리 중…</p>}
          {notice && <p role={notice.error ? 'alert' : 'status'} className={`rounded p-3 text-sm whitespace-pre-wrap ${notice.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>{notice.text}</p>}
          <p className="rounded bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
            네이버 등 일부 블로그는 외부 이미지를 붙여넣을 때 제외할 수 있습니다. 이미지가 빠지면 아래에서 이미지를 개별 복사하거나 PNG로 저장한 뒤 블로그에 업로드해 주세요. 원본 글은 변경되지 않습니다.
          </p>
          {content.images.length > 0 ? (
            <section aria-label="복사할 이미지" className="rounded border p-3 space-y-3">
              <h3 className="text-sm font-bold">이미지 {content.images.length}개</h3>
              {content.images.map((image, index) => (
                <div key={image.src} className="flex flex-wrap items-center gap-3 rounded bg-gray-50 p-2">
                  <img src={image.src} alt={image.alt} className="h-16 w-24 rounded object-cover" />
                  <span className="text-xs text-gray-600">이미지 {index + 1}</span>
                  <button type="button" disabled={!!busy} className={button}
                    onClick={() => void run(`이미지 ${index + 1} 복사`, () => copyTipImage(image.src), '이미지를 복사했습니다. 블로그 본문의 원하는 위치에 붙여넣어 주세요.')}>이미지 복사</button>
                  <button type="button" disabled={!!busy} className={button}
                    onClick={() => void run(`이미지 ${index + 1} 저장`, () => downloadTipImage(image.src, tip.title, index), 'PNG 다운로드를 시작했습니다. 저장된 파일을 블로그에 업로드해 주세요.')}>PNG 저장</button>
                </div>
              ))}
            </section>
          ) : <p className="text-sm text-gray-500">이 글에 등록된 이미지가 없습니다. 본문만 복사됩니다.</p>}
          <section aria-label="블로그 복사 미리보기">
            <h3 className="mb-2 text-sm font-bold">복사 미리보기</h3>
            <div ref={preview} tabIndex={0} aria-label="복사할 제목과 본문"
              className="tip-rich rounded border bg-white p-4 sm:p-6 break-words select-text [&_img]:max-w-full [&_table]:max-w-full overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: content.html }} />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
