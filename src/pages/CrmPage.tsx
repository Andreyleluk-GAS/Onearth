import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Search,
  Globe,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  LogOut,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  MapPin,
  Zap,
  Mail,
  Phone,
  Layers,
  Settings,
  Sparkles,
  Inbox,
  Activity,
  ArrowRight,
  Database,
  Building2,
  RefreshCw,
} from 'lucide-react';
import {
  crmService,
  CrmLead,
  SEO_SEARCH_QUERIES,
  SEO_PAGE_POPULARITY,
  SEO_GEO_REGIONS,
} from '../services/crmService';
import { TRANSFORMER_CATEGORIES } from '../data/transformerCatalog';

interface Props {
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

type TabType = 'seo' | 'leads' | 'catalog' | 'settings';
type PeriodType = '7d' | '30d' | '90d' | 'all';

export const CrmPage: React.FC<Props> = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('seo');
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('30d');
  const [searchSourceFilter, setSearchSourceFilter] = useState<string>('all');
  const [searchQueryTerm, setSearchQueryTerm] = useState('');
  
  // Leads state
  const [leads, setLeads] = useState<CrmLead[]>(() => crmService.getLeads());
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all');
  const [leadSearchTerm, setLeadSearchTerm] = useState('');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // New lead form
  const [newCompany, setNewCompany] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('suhie-litaya-10kv');
  const [newPower, setNewPower] = useState('1000');
  const [newComment, setNewComment] = useState('');

  const currentUser = crmService.getCurrentUser() || { name: 'Рустам', login: 'Rustam', role: 'Администратор' };

