import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartPulse, AlertCircle, Phone, Navigation, Hospital, Home, Shield, Flame, 
  MapPin, Radio, Sparkles, Smile, ShieldCheck, UserCheck, Droplets, Utensils, 
  Stethoscope, Package, Baby, Activity, BookOpen, Volume2, Globe2 
} from 'lucide-react';
import EmergencyBeaconModal from '../components/EmergencyBeaconModal';
import EmergencyMedicalCardModal from '../components/EmergencyMedicalCardModal';
import OfflineFirstAidModal from '../components/OfflineFirstAidModal';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import { useAuth } from '../context/AuthContext';

export default function VictimDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showBeacon, setShowBeacon] = useState(false);
  const [showMedicalCard, setShowMedicalCard] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [supplyType, setSupplyType] = useState('Water');
  const [supplyQty, setSupplyQty] = useState('10 Liters Drinking Water');
  const [supplyMsg, setSupplyMsg] = useState('');
  const [supplySuccess, setSupplySuccess] = useState('');

  const handleRequestSupply = async (typeLabel) => {
    setSupplyType(typeLabel);
    
    let lat = 17.3850;
    let lng = 78.4867;
    let addressName = user?.location || 'Sector 4 Promenade';

    const dispatchRequest = async (vLat, vLng, vAddress) => {
      try {
        const qtyText = typeLabel === 'Rescue Team' 
          ? 'URGENT RESCUE SQUAD DISPATCH' 
          : `${typeLabel} Needed Urgently`;

        await api.createSupplyRequest({
          type: typeLabel,
          quantity: qtyText,
          urgency: 'Critical Emergency',
          requester_name: user?.full_name || user?.name || 'Victim Citizen',
          contact_info: user?.phone || '+1-800-555-0888',
          address_or_gps: `GPS (${vLat.toFixed(4)}, ${vLng.toFixed(4)}) • ${vAddress}`,
          latitude: vLat,
          longitude: vLng
        });

        setSupplySuccess(`🚨 EMERGENCY DISPATCH SENT: ${typeLabel} request + your exact GPS location (${vLat.toFixed(4)}, ${vLng.toFixed(4)}) broadcast to Commander Command Center!`);
        setTimeout(() => setSupplySuccess(''), 5000);
      } catch (err) {
        alert('Request error: ' + err.message);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          dispatchRequest(lat, lng, `Live Geolocation (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        },
        () => {
          dispatchRequest(lat, lng, addressName);
        }
      );
    } else {
      dispatchRequest(lat, lng, addressName);
    }
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center">
            <HeartPulse className="w-7 h-7 text-[#CFD0CD] animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Victim Emergency & Survival Portal</h1>
            <p className="text-xs text-[#8A9992] font-mono mt-0.5">
              One-Touch Emergency SOS • Offline Medical First Aid • Nearby Shelters & Hospitals
            </p>
          </div>
        </div>

        {/* Emergency SOS High-Visibility Trigger */}
        <button
          onClick={() => setShowBeacon(true)}
          className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-3xl transition shadow-2xl shadow-rose-600/40 flex items-center space-x-2 animate-bounce shrink-0"
        >
          <Radio className="w-5 h-5 animate-ping" />
          <span>ACTIVATE EMERGENCY SOS BEACON</span>
        </button>
      </div>

      {supplySuccess && (
        <div className="p-3.5 bg-[#22C55E]/20 border border-[#22C55E]/40 rounded-2xl text-[#22C55E] text-xs font-mono text-center">
          ✔ {supplySuccess}
        </div>
      )}

      {/* Main Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => navigate('/nearby')}
          className="p-4 rounded-3xl bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-left transition space-y-2 group shadow-xl"
        >
          <Hospital className="w-6 h-6 text-[#8A9992] group-hover:scale-110 transition" />
          <div>
            <span className="font-bold text-white text-xs block">Nearby ER</span>
            <span className="text-[10px] text-[#8A9992] font-mono">Hospitals</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/shelters')}
          className="p-4 rounded-3xl bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-left transition space-y-2 group shadow-xl"
        >
          <Home className="w-6 h-6 text-[#8A9992] group-hover:scale-110 transition" />
          <div>
            <span className="font-bold text-white text-xs block">Safe Shelters</span>
            <span className="text-[10px] text-[#8A9992] font-mono">Food & Water</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/nearby')}
          className="p-4 rounded-3xl bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-left transition space-y-2 group shadow-xl"
        >
          <Navigation className="w-6 h-6 text-[#22C55E] group-hover:scale-110 transition" />
          <div>
            <span className="font-bold text-white text-xs block">Safe Route</span>
            <span className="text-[10px] text-[#8A9992] font-mono">Bypass Hazards</span>
          </div>
        </button>

        <button
          onClick={() => setShowFirstAid(true)}
          className="p-4 rounded-3xl bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-left transition space-y-2 group shadow-xl"
        >
          <BookOpen className="w-6 h-6 text-[#8A9992] group-hover:scale-110 transition" />
          <div>
            <span className="font-bold text-white text-xs block">Offline Medical</span>
            <span className="text-[10px] text-[#8A9992] font-mono">First Aid Manual</span>
          </div>
        </button>

        <button
          onClick={() => setShowMedicalCard(true)}
          className="p-4 rounded-3xl bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-left transition space-y-2 group shadow-xl"
        >
          <Shield className="w-6 h-6 text-rose-400 group-hover:scale-110 transition" />
          <div>
            <span className="font-bold text-white text-xs block">ICE Card</span>
            <span className="text-[10px] text-[#8A9992] font-mono">Medical Profile</span>
          </div>
        </button>

        <button
          onClick={() => setShowVoiceAssistant(true)}
          className="p-4 rounded-3xl bg-[#4D2308] hover:bg-[#55443A] border border-[#8A9992]/30 text-left transition space-y-2 group shadow-xl"
        >
          <Volume2 className="w-6 h-6 text-[#8A9992] group-hover:scale-110 transition" />
          <div>
            <span className="font-bold text-white text-xs block">AI Voice</span>
            <span className="text-[10px] text-[#8A9992] font-mono">Multilingual Help</span>
          </div>
        </button>
      </div>

      {/* Emergency Supply Request Quick Panel */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="font-semibold text-base text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-[#8A9992]" />
          REQUEST EMERGENCY DISASTER SUPPLIES & RESCUE
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <button
            onClick={() => handleRequestSupply('Water')}
            className="p-3 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 rounded-2xl font-bold transition flex flex-col items-center gap-1.5"
          >
            <Droplets className="w-5 h-5 text-[#22C55E]" />
            <span>Request Water</span>
          </button>

          <button
            onClick={() => handleRequestSupply('Food')}
            className="p-3 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 rounded-2xl font-bold transition flex flex-col items-center gap-1.5"
          >
            <Utensils className="w-5 h-5 text-[#F59E0B]" />
            <span>Request Food</span>
          </button>

          <button
            onClick={() => handleRequestSupply('Medicine')}
            className="p-3 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 rounded-2xl font-bold transition flex flex-col items-center gap-1.5"
          >
            <Stethoscope className="w-5 h-5 text-rose-400" />
            <span>Request Medicine</span>
          </button>

          <button
            onClick={() => handleRequestSupply('Oxygen')}
            className="p-3 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 rounded-2xl font-bold transition flex flex-col items-center gap-1.5"
          >
            <Activity className="w-5 h-5 text-[#8A9992]" />
            <span>Request Oxygen</span>
          </button>

          <button
            onClick={() => handleRequestSupply('Baby Supplies')}
            className="p-3 bg-[#4D2308] hover:bg-[#8A9992] text-[#CFD0CD] hover:text-[#4D2308] border border-[#8A9992]/30 rounded-2xl font-bold transition flex flex-col items-center gap-1.5"
          >
            <Baby className="w-5 h-5 text-[#CFD0CD]" />
            <span>Baby Formula</span>
          </button>

          <button
            onClick={() => handleRequestSupply('Rescue Team')}
            className="p-3 bg-rose-600/30 hover:bg-rose-600 text-white border border-rose-500/50 rounded-2xl font-bold transition flex flex-col items-center gap-1.5"
          >
            <Radio className="w-5 h-5 text-rose-400" />
            <span>Request Rescue</span>
          </button>
        </div>
      </div>

      {/* Navigation Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/survival')}
          className="glass-panel p-5 rounded-3xl space-y-2 cursor-pointer hover:border-[#8A9992] transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-[#CFD0CD]" />
          </div>
          <h4 className="font-bold text-white text-base">Victim Survival & Medical Triage</h4>
          <p className="text-xs text-[#8A9992]">Emergency Phrasebook, GPS locator, offline survival manuals.</p>
        </div>

        <div 
          onClick={() => navigate('/preparedness')}
          className="glass-panel p-5 rounded-3xl space-y-2 cursor-pointer hover:border-[#8A9992] transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#CFD0CD]" />
          </div>
          <h4 className="font-bold text-white text-base">72-Hr Go-Bag & Mental Health Guide</h4>
          <p className="text-xs text-[#8A9992]">Go-bag checklist & 5-4-3-2-1 sensory grounding exercises.</p>
        </div>

        <div 
          onClick={() => navigate('/family-locator')}
          className="glass-panel p-5 rounded-3xl space-y-2 cursor-pointer hover:border-[#8A9992] transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-[#CFD0CD]" />
          </div>
          <h4 className="font-bold text-white text-base">Missing Person & Family Locator</h4>
          <p className="text-xs text-[#8A9992]">Report missing family members and check-in safe status.</p>
        </div>
      </div>

      {/* Modals */}
      <EmergencyBeaconModal isOpen={showBeacon} onClose={() => setShowBeacon(false)} />
      <EmergencyMedicalCardModal isOpen={showMedicalCard} onClose={() => setShowMedicalCard(false)} />
      <OfflineFirstAidModal isOpen={showFirstAid} onClose={() => setShowFirstAid(false)} />
      <VoiceAssistantModal isOpen={showVoiceAssistant} onClose={() => setShowVoiceAssistant(false)} />
    </div>
  );
}
