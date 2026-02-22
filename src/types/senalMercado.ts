/**
 * SenalMercado Type Definition
 *
 * Purpose: TypeScript interface representing a single record from the
 * `senales_mercado` Supabase table. Field names mirror the database
 * column names exactly to avoid mapping overhead at the service layer.
 */
export interface SenalMercado {
  id: number;
  semana_id: number;
  empresa_o_proyecto: string | null;
  tipo_evento: string | null;
  tipo_proyecto: 'Oficina' | 'Industrial' | 'Ambos' | null;
  frase_resumen: string | null;
  detalles: string | null;
  hipotesis_inmobiliaria: string | null;
  fuente: string | null;
  fecha_creacion: string;
  ultima_fecha_actualizacion: string | null;
  titulo: string | null;
  subtitulo: string | null;
}
