import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, FileText, Lock, ArrowLeft, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PRIVACY_POLICY } from '../i18n/privacyData';

interface Props {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<Props> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const policy = PRIVACY_POLICY[language] || PRIVACY_POLICY.ru;
  const [activeSection, setActiveSection] = useState<number>(0);

  const scrollToSection = (idx: number) => {
    setActiveSection(idx);
    const element = document.getElementById(`section-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 border-b border-surface-border py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="hover:text-navy cursor-pointer flex items-center gap-1"
          >
            <span>{t.nav.home}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-navy font-bold">{t.privacy.breadcrumb}</span>
        </div>
      </div>

      {/* Hero Header Banner */}
      <section className="bg-gradient-to-br from-[#072640] via-[#0b3d66] to-[#0a3558] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#e6a417]/20 border border-[#e6a417]/40 text-[#e6a417] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              {policy.badge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {policy.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
              {policy.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-mono">
                {policy.effectiveDate}
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {t.privacy.securityNotice}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Sidebar: Table of Contents */}
          <aside className="lg:col-span-4 sticky top-20 bg-white rounded-2xl border border-surface-border p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-navy font-black text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4 text-[#0b3d66]" />
              <span>{t.privacy.tocTitle}</span>
            </div>

            <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {policy.sections.map((sec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSection(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer ${
                    activeSection === idx
                      ? 'bg-[#0b3d66] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-navy'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      activeSection === idx ? 'text-[#e6a417] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                </button>
              ))}
            </nav>

            {/* Legal Operator Card */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-2">
              <div className="flex items-start gap-2 bg-blue-50/70 p-3 rounded-xl border border-blue-100/60 text-[#0b3d66]">
                <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#0b3d66]" />
                <p className="leading-snug">{t.privacy.operatorInfo}</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.privacy.backToHome}</span>
              </button>
            </div>
          </aside>

          {/* Right Main Column: Policy Document Text */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm space-y-10">
            {/* Introductory Preamble Card */}
            <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-5 rounded-r-2xl shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#e6a417] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {policy.preamble}
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="space-y-12 divide-y divide-slate-100">
              {policy.sections.map((sec, sIdx) => (
                <div
                  key={sIdx}
                  id={`section-${sIdx}`}
                  className={`scroll-mt-24 ${sIdx > 0 ? 'pt-8' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-[#0b3d66] text-white text-xs font-black flex items-center justify-center shrink-0">
                      {sIdx + 1}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-navy tracking-tight">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="space-y-3.5 pl-1 sm:pl-11 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sec.items.map((item, iIdx) => {
                      const isSubHeader = /^[1-9]\.[0-9]+\s+[А-ЯЁA-Z]/.test(item) || /^[1-9]\.[0-9]+$/.test(item);
                      const isSubClause = /^[1-9]\.[0-9]+\.[0-9]+\./.test(item);
                      const isBullet = item.startsWith('—') || item.startsWith('-');

                      return (
                        <div
                          key={iIdx}
                          className={`rounded-lg transition-colors ${
                            isSubClause
                              ? 'bg-slate-50/70 p-3 border border-slate-100/80'
                              : isBullet
                              ? 'pl-4 font-mono text-xs text-slate-600'
                              : ''
                          }`}
                        >
                          <p className={isSubHeader ? 'font-bold text-navy' : ''}>
                            {item}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Contact / Revocation Notice */}
            <div className="pt-8 border-t border-slate-200">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-navy">
                    {language === 'zh'
                      ? '个人信息主体权利与撤回同意'
                      : language === 'en'
                      ? 'Data Subject Rights and Consent Revocation'
                      : 'Права субъекта и отзыв согласия на обработку'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    {language === 'zh'
                      ? '用户有权查阅、更正、要求删除其个人信息或撤回同意。请发送正式书面申请至官方外贸邮箱。'
                      : language === 'en'
                      ? 'Users have the right to access, rectify, or request deletion of their personal data by submitting a formal request to our official email.'
                      : 'Субъект персональных данных вправе отозвать согласие или запросить уточнение/удаление данных, направив запрос на mail@mail.ru.'}
                  </p>
                </div>
                <a
                  href="mailto:mail@mail.ru?subject=Personal%20Data%20Request"
                  className="inline-flex items-center gap-2 bg-[#0b3d66] hover:bg-navy-dark text-white px-4 py-2.5 rounded-xl font-bold text-xs shrink-0 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#e6a417]" />
                  <span>mail@mail.ru</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
