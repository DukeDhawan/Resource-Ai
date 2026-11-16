import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileQuestion,
  PlusCircle,
  MapPin,
  Scale,
  Sparkles,
  Building2,
  X,
  Search,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { requestsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'metal', label: 'Metals' },
  { id: 'plastic', label: 'Plastics' },
  { id: 'chemical', label: 'Chemicals' },
  { id: 'textile', label: 'Textiles' },
  { id: 'wood', label: 'Wood' },
  { id: 'glass', label: 'Glass' },
  { id: 'organic', label: 'Organic' },
  { id: 'construction', label: 'Construction' },
  { id: 'electronic', label: 'E-Waste' },
  { id: 'other', label: 'Other' },
];

export default function RequestsPage() {
  const { user, isAuthenticated, isBuyer } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchLocation, setSearchLocation] = useState('');

  // Post Request Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [materialName, setMaterialName] = useState('');
  const [reqCategory, setReqCategory] = useState('plastic');
  const [quantityNeeded, setQuantityNeeded] = useState('');
  const [unit, setUnit] = useState('kg');
  const [reqLocation, setReqLocation] = useState(user?.city || '');
  const [useCase, setUseCase] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchLocation.trim()) params.location = searchLocation.trim();
      const res = await requestsAPI.getAll(params);
      setRequests(res.data);
    } catch (err) {
      setError('Could not load buyer demand requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedCategory]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setModalError('');
    try {
      await requestsAPI.create({
        material_name: materialName,
        category: reqCategory,
        quantity_needed: parseFloat(quantityNeeded),
        unit,
        location: reqLocation,
        use_case: useCase
      });
      setModalOpen(false);
      // Reset form
      setMaterialName('');
      setQuantityNeeded('');
      setUseCase('');
      fetchRequests();
    } catch (err) {
      setModalError(err.response?.data?.detail || 'Failed to create request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Industrial Sourcing & Procurement
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Buyer Material Demand Feed
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manufacturing facilities actively seeking secondary raw materials, scrap, and byproducts.
          </p>
        </div>

        {isBuyer && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Wanted Material</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Location search */}
        <div className="relative w-full sm:w-64">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
            placeholder="Filter location (e.g. Detroit)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner message="Loading buyer procurement requests..." />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No open procurement requests found"
          description="Try selecting a different material category or post your own demand specification."
          actionText={isBuyer ? "Post Wanted Material" : "Explore Marketplace"}
          actionLink={isBuyer ? null : "/marketplace"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                    {req.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {req.material_name}
                </h3>

                {req.use_case && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    <span className="font-bold text-slate-700">Intended Application: </span>
                    {req.use_case}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Scale className="w-4 h-4 text-teal-600" />
                    <span>Target Volume:</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    {Number(req.quantity_needed).toLocaleString()} {req.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Destination:</span>
                  </div>
                  <span className="font-medium text-slate-700">{req.location}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Buyer:</span>
                  </div>
                  <span className="font-semibold text-slate-800">{req.buyer?.company_name || "Enterprise Buyer"}</span>
                </div>

                <Link
                  to={`/matches?requestId=${req.id}`}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-4 py-2 mt-2 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-600 hover:text-white transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Matching Materials</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">
                Post Material Demand Request
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <ErrorAlert message={modalError} onClose={() => setModalError('')} />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Material / Byproduct *
                </label>
                <input
                  type="text"
                  required
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="e.g. HDPE Flakes or Regrind for Drainage Pipe Extrusion"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-hidden"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination City *
                  </label>
                  <input
                    type="text"
                    required
                    value={reqLocation}
                    onChange={(e) => setReqLocation(e.target.value)}
                    placeholder="e.g. Detroit, MI"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Quantity Needed *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="kg">kg</option>
                    <option value="tonnes">tonnes</option>
                    <option value="litres">litres</option>
                    <option value="units">units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Intended Application & Specific Tech Requirements
                </label>
                <textarea
                  rows={3}
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Explain your manufacturing process, acceptable contamination tolerance, melt index, color requirements, or COA needs..."
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-sm disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Post Demand Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
