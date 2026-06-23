import React from 'react';
import { SiYoutube } from 'react-icons/si';
import { Moon, Sun, Key } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useApiKey } from '@/hooks/use-api-key';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { apiKey, setApiKey } = useApiKey();
  const [inputKey, setInputKey] = React.useState(apiKey);

  const handleSaveKey = () => {
    setApiKey(inputKey);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-14 items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-2">
          <SiYoutube className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">YouTube 트렌드 분석기</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="YouTube API Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-48 h-8 text-xs"
            />
            <Button size="sm" variant="secondary" className="h-8" onClick={handleSaveKey}>
              저장
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-8 w-8"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {!apiKey && (
        <div className="bg-destructive/10 text-destructive text-xs py-1.5 px-4 text-center border-b border-destructive/20 flex items-center justify-center gap-2">
          <span>YouTube Data API 키가 설정되지 않았습니다. 원활한 이용을 위해 API 키를 입력해주세요.</span>
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-medium hover:text-destructive/80">
            키 발급받기
          </a>
        </div>
      )}
    </header>
  );
}
