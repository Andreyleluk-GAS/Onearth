import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Factory, Settings, Truck, FileCheck2, Cpu, ZoomIn, Eye, X } from 'lucide-react';
import { TransformerCard } from '../components/TransformerCard';
import { LossCalculatorWidget } from '../components/LossCalculatorWidget';
import { useLanguage } from '../i18n/LanguageContext';
import { trackMetrikaGoal } from '../services/yandexMetrika';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string, power?: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  const { t, categories } = useLanguage();
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);

  const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const licenseImgWebp = `${BASE}/images/chinese-business-license.webp`;
  const licenseImgPng = `${BASE}/images/chinese-business-license.png`;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#072640] via-[#0b3d66] to-[#0a3558] text-white pt-12 pb-20 sm:pb-28 overflow-hidden">
        {/* Subtle engineering background mesh / overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, description, CTA buttons */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 border border-[#e6a417]/40 text-[#e6a417] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {t.hero.badge}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
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
                  href="mailto:info@hubeienergy.ru"
                  className="text-xs text-slate-300 hover:text-white underline ml-2"
                >
                  {t.hero.sendQuestionnaire}
                </a>
              </div>
            </div>

            {/* Right Column: Chinese Business License Card */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-end">
              <div className="relative group bg-gradient-to-b from-white/15 to-white/5 border border-white/20 hover:border-[#e6a417]/70 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-md transition-all duration-300 max-w-md w-full">
                {/* Header badge inside card */}
                <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-[#e6a417] font-bold min-w-0">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#e6a417]" />
                    <span className="text-[12px] truncate">{t.hero.licenseBadge || 'Бизнес-лицензия КНР (营业执照)'}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded tracking-wider shrink-0 whitespace-nowrap">
                    {t.hero.licenseLegal || 'Регистрация КНР'}
                  </span>
                </div>

                {/* License Image with Zoom Hover Effect */}
                <div
                  onClick={() => {
                    trackMetrikaGoal('license_zoom_view');
                    setIsLicenseModalOpen(true);
                  }}
                  className="relative overflow-hidden rounded-xl border border-white/20 shadow-inner cursor-pointer group/img bg-slate-900/60 transition-transform duration-300 active:scale-[0.98]"
                  title="Нажмите для просмотра в высоком разрешении"
                >
                  <picture>
                    <source srcSet={licenseImgWebp} type="image/webp" />
                    <img
                      src={licenseImgPng}
                      alt="Отсканированная китайская бизнес-лицензия Hubei Onearth Trading Company Limited"
                      className="w-full h-auto object-cover rounded-xl transition-all duration-500 group-hover/img:scale-105 group-hover/img:brightness-105"
                      loading="eager"
                    />
                  </picture>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#072640]/65 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#e6a417] text-[#072640] flex items-center justify-center shadow-lg transform -translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                    <span className="text-white text-xs font-bold tracking-wide shadow-sm">
                      {t.hero.licenseZoom || 'Нажмите для увеличения'}
                    </span>
                  </div>
                </div>

                {/* Footer caption under license */}
                <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-300">
                  <div className="truncate">
                    <span className="font-semibold text-white block truncate">Hubei Onearth Trading Co., Ltd.</span>
                    <span className="text-[10px] text-slate-400">Официальное юридическое лицо</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLicenseModalOpen(true)}
                    className="text-[#e6a417] hover:text-amber-300 transition-colors flex items-center gap-1 font-bold text-[11px] shrink-0 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Просмотр</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hero Key Stats */}
          <div className="pt-8 mt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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
              href="tel:+73432269889"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs border border-white/20 text-center transition-colors"
            >
              +7 (343) 226-98-89
            </a>
          </div>
        </div>
      </section>

      {/* License Fullscreen Preview Modal */}
      {isLicenseModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all"
          onClick={() => setIsLicenseModalOpen(false)}
        >
          <div
            className="relative bg-[#072640] rounded-2xl border border-white/20 p-4 sm:p-6 max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-white shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#e6a417]" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    Бизнес-лицензия Hubei Onearth Trading Company Limited (营业执照)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Официальный государственный регистрационный документ юридического лица в КНР
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLicenseModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: High-Res Image */}
            <div className="flex-1 overflow-auto rounded-xl bg-slate-900/60 p-2 flex items-center justify-center">
              <picture>
                <source srcSet={licenseImgWebp} type="image/webp" />
                <img
                  src={licenseImgPng}
                  alt="Отсканированная китайская бизнес-лицензия Hubei Onearth Trading Company Limited"
                  className="max-h-[72vh] w-auto h-auto object-contain rounded-lg shadow-xl"
                />
              </picture>
            </div>

            {/* Modal Footer */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">
                Hubei Onearth Trading Co., Ltd. · Unified Social Credit Identifier / PRC
              </span>
              <button
                type="button"
                onClick={() => setIsLicenseModalOpen(false)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
