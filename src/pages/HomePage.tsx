import React from 'react';
import { ArrowRight, ShieldCheck, Factory, Settings, Truck, FileCheck2, Cpu, CheckCircle2 } from 'lucide-react';
import { TRANSFORMER_CATEGORIES } from '../data/transformerCatalog';
import { TransformerCard } from '../components/TransformerCard';
import { LossCalculatorWidget } from '../components/LossCalculatorWidget';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string, power?: string) => void;
}

export const HomePage: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#072640] via-[#0b3d66] to-[#0a3558] text-white pt-12 pb-20 sm:pb-28 overflow-hidden">
        {/* Subtle engineering background mesh / overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 border border-[#e6a417]/40 text-[#e6a417] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Базис поставки: FCA Маньчжурия (Инкотермс 2020)
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
              Трансформаторное оборудование из Китая для российских предприятий
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Компания <strong>Hubei Onearth Trading Company Limited</strong> специализируется на подборе надёжных производителей силовых трансформаторов в Китае. Помогаем российским строительно-монтажным компаниям, промышленным предприятиям и комплексным поставщикам получать сертифицированное оборудование 10, 20 и 35 кВ по прямым ценам заводов.
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/katalog')}
                className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
              >
                Смотреть каталог
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/po-tz')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Изготовление по ТЗ
              </button>

              <a
                href="mailto:mail@mail.ru"
                className="text-xs text-slate-300 hover:text-white underline ml-2"
              >
                Отправить опросный лист на mail@mail.ru
              </a>
            </div>

            {/* Quick Hero Key Stats */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">Диапазон мощности:</span>
                <strong className="text-white text-base font-bold">630 – 2500 кВА</strong>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">Классы напряжения:</span>
                <strong className="text-white text-base font-bold">10 / 20 / 35 кВ</strong>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">Типы изоляции:</span>
                <strong className="text-white text-base font-bold">Литая, Nomex, Масло</strong>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-slate-400 block">Регулирование:</span>
                <strong className="text-white text-base font-bold">ПБВ ±2х2,5% / РПН</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Tiles ("Что мы предлагаем") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            Компетенции и формат работы
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy mt-2">
            Что мы предлагаем российским заказчикам
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Прямое взаимодействие с заводами КНР без посреднических наценок
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#e6a417] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-4">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Подбор производителя</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Подбираем профильный китайский завод и оптимальное техническое решение строго под параметры проекта, бюджет и технические требования заказчика.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#0b3d66] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Сухие трансформаторы</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              С литой эпоксидной и воздушно-барьерной изоляцией Nomex на 10, 20 и 35 кВ, в стандартном и энергоэффективном исполнении с пониженными потерями.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#e6a417] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center mb-4">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Масляные трансформаторы</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Надёжное оборудование на класс напряжения 35 кВ с ПБВ ±2х2,5% для распределительных сетей, понизительных подстанций и промышленных предприятий.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-sm border-l-4 border-l-[#0b3d66] hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy mb-2">Поставка FCA Маньчжурия</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Отгрузка на условиях FCA Маньчжурия по Инкотермс 2020. Продавец передаёт товар назначенному перевозчику и полностью выполняет экспортное оформление в КНР.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Showcase (UES.SU Style Grid) */}
      <section className="bg-slate-50 py-16 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                Каталог продукции
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy mt-2">
                Каталог трансформаторов по типам
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Выберите категорию для ознакомления со сводными таблицами технических параметров и потерь
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/katalog')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3d66] hover:text-navy-light uppercase tracking-wider"
            >
              Перейти в расширенный каталог →
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRANSFORMER_CATEGORIES.map((cat) => (
              <TransformerCard
                key={cat.slug}
                category={cat}
                onNavigate={onNavigate}
                onOpenQuoteModal={onOpenQuoteModal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Loss Calculator & Chart Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <LossCalculatorWidget onOpenQuoteModal={(p) => onOpenQuoteModal('suhie-litaya-10kv-pp', p)} />
      </section>

      {/* "Почему выбирают нас" (4 Cards from client HTML) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
            Надёжность и прозрачность
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy mt-2">
            Почему выбирают Hubei Onearth Trading
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Снижаем риски внешнеэкономической деятельности и технические несоответствия
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">Техническая экспертиза</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Помогаем сопоставить требования проекта с характеристиками оборудования: мощностью, напряжениями, потерями ХХ и КЗ, схемой соединения обмоток и напряжением короткого замыкания Uк.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center shrink-0">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">Работа с китайскими заводами</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Выстраиваем прямую коммуникацию с производителями и помогаем оперативно получить коммерческие предложения, спецификации, габаритные чертежи и протоколы заводских испытаний.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">Прозрачные условия поставки</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Базис поставки — <strong>FCA Маньчжурия по Инкотермс 2020</strong>. Продавец передаёт товар перевозчику, назначенному покупателем, и полностью выполняет экспортное таможенное оформление.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 border border-surface-border shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy mb-2">Изготовление под проект</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Возможен выпуск сухих и масляных трансформаторов по техническому заданию, опросному листу, однолинейной электрической схеме или чертежам заказчика, а также под собственной торговой маркой (OEM).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0b3d66] to-[#072640] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-900 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider">
              Готовы рассчитать параметры оборудования
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Нужна консультация, подбор завода или расчёт стоимости?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Отправьте опросный лист, техническое задание или однолинейную схему на{' '}
              <a href="mailto:mail@mail.ru" className="text-[#e6a417] underline font-bold">
                mail@mail.ru
              </a>{' '}
              — подготовим технико-коммерческое предложение.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuoteModal()}
              className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 text-center"
            >
              Запросить расчёт КП
            </button>
            <a
              href="tel:+73431234567"
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold text-xs border border-white/20 text-center transition-colors"
            >
              +7 (343) 123-45-67
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
