import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Recycle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Factory,
  Globe,
  Leaf,
  Layers,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { analyticsAPI } from '../services/api';

export default function LandingPage() {
  const [stats, setStats] = useState({
    total_waste_diverted_kg: 247000,
    estimated_co2_saved_kg: 385000,
    estimated_cost_savings_usd: 142000,
    active_listings_count: 21,
    registered_companies_count: 2
  });

  useEffect(() => {
    analyticsAPI.getImpact()
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  const categories = [
    { name: 'Metal Alloys', count: '6061 Al, Structural Steel, Copper', icon: '⚙️', slug: 'metal' },
    { name: 'Polymers & Plastics', count: 'HDPE Regrind, PP Woven, PET', icon: '🧪', slug: 'plastic' },
    { name: 'Chemical Streams', count: 'Recovered Solvents, Glycerin', icon: '⚗️', slug: 'chemical' },
    { name: 'Textile Byproducts', count: 'Denim Clippings, Wool Felt', icon: '🧵', slug: 'textile' },
    { name: 'Timber & Sawdust', count: 'Kiln Pine, Oak Pallets', icon: '🪵', slug: 'wood' },
    { name: 'Industrial Glass', count: 'Borosilicate Cullet, Amber Glass', icon: '🫙', slug: 'glass' },
    { name: 'Organic Mash', count: 'Spent Brewer Grain, Roaster Chaff', icon: '🌱', slug: 'organic' },
    { name: 'Aggregates', count: 'Crushed Concrete, Recycled Gypsum', icon: '🧱', slug: 'construction' },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Next-Generation Industrial Circular Economy Platform</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Turn Industrial Waste Into <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                High-Value Raw Resources
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              ReSource AI uses multimodal AI to autonomously classify manufacturing byproducts, identify viable reuse applications, and match suppliers with industrial buyers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition space-x-2 group"
              >
                <span>Explore Circular Materials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition"
              >
                <span>Join as Supplier or Buyer</span>
              </Link>
            </div>

            {/* Demo AI Mode banner */}
            <div className="pt-2">
              <span className="inline-flex items-center text-xs text-slate-500 bg-white/80 border border-slate-200 rounded-lg px-3 py-1 shadow-2xs">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                Zero setup required &mdash; runs out of the box with intelligent fallback demo AI mode!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Counters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3">
              <Recycle className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
              {(stats.total_waste_diverted_kg / 1000).toFixed(1)}k <span className="text-sm font-semibold text-slate-400">kg</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Waste Diverted from Landfills*
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl w-fit mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
              {(stats.estimated_co2_saved_kg / 1000).toFixed(1)}k <span className="text-sm font-semibold text-slate-400">kg</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Estimated CO2 Avoided*
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
              ${(stats.estimated_cost_savings_usd / 1000).toFixed(1)}k
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Estimated Raw Material Savings*
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-3">
              <Factory className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">
              {stats.active_listings_count}
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">
              Active Circular Material Streams
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-3">* Realistic estimates based on lifecycle assessment models.</p>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Intelligent Circular Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How ReSource AI Closes the Industrial Loop
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-lg">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900">Autonomous AI Material Assessment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Suppliers post unused lots or byproduct streams. The AI instantly categorizes the material, assesses composition, verifies hazardous status, and assigns a sustainability rating.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-lg">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900">Multi-Dimensional Match Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our matching algorithm correlates buyer specifications, quantity requirements, geographic logistics, and AI reuse recommendations to score compatibility (0-100).
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 font-extrabold flex items-center justify-center text-lg">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900">Direct Negotiated Exchange</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buyers and suppliers connect via threaded messaging to verify certifications, agree on logistics or pickup, and divert materials from landfills into new products.
            </p>
          </div>
        </div>
      </section>

      {/* Material Streams Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Explore Available Material Categories
            </h2>
            <p className="text-xs text-slate-500 mt-1">High-quality segregated secondary industrial streams</p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/marketplace?category=${cat.slug}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all group"
            >
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Demo Credentials Callout Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Instant Demo Access</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to test ReSource AI?</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pre-loaded with 21 realistic industrial listings across metals, plastics, chemicals, textiles, and wood, plus 8 buyer demand requests and 2 ready-to-test corporate accounts.
            </p>
            <div className="flex flex-wrap gap-4 text-xs pt-2">
              <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Supplier Demo:</span>
                <span className="font-mono font-bold text-emerald-300">supplier@demo.com</span>
              </div>
              <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Buyer Demo:</span>
                <span className="font-mono font-bold text-teal-300">buyer@demo.com</span>
              </div>
              <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                <span className="text-slate-400 block text-[10px]">Demo Password:</span>
                <span className="font-mono font-bold text-slate-200">password123</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition text-center shadow-md"
            >
              1-Click Demo Login
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
