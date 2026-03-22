---
description: Recibir progreso en tiempo real desde n8n vía Supabase Realtime — columnas de estado en e6_busqueda_leads, suscripción postgres_changes y hook de React para reflejar sub-pasos en la UI.
allowed-tools: mcp__supabase__execute_sql, mcp__supabase__apply_migration, Bash(npx tsc --noEmit), Read, Edit, Write, Glob, Grep
---

# Skill: Progreso en tiempo real con Supabase Realtime

Patrón para que la UI refleje el avance real de un proceso largo que corre en n8n (ej: búsqueda E6). En lugar de simular progreso con `setTimeout`, n8n actualiza columnas de estado en `ejecuciones.e6_busqueda_leads` y el frontend reacciona en tiempo real gracias a Supabase Realtime (`postgres_changes`).

**Este skill es el modelo a seguir para cualquier pantalla de "cargando" que dependa de un proceso en n8n.**

---

## Contexto del problema

El componente `StepBusqueda` muestra una pantalla de progreso mientras n8n ejecuta varios sub-pasos en segundo plano. Actualmente los pasos están hardcoded con `setTimeout`. El proceso real en n8n es:

| Sub-paso | Columna | Dependencia | Descripción |
|----------|---------|-------------|-------------|
| 1 | `extraccion_sn` | Ninguna (primero) | Extracción de datos desde Sales Navigator |
| 2 | `enriquecimiento_leads` | Espera a sub-paso 1 | Enriquecimiento de perfiles de leads |
| 3 | `enriquecimiento_empresas` | Espera a sub-paso 1 | Enriquecimiento de datos de empresas |
| 4 | `calculo_score` | Espera a sub-pasos 2 **y** 3 | Cálculo del puntaje final de cada lead |

> Los sub-pasos 2 y 3 corren **en paralelo** después de que el sub-paso 1 termina. El sub-paso 4 espera a que ambos completen.

---

## Arquitectura del flujo

```
Usuario confirma en Step 3 (Filtro)
        │
        ▼
Frontend dispara webhook n8n (POST)
Frontend navega a StepBusqueda → monta hook useBusquedaProgreso
        │                         (suscripción Realtime activa)
        │
        ▼ (en n8n, cada nodo actualiza columnas en e6_busqueda_leads)
n8n: SET extraccion_sn = 'en_progreso'           ──→  UI: spinner en paso 1
n8n: completa extracción SN
n8n: SET extraccion_sn = 'completado',
     enriquecimiento_leads = 'en_progreso',
     enriquecimiento_empresas = 'en_progreso'    ──→  UI: ✓ paso 1, spinner en 2 y 3
n8n: completa enriquecimiento leads
n8n: SET enriquecimiento_leads = 'completado'    ──→  UI: ✓ paso 2 (3 sigue girando)
n8n: completa enriquecimiento empresas
n8n: SET enriquecimiento_empresas = 'completado' ──→  UI: ✓ paso 3
n8n: SET calculo_score = 'en_progreso'            ─→  UI: spinner en paso 4
n8n: completa scoring
n8n: SET calculo_score = 'completado'             ─→  UI: ✓ paso 4, auto-navega a Ranking
```

---

## Modelo de datos: tabla `ejecuciones.e6_busqueda_leads`

La tabla ya existe en la base de datos con la siguiente estructura:

```sql
-- Estructura de ejecuciones.e6_busqueda_leads (ya creada)
-- Columnas principales:
--   id                        INTEGER NOT NULL (PK)
--   in_SchCore_perfil_id      INTEGER NOT NULL
--   in_ejecucion_id           INTEGER (FK a ejecuciones.ejecucion)
--   in_link_to_scrape         TEXT NOT NULL
--   estado                    TEXT NOT NULL DEFAULT 'activa'
--   fecha_creacion            TIMESTAMPTZ NOT NULL DEFAULT now()
--   fecha_inicio              TIMESTAMPTZ
--   fecha_finalizacion        TIMESTAMPTZ
--   tokens_usados             INTEGER
--   costo                     NUMERIC
--
-- Columnas de progreso por sub-paso:
--   extraccion_sn             TEXT DEFAULT 'pendiente'
--   enriquecimiento_leads     TEXT DEFAULT 'pendiente'
--   enriquecimiento_empresas  TEXT DEFAULT 'pendiente'
--   calculo_score             TEXT DEFAULT 'pendiente'
```

**Estados posibles de cada columna de sub-paso:**

