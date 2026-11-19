/**
 * Высокоточный параметрический САПР-движок для генерации чертежей силовых трансформаторов
 * по стандартам ЕСКД / ГОСТ 2.305-68, ГОСТ 2.104-2006, ГОСТ 2.307-2011, ГОСТ 52719-2007.
 *
 * Генерирует детальные ортогональные инженерные проекции:
 * 1. Главный вид (Front View) — габарит по высоте H
 * 2. Вид сбоку (Side View / Profile) — габарит по ширине B
 * 3. Вид сверху (Top View / Plan) — габарит по длине L
 *
 * Максимальная реалистичность элементов по заводским чертежам:
 * - Вводы ВН на наклонных турелях с искровыми рогами-разрядниками, юбками и лапами
 * - Вводы НН с плоскими шинными контактными лопатками
 * - Вводы СН для трехобмоточных трансформаторов (Am, Bm, Cm)
 * - Расширитель с циферблатным маслоуказателем МС-1, эллиптическими днищами и кронштейнами
 * - Наклонный маслопровод с реле Бухгольца BF-80 и запорными дисковыми заслонками
 * - Силикагелевый воздухоосушитель с масляным гидрозатвором вдоль стенки бака
 * - Бак с поясами и ребрами жесткости, подъемными крюками, упорами под домкраты и люками
 * - Шкаф управления (ШАОТ) с двухстворчатыми дверями, замками и вентиляцией
 * - Радиаторные батареи по тепловому расчету (секции, коллекторы, затворы)
 * - Дутьевые вентиляторы 2ДМ-450 снизу под радиаторами с диффузорами и вектором обдува
 * - Сухие трансформаторы: литые обмотки (A, B, C) с охлаждающими каналами, ярмовые балки,
 *   ПБВ, ошиновка, тангенциальные вентиляторы AF, защитные кожухи IP21/IP31 с жалюзи
 * - Основание с поворотными каретками и двухребордными катками на рельсах
 * - Металлическая лестница обслуживания с защитным ограждением
 * - Контроль реализуемости (Feasibility validation) по ГОСТ и тепловому балансу
 */

import {
  TransformerCalculationResult,
  WindingConfiguration,
  RadiatorBank,
  FanSpecification,
  FeasibilityStatus,
  EnclosureType,
  OilCoolingType,
  DryCoolingType,
  WindingMaterial,
} from './types';

export interface DraftingScaleContext {
  scale: number;
  gostScaleText: string;
  sL: number;
  sW: number;
  sH: number;
  sTotL: number;
  sTotW: number;
  sTotH: number;
  sBhHv: number;
  sBhMv?: number; // Масштабированная высота ввода СН
  sBhLv: number;
  sConsD: number;
  sConsL: number;
  sRadW: number;
  sRadH: number;
  sRadDepth: number;
  skirtsCount: number;
  groundY: number;
  frontCenterX: number;
  sideCenterX: number;
  topCenterY: number;
  isOil: boolean;
  powerKva: number;
  voltageHvKv: number;
  voltageMvKv?: number;
  voltageLvKv: number;
  voltageLv1Kv?: number;
  voltageLv2Kv?: number;
  windingConfig: WindingConfiguration;
  windingMaterial: WindingMaterial;
  trackGaugeMm: number;
  sGauge: number;
  hasFans: boolean;
  radiators?: RadiatorBank;
  fanSpec?: FanSpecification;
  radsCountFront: number;
  radsCountSide: number;
  radsCountTop: number;
  radsRight: number;
  radsBack: number;
  radsLeft: number;
  totalRads: number;
  enclosure?: EnclosureType;
  isEnclosedDry: boolean;
  dryCoolingType?: DryCoolingType;
  feasibility: FeasibilityStatus;
}

/**
 * Расчет оптимального инженерного масштаба для листа А4 (297х210 мм)
 */
export function computeDraftingContext(
  result: TransformerCalculationResult,
  frameWidth = 2720,
  frameHeight = 2000
): DraftingScaleContext {
  const d = result.dimensions;
  const req = result.input;
  const isOil = req.type === 'oil';

  // Зоны размещения на листе А4:
  // Главный вид: X ~ [200..1600], Y ~ [100..1060] (доступно W: 1300, H: 820)
  // Вид сбоку:   X ~ [1650..2900], Y ~ [100..1060] (доступно W: 1050, H: 820)
  // Вид сверху:  X ~ [200..1600], Y ~ [1160..2020] (доступно W: 1300, H: 680)
  const availFrontW = 1260;
  const availSideW = 1000;
  const availH = 780;
  const availTopH = 650;

  const marginL = 500;
  const marginW = 450;
  const marginH = 350;

  const scaleFrontW = availFrontW / (d.overallLengthMm + marginL);
  const scaleSideW = availSideW / (d.overallWidthMm + marginW);
  const scaleH = availH / (d.overallHeightMm + marginH);
  const scaleTopH = availTopH / (d.overallWidthMm + marginW);

  const rawScale = Math.min(scaleFrontW, scaleSideW, scaleH, scaleTopH);

  let gostScaleText = 'М 1:50';
  let scale = 0.2;

  if (rawScale >= 0.32) {
    gostScaleText = 'М 1:25';
    scale = 0.28;
  } else if (rawScale >= 0.17) {
    gostScaleText = 'М 1:50';
    scale = Math.min(rawScale * 0.94, 0.22);
  } else if (rawScale >= 0.085) {
    gostScaleText = 'М 1:100';
    scale = Math.min(rawScale * 0.94, 0.12);
  } else {
    gostScaleText = 'М 1:200';
    scale = Math.min(rawScale * 0.92, 0.065);
  }

  // Защита границ
  scale = Math.max(0.05, Math.min(scale, 0.29));

  const L = d.lengthMm;
  const W = d.widthMm;
  const H = d.heightMm;

  const sL = L * scale;
  const sW = W * scale;
  const sH = H * scale;
  const sTotL = d.overallLengthMm * scale;
  const sTotW = d.overallWidthMm * scale;
  const sTotH = d.overallHeightMm * scale;

  const sBhHv = d.bushingHeightHvMm * scale;
  const sBhMv = d.bushingHeightMvMm ? d.bushingHeightMvMm * scale : undefined;
  const sBhLv = d.bushingHeightLvMm * scale;
  const sConsD = (d.conservatorDiameterMm || 650) * scale;
  const sConsL = (d.conservatorLengthMm || 1500) * scale;

  const rads = result.radiators;
  const sRadW = (rads?.panelWidthMm || 520) * scale;
  const sRadH = Math.min((rads?.panelHeightMm || 1800) * scale, sH - 10 * scale);
  const sRadDepth = (rads?.panelDepthMm || 480) * scale;

  const skirtsCount = req.voltageHvKv >= 110 ? 10 : req.voltageHvKv >= 35 ? 7 : 4;

  const trackGaugeMm = req.powerKva >= 10000 ? 2000 : 1524;
  const sGauge = trackGaugeMm * scale;
  const hasFans = isOil ? req.oilCoolingType === 'ONAF' : req.dryCoolingType === 'AF';
  const windingConfig: WindingConfiguration = result.electrical.windingConfig || req.windingConfig || 'two_winding';

  // Радиаторы по теплосъему
  const totalRads = rads?.totalRadiators || (isOil ? 4 : 0);
  const radsRight = rads?.radiatorsRight || (isOil ? Math.min(4, Math.ceil(totalRads / 2)) : 0);
  const radsBack = rads?.radiatorsBack || (isOil ? totalRads - radsRight : 0);
  const radsLeft = rads?.radiatorsLeft || 0;

  // Количество секций для фронтального и бокового видов
  const radsCountFront = Math.max(2, Math.min(6, radsRight || Math.ceil(totalRads / 2)));
  const radsCountSide = Math.max(1, Math.min(4, Math.ceil((rads?.radiatorsPerBank || 2) / 2)));
  const radsCountTop = radsRight;

  const isEnclosedDry = !isOil && Boolean(req.enclosure && req.enclosure !== 'IP00');

  const groundY = 1040;
  const frontCenterX = 200 + 740;
  const sideCenterX = 200 + 1920;
  const topCenterY = 1580;

  return {
    scale,
    gostScaleText,
    sL,
    sW,
    sH,
    sTotL,
    sTotW,
    sTotH,
    sBhHv,
    sBhMv,
    sBhLv,
    sConsD,
    sConsL,
    sRadW,
    sRadH,
    sRadDepth,
    skirtsCount,
    groundY,
    frontCenterX,
    sideCenterX,
    topCenterY,
    isOil,
    powerKva: req.powerKva,
    voltageHvKv: req.voltageHvKv,
    voltageMvKv: req.voltageMvKv,
    voltageLvKv: req.voltageLvKv,
    voltageLv1Kv: req.voltageLv1Kv,
    voltageLv2Kv: req.voltageLv2Kv,
    windingConfig,
    windingMaterial: req.windingMaterial || 'Cu',
    trackGaugeMm,
    sGauge,
    hasFans,
    radiators: rads,
    fanSpec: rads?.fans,
    radsCountFront,
    radsCountSide,
    radsCountTop,
    radsRight,
    radsBack,
    radsLeft,
    totalRads,
    enclosure: req.enclosure,
    isEnclosedDry,
    dryCoolingType: req.dryCoolingType,
    feasibility: result.feasibility,
  };
}

