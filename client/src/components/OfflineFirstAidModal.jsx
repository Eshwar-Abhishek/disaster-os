import React, { useState } from 'react';
import { X, HeartPulse, ShieldAlert, CheckCircle2, Volume2, ArrowRight } from 'lucide-react';
import { queryOfflineAI } from '../services/offlineAI';
import { voiceAssistant } from '../services/voiceAssistant';

export default function OfflineFirstAidModal({ isOpen, onClose }) {
  const [selectedTopic, setSelectedTopic] = useState('Severe Bleeding Control');
  const [searchQuery, setSearchQuery] = useState('');
  const [cprActive, setCprActive] = useState(false);
  const [cprCount, setCprCount] = useState(0);

  if (!isOpen) return null;

  const result = queryOfflineAI(searchQuery || selectedTopic);

  const handleStartCPR = () => {
    if (cprActive) {
      voiceAssistant.stopCPRMetronome();
      setCprActive(false);
    } else {
      setCprActive(true);
      voiceAssistant.startCPRMetronome((count) => setCprCount(count));
    }
  };

  const topicsList = [
    'Severe Bleeding Control',
    'CPR & Unconscious Patient',
    'Thermal & Chemical Burn Treatment',
    'Choking & Airway Obstruction',
    'Snake Bite Emergency Management',
    'Bone Fracture & Trauma Splinting',
    'Flood Survival & Drowning First Aid',
    'Earthquake & Structure Collapse Survival'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#55443A] border border-[#8A9992]/20 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-elevated overflow-hidden text-[#CFD0CD]">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#8A9992]/20 bg-[#4D2308] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <HeartPulse className="w-6 h-6 text-[#DC2626] animate-pulse" />
            <div>
              <h3 className="font-semibold text-base text-white">Offline Visual First Aid Guide</h3>
              <p className="text-xs text-[#22C55E] font-medium">100% Offline Knowledge Base Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#8A9992] hover:text-white hover:bg-[#55443A] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Topic Selector */}
        <div className="p-4 bg-[#4D2308]/60 border-b border-[#8A9992]/20 space-y-3">
          <input
            type="text"
            placeholder="Type symptoms or injury (e.g. bleeding, CPR, fracture, snake bite)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#CFD0CD] border border-[#8A9992] text-sm text-[#4D2308] placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992] focus:border-transparent font-medium"
          />

          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {topicsList.map((top) => (
              <button
                key={top}
                onClick={() => { setSelectedTopic(top); setSearchQuery(''); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedTopic === top && !searchQuery
                    ? 'bg-[#8A9992] text-[#4D2308] font-bold shadow-md shadow-[#8A9992]/20'
                    : 'bg-[#4D2308] text-[#CFD0CD] hover:bg-[#8A9992] hover:text-[#4D2308] border border-[#8A9992]/20'
                }`}
              >
                {top}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 font-sans">
          {/* Title & Badges */}
          <div className="flex items-start justify-between border-b border-[#8A9992]/20 pb-3">
            <div>
              <span className="text-xs font-medium uppercase px-2.5 py-0.5 rounded-full bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/20">
                Severity: {result.severity}
              </span>
              <h2 className="text-xl font-semibold text-white mt-2">{result.topic}</h2>
            </div>
            <div className="text-right text-xs text-[#8A9992]">
              <span>Triage: </span>
              <span className="text-[#DC2626] font-semibold">{result.triageCategory}</span>
            </div>
          </div>

          {/* CPR Metronome Box */}
          {(result.topic.includes('CPR') || selectedTopic.includes('CPR')) && (
            <div className="p-4 rounded-2xl bg-[#4D2308] border border-[#DC2626]/30 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#DC2626]">CPR Audio Metronome (110 BPM)</h4>
                <p className="text-xs text-[#CFD0CD]">Push hard and fast in center of chest. Keep tempo to rhythm.</p>
                {cprActive && (
                  <p className="text-lg font-bold text-white font-mono mt-1">COMPRESSIONS: {cprCount}</p>
                )}
              </div>
              <button
                onClick={handleStartCPR}
                className={`px-4 py-2.5 rounded-xl font-medium text-xs transition-all flex items-center space-x-2 ${
                  cprActive ? 'bg-[#F59E0B] text-black animate-pulse' : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{cprActive ? 'STOP METRONOME' : 'START CPR RHYTHM'}</span>
              </button>
            </div>
          )}

          {/* Visual Step-by-Step Cards */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-[#8A9992] uppercase">Step-by-Step Emergency Action Plan</h4>
            {result.steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-[#4D2308] border border-[#8A9992]/20 text-sm text-[#CFD0CD]">
                <div className="w-7 h-7 rounded-lg bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <p className="mt-0.5 leading-relaxed text-[#CFD0CD]">{step}</p>
              </div>
            ))}
          </div>

          {/* Warning Note */}
          {result.warning && (
            <div className="p-3.5 rounded-2xl bg-[#4D2308] border border-[#F59E0B]/30 text-[#F59E0B] text-xs flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span><strong>Critical Warning:</strong> {result.warning}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
