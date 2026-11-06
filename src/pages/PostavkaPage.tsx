import React from 'react';
import { Truck, FileCheck, Languages, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

export const PostavkaPage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  const steps = [
    {
      num: '01',
      title: 'Технический подбор и ТКП',
      desc: 'Анализ однолинейной схемы или ТЗ, выбор профильного китайского завода, расчёт стоимости оборудования.',
    },
    {
      num: '02',
      title: 'Спецификация и договор',
      desc: 'Фиксация технических параметров, чертежей общего вида, состава документации и языка протоколов испытаний.',
    },
    {
      num: '03',
      title: 'Производство и испытания',
      desc: 'Изготовление на заводе КНР, прохождение приёмо-сдаточных тестов с формированием заводского Test Report.',
    },
    {
      num: '04',
      title: 'Экспортная очистка в КНР',
      desc: 'Доставка оборудования до Маньчжурии, таможенное оформление экспорта силами продавца.',
    },
    {
      num: '05',
      title: 'Передача груза (FCA)',
      desc: 'Передача оборудования назначенному покупателем российскому авто- или ж/д перевозчику.',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <section className="bg-[#0b3d66] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md inline-block mb-3">
              Международная логистика и ВЭД
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Условия поставки и импорта
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              Базис поставки — <strong>FCA Маньчжурия согласно Инкотермс 2020</strong>. Прозрачный регламент передачи оборудования, полный пакет сопроводительных документов и заводских протоколов.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Client Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Basis */}
          <div className="bg-white rounded-2xl border border-surface-border p-7 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-navy">Базис поставки</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              При условиях <strong>FCA Маньчжурия (Free Carrier Manzhouli)</strong> продавец передаёт готовый товар назначенному покупателем перевозчику в согласованном терминале / ж/д станции и полностью выполняет экспортное таможенное оформление.
            </p>
            <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              Дальнейшую транспортировку по территории РФ, транзитное страхование и ввозные таможенные процедуры осуществляет покупатель.
            </p>
          </div>

          {/* Card 2: Documents */}
          <div className="bg-white rounded-2xl border border-surface-border p-7 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-navy">Пакет документов</h2>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Коммерческий инвойс (Commercial Invoice).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Упаковочный лист (Packing List) с весами.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Экспортные таможенные документы КНР.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Протокол заводских испытаний изделий.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Паспорт и руководство по эксплуатации.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Language */}
          <div className="bg-white rounded-2xl border border-surface-border p-7 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-navy">Язык документации</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Протоколы испытаний и руководство по эксплуатации могут быть предоставлены на <strong>русском языке опционально</strong>.
            </p>
            <p className="text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
              Необходимый язык шильдов, предупреждающих табличек и комплектность документации рекомендуется заранее зафиксировать в спецификации к контракту.
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Visual Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              Порядок взаимодействия
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
              Этапы поставки трансформаторного оборудования
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div
                key={st.num}
                className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[#e6a417] font-mono block mb-2">
                    {st.num}
                  </span>
                  <h4 className="text-xs font-bold text-navy mb-2">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Client Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#e6a417] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <strong className="text-navy text-sm block">Важно перед заключением контракта:</strong>
            <p className="leading-relaxed">
              До заключения контракта согласуйте маршрут перевозки, аккредитованного перевозчика, желаемые сроки, специальные требования к экспортной упаковке (деревянные клети по стандартам ISPM 15), транспортной маркировке и полному комплекту документов для таможенного оформления в РФ.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Inquiry CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0b3d66] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Остались вопросы по условиям FCA Маньчжурия?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Наш специалист по ВЭД предоставит подробную консультацию по процедуре отгрузки.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenQuoteModal()}
            className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0"
          >
            Запросить консультацию
          </button>
        </div>
      </section>
    </div>
  );
};
