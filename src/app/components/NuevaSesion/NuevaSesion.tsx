// React
import { useState } from "react";

// External libraries
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Internal — types
import type { CompanySignal, MarketHook } from './types';

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
  // --- State ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    brokerName: "",
    operationalFocus: "",
    assetClass: "",
    additionalContext: "",
  });

  // Mock data del Master Report - semana actual
  // TODO: In the future, these could be fetched from the service layer similar to MasterIntelligenceReport
  const companySignals: CompanySignal[] = [
    {
      id: "sig-1",
      company: "Amazon México",
      signal: "Expansión de centros de distribución - 3 nuevos fulfillment centers",
      assetClass: "Industrial",
    },
    {
      id: "sig-2",
      company: "Mercado Libre",
      signal: "Inversión $200M USD en infraestructura logística",
      assetClass: "Industrial",
    },
    {
      id: "sig-3",
      company: "HSBC México",
      signal: "Consolidación de 5 edificios en 2 hubs premium con LEED",
      assetClass: "Oficinas",
    },
    {
      id: "sig-4",
      company: "FEMSA (Oxxo)",
      signal: "12 centros de distribución urbanos en ciudades medias",
      assetClass: "Industrial",
    },
  ];

  const marketHooks: MarketHook[] = [
    {
      id: "hook-1",
      topic: "Nearshoring",
      hook: "Demanda industrial +45% YoY, ocupación 95% en corredores principales",
    },
    {
      id: "hook-2",
      topic: "Trabajo Híbrido",
      hook: "Footprint -30%, pero renta premium +15%",
    },
    {
      id: "hook-3",
      topic: "Tasas de Interés",
      hook: "Banxico 11%, expectativa 9.5% H2 2026. Arrendamientos activos",
    },
    {
      id: "hook-4",
      topic: "E-commerce",
      hook: "Crecimiento 23% YoY, demanda micro-fulfillment +60%",
    },
  ];

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
    setIsSubmitting(true);

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(
      "Sesión iniciada. Te notificaremos cuando las propuestas de ICP estén listas.",
    );

    setIsSubmitting(false);
    onComplete();
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
                >
                  <SelectTrigger id="operationalFocus" className="mt-2">
                    <SelectValue placeholder="Selecciona tu foco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant-rep">
                      Tenant Representation
                    </SelectItem>
                    <SelectItem value="landlord-rep">
                      Landlord Representation
                    </SelectItem>
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
                >
                  <SelectTrigger id="assetClass" className="mt-2">
                    <SelectValue placeholder="Selecciona asset class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">
                      Oficinas corporativas y Servicios BPO
                    </SelectItem>
                    <SelectItem value="industrial">
                      Industrial / Logística
                    </SelectItem>
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
                  Semana del 10 de Febrero, 2026
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Información de mercado relevante para tu estrategia de prospección
            </p>

            <div className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              <SenalesMercado signals={companySignals} />
              
              <GanchosMercado hooks={marketHooks} />

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
