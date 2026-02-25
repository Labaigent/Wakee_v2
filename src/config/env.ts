/**
 * Centralized Environment Configuration
 *
 * Purpose: Single source of truth for all environment variables consumed by
 * the application. Provides typed access and availability checks so that
 * feature modules can degrade gracefully when credentials are absent.
 */

/**
 * Supabase environment block
 *
 * @property url      - Project URL (VITE_SUPABASE_URL)
 * @property anonKey  - Public anon key (VITE_SUPABASE_ANON_KEY)
 * @property isAvailable - Returns true only when both values are non-empty strings
 */
const supabase = {
  url: import.meta.env.VITE_SUPABASE_URL || undefined,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || undefined,
  isAvailable(): boolean {
    return Boolean(this.url && this.anonKey);
  },
};

export const env = {
  supabase,
};
