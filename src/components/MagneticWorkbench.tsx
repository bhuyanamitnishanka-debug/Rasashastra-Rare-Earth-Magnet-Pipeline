import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SimulationParams, MagnetOutputMetrics } from '../types/manuscript';
import { Sliders, Zap, Flame, ShieldAlert, Award, QrCode, Download, RefreshCw, Compass } from 'lucide-react';
import { FluxDensityD3Chart } from './FluxDensityD3Chart';

export const MagneticWorkbench: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    oreType: 'Bastnäsite',
    calcinationTemp: 600,
    sinteringTemp: 1085,
    magneticFieldPulse: 2.8,
    inertAtmosphere: true,
    bellowsPressure: 24
  });

  const [activeTab, setActiveTab] = useState<'simulation' | 'passport'>('simulation');
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute realistic physical magnet output metrics
  const metrics: MagnetOutputMetrics = useMemo(() => {
    const { sinteringTemp, magneticFieldPulse, inertAtmosphere, oreType } = params;

    // Optimal sintering window is 1060°C - 1100°C
    const tempDelta = Math.abs(sinteringTemp - 1080);
    const tempFactor = Math.max(0.4, 1 - (tempDelta / 400));

    // Magnetic field pulse saturation curve
    const pulseFactor = Math.min(1.0, magneticFieldPulse / 2.8);

    // Atmosphere penalty
    const atmosFactor = inertAtmosphere ? 1.0 : 0.65;

    // Ore baseline
    const oreBase = oreType === 'Bastnäsite' ? 1.0 : oreType === 'Monazite' ? 0.94 : 0.88;

    const alignment = Math.min(99.2, Math.round(98 * pulseFactor * tempFactor * atmosFactor * oreBase));

    // Remanence Br (Tesla): Nd2Fe14B theoretical max ~1.6 T, real N52 ~1.45 T
    const remanenceBr = Number((1.48 * (alignment / 100)).toFixed(2));

    // Coercivity Hcj (kOe): around 18 - 34 kOe
    const coercivityHcj = Number((28 * tempFactor * atmosFactor * (magneticFieldPulse > 2.0 ? 1.1 : 0.9)).toFixed(1));

    // Energy Product (BH)max ~ (Br)^2 / 4 in cgs units -> typically 35 to 54 MGOe
    const energyProductBHmax = Number((54 * Math.pow(remanenceBr / 1.48, 2) * (coercivityHcj / 28)).toFixed(1));

    let grade = 'N35';
    if (energyProductBHmax >= 51 && coercivityHcj >= 24) grade = 'N52 (Aerospace Grade)';
    else if (energyProductBHmax >= 47) grade = 'N48H (EV Traction)';
    else if (energyProductBHmax >= 42) grade = 'N42SH (High-Temp Wind)';
    else if (energyProductBHmax >= 37) grade = 'N38 (Industrial Motor)';
    else grade = 'Sub-optimal Ingot (N33)';

    return {
      remanenceBr,
      coercivityHcj,
      energyProductBHmax,
      curieTemperature: 312,
      grade,
      crystalliteAlignment: alignment,
      purityGrade: inertAtmosphere ? '99.85% (ISO-17025 Certified)' : '94.2% (Oxidized Slag)'
    };
  }, [params]);

  // Generate QR Code Pattern onto Canvas when tab is passport
  useEffect(() => {
    if (activeTab === 'passport' && qrCanvasRef.current) {
      const canvas = qrCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#fdfbf6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw simulated QR matrix
        const size = 180;
        const offset = 10;
        const cells = 21;
        const cellSize = size / cells;

        ctx.fillStyle = '#26150a';

        // Deterministic pseudo-random seed based on grade & metrics
        let seed = metrics.energyProductBHmax * 100 + metrics.coercivityHcj;
        const pseudoRandom = () => {
          seed = (seed * 9301 + 49297) % 233280;
          return seed / 233280;
        };

        // Standard QR corner squares
        const drawCorner = (x: number, y: number) => {
          ctx.fillRect(offset + x * cellSize, offset + y * cellSize, 7 * cellSize, 7 * cellSize);
          ctx.fillStyle = '#fdfbf6';
          ctx.fillRect(offset + (x + 1) * cellSize, offset + (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
          ctx.fillStyle = '#26150a';
          ctx.fillRect(offset + (x + 2) * cellSize, offset + (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
        };

        drawCorner(0, 0);
        drawCorner(14, 0);
        drawCorner(0, 14);

        // Inner cells
        for (let r = 0; r < cells; r++) {
          for (let c = 0; c < cells; c++) {
            if ((r < 8 && c < 8) || (r < 8 && c > 13) || (r > 13 && c < 8)) continue;
            if (pseudoRandom() > 0.45) {
              ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
            }
          }
        }
      }
    }
  }, [activeTab, metrics]);

  // Magnetic dipoles grid generation
  const dipoles = useMemo(() => {
    const list = [];
    const alignment = metrics.crystalliteAlignment / 100;
    for (let i = 0; i < 36; i++) {
      // If aligned, angle points mostly upward (90 deg); if unaligned, random angles
      const jitter = (1 - alignment) * (Math.sin(i * 13) * 180);
      const angle = 90 + jitter;
      list.push(angle);
    }
    return list;
  }, [metrics.crystalliteAlignment]);

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
      {/* Decorative Talapatra string holes */}
      <div className="absolute top-4 left-8 palm-leaf-hole hidden sm:block opacity-75"></div>
      <div className="absolute top-4 right-8 palm-leaf-hole hidden sm:block opacity-75"></div>

      {/* Header bar */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              Digital Twin & Simulation Workbench
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              चुम्बक संरेखण प्रयोगशाला
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            चुम्बकीय स्फटिकीकरण एवं डिजिटल पासपोर्ट
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Magnetic Crystallization Solver & Sovereign QR Verification
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeTab === 'simulation'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm'
                : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Live Metallurgy Solver</span>
          </button>
          <button
            onClick={() => setActiveTab('passport')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeTab === 'passport'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm'
                : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Sovereign QR Passport</span>
          </button>
        </div>
      </div>

      {activeTab === 'simulation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-4 shadow-md space-y-4">
            <div className="border-b border-[#a86e30]/40 pb-2 flex items-center justify-between">
              <span className="text-xs font-cinzel font-bold text-[#7a390e] uppercase">
                Alchemical Reaction Parameters
              </span>
              <button
                onClick={() => setParams({
                  oreType: 'Bastnäsite',
                  calcinationTemp: 600,
                  sinteringTemp: 1085,
                  magneticFieldPulse: 2.8,
                  inertAtmosphere: true,
                  bellowsPressure: 24
                })}
                className="text-[11px] text-[#7a390e] flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Optimal</span>
              </button>
            </div>

            {/* Ore Selector */}
            <div>
              <label className="text-xs font-bold text-[#542d10] block mb-1">
                Source Mineral Ore (अयस्क चयन):
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['Bastnäsite', 'Monazite', 'Xenotime'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setParams(p => ({ ...p, oreType: type }))}
                    className={`p-2 rounded border text-center transition-all ${
                      params.oreType === type
                        ? 'bg-[#7a2e12] text-white font-bold border-[#4a1805]'
                        : 'bg-[#ebd4b0] text-[#542d10] hover:bg-[#dec299] border-[#a87037]/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sintering Temperature Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-[#542d10] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#b53714]" />
                  Musha Sintering Temperature:
                </span>
                <span className="font-mono font-bold text-[#a32a0d]">
                  {params.sinteringTemp}°C {params.sinteringTemp >= 1060 && params.sinteringTemp <= 1100 ? '(Optimal Eutectic)' : ''}
                </span>
              </div>
              <input
                type="range"
                min="900"
                max="1350"
                step="5"
                value={params.sinteringTemp}
                onChange={e => setParams(p => ({ ...p, sinteringTemp: Number(e.target.value) }))}
                className="w-full h-2 bg-[#d1be9d] rounded-lg appearance-none cursor-pointer accent-[#8c3214]"
              />
              <div className="flex justify-between text-[10px] text-[#73431b] mt-0.5">
                <span>900°C (Incomplete)</span>
                <span>1080°C (Nd Eutectic Melt)</span>
                <span>1350°C (Grain Growth)</span>
              </div>
            </div>

            {/* Magnetic Alignment Pulse Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-[#542d10] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-[#c88a2c]" />
                  Orientation Field Pulse:
                </span>
                <span className="font-mono font-bold text-[#a32a0d]">
                  {params.magneticFieldPulse} Tesla
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.5"
                step="0.1"
                value={params.magneticFieldPulse}
                onChange={e => setParams(p => ({ ...p, magneticFieldPulse: Number(e.target.value) }))}
                className="w-full h-2 bg-[#d1be9d] rounded-lg appearance-none cursor-pointer accent-[#8c3214]"
              />
              <div className="flex justify-between text-[10px] text-[#73431b] mt-0.5">
                <span>0.5 T (Disordered)</span>
                <span>2.8 T (Domain Saturation)</span>
                <span>3.5 T (Super-Saturated)</span>
              </div>
            </div>

            {/* Bellows Air Pressure Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-[#542d10]">
                  Tuyère Air Blast (धौंकनी वायु दाब):
                </span>
                <span className="font-mono font-bold text-[#a32a0d]">
                  {params.bellowsPressure} kPa
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                value={params.bellowsPressure}
                onChange={e => setParams(p => ({ ...p, bellowsPressure: Number(e.target.value) }))}
                className="w-full h-2 bg-[#d1be9d] rounded-lg appearance-none cursor-pointer accent-[#8c3214]"
              />
            </div>

            {/* Inert Atmosphere Switch */}
            <div className="bg-[#f0dfbe] p-2.5 rounded-lg border border-[#c99a5e]/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#451f08] block">Inert Reducing Shield (Sandhi-Bandhana)</span>
                <span className="text-[11px] text-[#7a481c]">Hermetic clay-charcoal seal preventing oxide poisoning</span>
              </div>
              <input
                type="checkbox"
                checked={params.inertAtmosphere}
                onChange={e => setParams(p => ({ ...p, inertAtmosphere: e.target.checked }))}
                className="w-5 h-5 accent-[#8c3214] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Visualization & Solved Metrics */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Solved Grade Banner */}
            <div className="bg-[#fdfaf2] border-2 border-[#a36c34] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8a4e1a] font-cinzel tracking-wider">
                  Resulting Permanent Magnet Grade
                </span>
                <h3 className="text-2xl font-black font-cinzel text-[#7a2e12] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#c88a2c]" />
                  {metrics.grade}
                </h3>
                <p className="text-xs text-[#522d10] mt-0.5">
                  Microscopic Crystallite Alignment: <strong className="text-[#8c2a0d]">{metrics.crystalliteAlignment}%</strong>
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-[#73431b]">Purity & Compliance:</div>
                <div className="text-xs font-bold text-emerald-800 bg-[#e2f0d9] px-2.5 py-1 rounded border border-[#a8cc96] mt-0.5">
                  {metrics.purityGrade}
                </div>
              </div>
            </div>

            {/* Key Physical Output Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#f8f1e2] border border-[#8e5828]/50 p-2.5 rounded-lg text-center">
                <span className="text-[10px] uppercase font-bold text-[#7a390e] block">Remanence (Br)</span>
                <div className="text-lg font-bold font-mono text-[#4a2208] mt-0.5">
                  {metrics.remanenceBr} <span className="text-xs font-normal">Tesla</span>
                </div>
                <span className="text-[9px] text-[#73431b]">Magnetic Flux Retention</span>
              </div>

              <div className="bg-[#f8f1e2] border border-[#8e5828]/50 p-2.5 rounded-lg text-center">
                <span className="text-[10px] uppercase font-bold text-[#7a390e] block">Coercivity (Hcj)</span>
                <div className="text-lg font-bold font-mono text-[#a32a0d] mt-0.5">
                  {metrics.coercivityHcj} <span className="text-xs font-normal">kOe</span>
                </div>
                <span className="text-[9px] text-[#73431b]">Demagnetization Resistance</span>
              </div>

              <div className="bg-[#f8f1e2] border border-[#8e5828]/50 p-2.5 rounded-lg text-center">
                <span className="text-[10px] uppercase font-bold text-[#7a390e] block">Energy Product</span>
                <div className="text-lg font-bold font-mono text-[#7a2e12] mt-0.5">
                  {metrics.energyProductBHmax} <span className="text-xs font-normal">MGOe</span>
                </div>
                <span className="text-[9px] text-[#73431b]">(BH)max Work Potential</span>
              </div>
            </div>

            {/* Real-time Magnetic Dipoles & B-H Curve Visualizer */}
            <div className="bg-[#fdfaf2] border-2 border-[#a36c34]/60 rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Microscopic Dipoles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-cinzel text-[#69350d]">
                    Crystal Domain Alignment (Nd₂Fe₁₄B)
                  </span>
                  <span className="text-[10px] text-[#73431b] font-mono">
                    {metrics.crystalliteAlignment}% Parallel
                  </span>
                </div>
                <div className="bg-[#24170d] p-3 rounded-lg border border-[#52331b] grid grid-cols-6 gap-2 place-items-center h-44 shadow-inner">
                  {dipoles.map((angle, idx) => (
                    <div
                      key={idx}
                      className="w-5 h-5 flex items-center justify-center transition-transform duration-500"
                      style={{ transform: `rotate(${angle - 90}deg)` }}
                    >
                      <div className="w-1 h-4 bg-gradient-to-t from-[#4488ff] to-[#ff4444] rounded-full relative shadow-[0_0_4px_rgba(255,68,68,0.4)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff4444] absolute -top-0.5 -left-0.25"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#73431b] mt-1.5 text-center">
                  Red = North Pole · Blue = South Pole · Unified vectors generate high remanence
                </p>
              </div>

              {/* B-H Demagnetization Curve */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-cinzel text-[#69350d]">
                    Demagnetization Hysteresis (B-H)
                  </span>
                  <span className="text-[10px] text-[#73431b] font-mono">
                    2nd Quadrant
                  </span>
                </div>
                <div className="bg-[#f7eed9] p-2 rounded-lg border border-[#a87037] h-44 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 240 160" className="w-full h-full">
                    {/* Grid lines */}
                    <line x1="20" y1="130" x2="220" y2="130" stroke="#bda582" strokeWidth="1" />
                    <line x1="220" y1="20" x2="220" y2="130" stroke="#bda582" strokeWidth="1" />
                    
                    {/* Axis Labels */}
                    <text x="215" y="145" className="text-[9px] fill-[#703b0c] font-mono font-bold">-H (kOe)</text>
                    <text x="185" y="25" className="text-[9px] fill-[#703b0c] font-mono font-bold">B (Tesla)</text>

                    {/* Calculated B-H Curve */}
                    {(() => {
                      const hIntercept = 220 - (metrics.coercivityHcj / 35) * 160;
                      const bIntercept = 130 - (metrics.remanenceBr / 1.6) * 100;
                      // Square knee curve path
                      const kneeX = 220 - ((metrics.coercivityHcj * 0.85) / 35) * 160;
                      const kneeY = bIntercept + 8;

                      return (
                        <path
                          d={`M ${hIntercept},130 Q ${kneeX},${kneeY} 220,${bIntercept}`}
                          fill="none"
                          stroke="#a82a0d"
                          strokeWidth="2.5"
                          className="transition-all duration-300"
                        />
                      );
                    })()}

                    {/* Max Energy Product point highlight */}
                    <circle cx="160" cy="70" r="4" fill="#c88a2c" stroke="#4d270a" strokeWidth="1.5" className="animate-ping" />
                    <circle cx="160" cy="70" r="3" fill="#c88a2c" />
                    <text x="110" y="65" className="text-[8px] fill-[#8c2a0d] font-bold">(BH)max Peak</text>
                  </svg>
                </div>
                <p className="text-[10px] text-[#73431b] mt-1.5 text-center">
                  Squareness Ratio (Hk/Hcj) reflects resilience against extreme operating temperatures
                </p>
              </div>
            </div>

            {/* Real-time D3.js Line Chart: Simulated Magnetic Flux Density vs Furnace Temperature */}
            <FluxDensityD3Chart
              currentTemp={params.sinteringTemp}
              calcinationTemp={params.calcinationTemp}
              magneticPulse={params.magneticFieldPulse}
              inertAtmosphere={params.inertAtmosphere}
              oreType={params.oreType}
            />
          </div>
        </div>
      ) : (
        /* Cryptographic Sovereign QR Passport View */
        <div className="bg-[#fdfaf2] border-2 border-[#8e5828]/60 rounded-xl p-5 shadow-lg max-w-2xl mx-auto">
          <div className="border-4 border-double border-[#8e5828] p-5 rounded-lg bg-[#fbf6ea] relative">
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Compass className="w-80 h-80 text-[#542d10]" />
            </div>

            <div className="text-center pb-3 border-b-2 border-[#8e5828]/60">
              <div className="text-xs font-cinzel font-bold text-[#8c3214] uppercase tracking-widest">
                Nepal-Bharat Rare-Earth Sovereign Directorate
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-devanagari text-[#451f08] mt-0.5">
                प्रमाणित दुर्लभ मृत्तिका चुंबक पासपोर्ट
              </h3>
              <p className="text-xs text-[#73431b] font-cinzel">
                Authentic Cryptographic Material Specification Certificate
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-5 items-center">
              {/* QR Code Canvas */}
              <div className="sm:col-span-5 flex flex-col items-center">
                <div className="p-2 bg-white rounded-lg border-2 border-[#8e5828] shadow-md">
                  <canvas ref={qrCanvasRef} width={200} height={200} className="w-40 h-40" />
                </div>
                <span className="text-[10px] font-mono text-[#542d10] mt-1.5 text-center">
                  SHA-256: 8f4a...e92c
                </span>
                <span className="text-[9px] text-[#7a481c] font-cinzel text-center">
                  Scan to verify laboratory assay in decentralized registry
                </span>
              </div>

              {/* Certificate Details */}
              <div className="sm:col-span-7 space-y-2 text-xs text-[#3d210b]">
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Batch Ingot ID:</span>
                  <span className="font-mono font-bold">NB-RE-2026-N52X</span>
                </div>
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Alloy Class:</span>
                  <span className="font-bold">Nd₂Fe₁₄B Eutectic Matrix</span>
                </div>
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Remanence (Br):</span>
                  <span className="font-mono font-bold text-[#8c2a0d]">{metrics.remanenceBr} T</span>
                </div>
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Coercivity (Hcj):</span>
                  <span className="font-mono font-bold text-[#8c2a0d]">{metrics.coercivityHcj} kOe</span>
                </div>
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Energy Product:</span>
                  <span className="font-mono font-bold text-[#8c2a0d]">{metrics.energyProductBHmax} MGOe</span>
                </div>
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Purity & Safety:</span>
                  <span className="font-semibold text-emerald-800">{metrics.purityGrade}</span>
                </div>
                <div className="flex justify-between border-b border-[#c99a5e]/40 pb-1">
                  <span className="font-semibold text-[#7a390e]">Arthashastra Stamp:</span>
                  <span className="font-bold text-[#7a2e12]">Akaradhyaksha Sealed</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-[#8e5828]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[11px] text-[#73431b] italic">
                Valid for Global Export to Japan, Singapore, and Allied Clean-Tech Corridors.
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Spec Sheet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
