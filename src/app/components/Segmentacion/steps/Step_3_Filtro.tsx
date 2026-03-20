// External libraries
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Textarea } from '../../ui/textarea';

// Internal — queries
import { useE5LinkOutputQuery } from '@/app/queries/e5LinkOutput';

const FALLBACK_URL = 'https://www.linkedin.com/sales/search/people';

interface StepFiltroProps {
  onConfirm: () => void;
  onBack: () => void;
  ejecucionId: number | null;
  linkedinCookie: string;
  onLinkedinCookieChange: (v: string) => void;
}

function validateLinkedinCookie(raw: string): { valid: boolean; error?: string } {
  if (!raw.trim()) return { valid: false };
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0)
      return { valid: false, error: 'Debe ser un array JSON con al menos una cookie' };
    const allHaveFields = parsed.every(
      (c) => typeof c === 'object' && c !== null && 'name' in c && 'value' in c
    );
    if (!allHaveFields)
      return { valid: false, error: 'Formato inválido: cada cookie debe tener name y value' };
    const hasLiAt = parsed.some((c) => c.name === 'li_at');
    if (!hasLiAt)
      return { valid: false, error: 'Falta la cookie de autenticación de LinkedIn (li_at)' };
    return { valid: true };
  } catch {
    return { valid: false, error: 'No es un JSON válido' };
  }
}

export function StepFiltro({ onConfirm, onBack, ejecucionId, linkedinCookie, onLinkedinCookieChange }: StepFiltroProps) {
  const { data: linkOutput, isLoading } = useE5LinkOutputQuery(ejecucionId);
  const salesNavUrl = linkOutput?.sales_navigator_url ?? FALLBACK_URL;
  const cookieValidation = validateLinkedinCookie(linkedinCookie);

  // --- Handlers ---
  const handleConfirm = async () => {
    if (!cookieValidation.valid) {
      toast.error(cookieValidation.error ?? 'Debes ingresar una cookie de sesión de LinkedIn válida');
      return;
    }
    toast.success('Continuando con búsqueda...');
    onConfirm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Accede a LinkedIn Sales Navigator</h3>
        <p className="text-sm text-gray-600">Wakee configurará la búsqueda automáticamente en Sales Navigator</p>
      </div>

      {/* CTA Sales Navigator */}
      <div className="bg-[#C4FF81]/10 border-2 border-[#1F554A] rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="size-12 text-[#1F554A]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-base text-[#141414] mb-2">Continúa en LinkedIn Sales Navigator</h4>
            <p className="text-sm text-gray-700 mb-4">
              Wakee ha preparado los filtros de búsqueda basados en tu ICP y Buyer Persona. Haz clic en el botón para abrir Sales Navigator con la configuración optimizada.
            </p>
            <Button
              onClick={() => window.open(salesNavUrl, '_blank')}
              disabled={isLoading}
              className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90 disabled:opacity-60"
            >
              <svg className="size-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              {isLoading ? 'Cargando enlace…' : 'Abrir Sales Navigator'}
            </Button>
          </div>
        </div>
      </div>

      {/* Cookie de sesión */}
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-[#141414]">Sesión de LinkedIn</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Copia tus cookies con EditThisCookie y pégalas aquí.
          </p>
        </div>

        {cookieValidation.valid ? (
          /* Estado: cookie válida — oculta el JSON */
          <div className="flex items-center justify-between rounded-lg border border-[#1F554A] bg-[#1F554A]/5 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-[#1F554A]">
              <CheckCircle2 className="size-4 shrink-0" />
              <span className="font-medium">Sesión cargada correctamente</span>
            </div>
            <button
              type="button"
              onClick={() => onLinkedinCookieChange('')}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Cambiar
            </button>
          </div>
        ) : (
          /* Estado: vacío o inválido — muestra el textarea */
          <div className="space-y-1.5">
            <Textarea
              value={linkedinCookie}
              onChange={(e) => onLinkedinCookieChange(e.target.value)}
              placeholder="Pega aquí el JSON de tus cookies…"
              className="font-mono text-xs min-h-[80px] resize-none border-[#DCDEDC] focus:border-[#1F554A] focus:ring-[#1F554A]/30"
              rows={3}
            />
            {linkedinCookie.trim() && (
              <p className="flex items-center gap-1 text-xs text-red-600">
                <XCircle className="size-3.5 shrink-0" />
                {cookieValidation.error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Aviso proceso automático */}
      <div className="bg-[#DCDEDC]/30 border border-[#DCDEDC] rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="size-5 text-[#1F554A] flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-[#141414] mb-1">Proceso automático</p>
            <p className="text-gray-700">
              Una vez que explores los resultados en Sales Navigator, regresa aquí para continuar. Wakee ejecutará automáticamente el ranking de leads.
            </p>
          </div>
        </div>
      </div>

      <Separator />
      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4 mr-2" />
          Volver
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!cookieValidation.valid}
          className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 disabled:opacity-60"
        >
          Continuar con ranking de leads
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
