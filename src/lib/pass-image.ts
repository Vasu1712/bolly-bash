import { BARCODE_MODULES, barcodeBars } from "./barcode";
import { EVENT, EVENT_DATE } from "./event";
import type { Pass } from "./passes";

// Logical canvas size, drawn at 2x so the PNG stays crisp when shared.
const WIDTH = 1200;
const HEIGHT = 600;
const SCALE = 2;

// Ticket geometry: a main section and a tear-off stub joined by notches.
const T = { x: 44, y: 44, w: 1112, h: 512, radius: 26, notch: 18, stub: 292 };
const STUB_X = T.x + T.w - T.stub;
const STUB_CENTER = STUB_X + T.stub / 2;
const MAIN_LEFT = T.x + 36;
const MAIN_WIDTH = STUB_X - 36 - MAIN_LEFT;

const COLORS = {
  white: "#ffffff",
  lilac: "#c9b3f1",
  gold: "#ffd577",
  peacock: "#6ff7e3",
  rani: "#ff8fca",
  emerald: "#6ee7b7",
  ink: "#14072b",
  raniBand: "#ff2d95",
};

type Ctx = CanvasRenderingContext2D;
type Fonts = { display: string; body: string; mono: string; script: string };
type FontFn = (size: number) => string;
type TextStyle = {
  font: FontFn;
  size: number;
  color: string | CanvasGradient;
  /** Shrinks the text down to minSize, then truncates it, to stay within maxWidth. */
  maxWidth?: number;
  minSize?: number;
  tracking?: number;
  align?: CanvasTextAlign;
};

export async function renderPassImage(pass: Pass): Promise<Blob> {
  const fonts = await loadFonts();
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.scale(SCALE, SCALE);

  drawBackdrop(ctx);
  drawTicketShape(ctx);
  ctx.save();
  ticketPath(ctx);
  ctx.clip();
  drawTicketSurface(ctx);
  drawMainSection(ctx, pass, fonts);
  drawStub(ctx, pass, fonts);
  ctx.restore();
  drawTicketBorder(ctx);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export the pass image."))),
      "image/png",
    );
  });
}

/** Reuses the next/font families the page already loaded. */
async function loadFonts(): Promise<Fonts> {
  const stack = (variable: string, fallback: string) => {
    const family = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    return family ? `${family}, ${fallback}` : fallback;
  };
  const fonts = {
    display: stack("--font-rozha", "Georgia, serif"),
    body: stack("--font-dm-sans", "system-ui, sans-serif"),
    mono: stack("--font-jetbrains", "ui-monospace, monospace"),
    script: stack("--font-yellowtail", "cursive"),
  };
  await Promise.allSettled([
    document.fonts.load(`64px ${fonts.display}`),
    document.fonts.load(`700 16px ${fonts.body}`),
    document.fonts.load(`700 20px ${fonts.mono}`),
    document.fonts.load(`28px ${fonts.script}`),
  ]);
  return fonts;
}

function drawBackdrop(ctx: Ctx) {
  ctx.fillStyle = "#0b0616";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const sparkles: [number, number, number, string][] = [
    [22, 22, 7, COLORS.gold],
    [600, 21, 5, COLORS.white],
    [1176, 24, 8, COLORS.gold],
    [1181, 300, 5, COLORS.peacock],
    [1172, 578, 7, COLORS.rani],
    [24, 578, 6, COLORS.gold],
    [19, 300, 5, COLORS.white],
  ];
  for (const [x, y, r, color] of sparkles) sparkle(ctx, x, y, r, color);
}

function drawTicketShape(ctx: Ctx) {
  ctx.save();
  ticketPath(ctx);
  ctx.fillStyle = COLORS.ink;
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 44;
  ctx.shadowOffsetY = 18;
  ctx.fill();
  ctx.shadowColor = "rgba(255, 194, 74, 0.25)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 0;
  ctx.fill();
  ctx.restore();
}

