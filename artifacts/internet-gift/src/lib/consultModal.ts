let _showFn: (() => void) | null = null;

export const consultModal = {
  register(fn: () => void) { _showFn = fn; },
  unregister() { _showFn = null; },
  open() {
    if (_showFn) {
      _showFn();
    } else {
      // fallback: scroll to inline form
      document.getElementById('quick-quote')?.scrollIntoView({ behavior: 'smooth' });
    }
  },
};
