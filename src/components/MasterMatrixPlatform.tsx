import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, VolumeX, Layers, Terminal, Sparkles, Download, Copy, Check, Compass, Flame } from 'lucide-react';

interface ManualPage {
  title: string;
  shloka: string;
  eng: string;
  hin: string;
  ori: string;
  hud: string;
  gcode: string;
}

const manualPages: ManualPage[] = [
  {
    title: "Phase 1: Smelting Infrastructure & Authority",
    shloka: "आकराध्यक्षः खनिशास्त्रमणिरसधातुपरीक्षाक्षस्तज्ज्ञसखो वा ... कर्मान्तं कारयेत् ॥ (अर्थशास्त्र २.१२.१)",
    eng: "The Master Superintendent of Mines (Akaradhyaksha) manages the geological Neodymium ore extraction pipelines and metallurgic facilities alongside engineering experts.",
    hin: "खदान प्रमुख (आकराध्यक्ष) को भूविज्ञान और दुर्लभ-मृत्तिका (Rare-Earth) धातुकर्म के विशेषज्ञों के साथ मिलकर ही विनिर्माण कारखानों को स्थापित करना चाहिए।",
    ori: "ଖଣି ବିଭାଗର ମୁଖ୍ୟ (ଆକରାଧ୍ୟକ୍ଷ) ଭୂବିଜ୍ଞାନ ଓ ଦୁର୍ଲଭ ଖଣିଜ (Rare-Earth) ଧାତୁ ଶୋଧନ ବିଶେଷଜ୍ଞମାନଙ୍କ ସହିତ ମିଳିତ ହୋଇ ଶିଳ୍ପ କାରଖାନା ପ୍ରତିଷ୍ଠା କରିବା ଆବଶ୍ୟକ।",
    hud: "NODE: ORE MINING MATRIX\nINFRASTRUCTURE: AKARADHYAKSHA DEPT\nTEMP CORE: 28 CELSIUS\nFLUX DENSITY: 0.00 GAUSS",
    gcode: "G21 ; Millimeter setup\nG90 ; Absolute calibration\nG00 X15.0 Y15.0 Z5.0 ; Position extraction mechanical armature\nG01 Z-5.0 F400 ; Begin ore layer segregation cutting\nM05 ; Hold module execution path"
  },
  {
    title: "Phase 2: Kudua Furnace Sintering & Musha Core Machining",
    shloka: "सर्वषां लोहजातानां रसराजो महाबलः । करोति लोहसिद्धिं च तस्माद्रस इति स्मृतः ॥ (रसरत्नसर्जन १.४)",
    eng: "Chemical essences drive atomic synthesis; machine the high-alumina Musha core with ISO metric G-code (12,000 RPM spindle) and apply focused heat inside the Kudua Blast Furnace.",
    hin: "सभी धातुओं और तत्वों में रसराज महाबलशाली है। मूषा कोर (Crucible) का ISO मीट्रिक मशीनिंग कर कुडुआ भट्टी के भीतर उच्च तापीय प्रद्रवण (Sintering) कार्य करें।",
    ori: "ସମସ୍ତ ଧାତୁ ଓ ରସାୟନ ମଧ୍ୟରେ ରସରାଜ ମହାବଳଶାଳୀ। ମୂଷା କୋର୍ (Musha Core) ପାଇଁ ISO ମେଟ୍ରିକ୍ CNC ରୁଟିନ୍ (୧୨,୦୦୦ RPM) ଅନୁଯାୟୀ କଟିଙ୍ଗ୍ ଏବଂ କୁଡୁଆ ଭାଟି ମଧ୍ୟରେ ଉଚ୍ଚ ତାପମାତ୍ରା ସିଣ୍ଟରିଂ କରନ୍ତୁ।",
    hud: "NODE: KUDUA FURNACE & MUSHA CORE\nINFRASTRUCTURE: RASARATNA SAMUCHAYA\nTEMP CORE: 1340 CELSIUS (SINTERING)\nFLUX DENSITY: 8500.45 GAUSS\nCNC SPINDLE: 12,000 RPM (ISO METRIC)",
    gcode: `; =========================================================================
; NEPAL-BHARAT RASASHASTRA-AI: MACHINING ROUTINE
# Component: Inner Core Crucible Part (Musha Core)
# Standard: ISO Metric G-Code | Aligned via Manasara Units
; =========================================================================

G21 ; Set system units to millimeters
G90 ; Set machine positioning to Absolute Mode
M03 S12000 ; Spin up milling spindle to 12,000 RPM (Optimal Sintering Cut)

; --- STEP 1: RAPID POSITIONING & APPROACH ---
G00 X45.000 Y45.000 Z5.000 ; Rapid travel directly over the grid center node
M07 ; Engage mist coolant for carbon/ceramic dust suppression

; --- STEP 2: PLUNGE & INITIAL PLUNGE HOLE CUT ---
G01 Z-2.500 F300 ; Linear feed entry plunge into raw stock top surface
G01 X45.000 Y45.000 Z-5.000 F150 ; Feed plunge to initial structural floor depth

; --- STEP 3: INNER CHAMBER CIRCULAR INTERPOLATION ---
G02 X45.000 Y45.000 I10.000 J0.000 F600 ; Counter-clockwise circular excavation cut (Radius: 10mm)
G01 Z-10.000 F150 ; Plunge deeper to mid-section crucible cavity chamber
G02 X45.000 Y45.000 I15.000 J0.000 F800 ; Wider clean-up circular wall pass (Radius: 15mm)

; --- STEP 4: FLOOR FINISHING & BASE RAMPING ---
G01 Z-15.000 F120 ; Reach final internal chamber floor coordinate limit
G03 X45.000 Y45.000 I15.000 J0.000 F400 ; Mirror finishing pass to ensure flat floor geometry

; --- STEP 5: SAFE RETRACTION & SHUTDOWN ---
G00 Z25.000 M05 ; Rapid retract tool along Z-axis and power down spindle safely
M09 ; Shut off coolant system feed lines
M30 ; End of program execution path matrix
; =========================================================================`
  },
  {
    title: "Phase 3: Spatial Architecture & Town Zoning",
    shloka: "तन्मानं शास्त्रदृष्ट्यैव प्रामाणिकं भवेत् सदा । प्रस्तरं पाद्मकं चापि नगरविन्यासमध्वरे ॥ (मानसार ९.२)",
    eng: "Construct structural frameworks strictly based on geometric ratios. Deploy the Prastara 9x9 layout matrix to zone heavy smelting factories far away from civic residential coordinates.",
    hin: "स्थापत्य संरचना सदैव शास्त्रसम्मत अनुपातों में होनी चाहिए। कारखानों की सुरक्षा के लिए औद्योगिक क्षेत्रों को प्रस्तर ग्रिड (Prastara Grid) के तहत व्यवस्थित करें।",
    ori: "ସ୍ଥାପତ୍ୟ ସଂରଚନା ସଦା ଶାସ୍ତ୍ରସମ୍ମତ ଗାଣିତିକ ଅନୁପାତରେ ହେବା ଉଚିତ। କାରଖାନାର ସୁରକ୍ଷା ପାଇଁ ପ୍ରସ୍ତର ଗ୍ରିଡ୍ (Prastara 9x9 Grid) ଅନୁସାରେ ଶିଳ୍ପ ଜୋନ୍ ପ୍ରତିଷ୍ଠା କରନ୍ତୁ।",
    hud: "NODE: INDUSTRIAL ZONING\nINFRASTRUCTURE: MANASARA STRUCTURAL GRID\nTEMP CORE: 35 CELSIUS\nFLUX DENSITY: 14200.80 GAUSS (MAX ALIGNED)",
    gcode: "G00 X0.0 Y0.0 ; Reset axis alignment\nG01 X100.0 F1500 ; Cut boundary line edge for Production Zone A\nG01 Y100.0 ; Route line edge for Commerce Outflow Flank\nG01 X0.0 ;\nG01 Y0.0 ;\nM30 ; System execution successfully completed"
  }
];

