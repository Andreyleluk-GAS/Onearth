import { TransformerCalculationResult } from './types';

class DxfWriter {
  private entities: string[] = [];
  private layers: [string, number][] = [
    ['0', 7],
    ['CONTOUR', 7],     // White/Black - основные сплошные линии
    ['DETAILS', 8],     // Gray - мелкие детали, решетки, болты
    ['RADIATORS', 3],   // Green - радиаторы охлаждения
    ['BUSHINGS', 1],    // Red - высоковольтные и низковольтные вводы
    ['CONSERVATOR', 4], // Cyan - расширительный бак и реле Бухгольца
    ['DIMENSIONS', 2],  // Yellow - размерные и выносные линии
    ['CENTERLINES', 5], // Blue - осевые штрихпунктирные линии
    ['TITLE_BLOCK', 7], // White/Black - штамп и спецификация
  ];

  addLine(x1: number, y1: number, x2: number, y2: number, layer = '0'): void {
    this.entities.push(
      `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(2)}\n20\n${y1.toFixed(2)}\n30\n0.0\n11\n${x2.toFixed(2)}\n21\n${y2.toFixed(2)}\n31\n0.0\n`
    );
  }

  addRect(x: number, y: number, w: number, h: number, layer = '0'): void {
    this.addLine(x, y, x + w, y, layer);
    this.addLine(x + w, y, x + w, y + h, layer);
    this.addLine(x + w, y + h, x, y + h, layer);
    this.addLine(x, y + h, x, y, layer);
  }

  addCircle(cx: number, cy: number, r: number, layer = '0'): void {
    this.entities.push(
      `0\nCIRCLE\n8\n${layer}\n10\n${cx.toFixed(2)}\n20\n${cy.toFixed(2)}\n30\n0.0\n40\n${r.toFixed(2)}\n`
    );
  }

  addText(x: number, y: number, text: string, height = 40.0, layer = 'TITLE_BLOCK'): void {
    const safeText = text.replace(/\n/g, ' ');
    this.entities.push(
      `0\nTEXT\n8\n${layer}\n10\n${x.toFixed(2)}\n20\n${y.toFixed(2)}\n30\n0.0\n40\n${height.toFixed(2)}\n1\n${safeText}\n`
    );
  }

  addDimLinear(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    offset: number,
    label: string,
    horizontal = true,
    textHeight = 65.0
  ): void {
    const layer = 'DIMENSIONS';
    if (horizontal) {
      const dy = offset;
      this.addLine(x1, y1, x1, y1 + dy, layer);
      this.addLine(x2, y2, x2, y2 + dy, layer);
      this.addLine(x1, y1 + dy * 0.85, x2, y2 + dy * 0.85, layer);
      // Стрелки на концах
      const arr = 35.0;
      this.addLine(x1, y1 + dy * 0.85, x1 + arr, y1 + dy * 0.85 + arr * 0.3, layer);
      this.addLine(x1, y1 + dy * 0.85, x1 + arr, y1 + dy * 0.85 - arr * 0.3, layer);
      this.addLine(x2, y2 + dy * 0.85, x2 - arr, y2 + dy * 0.85 + arr * 0.3, layer);
      this.addLine(x2, y2 + dy * 0.85, x2 - arr, y2 + dy * 0.85 - arr * 0.3, layer);

      const tx = (x1 + x2) / 2.0 - label.length * textHeight * 0.28;
      const ty = y1 + dy * 0.85 + textHeight * 0.35;
      this.addText(tx, ty, label, textHeight, layer);
    } else {
      const dx = offset;
      this.addLine(x1, y1, x1 + dx, y1, layer);
      this.addLine(x2, y2, x2 + dx, y2, layer);
      this.addLine(x1 + dx * 0.85, y1, x1 + dx * 0.85, y2, layer);
      // Стрелки на концах
      const arr = 35.0;
      this.addLine(x1 + dx * 0.85, y1, x1 + dx * 0.85 + arr * 0.3, y1 + arr, layer);
      this.addLine(x1 + dx * 0.85, y1, x1 + dx * 0.85 - arr * 0.3, y1 + arr, layer);
      this.addLine(x1 + dx * 0.85, y2, x1 + dx * 0.85 + arr * 0.3, y2 - arr, layer);
      this.addLine(x1 + dx * 0.85, y2, x1 + dx * 0.85 - arr * 0.3, y2 - arr, layer);

      const tx = x1 + dx * 0.85 - textHeight * 1.5;
      const ty = (y1 + y2) / 2.0;
      this.addText(tx, ty, label, textHeight, layer);
    }
  }

