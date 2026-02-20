import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface DashboardProps {
  onNewSession: () => void;
}

export function Dashboard({ onNewSession }: DashboardProps) {
  const activeSessions = [
    {
      id: 'session-001',
      name: 'Sesión Estratégica - Industrial',
      status: 'waiting_icp',
      phase: 'E3: Selección de ICP',
      progress: 20,
      createdAt: '2026-02-10',
      needsAction: true
    },
    {
      id: 'session-002',
      name: 'Sesión Estratégica - Oficinas Premium',
      status: 'processing',
      phase: 'E6-E8: Lead Discovery',
      progress: 60,
      createdAt: '2026-02-09',
      needsAction: false
    },
    {
      id: 'session-003',
      name: 'Sesión Estratégica - Retail',
      status: 'completed',
      phase: 'Completada',
      progress: 100,
      createdAt: '2026-02-08',
      needsAction: false
    }
  ];

  const stats = [
    { label: 'Sesiones Activas', value: '3' },
    { label: 'Segmentaciones Pendientes', value: '4' },
    { label: 'Leads Top 5', value: '5' },
    { label: 'Correos Listos', value: '5' }
  ];

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-medium mb-2">Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-600">Gestiona tus sesiones de prospección</p>
        </div>
        <Button onClick={onNewSession} className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 w-full sm:w-auto">
          Nueva Sesión
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl sm:text-3xl font-light mb-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div>
        <h3 className="text-xs sm:text-sm font-medium mb-4 text-gray-500 uppercase tracking-wide">Sesiones</h3>
        <div className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="border-b pb-4 last:border-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                <div className="flex-1">
                  <h4 className="font-medium mb-1 text-sm sm:text-base">{session.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{session.phase}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(session.createdAt).toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long'
                    })}
                  </p>
                </div>
                {session.needsAction && (
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">Acción requerida</Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Progress value={session.progress} className="flex-1 h-1" />
                <span className="text-xs text-gray-500 w-12 text-right">{session.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}