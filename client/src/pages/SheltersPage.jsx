import React, { useState, useEffect } from 'react';
import { Home, Users, CheckCircle2, Droplets, Utensils, Stethoscope, Sparkles, Dog, Accessibility, HeartPulse } from 'lucide-react';
import { api } from '../services/api';

export default function SheltersPage() {
  const [shelters, setShelters] = useState([]);
  const [rankedShelters, setRankedShelters] = useState([]);
  const [petFilter, setPetFilter] = useState(false);
  const [wheelchairFilter, setWheelchairFilter] = useState(false);
  const [medicalFilter, setMedicalFilter] = useState(false);
  const [recommendationSummary, setRecommendationSummary] = useState('');

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    try {
      const res = await api.getShelters();
      const list = res.shelters || res.data?.shelters || [];
      setShelters(list);
      setRankedShelters(list);
    } catch (err) {
      console.error('Shelters error:', err);
    }
  };

  const handleRunShelterAgent = async () => {
    try {
      const payload = {
        userLat: 17.3850,
        userLng: 78.4867,
        requirePetFriendly: petFilter,
        requireWheelchair: wheelchairFilter,
        requireMedical: medicalFilter
      };
      const res = await api.runAgentTask('shelter', payload);
      if (res.recommendedShelters) {
        setRankedShelters(res.recommendedShelters);
        setRecommendationSummary(`AI Ranked ${res.recommendedShelters.length} shelters based on distance, capacity, food, water, wheelchair & pet filters.`);
      }
    } catch (err) {
      console.error('Agent recommendation failed:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
              <Home className="w-7 h-7 text-[#CFD0CD]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">Shelter Recommendation Agent</h1>
              <p className="text-xs text-[#8A9992] font-mono mt-0.5">
                AI Matcher • Distance • Capacity • Food & Water • Wheelchair • Pet Friendly
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleRunShelterAgent}
          className="px-5 py-3 rounded-3xl bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold text-xs shadow-xl transition border border-[#8A9992]/30 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-[#8A9992]" />
          <span>RANK SHELTERS WITH AGENT #9</span>
        </button>
      </div>

      {/* AI Preference Controls */}
      <div className="glass-panel p-5 rounded-3xl space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8A9992]" />
          VICTIM SHELTER MATCHING PREFERENCES
        </h3>

        <div className="flex flex-wrap gap-3 text-xs">
          <button
            onClick={() => setPetFilter(!petFilter)}
            className={`px-4 py-2.5 rounded-xl font-bold border transition flex items-center space-x-2 ${
              petFilter ? 'bg-[#8A9992] text-[#4D2308] border-[#8A9992]' : 'bg-[#4D2308]/80 border-[#8A9992]/20 text-[#CFD0CD]'
            }`}
          >
            <Dog className="w-4 h-4" />
            <span>Pet Friendly Required</span>
          </button>

          <button
            onClick={() => setWheelchairFilter(!wheelchairFilter)}
            className={`px-4 py-2.5 rounded-xl font-bold border transition flex items-center space-x-2 ${
              wheelchairFilter ? 'bg-[#8A9992] text-[#4D2308] border-[#8A9992]' : 'bg-[#4D2308]/80 border-[#8A9992]/20 text-[#CFD0CD]'
            }`}
          >
            <Accessibility className="w-4 h-4" />
            <span>Wheelchair Access Required</span>
          </button>

          <button
            onClick={() => setMedicalFilter(!medicalFilter)}
            className={`px-4 py-2.5 rounded-xl font-bold border transition flex items-center space-x-2 ${
              medicalFilter ? 'bg-rose-600 text-white border-rose-500' : 'bg-[#4D2308]/80 border-[#8A9992]/20 text-[#CFD0CD]'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Medical ER Support Required</span>
          </button>
        </div>

        {recommendationSummary && (
          <p className="text-xs font-mono text-[#8A9992] bg-[#4D2308] p-2.5 rounded-xl border border-[#8A9992]/20">
            ✔ {recommendationSummary}
          </p>
        )}
      </div>

      {/* Shelters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rankedShelters.map((sh, idx) => (
          <div key={sh.id || idx} className="glass-panel p-5 rounded-3xl space-y-4 shadow-xl border border-[#8A9992]/20">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30">
                MATCH SCORE: {sh.matchScore !== undefined ? `${sh.matchScore}%` : '#1 RANK'}
              </span>
              <span className="font-mono text-xs text-[#22C55E] font-semibold">{sh.status}</span>
            </div>

            <div>
              <h3 className="font-semibold text-xl text-white">{sh.name}</h3>
              <p className="text-xs text-[#8A9992] mt-0.5">{sh.address}</p>
            </div>

            <div className="p-3 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A9992]">Capacity:</span>
                <span className="text-[#CFD0CD] font-semibold">{sh.occupied} / {sh.capacity} Citizens</span>
              </div>
              {sh.distanceKm && (
                <div className="flex justify-between">
                  <span className="text-[#8A9992]">Distance:</span>
                  <span className="text-[#8A9992] font-semibold">{sh.distanceKm} km away</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className={`p-2 rounded-xl border text-center font-bold ${sh.food_available ? 'bg-[#22C55E]/20 border-[#22C55E]/30 text-[#22C55E]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'}`}>
                Food: {sh.food_available ? 'YES' : 'NO'}
              </div>
              <div className={`p-2 rounded-xl border text-center font-bold ${sh.water_available ? 'bg-[#22C55E]/20 border-[#22C55E]/30 text-[#22C55E]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'}`}>
                Water: {sh.water_available ? 'YES' : 'NO'}
              </div>
              <div className={`p-2 rounded-xl border text-center font-bold ${sh.pet_friendly ? 'bg-[#8A9992]/20 border-[#8A9992]/30 text-[#8A9992]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'}`}>
                Pets: {sh.pet_friendly ? 'PET FRIENDLY' : 'NO PETS'}
              </div>
              <div className={`p-2 rounded-xl border text-center font-bold ${sh.wheelchair_accessible ? 'bg-[#8A9992]/20 border-[#8A9992]/30 text-[#8A9992]' : 'bg-[#4D2308] border-[#8A9992]/20 text-[#8A9992]'}`}>
                Access: {sh.wheelchair_accessible ? 'WHEELCHAIR' : 'STAIRS'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
