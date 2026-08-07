import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ShieldAlert, UserCheck, HeartPulse, ArrowRight, FileCheck, Lock, Radio } from 'lucide-react';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#4D2308] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8A9992]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#55443A]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full space-y-8 text-center z-10 py-8">
        {/* Header Branding */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#8A9992]/20 border-2 border-[#8A9992]/40 flex items-center justify-center mx-auto text-[#8A9992] shadow-2xl">
            <Shield className="w-9 h-9 text-[#CFD0CD] animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-sans">
            RESQ <span className="text-[#8A9992]">DisasterOS</span>
          </h1>
          <p className="text-xs md:text-sm text-[#8A9992] font-mono max-w-lg mx-auto leading-relaxed">
            Multi-Agent AI Emergency Response Operations & Victim Survival Portal
          </p>
        </div>

        {/* 3 Main Role Login Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Commander Login */}
          <div 
            onClick={() => navigate('/login?tab=commander')}
            className="glass-panel p-5 rounded-3xl space-y-3 cursor-pointer hover:border-[#8A9992] transition group border border-[#8A9992]/20 shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center group-hover:scale-110 transition">
              <ShieldAlert className="w-5 h-5 text-[#CFD0CD]" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white group-hover:text-[#8A9992] transition">Commander Login</h3>
              <p className="text-[11px] text-[#8A9992] font-mono mt-1">Incident Operations, Map & Resource Deployment</p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#8A9992] flex items-center gap-1 font-bold">
              <span>Access Operations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Victim Login */}
          <div 
            onClick={() => navigate('/login?tab=victim')}
            className="glass-panel p-5 rounded-3xl space-y-3 cursor-pointer hover:border-[#8A9992] transition group border border-[#8A9992]/20 shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center group-hover:scale-110 transition">
              <HeartPulse className="w-5 h-5 text-[#CFD0CD]" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white group-hover:text-[#8A9992] transition">Victim Login</h3>
              <p className="text-[11px] text-[#8A9992] font-mono mt-1">SOS Beacon, Medical AI & Supply Requests</p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#8A9992] flex items-center gap-1 font-bold">
              <span>Access Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Admin Login */}
          <div 
            onClick={() => navigate('/login?tab=admin')}
            className="glass-panel p-5 rounded-3xl space-y-3 cursor-pointer hover:border-[#8A9992] transition group border border-[#8A9992]/20 shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center group-hover:scale-110 transition">
              <Lock className="w-5 h-5 text-[#CFD0CD]" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white group-hover:text-[#8A9992] transition">Admin Login</h3>
              <p className="text-[11px] text-[#8A9992] font-mono mt-1">Full System Control & Commander Approvals</p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#8A9992] flex items-center gap-1 font-bold">
              <span>System Control</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* New User Section */}
        <div className="p-6 rounded-3xl bg-[#55443A]/90 border border-[#8A9992]/30 shadow-2xl space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-3">
            <h4 className="font-semibold text-sm text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#8A9992]" />
              New User?
            </h4>
            <span className="text-[10px] font-mono text-[#8A9992] bg-[#4D2308] px-2.5 py-1 rounded-lg border border-[#8A9992]/20">
              CREATE / REQUEST ACCOUNT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => navigate('/register')}
              className="p-3.5 rounded-xl bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 transition font-bold flex items-center justify-between group"
            >
              <div className="text-left">
                <span className="block font-semibold">Register as Victim</span>
                <span className="text-[10px] text-[#8A9992] group-hover:text-[#4D2308] block font-mono font-normal">Immediate public account creation</span>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => navigate('/commander-request')}
              className="p-3.5 rounded-xl bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 transition font-bold flex items-center justify-between group"
            >
              <div className="text-left">
                <span className="block font-semibold">Commander Access Request</span>
                <span className="text-[10px] text-[#8A9992] group-hover:text-[#4D2308] block font-mono font-normal">Government credentials verification</span>
              </div>
              <FileCheck className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <p className="text-[11px] font-mono text-[#8A9992] text-center pt-1">
            ⚠️ Direct Commander registration is disabled. Commander access requires official Admin approval.
          </p>
        </div>
      </div>
    </div>
  );
}