/**
 * Высокоточный генератор векторных САПР-элементов по ЕСКД
 */
export class SvgCadBuilder {
  /**
   * 1. ВВОД ВЫСОКОГО НАПРЯЖЕНИЯ (ВН) — ГЛАВНЫЙ ВИД
   */
  static renderHvBushingFront(
    x: number,
    y: number,
    height: number,
    skirtsCount: number,
    angleDeg = 0
  ): string {
    const turretH = Math.max(16, height * 0.18);
    const turretTopW = 24;
    const turretBaseW = 32;
    const stemW = Math.max(8, height * 0.08);
    const capH = Math.max(12, height * 0.12);

    let skirtsSvg = '';
    const activeHeight = height - turretH - capH;
    for (let i = 0; i < skirtsCount; i++) {
      const step = (i + 0.8) / skirtsCount;
      const sy = -turretH - step * activeHeight;
      const isLarge = i % 2 === 0;
      const sw = isLarge ? Math.max(12, 22 - i * 0.9) : Math.max(9, 17 - i * 0.9);
      const skirtThick = 4.2;

      skirtsSvg += `
        <polygon points="-${sw},${sy + skirtThick} ${sw},${sy + skirtThick} ${sw - 3.5},${sy} -${sw - 3.5},${sy}" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
        <line x1="-${sw - 1}" y1="${sy + skirtThick - 0.5}" x2="${sw - 1}" y2="${sy + skirtThick - 0.5}" stroke="#000000" stroke-width="0.8" />
        <line x1="-${sw * 0.6}" y1="${sy + skirtThick * 0.5}" x2="${sw * 0.6}" y2="${sy + skirtThick * 0.5}" stroke="#555555" stroke-width="0.6" stroke-dasharray="3,2" />
      `;
    }

    const transform = angleDeg !== 0 ? `transform="translate(${x}, ${y}) rotate(${angleDeg})"` : `transform="translate(${x}, ${y})"`;

    return `
      <g ${transform}>
        <polygon points="-${turretBaseW / 2},0 ${turretBaseW / 2},0 ${turretTopW / 2},-${turretH} -${turretTopW / 2},-${turretH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
        <line x1="-${turretBaseW / 2 + 3}" y1="0" x2="${turretBaseW / 2 + 3}" y2="0" stroke="#000000" stroke-width="2.2" />
        <circle cx="-${turretBaseW / 2 - 2}" cy="-2" r="1.3" fill="#000000" />
        <circle cx="${turretBaseW / 2 - 2}" cy="-2" r="1.3" fill="#000000" />
        <line x1="-${turretTopW / 2 + 3}" y1="-${turretH}" x2="${turretTopW / 2 + 3}" y2="-${turretH}" stroke="#000000" stroke-width="2.2" />
        <rect x="-${stemW / 2}" y="-${turretH + activeHeight}" width="${stemW}" height="${activeHeight}" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        ${skirtsSvg}
        <polygon points="-${stemW / 2 + 2},-${turretH + activeHeight} ${stemW / 2 + 2},-${turretH + activeHeight} ${stemW / 2 - 1},-${turretH + activeHeight + capH} -${stemW / 2 - 1},-${turretH + activeHeight + capH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <path d="M ${turretTopW / 2} -${turretH} L ${turretTopW / 2 + 7} -${turretH} L ${turretTopW / 2 + 7} -${turretH + activeHeight * 0.35} L ${turretTopW / 2 + 3} -${turretH + activeHeight * 0.35}" fill="none" stroke="#000000" stroke-width="1.2" />
        <path d="M ${stemW / 2} -${turretH + activeHeight + capH * 0.5} L ${turretTopW / 2 + 7} -${turretH + activeHeight + capH * 0.5} L ${turretTopW / 2 + 7} -${turretH + activeHeight * 0.42} L ${turretTopW / 2 + 3} -${turretH + activeHeight * 0.42}" fill="none" stroke="#000000" stroke-width="1.2" />
        <rect x="-5" y="-${turretH + activeHeight + capH + 16}" width="10" height="16" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
        <circle cx="0" cy="-${turretH + activeHeight + capH + 11}" r="2" fill="#000000" />
        <circle cx="0" cy="-${turretH + activeHeight + capH + 5}" r="2" fill="#000000" />
        <line x1="0" y1="-${turretH + activeHeight + capH + 26}" x2="0" y2="16" stroke="#444444" stroke-width="0.8" stroke-dasharray="14, 4, 2, 4" />
      </g>
    `;
  }

  /**
   * 2. ВВОД НИЗКОГО НАПРЯЖЕНИЯ (НН) — ГЛАВНЫЙ ВИД
   */
  static renderLvBushingFront(x: number, y: number, height: number, label: string): string {
    const turretH = Math.max(10, height * 0.2);
    const stemW = 8;
    const flagW = 12;
    const flagH = 14;

    return `
      <g transform="translate(${x}, ${y})">
        <rect x="-11" y="-${turretH}" width="22" height="${turretH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <rect x="-${stemW / 2}" y="-${turretH + height * 0.5}" width="${stemW}" height="${height * 0.5}" fill="#FFFFFF" stroke="#000000" stroke-width="1.1" />
        <polygon points="-12,-${turretH + height * 0.22} 12,-${turretH + height * 0.22} 9,-${turretH + height * 0.16} -9,-${turretH + height * 0.16}" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <polygon points="-11,-${turretH + height * 0.42} 11,-${turretH + height * 0.42} 8,-${turretH + height * 0.36} -8,-${turretH + height * 0.36}" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <rect x="-${flagW / 2}" y="-${turretH + height * 0.5 + flagH}" width="${flagW}" height="${flagH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <circle cx="-2.5" cy="-${turretH + height * 0.5 + flagH * 0.5}" r="1.5" fill="#000000" />
        <circle cx="2.5" cy="-${turretH + height * 0.5 + flagH * 0.5}" r="1.5" fill="#000000" />
        <text x="0" y="-${turretH + height * 0.5 + flagH + 4}" text-anchor="middle" font-size="12" font-weight="bold" font-family="sans-serif" fill="#000000">${label}</text>
        <line x1="0" y1="-${turretH + height * 0.5 + flagH + 14}" x2="0" y2="12" stroke="#444444" stroke-width="0.7" stroke-dasharray="10, 3, 2, 3" />
      </g>
    `;
  }

  /**
   * 2.1. ВВОД СРЕДНЕГО НАПРЯЖЕНИЯ (СН) — ГЛАВНЫЙ ВИД
   */
  static renderMvBushingFront(
    x: number,
    y: number,
    height: number,
    label: string,
    angleDeg = 0
  ): string {
    const turretH = Math.max(12, height * 0.16);
    const turretTopW = 20;
    const turretBaseW = 26;
    const stemW = Math.max(7, height * 0.075);
    const capH = Math.max(10, height * 0.1);
    const skirtsCount = 5;

    let skirtsSvg = '';
    const activeHeight = height - turretH - capH;
    for (let i = 0; i < skirtsCount; i++) {
      const step = (i + 0.8) / skirtsCount;
      const sy = -turretH - step * activeHeight;
      const sw = Math.max(8, 16 - i * 0.8);
      skirtsSvg += `
        <polygon points="-${sw},${sy + 3.5} ${sw},${sy + 3.5} ${sw - 2.5},${sy} -${sw - 2.5},${sy}" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
        <line x1="-${sw - 1}" y1="${sy + 3}" x2="${sw - 1}" y2="${sy + 3}" stroke="#000000" stroke-width="0.7" />
      `;
    }

    const transform = angleDeg !== 0 ? `transform="translate(${x}, ${y}) rotate(${angleDeg})"` : `transform="translate(${x}, ${y})"`;

    return `
      <g ${transform}>
        <polygon points="-${turretBaseW / 2},0 ${turretBaseW / 2},0 ${turretTopW / 2},-${turretH} -${turretTopW / 2},-${turretH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <line x1="-${turretBaseW / 2 + 2}" y1="0" x2="${turretBaseW / 2 + 2}" y2="0" stroke="#000000" stroke-width="1.8" />
        <circle cx="-${turretBaseW / 2 - 2}" cy="-2" r="1.1" fill="#000000" />
        <circle cx="${turretBaseW / 2 - 2}" cy="-2" r="1.1" fill="#000000" />
        <rect x="-${stemW / 2}" y="-${turretH + activeHeight}" width="${stemW}" height="${activeHeight}" fill="#FFFFFF" stroke="#000000" stroke-width="1.1" />
        ${skirtsSvg}
        <polygon points="-${stemW / 2 + 1.5},-${turretH + activeHeight} ${stemW / 2 + 1.5},-${turretH + activeHeight} ${stemW / 2},-${turretH + activeHeight + capH} -${stemW / 2},-${turretH + activeHeight + capH}" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
        <rect x="-4.5" y="-${turretH + activeHeight + capH + 13}" width="9" height="13" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <circle cx="0" cy="-${turretH + activeHeight + capH + 6}" r="1.5" fill="#000000" />
        <text x="0" y="-${turretH + activeHeight + capH + 17}" text-anchor="middle" font-size="11" font-weight="bold" font-family="sans-serif" fill="#000000">${label}</text>
        <line x1="0" y1="-${turretH + activeHeight + capH + 24}" x2="0" y2="12" stroke="#444444" stroke-width="0.7" stroke-dasharray="10, 3, 2, 3" />
      </g>
    `;
  }

