import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Recycle,
  Sparkles,
  ShoppingBag,
  FileQuestion,
  Layers,
  BarChart3,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  Cpu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { inquiriesAPI } from '../services/api';

export default function Navbar() {
  const { user, isAuthenticated, logout, isSupplier } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUnread = async () => {
        try {
          const res = await inquiriesAPI.getUnreadCount();
          setUnreadCount(res.data.unread_count || 0);
        } catch (err) {
          // ignore background errors
        }
      };
      fetchUnread();
      const interval = setInterval(fetchUnread, 15000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
      isActive
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md group-hover:scale-105 transition-transform">
                <Recycle className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  ReSource <span className="text-emerald-600">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1">
                  Circular Waste Exchange
                </span>
              </div>
            </Link>

            {/* Small Demo AI Mode badge */}
            <div className="hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-600">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart AI Engine Ready</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/marketplace" className={navItemClass}>
              <ShoppingBag className="w-4 h-4" />
              <span>Marketplace</span>
            </NavLink>

            <NavLink to="/requests" className={navItemClass}>
              <FileQuestion className="w-4 h-4" />
              <span>Requests</span>
            </NavLink>

            <NavLink to="/matches" className={navItemClass}>
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Matches</span>
            </NavLink>

            <NavLink to="/impact" className={navItemClass}>
              <BarChart3 className="w-4 h-4" />
              <span>Impact</span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/inquiries" className={navItemClass}>
                  <div className="relative">
                    <MessageSquare className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[9px] font-black animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span>Inquiries</span>
                </NavLink>

                <NavLink to="/dashboard" className={navItemClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* User & CTA Area */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isSupplier && (
                  <Link
                    to="/listings/new"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Material</span>
                  </Link>
                )}

                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.company_name}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                >
                  Join Exchange
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace</span>
          </NavLink>

          <NavLink
            to="/requests"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <FileQuestion className="w-4 h-4" />
            <span>Buyer Requests</span>
          </NavLink>

          <NavLink
            to="/matches"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Matches</span>
          </NavLink>

          <NavLink
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Impact Statistics</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/inquiries"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Inquiries & Chat</span>
                </div>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard ({user?.company_name})</span>
              </NavLink>

              {isSupplier && (
                <NavLink
                  to="/listings/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Material Listing</span>
                </NavLink>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600"
              >
                Join Exchange
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
