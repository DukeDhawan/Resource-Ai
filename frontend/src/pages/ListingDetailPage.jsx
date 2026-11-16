import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Scale,
  Sparkles,
  ArrowLeft,
  Building2,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Send,
  X,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { listingsAPI, matchesAPI, inquiriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AIAnalysisCard from '../components/AIAnalysisCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inquiry modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await listingsAPI.getById(id);
        setListing(res.data);
        setSubject(`Inquiry regarding ${res.data.title}`);

        // Fetch related matches
        try {
          const matchRes = await matchesAPI.getForListing(id, 4);
          setMatches(matchRes.data);
        } catch {
          // non-critical
        }
      } catch (err) {
        setError('Listing could not be found or was removed.');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmittingInquiry(true);
    setInquiryError('');
    try {
      await inquiriesAPI.create({
        listing_id: Number(id),
        subject,
        message
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setInquiryModalOpen(false);
        navigate('/inquiries');
      }, 1200);
    } catch (err) {
      setInquiryError(err.response?.data?.detail || 'Failed to send inquiry.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading circular material specifications..." />;
  if (error || !listing) return (
    <div className="max-w-4xl mx-auto p-8">
      <ErrorAlert message={error || "Listing not found"} />
      <Link to="/marketplace" className="inline-flex items-center text-xs font-bold text-emerald-600 mt-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
      </Link>
    </div>
  );

  const isOwner = user?.id === listing.supplier_id;

  const analysisData = {
    material_name: listing.ai_material_name || listing.title,
    category: listing.category,
    composition: listing.ai_composition,
    condition: listing.ai_condition,
    reuse_applications: listing.ai_reuse_applications,
    target_industries: listing.ai_target_industries,
    handling_notes: listing.ai_handling_notes,
    sustainability_score: listing.ai_sustainability_score,
    confidence: listing.ai_confidence,
    is_demo_mode: listing.ai_is_demo_mode,
    is_hazardous: listing.is_hazardous
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to All Marketplace Materials
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image & Details & AI Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Image banner */}
            <div className="h-64 sm:h-80 bg-slate-100 relative overflow-hidden flex items-center justify-center">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 via-emerald-50/50 to-teal-50/40 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-5xl mb-2">
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
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{listing.category}</span>
                </div>
              )}

              {/* Status pill */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
                  {listing.category}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
                  {listing.availability_status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {listing.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Listed {new Date(listing.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Specs Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Quantity</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {Number(listing.quantity).toLocaleString()} {listing.unit}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Price</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {listing.price_type === 'free' || listing.price === 0 ? "FREE" : `$${listing.price} / ${listing.unit}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Stream Type</span>
                  <span className="text-sm font-extrabold text-slate-900 capitalize">
                    {listing.category}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Hazard Regs</span>
                  <span className={`text-sm font-extrabold ${listing.is_hazardous ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {listing.is_hazardous ? "Regulated" : "Standard"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Circular Material Assessment Card */}
          <AIAnalysisCard
            analysis={analysisData}
            isHazardous={listing.is_hazardous}
          />

        </div>

        {/* Right Column: Supplier card, Inquiry Trigger, Matches */}
        <div className="space-y-6">
          
          {/* Supplier Info & Action Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Listed By Supplier</span>
                  <h4 className="font-bold text-sm text-slate-900">
                    {listing.supplier?.company_name || "Industrial Supplier"}
                  </h4>
                  <span className="text-xs text-slate-500">{listing.location}</span>
                </div>
              </div>
            </div>

            {/* Price display */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 block">Unit Exchange Rate</span>
                <span className="text-2xl font-black text-emerald-950">
                  {listing.price_type === 'free' || listing.price === 0 ? "FREE" : `$${listing.price}`}
                </span>
                {listing.price > 0 && <span className="text-xs text-emerald-700 font-semibold ml-1">/ {listing.unit}</span>}
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-emerald-700 border border-emerald-200 shadow-2xs">
                {listing.availability_status}
              </span>
            </div>

            {/* Action buttons */}
            {isOwner ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-600 font-semibold">
                You are the supplier of this listing.
              </div>
            ) : (
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full inline-flex items-center justify-center px-5 py-3.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Buyer Inquiry / Offer</span>
              </button>
            )}
          </div>

          {/* AI Recommended Buyer Matches */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Top Buyer Matches for Stream
              </h4>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {matches.length} matches
              </span>
            </div>

            <div className="space-y-3">
              {matches.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  No active buyer requests match this exact stream yet.
                </p>
              ) : (
                matches.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-800 line-clamp-1">
                        {m.request?.material_name}
                      </span>
                      <span className="shrink-0 font-extrabold text-xs px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                        {m.match_score}% match
                      </span>
                    </div>

                    <div className="space-y-1">
                      {m.why_matched.slice(0, 2).map((reason, rIdx) => (
                        <div key={rIdx} className="text-[11px] text-slate-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="line-clamp-1">{reason}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Demand: {m.request?.quantity_needed} {m.request?.unit}</span>
                      <span>{m.request?.location}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Contact Supplier regarding {listing.title}
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-sm text-slate-900">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-500">Redirecting to your inquiries thread...</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <ErrorAlert message={inquiryError} onClose={() => setInquiryError('')} />

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Message / Requirements
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your purchase intent, target quantity, required certifications (e.g. COA/SDS), and proposed pickup timeframe..."
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingInquiry ? "Sending..." : "Submit Inquiry"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
