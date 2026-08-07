import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, HeartPulse, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    bloodGroup: '',
    location: '',
    medicalConditions: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.registerVictim(formData);
      setSuccessMsg(res.message || 'Victim account created successfully! Redirecting to Victim Login...');
      setTimeout(() => {
        navigate('/login?tab=victim');
      }, 1800);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4D2308] flex items-center justify-center p-4 font-sans py-12">
      <div className="max-w-xl w-full glass-panel-glow p-8 rounded-3xl border border-[#8A9992]/20 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-3xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center mx-auto text-[#8A9992] shadow-xl">
            <HeartPulse className="w-8 h-8 text-[#CFD0CD]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">Victim Registration Portal</h1>
          <p className="text-xs text-[#8A9992] font-mono">Create Citizen Account for Emergency SOS & Disaster Assistance</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs font-mono text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-[#22C55E]/20 border border-[#22C55E]/50 rounded-xl text-[#22C55E] text-xs font-mono text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[#8A9992] mb-1">FULL NAME *</label>
              <input
                type="text"
                required
                placeholder="Jane Citizen"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">EMAIL ADDRESS *</label>
              <input
                type="email"
                required
                placeholder="jane.citizen@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">PHONE NUMBER *</label>
              <input
                type="text"
                required
                placeholder="+1-800-555-0888"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">EMERGENCY CONTACT PHONE *</label>
              <input
                type="text"
                required
                placeholder="+1-800-555-9999"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">PASSWORD *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">CONFIRM PASSWORD *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">BLOOD GROUP (OPTIONAL)</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              >
                <option value="">Select Blood Group</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[#8A9992] mb-1">PRIMARY LOCATION (OPTIONAL)</label>
              <input
                type="text"
                placeholder="Sector 4 Promenade"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[#8A9992] mb-1">MEDICAL CONDITIONS / ALLERGIES (OPTIONAL)</label>
            <input
              type="text"
              placeholder="e.g. Asthma, Diabetes, Penicillin Allergy"
              value={formData.medicalConditions}
              onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#55443A] hover:bg-[#4D2308] text-white font-bold rounded-xl transition border border-[#8A9992]/30 flex items-center justify-center space-x-2 shadow-xl text-sm"
          >
            <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER VICTIM ACCOUNT'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#CFD0CD]">
          Already registered? <Link to="/login?tab=victim" className="text-[#8A9992] font-bold underline hover:text-white">Victim Login</Link>
        </p>
      </div>
    </div>
  );
}
