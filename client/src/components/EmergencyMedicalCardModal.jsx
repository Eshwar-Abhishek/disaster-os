import React, { useState, useEffect } from 'react';
import { X, Heart, ShieldAlert, User, Phone, Edit2, Save } from 'lucide-react';

export default function EmergencyMedicalCardModal({ isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [medData, setMedData] = useState({
    name: 'John Citizen',
    bloodType: 'O Positive (O+)',
    allergies: 'Penicillin, Peanuts',
    conditions: 'Type 1 Diabetes, Asthma',
    medications: 'Insulin Glargine 20u, Albuterol Inhaler',
    emergencyContact: 'Sarah Vance (Wife): +1-800-555-0999',
    insuranceId: 'RESQ-ICE-992014'
  });

  useEffect(() => {
    const saved = localStorage.getItem('resq_medical_card');
    if (saved) {
      try { setMedData(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('resq_medical_card', JSON.stringify(medData));
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#55443A] border-2 border-[#DC2626]/60 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-left text-[#CFD0CD]">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8A9992] hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* ICE Card Header */}
        <div className="flex items-center space-x-3 border-b border-[#8A9992]/20 pb-3">
          <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">EMERGENCY MEDICAL ICE CARD</h3>
            <p className="text-xs text-rose-400 font-mono">LOCK SCREEN FIRST RESPONDER ACCESSIBLE</p>
          </div>
        </div>

        {/* Form or Display */}
        {isEditing ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#8A9992] font-mono mb-1">Full Name</label>
              <input
                type="text"
                value={medData.name}
                onChange={(e) => setMedData({ ...medData, name: e.target.value })}
                className="w-full p-2 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-medium placeholder-[#55443A]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[#8A9992] font-mono mb-1">Blood Group</label>
                <input
                  type="text"
                  value={medData.bloodType}
                  onChange={(e) => setMedData({ ...medData, bloodType: e.target.value })}
                  className="w-full p-2 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-medium"
                />
              </div>
              <div>
                <label className="block text-[#8A9992] font-mono mb-1">Insurance / ID</label>
                <input
                  type="text"
                  value={medData.insuranceId}
                  onChange={(e) => setMedData({ ...medData, insuranceId: e.target.value })}
                  className="w-full p-2 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#8A9992] font-mono mb-1">Allergies</label>
              <input
                type="text"
                value={medData.allergies}
                onChange={(e) => setMedData({ ...medData, allergies: e.target.value })}
                className="w-full p-2 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-medium"
              />
            </div>
            <div>
              <label className="block text-[#8A9992] font-mono mb-1">Medical Conditions</label>
              <input
                type="text"
                value={medData.conditions}
                onChange={(e) => setMedData({ ...medData, conditions: e.target.value })}
                className="w-full p-2 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-medium"
              />
            </div>
            <div>
              <label className="block text-[#8A9992] font-mono mb-1">ICE Emergency Contact</label>
              <input
                type="text"
                value={medData.emergencyContact}
                onChange={(e) => setMedData({ ...medData, emergencyContact: e.target.value })}
                className="w-full p-2 bg-[#CFD0CD] border border-[#8A9992] rounded-lg text-[#4D2308] font-medium"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-[#4D2308] hover:bg-[#8A9992] hover:text-[#4D2308] text-white font-bold rounded-xl flex items-center justify-center space-x-2 border border-[#8A9992]/40 transition"
            >
              <Save className="w-4 h-4 text-[#8A9992]" />
              <span>Save Medical Card</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-[#4D2308]/80 rounded-xl border border-[#8A9992]/20 flex justify-between items-center">
              <div>
                <p className="text-[#8A9992] font-mono text-[10px]">PATIENT NAME</p>
                <h4 className="text-base font-semibold text-white">{medData.name}</h4>
              </div>
              <div className="text-right">
                <p className="text-[#8A9992] font-mono text-[10px]">BLOOD TYPE</p>
                <span className="text-base font-semibold text-rose-400 font-mono">{medData.bloodType}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#4D2308]/80 rounded-xl border border-[#8A9992]/20">
                <span className="text-[#F59E0B] font-mono text-[10px] font-bold block">ALLERGIES</span>
                <p className="text-[#CFD0CD] font-semibold mt-0.5">{medData.allergies}</p>
              </div>
              <div className="p-3 bg-[#4D2308]/80 rounded-xl border border-[#8A9992]/20">
                <span className="text-[#8A9992] font-mono text-[10px] font-bold block">CONDITIONS</span>
                <p className="text-[#CFD0CD] font-semibold mt-0.5">{medData.conditions}</p>
              </div>
            </div>

            <div className="p-3 bg-[#4D2308]/80 rounded-xl border border-[#8A9992]/20">
              <span className="text-rose-400 font-mono text-[10px] font-bold block">IN CASE OF EMERGENCY (ICE) CONTACT</span>
              <p className="text-[#CFD0CD] font-semibold mt-0.5">{medData.emergencyContact}</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] font-bold rounded-xl flex items-center justify-center space-x-2 border border-[#8A9992]/30 transition"
            >
              <Edit2 className="w-4 h-4 text-[#8A9992]" />
              <span>Edit Emergency Card Info</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
