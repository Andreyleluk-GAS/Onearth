import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { TransformerCalculationResult } from '../../services/transformerCalculator/types';

interface Props {
  result: TransformerCalculationResult;
  isOpen: boolean;
  onClose: () => void;
}

export const TransformerEngineeringReportModal: React.FC<Props> = ({
  result,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const {
    input,
    electrical,
    dimensions: d,
    weights,
    thermalSolver,
    shortCircuitSolver,
    insulationSolver,
    fireSafetySolver,
    normativeAudit,
    radiators,
  } = result;

  const isOil = input.type === 'oil';
  let typeCode = isOil ? (input.powerKva >= 6300 ? 'ТДН' : 'ТМН') : 'ТСЛ';
  if (input.windingConfig === 'three_winding') {
    typeCode = isOil ? (input.powerKva >= 10000 ? 'ТДТН' : 'ТМТН') : 'ТСЛ-Т';
  } else if (input.windingConfig === 'split_winding') {
    typeCode = isOil ? (input.powerKva >= 16000 ? 'ТРДН' : 'ТРДНС') : 'ТСЗГЛ-Р';
  }
  const designation = input.projectName || `${typeCode}-${input.powerKva}/${input.voltageHvKv}-У1`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 my-8 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Панель управления модальным окном */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#072640] text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e6a417]" />
            <span className="font-bold text-sm tracking-wide">
              Расчетная записка и нормативный протокол проверки CAD/CAE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#0b3d66] hover:bg-[#082e4e] text-white rounded-lg shadow-sm transition-colors cursor-pointer border border-white/20"
            >
              <Printer className="w-3.5 h-3.5 text-[#e6a417]" />
              Печать / Сохранить в PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Документ для печати и просмотра */}
        <div className="p-6 sm:p-10 overflow-y-auto font-serif text-slate-900 space-y-8 bg-white print:p-0 print:m-0 print:overflow-visible">
          {/* 1. Титульная шапка документа */}
          <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
            <div className="text-xs font-sans uppercase font-bold tracking-widest text-slate-500">
              НОРМАТИВНО-УПРАВЛЯЕМЫЙ ПАРАМЕТРИЧЕСКИЙ CAD/CAE СИЛОВЫХ ТРАНСФОРМАТОРОВ
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              РАСЧЕТНО-ПОЯСНИТЕЛЬНАЯ ЗАПИСКА И ПРОТОКОЛ ПРОВЕРОК
            </h1>
            <div className="text-lg font-bold font-sans text-[#0b3d66]">
              Трансформатор силовой трехфазный типа {designation}
            </div>
            <div className="text-xs font-sans text-slate-600">
              Стандарты: ГОСТ Р 52719-2007 (Изм. 1), ПТЭ Минэнерго №1070 (ред. №343 от 08.04.2026), ПУЭ 4.2, ГОСТ 1516.3
            </div>
          </div>

          {/* 2. Исходные технические данные */}
          <section className="space-y-3 font-sans text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
              1. Исходные технические данные (Техническое задание)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>Номинальная мощность: <strong>{input.powerKva} кВА</strong></div>
              <div>
                {input.windingConfig === 'three_winding'
                  ? 'Напряжение ВН / СН / НН:'
                  : input.windingConfig === 'split_winding'
                  ? 'Напряжение ВН / НН1 / НН2:'
                  : 'Напряжение ВН / НН:'}
                <strong>
                  {' '}
                  {input.windingConfig === 'three_winding'
                    ? `${input.voltageHvKv} / ${input.voltageMvKv || 35} / ${input.voltageLvKv} кВ`
                    : input.windingConfig === 'split_winding'
                    ? `${input.voltageHvKv} / ${input.voltageLv1Kv || input.voltageLvKv}-${input.voltageLv2Kv || input.voltageLvKv} кВ`
                    : `${input.voltageHvKv} / ${input.voltageLvKv} кВ`}
                </strong>
              </div>
              <div>Частота сети: <strong>{input.frequencyHz || 50} Гц</strong></div>
              <div>Материал обмоток: <strong>{input.windingMaterial === 'Cu' ? 'Медь (Cu)' : 'Алюминий (Al)'}</strong></div>
              <div>Схема и группа: <strong>{input.vectorGroup || (input.windingConfig === 'three_winding' ? 'Y0/Y0/Δ-11-11' : 'YNd11')}</strong></div>
              <div>Система охлаждения: <strong>{isOil ? input.oilCoolingType || 'ONAN' : input.dryCoolingType || 'AN'}</strong></div>
              <div>Конфигурация обмоток: <strong>{input.windingConfig === 'three_winding' ? 'Трехобмоточный' : input.windingConfig === 'split_winding' ? 'С расщепленной НН' : 'Двухобмоточный'}</strong></div>
              <div>Исполнение: <strong>{isOil ? 'Масляный, У1' : `${input.enclosure || 'IP00'}, У3`}</strong></div>
              <div>Климатический район: <strong>У1 (от -45°C до +40°C)</strong></div>
            </div>
          </section>

          {/* 3. Электромагнитный расчет */}
          <section className="space-y-3 font-sans text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
              2. Результаты электромагнитного расчета (Electrical Solver)
            </h2>
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold">
                  <th className="p-2 border-r border-slate-300">Параметр</th>
                  <th className="p-2 border-r border-slate-300">Обозначение</th>
                  <th className="p-2 border-r border-slate-300">Расчетное значение</th>
                  <th className="p-2">Норма / Допуск</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 border-r border-slate-300">Номинальный ток обмотки ВН</td>
                  <td className="p-2 border-r border-slate-300 font-mono">I_ВН</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{electrical.currentHvA} А</td>
                  <td className="p-2 text-slate-600">I = S / (√3 · U_ВН)</td>
                </tr>
                {input.windingConfig === 'three_winding' ? (
                  <>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Номинальный ток обмотки СН</td>
                      <td className="p-2 border-r border-slate-300 font-mono">I_СН</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-[#0b3d66]">{electrical.currentMvA || '—'} А</td>
                      <td className="p-2 text-slate-600">I = S_СН / (√3 · U_СН)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Номинальный ток обмотки НН</td>
                      <td className="p-2 border-r border-slate-300 font-mono">I_НН</td>
                      <td className="p-2 border-r border-slate-300 font-bold">{electrical.currentLvA} А</td>
                      <td className="p-2 text-slate-600">I = S_НН / (√3 · U_НН)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Напряжения КЗ пар обмоток (В-С / В-Н / С-Н)</td>
                      <td className="p-2 border-r border-slate-300 font-mono">u_k(BC/BH/CH)</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-[#0b3d66]">
                        {electrical.ukHvMvPct}% / {electrical.ukHvLvPct}% / {electrical.ukMvLvPct}%
                      </td>
                      <td className="p-2 text-slate-600">ГОСТ 11677-85 табл. 4</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Лучевые составляющие схемы замещения</td>
                      <td className="p-2 border-r border-slate-300 font-mono">u_k(В / С / Н)</td>
                      <td className="p-2 border-r border-slate-300 font-bold">
                        {electrical.ukHvRayPct}% / {electrical.ukMvRayPct}% / {electrical.ukLvRayPct}%
                      </td>
                      <td className="p-2 text-slate-600">uk.В + uk.С = uk(В-С)</td>
                    </tr>
                  </>
                ) : input.windingConfig === 'split_winding' ? (
                  <>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Номинальный ток полуобмотки НН1</td>
                      <td className="p-2 border-r border-slate-300 font-mono">I_НН1</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-[#0b3d66]">{electrical.currentLv1A} А</td>
                      <td className="p-2 text-slate-600">I = (S/2) / (√3 · U_НН1)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Номинальный ток полуобмотки НН2</td>
                      <td className="p-2 border-r border-slate-300 font-mono">I_НН2</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-[#0b3d66]">{electrical.currentLv2A} А</td>
                      <td className="p-2 text-slate-600">I = (S/2) / (√3 · U_НН2)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Сквозное напряжение КЗ</td>
                      <td className="p-2 border-r border-slate-300 font-mono">u_k.скв</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-[#0b3d66]">
                        {electrical.ukThroughPct || electrical.ukPct} %
                      </td>
                      <td className="p-2 text-slate-600">При параллельной работе НН1||НН2</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Расщепленное напряжение КЗ ветви</td>
                      <td className="p-2 border-r border-slate-300 font-mono">u_k.ветви</td>
                      <td className="p-2 border-r border-slate-300 font-bold">
                        {electrical.ukBranchPct} %
                      </td>
                      <td className="p-2 text-slate-600">При КЗ на одной секции НН1</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Коэффициент расщепления</td>
                      <td className="p-2 border-r border-slate-300 font-mono">К_расщ</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-emerald-800">
                        {electrical.splitCoefficient || 3.5}
                      </td>
                      <td className="p-2 text-slate-600">Красщ = uk(Н1-Н2) / uk.скв ≈ 3.5..4.0</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Номинальный ток обмотки НН</td>
                      <td className="p-2 border-r border-slate-300 font-mono">I_2ном</td>
                      <td className="p-2 border-r border-slate-300 font-bold">{electrical.currentLvA} А</td>
                      <td className="p-2 text-slate-600">I = S / (√3 · U_НН)</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-300">Напряжение короткого замыкания</td>
                      <td className="p-2 border-r border-slate-300 font-mono">u_k</td>
                      <td className="p-2 border-r border-slate-300 font-bold text-[#0b3d66]">{electrical.ukPct} %</td>
                      <td className="p-2 text-slate-600">ГОСТ Р 52719 табл. 1 (допуск ±10%)</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="p-2 border-r border-slate-300">Потери холостого хода (в стали)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">P_0</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{electrical.p0Kw} кВт</td>
                  <td className="p-2 text-slate-600">Сталь 3408/3409 step-lap (допуск +15%)</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300">Потери короткого замыкания (при 75°C)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">P_k</td>
                  <td className="p-2 border-r border-slate-300 font-bold">{electrical.pkKw} кВт</td>
                  <td className="p-2 text-slate-600">ГОСТ Р 52719 табл. 2 (допуск +10%)</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-300">Коэффициент полезного действия (cos φ = 0.8)</td>
                  <td className="p-2 border-r border-slate-300 font-mono">η</td>
                  <td className="p-2 border-r border-slate-300 font-bold text-emerald-800">{electrical.efficiencyPct} %</td>
                  <td className="p-2 text-slate-600">Класс энергоэффективности 1</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 4. Тепловой расчет и ПТЭ №343 */}
          <section className="space-y-3 font-sans text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
              3. Тепловой расчет (Thermal Solver по ПТЭ Минэнерго №343 от 08.04.2026)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Температура масла:</span>
                <strong className="text-sm text-slate-900">{thermalSolver?.topOilTempC ?? '—'} °C</strong>
                <span className="text-[10px] text-emerald-700 block">норма ≤ {thermalSolver?.topOilTempLimitC ?? 95} °C</span>
              </div>
              <div>
                <span className="text-slate-500 block">Превышение обмоток:</span>
                <strong className="text-sm text-slate-900">{thermalSolver?.windingAverageTempRiseK ?? '—'} К</strong>
                <span className="text-[10px] text-slate-500 block">норма ≤ 65 К (ГОСТ 52719)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Горячая точка (Hot Spot):</span>
                <strong className="text-sm text-slate-900">{thermalSolver?.hotSpotTempC ?? '—'} °C</strong>
                <span className="text-[10px] text-slate-500 block">предел 118 °C</span>
              </div>
              <div>
                <span className="text-slate-500 block">Площадь радиаторов:</span>
                <strong className="text-sm text-slate-900">{thermalSolver?.coolingSurfaceAreaM2 ?? '—'} м²</strong>
                <span className="text-[10px] text-slate-500 block">{radiators?.totalRadiators ?? 0} секций</span>
              </div>
            </div>
          </section>

          {/* 5. Короткое замыкание (ГОСТ 20243) */}
          <section className="space-y-3 font-sans text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
              4. Расчет электродинамической стойкости при КЗ (ГОСТ 20243-74)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Установившийся ток КЗ:</span>
                <strong className="text-sm text-slate-900">{shortCircuitSolver?.ikSteadyKa ?? '—'} кА</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Ударный импульс i_yd:</span>
                <strong className="text-sm text-rose-700">{shortCircuitSolver?.iDynamicPeakKa ?? '—'} кА</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Радиальное усилие F_rad:</span>
                <strong className="text-sm text-slate-900">{shortCircuitSolver?.radialForceKn ?? '—'} кН</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Напряжение в меди/алюминии:</span>
                <strong className="text-sm text-slate-900">{shortCircuitSolver?.copperStressMpa ?? '—'} МПа</strong>
                <span className="text-[10px] text-emerald-700 block">≤ {shortCircuitSolver?.copperStressLimitMpa ?? 120} МПа</span>
              </div>
            </div>
          </section>

          {/* 6. Пожарная безопасность по ПУЭ 4.2 */}
          <section className="space-y-3 font-sans text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center gap-2">
              5. Пожарная безопасность и маслоприемник (ПУЭ изд. 7 гл. 4.2, 123-ФЗ)
            </h2>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <div>
                Масса трансформаторного масла: <strong>{weights.oilKg.toLocaleString('ru-RU')} кг</strong> ({fireSafetySolver?.oilVolumeM3} м³).
              </div>
              <div>
                Требование маслоприемника: <strong>{fireSafetySolver?.oilContainmentRequired ? 'ОБЯЗАТЕЛЕН (масса > 1000 кг по ПУЭ 4.2.68)' : 'Не требуется (масса ≤ 1000 кг)'}</strong>.
              </div>
              {fireSafetySolver?.oilContainmentRequired && (
                <>
                  <div>
                    Объем маслоприемной чаши: <strong>не менее {fireSafetySolver.oilContainmentMinVolumeM3} м³</strong> (100% объема масла).
                  </div>
                  <div>
                    Пламегасящая гравийная засыпка: <strong>толщина слоя не менее 250 мм</strong> фракции 30–70 мм по ПУЭ 4.2.69.
                  </div>
                </>
              )}
              <div>
                Минимальное противопожарное расстояние до зданий: <strong>≥ {fireSafetySolver?.minFireDistanceToBuildingM} м</strong>.
              </div>
            </div>
          </section>

          {/* 7. Ведомость соответствия нормативным документам РФ */}
          {normativeAudit && (
            <section className="space-y-3 font-sans text-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 flex items-center justify-between">
                <span>6. Ведомость соответствия нормативным документам РФ (CAD/CAE Аудит)</span>
                <span className="text-emerald-700 font-bold font-mono">
                  {normativeAudit.rulesPassed} из {normativeAudit.rulesTotal} норм соблюдены
                </span>
              </h2>
              <table className="w-full text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-bold">
                    <th className="p-2 border-r border-slate-300">ID</th>
                    <th className="p-2 border-r border-slate-300">Нормативный документ</th>
                    <th className="p-2 border-r border-slate-300">Параметр</th>
                    <th className="p-2 border-r border-slate-300">Расчетное</th>
                    <th className="p-2 border-r border-slate-300">Предел</th>
                    <th className="p-2">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {normativeAudit.rules.map((rule) => (
                    <tr key={rule.id}>
                      <td className="p-1.5 border-r border-slate-300 font-mono font-bold text-slate-600">{rule.id}</td>
                      <td className="p-1.5 border-r border-slate-300">{rule.document}, {rule.clause}</td>
                      <td className="p-1.5 border-r border-slate-300 font-medium">{rule.parameterName}</td>
                      <td className="p-1.5 border-r border-slate-300 font-bold">{rule.calculatedValue} {rule.unit}</td>
                      <td className="p-1.5 border-r border-slate-300">{rule.limitValue} {rule.unit}</td>
                      <td className="p-1.5 font-bold">
                        {rule.status === 'PASS' && <span className="text-emerald-700">✓ PASS</span>}
                        {rule.status === 'WARNING' && <span className="text-amber-700">⚠ WARN</span>}
                        {rule.status === 'FAIL' && <span className="text-rose-700">✕ FAIL</span>}
                        {rule.status === 'NEEDS_ENGINEER_REVIEW' && <span className="text-[#0b3d66]">REVIEW</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* 8. Подписи и реквизиты завода */}
          <div className="pt-6 border-t-2 border-slate-900 grid grid-cols-2 gap-6 text-xs font-sans">
            <div>
              <div className="font-bold">Завод-изготовитель:</div>
              <div>Hubei Onearth Trading Co., Ltd.</div>
              <div className="text-slate-500">Поставка: FCA Маньчжурия / Забайкальск (DDP РФ)</div>
              <div className="text-slate-500">Система менеджмента качества: ISO 9001:2015</div>
            </div>
            <div className="text-right space-y-1">
              <div>Дата формирования: <strong>{new Date().toLocaleDateString('ru-RU')}</strong></div>
              <div>САПР-ревизия: <strong>CAD/CAE Engine v2.4 (RU-2026-11)</strong></div>
              <div className="text-slate-500">Главный инженер проекта: _____________ (Подпись)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
