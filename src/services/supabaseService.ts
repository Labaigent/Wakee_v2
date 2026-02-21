import { supabase, isSupabaseAvailable } from './supabaseClient';
import type { QuoteSummary } from '../types/quote';
import type { Communication } from '../types/communication';
import { transformConversationToQuoteSummary } from './quoteTransformers';
import { transformEmailCommunication } from './communicationTransformers';

/**
 * Fetch all conversations from Supabase
 *
 * Purpose: Retrieves all conversation records from the database, ordered by most recent first.
 * Each conversation contains a complete quote workflow with user requirements and tool execution results.
 *
 * TODO: Add user filtering when username column is added to conversations table.
 * Future implementation will filter conversations by user_id to show only user's quotes.
 *
 * @param {string} [userId] - Optional user ID for filtering (not yet implemented in database)
 * @returns {Promise<QuoteSummary[]>} Array of transformed quote summary objects
 * Returns empty array if Supabase is not available (graceful degradation)
 */
export async function fetchAllConversations(_userId?: string): Promise<QuoteSummary[]> {
  // Graceful degradation: return empty array if Supabase is not configured
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty conversation list');
    return [];
  }

  try {
    // Query conversations table, filtered by company_id and ordered by most recent
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('company_id', 'LIG')
      .order('last_update_at', { ascending: false });

    if (error) {
      console.error('[supabaseService] Error fetching conversations:', error);
      throw error;
    }

    // Transform raw database rows to UI-friendly format
    const transformedQuotes = data?.map(transformConversationToQuoteSummary) || [];

    return transformedQuotes;
  } catch (error) {
    console.error('[supabaseService] Failed to fetch conversations:', error);
    throw new Error('Failed to retrieve quotes from database');
  }
}

/**
 * Fetch all communications from Supabase
 *
 * Purpose: Retrieves all email communication records from the database, ordered by most recent first.
 * Each communication contains email details including sender, recipient, subject, body, and related quote.
 *
 * TODO: Add user filtering when user authentication is implemented.
 * Future: When user system is ready, call fetchAllCommunications(userId) to filter by user.
 *
 * @param {string} [userId] - Optional user ID for filtering (not yet implemented)
 * @returns {Promise<Communication[]>} Array of transformed communication objects
 * Returns empty array if Supabase is not available (graceful degradation)
 */
export async function fetchAllCommunications(_userId?: string): Promise<Communication[]> {
  // Graceful degradation: return empty array if Supabase is not configured
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('[supabaseService] Supabase is not available - returning empty communications list');
    return [];
  }

  try {
    // Query email_communications table, ordered by most recent
    // NOTE: No company_id column exists in this table, so no company filtering needed
    const { data, error } = await supabase
      .from('email_communications')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('[supabaseService] Error fetching communications:', error);
      throw error;
    }

    // Transform raw database rows to UI-friendly format
    return data?.map(transformEmailCommunication) || [];
  } catch (error) {
    console.error('[supabaseService] Failed to fetch communications:', error);
    throw new Error('Failed to retrieve communications from database');
  }
}
