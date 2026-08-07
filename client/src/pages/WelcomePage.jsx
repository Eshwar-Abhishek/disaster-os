import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, HeartPulse, ShieldCheck, ArrowRight, Activity, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleEnterPortal = (role) => {
    switchRole(role);
    if (role === 'COMMANDER') navigate('/commander/dashboard');
    else if (role === 'VICTIM') navigate('/victim/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#4D2308] text-white flex flex-col items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden selection:bg-[#8A9992] selection:text-[#4D2308]">
      {/* Apple-style Subtle Atmospheric Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8A9992]/15 to-[#55443A]/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8A9992]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#55443A]/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl w-full space-y-12 z-10 text-center py-6">
        {/* Top Header Badge & Apple-inspired Title */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8A9992]/15 border border-[#8A9992]/30 text-xs font-mono text-[#CFD0CD] shadow-lg backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-[#8A9992] animate-pulse" />
            <span className="font-semibold uppercase tracking-widest text-[11px]">Instant Access • Zero Authentication Delays</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans">
            RESQ <span className="bg-gradient-to-r from-[#CFD0CD] via-[#8A9992] to-[#8A9992] bg-clip-text text-transparent">DisasterOS</span> Commander
          </h1>
          <p className="text-sm md:text-base text-[#8A9992] font-mono leading-relaxed max-w-xl mx-auto">
            Autonomous Multi-Agent Emergency Operations & Citizen Response Infrastructure
          </p>
        </div>

        {/* 3 Premium Large Apple-Inspired Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
          {/* Card 1: Commander Portal */}
          <div 
            onClick={() => handleEnterPortal('COMMANDER')}
            className="group relative bg-[#55443A]/40 backdrop-blur-xl p-8 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992]/80 transition-all duration-500 shadow-2xl hover:shadow-[#8A9992]/10 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center text-[#CFD0CD] group-hover:scale-110 group-hover:bg-[#8A9992] group-hover:text-[#4D2308] transition-all duration-500 shadow-lg">
                <Radio className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white group-hover:text-[#CFD0CD] transition-colors">
                  Commander Portal
                </h2>
                <p className="text-xs md:text-sm text-[#8A9992] leading-relaxed font-sans">
                  Real-time EOC telemetry, autonomous AI resource allocation, casualty triage, and incident field deployment.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                className="w-full py-3.5 px-5 bg-[#8A9992]/20 group-hover:bg-[#8A9992] text-[#CFD0CD] group-hover:text-[#4D2308] font-bold text-xs rounded-2xl transition-all duration-300 border border-[#8A9992]/30 flex items-center justify-between shadow-md"
              >
                <span>Enter Commander Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Card 2: Victim Portal */}
          <div 
            onClick={() => handleEnterPortal('VICTIM')}
            className="group relative bg-[#55443A]/40 backdrop-blur-xl p-8 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992]/80 transition-all duration-500 shadow-2xl hover:shadow-[#8A9992]/10 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center text-[#CFD0CD] group-hover:scale-110 group-hover:bg-[#8A9992] group-hover:text-[#4D2308] transition-all duration-500 shadow-lg">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white group-hover:text-[#CFD0CD] transition-colors">
                  Victim Portal
                </h2>
                <p className="text-xs md:text-sm text-[#8A9992] leading-relaxed font-sans">
                  Instant SOS emergency beacon, offline medical guides, family locator, and shelter navigation.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                className="w-full py-3.5 px-5 bg-[#8A9992]/20 group-hover:bg-[#8A9992] text-[#CFD0CD] group-hover:text-[#4D2308] font-bold text-xs rounded-2xl transition-all duration-300 border border-[#8A9992]/30 flex items-center justify-between shadow-md"
              >
                <span>Enter Victim Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Card 3: Admin Portal */}
          <div 
            onClick={() => handleEnterPortal('ADMIN')}
            className="group relative bg-[#55443A]/40 backdrop-blur-xl p-8 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992]/80 transition-all duration-500 shadow-2xl hover:shadow-[#8A9992]/10 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center text-[#CFD0CD] group-hover:scale-110 group-hover:bg-[#8A9992] group-hover:text-[#4D2308] transition-all duration-500 shadow-lg">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white group-hover:text-[#CFD0CD] transition-colors">
                  Admin Portal
                </h2>
                <p className="text-xs md:text-sm text-[#8A9992] leading-relaxed font-sans">
                  System governance, officer credential verifications, security audit logs, and global parameters.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="button"
                className="w-full py-3.5 px-5 bg-[#8A9992]/20 group-hover:bg-[#8A9992] text-[#CFD0CD] group-hover:text-[#4D2308] font-bold text-xs rounded-2xl transition-all duration-300 border border-[#8A9992]/30 flex items-center justify-between shadow-md"
              >
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom System Operational Footer */}
        <div className="pt-6 border-t border-[#8A9992]/15 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#8A9992] gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
            <span>EOC Nodes Active • Socket.IO Engine Operational</span>
          </div>
          <div>RESQ Emergency Response Agentic Framework v2.4</div>
        </div>
      </div>
    </div>
  );
}
