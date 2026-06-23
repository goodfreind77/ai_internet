import { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SearchBar } from "@/components/SearchBar";
import { ResultsArea } from "@/components/ResultsArea";
import { SearchQuery, useYouTubeSearch } from "@/hooks/use-youtube";
import { useApiKey } from "@/hooks/use-api-key";

const queryClient = new QueryClient();

function MainContent() {
  const { apiKey } = useApiKey();
  const { filters } = useAppContext();
  const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
  
  const { data: rawResults = [], isLoading, error } = useYouTubeSearch(apiKey, searchQuery);

  const filteredResults = useMemo(() => {
    if (!rawResults.length) return [];
    
    return rawResults.filter((v) => {
      const { subscriberCount, viewCount, engagementRate, channelAgeMonths, grade } = filters;
      
      if (v.subscriberCount < subscriberCount[0] || v.subscriberCount > subscriberCount[1]) return false;
      if (v.viewCount < viewCount[0] || v.viewCount > viewCount[1]) return false;
      if (v.engagementRate < engagementRate[0] || v.engagementRate > engagementRate[1]) return false;
      if (v.channelAgeMonths < channelAgeMonths[0] || v.channelAgeMonths > channelAgeMonths[1]) return false;
      if (grade !== 'all' && v.grade !== grade) return false;
      
      return true;
    });
  }, [rawResults, filters]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentResults={filteredResults} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            <SearchBar 
              onSearch={setSearchQuery} 
              isLoading={isLoading} 
            />
            <ResultsArea 
              results={filteredResults} 
              isLoading={isLoading} 
              error={error as Error | null}
              hasSearched={!!searchQuery}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