  /**
   * 3. РАСШИРИТЕЛЬНЫЙ БАК (CONSERVATOR) — ГЛАВНЫЙ ВИД
   */
  static renderConservatorFront(
    x: number,
    y: number,
    diameter: number,
    tankTopY: number,
    tankH: number
  ): string {
    const r = diameter / 2;
    const cy = -diameter * 0.85 - 32;

    return `
      <g transform="translate(${x}, ${y})">
        <line x1="0" y1="0" x2="0" y2="${cy}" stroke="#000000" stroke-width="2.6" />
        <line x1="0" y1="${cy * 0.45}" x2="-22" y2="${cy * 0.78}" stroke="#000000" stroke-width="2" />
        <polygon points="-22,${cy * 0.78} 0,${cy * 0.45} 0,${cy * 0.78}" fill="#E2E8F0" stroke="#000000" stroke-width="1.2" />
        <line x1="-28" y1="0" x2="8" y2="0" stroke="#000000" stroke-width="2.5" />
        <circle cx="-20" cy="-3" r="1.5" fill="#000000" />
        <circle cx="0" cy="-3" r="1.5" fill="#000000" />
        <circle cx="0" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
        <circle cx="0" cy="${cy}" r="${r - 4}" fill="none" stroke="#000000" stroke-width="1.1" stroke-dasharray="10, 4" />
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const bx = Math.cos(rad) * (r - 7);
          const by = cy + Math.sin(rad) * (r - 7);
          return `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="1.8" fill="#000000" />`;
        }).join('')}
        <circle cx="0" cy="${cy}" r="${r * 0.46}" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <circle cx="0" cy="${cy}" r="${r * 0.36}" fill="none" stroke="#000000" stroke-width="0.9" />
        <line x1="-${r * 0.26}" y1="${cy - r * 0.15}" x2="-${r * 0.34}" y2="${cy - r * 0.2}" stroke="#000000" stroke-width="1.4" />
        <line x1="0" y1="${cy - r * 0.28}" x2="0" y2="${cy - r * 0.36}" stroke="#000000" stroke-width="1.8" />
        <line x1="${r * 0.26}" y1="${cy - r * 0.15}" x2="${r * 0.34}" y2="${cy - r * 0.2}" stroke="#000000" stroke-width="1.4" />
        <line x1="0" y1="${cy}" x2="${r * 0.25}" y2="${cy - r * 0.22}" stroke="#000000" stroke-width="2.2" />
        <circle cx="0" cy="${cy}" r="2.8" fill="#000000" />
        <path d="M 0 ${cy + r * 0.6} L 0 -22 L 52 -22 L 52 0" fill="none" stroke="#000000" stroke-width="3" />
        <line x1="12" y1="-27" x2="12" y2="-17" stroke="#000000" stroke-width="2.2" />
        <line x1="42" y1="-27" x2="42" y2="-17" stroke="#000000" stroke-width="2.2" />
        <line x1="12" y1="-27" x2="16" y2="-32" stroke="#000000" stroke-width="1.5" />
        <circle cx="16" cy="-32" r="2" fill="#000000" />
        <rect x="18" y="-31" width="20" height="18" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <circle cx="28" cy="-22" r="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
        <circle cx="28" cy="-22" r="2.5" fill="#000000" />
        <path d="M 24 -22 L 32 -22 M 29 -25 L 32 -22 L 29 -19" fill="none" stroke="#000000" stroke-width="1.2" />
        <path d="M -${r * 0.55} ${cy} L -${r * 0.55} 55" fill="none" stroke="#000000" stroke-width="2" />
        <rect x="-${r * 0.55 + 5}" y="12" width="10" height="4" fill="#000000" />
        <rect x="-${r * 0.55 + 5}" y="38" width="10" height="4" fill="#000000" />
        <rect x="-${r * 0.55 + 7}" y="55" width="14" height="48" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        ${Array.from({ length: 6 }).map((_, i) => `
          <circle cx="-${r * 0.55 - 2 + (i % 3) * 3}" cy="${64 + i * 6}" r="1.3" fill="#555555" />
          <circle cx="-${r * 0.55 + 3 - (i % 2) * 3}" cy="${67 + i * 6}" r="1.3" fill="#555555" />
        `).join('')}
        <rect x="-${r * 0.55 + 9}" y="103" width="18" height="15" rx="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <line x1="-${r * 0.55 - 6}" y1="110" x2="-${r * 0.55 + 6}" y2="110" stroke="#000000" stroke-width="1.2" stroke-dasharray="2,2" />
      </g>
    `;
  }

  /**
   * 4. РАСШИРИТЕЛЬНЫЙ БАК — ВИД СБОКУ
   */
  static renderConservatorSide(
    x: number,
    y: number,
    length: number,
    diameter: number
  ): string {
    const cy = -diameter * 0.85 - 32;
    const dishW = diameter * 0.18;

    return `
      <g transform="translate(${x}, ${y})">
        <line x1="${length * 0.22}" y1="0" x2="${length * 0.22}" y2="${cy + diameter}" stroke="#000000" stroke-width="2.6" />
        <line x1="${length * 0.78}" y1="0" x2="${length * 0.78}" y2="${cy + diameter}" stroke="#000000" stroke-width="2.6" />
        <path d="M ${length * 0.22 - 14} ${cy + diameter} Q ${length * 0.22} ${cy + diameter - 6} ${length * 0.22 + 14} ${cy + diameter}" fill="none" stroke="#000000" stroke-width="2.2" />
        <path d="M ${length * 0.78 - 14} ${cy + diameter} Q ${length * 0.78} ${cy + diameter - 6} ${length * 0.78 + 14} ${cy + diameter}" fill="none" stroke="#000000" stroke-width="2.2" />
        <rect x="${dishW}" y="${cy}" width="${length - 2 * dishW}" height="${diameter}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
        <path d="M ${dishW} ${cy} C 0 ${cy} 0 ${cy + diameter} ${dishW} ${cy + diameter}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
        <path d="M ${length - dishW} ${cy} C ${length} ${cy} ${length} ${cy + diameter} ${length - dishW} ${cy + diameter}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
        <line x1="${length * 0.28}" y1="${cy}" x2="${length * 0.28}" y2="${cy + diameter}" stroke="#000000" stroke-width="1.2" stroke-dasharray="8,3" />
        <line x1="${length * 0.72}" y1="${cy}" x2="${length * 0.72}" y2="${cy + diameter}" stroke="#000000" stroke-width="1.2" stroke-dasharray="8,3" />
        <rect x="${length * 0.5 - 12}" y="${cy - 12}" width="24" height="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <line x1="${length * 0.5 - 16}" y1="${cy - 12}" x2="${length * 0.5 + 16}" y2="${cy - 12}" stroke="#000000" stroke-width="2.2" />
        <circle cx="${length * 0.5 - 10}" cy="${cy - 10}" r="1.4" fill="#000000" />
        <circle cx="${length * 0.5 + 10}" cy="${cy - 10}" r="1.4" fill="#000000" />
        <line x1="-15" y1="${cy + diameter / 2}" x2="${length + 15}" y2="${cy + diameter / 2}" stroke="#444444" stroke-width="0.8" stroke-dasharray="14, 4, 2, 4" />
      </g>
    `;
  }

