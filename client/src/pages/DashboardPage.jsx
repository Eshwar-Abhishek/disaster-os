import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, Shield, Activity, Truck, Hospital, Users, Bell, 
  RefreshCw, Cpu, CheckCircle2, ArrowRight, Eye, Zap, Flame, Droplets, Radio
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AIReasoningPanel from '../components/AIReasoningPanel';
import { api } from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingLive, setSyncingLive] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [latestDecision, setLatestDecision] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
      if (res.incidents && res.incidents.length > 0) {
        setSelectedIncident(res.incidents[0]);
      }
      if (res.aiDecisions && res.aiDecisions.length > 0) {
        setLatestDecision(res.aiDecisions[0]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSyncRealTimeFeeds = async () => {
    try {
      setSyncingLive(true);
      const res = await api.syncLiveFeeds();
      alert(`✅ Live Sync Complete: ${res.count || 0} real seismic events retrieved from USGS.`);
      fetchDashboardData();
    } catch (err) {
      alert('Live sync error: ' + err.message);
    } finally {
      setSyncingLive(false);
    }
  };

  const handleTriggerCommanderReplan = async () => {
    if (!selectedIncident) return;
    try {
      const res = await api.triggerCommanderCycle({ incident: selectedIncident, triggerSource: 'Commander Manual Replan' });
      if (res.commanderDecision) {
        setLatestDecision(res.commanderDecision);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Replan failed:', err);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin mx-auto"></div>
        <p>SYNCHRONIZING MULTI-AGENT EOC TELEMETRY...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8A9992]/20 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            DisasterOS Command Center
            <span className="text-xs bg-rose-600/30 text-rose-400 border border-rose-500/50 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
              LIVE OPERATION
            </span>
          </h1>
          <p className="text-xs text-[#8A9992] font-mono mt-0.5">
            11 Autonomous AI Agents Collaborating • Realtime Continuous Monitoring Active
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSyncRealTimeFeeds}
            disabled={syncingLive}
            className="px-3.5 py-2 rounded-xl bg-[#55443A] hover:bg-[#4D2308] border border-[#8A9992]/30 text-xs font-bold text-[#CFD0CD] hover:text-white transition flex items-center space-x-1.5 shadow-lg"
          >
            <Radio className="w-3.5 h-3.5 text-[#8A9992] animate-pulse" />
            <span>{syncingLive ? 'Syncing USGS Telemetry...' : 'Sync Realtime USGS Data'}</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="px-3.5 py-2 rounded-xl bg-[#55443A] hover:bg-[#4D2308] border border-[#8A9992]/30 text-xs font-semibold text-[#CFD0CD] hover:text-white transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8A9992]" />
            <span>Refresh Grid</span>
          </button>
          <Link
            to="/report-incident"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-lg shadow-rose-600/30 flex items-center space-x-1.5"
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
            <span>Report New Crisis</span>
          </Link>
        </div>
      </div>

      {/* 5 Enterprise Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Incidents */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[#8A9992] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono font-bold text-[#8A9992] uppercase">TOTAL CRISES</p>
            <h3 className="text-2xl font-semibold text-white mt-0.5">{metrics.totalIncidents || 0}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4D2308]/60 border border-[#8A9992]/20 flex items-center justify-center text-[#8A9992]">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Active Rescues */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono font-bold text-[#8A9992] uppercase">ACTIVE RESCUES</p>
            <h3 className="text-2xl font-semibold text-rose-400 mt-0.5">{metrics.activeRescues || 0}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Deployed Resources */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[#F59E0B] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono font-bold text-[#8A9992] uppercase">UNITS DEPLOYED</p>
            <h3 className="text-2xl font-semibold text-[#F59E0B] mt-0.5">{metrics.deployedResources || 0}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {/* Estimated Casualties */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[#DC2626] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono font-bold text-[#8A9992] uppercase">CASUALTIES RISK</p>
            <h3 className="text-2xl font-semibold text-rose-400 mt-0.5">{metrics.totalCasualties || 0}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4D2308]/60 border border-[#8A9992]/20 flex items-center justify-center text-[#CFD0CD]">
            <Users className="w-5 h-5 text-[#8A9992]" />
          </div>
        </div>

        {/* Hospital Occupancy */}
        <div className="glass-panel p-4 rounded-xl border-l-4 border-l-[#22C55E] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono font-bold text-[#8A9992] uppercase">HOSPITAL OCCUPANCY</p>
            <h3 className="text-2xl font-semibold text-[#22C55E] mt-0.5">{metrics.hospitalOccupancyPct || 0}%</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
            <Hospital className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive GIS Map & Explainable Commander AI Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map & Live Incidents */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#8A9992] animate-pulse" />
                TACTICAL GIS MAP & DANGER PERIMETERS
              </h3>
              <Link to="/live-map" className="text-xs text-[#8A9992] hover:underline font-mono">Full Map View →</Link>
            </div>
            <InteractiveMap
              incidents={data?.incidents || []}
              hospitals={data?.hospitals || []}
              resources={data?.resources || []}
              shelters={data?.shelters || []}
              height="400px"
            />
          </div>

          {/* Live Incidents Grid */}
          <div className="glass-panel p-4 rounded-xl space-y-3">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              LIVE DISASTER INCIDENTS & STATUS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(data?.incidents || []).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedIncident?.id === inc.id
                      ? 'bg-[#55443A] border-[#8A9992] shadow-lg'
                      : 'bg-[#4D2308]/80 border-[#8A9992]/20 hover:border-[#8A9992]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      inc.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-[#F59E0B] text-black'
                    }`}>
                      {inc.severity} • {inc.type}
                    </span>
                    <span className="text-[#8A9992] font-mono text-[10px]">{inc.status}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white truncate">{inc.title}</h4>
                  <p className="text-xs text-[#CFD0CD] line-clamp-2 mt-1">{inc.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-[#8A9992]/20 flex items-center justify-between text-[11px] font-mono text-[#8A9992]">
                    <span>Est. Casualties: <strong className="text-rose-400">{inc.casualties}</strong></span>
                    <Link to={`/incidents/${inc.id}`} className="text-[#8A9992] hover:underline flex items-center gap-1">
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: AI Decision Transparency Engine & Real-Time Alerts */}
        <div className="space-y-6">
          <AIReasoningPanel
            decision={latestDecision}
            agentName="Commander Agent (Orchestrator)"
            onTriggerReplan={handleTriggerCommanderReplan}
          />

          {/* Realtime Victim Emergency SOS & Check-In Beacons */}
          <div className="glass-panel p-4 rounded-xl space-y-3 border-2 border-rose-500/40">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                VICTIM LIVE SOS & GPS BEACONS
              </h3>
              <span className="px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 font-mono text-[10px] font-bold border border-rose-500/40 animate-pulse">
                REALTIME BROADCAST
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {[
                { id: 'v1', name: 'Leo Sharma (Child SOS)', status: 'CRITICAL RESCUE SOS', gps: '17.3850, 78.4867 (Sector 4)', battery: '84%', time: 'Just now' },
                { id: 'v2', name: 'John Citizen', status: 'I\'M SAFE', gps: '17.4000, 78.4900 (Stadium Hub)', battery: '92%', time: '2 mins ago' },
                { id: 'v3', name: 'Anita Sharma', status: 'NEED IMMEDIATE HELP', gps: '17.4399, 78.4983 (Begumpet)', battery: '45%', time: '5 mins ago' }
              ].map((v) => (
                <div key={v.id} className="p-3 rounded-xl bg-[#4D2308]/80 border border-[#8A9992]/20 space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{v.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.status.includes('SAFE') ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-rose-600 text-white'
                    }`}>
                      {v.status}
                    </span>
                  </div>
                  <p className="text-[#CFD0CD]">GPS: <span className="text-[#8A9992] font-bold">{v.gps}</span> | Battery: {v.battery}</p>
                  <p className="text-[10px] text-[#8A9992] text-right">{v.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Citizen Notifications */}
          <div className="glass-panel p-4 rounded-xl space-y-3">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#F59E0B] animate-bounce" />
              EMERGENCY BROADCAST ALERTS
            </h3>
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {(data?.notifications || []).map((notif) => (
                <div key={notif.id} className="p-3 rounded-lg bg-[#4D2308]/80 border border-[#8A9992]/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#F59E0B]">
                    <span>TYPE: {notif.type}</span>
                    <span>{new Date(notif.sent_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[#CFD0CD]">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
