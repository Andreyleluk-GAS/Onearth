/**
 * Типы данных и интерфейсы Нормативно-управляемого параметрического CAD/CAE
 * для силовых трансформаторов в РФ (ГОСТ Р 52719-2007 с Изм. 1, ПТЭ Минэнерго №1070
 * в ред. №343 от 08.04.2026, ПУЭ 4.2, ГОСТ 1516.3-96, ГОСТ Р 56738-2015, ГОСТ Р 55187-2012).
 */

export type NormativeStatus =
  | 'PASS'                 // Полное соответствие обязательному нормативу
  | 'FAIL'                 // Нарушение обязательного нормативного требования
  | 'WARNING'              // Предупреждение / близко к нормативному пределу
  | 'NOT_APPLICABLE'       // Не применимо к данной конструкции
  | 'NEEDS_ENGINEER_REVIEW'// Требует согласования ГИПа / заказчика
  | 'DESIGN_ASSUMPTION';   // Инженерное расчетное допущение

export type ParameterOrigin =
  | 'NORMATIVE_REQUIREMENT' // Обязательное требование НД (ГОСТ, ПУЭ, ПТЭ, ТР ТС)
  | 'ENGINEERING_RULE'     // Инженерно-эмпирическое правило (плотность тока, индукция)
  | 'DESIGN_ASSUMPTION'     // Расчетное допущение проектировщика
  | 'CALCULATED'            // Результат физико-математического расчета solver'а
  | 'USER_INPUT';           // Входные данные технического задания

export type NormativeCategory =
  | 'electrical'
  | 'thermal'
  | 'short_circuit'
  | 'insulation'
  | 'fire_safety'
  | 'parallel_operation'
  | 'transport';

export interface NormativeCheckRule {
  id: string;
  category: NormativeCategory;
  title: string;
  document: string;          // Например: "Приказ Минэнерго России №1070 в ред. №343 от 08.04.2026"
  clause: string;            // Например: "п. 5.3.34"
  effectiveDate: string;     // Например: "2026-04-08"
  origin: ParameterOrigin;
  parameterName: string;
  calculatedValue: number | string;
  limitValue: number | string;
  unit: string;
  status: NormativeStatus;
  explanation: string;       // Ответ на вопрос: "Почему система разрешает или запрещает это значение?"
  recommendation?: string;   // Что сделать инженеру для устранения несоответствия
}

/**
 * Результаты Теплового расчета (Thermal Solver)
 * по ГОСТ Р 52719-2007 и ПТЭ Минэнерго №343 от 08.04.2026
 */
export interface ThermalSolverResult {
  topOilTempC: number;                // Температура верхних слоев масла
  topOilTempLimitC: number;           // 95°C (М, Д) или 75°C (ДЦ) по ПТЭ Минэнерго №343
  windingAverageTempRiseK: number;    // Превышение средней температуры обмотки (макс 65 К)
  hotSpotTempC: number;               // Температура наиболее нагретой точки обмотки (макс 98..118°C)
  ambientTempC: number;               // Расчетная температура окружающей среды (+40°C)
  coolingSurfaceAreaM2: number;       // Необходимая эффективная площадь охлаждения
  coolingSystemType: string;          // ONAN, ONAF, AN, AF
  oilCirculationMode: string;         // Естественная / принудительная
}

/**
 * Результаты Расчета токов и электродинамической стойкости при КЗ (Mechanical & Short-Circuit Solver)
 * по ГОСТ 20243-74, ГОСТ Р 52719-2007
 */
export interface ShortCircuitSolverResult {
  zkOhm: number;                      // Импеданс короткого замыкания
  ikSteadyKa: number;                 // Установившийся ток трехфазного КЗ
  iDynamicPeakKa: number;             // Пиковый ударный ток КЗ (с учетом коэффициента k_yd)
  kyDynamicFactor: number;            // Ударный коэффициент (1.75..1.85)
  radialForceKn: number;              // Радиальная разрывающая/сжимающая электродинамическая сила
  axialForceKn: number;               // Осевая сжимающая сила обмотки
  copperStressMpa: number;            // Расчетное механическое напряжение в материале обмотки
  copperStressLimitMpa: number;       // Предел прочности: 120 МПа (медь Cu), 60 МПа (алюминий Al)
  isShortCircuitWithstandPassed: boolean;
}

/**
 * Результаты Координации изоляции и диэлектрических испытаний (Insulation Solver)
 * по ГОСТ 1516.3-96, ГОСТ Р 56738-2015, ГОСТ Р 55187-2012
 */
export interface InsulationSolverResult {
  lightningImpulseWithstandKv: number; // Испытательное напряжение полного грозового импульса (LI)
  powerFrequencyWithstandKv: number;   // Одноминутное испытательное напряжение промышленной частоты 50 Гц
  creepageDistanceMm: number;          // Минимальная длина пути утечки изоляторов (СЗ II/III по ГОСТ 9920)
  airClearancePhaseToPhaseMm: number;  // Расстояние в воздухе между фазами
  airClearancePhaseToEarthMm: number;  // Расстояние в воздухе от фазы до заземленных элементов
  oilGapWindingToTankMm: number;       // Маслобарьерный изоляционный зазор до стенки бака
  bushingStandard: string;             // ГОСТ Р 55187-2012
}

/**
 * Результаты Пожарной безопасности и экологических требований (Fire Safety Solver)
 * по ПУЭ изд. 7 гл. 4.2 и 123-ФЗ
 */
export interface FireSafetySolverResult {
  oilMassKg: number;
  oilVolumeM3: number;
  oilContainmentRequired: boolean;     // Требуется ли маслоприемник (масса масла > 1000 кг по ПУЭ 4.2.68)
  oilContainmentMinVolumeM3: number;   // 100% объема масла трансформатора (или 20% с отводом)
  gravelLayerMinThicknessMm: number;   // Толщина гравийной засыпки (не менее 250 мм по ПУЭ 4.2.69)
  minFireDistanceToBuildingM: number;  // Минимальное противопожарное расстояние до зданий (ПУЭ 4.2.131)
  oilDrainingSystemType: string;       // С маслоотводом в сборник / локальный маслоприемник
}

/**
 * Результаты Проверки условий включения на параллельную работу (Parallel Operation Solver)
 * по СП 226.1326000.2014 и ПТЭ
 */
export interface ParallelOperationCheck {
  criterion: string;
  condition: string;
  isPassed: boolean;
  actualDifference: string;
  normativeLimit: string;
  note: string;
}

export interface ParallelOperationResult {
  isParallelAllowed: boolean;
  checks: ParallelOperationCheck[];
}

/**
 * Сводный нормативный аудит трансформаторного проекта
 */
export interface NormativeAuditSummary {
  rulesTotal: number;
  rulesPassed: number;
  rulesWarnings: number;
  rulesFailed: number;
  rulesUnderReview: number;
  complianceRatingPct: number;
  rules: NormativeCheckRule[];
}
