/**
 * Paleta de colores oficial
 * Basada en el diseño proporcionado
 */

export const COLORS = {
  // Colores principales
  eden: '#1F554A',       // Verde oscuro - principal
  sulu: '#C4FF81',       // Verde lima - acentos
  white: '#FFFFFF',      // Blanco base
  grayOp: '#DCDEDC',     // Gris operativo - bordes, fondos
  blackText: '#141414',  // Negro texto
} as const;

/**
 * Clases de Tailwind CSS predefinidas para la paleta
 */
export const COLOR_CLASSES = {
  // Botones primarios
  btnPrimary: 'bg-[#1F554A] text-white hover:bg-[#1F554A]/90',
  btnSecondary: 'bg-[#DCDEDC] text-[#141414] hover:bg-[#DCDEDC]/90',
  btnAccent: 'bg-[#C4FF81] text-[#141414] hover:bg-[#C4FF81]/90',
  
  // Badges
  badgePrimary: 'bg-[#1F554A] text-white',
  badgeAccent: 'bg-[#C4FF81] text-[#141414]',
  badgeSecondary: 'bg-[#DCDEDC] text-[#141414]',
  
  // Bordes y separadores
  border: 'border-[#DCDEDC]',
  borderPrimary: 'border-[#1F554A]',
  
  // Fondos
  bgLight: 'bg-[#DCDEDC]/30',
  bgPrimary: 'bg-[#1F554A]',
  bgAccent: 'bg-[#C4FF81]/20',
  
  // Texto
  textPrimary: 'text-[#1F554A]',
  textAccent: 'text-[#C4FF81]',
  textDefault: 'text-[#141414]',
  
  // Estados activos
  active: 'border-[#1F554A] text-[#1F554A]',
  activeHighlight: 'bg-[#C4FF81]/10 border-[#C4FF81]',
  
  // Links
  link: 'text-[#1F554A] hover:text-[#1F554A]/80',
} as const;
