/**
 * GanchoMercado Type Definition
 *
 * Purpose: TypeScript interface representing a single record from the
 * `ganchos_mercado` Supabase table. Field names mirror the database
 * column names exactly to avoid mapping overhead at the service layer.
 */
export interface GanchoMercado {
  id: number;
  semana_id: number;
  titulo: string;
  subtitulo: string | null;
  frase_resumen: string | null;
  key_points: string | null;     // JSON-serialized string[] — parse at display layer
  detalles: string | null;
  angulo_venta: string | null;
  sectores_beneficiados: string | null;
  fuente: string | null;
  fuente_url: string | null;
  ultima_fecha_actualizacion: string | null;
  fecha_creacion: string;
}