| Estado | Significado |
|--------|-------------|
| `'pendiente'` | Aún no ha iniciado |
| `'en_progreso'` | n8n está ejecutando este sub-paso |
| `'completado'` | Sub-paso terminó exitosamente |
| `'error'` | Sub-paso falló |

> **Nota:** Las 4 columnas de progreso son columnas TEXT individuales (no JSONB). n8n crea la fila en esta tabla al iniciar el proceso de búsqueda E6 y va actualizando cada columna conforme avanza.

---

## Prerequisitos

- `src/services/supabaseClient.ts` existe y exporta `supabase` e `isSupabaseAvailable`
- Supabase Realtime habilitado en la tabla `ejecuciones.e6_busqueda_leads` (ver Paso 1)
- RLS permite SELECT para el rol `anon` (o el rol que use la app) en `ejecuciones.e6_busqueda_leads`
- n8n tiene acceso a la base de datos para ejecutar UPDATEs

---

## Paso 1 — Habilitar Supabase Realtime en la tabla

Desde el Dashboard de Supabase → Database → Replication, verificar que la tabla `ejecuciones.e6_busqueda_leads` está incluida en la publicación Realtime. Si no:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE ejecuciones.e6_busqueda_leads;
```

Verificar que la RLS existente permite SELECT:

```sql
SELECT rowsecurity FROM pg_tables
WHERE schemaname = 'ejecuciones' AND tablename = 'e6_busqueda_leads';

SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'ejecuciones' AND tablename = 'e6_busqueda_leads';
```

Si RLS está activo sin políticas de lectura:

```sql
CREATE POLICY "anon_read" ON ejecuciones.e6_busqueda_leads FOR SELECT TO anon USING (true);
```

---

## Paso 2 — Tipo TypeScript para el progreso

**Archivo:** `src/types/db/e6BusquedaLeads.ts`

```typescript
export type EstadoSubPaso = 'pendiente' | 'en_progreso' | 'completado' | 'error';

export interface E6BusquedaLeads {
  id: number;
  in_SchCore_perfil_id: number;
  in_ejecucion_id: number | null;
  in_link_to_scrape: string;
  estado: string;
  fecha_creacion: string;
  fecha_inicio: string | null;
  fecha_finalizacion: string | null;
  tokens_usados: number | null;
  costo: number | null;
  extraccion_sn: EstadoSubPaso;
  enriquecimiento_leads: EstadoSubPaso;
  enriquecimiento_empresas: EstadoSubPaso;
  calculo_score: EstadoSubPaso;
}

/** Solo las 4 columnas de progreso — subset usado por el hook de Realtime */
export interface BusquedaProgreso {
  extraccion_sn: EstadoSubPaso;
  enriquecimiento_leads: EstadoSubPaso;
  enriquecimiento_empresas: EstadoSubPaso;
  calculo_score: EstadoSubPaso;
}
```

**Convenciones:**
| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Nombre del archivo | camelCase, singular | `e6BusquedaLeads.ts` |
| Estados en BD | Español, snake_case | `'en_progreso'` |
| Tipo de estado | Union type exportado | `EstadoSubPaso` |
| Interfaz completa | Refleja todas las columnas de la tabla | `E6BusquedaLeads` |
| Interfaz de progreso | Subset con solo las 4 columnas de estado | `BusquedaProgreso` |

---

## Paso 3 — Hook `useBusquedaProgreso`

**Archivo:** `src/app/hooks/useBusquedaProgreso.ts`

El hook combina una lectura inicial (fetch directo) con una suscripción Realtime que escucha cambios en la fila de `e6_busqueda_leads` filtrada por `in_ejecucion_id`.

```typescript
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

