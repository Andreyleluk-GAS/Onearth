import React, { useState } from 'react';
import { FileText, Cpu, CheckCircle2, Sliders, ShieldCheck, Mail, Phone, Send, Copy, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

export const PoTzPage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  // Interactive checklist builder state
  const [power, setPower] = useState('1000 кВА');
  const [type, setType] = useState('Сухой с литой изоляцией');
  const [voltage, setVoltage] = useState('10 / 0,4 кВ');
  const [cooling, setCooling] = useState('AN (естественное)');
  const [enclosure, setEnclosure] = useState('IP31 (с кожухом)');
  const [windings, setWindings] = useState('Медь');
  const [copied, setCopied] = useState(false);

  const getTzSummary = () => {
    return [
      `Запрос на изготовление силового трансформатора по ТЗ:`,
      `— Тип: ${type}`,
      `— Номинальная мощность: ${power}`,
      `— Напряжение: ${voltage}`,
      `— Охлаждение: ${cooling}`,
      `— Степень защиты кожуха: ${enclosure}`,
      `— Материал обмоток: ${windings}`,
      `— Базис поставки: FCA Маньчжурия (Инкотермс 2020)`,
      ``,
      `Прошу рассчитать стоимость и срок производства на заводе в КНР.`,
    ].join('\n');
  };

  const mailtoLink = `mailto:mail@mail.ru?subject=${encodeURIComponent(
    'Запрос на изготовление трансформатора по ТЗ'
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
              Индивидуальный инжиниринг и OEM
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Изготовление трансформаторов по ТЗ заказчика
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              Наша команда подберёт профильный китайский завод и изготовит сухой или масляный трансформатор под специфические требования вашего проекта: по техническому заданию, опросному листу, однолинейной схеме или чертежам.
            </p>
          </div>
        </div>
      </section>

      {/* "Что можно заказать" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-navy">
            Что можно заказать
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Широкие возможности заводской кастомизации под российские отраслевые стандарты
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Сухие трансформаторы</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              С литой эпоксидной смолой или с воздушно-барьерной изоляцией Nomex (H-класс) со стандартными либо существенно сниженными потерями холостого хода и КЗ.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-3">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Масляные типа ТМ / ТМН</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              На класс напряжения 35 кВ с переключением ПБВ или регулированием под нагрузкой (РПН) — для наружной установки, распределительных сетей и промплощадок.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Специальные серии</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Силовые трансформаторы для питания тиристорных преобразователей, мощных выпрямителей, дуговых и индукционных электропечей, ветрогенерации.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Производство OEM</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Выпуск готовой продукции под собственной торговой маркой заказчика с маркировкой, индивидуальными шильдами и русскоязычной документацией.
            </p>
          </div>
        </div>
      </section>

      {/* "Какие параметры требуется указать" (3 Cards from start_data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-navy">
            Какие параметры требуется указать для расчёта
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ключевые инженерные требования для точного подбора завода и формирования КП
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-[#e6a417] uppercase tracking-wider block">Раздел 1</span>
              <h3 className="text-base font-black text-navy mt-1">Электрические параметры</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Номинальная мощность, кВА (630–2500 кВА и выше).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Напряжения ВН и НН, кВ (например: 6; 10; 20; 35 / 0,4 кВ).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Частота питающей сети: 50 или 60 Гц.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Число фаз, схема и группа соединения обмоток (Д/Ун-11, У/Ун-0 и др.).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Напряжение короткого замыкания Uк, % (6%, 8%, 6,5% или иное).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Диапазон и тип регулирования: ПБВ (±2х2,5%) или РПН.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Потери холостого хода (P₀) и короткого замыкания (Pкз), класс энергоэффективности.</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-[#e6a417] uppercase tracking-wider block">Раздел 2</span>
              <h3 className="text-base font-black text-navy mt-1">Конструкция и эксплуатация</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Система охлаждения: AN/AF для сухих, ONAN/ONAF для масляных.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Класс нагревостойкости изоляции (F / H), уровень изоляции.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Материал обмоток: электротехническая медь или алюминий.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Условия установки: внутри закрытого помещения или на открытом воздухе.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Климатическое исполнение (У3, УХЛ4, У1), температурный диапазон, высота над уровнем моря, сейсмостойкость (до 9 баллов).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Степень защиты защитного кожуха: IP00, IP21, IP31 и другие.</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold text-[#e6a417] uppercase tracking-wider block">Раздел 3</span>
              <h3 className="text-base font-black text-navy mt-1">Комплектация и испытания</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Габаритные и присоединительные размеры, масса, способ транспортировки.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Требования к расположению вводов и выводов (сверху/снизу/сбоку), гибкие шинные компенсаторы.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Микропроцессорные блоки контроля температуры (RS485 Modbus RTU).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Требования к антикоррозийной окраске кожуха и толщине слоя.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-navy font-bold">•</span>
                <span>Необходимые приёмо-сдаточные, типовые или специальные заводские испытания (протоколы на русском языке).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Quick Spec Builder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-50 rounded-3xl border border-surface-border p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-black text-navy">
              Интерактивный конструктор базовых параметров ТЗ
            </h3>
            <p className="text-xs text-slate-500">
              Выберите основные параметры для быстрой отправки в отдел ВЭД
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Тип трансформатора:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="Сухой с литой изоляцией">Сухой с литой изоляцией</option>
                <option value="Сухой с литой изоляцией (пониженные потери)">Сухой с литой изоляцией (пониженные потери)</option>
                <option value="Сухой с воздушно-барьерной изоляцией (Nomex, H)">Сухой с воздушно-барьерной изоляцией (Nomex, H)</option>
                <option value="Масляный трансформатор 35 кВ">Масляный трансформатор 35 кВ</option>
                <option value="Специальный / преобразовательный">Специальный / преобразовательный</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Мощность:</label>
              <select
                value={power}
                onChange={(e) => setPower(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                {['630 кВА', '800 кВА', '1000 кВА', '1250 кВА', '1600 кВА', '2000 кВА', '2500 кВА', 'Иная по ТЗ'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Напряжение ВН / НН:</label>
              <select
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="10 / 0,4 кВ">10 / 0,4 кВ</option>
                <option value="6 / 0,4 кВ">6 / 0,4 кВ</option>
                <option value="20 / 0,4 кВ">20 / 0,4 кВ</option>
                <option value="35 / 0,4 кВ">35 / 0,4 кВ</option>
                <option value="35 / 10 кВ">35 / 10 кВ</option>
                <option value="Нестандартное по ТЗ">Нестандартное по ТЗ</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Кожух (степень защиты):</label>
              <select
                value={enclosure}
                onChange={(e) => setEnclosure(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="IP00 (без кожуха)">IP00 (без кожуха)</option>
                <option value="IP21 (внутренняя установка)">IP21 (внутренняя установка)</option>
                <option value="IP31 (с защитой от капель)">IP31 (с защитой от капель)</option>
                <option value="IP54 (пыле-влагозащищённый)">IP54 (пыле-влагозащищённый)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Материал обмоток:</label>
              <select
                value={windings}
                onChange={(e) => setWindings(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="Медь (Cu)">Медь (Cu)</option>
                <option value="Алюминий (Al)">Алюминий (Al)</option>
                <option value="По рекомендации завода">По рекомендации завода</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Охлаждение:</label>
              <select
                value={cooling}
                onChange={(e) => setCooling(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 font-medium"
              >
                <option value="AN (естественное воздушное)">AN (естественное воздушное)</option>
                <option value="AF (принудительное с вентиляторами)">AF (принудительное с вентиляторами)</option>
                <option value="ONAN (масляное естественное)">ONAN (масляное естественное)</option>
              </select>
            </div>
          </div>

          {/* Builder CTAs */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <a
                href={mailtoLink}
                className="inline-flex items-center gap-2 bg-[#0b3d66] hover:bg-navy-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
              >
                <Send className="w-4 h-4 text-[#e6a417]" />
                Отправить в письме на mail@mail.ru
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Скопировано!' : 'Скопировать ТЗ'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="text-xs font-bold text-navy hover:underline"
            >
              Или заполнить форму запроса на сайте →
            </button>
          </div>
        </div>
      </section>

      {/* Note / Instruction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm">
          <strong className="text-navy text-sm block mb-1">Как отправить запрос:</strong>
          <p className="text-xs text-slate-700 leading-relaxed">
            Направьте техническое задание, опросный лист, однолинейную схему или чертежи на электронную почту{' '}
            <a href="mailto:mail@mail.ru" className="font-bold text-[#0b3d66] underline">
              mail@mail.ru
            </a>
            . Обязательно укажите контактное лицо, телефон и ориентировочные сроки реализации проекта.
          </p>
        </div>
      </section>
    </div>
  );
};