function drawTicketSurface(ctx: Ctx) {
  ctx.fillStyle = "#1d0c38";
  ctx.fillRect(T.x, T.y, T.w, T.h);

  // Darker tear-off stub with a perforated edge.
  ctx.fillStyle = "rgba(4, 1, 12, 0.42)";
  ctx.fillRect(STUB_X, T.y, T.stub, T.h);
  ctx.save();
  ctx.strokeStyle = "rgba(255, 213, 119, 0.55)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 7]);
  ctx.beginPath();
  ctx.moveTo(STUB_X, T.y + T.notch + 10);
  ctx.lineTo(STUB_X, T.y + T.h - T.notch - 10);
  ctx.stroke();
  ctx.restore();
}

function drawMainSection(ctx: Ctx, pass: Pass, fonts: Fonts) {
  const body = (weight: number): FontFn => (size) => `${weight} ${size}px ${fonts.body}`;
  const label = (text: string, x: number, y: number) =>
    drawText(ctx, text.toUpperCase(), x, y, { font: body(700), size: 11, color: COLORS.lilac, tracking: 2.6 });

  // Header band
  ctx.fillStyle = COLORS.raniBand;
  ctx.fillRect(T.x, T.y, STUB_X - T.x, 58);
  ctx.fillStyle = "rgba(255, 213, 119, 0.6)";
  ctx.fillRect(T.x, T.y + 58, STUB_X - T.x, 1.5);
  drawText(ctx, `${EVENT.presenter}  •  Official entry pass`.toUpperCase(), MAIN_LEFT, T.y + 35, {
    font: body(700),
    size: 14,
    color: COLORS.white,
    tracking: 3,
  });

  const pill = "★ MAIN CHARACTER VIP ★";
  const pillWidth = measure(ctx, pill, body(800)(11.5), 2) + 30;
  const pillX = STUB_X - 36 - pillWidth;
  ctx.fillStyle = COLORS.gold;
  ctx.beginPath();
  ctx.roundRect(pillX, T.y + 16, pillWidth, 26, 13);
  ctx.fill();
  drawText(ctx, pill, pillX + pillWidth / 2, T.y + 33.5, {
    font: body(800),
    size: 11.5,
    color: "#1a0533",
    tracking: 2,
    align: "center",
  });

  // Title
  const titleY = T.y + 128;
  ctx.save();
  ctx.shadowColor = "rgba(255, 170, 60, 0.45)";
  ctx.shadowBlur = 24;
  drawText(ctx, EVENT.name, MAIN_LEFT - 2, titleY, {
    font: (size) => `${size}px ${fonts.display}`,
    size: 62,
    color: foil(ctx, titleY - 50, titleY + 6),
  });
  ctx.restore();
  drawText(ctx, `${EVENT.dressCode.replace(/!$/, "")}  ·  ${EVENT.energy}`.toUpperCase(), MAIN_LEFT, titleY + 30, {
    font: body(700),
    size: 12.5,
    minSize: 10,
    maxWidth: MAIN_WIDTH,
    color: COLORS.peacock,
    tracking: 2.4,
  });

  // Guest details
  const panelY = titleY + 52;
  const inner = MAIN_LEFT + 24;
  const column = (MAIN_WIDTH - 48) / 2;
  panel(ctx, MAIN_LEFT, panelY, MAIN_WIDTH, 178, 18, "rgba(7, 2, 16, 0.55)", "rgba(255, 213, 119, 0.3)");
  label("Guest name", inner, panelY + 32);
  drawText(ctx, pass.guestName, inner, panelY + 70, {
    font: body(700),
    size: 32,
    minSize: 18,
    maxWidth: MAIN_WIDTH - 48,
    color: COLORS.white,
  });
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(inner, panelY + 90);
  ctx.lineTo(MAIN_LEFT + MAIN_WIDTH - 24, panelY + 90);
  ctx.stroke();
  ctx.restore();
  label("Locked character", inner, panelY + 118);
  drawText(ctx, pass.character, inner, panelY + 154, {
    font: body(700),
    size: 26,
    minSize: 15,
    maxWidth: column - 16,
    color: COLORS.peacock,
  });
  label("From movie", inner + column + 16, panelY + 118);
  drawText(ctx, pass.movie, inner + column + 16, panelY + 154, {
    font: body(700),
    size: 22,
    minSize: 13,
    maxWidth: column - 16,
    color: COLORS.gold,
  });

  // Date, time and perks
  const stripY = panelY + 196;
  panel(ctx, MAIN_LEFT, stripY, MAIN_WIDTH, 46, 14, "rgba(255, 45, 149, 0.12)", "rgba(255, 92, 174, 0.35)");
  drawText(ctx, [EVENT_DATE, EVENT.time, EVENT.perks.join(" · ")].join("   |   ").toUpperCase(), MAIN_LEFT + 22, stripY + 28.5, {
    font: body(700),
    size: 12.5,
    minSize: 10,
    maxWidth: MAIN_WIDTH - 44,
    color: COLORS.white,
    tracking: 1.4,
  });

  const taglineWidth = drawText(ctx, EVENT.tagline, MAIN_LEFT + 2, T.y + T.h - 24, {
    font: (size) => `${size}px ${fonts.script}`,
    size: 28,
    color: COLORS.gold,
  });
  sparkle(ctx, MAIN_LEFT + taglineWidth + 20, T.y + T.h - 34, 7, COLORS.gold);
}

