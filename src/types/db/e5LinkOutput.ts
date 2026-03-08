export interface E5LinkOutput {
  id: number;
  ejecucion_id: number;
  query: string | null;
  encoded_query: string | null;
  sales_navigator_url: string;
  created_at: string;
  e5_ejecucion_id: number | null;
}
