import React from 'react';
import { ArrowRight, Zap, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { TransformerCategory } from '../types/transformer';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  category: TransformerCategory;
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug: string) => void;
}

export const TransformerCard: React.FC<Props> = ({
  category,
  onNavigate,
  onOpenQuoteModal,
}) => {
  const { t, language } = useLanguage();

  const isLowLoss = category.lossClass === 'low_loss' || category.ecoBadge;

  const getInsulationDisplay = () => {
    if (language === 'zh') {
      if (category.insulationType === 'cast_resin') return '环氧树脂浇注 (F/H)';
      if (category.insulationType === 'air_barrier') return '杜邦 Nomex 敞开干变 (H)';
      return '全密封矿物油浸式';
    }
    if (language === 'en') {
      if (category.insulationType === 'cast_resin') return 'Cast Resin (F/H Class)';
      if (category.insulationType === 'air_barrier') return 'DuPont Nomex Open (H)';
      return 'Mineral Oil Hermetic';
    }
    if (category.insulationType === 'cast_resin') return 'Литая смола (F/H)';
    if (category.insulationType === 'air_barrier') return 'Nomex воздушно-барьерная (H)';
    return 'Масло герметичное';
  };

  const getCardAdvantage = () => {
    if (language === 'zh') {
      return ['Pt100/PTC 绕组过热温控保护与传感器', '出厂例行及型式试验报告 (Test Report)'];
    }
    if (language === 'en') {
      return ['Pt100/PTC thermal protection & sensors', 'Official Factory Test Report included'];
    }
    return ['PTC-датчики перегрева + терморегулятор', 'Заводской протокол приёмо-сдаточных испытаний'];
  };

  const [adv1, adv2] = getCardAdvantage();

  return (
    <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Visual Product Showcase Header */}
      <div className="relative bg-[#f8fafc] border-b border-surface-border p-6 flex items-center justify-center min-h-[220px]">
        {/* Top-Left Labels / Stickers */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-[#0b3d66] text-white text-xs font-black px-2.5 py-1 rounded-md tracking-wider shadow-xs">
              {category.voltageClass} {t.catalogShowcase.voltage}
            </span>

            {/* Series Code Pill */}
            <span className="bg-white/95 border border-slate-300 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
              {category.seriesCode}
            </span>
          </div>

          {/* Bright ECO / Low-Loss Sticker */}
          {isLowLoss && (
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md flex items-center gap-1 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
              <span>ECO · {language === 'zh' ? '低损耗' : language === 'en' ? 'Low Losses' : 'Пониженные потери'}</span>
            </span>
          )}

          {/* RPN Tap Changer Badge */}
          {category.regulationType.includes('РПН') && (
            <span className="bg-[#e6a417] text-[#072640] text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
              РПН (под нагрузкой)
            </span>
          )}
        </div>

        {/* Top-Right Delivery Basis Tag */}
        <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-600 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-xs">
          {t.catalogShowcase.fca}
        </div>

        {/* Transformer Image */}
        <img
          src={category.image}
          alt={category.title}
          loading="lazy"
          className="max-h-44 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Compact Product Title */}
          <button
            type="button"
            onClick={() => onNavigate(`/katalog/${category.slug}`)}
            className="text-left w-full group/title"
          >
            <h3 className="text-base font-black text-navy group-hover/title:text-navy-light transition-colors line-clamp-2 leading-snug">
              {category.compactTitle || category.title}
            </h3>
          </button>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {category.description}
          </p>

          {/* Unified Comparison Characteristics Table */}
          <div className="mt-3.5 border border-slate-200 rounded-xl overflow-hidden text-[11px] bg-[#fbfcfd]">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-1.5 px-3 text-slate-500 font-medium">
                    {language === 'zh' ? '额定电压 (高/低)' : language === 'en' ? 'Voltage (HV / LV)' : 'Напряжение (ВН / НН)'}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold text-navy">
                    {category.voltageClass}&nbsp;кВ / {category.voltageLV}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-1.5 px-3 text-slate-500 font-medium">
                    {language === 'zh' ? '调压方式' : language === 'en' ? 'Tap Regulation' : 'Регулирование'}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold text-navy">
                    <span className={category.regulationType.includes('РПН') ? 'text-[#0b3d66] font-black' : 'text-slate-800'}>
                      {category.regulationType}
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-1.5 px-3 text-slate-500 font-medium">
                    {language === 'zh' ? '能效损耗等级' : language === 'en' ? 'Efficiency Level' : 'Уровень потерь'}
                  </td>
                  <td className="py-1.5 px-3 text-right font-bold">
                    {isLowLoss ? (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-black text-[10px]">
                        ECO · Пониженные
                      </span>
                    ) : (
                      <span className="text-slate-700 font-medium">
                        {language === 'zh' ? '标准损耗' : language === 'en' ? 'Standard' : 'Стандартные'}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-1.5 px-3 text-slate-500 font-medium">
                    {language === 'zh' ? '绝缘形式' : language === 'en' ? 'Insulation Type' : 'Тип изоляции'}
                  </td>
                  <td className="py-1.5 px-3 text-right font-semibold text-slate-700 truncate max-w-[150px]">
                    {getInsulationDisplay()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Key Advantages Checklist */}
          <ul className="mt-3.5 space-y-1 text-xs text-slate-600">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{adv1}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{adv2}</span>
            </li>
          </ul>
        </div>

        {/* Card CTA Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate(`/katalog/${category.slug}`)}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-[#0b3d66] hover:bg-navy-dark text-white py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            {t.catalogShowcase.detailsBtn}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onOpenQuoteModal(category.slug)}
            className="inline-flex items-center justify-center gap-1 bg-[#fff7e6] hover:bg-[#ffecc2] text-[#072640] border border-[#e6a417]/40 py-2 px-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#e6a417]" />
            {t.catalogShowcase.orderBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
