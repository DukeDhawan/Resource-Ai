import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  ArrowLeft,
  X,
  FileCheck,
  AlertTriangle,
  Send,
  Loader2,
  Cpu
} from 'lucide-react';
import { listingsAPI, aiAPI } from '../services/api';
import AIAnalysisCard from '../components/AIAnalysisCard';
import ErrorAlert from '../components/ErrorAlert';

const CATEGORIES = [
  { id: 'metal', label: 'Metal' },
  { id: 'plastic', label: 'Plastic' },
  { id: 'chemical', label: 'Chemical' },
  { id: 'textile', label: 'Textile' },
  { id: 'wood', label: 'Wood & Biomass' },
  { id: 'glass', label: 'Glass' },
  { id: 'organic', label: 'Organic' },
  { id: 'construction', label: 'Construction' },
  { id: 'electronic', label: 'E-Waste & Electronics' },
  { id: 'other', label: 'Other' },
];

export default function AddEditListingPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('metal');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [priceType, setPriceType] = useState('fixed');
  const [price, setPrice] = useState('0.00');
  const [location, setLocation] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('available');

  // File upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Live AI Preview state
  const [aiPreview, setAiPreview] = useState(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiAnalysisDone, setAiAnalysisDone] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      listingsAPI.getById(id)
        .then((res) => {
          const l = res.data;
          setTitle(l.title);
          setDescription(l.description);
          setCategory(l.category);
          setQuantity(l.quantity);
          setUnit(l.unit);
          setPriceType(l.price_type);
          setPrice(l.price);
          setLocation(l.location);
          setAvailabilityStatus(l.availability_status);
          if (l.image_url) setImagePreview(l.image_url);
        })
        .catch(() => setError('Could not load listing details for editing.'));
    }
  }, [id, isEditing]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Selected image exceeds maximum 5 MB limit.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRunAIAnalysis = async () => {
    if (!description.trim()) {
      setError('Please provide a description to enable AI material assessment.');
      return;
    }
    setAnalyzingAI(true);
    setError('');
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('image', imageFile);
        const res = await aiAPI.analyzeUpload(formData);
        setAiPreview(res.data);
        if (res.data.category && res.data.category !== 'other') {
          setCategory(res.data.category);
        }
      } else {
        const res = await aiAPI.analyzeText({ title, description });
        setAiPreview(res.data);
        if (res.data.category && res.data.category !== 'other') {
          setCategory(res.data.category);
        }
      }
      setAiAnalysisDone(true);
    } catch (err) {
      setError('AI assessment failed. Will use smart rule-based assessment on submission.');
    } finally {
      setAnalyzingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await listingsAPI.update(id, {
          title,
          description,
          category,
          quantity: parseFloat(quantity),
          unit,
          price_type: priceType,
          price: priceType === 'free' ? 0 : parseFloat(price),
          location,
          availability_status: availabilityStatus,
        });
        navigate(`/listings/${id}`);
      } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('quantity', parseFloat(quantity));
        formData.append('unit', unit);
        formData.append('price_type', priceType);
        formData.append('price', priceType === 'free' ? 0 : parseFloat(price));
        formData.append('location', location);
        formData.append('availability_status', availabilityStatus);
        if (imageFile) {
          formData.append('image', imageFile);
        }

        const res = await listingsAPI.create(formData);
        navigate(`/listings/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save material listing. Check field requirements.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Supplier Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isEditing ? "Edit Material Listing" : "Post New Industrial Stream"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish surplus or scrap materials for circular repurposing and AI buyer matching.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Multimodal AI Powered</span>
        </div>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic specifications */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Material Identification
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Material Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 6061-T6 Aluminum Billet Turnings & Shavings"
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Facility Location (City, State) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chicago, IL"
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Detailed Material Description *
              </label>
              <button
                type="button"
                onClick={handleRunAIAnalysis}
                disabled={analyzingAI || !description.trim()}
                className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:opacity-40"
              >
                {analyzingAI ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>Run Instant AI Assessment</span>
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the industrial origin, alloy/polymer grade, contamination levels, packaging (bales, gaylords, drums), and storage condition..."
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden leading-relaxed"
            />
          </div>

          {/* Image upload area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Material Photo (Optional, Max 5 MB)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition w-full sm:w-1/2 text-center">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">Click to upload material photo</span>
                <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5 MB</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-full sm:w-1/2 h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quantity & Exchange Terms */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            2. Quantity & Commercial Terms
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Available Quantity *
              </label>
              <input
                type="number"
                required
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unit of Measure *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="tonnes">tonnes (Metric Tons)</option>
                <option value="litres">litres (Liters)</option>
                <option value="units">units (Pallets / Items)</option>
                <option value="meters">meters</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Price Structure *
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              >
                <option value="fixed">Fixed Price ($ per unit)</option>
                <option value="free">Free for Hauler / Processor ($0.00)</option>
                <option value="negotiable">Negotiable on Inquiry</option>
              </select>
            </div>

            {priceType !== 'free' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Price ($ per {unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Live AI Analysis Preview if available */}
        {aiPreview && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Live AI Assessment Preview
            </span>
            <AIAnalysisCard analysis={aiPreview} />
          </div>
        )}

        {/* Submit button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            to="/dashboard"
            className="px-5 py-3 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? "Publishing Stream..." : isEditing ? "Save Changes" : "Publish to Circular Marketplace"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
