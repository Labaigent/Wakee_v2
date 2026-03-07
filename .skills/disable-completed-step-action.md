---
description: Deshabilitar el botón de acción de un paso cuando ya fue ejecutado en la ejecución actual. Patrón canónico para todos los pasos del wizard de Segmentación que disparan efectos irreversibles (llamadas n8n, etc.).
allowed-tools: Read, Edit, Grep, Glob, Bash(npx tsc --noEmit)
---

# Skill: Deshabilitar acción de paso ya ejecutado

Cuando el usuario navega de vuelta a un paso completado (usando el `SegmentacionStepNav`),
el botón de acción principal debe aparecer deshabilitado e inerte — no puede re-disparar
el flujo n8n ni ningún otro efecto lateral irreversible.

La fuente de verdad es `maxReachedStep` en `Segmentacion.tsx`. Un paso está completado
cuando `getStepIndex(maxReachedStep) > getStepIndex(thatStep)`. Esta misma expresión ya
alimenta el estado `completed` visual del `SegmentacionStepNav` — este skill lo extiende
hacia el interior de los componentes de cada paso.

**Este skill es el modelo a seguir para todos los pasos del wizard.**

---

## Prerequisitos

- `getStepIndex` exportado desde `src/app/components/Segmentacion/types.ts`
- `maxReachedStep: SegmentacionStep` disponible en `Segmentacion.tsx`
- El componente del paso ya recibe `onConfirm` como prop (patrón estándar del wizard)

---

## Paso 1 — Agregar `isCompleted` a la interfaz del paso

**Archivo:** `src/app/components/Segmentacion/steps/Step_{N}_{Nombre}/Step_{N}_{Nombre}.tsx`

Agregar la prop opcional al final de la interfaz:

```tsx
interface Step{Nombre}Props {
  // ... props existentes ...
  isCompleted?: boolean;
}
```

Agregar el parámetro con default `false` en la destructuración de la función:

```tsx
export function Step{Nombre}({
  // ... otros params ...
  isCompleted = false,
}: Step{Nombre}Props) {
```

**Ejemplo real (StepIcp):**

```tsx
interface StepIcpProps {
  perfilId: number;
  ejecucionId: number | null;
  selectedIcp: string;
  onSelectedIcpChange: (value: string) => void;
  expandedIcp: string | null;
  onExpandedIcpChange: (id: string | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isCompleted?: boolean;  // <-- agregado al final
}

export function StepIcp({
  perfilId,
  ejecucionId,
  selectedIcp,
  onSelectedIcpChange,
  expandedIcp,
  onExpandedIcpChange,
  onConfirm,
  onCancel,
  isCompleted = false,  // <-- con default false
}: StepIcpProps) {
```

---

## Paso 2 — Deshabilitar el botón y mostrar nota

En la sección de acciones del componente, agregar `|| isCompleted` al `disabled` del botón
y envolver en un `div` que permita mostrar la nota contextual encima del botón:

```tsx
{/* Acciones */}
<div className="flex justify-between items-center">
  <Button variant="outline" onClick={onCancel}>
    Cancelar
  </Button>
  <div className="flex flex-col items-end gap-1">
    {isCompleted && (
      <p className="text-xs text-gray-400">Este paso ya fue ejecutado en esta ejecución.</p>
    )}
    <Button
      onClick={handleConfirm}
      disabled={/* condición original */ || isCompleted}
      className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90"
    >
      {/* contenido original del botón sin cambios */}
    </Button>
  </div>
</div>
```

**Reglas del bloque de acciones:**
- El `Cancelar` va a la izquierda, sin cambios
- El botón principal y la nota van juntos en un `div` con `flex-col items-end`
- La nota aparece **encima** del botón (orden en el DOM: `<p>` primero, `<Button>` después)
- La nota se muestra **solo** cuando `isCompleted` es `true`

**Ejemplo real (StepIcp):**

```tsx
{/* Acciones */}
<div className="flex justify-between items-center">
  <Button variant="outline" onClick={onCancel}>
    Cancelar
  </Button>
  <div className="flex flex-col items-end gap-1">
    {isCompleted && (
      <p className="text-xs text-gray-400">Este paso ya fue ejecutado en esta ejecución.</p>
    )}
    <Button
      onClick={handleConfirm}
      disabled={!selectedIcp || isSubmitting || isCompleted}
      className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90"
    >
      {isSubmitting ? (
        <Loader2 className="size-4 mr-2 animate-spin" />
      ) : (
        <>
          Confirmar y continuar
          <ArrowRight className="size-4 ml-2" />
        </>
      )}
    </Button>
  </div>
</div>
```

