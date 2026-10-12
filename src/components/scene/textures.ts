import * as THREE from "three";

export const fonts = { display: "sans-serif", mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' };

export async function loadFonts() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim();
  if (family) fonts.display = family;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`800 120px ${fonts.display}`),
        document.fonts.load(`600 60px ${fonts.display}`),
      ]),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch {
    // Fall back to whatever the browser has; canvases still render.
  }
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function glowTexture(color: string) {
  return canvasTexture(256, 256, (ctx) => {
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  });
}

export function captionTexture(text: string) {
  const height = 96;
  const probe = document.createElement("canvas").getContext("2d");
  const font = `600 ${height * 0.5}px ${fonts.display}`;
  let width = 800;
  if (probe) {
    probe.font = font;
    width = Math.ceil(probe.measureText(text).width) + 24;
  }
  const texture = canvasTexture(width, height, (ctx) => {
    ctx.font = font;
    ctx.fillStyle = "#0a5bd6";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 12, height / 2);
  });
  return { texture, aspect: width / height };
}

export function codeTexture() {
  const w = 640;
  const h = 368;
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = "#0f1630";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#18213f";
    ctx.fillRect(0, 0, w, 40);
    ctx.fillStyle = "#ffcd03";
    ctx.fillRect(16, 16, 10, 10);
    ctx.font = `500 18px ${fonts.mono}`;
    ctx.fillStyle = "rgba(243,239,230,0.75)";
    ctx.textBaseline = "middle";
    ctx.fillText("aman.ts", 36, 21);

    const lines: [string, string][][] = [
      [["// hello from the workstation", "#5f6b8f"]],
      [["const ", "#3fb4f0"], ["aman", "#f3efe6"], [" = {", "#f3efe6"]],
      [["  role", "#f3efe6"], [": ", "#f3efe6"], ['"engineer, builder"', "#ffcd03"], [",", "#f3efe6"]],
      [["  base", "#f3efe6"], [": ", "#f3efe6"], ['"Noida, India"', "#ffcd03"], [",", "#f3efe6"]],
      [["  building", "#f3efe6"], [": [", "#f3efe6"], ['"OpenLIT"', "#ffcd03"], [", ", "#f3efe6"], ['"Transilience"', "#ffcd03"], ["],", "#f3efe6"]],
      [["  shipping", "#f3efe6"], [": ", "#f3efe6"], ["since", "#3fb4f0"], ["(", "#f3efe6"], ["2015", "#ffb38a"], ["),", "#f3efe6"]],
      [["};", "#f3efe6"]],
      [["", "#f3efe6"]],
      [["export default ", "#3fb4f0"], ["aman", "#f3efe6"], [";", "#f3efe6"]],
    ];
    ctx.font = `500 21px ${fonts.mono}`;
    lines.forEach((tokens, index) => {
      const y = 70 + index * 32;
      ctx.fillStyle = "rgba(167,175,194,0.35)";
      ctx.fillText(String(index + 1).padStart(2, " "), 14, y);
      let x = 56;
      for (const [text, color] of tokens) {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      }
    });
  });
}

export function holoTexture(kind: "traces" | "latency" | "evals") {
  const w = 512;
  const h = 320;
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = "rgba(10,91,214,0.28)";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(63,180,240,0.9)";
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
    ctx.font = `700 24px ${fonts.mono}`;
    ctx.fillStyle = "#ffcd03";
    ctx.textBaseline = "middle";
    ctx.fillText(kind.toUpperCase(), 22, 30);
    ctx.fillStyle = "rgba(243,239,230,0.35)";
    ctx.fillRect(22, 52, w - 44, 2);

    if (kind === "traces") {
      const rows = [
        [0, 0.95, "#3fb4f0"],
        [0.04, 0.42, "#ffcd03"],
        [0.08, 0.2, "#f3efe6"],
        [0.3, 0.36, "#3fb4f0"],
        [0.48, 0.18, "#ffcd03"],
        [0.5, 0.4, "#3fb4f0"],
        [0.66, 0.22, "#f3efe6"],
      ] as const;
      rows.forEach(([start, width, color], i) => {
        const y = 76 + i * 33;
        ctx.fillStyle = "rgba(243,239,230,0.12)";
        ctx.fillRect(22, y, w - 44, 20);
        ctx.fillStyle = color;
        ctx.fillRect(22 + start * (w - 44), y, width * (w - 44), 20);
      });
    } else if (kind === "latency") {
      ctx.beginPath();
      const points = [0.62, 0.55, 0.7, 0.48, 0.52, 0.35, 0.44, 0.3, 0.38, 0.26, 0.32, 0.22];
      points.forEach((value, i) => {
        const x = 22 + (i / (points.length - 1)) * (w - 44);
        const y = 70 + value * (h - 100);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#ffcd03";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.lineTo(w - 22, h - 22);
      ctx.lineTo(22, h - 22);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,205,3,0.16)";
      ctx.fill();
    } else {
      const bars = [0.82, 0.64, 0.9, 0.72, 0.86];
      bars.forEach((value, i) => {
        const bw = 58;
        const gap = (w - 44 - bars.length * bw) / (bars.length - 1);
        const x = 22 + i * (bw + gap);
        const bh = value * (h - 110);
        ctx.fillStyle = "rgba(243,239,230,0.12)";
        ctx.fillRect(x, 70, bw, h - 110);
        ctx.fillStyle = i % 2 ? "#3fb4f0" : "#ffcd03";
        ctx.fillRect(x, 70 + (h - 110 - bh), bw, bh);
      });
    }
  });
}

