# Skill: Conectar un formulario a un webhook de n8n

## Cuándo usar este skill

Cuando un componente tiene una acción (submit de formulario, botón de acción) que debe
iniciar un flujo de automatización en n8n. El componente envía datos vía POST y muestra
feedback al usuario (toast de éxito o error) según el resultado del webhook.

Este es el patrón estándar para todas las integraciones de etapas del flujo de prospección.
Los prefijos `E3`, `E4`, etc. identifican la etapa del flujo a la que pertenece el webhook.

---

## Prerequisitos

- Cuenta de n8n activa (este proyecto usa `camilov.app.n8n.cloud`)
- `src/services/n8nService.ts` existe en el proyecto
- Variable de entorno Vite disponible en `.env`

---

## Paso 0 — Crear el webhook en n8n

1. Ir a `camilov.app.n8n.cloud` → crear un nuevo workflow
2. Agregar un nodo **Webhook** como trigger con esta configuración:
   - **Method:** POST
   - **Path:** nombre descriptivo en kebab-case (ej: `e3-nueva-sesion`)
   - **Authentication:** None
   - **Response Mode:** `Immediately` — para que el frontend no quede bloqueado esperando

3. Copiar la **Test URL** que genera n8n (formato: `webhook-test/{path}`)
4. Pegarla en `.env` como `VITE_N8N_{ETAPA}_{NOMBRE}_WEBHOOK_URL` (ver Paso 3)

> Para producción: cambiar `webhook-test/` por `webhook/` en la URL y actualizar `.env`

---

## Paso 1 — Agregar al servicio n8n

Abrir `src/services/n8nService.ts` y agregar tres elementos en orden:

**1a. Constante de URL** (junto a las otras constantes, al inicio del archivo):

```ts
const E{N}_{NOMBRE}_WEBHOOK_URL = import.meta.env.VITE_N8N_E{N}_{NOMBRE}_WEBHOOK_URL;
```

**1b. Interfaz del payload** (después de la constante, antes de la función):

```ts
/** Payload sent to the E{N} {Nombre} webhook */
export interface E{N}{Nombre}Payload {
  // campos del formulario
  campo1: string;
  campo2: string;
  // contexto de semana si aplica
  semanaId: number;
  semanaFechaInicio: string; // "YYYY-MM-DD"
}
```

**1c. Función trigger** (al final del archivo):

```ts
/**
 * Trigger the E{N} {Nombre} workflow in n8n
 *
 * Purpose: Sends a POST request to the n8n webhook to start the automation
 * that [descripción del flujo].
 *
 * @param payload - [descripción del payload]
 * @throws {Error} If the webhook responds with a non-OK HTTP status
 *
 * @example
 * try {
 *   await triggerE{N}{Nombre}({ campo1: '...', ... });
 *   toast.success('...');
 * } catch (error) {
 *   toast.error('Error al ...');
 * }
 */
export async function triggerE{N}{Nombre}(payload: E{N}{Nombre}Payload): Promise<void> {
  const response = await fetch(E{N}_{NOMBRE}_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`[n8nService] Webhook error: ${response.status}`);
  }
}
```

**Ejemplo real (E3 NuevaSesion):**

```ts
const E3_NUEVA_SESION_WEBHOOK_URL = import.meta.env.VITE_N8N_E3_NUEVA_SESION_WEBHOOK_URL;

export interface E3NuevaSesionPayload {
  brokerName: string;
  operationalFocus: string;
  assetClass: string;
  additionalContext: string;
  semanaId: number;
  semanaFechaInicio: string; // "YYYY-MM-DD"
}

export async function triggerE3NuevaSesion(payload: E3NuevaSesionPayload): Promise<void> {
  const response = await fetch(E3_NUEVA_SESION_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`[n8nService] Webhook error: ${response.status}`);
  }
}
```

