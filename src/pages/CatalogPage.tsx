import React, { useState } from 'react';
import { TransformerCard } from '../components/TransformerCard';
import { Filter, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

export const CatalogPage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  const { t, language, categories } = useLanguage();
  const [filterVoltage, setFilterVoltage] = useState<'all' | '10' | '20' | '35'>('all');
  const [filterLoss, setFilterLoss] = useState<'all' | 'low_loss'>('all');

  const filteredCategories = categories.filter((cat) => {
    if (filterVoltage !== 'all' && cat.voltageClass !== filterVoltage) return false;
    if (filterLoss === 'low_loss' && cat.lossClass !== 'low_loss') return false;
    return true;
  });

  const getInsulationName = (type: string) => {
    if (language === 'zh') {
      if (type === 'cast_resin') return '环氧树脂浇注';
      if (type === 'air_barrier') return 'Nomex H级敞开干变';
      return '矿物油浸式';
    }
    if (language === 'en') {
      if (type === 'cast_resin') return 'Cast Resin';
      if (type === 'air_barrier') return 'Nomex Class H Dry';
      return 'Oil-Immersed';
    }
    if (type === 'cast_resin') return 'Литая смола';
    if (type === 'air_barrier') return 'Воздушно-барьерная (Nomex, H)';
    return 'Масло';
  };

  return (
    <div className="space-y-12">
      {/* Page Header Banner */}
      <section className="bg-[#0b3d66] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md inline-block mb-3">
              {t.catalogPage.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {t.catalogPage.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              {t.catalogPage.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#0b3d66]" />
              {t.catalogPage.filterVoltage}
            </span>

            <button
              type="button"
              onClick={() => {
                setFilterVoltage('all');
                setFilterLoss('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterVoltage === 'all' && filterLoss === 'all'
                  ? 'bg-[#0b3d66] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.catalogPage.filterAll} ({categories.length})
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterVoltage('10');
                setFilterLoss('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterVoltage === '10' && filterLoss === 'all'
                  ? 'bg-[#0b3d66] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.catalogPage.filter10} (3)
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterVoltage('20');
                setFilterLoss('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterVoltage === '20' && filterLoss === 'all'
                  ? 'bg-[#0b3d66] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.catalogPage.filter20} (1)
            </button>

            <button
              type="button"
              onClick={() => {
                setFilterVoltage('35');
                setFilterLoss('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterVoltage === '35' && filterLoss === 'all'
                  ? 'bg-[#0b3d66] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.catalogPage.filter35} (3)
            </button>
          </div>

          {/* Low loss toggle */}
          <div className="w-full sm:w-auto flex justify-end">
            <button
              type="button"
              onClick={() => setFilterLoss(filterLoss === 'low_loss' ? 'all' : 'low_loss')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterLoss === 'low_loss'
                  ? 'bg-[#e6a417] text-[#072640] shadow-sm'
                  : 'bg-amber-50 text-[#935d03] hover:bg-amber-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#e6a417]" />
              {t.catalogPage.filterLowLoss}
            </button>
          </div>
        </div>

        {/* Categories Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCategories.map((cat) => (
            <TransformerCard
              key={cat.slug}
              category={cat}
              onNavigate={onNavigate}
              onOpenQuoteModal={onOpenQuoteModal}
            />
          ))}
        </div>
      </section>

      {/* Comprehensive Technical Overview Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-black text-navy">
              {language === 'zh'
                ? '全系列电力变压器核心规格横向对比表'
                : language === 'en'
                ? 'Consolidated Technical Specifications Comparison'
                : 'Сводная сравнительная таблица линеек трансформаторов'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'zh'
                ? '涵盖所有7大类变压器的电压等级、低压规格、绝缘结构、空载损耗范围及阻抗'
                : language === 'en'
                ? 'Key structural and operational parameters of all 7 transformer categories'
                : 'Ключевые конструктивные и эксплуатационные характеристики всех 7 категорий'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0b3d66] text-white text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold rounded-tl-lg">
                    {language === 'zh' ? '产品类别' : language === 'en' ? 'Category' : 'Тип оборудования'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '高压侧' : language === 'en' ? 'HV Class' : 'Класс ВН'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '低压侧' : language === 'en' ? 'LV Class' : 'НН'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '绝缘形式' : language === 'en' ? 'Insulation' : 'Изоляция'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '空载损耗 P₀ 范围' : language === 'en' ? 'P₀ Loss Range' : 'Диапазон потерь P₀'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '阻抗 Uk, %' : language === 'en' ? 'Impedance Uk, %' : 'Uк, %'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-right rounded-tr-lg">
                    {language === 'zh' ? '操作' : language === 'en' ? 'Action' : 'Действие'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {categories.map((cat) => {
                  const minP0 = Math.min(...cat.specs.map((s) => s.p0_w));
                  const maxP0 = Math.max(...cat.specs.map((s) => s.p0_w));
                  return (
                    <tr key={cat.slug} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-navy">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/katalog/${cat.slug}`)}
                          className="hover:underline text-left cursor-pointer"
                        >
                          {cat.shortTitle}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">
                        {cat.voltageClass} {t.catalogShowcase.voltage}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-mono">
                        {cat.voltageLV}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {getInsulationName(cat.insulationType)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-navy">
                        {minP0} – {maxP0} {t.catalogShowcase.watts}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">
                        {cat.tableType === 'oil' ? '6.5%' : '6% / 8%'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate(`/katalog/${cat.slug}`)}
                          className="text-[#0b3d66] hover:text-[#e6a417] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          {language === 'zh' ? '查阅参数 →' : language === 'en' ? 'Datasheet →' : 'Спецификация →'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Note / Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-5 rounded-r-xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-700">
            <strong className="text-navy text-sm block mb-0.5">
              {t.catalogPage.customTzBannerTitle}
            </strong>
            {t.catalogPage.customTzBannerDesc}{' '}
            <a href="mailto:mail@mail.ru" className="font-bold text-[#0b3d66] underline">
              mail@mail.ru
            </a>
          </div>

          <button
            type="button"
            onClick={() => onOpenQuoteModal()}
            className="bg-[#0b3d66] hover:bg-navy-dark text-white px-5 py-2.5 rounded-lg font-bold text-xs shrink-0 cursor-pointer"
          >
            {t.categoryDetail.calcQuote}
          </button>
        </div>
      </section>
    </div>
  );
};
