/**
 * Modelo único de pasos del flujo de Segmentación.
 * Nombres en código alineados con la UI (Intro, ICP, Persona, Filtro, Búsqueda, Ranking, Dossier, Mensajes).
 */
export type SegmentacionStep =
  | 'intro'
  | 'icp'
  | 'persona'
  | 'filtro'
  | 'busqueda'
  | 'ranking'
  | 'dossier'
  | 'mensajes';

/** Orden de pasos del flujo (sin intro, para el stepper). */
export const SEGMENTACION_STEP_ORDER: Exclude<SegmentacionStep, 'intro'>[] = [
  'icp',
  'persona',
  'filtro',
  'busqueda',
  'ranking',
  'dossier',
  'mensajes',
];

/** Etiquetas para la UI (con tildes). */
export const SEGMENTACION_STEP_LABELS: Record<SegmentacionStep, string> = {
  intro: 'Intro',
  icp: 'ICP',
  persona: 'Persona',
  filtro: 'Filtro',
  busqueda: 'Búsqueda',
  ranking: 'Ranking',
  dossier: 'Dossier',
  mensajes: 'Mensajes',
};

export function getStepIndex(step: SegmentacionStep): number {
  if (step === 'intro') return -1;
  const idx = SEGMENTACION_STEP_ORDER.indexOf(step);
  return idx >= 0 ? idx : -1;
}

export function isStepUnlocked(step: SegmentacionStep, maxReachedStep: SegmentacionStep): boolean {
  if (step === 'intro') return true;
  return getStepIndex(step) <= getStepIndex(maxReachedStep);
}

/** Etapa de inicio para una ejecución nueva (siempre arranca en intro). */
export const ETAPA_INTRO = 3;

/** Mapeo de etapa_siguiente (BD numérico) → step de UI. */
export const ETAPA_TO_STEP: Record<number, SegmentacionStep> = {
  3: 'intro',
  4: 'icp',
  5: 'persona',
  6: 'filtro',
  7: 'busqueda',
  8: 'ranking',
  9: 'dossier',
  10: 'mensajes',
};

/**
 * Convierte etapa_siguiente (número de BD) al step de UI correspondiente.
 * Si el número no está en el mapa, devuelve 'intro' como fallback seguro.
 */
export function getStepForEtapa(etapaSiguiente: number): SegmentacionStep {
  return ETAPA_TO_STEP[etapaSiguiente] ?? 'intro';
}

/**
 * Opciones de ICP (Ideal Customer Profile) para el Wizard.
 * Mapeado desde E3IcpOutput (ejecuciones.e3_ejecucion_outpu_icp).
 */
export interface IcpOption {
  id: string;
  name: string;
  market_signal: {
    description: string;
    source_name: string;
    source_url: string;
  };
  use_case_activated: string;
  target_entity_type: string;
  capex_intensity: string;
  score_strategic: number;
  strategic_pain_addressed: string;
  opportunity_window: string;
}
