import React, { useState } from 'react';
import { MANUSCRIPT_CHAPTERS } from '../data/chaptersData';
import { ManuscriptChapter } from '../types/manuscript';
import { AudioNarrator } from './AudioNarrator';
import { ExplodedFurnaceViewer } from './ExplodedFurnaceViewer';
import { ManasaraGridStudio } from './ManasaraGridStudio';
import { MagneticWorkbench } from './MagneticWorkbench';
import { BookOpen, Scroll, ChevronLeft, ChevronRight, Bookmark, Compass, Sparkles, Layers, ShieldCheck, Cpu } from 'lucide-react';

interface ChapterViewerProps {
  currentChapterId: number;
  onSelectChapter: (id: number) => void;
}

export const ChapterViewer: React.FC<ChapterViewerProps> = ({
  currentChapterId,
  onSelectChapter
}) => {
  const [viewMode, setViewMode] = useState<'codex' | 'scroll'>('codex');
  const currentChapter = MANUSCRIPT_CHAPTERS.find(c => c.id === currentChapterId) || MANUSCRIPT_CHAPTERS[0];

  const handleNext = () => {
    if (currentChapterId < MANUSCRIPT_CHAPTERS.length) {
      onSelectChapter(currentChapterId + 1);
    }
  };

  const handlePrev = () => {
    if (currentChapterId > 1) {
      onSelectChapter(currentChapterId - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Chapter Navigation & Mode Bar */}
      <div className="parchment-bg rounded-xl parchment-border p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Chapter Quick Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentChapterId === 1}
              className="p-1.5 rounded bg-[#ebd4b0] hover:bg-[#dfc399] disabled:opacity-40 text-[#4a2408] border border-[#a87037] transition-colors"
              title="Previous Chapter"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-[#5c2b09] px-2">
              {currentChapter.id} / 10
            </span>
            <button
              onClick={handleNext}
              disabled={currentChapterId === MANUSCRIPT_CHAPTERS.length}
              className="p-1.5 rounded bg-[#ebd4b0] hover:bg-[#dfc399] disabled:opacity-40 text-[#4a2408] border border-[#a87037] transition-colors"
              title="Next Chapter"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-[#a87037]/50 hidden sm:block"></div>

          {/* Quick jump dropdown */}
          <select
            value={currentChapterId}
            onChange={e => onSelectChapter(Number(e.target.value))}
            className="text-xs font-cinzel font-semibold bg-[#f5e7cf] border border-[#9e6932] rounded-lg px-2.5 py-1.5 text-[#3b1f09] focus:outline-none"
          >
            {MANUSCRIPT_CHAPTERS.map(ch => (
              <option key={ch.id} value={ch.id}>
                {ch.chapterNumber.split(' ')[0]} - {ch.title}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle: Codex vs Scroll */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode('codex')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-all ${
              viewMode === 'codex'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm font-semibold'
                : 'bg-[#ebd4b0] text-[#4d280e] hover:bg-[#dfc399] border-[#a87037]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Chapter Codex</span>
          </button>
          <button
            onClick={() => setViewMode('scroll')}
            className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition-all ${
              viewMode === 'scroll'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm font-semibold'
                : 'bg-[#ebd4b0] text-[#4d280e] hover:bg-[#dfc399] border-[#a87037]'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>Talapatra Scroll</span>
          </button>
        </div>
      </div>

      {/* Voice-guided Technical Narrator Banner */}
      <AudioNarrator
        chapterTitle={`${currentChapter.chapterNumber}: ${currentChapter.title}`}
        sanskritVerse={currentChapter.sanskritVerse}
        currentText={currentChapter.narrationScript}
        odiaVerse={currentChapter.odiaVerseTranslation}
        odiaSummary={currentChapter.odiaSummary}
      />

      {/* Codex Mode (Single Chapter Focused with Graphic Panels) */}
      {viewMode === 'codex' ? (
        <div className="space-y-6">
          {/* Main Palm-Leaf Manuscript Sheet for this chapter */}
          <div className="parchment-bg rounded-2xl parchment-border parchment-leaf-edge p-5 md:p-8 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
            {/* Authentic Palm-Leaf Binding Cord Holes */}
            <div className="absolute top-6 left-12 palm-leaf-hole hidden md:block"></div>
            <div className="absolute top-6 right-12 palm-leaf-hole hidden md:block"></div>

            {/* Chapter Header Ornament */}
            <div className="text-center max-w-3xl mx-auto border-b-2 border-[#8e5828]/50 pb-5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebd7b5] border border-[#a86e30] text-[#733e14] text-xs font-cinzel font-bold mb-2">
                <Bookmark className="w-3.5 h-3.5 fill-[#a85a1a]" />
                {currentChapter.chapterNumber}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-devanagari text-[#46220b] leading-tight">
                {currentChapter.devanagariTitle}
              </h2>
              {currentChapter.odiaTitle && (
                <div className="text-sm font-semibold text-[#8c3214] mt-1 font-serif">
                  {currentChapter.odiaTitle}
                </div>
              )}
              <h3 className="text-lg md:text-xl font-bold text-[#7a2e12] font-cinzel mt-1">
                {currentChapter.title}
              </h3>
              <p className="text-xs md:text-sm text-[#5c3010] mt-1.5 italic max-w-2xl mx-auto">
                {currentChapter.subtitle}
              </p>
            </div>

            {/* Sacred Sanskrit Epigraph Callout Box */}
            <div className="bg-[#f5e9d3] border-2 border-[#8e5828] rounded-xl p-4 md:p-5 max-w-3xl mx-auto mb-7 shadow-sm">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-[#8c3810] tracking-widest font-cinzel block mb-1">
                  मूल रसशास्त्र सूत्रम् (Classical Citation)
                </span>
                <p className="text-base md:text-lg font-devanagari font-bold text-[#451f08] leading-relaxed">
                  "{currentChapter.sanskritVerse}"
                </p>
                {currentChapter.odiaVerseTranslation && (
                  <div className="mt-2.5 pt-2 border-t border-[#c99a5e]/50 text-xs md:text-sm text-[#703b0c] font-serif font-medium leading-relaxed bg-[#f0dfbe]/60 p-2.5 rounded-lg text-left">
                    <span className="text-[10px] uppercase font-bold text-[#8c3214] block mb-0.5">
                      ଓଡ଼ିଆ ଅନୁବାଦ (Odia Shloka Translation):
                    </span>
                    {currentChapter.odiaVerseTranslation}
                  </div>
                )}
                <p className="text-xs md:text-sm text-[#542d10] font-serif italic mt-2 text-left sm:text-center">
                  <span className="font-semibold text-[#7a390e]">English:</span> {currentChapter.verseTranslation}
                </p>
                <span className="inline-block text-[11px] font-mono text-[#8a4e1a] mt-2 bg-[#ebd4b0] px-2.5 py-0.5 rounded border border-[#b8803d]">
                  {currentChapter.verseSource}
                </span>
              </div>
            </div>

            {/* Chapter Summary Prose */}
            <div className="max-w-4xl mx-auto mb-8 text-sm md:text-base leading-relaxed text-[#3b200b] space-y-3 font-sans">
              {currentChapter.odiaSummary && (
                <div className="bg-[#f3e6cf] border-l-4 border-[#8c3214] p-3.5 rounded-r-lg text-xs md:text-sm text-[#4a2408] font-serif mb-3 shadow-inner">
                  <span className="font-bold text-[#8c3214] block text-xs uppercase mb-1">
                    ପ୍ରକଳ୍ପ ସାରାଂଶ (Odia Chapter Executive Summary):
                  </span>
                  {currentChapter.odiaSummary}
                </div>
              )}
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:font-cinzel first-letter:text-[#7a2e12] first-letter:mr-2 first-letter:float-left">
                {currentChapter.summary}
              </p>
            </div>

            {/* Graphic Novel Engineering Panels */}
            <div className="max-w-5xl mx-auto mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-[#8c3214]" />
                <span className="text-xs uppercase tracking-wider font-cinzel font-bold text-[#7a390e]">
                  Engineering Graphic Novel Panels
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChapter.graphicPanels.map((panel, idx) => (
                  <div
                    key={idx}
                    className="bg-[#fcf7ee] border-2 border-[#8e5828]/70 rounded-xl p-4 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#a86e30]/40 pb-1.5 mb-2">
                        <span className="text-[11px] font-bold font-mono text-[#8c3214] bg-[#f0dfbe] px-2 py-0.5 rounded border border-[#c99a5e]/50">
                          {panel.badge}
                        </span>
                        <span className="text-[10px] text-[#73431b] uppercase font-cinzel">
                          {panel.diagramType}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#451f08] font-cinzel">
                        {panel.title}
                      </h4>
                      <p className="text-xs text-[#69350d] font-medium mt-1 italic">
                        {panel.caption}
                      </p>
                      <p className="text-xs text-[#3b200b] mt-2 leading-relaxed">
                        {panel.details}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#c99a5e]/40 bg-[#f4e6ce] p-2 rounded-lg">
                      <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">
                        Technical Invariant
                      </span>
                      <p className="font-mono text-xs text-[#6e1e07] mt-0.5">
                        {panel.technicalAnnotation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Dive & Technical Highlights */}
            <div className="max-w-5xl mx-auto bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-5 mb-6">
              <h4 className="text-base font-bold text-[#46220b] font-cinzel border-b border-[#a86e30]/40 pb-2 mb-3">
                {currentChapter.deepDive.sectionTitle}
              </h4>
              <div className="space-y-2 text-xs md:text-sm text-[#3d210b] leading-relaxed">
                {currentChapter.deepDive.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Technical highlight metric boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#a86e30]/40">
                {currentChapter.deepDive.technicalHighlights.map((th, i) => (
                  <div key={i} className="bg-[#f0dfbe] p-2.5 rounded-lg border border-[#c99a5e]/50">
                    <span className="text-[10px] uppercase font-bold text-[#7a390e] block">
                      {th.label}
                    </span>
                    <div className="text-sm font-bold font-mono text-[#8c2a0d] mt-0.5">
                      {th.value}
                    </div>
                    <span className="text-[10px] text-[#73431b] block mt-0.5">
                      {th.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapter-Specific Interactive Apparatus Embed */}
            <div className="max-w-5xl mx-auto mt-6 pt-4 border-t-2 border-[#8e5828]/40">
              <div className="text-center mb-4">
                <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
                  Interactive Simulation Associated with this Stage
                </span>
              </div>

              {/* For Chapter 3 or 8: Exploded Kudua Furnace */}
              {(currentChapter.id === 3 || currentChapter.id === 8) && (
                <ExplodedFurnaceViewer />
              )}

              {/* For Chapter 5 or 6: Manasara Architectural Grid */}
              {(currentChapter.id === 5 || currentChapter.id === 6) && (
                <ManasaraGridStudio />
              )}

              {/* For Chapter 7 or 9: Magnetic Crystallization Workbench */}
              {(currentChapter.id === 7 || currentChapter.id === 9) && (
                <MagneticWorkbench />
              )}

              {/* For Chapter 1, 2, 4, 10: Show quick jump to appropriate apparatus */}
              {(currentChapter.id === 1 || currentChapter.id === 2 || currentChapter.id === 4 || currentChapter.id === 10) && (
                <div className="bg-[#f4e6ce] p-4 rounded-xl border border-[#a87037] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-[#59290a] font-cinzel block text-sm">
                      Reverse-Engineered 3D Kudua Blast Furnace & Manasara Plant Grid
                    </strong>
                    <span className="text-[#73431b]">
                      Inspect the full exploded view or navigate the sacred industrial layout at any time.
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectChapter(3)}
                      className="px-3 py-1.5 rounded bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold transition-colors"
                    >
                      View 3D Furnace
                    </button>
                    <button
                      onClick={() => onSelectChapter(5)}
                      className="px-3 py-1.5 rounded bg-[#9e632b] hover:bg-[#b57434] text-white font-semibold transition-colors"
                    >
                      View Manasara Grid
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Talapatra Continuous Scroll Mode */
        <div className="space-y-8">
          <div className="text-center bg-[#23170e]/80 border border-[#8e5828]/60 p-3 rounded-xl text-[#ecdac0]">
            <span className="text-xs uppercase font-cinzel font-bold text-[#d49e54]">
              Continuous Talapatra Manuscript Scroll (ତାଳପତ୍ର ପୋଥି ଗ୍ରନ୍ଥ)
            </span>
            <p className="text-xs text-[#b89c80] mt-0.5">
              Scroll downward to read all 10 chapters in unbroken manuscript succession.
            </p>
          </div>

          {MANUSCRIPT_CHAPTERS.map(ch => (
            <div
              key={ch.id}
              id={`chapter-${ch.id}`}
              className="parchment-bg rounded-2xl parchment-border parchment-leaf-edge p-5 md:p-8 text-[#2d1b0f] relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-6 left-12 palm-leaf-hole hidden md:block"></div>
              <div className="absolute top-6 right-12 palm-leaf-hole hidden md:block"></div>

              <div className="border-b-2 border-[#8e5828]/50 pb-4 mb-4">
                <span className="text-xs font-mono font-bold text-[#8c3214] bg-[#ebd7b5] px-2.5 py-0.5 rounded border border-[#a86e30]">
                  {ch.chapterNumber}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] mt-1.5">
                  {ch.devanagariTitle}
                </h3>
                <h4 className="text-lg font-bold text-[#7a2e12] font-cinzel">
                  {ch.title}
                </h4>
              </div>

              {/* Shloka */}
              <div className="bg-[#f5e9d3] border border-[#8e5828] rounded-lg p-3 my-3">
                <p className="text-sm font-devanagari font-bold text-[#451f08]">
                  "{ch.sanskritVerse}"
                </p>
                {ch.odiaVerseTranslation && (
                  <p className="text-xs text-[#703b0c] font-serif font-medium mt-1.5 pt-1.5 border-t border-[#c99a5e]/50">
                    <strong className="text-[#8c3214]">ଓଡ଼ିଆ ଅନୁବାଦ:</strong> {ch.odiaVerseTranslation}
                  </p>
                )}
                <p className="text-xs text-[#542d10] italic mt-1">
                  — {ch.verseTranslation} ({ch.verseSource})
                </p>
              </div>

              {ch.odiaSummary && (
                <div className="bg-[#f3e6cf] border-l-3 border-[#8c3214] p-2.5 rounded text-xs text-[#4a2408] font-serif my-2">
                  <strong className="text-[#8c3214]">ସାରାଂଶ:</strong> {ch.odiaSummary}
                </div>
              )}

              <p className="text-xs md:text-sm text-[#3b200b] leading-relaxed my-3">
                {ch.summary}
              </p>

              {/* Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {ch.graphicPanels.map((p, idx) => (
                  <div key={idx} className="bg-[#fdfaf2] border border-[#8e5828]/50 p-3 rounded-lg text-xs">
                    <span className="font-bold text-[#8c3214] block">{p.title}</span>
                    <p className="text-[#452712] mt-1">{p.details}</p>
                    <div className="text-[11px] font-mono text-[#7a390e] mt-1.5 bg-[#f0dfbe] p-1 rounded">
                      {p.technicalAnnotation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