  /**
   * 5. РАДИАТОРНЫЕ БАТАРЕИ — ГЛАВНЫЙ ВИД (ПО ТЕПЛОСЪЕМУ И ВЕНТИЛЯТОРАМ)
   * Динамическое количество расчетных колонок радиаторов с коллекторами,
   * запорными заслонками и нижними вентиляторами обдува 2ДМ-450 с восходящим потоком
   */
  static renderRadiatorFront(
    x: number,
    y: number,
    colW: number,
    height: number,
    count = 2,
    hasFans = true,
    fanSpec?: FanSpecification
  ): string {
    const singleW = Math.max(22, Math.min(38, colW * 0.85));
    const gap = 8;
    let radSvg = '';

    for (let c = 0; c < count; c++) {
      const cx = c * (singleW + gap);
      const finCount = 6;

      let finsSvg = '';
      for (let f = 1; f < finCount; f++) {
        const fx = cx + (f * singleW) / finCount;
        finsSvg += `
          <line x1="${fx}" y1="6" x2="${fx}" y2="${height - 6}" stroke="#000000" stroke-width="1" />
          <line x1="${fx - 1.5}" y1="18" x2="${fx + 1.5}" y2="22" stroke="#444444" stroke-width="0.7" />
          <line x1="${fx - 1.5}" y1="${height * 0.5}" x2="${fx + 1.5}" y2="${height * 0.5 + 4}" stroke="#444444" stroke-width="0.7" />
          <line x1="${fx - 1.5}" y1="${height - 24}" x2="${fx + 1.5}" y2="${height - 20}" stroke="#444444" stroke-width="0.7" />
        `;
      }

      // Нижний вентилятор 2ДМ-450 под колонкой радиаторов (при ONAF) или опорный кронштейн (при ONAN)
      const fanSvg = hasFans ? `
        <g transform="translate(${cx + singleW / 2}, ${height})">
          <!-- Стойки подвеса диффузора к нижнему коллектору -->
          <line x1="-12" y1="0" x2="-12" y2="7" stroke="#000000" stroke-width="1.5" />
          <line x1="12" y1="0" x2="12" y2="7" stroke="#000000" stroke-width="1.5" />
          <!-- Конический диффузор вентилятора 2ДМ-450 -->
          <polygon points="-18,7 18,7 14,24 -14,24" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <!-- Электродвигатель в центре ступицы -->
          <circle cx="0" cy="15.5" r="4.2" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
          <circle cx="0" cy="15.5" r="1.6" fill="#000000" />
          <!-- 4 лопасти крыльчатки -->
          <line x1="-10" y1="15.5" x2="10" y2="15.5" stroke="#000000" stroke-width="1.2" />
          <line x1="0" y1="5.5" x2="0" y2="25.5" stroke="#000000" stroke-width="1.2" />
          <!-- Защитная сетка диффузора -->
          <circle cx="0" cy="15.5" r="9" fill="none" stroke="#555555" stroke-width="0.7" stroke-dasharray="3,2" />
          <!-- Вектор восходящего потока воздуха (стрелки вверх) -->
          <path d="M -6 4 L -6 -8 M -8 -4 L -6 -8 L -4 -4" fill="none" stroke="#2563EB" stroke-width="1.1" />
          <path d="M 6 4 L 6 -8 M 4 -4 L 6 -8 L 8 -4" fill="none" stroke="#2563EB" stroke-width="1.1" />
        </g>
      ` : `
        <g transform="translate(${cx + singleW / 2}, ${height})">
          <polygon points="-8,0 8,0 6,8 -6,8" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
          <line x1="-12" y1="8" x2="12" y2="8" stroke="#000000" stroke-width="1.6" />
        </g>
      `;

      radSvg += `
        <g>
          <!-- Контур секции радиатора -->
          <rect x="${cx}" y="0" width="${singleW}" height="${height}" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
          ${finsSvg}
          <!-- Поперечные усиливающие стяжки -->
          <line x1="${cx}" y1="${height * 0.33}" x2="${cx + singleW}" y2="${height * 0.33}" stroke="#000000" stroke-width="1.1" />
          <line x1="${cx}" y1="${height * 0.67}" x2="${cx + singleW}" y2="${height * 0.67}" stroke="#000000" stroke-width="1.1" />
          ${fanSvg}
        </g>
      `;
    }

    const totalBankW = count * (singleW + gap) - gap;

    return `
      <g transform="translate(${x}, ${y})">
        <!-- Верхний горизонтальный трубный коллектор с дисковым затвором к баку -->
        <path d="M -16 14 L 0 14" fill="none" stroke="#000000" stroke-width="3" />
        <rect x="-10" y="8" width="6" height="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <circle cx="-7" cy="4" r="2.2" fill="#000000" />
        <line x1="0" y1="14" x2="${totalBankW}" y2="14" stroke="#000000" stroke-width="2.5" />

        <!-- Нижний горизонтальный трубный коллектор с дисковым затвором -->
        <path d="M -16 ${height - 14} L 0 ${height - 14}" fill="none" stroke="#000000" stroke-width="3" />
        <rect x="-10" y="${height - 20}" width="6" height="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <circle cx="-7" cy="${height - 24}" r="2.2" fill="#000000" />
        <line x1="0" y1="${height - 14}" x2="${totalBankW}" y2="${height - 14}" stroke="#000000" stroke-width="2.5" />

        ${radSvg}
      </g>
    `;
  }

  /**
   * 5.1. РАДИАТОРНАЯ БАТАРЕЯ — ВИД СБОКУ (ПРОФИЛЬ ПО ТЕПЛОСЪЕМУ)
   */
  static renderRadiatorSide(
    x: number,
    y: number,
    radDepth: number,
    height: number,
    hasFans = true,
    fanSpec?: FanSpecification
  ): string {
    const depth = Math.max(30, Math.min(65, radDepth));
    return `
      <g transform="translate(${x}, ${y})">
        <!-- Верхний и нижний патрубки подключения к баку с фланцами -->
        <line x1="-12" y1="14" x2="6" y2="14" stroke="#000000" stroke-width="3.2" />
        <rect x="-4" y="8" width="5" height="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <line x1="-12" y1="${height - 14}" x2="6" y2="${height - 14}" stroke="#000000" stroke-width="3.2" />
        <rect x="-4" y="${height - 20}" width="5" height="12" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />

        <!-- Верхний и нижний коллекторы в профиль -->
        <circle cx="16" cy="14" r="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        <circle cx="16" cy="${height - 14}" r="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />

        <!-- Пакет пластин радиатора в профиль -->
        <rect x="6" y="6" width="${depth}" height="${height - 12}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <line x1="${6 + depth * 0.33}" y1="6" x2="${6 + depth * 0.33}" y2="${height - 6}" stroke="#000000" stroke-width="1.2" />
        <line x1="${6 + depth * 0.67}" y1="6" x2="${6 + depth * 0.67}" y2="${height - 6}" stroke="#000000" stroke-width="1.2" />

        <!-- Вентилятор обдува снизу в профиль (ONAF) или опора (ONAN) -->
        ${hasFans ? `
          <g>
            <polygon points="10,${height} ${6 + depth - 4},${height} ${6 + depth - 8},${height + 20} 14,${height + 20}" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
            <circle cx="${6 + depth / 2}" cy="${height + 10}" r="4.2" fill="#000000" />
            <line x1="16" y1="${height + 10}" x2="${6 + depth - 10}" y2="${height + 10}" stroke="#000000" stroke-width="1.3" />
            <!-- Стрелка восходящего потока -->
            <path d="M ${6 + depth / 2} ${height - 4} L ${6 + depth / 2} ${height - 20} M ${6 + depth / 2 - 3} ${height - 15} L ${6 + depth / 2} ${height - 20} L ${6 + depth / 2 + 3} ${height - 15}" fill="none" stroke="#2563EB" stroke-width="1.2" />
          </g>
        ` : `
          <g>
            <line x1="12" y1="${height}" x2="${6 + depth - 6}" y2="${height}" stroke="#000000" stroke-width="2" />
            <line x1="${6 + depth / 2}" y1="${height}" x2="${6 + depth / 2}" y2="${height + 12}" stroke="#000000" stroke-width="1.8" />
            <line x1="${6 + depth / 2 - 10}" y1="${height + 12}" x2="${6 + depth / 2 + 10}" y2="${height + 12}" stroke="#000000" stroke-width="2.2" />
          </g>
        `}
      </g>
    `;
  }

