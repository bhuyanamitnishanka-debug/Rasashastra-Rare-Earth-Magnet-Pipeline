import React from 'react';
import { BookOpen, Layers, Compass, Sliders, Sparkles, Shield, Flame, Terminal, FileText } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'chapters' | 'furnace' | 'manasara' | 'workbench' | 'cad' | 'summary' | 'master' | 'ai';
  onSelectTab: (tab: 'chapters' | 'furnace' | 'manasara' | 'workbench' | 'cad' | 'summary' | 'master' | 'ai') => void;
  currentChapterId: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onSelectTab,
  currentChapterId
}) => {
  return (
    <header className="border-b border-[#5e3818] bg-[#1d120a] text-[#ecdac0] sticky top-0 z-50 shadow-2xl backdrop-blur-md bg-opacity-95">
      {/* Top authentic Sanskrit/English Title Banner matching user's uploaded manuscript */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-[#42250d]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c88a2c] to-[#7a2e12] flex items-center justify-center border-2 border-[#e6b366] shadow-[0_0_15px_rgba(200,138,44,0.3)]">
            <Flame className="w-6 h-6 text-[#1a0e05]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-[#d49e54] font-cinzel font-bold">
                Nepal-Bharat Sovereign Science
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#382112] text-[#f0caa0] border border-[#754420]">
                ताड़पत्र पाण्डुलिपि
              </span>
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold font-devanagari text-[#f5ebd7] leading-tight">
              नेपाल/भारत दुर्लभ मृत्तिका उद्योग: प्रक्रिया प्रवाह एवं संयंत्र विन्यास
            </h1>
            <p className="text-[11px] sm:text-xs text-[#b89574] font-cinzel italic">
              Chitrasutra Palm-Leaf Manuscript Engineering Graphic Novel & 3D Simulation
            </p>
          </div>
        </div>

        {/* Status / Sovereign Crest */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden lg:flex items-center gap-1.5 bg-[#2c1a0e] px-3 py-1.5 rounded-lg border border-[#693916] text-[#c9a785]">
            <Shield className="w-3.5 h-3.5 text-[#c88a2c]" />
            <span>Patent-Grade Rasashastra Digital Twin</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto py-1.5 scrollbar-none">
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('chapters')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'chapters'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#e0a845]" />
            <span>10-Chapter Graphic Novel</span>
            <span className="text-[10px] opacity-75 hidden sm:inline">(Ch. {currentChapterId})</span>
          </button>

          <button
            onClick={() => onSelectTab('furnace')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'furnace'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#e0a845]" />
            <span>3D Kudua Furnace (विस्फोटित दृश्य)</span>
          </button>

          <button
            onClick={() => onSelectTab('manasara')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'manasara'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#e0a845]" />
            <span>Manasara Grid (संयंत्र विन्यास)</span>
          </button>

          <button
            onClick={() => onSelectTab('workbench')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'workbench'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#e0a845]" />
            <span>Magnetic Crystallization (प्रयोगशाला)</span>
          </button>

          <button
            onClick={() => onSelectTab('cad')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'cad'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <Terminal className="w-4 h-4 text-[#e0a845]" />
            <span>CAD & G-Code (ଜି-କୋଡ୍)</span>
          </button>

          <button
            onClick={() => onSelectTab('summary')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'summary'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#e0a845]" />
            <span>GitHub README (ପ୍ରୋଜେକ୍ଟ ସାରାଂଶ)</span>
          </button>

          <button
            onClick={() => onSelectTab('master')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'master'
                ? 'bg-[#7a001e] text-[#fff4e6] border border-[#a8002a] shadow-[0_0_12px_rgba(122,0,30,0.5)]'
                : 'text-[#ffd285] hover:bg-[#2b180d] hover:text-[#fff]'
            }`}
          >
            <Flame className="w-4 h-4 text-[#ff3366] animate-pulse" />
            <span>Master Matrix (ମାଷ୍ଟର ମାଟ୍ରିକ୍ସ)</span>
          </button>

          <button
            onClick={() => onSelectTab('ai')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'ai'
                ? 'bg-[#7a2e12] text-[#fff4e6] border border-[#a8441d] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'text-[#d6be9f] hover:bg-[#2b180d] hover:text-[#f8ecdb]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#e0a845]" />
            <span>Rasashastra AI Consult</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
