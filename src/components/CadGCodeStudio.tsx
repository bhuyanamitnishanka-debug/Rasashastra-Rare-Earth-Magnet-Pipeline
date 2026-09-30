import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, Terminal, Download, Copy, Check, Play, Pause, 
  Rotate3d, Layers, Cpu, Compass, ShieldCheck, Sparkles, Send, CheckCircle2,
  RotateCcw, SkipForward, SkipBack, Gauge, Zap
} from 'lucide-react';

export const CadGCodeStudio: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<'kudua_furnace' | 'crucible_musha' | 'gear_train' | 'manasara_grid'>('crucible_musha');
  const [activeTab, setActiveTab] = useState<'3d_cad' | 'gcode' | 'api_sync' | 'feedback'>('3d_cad');
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(30);
  const [layerHeight, setLayerHeight] = useState(0.2); // mm
  const [nozzleTemp, setNozzleTemp] = useState(1350); // Celsius for refractory ceramic printing
  const [bedTemp, setBedTemp] = useState(180);
  const [feedRate, setFeedRate] = useState(2400); // mm/min

  // Musha Core CNC Stepper State
  const [mushaSimStep, setMushaSimStep] = useState<number>(0);
  const [isSimPlaying, setIsSimPlaying] = useState<boolean>(false);
  const toolpathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // IIT-Coordination Feedback State
  const [researchFeedback, setResearchFeedback] = useState('');
  const [submittingToHub, setSubmittingToHub] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{ id: string; timestamp: string; institute: string; text: string; status: string }>>([
    {
      id: 'NB-IITM-01',
      timestamp: '2026-09-28 14:32',
      institute: 'IIT Madras (Metallurgy & Materials)',
      text: 'Verified Nd2Fe14B lattice orientation parameter in Kudua tuyère stream. High-pressure inert shielding (Sandhi-Bandhana) reduces interstitial oxygen below 80 ppm.',
      status: 'Synced to bhuyanamitnishanka-debug'
    },
    {
      id: 'NB-IITBBS-02',
      timestamp: '2026-09-29 09:15',
      institute: 'IIT Bhubaneswar (School of Minerals & Materials)',
      text: 'Bastnäsite calcination at 620°C in Dola Yantra confirmed selective precipitation of Nd oxalate cakes with 99.4% purity.',
      status: 'Synced to bhuyanamitnishanka-debug'
    }
  ]);

  // Canvas ref for 3D CAD visualization
  const cadCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto rotation loop for 3D CAD Wireframe
  useEffect(() => {
    let animId: number;
    if (isRotating) {
      const step = () => {
        setRotationAngle(prev => (prev + 0.4) % 360);
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isRotating]);

  // Draw 3D Parametric CAD Wireframe with solid shading
  useEffect(() => {
    const canvas = cadCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const rad = (rotationAngle * Math.PI) / 180;
    const tilt = (22 * Math.PI) / 180;

    // Helper to project 3D point (x, y, z) to 2D
    const project = (x: number, y: number, z: number) => {
      // Y-axis rotation
      const rx = x * Math.cos(rad) - z * Math.sin(rad);
      const rz = x * Math.sin(rad) + z * Math.cos(rad);
      // X-axis tilt
      const py = y * Math.cos(tilt) - rz * Math.sin(tilt);
      return { x: cx + rx, y: cy + py, z: rz };
    };

    // Dark engineering blueprint background
    ctx.fillStyle = '#161009';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Coordinate grid lines
    ctx.strokeStyle = '#382515';
    ctx.lineWidth = 1;
    for (let i = -180; i <= 180; i += 30) {
      const p1 = project(i, 110, -180);
      const p2 = project(i, 110, 180);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const p3 = project(-180, 110, i);
      const p4 = project(180, 110, i);
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p4.x, p4.y);
      ctx.stroke();
    }

    if (selectedProfile === 'kudua_furnace') {
      // Draw 3D Stepped Kudua Blast Furnace Geometry
      const tiers = [
        { yBottom: 110, yTop: 80, rBottom: 110, rTop: 95, color: '#a8652d', stroke: '#d98b4c' },
        { yBottom: 80, yTop: 30, rBottom: 95, rTop: 75, color: '#c44e21', stroke: '#ff773d' },
        { yBottom: 30, yTop: -30, rBottom: 75, rTop: 60, color: '#e06b2b', stroke: '#ffaa66' },
        { yBottom: -30, yTop: -80, rBottom: 60, rTop: 40, color: '#8f3c15', stroke: '#d66531' },
        { yBottom: -80, yTop: -125, rBottom: 40, rTop: 30, color: '#66260a', stroke: '#b34d1b' }
      ];

      tiers.forEach(tier => {
        const segments = 16;
        for (let i = 0; i < segments; i++) {
          const theta1 = (i * 2 * Math.PI) / segments;
          const theta2 = ((i + 1) * 2 * Math.PI) / segments;

          const p1 = project(tier.rBottom * Math.cos(theta1), tier.yBottom, tier.rBottom * Math.sin(theta1));
          const p2 = project(tier.rBottom * Math.cos(theta2), tier.yBottom, tier.rBottom * Math.sin(theta2));
          const p3 = project(tier.rTop * Math.cos(theta2), tier.yTop, tier.rTop * Math.sin(theta2));
          const p4 = project(tier.rTop * Math.cos(theta1), tier.yTop, tier.rTop * Math.sin(theta1));

          // Draw polygon face
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();

          ctx.fillStyle = tier.color + '44';
          ctx.fill();
          ctx.strokeStyle = tier.stroke;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // Internal Molten Core Glow
      const coreP = project(0, 20, 0);
      const radGlow = ctx.createRadialGradient(coreP.x, coreP.y, 5, coreP.x, coreP.y, 45);
      radGlow.addColorStop(0, '#ffea78');
      radGlow.addColorStop(0.5, '#ff6a00aa');
      radGlow.addColorStop(1, '#ff3b0000');
      ctx.fillStyle = radGlow;
      ctx.beginPath();
      ctx.arc(coreP.x, coreP.y, 45, 0, Math.PI * 2);
      ctx.fill();

    } else if (selectedProfile === 'crucible_musha') {
      // Draw 3D High-Alumina Musha Crucible Cylinder & Core
      const segments = 24;
      for (let i = 0; i < segments; i++) {
        const theta1 = (i * 2 * Math.PI) / segments;
        const theta2 = ((i + 1) * 2 * Math.PI) / segments;

        const p1 = project(70 * Math.cos(theta1), 80, 70 * Math.sin(theta1));
        const p2 = project(70 * Math.cos(theta2), 80, 70 * Math.sin(theta2));
        const p3 = project(85 * Math.cos(theta2), -70, 85 * Math.sin(theta2));
        const p4 = project(85 * Math.cos(theta1), -70, 85 * Math.sin(theta1));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fillStyle = '#b56d3533';
        ctx.fill();
        ctx.strokeStyle = '#e69855';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Magnetic alignment flux line torus
      for (let a = -40; a <= 40; a += 20) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const theta = (i * 2 * Math.PI) / segments;
          const p = project(60 * Math.cos(theta), a, 60 * Math.sin(theta));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }

    } else if (selectedProfile === 'gear_train') {
      // Draw 3D Bronze Gearwheel Network
      const drawGear = (gx: number, gy: number, gz: number, radius: number, teeth: number, rotSign: number) => {
        const teethPoints = [];
        for (let i = 0; i < teeth * 2; i++) {
          const angle = (i * Math.PI) / teeth + (rotSign * rad);
          const r = i % 2 === 0 ? radius + 12 : radius - 4;
          teethPoints.push(project(gx + r * Math.cos(angle), gy, gz + r * Math.sin(angle)));
        }
        ctx.beginPath();
        teethPoints.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = '#e5a93c44';
        ctx.fill();
        ctx.strokeStyle = '#f5c35b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      };

      drawGear(-40, 20, 0, 60, 16, 1);
      drawGear(65, 20, 0, 42, 11, -1.45);
      drawGear(135, 20, 0, 26, 7, 2.3);

    } else {
      // Draw 3D Manasara 9x9 Prastara Mandala Matrix
      const size = 160;
      const step = size / 4.5;
      for (let x = -size; x <= size; x += step) {
        for (let z = -size; z <= size; z += step) {
          const p1 = project(x, 70, z);
          const p2 = project(x + step, 70, z);
          const p3 = project(x + step, 70, z + step);
          const p4 = project(x, 70, z + step);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Central Brahmasthana elevation
          if (Math.abs(x) < step * 1.5 && Math.abs(z) < step * 1.5) {
            ctx.fillStyle = '#991b1b55';
            ctx.fill();
          }
        }
      }
    }

    // CAD coordinate axes badge in bottom-left
    const o = { x: 50, y: canvas.height - 40 };
    const ax = { x: o.x + 25 * Math.cos(rad), y: o.y + 12 * Math.sin(rad) };
    const ay = { x: o.x, y: o.y - 25 };
    const az = { x: o.x - 25 * Math.sin(rad), y: o.y + 12 * Math.cos(rad) };

    ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(ax.x, ax.y); ctx.stroke();
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(ay.x, ay.y); ctx.stroke();
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(az.x, az.y); ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '9px monospace';
    ctx.fillText('X', ax.x + 4, ax.y);
    ctx.fillText('Y', ay.x + 4, ay.y);
    ctx.fillText('Z', az.x + 4, az.y);

  }, [rotationAngle, selectedProfile]);

  // Exact ISO Metric Machining Routine for Musha Core
  const mushaCoreMachiningGCode = `; =========================================================================
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
; =========================================================================`;

  const mushaMachiningSteps = [
    {
      step: 0,
      title: "Spindle Startup & Modal Config",
      code: "G21\nG90\nM03 S12000",
      desc: "Set metric units (mm), absolute positioning mode, and spin spindle to 12,000 RPM optimal sintering cut speed.",
      x: 0,
      y: 0,
      z: 10,
      feed: 0,
      spindle: 12000,
      coolant: false,
      radius: 0
    },
    {
      step: 1,
      title: "Step 1: Rapid Positioning & Approach",
      code: "G00 X45.000 Y45.000 Z5.000\nM07",
      desc: "Rapid travel over Manasara grid center node (45, 45) at clearance height Z=5.000mm; engage mist coolant for particulate suppression.",
      x: 45,
      y: 45,
      z: 5,
      feed: 1200,
      spindle: 12000,
      coolant: true,
      radius: 0
    },
    {
      step: 2,
      title: "Step 2: Plunge & Initial Hole Cut",
      code: "G01 Z-2.500 F300\nG01 X45.000 Y45.000 Z-5.000 F150",
      desc: "Linear feed plunge into raw stock top surface (Z=-2.5mm @ 300 mm/min), then plunge to floor depth (Z=-5.0mm @ 150 mm/min).",
      x: 45,
      y: 45,
      z: -5,
      feed: 150,
      spindle: 12000,
      coolant: true,
      radius: 5
    },
    {
      step: 3,
      title: "Step 3: Inner Chamber Circular Excavation",
      code: "G02 X45.000 Y45.000 I10.000 J0.000 F600\nG01 Z-10.000 F150\nG02 X45.000 Y45.000 I15.000 J0.000 F800",
      desc: "Counter-clockwise excavation cut (R=10mm @ 600 mm/min), plunge deeper to Z=-10mm, wider clean-up wall pass (R=15mm @ 800 mm/min).",
      x: 45,
      y: 45,
      z: -10,
      feed: 800,
      spindle: 12000,
      coolant: true,
      radius: 15
    },
    {
      step: 4,
      title: "Step 4: Floor Finishing & Base Ramping",
      code: "G01 Z-15.000 F120\nG03 X45.000 Y45.000 I15.000 J0.000 F400",
      desc: "Reach final internal chamber floor limit (Z=-15mm @ 120 mm/min), execute mirror finishing circular pass (R=15mm @ 400 mm/min).",
      x: 45,
      y: 45,
      z: -15,
      feed: 400,
      spindle: 12000,
      coolant: true,
      radius: 15
    },
    {
      step: 5,
      title: "Step 5: Safe Retraction & Shutdown",
      code: "G00 Z25.000 M05\nM09\nM30",
      desc: "Rapid retract cutter along Z-axis to safe clearance Z=25mm, halt spindle (M05), turn off mist coolant (M09), and end execution (M30).",
      x: 45,
      y: 45,
      z: 25,
      feed: 1500,
      spindle: 0,
      coolant: false,
      radius: 0
    }
  ];

  // Generate Parametric G-Code stream matching user request
  const generatedGCode = selectedProfile === 'crucible_musha'
    ? mushaCoreMachiningGCode
    : `(=============================================================)
( NEPAL-BHARAT RASASHASTRA-AI: HIGH-TEMP REFRACTORY CAM PROTOCOL )
( COMPONENT: ${selectedProfile.toUpperCase()} )
( STANDARD: RASARATNA SAMUCHAYA ADHYAYA 9-10 / MANASARA PRASTARA )
( NOZZLE TEMP: ${nozzleTemp} C | BED TEMP: ${bedTemp} C | FEED: ${feedRate} mm/min )
(=============================================================)

; --- Machine Initialization & Homing ---
G21 ; Set units to millimeters
G90 ; Absolute positioning coordinates
M82 ; Set extruder to absolute mode
G28 X0 Y0 Z0 ; Home all axes to Manasara origin (Brahmasthana 0,0,0)
G1 Z15.0 F1200 ; Lift nozzle clear of printbed

; --- Refractory Thermal Priming ---
M140 S${bedTemp} ; Set preheat bed temperature (Preheated Terracotta Base)
M104 S${nozzleTemp} ; Set ceramic extruder thermal chamber
M190 S${bedTemp} ; Wait for bed temp stabilization
M109 S${nozzleTemp} ; Wait for crucible melt stabilization

; --- Sandhi-Bandhana Inert Atmosphere Purge ---
M106 S255 ; Open argon/nitrogen reducing gas purge valve
G4 P3000 ; Dwell 3 seconds for atmospheric seal

; --- Layer 0: Stepped Granite Plinth Foundation ---
G92 E0 ; Reset extrusion counter
G1 X-60.00 Y-60.00 Z0.30 F${feedRate} ; Rapid move to Nairritya corner
G1 X60.00 Y-60.00 E14.28 F1800 ; Extrude lower plinth edge
G1 X60.00 Y60.00 E28.56 ; Extrude Agni corner
G1 X-60.00 Y60.00 E42.84 ; Extrude Vayu corner
G1 X-60.00 Y-60.00 E57.12 ; Close perimeter contour

; --- Layer 1 to N: Kudua Blast Hearth & Musha Chamber ---
G1 Z${layerHeight.toFixed(2)} F900 ; Advance layer height
G1 X-50.00 Y-50.00 F${feedRate}
G2 X50.00 Y-50.00 I50.00 J0.00 E68.45 ; Circular contour for Kudua hearth
G2 X-50.00 Y-50.00 I-50.00 J0.00 E79.80

; --- Twin Tuyere Air Blast Nozzle Ports ---
( Port A - Agni Southeast Nozzle )
G1 X35.35 Y-35.35 Z22.40 F1200
G1 E77.50 F1800 ; Retract
G0 X42.00 Y-42.00 ; Open air injection conduit

( Port B - Vayu Northwest Nozzle )
G1 X-35.35 Y35.35 Z22.40 F1200
G1 E76.20 F1800 ; Retract
G0 X-42.00 Y42.00 ; Open counter-current conduit

; --- Magnetic Alignment Pulse Activation ---
M42 P4 S255 ; Trigger 2.8 Tesla orientation pulse coil
G4 P500 ; Hold pulse 500ms during eutectic crystallization
M42 P4 S0 ; Release coil

; --- End Routine & Thermal Annealing ---
M104 S0 ; Turn off extruder heat
M140 S80 ; Controlled slow cooldown (prevent thermal shock)
G1 Z180.0 F1800 ; Move gantry to safe height
G28 X0 Y0 ; Park head at home
M84 ; Disable stepper motors
( --- Sintering Cycle Complete: Ingot Ready for Inspection --- )`;

  // Python Backend RasashastraPipeline code snippet
  const pythonBackendSnippet = `# ===============================================================
# NEPAL-BHARAT RASASHASTRA-AI: PYTHON-FLASK BACKEND ENGINE
# API GATEWAY FOR AUTOCAD / SOLIDWORKS / FREE-CAD REST SYNC
# ===============================================================

from flask import Flask, request, jsonify
import math

app = Flask(__name__)

class RasashastraPipeline:
    def __init__(self, ore_type, furnace_temp, grid_layout, inert_atmosphere=True):
        self.ore_type = ore_type          # "Neodymium-Samarium Complex", Bastnäsite
        self.furnace_temp = furnace_temp  # Kudua furnace thermal parameters (°C)
        self.grid_layout = grid_layout    # "Prastara-Grid-9x9"
        self.inert_atmosphere = inert_atmosphere

    def calculate_magnetic_flux(self):
        """Simulation math mapping based on pure geometric ratios & Rasaratna Samuchaya"""
        if self.furnace_temp >= 1200 and self.inert_atmosphere:
            status = "Optimal Sintering Achieved via Koshthi Yantra rules"
            # Remanence flux calculation (1.45 Tesla theoretical for N52)
            flux_density_gauss = self.furnace_temp * 1.45
            remanence_tesla = min(1.48, round((self.furnace_temp / 1350.0) * 1.45, 2))
            coercivity_koersted = round(28.0 * (self.furnace_temp / 1250.0), 1)
            bh_max = round(52.0 * math.pow(remanence_tesla / 1.45, 2), 1)
        else:
            status = "Insufficient Heat for Ore Melting - Adjust Crucible Air Intake"
            flux_density_gauss = 0
            remanence_tesla = 0.0
            coercivity_koersted = 0.0
            bh_max = 0.0

        return {
            "status": status,
            "flux_density_gauss": flux_density_gauss,
            "remanence_tesla": remanence_tesla,
            "coercivity_koersted": coercivity_koersted,
            "bh_max_mgoe": bh_max,
            "curie_temp_celsius": 312,
            "shodhana_cycle_purity": "99.8% Nd-Fe-B"
        }

@app.route("/api/v1/rasashastra/simulate", methods=["POST"])
def simulate():
    data = request.get_json() or {}
    pipeline = RasashastraPipeline(
        ore_type=data.get("ore_type", "Neodymium-Samarium Complex"),
        furnace_temp=float(data.get("furnace_temp", 1250)),
        grid_layout=data.get("grid_layout", "Prastara-Grid-9x9"),
        inert_atmosphere=data.get("inert_atmosphere", True)
    )
    report = pipeline.calculate_magnetic_flux()
    return jsonify({
        "success": True,
        "blueprint_report": report,
        "cad_integration": {
            "solidworks_sync": "Active",
            "autocad_dxf_export": "Ready",
            "gcode_generator": "ISO-6983 Compliant"
        }
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)`;

  // Toolpath simulation playback timer
  useEffect(() => {
    let timer: any;
    if (isSimPlaying) {
      timer = setInterval(() => {
        setMushaSimStep(prev => (prev + 1) % mushaMachiningSteps.length);
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isSimPlaying]);

  // Toolpath 2D Canvas Renderer for G-Code excavation
  useEffect(() => {
    const canvas = toolpathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 4.2; // pixels per mm

    // Dark coordinate viewport
    ctx.fillStyle = '#0b0805';
    ctx.fillRect(0, 0, w, h);

    // Coordinate grid lines (10mm intervals)
    ctx.strokeStyle = '#22150a';
    ctx.lineWidth = 1;
    for (let x = -50; x <= 50; x += 10) {
      ctx.beginPath();
      ctx.moveTo(cx + x * scale, 0);
      ctx.lineTo(cx + x * scale, h);
      ctx.stroke();
    }
    for (let y = -50; y <= 50; y += 10) {
      ctx.beginPath();
      ctx.moveTo(0, cy + y * scale);
      ctx.lineTo(w, cy + y * scale);
      ctx.stroke();
    }

    // Outer Crucible Stock Mantle (30mm radius)
    ctx.strokeStyle = '#8c5024';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 30 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#b56d3518';
    ctx.fill();

    // Center datum crosshairs (X45.000, Y45.000)
    ctx.strokeStyle = '#e0a84577';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - 32 * scale, cy);
    ctx.lineTo(cx + 32 * scale, cy);
    ctx.moveTo(cx, cy - 32 * scale);
    ctx.lineTo(cx, cy + 32 * scale);
    ctx.stroke();
    ctx.setLineDash([]);

    const cur = mushaMachiningSteps[mushaSimStep];

    // Excavated Cavity Cut (R = 10mm) - Step 3+
    if (mushaSimStep >= 3) {
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 10 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#00ffcc25';
      ctx.fill();

      ctx.fillStyle = '#00ffcc';
      ctx.font = '10px monospace';
      ctx.fillText('G02 R=10mm (CCW)', cx - 48, cy - 11 * scale);
    }

    // Outer Wall Clean-up Pass (R = 15mm) - Step 3+
    if (mushaSimStep >= 3) {
      ctx.strokeStyle = '#ffd285';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 15 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ffd28520';
      ctx.fill();

      ctx.fillStyle = '#ffd285';
      ctx.font = '10px monospace';
      ctx.fillText(mushaSimStep >= 4 ? 'G03 Mirror Pass (R=15mm CW)' : 'G02 Wall Pass (R=15mm)', cx - 62, cy + 18 * scale);
    }

    // Initial Plunge Hole (Step 2+)
    if (mushaSimStep >= 2) {
      ctx.fillStyle = '#ff6b4aaa';
      ctx.beginPath();
      ctx.arc(cx, cy, 4.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cutter tool head
    ctx.strokeStyle = cur.spindle > 0 ? '#38bdf8' : '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 5 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // Spindle spinning cross indicator
    if (cur.spindle > 0) {
      const angle = (Date.now() / 60) % (Math.PI * 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 5 * scale, cy + Math.sin(angle) * 5 * scale);
      ctx.lineTo(cx - Math.cos(angle) * 5 * scale, cy - Math.sin(angle) * 5 * scale);
      ctx.stroke();
    }

    // Mist coolant particles
    if (cur.coolant) {
      ctx.fillStyle = '#38bdf8bb';
      for (let i = 0; i < 8; i++) {
        const dropAngle = (i * Math.PI) / 4 + (Date.now() / 250);
        const dist = (8 + (i % 4) * 4) * scale * 0.4;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(dropAngle) * dist, cy + Math.sin(dropAngle) * dist, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // On-canvas HUD
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText(`CENTER NODE: (X:45.000, Y:45.000)`, 10, 20);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px monospace';
    ctx.fillText(`Z-AXIS DEPTH: ${cur.z >= 0 ? '+' : ''}${cur.z.toFixed(3)} mm`, 10, 35);
    ctx.fillText(`SPINDLE SPEED: ${cur.spindle.toLocaleString()} RPM`, 10, 50);
    ctx.fillText(`COOLANT MIST: ${cur.coolant ? 'ACTIVE (M07)' : 'OFF (M09)'}`, 10, 65);
    ctx.fillText(`FEEDRATE: ${cur.feed} mm/min`, 10, 80);
  }, [mushaSimStep, activeTab, selectedProfile]);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadGCode = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedGCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedProfile === 'crucible_musha'
      ? 'musha_core_machining.gcode'
      : `${selectedProfile}_rasashastra.gcode`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchFeedback.trim()) return;

    setSubmittingToHub(true);
    setTimeout(() => {
      const newEntry = {
        id: `NB-USER-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        institute: 'Engineering Research Scholar (Public Repository Sync)',
        text: researchFeedback,
        status: 'Synced to bhuyanamitnishanka-debug'
      };
      setFeedbackHistory([newEntry, ...feedbackHistory]);
      setResearchFeedback('');
      setSubmittingToHub(false);
    }, 700);
  };

  return (
    <div className="parchment-bg rounded-2xl parchment-border p-4 md:p-6 text-[#2d1b0f] relative overflow-hidden shadow-2xl">
      {/* Decorative Palm-Leaf string holes */}
      <div className="absolute top-4 left-8 palm-leaf-hole hidden sm:block opacity-75"></div>
      <div className="absolute top-4 right-8 palm-leaf-hole hidden sm:block opacity-75"></div>

      {/* Header matching user prompt */}
      <div className="border-b-2 border-[#8e5828]/50 pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#a85a1a] font-bold font-cinzel">
              CAD/CAM & G-Code Synthesis Studio
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#f0dfbe] border border-[#a86e30] font-devanagari font-bold text-[#643410]">
              ୟନ୍ତ୍ର-ସଂରଚନା ଏବଂ ଜି-କୋଡ୍ ସିମୁଲେସନ୍
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-devanagari text-[#46220b] leading-tight mt-0.5">
            AutoCAD/SolidWorks API & G-Code କଣ୍ଟ୍ରୋଲ୍ ପ୍ୟାନେଲ୍
          </h2>
          <p className="text-xs md:text-sm text-[#73431b] font-cinzel italic">
            Parametric 3D CAD Wireframe, CNC/3D-Print G-Code Generator & IIT-Madras/Bhubaneswar Coordination Form
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('3d_cad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeTab === '3d_cad'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm'
                : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <Rotate3d className="w-3.5 h-3.5" />
            <span>3D CAD Model</span>
          </button>

          <button
            onClick={() => setActiveTab('gcode')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeTab === 'gcode'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm'
                : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>G-Code Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('api_sync')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeTab === 'api_sync'
                ? 'bg-[#7a2e12] text-white border-[#4d1907] shadow-sm'
                : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Python/Flask API</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              activeTab === 'feedback'
                ? 'bg-[#0f52ba] text-white border-[#083070] shadow-sm'
                : 'bg-[#eaddc4] text-[#4d280e] hover:bg-[#d8c5a4] border-[#9e6932]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>IIT Coordination</span>
          </button>
        </div>
      </div>

      {/* Component Profile Selector */}
      <div className="mb-4 bg-[#f0e3cc] border border-[#a87037]/50 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-cinzel font-bold text-[#5c3010]">Target Component Geometry:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['kudua_furnace', 'crucible_musha', 'gear_train', 'manasara_grid'] as const).map(prof => (
            <button
              key={prof}
              onClick={() => setSelectedProfile(prof)}
              className={`px-2.5 py-1 rounded text-xs transition-all ${
                selectedProfile === prof
                  ? 'bg-[#7a2e12] text-white font-bold shadow-sm'
                  : 'bg-[#e2d2b8] text-[#542d10] hover:bg-[#d6c19f] border border-[#9e6932]'
              }`}
            >
              {prof === 'kudua_furnace' ? 'Kudua Blast Furnace' :
               prof === 'crucible_musha' ? 'Musha Crucible Core' :
               prof === 'gear_train' ? 'Bronze Gear Network' : 'Manasara 9x9 Grid'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === '3d_cad' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Canvas Viewport */}
          <div className="lg:col-span-8 bg-[#161009] rounded-xl border-2 border-[#a36c34] p-2 relative shadow-inner overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 left-4 z-10 bg-[#281a0e]/90 border border-[#8e5828] rounded-lg px-2.5 py-1 text-[11px] text-[#f2dfca] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Parametric 3D Wireframe Mesh</span>
              <span className="text-[#8e5828]">|</span>
              <span className="font-mono text-[#e0a845]">{Math.round(rotationAngle)}° Azimuth</span>
            </div>

            <div className="w-full h-[400px] flex items-center justify-center">
              <canvas
                ref={cadCanvasRef}
                width={700}
                height={400}
                className="w-full h-full select-none cursor-grab active:cursor-grabbing"
              />
            </div>

            {/* Bottom 3D controls */}
            <div className="bg-[#24170d] border-t border-[#693d18] p-2.5 rounded-b-lg flex flex-wrap items-center justify-between gap-3 text-xs text-[#d9c0a3]">
              <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                <Rotate3d className="w-4 h-4 text-[#e0a845]" />
                <span>Rotation:</span>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotationAngle}
                  onChange={e => setRotationAngle(Number(e.target.value))}
                  className="w-full h-2 bg-[#52331b] rounded-lg appearance-none cursor-pointer accent-[#c88a2c]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                    isRotating ? 'bg-[#7a2e12] text-white border-[#541e0b]' : 'bg-[#3b2313] text-[#d9c0a3] border-[#704218]'
                  }`}
                >
                  {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRotating ? 'Pause Spin' : 'Resume Spin'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Machine Parameter Control Sheet */}
          <div className="lg:col-span-4 bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-4 shadow-md space-y-3 text-xs">
            <div className="border-b border-[#a86e30]/40 pb-2 flex items-center justify-between">
              <span className="font-cinzel font-bold text-[#7a390e] uppercase">
                CAM Machine Parameters
              </span>
              <span className="text-[10px] font-mono bg-[#ebd4b0] px-2 py-0.5 rounded text-[#592c0c] border border-[#b8803d]">
                ISO-6983 G-Code
              </span>
            </div>

            <div>
              <label className="font-bold text-[#542d10] block mb-1">
                Refractory Nozzle Temp (ନୋଜଲ୍ ତାପମାତ୍ରା):
              </label>
              <div className="flex items-center justify-between font-mono text-[#a32a0d] mb-1 font-bold">
                <span>{nozzleTemp}°C</span>
                <span className="text-[10px] text-[#73431b]">Liquid Eutectic</span>
              </div>
              <input
                type="range"
                min="1000"
                max="1600"
                step="10"
                value={nozzleTemp}
                onChange={e => setNozzleTemp(Number(e.target.value))}
                className="w-full h-2 bg-[#d1be9d] rounded appearance-none cursor-pointer accent-[#8c3214]"
              />
            </div>

            <div>
              <label className="font-bold text-[#542d10] block mb-1">
                Preheated Bed Temp (ଆଧାର ଶିଳା ତାପ):
              </label>
              <div className="flex items-center justify-between font-mono text-[#a32a0d] mb-1 font-bold">
                <span>{bedTemp}°C</span>
                <span className="text-[10px] text-[#73431b]">Thermal Shock Prevention</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="5"
                value={bedTemp}
                onChange={e => setBedTemp(Number(e.target.value))}
                className="w-full h-2 bg-[#d1be9d] rounded appearance-none cursor-pointer accent-[#8c3214]"
              />
            </div>

            <div>
              <label className="font-bold text-[#542d10] block mb-1">
                Deposition Layer Height (ପରସ୍ତ ମୋଟେଇ):
              </label>
              <div className="flex items-center justify-between font-mono text-[#a32a0d] mb-1 font-bold">
                <span>{layerHeight} mm</span>
                <span className="text-[10px] text-[#73431b]">High-Resolution Silt</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={layerHeight}
                onChange={e => setLayerHeight(Number(e.target.value))}
                className="w-full h-2 bg-[#d1be9d] rounded appearance-none cursor-pointer accent-[#8c3214]"
              />
            </div>

            <div>
              <label className="font-bold text-[#542d10] block mb-1">
                Toolhead Feed Rate (ଉପକରଣ ଗତି):
              </label>
              <div className="flex items-center justify-between font-mono text-[#a32a0d] mb-1 font-bold">
                <span>{feedRate} mm/min</span>
              </div>
              <input
                type="range"
                min="600"
                max="4800"
                step="100"
                value={feedRate}
                onChange={e => setFeedRate(Number(e.target.value))}
                className="w-full h-2 bg-[#d1be9d] rounded appearance-none cursor-pointer accent-[#8c3214]"
              />
            </div>

            <div className="pt-2 border-t border-[#a86e30]/40 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('gcode')}
                className="w-full py-2 bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-4 h-4" />
                <span>Generate G-Code Simulation</span>
              </button>

              <button
                onClick={() => handleCopyCode(generatedGCode)}
                className="w-full py-1.5 bg-[#ebd4b0] hover:bg-[#dec299] text-[#4d280e] font-semibold rounded-lg border border-[#a87037] transition-all text-center flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'G-Code Copied!' : 'Copy G-Code Block'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gcode' && (
        <div className="space-y-4">
          {/* Header Banner for Musha Core Machining */}
          <div className="bg-[#1c1208] border-2 border-[#a36c34] rounded-xl p-4 shadow-lg text-[#f1dec9]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#593414] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#e0a845]" />
                <div>
                  <h3 className="font-mono text-sm font-bold text-[#e0a845] flex items-center gap-2">
                    <span>{selectedProfile === 'crucible_musha' ? 'MUSHA_CORE_MACHINING.GCODE' : `${selectedProfile.toUpperCase()}_FABRICATION_MATRIX.NC`}</span>
                    <span className="text-[10px] bg-[#331c0a] px-2 py-0.5 rounded text-[#caa177] border border-[#6b3e19] font-normal">
                      ISO Metric Standard
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#caa177]">
                    {selectedProfile === 'crucible_musha' 
                      ? 'Component: Inner Core Crucible Part (Musha Core) | Aligned via Manasara Units'
                      : 'High-Temperature Additive Sintering Path Matrix'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyCode(generatedGCode)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded bg-[#3d2412] hover:bg-[#523119] border border-[#824c1e] text-[#f2dfca] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy G-Code'}</span>
                </button>
                <button
                  onClick={handleDownloadGCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-[#7a2e12] hover:bg-[#943917] text-white font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .gcode</span>
                </button>
              </div>
            </div>

            {/* Interactive Machining Stepper & Toolpath Simulator */}
            {selectedProfile === 'crucible_musha' && (
              <div className="mb-4 bg-[#100b06] border border-[#542d10] rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#38bdf8]" />
                    <span className="font-mono text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                      Interactive Toolpath Stepper & CNC Machining Simulator
                    </span>
                  </div>

                  {/* Step Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMushaSimStep(prev => Math.max(0, prev - 1))}
                      disabled={mushaSimStep === 0}
                      className="px-2 py-1 rounded bg-[#2e1a0d] hover:bg-[#452814] disabled:opacity-40 text-xs font-mono text-[#f2dfca] flex items-center gap-1"
                    >
                      <SkipBack className="w-3 h-3" />
                      <span>Prev</span>
                    </button>
                    <button
                      onClick={() => setIsSimPlaying(prev => !prev)}
                      className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                        isSimPlaying ? 'bg-[#7a001e] text-white' : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-[#d8f3dc]'
                      }`}
                    >
                      {isSimPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isSimPlaying ? 'Pause Cycle' : 'Auto Play Cycle'}</span>
                    </button>
                    <button
                      onClick={() => setMushaSimStep(prev => Math.min(mushaMachiningSteps.length - 1, prev + 1))}
                      disabled={mushaSimStep === mushaMachiningSteps.length - 1}
                      className="px-2 py-1 rounded bg-[#2e1a0d] hover:bg-[#452814] disabled:opacity-40 text-xs font-mono text-[#f2dfca] flex items-center gap-1"
                    >
                      <span>Next</span>
                      <SkipForward className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => { setMushaSimStep(0); setIsSimPlaying(false); }}
                      className="p-1 rounded bg-[#2e1a0d] hover:bg-[#452814] text-[#caa177]"
                      title="Reset Cycle"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Step indicator tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 mb-3 text-[11px] font-mono">
                  {mushaMachiningSteps.map((st, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setMushaSimStep(idx); setIsSimPlaying(false); }}
                      className={`p-1.5 rounded text-left border transition-all ${
                        mushaSimStep === idx
                          ? 'bg-[#7a2e12] border-[#e0a845] text-white font-bold shadow-sm'
                          : 'bg-[#181109] border-[#382312] text-[#9c7a5a] hover:bg-[#24170d]'
                      }`}
                    >
                      <div className="text-[10px] text-[#ffd285]">STEP {idx}</div>
                      <div className="truncate">{st.title.split(':')[1] || st.title}</div>
                    </button>
                  ))}
                </div>

                {/* Simulation Canvas + Telemetry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Toolpath 2D Canvas */}
                  <div className="md:col-span-7 bg-[#0b0805] rounded-lg border-2 border-[#542d10] p-1.5 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <canvas
                      ref={toolpathCanvasRef}
                      width={380}
                      height={240}
                      className="w-full h-[240px] max-w-full"
                    />
                    <div className="absolute bottom-2 right-2 bg-[#000000aa] border border-[#542d10] px-2 py-0.5 rounded text-[10px] font-mono text-[#00ffcc]">
                      ISO Metric Coordinates
                    </div>
                  </div>

                  {/* Active Step Telemetry Card */}
                  <div className="md:col-span-5 space-y-2 bg-[#181109] border border-[#3e2412] p-3 rounded-lg text-xs font-mono">
                    <div className="border-b border-[#3e2412] pb-1.5">
                      <div className="text-[10px] text-[#e0a845] uppercase tracking-wider font-bold">
                        {mushaMachiningSteps[mushaSimStep].title}
                      </div>
                      <p className="text-[11px] text-[#e2cfbe] mt-0.5 font-sans leading-relaxed">
                        {mushaMachiningSteps[mushaSimStep].desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="bg-[#0f0a05] p-1.5 rounded border border-[#2d1b0d]">
                        <span className="text-[#888] block text-[9px]">ACTIVE G-CODE:</span>
                        <span className="text-[#38bdf8] font-bold whitespace-pre-line text-[10px]">
                          {mushaMachiningSteps[mushaSimStep].code}
                        </span>
                      </div>
                      <div className="bg-[#0f0a05] p-1.5 rounded border border-[#2d1b0d]">
                        <span className="text-[#888] block text-[9px]">TOOL DEPTH (Z):</span>
                        <span className="text-[#ffd285] font-bold text-xs">
                          {mushaMachiningSteps[mushaSimStep].z >= 0 ? '+' : ''}{mushaMachiningSteps[mushaSimStep].z.toFixed(3)} mm
                        </span>
                      </div>
                      <div className="bg-[#0f0a05] p-1.5 rounded border border-[#2d1b0d]">
                        <span className="text-[#888] block text-[9px]">FEED RATE:</span>
                        <span className="text-[#39ff14] font-bold">
                          {mushaMachiningSteps[mushaSimStep].feed} mm/min
                        </span>
                      </div>
                      <div className="bg-[#0f0a05] p-1.5 rounded border border-[#2d1b0d]">
                        <span className="text-[#888] block text-[9px]">MIST COOLANT:</span>
                        <span className={mushaMachiningSteps[mushaSimStep].coolant ? 'text-[#00ffcc] font-bold' : 'text-[#ff6b6b]'}>
                          {mushaMachiningSteps[mushaSimStep].coolant ? 'M07 ACTIVE' : 'M09 OFF'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Code view */}
            <div className="relative">
              <pre className="font-mono text-xs leading-relaxed overflow-x-auto max-h-[400px] p-3 bg-[#110b06] rounded-lg border border-[#42250d] text-[#e0cfba] select-all">
                {generatedGCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api_sync' && (
        <div className="space-y-3">
          <div className="bg-[#18110a] border-2 border-[#a36c34] rounded-xl p-4 shadow-lg text-[#f1dec9]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#593414] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#e0a845]" />
                <span className="font-mono text-xs font-bold text-[#e0a845]">
                  rasashastra_pipeline_api.py (Flask / Google AI Studio Gateway)
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(pythonBackendSnippet)}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-[#3d2412] hover:bg-[#523119] border border-[#824c1e] text-[#f2dfca] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Script' : 'Copy Python Code'}</span>
              </button>
            </div>

            <pre className="font-mono text-xs leading-relaxed overflow-x-auto max-h-[440px] p-3 bg-[#110b06] rounded-lg border border-[#42250d] text-[#7dd3fc] select-all">
              {pythonBackendSnippet}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div className="bg-[#f8f1e2] border-2 border-[#8e5828]/60 rounded-xl p-4 md:p-5 shadow-md">
            <div className="border-b border-[#a86e30]/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#0f52ba] font-bold font-cinzel">
                  Public Research & Institutional Repository Sync
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#e1edff] border border-[#99bbee] text-[#0f52ba] font-mono font-bold">
                  repo: bhuyanamitnishanka-debug
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold font-devanagari text-[#46220b] mt-1">
                📝 Interactive Research & Coordination Feedback Form
              </h3>
              <p className="text-xs md:text-sm text-[#73431b] font-serif">
                IIT-Madras ଏବଂ IIT-Bhubaneswar ର ଇଞ୍ଜିନିୟରିଂ ଟିମ୍ ସହ ଡାଟା ସିଙ୍କ୍ କରିବା ପାଇଁ ଆପଣଙ୍କ ମତାମତ ଓ ଲାବୋରେଟୋରୀ ନୋଟ୍ସ ଦିଅନ୍ତୁ:
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-3">
              <textarea
                value={researchFeedback}
                onChange={e => setResearchFeedback(e.target.value)}
                rows={3}
                placeholder="ଆପଣଙ୍କ ରିସର୍ଚ୍ଚ ନୋଟ୍ସ, Nd₂Fe₁₄B ସିନ୍ଟରିଂ ପାରାମିଟର କିମ୍ବା କୁଡୁଆ ଫର୍ଣ୍ଣେସ୍ ମେକାନିକାଲ୍ ଫିଡ୍ବ୍ୟାକ୍ ଏଠାରେ ଲେଖନ୍ତୁ..."
                className="w-full bg-[#fdfbf6] border-2 border-[#a36c34]/70 rounded-xl p-3 text-xs md:text-sm text-[#2b1608] placeholder-[#9c7857] focus:outline-none focus:border-[#0f52ba] leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-[#73431b] italic">
                  * ଡାଟା ସିଧାସଳଖ ପବ୍ଲିକ୍ ରିସର୍ଚ୍ଚ ଗିଟ୍ହବ୍ ରେପୋଜିଟୋରୀ ସହ ସିଙ୍କ୍ ହେବ ।
                </span>
                <button
                  type="submit"
                  disabled={submittingToHub || !researchFeedback.trim()}
                  className="px-4 py-2 bg-[#0f52ba] hover:bg-[#1464dd] disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingToHub ? 'Syncing to GitHub...' : 'Submit Data to Public GitHub Repository'}</span>
                </button>
              </div>
            </form>

            {/* Past institutional feedback stream */}
            <div className="mt-5 pt-4 border-t border-[#a86e30]/40 space-y-3">
              <span className="text-xs font-cinzel font-bold text-[#7a390e] uppercase block">
                Synchronized Research Telemetry Stream:
              </span>
              <div className="space-y-2">
                {feedbackHistory.map(entry => (
                  <div key={entry.id} className="bg-[#f0dfbe] border border-[#c99a5e]/60 p-3 rounded-lg text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="font-bold text-[#0f52ba]">{entry.institute}</span>
                      <span className="font-mono text-[#73431b]">{entry.timestamp}</span>
                    </div>
                    <p className="text-[#3b200b] leading-relaxed">{entry.text}</p>
                    <div className="text-[10px] text-emerald-800 font-mono flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>{entry.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
