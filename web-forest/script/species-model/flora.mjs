/**
 * Flora & fungi archetypes. Same contract as fauna.mjs: (k, col, opt), faces
 * +Z, ground y=0. Plants get faces too — the pack is deliberately kawaii, so
 * a katmon is a chubby tree with a smile, a mushroom is a smiling cap.
 */
import { APP, grad, shade, mix } from "./kit.mjs";

const ink = APP.ink;
const leafOf = (col) => col.base ?? APP.green;
const leafDeep = (col) => col.dark ?? APP.greenDeep;
const trunkOf = (col) => col.trunk ?? shade(APP.greenDeep, -0.5);
const flowerOf = (col) => col.accent ?? APP.orange;

/** Face on a trunk or stalk — plants smile too. */
function trunkFace(k, parent, { at, r, yaw = 0 }) {
  k.face(parent, { center: at, r, yaw, gap: 0.5, eyeR: 0.38, blush: true, smile: true, blink: true, name: "pface" });
}

// ---------- trees ----------

function canopyBlobs(k, parent, { top, blobs, leaf, leafDark }) {
  const nodes = [];
  for (let i = 0; i < blobs; i += 1) {
    const h = k.hash(`canopy${i}`);
    const a = h * Math.PI * 2;
    const rad = i === 0 ? 0 : 0.16 + h * 0.1;
    const r = i === 0 ? 0.3 : 0.2 + (1 - h) * 0.08;
    const node = k.blob(parent, {
      name: `canopy${i}`, r,
      at: [Math.cos(a) * rad, top + (i === 0 ? 0 : 0.08 * (1 - h)), Math.sin(a) * rad],
      color: h > 0.5 ? leaf : leafDark,
      colorFn: grad(shade(leaf, 0.18), leafDark, -0.3, 0.3),
      subdiv: 1,
    });
    nodes.push(node);
  }
  nodes.forEach((n, i) => {
    k.cute.swing(n, { axis: "x", amp: 0.025, dur: 2.2 + i * 0.3, phase: i * 0.4 });
  });
  return nodes;
}

function fruits(k, parent, { count, color, canopyR = 0.28, top = 0.75 }) {
  for (let i = 0; i < count; i += 1) {
    const h1 = k.hash(`fruit${i}a`);
    const h2 = k.hash(`fruit${i}b`);
    const a = h1 * Math.PI * 2;
    const rr = canopyR * (0.7 + h2 * 0.3);
    k.blob(parent, {
      name: `fruit${i}`, r: 0.05,
      at: [Math.cos(a) * rr, top + (h2 - 0.4) * 0.3, Math.sin(a) * rr],
      color, subdiv: 0,
    });
  }
}

function tree(k, col, opt = {}) {
  const trunkH = opt.trunkH ?? 0.42;
  const trunk = k.tube(k.root, {
    name: "trunk", r: opt.thick ? 0.12 : 0.08, r2: opt.thick ? 0.09 : 0.055,
    h: trunkH, at: [0, 0, 0], color: trunkOf(col), seg: 7,
  });
  trunkFace(k, trunk, { at: [0, trunkH * 0.55, opt.thick ? 0.1 : 0.075], r: opt.thick ? 0.1 : 0.07 });
  const leaf = leafOf(col);
  const leafDark = leafDeep(col);

  if (opt.canopy === "umbrella") {
    for (const [i, rr] of [0.42, 0.3, 0.2].entries()) {
      const c = k.blob(trunk, {
        name: `canopy${i}`, rx: rr, ry: rr * 0.32, rz: rr,
        at: [0, trunkH + 0.14 - i * 0.04, (i - 1) * 0.1],
        color: i % 2 ? leafDark : leaf,
        colorFn: grad(shade(leaf, 0.2), leafDark, -0.15, 0.15),
      });
      k.cute.swing(c, { axis: "x", amp: 0.02, dur: 2.6 + i * 0.4, phase: i * 0.5 });
    }
  } else if (opt.canopy === "balete") {
    canopyBlobs(k, trunk, { top: trunkH + 0.16, blobs: 4, leaf, leafDark });
    for (let i = 0; i < 5; i += 1) {
      const h = k.hash(`root${i}`);
      const a = h * Math.PI * 2;
      const rr = 0.16 + h * 0.18;
      k.tube(k.root, {
        name: `aroot${i}`, r: 0.018, h: trunkH + 0.1,
        at: [Math.cos(a) * rr, 0, Math.sin(a) * rr], rotZ: Math.cos(a) * -0.12, rotX: Math.sin(a) * 0.12,
        color: trunkOf(col), seg: 5,
      });
    }
  } else if (opt.canopy === "conifer") {
    const layers = opt.layers ?? 5;
    for (let i = 0; i < layers; i += 1) {
      const t = i / (layers - 1);
      const c = k.blob(trunk, {
        name: `layer${i}`, rx: 0.34 * (1 - t * 0.75), ry: 0.1, rz: 0.34 * (1 - t * 0.75),
        at: [0, trunkH + 0.1 + i * 0.14, 0],
        color: mix(leafDark, leaf, t * 0.4),
      });
      k.cute.swing(c, { axis: "z", amp: 0.015, dur: 2.4 + i * 0.2, phase: i * 0.3 });
    }
  } else {
    canopyBlobs(k, trunk, { top: trunkH + 0.14, blobs: opt.blobs ?? 3, leaf, leafDark });
  }
  if (opt.fruit) fruits(k, trunk, { count: opt.fruitCount ?? 5, color: flowerOf(col), top: trunkH + 0.15 });
  k.cute.breathe(k.root, { k: 0.015 });
}

