# Wakee

**Prospección Inteligente** — aplicación para gestionar sesiones de trabajo, leads e informes de inteligencia (señales y ganchos de mercado). Pensada para flujos de prospección con soporte de Supabase y n8n.

---

## Integraciones clave

- **Supabase**: fuentes de datos para señales/ganchos y opciones dinámicas de sesión (inputs estratégicos).
- **n8n**: webhooks para activar flujos de actualización:
  - `Master Report`: Actualización de inteligencia general.
  - `E3 ICP`: Generación de propuestas de valor segmentadas (Etapa ICP).
  - `E4 Persona`: Definición de perfil de interlocutor (Etapa Persona).
- **TanStack Query**: caching y revalidación de datos en componentes que consumen Supabase.
- **Context API (Perfil)**: gestión global de la sesión activa y datos de perfil del usuario.

---

## Etapas del flujo

|   | Etapa | Descripción |
|---|-------|-------------|
| 📊 | **Dashboard** | Vista general y punto de partida; desde aquí se lanza una nueva sesión. |
| ➕ | **Nueva Sesión** | Crear y configurar una sesión (señales y ganchos de mercado). |
| 🎯 | **Segmentación** | Wizard de 8 pasos para segmentar leads: ICP, Persona, Filtros, Búsqueda, Ranking, Dossier y Mensajes. Incluye bloqueo de pasos completados para integridad de datos. |
| 📁 | **Historial** | Consulta de sesiones anteriores. |
| 👥 | **Leads** | Gestión y seguimiento de leads activos. |
| 📋 | **Report** | Informe maestro de inteligencia (resumen de señales y ganchos). |

---

## Instalación

1. Clona el repositorio (o descarga el código).
2. Instala dependencias:

   ```bash
   npm i
   ```

3. Configura las variables de entorno. Crea un `.env` con al menos:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (Supabase).
   - `VITE_N8N_MASTER_REPORT_WEBHOOK_URL` (actualización del reporte maestro).
   - `VITE_N8N_E3_ICP_WEBHOOK_URL` (flujo Segmentación / ICP).
   - `VITE_N8N_E4_PERSONA_WEBHOOK_URL` (flujo Segmentación / Persona).
4. Arranca en desarrollo:

   ```bash
   npm run dev
   ```

Para generar build de producción:

```bash
npm run build
```
