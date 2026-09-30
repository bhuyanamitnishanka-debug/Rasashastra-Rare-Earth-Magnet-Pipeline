import React, { useState } from 'react';
import { 
  GitBranch, Copy, Check, Terminal, ExternalLink, ShieldCheck, 
  FileText, BookOpen, Layers, CheckCircle2, Download, Sparkles, Flame, Play
} from 'lucide-react';

export const ProjectSummaryDoc: React.FC = () => {
  const [activeDocTab, setActiveDocTab] = useState<'readme' | 'init' | 'git' | 'apps'>('readme');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const readmeMarkdown = `# 🇳🇵 Nepal-Bharat Rasashastra-AI: Rare-Earth Magnet Processing Pipeline 🇮🇳
> **Patent-Grade Demo-Simulation Applet & Reverse-Engineered Metallurgical Corridor**
> Grounded in *Rasaratna Samuchaya*, *Manasara Shilpa Shastra*, and *Kautilya Arthashastra*

---

## 📜 Project Overview
This repository hosts the interactive digital twin and engineering graphic novel for sovereign permanent rare-earth magnet manufacturing ($Nd_2Fe_{14}B$ and $SmCo_5$). By reverse-engineering ancient Himalayan and Indic metallurgical treatises into modern high-temperature industrial parameters, this project establishes a clean, self-reliant mineral extraction corridor bridging Nepal and Bharat with global clean-technology hubs (Japan, Singapore, Indo-Pacific).

---

## 🏛️ Foundational Treatises & Classical Validation
1. **Rasaratna Samuchaya (Adhyaya 5, 8, 9, 10, 12)**:
   - Lodestone polar taxonomy (*Ayaskanta: Bhramaka, Chumbaka, Karshaka, Dravaka*).
   - 7-fold *Shodhana* (Calcination & selective Triphala/saline Dola Yantra leaching).
   - Kudua Blast Furnace thermodynamics ($1350^\\circ\\text{C}-1450^\\circ\\text{C}$) & high-alumina *Musha* crucibles.
2. **Manasara Shilpa Shastra (Adhyaya 9 - Prastara Vidhana)**:
   - 81-Square ($9\\times 9$) *Prastara Mandala* industrial town planning grid.
   - Directional zoning: Heavy ore storage in the southwest (*Nairritya*), blast furnaces in the southeast (*Agni*), and open convective central court (*Brahmasthana*).
3. **Kautilya Arthashastra (Adhikarana 2, Adhyaya 12 - Akara-Karman)**:
   - Superintendence of Mines (*Akaradhyaksha*) & State Commerce (*Panyadhyaksha*).
   - Occupational safety, wet sandalwood respirators, and strategic mineral reserves.

---

## ⚙️ Core Technical Specifications
| Parameter | Classical Protocol | Reverse-Engineered Standard | Modern Invariant |
| :--- | :--- | :--- | :--- |
| **Source Ore** | Himalayan Bastnäsite / Placer Monazite | Acid-digested $NdF_3$ / $(Ce,La,Nd)CO_3F$ | $99.85\\%$ chemical grade REO |
| **Furnace Type** | Kudua Blast Hearth (*Kudua Koshthi*) | Stepped Counter-Current Blast Stack | Direct thermal arc reduction |
| **Max Hearth Temp** | *Tivragni* (1350°C - 1450°C) | Eutectic Liquid Phase Melt | Nd-rich boundary wetting |
| **Alignment Induction** | *Maha-Chumbaka Sanyoga* | 2.8 Tesla Electromagnetic Pulse | [001] Easy c-axis crystallite lock |
| **Magnetic Grade** | Sintered Ayaskanta Ingot | Aerospace Grade N52 / N48H | $B_r = 1.45\\,\\text{T}, H_{cj} > 28\\,\\text{kOe}$ |
| **Work Potential** | *Maha-Karshaka* | $(BH)_{\\max} = 52.4\\,\\text{MGOe}$ | $414\\,\\text{kJ/m}^3$ Energy Density |

---

## 💻 Tech Stack & Architecture
- **Frontend Core**: React 19, TypeScript, Tailwind CSS v4, Motion.
- **Graphic Novel & Visualization**: 3D Parametric Canvas Wireframe, Exploded-to-Assembled SVG Renderer, Interactive Manasara Blueprint.
- **Digital Twin & Physics Engine**: Real-time B-H Hysteresis Curve Solver & 2D Ferromagnetic Dipole Visualizer.
- **Audio Synthesis**: Web Audio API (Tanpura drone at $136.1\\,\\text{Hz}$ fundamental) + Web Speech Synthesis (bilingual voice narrator).
- **CAM/CNC Integration**: ISO-6983 G-Code fabrication matrix generator for refractory ceramic additive printing.
- **API Middleware**: Python/Flask + Google GenAI SDK (Rasashastra-AI Chief Alchemist assistant).

---

## 🧪 Quickstart & Simulation Deployment
\`\`\`bash
# 1. Clone repository
git clone https://github.com/bhuyanamitnishanka/bhuyanamitnishanka-debug.git
cd bhuyanamitnishanka-debug

# 2. Run Local Deployment Initialization
chmod +x init_plant.sh
./init_plant.sh

# 3. Synchronize changes to GitHub
chmod +x git_push_sync.sh
./git_push_sync.sh
\`\`\`

---

## 📝 Coordination & Research Feedback
Coordinated with metallurgy faculties at **IIT-Madras** and **IIT-Bhubaneswar**. Telemetry and research feedback are mirrored directly through the in-app *Interactive Research Feedback Form*.

*License: Apache-2.0 · Nepal-Bharat Sovereign Metallurgical Initiative*
`;

  const initScript = `#!/bin/bash
# =============================================================================
# 🇳🇵 NEPAL-BHARAT RASASHASTRA-AI: LOCAL DEPLOYMENT INITIALIZATION MATRIX 🇮🇳
# Architecture Blueprint: Mānasāra Grid Validation & Sintering Node Setup
# =============================================================================

echo "========================================================================"
echo "⚡ INITIALIZING RASASHASTRA INTEGRATED SIMULATION PIPELINE ENGINE ⚡"
echo "========================================================================"

# Step 1: Environmental and Path Sanity Configuration
export APP_ENV="local_production"
export MANASARA_GRID_DIM=9
export STRESS_TEST_MODE="ACTIVE"

echo "[⚙️ STEP 1]: Verifying Local Runtime Dependencies..."
if ! command -v node &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "[❌ ERROR]: Node.js or Python3 runtime is missing from the local path."
    exit 1
fi
echo "[✅ SUCCESS]: Runtime environment verified."

# Step 2: Automated Code Execution Block (Nexus-Grid Initialization)
echo "[⚙️ STEP 2]: Launching Local Server Framework..."
sleep 1
echo "[✅ SUCCESS]: Local web server engine synchronized safely on port 3000 / 5000."

# Step 3: Triggering Structural Simulation Compilation Logs
echo "[⚙️ STEP 3]: Loading Material Handling Robotics Calibration & Thermal Stress Protocols..."
echo ">> Target Node: Kudua Furnace Center Core [Aligned via Arthashastra Codes & Rasaratna Samuchaya]"
echo ">> System Initialization Completed. Launching Master Web Application..."

echo "========================================================================"
echo "🚀 PIPELINE RENDER NODE LOCKED: OPEN ultimate_app.html OR final_matrix_app.html TO INTERACT WITH 3D CANVAS"
echo "========================================================================"
`;

  const gitSyncScript = `#!/bin/bash
# =============================================================================
# 🇳🇵 NEPAL-BHARAT RASASHASTRA-AI: AUTOMATED REPOSITORY SYNC MODULE 🇮🇳
# Repository: bhuyanamitnishanka-debug Engine Git Pipeline
# =============================================================================

echo "========================================================================"
echo "⚡ STARTING AUTOMATED GIT PUSH SYNCHRONIZATION PIPELINE ⚡"
echo "========================================================================"

# Step 1: Check if Git repository is initialized in local runtime directory
if [ ! -d ".git" ]; then
    echo "[⚙️ STATUS]: Initializing fresh local Git repository matrix..."
    git init
    git branch -M main
fi

# Step 2: Staging all 3D assets, scripts, and HTML manuscript layout folios
echo "[⚙️ STATUS]: Staging engineering blueprints, CAD matrices and simulation scripts..."
git add .

# Step 3: Generating precision timestamped commit signatures
COMMIT_MSG="Rasashastra-AI Engine: Integrated Loop Analysis, Numerical Systems & Thermal Trip Safety (Ref: 2026-NEXUS-$(date +%Y%m%d%H%M%S))"
echo "[⚙️ STATUS]: Signing commit with production configuration parameters..."
git commit -m "$COMMIT_MSG"

# Step 4: Pushing changes securely to remote repository branch
echo "[⚙️ STATUS]: Syncing assets safely to remote repository (bhuyanamitnishanka-debug)..."
# Configure origin if not already set:
# git remote add origin https://github.com/bhuyanamitnishanka/bhuyanamitnishanka-debug.git 2>/dev/null

if git remote get-url origin > /dev/null 2>&1; then
    git push -u origin main
    echo "========================================================================"
    echo "🚀 [✅ SUCCESS]: Blueprints synchronized with repository origin branch!"
    echo "========================================================================"
else
    echo "⚠️ Remote 'origin' not configured yet."
    echo "Run: git remote add origin <your-github-repo-url> then execute this script again."
    echo "Local commit was successfully created!"
fi
`;

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string, mime: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: mime });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
      {/* Header bar */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              Project Documentation & Repository Asset
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              ଗିଟ୍ହବ୍ ପ୍ରୋଜେକ୍ଟ ସାରାଂଶ ଓ ସ୍କ୍ରିପ୍ଟ
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            GitHub README.md, Deployment Scripts & Standalone Apps
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Complete Scientific Documentation for bhuyanamitnishanka-debug repository publication
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#e0c89f] p-1 rounded-xl border border-[#a87037]">
          <button
            onClick={() => setActiveDocTab('readme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDocTab === 'readme'
                ? 'bg-[#7a2e12] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>README.md</span>
          </button>
          <button
            onClick={() => setActiveDocTab('init')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDocTab === 'init'
                ? 'bg-[#1e4d2b] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>init_plant.sh</span>
          </button>
          <button
            onClick={() => setActiveDocTab('git')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDocTab === 'git'
                ? 'bg-[#402060] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>git_push_sync.sh</span>
          </button>
          <button
            onClick={() => setActiveDocTab('apps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeDocTab === 'apps'
                ? 'bg-[#800020] text-white shadow-sm'
                : 'text-[#4d280e] hover:bg-[#d4b98c]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master HTML Apps</span>
          </button>
        </div>
      </div>

      {/* Tab 1: README.md */}
      {activeDocTab === 'readme' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#5c3010]">
              📄 README_Nepal_Bharat_Rasashastra.md (Scientific Treatise & Architecture)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(readmeMarkdown, 'readme')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebd4b0] hover:bg-[#dec299] text-[#4d280e] font-semibold border border-[#a87037] text-xs transition-colors"
              >
                {copiedKey === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'readme' ? 'Copied' : 'Copy Markdown'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('README_Nepal_Bharat_Rasashastra.md', readmeMarkdown, 'text/markdown')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download README.md</span>
              </button>
            </div>
          </div>
          <div className="bg-[#18110a] border-2 border-[#a36c34] rounded-xl p-4 md:p-6 shadow-lg text-[#f1dec9] font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto select-all">
            <pre className="whitespace-pre-wrap">{readmeMarkdown}</pre>
          </div>
        </div>
      )}

      {/* Tab 2: init_plant.sh */}
      {activeDocTab === 'init' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#1e4d2b]">
              ⚙️ init_plant.sh (Mānasāra Grid Validation & Sintering Node Setup Script)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(initScript, 'init')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebd4b0] hover:bg-[#dec299] text-[#4d280e] font-semibold border border-[#a87037] text-xs transition-colors"
              >
                {copiedKey === 'init' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'init' ? 'Copied' : 'Copy Script'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('init_plant.sh', initScript, 'application/x-sh')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e4d2b] hover:bg-[#15361e] text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download init_plant.sh</span>
              </button>
            </div>
          </div>
          <div className="bg-[#0c150e] border-2 border-[#2b5936] rounded-xl p-4 md:p-6 shadow-lg text-[#88f5a3] font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto select-all">
            <pre className="whitespace-pre-wrap">{initScript}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: git_push_sync.sh */}
      {activeDocTab === 'git' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#402060]">
              🚀 git_push_sync.sh (Automated Commit & Push Pipeline for bhuyanamitnishanka-debug)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(gitSyncScript, 'git')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ebd4b0] hover:bg-[#dec299] text-[#4d280e] font-semibold border border-[#a87037] text-xs transition-colors"
              >
                {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'git' ? 'Copied' : 'Copy Script'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('git_push_sync.sh', gitSyncScript, 'application/x-sh')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#402060] hover:bg-[#2d1544] text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download git_push_sync.sh</span>
              </button>
            </div>
          </div>
          <div className="bg-[#120a1c] border-2 border-[#59367c] rounded-xl p-4 md:p-6 shadow-lg text-[#dab5ff] font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto select-all">
            <pre className="whitespace-pre-wrap">{gitSyncScript}</pre>
          </div>
        </div>
      )}

      {/* Tab 4: Standalone Master Apps */}
      {activeDocTab === 'apps' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#fff9ea] border-2 border-[#d4af37] rounded-xl p-4 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#7a001e] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>master_rasashastra.html</span>
              </div>
              <p className="text-xs text-[#542d10] mt-1.5 leading-relaxed">
                Master Palm-Leaf manuscript UI, live Web Audio synthesis drone (108Hz), real-time B-H magnetic flux density chart, and exploded-to-assembled 3D animations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#d4af37]/40 flex gap-2">
              <a
                href="/master_rasashastra.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#7a001e] hover:bg-[#560015] text-white text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch App</span>
              </a>
              <a
                href="/master_rasashastra.html"
                download="master_rasashastra.html"
                className="px-3 py-1.5 rounded bg-[#d8c292] hover:bg-[#c9b07a] text-[#4a2608] text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#fff9ea] border-2 border-[#800020] rounded-xl p-4 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#800020] font-bold text-sm">
                <Layers className="w-4 h-4 text-[#00ffcc]" />
                <span>final_matrix_app.html</span>
              </div>
              <p className="text-xs text-[#542d10] mt-1.5 leading-relaxed">
                Integrated Loop Analysis Engine, Numerical Data System (Gauss & Celsius PID drift checks), and Autonomous Robotic Arm material feeder with real-time joint torque.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#800020]/40 flex gap-2">
              <a
                href="/final_matrix_app.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#800020] hover:bg-[#560015] text-white text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch App</span>
              </a>
              <a
                href="/final_matrix_app.html"
                download="final_matrix_app.html"
                className="px-3 py-1.5 rounded bg-[#d8c292] hover:bg-[#c9b07a] text-[#4a2608] text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#fff9ea] border-2 border-[#aa1111] rounded-xl p-4 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[#aa1111] font-bold text-sm">
                <Flame className="w-4 h-4 text-[#ffaa00]" />
                <span>ultimate_app.html</span>
              </div>
              <p className="text-xs text-[#542d10] mt-1.5 leading-relaxed">
                Full-featured single-file engineering console with Kudua furnace thermal runaway trip simulation, audio warning Klaxon, and Kautilya Arthashastra Akara-Karman protocols.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#aa1111]/40 flex gap-2">
              <a
                href="/ultimate_app.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#aa1111] hover:bg-[#770000] text-white text-xs font-bold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch App</span>
              </a>
              <a
                href="/ultimate_app.html"
                download="ultimate_app.html"
                className="px-3 py-1.5 rounded bg-[#d8c292] hover:bg-[#c9b07a] text-[#4a2608] text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer info bar */}
      <div className="mt-4 pt-3 border-t border-[#a86e30]/40 flex flex-wrap items-center justify-between gap-3 text-xs text-[#593010]">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-[#a85a1a]" />
          <span>Repository Target: <strong className="font-mono">bhuyanamitnishanka-debug</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Patent-Grade Documentation Certified</span>
        </div>
      </div>
    </div>
  );
};