function papaya(k, col) {
  const trunk = k.tube(k.root, { name: "trunk", r: 0.05, r2: 0.04, h: 0.5, color: trunkOf(col) });
  trunkFace(k, trunk, { at: [0, 0.2, 0.048], r: 0.05 });
  fruits(k, trunk, { count: 5, color: flowerOf(col), canopyR: 0.06, top: 0.24 });
  for (let i = 0; i < 6; i += 1) {
    const h = k.hash(`leaf${i}`);
    const a = h * Math.PI * 2;
    k.tube(trunk, {
      name: `petiole${i}`, r: 0.014, h: 0.2,
      at: [Math.cos(a) * 0.02, 0.52, Math.sin(a) * 0.02], rotZ: Math.cos(a) * 0.8, rotX: Math.sin(a) * 0.8,
      color: trunkOf(col), seg: 5,
    });
    k.blob(trunk, {
      name: `blade${i}`, rx: 0.16, ry: 0.02, rz: 0.14,
      at: [Math.cos(a) * 0.17, 0.72, Math.sin(a) * 0.17], rotY: -a,
      color: leafOf(col), colorFn: grad(shade(leafOf(col), 0.2), leafDeep(col)),
    });
  }
  k.cute.breathe(k.root, { k: 0.015 });
}

function palm(k, col, opt = {}) {
  const trunkH = opt.trunkH ?? 0.52;
  if (opt.clump) {
    for (let i = 0; i < 3; i += 1) {
      const h = k.hash(`stem${i}`);
      k.tube(k.root, {
        name: `trunk${i}`, r: 0.035, r2: 0.028, h: trunkH * (0.7 + h * 0.5),
        at: [(h - 0.5) * 0.2, 0, (k.hash(`stemz${i}`) - 0.5) * 0.2], color: trunkOf(col), seg: 6,
      });
    }
  } else {
    k.tube(k.root, { name: "trunk", r: 0.045, r2: 0.035, h: trunkH, at: [0, 0, 0], rotZ: 0.03, color: trunkOf(col), seg: 6 });
  }
  const crown = k.blob(k.root, { name: "crown", r: 0.02, at: [0, trunkH + 0.05, 0] });
  trunkFace(k, k.root, { at: [0.02, trunkH * 0.45, 0.05], r: 0.05 });
  const n = opt.fronds ?? 7;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2 + k.hash(`f${i}`) * 0.5;
    const droop = 0.55 + k.hash(`d${i}`) * 0.5;
    k.blob(crown, {
      name: `frond${i}`, rx: opt.fishtail ? 0.11 : 0.055, ry: 0.018, rz: 0.3,
      at: [Math.cos(a) * 0.24, -droop * 0.1, Math.sin(a) * 0.24],
      pivot: [Math.cos(a) * 0.06, 0.04, Math.sin(a) * 0.06],
      rotX: droop, rotY: Math.PI / 2 - a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
      colorFn: grad(shade(leafOf(col), 0.15), leafDeep(col)),
    });
  }
  if (opt.coconut) {
    for (let i = 0; i < 3; i += 1) {
      const a = (i / 3) * Math.PI * 2;
      k.blob(crown, { name: `coco${i}`, r: 0.05, at: [Math.cos(a) * 0.07, -0.03, Math.sin(a) * 0.07], color: hex2("#7a4e2a"), subdiv: 0 });
    }
  }
  k.cute.swing(crown, { axis: "x", amp: 0.03, dur: 2.8 });
  k.cute.breathe(k.root, { k: 0.012 });
}
const hex2 = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

