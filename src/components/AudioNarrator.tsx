import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, Music } from 'lucide-react';

interface AudioNarratorProps {
  currentText: string;
  sanskritVerse?: string;
  chapterTitle: string;
  odiaVerse?: string;
  odiaSummary?: string;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  currentText,
  sanskritVerse,
  chapterTitle,
  odiaVerse,
  odiaSummary
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const [isAmbientDroneOn, setIsAmbientDroneOn] = useState(false);
  const [languageMode, setLanguageMode] = useState<'bilingual' | 'sanskrit_english' | 'odia'>('bilingual');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Web Audio Context for authentic meditative Tanpura / bronze drone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; osc3: OscillatorNode; gain: GainNode } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
        // Prefer an Indian English or Hindi or smooth melodic voice if available
        const preferred = available.find(v => 
          v.lang.includes('en-IN') || 
          v.lang.includes('hi-IN') || 
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('natural')
        ) || available.find(v => v.lang.startsWith('en')) || available[0];
        if (preferred) setSelectedVoice(preferred);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Stop speech when chapter changes
  useEffect(() => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, [currentText]);

  // Ambient meditative drone synthesis (Pure Web Audio harmonics: Sa-Pa-Sa fundamental 136.1 Hz Ohm tone)
  const toggleAmbientDrone = () => {
    if (!isAmbientDroneOn) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Base Tanpura frequency C#3 (~136.1 Hz - cosmic Ohm)
        const baseFreq = 136.1;

        const osc1 = ctx.createOscillator(); // Root Sa
        const osc2 = ctx.createOscillator(); // Fifth Pa (baseFreq * 1.5)
        const osc3 = ctx.createOscillator(); // High Sa (baseFreq * 2)

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(baseFreq * 1.498, ctx.currentTime);

        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(baseFreq * 2.002, ctx.currentTime);

        // Gentle low pass filter for warm temple acoustics
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        osc3.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc3.start();

        droneNodesRef.current = { osc1, osc2, osc3, gain: masterGain };
        setIsAmbientDroneOn(true);
      } catch (err) {
        console.error("Web Audio initialization failed", err);
      }
    } else {
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.osc1.stop();
          droneNodesRef.current.osc2.stop();
          droneNodesRef.current.osc3.stop();
          droneNodesRef.current.osc1.disconnect();
          droneNodesRef.current.osc2.disconnect();
          droneNodesRef.current.osc3.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      setIsAmbientDroneOn(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!hasSpeechSupport) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      let textToRead = '';
      if (languageMode === 'odia') {
        textToRead = `${chapterTitle}. ${odiaVerse ? `ଶ୍ଳୋକ ଅନୁବାଦ: ${odiaVerse}. ` : ''}${odiaSummary ? `ସାରାଂଶ: ${odiaSummary}. ` : ''}${currentText}`;
      } else if (languageMode === 'bilingual') {
        textToRead = `${chapterTitle}. ${sanskritVerse ? `Sanskrit verse: ${sanskritVerse}. ` : ''}${odiaVerse ? `Odia: ${odiaVerse}. ` : ''}${currentText}`;
      } else {
        textToRead = `${chapterTitle}. ${sanskritVerse ? `Sanskrit verse: ${sanskritVerse}. ` : ''}${currentText}`;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = speechRate;
      utterance.pitch = 0.98;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setTimeout(() => {
      handleTogglePlay();
    }, 100);
  };

  return (
    <div className="bg-[#23170e]/90 border border-[#8e5828]/60 rounded-xl p-3.5 shadow-lg text-[#ecdac0] flex flex-wrap items-center justify-between gap-3">
      {/* Left title & status */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
          isPlaying 
            ? 'bg-[#c88a2c]/20 border-[#c88a2c] text-[#ffd17d] animate-pulse shadow-[0_0_12px_rgba(200,138,44,0.4)]' 
            : 'bg-[#311f13] border-[#714421] text-[#b38865]'
        }`}>
          {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#d49e54] font-cinzel font-semibold">
              Voice-Guided Technical Narrator
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#382314] text-[#c7aa88] border border-[#6b4221]">
              वाक्-निर्देशन
            </span>
          </div>
          <p className="text-xs text-[#b89c80] line-clamp-1 max-w-[280px] sm:max-w-md">
            {isPlaying ? 'Narrating engineering manuscript treatise...' : 'Tap play to listen to chapter technical breakdown'}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Speed button */}
        <button
          onClick={() => setSpeechRate(r => r === 0.95 ? 1.15 : r === 1.15 ? 0.8 : 0.95)}
          className="px-2 py-1 text-xs rounded bg-[#382314] hover:bg-[#4d301b] border border-[#714421] text-[#dfc3a3] transition-colors"
          title="Adjust narration speed"
        >
          {speechRate}x Speed
        </button>

        {/* Language Mode Toggle */}
        <button
          onClick={() => setLanguageMode(m => m === 'bilingual' ? 'odia' : m === 'odia' ? 'sanskrit_english' : 'bilingual')}
          className="px-2 py-1 text-xs rounded bg-[#382314] hover:bg-[#4d301b] border border-[#714421] text-[#ffd17d] transition-colors font-medium"
          title="Switch narration language"
        >
          {languageMode === 'bilingual' ? 'Bilingual (ଓଡ଼ିଆ/Eng)' : languageMode === 'odia' ? 'ଓଡ଼ିଆ କେବଳ' : 'Sanskrit/English'}
        </button>

        {/* Ambient Drone (Tanpura) */}
        <button
          onClick={toggleAmbientDrone}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
            isAmbientDroneOn
              ? 'bg-[#704218] border-[#df9b3b] text-[#ffe6b3] shadow-[0_0_8px_rgba(223,155,59,0.3)]'
              : 'bg-[#382314] hover:bg-[#4d301b] border-[#714421] text-[#b89c80]'
          }`}
          title="Toggle authentic meditative Tanpura harmonic drone"
        >
          <Music className="w-3.5 h-3.5" />
          <span>{isAmbientDroneOn ? 'Tanpura: On' : 'Tanpura: Off'}</span>
        </button>

        {/* Restart */}
        {isPlaying && (
          <button
            onClick={handleRestart}
            className="p-1.5 rounded bg-[#382314] hover:bg-[#4d301b] border border-[#714421] text-[#dfc3a3] transition-colors"
            title="Restart Narration"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Play/Pause */}
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-[#a3381a] hover:bg-[#bd4321] text-white shadow-[0_0_10px_rgba(163,56,26,0.4)]'
              : 'bg-gradient-to-r from-[#c88a2c] to-[#a86e1c] hover:from-[#d89735] hover:to-[#b87c24] text-[#1b1208] shadow-[0_0_12px_rgba(200,138,44,0.3)]'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Voice</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Narration</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
