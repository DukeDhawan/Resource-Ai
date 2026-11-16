import React from 'react';
import { Sparkles, Leaf, ShieldCheck, Factory, Recycle, AlertCircle, Cpu } from 'lucide-react';
import HazardWarning from './HazardWarning';

export default function AIAnalysisCard({ analysis, isHazardous, className = "" }) {
  if (!analysis) return null;

  const {
    material_name,
    category,
    composition,
    condition,
    reuse_applications = [],
    target_industries = [],
    handling_notes,
    sustainability_score = 75,
    confidence = "High",
    is_demo_mode = true,
    safety_warning
  } = analysis;

  const scoreColor = 
    sustainability_score >= 85 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
    sustainability_score >= 70 ? 'text-teal-600 bg-teal-50 border-teal-200' :
    'text-amber-600 bg-amber-50 border-amber-200';

  return (
    <div className={`bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-2xl border border-emerald-100 shadow-sm overflow-hidden p-6 space-y-6 ${className}`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              AI Circular Material Assessment
              {is_demo_mode ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  <Cpu className="w-3 h-3 mr-1" />
                  Demo AI Mode
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini Live AI
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">Autonomous classification, reuse matrix & circular index</p>
          </div>
        </div>

        {/* Confidence & Score Pill */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">Confidence</span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md inline-block">
              {confidence}
            </span>
          </div>
          <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border ${scoreColor}`}>
            <span className="text-xs font-semibold text-slate-500 leading-none">Sustainability</span>
            <span className="text-xl font-extrabold leading-none mt-1">{sustainability_score} <span className="text-xs font-normal">/100</span></span>
          </div>
        </div>
      </div>

      {/* Hazard Warning if detected */}
      {(isHazardous || analysis.is_hazardous) && (
        <HazardWarning warning={safety_warning} />
      )}

      {/* Grid of Key Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Identified Composition</span>
          <p className="font-semibold text-slate-800">{composition || "Standard industrial stream"}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Physical Condition</span>
          <p className="font-semibold text-slate-800">{condition || "Clean industrial scrap / byproduct"}</p>
        </div>
      </div>

      {/* Reuse Applications (3-5 items) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
          <Recycle className="w-4 h-4 text-emerald-600" />
          Recommended Circular Reuse Applications
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {reuse_applications.map((app, idx) => (
            <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-white/80 border border-emerald-100/80 text-xs text-slate-700">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px] mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{app}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Industries (3-5 items) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
          <Factory className="w-4 h-4 text-teal-600" />
          High-Synergy Industrial Sectors
        </h4>
        <div className="flex flex-wrap gap-2">
          {target_industries.map((ind, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100"
            >
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* Handling & Safety Notes */}
      {handling_notes && (
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-700 mr-1">Handling & Storage Protocol:</span>
            <span>{handling_notes}</span>
          </div>
        </div>
      )}
    </div>
  );
}
