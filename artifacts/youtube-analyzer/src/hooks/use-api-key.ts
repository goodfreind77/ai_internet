import { useState, useEffect } from 'react';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yt_api_key') || '';
    }
    return '';
  });

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('yt_api_key', key);
  };

  return { apiKey, setApiKey };
}
