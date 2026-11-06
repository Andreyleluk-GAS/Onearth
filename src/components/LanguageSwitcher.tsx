import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LANGUAGE_OPTIONS } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

interface Props {
  variant?: 'topbar' | 'header' | 'mobile';
}

export const LanguageSwitcher: React.FC<Props> = ({ variant = 'topbar' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        {LANGUAGE_OPTIONS.map((opt) => {
          const isActive = opt.code === language;
          return (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLanguage(opt.code)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white text-[#0b3d66] shadow-xs'
                  : 'text-slate-600 hover:text-[#0b3d66]'
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Topbar variant (rendered at top right of the page)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors bg-white/10 hover:bg-white/20 text-white border border-white/15 cursor-pointer"
        title="Выбрать язык / Choose language / 选择语言"
      >
        <Globe className="w-3.5 h-3.5 text-[#e6a417]" />
        <span className="text-[11px] uppercase tracking-wider">{currentOption.flag} {currentOption.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white text-slate-800 shadow-2xl border border-slate-200 py-1 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Язык сайта / Language
          </div>
          {LANGUAGE_OPTIONS.map((opt) => {
            const isActive = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelect(opt.code)}
                className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-[#0b3d66] font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#0b3d66]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{opt.flag}</span>
                  <span>{opt.nativeName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({opt.code.toUpperCase()})</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-[#e6a417]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
