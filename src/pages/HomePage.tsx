import React from 'react';
import { ArrowRight, ShieldCheck, Factory, Settings, Truck, FileCheck2, Cpu } from 'lucide-react';
import { TransformerCard } from '../components/TransformerCard';
import { LossCalculatorWidget } from '../components/LossCalculatorWidget';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string, power?: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  const { t, categories } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#072640] via-[#0b3d66] to-[#0a3558] text-white pt-12 pb-20 sm:pb-28 overflow-hidden">
        {/* Subtle engineering background mesh / overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 border border-[#e6a417]/40 text-[#e6a417] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {t.hero.badge}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              {t.hero.description}
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/katalog')}
                className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                {t.hero.ctaCatalog}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/po-tz')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                {t.hero.ctaCustom}
              </button>

              <a
                href="mailto:mail@mail.ru"
                className="text-xs text-slate-300 hover:text-white underline ml-2"
              >
                {t.hero.sendQuestionnaire}
              </a>
            </div>

            {/* Quick Hero Key Stats */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">{t.hero.statPower}</span>
                <strong className="text-white text-base font-bold">{t.hero.statPowerVal}</strong>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">{t.hero.statVoltage}</span>
                <strong className="text-white text-base font-bold">{t.hero.statVoltageVal}</strong>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">{t.hero.statInsulation}</span>
                <strong className="text-white text-base font-bold">{t.hero.statInsulationVal}</strong>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">{t.hero.statReg}</span>
                <strong className="text-white text-base font-bold">{t.hero.statRegVal}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Tiles ("Что мы предлагаем") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            {t.features.subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy mt-2">
            {t.features.title}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {t.features.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#e6a417] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-4">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.features.f1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f1Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#0b3d66] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.features.f2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f2Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#e6a417] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-4">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.features.f3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f3Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#0b3d66] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.features.f4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.f4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Showcase Grid */}
      <section className="bg-slate-50 py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                {t.catalogShowcase.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy mt-2">
                {t.catalogShowcase.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {t.catalogShowcase.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/katalog')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3d66] hover:text-navy-light uppercase tracking-wider cursor-pointer"
            >
              {t.catalogShowcase.extendedCatalogBtn}
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <TransformerCard
                key={cat.slug}
                category={cat}
                onNavigate={onNavigate}
                onOpenQuoteModal={onOpenQuoteModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Loss Calculator & Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <LossCalculatorWidget onOpenQuoteModal={(p) => onOpenQuoteModal('suhie-litaya-10kv-pp', p)} />
      </section>

      {/* "Почему выбирают нас" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            {t.whyUs.subtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy mt-2">
            {t.whyUs.title}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {t.whyUs.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">{t.whyUs.c1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.c1Desc}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center shrink-0">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">{t.whyUs.c2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.c2Desc}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">{t.whyUs.c3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.c3Desc}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">{t.whyUs.c4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.whyUs.c4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0b3d66] to-[#072640] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider">
              {t.bottomCta.badge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {t.bottomCta.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.bottomCta.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 text-center cursor-pointer"
            >
              {t.bottomCta.btn}
            </button>
            <a
              href="tel:+73431234567"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs border border-white/20 text-center transition-colors"
            >
              +7 (343) 123-45-67
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
