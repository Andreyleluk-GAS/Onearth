import React, { useState } from 'react';
import { Cpu, Sliders, ShieldCheck, FileText, Send, Copy, CheckSquare, Zap, Layers, Activity, Truck, Settings } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { crmService } from '../services/crmService';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

export const PoTzPage: React.FC<Props> = ({ onOpenQuoteModal }) => {
  const { t, language } = useLanguage();

  // 14 Core Technical Parameters (Task-2)
  const [power, setPower] = useState('1000 кВА');
  const [customPower, setCustomPower] = useState('');
  const [voltageHV, setVoltageHV] = useState('10 кВ');
  const [voltageLV, setVoltageLV] = useState('0,4 кВ');
  const [frequency, setFrequency] = useState('50 Гц');
  const [phaseVector, setPhaseVector] = useState('3 фазы, Д/Ун-11');
  const [uk, setUk] = useState('6,0%');
  const [regulation, setRegulation] = useState('ПБВ ±2х2,5%');
  const [cooling, setCooling] = useState('AN (естественное воздушное)');
  const [lossClass, setLossClass] = useState('standard');
  const [insulationClass, setInsulationClass] = useState('F (155°C, литая изоляция)');
  const [windings, setWindings] = useState('copper');
  const [installation, setInstallation] = useState('Внутри помещения (У3, от -25°C до +40°C)');
  const [altitude, setAltitude] = useState('До 1000 м');
  const [enclosure, setEnclosure] = useState('IP00 (без кожуха)');
  const [comments, setComments] = useState('');

  // Checkboxes where there are no options: user simply ticks what is required
  const [options, setOptions] = useState({
    enclosureNeeded: false,
    tempControl: true,
    rs485: false,
    afFans: false,
    vibration: false,
    currentTrans: false,
    oemBrand: false,
    seismic9: false,
    outdoorU1: false,
    testReports: true,
    ruPassport: true,
    dimensionsLimit: false,
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 152-FZ Mandatory Consent State
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [copied, setCopied] = useState(false);

  const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const privacyUrl = `${BASE}/politika-konfidencialnosti`;

  const effectivePower = power === 'custom' ? `${customPower || '1000'} кВА` : power;

  const getWindingsLabel = () => {
    if (language === 'zh') return windings === 'copper' ? '优质无氧铜 (Cu)' : windings === 'aluminum' ? '特级电工铝 (Al)' : '按工厂推荐';
    if (language === 'en') return windings === 'copper' ? 'Electrolytic Copper (Cu)' : windings === 'aluminum' ? 'Electrical Grade Aluminum (Al)' : 'Manufacturer Choice';
    return windings === 'copper' ? 'Медь (Cu)' : windings === 'aluminum' ? 'Алюминий (Al)' : 'По рекомендации завода';
  };

  const getLossClassLabel = () => {
    if (language === 'zh') return lossClass === 'low_loss' ? '节能超低损耗型 (ECO)' : '标准能效损耗';
    if (language === 'en') return lossClass === 'low_loss' ? 'Low-Loss Energy-Efficient (ECO)' : 'Standard Losses';
    return lossClass === 'low_loss' ? 'Пониженные потери (энергоэффективный ECO)' : 'Стандартные потери';
  };

  // Build Comprehensive Technical Summary Text (all 14 parameters + checked options)
  const getTzSummary = () => {
    const checkedList: string[] = [];
    if (options.enclosureNeeded) checkedList.push(t.poTz.optEnclosure);
    if (options.tempControl) checkedList.push(t.poTz.optTempControl);
    if (options.rs485) checkedList.push(t.poTz.optRs485);
    if (options.afFans) checkedList.push(t.poTz.optAfFans);
    if (options.vibration) checkedList.push(t.poTz.optVibration);
    if (options.currentTrans) checkedList.push(t.poTz.optCurrentTrans);
    if (options.oemBrand) checkedList.push(t.poTz.optOemBrand);
    if (options.seismic9) checkedList.push(t.poTz.optSeismic9);
    if (options.outdoorU1) checkedList.push(t.poTz.optOutdoorU1);
    if (options.testReports) checkedList.push(t.poTz.optTestReports);
    if (options.ruPassport) checkedList.push(t.poTz.optRuPassport);
    if (options.dimensionsLimit) checkedList.push(t.poTz.optDimensionsLimit);

    if (language === 'zh') {
      return [
        `非标电力变压器技术协议（TS）采购询价单：`,
        `==================================================`,
        `一、核心电气及结构参数（14项关键参数）：`,
        `1. 额定容量：${effectivePower}`,
        `2. 额定电压：高压侧 ${voltageHV} / 低压侧 ${voltageLV}`,
        `3. 电网额定频率：${frequency}`,
        `4. 相数及联结组标号：${phaseVector}`,
        `5. 阻抗电压 (Uk)：${uk}`,
        `6. 调压方式及范围：${regulation}`,
        `7. 冷却方式：${cooling}`,
        `8. 能效及损耗等级：${getLossClassLabel()}`,
        `9. 绝缘及耐热等级：${insulationClass}`,
        `10. 绕组导线材质：${getWindingsLabel()}`,
        `11. 外壳防护等级：${enclosure}`,
        `12. 运行环境与安装条件：${installation}`,
        `13. 运行海拔高度：${altitude}`,
        `14. 交货基准：FCA (Free Carrier) (Incoterms 2020)`,
        ``,
        `二、选配项及特殊技术要求（已勾选）：`,
        checkedList.length > 0 ? checkedList.map((item) => `— [✓] ${item}`).join('\n') : '— 无特殊附加选项',
        comments ? `\n三、图纸、母排接口及补充技术要求：\n${comments}` : '',
        ``,
        `请湖北万域贸易有限公司（Hubei Onearth Trading Co. Ltd.）提供中国对口工厂的技术商务方案与正式报价。`,
      ].filter(Boolean).join('\n');
    }

    if (language === 'en') {
      return [
        `Technical Specification (TS) RFQ for Custom Power Transformer:`,
        `==================================================`,
        `1. Core Electrical & Structural Parameters (14 key points):`,
        `— Rated Capacity: ${effectivePower}`,
        `— Rated Voltages: HV ${voltageHV} / LV ${voltageLV}`,
        `— Grid Frequency: ${frequency}`,
        `— Phase & Vector Group: ${phaseVector}`,
        `— Short-Circuit Impedance (Uk): ${uk}`,
        `— Voltage Regulation Range & Type: ${regulation}`,
        `— Cooling System: ${cooling}`,
        `— Loss & Energy Efficiency Tier: ${getLossClassLabel()}`,
        `— Insulation & Thermal Class: ${insulationClass}`,
        `— Winding Conductor Material: ${getWindingsLabel()}`,
        `— Enclosure Protection Rating: ${enclosure}`,
        `— Installation Environment: ${installation}`,
        `— Altitude: ${altitude}`,
        `— Delivery Basis: FCA (Free Carrier) (Incoterms 2020)`,
        ``,
        `2. Required Options & Accessories (Checked):`,
        checkedList.length > 0 ? checkedList.map((item) => `— [✓] ${item}`).join('\n') : '— None',
        comments ? `\n3. Notes, Single-Line Diagrams & Terminal Requirements:\n${comments}` : '',
        ``,
        `Please provide official commercial quotation, technical parameters, and factory lead time.`,
      ].filter(Boolean).join('\n');
    }

    return [
      `Спецификация технического задания (ТЗ) на изготовление силового трансформатора:`,
      `==================================================`,
      `1. Основные электрические и конструктивные параметры (14 параметров ТЗ):`,
      `— Номинальная мощность: ${effectivePower}`,
      `— Напряжение ВН: ${voltageHV} / Напряжение НН: ${voltageLV}`,
      `— Частота сети: ${frequency}`,
      `— Число фаз и схема/группа соединения: ${phaseVector}`,
      `— Напряжение короткого замыкания (Uк): ${uk}`,
      `— Диапазон и тип регулирования: ${regulation}`,
      `— Система охлаждения: ${cooling}`,
      `— Потери и класс энергоэффективности: ${getLossClassLabel()}`,
      `— Класс изоляции / нагревостойкости: ${insulationClass}`,
      `— Материал обмоток: ${getWindingsLabel()}`,
      `— Степень защиты кожуха: ${enclosure}`,
      `— Условия установки и температура: ${installation}`,
      `— Высота над уровнем моря: ${altitude}`,
      `— Базис поставки: FCA (Free Carrier), (Инкотермс 2020)`,
      ``,
      `2. Выбранные опции и специальная комплектация (отмеченные пункты):`,
      checkedList.length > 0 ? checkedList.map((item) => `— [✓] ${item}`).join('\n') : '— Без дополнительных опций',
      comments ? `\n3. Схема, требования к вводам/выводам, габариты и примечания:\n${comments}` : '',
      ``,
      `Прошу компанию Hubei Onearth Trading Company Limited рассчитать стоимость и срок производства на заводе в КНР.`,
    ].filter(Boolean).join('\n');
  };

  const mailtoLink = `mailto:mail@mail.ru?subject=${encodeURIComponent(
    language === 'zh'
      ? `非标变压器技术协议询价: ${effectivePower} — ${voltageHV}/${voltageLV}`
      : language === 'en'
      ? `Custom Transformer RFQ: ${effectivePower} — ${voltageHV}/${voltageLV}`
      : `Запрос ТЗ на трансформатор: ${effectivePower} — ${voltageHV}/${voltageLV}`
  )}&body=${encodeURIComponent(getTzSummary())}`;

  const handleSendEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!consentGiven) {
      e.preventDefault();
      setConsentError(true);
      return;
    }
    try {
      crmService.addLead({
        companyName: 'Заказчик по ТЗ (Конфигуратор)',
        contactName: 'Снабжение / Главный энергетик',
        phone: 'В письме / Запрос КП',
        email: 'mail@mail.ru',
        categoryTitle: `Изготовление по ТЗ (${effectivePower}, ${voltageHV}/${voltageLV})`,
        categorySlug: 'po-tz',
        powerKva: effectivePower,
        voltageHV,
        voltageLV,
        comment: `Схема: ${phaseVector}, Uk=${uk}, Регулирование=${regulation}, Охлаждение=${cooling}, Обмотки=${windings}. ${comments || ''}`,
        status: 'new',
        source: 'configurator_tz',
      });
    } catch {
      // safe fallback
    }
  };

  const handleCopy = async () => {
    if (!consentGiven) {
      setConsentError(true);
      return;
    }
    try {
      crmService.addLead({
        companyName: 'Заказчик по ТЗ (Копирование опросного листа)',
        contactName: 'Снабжение / Главный энергетик',
        phone: 'В опросном листе',
        email: 'mail@mail.ru',
        categoryTitle: `Изготовление по ТЗ (${effectivePower}, ${voltageHV}/${voltageLV})`,
        categorySlug: 'po-tz',
        powerKva: effectivePower,
        voltageHV,
        voltageLV,
        comment: `Схема: ${phaseVector}, Uk=${uk}, Регулирование=${regulation}. ${comments || ''}`,
        status: 'new',
        source: 'configurator_tz',
      });
      await navigator.clipboard.writeText(getTzSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-12">
      {/* Page Header (Exact Customer Wording) */}
      <section className="bg-[#0b3d66] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md inline-block mb-3">
              {t.poTz.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {t.poTz.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              {t.poTz.desc}
            </p>
          </div>
        </div>
      </section>

      {/* "Что можно заказать" Section (Exact Customer Structure) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-navy">
            {t.poTz.whatCanOrder}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.poTz.whatCanOrderSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Сухие */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.poTz.c1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#0b3d66]">
              6–35 кВ · 630–2500 кВА
            </div>
          </div>

          {/* Card 2: Масляные */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-3">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.poTz.c2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#0b3d66]">
              35 кВ · ПБВ / РПН до 6300 кВА
            </div>
          </div>

          {/* Card 3: Спецназначение */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.poTz.c3Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#0b3d66]">
              6–35 кВ · 6/12/24-пульсные схемы
            </div>
          </div>

          {/* Card 4: OEM / Бренд заказчика */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.poTz.c4Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-[#0b3d66]">
              Private Label · Шильды ГОСТ
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Full Specification Configurator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#e6a417] bg-amber-50 px-2.5 py-1 rounded-md">
              Онлайн-инжиниринг
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
              {t.poTz.builderTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {t.poTz.builderSub}
            </p>
          </div>

          {/* Block 1: 14 Core Technical Parameters */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0b3d66] border-b border-slate-200 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#e6a417]" />
              {t.poTz.secParamsTitle}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* 1. Номинальная мощность */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldPower}</label>
                <div className="space-y-1.5">
                  <select
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 focus:ring-2 focus:ring-[#0b3d66]"
                  >
                    {['630 кВА', '800 кВА', '1000 кВА', '1250 кВА', '1600 кВА', '2000 кВА', '2500 кВА', '3150 кВА', '4000 кВА', '5000 кВА', '6300 кВА', '10000 кВА', '16000 кВА', '25000 кВА', '31500 кВА'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                    <option value="custom">Другая мощность (ввести вручную)</option>
                  </select>
                  {power === 'custom' && (
                    <input
                      type="text"
                      placeholder="Например: 12500 кВА"
                      value={customPower}
                      onChange={(e) => setCustomPower(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs font-bold text-[#0b3d66]"
                    />
                  )}
                </div>
              </div>

              {/* 2. Напряжение ВН */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldVoltageHV}</label>
                <select
                  value={voltageHV}
                  onChange={(e) => setVoltageHV(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="10 кВ">10 кВ (стандарт)</option>
                  <option value="6 кВ">6 кВ</option>
                  <option value="6,3 кВ">6,3 кВ</option>
                  <option value="10,5 кВ">10,5 кВ</option>
                  <option value="11 кВ">11 кВ</option>
                  <option value="20 кВ">20 кВ</option>
                  <option value="35 кВ">35 кВ</option>
                  <option value="38,5 кВ">38,5 кВ</option>
                  <option value="По ТЗ заказчика">По ТЗ заказчика</option>
                </select>
              </div>

              {/* 3. Напряжение НН */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldVoltageLV}</label>
                <select
                  value={voltageLV}
                  onChange={(e) => setVoltageLV(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="0,4 кВ">0,4 кВ (400 В стандарт)</option>
                  <option value="0,69 кВ">0,69 кВ (690 В пром/ветро)</option>
                  <option value="3,15 кВ">3,15 кВ</option>
                  <option value="6,3 кВ">6,3 кВ</option>
                  <option value="10,5 кВ">10,5 кВ</option>
                  <option value="Расщепленная 0,4/0,4 кВ">Расщепленная 0,4/0,4 кВ (выпрямители)</option>
                  <option value="По ТЗ заказчика">По ТЗ заказчика</option>
                </select>
              </div>

              {/* 4. Частота сети */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldFrequency}</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="50 Гц">50 Гц (стандарт ЕЭС / РФ)</option>
                  <option value="60 Гц">60 Гц</option>
                </select>
              </div>

              {/* 5. Число фаз и группа соединения */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldPhaseVector}</label>
                <select
                  value={phaseVector}
                  onChange={(e) => setPhaseVector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="3 фазы, Д/Ун-11">3 фазы, Д/Ун-11 (стандарт)</option>
                  <option value="3 фазы, У/Ун-0">3 фазы, У/Ун-0</option>
                  <option value="3 фазы, У/Д-11">3 фазы, У/Д-11 (35 кВ)</option>
                  <option value="3 фазы, Ун/Д-11">3 фазы, Ун/Д-11</option>
                  <option value="Спецсхема для выпрямителей (6/12 пульсов)">Спецсхема для выпрямителей (6/12 пульсов)</option>
                  <option value="По однолинейной схеме заказчика">По однолинейной схеме заказчика</option>
                </select>
              </div>

              {/* 6. Напряжение короткого замыкания Uк */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldUk}</label>
                <select
                  value={uk}
                  onChange={(e) => setUk(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="4,0%">4,0%</option>
                  <option value="6,0%">6,0% (стандарт 10 кВ)</option>
                  <option value="6,5%">6,5% (стандарт 35 кВ)</option>
                  <option value="7,0%">7,0%</option>
                  <option value="8,0%">8,0% (повышенное Uк)</option>
                  <option value="10,0%">10,0%</option>
                  <option value="По расчёту завода">По расчёту завода</option>
                </select>
              </div>

              {/* 7. Регулирование напряжения */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldRegulation}</label>
                <select
                  value={regulation}
                  onChange={(e) => setRegulation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="ПБВ ±2х2,5%">ПБВ ±2х2,5% (переключение без возбуждения)</option>
                  <option value="ПБВ ±2х5%">ПБВ ±2х5%</option>
                  <option value="РПН ±4х2,5%">РПН ±4х2,5% (под нагрузкой, привод MR/китайский)</option>
                  <option value="РПН ±6х1,5%">РПН ±6х1,5%</option>
                  <option value="Без регулирования">Без регулирования</option>
                </select>
              </div>

              {/* 8. Охлаждение */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldCooling}</label>
                <select
                  value={cooling}
                  onChange={(e) => setCooling(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="AN (естественное воздушное)">Сухие: AN (естественное)</option>
                  <option value="AF (принудительное с вентиляторами)">Сухие: AF (принудительное +25–40% мощности)</option>
                  <option value="ONAN (масляное естественное)">Масляные: ONAN (естественное масляное)</option>
                  <option value="ONAF (масляное с вентиляторами обдува)">Масляные: ONAF (с вентиляторами обдува)</option>
                </select>
              </div>

              {/* 9. Потери и энергоэффективность */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldLossClass}</label>
                <select
                  value={lossClass}
                  onChange={(e) => setLossClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="standard">Стандартные потери (ГОСТ 52719 / МЭК)</option>
                  <option value="low_loss">Пониженные потери (Энергоэффективный ECO, экономия до 36%)</option>
                </select>
              </div>

              {/* 10. Изоляция */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldInsulationClass}</label>
                <select
                  value={insulationClass}
                  onChange={(e) => setInsulationClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="F (155°C, литая изоляция)">Класс F (155°C, литая эпоксидная изоляция)</option>
                  <option value="H (180°C, Nomex воздушно-барьерная)">Класс H (180°C, Nomex воздушно-барьерная)</option>
                  <option value="Масляная изоляция (класс А, герметичный бак)">Масляная изоляция (класс А, герметичный бак)</option>
                </select>
              </div>

              {/* 11. Материал обмоток */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldWindings}</label>
                <select
                  value={windings}
                  onChange={(e) => setWindings(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="copper">{t.poTz.copper}</option>
                  <option value="aluminum">{t.poTz.aluminum}</option>
                  <option value="recommend">По рекомендации завода</option>
                </select>
              </div>

              {/* 12. Степень защиты кожуха */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldEnclosure}</label>
                <select
                  value={enclosure}
                  onChange={(e) => setEnclosure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="IP00 (без кожуха)">IP00 (без защитного кожуха, открытый)</option>
                  <option value="IP20">IP20 (защита от предметов &gt; 12 мм)</option>
                  <option value="IP21">IP21 (защита от вертикальных капель)</option>
                  <option value="IP31">IP31 (стандарт для закрытых помещений)</option>
                  <option value="IP54">IP54 (пыле-влагозащищенный кожух)</option>
                </select>
              </div>

              {/* 13. Условия установки и температура */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldInstallation}</label>
                <select
                  value={installation}
                  onChange={(e) => setInstallation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="Внутри помещения (У3, от -25°C до +40°C)">Внутри помещения (У3, от -25°C до +40°C)</option>
                  <option value="На улице под навесом (У2, от -40°C до +40°C)">На улице под навесом (У2, от -40°C до +40°C)</option>
                  <option value="Наружная установка (У1 / УХЛ1, до -45°C)">Наружная открытая установка (У1 / УХЛ1, до -45°C)</option>
                  <option value="Тропический климат (Т1 / Т2 / Т3)">Тропический климат (Т1 / Т2 / Т3)</option>
                </select>
              </div>

              {/* 14. Высота над уровнем моря и сейсмика */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldAltitude}</label>
                <select
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
                >
                  <option value="До 1000 м">До 1000 м (стандарт)</option>
                  <option value="До 2000 м">До 2000 м (высокогорное исполнение)</option>
                  <option value="До 3000 м">До 3000 м</option>
                </select>
              </div>
            </div>
          </div>

          {/* Block 2: Checkboxes (Exact Task-2 Instruction: "Часть данных где нет вариантов предлагается заполнить в виде чек бокса – заказчик просто ставит галочку если требуется") */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#0b3d66] flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#e6a417]" />
                {t.poTz.secCheckboxesTitle}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Просто отметьте галочками пункты комплектации и опций, необходимые для вашего проекта:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {[
                { key: 'enclosureNeeded' as const, label: t.poTz.optEnclosure },
                { key: 'tempControl' as const, label: t.poTz.optTempControl },
                { key: 'rs485' as const, label: t.poTz.optRs485 },
                { key: 'afFans' as const, label: t.poTz.optAfFans },
                { key: 'vibration' as const, label: t.poTz.optVibration },
                { key: 'currentTrans' as const, label: t.poTz.optCurrentTrans },
                { key: 'oemBrand' as const, label: t.poTz.optOemBrand },
                { key: 'seismic9' as const, label: t.poTz.optSeismic9 },
                { key: 'outdoorU1' as const, label: t.poTz.optOutdoorU1 },
                { key: 'testReports' as const, label: t.poTz.optTestReports },
                { key: 'ruPassport' as const, label: t.poTz.optRuPassport },
                { key: 'dimensionsLimit' as const, label: t.poTz.optDimensionsLimit },
              ].map((opt) => (
                <label
                  key={opt.key}
                  onClick={() => toggleOption(opt.key)}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all select-none ${
                    options[opt.key]
                      ? 'bg-blue-50/70 border-[#0b3d66] text-[#072640] font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={options[opt.key]}
                    onChange={() => {}} // handled by parent onClick
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0b3d66] focus:ring-[#0b3d66] cursor-pointer shrink-0"
                  />
                  <span className="leading-snug">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Block 3: Additional Notes & Schematics */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700">
              {t.poTz.fieldComments}
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Укажите ориентацию вводов (верхние/боковые/шинные мосты), ссылки на чертежи, требуемый цвет окраски кожуха или марку стали сердечника..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#0b3d66] focus:outline-none"
            />
          </div>

          {/* Block 4: Live Summary Specification Preview */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0b3d66]" />
                {t.poTz.summaryTitle}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {effectivePower} · {voltageHV}/{voltageLV} · FCA
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 font-mono text-[11px] p-4 rounded-2xl max-h-56 overflow-y-auto leading-relaxed border border-slate-800 select-all">
              <pre className="whitespace-pre-wrap">{getTzSummary()}</pre>
            </div>
          </div>

          {/* Block 5: Mandatory 152-FZ Consent Checkbox */}
          <div
            className={`p-3.5 rounded-xl border transition-colors ${
              consentError ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => {
                  setConsentGiven(e.target.checked);
                  if (e.target.checked) setConsentError(false);
                }}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0b3d66] focus:ring-[#0b3d66] cursor-pointer shrink-0"
              />
              <span className="leading-snug">
                {t.consent.checkboxText}{' '}
                <a
                  href={privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#0b3d66] font-bold underline hover:text-[#e6a417] transition-colors"
                >
                  {t.consent.privacyLink}
                </a>
                {t.consent.suffix ? ` ${t.consent.suffix}` : ''}.
              </span>
            </label>
            {consentError && (
              <p className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚠</span> {t.consent.error}
              </p>
            )}
          </div>

          {/* Block 6: Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={mailtoLink}
                onClick={handleSendEmail}
                className="inline-flex items-center justify-center gap-2 bg-[#0b3d66] hover:bg-navy-dark text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#e6a417]" />
                {t.poTz.sendEmailBtn}
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-5 py-3 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? t.poTz.copiedBtn : t.poTz.copyBtn}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="text-xs font-bold text-[#0b3d66] hover:text-[#e6a417] transition-colors cursor-pointer text-center sm:text-right"
            >
              Или заполнить краткую форму запроса на сайте →
            </button>
          </div>
        </div>
      </section>

      {/* Note / Instruction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <strong className="text-navy text-sm block mb-1">
              {language === 'zh' ? '如何提交采购需求：' : language === 'en' ? 'How to submit your technical requirements:' : 'Как отправить запрос:'}
            </strong>
            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
              {language === 'zh'
                ? '请将技术规格书、选型表、单线系统图或 CAD 图纸发送至官方电子邮箱 '
                : language === 'en'
                ? 'Send your technical specification, single-line diagram, or drawings to our email '
                : 'Направьте техническое задание, опросный лист, однолинейную схему или чертежи на электронную почту '}
              <a href="mailto:mail@mail.ru" className="font-bold text-[#0b3d66] underline">
                mail@mail.ru
              </a>
              .
            </p>
          </div>
          <a
            href="mailto:mail@mail.ru"
            className="bg-[#0b3d66] hover:bg-navy-dark text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 shadow-xs"
          >
            mail@mail.ru
          </a>
        </div>
      </section>
    </div>
  );
};
