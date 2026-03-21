// React
import { useState } from 'react';

// External libraries
import { toast } from 'sonner';
import {
  Loader2,
  CheckCircle2,
  Building2,
  Briefcase,
  TrendingUp,
  MapPin,
  ChevronDown,
  ChevronUp,
  Globe,
  Users,
} from 'lucide-react';

// Internal — components
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';

// Internal — queries
import { useE6BusquedaOutputQuery } from '@/app/queries/e6BusquedaOutput';

// Internal — types
import type { E6BusquedaOutput } from '@/types/db/e6BusquedaOutput';

// Score dimensions definition
const SCORE_DIMENSIONS = [
  { key: 'score_industria', label: 'Industria', justKey: 'justificacion_industria' },
  { key: 'score_titulos', label: 'Títulos', justKey: 'justificacion_titulos' },
  { key: 'score_alineacion', label: 'Alineación ICP', justKey: 'justificacion_alineacion' },
  { key: 'score_empresas', label: 'Empresa', justKey: 'justificacion_empresas' },
  { key: 'score_seniority', label: 'Seniority', justKey: 'justificacion_seniority' },
  { key: 'score_dolores', label: 'Dolores', justKey: 'justificacion_dolores' },
  { key: 'score_ubicaciones', label: 'Ubicación', justKey: 'justificacion_ubicaciones' },
  { key: 'score_actividad_linkedin', label: 'Actividad LinkedIn', justKey: 'justificacion_actividad_linkedin' },
] as const;

interface StepRankingProps {
  ejecucionId: number | null;
  onComplete: (selectedLeads: string[]) => void;
}

// --- Helpers ---

/** Returns Tailwind color classes for a score badge based on 0–10 thresholds (green ≥7, amber ≥4, gray <4). */
function getScoreColor(score: number | null) {
  if (score === null) return 'text-gray-500 bg-gray-50 border-gray-200';
  if (score >= 7) return 'text-[#1F554A] bg-[#C4FF81]/20 border-[#1F554A]';
  if (score >= 4) return 'text-amber-700 bg-amber-50 border-amber-300';
  return 'text-gray-500 bg-gray-50 border-gray-200';
}

/** Formats a numeric score to one decimal place, or returns '—' if null. */
function formatScore(score: number | null): string {
  if (score === null) return '—';
  return score.toFixed(1);
}

