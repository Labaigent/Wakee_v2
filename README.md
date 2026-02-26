# Wakee

**Prospección Inteligente** — aplicación para gestionar sesiones de trabajo, leads e informes de inteligencia (señales y ganchos de mercado). Pensada para flujos de prospección con soporte de Supabase y n8n.

---

## Etapas del flujo

|   | Etapa | Descripción |
|---|-------|-------------|
| 📊 | **Dashboard** | Vista general y punto de partida; desde aquí se lanza una nueva sesión. |
| ➕ | **Nueva Sesión** | Crear y configurar una sesión (señales y ganchos de mercado). |
| 🎯 | **Segmentación** | Tareas pendientes y segmentación de contactos. |
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

3. Configura las variables de entorno (por ejemplo un `.env` con Supabase/n8n si las usas).
4. Arranca en desarrollo:

   ```bash
   npm run dev
   ```

Para generar build de producción:

```bash
npm run build
```
