/**
 * Конфигурация ценообразования для предварительного расчета стоимости силовых трансформаторов.
 * Вы можете в любой момент изменить baseMultiplier или удельные ставки за 1 кг материала.
 */

export interface PricingRates {
  // Удельные базовые ставки на материалы (USD за 1 кг)
  electricalSteelPerKgUsd: number;      // Электротехническая сталь (анизотропная 30Q120 / 23Q090)
  copperWindingPerKgUsd: number;        // Медный провод обмоточный
  aluminumWindingPerKgUsd: number;      // Алюминиевый провод обмоточный
  structuralSteelPerKgUsd: number;      // Конструкционная сталь бака/рамы/кожуха
  transformerOilPerKgUsd: number;       // Масло трансформаторное (ГК / Т-1500)
  castResinEpoxyPerKgUsd: number;       // Литая эпоксидная смола с кварцевым наполнителем

  // Накладные и комплектующие доли
  insulationAndAccessoriesPct: number;  // Изоляция, переключатель ПБВ/РПН, вводы (% от стоимости материалов)
  manufacturingOverheadPct: number;     // Заводские накладные расходы, сборка, испытания FAT (% от суммы)
  forcedCoolingFansBaseCostUsd: number; // Комплект дутьевых вентиляторов ONAF с автоматикой ШАОТ и монтажом (USD)

  // Главный калибровочный мультипликатор для быстрой корректировки рыночной цены
  baseMultiplier: number;               // 1.0 = базовая расчетная себестоимость завода + маржа

  // Курсы валют для конвертации
  usdToRubRate: number;                 // Курс USD / RUB
  usdToCnyRate: number;                 // Курс USD / CNY (юани для базы FCA Маньчжурия)
}

export const DEFAULT_PRICING_CONFIG: PricingRates = {
  electricalSteelPerKgUsd: 4.20,
  copperWindingPerKgUsd: 12.50,
  aluminumWindingPerKgUsd: 5.80,
  structuralSteelPerKgUsd: 2.40,
  transformerOilPerKgUsd: 2.10,
  castResinEpoxyPerKgUsd: 6.80,

  insulationAndAccessoriesPct: 0.16,
  manufacturingOverheadPct: 0.28,
  forcedCoolingFansBaseCostUsd: 2200.0, // Базовая стоимость 4-6 вентиляторов + шкаф ШАОТ + термореле ТКП + монтаж

  // Мастер-коэффициент (позже можно оперативно регулировать)
  baseMultiplier: 1.0,

  // Индикативные курсы валют
  usdToRubRate: 94.0,
  usdToCnyRate: 7.25,
};
