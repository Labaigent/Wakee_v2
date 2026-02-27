import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Separator } from '../../ui/separator';
import { toast } from 'sonner';
import { ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { buyerPersona } from '../wizardData';

interface StepPersonaProps {
  personaEdits: string;
  onPersonaEditsChange: (value: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function StepPersona({
  personaEdits,
  onPersonaEditsChange,
  onConfirm,
  onBack,
}: StepPersonaProps) {
  const handleConfirm = () => {
    toast.success('Buyer Persona validado');
    onConfirm();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-medium mb-2">Valida el Buyer Persona</h3>
        <p className="text-sm text-gray-600">Revisa y ajusta el perfil del tomador de decisiones</p>
      </div>

      <div className="space-y-4 border rounded-lg p-4 sm:p-6 bg-gray-50">
        <div>
          <p className="text-sm text-gray-500 mb-1">Título / Rol</p>
          <p className="font-medium">{buyerPersona.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Seniority</p>
            <p className="font-medium">{buyerPersona.seniority}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Departamento</p>
            <p className="font-medium">{buyerPersona.department}</p>
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium mb-2">Funciones</p>
          <ul className="space-y-2">
            {buyerPersona.funciones.map((goal, i) => (
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
            {buyerPersona.dolorEspecificoRE.map((pain, i) => (
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
            {buyerPersona.porQueEmpresa.map((criteria, i) => (
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
            {buyerPersona.kpis.map((criteria, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-[#1F554A] font-bold">→</span>
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4 mr-2" />
          Volver
        </Button>
        <Button onClick={handleConfirm} className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90">
          Validar y continuar
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
