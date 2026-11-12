// CRM and SEO Analytics Service for Hubei Onearth Trading
// Handles local storage session, leads management, and comprehensive B2B SEO/Direct statistics

export interface CrmLead {
  id: string;
  createdAt: string;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  categoryTitle: string;
  categorySlug: string;
  powerKva: number | string;
  voltageHV?: string;
  voltageLV?: string;
  comment?: string;
  status: 'new' | 'in_progress' | 'quote_sent' | 'contract' | 'archived';
  source: 'catalog_card' | 'configurator_tz' | 'header_rfq' | 'manual';
}

export interface SearchQueryStat {
  query: string;
  source: 'Яндекс.Поиск' | 'Яндекс.Директ (Поиск)' | 'Яндекс.Директ (РСЯ)' | 'Google';
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  leadsCount: number;
  targetUrl: string;
}

export interface PagePopularityStat {
  path: string;
  title: string;
  views: number;
  uniqueViews: number;
  sharePct: number;
  avgTimeSec: number;
  bounceRatePct: number;
  leadsGenerated: number;
}

export interface GeoRegionStat {
  region: string;
  country: string;
  visits: number;
  sharePct: number;
  leads: number;
}

// Initial realistic B2B inquiries so the CRM has data immediately
const INITIAL_LEADS: CrmLead[] = [
  {
    id: 'LEAD-2026-104',
    createdAt: '2026-11-12 11:45',
    companyName: 'ООО «УралЭнергоМонтаж»',
    contactName: 'Михаил Сергеевич',
    phone: '+7 (912) 645-88-21',
    email: 'm.volkov@uralenergo.ru',
    categoryTitle: 'Сухие трансформаторы с литой изоляцией на класс напряжения 10 кВ с ПБВ ±2х2,5%',
    categorySlug: 'suhie-litaya-10kv',
    powerKva: 1600,
    voltageHV: '10 кВ',
    voltageLV: '0,4 кВ',
    comment: 'Срочный проект подстанции для цеха в Первоуральске. Нужен расчет с кожухом IP31 и доставкой FCA Маньчжурия.',
    status: 'new',
    source: 'catalog_card',
  },
  {
    id: 'LEAD-2026-103',
    createdAt: '2026-11-12 09:18',
    companyName: 'АО «СибПромЭлектро»',
    contactName: 'Алексей Викторович',
    phone: '+7 (903) 932-11-40',
    email: 'a.petrov@sibpromelectro.com',
    categoryTitle: 'Масляные трансформаторы на класс напряжения 35 кВ с РПН ±4х2,5%',
    categorySlug: 'maslyanye-35kv',
    powerKva: 2500,
    voltageHV: '35 кВ',
    voltageLV: '6,3 кВ',
    comment: 'Требуется трансформатор ТМН 2500/35 с РПН под замену старого на распределительном узле. Схема У/Д-11.',
    status: 'in_progress',
    source: 'configurator_tz',
  },
  {
    id: 'LEAD-2026-102',
    createdAt: '2026-11-11 16:30',
    companyName: 'ТОО «KazEnergyTrade» (Казахстан)',
    contactName: 'Ерлан Садыков',
    phone: '+7 (701) 450-99-12',
    email: 'e.sadykov@kazenergy.kz',
    categoryTitle: 'Сухие трансформаторы 10 кВ с пониженными потерями',
    categorySlug: 'suhie-litaya-10kv-pp',
    powerKva: 1000,
    voltageHV: '10 кВ',
    voltageLV: '0,4 кВ',
    comment: 'Запрос на 2 единицы ТСЛ 1000/10 со сниженными потерями холостого хода. Самовывоз через погранпереход Достык/Маньчжурия.',
    status: 'quote_sent',
    source: 'header_rfq',
  },
  {
    id: 'LEAD-2026-101',
    createdAt: '2026-11-10 14:12',
    companyName: 'ООО «ТехноПромКомплект»',
    contactName: 'Дмитрий Николаевич',
    phone: '+7 (495) 789-22-15',
    email: 'orders@tehnoprom-moscow.ru',
    categoryTitle: 'Сухие трансформаторы с воздушно-барьерной изоляцией (H-класс)',
    categorySlug: 'suhie-vozdushno-baryernaya-10kv',
    powerKva: 1250,
    voltageHV: '10 кВ',
    voltageLV: '0,4 кВ',
    comment: 'Особые требования по пожаробезопасности: изоляция Nomex DuPont, H-класс 180°C. Протоколы испытаний.',
    status: 'contract',
    source: 'configurator_tz',
  },
];

