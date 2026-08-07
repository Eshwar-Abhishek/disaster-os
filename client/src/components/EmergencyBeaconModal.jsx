import React, { useState, useEffect } from 'react';
import { AlertOctagon, Volume2, Flashlight, X, Radio } from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';
import { sosMesh } from '../services/meshSimulator';

export default function EmergencyBeaconModal({ isOpen, onClose }) {
  const [strobeActive, setStrobeActive] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [meshSent, setMeshSent] = useState(false);

  useEffect(() => {
    return () => {
      voiceAssistant.synth && voiceAssistant.synth.cancel();
    };
  }, []);

  if (!isOpen) return null;

  const handleToggleSiren = () => {
    if (sirenActive) {
      setSirenActive(false);
    } else {
      setSirenActive(true);
      voiceAssistant.playEmergencySiren(15);
    }
  };

  const handleBroadcastMeshSOS = () => {
    sosMesh.broadcastSOS({
      name: 'Trapped Victim Beacon',
      gps: '17.3850 N, 78.4867 E',
      status: 'CRITICAL BEACON',
      message: 'Trapped in rubble / emergency beacon activated'
    });
    setMeshSent(true);
    setTimeout(() => setMeshSent(false), 4000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between p-6 transition-all ${strobeActive ? 'strobe-active' : 'bg-[#4D2308] text-white'}`}>
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-2 bg-[#DC2626] px-3 py-1.5 rounded-full text-white text-xs font-semibold animate-pulse">
          <AlertOctagon className="w-4 h-4" />
          <span>EMERGENCY BEACON ACTIVE</span>
        </div>
        <button onClick={onClose} className="p-2 bg-[#55443A] hover:bg-[#4D2308] rounded-full text-white border border-[#8A9992]/20 transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center High-Contrast SOS Text */}
      <div className="text-center my-auto space-y-4 z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-widest text-[#DC2626] font-mono animate-pulse">
          HELP / SOS
        </h1>
        <p className="text-2xl font-bold tracking-wider text-white font-mono">
          VICTIM LOCATED HERE
        </p>
        <p className="text-sm text-[#8A9992] font-mono">
          GPS TELEMETRY BROADCASTING VIA SOS MESH RELAY
        </p>

        {meshSent && (
          <div className="p-3 bg-[#22C55E]/15 border border-[#22C55E]/30 rounded-xl text-[#22C55E] text-sm font-mono inline-block">
            ✓ SOS PACKET RELAYED TO NEARBY DEVICE MESH NETWORK
          </div>
        )}
      </div>

      {/* Control Buttons Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto w-full z-10">
        <button
          onClick={() => setStrobeActive(!strobeActive)}
          className={`p-4 rounded-2xl font-semibold text-sm flex flex-col items-center justify-center space-y-2 border transition-all ${
            strobeActive ? 'bg-[#F59E0B] text-black border-[#F59E0B]' : 'bg-[#55443A] border-[#8A9992]/20 text-white hover:bg-[#8A9992] hover:text-[#4D2308]'
          }`}
        >
          <Flashlight className="w-6 h-6" />
          <span>{strobeActive ? 'STOP STROBE LIGHT' : 'ENABLE VISUAL STROBE'}</span>
        </button>

        <button
          onClick={handleToggleSiren}
          className={`p-4 rounded-2xl font-semibold text-sm flex flex-col items-center justify-center space-y-2 border transition-all ${
            sirenActive ? 'bg-[#DC2626] text-white border-[#DC2626] animate-pulse' : 'bg-[#55443A] border-[#8A9992]/20 text-white hover:bg-[#DC2626] hover:border-[#DC2626]'
          }`}
        >
          <Volume2 className="w-6 h-6" />
          <span>{sirenActive ? 'STOP SIREN ALARM' : 'PLAY HIGH-DECIBEL SIREN'}</span>
        </button>

        <button
          onClick={handleBroadcastMeshSOS}
          className="p-4 rounded-2xl font-semibold text-sm bg-[#55443A] hover:bg-[#4D2308] text-white border border-[#8A9992]/40 flex flex-col items-center justify-center space-y-2 shadow-lg shadow-[#55443A]/30"
        >
          <Radio className="w-6 h-6 animate-spin text-[#8A9992]" />
          <span>BROADCAST MESH SOS</span>
        </button>
      </div>
    </div>
  );
}
