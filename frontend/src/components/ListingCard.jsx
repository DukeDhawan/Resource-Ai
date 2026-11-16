import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Scale, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  metal: 'bg-amber-50 text-amber-800 border-amber-200',
  plastic: 'bg-blue-50 text-blue-800 border-blue-200',
  chemical: 'bg-purple-50 text-purple-800 border-purple-200',
  textile: 'bg-pink-50 text-pink-800 border-pink-200',
  wood: 'bg-yellow-50 text-yellow-900 border-yellow-200',
  glass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  organic: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  construction: 'bg-stone-100 text-stone-800 border-stone-200',
  electronic: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  other: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function ListingCard({ listing }) {
  const catColor = CATEGORY_COLORS[listing.category?.toLowerCase()] || CATEGORY_COLORS.other;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image or Category Banner */}
      <div className="relative h-44 bg-slate-100 overflow-hidden flex items-center justify-center">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 via-emerald-50/50 to-teal-50/40 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-3xl mb-1">
              {listing.category === 'metal' ? '⚙️' :
               listing.category === 'plastic' ? '🧪' :
               listing.category === 'chemical' ? '⚗️' :
               listing.category === 'textile' ? '🧵' :
               listing.category === 'wood' ? '🪵' :
               listing.category === 'glass' ? '🫙' :
               listing.category === 'organic' ? '🌱' :
               listing.category === 'construction' ? '🧱' :
               listing.category === 'electronic' ? '🔌' : '📦'}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{listing.category}</span>
          </div>
        )}

        {/* Category Pill */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm ${catColor}`}>
          {listing.category}
        </span>

        {/* Hazard Pill if hazardous */}
        {listing.is_hazardous && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Regulated
          </span>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3">
          {listing.price_type === 'free' || listing.price === 0 ? (
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-extrabold rounded-lg shadow">
              FREE
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-bold rounded-lg shadow">
              ${listing.price} <span className="text-[10px] text-slate-300 font-normal">/{listing.unit}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-emerald-700 transition">
            {listing.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Metadata info */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-slate-500">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Available Quantity:</span>
            </div>
            <span className="font-bold text-slate-800">
              {Number(listing.quantity).toLocaleString()} {listing.unit}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Location:</span>
            </div>
            <span className="font-medium text-slate-700">{listing.location}</span>
          </div>

          {/* Sustainability Score */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sustainability Score</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {listing.ai_sustainability_score || 75}/100
            </span>
          </div>
        </div>

        {/* Action button */}
        <Link
          to={`/listings/${listing.id}`}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-emerald-600 hover:text-white transition-colors duration-150 group/btn"
        >
          <span>View Circular Analysis</span>
          <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
