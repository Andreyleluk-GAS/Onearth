import React, { useState } from 'react';
import { TransformerCategory } from '../types/transformer';
import { TechnicalLossChart } from '../components/TechnicalLossChart';
import { CheckCircle2, ChevronRight, Zap, Mail, Sliders, BookOpen, ShieldCheck, Factory } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  category: TransformerCategory;
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug: string, power?: string) => void;
}

const getEngineeringNotes = (slug: string) => {
  switch (slug) {
    case 'suhie-litaya-10kv':
      return {
        badge: 'Инженерная справка: Литая эпоксидная изоляция 10 кВ',
        title: 'Особенности конструкции, диэлектрической прочности и стандарты ГОСТ 52719',
        paragraphs: [
          'Обмотки высшего напряжения (ВН) заливаются эпоксидным компаундом с кварцевым наполнителем в глубоком вакууме на оборудовании Hedrich. Это исключает возникновение воздушных пустот и гарантирует уровень частичных разрядов не более 5–10 пКл при напряжении 1.3 Um, предотвращая старение изоляции при коммутационных перенапряжениях.',
          'Трансформаторы спроектированы под условия эксплуатации распределительных сетей РФ: класс нагревостойкости F (до 155°C), основная схема соединения Д/Ун-11 для компенсации несимметричных нагрузок и локализации третьей гармоники. Переключение ответвлений без возбуждения (ПБВ) с диапазоном ±2х2,5% ступенями.',
          'Каждая фаза обмотки НН комплектуется термосопротивлениями PT100 с выводом на микропроцессорный блок температурного контроля. Оборудование поставляется в исполнении IP00 для установки в ячейки КРУ/КСО или в вентилируемых кожухах IP21/IP31 с антикоррозийным покрытием.',
        ],
      };
    case 'suhie-litaya-10kv-pp':
      return {
        badge: 'Инженерная справка: Пониженные потери холостого хода (ECO)',
        title: 'Энергоэффективность, технология Step-Lap и экономическая окупаемость',
        paragraphs: [
          'В сериях с пониженными потерями холостого хода (P0) сердечник собирается из высококоэрцитивной электротехнической кремнистой стали с лазерной обработкой доменов по технологии косого стыка Step-Lap. Это обеспечивает снижение потерь холостого хода на 20–25% по сравнению со стандартными значениями ГОСТ 52719-2007.',
          'При круглосуточной непрерывной нагрузке промышленного предприятия экономия электроэнергии окупает разницу в стоимости силового трансформатора за 1.8–2.4 года эксплуатации при тарифе 8 руб./кВт·ч.',
          'Номинальные мощности от 630 до 2500 кВА, напряжение короткого замыкания Uk = 6,0%, схемы соединения обмоток Д/Ун-11 и У/Ун-0. Полная совместимость с блочными комплектными трансформаторными подстанциями (БКТП).',
        ],
      };
    case 'suhie-litaya-20kv':
      return {
        badge: 'Инженерная справка: Сети 20 кВ',
        title: 'Применение в кабельных распределительных сетях 20 кВ и мегаполисах',
        paragraphs: [
          'Класс напряжения 20 кВ активно внедряется в мегаполисах и на крупных промышленных узлах для снижения потерь при передаче мощности и уменьшения сечений кабельных линий. Трансформаторы Hubei Onearth Trading на 20 кВ обеспечивают повышенную диэлектрическую прочность при сохранении компактных габаритов.',
          'Испытательное напряжение грозового импульса (BIL) составляет до 125 кВ. Изоляция обмоток гарантирует отсутствие частичных разрядов и пожаробезопасность по классу F1 в соответствии с МЭК 60076-11.',
          'Поставка осуществляется в защитных кожухах IP21/IP31 с возможностью подключения шинных мостов и кабельных вводов как сверху, так и снизу шкафа.',
        ],
      };
    case 'suhie-litaya-35kv':
    case 'suhie-litaya-35kv-pp':
      return {
        badge: 'Инженерная справка: Сухие трансформаторы 35 кВ',
        title: 'Высоковольтная литая изоляция, градиент поля и бескомпромиссная безопасность',
        paragraphs: [
          'Сухие трансформаторы 35 кВ с литой изоляцией мощностью 630–2500 кВА являются высокотехнологичной экологической альтернативой масляным подстанциям. Они исключают риски разлива трансформаторного масла и взрыва, что критично для высотных зданий, метрополитенов, гидроузлов и химических комбинатов.',
          'Секционированная намотка обмоток ВН с градиентным распределением электрического поля обеспечивает устойчивость к полному грозовому импульсу до 170 кВ. Класс нагревостойкости F (155°C) или H (180°C).',
          'Поставка оборудования осуществляется на условиях FCA Маньчжурия с предоставлением протоколов заводских типовых испытаний по стандартам ГОСТ 52719 и МЭК 60076.',
        ],
      };
    case 'suhie-vozdushno-baryernaya-10kv':
      return {
        badge: 'Инженерная справка: Изоляция DuPont Nomex (H-класс)',
        title: 'Воздушно-барьерная изоляция, термостойкость 220°C и перегрузочная способность',
        paragraphs: [
          'В трансформаторах с воздушно-барьерной изоляцией используется негорючая полиамидная бумага DuPont Nomex с глубокой вакуумно-нагнетательной пропиткой кремнийорганическим лаком (VPI). Изоляционная система относится к классу нагревостойкости H (предельная температура 220°C).',
          'Конструкция обладает высочайшей устойчивостью к циклическим тепловым перегрузкам до 140–150% номинальной мощности при включении вентиляторов принудительного охлаждения (AF), не подвергаясь растрескиванию при резких перепадах температур от -45°C до +40°C.',
          'Идеальное решение для металлургических производств, буровых платформ и объектов горнорудной промышленности, где требуется высокая влаго- и солестойкость.',
        ],
      };
    case 'maslyanye-35kv':
    case 'maslyanye-35kv-pbv':
      return {
        badge: 'Инженерная справка: Масляные трансформаторы 35 кВ (ТМГ / ТДНС)',
        title: 'Герметичные баки, дегазация масла, РПН Huaming/MR и комплекс защит',
        paragraphs: [
          'Силовые масляные трансформаторы 35 кВ (серии ТМГ, ТДН, ТДНС, ТРДН) мощностью до 6300 кВА выпускаются в герметичном исполнении без расширителя. Температурные колебания объема масла компенсируются упругой деформацией гофрированных стенок бака, что исключает контакт диэлектрика с кислородом воздуха и влагой.',
          'Заливка очищенного дегазированного трансформаторного масла выполняется под глубоким вакуумом, гарантируя пробивное напряжение не ниже 60 кВ и отсутствие окисления на протяжении 30-летнего срока службы.',
          'По техническому заданию трансформаторы оснащаются устройствами регулирования напряжения под нагрузкой (РПН Huaming / Maschinenfabrik Reinhausen) с диапазоном до ±4х2,5% или ±6х1,5%, газовым реле Бухгольца, предохранительным клапаном сброса давления и манометрическим термометром.',
        ],
      };
    case 'special-transformatory':
      return {
        badge: 'Инженерная справка: Специальное электрооборудование и OEM',
        title: 'Преобразовательные, печные агрегаты и изготовление под брендом заказчика',
        paragraphs: [
          'Hubei Onearth Trading организует проектирование и производство трансформаторов для питания тиристорных преобразователей (выпрямителей) 6-, 12- и 24-пульсных схем с расщепленными обмотками НН и повышенной стойкостью к высшим гармоникам.',
          'Печные агрегаты изготавливаются с усиленной динамической стойкостью к эксплуатационным коротким замыканиям дуговых и индукционных электропечей.',
          'Доступна программа OEM-производства под торговой маркой заказчика с выпуском всей рабочей конструкторской документации, шильдиков и эксплуатационных паспортов на русском языке.',
        ],
      };
    default:
      return null;
  }
};

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
  const engineeringNotes = getEngineeringNotes(category.slug);

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
                href="mailto:info@hubeienergy.ru"
                className="bg-[#fff7e6] hover:bg-[#ffeed1] text-[#935d03] border border-[#e6a417]/50 px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-4 h-4 text-[#e6a417]" />
                info@hubeienergy.ru
              </a>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 bg-[#f8fafc] rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center relative">
            <img
              src={category.image}
              alt={category.imageAlt || category.title}
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

      {/* Engineering Overview & Technical SEO Notes */}
      {engineeringNotes && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-md inline-block mb-2">
                {engineeringNotes.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-navy">
                {engineeringNotes.title}
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {engineeringNotes.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-black text-navy">
              {language === 'zh' ? '需要技术咨询或定制方案核算？' : language === 'en' ? 'Need Consultation or Cost Estimation?' : 'Нужна консультация или расчёт?'}
            </h4>
            <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
              {language === 'zh'
                ? '请将采购单、技术规格书或工程图纸发送至 info@hubeienergy.ru — 我们将为您提供完备的工厂技术方案与 FCA (Free Carrier) 交付报价。'
                : language === 'en'
                ? 'Send your questionnaire, technical assignment, or project parameters to info@hubeienergy.ru — we will prepare a full commercial offer with technical documentation and FCA (Free Carrier) delivery calculation.'
                : 'Отправьте опросный лист, техническое задание или параметры проекта на info@hubeienergy.ru — подготовим коммерческое предложение с технической документацией и расчётом поставки на условиях FCA (Free Carrier).'}
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
              href="tel:+73432269889"
              className="bg-white hover:bg-slate-50 text-navy border border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              +7 (343) 226-98-89
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
