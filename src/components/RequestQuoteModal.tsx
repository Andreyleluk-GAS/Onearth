import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, CheckCircle, Copy, Send } from 'lucide-react';
import { TRANSFORMER_CATEGORIES } from '../data/transformerCatalog';

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
  const [categorySlug, setCategorySlug] = useState<string>(initialCategorySlug || 'suhie-litaya-10kv');
  const [power, setPower] = useState<string>(initialPower || '1000');
  const [company, setCompany] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (initialCategorySlug) setCategorySlug(initialCategorySlug);
    if (initialPower) setPower(initialPower);
    if (isOpen) {
      setIsSubmitted(false);
      setIsCopied(false);
    }
  }, [initialCategorySlug, initialPower, isOpen]);

  if (!isOpen) return null;

  const currentCategory = TRANSFORMER_CATEGORIES.find((c) => c.slug === categorySlug);
  const categoryTitle = currentCategory?.title || 'Трансформаторное оборудование';

  const generateEmailSubject = () => {
    return encodeURIComponent(`Запрос КП: ${categoryTitle} — ${power} кВА — ${company || 'Организация'}`);
  };

  const generateEmailBodyText = () => {
    return [
      `Здравствуйте, Hubei Onearth Trading Company Limited!`,
      ``,
      `Прошу подготовить коммерческое предложение и техническую спецификацию на трансформаторное оборудование:`,
      `— Тип оборудования: ${categoryTitle}`,
      `— Номинальная мощность: ${power} кВА`,
      `— Базис поставки: FCA Маньчжурия (Инкотермс 2020)`,
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

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateEmailBodyText());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
                FCA Маньчжурия · Прямые поставки из Китая
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
                Запрос коммерческого предложения
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Подготовим ТКП с техническими параметрами, сроками и ценой от китайского завода-производителя
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Тип оборудования:
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                >
                  {TRANSFORMER_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.shortTitle}
                    </option>
                  ))}
                  <option value="custom">Изготовление по индивидуальному ТЗ / опросный лист</option>
                </select>
              </div>

              {/* Power rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Мощность (кВА):
                  </label>
                  <select
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  >
                    {[630, 800, 1000, 1250, 1600, 2000, 2500].map((p) => (
                      <option key={p} value={p}>
                        {p} кВА
                      </option>
                    ))}
                    <option value="custom">Другая (по ТЗ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Телефон для связи:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Company & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Название компании:
                  </label>
                  <input
                    type="text"
                    placeholder="ООО / АО / Завод"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ваш E-mail:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="mail@company.ru"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              {/* Comment / Extra requirements */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Требования ТЗ / схема / объект (необязательно):
                </label>
                <textarea
                  rows={2}
                  placeholder="Укажите напряжение ВН/НН, степень защиты кожуха (IP21/IP31), наличие RS485 или особые климатические условия"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-navy focus:outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <a
                  href={mailtoLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b3d66] hover:bg-[#072640] text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 text-[#e6a417]" />
                  Открыть готовое письмо в почте (mail@mail.ru)
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-lg font-semibold text-[11px] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {isCopied ? 'Параметры скопированы!' : 'Скопировать текст запроса'}
                  </button>

                  <a
                    href="tel:+73431234567"
                    className="inline-flex items-center gap-1.5 bg-[#fff7e6] hover:bg-[#ffeed1] text-[#935d03] py-2 px-3 rounded-lg font-bold text-[11px] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e6a417]" />
                    +7 (343) 123-45-67
                  </a>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Confirmation View */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-navy">Запрос сформирован</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Письмо с параметрами заказа готово к отправке на официальную почту{' '}
              <strong className="text-navy">mail@mail.ru</strong>. Наш специалист свяжется с вами для уточнения деталей.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-navy text-white px-6 py-2 rounded-lg text-xs font-bold"
              >
                Закрыть окно
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
