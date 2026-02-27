// React
import { useState, useEffect } from "react";

// External libraries
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Internal — types
import type { SenalMercado } from '../../../types/db/senalMercado';
import type { GanchoMercado } from '../../../types/db/ganchoMercado';

// Internal — services
import { fetchSenalesMercado, fetchGanchosMercado, fetchInputsEstrategicos } from '../../../services/supabaseService';
import { triggerE3NuevaSesion } from '../../../services/n8nService';

// Internal — queries
import { useSemanasQuery } from '../../queries/semanas';

// Internal — components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SenalesMercado } from './SenalesMercado';
import { GanchosMercado } from './GanchosMercado';

interface NuevaSesionProps {
  onComplete: () => void;
}

/**
 * NuevaSesion Component
 * 
 * Purpose: Handles the initiation of a new prospecting session.
 * Consists of a form for broker information and a read-only market context section.
 */
export function NuevaSesion({ onComplete }: NuevaSesionProps) {
  // --- State (form) ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brokerName: "",
    operationalFocus: "",
    assetClass: "",
    additionalContext: "",
  });

  // --- State (data layer) ---
  const { data: semanas = [], isLoading: isLoadingSemanas } = useSemanasQuery();
  const [cargandoSeñales, setCargandoSeñales] = useState(false);
  const [cargandoGanchos, setCargandoGanchos] = useState(false);
  const [cargandoInputs, setCargandoInputs] = useState(false);
  const [senalesMercado, setSenalesMercado] = useState<SenalMercado[]>([]);
  const [ganchosMercado, setGanchosMercado] = useState<GanchoMercado[]>([]);
  const [opcionesFocoOperativo, setOpcionesFocoOperativo] = useState<string[]>([]);
  const [opcionesAssetClass, setOpcionesAssetClass] = useState<string[]>([]);

  // NuevaSesion siempre muestra la semana más reciente (sin navegación).
  const currentSemana = semanas[0];

  // Re-fetcha señales cuando resuelve la semana activa.
  useEffect(() => {
    if (!currentSemana?.id) return;
    setCargandoSeñales(true);
    fetchSenalesMercado({ semanaId: currentSemana.id })
      .then(data => { setSenalesMercado(data); setCargandoSeñales(false); })
      .catch(() => setCargandoSeñales(false));
  }, [currentSemana?.id]);

  // Re-fetcha ganchos cuando resuelve la semana activa.
  useEffect(() => {
    if (!currentSemana?.id) return;
    setCargandoGanchos(true);
    fetchGanchosMercado({ semanaId: currentSemana.id })
      .then(data => { setGanchosMercado(data); setCargandoGanchos(false); })
      .catch(() => setCargandoGanchos(false));
  }, [currentSemana?.id]);

  // Carga inputs estratégicos para poblar los dropdowns.
  useEffect(() => {
    setCargandoInputs(true);
    fetchInputsEstrategicos()
      .then(data => {
        const categorias = Array.from(
          new Set(
            data
              .map(row => row.category)
              .filter((value): value is string => Boolean(value?.trim()))
          )
        );
        const subcategorias = Array.from(
          new Set(
            data
              .map(row => row.subcategory)
              .filter((value): value is string => Boolean(value?.trim()))
          )
        );

        setOpcionesFocoOperativo(categorias);
        setOpcionesAssetClass(subcategorias);
        setCargandoInputs(false);
      })
      .catch(() => setCargandoInputs(false));
  }, []);

  // --- Helpers ---
  const isValid =
    formData.brokerName &&
    formData.operationalFocus &&
    formData.assetClass;

  // --- Handlers ---
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSemana) return;
    setIsSubmitting(true);

    try {
      toast.success("Sesión iniciada. Te notificaremos cuando las propuestas de ICP estén listas.");
      await triggerE3NuevaSesion({
        brokerName: formData.brokerName,
        operationalFocus: formData.operationalFocus,
        assetClass: formData.assetClass,
        additionalContext: formData.additionalContext,
        semanaId: currentSemana.id,
        semanaFechaInicio: currentSemana.fecha_inicio_semana,
      });
      onComplete();
    } catch {
      toast.error("Error al iniciar la sesión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-medium mb-2">
          Nueva Sesión de Prospección
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Completa tu información y revisa el contexto de mercado actual
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="border-2 border-[#1F554A] rounded-lg p-4 sm:p-6 bg-white">
            <h3 className="text-base sm:text-lg font-medium mb-4 text-[#141414]">
              Información de la Sesión
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="brokerName" className="text-sm font-medium">
                  Nombre del Broker *
                </Label>
                <Input
                  id="brokerName"
                  value={formData.brokerName}
                  onChange={(e) => handleChange("brokerName", e.target.value)}
                  className="mt-2"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="operationalFocus" className="text-sm font-medium">
                  Foco Operativo *
                </Label>
                <Select
                  value={formData.operationalFocus}
                  onValueChange={(v) => handleChange("operationalFocus", v)}
                  required
                  disabled={cargandoInputs}
                >
                  <SelectTrigger id="operationalFocus" className="mt-2">
                    <SelectValue placeholder="Selecciona tu foco" />
                  </SelectTrigger>
                  <SelectContent>
                    {opcionesFocoOperativo.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assetClass" className="text-sm font-medium">
                  Asset Class *
                </Label>
                <Select
                  value={formData.assetClass}
                  onValueChange={(v) => handleChange("assetClass", v)}
                  required
                  disabled={cargandoInputs}
                >
                  <SelectTrigger id="assetClass" className="mt-2">
                    <SelectValue placeholder="Selecciona asset class" />
                  </SelectTrigger>
                  <SelectContent>
                    {opcionesAssetClass.map((subcategoria) => (
                      <SelectItem key={subcategoria} value={subcategoria}>
                        {subcategoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additionalContext" className="text-sm font-medium">
                  Contexto Adicional (Opcional)
                </Label>
                <Textarea
                  id="additionalContext"
                  value={formData.additionalContext}
                  onChange={(e) => handleChange("additionalContext", e.target.value)}
                  rows={2}
                  className="mt-2"
                  placeholder="Cualquier información adicional relevante..."
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full bg-[#1F554A] text-white hover:bg-[#1F554A]/90"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Process Info */}
          <div className="bg-[#C4FF81]/10 border-2 border-[#DCDEDC] rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3 text-[#141414] uppercase tracking-wide">
              Proceso
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#1F554A] font-bold">1.</span>
                <span>Generación de 3 propuestas de ICP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F554A] font-bold">2.</span>
                <span>Validación de Buyer Persona</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F554A] font-bold">3.</span>
                <span>Confirmación de filtro de búsqueda</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F554A] font-bold">4.</span>
                <span>Descubrimiento y ranking de ~30 leads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F554A] font-bold">5.</span>
                <span>Selección de Leads priorizados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1F554A] font-bold">6.</span>
                <span>Generación de correos personalizados</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column: Market Context (Read-only) */}
        <div className="space-y-6">
          <div className="border-2 border-[#DCDEDC] rounded-lg p-4 sm:p-6 bg-white sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-[#141414]">
                  Contexto de Mercado
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isLoadingSemanas ? (
                    <Loader2 className="size-3 animate-spin text-[#1F554A] inline" />
                  ) : currentSemana ? (
                    `Semana del ${new Date(currentSemana.fecha_inicio_semana + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  ) : (
                    'Sin datos disponibles'
                  )}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Información de mercado relevante para tu estrategia de prospección
            </p>

            <div className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {cargandoSeñales ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-5 animate-spin text-[#1F554A]" />
                </div>
              ) : (
                <SenalesMercado señales={senalesMercado} />
              )}

              {cargandoGanchos ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="size-5 animate-spin text-[#1F554A]" />
                </div>
              ) : (
                <GanchosMercado ganchos={ganchosMercado} />
              )}

              {/* Info Footer */}
              <div className="bg-[#C4FF81]/10 border-2 border-[#DCDEDC] rounded-lg p-4">
                <p className="text-xs text-gray-700">
                  💡 Esta información se actualiza semanalmente y se usa automáticamente para generar ICPs más precisos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
