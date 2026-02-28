import { supabase, isSupabaseAvailable } from './supabaseClient';
import type { SenalMercado } from '../types/db/senalMercado';
import type { GanchoMercado } from '../types/db/ganchoMercado';
import type { Semana } from '../types/db/semana';
import type { InputEstrategicoOption } from '../types/db/inputEstrategico';
import type { Ejecucion } from '../types/db/ejecucion';
import type { E3IcpOutput } from '../types/db/e3IcpOutput';

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
      const { data, error } = await supabase
        .from('semanas')
        .select('id')
        .eq('fecha_inicio_semana', params.fechaLunes)
        .maybeSingle();

      if (error) {
        throw new Error('Failed to retrieve semana ID from public.semanas');
      }
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
  } catch {
    throw new Error('Failed to retrieve market signals from public.senales_mercado');
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
      const { data, error } = await supabase
        .from('semanas')
        .select('id')
        .eq('fecha_inicio_semana', params.fechaLunes)
        .maybeSingle();

      if (error) {
        throw new Error('Failed to retrieve semana ID from public.semanas');
      }
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
  } catch {
    throw new Error('Failed to retrieve market hooks from public.ganchos_mercado');
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

  try {
    const { data, error } = await supabase
      .from('semanas')
      .select('*')
      .order('fecha_inicio_semana', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch {
    throw new Error('Failed to retrieve weeks from public.semanas');
  }
}

/**
 * Fetch strategic input options from Supabase
 *
 * Purpose: Retrieves distinct `category` and `subcategory` values from
 * `config.inputs_estrategicos` to populate the NuevaSesion dropdowns.
 *
 * Note: Supabase JS does not expose a native DISTINCT select option, so we
 * dedupe results client-side to keep the data clean and consistent.
 *
 * @returns {Promise<InputEstrategicoOption[]>} Array of unique category/subcategory pairs
 * Returns empty array if Supabase is unavailable
 */
export async function fetchInputsEstrategicos(): Promise<InputEstrategicoOption[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty inputs_estrategicos list');
    return [];
  }

  try {
    const { data, error } = await supabase
      .schema('config')
      .from('inputs_estrategicos')
      .select('id, category, subcategory')
      .order('category', { ascending: true })
      .order('subcategory', { ascending: true });

    if (error) throw error;

    const rows = data || [];
    const uniqueRows = Array.from(
      new Map(
        rows.map(row => [
          `${row.category ?? ''}||${row.subcategory ?? ''}`,
          row,
        ])
      ).values()
    );

    return uniqueRows;
  } catch {
    throw new Error('Failed to retrieve strategic inputs from config.inputs_estrategicos');
  }
}

/**
 * Fetch all executions from Supabase
 *
 * Purpose: Retrieves all `ejecucion` records from the `ejecuciones` schema,
 * ordered by start date descending (most recent first). Used by the
 * Segmentacion component to populate the execution dropdown.
 *
 * @returns {Promise<Ejecucion[]>} Array of execution records
 * Returns empty array if Supabase is unavailable
 */
export async function fetchEjecuciones(): Promise<Ejecucion[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty ejecuciones list');
    return [];
  }
  try {
    // Fetch both in parallel — config.etapas labels are used to enrich ejecucion rows
    const [etapasResult, ejecucionesResult] = await Promise.all([
      supabase.schema('config').from('etapas').select('id, label'),
      supabase.schema('ejecuciones').from('ejecucion').select('*').order('id', { ascending: false }),
    ]);

    if (etapasResult.error) throw etapasResult.error;
    if (ejecucionesResult.error) throw ejecucionesResult.error;

    const labelMap = new Map(
      (etapasResult.data ?? []).map((e) => [e.id as number, e.label as string])
    );

    return (ejecucionesResult.data ?? []).map((ej) => ({
      ...ej,
      etapa_label: labelMap.get(ej.etapa_siguiente) ?? null,
    }));
  } catch {
    throw new Error('Failed to retrieve executions from ejecuciones.ejecucion');
  }
}

/**
 * Insert a new execution record into Supabase
 *
 * Purpose: Creates a new `ejecucion` row in the `ejecuciones` schema
 * with the current timestamp as both start and last-updated dates.
 * etapa_siguiente is always 3 for newly created sessions.
 *
 * @returns {Promise<Ejecucion>} The newly created execution record (with generated id)
 * @throws If Supabase is unavailable or the insert fails
 */
export async function insertEjecucion(inputsEstrategicosId: number): Promise<Ejecucion> {
  if (!isSupabaseAvailable() || !supabase) {
    throw new Error('[supabaseService] Supabase is not available — cannot insert ejecucion');
  }

  const { data, error } = await supabase
    .rpc('crear_ejecucion', { p_inputs_estrategicos_id: inputsEstrategicosId })
    .single();

  if (error) throw new Error('Failed to insert execution into ejecuciones.ejecucion');

  return { ...(data as Record<string, unknown>), etapa_label: null } as Ejecucion;
}

/**
 * Obtiene los ICPs generados (E3) para una ejecución específica.
 * Tabla: ejecuciones.e3_ejecucion_outpu_icp (sin RLS)
 */
export async function fetchE3IcpOutputs(ejecucionId: number): Promise<E3IcpOutput[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase no disponible - devolviendo lista vacía de e3 ICP outputs');
    return [];
  }
  try {
    const { data, error } = await supabase
      .schema('ejecuciones')
      .from('e3_ejecucion_outpu_icp')
      .select('*')
      .eq('ejecucion_id', ejecucionId)
      .order('icp_rank', { ascending: true });
    if (error) throw error;
    return data ?? [];
  } catch {
    throw new Error('Failed to retrieve E3 ICP outputs from ejecuciones.e3_ejecucion_outpu_icp');
  }
}
