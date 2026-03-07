export interface E4PersonaOutput {
  id: number;
  ejecucion_id: number;
  industria_icp: string | null;
  titulo_rol: string | null;
  seniority: string | null;
  departamento: string | null;
  descripcion_rol: string | null;
  contexto_industria: string | null;
  funciones: string[] | null;
  dolor_especifico_re: string[] | null;
  porque_empresa: string[] | null;
  kpis: string[] | null;
  filtros_operacionales: Record<string, unknown> | null;
  created_at: string | null;
  e4_ejecucion_id: number | null;
}
