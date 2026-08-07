import React, { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import { api } from '../services/api';
import { MapPin, ShieldAlert, Hospital, Home, Truck, Layers, Wind, CloudRain, Flame, Radio } from 'lucide-react';

export default function LiveMapPage() {
  const [incidents, setIncidents] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [resources, setResources] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [hazards, setHazards] = useState([]);
  
  // Layer Toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showResources, setShowResources] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showHazards, setShowHazards] = useState(true);

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadAll = async () => {
    try {
      const [incRes, hospRes, resRes, shRes, hzRes] = await Promise.all([
        api.getIncidents(),
        api.getHospitals(),
        api.getResources(),
        api.getShelters(),
        api.getHazards()
      ]);
      setIncidents(incRes.incidents || incRes.data?.incidents || []);
      setHospitals(hospRes.hospitals || hospRes.data?.hospitals || []);
      setResources(resRes.resources || resRes.data?.resources || []);
      setShelters(shRes.shelters || shRes.data?.shelters || []);
      setHazards(hzRes.hazards || hzRes.data?.hazards || []);
    } catch (err) {
      console.error('Failed to load GIS map layers:', err);
    }
  };

  return (
    <div className="space-y-4 font-sans h-full flex flex-col pb-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#8A9992]/20 pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-white">Tactical GIS Live Emergency Map</h1>
            <span className="px-2.5 py-0.5 rounded bg-[#8A9992]/20 text-[#8A9992] font-mono text-[10px] font-bold border border-[#8A9992]/30 animate-pulse">
              REALTIME USGS & METEO SYNC
            </span>
          </div>
          <p className="text-xs text-[#8A9992] font-mono mt-0.5">
            Floods • Cyclones • Earthquakes • Chemical Plumes • Responders • Safe Zones
          </p>
        </div>

        {/* GIS Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition ${
              showIncidents ? 'bg-rose-600 border-rose-500 text-white' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Incidents ({incidents.length})</span>
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition ${
              showHospitals ? 'bg-[#CFD0CD] border-[#8A9992] text-[#4D2308]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>Hospitals ({hospitals.length})</span>
          </button>

          <button
            onClick={() => setShowResources(!showResources)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition ${
              showResources ? 'bg-[#8A9992] border-[#8A9992] text-[#4D2308]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Responders ({resources.length})</span>
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border transition ${
              showShelters ? 'bg-[#55443A] border-[#8A9992] text-[#CFD0CD]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Shelters ({shelters.length})</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-3xl overflow-hidden border border-[#8A9992]/20 min-h-[600px] shadow-2xl relative">
        <InteractiveMap
          incidents={showIncidents ? incidents : []}
          hospitals={showHospitals ? hospitals : []}
          resources={showResources ? resources : []}
          shelters={showShelters ? shelters : []}
          hazards={showHazards ? hazards : []}
          height="680px"
        />
      </div>
    </div>
  );
}
