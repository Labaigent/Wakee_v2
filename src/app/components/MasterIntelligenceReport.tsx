// Report
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { RefreshCw, Loader2, ChevronLeft, ChevronRight, Calendar, Building2, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { CategoryTab } from './MasterReport/types';
import { weeklyReports } from './MasterReport/data';
import { SenalesMercado } from './MasterReport/SenalesMercado';
import { GanchosMercado } from './MasterReport/GanchosMercado';

export function MasterIntelligenceReport() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSignals, setExpandedSignals] = useState<number[]>([]);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<CategoryTab>('companies');

  const currentReport = weeklyReports[currentWeekIndex];

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
    if (currentWeekIndex < weeklyReports.length - 1) {
      setCurrentWeekIndex(prev => prev + 1);
      setExpandedSignals([]);
      toast.info(`Semana del ${weeklyReports[currentWeekIndex + 1].weekOf}`);
    }
  };

  const goToNextWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(prev => prev - 1);
      setExpandedSignals([]);
      toast.info(`Semana del ${weeklyReports[currentWeekIndex - 1].weekOf}`);
    }
  };

  const formatSignalDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8">
      {/* Header with Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-medium mb-2">Master Intelligence Report</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Actualizado: {new Date(currentReport.lastUpdated).toLocaleDateString('es-ES', {
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
            disabled={currentWeekIndex >= weeklyReports.length - 1}
            variant="ghost"
            size="sm"
            className="disabled:opacity-30 px-2 sm:px-3 hover:bg-[#1F554A]/10"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Button>

          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial sm:min-w-[300px] justify-center">
            <Calendar className="size-3 sm:size-4 text-[#1F554A] hidden sm:block" />
            <div className="text-center">
              <p className="font-medium text-[#141414] text-sm sm:text-base">Semana del {currentReport.weekOf}</p>
              <p className="text-[10px] sm:text-xs text-gray-600">
                {new Date(currentReport.weekStart).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {new Date(currentReport.weekEnd).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] sm:text-xs border-[#1F554A] text-[#1F554A]">
              {currentWeekIndex + 1}/{weeklyReports.length}
            </Badge>
          </div>

          <Button
            onClick={goToNextWeek}
            disabled={currentWeekIndex <= 0}
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
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all border-b-2 ${
              activeTab === 'companies'
                ? 'border-[#1F554A] text-[#1F554A] bg-[#C4FF81]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="size-4" />
            <span className="hidden sm:inline">Señales de Compañías</span>
            <span className="sm:hidden">Compañías</span>
            <Badge className={`text-xs ${activeTab === 'companies' ? 'bg-[#1F554A] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {currentReport.companySignals.length}
            </Badge>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-all border-b-2 ${
              activeTab === 'market'
                ? 'border-[#1F554A] text-[#1F554A] bg-[#C4FF81]/5'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="size-4" />
            <span className="hidden sm:inline">Ganchos de Mercado</span>
            <span className="sm:hidden">Mercado</span>
            <Badge className={`text-xs ${activeTab === 'market' ? 'bg-[#1F554A] text-white' : 'bg-gray-200 text-gray-600'}`}>
              {currentReport.marketHooks.length}
            </Badge>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'companies' && (
        <SenalesMercado
          signals={currentReport.companySignals}
          expandedSignals={expandedSignals}
          onToggle={toggleSignal}
          formatDate={formatSignalDate}
        />
      )}

      {activeTab === 'market' && (
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
