import React, { useState } from 'react';
import { Phone, Mail, Menu, X, ChevronDown, ShieldCheck, Zap } from 'lucide-react';
import { TRANSFORMER_CATEGORIES } from '../data/transformerCatalog';

interface Props {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
const logoUrl = `${BASE}/images/logo.webp`;

export const Header: React.FC<Props> = ({ currentPath, onNavigate, onOpenQuoteModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogDropdownOpen, setIsCatalogDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
    setIsCatalogDropdownOpen(false);
  };

  const navItems = [
    { label: 'Главная', path: '/' },
    { label: 'Каталог', path: '/katalog', hasDropdown: true },
    { label: 'Изготовление по ТЗ', path: '/po-tz' },
    { label: 'Поставка и импорт', path: '/postavka' },
    { label: 'Контакты', path: '/kontakty' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-border shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-[#0b3d66] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-slate-200">
            <span className="flex items-center gap-1 text-[#e6a417] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Базис поставки: FCA Маньчжурия (Инкотермс 2020)
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Прямой подбор китайских заводов электрооборудования
            </span>
          </div>

          <div className="flex items-center gap-5 ml-auto">
            <a
              href="tel:+73431234567"
              className="flex items-center gap-1.5 text-white hover:text-[#e6a417] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#e6a417]" />
              +7 (343) 123-45-67
            </a>
            <a
              href="mailto:mail@mail.ru"
              className="hidden sm:flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#e6a417]" />
              mail@mail.ru
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="text-left flex items-center gap-3.5 group cursor-pointer"
        >
          <img
            src={logoUrl}
            alt="Hubei Onearth Trading Company Limited"
            className="h-9 sm:h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-102"
          />
          <div className="hidden xl:flex flex-col border-l border-slate-200 pl-3">
            <span className="text-[11px] font-bold text-[#0b3d66] uppercase tracking-wider leading-tight">
              Трансформаторы из Китая
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              FCA Маньчжурия · Инкотермс 2020
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path);

            if (item.hasDropdown) {
              return (
                <div
                  key={item.path}
                  className="relative group"
                  onMouseEnter={() => setIsCatalogDropdownOpen(true)}
                  onMouseLeave={() => setIsCatalogDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`inline-flex items-center gap-1 text-sm font-bold transition-colors py-1 ${
                      isActive ? 'text-[#0b3d66] border-b-2 border-[#0b3d66]' : 'text-slate-700 hover:text-[#0b3d66]'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
                  </button>

                  {/* Mega-Dropdown Menu */}
                  {isCatalogDropdownOpen && (
                    <div className="absolute top-full left-0 w-[430px] bg-white rounded-2xl shadow-2xl border border-surface-border p-3.5 pt-2.5 z-50 animate-fadeIn">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1.5 border-b border-slate-100 mb-1">
                        Категории силового оборудования
                      </div>
                      <div className="space-y-0.5">
                        {TRANSFORMER_CATEGORIES.map((cat) => (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => handleNav(`/katalog/${cat.slug}`)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-800 hover:text-[#0b3d66] transition-colors flex items-center justify-between group/item"
                          >
                            <span className="whitespace-nowrap text-slate-700 group-hover/item:text-[#0b3d66]">
                              {cat.shortTitle}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 group-hover/item:bg-blue-50 group-hover/item:text-[#0b3d66] px-2 py-0.5 rounded font-mono font-bold shrink-0 whitespace-nowrap ml-3">
                              {cat.voltageClass}&nbsp;кВ
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleNav('/katalog')}
                          className="w-full text-center text-xs font-bold text-[#0b3d66] hover:underline py-1"
                        >
                          Смотреть весь каталог →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`text-sm font-bold transition-colors py-1 ${
                  isActive
                    ? 'text-[#0b3d66] border-b-2 border-[#0b3d66]'
                    : 'text-slate-700 hover:text-[#0b3d66]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenQuoteModal()}
            className="inline-flex items-center gap-2 bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            Запросить КП
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-white px-4 py-4 space-y-2 shadow-xl">
          {navItems.map((item) => (
            <div key={item.path}>
              <button
                type="button"
                onClick={() => handleNav(item.path)}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-navy"
              >
                {item.label}
              </button>
              {item.hasDropdown && (
                <div className="pl-4 py-1 space-y-1">
                  {TRANSFORMER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => handleNav(`/katalog/${cat.slug}`)}
                      className="w-full text-left py-1.5 px-3 rounded-md text-xs text-slate-600 hover:text-navy hover:bg-slate-50"
                    >
                      • {cat.shortTitle}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-[#e6a417] text-[#072640] py-2.5 rounded-lg font-bold text-xs uppercase text-center"
            >
              Запросить КП на трансформатор
            </button>
            <a
              href="tel:+73431234567"
              className="w-full bg-slate-100 text-navy py-2 rounded-lg font-semibold text-xs text-center flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#e6a417]" />
              Позвонить: +7 (343) 123-45-67
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
