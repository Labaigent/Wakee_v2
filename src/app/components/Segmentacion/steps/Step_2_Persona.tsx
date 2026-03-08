// External libraries
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Separator } from '../../ui/separator';

// Internal — queries
import { useE4PersonaOutputQuery } from '@/app/queries/e4PersonaOutput';

// Internal — services
import { triggerE5Filtro } from '@/services/n8nService';

interface StepPersonaProps {
  perfilId: number | null;
  ejecucionId: number | null;
  personaEdits: string;
  onPersonaEditsChange: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  isCompleted?: boolean;
}

export function StepPersona({
  perfilId,
  ejecucionId,
  personaEdits,
  onPersonaEditsChange,
  onConfirm,
  onBack,
  isCompleted = false,
}: StepPersonaProps) {
  const { data: persona, isLoading } = useE4PersonaOutputQuery(ejecucionId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---
  const handleConfirm = async () => {
    if (!perfilId || !ejecucionId) return;
    setIsSubmitting(true);

    try {
      await triggerE5Filtro({ perfil_id: perfilId, ejecucion_id: ejecucionId });
      toast.success('Buyer Persona validado. Generando filtro...');
      onConfirm();
    } catch {
      toast.error('Error al generar el filtro. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Valida el Buyer Persona</h3>
        <p className="text-sm text-gray-600">Revisa y ajusta el perfil del tomador de decisiones</p>
      </div>

      {/* Resumen persona */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-[#1F554A]" />
        </div>
      ) : !persona ? (
        <div className="border rounded-lg p-6 bg-gray-50 text-sm text-gray-500 text-center">
          Sin datos de persona para esta ejecución.
        </div>
      ) : (
        <div className="space-y-4 border rounded-lg p-4 sm:p-6 bg-gray-50">
          <div>
            <p className="text-sm text-gray-500 mb-1">Título / Rol</p>
            <p className="font-medium">{persona.titulo_rol}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Seniority</p>
              <p className="font-medium">{persona.seniority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Departamento</p>
              <p className="font-medium">{persona.departamento}</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-2">Funciones</p>
            <ul className="space-y-2">
              {(persona.funciones ?? []).map((goal, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <CheckCircle2 className="size-4 mt-0.5 flex-shrink-0 text-[#1F554A]" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Dolor Específico RE</p>
            <ul className="space-y-2">
              {(persona.dolor_especifico_re ?? []).map((pain, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <AlertCircle className="size-4 mt-0.5 flex-shrink-0 text-gray-500" />
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Por qué la empresa</p>
            <ul className="space-y-2">
              {(persona.porque_empresa ?? []).map((criteria, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-[#1F554A] font-bold">→</span>
                  <span>{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">KPIs</p>
            <ul className="space-y-2">
              {(persona.kpis ?? []).map((criteria, i) => (
                <li key={i} className="text-sm text-gray-700 flex gap-2">
                  <span className="text-[#1F554A] font-bold">→</span>
                  <span>{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Ajustes opcionales */}
      <div>
        <Label className="text-sm mb-2 block">Ajustes o comentarios (opcional)</Label>
        <Textarea
          value={personaEdits}
          onChange={(e) => onPersonaEditsChange(e.target.value)}
          rows={3}
          placeholder="Ej: Agregar enfoque en sostenibilidad, ajustar seniority..."
        />
      </div>
      <Separator />
      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4 mr-2" />
          Volver
        </Button>
        <div className="flex flex-col items-end gap-1">
          {isCompleted && (
            <p className="text-xs text-gray-500">Este paso ya fue ejecutado en esta ejecución.</p>
          )}
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || isCompleted}
            className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="size-4 ml-2" />
            )}
            {isSubmitting ? 'Generando filtro...' : 'Validar y continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