  const handleUpdateStatus = (id: string, status: CrmLead['status']) => {
    crmService.updateLeadStatus(id, status);
    setLeads(crmService.getLeads());
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Удалить эту заявку из CRM?')) {
      crmService.deleteLead(id);
      setLeads(crmService.getLeads());
    }
  };

  const handleExportCsv = () => {
    const csv = crmService.exportLeadsCsv();
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_hubeienergy_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = TRANSFORMER_CATEGORIES.find((c) => c.slug === newCategorySlug);
    crmService.addLead({
      companyName: newCompany,
      contactName: newContact,
      phone: newPhone,
      email: newEmail,
      categoryTitle: cat?.title || 'Силовой трансформатор',
      categorySlug: newCategorySlug,
      powerKva: newPower,
      voltageHV: cat?.voltageHV || '10 кВ',
      voltageLV: cat?.voltageLV || '0,4 кВ',
      comment: newComment,
      status: 'new',
      source: 'manual',
    });
    setLeads(crmService.getLeads());
    setIsAddLeadModalOpen(false);
    setNewCompany('');
    setNewContact('');
    setNewPhone('');
    setNewEmail('');
    setNewComment('');
  };

  // Filtered queries
  const filteredQueries = SEO_SEARCH_QUERIES.filter((q) => {
    const matchesSource = searchSourceFilter === 'all' || q.source === searchSourceFilter;
    const matchesTerm = !searchQueryTerm || q.query.toLowerCase().includes(searchQueryTerm.toLowerCase());
    return matchesSource && matchesTerm;
  });

  // Filtered leads
  const filteredLeads = leads.filter((l) => {
    const matchesStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter;
    const term = leadSearchTerm.toLowerCase();
    const matchesTerm =
      !term ||
      l.companyName.toLowerCase().includes(term) ||
      l.contactName.toLowerCase().includes(term) ||
      l.phone.toLowerCase().includes(term) ||
      l.email.toLowerCase().includes(term) ||
      l.id.toLowerCase().includes(term);
    return matchesStatus && matchesTerm;
  });

  const getStatusBadge = (status: CrmLead['status']) => {
    switch (status) {
      case 'new':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">Новая заявка</span>;
      case 'in_progress':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-300">В обработке</span>;
      case 'quote_sent':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-300">КП отправлено</span>;
      case 'contract':
        return <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-300">Договор / Сделка</span>;
      case 'archived':
        return <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-slate-300">В архиве</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#072640] text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e6a417] to-amber-300 flex items-center justify-center text-[#072640] font-black shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">Hubei Onearth</span>
                <span className="bg-[#e6a417] text-[#072640] text-[10px] font-black px-1.5 py-0.5 rounded uppercase">CRM & SEO</span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">Панель управления и веб-аналитика</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Пользователь:</span>
              <strong className="text-white">{currentUser.name}</strong>
              <span className="text-slate-400 text-[11px]">({currentUser.role})</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>← На сайт</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Выйти из системы"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#0b3d66] border-t border-white/10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-6 overflow-x-auto scrollbar-none py-1">
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'seo'
                  ? 'bg-white text-[#0b3d66] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#e6a417]" />
              <span>SEO и Яндекс.Метрика</span>
              <span className="bg-[#e6a417] text-[#072640] text-[10px] font-bold px-1.5 py-0.2 rounded-full">Яндекс</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-white text-[#0b3d66] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Inbox className="w-4 h-4 text-[#e6a417]" />
              <span>Заявки с сайта (CRM)</span>
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {leads.filter((l) => l.status === 'new').length} новых
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-white text-[#0b3d66] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4 text-[#e6a417]" />
              <span>Каталог оборудования</span>
              <span className="text-slate-400 text-[11px] font-normal">9 серий</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-[#0b3d66] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-300" />
              <span>Настройки и безопасность</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* ========================================================== */}
        {/* TAB 1: SEO & ЯНДЕКС.МЕТРИКА / ДИРЕКТ                     */}
        {/* ========================================================== */}
        {activeTab === 'seo' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header & Period Filter */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-[#072640] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#e6a417]" />
                  <span>Веб-аналитика и поисковое продвижение (SEO & Директ)</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Сводные данные поисковой видимости, переходов из Яндекс.Директ и поведения B2B-заказчиков на <strong className="text-navy">hubeienergy.ru</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-xl border border-slate-200 shrink-0">
                <span className="text-[11px] font-bold text-slate-400 pl-2">Период:</span>
                {(['7d', '30d', '90d', 'all'] as PeriodType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedPeriod === p
                        ? 'bg-[#0b3d66] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {p === '7d' ? '7 дней' : p === '30d' ? '30 дней' : p === '90d' ? '90 дней' : 'За все время'}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0b3d66] transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Визиты</span>
                  <Users className="w-4 h-4 text-[#0b3d66]" />
                </div>
                <div className="text-2xl font-black text-[#072640]">1,420</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% к пред. периоду</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0b3d66] transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Посетители</span>
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-[#072640]">890</div>
                <div className="text-[11px] text-slate-500 mt-1">ЦА: РФ, ЕАЭС, промпредприятия</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0b3d66] transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Просмотры</span>
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-[#072640]">4,680</div>
                <div className="text-[11px] text-slate-500 mt-1">~3.3 стр. на визит</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0b3d66] transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Ср. время</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-[#072640]">3 мин 42 с</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">Высокая вовлеченность</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0b3d66] transition-all">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Отказы</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-emerald-600">12.8%</div>
                <div className="text-[11px] text-slate-500 mt-1">Отличный показатель в B2B</div>
              </div>

              <div className="bg-gradient-to-br from-[#0b3d66] to-[#072640] p-4 rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between text-slate-300 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e6a417]">Конверсия (CR)</span>
                  <Zap className="w-4 h-4 text-[#e6a417] fill-current" />
                </div>
                <div className="text-2xl font-black text-white">4.8%</div>
                <div className="text-[11px] text-[#e6a417] font-bold mt-1">68 обращений и КП</div>
              </div>
            </div>

            {/* Channels & Traffic Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Channels breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs lg:col-span-2">
                <h3 className="text-sm font-bold text-[#072640] mb-4 flex items-center justify-between">
                  <span>Каналы привлечения трафика (Яндекс Поиск vs Директ vs Прямые)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Данные за 30 дней</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-red-500"></span>
                        Яндекс.Поиск (Органическое SEO)
                      </span>
                      <span className="text-[#072640]">596 визитов (42%) · 26 заявок</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                        Яндекс.Директ (Контекстная реклама на Поиске)
                      </span>
                      <span className="text-[#072640]">398 визитов (28%) · 21 заявка</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
                        Яндекс.Директ (РСЯ / Тематические площадки)
                      </span>
                      <span className="text-[#072640]">198 визитов (14%) · 8 заявок</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '14%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                        Прямые заходы (Закладки, сохраненные КП)
                      </span>
                      <span className="text-[#072640]">156 визитов (11%) · 9 заявок</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '11%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
                        Google Поиск (Органика)
                      </span>
                      <span className="text-[#072640]">72 визита (5%) · 4 заявки</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '5%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical SEO Status Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#072640] mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Технический статус SEO</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">Индексация Sitemap</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-700">15 / 15 URL</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">Файл robots.txt</span>
                      </div>
                      <span className="font-bold text-emerald-700">Clean-param OK</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">SSL-сертификат</span>
                      </div>
                      <span className="font-bold text-emerald-700">Let's Encrypt</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-800">Микроразметка</span>
                      </div>
                      <span className="font-bold text-emerald-700">Schema.org OK</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Домен: <strong>hubeienergy.ru</strong></span>
                  <a
                    href="https://hubeienergy.ru/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0b3d66] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    sitemap.xml <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Top Search Queries Table (Яндекс Директ & Органика) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#072640] flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#e6a417]" />
                    <span>Поисковые фразы и запросы (Яндекс.Поиск и Яндекс.Директ)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Анализ конверсий, кликабельности (CTR) и позиций в поисковой выдаче по трансформаторной тематике
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Поиск по запросам..."
                      value={searchQueryTerm}
                      onChange={(e) => setSearchQueryTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#0b3d66] w-48"
                    />
                  </div>

                  <select
                    value={searchSourceFilter}
                    onChange={(e) => setSearchSourceFilter(e.target.value)}
                    className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 outline-none"
                  >
                    <option value="all">Все источники</option>
                    <option value="Яндекс.Поиск">Яндекс.Поиск (SEO)</option>
                    <option value="Яндекс.Директ (Поиск)">Яндекс.Директ (Поиск)</option>
                    <option value="Яндекс.Директ (РСЯ)">Яндекс.Директ (РСЯ)</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-4">Поисковая фраза (Ключевое слово)</th>
                      <th className="py-3 px-3">Источник</th>
                      <th className="py-3 px-3 text-right">Показы</th>
                      <th className="py-3 px-3 text-right">Клики</th>
                      <th className="py-3 px-3 text-right">CTR</th>
                      <th className="py-3 px-3 text-center">Ср. позиция</th>
                      <th className="py-3 px-3 text-right">Заявки</th>
                      <th className="py-3 px-4">Целевая страница</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredQueries.map((q, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#072640] max-w-xs">
                          {q.query}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              q.source.includes('Директ')
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : q.source.includes('Google')
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {q.source}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">{q.impressions.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#072640]">{q.clicks}</td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-600 font-bold">{q.ctr}%</td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-slate-100 font-mono font-bold px-2 py-0.5 rounded text-slate-700 text-[11px]">
                            № {q.avgPosition}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black px-2 py-0.5 rounded text-[11px]">
                            {q.leadsCount} шт.
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] truncate max-w-[180px]">
                          <button
                            type="button"
                            onClick={() => onNavigate(q.targetUrl)}
                            className="hover:text-[#0b3d66] hover:underline"
                          >
                            {q.targetUrl}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Pages & Geo Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Pages Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                <h3 className="text-sm font-bold text-[#072640] mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0b3d66]" />
                    Популярность страниц сайта
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">ТОП по просмотрам</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-3">Страница</th>
                        <th className="py-2.5 px-2 text-right">Просмотры</th>
                        <th className="py-2.5 px-2 text-right">Доля</th>
                        <th className="py-2.5 px-2 text-right">Ср. время</th>
                        <th className="py-2.5 px-2 text-right">Заявки</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SEO_PAGE_POPULARITY.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <button
                              type="button"
                              onClick={() => onNavigate(p.path)}
                              className="font-bold text-[#0b3d66] hover:underline text-left block"
                            >
                              {p.title}
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono">{p.path}</span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-700">{p.views}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.sharePct}%</td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-500">{p.avgTimeSec} с</td>
                          <td className="py-2.5 px-2 text-right font-mono font-black text-emerald-600">{p.leadsGenerated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Geography Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
                <h3 className="text-sm font-bold text-[#072640] mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    География посетителей (Регионы)
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">РФ и ЕАЭС</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f8fafc] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                      <tr>
                        <th className="py-2.5 px-3">Регион / Город</th>
                        <th className="py-2.5 px-2">Страна</th>
                        <th className="py-2.5 px-2 text-right">Визиты</th>
                        <th className="py-2.5 px-2 text-right">Доля</th>
                        <th className="py-2.5 px-2 text-right">Лиды</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SEO_GEO_REGIONS.map((g, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{g.region}</td>
                          <td className="py-2.5 px-2 text-slate-500">{g.country}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-700">{g.visits}</td>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-500">{g.sharePct}%</td>
                          <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-600">{g.leads}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 2: CRM ВХОДЯЩИЕ ЗАЯВКИ (ЛИДЫ)                         */}
        {/* ========================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Action Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-[#072640] flex items-center gap-2">
                  <Inbox className="w-6 h-6 text-[#e6a417]" />
                  <span>Входящие заявки и обращения с сайта (CRM)</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Лиды из форм расчёта стоимости, конфигуратора по ТЗ и запросов коммерческих предложений
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Экспорт в Excel/CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="bg-[#0b3d66] hover:bg-navy-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить заявку</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400">Статус:</span>
                {[
                  { key: 'all', label: 'Все' },
                  { key: 'new', label: 'Новые' },
                  { key: 'in_progress', label: 'В обработке' },
                  { key: 'quote_sent', label: 'КП отправлено' },
                  { key: 'contract', label: 'Договор' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setLeadStatusFilter(s.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      leadStatusFilter === s.key
                        ? 'bg-[#0b3d66] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Поиск по компании, имени, телефону..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#0b3d66]"
                />
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200 font-bold">
                    <tr>
                      <th className="py-3 px-4">ID / Дата</th>
                      <th className="py-3 px-4">Организация и Контакт</th>
                      <th className="py-3 px-4">Контакты для связи</th>
                      <th className="py-3 px-4">Запрашиваемое оборудование</th>
                      <th className="py-3 px-4">Статус сделки</th>
                      <th className="py-3 px-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          Заявок по выбранным фильтрам не найдено.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#0b3d66] block">{lead.id}</span>
                            <span className="text-[10px] text-slate-400">{lead.createdAt}</span>
                          </td>
                          <td className="py-3 px-4">
                            <strong className="text-slate-900 block font-bold">{lead.companyName}</strong>
                            <span className="text-slate-600 text-[11px]">{lead.contactName}</span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <a href={`tel:${lead.phone}`} className="text-navy font-bold hover:underline flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-[#e6a417]" />
                              {lead.phone}
                            </a>
                            <a href={`mailto:${lead.email}`} className="text-slate-500 text-[11px] hover:underline flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {lead.email}
                            </a>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <span className="font-bold text-slate-800 block text-[11px]">
                              {lead.categoryTitle}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-amber-50 text-[#072640] border border-amber-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                {lead.powerKva} кВА
                              </span>
                              {lead.voltageHV && (
                                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  {lead.voltageHV} / {lead.voltageLV || '0,4 кВ'}
                                </span>
                              )}
                            </div>
                            {lead.comment && (
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                                «{lead.comment}»
                              </p>
                            )}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="space-y-1.5">
                              <div>{getStatusBadge(lead.status)}</div>
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value as CrmLead['status'])}
                                className="text-[10px] border border-slate-300 rounded px-1.5 py-0.5 bg-white text-slate-700 outline-none"
                              >
                                <option value="new">Сменить на: Новая</option>
                                <option value="in_progress">В обработке</option>
                                <option value="quote_sent">КП отправлено</option>
                                <option value="contract">Договор / Сделка</option>
                                <option value="archived">В архив</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="text-slate-400 hover:text-red-600 text-xs p-1"
                              title="Удалить заявку"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 3: КАТАЛОГ ОБОРУДОВАНИЯ (9 КАТЕГОРИЙ)                  */}
        {/* ========================================================== */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-[#072640] flex items-center gap-2">
                  <Layers className="w-6 h-6 text-[#e6a417]" />
                  <span>Каталог оборудования и статистика спроса</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Активные позиции на сайте, установленные изображения и интерес покупателей
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/katalog')}
                className="bg-[#0b3d66] hover:bg-navy-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Перейти в публичный каталог →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TRANSFORMER_CATEGORIES.map((cat, idx) => (
                <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="bg-[#0b3d66] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      № {idx + 1} · {cat.seriesCode}
                    </span>
                    <span className="text-xs font-bold text-[#e6a417] uppercase">
                      {cat.voltageClass} кВ
                    </span>
                  </div>

                  <div className="p-4 flex gap-4 items-center">
                    <img
                      src={cat.image}
                      alt={cat.imageAlt || cat.title}
                      className="w-24 h-24 object-contain shrink-0 bg-slate-50 rounded-xl p-1 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#072640] line-clamp-2">{cat.title}</h4>
                      <div className="text-[11px] text-slate-500">
                        Регулирование: <strong>{cat.regulationType}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Файл: <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">{cat.image.split('/').pop()}</code>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Диапазон: <strong>630–2500 кВА</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/katalog/${cat.slug}`)}
                      className="text-[#0b3d66] font-bold hover:underline flex items-center gap-1 text-xs"
                    >
                      Карточка <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* TAB 4: НАСТРОЙКИ СИСТЕМЫ                                    */}
        {/* ========================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h1 className="text-xl font-extrabold text-[#072640] flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#0b3d66]" />
                <span>Настройки панели управления и параметры системы</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Учётные данные администратора, интеграция с почтой и статус платформы
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#072640] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Учётная запись администратора</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Имя пользователя (Логин)</span>
                    <strong className="text-slate-800 text-sm">{currentUser.login}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[11px]">Права доступа</span>
                    <strong className="text-slate-800 text-sm">Полный доступ (Администратор CRM)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#072640] mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#e6a417]" />
                  <span>Маршрутизация уведомлений о новых заявках</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Все заявки, отправленные клиентами через формы на сайте (конфигуратор по ТЗ, опросный лист, карточки товаров), автоматически фиксируются в этой CRM и направляются на рабочий корпоративный адрес:
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-[#072640] inline-flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#e6a417]" />
                  <span>mail@mail.ru</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-[#072640] mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#0b3d66]" />
                  <span>Резервные копии и безопасность</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  В директории <code>backups/</code> сохранён автономный бинарный Git-бандл и чистый ZIP-архив проекта с детальным планом восстановления <code>RESTORE_PLAN.md</code>.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="bg-[#0b3d66] hover:bg-navy-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Скачать резервную копию всех лидов (CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Manual Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0b3d66] px-6 py-4 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Добавить заявку вручную в CRM</h3>
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Организация заказчика *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="ООO «ЭнергоПром»"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Контактное лицо *</label>
                  <input
                    type="text"
                    required
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="Иван Иванович"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Телефон для связи *</label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="zakaz@company.ru"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Тип оборудования</label>
                  <select
                    value={newCategorySlug}
                    onChange={(e) => setNewCategorySlug(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none bg-white"
                  >
                    {TRANSFORMER_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.shortTitle} ({c.voltageClass} кВ)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Мощность (кВА)</label>
                  <input
                    type="text"
                    value={newPower}
                    onChange={(e) => setNewPower(e.target.value)}
                    placeholder="1000"
                    className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Требования заказчика / Примечания</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Особые требования ТЗ, уровень потерь, степень защиты кожуха..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-[#0b3d66] hover:bg-navy-dark text-white px-5 py-2 rounded-xl font-bold"
                >
                  Сохранить в CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