function bananaKind(k, col, opt = {}) {
  const stem = k.tube(k.root, { name: "pseudostem", r: 0.06, r2: 0.045, h: 0.42, color: mix(trunkOf(col), leafOf(col), 0.5) });
  trunkFace(k, stem, { at: [0, 0.18, 0.058], r: 0.055 });
  const n = opt.leaves ?? 5;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const droop = 0.5 + k.hash(`b${i}`) * 0.4;
    k.blob(stem, {
      name: `leaf${i}`, rx: 0.26, ry: 0.025, rz: 0.11,
      at: [Math.cos(a) * 0.22, 0.42 - droop * 0.12, Math.sin(a) * 0.22],
      pivot: [Math.cos(a) * 0.04, 0.42, Math.sin(a) * 0.04],
      rotX: droop, rotY: Math.PI / 2 - a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
      colorFn: grad(shade(leafOf(col), 0.2), leafDeep(col), -0.03, 0.03),
    });
  }
  if (opt.bloom) {
    k.cone(stem, { name: "bloom", r: 0.06, h: 0.16, at: [0, 0.3, 0.1], rotX: 0.9, color: flowerOf(col) });
  }
  k.cute.swing(stem, { axis: "z", amp: 0.02, dur: 2.5 });
  k.cute.breathe(k.root, { k: 0.012 });
}

function pandanus(k, col) {
  k.tube(k.root, { name: "trunk", r: 0.04, r2: 0.05, h: 0.2, color: trunkOf(col) });
  for (let i = 0; i < 4; i += 1) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    k.tube(k.root, {
      name: `prop${i}`, r: 0.016, h: 0.24,
      at: [Math.cos(a) * 0.14, 0, Math.sin(a) * 0.14],
      rotZ: Math.cos(a) * 0.55, rotX: Math.sin(a) * -0.55, color: trunkOf(col), seg: 5,
    });
  }
  const n = 9;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    k.blob(k.root, {
      name: `sword${i}`, rx: 0.03, ry: 0.015, rz: 0.26,
      at: [Math.cos(a) * 0.12, 0.32, Math.sin(a) * 0.12],
      pivot: [Math.cos(a) * 0.02, 0.2, Math.sin(a) * 0.02],
      rotX: 0.5, rotY: Math.PI / 2 - a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
    });
  }
  trunkFace(k, k.root, { at: [0, 0.12, 0.045], r: 0.04 });
  k.cute.breathe(k.root, { k: 0.012 });
}

function cycad(k, col) {
  k.tube(k.root, { name: "trunk", r: 0.07, r2: 0.06, h: 0.16, color: trunkOf(col) });
  for (let i = 0; i < 10; i += 1) {
    const a = (i / 10) * Math.PI * 2;
    k.blob(k.root, {
      name: `frond${i}`, rx: 0.05, ry: 0.02, rz: 0.24,
      at: [Math.cos(a) * 0.14, 0.3, Math.sin(a) * 0.14],
      pivot: [Math.cos(a) * 0.03, 0.18, Math.sin(a) * 0.03],
      rotX: 0.35, rotY: Math.PI / 2 - a,
      color: leafDeep(col),
    });
  }
  trunkFace(k, k.root, { at: [0, 0.08, 0.072], r: 0.05 });
  k.cute.breathe(k.root, { k: 0.012 });
}

// ---------- shrubs & herbs ----------

