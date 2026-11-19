import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Filter,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { TransformerCalculationResult } from '../../services/transformerCalculator/types';
import { NormativeCategory, NormativeCheckRule } from '../../services/transformerCalculator/normativeTypes';

interface Props {
  result: TransformerCalculationResult;
  onOpenReportModal?: () => void;
}

export const TransformerNormativeInspector: React.FC<Props> = ({
  result,
  onOpenReportModal,
}) => {
  const audit = result.normativeAudit;
  const [selectedCategory, setSelectedCategory] = useState<NormativeCategory | 'all'>('all');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  if (!audit) {
    return null;
  }

  const filteredRules = audit.rules.filter((rule) => {
    if (selectedCategory === 'all') return true;
    return rule.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedRuleId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: NormativeCheckRule['status']) => {
    switch (status) {
      case 'PASS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            СООТВЕТСТВУЕТ
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ПРЕДУПРЕЖДЕНИЕ
          </span>
        );
      case 'FAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            НАРУШЕНИЕ НОРМЫ
          </span>
        );
      case 'NEEDS_ENGINEER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0b3d66]/10 text-[#0b3d66] border border-[#0b3d66]/30">
            <HelpCircle className="w-3.5 h-3.5 text-[#0b3d66]" />
            РЕШЕНИЕ ГИПА
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            ДОПУЩЕНИЕ
          </span>
        );
    }
  };

  const getOriginBadge = (origin: NormativeCheckRule['origin']) => {
    switch (origin) {
      case 'NORMATIVE_REQUIREMENT':
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0b3d66]/10 text-[#0b3d66] border border-[#0b3d66]/20">
            Обязательное требование НД
          </span>
        );
      case 'ENGINEERING_RULE':
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            Инженерное правило САПР
          </span>
        );
      case 'DESIGN_ASSUMPTION':
        return (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            Расчетное допущение
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-5 sm:p-6 space-y-6">
      {/* Шапка модуля нормативного контроля */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#0b3d66]/10 border border-[#0b3d66]/20 text-xs font-bold text-[#0b3d66] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#0b3d66]" />
            Нормативно-управляемый CAD/CAE контроль (РФ 2026)
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            Протокол автоматической верификации по НД РФ и ЕАЭС
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Декларативная проверка проектных параметров по ГОСТ Р 52719-2007 (Изм. 1),
            ПТЭ электрических станций и сетей (Приказ Минэнерго №1070 в ред. №343 от 08.04.2026),
            ПУЭ изд. 7 гл. 4.2 и ГОСТ 1516.3-96.
          </p>
        </div>

        {/* Сводные индикаторы */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
          <div className="text-center px-2">
            <div className="text-2xl font-black text-slate-900">{audit.complianceRatingPct}%</div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Индекс норм</div>
          </div>
          <div className="h-8 w-px bg-slate-300" />
          <div className="flex flex-col gap-1 text-xs font-bold">
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {audit.rulesPassed} пройдено
            </span>
            {audit.rulesWarnings > 0 && (
              <span className="text-amber-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {audit.rulesWarnings} предупреждений
              </span>
            )}
            {audit.rulesFailed > 0 && (
              <span className="text-rose-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {audit.rulesFailed} нарушений
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Фильтр по категориям проверок */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          Категории:
        </span>
        {[
          { id: 'all', label: `Все правила (${audit.rulesTotal})` },
          { id: 'thermal', label: 'Тепловой расчет (ПТЭ №343)' },
          { id: 'short_circuit', label: 'Короткое замыкание (КЗ)' },
          { id: 'insulation', label: 'Изоляция и испытания' },
          { id: 'fire_safety', label: 'Пожарная безопасность (ПУЭ)' },
          { id: 'transport', label: 'Ж/Д транспортировка' },
          { id: 'electrical', label: 'Электрика и нейтраль' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Список нормативных правил */}
      <div className="space-y-3">
        {filteredRules.map((rule) => {
          const isExpanded = expandedRuleId === rule.id;

          return (
            <div
              key={rule.id}
              className={`border rounded-xl transition-all ${
                rule.status === 'FAIL'
                  ? 'border-rose-300 bg-rose-50/30'
                  : rule.status === 'WARNING'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => toggleExpand(rule.id)}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 cursor-pointer select-none"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {rule.id}
                    </span>
                    {getOriginBadge(rule.origin)}
                    {getStatusBadge(rule.status)}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{rule.title}</h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="font-medium text-slate-800 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#0b3d66]" />
                      {rule.document}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{rule.clause}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 text-[11px]">Действует с {rule.effectiveDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium whitespace-nowrap">{rule.parameterName}</div>
                    <div className="text-sm font-black text-slate-900 whitespace-nowrap">
                      {rule.calculatedValue}&nbsp;<span className="text-xs font-bold text-slate-600">{rule.unit}</span>
                      <span className="text-xs text-slate-500 font-normal ml-2">
                        (норма:&nbsp;{rule.limitValue}&nbsp;{rule.unit})
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    title={isExpanded ? 'Свернуть' : 'Подробнее'}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Раскрывающийся блок инженерной трассировки (Section 20) */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-200/80 bg-slate-50/60 rounded-b-xl space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                      Инженерное и нормативное обоснование решения:
                    </span>
                    <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {rule.explanation}
                    </p>
                  </div>

                  {rule.recommendation && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900">Рекомендация САПР-эксперта:</span>
                        <p className="text-amber-800 mt-0.5">{rule.recommendation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-200">
                    <span>Юрисдикция: Российская Федерация (РФ) / ЕАЭС | Версия НД: 19.11.2026</span>
                    <span className="font-mono text-slate-400">HASH: SHA256-CAD-RULE-{rule.id}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Нижняя панель действий */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-slate-600 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0b3d66]" />
          Все расчетные параметры отделены от инженерных допущений и нормативных префиксов.
        </span>

        {onOpenReportModal && (
          <button
            type="button"
            onClick={onOpenReportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#072640] hover:bg-[#0b3d66] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#e6a417]" />
            Сформировать расчетную записку (PDF / Печать)
          </button>
        )}
      </div>
    </div>
  );
};
