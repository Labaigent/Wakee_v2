// React
import { useState, useEffect } from 'react';

// External libraries
import { toast } from 'sonner';
import {
  Copy,
  Check,
  Mail,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';
import { Progress } from '../../ui/progress';

// Internal — utils
import { copyToClipboard } from '../../../utils/clipboard';

interface EmailDraft {
  id: string;
  leadName: string;
  leadTitle: string;
  company: string;
  subject: string;
  body: string;
}

interface StepMensajesProps {
  sessionId: string;
  selectedLeads: string[];
  onComplete: () => void;
}

export function StepMensajes({ onComplete }: StepMensajesProps) {
  // --- State ---
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generationFailed, setGenerationFailed] = useState(false);
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>([]);

  // Simulación generación de correos (E10+E11)
  useEffect(() => {
    const generateEmails = async () => {
      const stages = [
        { progress: 20, status: 'Analizando contexto de cada lead...' },
        { progress: 40, status: 'Incorporando señales del Master Report...' },
        { progress: 60, status: 'Generando asuntos personalizados...' },
        { progress: 80, status: 'Escribiendo cuerpos de correo...' },
        { progress: 100, status: 'Completado' }
      ];

      try {
        for (const stage of stages) {
          await new Promise(resolve => setTimeout(resolve, 1200));
          setGenerationProgress(stage.progress);
          setGenerationStatus(stage.status);
        }

        // Mock data - estos vendrían del LLM
        const mockDrafts: EmailDraft[] = [
          {
            id: 'email-1',
            leadName: 'Carlos Mendoza',
            leadTitle: 'VP of Operations',
            company: 'Grupo Logístico del Norte',
            subject: 'Espacios industriales para tu expansión en nearshoring',
            body: `Hola Carlos,

Vi tu publicación reciente sobre el futuro del nearshoring en México y me pareció muy alineada con lo que estamos viendo en el mercado.

En WSD hemos estado trabajando con empresas logísticas en expansión similares a Grupo Logístico del Norte. Sabemos que están planeando apertura de 3 nuevos hubs en Q2 2026.

Tenemos disponibilidad de espacios de 15,000-25,000 m² con altura >12m en zonas estratégicas cerca de CDMX con acceso directo a autopistas principales. Estos espacios están listos para automatización y cumplen con los estándares que empresas en nearshoring están buscando.

Dado tu timeline de Q2, ¿tiene sentido agendar una llamada de 20 minutos esta semana para revisar opciones específicas?

Saludos,
[Tu nombre]
`
          },
          {
            id: 'email-2',
            leadName: 'Ana Patricia Torres',
            leadTitle: 'Director de Supply Chain',
            company: 'Manufactura Industrial MX',
            subject: 'Naves industriales con certificación LEED para tu relocalization',
            body: `Hola Ana Patricia,

He seguido tu trayectoria en la transición de manufactura Asia → México y me impresiona el enfoque en sostenibilidad que Manufactura Industrial MX está tomando.

En WSD especializamos en espacios industriales con certificaciones ambientales. Entendemos que la certificación LEED no es solo un nice-to-have, sino un requisito fundamental para tu operación.

Tenemos opciones de 10,000-30,000 m² con:
• Certificación LEED Gold/Platinum
• Diseño modular para escalabilidad
• Ubicación estratégica cerca de frontera norte
• Timeline alineado con tu H2 2026

Como sé que el proceso involucra múltiples stakeholders, preparé un dossier con specs técnicas y proyecciones de ROI que podrías compartir con tu CFO y CEO.

¿Te parece útil una reunión virtual para revisarlo?

Saludos,
[Tu nombre]
`
          },
          {
            id: 'email-3',
            leadName: 'Roberto Sánchez',
            leadTitle: 'COO',
            company: 'Autopartes del Bajío',
            subject: 'Build-to-suit para expansión automotive',
            body: `Hola Roberto,

Felicidades por los nuevos contratos con Tesla y GM. Vi tu publicación sobre la expansión de capacidad y me pareció una oportunidad perfecta para conectar.

En WSD tenemos experiencia comprobada en proyectos build-to-suit para tier-1 automotive suppliers. Entendemos los requerimientos específicos del sector y los timelines que contratos con OEMs demandan.

Para los 20,000 m² que Autopartes del Bajío necesita, podemos ofrecer:
• Ubicaciones estratégicas cerca de plantas GM/Tesla
• Diseño customizado según specs de producción
• Contratos de largo plazo (10-15 años) con términos flexibles
• Gestión integral del proyecto

Como sé que este tipo de decisiones involucran al Board y múltiples VPs, podemos estructurar una presentación ejecutiva que cubra todos los aspectos técnicos y financieros.

¿Te parece si agendamos 30 minutos para una primera conversación?

Saludos,
[Tu nombre]
`
          },
          {
            id: 'email-4',
            leadName: 'María Fernanda Gutiérrez',
            leadTitle: 'VP of Real Estate',
            company: 'E-commerce Solutions LATAM',
            subject: 'Soluciones de micro-fulfillment con tech integrado',
            body: `Hola María Fernanda,

Tu presentación en el E-commerce Innovation Summit sobre micro-fulfillment fue excelente. Me quedó claro que E-commerce Solutions LATAM está liderando la innovación en last-mile.

En WSD hemos desarrollado una especialización en espacios tech-enabled para e-commerce. Entendemos que no se trata solo de m², sino de infraestructura preparada para automatización.

Para tu expansión a 12 ciudades tier 2, tenemos:
• Espacios 3,000-8,000 m² en ubicaciones urbanas estratégicas
• Infraestructura eléctrica y de conectividad para automatización
• Flexibilidad en contratos 3-5 años con opciones de renovación
• Modelo replicable que optimiza tu capex

Dado que trabajan con presupuestos ajustados pero volumen alto, estructuramos propuestas que maximizan ROI por ubicación.

¿15 minutos esta semana para explorar las primeras 3 ubicaciones?

Saludos,
[Tu nombre]`
          },
          {
            id: 'email-5',
            leadName: 'Jorge Luis Ramírez',
            leadTitle: 'Director de Operaciones',
            company: 'Distribuidora Nacional',
            subject: 'Hubs de almacenamiento: eficiencia + costos optimizados',
            body: `Hola Jorge Luis,

Vi tu análisis sobre eficiencia logística y consolidación de centros. Es exactamente el tipo de proyecto en el que C&W puede aportar valor real.

Para la consolidación de tus 5 centros pequeños en 2 hubs grandes, tenemos opciones que optimizan tanto costo por m² como eficiencia operativa:

• Ubicaciones urbanas con conectividad premium
• Espacios que reducen costos de transporte vs. múltiples ubicaciones
• Timeline inmediato: disponibilidad Q1-Q2 2026
• Pricing competitivo dentro de tu budget de $30M MXN

Como tienes experiencia previa con espacios similares, sabes que la ubicación correcta marca la diferencia en costos operativos anuales.

¿Te parece útil revisar 2-3 opciones específicas en una llamada de 20 minutos?

Saludos,
[Tu nombre]
Cushman & Wakefield Colombia`
          }
        ];

        setEmailDrafts(mockDrafts);
        setIsGenerating(false);
        toast.success('5 correos personalizados generados correctamente');
      } catch (error) {
        setGenerationFailed(true);
        setIsGenerating(false);
        toast.error('No pudimos generar los correos');
      }
    };

    generateEmails();
  }, []);

  // --- Handlers ---
  const handleRetry = () => {
    setIsGenerating(true);
    setGenerationFailed(false);
    setGenerationProgress(0);
    // Trigger regeneration logic here
  };

  const handleCopy = (emailId: string, content: string) => {
    copyToClipboard(content, 'Correo copiado al portapapeles');
    setCopiedEmail(emailId);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSubjectChange = (emailId: string, newSubject: string) => {
    setEmailDrafts(prev =>
      prev.map(email =>
        email.id === emailId ? { ...email, subject: newSubject } : email
      )
    );
  };

  const handleBodyChange = (emailId: string, newBody: string) => {
    setEmailDrafts(prev =>
      prev.map(email =>
        email.id === emailId ? { ...email, body: newBody } : email
      )
    );
    // Auto-save indicator
    toast.success('Cambios guardados', { duration: 1000 });
  };

  const handleOpenInGmail = (email: EmailDraft) => {
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
    window.open(mailtoLink, '_blank');
    toast.success('Abriendo Gmail...');
  };

  const handleOpenInOutlook = (email: EmailDraft) => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
    window.location.href = mailtoLink;
    toast.success('Abriendo cliente de email...');
  };

  const handleExportPDF = (_email: EmailDraft) => {
    // Simulación - en producción usaría una librería como jsPDF
    toast.info('Exportar PDF: Funcionalidad en desarrollo');
  };

  // Loading State
  if (isGenerating) {
    return (
      <div className="space-y-8 py-12">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <Sparkles className="size-12 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-2">Generando tus 5 correos personalizados</h2>
            <p className="text-gray-600">
              Estamos escribiendo correos únicos para cada lead basados en su contexto
            </p>
          </div>

          <div className="space-y-3">
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-gray-600">{generationStatus}</p>
          </div>

          <div className="pt-4 text-xs text-gray-500 space-y-1">
            <p>• Analizando dossiers y señales de mercado</p>
            <p>• Ajustando tono según mentalidad del lead</p>
            <p>• Incorporando talking points relevantes</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (generationFailed) {
    return (
      <div className="space-y-8 py-12">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="size-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <Mail className="size-8 text-red-600" />
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-2">No pudimos generar los correos</h2>
            <p className="text-gray-600">
              Hubo un error al generar los borradores. Por favor intenta nuevamente.
            </p>
          </div>

          <Button onClick={handleRetry} className="bg-purple-600 text-white hover:bg-purple-700">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  // Success State with Drafts
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            E10+E11 Completado
          </Badge>
          <span className="text-xs text-gray-400">→</span>
          <Badge className="text-xs bg-green-600">
            Paso 2.8: Borradores Listos
          </Badge>
        </div>
        <h2 className="text-2xl font-medium mb-2">Borradores de Correos</h2>
        <p className="text-gray-600">
          Edita los correos según tu estilo y cópialos para enviar desde tu email
        </p>
      </div>

      {/* Email Drafts */}
      <div className="space-y-4">
        {emailDrafts.map((email, index) => {
          const isExpanded = expandedEmail === email.id;

          return (
            <div
              key={email.id}
              className={`border rounded-lg transition-all ${
                isExpanded ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="size-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{email.leadName}</h3>
                    <p className="text-sm text-gray-600">{email.leadTitle} • {email.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(email.id, `Asunto: ${email.subject}\n\n${email.body}`)}
                  >
                    {copiedEmail === email.id ? (
                      <><Check className="size-4 mr-1.5 text-green-600" /> Copiado</>
                    ) : (
                      <><Copy className="size-4 mr-1.5" /> Copiar</>
                    )}
                  </Button>
                  <button
                    onClick={() => setExpandedEmail(isExpanded ? null : email.id)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content - Editable */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t">
                  {/* Subject */}
                  <div className="pt-4">
                    <Label className="text-sm font-medium mb-2 block">Asunto</Label>
                    <Input
                      value={email.subject}
                      onChange={(e) => handleSubjectChange(email.id, e.target.value)}
                      className="font-medium"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Cuerpo del correo</Label>
                    <Textarea
                      value={email.body}
                      onChange={(e) => handleBodyChange(email.id, e.target.value)}
                      rows={16}
                      className="font-mono text-sm leading-relaxed"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Los correos son editables. Ajusta el tono o contenido según tu estilo personal.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      onClick={() => handleOpenInGmail(email)}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Abrir en Gmail
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenInOutlook(email)}
                      className="bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Abrir en Outlook
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleExportPDF(email)}
                      className="bg-gray-500 text-white hover:bg-gray-600"
                    >
                      Exportar PDF
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Todos los correos han sido generados. Puedes copiarlos y enviarlos desde tu cliente de email.
            </p>
            <p className="text-xs text-gray-500">
              Tip: Personaliza el cierre con tu información de contacto
            </p>
          </div>
          <Button onClick={onComplete} variant="outline">
            Marcar como Completado
          </Button>
        </div>
      </div>
    </div>
  );
}