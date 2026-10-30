import { useEffect, useRef } from "react";
import "../styles/template2.css";

export interface VercelMonolithProps {
  hoveredSide?: number | null;
  activeSide?: number | null;
}

/**
 * Direct optical reproduction of Vercel dark hero reference recording.
 * Supports:
 * 1. Moving white illumination (emphasizing left slope, right slope/apex, or base)
 * 2. Independent colored regions (pink/magenta left, blue/cyan right, mint/cyan/rose base, violet apex)
 * 3. Directional light spreading outward from active edges
 * 4. Selective edge highlights (active edge bright, inactive edges dim)
 * 5. Changing apex plume (dynamic tilt, shape, and strength)
 * 6. Smooth transitions across all states (pointer movement & capability hovers)
 */
export const MONOLITH_CONFIG = {
  // Triangle dimensions (matches reference 248x215)
  triangleWidth: 248,
  triangleHeight: 215,

  // Sized rendering area containing full diffusion with margin
  canvasWidth: 700,
  canvasHeight: 580,

  // Animation timing & easing factors
  enterLerpFactor: 0.08,
  exitLerpFactor: 0.065,
  pointerParallaxMaxX: 16,
  pointerParallaxMaxY: 12,

  // Capability mapping matching reference video 12-16s
  // Capability mapping matching reference video 12-16s
  capabilityStates: [
    {
      // Item 0: Business thinking -> Left slope magenta emphasis
      colorProgress: 1.0,
      leftIntensity: 1.0,
      rightIntensity: 0.035,
      bottomIntensity: 0.025,
      apexIntensity: 0.85,
      lightX: -10,
      lightY: -6,
    },
    {
      // Item 1: Applied engineering -> Right slope royal blue / cyan emphasis
      colorProgress: 1.0,
      leftIntensity: 0.035,
      rightIntensity: 1.0,
      bottomIntensity: 0.025,
      apexIntensity: 0.85,
      lightX: 14,
      lightY: 2,
    },
    {
      // Item 2: Team integration -> Base mint green / cyan / rose emphasis
      colorProgress: 1.0,
      leftIntensity: 0.04,
      rightIntensity: 0.04,
      bottomIntensity: 1.0,
      apexIntensity: 0.20,
      lightX: 0,
      lightY: 12,
    },
  ],

  // Neutral resting state (classic silver right slope emphasis)
  restingState: {
    colorProgress: 0.0,
    leftIntensity: 0.12,
    rightIntensity: 0.95,
    bottomIntensity: 0.15,
    apexIntensity: 0.70,
    lightX: 0.0,
    lightY: 0.0,
  },
};

/**
 * Shortest distance from point (px, py) to line segment (x1, y1)-(x2, y2)
 */
function distToSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/**
 * Check if point (px, py) is strictly inside triangle
 */
function isPointInTriangle(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): boolean {
  const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
  const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
  const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
}

