import React from 'react';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
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

  // Lowest and highest no-load loss in the series
  const minP0 = Math.min(...category.specs.map((s) => s.p0_w));
  const maxP0 = Math.max(...category.specs.map((s) => s.p0_w));

  const checkItem1 =
    language === 'zh'
      ? 'Pt100/PTC 绕组过热温控保护'
      : language === 'en'
      ? 'Pt100/PTC thermal protection & sensors'
      : 'PTC-датчики перегрева + терморегулятор';

  const checkItem2 =
    language === 'zh'
      ? '权威出厂检验试验报告 (Test Report)'
      : language === 'en'
      ? 'Factory Test Report included'
      : 'Заводской протокол испытаний';

  return (
    <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Visual Product Showcase Header */}
      <div className="relative bg-[#f8fafc] border-b border-surface-border p-6 flex items-center justify-center min-h-[220px]">
        {/* Voltage Tag */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-[#0b3d66] text-white text-xs font-black px-2.5 py-1 rounded-md tracking-wider">
            {category.voltageClass} {t.catalogShowcase.voltage}
          </span>
          {category.lossClass === 'low_loss' && (
            <span className="bg-[#e6a417] text-[#072640] text-xs font-black px-2 py-1 rounded-md uppercase tracking-wider">
              {t.catalogShowcase.energySaving}
            </span>
          )}
        </div>

        {/* Incoterms Tag */}
        <div className="absolute top-3 right-3 text-[10px] font-bold text-slate-500 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-xs">
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
          <button
            type="button"
            onClick={() => onNavigate(`/katalog/${category.slug}`)}
            className="text-left w-full"
          >
            <h3 className="text-base font-black text-navy group-hover:text-navy-light transition-colors line-clamp-2 leading-snug">
              {category.title}
            </h3>
          </button>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {category.description}
          </p>

          {/* Quick Technical Specs Pill Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] bg-[#f6f8fa] p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block">{t.catalogShowcase.powerRange}</span>
              <strong className="text-navy font-bold">{t.catalogShowcase.powerVal}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t.categoryDetail.voltageHVLabel}</span>
              <strong className="text-navy font-bold truncate block">{category.voltageHV}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t.catalogShowcase.noLoadLossRange}</span>
              <strong className="text-navy font-mono font-bold">{minP0} – {maxP0} {t.catalogShowcase.watts}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">{t.categoryDetail.regulationLabel}</span>
              <strong className="text-navy font-bold">{category.regulationType}</strong>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <ul className="mt-3.5 space-y-1 text-xs text-slate-600">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{checkItem1}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{checkItem2}</span>
            </li>
          </ul>
        </div>

        {/* Card CTA Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate(`/katalog/${category.slug}`)}
            className="flex-1 inline-flex items-center justify-center gap-1 bg-[#0b3d66] hover:bg-navy-dark text-white py-2 px-3 rounded-xl font-bold text-xs transition-colors"
          >
            {t.catalogShowcase.detailsBtn}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onOpenQuoteModal(category.slug)}
            className="inline-flex items-center justify-center gap-1 bg-[#fff7e6] hover:bg-[#ffecc2] text-[#072640] border border-[#e6a417]/40 py-2 px-3 rounded-xl font-bold text-xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#e6a417]" />
            {t.catalogShowcase.orderBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

