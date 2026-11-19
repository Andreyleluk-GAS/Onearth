import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const baseIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const PAGES_TO_PRERENDER = [
  {
    route: '/katalog/',
    title: 'Каталог силовых трансформаторов из Китая — Hubei Onearth Trading | 10, 20, 35 кВ',
    description: 'Каталог трехфазных сухих и масляных силовых трансформаторов 10, 20 и 35 кВ мощностью 630-6300 кВА. Поставка FCA Маньчжурия (Инкотермс 2020), соответствие ГОСТ 52719-2007.',
    h1: 'Каталог силового трансформаторного оборудования',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Каталог силового трансформаторного оборудования</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Компания Hubei Onearth Trading Company Limited организует прямые заводские поставки трехфазных сухих и герметичных масляных трансформаторов на классы напряжения 10, 20 и 35 кВ мощностью от 630 до 6300 кВА. Оборудование сертифицировано по регламентам ТР ТС 004/2011, ТР ТС 020/2011 и полностью соответствует требованиям ГОСТ 52719-2007 и МЭК 60076. Базис поставки: FCA Маньчжурия (Инкотермс 2020).
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="border border-slate-200 p-5 rounded-xl bg-white shadow-sm">
            <h2 class="text-lg font-bold text-[#0b3d66] mb-3">1. Сухие трансформаторы с литой и воздушно-барьерной изоляцией</h2>
            <ul class="space-y-2 text-sm text-slate-700">
              <li><a href="/katalog/suhie-litaya-10kv/" class="text-[#0b3d66] hover:underline font-medium">Сухие трансформаторы с литой изоляцией 10 кВ (ПБВ ±2х2,5%, 630–2500 кВА)</a></li>
              <li><a href="/katalog/suhie-litaya-10kv-pp/" class="text-[#0b3d66] hover:underline font-medium">Сухие трансформаторы 10 кВ с пониженными потерями холостого хода (ECO)</a></li>
              <li><a href="/katalog/suhie-litaya-20kv/" class="text-[#0b3d66] hover:underline font-medium">Сухие трансформаторы с литой изоляцией 20 кВ для кабельных сетей мегаполисов</a></li>
              <li><a href="/katalog/suhie-litaya-35kv/" class="text-[#0b3d66] hover:underline font-medium">Высоковольтные сухие трансформаторы с литой изоляцией 35 кВ</a></li>
              <li><a href="/katalog/suhie-litaya-35kv-pp/" class="text-[#0b3d66] hover:underline font-medium">Сухие трансформаторы 35 кВ с пониженными потерями (Step-Lap)</a></li>
              <li><a href="/katalog/suhie-vozdushno-baryernaya-10kv/" class="text-[#0b3d66] hover:underline font-medium">Сухие трансформаторы с изоляцией DuPont Nomex (класс H, 220°C, 10 кВ)</a></li>
            </ul>
          </div>

          <div class="border border-slate-200 p-5 rounded-xl bg-white shadow-sm">
            <h2 class="text-lg font-bold text-[#0b3d66] mb-3">2. Масляные и специальные трансформаторы</h2>
            <ul class="space-y-2 text-sm text-slate-700">
              <li><a href="/katalog/maslyanye-35kv/" class="text-[#0b3d66] hover:underline font-medium">Масляные герметичные трансформаторы 35 кВ с РПН (Huaming / MR, до 6300 кВА)</a></li>
              <li><a href="/katalog/maslyanye-35kv-pbv/" class="text-[#0b3d66] hover:underline font-medium">Масляные трансформаторы 35 кВ с ПБВ ±2х2,5% (серия ТМГ, 630–2500 кВА)</a></li>
              <li><a href="/katalog/special-transformatory/" class="text-[#0b3d66] hover:underline font-medium">Трансформаторы специального назначения: печные, преобразовательные и OEM под бренд заказчика</a></li>
            </ul>
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
          <h3 class="text-base font-bold text-[#0b3d66] mb-2">Технические стандарты и гарантии</h3>
          <p class="text-sm text-slate-600 leading-relaxed">
            Все силовые агрегаты проходят обязательную программу типовых и приемо-сдаточных испытаний (FAT test) с оформлением протоколов на русском и английском языках. Предоставляется гарантия от завода-производителя сроком от 36 до 60 месяцев.
          </p>
        </div>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' }
    ]
  },
  {
    route: '/katalog/suhie-litaya-10kv/',
    title: 'Сухие трансформаторы с литой изоляцией 10 кВ купить от производителя — Hubei Onearth',
    description: 'Каталог трехфазных сухих трансформаторов 10 кВ с литой эпоксидной смолой (630–2500 кВА). ПБВ ±2х2,5%, схема Д/Ун-11, класс изоляции F. Поставка из КНР на условиях FCA.',
    h1: 'Сухие трансформаторы с литой изоляцией на класс напряжения 10 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Сухие трансформаторы с литой изоляцией на класс напряжения 10 кВ</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Компания Hubei Onearth Trading Co., Ltd. организует прямые заводские поставки трехфазных сухих трансформаторов с литой изоляцией мощностью от 630 до 2500 кВА на класс напряжения 10 и 20 кВ. Оборудование проектируется с учетом эксплуатационных требований российских распределительных сетей, ПУЭ и ГОСТ 52719-2007.
        </p>

        <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-[#0b3d66]">Конструктивное исполнение и диэлектрическая надежность</h2>
          <p class="text-sm text-slate-600 leading-relaxed">
            Обмотки высшего напряжения (ВН) заливаются эпоксидным компаундом с наполнителем из мелкодисперсного кварцевого песка в глубоком вакууме на оборудовании Hedrich. Это исключает возникновение воздушных каверн и гарантирует уровень частичных разрядов не более 5–10 пКл при напряжении 1.3 Um, предотвращая старение изоляции при коммутационных перенапряжениях.
          </p>

          <h3 class="text-base font-bold text-[#0b3d66]">Ключевые технические характеристики серии:</h3>
          <ul class="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
            <li><strong>Класс нагревостойкости изоляции:</strong> F (предельный перегрев обмоток до 100°C) с возможностью исполнения класса H (до 125°C).</li>
            <li><strong>Схемы и группы соединения обмоток:</strong> Д/Ун-11 (основная) и У/Ун-0 (под заказ).</li>
            <li><strong>Регулирование напряжения:</strong> переключение без возбуждения (ПБВ) с диапазоном ±2х2,5% ступенями на стороне ВН.</li>
            <li><strong>Потери холостого хода (P0) и короткого замыкания (Pкз):</strong> соответствуют нормам энергоэффективности (снижение потерь до 15% за счет кремнистой стали с высокой магнитной проницаемостью).</li>
            <li><strong>Система температурного контроля:</strong> микропроцессорный блок с термосопротивлениями PT100, встроенными в каждую фазу обмотки НН.</li>
          </ul>
        </div>

        <div class="border-t border-slate-200 pt-4 text-sm text-slate-600">
          <p>Поставка осуществляется на условиях FCA Маньчжурия (Incoterms 2020) с предоставлением протоколов заводских приемо-сдаточных испытаний.</p>
        </div>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Сухие с литой изоляцией 10 кВ', item: 'https://hubeienergy.ru/katalog/suhie-litaya-10kv/' }
    ]
  },
  {
    route: '/katalog/suhie-litaya-10kv-pp/',
    title: 'Сухие трансформаторы 10 кВ с пониженными потерями — Hubei Onearth Trading',
    description: 'Энергоэффективные трехфазные сухие трансформаторы с литой изоляцией 10 кВ с пониженными потерями холостого хода (P0). Экономия электроэнергии до 25%. Поставка FCA.',
    h1: 'Сухие трансформаторы 10 кВ с пониженными потерями холостого хода (ECO)',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Сухие трансформаторы 10 кВ с пониженными потерями холостого хода (ECO)</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Энергоэффективные силовые трансформаторы серии «ПП» спроектированы для предприятий с непрерывным круглосуточным графиком энергопотребления. Применение магнитопровода из анизотропной стали со ступенчатым стыком Step-Lap обеспечивает снижение потерь холостого хода (P0) на 20–25% относительно стандартных требований ГОСТ 52719-2007.
        </p>

        <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-[#0b3d66]">Экономическая окупаемость и инженерный расчет</h2>
          <p class="text-sm text-slate-600 leading-relaxed">
            Срок окупаемости разницы в капитальных затратах за счет снижения технологических потерь составляет от 1.8 до 2.4 года при промышленном тарифе на электроэнергию от 8 руб./кВт·ч. Трансформаторы выпускаются мощностью от 630 до 2500 кВА со стандартным напряжением короткого замыкания Uk = 6.0%.
          </p>
        </div>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Сухие 10 кВ с пониженными потерями', item: 'https://hubeienergy.ru/katalog/suhie-litaya-10kv-pp/' }
    ]
  },
  {
    route: '/katalog/suhie-litaya-20kv/',
    title: 'Сухие трансформаторы с литой изоляцией 20 кВ — Hubei Onearth Trading',
    description: 'Высоковольтные сухие трансформаторы с литой эпоксидной изоляцией на 20 кВ мощностью 630–2500 кВА. ПБВ ±2х2,5%, схема Д/Ун-11, класс изоляции F. Поставка FCA.',
    h1: 'Сухие трансформаторы с литой изоляцией на класс напряжения 20 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Сухие трансформаторы с литой изоляцией на класс напряжения 20 кВ</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Силовые трансформаторы класса напряжения 20 кВ разработаны для современных кабельных распределительных сетей мегаполисов и крупных промышленных центров. Повышенная стойкость к грозовым импульсам (BIL до 125 кВ) и глубокая вакуумная заливка эпоксидной смолой гарантируют безаварийную службу без частичных разрядов.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Сухие 20 кВ', item: 'https://hubeienergy.ru/katalog/suhie-litaya-20kv/' }
    ]
  },
  {
    route: '/katalog/suhie-litaya-35kv/',
    title: 'Сухие трансформаторы с литой изоляцией 35 кВ — Hubei Onearth Trading',
    description: 'Высоковольтные сухие трансформаторы 35 кВ с литой изоляцией мощностью 630–2500 кВА. ПБВ ±2х2,5%, экологическая и пожарная безопасность F1/E2/C2. Поставка из КНР.',
    h1: 'Сухие трансформаторы с литой изоляцией на класс напряжения 35 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Сухие трансформаторы с литой изоляцией на класс напряжения 35 кВ</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Сухие трансформаторы 35 кВ с литой изоляцией являются передовым решением для объектов с повышенными требованиями к пожарной и экологической безопасности (высотные здания, метрополитены, гидроузлы). Отсутствие трансформаторного масла исключает риски взрыва и загрязнения окружающей среды.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Сухие 35 кВ', item: 'https://hubeienergy.ru/katalog/suhie-litaya-35kv/' }
    ]
  },
  {
    route: '/katalog/suhie-litaya-35kv-pp/',
    title: 'Сухие трансформаторы 35 кВ с пониженными потерями — Hubei Onearth Trading',
    description: 'Энергоэффективные сухие трансформаторы с литой изоляцией 35 кВ с пониженными потерями холостого хода. Мощности 630–2500 кВА, поставка FCA Маньчжурия.',
    h1: 'Сухие трансформаторы 35 кВ со сниженными потерями холостого хода',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Сухие трансформаторы 35 кВ со сниженными потерями холостого хода</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Высоковольтные трансформаторы 35 кВ в энергосберегающем исполнении со сниженным уровнем шума и оптимизированными потерями P0 и Pкз по ГОСТ 52719.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Сухие 35 кВ ПП', item: 'https://hubeienergy.ru/katalog/suhie-litaya-35kv-pp/' }
    ]
  },
  {
    route: '/katalog/suhie-vozdushno-baryernaya-10kv/',
    title: 'Сухие трансформаторы с изоляцией DuPont Nomex (класс H, 10 кВ) — Hubei Onearth',
    description: 'Сухие трансформаторы с воздушно-барьерной изоляцией DuPont Nomex (класс нагревостойкости H, 220°C) на 10 кВ. Высокая перегрузочная способность до 150%.',
    h1: 'Сухие трансформаторы с воздушно-барьерной изоляцией Nomex, 10 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Сухие трансформаторы с воздушно-барьерной изоляцией Nomex, 10 кВ</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          В трансформаторах с воздушно-барьерной изоляцией используется негорючая полиамидная бумага DuPont Nomex с глубокой вакуумно-нагнетательной пропиткой (VPI) кремнийорганическим лаком. Изоляционная система относится к классу нагревостойкости H (предельная рабочая температура до 220°C).
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Сухие Nomex H-класс 10 кВ', item: 'https://hubeienergy.ru/katalog/suhie-vozdushno-baryernaya-10kv/' }
    ]
  },
  {
    route: '/katalog/maslyanye-35kv/',
    title: 'Масляные трансформаторы 35 кВ (ТМГ, ТДНС) купить оптом из Китая — цены завода',
    description: 'Трехфазные герметичные масляные трансформаторы 35 кВ мощностью до 6300 кВА. Регулирование ПБВ и РПН, схемы соединения Д/Ун-11, У/Ун-0. Заводские FAT-тесты, поставка FCA.',
    h1: 'Силовые масляные трансформаторы на класс напряжения 35 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Силовые масляные трансформаторы на класс напряжения 35 кВ</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Hubei Onearth Trading Company Limited поставляет силовые масляные трансформаторы класса напряжения 35 кВ (серии ТМГ, ТДН, ТДНС, ТРДН) мощностью от 1000 до 6300 кВА для понизительных подстанций промышленных предприятий, горнодобывающих комбинатов и сетевых операторов. Оборудование адаптировано для климатического исполнения У1 и ХЛ1 с нижней границей рабочей температуры до -60°C.
        </p>

        <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-[#0b3d66]">Технические преимущества масляных трансформаторов:</h2>
          <ul class="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li><strong>Герметичная конструкция гофрированного бака (серия ТМГ):</strong> компенсирует температурные колебания объема масла без контакта с окружающей средой, исключая окисление диэлектрика на протяжении 30 лет.</li>
            <li><strong>Глубокая вакуумная дегазация:</strong> заливка сухого масла под глубоким вакуумом обеспечивает пробивное напряжение не менее 60 кВ.</li>
            <li><strong>Регулирование напряжения под нагрузкой (РПН):</strong> переключатели ведущих мировых марок (Huaming, Maschinenfabrik Reinhausen) с диапазоном до ±4х2,5% или ±6х1,5% для автоматической стабилизации напряжения в сети.</li>
            <li><strong>Комплекс КИПиА и защит:</strong> газовое реле Бухгольца, стрелочный маслоуказатель с герконами, манометрический термометр и предохранительный клапан сброса давления.</li>
          </ul>
        </div>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Масляные 35 кВ', item: 'https://hubeienergy.ru/katalog/maslyanye-35kv/' }
    ]
  },
  {
    route: '/katalog/maslyanye-35kv-pbv/',
    title: 'Масляные трансформаторы 35 кВ с ПБВ — Hubei Onearth Trading',
    description: 'Масляные герметичные трансформаторы 35 кВ с переключением без возбуждения ПБВ ±2х2,5%, 630–2500 кВА. Поставка на условиях FCA Маньчжурия.',
    h1: 'Масляные трансформаторы 35 кВ с ПБВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Масляные трансформаторы 35 кВ с ПБВ</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Трехфазные масляные трансформаторы типа ТМГ на класс напряжения 35 кВ с ПБВ ±2х2,5%. Напряжение НН — 0,4 кВ; схемы соединения Д/Ун-11 и У/Ун-0.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Масляные 35 кВ с ПБВ', item: 'https://hubeienergy.ru/katalog/maslyanye-35kv-pbv/' }
    ]
  },
  {
    route: '/katalog/special-transformatory/',
    title: 'Трансформаторы специального назначения (OEM / Выпрямители) — Hubei Onearth',
    description: 'Силовые трансформаторы для питания тиристорных выпрямителей, электропечей, тяговых подстанций и производство под брендом заказчика (OEM).',
    h1: 'Трансформаторы специального назначения (OEM / Выпрямители)',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Трансформаторы специального назначения (OEM / Выпрямители)</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Узкоспециализированное силовое оборудование для выпрямителей, электропечных установок, тяговых подстанций и производство оборудования под торговой маркой заказчика (Private Label / OEM).
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Каталог', item: 'https://hubeienergy.ru/katalog/' },
      { name: 'Специальные трансформаторы', item: 'https://hubeienergy.ru/katalog/special-transformatory/' }
    ]
  },
  {
    route: '/calculator-tr/',
    title: 'Онлайн-расчет силовых трансформаторов и чертежи ЕСКД (DXF) — Hubei Onearth Trading',
    description: 'Инженерный онлайн-калькулятор параметров силовых трансформаторов 100–63000 кВА, 6–110 кВ. Расчет массы, потерь, габаритов и скачивание чертежа AutoCAD DXF для типовых и нестандартных мощностей (7200, 1850 кВА).',
    h1: 'Онлайн-расчет силовых трансформаторов и чертежи ЕСКД',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Онлайн-расчет силовых трансформаторов и чертежи ЕСКД</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Инженерная система Hubei Onearth Trading Company Limited позволяет выполнить предварительный электромагнитный, тепловой и массо-габаритный расчет трехфазных масляных (ТМ, ТМГ, ТМН, ТДНС) и сухих (ТСЛ, ТСЗЛ, ТСВБ) трансформаторов мощностью от 100 до 63 000 кВА на классы напряжения 6, 10, 20, 35 и 110 кВ.
        </p>
        <p class="text-base text-slate-700 leading-relaxed">
          Система обеспечивает автоматический расчет токов ВН/НН, напряжения короткого замыкания uk%, потерь холостого хода P0 и КЗ Pk, подбор количества панельных радиаторов охлаждения и мгновенную генерацию векторного габаритного чертежа в формате AutoCAD (DXF) с оформлением по ГОСТ 2.104.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="border border-slate-200 p-5 rounded-xl bg-white shadow-sm">
            <h2 class="text-lg font-bold text-[#0b3d66] mb-3">1. Расчет нетиповых номиналов мощности</h2>
            <p class="text-sm text-slate-700 leading-relaxed">
              Возможность точного расчета нестандартных мощностей (например: 1850 кВА, 3150 кВА, 7200 кВА, 12500 кВА) под специфические технологические нагрузки промышленных предприятий, СЭС/ВЭС и выпрямителей.
            </p>
          </div>
          <div class="border border-slate-200 p-5 rounded-xl bg-white shadow-sm">
            <h2 class="text-lg font-bold text-[#0b3d66] mb-3">2. Скачивание чертежей AutoCAD (DXF)</h2>
            <p class="text-sm text-slate-700 leading-relaxed">
              Векторные чертежи со слоями TANK, RADIATORS, BUSHINGS, DIMENSIONS, TITLE_BLOCK и размерными цепочками для мгновенной вставки в проектные схемы и генпланы подстанций.
            </p>
          </div>
        </div>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Онлайн-расчет и чертежи DXF', item: 'https://hubeienergy.ru/calculator-tr/' }
    ]
  },
  {
    route: '/po-tz/',
    title: 'Изготовление силовых трансформаторов по ТЗ и опросным листам — Hubei Onearth',
    description: 'Проектирование и изготовление сухих и масляных трансформаторов 10–35 кВ в Китае по техническому заданию, опросному листу или однолинейной схеме заказчика.',
    h1: 'Изготовление силовых трансформаторов по техническому заданию (ТЗ)',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Изготовление силовых трансформаторов по техническому заданию (ТЗ)</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Hubei Onearth Trading Co., Ltd. организует расчет и производство нестандартных силовых трансформаторов на заводах КНР под технические условия заказчика. Принимаем в работу однолинейные схемы, проектные спецификации и опросные листы институтов ЭС/ЭП.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Изготовление по ТЗ', item: 'https://hubeienergy.ru/po-tz/' }
    ]
  },
  {
    route: '/postavka/',
    title: 'Условия поставки FCA Маньчжурия и импорт электрооборудования — Hubei Onearth',
    description: 'Поставка силовых трансформаторов из Китая на условиях FCA Маньчжурия (Инкотермс 2020). Датчики удара, таможенная очистка, ТР ТС 004/020, доставка по РФ.',
    h1: 'Условия поставки оборудования, логистика FCA и таможенный регламент',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Условия поставки оборудования, логистика FCA и таможенный регламент</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Поставка высоковольтных силовых трансформаторов напряжением 35 кВ мощностью 1600–6300 кВА сопряжена с жесткими требованиями к транспортировке тяжеловесного и негабаритного электрооборудования. Вес активной части с баком и маслом может превышать 15–28 тонн, что требует прецизионного соблюдения регламентов крепления и контроля осевых нагрузок.
        </p>

        <div class="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <h2 class="text-lg font-bold text-[#0b3d66]">Организация логистики на базисе FCA Маньчжурия (Incoterms 2020):</h2>
          <ul class="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li><strong>Подготовка и консервация:</strong> Снятие высоковольтных вводов, радиаторов и навесного оборудования для ж/д габарита с упаковкой в герметичные деревянные ящики с силикагелем.</li>
            <li><strong>Контроль динамических нагрузок:</strong> Установка трехкоординатных регистраторов ударов (ShockLog / SpotSee), фиксирующих ускорения по осям X, Y, Z.</li>
            <li><strong>Таможенная очистка:</strong> Экспортное оформление в КНР силами продавца, перегрузка на колею 1520 мм на станции Забайкальск.</li>
            <li><strong>Пакет документов:</strong> Паспорт изделия, протоколы FAT-испытаний, сертификаты соответствия ТР ТС 004/2011 и ТР ТС 020/2011, инвойс и упаковочный лист.</li>
          </ul>
        </div>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Поставка и импорт', item: 'https://hubeienergy.ru/postavka/' }
    ]
  },
  {
    route: '/kontakty/',
    title: 'Контакты и реквизиты — Hubei Onearth Trading Company Limited',
    description: 'Контакты официального представителя Hubei Onearth Trading Company Limited: телефон +7 (343) 123-45-67, e-mail info@hubeienergy.ru. Прямые поставки трансформаторов из КНР.',
    h1: 'Контакты и реквизиты компании',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Контакты и реквизиты компании</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Hubei Onearth Trading Company Limited. Телефон: +7 (343) 123-45-67. E-mail: info@hubeienergy.ru. Официальный партнер китайских заводов электрооборудования.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Контакты', item: 'https://hubeienergy.ru/kontakty/' }
    ]
  },
  {
    route: '/politika-konfidencialnosti/',
    title: 'Политика конфиденциальности — Hubei Onearth Trading Company Limited',
    description: 'Политика обработки персональных данных в соответствии с 152-ФЗ. Hubei Onearth Trading Company Limited.',
    h1: 'Политика конфиденциальности',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <h1>Политика конфиденциальности</h1>
        <p class="text-base text-slate-700 leading-relaxed">
          Политика обработки персональных данных пользователей в соответствии с Федеральным законом РФ № 152-ФЗ. E-mail оператора: info@hubeienergy.ru.
        </p>
      </div>
    `,
    breadcrumbs: [
      { name: 'Главная', item: 'https://hubeienergy.ru/' },
      { name: 'Политика конфиденциальности', item: 'https://hubeienergy.ru/politika-konfidencialnosti/' }
    ]
  }
];

function buildBreadcrumbsJsonLd(breadcrumbs) {
  if (!breadcrumbs || breadcrumbs.length === 0) return '';
  return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        ${breadcrumbs.map((b, idx) => `{
          "@type": "ListItem",
          "position": ${idx + 1},
          "name": "${b.name.replace(/"/g, '\\"')}",
          "item": "${b.item}"
        }`).join(',\n        ')}
      ]
    }
    </script>
  `;
}

