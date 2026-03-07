import { useQuery } from '@tanstack/react-query';
import { fetchE4PersonaOutput } from '@/services/supabaseService';

export const E4_PERSONA_OUTPUT_QUERY_KEY = (ejecucionId: number) =>
  ['e4PersonaOutput', ejecucionId] as const;

export function useE4PersonaOutputQuery(ejecucionId: number | null) {
  return useQuery({
    queryKey: E4_PERSONA_OUTPUT_QUERY_KEY(ejecucionId!),
    queryFn: () => fetchE4PersonaOutput(ejecucionId!),
    enabled: Boolean(ejecucionId),
  });
}
