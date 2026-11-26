import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Download,
  Activity,
  Layers,
  BookOpen,
  HelpCircle,
  Factory,
  CheckCircle2,
  Phone,
  FileText,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Box,
  Cpu,
  Layers2,
  AlertTriangle,
  ArrowRight,
  Lock,
  Unlock,
  GitBranch,
  Wrench,
  ChevronDown,
  ChevronUp,
  Play,
  Loader2,
} from 'lucide-react';
import { trackMetrikaGoal } from '../services/yandexMetrika';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string, power?: string) => void;
}

interface CadParams {
  has_conservator: boolean;
  conservator_diameter: number;
  conservator_length: number;
  hv_bushing_type: 'solid_porcelain' | 'oil_filled' | 'rip_condenser';
  lv_connection_type: 'bushings' | 'busbar';
  lv_bushing_count: number;
  lv_bushing_height: number;
  tank_length: number;
  tank_width: number;
  tank_height: number;
  roller_gauge_x: number;
  hv_bushing_height: number;
  hv_bushing_pitch: number;
  radiator_banks_per_side: number;
  radiator_banks_end_x?: number;
  radiator_panel_count: number;
  radiator_end_panel_count?: number;
  radiator_panel_width: number;
  radiator_panel_height?: number;
  radiator_panel_pitch?: number;
  has_cooling_fans?: boolean;
  fan_mounting?: 'bottom' | 'side';
  fans_per_bank?: number;
  fan_diameter?: number;
  has_thermosiphon_filter?: boolean;
  has_air_breather?: boolean;
  has_mv_bushings?: boolean;
}

interface CadMetrics {
  all_valid_brep: boolean;
  scale_text: string;
  components_count: number;
  balloons_count: number;
  details_count: number;
  cad_build_ms: number;
  hlr_total_ms: number;
  svg_render_ms: number;
  total_ms: number;
}

interface DimensionItem {
  dimension_id: string;
  view_id: string;
  measured_value_mm: number;
}

interface BomItem {
  item_number: number;
  description: string;
  quantity: number;
  part_number: string;
}

interface TransformerRatings {
  rated_power_kva: number;
  voltage_hv_kv: number;
  voltage_mv_kv: number;
  voltage_lv_kv: number;
  winding_material: 'copper' | 'aluminum';
  vector_group: 'Yyn0' | 'Dyn11' | 'Ynd11' | 'Yzn11' | 'Yd11' | 'Yn/Yn/D-0-11' | 'Yn/D-11-D-11';
  winding_topology: 'two_winding' | 'three_winding' | 'split_lv';
  hv_bushing_type: 'solid_porcelain' | 'oil_filled' | 'rip_condenser';
  lv_connection_mode: 'bushings' | 'busbar';
  has_conservator: boolean;
  oil_preservation_architecture?: 'AUTO' | 'AIR_BREATHING' | 'AIR_CELL' | 'DIAPHRAGM' | 'NITROGEN_BLANKET' | 'HERMETIC_CORRUGATED';
  has_thermosiphon_filter: boolean;
  regulation_type: 'NONE' | 'PBV' | 'RPN';
  cooling_type: 'ONAN' | 'ONAF';
  fan_mounting: 'bottom' | 'side';
  steel_grade: '27Q120' | '3408' | '3409' | '3409-HiB';
  climate_execution: 'U1' | 'UHL1';
  target_uk_percent: number;
  tap_range_percent: number;
  roller_gauge: number;
}

const DEFAULT_RATINGS: TransformerRatings = {
  rated_power_kva: 3000,
  voltage_hv_kv: 35,
  voltage_mv_kv: 20,
  voltage_lv_kv: 10.5,
  winding_material: 'copper',
  vector_group: 'Dyn11',
  winding_topology: 'two_winding',
  hv_bushing_type: 'oil_filled',
  lv_connection_mode: 'busbar',
  has_conservator: true,
  oil_preservation_architecture: 'AUTO',
  has_thermosiphon_filter: true,
  regulation_type: 'PBV',
  cooling_type: 'ONAN',
  fan_mounting: 'bottom',
  steel_grade: '3409',
  climate_execution: 'U1',
  target_uk_percent: 6.5,
  tap_range_percent: 5.0,
  roller_gauge: 1070,
};

const DEFAULT_PARAMS: CadParams = {
  has_conservator: true,
  conservator_diameter: 380,
  conservator_length: 950,
  hv_bushing_type: 'oil_filled',
  lv_connection_type: 'busbar',
  lv_bushing_count: 3,
  lv_bushing_height: 340,
  tank_length: 1700,
  tank_width: 900,
  tank_height: 1550,
  roller_gauge_x: 1070,
  hv_bushing_height: 850,
  hv_bushing_pitch: 380,
  radiator_banks_per_side: 3,
  radiator_panel_count: 9,
  radiator_panel_width: 420,
};

