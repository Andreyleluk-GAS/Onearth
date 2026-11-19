import React, { useState, useRef, useMemo } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, Layers, FileText, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TransformerCalculationResult } from '../../services/transformerCalculator/types';
import { generateDxfContent, downloadDxfFile } from '../../services/transformerCalculator/dxfGenerator';
import { computeDraftingContext, SvgCadBuilder } from '../../services/transformerCalculator/cadDraftingEngine';

interface Props {
  result: TransformerCalculationResult;
  onOpenQuoteModal?: () => void;
}

export const TransformerBlueprintSvg: React.FC<Props> = ({ result }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dimMode, setDimMode] = useState<'letters' | 'values' | 'both'>('both');

  const containerRef = useRef<HTMLDivElement>(null);

  const d = result.dimensions;
  const isOil = result.input.type === 'oil';
  const L = d.lengthMm;
  const W = d.widthMm;
  const H = d.heightMm;
  const req = result.input;

  // =========================================================================
  // СТАНДАРТНЫЙ ФОРМАТ А4 ПО ГОРИЗОНТАЛИ (ГОСТ 2.301-68) — 297 x 210 мм
  // =========================================================================
  const sheetWidth = 2970;
  const sheetHeight = 2100;

  // Рамка по ГОСТ 2.104:
  // - Слева: 20 мм (200 единиц) — поле подшивки
  // - Сверху, справа, снизу: 5 мм (50 единиц)
  const frameLeft = 200;
  const frameTop = 50;
  const frameRight = sheetWidth - 50; // 2920
  const frameBottom = sheetHeight - 50; // 2050
  const frameWidth = frameRight - frameLeft; // 2720
  const frameHeight = frameBottom - frameTop; // 2000

  // Штамп по ГОСТ в правом нижнем углу листа А4
  const tbW = 1220;
  const tbH = 580;
  const tbX = frameRight - tbW; // 1700
  const tbY = frameBottom - tbH; // 1470

  // Параметрический расчет масштаба и привязок САПР-движка
  const ctx = useMemo(() => {
    return computeDraftingContext(result, frameWidth, frameHeight);
  }, [result, frameWidth, frameHeight]);

  const {
    scale,
    gostScaleText,
    sL,
    sW,
    sH,
    sTotL,
    sTotW,
    sTotH,
    sBhHv,
    sBhMv,
    sBhLv,
    sConsD,
    sConsL,
    sRadW,
    sRadH,
    sRadDepth,
    skirtsCount,
    groundY,
    frontCenterX,
    sideCenterX,
    topCenterY,
    sGauge,
    trackGaugeMm,
    hasFans,
    windingConfig,
    windingMaterial,
    radiators,
    fanSpec,
    radsCountFront,
    radsCountSide,
    radsCountTop,
    radsRight,
    radsBack,
    radsLeft,
    totalRads,
    enclosure,
    isEnclosedDry,
    dryCoolingType,
    feasibility,
  } = ctx;

  // Размерные надписи
  const dimTextH =
    dimMode === 'letters' ? 'H' : dimMode === 'values' ? `${d.overallHeightMm.toFixed(0)}` : `H = ${d.overallHeightMm.toFixed(0)}`;
  const dimTextB =
    dimMode === 'letters' ? 'B' : dimMode === 'values' ? `${d.overallWidthMm.toFixed(0)}` : `B = ${d.overallWidthMm.toFixed(0)}`;
  const dimTextL =
    dimMode === 'letters' ? 'L' : dimMode === 'values' ? `${d.overallLengthMm.toFixed(0)}` : `L = ${d.overallLengthMm.toFixed(0)}`;

  // Зум и панорамирование
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.6));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  const handleDownloadDxf = () => {
    const dxfString = generateDxfContent(result);
    downloadDxfFile('gabaritny-chertezh.dxf', dxfString);
  };

  const handleDownloadPdf = () => {
    if (!containerRef.current || isDownloadingPdf) return;
    const svgElem = containerRef.current.querySelector('svg');
    if (!svgElem) {
      window.print();
      return;
    }

    setIsDownloadingPdf(true);

    try {
      // Клонируем SVG и сбрасываем интерактивный zoom/pan для экспорта эталонного листа А4
      const clonedSvg = svgElem.cloneNode(true) as SVGSVGElement;
      clonedSvg.style.transform = '';
      clonedSvg.style.transformOrigin = '';
      clonedSvg.setAttribute('width', `${sheetWidth}`);
      clonedSvg.setAttribute('height', `${sheetHeight}`);

      const serializer = new XMLSerializer();
      const svgXml = serializer.serializeToString(clonedSvg);
      const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = sheetWidth;
          canvas.height = sheetHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // Создаем 1-страничный PDF документ формата А4 в альбомной ориентации (297x210 мм)
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4',
            });

            pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
            pdf.save('gabaritny-chertezh-a4.pdf');
          }
        } catch (err) {
          console.error('PDF export error:', err);
          window.print();
        } finally {
          URL.revokeObjectURL(url);
          setIsDownloadingPdf(false);
        }
      };

      img.onerror = (err) => {
        console.error('Image render error for PDF:', err);
        URL.revokeObjectURL(url);
        setIsDownloadingPdf(false);
        window.print();
      };

      img.src = url;
    } catch (e) {
      console.error('PDF generation error:', e);
      setIsDownloadingPdf(false);
      window.print();
    }
  };

  // Координаты основных видов
  const frontX0 = frontCenterX - sL / 2;
  const sideX0 = sideCenterX - sW / 2;

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
      {/* Верхняя панель инструментов */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#0b3d66]" />
            Лист А4 (ГОСТ 2.301) — {gostScaleText}
          </span>

          <div className="hidden sm:inline-flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDimMode('both')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                dimMode === 'both' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              H, B, L + мм
            </button>
            <button
              type="button"
              onClick={() => setDimMode('letters')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                dimMode === 'letters' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              H, B, L
            </button>
            <button
              type="button"
              onClick={() => setDimMode('values')}
              className={`px-2 py-0.5 rounded-md transition-all ${
                dimMode === 'values' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Только мм
            </button>
          </div>
        </div>

        {/* Зум и экспорт */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Приблизить"
            className="p-1.5 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Отдалить"
            className="p-1.5 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="По размеру А4"
            className="p-1.5 text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-300 mx-1" />

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            title="Скачать чертеж в PDF (1 страница, лист А4 ГОСТ 2.301-68)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0b3d66]" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span>Скачать в PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadDxf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#0b3d66] hover:bg-[#072640] rounded-lg shadow-sm transition-colors border border-[#0b3d66] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#e6a417]" />
            Скачать DXF
          </button>
        </div>
      </div>

      {/* Инженерный холст А4 (297x210 мм) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-full aspect-[297/210] max-h-[660px] sm:max-h-[760px] bg-slate-200 p-2 sm:p-3 flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
      >
        <svg
          viewBox={`0 0 ${sheetWidth} ${sheetHeight}`}
          className="w-full h-full shadow-2xl bg-white"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.12s ease-out',
          }}
        >
          <defs>
            {/* Острая инженерная стрелка ЕСКД (1:3 по ГОСТ 2.307) */}
            <marker
              id="gostArrowA4"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 10 5 L 0 8 z" fill="#000000" />
            </marker>
          </defs>

          {/* 1. БЕЛЫЙ ЛИСТ БУМАГИ А4 (297 x 210 мм) */}
          <rect width={sheetWidth} height={sheetHeight} fill="#FFFFFF" />

          {/* 2. РАМКА ПО ГОСТ 2.104 (20 мм слева, 5 мм с остальных сторон) */}
          <rect
            x={frameLeft}
            y={frameTop}
            width={frameWidth}
            height={frameHeight}
            fill="none"
            stroke="#000000"
            strokeWidth="3.2"
          />

          {/* ШТАМП ТЕХНИЧЕСКОЙ НЕРЕАЛИЗУЕМОСТИ ПО ГОСТ (ПРИ НАЛИЧИИ НЕСООТВЕТСТВИЙ) */}
          {!feasibility.isFeasible && (
            <g
              dangerouslySetInnerHTML={{
                __html: SvgCadBuilder.renderFeasibilityAlert(
                  frameLeft + 40,
                  frameTop + 25,
                  frameWidth - 80,
                  155,
                  feasibility
                ),
              }}
            />
          )}

          {/* Единая линия земли/рельсов для Главного вида и Вида сбоку */}
          <line
            x1={frameLeft + 30}
            y1={groundY}
            x2={frameRight - 30}
            y2={groundY}
            stroke="#555555"
            strokeWidth="1.2"
            strokeDasharray="28, 8, 3, 8"
          />

          {/* Вертикальная проекционная связь Главного вида и Вида сверху */}
          <line
            x1={frontCenterX}
            y1={frameTop + 30}
            x2={frontCenterX}
            y2={topCenterY + sW / 2 + 130}
            stroke="#888888"
            strokeWidth="0.8"
            strokeDasharray="20, 6, 3, 6"
          />

          {/* ========================================================================= */}
          {/* 1. ГЛАВНЫЙ ВИД (FRONT VIEW / ELEVATION) — ВЫСОТА H                         */}
          {/* ========================================================================= */}
          <g id="FRONT_VIEW" transform={`translate(${frontX0}, ${groundY})`}>
            {/* Основание, тележка и двухребордные катки на рельсах */}
            <g
              dangerouslySetInnerHTML={{
                __html: SvgCadBuilder.renderUndercarriage(sL * 0.22, sL * 0.78, sL, 0),
              }}
            />

            {/* Отрисовка трансформатора: Масляный (бак + радиаторы + лестница) или Сухой (литые катушки / кожух) */}
            {isOil ? (
              <>
                {/* Корпус бака с ребрами, поясами, крюками, люками и шкафом ШАОТ */}
                <g
                  dangerouslySetInnerHTML={{
                    __html: SvgCadBuilder.renderTankFront(sL, sH, isOil, req.powerKva),
                  }}
                />

                {/* Лестница обслуживания слева */}
                <g
                  dangerouslySetInnerHTML={{
                    __html: SvgCadBuilder.renderLadder(18, -sH - 10, sH + 10, 18),
                  }}
                />

                {/* Радиаторная батарея справа по тепловому расчету с вентиляторами 2ДМ-450 */}
                <g
                  dangerouslySetInnerHTML={{
                    __html: SvgCadBuilder.renderRadiatorFront(
                      sL + 12,
                      -sH + 20,
                      sRadW,
                      sRadH,
                      radsCountFront,
                      hasFans,
                      fanSpec
                    ),
                  }}
                />
              </>
            ) : (
              /* Сухой трансформатор (литые фазы A, B, C с охлаждающими каналами или защитный кожух IP21/31) */
              <g
                dangerouslySetInnerHTML={{
                  __html: SvgCadBuilder.renderDryTransformerFront(
                    sL,
                    sH,
                    isEnclosedDry,
                    hasFans,
                    req.powerKva,
                    windingMaterial
                  ),
                }}
              />
            )}

            {/* Вводы в зависимости от конфигурации обмоток (двухобмоточный / трехобмоточный / расщепленный) */}
            {windingConfig === 'three_winding' ? (
              <>
                {/* 1. Вводы ВН (A, B, C) */}
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.26, -sH - 10, sBhHv, skirtsCount, -12) }} />
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.40, -sH - 10, sBhHv, skirtsCount, 0) }} />
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.54, -sH - 10, sBhHv, skirtsCount, 12) }} />

                {/* 2. Вводы СН (Am, Bm, Cm) — промежуточный класс изоляции */}
                {['Am', 'Bm', 'Cm'].map((label, idx) => (
                  <g
                    key={`mv-front-${label}`}
                    dangerouslySetInnerHTML={{
                      __html: SvgCadBuilder.renderMvBushingFront(
                        sL * (0.70 + idx * 0.10),
                        -sH - 10,
                        sBhMv || sBhHv * 0.68,
                        label
                      ),
                    }}
                  />
                ))}

                {/* 3. Вводы НН (0, a, b, c) */}
                {['0', 'a', 'b', 'c'].map((label, idx) => (
                  <g
                    key={`lv-front-${label}`}
                    dangerouslySetInnerHTML={{
                      __html: SvgCadBuilder.renderLvBushingFront(
                        sL * (0.10 + idx * 0.07),
                        -sH - 10,
                        sBhLv,
                        label
                      ),
                    }}
                  />
                ))}
              </>
            ) : windingConfig === 'split_winding' ? (
              <>
                {/* Вводы ВН (A, B, C) */}
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.35, -sH - 10, sBhHv, skirtsCount, -12) }} />
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.52, -sH - 10, sBhHv, skirtsCount, 0) }} />
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.69, -sH - 10, sBhHv, skirtsCount, 12) }} />

                {/* Вводы группы НН1 (01, a1, b1, c1) — левая ветвь расщепления */}
                {['01', 'a1', 'b1', 'c1'].map((label, idx) => (
                  <g
                    key={`lv1-front-${label}`}
                    dangerouslySetInnerHTML={{
                      __html: SvgCadBuilder.renderLvBushingFront(
                        sL * (0.14 + idx * 0.07),
                        -sH - 10,
                        sBhLv,
                        label
                      ),
                    }}
                  />
                ))}

                {/* Вводы группы НН2 (02, a2, b2, c2) — правая ветвь расщепления */}
                {['02', 'a2', 'b2', 'c2'].map((label, idx) => (
                  <g
                    key={`lv2-front-${label}`}
                    dangerouslySetInnerHTML={{
                      __html: SvgCadBuilder.renderLvBushingFront(
                        sL * (0.54 + idx * 0.07),
                        -sH - 10,
                        sBhLv,
                        label
                      ),
                    }}
                  />
                ))}
              </>
            ) : (
              <>
                {/* Стандартный двухобмоточный: 3 ввода ВН + 4 ввода НН */}
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.35, -sH - 10, sBhHv, skirtsCount, -12) }} />
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.52, -sH - 10, sBhHv, skirtsCount, 0) }} />
                <g dangerouslySetInnerHTML={{ __html: SvgCadBuilder.renderHvBushingFront(sL * 0.69, -sH - 10, sBhHv, skirtsCount, 12) }} />

                {['0', 'a', 'b', 'c'].map((label, idx) => (
                  <g
                    key={`lv-front-${label}`}
                    dangerouslySetInnerHTML={{
                      __html: SvgCadBuilder.renderLvBushingFront(
                        sL * (0.24 + idx * 0.16),
                        -sH - 10,
                        sBhLv,
                        label
                      ),
                    }}
                  />
                ))}
              </>
            )}

            {/* Расширительный бак с маслоуказателем, реле Бухгольца и воздухоосушителем */}
            {isOil && (
              <g
                dangerouslySetInnerHTML={{
                  __html: SvgCadBuilder.renderConservatorFront(-38, -sH - 10, sConsD, -sH - 10, sH),
                }}
              />
            )}

            {/* РАЗМЕРНАЯ ЛИНИЯ ВЫСОТЫ H СЛЕВА */}
            <g
              dangerouslySetInnerHTML={{
                __html: SvgCadBuilder.renderDimension(-80, 0, -80, -sTotH, -40, dimTextH, 'vertical'),
              }}
            />
          </g>

          {/* ========================================================================= */}
          {/* 2. ВИД СБОКУ (SIDE VIEW / PROFILE) — ШИРИНА B                              */}
          {/* ========================================================================= */}
          <g id="SIDE_VIEW" transform={`translate(${sideX0}, ${groundY})`}>
            {/* Основание и катки в профиль по колее (1524 / 2000 мм) */}
            <g
              dangerouslySetInnerHTML={{
                __html: SvgCadBuilder.renderUndercarriage(
                  (sW - sGauge) / 2,
                  (sW + sGauge) / 2,
                  sW,
                  0
                ),
              }}
            />

            {isOil ? (
              <>
                {/* Корпус бака в профиль */}
                <rect x="0" y={-sH} width={sW} height={sH} fill="#FFFFFF" stroke="#000000" strokeWidth="2.6" />
                <rect x="-10" y={-sH - 10} width={sW + 20} height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const bx = -6 + (i * (sW + 12)) / 11;
                  return <circle key={`sb-${i}`} cx={bx} cy={-sH - 5} r="1.6" fill="#000000" />;
                })}

                {/* Пояса жесткости стенки бака */}
                <rect x="0" y={-sH + sH * 0.32} width={sW} height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.6" />
                <rect x="0" y={-sH + sH * 0.68} width={sW} height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.6" />
                <line x1={sW / 2} y1={-sH} x2={sW / 2} y2="0" stroke="#000000" strokeWidth="1.4" />

                {/* Нижний люк обслуживания и пробоотборник в профиль */}
                <circle cx={sW / 2} cy="-42" r="16" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
                <circle cx={sW / 2} cy="-42" r="12" fill="none" stroke="#000000" strokeWidth="0.9" stroke-dasharray="6,3" />
                <circle cx={sW / 2} cy="-42" r="2.5" fill="#000000" />

                {/* Расширитель в профиль (горизонтальный цилиндр на стойках) */}
                <g
                  dangerouslySetInnerHTML={{
                    __html: SvgCadBuilder.renderConservatorSide(
                      (sW - sConsL) / 2,
                      -sH - 10,
                      sConsL,
                      sConsD
                    ),
                  }}
                />

                {/* Радиаторная батарея справа в профиль по теплосъему с нижними вентиляторами */}
                <g
                  dangerouslySetInnerHTML={{
                    __html: SvgCadBuilder.renderRadiatorSide(
                      sW + 10,
                      -sH + 20,
                      sRadDepth,
                      sRadH,
                      hasFans,
                      fanSpec
                    ),
                  }}
                />
              </>
            ) : (
              /* Сухой трансформатор в профиль (литая катушка + ярмо или кожух) */
              <g
                dangerouslySetInnerHTML={{
                  __html: SvgCadBuilder.renderDryTransformerSide(
                    sW,
                    sH,
                    isEnclosedDry,
                    hasFans
                  ),
                }}
              />
            )}

            {/* Вводы в профиль со смещением по глубине крышки */}
            {windingConfig === 'three_winding' ? (
              <>
                {/* Ввод ВН (задний ряд) */}
                <g transform={`translate(${sW * 0.78}, ${-sH - 10})`}>
                  <polygon points="-8,0 8,0 6,-18 -6,-18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                  <rect x="-4" y={-sBhHv - 18} width="8" height={sBhHv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <rect x="-3" y={-sBhHv - 32} width="6" height="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <line x1="0" y1={-sBhHv - 42} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
                {/* Ввод СН (средний ряд) */}
                <g transform={`translate(${sW * 0.50}, ${-sH - 10})`}>
                  <polygon points="-7,0 7,0 5,-14 -5,-14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <rect x="-3.5" y={-(sBhMv || sBhHv * 0.68) - 14} width="7" height={sBhMv || sBhHv * 0.68} fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                  <rect x="-2.5" y={-(sBhMv || sBhHv * 0.68) - 26} width="5" height="12" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                  <line x1="0" y1={-(sBhMv || sBhHv * 0.68) - 34} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
                {/* Ввод НН (передний ряд) */}
                <g transform={`translate(${sW * 0.22}, ${-sH - 10})`}>
                  <polygon points="-6,0 6,0 4.5,-12 -4.5,-12" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                  <rect x="-3" y={-sBhLv - 12} width="6" height={sBhLv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <rect x="-2" y={-sBhLv - 22} width="4" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <line x1="0" y1={-sBhLv - 32} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
              </>
            ) : windingConfig === 'split_winding' ? (
              <>
                {/* Ввод ВН (сзади) */}
                <g transform={`translate(${sW * 0.72}, ${-sH - 10})`}>
                  <polygon points="-8,0 8,0 6,-18 -6,-18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                  <rect x="-4" y={-sBhHv - 18} width="8" height={sBhHv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <rect x="-3" y={-sBhHv - 32} width="6" height="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <line x1="0" y1={-sBhHv - 42} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
                {/* Вводы НН1 и НН2 в профиль */}
                <g transform={`translate(${sW * 0.36}, ${-sH - 10})`}>
                  <polygon points="-7,0 7,0 5,-12 -5,-12" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                  <rect x="-3.5" y={-sBhLv - 12} width="7" height={sBhLv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <rect x="-2" y={-sBhLv - 22} width="4" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <line x1="0" y1={-sBhLv - 32} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
                <g transform={`translate(${sW * 0.20}, ${-sH - 10})`}>
                  <polygon points="-7,0 7,0 5,-12 -5,-12" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                  <rect x="-3.5" y={-sBhLv - 12} width="7" height={sBhLv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <rect x="-2" y={-sBhLv - 22} width="4" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <line x1="0" y1={-sBhLv - 32} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
              </>
            ) : (
              <>
                <g transform={`translate(${sW * 0.68}, ${-sH - 10})`}>
                  <polygon points="-8,0 8,0 6,-18 -6,-18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                  <rect x="-4" y={-sBhHv - 18} width="8" height={sBhHv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <rect x="-3" y={-sBhHv - 32} width="6" height="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                  <line x1="0" y1={-sBhHv - 42} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>

                <g transform={`translate(${sW * 0.32}, ${-sH - 10})`}>
                  <polygon points="-7,0 7,0 5,-12 -5,-12" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                  <rect x="-3.5" y={-sBhLv - 12} width="7" height={sBhLv} fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <rect x="-2" y={-sBhLv - 22} width="4" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                  <line x1="0" y1={-sBhLv - 32} x2="0" y2="10" stroke="#444444" strokeWidth="0.7" strokeDasharray="10, 3, 2, 3" />
                </g>
              </>
            )}

            {/* РАЗМЕРНАЯ ЛИНИЯ ШИРИНЫ B СВЕРХУ */}
            <g
              dangerouslySetInnerHTML={{
                __html: SvgCadBuilder.renderDimension(
                  0,
                  -sTotH - 20,
                  sW + (isOil ? 45 : 0),
                  -sTotH - 20,
                  -50,
                  dimTextB,
                  'horizontal'
                ),
              }}
            />
          </g>

          {/* ========================================================================= */}
          {/* 3. ВИД СВЕРХУ (TOP VIEW / PLAN) — ДЛИНА L                                 */}
          {/* ========================================================================= */}
          <g id="TOP_VIEW" transform={`translate(${frontX0}, ${topCenterY})`}>
            {/* Осевые линии вида сверху */}
            <line x1="-80" y1="0" x2={sL + 80} y2="0" stroke="#555555" strokeWidth="1" strokeDasharray="20, 6, 3, 6" />
            <line x1={sL / 2} y1={-sW / 2 - 50} x2={sL / 2} y2={sW / 2 + 100} stroke="#555555" strokeWidth="1" strokeDasharray="20, 6, 3, 6" />

            {/* Крышка бака со скруглениями */}
            <rect
              x="0"
              y={-sW / 2}
              width={sL}
              height={sW}
              rx="16"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2.6"
            />
            {/* Внутренняя линия уплотнения фланца крышки */}
            <rect
              x="6"
              y={-sW / 2 + 6}
              width={sL - 12}
              height={sW - 12}
              rx="12"
              fill="none"
              stroke="#000000"
              strokeWidth="1"
            />

            {/* Болты фланца по всему периметру */}
            {Array.from({ length: 18 }).map((_, i) => (
              <React.Fragment key={`tbolt-${i}`}>
                <circle cx={10 + (i * (sL - 20)) / 17} cy={-sW / 2 + 8} r="1.8" fill="#000000" />
                <circle cx={10 + (i * (sL - 20)) / 17} cy={sW / 2 - 8} r="1.8" fill="#000000" />
              </React.Fragment>
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <React.Fragment key={`sbolt-${i}`}>
                <circle cx={8} cy={-sW / 2 + 18 + (i * (sW - 36)) / 7} r="1.8" fill="#000000" />
                <circle cx={sL - 8} cy={-sW / 2 + 18 + (i * (sW - 36)) / 7} r="1.8" fill="#000000" />
              </React.Fragment>
            ))}

            {/* Круглые смотровые люки на крышке */}
            <circle cx={sL * 0.35} cy="0" r="16" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
            <circle cx={sL * 0.35} cy="0" r="12" fill="none" stroke="#000000" strokeWidth="0.9" stroke-dasharray="6,3" />
            <circle cx={sL * 0.52} cy="0" r="16" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
            <circle cx={sL * 0.52} cy="0" r="12" fill="none" stroke="#000000" strokeWidth="0.9" stroke-dasharray="6,3" />

            {/* Предохранительный клапан / выхлопная труба с мембраной */}
            <g transform={`translate(${sL * 0.85}, ${-sW * 0.25})`}>
              <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.6" />
              <circle cx="0" cy="0" r="10" fill="none" stroke="#000000" strokeWidth="1" />
              <circle cx="0" cy="0" r="4" fill="#000000" />
            </g>

            {/* Привод переключателя ответвлений (РПН / ПБВ) на крышке */}
            <g transform={`translate(${sL * 0.16}, ${sW * 0.15})`}>
              <rect x="-12" y="-12" width="24" height="24" rx="3" fill="#FFFFFF" stroke="#000000" strokeWidth="1.6" />
              <circle cx="0" cy="0" r="7" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#000000" strokeWidth="1.8" />
            </g>

            {/* Вводы на крышке (вид сверху) по типам обмоток */}
            {windingConfig === 'three_winding' ? (
              <>
                {/* 1. Вводы ВН (A, B, C) на стороне ВН */}
                {[0, 1, 2].map((i) => {
                  const bx = sL * (0.28 + i * 0.20);
                  const by = sW * 0.26;
                  return (
                    <g key={`hv-top-${i}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#000000" strokeWidth="0.9" strokeDasharray="8,4" />
                      {[0, 60, 120, 180, 240, 300].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        return <circle key={deg} cx={Math.cos(rad) * 18} cy={Math.sin(rad) * 18} r="1.4" fill="#000000" />;
                      })}
                      <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                      <circle cx="0" cy="0" r="9" fill="none" stroke="#000000" strokeWidth="1.1" />
                      <rect x="-7" y="-5" width="14" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="-3" cy="0" r="1.3" fill="#000000" />
                      <circle cx="3" cy="0" r="1.3" fill="#000000" />
                      <line x1="-28" y1="0" x2="28" y2="0" stroke="#444444" strokeWidth="0.7" strokeDasharray="8,3" />
                      <line x1="0" y1="-28" x2="0" y2="28" stroke="#444444" strokeWidth="0.7" strokeDasharray="8,3" />
                      <text x="0" y="38" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {i === 0 ? 'A' : i === 1 ? 'B' : 'C'}
                      </text>
                    </g>
                  );
                })}

                {/* 2. Вводы СН (Am, Bm, Cm) в среднем ряду крышки */}
                {['Am', 'Bm', 'Cm'].map((label, idx) => {
                  const bx = sL * (0.32 + idx * 0.18);
                  const by = 0;
                  return (
                    <g key={`mv-top-${label}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="17" fill="#FFFFFF" stroke="#000000" strokeWidth="1.6" />
                      <circle cx="0" cy="0" r="13" fill="none" stroke="#000000" strokeWidth="0.8" strokeDasharray="6,3" />
                      {[0, 90, 180, 270].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        return <circle key={deg} cx={Math.cos(rad) * 13} cy={Math.sin(rad) * 13} r="1.2" fill="#000000" />;
                      })}
                      <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#000000" strokeWidth="1.2" />
                      <circle cx="0" cy="0" r="7" fill="none" stroke="#000000" strokeWidth="0.9" />
                      <rect x="-6" y="-4" width="12" height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                      <line x1="-22" y1="0" x2="22" y2="0" stroke="#444444" strokeWidth="0.6" strokeDasharray="6,3" />
                      <line x1="0" y1="-22" x2="0" y2="22" stroke="#444444" strokeWidth="0.6" strokeDasharray="6,3" />
                      <text x="0" y="27" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* 3. Вводы НН (0, a, b, c) на стороне НН */}
                {['0', 'a', 'b', 'c'].map((label, idx) => {
                  const bx = sL * (0.24 + idx * 0.16);
                  const by = -sW * 0.26;
                  return (
                    <g key={`lv-top-${label}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="9" fill="none" stroke="#000000" strokeWidth="1" />
                      <rect x="-8" y="-4" width="16" height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                      <circle cx="-3" cy="0" r="1.2" fill="#000000" />
                      <circle cx="3" cy="0" r="1.2" fill="#000000" />
                      <text x="0" y="-18" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {label}
                      </text>
                    </g>
                  );
                })}
              </>
            ) : windingConfig === 'split_winding' ? (
              <>
                {/* 1. Вводы ВН (A, B, C) */}
                {[0, 1, 2].map((i) => {
                  const bx = sL * (0.34 + i * 0.17);
                  const by = sW * 0.24;
                  return (
                    <g key={`hv-top-split-${i}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#000000" strokeWidth="0.9" strokeDasharray="8,4" />
                      {[0, 60, 120, 180, 240, 300].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        return <circle key={deg} cx={Math.cos(rad) * 18} cy={Math.sin(rad) * 18} r="1.4" fill="#000000" />;
                      })}
                      <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                      <circle cx="0" cy="0" r="9" fill="none" stroke="#000000" strokeWidth="1.1" />
                      <rect x="-7" y="-5" width="14" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="-3" cy="0" r="1.3" fill="#000000" />
                      <circle cx="3" cy="0" r="1.3" fill="#000000" />
                      <line x1="-28" y1="0" x2="28" y2="0" stroke="#444444" strokeWidth="0.7" strokeDasharray="8,3" />
                      <line x1="0" y1="-28" x2="0" y2="28" stroke="#444444" strokeWidth="0.7" strokeDasharray="8,3" />
                      <text x="0" y="38" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {i === 0 ? 'A' : i === 1 ? 'B' : 'C'}
                      </text>
                    </g>
                  );
                })}

                {/* 2. Вводы НН1 (01, a1, b1, c1) — левая секция шин */}
                {['01', 'a1', 'b1', 'c1'].map((label, idx) => {
                  const bx = sL * (0.15 + idx * 0.08);
                  const by = -sW * 0.24;
                  return (
                    <g key={`lv1-top-${label}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="8" fill="none" stroke="#000000" strokeWidth="1" />
                      <rect x="-7" y="-4" width="14" height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                      <circle cx="-2.5" cy="0" r="1" fill="#000000" />
                      <circle cx="2.5" cy="0" r="1" fill="#000000" />
                      <text x="0" y="-17" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {label}
                      </text>
                    </g>
                  );
                })}

                {/* 3. Вводы НН2 (02, a2, b2, c2) — правая секция шин */}
                {['02', 'a2', 'b2', 'c2'].map((label, idx) => {
                  const bx = sL * (0.55 + idx * 0.08);
                  const by = -sW * 0.24;
                  return (
                    <g key={`lv2-top-${label}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="13" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="8" fill="none" stroke="#000000" strokeWidth="1" />
                      <rect x="-7" y="-4" width="14" height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                      <circle cx="-2.5" cy="0" r="1" fill="#000000" />
                      <circle cx="2.5" cy="0" r="1" fill="#000000" />
                      <text x="0" y="-17" textAnchor="middle" fontSize="11" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {label}
                      </text>
                    </g>
                  );
                })}
              </>
            ) : (
              <>
                {/* 3 ввода ВН (круговые фланцы, концентрические юбки, контактные лопатки) */}
                {[0, 1, 2].map((i) => {
                  const bx = sL * (0.35 + i * 0.17);
                  const by = sW * 0.22;
                  return (
                    <g key={`hv-top-${i}`} transform={`translate(${bx}, ${by})`}>
                      {/* Фланец турели */}
                      <circle cx="0" cy="0" r="22" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />
                      <circle cx="0" cy="0" r="18" fill="none" stroke="#000000" strokeWidth="0.9" strokeDasharray="8,4" />
                      {/* Болты фланца */}
                      {[0, 60, 120, 180, 240, 300].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        return (
                          <circle
                            key={deg}
                            cx={Math.cos(rad) * 18}
                            cy={Math.sin(rad) * 18}
                            r="1.4"
                            fill="#000000"
                          />
                        );
                      })}
                      {/* Юбки изолятора */}
                      <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.3" />
                      <circle cx="0" cy="0" r="9" fill="none" stroke="#000000" strokeWidth="1.1" />
                      {/* Контактная лопатка с отверстиями */}
                      <rect x="-7" y="-5" width="14" height="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="-3" cy="0" r="1.3" fill="#000000" />
                      <circle cx="3" cy="0" r="1.3" fill="#000000" />
                      {/* Осевые перекрестия */}
                      <line x1="-28" y1="0" x2="28" y2="0" stroke="#444444" strokeWidth="0.7" strokeDasharray="8,3" />
                      <line x1="0" y1="-28" x2="0" y2="28" stroke="#444444" strokeWidth="0.7" strokeDasharray="8,3" />
                      <text x="0" y="38" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {i === 0 ? 'A' : i === 1 ? 'B' : 'C'}
                      </text>
                    </g>
                  );
                })}

                {/* 4 ввода НН (0, a, b, c) */}
                {['0', 'a', 'b', 'c'].map((label, idx) => {
                  const bx = sL * (0.24 + idx * 0.16);
                  const by = -sW * 0.24;
                  return (
                    <g key={`lv-top-${label}`} transform={`translate(${bx}, ${by})`}>
                      <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="9" fill="none" stroke="#000000" strokeWidth="1" />
                      <rect x="-8" y="-4" width="16" height="8" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                      <circle cx="-3" cy="0" r="1.2" fill="#000000" />
                      <circle cx="3" cy="0" r="1.2" fill="#000000" />
                      <text x="0" y="-18" textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                        {label}
                      </text>
                    </g>
                  );
                })}
              </>
            )}

            {/* Расширитель слева (вид сверху) */}
            {isOil && (
              <g transform="translate(-40, 0)">
                <line x1="0" y1={-sConsL * 0.28} x2="40" y2={-sConsL * 0.28} stroke="#000000" strokeWidth="2.2" />
                <line x1="0" y1={sConsL * 0.28} x2="40" y2={sConsL * 0.28} stroke="#000000" strokeWidth="2.2" />
                {/* Корпус расширителя */}
                <rect
                  x={-sConsD / 2}
                  y={-sConsL / 2}
                  width={sConsD}
                  height={sConsL}
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#000000"
                  strokeWidth="2.6"
                />
                <circle cx="0" cy="0" r="10" fill="#FFFFFF" stroke="#000000" strokeWidth="1.4" />
                <line x1="-sConsD / 2" y1="0" x2="40" y2="0" stroke="#000000" strokeWidth="2.6" />
                {/* Реле Бухгольца на маслопроводе */}
                <rect x="12" y="-9" width="18" height="18" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
                <circle cx="21" cy="0" r="4" fill="#000000" />
              </g>
            )}

            {/* Верхняя площадка лестницы слева */}
            <rect x="8" y={-sW / 2 - 16} width="22" height="16" fill="#FFFFFF" stroke="#000000" strokeWidth="1.6" />
            <line x1="8" y1={-sW / 2 - 8} x2="30" y2={-sW / 2 - 8} stroke="#000000" strokeWidth="1.2" />

            {/* Шкаф управления снизу (вид сверху) */}
            <rect x={sL * 0.28} y={sW / 2} width={sL * 0.36} height="16" fill="#FFFFFF" stroke="#000000" strokeWidth="1.8" />

            {/* Радиаторные батареи по тепловому расчету (вид сверху с диффузорами вентиляторов) */}
            {isOil && (
              <g
                dangerouslySetInnerHTML={{
                  __html: SvgCadBuilder.renderRadiatorTop(
                    sL * 0.60,
                    sW / 2 + 14,
                    Math.max(2, Math.min(6, radsCountTop || 2)),
                    sRadW,
                    sRadDepth,
                    hasFans,
                    fanSpec
                  ),
                }}
              />
            )}

            {/* РАЗМЕРНАЯ ЛИНИЯ ДЛИНЫ L СНИЗУ */}
            <g
              dangerouslySetInnerHTML={{
                __html: SvgCadBuilder.renderDimension(
                  -40 - sConsD / 2,
                  sW / 2 + 85,
                  sL + (isOil ? 25 : 0),
                  sW / 2 + 85,
                  50,
                  dimTextL,
                  'horizontal'
                ),
              }}
            />
          </g>

          {/* ========================================================================= */}
          {/* 4. ТАБЛИЦА СОСТАВНЫХ ЧАСТЕЙ (СПЕЦИФИКАЦИЯ ОБОРУДОВАНИЯ ПО ГОСТ 2.106)      */}
          {/* ========================================================================= */}
          <g id="SPECIFICATION_TABLE" transform={`translate(${tbX}, 1090)`}>
            <rect x="0" y="0" width={tbW} height="350" fill="#FFFFFF" stroke="#000000" strokeWidth="2.2" />
            <rect x="0" y="0" width={tbW} height="35" fill="#F1F5F9" stroke="#000000" strokeWidth="1.5" />
            <text x={tbW / 2} y="24" textAnchor="middle" fontSize="17" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
              СПЕЦИФИКАЦИЯ ОСНОВНЫХ СБОРОЧНЫХ ЕДИНИЦ (ПО ГОСТ 2.106)
            </text>

            {/* Заголовки колонок */}
            <line x1="0" y1="65" x2={tbW} y2="65" stroke="#000000" strokeWidth="1.5" />
            <line x1="70" y1="35" x2="70" y2="350" stroke="#000000" strokeWidth="1.2" />
            <line x1="560" y1="35" x2="560" y2="350" stroke="#000000" strokeWidth="1.2" />
            <line x1="680" y1="35" x2="680" y2="350" stroke="#000000" strokeWidth="1.2" />

            <text x="35" y="52" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif" fill="#000000">Поз.</text>
            <text x="90" y="52" fontSize="14" fontWeight="bold" fontFamily="sans-serif" fill="#000000">Наименование сборочной единицы</text>
            <text x="620" y="52" textAnchor="middle" fontSize="14" fontWeight="bold" fontFamily="sans-serif" fill="#000000">Кол.</text>
            <text x="705" y="52" fontSize="14" fontWeight="bold" fontFamily="sans-serif" fill="#000000">Техническая характеристика</text>

            {/* Строки таблицы (1-10) с точными расчетными узлами теплосъема и вентиляторами */}
            {(isOil
              ? [
                  { pos: '1', name: 'Бак трансформатора с крышкой', qty: '1', note: 'Сварной, с поясами жесткости и крюками' },
                  { pos: '2', name: 'Расширитель с маслоуказателем МС-1', qty: '1', note: `Ø${(d.conservatorDiameterMm || 650)} мм, циферблат со стрелкой` },
                  { pos: '3', name: `Вводы ВН ${req.voltageHvKv} кВ на турелях`, qty: '3', note: 'Фарфор/композит, искровые рога, лапа' },
                  {
                    pos: '4',
                    name: windingConfig === 'three_winding' ? `Вводы СН ${req.voltageMvKv || 35} кВ` : windingConfig === 'split_winding' ? `Вводы НН1 и НН2 (${req.voltageLvKv} кВ)` : `Вводы НН ${req.voltageLvKv} кВ`,
                    qty: windingConfig === 'split_winding' ? '8' : windingConfig === 'three_winding' ? '3' : '4',
                    note: 'Медные шинные планки / лопатки'
                  },
                  {
                    pos: '5',
                    name: `Батарея радиаторов (${totalRads} шт., ${radiators?.elementsPerRadiator || 20} секц.)`,
                    qty: `${totalRads} шт.`,
                    note: `Q=${radiators?.actualHeatDissipationKw || '—'} кВт, запас +${radiators?.coolingReservePct || 10}%`
                  },
                  {
                    pos: '6',
                    name: hasFans ? `Вентиляторы обдува 2ДМ-450 (${fanSpec?.fanCount || 4} шт.)` : 'Естественное охлаждение (ONAN)',
                    qty: hasFans ? `${fanSpec?.fanCount || 4} шт.` : '—',
                    note: hasFans ? `Q=${fanSpec?.totalAirflowM3h?.toLocaleString('ru-RU') || '—'} м³/ч, N=${fanSpec?.totalFanPowerKw || 1.48} кВт` : 'Безвентиляторная конвекция'
                  },
                  { pos: '7', name: 'Газовое реле Бухгольца BF-80 (РЗТ)', qty: '1', note: 'Смотровое стекло, краны ДУ-80' },
                  { pos: '8', name: 'Воздухоосушитель силикагелевый ВС', qty: '1', note: 'С масляным гидрозатвором на стенке' },
                  { pos: '9', name: 'Шкаф автоматики и зажимов ШАОТ', qty: '1', note: 'IP54, клеммные ряды, двухстворчатый' },
                  { pos: '10', name: 'Каретки поворотных катков (ролики)', qty: '4', note: `Двухребордные, колея ${trackGaugeMm} мм` },
                ]
              : [
                  {
                    pos: '1',
                    name: isEnclosedDry ? `Защитный кожух ${enclosure || 'IP21'}` : 'Несущая рама магнитопровода IP00',
                    qty: '1 компл.',
                    note: isEnclosedDry ? 'Стальной съемный, вентиляционные жалюзи, смотровое окно' : 'Швеллеры ГОСТ 8240, стяжные изолированные шпильки'
                  },
                  { pos: '2', name: `Литые фазные обмотки (${windingMaterial === 'Cu' ? 'медь' : 'алюминий'})`, qty: '3 фазы', note: 'Класс нагревостойкости F (155°C), компаунд эпоксидный' },
                  { pos: '3', name: `Вводы ВН ${req.voltageHvKv} кВ с ПБВ`, qty: '3', note: 'Ступени регулирования ±2х2.5%, латунные перемычки' },
                  { pos: '4', name: `Ошиновка выводов НН ${req.voltageLvKv} кВ`, qty: windingConfig === 'split_winding' ? '8' : '4', note: 'Медные плоские шины с контактными отверстиями' },
                  {
                    pos: '5',
                    name: hasFans ? 'Тангенциальные вентиляторы AF (TG-60)' : 'Естественная конвекция (AN)',
                    qty: hasFans ? '2 блока' : '—',
                    note: hasFans ? 'Принудительный продув каналов обмоток снизу вверх' : 'Охлаждение окружающим воздухом'
                  },
                  { pos: '6', name: 'Микропроцессорный блок ТР-100', qty: '1', note: 'Датчики температуры PT100 в каждой фазе, цифровая индикация' },
                  { pos: '7', name: 'Магнитопровод стержневой шихтованный', qty: '1', note: 'Холоднокатаная сталь с низкими удельными потерями' },
                  { pos: '8', name: 'Поворотные каретки с катками', qty: '4', note: `Двухребордные ролики, колея ${trackGaugeMm} мм` },
                  { pos: '9', name: 'Болт заземления рамы ⏚', qty: '2', note: 'Медная бобышка М12 с контргайкой' },
                  { pos: '10', name: 'Табличка паспортная ГОСТ 52719', qty: '1', note: 'Нержавеющая сталь с лазерной гравировкой' },
                ]
            ).map((row, idx) => {
              const ry = 65 + idx * 28.5;
              return (
                <g key={row.pos}>
                  <line x1="0" y1={ry + 28.5} x2={tbW} y2={ry + 28.5} stroke="#CCCCCC" strokeWidth="0.8" />
                  <text x="35" y={ry + 19} textAnchor="middle" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{row.pos}</text>
                  <text x="85" y={ry + 19} fontSize="13" fontFamily="sans-serif" fill="#000000">{row.name}</text>
                  <text x="620" y={ry + 19} textAnchor="middle" fontSize="13" fontFamily="sans-serif" fill="#000000">{row.qty}</text>
                  <text x="705" y={ry + 19} fontSize="12" fontStyle="italic" fontFamily="sans-serif" fill="#333333">{row.note}</text>
                </g>
              );
            })}
          </g>

          {/* ========================================================================= */}
          {/* 5. ОСНОВНАЯ НАДПИСЬ ПО ГОСТ 2.104 (ШТАМП В ПРАВОМ НИЖНЕМ УГЛУ ЛИСТА А4)   */}
          {/* ========================================================================= */}
          <g id="TITLE_BLOCK_A4" transform={`translate(${tbX}, ${tbY})`}>
            {/* Границы штампа */}
            <rect x="0" y="0" width={tbW} height={tbH} fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />

            {/* Внутренние линии таблицы */}
            <line x1="0" y1="85" x2={tbW} y2="85" stroke="#000000" strokeWidth="2" />
            <line x1="0" y1="490" x2={tbW} y2="490" stroke="#000000" strokeWidth="1.8" />
            <line x1="610" y1="85" x2="610" y2="490" stroke="#000000" strokeWidth="1.5" />

            {/* Шапка таблицы ТТХ */}
            <text x={tbW / 2} y="52" textAnchor="middle" fontSize="24" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
              ГАБАРИТНЫЙ ЧЕРТЕЖ И ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ
            </text>

            {/* Левая колонка ТТХ */}
            <g transform="translate(25, 115)">
              <text x="0" y="0" fontSize="20" fontWeight="bold" fontFamily="sans-serif" fill="#000000">ЭЛЕКТРИЧЕСКИЕ ДАННЫЕ:</text>
              <text x="0" y="34" fontSize="18" fontFamily="sans-serif" fill="#000000">Мощность:</text>
              <text x="350" y="34" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${req.powerKva.toLocaleString('ru-RU')} кВА`}</text>

              <text x="0" y="68" fontSize="18" fontFamily="sans-serif" fill="#000000">
                {windingConfig === 'three_winding' ? 'Напряжения ВН/СН/НН:' : windingConfig === 'split_winding' ? 'Напряжения ВН/НН1/НН2:' : 'Напряжение ВН / НН:'}
              </text>
              <text x="350" y="68" fontSize={windingConfig === 'three_winding' ? 16 : 19} fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                {windingConfig === 'three_winding'
                  ? `${req.voltageHvKv} / ${req.voltageMvKv || 35} / ${req.voltageLvKv} кВ`
                  : windingConfig === 'split_winding'
                  ? `${req.voltageHvKv} / ${req.voltageLv1Kv || req.voltageLvKv}-${req.voltageLv2Kv || req.voltageLvKv} кВ`
                  : `${req.voltageHvKv} / ${req.voltageLvKv} кВ`}
              </text>

              <text x="0" y="102" fontSize="18" fontFamily="sans-serif" fill="#000000">
                {windingConfig === 'three_winding' ? 'Токи ВН / СН / НН:' : windingConfig === 'split_winding' ? 'Токи ВН / НН1 / НН2:' : 'Токи ВН / НН:'}
              </text>
              <text x="350" y="102" fontSize={windingConfig === 'three_winding' ? 16 : 19} fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                {windingConfig === 'three_winding'
                  ? `${result.electrical.currentHvA} / ${result.electrical.currentMvA || '—'} / ${result.electrical.currentLvA} А`
                  : windingConfig === 'split_winding'
                  ? `${result.electrical.currentHvA} / ${result.electrical.currentLv1A || (result.electrical.currentLvA / 2).toFixed(1)} / ${result.electrical.currentLv2A || (result.electrical.currentLvA / 2).toFixed(1)} А`
                  : `${result.electrical.currentHvA} / ${result.electrical.currentLvA} А`}
              </text>

              <text x="0" y="136" fontSize="18" fontFamily="sans-serif" fill="#000000">Напряжение КЗ uk:</text>
              <text x="350" y="136" fontSize={windingConfig === 'three_winding' ? 14 : windingConfig === 'split_winding' ? 14 : 19} fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                {windingConfig === 'three_winding'
                  ? `В-С:${result.electrical.ukHvMvPct}% В-Н:${result.electrical.ukHvLvPct}% С-Н:${result.electrical.ukMvLvPct}%`
                  : windingConfig === 'split_winding'
                  ? `скв:${result.electrical.ukThroughPct || result.electrical.ukPct}% ветвь:${result.electrical.ukBranchPct || (result.electrical.ukPct * 1.95).toFixed(1)}% (Кр=${result.electrical.splitCoefficient || 3.5})`
                  : `${result.electrical.ukPct} %`}
              </text>

              <text x="0" y="170" fontSize="18" fontFamily="sans-serif" fill="#000000">Потери ХХ / КЗ:</text>
              <text x="350" y="170" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${result.electrical.p0Kw} / ${result.electrical.pkKw} кВт`}</text>

              <text x="0" y="204" fontSize="18" fontFamily="sans-serif" fill="#000000">Обмотки / Схема:</text>
              <text x="350" y="204" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${req.windingMaterial === 'Cu' ? 'Медь' : 'Алюм'} / ${req.vectorGroup || 'YNd11'}`}</text>

              <text x="0" y="238" fontSize="18" fontFamily="sans-serif" fill="#000000">Охлаждение:</text>
              <text x="350" y="238" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{isOil ? (hasFans ? 'ONAF (Д - дутьевое)' : 'ONAN (М - естеств.)') : (req.dryCoolingType === 'AF' ? 'AF (с обдувом)' : 'AN (естеств.)')}</text>

              <text x="0" y="272" fontSize="18" fontFamily="sans-serif" fill="#000000">Исполнение:</text>
              <text x="350" y="272" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{isOil ? 'У1 (масло)' : `${req.enclosure || 'IP00'}, У3`}</text>

              <text x="0" y="306" fontSize="18" fontFamily="sans-serif" fill="#000000">Расчетный КПД:</text>
              <text x="350" y="306" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${result.electrical.efficiencyPct} %`}</text>

              <text x="0" y="340" fontSize="18" fontFamily="sans-serif" fill="#000000">Колея рельсового пути:</text>
              <text x="350" y="340" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${trackGaugeMm} мм`}</text>
            </g>

            {/* Правая колонка ТТХ */}
            <g transform="translate(640, 115)">
              <text x="0" y="0" fontSize="20" fontWeight="bold" fontFamily="sans-serif" fill="#000000">ГАБАРИТЫ И МАССА:</text>

              <text x="0" y="34" fontSize="18" fontFamily="sans-serif" fill="#000000">Бак (LxWxH):</text>
              <text x="290" y="34" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${L.toFixed(0)}x${W.toFixed(0)}x${H.toFixed(0)}`}</text>

              <text x="0" y="68" fontSize="18" fontFamily="sans-serif" fill="#000000">Полные (LxBxH):</text>
              <text x="250" y="68" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${d.overallLengthMm.toFixed(0)}x${d.overallWidthMm.toFixed(0)}x${d.overallHeightMm.toFixed(0)}`}</text>

              <text x="0" y="112" fontSize="18" fontFamily="sans-serif" fill="#000000">- Магнитопровод:</text>
              <text x="320" y="112" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${result.weights.coreKg.toLocaleString('ru-RU')} кг`}</text>

              <text x="0" y="146" fontSize="18" fontFamily="sans-serif" fill="#000000">- Обмотки:</text>
              <text x="320" y="146" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${result.weights.windingsKg.toLocaleString('ru-RU')} кг`}</text>

              {isOil && (
                <>
                  <text x="0" y="180" fontSize="18" fontFamily="sans-serif" fill="#000000">- Масло трансформаторное:</text>
                  <text x="320" y="180" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${result.weights.oilKg.toLocaleString('ru-RU')} кг`}</text>
                </>
              )}

              <text x="0" y="214" fontSize="18" fontFamily="sans-serif" fill="#000000">- Бак и арматура:</text>
              <text x="320" y="214" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${(result.weights.tankOrFrameKg + result.weights.accessoriesKg).toLocaleString('ru-RU')} кг`}</text>

              <text x="0" y="260" fontSize="22" fontWeight="bold" fontFamily="sans-serif" fill="#000000">ПОЛНАЯ МАССА:</text>
              <text x="320" y="260" fontSize="24" fontWeight="bold" fontFamily="sans-serif" fill="#000000">{`${result.weights.totalKg.toLocaleString('ru-RU')} кг`}</text>
            </g>

            {/* Подвал штампа */}
            <g transform="translate(25, 520)">
              <text x="0" y="0" fontSize="20" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                Завод-изготовитель: Hubei Onearth Trading Co., Ltd.
              </text>
              <text x="0" y="30" fontSize="16" fontFamily="sans-serif" fill="#444444">
                ГОСТ 52719-2007, ГОСТ 2.104, МЭК 60076 | Поставка: FCA Маньчжурия
              </text>

              <text x={tbW - 50} y="8" textAnchor="end" fontSize="21" fontWeight="bold" fontFamily="sans-serif" fill="#000000">
                {gostScaleText} | Лист 1 (1)
              </text>
              <text x={tbW - 50} y="32" textAnchor="end" fontSize="16" fontFamily="sans-serif" fill="#666666">
                Формат А4 (297х210 мм)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Информационная строка */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Параметрический САПР-движок: 3 ортогональные проекции с точной проекционной связью ЕСКД.
        </span>
        <span className="font-semibold text-slate-700">
          Формат А4 (297×210 мм) | Масштаб: {gostScaleText}
        </span>
      </div>
    </div>
  );
};
