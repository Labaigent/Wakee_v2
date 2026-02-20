import { useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Copy, ExternalLink, Edit } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

export function MyStrategy() {
  const [editingEmail, setEditingEmail] = useState<string | null>(null);

  const session = {
    name: 'Sesión Estratégica - Industrial',
    createdAt: '2026-02-11',
    icp: {
      profile: 'Fabricantes relocalizando (Nearshoring)',
      painHypothesis: 'Naves industriales modernas con certificaciones ambientales cerca frontera norte'
    },
    persona: {
      title: 'Director de Operaciones / VP of Supply Chain',
      goals: ['Expandir capacidad manufacturera', 'Reducir costos vs. Asia', 'Certificaciones sostenibles'],
      painPoints: ['Tiempos de envío largos desde Asia', 'Incertidumbre geopolítica', 'Presión por certificaciones']
    },
    boolean: '(CEO OR COO OR "VP Operations") AND (manufacturing OR nearshoring) AND employees:100-1000',
    top5: [
      { name: 'Ricardo Martínez', company: 'AutoParts MX', title: 'COO' },
      { name: 'Sandra López', company: 'TechManufactura', title: 'VP Ops' },
      { name: 'Miguel Hernández', company: 'IndustrialSolutions', title: 'CEO' },
      { name: 'Patricia Ramos', company: 'GlobalComponents', title: 'Director Ops' },
      { name: 'Fernando Silva', company: 'MexFactory', title: 'VP Supply Chain' }
    ],
    emails: [
      {
        id: '1',
        leadName: 'Ricardo Martínez',
        company: 'AutoParts MX',
        subject: 'Naves industriales estratégicas para AutoParts MX',
        body: `Hola Ricardo,

Vi que AutoParts MX está aprovechando nearshoring para expandir capacidad. Felicidades por el crecimiento.

Trabajo con C&W y me especializo en naves industriales modernas. Tengo acceso a espacios clase A en Monterrey-Saltillo:

• Altura libre 12-14m
• Certificación LEED Gold
• Disponibilidad Q2 2026
• Proximidad a Texas

¿15 minutos esta semana para explorar opciones?

Saludos,
[Tu nombre]
Cushman & Wakefield`
      },
      {
        id: '2',
        leadName: 'Sandra López',
        company: 'TechManufactura',
        subject: 'Soluciones industriales sostenibles para TechManufactura',
        body: `Hola Sandra,

Noté que TechManufactura está consolidando operaciones. Entiendo los desafíos de encontrar espacios modernos y sostenibles.

Como especialista en C&W, tengo naves con certificaciones que podrían encajar:

• 3,000-4,500 m² en Querétaro
• Certificación EDGE + energía solar
• Acceso autopista México-Querétaro

¿Podríamos agendar una llamada?

Saludos,
[Tu nombre]
C&W Industrial`
      }
    ]
  };

  const handleCopyEmail = (email: any) => {
    const full = `Asunto: ${email.subject}\n\n${email.body}`;
    copyToClipboard(full, 'Correo copiado al portapapeles');
  };

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <h2 className="text-2xl font-medium mb-2">Estrategia</h2>
        <p className="text-gray-600">{session.name}</p>
        <p className="text-sm text-gray-400 mt-1">{session.createdAt}</p>
      </div>

      <Tabs defaultValue="icp">
        <TabsList className="bg-transparent border-b w-full justify-start p-0 h-auto">
          <TabsTrigger value="icp" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-4 py-2">
            ICP
          </TabsTrigger>
          <TabsTrigger value="persona" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-4 py-2">
            Persona
          </TabsTrigger>
          <TabsTrigger value="boolean" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-4 py-2">
            Filtro
          </TabsTrigger>
          <TabsTrigger value="top5" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-4 py-2">
            Top 5
          </TabsTrigger>
          <TabsTrigger value="emails" className="rounded-none border-b-2 border-transparent data-[state=active]:border-black px-4 py-2">
            Correos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="icp" className="mt-8 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Perfil</h3>
            <p className="text-lg">{session.icp.profile}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Hipótesis de dolor</h3>
            <p className="text-gray-700">{session.icp.painHypothesis}</p>
          </div>
        </TabsContent>

        <TabsContent value="persona" className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Título</h3>
            <p>{session.persona.title}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Objetivos</h3>
            <ul className="space-y-1">
              {session.persona.goals.map((g, i) => (
                <li key={i} className="text-gray-700">• {g}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pain Points</h3>
            <ul className="space-y-1">
              {session.persona.painPoints.map((p, i) => (
                <li key={i} className="text-gray-700">• {p}</li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="boolean" className="mt-8 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">String de Sales Navigator</h3>
            <div className="bg-gray-50 p-4 rounded font-mono text-sm border">
              {session.boolean}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            copyToClipboard(session.boolean, 'Filtro copiado');
          }}>
            <Copy className="size-4 mr-2" />
            Copiar
          </Button>
        </TabsContent>

        <TabsContent value="top5" className="mt-8 space-y-3">
          {session.top5.map((lead, i) => (
            <div key={i} className="border-b pb-3">
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm text-gray-600">{lead.title} • {lead.company}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="emails" className="mt-8 space-y-8">
          {session.emails.map((email) => (
            <div key={email.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{email.leadName}</h3>
                  <p className="text-sm text-gray-500">{email.company}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingEmail(editingEmail === email.id ? null : email.id)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleCopyEmail(email)}>
                    <Copy className="size-4" />
                  </Button>
                  <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                    <ExternalLink className="size-4" />
                  </Button>
                </div>
              </div>

              {editingEmail === email.id ? (
                <div className="space-y-3">
                  <input
                    defaultValue={email.subject}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <Textarea defaultValue={email.body} rows={10} className="font-mono text-sm" />
                  <Button size="sm">Guardar</Button>
                </div>
              ) : (
                <>
                  <div className="border-l-2 pl-4">
                    <p className="text-sm text-gray-500 mb-1">Asunto</p>
                    <p className="font-medium">{email.subject}</p>
                  </div>
                  <div className="border-l-2 pl-4">
                    <p className="text-sm text-gray-500 mb-2">Cuerpo</p>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{email.body}</pre>
                  </div>
                </>
              )}

              <Separator />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}