function shrub(k, col, opt = {}) {
  const leaf = leafOf(col);
  const leafDark = leafDeep(col);
  const canopies = [];
  for (let i = 0; i < 3; i += 1) {
    const h = k.hash(`stem${i}`);
    const a = h * Math.PI * 2;
    const rr = i === 0 ? 0 : 0.09 + h * 0.05;
    const top = 0.3 + (i === 0 ? 0.16 : h * 0.1);
    const stem = k.tube(k.root, {
      name: `stem${i}`, r: 0.022, r2: 0.014, h: top,
      at: [Math.cos(a) * rr, 0, Math.sin(a) * rr], rotZ: Math.cos(a) * 0.12, rotX: Math.sin(a) * 0.12,
      color: trunkOf(col), seg: 5,
    });
    const cn = k.blob(stem, {
      name: `canopy${i}`, r: 0.17 + h * 0.05, at: [0, top, 0],
      color: i % 2 ? leaf : leafDark,
      colorFn: opt.colorful ? undefined : grad(shade(leaf, 0.18), leafDark, -0.2, 0.2),
      subdiv: 1,
    });
    canopies.push(cn);
    k.cute.swing(cn, { axis: "x", amp: 0.03, dur: 2.1 + i * 0.3, phase: i * 0.4 });
    if (opt.bloom === "balls") {
      for (let j = 0; j < 4; j += 1) {
        const b = k.hash(`b${i}${j}`);
        const ba = b * Math.PI * 2;
        k.blob(cn, {
          name: `bloom${i}${j}`, r: 0.035,
          at: [Math.cos(ba) * 0.14, 0.05, Math.sin(ba) * 0.14],
          color: opt.multicolor ? FLOWER_POOL[Math.floor(b * FLOWER_POOL.length)] : flowerOf(col),
          subdiv: 0,
        });
      }
    }
    if (opt.bloom === "hibiscus") {
      flowerHead(k, cn, { at: [0, 0.16, 0.1], kind: "petal", r: 0.09, color: flowerOf(col) });
    }
    if (opt.bloom === "trumpets") {
      flowerHead(k, cn, { at: [0, 0.15, 0.12], kind: "trumpet", r: 0.07, color: flowerOf(col) });
    }
  }
  if (opt.colorful) {
    // croton-style: each canopy a different foliage color
    const pool = [hex2("#c85a20"), hex2("#c8a020"), hex2("#8a5aa0"), leafOf(col)];
    canopies.forEach((node, i) => {
      node.parts[0].color = pool[i % pool.length];
    });
  }
  k.cute.breathe(k.root, { k: 0.018 });
}
const FLOWER_POOL = ["#ff3920", "#e84a8a", "#f6b22d", "#f8f4ec", "#6a7fd8", "#9a5ad8"].map(hex2);

function flowerHead(k, parent, { at, kind, r = 0.08, color, centerColor }) {
  if (kind === "daisy") {
    for (let i = 0; i < 9; i += 1) {
      const a = (i / 9) * Math.PI * 2;
      k.blob(parent, {
        name: `petal${i}`, rx: r * 0.9, ry: r * 0.28, rz: r * 0.4,
        at: [Math.cos(a) * r, 0, Math.sin(a) * r], pivot: [0, 0, 0], rotY: -a,
        color, subdiv: 0,
      });
    }
    k.blob(parent, { name: "center", r: r * 0.45, at: [0, r * 0.1, 0], color: centerColor ?? hex2("#f6b22d") });
  } else if (kind === "trumpet") {
    k.cone(parent, { name: "trumpet", r, r2: r * 0.25, h: r * 1.6, at, rotX: 0.6, color });
    k.blob(parent, { name: "throat", r: r * 0.3, at: [0, r * 0.4, 0], color: hex2("#f6b22d"), subdiv: 0 });
  } else if (kind === "petal") {
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2;
      k.blob(parent, {
        name: `petal${i}`, rx: r * 0.55, ry: r * 0.2, rz: r * 0.55,
        at: [Math.cos(a) * r * 0.55, 0, Math.sin(a) * r * 0.55], rotY: -a,
        color, subdiv: 0,
      });
    }
    k.cone(parent, { name: "pistil", r: r * 0.12, h: r * 0.7, at: [0, r * 0.3, 0], rotX: 0.4, color: hex2("#f6b22d") });
  } else if (kind === "spike") {
    for (let i = 0; i < 5; i += 1) {
      k.blob(parent, { name: `bud${i}`, r: r * (0.4 - i * 0.04), at: [0, i * r * 0.45, 0], color: i % 2 ? color : shade(color, 0.15), subdiv: 0 });
    }
  } else if (kind === "ball") {
    for (let i = 0; i < 7; i += 1) {
      const a = k.hash(`bl${i}`) * Math.PI * 2;
      const b = k.hash(`bb${i}`) * Math.PI;
      k.blob(parent, {
        name: `bud${i}`, r: r * 0.32,
        at: [Math.cos(a) * Math.sin(b) * r * 0.5, Math.cos(b) * r * 0.5, Math.sin(a) * Math.sin(b) * r * 0.5],
        color, subdiv: 0,
      });
    }
  } else if (kind === "berry") {
    for (let i = 0; i < 6; i += 1) {
      const a = k.hash(`berry${i}`) * Math.PI * 2;
      k.blob(parent, {
        name: `berry${i}`, r: r * 0.3,
        at: [Math.cos(a) * r * 0.5, r * 0.2, Math.sin(a) * r * 0.5],
        color: color ?? ink, subdiv: 0,
      });
    }
  } else if (kind === "pea") {
    k.blob(parent, { name: "banner", rx: r * 0.55, ry: r * 0.2, rz: r * 0.5, at: [0, r * 0.5, 0], rotX: -0.4, color, subdiv: 0 });
    for (const s of [1, -1]) {
      k.blob(parent, { name: `wing${s}`, rx: r * 0.3, ry: r * 0.18, rz: r * 0.4, at: [s * r * 0.5, r * 0.1, 0], rotZ: s * 0.5, color: shade(color, 0.12), subdiv: 0 });
    }
  }
}

