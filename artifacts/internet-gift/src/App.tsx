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
import TipDetailPage from "@/pages/TipDetailPage";
import ReviewPage from "@/pages/ReviewPage";
import ReviewDetailPage from "@/pages/ReviewDetailPage";
import ReviewWritePage from "@/pages/ReviewWritePage";
import ApplyPage from "@/pages/ApplyPage";
import AdminPage from "@/pages/AdminPage";
import ConsentPage from "@/pages/ConsentPage";
import AiQuotePage from "@/pages/AiQuotePage";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ConsultationForm } from "@/components/ConsultationForm";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

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
        {(params) => <TipDetailPage slug={params.slug} />}
      </Route>
      <Route path="/review">
        {() => <ReviewPage />}
      </Route>
      <Route path="/apply">
        {() => <ApplyPage />}
      </Route>
      <Route path="/review/write">
        {() => <ReviewWritePage />}
      </Route>
      <Route path="/review/:id">
        {(params) => <ReviewDetailPage reviewId={params.id} />}
      </Route>
      <Route path="/ai-quote">
        {() => <AiQuotePage />}
      </Route>
      <Route path="/admin">
        {() => <AdminPage />}
      </Route>
      <Route path="/consent/:id">
        {(params) => <ConsentPage id={params.id} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function GlobalConsultModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('openConsultModal', handler);
    return () => window.removeEventListener('openConsultModal', handler);
  }, []);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', background: 'rgba(0,0,0,0.55)',
      }}
      onMouseDown={() => setOpen(false)}
    >
      <div
        style={{
          position: 'relative', width: '100%', maxWidth: '28rem',
          maxHeight: '90vh', overflowY: 'auto', borderRadius: '1rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)', background: 'white',
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <button
          onMouseDown={() => setOpen(false)}
          style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10,
            width: '2rem', height: '2rem', display: 'flex', alignItems: 'center',
            justifyContent: 'center', borderRadius: '9999px', background: '#f3f4f6',
            border: 'none', cursor: 'pointer',
          }}
        >
          <X style={{ width: '1rem', height: '1rem', color: '#4b5563' }} />
        </button>
        <ConsultationForm onSuccess={() => setOpen(false)} />
      </div>
    </div>,
    document.body
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <MobileBottomNav />
        </WouterRouter>
        <Toaster />
        <GlobalConsultModal />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
