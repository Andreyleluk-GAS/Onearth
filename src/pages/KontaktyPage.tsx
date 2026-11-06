import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Clock, ShieldCheck, Copy } from 'lucide-react';

interface Props {
  onOpenQuoteModal: () => void;
}

export const KontaktyPage: React.FC<Props> = ({ onOpenQuoteModal }) => {
  const [formCompany, setFormCompany] = useState('');
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formComment, setFormComment] = useState('');
  const [copied, setCopied] = useState(false);

  const getEmailText = () => {
    return [
      `Запрос от ${formCompany || 'Организации'}:`,
      `— Контактное лицо: ${formName || 'Не указано'}`,
      `— Телефон: ${formPhone || 'Не указано'}`,
      `— Email: ${formEmail || 'Не указано'}`,
      `— Параметры трансформатора: ${formComment || 'Прошу связаться для уточнения ТЗ'}`,
      `— Базис поставки: FCA Маньчжурия (Инкотермс 2020)`,
    ].join('\n');
  };

  const mailtoLink = `mailto:mail@mail.ru?subject=${encodeURIComponent(
    `Запрос оборудования — ${formCompany || 'Трансформаторы'}`
  )}&body=${encodeURIComponent(getEmailText())}`;

  const handleCopy = async () => {
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
              Прямая связь с отделом ВЭД
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Контакты
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              Отправьте запрос, техническое задание или опросный лист — оперативно подготовим официальное технико-коммерческое предложение по трансформаторному оборудованию из Китая.
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
                Юридическое лицо
              </span>
              <h2 className="text-2xl font-black text-navy mt-2">
                Hubei Onearth Trading Company Limited
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Подбор китайских заводов и поставка трансформаторов в РФ
              </p>
            </div>

            {/* Contacts Info */}
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#e6a417]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Телефон для связи:</span>
                  <a
                    href="tel:+73431234567"
                    className="text-base font-bold text-navy hover:text-[#e6a417] transition-colors"
                  >
                    +7 (343) 123-45-67
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Пн–Пт с 09:00 до 18:00 (МСК+2)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#e6a417]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Электронная почта:</span>
                  <a
                    href="mailto:mail@mail.ru"
                    className="text-base font-bold text-navy hover:text-[#e6a417] transition-colors"
                  >
                    mail@mail.ru
                  </a>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Для опросных листов, ТЗ, схем и чертежей
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#e6a417]" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Базис отгрузки:</span>
                  <span className="font-semibold text-slate-800">
                    FCA Маньчжурия (Инкотермс 2020), граница КНР/РФ
                  </span>
                </div>
              </div>
            </div>

            {/* Specific Instructions Card from Client HTML */}
            <div className="bg-[#f6f8fa] border border-slate-200 rounded-2xl p-5 space-y-2 text-xs">
              <strong className="text-navy font-bold block">
                Что указать в запросе для быстрого расчёта:
              </strong>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Номинальную мощность, напряжения ВН и НН, тип трансформатора (сухой с литой / воздушно-барьерной изоляцией или масляный), напряжение короткого замыкания Uк, схему и группу соединения обмоток, требования к потерям ХХ/КЗ, систему охлаждения, исполнение кожуха (IP00/IP21/IP31) и условия эксплуатации.
              </p>
            </div>
          </div>

          {/* Direct Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-surface-border p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-navy">
                Форма отправки запроса
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Заполните данные — система сформирует письмо для отправки на mail@mail.ru
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Компания / Предприятие:
                  </label>
                  <input
                    type="text"
                    placeholder="ООО / АО / Проектная организация"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Контактное лицо:
                  </label>
                  <input
                    type="text"
                    placeholder="ФИО / должность"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Телефон:
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
                    Электронная почта:
                  </label>
                  <input
                    type="email"
                    placeholder="mail@company.ru"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-navy focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Параметры трансформатора / текст ТЗ:
                </label>
                <textarea
                  rows={4}
                  placeholder="Укажите мощность (кВА), класс напряжения (10/20/35 кВ), требования к потерям, исполнение кожуха и необходимое количество штук"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-800 focus:ring-2 focus:ring-navy focus:outline-none"
                />
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href={mailtoLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0b3d66] hover:bg-navy-dark text-white py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 text-[#e6a417]" />
                  Открыть письмо в почтовом клиенте (mail@mail.ru)
                </a>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Текст скопирован в буфер!' : 'Скопировать текст обращения'}
                  </button>

                  <a
                    href="tel:+73431234567"
                    className="bg-[#fff7e6] hover:bg-[#ffeed1] text-[#935d03] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e6a417]" />
                    Позвонить
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
