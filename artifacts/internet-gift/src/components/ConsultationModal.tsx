import React from 'react';
import { X } from 'lucide-react';
import { ConsultationForm } from './ConsultationForm';

interface ConsultationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ConsultationModal({ open, onClose }: ConsultationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        <ConsultationForm onSuccess={onClose} />
      </div>
    </div>
  );
}
