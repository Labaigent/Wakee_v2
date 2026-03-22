// React
import { useState, useEffect } from 'react';

// External libraries
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, ExternalLink, XCircle, CheckCircle2 } from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';

// Internal — queries
import { useE5LinkOutputQuery } from '@/app/queries/e5LinkOutput';

// Internal — services
import { triggerE6Busqueda } from '@/services/n8nService';

const FALLBACK_URL = 'https://www.linkedin.com/sales/search/people';

interface StepFiltroProps {
  onConfirm: () => void;
  onBack: () => void;
  perfilId: number | null;
  ejecucionId: number | null;
  linkedinCookie: string;
  onLinkedinCookieChange: (v: string) => void;
  activeSalesNavUrl: string;
  onActiveSalesNavUrlChange: (url: string) => void;
}

function validateSalesNavUrl(url: string): boolean {
  return url.startsWith('https://www.linkedin.com/sales/search/');
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

export function StepFiltro({
  onConfirm,
  onBack,
  perfilId,
  ejecucionId,
  linkedinCookie,
  onLinkedinCookieChange,
  activeSalesNavUrl,
  onActiveSalesNavUrlChange,
}: StepFiltroProps) {
  const { data: linkOutput, isLoading } = useE5LinkOutputQuery(ejecucionId);
  const salesNavUrl = linkOutput?.sales_navigator_url ?? FALLBACK_URL;

  const [customUrl, setCustomUrl] = useState('');

  // Pre-fill activeSalesNavUrl from E5 query result whenever ejecucionId or salesNavUrl changes
  useEffect(() => {
    if (salesNavUrl && salesNavUrl !== FALLBACK_URL) {
      onActiveSalesNavUrlChange(salesNavUrl);
    }
  }, [salesNavUrl, ejecucionId]);

  const effectiveUrl = activeSalesNavUrl || salesNavUrl;
  const cookieValidation = validateLinkedinCookie(linkedinCookie);

  const urlInputInvalid = customUrl.trim() !== '' && !validateSalesNavUrl(customUrl.trim());
  const urlIsValid = validateSalesNavUrl(effectiveUrl);

  const handleUrlInputChange = (val: string) => {
    setCustomUrl(val);
    if (val.trim() === '') {
      // Reverts to E5-generated URL
      onActiveSalesNavUrlChange(salesNavUrl);
    } else if (validateSalesNavUrl(val.trim())) {
      onActiveSalesNavUrlChange(val.trim());
    }
  };

  const handleConfirm = () => {
    if (!perfilId || !ejecucionId) return;
    if (!urlIsValid) {
      toast.error('El link de Sales Navigator no es válido');
      return;
    }
    if (!cookieValidation.valid) {
      toast.error(cookieValidation.error ?? 'Debes ingresar una cookie de sesión de LinkedIn válida');
      return;
    }
    triggerE6Busqueda({
      perfil_id: perfilId,
      ejecucion_id: ejecucionId,
      sales_navigator_url: effectiveUrl,
      linkedin_cookie: JSON.parse(linkedinCookie),
    }).catch(() => {
      // Error silencioso — el usuario ya avanzó a Step_4
    });
    onConfirm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Configura tu búsqueda en Sales Navigator</h3>
        <p className="text-sm text-gray-600">Sigue los pasos para preparar y lanzar la búsqueda de leads.</p>
      </div>

      {/* Paso 1 */}
      <div className="border border-[#DCDEDC] rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-[#1F554A] text-white rounded-full size-6 text-sm font-medium shrink-0">
            1
          </span>
          <p className="text-sm font-medium text-[#141414]">Revisa el link generado</p>
        </div>
        <p className="text-sm text-gray-600 pl-8">
          Wakee preparó los filtros basados en tu ICP. Ábrelo en Sales Navigator para verificar.
        </p>
        <div className="pl-8">
          <Button
            onClick={() => window.open(effectiveUrl, '_blank')}
            disabled={isLoading || !urlIsValid}
            className="bg-[#0077B5] text-white hover:bg-[#0077B5]/90 disabled:opacity-60"
          >
            <ExternalLink className="size-4 mr-2" />
            {isLoading ? 'Cargando enlace…' : 'Abrir Sales Navigator'}
          </Button>
        </div>
      </div>

      {/* Paso 2 */}
      <div className="border border-[#DCDEDC] rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-[#1F554A] text-white rounded-full size-6 text-sm font-medium shrink-0">
            2
          </span>
          <p className="text-sm font-medium text-[#141414]">Ajusta el link <span className="text-gray-400 font-normal">(opcional)</span></p>
        </div>
        <p className="text-sm text-gray-600 pl-8">
          Si modificaste los filtros dentro de Sales Navigator, pega el nuevo link aquí.
        </p>
        <div className="pl-8 space-y-1.5">
          <Input
            value={customUrl}
            onChange={(e) => handleUrlInputChange(e.target.value)}
            placeholder="https://www.linkedin.com/sales/search/..."
            className="text-sm border-[#DCDEDC] focus:border-[#1F554A] focus:ring-[#1F554A]/30"
          />
          {urlInputInvalid && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <XCircle className="size-3.5 shrink-0" />
              El link debe comenzar con https://www.linkedin.com/sales/search/
            </p>
          )}
        </div>
      </div>

      {/* Paso 3 */}
      <div className="border border-[#DCDEDC] rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-[#1F554A] text-white rounded-full size-6 text-sm font-medium shrink-0">
            3
          </span>
          <p className="text-sm font-medium text-[#141414]">Carga tu sesión de LinkedIn</p>
        </div>
        <p className="text-sm text-gray-600 pl-8">
          Copia tus cookies con EditThisCookie y pégalas aquí.
        </p>
        <div className="pl-8">
          {cookieValidation.valid ? (
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
          disabled={!cookieValidation.valid || urlInputInvalid}
          className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 disabled:opacity-60"
        >
          Continuar con ranking
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
