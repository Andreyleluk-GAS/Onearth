import React from 'react';
import { Truck, FileCheck, Languages, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  onNavigate: (path: string) => void;
  onOpenQuoteModal: (categorySlug?: string) => void;
}

export const PostavkaPage: React.FC<Props> = ({ onOpenQuoteModal }) => {
  const { t, language } = useLanguage();

  const getSteps = () => {
    if (language === 'zh') {
      return [
        {
          num: '01',
          title: '技术选型与商务测算',
          desc: '核实一次接线图或技术协议，精选专业对口工厂，快速核算设备出厂价。',
        },
        {
          num: '02',
          title: '技术规格书与商务合同',
          desc: '确认技术参数、外形安装尺寸图（GA Drawing）、随车技术单据清单及出厂铭牌语言。',
        },
        {
          num: '03',
          title: '车间制造与出厂试验',
          desc: '在中国制造基地组织生产，按国际标准完成绝缘耐压等全套出厂试验并出具 Test Report。',
        },
        {
          num: '04',
          title: '中国境内运输与出口报关',
          desc: '设备运抵中国境内约定交接地，卖方全权负责组织运输并办理完毕全部海关出口报关与清关手续。',
        },
        {
          num: '05',
          title: 'FCA 货权移交与起运',
          desc: '在约定的铁路集装箱场站或公路口岸移交买方指定的国际承运人。',
        },
      ];
    }

    if (language === 'en') {
      return [
        {
          num: '01',
          title: 'Technical Sourcing & Quoting',
          desc: 'Analysis of single-line diagram or technical spec, factory matching, and direct pricing calculation.',
        },
        {
          num: '02',
          title: 'Specification & Contract',
          desc: 'Finalization of electrical parameters, outline drawings, documentation scope, and rating plate language.',
        },
        {
          num: '03',
          title: 'Production & Factory Testing',
          desc: 'Fabrication at qualified PRC plant, rigorous dielectric/routine tests, and issuance of certified Test Report.',
        },
        {
          num: '04',
          title: 'Domestic Transport & Export Clearance',
          desc: 'Delivery of equipment to the agreed location in the PRC, including export customs clearance, is conducted by and at the expense of the Seller.',
        },
        {
          num: '05',
          title: 'FCA Cargo Handover',
          desc: 'Handover of cleared equipment to buyer’s nominated international road or rail carrier.',
        },
      ];
    }

    return [
      {
        num: '01',
        title: 'Технический подбор и ТКП',
        desc: 'Анализ однолинейной схемы или ТЗ, выбор профильного китайского завода, расчёт стоимости оборудования.',
      },
      {
        num: '02',
        title: 'Спецификация и договор',
        desc: 'Фиксация технических параметров, чертежей общего вида, состава документации и языка протоколов испытаний.',
      },
      {
        num: '03',
        title: 'Производство и испытания',
        desc: 'Изготовление на заводе КНР, прохождение приёмо-сдаточных тестов с формированием заводского Test Report.',
      },
      {
        num: '04',
        title: 'Доставка в КНР и экспортная очистка',
        desc: 'Доставка оборудования до согласованного места в КНР, включая таможенное оформление экспорта, осуществляется силами и за счёт Продавца.',
      },
      {
        num: '05',
        title: 'Передача груза (FCA)',
        desc: 'Передача оборудования назначенному покупателем российскому авто- или ж/д перевозчику.',
      },
    ];
  };

  const steps = getSteps();

  const docItems =
    language === 'zh'
      ? [
          '商业发票 (Commercial Invoice)',
          '装箱单 (Packing List，含毛重与净重)',
          '中国海关正本出口报关单据',
          '变压器工厂出厂试验报告 (Test Report)',
          '产品使用说明书与原产地证明（按需）',
        ]
      : language === 'en'
      ? [
          'Commercial Invoice with full HS code specification',
          'Detailed Packing List with gross/net dimensions',
          'PRC Export Customs Declaration',
          'Certified Factory Test Report',
          'Operations, installation and maintenance manual',
        ]
      : [
          'Коммерческий инвойс (Commercial Invoice)',
          'Упаковочный лист (Packing List) с весами',
          'Экспортные таможенные документы КНР',
          'Протокол заводских испытаний изделий',
          'Руководство по эксплуатации',
        ];

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <section className="bg-[#0b3d66] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#e6a417] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-md inline-block mb-3">
              {t.postavka.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {t.postavka.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              {t.postavka.desc}
            </p>
          </div>
        </div>
      </section>

      {/* 3 Client Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Basis */}
          <div className="bg-white rounded-2xl border border-surface-border p-7 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b3d66] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-navy">{t.postavka.c1Title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.postavka.c1Desc}
            </p>
            <p className="text-xs text-slate-500 border-t border-slate-100 pt-3">
              {t.postavka.c1Sub}
            </p>
          </div>

          {/* Card 2: Documents */}
          <div className="bg-white rounded-2xl border border-surface-border p-7 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#e6a417] flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-navy">{t.postavka.c2Title}</h2>
            <ul className="space-y-2 text-xs text-slate-700">
              {docItems.map((doc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Language */}
          <div className="bg-white rounded-2xl border border-surface-border p-7 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-black text-navy">{t.postavka.c3Title}</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.postavka.c3Desc}
            </p>
            <p className="text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
              {t.postavka.c3Sub}
            </p>
          </div>
        </div>
      </section>

      {/* 5-Step Visual Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#0b3d66] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">
              {t.postavka.stepsTitle}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-navy mt-2">
              {t.postavka.stepsSub}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div
                key={st.num}
                className="bg-[#f8fafc] rounded-2xl p-5 border border-slate-200 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[#e6a417] font-mono block mb-2">
                    {st.num}
                  </span>
                  <h4 className="text-xs font-bold text-navy mb-2">
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Client Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#fff7e6] border-l-4 border-l-[#e6a417] p-6 rounded-r-2xl shadow-sm flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#e6a417] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <strong className="text-navy text-sm block">
              {language === 'zh'
                ? '签约前关键要点提示：'
                : language === 'en'
                ? 'Key Points Before Contract Sign-off:'
                : 'Важно перед заключением контракта:'}
            </strong>
            <p className="leading-relaxed">
              {language === 'zh'
                ? '在签署商务合同之前，双方须明确并确认运输路线、交货期、集装箱木箱出口包装及运输唛头要求，以及清关所需的全部随附单据清单。'
                : language === 'en'
                ? 'Prior to contract signing, the transportation route, delivery timeline, specific export packing and shipping mark requirements, as well as the full package of customs documentation, must be agreed upon.'
                : 'До заключения контракта необходимо согласовать маршрут перевозки, сроки поставки, специальные требования к экспортной упаковке и транспортной маркировке, а также полный комплект документов, необходимых для таможенного оформления.'}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Inquiry CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0b3d66] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">
              {language === 'zh'
                ? '对商务合作与供货条款仍有疑问？'
                : language === 'en'
                ? 'Have questions regarding terms of cooperation?'
                : 'Остались вопросы по условиям сотрудничества?'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {language === 'zh'
                ? '我司外贸部工程师可提供详细流程解答与物流节点对接说明。'
                : language === 'en'
                ? 'Our international trade department will provide detailed guidance on the dispatch protocol.'
                : 'Наш специалист по ВЭД предоставит подробную консультацию по процедуре отгрузки.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenQuoteModal()}
            className="bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer"
          >
            {t.nav.rfq}
          </button>
        </div>
      </section>
    </div>
  );
};
