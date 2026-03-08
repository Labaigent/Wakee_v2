import { useQuery } from '@tanstack/react-query';
import { fetchE5LinkOutput } from '@/services/supabaseService';

export const E5_LINK_OUTPUT_QUERY_KEY = (ejecucionId: number) =>
  ['e5LinkOutput', ejecucionId] as const;

export function useE5LinkOutputQuery(ejecucionId: number | null) {
  return useQuery({
    queryKey: E5_LINK_OUTPUT_QUERY_KEY(ejecucionId!),
    queryFn: () => fetchE5LinkOutput(ejecucionId!),
    enabled: Boolean(ejecucionId),
  });
}
