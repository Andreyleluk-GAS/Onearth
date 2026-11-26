/**
 * Сервисный слой взаимодействия с B-Rep САПР-движком (OpenCASCADE Technology / Python FastAPI)
 * Обеспечивает генерацию ортогональных проекций, точный HLR, расчет габаритов, выносок и экспорт в DXF/PDF/STEP.
 */

import { TransformerCalculationInput } from './types';

export const CAD_API_BASE_URL = (
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CAD_API_URL) ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

export interface CadBomItem {
  item_number: number;
  description: string;
  quantity: number;
  part_number: string;
}

export interface CadDimensionItem {
  dimension_id: string;
  view_id: string;
  measured_value_mm: number;
}

export interface CadTimings {
  cad_build_ms: number;
  hlr_total_ms: number;
  svg_render_ms: number;
  total_ms: number;
}

export interface CadBuildResult {
  svg: string;
  scale_text: string;
  all_valid_brep: boolean;
  components_count: number;
  balloons_count: number;
  details_count: number;
  bom: CadBomItem[];
  dimensions: CadDimensionItem[];
  timings_ms: CadTimings;
  cad_params: Record<string, any>;
  engineering_calculation?: any;
  normative_report?: any;
}

/**
 * Проверка доступности САПР-сервера
 */
export async function checkCadServerHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch(`${CAD_API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return resp.ok;
  } catch {
    return false;
  }
}

/**
 * Преобразование параметров пользовательского интерфейса в схему рейтинга САПР-движка
 */
export function mapInputToCadRatings(input: TransformerCalculationInput): Record<string, any> {
  const power = Math.max(25, Math.min(250000, Number(input.powerKva) || 6300));
  const hv = Number(input.voltageHvKv) || 35.0;
  const lv = Number(input.voltageLvKv) || 10.5;

  let mv: number | null = null;
  if (input.windingConfig === 'three_winding') {
    mv = Number(input.voltageMvKv) || 20.0;
  } else if (input.windingConfig === 'split_winding') {
    mv = Number(input.voltageLv2Kv || input.voltageLvKv) || lv;
  }

  // Нормализация схемы группы соединений
  const vg = (input.vectorGroup || 'Dyn11').replace(/[^a-zA-Z0-9\/-]/g, '');
  let vectorGroup = 'Dyn11';
  if (vg.toLowerCase().includes('ynd11') || vg.includes('YNd11')) vectorGroup = 'Ynd11';
  else if (vg.toLowerCase().includes('yyn0') || vg.includes('Yyn0')) vectorGroup = 'Yyn0';
  else if (vg.toLowerCase().includes('yzn11')) vectorGroup = 'Yzn11';
  else if (vg.toLowerCase().includes('yd11')) vectorGroup = 'Yd11';
  else if (vg.toLowerCase().includes('dyn11')) vectorGroup = 'Dyn11';

  // Топология обмоток
  const topology =
    input.windingConfig === 'three_winding'
      ? 'three_winding'
      : input.windingConfig === 'split_winding'
      ? 'split_lv'
      : 'two_winding';

  // Регулирование напряжения: РПН / ПБВ / NONE
  const isRpn =
    input.projectName?.toUpperCase().includes('ТМН') ||
    input.projectName?.toUpperCase().includes('ТДН') ||
    input.projectName?.toUpperCase().includes('РПН') ||
    power >= 10000;
  const regulationType = isRpn ? 'RPN' : 'PBV';

  // Охлаждение
  const isOnaf =
    input.oilCoolingType === 'ONAF' ||
    input.dryCoolingType === 'AF' ||
    input.projectName?.toUpperCase().includes('ТДН') ||
    power >= 10000;
  const coolingType = isOnaf ? 'ONAF' : 'ONAN';

  // Тип бака и расширителя
  const hasConservator = input.type === 'oil' && !input.projectName?.toUpperCase().includes('ТМГ');

  // Тип изоляции высоковольтных вводов
  let hvBushingType: 'solid_porcelain' | 'oil_filled' | 'rip_condenser' = 'solid_porcelain';
  if (hv >= 110) {
    hvBushingType = 'rip_condenser';
  } else if (hv >= 35) {
    hvBushingType = 'oil_filled';
  }

  return {
    rated_power_kva: power,
    voltage_hv_kv: hv,
    voltage_mv_kv: mv,
    voltage_lv_kv: lv,
    frequency_hz: Number(input.frequencyHz) || 50.0,
    vector_group: vectorGroup,
    winding_topology: topology,
    winding_material: input.windingMaterial === 'Al' ? 'aluminum' : 'copper',
    cooling_type: coolingType,
    regulation_type: regulationType,
    has_conservator: hasConservator,
    oil_preservation_architecture: 'AUTO',
    has_thermosiphon_filter: input.type === 'oil' && power >= 1000,
    hv_bushing_type: hvBushingType,
    lv_connection_mode: input.type === 'dry' ? 'busbar' : 'bushings',
    fan_mounting: 'bottom',
    climate_execution: 'U1',
    ambient_temp_max_c: 40.0,
    ambient_temp_min_c: -45.0,
    roller_gauge: power >= 4000 ? 1524.0 : 1070.0,
  };
}

/**
 * Запрос расчета и построения 2D/3D чертежа через САПР-движок
 */
export async function requestCadDrawing(
  input: TransformerCalculationInput,
  options?: { signal?: AbortSignal; template?: 'ESKD_RU' | 'IEC_EN'; mode?: 'exact_hlr' | 'fast_wireframe'; showHidden?: boolean }
): Promise<CadBuildResult> {
  const ratings = mapInputToCadRatings(input);
  const template = options?.template || 'ESKD_RU';
  const mode = options?.mode || 'exact_hlr';
  const show_hidden = options?.showHidden ?? true;

  const resp = await fetch(`${CAD_API_BASE_URL}/api/engineering/calculate_and_build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ratings,
      template,
      mode,
      show_hidden,
    }),
    signal: options?.signal,
  });

  if (!resp.ok) {
    const errorJson = await resp.json().catch(() => ({ detail: 'Ошибка сервера САПР' }));
    const errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
    throw new Error(`Ошибка САПР-движка (${resp.status}): ${errorDetail}`);
  }

  const data = await resp.json();
  return {
    svg: data.svg,
    scale_text: data.scale_text || '1:75',
    all_valid_brep: Boolean(data.all_valid_brep),
    components_count: data.components?.length || 0,
    balloons_count: data.balloons_count || data.bom?.length || 14,
    details_count: data.details_count || 2,
    bom: data.bom || [],
    dimensions: data.dimensions || [],
    timings_ms: {
      cad_build_ms: data.timings_ms?.cad_build_ms || 0,
      hlr_total_ms: data.timings_ms?.hlr_total_ms || 0,
      svg_render_ms: data.timings_ms?.svg_render_ms || 0,
      total_ms: data.timings_ms?.total_ms || 0,
    },
    cad_params: data.cad_params || {},
    engineering_calculation: data.engineering_calculation,
    normative_report: data.normative_report,
  };
}

/**
 * Скачивание файлов чертежа (PDF, DXF, 3D STEP) напрямую из ядра САПР
 */
export async function downloadCadExport(
  fmt: 'pdf' | 'dxf' | 'step',
  params: Record<string, any>,
  filename: string,
  template: 'ESKD_RU' | 'IEC_EN' = 'ESKD_RU'
): Promise<void> {
  const resp = await fetch(`${CAD_API_BASE_URL}/api/spike/export/${fmt}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      params,
      template,
      mode: 'exact_hlr',
      show_hidden: true,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Экспорт ${fmt.toUpperCase()} не удался (HTTP ${resp.status})`);
  }

  const blob = await resp.blob();
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(blobUrl);
}