export function flagTexture(year: string, label: string, stripe = "#0a5bd6") {
  const w = 320;
  const h = 180;
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = "#f5f3ee";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = stripe;
    ctx.fillRect(0, 0, 18, h);
    ctx.fillStyle = "#0b1020";
    ctx.textBaseline = "alphabetic";
    ctx.font = `800 78px ${fonts.display}`;
    ctx.fillText(year, 30, 96);
    ctx.font = `600 34px ${fonts.display}`;
    ctx.fillStyle = "#0a5bd6";
    ctx.fillText(label, 32, 148);
  });
}

export function signTexture(text: string) {
  const w = 360;
  const h = 150;
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = "#ffcd03";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#24262a";
    ctx.font = `800 58px ${fonts.display}`;
    ctx.textBaseline = "middle";
    ctx.fillText(text, 26, h / 2 + 2);
  });
}

/** Front print for the minifig torso: a white tee with a small code mark. */
export function torsoTexture() {
  const w = 256;
  const h = 256;
  return canvasTexture(w, h, (ctx) => {
    ctx.fillStyle = "#f5f3ee";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e9e5dc";
    ctx.beginPath();
    ctx.moveTo(92, 0);
    ctx.quadraticCurveTo(128, 46, 164, 0);
    ctx.fill();
    ctx.font = `800 70px ${fonts.mono}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e3000b";
    ctx.fillText("<", 82, 140);
    ctx.fillStyle = "#ffcd03";
    ctx.fillText("/", 128, 140);
    ctx.fillStyle = "#0a5bd6";
    ctx.fillText(">", 174, 140);
  });
}

/** Printed minifig face, wrapped around the head cylinder; the front is the horizontal center. */
export function faceTexture(skin: string, hair: string) {
  const w = 1536;
  const h = 416;
  return canvasTexture(w, h, (ctx) => {
    const cx = w / 2;
    ctx.fillStyle = skin;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.moveTo(cx - 175, 210);
    ctx.quadraticCurveTo(cx - 170, 400, cx, 410);
    ctx.quadraticCurveTo(cx + 170, 400, cx + 175, 210);
    ctx.quadraticCurveTo(cx + 120, 270, cx, 262);
    ctx.quadraticCurveTo(cx - 120, 270, cx - 175, 210);
    ctx.fill();

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.ellipse(cx, 318, 62, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#1a1210";
    ctx.lineCap = "round";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(cx - 44, 306);
    ctx.quadraticCurveTo(cx, 346, cx + 44, 306);
    ctx.stroke();

    ctx.lineWidth = 16;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + side * 38, 118);
      ctx.quadraticCurveTo(cx + side * 75, 100, cx + side * 112, 116);
      ctx.stroke();
    }

    for (const side of [-1, 1]) {
      ctx.fillStyle = "#1a1210";
      ctx.beginPath();
      ctx.ellipse(cx + side * 74, 172, 19, 27, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx + side * 74 + 6, 162, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(26,18,16,0.35)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx + 4, 200);
    ctx.quadraticCurveTo(cx + 14, 228, cx - 6, 236);
    ctx.stroke();
  });
}
