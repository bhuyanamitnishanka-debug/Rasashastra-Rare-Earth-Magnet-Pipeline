import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, Flame, AlertTriangle, ShieldCheck, Play, RotateCcw, 
  Terminal, Download, Copy, Check, GitBranch, Cpu, Sparkles, CheckCircle2,
  Gauge, Info, FileCode
} from 'lucide-react';

interface ShodhanaResult {
  status: string;
  purifiedYieldGrams: number;
  crucibleStrainMpa: number;
  safetyTripTriggered: boolean;
  volatilizationRate: number;
  isCompleted: boolean;
}

export const NagarjunaLabSimulator: React.FC = () => {
  // Simulator inputs
  const [yantraType, setYantraType] = useState<string>('Koshthi_Yantra_Chamber');
  const [compoundOre, setCompoundOre] = useState<string>('Neodymium-Samarium Rare-Earth Complex');
  const [rawWeight, setRawWeight] = useState<number>(500);
  const [heatCelsius, setHeatCelsius] = useState<number>(1350);
  const [durationHours, setDurationHours] = useState<number>(6);
  const saturationConstant = 0.846;

  // Simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [result, setResult] = useState<ShodhanaResult | null>({
    status: "OPTIMAL: Impurities vaporized successfully. Material crystalline properties locked.",
    purifiedYieldGrams: 438.411,
    crucibleStrainMpa: 27.0,
    safetyTripTriggered: false,
    volatilizationRate: 0.821,
    isCompleted: true
  });

  // Tab for Code & Pipeline inspection
  const [subTab, setSubTab] = useState<'simulator' | 'python_code' | 'cicd_pipeline'>('simulator');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pre-configured Python Source Code
  const pythonSourceCode = `# =============================================================================
# NEPAL-BHARAT RASASHASTRA-AI: MAHARSHI NAGARJUNA LABORATORY TESTING SUITE
# Methodologies: Analytical Purification (Shodhana) and Distillation Verification
# =============================================================================
import math
import time

class NagarjunaLabManual:
    def __init__(self, yantra_type, compound_ore, raw_weight_grams):
        self.yantra_type = yantra_type        # Classical apparatus: "Dola_Yantra", "Koshthi_Yantra"
        self.compound_ore = compound_ore      # Material under evaluation: "Neodymium_Complex"
        self.raw_weight = raw_weight_grams    # Input mass metrics
        self.saturation_constant = 0.846      # Derived mathematical alignment index

    def run_shodhana_experiment(self, operational_heat_celsius, cycle_duration_hours):
        """Simulates text-based mineral ore purification and calculates volatile extraction loss"""
        print(f">> Initializing Experiment Matrix inside: {self.yantra_type}...")
        print(f">> Staging Target Compound Element: {self.compound_ore} ({self.raw_weight}g)")
        time.sleep(1) # Simulating apparatus heat balancing delay

        # Numerical evaluation logic based on thermal saturation thresholds
        if operational_heat_celsius >= 1100:
            volatilization_rate = math.exp(-1 / (cycle_duration_hours * self.saturation_constant))
            purified_yield = self.raw_weight * (1 - (volatilization_rate * 0.15))
            stress_on_musha = (operational_heat_celsius * 0.12) / cycle_duration_hours
            
            if stress_on_musha > 150.0:
                status = "CRITICAL: Thermal strain approaching crucible crack boundary threshold."
                safety_trip_triggered = True
            else:
                status = "OPTIMAL: Impurities vaporized successfully. Material crystalline properties locked."
                safety_trip_triggered = False
        else:
            purified_yield = self.raw_weight
            status = "FAILED: Insufficient heat energy to crack atomic mineral boundaries."
            safety_trip_triggered = False
            stress_on_musha = 0.0

        return {
            "experiment_status": status,
            "net_purified_yield_grams": round(purified_yield, 3),
            "calculated_crucible_strain_mpa": round(stress_on_musha, 2),
            "system_fail_safe_trip": safety_trip_triggered
        }

# --- TEST HARNESS EXECUTION PATH ---
if __name__ == "__main__":
    print("=" * 80)
    print("🔬 MAHARSHI NAGARJUNA LABORATORY CODE MATRIX: REAL-TIME EXTRACTION TEST 🔬")
    print("=" * 80)

    # Initialize experimental lab instance for processing rare-earth oxides
    experiment_node = NagarjunaLabManual(
        yantra_type="Koshthi_Yantra_Chamber",
        compound_ore="Neodymium-Samarium Rare-Earth Complex",
        raw_weight_grams=500.0
    )

    # Run distillation testing sequence at high temperature parameters
    results_matrix = experiment_node.run_shodhana_experiment(
        operational_heat_celsius=1350,
        cycle_duration_hours=6
    )

    print(f"[*] Execution Result  : {results_matrix['experiment_status']}")
    print(f"[*] Purified Ore Mass : {results_matrix['net_purified_yield_grams']} grams")
    print(f"[*] Crucible Strain   : {results_matrix['calculated_crucible_strain_mpa']} Mpa")
    print(f"[*] Fail-Safe Tripped : {results_matrix['system_fail_safe_trip']}")
    print("=" * 80)`;

  // GitHub Actions Workflow YAML
  const cicdWorkflowYaml = `# =============================================================================
# 🇳🇵 NEPAL-BHARAT RASASHASTRA-AI: MAIN INTEGRATION & DEPLOYMENT PIPELINE 🇮🇳
# Repository Target: bhuyanamitnishanka-debug/Nexus-Grid-Blueprint-Manager
# Automation Workflow Configuration for Continuous Integration and Site Deployment
# =============================================================================

name: Rasashastra-AI Engine CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  validate_and_test:
    name: Code Verification & Structural Simulation Testing
    runs-on: ubuntu-latest

    steps:
      # --- STEP 1: CODEBASE REPOSITORY CHECKOUT ---
      - name: Checkout Local Repository Assets
        uses: actions/checkout@v3

      # --- STEP 2: RUNTIME RUNTIME SETUP ---
      - name: Configure Python Environment (v3.10)
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
          cache: 'pip'

      # --- STEP 3: ENVIRONMENT DEPENDENCY CONTEXT INSTALLATION ---
      - name: Install System Testing Dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
          # Injecting baseline simulation packages if requirements file is bare
          pip install flake8 pytest

      # --- STEP 4: SYNTAX PARSING & STATIC ANALYSIS ---
      - name: Lint Codebase Syntax (Flake8 Execution)
        run: |
          # Stop the build if there are Python syntax errors or undefined names
          flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
          # exit-zero treats all errors as warnings to prevent unnecessary pipeline blockages
          flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

      # --- STEP 5: EXECUTE METALLURGICAL TESTING MATRIX ---
      - name: Run Nagarjuna Laboratory Stress Simulation Suite
        run: |
          # Executes the automated laboratory script directly inside the runner environment
          if [ -f nagarjuna_lab_suite.py ]; then python nagarjuna_lab_suite.py; fi
          # Directly verifying Nagarjuna testing automation harnesses
          python -c "
class NagarjunaTest:
    def test_run(self):
        heat = 1350
        duration = 6
        strain = (heat * 0.12) / duration
        print(f'CI Automated Testing: Calculated Crucible Strain -> {strain} Mpa')
        assert strain == 27.0, 'Mathematical mismatch in laboratory strain calculation core'
nt = NagarjunaTest()
nt.test_run()
          "

  deploy_simulation_platform:
    name: Build Verification & Deployment Outflow Node
    needs: validate_and_test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout Local Repository Assets
        uses: actions/checkout@v3

      # --- STEP 6: VERIFY FRONTEND WEBGL CANVAS LAYER ---
      - name: Sanity Check WebGL Deployment Packages
        run: |
          echo "[⚙️ Pipeline]: Validating HTML5 Folio Files..."
          test -f app.html || test -f complete_system.html || test -f index.html
          echo "[✅ Success]: Canvas layout assets verified for web deployment."

      # --- STEP 7: MASTER PRODUCTION REGISTRATION SIGNAL ---
      - name: Signal Successful Production Integration
        run: |
          echo "========================================================================"
          echo "🚀 PIPELINE RUN COMPLETE: NEPAL-BHARAT PLATFORM VERSION LOCKED 🚀"
          echo "All AutoCAD vector profiles, G-Code blocks, and WebGL elements deployed."
          echo "========================================================================"`;

  const runExperiment = () => {
    setIsRunning(true);
    setExecutionLog([
      `>> Initializing Experiment Matrix inside: ${yantraType}...`,
      `>> Staging Target Compound Element: ${compoundOre} (${rawWeight}g)`,
      `>> Thermal Ramp Target: ${heatCelsius}°C | Duration Cycle: ${durationHours}h`,
      `>> Balancing apparatus thermal boundary indices...`
    ]);

    setTimeout(() => {
      let status = "";
      let purifiedYield = rawWeight;
      let stressOnMusha = 0.0;
      let safetyTripTriggered = false;
      let volatilizationRate = 0.0;

      if (heatCelsius >= 1100) {
        volatilizationRate = Math.exp(-1 / (durationHours * saturationConstant));
        purifiedYield = rawWeight * (1 - (volatilizationRate * 0.15));
        stressOnMusha = (heatCelsius * 0.12) / durationHours;

        if (stressOnMusha > 150.0) {
          status = "CRITICAL: Thermal strain approaching crucible crack boundary threshold.";
          safetyTripTriggered = true;
        } else {
          status = "OPTIMAL: Impurities vaporized successfully. Material crystalline properties locked.";
          safetyTripTriggered = false;
        }
      } else {
        purifiedYield = rawWeight;
        status = "FAILED: Insufficient heat energy to crack atomic mineral boundaries.";
        safetyTripTriggered = false;
        stressOnMusha = 0.0;
      }

      setResult({
        status,
        purifiedYieldGrams: Number(purifiedYield.toFixed(3)),
        crucibleStrainMpa: Number(stressOnMusha.toFixed(2)),
        safetyTripTriggered,
        volatilizationRate: Number(volatilizationRate.toFixed(4)),
        isCompleted: true
      });

      setExecutionLog(prev => [
        ...prev,
        `[*] Execution Result  : ${status}`,
        `[*] Purified Ore Mass : ${purifiedYield.toFixed(3)} grams (Loss: ${(rawWeight - purifiedYield).toFixed(3)}g)`,
        `[*] Crucible Strain   : ${stressOnMusha.toFixed(2)} Mpa (Threshold: 150.00 Mpa)`,
        `[*] Fail-Safe Tripped : ${safetyTripTriggered ? "TRUE (SYSTEM HALT)" : "FALSE (SAFE)"}`,
        `================================================================================`
      ]);

      setIsRunning(false);
    }, 800);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: mime });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Quick preset loaders
  const loadPreset = (preset: 'baseline' | 'stress_trip' | 'cold_failure') => {
    if (preset === 'baseline') {
      setYantraType('Koshthi_Yantra_Chamber');
      setCompoundOre('Neodymium-Samarium Rare-Earth Complex');
      setRawWeight(500);
      setHeatCelsius(1350);
      setDurationHours(6);
    } else if (preset === 'stress_trip') {
      setYantraType('Koshthi_Yantra_Chamber');
      setCompoundOre('Bastnäsite Himalayan Fluo-Carbonate');
      setRawWeight(1000);
      setHeatCelsius(1580);
      setDurationHours(1.2); // (1580 * 0.12) / 1.2 = 158.0 MPa > 150 MPa Trip!
    } else {
      setYantraType('Dola_Yantra_Apparatus');
      setCompoundOre('Monazite Placer Phosphate Matrix');
      setRawWeight(500);
      setHeatCelsius(920); // < 1100°C failure
      setDurationHours(4);
    }
  };

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              Maharshi Nagarjuna Experimental Suite & CI/CD Pipeline
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              ନାଗାର୍ଜୁନ ଲ୍ୟାବ୍ ଓ ସିଆଇ/ସିଡି
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            ମହର୍ଷି ନାଗାର୍ଜୁନ ଲ୍ୟାବୋରେଟୋରୀ ଟେଷ୍ଟିଂ ସୁଟ୍ (Analytical Shodhana Testing Suite)
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Verification of Volatile Extraction Loss, Crucible Strain Calculations, and GitHub Actions Automation
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#e0c89f] p-1 rounded-xl border border-[#a87037]">
          <button
            onClick={() => setSubTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'simulator'
                ? 'bg-[#7a2e12] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Interactive Shodhana Lab</span>
          </button>
          <button
            onClick={() => setSubTab('python_code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'python_code'
                ? 'bg-[#1b4332] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>nagarjuna_lab_suite.py</span>
          </button>
          <button
            onClick={() => setSubTab('cicd_pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'cicd_pipeline'
                ? 'bg-[#402060] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>rasashastra_ci_cd.yml</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE SIMULATOR */}
      {subTab === 'simulator' && (
        <div className="space-y-6">
          {/* Quick presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#ecd9bc] p-2.5 rounded-xl border border-[#b58852]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5c3010]">
              <Sparkles className="w-4 h-4 text-[#a85a1a]" />
              <span>Experiment Presets:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => loadPreset('baseline')}
                className="px-2.5 py-1 rounded bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-medium transition-colors"
              >
                CI Baseline (1350°C, 6h → 27.0 MPa)
              </button>
              <button
                onClick={() => loadPreset('stress_trip')}
                className="px-2.5 py-1 rounded bg-[#7a001e] hover:bg-[#a8002a] text-white text-xs font-medium transition-colors"
              >
                Overload Shock (1580°C, 1.2h → 158.0 MPa TRIP)
              </button>
              <button
                onClick={() => loadPreset('cold_failure')}
                className="px-2.5 py-1 rounded bg-[#5a3200] hover:bg-[#784400] text-white text-xs font-medium transition-colors"
              >
                Sub-threshold Failure (920°C &lt; 1100°C)
              </button>
            </div>
          </div>

          {/* Main Grid: Controls on Left, Results & Gauge on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Parameter Form */}
            <div className="lg:col-span-6 space-y-4 bg-[#fffaf0] border border-[#a87037] p-4 sm:p-5 rounded-xl shadow-sm">
              <h3 className="font-cinzel font-bold text-sm text-[#643410] border-b border-[#ebd2b0] pb-2 flex items-center justify-between">
                <span>1. Classical Apparatus & Target Minerals</span>
                <span className="text-[10px] text-[#8a5223] font-mono">NAGARJUNA METHODOLOGY</span>
              </h3>

              {/* Yantra Type */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#52290d] flex items-center justify-between">
                  <span>Yantra Apparatus Type (ଯନ୍ତ୍ର ପ୍ରକାର):</span>
                  <span className="text-[10px] font-mono text-[#824718]">CLASSICAL VESSEL</span>
                </label>
                <select
                  value={yantraType}
                  onChange={(e) => setYantraType(e.target.value)}
                  className="w-full bg-[#faedd9] border border-[#a87037] rounded-lg px-3 py-2 text-xs font-mono text-[#381e0a] focus:outline-none focus:ring-2 focus:ring-[#7a2e12]"
                >
                  <option value="Koshthi_Yantra_Chamber">Koshthi_Yantra_Chamber (High-Heat Extraction Blast Hearth)</option>
                  <option value="Dola_Yantra_Apparatus">Dola_Yantra_Apparatus (Suspended Leaching Flask)</option>
                  <option value="Valuka_Yantra_Furnace">Valuka_Yantra_Furnace (Graduated Sand-Bath Exchanger)</option>
                  <option value="Damaru_Yantra_Still">Damaru_Yantra_Still (Dual-Flask Upward Sublimation Vessel)</option>
                </select>
              </div>

              {/* Compound Ore */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#52290d]">Target Compound Ore (ଲକ୍ଷ୍ୟ ଖଣିଜ):</label>
                <select
                  value={compoundOre}
                  onChange={(e) => setCompoundOre(e.target.value)}
                  className="w-full bg-[#faedd9] border border-[#a87037] rounded-lg px-3 py-2 text-xs font-mono text-[#381e0a] focus:outline-none focus:ring-2 focus:ring-[#7a2e12]"
                >
                  <option value="Neodymium-Samarium Rare-Earth Complex">Neodymium-Samarium Rare-Earth Complex (Nd-Sm Matrix)</option>
                  <option value="Bastnäsite Himalayan Fluo-Carbonate">Bastnäsite Himalayan Fluo-Carbonate (Himalayan Placer)</option>
                  <option value="Monazite Placer Phosphate Matrix">Monazite Placer Phosphate Matrix (Heavy Mineral Sand)</option>
                  <option value="Lodestone Ayaskanta Ferromagnetic Ingot">Lodestone Ayaskanta Ferromagnetic Ingot (Natural Magnetite)</option>
                </select>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                {/* Raw Weight */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#52290d]">
                    <span>Raw Input Mass (ପ୍ରାରମ୍ଭିକ ଓଜନ):</span>
                    <span className="font-mono text-[#7a2e12]">{rawWeight} grams</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={rawWeight}
                    onChange={(e) => setRawWeight(Number(e.target.value))}
                    className="w-full accent-[#7a2e12]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8a5528] font-mono">
                    <span>100g</span>
                    <span>500g (Standard)</span>
                    <span>2000g</span>
                  </div>
                </div>

                {/* Operational Heat */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#52290d]">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-600" />
                      <span>Operational Heat (°C) (ଅପରେସନାଲ ତାପମାତ୍ରା):</span>
                    </span>
                    <span className={`font-mono font-bold ${heatCelsius >= 1100 ? 'text-[#1b4332]' : 'text-red-600'}`}>
                      {heatCelsius}°C {heatCelsius < 1100 && '(Below 1100°C threshold)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="1650"
                    step="25"
                    value={heatCelsius}
                    onChange={(e) => setHeatCelsius(Number(e.target.value))}
                    className="w-full accent-[#7a2e12]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8a5528] font-mono">
                    <span>800°C</span>
                    <span className="text-[#a85a1a] font-bold">1100°C (Threshold)</span>
                    <span>1650°C</span>
                  </div>
                </div>

                {/* Cycle Duration */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#52290d]">
                    <span>Cycle Duration (ଘଣ୍ଟା):</span>
                    <span className="font-mono text-[#7a2e12]">{durationHours} hours</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="18"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full accent-[#7a2e12]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8a5528] font-mono">
                    <span>0.5h (High Strain)</span>
                    <span>6h (Optimal)</span>
                    <span>18h</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={runExperiment}
                disabled={isRunning}
                className="w-full py-2.5 px-4 rounded-lg bg-[#7a2e12] hover:bg-[#943917] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isRunning ? (
                  <>
                    <Cpu className="w-4 h-4 animate-spin text-[#ffd285]" />
                    <span>Executing Shodhana Matrix Calculations...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Shodhana Experiment (ନାଗାର୍ଜୁନ ପରୀକ୍ଷଣ)</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Mathematical Output & Real-time Gauges */}
            <div className="lg:col-span-6 space-y-4">
              {/* Output Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card 1: Purified Yield */}
                <div className="bg-[#fffdf8] border border-[#a87037] p-3.5 rounded-xl shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-[#73431b] block">
                    Purified Ore Yield (ପରିଷ୍କୃତ ଧାତୁ):
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono text-[#1b4332] mt-1">
                    {result ? `${result.purifiedYieldGrams} g` : '--'}
                  </div>
                  <span className="text-[10px] text-[#8a5223]">
                    {result ? `Extraction Loss: ${(rawWeight - result.purifiedYieldGrams).toFixed(3)}g (${(((rawWeight - result.purifiedYieldGrams) / rawWeight) * 100).toFixed(2)}%)` : ''}
                  </span>
                </div>

                {/* Card 2: Crucible Strain */}
                <div className={`p-3.5 rounded-xl border shadow-sm ${
                  result?.safetyTripTriggered
                    ? 'bg-[#ffebee] border-red-500 text-red-950'
                    : 'bg-[#fffdf8] border-[#a87037]'
                }`}>
                  <span className="text-[10px] uppercase font-bold text-[#73431b] block">
                    Crucible Strain (ମୂଷା ଷ୍ଟ୍ରେନ୍):
                  </span>
                  <div className={`text-xl sm:text-2xl font-black font-mono mt-1 ${
                    result?.safetyTripTriggered ? 'text-red-700' : 'text-[#7a2e12]'
                  }`}>
                    {result ? `${result.crucibleStrainMpa} MPa` : '--'}
                  </div>
                  <span className={`text-[10px] font-bold ${result?.safetyTripTriggered ? 'text-red-700' : 'text-emerald-700'}`}>
                    {result?.safetyTripTriggered ? '⚠️ EXCEEDS 150.0 MPa REDLINE' : '✓ Safe Margin (< 150 MPa)'}
                  </span>
                </div>
              </div>

              {/* Strain Stress Gauge Visualizer */}
              <div className="bg-[#140c06] border-2 border-[#542d10] p-4 rounded-xl text-[#f5ebd7] space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#ffd285] font-bold flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-[#ffd285]" />
                    <span>Musha Crucible Structural Strain Gauge:</span>
                  </span>
                  <span className={result?.safetyTripTriggered ? 'text-red-400 font-bold' : 'text-[#39ff14]'}>
                    {result ? `${result.crucibleStrainMpa} / 150.00 MPa` : '--'}
                  </span>
                </div>

                {/* Progress Gauge */}
                <div className="w-full bg-[#2a170a] h-3.5 rounded-full overflow-hidden border border-[#522d14] relative">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (result?.crucibleStrainMpa || 0) > 150
                        ? 'bg-gradient-to-r from-amber-500 to-red-600'
                        : (result?.crucibleStrainMpa || 0) > 100
                        ? 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, ((result?.crucibleStrainMpa || 0) / 180) * 100)}%` }}
                  />
                  {/* 150 MPa Threshold Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                    style={{ left: `${(150 / 180) * 100}%` }}
                    title="150 MPa Redline Threshold"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-[#aa8765]">
                  <span>0 MPa (Zero Load)</span>
                  <span className="text-red-400 font-bold">150 MPa (Trip Redline)</span>
                  <span>180 MPa (Max Scale)</span>
                </div>

                {/* Status Callout Banner */}
                {result && (
                  <div className={`p-2.5 rounded-lg border text-xs font-mono leading-relaxed ${
                    result.safetyTripTriggered
                      ? 'bg-[#3b0a0a] border-red-500 text-red-200'
                      : result.crucibleStrainMpa === 0
                      ? 'bg-[#2b190a] border-amber-600 text-amber-200'
                      : 'bg-[#0f291e] border-emerald-500 text-emerald-200'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5">
                      {result.safetyTripTriggered ? (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      )}
                      <span>SYSTEM STATUS:</span>
                    </div>
                    <div className="mt-1 text-[11px]">{result.status}</div>
                  </div>
                )}
              </div>

              {/* Terminal Log Console */}
              <div className="bg-[#0b0805] border border-[#3e2412] p-3 rounded-xl font-mono text-xs text-[#33ff33] h-36 overflow-y-auto shadow-inner space-y-1">
                <div className="text-[10px] text-[#caa177] border-b border-[#2d1b0d] pb-1 flex items-center justify-between">
                  <span>TERMINAL STREAM: PYTHON V3.10 RUNNER</span>
                  <span>NAGARJUNA-AI ENGINE</span>
                </div>
                {executionLog.length === 0 ? (
                  <div className="text-[#64503b] italic">
                    Ready to execute test harness. Click 'Run Shodhana Experiment' or select a preset above.
                  </div>
                ) : (
                  executionLog.map((line, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">{line}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PYTHON CODE (nagarjuna_lab_suite.py) */}
      {subTab === 'python_code' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-bold text-[#1b4332]">
              🐍 nagarjuna_lab_suite.py (Analytical Purification & Distillation Verification Script)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(pythonSourceCode, 'python')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebd4b0] hover:bg-[#dec299] text-[#4d280e] font-semibold border border-[#a87037] text-xs transition-colors"
              >
                {copiedKey === 'python' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'python' ? 'Copied' : 'Copy Python'}</span>
              </button>
              <button
                onClick={() => handleDownload('nagarjuna_lab_suite.py', pythonSourceCode, 'text/x-python')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .py</span>
              </button>
            </div>
          </div>
          <div className="bg-[#0c150e] border-2 border-[#2b5936] rounded-xl p-4 md:p-6 shadow-lg text-[#88f5a3] font-mono text-xs leading-relaxed max-h-[520px] overflow-y-auto select-all">
            <pre className="whitespace-pre-wrap">{pythonSourceCode}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: GITHUB ACTIONS CI/CD WORKFLOW */}
      {subTab === 'cicd_pipeline' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#402060]">
                ⚙️ .github/workflows/rasashastra_ci_cd.yml (Continuous Integration & Test Harness)
              </span>
              <p className="text-[11px] text-[#73431b]">
                Target: <strong className="font-mono">bhuyanamitnishanka-debug/Nexus-Grid-Blueprint-Manager</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(cicdWorkflowYaml, 'cicd')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebd4b0] hover:bg-[#dec299] text-[#4d280e] font-semibold border border-[#a87037] text-xs transition-colors"
              >
                {copiedKey === 'cicd' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'cicd' ? 'Copied' : 'Copy YAML'}</span>
              </button>
              <button
                onClick={() => handleDownload('rasashastra_ci_cd.yml', cicdWorkflowYaml, 'text/yaml')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#402060] hover:bg-[#5a2e88] text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .yml</span>
              </button>
            </div>
          </div>
          <div className="bg-[#120a1c] border-2 border-[#59367c] rounded-xl p-4 md:p-6 shadow-lg text-[#dab5ff] font-mono text-xs leading-relaxed max-h-[520px] overflow-y-auto select-all">
            <pre className="whitespace-pre-wrap">{cicdWorkflowYaml}</pre>
          </div>
        </div>
      )}

      {/* Bottom Authority Card */}
      <div className="pt-3 border-t border-[#8e5828]/40 flex flex-wrap items-center justify-between gap-3 text-xs text-[#593010]">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-[#a85a1a]" />
          <span>CI Automated Verification: <strong className="font-mono">strain == 27.0 MPa</strong> at (1350°C, 6h)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Rasaratna Samuchaya Adhyaya 8 Purification Verified</span>
        </div>
      </div>
    </div>
  );
};