function drawStub(ctx: Ctx, pass: Pass, fonts: Fonts) {
  const body = (weight: number): FontFn => (size) => `${weight} ${size}px ${fonts.body}`;
  const cx = STUB_CENTER;

  drawText(ctx, "ADMIT ONE", cx, T.y + 48, { font: body(800), size: 12, color: COLORS.gold, tracking: 4.5, align: "center" });

  const vipY = T.y + 118;
  ctx.save();
  ctx.shadowColor = "rgba(255, 170, 60, 0.45)";
  ctx.shadowBlur = 20;
  drawText(ctx, "VIP", cx, vipY, {
    font: (size) => `${size}px ${fonts.display}`,
    size: 64,
    color: foil(ctx, vipY - 48, vipY + 4),
    align: "center",
  });
  ctx.restore();
  drawText(ctx, "MAIN CHARACTER", cx, vipY + 26, { font: body(700), size: 11, color: COLORS.rani, tracking: 3, align: "center" });
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(cx - 60, vipY + 48, 120, 1);

  drawText(ctx, "TICKET ID", cx, vipY + 82, { font: body(700), size: 11, color: COLORS.lilac, tracking: 2.6, align: "center" });
  panel(ctx, cx - 118, vipY + 94, 236, 42, 10, "rgba(255, 255, 255, 0.06)", "rgba(46, 233, 208, 0.5)");
  drawText(ctx, pass.ticketId, cx, vipY + 121, {
    font: (size) => `700 ${size}px ${fonts.mono}`,
    size: 20,
    minSize: 12,
    maxWidth: 212,
    color: COLORS.white,
    tracking: 0.5,
    align: "center",
  });

  const codeY = vipY + 154;
  const codeWidth = 220;
  const unit = codeWidth / BARCODE_MODULES;
  ctx.fillStyle = COLORS.gold;
  for (const bar of barcodeBars(pass.ticketId)) {
    ctx.fillRect(cx - codeWidth / 2 + bar.x * unit, codeY, bar.width * unit, 64);
  }

  const reserved = "CHARACTER RESERVED";
  const reservedFont = body(700);
  const badgeX = cx - (measure(ctx, reserved, reservedFont(11), 1.6) + 22) / 2;
  checkBadge(ctx, badgeX + 7, codeY + 98, 7, COLORS.emerald);
  drawText(ctx, reserved, badgeX + 22, codeY + 102, { font: reservedFont, size: 11, color: COLORS.emerald, tracking: 1.6 });

  drawText(ctx, `${EVENT.weekday.slice(0, 3)} · ${EVENT.day} ${EVENT.month.slice(0, 3)}`.toUpperCase(), cx, T.y + T.h - 26, {
    font: body(700),
    size: 12,
    color: COLORS.lilac,
    tracking: 2.6,
    align: "center",
  });
}

