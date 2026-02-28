import { useQuery } from '@tanstack/react-query';
import { fetchGanchosMercado } from '@/services/supabaseService';

export const GANCHOS_MERCADO_QUERY_KEY = (semanaId: number) =>
  ['ganchosMercado', semanaId] as const;

export function useGanchosMercadoQuery(semanaId: number | null) {
  return useQuery({
    queryKey: GANCHOS_MERCADO_QUERY_KEY(semanaId!),
    queryFn: () => fetchGanchosMercado({ semanaId: semanaId! }),
    enabled: Boolean(semanaId),
  });
}