// Comprehensive SEO and Yandex Direct Keywords data
export const SEO_SEARCH_QUERIES: SearchQueryStat[] = [
  {
    query: 'сухой трансформатор с литой изоляцией 10 кв купить',
    source: 'Яндекс.Поиск',
    impressions: 4820,
    clicks: 412,
    ctr: 8.54,
    avgPosition: 2.1,
    leadsCount: 14,
    targetUrl: '/katalog/suhie-litaya-10kv/',
  },
  {
    query: 'трансформатор тсл 1000 10 0 4 цена от производителя',
    source: 'Яндекс.Директ (Поиск)',
    impressions: 3290,
    clicks: 345,
    ctr: 10.48,
    avgPosition: 1.4,
    leadsCount: 19,
    targetUrl: '/katalog/suhie-litaya-10kv/',
  },
  {
    query: 'масляный трансформатор 35 кв тмн рпн китай поставка',
    source: 'Яндекс.Поиск',
    impressions: 2150,
    clicks: 184,
    ctr: 8.56,
    avgPosition: 1.8,
    leadsCount: 9,
    targetUrl: '/katalog/maslyanye-35kv/',
  },
  {
    query: 'сухие трансформаторы с пониженными потерями энергосберегающие',
    source: 'Яндекс.Директ (Поиск)',
    impressions: 1940,
    clicks: 168,
    ctr: 8.66,
    avgPosition: 2.3,
    leadsCount: 8,
    targetUrl: '/katalog/suhie-litaya-10kv-pp/',
  },
  {
    query: 'изготовление силового трансформатора по однолинейной схеме тз',
    source: 'Яндекс.Поиск',
    impressions: 1620,
    clicks: 142,
    ctr: 8.76,
    avgPosition: 1.6,
    leadsCount: 12,
    targetUrl: '/po-tz/',
  },
  {
    query: 'трансформаторы сухие 20 кв для подстанций купить',
    source: 'Яндекс.Поиск',
    impressions: 1380,
    clicks: 105,
    ctr: 7.61,
    avgPosition: 3.2,
    leadsCount: 5,
    targetUrl: '/katalog/suhie-litaya-20kv/',
  },
  {
    query: 'трансформаторы h class воздушно барьерная изоляция nomex 10кв',
    source: 'Яндекс.Поиск',
    impressions: 980,
    clicks: 86,
    ctr: 8.77,
    avgPosition: 1.9,
    leadsCount: 6,
    targetUrl: '/katalog/suhie-vozdushno-baryernaya-10kv/',
  },
  {
    query: 'поставка силовых трансформаторов из китая fca маньчжурия',
    source: 'Яндекс.Директ (РСЯ)',
    impressions: 12400,
    clicks: 289,
    ctr: 2.33,
    avgPosition: 1.0,
    leadsCount: 7,
    targetUrl: '/postavka/',
  },
  {
    query: 'трансформаторы 35 кв тм тмг пбв 1600 2500 ква',
    source: 'Google',
    impressions: 1150,
    clicks: 94,
    ctr: 8.17,
    avgPosition: 3.5,
    leadsCount: 4,
    targetUrl: '/katalog/maslyanye-35kv-pbv/',
  },
  {
    query: 'oem трансформаторы преобразовательные для выпрямителей заказ',
    source: 'Яндекс.Поиск',
    impressions: 890,
    clicks: 72,
    ctr: 8.09,
    avgPosition: 2.0,
    leadsCount: 4,
    targetUrl: '/katalog/special-transformatory/',
  },
];