---

## Paso 3 — Pasar `isCompleted` desde `Segmentacion.tsx`

**Archivo:** `src/app/components/Segmentacion/Segmentacion.tsx`

En el bloque de render del paso correspondiente, agregar la prop derivada de `maxReachedStep`:

```tsx
<Step{Nombre}
  {/* ... props existentes ... */}
  isCompleted={getStepIndex(maxReachedStep) > getStepIndex('{step-id}')}
/>
```

Donde `'{step-id}'` es el identificador del paso en `SEGMENTACION_STEP_ORDER` (ej: `'icp'`, `'persona'`, `'filtro'`).

**No se necesita nuevo estado ni nueva query** — es derivación pura de `maxReachedStep`.

`getStepIndex` ya está importado en `Segmentacion.tsx`:
```tsx
import { getStepIndex, getStepForEtapa, SEGMENTACION_STEP_ORDER } from './types';
```

**Ejemplo real (StepIcp):**

```tsx
{currentStep === 'icp' && (
  <StepIcp
    perfilId={perfilId}
    ejecucionId={selectedExecutionId}
    selectedIcp={selectedIcp}
    onSelectedIcpChange={setSelectedIcp}
    expandedIcp={expandedIcp}
    onExpandedIcpChange={setExpandedIcp}
    onConfirm={() => {
      setCurrentStep('persona');
      updateMaxReached('persona');
    }}
    onCancel={handleCancelToIntro}
    isCompleted={getStepIndex(maxReachedStep) > getStepIndex('icp')}
  />
)}
```

**Tabla de step-ids por paso:**

| Paso | Componente | step-id |
|---|---|---|
| 1 | `StepIcp` | `'icp'` |
| 2 | `StepPersona` | `'persona'` |
| 3 | `StepFiltro` | `'filtro'` |
| 4 | `StepBusqueda` | `'busqueda'` |
| 5 | `StepRanking` | `'ranking'` |
| 6 | `StepDossier` | `'dossier'` |
| 7 | `StepMensajes` | `'mensajes'` |

---

## Checklist de verificación

- [ ] `npx tsc --noEmit` pasa sin errores
- [ ] Iniciar nueva ejecución, completar el paso → auto-navega al siguiente
- [ ] Regresar al paso completado via step nav → botón visualmente deshabilitado
- [ ] El texto "Este paso ya fue ejecutado en esta ejecución." aparece encima del botón
- [ ] Hacer clic en el botón deshabilitado → no ocurre ninguna acción, no se dispara n8n
- [ ] Navegar hacia adelante de nuevo via step nav → sin problema
- [ ] Recargar la página, seleccionar la misma ejecución → el botón sigue deshabilitado (via `etapa_siguiente` → `maxReachedStep`)

---

## Lo que NO hacer

- No crear nuevo estado para rastrear si el paso está completado — `maxReachedStep` es la única fuente de verdad
- No usar `currentStep` para calcular `isCompleted` — ese valor cambia con la navegación y no refleja el progreso real
- No agregar lógica de re-ejecución ni un botón alternativo — el paso completado es de solo lectura
- No omitir el default `= false` en la destructuración — el prop es opcional y debe funcionar sin pasarse
- No poner la nota de "ya ejecutado" dentro del `handleConfirm` ni en el `toast` — debe ser feedback visual permanente, no efímero
- No duplicar la guard `isCompleted` en `handleConfirm` — el `disabled` en el botón ya impide la ejecución en la UI; la guard en el handler es redundante si el botón está correctamente deshabilitado

---

## Referencia: implementación canónica

El modelo implementado para el Paso 1 está en:

- `src/app/components/Segmentacion/steps/Step_1_Icp/Step_1_Icp.tsx` — prop `isCompleted`, botón deshabilitado, nota contextual
- `src/app/components/Segmentacion/Segmentacion.tsx` — derivación `getStepIndex(maxReachedStep) > getStepIndex('icp')`
- `src/app/components/Segmentacion/types.ts` — `getStepIndex` y `SEGMENTACION_STEP_ORDER` (referencia de step-ids)
