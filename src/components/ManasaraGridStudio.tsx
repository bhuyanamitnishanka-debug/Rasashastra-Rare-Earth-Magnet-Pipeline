import React, { useState } from 'react';
import { MANASARA_ZONES } from '../data/chaptersData';
import { IndustrialZone } from '../types/manuscript';
import { Compass, ShieldCheck, Zap, Factory, Landmark, ArrowRight, Eye } from 'lucide-react';

export const ManasaraGridStudio: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<IndustrialZone>(MANASARA_ZONES[1]); // Default to Process Unit
  const [showFlowVectors, setShowFlowVectors] = useState<boolean>(true);
  const [showVastuOverlay, setShowVastuOverlay] = useState<boolean>(true);

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
      {/* Decorative Talapatra string holes */}
      <div className="absolute top-4 left-8 palm-leaf-hole hidden sm:block opacity-75"></div>
      <div className="absolute top-4 right-8 palm-leaf-hole hidden sm:block opacity-75"></div>

      {/* Header bar directly matching user's uploaded manuscript */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              Sacred Architectural Blueprint
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              मानसार प्रस्तार विन्यास
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            औद्योगिक संयंत्र विन्यास - मानसार ग्रिड
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Industrial Plant Layout - Manasara Grid & Arthashastra Zoning
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFlowVectors(!showFlowVectors)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors ${
              showFlowVectors ? 'bg-[#7a2e12] text-white border-[#4d1907]' : 'bg-[#eaddc4] text-[#4d280e] border-[#9e6932]'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Flow Vectors: {showFlowVectors ? 'Active' : 'Hidden'}</span>
          </button>
          <button
            onClick={() => setShowVastuOverlay(!showVastuOverlay)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors ${
              showVastuOverlay ? 'bg-[#5e3012] text-[#fbebd0] border-[#3e1f0b]' : 'bg-[#eaddc4] text-[#4d280e] border-[#9e6932]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Vastu Grids: {showVastuOverlay ? 'Visible' : 'Quiet'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Interactive SVG Blueprint matching user's manuscript right panel */}
        <div className="lg:col-span-8 bg-[#fdfaf2] rounded-xl border-2 border-[#a36c34]/60 p-2 md:p-3 relative shadow-inner min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Compass Rose in Corner */}
          <div className="absolute top-4 right-4 z-10 bg-[#f7eed9]/90 border border-[#a87037] rounded-lg p-2 text-center shadow-sm">
            <div className="text-[10px] font-bold text-[#8c3214] font-cinzel">NORTH (उत्तर)</div>
            <div className="w-6 h-6 mx-auto my-0.5 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#8c3214] animate-spin" style={{ animationDuration: '60s' }} />
            </div>
            <div className="text-[9px] text-[#542d10]">Vayu · Ishanya</div>
          </div>

          <div className="w-full h-[420px] flex items-center justify-center">
            <svg
              viewBox="0 0 760 520"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 4px 10px rgba(60,30,10,0.12))' }}
            >
              <defs>
                {/* Wall patterns */}
                <pattern id="brickPattern" width="16" height="8" patternUnits="userSpaceOnUse">
                  <rect width="16" height="8" fill="#e8d5b5" />
                  <line x1="0" y1="0" x2="16" y2="0" stroke="#bda582" strokeWidth="1" />
                  <line x1="0" y1="4" x2="16" y2="4" stroke="#bda582" strokeWidth="1" />
                  <line x1="8" y1="0" x2="8" y2="4" stroke="#bda582" strokeWidth="1" />
                  <line x1="0" y1="4" x2="0" y2="8" stroke="#bda582" strokeWidth="1" />
                  <line x1="16" y1="4" x2="16" y2="8" stroke="#bda582" strokeWidth="1" />
                </pattern>

                <linearGradient id="corridorGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f5e8d0" />
                  <stop offset="100%" stopColor="#e3cca4" />
                </linearGradient>

                <linearGradient id="fireUnitGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffeed6" />
                  <stop offset="100%" stopColor="#f8c89d" />
                </linearGradient>
              </defs>

              {/* OUTSIDE SURROUNDING BOUNDARY */}
              <rect x="20" y="20" width="720" height="480" fill="#f8f1e0" stroke="#8c5828" strokeWidth="2.5" />

              {/* 1. WESTERN RAW ORE STORAGE COMPOUNDS (अयस्क भंडारण) */}
              <g
                onClick={() => setSelectedZone(MANASARA_ZONES[0])}
                className="cursor-pointer group"
              >
                {/* Upper ore stockpile enclosure */}
                <rect
                  x="45"
                  y="70"
                  width="130"
                  height="160"
                  fill={selectedZone.id === 'ore_storage' ? '#eed6b3' : '#f4e5cc'}
                  stroke={selectedZone.id === 'ore_storage' ? '#a82e0d' : '#8a5522'}
                  strokeWidth={selectedZone.id === 'ore_storage' ? 3 : 2}
                  className="transition-all"
                />
                <line x1="110" y1="70" x2="110" y2="230" stroke="#b89369" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="110" y="145" textAnchor="middle" className="text-[13px] font-devanagari font-bold fill-[#522d10]">
                  अयस्क भंडारण
                </text>
                <text x="110" y="165" textAnchor="middle" className="text-[10px] font-cinzel fill-[#7a481c]">
                  (Ore Storage - North)
                </text>

                {/* Lower ore stockpile enclosure */}
                <rect
                  x="45"
                  y="255"
                  width="130"
                  height="170"
                  fill={selectedZone.id === 'ore_storage' ? '#eed6b3' : '#f4e5cc'}
                  stroke={selectedZone.id === 'ore_storage' ? '#a82e0d' : '#8a5522'}
                  strokeWidth={selectedZone.id === 'ore_storage' ? 3 : 2}
                  className="transition-all"
                />
                <line x1="110" y1="255" x2="110" y2="425" stroke="#b89369" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="110" y="335" textAnchor="middle" className="text-[13px] font-devanagari font-bold fill-[#522d10]">
                  अयस्क भंडारण
                </text>
                <text x="110" y="355" textAnchor="middle" className="text-[10px] font-cinzel fill-[#7a481c]">
                  (Ore Storage - South)
                </text>
              </g>

              {/* 2. CONCENTRIC MANASARA INDUSTRIAL RAMPARTS & CORRIDORS */}
              {/* Outer perimeter wall with 4 directional gates (Gopurams) */}
              <rect x="210" y="50" width="500" height="420" fill="url(#corridorGrad)" stroke="#733e14" strokeWidth="3" />
              <rect x="230" y="70" width="460" height="380" fill="#faf2df" stroke="#a36b35" strokeWidth="1.5" />

              {/* Arterial crossways connecting cardinal gates (North, South, East, West) */}
              {/* East-West Avenue */}
              <rect x="200" y="240" width="520" height="40" fill="#e8d5b5" stroke="#99632f" strokeWidth="1" />
              {/* North-South Avenue */}
              <rect x="440" y="40" width="40" height="440" fill="#e8d5b5" stroke="#99632f" strokeWidth="1" />

              {/* Cardinal Gate Portals (Gopurams) */}
              {/* North Gate */}
              <rect x="430" y="35" width="60" height="20" fill="#8c3b12" stroke="#4a1a03" strokeWidth="1.5" />
              {/* South Gate */}
              <rect x="430" y="465" width="60" height="20" fill="#8c3b12" stroke="#4a1a03" strokeWidth="1.5" />
              {/* West Gate (Ore Intake) */}
              <rect x="195" y="230" width="20" height="60" fill="#8c3b12" stroke="#4a1a03" strokeWidth="1.5" />
              {/* East Gate (Product Dispatch) */}
              <rect x="705" y="230" width="20" height="60" fill="#8c3b12" stroke="#4a1a03" strokeWidth="1.5" />

              {/* 3. PROCESS UNITS (प्रक्रिया इकाई) */}
              <g
                onClick={() => setSelectedZone(MANASARA_ZONES[1])}
                className="cursor-pointer group"
              >
                {/* Top-Left Process Unit */}
                <rect
                  x="260"
                  y="100"
                  width="150"
                  height="115"
                  fill={selectedZone.id === 'process_unit' ? '#ffd8ba' : 'url(#fireUnitGrad)'}
                  stroke={selectedZone.id === 'process_unit' ? '#b5330e' : '#8a4b18'}
                  strokeWidth={selectedZone.id === 'process_unit' ? 3 : 2}
                  className="transition-all"
                />
                <text x="335" y="150" textAnchor="middle" className="text-[13px] font-devanagari font-bold fill-[#5e2b0b]">
                  प्रक्रिया इकाई
                </text>
                <text x="335" y="170" textAnchor="middle" className="text-[10px] font-cinzel fill-[#804215]">
                  (Process Unit - A)
                </text>

                {/* Bottom-Left Process Unit */}
                <rect
                  x="260"
                  y="305"
                  width="150"
                  height="115"
                  fill={selectedZone.id === 'process_unit' ? '#ffd8ba' : 'url(#fireUnitGrad)'}
                  stroke={selectedZone.id === 'process_unit' ? '#b5330e' : '#8a4b18'}
                  strokeWidth={selectedZone.id === 'process_unit' ? 3 : 2}
                  className="transition-all"
                />
                <text x="335" y="355" textAnchor="middle" className="text-[13px] font-devanagari font-bold fill-[#5e2b0b]">
                  प्रक्रिया इकाई
                </text>
                <text x="335" y="375" textAnchor="middle" className="text-[10px] font-cinzel fill-[#804215]">
                  (Process Unit - B)
                </text>
              </g>

              {/* 4. CENTRAL BRAHMASTHANA & CORE SMELTING CELL (प्रक्रिया इकाई / Central Unit) */}
              <g
                onClick={() => setSelectedZone(MANASARA_ZONES[1])}
                className="cursor-pointer group"
              >
                {/* Concentric stepped sacred center */}
                <rect x="350" y="180" width="220" height="160" fill="#2d5282" stroke="#142c4a" strokeWidth="2.5" />
                <rect x="365" y="195" width="190" height="130" fill="#fdfaf2" stroke="#3b679e" strokeWidth="1.5" />
                <rect x="390" y="215" width="140" height="90" fill="#ffdcb8" stroke="#a84310" strokeWidth="2" />

                {/* Flame icon / Ingot hearth symbol */}
                <circle cx="460" cy="255" r="22" fill="#ff7a1c" className="animate-pulse" />
                <circle cx="460" cy="255" r="12" fill="#ffe066" />
                <text x="460" y="292" textAnchor="middle" className="text-[12px] font-devanagari font-bold fill-[#702905]">
                  प्रक्रिया इकाई (Core Musha)
                </text>
              </g>

              {/* 5. TOP-RIGHT POWER CENTER (ऊर्जा केंद्र) */}
              <g
                onClick={() => setSelectedZone(MANASARA_ZONES[2])}
                className="cursor-pointer group"
              >
                <rect
                  x="510"
                  y="95"
                  width="160"
                  height="120"
                  fill={selectedZone.id === 'power_center' ? '#e2e7b8' : '#eef2d3'}
                  stroke={selectedZone.id === 'power_center' ? '#466e13' : '#69872e'}
                  strokeWidth={selectedZone.id === 'power_center' ? 3 : 2}
                  className="transition-all"
                />
                {/* Waterwheel and kinetic conduits schematic */}
                <circle cx="560" cy="145" r="24" fill="#a4bd68" stroke="#48631b" strokeWidth="1.5" />
                <line x1="560" y1="121" x2="560" y2="169" stroke="#2a400b" strokeWidth="1.5" />
                <line x1="536" y1="145" x2="584" y2="145" stroke="#2a400b" strokeWidth="1.5" />
                <text x="615" y="145" textAnchor="middle" className="text-[13px] font-devanagari font-bold fill-[#324f0c]">
                  ऊर्जा केंद्र
                </text>
                <text x="615" y="165" textAnchor="middle" className="text-[10px] font-cinzel fill-[#496918]">
                  (Power Center)
                </text>
              </g>

              {/* 6. BOTTOM-RIGHT ADMINISTRATIVE MINT & MANASARA GRID (मानसार नगर विन्यास) */}
              <g
                onClick={() => setSelectedZone(MANASARA_ZONES[3])}
                className="cursor-pointer group"
              >
                <rect
                  x="510"
                  y="305"
                  width="160"
                  height="120"
                  fill={selectedZone.id === 'admin_grid' ? '#edd3bd' : '#f5e2d3'}
                  stroke={selectedZone.id === 'admin_grid' ? '#a33c10' : '#8e4b25'}
                  strokeWidth={selectedZone.id === 'admin_grid' ? 3 : 2}
                  className="transition-all"
                />
                <rect x="535" y="325" width="40" height="40" fill="#cfa47c" stroke="#693717" strokeWidth="1.5" />
                <text x="615" y="355" textAnchor="middle" className="text-[12px] font-devanagari font-bold fill-[#5c2409]">
                  मानसार नगर विन्यास
                </text>
                <text x="615" y="375" textAnchor="middle" className="text-[10px] font-cinzel fill-[#7a3916]">
                  (Manasara Grid Layout)
                </text>
              </g>

              {/* 7. DYNAMIC ARTERIAL FLOW ARROWS (प्रक्रिया प्रवाह एवं सामग्री संचरण) */}
              {showFlowVectors && (
                <g className="pointer-events-none">
                  {/* Ore intake from West Storage into central avenues */}
                  <path d="M 180,150 L 220,150 L 220,245 L 260,245" fill="none" stroke="#a83812" strokeWidth="2.5" strokeDasharray="6 4" />
                  <polygon points="262,245 252,240 252,250" fill="#a83812" />

                  <path d="M 180,340 L 220,340 L 220,275 L 260,275" fill="none" stroke="#a83812" strokeWidth="2.5" strokeDasharray="6 4" />
                  <polygon points="262,275 252,270 252,280" fill="#a83812" />

                  {/* Flow from process units to Central Smelter */}
                  <path d="M 335,218 L 335,240 L 385,240" fill="none" stroke="#d96614" strokeWidth="2" strokeDasharray="5 3" />
                  <polygon points="388,240 378,235 378,245" fill="#d96614" />

                  {/* Flow from Central Smelter to East Quality Dispatch */}
                  <path d="M 532,260 L 700,260" fill="none" stroke="#1d6622" strokeWidth="2.5" strokeDasharray="6 4" />
                  <polygon points="702,260 692,255 692,265" fill="#1d6622" />

                  {/* Water conduit from Power Center down to Smelter */}
                  <path d="M 560,217 L 560,240 L 532,240" fill="none" stroke="#296eb4" strokeWidth="2" strokeDasharray="4 4" />
                  <polygon points="530,240 540,235 540,245" fill="#296eb4" />

                  {/* Flow label */}
                  <text x="615" y="252" className="text-[11px] font-devanagari font-bold fill-[#1d6622]">
                    निर्यात प्रेषण (Export Dispatch)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Quick zone switcher pills */}
          <div className="bg-[#f0e3cc] border border-[#a87037]/50 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-cinzel font-bold text-[#5c3010]">Manasara Zones:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {MANASARA_ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    selectedZone.id === z.id
                      ? 'bg-[#7a2e12] text-white font-bold shadow-sm'
                      : 'bg-[#e2d2b8] text-[#542d10] hover:bg-[#d6c19f] border border-[#9e6932]'
                  }`}
                >
                  {z.hindiName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Industrial Zone Dossier / Arthashastra Protocol */}
        <div className="lg:col-span-4 bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-4 shadow-md flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#a86e30]/40 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#a34b15]" />
                <span className="text-xs uppercase tracking-wider font-cinzel font-bold text-[#7a390e]">
                  Industrial Zone Protocol
                </span>
              </div>
              <span className="text-[11px] font-mono bg-[#ebd4b0] px-2 py-0.5 rounded text-[#592c0c] border border-[#b8803d]">
                Zone: {selectedZone.category.toUpperCase()}
              </span>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-bold text-[#451f08] font-devanagari">
                {selectedZone.hindiName}
              </h3>
              <p className="text-sm font-semibold text-[#8c3214] font-cinzel">
                {selectedZone.name}
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-[#402410]">
              <div className="bg-[#ebd9b5] p-2 rounded-md border border-[#c48f4e]/60">
                <span className="text-[10px] uppercase font-bold text-[#7a3a10] block font-cinzel">
                  Manasara Shilpa Orientation
                </span>
                <p className="font-semibold text-[#542809] mt-0.5">{selectedZone.manasaraTerm}</p>
              </div>

              <div className="bg-[#f0dfbe] p-2 rounded-md border border-[#c99a5e]/50">
                <span className="text-[10px] uppercase font-bold text-[#7a3a10] block font-cinzel">
                  Arthashastra Presiding Officer
                </span>
                <p className="font-bold text-[#8c2e10] mt-0.5">{selectedZone.arthashastraOfficer}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Operational Mandate</span>
                <p className="mt-1 leading-relaxed text-[#4d280e]">
                  {selectedZone.description}
                </p>
              </div>

              <div className="bg-[#f0dfbe] p-2 rounded-md border border-[#c99a5e]/50">
                <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Industrial Equipment</span>
                <ul className="mt-1 space-y-1 list-disc list-inside text-[#331c0a]">
                  {selectedZone.equipment.map((eq, i) => (
                    <li key={i}>{eq}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#f0dfbe] p-2 rounded-md border border-[#c99a5e]/50">
                  <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Throughput Capacity</span>
                  <p className="font-semibold text-[#2b1708] mt-0.5">{selectedZone.throughput}</p>
                </div>
                <div className="bg-[#e5d0aa] p-2 rounded-md border border-[#b87d3b]/70">
                  <span className="text-[10px] uppercase font-bold text-[#2d4a22] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" />
                    Safety Standard
                  </span>
                  <p className="font-medium text-[#183311] mt-0.5 text-[11px] leading-tight">
                    {selectedZone.safetyRating}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#a86e30]/40 text-center">
            <span className="text-[11px] text-[#733e14] italic font-serif">
              "Kautilya Arthashastra 2.12: The wealth of a sovereign state resides in the uninterrupted efficiency of its smelting hearths."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
