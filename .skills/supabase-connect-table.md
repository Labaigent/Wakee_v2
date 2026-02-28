---
description: Conectar una tabla de Supabase al frontend — tipo, servicio, query hook y componente. Modelo canónico para todas las conexiones futuras.
allowed-tools: mcp__supabase__execute_sql, mcp__supabase__apply_migration, Bash(npx tsc --noEmit), Read, Edit, Write, Glob, Grep
---

# Skill: Conectar una nueva tabla de Supabase

Patrón canónico para exponer cualquier tabla de Supabase en el frontend: tipo TypeScript → función en `supabaseService.ts` → hook de React Query → uso en componente. Incluye el patrón de enriquecimiento con JOIN vía `Promise.all` cuando se necesitan labels de tablas de configuración.

**Este skill es el modelo a seguir para todas las conexiones futuras a Supabase.**

---

## Prerequisitos

- `src/services/supabaseClient.ts` y `src/services/supabaseService.ts` existen en el proyecto
- Si vas a usar React Query: `@tanstack/react-query` instalado y `QueryClientProvider` activo (ver skill `tanstack-query-cache`)

---

## Paso 0 — Recopilar información (OBLIGATORIO antes de escribir código)

**Antes de escribir una sola línea de código, hacer las siguientes preguntas al usuario:**

**Pregunta 1 — Tablas:**
> "¿Qué tabla(s) necesito conectar? Indica el schema y el nombre exacto (ej: `ejecuciones.ejecucion`).
> Si el componente necesita mostrar labels de una tabla de configuración, indícalo también (ej: `config.etapas`)."

**Pregunta 2 — Estrategia de caché:**
> "¿Quieres que estos datos tengan caché con React Query, o prefieres un fetch directo sin caché?
> - **React Query (recomendado):** si el dato se comparte entre componentes, o necesitarás invalidarlo tras una mutación
> - **Fetch directo:** si es una operación puntual o una mutación que no necesita compartirse"

**Pregunta 3 — Parámetros:**
> "¿El query necesita parámetros para filtrar? (ej: `semana_id`, `perfil_id`)
> Si no, el hook devuelve todos los registros ordenados."

No avanzar al Paso 1 hasta tener respuesta a las tres preguntas.

---

## Paso 1 — Verificar RLS en todas las tablas involucradas

Para **cada tabla** mencionada en el Paso 0, ejecutar:

```sql
-- Verificar si RLS está activo
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = '{schema}' AND tablename = '{tabla}';

-- Verificar políticas existentes
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = '{schema}' AND tablename = '{tabla}';
```

**Interpretar el resultado:**

| rowsecurity | Políticas | Situación | Acción |
|---|---|---|---|
| `false` | — | Sin RLS | No hacer nada |
| `true` | Existen | RLS activo con acceso | Verificar que el rol `anon` tiene SELECT |
| `true` | Ninguna | **Bug silencioso** | Crear política antes de continuar |

Cuando RLS está activo sin políticas, la query devuelve `[]` sin error — el bug es invisible hasta inspeccionar la BD.

**Fix para tablas de configuración estática (data pública, no por usuario):**

```sql
CREATE POLICY "anon_read" ON {schema}.{tabla} FOR SELECT TO anon USING (true);
```

> **Regla:** Nunca asumir que una tabla es accesible. Verificar RLS para cada tabla antes de codificar.

---

## Paso 2 — Crear el tipo en `src/types/db/`

**Archivo:** `src/types/db/{entidad}.ts` — singular, camelCase

**Estructura base:**

```typescript
export interface {Entidad} {
  id: number;
  campo_uno: string;
  campo_dos: string | null; // null si la columna es nullable en BD
}
```

**Si el servicio enriquece con datos de otra tabla (JOIN vía `Promise.all`), agregar el campo al final con comentario:**

```typescript
export interface {Entidad} {
  id: number;
  campo_uno: string;
  campo_dos: string | null;
  // Resolved at service layer via JOIN with {schema_config}.{tabla_config} — not a raw DB column
  {campo_enriquecido}: string | null;
}
```

**Ejemplo real (`ejecucion.ts`):**

```typescript
export interface Ejecucion {
  id: number;
  perfil_id: number;
  estado: 'activa' | 'completada' | 'error';
  etapa_siguiente: number;
  fecha_inicio: string;
  ultima_fecha_actualizacion: string;
  fecha_finalizacion: string | null;
  // Resolved at service layer via JOIN with config.etapas — not a raw DB column
  etapa_label: string | null;
}
```

**Convenciones obligatorias:**
| Elemento | Formato | Ejemplo |
|---|---|---|
| Nombre del archivo | `{entidad}.ts` — singular, camelCase | `ejecucion.ts` |
| Nombre de la interfaz | `{Entidad}` — PascalCase, singular | `Ejecucion` |
| Columnas nullable | `tipo \| null` | `fecha_finalizacion: string \| null` |
| Campo enriquecido (JOIN) | Al final, con comentario explicativo | ver ejemplo |

