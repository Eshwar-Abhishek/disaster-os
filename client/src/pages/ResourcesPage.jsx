import React, { useState, useEffect } from 'react';
import { Truck, Navigation, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.getResources();
      setResources(res.resources || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateResource(id, { status });
      fetchResources();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Emergency Resource Fleets</h1>
          <p className="text-xs text-[#8A9992] font-mono">Autonomous Deployment • Helicopters, Swift Boats & Search Squads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((res) => (
          <div key={res.id} className="glass-panel p-5 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30">
                {res.type}
              </span>
              <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                res.status === 'Deployed' ? 'bg-[#F59E0B] text-black' : 'bg-[#22C55E] text-white'
              }`}>
                {res.status}
              </span>
            </div>

            <h3 className="font-semibold text-lg text-white">{res.name}</h3>
            <p className="text-xs text-[#8A9992] font-mono">Operator: {res.operator_name || 'Squad Lead'}</p>
            <p className="text-xs text-[#CFD0CD] font-mono">Capacity: {res.capacity} Personnel / Rescue Payload</p>

            <div className="pt-3 border-t border-[#8A9992]/20 flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpdateStatus(res.id, res.status === 'Available' ? 'Deployed' : 'Available')}
                className="px-3 py-1.5 rounded-lg bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-bold transition border border-[#8A9992]/30"
              >
                Toggle Deploy / Standby
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