function herb(k, col, opt = {}) {
  const h = 0.3 + k.hash("h") * 0.12;
  const stem = k.tube(k.root, { name: "stem", r: 0.014, r2: 0.011, h, color: leafDeep(col), seg: 5 });
  for (let i = 0; i < 3; i += 1) {
    const a = (i / 3) * Math.PI * 2 + k.hash(`l${i}`) * 2;
    const ly = h * (0.3 + i * 0.22);
    k.blob(stem, {
      name: `leaf${i}`, rx: 0.07, ry: 0.014, rz: 0.05,
      at: [Math.cos(a) * 0.07, ly, Math.sin(a) * 0.07],
      pivot: [0, ly, 0], rotY: -a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
    });
  }
  const kind = opt.flower ?? "daisy";
  if (kind !== "none") {
    const head = k.blob(stem, { name: "head", r: 0.012, at: [0, h, 0] });
    flowerHead(k, head, { at: [0, 0, 0], kind, r: opt.flowerR ?? 0.08, color: flowerOf(col) });
    k.cute.swing(head, { axis: "z", amp: 0.07, dur: 2.3 });
  }
  k.cute.breathe(k.root, { k: 0.02 });
}

function orchid(k, col) {
  for (const s of [1, -1]) {
    k.blob(k.root, { name: `leaf${s}`, rx: 0.06, ry: 0.015, rz: 0.12, at: [s * 0.06, 0.04, 0], rotZ: s * 0.35, color: leafDeep(col) });
  }
  const stem = k.tube(k.root, { name: "stem", r: 0.01, h: 0.34, rotX: 0.25, color: leafDeep(col), seg: 5 });
  for (let i = 0; i < 3; i += 1) {
    const node = k.blob(stem, { name: `flwr${i}`, r: 0.01, at: [0, 0.14 + i * 0.1, -i * 0.02] });
    flowerHead(k, node, { at: [0, 0, 0], kind: "petal", r: 0.06, color: flowerOf(col) });
  }
  k.cute.breathe(k.root, { k: 0.02 });
}

// ---------- grasses, ferns, moss ----------

function grass(k, col, opt = {}) {
  if (opt.kind === "bamboo") {
    for (let i = 0; i < 3; i += 1) {
      const h = k.hash(`cane${i}`);
      const x = (h - 0.5) * 0.24;
      const cane = k.tube(k.root, {
        name: `cane${i}`, r: 0.028, r2: 0.022, h: 0.7 + h * 0.3,
        at: [x, 0, (k.hash(`cz${i}`) - 0.5) * 0.2], rotZ: (h - 0.5) * 0.08,
        color: hex2("#7aa840"), seg: 6,
      });
      for (let j = 1; j <= 3; j += 1) {
        k.blob(cane, { name: `band${i}${j}`, rx: 0.03, ry: 0.008, rz: 0.03, at: [0, j * 0.2, 0], color: hex2("#5a8030"), subdiv: 0 });
      }
      for (let j = 0; j < 3; j += 1) {
        const a = k.hash(`bl${i}${j}`) * Math.PI * 2;
        k.blob(cane, {
          name: `leaf${i}${j}`, rx: 0.09, ry: 0.012, rz: 0.02,
          at: [Math.cos(a) * 0.06, 0.6 + j * 0.12, Math.sin(a) * 0.06],
          pivot: [0, 0.6 + j * 0.12, 0], rotY: -a,
          color: leafOf(col),
        });
      }
    }
    k.cute.breathe(k.root, { k: 0.012 });
    return;
  }
  const n = opt.kind === "sedge" ? 7 : 8;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2 + k.hash(`g${i}`);
    const lean = 0.35 + k.hash(`gl${i}`) * 0.35;
    const blade = k.blob(k.root, {
      name: `blade${i}`, rx: 0.016, ry: 0.2 + k.hash(`gh${i}`) * 0.1, rz: 0.008,
      at: [Math.cos(a) * 0.05, 0.16, Math.sin(a) * 0.05],
      pivot: [0, 0.02, 0], rotX: lean, rotY: Math.PI / 2 - a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
    });
    if (opt.seedhead && i % 3 === 0) {
      k.blob(blade, { name: `seed${i}`, r: 0.02, at: [0, 0.38, 0], color: flowerOf(col), subdiv: 0 });
    }
    k.cute.swing(blade, { axis: "x", amp: 0.05, dur: 2 + k.hash(`gs${i}`), phase: i * 0.3 });
  }
  if (opt.kind === "sedge") {
    flowerHead(k, k.root, { at: [0, 0.42, 0], kind: "ball", r: 0.05, color: flowerOf(col) });
  }
}

