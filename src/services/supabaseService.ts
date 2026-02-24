import { supabase, isSupabaseAvailable } from './supabaseClient';
import type { SenalMercado } from '../types/db/senalMercado';
import type { GanchoMercado } from '../types/db/ganchoMercado';
import type { Semana } from '../types/db/semana';

/**
 * Fetch market signals for a given week from Supabase
 *
 * Purpose: Retrieves all `senales_mercado` records associated with a specific
 * week, identified either by the week's numeric ID or its Monday date string.
 * When `fechaLunes` is provided, a preliminary lookup against the `semanas`
 * table resolves the numeric ID before querying `senales_mercado`.
 *
 * TODO: Add ordering parameter once display requirements are confirmed.
 * Future: Accept a `limit` param when pagination is added to the Report view.
 *
 * @param {{ semanaId: number }} params - Direct lookup by week ID
 * @returns {Promise<SenalMercado[]>} Array of market signal records
 * Returns empty array if Supabase is unavailable or no semana is found
 */
export async function fetchSenalesMercado(params: { semanaId: number }): Promise<SenalMercado[]>;

/**
 * @param {{ fechaLunes: string }} params - Lookup by Monday date (e.g., '2026-02-10')
 * @returns {Promise<SenalMercado[]>} Array of market signal records
 * Returns empty array if Supabase is unavailable or no semana is found
 */
export async function fetchSenalesMercado(params: { fechaLunes: string }): Promise<SenalMercado[]>;

export async function fetchSenalesMercado(
  params: { semanaId?: number; fechaLunes?: string }
): Promise<SenalMercado[]> {
  // Graceful degradation: return empty array if Supabase is not configured
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty senales_mercado list');
    return [];
  }

  try {
    let semanaId = params.semanaId;

    if (!semanaId) {
      // Indirect path: resolve Monday date to semana ID via semanas table
      const { data } = await supabase
        .from('semanas')
        .select('id')
        .eq('fecha_inicio_semana', params.fechaLunes)
        .maybeSingle();

      if (!data) return [];
      semanaId = data.id;
    }

    // Query senales_mercado filtered by semana_id, ordered by creation date
    const { data, error } = await supabase
      .from('senales_mercado')
      .select('*')
      .eq('semana_id', semanaId)
      .order('fecha_creacion', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('[supabaseService] Failed to fetch senales_mercado:', error);
    throw new Error('Failed to retrieve market signals from database');
  }
}

/**
 * Fetch market hooks for a given week from Supabase
 *
 * Purpose: Retrieves all `ganchos_mercado` records associated with a specific
 * week, identified either by the week's numeric ID or its Monday date string.
 * When `fechaLunes` is provided, a preliminary lookup against the `semanas`
 * table resolves the numeric ID before querying `ganchos_mercado`.
 *
 * Note: `key_points` is stored as a JSON-serialized string — callers must
 * parse it with JSON.parse() before rendering.
 *
 * @param {{ semanaId: number }} params - Direct lookup by week ID
 * @returns {Promise<GanchoMercado[]>} Array of market hook records
 * Returns empty array if Supabase is unavailable or no semana is found
 */
export async function fetchGanchosMercado(params: { semanaId: number }): Promise<GanchoMercado[]>;

/**
 * @param {{ fechaLunes: string }} params - Lookup by Monday date (e.g., '2026-02-10')
 * @returns {Promise<GanchoMercado[]>} Array of market hook records
 * Returns empty array if Supabase is unavailable or no semana is found
 */
export async function fetchGanchosMercado(params: { fechaLunes: string }): Promise<GanchoMercado[]>;

export async function fetchGanchosMercado(
  params: { semanaId?: number; fechaLunes?: string }
): Promise<GanchoMercado[]> {
  // Graceful degradation: return empty array if Supabase is not configured
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty ganchos_mercado list');
    return [];
  }

  try {
    let semanaId = params.semanaId;

    if (!semanaId) {
      // Indirect path: resolve Monday date to semana ID via semanas table
      const { data } = await supabase
        .from('semanas')
        .select('id')
        .eq('fecha_inicio_semana', params.fechaLunes)
        .maybeSingle();

      if (!data) return [];
      semanaId = data.id;
    }

    // Query ganchos_mercado filtered by semana_id, ordered by creation date
    const { data, error } = await supabase
      .from('ganchos_mercado')
      .select('*')
      .eq('semana_id', semanaId)
      .order('fecha_creacion', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('[supabaseService] Failed to fetch ganchos_mercado:', error);
    throw new Error('Failed to retrieve market hooks from database');
  }
}

/**
 * Fetch all weeks from Supabase
 *
 * Purpose: Retrieves all `semanas` records ordered from most recent to oldest.
 * Used by the week navigation in `MasterIntelligenceReport` to drive the
 * header display and prev/next arrow controls.
 *
 * @returns {Promise<Semana[]>} Array of week records ordered by fecha_inicio_semana DESC
 * Returns empty array if Supabase is unavailable
 */
export async function fetchSemanas(): Promise<Semana[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty semanas list');
    return [];
  }

  const { data, error } = await supabase
    .from('semanas')
    .select('*')
    .order('fecha_inicio_semana', { ascending: false });

  if (error) throw error;
  return data || [];
}

