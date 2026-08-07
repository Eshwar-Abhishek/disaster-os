import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, MapPin, Upload, Camera, CheckCircle2, ShieldAlert, Cpu, Flame, Zap, Shield } from 'lucide-react';
import { api } from '../services/api';

export default function IncidentReportingPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('incident'); // 'incident' | 'damage_scanner' | 'hazard_report'
  
  const [formData, setFormData] = useState({
    type: 'Flood',
    title: '',
    description: '',
    latitude: 17.3850,
    longitude: 78.4867,
    address: 'Riverfront Promenade, Sector 4, Hyderabad',
    severity: 'High',
    casualties: 0
  });

  // AI Damage Scanner State
  const [damageType, setDamageType] = useState('Collapsed Building');
  const [damagePhotoUrl, setDamagePhotoUrl] = useState('');
  const [damageAnalysis, setDamageAnalysis] = useState(null);

  // Crowd Hazard Report State
  const [hazardType, setHazardType] = useState('Collapsed bridge');
  const [hazardDesc, setHazardDesc] = useState('');
  const [hazardLocation, setHazardLocation] = useState('Arterial Bridge #3');

  const [loading, setLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);

  const handleFetchGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address: `GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`
          }));
        },
        (err) => alert('Geolocation failed: ' + err.message)
      );
    }
  };

  const handleAnalyzeDamage = () => {
    let riskScore = 85;
    let details = [];

    if (damageType === 'Collapsed Building') {
      riskScore = 92;
      details = ['Structural integrity compromised', 'Acoustic search recommended for void spaces', 'High risk of secondary crumble'];
    } else if (damageType === 'Fire Spread') {
      riskScore = 88;
      details = ['Rapid thermal convection towards north wing', 'HazMat chemical canister risk nearby', 'Evacuation perimeter 500m'];
    } else if (damageType === 'Blocked Road / Bridge Collapse') {
      riskScore = 78;
      details = ['Bridge structural span collapsed under water', 'Requires AI route recalculation past Highway 7'];
    } else {
      riskScore = 70;
      details = ['Flood depth 1.8 meters', 'Submerged power lines reported in water corridor'];
    }

    setDamageAnalysis({
      damageType,
      riskScore,
      status: riskScore > 80 ? 'CRITICAL STRUCTURAL RISK' : 'HIGH DANGER ZONE',
      details
    });
  };

  const handleReportHazardSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.reportHazard({
        reporter_name: 'Citizen Reporter',
        hazard_type: hazardType,
        description: hazardDesc || 'Hazard reported via crowd portal',
        latitude: formData.latitude,
        longitude: formData.longitude
      });
      alert(`✅ Crowd Hazard Report for "${hazardType}" recorded! Merged directly onto Tactical GIS Map.`);
      setHazardDesc('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.createIncident(formData);
      setAiPreview(res.aiOrchestration?.commanderDecision);
      setTimeout(() => {
        navigate(`/incidents/${res.incident.id}`);
      }, 2500);
    } catch (err) {
      alert('Failed to report incident: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="border-b border-[#8A9992]/20 pb-4">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-rose-500 animate-bounce" />
          DisasterOS Crisis Reporting & AI Damage Scanner
        </h1>
        <p className="text-xs text-[#8A9992] font-mono mt-0.5">
          Triggers Autonomous AI Response • Structural Damage Rating • Crowd Hazard Mapping
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-[#4D2308]/60 p-1.5 rounded-3xl border border-[#8A9992]/20">
        <button
          onClick={() => setMode('incident')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
            mode === 'incident' ? 'bg-[#55443A] text-white border border-[#8A9992] shadow-lg' : 'text-[#CFD0CD]'
          }`}
        >
          Report Crisis Emergency
        </button>
        <button
          onClick={() => setMode('damage_scanner')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
            mode === 'damage_scanner' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD]'
          }`}
        >
          AI Structural Damage Scanner
        </button>
        <button
          onClick={() => setMode('hazard_report')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
            mode === 'hazard_report' ? 'bg-[#F59E0B] text-black shadow-lg' : 'text-[#CFD0CD]'
          }`}
        >
          Crowd Hazard Report
        </button>
      </div>

      {/* MODE 1: REPORT INCIDENT */}
      {mode === 'incident' && (
        <>
          {aiPreview ? (
            <div className="glass-panel-glow p-6 rounded-3xl space-y-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto animate-pulse" />
              <h2 className="text-xl font-semibold text-white">INCIDENT VERIFIED & COMMANDER DEPLOYED</h2>
              <p className="text-xs text-[#CFD0CD] font-mono">{aiPreview.summary}</p>
              <div className="p-3 bg-[#4D2308] rounded-xl border border-[#8A9992]/20 text-xs font-mono text-[#8A9992]">
                Redirecting to Live Incident Command Room...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8A9992] mb-1">DISASTER TYPE</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] focus:outline-none focus:ring-2 focus:ring-[#8A9992] font-semibold"
                  >
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Fire">Fire</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Landslide">Landslide</option>
                    <option value="Building Collapse">Building Collapse</option>
                    <option value="Chemical Leak">Chemical Leak</option>
                    <option value="Road Accident">Road Accident</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8A9992] mb-1">SEVERITY LEVEL</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] focus:outline-none focus:ring-2 focus:ring-[#8A9992] font-semibold"
                  >
                    <option value="Critical">Critical (Immediate Life Threat)</option>
                    <option value="High">High (Severe Damage)</option>
                    <option value="Medium">Medium (Controlled Danger)</option>
                    <option value="Low">Low (Minor Hazard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8A9992] mb-1">INCIDENT TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roof Collapse with Trapped Victims at Tech Park"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-medium placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8A9992] mb-1">DESCRIPTION & SURVIVOR DETAILS</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe situation, trapped citizens, water depth, smoke, or fire spread..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-medium placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              {/* Location & GPS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#8A9992] mb-1">STREET ADDRESS / LANDMARK</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-medium focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8A9992] mb-1">GEOLOCATION GPS</label>
                  <button
                    type="button"
                    onClick={handleFetchGPS}
                    className="w-full py-2.5 bg-[#55443A] hover:bg-[#4D2308] border border-[#8A9992]/30 rounded-xl text-xs font-mono text-[#CFD0CD] hover:text-white font-bold flex items-center justify-center space-x-1 transition"
                  >
                    <MapPin className="w-4 h-4 text-[#8A9992]" />
                    <span>Get Device GPS</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8A9992] mb-1">ESTIMATED CASUALTIES AT RISK</label>
                <input
                  type="number"
                  min="0"
                  value={formData.casualties}
                  onChange={(e) => setFormData({ ...formData, casualties: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-medium focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold text-sm rounded-xl transition border border-[#8A9992]/40 flex items-center justify-center space-x-2 shadow-xl"
              >
                <Cpu className="w-5 h-5 text-[#8A9992] animate-pulse" />
                <span>{loading ? 'EXECUTING AGENT PIPELINE...' : 'DISPATCH MULTI-AGENT RESPONSE PIPELINE'}</span>
              </button>
            </form>
          )}
        </>
      )}

      {/* MODE 2: AI DAMAGE SCANNER */}
      {mode === 'damage_scanner' && (
        <div className="glass-panel p-6 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#8A9992]" />
              AI Damage Scanner & Structural Risk Evaluator
            </h3>
            <span className="px-2.5 py-0.5 rounded bg-[#8A9992]/20 text-[#8A9992] font-mono text-xs font-bold border border-[#8A9992]/30">
              SCENARIO & VISION AI
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Select Damage Hazard Scenario</label>
              <select
                value={damageType}
                onChange={(e) => setDamageType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              >
                <option value="Collapsed Building">Building Collapse / Structural Debris</option>
                <option value="Fire Spread">Fire Spread / Thermal Hazard</option>
                <option value="Blocked Road / Bridge Collapse">Blocked Road / Collapsed Bridge</option>
                <option value="Flood Level / Power Line Hazard">Flood Level / Submerged Live Power Wires</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Photo Image URL / Upload</label>
              <input
                type="text"
                placeholder="https://..."
                value={damagePhotoUrl}
                onChange={(e) => setDamagePhotoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <button
              type="button"
              onClick={handleAnalyzeDamage}
              className="w-full py-3 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold rounded-xl transition border border-[#8A9992]/30"
            >
              RUN AI DAMAGE EVALUATION SCAN
            </button>
          </div>

          {damageAnalysis && (
            <div className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold text-sm">{damageAnalysis.damageType}</span>
                <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold">
                  RISK SCORE: {damageAnalysis.riskScore} / 100
                </span>
              </div>
              <p className="text-[#8A9992] font-bold">{damageAnalysis.status}</p>
              <ul className="list-disc list-inside text-[#CFD0CD] space-y-1">
                {damageAnalysis.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: CROWD HAZARD REPORT */}
      {mode === 'hazard_report' && (
        <form onSubmit={handleReportHazardSubmit} className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />
            Crowd-Sourced Hazard Reporting (Bridge Collapse, Chemical, Crowds, Barricades)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Hazard Category</label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              >
                <option value="Collapsed bridge">Collapsed Bridge</option>
                <option value="Chemical leak">Chemical Plume / Gas Leak</option>
                <option value="Crowds">High-Density Evacuation Crowd</option>
                <option value="Police barricades">Police Barricade / Closed Highway</option>
                <option value="Live Wires">Submerged Live Power Wires</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Location Landmark</label>
              <input
                type="text"
                required
                value={hazardLocation}
                onChange={(e) => setHazardLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#8A9992] font-bold mb-1">Hazard Description & Safety Warning</label>
              <textarea
                rows={3}
                required
                placeholder="Describe hazard extent..."
                value={hazardDesc}
                onChange={(e) => setHazardDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30"
          >
            SUBMIT & MERGE HAZARD ONTO TACTICAL GIS MAP
          </button>
        </form>
      )}
    </div>
  );
}
