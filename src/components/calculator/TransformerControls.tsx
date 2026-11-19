import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  TransformerCalculationInput,
  TransformerType,
  WindingMaterial,
  OilCoolingType,
  DryCoolingType,
  EnclosureType,
  DryInsulationType,
  WindingConfiguration,
  ThreeWindingPowerDistribution,
  FeasibilityStatus,
} from '../../services/transformerCalculator/types';
import { parsePrompt } from '../../services/transformerCalculator/promptParser';

interface Props {
  input: TransformerCalculationInput;
  onChange: (updated: TransformerCalculationInput) => void;
  warnings?: string[];
  recommendations?: string[];
  feasibility?: FeasibilityStatus;
}

export const TransformerControls: React.FC<Props> = ({
  input,
  onChange,
  warnings = [],
  recommendations = [],
  feasibility,
}) => {
  const [promptText, setPromptText] = useState('');

  const handleApplyPrompt = () => {
    if (!promptText.trim()) return;
    const parsed = parsePrompt(promptText);
    onChange({
      ...input,
      ...parsed,
    });
  };

  const isOil = input.type === 'oil';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-6">
      {/* 1. Умная строка ввода (Natural Language Prompt) */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-4 h-4 text-[#e6a417]" />
          Умный ввод запроса (разбор на естественном языке):
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyPrompt()}
            placeholder="Например: ТМН 7200 кВА 35/10.5 кВ медь ONAN или ТСЛ 1600 10/0.4 IP21"
            className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b3d66] text-slate-800 shadow-sm"
          />
          <button
            type="button"
            onClick={handleApplyPrompt}
            className="px-5 py-2.5 bg-[#0b3d66] hover:bg-[#072640] text-white text-xs font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            Разобрать
          </button>
        </div>
      </div>

      {/* Оповещение о реализуемости конфигурации (ГОСТ и физические ограничения) */}
      {feasibility && !feasibility.isFeasible && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-3">
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
            </div>
          </div>

          {/* Быстрые 1-клик решения */}
          {feasibility.feasibleAlternatives.length > 0 && (
            <div className="pt-2 border-t border-red-200">
              <span className="text-[11px] font-bold text-red-900 uppercase block mb-1.5">
                Рекомендуемые инженерные решения:
              </span>
              <div className="flex flex-wrap gap-2">
                {isOil && input.oilCoolingType === 'ONAN' && input.powerKva > 31500 && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...input, oilCoolingType: 'ONAF' })}
                    className="px-3 py-1.5 bg-[#0b3d66] hover:bg-[#072640] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#e6a417]" />
                    Включить принудительное охлаждение (ONAF / Д)
                  </button>
                )}
                {!isOil && input.voltageHvKv >= 110 && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...input, type: 'oil', oilCoolingType: 'ONAF' })}
                    className="px-3 py-1.5 bg-[#0b3d66] hover:bg-[#072640] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#e6a417]" />
                    Переключить на масляный тип (ТДН / ТДТН)
                  </button>
                )}
                {input.voltageLvKv < 6.3 && (
                  <button
                    type="button"
                    onClick={() => onChange({ ...input, voltageLvKv: 10.5 })}
                    className="px-3 py-1.5 bg-[#0b3d66] hover:bg-[#072640] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#e6a417]" />
                    Повысить напряжение НН до 10.5 кВ
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Основные переключатели */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Тип трансформатора */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
            Тип трансформатора
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onChange({ ...input, type: 'oil' })}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all min-h-[36px] flex items-center justify-center cursor-pointer ${
                isOil ? 'bg-white text-[#0b3d66] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Масляный
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...input, type: 'dry' })}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all min-h-[36px] flex items-center justify-center cursor-pointer ${
                !isOil ? 'bg-white text-[#0b3d66] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Сухой
            </button>
          </div>
        </div>

        {/* Материал обмоток */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
            Материал обмоток
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onChange({ ...input, windingMaterial: 'Cu' })}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all min-h-[36px] flex items-center justify-center cursor-pointer ${
                input.windingMaterial === 'Cu'
                  ? 'bg-[#e6a417] text-[#072640] shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Медь (Cu)
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...input, windingMaterial: 'Al' })}
              className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all min-h-[36px] flex items-center justify-center cursor-pointer ${
                input.windingMaterial === 'Al'
                  ? 'bg-slate-700 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Алюминий (Al)
            </button>
          </div>
        </div>
      </div>

      {/* Конфигурация обмоток (Двухобмоточный / Трехобмоточный / С расщепленной НН) */}
      <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200">
        <label className="text-xs font-bold text-slate-800 block mb-2 uppercase tracking-wide">
          Конфигурация обмоток трансформатора:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Вариант 1: Двухобмоточный */}
          <button
            type="button"
            onClick={() => onChange({ ...input, windingConfig: 'two_winding' })}
            className={`py-2 px-3 text-left rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-center h-full min-h-[58px] ${
              input.windingConfig === 'two_winding' || !input.windingConfig
                ? 'bg-white border-[#0b3d66] text-[#0b3d66] shadow-sm ring-1 ring-[#0b3d66]/20'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-black text-sm leading-tight">Двухобмоточный</span>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  input.windingConfig === 'two_winding' || !input.windingConfig
                    ? 'border-[#0b3d66] bg-[#0b3d66]'
                    : 'border-slate-400'
                }`}
              >
                {(input.windingConfig === 'two_winding' || !input.windingConfig) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium leading-none mt-1">
              Обмотки ВН / НН
            </span>
          </button>

          {/* Вариант 2: Трехобмоточный */}
          <button
            type="button"
            onClick={() => {
              const defaultMv = input.voltageHvKv >= 110 ? 35 : input.voltageHvKv >= 35 ? 10.5 : 6.3;
              onChange({
                ...input,
                windingConfig: 'three_winding',
                voltageMvKv: input.voltageMvKv || defaultMv,
                threeWindingPowerDistribution: input.threeWindingPowerDistribution || '100_100_100',
              });
            }}
            className={`py-2 px-3 text-left rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-center h-full min-h-[58px] ${
              input.windingConfig === 'three_winding'
                ? 'bg-white border-[#0b3d66] text-[#0b3d66] shadow-sm ring-1 ring-[#0b3d66]/20'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-black text-sm leading-tight">Трехобмоточный</span>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  input.windingConfig === 'three_winding'
                    ? 'border-[#0b3d66] bg-[#0b3d66]'
                    : 'border-slate-400'
                }`}
              >
                {input.windingConfig === 'three_winding' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium leading-none mt-1">
              Обмотки ВН / СН / НН
            </span>
          </button>

          {/* Вариант 3: С расщепленной НН */}
          <button
            type="button"
            onClick={() => {
              const defaultLv = input.voltageLvKv >= 6 ? input.voltageLvKv : 10.5;
              onChange({
                ...input,
                windingConfig: 'split_winding',
                voltageLv1Kv: input.voltageLv1Kv || defaultLv,
                voltageLv2Kv: input.voltageLv2Kv || defaultLv,
                splitCoefficient: input.splitCoefficient || 3.5,
              });
            }}
            className={`py-2 px-3 text-left rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-full min-h-[58px] ${
              input.windingConfig === 'split_winding'
                ? 'bg-white border-[#0b3d66] text-[#0b3d66] shadow-sm ring-1 ring-[#0b3d66]/20'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-black text-sm leading-tight">Расщепленная НН</span>
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  input.windingConfig === 'split_winding'
                    ? 'border-[#0b3d66] bg-[#0b3d66]'
                    : 'border-slate-400'
                }`}
              >
                {input.windingConfig === 'split_winding' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium leading-none mt-1">
              Обмотки ВН / НН1-НН2
            </span>
          </button>
        </div>
      </div>

      {/* 3. Мощность (произвольный ввод + слайдер) */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Номинальная мощность:
          </label>
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              type="number"
              min="50"
              max="100000"
              step="10"
              value={input.powerKva}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 100;
                onChange({ ...input, powerKva: val });
              }}
              className="w-32 px-3 py-1.5 text-right font-black text-[#0b3d66] text-lg bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            />
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">кВА</span>
          </div>
        </div>

        {/* Интерактивный ползунок мощности */}
        <input
          type="range"
          min="100"
          max={isOil ? '31500' : '4000'}
          step="50"
          value={input.powerKva}
          onChange={(e) => onChange({ ...input, powerKva: parseFloat(e.target.value) })}
          className="w-full accent-[#0b3d66] cursor-pointer h-2 bg-slate-200 rounded-lg"
        />

        <div className="flex justify-between text-[11px] text-slate-600 whitespace-nowrap font-medium">
          <span>100 кВА</span>
          <span>1 000 кВА</span>
          <span>6 300 кВА</span>
          <span>{isOil ? '31 500 кВА' : '4 000 кВА'}</span>
        </div>
        <p className="text-[11px] text-slate-600 italic">
          * Можно ввести любое нестандартное значение вручную (например: 7200, 1850, 12500 кВА).
        </p>
      </div>

      {/* 4. Напряжения обмоток в зависимости от конфигурации */}
      {input.windingConfig === 'three_winding' ? (
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-800 block uppercase tracking-wide">
            Номинальные напряжения трех обмоток (ВН / СН / НН):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Высшее напряжение ВН
              </label>
              <select
                value={input.voltageHvKv}
                onChange={(e) => {
                  const hv = parseFloat(e.target.value);
                  const mv = hv <= (input.voltageMvKv || 35) ? (hv >= 110 ? 35 : 10.5) : (input.voltageMvKv || 35);
                  onChange({ ...input, voltageHvKv: hv, voltageMvKv: mv });
                }}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
              >
                {isOil && <option value="110">110 кВ</option>}
                <option value="35">35 кВ</option>
                <option value="20">20 кВ</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Среднее напряжение СН
              </label>
              <select
                value={input.voltageMvKv || (input.voltageHvKv >= 110 ? 35 : 10.5)}
                onChange={(e) => onChange({ ...input, voltageMvKv: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 text-sm bg-white border border-[#0b3d66]/40 rounded-xl font-semibold text-[#0b3d66] focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
              >
                {[38.5, 35, 24, 20, 15, 10.5, 10, 6.3]
                  .filter((v) => v < input.voltageHvKv && v > input.voltageLvKv)
                  .map((v) => (
                    <option key={v} value={v}>
                      {v} кВ
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Низшее напряжение НН
              </label>
              <select
                value={input.voltageLvKv}
                onChange={(e) => onChange({ ...input, voltageLvKv: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
              >
                {[10.5, 10, 6.3, 3.15, 0.69, 0.4]
                  .filter((v) => v < (input.voltageMvKv || 35))
                  .map((v) => (
                    <option key={v} value={v}>
                      {v === 0.4 ? '0.4 кВ (380 В)' : `${v} кВ`}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Распределение мощностей по обмоткам трехобмоточного трансформатора */}
          <div className="pt-2">
            <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              Распределение мощности по обмоткам (ВН / СН / НН):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '100_100_100' as ThreeWindingPowerDistribution, label: '100 / 100 / 100 %' },
                { id: '100_100_66' as ThreeWindingPowerDistribution, label: '100 / 100 / 66.7 %' },
                { id: '100_66_66' as ThreeWindingPowerDistribution, label: '100 / 66.7 / 66.7 %' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange({ ...input, threeWindingPowerDistribution: item.id })}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    (input.threeWindingPowerDistribution || '100_100_100') === item.id
                      ? 'bg-[#0b3d66] text-white border-[#0b3d66] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : input.windingConfig === 'split_winding' ? (
        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-800 block uppercase tracking-wide">
            Номинальные напряжения обмоток (ВН / НН1 / НН2):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Высшее напряжение ВН
              </label>
              <select
                value={input.voltageHvKv}
                onChange={(e) => onChange({ ...input, voltageHvKv: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
              >
                {isOil && <option value="110">110 кВ</option>}
                <option value="35">35 кВ</option>
                <option value="20">20 кВ</option>
                <option value="10.5">10.5 кВ</option>
                <option value="10">10 кВ</option>
                <option value="6.3">6.3 кВ</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Секция НН1 (кВ)
              </label>
              <select
                value={input.voltageLv1Kv || input.voltageLvKv || 10.5}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({ ...input, voltageLv1Kv: val, voltageLvKv: val });
                }}
                className="w-full px-3 py-2.5 text-sm bg-white border border-[#0b3d66]/40 rounded-xl font-semibold text-[#0b3d66] focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
              >
                {[10.5, 10, 6.3, 3.15, 0.69, 0.4]
                  .filter((v) => v < input.voltageHvKv)
                  .map((v) => (
                    <option key={v} value={v}>
                      {v === 0.4 ? '0.4 кВ (380 В)' : `${v} кВ`}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Секция НН2 (кВ)
              </label>
              <select
                value={input.voltageLv2Kv || input.voltageLvKv || 10.5}
                onChange={(e) => onChange({ ...input, voltageLv2Kv: parseFloat(e.target.value) })}
                className="w-full px-3 py-2.5 text-sm bg-white border border-[#0b3d66]/40 rounded-xl font-semibold text-[#0b3d66] focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
              >
                {[10.5, 10, 6.3, 3.15, 0.69, 0.4]
                  .filter((v) => v < input.voltageHvKv)
                  .map((v) => (
                    <option key={v} value={v}>
                      {v === 0.4 ? '0.4 кВ (380 В)' : `${v} кВ`}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
            ⚡ <strong>Расщепление НН:</strong> 2 независимые полуобмотки по{' '}
            <span className="font-bold text-[#0b3d66]">
              {(input.powerKva / 2).toLocaleString('ru-RU')} кВА
            </span>{' '}
            каждая. Коэффициент расщепления <span className="font-bold text-[#0b3d66]">Красщ = 3.5</span> (ГОСТ Р 52719). Обеспечивает снижение ударного тока КЗ на шинах РУ в 2 раза.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Напряжение ВН (кВ)
            </label>
            <select
              value={input.voltageHvKv}
              onChange={(e) => onChange({ ...input, voltageHvKv: parseFloat(e.target.value) })}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              <option value="6">6 кВ</option>
              <option value="10">10 кВ</option>
              <option value="10.5">10.5 кВ</option>
              <option value="15">15 кВ</option>
              <option value="20">20 кВ</option>
              <option value="24">24 кВ</option>
              <option value="35">35 кВ</option>
              <option value="38.5">38.5 кВ</option>
              {isOil && <option value="110">110 кВ</option>}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Напряжение НН (кВ)
            </label>
            <select
              value={input.voltageLvKv}
              onChange={(e) => onChange({ ...input, voltageLvKv: parseFloat(e.target.value) })}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              <option value="0.4">0.4 кВ (380 В)</option>
              <option value="0.69">0.69 кВ (690 В)</option>
              <option value="3.15">3.15 кВ</option>
              <option value="6.3">6.3 кВ</option>
              <option value="10.5">10.5 кВ</option>
              {input.voltageHvKv >= 35 && <option value="35">35 кВ</option>}
            </select>
          </div>
        </div>
      )}

      {/* 5. Специфические настройки для масляных / сухих */}
      {isOil ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Система охлаждения
            </label>
            <select
              value={input.oilCoolingType || 'ONAN'}
              onChange={(e) => onChange({ ...input, oilCoolingType: e.target.value as OilCoolingType })}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              <option value="ONAN">ONAN (естественное масляное)</option>
              <option value="ONAF">ONAF (с принудительным дутьем)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Схема и группа соединений
            </label>
            <select
              value={
                input.vectorGroup ||
                (input.windingConfig === 'three_winding'
                  ? 'Y0/Y0/Δ-11-11'
                  : input.windingConfig === 'split_winding'
                  ? 'Y0/Δ-11-11'
                  : input.voltageHvKv >= 35
                  ? 'YNd11'
                  : 'Yyn0')
              }
              onChange={(e) => onChange({ ...input, vectorGroup: e.target.value })}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              {input.windingConfig === 'three_winding' ? (
                <>
                  <option value="Y0/Y0/Δ-11-11">Yн/Yн/Д-11-11 (типовая 110/35/10 кВ)</option>
                  <option value="Y0/Δ/Δ-11-11">Yн/Д/Д-11-11</option>
                  <option value="Y/Y/Δ-12-11">Y/Y/Д-12-11</option>
                </>
              ) : input.windingConfig === 'split_winding' ? (
                <>
                  <option value="Y0/Δ-11-11">Yн/Д-11-11 (расщепленная НН1-НН2)</option>
                  <option value="Y0/Y0/Y0-0-0">Yн/Yн/Yн-0-0</option>
                  <option value="D/Y0/Y0-11-11">Д/Yн/Yн-11-11 (12-пульсный)</option>
                </>
              ) : (
                <>
                  <option value="Yyn0">Y/Yн-0 (Звезда/Звезда с нулем)</option>
                  <option value="Dyn11">Д/Ун-11 (Треугольник/Звезда с нулем)</option>
                  <option value="YNd11">Yн/Д-11 (Звезда с нулем/Треугольник)</option>
                  <option value="Yd11">Y/Д-11</option>
                </>
              )}
            </select>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Исполнение
            </label>
            <select
              value={input.enclosure || 'IP00'}
              onChange={(e) => onChange({ ...input, enclosure: e.target.value as EnclosureType })}
              className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              <option value="IP00">IP00 (без кожуха)</option>
              <option value="IP21">IP21 (с кожухом)</option>
              <option value="IP31">IP31 (пылезащитный)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Охлаждение
            </label>
            <select
              value={input.dryCoolingType || 'AN'}
              onChange={(e) => onChange({ ...input, dryCoolingType: e.target.value as DryCoolingType })}
              className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              <option value="AN">AN (естественное)</option>
              <option value="AF">AF (вентиляторы +40%)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Изоляция
            </label>
            <select
              value={input.dryInsulationType || 'cast_resin'}
              onChange={(e) => onChange({ ...input, dryInsulationType: e.target.value as DryInsulationType })}
              className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b3d66] shadow-sm"
            >
              <option value="cast_resin">ТСЛ (литая F)</option>
              <option value="nomex">ТСВБ (Nomex H)</option>
            </select>
          </div>
        </div>
      )}

      {/* 6. Предупреждения и рекомендации */}
      {warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-1.5">
          {warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5">
          {recommendations.map((r, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
              <Info className="w-4 h-4 text-[#0b3d66] shrink-0 mt-0.5" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
