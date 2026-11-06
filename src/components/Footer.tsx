import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { TRANSFORMER_CATEGORIES } from '../data/transformerCatalog';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');
const logoUrl = `${BASE}/images/logo.webp`;

export const Footer: React.FC<Props> = ({ onNavigate, onOpenQuoteModal }) => {
  return (
    <footer className="bg-[#0b3d66] text-white border-t border-blue-900 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-blue-800/60">
          {/* Col 1: Company Profile */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-xl inline-block shadow-sm">
              <img
                src={logoUrl}
                alt="Hubei Onearth Trading Company Limited"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block">
                Hubei Onearth Trading
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Company Limited
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Специализируемся на подборе надёжных производителей электротехнического оборудования в Китае. Помогаем российским предприятиям выстраивать прямые поставки трансформаторов 6–35 кВ мощностью 630–2500 кВА.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#e6a417] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
              <span>FCA Маньчжурия · Инкотермс 2020</span>
            </div>
          </div>

          {/* Col 2: Catalog Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6a417] mb-3">
              Каталог оборудования
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {TRANSFORMER_CATEGORIES.map((cat) => (
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
              Информация
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/katalog')}
                  className="hover:text-white transition-colors"
                >
                  Общий каталог продукции
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/po-tz')}
                  className="hover:text-white transition-colors"
                >
                  Изготовление по ТЗ заказчика
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/postavka')}
                  className="hover:text-white transition-colors"
                >
                  Условия поставки и документы
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/kontakty')}
                  className="hover:text-white transition-colors"
                >
                  Контакты и реквизиты
                </button>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenQuoteModal()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e6a417] hover:underline"
                >
                  Запросить коммерческое предложение →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contacts & Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6a417] mb-3">
              Связь с отделом ВЭД
            </h4>

            <div className="space-y-2 text-xs">
              <a
                href="tel:+73431234567"
                className="flex items-center gap-2 text-white hover:text-[#e6a417] font-bold text-sm transition-colors"
              >
                <Phone className="w-4 h-4 text-[#e6a417]" />
                +7 (343) 123-45-67
              </a>

              <a
                href="mailto:mail@mail.ru"
                className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#e6a417]" />
                mail@mail.ru
              </a>

              <div className="flex items-start gap-2 text-slate-300 pt-1">
                <MapPin className="w-4 h-4 text-[#e6a417] shrink-0 mt-0.5" />
                <span>
                  Пункт передачи груза: станция Маньчжурия (КНР), граница РФ/КНР
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenQuoteModal()}
                className="w-full bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors text-center"
              >
                Отправить заявку / ТЗ
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            © 2026 Hubei Onearth Trading Company Limited. Все права защищены.
          </div>
          <div className="text-[11px] text-slate-400">
            Поставка трансформаторного оборудования из Китая на условиях FCA Маньчжурия (Инкотермс 2020)
          </div>
        </div>
      </div>
    </footer>
  );
};
