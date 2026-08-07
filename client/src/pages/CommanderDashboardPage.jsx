import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Radio, Activity, Navigation, Hospital, Home, Truck, FileText, 
  Sparkles, CloudRain, Cpu, AlertTriangle, CheckCircle2, Clock, Users, RefreshCw 
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AIReasoningPanel from '../components/AIReasoningPanel';
import { api } from '../services/api';

export default function CommanderDashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommanderData();
  }, []);

  const fetchCommanderData = async () => {
    try {
      setLoading(true);
      const [incRes, hospRes, shRes, resRes, decRes, spRes, repRes] = await Promise.all([
        api.getIncidents(),
        api.getHospitals(),
        api.getShelters(),
        api.getResources(),
        api.getAIDecisions(),
        api.getSupplyRequests(),
        api.getReports()
      ]);

      setIncidents(incRes.incidents || []);
      setHospitals(hospRes.hospitals || hospRes.data?.hospitals || []);
      setShelters(shRes.shelters || shRes.data?.shelters || []);
      setResources(resRes.resources || []);
      setDecisions(decRes.decisions || []);
      setSupplyRequests(spRes.requests || []);
      setReports(repRes.reports || []);
    } catch (err) {
      console.error('Commander dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAgentCycle = async () => {
    try {
      await api.triggerCommanderCycle({ trigger: 'Manual Commander Intervention' });
      fetchCommanderData();
    } catch (err) {
      alert('Commander cycle error: ' + err.message);
    }
  };

  const handleUpdateStatus = async (spId, newStatus) => {
    try {
      await api.updateSupplyRequestStatus(spId, newStatus);
      fetchCommanderData();
    } catch (err) {
      alert('Status update error: ' + err.message);
    }
  };

  const activeIncidents = incidents.filter(i => ['Reported', 'Responding', 'Critical'].includes(i.status));

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
            <ShieldAlert className="w-7 h-7 text-[#CFD0CD] animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Commander Operations Center</h1>
            <p className="text-xs text-[#8A9992] font-mono mt-0.5">
              Live Map • Incident Command • Resource Allocation • AI Multi-Agent Mission Planner
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunAgentCycle}
            className="px-4 py-2.5 bg-[#8A9992] hover:bg-[#CFD0CD] text-[#4D2308] font-bold text-xs rounded-3xl transition flex items-center space-x-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>TRIGGER AI MULTI-AGENT CYCLE</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono text-[#8A9992] font-bold">ACTIVE INCIDENTS</span>
          <div className="text-2xl font-extrabold text-white font-mono">{activeIncidents.length}</div>
          <span className="text-[11px] text-rose-400 font-mono">Critical Response</span>
        </div>

        <div className="glass-panel p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono text-[#8A9992] font-bold">RESOURCE FLEETS</span>
          <div className="text-2xl font-extrabold text-white font-mono">{resources.length}</div>
          <span className="text-[11px] text-[#22C55E] font-mono">Deployed & Standby</span>
        </div>

        <div className="glass-panel p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono text-[#8A9992] font-bold">SHELTERS & HOSPITALS</span>
          <div className="text-2xl font-extrabold text-white font-mono">{hospitals.length + shelters.length}</div>
          <span className="text-[11px] text-[#8A9992] font-mono">Live Monitoring</span>
        </div>

        <div className="glass-panel p-4 rounded-3xl space-y-1">
          <span className="text-[10px] font-mono text-[#8A9992] font-bold">VICTIM SOS REQUESTS</span>
          <div className="text-2xl font-extrabold text-[#F59E0B] font-mono">{supplyRequests.length}</div>
          <span className="text-[11px] text-[#8A9992] font-mono">Real-time GPS Tracking</span>
        </div>
      </div>

      {/* Main Grid: Interactive Map + AI Reasoning Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-4 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#8A9992] animate-pulse" />
              TACTICAL LIVE DISASTER MAP
            </h3>
            <span className="text-xs font-mono text-[#8A9992] bg-[#4D2308] px-2.5 py-0.5 rounded-lg border border-[#8A9992]/20">
              REAL-TIME USGS & VICTIM GPS OVERLAY
            </span>
          </div>

          <InteractiveMap
            incidents={incidents}
            hospitals={hospitals}
            shelters={shelters}
            resources={resources}
            supplyRequests={supplyRequests}
            height="460px"
          />
        </div>

        <div className="space-y-4">
          <AIReasoningPanel decisions={decisions} />
        </div>
      </div>

      {/* Secondary Grid: Incident Management & Live Victim Emergency & Supply Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Management */}
        <div className="glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              INCIDENT RESPONSE QUEUE ({incidents.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-4 bg-[#4D2308]/90 rounded-2xl border border-[#8A9992]/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-300 font-bold border border-rose-500/30">
                    {inc.severity} • {inc.type}
                  </span>
                  <span className="text-[#22C55E] font-bold">{inc.status}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{inc.title}</h4>
                <p className="text-xs text-[#8A9992] line-clamp-2">{inc.description}</p>
                <div className="text-[11px] text-[#8A9992] font-mono pt-1">
                  Location: {inc.address || `${inc.latitude}, ${inc.longitude}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Live Victim Emergency & Supply Locator Queue */}
        <div className="glass-panel p-5 rounded-3xl space-y-4 border-2 border-[#F59E0B]/30">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#F59E0B] animate-pulse" />
              🚨 LIVE VICTIM EMERGENCY & SUPPLY LOCATOR QUEUE ({supplyRequests.length})
            </h3>
            <span className="text-[10px] font-mono bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded font-bold">
              GPS BROADCAST ACTIVE
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {supplyRequests.length === 0 ? (
              <p className="text-xs font-mono text-[#8A9992]">No active victim emergency requests.</p>
            ) : (
              supplyRequests.map((sp) => (
                <div key={sp.id} className="p-4 bg-[#4D2308]/95 rounded-2xl border border-[#8A9992]/30 space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-bold border border-[#F59E0B]/30">
                      REQUEST: {sp.type}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded font-bold ${
                      sp.status === 'Dispatched' ? 'bg-[#22C55E]/20 text-[#22C55E]' :
                      sp.status === 'Fulfilled' ? 'bg-[#8A9992]/20 text-[#CFD0CD]' :
                      'bg-rose-600/20 text-rose-300 animate-pulse'
                    }`}>
                      STATUS: {sp.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-sm">{sp.quantity}</h4>
                    <p className="text-[#CFD0CD]"><span className="text-[#8A9992]">Victim:</span> {sp.requester_name} ({sp.contact_info})</p>
                    <p className="text-[#8A9992] text-[11px]"><span className="text-white font-bold">Location / GPS:</span> {sp.address_or_gps || `GPS (${sp.latitude || '17.3850'}, ${sp.longitude || '78.4867'})`}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#8A9992]/20">
                    <button
                      onClick={() => handleUpdateStatus(sp.id, 'Dispatched')}
                      className="flex-1 py-1.5 bg-[#22C55E] hover:bg-[#22C55E]/80 text-[#111827] font-bold text-[11px] rounded-xl transition flex items-center justify-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>DISPATCH RESCUE TEAM</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(sp.id, 'Fulfilled')}
                      className="py-1.5 px-3 bg-[#55443A] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] font-bold text-[11px] rounded-xl transition"
                    >
                      Mark Fulfilled
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
