import React, { useState } from 'react';
import { 
  ShieldCheck, CheckSquare, Heart, HeartPulse, Sparkles, MapPin, Smile, Activity 
} from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';

export default function PreparednessPage() {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Clean Drinking Water (1 gallon per person per day for 3 days)', category: 'Water', done: true },
    { id: 2, text: 'Non-perishable food rations & protein bars (3-day supply)', category: 'Food', done: true },
    { id: 3, text: 'Battery-powered or hand-crank emergency NOAA radio', category: 'Comms', done: false },
    { id: 4, text: 'First Aid Kit & Prescription Medications (Insulin, BP, Asthma inhalers)', category: 'Medicine', done: true },
    { id: 5, text: 'High-decibel whistle & LED waterproof flashlight with extra batteries', category: 'Safety', done: false },
    { id: 6, text: 'N95 dust mask & plastic sheeting for chemical/dust sealing', category: 'Protection', done: false },
    { id: 7, text: 'Copies of ICE cards, insurance, and photo IDs in waterproof pouch', category: 'Docs', done: true },
  ]);

  const [meetingPoint, setMeetingPoint] = useState('Central City Library Plaza, Gate 2');
  const [groundingStep, setGroundingStep] = useState(0);

  const toggleCheck = (id) => {
    setChecklist(checklist.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const groundingExercises = [
    { step: 1, text: '5 Things You Can SEE around you right now (Name them out loud)' },
    { step: 2, text: '4 Things You Can TOUCH (Your clothing, ground, chair, hands)' },
    { step: 3, text: '3 Things You Can HEAR (Rain, engines, voices, your breath)' },
    { step: 4, text: '2 Things You Can SMELL (Fresh air, soil, soap)' },
    { step: 5, text: '1 Thing You Can TASTE (Sip of water, mint, saliva)' }
  ];

  const handleNextGrounding = () => {
    const next = (groundingStep + 1) % groundingExercises.length;
    setGroundingStep(next);
    voiceAssistant.speak(groundingExercises[next].text);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#CFD0CD]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white">Pre-Disaster Preparedness & Mental Health</h1>
              <p className="text-xs text-[#8A9992] font-mono mt-0.5">
                Go-Bag Checklist • Family Meeting Point • Psychological First Aid (5-4-3-2-1 Grounding)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Go-Bag Checklist & Family Meeting Point */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#8A9992]" />
              72-HOUR EMERGENCY GO-BAG CHECKLIST
            </h3>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-3xl border transition cursor-pointer flex items-center space-x-3 text-xs ${
                    item.done ? 'bg-[#55443A] border-[#8A9992] text-white' : 'bg-[#4D2308]/80 border-[#8A9992]/20 text-[#CFD0CD]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    item.done ? 'bg-[#8A9992] text-[#4D2308]' : 'border border-[#8A9992]/30'
                  }`}>
                    {item.done ? '✓' : ''}
                  </div>
                  <span className="leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Family Meeting Point Setup */}
          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8A9992]" />
              Designated Family Emergency Meeting Point
            </h3>
            <p className="text-xs text-[#8A9992]">Pre-arranged safe location if cell towers collapse during crisis</p>
            <input
              type="text"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className="w-full px-4 py-3 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-bold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
            />
          </div>
        </div>

        {/* Mental Health Psychological First Aid */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 border-2 border-[#8A9992]/20">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                <Smile className="w-6 h-6 text-[#8A9992] animate-pulse" />
                Mental Health Psychological First Aid
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#8A9992]/20 text-[#8A9992] rounded-lg border border-[#8A9992]/30">
                5-4-3-2-1 GROUNDING
              </span>
            </div>

            <p className="text-xs text-[#CFD0CD]">
              For panic, anxiety, shock or grief during disasters. Take deep slow breaths and follow this sensory exercise:
            </p>

            <div className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 text-center space-y-3">
              <span className="w-10 h-10 rounded-full bg-[#8A9992] text-[#4D2308] font-semibold text-lg flex items-center justify-center mx-auto">
                {groundingExercises[groundingStep].step}
              </span>
              <h4 className="text-base font-semibold text-white">
                {groundingExercises[groundingStep].text}
              </h4>
              <button
                onClick={handleNextGrounding}
                className="px-5 py-2.5 bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30"
              >
                Next Grounding Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
