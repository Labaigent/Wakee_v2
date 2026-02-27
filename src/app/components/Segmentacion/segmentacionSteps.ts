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
