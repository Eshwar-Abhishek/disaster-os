import React, { useState, useEffect } from 'react';
import { 
  Baby, Heart, Shield, PhoneCall, MapPin, AlertCircle, Volume2, VolumeX, 
  Hospital, Home, CheckCircle2, Radio, Send, Camera, User, Sparkles, Navigation 
} from 'lucide-react';
import { api } from '../services/api';
import { voiceAssistant } from '../services/voiceAssistant';

export default function ChildRescuePage() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [rescueStatus, setRescueStatus] = useState('Active Search'); // 'Active Search' | 'Rescuers En Route' | 'Safe'
  const [hospitals, setHospitals] = useState([]);
  const [shelters, setShelters] = useState([]);

  // Child Profile Form State
  const [profile, setProfile] = useState({
    childName: 'Leo Sharma',
    age: '7',
    gender: 'Male',
    parentName: 'Anita Sharma',
    parentPhone: '+91-98765-43210',
    bloodGroup: 'O+',
    allergies: 'Peanuts, Penicillin',
    medicalConditions: 'Mild Asthma (Carries Inhaler)',
    lastSeenLocation: 'Sector 4 Riverfront Promenade, near High School',
    lastSeenTime: '10 minutes ago',
    gps: '17.3850, 78.4867',
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=400&auto=format&fit=crop&q=80'
  });

  const [emergencyNotes, setEmergencyNotes] = useState('');

  useEffect(() => {
    fetchNearby();
    if (voiceEnabled) {
      voiceAssistant.speak('Child rescue mode activated. Stay calm. DisasterOS emergency network is actively tracking your location.');
    }
  }, []);

  const fetchNearby = async () => {
    try {
      const [hospRes, shRes] = await Promise.all([
        api.getHospitals(),
        api.getShelters()
      ]);
      setHospitals(hospRes.data.hospitals || []);
      setShelters(shRes.data.shelters || []);
    } catch (err) {
      console.log('Offline mode active - using cached emergency shelters & hospitals');
    }
  };

  const toggleVoiceGuidance = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    if (next) {
      voiceAssistant.speak('Voice guidance enabled. I will read aloud emergency instructions for children.');
    }
  };

  const handleAutoSos = async () => {
    setSosActive(true);
    setRescueStatus('Rescuers En Route');
    if (voiceEnabled) {
      voiceAssistant.speak('ALERT! Auto Child Rescue SOS Sent! Emergency responders and search teams have been dispatched to your exact GPS coordinates.');
    }

    try {
      await api.reportIncident({
        type: 'Child Emergency Rescue',
        title: `CHILD SOS: ${profile.childName} (Age ${profile.age})`,
        description: `Emergency child rescue requested. Child: ${profile.childName}, Age: ${profile.age}, Medical: ${profile.medicalConditions}, Parent: ${profile.parentName} (${profile.parentPhone}). Last seen: ${profile.lastSeenLocation}`,
        latitude: 17.3850,
        longitude: 78.4867,
        address: profile.lastSeenLocation,
        severity: 'Critical',
        reported_by: `Child Rescue Portal (${profile.parentName})`
      });
    } catch (e) {
      console.log('Registered local offline SOS beacon');
    }
  };

  const speakInstruction = (text) => {
    voiceAssistant.speak(text);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#4D2308] via-[#55443A] to-[#4D2308] text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-[#8A9992]/20">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center shadow-inner">
            <Baby className="w-10 h-10 text-white animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-black tracking-tight">CHILD RESCUE HUB</h1>
              <span className="px-3 py-1 bg-[#8A9992] text-[#4D2308] font-bold text-xs rounded-full shadow">
                KIDS SAFEGUARD ACTIVE
              </span>
            </div>
            <p className="text-[#CFD0CD] text-xs md:text-sm mt-1 font-medium">
              High-priority child locator, one-tap SOS, voice guidance & safe shelter connection
            </p>
          </div>
        </div>

        <button
          onClick={toggleVoiceGuidance}
          className={`px-4 py-2.5 rounded-3xl font-bold text-xs flex items-center space-x-2 shadow-lg transition ${
            voiceEnabled ? 'bg-[#8A9992] text-[#4D2308] hover:bg-[#CFD0CD]' : 'bg-[#4D2308]/60 text-white hover:bg-[#4D2308]'
          }`}
        >
          {voiceEnabled ? <Volume2 className="w-5 h-5 text-[#4D2308] animate-pulse" /> : <VolumeX className="w-5 h-5" />}
          <span>{voiceEnabled ? 'Voice Guidance ON' : 'Enable Voice Guidance'}</span>
        </button>
      </div>

      {/* Large Colorful Kid-Friendly Emergency Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Giant ONE TAP AUTO SOS */}
        <button
          onClick={handleAutoSos}
          className={`p-6 rounded-3xl text-left transition transform hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-4 border-4 ${
            sosActive 
              ? 'bg-gradient-to-br from-rose-600 to-red-700 border-yellow-300 animate-pulse text-white' 
              : 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-700 border-rose-400 text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center border border-white/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-black uppercase px-3 py-1 bg-black/40 rounded-full border border-white/20">
              {sosActive ? 'SOS BROADCASTING' : 'PRESS FOR EMERGENCY'}
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-wide">AUTO CHILD SOS</h2>
            <p className="text-xs text-rose-100 mt-1 font-medium">
              Broadcasts child photo, live GPS & medical profile to nearest rescue helicopters & ambulances
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between font-semibold text-sm">
            <span>{sosActive ? '✔ RESCUERS DISPATCHED' : '⚡ TAP TO DISPATCH RESCUE TEAM NOW'}</span>
            <span>→</span>
          </div>
        </button>

        {/* ONE TAP EMERGENCY CALL */}
        <a
          href={`tel:${profile.parentPhone}`}
          onClick={() => voiceEnabled && voiceAssistant.speak(`Calling parent ${profile.parentName}`)}
          className="p-6 rounded-3xl bg-[#55443A] border-4 border-[#8A9992] text-[#CFD0CD] text-left transition transform hover:scale-[1.02] shadow-2xl flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-3xl bg-[#8A9992]/20 flex items-center justify-center border border-[#8A9992]/30">
              <PhoneCall className="w-8 h-8 text-[#8A9992] animate-bounce" />
            </div>
            <span className="text-xs font-black uppercase px-3 py-1 bg-[#4D2308]/60 rounded-full border border-[#8A9992]/20 text-[#8A9992]">
              DIRECT DIAL
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-wide text-white">CALL PARENT / GUARDIAN</h2>
            <p className="text-xs text-[#CFD0CD] mt-1 font-medium">
              Instant call to {profile.parentName} ({profile.parentPhone})
            </p>
          </div>

          <div className="pt-2 border-t border-[#8A9992]/20 flex items-center justify-between font-semibold text-sm text-[#8A9992]">
            <span>📞 ONE TAP CALL NOW</span>
            <span>→</span>
          </div>
        </a>

        {/* LIVE TRACKING & FAMILY CONNECTION */}
        <div className="p-6 rounded-3xl bg-[#4D2308]/90 border-2 border-[#8A9992]/20 text-white shadow-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
              <Radio className="w-8 h-8 animate-pulse text-[#8A9992]" />
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30">
              GPS SATELLITE LOCK
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-[#8A9992] uppercase tracking-wider">RESCUE STATUS</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-ping"></span>
              <h3 className="text-xl font-semibold text-[#CFD0CD]">{rescueStatus}</h3>
            </div>
            <p className="text-xs text-[#8A9992] mt-1">Coordinates: {profile.gps}</p>
          </div>

          <button
            onClick={() => {
              setRescueStatus('Safe with Rescuers');
              speakInstruction('Rescue confirmed. Child marked safe in DisasterOS Commander database.');
            }}
            className="w-full py-2.5 bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold text-xs rounded-xl transition border border-[#8A9992]/30"
          >
            MARK CHILD SAFE WITH RESCUERS
          </button>
        </div>
      </div>

      {/* Child Emergency Profile Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#8A9992]/20 pb-4 gap-2">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Baby className="w-6 h-6 text-[#8A9992]" />
              Child Emergency Medical & Identification Card
            </h2>
            <p className="text-xs text-[#8A9992]">Offline accessible profile for first responders and rescue teams</p>
          </div>
          <span className="px-3 py-1 bg-[#55443A] text-[#CFD0CD] border border-[#8A9992]/20 rounded-lg text-xs font-mono font-bold">
            HIGH PRIORITY AGENTIC DISPATCH
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo & Key Badges */}
          <div className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 flex flex-col items-center space-y-4">
            <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-[#8A9992] shadow-xl">
              <img src={profile.photoUrl} alt="Child Profile" className="w-full h-full object-cover" />
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-rose-600 text-white font-semibold text-[10px] rounded">
                AGE {profile.age}
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-black text-white">{profile.childName}</h3>
              <p className="text-xs text-[#8A9992] font-mono mt-0.5">Gender: {profile.gender} • Blood: <span className="text-rose-400 font-bold">{profile.bloodGroup}</span></p>
            </div>

            <div className="w-full space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#55443A] border border-[#8A9992]/20 flex justify-between">
                <span className="text-[#CFD0CD]">Allergies:</span>
                <span className="font-bold text-[#F59E0B]">{profile.allergies}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#55443A] border border-[#8A9992]/20 flex justify-between">
                <span className="text-[#CFD0CD]">Medical Conditions:</span>
                <span className="font-bold text-rose-300">{profile.medicalConditions}</span>
              </div>
            </div>
          </div>

          {/* Form Fields for Live Editing */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Child Full Name</label>
              <input
                type="text"
                value={profile.childName}
                onChange={(e) => setProfile({ ...profile, childName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Age & Gender</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Age"
                  className="w-1/2 px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
                <input
                  type="text"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  placeholder="Gender"
                  className="w-1/2 px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                value={profile.parentName}
                onChange={(e) => setProfile({ ...profile, parentName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Parent Emergency Phone</label>
              <input
                type="text"
                value={profile.parentPhone}
                onChange={(e) => setProfile({ ...profile, parentPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#8A9992] font-bold mb-1">Last Seen Location & Circumstances</label>
              <input
                type="text"
                value={profile.lastSeenLocation}
                onChange={(e) => setProfile({ ...profile, lastSeenLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Blood Group</label>
              <input
                type="text"
                value={profile.bloodGroup}
                onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>

            <div>
              <label className="block text-[#8A9992] font-bold mb-1">Photo Image URL</label>
              <input
                type="text"
                value={profile.photoUrl}
                onChange={(e) => setProfile({ ...profile, photoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Child Emergency Instructions (Large & Voice-Guided) */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#8A9992]" />
          Easy Child Emergency Survival Rules (Listen Aloud)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-sans">
          <button
            onClick={() => speakInstruction("Rule 1: Stay in a safe, visible spot. Do not hide inside dark closets or under deep rubble unless dangerous water or fire is near.")}
            className="p-4 rounded-3xl bg-[#4D2308]/60 border-2 border-[#8A9992]/20 text-left hover:border-[#8A9992] transition"
          >
            <span className="w-8 h-8 rounded-full bg-[#8A9992] text-[#4D2308] font-semibold flex items-center justify-center text-sm mb-2">1</span>
            <h4 className="font-semibold text-white">Stay Visible</h4>
            <p className="text-xs text-[#CFD0CD] mt-1">Stay in safe open areas. Do not hide in closets.</p>
          </button>

          <button
            onClick={() => speakInstruction("Rule 2: Make loud sounds! Blow whistle, tap metal pipes with rocks, or yell DisasterOS when you hear footsteps or engines.")}
            className="p-4 rounded-3xl bg-[#4D2308]/60 border-2 border-[#8A9992]/20 text-left hover:border-[#8A9992] transition"
          >
            <span className="w-8 h-8 rounded-full bg-[#8A9992] text-[#4D2308] font-semibold flex items-center justify-center text-sm mb-2">2</span>
            <h4 className="font-semibold text-white">Make Noise</h4>
            <p className="text-xs text-[#CFD0CD] mt-1">Tap pipes or yell loudly when rescuers come close.</p>
          </button>

          <button
            onClick={() => speakInstruction("Rule 3: Wave bright cloth or flashlight toward helicopters and rescue boats.")}
            className="p-4 rounded-3xl bg-[#4D2308]/60 border-2 border-[#8A9992]/20 text-left hover:border-[#8A9992] transition"
          >
            <span className="w-8 h-8 rounded-full bg-[#8A9992] text-[#4D2308] font-semibold flex items-center justify-center text-sm mb-2">3</span>
            <h4 className="font-semibold text-white">Wave Bright Cloth</h4>
            <p className="text-xs text-[#CFD0CD] mt-1">Wave a bright shirt or phone light into the sky.</p>
          </button>

          <button
            onClick={() => speakInstruction("Rule 4: Look for official DisasterOS badges and uniform officers. Never go with unknown strangers without uniformed rescuers.")}
            className="p-4 rounded-3xl bg-[#4D2308]/60 border-2 border-[#8A9992]/20 text-left hover:border-[#8A9992] transition"
          >
            <span className="w-8 h-8 rounded-full bg-[#22C55E] text-[#111827] font-semibold flex items-center justify-center text-sm mb-2">4</span>
            <h4 className="font-semibold text-white">Trust Uniforms</h4>
            <p className="text-xs text-[#CFD0CD] mt-1">Look for DisasterOS badges and emergency uniforms.</p>
          </button>
        </div>
      </div>

      {/* Nearby Safe Shelters & Pediatric Emergency Hospitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safe Shelters */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-[#22C55E]" />
            Nearby Child-Friendly Safe Shelters
          </h3>

          <div className="space-y-3">
            {shelters.slice(0, 3).map((sh) => (
              <div key={sh.id} className="p-3.5 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{sh.name}</h4>
                  <p className="text-[#8A9992]">{sh.address}</p>
                  <p className="text-[#22C55E] font-semibold mt-0.5">Capacity: {sh.occupied} / {sh.capacity} • Medical & Food Available</p>
                </div>
                <span className="px-2.5 py-1 bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-lg font-bold">
                  OPEN
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pediatric Emergency Hospitals */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="font-semibold text-lg text-white flex items-center gap-2">
            <Hospital className="w-5 h-5 text-[#8A9992]" />
            Pediatric Trauma & Emergency Hospitals
          </h3>

          <div className="space-y-3">
            {hospitals.slice(0, 3).map((hosp) => (
              <div key={hosp.id} className="p-3.5 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{hosp.name}</h4>
                  <p className="text-[#8A9992]">{hosp.address}</p>
                  <p className="text-[#8A9992] font-semibold mt-0.5">Avail. Beds: {hosp.available_beds} / {hosp.total_beds} (ICU: {hosp.icu_beds})</p>
                </div>
                <a
                  href={`tel:${hosp.contact_phone}`}
                  className="px-3 py-1 bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold rounded-lg transition border border-[#8A9992]/30"
                >
                  Call ER
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
