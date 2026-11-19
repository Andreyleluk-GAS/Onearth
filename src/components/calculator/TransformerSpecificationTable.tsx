import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Flame,
  ShieldCheck,
  Scale,
  Maximize2,
  Copy,
  Check,
  FileText,
  ArrowRight,
  Thermometer,
  Cpu,
  Layers,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { TransformerCalculationResult } from '../../services/transformerCalculator/types';

interface Props {
  result: TransformerCalculationResult;
  onNavigateToTz?: () => void;
  onOpenReportModal?: () => void;
}

export const TransformerSpecificationTable: React.FC<Props> = ({
  result,
  onNavigateToTz,
  onOpenReportModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'electrical' | 'thermal' | 'short_circuit' | 'insulation' | 'fire_safety' | 'dimensions_weights'
  >('electrical');

  const {
    electrical,
    dimensions: d,
    weights,
    input,
    radiators,
    thermalSolver,
    shortCircuitSolver,
    insulationSolver,
    fireSafetySolver,
    parallelOperation,
    feasibility,
  } = result;

  const isOil = input.type === 'oil';

  const handleCopySpecs = () => {
    const voltLine =
      input.windingConfig === 'three_winding'
        ? `- Напряжение ВН / СН / НН: ${input.voltageHvKv} / ${input.voltageMvKv || 35} / ${input.voltageLvKv} кВ
- Номинальные токи ВН / СН / НН: ${electrical.currentHvA} / ${electrical.currentMvA || '—'} / ${electrical.currentLvA} А
- Напряжения КЗ пар обмоток: uk(В-С)=${electrical.ukHvMvPct}%, uk(В-Н)=${electrical.ukHvLvPct}%, uk(С-Н)=${electrical.ukMvLvPct}%`
        : input.windingConfig === 'split_winding'
        ? `- Напряжение ВН / НН1 / НН2: ${input.voltageHvKv} / ${input.voltageLv1Kv || input.voltageLvKv} / ${input.voltageLv2Kv || input.voltageLvKv} кВ
- Номинальные токи ВН / НН1 / НН2: ${electrical.currentHvA} / ${electrical.currentLv1A || (electrical.currentLvA / 2).toFixed(1)} / ${electrical.currentLv2A || (electrical.currentLvA / 2).toFixed(1)} А
- Напряжение КЗ: uk.скв=${electrical.ukThroughPct || electrical.ukPct}%, uk.ветви=${electrical.ukBranchPct}%, Красщ=${electrical.splitCoefficient || 3.5}`
        : `- Напряжение ВН / НН: ${input.voltageHvKv} / ${input.voltageLvKv} кВ
- Номинальный ток ВН / НН: ${electrical.currentHvA} / ${electrical.currentLvA} А
- Напряжение КЗ uk: ${electrical.ukPct}%`;

    const text = `
Инженерный расчет силового трансформатора ${input.projectName || ''}:
- Тип: ${isOil ? 'Масляный силовой (ГОСТ Р 52719-2007)' : 'Сухой силовой с литой/воздушной изоляцией'}
- Номинальная мощность: ${input.powerKva} кВА
${voltLine}
- Потери ХХ (P0) / КЗ (Pk): ${electrical.p0Kw} / ${electrical.pkKw} кВт
- КПД: ${electrical.efficiencyPct}%
- Температура верхних слоев масла: ${thermalSolver?.topOilTempC ?? '—'} °C (норма ≤ ${thermalSolver?.topOilTempLimitC ?? 95} °C по приказу Минэнерго №343)
- Ударный ток КЗ (i_yd): ${shortCircuitSolver?.iDynamicPeakKa ?? '—'} кА
- Габариты бака (LxWxH): ${d.lengthMm.toFixed(0)} x ${d.widthMm.toFixed(0)} x ${d.heightMm.toFixed(0)} мм
- Полные габариты: ${d.overallLengthMm.toFixed(0)} x ${d.overallWidthMm.toFixed(0)} x ${d.overallHeightMm.toFixed(0)} мм
- Полная масса: ${weights.totalKg.toLocaleString('ru-RU')} кг
- Маслоприемник: ${fireSafetySolver?.oilContainmentRequired ? `Требуется (масло ${fireSafetySolver.oilMassKg} кг > 1000 кг по ПУЭ 4.2.68)` : 'Не требуется'}
Завод-изготовитель: Hubei Onearth Trading Co., Ltd. (FCA Маньчжурия)
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-5 sm:p-6 space-y-5">
      {/* Шапка */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0b3d66]" />
            Сводная инженерная спецификация и результаты CAD/CAE солверов
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Физико-математические расчеты по ГОСТ Р 52719-2007, ГОСТ 20243-74, ГОСТ 1516.3-96 и ПТЭ Минэнерго №343 от 08.04.2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenReportModal && (
            <button
              type="button"
              onClick={onOpenReportModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#072640] hover:bg-[#0b3d66] rounded-lg shadow-sm transition-colors border border-slate-700 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#e6a417]" />
              Расчетная записка
            </button>
          )}

          <button
            type="button"
            onClick={handleCopySpecs}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Скопировано!' : 'Копировать ТТХ'}
          </button>
        </div>
      </div>

      {/* Баннер контроля реализуемости по ГОСТ / НД РФ */}
      {feasibility && !feasibility.isFeasible && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">
              {feasibility.summaryTitle}
            </h4>
            <ul className="text-xs text-red-800 space-y-1 list-disc list-inside">
              {feasibility.infeasibilityReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            {feasibility.feasibleAlternatives.length > 0 && (
              <p className="text-xs font-semibold text-[#0b3d66] pt-1">
                Инженерное решение: {feasibility.feasibleAlternatives.join('; ')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Вкладки переключения разделов спецификации */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'electrical', label: '1. Электрический solver', icon: Zap },
          { id: 'thermal', label: '2. Тепловой solver (ПТЭ №343)', icon: Thermometer },
          { id: 'short_circuit', label: '3. Механика и КЗ (ГОСТ 20243)', icon: Cpu },
          { id: 'insulation', label: '4. Изоляция (ГОСТ 1516.3)', icon: ShieldCheck },
          { id: 'fire_safety', label: '5. Пожарная безопасность (ПУЭ)', icon: Flame },
          { id: 'dimensions_weights', label: '6. Массы и габариты', icon: Maximize2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0b3d66] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Содержимое активной вкладки */}
      <div className="pt-1">
        {/* Вкладка 1: Электрические параметры */}
        {activeTab === 'electrical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                {input.windingConfig === 'three_winding'
                  ? 'Токовые нагрузки трех обмоток (ВН / СН / НН)'
                  : input.windingConfig === 'split_winding'
                  ? 'Токовые нагрузки расщепленных обмоток (ВН / НН1 / НН2)'
                  : 'Токовые нагрузки и трансформации'}
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Номинальная мощность (S):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{input.powerKva.toLocaleString('ru-RU')}&nbsp;кВА</span>
              </div>

              {input.windingConfig === 'three_winding' ? (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Мощности обмоток (ВН / СН / НН):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {(electrical.powerHvKva || input.powerKva).toLocaleString('ru-RU')} / {(electrical.powerMvKva || input.powerKva).toLocaleString('ru-RU')} / {(electrical.powerLvKva || input.powerKva).toLocaleString('ru-RU')}&nbsp;кВА
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Напряжения обмоток (Uв / Uс / Uн):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {input.voltageHvKv} / {input.voltageMvKv || 35} / {input.voltageLvKv}&nbsp;кВ
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Коэфф. трансформации k(В-С) / k(В-Н):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {(input.voltageHvKv / (input.voltageMvKv || 35)).toFixed(2)} / {(input.voltageHvKv / input.voltageLvKv).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Фазный ток ВН (I_вн):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentHvA}&nbsp;А</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Фазный ток СН (I_сн):</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentMvA || '—'}&nbsp;А</span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="text-slate-600">Фазный ток НН (I_нн):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentLvA}&nbsp;А</span>
                  </div>
                </>
              ) : input.windingConfig === 'split_winding' ? (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Мощность полуобмоток НН1 / НН2:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {((electrical.powerLv1Kva || input.powerKva / 2)).toLocaleString('ru-RU')} / {((electrical.powerLv2Kva || input.powerKva / 2)).toLocaleString('ru-RU')}&nbsp;кВА
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Напряжения ВН / НН1 / НН2:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {input.voltageHvKv} / {input.voltageLv1Kv || input.voltageLvKv} / {input.voltageLv2Kv || input.voltageLvKv}&nbsp;кВ
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Фазный ток ВН (I_вн):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentHvA}&nbsp;А</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Номинальный ток ветви НН1 (I_нн1):</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentLv1A}&nbsp;А</span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="text-slate-600">Номинальный ток ветви НН2 (I_нн2):</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentLv2A}&nbsp;А</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Номинальное напряжение ВН (U1):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{input.voltageHvKv}&nbsp;кВ</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Номинальное напряжение НН (U2):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{input.voltageLvKv}&nbsp;кВ</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Коэффициент трансформации (k):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{(input.voltageHvKv / input.voltageLvKv).toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Номинальный фазный ток ВН:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentHvA}&nbsp;А</span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="text-slate-600">Номинальный фазный ток НН:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.currentLvA}&nbsp;А</span>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                {input.windingConfig === 'three_winding'
                  ? 'Напряжения КЗ пар обмоток (ГОСТ 11677)'
                  : input.windingConfig === 'split_winding'
                  ? 'Параметры КЗ и расщепления (ГОСТ Р 52719)'
                  : 'Потери мощности, uk% и энергоэффективность'}
              </span>

              {input.windingConfig === 'three_winding' ? (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">uk пар обмоток (В-С / В-Н / С-Н):</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                      {electrical.ukHvMvPct}% / {electrical.ukHvLvPct}% / {electrical.ukMvLvPct}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Лучевые составляющие (uk.В / uk.С / uk.Н):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {electrical.ukHvRayPct}% / {electrical.ukMvRayPct}% / {electrical.ukLvRayPct}%
                    </span>
                  </div>
                </>
              ) : input.windingConfig === 'split_winding' ? (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Сквозное напряжение КЗ (uk.скв):</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                      {electrical.ukThroughPct || electrical.ukPct}&nbsp;%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Расщепленное напряжение ветви (uk.ветви):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {electrical.ukBranchPct}&nbsp;%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Взаимное напряжение (uk Н1-Н2):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {electrical.ukSplitMutualPct}&nbsp;%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Коэффициент расщепления (Красщ):</span>
                    <span className="font-bold text-emerald-700 shrink-0 whitespace-nowrap ml-2 text-right">
                      {electrical.splitCoefficient || 3.5}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                  <span className="text-slate-600">Напряжение короткого замыкания (uk):</span>
                  <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">{electrical.ukPct}&nbsp;%</span>
                </div>
              )}

              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Потери холостого хода (P0 в стали):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.p0Kw}&nbsp;кВт</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Потери КЗ (Pk в обмотках при 75°C):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.pkKw}&nbsp;кВт</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Суммарные потери мощности:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.totalLossesKw}&nbsp;кВт</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Схема и группа соединения:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{input.vectorGroup || 'YNd11'}</span>
              </div>
              <div className="flex justify-between items-center py-1 bg-emerald-50 px-2 rounded font-bold gap-2">
                <span className="text-emerald-900">Расчетный КПД (при cos&nbsp;φ&nbsp;=&nbsp;0.8):</span>
                <span className="text-emerald-900 shrink-0 whitespace-nowrap ml-2 text-right">{electrical.efficiencyPct}&nbsp;%</span>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка 2: Тепловой расчет по ПТЭ №343, расчет теплосъема радиаторов и вентиляторов */}
        {activeTab === 'thermal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. Температурные режимы */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                1. Температурные режимы (ПТЭ Минэнерго №343)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Температура верхних слоев масла:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {thermalSolver ? `${thermalSolver.topOilTempC}\u00A0°C` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Нормативный предел (ПТЭ №343 от 08.04.2026):</span>
                <span className="font-bold text-emerald-700 shrink-0 whitespace-nowrap ml-2 text-right">
                  ≤&nbsp;{thermalSolver ? `${thermalSolver.topOilTempLimitC}\u00A0°C` : '95\u00A0°C'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Превышение температуры обмоток (ΔT):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {thermalSolver ? `${thermalSolver.windingAverageTempRiseK}\u00A0К (предел ≤ 65\u00A0К)` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Наиболее нагретая точка (Hot-Spot):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {thermalSolver ? `${thermalSolver.hotSpotTempC}\u00A0°C (норма ≤ 118\u00A0°C)` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Температура окружающей среды (ГОСТ 15150):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">+40&nbsp;°C (исп.&nbsp;У1/У3)</span>
              </div>
            </div>

            {/* 2. Тепловой баланс и теплосъем */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                2. Тепловой баланс и теплосъем (кВт)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Суммарные тепловые потери (P₀ + Pₖ):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {radiators ? `${radiators.totalLossesKw}\u00A0кВт` : `${electrical.totalLossesKw}\u00A0кВт`}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Теплоотдача поверхности гладкого бака:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {radiators ? `${radiators.tankDissipationKw}\u00A0кВт` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Требуемый теплосъем радиаторов:</span>
                <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                  {radiators ? `${radiators.requiredHeatDissipationKw}\u00A0кВт` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Фактический теплосъем установленных радиаторов:</span>
                <span className="font-bold text-emerald-800 shrink-0 whitespace-nowrap ml-2 text-right">
                  {radiators ? `${radiators.actualHeatDissipationKw}\u00A0кВт` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Инженерный запас по охлаждению:</span>
                <span className={`font-bold shrink-0 whitespace-nowrap ml-2 text-right ${(radiators?.coolingReservePct ?? 0) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {radiators ? `+${radiators.coolingReservePct}\u00A0%` : '—'}
                </span>
              </div>
            </div>

            {/* 3. Конфигурация радиаторных батарей */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                {isOil ? '3. Батареи радиаторов охлаждения' : '3. Охлаждающая система сухого типа'}
              </span>
              {isOil ? (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Количество радиаторов:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {radiators?.totalRadiators ?? 4}&nbsp;шт. (по&nbsp;{radiators?.elementsPerRadiator ?? 20}&nbsp;секций)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Габариты радиатора (В × Ш × Г):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {radiators?.panelHeightMm ?? 1800} × {radiators?.panelWidthMm ?? 520} × {radiators?.panelDepthMm ?? 480}&nbsp;мм
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Общая площадь охлаждения радиаторов:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {radiators ? `${((radiators.totalRadiators * (radiators.surfacePerRadiatorM2 || 12))).toFixed(1)}\u00A0м²` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="text-slate-600">Размещение батарей:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {radiators?.radiatorsRight ? `Справа (${radiators.radiatorsRight} шт.)` : ''}
                      {radiators?.radiatorsBack ? ` Сзади (${radiators.radiatorsBack} шт.)` : ''}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Режим охлаждения:</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                      {input.dryCoolingType === 'AF' ? 'AF (принудительное с обдувом)' : 'AN (естественная конвекция)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Каналы охлаждения катушек:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      Вертикальные аксиальные каналы в литом компаунде
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="text-slate-600">Класс нагревостойкости изоляции:</span>
                    <span className="font-bold text-emerald-800 shrink-0 whitespace-nowrap ml-2 text-right">
                      Класс F (155°C) по ГОСТ 8865-93
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 4. Вентиляторы обдува */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                {isOil ? '4. Вентиляторы принудительного охлаждения (ONAF)' : '4. Блок термоконтроля и вентиляторы'}
              </span>
              {isOil ? (
                radiators?.fans ? (
                  <>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                      <span className="text-slate-600">Тип и модель вентилятора:</span>
                      <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                        {radiators.fans.fanType} (Ø{radiators.fans.fanDiameterMm} мм)
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                      <span className="text-slate-600">Размещение и направление обдува:</span>
                      <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                        Снизу под радиаторами, вектор снизу вверх
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                      <span className="text-slate-600">Количество вентиляторов:</span>
                      <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                        {radiators.fans.fanCount}&nbsp;шт.
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                      <span className="text-slate-600">Суммарный расход воздуха:</span>
                      <span className="font-bold text-emerald-800 shrink-0 whitespace-nowrap ml-2 text-right">
                        {radiators.fans.totalAirflowM3h.toLocaleString('ru-RU')}&nbsp;м³/ч
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 gap-2">
                      <span className="text-slate-600">Суммарная мощность привода:</span>
                      <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                        {radiators.fans.totalFanPowerKw}&nbsp;кВт (электродвигатели IP55)
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1">Естественное охлаждение (ONAN / М)</p>
                    <p className="text-[11px]">Вентиляторы обдува отсутствуют. Отвод тепла обеспечивается естественной термосифонной циркуляцией масла через радиаторы.</p>
                  </div>
                )
              ) : (
                <>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Микропроцессорный контроллер:</span>
                    <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                      ТР-100 (или Т-154) с RS-485 Modbus RTU
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                    <span className="text-slate-600">Датчики температуры:</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      3 × PT100 (в фазах A, B, C) + 1 × сердечник
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-2">
                    <span className="text-slate-600">Вентиляторы AF (при наличии):</span>
                    <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                      {input.dryCoolingType === 'AF' ? '2 тангенциальных блока TG-60 (BAR-400)' : 'Не установлены (AN)'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Вкладка 3: Короткое замыкание и механическая стойкость */}
        {activeTab === 'short_circuit' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Токи короткого замыкания (ГОСТ 20243-74)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Импеданс КЗ (Zk, привед. к ВН):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `${shortCircuitSolver.zkOhm}\u00A0Ом` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Установившийся ток КЗ (Ik, rms):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `${shortCircuitSolver.ikSteadyKa}\u00A0кА` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Ударный коэффициент (k_yd):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? shortCircuitSolver.kyDynamicFactor : 1.8}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Пиковый ударный ток КЗ (i_yd):</span>
                <span className="font-bold text-rose-700 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `${shortCircuitSolver.iDynamicPeakKa}\u00A0кА` : '—'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Электродинамические силы и прочность обмоток
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Радиальная сила (разрыв наружной катушки):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `${shortCircuitSolver.radialForceKn}\u00A0кН` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Осевая сжимающая сила:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `${shortCircuitSolver.axialForceKn}\u00A0кН` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Механическое напряжение в меди/алюминии:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `${shortCircuitSolver.copperStressMpa}\u00A0МПа` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Предел допустимого напряжения [σ_доп]:</span>
                <span className="font-bold text-emerald-700 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver ? `≤ ${shortCircuitSolver.copperStressLimitMpa}\u00A0МПа` : '120\u00A0МПа'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 bg-emerald-50 px-2 rounded font-bold gap-2">
                <span className="text-emerald-900">Электродинамическая стойкость при КЗ:</span>
                <span className="text-emerald-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {shortCircuitSolver?.isShortCircuitWithstandPassed ? 'ОБЕСПЕЧЕНА (PASS)' : 'ТРЕБУЕТ УСИЛЕНИЯ'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка 4: Изоляция и испытания */}
        {activeTab === 'insulation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Испытательные напряжения (ГОСТ 1516.3 / ГОСТ Р 56738)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Полный грозовой импульс (LI&nbsp;1.2/50&nbsp;мкс):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {insulationSolver ? `${insulationSolver.lightningImpulseWithstandKv}\u00A0кВ` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Одноминутное напряжение 50&nbsp;Гц (AC):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {insulationSolver ? `${insulationSolver.powerFrequencyWithstandKv}\u00A0кВ` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Маслобарьерный зазор обмотка-бак:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {insulationSolver ? `${insulationSolver.oilGapWindingToTankMm}\u00A0мм` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Стандарт изоляционных испытаний:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">ГОСТ&nbsp;Р&nbsp;56738-2015</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Воздушные промежутки и высоковольтные вводы
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Расстояние в воздухе между фазами:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {insulationSolver ? `≥\u00A0${insulationSolver.airClearancePhaseToPhaseMm}\u00A0мм` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Расстояние в воздухе фаза-земля:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {insulationSolver ? `≥\u00A0${insulationSolver.airClearancePhaseToEarthMm}\u00A0мм` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Длина пути утечки изолятора (СЗ&nbsp;III):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {insulationSolver ? `${insulationSolver.creepageDistanceMm}\u00A0мм` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Стандарт высоковольтных вводов:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">ГОСТ&nbsp;Р&nbsp;55187-2012</span>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка 5: Пожарная безопасность (ПУЭ 4.2) */}
        {activeTab === 'fire_safety' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Маслоприемник и засыпка (ПУЭ 4.2.68, 4.2.69)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Масса масла в трансформаторе:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {fireSafetySolver ? `${fireSafetySolver.oilMassKg.toLocaleString('ru-RU')}\u00A0кг` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Обязательность маслоприемника:</span>
                <span className={`font-bold shrink-0 whitespace-nowrap ml-2 text-right ${fireSafetySolver?.oilContainmentRequired ? 'text-amber-800' : 'text-slate-900'}`}>
                  {fireSafetySolver?.oilContainmentRequired ? 'ТРЕБУЕТСЯ (>1000\u00A0кг)' : 'НЕ ТРЕБУЕТСЯ'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Вместимость маслоприемной чаши:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {fireSafetySolver ? `≥\u00A0${fireSafetySolver.oilContainmentMinVolumeM3}\u00A0м³ (100% масла)` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Толщина слоя гравия (30–70&nbsp;мм):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {fireSafetySolver ? `≥\u00A0${fireSafetySolver.gravelLayerMinThicknessMm}\u00A0мм` : '—'}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Противопожарные расстояния (ПУЭ 4.2.131, 123-ФЗ)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Расстояние до стен производственных зданий:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {fireSafetySolver ? `≥\u00A0${fireSafetySolver.minFireDistanceToBuildingM}\u00A0м` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Схема аварийного маслоотвода:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {fireSafetySolver?.oilDrainingSystemType || 'С локальным гравийным фильтром'}
                </span>
              </div>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                <strong>ПУЭ 4.2.68:</strong> При установке трансформатора на ОРУ под ним предусматривается маслоприемник с металлической решеткой и слоем чистого гравия для предотвращения разлива и самовозгорания.
              </div>
            </div>
          </div>
        )}

        {/* Вкладка 6: Массы и габариты */}
        {activeTab === 'dimensions_weights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Габариты (LxBxH) и монтажные размеры
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Бак без навесного оборудования:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {d.lengthMm.toFixed(0)}×{d.widthMm.toFixed(0)}×{d.heightMm.toFixed(0)}&nbsp;мм
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Полные габариты с радиаторами и вводами:</span>
                <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">
                  {d.overallLengthMm.toFixed(0)}×{d.overallWidthMm.toFixed(0)}×{d.overallHeightMm.toFixed(0)}&nbsp;мм
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Колея рельсовых катков:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">
                  {input.powerKva >= 10000 ? '2000\u00A0мм (тяжелый класс)' : '1524\u00A0мм (стандартная колея)'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Высота высоковольтного ввода ВН:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{d.bushingHeightHvMm}&nbsp;мм</span>
              </div>
              {d.bushingHeightMvMm && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                  <span className="text-slate-600">Высота ввода СН (промежуточный):</span>
                  <span className="font-bold text-[#0b3d66] shrink-0 whitespace-nowrap ml-2 text-right">{d.bushingHeightMvMm}&nbsp;мм</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 gap-2">
                <span className="text-slate-600">Высота низковольтного ввода НН:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{d.bushingHeightLvMm}&nbsp;мм</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0b3d66] uppercase text-[11px] block border-b border-slate-200 pb-1">
                Весовая ведомость (кг)
              </span>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Магнитопровод (сталь 3408/3409):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{weights.coreKg.toLocaleString('ru-RU')}&nbsp;кг</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Обмотки ({input.windingMaterial === 'Cu' ? 'медь' : 'алюминий'}):</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{weights.windingsKg.toLocaleString('ru-RU')}&nbsp;кг</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                <span className="text-slate-600">Бак, радиаторы и крышка:</span>
                <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{weights.tankOrFrameKg.toLocaleString('ru-RU')}&nbsp;кг</span>
              </div>
              {isOil && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 gap-2">
                  <span className="text-slate-600">Масло трансформаторное:</span>
                  <span className="font-bold text-slate-900 shrink-0 whitespace-nowrap ml-2 text-right">{weights.oilKg.toLocaleString('ru-RU')}&nbsp;кг</span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 bg-amber-50 px-2 rounded font-bold text-slate-900 text-sm gap-2">
                <span className="text-amber-950 font-black">ПОЛНАЯ МАССА:</span>
                <span className="text-amber-950 font-black shrink-0 whitespace-nowrap ml-2 text-right">{weights.totalKg.toLocaleString('ru-RU')}&nbsp;кг</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Футер спецификации с переходом на ТЗ */}
      {onNavigateToTz && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 bg-slate-50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
          <span className="text-xs text-slate-600">
            Требуется специализированный опросный лист ГОСТ (РПН, трансформаторы тока ТВТ, шкаф ШАОТ)?
          </span>
          <button
            type="button"
            onClick={onNavigateToTz}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3d66] hover:text-[#072640] transition-colors"
          >
            Перенести расчет в конструктор ТЗ
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
