import {
  TransformerCalculationInput,
  TransformerType,
  WindingMaterial,
  OilCoolingType,
  DryCoolingType,
  DryInsulationType,
  EnclosureType,
  WindingConfiguration,
} from './types';

export function parsePrompt(prompt: string): Partial<TransformerCalculationInput> {
  const text = prompt.replace(/,/g, '.').toLowerCase();

  // 1. Определение типа: масляный или сухой
  let type: TransformerType = 'oil';
  if (
    text.includes('сух') ||
    text.includes('тсл') ||
    text.includes('тсзл') ||
    text.includes('тсвб') ||
    text.includes('тсзгл') ||
    text.includes('dry') ||
    text.includes('cast') ||
    text.includes('nomex')
  ) {
    type = 'dry';
  }

  // 1.1 Определение конфигурации обмоток: двухобмоточный, трехобмоточный, с расщепленной НН
  let windingConfig: WindingConfiguration = 'two_winding';
  if (
    text.includes('трехобмот') ||
    text.includes('тдтн') ||
    text.includes('тмтн') ||
    text.includes('тдту') ||
    text.includes('трёхобмот')
  ) {
    windingConfig = 'three_winding';
  } else if (
    text.includes('расщеп') ||
    text.includes('трдн') ||
    text.includes('трднс') ||
    text.includes('тсзгл-р') ||
    text.includes('тсл-р') ||
    /\d+(?:\.\d+)?\s*-\s*\d+(?:\.\d+)?/.test(text)
  ) {
    windingConfig = 'split_winding';
  }

  // 2. Мощность (кВА или МВА)
  let powerKva = 1000;
  const mMva = text.match(/(\d+(?:\.\d+)?)\s*(?:mva|мва)/i);
  const mKva = text.match(/(\d+(?:\.\d+)?)\s*(?:kva|ква)/i);
  const mModelPower = text.match(/(?:тм|тмг|тмн|тдн|тднс|тдтн|тмтн|трдн|трднс|тсл|тсзл|тсвб)[-_]?(\d+)/i);

  if (mMva) {
    powerKva = parseFloat(mMva[1]) * 1000;
  } else if (mKva) {
    powerKva = parseFloat(mKva[1]);
  } else if (mModelPower) {
    powerKva = parseFloat(mModelPower[1]);
  } else {
    // Поиск одиночного числа от 50 до 100000
    const mNum = text.match(/\b([1-9]\d{1,5})\b/);
    if (mNum) {
      powerKva = parseFloat(mNum[1]);
    }
  }

  // 3. Напряжения
  let voltageHvKv = 10;
  let voltageMvKv: number | undefined = undefined;
  let voltageLvKv = 0.4;
  let voltageLv1Kv: number | undefined = undefined;
  let voltageLv2Kv: number | undefined = undefined;

  // 3.1 Проверка трех напряжений ВН/СН/НН: например 110/35/10 или 35/10/0.4
  const m3Volt = text.match(/(\d+(?:\.\d+)?)\s*[\/|\\]\s*(\d+(?:\.\d+)?)\s*[\/|\\]\s*(\d+(?:\.\d+)?)/);
  // 3.2 Проверка расщепленного напряжения: например 110/10.5-10.5 или 35/6.3-6.3
  const mSplitVolt = text.match(/(\d+(?:\.\d+)?)\s*[\/|\\]\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  const m2Volt = text.match(/(\d+(?:\.\d+)?)\s*[\/|\\]\s*(\d+(?:\.\d+)?)/);

  if (m3Volt) {
    windingConfig = 'three_winding';
    const nums = [parseFloat(m3Volt[1]), parseFloat(m3Volt[2]), parseFloat(m3Volt[3])].sort((a, b) => b - a);
    voltageHvKv = nums[0];
    voltageMvKv = nums[1];
    voltageLvKv = nums[2];
  } else if (mSplitVolt) {
    windingConfig = 'split_winding';
    voltageHvKv = parseFloat(mSplitVolt[1]);
    voltageLv1Kv = parseFloat(mSplitVolt[2]);
    voltageLv2Kv = parseFloat(mSplitVolt[3]);
    voltageLvKv = voltageLv1Kv;
  } else if (m2Volt) {
    const v1 = parseFloat(m2Volt[1]);
    const v2 = parseFloat(m2Volt[2]);
    voltageHvKv = Math.max(v1, v2);
    voltageLvKv = Math.min(v1, v2);
  } else {
    if (text.includes('110')) voltageHvKv = 110;
    else if (text.includes('35')) voltageHvKv = 35;
    else if (text.includes('20')) voltageHvKv = 20;
    else if (text.includes('10')) voltageHvKv = 10;
    else if (text.includes('6')) voltageHvKv = 6;
  }

  if (windingConfig === 'three_winding' && !voltageMvKv) {
    voltageMvKv = voltageHvKv >= 110 ? 35 : voltageHvKv >= 35 ? 10.5 : 6.3;
  }
  if (windingConfig === 'split_winding') {
    if (!voltageLv1Kv) voltageLv1Kv = voltageLvKv >= 6 ? voltageLvKv : 10.5;
    if (!voltageLv2Kv) voltageLv2Kv = voltageLv1Kv;
    voltageLvKv = voltageLv1Kv;
  }

  // 4. Материал обмоток: медь или алюминий
  let windingMaterial: WindingMaterial = 'Cu';
  if (text.includes('алюм') || text.includes(' al ') || text.endsWith(' al') || text.includes('алюминий')) {
    windingMaterial = 'Al';
  }

  // 5. Охлаждение
  let oilCoolingType: OilCoolingType = 'ONAN';
  if (text.includes('onaf') || text.includes('дуть') || text.includes('принудит')) {
    oilCoolingType = 'ONAF';
  }

  let dryCoolingType: DryCoolingType = 'AN';
  if (text.includes(' af') || text.includes('аф') || text.includes('обдув') || text.includes('вентилятор')) {
    dryCoolingType = 'AF';
  }

  // 6. Сухая изоляция и кожух
  let dryInsulationType: DryInsulationType = 'cast_resin';
  if (text.includes('nomex') || text.includes('номекс') || text.includes('тсвб')) {
    dryInsulationType = 'nomex';
  }

  let enclosure: EnclosureType = 'IP00';
  if (text.includes('ip21') || text.includes('ип21')) {
    enclosure = 'IP21';
  } else if (text.includes('ip31') || text.includes('ип31')) {
    enclosure = 'IP31';
  } else if (text.includes('кожух') || text.includes('тсзл')) {
    enclosure = 'IP21';
  }

  let prefix = type === 'oil' ? (voltageHvKv >= 35 ? 'ТМН' : 'ТМГ') : (enclosure !== 'IP00' ? 'ТСЗЛ' : 'ТСЛ');
  if (windingConfig === 'three_winding') {
    prefix = type === 'oil' ? (powerKva >= 10000 ? 'ТДТН' : 'ТМТН') : 'ТСЛ-Т';
  } else if (windingConfig === 'split_winding') {
    prefix = type === 'oil' ? (powerKva >= 16000 ? 'ТРДН' : 'ТРДНС') : 'ТСЗГЛ-Р';
  }

  const voltStr =
    windingConfig === 'three_winding'
      ? `${voltageHvKv}/${voltageMvKv}/${voltageLvKv}`
      : windingConfig === 'split_winding'
      ? `${voltageHvKv}/${voltageLv1Kv}-${voltageLv2Kv}`
      : `${voltageHvKv}/${voltageLvKv}`;

  const projectName = `${prefix}-${powerKva}/${voltStr}`;

  return {
    type,
    windingConfig,
    powerKva,
    voltageHvKv,
    voltageMvKv,
    voltageLvKv,
    voltageLv1Kv,
    voltageLv2Kv,
    windingMaterial,
    oilCoolingType,
    dryCoolingType,
    dryInsulationType,
    enclosure,
    projectName,
  };
}
