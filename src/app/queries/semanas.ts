import { useQuery } from '@tanstack/react-query';
import { fetchSemanas } from '@/services/supabaseService';

// QueryKey como constante exportada — permite importarla en invalidaciones
export const SEMANAS_QUERY_KEY = ['semanas'] as const;

export function useSemanasQuery() {
  return useQuery({
    queryKey: SEMANAS_QUERY_KEY,
    queryFn: fetchSemanas,
  });
}
