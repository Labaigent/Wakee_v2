import { useEffect, useState } from 'react';
import { supabase, isSupabaseAvailable } from '@/services/supabaseClient';
import type { BusquedaProgreso, EstadoSubPaso } from '@/types/db/e6BusquedaLeads';

const PROGRESO_INICIAL: BusquedaProgreso = {
  extraccion_sn: 'pendiente',
  enriquecimiento_leads: 'pendiente',
  enriquecimiento_empresas: 'pendiente',
  calculo_score: 'pendiente',
};

const COLUMNAS_PROGRESO: (keyof BusquedaProgreso)[] = [
  'extraccion_sn',
  'enriquecimiento_leads',
  'enriquecimiento_empresas',
  'calculo_score',
];

function extraerProgreso(row: Record<string, unknown>): BusquedaProgreso {
  return {
    extraccion_sn: (row.extraccion_sn as EstadoSubPaso) ?? 'pendiente',
    enriquecimiento_leads: (row.enriquecimiento_leads as EstadoSubPaso) ?? 'pendiente',
    enriquecimiento_empresas: (row.enriquecimiento_empresas as EstadoSubPaso) ?? 'pendiente',
    calculo_score: (row.calculo_score as EstadoSubPaso) ?? 'pendiente',
  };
}

export function useBusquedaProgreso(ejecucionId: number | null) {
  const [progreso, setProgreso] = useState<BusquedaProgreso>(PROGRESO_INICIAL);

  useEffect(() => {
    if (!ejecucionId || !isSupabaseAvailable() || !supabase) return;

    // 1. Lectura inicial — sincroniza si el proceso ya había avanzado antes de montar
    supabase
      .schema('ejecuciones')
      .from('e6_busqueda_leads')
      .select(COLUMNAS_PROGRESO.join(', '))
      .eq('in_ejecucion_id', ejecucionId)
      .single()
      .then(({ data }) => {
        if (data) setProgreso(extraerProgreso(data as unknown as Record<string, unknown>));
      });

    // 2. Suscripción Realtime — escucha UPDATEs en la fila específica
    const channel = supabase
      .channel(`progreso-busqueda-${ejecucionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'ejecuciones',
          table: 'e6_busqueda_leads',
          filter: `in_ejecucion_id=eq.${ejecucionId}`,
        },
        (payload) => {
          setProgreso(extraerProgreso(payload.new));
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [ejecucionId]);

  const estaCompleto = progreso.calculo_score === 'completado';
  const tieneError = Object.values(progreso).some((s: EstadoSubPaso) => s === 'error');
  const subPasosCompletados = Object.values(progreso).filter((s: EstadoSubPaso) => s === 'completado').length;
  const porcentajeGeneral = Math.round((subPasosCompletados / 4) * 100);

  return { progreso, estaCompleto, tieneError, porcentajeGeneral };
}
