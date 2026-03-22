export type EstadoSubPaso = 'pendiente' | 'en_progreso' | 'completado' | 'error';

export interface E6BusquedaLeads {
  id: number;
  in_SchCore_perfil_id: number;
  in_ejecucion_id: number | null;
  in_link_to_scrape: string;
  estado: string;
  fecha_creacion: string;
  fecha_inicio: string | null;
  fecha_finalizacion: string | null;
  tokens_usados: number | null;
  costo: number | null;
  extraccion_sn: EstadoSubPaso;
  enriquecimiento_leads: EstadoSubPaso;
  enriquecimiento_empresas: EstadoSubPaso;
  calculo_score: EstadoSubPaso;
}

/** Solo las 4 columnas de progreso — subset usado por el hook de Realtime */
export interface BusquedaProgreso {
  extraccion_sn: EstadoSubPaso;
  enriquecimiento_leads: EstadoSubPaso;
  enriquecimiento_empresas: EstadoSubPaso;
  calculo_score: EstadoSubPaso;
}
