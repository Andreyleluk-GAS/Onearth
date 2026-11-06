import React, { useState } from 'react';
import { Cpu, Sliders, ShieldCheck, FileText, Send, Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

export const PoTzPage: React.FC<Props> = ({ onOpenQuoteModal }) => {
  const { t, language } = useLanguage();

  const [power, setPower] = useState('1000 kVA');
  const [type, setType] = useState('cast_resin');
  const [voltage, setVoltage] = useState('10 / 0.4 kV');
  const [cooling, setCooling] = useState('AN');
  const [enclosure, setEnclosure] = useState('IP31');
  const [windings, setWindings] = useState('copper');
  const [copied, setCopied] = useState(false);

  const getTypeName = (val: string) => {
    if (language === 'zh') {
      if (val === 'cast_resin') return '环氧树脂浇注干式变压器';
      if (val === 'low_loss') return '低损耗节能环氧干变';
      if (val === 'nomex') return 'Nomex H级敞开通风干式变压器';
      if (val === 'oil') return '35 kV 油浸式电力变压器';
      return '特种 / 整流逆变专用变压器';
    }
    if (language === 'en') {
      if (val === 'cast_resin') return 'Cast Resin Dry-Type Transformer';
      if (val === 'low_loss') return 'Low-Loss Energy-Efficient Dry-Type';
      if (val === 'nomex') return 'Nomex Class H Open-Ventilated Dry-Type';
      if (val === 'oil') return '35 kV Oil-Immersed Power Transformer';
      return 'Special / Converter Duty Transformer';
    }
    if (val === 'cast_resin') return 'Сухой с литой изоляцией';
    if (val === 'low_loss') return 'Сухой с литой изоляцией (пониженные потери)';
    if (val === 'nomex') return 'Сухой с воздушно-барьерной изоляцией (Nomex, H)';
    if (val === 'oil') return 'Масляный трансформатор 35 кВ';
    return 'Специальный / преобразовательный';
  };

  const getWindingsName = (val: string) => {
    if (language === 'zh') {
      return val === 'copper' ? '优质无氧铜 (Cu)' : val === 'aluminum' ? '特级电工铝 (Al)' : '按制造工厂设计推荐';
    }
    if (language === 'en') {
      return val === 'copper' ? 'Copper (Cu)' : val === 'aluminum' ? 'Aluminum (Al)' : 'Manufacturer standard';
    }
    return val === 'copper' ? 'Медь (Cu)' : val === 'aluminum' ? 'Алюминий (Al)' : 'По рекомендации завода';
  };

  const getTzSummary = () => {
    if (language === 'zh') {
      return [
        `非标电力变压器技术协议（TS）询价单：`,
        `— 变压器结构类别：${getTypeName(type)}`,
        `— 额定容量：${power}`,
        `— 额定电压等级：${voltage}`,
        `— 冷却方式：${cooling}`,
        `— 外壳防护等级：${enclosure}`,
        `— 绕组导线材质：${getWindingsName(windings)}`,
        `— 交货基准：FCA 满洲里 (Incoterms 2020)`,
        ``,
        `请出具正式技术商务方案与生产交期。`,
      ].join('\n');
    }

    if (language === 'en') {
      return [
        `Inquiry for Custom Power Transformer according to Technical Specification (TS):`,
        `— Transformer Type: ${getTypeName(type)}`,
        `— Rated Capacity: ${power}`,
        `— Voltage Class: ${voltage}`,
        `— Cooling System: ${cooling}`,
        `— Enclosure Rating: ${enclosure}`,
        `— Winding Conductor: ${getWindingsName(windings)}`,
        `— Delivery Basis: FCA Manzhouli (Incoterms 2020)`,
        ``,
        `Please provide official commercial quotation, technical parameters, and factory lead time.`,
      ].join('\n');
    }

    return [
      `Запрос на изготовление силового трансформатора по ТЗ:`,
      `— Тип: ${getTypeName(type)}`,
      `— Номинальная мощность: ${power}`,
      `— Напряжение: ${voltage}`,
      `— Охлаждение: ${cooling}`,
      `— Степень защиты кожуха: ${enclosure}`,
      `— Материал обмоток: ${getWindingsName(windings)}`,
      `— Базис поставки: FCA Маньчжурия (Инкотермс 2020)`,
      ``,
      `Прошу рассчитать стоимость и срок производства на заводе в КНР.`,
    ].join('\n');
  };

  const mailtoLink = `mailto:mail@mail.ru?subject=${encodeURIComponent(
    language === 'zh'
      ? '技术协议变压器询价'
      : language === 'en'
      ? 'Custom Transformer RFQ by TS'
      : 'Запрос на изготовление трансформатора по ТЗ'
  )}&body=${encodeURIComponent(getTzSummary())}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getTzSummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
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

      {/* "Что можно заказать" Section */}
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
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.poTz.c1Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-3">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.poTz.c2Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.poTz.c3Desc}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">{t.poTz.c4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.poTz.c4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quick Spec Builder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-black text-navy">
              {t.poTz.builderTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.poTz.builderSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldType}</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="cast_resin">{getTypeName('cast_resin')}</option>
                <option value="low_loss">{getTypeName('low_loss')}</option>
                <option value="nomex">{getTypeName('nomex')}</option>
                <option value="oil">{getTypeName('oil')}</option>
                <option value="special">{getTypeName('special')}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldPower}</label>
              <select
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                {['630 kVA', '800 kVA', '1000 kVA', '1250 kVA', '1600 kVA', '2000 kVA', '2500 kVA'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldVoltage}</label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="10 / 0.4 kV">10 / 0.4 kV</option>
                <option value="6 / 0.4 kV">6 / 0.4 kV</option>
                <option value="20 / 0.4 kV">20 / 0.4 kV</option>
                <option value="35 / 0.4 kV">35 / 0.4 kV</option>
                <option value="35 / 10 kV">35 / 10 kV</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldEnclosure}</label>
              <select
                value={enclosure}
                onChange={(e) => setEnclosure(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="IP00">IP00</option>
                <option value="IP21">IP21</option>
                <option value="IP31">IP31</option>
                <option value="IP54">IP54</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldWindings}</label>
              <select
                value={windings}
                onChange={(e) => setWindings(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="copper">{getWindingsName('copper')}</option>
                <option value="aluminum">{getWindingsName('aluminum')}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">{t.poTz.fieldCooling}</label>
              <select
                value={cooling}
                onChange={(e) => setCooling(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="AN">AN (Air Natural)</option>
                <option value="AF">AF (Air Forced)</option>
                <option value="ONAN">ONAN (Oil Natural Air Natural)</option>
              </select>
            </div>
          </div>

          {/* Builder CTAs */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <a
                href={mailtoLink}
                className="inline-flex items-center gap-2 bg-[#0b3d66] hover:bg-navy-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#e6a417]" />
                {t.poTz.sendEmailBtn}
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? t.poTz.copiedBtn : t.poTz.copyBtn}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="text-xs font-bold text-navy hover:underline cursor-pointer"
            >
              {language === 'zh'
                ? '或在线填写技术询价表单 →'
                : language === 'en'
                ? 'Or complete inquiry modal online →'
                : 'Или заполнить форму запроса на сайте →'}
            </button>
          </div>
        </div>
      </section>

      {/* Note / Instruction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm">
          <strong className="text-navy text-sm block mb-1">
            {language === 'zh' ? '如何提交采购需求：' : language === 'en' ? 'How to submit your technical requirements:' : 'Как отправить запрос:'}
          </strong>
          <p className="text-xs text-slate-700 leading-relaxed">
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
      </section>
    </div>
  );
};
