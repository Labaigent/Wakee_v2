import { useQuery } from '@tanstack/react-query';
import { fetchEjecuciones } from '@/services/supabaseService';

export const EJECUCIONES_QUERY_KEY = ['ejecuciones'] as const;

export function useEjecucionesQuery() {
  return useQuery({
    queryKey: EJECUCIONES_QUERY_KEY,
    queryFn: fetchEjecuciones,
  });
}
