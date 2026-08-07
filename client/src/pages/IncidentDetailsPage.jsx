import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, MapPin, RefreshCw, Cpu, CheckCircle2, Shield, Activity, Users } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AIReasoningPanel from '../components/AIReasoningPanel';
import { api } from '../services/api';

export default function IncidentDetailsPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [aiDecision, setAiDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.getIncidentById(id);
      setIncident(res.incident);

      // Fetch AI decisions
      const aiRes = await api.getAIDecisions();
      const match = (aiRes.decisions || []).find(d => d.incident_id === id);
      if (match) {
        setAiDecision(match);
      }
    } catch (err) {
      console.error('Failed to load incident details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleReplan = async () => {
    if (!incident) return;
    try {
      const res = await api.triggerCommanderCycle({ incident, triggerSource: 'Incident Room Replan Request' });
      if (res.commanderDecision) {
        setAiDecision(res.commanderDecision);
        fetchDetails();
      }
    } catch (err) {
      console.error('Replan failed:', err);
    }
  };

  if (loading || !incident) {
    return <div className="p-8 text-center text-[#8A9992] font-mono">LOADING INCIDENT COMMAND ROOM...</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8A9992]/20 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
              incident.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-[#F59E0B] text-black'
            }`}>
              {incident.severity} • {incident.type}
            </span>
            <span className="text-xs text-[#8A9992] font-mono">STATUS: {incident.status}</span>
          </div>
          <h1 className="text-2xl font-semibold text-white mt-1">{incident.title}</h1>
          <p className="text-xs text-[#8A9992] font-mono">{incident.address}</p>
        </div>

        <button
          onClick={handleReplan}
          className="px-4 py-2.5 rounded-xl bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold text-xs transition border border-[#8A9992]/30 flex items-center space-x-1.5 shadow-lg"
        >
          <RefreshCw className="w-4 h-4 animate-spin text-[#8A9992]" />
          <span>TRIGGER COMMANDER REPLAN</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-5 rounded-3xl space-y-3">
            <h3 className="font-semibold text-sm text-white">INCIDENT DESCRIPTION & FIELD REPORT</h3>
            <p className="text-sm text-[#CFD0CD] leading-relaxed font-sans">{incident.description}</p>
            <div className="flex items-center space-x-4 text-xs font-mono text-[#8A9992] pt-2 border-t border-[#8A9992]/20">
              <span>Reported By: <strong className="text-[#CFD0CD]">{incident.reported_by}</strong></span>
              <span>Casualties Risk: <strong className="text-rose-400">{incident.casualties}</strong></span>
              <span>AI Verified: <strong className="text-[#22C55E]">YES</strong></span>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-3xl space-y-3">
            <h3 className="font-semibold text-sm text-white">GEOSPATIAL HAZARD MAP</h3>
            <InteractiveMap incidents={[incident]} height="350px" />
          </div>
        </div>

        <div>
          <AIReasoningPanel
            decision={aiDecision}
            agentName="Commander Agent"
            onTriggerReplan={handleReplan}
          />
        </div>
      </div>
    </div>
  );
}
