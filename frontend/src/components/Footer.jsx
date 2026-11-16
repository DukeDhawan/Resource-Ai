import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white">
                ReSource <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous AI-driven industrial waste exchange connecting manufacturers, recyclers, and processors to power the circular economy.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <Cpu className="w-4 h-4" />
              <span>Built-in Fallback Demo Engine Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/marketplace" className="hover:text-emerald-400 transition">Browse Materials</Link></li>
              <li><Link to="/requests" className="hover:text-emerald-400 transition">Buyer Demand Feed</Link></li>
              <li><Link to="/matches" className="hover:text-emerald-400 transition">AI Recommendations</Link></li>
              <li><Link to="/impact" className="hover:text-emerald-400 transition">Circularity & Carbon Impact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Material Streams</h4>
            <ul className="space-y-2 text-xs text-slate-400 grid grid-cols-2 gap-x-2">
              <li><Link to="/marketplace?category=metal" className="hover:text-emerald-400 transition">Metal Alloys</Link></li>
              <li><Link to="/marketplace?category=plastic" className="hover:text-emerald-400 transition">Polymers & HDPE</Link></li>
              <li><Link to="/marketplace?category=chemical" className="hover:text-emerald-400 transition">Chemical Solvents</Link></li>
              <li><Link to="/marketplace?category=textile" className="hover:text-emerald-400 transition">Textile Fibers</Link></li>
              <li><Link to="/marketplace?category=wood" className="hover:text-emerald-400 transition">Timber & Biomass</Link></li>
              <li><Link to="/marketplace?category=glass" className="hover:text-emerald-400 transition">Glass Cullet</Link></li>
              <li><Link to="/marketplace?category=construction" className="hover:text-emerald-400 transition">Concrete / Aggregate</Link></li>
              <li><Link to="/marketplace?category=electronic" className="hover:text-emerald-400 transition">E-Waste & PCBs</Link></li>
            </ul>
          </div>

          {/* Compliance & API */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Safety & Compliance</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All hazardous listings undergo automated classification. Transactions strictly adhere to regional environmental EPA & REACH standards.
            </p>
            <a
              href="/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>Explore REST API Documentation</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} ReSource AI. Promoting circular economy & zero-landfill industry.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by</span>
            <span className="text-emerald-400 font-semibold">Gemini AI</span>
            <span>& Circular Heuristics</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