  /**
   * 5.2. РАДИАТОРНАЯ БАТАРЕЯ — ВИД СВЕРХУ (ПЛАН ПО ТЕПЛОСЪЕМУ)
   */
  static renderRadiatorTop(
    x: number,
    y: number,
    count: number,
    colW: number,
    radDepth: number,
    hasFans = true,
    fanSpec?: FanSpecification
  ): string {
    const singleW = Math.max(22, Math.min(38, colW * 0.85));
    const gap = 8;
    const depth = Math.max(35, Math.min(65, radDepth));
    let topSvg = '';

    for (let c = 0; c < count; c++) {
      const cx = c * (singleW + gap);
      topSvg += `
        <g>
          <!-- Контур радиаторной секции в плане -->
          <rect x="${cx}" y="0" width="${singleW}" height="${depth}" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
          <!-- Пластины теплообмена (продольные ребра) -->
          ${Array.from({ length: 5 }).map((_, f) => {
            const py = 6 + (f * (depth - 12)) / 4;
            return `<line x1="${cx + 3}" y1="${py}" x2="${cx + singleW - 3}" y2="${py}" stroke="#000000" stroke-width="1" />`;
          }).join('')}
          <!-- Окружность вентилятора снизу (при ONAF) -->
          ${hasFans ? `
            <circle cx="${cx + singleW / 2}" cy="${depth / 2}" r="${Math.min(singleW, depth) * 0.42}" fill="none" stroke="#2563EB" stroke-width="1.3" stroke-dasharray="5,3" />
            <line x1="${cx + singleW / 2 - 8}" y1="${depth / 2}" x2="${cx + singleW / 2 + 8}" y2="${depth / 2}" stroke="#2563EB" stroke-width="1" />
            <line x1="${cx + singleW / 2}" y1="${depth / 2 - 8}" x2="${cx + singleW / 2}" y2="${depth / 2 + 8}" stroke="#2563EB" stroke-width="1" />
          ` : ''}
        </g>
      `;
    }

    const totalW = count * (singleW + gap) - gap;

    return `
      <g transform="translate(${x}, ${y})">
        <!-- Соединительный коллектор к стенке бака -->
        <line x1="0" y1="-10" x2="0" y2="0" stroke="#000000" stroke-width="2.6" />
        <line x1="${totalW}" y1="-10" x2="${totalW}" y2="0" stroke="#000000" stroke-width="2.6" />
        ${topSvg}
      </g>
    `;
  }

  /**
   * 6. БАК МАСЛЯНОГО ТРАНСФОРМАТОРА — ГЛАВНЫЙ ВИД
   */
  static renderTankFront(
    w: number,
    h: number,
    isOil: boolean,
    powerKva: number
  ): string {
    const flangeH = 10;
    const manholeR = Math.max(14, Math.min(22, w * 0.035));

    return `
      <rect x="0" y="${-h}" width="${w}" height="${h}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
      <rect x="-12" y="${-h - flangeH}" width="${w + 24}" height="${flangeH}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
      ${Array.from({ length: 18 }).map((_, i) => {
        const bx = -7 + (i * (w + 14)) / 17;
        return `<circle cx="${bx.toFixed(1)}" cy="${-h - flangeH / 2}" r="1.7" fill="#000000" />`;
      }).join('')}
      <rect x="0" y="${-h + h * 0.32}" width="${w}" height="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <rect x="0" y="${-h + h * 0.68}" width="${w}" height="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <line x1="${w * 0.22}" y1="${-h}" x2="${w * 0.22}" y2="0" stroke="#000000" stroke-width="1.4" />
      <line x1="${w * 0.78}" y1="${-h}" x2="${w * 0.78}" y2="0" stroke="#000000" stroke-width="1.4" />
      <g>
        <path d="M 22 ${-h} L 22 ${-h - 22} A 9 9 0 0 1 40 ${-h - 22} L 40 ${-h}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <circle cx="31" cy="${-h - 14}" r="4.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <path d="M ${w - 40} ${-h} L ${w - 40} ${-h - 22} A 9 9 0 0 1 ${w - 22} ${-h - 22} L ${w - 22} ${-h}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <circle cx="${w - 31}" cy="${-h - 14}" r="4.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
      </g>
      <polygon points="4,-18 28,-18 28,-2 4,-2" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <polygon points="${w - 28},-18 ${w - 4},-18 ${w - 4},-2 ${w - 28},-2" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
      <circle cx="${w * 0.35}" cy="${-h + h * 0.2}" r="${manholeR}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
      <circle cx="${w * 0.35}" cy="${-h + h * 0.2}" r="${manholeR - 3.5}" fill="none" stroke="#000000" stroke-width="1" stroke-dasharray="6,3" />
      <circle cx="${w * 0.35}" cy="${-h + h * 0.2}" r="3" fill="#000000" />
      <circle cx="${w * 0.52}" cy="${-h + h * 0.2}" r="${manholeR}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
      <circle cx="${w * 0.52}" cy="${-h + h * 0.2}" r="${manholeR - 3.5}" fill="none" stroke="#000000" stroke-width="1" stroke-dasharray="6,3" />
      <circle cx="${w * 0.52}" cy="${-h + h * 0.2}" r="3" fill="#000000" />
      <g transform="translate(${w * 0.28}, ${-h + h * 0.38})">
        <rect x="0" y="0" width="${w * 0.36}" height="${h * 0.44}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <polygon points="-4,0 ${w * 0.36 + 4},0 ${w * 0.36},-5 0,-5" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <line x1="${w * 0.18}" y1="3" x2="${w * 0.18}" y2="${h * 0.44 - 3}" stroke="#000000" stroke-width="1.3" />
        <rect x="3" y="3" width="${w * 0.36 - 6}" height="${h * 0.44 - 6}" fill="none" stroke="#000000" stroke-width="1" />
        <rect x="${w * 0.18 - 6}" y="${h * 0.22}" width="4" height="12" rx="1" fill="#000000" />
        <rect x="${w * 0.18 + 2}" y="${h * 0.22}" width="4" height="12" rx="1" fill="#000000" />
        ${Array.from({ length: 4 }).map((_, j) => `
          <line x1="8" y1="${h * 0.44 - 20 + j * 4}" x2="${w * 0.15}" y2="${h * 0.44 - 20 + j * 4}" stroke="#000000" stroke-width="1.2" />
          <line x1="${w * 0.21}" y1="${h * 0.44 - 20 + j * 4}" x2="${w * 0.36 - 8}" y2="${h * 0.44 - 20 + j * 4}" stroke="#000000" stroke-width="1.2" />
        `).join('')}
      </g>
      <rect x="${w * 0.68}" y="${-h + h * 0.38}" width="${w * 0.18}" height="${h * 0.18}" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
      <line x1="${w * 0.68 + 4}" y1="${-h + h * 0.43}" x2="${w * 0.86 - 4}" y2="${-h + h * 0.43}" stroke="#555555" stroke-width="0.8" />
      <line x1="${w * 0.68 + 4}" y1="${-h + h * 0.48}" x2="${w * 0.86 - 4}" y2="${-h + h * 0.48}" stroke="#555555" stroke-width="0.8" />
      <g transform="translate(${w * 0.72}, -14)">
        <rect x="0" y="0" width="16" height="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <circle cx="8" cy="4" r="2" fill="#000000" />
        <line x1="22" y1="4" x2="34" y2="4" stroke="#000000" stroke-width="1.4" />
        <line x1="25" y1="8" x2="31" y2="8" stroke="#000000" stroke-width="1.2" />
        <line x1="27" y1="11" x2="29" y2="11" stroke="#000000" stroke-width="1" />
      </g>
      <g transform="translate(${w * 0.84}, -18)">
        <rect x="0" y="0" width="14" height="10" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <circle cx="7" cy="5" r="2.5" fill="#000000" />
        <line x1="14" y1="-2" x2="14" y2="12" stroke="#000000" stroke-width="2" />
      </g>
    `;
  }

