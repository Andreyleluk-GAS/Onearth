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
    title: 'Каталог трансформаторов — Hubei Onearth Trading',
    description: 'Каталог сухих и масляных трансформаторов: 10, 20 и 35 кВ, мощности 630–2500 кВА. Поставка FCA Маньчжурия, Инкотермс 2020.',
    h1: 'Каталог по типам оборудования',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Каталог по типам оборудования</h1>
        <p>Сухие и масляные трансформаторы для распределительных сетей, промышленности и объектов заказчика. Поставка на условиях FCA Маньчжурия (Инкотермс 2020).</p>
        <ul>
          <li><a href="/katalog/suhie-litaya-10kv/">Сухие трансформаторы с литой изоляцией, 10 кВ</a></li>
          <li><a href="/katalog/suhie-litaya-10kv-pp/">Сухие трансформаторы 10 кВ с пониженными потерями</a></li>
          <li><a href="/katalog/suhie-litaya-20kv/">Сухие трансформаторы с литой изоляцией, 20 кВ</a></li>
          <li><a href="/katalog/suhie-litaya-35kv/">Сухие трансформаторы с литой изоляцией, 35 кВ</a></li>
          <li><a href="/katalog/suhie-litaya-35kv-pp/">Сухие трансформаторы 35 кВ с пониженными потерями</a></li>
          <li><a href="/katalog/suhie-vozdushno-baryernaya-10kv/">Сухие трансформаторы с воздушно-барьерной изоляцией, 10 кВ</a></li>
          <li><a href="/katalog/maslyanye-35kv/">Масляные трансформаторы, 35 кВ</a></li>
        </ul>
      </div>
    `
  },
  {
    route: '/katalog/suhie-litaya-10kv/',
    title: 'Сухие трансформаторы с литой изоляцией 10 кВ — Hubei Onearth Trading',
    description: 'Сухие трансформаторы с литой изоляцией на 10 кВ, ПБВ ±2х2,5%, мощности 630–2500 кВА. Поставка FCA Маньчжурия.',
    h1: 'Сухие трансформаторы с литой изоляцией на 10 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Сухие трансформаторы с литой изоляцией на 10 кВ</h1>
        <p>Трёхфазные сухие трансформаторы с литой изоляцией на класс напряжения 10 кВ с ПБВ ±2х2,5%. Напряжение НН — 0,4 кВ; доступны схемы Д/Ун-11 и У/Ун-0.</p>
      </div>
    `
  },
  {
    route: '/katalog/suhie-litaya-10kv-pp/',
    title: 'Сухие трансформаторы 10 кВ с пониженными потерями — Hubei Onearth Trading',
    description: 'Сухие трансформаторы с литой изоляцией 10 кВ с пониженными потерями, ПБВ ±2х2,5%, 630–2500 кВА.',
    h1: 'Сухие трансформаторы 10 кВ с пониженными потерями',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Сухие трансформаторы 10 кВ с пониженными потерями</h1>
        <p>Трёхфазные сухие трансформаторы с литой изоляцией на 10 кВ, ПБВ ±2х2,5% и пониженными потерями холостого хода. НН — 0,4 кВ.</p>
      </div>
    `
  },
  {
    route: '/katalog/suhie-litaya-20kv/',
    title: 'Сухие трансформаторы с литой изоляцией 20 кВ — Hubei Onearth Trading',
    description: 'Сухие трансформаторы с литой изоляцией на 20 кВ, ПБВ ±2х2,5%, 630–2500 кВА.',
    h1: 'Сухие трансформаторы с литой изоляцией на 20 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Сухие трансформаторы с литой изоляцией на 20 кВ</h1>
        <p>Трёхфазные сухие трансформаторы с литой изоляцией на класс напряжения 20 кВ с ПБВ ±2х2,5%. Напряжение НН — 0,4 кВ.</p>
      </div>
    `
  },
  {
    route: '/katalog/suhie-litaya-35kv/',
    title: 'Сухие трансформаторы с литой изоляцией 35 кВ — Hubei Onearth Trading',
    description: 'Сухие трансформаторы с литой изоляцией на 35 кВ, ПБВ ±2х2,5%, 630–2500 кВА.',
    h1: 'Сухие трансформаторы с литой изоляцией на 35 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Сухие трансформаторы с литой изоляцией на 35 кВ</h1>
        <p>Трёхфазные сухие трансформаторы с литой изоляцией на класс напряжения 35 кВ с ПБВ ±2х2,5%. Напряжение НН — 0,4 кВ.</p>
      </div>
    `
  },
  {
    route: '/katalog/suhie-litaya-35kv-pp/',
    title: 'Сухие трансформаторы 35 кВ с пониженными потерями — Hubei Onearth Trading',
    description: 'Сухие трансформаторы с литой изоляцией 35 кВ с пониженными потерями, ПБВ ±2х2,5%.',
    h1: 'Сухие трансформаторы 35 кВ с пониженными потерями',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Сухие трансформаторы 35 кВ с пониженными потерями</h1>
        <p>Трёхфазные сухие трансформаторы с литой изоляцией на 35 кВ, ПБВ ±2х2,5% и пониженными потерями холостого хода.</p>
      </div>
    `
  },
  {
    route: '/katalog/suhie-vozdushno-baryernaya-10kv/',
    title: 'Сухие трансформаторы с воздушно-барьерной изоляцией 10 кВ — Hubei Onearth Trading',
    description: 'Сухие трансформаторы с воздушно-барьерной изоляцией (H-класс) на 10 кВ, ПБВ ±2х2,5%.',
    h1: 'Сухие трансформаторы с воздушно-барьерной изоляцией, 10 кВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Сухие трансформаторы с воздушно-барьерной изоляцией, 10 кВ</h1>
        <p>Трёхфазные сухие трансформаторы с воздушно-барьерной изоляцией класса H на напряжение 10 кВ с ПБВ ±2х2,5%. НН — 0,4 кВ.</p>
      </div>
    `
  },
  {
    route: '/katalog/maslyanye-35kv/',
    title: 'Масляные трансформаторы 35 кВ с РПН — Hubei Onearth Trading',
    description: 'Масляные трансформаторы на класс напряжения 35 кВ с регулированием под нагрузкой РПН ±4х2,5%, 630–6300 кВА.',
    h1: 'Масляные трансформаторы 35 кВ с РПН',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Масляные трансформаторы 35 кВ с РПН</h1>
        <p>Трёхфазные масляные трансформаторы типа ТМН на класс напряжения 35 кВ с РПН ±4х2,5%. Напряжения НН — 3,15; 6,3; 10,5 кВ; схема У/Д-11.</p>
      </div>
    `
  },
  {
    route: '/katalog/maslyanye-35kv-pbv/',
    title: 'Масляные трансформаторы 35 кВ с ПБВ — Hubei Onearth Trading',
    description: 'Масляные герметичные трансформаторы типа ТМ на 35 кВ с ПБВ ±2х2,5%, 630–2500 кВА.',
    h1: 'Масляные трансформаторы 35 кВ с ПБВ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Масляные трансформаторы 35 кВ с ПБВ</h1>
        <p>Трёхфазные масляные трансформаторы типа ТМ на класс напряжения 35 кВ с ПБВ ±2х2,5%. Напряжение НН — 0,4 кВ; схемы Д/Ун-11 и У/Ун-0.</p>
      </div>
    `
  },
  {
    route: '/katalog/special-transformatory/',
    title: 'Трансформаторы специального назначения — Hubei Onearth Trading',
    description: 'Силовые трансформаторы для питания тиристорных выпрямителей, электропечей, тяговых подстанций и производство под брендом заказчика (OEM).',
    h1: 'Трансформаторы специального назначения (OEM / Выпрямители)',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Трансформаторы специального назначения (OEM / Выпрямители)</h1>
        <p>Узкоспециализированное силовое оборудование для выпрямителей, электропечных установок, солнечных инверторов и производство под брендом заказчика (Private Label).</p>
      </div>
    `
  },
  {
    route: '/po-tz/',
    title: 'Изготовление трансформаторов по ТЗ — Hubei Onearth Trading',
    description: 'Изготовление сухих и масляных трансформаторов по техническому заданию, опросному листу, однолинейной схеме или чертежам заказчика.',
    h1: 'Изготовление по ТЗ',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Изготовление по ТЗ</h1>
        <p>Наша команда подберёт и изготовит сухой или масляный трансформатор под требования вашего проекта: по техническому заданию, опросному листу, однолинейной схеме или чертежам заказчика.</p>
      </div>
    `
  },
  {
    route: '/postavka/',
    title: 'Условия поставки и импорта — Hubei Onearth Trading',
    description: 'Поставка трансформаторов на условиях FCA Маньчжурия согласно Инкотермс 2020. Перечень документов и порядок работы.',
    h1: 'Условия поставки и импорта',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Условия поставки и импорта</h1>
        <p>Базис поставки — FCA Маньчжурия согласно Инкотермс 2020. Экспортное оформление, инвойс, упаковочный лист, протокол испытаний.</p>
      </div>
    `
  },
  {
    route: '/kontakty/',
    title: 'Контакты — Hubei Onearth Trading Company Limited',
    description: 'Контакты Hubei Onearth Trading Company Limited: телефон +7 (343) 123-45-67 и e-mail mail@mail.ru для запроса трансформаторов из Китая.',
    h1: 'Контакты',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Контакты</h1>
        <p>Телефон: +7 (343) 123-45-67, E-mail: mail@mail.ru</p>
      </div>
    `
  },
  {
    route: '/politika-konfidencialnosti/',
    title: 'Политика конфиденциальности — Hubei Onearth Trading Company Limited',
    description: 'Политика конфиденциальности и обработки персональных данных в соответствии с 152-ФЗ. Hubei Onearth Trading Company Limited.',
    h1: 'Политика конфиденциальности',
    content: `
      <div class="max-w-7xl mx-auto px-4 py-8">
        <h1>Политика конфиденциальности</h1>
        <p>Настоящая Политика конфиденциальности определяет порядок сбора, обработки и защиты персональных данных пользователей в соответствии с Федеральным законом РФ № 152-ФЗ «О персональных данных».</p>
        <p>Оператор персональных данных: Hubei Onearth Trading Company Limited. E-mail: mail@mail.ru</p>
      </div>
    `
  }
];

function writeStaticHtml(targetRelativePath, title, description, canonicalUrl, bodyHtml) {
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
  writeStaticHtml(relPath, page.title, page.description, canonicalUrl, page.content);
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
