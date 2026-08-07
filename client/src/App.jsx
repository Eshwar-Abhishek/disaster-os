import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';

import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CommanderAccessRequestPage from './pages/CommanderAccessRequestPage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import CommanderDashboardPage from './pages/CommanderDashboardPage';
import VictimDashboardPage from './pages/VictimDashboardPage';

import DashboardPage from './pages/DashboardPage';
import VictimSurvivalPage from './pages/VictimSurvivalPage';
import ChildRescuePage from './pages/ChildRescuePage';
import AnimalRescuePage from './pages/AnimalRescuePage';
import IncidentReportingPage from './pages/IncidentReportingPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import LiveMapPage from './pages/LiveMapPage';
import ResourcesPage from './pages/ResourcesPage';
import HospitalsPage from './pages/HospitalsPage';
import SheltersPage from './pages/SheltersPage';
import NotificationsPage from './pages/NotificationsPage';
import AIDecisionsPage from './pages/AIDecisionsPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import FamilyLocatorPage from './pages/FamilyLocatorPage';
import PreparednessPage from './pages/PreparednessPage';
import ProfilePage from './pages/ProfilePage';
import NearbyFinderPage from './pages/NearbyFinderPage';

function RootRedirect() {
  const { role } = useAuth();
  const uRole = (role || 'COMMANDER').toUpperCase();
  if (uRole === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (uRole === 'VICTIM' || uRole === 'CITIZEN') return <Navigate to="/victim/dashboard" replace />;
  return <Navigate to="/commander/dashboard" replace />;
}

function getSocketUrl() {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' && window.location.port !== '5000') {
      return 'http://localhost:5000';
    }
    if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app')) {
      return 'https://disaster-os.onrender.com';
    }
  }
  return '/';
}

function MainAppLayout() {
  const [isBatterySaver, setIsBatterySaver] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socket = io(getSocketUrl(), { 
      path: '/socket.io', 
      autoConnect: true,
      reconnectionAttempts: 5,
      timeout: 8000,
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className={`min-h-screen bg-[#4D2308] text-[#CFD0CD] flex flex-col ${isBatterySaver ? 'battery-saver-mode' : ''}`}>
      <Navbar
        isBatterySaver={isBatterySaver}
        setIsBatterySaver={setIsBatterySaver}
        socketConnected={socketConnected}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            {/* Default Root Redirect - Commander Dashboard 1st */}
            <Route path="/" element={<Navigate to="/commander/dashboard" replace />} />

            {/* Public Auth & Portal Selection Routes */}
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/commander-request" element={<CommanderAccessRequestPage />} />

            {/* Role Dashboards */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/commander/dashboard" element={<CommanderDashboardPage />} />
            <Route path="/victim/dashboard" element={<VictimDashboardPage />} />

            {/* Feature Routes Protected by RBAC */}
            <Route
              path="/incidents"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN']}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidents/:id"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN', 'VICTIM']}>
                  <IncidentDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survival"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <VictimSurvivalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/victim-survival"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <VictimSurvivalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nearby-finder"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <NearbyFinderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nearby"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <NearbyFinderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/child-rescue"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'ADMIN']}>
                  <ChildRescuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/animal-rescue"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <AnimalRescuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report-incident"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <IncidentReportingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/live-map"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN', 'VICTIM']}>
                  <LiveMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN']}>
                  <ResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospitals"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN', 'VICTIM']}>
                  <HospitalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shelters"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN', 'VICTIM']}>
                  <SheltersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-decisions"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN']}>
                  <AIDecisionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['COMMANDER', 'ADMIN']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/family-locator"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <FamilyLocatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preparedness"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <PreparednessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['VICTIM', 'COMMANDER', 'ADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainAppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
