import React, { useState } from 'react';
import { Zap, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const LossCalculatorWidget: React.FC<{
  onOpenQuoteModal?: (power?: string) => void;
}> = ({ onOpenQuoteModal }) => {
  const { t, language } = useLanguage();
  const [selectedPower, setSelectedPower] = useState<number>(1000);
  const [hoursPerYear, setHoursPerYear] = useState<number>(8760); // 24x365
  const [tariffRub, setTariffRub] = useState<number>(6.5); // 6.50 typical industrial base

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

  const curSymbol = language === 'zh' ? '¥' : language === 'en' ? 'RUB' : '₽';
  const curName = language === 'zh' ? '元' : language === 'en' ? 'RUB' : 'рублей';
  const hoursUnit = language === 'zh' ? '小时/年' : language === 'en' ? 'hrs/yr' : 'ч / год';
  const kwhUnit = language === 'zh' ? '度' : language === 'en' ? 'kWh' : 'кВт·ч';
  const wattsUnit = language === 'zh' ? '瓦 W' : language === 'en' ? 'W' : 'Вт';

  return (
    <div className="bg-gradient-to-br from-[#0b3d66] to-[#072640] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-900/40">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-blue-800/60">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 text-[#e6a417] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            {t.lossCalc.badge}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {t.lossCalc.title}
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            {t.lossCalc.desc}
          </p>
        </div>

        {/* Quick Power selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-300 font-semibold mr-1">{t.lossCalc.power}</span>
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
                {p} kVA
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
              <span>{t.lossCalc.hours}</span>
              <span className="font-mono text-white font-bold">{hoursPerYear} {hoursUnit}</span>
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
              <span>{language === 'zh' ? '单班 (4,000h)' : language === 'en' ? '1 Shift (4,000h)' : '1 смена (4 000 ч)'}</span>
              <span>{language === 'zh' ? '双班 (6,000h)' : language === 'en' ? '2 Shifts (6,000h)' : '2 смены (6 000 ч)'}</span>
              <span>{language === 'zh' ? '连续运行 (8,760h)' : language === 'en' ? '24/7 (8,760h)' : '24/7 (8 760 ч)'}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-300 mb-1.5">
              <span>{t.lossCalc.tariff}</span>
              <span className="font-mono text-white font-bold">{tariffRub.toFixed(2)} {curSymbol} / {kwhUnit}</span>
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
              <span>4.00 {curSymbol}</span>
              <span>{language === 'zh' ? '工商业均价' : language === 'en' ? 'Industrial Avg' : 'Средний'} (6.50 {curSymbol})</span>
              <span>11.00 {curSymbol}</span>
            </div>
          </div>

          {/* Visual Loss comparison bar */}
          <div className="bg-black/20 rounded-xl p-3.5 border border-white/5 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>{t.lossCalc.lossStd}</span>
              <span className="text-white font-mono">{current.standardP0} {wattsUnit}</span>
            </div>
            <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
              <div className="bg-slate-300 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>

            <div className="text-xs font-semibold text-[#e6a417] flex justify-between pt-1">
              <span>{t.lossCalc.lossLow}</span>
              <span className="font-mono">{current.lowLossP0} {wattsUnit} (-{savingPercent}%)</span>
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
              {t.lossCalc.deltaWatts}
            </div>
            <div className="text-2xl font-black text-white font-mono my-1">
              -{savingPercent}%
            </div>
            <div className="text-[11px] text-slate-300">
              {language === 'zh'
                ? `每连续运行小时减损 `
                : language === 'en'
                ? `Saved `
                : `Экономия `}
              <strong className="text-white">{deltaP0Watts} {wattsUnit}</strong>
              {language === 'zh' ? ' 铁芯损耗' : language === 'en' ? ' per hour' : ' в час'}
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-between">
            <div className="text-xs text-slate-300 flex items-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-emerald-400" />
              {t.lossCalc.savingKwh}
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono my-1">
              {annualKwhSaved.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-300">
              {kwhUnit} {language === 'zh' ? '每年节电总量' : language === 'en' ? 'saved annually' : 'в год'}
            </div>
          </div>

          {/* Card 3 (Monetary) */}
          <div className="bg-[#e6a417] text-[#072640] rounded-xl p-4 shadow-lg flex flex-col justify-between">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {t.lossCalc.savingRubYear}
            </div>
            <div className="text-2xl font-black font-mono my-1">
              {annualRubSaved.toLocaleString()} {curSymbol}
            </div>
            <div className="text-[11px] font-semibold text-[#072640]/80">
              {language === 'zh' ? '每年运行电费净节省' : language === 'en' ? 'Annual operational cash saved' : 'Ежегодная экономия бюджета'}
            </div>
          </div>

          {/* 10-Year cumulative callout */}
          <div className="sm:col-span-3 bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-300">
                {t.lossCalc.savingRub10Year}
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#e6a417] font-mono mt-0.5">
                {tenYearRubSaved.toLocaleString()} {curName}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuoteModal?.(String(selectedPower))}
              className="inline-flex items-center gap-2 bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              {language === 'zh'
                ? `索取 ${selectedPower} kVA 报价`
                : language === 'en'
                ? `Request Quote for ${selectedPower} kVA`
                : `Запросить КП на ${selectedPower} кВА`}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

