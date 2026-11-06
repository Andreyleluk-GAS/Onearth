import React, { useState } from 'react';
import { TransformerCategory, TransformerSpec } from '../types/transformer';
import { TechnicalLossChart } from '../components/TechnicalLossChart';
import { ShieldCheck, CheckCircle2, ChevronRight, FileText, ArrowRight, Zap, Phone, Mail, Sliders } from 'lucide-react';
import { getRelatedCategories } from '../data/transformerCatalog';

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
  const [selectedPowerFilter, setSelectedPowerFilter] = useState<number | 'all'>('all');
  const related = getRelatedCategories(category.slug);

  const displayedSpecs = selectedPowerFilter === 'all'
    ? category.specs
    : category.specs.filter((s) => s.power_kva === selectedPowerFilter);

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-surface-border py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-slate-500">
          <button type="button" onClick={() => onNavigate('/')} className="hover:text-navy">
            Главная
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button type="button" onClick={() => onNavigate('/katalog')} className="hover:text-navy">
            Каталог
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
                Класс напряжения: {category.voltageClass} кВ
              </span>
              {category.lossClass === 'low_loss' && (
                <span className="bg-[#e6a417] text-[#072640] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Пониженные потери
                </span>
              )}
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                FCA Маньчжурия
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
                <span className="text-slate-400 block text-[11px]">Мощность:</span>
                <strong className="text-navy text-sm font-bold">630 – 2500 кВА</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Напряжение ВН:</span>
                <strong className="text-navy text-sm font-bold truncate block">{category.voltageHV}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Напряжение НН:</span>
                <strong className="text-navy text-sm font-bold">{category.voltageLV}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Схема соединения:</span>
                <strong className="text-navy text-sm font-bold">{category.connectionGroup}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Регулирование:</span>
                <strong className="text-navy text-sm font-bold">{category.regulationType}</strong>
              </div>
              <div className="bg-[#f6f8fa] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Степень защиты:</span>
                <strong className="text-navy text-sm font-bold">IP00 (базовая) / IP31</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onOpenQuoteModal(category.slug)}
                className="bg-[#0b3d66] hover:bg-navy-dark text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#e6a417]" />
                Запросить КП и спецификацию
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
              Фотореалистичное исполнение силового трансформатора {category.shortTitle}
            </div>
          </div>
        </div>
      </section>

      {/* Oil Application Area (if applicable) */}
      {category.applicationArea && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-xs text-navy">
            <strong className="text-sm block mb-1">Область применения:</strong>
            <p className="leading-relaxed">{category.applicationArea}</p>
          </div>
        </section>
      )}

      {/* Technical Specifications Table Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-navy">
                Технические характеристики и потери
              </h2>
              <p className="text-xs text-slate-500">
                Заводские параметры: потери холостого хода P₀, потери КЗ Pкз, ток Ixx и напряжение КЗ Uк
              </p>
            </div>

            {/* Quick power filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold mr-1">Фильтр:</span>
              <button
                type="button"
                onClick={() => setSelectedPowerFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedPowerFilter === 'all'
                    ? 'bg-navy text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Все
              </button>
              {[630, 800, 1000, 1250, 1600, 2000, 2500].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPowerFilter(p)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedPowerFilter === p
                      ? 'bg-navy text-white'
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
                  <th className="py-3 px-3 font-bold text-left rounded-tl-lg">Мощность, кВА</th>
                  <th className="py-3 px-3 font-bold">ВН, кВ</th>
                  <th className="py-3 px-3 font-bold">НН, кВ</th>
                  <th className="py-3 px-3 font-bold">Схема / группа</th>
                  <th className="py-3 px-3 font-bold bg-[#072640]">Потери ХХ (P₀), Вт</th>

                  {category.tableType === 'dry_f_h' && (
                    <>
                      <th className="py-3 px-3 font-bold">Pкз F (120°C), Вт</th>
                      <th className="py-3 px-3 font-bold">Pкз H (145°C), Вт</th>
                    </>
                  )}

                  {category.tableType === 'dry_h' && (
                    <th className="py-3 px-3 font-bold">Pкз H (145°C), Вт</th>
                  )}

                  {category.tableType === 'oil' && (
                    <th className="py-3 px-3 font-bold">Потери КЗ, Вт</th>
                  )}

                  <th className="py-3 px-3 font-bold">Ixx, %</th>
                  <th className="py-3 px-3 font-bold">Uк, %</th>
                  <th className="py-3 px-3 font-bold text-right rounded-tr-lg">КП</th>
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
                      {spec.power_kva} кВА
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
                      {spec.p0_w.toLocaleString('ru-RU')}
                    </td>

                    {category.tableType === 'dry_f_h' && (
                      <>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {spec.pkz_f_w?.toLocaleString('ru-RU') || '—'}
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                          {spec.pkz_h_w?.toLocaleString('ru-RU') || '—'}
                        </td>
                      </>
                    )}

                    {category.tableType === 'dry_h' && (
                      <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                        {spec.pkz_h_w?.toLocaleString('ru-RU')}
                      </td>
                    )}

                    {category.tableType === 'oil' && (
                      <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                        {spec.pkz_w?.toLocaleString('ru-RU')}
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
                        className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-3 py-1.5 rounded-lg font-bold text-xs transition-transform active:scale-95"
                      >
                        Запрос
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
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black uppercase tracking-wider">
                Стандартная комплектация
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
              <Sliders className="w-5 h-5 text-[#e6a417]" />
              <h3 className="text-base font-black uppercase tracking-wider">
                Доступные опции под заказ
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

      {/* Consultation Banner (Client Note verbatim) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-black text-navy">
              Нужна консультация или расчёт?
            </h4>
            <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
              Отправьте опросный лист, техническое задание или параметры проекта на{' '}
              <a href="mailto:mail@mail.ru" className="font-bold text-navy underline">
                mail@mail.ru
              </a>{' '}
              — подготовим коммерческое предложение с технической документацией и расчётом доставки FCA Маньчжурия.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuoteModal(category.slug)}
              className="bg-[#0b3d66] hover:bg-navy-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              Запросить КП
            </button>
            <a
              href="tel:+73431234567"
              className="bg-white hover:bg-slate-50 text-navy border border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              Позвонить
            </a>
          </div>
        </div>
      </section>

      {/* Related Categories Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Другие категории оборудования:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((rel) => (
            <button
              key={rel.slug}
              type="button"
              onClick={() => onNavigate(`/katalog/${rel.slug}`)}
              className="bg-white p-4 rounded-xl border border-surface-border text-left hover:border-navy hover:shadow-md transition-all group"
            >
              <span className="text-[10px] font-bold text-[#e6a417] uppercase tracking-wider">
                {rel.voltageClass} кВ
              </span>
              <h4 className="text-xs font-bold text-navy group-hover:text-navy-light mt-1 line-clamp-1">
                {rel.shortTitle}
              </h4>
              <span className="text-[11px] text-slate-400 mt-2 inline-flex items-center gap-1 group-hover:text-navy">
                Перейти к характеристикам →
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
