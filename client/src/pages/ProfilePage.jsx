import React, { useState, useEffect } from 'react';
import { User, Shield, Phone, Mail, MapPin } from 'lucide-react';
import EmergencyMedicalCardModal from '../components/EmergencyMedicalCardModal';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showICE, setShowICE] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('resq_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div className="border-b border-[#8A9992]/20 pb-4">
        <h1 className="text-2xl font-semibold text-white">User Profile & Personnel Credentials</h1>
        <p className="text-xs text-[#8A9992] font-mono">Role Access & Emergency Medical Lock Card</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-[#8A9992]/20 border-2 border-[#8A9992] flex items-center justify-center text-[#8A9992] font-bold text-xl">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name || 'Commander Operator'}</h2>
            <p className="text-xs text-[#8A9992] font-mono uppercase font-bold">{user?.role || 'operator'} • {user?.region || 'Global Sector'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-4 border-t border-[#8A9992]/20">
          <div className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20">
            <span className="text-[#8A9992] block text-[10px]">EMAIL ADDRESS</span>
            <span className="text-white font-bold">{user?.email || 'admin@disasteros.gov'}</span>
          </div>
          <div className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20">
            <span className="text-[#8A9992] block text-[10px]">CONTACT PHONE</span>
            <span className="text-white font-bold">{user?.phone || '+1-800-555-DISASTER'}</span>
          </div>
        </div>

        <button
          onClick={() => setShowICE(true)}
          className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl transition shadow-lg"
        >
          View / Edit Emergency ICE Medical Card
        </button>
      </div>

      <EmergencyMedicalCardModal isOpen={showICE} onClose={() => setShowICE(false)} />
    </div>
  );
}