function drawTicketBorder(ctx: Ctx) {
  const border = ctx.createLinearGradient(T.x, T.y, T.x + T.w, T.y + T.h);
  border.addColorStop(0, "#ffe7a8");
  border.addColorStop(0.5, "#f2a524");
  border.addColorStop(1, "#ffd577");
  ctx.save();
  ticketPath(ctx);
  ctx.strokeStyle = border;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
}

/** Rounded ticket outline with semicircle bites where the stub tears off. */
function ticketPath(ctx: Ctx) {
  const { x, y, w, h, radius: r, notch: n } = T;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(STUB_X - n, y);
  ctx.arc(STUB_X, y, n, Math.PI, 0, true);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(STUB_X + n, y + h);
  ctx.arc(STUB_X, y + h, n, 0, Math.PI, true);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawText(ctx: Ctx, text: string, x: number, y: number, style: TextStyle) {
  ctx.save();
  setTracking(ctx, style.tracking ?? 0);
  ctx.textAlign = style.align ?? "left";
  let size = style.size;
  ctx.font = style.font(size);
  let output = text;
  if (style.maxWidth) {
    const minSize = style.minSize ?? size;
    while (size > minSize && ctx.measureText(output).width > style.maxWidth) {
      size -= 1;
      ctx.font = style.font(size);
    }
    if (ctx.measureText(output).width > style.maxWidth) {
      const chars = Array.from(text);
      while (chars.length > 1 && ctx.measureText(`${chars.join("")}…`).width > style.maxWidth) chars.pop();
      output = `${chars.join("").trimEnd()}…`;
    }
  }
  ctx.fillStyle = style.color;
  ctx.fillText(output, x, y);
  const width = ctx.measureText(output).width;
  ctx.restore();
  return width;
}

function measure(ctx: Ctx, text: string, font: string, tracking: number) {
  ctx.save();
  setTracking(ctx, tracking);
  ctx.font = font;
  const width = ctx.measureText(text).width;
  ctx.restore();
  return width;
}

function setTracking(ctx: Ctx, px: number) {
  // Canvas letter-spacing is newer than the rest of the API; skip it where unsupported.
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

function foil(ctx: Ctx, top: number, bottom: number) {
  const gradient = ctx.createLinearGradient(0, top, 0, bottom);
  gradient.addColorStop(0, "#fff8e1");
  gradient.addColorStop(0.35, "#ffe08a");
  gradient.addColorStop(0.65, "#f5b13a");
  gradient.addColorStop(1, "#ffe7a8");
  return gradient;
}

function panel(ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string, stroke: string) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function sparkle(ctx: Ctx, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(r * 0.08, -r * 0.42, r * 0.42, -r * 0.08, r, 0);
  ctx.bezierCurveTo(r * 0.42, r * 0.08, r * 0.08, r * 0.42, 0, r);
  ctx.bezierCurveTo(-r * 0.08, r * 0.42, -r * 0.42, r * 0.08, -r, 0);
  ctx.bezierCurveTo(-r * 0.42, -r * 0.08, -r * 0.08, -r * 0.42, 0, -r);
  ctx.closePath();
  ctx.shadowColor = color;
  ctx.shadowBlur = r * 1.6;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function checkBadge(ctx: Ctx, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 0.42, y + r * 0.02);
  ctx.lineTo(x - r * 0.1, y + r * 0.34);
  ctx.lineTo(x + r * 0.45, y - r * 0.3);
  ctx.stroke();
  ctx.restore();
}
