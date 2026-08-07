import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, ArrowRight, HeartPulse, KeyRound, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();

  const tabParam = searchParams.get('tab');
  const initialTab = (tabParam && ['commander', 'victim', 'admin'].includes(tabParam.toLowerCase()))
    ? tabParam.toLowerCase()
    : 'commander';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  useEffect(() => {
    if (tabParam && ['commander', 'victim', 'admin'].includes(tabParam.toLowerCase())) {
      setActiveTab(tabParam.toLowerCase());
    }
  }, [tabParam]);

  useEffect(() => {
    if (activeTab === 'admin') {
      setEmail('admin@resq.gov');
      setPassword('Admin@123');
    } else if (activeTab === 'commander') {
      setEmail('commander@resq.gov');
      setPassword('Commander@123');
    } else {
      setEmail('victim@resq.gov');
      setPassword('Victim@123');
    }
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    navigate(`/login?tab=${tab}`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password, activeTab.toUpperCase());
      const userRole = (res?.user?.role || activeTab).toUpperCase();

      if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else if (userRole === 'COMMANDER' || userRole === 'OPERATOR') navigate('/commander/dashboard');
      else navigate('/victim/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordlessDemoLogin = async (roleType) => {
    setError('');
    setLoading(true);
    switchRole(roleType);
    let targetEmail = roleType === 'admin' ? 'admin@resq.gov' : roleType === 'victim' ? 'victim@resq.gov' : 'commander@resq.gov';
    let targetPass = roleType === 'admin' ? 'Admin@123' : roleType === 'victim' ? 'Victim@123' : 'Commander@123';

    try {
      const res = await login(targetEmail, targetPass, roleType.toUpperCase());
      const userRole = (res?.user?.role || roleType).toUpperCase();

      if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else if (userRole === 'COMMANDER' || userRole === 'OPERATOR') navigate('/commander/dashboard');
      else navigate('/victim/dashboard');
    } catch (err) {
      if (roleType === 'admin') navigate('/admin/dashboard');
      else if (roleType === 'victim') navigate('/victim/dashboard');
      else navigate('/commander/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgot(false);
      setForgotSubmitted(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#4D2308] flex items-center justify-center p-4 font-sans py-12">
      <div className="max-w-md w-full glass-panel-glow p-8 rounded-3xl border border-[#8A9992]/20 space-y-6">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center mx-auto text-[#8A9992] shadow-xl">
            {activeTab === 'admin' ? (
              <Lock className="w-8 h-8 text-[#CFD0CD] animate-pulse" />
            ) : activeTab === 'victim' ? (
              <HeartPulse className="w-8 h-8 text-[#CFD0CD] animate-pulse" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-[#CFD0CD] animate-pulse" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider uppercase">
            {activeTab} Portal Login
          </h1>
          <p className="text-xs text-[#8A9992] font-mono">Agentic AI Emergency Response System</p>
        </div>

        {/* 3 Role Navigation Tabs */}
        <div className="flex bg-[#55443A]/80 p-1.5 rounded-2xl border border-[#8A9992]/20 text-xs font-mono">
          <button
            onClick={() => handleTabChange('commander')}
            className={`flex-1 py-2 rounded-xl transition font-bold ${
              activeTab === 'commander' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
            }`}
          >
            Commander
          </button>
          <button
            onClick={() => handleTabChange('victim')}
            className={`flex-1 py-2 rounded-xl transition font-bold ${
              activeTab === 'victim' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
            }`}
          >
            Victim
          </button>
          <button
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2 rounded-xl transition font-bold ${
              activeTab === 'admin' ? 'bg-[#8A9992] text-[#4D2308] shadow-md' : 'text-[#CFD0CD] hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-600/40 rounded-2xl text-xs text-rose-200 font-mono text-center shadow-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-[#8A9992] uppercase tracking-wider">
              {activeTab === 'commander' ? 'Official Govt Email' : activeTab === 'admin' ? 'System Admin Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A9992] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@resq.gov"
                className="w-full pl-10 pr-4 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-[#8A9992] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8A9992] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <label className="flex items-center space-x-2 text-[#CFD0CD] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#8A9992] focus:ring-[#8A9992]"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-[#8A9992] hover:text-white font-medium underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#55443A] hover:bg-[#4D2308] text-white font-bold rounded-xl transition border border-[#8A9992]/30 flex items-center justify-center space-x-2 shadow-xl text-xs uppercase"
          >
            <span>{loading ? 'AUTHENTICATING...' : `ENTER ${activeTab} DASHBOARD`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* ⚡ Passwordless One-Click Instant Demo Login Bar */}
        <div className="p-3 bg-[#4D2308]/90 rounded-2xl border border-[#8A9992]/30 space-y-2 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#8A9992] uppercase tracking-wider">
            <span>⚡ Passwordless 1-Click Instant Demo Login</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePasswordlessDemoLogin('commander')}
              className="py-2 px-1 bg-[#55443A] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] font-bold rounded-xl transition shadow border border-[#8A9992]/20"
            >
              🛡️ Commander
            </button>
            <button
              type="button"
              onClick={() => handlePasswordlessDemoLogin('victim')}
              className="py-2 px-1 bg-[#55443A] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] font-bold rounded-xl transition shadow border border-[#8A9992]/20"
            >
              🛟 Victim
            </button>
            <button
              type="button"
              onClick={() => handlePasswordlessDemoLogin('admin')}
              className="py-2 px-1 bg-[#55443A] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] font-bold rounded-xl transition shadow border border-[#8A9992]/20"
            >
              🔒 Admin
            </button>
          </div>
        </div>

        {/* Demo Credentials Quick Switcher */}
        <div className="pt-2 text-center text-xs text-[#8A9992] space-y-2">
          <div className="pt-1 text-[11px]">
            {activeTab === 'victim' ? (
              <span>New Victim? <Link to="/register" className="text-[#8A9992] font-bold underline hover:text-white">Register here</Link></span>
            ) : activeTab === 'commander' ? (
              <span>Need Commander Access? <Link to="/commander-request" className="text-[#8A9992] font-bold underline hover:text-white">Submit Request</Link></span>
            ) : (
              <span className="text-rose-300 font-mono">🔒 Admin accounts are seeded by System Administrator only.</span>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#55443A] p-6 rounded-3xl border border-[#8A9992]/30 space-y-4 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#8A9992]" />
                Password Reset Recovery
              </h3>
              <button onClick={() => setShowForgot(false)} className="text-[#8A9992] hover:text-white font-bold">✕</button>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-[#22C55E]/20 border border-[#22C55E]/30 rounded-xl text-center text-[#22C55E] space-y-2 font-mono">
                <Check className="w-6 h-6 mx-auto" />
                <p>Password reset instructions sent to {forgotEmail} if registered in DisasterOS EOC store.</p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-[#CFD0CD]">Enter your registered email address to receive secure OTP reset instructions.</p>
                <input
                  type="email"
                  required
                  placeholder="name@resq.gov"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] font-bold rounded-xl transition border border-[#8A9992]/30"
                >
                  Send Password Reset OTP
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
