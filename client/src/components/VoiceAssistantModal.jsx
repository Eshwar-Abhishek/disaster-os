import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Bot, Sparkles, Radio, Activity, Globe } from 'lucide-react';
import { voiceAssistant } from '../services/voiceAssistant';
import { queryOfflineAI, getMultilingualAIResponse } from '../services/offlineAI';

export default function VoiceAssistantModal({ isOpen, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);
  const [wakeWordMode, setWakeWordMode] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [cprActive, setCprActive] = useState(false);
  const [cprCount, setCprCount] = useState(0);

  useEffect(() => {
    return () => {
      voiceAssistant.stopListening();
      voiceAssistant.stopCPRMetronome();
    };
  }, []);

  if (!isOpen) return null;

  const handleStartVoice = () => {
    setIsListening(true);
    setUserSpeech('Listening for emergency voice command...');
    setAiAnswer(null);

    voiceAssistant.setLanguage(selectedLang);
    voiceAssistant.startListening(
      (transcript) => {
        setIsListening(false);
        setUserSpeech(transcript);
        const result = queryOfflineAI(transcript);
        const localized = getMultilingualAIResponse(result, selectedLang);
        setAiAnswer(localized);

        // Speak back in the EXACT language selected by the user
        voiceAssistant.speak(localized.spokenText, selectedLang);
      },
      (err) => {
        setIsListening(false);
        setUserSpeech('Voice Input: ' + err);
      },
      (wakeWordText) => {
        setUserSpeech(`[WAKE WORD TRIGGERED] "${wakeWordText}"`);
        const result = queryOfflineAI('emergency first aid');
        const localized = getMultilingualAIResponse(result, selectedLang);
        setAiAnswer(localized);

        voiceAssistant.speak(localized.spokenText, selectedLang);
      }
    );
  };

  const toggleWakeWordMode = () => {
    const next = !wakeWordMode;
    setWakeWordMode(next);
    if (next) {
      voiceAssistant.isContinuous = true;
      handleStartVoice();
      setUserSpeech('Listening continuously for wake words ("Help", "Emergency", "DisasterOS")...');
    } else {
      voiceAssistant.stopListening();
      setIsListening(false);
      setUserSpeech('Hands-free mode paused.');
    }
  };

  const toggleCPRMetronome = () => {
    if (cprActive) {
      voiceAssistant.stopCPRMetronome();
      setCprActive(false);
      setCprCount(0);
    } else {
      setCprActive(true);
      voiceAssistant.startCPRMetronome((count) => setCprCount(count));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#55443A] border border-[#8A9992]/20 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-elevated relative text-center text-[#CFD0CD]">
        <button 
          onClick={() => {
            voiceAssistant.stopListening();
            voiceAssistant.stopCPRMetronome();
            onClose();
          }} 
          className="absolute top-4 right-4 text-[#8A9992] hover:text-white p-1.5 rounded-xl bg-[#4D2308] border border-[#8A9992]/20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#55443A] to-[#8A9992] flex items-center justify-center text-white shadow-lg shadow-[#55443A]/30">
            <Bot className="w-9 h-9 animate-pulse text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mt-3">Multilingual Emergency AI Assistant</h3>
          <p className="text-xs text-[#8A9992] mt-1">15 Regional Languages • Real-time Multilingual Audio Voice Response</p>
        </div>

        {/* 15 Regional Languages Selector */}
        <div className="flex items-center justify-center space-x-2 text-xs">
          <Globe className="w-4 h-4 text-[#8A9992]" />
          <select
            value={selectedLang}
            onChange={(e) => {
              const newLang = e.target.value;
              setSelectedLang(newLang);
              voiceAssistant.setLanguage(newLang);
            }}
            className="px-3 py-1.5 bg-[#CFD0CD] border border-[#8A9992] rounded-xl text-[#4D2308] font-bold focus:outline-none focus:ring-2 focus:ring-[#8A9992]"
          >
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi (हिन्दी)</option>
            <option value="te-IN">Telugu (తెలుగు)</option>
            <option value="ta-IN">Tamil (தமிழ்)</option>
            <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
            <option value="ml-IN">Malayalam (മലയാളം)</option>
            <option value="mr-IN">Marathi (मराठी)</option>
            <option value="gu-IN">Gujarati (ગુજરાતી)</option>
            <option value="pa-IN">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="bn-IN">Bengali (বাংলা)</option>
            <option value="ur-PK">Urdu (اردو)</option>
            <option value="es-ES">Spanish (Español)</option>
            <option value="fr-FR">French (Français)</option>
            <option value="ar-SA">Arabic (العربية)</option>
            <option value="zh-CN">Chinese (中文)</option>
          </select>
        </div>

        {/* Giant Mic Button */}
        <div className="relative flex justify-center items-center py-2">
          {isListening && (
            <span className="absolute w-28 h-28 rounded-full bg-[#8A9992]/30 animate-ping"></span>
          )}
          <button
            onClick={handleStartVoice}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-2xl ${
              isListening
                ? 'bg-[#8A9992] text-[#4D2308] shadow-[#8A9992]/40'
                : 'bg-gradient-to-br from-[#4D2308] to-[#55443A] text-[#8A9992] shadow-lg border border-[#8A9992]/20 hover:text-white'
            }`}
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <MicOff className="w-10 h-10" />}
          </button>
        </div>

        {/* Speech Transcript */}
        <div className="p-3 bg-[#4D2308] rounded-xl border border-[#8A9992]/20 text-xs font-mono">
          <p className="text-[#CFD0CD] truncate">{userSpeech || 'Tap mic to speak in your language or enable continuous wake word...'}</p>
        </div>

        {/* Wake Word & CPR Quick Toggles */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={toggleWakeWordMode}
            className={`p-3 rounded-xl border font-medium flex items-center justify-center space-x-2 transition-all ${
              wakeWordMode
                ? 'bg-[#F59E0B]/20 border-[#F59E0B]/40 text-[#F59E0B]'
                : 'bg-[#4D2308] border-[#8A9992]/20 text-[#CFD0CD] hover:text-white hover:border-[#8A9992]/40'
            }`}
          >
            <Radio className="w-4 h-4 text-[#8A9992] animate-pulse" />
            <span>{wakeWordMode ? 'Wake-Word ON' : 'Continuous Wake-Word'}</span>
          </button>

          <button
            onClick={toggleCPRMetronome}
            className={`p-3 rounded-xl border font-medium flex items-center justify-center space-x-2 transition-all ${
              cprActive
                ? 'bg-[#DC2626]/20 border-[#DC2626]/40 text-[#DC2626] animate-pulse'
                : 'bg-[#4D2308] border-[#8A9992]/20 text-[#CFD0CD] hover:text-white hover:border-[#8A9992]/40'
            }`}
          >
            <Activity className="w-4 h-4 text-[#8A9992]" />
            <span>{cprActive ? `CPR: ${cprCount}` : 'CPR Metronome'}</span>
          </button>
        </div>

        {/* AI Answer Result Card (Multilingual) */}
        {aiAnswer && (
          <div className="p-4 rounded-2xl bg-[#4D2308] border border-[#8A9992]/20 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8A9992] uppercase">{aiAnswer.localizedIntro || aiAnswer.topic}</span>
              <span className="px-2 py-0.5 bg-[#DC2626] text-white font-medium text-[10px] rounded-full">
                {aiAnswer.triageCategory}
              </span>
            </div>
            <p className="text-sm font-bold text-white">{aiAnswer.localizedTopic || aiAnswer.topic}</p>
            <p className="text-xs text-[#22C55E] font-bold">{aiAnswer.localizedAction || aiAnswer.steps[0]}</p>
            {aiAnswer.localizedReassurance && (
              <p className="text-[11px] text-[#8A9992] font-mono italic">{aiAnswer.localizedReassurance}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
