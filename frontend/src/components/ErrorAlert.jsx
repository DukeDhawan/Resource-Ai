import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="flex items-start justify-between p-4 my-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-rose-400 hover:text-rose-600 transition ml-4"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
