export interface ManuscriptChapter {
  id: number;
  chapterNumber: string;
  title: string;
  devanagariTitle: string;
  odiaTitle?: string;
  subtitle: string;
  sanskritVerse: string;
  verseTranslation: string;
  odiaVerseTranslation?: string;
  verseSource: string;
  summary: string;
  odiaSummary?: string;
  deepDive: {
    sectionTitle: string;
    content: string[];
    technicalHighlights: { label: string; value: string; desc: string }[];
  };
  graphicPanels: {
    badge: string;
    title: string;
    caption: string;
    details: string;
    technicalAnnotation: string;
    diagramType: 'isometric-furnace' | 'manasara-grid' | 'crystallization' | 'yantra-alchemy' | 'supply-chain';
  }[];
  narrationScript: string;
}

export interface ExplodedPart {
  id: string;
  name: string;
  hindiName: string;
  devanagari: string;
  role: string;
  material: string;
  temperature?: string;
  rasashastraRef: string;
  description: string;
  modernEquivalence: string;
  explodedOffset: { x: number; y: number; z: number };
}

export interface IndustrialZone {
  id: string;
  name: string;
  hindiName: string;
  category: 'storage' | 'processing' | 'power' | 'admin' | 'logistics';
  coordinates: { x: number; y: number; w: number; h: number };
  manasaraTerm: string;
  arthashastraOfficer: string;
  description: string;
  equipment: string[];
  throughput: string;
  safetyRating: string;
}

export interface SimulationParams {
  oreType: 'Bastnäsite' | 'Monazite' | 'Xenotime';
  calcinationTemp: number; // in Celsius
  sinteringTemp: number;   // in Celsius
  magneticFieldPulse: number; // in Tesla
  inertAtmosphere: boolean;
  bellowsPressure: number; // in kPa
}

export interface MagnetOutputMetrics {
  remanenceBr: number;     // Tesla (e.g. 1.2 - 1.48 T)
  coercivityHcj: number;   // kOe (e.g. 15 - 35 kOe)
  energyProductBHmax: number; // MGOe (e.g. 35 - 54 MGOe)
  curieTemperature: number; // Celsius (e.g. 310 - 350 C)
  grade: string;           // e.g. N52, 50H, 45SH
  crystalliteAlignment: number; // 0 - 100%
  purityGrade: string;
}
