import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Recycle, Lock, Mail, ArrowRight, Sparkles, Building2, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-600 text-white shadow-md mb-3">
          <Recycle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Sign In to ReSource AI
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access the industrial circular marketplace and AI matching hub
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm sm:rounded-3xl border border-slate-200/80 sm:px-10 space-y-6">
          
          <ErrorAlert message={error} onClose={() => setError('')} />

          {/* 1-Click Demo Logins */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              1-Click Instant Demo Login
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('supplier@demo.com', 'password123')}
                disabled={loading}
                className="flex items-center space-x-2 p-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-left transition text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-bold">Supplier Demo</span>
                  <span className="text-[10px] text-slate-500 font-normal">Apex EcoMaterials</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('buyer@demo.com', 'password123')}
                disabled={loading}
                className="flex items-center space-x-2 p-2.5 rounded-xl border border-teal-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-left transition text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 font-bold">Buyer Demo</span>
                  <span className="text-[10px] text-slate-500 font-normal">GreenForge Mfg</span>
                </div>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center">
              Password: <code className="bg-slate-200/70 px-1 py-0.5 rounded font-mono text-slate-700">password123</code>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-bold tracking-wider">Or with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Company Email
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@company.com"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">
              Don't have an enterprise account?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
                Register here
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
