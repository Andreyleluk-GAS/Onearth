import {
  NormativeAuditSummary,
  ThermalSolverResult,
  ShortCircuitSolverResult,
  InsulationSolverResult,
  FireSafetySolverResult,
  ParallelOperationResult,
} from './normativeTypes';

export * from './normativeTypes';

export type TransformerType = 'oil' | 'dry';

// Конфигурация схемы обмоток:
// - two_winding: традиционный двухобмоточный (ВН-НН) — ТМ, ТМГ, ТМН, ТДН, ТСЛ
// - three_winding: трехобмоточный (ВН-СН-НН) — ТДТН, ТМТН, ТДТНЖ, ТСЛ-Т
// - split_winding: с расщепленной обмоткой НН (ВН - НН1 и НН2) — ТРДН, ТРДНС, ТСЗГЛ-Р
export type WindingConfiguration = 'two_winding' | 'three_winding' | 'split_winding';

// Соотношение номинальных мощностей по обмоткам по ГОСТ 11677 / ГОСТ Р 52719
export type ThreeWindingPowerDistribution = '100_100_100' | '100_100_66' | '100_66_66';

export type OilCoolingType = 'ONAN' | 'ONAF';
export type DryCoolingType = 'AN' | 'AF';
export type WindingMaterial = 'Cu' | 'Al';
export type DryInsulationType = 'cast_resin' | 'nomex'; // ТСЛ (литая) или ТСВБ (DuPont Nomex)
export type EnclosureType = 'IP00' | 'IP21' | 'IP31';

export interface FanSpecification {
  fanCount: number; // Общее расчетное число вентиляторов
  fanDiameterMm: number; // Диаметр крыльчатки (450 мм для 2ДМ-450, 80-120 мм для сухих кросс-флоу)
  fanType: string; // '2ДМ-450 (малошумный осевой)' | 'Тангенциальный кросс-флоу (AF)'
  fanMounting: 'bottom_up' | 'side_face' | 'cross_flow_bottom'; // Направление и размещение
  airflowM3hPerFan: number; // Производительность одного вентилятора (м3/ч)
  totalAirflowM3h: number; // Суммарный расход воздуха (м3/ч)
  motorPowerKwPerFan: number; // Мощность электродвигателя (кВт)
  totalFanPowerKw: number; // Суммарная мощность привода охлаждения (кВт)
}

export interface FeasibilityStatus {
  isFeasible: boolean; // Возможно ли изготовление в запрошенной конфигурации
  statusLevel: 'feasible' | 'warning' | 'impossible';
  summaryTitle: string;
  infeasibilityReasons: string[]; // Критические причины невозможности по ГОСТ и физике
  feasibleAlternatives: string[]; // Технические рекомендации по корректной конфигурации
}

export interface RadiatorBank {
  panelWidthMm: number; // Стандартная ширина радиаторной панели (520 мм по DIN/ГОСТ)
  panelDepthMm: number; // Глубина секции (элементов * 45 мм)
  panelHeightMm: number; // Межосевая высота коллекторов (1000..3500 мм)
  elementsPerRadiator: number; // Число штампованных элементов в пакете (12..32)
  surfacePerRadiatorM2: number; // Поверхность охлаждения одного радиатора (м2)
  totalRadiators: number; // Общее требуемое число радиаторов
  banksCount: number; // Число радиаторных батарей (блоков)
  radiatorsPerBank: number; // Число радиаторов в одной батарее
  radiatorsLeft: number;
  radiatorsRight: number;
  radiatorsFront: number;
  radiatorsBack: number;
  pitchMm: number; // Монтажный шаг радиаторов
  standoffMm: number; // Вылет от стенки бака

  // Тепловой баланс
  totalLossesKw: number; // Полные потери мощности P0 + Pk (кВт)
  tankDissipationKw: number; // Теплоотдача естественной поверхности бака (кВт)
  requiredHeatDissipationKw: number; // Необходимый теплосъем радиаторного поля (кВт)
  actualHeatDissipationKw: number; // Фактический теплосъем подобранных радиаторов (кВт)
  coolingReservePct: number; // Коэффициент запаса по охлаждению (%)

  // Вентиляторы
  fans?: FanSpecification;
}

export interface TransformerCalculationInput {
  type: TransformerType;
  powerKva: number;
  voltageHvKv: number;
  voltageLvKv: number;
  frequencyHz?: number;
  windingMaterial: WindingMaterial;
  vectorGroup?: string;
  projectName?: string;

  // Конфигурация обмоток (по умолчанию двухобмоточный)
  windingConfig?: WindingConfiguration;