function fern(k, col) {
  const n = 7;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const droop = 0.5 + k.hash(`f${i}`) * 0.4;
    k.blob(k.root, {
      name: `frond${i}`, rx: 0.045, ry: 0.015, rz: 0.28,
      at: [Math.cos(a) * 0.15, 0.2 - droop * 0.06, Math.sin(a) * 0.15],
      pivot: [Math.cos(a) * 0.02, 0.06, Math.sin(a) * 0.02],
      rotX: droop, rotY: Math.PI / 2 - a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
      colorFn: grad(shade(leafOf(col), 0.15), leafDeep(col), -0.15, 0.15),
    });
  }
  // fiddleheads
  for (const s of [1, -1]) {
    k.arc(k.root, {
      name: `fiddle${s}`, R: 0.04, r: 0.012, a0: 0, a1: Math.PI * 1.5,
      at: [s * 0.04, 0.1, 0], rotX: 0.2, color: leafDeep(col), segs: 6,
    });
  }
  k.cute.breathe(k.root, { k: 0.02 });
}

function moss(k, col) {
  for (let i = 0; i < 7; i += 1) {
    const a = k.hash(`m${i}`) * Math.PI * 2;
    const rr = k.hash(`mr${i}`) * 0.12;
    k.blob(k.root, {
      name: `tuft${i}`, r: 0.035 + k.hash(`ms${i}`) * 0.03,
      at: [Math.cos(a) * rr, 0.03, Math.sin(a) * rr],
      color: i % 2 ? leafOf(col) : leafDeep(col), subdiv: 0,
    });
  }
  for (let i = 0; i < 3; i += 1) {
    const a = k.hash(`sp${i}`) * Math.PI * 2;
    const stalk = k.tube(k.root, {
      name: `stalk${i}`, r: 0.006, h: 0.1, at: [Math.cos(a) * 0.08, 0, Math.sin(a) * 0.08],
      rotZ: Math.cos(a) * 0.2, color: leafDeep(col), seg: 4,
    });
    k.blob(stalk, { name: `capsule${i}`, rx: 0.014, ry: 0.02, rz: 0.014, at: [0, 0.11, 0], color: flowerOf(col), subdiv: 0 });
    k.cute.swing(stalk, { axis: "z", amp: 0.08, dur: 2.2 + i * 0.4, phase: i * 0.4 });
  }
  k.cute.breathe(k.root, { k: 0.03 });
}

// ---------- succulents & arids ----------

function cactus(k, col, opt = {}) {
  if (opt.kind === "pads") {
    let parent = k.root;
    for (let i = 0; i < 3; i += 1) {
      parent = k.blob(parent, {
        rx: 0.12 - i * 0.02, ry: 0.14 - i * 0.02, rz: 0.035,
        name: `pad${i}`, at: [0, i === 0 ? 0.14 : 0.16, 0.02], rotX: i * 0.15,
        color: leafDeep(col),
      });
    }
    k.blob(parent, { name: "bloom", r: 0.04, at: [0, 0.14, 0.03], color: flowerOf(col), subdiv: 0 });
  } else {
    const body = k.tube(k.root, { name: "column", r: 0.07, r2: 0.05, h: 0.4, color: leafDeep(col), seg: 7 });
    for (let i = 0; i < 2; i += 1) {
      k.tube(body, {
        name: `arm${i}`, r: 0.03, r2: 0.025, h: 0.14,
        at: [i ? 0.05 : -0.05, 0.16 + i * 0.08, 0], rotZ: i ? -0.5 : 0.5,
        color: leafDeep(col), seg: 5,
      });
    }
    k.blob(body, { name: "bloom", r: 0.045, at: [0, 0.42, 0], color: flowerOf(col), subdiv: 0 });
    trunkFace(k, body, { at: [0, 0.18, 0.07], r: 0.05 });
  }
  k.cute.breathe(k.root, { k: 0.015 });
}