/** Extrae las 4 columnas de progreso de un row de e6_busqueda_leads */
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
        if (data) setProgreso(extraerProgreso(data));
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
      supabase.removeChannel(channel);
    };
  }, [ejecucionId]);

  // Derivados útiles para el componente
  const estaCompleto = progreso.calculo_score === 'completado';
  const tieneError = Object.values(progreso).some((s: EstadoSubPaso) => s === 'error');
  const subPasosCompletados = Object.values(progreso).filter((s: EstadoSubPaso) => s === 'completado').length;
  const porcentajeGeneral = Math.round((subPasosCompletados / 4) * 100);

  return { progreso, estaCompleto, tieneError, porcentajeGeneral };
}
```

**Convenciones obligatorias:**
| Elemento | Formato | Ejemplo |
|----------|---------|---------|
| Nombre del hook | `use{Concepto}` — español | `useBusquedaProgreso` |
| Tabla suscrita | `ejecuciones.e6_busqueda_leads` | — |
| Filtro Realtime | `in_ejecucion_id=eq.{ejecucionId}` | `in_ejecucion_id=eq.42` |
| Nombre del canal | `progreso-busqueda-{ejecucionId}` | `progreso-busqueda-42` |
| Cleanup | `supabase.removeChannel(channel)` en el return del `useEffect` | ver código |
| Estado inicial | Constante fuera del componente | `PROGRESO_INICIAL` |
| Extracción de progreso | Helper `extraerProgreso` reutilizado en lectura inicial y en callback Realtime | ver código |

> **Regla crítica:** Siempre llamar `removeChannel` en el cleanup del `useEffect`. Si no, las suscripciones se acumulan al re-montar el componente.

---

## Paso 4 — Uso en el componente `StepBusqueda`

**4a. Reemplazar el `useEffect` con `setTimeout` por el hook real:**

```typescript
import { useBusquedaProgreso } from '@/app/hooks/useBusquedaProgreso';
import type { EstadoSubPaso } from '@/types/db/e6BusquedaLeads';
```

**4b. Dentro del componente, consumir el hook:**

```typescript
const { progreso, estaCompleto, tieneError, porcentajeGeneral } = useBusquedaProgreso(ejecucionId);

