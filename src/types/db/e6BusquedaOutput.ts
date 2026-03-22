export interface E6BusquedaOutput {
  // From ejecuciones.e6_busqueda_output
  id: number;
  ejecucion_id: number;
  created_at: string;
  lead_id: string;
  score_industria: number | null;
  justificacion_industria: string | null;
  score_titulos: number | null;
  justificacion_titulos: string | null;
  score_alineacion: number | null;
  justificacion_alineacion: string | null;
  score_empresas: number | null;
  justificacion_empresas: string | null;
  score_seniority: number | null;
  justificacion_seniority: string | null;
  score_dolores: number | null;
  justificacion_dolores: string | null;
  score_ubicaciones: number | null;
  justificacion_ubicaciones: string | null;
  score_actividad_linkedin: number | null;
  justificacion_actividad_linkedin: string | null;
  score_total: number | null;
  resumen_consolidado: string | null;

  // Enriched from linkedin.scraping_leads — not raw DB columns
  sn_nombre_completo: string | null;
  sn_cargo_actual: string | null;
  sn_ubicacion: string | null;
  sn_url_linkedin_perfil_publico: string | null;
  sn_titular: string | null;
  enr_resumen_bio: string | null;
  enr_num_seguidores: number | null;
  enr_num_conexiones: number | null;
  sn_es_premium: boolean | null;
  enr_influencer: boolean | null;

  // Enriched from linkedin.scraping_empresas — not raw DB columns
  empresa_id: string | null;
  sn_emp_nombre: string | null;
  sn_emp_url_linkedin: string | null;
  en_emp_sitio_web: string | null;
  enr_emp_industria: string | null;
  enr_emp_tamano_rango: string | null;
  enr_emp_empleados_linkedin: number | null;
  enr_emp_descripcion: string | null;
  enr_emp_sede_principal: string | null;
  enr_emp_tipo_organizacion: string | null;
}
