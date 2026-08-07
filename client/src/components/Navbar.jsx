import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Battery, LogOut, Radio, HeartPulse, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isBatterySaver, setIsBatterySaver, socketConnected }) {
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/welcome');
  };

  const userRole = (role || user?.role || 'GUEST').toUpperCase();

  return (
    <header className="h-16 border-b border-[#8A9992]/20 bg-[#4D2308]/90 backdrop-blur-xl sticky top-0 z-40 px-5 flex items-center justify-between font-sans">
      {/* Brand & System Status */}
      <div className="flex items-center space-x-3">
        <Link to={userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'COMMANDER' ? '/commander/dashboard' : '/victim/dashboard'} className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#55443A] to-[#8A9992] flex items-center justify-center text-white shadow-lg shadow-[#55443A]/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-white flex items-center gap-2">
              DisasterOS <span className="text-[10px] bg-[#8A9992]/20 text-[#8A9992] px-2 py-0.5 rounded-full font-medium border border-[#8A9992]/30">AGENTIC AI</span>
            </span>
            <p className="text-[10px] text-[#8A9992] font-medium -mt-0.5">RBAC Enterprise Portal</p>
          </div>
        </Link>

        {/* Socket Connection Pill */}
        <div className="hidden md:flex items-center space-x-2 ml-3 px-2.5 py-1 rounded-full bg-[#55443A] border border-[#8A9992]/20 text-xs font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-[#22C55E] animate-pulse' : 'bg-[#F59E0B]'}`}></span>
          <span className={socketConnected ? 'text-[#22C55E]' : 'text-[#F59E0B]'}>
            {socketConnected ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Mode / Role Pill & User Controls */}
      <div className="flex items-center space-x-3">
        {/* User Role Badge */}
        {isAuthenticated && (
          <div className="flex items-center space-x-2 bg-[#55443A] px-3 py-1.5 rounded-xl border border-[#8A9992]/30 text-xs font-mono">
            {userRole === 'ADMIN' ? (
              <Lock className="w-3.5 h-3.5 text-[#8A9992]" />
            ) : userRole === 'COMMANDER' ? (
              <Radio className="w-3.5 h-3.5 text-[#8A9992]" />
            ) : (
              <HeartPulse className="w-3.5 h-3.5 text-[#8A9992]" />
            )}
            <span className="font-bold text-[#CFD0CD]">{userRole}</span>
          </div>
        )}

        {/* Battery Saver Mode Toggle */}
        <button
          onClick={() => setIsBatterySaver(!isBatterySaver)}
          title="Toggle OLED Battery Saver Emergency Mode"
          className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
            isBatterySaver
              ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
              : 'bg-[#55443A] border-[#8A9992]/20 text-[#CFD0CD] hover:text-white hover:border-[#8A9992]/40'
          }`}
        >
          <Battery className="w-4 h-4 text-[#8A9992]" />
          <span className="hidden lg:inline">{isBatterySaver ? 'Saver ON' : 'Battery'}</span>
        </button>

        {/* User Info / Logout */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-2 pl-2 border-l border-[#8A9992]/20">
            <div className="w-8 h-8 rounded-full bg-[#55443A] border border-[#8A9992]/40 flex items-center justify-center text-white font-medium text-xs ring-2 ring-[#8A9992]/20">
              {user?.full_name ? user.full_name.charAt(0) : user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-[#CFD0CD] hover:text-white hover:bg-[#55443A] transition-all flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs hidden sm:inline font-mono">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/welcome"
            className="px-4 py-1.5 text-xs font-medium bg-[#55443A] hover:bg-[#4D2308] text-white border border-[#8A9992]/40 rounded-xl transition-all shadow-sm"
          >
            Welcome / Login
          </Link>
        )}
      </div>
    </header>
  );
}
