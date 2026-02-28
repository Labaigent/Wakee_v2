export interface Ejecucion {
  id: number;
  perfil_id: number;
  estado: 'activa' | 'completada' | 'error';
  etapa_siguiente: number;
  fecha_inicio: string;
  ultima_fecha_actualizacion: string;
  fecha_finalizacion: string | null;
  // Resolved at service layer via LEFT JOIN with config.etapas — not a raw DB column
  etapa_label: string | null;
}
