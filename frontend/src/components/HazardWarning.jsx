import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function HazardWarning({ warning }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="p-1.5 bg-amber-200 rounded-lg text-amber-800 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold flex items-center gap-1.5 text-amber-950">
            <ShieldAlert className="w-4 h-4 text-amber-600 inline" />
            REGULATORY SAFETY & HAZARD COMPLIANCE NOTICE
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            {warning || "This industrial stream contains chemical, caustic, or regulated components. Packaging, handling, transport, and facility storage must comply with EPA / OSHA / REACH regulations and certified waste manifest requirements."}
          </p>
        </div>
      </div>
    </div>
  );
}
