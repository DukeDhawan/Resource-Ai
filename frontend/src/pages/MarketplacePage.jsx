import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  PackageOpen
} from 'lucide-react';
import { listingsAPI } from '../services/api';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';

const CATEGORIES = [
  { id: 'all', label: 'All Streams' },
  { id: 'metal', label: 'Metals' },
  { id: 'plastic', label: 'Plastics' },
  { id: 'chemical', label: 'Chemicals' },
  { id: 'textile', label: 'Textiles' },
  { id: 'wood', label: 'Wood & Biomass' },
  { id: 'glass', label: 'Glass' },
  { id: 'organic', label: 'Organic' },
  { id: 'construction', label: 'Construction' },
  { id: 'electronic', label: 'E-Waste' },
  { id: 'other', label: 'Other' },
];

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state initialized from URL search params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [freeOnly, setFreeOnly] = useState(searchParams.get('free') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        sort_by: sortBy,
        status_filter: 'available'
      };
      if (searchTerm.trim()) params.q = searchTerm.trim();
      if (category !== 'all') params.category = category;
      if (location.trim()) params.location = location.trim();
      if (freeOnly) params.free_only = true;

      const res = await listingsAPI.getAll(params);
      setListings(res.data);
    } catch (err) {
      setError('Could not load marketplace listings. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [category, sortBy, freeOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setLocation('');
    setFreeOnly(false);
    setSortBy('newest');
    setSearchParams({});
    // Trigger reload
    setTimeout(() => {
      listingsAPI.getAll({ sort_by: 'newest', status_filter: 'available' })
        .then(res => setListings(res.data))
        .catch(() => {});
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Circular Economy Exchange
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Industrial Material Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover verified industrial byproducts, regrinds, surplus stocks, and off-cuts.
          </p>
        </div>

        {/* Counter */}
        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
          Showing <span className="font-bold text-slate-900">{listings.length}</span> available streams
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by material (e.g. 6061 Aluminum, HDPE regrind, sawdust, solvent)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or State..."
              className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-2xs whitespace-nowrap"
          >
            Apply Search
          </button>
        </form>

        {/* Category Pills Slider */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                category === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort & Toggle Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-700">Free Materials Only ($0.00)</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="newest">Newest Listed</option>
                <option value="sustainability">Highest Sustainability Score</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="quantity_desc">Highest Quantity</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ErrorAlert message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner message="Querying active circular listings..." />
      ) : listings.length === 0 ? (
        <EmptyState
          title="No material listings matched your filters"
          description="Try broadening your search query or clear the active category filters."
          actionText="Reset Filters"
          actionLink="/marketplace"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}

    </div>
  );
}
