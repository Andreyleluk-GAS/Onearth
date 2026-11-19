import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  Send,
  HelpCircle,
  Truck,
  Clock,
} from 'lucide-react';
import { TransformerCalculationResult } from '../../services/transformerCalculator/types';

interface Props {
  result: TransformerCalculationResult;
  onOpenQuoteModal: () => void;
}

export const TransformerCostCard: React.FC<Props> = ({
  result,
  onOpenQuoteModal,
}) => {
  const [currency, setCurrency] = useState<'RUB' | 'USD' | 'CNY'>('RUB');
  const { cost, input } = result;

  const displayPrice =
    currency === 'RUB'
      ? `${cost.totalEstimatedCostRub.toLocaleString('ru-RU')} ₽`
      : currency === 'USD'
      ? `$ ${cost.totalEstimatedCostUsd.toLocaleString('en-US')}`
      : `¥ ${cost.totalEstimatedCostCny.toLocaleString('zh-CN')}`;

  const formatAmount = (amountRub: number) => {
    if (currency === 'RUB') {
      return `${amountRub.toLocaleString('ru-RU')} ₽`;
    }
    if (currency === 'USD') {
      const ratio = cost.totalEstimatedCostRub > 0 ? cost.totalEstimatedCostUsd / cost.totalEstimatedCostRub : 1 / 94;
      const amountUsd = Math.round(amountRub * ratio);
      return `$ ${amountUsd.toLocaleString('en-US')}`;
    }
    // CNY (¥)
    const ratio = cost.totalEstimatedCostRub > 0 ? cost.totalEstimatedCostCny / cost.totalEstimatedCostRub : 1 / 13;
    const amountCny = Math.round(amountRub * ratio);
    return `¥ ${amountCny.toLocaleString('zh-CN')}`;
  };

  return (
    <div className="bg-gradient-to-br from-[#072640] via-[#0b3d66] to-[#0a3558] rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-white/15 flex flex-col justify-between space-y-6">
      {/* Шапка блока стоимости */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-1.5 bg-[#e6a417]/20 border border-[#e6a417]/40 text-[#e6a417] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" />
            Ориентировочная стоимость
          </div>

          {/* Переключатель валюты */}
          <div className="inline-flex bg-black/20 p-0.5 rounded-lg text-xs font-semibold border border-white/10">
            <button
              type="button"
              onClick={() => setCurrency('RUB')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currency === 'RUB' ? 'bg-[#e6a417] text-[#072640] font-bold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              RUB (₽)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currency === 'USD' ? 'bg-[#e6a417] text-[#072640] font-bold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('CNY')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currency === 'CNY' ? 'bg-[#e6a417] text-[#072640] font-bold shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              CNY (¥)
            </button>
          </div>
        </div>

        <div className="mt-3">
          <span className="text-xs text-slate-300 block mb-1">
            Расчетная базовая стоимость:
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {displayPrice}
          </div>
          <span className="text-[11px] text-slate-300 block mt-1">
            Базис поставки: FCA Маньчжурия (Инкотермс 2020) / Завод Hubei Onearth
          </span>
        </div>
      </div>

      {/* Покомпонентная структура себестоимости */}
      <div className="bg-black/20 rounded-xl p-4 border border-white/10 text-xs space-y-2.5">
        <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-white/10">
          <span>Сырье и материалы (медь, электросталь, масло):</span>
          <span className="font-bold text-white shrink-0 whitespace-nowrap ml-2 text-right">
            {formatAmount(cost.materialsCost)}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-white/10">
          <span>
            Комплектующие (вводы, изоляция, ПБВ/РПН
            {input.type === 'oil' && input.oilCoolingType === 'ONAF' && ', вентиляторы ONAF и ШАОТ'}
            {input.type === 'dry' && input.dryCoolingType === 'AF' && ', вентиляторы AF'}
            ):
          </span>
          <span className="font-bold text-white shrink-0 whitespace-nowrap ml-2 text-right">
            {formatAmount(cost.accessoriesCost)}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-300">
          <span>Производство, сборка и заводские испытания FAT:</span>
          <span className="font-bold text-white shrink-0 whitespace-nowrap ml-2 text-right">
            {formatAmount(cost.overheadAndLaborCost)}
          </span>
        </div>
      </div>

      {/* Преимущества и гарантии */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-200">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#e6a417] shrink-0" />
          <span>ТКП за 2 часа</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Гарантия до 5 лет</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-[#e6a417] shrink-0" />
          <span>Прямой контракт с заводом</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileCheck2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>ГОСТ 52719-2007 / ТР ТС</span>
        </div>
      </div>

      {/* Главная кнопка действия (Воронка продаж) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={onOpenQuoteModal}
          className="w-full py-3.5 px-4 bg-[#e6a417] hover:bg-[#d49512] text-[#072640] font-black rounded-xl text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Получить официальное ТКП с фиксацией цены
        </button>

        <p className="text-[11px] text-center text-slate-400 leading-tight">
          Инженер завода свяжется в течение 2 часов, проверит проектные требования и подготовит официальное ТКП с чертежом.
        </p>
      </div>
    </div>
  );
};
