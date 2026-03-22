import { useQuery } from '@tanstack/react-query';
import { fetchE6BusquedaOutputs } from '@/services/supabaseService';

export const E6_BUSQUEDA_OUTPUT_QUERY_KEY = (ejecucionId: number) =>
  ['e6BusquedaOutput', ejecucionId] as const;

export function useE6BusquedaOutputQuery(ejecucionId: number | null) {
  return useQuery({
    queryKey: E6_BUSQUEDA_OUTPUT_QUERY_KEY(ejecucionId!),
    queryFn: () => fetchE6BusquedaOutputs(ejecucionId!),
    enabled: Boolean(ejecucionId),
  });
}
