import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, ArrowRight, Building, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { api } from '../services/api';

export default function CommanderAccessRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    officialEmail: '',
    phone: '',
    govOrg: '',
    department: '',
    employeeId: '',
    designation: '',
    region: 'Sector 4 - Urban',
    reason: '',
    govIdUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.requestCommanderAccess(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit Commander access request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4D2308] flex items-center justify-center p-4 font-sans py-12">
      <div className="max-w-2xl w-full glass-panel-glow p-8 rounded-3xl border border-[#8A9992]/20 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center mx-auto text-[#8A9992] shadow-xl">
            <FileCheck className="w-8 h-8 text-[#CFD0CD]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">Request Commander Access</h1>
          <p className="text-xs text-[#8A9992] font-mono">Government Officer Verification & EOC Clearance</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        {submitted ? (
          <div className="p-6 bg-[#55443A] border-2 border-[#22C55E]/40 rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Commander Request Submitted!</h3>
            <p className="text-xs text-[#CFD0CD] leading-relaxed max-w-md mx-auto">
              Your government credentials for <span className="text-[#8A9992] font-bold">{formData.officialEmail}</span> have been sent to the System Administrator. Once approved, your Commander account will be activated.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/commander/dashboard')}
                className="px-6 py-2.5 bg-[#8A9992] hover:bg-[#CFD0CD] text-[#4D2308] font-bold text-xs rounded-xl transition"
              >
                Go to Commander Portal →
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-[#8A9992] uppercase">Commander Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Officer Name"
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-[#8A9992] uppercase">Official Govt Email *</label>
                <input
                  type="email"
                  required
                  name="officialEmail"
                  value={formData.officialEmail}
                  onChange={handleChange}
                  placeholder="officer@ndrf.gov.in"
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-[#8A9992] uppercase">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-[#8A9992] uppercase">Government Agency / Org *</label>
                <input
                  type="text"
                  required
                  name="govOrg"
                  value={formData.govOrg}
                  onChange={handleChange}
                  placeholder="NDRF / SDMA / Fire & Rescue"
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8A9992] mb-1">EMPLOYEE / BADGE ID *</label>
                <input
                  type="text"
                  required
                  placeholder="NDMA-8842-TX"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8A9992] mb-1">DESIGNATION *</label>
                <input
                  type="text"
                  required
                  placeholder="Field Commander"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#8A9992] mb-1">COMMAND REGION *</label>
                <input
                  type="text"
                  required
                  placeholder="Sector 4 - Urban West"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">REASON FOR ACCESS REQUEST *</label>
              <textarea
                rows={3}
                required
                placeholder="Explain disaster response mission objectives..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">UPLOAD GOVERNMENT ID / BADGE CREDENTIAL *</label>
              <div className="p-4 bg-[#55443A] border-2 border-dashed border-[#8A9992]/40 rounded-2xl text-center space-y-2">
                <Upload className="w-6 h-6 text-[#8A9992] mx-auto" />
                <p className="text-xs text-[#CFD0CD] font-mono">Drag & Drop or Click to Attach Official ID Document</p>
                <input
                  type="text"
                  placeholder="ID Document Image URL"
                  value={formData.govIdUrl}
                  onChange={(e) => setFormData({ ...formData, govIdUrl: e.target.value })}
                  className="w-full max-w-md px-3 py-1.5 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-mono text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#55443A] hover:bg-[#4D2308] text-white font-bold rounded-xl transition border border-[#8A9992]/30 flex items-center justify-center space-x-2 shadow-xl text-sm"
            >
              <span>{loading ? 'SUBMITTING REQUEST...' : 'SUBMIT COMMANDER ACCESS REQUEST'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#8A9992]/20 text-center text-xs text-[#8A9992]">
          Already have an approved account? <Link to="/login?tab=commander" className="text-[#CFD0CD] font-bold underline hover:text-white">Commander Login</Link>
        </div>
      </div>
    </div>
  );
}
