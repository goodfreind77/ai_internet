import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProviderPage from "@/pages/ProviderPage";
import CardPage from "@/pages/CardPage";
import EventPage from "@/pages/EventPage";
import EventDetailPage from "@/pages/EventDetailPage";
import TipPage from "@/pages/TipPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/provider/:key">
        {(params) => <ProviderPage providerKey={params.key} />}
      </Route>
      <Route path="/cards">
        {() => <CardPage providerKey="all" />}
      </Route>
      <Route path="/cards/:key">
        {(params) => <CardPage providerKey={params.key} />}
      </Route>
      <Route path="/event">
        {() => <EventPage />}
      </Route>
      <Route path="/event/:id">
        {(params) => <EventDetailPage eventId={params.id} />}
      </Route>
      <Route path="/tip">
        {() => <TipPage />}
      </Route>
      <Route path="/tip/:slug">
        {() => <TipPage />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