  // 1. Параметры для трехобмоточных трансформаторов (three_winding)
  voltageMvKv?: number; // Среднее напряжение СН (кВ), например 35, 20, 10, 6.3
  threeWindingPowerDistribution?: ThreeWindingPowerDistribution; // 100/100/100%, 100/100/66.7%, 100/66.7/66.7%
  ukHvMvPct?: number; // Напряжение КЗ ВН-СН (%)
  ukHvLvPct?: number; // Напряжение КЗ ВН-НН (%)
  ukMvLvPct?: number; // Напряжение КЗ СН-НН (%)

  // 2. Параметры для расщепленной обмотки НН (split_winding)
  voltageLv1Kv?: number; // Напряжение НН1 (кВ), например 10.5 или 6.3
  voltageLv2Kv?: number; // Напряжение НН2 (кВ), например 10.5 или 6.3
  splitCoefficient?: number; // Коэффициент расщепления K_расщ (обычно 3.5 - 4.0)
  ukSplitThroughPct?: number; // Сквозное напряжение КЗ uk.скв (%) при параллельных НН1+НН2

  // Oil-specific
  oilCoolingType?: OilCoolingType;
  tankType?: 'radiator' | 'corrugated'; // радиаторный или гофробак (для ТМГ до 2500 кВА)

  // Dry-specific
  dryCoolingType?: DryCoolingType;
  dryInsulationType?: DryInsulationType;
  enclosure?: EnclosureType;
}

export interface WeightBreakdown {
  coreKg: number;
  windingsKg: number;
  tankOrFrameKg: number;
  oilKg: number;
  accessoriesKg: number;
  totalKg: number;
}

export interface CostBreakdown {
  currency: string;
  materialsCost: number;
  accessoriesCost: number;
  overheadAndLaborCost: number;
  totalEstimatedCostRub: number;
  totalEstimatedCostUsd: number;
  totalEstimatedCostCny: number;
}

export interface DimensionsBreakdown {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  overallLengthMm: number;
  overallWidthMm: number;
  overallHeightMm: number;
  bushingHeightHvMm: number;
  bushingHeightMvMm?: number; // Высота ввода СН (для трехобмоточных)
  bushingHeightLvMm: number;
  conservatorDiameterMm?: number;
  conservatorLengthMm?: number;
}

export interface TransformerCalculationResult {
  input: TransformerCalculationInput;
  electrical: {
    windingConfig: WindingConfiguration;
    currentHvA: number;
    currentLvA: number;
    currentMvA?: number; // Номинальный фазный ток СН
    currentLv1A?: number; // Ток расщепленной ветви НН1
    currentLv2A?: number; // Ток расщепленной ветви НН2

    powerHvKva: number;
    powerLvKva: number;
    powerMvKva?: number; // Мощность обмотки СН
    powerLv1Kva?: number; // Мощность обмотки НН1
    powerLv2Kva?: number; // Мощность обмотки НН2

    ukPct: number; // Базовое uk (%)

    // Для трехобмоточных:
    ukHvMvPct?: number; // uk(В-С)
    ukHvLvPct?: number; // uk(В-Н)
    ukMvLvPct?: number; // uk(С-Н)
    ukHvRayPct?: number; // Эквивалентная лучевая составляющая ВН
    ukMvRayPct?: number; // Эквивалентная лучевая составляющая СН
    ukLvRayPct?: number; // Эквивалентная лучевая составляющая НН

    // Для расщепленной обмотки НН:
    ukThroughPct?: number; // Сквозное uk.скв
    ukBranchPct?: number; // Ветвевое uk(В-Н1) = uk(В-Н2)
    ukSplitMutualPct?: number; // Взаимное между ветвями uk(Н1-Н2)
    splitCoefficient?: number; // K_расщ

    p0Kw: number;
    pkKw: number;
    totalLossesKw: number;
    efficiencyPct: number; // при cos phi = 0.8 / 1.0
  };
  activePart: {
    coreDiameterMm: number;
    coreWindowHeightMm: number;
    coreLegPitchMm: number;
  };
  dimensions: DimensionsBreakdown;
  radiators?: RadiatorBank;
  feasibility: FeasibilityStatus;
  weights: WeightBreakdown;
  cost: CostBreakdown;
  warnings: string[];
  recommendations: string[];
  normativeAudit?: NormativeAuditSummary;
  thermalSolver?: ThermalSolverResult;
  shortCircuitSolver?: ShortCircuitSolverResult;
  insulationSolver?: InsulationSolverResult;
  fireSafetySolver?: FireSafetySolverResult;
  parallelOperation?: ParallelOperationResult;
}
