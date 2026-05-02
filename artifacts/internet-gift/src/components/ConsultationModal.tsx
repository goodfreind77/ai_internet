import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ConsultationForm } from './ConsultationForm';

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConsultationModal({ open, onClose }: ConsultationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl">
        <VisuallyHidden>
          <DialogTitle>빠른 견적 문의</DialogTitle>
        </VisuallyHidden>
        <ConsultationForm />
      </DialogContent>
    </Dialog>
  );
}
