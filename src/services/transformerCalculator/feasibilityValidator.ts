/**
 * Модуль инженерно-технологической проверки реализуемости конфигурации
 * (Feasibility & Manufacturability Validator)
 * в соответствии с ГОСТ Р 52719-2007, ГОСТ 11677-85, МЭК 60076, ПТЭ Минэнерго РФ №343.
 */

import { TransformerCalculationInput, FeasibilityStatus, RadiatorBank } from './types';

export function validateTransformerFeasibility(
  input: TransformerCalculationInput,
  totalLossesKw: number,
  currentHvA: number,
  currentLvA: number,
  radiators?: RadiatorBank,
  topOilTempC?: number,
  hotSpotTempC?: number
): FeasibilityStatus {
  const reasons: string[] = [];
  const alternatives: string[] = [];

  const isOil = input.type === 'oil';
  const power = input.powerKva;
  const hv = input.voltageHvKv;
  const lv = input.voltageLvKv;
  const mv = input.voltageMvKv;

  // 1. Проверка изоляционных пределов сухих трансформаторов
  if (!isOil && hv >= 110) {
    reasons.push(
      `Сухие трансформаторы с литой изоляцией (ТСЛ/ТСЗЛ) серийно не производятся на класс напряжения ${hv}\u00A0кВ. По стандартам ГОСТ Р 52719 и МЭК 60076-11 максимальный промышленный класс для сухих трансформаторов — 35\u00A0кВ.`
    );
    alternatives.push(
      'Выберите масляный силовой трансформатор (серии ТДН, ТДТН или ТРДН 110\u00A0кВ).'
    );
  }

  // 2. Проверка пределов теплоотвода при естественном охлаждении (ONAN)
  if (isOil && input.oilCoolingType === 'ONAN' && power > 31500) {
    reasons.push(
      `Для мощности ${power.toLocaleString('ru-RU')}\u00A0кВА с суммарными потерями ${totalLossesKw.toFixed(1)}\u00A0кВт естественное охлаждение ONAN (М) невозможно. Требуемая площадь охлаждения превышает 1\u00A0800\u00A0м² (> 30 радиаторов), которые физически не помещаются на стенках бака.`
    );
    alternatives.push(
      'Переключите систему охлаждения на ONAF (Д — принудительный обдув вентиляторами) или предусмотрите выносные охладители OFAF/ODAF (ДЦ/НДЦ с маслонасосами).'
    );
  }

  // 3. Проверка предельного тока НН
  if (currentLvA > 20000) {
    reasons.push(
      `Номинальный ток обмотки НН составляет ${currentLvA.toLocaleString('ru-RU')}\u00A0А при напряжении ${lv}\u00A0кВ. Сечение медных шин и электродинамические усилия при КЗ превышают пределы стандартных узлов ввода (максимум 15\u00A0000\u00A0А).`
    );
    alternatives.push(
      `Повысьте номинальное напряжение НН до 6.3\u00A0кВ или 10.5\u00A0кВ, либо примените трансформатор с расщепленной обмоткой (ТРДН ${power}\u00A0кВА, 10.5-10.5\u00A0кВ).`
    );
  }

  // 4. Проверка иерархии напряжений
  if (hv <= lv) {
    reasons.push(
      `Высшее напряжение ВН (${hv}\u00A0кВ) должно быть строго больше низшего напряжения НН (${lv}\u00A0кВ).`
    );
    alternatives.push('Скорректируйте соотношение напряжений обмоток.');
  }

  if (input.windingConfig === 'three_winding' && mv) {
    if (hv <= mv || mv <= lv) {
      reasons.push(
        `Для трехобмоточного трансформатора нарушена иерархия напряжений: ВН (${hv}\u00A0кВ) > СН (${mv}\u00A0кВ) > НН (${lv}\u00A0кВ).`
      );
      alternatives.push('Задайте среднее напряжение СН в диапазоне между ВН и НН.');
    }
  }

  // 5. Проверка перегрева по тепловому солверу
  if (topOilTempC && topOilTempC > 105) {
    reasons.push(
      `Расчетная температура масла ${topOilTempC}\u00A0°C превышает аварийный порог 95\u00A0°C по приказу Минэнерго №343. Это приведет к интенсивному старению и ускоренной термической деструкции целлюлозной изоляции.`
    );
    alternatives.push('Увеличьте интенсивность охлаждения (переход на ONAF с вентиляторами).');
  }

  // 6. Проверка размещения радиаторов
  if (radiators && radiators.coolingReservePct < 0) {
    reasons.push(
      `Поверхности подобранных радиаторов (${radiators.actualHeatDissipationKw.toFixed(1)}\u00A0кВт) недостаточно для отвода требуемых ${radiators.requiredHeatDissipationKw.toFixed(1)}\u00A0кВт тепловых потерь.`
    );
    alternatives.push('Требуется установка дополнительных радиаторных блоков или увеличение обдува.');
  }

  const isFeasible = reasons.length === 0;

  let statusLevel: 'feasible' | 'warning' | 'impossible' = 'feasible';
  let summaryTitle = 'Конфигурация соответствует нормам ГОСТ Р 52719-2007 и реализуема';

  if (!isFeasible) {
    statusLevel = 'impossible';
    summaryTitle = 'Трансформатор в запрошенной конфигурации не может быть изготовлен';
  } else if (power >= 25000 && input.oilCoolingType === 'ONAN') {
    statusLevel = 'warning';
    summaryTitle = 'Конфигурация на пределе тепловой эффективности: рекомендуется обдув ONAF';
  }

  return {
    isFeasible,
    statusLevel,
    summaryTitle,
    infeasibilityReasons: reasons,
    feasibleAlternatives: alternatives,
  };
}
