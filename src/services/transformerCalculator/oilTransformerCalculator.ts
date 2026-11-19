import {
  TransformerCalculationInput,
  TransformerCalculationResult,
  RadiatorBank,
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

export function calculateOilTransformer(
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
  const coolingType = input.oilCoolingType || (sKva >= 10000 ? 'ONAF' : 'ONAN');

  // Конфигурация схемы обмоток (ГОСТ 11677, ГОСТ Р 52719, ГОСТ 12965)
  const windingConfig: WindingConfiguration = input.windingConfig || 'two_winding';
  const isThreeWinding = windingConfig === 'three_winding';
  const isSplitWinding = windingConfig === 'split_winding';

  // Определение уровней напряжения СН и НН1/НН2
  const mvKv = isThreeWinding
    ? Math.max(1, input.voltageMvKv || (hvKv >= 110 ? 35 : hvKv >= 35 ? 10 : 6.3))
    : undefined;
  const lv1Kv = isSplitWinding ? Math.max(0.2, input.voltageLv1Kv || lvKv) : lvKv;
  const lv2Kv = isSplitWinding ? Math.max(0.2, input.voltageLv2Kv || lvKv) : lvKv;

  // Инженерная валидация
  if (isThreeWinding && mvKv !== undefined) {
    if (hvKv <= mvKv || mvKv <= lvKv) {
      warnings.push(`Для трехобмоточного трансформатора уровни напряжения должны строго убывать: ВН (${hvKv} кВ) > СН (${mvKv} кВ) > НН (${lvKv} кВ).`);
    }
  } else if (!isSplitWinding && hvKv <= lvKv) {
    warnings.push(`Напряжение ВН (${hvKv} кВ) должно быть строго выше напряжения НН (${lvKv} кВ).`);
  }

  // Распределение мощностей по обмоткам
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

  // 2. Напряжение КЗ uk% (по ГОСТ 52719, ГОСТ 11677, ГОСТ 12965)
  let ukPct: number;
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
    // Трехобмоточный: нормируются 3 пары КЗ
    if (hvKv >= 110) {
      ukHvMvPct = input.ukHvMvPct || 10.5;
      ukHvLvPct = input.ukHvLvPct || 17.5;
      ukMvLvPct = input.ukMvLvPct || 6.5;
    } else {
      ukHvMvPct = input.ukHvMvPct || 7.0;
      ukHvLvPct = input.ukHvLvPct || 8.5;
      ukMvLvPct = input.ukMvLvPct || 6.0;
    }
    // Лучевые эквивалентные составляющие схемы замещения:
    ukHvRayPct = Number((0.5 * (ukHvMvPct + ukHvLvPct - ukMvLvPct)).toFixed(2));
    ukMvRayPct = Number((0.5 * (ukHvMvPct + ukMvLvPct - ukHvLvPct)).toFixed(2));
    ukLvRayPct = Number((0.5 * (ukHvLvPct + ukMvLvPct - ukHvMvPct)).toFixed(2));
    ukPct = ukHvMvPct;
  } else if (isSplitWinding) {
    // Расщепленная обмотка: сквозное uk.скв, коэффициент расщепления K_расщ и ветвевое uk(В-Н1)
    splitCoefficient = input.splitCoefficient || 3.5;
    ukThroughPct = input.ukSplitThroughPct || (hvKv >= 110 ? 10.5 : 8.0);
    ukSplitMutualPct = Number((ukThroughPct * splitCoefficient).toFixed(2));
    // При расщеплении uk ветви к ее номинальной мощности:
    ukBranchPct = Number((ukThroughPct * (1 + (splitCoefficient - 1) / 4) * 2).toFixed(2));
    ukPct = ukThroughPct;
  } else {
    // Двухобмоточный базовый
    if (hvKv <= 12) {
      ukPct = sKva <= 1000 ? 4.5 : 5.5 + 0.5 * Math.log10(sKva / 1000);
    } else if (hvKv <= 38.5) {
      ukPct = 6.5 + 1.0 * Math.log10(Math.max(sKva, 1000) / 1000);
    } else {
      ukPct = 10.5 + 0.8 * Math.log10(Math.max(sKva, 6300) / 6300);
    }
    ukPct = Number(Math.min(Math.max(ukPct, 4.0), 14.5).toFixed(2));
  }

  // 3. Потери P0 (холостой ход в стали) и Pk (короткое замыкание в меди/алюминии) по ГОСТ 11677 / ГОСТ Р 52719
  // Точная степенная аппроксимация по заводским испытаниям силовых трансформаторов РФ (1000..125000 кВА)
  const steelWeightMult = isThreeWinding ? 1.14 : isSplitWinding ? 1.08 : 1.0;
  const p0Kw = Number((0.0131 * Math.pow(sKva, 0.72) * steelWeightMult).toFixed(2));

  const pkConfigMult = isThreeWinding ? 1.25 : isSplitWinding ? 1.14 : 1.0;
  const pkMultiplier = (isAl ? 1.15 : 1.0) * pkConfigMult;
  const pkKw = Number((0.0494 * Math.pow(sKva, 0.78) * pkMultiplier).toFixed(2));
  const totalLossesKw = Number((p0Kw + pkKw).toFixed(2));

  // КПД при номинальной нагрузке (cos phi = 0.8)
  const pActiveKw = sKva * 0.8;
  const efficiencyPct = Number(((pActiveKw / (pActiveKw + totalLossesKw)) * 100).toFixed(2));

  // 4. Геометрия магнитопровода (формула Тихомирова для 3-фазного стержневого)
  const sPerLimb = sKva / 3.0;
  const freqFactor = Math.pow(50.0 / freqHz, 0.25);
  const kd = 56.0 * freqFactor;
  let coreDMm = roundToStep(kd * Math.pow(sPerLimb, 0.25), 10);
  coreDMm = Math.max(140, Math.min(coreDMm, 1100));

  // Расстояние между осями стержней:
  // Для трехобмоточных требуется разместить 3 концентрические обмотки (НН, СН, ВН) с двойными масляными каналами
  const windingRadialAdd = isThreeWinding ? 75.0 + 2.0 * (mvKv || 35) : isSplitWinding ? 35.0 : 0.0;
  const hvClearance = 60.0 + 3.2 * hvKv;
  const coreLegPitchMm = roundToStep(coreDMm * 1.95 + hvClearance + windingRadialAdd, 10);

  // Высота окна:
  // Для расщепленной обмотки осевого типа (двухъярусной) высота окна увеличивается на изолирующий зазор между НН1 и НН2
  const windowHeightAdd = isThreeWinding ? 60.0 : isSplitWinding ? 160.0 : 0.0;
  const coreWindowHeightMm = roundToStep(coreDMm * 3.1 + 180.0 + 1.5 * hvKv + windowHeightAdd, 20);

  // 5. Бак (длина, ширина, высота)
  const tankLengthMm = roundToStep(
    2.0 * coreLegPitchMm + coreDMm * 1.6 + 2.0 * hvClearance + 160.0,
    50
  );
  const tankWidthMm = roundToStep(
    coreDMm * 1.75 + 2.0 * hvClearance + 220.0 + (isThreeWinding ? 90.0 : 0.0),
    50
  );
  const tankHeightMm = roundToStep(
    coreWindowHeightMm + 2.0 * coreDMm * 0.95 + 320.0 + 2.0 * hvKv,
    50
  );

  // 6. Физический тепловой расчет радиаторов и вентиляторов по ГОСТ 11677 / МЭК 60076
  const isOnaf = coolingType === 'ONAF';
  const tankSurfaceM2 = (2.0 * (tankLengthMm + tankWidthMm) * tankHeightMm) / 1e6;
  // Удельная теплоотдача стенки бака при расчетном перепаде температуры 50 К (кВт/м2)
  const qTankSpecific = isOnaf ? 0.15 : 0.10;
  const qTankKw = tankSurfaceM2 * qTankSpecific;
  const qRadNeededKw = Math.max(0.0, totalLossesKw - qTankKw);

  // Подбор типоразмера радиатора (DIN 42551 / EN 50216-6 / ГОСТ 11677)
  // Межосевое расстояние коллекторов: от 1200 до 3200 мм с шагом 200 мм
  const radHeightMm = roundToStep(Math.max(1200.0, Math.min(3200.0, tankHeightMm - 500.0)), 200);
  const panelWidthMm = 520.0; // Стандартная ширина штампованной панели

  // Число элементов (пластин) в пакете радиатора:
  // Для небольших мощностей: 16, для средних: 22, для крупных (от 10-40 МВА): 26..30
  const elementsPerRad = sKva < 2500 ? 16 : sKva < 10000 ? 22 : sKva < 40000 ? 26 : 30;

  // Площадь охлаждающей поверхности одного радиатора (м2)
  // Две стороны панели * число секций * высота * ширина * коэфф. оребрения каналов (0.92)
  const surfacePerRadM2 = Number(
    (2.0 * elementsPerRad * (radHeightMm / 1000.0) * (panelWidthMm / 1000.0) * 0.92).toFixed(2)
  );

  // Удельный теплосъем радиатора:
  // - ONAN (естественный): 0.19 кВт/м2 поверхности
  // - ONAF (с принудительным обдувом вентиляторами снизу): 0.44 кВт/м2 (рост теплосъема в 2.3 раза)
  const qRadSpecific = isOnaf ? 0.44 : 0.19;
  const kwPerRad = surfacePerRadM2 * qRadSpecific;

  // Расчетное число радиаторов с нормативным запасом 10%
  let totalRads = Math.max(2, Math.ceil((qRadNeededKw * 1.10) / kwPerRad));
  if (totalRads % 2 !== 0) {
    totalRads += 1;
  }

  // Распределение радиаторов по батареям (блокам):
  let radiatorsPerBank = totalRads <= 4 ? totalRads : totalRads <= 8 ? 2 : totalRads <= 16 ? 3 : 4;
  if (totalRads % radiatorsPerBank !== 0) {
    radiatorsPerBank = totalRads % 3 === 0 ? 3 : 2;
  }
  const banksCount = Math.ceil(totalRads / radiatorsPerBank);

  const radDepthMm = elementsPerRad * 45.0; // 45 мм шаг секций в радиаторе
  const radPitchMm = 550.0; // Межосевой шаг установки радиаторов на баке
  const radStandoffMm = 180.0; // Вылет коллекторов от стенки бака

  // Размещение радиаторов по сторонам:
  // Приоритет: задняя стенка (back) и правый торец (right), остаток на левый торец (left)
  const maxPerBackSide = Math.max(2, Math.floor((tankLengthMm - 400.0) / radPitchMm));
  const maxPerRightSide = Math.max(2, Math.floor((tankWidthMm - 300.0) / radPitchMm));
  const maxPerLeftSide = Math.max(1, Math.floor((tankWidthMm - 450.0) / radPitchMm));

  let radsBack = Math.min(maxPerBackSide, Math.ceil(totalRads * 0.55));
  let radsRight = Math.min(maxPerRightSide, Math.ceil((totalRads - radsBack) * 0.65));
  let radsLeft = Math.min(maxPerLeftSide, totalRads - radsBack - radsRight);

  if (radsRight % 2 !== 0 && radsRight < maxPerRightSide) radsRight += 1;
  totalRads = radsBack + radsRight + radsLeft;

  // Фактический теплосъем и запас по охлаждению
  const actualRadDissipationKw = totalRads * kwPerRad;
  const actualHeatDissipationKw = Number((qTankKw + actualRadDissipationKw).toFixed(1));
  const coolingReservePct = Number(
    (((actualHeatDissipationKw - totalLossesKw) / totalLossesKw) * 100).toFixed(1)
  );

  // Расчет и спецификация вентиляторов обдува (для ONAF)
  let fans: FanSpecification | undefined = undefined;
  if (isOnaf) {
    // Малошумные осевые вентиляторы 2ДМ-450 / 4М-450 диаметром 450 мм, монтируемые снизу под радиаторами
    const fanCount = Math.max(2, Math.ceil(totalRads / 2));
    const fanDiameterMm = 450;
    const airflowM3hPerFan = 4200;
    const motorPowerKwPerFan = 0.37;
    fans = {
      fanCount,
      fanDiameterMm,
      fanType: '2ДМ-450 (малошумный осевой)',
      fanMounting: 'bottom_up',
      airflowM3hPerFan,
      totalAirflowM3h: fanCount * airflowM3hPerFan,
      motorPowerKwPerFan,
      totalFanPowerKw: Number((fanCount * motorPowerKwPerFan).toFixed(2)),
    };
  }

  const radiators: RadiatorBank = {
    panelWidthMm,
    panelDepthMm: radDepthMm,
    panelHeightMm: radHeightMm,
    elementsPerRadiator: elementsPerRad,
    surfacePerRadiatorM2: surfacePerRadM2,
    totalRadiators: totalRads,
    banksCount,
    radiatorsPerBank,
    radiatorsLeft: radsLeft,
    radiatorsRight: radsRight,
    radiatorsFront: 0,
    radiatorsBack: radsBack,
    pitchMm: radPitchMm,
    standoffMm: radStandoffMm,
    totalLossesKw,
    tankDissipationKw: Number(qTankKw.toFixed(1)),
    requiredHeatDissipationKw: Number(qRadNeededKw.toFixed(1)),
    actualHeatDissipationKw,
    coolingReservePct,
    fans,
  };

  // 7. Расширитель (Conservator) и объем масла
  const oilVolM3 =
    (tankLengthMm * tankWidthMm * tankHeightMm / 1e9) * 0.68 + totalRads * 0.08;
  const conservatorVolM3 = oilVolM3 * 0.10;
  const conservatorDMm = roundToStep(
    Math.max(350.0, Math.pow((conservatorVolM3 * 1e9) / (Math.PI * 0.8), 1.0 / 3.0)),
    50
  );
  const conservatorLMm = roundToStep(
    Math.min(
      tankLengthMm * 0.8,
      Math.max(800.0, (conservatorVolM3 * 1e9) / (Math.PI * Math.pow(conservatorDMm / 2.0, 2)))
    ),
    50
  );

  // Вводы
  const bushingHeightHvMm = roundToStep(280.0 + 14.0 * hvKv, 50);
  const bushingHeightMvMm = isThreeWinding ? roundToStep(220.0 + 12.0 * (mvKv || 35), 30) : undefined;
  const bushingHeightLvMm = roundToStep(Math.max(180.0, 120.0 + 8.0 * lvKv), 20);

  // Полные габариты с учетом радиаторов, вводов, расширителя и шкафа управления ШАОТ при ONAF
  const conservatorOverhangMm = Math.round(conservatorDMm * 0.45 + 180.0);
  const shaotCabinetWidthMm = isOnaf ? 240.0 : 0.0;
  const overallLengthMm = roundToStep(
    tankLengthMm +
      conservatorOverhangMm +
      (radsLeft > 0 ? radStandoffMm + radDepthMm : 100.0) +
      (radsRight > 0 ? radStandoffMm + radDepthMm : 100.0),
    10
  );
  const overallWidthMm = roundToStep(
    tankWidthMm +
      100.0 +
      (radsBack > 0 ? radStandoffMm + radDepthMm : 100.0) +
      shaotCabinetWidthMm,
    10
  );
  const overallHeightMm = roundToStep(
    tankHeightMm + Math.max(bushingHeightHvMm + 100.0, conservatorDMm + 400.0),
    10
  );

  // Контроль железнодорожного габаритов погрузки (макс высота 4300 мм)
  if (overallHeightMm > 4300) {
    if (coolingType === 'ONAN') {
      recommendations.push(
        'Полная высота превышает 4300 мм (предел ж/д габарита 1-Т). Рекомендуется использовать принудительное охлаждение ONAF для снижения высоты бака.'
      );
    } else {
      recommendations.push(
        'Полная высота > 4300 мм. При транспортировке по ж/д высоковольтные вводы и расширитель демонтируются и транспортируются отдельно.'
      );
    }
  }

  // Инженерные рекомендации по конфигурации обмоток (ГОСТ 11677 / ГОСТ Р 52719)
  if (isThreeWinding) {
    recommendations.push(
      `Трехобмоточный силовой трансформатор (ВН/СН/НН). Схема соединения обмоток: ${input.vectorGroup || 'Y0/Y0/D-11-11'}. Лучевые составляющие напряжений КЗ: uk(В) = ${ukHvRayPct}%, uk(С) = ${ukMvRayPct}%, uk(Н) = ${ukLvRayPct}%.`
    );
  } else if (isSplitWinding) {
    recommendations.push(
      `Трансформатор с расщепленной обмоткой НН (ТРДН/ТРДНС). Коэффициент расщепления K_расщ = ${splitCoefficient}. Расщепленное напряжение КЗ ветви uk(В-Н1) = ${ukBranchPct}% эффективно ограничивает токи КЗ на секциях РУ-${lv1Kv} кВ.`
    );
  }

  // 8. Массы компонентов (кг)
  // Активная сталь магнитопровода: 3 стержня + 2 ярма
  const coreAreaM2 = Math.PI * Math.pow(coreDMm / 2000.0, 2) * 0.88;
  const coreTotalLenM =
    (3.0 * coreWindowHeightMm + 2.0 * (2.0 * coreLegPitchMm + coreDMm)) / 1000.0;
  const weightCoreKg = Math.round(coreAreaM2 * coreTotalLenM * 7650.0 * 0.96);

  // Обмотки (медь / алюминий)
  const cuFactor = isAl ? 0.48 : 1.0;
  const windingConfigMultiplier = isThreeWinding ? 1.28 : isSplitWinding ? 1.14 : 1.0;
  const weightWindingsKg = Math.round(0.95 * Math.pow(sKva, 0.75) * cuFactor * 1.35 * windingConfigMultiplier);

  // Бак и радиаторы
  const tankWallThicknessM = sKva < 2500 ? 0.008 : sKva < 16000 ? 0.010 : 0.012;
  const tankAreaM2 = tankSurfaceM2 + 2.0 * ((tankLengthMm * tankWidthMm) / 1e6) * 1.4;
  const weightTankBaseKg = tankAreaM2 * tankWallThicknessM * 7850.0 * 1.25;
  const weightRadsKg = totalRads * surfacePerRadM2 * 11.5;
  const weightTankAndRadiatorsKg = Math.round(weightTankBaseKg + weightRadsKg);

  // Масло (плотность 880 кг/м3)
  const weightOilKg = Math.round(oilVolM3 * 880.0);

  // Принудительное дутьевое охлаждение (ONAF):
  // Добавляет массу электродвигателей, диффузоров, защитных решеток и шкафа ШАОТ
  const weightFansKg = isOnaf
    ? Math.round(180.0 + 50.0 * Math.log10(Math.max(sKva, 1000) / 1000))
    : 0;

  // Арматура, вводы, переключатель, катки и вентиляторы
  const weightAccessoriesKg = Math.round(
    0.08 * (weightCoreKg + weightWindingsKg + weightTankAndRadiatorsKg) + 140.0 + weightFansKg
  );

  const totalWeightKg =
    weightCoreKg +
    weightWindingsKg +
    weightTankAndRadiatorsKg +
    weightOilKg +
    weightAccessoriesKg;

  // 9. Оценка ориентировочной стоимости (USD, RUB, CNY)
  const windingPricePerKg = isAl
    ? pricing.aluminumWindingPerKgUsd
    : pricing.copperWindingPerKgUsd;

  const costMaterialsUsd =
    weightCoreKg * pricing.electricalSteelPerKgUsd +
    weightWindingsKg * windingPricePerKg +
    weightTankAndRadiatorsKg * pricing.structuralSteelPerKgUsd +
    weightOilKg * pricing.transformerOilPerKgUsd;

  // Стоимость комплекта дутьевых вентиляторов ONAF с автоматикой ШАОТ и монтажом
  const fansCostUsd = isOnaf
    ? Math.round((pricing.forcedCoolingFansBaseCostUsd || 2200.0) * Math.pow(Math.max(sKva, 1000) / 6300, 0.28))
    : 0;

  // Дополнительные комплектующие для трехобмоточных (ПБВ/РПН для СН, вводы СН) и расщепленных (двойная ошиновка НН1+НН2)
  const configAccessoriesAddUsd = isThreeWinding
    ? Math.round(3500.0 * Math.pow(Math.max(sKva, 2500) / 6300, 0.35))
    : isSplitWinding
    ? Math.round(1800.0 * Math.pow(Math.max(sKva, 2500) / 6300, 0.3))
    : 0;

  const costAccessoriesUsd =
    costMaterialsUsd * pricing.insulationAndAccessoriesPct + fansCostUsd + configAccessoriesAddUsd;
  const costOverheadUsd =
    (costMaterialsUsd + costAccessoriesUsd) * pricing.manufacturingOverheadPct;
  const baseCostUsd =
    (costMaterialsUsd + costAccessoriesUsd + costOverheadUsd) * pricing.baseMultiplier;

  const totalEstimatedCostUsd = Math.round(baseCostUsd);
  const totalEstimatedCostRub = Math.round(baseCostUsd * pricing.usdToRubRate);
  const totalEstimatedCostCny = Math.round(baseCostUsd * pricing.usdToCnyRate);

  const dimensionsObj = {
    lengthMm: tankLengthMm,
    widthMm: tankWidthMm,
    heightMm: tankHeightMm,
    overallLengthMm,
    overallWidthMm,
    overallHeightMm,
    bushingHeightHvMm,
    bushingHeightMvMm,
    bushingHeightLvMm,
    conservatorDiameterMm: conservatorDMm,
    conservatorLengthMm: conservatorLMm,
  };

  const weightsObj = {
    coreKg: weightCoreKg,
    windingsKg: weightWindingsKg,
    tankOrFrameKg: weightTankAndRadiatorsKg,
    oilKg: weightOilKg,
    accessoriesKg: weightAccessoriesKg,
    totalKg: totalWeightKg,
  };

  // Вызов специализированных инженерных солверов CAD/CAE
  const thermalSolver = solveThermalState(input, totalLossesKw, dimensionsObj, radiators);
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

  // 12. Валидация технической реализуемости конфигурации
  const feasibility = validateTransformerFeasibility(
    input,
    totalLossesKw,
    currentHvA,
    currentLvA,
    radiators,
    thermalSolver.topOilTempC,
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
    radiators,
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
    thermalSolver,
    shortCircuitSolver,
    insulationSolver,
    fireSafetySolver,
    parallelOperation,
  };
}