function succulent(k, col) {
  for (let ring = 0; ring < 2; ring += 1) {
    const n = ring === 0 ? 8 : 6;
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 + ring * 0.4;
      k.blob(k.root, {
        name: `leaf${ring}${i}`, rx: 0.035, ry: 0.09 - ring * 0.02, rz: 0.02,
        at: [Math.cos(a) * (0.06 + ring * 0.06), 0.05, Math.sin(a) * (0.06 + ring * 0.06)],
        rotX: 0.9, rotY: Math.PI / 2 - a,
        color: mix(leafOf(col), leafDeep(col), ring ? 0.4 : 0),
      });
    }
  }
  k.blob(k.root, { name: "heart", r: 0.035, at: [0, 0.05, 0], color: leafOf(col) });
  k.cute.breathe(k.root, { k: 0.03 });
}

function rosetteBlades(k, col, opt = {}) {
  // agave / aloe / sansevieria / dracaena tuft
  const n = opt.n ?? 8;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2;
    const tall = k.hash(`rb${i}`);
    k.blob(k.root, {
      name: `blade${i}`, rx: 0.03, ry: 0.12 + tall * (opt.tall ?? 0.18), rz: 0.012,
      at: [Math.cos(a) * 0.05, 0.1, Math.sin(a) * 0.05],
      pivot: [Math.cos(a) * 0.015, 0, Math.sin(a) * 0.015],
      rotX: 0.25, rotY: Math.PI / 2 - a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
      colorFn: opt.edge ? grad(shade(leafOf(col), 0.3), leafDeep(col)) : undefined,
    });
  }
  if (opt.cane) {
    k.tube(k.root, { name: "cane", r: 0.035, r2: 0.028, h: 0.3, color: trunkOf(col), seg: 6 });
    trunkFace(k, k.root, { at: [0, 0.14, 0.036], r: 0.04 });
  }
  k.cute.breathe(k.root, { k: 0.015 });
}

// ---------- aroids, vines, water ----------

function aroid(k, col) {
  const n = 5;
  for (let i = 0; i < n; i += 1) {
    const a = (i / n) * Math.PI * 2 + 0.3;
    const tall = 0.16 + k.hash(`a${i}`) * 0.12;
    k.tube(k.root, {
      name: `petiole${i}`, r: 0.011, h: tall,
      at: [Math.cos(a) * 0.02, 0, Math.sin(a) * 0.02], rotZ: Math.cos(a) * 0.3, rotX: Math.sin(a) * 0.3,
      color: leafDeep(col), seg: 5,
    });
    k.blob(k.root, {
      name: `blade${i}`, rx: 0.13, ry: 0.02, rz: 0.16,
      at: [Math.cos(a) * 0.09, tall + 0.05, Math.sin(a) * 0.09], rotY: -a,
      color: leafOf(col), colorFn: col.leafGrad ?? grad(shade(leafOf(col), 0.25), leafDeep(col), -0.03, 0.03),
    });
  }
  k.cute.breathe(k.root, { k: 0.02 });
}

function vine(k, col) {
  const n = 6;
  for (let i = 0; i < n; i += 1) {
    const a = k.hash(`v${i}`) * Math.PI * 2;
    const x = Math.cos(a) * (0.05 + i * 0.045);
    const z = Math.sin(a) * (0.05 + i * 0.045);
    const y = 0.1 + k.hash(`vy${i}`) * 0.28;
    k.tube(k.root, {
      name: `runner${i}`, r: 0.009, h: Math.hypot(x, z, y - 0.05),
      at: [x / 2, 0.03, z / 2],
      rotZ: Math.atan2(x, y) * 0.8, rotX: -Math.atan2(z, y) * 0.8,
      color: leafDeep(col), seg: 4,
    });
    k.blob(k.root, {
      name: `leaf${i}`, rx: 0.1, ry: 0.015, rz: 0.11,
      at: [x, y, z], rotY: -a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
      colorFn: col.variegated
        ? (p) => (p[0] + p[2] > 0.02 ? mix(leafOf(col), hex2("#e8d44a"), 0.55) : leafDeep(col))
        : grad(shade(leafOf(col), 0.2), leafDeep(col), -0.02, 0.02),
    });
  }
  k.cute.breathe(k.root, { k: 0.02 });
}

