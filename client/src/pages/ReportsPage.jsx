import React, { useState, useEffect } from 'react';
import { FileText, Download, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await api.getReports();
      setReports(res.reports || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateSitRep = async () => {
    setLoading(true);
    try {
      await api.generateSitRep();
      fetchReports();
    } catch (err) {
      alert('Failed to generate SitRep: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Executive Situation Reports (SitReps)</h1>
          <p className="text-xs text-[#8A9992] font-mono">Synthesized by Situation Report AI Agent</p>
        </div>

        <button
          onClick={handleGenerateSitRep}
          disabled={loading}
          className="px-4 py-2.5 bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30 flex items-center space-x-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-[#8A9992]" />
          <span>{loading ? 'GENERATING SITREP...' : 'GENERATE NEW SITREP'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep.id} className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#8A9992]/20 pb-3">
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8A9992]" />
                {rep.title}
              </h3>
              <span className="font-mono text-xs text-[#8A9992]">{new Date(rep.created_at).toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20">
                <span className="text-[#8A9992] block text-[10px]">TOTAL CRISES</span>
                <span className="text-white font-bold text-base">{rep.incident_count}</span>
              </div>
              <div className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20">
                <span className="text-[#8A9992] block text-[10px]">ACTIVE RESCUES</span>
                <span className="text-rose-400 font-bold text-base">{rep.active_rescues}</span>
              </div>
              <div className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20">
                <span className="text-[#8A9992] block text-[10px]">UNITS DEPLOYED</span>
                <span className="text-[#F59E0B] font-bold text-base">{rep.deployed_resources}</span>
              </div>
              <div className="p-3 bg-[#4D2308]/90 rounded-xl border border-[#8A9992]/20">
                <span className="text-[#8A9992] block text-[10px]">CASUALTY RISK</span>
                <span className="text-[#CFD0CD] font-bold text-base">{rep.estimated_casualties}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8A9992] font-bold uppercase">EXECUTIVE SUMMARY</span>
              <p className="text-xs text-[#CFD0CD] mt-1 leading-relaxed">{rep.summary}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#8A9992] font-bold uppercase">COMMANDER NOTES & FORECAST</span>
              <p className="text-xs text-[#CFD0CD] font-mono bg-[#4D2308] p-3 rounded-lg border border-[#8A9992]/20 mt-1">
                {rep.executive_notes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
