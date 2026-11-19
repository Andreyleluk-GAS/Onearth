import {
  TransformerCalculationInput,
  TransformerCalculationResult,
  WindingConfiguration,
  FanSpecification,
} from './types';
import { DEFAULT_PRICING_CONFIG, PricingRates } from './pricingConfig';
import {
  solveThermalState,
  solveShortCircuitState,
  solveInsulationState,
  solveFireSafetyState,
  solveParallelOperation,
  runNormativeAudit,
} from './normativeRuleEngine';
import { validateTransformerFeasibility } from './feasibilityValidator';

function roundToStep(val: number, step = 10): number {
  return Math.ceil(val / step) * step;
}

export function calculateDryTransformer(
  input: TransformerCalculationInput,
  pricing: PricingRates = DEFAULT_PRICING_CONFIG
): TransformerCalculationResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const sKva = Math.max(50, input.powerKva);
  const hvKv = Math.max(1, input.voltageHvKv);
  const lvKv = Math.max(0.2, input.voltageLvKv);
  const freqHz = input.frequencyHz || 50;
  const isAl = input.windingMaterial === 'Al';
  const coolingType = input.dryCoolingType || 'AN';
  const enclosure = input.enclosure || 'IP00';
  const isNomex = input.dryInsulationType === 'nomex';

  // Конфигурация схемы обмоток
  const windingConfig: WindingConfiguration = input.windingConfig || 'two_winding';
  const isThreeWinding = windingConfig === 'three_winding';
  const isSplitWinding = windingConfig === 'split_winding';

  const mvKv = isThreeWinding
    ? Math.max(1, input.voltageMvKv || (hvKv >= 20 ? 10 : 6.3))
    : undefined;
  const lv1Kv = isSplitWinding ? Math.max(0.2, input.voltageLv1Kv || lvKv) : lvKv;
  const lv2Kv = isSplitWinding ? Math.max(0.2, input.voltageLv2Kv || lvKv) : lvKv;

  if (isThreeWinding && mvKv !== undefined) {
    if (hvKv <= mvKv || mvKv <= lvKv) {
      warnings.push(`Для сухого трехобмоточного трансформатора уровни напряжения должны строго убывать: ВН (${hvKv} кВ) > СН (${mvKv} кВ) > НН (${lvKv} кВ).`);
    }
  } else if (!isSplitWinding && hvKv <= lvKv) {
    warnings.push('Напряжение ВН должно быть строго выше напряжения НН.');
  }

  if (sKva > 5000) {
    warnings.push(
      `Мощность ${sKva} кВА является редкой для сухих трансформаторов. Возможно индивидуальное исполнение с форсированным обдувом AF.`
    );
  }

  // Распределение мощностей
  let powerHvKva = sKva;
  let powerMvKva: number | undefined;
  let powerLvKva = sKva;
  let powerLv1Kva: number | undefined;
  let powerLv2Kva: number | undefined;

  const threeDist = input.threeWindingPowerDistribution || '100_100_100';
  if (isThreeWinding) {
    powerMvKva = threeDist === '100_66_66' ? Math.round(sKva * 0.667) : sKva;
    powerLvKva = (threeDist === '100_100_66' || threeDist === '100_66_66') ? Math.round(sKva * 0.667) : sKva;
  } else if (isSplitWinding) {
    powerLv1Kva = Math.round(sKva / 2);
    powerLv2Kva = Math.round(sKva / 2);
    powerLvKva = sKva;
  }

  // 1. Токи
  const sqrt3 = Math.sqrt(3);
  const currentHvA = Number((powerHvKva / (sqrt3 * hvKv)).toFixed(1));
  const currentMvA = (isThreeWinding && mvKv) ? Number((powerMvKva! / (sqrt3 * mvKv)).toFixed(1)) : undefined;

  let currentLvA: number;
  let currentLv1A: number | undefined;
  let currentLv2A: number | undefined;

  if (isSplitWinding) {
    currentLv1A = Number((powerLv1Kva! / (sqrt3 * lv1Kv)).toFixed(1));
    currentLv2A = Number((powerLv2Kva! / (sqrt3 * lv2Kv)).toFixed(1));
    currentLvA = Number((currentLv1A + currentLv2A).toFixed(1));
  } else {
    currentLvA = Number((powerLvKva / (sqrt3 * lvKv)).toFixed(1));
  }

  // 2. Напряжение КЗ uk%
  let ukPct = 6.0;
  let ukHvMvPct: number | undefined;
  let ukHvLvPct: number | undefined;
  let ukMvLvPct: number | undefined;
  let ukHvRayPct: number | undefined;
  let ukMvRayPct: number | undefined;
  let ukLvRayPct: number | undefined;

  let ukThroughPct: number | undefined;
  let ukBranchPct: number | undefined;
  let ukSplitMutualPct: number | undefined;
  let splitCoefficient: number | undefined;

  if (isThreeWinding) {
    ukHvMvPct = input.ukHvMvPct || 6.5;
    ukHvLvPct = input.ukHvLvPct || 8.0;
    ukMvLvPct = input.ukMvLvPct || 6.0;
    ukHvRayPct = Number((0.5 * (ukHvMvPct + ukHvLvPct - ukMvLvPct)).toFixed(2));
    ukMvRayPct = Number((0.5 * (ukHvMvPct + ukMvLvPct - ukHvLvPct)).toFixed(2));
    ukLvRayPct = Number((0.5 * (ukHvLvPct + ukMvLvPct - ukHvMvPct)).toFixed(2));
    ukPct = ukHvMvPct;
  } else if (isSplitWinding) {
    splitCoefficient = input.splitCoefficient || 3.5;
    ukThroughPct = input.ukSplitThroughPct || (hvKv > 20 || sKva >= 2000 ? 8.0 : 6.0);
    ukSplitMutualPct = Number((ukThroughPct * splitCoefficient).toFixed(2));
    ukBranchPct = Number((ukThroughPct * (1 + (splitCoefficient - 1) / 4) * 2).toFixed(2));
    ukPct = ukThroughPct;
  } else {
    if (hvKv > 20 || sKva >= 2000) {
      ukPct = 8.0;
    }
    if (hvKv <= 10 && sKva <= 630) {
      ukPct = 4.5;
    }
  }

  // 3. Потери P0 и Pk (ГОСТ Р 54828 / ГОСТ 52719 для сухих трансформаторов с литой изоляцией)
  const steelWeightMult = isThreeWinding ? 1.15 : isSplitWinding ? 1.08 : 1.0;
  const p0Kw = Number((0.0166 * Math.pow(sKva, 0.72) * steelWeightMult).toFixed(2));
  const pkMultiplier = (isAl ? 1.15 : 1.0) * (isThreeWinding ? 1.25 : isSplitWinding ? 1.14 : 1.0);
  const pkKw = Number((0.0526 * Math.pow(sKva, 0.78) * pkMultiplier).toFixed(2));
  const totalLossesKw = Number((p0Kw + pkKw).toFixed(2));

  // КПД
  const pActiveKw = sKva * 0.8;
  const efficiencyPct = Number(((pActiveKw / (pActiveKw + totalLossesKw)) * 100).toFixed(2));

  // 4. Геометрия магнитопровода
  const sPerLimb = sKva / 3.0;
  const freqFactor = Math.pow(50.0 / freqHz, 0.25);
  const kd = 54.0 * freqFactor;
  let coreDMm = roundToStep(kd * Math.pow(sPerLimb, 0.25), 10);
  coreDMm = Math.max(120, Math.min(coreDMm, 800));

  const insClearance = isNomex ? 50.0 + 2.5 * hvKv : 65.0 + 3.0 * hvKv;
  const coreLegPitchMm = roundToStep(coreDMm * 2.05 + insClearance, 10);
  const coreWindowHeightMm = roundToStep(coreDMm * 3.3 + 150.0 + 1.2 * hvKv, 20);

  // Катушка ВН внешний диаметр
  const coilOuterDMm = roundToStep(coreDMm * 1.9 + insClearance, 10);

  // 5. Размеры базовой рамы (IP00)
  const ip00LengthMm = roundToStep(2.0 * coreLegPitchMm + coilOuterDMm + 160.0, 50);
  const ip00WidthMm = roundToStep(coilOuterDMm + 280.0, 50);
  const ip00HeightMm = roundToStep(coreWindowHeightMm + 2.0 * coreDMm * 0.95 + 350.0, 50);

  const bushingHeightHvMm = roundToStep(160.0 + 10.0 * hvKv, 20);
  const bushingHeightMvMm = isThreeWinding ? roundToStep(140.0 + 8.0 * (mvKv || 10), 20) : undefined;
  const bushingHeightLvMm = roundToStep(120.0 + 6.0 * lvKv, 20);

  // Размеры с учетом кожуха IP21/IP31 (если выбран) и вентиляторов обдува AF
  const isAf = coolingType === 'AF';
  const isEnclosed = enclosure === 'IP21' || enclosure === 'IP31';
  const finalLengthMm = isEnclosed ? ip00LengthMm + 400.0 : ip00LengthMm;
  const finalWidthMm = isEnclosed ? ip00WidthMm + 450.0 : (isAf ? ip00WidthMm + 140.0 : ip00WidthMm);
  const finalHeightMm = isEnclosed ? ip00HeightMm + 350.0 : ip00HeightMm;

  if (coolingType === 'AF') {
    recommendations.push(
      'Установлена система принудительного охлаждения (AF) с поперечными вентиляторами. Обеспечивает длительную перегрузку до +40% номинала.'
    );
  }

  if (isThreeWinding) {
    recommendations.push(
      `Сухой трехобмоточный трансформатор (ВН/СН/НН). Схема: ${input.vectorGroup || 'Y/Y/D-11-11'}. Лучевые uk%: В=${ukHvRayPct}%, С=${ukMvRayPct}%, Н=${ukLvRayPct}%.`
    );
  } else if (isSplitWinding) {
    recommendations.push(
      `Сухой трансформатор с расщепленной обмоткой НН (ТСЗГЛ-Р). Применяется для питания 12-пульсных преобразователей частоты (ПЧ). K_расщ = ${splitCoefficient}.`
    );
  }

  // 6. Массы
  // Сталь магнитопровода
  const coreAreaM2 = Math.PI * Math.pow(coreDMm / 2000.0, 2) * 0.88;
  const coreTotalLenM =
    (3.0 * coreWindowHeightMm + 2.0 * (2.0 * coreLegPitchMm + coreDMm)) / 1000.0;
  const weightCoreKg = Math.round(coreAreaM2 * coreTotalLenM * 7650.0 * 0.96);

  // Проводник обмоток
  const cuFactor = isAl ? 0.48 : 1.0;
  const windingConfigMultiplier = isThreeWinding ? 1.25 : isSplitWinding ? 1.12 : 1.0;
  const weightConductorKg = Math.round(1.05 * Math.pow(sKva, 0.75) * cuFactor * 1.35 * windingConfigMultiplier);

  // Литой эпоксидный компаунд или барьерная изоляция
  const weightResinKg = isNomex
    ? Math.round(weightConductorKg * 0.25)
    : Math.round(weightConductorKg * 0.75 + 120.0);

  const weightWindingsKg = weightConductorKg + weightResinKg;

  // Рама, балки, шпильки, катки (+ кожух при наличии)
  const baseFrameKg = Math.round(0.18 * (weightCoreKg + weightWindingsKg) + 160.0);
  const enclosureKg = isEnclosed ? Math.round(0.15 * (weightCoreKg + weightWindingsKg) + 220.0) : 0;
  const weightFrameKg = baseFrameKg + enclosureKg;

  // Блок термоконтроля, датчики PT100, шины и тангенциальные вентиляторы AF
  const weightFansKg = isAf ? Math.round(55.0 + 15.0 * Math.log10(Math.max(sKva, 100) / 100)) : 0;
  const weightAccessoriesKg = Math.round(65.0 + 0.03 * (weightCoreKg + weightWindingsKg) + weightFansKg);

  // Спецификация тангенциальных вентиляторов принудительного охлаждения AF
  let fans: FanSpecification | undefined = undefined;
  if (isAf) {
    const fanCount = 2; // 2 тангенциальных блока TG-60 / BAR-400
    const airflowM3hPerFan = Math.round(1800 + 450 * Math.log10(Math.max(sKva, 100) / 100));
    const motorPowerKwPerFan = 0.25;
    fans = {
      fanCount,
      fanDiameterMm: 120,
      fanType: 'Тангенциальный кросс-флоу (TG-60 / BAR-400)',
      fanMounting: 'cross_flow_bottom',
      airflowM3hPerFan,
      totalAirflowM3h: fanCount * airflowM3hPerFan,
      motorPowerKwPerFan,
      totalFanPowerKw: Number((fanCount * motorPowerKwPerFan).toFixed(2)),
    };
  }

  const totalWeightKg =
    weightCoreKg + weightWindingsKg + weightFrameKg + weightAccessoriesKg;

  // 7. Оценка стоимости
  const conductorPricePerKg = isAl
    ? pricing.aluminumWindingPerKgUsd
    : pricing.copperWindingPerKgUsd;

  const costMaterialsUsd =
    weightCoreKg * pricing.electricalSteelPerKgUsd +
    weightConductorKg * conductorPricePerKg +
    weightResinKg * pricing.castResinEpoxyPerKgUsd +
    weightFrameKg * pricing.structuralSteelPerKgUsd;

  const fansCostUsd = isAf ? Math.round(1100.0 * Math.pow(Math.max(sKva, 250) / 1000, 0.22)) : 0;
  const configAddUsd = isThreeWinding ? 2200.0 : isSplitWinding ? 1200.0 : 0.0;
  const costAccessoriesUsd =
    costMaterialsUsd * (pricing.insulationAndAccessoriesPct + 0.04) + fansCostUsd + configAddUsd;
  const costOverheadUsd =
    (costMaterialsUsd + costAccessoriesUsd) * pricing.manufacturingOverheadPct;
  const baseCostUsd =
    (costMaterialsUsd + costAccessoriesUsd + costOverheadUsd) * pricing.baseMultiplier;

  const totalEstimatedCostUsd = Math.round(baseCostUsd);
  const totalEstimatedCostRub = Math.round(baseCostUsd * pricing.usdToRubRate);
  const totalEstimatedCostCny = Math.round(baseCostUsd * pricing.usdToCnyRate);

  const dimensionsObj = {
    lengthMm: ip00LengthMm,
    widthMm: ip00WidthMm,
    heightMm: ip00HeightMm,
    overallLengthMm: finalLengthMm,
    overallWidthMm: finalWidthMm,
    overallHeightMm: finalHeightMm,
    bushingHeightHvMm,
    bushingHeightMvMm,
    bushingHeightLvMm,
  };

  const weightsObj = {
    coreKg: weightCoreKg,
    windingsKg: weightWindingsKg,
    tankOrFrameKg: weightFrameKg,
    oilKg: 0,
    accessoriesKg: weightAccessoriesKg,
    totalKg: totalWeightKg,
  };

  // Вызов специализированных инженерных солверов CAD/CAE
  const thermalSolver = solveThermalState(input, totalLossesKw, dimensionsObj);
  const shortCircuitSolver = solveShortCircuitState(input, currentHvA, currentLvA, ukPct);
  const insulationSolver = solveInsulationState(input);
  const fireSafetySolver = solveFireSafetyState(input, weightsObj);
  const parallelOperation = solveParallelOperation(input, ukPct);

  // Вызов нормативного Rule Engine
  const normativeAudit = runNormativeAudit(
    input,
    thermalSolver,
    shortCircuitSolver,
    insulationSolver,
    fireSafetySolver,
    { ukPct, currentHvA, efficiencyPct },
    dimensionsObj
  );

  // Валидация технической реализуемости
  const feasibility = validateTransformerFeasibility(
    input,
    totalLossesKw,
    currentHvA,
    currentLvA,
    undefined,
    undefined,
    thermalSolver.hotSpotTempC
  );

  if (!feasibility.isFeasible) {
    warnings.unshift(...feasibility.infeasibilityReasons);
  }

  return {
    input,
    electrical: {
      windingConfig,
      currentHvA,
      currentLvA,
      currentMvA,
      currentLv1A,
      currentLv2A,
      powerHvKva,
      powerMvKva,
      powerLvKva,
      powerLv1Kva,
      powerLv2Kva,
      ukPct,
      ukHvMvPct,
      ukHvLvPct,
      ukMvLvPct,
      ukHvRayPct,
      ukMvRayPct,
      ukLvRayPct,
      ukThroughPct,
      ukBranchPct,
      ukSplitMutualPct,
      splitCoefficient,
      p0Kw,
      pkKw,
      totalLossesKw,
      efficiencyPct,
    },
    activePart: {
      coreDiameterMm: coreDMm,
      coreWindowHeightMm,
      coreLegPitchMm,
    },
    dimensions: dimensionsObj,
    feasibility,
    weights: weightsObj,
    cost: {
      currency: 'RUB',
      materialsCost: Math.round(costMaterialsUsd * pricing.usdToRubRate),
      accessoriesCost: Math.round(costAccessoriesUsd * pricing.usdToRubRate),
      overheadAndLaborCost: Math.round(costOverheadUsd * pricing.usdToRubRate),
      totalEstimatedCostRub,
      totalEstimatedCostUsd,
      totalEstimatedCostCny,
    },
    warnings,
    recommendations,
    normativeAudit,
    radiators: fans
      ? {
          totalLossesKw,
          tankDissipationKw: 0,
          requiredHeatDissipationKw: totalLossesKw,
          actualHeatDissipationKw: Number((totalLossesKw * 1.15).toFixed(1)),
          coolingReservePct: 15.0,
          elementsPerRadiator: 0,
          panelWidthMm: 0,
          panelHeightMm: 0,
          banksCount: 0,
          radiatorsPerBank: 0,
          totalRadiators: 0,
          panelDepthMm: 0,
          surfacePerRadiatorM2: 0,
          radiatorsLeft: 0,
          radiatorsRight: 0,
          radiatorsFront: 0,
          radiatorsBack: 0,
          pitchMm: 0,
          standoffMm: 0,
          fans,
        }
      : undefined,
    thermalSolver,
    shortCircuitSolver,
    insulationSolver,
    fireSafetySolver,
    parallelOperation,
  };
}
