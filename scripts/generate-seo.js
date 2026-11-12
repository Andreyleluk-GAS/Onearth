import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Generate robots.txt according to Yandex & Google B2B specifications
const robotsTxt = `# robots.txt for Hubei Onearth Trading Company Limited
# B2B Platform for Power Transformers Import from China (FCA Manzhouli)

User-agent: Yandex
Disallow: /*?*
Disallow: /*utm_*
Disallow: /crm/
Disallow: /admin/
Allow: /
Allow: /katalog/
Allow: /po-tz/
Allow: /postavka/
Allow: /kontakty/
Allow: /politika-konfidencialnosti/
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid
Host: https://hubeienergy.ru

User-agent: *
Disallow: /*?*
Disallow: /*utm_*
Disallow: /crm/
Disallow: /admin/
Allow: /
Sitemap: https://hubeienergy.ru/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt.trim());
console.log('✅ Generated public/robots.txt');

// 2. Canonical URLs list for Hubei Onearth Trading
const CANONICAL_URLS = [
  { loc: 'https://hubeienergy.ru/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/suhie-litaya-10kv/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/suhie-litaya-10kv-pp/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/suhie-litaya-20kv/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/suhie-litaya-35kv/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/suhie-litaya-35kv-pp/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/suhie-vozdushno-baryernaya-10kv/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/maslyanye-35kv/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/maslyanye-35kv-pbv/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/katalog/special-transformatory/', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://hubeienergy.ru/po-tz/', priority: '0.9', changefreq: 'monthly' },
  { loc: 'https://hubeienergy.ru/postavka/', priority: '0.9', changefreq: 'monthly' },
  { loc: 'https://hubeienergy.ru/kontakty/', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://hubeienergy.ru/politika-konfidencialnosti/', priority: '0.5', changefreq: 'yearly' },
];

// Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${CANONICAL_URLS.map(
  (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim());
console.log('✅ Generated public/sitemap.xml');

// 3. Generate SEO Semantics CSV Export
const csvRows = [
  'Кластер;Поисковый запрос;Интент;URL;Приоритет;Тип страницы;Title;Description;H1',
  'Главная;трансформаторы из китая;commercial;/;P0;главная;Hubei Onearth Trading — трансформаторы из Китая;Подбор и поставка сухих и масляных трансформаторов из Китая. FCA Маньчжурия.;Трансформаторное оборудование из Китая для российских предприятий',
  'Каталог;каталог трансформаторов китай;commercial;/katalog/;P0;раздел;Каталог трансформаторов — Hubei Onearth Trading;Каталог сухих и масляных трансформаторов 10, 20 и 35 кВ мощностью 630-2500 кВА;Каталог по типам оборудования',
  'Сухие 10 кВ;сухие трансформаторы с литой изоляцией 10 кв;commercial;/katalog/suhie-litaya-10kv/;P0;посадочная;Сухие трансформаторы с литой изоляцией 10 кВ;Сухие трансформаторы 10 кВ ПБВ ±2х2,5%, 630-2500 кВА, потери ХХ и КЗ;Сухие трансформаторы с литой изоляцией на 10 кВ',
  'Сухие 10 кВ ПП;сухие трансформаторы 10 кв пониженные потери;commercial;/katalog/suhie-litaya-10kv-pp/;P0;посадочная;Сухие трансформаторы 10 кВ с пониженными потерями;Энергоэффективные трансформаторы 10 кВ с литой изоляцией и сниженными потерями P0;Сухие трансформаторы 10 кВ с пониженными потерями',
  'Сухие 20 кВ;сухие трансформаторы с литой изоляцией 20 кв;commercial;/katalog/suhie-litaya-20kv/;P0;посадочная;Сухие трансформаторы с литой изоляцией 20 кВ;Сухие трансформаторы 20 кВ 630-2500 кВА для сетей 20 кВ мегаполисов;Сухие трансформаторы с литой изоляцией на 20 кВ',
  'Сухие 35 кВ;сухие трансформаторы с литой изоляцией 35 кв;commercial;/katalog/suhie-litaya-35kv/;P0;посадочная;Сухие трансформаторы с литой изоляцией 35 кВ;Высоковольтные сухие трансформаторы 35 кВ с ПБВ ±2х2,5%, 630-2500 кВА;Сухие трансформаторы с литой изоляцией на 35 кВ',
  'Сухие 35 кВ ПП;сухие трансформаторы 35 кв с пониженными потерями;commercial;/katalog/suhie-litaya-35kv-pp/;P0;посадочная;Сухие трансформаторы 35 кВ с пониженными потерями;Сухие трансформаторы 35 кВ с пониженными потерями холостого хода;Сухие трансформаторы 35 кВ с пониженными потерями',
  'Воздушно-барьерные;сухие трансформаторы с воздушно барьерной изоляцией 10 кв;commercial;/katalog/suhie-vozdushno-baryernaya-10kv/;P0;посадочная;Сухие трансформаторы с воздушно-барьерной изоляцией 10 кВ;Трансформаторы класса H (Nomex) на 10 кВ с ПБВ ±2х2,5%, 630-2500 кВА;Сухие трансформаторы с воздушно-барьерной изоляцией, 10 кВ',
  'Масляные 35 кВ;масляные трансформаторы 35 кв китай;commercial;/katalog/maslyanye-35kv/;P0;посадочная;Масляные трансформаторы 35 кВ — Hubei Onearth Trading;Масляные трансформаторы 35 кВ с ПБВ ±2х2,5%, 630-2500 кВА;Масляные трансформаторы на 35 кВ',
  'По ТЗ;изготовление трансформаторов по тз китай;commercial;/po-tz/;P0;услуга;Изготовление трансформаторов по ТЗ — Hubei Onearth Trading;Изготовление трансформаторов по техническому заданию, опросному листу и схемам;Изготовление по ТЗ',
  'Поставка;условия поставки fca маньчжурия трансформаторы;commercial;/postavka/;P0;информация;Условия поставки и импорта — Hubei Onearth Trading;Поставка на условиях FCA Маньчжурия Инкотермс 2020. Документы и регламент;Условия поставки и импорта',
  'Контакты;hubei onearth trading контакты;navigational;/kontakty/;P1;контакты;Контакты — Hubei Onearth Trading Company Limited;Контакты: телефон +7 (343) 123-45-67, e-mail mail@mail.ru;Контакты'
];

fs.writeFileSync(path.join(publicDir, 'seo-semantics-export.csv'), '\uFEFF' + csvRows.join('\n'));
console.log('✅ Generated public/seo-semantics-export.csv');
