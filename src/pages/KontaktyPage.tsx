import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onOpenQuoteModal: () => void;
}

export const KontaktyPage: React.FC<Props> = () => {
  const { t, language } = useLanguage();
  const [formCompany, setFormCompany] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formComment, setFormComment] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [copied, setCopied] = useState(false);

  const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const privacyUrl = `${BASE}/politika-konfidencialnosti`;

  const getEmailText = () => {
    if (language === 'zh') {
      return [
        `来自 ${formCompany || '客户企业'} 的电力变压器采购咨询：`,
        `— 联系人：${formName || '未提供'}`,
        `— 联系电话：${formPhone || '未提供'}`,
        `— 电子邮箱：${formEmail || '未提供'}`,
        `— 设备参数 / 需求备注：${formComment || '请安排工程部与我司对接具体技术协议'}`,
        `— 交货基准：FCA (Free Carrier) (Incoterms 2020)`,
      ].join('\n');
    }

    if (language === 'en') {
      return [
        `Inquiry from ${formCompany || 'Client Organization'}:`,
        `— Contact Person: ${formName || 'Not specified'}`,
        `— Phone Number: ${formPhone || 'Not specified'}`,
        `— Email: ${formEmail || 'Not specified'}`,
        `— Transformer Specifications / Comments: ${formComment || 'Please contact us to review technical requirements'}`,
        `— Delivery Basis: FCA (Free Carrier) (Incoterms 2020)`,
      ].join('\n');
    }

    return [
      `Запрос от ${formCompany || 'Организации'}:`,
      `— Контактное лицо: ${formName || 'Не указано'}`,
      `— Телефон: ${formPhone || 'Не указано'}`,
      `— Email: ${formEmail || 'Не указано'}`,
      `— Параметры трансформатора: ${formComment || 'Прошу связаться для уточнения ТЗ'}`,
      `— Базис поставки: FCA (Free Carrier), (Инкотермс 2020)`,
    ].join('\n');
  };

  const mailtoLink = `mailto:mail@mail.ru?subject=${encodeURIComponent(
    language === 'zh'
      ? `变压器采购咨询 — ${formCompany || '客户企业'}`
      : language === 'en'
      ? `Equipment Inquiry — ${formCompany || 'Transformers'}`
      : `Запрос оборудования — ${formCompany || 'Трансформаторы'}`
  )}&body=${encodeURIComponent(getEmailText())}`;

  const handleSendEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!consentGiven) {
      e.preventDefault();
      setConsentError(true);
      return;
    }
  };

  const handleCopy = async () => {
    if (!consentGiven) {
      setConsentError(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(getEmailText());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <section className="bg-[#0b3d66] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md inline-block mb-3">
              {t.kontakty.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {t.kontakty.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              {t.kontakty.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Card info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Company Details Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-surface-border p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[11px] font-bold text-[#e6a417] uppercase tracking-wider bg-[#fff7e6] px-2.5 py-1 rounded-md">
                {t.kontakty.legalTitle}
              </span>
              <h2 className="text-2xl font-black text-navy mt-2">
                {t.kontakty.companyName}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'zh'
                  ? '精选中国高可靠装备制造基地，专业对接输变电设备出口'
                  : language === 'en'
                  ? 'Vetted Chinese power equipment manufacturers with direct factory supply'
                  : 'Подбор китайских заводов и поставка трансформаторов'}
              </p>
            </div>

            {/* Contacts Info */}
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#e6a417]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{t.kontakty.directPhone}</span>
                  <a
                    href="tel:+73431234567"
                    className="text-base font-bold text-navy hover:text-[#e6a417] transition-colors"
                  >
                    +7 (343) 123-45-67
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {language === 'zh' ? '周一至周五 09:00 - 18:00 (UTC+5)' : language === 'en' ? 'Mon–Fri 09:00 – 18:00 (UTC+5)' : 'Пн–Пт с 09:00 до 18:00 (МСК+2)'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#e6a417]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{t.kontakty.directEmail}</span>
                  <a
                    href="mailto:mail@mail.ru"
                    className="text-base font-bold text-navy hover:text-[#e6a417] transition-colors"
                  >
                    mail@mail.ru
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {language === 'zh' ? '接收技术协议、选型询价单、单线图及 CAD 图纸' : language === 'en' ? 'For single-line diagrams, RFQs, datasheets, and blueprints' : 'Для опросных листов, ТЗ, схем и чертежей'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#e6a417]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{t.kontakty.deliveryBasis}</span>
                  <span className="font-semibold text-slate-800">
                    {t.kontakty.fcaTerm}
                  </span>
                </div>
              </div>
            </div>

            {/* Specific Instructions Card */}
            <div className="bg-[#f6f8fa] border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
              <strong className="text-navy font-bold block">
                {language === 'zh' ? '选型测算所需提供的核心技术参数：' : language === 'en' ? 'Information needed for immediate quote calculation:' : 'Что указать в запросе для быстрого расчёта:'}
              </strong>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {language === 'zh'
                  ? '额定容量（kVA）、高低压侧额定电压（kV）、变压器结构类别（环氧浇注/Nomex敞开/油浸式）、短路阻抗 Uk、联结组标号（如 Dyn11/Yyn0）、损耗限值要求、冷却系统（AN/AF）、外壳防护等级（IP00/IP21/IP31）及使用环境工况。'
                  : language === 'en'
                  ? 'Rated capacity (kVA), primary and secondary voltages (kV), insulation type (cast resin / open-ventilated Nomex / oil-immersed), impedance Uk, vector group (Dyn11 / Yyn0), loss criteria, cooling mode (AN/AF), enclosure IP class, and operating environmental conditions.'
                  : 'Номинальную мощность, напряжения ВН и НН, тип трансформатора (сухой с литой / воздушно-барьерной изоляцией или масляный), напряжение короткого замыкания Uк, схему и группу соединения обмоток, требования к потерям ХХ/КЗ, систему охлаждения, исполнение кожуха (IP00/IP21/IP31) и условия эксплуатации.'}
              </p>
            </div>
          </div>

          {/* Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-surface-border p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-navy">
                {t.kontakty.formTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.kontakty.formSub}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.kontakty.companyField}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'zh' ? '某某电力工程有限公司' : language === 'en' ? 'Industrial / Engineering Co.' : 'ООО / АО / Проектная организация'}
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.kontakty.nameField}
                  </label>
                  <input
                    type="text"
                    placeholder={language === 'zh' ? '联系人姓名 / 职务' : language === 'en' ? 'Full name / Title' : 'ФИО / должность'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.kontakty.phoneField}
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.kontakty.emailField}
                  </label>
                  <input
                    type="email"
                    placeholder="mail@company.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.kontakty.commentField}
                </label>
                <textarea
                  rows={4}
                  placeholder={
                    language === 'zh'
                      ? '请填写额定容量（kVA）、高低压电压（10/20/35 kV）、损耗参数、外壳防护要求以及所需台数'
                      : language === 'en'
                      ? 'Please specify rated capacity (kVA), voltage class (10/20/35 kV), loss preferences, enclosure rating, and required quantity'
                      : 'Укажите мощность (кВА), класс напряжения (10/20/35 кВ), требования к потерям, исполнение кожуха и необходимое количество штук'
                  }
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              {/* Mandatory Consent Checkbox (152-FZ) */}
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

              <div className="pt-2 space-y-2">
                <a
                  href={mailtoLink}
                  onClick={handleSendEmail}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b3d66] hover:bg-navy-dark text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#e6a417]" />
                  {language === 'zh'
                    ? '在邮件客户端中打开 (mail@mail.ru)'
                    : language === 'en'
                    ? 'Open Prepared Message in Email Client (mail@mail.ru)'
                    : 'Открыть письмо в почтовом клиенте (mail@mail.ru)'}
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? t.kontakty.copiedBtn : t.kontakty.copyBtn}
                  </button>

                  <a
                    href="tel:+73431234567"
                    className="bg-[#fff7e6] hover:bg-[#ffeed1] text-[#935d03] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e6a417]" />
                    {t.nav.callUs}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