**Convenciones obligatorias:**
| Elemento | Formato | Ejemplo |
|---|---|---|
| Constante URL | `E{N}_{NOMBRE}_WEBHOOK_URL` | `E3_NUEVA_SESION_WEBHOOK_URL` |
| Variable env | `VITE_N8N_E{N}_{NOMBRE}_WEBHOOK_URL` | `VITE_N8N_E3_NUEVA_SESION_WEBHOOK_URL` |
| Interfaz | `E{N}{Nombre}Payload` | `E3NuevaSesionPayload` |
| Función | `triggerE{N}{Nombre}` | `triggerE3NuevaSesion` |

---

## Paso 2 — Conectar en el componente

**2a. Importar la función:**

```ts
import { triggerE{N}{Nombre} } from '../../../services/n8nService';
```

**2b. Reemplazar el handler del formulario** — el patrón es siempre:
1. Guard de datos requeridos antes de tocar el estado
2. `setIsSubmitting(true)` antes del `try`
3. `try/catch/finally` con toasts diferenciados
4. `onComplete()` solo en el bloque `try` (camino feliz)
5. `setIsSubmitting(false)` siempre en `finally`

```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentSemana) return; // guard — verificar datos requeridos antes de proceder
  setIsSubmitting(true);

  try {
    await triggerE{N}{Nombre}({
      campo1: formData.campo1,
      campo2: formData.campo2,
      semanaId: currentSemana.id,
      semanaFechaInicio: currentSemana.fecha_inicio_semana,
    });
    toast.success("Mensaje de éxito para el usuario.");
    onComplete();
  } catch {
    toast.error("Error al [acción]. Intenta de nuevo.");
  } finally {
    setIsSubmitting(false);
  }
};
```

> **Regla del guard:** El `if (!dato) return` va **antes** de `setIsSubmitting(true)`.
> Si el dato no existe, el botón no debe entrar en estado de carga.

---

## Paso 3 — Agregar la variable de entorno

En `.env` (raíz del proyecto), agregar junto a las otras variables de n8n:

```
VITE_N8N_E{N}_{NOMBRE}_WEBHOOK_URL=https://camilov.app.n8n.cloud/webhook-test/{path}
```

Reiniciar el servidor de desarrollo Vite después de editar `.env`.

---

## Checklist de verificación

Antes de cerrar, verificar el flujo completo end-to-end:

- [ ] En n8n: workflow abierto → nodo Webhook en modo "Listen for test event"
- [ ] Llenar el formulario en la app y hacer submit
- [ ] Verificar en n8n que llegó el payload con **todos los campos** esperados
- [ ] Verificar que aparece el **toast de éxito** en la app
- [ ] Probar con una URL inválida en `.env` → verificar que aparece el **toast de error**
- [ ] `npm run build` pasa sin errores TypeScript
- [ ] No quedan imports sin usar en los archivos modificados

---

## Lo que NO hacer

- No lanzar `onComplete()` dentro del `catch` ni del `finally` — solo en el `try`
- No poner el guard (`if (!dato) return`) después de `setIsSubmitting(true)` — el estado de carga quedaría atascado
- No omitir el `finally` para resetear `isSubmitting` — si hay error, el botón quedaría bloqueado
- No hardcodear la URL del webhook en el componente — siempre va en `n8nService.ts`
- No reutilizar el mismo webhook para múltiples etapas — cada etapa tiene su propia URL y función
- No usar `catch (error)` si no se usa la variable — usar `catch` sin parámetro

---

## Referencia: implementación base

El modelo canónico ya implementado está en:

- `src/services/n8nService.ts` — servicio con `E3NuevaSesionPayload` y `triggerE3NuevaSesion`
- `src/app/components/NuevaSesion/NuevaSesion.tsx` — componente consumer (patrón submit)
- `src/app/components/MasterReport/MasterIntelligenceReport.tsx` — patrón alternativo (botón de acción sin `onComplete`)

Ante cualquier duda sobre formato o convenciones, leer esos archivos como fuente de verdad.
