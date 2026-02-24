// React
import { useState, useEffect } from 'react';

// External libraries
import { toast } from 'sonner';
import { RefreshCw, Loader2, ChevronLeft, ChevronRight, Calendar, Building2, TrendingUp } from 'lucide-react';

// Internal — services
import { fetchSemanas, fetchSenalesMercado } from '../../services/supabaseService';

// Internal — types
import type { Semana } from '../../types/semana';
import type { SenalMercado } from '../../types/senalMercado';
import type { CategoryTab } from './MasterReport/types';

// Internal — components & data
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SenalesMercado } from './MasterReport/SenalesMercado';
import { GanchosMercado } from './MasterReport/GanchosMercado';
import { weeklyReports } from './MasterReport/data'; // TEMPORARY: remove when GanchosMercado connects to Supabase

export function MasterIntelligenceReport() {
  // --- State ---
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingSemanas, setIsLoadingSemanas] = useState(true);
  const [isLoadingSignals, setIsLoadingSignals] = useState(false);
  const [expandedSignals, setExpandedSignals] = useState<number[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<CategoryTab>('senales');
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [senalesMercado, setSenalesMercado] = useState<SenalMercado[]>([]);

  // Derived from state
  const currentSemana = semanas[currentWeekIndex]; // drives fetchSenalesMercado + fetchGanchosMercado
  const currentReport = weeklyReports[currentWeekIndex]; // TEMPORARY: remove when GanchosMercado connects to Supabase

  // --- Effects ---
  useEffect(() => {
    fetchSemanas()
      .then(data => {
        setSemanas(data);
        setIsLoadingSemanas(false);
      })
      .catch(() => setIsLoadingSemanas(false));
  }, []);

  // Re-fetch signals whenever the active week changes.
  // Watching currentSemana?.id (not the object) avoids re-runs on unrelated reference updates.
  useEffect(() => {
    if (!currentSemana?.id) return;
    setIsLoadingSignals(true);
    fetchSenalesMercado({ semanaId: currentSemana.id })
      .then(data => {
        setSenalesMercado(data);
        setIsLoadingSignals(false);
      })
      .catch(() => setIsLoadingSignals(false));
  }, [currentSemana?.id]);

  // --- Helpers ---
  const formatSemanaLabel = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  // --- Handlers ---
  const toggleSignal = (id: number) => {
    setExpandedSignals(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Reporte actualizado con datos recientes');
    setIsRefreshing(false);
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex < semanas.length - 1) {
      setCurrentWeekIndex(prev => prev + 1);
      setExpandedSignals([]);
      toast.info(`Semana del ${formatSemanaLabel(semanas[currentWeekIndex + 1]?.fecha_inicio_semana)}`);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(prev => prev - 1);
      setExpandedSignals([]);
      toast.info(`Semana del ${formatSemanaLabel(semanas[currentWeekIndex - 1]?.fecha_inicio_semana)}`);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium mb-2">Master Intelligence Report</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Actualizado: {new Date(currentSemana?.fecha_creacion ?? currentReport.lastUpdated).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto border-[#1F554A] text-[#1F554A] hover:bg-[#1F554A] hover:text-white"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <RefreshCw className="size-4 mr-2" />
                Actualizar
              </>
            )}
          </Button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-4 py-3 sm:py-4 bg-[#C4FF81]/10 rounded-lg border-2 border-[#DCDEDC]">
          <Button
            onClick={goToPreviousWeek}
            disabled={isLoadingSemanas || currentWeekIndex >= semanas.length - 1}
            variant="ghost"
            size="sm"
            className="disabled:opacity-30 px-2 sm:px-3 hover:bg-[#1F554A]/10"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial sm:min-w-[300px] justify-center">
            <Calendar className="size-3 sm:size-4 text-[#1F554A] hidden sm:block" />
            {isLoadingSemanas ? (
              <Loader2 className="size-5 animate-spin text-[#1F554A]" />
            ) : (
              <>
                <div className="text-center">
                  <p className="font-medium text-[#141414] text-sm sm:text-base">
                    Semana del {currentSemana?.fecha_inicio_semana && formatSemanaLabel(currentSemana.fecha_inicio_semana)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    {currentSemana && (
                      <>
                        {new Date(currentSemana.fecha_inicio_semana).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {new Date(currentSemana.fecha_fin_semana).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </>
                    )}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] sm:text-xs border-[#1F554A] text-[#1F554A]">
                  {currentWeekIndex + 1}/{semanas.length}
                </Badge>
              </>
            )}
          </div>

          <Button
            onClick={goToNextWeek}
            disabled={isLoadingSemanas || currentWeekIndex <= 0}
            variant="ghost"
            size="sm"
            className="disabled:opacity-30 px-2 sm:px-3 hover:bg-[#1F554A]/10"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b-2 border-[#DCDEDC]">
        <div className="flex gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('senales')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all border-b-2 ${
              activeTab === 'senales'
                ? 'border-[#1F554A] text-[#1F554A] bg-[#C4FF81]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="size-4" />
            <span className="hidden sm:inline">Señales de Compañías</span>
            <span className="sm:hidden">Compañías</span>
            <Badge className={`text-xs ${activeTab === 'senales' ? 'bg-[#1F554A] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {senalesMercado.length}
            </Badge>
          </button>

          <button
            onClick={() => setActiveTab('ganchos')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all border-b-2 ${
              activeTab === 'ganchos'
                ? 'border-[#1F554A] text-[#1F554A] bg-[#C4FF81]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="size-4" />
            <span className="hidden sm:inline">Ganchos de Mercado</span>
            <span className="sm:hidden">Mercado</span>
            <Badge className={`text-xs ${activeTab === 'ganchos' ? 'bg-[#1F554A] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {currentReport.marketHooks.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'senales' && (
        isLoadingSignals ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-[#1F554A]" />
          </div>
        ) : (
          <SenalesMercado
            signals={senalesMercado}
            expandedSignals={expandedSignals}
            onToggle={toggleSignal}
          />
        )
      )}

      {activeTab === 'ganchos' && (
        <GanchosMercado hooks={currentReport.marketHooks} />
      )}

      {/* Usage Guide */}
      <div className="border-t-2 border-[#DCDEDC] pt-6 sm:pt-8">
        <h3 className="text-sm font-medium mb-3 text-[#141414] uppercase tracking-wide">Cómo usar este reporte</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">1.</span>
            <span>Usa el contexto al completar "Nueva Sesión" de prospección</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">2.</span>
            <span>Incorpora ganchos de mercado en tus correos para demostrar expertise</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">3.</span>
            <span>Identifica empresas con señales activas para prospección directa</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1F554A] font-bold mt-0.5">4.</span>
            <span>Usa datos específicos como talking points en llamadas y reuniones</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
