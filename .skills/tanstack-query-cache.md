# Skill: Implementar caché con TanStack Query

## Cuándo usar este skill

Cuando un componente hace fetch directo a Supabase (o cualquier servicio externo) usando
`useState + useEffect`, y ese mismo dato podría ser necesario en otro componente — migrar
a TanStack Query evita peticiones duplicadas y agrega caché automático entre navegaciones.

---

## Prerequisitos

- `@tanstack/react-query` instalado (`npm list @tanstack/react-query`)
- `QueryClientProvider` activo en la raíz de la app (ver Paso 0)

---

## Paso 0 — Verificar/configurar QueryClientProvider

Busca el archivo de entrada de la app (generalmente `src/main.tsx` o similar).

Si **ya existe** `QueryClientProvider`, no hagas nada en este paso.

Si **no existe**, agrégalo así:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos — default global
    },
  },
});

// Envuelve el componente raíz:
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

**Regla:** Una sola instancia de `QueryClient` en toda la app. No crear múltiples instancias.

---

## Paso 1 — Crear el archivo de query

**Carpeta:** busca (o crea) un directorio de queries centralizado. En este proyecto está en
`src/app/queries/`. El nombre exacto puede variar — lo importante es que sea un directorio
compartido, no dentro de un componente específico.

**Nombre del archivo:** `{entidad}.ts` en camelCase (ej: `semanas.ts`, `senalesMercado.ts`)

**Estructura del archivo — cópiala exactamente:**

```ts
import { useQuery } from '@tanstack/react-query';
import { fetch{Entidad} } from '@/services/supabaseService'; // ajusta el path al service real

// Exportar la key — otros archivos la importan para invalidaciones
export const {ENTIDAD}_QUERY_KEY = ['{entidad}'] as const;

export function use{Entidad}Query() {
  return useQuery({
    queryKey: {ENTIDAD}_QUERY_KEY,
    queryFn: fetch{Entidad},
  });
}
```

**Ejemplo real (semanas):**

```ts
import { useQuery } from '@tanstack/react-query';
import { fetchSemanas } from '@/services/supabaseService';

export const SEMANAS_QUERY_KEY = ['semanas'] as const;

export function useSemanasQuery() {
  return useQuery({
    queryKey: SEMANAS_QUERY_KEY,
    queryFn: fetchSemanas,
  });
}
```

**Convenciones obligatorias:**
| Elemento | Formato | Ejemplo |
|---|---|---|
| Nombre del archivo | `{entidad}.ts` | `semanas.ts` |
| Nombre del hook | `use{Entidad}Query` | `useSemanasQuery` |
| Nombre de la key | `{ENTIDAD}_QUERY_KEY` | `SEMANAS_QUERY_KEY` |
| Valor de la key | `['{entidad}']` — array, string singular en minúsculas | `['semanas']` |

**Si el query necesita parámetros** (ej: `semanaId`), agrégalos a la key y al hook:

```ts
export const SENALES_MERCADO_QUERY_KEY = (semanaId: number) =>
  ['senalesMercado', semanaId] as const;

export function useSenalesMercadoQuery(semanaId: number | undefined) {
  return useQuery({
    queryKey: SENALES_MERCADO_QUERY_KEY(semanaId!),
    queryFn: () => fetchSenalesMercado({ semanaId: semanaId! }),
    enabled: Boolean(semanaId), // no ejecutar si no hay semanaId
  });
}
```

---

## Paso 2 — Reemplazar useState + useEffect en el componente

**Patrón a eliminar:**

```ts
// ANTES — eliminar estos 3 elementos:
const [isLoading{Entidad}, setIsLoading{Entidad}] = useState(true);
const [{entidad}, set{Entidad}] = useState<{Tipo}[]>([]);
useEffect(() => {
  fetch{Entidad}()
    .then(data => { set{Entidad}(data); setIsLoading{Entidad}(false); })
    .catch(() => setIsLoading{Entidad}(false));
}, []);
```

**Reemplazar con:**

```ts
// DESPUÉS — una sola línea:
const { data: {entidad} = [], isLoading: isLoading{Entidad} } = use{Entidad}Query();
```

**Limpieza de imports:**
- Eliminar el import del `fetch{Entidad}` del service si ya no se usa en ese componente
- Eliminar el import del type si ya no se referencia directamente en el componente
- Agregar el import del nuevo hook: `import { use{Entidad}Query } from '../../queries/{entidad}'`
  (ajusta el path relativo según la ubicación del componente)

---

## Paso 3 — Agregar invalidación (solo si el componente puede mutar datos)

Si el componente tiene un botón de "Actualizar" o cualquier acción que escribe a la DB
y luego necesita refrescar los datos:

```ts
// En el componente que invalida:
import { useQueryClient } from '@tanstack/react-query';
import { use{Entidad}Query, {ENTIDAD}_QUERY_KEY } from '../../queries/{entidad}';

// Dentro del componente:
const queryClient = useQueryClient();

// Dentro del handler de actualización:
const handleRefresh = async () => {
  await triggerExternalUpdate(); // tu llamada al backend/n8n/API
  await queryClient.invalidateQueries({ queryKey: {ENTIDAD}_QUERY_KEY });
  // TanStack Query re-fetcha automáticamente
};
```

**Regla:** `invalidateQueries` se llama **después** de confirmar que el backend actualizó los datos,
no antes.

---

## Checklist de verificación

Después de implementar, verifica:

- [ ] `npm run build` pasa sin errores TypeScript
- [ ] El componente carga datos correctamente en el navegador
- [ ] Al navegar entre vistas, no aparece spinner de carga la segunda vez (datos del caché)
- [ ] DevTools → Network: el fetch de la entidad aparece **una sola vez** en la sesión
      (hasta que pasen 5 minutos o se invalide manualmente)
- [ ] Si hay botón "Actualizar": el refetch ocurre correctamente después de presionarlo
- [ ] No quedan imports sin usar en los archivos modificados

---

## Lo que NO hacer

- No crear el archivo de query dentro de la carpeta de un componente específico
- No duplicar la `queryKey` como string en varios lugares — siempre importar la constante
- No crear múltiples instancias de `QueryClient`
- No modificar `staleTime` por entidad salvo que haya una razón muy específica — respetar el default global
- No agregar lógica de negocio dentro del query file — solo envuelve la función del service

---

## Referencia: implementación base (semanas)

El modelo canónico ya implementado está en:

- `src/app/queries/semanas.ts` — el query file
- `src/app/components/NuevaSesion/NuevaSesion.tsx` — consumer sin invalidación
- `src/app/components/MasterReport/MasterIntelligenceReport.tsx` — consumer con invalidación

Ante cualquier duda sobre formato o convenciones, leer esos archivos como fuente de verdad.
