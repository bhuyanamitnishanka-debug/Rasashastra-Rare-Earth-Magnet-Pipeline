import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { ChapterViewer } from './components/ChapterViewer';
import { ExplodedFurnaceViewer } from './components/ExplodedFurnaceViewer';
import { ManasaraGridStudio } from './components/ManasaraGridStudio';
import { MagneticWorkbench } from './components/MagneticWorkbench';
import { CadGCodeStudio } from './components/CadGCodeStudio';
import { ProjectSummaryDoc } from './components/ProjectSummaryDoc';
import { MasterMatrixPlatform } from './components/MasterMatrixPlatform';
import { RasashastraAiConsult } from './components/RasashastraAiConsult';
import { Scroll, Compass, Flame, Shield, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chapters' | 'furnace' | 'manasara' | 'workbench' | 'cad' | 'summary' | 'master' | 'ai'>('chapters');
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);

  const handleSelectChapterFromNav = (id: number) => {
    setCurrentChapterId(id);
    setActiveTab('chapters');
  };

  return (
    <div className="min-h-screen bg-[#191008] text-[#38210f] flex flex-col font-sans selection:bg-[#c88a2c]/30 selection:text-[#5c2a18]">
      {/* Top Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentChapterId={currentChapterId}
      />

      {/* Main Applet Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Active Tab Router */}
        {activeTab === 'chapters' && (
          <ChapterViewer
            currentChapterId={currentChapterId}
            onSelectChapter={setCurrentChapterId}
          />
        )}

        {activeTab === 'furnace' && (
          <div className="space-y-6">
            <ExplodedFurnaceViewer />
            <div className="bg-[#24170d] border border-[#6b3e19] rounded-xl p-4 text-[#d9c0a3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-[#e2a84d] font-cinzel block text-sm">
                  Subsystem Integration: Kudua Blast Furnace & Musha Crucible
                </strong>
                <span className="text-[#a6866a]">
                  Reverse-engineered directly from Rasaratna Samuchaya Adhyaya 9 & 10.
                </span>
              </div>
              <button
                onClick={() => { setCurrentChapterId(3); setActiveTab('chapters'); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold transition-colors"
              >
                <span>Read Chapter 3 Treatise</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'manasara' && (
          <div className="space-y-6">
            <ManasaraGridStudio />
            <div className="bg-[#24170d] border border-[#6b3e19] rounded-xl p-4 text-[#d9c0a3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-[#e2a84d] font-cinzel block text-sm">
                  Sacred 9x9 Prastara Industrial Layout & Ministerial Governance
                </strong>
                <span className="text-[#a6866a]">
                  Conforms to Manasara Shilpa Shastra Chapter 9 and Kautilya Arthashastra 2.12 mining laws.
                </span>
              </div>
              <button
                onClick={() => { setCurrentChapterId(5); setActiveTab('chapters'); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold transition-colors"
              >
                <span>Read Chapter 5 Treatise</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'workbench' && (
          <div className="space-y-6">
            <MagneticWorkbench />
            <div className="bg-[#24170d] border border-[#6b3e19] rounded-xl p-4 text-[#d9c0a3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-[#e2a84d] font-cinzel block text-sm">
                  Domain Alignment Solver & Cryptographic Material Passport
                </strong>
                <span className="text-[#a6866a]">
                  Generates verifiable laboratory specs for permanent Nd₂Fe₁₄B aerospace-grade magnets.
                </span>
              </div>
              <button
                onClick={() => { setCurrentChapterId(7); setActiveTab('chapters'); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold transition-colors"
              >
                <span>Read Chapter 7 Treatise</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'cad' && (
          <div className="space-y-6">
            <CadGCodeStudio />
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            <ProjectSummaryDoc />
          </div>
        )}

        {activeTab === 'master' && (
          <div className="space-y-6">
            <MasterMatrixPlatform />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <RasashastraAiConsult />
          </div>
        )}
      </main>

      {/* Footer with Treatise Authority & Sovereign Corridor Details */}
      <footer className="mt-auto border-t border-[#4a2b13] bg-[#140b05] text-[#ab8b6f] text-xs py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-cinzel font-bold text-[#d49e54] text-sm">
                नेपाल-भारत रसशास्त्र दुर्लभ मृत्तिका उद्योग
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2e190b] text-[#c79a6d] border border-[#593214]">
                ताड़पत्र अभियांत्रिकी
              </span>
            </div>
            <p className="text-[11px] text-[#8c6b4f] max-w-xl">
              Reverse-engineering ancient Indic and Himalayan metallurgical treatises into sovereign 21st-century clean-technology permanent magnet manufacturing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#8a684c]">
            <span>रसविमर्श: रसकौमुदी</span>
            <span>·</span>
            <span>रसार्णव</span>
            <span>·</span>
            <span>कौटिलीय अर्थशास्त्र</span>
            <span>·</span>
            <span>मानसार शिल्पशास्त्र</span>
            <span>·</span>
            <span>समराङ्गण सूत्रधार</span>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#7a573a]">
            <div>Sovereign Supply Corridor: Kathmandu · Ganges Valley · Deepwater Ports</div>
            <div className="text-[#a8743d] font-mono mt-0.5">Nd₂Fe₁₄B · BHmax &gt; 52 MGOe</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
