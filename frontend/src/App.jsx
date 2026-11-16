import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import ListingDetailPage from './pages/ListingDetailPage';
import AddEditListingPage from './pages/AddEditListingPage';
import RequestsPage from './pages/RequestsPage';
import MatchesPage from './pages/MatchesPage';
import InquiriesPage from './pages/InquiriesPage';
import DashboardPage from './pages/DashboardPage';
import ImpactPage from './pages/ImpactPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/requests" element={<RequestsPage />} />
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/impact" element={<ImpactPage />} />

              {/* Protected Routes */}
              <Route
                path="/listings/new"
                element={
                  <ProtectedRoute requiredRole="Supplier">
                    <AddEditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/listings/:id/edit"
                element={
                  <ProtectedRoute requiredRole="Supplier">
                    <AddEditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inquiries"
                element={
                  <ProtectedRoute>
                    <InquiriesPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
