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
const MASTER_REPORT_WEBHOOK_URL =
  'https://camilov.app.n8n.cloud/webhook-test/824981e2-6004-4431-a1d6-bf8045b640db';

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
