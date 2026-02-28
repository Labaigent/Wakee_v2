import { createContext, useContext } from 'react';

interface PerfilContextValue {
  perfilId: number;
}

const PerfilContext = createContext<PerfilContextValue | null>(null);

/**
 * PerfilProvider — App-wide profile context
 *
 * Purpose: Provides the current user's perfil_id to any component in the tree
 * without prop drilling. Today the id is hardcoded (single-user MVP); when
 * authentication is implemented, replace the constant with the auth session value.
 *
 * Usage:
 *   Wrap the app root with <PerfilProvider> and read with usePerfilContext().
 */
export function PerfilProvider({ children }: { children: React.ReactNode }) {
  // TODO: replace with auth session lookup when authentication is implemented
  const perfilId = 1;

  return (
    <PerfilContext.Provider value={{ perfilId }}>
      {children}
    </PerfilContext.Provider>
  );
}

/**
 * usePerfilContext — consume the current perfil_id
 *
 * @throws If called outside of a <PerfilProvider> tree
 */
export function usePerfilContext(): PerfilContextValue {
  const ctx = useContext(PerfilContext);
  if (!ctx) throw new Error('usePerfilContext must be used within a PerfilProvider');
  return ctx;
}