function waterPlant(k, col) {
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    k.blob(k.root, {
      name: `pad${i}`, rx: 0.09, ry: 0.015, rz: 0.09,
      at: [Math.cos(a) * 0.12, 0.04, Math.sin(a) * 0.12], rotY: -a,
      color: i % 2 ? leafOf(col) : leafDeep(col),
    });
  }
  const stem = k.tube(k.root, { name: "stem", r: 0.012, h: 0.22, color: leafDeep(col), seg: 5 });
  flowerHead(k, stem, { at: [0, 0.24, 0], kind: "petal", r: 0.06, color: flowerOf(col) });
  k.cute.swing(stem, { axis: "z", amp: 0.06, dur: 2.4 });
  k.cute.breathe(k.root, { k: 0.03 });
}

// ---------- fungi ----------

function mushroom(k, col, opt = {}) {
  const stub = opt.kind === "bracket";
  const stalkH = stub ? 0.08 : 0.18;
  const stalk = k.tube(k.root, {
    name: "stalk", r: stub ? 0.06 : 0.05, r2: stub ? 0.05 : 0.04, h: stalkH,
    color: col.stalk ?? shade(hex2("#e8dcc0"), 0), seg: 7,
  });
  if (!stub) trunkFace(k, stalk, { at: [0, stalkH * 0.5, 0.048], r: 0.042 });
  if (opt.kind === "bracket") {
    k.blob(stalk, {
      name: "shelf", rx: 0.24, ry: 0.05, rz: 0.18, at: [0, 0.1, 0.06], rotX: -0.25,
      color: col.base, colorFn: col.capGrad,
    });
  } else if (opt.kind === "puffball") {
    k.blob(k.root, { name: "ball", r: 0.14, at: [0, 0.14, 0], color: col.base, colorFn: col.capGrad });
  } else if (opt.kind === "earthstar") {
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      k.cone(k.root, {
        name: `star${i}`, r: 0.035, h: 0.12,
        at: [Math.cos(a) * 0.1, 0.05, Math.sin(a) * 0.1],
        rotZ: Math.cos(a) * -1.2, rotX: Math.sin(a) * 1.2, color: shade(col.base, -0.1), seg: 4,
      });
    }
    k.blob(k.root, { name: "ball", r: 0.07, at: [0, 0.1, 0], color: col.base });
  } else if (opt.kind === "birdsnest") {
    for (const [x, z] of [[0.05, 0.02], [-0.05, -0.01], [0, -0.06]]) {
      k.tube(k.root, { name: `cup${x}${z}`, r: 0.045, r2: 0.05, h: 0.05, at: [x, 0.03, z], color: col.base, seg: 7 });
      k.blob(k.root, { name: `egg${x}${z}`, r: 0.02, at: [x, 0.075, z], color: hex2("#f6e8c8"), subdiv: 0 });
    }
  } else if (opt.kind === "coral") {
    for (let i = 0; i < 6; i += 1) {
      const a = k.hash(`c${i}`) * Math.PI * 2;
      k.tube(k.root, {
        name: `branch${i}`, r: 0.02 - i * 0.002, h: 0.14 + k.hash(`ch${i}`) * 0.1,
        at: [Math.cos(a) * 0.03, 0, Math.sin(a) * 0.03],
        rotZ: Math.cos(a) * 0.35, rotX: Math.sin(a) * 0.35, color: col.base, seg: 5,
      });
    }
  } else if (opt.kind === "jelly") {
    k.blob(k.root, { name: "blob", rx: 0.14, ry: 0.06, rz: 0.12, at: [0, 0.05, 0], color: col.base, colorFn: col.capGrad });
  } else {
    // classic cap
    k.blob(stalk, {
      name: "cap", rx: 0.2, ry: 0.12, rz: 0.2, at: [0, stalkH, 0],
      color: col.base, colorFn: col.capGrad,
    });
    if (opt.spots) {
      for (let i = 0; i < 5; i += 1) {
        const a = k.hash(`sp${i}`) * Math.PI * 2;
        const rr = 0.06 + k.hash(`spr${i}`) * 0.1;
        k.blob(stalk, {
          name: `spot${i}`, r: 0.028, subdiv: 0,
          at: [Math.cos(a) * rr, stalkH + 0.06, Math.sin(a) * rr], color: APP.paper,
        });
      }
    }
  }
  k.cute.swing(stalk, { axis: "z", amp: 0.03, dur: 2.6 });
  k.cute.breathe(k.root, { k: 0.03 });
}

export const flora = {
  tree, papaya, palm, bananaKind, pandanus, cycad, shrub, herb, orchid,
  grass, fern, moss, cactus, succulent, rosetteBlades, aroid, vine,
  waterPlant, mushroom,
};
