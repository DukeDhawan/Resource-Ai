import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Package,
  Sparkles,
  MessageSquare,
  PlusCircle,
  FileQuestion,
  Trash2,
  Edit,
  ExternalLink,
  MapPin,
  Scale,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listingsAPI, requestsAPI, inquiriesAPI, matchesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function DashboardPage() {
  const { user, isSupplier, isBuyer } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isSupplier) {
        const [listRes, inqRes, matchRes] = await Promise.all([
          listingsAPI.getAll({ supplier_id: user.id }),
          inquiriesAPI.getAll(),
          matchesAPI.getRecommendations(6)
        ]);
        setMyListings(listRes.data);
        setInquiries(inqRes.data);
        setMatches(matchRes.data);
      } else {
        const [reqRes, inqRes, matchRes] = await Promise.all([
          requestsAPI.getAll({ buyer_id: user.id }),
          inquiriesAPI.getAll(),
          matchesAPI.getRecommendations(6)
        ]);
        setMyRequests(reqRes.data);
        setInquiries(inqRes.data);
        setMatches(matchRes.data);
      }
    } catch (err) {
      setError('Could not refresh dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this material listing?')) return;
    try {
      await listingsAPI.delete(listingId);
      setMyListings(prev => prev.filter(l => l.id !== listingId));
    } catch (err) {
      setError('Failed to delete listing.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this buyer request?')) return;
    try {
      await requestsAPI.delete(requestId);
      setMyRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      setError('Failed to delete request.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading enterprise dashboard..." />;

  const totalListingKg = myListings.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0);
  const totalDemandKg = myRequests.reduce((sum, r) => sum + (Number(r.quantity_needed) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {user?.company_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {user?.role} Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {user?.city} &bull; Account: {user?.email}
            </p>
          </div>
        </div>

        <div>
          {isSupplier ? (
            <Link
              to="/listings/new"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Material Stream</span>
            </Link>
          ) : (
            <Link
              to="/requests"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Wanted Demand</span>
            </Link>
          )}
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isSupplier ? (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">My Active Listings</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{myListings.length}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Material Volume</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {totalListingKg.toLocaleString()} <span className="text-xs text-slate-500 font-semibold">units</span>
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">My Material Requests</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{myRequests.length}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Procurement Demand</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
                {totalDemandKg.toLocaleString()} <span className="text-xs text-slate-500 font-semibold">units</span>
              </span>
            </div>
          </>
        )}

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Inquiries</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{inquiries.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">High AI Matches</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{matches.length}</span>
        </div>
      </div>

      {/* Main Section */}
      {isSupplier ? (
        /* Supplier View: My Listings */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <span>My Active Industrial Material Listings</span>
            </h3>
            <Link
              to="/listings/new"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              + Add Listing
            </Link>
          </div>

          {myListings.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't posted any material streams yet. Click 'Post New Material Stream' to begin.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Material</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Available Quantity</th>
                    <th className="py-3 px-4">Unit Rate</th>
                    <th className="py-3 px-4">AI Score</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myListings.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <Link to={`/listings/${l.id}`} className="hover:text-emerald-600">
                          {l.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold">{l.category}</td>
                      <td className="py-3.5 px-4 font-bold">{Number(l.quantity).toLocaleString()} {l.unit}</td>
                      <td className="py-3.5 px-4">
                        {l.price_type === 'free' || l.price === 0 ? (
                          <span className="font-extrabold text-emerald-600">FREE</span>
                        ) : (
                          `$${l.price}/${l.unit}`
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {l.ai_sustainability_score || 75}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/listings/${l.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 inline-block"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(l.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 inline-block"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Buyer View: My Requests */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-teal-600" />
              <span>My Material Demand Requests</span>
            </h3>
            <Link
              to="/requests"
              className="text-xs font-bold text-teal-600 hover:text-teal-700"
            >
              + Post Request
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't posted any procurement requests yet. Click 'Post Wanted Demand' to match with suppliers.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Material</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Quantity Needed</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.material_name}</td>
                      <td className="py-3.5 px-4 capitalize font-semibold">{r.category}</td>
                      <td className="py-3.5 px-4 font-bold">{Number(r.quantity_needed).toLocaleString()} {r.unit}</td>
                      <td className="py-3.5 px-4">{r.location}</td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/matches?requestId=${r.id}`}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 text-teal-700 hover:bg-teal-100"
                        >
                          View Matches
                        </Link>
                        <button
                          onClick={() => handleDeleteRequest(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 inline-block align-middle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Recommended Matches Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Recommended AI Matches for You</span>
          </h3>
          <Link
            to="/matches"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Match Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.slice(0, 3).map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 line-clamp-1">{m.listing?.title}</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg text-[11px]">
                  {m.match_score}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{m.why_matched[0]}</p>
              <Link
                to={`/listings/${m.listing?.id}`}
                className="w-full inline-flex items-center justify-center py-2 rounded-xl text-xs font-bold text-emerald-700 bg-white border border-emerald-200 hover:bg-emerald-50 transition"
              >
                Inspect Match Specs
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
