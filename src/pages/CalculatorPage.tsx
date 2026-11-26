import React, { useState, useMemo } from 'react';
import {
  Zap,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Download,
  Activity,
  Layers,
  Sparkles,
  BookOpen,
  HelpCircle,
  Factory,
  CheckCircle2,
  Phone,
  FileText,
} from 'lucide-react';
import {
  TransformerCalculationInput,
  calculateTransformer,
} from '../services/transformerCalculator';
import { TransformerControls } from '../components/calculator/TransformerControls';
import { TransformerBlueprintSvg } from '../components/calculator/TransformerBlueprintSvg';
import { TransformerSpecificationTable } from '../components/calculator/TransformerSpecificationTable';
import { TransformerCostCard } from '../components/calculator/TransformerCostCard';
import { TransformerNormativeInspector } from '../components/calculator/TransformerNormativeInspector';
import { TransformerEngineeringReportModal } from '../components/calculator/TransformerEngineeringReportModal';
import { trackMetrikaGoal } from '../services/yandexMetrika';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string, power?: string) => void;
}

export const CalculatorPage: React.FC<Props> = ({
  onNavigate,
  onOpenQuoteModal,
}) => {
  // Начальное состояние расчета (по умолчанию ТМН-6300/35/10.5 кВ, медь)
  const [input, setInput] = useState<TransformerCalculationInput>({
    type: 'oil',
    powerKva: 6300,
    voltageHvKv: 35,
    voltageLvKv: 10.5,
    frequencyHz: 50,
    windingMaterial: 'Cu',
    oilCoolingType: 'ONAN',
    vectorGroup: 'YNd11',
    projectName: 'ТМН-6300/35/10.5',
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Расчет результата (мемоизирован для быстродействия)
  const result = useMemo(() => {
    return calculateTransformer(input);
  }, [input]);

  const handleOpenModal = () => {
    trackMetrikaGoal('calculator_quote_click', {
      power: input.powerKva,
      type: input.type,
      hv: input.voltageHvKv,
    });
    const catSlug = input.type === 'oil' ? 'maslyanye-35kv' : 'suhie-litaya-10kv';
    onOpenQuoteModal(catSlug, `${input.powerKva} кВА`);
  };

  const handleNavigateToTz = () => {
    trackMetrikaGoal('calculator_to_tz_click', {
      power: input.powerKva,
    });
    onNavigate('/po-tz');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Хлебные крошки */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hover:text-[#0b3d66] transition-colors cursor-pointer"
          >
            Главная
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">
            Инженерный онлайн-расчет и чертежи
          </span>
        </nav>

        {/* Заголовок страницы (Hero) */}
        <div className="bg-gradient-to-br from-[#072640] via-[#0b3d66] to-[#0a3558] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#0b3d66]/40">
          {/* Инженерная схема силового трансформатора в виде аккуратной подложки */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[65%] lg:w-[50%] xl:w-[46%] pointer-events-none overflow-hidden select-none flex items-center justify-end">
            <picture className="w-full h-full flex items-center justify-end">
              <source srcSet="/images/industrial-transformer-blueprint-hero.webp" type="image/webp" />
              <img
                src="/images/industrial-transformer-blueprint-hero.png"
                alt="Промышленный трансформатор в инженерной схеме"
                className="w-full h-full object-cover sm:object-contain object-right opacity-25 sm:opacity-75 lg:opacity-95 [mask-image:linear-gradient(to_left,rgba(0,0,0,1)_60%,rgba(0,0,0,0)_100%)] [-webkit-mask-image:linear-gradient(to_left,rgba(0,0,0,1)_60%,rgba(0,0,0,0)_100%)]"
                loading="eager"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-[#072640]/80 via-transparent to-transparent sm:hidden pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-2xl xl:max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 border border-[#e6a417]/40 text-[#e6a417] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Инженерная САПР-система завода
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight [text-wrap:balance]">
              Онлайн-расчет силовых трансформаторов и чертежи ЕСКД
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed [text-wrap:pretty]">
              Мгновенный предварительный расчет электромагнитных параметров, подбор охлаждения, расчет массы и генерация векторного чертежа <strong>AutoCAD (DXF)</strong>. Рассчитываем как типовые серии (ТМ, ТМГ, ТМН, ТДНС, ТСЛ), так и <strong>любые нестандартные мощности</strong> (например: 7200 кВА, 1850 кВА, 3150 кВА).
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-[#e6a417]" />
                ГОСТ Р 52719-2007 и МЭК 60076
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-[#e6a417]" />
                Чертеж DXF, PDF и 3D STEP
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-[#e6a417]" />
                Прямая поставка FCA Маньчжурия
              </span>
            </div>
          </div>
        </div>

        {/* 1. Конфигуратор параметров и Карточка ориентировочной стоимости */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Левая колонка: Просторное параметрическое управление (8 колонок из 12) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#0b3d66]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Параметры и конфигурация трансформатора
              </h2>
            </div>

            <TransformerControls
              input={input}
              onChange={setInput}
              warnings={result.warnings}
              recommendations={result.recommendations}
              feasibility={result.feasibility}
            />
          </div>

          {/* Правая колонка: Карточка ориентировочной стоимости (4 колонки из 12) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#e6a417]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Расчетная стоимость и КП
              </h2>
            </div>

            <TransformerCostCard
              result={result}
              onOpenQuoteModal={handleOpenModal}
            />
          </div>
        </section>

        {/* 2. Центральный инженерный чертеж изделия (ГОСТ 2.301 / САПР ЕСКД) на полную ширину */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#e6a417]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Инженерный габаритный чертеж изделия (ГОСТ 2.301-68 / САПР ЕСКД)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              3 ортогональные проекции • Штамп завода • Выгрузка в AutoCAD (DXF), PDF и 3D STEP
            </span>
          </div>

          <TransformerBlueprintSvg
            result={result}
            onOpenQuoteModal={handleOpenModal}
          />
        </section>

        {/* 3. Сводная инженерная спецификация и результаты CAD/CAE солверов */}
        <section className="space-y-4">
          <TransformerSpecificationTable
            result={result}
            onNavigateToTz={handleNavigateToTz}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        </section>

        {/* 4. Нормативно-управляемый CAD/CAE контроль (Аудит по НД РФ 2026) */}
        <section className="space-y-4">
          <TransformerNormativeInspector
            result={result}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        </section>

        {/* Модальное окно расчетной записки */}
        <TransformerEngineeringReportModal
          result={result}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

        {/* SEO и Инженерно-технический блок */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-200 pb-5">
            <div className="inline-flex items-center gap-2 text-[#0b3d66] text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              Инженерная справка и стандарты проектирования
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Методология инженерного расчета силовых трансформаторов
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 leading-relaxed">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0b3d66]" />
                1. Расчет нетиповых мощностей (7200, 1850, 3150 кВА)
              </h3>
              <p>
                В распределительных сетях РФ традиционно применяется дискретная линейка номинальных мощностей ГОСТ: 1000, 1600, 2500, 4000, 6300, 10000, 16000 кВА. При необходимости запитать технологическую установку мощностью, например, 6800–7200 кВА, проектировщикам часто приходится закладывать агрегат на 10 000 кВА, что ведет к переплате 30–40% за избыточную массу и увеличенные потери холостого хода.
              </p>
              <p>
                Завод <strong>Hubei Onearth Trading Co., Ltd.</strong> проектирует и производит силовые трансформаторы под точную мощность заказчика без наценки за нестандартность. Диаметр стержня магнитопровода рассчитывается по формуле Тихомирова:
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-[#0b3d66]">
                Dc = kd × (S_фазы)^0.25 × (50 / f)^0.25 (мм)
              </div>
              <p>
                Это гарантирует минимальные потери в стали, оптимальную геометрию окна магнитопровода и точное соответствие тепловому балансу.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0b3d66]" />
                2. Сравнение материалов обмоток: Медь (Cu) vs Алюминий (Al)
              </h3>
              <p>
                Выбор материала обмоток оказывает прямое влияние на габариты бака, массу оборудования и суммарные затраты за жизненный цикл (TCO):
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Медные обмотки (Cu)</strong>: удельная электропроводность выше, плотность тока в обмотках выше (до 2.5–3.2 А/мм²), что позволяет уменьшить диаметр катушек, объем бака и массу трансформаторного масла на 18–25%.
                </li>
                <li>
                  <strong>Алюминиевые обмотки (Al)</strong>: первоначальная стоимость агрегата ниже на 15–22%, однако за счет большего сечения проводника габариты бака и потери короткого замыкания ($P_k$) возрастают на 12–15%.
                </li>
              </ul>
              <p>
                В калькуляторе вы можете в один клик переключить материал обмотки и мгновенно увидеть точную разницу в массе меди/алюминия и объеме масла.
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Блок часто задаваемых вопросов (FAQ) */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#e6a417]" />
              Часто задаваемые вопросы по проектированию и чертежам
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Как открыть скачанный файл чертежа .DXF?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Файл генерируется в формате AutoCAD Release 12 (ASCII DXF). Он открывается напрямую без конвертации в любых версиях AutoCAD, nanoCAD, Компас-3D, BricsCAD и FreeCAD. Слои разделены на TANK, RADIATORS, BUSHINGS, DIMENSIONS, что позволяет легко скопировать контур в ваш проект подстанции.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Насколько точен предварительный расчет массы и габаритов?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Математическая модель откалибрована по заводским базам данных Hubei Onearth и типовым проектам ГОСТ. Погрешность по габаритным размерам и массе активной части не превышает 3–5%, что полностью достаточно для этапа «Проект» (стадия П) и компоновки ячеек РП/КТП.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Можно ли заказать трансформатор с переключателем РПН (Huaming / MR)?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Да, для классов 35 и 110 кВ мы устанавливаем моторные приводы и вакуумные переключатели РПН производства Huaming (Китай) или Maschinenfabrik Reinhausen (MR, Германия) с диапазоном регулирования ±4х2,5% или ±6х1,5%.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block">
                  Каков срок поставки и условия оплаты?
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Срок производства составляет от 45 до 75 календарных дней в зависимости от мощности. Поставка на базисе FCA Маньчжурия с полным пакетом документов (протоколы FAT-испытаний, паспорт изделия на русском языке, сертификаты ТР ТС 004/2011 и 020/2011).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Нижний призыв к действию (CTA) */}
        <div className="bg-gradient-to-r from-[#072640] via-[#0b3d66] to-[#0a3558] rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#0b3d66]/40">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Нужна официальная проектная документация завода?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Отправьте параметры вашего расчета инженерам Hubei Onearth Trading — мы предоставим официальное ТКП, протоколы типовых испытаний и габаритный чертеж со штампом в течение 2 часов.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-6 py-3.5 bg-[#e6a417] hover:bg-[#d49512] text-[#072640] font-black rounded-xl text-sm shadow-lg transition-transform transform hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
            >
              Запросить ТКП завода
            </button>
            <a
              href="tel:+73432269889"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#e6a417]" />
              Консультация инженера
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
