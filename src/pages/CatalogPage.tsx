import React, { useState } from 'react';
import { TransformerCard } from '../components/TransformerCard';
import { Filter, Zap, SlidersHorizontal, RefreshCw, Cpu, Flame, Layers } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TransformerCategory } from '../types/transformer';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

type CategoryTab = 'all' | 'dry_cast' | 'dry_nomex' | 'oil' | 'special';

export const CatalogPage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  const { t, language, categories } = useLanguage();

  const [activeTab, setActiveTab] = useState<CategoryTab>('all');
  const [filterVoltage, setFilterVoltage] = useState<'all' | '10' | '20' | '35'>('all');
  const [filterLoss, setFilterLoss] = useState<'all' | 'standard' | 'low_loss'>('all');
  const [filterRegulation, setFilterRegulation] = useState<'all' | 'pbv' | 'rpn'>('all');

  // Filter logic
  const filteredCategories = categories.filter((cat) => {
    // 1. Tab filter
    if (activeTab === 'dry_cast' && !(cat.mainCategory === 'dry' && cat.subCategory === 'cast_resin')) return false;
    if (activeTab === 'dry_nomex' && !(cat.mainCategory === 'dry' && cat.subCategory === 'air_barrier')) return false;
    if (activeTab === 'oil' && cat.mainCategory !== 'oil') return false;
    if (activeTab === 'special' && cat.mainCategory !== 'special') return false;

    // 2. Voltage filter
    if (filterVoltage !== 'all' && cat.voltageClass !== filterVoltage) return false;

    // 3. Loss filter
    if (filterLoss === 'low_loss' && cat.lossClass !== 'low_loss') return false;
    if (filterLoss === 'standard' && cat.lossClass !== 'standard') return false;

    // 4. Regulation filter
    if (filterRegulation === 'pbv' && !cat.regulationType.includes('ПБВ') && !cat.regulationType.includes('NLTC')) return false;
    if (filterRegulation === 'rpn' && !cat.regulationType.includes('РПН') && !cat.regulationType.includes('OLTC')) return false;

    return true;
  });

  const resetFilters = () => {
    setFilterVoltage('all');
    setFilterLoss('all');
    setFilterRegulation('all');
  };

  const isFiltered = filterVoltage !== 'all' || filterLoss !== 'all' || filterRegulation !== 'all';

  const getInsulationName = (type: string) => {
    if (language === 'zh') {
      if (type === 'cast_resin') return '环氧树脂浇注 (F/H)';
      if (type === 'air_barrier') return 'Nomex H级敞开式';
      return '矿物绝缘油';
    }
    if (language === 'en') {
      if (type === 'cast_resin') return 'Cast Resin (F/H)';
      if (type === 'air_barrier') return 'Nomex Class H';
      return 'Mineral Oil';
    }
    if (type === 'cast_resin') return 'Литая смола (F/H)';
    if (type === 'air_barrier') return 'Nomex (H-класс)';
    return 'Масляная';
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

      {/* Structured Category Tabs & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        {/* Top Primary Category Tabs (Task-1 Hierarchy) */}
        <div className="bg-white rounded-2xl border border-surface-border p-2 sm:p-2.5 shadow-sm flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              resetFilters();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.catalogPage.tabAll}</span>
            <span className="text-[10px] opacity-75 ml-0.5">({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('dry_cast');
              resetFilters();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dry_cast'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#e6a417]" />
            <span>{t.catalogPage.tabDryCast}</span>
            <span className="text-[10px] opacity-75 ml-0.5">(5)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('dry_nomex');
              resetFilters();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dry_nomex'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.catalogPage.tabDryNomex}</span>
            <span className="text-[10px] opacity-75 ml-0.5">(1)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('oil');
              resetFilters();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'oil'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.catalogPage.tabOil}</span>
            <span className="text-[10px] opacity-75 ml-0.5">(2)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('special');
              resetFilters();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'special'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t.catalogPage.tabSpecial}</span>
            <span className="text-[10px] opacity-75 ml-0.5">(1)</span>
          </button>
        </div>

        {/* Dynamic Contextual Filter Controls */}
        <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Voltage Filter (for dry_cast, all) */}
            {(activeTab === 'all' || activeTab === 'dry_cast') && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#0b3d66]" />
                  {t.catalogPage.filterVoltage}
                </span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFilterVoltage('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterVoltage === 'all' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t.catalogPage.filterAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterVoltage('10')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterVoltage === '10' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    10 кВ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterVoltage('20')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterVoltage === '20' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    20 кВ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterVoltage('35')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterVoltage === '35' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    35 кВ
                  </button>
                </div>
              </div>
            )}

            {/* Energy Efficiency / Loss Filter (for dry_cast, all) */}
            {(activeTab === 'all' || activeTab === 'dry_cast') && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">
                  {t.catalogPage.filterEfficiency}
                </span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFilterLoss('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterLoss === 'all' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t.catalogPage.filterAllLoss}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterLoss('standard')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterLoss === 'standard' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t.catalogPage.filterStandardLoss}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterLoss('low_loss')}
                    className={`px-2.5 py-1 rounded-md font-black flex items-center gap-1 transition-colors cursor-pointer ${
                      filterLoss === 'low_loss' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-800'
                    }`}
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    {t.catalogPage.filterLowLossOnly}
                  </button>
                </div>
              </div>
            )}

            {/* Regulation Type Filter (for oil, all) */}
            {(activeTab === 'all' || activeTab === 'oil') && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">
                  {t.catalogPage.filterRegulation}
                </span>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFilterRegulation('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterRegulation === 'all' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t.catalogPage.filterAllReg}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterRegulation('pbv')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterRegulation === 'pbv' ? 'bg-white text-navy shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t.catalogPage.filterPBV}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterRegulation('rpn')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                      filterRegulation === 'rpn' ? 'bg-[#0b3d66] text-white shadow-xs' : 'text-slate-600 hover:text-navy'
                    }`}
                  >
                    {t.catalogPage.filterRPN}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset button & count */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
            <span className="text-slate-500 font-medium">
              {t.catalogPage.resultsCount} <strong className="text-navy font-bold">{filteredCategories.length}</strong>
            </span>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#0b3d66] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Сбросить</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredCategories.map((cat) => (
              <TransformerCard
                key={cat.slug}
                category={cat}
                onNavigate={onNavigate}
                onOpenQuoteModal={onOpenQuoteModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-sm text-slate-500 mb-3">
              По выбранным фильтрам позиции не найдены.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="bg-[#0b3d66] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
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
                : 'Сводная сравнительная таблица всех серий трансформаторов'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'zh'
                ? '涵盖所有大类变压器的电压等级、低压规格、绝缘形式、空载损耗范围及调压形式'
                : language === 'en'
                ? 'Key structural and operational parameters of all transformer categories and series'
                : 'Ключевые конструктивные и эксплуатационные характеристики всех категорий и линеек'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-[#0b3d66] text-white text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3 font-bold rounded-tl-lg">
                    {language === 'zh' ? '系列代码与型号' : language === 'en' ? 'Series / Model' : 'Серия / Маркировка'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '高压侧' : language === 'en' ? 'HV Class' : 'Класс ВН'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '低压侧' : language === 'en' ? 'LV Class' : 'НН'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '调压方式' : language === 'en' ? 'Regulation' : 'Регулирование'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '绝缘形式' : language === 'en' ? 'Insulation' : 'Изоляция'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-center">
                    {language === 'zh' ? '能效等级' : language === 'en' ? 'Loss Tier' : 'Потери'}
                  </th>
                  <th className="py-2.5 px-3 font-bold text-right rounded-tr-lg">
                    {language === 'zh' ? '操作' : language === 'en' ? 'Action' : 'Действие'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.slug} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-navy flex items-center gap-1.5">
                        <span className="font-mono text-[#0b3d66] bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {cat.seriesCode}
                        </span>
                        <span>{cat.compactTitle || cat.shortTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-navy">
                      {cat.voltageClass}&nbsp;кВ
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 font-medium">
                      {cat.voltageLV}
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={cat.regulationType.includes('РПН') ? 'text-[#e6a417] font-black' : 'text-slate-800'}>
                        {cat.regulationType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      {getInsulationName(cat.insulationType)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {cat.lossClass === 'low_loss' ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-black text-[10px]">
                          ECO Пониженные
                        </span>
                      ) : (
                        <span className="text-slate-500">Стандартные</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/katalog/${cat.slug}`)}
                        className="text-xs text-[#0b3d66] font-bold hover:underline cursor-pointer"
                      >
                        {t.catalogShowcase.detailsBtn} →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Custom Manufacturing Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#072640] to-[#0b3d66] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-black">
              {t.catalogPage.customTzBannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {t.catalogPage.customTzBannerDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/po-tz')}
            className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 cursor-pointer"
          >
            {t.catalogPage.customTzBannerBtn}
          </button>
        </div>
      </section>
    </div>
  );
};