  /**
   * 7. СУХОЙ ТРАНСФОРМАТОР — ГЛАВНЫЙ ВИД (ТСЛ / ТСЗЛ / ТСВБ)
   * Реалистичная прорисовка:
   * - IP00: 3 цилиндрические литые обмотки (фазы A, B, C) с внутренними охлаждающими каналами,
   *   верхняя и нижняя ярмовые балки из прокатного швеллера, стяжные шпильки,
   *   перемычки ПБВ, медные выводы НН, тангенциальные вентиляторы AF, блок ТР-100
   * - IP21/IP31: защитный металлокаркасный кожух с жалюзийными решетками, прозрачным
   *   смотровым окном из поликарбоната, замками дверей и крышными вводами
   */
  static renderDryTransformerFront(
    w: number,
    h: number,
    isEnclosed: boolean,
    hasFans: boolean,
    powerKva: number,
    windingMaterial: WindingMaterial = 'Cu'
  ): string {
    if (!isEnclosed) {
      // Исполнение IP00 (открытый сухой силовой трансформатор)
      const beamH = Math.max(16, h * 0.08);
      const coilW = w * 0.25;
      const coilH = h - 2 * beamH - 24;
      const coilY = -beamH - 12;

      // 3 литые фазы A, B, C
      const coilsSvg = [0, 1, 2].map((i) => {
        const cx = w * (0.20 + i * 0.30);
        const phaseLetter = i === 0 ? 'A' : i === 1 ? 'B' : 'C';
        return `
          <g transform="translate(${cx - coilW / 2}, ${coilY})">
            <!-- Литой эпоксидный цилиндр обмотки фазы ${phaseLetter} -->
            <rect x="0" y="-${coilH}" width="${coilW}" height="${coilH}" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="2.4" />
            <!-- Внутренние концентрические каналы охлаждения (вертикальные каналы) -->
            <line x1="${coilW * 0.2}" y1="-${coilH - 8}" x2="${coilW * 0.2}" y2="-8" stroke="#000000" stroke-width="1.2" stroke-dasharray="8,4" />
            <line x1="${coilW * 0.8}" y1="-${coilH - 8}" x2="${coilW * 0.8}" y2="-8" stroke="#000000" stroke-width="1.2" stroke-dasharray="8,4" />
            
            <!-- Перемычки регулирования напряжения ПБВ (±2х2.5%) на лицевой стороне фазы -->
            <rect x="${coilW * 0.35}" y="-${coilH * 0.58}" width="${coilW * 0.3}" height="${coilH * 0.22}" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
            <circle cx="${coilW * 0.42}" cy="-${coilH * 0.52}" r="1.8" fill="#000000" />
            <circle cx="${coilW * 0.58}" cy="-${coilH * 0.52}" r="1.8" fill="#000000" />
            <line x1="${coilW * 0.42}" y1="-${coilH * 0.52}" x2="${coilW * 0.58}" y2="-${coilH * 0.52}" stroke="#000000" stroke-width="2" />
            <circle cx="${coilW * 0.42}" cy="-${coilH * 0.42}" r="1.8" fill="#000000" />
            <circle cx="${coilW * 0.58}" cy="-${coilH * 0.42}" r="1.8" fill="#000000" />
            <text x="${coilW * 0.5}" y="-${coilH * 0.45}" text-anchor="middle" font-size="9" font-family="sans-serif" font-weight="bold" fill="#000000">ПБВ</text>

            <!-- Маркировка фазы -->
            <circle cx="${coilW * 0.5}" cy="-${coilH * 0.15}" r="8" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
            <text x="${coilW * 0.5}" y="-${coilH * 0.15 - 3}" text-anchor="middle" font-size="10" font-weight="bold" font-family="sans-serif" fill="#000000">${phaseLetter}</text>
          </g>
        `;
      }).join('');

      return `
        <!-- ЯРМОВЫЕ БАЛКИ МАГНИТОПРОВОДА СУХОГО ТРАНСФОРМАТОРА (ШВЕЛЛЕР) -->
        <!-- Нижняя ярмовая балка -->
        <rect x="10" y="-${beamH}" width="${w - 20}" height="${beamH}" fill="#FFFFFF" stroke="#000000" stroke-width="2.2" />
        <line x1="10" y1="-${beamH * 0.5}" x2="${w - 10}" y2="-${beamH * 0.5}" stroke="#000000" stroke-width="1.2" />
        <!-- Опорные упоры под катки -->
        <polygon points="20,-${beamH} 45,-${beamH} 45,-2 20,-2" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <polygon points="${w - 45},-${beamH} ${w - 20},-${beamH} ${w - 20},-2 ${w - 45},-2" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />

        <!-- Верхняя ярмовая балка с отверстиями для строповки -->
        <rect x="10" y="-${h}" width="${w - 20}" height="${beamH}" fill="#FFFFFF" stroke="#000000" stroke-width="2.2" />
        <line x1="10" y1="-${h + beamH * 0.5}" x2="${w - 10}" y2="-${h + beamH * 0.5}" stroke="#000000" stroke-width="1.2" />
        <circle cx="35" cy="-${h - beamH * 0.5}" r="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
        <circle cx="${w - 35}" cy="-${h - beamH * 0.5}" r="5" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />

        <!-- Вертикальные стяжные изолированные шпильки магнитопровода -->
        <line x1="${w * 0.08}" y1="-${h}" x2="${w * 0.08}" y2="-${beamH}" stroke="#000000" stroke-width="2.4" />
        <rect x="${w * 0.08 - 4}" y="-${h + 5}" width="8" height="5" fill="#000000" />
        <rect x="${w * 0.08 - 4}" y="-${beamH}" width="8" height="5" fill="#000000" />
        <line x1="${w * 0.92}" y1="-${h}" x2="${w * 0.92}" y2="-${beamH}" stroke="#000000" stroke-width="2.4" />
        <rect x="${w * 0.92 - 4}" y="-${h + 5}" width="8" height="5" fill="#000000" />
        <rect x="${w * 0.92 - 4}" y="-${beamH}" width="8" height="5" fill="#000000" />

        <!-- 3 литые фазы A, B, C -->
        ${coilsSvg}

        <!-- Медная ошиновка НН (шины сверху с изгибом) -->
        <path d="M ${w * 0.20} -${h - beamH} L ${w * 0.20} -${h + 20} L ${w * 0.16} -${h + 20}" fill="none" stroke="#000000" stroke-width="3" />
        <path d="M ${w * 0.50} -${h - beamH} L ${w * 0.50} -${h + 26} L ${w * 0.46} -${h + 26}" fill="none" stroke="#000000" stroke-width="3" />
        <path d="M ${w * 0.80} -${h - beamH} L ${w * 0.80} -${h + 20} L ${w * 0.76} -${h + 20}" fill="none" stroke="#000000" stroke-width="3" />

        <!-- Тангенциальные вентиляторы принудительного обдува AF снизу под обмотками -->
        ${hasFans ? `
          <g transform="translate(15, -${beamH + 12})">
            <!-- Блок вентиляторов BAR-400 / TG-60 -->
            <rect x="0" y="0" width="${w - 30}" height="12" rx="2" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.8" />
            ${Array.from({ length: 12 }).map((_, bi) => {
              const bx = 10 + (bi * (w - 50)) / 11;
              return `<line x1="${bx}" y1="2" x2="${bx + 4}" y2="10" stroke="#2563EB" stroke-width="1.3" />`;
            }).join('')}
            <!-- Восходящий вектор воздушного потока AF -->
            <path d="M ${w * 0.22} 0 L ${w * 0.22} -14 M ${w * 0.22 - 3} -9 L ${w * 0.22} -14 L ${w * 0.22 + 3} -9" fill="none" stroke="#2563EB" stroke-width="1.4" />
            <path d="M ${w * 0.50} 0 L ${w * 0.50} -14 M ${w * 0.50 - 3} -9 L ${w * 0.50} -14 L ${w * 0.50 + 3} -9" fill="none" stroke="#2563EB" stroke-width="1.4" />
            <path d="M ${w * 0.78} 0 L ${w * 0.78} -14 M ${w * 0.78 - 3} -9 L ${w * 0.78} -14 L ${w * 0.78 + 3} -9" fill="none" stroke="#2563EB" stroke-width="1.4" />
            <text x="${w * 0.5}" y="-16" text-anchor="middle" font-size="10" font-family="sans-serif" font-weight="bold" fill="#2563EB">AF ОБДУВ (TG-60)</text>
          </g>
        ` : ''}

        <!-- Микропроцессорный блок тепловой защиты ТР-100 с дисплеем -->
        <g transform="translate(${w * 0.72}, -${beamH - 2})">
          <rect x="0" y="0" width="34" height="20" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <rect x="4" y="3" width="18" height="9" fill="#000000" />
          <text x="13" y="10" text-anchor="middle" font-size="7" font-family="monospace" fill="#00FF00">82°</text>
          <circle cx="28" cy="8" r="2" fill="#EF4444" />
          <text x="17" y="17" text-anchor="middle" font-size="7" font-weight="bold" font-family="sans-serif" fill="#000000">ТР-100</text>
        </g>
      `;
    } else {
      // Исполнение в защитном металлическом кожухе IP21 / IP31
      return `
        <!-- ЗАЩИТНЫЙ МЕТАЛЛИЧЕСКИЙ КОЖУХ СУХОГО ТРАНСФОРМАТОРА (IP21 / IP31) -->
        <rect x="0" y="-${h}" width="${w}" height="${h}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
        
        <!-- Верхняя крышка с козырьком от капель (IP21) и вентиляцией -->
        <polygon points="-8,-${h} ${w + 8},-${h} ${w + 4},-${h - 8} -4,-${h - 8}" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
        
        <!-- Стык двухстворчатых дверей по центру -->
        <line x1="${w * 0.5}" y1="-${h - 8}" x2="${w * 0.5}" y2="-6" stroke="#000000" stroke-width="1.6" />
        <rect x="4" y="-${h - 8}" width="${w - 8}" height="${h - 14}" fill="none" stroke="#000000" stroke-width="1" />
        
        <!-- Ручки-замки дверей -->
        <rect x="${w * 0.5 - 7}" y="-${h * 0.5}" width="4" height="14" rx="1" fill="#000000" />
        <rect x="${w * 0.5 + 3}" y="-${h * 0.5}" width="4" height="14" rx="1" fill="#000000" />

        <!-- Верхние жалюзийные решетки вентиляции -->
        ${Array.from({ length: 5 }).map((_, j) => `
          <line x1="16" y1="-${h - 22 - j * 5}" x2="${w * 0.44}" y2="-${h - 22 - j * 5}" stroke="#000000" stroke-width="1.3" />
          <line x1="${w * 0.56}" y1="-${h - 22 - j * 5}" x2="${w - 16}" y2="-${h - 22 - j * 5}" stroke="#000000" stroke-width="1.3" />
        `).join('')}

        <!-- Прозрачное смотровое окно из поликарбоната для контроля фаз A, B, C -->
        <rect x="${w * 0.22}" y="-${h * 0.68}" width="${w * 0.56}" height="${h * 0.28}" rx="3" fill="#F8FAFC" stroke="#000000" stroke-width="1.8" />
        <!-- Внутренние контуры фаз A, B, C, видимые через окно -->
        <rect x="${w * 0.26}" y="-${h * 0.65}" width="${w * 0.12}" height="${h * 0.22}" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.1" stroke-dasharray="4,2" />
        <rect x="${w * 0.44}" y="-${h * 0.65}" width="${w * 0.12}" height="${h * 0.22}" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.1" stroke-dasharray="4,2" />
        <rect x="${w * 0.62}" y="-${h * 0.65}" width="${w * 0.12}" height="${h * 0.22}" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.1" stroke-dasharray="4,2" />
        <text x="${w * 0.5}" y="-${h * 0.70}" text-anchor="middle" font-size="10" font-family="sans-serif" font-weight="bold" fill="#555555">СМОТРОВОЕ ОКНО</text>

        <!-- Нижние жалюзийные решетки забора воздуха -->
        ${Array.from({ length: 6 }).map((_, k) => `
          <line x1="16" y1="-${16 + k * 5}" x2="${w * 0.44}" y2="-${16 + k * 5}" stroke="#000000" stroke-width="1.3" />
          <line x1="${w * 0.56}" y1="-${16 + k * 5}" x2="${w - 16}" y2="-${16 + k * 5}" stroke="#000000" stroke-width="1.3" />
        `).join('')}

        <!-- Микропроцессорный контроллер ТР-100 на правой двери на уровне глаз -->
        <g transform="translate(${w * 0.74}, -${h * 0.52})">
          <rect x="0" y="0" width="36" height="22" rx="2" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
          <rect x="4" y="3" width="20" height="9" fill="#000000" />
          <text x="14" y="10" text-anchor="middle" font-size="7" font-family="monospace" fill="#00FF00">76°</text>
          <text x="18" y="18" text-anchor="middle" font-size="7" font-weight="bold" font-family="sans-serif" fill="#000000">ТР-100</text>
        </g>

        <!-- Строповочные проушины на крыше кожуха -->
        <g>
          <path d="M 20 -${h} L 20 -${h + 16} A 7 7 0 0 1 34 -${h + 16} L 34 -${h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
          <circle cx="27" cy="-${h + 10}" r="3.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
          <path d="M ${w - 34} -${h} L ${w - 34} -${h + 16} A 7 7 0 0 1 ${w - 20} -${h + 16} L ${w - 20} -${h}" fill="#FFFFFF" stroke="#000000" stroke-width="1.8" />
          <circle cx="${w - 27}" cy="-${h + 10}" r="3.5" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
        </g>
      `;
    }
  }

