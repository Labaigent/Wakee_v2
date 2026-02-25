import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

/**
 * Supabase Client Singleton with Graceful Degradation
 *
 * Purpose: Creates and exports a single Supabase client instance to be used
 * across the application for all database operations. If environment variables
 * are missing, the client will be null and the app will continue to function
 * with limited features, providing clear feedback about the unavailable service.
 */

/**
 * Check if Supabase is properly configured
 * Re-exports the centralized environment check for convenience
 *
 * @returns {boolean} True if both URL and key are available
 */
export function isSupabaseAvailable(): boolean {
  return env.supabase.isAvailable();
}

/**
 * Singleton Supabase client instance
 *
 * This client is initialized only if environment variables are available.
 * If unavailable, this will be null and callers should check availability
 * using isSupabaseAvailable() before use.
 *
 * @example
 * if (isSupabaseAvailable()) {
 *   const { data } = await supabase.from('table').select();
 * }
 */
export const supabase: SupabaseClient | null = env.supabase.isAvailable()
  ? createClient(env.supabase.url!, env.supabase.anonKey!)
  : null;
