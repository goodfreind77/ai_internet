let _openFn: (() => void) | null = null;

export const consultModal = {
  register(fn: () => void) { _openFn = fn; },
  unregister() { _openFn = null; },
  open() { _openFn?.(); },
};