export function VercelMonolith({
  hoveredSide = null,
  activeSide = null,
}: VercelMonolithProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);
  const isRunningRef = useRef<boolean>(false);
  const isPointerInsideRef = useRef<boolean>(false);
  const startLoopRef = useRef<() => void>(() => {});

  const effectiveCapabilityIdx = hoveredSide !== null ? hoveredSide : activeSide;
  const effectiveCapabilityIdxRef = useRef<number | null>(effectiveCapabilityIdx);

  const targetRef = useRef({ ...MONOLITH_CONFIG.restingState });
  const currentRef = useRef({ ...MONOLITH_CONFIG.restingState });

  // Effect 1: Initialize renderer once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const {
      canvasWidth,
      canvasHeight,
      triangleWidth,
      triangleHeight,
      enterLerpFactor,
      exitLerpFactor,
    } = MONOLITH_CONFIG;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;

    const apexX = cx;
    const apexY = cy - triangleHeight / 2; // (350, 182.5)
    const blX = cx - triangleWidth / 2;   // (226, 397.5)
    const blY = cy + triangleHeight / 2;
    const brX = cx + triangleWidth / 2;   // (474, 397.5)
    const brY = blY;

    // Outward unit normal vectors
    const normLX = -0.866025;
    const normLY = -0.500000;
    const normRX = 0.866025;
    const normRY = -0.500000;
    const normBX = 0.0;
    const normBY = 1.0;

    // Unit directions along slopes (from apex down)
    const lenS = Math.hypot(blX - apexX, blY - apexY);
    const uLX = (blX - apexX) / lenS;
    const uLY = (blY - apexY) / lenS;
    const uRX = (brX - apexX) / lenS;
    const uRY = (brY - apexY) / lenS;

    // Barely perceptible film grain / dither noise (~1.5% alpha)
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const nCtx = noiseCanvas.getContext("2d");
    if (nCtx) {
      const nImg = nCtx.createImageData(128, 128);
      for (let i = 0; i < nImg.data.length; i += 4) {
        const val = (Math.random() * 255) | 0;
        nImg.data[i] = val;
        nImg.data[i + 1] = val;
        nImg.data[i + 2] = val;
        nImg.data[i + 3] = 4; // ultra-low alpha, no visible canvas boundary
      }
      nCtx.putImageData(nImg, 0, 0);
    }
    const noisePattern = ctx.createPattern(noiseCanvas, "repeat");

    // Continuous Edge Wash helper: casts a smooth, directional light field outward from an edge
    const drawEdgeWash = (
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      nx: number,
      ny: number,
      ux: number,
      uy: number,
      colorRgb: [number, number, number],
      maxDist: number,
      baseAlpha: number,
      blurPx: number,
      extApex: number,
      extCorner: number
    ) => {
      if (baseAlpha <= 0.003) return;
      ctx.save();
      ctx.filter = `blur(${blurPx}px)`;

      const sx1 = p1x - ux * extApex;
      const sy1 = p1y - uy * extApex;
      const sx2 = p2x + ux * extCorner;
      const sy2 = p2y + uy * extCorner;

      const ox1 = sx1 + nx * maxDist;
      const oy1 = sy1 + ny * maxDist;
      const ox2 = sx2 + nx * maxDist;
      const oy2 = sy2 + ny * maxDist;

      const mx = (p1x + p2x) / 2;
      const my = (p1y + p2y) / 2;

      const grad = ctx.createLinearGradient(mx, my, mx + nx * maxDist, my + ny * maxDist);
      const [r, g, b] = colorRgb;
      grad.addColorStop(0.0, `rgba(${r}, ${g}, ${b}, ${baseAlpha.toFixed(3)})`);
      grad.addColorStop(0.18, `rgba(${r}, ${g}, ${b}, ${(baseAlpha * 0.72).toFixed(3)})`);
      grad.addColorStop(0.42, `rgba(${r}, ${g}, ${b}, ${(baseAlpha * 0.28).toFixed(3)})`);
      grad.addColorStop(0.70, `rgba(${r}, ${g}, ${b}, ${(baseAlpha * 0.07).toFixed(3)})`);
      grad.addColorStop(1.0, `rgba(${r}, ${g}, ${b}, 0.0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.lineTo(ox1, oy1);
      ctx.lineTo(ox2, oy2);
      ctx.lineTo(sx2, sy2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Thin Specular Rim helper: razor-clean, delicate edge highlight
    const drawThinSpecular = (
      p1x: number,
      p1y: number,
      p2x: number,
      p2y: number,
      gradStops: [number, string][],
      alpha: number,
      width: number = 1.6
    ) => {
      if (alpha <= 0.005) return;
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const grad = ctx.createLinearGradient(p1x, p1y, p2x, p2y);
      for (const [stop, col] of gradStops) {
        grad.addColorStop(stop, col);
      }

      // Soft subtle sheen
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.35));
      ctx.strokeStyle = grad;
      ctx.lineWidth = width * 2.5;
      ctx.filter = "blur(2.0px)";
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();

      // Crisp thin specular line
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * 0.95));
      ctx.lineWidth = width;
      ctx.filter = "none";
      ctx.beginPath();
      ctx.moveTo(p1x, p1y);
      ctx.lineTo(p2x, p2y);
      ctx.stroke();
      ctx.restore();
    };

    const render = (
      colorFactor: number,
      leftI: number,
      rightI: number,
      bottomI: number,
      apexI: number,
      lightX: number,
      lightY: number
    ) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // ==========================================
      // 1. BACKGROUND DIFFUSE LIGHT WASHES
      // ==========================================
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const whiteAlpha = 1.0 - colorFactor;

      // Parallax-responsive normal offsets
      const pShiftX = lightX * 0.002;
      const pShiftY = lightY * 0.002;
      const dynNormLX = normLX + pShiftX;
      const dynNormLY = normLY + pShiftY;
      const dynNormRX = normRX + pShiftX;
      const dynNormRY = normRY + pShiftY;
      const dynNormBX = normBX + pShiftX;
      const dynNormBY = normBY + pShiftY;

      // Color Palettes
      const cMagenta: [number, number, number] = [238, 55, 150];
      const cWine: [number, number, number] = [170, 30, 115];
      const cDeepViolet: [number, number, number] = [110, 35, 130];
      const cApexViolet: [number, number, number] = [175, 125, 235];

      const cBlue: [number, number, number] = [50, 120, 245];
      const cDeepBlue: [number, number, number] = [22, 55, 185];
      const cMidnight: [number, number, number] = [15, 30, 115];
      const cCyan: [number, number, number] = [24, 200, 238];
      const cMint: [number, number, number] = [35, 195, 145];

      const cWhite: [number, number, number] = [255, 255, 255];
      const cSilver: [number, number, number] = [225, 232, 250];
      const cAtmosphereWhite: [number, number, number] = [200, 215, 245];

      // 1A. WHITE LIGHT MODE (Independent edge washes)
      if (whiteAlpha > 0.005) {
        // --- Left Slope White Illumination ---
        if (leftI * whiteAlpha > 0.005) {
          const a = leftI * whiteAlpha;
          // Broad atmospheric wash spreading far to the left
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cAtmosphereWhite, 290, 0.28 * a, 70, 40, 25);
          // Mid diffusion
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cSilver, 140, 0.50 * a, 30, 20, 12);
          // Near-edge wash
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cWhite, 48, 0.82 * a, 10, 8, 4);
          // Thin specular rim
          drawThinSpecular(apexX, apexY, blX, blY, [
            [0.0, "rgba(255, 255, 255, 0.95)"],
            [0.4, "rgba(255, 255, 255, 0.90)"],
            [0.8, "rgba(220, 220, 220, 0.50)"],
            [1.0, "rgba(180, 180, 180, 0.15)"],
          ], a, 1.6);
        }

        // --- Right Slope White Illumination ---
        if (rightI * whiteAlpha > 0.005) {
          const a = rightI * whiteAlpha;
          // Broad atmospheric wash spreading far to the right and slightly downward
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cAtmosphereWhite, 310, 0.32 * a, 75, 45, 35);
          // Mid diffusion
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cSilver, 150, 0.55 * a, 32, 22, 18);
          // Near-edge wash
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cWhite, 52, 0.88 * a, 11, 10, 6);
          // Thin specular rim
          drawThinSpecular(apexX, apexY, brX, brY, [
            [0.0, "rgba(255, 255, 255, 1.0)"],
            [0.4, "rgba(255, 255, 255, 0.95)"],
            [0.8, "rgba(230, 235, 255, 0.65)"],
            [1.0, "rgba(190, 205, 240, 0.20)"],
          ], a, 1.6);
        }

        // --- Bottom Slope White Illumination ---
        if (bottomI * whiteAlpha > 0.005) {
          const a = bottomI * whiteAlpha;
          drawEdgeWash(blX, blY, brX, brY, dynNormBX, dynNormBY, 1, 0, cAtmosphereWhite, 180, 0.18 * a, 55, 15, 15);
          drawEdgeWash(blX, blY, brX, brY, dynNormBX, dynNormBY, 1, 0, cWhite, 60, 0.38 * a, 20, 8, 8);
          drawThinSpecular(blX, blY, brX, brY, [
            [0.0, "rgba(200, 200, 200, 0.20)"],
            [0.3, "rgba(255, 255, 255, 0.70)"],
            [0.7, "rgba(255, 255, 255, 0.70)"],
            [1.0, "rgba(200, 200, 200, 0.20)"],
          ], a, 1.4);
        }
      }

      // 1B. COLORED LIGHT MODE (Independent edge washes)
      if (colorFactor > 0.005) {
        // --- Left Slope Pink / Magenta Region ---
        if (leftI * colorFactor > 0.005) {
          const a = leftI * colorFactor;
          // Broad dark wine/magenta atmosphere (reaches 320px out)
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cDeepViolet, 320, 0.35 * a, 78, 50, 25);
          // Secondary wine wash
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cWine, 220, 0.45 * a, 52, 35, 16);
          // Mid diffusion vivid magenta
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cMagenta, 120, 0.65 * a, 28, 20, 8);
          // Near-edge intense magenta
          drawEdgeWash(apexX, apexY, blX, blY, dynNormLX, dynNormLY, uLX, uLY, cMagenta, 45, 0.90 * a, 9, 8, 2);
          // Thin specular rim
          drawThinSpecular(apexX, apexY, blX, blY, [
            [0.0, "rgba(215, 160, 245, 0.95)"], // soft lilac near apex
            [0.35, "rgba(245, 130, 200, 0.95)"], // pink
            [0.75, "rgba(235, 90, 175, 0.70)"], // vivid magenta
            [1.0, "rgba(200, 60, 140, 0.25)"],  // tapering at corner
          ], a, 1.6);
        }

        // --- Right Slope Royal Blue / Cyan Region ---
        if (rightI * colorFactor > 0.005) {
          const a = rightI * colorFactor;
          // Broad dark midnight blue atmosphere (reaches 320px out)
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cMidnight, 320, 0.35 * a, 78, 50, 25);
          // Secondary deep blue wash
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cDeepBlue, 220, 0.45 * a, 52, 35, 16);
          // Mid diffusion royal blue
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cBlue, 120, 0.65 * a, 28, 20, 8);
          // Near-edge cyan-blue
          drawEdgeWash(apexX, apexY, brX, brY, dynNormRX, dynNormRY, uRX, uRY, cCyan, 45, 0.88 * a, 9, 8, 2);
          // Thin specular rim
          drawThinSpecular(apexX, apexY, brX, brY, [
            [0.0, "rgba(215, 160, 245, 0.95)"], // soft lilac near apex
            [0.35, "rgba(160, 205, 255, 0.95)"], // sky blue
            [0.75, "rgba(95, 165, 250, 0.70)"],  // royal blue
            [1.0, "rgba(60, 130, 225, 0.25)"],   // tapering at corner
          ], a, 1.6);
        }

        // --- Apex Lilac/Violet Overlap Bloom ---
        // (Emerges naturally when both slopes are active; tapers into background)
        const apexOverlap = Math.min(leftI, rightI, apexI) * colorFactor;
        if (apexOverlap > 0.005) {
          drawEdgeWash(apexX - 15, apexY, apexX + 15, apexY, 0, -1, 1, 0, cApexViolet, 110, 0.38 * apexOverlap, 36, 15, 15);
        }

        // --- Bottom Slope Pale Mint / Cyan Region ---
        if (bottomI * colorFactor > 0.005) {
          const a = bottomI * colorFactor;
          // Broad dark teal atmosphere
          drawEdgeWash(blX, blY, brX, brY, dynNormBX, dynNormBY, 1, 0, [15, 60, 55], 200, 0.30 * a, 60, 20, 20);
          // Mid diffusion mint/cyan
          drawEdgeWash(blX, blY, brX, brY, dynNormBX, dynNormBY, 1, 0, cMint, 80, 0.52 * a, 24, 10, 10);
          // Near-edge crisp mint
          drawEdgeWash(blX, blY, brX, brY, dynNormBX, dynNormBY, 1, 0, [45, 220, 175], 25, 0.82 * a, 8, 4, 4);
          // Thin specular rim
          drawThinSpecular(blX, blY, brX, brY, [
            [0.0, "rgba(225, 120, 150, 0.35)"], // rose warmth on left
            [0.3, "rgba(120, 225, 185, 0.80)"], // mint
            [0.7, "rgba(100, 215, 235, 0.80)"], // cyan
            [1.0, "rgba(80, 180, 245, 0.35)"],  // blue on right
          ], a, 1.4);
        }
      }

      ctx.restore();

      // ==========================================
      // 2. SUBTLE FILM GRAIN APPLIED STRICTLY ONTO LIGHT
      // ==========================================
      if (noisePattern) {
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
      }

      // ==========================================
      // 3. SOLID PITCH-BLACK TRIANGLE SILHOUETTE
      // ==========================================
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(apexX, apexY);
      ctx.lineTo(brX, brY);
      ctx.lineTo(blX, blY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Render initial frame
    const curInit = currentRef.current;
    render(
      curInit.colorProgress,
      curInit.leftIntensity,
      curInit.rightIntensity,
      curInit.bottomIntensity,
      curInit.apexIntensity,
      curInit.lightX,
      curInit.lightY
    );

    if (prefersReducedMotion) {
      return;
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let previousFrameTime: number | null = null;

    const tick = (now: number) => {
      const elapsed =
        previousFrameTime === null
          ? 1000 / 60
          : Math.min(now - previousFrameTime, 50);

      previousFrameTime = now;

      const cur = currentRef.current;
      const tgt = targetRef.current;

      const baseFactor =
        tgt.colorProgress > cur.colorProgress
          ? enterLerpFactor
          : exitLerpFactor;

      const factor =
        1 - Math.pow(1 - baseFactor, elapsed / (1000 / 60));

      cur.colorProgress = lerp(cur.colorProgress, tgt.colorProgress, factor);
      cur.leftIntensity = lerp(cur.leftIntensity, tgt.leftIntensity, factor);
      cur.rightIntensity = lerp(cur.rightIntensity, tgt.rightIntensity, factor);
      cur.bottomIntensity = lerp(cur.bottomIntensity, tgt.bottomIntensity, factor);
      cur.apexIntensity = lerp(cur.apexIntensity, tgt.apexIntensity, factor);
      cur.lightX = lerp(cur.lightX, tgt.lightX, factor);
      cur.lightY = lerp(cur.lightY, tgt.lightY, factor);

      render(
        cur.colorProgress,
        cur.leftIntensity,
        cur.rightIntensity,
        cur.bottomIntensity,
        cur.apexIntensity,
        cur.lightX,
        cur.lightY
      );

      const isSettled =
        !isPointerInsideRef.current &&
        effectiveCapabilityIdxRef.current === null &&
        Math.abs(cur.colorProgress - tgt.colorProgress) < 0.002 &&
        Math.abs(cur.leftIntensity - tgt.leftIntensity) < 0.003 &&
        Math.abs(cur.rightIntensity - tgt.rightIntensity) < 0.003 &&
        Math.abs(cur.bottomIntensity - tgt.bottomIntensity) < 0.003 &&
        Math.abs(cur.apexIntensity - tgt.apexIntensity) < 0.003 &&
        Math.abs(cur.lightX - tgt.lightX) < 0.02 &&
        Math.abs(cur.lightY - tgt.lightY) < 0.02;

      if (isSettled) {
        cur.colorProgress = tgt.colorProgress;
        cur.leftIntensity = tgt.leftIntensity;
        cur.rightIntensity = tgt.rightIntensity;
        cur.bottomIntensity = tgt.bottomIntensity;
        cur.apexIntensity = tgt.apexIntensity;
        cur.lightX = tgt.lightX;
        cur.lightY = tgt.lightY;
        render(
          cur.colorProgress,
          cur.leftIntensity,
          cur.rightIntensity,
          cur.bottomIntensity,
          cur.apexIntensity,
          cur.lightX,
          cur.lightY
        );
        isRunningRef.current = false;
        previousFrameTime = null;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!isRunningRef.current) {
        isRunningRef.current = true;
        previousFrameTime = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    startLoopRef.current = startLoop;

    const handlePointerMove = (e: PointerEvent) => {
      // Check whether hero is currently in view
      const heroElement = containerRef.current?.closest(".t2-agentic-hero");
      if (heroElement) {
        const heroRect = heroElement.getBoundingClientRect();
        if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
          if (isPointerInsideRef.current && effectiveCapabilityIdxRef.current === null) {
            isPointerInsideRef.current = false;
            Object.assign(targetRef.current, MONOLITH_CONFIG.restingState);
            startLoop();
          }
          return;
        }
      }

      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const logicalX = ((e.clientX - rect.left) / rect.width) * canvasWidth;
      const logicalY = ((e.clientY - rect.top) / rect.height) * canvasHeight;

      const dx = logicalX - cx;
      const dy = logicalY - cy;
      const dist = Math.hypot(dx, dy);

      // If hovering capability row, capability state takes precedence
      if (effectiveCapabilityIdxRef.current !== null) {
        return;
      }

      const whiteTrackingRadius = 450;

      if (dist < whiteTrackingRadius) {
        isPointerInsideRef.current = true;

        // Calculate distance to triangle edges and check if inside
        const dLeft = distToSegment(logicalX, logicalY, apexX, apexY, blX, blY);
        const dRight = distToSegment(logicalX, logicalY, apexX, apexY, brX, brY);
        const dBottom = distToSegment(logicalX, logicalY, blX, blY, brX, brY);
        const dApex = Math.hypot(logicalX - apexX, logicalY - apexY);

        const isInside = isPointInTriangle(logicalX, logicalY, apexX, apexY, blX, blY, brX, brY);
        const dTriangle = isInside ? 0 : Math.min(dLeft, dRight, dBottom);

        // Color blooms when pointer directly hovers or is immediately adjacent to triangle (dTriangle <= 45px)
        // Outside that threshold, lighting remains in white illumination mode
        let targetColor = 0.0;
        if (dTriangle <= 45) {
          targetColor = 1.0;
        } else if (dTriangle < 110) {
          targetColor = Math.max(0, (110 - dTriangle) / (110 - 45));
        }
        targetRef.current.colorProgress = targetColor;

        // Parallax light offset
        const nx = Math.max(-1, Math.min(1, dx / 150));
        const ny = Math.max(-1, Math.min(1, dy / 130));
        targetRef.current.lightX = nx * MONOLITH_CONFIG.pointerParallaxMaxX;
        targetRef.current.lightY = ny * MONOLITH_CONFIG.pointerParallaxMaxY;

        // Independent edge weighting
        const falloff = 240;
        const wLeft = Math.max(0, 1 - dLeft / falloff) ** 2;
        const wRight = Math.max(0, 1 - dRight / falloff) ** 2;
        const wBottom = Math.max(0, 1 - dBottom / falloff) ** 2;
        const wApex = Math.max(0, 1 - dApex / 190) ** 2;

        const sum = wLeft + wRight + wBottom;
        if (sum > 0.001) {
          const pLeft = wLeft / sum;
          const pRight = wRight / sum;
          const pBottom = wBottom / sum;

          // Contrast expansion: winning edge is emphasized, other edges dim substantially
          const cLeft = Math.pow(pLeft, 2.2);
          const cRight = Math.pow(pRight, 2.2);
          const cBottom = Math.pow(pBottom, 2.2);
          const cMax = Math.max(cLeft, cRight, cBottom, 0.001);

          targetRef.current.leftIntensity = Math.max(0.035, Math.min(1.0, (cLeft / cMax) * 0.965 + 0.035));
          targetRef.current.rightIntensity = Math.max(0.035, Math.min(1.0, (cRight / cMax) * 0.965 + 0.035));
          targetRef.current.bottomIntensity = Math.max(0.025, Math.min(1.0, (cBottom / cMax) * 0.975 + 0.025));
          targetRef.current.apexIntensity = Math.max(
            0.10,
            Math.min(1.0, Math.max(targetRef.current.leftIntensity, targetRef.current.rightIntensity) * 0.8 + wApex * 0.35)
          );
        }

        startLoop();
      } else {
        if (isPointerInsideRef.current) {
          isPointerInsideRef.current = false;
          Object.assign(targetRef.current, MONOLITH_CONFIG.restingState);
          startLoop();
        }
      }
    };

    const handlePointerLeave = () => {
      if (effectiveCapabilityIdxRef.current === null) {
        isPointerInsideRef.current = false;
        Object.assign(targetRef.current, MONOLITH_CONFIG.restingState);
        startLoop();
      }
    };

    const handleScroll = () => {
      const heroElement = containerRef.current?.closest(".t2-agentic-hero");
      if (heroElement) {
        const heroRect = heroElement.getBoundingClientRect();
        if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
          if (isPointerInsideRef.current && effectiveCapabilityIdxRef.current === null) {
            isPointerInsideRef.current = false;
            Object.assign(targetRef.current, MONOLITH_CONFIG.restingState);
            startLoop();
          }
        }
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
      isRunningRef.current = false;
    };
  }, []);

  // Effect 2: Update capability hover/active target independently without rebuilding the renderer
  useEffect(() => {
    effectiveCapabilityIdxRef.current = effectiveCapabilityIdx;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { capabilityStates, restingState } = MONOLITH_CONFIG;

    if (
      effectiveCapabilityIdx !== null &&
      effectiveCapabilityIdx >= 0 &&
      effectiveCapabilityIdx < capabilityStates.length
    ) {
      isPointerInsideRef.current = true;
      Object.assign(targetRef.current, capabilityStates[effectiveCapabilityIdx]);
      startLoopRef.current();
    } else if (!isPointerInsideRef.current) {
      Object.assign(targetRef.current, restingState);
      startLoopRef.current();
    }
  }, [effectiveCapabilityIdx]);

  return (
    <div ref={containerRef} className="t2-monolith-container" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="t2-monolith-canvas"
        style={{
          width: MONOLITH_CONFIG.canvasWidth,
          height: MONOLITH_CONFIG.canvasHeight,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
