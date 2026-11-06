import React, { useState } from 'react';
import { TransformerSpec } from '../types/transformer';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  specs: TransformerSpec[];
  categoryTitle: string;
}

export const TechnicalLossChart: React.FC<Props> = ({ specs }) => {
  const { t, language } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<'p0' | 'pkz'>('p0');
  const [hoveredPoint, setHoveredPoint] = useState<TransformerSpec | null>(null);

  // Filter unique power entries for clean charting
  const chartData = specs.filter((item, index, self) =>
    index === self.findIndex((t) => t.power_kva === item.power_kva && t.uk_pct === 6)
  ).length > 0
    ? specs.filter((item, index, self) => index === self.findIndex((t) => t.power_kva === item.power_kva && t.uk_pct === 6))
    : specs.filter((item, index, self) => index === self.findIndex((t) => t.power_kva === item.power_kva));

  // Determine values
  const getMetricValue = (item: TransformerSpec): number => {
    if (selectedMetric === 'p0') return item.p0_w;
    return item.pkz_h_w || item.pkz_w || item.pkz_f_w || 0;
  };

  const maxVal = Math.max(...chartData.map(getMetricValue), 1);
  const minVal = Math.min(...chartData.map(getMetricValue), 0);

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 50;
  const paddingY = 30;

  const getX = (index: number) => {
    return paddingX + (index / (chartData.length - 1 || 1)) * (svgWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    const normalized = (val - minVal) / range;
    return svgHeight - paddingY - normalized * (svgHeight - paddingY * 2);
  };

  // Generate SVG path points
  const points = chartData.map((d, i) => `${getX(i)},${getY(getMetricValue(d))}`).join(' ');

  const capacityUnit = 'kVA';
  const wattsUnit = language === 'zh' ? 'W' : language === 'en' ? 'W' : 'Вт';
  const axisXText = language === 'zh' ? 'X轴：额定容量 (kVA)' : language === 'en' ? 'X-Axis: Rated Capacity (kVA)' : 'Ось X: Номинальная мощность (кВА)';
  const hoverHint = language === 'zh' ? '悬停查看精确试验损耗数值' : language === 'en' ? 'Hover data points to view exact losses' : 'Наведите на точки для просмотра точных значений';

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-navy uppercase tracking-wider">
            {t.chart.title}
          </h4>
          <p className="text-xs text-slate-500">
            {t.chart.subtitle}
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="inline-flex rounded-lg bg-slate-100 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedMetric('p0')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              selectedMetric === 'p0'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            {t.chart.p0Metric}
          </button>
          <button
            type="button"
            onClick={() => setSelectedMetric('pkz')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              selectedMetric === 'pkz'
                ? 'bg-[#0b3d66] text-white shadow-sm'
                : 'text-slate-600 hover:text-navy'
            }`}
          >
            {t.chart.pkzMetric}
          </button>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
          style={{ maxHeight: '240px' }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + pct * (svgHeight - paddingY * 2);
            const val = Math.round(maxVal - pct * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <polygon
            points={`${getX(0)},${svgHeight - paddingY} ${points} ${getX(chartData.length - 1)},${svgHeight - paddingY}`}
            fill={selectedMetric === 'p0' ? '#0b3d66' : '#e6a417'}
            fillOpacity={selectedMetric === 'p0' ? '0.08' : '0.12'}
          />

          {/* Line */}
          <polyline
            fill="none"
            stroke={selectedMetric === 'p0' ? '#0b3d66' : '#e6a417'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Points */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const y = getY(getMetricValue(d));
            const isHovered = hoveredPoint?.power_kva === d.power_kva;

            return (
              <g
                key={d.power_kva}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredPoint(d)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 7 : 4.5}
                  fill={isHovered ? '#ffffff' : (selectedMetric === 'p0' ? '#0b3d66' : '#e6a417')}
                  stroke={selectedMetric === 'p0' ? '#0b3d66' : '#e6a417'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />
                {/* X-axis label */}
                <text
                  x={x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-slate-600"
                >
                  {d.power_kva}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip / Legend */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-navy text-white text-xs rounded-lg px-3 py-1.5 shadow-lg border border-navy-light flex items-center gap-3">
            <div>
              <span className="text-slate-300">{language === 'zh' ? '容量: ' : language === 'en' ? 'Power: ' : 'Мощность: '}</span>
              <strong className="text-accent">{hoveredPoint.power_kva} {capacityUnit}</strong>
            </div>
            <div className="border-l border-slate-600 pl-3">
              <span className="text-slate-300">
                {selectedMetric === 'p0' ? 'P₀: ' : 'P_k: '}
              </span>
              <strong className="text-white font-mono">
                {getMetricValue(hoveredPoint).toLocaleString()} {wattsUnit}
              </strong>
            </div>
            <div className="border-l border-slate-600 pl-3">
              <span className="text-slate-300">I₀: </span>
              <strong className="text-white">{hoveredPoint.i0_pct}%</strong>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-2 px-1">
        <span>{axisXText}</span>
        <span className="text-slate-400">{hoverHint}</span>
      </div>
    </div>
  );
};
