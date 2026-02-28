import { useQuery } from '@tanstack/react-query';
import { fetchSenalesMercado } from '@/services/supabaseService';

export const SENALES_MERCADO_QUERY_KEY = (semanaId: number) =>
  ['senalesMercado', semanaId] as const;

export function useSenalesMercadoQuery(semanaId: number | null) {
  return useQuery({
    queryKey: SENALES_MERCADO_QUERY_KEY(semanaId!),
    queryFn: () => fetchSenalesMercado({ semanaId: semanaId! }),
    enabled: Boolean(semanaId),
  });
}
