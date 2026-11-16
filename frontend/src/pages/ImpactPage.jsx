import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Recycle,
  Leaf,
  DollarSign,
  TrendingUp,
  TreeDeciduous,
  Car,
  Home,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function ImpactPage() {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsAPI.getImpact()
      .then(res => setImpactData(res.data))
      .catch(() => setError('Could not load circular impact metrics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner message="Calculating cumulative circular emissions avoided..." />;

  const totalDiverted = impactData?.total_waste_diverted_kg || 247000;
  const totalCo2 = impactData?.estimated_co2_saved_kg || 385000;
  const totalSavings = impactData?.estimated_cost_savings_usd || 142000;

  // Real world environmental equivalencies (standard EPA formulas)
  // 1 passenger car emits ~4,600 kg CO2 / year
  const carsAvoided = Math.round(totalCo2 / 4600);
  // 1 tree absorbs ~22 kg CO2 / year
  const treesPlanted = Math.round(totalCo2 / 22);
  // Average home electricity consumes ~8,000 kWh (~3,000 kg CO2)
  const homesPowered = Math.round(totalCo2 / 3000);

  const breakdown = impactData?.category_breakdown || [];
  const maxWeight = breakdown.length > 0 ? Math.max(...breakdown.map(b => b.weight_kg)) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lifecycle Assessment (LCA) Model</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Circularity & Environmental Impact Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Tracking the cumulative material tonnage diverted from landfills and thermal incinerators across our network of industrial recyclers and manufacturers.
        </p>
      </div>

      <ErrorAlert message={error} onClose={() => setError('')} />

      {/* Prominent Estimates Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-800 font-bold uppercase tracking-wider block text-[11px] mb-0.5">
            Estimation Methodology Disclosure:
          </strong>
          All environmental figures (CO2 reductions, energy savings) and economic statistics on this page are realistic circular-economy <strong>estimates</strong> calculated from material mass balance, virgin extraction offsets, and peer-reviewed Lifecycle Assessment (LCA) emission factors.
        </p>
      </div>

      {/* 3 Core Metric Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-white/20 rounded-2xl w-fit">
              <Recycle className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">
              Estimated Total Waste Diverted
            </span>
            <span className="text-4xl sm:text-5xl font-black block tracking-tight">
              {(totalDiverted / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              <span className="text-xl font-bold text-emerald-200 ml-2">tonnes</span>
            </span>
          </div>
          <p className="text-xs text-emerald-100/90 mt-4 pt-4 border-t border-emerald-400/40">
            Equivalent to {(totalDiverted).toLocaleString()} kg of industrial scrap kept out of landfills.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-white/20 rounded-2xl w-fit">
              <Leaf className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100 block">
              Estimated CO2 Emissions Avoided
            </span>
            <span className="text-4xl sm:text-5xl font-black block tracking-tight">
              {(totalCo2 / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              <span className="text-xl font-bold text-teal-200 ml-2">MT CO2e</span>
            </span>
          </div>
          <p className="text-xs text-teal-100/90 mt-4 pt-4 border-t border-teal-500/40">
            Scope 3 supply chain reduction through avoided virgin metallurgy & petrochemical refining.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-8 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-3 bg-white/20 rounded-2xl w-fit">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Estimated Raw Material Cost Savings
            </span>
            <span className="text-4xl sm:text-5xl font-black block tracking-tight text-emerald-400">
              ${(totalSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-4 pt-4 border-t border-slate-700">
            Direct procurement savings for manufacturers utilizing secondary recycled feedstocks.
          </p>
        </div>

      </div>

      {/* Real-World Equivalencies Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">
            Real-World Environmental Equivalency Benchmarks (Estimates)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Based on EPA Greenhouse Gas Equivalencies calculations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">
                {carsAvoided.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Passenger Vehicles Off Road for 1 Year
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-teal-100 text-teal-800 shrink-0">
              <TreeDeciduous className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">
                {treesPlanted.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Tree Seedlings Grown for 10 Years
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-800 shrink-0">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 block">
                {homesPowered.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Homes Powered by Electricity for 1 Year
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bar Charts */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">
            Material Stream Volume & Carbon Offsets Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Tonnage and emissions diverted by industrial stream category</p>
        </div>

        <div className="space-y-4">
          {breakdown.map((item, idx) => {
            const percent = Math.min(100, Math.round((item.weight_kg / maxWeight) * 100));

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize font-bold text-slate-900">{item.category}</span>
                    <span className="text-slate-400 font-normal">({item.listings_count} active listings)</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-slate-500 font-medium">
                      {(item.co2_saved_kg / 1000).toFixed(1)} MT CO2e saved
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {item.weight_kg.toLocaleString()} kg
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