  toString(): string {
    const parts: string[] = [
      '0\nSECTION\n2\nHEADER\n0\nENDSEC\n',
      '0\nSECTION\n2\nTABLES\n0\nTABLE\n2\nLAYER\n70\n' + this.layers.length + '\n',
    ];

    for (const [name, color] of this.layers) {
      parts.push(
        `0\nLAYER\n2\n${name}\n70\n0\n62\n${color}\n6\nCONTINUOUS\n`
      );
    }

    parts.push('0\nENDTAB\n0\nENDSEC\n');
    parts.push('0\nSECTION\n2\nENTITIES\n');
    parts.push(this.entities.join(''));
    parts.push('0\nENDSEC\n0\nEOF\n');

    return parts.join('');
  }
}

export function generateDxfContent(result: TransformerCalculationResult): string {
  const dxf = new DxfWriter();
  const d = result.dimensions;
  const isOil = result.input.type === 'oil';
  const hasFans = isOil && result.input.oilCoolingType === 'ONAF';
  const L = d.lengthMm;
  const W = d.widthMm;
  const H = d.heightMm;
  const req = result.input;

  // Расположение видов:
  // 1. Главный вид (Front view): от (0, 0) до (L, H)
  // 2. Вид сбоку (Side view): от (sideX0, 0) до (sideX0 + W, H)
  // 3. Вид сверху (Top view): от (0, topY0) до (L, topY0 + W)
  const sideX0 = L + 1600.0;
  const gapY = Math.max(1600.0, W + 800.0);
  const topY0 = -(gapY + W);

  const bhHv = d.bushingHeightHvMm;
  const bhMv = d.bushingHeightMvMm || bhHv * 0.68;
  const bhLv = d.bushingHeightLvMm;
  const trackGauge = req.powerKva >= 10000 ? 2000.0 : 1524.0;
  const windingConfig = req.windingConfig || 'two_winding';

  // =========================================================================
  // 1. ГЛАВНЫЙ ВИД (FRONT VIEW) — ВЫСОТА H
  // =========================================================================
  // Корпус бака
  dxf.addRect(0.0, 0.0, L, H, 'CONTOUR');

  // Фланец крышки
  dxf.addRect(-50.0, H, L + 100.0, 40.0, 'CONTOUR');

  // Пояса жесткости бака
  dxf.addLine(0.0, H * 0.33, L, H * 0.33, 'DETAILS');
  dxf.addLine(0.0, H * 0.33 + 30.0, L, H * 0.33 + 30.0, 'DETAILS');
  dxf.addLine(0.0, H * 0.67, L, H * 0.67, 'DETAILS');
  dxf.addLine(0.0, H * 0.67 + 30.0, L, H * 0.67 + 30.0, 'DETAILS');

  // Опорные швеллеры и каретки с катками
  dxf.addRect(-30.0, -80.0, L + 60.0, 40.0, 'CONTOUR');
  // Катки
  const wheelR = 80.0;
  const w1X = L * 0.2;
  const w2X = L * 0.8;
  dxf.addCircle(w1X, -160.0, wheelR, 'CONTOUR');
  dxf.addCircle(w1X, -160.0, wheelR + 15.0, 'DETAILS');
  dxf.addCircle(w1X, -160.0, 25.0, 'DETAILS');
  dxf.addCircle(w2X, -160.0, wheelR, 'CONTOUR');
  dxf.addCircle(w2X, -160.0, wheelR + 15.0, 'DETAILS');
  dxf.addCircle(w2X, -160.0, 25.0, 'DETAILS');
  // Рельсы
  dxf.addRect(w1X - 100.0, -260.0, 200.0, 20.0, 'CONTOUR');
  dxf.addRect(w2X - 100.0, -260.0, 200.0, 20.0, 'CONTOUR');

  // Шкаф управления (ШАОТ) на стенке
  const cabW = Math.min(600.0, L * 0.35);
  const cabH = Math.min(800.0, H * 0.45);
  dxf.addRect(L * 0.28, H * 0.3, cabW, cabH, 'CONTOUR');
  dxf.addLine(L * 0.28 + cabW / 2.0, H * 0.3, L * 0.28 + cabW / 2.0, H * 0.3 + cabH, 'DETAILS');

  // Лестница слева
  dxf.addLine(-80.0, -40.0, -80.0, H + 40.0, 'CONTOUR');
  dxf.addLine(-160.0, -40.0, -160.0, H + 40.0, 'CONTOUR');
  for (let y = 0.0; y < H; y += 140.0) {
    dxf.addLine(-160.0, y, -80.0, y, 'DETAILS');
  }

  // Люки-лазы на стенке
  dxf.addCircle(L * 0.35, H * 0.82, 110.0, 'CONTOUR');
  dxf.addCircle(L * 0.35, H * 0.82, 85.0, 'DETAILS');
  dxf.addCircle(L * 0.52, H * 0.82, 110.0, 'CONTOUR');
  dxf.addCircle(L * 0.52, H * 0.82, 85.0, 'DETAILS');

  if (isOil) {
    // Радиаторы справа
    if (result.radiators) {
      const rads = result.radiators;
      const radHeight = Math.min(rads.panelHeightMm, H - 200.0);
      const radX = L + 120.0;
      const colW = rads.panelWidthMm * 0.45;

      const radCountFront = Math.max(2, Math.min(6, rads.radiatorsRight || Math.ceil(rads.totalRadiators / 2)));
      for (let c = 0; c < radCountFront; c++) {
        const cx = radX + c * (colW + 60.0);
        dxf.addRect(cx, 160.0, colW, radHeight, 'RADIATORS');
        // Ребра охлаждения
        for (let fx = cx + colW * 0.2; fx < cx + colW; fx += colW * 0.2) {
          dxf.addLine(fx, 180.0, fx, 160.0 + radHeight - 20.0, 'DETAILS');
        }
        // Вентиляторы обдува снизу при ONAF или опорные лапы при ONAN
        if (hasFans) {
          dxf.addRect(cx + 20.0, 80.0, colW - 40.0, 80.0, 'RADIATORS');
          dxf.addCircle(cx + colW / 2.0, 120.0, 30.0, 'RADIATORS');
        } else {
          dxf.addLine(cx + 20.0, 160.0, cx + colW - 20.0, 160.0, 'RADIATORS');
          dxf.addLine(cx + colW / 2.0, 160.0, cx + colW / 2.0, 100.0, 'RADIATORS');
          dxf.addLine(cx + colW / 2.0 - 30.0, 100.0, cx + colW / 2.0 + 30.0, 100.0, 'RADIATORS');
        }
      }

      // Коллекторы
      dxf.addLine(L, 220.0, radX + colW * radCountFront + 60.0, 220.0, 'RADIATORS');
      dxf.addLine(L, 160.0 + radHeight - 60.0, radX + colW * radCountFront + 60.0, 160.0 + radHeight - 60.0, 'RADIATORS');
    }

    // Расширитель (Conservator) слева
    const consD = d.conservatorDiameterMm || 650.0;
    const consR = consD / 2.0;
    const consCx = -240.0;
    const consCy = H + 300.0 + consR;
    dxf.addCircle(consCx, consCy, consR, 'CONSERVATOR');
    dxf.addCircle(consCx, consCy, consR - 30.0, 'DETAILS');
    dxf.addCircle(consCx, consCy, consR * 0.45, 'DETAILS');
    // Стойки крепления
    dxf.addLine(consCx, H + 40.0, consCx, consCy - consR, 'CONSERVATOR');
    dxf.addLine(consCx, consCy * 0.7, -60.0, H + 40.0, 'CONSERVATOR');
    // Маслопровод с реле Бухгольца
    dxf.addLine(consCx, consCy, 0.0, H + 40.0, 'CONSERVATOR');
    dxf.addRect(consCx * 0.5 - 50.0, H + 180.0, 100.0, 80.0, 'CONSERVATOR');
    // Воздухоосушитель вниз
    dxf.addLine(consCx - consR * 0.5, consCy, consCx - consR * 0.5, H * 0.3, 'CONSERVATOR');
    dxf.addRect(consCx - consR * 0.5 - 40.0, H * 0.3, 80.0, 260.0, 'CONSERVATOR');
  }

  // Вводы на крышке (Главный вид)
  const skirtsCount = req.voltageHvKv >= 110 ? 10 : req.voltageHvKv >= 35 ? 7 : 4;
  const skirtsCountMv = (req.voltageMvKv || 35) >= 35 ? 7 : 5;

  if (windingConfig === 'three_winding') {
    // 1. Вводы ВН (3 фазы)
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.26 + i * 0.14);
      const by = H + 40.0;
      dxf.addLine(bx - 60.0, by, bx - 40.0, by + 120.0, 'BUSHINGS');
      dxf.addLine(bx + 60.0, by, bx + 40.0, by + 120.0, 'BUSHINGS');
      dxf.addLine(bx - 40.0, by + 120.0, bx + 40.0, by + 120.0, 'BUSHINGS');
      dxf.addRect(bx - 20.0, by + 120.0, 40.0, bhHv, 'BUSHINGS');
      for (let s = 1; s <= skirtsCount; s++) {
        const sy = by + 120.0 + (s * bhHv) / (skirtsCount + 1);
        dxf.addLine(bx - 55.0, sy, bx + 55.0, sy, 'BUSHINGS');
      }
      dxf.addRect(bx - 25.0, by + 120.0 + bhHv, 50.0, 80.0, 'BUSHINGS');
      dxf.addLine(bx, by - 40.0, bx, by + 120.0 + bhHv + 140.0, 'CENTERLINES');
    }

    // 2. Вводы СН (Am, Bm, Cm)
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.70 + i * 0.10);
      const by = H + 40.0;
      dxf.addLine(bx - 45.0, by, bx - 30.0, by + 80.0, 'BUSHINGS');
      dxf.addLine(bx + 45.0, by, bx + 30.0, by + 80.0, 'BUSHINGS');
      dxf.addLine(bx - 30.0, by + 80.0, bx + 30.0, by + 80.0, 'BUSHINGS');
      dxf.addRect(bx - 16.0, by + 80.0, 32.0, bhMv, 'BUSHINGS');
      for (let s = 1; s <= skirtsCountMv; s++) {
        const sy = by + 80.0 + (s * bhMv) / (skirtsCountMv + 1);
        dxf.addLine(bx - 42.0, sy, bx + 42.0, sy, 'BUSHINGS');
      }
      dxf.addRect(bx - 20.0, by + 80.0 + bhMv, 40.0, 60.0, 'BUSHINGS');
      dxf.addLine(bx, by - 30.0, bx, by + 80.0 + bhMv + 100.0, 'CENTERLINES');
    }

    // 3. Вводы НН (0, a, b, c)
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.10 + i * 0.05);
      const by = H + 40.0;
      dxf.addRect(bx - 20.0, by, 40.0, bhLv, 'BUSHINGS');
      dxf.addLine(bx - 32.0, by + bhLv * 0.4, bx + 32.0, by + bhLv * 0.4, 'BUSHINGS');
      dxf.addLine(bx - 32.0, by + bhLv * 0.7, bx + 32.0, by + bhLv * 0.7, 'BUSHINGS');
      dxf.addRect(bx - 25.0, by + bhLv, 50.0, 60.0, 'BUSHINGS');
    }
  } else if (windingConfig === 'split_winding') {
    // Вводы ВН (3 фазы)
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.35 + i * 0.17);
      const by = H + 40.0;
      dxf.addLine(bx - 60.0, by, bx - 40.0, by + 120.0, 'BUSHINGS');
      dxf.addLine(bx + 60.0, by, bx + 40.0, by + 120.0, 'BUSHINGS');
      dxf.addLine(bx - 40.0, by + 120.0, bx + 40.0, by + 120.0, 'BUSHINGS');
      dxf.addRect(bx - 20.0, by + 120.0, 40.0, bhHv, 'BUSHINGS');
      for (let s = 1; s <= skirtsCount; s++) {
        const sy = by + 120.0 + (s * bhHv) / (skirtsCount + 1);
        dxf.addLine(bx - 55.0, sy, bx + 55.0, sy, 'BUSHINGS');
      }
      dxf.addRect(bx - 25.0, by + 120.0 + bhHv, 50.0, 80.0, 'BUSHINGS');
      dxf.addLine(bx, by - 40.0, bx, by + 120.0 + bhHv + 140.0, 'CENTERLINES');
    }

    // Вводы НН1 (4 фазы: 01, a1, b1, c1)
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.12 + i * 0.06);
      const by = H + 40.0;
      dxf.addRect(bx - 18.0, by, 36.0, bhLv, 'BUSHINGS');
      dxf.addLine(bx - 28.0, by + bhLv * 0.4, bx + 28.0, by + bhLv * 0.4, 'BUSHINGS');
      dxf.addLine(bx - 28.0, by + bhLv * 0.7, bx + 28.0, by + bhLv * 0.7, 'BUSHINGS');
      dxf.addRect(bx - 22.0, by + bhLv, 44.0, 60.0, 'BUSHINGS');
    }

    // Вводы НН2 (4 фазы: 02, a2, b2, c2)
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.64 + i * 0.06);
      const by = H + 40.0;
      dxf.addRect(bx - 18.0, by, 36.0, bhLv, 'BUSHINGS');
      dxf.addLine(bx - 28.0, by + bhLv * 0.4, bx + 28.0, by + bhLv * 0.4, 'BUSHINGS');
      dxf.addLine(bx - 28.0, by + bhLv * 0.7, bx + 28.0, by + bhLv * 0.7, 'BUSHINGS');
      dxf.addRect(bx - 22.0, by + bhLv, 44.0, 60.0, 'BUSHINGS');
    }
  } else {
    // Вводы ВН (3 фазы на наклонных турелях)
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.35 + i * 0.17);
      const by = H + 40.0;
      dxf.addLine(bx - 60.0, by, bx - 40.0, by + 120.0, 'BUSHINGS');
      dxf.addLine(bx + 60.0, by, bx + 40.0, by + 120.0, 'BUSHINGS');
      dxf.addLine(bx - 40.0, by + 120.0, bx + 40.0, by + 120.0, 'BUSHINGS');
      dxf.addRect(bx - 20.0, by + 120.0, 40.0, bhHv, 'BUSHINGS');
      for (let s = 1; s <= skirtsCount; s++) {
        const sy = by + 120.0 + (s * bhHv) / (skirtsCount + 1);
        dxf.addLine(bx - 55.0, sy, bx + 55.0, sy, 'BUSHINGS');
      }
      dxf.addRect(bx - 25.0, by + 120.0 + bhHv, 50.0, 80.0, 'BUSHINGS');
      dxf.addLine(bx, by - 40.0, bx, by + 120.0 + bhHv + 140.0, 'CENTERLINES');
    }

    // Вводы НН (4 фазы: 0, a, b, c)
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.24 + i * 0.16);
      const by = H + 40.0;
      dxf.addRect(bx - 25.0, by, 50.0, bhLv, 'BUSHINGS');
      dxf.addLine(bx - 40.0, by + bhLv * 0.4, bx + 40.0, by + bhLv * 0.4, 'BUSHINGS');
      dxf.addLine(bx - 40.0, by + bhLv * 0.7, bx + 40.0, by + bhLv * 0.7, 'BUSHINGS');
      dxf.addRect(bx - 30.0, by + bhLv, 60.0, 70.0, 'BUSHINGS');
    }
  }

  // Размерная линия высоты H
  dxf.addDimLinear(-380.0, -160.0, -380.0, d.overallHeightMm - 160.0, -250.0, `H = ${d.overallHeightMm.toFixed(0)} mm`, false);
  dxf.addText(0.0, H + bhHv + 350.0, '1. FRONT VIEW (ELEVATION) / ГЛАВНЫЙ ВИД', 85.0, 'TITLE_BLOCK');

  // =========================================================================
  // 2. ВИД СБОКУ (SIDE VIEW) — ШИРИНА B
  // =========================================================================
  dxf.addRect(sideX0, 0.0, W, H, 'CONTOUR');
  dxf.addRect(sideX0 - 40.0, H, W + 80.0, 40.0, 'CONTOUR');
  dxf.addLine(sideX0, H * 0.33, sideX0 + W, H * 0.33, 'DETAILS');
  dxf.addLine(sideX0, H * 0.67, sideX0 + W, H * 0.67, 'DETAILS');

  // Катки сбоку по колее
  const sW1 = sideX0 + (W - trackGauge) / 2.0;
  const sW2 = sideX0 + (W + trackGauge) / 2.0;
  dxf.addCircle(sW1, -160.0, wheelR, 'CONTOUR');
  dxf.addCircle(sW2, -160.0, wheelR, 'CONTOUR');
  dxf.addRect(sW1 - 100.0, -260.0, 200.0, 20.0, 'CONTOUR');
  dxf.addRect(sW2 - 100.0, -260.0, 200.0, 20.0, 'CONTOUR');

  // Расширитель в профиль (цилиндр с эллиптическими днищами)
  if (isOil) {
    const consL = d.conservatorLengthMm || 1500.0;
    const consD = d.conservatorDiameterMm || 650.0;
    const consY = H + 300.0;
    const consX = sideX0 + (W - consL) / 2.0;
    dxf.addRect(consX, consY, consL, consD, 'CONSERVATOR');
    dxf.addLine(consX + 180.0, H + 40.0, consX + 180.0, consY, 'CONSERVATOR');
    dxf.addLine(consX + consL - 180.0, H + 40.0, consX + consL - 180.0, consY, 'CONSERVATOR');
  }

  // Радиаторная батарея справа в профиль
  if (isOil) {
    dxf.addRect(sideX0 + W + 100.0, 160.0, 220.0, H - 200.0, 'RADIATORS');
    dxf.addLine(sideX0 + W, 220.0, sideX0 + W + 100.0, 220.0, 'RADIATORS');
    dxf.addLine(sideX0 + W, H - 100.0, sideX0 + W + 100.0, H - 100.0, 'RADIATORS');
    if (hasFans) {
      dxf.addRect(sideX0 + W + 120.0, 80.0, 180.0, 80.0, 'RADIATORS');
      dxf.addCircle(sideX0 + W + 210.0, 120.0, 25.0, 'RADIATORS');
    } else {
      dxf.addLine(sideX0 + W + 130.0, 160.0, sideX0 + W + 290.0, 160.0, 'RADIATORS');
      dxf.addLine(sideX0 + W + 210.0, 160.0, sideX0 + W + 210.0, 100.0, 'RADIATORS');
      dxf.addLine(sideX0 + W + 170.0, 100.0, sideX0 + W + 250.0, 100.0, 'RADIATORS');
    }
  }

  // Вводы со смещением по глубине
  if (windingConfig === 'three_winding') {
    dxf.addRect(sideX0 + W * 0.76 - 35.0, H + 40.0, 70.0, bhHv, 'BUSHINGS');
    dxf.addRect(sideX0 + W * 0.50 - 28.0, H + 40.0, 56.0, bhMv, 'BUSHINGS');
    dxf.addRect(sideX0 + W * 0.24 - 22.0, H + 40.0, 44.0, bhLv, 'BUSHINGS');
  } else {
    dxf.addRect(sideX0 + W * 0.68 - 35.0, H + 40.0, 70.0, bhHv, 'BUSHINGS');
    dxf.addRect(sideX0 + W * 0.32 - 25.0, H + 40.0, 50.0, bhLv, 'BUSHINGS');
  }

  // Размерная линия ширины B
  dxf.addDimLinear(sideX0, H + bhHv + 200.0, sideX0 + d.overallWidthMm, H + bhHv + 200.0, 320.0, `B = ${d.overallWidthMm.toFixed(0)} mm`, true);
  dxf.addText(sideX0, H + bhHv + 350.0, '2. SIDE VIEW (PROFILE) / ВИД СБОКУ', 85.0, 'TITLE_BLOCK');

  // =========================================================================
  // 3. ВИД СВЕРХУ (TOP VIEW / PLAN) — ДЛИНА L
  // =========================================================================
  dxf.addRect(0.0, topY0, L, W, 'CONTOUR');
  dxf.addLine(-300.0, topY0 + W / 2.0, L + 300.0, topY0 + W / 2.0, 'CENTERLINES');
  dxf.addLine(L / 2.0, topY0 - 300.0, L / 2.0, topY0 + W + 300.0, 'CENTERLINES');

  if (isOil) {
    const consL = d.conservatorLengthMm || 1500.0;
    const consD = d.conservatorDiameterMm || 650.0;
    dxf.addRect(-240.0 - consD / 2.0, topY0 + (W - consL) / 2.0, consD, consL, 'CONSERVATOR');
    dxf.addLine(0.0, topY0 + W / 2.0, -240.0, topY0 + W / 2.0, 'CONSERVATOR');

    if (result.radiators) {
      const rads = result.radiators;
      dxf.addRect(L * 0.65, topY0 - 240.0, rads.panelWidthMm * 1.5, 200.0, 'RADIATORS');
      if (hasFans) {
        dxf.addCircle(L * 0.65 + rads.panelWidthMm * 0.75, topY0 - 140.0, 75.0, 'RADIATORS');
      }
    }
  }

  // Вводы на крышке (Вид сверху)
  if (windingConfig === 'three_winding') {
    // 3 ввода ВН
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.28 + i * 0.20);
      const by = topY0 + W * 0.76;
      dxf.addCircle(bx, by, 85.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 50.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 15.0, 'BUSHINGS');
      dxf.addLine(bx - 100.0, by, bx + 100.0, by, 'CENTERLINES');
      dxf.addLine(bx, by - 100.0, bx, by + 100.0, 'CENTERLINES');
    }
    // 3 ввода СН
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.32 + i * 0.18);
      const by = topY0 + W * 0.50;
      dxf.addCircle(bx, by, 65.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 38.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 12.0, 'BUSHINGS');
      dxf.addLine(bx - 80.0, by, bx + 80.0, by, 'CENTERLINES');
      dxf.addLine(bx, by - 80.0, bx, by + 80.0, 'CENTERLINES');
    }
    // 4 ввода НН
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.24 + i * 0.16);
      const by = topY0 + W * 0.24;
      dxf.addCircle(bx, by, 45.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 14.0, 'BUSHINGS');
    }
  } else if (windingConfig === 'split_winding') {
    // 3 ввода ВН
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.34 + i * 0.17);
      const by = topY0 + W * 0.74;
      dxf.addCircle(bx, by, 85.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 50.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 15.0, 'BUSHINGS');
      dxf.addLine(bx - 100.0, by, bx + 100.0, by, 'CENTERLINES');
      dxf.addLine(bx, by - 100.0, bx, by + 100.0, 'CENTERLINES');
    }
    // 4 ввода НН1
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.15 + i * 0.08);
      const by = topY0 + W * 0.26;
      dxf.addCircle(bx, by, 42.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 12.0, 'BUSHINGS');
    }
    // 4 ввода НН2
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.55 + i * 0.08);
      const by = topY0 + W * 0.26;
      dxf.addCircle(bx, by, 42.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 12.0, 'BUSHINGS');
    }
  } else {
    // 3 ввода ВН сверху
    for (let i = 0; i < 3; i++) {
      const bx = L * (0.35 + i * 0.17);
      const by = topY0 + W * 0.72;
      dxf.addCircle(bx, by, 85.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 50.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 15.0, 'BUSHINGS');
      dxf.addLine(bx - 100.0, by, bx + 100.0, by, 'CENTERLINES');
      dxf.addLine(bx, by - 100.0, bx, by + 100.0, 'CENTERLINES');
    }

    // 4 ввода НН сверху
    for (let i = 0; i < 4; i++) {
      const bx = L * (0.24 + i * 0.16);
      const by = topY0 + W * 0.26;
      dxf.addCircle(bx, by, 50.0, 'BUSHINGS');
      dxf.addCircle(bx, by, 15.0, 'BUSHINGS');
    }
  }

  // Размерная линия длины L
  dxf.addDimLinear(-240.0 - (d.conservatorDiameterMm || 650.0) / 2.0, topY0 - 150.0, L + 200.0, topY0 - 150.0, -350.0, `L = ${d.overallLengthMm.toFixed(0)} mm`, true);
  dxf.addText(0.0, topY0 + W + 220.0, '3. TOP VIEW (PLAN) / ВИД СВЕРХУ', 85.0, 'TITLE_BLOCK');

  // =========================================================================
  // 4. ТАБЛИЦА ТТХ И ШТАМП ПО ГОСТ 2.104
  // =========================================================================
  const tbX = sideX0;
  const tbY = topY0;
  const tbW = 1400.0;
  const tbH = 1000.0;

  dxf.addRect(tbX, tbY, tbW, tbH, 'TITLE_BLOCK');
  dxf.addLine(tbX, tbY + tbH - 120.0, tbX + tbW, tbY + tbH - 120.0, 'TITLE_BLOCK');
  dxf.addText(tbX + 50.0, tbY + tbH - 80.0, 'ГАБАРИТНЫЙ ЧЕРТЕЖ И ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ', 55.0, 'TITLE_BLOCK');

  // Заполнение таблицы
  const specLines: [string, string][] = [
    ['Номинальная мощность:', `${req.powerKva} кВА`],
    [
      windingConfig === 'three_winding'
        ? 'Номинальное напряжение ВН/СН/НН:'
        : windingConfig === 'split_winding'
        ? 'Номинальное напряжение ВН/НН1-НН2:'
        : 'Номинальное напряжение ВН / НН:',
      windingConfig === 'three_winding'
        ? `${req.voltageHvKv} / ${req.voltageMvKv || 35} / ${req.voltageLvKv} кВ`
        : windingConfig === 'split_winding'
        ? `${req.voltageHvKv} / ${req.voltageLv1Kv || req.voltageLvKv}-${req.voltageLv2Kv || req.voltageLvKv} кВ`
        : `${req.voltageHvKv} / ${req.voltageLvKv} кВ`,
    ],
    [
      windingConfig === 'three_winding'
        ? 'Номинальный ток ВН/СН/НН:'
        : windingConfig === 'split_winding'
        ? 'Номинальный ток ВН/НН1/НН2:'
        : 'Номинальный ток ВН / НН:',
      windingConfig === 'three_winding'
        ? `${result.electrical.currentHvA} / ${result.electrical.currentMvA || '—'} / ${result.electrical.currentLvA} А`
        : windingConfig === 'split_winding'
        ? `${result.electrical.currentHvA} / ${result.electrical.currentLv1A || (result.electrical.currentLvA / 2).toFixed(1)} / ${result.electrical.currentLv2A || (result.electrical.currentLvA / 2).toFixed(1)} А`
        : `${result.electrical.currentHvA} / ${result.electrical.currentLvA} А`,
    ],
    [
      'Напряжение КЗ uk:',
      windingConfig === 'three_winding'
        ? `В-С:${result.electrical.ukHvMvPct}% В-Н:${result.electrical.ukHvLvPct}% С-Н:${result.electrical.ukMvLvPct}%`
        : windingConfig === 'split_winding'
        ? `скв:${result.electrical.ukThroughPct || result.electrical.ukPct}% ветвь:${result.electrical.ukBranchPct || (result.electrical.ukPct * 1.95).toFixed(1)}% (Кр=${result.electrical.splitCoefficient || 3.5})`
        : `${result.electrical.ukPct} %`,
    ],
    ['Потери холостого хода P0:', `${result.electrical.p0Kw} кВт`],
    ['Потери короткого замыкания Pk:', `${result.electrical.pkKw} кВт`],
    ['Масса активной части:', `${(result.weights.coreKg + result.weights.windingsKg).toFixed(0)} кг`],
    ['Масса трансформаторного масла:', `${result.weights.oilKg.toFixed(0)} кг`],
    ['Полная масса трансформатора:', `${result.weights.totalKg.toFixed(0)} кг`],
    ['Габариты полные (LxBxH):', `${d.overallLengthMm.toFixed(0)} x ${d.overallWidthMm.toFixed(0)} x ${d.overallHeightMm.toFixed(0)} мм`],
    ['Колея рельсового пути:', `${trackGauge.toFixed(0)} мм`],
    ['Завод-изготовитель:', 'Hubei Onearth Trading Co., Ltd. (ГОСТ 52719)'],
  ];

  let curY = tbY + tbH - 180.0;
  for (const [title, val] of specLines) {
    dxf.addText(tbX + 40.0, curY, title, 38.0, 'TITLE_BLOCK');
    dxf.addText(tbX + 780.0, curY, val, 40.0, 'TITLE_BLOCK');
    curY -= 65.0;
  }

  return dxf.toString();
}

export function downloadDxfFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/dxf;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