  /**
   * 7.1. СУХОЙ ТРАНСФОРМАТОР — ВИД СБОКУ (ПРОФИЛЬ)
   */
  static renderDryTransformerSide(
    w: number,
    h: number,
    isEnclosed: boolean,
    hasFans: boolean
  ): string {
    if (!isEnclosed) {
      const beamH = Math.max(16, h * 0.08);
      const coilW = w * 0.58;
      const coilH = h - 2 * beamH - 24;

      return `
        <!-- Ярмовые балки в профиль -->
        <rect x="${(w - coilW) / 2}" y="-${beamH}" width="${coilW}" height="${beamH}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <rect x="${(w - coilW) / 2}" y="-${h}" width="${coilW}" height="${beamH}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />

        <!-- Профиль литой цилиндрической фазы -->
        <rect x="${(w - coilW) / 2}" y="-${beamH + 12 + coilH}" width="${coilW}" height="${coilH}" rx="6" fill="#FFFFFF" stroke="#000000" stroke-width="2.4" />
        <line x1="${w / 2}" y1="-${beamH + 12 + coilH - 6}" x2="${w / 2}" y2="-${beamH + 18}" stroke="#000000" stroke-width="1.2" stroke-dasharray="6,3" />

        <!-- Верхняя контактная лопатка вывода фазы -->
        <rect x="${w / 2 - 6}" y="-${h + 20}" width="12" height="20" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <circle cx="${w / 2}" cy="-${h + 12}" r="2" fill="#000000" />
      `;
    } else {
      return `
        <!-- Боковая стенка кожуха IP21 / IP31 -->
        <rect x="0" y="-${h}" width="${w}" height="${h}" fill="#FFFFFF" stroke="#000000" stroke-width="2.6" />
        <!-- Верхний вентиляционный блок жалюзи -->
        ${Array.from({ length: 5 }).map((_, j) => `
          <line x1="12" y1="-${h - 20 - j * 6}" x2="${w - 12}" y2="-${h - 20 - j * 6}" stroke="#000000" stroke-width="1.3" />
        `).join('')}
        <!-- Съемная панель обслуживания -->
        <rect x="10" y="-${h * 0.68}" width="${w - 20}" height="${h * 0.36}" fill="none" stroke="#000000" stroke-width="1.2" />
        <circle cx="${w / 2}" cy="-${h * 0.5}" r="3" fill="#000000" />
        <!-- Нижний блок жалюзи -->
        ${Array.from({ length: 6 }).map((_, k) => `
          <line x1="12" y1="-${16 + k * 6}" x2="${w - 12}" y2="-${16 + k * 6}" stroke="#000000" stroke-width="1.3" />
        `).join('')}
      `;
    }
  }

  /**
   * 7.2. СУХОЙ ТРАНСФОРМАТОР — ВИД СВЕРХУ (ПЛАН)
   */
  static renderDryTransformerTop(
    w: number,
    depth: number,
    isEnclosed: boolean,
    hasFans: boolean
  ): string {
    if (!isEnclosed) {
      const coilR = Math.min(depth * 0.38, w * 0.12);
      return `
        <!-- Верхняя ярмовая балка магнитопровода -->
        <rect x="15" y="-${depth * 0.22}" width="${w - 30}" height="${depth * 0.44}" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <!-- 3 круглые литые фазы A, B, C в плане -->
        ${[0, 1, 2].map((i) => {
          const cx = w * (0.20 + i * 0.30);
          const phase = i === 0 ? 'A' : i === 1 ? 'B' : 'C';
          return `
            <g transform="translate(${cx}, 0)">
              <circle cx="0" cy="0" r="${coilR}" fill="#FFFFFF" stroke="#000000" stroke-width="2.2" />
              <circle cx="0" cy="0" r="${coilR * 0.72}" fill="none" stroke="#000000" stroke-width="1.2" stroke-dasharray="6,3" />
              <circle cx="0" cy="0" r="${coilR * 0.44}" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
              <text x="0" y="4" text-anchor="middle" font-size="11" font-weight="bold" font-family="sans-serif" fill="#000000">${phase}</text>
            </g>
          `;
        }).join('')}
      `;
    } else {
      return `
        <!-- Крыша защитного кожуха IP21 / IP31 -->
        <rect x="0" y="-${depth / 2}" width="${w}" height="${depth}" fill="#FFFFFF" stroke="#000000" stroke-width="2.4" />
        <!-- Фланцы кабельных вводов ВН и НН на крыше -->
        <rect x="${w * 0.18}" y="-${depth * 0.28}" width="${w * 0.24}" height="${depth * 0.56}" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <rect x="${w * 0.58}" y="-${depth * 0.28}" width="${w * 0.24}" height="${depth * 0.56}" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <text x="${w * 0.30}" y="4" text-anchor="middle" font-size="10" font-weight="bold" font-family="sans-serif" fill="#000000">ВВОД ВН</text>
        <text x="${w * 0.70}" y="4" text-anchor="middle" font-size="10" font-weight="bold" font-family="sans-serif" fill="#000000">ВВОД НН</text>
      `;
    }
  }