// Auto-navegar cuando el proceso completa
useEffect(() => {
  if (estaCompleto) {
    toast.success('Búsqueda completada.');
    onComplete();
  }
}, [estaCompleto]);
```

**4c. Definición de sub-pasos para la UI:**

```typescript
const SUB_PASOS_BUSQUEDA = [
  { clave: 'extraccion_sn',            etiqueta: 'Extracción de Sales Navigator',   detalle: 'Obteniendo leads desde tu búsqueda...' },
  { clave: 'enriquecimiento_leads',    etiqueta: 'Enriquecimiento de leads',        detalle: 'Completando perfiles de contacto...' },
  { clave: 'enriquecimiento_empresas', etiqueta: 'Enriquecimiento de empresas',     detalle: 'Investigando empresas de los leads...' },
  { clave: 'calculo_score',            etiqueta: 'Cálculo de puntuación final',     detalle: 'Evaluando alineación con tu ICP...' },
] as const;
```

**4d. Renderizado de la checklist:**

```tsx
{SUB_PASOS_BUSQUEDA.map(({ clave, etiqueta, detalle }) => {
  const estado: EstadoSubPaso = progreso[clave];
  return (
    <div key={clave} className="flex items-start gap-3">
      {estado === 'completado' ? (
        <CheckCircle2 className="size-5 text-[#1F554A] flex-shrink-0 mt-0.5" />
      ) : estado === 'en_progreso' ? (
        <Loader2 className="size-5 text-[#1F554A] animate-spin flex-shrink-0 mt-0.5" />
      ) : estado === 'error' ? (
        <XCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
      ) : (
        <div className="size-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={`text-sm font-medium ${estado !== 'pendiente' ? 'text-[#141414]' : 'text-gray-400'}`}>
          {etiqueta}
        </p>
        {estado === 'en_progreso' && (
          <p className="text-xs text-gray-600 mt-0.5">{detalle}</p>
        )}
        {estado === 'completado' && (
          <p className="text-xs text-[#1F554A] mt-0.5 font-medium">Completado</p>
        )}
        {estado === 'error' && (
          <p className="text-xs text-red-600 mt-0.5">Error en este paso</p>
        )}
      </div>
    </div>
  );
})}
```

> **Nota sobre los sub-pasos paralelos (2 y 3):** No necesitan tratamiento especial en la UI. Ambos mostrarán spinner simultáneamente porque n8n los marca como `'en_progreso'` al mismo tiempo. El usuario verá naturalmente que avanzan en paralelo.

---

## Paso 5 — UPDATEs desde n8n

En cada punto clave del workflow de n8n, agregar un nodo **Supabase** (o **Postgres**) que ejecute un UPDATE sobre las columnas de progreso en `ejecuciones.e6_busqueda_leads`.

**Al iniciar extracción de Sales Navigator:**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET extraccion_sn = 'en_progreso'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

**Al completar extracción SN y arrancar los pasos paralelos:**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET extraccion_sn = 'completado',
    enriquecimiento_leads = 'en_progreso',
    enriquecimiento_empresas = 'en_progreso'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

**Al completar enriquecimiento de leads:**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET enriquecimiento_leads = 'completado'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

**Al completar enriquecimiento de empresas:**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET enriquecimiento_empresas = 'completado'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

**Al iniciar cálculo de score (n8n lo lanza tras confirmar que 2 y 3 terminaron):**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET calculo_score = 'en_progreso'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

**Al completar scoring (último paso):**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET calculo_score = 'completado'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

**En caso de error en cualquier sub-paso (ejemplo con extraccion_sn):**

```sql
UPDATE ejecuciones.e6_busqueda_leads
SET extraccion_sn = 'error'
WHERE in_ejecucion_id = {{ $json.ejecucion_id }};
```

---

## Paso 6 — Props del componente `StepBusqueda`

Actualizar la interfaz de props para recibir `ejecucionId` en vez de `processingProgress`/`processingStatus`:

**Antes (simulado):**

```typescript
interface StepBusquedaProps {
  processingProgress: number;
  processingStatus: string;
  onProgress: (progress: number, status: string) => void;
  onComplete: () => void;
}
```

**Después (Realtime):**

```typescript
interface StepBusquedaProps {
  ejecucionId: number | null;
  onComplete: () => void;
}
```

El componente ya no necesita `processingProgress`, `processingStatus`, ni `onProgress` porque el hook `useBusquedaProgreso` maneja todo el estado internamente.

---

## Checklist de verificación

Después de implementar, verificar:

- [ ] Realtime habilitado en `ejecuciones.e6_busqueda_leads` (`ALTER PUBLICATION supabase_realtime ADD TABLE ...`)
- [ ] RLS permite SELECT en la tabla para el rol que usa la app
- [ ] El hook `useBusquedaProgreso` se suscribe al montar y hace `removeChannel` al desmontar
- [ ] La lectura inicial sincroniza el estado si el proceso ya había avanzado antes de montar
- [ ] Cada sub-paso en n8n ejecuta el UPDATE correspondiente sobre la columna de progreso
- [ ] La UI muestra spinner en los sub-pasos paralelos (2 y 3) simultáneamente
- [ ] Al completar el sub-paso 4 (`calculo_score = 'completado'`), la UI auto-navega al siguiente paso
- [ ] Si un sub-paso falla, la UI muestra el icono de error y no queda colgada
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] Se eliminaron `processingProgress`, `processingStatus` y `onProgress` que ya no se usan en `Segmentacion.tsx`

---

## Lo que NO hacer

- No usar `setTimeout` ni `setInterval` para simular progreso — el hook `useBusquedaProgreso` refleja datos reales
- No olvidar `removeChannel` en el cleanup del `useEffect` — las suscripciones se acumulan y causan actualizaciones fantasma
- No crear un canal Realtime sin filtro (`filter: in_ejecucion_id=eq.{ejecucionId}`) — recibirías cambios de TODAS las búsquedas
- No hacer polling (`refetchInterval`) si ya tienes Realtime activo — son mecanismos redundantes
- No asumir que la suscripción llegará antes que la lectura inicial — siempre hacer fetch + subscribe, nunca solo subscribe
- No olvidar que las columnas de progreso tienen default `'pendiente'` — el hook debe respetar ese valor inicial
- No marcar un sub-paso como `'completado'` en n8n sin antes haberlo marcado como `'en_progreso'` — la UI salta visualmente
- No suscribirse a `ejecuciones.ejecucion` — el progreso vive en `ejecuciones.e6_busqueda_leads`

---

## Referencia: archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/types/db/e6BusquedaLeads.ts` | Tipos `E6BusquedaLeads`, `BusquedaProgreso` y `EstadoSubPaso` |
| `src/app/hooks/useBusquedaProgreso.ts` | Hook con lectura inicial + suscripción Realtime |
| `src/app/components/Segmentacion/steps/Step_4_Busqueda.tsx` | Componente consumer — reemplaza simulación por datos reales |
| `src/app/components/Segmentacion/Segmentacion.tsx` | Padre — eliminar props de progreso simulado, pasar `ejecucionId` |
| `src/services/supabaseClient.ts` | Cliente Supabase singleton (ya existe) |

**Tabla de BD:** `ejecuciones.e6_busqueda_leads` — columnas `extraccion_sn`, `enriquecimiento_leads`, `enriquecimiento_empresas`, `calculo_score`

Para referencia de patrones existentes en el proyecto:

- `supabaseClient.ts` — singleton con `isSupabaseAvailable()` (reusar en el hook)
- `supabaseService.ts` — patrón `.schema('ejecuciones').from('{tabla}')` para queries
- `n8nService.ts` — referencia de cómo se disparan los webhooks que inician el proceso