/** Abbreviates large follower/connection counts (e.g. 1500 → '1.5k'). Returns '—' if null. */
function formatCount(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** Converts a string to Title Case, handling spaces, hyphens, and slashes as word separators. */
function toTitleCase(str: string | null): string | null {
  if (!str) return str;
  return str
    .toLowerCase()
    .replace(/(?:^|\s|-|\/)\S/g, (c) => c.toUpperCase());
}

/** Strips the word "employees" from LinkedIn's company size ranges (e.g. '51-200 employees' → '51-200'). */
function formatEmpRange(range: string | null): string | null {
  if (!range) return null;
  return range.replace(/\s*employees\s*/i, '').trim();
}

// --- Score Detail Panel ---

function ScoreDetailPanel({ lead }: { lead: E6BusquedaOutput }) {
  return (
    <div className="border-t-2 border-[#DCDEDC] bg-[#F9F9F7] p-4 sm:p-5 space-y-5">
      {/* Resumen consolidado */}
      {lead.resumen_consolidado && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1F554A] mb-1.5">
            Resumen
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{lead.resumen_consolidado}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Score breakdown */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1F554A] mb-3">
            Desglose de puntuación
          </p>
          <div className="space-y-3">
            {SCORE_DIMENSIONS.map(({ key, label, justKey }) => {
              const score = lead[key] as number | null;
              const just = lead[justKey] as string | null;
              const pct = score !== null ? Math.min((score / 10) * 100, 100) : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{label}</span>
                    <span className="text-xs font-semibold text-[#1F554A]">
                      {formatScore(score)}<span className="text-gray-400 font-normal">/10</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-[#1F554A] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {just && (
                    <p className="text-xs text-gray-500 leading-snug">{just}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead & company extra info */}
        <div className="space-y-4">
          {/* Lead bio */}
          {(lead.enr_resumen_bio || lead.enr_num_seguidores !== null || lead.enr_num_conexiones !== null) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1F554A] mb-2">
                Perfil
              </p>
              {lead.enr_resumen_bio && (
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{lead.enr_resumen_bio}</p>
              )}
              <div className="flex flex-wrap gap-3">
                {lead.enr_num_conexiones !== null && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Users className="size-3" />
                    {formatCount(lead.enr_num_conexiones)} conexiones
                  </span>
                )}
                {lead.enr_num_seguidores !== null && (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    {formatCount(lead.enr_num_seguidores)} seguidores
                  </span>
                )}
                {lead.sn_es_premium && (
                  <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-300 px-1.5 py-0.5 h-auto">
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Company info */}
          {(lead.sn_emp_nombre || lead.enr_emp_descripcion) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1F554A] mb-2">
                Empresa
              </p>
              {lead.enr_emp_descripcion && (
                <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-3">
                  {lead.enr_emp_descripcion}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                {lead.enr_emp_tipo_organizacion && (
                  <span className="text-xs text-gray-500">{lead.enr_emp_tipo_organizacion}</span>
                )}
                {lead.en_emp_sitio_web && (
                  <a
                    href={lead.en_emp_sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-[#1F554A] flex items-center gap-1 hover:underline"
                  >
                    <Globe className="size-3" />
                    Sitio web
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main component ---

export function StepRanking({ ejecucionId, onComplete }: StepRankingProps) {
  const { data: leads = [], isLoading } = useE6BusquedaOutputQuery(ejecucionId);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showProcessing, setShowProcessing] = useState(false);

  // --- Handlers ---

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads((prev) => {
      if (prev.includes(leadId)) return prev.filter((id) => id !== leadId);
      if (prev.length >= 5) {
        toast.warning('Máximo 5 leads permitidos');
        return prev;
      }
      return [...prev, leadId];
    });
  };

  const handleRowClick = (leadId: string) => {
    setExpandedLeadId((prev) => (prev === leadId ? null : leadId));
  };

  const handleSubmit = async () => {
    if (selectedLeads.length !== 5) {
      toast.error('Debes seleccionar exactamente 5 leads');
      return;
    }

    setIsSubmitting(true);
    setShowProcessing(true);

    const stages = [
      { progress: 20, status: 'Recopilando información de LinkedIn...' },
      { progress: 40, status: 'Analizando actividad reciente de cada lead...' },
      { progress: 60, status: 'Generando dossiers personalizados...' },
      { progress: 80, status: 'Creando research de empresas...' },
      { progress: 100, status: 'Completado' },
    ];

    for (const stage of stages) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProcessingProgress(stage.progress);
      setProcessingStatus(stage.status);
    }

    toast.success('Top 5 guardado. Dossiers generados correctamente.');
    setIsSubmitting(false);
    onComplete(selectedLeads);
  };

  // --- Loading ---

  if (showProcessing) {
    return (
      <div className="space-y-8 py-12">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <Loader2 className="size-12 animate-spin text-[#1F554A]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-medium mb-2">Generando dossiers e inteligencia</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Estamos preparando información detallada de tus 5 leads seleccionados
            </p>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1F554A] transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">{processingStatus}</p>
          </div>
          <div className="pt-4 text-xs text-gray-600 space-y-1">
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#1F554A]">•</span> Investigando actividad reciente en LinkedIn
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#1F554A]">•</span> Generando dossier personalizado por lead
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#1F554A]">•</span> Creando company research
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <Loader2 className="size-8 animate-spin text-[#1F554A] mx-auto" />
          <p className="text-sm text-gray-600">Cargando leads rankeados...</p>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-gray-600 font-medium">No hay leads disponibles para esta ejecución</p>
        <p className="text-sm text-gray-400">
          Asegúrate de que la búsqueda E6 haya completado correctamente.
        </p>
      </div>
    );
  }

  // --- Render ---

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline" className="text-xs">E6 Completado</Badge>
          <span className="text-xs text-gray-400">→</span>
          <Badge className="text-xs bg-[#1F554A] text-white">Selección Top 5</Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <h2 className="text-xl sm:text-2xl font-medium text-[#141414]">Ranking de Leads</h2>
          <Badge variant="outline" className="text-sm border-[#1F554A] text-[#1F554A] w-fit">
            {leads.length} leads encontrados
          </Badge>
        </div>
        <p className="text-sm sm:text-base text-gray-600">
          Selecciona exactamente 5 leads. Haz clic en una fila para ver el detalle de puntuación.
        </p>
      </div>

      {/* Selection counter + CTA */}
      <div className={`border-2 rounded-lg p-4 sm:p-5 transition-all ${
        selectedLeads.length === 5 ? 'border-[#1F554A] bg-[#C4FF81]/10' : 'border-[#DCDEDC] bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`size-10 sm:size-12 rounded-full flex items-center justify-center border-2 transition-all ${
              selectedLeads.length === 5
                ? 'border-[#1F554A] bg-[#1F554A] text-white'
                : 'border-[#1F554A] bg-white text-[#1F554A]'
            }`}>
              {selectedLeads.length === 5 ? (
                <CheckCircle2 className="size-5 sm:size-6" />
              ) : (
                <span className="font-medium text-lg">{selectedLeads.length}</span>
              )}
            </div>
            <div>
              <p className="font-medium text-base sm:text-lg text-[#141414]">
                {selectedLeads.length}/5 leads seleccionados
              </p>
              <p className="text-sm text-gray-600">
                {selectedLeads.length === 5
                  ? '¡Perfecto! Ya puedes continuar'
                  : `Selecciona ${5 - selectedLeads.length} más para continuar`}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={selectedLeads.length !== 5 || isSubmitting}
            className="bg-[#1F554A] text-white hover:bg-[#1F554A]/90 w-full sm:w-auto"
            size="lg"
          >
            Generar Top 5 Dossiers
          </Button>
        </div>
      </div>

      {/* Leads table */}
      <div className="border-2 border-[#DCDEDC] rounded-lg overflow-hidden">
        {/* Table header — desktop only */}
        <div className="hidden lg:grid bg-[#1F554A] text-white px-4 py-3 text-xs font-medium uppercase tracking-wide"
          style={{ gridTemplateColumns: '2.5rem minmax(0,1.1fr) minmax(0,1.2fr) minmax(0,0.7fr) 5.5rem 1.5rem' }}>
          <div></div>
          <div>Lead</div>
          <div>Empresa</div>
          <div>Ubicación</div>
          <div className="text-center">Score</div>
          <div></div>
        </div>

        {/* Table body */}
        <div className="divide-y-2 divide-[#DCDEDC]">
          {leads.map((lead, index) => {
            const isSelected = selectedLeads.includes(lead.lead_id);
            const isExpanded = expandedLeadId === lead.lead_id;
            const isDisabled = !isSelected && selectedLeads.length >= 5;

            return (
              <div key={lead.lead_id}>
                {/* Desktop row */}
                <div
                  className={`hidden lg:grid px-4 py-3.5 items-center cursor-pointer transition-colors gap-4
                    ${isSelected ? 'bg-[#C4FF81]/10' : 'hover:bg-[#C4FF81]/5'}`}
                  style={{ gridTemplateColumns: '2.5rem minmax(0,1.1fr) minmax(0,1.2fr) minmax(0,0.7fr) 5.5rem 1.5rem' }}
                  onClick={() => handleRowClick(lead.lead_id)}
                >
                  {/* Checkbox */}
                  <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleLeadToggle(lead.lead_id)}
                      disabled={isDisabled}
                    />
                  </div>

                  {/* Lead info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 min-w-0">
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">#{index + 1}</span>
                      {lead.sn_url_linkedin_perfil_publico ? (
                        <a
                          href={lead.sn_url_linkedin_perfil_publico}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-sm text-[#141414] hover:text-[#1F554A] transition-colors flex items-center gap-1 min-w-0"
                        >
                          <span className="truncate">{lead.sn_nombre_completo ?? '—'}</span>
                          <svg className="size-3 text-[#0077B5] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="font-medium text-sm text-[#141414] truncate">
                          {lead.sn_nombre_completo ?? '—'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                      <Briefcase className="size-3 shrink-0 text-gray-400" />
                      <span className="truncate">{lead.sn_cargo_actual ?? '—'}</span>
                    </p>
                  </div>

                  {/* Company info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 min-w-0">
                      <Building2 className="size-3 text-[#1F554A] shrink-0" />
                      <span className="font-medium text-sm text-[#141414] truncate">{toTitleCase(lead.sn_emp_nombre) ?? '—'}</span>
                      {lead.sn_emp_url_linkedin && (
                        <a
                          href={lead.sn_emp_url_linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 text-[#0077B5] hover:text-[#0077B5]/80 transition-colors"
                          title="Ver empresa en LinkedIn"
                        >
                          <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                    </div>
                    {lead.enr_emp_industria && (
                      <p className="text-xs text-gray-500 truncate">{lead.enr_emp_industria}</p>
                    )}
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {lead.enr_emp_tamano_rango && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                          <Users className="size-3 shrink-0" />
                          {formatEmpRange(lead.enr_emp_tamano_rango)}
                        </span>
                      )}
                      {lead.enr_emp_sede_principal && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                          <MapPin className="size-3 shrink-0" />
                          <span className="truncate">{lead.enr_emp_sede_principal}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Lead location */}
                  <div className="min-w-0">
                    {lead.sn_ubicacion ? (
                      <p className="text-xs text-gray-600 flex items-start gap-1">
                        <MapPin className="size-3 text-[#1F554A] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{lead.sn_ubicacion}</span>
                      </p>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="flex justify-center">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border ${getScoreColor(lead.score_total)}`}>
                      <TrendingUp className="size-3" />
                      {formatScore(lead.score_total)}
                    </div>
                  </div>

                  {/* Expand toggle */}
                  <div className="flex justify-center text-gray-400">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </div>
                </div>

                {/* Mobile row */}
                <div
                  className={`lg:hidden p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#C4FF81]/10' : 'hover:bg-[#C4FF81]/5'
                  }`}
                  onClick={() => handleRowClick(lead.lead_id)}
                >
                  <div className="flex items-start gap-3">
                    <div onClick={(e) => e.stopPropagation()} className="mt-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleLeadToggle(lead.lead_id)}
                        disabled={isDisabled}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-gray-400 font-medium shrink-0">#{index + 1}</span>
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border shrink-0 ${getScoreColor(lead.score_total)}`}>
                            <TrendingUp className="size-3" />
                            {formatScore(lead.score_total)}
                          </div>
                        </div>
                        <div className="text-gray-400 shrink-0">
                          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </div>
                      </div>
                      <p className="font-medium text-sm text-[#141414] mb-0.5">
                        {lead.sn_nombre_completo ?? '—'}
                      </p>
                      <p className="text-xs text-gray-600 mb-1">{lead.sn_cargo_actual ?? '—'}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-700 font-medium">{toTitleCase(lead.sn_emp_nombre) ?? '—'}</span>
                        {lead.sn_emp_url_linkedin && (
                          <a
                            href={lead.sn_emp_url_linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="shrink-0 text-[#0077B5]"
                            title="Ver empresa en LinkedIn"
                          >
                            <svg className="size-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                      </div>
                      {lead.enr_emp_industria && (
                        <p className="text-xs text-gray-500">{lead.enr_emp_industria}</p>
                      )}
                      {lead.enr_emp_sede_principal && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 shrink-0" />
                          {lead.enr_emp_sede_principal}
                        </p>
                      )}
                      {lead.sn_ubicacion && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="size-3" />
                          {lead.sn_ubicacion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && <ScoreDetailPanel lead={lead} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#DCDEDC]/30 border-2 border-[#DCDEDC] rounded-lg p-4 text-center">
        <p className="text-sm text-gray-700">
          Score total en escala <span className="font-medium text-[#1F554A]">0–10</span> basado en 8 dimensiones de alineación con el ICP
        </p>
      </div>
    </div>
  );
}
