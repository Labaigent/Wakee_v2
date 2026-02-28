/**
 * n8n Webhook Service
 *
 * Purpose: Provides functions to trigger n8n automation workflows via webhook.
 * Currently used by MasterIntelligenceReport to kick off the data refresh flow,
 * and by NuevaSesion to initiate the E3 prospecting workflow.
 *
 * Note: These are test webhook URLs (webhook-test). When moving to production,
 * replace with the production webhook URL (webhook/ instead of webhook-test/).
 */

/** Webhook URL for triggering the Master Intelligence Report update workflow */
const MASTER_REPORT_WEBHOOK_URL = import.meta.env.VITE_N8N_MASTER_REPORT_WEBHOOK_URL;

/** Webhook URL for triggering the E3 Nueva Sesion prospecting workflow */
const E3_NUEVA_SESION_WEBHOOK_URL = import.meta.env.VITE_N8N_E3_NUEVA_SESION_WEBHOOK_URL;

/** Webhook URL for triggering the E3 ICP strategy workflow */
const E3_ICP_WEBHOOK_URL = import.meta.env.VITE_N8N_E3_ICP_WEBHOOK_URL;

/** Payload sent to the E3 Nueva Sesion webhook */
export interface E3NuevaSesionPayload {
  brokerName: string;
  operationalFocus: string;
  assetClass: string;
  additionalContext: string;
  semanaId: number;
  semanaFechaInicio: string; // "YYYY-MM-DD"
}

/** Payload sent to the E3 ICP webhook */
export interface E3IcpPayload {
  perfil_id: number;
  ejecucion_id: number;
  semana_id: number;
}

/**
 * Trigger the Master Intelligence Report update workflow in n8n
 *
 * Purpose: Sends a GET request to the n8n webhook to start the automation
 * that refreshes the Master Intelligence Report data.
 *
 * @throws {Error} If the webhook responds with a non-OK HTTP status
 *
 * @example
 * try {
 *   await triggerMasterReportUpdate();
 *   toast.success('Reporte actualizado');
 * } catch (error) {
 *   toast.error('Error al actualizar');
 * }
 */
export async function triggerMasterReportUpdate(): Promise<void> {
  const response = await fetch(MASTER_REPORT_WEBHOOK_URL, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`[n8nService] Webhook error: ${response.status}`);
  }
}

/**
 * Trigger the E3 ICP strategy workflow in n8n
 *
 * Purpose: Sends a POST request to the n8n webhook to start the automation
 * that generates ICP proposals for the selected execution. The webhook holds
 * the response until the workflow completes and the ICP data is ready in the DB.
 *
 * @param payload - Perfil, execution, and week context required by the workflow
 * @throws {Error} If the webhook responds with a non-OK HTTP status
 *
 * @example
 * try {
 *   await triggerE3Icp({ perfil_id: 1, ejecucion_id: 3, semana_id: 2 });
 *   toast.success('Estrategia iniciada.');
 * } catch {
 *   toast.error('Error al iniciar la estrategia. Intenta de nuevo.');
 * }
 */
export async function triggerE3Icp(payload: E3IcpPayload): Promise<void> {
  const response = await fetch(E3_ICP_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`[n8nService] Webhook error: ${response.status}`);
  }
}

/**
 * Trigger the E3 Nueva Sesion prospecting workflow in n8n
 *
 * Purpose: Sends a POST request to the n8n webhook to start the automation
 * that initiates a new prospecting session (ICP proposals, buyer persona, leads).
 *
 * @param payload - Broker form data plus the current semana context
 * @throws {Error} If the webhook responds with a non-OK HTTP status
 *
 * @example
 * try {
 *   await triggerE3NuevaSesion({ brokerName: 'Juan', ... });
 *   toast.success('Sesión iniciada');
 * } catch (error) {
 *   toast.error('Error al iniciar la sesión');
 * }
 */
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
