import React, { useState, useEffect, useRef } from 'react';
import { EXPLODED_FURNACE_PARTS } from '../data/chaptersData';
import { ExplodedPart } from '../types/manuscript';
import { Layers, Rotate3d, Play, Pause, Eye, Info, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

interface ExplodedFurnaceViewerProps {
  onSelectPart?: (part: ExplodedPart) => void;
  selectedPartId?: string | null;
}

export const ExplodedFurnaceViewer: React.FC<ExplodedFurnaceViewerProps> = ({
  onSelectPart,
  selectedPartId: externalSelectedPartId
}) => {
  const [explosionProgress, setExplosionProgress] = useState<number>(65); // 0 to 100%
  const [rotationAngle, setRotationAngle] = useState<number>(25); // degrees
  const [tiltAngle, setTiltAngle] = useState<number>(18); // degrees
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isGearAnimated, setIsGearAnimated] = useState<boolean>(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [selectedPart, setSelectedPart] = useState<ExplodedPart>(EXPLODED_FURNACE_PARTS[2]); // Default to Magnet Mineral
  const [gearRotation, setGearRotation] = useState<number>(0);

  // Sync with external selection if provided
  useEffect(() => {
    if (externalSelectedPartId) {
      const part = EXPLODED_FURNACE_PARTS.find(p => p.id === externalSelectedPartId);
      if (part) setSelectedPart(part);
    }
  }, [externalSelectedPartId]);

  // Gear animation loop
  useEffect(() => {
    let animFrame: number;
    if (isGearAnimated) {
      const step = () => {
        setGearRotation(prev => (prev + 1.2) % 360);
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isGearAnimated]);

  // Auto-rotation loop
  useEffect(() => {
    let animFrame: number;
    if (isAutoRotating) {
      const step = () => {
        setRotationAngle(prev => (prev + 0.35) % 360);
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isAutoRotating]);

  const handlePartClick = (part: ExplodedPart) => {
    setSelectedPart(part);
    if (onSelectPart) onSelectPart(part);
  };

  // Convert isometric coordinates with rotation & tilt
  const getTransformedPos = (
    baseX: number,
    baseY: number,
    baseZ: number,
    offset: { x: number; y: number; z: number }
  ) => {
    const factor = explosionProgress / 100;
    const finalX = baseX + offset.x * factor;
    const finalY = baseY + offset.y * factor;
    const finalZ = baseZ + offset.z * factor;

    const radRot = (rotationAngle * Math.PI) / 180;
    const radTilt = (tiltAngle * Math.PI) / 180;

    // Y-axis rotation
    const rx = finalX * Math.cos(radRot) - finalZ * Math.sin(radRot);
    const rz = finalX * Math.sin(radRot) + finalZ * Math.cos(radRot);

    // X-axis tilt projection
    const screenX = 360 + rx;
    const screenY = 280 + finalY * Math.cos(radTilt) - rz * Math.sin(radTilt);

    return { x: screenX, y: screenY, z: rz };
  };

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
      {/* Decorative Talapatra Palm-Leaf String Grommets */}
      <div className="absolute top-4 left-8 palm-leaf-hole hidden sm:block opacity-75"></div>
      <div className="absolute top-4 right-8 palm-leaf-hole hidden sm:block opacity-75"></div>

      {/* Header bar matching the user's uploaded manuscript */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              Interactive 3D Engineering Blueprint
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              रसलोह यन्त्र ३D
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            दुर्लभ मृत्तिका चुंबक यंत्र संसाधन - विस्फोटित दृश्य
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Rare-Earth Magnet Yantra Processing - Exploded View Simulation
          </p>
        </div>

        {/* Action presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => { setExplosionProgress(0); setRotationAngle(25); }}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              explosionProgress === 0 ? 'bg-[#5e3012] text-[#fbebd0] border-[#3e1f0b]' : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            Assembled (0%)
          </button>
          <button
            onClick={() => { setExplosionProgress(65); setRotationAngle(25); }}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              explosionProgress === 65 ? 'bg-[#5e3012] text-[#fbebd0] border-[#3e1f0b]' : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            Exploded (65%)
          </button>
          <button
            onClick={() => { setExplosionProgress(100); setRotationAngle(45); }}
            className={`px-2.5 py-1 text-xs rounded border transition-colors ${
              explosionProgress === 100 ? 'bg-[#5e3012] text-[#fbebd0] border-[#3e1f0b]' : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            Expanded (100%)
          </button>
          <button
            onClick={() => setIsCutaway(!isCutaway)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded border transition-colors ${
              isCutaway ? 'bg-[#8c2b14] text-white border-[#591606]' : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isCutaway ? 'Cutaway: ON' : 'Cutaway: OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main interactive visual area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG / Canvas 3D interactive viewport */}
        <div className="lg:col-span-8 bg-[#fdfaf2] rounded-xl border-2 border-[#a36c34]/60 p-2 md:p-3 relative shadow-inner min-h-[460px] flex flex-col justify-between overflow-hidden">
          {/* Subtle millimeter isometric grid backdrop */}
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(30deg, #592e0e 12%, transparent 12.5%, transparent 87%, #592e0e 87.5%, #592e0e), linear-gradient(150deg, #592e0e 12%, transparent 12.5%, transparent 87%, #592e0e 87.5%, #592e0e), linear-gradient(30deg, #592e0e 12%, transparent 12.5%, transparent 87%, #592e0e 87.5%, #592e0e), linear-gradient(150deg, #592e0e 12%, transparent 12.5%, transparent 87%, #592e0e 87.5%, #592e0e), linear-gradient(60deg, #592e0e77 25%, transparent 25.5%, transparent 75%, #592e0e77 75%, #592e0e77), linear-gradient(60deg, #592e0e77 25%, transparent 25.5%, transparent 75%, #592e0e77 75%, #592e0e77)',
              backgroundSize: '40px 70px'
            }}
          />

          {/* Quick HUD overlay in the top-left */}
          <div className="absolute top-4 left-4 z-10 bg-[#f7eed9]/90 backdrop-blur-sm border border-[#a87037] rounded-lg px-2.5 py-1 text-[11px] text-[#4d270e] shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>Explosion Vector: <strong className="font-mono">{explosionProgress}%</strong></span>
            <span className="text-[#a87037]">|</span>
            <span>Angle: <strong className="font-mono">{Math.round(rotationAngle)}°</strong></span>
          </div>

          {/* SVG 3D Isometric Kudua Blast Furnace */}
          <div className="w-full h-[400px] flex items-center justify-center relative cursor-grab active:cursor-grabbing">
            <svg
              viewBox="0 0 720 540"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 6px 12px rgba(50,25,5,0.15))' }}
            >
              <defs>
                {/* Terracotta refractory gradient */}
                <linearGradient id="terracottaGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d98236" />
                  <stop offset="50%" stopColor="#b45722" />
                  <stop offset="100%" stopColor="#7a3410" />
                </linearGradient>

                {/* Molten rare-earth core glowing gradient */}
                <linearGradient id="moltenCoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffea78" />
                  <stop offset="40%" stopColor="#ff8928" />
                  <stop offset="80%" stopColor="#d93b0b" />
                  <stop offset="100%" stopColor="#691202" />
                </linearGradient>

                {/* Ingot alloy gradient */}
                <linearGradient id="ingotAlloyGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#666a73" />
                  <stop offset="50%" stopColor="#3d4049" />
                  <stop offset="100%" stopColor="#1a1c22" />
                </linearGradient>

                {/* Bronze gear metal */}
                <linearGradient id="bronzeGearGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e8b958" />
                  <stop offset="50%" stopColor="#b37c22" />
                  <stop offset="100%" stopColor="#6b4610" />
                </linearGradient>

                {/* Stone base plinth */}
                <linearGradient id="graniteGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d5c8b5" />
                  <stop offset="50%" stopColor="#a3937d" />
                  <stop offset="100%" stopColor="#645745" />
                </linearGradient>
              </defs>

              {/* 1. SEISMIC PLINTH BASE (आधार शिला) */}
              {(() => {
                const pos = getTransformedPos(0, 80, 0, EXPLODED_FURNACE_PARTS[7].explodedOffset);
                const isSel = selectedPart.id === 'plinth_base';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[7])}
                    className="cursor-pointer group"
                  >
                    {/* Stepped stone tiers */}
                    <polygon
                      points="220,380 500,380 550,420 170,420"
                      fill="url(#graniteGrad)"
                      stroke={isSel ? '#c83a15' : '#4d3a2b'}
                      strokeWidth={isSel ? 3 : 1.5}
                      className="transition-all duration-300 group-hover:brightness-105"
                    />
                    <polygon
                      points="170,420 550,420 550,445 170,445"
                      fill="#554838"
                      stroke={isSel ? '#c83a15' : '#33271b'}
                      strokeWidth={isSel ? 3 : 1.5}
                    />
                    <polygon
                      points="240,360 480,360 515,380 205,380"
                      fill="#b8aa95"
                      stroke={isSel ? '#c83a15' : '#4d3a2b'}
                      strokeWidth={isSel ? 3 : 1.5}
                    />
                    {/* Label */}
                    <text x="180" y="465" className="text-[12px] font-devanagari font-bold fill-[#523013]">
                      आधार शिला (Stepped Plinth)
                    </text>
                  </g>
                );
              })()}

              {/* 2. LOWER BLAST HEARTH (भट्टी कक्ष कुडुवा) */}
              {(() => {
                const pos = getTransformedPos(0, 30, 0, EXPLODED_FURNACE_PARTS[4].explodedOffset);
                const isSel = selectedPart.id === 'hearth_body';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[4])}
                    className="cursor-pointer group"
                  >
                    {/* Main square stepped furnace masonry */}
                    <polygon
                      points="245,260 475,260 520,310 200,310"
                      fill="url(#terracottaGrad)"
                      stroke={isSel ? '#c83a15' : '#4a230d'}
                      strokeWidth={isSel ? 3 : 2}
                    />
                    {/* Front elevation wall */}
                    <polygon
                      points="200,310 520,310 520,360 200,360"
                      fill="#823c14"
                      stroke={isSel ? '#c83a15' : '#4a230d'}
                      strokeWidth={isSel ? 3 : 2}
                    />
                    {/* Tuyère air blast nozzles */}
                    <circle cx="230" cy="335" r="14" fill="#2d1507" stroke="#e08e45" strokeWidth="2" />
                    <circle cx="230" cy="335" r="7" fill="#ff7a1c" className="animate-pulse" />

                    {/* Glowing combustion port */}
                    <rect x="310" y="320" width="70" height="32" rx="4" fill="url(#moltenCoreGrad)" stroke="#ffea78" strokeWidth="1.5" />
                    
                    {/* Tuyère lead lines */}
                    <line x1="160" y1="335" x2="216" y2="335" stroke="#8e5828" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="70" y="340" className="text-[11px] font-devanagari font-bold fill-[#8e3810]">
                      भट्टी कक्ष (Blast Hearth)
                    </text>
                  </g>
                );
              })()}

              {/* 3. CONTINUOUS MOLTEN TAP CONDUIT (प्रक्रिया प्रवाह) */}
              {(() => {
                const pos = getTransformedPos(40, 50, 0, EXPLODED_FURNACE_PARTS[6].explodedOffset);
                const isSel = selectedPart.id === 'process_flow';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[6])}
                    className="cursor-pointer group"
                  >
                    {/* Inclined ceramic runner */}
                    <polygon
                      points="370,350 490,385 470,410 350,370"
                      fill="#5e290d"
                      stroke={isSel ? '#c83a15' : '#331505'}
                      strokeWidth={isSel ? 3 : 1.5}
                    />
                    {/* Glowing molten stream inside runner */}
                    <polygon
                      points="375,355 480,388 472,398 360,366"
                      fill="url(#moltenCoreGrad)"
                    />
                    {/* Molten sparks */}
                    <circle cx="485" cy="392" r="3" fill="#ffe066" className="animate-ping" />
                    <circle cx="460" cy="380" r="2" fill="#ff8c1a" />
                    <circle cx="410" cy="365" r="2.5" fill="#ffffff" />
                    
                    <line x1="480" y1="410" x2="550" y2="440" stroke="#8e5828" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="555" y="445" className="text-[12px] font-devanagari font-bold fill-[#b53a15]">
                      प्रक्रिया प्रवाह (Process Flow)
                    </text>
                  </g>
                );
              })()}

              {/* 4. TRIPLE GEAR NETWORK (गियर नेटवर्क) */}
              {(() => {
                const pos = getTransformedPos(80, 20, 0, EXPLODED_FURNACE_PARTS[5].explodedOffset);
                const isSel = selectedPart.id === 'gear_network';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[5])}
                    className="cursor-pointer group"
                  >
                    {/* Primary large gearwheel */}
                    <g transform={`translate(525, 290) rotate(${gearRotation})`}>
                      <circle cx="0" cy="0" r="38" fill="url(#bronzeGearGrad)" stroke={isSel ? '#c83a15' : '#4d2d09'} strokeWidth={isSel ? 3 : 2} />
                      <circle cx="0" cy="0" r="14" fill="#311903" stroke="#8a531a" strokeWidth="1.5" />
                      {/* Gear teeth */}
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                        <rect
                          key={deg}
                          x="-4"
                          y="-44"
                          width="8"
                          height="9"
                          rx="1.5"
                          fill="#824c0e"
                          stroke="#4d2d09"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                    </g>

                    {/* Secondary intermeshing pinion gear */}
                    <g transform={`translate(590, 305) rotate(${-gearRotation * 1.8})`}>
                      <circle cx="0" cy="0" r="24" fill="url(#bronzeGearGrad)" stroke={isSel ? '#c83a15' : '#4d2d09'} strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="8" fill="#311903" stroke="#8a531a" strokeWidth="1" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                        <rect
                          key={deg}
                          x="-3"
                          y="-29"
                          width="6"
                          height="7"
                          rx="1"
                          fill="#824c0e"
                          stroke="#4d2d09"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                    </g>

                    {/* Tertiary pinion gear */}
                    <g transform={`translate(635, 315) rotate(${gearRotation * 2.5})`}>
                      <circle cx="0" cy="0" r="16" fill="url(#bronzeGearGrad)" stroke={isSel ? '#c83a15' : '#4d2d09'} strokeWidth="1.2" />
                      <circle cx="0" cy="0" r="5" fill="#311903" stroke="#8a531a" strokeWidth="1" />
                      {[0, 60, 120, 180, 240, 300].map(deg => (
                        <rect
                          key={deg}
                          x="-2"
                          y="-20"
                          width="4"
                          height="5"
                          rx="0.5"
                          fill="#824c0e"
                          stroke="#4d2d09"
                          transform={`rotate(${deg})`}
                        />
                      ))}
                    </g>

                    {/* Leader pointer and label */}
                    <line x1="590" y1="270" x2="630" y2="240" stroke="#8e5828" strokeWidth="1.5" />
                    <text x="590" y="235" className="text-[12px] font-devanagari font-bold fill-[#8e5828]">
                      गियर नेटवर्क (Gear Network)
                    </text>
                  </g>
                );
              })()}

              {/* 5. UPPER REFRACTORY MUSHA CRUCIBLE (तापीय कक्ष) */}
              {(() => {
                const pos = getTransformedPos(0, -10, 0, EXPLODED_FURNACE_PARTS[3].explodedOffset);
                const isSel = selectedPart.id === 'thermal_chamber';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[3])}
                    className="cursor-pointer group"
                  >
                    {/* Stepped crucible chamber */}
                    <polygon
                      points="260,195 460,195 500,245 220,245"
                      fill="url(#terracottaGrad)"
                      stroke={isSel ? '#c83a15' : '#4a230d'}
                      strokeWidth={isSel ? 3 : 2}
                    />
                    <polygon
                      points="220,245 500,245 500,270 220,270"
                      fill="#7a3410"
                      stroke={isSel ? '#c83a15' : '#4a230d'}
                      strokeWidth={isSel ? 3 : 1.5}
                    />
                    {/* Inner crucible opening */}
                    <ellipse cx="360" cy="220" rx="70" ry="24" fill="#2d1305" stroke="#e08e45" strokeWidth="2" />
                    {/* Fire glow */}
                    <ellipse cx="360" cy="220" rx="55" ry="17" fill="url(#moltenCoreGrad)" className="animate-pulse" />

                    <line x1="220" y1="230" x2="140" y2="230" stroke="#8e5828" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="50" y="235" className="text-[12px] font-devanagari font-bold fill-[#8e3810]">
                      तापीय कक्ष (Thermal Chamber)
                    </text>
                  </g>
                );
              })()}

              {/* 6. RARE-EARTH CHARGE / SINTERED INGOT (चुंबक खनिज) */}
              {(() => {
                const pos = getTransformedPos(-40, -10, 0, EXPLODED_FURNACE_PARTS[2].explodedOffset);
                const isSel = selectedPart.id === 'magnet_mineral';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[2])}
                    className="cursor-pointer group"
                  >
                    {/* Ingot briquette with magnetic field lines */}
                    <rect
                      x="110"
                      y="160"
                      width="54"
                      height="68"
                      rx="3"
                      fill="url(#ingotAlloyGrad)"
                      stroke={isSel ? '#c83a15' : '#88909e'}
                      strokeWidth={isSel ? 3 : 2}
                      transform="skewY(-10)"
                    />
                    {/* Magnetic polarity marks N / S */}
                    <text x="126" y="190" className="text-[13px] font-bold font-mono fill-[#ff5544] select-none">
                      N
                    </text>
                    <text x="126" y="218" className="text-[13px] font-bold font-mono fill-[#4488ff] select-none">
                      S
                    </text>
                    
                    {/* Magnetic field arcs */}
                    <path
                      d="M 105,175 C 70,165 70,225 105,215"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                    <path
                      d="M 170,165 C 205,155 205,215 170,205"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />

                    <line x1="100" y1="195" x2="40" y2="195" stroke="#8e5828" strokeWidth="1.5" />
                    <text x="10" y="185" className="text-[12px] font-devanagari font-bold fill-[#8e3810]">
                      चुंबक खनिज (Magnet Mineral)
                    </text>
                  </g>
                );
              })()}

              {/* 7. ALIGNMENT YANTRA COLLAR (यंत्र) */}
              {(() => {
                const pos = getTransformedPos(0, -45, 0, EXPLODED_FURNACE_PARTS[1].explodedOffset);
                const isSel = selectedPart.id === 'alignment_yantra';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[1])}
                    className="cursor-pointer group"
                  >
                    {/* Stepped bronze guide ring */}
                    <ellipse cx="360" cy="140" rx="95" ry="32" fill="#a8742b" stroke={isSel ? '#c83a15' : '#4a2f07'} strokeWidth={isSel ? 3 : 2} />
                    <ellipse cx="360" cy="140" rx="60" ry="20" fill="#382006" stroke="#e0a34c" strokeWidth="1.5" />
                    
                    <line x1="455" y1="140" x2="570" y2="120" stroke="#8e5828" strokeWidth="1.5" />
                    <text x="575" y="125" className="text-[12px] font-devanagari font-bold fill-[#703b0c]">
                      यंत्र (Mechanism Collar)
                    </text>
                  </g>
                );
              })()}

              {/* 8. TOP CHIMNEY EXHAUST FLUE (भट्टी) */}
              {(() => {
                const pos = getTransformedPos(0, -75, 0, EXPLODED_FURNACE_PARTS[0].explodedOffset);
                const isSel = selectedPart.id === 'flue';
                return (
                  <g
                    transform={`translate(${pos.x - 360}, ${pos.y - 280})`}
                    onClick={() => handlePartClick(EXPLODED_FURNACE_PARTS[0])}
                    className="cursor-pointer group"
                  >
                    {/* Chimney cylinder */}
                    <path
                      d="M 310,65 L 410,65 L 435,115 L 285,115 Z"
                      fill="url(#terracottaGrad)"
                      stroke={isSel ? '#c83a15' : '#4a230d'}
                      strokeWidth={isSel ? 3 : 2}
                    />
                    <ellipse cx="360" cy="65" rx="50" ry="16" fill="#3d1c07" stroke="#9e5621" strokeWidth="1.5" />
                    
                    {/* Exhaust smoke plume */}
                    <path
                      d="M 360,55 Q 375,30 350,15 Q 380,-10 360,-25"
                      fill="none"
                      stroke="#8c6d54"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.4"
                    />

                    <line x1="285" y1="90" x2="180" y2="70" stroke="#8e5828" strokeWidth="1.5" />
                    <text x="100" y="75" className="text-[13px] font-devanagari font-bold fill-[#8e3810]">
                      भट्टी (Furnace Flue)
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Bottom interactive controls bar */}
          <div className="bg-[#f0e3cc] border border-[#a87037]/50 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
            {/* Explosion Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Layers className="w-4 h-4 text-[#8a4e1a]" />
              <span className="font-semibold text-[#542d10] whitespace-nowrap">Explode:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={explosionProgress}
                onChange={e => setExplosionProgress(Number(e.target.value))}
                className="w-full h-2 bg-[#d1be9d] rounded-lg appearance-none cursor-pointer accent-[#8c3214]"
              />
              <span className="font-mono text-[#542d10] min-w-[36px] font-bold">{explosionProgress}%</span>
            </div>

            {/* Rotation Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Rotate3d className="w-4 h-4 text-[#8a4e1a]" />
              <span className="font-semibold text-[#542d10] whitespace-nowrap">Angle:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={rotationAngle}
                onChange={e => setRotationAngle(Number(e.target.value))}
                className="w-full h-2 bg-[#d1be9d] rounded-lg appearance-none cursor-pointer accent-[#8c3214]"
              />
              <span className="font-mono text-[#542d10] min-w-[36px] font-bold">{Math.round(rotationAngle)}°</span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                  isAutoRotating ? 'bg-[#7a2e12] text-white border-[#4d1907]' : 'bg-[#e2d2b8] text-[#542d10] border-[#9e6932]'
                }`}
                title="Toggle continuous turntable rotation"
              >
                {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>Auto-Spin</span>
              </button>

              <button
                onClick={() => setIsGearAnimated(!isGearAnimated)}
                className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                  isGearAnimated ? 'bg-[#7a2e12] text-white border-[#4d1907]' : 'bg-[#e2d2b8] text-[#542d10] border-[#9e6932]'
                }`}
                title="Toggle mechanical gear animation"
              >
                <Sliders className="w-3 h-3" />
                <span>Gears: {isGearAnimated ? 'Live' : 'Static'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Part Technical Card / Spec Sheet */}
        <div className="lg:col-span-4 bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-4 shadow-md flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between border-b border-[#a86e30]/40 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#a34b15]" />
                <span className="text-xs uppercase tracking-wider font-cinzel font-bold text-[#7a390e]">
                  Subsystem Blueprint
                </span>
              </div>
              <span className="text-[11px] font-mono bg-[#ebd4b0] px-2 py-0.5 rounded text-[#592c0c] border border-[#b8803d]">
                ID: {selectedPart.id}
              </span>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-bold text-[#451f08] font-devanagari">
                {selectedPart.devanagari}
              </h3>
              <p className="text-sm font-semibold text-[#8c3214] font-cinzel">
                {selectedPart.name} ({selectedPart.hindiName})
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-[#402410]">
              <div className="bg-[#f0dfbe] p-2 rounded-md border border-[#c99a5e]/50">
                <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Operational Role</span>
                <p className="font-medium text-[#2d1708] mt-0.5">{selectedPart.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#f0dfbe] p-2 rounded-md border border-[#c99a5e]/50">
                  <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Refractory Material</span>
                  <p className="font-medium text-[#2d1708] mt-0.5 truncate">{selectedPart.material}</p>
                </div>
                {selectedPart.temperature && (
                  <div className="bg-[#f0dfbe] p-2 rounded-md border border-[#c99a5e]/50">
                    <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Heat Threshold</span>
                    <p className="font-bold text-[#a82a0d] mt-0.5">{selectedPart.temperature}</p>
                  </div>
                )}
              </div>

              <div className="bg-[#ebd9b5] p-2.5 rounded-md border border-[#c48f4e]/60">
                <span className="text-[10px] uppercase font-bold text-[#8c3810] block font-cinzel">
                  Rasashastra Classical Authority
                </span>
                <p className="italic text-[#59290a] font-serif mt-0.5 text-[11px]">
                  "{selectedPart.rasashastraRef}"
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#7a3a10] block">Reverse-Engineering Analysis</span>
                <p className="mt-1 leading-relaxed text-[#4d280e]">
                  {selectedPart.description}
                </p>
              </div>

              <div className="bg-[#e5d0aa] p-2.5 rounded-md border border-[#b87d3b]/70">
                <span className="text-[10px] uppercase font-bold text-[#2d4a22] flex items-center gap-1 font-cinzel">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  Modern Metallurgical Equivalence
                </span>
                <p className="font-semibold text-[#183311] mt-0.5 text-[11px]">
                  {selectedPart.modernEquivalence}
                </p>
              </div>
            </div>
          </div>

          {/* Quick part selector list */}
          <div className="mt-4 pt-3 border-t border-[#a86e30]/40">
            <span className="text-[10px] uppercase tracking-wider text-[#733e14] font-bold block mb-1.5">
              Select Component To Inspect:
            </span>
            <div className="flex flex-wrap gap-1">
              {EXPLODED_FURNACE_PARTS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handlePartClick(p)}
                  className={`px-2 py-1 text-[11px] rounded transition-all ${
                    selectedPart.id === p.id
                      ? 'bg-[#7a2e12] text-white font-bold shadow-sm'
                      : 'bg-[#ebd4b0] text-[#542d10] hover:bg-[#dec299] border border-[#a87037]/50'
                  }`}
                >
                  {p.devanagari.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
