import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  subscriberCount: [number, number];
  viewCount: [number, number];
  engagementRate: [number, number];
  channelAgeMonths: [number, number];
  grade: string;
}

export const DEFAULT_FILTERS: FilterState = {
  subscriberCount: [0, 100000000], // 0 ~ 1억
  viewCount: [0, 100000000],
  engagementRate: [0, 100],
  channelAgeMonths: [0, 240],
  grade: 'all',
};

interface AppContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  resetFilters: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <AppContext.Provider value={{ filters, setFilters, viewMode, setViewMode, resetFilters }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