export const MasterMatrixPlatform: React.FC = () => {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isExplodedViewActive, setIsExplodedViewActive] = useState<boolean>(false);
  const [terminalLog, setTerminalLog] = useState<string>(
    "> System online. Select a manuscript folio page to execute structural compilation logic..."
  );
  const [dronePlaying, setDronePlaying] = useState<boolean>(false);
  const [copiedGCode, setCopiedGCode] = useState<boolean>(false);

  const webglContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasGraphRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);
  const innerCrucibleRef = useRef<THREE.Mesh | null>(null);

  // References for Three.js animation
  const animStateRef = useRef({
    isExploded: false,
    activePageIndex: 0
  });

  useEffect(() => {
    animStateRef.current.isExploded = isExplodedViewActive;
    animStateRef.current.activePageIndex = activePageIndex;
  }, [isExplodedViewActive, activePageIndex]);

  // Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const toggleDrone = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (dronePlaying && droneNodesRef.current) {
      droneNodesRef.current.gain.gain.setValueAtTime(0, ctx.currentTime);
      droneNodesRef.current.osc.stop();
      droneNodesRef.current = null;
      setDronePlaying(false);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lp = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(108, ctx.currentTime); // 108Hz ancient resonant harmonic
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(320, ctx.currentTime);

      osc.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      droneNodesRef.current = { osc, gain };
      setDronePlaying(true);
    }
  };

  const playChime = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio Tone
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  };

  const playAlert = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  // Three.js and Graph Animation Loop
  useEffect(() => {
    if (!webglContainerRef.current || !canvasGraphRef.current) return;

    const frame = webglContainerRef.current;
    const graphCanvas = canvasGraphRef.current;
    const graphCtx = graphCanvas.getContext('2d');

    const width = frame.clientWidth || 550;
    const height = frame.clientHeight || 450;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060503);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 7, 13);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    frame.innerHTML = '';
    frame.appendChild(renderer.domElement);

    // Grid
    const industrialGrid = new THREE.GridHelper(12, 12, 0x7a001e, 0x3d230d);
    scene.add(industrialGrid);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const thermalLight = new THREE.PointLight(0xff5500, 2, 30);
    thermalLight.position.set(0, 2, 0);
    scene.add(thermalLight);

    // Assembly Group
    const plantGroup = new THREE.Group();
    scene.add(plantGroup);

    // Meshes
    const outerShell = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.2, 4, 32, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xb5651d, wireframe: true })
    );

    const innerCrucible = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 3, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4, metalness: 0.7 })
    );
    innerCrucible.position.y = -0.3;
    innerCrucibleRef.current = innerCrucible;

    const neoMagnet = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.1, metalness: 0.9 })
    );
    neoMagnet.position.y = 3.5;

    plantGroup.add(outerShell);
    plantGroup.add(innerCrucible);
    plantGroup.add(neoMagnet);

    // --- AUTONOMOUS MATERIAL HANDLING ROBOTIC ARM MODULE ---
    const roboticArmGroup = new THREE.Group();
    roboticArmGroup.position.set(3.2, -1.2, 0); // Positioned inside Zone B floor area

    const baseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.6, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    roboticArmGroup.add(baseMesh);

    const lowerLinkMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 2),
      new THREE.MeshStandardMaterial({ color: 0x114e8c, metalness: 0.6, roughness: 0.3 })
    );
    lowerLinkMesh.position.y = 1;
    lowerLinkMesh.rotation.z = 0.3;

    const lowerArmJoint = new THREE.Group();
    lowerArmJoint.add(lowerLinkMesh);

    const upperLinkMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.5),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
    );
    upperLinkMesh.position.set(-0.6, 2.2, 0);
    upperLinkMesh.rotation.z = -0.5;
    lowerArmJoint.add(upperLinkMesh);

    const gripperOre = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00ffcc, roughness: 0.2, metalness: 0.9 })
    );
    gripperOre.position.set(-1.2, 2.8, 0);
    lowerArmJoint.add(gripperOre);

    roboticArmGroup.add(lowerArmJoint);
    scene.add(roboticArmGroup);

    // Graph initialization
    let gW = graphCanvas.clientWidth || 450;
    let gH = graphCanvas.clientHeight || 150;
    graphCanvas.width = gW;
    graphCanvas.height = gH;

    const pointsHistory: number[] = [];
    let animationFrameId: number;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      plantGroup.rotation.y += 0.005;

      const isExploded = animStateRef.current.isExploded;
      const curPage = animStateRef.current.activePageIndex;

      // Lerp exploded positions
      if (isExploded) {
        outerShell.position.y = THREE.MathUtils.lerp(outerShell.position.y, 2.0, 0.05);
        innerCrucible.position.y = THREE.MathUtils.lerp(innerCrucible.position.y, -2.0, 0.05);
        neoMagnet.position.y = THREE.MathUtils.lerp(neoMagnet.position.y, 0.0, 0.05);
      } else {
        outerShell.position.y = THREE.MathUtils.lerp(outerShell.position.y, 0.0, 0.05);
        innerCrucible.position.y = THREE.MathUtils.lerp(innerCrucible.position.y, -0.3, 0.05);
        neoMagnet.position.y = THREE.MathUtils.lerp(neoMagnet.position.y, 3.5, 0.05);
      }

      // Robotic arm tracking simulation motion logic
      const timeFactor = Date.now() * 0.002;
      lowerArmJoint.rotation.y = Math.sin(timeFactor) * 0.4;
      lowerArmJoint.rotation.z = 0.3 + Math.cos(timeFactor) * 0.1;
      neoMagnet.rotation.y += 0.01;

      // Live Flux calculation
      const targetBase = curPage === 1 ? 8500 : curPage === 2 ? 14200 : 150;
      const noise = (Math.random() - 0.5) * 400;
      const ambientFlux = Math.max(0, targetBase + noise);

      // Graph rendering
      if (graphCtx) {
        pointsHistory.push(ambientFlux);
        if (pointsHistory.length > gW / 3) {
          pointsHistory.shift();
        }

        graphCtx.clearRect(0, 0, gW, gH);

        // Subgrid
        graphCtx.strokeStyle = 'rgba(122, 0, 30, 0.25)';
        graphCtx.lineWidth = 1;
        for (let i = 0; i < gW; i += 35) {
          graphCtx.beginPath();
          graphCtx.moveTo(i, 0);
          graphCtx.lineTo(i, gH);
          graphCtx.stroke();
        }

        // Vector line
        graphCtx.strokeStyle = '#00ffcc';
        graphCtx.lineWidth = 2.5;
        graphCtx.beginPath();
        for (let i = 0; i < pointsHistory.length; i++) {
          const y = gH - (pointsHistory[i] / 16000) * (gH - 20) - 10;
          const x = i * 3;
          if (i === 0) graphCtx.moveTo(x, y);
          else graphCtx.lineTo(x, y);
        }
        graphCtx.stroke();
      }

      renderer.render(scene, camera);
    };

    render();

    const handleResize = () => {
      if (!frame || !graphCanvas) return;
      const newW = frame.clientWidth;
      const newH = frame.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      gW = graphCanvas.clientWidth;
      gH = graphCanvas.clientHeight;
      graphCanvas.width = gW;
      graphCanvas.height = gH;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.osc.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  const handlePipelineNav = (dir: 'prev' | 'next') => {
    let nextIdx = activePageIndex;
    if (dir === 'next' && activePageIndex < manualPages.length - 1) {
      nextIdx = activePageIndex + 1;
    } else if (dir === 'prev' && activePageIndex > 0) {
      nextIdx = activePageIndex - 1;
    }
    setActivePageIndex(nextIdx);
    playChime();
    setTerminalLog(
      `> Swapped folio page view node to: ${manualPages[nextIdx].title}\n> Automated machine instructions calculated successfully. READY to map G-Code.`
    );
  };

  const handleToggleExploded = () => {
    setIsExplodedViewActive(prev => !prev);
    playAlert();
    setTerminalLog(
      `> Exploded View Model parameter toggled to: ${!isExplodedViewActive}\n> Re-arranging WebGL mesh structural assembly positions...`
    );
  };

  const handleCompileGCode = () => {
    playChime();
    const leaf = manualPages[activePageIndex];
    setTerminalLog(
      `> Executing Kautilya Production Factory API Compiler Module...\n> Realizing geometric layouts from Śilpaśāstra rules...\n\n[SUCCESS COMPILING CNC MACHINES DIRECTIVES]:\n${leaf.gcode}`
    );
  };

  const handleRunLoopAnalysis = () => {
    playChime();
    setTerminalLog(
      `> Initiating Real-time PID Feedback Loop Analysis...\n> Checking mechanical deviations against target parameters...\n\n[LOOP METRICS ANALYSIS SUCCESSFUL]:\n• Error drift checked within 0.05% tolerance (Current: 0.024%).\n• Automated industrial G-Code matrix generated and synced to CAD orchestration pipeline registers.\n• Robotic arm torque trajectory stable at 42.5 Nm.\n• Structural stress test factor validated: 1.48 Safety Margin.`
    );
  };

  const handleStructuralStressTest = () => {
    playAlert();
    if (innerCrucibleRef.current) {
      (innerCrucibleRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xff3333);
      setTimeout(() => {
        if (innerCrucibleRef.current) {
          (innerCrucibleRef.current.material as THREE.MeshStandardMaterial).color.setHex(0xd4af37);
        }
      }, 3500);
    }
    setTerminalLog(
      `> [STRUCTURAL STRESS TEST TRIGGERED]:\n• Peak Von-Mises Strain: 284.90 MPa across Musha inner refractory mantle.\n• Structural Stress Factor: 1.845 (Warning: Exceeds 1.20 nominal elastic boundary).\n• Audio Trip Alarm Triggered: Thermal shock resistance verified against Kudua blast gradient.`
    );
  };

  const currentPage = manualPages[activePageIndex];

  return (
    <div className="manuscript-container relative bg-gradient-to-b from-[#fffcf0] via-[#f9e7b9] to-[#e8c674] border-t-8 border-b-8 border-[#7a001e] rounded-xl p-4 sm:p-8 shadow-2xl text-[#1f1102]">
      {/* Traditional String-Binding Holes */}
      <div className="binding-hole hole-left absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#120700] border-3 border-[#7a001e] shadow-inner hidden md:block"></div>
      <div className="binding-hole hole-right absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#120700] border-3 border-[#7a001e] shadow-inner hidden md:block"></div>

      {/* Header bar */}
      <div className="text-center border-b-4 border-[#7a001e] pb-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
          <span className="text-xs uppercase font-cinzel font-bold text-[#7a001e] tracking-widest">
            Arthashastra Infrastructure Core · Master Production Matrix
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDrone}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                dronePlaying
                  ? 'bg-[#7a001e] text-white shadow-md'
                  : 'bg-[#d8c292] text-[#4a2608] hover:bg-[#c9b07a]'
              }`}
            >
              {dronePlaying ? <Volume2 className="w-3.5 h-3.5 text-[#39ff14] animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{dronePlaying ? '108Hz Drone Active' : 'Start 108Hz Drone'}</span>
            </button>
            <a
              href="/master_rasashastra.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#12355b] hover:bg-[#0c243f] text-white text-xs font-mono font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>master_rasashastra.html</span>
            </a>
            <a
              href="/final_matrix_app.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#800020] hover:bg-[#520115] text-white text-xs font-mono font-bold transition-colors border border-[#d4af37]/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00ffcc]" />
              <span>final_matrix_app.html</span>
            </a>
            <a
              href="/ultimate_app.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#aa1111] hover:bg-[#770000] text-white text-xs font-mono font-bold transition-colors border border-[#ffd285]/40"
            >
              <Flame className="w-3.5 h-3.5 text-[#ffd285]" />
              <span>ultimate_app.html</span>
            </a>
            <a
              href="/init_plant.sh"
              download="init_plant.sh"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1e4d2b] hover:bg-[#13351d] text-white text-xs font-mono font-bold transition-colors border border-[#8aff80]/40"
              title="Download Custom Local Deployment Shell Script"
            >
              <Terminal className="w-3.5 h-3.5 text-[#8aff80]" />
              <span>init_plant.sh</span>
            </a>
            <a
              href="/git_push_sync.sh"
              download="git_push_sync.sh"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#332255] hover:bg-[#221144] text-white text-xs font-mono font-bold transition-colors border border-[#c084fc]/40"
              title="Download Automated Repository Sync Pipeline Script"
            >
              <Terminal className="w-3.5 h-3.5 text-[#c084fc]" />
              <span>git_push_sync.sh</span>
            </a>
            <a
              href="/musha_core_machining.gcode"
              download="musha_core_machining.gcode"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#5a3200] hover:bg-[#3d2200] text-white text-xs font-mono font-bold transition-colors border border-[#ffd285]/40"
              title="Download ISO Metric Musha Core Machining G-Code"
            >
              <Terminal className="w-3.5 h-3.5 text-[#ffd285]" />
              <span>musha_core.gcode</span>
            </a>
            <a
              href="/nagarjuna_lab_suite.py"
              download="nagarjuna_lab_suite.py"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1b4332] hover:bg-[#112d21] text-white text-xs font-mono font-bold transition-colors border border-[#52b788]/40"
              title="Download Maharshi Nagarjuna Laboratory Testing Suite Python Script"
            >
              <Terminal className="w-3.5 h-3.5 text-[#52b788]" />
              <span>nagarjuna_lab.py</span>
            </a>
            <a
              href="/rasashastra_ci_cd.yml"
              download="rasashastra_ci_cd.yml"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#402060] hover:bg-[#2b1542] text-white text-xs font-mono font-bold transition-colors border border-[#c084fc]/40"
              title="Download GitHub Actions CI/CD Pipeline Workflow"
            >
              <Terminal className="w-3.5 h-3.5 text-[#c084fc]" />
              <span>ci_cd.yml</span>
            </a>
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-black font-cinzel text-[#7a001e] tracking-wider leading-tight">
          🇳🇵 Nepal-Bharat Rasashastra-AI: Sintering Platform 🇮🇳
        </h1>
        <p className="text-xs sm:text-sm text-[#542d10] font-cinzel italic mt-1">
          Interactive Graphic Novel Manual • Live WebGL CAD Simulation Framework • Zero-Asset Self-Contained Engine
        </p>
      </div>

      {/* Main Grid: 3D Stage + Vector Graph on Left; Sanskrit Treatise + G-Code on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: 3D Canvas + Realtime Graph */}
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full h-[440px] bg-[#080808] border-4 border-[#7a001e] rounded-lg relative overflow-hidden shadow-2xl">
            <div ref={webglContainerRef} className="w-full h-full"></div>

            {/* HUD Overlay */}
            <div className="absolute top-4 left-4 bg-[#050301]/85 border border-[#00ffcc] text-[#00ffcc] font-mono text-[11px] p-2.5 rounded pointer-events-none leading-relaxed shadow-lg">
              NODE: {currentPage.title.toUpperCase()}<br />
              STRUCTURAL GRID: MANASARA 9x9<br />
              FURNACE MATRIX: TEMP STABLE<br />
              MAGNETIC FLUX: {activePageIndex === 1 ? '8,500' : activePageIndex === 2 ? '14,200' : '150'} GAUSS
            </div>
          </div>

          {/* Real-time Vector Plotter */}
          <div className="w-full h-[160px] bg-[#0d0d0d] border-2 border-[#7a001e] rounded-lg relative p-2 shadow-inner">
            <div className="absolute top-2 right-3 text-[#ffaa00] font-mono text-[11px] z-10 font-bold">
              Realtime Flux Density Plotter (Gauss / Sintering Temp)
            </div>
            <canvas ref={canvasGraphRef} className="w-full h-full block"></canvas>
          </div>
        </div>

        {/* Right column: Folio & Treatises + Controls + Terminal */}
        <div className="lg:col-span-5 bg-white/45 border border-[#7a001e]/30 rounded-lg p-5 flex flex-col justify-between shadow-md space-y-4">
          <div>
            <div className="border-b-2 border-[#7a001e]/20 pb-2 mb-3">
              <span className="text-[10px] uppercase font-mono font-bold text-[#8a4e1a]">
                Manuscript Folio {activePageIndex + 1} of {manualPages.length}
              </span>
              <h3 className="text-lg font-bold font-cinzel text-[#7a001e] mt-0.5 leading-tight">
                {currentPage.title}
              </h3>
            </div>

            {/* Sacred Shloka Box */}
            <div className="bg-[#7a001e]/10 border-l-4 border-[#7a001e] p-3 rounded-r-lg mb-3">
              <span className="text-sm sm:text-base font-bold font-devanagari text-[#7a001e] block leading-relaxed">
                "{currentPage.shloka}"
              </span>
            </div>

            {/* Multi-language Translation Container */}
            <div className="space-y-2 text-xs">
              <div>
                <h4 className="font-mono font-bold text-[10px] text-[#4a2608] uppercase tracking-wider">
                  🌐 English Translation:
                </h4>
                <p className="text-[#2b180d] leading-relaxed">
                  {currentPage.eng}
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-[10px] text-[#4a2608] uppercase tracking-wider">
                  🕉️ Hindi Translation:
                </h4>
                <p className="text-[#2b180d] font-devanagari leading-relaxed">
                  {currentPage.hin}
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-[10px] text-[#4a2608] uppercase tracking-wider">
                  🌾 Odia Translation (ଓଡ଼ିଆ ଅନୁବାଦ):
                </h4>
                <p className="text-[#2b180d] leading-relaxed font-semibold">
                  {currentPage.ori}
                </p>
              </div>
            </div>

            {/* Numerical Data Systems Real-time Log Frame */}
            <div className="bg-[#111] text-[#33ff33] font-mono text-[11px] p-2.5 rounded border border-[#333] space-y-1 mt-3">
              <div className="flex items-center justify-between text-[#d4af37] font-bold border-b border-[#333] pb-1">
                <span>📊 Real-time Numerical System Logs:</span>
                <span className="text-[10px] text-[#00ffcc]">LOOP STATUS: ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[10px]">
                <div>• PID Error Drift: <span className="text-[#39ff14] font-bold">{activePageIndex === 1 ? '0.024%' : activePageIndex === 2 ? '0.001%' : '0.000%'}</span></div>
                <div>• Target Flux: <span className="text-[#39ff14] font-bold">{activePageIndex === 1 ? '8,500 G' : activePageIndex === 2 ? '14,200 G' : '0 G'}</span></div>
                <div>• Joint Torque: <span className="text-[#e2a84d] font-bold">{activePageIndex === 1 ? '42.5 Nm' : activePageIndex === 2 ? '5.0 Nm' : '12.1 Nm'}</span></div>
                <div>• Stress Margin: <span className="text-[#00ffcc] font-bold">{activePageIndex === 1 ? '1.48 Coeff' : activePageIndex === 2 ? '2.10 Coeff' : '1.92 Coeff'}</span></div>
              </div>
            </div>
          </div>

          {/* Action Management Controls */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handlePipelineNav('prev')}
                disabled={activePageIndex === 0}
                className="bg-[#7a001e] hover:bg-[#540015] disabled:opacity-50 text-white py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider shadow transition-all"
              >
                ← Prev Folio
              </button>
              <button
                onClick={() => handlePipelineNav('next')}
                disabled={activePageIndex === manualPages.length - 1}
                className="bg-[#7a001e] hover:bg-[#540015] disabled:opacity-50 text-white py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider shadow transition-all"
              >
                Next Folio →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleToggleExploded}
                className="bg-[#12355b] hover:bg-[#0c243f] text-white py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isExplodedViewActive ? 'Assemble 3D' : 'Explode 3D View'}</span>
              </button>

              <button
                onClick={handleCompileGCode}
                className="bg-[#966907] hover:bg-[#704e05] text-white py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Compile G-Code</span>
              </button>
            </div>

            <button
              onClick={handleRunLoopAnalysis}
              className="w-full bg-[#124e8c] hover:bg-[#0b345e] text-white py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00ffcc]" />
              <span>Execute Loop Analysis & Sync CAD (ଲୁପ୍ ଆନାଲିସିସ୍)</span>
            </button>

            <button
              onClick={handleStructuralStressTest}
              className="w-full bg-[#aa1111] hover:bg-[#770000] text-white py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-[#ffdd88] animate-pulse" />
              <span>Execute Real-time Structural Stress Test (ଷ୍ଟ୍ରକଚରାଲ୍ ଷ୍ଟ୍ରେସ୍ ଟେଷ୍ଟ)</span>
            </button>

            {/* Terminal Stream Output */}
            <div className="bg-[#0a0a0a] text-[#33ff33] font-mono text-xs p-3 rounded border-2 border-[#222] h-28 overflow-y-auto whitespace-pre-wrap shadow-inner">
              {terminalLog}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