function writeStaticHtml(targetRelativePath, title, description, canonicalUrl, bodyHtml, breadcrumbs) {
  const fullDirPath = path.join(distDir, targetRelativePath);
  if (!fs.existsSync(fullDirPath)) {
    fs.mkdirSync(fullDirPath, { recursive: true });
  }

  let html = baseIndexHtml;

  const segments = targetRelativePath.split(/[\/\\]/).filter(Boolean);
  const rootPrefix = segments.length > 0 ? '../'.repeat(segments.length) : './';
  html = html.replaceAll('./assets/', `${rootPrefix}assets/`);
  html = html.replaceAll('./images/', `${rootPrefix}images/`);
  html = html.replaceAll('./favicon', `${rootPrefix}favicon`);
  html = html.replaceAll('./apple-touch-icon', `${rootPrefix}apple-touch-icon`);

  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/>/, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`);

  const breadcrumbLd = buildBreadcrumbsJsonLd(breadcrumbs);
  if (breadcrumbLd) {
    html = html.replace('</head>', `${breadcrumbLd}\n</head>`);
  }

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${bodyHtml}</div>`
  );

  fs.writeFileSync(path.join(fullDirPath, 'index.html'), html);
  console.log(`Generated SSG snapshot: ${targetRelativePath}index.html`);
}

PAGES_TO_PRERENDER.forEach((page) => {
  const relPath = page.route.replace(/^\//, '');
  const canonicalUrl = `https://hubeienergy.ru${page.route}`;
  writeStaticHtml(relPath, page.title, page.description, canonicalUrl, page.content, page.breadcrumbs);
});

// Create 404.html fallback for GitHub Pages SPA routing
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
console.log('✅ Generated dist/404.html for GitHub Pages SPA routing');

// Create .nojekyll in dist to bypass Jekyll processing on GitHub Pages
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✅ Generated dist/.nojekyll');

// Ensure CNAME exists in dist for GitHub Pages custom domain
fs.writeFileSync(path.join(distDir, 'CNAME'), 'hubeienergy.ru\n');
console.log('✅ Generated dist/CNAME (hubeienergy.ru)');

console.log('🎉 SSG snapshots successfully generated.');
