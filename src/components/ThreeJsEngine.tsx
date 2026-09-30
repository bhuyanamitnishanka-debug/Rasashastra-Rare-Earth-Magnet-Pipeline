import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, Pause, Rotate3d, Flame, Activity, Compass, 
  Terminal, ShieldCheck, Zap, Download, RefreshCw, Volume2, VolumeX, Sparkles 
} from 'lucide-react';

export const ThreeJsEngine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Simulation State
  const [currentStageIndex, setCurrentStageIndex] = useState(1);
  const [temperature, setTemperature] = useState(1380); // Celsius
  const [isRotating, setIsRotating] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [soundEffectOn, setSoundEffectOn] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string>(
    "> Three.js WebGL Engine Initialized.\n> Kudua Blast Furnace Geometry Loaded.\n> Mānasāra 9x9 Prastara Grid Calibrated."
  );

  // Audio Context Ref for Sintering / Furnace Hum & Magnetic Pulse
  const audioCtxRef = useRef<AudioContext | null>(null);
  const furnaceSoundNodes = useRef<{ osc: OscillatorNode; noiseNode: AudioBufferSourceNode; gain: GainNode } | null>(null);

  // Classical Multi-Language Shloka & Pipeline Matrix
  const pipelineStages = [
    {
      title: "Phase 1: Sourcing & Akaradhyaksha Authority",
      devanagari: "आकराध्यक्ष अधिकार एवं खनिज चयन",
      shloka: "आकराध्यक्षः खनिशास्त्रमणिरसधातुपरीक्षाक्षस्तज्ज्ञसखो वा ... कर्मान्तं कारयेत् ॥ (अर्थशास्त्र २.१୨.१)",
      eng: "The Superintendent of Mines (Akaradhyaksha) must manage raw mineral veins, Neodymium processing nodes, and complex metallurgy infrastructure with certified experts.",
      hin: "खदान प्रमुख (आकराध्यक्ष) को भूविज्ञान, खनिजों और धातुकर्म के विशेषज्ञों के साथ मिलकर ही दुर्लभ-मृत्तिका (Rare-Earth) विनिर्माण कारखानों को स्थापित करना चाहिए।",
      ori: "ଖଣି ବିଭାଗର ମୁଖ୍ୟ (ଆକରାଧ୍ୟକ୍ଷ) ଭୂବିଜ୍ଞାନ ଓ ଧାତୁ ଶୋଧନ ବିଶେଷଜ୍ଞମାନଙ୍କ ସହିତ ମିଳିତ ହୋଇ ଦୁର୍ଲଭ ଖଣିଜ (Rare-Earth) ପ୍ରସଂସ୍କରଣ କାରଖାନା ପ୍ରତିଷ୍ଠା କରିବା ଆବଶ୍ୟକ।",
      hud: "SYSTEM: ORE ACQUISITION ACTIVE\nDEPARTMENT: AKARADHYAKSHA MATRIX\nINPUT: NEODYMIUM-SAMARIUM COMPLEX ORE\nLATTICE: RAW BASTNÄSITE",
      gcode: "G21 ; Millimeters alignment\nG90 ; Absolute coordinates\nG00 X10.0 Y10.0 Z5.0 ; Rapid approach to Ore Sorting Area Grid\nG01 Z-2.0 F300 ; Engage extraction separation\nM05 ; Hold segment",
      dxfEntity: "0\nCIRCLE\n8\nOre_Intake_Southwest\n10\n15.0\n20\n15.0\n40\n10.0\n",
      targetTemp: 600,
      fluxGauss: 420
    },
    {
      title: "Phase 2: Thermal Matrix Sintering (Kudua Furnace)",
      devanagari: "कुडुवा भट्टी एवं तापीय सिन्टरिंग",
      shloka: "सर्वषां लोहजातानां रसराजो महाबलः । करोति लोहसिद्धिं च तस्माद्रस इति स्मृतः ॥ (रसरत्नसमुच्चयः १.४)",
      eng: "Mercury and elemental chemical essences drive absolute metallic synthesis; apply thermal metrics inside the Kudua Blast Furnace to process the crystal blocks.",
      hin: "सभी धातुओं और रासायनिक तत्त्वों में रसराज महाबलशाली है। धातुओं को स्थिरता प्रदान करने हेतु कुडुआ भट्टी के भीतर उच्च तापीय प्रद्रवण (Sintering) कार्य करें।",
      ori: "ସମସ୍ତ ଧାତୁ ଓ ରସାୟନ ମଧ୍ୟରେ ରସରାଜ ମହାବଳଶାଳୀ ଅଟେ। ଧାତୁକୁ ସିଦ୍ଧି ଓ ସ୍ଥିରତା ପ୍ରଦାନ କରିବା ପାଇଁ କୁଡୁଆ ଭାଟି (Blast Furnace) ମଧ୍ୟରେ ଉଚ୍ଚ ତାପମାତ୍ରା ପ୍ରୋଟୋକଲ୍ ପ୍ରୟୋଗ କରନ୍ତୁ।",
      hud: "SYSTEM: THERMAL SINTERING ACTIVE\nUNIT: KUDUA BLAST FURNACE CORE\nTEMPERATURE: 1380°C (OPTIMAL ARREST)\nPHASE: EUTECTIC LIQUID WETTING",
      gcode: "M03 S14000 ; Spin up Induction Furnace coils\nG00 X45.0 Y45.0 Z10.0 ; Center focus over Kudua Crucible chamber\nG01 Z-15.0 F150 ; Lower Neodymium compound block into high thermal zone\nG04 P5000 ; Dwell for structural melting matrix\nG00 Z20.0 ; Retract core node",
      dxfEntity: "0\nCIRCLE\n8\nKudua_Furnace_Core\n10\n45.0\n20\n45.0\n40\n15.0\n",
      targetTemp: 1380,
      fluxGauss: 14500
    },
    {
      title: "Phase 3: Spatial Architecture (Mānasāra Grid Layout)",
      devanagari: "मानसार प्रस्तार ९x९ ग्रिड विन्यास",
      shloka: "तन्मानं शास्त्रदृष्ट्यैव प्रामाणिकं भवेत् सदा । प्रस्तरं पाद्मकं चापि नगरविन्यासमध्वरे ॥ (मानसार शिल्पशास्त्र ९.२)",
      eng: "Construct structural frameworks strictly according to scientific spatial ratios. Deploy the Prastara 9x9 layout to zone industrial workshops away from civic sectors.",
      hin: "स्थापत्य संरचना सदैव शास्त्रसम्मत अनुपातों में होनी चाहिए। कारखानों की सुरक्षा के लिए औद्योगिक क्षेत्रों को प्रस्तर ग्रिड (Prastara Grid) के तहत व्यवस्थित करें।",
      ori: "ସ୍ଥାପତ୍ୟ ସଂରଚନା ସଦା ଶାସ୍ତ୍ରସମ୍ମତ ଗାଣିତିକ ଅନୁପାତରେ ହେବା ଉଚିତ। କାରଖାନାର ସୁରକ୍ଷା ପାଇଁ ପ୍ରସ୍ତର ଗ୍ରିଡ୍ (Prastara 9x9 Grid) ଅନୁସାରେ ଶିଳ୍ପ ଜୋନ୍ ପ୍ରତିଷ୍ଠା କରନ୍ତୁ।",
      hud: "SYSTEM: INFRASTRUCTURE ALIGNMENT\nLAYOUT: MANASARA PRASTARA (9x9) MODE\nSTRUCTURAL INTEGRITY: 100% BALANCED\nSEISMIC DAMPING: ACTIVE",
      gcode: "G00 X0.0 Y0.0 ; Target grid reference origin\nG01 X90.0 F1200 ; Mill out Eastern Boundary Line (Zone A)\nG01 Y90.0 ; Mill out Northern Commerce Flank (Zone D)\nG01 X0.0 ;\nG01 Y0.0 ;\nM30 ; System layout block finished",
      dxfEntity: "0\nLINE\n8\nOuter_Plant_Wall\n10\n0.0\n20\n0.0\n11\n90.0\n21\n90.0\n",
      targetTemp: 1080,
      fluxGauss: 14800
    }
  ];

  // Calculated Real-Time Magnetic Flux Metrics based on Temperature
  const currentStage = pipelineStages[currentStageIndex];
  const fluxDensityTesla = Number(Math.min(1.48, (temperature / 1380) * 1.45).toFixed(2));
  const fluxDensityGauss = Math.round(fluxDensityTesla * 10000);
  const coercivityHcj = Number(Math.min(32, (temperature / 1250) * 28.5).toFixed(1));
  const energyProductBHmax = Number(Math.min(54, 52 * Math.pow(fluxDensityTesla / 1.45, 2)).toFixed(1));

  // Sound Effect Engine (Synthesis via Web Audio API)
  const toggleSound = () => {
    if (!soundEffectOn) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Low combustion rumble oscillator
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);

        // White noise generator for blast furnace air hiss
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(600, ctx.currentTime);
        noiseFilter.Q.setValueAtTime(3.0, ctx.currentTime);

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc.connect(filter);
        filter.connect(masterGain);
        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc.start();
        whiteNoise.start();

        furnaceSoundNodes.current = { osc, noiseNode: whiteNoise, gain: masterGain };
        setSoundEffectOn(true);
      } catch (err) {
        console.error("Audio synthesis failed", err);
      }
    } else {
      if (furnaceSoundNodes.current) {
        try {
          furnaceSoundNodes.current.osc.stop();
          furnaceSoundNodes.current.noiseNode.stop();
          furnaceSoundNodes.current.osc.disconnect();
          furnaceSoundNodes.current.noiseNode.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
      setSoundEffectOn(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // --- THREE.JS 3D WEBGL GRAPHICS SETUP ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0602);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(6, 6, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Clear previous canvases if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Grid System: Mānasāra Prastara (9x9) Red & Amber Framework Grid
    const baseGrid = new THREE.GridHelper(10, 9, 0x800020, 0x54361e);
    scene.add(baseGrid);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffaa44, 2.5, 60);
    pointLight.position.set(5, 8, 5);
    scene.add(pointLight);

    // Central Assembly Group
    const industrialGroup = new THREE.Group();
    scene.add(industrialGroup);

    // 1. Outer Kudua Furnace Shell (Wireframe Terracotta & Bronze)
    const shellGeo = new THREE.CylinderGeometry(1.6, 2.1, 3.5, 32, 1, true);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xcd7f32,
      wireframe: true,
      emissive: 0x552200
    });
    const outerFurnaceMesh = new THREE.Mesh(shellGeo, shellMat);
    industrialGroup.add(outerFurnaceMesh);

    // 2. High-Alumina Musha Crucible Core (Inner Reaction Vessel)
    const crucibleGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.5, 24);
    const crucibleMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.7
    });
    const innerCrucibleMesh = new THREE.Mesh(crucibleGeo, crucibleMat);
    innerCrucibleMesh.position.y = -0.2;
    industrialGroup.add(innerCrucibleMesh);

    // 3. Sintered Neodymium Magnet Block (Nd2Fe14B Tetragonal Crystal)
    const magnetGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const magnetMat = new THREE.MeshStandardMaterial({
      color: 0x11ffcc,
      roughness: 0.15,
      metalness: 0.9
    });
    const magnetBlockMesh = new THREE.Mesh(magnetGeo, magnetMat);
    magnetBlockMesh.position.set(0, isExploded ? 3.0 : 0.6, 0);
    industrialGroup.add(magnetBlockMesh);

    // 4. Magnetic Dipole Vector Arrows (North = Red, South = Blue)
    const arrowDir = new THREE.Vector3(0, 1, 0);
    const arrowOrigin = new THREE.Vector3(0, 0, 0);
    const arrowHelper = new THREE.ArrowHelper(arrowDir, arrowOrigin, 1.8, 0xef4444, 0.4, 0.25);
    magnetBlockMesh.add(arrowHelper);

    // 5. Surrounding Magnetic Flux Induction Torus Rings
    const torusGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
    const fluxRing1 = new THREE.Mesh(torusGeo, torusMat);
    fluxRing1.rotation.x = Math.PI / 2;
    industrialGroup.add(fluxRing1);

    const fluxRing2 = new THREE.Mesh(torusGeo, torusMat);
    fluxRing2.rotation.x = Math.PI / 2.3;
    fluxRing2.position.y = 1.0;
    industrialGroup.add(fluxRing2);

    // Animation Render Processing Engine Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous rotation
      if (isRotating) {
        industrialGroup.rotation.y += 0.007;
      }

      // Context-aware dynamic visual transformation animation logic
      if (currentStageIndex === 1) {
        // High Thermal Sintering Phase: Crucible glows fiery orange/red with temperature breathing
        const heatRatio = Math.min(1.0, temperature / 1450);
        innerCrucibleMesh.material.emissive.setRGB(
          heatRatio * 0.9 + 0.1 * Math.sin(elapsedTime * 4),
          heatRatio * 0.3 * Math.abs(Math.sin(elapsedTime * 3)),
          0.02
        );
        magnetBlockMesh.material.color.setRGB(
          0.1 + 0.8 * heatRatio,
          0.9 * (1 - heatRatio * 0.5),
          1.0 * (1 - heatRatio * 0.7)
        );

        // Smooth vertical oscillation
        if (!isExploded) {
          magnetBlockMesh.position.y = 0.5 + 0.25 * Math.sin(elapsedTime * 2.5);
        }
      } else {
        innerCrucibleMesh.material.emissive.setRGB(0.1, 0.05, 0.0);
        magnetBlockMesh.material.color.setHex(0x11ffcc);
        if (!isExploded) {
          magnetBlockMesh.position.y = 0.6;
        }
      }

      // Exploded state position interpolation
      const targetY = isExploded ? 3.0 : (currentStageIndex === 1 ? 0.5 : 0.6);
      magnetBlockMesh.position.y += (targetY - magnetBlockMesh.position.y) * 0.08;

      // Pulse flux rings
      fluxRing1.rotation.z += 0.01;
      fluxRing2.rotation.z -= 0.012;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [currentStageIndex, isRotating, isExploded, temperature]);

  const switchStage = (dir: 'next' | 'prev') => {
    let nextIdx = currentStageIndex;
    if (dir === 'next' && currentStageIndex < pipelineStages.length - 1) {
      nextIdx = currentStageIndex + 1;
    } else if (dir === 'prev' && currentStageIndex > 0) {
      nextIdx = currentStageIndex - 1;
    }

    setCurrentStageIndex(nextIdx);
    const st = pipelineStages[nextIdx];
    setTemperature(st.targetTemp);

    const logEntry = `> Transitioned to: ${st.title}\n> Shloka Authority: ${st.shloka}\n> G-Code Matrix & DXF Vector updated for current workspace node.`;
    setTerminalOutput(logEntry);
  };

  const handleCompileGCode = () => {
    const st = pipelineStages[currentStageIndex];
    setTerminalOutput(
      `> Initializing Kautilya Factory API Compiler...\n> Fetching layout vectors according to Manasara manual rules...\n\n[OUTPUT AUTOMATION VECTOR MATRIX - ISO 6983 G-CODE]:\n${st.gcode}\n\n[DXF VECTOR CAD ENTITY]:\n${st.dxfEntity}`
    );
  };

  const handleDownloadDXF = () => {
    const st = pipelineStages[currentStageIndex];
    const dxfContent = `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${st.dxfEntity}0\nENDSEC\n0\nEOF\n`;
    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rasashastra_manasara_stage_${currentStageIndex + 1}.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
      {/* Decorative Talapatra string holes */}
      <div className="absolute top-4 left-8 palm-leaf-hole hidden sm:block opacity-75"></div>
      <div className="absolute top-4 right-8 palm-leaf-hole hidden sm:block opacity-75"></div>

      {/* Header matching user prompt */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              Three.js WebGL 3D Simulation & G-Code Engine
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              ଥ୍ରୀ.ଜେଏସ୍ ୩D ପ୍ଲାଣ୍ଟ୍ ଇଞ୍ଜିନ୍
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            🇳🇵 Nepal-Bharat Neodymium Processing Engine (3D WebGL) 🇮🇳
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Arthashastra Factory Infrastructure Matrix & Sintered Magnetic Architecture Pipeline
          </p>
        </div>

        {/* Ambient & Sound Effect Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              soundEffectOn
                ? 'bg-[#7a2e12] text-white border-[#541e0b] shadow-[0_0_10px_rgba(122,46,18,0.4)]'
                : 'bg-[#ebd4b0] text-[#4d280e] hover:bg-[#dec299] border-[#a87037]'
            }`}
            title="Toggle realistic Kudua blast furnace combustion & air blast sound"
          >
            {soundEffectOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEffectOn ? 'Furnace Audio: Live' : 'Furnace Audio: Mute'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 3D Three.js WebGL Viewport */}
        <div className="lg:col-span-7 bg-[#0c0c0c] rounded-xl border-4 border-[#800020] p-2 relative shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* HUD Overlay matching user script */}
          <div className="absolute top-4 left-4 z-10 bg-black/80 border border-[#00ffcc] text-[#00ffcc] font-mono text-[11px] p-2.5 rounded-lg shadow-lg pointer-events-none leading-relaxed">
            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00ffcc] animate-ping"></span>
              <span>LIVE THREE.JS WEBGL RENDERER</span>
            </div>
            {currentStage.hud.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            <div className="mt-1 pt-1 border-t border-[#00ffcc]/40 text-[#ffaa44]">
              FLUX DENSITY: <strong>{fluxDensityTesla} T ({fluxDensityGauss} Gauss)</strong>
            </div>
          </div>

          {/* Three.js Container Mount */}
          <div ref={containerRef} className="w-full h-[440px] cursor-grab active:cursor-grabbing select-none" />

          {/* Viewport Control Bar */}
          <div className="bg-[#1a1008] border-t border-[#542d13] p-2.5 rounded-b-lg flex flex-wrap items-center justify-between gap-3 text-xs text-[#ebd4b0]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                  isRotating ? 'bg-[#7a2e12] text-white border-[#541e0b]' : 'bg-[#3b2313] text-[#ebd4b0] border-[#6b3e18]'
                }`}
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>Auto-Spin</span>
              </button>

              <button
                onClick={() => setIsExploded(!isExploded)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                  isExploded ? 'bg-[#800020] text-white border-[#540015]' : 'bg-[#3b2313] text-[#ebd4b0] border-[#6b3e18]'
                }`}
              >
                <Rotate3d className="w-3.5 h-3.5" />
                <span>{isExploded ? 'Exploded: ON' : 'Exploded: OFF'}</span>
              </button>
            </div>

            {/* Temperature Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px] justify-end">
              <Flame className="w-4 h-4 text-[#ff773d]" />
              <span className="font-semibold text-xs text-[#ffaa44]">Temp:</span>
              <input
                type="range"
                min="500"
                max="1550"
                step="10"
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-28 sm:w-36 h-2 bg-[#52331b] rounded-lg appearance-none cursor-pointer accent-[#ff773d]"
              />
              <span className="font-mono text-xs font-bold text-[#ffaa44] min-w-[50px]">{temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Shloka & Multi-Language Translation Stack */}
        <div className="lg:col-span-5 bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-4 shadow-md flex flex-col justify-between h-full space-y-3.5 text-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[#a86e30]/40 pb-2 mb-2">
              <span className="font-cinzel font-bold text-[#7a390e] uppercase">
                {currentStage.title}
              </span>
              <span className="text-[10px] font-mono bg-[#ebd4b0] px-2 py-0.5 rounded text-[#592c0c] border border-[#b8803d]">
                Stage {currentStageIndex + 1} of 3
              </span>
            </div>

            {/* Sacred Shloka Card */}
            <div className="bg-[#800020]/10 border-l-4 border-[#800020] p-3 rounded-r-lg mb-3">
              <span className="text-[10px] uppercase font-bold text-[#800020] block mb-0.5 font-cinzel">
                मूल संस्कृत सूत्र (Rasashastra / Arthashastra Authority)
              </span>
              <p className="text-sm font-devanagari font-bold text-[#451f08] leading-relaxed">
                "{currentStage.shloka}"
              </p>
            </div>

            {/* Tri-Lingual Translations */}
            <div className="space-y-2 text-[#3b200b]">
              <div className="bg-[#f0dfbe] p-2.5 rounded-lg border border-[#c99a5e]/50">
                <span className="text-[10px] uppercase font-bold text-[#7a390e] block mb-0.5">
                  🌾 ଓଡ଼ିଆ ଅନୁବାଦ (Odia Translation)
                </span>
                <p className="font-serif leading-relaxed text-[#2d1708]">
                  {currentStage.ori}
                </p>
              </div>

              <div className="bg-[#f0dfbe] p-2.5 rounded-lg border border-[#c99a5e]/50">
                <span className="text-[10px] uppercase font-bold text-[#7a390e] block mb-0.5">
                  🕉️ हिन्दी अनुवाद (Hindi Translation)
                </span>
                <p className="font-devanagari leading-relaxed text-[#2d1708]">
                  {currentStage.hin}
                </p>
              </div>

              <div className="bg-[#f0dfbe] p-2.5 rounded-lg border border-[#c99a5e]/50">
                <span className="text-[10px] uppercase font-bold text-[#7a390e] block mb-0.5">
                  🌐 English Translation
                </span>
                <p className="font-sans leading-relaxed text-[#2d1708]">
                  {currentStage.eng}
                </p>
              </div>
            </div>

            {/* Real-time Magnetic Density Stat Box */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#a86e30]/40 text-center">
              <div className="bg-[#ebd9b5] p-2 rounded border border-[#c48f4e]/60">
                <span className="text-[9px] uppercase font-bold text-[#7a390e] block">Flux Density (B)</span>
                <span className="text-sm font-mono font-bold text-[#8c2a0d]">{fluxDensityTesla} T</span>
              </div>
              <div className="bg-[#ebd9b5] p-2 rounded border border-[#c48f4e]/60">
                <span className="text-[9px] uppercase font-bold text-[#7a390e] block">Coercivity (Hcj)</span>
                <span className="text-sm font-mono font-bold text-[#8c2a0d]">{coercivityHcj} kOe</span>
              </div>
              <div className="bg-[#ebd9b5] p-2 rounded border border-[#c48f4e]/60">
                <span className="text-[9px] uppercase font-bold text-[#7a390e] block">(BH)max</span>
                <span className="text-sm font-mono font-bold text-[#8c2a0d]">{energyProductBHmax} MGOe</span>
              </div>
            </div>
          </div>

          {/* Pipeline stage controls */}
          <div className="pt-2 border-t border-[#a86e30]/40 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => switchStage('prev')}
                disabled={currentStageIndex === 0}
                className="py-2 bg-[#800020] hover:bg-[#580016] disabled:opacity-40 text-white font-semibold rounded-lg text-center transition-all"
              >
                ← Previous Stage
              </button>
              <button
                onClick={() => switchStage('next')}
                disabled={currentStageIndex === pipelineStages.length - 1}
                className="py-2 bg-[#800020] hover:bg-[#580016] disabled:opacity-40 text-white font-semibold rounded-lg text-center transition-all"
              >
                Next Pipeline →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCompileGCode}
                className="py-2 bg-[#0b4f8c] hover:bg-[#07355e] text-white font-semibold rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Compile G-Code</span>
              </button>
              <button
                onClick={handleDownloadDXF}
                className="py-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold rounded-lg text-center transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .DXF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Code Console Terminal Box */}
        <div className="lg:col-span-12 bg-[#121212] text-[#33ff33] font-mono text-xs p-4 rounded-xl border-2 border-[#333] shadow-inner max-h-44 overflow-y-auto select-all">
          <div className="flex items-center justify-between text-[11px] text-[#888] pb-1.5 mb-2 border-b border-[#333]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>RASASHASTRA-AI REAL-TIME G-CODE / DXF COMPILER CONSOLE</span>
            </span>
            <span className="text-[10px]">ISO 6983 G-Code | AutoCAD DXF Release 14</span>
          </div>
          <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
        </div>
      </div>
    </div>
  );
};
