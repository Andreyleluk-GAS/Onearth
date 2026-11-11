import React, { useState } from 'react';
import { TransformerCategory } from '../types/transformer';
import { TechnicalLossChart } from '../components/TechnicalLossChart';
import { CheckCircle2, ChevronRight, Zap, Mail, Sliders } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  category: TransformerCategory;
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug: string, power?: string) => void;
}

export const CategoryDetailPage: React.FC<Props> = ({
  category,
  onNavigate,
  onOpenQuoteModal,
}) => {
  const { t, language, categories } = useLanguage();
  const [selectedPowerFilter, setSelectedPowerFilter] = useState<number | 'all'>('all');

  const related = categories.filter((c) => c.slug !== category.slug).slice(0, 3);

  const availablePowers = Array.from(new Set(category.specs.map((s) => s.power_kva))).sort((a, b) => a - b);

  const displayedSpecs = selectedPowerFilter === 'all'
    ? category.specs
    : category.specs.filter((s) => s.power_kva === selectedPowerFilter);

  const ipBase = language === 'zh' ? 'IP00（本体）/ IP31' : language === 'en' ? 'IP00 (Base) / IP31' : 'IP00 (базовая) / IP31';

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-surface-border py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-slate-500">
          <button type="button" onClick={() => onNavigate('/')} className="hover:text-navy cursor-pointer">
            {t.categoryDetail.breadcrumbHome}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button type="button" onClick={() => onNavigate('/katalog')} className="hover:text-navy cursor-pointer">
            {t.categoryDetail.breadcrumbCatalog}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-bold truncate">{category.shortTitle}</span>
        </div>
      </div>

      {/* Hero Header Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#0b3d66] text-white text-xs font-black px-2.5 py-1 rounded-md">
                {t.categoryDetail.voltageBadge} {category.voltageClass} {t.catalogShowcase.voltage}
              </span>
              {category.lossClass === 'low_loss' && (
                <span className="bg-[#e6a417] text-[#072640] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {t.categoryDetail.lowLossBadge}
                </span>
              )}
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                {t.categoryDetail.fcaBadge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-navy leading-tight">
              {category.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {category.description}
            </p>

            {/* Quick Specs Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">{t.categoryDetail.powerLabel}</span>
                <strong className="text-navy text-sm font-bold">{t.categoryDetail.powerVal}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">{t.categoryDetail.voltageHVLabel}</span>
                <strong className="text-navy text-sm font-bold truncate block">{category.voltageHV}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">{t.categoryDetail.voltageLVLabel}</span>
                <strong className="text-navy text-sm font-bold">{category.voltageLV}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">{t.categoryDetail.connectionLabel}</span>
                <strong className="text-navy text-sm font-bold">{category.connectionGroup}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">{t.categoryDetail.regulationLabel}</span>
                <strong className="text-navy text-sm font-bold">{category.regulationType}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">
                  {language === 'zh' ? '防护等级：' : language === 'en' ? 'Ingress Protection:' : 'Степень защиты:'}
                </span>
                <strong className="text-navy text-sm font-bold">{ipBase}</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenQuoteModal(category.slug)}
                className="bg-[#0b3d66] hover:bg-navy-dark text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#e6a417]" />
                {t.categoryDetail.getQuoteBtn}
              </button>

              <a
                href="mailto:mail@mail.ru"
                className="bg-[#fff7e6] hover:bg-[#ffeed1] text-[#935d03] border border-[#e6a417]/50 px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#e6a417]" />
                mail@mail.ru
              </a>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 bg-[#f8fafc] rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center relative">
            <img
              src={category.image}
              alt={category.title}
              className="max-h-72 object-contain drop-shadow-md"
            />
            <div className="text-[11px] text-slate-500 mt-4 text-center">
              {t.categoryDetail.photoAlt} {category.shortTitle}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-navy">
                {t.categoryDetail.specsTableTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'zh'
                  ? '工厂实测电气参数：空载损耗 P₀、负载损耗 P_k、空载电流 I₀ 及阻抗电压 U_k'
                  : language === 'en'
                  ? 'Factory technical matrix: no-load loss P₀, load loss P_k, no-load current I₀, and impedance U_k'
                  : 'Заводские параметры: потери холостого хода P₀, потери КЗ Pкз, ток Ixx и напряжение КЗ Uк'}
              </p>
            </div>

            {/* Quick power filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold mr-1">{t.categoryDetail.filterByPower}</span>
              <button
                type="button"
                onClick={() => setSelectedPowerFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedPowerFilter === 'all'
                    ? 'bg-[#0b3d66] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.categoryDetail.allPowers}
              </button>
              {availablePowers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPowerFilter(p)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedPowerFilter === p
                      ? 'bg-[#0b3d66] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* The Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse min-w-[860px]">
              <thead>
                <tr className="bg-[#0b3d66] text-white text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 font-bold text-left rounded-tl-lg">{t.categoryDetail.thPower}</th>
                  <th className="py-3 px-3 font-bold">{t.categoryDetail.thHV}</th>
                  <th className="py-3 px-3 font-bold">{t.categoryDetail.thLV}</th>
                  <th className="py-3 px-3 font-bold">{t.categoryDetail.thGroup}</th>
                  <th className="py-3 px-3 font-bold bg-[#072640]">{t.categoryDetail.thP0}</th>

                  {category.tableType === 'dry_f_h' && (
                    <>
                      <th className="py-3 px-3 font-bold">{t.categoryDetail.thPkzF}</th>
                      <th className="py-3 px-3 font-bold">{t.categoryDetail.thPkzH}</th>
                    </>
                  )}

                  {category.tableType === 'dry_h' && (
                    <th className="py-3 px-3 font-bold">{t.categoryDetail.thPkzH}</th>
                  )}

                  {(category.tableType === 'oil' || category.tableType === 'special') && (
                    <th className="py-3 px-3 font-bold">{t.categoryDetail.thPkz}</th>
                  )}

                  <th className="py-3 px-3 font-bold">{t.categoryDetail.thI0}</th>
                  <th className="py-3 px-3 font-bold">{t.categoryDetail.thUk}</th>
                  <th className="py-3 px-3 font-bold text-right rounded-tr-lg">{t.categoryDetail.thAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {displayedSpecs.map((spec, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-blue-50/60 transition-colors ${
                      idx % 2 === 1 ? 'bg-[#f8fafc]' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-navy text-left text-sm">
                      {spec.power_kva} kVA
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {spec.voltage_hv_str || category.voltageHV}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">
                      {spec.voltage_lv_str || category.voltageLV}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {spec.connection_group || category.connectionGroup}
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-navy bg-slate-50/80">
                      {spec.p0_w.toLocaleString()}
                    </td>

                    {category.tableType === 'dry_f_h' && (
                      <>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {spec.pkz_f_w?.toLocaleString() || '—'}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {spec.pkz_h_w?.toLocaleString() || '—'}
                        </td>
                      </>
                    )}

                    {category.tableType === 'dry_h' && (
                      <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                        {spec.pkz_h_w?.toLocaleString()}
                      </td>
                    )}

                    {(category.tableType === 'oil' || category.tableType === 'special') && (
                      <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                        {(spec.pkz_w || spec.pkz_f_w)?.toLocaleString()}
                      </td>
                    )}

                    <td className="py-3 px-3 font-mono text-slate-600">
                      {spec.i0_pct}%
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-navy">
                      {spec.uk_pct}%
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenQuoteModal(category.slug, String(spec.power_kva))}
                        className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-3 py-1.5 rounded-lg font-bold text-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        {t.categoryDetail.calcQuote}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Visual Loss Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <TechnicalLossChart specs={category.specs} categoryTitle={category.title} />
      </section>

      {/* Equipment & Options Two-Column Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard Equipment */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-navy border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h3 className="text-base font-black uppercase tracking-wider">
                {t.categoryDetail.standardEqTitle}
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {category.standardEquipment.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Available Options */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-navy border-b border-slate-100 pb-3">
              <Sliders className="w-5 h-5 text-[#e6a417] shrink-0" />
              <h3 className="text-base font-black uppercase tracking-wider">
                {t.categoryDetail.optionsTitle}
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              {category.options.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-[#935d03] font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    +
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-black text-navy">
              {language === 'zh' ? '需要技术咨询或定制方案核算？' : language === 'en' ? 'Need Consultation or Cost Estimation?' : 'Нужна консультация или расчёт?'}
            </h4>
            <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
              {language === 'zh'
                ? '请将采购单、技术规格书或工程图纸发送至 mail@mail.ru — 我们将为您提供完备的工厂技术方案与 FCA (Free Carrier) 交付报价。'
                : language === 'en'
                ? 'Send your questionnaire, technical assignment, or project parameters to mail@mail.ru — we will prepare a full commercial offer with technical documentation and FCA (Free Carrier) delivery calculation.'
                : 'Отправьте опросный лист, техническое задание или параметры проекта на mail@mail.ru — подготовим коммерческое предложение с технической документацией и расчётом поставки на условиях FCA (Free Carrier).'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuoteModal(category.slug)}
              className="bg-[#0b3d66] hover:bg-navy-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {t.nav.rfq}
            </button>
            <a
              href="tel:+73431234567"
              className="bg-white hover:bg-slate-50 text-navy border border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              +7 (343) 123-45-67
            </a>
          </div>
        </div>
      </section>

      {/* Related Categories Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          {t.categoryDetail.relatedTitle}:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((rel) => (
            <button
              key={rel.slug}
              type="button"
              onClick={() => onNavigate(`/katalog/${rel.slug}`)}
              className="bg-white p-4 rounded-xl border border-surface-border text-left hover:border-navy hover:shadow-md transition-all group cursor-pointer"
            >
              <span className="text-[10px] font-bold text-[#e6a417] uppercase tracking-wider">
                {rel.voltageClass} {t.catalogShowcase.voltage}
              </span>
              <h4 className="text-xs font-bold text-navy group-hover:text-navy-light mt-1 line-clamp-1">
                {rel.shortTitle}
              </h4>
              <span className="text-[11px] text-slate-400 mt-2 inline-flex items-center gap-1 group-hover:text-navy">
                {language === 'zh' ? '查看技术规格 →' : language === 'en' ? 'View Specifications →' : 'Перейти к характеристикам →'}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
