/**
 * n8n Webhook Service
 *
 * Purpose: Provides functions to trigger n8n automation workflows via webhook.
 * Currently used by MasterIntelligenceReport to kick off the data refresh flow.
 *
 * Note: These are test webhook URLs (webhook-test). When moving to production,
 * replace with the production webhook URL (webhook/ instead of webhook-test/).
 */

/** Webhook URL for triggering the Master Intelligence Report update workflow */
const MASTER_REPORT_WEBHOOK_URL = import.meta.env.VITE_N8N_MASTER_REPORT_WEBHOOK_URL;

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