---

## Paso 3 — Agregar la función en `supabaseService.ts`

Abrir `src/services/supabaseService.ts` y agregar en orden:

**3a. Import del tipo** (junto a los otros imports al inicio del archivo):

```typescript
import type { {Entidad} } from '../types/db/{entidad}';
```

**3b. Función al final del archivo — query simple:**

```typescript
/**
 * Fetch {descripción breve} from Supabase
 *
 * Purpose: {qué hace y para qué se usa en el frontend}.
 *
 * @returns {Promise<{Entidad}[]>} Array of {entidad} records
 * Returns empty array if Supabase is unavailable
 */
export async function fetch{Entidades}(): Promise<{Entidad}[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty {entidades} list');
    return [];
  }
  try {
    const { data, error } = await supabase
      .schema('{schema}')        // omitir si la tabla está en el schema public
      .from('{tabla}')
      .select('*')
      .order('{columna_orden}', { ascending: false });
    if (error) throw error;
    return data ?? [];
  } catch {
    throw new Error('Failed to retrieve {descripción} from {schema}.{tabla}');
  }
}
```

**3c. Función al final del archivo — query con JOIN vía `Promise.all`:**

Usar cuando el componente necesita labels de una tabla de configuración.
Nombrar las variables del `Promise.all` según las tablas que representan.

```typescript
export async function fetch{Entidades}(): Promise<{Entidad}[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty {entidades} list');
    return [];
  }
  try {
    // Fetch both in parallel — {schema_config}.{tabla_config} labels are used to enrich {tabla} rows
    const [{tablaConfigResult}, {tablaPrincipalResult}] = await Promise.all([
      supabase.schema('{schema_config}').from('{tabla_config}').select('id, {campo_label}'),
      supabase.schema('{schema}').from('{tabla}').select('*').order('{columna_orden}', { ascending: false }),
    ]);

    if ({tablaConfigResult}.error) throw {tablaConfigResult}.error;
    if ({tablaPrincipalResult}.error) throw {tablaPrincipalResult}.error;

    const {entidadConfig}Map = new Map(
      ({tablaConfigResult}.data ?? []).map((e) => [e.id as number, e.{campo_label} as string])
    );

    return ({tablaPrincipalResult}.data ?? []).map((row) => ({
      ...row,
      {campo_enriquecido}: {entidadConfig}Map.get(row.{fk_columna}) ?? null,
    }));
  } catch {
    throw new Error('Failed to retrieve {descripción} from {schema}.{tabla}');
  }
}
```

**Ejemplo real (`fetchEjecuciones` con JOIN a `config.etapas`):**

```typescript
export async function fetchEjecuciones(): Promise<Ejecucion[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty ejecuciones list');
    return [];
  }
  try {
    // Fetch both in parallel — config.etapas labels are used to enrich ejecucion rows
    const [etapasResult, ejecucionesResult] = await Promise.all([
      supabase.schema('config').from('etapas').select('id, label'),
      supabase.schema('ejecuciones').from('ejecucion').select('*').order('fecha_inicio', { ascending: false }),
    ]);

    if (etapasResult.error) throw etapasResult.error;
    if (ejecucionesResult.error) throw ejecucionesResult.error;

    const etapasMap = new Map(
      (etapasResult.data ?? []).map((e) => [e.id as number, e.label as string])
    );

    return (ejecucionesResult.data ?? []).map((row) => ({
      ...row,
      etapa_label: etapasMap.get(row.etapa_siguiente) ?? null,
    }));
  } catch {
    throw new Error('Failed to retrieve executions from ejecuciones.ejecucion');
  }
}
```

**Convenciones obligatorias:**
| Elemento | Formato | Ejemplo |
|---|---|---|
| Nombre de la función | `fetch{Entidades}` — plural | `fetchEjecuciones` |
| Warning log | `'[supabaseService] Supabase is not available - returning empty {entidades} list'` | ver ejemplo |
| Error throw | `'Failed to retrieve {descripción} from {schema}.{tabla}'` | ver ejemplo |
| Schema no-public | `.schema('{schema}')` antes de `.from()` | `.schema('ejecuciones')` |
| Nullish coalescing | `data ?? []` — nunca `data \|\| []` | ver ejemplo |
| Variables de `Promise.all` | Nombrar según las tablas que representan | `etapasResult`, `ejecucionesResult` |
| Variable del Map | `{entidadConfig}Map` | `etapasMap` |

---

## Paso 4 — Crear el query file (solo si usas React Query)

