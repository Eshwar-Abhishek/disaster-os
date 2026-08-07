import React, { useState, useEffect } from 'react';
import { Hospital, Bed, Activity, Phone } from 'lucide-react';
import { api } from '../services/api';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);

  const fetchHospitals = async () => {
    try {
      const res = await api.getHospitals();
      setHospitals(res.hospitals || []);
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#8A9992]/20 pb-4">
        <h1 className="text-2xl font-semibold text-white">Trauma Hospitals & ER Capacity</h1>
        <p className="text-xs text-[#8A9992] font-mono">Live ER Beds • ICU Units • Trauma Level 1 Capabilities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitals.map((hosp) => (
          <div key={hosp.id} className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                {hosp.trauma_level}
              </span>
              <span className="font-mono text-xs text-[#8A9992]">{hosp.status}</span>
            </div>

            <h3 className="font-semibold text-lg text-white">{hosp.name}</h3>
            <p className="text-xs text-[#8A9992]">{hosp.address}</p>

            <div className="p-3 bg-[#4D2308]/80 rounded-xl border border-[#8A9992]/20 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[#8A9992] block text-[10px]">AVAILABLE BEDS</span>
                <span className="text-[#22C55E] font-bold text-base">{hosp.available_beds} / {hosp.total_beds}</span>
              </div>
              <div>
                <span className="text-[#8A9992] block text-[10px]">ICU UNITS</span>
                <span className="text-rose-400 font-bold text-base">{hosp.icu_beds}</span>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-[#8A9992] flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#8A9992]" />
              <span className="text-[#CFD0CD]">{hosp.contact_phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
