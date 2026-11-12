import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUpRight, Settings } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { trackMetrikaGoal } from '../services/yandexMetrika';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
  onOpenCrmLogin?: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenQuoteModal, onOpenCrmLogin }) => {
  const { t, categories } = useLanguage();

  return (
    <footer className="bg-[#0b3d66] text-white border-t border-blue-900 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-blue-800/60">
          {/* Col 1: Company Profile */}
          <div className="space-y-4">
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                {t.footer.companyName}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {t.footer.companySub}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.footer.companyDesc}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#e6a417] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t.footer.fcaBadge}</span>
            </div>
          </div>

          {/* Col 2: Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6a417] mb-3">
              {t.footer.catalogHeader}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/katalog/${cat.slug}`)}
                    className="hover:text-white transition-colors text-left flex items-center justify-between w-full group py-0.5"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {cat.shortTitle}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sections & Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6a417] mb-3">
              {t.footer.navHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/katalog')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.catalog}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/po-tz')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.custom}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/postavka')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.delivery}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/kontakty')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.contacts}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/politika-konfidencialnosti')}
                  className="hover:text-white transition-colors text-slate-300 hover:text-slate-100"
                >
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e6a417] hover:underline"
                >
                  {t.nav.rfq} →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6a417] mb-3">
              {t.footer.contactsHeader}
            </h4>

            <div className="space-y-2 text-xs">
              <a
                href="tel:+73431234567"
                onClick={() => trackMetrikaGoal('phone_click', { location: 'footer' })}
                className="flex items-center gap-2 text-white hover:text-[#e6a417] font-bold text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#e6a417]" />
                +7 (343) 123-45-67
              </a>

              <a
                href="mailto:mail@mail.ru"
                onClick={() => trackMetrikaGoal('email_click', { location: 'footer' })}
                className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#e6a417]" />
                mail@mail.ru
              </a>

              <div className="flex items-start gap-2 text-slate-300 pt-1">
                <MapPin className="w-4 h-4 text-[#e6a417] shrink-0 mt-0.5" />
                <span>
                  {t.nav.fcaBadge}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenQuoteModal()}
                className="w-full bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                {t.nav.rfq}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-3">
            <span>
              © 2026 {t.footer.legalEntity}. {t.footer.rights}
            </span>

            {/* Discreet CRM admin entrance icon */}
            <button
              type="button"
              onClick={onOpenCrmLogin}
              className="text-slate-400 hover:text-slate-200 transition-all p-1 rounded hover:bg-white/10 opacity-35 hover:opacity-100 cursor-pointer"
              title="Панель управления (CRM)"
              aria-label="Панель управления (CRM)"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => onNavigate('/politika-konfidencialnosti')}
              className="text-slate-300 hover:text-white underline transition-colors cursor-pointer"
            >
              {t.footer.privacyPolicy}
            </button>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>{t.footer.disclaimer}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

