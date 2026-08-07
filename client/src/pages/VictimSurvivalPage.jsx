import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, Volume2, Flashlight, Bot, BookOpen, Globe2, Stethoscope, 
  ShieldAlert, Radio, Battery, CreditCard, Search, ArrowRight, CheckCircle2,
  Hospital, PhoneCall, Pill, ShieldCheck, MapPin, VolumeX, Sparkles, Compass, Navigation
} from 'lucide-react';
import OfflineFirstAidModal from '../components/OfflineFirstAidModal';
import EmergencyBeaconModal from '../components/EmergencyBeaconModal';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import EmergencyMedicalCardModal from '../components/EmergencyMedicalCardModal';
import { queryOfflineAI } from '../services/offlineAI';
import { voiceAssistant } from '../services/voiceAssistant';
import { api } from '../services/api';

export default function VictimSurvivalPage() {
  const [activeModal, setActiveModal] = useState(null); // 'firstaid', 'beacon', 'voice', 'ice'
  const [triageQuery, setTriageQuery] = useState('');
  const [triageResult, setTriageResult] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [selectedHandbook, setSelectedHandbook] = useState('Flood');
  const [medsTaken, setMedsTaken] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [speakingToast, setSpeakingToast] = useState(null);
  const [victimGps, setVictimGps] = useState({ lat: 17.3850, lng: 78.4867, name: 'Sector 4 Promenade' });

  useEffect(() => {
    fetchVictimLocationAndHospitals();
  }, []);

  const fetchVictimLocationAndHospitals = () => {
    let currentLat = 17.3850;
    let currentLng = 78.4867;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          currentLat = pos.coords.latitude;
          currentLng = pos.coords.longitude;
          setVictimGps({
            lat: currentLat,
            lng: currentLng,
            name: `Live Device GPS (${currentLat.toFixed(4)}, ${currentLng.toFixed(4)})`
          });
          loadHospitalsWithDistance(currentLat, currentLng);
        },
        (err) => {
          console.log('Geolocation fallback active');
          loadHospitalsWithDistance(currentLat, currentLng);
        }
      );
    } else {
      loadHospitalsWithDistance(currentLat, currentLng);
    }
  };

  const loadHospitalsWithDistance = async (vLat, vLng) => {
    try {
      const res = await api.getHospitals();
      const rawList = res.hospitals || res.data?.hospitals || [];
      const formatted = rawList.map(h => ({
        ...h,
        distanceKm: calculateDistance(vLat, vLng, parseFloat(h.latitude), parseFloat(h.longitude))
      })).sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));

      setHospitals(formatted);
    } catch (err) {
      console.log('Error fetching hospitals');
    }
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  }

  const handleTriage = (e) => {
    e.preventDefault();
    if (!triageQuery) return;
    const res = queryOfflineAI(triageQuery);
    setTriageResult(res);
  };

  const handbooks = {
    'Flood': {
      before: 'Move valuable items to upper levels. Prepare waterproof go-bag with drinking water, dry food & torch.',
      during: 'Avoid walking/driving through moving floodwaters. Move to rooftop if trapped and activate Emergency Beacon.',
      after: 'Do not drink raw floodwater. Boil water for at least 3 minutes. Inspect for fallen electrical lines.'
    },
    'Earthquake': {
      before: 'Anchor heavy furniture to walls. Practice Drop, Cover, Hold On with family members.',
      during: 'Drop under heavy table, cover head/neck, hold on. If outdoors, move away from buildings & trees.',
      after: 'Expect aftershocks. Inspect home for gas leaks or structural wall fractures before re-entry.'
    },
    'Fire': {
      before: 'Install smoke detectors. Plan 2 clear evacuation paths from every room.',
      during: 'Crawl low under toxic smoke. Feel door handles with back of hand before opening.',
      after: 'Do not re-enter burned structures until certified safe by official fire responders.'
    },
    'Cyclone': {
      before: 'Board up glass windows. Secure loose outdoor objects and clean rain drains.',
      during: 'Stay indoors in a windowless central room or bathroom under mattresses.',
      after: 'Beware of snapped high-voltage power lines and weakened roofs.'
    },
    'Chemical Plume': {
      before: 'Store N95 masks, plastic sheeting, and duct tape in emergency shelter room.',
      during: 'Evacuate UPWIND/CROSSWIND. If trapped, seal doors and windows with damp towels.',
      after: 'Decontaminate clothing and shower thoroughly with clean running water.'
    }
  };

  // Full 15 Languages Phrasebook with explicit BCP-47 locale tags
  const translations = {
    en: { langCode: 'en-US', name: 'English', help: 'I need immediate medical help!', doctor: 'I need a doctor urgently', baby: 'My baby is injured!', insulin: 'I am diabetic and need insulin!', unconscious: 'My mother is unconscious!', fire: 'There is a fire!', water: 'We need safe drinking water!', shelter: 'Where is the nearest safe shelter?' },
    hi: { langCode: 'hi-IN', name: 'Hindi (हिन्दी)', help: 'मुझे तुरंत चिकित्सा सहायता चाहिए!', doctor: 'मुझे तत्काल डॉक्टर की आवश्यकता है', baby: 'मेरा बच्चा घायल है!', insulin: 'मुझे इंसुलिन की जरूरत है!', unconscious: 'मेरी माँ बेहोश हैं!', fire: 'वहाँ आग लगी है!', water: 'हमें पीने का पानी चाहिए!', shelter: 'निकटतम आश्रय कहाँ है?' },
    te: { langCode: 'te-IN', name: 'Telugu (తెలుగు)', help: 'నాకు వెంటనే వైద్య సహాయం కావాలి!', doctor: 'నాకు అత్యవసరంగా డాక్టర్ కావాలి', baby: 'నా బిడ్డ గాయపడింది!', insulin: 'నాకు ఇన్సులిన్ కావాలి!', unconscious: 'నా తల్లి స్పృహ తప్పి పడిపోయింది!', fire: 'అక్కడ నిప్పు ఉంది!', water: 'మాకు మంచి నీరు కావాలి!', shelter: 'సమీప సురక్షిత ఆశ్రయం ఎక్కడ ఉంది?' },
    ta: { langCode: 'ta-IN', name: 'Tamil (தமிழ்)', help: 'எனக்கு உடனடியாக மருத்துவ உதவி வேண்டும்!', doctor: 'எனக்கு உடனடியாக மருத்துவர் தேவை', baby: 'என் குழந்தை காயமடைந்துள்ளது!', insulin: 'எனக்கு இன்சுலின் தேவை!', unconscious: 'என் அம்மா மயக்கமடைந்துள்ளார்!', fire: 'அங்கே தீ பிடித்துள்ளது!', water: 'எங்களுக்கு குடிநீர் வேண்டும்!', shelter: 'அருகிலுள்ள பாதுகாப்பான தங்குமிடம் எங்கே?' },
    kn: { langCode: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', help: 'ನನಗೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ನೆರವು ಬೇಕು!', doctor: 'ನನಗೆ ವೈದ್ಯರು ತಕ್ಷಣ ಬೇಕು', baby: 'ನನ್ನ ಮಗುವಿಗೆ ಗಾಯವಾಗಿದೆ!', insulin: 'ನನಗೆ ಇನ್ಸುಲಿನ್ ಬೇಕು!', unconscious: 'ನನ್ನ ತಾಯಿ ಪ್ರಜ್ಞೆ ತಪ್ಪಿದ್ದಾರೆ!', fire: 'ಅಲ್ಲಿ ಬೆಂಕಿ ಇದೆ!', water: 'ನಮಗೆ ಕುಡಿಯುವ ನೀರು ಬೇಕು!', shelter: 'ಹತ್ತಿರದ ಆಶ್ರಯ ಎಲ್ಲಿದೆ?' },
    ml: { langCode: 'ml-IN', name: 'Malayalam (മലയാളം)', help: 'എനിക്ക് ഉടനടി വൈദ്യസഹായം വേണം!', doctor: 'എനിക്ക് അടിയന്തരമായി ഡോക്ടറെ വേണം', baby: 'എന്റെ കുട്ടിക്ക് പരിക്കേറ്റു!', insulin: 'എനിക്ക് ഇൻസുലിൻ വേണം!', unconscious: 'എന്റെ അമ്മ ബോധരഹിതയാണ്!', fire: 'അവിടെ തീപിടുത്തമുണ്ട്!', water: 'ഞങ്ങൾക്ക് കുടിവെള്ളം വേണം!', shelter: 'ഏറ്റവും അടുത്തുള്ള അഭയകേന്ദ്രം എവിടെയാണ്?' },
    mr: { langCode: 'mr-IN', name: 'Marathi (मराठी)', help: 'मला ताबडतोब वैद्यकीय मदतीची गरज आहे!', doctor: 'मला तातडीने डॉक्टरांची गरज आहे', baby: 'माझे बाळ जखमी आहे!', insulin: 'मला इन्सुलिन हवे आहे!', unconscious: 'माझी आई बेशुद्ध आहे!', fire: 'तिथे आग लागली आहे!', water: 'आम्हाला पिण्याचे पाणी हवे आहे!', shelter: 'जवळचे सुरक्षित निवारारा कोठे आहे?' },
    gu: { langCode: 'gu-IN', name: 'Gujarati (ગુજરાતી)', help: 'મને તરત જ તબીબી મદદ જોઈએ છે!', doctor: 'મને તાત્કાલિક ડૉક્ટરની જરૂર છે', baby: 'મારું બાળક ઘાયલ છે!', insulin: 'મને ઇન્સ્યુલિનની જરૂર છે!', unconscious: 'મારી માતા બેભાન છે!', fire: 'ત્યાં આગ લાગી છે!', water: 'અમને પીવાનું પાણી જોઈએ છે!', shelter: 'નજીકનું સુરક્ષිත આશ્રય ક્યાં છે?' },
    pa: { langCode: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', help: 'ਮੈਨੂੰ ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਦਦ ਚਾਹੀਦੀ ਹੈ!', doctor: 'ਮੈਨੂੰ ਡਾਕਟਰ ਦੀ ਲੋੜ ਹੈ', baby: 'ਮੇਰਾ ਬੱਚਾ ਜ਼ਖਮੀ ਹੈ!', insulin: 'ਮੈਨੂੰ ਇੰਸੁਲਿਨ ਦੀ ਲੋੜ ਹੈ!', unconscious: 'ਮੇਰੀ ਮਾਂ ਬੇਹੋਸ਼ ਹੈ!', fire: 'ਉੱਥੇ ਅੱਗ ਲੱਗੀ ਹੈ!', water: 'ਸਾਨੂੰ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ!', shelter: 'ਨੇੜਲਾ ਸੁਰੱਖਿਅਤ ਸ਼ੈਲਟਰ ਕਿੱਥੇ ਹੈ?' },
    bn: { langCode: 'bn-IN', name: 'Bengali (বাংলা)', help: 'আমার অবিলম্বে চিকিৎসা সাহায্য প্রয়োজন!', doctor: 'আমার জরুরি ডাক্তার দরকার', baby: 'আমার শিশু আহত!', insulin: 'আমার ইনসুলিন দরকার!', unconscious: 'আমার মা অচেতন!', fire: 'সেখানে আগুন লেগেছে!', water: 'আমাদের পানের জল দরকার!', shelter: 'নিকটতম আশ্রয় কোথায়?' },
    ur: { langCode: 'ur-PK', name: 'Urdu (اردو)', help: 'مجھے فوری طبی امداد کی ضرورت ہے!', doctor: 'مجھے فوری ڈاکٹر کی ضرورت ہے', baby: 'میرا بچہ زخمی ہے!', insulin: 'مجھے انسولین کی ضرورت ہے!', unconscious: 'میری والدہ بے ہوش ہیں!', fire: 'وہاں آگ لگی ہے!', water: 'ہمیں پینے کے پانی کی ضرورت ہے!', shelter: 'قریب ترین محفوظ پناہ گاہ کہاں ہے؟' },
    es: { langCode: 'es-ES', name: 'Spanish (Español)', help: '¡Necesito ayuda médica inmediata!', doctor: 'Necesito un médico con urgencia', baby: '¡Mi bebé está herido!', insulin: '¡Soy diabético y necesito insulina!', unconscious: '¡Mi madre está inconsciente!', fire: '¡Hay un incendio!', water: '¡Necesitamos agua potable!', shelter: '¿Dónde está el refugio más cercano?' },
    fr: { langCode: 'fr-FR', name: 'French (Français)', help: 'J\'ai besoin d\'une aide médicale immédiate !', doctor: 'J\'ai besoin d\'un médecin d\'urgence', baby: 'Mon bébé est blessé !', insulin: 'Je suis diabétique et j\'ai besoin d\'insuline !', unconscious: 'Ma mère est inconsciente !', fire: 'Il y a un incendie !', water: 'Nous avons besoin d\'eau potable !', shelter: 'Où est le refuge le plus proche ?' },
    ar: { langCode: 'ar-SA', name: 'Arabic (العربية)', help: 'أحتاج إلى مساعدة طبية فورية!', doctor: 'أحتاج طبيباً بشكل عاجل', baby: 'طفلي مصاب!', insulin: 'أنا مريض سكر وأحتاج أنسولين!', unconscious: 'أمي فاقدة للوعي!', fire: 'هناك حريق!', water: 'نحتاج مياه شرب صالحة!', shelter: 'أين أقرب مأوى آمن؟' },
    zh: { langCode: 'zh-CN', name: 'Chinese (中文)', help: '我需要立即医疗救助！', doctor: '我紧急需要医生', baby: '我的婴儿受伤了！', insulin: '我是糖尿病患者，需要胰岛素！', unconscious: '我的母亲晕倒了！', fire: '那里着火了！', water: '我们需要安全的饮用水！', shelter: '最近的安全避难所在哪里？' }
  };

  const playPhrase = (text, langKey) => {
    const langObj = translations[langKey] || translations.en;
    setSpeakingToast(`🔊 Speaking in ${langObj.name}: "${text}"`);
    voiceAssistant.speak(text, langObj.langCode);

    setTimeout(() => {
      setSpeakingToast(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Victim Header */}
      <div className="p-6 rounded-3xl bg-[#55443A] border-2 border-[#8A9992]/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-3xl bg-[#8A9992]/20 border border-[#8A9992]/30 flex items-center justify-center text-[#8A9992]">
              <HeartPulse className="w-8 h-8 animate-pulse text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Offline Victim Survival Suite</h1>
              <p className="text-xs text-[#8A9992] font-mono mt-0.5">
                Live Device GPS Active ({victimGps.lat.toFixed(4)}, {victimGps.lng.toFixed(4)}) • Nearest Emergency Hospitals Ranked
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/nearby-finder"
            className="px-5 py-3 rounded-3xl bg-[#8A9992] hover:bg-[#CFD0CD] text-[#4D2308] font-bold text-xs transition shadow-lg flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4 text-[#4D2308]" />
            <span>GPS NEARBY ROUTE FINDER</span>
          </Link>
          <button
            onClick={() => setActiveModal('beacon')}
            className="px-5 py-3 rounded-3xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-lg flex items-center space-x-2 animate-bounce"
          >
            <Flashlight className="w-4 h-4" />
            <span>EMERGENCY SOS BEACON</span>
          </button>
        </div>
      </div>

      {/* HIGHLIGHTED GPS NEARBY ROUTE FINDER CARD */}
      <Link
        to="/nearby-finder"
        className="p-6 rounded-3xl bg-[#55443A] text-white shadow-2xl border-2 border-[#8A9992] hover:scale-[1.01] transition flex items-center justify-between group"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-3xl bg-[#8A9992]/20 border border-[#8A9992] flex items-center justify-center text-white group-hover:scale-110 transition">
            <Compass className="w-8 h-8 animate-spin text-[#CFD0CD]" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8A9992] text-[#4D2308] font-black text-[10px] uppercase">
              VICTIM GPS FEATURE
            </span>
            <h2 className="text-2xl font-black mt-1">NEARBY HOSPITALS, SHELTERS & SAFE ROUTE FINDER</h2>
            <p className="text-xs text-[#CFD0CD] mt-0.5">Detects your live GPS location, finds nearest ER beds & guides you along safe hazard-free routes</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-[#CFD0CD]">Launch Route Guidance →</span>
      </Link>

      {/* REAL-TIME NEARBY EMERGENCY HOSPITALS RANKED BY DISTANCE */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <Hospital className="w-6 h-6 text-[#22C55E] animate-pulse" />
              NEARBY EMERGENCY HOSPITALS (SORTED BY GPS PROXIMITY)
            </h3>
            <p className="text-xs text-[#8A9992] font-mono mt-0.5">
              Live distance calculated from victim location: {victimGps.name}
            </p>
          </div>
          <span className="px-3 py-1 bg-[#22C55E]/20 text-[#22C55E] font-mono text-xs font-bold rounded-lg border border-[#22C55E]/30">
            REALTIME BED TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hospitals.map((hosp) => (
            <div key={hosp.id} className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 space-y-3 flex flex-col justify-between shadow-xl hover:border-[#8A9992] transition">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30">
                    📍 {hosp.distanceKm || '1.2'} km away
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                    {hosp.trauma_level || 'Level 1 Trauma'}
                  </span>
                </div>
                <h4 className="font-semibold text-white text-base mt-2">{hosp.name}</h4>
                <p className="text-xs text-[#CFD0CD] mt-0.5">{hosp.address}</p>

                <div className="mt-3 p-2.5 rounded-xl bg-[#4D2308] border border-[#8A9992]/20 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#8A9992]">Available Beds:</span>
                    <span className="text-[#22C55E] font-semibold">{hosp.available_beds} / {hosp.total_beds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A9992]">ICU Beds:</span>
                    <span className="text-rose-400 font-semibold">{hosp.icu_beds} ICU Beds</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  to="/nearby-finder"
                  className="w-full py-2 bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white font-semibold text-xs rounded-xl transition text-center flex items-center justify-center space-x-1 border border-[#8A9992]/30"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#8A9992]" />
                  <span>Navigate Safe Route →</span>
                </Link>
                <a
                  href={`tel:${hosp.contact_phone}`}
                  className="w-full py-2 bg-[#4D2308] hover:bg-[#55443A] text-white font-semibold text-xs rounded-xl transition text-center flex items-center justify-center space-x-1 border border-[#8A9992]/20"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Call Hospital ER ({hosp.contact_phone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Core Emergency Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveModal('firstaid')}
          className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition flex flex-col justify-between space-y-3 group shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center group-hover:scale-110 transition">
            <HeartPulse className="w-6 h-6 text-[#CFD0CD]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Visual First Aid Guide</h3>
            <p className="text-xs text-[#8A9992] mt-0.5">Step-by-step CPR, bleeding, fractures & burns</p>
          </div>
          <span className="text-xs font-bold text-[#8A9992] font-mono">Launch Offline Cards →</span>
        </button>

        <button
          onClick={() => setActiveModal('voice')}
          className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition flex flex-col justify-between space-y-3 group shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center group-hover:scale-110 transition">
            <Volume2 className="w-6 h-6 text-[#CFD0CD]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Voice Assistant Mic</h3>
            <p className="text-xs text-[#8A9992] mt-0.5">Speech-to-Text & Wake Word Continuous Mode</p>
          </div>
          <span className="text-xs font-bold text-[#8A9992] font-mono">Speak Emergency →</span>
        </button>

        <button
          onClick={() => setActiveModal('beacon')}
          className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition flex flex-col justify-between space-y-3 group shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center group-hover:scale-110 transition">
            <Flashlight className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Siren & Strobe Beacon</h3>
            <p className="text-xs text-[#8A9992] mt-0.5">High decibel alarm & SOS visual strobe</p>
          </div>
          <span className="text-xs font-bold text-[#F59E0B] font-mono">Activate Siren →</span>
        </button>

        <button
          onClick={() => setActiveModal('ice')}
          className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition flex flex-col justify-between space-y-3 group shadow-xl"
        >
          <div className="w-12 h-12 rounded-xl bg-[#8A9992]/20 text-[#8A9992] border border-[#8A9992]/30 flex items-center justify-center group-hover:scale-110 transition">
            <CreditCard className="w-6 h-6 text-[#CFD0CD]" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">ICE Medical Card</h3>
            <p className="text-xs text-[#8A9992] mt-0.5">Blood group, allergies & emergency contacts</p>
          </div>
          <span className="text-xs font-bold text-[#8A9992] font-mono">View ICE Card →</span>
        </button>
      </div>

      {/* Triage Assistant & Offline AI Search */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="font-semibold text-base text-white flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-[#8A9992]" />
          OFFLINE MEDICAL TRIAGE ASSISTANT
        </h3>
        <form onSubmit={handleTriage} className="flex gap-2">
          <input
            type="text"
            placeholder="State symptoms (e.g. broken leg, snake bite, heavy bleeding, chest pain)..."
            value={triageQuery}
            onChange={(e) => setTriageQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-sm text-[#4D2308] font-medium placeholder-[#55443A] focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#55443A] hover:bg-[#4D2308] text-white font-semibold text-sm rounded-xl transition border border-[#8A9992]/30"
          >
            Assess Triage Tag
          </button>
        </form>

        {triageResult && (
          <div className="p-4 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[#8A9992]/20 pb-2">
              <span className="font-bold text-white text-sm">{triageResult.topic}</span>
              <span className="font-mono font-bold px-3 py-1 rounded bg-rose-600 text-white">
                TRIAGE TAG: {triageResult.triageCategory} ({triageResult.severity})
              </span>
            </div>
            <ul className="text-xs text-[#CFD0CD] space-y-1.5 list-disc list-inside">
              {triageResult.steps.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Multilingual Offline Emergency Phrasebook (Fixed 15 Languages High-Fidelity Audio) */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h3 className="font-semibold text-base text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#8A9992] animate-pulse" />
            EMERGENCY TRANSLATION PHRASEBOOK (15 REGIONAL LANGUAGES HIGH-FIDELITY TTS)
          </h3>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Object.keys(translations).map((langKey) => (
              <button
                key={langKey}
                onClick={() => setSelectedLanguage(langKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedLanguage === langKey ? 'bg-[#8A9992] text-[#4D2308] shadow-lg font-bold' : 'bg-[#4D2308] text-[#CFD0CD] hover:text-white border border-[#8A9992]/20'
                }`}
              >
                {translations[langKey].name}
              </button>
            ))}
          </div>
        </div>

        {speakingToast && (
          <div className="p-3 bg-[#8A9992] text-[#4D2308] font-mono font-bold text-xs rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <Volume2 className="w-4 h-4 text-[#4D2308]" />
            <span>{speakingToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => playPhrase(translations[selectedLanguage].help, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">HELP REQUEST</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].help}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].doctor, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">DOCTOR URGENT</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].doctor}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].baby, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">INJURED BABY</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].baby}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].insulin, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">INSULIN NEEDED</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].insulin}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].unconscious, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">MOTHER UNCONSCIOUS</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].unconscious}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].fire, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">FIRE EMERGENCY</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].fire}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].water, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">DRINKING WATER</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].water}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>

          <button 
            onClick={() => playPhrase(translations[selectedLanguage].shelter, selectedLanguage)}
            className="p-4 bg-[#4D2308]/90 rounded-3xl border border-[#8A9992]/20 hover:border-[#8A9992] text-left transition space-y-1.5 group"
          >
            <span className="text-[10px] font-mono font-bold text-[#8A9992] uppercase">SAFE SHELTER</span>
            <p className="text-sm font-black text-white group-hover:text-[#8A9992] transition">{translations[selectedLanguage].shelter}</p>
            <span className="text-[10px] font-mono text-[#CFD0CD] block">🔊 Tap to Speak Aloud</span>
          </button>
        </div>
      </div>

      {/* Disaster Survival Handbook */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h3 className="font-semibold text-base text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#22C55E]" />
            DISASTER SURVIVAL HANDBOOK ENCYCLOPEDIA
          </h3>
          <div className="flex space-x-2">
            {Object.keys(handbooks).map((hb) => (
              <button
                key={hb}
                onClick={() => setSelectedHandbook(hb)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  selectedHandbook === hb ? 'bg-[#8A9992] text-[#4D2308] font-bold' : 'bg-[#4D2308] text-[#CFD0CD] border border-[#8A9992]/20'
                }`}
              >
                {hb}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          <div className="p-4 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 space-y-1">
            <span className="font-mono font-bold text-[#8A9992] uppercase text-[10px]">BEFORE DISASTER:</span>
            <p className="text-[#CFD0CD] leading-relaxed">{handbooks[selectedHandbook].before}</p>
          </div>
          <div className="p-4 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 space-y-1">
            <span className="font-mono font-bold text-rose-400 uppercase text-[10px]">DURING DISASTER:</span>
            <p className="text-[#CFD0CD] leading-relaxed">{handbooks[selectedHandbook].during}</p>
          </div>
          <div className="p-4 bg-[#4D2308]/80 rounded-3xl border border-[#8A9992]/20 space-y-1">
            <span className="font-mono font-bold text-[#F59E0B] uppercase text-[10px]">AFTER DISASTER:</span>
            <p className="text-[#CFD0CD] leading-relaxed">{handbooks[selectedHandbook].after}</p>
          </div>
        </div>
      </div>

      {/* Medication Reminder Widget */}
      <div className="p-5 rounded-3xl bg-[#4D2308]/90 border border-[#8A9992]/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#8A9992]/20 text-[#8A9992] flex items-center justify-center border border-[#8A9992]/30">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Emergency Medication Reminder</h4>
            <p className="text-xs text-[#8A9992]">Asthma Inhaler & Insulin Dose (Daily Scheduled Check)</p>
          </div>
        </div>
        <button
          onClick={() => setMedsTaken(!medsTaken)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            medsTaken ? 'bg-[#22C55E] text-white' : 'bg-[#55443A] hover:bg-[#4D2308] text-[#CFD0CD] hover:text-white border border-[#8A9992]/30'
          }`}
        >
          {medsTaken ? '✔ DOSE LOGGED' : 'MARK DOSE TAKEN'}
        </button>
      </div>

      {/* Modals */}
      <OfflineFirstAidModal isOpen={activeModal === 'firstaid'} onClose={() => setActiveModal(null)} />
      <EmergencyBeaconModal isOpen={activeModal === 'beacon'} onClose={() => setActiveModal(null)} />
      <VoiceAssistantModal isOpen={activeModal === 'voice'} onClose={() => setActiveModal(null)} />
      <EmergencyMedicalCardModal isOpen={activeModal === 'ice'} onClose={() => setActiveModal(null)} />
    </div>
  );
}
