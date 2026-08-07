import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Battery, LogOut, Radio, HeartPulse, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ isBatterySaver, setIsBatterySaver, socketConnected }) {
  const navigate = useNavigate();
  const { user, role, logout, isAuthenticated, switchRole } = useAuth();

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
        {/* 1-Click Demo Portal Switcher */}
        <div className="flex bg-[#55443A] p-1 rounded-xl border border-[#8A9992]/30 text-xs font-mono">
          <button
            onClick={() => { switchRole('COMMANDER'); navigate('/commander/dashboard'); }}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              userRole === 'COMMANDER' || userRole === 'OPERATOR' ? 'bg-[#8A9992] text-[#4D2308] shadow' : 'text-[#CFD0CD] hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Commander</span>
          </button>

          <button
            onClick={() => { switchRole('VICTIM'); navigate('/victim/dashboard'); }}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              userRole === 'VICTIM' || userRole === 'CITIZEN' ? 'bg-[#8A9992] text-[#4D2308] shadow' : 'text-[#CFD0CD] hover:text-white'
            }`}
          >
            <HeartPulse className="w-3 h-3" />
            <span>Victim</span>
          </button>

          <button
            onClick={() => { switchRole('ADMIN'); navigate('/admin/dashboard'); }}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
              userRole === 'ADMIN' ? 'bg-[#8A9992] text-[#4D2308] shadow' : 'text-[#CFD0CD] hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

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
      </div>
    </header>
  );
}
