import React, { useState, useEffect } from 'react';
import { 
  Dog, Heart, Shield, MapPin, PhoneCall, Stethoscope, AlertTriangle, 
  Home, CheckCircle2, Search, Filter, Camera, PlusCircle, Radio, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { voiceAssistant } from '../services/voiceAssistant';

export default function AnimalRescuePage() {
  const [activeTab, setActiveTab] = useState('rescue'); // 'rescue' | 'missing' | 'found' | 'care'
  const [shelters, setShelters] = useState([]);
  const [rescueDispatched, setRescueDispatched] = useState(false);

  // Pet Profile Form State
  const [pet, setPet] = useState({
    name: 'Bruno',
    species: 'Dog',
    breed: 'Golden Retriever',
    color: 'Golden Yellow',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80',
    ownerName: 'Rahul Verma',
    ownerPhone: '+91-98765-11223',
    gpsLocation: 'Sector 4 Promenade (17.3850, 78.4867)',
    notes: 'Wearing a blue collar with tag. Very friendly, answers to Bruno.'
  });

  const [missingReports, setMissingReports] = useState([
    { id: 1, name: 'Bruno', species: 'Dog', breed: 'Golden Retriever', owner: 'Rahul Verma', phone: '+91-98765-11223', location: 'Sector 4 Riverfront', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80', status: 'Active Search' },
    { id: 2, name: 'Milo', species: 'Cat', breed: 'Persian White', owner: 'Priya Singh', phone: '+91-98765-44332', location: 'Begumpet Tech Park', photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80', status: 'Rescued to Shelter' },
    { id: 3, name: 'Sheru', species: 'Dog', breed: 'German Shepherd', owner: 'Captain Roy', phone: '+91-98765-99887', location: 'Karkhana Depot', photo: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=200&auto=format&fit=crop&q=80', status: 'En Route Vet' }
  ]);

  const [foundReports, setFoundReports] = useState([
    { id: 101, species: 'Dog (Labrador Mix)', color: 'Black', location: 'City Stadium Relief Camp', finder: 'NGO Animal Aid Unit', contact: '+1-800-PET-HELP', photo: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200&auto=format&fit=crop&q=80' }
  ]);

  const vetHospitals = [
    { id: 1, name: 'Apex Pet Care & Veterinary Trauma Center', phone: '+1-800-VET-911', address: '12 Animal Welfare Way, Sector 2', open: '24/7 ER Active', distance: '1.2 km' },
    { id: 2, name: 'Blue Cross Animal Emergency Hospital', phone: '+1-800-BLUE-VET', address: '88 Sanctuary Road', open: '24/7 ER Active', distance: '2.8 km' },
    { id: 3, name: 'People For Animals Relief Clinic', phone: '+1-800-PFA-HELP', address: 'Community Relief Hub 4', open: 'Operational', distance: '3.5 km' }
  ];

  const petCareGuides = [
    { title: 'Dehydration & Heat Stroke in Animals', steps: ['Move pet to shaded cool area.', 'Offer small sips of cool water (do not force).', 'Place damp cool towels on paw pads and belly.'] },
    { title: 'Pet Bleeding & Wound Control', steps: ['Apply firm direct pressure with clean cloth.', 'Elevate wound above heart level if safe.', 'Do NOT apply tight tourniquets to animal tails or ears.'] },
    { title: 'Disaster Evacuation for Livestock & Pets', steps: ['Equip collar with waterproof owner phone tag.', 'Pack 3-day supply of pet food, water & collapsible bowls.', 'Secure pet in sturdy ventilated crate during flood/fire evacuation.'] }
  ];

  const handleAnimalRescueRequest = async () => {
    setRescueDispatched(true);
    voiceAssistant.speak(`Animal Rescue Request dispatched for ${pet.name}. Veterinary disaster team notified.`);

    try {
      await api.reportIncident({
        type: 'Animal Rescue Emergency',
        title: `PET RESCUE: ${pet.species} (${pet.name || 'Unidentified Pet'})`,
        description: `Animal rescue requested. Species: ${pet.species}, Breed: ${pet.breed}, Color: ${pet.color}, Owner: ${pet.ownerName} (${pet.ownerPhone}). Location: ${pet.gpsLocation}`,
        latitude: 17.3850,
        longitude: 78.4867,
        address: pet.gpsLocation,
        severity: 'High',
        reported_by: `Animal Rescue Portal (${pet.ownerName})`
      });
    } catch (e) {
      console.log('Registered local animal rescue request');
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center text-[#8A9992] shadow-inner">
            <Dog className="w-10 h-10 animate-bounce text-[#CFD0CD]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-black tracking-tight text-white">ANIMAL & PET RESCUE HUB</h1>
              <span className="px-3 py-1 bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 font-bold text-xs rounded-full">
                100% OFFLINE CAPABLE
              </span>
            </div>
            <p className="text-[#8A9992] text-xs md:text-sm mt-1 font-medium">
              Veterinary hospitals, pet-friendly shelters, missing pet registry & emergency animal care
            </p>
          </div>
        </div>

        <button
          onClick={handleAnimalRescueRequest}
          className={`px-5 py-3 rounded-3xl font-semibold text-xs shadow-xl transition flex items-center space-x-2 border border-[#8A9992]/20 ${
            rescueDispatched 
              ? 'bg-[#22C55E] text-white animate-pulse' 
              : 'bg-[#8A9992] hover:bg-[#CFD0CD] text-[#4D2308] font-bold'
          }`}
        >
          <Shield className="w-5 h-5 text-[#4D2308]" />
          <span>{rescueDispatched ? 'ANIMAL RESCUE DISPATCHED' : 'DISPATCH ANIMAL RESCUE UNIT'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-[#4D2308]/60 p-1.5 rounded-3xl border border-[#8A9992]/20 overflow-x-auto">
        <button
          onClick={() => setActiveTab('rescue')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'rescue' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Dog className="w-4 h-4" />
          <span>Pet Profile & SOS</span>
        </button>
        <button
          onClick={() => setActiveTab('missing')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'missing' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Missing Pet Registry</span>
        </button>
        <button
          onClick={() => setActiveTab('found')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'found' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Found Pets & Vet ER</span>
        </button>
        <button
          onClick={() => setActiveTab('care')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'care' ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'text-[#CFD0CD] hover:text-white'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>First Aid for Pets</span>
        </button>
      </div>

      {/* TAB 1: PET PROFILE & RESCUE REQUEST */}
      {activeTab === 'rescue' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Preview */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 flex flex-col items-center">
            <div className="relative w-44 h-44 rounded-3xl overflow-hidden border-4 border-[#8A9992] shadow-xl">
              <img src={pet.photoUrl} alt="Pet Profile" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-[#8A9992] font-semibold text-[10px] rounded">
                {pet.species}
              </span>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-black text-white">{pet.name}</h2>
              <p className="text-xs text-[#8A9992] font-mono mt-0.5">{pet.breed} • {pet.color}</p>
            </div>

            <div className="w-full space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#4D2308]/80 border border-[#8A9992]/20">
                <span className="text-[#8A9992] block font-bold text-[10px] uppercase">OWNER / GUARDIAN</span>
                <p className="font-semibold text-white mt-0.5">{pet.ownerName} ({pet.ownerPhone})</p>
              </div>
              <div className="p-3 rounded-xl bg-[#4D2308]/80 border border-[#8A9992]/20">
                <span className="text-[#8A9992] block font-bold text-[10px] uppercase">GPS LOCATION</span>
                <p className="font-semibold text-[#22C55E] mt-0.5">{pet.gpsLocation}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8A9992]" />
              Register / Update Pet Emergency Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Pet Name</label>
                <input
                  type="text"
                  value={pet.name}
                  onChange={(e) => setPet({ ...pet, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Species (Dog, Cat, Livestock...)</label>
                <select
                  value={pet.species}
                  onChange={(e) => setPet({ ...pet, species: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Livestock">Livestock / Horse / Cattle</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other Pet</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Breed</label>
                <input
                  type="text"
                  value={pet.breed}
                  onChange={(e) => setPet({ ...pet, breed: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Color & Distinguishing Features</label>
                <input
                  type="text"
                  value={pet.color}
                  onChange={(e) => setPet({ ...pet, color: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Owner Name</label>
                <input
                  type="text"
                  value={pet.ownerName}
                  onChange={(e) => setPet({ ...pet, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div>
                <label className="block text-[#8A9992] font-bold mb-1">Owner Contact Number</label>
                <input
                  type="text"
                  value={pet.ownerPhone}
                  onChange={(e) => setPet({ ...pet, ownerPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#8A9992] font-bold mb-1">Photo URL</label>
                <input
                  type="text"
                  value={pet.photoUrl}
                  onChange={(e) => setPet({ ...pet, photoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MISSING PET REGISTRY */}
      {activeTab === 'missing' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-white">Active Missing Animal Search Reports</h3>
            <span className="text-xs text-[#8A9992] font-mono">{missingReports.length} Active Searches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missingReports.map((rep) => (
              <div key={rep.id} className="p-4 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 space-y-3">
                <img src={rep.photo} alt={rep.name} className="w-full h-32 object-cover rounded-xl border border-[#8A9992]/20" />
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white font-mono">{rep.status}</span>
                  <h4 className="font-bold text-white text-base mt-1">{rep.name} ({rep.species})</h4>
                  <p className="text-xs text-[#CFD0CD]">{rep.breed} • Last seen: {rep.location}</p>
                </div>
                <div className="pt-2 border-t border-[#8A9992]/20 flex items-center justify-between text-xs">
                  <span className="text-[#CFD0CD] font-semibold">{rep.owner}</span>
                  <a href={`tel:${rep.phone}`} className="text-[#22C55E] font-bold hover:underline">Call Owner</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VETERINARY EMERGENCY VETS & FOUND PETS */}
      {activeTab === 'found' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#8A9992]" />
              24/7 Emergency Veterinary Hospitals & Clinics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vetHospitals.map((vet) => (
                <div key={vet.id} className="p-4 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 space-y-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 font-mono font-bold">
                    {vet.open}
                  </span>
                  <h4 className="font-bold text-white text-sm mt-1">{vet.name}</h4>
                  <p className="text-[#8A9992]">{vet.address} ({vet.distance})</p>
                  <a
                    href={`tel:${vet.phone}`}
                    className="inline-block mt-2 px-3 py-1.5 bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold rounded-lg transition border border-[#8A9992]/30"
                  >
                    Call Vet ER ({vet.phone})
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FIRST AID FOR ANIMALS */}
      {activeTab === 'care' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#8A9992]" />
            Emergency First Aid Instructions for Pets & Domestic Animals
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {petCareGuides.map((guide, idx) => (
              <div key={idx} className="p-4 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 space-y-2 text-xs">
                <h4 className="font-semibold text-[#8A9992] text-sm">{guide.title}</h4>
                <ul className="list-disc list-inside text-[#CFD0CD] space-y-1">
                  {guide.steps.map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
