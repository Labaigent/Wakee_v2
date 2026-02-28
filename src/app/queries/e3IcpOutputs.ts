import { useQuery } from '@tanstack/react-query';
import { fetchE3IcpOutputs } from '@/services/supabaseService';

export const E3_ICP_OUTPUTS_QUERY_KEY = (ejecucionId: number) =>
  ['e3IcpOutputs', ejecucionId] as const;

export function useE3IcpOutputsQuery(ejecucionId: number | null) {
  return useQuery({
    queryKey: E3_ICP_OUTPUTS_QUERY_KEY(ejecucionId!),
    queryFn: () => fetchE3IcpOutputs(ejecucionId!),
    enabled: Boolean(ejecucionId),
  });
}