export const SEO_PAGE_POPULARITY: PagePopularityStat[] = [
  {
    path: '/',
    title: 'Главная: Поставки силовых трансформаторов из КНР',
    views: 1840,
    uniqueViews: 1210,
    sharePct: 34.2,
    avgTimeSec: 185,
    bounceRatePct: 11.4,
    leadsGenerated: 26,
  },
  {
    path: '/katalog/',
    title: 'Каталог силовых трансформаторов (Сухие, Масляные, Специальные)',
    views: 1290,
    uniqueViews: 940,
    sharePct: 24.0,
    avgTimeSec: 240,
    bounceRatePct: 9.8,
    leadsGenerated: 18,
  },
  {
    path: '/katalog/suhie-litaya-10kv/',
    title: 'Сухие с литой изоляцией 10 кВ (ТСЛ-10, ПБВ ±2х2,5%)',
    views: 680,
    uniqueViews: 520,
    sharePct: 12.6,
    avgTimeSec: 215,
    bounceRatePct: 13.2,
    leadsGenerated: 14,
  },
  {
    path: '/po-tz/',
    title: 'Изготовление трансформаторов по ТЗ / Конфигуратор',
    views: 490,
    uniqueViews: 380,
    sharePct: 9.1,
    avgTimeSec: 320,
    bounceRatePct: 8.4,
    leadsGenerated: 16,
  },
  {
    path: '/katalog/suhie-litaya-10kv-pp/',
    title: 'Сухие с литой изоляцией 10 кВ ЭКО (пониженные потери)',
    views: 340,
    uniqueViews: 260,
    sharePct: 6.3,
    avgTimeSec: 195,
    bounceRatePct: 14.1,
    leadsGenerated: 8,
  },
  {
    path: '/katalog/maslyanye-35kv/',
    title: 'Масляные трансформаторы 35 кВ (ТМН-35 с РПН ±4х2,5%)',
    views: 290,
    uniqueViews: 220,
    sharePct: 5.4,
    avgTimeSec: 210,
    bounceRatePct: 15.0,
    leadsGenerated: 6,
  },
  {
    path: '/postavka/',
    title: 'Условия поставки, логистика FCA Маньчжурия и таможня',
    views: 240,
    uniqueViews: 190,
    sharePct: 4.5,
    avgTimeSec: 160,
    bounceRatePct: 16.5,
    leadsGenerated: 3,
  },
  {
    path: '/kontakty/',
    title: 'Контакты Hubei Onearth Trading',
    views: 210,
    uniqueViews: 170,
    sharePct: 3.9,
    avgTimeSec: 110,
    bounceRatePct: 18.2,
    leadsGenerated: 4,
  },
];

export const SEO_GEO_REGIONS: GeoRegionStat[] = [
  { region: 'Свердловская область (Екатеринбург)', country: 'Россия', visits: 410, sharePct: 28.8, leads: 22 },
  { region: 'Москва и Московская область', country: 'Россия', visits: 380, sharePct: 26.7, leads: 24 },
  { region: 'Челябинская область', country: 'Россия', visits: 160, sharePct: 11.2, leads: 9 },
  { region: 'Пермский край', country: 'Россия', visits: 110, sharePct: 7.7, leads: 6 },
  { region: 'Санкт-Петербург и ЛО', country: 'Россия', visits: 95, sharePct: 6.7, leads: 5 },
  { region: 'Алматы и Астана', country: 'Казахстан', visits: 90, sharePct: 6.3, leads: 8 },
  { region: 'Тюменская область / ХМАО', country: 'Россия', visits: 75, sharePct: 5.3, leads: 5 },
  { region: 'Минск', country: 'Беларусь', visits: 45, sharePct: 3.2, leads: 3 },
  { region: 'Другие регионы РФ', country: 'Россия', visits: 55, sharePct: 4.1, leads: 6 },
];

const AUTH_STORAGE_KEY = 'onearth_crm_auth_user';
const LEADS_STORAGE_KEY = 'onearth_crm_leads_data';

export const crmService = {
  // Authentication
  login(username: string, pass: string): boolean {
    const cleanUser = username.trim();
    if (cleanUser.toLowerCase() === 'rustam' && pass.trim() === '44332211') {
      const user = {
        name: 'Рустам',
        login: 'Rustam',
        role: 'Администратор (Главный управляющий)',
        loggedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      }
      return true;
    }
    return false;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  },

  getCurrentUser(): { name: string; login: string; role: string } | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  // Leads Management
  getLeads(): CrmLead[] {
    if (typeof window === 'undefined') return INITIAL_LEADS;
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LEADS;
    }
  },

  addLead(lead: Omit<CrmLead, 'id' | 'createdAt'>): CrmLead {
    const leads = this.getLeads();
    const now = new Date();
    const formattedDate = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    const newLead: CrmLead = {
      ...lead,
      id: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: formattedDate,
    };
    const updated = [newLead, ...leads];
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    }
    return newLead;
  },

  updateLeadStatus(id: string, status: CrmLead['status']): void {
    const leads = this.getLeads();
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  deleteLead(id: string): void {
    const leads = this.getLeads();
    const updated = leads.filter((l) => l.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    }
  },

  // Export to CSV
  exportLeadsCsv(): string {
    const leads = this.getLeads();
    const headers = ['ID', 'Дата', 'Организация', 'Контакт', 'Телефон', 'Email', 'Оборудование', 'Мощность кВА', 'Статус', 'Примечания'];
    const rows = leads.map((l) => [
      l.id,
      l.createdAt,
      `"${(l.companyName || '').replace(/"/g, '""')}"`,
      `"${(l.contactName || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${(l.categoryTitle || '').replace(/"/g, '""')}"`,
      l.powerKva,
      l.status,
      `"${(l.comment || '').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  },
};