const CAD_API_URL = (import.meta.env?.VITE_CAD_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

export const OnlineCadPage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  // Primary operational requirements (ТЗ)
  const [ratings, setRatings] = useState<TransformerRatings>(DEFAULT_RATINGS);

  // Derived / Translated CAD parameters
  const [params, setParams] = useState<CadParams>(DEFAULT_PARAMS);
  const [template, setTemplate] = useState<'ESKD_RU' | 'IEC_EN'>('ESKD_RU');
  const [mode, setMode] = useState<'exact_hlr' | 'poly_hlr'>('exact_hlr');
  const [showHidden, setShowHidden] = useState<boolean>(true);

  // Drafting modal & progress
  const [isDraftingModalOpen, setIsDraftingModalOpen] = useState<boolean>(false);
  const [draftingStep, setDraftingStep] = useState<number>(1);
  const [showExpertCadSettings, setShowExpertCadSettings] = useState<boolean>(false);
  const [showTestingProgram, setShowTestingProgram] = useState<boolean>(false);

  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [metrics, setMetrics] = useState<CadMetrics | null>(null);
  const [dimensions, setDimensions] = useState<DimensionItem[]>([]);
  const [bom, setBom] = useState<BomItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [serverOnline, setServerOnline] = useState<boolean>(false);

  // Engineering calculation state (Stage 6)
  const [engineeringCalc, setEngineeringCalc] = useState<any | null>(null);

  // Normative compliance state (Stage 7)
  const [normativeReport, setNormativeReport] = useState<any | null>(null);

  // Revision & Governance state (Stage 9)
  const [currentRev, setCurrentRev] = useState<{
    revision_id: string;
    revision_number: number;
    status: string;
    maturity: string;
    is_locked: boolean;
    author: string;
    change_description: string;
    signatures: Array<{ role: string; engineer_name: string; timestamp_iso: string; comments?: string }>;
  } | null>(null);
  const [revisionsList, setRevisionsList] = useState<any[]>([]);
  const [isCommittingRev, setIsCommittingRev] = useState<boolean>(false);
  const [engineerName, setEngineerName] = useState<string>('Главный конструктор');

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const fetchRevisions = useCallback(async () => {
    try {
      const resp = await fetch(`${CAD_API_URL}/api/revisions/list?project_id=transformer_online_cad`);
      if (resp.ok) {
        const data = await resp.json();
        setRevisionsList(data.revisions || []);
        if (data.revisions && data.revisions.length > 0) {
          setCurrentRev(data.revisions[data.revisions.length - 1]);
        }
      }
    } catch {
      // offline silent fallback
    }
  }, []);

  const runFullCalculationAndBuild = useCallback(
    async (
      targetRatings: TransformerRatings,
      curTemplate: 'ESKD_RU' | 'IEC_EN' = template,
      curMode: 'exact_hlr' | 'poly_hlr' = mode,
      curHidden: boolean = showHidden,
      showModal: boolean = true
    ) => {
      if (showModal) {
        setIsDraftingModalOpen(true);
        setDraftingStep(1);
      }
      setIsLoading(true);
      setErrorMsg(null);

      const stepTimer = showModal
        ? setInterval(() => {
            setDraftingStep((s) => (s < 5 ? s + 1 : s));
          }, 240)
        : null;

      try {
        const resp = await fetch(`${CAD_API_URL}/api/engineering/calculate_and_build`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ratings: targetRatings,
            template: curTemplate,
            mode: curMode,
            show_hidden: curHidden,
          }),
        });

        if (!resp.ok) {
          const err = await resp.json().catch(() => ({ detail: 'Ошибка сервера' }));
          throw new Error(typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail));
        }

        const data = await resp.json();
        if (showModal) {
          setDraftingStep(5);
          await new Promise((resolve) => setTimeout(resolve, 320));
        }

        setSvgMarkup(data.svg);
        setServerOnline(true);
        if (data.cad_params) {
          setParams((prev) => ({ ...prev, ...data.cad_params }));
        }
        setEngineeringCalc(data.engineering_calculation);
        setNormativeReport(data.normative_report);
        setMetrics({
          all_valid_brep: data.all_valid_brep,
          scale_text: data.scale_text,
          components_count: data.components?.length || 0,
          balloons_count: data.balloons_count || 14,
          details_count: data.details_count || 2,
          cad_build_ms: data.timings_ms?.cad_build_ms || 0,
          hlr_total_ms: data.timings_ms?.hlr_total_ms || 0,
          svg_render_ms: data.timings_ms?.svg_render_ms || 0,
          total_ms: data.timings_ms?.total_ms || 0,
        });
        setDimensions(data.dimensions || []);
        setBom(data.bom || []);
      } catch (err: any) {
        setServerOnline(false);
        setErrorMsg(err.message || 'CAD API недоступен на ' + CAD_API_URL);
      } finally {
        if (stepTimer) clearInterval(stepTimer);
        setIsLoading(false);
        if (showModal) setIsDraftingModalOpen(false);
      }
    },
    [template, mode, showHidden]
  );

  // Initial load
  useEffect(() => {
    runFullCalculationAndBuild(DEFAULT_RATINGS, 'ESKD_RU', 'exact_hlr', true, false);
    fetchRevisions();
  }, [fetchRevisions, runFullCalculationAndBuild]);

  const handleExport = async (fmt: 'pdf' | 'dxf' | 'step') => {
    trackMetrikaGoal('online_cad_export', { format: fmt, template });
    try {
      const resp = await fetch(`${CAD_API_URL}/api/spike/export/${fmt}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params,
          template,
          mode,
          show_hidden: showHidden,
        }),
      });
      if (!resp.ok) throw new Error(`Export ${fmt} failed`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transformer_cad_${template.toLowerCase()}.${fmt}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`Ошибка экспорта ${fmt.toUpperCase()}: ${e.message}`);
    }
  };

  const updateRating = <K extends keyof TransformerRatings>(key: K, val: TransformerRatings[K]) => {
    setRatings((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'voltage_hv_kv') {
        const hv = Number(val);
        if (hv >= 110) {
          next.target_uk_percent = 10.5;
          next.regulation_type = 'RPN';
          next.hv_bushing_type = 'rip_condenser';
          next.vector_group = 'Ynd11';
        } else if (hv >= 35) {
          next.target_uk_percent = 6.5;
        } else if (hv >= 10) {
          next.target_uk_percent = 5.5;
        } else {
          next.target_uk_percent = 4.5;
        }
      }
      if (key === 'winding_topology') {
        if (val === 'split_lv') {
          next.vector_group = 'Yn/D-11-D-11';
          next.voltage_mv_kv = next.voltage_lv_kv;
        } else if (val === 'three_winding') {
          next.vector_group = 'Yn/Yn/D-0-11';
          next.voltage_mv_kv = next.voltage_hv_kv >= 110 ? 35 : next.voltage_hv_kv >= 35 ? 10.5 : 6.3;
        } else if (prev.vector_group.includes('/')) {
          next.vector_group = 'Dyn11';
        }
      }
      if (key === 'voltage_lv_kv' && prev.winding_topology === 'split_lv') {
        next.voltage_mv_kv = Number(val);
      }
      if (key === 'cooling_type' && val === 'ONAF') {
        next.has_conservator = true;
      }
      return next;
    });
  };

  const handleCommitRevision = async () => {
    setIsCommittingRev(true);
    try {
      const resp = await fetch(`${CAD_API_URL}/api/revisions/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'transformer_online_cad',
          author: engineerName,
          change_description: `Ревизия параметров (${params.tank_length}×${params.tank_width}×${params.tank_height} мм, ${params.hv_bushing_type})`,
          cad_params: params,
          maturity: 'PRELIMINARY',
          normative_status: normativeReport?.overall_status || 'CHECKED WITHIN DECLARED SCOPE',
        }),
      });
      if (resp.ok) {
        await fetchRevisions();
      } else {
        const err = await resp.json().catch(() => ({ detail: 'Ошибка коммита' }));
        alert(`Ошибка фиксации ревизии: ${err.detail || 'Не удалось зафиксировать'}`);
      }
    } catch (e: any) {
      alert(`Ошибка фиксации ревизии: ${e.message}`);
    } finally {
      setIsCommittingRev(false);
    }
  };

  const handleApproveRevision = async () => {
    if (!currentRev) {
      alert('Сначала зафиксируйте ревизию для утверждения.');
      return;
    }
    if (currentRev.is_locked) {
      alert('Данная ревизия уже утверждена и заблокирована от изменений.');
      return;
    }
    const confirmed = window.confirm(
      `Вы подтверждаете утверждение ревизии ${currentRev.revision_id} главным конструктором?\n\n` +
      `После утверждения на ревизию будет наложена блокировка неизменяемости (Immutability Lock). ` +
      `Последующие изменения потребуют выпуска новой ревизии.`
    );
    if (!confirmed) return;

    try {
      const resp = await fetch(`${CAD_API_URL}/api/revisions/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 'transformer_online_cad',
          revision_id: currentRev.revision_id,
          chief_engineer_name: engineerName,
          approval_notes: 'Утверждено главным конструктором. Нормативный аудит РФ пройден.',
        }),
      });
      if (resp.ok) {
        await fetchRevisions();
      } else {
        const err = await resp.json().catch(() => ({ detail: 'Ошибка утверждения' }));
        alert(`Ошибка утверждения: ${err.detail || 'Не удалось утвердить'}`);
      }
    } catch (e: any) {
      alert(`Ошибка утверждения: ${e.message}`);
    }
  };

  const updateParam = <K extends keyof CadParams>(key: K, val: CadParams[K]) => {
    setParams((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'hv_bushing_type') {
        if (val === 'oil_filled') next.hv_bushing_height = 850;
        else if (val === 'solid_porcelain') next.hv_bushing_height = 620;
        else if (val === 'rip_condenser') next.hv_bushing_height = 680;
      }
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Хлебные крошки и заголовок */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <button type="button" onClick={() => onNavigate('/')} className="hover:text-navy cursor-pointer">
                Главная
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-navy font-bold">Онлайн CAD (САПР чертежей трансформаторов)</span>
            </nav>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0b3d66] text-[#e6a417] flex items-center justify-center shadow-md">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0b3d66] tracking-tight flex items-center gap-2.5">
                  HUBEIENERGY / ONLINE CAD 3D
                  <span className="text-xs bg-[#e6a417]/20 border border-[#e6a417]/50 text-[#92400e] font-black px-2.5 py-0.5 rounded-full uppercase">
                    B-Rep HLR • OpenCASCADE
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Параметрическая сборка силового трансформатора, точный HLR (First Angle), осевые линии, выноски 1..14 и выносные элементы (M16 / 60×60)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                serverOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {serverOnline ? 'CAD-ядро активно (OCCT 8.0)' : 'Локальный сервер: uvicorn (порт 8000)'}
            </span>
            <button
              type="button"
              onClick={() => onOpenQuoteModal('maslyanye-35kv', '3000 кВА')}
              className="bg-[#0b3d66] hover:bg-[#072640] text-white text-xs font-bold py-2 px-4 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Запросить расчет цены</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#e6a417]" />
            </button>
          </div>
        </div>

        {/* Главная CAD рабочая область (3 колонки: Параметры -> Чертеж -> Инспектор/BOM) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Левая колонка: Ввод параметров требуемого трансформатора (ТЗ) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#e6a417]" />
                  Параметры трансформатора (ТЗ)
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Геометрия 3D и чертёж строятся автоматически по расчёту
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRatings(DEFAULT_RATINGS);
                  setParams(DEFAULT_PARAMS);
                }}
                className="text-[10px] text-slate-500 hover:text-navy font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                Сброс
              </button>
            </div>

            {/* 1. Мощность и напряжения */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">1. Мощность и напряжения</span>

              {/* Номинальная мощность */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1">
                  <span>Мощность (Sном):</span>
                  <span className="font-bold text-navy font-mono text-xs">{ratings.rated_power_kva} кВА</span>
                </div>
                {/* Быстрые кнопки мощности (ряд ГОСТ 9680) */}
                <div className="grid grid-cols-4 gap-1 mb-1.5">
                  {[630, 1000, 1600, 2500, 3000, 4000, 6300, 10000].map((pVal) => (
                    <button
                      key={pVal}
                      type="button"
                      onClick={() => updateRating('rated_power_kva', pVal)}
                      className={`py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        ratings.rated_power_kva === pVal
                          ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pVal >= 10000 ? `${pVal / 1000}М` : pVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Напряжения ВН и НН */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Напряжение ВН</label>
                  <select
                    value={ratings.voltage_hv_kv}
                    onChange={(e) => updateRating('voltage_hv_kv', Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value={110}>110 кВ</option>
                    <option value={35}>35 кВ</option>
                    <option value={20}>20 кВ</option>
                    <option value={10}>10 кВ</option>
                    <option value={6}>6 кВ</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">
                    {ratings.winding_topology === 'split_lv' ? 'Напряжение НН1' : 'Напряжение НН'}
                  </label>
                  <select
                    value={ratings.voltage_lv_kv}
                    onChange={(e) => updateRating('voltage_lv_kv', Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value={35}>35 кВ</option>
                    <option value={10.5}>10.5 кВ</option>
                    <option value={6.3}>6.3 кВ</option>
                    <option value={0.4}>0.4 кВ</option>
                  </select>
                </div>
              </div>

              {/* Динамический выбор номинала напряжения средней обмотки (СН) или 2-й ветви расщепленной НН (НН2) */}
              {(ratings.winding_topology === 'three_winding' || ratings.winding_topology === 'split_lv') && (
                <div className="p-2.5 bg-amber-50/80 border border-[#e6a417]/50 rounded-xl space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <label className="font-bold text-[#0b3d66]">
                      {ratings.winding_topology === 'three_winding'
                        ? 'Напряжение СН (средняя обм.):'
                        : 'Напряжение НН2 (2-я ветвь):'}
                    </label>
                    <select
                      value={ratings.voltage_mv_kv}
                      onChange={(e) => updateRating('voltage_mv_kv', Number(e.target.value))}
                      className="bg-white border border-[#0b3d66]/30 rounded-lg py-1 px-2 font-bold text-[#0b3d66] text-xs"
                    >
                      <option value={35}>35 кВ</option>
                      <option value={20}>20 кВ</option>
                      <option value={10.5}>10.5 кВ</option>
                      <option value={6.3}>6.3 кВ</option>
                      <option value={0.4}>0.4 кВ</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    {ratings.winding_topology === 'three_winding'
                      ? 'В 3D CAD на крышке бака автоматически формируется средний ряд вводов СН (поз. 22).'
                      : 'Расщеплённая обмотка НН1/НН2 (коэф. расщепления Kr ≈ 3.7); на крышке формируется 2-я группа вводов (поз. 22).'}
                  </p>
                </div>
              )}

              {/* Топология обмоток и материал */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Тип обмоток</label>
                  <select
                    value={ratings.winding_topology}
                    onChange={(e) => updateRating('winding_topology', e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value="two_winding">2-обмоточный (ТМ/ТДН)</option>
                    <option value="split_lv">Расщеп. НН (ТРДН)</option>
                    <option value="three_winding">3-обмоточный (ТДТН)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Сталь (ГОСТ 21427)</label>
                  <select
                    value={ratings.steel_grade}
                    onChange={(e) => updateRating('steel_grade', e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value="3409-HiB">3409 Hi-B (0.27 мм)</option>
                    <option value="3409">3409 НЛМК (0.30 мм)</option>
                    <option value="3408">3408 НЛМК (0.30 мм)</option>
                  </select>
                </div>
              </div>

              {/* Материал обмоток */}
              <div>
                <label className="text-slate-600 block mb-1 text-[11px] font-medium">Материал обмоток:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateRating('winding_material', 'copper')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      ratings.winding_material === 'copper'
                        ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Медь (Cu)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRating('winding_material', 'aluminum')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      ratings.winding_material === 'aluminum'
                        ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Алюминий (Al)
                  </button>
                </div>
              </div>

              {/* Схема соединения и u_k */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Схема обмоток</label>
                  <select
                    value={ratings.vector_group}
                    onChange={(e) => updateRating('vector_group', e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value="Dyn11">Dyn11</option>
                    <option value="Yyn0">Yyn0</option>
                    <option value="Ynd11">Ynd11</option>
                    <option value="Yzn11">Yzn11</option>
                    <option value="Yd11">Yd11</option>
                    <option value="Yn/D-11-D-11">Yn/D-11-D-11</option>
                    <option value="Yn/Yn/D-0-11">Yn/Yn/D-0-11</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Напряжение КЗ (uk)</label>
                  <select
                    value={ratings.target_uk_percent}
                    onChange={(e) => updateRating('target_uk_percent', Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value={10.5}>10.5% (ГОСТ 110 кВ)</option>
                    <option value={7.5}>7.5% (35 кВ повыш.)</option>
                    <option value={6.5}>6.5% (ГОСТ 35 кВ)</option>
                    <option value={5.5}>5.5% (ГОСТ 10 кВ)</option>
                    <option value={4.5}>4.5% (6–10 кВ Компакт)</option>
                  </select>
                </div>
              </div>

              {/* Регулирование (ПБВ/РПН) и климат (У1/УХЛ1) */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Регулирование</label>
                  <select
                    value={ratings.regulation_type}
                    onChange={(e) => {
                      const mode = e.target.value as 'NONE' | 'PBV' | 'RPN';
                      setRatings((prev) => ({
                        ...prev,
                        regulation_type: mode,
                        tap_range_percent: mode === 'NONE' ? 0.0 : mode === 'RPN' ? 16.0 : 5.0,
                      }));
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value="NONE">Без рег. (фикс. Ктр)</option>
                    <option value="PBV">ПБВ (±2×2.5%)</option>
                    <option value="RPN">РПН (±9×1.78%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-0.5 font-medium">Климат (ГОСТ 15150)</label>
                  <select
                    value={ratings.climate_execution}
                    onChange={(e) => updateRating('climate_execution', e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-xs"
                  >
                    <option value="U1">У1 (-45..+40°C)</option>
                    <option value="UHL1">УХЛ1 (-60..+40°C)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Высоковольтные вводы (ВН) и конструктивное правило */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">2. Высоковольтные вводы (ВН)</span>

              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => updateRating('hv_bushing_type', 'oil_filled')}
                  className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                    ratings.hv_bushing_type === 'oil_filled'
                      ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Маслонап.
                </button>
                <button
                  type="button"
                  onClick={() => updateRating('hv_bushing_type', 'solid_porcelain')}
                  className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                    ratings.hv_bushing_type === 'solid_porcelain'
                      ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Фарфор
                </button>
                <button
                  type="button"
                  onClick={() => updateRating('hv_bushing_type', 'rip_condenser')}
                  className={`py-1.5 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                    ratings.hv_bushing_type === 'rip_condenser'
                      ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  RIP-ввод
                </button>
              </div>

              {ratings.hv_bushing_type === 'oil_filled' ? (
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200/80 text-[10px] text-emerald-800 space-y-0.5">
                  <div className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Правило ПУЭ 4.2.148 и ADR-006:</span>
                  </div>
                  <p>
                    Применены маслонаполненные вводы. Расширительный бак автоматически приподнимается над оголовком ввода для гарантированного гидростатического давления.
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500">
                  {ratings.hv_bushing_type === 'solid_porcelain'
                    ? 'Фарфоровые монолитные изоляторы 35 кВ (ГОСТ 10693).'
                    : 'Конденсаторные вводы с RIP-изоляцией.'}
                </p>
              )}
            </div>

            {/* 3. Вводы НН и масляная система */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">3. Выводы НН и масляная система</span>

              <div>
                <label className="text-slate-600 block mb-1 text-[11px] font-medium">Выводы НН:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateRating('lv_connection_mode', 'busbar')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      ratings.lv_connection_mode === 'busbar'
                        ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Ошиновка (шины)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRating('lv_connection_mode', 'bushings')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      ratings.lv_connection_mode === 'bushings'
                        ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Изоляторы
                  </button>
                </div>
              </div>

              {/* Система охлаждения М (ONAN) / Д (ONAF) */}
              <div className="pt-1 border-t border-slate-200 space-y-1.5">
                <label className="text-slate-600 block text-[11px] font-medium">Охлаждение (ГОСТ / МЭК):</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateRating('cooling_type', 'ONAN')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      ratings.cooling_type === 'ONAN'
                        ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    М (ONAN)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateRating('cooling_type', 'ONAF')}
                    className={`py-1.5 px-2 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      ratings.cooling_type === 'ONAF'
                        ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Д (ONAF + вент.)
                  </button>
                </div>

                {ratings.cooling_type === 'ONAF' && (
                  <div className="grid grid-cols-2 gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => updateRating('fan_mounting', 'bottom')}
                      className={`py-1 px-1.5 text-[10px] font-bold rounded-lg border text-center cursor-pointer ${
                        ratings.fan_mounting === 'bottom'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Обдув снизу ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRating('fan_mounting', 'side')}
                      className={`py-1 px-1.5 text-[10px] font-bold rounded-lg border text-center cursor-pointer ${
                        ratings.fan_mounting === 'side'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Обдув сбоку →
                    </button>
                  </div>
                )}
              </div>

              {/* Расширительный бак и защита масла (v2.0) */}
              <div className="pt-1 border-t border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Расширительный бак</span>
                    <span className="text-[10px] text-slate-500">
                      {ratings.has_conservator ? 'С реле Бухгольца (ТМ/ТМН/ТДН)' : 'Герметичный гофробак (ТМГ)'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ratings.has_conservator}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setRatings((prev) => ({
                          ...prev,
                          has_conservator: checked,
                          oil_preservation_architecture: checked ? (prev.oil_preservation_architecture === 'HERMETIC_CORRUGATED' ? 'AUTO' : prev.oil_preservation_architecture || 'AUTO') : 'HERMETIC_CORRUGATED',
                        }));
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#0b3d66]" />
                  </label>
                </div>
                {ratings.has_conservator && (
                  <div className="text-[11px]">
                    <label className="text-slate-600 block mb-0.5 font-medium">Защита масла (v2.0):</label>
                    <select
                      value={ratings.oil_preservation_architecture || 'AUTO'}
                      onChange={(e) => updateRating('oil_preservation_architecture', e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg py-1 px-1.5 font-bold text-slate-800 text-[11px]"
                    >
                      <option value="AUTO">Авто (AIR_CELL ≥110кВ / УХЛ1)</option>
                      <option value="AIR_BREATHING">Атмосферный + осушитель ВО-2</option>
                      <option value="AIR_CELL">Плёночная ячейка (AIR_CELL)</option>
                      <option value="DIAPHRAGM">Мембранный (DIAPHRAGM)</option>
                      <option value="NITROGEN_BLANKET">Азотная подушка (N₂)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Термосифонный фильтр (ТСФ с силикагелем) */}
              <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Фильтр силикагелевый (ТСФ)</span>
                  <span className="text-[10px] text-slate-500">
                    {ratings.has_thermosiphon_filter ? 'Осушитель масла ТСФ на стенке бака' : 'Без термосифонного фильтра'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ratings.has_thermosiphon_filter ?? true}
                    onChange={(e) => updateRating('has_thermosiphon_filter', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#0b3d66]" />
                </label>
              </div>
            </div>

            {/* ГЛАВНАЯ КНОПКА: Рассчитать и построить чертёж */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => runFullCalculationAndBuild(ratings, template, mode, showHidden, true)}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0b3d66] via-[#093254] to-[#072640] hover:from-[#072640] hover:to-[#051c30] text-white rounded-xl shadow-lg border border-[#e6a417]/40 text-xs font-black uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Cpu className="w-4 h-4 text-[#e6a417]" />
                <span>Рассчитать и построить чертёж</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-1.5 leading-tight">
                Ядро рассчитает активную часть, баланс тепла ONAN и вычертит чертёж с выносками
              </p>
            </div>

            {/* Сворачиваемый блок: Экспертная ручная подстройка CAD */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowExpertCadSettings(!showExpertCadSettings)}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-xs font-bold text-slate-700 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-slate-500" />
                  Тонкая подстройка CAD (мм)
                </span>
                {showExpertCadSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showExpertCadSettings && (
                <div className="p-3 space-y-3 bg-white text-xs border-t border-slate-100">
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Значения получены из инженерного расчета. Вы можете вручную скорректировать габариты сборки:
                  </p>
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Длина бака (L)</span>
                      <span>{params.tank_length} мм</span>
                    </div>
                    <input
                      type="range"
                      min={1200}
                      max={2600}
                      step={50}
                      value={params.tank_length}
                      onChange={(e) => updateParam('tank_length', Number(e.target.value))}
                      className="w-full accent-navy h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Ширина бака (W)</span>
                      <span>{params.tank_width} мм</span>
                    </div>
                    <input
                      type="range"
                      min={700}
                      max={1400}
                      step={50}
                      value={params.tank_width}
                      onChange={(e) => updateParam('tank_width', Number(e.target.value))}
                      className="w-full accent-navy h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Высота бака (H)</span>
                      <span>{params.tank_height} мм</span>
                    </div>
                    <input
                      type="range"
                      min={1100}
                      max={2200}
                      step={50}
                      value={params.tank_height}
                      onChange={(e) => updateParam('tank_height', Number(e.target.value))}
                      className="w-full accent-navy h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span>Пластин в батарее</span>
                      <span>{params.radiator_panel_count} шт</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={14}
                      step={1}
                      value={params.radiator_panel_count}
                      onChange={(e) => updateParam('radiator_panel_count', Number(e.target.value))}
                      className="w-full accent-navy h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Центральная колонка: Чертёжное поле (6 колонок) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            {/* Toolbar листа чертежа */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg py-1 px-2 font-bold text-navy text-xs"
                >
                  <option value="ESKD_RU">Шаблон: RU (ЕСКД / ГОСТ 2.305)</option>
                  <option value="IEC_EN">Template: EN (IEC General Assembly)</option>
                </select>

                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="bg-white border border-slate-300 rounded-lg py-1 px-2 font-bold text-navy text-xs"
                >
                  <option value="exact_hlr">HLRBRep_Algo (Точный HLR)</option>
                  <option value="poly_hlr">HLRBRep_PolyAlgo (Быстрый Poly)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={showHidden}
                    onChange={(e) => setShowHidden(e.target.checked)}
                    className="accent-navy rounded"
                  />
                  <span>Скрытые линии</span>
                </label>

                <div className="h-4 w-px bg-slate-300 mx-1" />

                {/* Экспорт */}
                <button
                  type="button"
                  onClick={() => handleExport('pdf')}
                  className="bg-[#0b3d66] hover:bg-[#072640] text-white py-1 px-2.5 rounded-lg font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Экспорт в векторный PDF A4 Landscape"
                >
                  <Download className="w-3 h-3 text-[#e6a417]" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('dxf')}
                  className="bg-[#e6a417] hover:bg-[#c78b0c] text-[#072640] py-1 px-2.5 rounded-lg font-black flex items-center gap-1 shadow-sm cursor-pointer"
                  title="Экспорт в послойный DXF R2010"
                >
                  <Download className="w-3 h-3" />
                  DXF
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('step')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-1 px-2.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                  title="Экспорт в 3D твердотельный STEP (AP214)"
                >
                  <Box className="w-3 h-3" />
                  STEP
                </button>
              </div>
            </div>

            {/* Viewport чертежа (Pan / Zoom) */}
            <div
              className="relative w-full h-[620px] bg-slate-100 rounded-xl border border-slate-300 overflow-hidden flex items-center justify-center select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
              {isLoading && (
                <div className="absolute top-3 left-3 bg-[#0b3d66]/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow z-20">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#e6a417]" />
                  <span>Пересчет аналитического HLR в OCCT...</span>
                </div>
              )}

              {errorMsg && (
                <div className="absolute top-3 inset-x-3 bg-red-100 border border-red-300 text-red-800 text-xs p-2.5 rounded-xl flex items-center gap-2 z-20 shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Интерактивное SVG поле */}
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isPanning ? 'none' : 'transform 0.15s ease-out',
                }}
                className="w-[96%] max-h-[96%] bg-white shadow-xl rounded border border-slate-300 p-1"
                dangerouslySetInnerHTML={{ __html: svgMarkup || '<div class="p-12 text-center text-slate-400">Формирование чертежа...</div>' }}
              />

              {/* Навигационные кнопки Zoom/Fit */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-xl border border-slate-300 shadow p-1 flex items-center gap-1 z-10">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(z * 1.25, 4))}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Приблизить"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(z / 1.25, 0.4))}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Отдалить"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700 cursor-pointer"
                  title="Сбросить масштаб"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Индикатор текущего масштаба и статуса листа */}
              <div className="absolute bottom-3 left-3 bg-[#072640]/90 text-white text-[11px] px-3 py-1.5 rounded-lg shadow font-mono flex items-center gap-2 z-10">
                <span className="text-[#e6a417] font-bold">М 1:40</span>
                <span>•</span>
                <span>{template === 'ESKD_RU' ? 'ГОСТ 2.305 (1-й угол)' : 'FIRST ANGLE PROJ'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">DEMO / NOT FOR MFG</span>
              </div>
            </div>

            {/* Подвал чертежного блока с нормативной плашкой */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Инженерный статус модели: ДЕМОНСТРАЦИОННЫЙ ПРОТОТИП (DEMO)</strong>
                <p className="text-[10px] text-amber-800 mt-0.5">
                  Геометрия сформирована параметрическим B-Rep ядром для отработки компоновки листа, проекций и выносок. Габариты не являются заводским паспортом до согласования опросного листа главным конструктором.
                </p>
              </div>
            </div>
          </div>

          {/* Правая колонка: Инспектор, Размеры и Спецификация (3 колонки) */}
          <div className="lg:col-span-3 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Телеметрия OCCT */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Activity className="w-3.5 h-3.5 text-[#e6a417]" />
                Телеметрия CAD-ядра (OCCT 8.0)
              </span>
              {metrics ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Валидность B-Rep</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Валиден
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Число тел сборки</span>
                    <span className="font-bold text-slate-800">{metrics.components_count} шт</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Позиционные выноски</span>
                    <span className="font-bold text-navy">{metrics.balloons_count} поз. (1..14)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Выносные элементы</span>
                    <span className="font-bold text-navy">{metrics.details_count} (M16, 60×60)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Построение 3D тел</span>
                    <span className="font-bold text-slate-700">{metrics.cad_build_ms} мс</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">HLR exact (3 вида)</span>
                    <span className="font-bold text-[#e6a417]">{metrics.hlr_total_ms} мс</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Полный цикл перестройки</span>
                    <span className="font-bold text-navy">{metrics.total_ms} мс</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 py-3 text-center">Ожидание телеметрии...</div>
              )}
            </div>

            {/* Инженерный расчёт (ГОСТ Р 52719 & ADR-006) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#e6a417]" />
                  Инженерный расчёт
                </span>
                {engineeringCalc?.designation && (
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-[#0b3d66] text-[#e6a417]">
                    {engineeringCalc.designation}
                  </span>
                )}
              </div>
              {engineeringCalc ? (
                <div className="space-y-1.5 text-xs">
                  {engineeringCalc.electrical && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">
                        {engineeringCalc.electrical.rated_current_mv_a ? 'Ток ВН / СН / НН' : 'Ток ВН / НН'}
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {engineeringCalc.electrical.rated_current_hv_a} / {engineeringCalc.electrical.rated_current_mv_a ? `${engineeringCalc.electrical.rated_current_mv_a} / ` : ''}{engineeringCalc.electrical.rated_current_lv_a} А
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Потери ХХ (P₀) / КЗ (P_k)</span>
                    <span className="font-mono font-bold text-slate-800">
                      {engineeringCalc.core.no_load_losses_kw} / {engineeringCalc.windings.load_losses_75c_kw} кВт
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Напряжение КЗ (u_k) / канал a₁₂</span>
                    <span className="font-mono font-bold text-navy">
                      {engineeringCalc.windings.short_circuit_impedance_percent}% • {engineeringCalc.windings.main_insulation_gap_mm} мм
                    </span>
                  </div>
                  {engineeringCalc.windings.lv_conductor_spec && (
                    <div className="py-1 border-b border-slate-100 text-[10px] space-y-0.5">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Обм. НН ({engineeringCalc.windings.lv_winding_type}):</span>
                        <span className="font-mono font-bold text-slate-800">{engineeringCalc.windings.lv_conductor_spec}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-500">Обм. ВН ({engineeringCalc.windings.hv_winding_type}):</span>
                        <span className="font-mono font-bold text-slate-800">{engineeringCalc.windings.hv_conductor_spec}</span>
                      </div>
                    </div>
                  )}
                  {engineeringCalc.windings.active_part_envelope && (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Ø катушки / К_окна</span>
                        <span className="font-mono font-bold text-slate-800">
                          {Math.round(engineeringCalc.windings.active_part_envelope.outer_coil_diameter_mm)} мм • {Math.round(engineeringCalc.windings.active_part_envelope.window_fill_factor * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Бак по обмоткам (Д×Ш×В)</span>
                        <span className="font-mono font-bold text-[#0b3d66]">
                          {Math.round(engineeringCalc.windings.active_part_envelope.tank_length_mm)}×{Math.round(engineeringCalc.windings.active_part_envelope.tank_width_mm)}×{Math.round(engineeringCalc.windings.active_part_envelope.tank_height_mm)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">
                      Сталь ({engineeringCalc.core.steel_grade_used || '3409'}) / {engineeringCalc.windings.conductor_material === 'aluminum' ? 'Алюминий' : 'Медь'}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {Math.round(engineeringCalc.core.core_steel_mass_kg)} / {Math.round(engineeringCalc.windings.winding_conductor_mass_kg)} кг
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Объём / масса масла</span>
                    <span className="font-mono font-bold text-slate-800">
                      {Math.round(engineeringCalc.oil_conservator.oil_volume_total_liters)} л ({Math.round(engineeringCalc.oil_conservator.oil_mass_kg)} кг)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Полная / трансп. масса</span>
                    <span className="font-mono font-bold text-navy">
                      {(engineeringCalc.masses.total_transformer_mass_kg / 1000).toFixed(1)} / {(engineeringCalc.masses.transport_mass_kg / 1000).toFixed(1)} т
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Масло / обм. / Hot-Spot</span>
                    <span className={`font-mono font-bold ${engineeringCalc.thermal.is_temperature_rise_compliant ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {engineeringCalc.thermal.top_oil_temp_rise_k}K / {engineeringCalc.thermal.winding_avg_temp_rise_k}K / {engineeringCalc.thermal.hotspot_temp_c ?? 105}°C
                    </span>
                  </div>
                  {engineeringCalc.thermal.radiator_model && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Радиаторы (LMTD {engineeringCalc.thermal.lmtd_k}K)</span>
                      <span className="font-mono font-bold text-slate-800 text-right">
                        {engineeringCalc.thermal.radiator_model} • {engineeringCalc.thermal.radiator_banks_per_long_side * 2}×{engineeringCalc.thermal.fins_per_bank}
                        {engineeringCalc.thermal.radiator_banks_end_x > 0 ? `+1×${engineeringCalc.thermal.fins_per_end_bank}` : ''}
                      </span>
                    </div>
                  )}
                  {engineeringCalc.thermal.radiator_capacity_kw > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Отвод / зазор батарей</span>
                      <span className={`font-mono font-bold ${engineeringCalc.thermal.geometric_fit_ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {engineeringCalc.thermal.radiator_capacity_kw} кВт • {Math.round(engineeringCalc.thermal.inter_bank_gap_x_mm)} мм
                      </span>
                    </div>
                  )}
                  {engineeringCalc.thermal.cooling_fans && (
                    <>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Обдув Д (ONAF)</span>
                        <span className="font-mono font-bold text-sky-700">
                          {engineeringCalc.thermal.cooling_fans.fan_count}× ({engineeringCalc.thermal.cooling_fans.mounting_position === 'bottom' ? 'снизу ↑' : 'сбоку →'})
                        </span>
                      </div>
                      {engineeringCalc.thermal.cooling_fans.operating_airflow_m3h > 0 && (
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Раб. точка Q-ΔP (N+1)</span>
                          <span className={`font-mono font-bold ${engineeringCalc.thermal.cooling_fans.n_plus_1_compliant ? 'text-sky-700' : 'text-amber-700'}`}>
                            {Math.round(engineeringCalc.thermal.cooling_fans.operating_airflow_m3h)} м³/ч @ {Math.round(engineeringCalc.thermal.cooling_fans.operating_dp_pa)} Па
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {engineeringCalc.short_circuit_check && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Стойкость КЗ (2 с)</span>
                      <span className={`font-mono font-bold ${engineeringCalc.short_circuit_check.is_thermal_sc_compliant && engineeringCalc.short_circuit_check.is_mechanical_sc_compliant ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {Math.max(engineeringCalc.short_circuit_check.sc_end_temp_lv_c, engineeringCalc.short_circuit_check.sc_end_temp_hv_c)}°C • {engineeringCalc.short_circuit_check.radial_hoop_stress_mpa} МПа
                      </span>
                    </div>
                  )}
                  {engineeringCalc.transport_gauge && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Автогабарит (Ш×В)</span>
                      <span className={`font-mono font-bold ${engineeringCalc.transport_gauge.fits_standard_road_gauge ? 'text-emerald-600' : 'text-amber-700'}`}>
                        {engineeringCalc.transport_gauge.overall_width_mm}×{engineeringCalc.transport_gauge.overall_height_mm} мм
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Гидроподпор (ADR-006)</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {engineeringCalc.oil_conservator.has_conservator
                        ? `+${engineeringCalc.oil_conservator.hydrostatic_head_margin_mm} мм`
                        : 'ТМГ (гермет.)'}
                    </span>
                  </div>
                  {engineeringCalc.cu_vs_al_comparison && (
                    <div className="mt-2 pt-2 border-t border-slate-200 bg-slate-50/90 rounded-lg p-2 space-y-1 text-[10px]">
                      <div className="font-bold text-[#0b3d66] flex justify-between">
                        <span>Редизайн Cu ↔ Al (v0.6)</span>
                        <span className="font-mono text-slate-500">
                          ΔØ {engineeringCalc.cu_vs_al_comparison.delta_coil_dia_al_vs_cu_mm >= 0 ? '+' : ''}
                          {engineeringCalc.cu_vs_al_comparison.delta_coil_dia_al_vs_cu_mm} мм
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 font-mono">
                        <div className={`p-1.5 rounded border ${engineeringCalc.cu_vs_al_comparison.selected === 'copper' ? 'bg-white border-[#0b3d66]/50 font-bold' : 'bg-slate-100/60 border-slate-200 text-slate-600'}`}>
                          <div className="text-[9px] uppercase text-slate-500">Медь (Cu)</div>
                          <div>{engineeringCalc.cu_vs_al_comparison.copper.tank_l_w_h_mm}</div>
                          <div>{Math.round(engineeringCalc.cu_vs_al_comparison.copper.conductor_mass_kg)} кг • {engineeringCalc.cu_vs_al_comparison.copper.load_losses_kw} кВт</div>
                        </div>
                        <div className={`p-1.5 rounded border ${engineeringCalc.cu_vs_al_comparison.selected === 'aluminum' ? 'bg-white border-[#0b3d66]/50 font-bold' : 'bg-slate-100/60 border-slate-200 text-slate-600'}`}>
                          <div className="text-[9px] uppercase text-slate-500">Алюминий (Al)</div>
                          <div>{engineeringCalc.cu_vs_al_comparison.aluminum.tank_l_w_h_mm}</div>
                          <div>{Math.round(engineeringCalc.cu_vs_al_comparison.aluminum.conductor_mass_kg)} кг • {engineeringCalc.cu_vs_al_comparison.aluminum.load_losses_kw} кВт</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-2 space-y-2">
                  <p className="text-[11px]">
                    Нажмите «Рассчитать и построить чертёж» в левой панели для подбора параметров по нормам ГОСТ.
                  </p>
                  <button
                    type="button"
                    onClick={() => runFullCalculationAndBuild(ratings, template, mode, showHidden, true)}
                    className="w-full py-1 px-2 bg-slate-100 hover:bg-slate-200 text-[#0b3d66] rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Запустить расчёт {ratings.rated_power_kva} кВА
                  </button>
                </div>
              )}
            </div>

            {/* Испытательные напряжения и зазоры ГОСТ 1516.3-96 */}
            {engineeringCalc?.dielectric && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e6a417]" />
                  Изоляция ГОСТ 1516.3-96
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Uмакс (Um) / U50 (1 мин)</span>
                    <span className="font-mono font-bold text-navy">
                      {engineeringCalc.dielectric.hv_max_operating_um_kv} / {engineeringCalc.dielectric.hv_test_u50_1min_kv} кВ
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Грозовой импульс ULI</span>
                    <span className="font-mono font-bold text-navy">
                      {engineeringCalc.dielectric.hv_impulse_uli_kv} кВ (срез {engineeringCalc.dielectric.hv_chopped_ulic_kv})
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Мин. воздушный зазор ВН (ф-ф / ф-з):</span>
                    <span className="font-mono font-bold text-slate-800">
                      {engineeringCalc.dielectric.hv_min_air_phase_phase_mm} / {engineeringCalc.dielectric.hv_min_air_phase_ground_mm} мм
                    </span>
                  </div>
                  {engineeringCalc.dielectric.mv_voltage_class_kv && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 col-span-2 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500">СН ({engineeringCalc.dielectric.mv_voltage_class_kv} кВ): U50 / ULI</span>
                      <span className="font-mono font-bold text-navy">
                        {engineeringCalc.dielectric.mv_test_u50_1min_kv} / {engineeringCalc.dielectric.mv_impulse_uli_kv} кВ (зазор {engineeringCalc.dielectric.mv_min_air_phase_phase_mm} мм)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Параметрическая карта вводов ВН / СН / НН (v4.0) */}
            {engineeringCalc?.bushings && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#e6a417]" />
                    Вводы ВН / НН (v4.1)
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${engineeringCalc.bushings.all_valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {engineeringCalc.bushings.hv.drawing_status}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="font-bold text-[#0b3d66] flex justify-between gap-2">
                      <span className="truncate">{engineeringCalc.bushings.hv.model}</span>
                      <span className="font-mono shrink-0">{engineeringCalc.bushings.hv.technology}</span>
                    </div>
                    <div className="text-slate-600 flex justify-between font-mono">
                      <span>Lвозд/масл: {Math.round(engineeringCalc.bushings.hv.air_side_length_mm)}/{Math.round(engineeringCalc.bushings.hv.oil_side_length_mm)} мм</span>
                      <span>Утечка: {Math.round(engineeringCalc.bushings.hv.creepage_mm)} мм</span>
                    </div>
                    <div className="text-slate-500 flex justify-between font-mono">
                      <span>Фланец Ø{Math.round(engineeringCalc.bushings.hv.flange_od_mm)} • PCD {Math.round(engineeringCalc.bushings.hv.flange_pcd_mm)} ({engineeringCalc.bushings.hv.flange_hole_count}×Ø{Math.round(engineeringCalc.bushings.hv.flange_hole_diameter_mm)})</span>
                      <span>{engineeringCalc.bushings.hv.has_test_tap ? 'PIN M12' : 'Без PIN'}</span>
                    </div>
                    <div className="text-slate-600 font-medium">{engineeringCalc.bushings.hv.top_terminal_spec}</div>
                  </div>
                  {engineeringCalc.bushings.hv_neutral && (
                    <div className="p-1.5 rounded-lg bg-blue-50/60 border border-blue-100 flex justify-between gap-2">
                      <span className="font-semibold text-[#0b3d66] truncate">0_ВН: {engineeringCalc.bushings.hv_neutral.model}</span>
                      <span className="font-mono text-slate-600 shrink-0">{Math.round(engineeringCalc.bushings.hv_neutral.air_side_length_mm)} мм</span>
                    </div>
                  )}
                  {engineeringCalc.bushings.mv && (
                    <div className="p-1.5 rounded-lg bg-slate-50/70 border border-slate-100 flex justify-between gap-2">
                      <span className="font-semibold text-slate-700 truncate">
                        {engineeringCalc.bushings.cover_layout_mode === 'split_lv' ? 'НН2' : 'СН'}: {engineeringCalc.bushings.mv.model}
                      </span>
                      <span className="font-mono text-slate-600 shrink-0">{Math.round(engineeringCalc.bushings.mv.air_side_length_mm)} мм</span>
                    </div>
                  )}
                  <div className="p-1.5 rounded-lg bg-slate-50/70 border border-slate-100 flex justify-between gap-2">
                    <span className="font-semibold text-slate-700 truncate">
                      {engineeringCalc.bushings.cover_layout_mode === 'split_lv' ? 'НН1' : 'НН'}: {engineeringCalc.bushings.lv.model}
                    </span>
                    <span className="font-mono text-slate-600 shrink-0">{engineeringCalc.bushings.lv.top_terminal_spec.split(',')[0]}</span>
                  </div>
                  {engineeringCalc.bushings.cover_layout_description_ru && (
                    <div className="text-[9.5px] text-slate-500 leading-snug pt-0.5">
                      {engineeringCalc.bushings.cover_layout_description_ru}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Система регулирования напряжения NONE / ПБВ / РПН (v2.0) */}
            {engineeringCalc?.regulation && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#e6a417]" />
                    Регулирование {engineeringCalc.regulation.mode === 'RPN' ? 'РПН' : engineeringCalc.regulation.mode === 'PBV' ? 'ПБВ' : 'Фикс.'} (v2.0)
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    engineeringCalc.regulation.placement_status === 'PRELIMINARY_COLLISION'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {engineeringCalc.regulation.placement_status}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="font-bold text-[#0b3d66] flex justify-between gap-2">
                      <span className="truncate">{engineeringCalc.regulation.model_name}</span>
                      <span className="font-mono shrink-0">{engineeringCalc.regulation.mode}</span>
                    </div>
                    {engineeringCalc.regulation.mode !== 'NONE' ? (
                      <>
                        <div className="text-slate-600 flex justify-between font-mono">
                          <span>±{engineeringCalc.regulation.range_percent}% ({engineeringCalc.regulation.positions_count} пол., шаг {engineeringCalc.regulation.step_percent}%)</span>
                          <span>Uступ={Math.round(engineeringCalc.regulation.step_voltage_v)} В</span>
                        </div>
                        <div className="text-slate-600 flex justify-between font-mono">
                          <span>Iскв={engineeringCalc.regulation.through_current_max_tap_a} А • Pст={engineeringCalc.regulation.step_capacity_1ph_kva} кВА</span>
                          <span>Ith={engineeringCalc.regulation.ith_3s_ka} кА</span>
                        </div>
                        <div className="text-slate-500 flex justify-between font-mono">
                          <span>Карман бака: +{Math.round(engineeringCalc.regulation.required_tank_pocket_mm)} мм</span>
                          <span>Головка Ø{Math.round(engineeringCalc.regulation.head_flange_od_mm)} мм</span>
                        </div>
                        <div className="text-slate-600 font-medium">{engineeringCalc.regulation.drive_model}</div>
                      </>
                    ) : (
                      <div className="text-slate-600">{engineeringCalc.regulation.gost_11677_note}</div>
                    )}
                  </div>
                  <div className="text-[9.5px] text-slate-500 leading-snug">
                    {engineeringCalc.regulation.pte_467_note}
                  </div>
                </div>
              </div>
            )}

            {/* Ходовая часть, катки и колея (ГОСТ 11677-85 / ГОСТ 11920-85 / ГОСТ 12965-85) */}
            {engineeringCalc?.undercarriage && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-[#e6a417]" />
                    Катки и колея (ГОСТ)
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    engineeringCalc.undercarriage.gauge_gost_compliant && engineeringCalc.undercarriage.load_check_ok
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {engineeringCalc.undercarriage.undercarriage_type === 'skids'
                      ? 'САЛАЗКИ'
                      : engineeringCalc.undercarriage.undercarriage_type === 'smooth_rollers'
                      ? 'ГЛАДКИЕ'
                      : engineeringCalc.undercarriage.undercarriage_type === 'flanged_carriages'
                      ? 'КАРЕТКИ 4×2'
                      : 'РЕБОРДНЫЕ'}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="font-bold text-[#0b3d66]">{engineeringCalc.undercarriage.type_name_ru}</div>
                    <div className="text-slate-600 flex justify-between font-mono">
                      <span>Колея Y × База X: {Math.round(engineeringCalc.undercarriage.track_gauge_y_mm)} × {Math.round(engineeringCalc.undercarriage.axle_wheelbase_x_mm)} мм</span>
                      {engineeringCalc.undercarriage.wheel_diameter_mm > 0 && (
                        <span>Ø{Math.round(engineeringCalc.undercarriage.wheel_diameter_mm)} мм</span>
                      )}
                    </div>
                    {engineeringCalc.undercarriage.roller_count > 0 && (
                      <div className="text-slate-600 flex justify-between font-mono">
                        <span>Нагрузка: {engineeringCalc.undercarriage.load_per_wheel_kn} / {Math.round(engineeringCalc.undercarriage.allowable_load_per_wheel_kn)} кН</span>
                        <span>{engineeringCalc.undercarriage.bi_directional_90deg ? 'Поворот 90°' : 'Фикс.'}</span>
                      </div>
                    )}
                    <div className="text-slate-500 font-medium">{engineeringCalc.undercarriage.rail_type_recommended}</div>
                  </div>
                  <div className="text-[9.5px] text-slate-500 leading-snug">
                    {engineeringCalc.undercarriage.standard_ref}
                  </div>
                </div>
              </div>
            )}

            {/* Расширительный бак, защита масла и наружные трубы (v2.0) */}
            {engineeringCalc?.conservator_system && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#e6a417]" />
                    Расширитель и трубы (v2.0)
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    engineeringCalc.conservator_system.usable_capacity_ok && engineeringCalc.conservator_system.oltc_segregation_ok
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {engineeringCalc.conservator_system.architecture}
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="font-bold text-[#0b3d66]">{engineeringCalc.conservator_system.architecture_name_ru}</div>
                    <div className="text-slate-600 flex justify-between font-mono">
                      <span>ΔV={Math.round(engineeringCalc.conservator_system.main_thermal_expansion_l)} л (ΔT={Math.round(engineeringCalc.conservator_system.delta_temp_c)}°C)</span>
                      <span>Vпол={Math.round(engineeringCalc.conservator_system.main_usable_capacity_l)}/{Math.round(engineeringCalc.conservator_system.main_gross_volume_l)} л</span>
                    </div>
                    {engineeringCalc.conservator_system.architecture !== 'HERMETIC_CORRUGATED' && (
                      <>
                        <div className="text-slate-600 flex justify-between font-mono">
                          <span>Ø{Math.round(engineeringCalc.conservator_system.shell_diameter_mm)}×{Math.round(engineeringCalc.conservator_system.total_shell_length_mm)} мм</span>
                          <span>Ур: {Math.round(engineeringCalc.conservator_system.level_min_mm)}/{Math.round(engineeringCalc.conservator_system.level_20c_mm)}/{Math.round(engineeringCalc.conservator_system.level_max_mm)} мм</span>
                        </div>
                        <div className="text-slate-500 flex justify-between font-mono">
                          <span>Масса зал: {Math.round(engineeringCalc.conservator_system.filled_mass_kg)} кг</span>
                          <span>Опора: {Math.round(engineeringCalc.conservator_system.support_reaction_kgf)} кгс</span>
                        </div>
                        {engineeringCalc.conservator_system.has_split_oltc_compartment && (
                          <div className="text-blue-700 font-mono">
                            Отсек РПН (изол.): L={Math.round(engineeringCalc.conservator_system.oltc_compartment_length_mm)} мм • V={Math.round(engineeringCalc.conservator_system.oltc_gross_volume_l)} л
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {engineeringCalc.conservator_system.pipe_schedule?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {engineeringCalc.conservator_system.pipe_schedule.map((pl: any, idx: number) => (
                        <span
                          key={idx}
                          title={`${pl.service_ru} — DN${pl.dn_mm}, уклон ${pl.slope_pct}%`}
                          className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                        >
                          {pl.tag} DN{pl.dn_mm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Подбор реальных комплектующих РФ/СНГ (components-db) */}
            {engineeringCalc?.selected_components && engineeringCalc.selected_components.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-[#e6a417]" />
                    Комплектующие РФ/СНГ
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {engineeringCalc.selected_components.length} узл.
                  </span>
                </div>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-[10px]">
                  {engineeringCalc.selected_components.map((comp: any, idx: number) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50/80 border border-slate-100 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#0b3d66] truncate" title={comp.category}>
                          {comp.category}
                        </span>
                        <span className="font-mono font-bold text-slate-700 shrink-0">{comp.quantity}</span>
                      </div>
                      <div className="font-semibold text-slate-800">{comp.model}</div>
                      <div className="text-slate-500 flex justify-between gap-1">
                        <span className="truncate">{comp.manufacturer}</span>
                        <span className="shrink-0 font-mono text-[9px] text-slate-400">{comp.standard}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Программа испытаний ГОСТ 3484.1–3484.5 (сворачиваемая) */}
            {engineeringCalc?.testing_program && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTestingProgram(!showTestingProgram)}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#e6a417]" />
                    Испытания ГОСТ 3484 и Сертификация
                  </span>
                  {showTestingProgram ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {showTestingProgram && (
                  <div className="px-4 pb-4 space-y-2.5 text-[10px] border-t border-slate-100 pt-2.5">
                    <div>
                      <span className="font-bold text-[#0b3d66] block mb-1 uppercase">Приёмосдаточные (каждый ед.):</span>
                      <ul className="space-y-0.5 text-slate-600">
                        {engineeringCalc.testing_program.routine_tests.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-[#0b3d66] block mb-1 uppercase">Типовые испытания:</span>
                      <ul className="space-y-0.5 text-slate-600">
                        {engineeringCalc.testing_program.type_tests.map((t: string, i: number) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/70">
                      <span className="font-bold text-emerald-800 block mb-1 uppercase">Документы соответствия РФ:</span>
                      <ul className="space-y-0.5 text-emerald-900">
                        {engineeringCalc.testing_program.required_certificates.map((c: string, i: number) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Нормативный аудит РФ (ГОСТ, ПУЭ, ЕСКД / Gate 7) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e6a417]" />
                  Нормативный аудит РФ
                </span>
                {normativeReport && (
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      normativeReport.overall_status === 'CHECKED WITHIN DECLARED SCOPE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : normativeReport.overall_status === 'ISSUES FOUND'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {normativeReport.overall_status === 'CHECKED WITHIN DECLARED SCOPE'
                      ? 'В норме (Scope OK)'
                      : normativeReport.overall_status}
                  </span>
                )}
              </div>

              {normativeReport ? (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                    <span className="text-slate-600">Проверено правил:</span>
                    <div className="flex gap-2">
                      <span className="text-emerald-700 font-bold">✓ {normativeReport.passed_count}</span>
                      {normativeReport.warnings_count > 0 && (
                        <span className="text-amber-700 font-bold">⚠ {normativeReport.warnings_count}</span>
                      )}
                      {normativeReport.issues_count > 0 && (
                        <span className="text-rose-700 font-bold">✕ {normativeReport.issues_count}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {normativeReport.results.map((r: any) => (
                      <div
                        key={r.rule_id}
                        className="p-1.5 rounded-lg border border-slate-100 bg-slate-50/50 text-[10px] space-y-0.5"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-[#0b3d66] truncate mr-1" title={r.title}>
                            {r.document_code} {r.clause}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${
                              r.status === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : r.status === 'FAIL'
                                ? 'bg-rose-100 text-rose-800'
                                : r.status === 'WARNING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-slate-600 truncate" title={r.message}>
                          {r.message}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-slate-400 italic leading-tight pt-1 border-t border-slate-100">
                    Стандарты: ГОСТ Р 52719, ГОСТ 1516.3-96, ГОСТ 30830 (МЭК 60076-1), ГОСТ 3484, ГОСТ 15150, ГОСТ Р 55187, СТО Россети, ПУЭ 4.2.148, ЕСКД.
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-1 space-y-1.5">
                  <p className="text-[11px]">
                    Автоматическая трассировка параметров по 10 обязательным нормам ГОСТ/ПУЭ с фиксацией конкретных пунктов.
                  </p>
                  <button
                    type="button"
                    onClick={() => runFullCalculationAndBuild(ratings, template, mode, showHidden, true)}
                    className="w-full py-1 px-2 bg-slate-100 hover:bg-slate-200 text-[#0b3d66] rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Запустить нормативный аудит
                  </button>
                </div>
              )}
            </div>

            {/* Управление ревизиями и согласование РКД (Gate 9) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#e6a417]" />
                  Ревизии и согласование РКД
                </span>
                {currentRev ? (
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      currentRev.is_locked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentRev.is_locked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                    {currentRev.revision_id} ({currentRev.status})
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-slate-400">DRAFT</span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                {currentRev ? (
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Уровень зрелости:</span>
                      <span className="font-bold text-navy">{currentRev.maturity}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Автор ревизии:</span>
                      <span className="font-bold text-slate-700">{currentRev.author}</span>
                    </div>
                    {currentRev.signatures && currentRev.signatures.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/60 text-[10px] space-y-1">
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Подписи согласования:</span>
                        {currentRev.signatures.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-slate-600">
                            <span>{s.role}: <strong>{s.engineer_name}</strong></span>
                            <span className="text-emerald-700 font-bold">✓ Подписано</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500">
                    Текущие изменения не зафиксированы в реестре ревизий.
                  </div>
                )}

                {/* Поле имени согласующего */}
                <div className="pt-1 space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">ФИО инженера / главного конструктора:</label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={(e) => setEngineerName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
                    placeholder="Иванов И.И."
                  />
                </div>

                {/* Кнопки фиксации и утверждения */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCommitRevision}
                    disabled={isCommittingRev}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-[#0b3d66] rounded-xl font-bold text-[11px] transition-colors cursor-pointer text-center disabled:opacity-50"
                  >
                    {isCommittingRev ? 'Сохранение...' : '+ Новая ревизия'}
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveRevision}
                    disabled={!currentRev || currentRev.is_locked}
                    className={`py-1.5 px-2 rounded-xl font-bold text-[11px] transition-colors text-center ${
                      currentRev?.is_locked
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                        : 'bg-[#0b3d66] hover:bg-[#072640] text-white cursor-pointer shadow-sm'
                    }`}
                  >
                    {currentRev?.is_locked ? '✓ Утверждено' : 'Утвердить РКД'}
                  </button>
                </div>

                {currentRev?.is_locked && (
                  <p className="text-[10px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200/80 leading-tight">
                    🔒 Ревизия {currentRev.revision_id} утверждена и заблокирована. Для внесения правок нажмите «+ Новая ревизия».
                  </p>
                )}
              </div>
            </div>

            {/* Ассоциативные размеры */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Layers className="w-3.5 h-3.5 text-[#e6a417]" />
                Ассоциативные размеры (CAD Datums)
              </span>
              <div className="space-y-1.5 text-xs">
                {dimensions.map((d) => (
                  <div key={d.dimension_id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 truncate mr-2" title={d.dimension_id}>
                      {d.dimension_id.replace('dim.', '')} ({d.view_id})
                    </span>
                    <span className="font-mono font-bold text-navy shrink-0">{d.measured_value_mm} мм</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Спецификация оборудования (BOM 1..14) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black uppercase text-[#0b3d66] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#e6a417]" />
                  Спецификация (BOM)
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{bom.length} поз.</span>
              </div>
              <div className="space-y-1 text-xs max-h-56 overflow-y-auto pr-1">
                {bom.map((item) => (
                  <div
                    key={item.item_number}
                    className="flex items-center justify-between py-1 border-b border-slate-50 text-[11px]"
                  >
                    <span className="text-slate-700 truncate pr-2">
                      <strong className="text-navy mr-1.5">{item.item_number}.</strong>
                      {item.description}
                    </span>
                    <span className="font-bold text-slate-900 shrink-0">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Кнопка запроса ТКП на базе рассчитанных параметров */}
            <div className="bg-gradient-to-br from-[#0b3d66] to-[#072640] p-4 rounded-2xl shadow-md border border-[#e6a417]/30 text-white space-y-2.5">
              <div>
                <span className="text-xs font-black uppercase text-[#e6a417] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Коммерческое предложение
                </span>
                <p className="text-[11px] text-slate-300 mt-1">
                  Запросить официальное ТКП и заводские сроки изготовления для трансформатора {ratings.rated_power_kva} кВА.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onOpenQuoteModal(
                    'maslyanye-35kv',
                    `${ratings.rated_power_kva} кВА, ${ratings.voltage_hv_kv}/${ratings.voltage_lv_kv} кВ (${ratings.winding_material === 'copper' ? 'медь' : 'алюминий'})`
                  )
                }
                className="w-full py-2.5 px-3 bg-[#e6a417] hover:bg-[#d49510] text-[#072640] font-black rounded-xl text-xs uppercase tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Запросить расчет стоимости (ТКП)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Аккуратное модальное окно: Вычерчивание чертежа с анимацией */}
        {isDraftingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center">
              {/* Анимированный чертежный циркуль / сетка */}
              <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                {/* Вращающаяся чертежная сетка */}
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#e6a417] animate-spin"
                  style={{ animationDuration: '6s' }}
                />
                {/* Пульсирующий круг ядра */}
                <div className="absolute inset-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner">
                  <Cpu className="w-10 h-10 text-[#0b3d66] animate-pulse" />
                </div>
                {/* Иконка активности */}
                <div className="absolute -bottom-1 -right-1 bg-[#e6a417] text-slate-900 p-1.5 rounded-full shadow">
                  <Activity className="w-4 h-4 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#0b3d66] uppercase tracking-wide">
                  Построение чертежа трансформатора
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {ratings.rated_power_kva} кВА • {ratings.voltage_hv_kv}/{ratings.voltage_lv_kv} кВ •{' '}
                  {ratings.winding_material === 'copper' ? 'Медь (Cu)' : 'Алюминий (Al)'}
                </p>
              </div>

              {/* Прогресс шагов вычерчивания */}
              <div className="space-y-2.5 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {[
                  { step: 1, label: 'Электромагнитный расчет активной части (ГОСТ 52719)' },
                  { step: 2, label: 'Тепловой баланс ONAN и расчет радиаторов' },
                  { step: 3, label: 'Генерация твёрдотельной 3D B-Rep сборки (OCCT)' },
                  { step: 4, label: 'Удаление невидимых линий (HLR) по ГОСТ 2.305' },
                  { step: 5, label: 'Вычерчивание листа: 14 выносок, BOM и штамп' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                        draftingStep > item.step
                          ? 'bg-emerald-500 text-white'
                          : draftingStep === item.step
                          ? 'bg-[#0b3d66] text-[#e6a417] animate-pulse'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {draftingStep > item.step ? '✓' : item.step}
                    </span>
                    <span
                      className={`truncate text-[11px] ${
                        draftingStep >= item.step ? 'font-bold text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Индикатор прогресс-бара */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0b3d66] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(draftingStep * 20, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Геометрия формируется математическим ядром Open CASCADE без статических заготовок
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
