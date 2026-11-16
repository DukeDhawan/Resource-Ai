import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Scale,
  TrendingUp,
  MessageSquare,
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { matchesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

export default function MatchesPage() {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get('requestId');
  const listingId = searchParams.get('listingId');
  const { user, isAuthenticated } = useAuth();

  const [matches, setMatches] = useState([]);
  const [minScore, setMinScore] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatches = async () => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (listingId) {
        res = await matchesAPI.getForListing(listingId, 15);
      } else if (requestId) {
        res = await matchesAPI.getForRequest(requestId, 15);
      } else {
        res = await matchesAPI.getRecommendations(20);
      }
      setMatches(res.data);
    } catch (err) {
      setError('Could not load AI recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [requestId, listingId]);

  const filteredMatches = matches.filter(m => m.match_score >= minScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Multivariate Compatibility Engine
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            AI Circular Match Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Autonomous scoring based on polymer/alloy chemistry, technical use cases, logistic proximity, and batch volume.
          </p>
        </div>

        {/* Filter Slider for Score */}
        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 w-fit">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span>Min Compatibility:</span>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-800"
          >
            <option value={80}>80%+ (High Match)</option>
            <option value={60}>60%+ (Solid Match)</option>
            <option value={40}>40%+ (Viable Match)</option>
            <option value={0}>All Matches</option>
          </select>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner message="Calculating circular compatibility scores across database..." />
      ) : filteredMatches.length === 0 ? (
        <EmptyState
          title="No high-score matches found with current threshold"
          description="Try lowering the compatibility threshold filter or browse all marketplace listings."
          actionText="Lower to 40% Threshold"
          actionLink="#"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((m, idx) => {
            const score = m.match_score;
            const badgeBg =
              score >= 80 ? 'bg-emerald-600 text-white' :
              score >= 60 ? 'bg-teal-600 text-white' :
              'bg-slate-700 text-white';

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between space-y-5"
              >
                {/* Header score & category */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {m.listing?.category} Synergy
                    </span>
                  </div>

                  <div className={`px-3 py-1 rounded-xl text-xs font-black shadow-2xs flex items-center gap-1 ${badgeBg}`}>
                    <span>{score}% Compatibility</span>
                  </div>
                </div>

                {/* Match Pair comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Listing Box */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Available Supply Stream
                    </span>
                    <h4 className="font-bold text-slate-900 line-clamp-2">
                      {m.listing?.title}
                    </h4>
                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                      <p>Qty: <strong className="text-slate-700">{m.listing?.quantity} {m.listing?.unit}</strong></p>
                      <p>Loc: <strong className="text-slate-700">{m.listing?.location}</strong></p>
                    </div>
                  </div>

                  {/* Request Box */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      Target Buyer Demand
                    </span>
                    <h4 className="font-bold text-slate-900 line-clamp-2">
                      {m.request?.material_name}
                    </h4>
                    <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                      <p>Demand: <strong className="text-slate-700">{m.request?.quantity_needed} {m.request?.unit}</strong></p>
                      <p>Loc: <strong className="text-slate-700">{m.request?.location}</strong></p>
                    </div>
                  </div>
                </div>

                {/* Why this matched explanation chips */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    AI Correlation Rationale:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.why_matched.map((reason, rIdx) => (
                      <span
                        key={rIdx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{reason}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connect Action */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <Link
                    to={`/listings/${m.listing?.id}`}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-emerald-700"
                  >
                    <span>Inspect Stream Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/listings/${m.listing?.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                  >
                    Initiate Exchange
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
