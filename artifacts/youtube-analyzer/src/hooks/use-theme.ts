import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('yt_dark_mode');
      if (stored) return stored as 'light' | 'dark';
      return 'dark'; // Default to dark mode as requested
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('yt_dark_mode', theme);
  }, [theme]);

  return { theme, setTheme };
}
