/**
 * Tipo que representa una fila de la tabla ejecuciones.e3_ejecucion_outpu_icp.
 * Todas las columnas son NOT NULL en BD.
 */
export interface E3IcpOutput {
  ejecucion_id: number;
  icp_rank: number;
  icp_name: string;
  score_strategic: number;
  target_entity_type: string;
  market_signal_description: string;
  market_signal_source_name: string;
  market_signal_source_url: string;
  use_case_activated: string;
  strategic_pain_addressed: string;
  capex_intensity: string;
  opportunity_window: string;
  score_signal_strength: number;
  score_service_alignment: number;
  score_use_case_activation: number;
  score_capex_intensity: number;
  score_urgency: number;
  v_respects_exclusions: boolean;
  v_within_geography: boolean;
  v_activates_use_case: boolean;
  v_addresses_declared_pain: boolean;
  v_entity_alignment: boolean;
  created_at: string;
}
