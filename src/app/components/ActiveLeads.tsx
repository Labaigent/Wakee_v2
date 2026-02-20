import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

export function ActiveLeads() {
  const [searchQuery, setSearchQuery] = useState('');

  const leads = [
    {
      id: '1',
      name: 'María González',
      title: 'CEO',
      company: 'TechCorp SA',
      score: 95,
      painPoints: [
        'Expansión de oficinas para crecimiento de 40% anual',
        'Espacios con diseño moderno',
        'Presupuesto flexible, ubicación premium'
      ],
      activity: [
        'Publicó sobre expansión hace 2 semanas',
        'Empresa levantó $5M',
        'Mencionó búsqueda en LinkedIn'
      ],
      emailSubject: 'Espacios premium para el crecimiento de TechCorp'
    },
    {
      id: '2',
      name: 'Carlos Ruiz',
      title: 'COO',
      company: 'InnovaLabs',
      score: 92,
      painPoints: [
        'Consolidación de 3 oficinas',
        'Espacios de laboratorio + oficinas',
        'Sostenibilidad y certificaciones'
      ],
      activity: [
        'Compartió artículo sobre eficiencia operativa',
        'Reconocimiento de sostenibilidad',
        'Optimizando costos de arrendamientos'
      ],
      emailSubject: 'Solución de consolidación para InnovaLabs'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      title: 'VP Operations',
      company: 'DataFlow Inc',
      score: 88,
      painPoints: [
        'Expansión a nueva ciudad, primera oficina CDMX',
        'Flexibilidad en términos',
        'Conectividad y acceso a talento'
      ],
      activity: [
        'Publicó vacantes para CDMX',
        'Anunció expansión geográfica',
        'Conectó con brokers'
      ],
      emailSubject: 'Bienvenida a CDMX: Espacios estratégicos'
    },
    {
      id: '4',
      name: 'Pedro Sánchez',
      title: 'CEO',
      company: 'CloudSystems',
      score: 85,
      painPoints: [
        'Crecimiento rápido post-Serie B',
        'Oficina actual se queda pequeña en 6 meses',
        'Imagen corporativa profesional'
      ],
      activity: [
        'Cerró Serie B de $8M',
        'Contratación masiva',
        'Mencionó oficinas en podcast'
      ],
      emailSubject: 'Espacios que escalan con CloudSystems'
    },
    {
      id: '5',
      name: 'Laura Fernández',
      title: 'CFO',
      company: 'SmartOffice',
      score: 83,
      painPoints: [
        'Optimización de costos inmobiliarios',
        'Modelos híbridos y flexibles',
        'Reducir footprint manteniendo presencia'
      ],
      activity: [
        'Artículo sobre workplace del futuro',
        'Política de trabajo híbrido',
        'Evaluando coworking'
      ],
      emailSubject: 'Modelos flexibles para SmartOffice'
    }
  ];

  const filteredLeads = leads.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium mb-2">Leads</h2>
          <p className="text-gray-600">Top 5 prioritarios</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-[#1F554A]">
              <th className="text-left py-3 px-3 text-sm font-medium text-[#141414]">#</th>
              <th className="text-left py-3 px-3 text-sm font-medium text-[#141414] min-w-[150px]">Contacto</th>
              <th className="text-left py-3 px-3 text-sm font-medium text-[#141414] min-w-[200px]">Pain Points</th>
              <th className="text-left py-3 px-3 text-sm font-medium text-[#141414] min-w-[180px]">Última Actividad</th>
              <th className="text-left py-3 px-3 text-sm font-medium text-[#141414] min-w-[180px]">Email</th>
              <th className="text-center py-3 px-3 text-sm font-medium text-[#141414]">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, i) => (
              <tr key={lead.id} className="border-b border-[#DCDEDC] hover:bg-[#C4FF81]/5 transition-colors">
                <td className="py-4 px-3 text-sm text-gray-500">
                  {i + 1}
                </td>
                <td className="py-4 px-3">
                  <div>
                    <p className="font-medium text-sm text-[#141414]">{lead.name}</p>
                    <p className="text-xs text-gray-600">{lead.title}</p>
                    <p className="text-xs text-gray-500">{lead.company}</p>
                  </div>
                </td>
                <td className="py-4 px-3">
                  <ul className="space-y-1">
                    {lead.painPoints.slice(0, 2).map((p, idx) => (
                      <li key={idx} className="text-xs text-gray-700 flex gap-1">
                        <span className="text-[#1F554A]">•</span>
                        <span className="line-clamp-1">{p}</span>
                      </li>
                    ))}
                    {lead.painPoints.length > 2 && (
                      <li className="text-xs text-gray-500 italic">+{lead.painPoints.length - 2} más</li>
                    )}
                  </ul>
                </td>
                <td className="py-4 px-3">
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {lead.activity[0]}
                  </p>
                  {lead.activity.length > 1 && (
                    <p className="text-xs text-gray-500 italic mt-1">+{lead.activity.length - 1} más</p>
                  )}
                </td>
                <td className="py-4 px-3">
                  <p className="text-xs text-gray-700 line-clamp-2">{lead.emailSubject}</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs h-7">
                    Ver completo
                  </Button>
                </td>
                <td className="py-4 px-3 text-center">
                  <span className="inline-flex items-center justify-center size-10 rounded-full bg-[#1F554A] text-white font-medium text-sm">
                    {lead.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}