Si en el Paso 0 el usuario eligió React Query:

**Archivo:** `src/app/queries/{entidades}.ts` — plural

**Sin parámetros:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetch{Entidades} } from '@/services/supabaseService';

export const {ENTIDADES}_QUERY_KEY = ['{entidades}'] as const;

export function use{Entidades}Query() {
  return useQuery({
    queryKey: {ENTIDADES}_QUERY_KEY,
    queryFn: fetch{Entidades},
  });
}
```

**Con parámetros:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetch{Entidades} } from '@/services/supabaseService';

export const {ENTIDADES}_QUERY_KEY = ({param}: {Tipo}) =>
  ['{entidades}', {param}] as const;

export function use{Entidades}Query({param}: {Tipo} | undefined) {
  return useQuery({
    queryKey: {ENTIDADES}_QUERY_KEY({param}!),
    queryFn: () => fetch{Entidades}({ {param}: {param}! }),
    enabled: Boolean({param}),
  });
}
```

**Ejemplo real (`ejecuciones.ts`):**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchEjecuciones } from '@/services/supabaseService';

export const EJECUCIONES_QUERY_KEY = ['ejecuciones'] as const;

export function useEjecucionesQuery() {
  return useQuery({
    queryKey: EJECUCIONES_QUERY_KEY,
    queryFn: fetchEjecuciones,
  });
}
```

**Convenciones obligatorias:**
| Elemento | Formato | Ejemplo |
|---|---|---|
| Nombre del archivo | `{entidades}.ts` — plural | `ejecuciones.ts` |
| Nombre del hook | `use{Entidades}Query` | `useEjecucionesQuery` |
| Nombre de la key | `{ENTIDADES}_QUERY_KEY` — SCREAMING_SNAKE_CASE | `EJECUCIONES_QUERY_KEY` |
| Valor de la key | `['{entidades}']` — array con string plural en minúsculas | `['ejecuciones']` |

Si el usuario eligió **fetch directo**: omitir este paso y llamar a `fetch{Entidades}()` desde el componente directamente.

---

## Paso 5 — Usar el hook en el componente

**Import a agregar:**

```typescript
import { use{Entidades}Query } from '@/app/queries/{entidades}';
```

**Dentro del componente, antes del return (junto a otros hooks):**

```typescript
const { data: {entidades} = [], isLoading: {entidades}Loading } = use{Entidades}Query();
```

**Patrón de renderizado con estados de carga y vacío:**

```tsx
{entidades}Loading ? (
  <SelectItem value="__loading__" disabled>
    Cargando {entidades}…
  </SelectItem>
) : {entidades}.length === 0 ? (
  <SelectItem value="__empty__" disabled>
    Sin {entidades} disponibles
  </SelectItem>
) : (
  {entidades}.map((item) => (
    <SelectItem key={item.id} value={String(item.id)}>
      {/* renderizado del item */}
    </SelectItem>
  ))
)}
```

---

## Checklist de verificación

Después de implementar, verificar:

- [ ] RLS verificado en todas las tablas involucradas — políticas correctas para rol `anon`
- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] El componente muestra el estado "Cargando…" brevemente al cargar
- [ ] Los datos correctos aparecen en el UI
- [ ] Si Supabase no está disponible: aparece "Sin {entidades} disponibles" sin romper la app
- [ ] Si hay JOIN: los campos enriquecidos (ej: `etapa_label`) se muestran correctamente
- [ ] No quedan imports sin usar en los archivos modificados

---

## Lo que NO hacer

- No escribir código sin antes verificar RLS — una tabla sin políticas devuelve `[]` sin error, el bug es invisible
- No asumir las tablas ni la estrategia de caché sin preguntar al usuario (Paso 0 es obligatorio)
- No usar `|| []` — siempre usar `?? []` (nullish coalescing)
- No agregar campos enriquecidos (JOIN) al tipo sin el comentario que aclara que no son columnas de BD
- No duplicar la `queryKey` como string en distintos archivos — siempre importar la constante exportada
- No agregar lógica de negocio en el query file — solo envuelve la función del service
- No crear múltiples instancias de `QueryClient`

---

## Referencia: implementación canónica

El modelo implementado en este proyecto está en:

- `src/types/db/ejecucion.ts` — tipo con campo enriquecido vía JOIN
- `src/services/supabaseService.ts` → `fetchEjecuciones` — función con JOIN vía `Promise.all`
- `src/app/queries/ejecuciones.ts` — query file con hook sin parámetros
- `src/app/components/Segmentacion/Segmentacion.tsx` — componente consumer con estados loading/empty

Para conexiones sin JOIN, ver también:

- `src/services/supabaseService.ts` → `fetchSemanas` — función simple sin JOIN
- `src/app/queries/semanas.ts` — query file de referencia mínima
