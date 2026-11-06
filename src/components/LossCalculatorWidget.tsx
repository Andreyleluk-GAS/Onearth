import React, { useState } from 'react';
import { Zap, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';

export const LossCalculatorWidget: React.FC<{
  onOpenQuoteModal?: (power?: string) => void;
}> = ({ onOpenQuoteModal }) => {
  const [selectedPower, setSelectedPower] = useState<number>(1000);
  const [hoursPerYear, setHoursPerYear] = useState<number>(8760); // 24x365
  const [tariffRub, setTariffRub] = useState<number>(6.5); // 6.50 rub/kWh typical industrial

  // Standard vs Low-loss 10 kV P0 data (exact client data)
  const lossData: Record<number, { standardP0: number; lowLossP0: number }> = {
    630: { standardP0: 1170, lowLossP0: 750 },
    800: { standardP0: 1360, lowLossP0: 875 },
    1000: { standardP0: 1590, lowLossP0: 1020 },
    1250: { standardP0: 1880, lowLossP0: 1205 },
    1600: { standardP0: 2200, lowLossP0: 1415 },
    2000: { standardP0: 2740, lowLossP0: 1760 },
    2500: { standardP0: 3240, lowLossP0: 2080 },
  };

  const current = lossData[selectedPower] || lossData[1000];
  const deltaP0Watts = current.standardP0 - current.lowLossP0;
  const savingPercent = Math.round((deltaP0Watts / current.standardP0) * 100);

  // Annual kWh savings from no-load losses
  const annualKwhSaved = Math.round((deltaP0Watts * hoursPerYear) / 1000);
  // Annual financial savings
  const annualRubSaved = Math.round(annualKwhSaved * tariffRub);
  // 10-year lifetime savings
  const tenYearRubSaved = annualRubSaved * 10;

  return (
    <div className="bg-gradient-to-br from-[#0b3d66] to-[#072640] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/40">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-blue-800/60">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 text-[#e6a417] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Инженерно-экономический калькулятор
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Расчёт экономии при заказе трансформаторов с пониженными потерями
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            Сравнение технологических потерь холостого хода (P₀) стандартного исполнения и энергоэффективной серии
          </p>
        </div>

        {/* Quick Power selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold mr-1">Мощность:</span>
          {Object.keys(lossData).map((pStr) => {
            const p = Number(pStr);
            const isSelected = p === selectedPower;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPower(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#e6a417] text-[#072640] shadow-md scale-105'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {p} кВА
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Parameters + Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        {/* Sliders / Inputs */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Время работы в году:</span>
              <span className="font-mono text-white font-bold">{hoursPerYear} ч / год</span>
            </div>
            <input
              type="range"
              min="4000"
              max="8760"
              step="200"
              value={hoursPerYear}
              onChange={(e) => setHoursPerYear(Number(e.target.value))}
              className="w-full accent-[#e6a417] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>1 смена (4 000 ч)</span>
              <span>2 смены (6 000 ч)</span>
              <span>24/7 (8 760 ч)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>Тариф электроэнергии (без НДС):</span>
              <span className="font-mono text-white font-bold">{tariffRub.toFixed(2)} ₽ / кВт·ч</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="11.0"
              step="0.25"
              value={tariffRub}
              onChange={(e) => setTariffRub(Number(e.target.value))}
              className="w-full accent-[#e6a417] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>4.00 ₽</span>
              <span>Средний (6.50 ₽)</span>
              <span>11.00 ₽</span>
            </div>
          </div>

          {/* Visual Loss comparison bar */}
          <div className="bg-black/20 rounded-xl p-3.5 border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Стандартная серия (P₀):</span>
              <span className="text-white font-mono">{current.standardP0} Вт</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-slate-300 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>

            <div className="text-xs font-semibold text-[#e6a417] flex justify-between pt-1">
              <span>Серия с пониженными потерями (P₀):</span>
              <span className="font-mono">{current.lowLossP0} Вт (-{savingPercent}%)</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#e6a417] h-full rounded-full transition-all duration-300"
                style={{ width: `${(current.lowLossP0 / current.standardP0) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Results Banner Cards */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="text-xs text-slate-300 flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-4 h-4 text-[#e6a417]" />
              Снижение потерь
            </div>
            <div className="text-2xl font-black text-white font-mono my-1">
              -{savingPercent}%
            </div>
            <div className="text-[11px] text-slate-300">
              Экономия <strong className="text-white">{deltaP0Watts} Вт</strong> в каждый час непрерывной работы
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="text-xs text-slate-300 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              Экономия за год
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono my-1">
              {annualKwhSaved.toLocaleString('ru-RU')}
            </div>
            <div className="text-[11px] text-slate-300">
              кВт·ч сбережённой электроэнергии в год
            </div>
          </div>

          {/* Card 3 (Monetary) */}
          <div className="bg-[#e6a417] text-[#072640] rounded-xl p-4 shadow-lg flex flex-col justify-between">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Финансовый эффект
            </div>
            <div className="text-2xl font-black font-mono my-1">
              {annualRubSaved.toLocaleString('ru-RU')} ₽
            </div>
            <div className="text-[11px] font-semibold text-[#072640]/80">
              Ежегодная экономия бюджетов предприятия
            </div>
          </div>

          {/* 10-Year cumulative callout */}
          <div className="sm:col-span-3 bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-300">
                Суммарная прямая экономия за нормативный срок эксплуатации (10 лет):
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#e6a417] font-mono mt-0.5">
                {tenYearRubSaved.toLocaleString('ru-RU')} рублей
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuoteModal?.(String(selectedPower))}
              className="inline-flex items-center gap-2 bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Запросить КП на {selectedPower} кВА
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