  /**
   * 8. ШТАМП ТЕХНИЧЕСКОЙ НЕВОЗМОЖНОСТИ ИЗГОТОВЛЕНИЯ (FEASIBILITY ALERT) ПО ГОСТ
   * Накладывается на чертеж, если конфигурация физически или нормативно нереализуема
   */
  static renderFeasibilityAlert(
    x: number,
    y: number,
    w: number,
    h: number,
    feasibility: FeasibilityStatus
  ): string {
    if (feasibility.isFeasible) return '';

    const reasonsList = feasibility.infeasibilityReasons
      .slice(0, 3)
      .map((r, idx) => `<text x="24" y="${58 + idx * 22}" font-size="14" font-family="sans-serif" fill="#991B1B">• ${r}</text>`)
      .join('');

    const altText = feasibility.feasibleAlternatives[0]
      ? `<text x="24" y="132" font-size="13" font-weight="bold" font-style="italic" font-family="sans-serif" fill="#1E40AF">Решение: ${feasibility.feasibleAlternatives[0]}</text>`
      : '';

    return `
      <g id="FEASIBILITY_ALERT" transform="translate(${x}, ${y})">
        <!-- Красная рамка предупреждения ЕСКД -->
        <rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-width="3" />
        <rect x="0" y="0" width="${w}" height="32" rx="6" fill="#DC2626" />
        
        <!-- Заголовок несоответствия -->
        <text x="${w / 2}" y="22" text-anchor="middle" font-size="15" font-weight="bold" font-family="sans-serif" fill="#FFFFFF">
          ⛔ ВНИМАНИЕ: КОНФИГУРАЦИЯ НЕ МОЖЕТ БЫТЬ ИЗГОТОВЛЕНА ПО ГОСТ / ФИЗИЧЕСКИМ ОГРАНИЧЕНИЯМ
        </text>

        <!-- Причины -->
        ${reasonsList}
        ${altText}
      </g>
    `;
  }

  /**
   * 9. КАРЕТКИ И ДВУХРЕБОРДНЫЕ КАТКИ НА РЕЛЬСАХ
   */
  static renderUndercarriage(
    x1: number,
    x2: number,
    tankW: number,
    groundY: number
  ): string {
    const renderWheel = (cx: number) => `
      <g transform="translate(${cx}, 0)">
        <path d="M -16 0 L 16 0 L 12 -4 L 4 -4 L 4 -12 L 8 -16 L -8 -16 L -4 -12 L -4 -4 L -12 -4 Z" fill="#FFFFFF" stroke="#000000" stroke-width="1.4" />
        <circle cx="0" cy="-28" r="16" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
        <circle cx="0" cy="-28" r="19" fill="none" stroke="#000000" stroke-width="1.3" />
        <circle cx="0" cy="-28" r="6" fill="#FFFFFF" stroke="#000000" stroke-width="1.5" />
        <circle cx="0" cy="-28" r="2.5" fill="#000000" />
        <rect x="-20" y="-48" width="40" height="15" fill="#FFFFFF" stroke="#000000" stroke-width="1.6" />
        <circle cx="-13" cy="-40" r="2" fill="#000000" />
        <circle cx="13" cy="-40" r="2" fill="#000000" />
        <circle cx="0" cy="-40" r="3" fill="#FFFFFF" stroke="#000000" stroke-width="1.2" />
      </g>
    `;

    return `
      <rect x="-8" y="-56" width="${tankW + 16}" height="10" fill="#FFFFFF" stroke="#000000" stroke-width="2" />
      <line x1="-8" y1="-51" x2="${tankW + 8}" y2="-51" stroke="#000000" stroke-width="1" />
      ${renderWheel(x1)}
      ${renderWheel(x2)}
    `;
  }

  /**
   * 10. ЛЕСТНИЦА ОБСЛУЖИВАНИЯ
   */
  static renderLadder(x: number, y: number, height: number, width = 18): string {
    const step = 14;
    const count = Math.floor((height - 10) / step);
    let rungsSvg = '';
    for (let i = 0; i < count; i++) {
      const ry = 8 + i * step;
      rungsSvg += `<line x1="-${width / 2}" y1="${ry}" x2="${width / 2}" y2="${ry}" stroke="#000000" stroke-width="1.4" />`;
    }

    const cageTop = Math.floor(count * 0.6);
    let cageSvg = '';
    for (let j = 0; j < cageTop; j++) {
      const cy = 8 + j * step;
      cageSvg += `<path d="M -${width / 2} ${cy} C -${width} ${cy - 4} -${width} ${cy + 10} -${width / 2} ${cy + 6}" fill="none" stroke="#000000" stroke-width="1" />`;
    }

    return `
      <g transform="translate(${x}, ${y})">
        <line x1="-${width / 2}" y1="0" x2="-${width / 2}" y2="${height}" stroke="#000000" stroke-width="2" />
        <line x1="${width / 2}" y1="0" x2="${width / 2}" y2="${height}" stroke="#000000" stroke-width="2" />
        ${rungsSvg}
        ${cageSvg}
        <path d="M -${width / 2} 0 C -${width / 2} -14 ${width / 2} -14 ${width / 2} 0" fill="none" stroke="#000000" stroke-width="2" />
      </g>
    `;
  }

  /**
   * 11. РАЗМЕРНАЯ ЛИНИЯ ПО ГОСТ 2.307-2011
   */
  static renderDimension(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    offset: number,
    labelText: string,
    orientation: 'horizontal' | 'vertical' = 'horizontal',
    extLength = 12
  ): string {
    if (orientation === 'horizontal') {
      const dy = offset;
      const dimY = y1 + dy;
      return `
        <g class="cad-dimension">
          <line x1="${x1}" y1="${y1}" x2="${x1}" y2="${dimY + Math.sign(dy) * extLength}" stroke="#000000" stroke-width="0.9" />
          <line x1="${x2}" y1="${y2}" x2="${x2}" y2="${dimY + Math.sign(dy) * extLength}" stroke="#000000" stroke-width="0.9" />
          <line x1="${x1}" y1="${dimY}" x2="${x2}" y2="${dimY}" stroke="#000000" stroke-width="1.3" marker-start="url(#gostArrowA4)" marker-end="url(#gostArrowA4)" />
          <text x="${(x1 + x2) / 2}" y="${dimY - 6}" text-anchor="middle" font-size="28" font-weight="bold" font-style="italic" font-family="'ISOCPEUR', 'GOST type A', sans-serif" fill="#000000">${labelText}</text>
        </g>
      `;
    } else {
      const dx = offset;
      const dimX = x1 + dx;
      return `
        <g class="cad-dimension">
          <line x1="${x1}" y1="${y1}" x2="${dimX + Math.sign(dx) * extLength}" y2="${y1}" stroke="#000000" stroke-width="0.9" />
          <line x1="${x2}" y1="${y2}" x2="${dimX + Math.sign(dx) * extLength}" y2="${y2}" stroke="#000000" stroke-width="0.9" />
          <line x1="${dimX}" y1="${y1}" x2="${dimX}" y2="${y2}" stroke="#000000" stroke-width="1.3" marker-start="url(#gostArrowA4)" marker-end="url(#gostArrowA4)" />
          <text x="${dimX - 8}" y="${(y1 + y2) / 2}" text-anchor="middle" font-size="28" font-weight="bold" font-style="italic" font-family="'ISOCPEUR', 'GOST type A', sans-serif" fill="#000000" transform="rotate(-90, ${dimX - 8}, ${(y1 + y2) / 2})">${labelText}</text>
        </g>
      `;
    }
  }

  /**
   * 12. ВЫНОСНАЯ ЛИНИЯ-УКАЗАТЕЛЬ ПО ГОСТ 2.109
   */
  static renderCallout(
    targetX: number,
    targetY: number,
    shelfX: number,
    shelfY: number,
    itemNumber: number,
    shelfLen = 28
  ): string {
    const dir = shelfX > targetX ? 1 : -1;
    const endX = shelfX + dir * shelfLen;
    return `
      <g class="cad-callout">
        <circle cx="${targetX}" cy="${targetY}" r="2" fill="#000000" />
        <line x1="${targetX}" y1="${targetY}" x2="${shelfX}" y2="${shelfY}" stroke="#000000" stroke-width="0.9" />
        <line x1="${shelfX}" y1="${shelfY}" x2="${endX}" y2="${shelfY}" stroke="#000000" stroke-width="1.2" />
        <circle cx="${shelfX + (dir * shelfLen) / 2}" cy="${shelfY - 14}" r="11" fill="#FFFFFF" stroke="#000000" stroke-width="1.3" />
        <text x="${shelfX + (dir * shelfLen) / 2}" y="${shelfY - 9}" text-anchor="middle" font-size="14" font-weight="bold" font-family="sans-serif" fill="#000000">${itemNumber}</text>
      </g>
    `;
  }
}
