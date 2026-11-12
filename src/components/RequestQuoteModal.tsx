import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, CheckCircle, Copy, Send } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { crmService } from '../services/crmService';
import { trackMetrikaGoal } from '../services/yandexMetrika';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialCategorySlug?: string;
  initialPower?: string;
}

export const RequestQuoteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialCategorySlug,
  initialPower,
}) => {
  const { t, language, categories } = useLanguage();
  const [categorySlug, setCategorySlug] = useState<string>(initialCategorySlug || 'suhie-litaya-10kv');
  const [power, setPower] = useState<string>(initialPower || '1000');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
  const privacyUrl = `${BASE}/politika-konfidencialnosti`;

  useEffect(() => {
    if (initialCategorySlug) setCategorySlug(initialCategorySlug);
    if (initialPower) setPower(initialPower);
    if (isOpen) {
      setIsSubmitted(false);
      setIsCopied(false);
      setConsentGiven(false);
      setConsentError(false);
    }
  }, [initialCategorySlug, initialPower, isOpen]);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const categoryTitle = currentCategory?.title || 'Power Transformers';

  const generateEmailSubject = () => {
    if (language === 'zh') {
      return encodeURIComponent(`变压器报价申请: ${categoryTitle} — ${power} kVA — ${company || '客户单位'}`);
    }
    if (language === 'en') {
      return encodeURIComponent(`RFQ: ${categoryTitle} — ${power} kVA — ${company || 'Company'}`);
    }
    return encodeURIComponent(`Запрос КП: ${categoryTitle} — ${power} кВА — ${company || 'Организация'}`);
  };

  const generateEmailBodyText = () => {
    if (language === 'zh') {
      return [
        `尊敬的湖北万域贸易有限公司（Hubei Onearth Trading Company Limited）：`,
        ``,
        `您好！我方现申请提供以下电力变压器设备的技术规格书与商业报价（FCA (Free Carrier) 交货）：`,
        `— 变压器型号分类：${categoryTitle}`,
        `— 额定容量：${power} kVA`,
        `— 交货基准：FCA (Free Carrier)（Incoterms 2020）`,
        ``,
        `询价方联系信息：`,
        `— 单位名称：${company || '未填写'}`,
        `— 联系人：${contactName || '未填写'}`,
        `— 联系电话：${phone || '未填写'}`,
        `— 电子邮箱：${email || '未填写'}`,
        comment ? `— 特殊技术要求/备注：${comment}` : '',
        ``,
        `请将技术方案与报价文件回复至此电子邮箱。`,
      ].filter(Boolean).join('\n');
    }

    if (language === 'en') {
      return [
        `Dear Hubei Onearth Trading Company Limited,`,
        ``,
        `Please prepare an official commercial quotation and technical datasheet for the following power transformer equipment:`,
        `— Equipment Type: ${categoryTitle}`,
        `— Rated Capacity: ${power} kVA`,
        `— Delivery Basis: FCA (Free Carrier) (Incoterms 2020)`,
        ``,
        `Buyer Contact Information:`,
        `— Company Name: ${company || 'Not specified'}`,
        `— Contact Person: ${contactName || 'Not specified'}`,
        `— Phone Number: ${phone || 'Not specified'}`,
        `— Email: ${email || 'Not specified'}`,
        comment ? `— Technical Notes / Requirements: ${comment}` : '',
        ``,
        `We look forward to receiving your response at this email address.`,
      ].filter(Boolean).join('\n');
    }

    return [
      `Здравствуйте, Hubei Onearth Trading Company Limited!`,
      ``,
      `Прошу подготовить коммерческое предложение и техническую спецификацию на трансформаторное оборудование:`,
      `— Тип оборудования: ${categoryTitle}`,
      `— Номинальная мощность: ${power} кВА`,
      `— Базис поставки: FCA (Free Carrier), (Инкотермс 2020)`,
      ``,
      `Контактные данные заказчика:`,
      `— Организация: ${company || 'Не указано'}`,
      `— Контактное лицо: ${contactName || 'Не указано'}`,
      `— Телефон: ${phone || 'Не указано'}`,
      `— Email: ${email || 'Не указано'}`,
      comment ? `— Примечания/требования ТЗ: ${comment}` : '',
      ``,
      `Ждем ответ на данный адрес электронной почты.`,
    ].filter(Boolean).join('\n');
  };

  const mailtoLink = `mailto:mail@mail.ru?subject=${generateEmailSubject()}&body=${encodeURIComponent(generateEmailBodyText())}`;

  const handleSendEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!consentGiven) {
      e.preventDefault();
      setConsentError(true);
      return;
    }
    trackMetrikaGoal('lead_quote_request', {
      categorySlug,
      power,
      company: company || undefined,
      method: 'mailto',
    });
  };

  const handleCopyText = async () => {
    if (!consentGiven) {
      setConsentError(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(generateEmailBodyText());
      setIsCopied(true);
      trackMetrikaGoal('lead_quote_copy', {
        categorySlug,
        power,
      });
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven) {
      setConsentError(true);
      return;
    }
    // Auto-record lead in CRM
    try {
      crmService.addLead({
        companyName: company || 'Без названия',
        contactName: contactName || 'Контактное лицо',
        phone,
        email,
        categoryTitle,
        categorySlug,
        powerKva: power,
        comment,
        status: 'new',
        source: 'catalog_card',
      });
      trackMetrikaGoal('lead_quote_request', {
        categorySlug,
        power,
        company: company || undefined,
        method: 'form_submit',
      });
    } catch {
      // safe fallback
    }
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-surface-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-5">
              <span className="text-[11px] font-bold text-[#e6a417] uppercase tracking-wider bg-[#fff7e6] px-2.5 py-1 rounded-md">
                {t.nav.fcaBadge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
                {t.quoteModal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.quoteModal.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.quoteModal.category}
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.shortTitle}
                    </option>
                  ))}
                  <option value="custom">
                    {language === 'zh'
                      ? '按特定技术协议 / 图纸非标定制'
                      : language === 'en'
                      ? 'Custom by Technical Assignment / Questionnaire'
                      : 'Изготовление по индивидуальному ТЗ / опросный лист'}
                  </option>
                </select>
              </div>

              {/* Power rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.quoteModal.power}
                  </label>
                  <select
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  >
                    {['630', '800', '1000', '1250', '1600', '2000', '2500', '3150', '4000', '5000', '6300'].map((p) => (
                      <option key={p} value={p}>
                        {p} kVA
                      </option>
                    ))}
                    <option value="custom">
                      {language === 'zh' ? '其他非标容量' : language === 'en' ? 'Other rating' : 'Иная мощность'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.quoteModal.company}
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={language === 'zh' ? '例如：华东电力建设' : language === 'en' ? 'e.g. Industrial Corp' : 'ООО "ЭнергоСтрой"'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact and Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.quoteModal.name}
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={language === 'zh' ? '张经理' : language === 'en' ? 'John Doe' : 'Иван Иванов'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.quoteModal.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.quoteModal.email}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.quoteModal.comment}
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.quoteModal.commentPlaceholder}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none resize-none"
                />
              </div>

              {/* Mandatory Consent Checkbox (152-FZ) */}
              <div
                className={`p-3 rounded-xl border transition-colors ${
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

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={mailtoLink}
                  onClick={handleSendEmail}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 text-center"
                >
                  <Mail className="w-4 h-4" />
                  {t.quoteModal.sendEmailBtn}
                </a>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-bold text-xs transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {isCopied ? t.quoteModal.copiedBtn : t.quoteModal.copyBtn}
                </button>
              </div>

              <p className="text-[10px] text-slate-400 text-center pt-1">
                {t.quoteModal.directNotice}
              </p>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-navy">
              {language === 'zh' ? '需求已成功生成！' : language === 'en' ? 'Inquiry Generated Successfully!' : 'Запрос успешно сформирован!'}
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              {language === 'zh'
                ? '请点击下方按钮直接通过邮件发送至 mail@mail.ru，或复制文本发送至我司外贸部。'
                : language === 'en'
                ? 'Click below to send via your email client directly to mail@mail.ru, or copy the formatted text.'
                : 'Нажмите кнопку ниже для отправки готового письма через почтовую программу на mail@mail.ru или скопируйте текст.'}
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <a
                href={mailtoLink}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#e6a417] text-[#072640] py-2.5 px-4 rounded-xl font-bold text-xs uppercase"
              >
                <Send className="w-4 h-4" />
                {t.quoteModal.sendEmailBtn}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-600 py-1"
              >
                {t.quoteModal.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
