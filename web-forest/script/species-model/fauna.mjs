/**
 * Fauna archetypes. Every builder has the shape (k, col, opt) and composes a
 * chibi creature: big glossy eyes from Kit.face, stubby limbs, one "idle"
 * clip. `col` = {base, belly, dark, accent} resolved by the orchestrator;
 * `opt` carries the per-species shape tweaks from the route/override table.
 *
 * Convention: creature faces +Z, ground y=0, whole model ≲ 1 unit tall.
 */
import { APP, shade } from "./kit.mjs";

const ink = APP.ink;
const darkOf = (col) => col.dark ?? shade(col.base, -0.22);
const bellyOf = (col) => col.belly ?? shade(col.base, 0.32);

// ---------- birds ----------

function bird(k, col, opt = {}) {
  const legH = opt.legH ?? 0.12;
  const body = k.blob(k.root, {
    rx: opt.plump ? 0.3 : 0.25, ry: opt.plump ? 0.27 : 0.24, rz: opt.plump ? 0.32 : 0.3,
    at: [0, legH + 0.2, 0], color: col.base, name: "body",
  });
  k.blob(body, { name: "belly", rx: 0.18, ry: 0.16, rz: 0.22, at: [0, -0.07, 0.1], color: bellyOf(col) });

  const headR = opt.headR ?? 0.26;
  const headLocalY = opt.neck ? 0.42 : 0.28;
  if (opt.neck) {
    k.tube(body, { name: "neck", r: 0.06, h: opt.neck, at: [0, 0.1, 0.02], rotX: -0.3, color: col.base });
  }
  const head = k.blob(body, {
    r: headR, at: [0, headLocalY, opt.neck ? 0.12 : 0.05], color: col.head ?? col.base, name: "head",
  });

  // wings — hinged at the shoulder
  const wingGeo = { rx: opt.wingShape === "sickle" ? 0.26 : 0.2, ry: 0.05, rz: 0.15 };
  const wl = k.blob(body, {
    ...wingGeo, name: "wing-l", at: [0.27, 0.02, -0.02], pivot: [0.07, 0.02, -0.02],
    rotZ: 0.15, color: darkOf(col),
  });
  const wr = k.blob(body, {
    ...wingGeo, name: "wing-r", at: [-0.27, 0.02, -0.02], pivot: [-0.07, 0.02, -0.02],
    rotZ: -0.15, color: darkOf(col),
  });
  k.cute.swing(wl, { axis: "z", amp: 0.42, dur: 1.1, phase: 0 });
  k.cute.swing(wr, { axis: "z", amp: -0.42, dur: 1.1, phase: 0 });

  // tail
  if (opt.tail === "fork") {
    for (const s of [1, -1]) {
      k.blob(body, {
        rx: 0.05, ry: 0.03, rz: 0.18, name: `tail-${s}`,
        at: [s * 0.05, 0, -0.32], pivot: [s * 0.05, 0.02, -0.14], rotZ: s * 0.28, color: darkOf(col),
      });
    }
  } else if (opt.tail === "arcs") {
    for (const [i, s] of [1, -1, 0.4].entries()) {
      k.blob(body, {
        rx: 0.05, ry: 0.03, rz: 0.3, name: `tail${i}`,
        at: [s * 0.06, 0.16 - i * 0.05, -0.34], pivot: [s * 0.06, 0.02, -0.16],
        rotX: -0.9, color: col.accentTail ?? darkOf(col),
      });
    }
  } else if (opt.tail === "long") {
    k.blob(body, { rx: 0.06, ry: 0.035, rz: 0.3, name: "tail", at: [0, 0.06, -0.4], pivot: [0, 0.04, -0.18], rotX: 0.2, color: darkOf(col) });
  } else {
    const tail = k.blob(body, { rx: 0.15, ry: 0.045, rz: 0.16, name: "tail", at: [0, 0.03, -0.36], pivot: [0, 0.05, -0.18], rotX: 0.5, color: darkOf(col) });
    k.cute.swing(tail, { axis: "x", amp: 0.12, dur: 1.8, phase: 0.3 });
  }

  // legs
  if (legH > 0.03) k.legs(body, { at: [0, -legH * 0.6, 0.03], spread: 0.08, r: legH > 0.2 ? 0.02 : 0.025, h: legH, color: col.leg ?? shade(col.accent ?? APP.orange, -0.15), swing: opt.legH > 0.2 ? 0.06 : 0 });

  // beak
  const beak = opt.beak ?? "cone";
  const beakCol = col.beak ?? (col.accent ?? APP.orange);
  if (beak === "needle") {
    k.cone(head, { name: "beak", r: 0.028, h: headR * 1.7, at: [0, -0.02, headR], rotX: Math.PI / 2 - 0.12, color: beakCol });
  } else if (beak === "hook") {
    k.cone(head, { name: "beak-top", r: 0.05, h: headR * 0.9, at: [0, 0, headR], rotX: Math.PI / 2 + 0.55, color: beakCol });
    k.cone(head, { name: "beak-bot", r: 0.035, h: headR * 0.4, at: [0, -headR * 0.28, headR * 0.9], rotX: Math.PI / 2, color: shade(beakCol, -0.15) });
  } else if (beak === "chisel") {
    k.cone(head, { name: "beak", r: 0.05, h: headR * 0.6, at: [0, -0.02, headR * 0.95], rotX: Math.PI / 2, color: beakCol });
  } else {
    k.cone(head, { name: "beak", r: 0.05, h: headR * 0.75, at: [0, -0.02, headR * 0.92], rotX: Math.PI / 2, color: beakCol });
  }

  // crest / comb
  if (opt.crest === "comb") {
    [-0.06, 0.02, 0.1].forEach((z, i) => {
      k.blob(head, { name: `comb${i}`, r: 0.055 + (i === 1 ? 0.02 : 0), at: [0, headR * 0.95, z], color: APP.red });
    });
    k.blob(head, { name: "wattle", r: 0.05, at: [0, -headR * 0.75, headR * 0.72], color: APP.red });
  } else if (opt.crest === "crest") {
    for (const s of [1, -1]) k.cone(head, { name: `crest${s}`, r: 0.03, h: 0.14, at: [s * 0.03, headR * 0.9, -0.05], rotX: -0.7, color: APP.red });
  }

  k.face(head, { r: headR * 0.98, eyeR: 0.36, gap: 0.52, blink: opt.blink ?? true });
  k.idle({ breatheK: 0.03, bobAmp: 0.025 });
}

// ---------- mammals ----------

function mammal(k, col, opt = {}) {
  const body = k.blob(k.root, { rx: 0.27, ry: 0.22, rz: 0.36, at: [0, 0.28, 0], color: col.base, name: "body" });
  k.blob(body, { name: "belly", rx: 0.19, ry: 0.14, rz: 0.26, at: [0, -0.09, 0.12], color: bellyOf(col) });

  const head = k.blob(body, { r: 0.27, at: [0, 0.28, 0.22], color: col.base, name: "head" });

  // ears
  if (opt.ears === "floppy") {
    for (const s of [1, -1]) {
      k.blob(head, { rx: 0.09, ry: 0.16, rz: 0.05, name: `ear${s}`, at: [s * 0.24, 0.08, -0.02], pivot: [s * 0.2, 0.22, -0.02], rotZ: s * 0.5, color: darkOf(col) });
    }
  } else if (opt.ears === "big") {
    for (const s of [1, -1]) k.blob(head, { name: `ear${s}`, r: 0.13, at: [s * 0.22, 0.24, -0.04], color: col.base });
  } else {
    for (const s of [1, -1]) {
      k.cone(head, { name: `ear${s}`, r: 0.08, h: 0.16, at: [s * 0.16, 0.24, -0.02], rotZ: s * -0.25, color: col.base });
      k.cone(head, { name: `earin${s}`, r: 0.045, h: 0.1, at: [s * 0.16, 0.25, 0.02], rotZ: s * -0.25, color: shade(col.base, 0.25) });
    }
  }

  // muzzle + nose
  if (opt.snout) {
    const snoutR = opt.snout === "dog" ? 0.11 : 0.08;
    k.blob(head, { name: "snout", r: snoutR, at: [0, -0.09, 0.22], color: bellyOf(col) });
    k.blob(head, { name: "nose", r: 0.038, at: [0, -0.06, 0.22 + snoutR * 0.85], color: ink });
    if (opt.tongue) k.blob(head, { name: "tongue", rx: 0.045, ry: 0.02, rz: 0.07, at: [0, -0.19, 0.26], color: hex("#e87a8a") });
  }

  // legs
  k.legs(body, { at: [0, -0.24, 0.12], spread: 0.16, r: 0.045, h: 0.14, color: col.base, swing: 0.05 });
  k.legs(body, { at: [0, -0.24, -0.14], spread: 0.14, r: 0.045, h: 0.13, color: shade(col.base, -0.08) });

  // tail
  if (opt.tail === "bat-wing") {
    for (const s of [1, -1]) {
      k.blob(body, { rx: 0.34, ry: 0.02, rz: 0.24, name: `wing${s}`, at: [s * 0.34, 0.06, -0.05], pivot: [s * 0.1, 0.08, -0.02], rotZ: s * 0.5, color: darkOf(col) });
    }
  } else if (opt.tail === "rod") {
    const tail = k.blob(body, { rx: 0.025, ry: 0.025, rz: 0.3, name: "tail", at: [0, 0.05, -0.5], pivot: [0, 0.08, -0.28], rotX: 0.5, color: shade(col.base, 0.1) });
    k.cute.swing(tail, { axis: "z", amp: 0.3, dur: 0.8, phase: 0.2 });
  } else {
    const tail = k.blob(body, { rx: 0.05, ry: 0.05, rz: 0.26, name: "tail", at: [0, 0.24, -0.42], pivot: [0, 0.12, -0.28], rotX: -0.7, color: col.base });
    k.cute.swing(tail, { axis: "z", amp: 0.25, dur: 1.3, phase: 0.4 });
  }

  k.face(head, { r: 0.27, eyeR: 0.36, gap: 0.5, blink: true });
  k.idle();
}
const hex = (h) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

// ---------- herps ----------

function frog(k, col, opt = {}) {
  const body = k.blob(k.root, { rx: 0.3, ry: 0.19, rz: 0.3, at: [0, 0.19, 0], color: col.base, name: "body" });
  k.blob(body, { name: "belly", rx: 0.22, ry: 0.12, rz: 0.22, at: [0, -0.09, 0.1], color: bellyOf(col) });
  if (opt.warty) {
    [[0.12, 0.16, 0.1], [-0.13, 0.15, -0.02], [0.02, 0.18, -0.14], [-0.05, 0.16, 0.13], [0.16, 0.13, -0.08]].forEach(([x, y, z], i) => {
      k.blob(body, { name: `wart${i}`, r: 0.035, at: [x, y, z], color: darkOf(col) });
    });
  }
  for (const s of [1, -1]) {
    const bump = k.blob(body, { name: `eyebump${s}`, r: 0.1, at: [s * 0.15, 0.17, 0.14], color: col.base });
    k.blob(bump, { name: `eyeball${s}`, r: 0.07, at: [0, 0.05, 0.06], color: APP.paper });
    k.blob(bump, { name: `pupil${s}`, r: 0.035, at: [0, 0.05, 0.12], color: ink });
  }
  k.arc(body, { name: "smile", R: 0.16, r: 0.045, a0: Math.PI * 1.2, a1: Math.PI * 1.8, at: [0, -0.02, 0.27], color: ink, segs: 6 });
  for (const s of [1, -1]) {
    k.blob(body, { name: `thigh${s}`, rx: 0.09, ry: 0.07, rz: 0.16, at: [s * 0.2, -0.04, -0.12], color: darkOf(col) });
    k.tube(body, { name: `arm${s}`, r: 0.028, h: 0.14, at: [s * 0.22, 0.02, 0.16], rotX: 0.5, rotZ: s * -0.4, color: col.base });
  }
  k.cute.breathe(k.root, { k: 0.07 });
  k.cute.bob(k.root, { amp: 0.07, phase: 0.1 });
}

function lizard(k, col, opt = {}) {
  const scale = opt.kind === "monitor" ? 1.35 : 1;
  const body = k.blob(k.root, {
    rx: 0.14 * scale, ry: 0.11 * scale, rz: 0.26 * scale,
    at: [0, 0.14 * scale, 0], color: col.base, name: "body",
  });
  const head = k.blob(body, {
    r: (opt.kind === "gecko" ? 0.16 : 0.13) * scale,
    at: [0, 0.03, 0.3 * scale], color: col.head ?? col.base, name: "head",
  });
  // tail — three shrinking pods
  for (let i = 0; i < 3; i += 1) {
    const r = (0.09 - i * 0.026) * scale;
    k.blob(body, {
      rx: r, ry: r * 0.8, rz: r * 1.6, name: `tail${i}`,
      at: [0, 0, -0.26 * scale - i * 0.16 * scale], color: shade(col.base, -i * 0.05),
    });
  }
  for (const s of [1, -1]) {
    for (const [i, dz] of [0.14, -0.12].entries()) {
      k.tube(body, {
        name: `leg${i}${s}`, r: 0.022 * scale, h: 0.13 * scale,
        at: [s * 0.1 * scale, -0.05, dz * scale], rotZ: s * -1.1, color: shade(col.base, -0.1),
      });
    }
    if (opt.kind === "gecko") k.blob(body, { name: `toe${s}`, r: 0.035, at: [s * 0.19, -0.12, 0.16 * scale], color: shade(col.base, 0.2) });
  }
  const eyeR = opt.kind === "gecko" ? 0.44 : 0.32;
  k.face(head, { center: [0, 0.02, 0], r: 0.13 * scale, eyeR, gap: 0.55, smile: false, blush: false });
  k.cute.swing(body, { axis: "y", amp: 0.08, dur: 1.9, phase: 0.2 });
  k.cute.swing(body, { axis: "y", amp: -0.05, dur: 1.3 });
  k.idle({ breatheK: 0.04, bobAmp: 0 });
}

function snake(k, col, opt = {}) {
  const tiny = opt.kind === "blind";
  const n = tiny ? 1 : 3;
  for (let i = 0; i < n; i += 1) {
    const r = (0.2 - i * 0.03) * (tiny ? 0.4 : 1);
    k.blob(k.root, {
      rx: r, ry: 0.05, rz: r, name: `coil${i}`,
      at: [i * 0.04, 0.06 + i * 0.09, -i * 0.02], color: shade(col.base, i % 2 ? 0.08 : -0.05),
    });
  }
  const head = k.blob(k.root, {
    r: tiny ? 0.06 : 0.12, at: [0, 0.06 + n * 0.09 + 0.06, 0.16], color: col.head ?? col.base, name: "head",
  });
  if (!tiny) {
    k.cone(head, { name: "tongue", r: 0.012, h: 0.1, at: [0, -0.02, 0.12], rotX: Math.PI / 2, color: APP.red });
  }
  k.face(head, { r: tiny ? 0.06 : 0.12, eyeR: 0.36, gap: 0.55, smile: !tiny, blush: false });
  k.cute.swing(head, { axis: "y", amp: 0.3, dur: 2.2 });
  k.idle({ breatheK: 0.04, bobAmp: 0 });
}

// ---------- fish ----------

function fish(k, col, opt = {}) {
  const angel = opt.kind === "angel";
  const body = k.blob(k.root, {
    rx: angel ? 0.06 : 0.1, ry: angel ? 0.3 : 0.17, rz: 0.28,
    at: [0, 0.34, 0], color: col.base, name: "body",
  });
  k.blob(body, { name: "belly", rx: 0.07, ry: 0.12, rz: 0.2, at: [0, -0.04, 0.1], color: bellyOf(col) });
  // tail fan
  const tail = k.blob(body, {
    rx: 0.03, ry: opt.kind === "fancy" ? 0.22 : 0.14, rz: 0.14,
    name: "tail", at: [0, 0, -0.38], pivot: [0, 0, -0.24],
    rotX: Math.PI / 2, color: darkOf(col),
  });
  k.cute.swing(tail, { axis: "y", amp: 0.4, dur: 1.1 });
  // fins
  k.blob(body, { name: "dorsal", rx: 0.02, ry: 0.1, rz: 0.12, at: [0, angel ? 0.3 : 0.17, -0.02], rotX: -0.3, color: darkOf(col) });
  for (const s of [1, -1]) {
    const fin = k.blob(body, { name: `pect${s}`, rx: 0.1, ry: 0.02, rz: 0.06, at: [s * 0.09, -0.03, 0.1], rotZ: s * 0.6, color: shade(col.base, 0.15) });
    k.cute.swing(fin, { axis: "x", amp: 0.2, dur: 0.9, phase: s > 0 ? 0 : 0.4 });
    k.blob(body, { name: `eye${s}`, r: 0.05, at: [s * 0.07, 0.08, 0.16], color: APP.paper });
    k.blob(body, { name: `pupil${s}`, r: 0.028, at: [s * 0.085, 0.08, 0.19], color: ink });
  }
  k.idle({ breatheK: 0.05, bobAmp: 0.02 });
}

// ---------- insects ----------

function lepidoptera(k, col, opt = {}) {
  const moth = opt.kind === "moth" || opt.kind === "hawk";
  const body = k.blob(k.root, { rx: 0.055, ry: moth ? 0.26 : 0.2, rz: 0.055, at: [0, 0.36, 0], color: darkOf(col), name: "body" });
  k.blob(body, { name: "head", r: 0.075, at: [0, moth ? 0.27 : 0.21, 0.01], color: darkOf(col) });
  k.antennae(body, { at: [0, 0.32, 0.02], len: 0.16, spread: 0.7, color: darkOf(col) });

  const wingY = moth ? 0.34 : 0.42;
  const upRx = opt.kind === "hawk" ? 0.34 : 0.3;
  for (const s of [1, -1]) {
    const wl = k.blob(body, {
      rx: upRx, ry: 0.018, rz: opt.kind === "skipper" ? 0.12 : 0.2,
      name: `wing-up${s}`, at: [s * 0.28, wingY, 0.02],
      pivot: [s * 0.04, wingY, 0], rotY: moth ? s * 0.55 : s * 0.12,
      color: col.base, colorFn: col.wingGrad,
    });
    k.cute.swing(wl, { axis: "z", amp: s * (moth ? 0.12 : 0.22), dur: 1.4 });
    const ll = k.blob(body, {
      rx: 0.18, ry: 0.015, rz: 0.14, name: `wing-lo${s}`,
      at: [s * 0.18, wingY - 0.2, -0.02], pivot: [s * 0.03, wingY - 0.18, 0],
      rotY: moth ? s * 0.5 : s * 0.08, color: shade(col.base, 0.12),
    });
    k.cute.swing(ll, { axis: "z", amp: s * (moth ? 0.1 : 0.18), dur: 1.4, phase: 0.3 });
    if (opt.spots) {
      for (const [sx, sy] of [[0.18, 0.05], [0.3, -0.02]]) {
        k.blob(wl, { name: `spot${s}${sx}`, r: 0.035, at: [s * sx, 0.02, sy], color: APP.paper, subdiv: 0 });
      }
    }
  }
  k.idle({ breatheK: 0.04, bobAmp: 0.015 });
}

function odonata(k, col, opt = {}) {
  const slim = opt.kind === "damselfly";
  const segs = 4;
  let parent = k.root;
  const segNodes = [];
  for (let i = 0; i < segs; i += 1) {
    const seg = k.blob(parent, {
      rx: slim ? 0.018 : 0.028, ry: slim ? 0.018 : 0.028, rz: 0.13,
      name: `abdomen${i}`, at: [0, i === 0 ? 0.34 : 0, slim ? -0.1 : -0.12],
      color: i % 2 ? shade(col.base, -0.2) : col.base,
    });
    segNodes.push(seg);
    parent = seg;
  }
  const thorax = k.blob(k.root, { rx: 0.06, ry: 0.07, rz: 0.1, at: [0, 0.44, 0.1], color: darkOf(col), name: "thorax" });
  const head = k.blob(thorax, { r: 0.07, at: [0, 0.04, 0.09], color: darkOf(col), name: "head" });
  for (const s of [1, -1]) {
    k.blob(head, { name: `eye${s}`, r: 0.055, at: [s * 0.05, 0.03, 0.04], color: col.accent ?? shade(col.base, 0.3) });
    k.blob(head, { name: `pupil${s}`, r: 0.025, at: [s * 0.06, 0.03, 0.08], color: ink });
  }
  for (const s of [1, -1]) {
    for (const [i, dz] of [0.02, -0.1].entries()) {
      const w = k.blob(thorax, {
        rx: 0.3, ry: 0.012, rz: 0.045, name: `wing${i}${s}`,
        at: [s * 0.28, 0.06, dz], pivot: [s * 0.04, 0.05, dz], rotZ: s * 0.06,
        color: shade(col.accent ?? col.base, 0.4),
      });
      k.cute.swing(w, { axis: "y", amp: s * 0.1, dur: 0.55, phase: i * 0.2 });
    }
  }
  for (const s of [1, -1]) {
    k.tube(thorax, { name: `leg${s}`, r: 0.01, h: 0.1, at: [s * 0.04, -0.04, 0.02], rotZ: s * -1.2, color: ink });
  }
  k.idle({ breatheK: 0.03, bobAmp: 0.01 });
}

function hymenoptera(k, col, opt = {}) {
  const ant = opt.kind === "ant";
  const body = k.blob(k.root, {
    rx: ant ? 0.055 : 0.09, ry: ant ? 0.05 : 0.09, rz: ant ? 0.13 : 0.16,
    at: [0, ant ? 0.16 : 0.3, -0.05], color: col.base, name: "gaster",
  });
  // stripes
  if (opt.stripes !== false && !ant) {
    for (const [i, dz] of [0.05, -0.02, -0.09].entries()) {
      k.blob(body, { name: `stripe${i}`, rx: 0.094, ry: 0.092, rz: 0.03, at: [0, 0, dz], color: col.dark ?? ink });
    }
  }
  const thorax = k.blob(k.root, {
    r: ant ? 0.045 : 0.075, at: [0, ant ? 0.16 : 0.3, 0.12], color: col.thorax ?? col.base, name: "thorax",
  });
  const head = k.blob(thorax, { r: ant ? 0.05 : 0.07, at: [0, 0.01, 0.1], color: col.head ?? col.base, name: "head" });
  if (opt.mandibles) {
    for (const s of [1, -1]) k.cone(head, { name: `mand${s}`, r: 0.012, h: 0.11, at: [s * 0.02, -0.01, 0.06], rotX: Math.PI / 2, rotZ: s * 0.15, color: darkOf(col) });
  }
  k.antennae(head, { at: [0, 0.05, 0.02], len: ant ? 0.09 : 0.07, r: 0.008, spread: 0.55, color: darkOf(col) });
  k.bugLegs(k.root, { at: [0, ant ? 0.14 : 0.27, 0.05], r: ant ? 0.008 : 0.01, len: ant ? 0.1 : 0.12, color: darkOf(col) });
  if (!ant) {
    for (const s of [1, -1]) {
      const w = k.blob(thorax, {
        rx: 0.11, ry: 0.012, rz: 0.16, name: `wing${s}`,
        at: [s * 0.05, 0.09, -0.06], pivot: [s * 0.01, 0.06, -0.02], rotX: -0.35, rotZ: s * 0.35,
        color: shade(col.paper ?? APP.paper, -0.05),
      });
      k.cute.swing(w, { axis: "z", amp: s * 0.3, dur: 0.4 });
    }
    k.cone(body, { name: "sting", r: 0.02, h: 0.08, at: [0, 0, -0.18], rotX: -Math.PI / 2, color: ink });
  }
  k.face(head, { r: ant ? 0.05 : 0.07, eyeR: 0.34, gap: 0.5, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.04, bobAmp: ant ? 0.01 : 0.03 });
}

function coleoptera(k, col, opt = {}) {
  const body = k.blob(k.root, {
    rx: 0.17, ry: 0.12, rz: 0.22, at: [0, 0.14, -0.03], color: col.base, name: "shell",
    colorFn: col.shellGrad,
  });
  const head = k.blob(body, { r: 0.09, at: [0, 0.02, 0.24], color: col.dark ?? ink, name: "head" });
  if (opt.horn) {
    k.cone(head, { name: "horn", r: 0.025, h: 0.18, at: [0, 0.08, 0.08], rotX: 0.5, color: shade(col.accent ?? col.base, -0.1) });
  }
  if (opt.snout) {
    k.tube(head, { name: "snout", r: 0.022, h: 0.14, at: [0, 0, 0.1], rotX: Math.PI / 2 - 0.5, color: col.dark ?? ink });
  }
  k.antennae(head, { at: [0, 0.05, 0.02], len: opt.longhorn ? 0.4 : 0.1, r: 0.009, spread: opt.longhorn ? 1.2 : 0.6, wiggle: !opt.longhorn, color: col.dark ?? ink });
  k.bugLegs(k.root, { at: [0, 0.09, 0.05], r: 0.014, len: 0.14, color: col.dark ?? ink });
  if (opt.ladybird) {
    for (const [x, z] of [[0.07, 0.1], [-0.07, 0.1], [0, 0.16], [0.09, -0.06], [-0.09, -0.06], [0, -0.14]]) {
      k.blob(body, { name: `dot${x}${z}`, r: 0.028, at: [x, 0.11, z], color: ink, subdiv: 0 });
    }
  }
  k.face(head, { r: 0.09, eyeR: 0.32, gap: 0.55, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.03, bobAmp: 0.008 });
}

function orthoptera(k, col, opt = {}) {
  const body = k.blob(k.root, {
    rx: 0.09, ry: 0.09, rz: 0.26, at: [0, 0.2, -0.02], rotX: -0.12, color: col.base, name: "body",
  });
  const head = k.blob(body, { r: 0.1, at: [0, 0.07, 0.24], color: col.head ?? col.base, name: "head" });
  k.antennae(head, { at: [0, 0.08, 0], len: opt.kind === "cricket" ? 0.3 : 0.42, r: 0.008, spread: 0.5, color: darkOf(col) });
  // big folded hind legs
  for (const s of [1, -1]) {
    k.blob(body, { name: `thigh${s}`, rx: 0.045, ry: 0.13, rz: 0.045, at: [s * 0.1, -0.08, -0.06], rotZ: s * 0.5, rotX: -0.5, color: darkOf(col) });
    k.tube(body, { name: `shin${s}`, r: 0.016, h: 0.2, at: [s * 0.16, -0.14, -0.16], rotZ: s * -0.5, rotX: 0.9, color: darkOf(col) });
  }
  // folded wing along the back
  k.blob(body, { name: "wingcase", rx: 0.06, ry: 0.02, rz: 0.24, at: [0, 0.08, -0.06], rotX: 0.12, color: shade(col.base, -0.12) });
  k.bugLegs(k.root, { at: [0, 0.14, 0.14], r: 0.012, len: 0.12, color: darkOf(col) });
  k.face(head, { r: 0.1, eyeR: 0.32, gap: 0.55, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.05, bobAmp: 0.02 });
}

function hemiptera(k, col, opt = {}) {
  if (opt.kind === "cicada") {
    const body = k.blob(k.root, { rx: 0.11, ry: 0.1, rz: 0.2, at: [0, 0.22, 0], color: col.base, name: "body" });
    const head = k.blob(body, { rx: 0.12, ry: 0.08, rz: 0.06, at: [0, 0.03, 0.2], color: darkOf(col), name: "head" });
    for (const s of [1, -1]) {
      k.blob(head, { name: `eye${s}`, r: 0.05, at: [s * 0.1, 0.02, 0.02], color: col.accent ?? shade(col.base, 0.3) });
      k.blob(head, { name: `pupil${s}`, r: 0.02, at: [s * 0.11, 0.02, 0.06], color: ink });
      const w = k.blob(body, { rx: 0.08, ry: 0.015, rz: 0.3, name: `wing${s}`, at: [s * 0.08, 0.07, -0.08], pivot: [s * 0.03, 0.06, 0.08], rotY: s * 0.12, color: shade(col.base, 0.35) });
      k.cute.swing(w, { axis: "z", amp: s * 0.06, dur: 0.7 });
    }
    k.bugLegs(k.root, { at: [0, 0.16, 0.08], r: 0.012, len: 0.13, color: darkOf(col) });
    k.idle({ breatheK: 0.05, bobAmp: 0.015 });
    return;
  }
  const body = k.blob(k.root, { rx: 0.16, ry: 0.08, rz: 0.2, at: [0, 0.12, -0.02], color: col.base, name: "body" });
  k.blob(body, { name: "pronotum", rx: 0.13, ry: 0.06, rz: 0.08, at: [0, 0.04, 0.14], color: darkOf(col) });
  const head = k.blob(body, { r: 0.07, at: [0, 0.02, 0.22], color: darkOf(col), name: "head" });
  k.bugLegs(k.root, { at: [0, 0.09, 0.06], r: 0.012, len: 0.13, color: darkOf(col) });
  k.face(head, { r: 0.07, eyeR: 0.32, gap: 0.5, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.05, bobAmp: 0.012 });
}

function diptera(k, col, opt = {}) {
  const mos = opt.kind === "mosquito";
  const body = k.blob(k.root, {
    rx: mos ? 0.035 : 0.08, ry: mos ? 0.035 : 0.08, rz: mos ? 0.12 : 0.14,
    at: [0, mos ? 0.3 : 0.24, 0], color: col.base, name: "abdomen",
  });
  if (opt.stripes) for (const [i, dz] of [0.04, -0.03].entries()) {
    k.blob(body, { name: `stripe${i}`, rx: 0.084, ry: 0.082, rz: 0.025, at: [0, 0, dz], color: ink });
  }
  const thorax = k.blob(k.root, { r: mos ? 0.045 : 0.075, at: [0, mos ? 0.3 : 0.24, 0.13], color: darkOf(col), name: "thorax" });
  const head = k.blob(thorax, { r: mos ? 0.04 : 0.065, at: [0, 0.01, 0.09], color: darkOf(col), name: "head" });
  if (mos) {
    k.tube(head, { name: "proboscis", r: 0.008, h: 0.18, at: [0, 0, 0.06], rotX: Math.PI / 2 + 0.35, color: ink });
  }
  for (const s of [1, -1]) {
    k.blob(head, { name: `eye${s}`, r: mos ? 0.035 : 0.05, at: [s * 0.045, 0.02, 0.03], color: col.accent ?? hex("#c03040") });
    k.blob(head, { name: `pupil${s}`, r: 0.018, at: [s * 0.055, 0.02, 0.07], color: ink });
  }
  for (const s of [1, -1]) {
    const w = k.blob(thorax, {
      rx: mos ? 0.09 : 0.13, ry: 0.012, rz: mos ? 0.06 : 0.1,
      name: `wing${s}`, at: [s * 0.06, 0.07, -0.02], pivot: [s * 0.01, 0.04, 0], rotZ: s * 0.4,
      color: shade(col.base, 0.45),
    });
    k.cute.swing(w, { axis: "z", amp: s * 0.25, dur: 0.28 });
  }
  k.antennae(head, { at: [0, 0.05, 0], len: 0.07, r: 0.007, spread: 0.6, wiggle: false, color: ink });
  for (const s of [1, -1]) {
    for (let i = 0; i < 3; i += 1) {
      k.tube(k.root, {
        name: `leg${i}${s}`, r: 0.008, h: mos ? 0.22 : 0.14,
        at: [s * 0.03, 0.2, 0.06 - i * 0.07], rotZ: s * -1.3, rotX: 0.4 - i * 0.4, color: ink,
      });
    }
  }
  k.idle({ breatheK: 0.04, bobAmp: 0.05 });
}

function mantis(k, col) {
  const body = k.blob(k.root, { rx: 0.06, ry: 0.22, rz: 0.06, at: [0, 0.3, 0], rotX: -0.25, color: col.base, name: "body" });
  const head = k.blob(body, { rx: 0.07, ry: 0.06, rz: 0.06, at: [0, 0.26, 0.05], color: col.base, name: "head" });
  for (const s of [1, -1]) {
    k.blob(head, { name: `eye${s}`, r: 0.04, at: [s * 0.06, 0.02, 0.03], color: shade(col.base, 0.25) });
    k.blob(head, { name: `pupil${s}`, r: 0.018, at: [s * 0.07, 0.02, 0.06], color: ink });
    // folded foreleg
    k.blob(body, { name: `fore${s}`, rx: 0.02, ry: 0.1, rz: 0.02, at: [s * 0.05, 0.02, 0.12], rotX: 1.2, color: darkOf(col) });
    k.tube(body, { name: `forelow${s}`, r: 0.012, h: 0.09, at: [s * 0.05, -0.1, 0.19], rotX: 2.4, color: darkOf(col) });
    k.tube(body, { name: `leg${s}1`, r: 0.012, h: 0.16, at: [s * 0.06, -0.16, -0.04], rotZ: s * -0.5, color: darkOf(col) });
    k.tube(body, { name: `leg${s}2`, r: 0.012, h: 0.14, at: [s * 0.1, -0.2, -0.14], rotZ: s * -0.9, color: darkOf(col) });
  }
  k.antennae(head, { at: [0, 0.05, 0], len: 0.2, r: 0.007, spread: 0.4, color: darkOf(col) });
  k.cute.swing(body, { axis: "z", amp: 0.06, dur: 2.1 });
  k.idle({ breatheK: 0.04, bobAmp: 0 });
}

function blattodea(k, col, opt = {}) {
  if (opt.kind === "termite") {
    const body = k.blob(k.root, { rx: 0.06, ry: 0.06, rz: 0.18, at: [0, 0.1, -0.04], color: col.base, name: "abdomen" });
    k.tube(k.root, { name: "thorax", r: 0.045, h: 0.06, at: [0, 0.1, 0.12], rotX: Math.PI / 2, color: shade(col.base, 0.1) });
    const head = k.blob(k.root, { rx: 0.055, ry: 0.05, rz: 0.05, at: [0, 0.1, 0.19], color: shade(col.base, 0.05), name: "head" });
    k.antennae(head, { at: [0, 0.03, 0.02], len: 0.1, r: 0.007, color: shade(col.base, -0.15) });
    k.bugLegs(k.root, { at: [0, 0.07, 0.1], r: 0.008, len: 0.09, color: shade(col.base, -0.15) });
    k.face(head, { r: 0.055, eyeR: 0.3, gap: 0.5, smile: false, blush: false, name: "f" });
    k.idle({ breatheK: 0.05, bobAmp: 0.01 });
    return;
  }
  const body = k.blob(k.root, { rx: 0.15, ry: 0.06, rz: 0.22, at: [0, 0.09, -0.03], color: col.base, name: "body" });
  k.blob(body, { name: "wingcase-l", rx: 0.068, ry: 0.055, rz: 0.2, at: [0.038, 0.015, -0.02], color: shade(col.base, 0.08) });
  k.blob(body, { name: "wingcase-r", rx: 0.068, ry: 0.055, rz: 0.2, at: [-0.038, 0.015, -0.02], color: shade(col.base, 0.02) });
  const head = k.blob(body, { r: 0.07, at: [0, 0.01, 0.22], color: darkOf(col), name: "head" });
  k.antennae(head, { at: [0, 0.03, 0.02], len: 0.32, r: 0.008, spread: 0.35, color: ink });
  for (const s of [1, -1]) {
    for (let i = 0; i < 3; i += 1) {
      k.tube(k.root, { name: `leg${i}${s}`, r: 0.01, h: 0.14, at: [s * 0.05, 0.07, 0.1 - i * 0.09], rotZ: s * -1.4, rotX: 0.3 - i * 0.35, color: ink });
    }
  }
  k.face(head, { r: 0.07, eyeR: 0.32, gap: 0.5, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.04, bobAmp: 0.01 });
}

function dermaptera(k, col) {
  const body = k.blob(k.root, { rx: 0.09, ry: 0.05, rz: 0.2, at: [0, 0.08, -0.02], color: col.base, name: "body" });
  const head = k.blob(body, { r: 0.06, at: [0, 0.02, 0.2], color: darkOf(col), name: "head" });
  k.antennae(head, { at: [0, 0.03, 0], len: 0.16, r: 0.007, color: darkOf(col) });
  for (const s of [1, -1]) {
    k.tube(body, { name: `pincer${s}`, r: 0.012, h: 0.12, at: [s * 0.03, 0, -0.24], rotX: Math.PI - 0.5, rotZ: s * 0.2, color: darkOf(col) });
  }
  k.bugLegs(k.root, { at: [0, 0.06, 0.08], r: 0.01, len: 0.1, color: darkOf(col) });
  k.face(head, { r: 0.06, eyeR: 0.3, gap: 0.5, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.04, bobAmp: 0.01 });
}

function phasmatodea(k, col) {
  let parent = k.root;
  const segs = [];
  for (let i = 0; i < 5; i += 1) {
    const seg = k.blob(parent, {
      rx: 0.018, ry: 0.018, rz: 0.13, name: `seg${i}`,
      at: [0, i === 0 ? 0.34 : 0, -0.1], color: i % 2 ? shade(col.base, 0.08) : col.base,
    });
    segs.push(seg);
    parent = seg;
  }
  const head = k.blob(segs[0], { r: 0.045, at: [0, 0.05, 0.12], color: col.base, name: "head" });
  k.antennae(head, { at: [0, 0.03, 0.02], len: 0.12, r: 0.006, color: darkOf(col) });
  for (const s of [1, -1]) {
    for (let i = 0; i < 3; i += 1) {
      k.tube(k.root, { name: `leg${i}${s}`, r: 0.007, h: 0.2, at: [s * 0.02, 0.32 - i * 0.08, 0.05], rotZ: s * -1.2, color: darkOf(col) });
    }
  }
  k.idle({ breatheK: 0.03, bobAmp: 0 });
}

function insectGeneric(k, col) {
  const body = k.blob(k.root, { rx: 0.07, ry: 0.06, rz: 0.14, at: [0, 0.14, 0], color: col.base, name: "body" });
  const head = k.blob(body, { r: 0.06, at: [0, 0.02, 0.14], color: darkOf(col), name: "head" });
  k.antennae(head, { at: [0, 0.04, 0], len: 0.1, r: 0.007, color: darkOf(col) });
  k.bugLegs(k.root, { at: [0, 0.11, 0.05], r: 0.009, len: 0.1, color: darkOf(col) });
  k.blob(body, { name: "wingcase", rx: 0.05, ry: 0.015, rz: 0.1, at: [0, 0.05, -0.04], color: shade(col.base, 0.15) });
  k.face(head, { r: 0.06, eyeR: 0.3, gap: 0.5, smile: false, blush: false, name: "f" });
  k.idle({ breatheK: 0.05, bobAmp: 0.015 });
}

// ---------- arachnids & friends ----------

function spider(k, col, opt = {}) {
  const jumping = opt.kind === "jumping";
  const spiny = opt.kind === "spiny";
  const abd = k.blob(k.root, {
    r: jumping ? 0.11 : 0.16, at: [0, jumping ? 0.16 : 0.18, -0.1],
    color: col.base, name: "abdomen", colorFn: col.shellGrad,
  });
  if (spiny) {
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      k.cone(abd, {
        name: `spike${i}`, r: 0.02, h: 0.09,
        at: [Math.cos(a) * 0.14, 0.08, Math.sin(a) * 0.14], rotZ: -Math.cos(a) * 1.1, rotX: Math.sin(a) * 1.1,
        color: darkOf(col),
      });
    }
  }
  const cephalo = k.blob(k.root, { r: jumping ? 0.1 : 0.08, at: [0, 0.13, 0.08], color: darkOf(col), name: "cephalothorax" });
  for (let i = 0; i < 4; i += 1) {
    for (const s of [1, -1]) {
      k.tube(cephalo, {
        name: `leg${i}${s}`, r: 0.011, h: jumping ? 0.12 : 0.2,
        at: [s * 0.03, 0.11, 0.14 - i * 0.075], rotZ: s * (-1.15 - i * 0.08), rotX: 0.5 - i * 0.3,
        color: darkOf(col),
      });
    }
  }
  if (jumping) {
    for (const s of [1, -1]) {
      k.blob(cephalo, { name: `eye${s}`, r: 0.045, at: [s * 0.045, 0.05, 0.08], color: APP.paper });
      k.blob(cephalo, { name: `pupil${s}`, r: 0.028, at: [s * 0.05, 0.05, 0.115], color: ink });
    }
  } else {
    for (const s of [1, -1]) {
      k.blob(cephalo, { name: `eye${s}`, r: 0.022, at: [s * 0.035, 0.04, 0.07], color: ink });
    }
  }
  k.idle({ breatheK: 0.05, bobAmp: 0.012 });
}

function scorpion(k, col) {
  const body = k.blob(k.root, { rx: 0.12, ry: 0.06, rz: 0.2, at: [0, 0.08, 0], color: col.base, name: "body" });
  let parent = body;
  const tailSegs = [];
  for (let i = 0; i < 4; i += 1) {
    const r = 0.05 - i * 0.007;
    const seg = k.blob(parent, {
      r, name: `tail${i}`, at: [0, 0.05, -0.14 - i * 0.02], rotX: i === 0 ? -0.5 : -0.25,
      color: shade(col.base, -i * 0.04),
    });
    tailSegs.push(seg);
    parent = seg;
  }
  k.cone(parent, { name: "sting", r: 0.015, h: 0.08, at: [0, 0.02, -0.04], rotX: -Math.PI / 2, color: APP.red });
  for (const s of [1, -1]) {
    const arm = k.blob(body, { rx: 0.05, ry: 0.03, rz: 0.08, name: `arm${s}`, at: [s * 0.11, 0.02, 0.16], rotZ: s * -0.4, color: col.base });
    k.blob(arm, { name: `claw${s}`, rx: 0.05, ry: 0.025, rz: 0.06, at: [s * 0.06, 0, 0.06], color: shade(col.base, -0.1) });
    k.cone(arm, { name: `pincer${s}`, r: 0.015, h: 0.06, at: [s * 0.09, 0, 0.1], rotX: Math.PI / 2, color: shade(col.base, -0.1) });
  }
  for (let i = 0; i < 4; i += 1) {
    for (const s of [1, -1]) {
      k.tube(body, { name: `leg${i}${s}`, r: 0.01, h: 0.13, at: [s * 0.06, 0.05, 0.1 - i * 0.06], rotZ: s * -1.2, rotX: 0.3 - i * 0.2, color: darkOf(col) });
    }
  }
  k.idle({ breatheK: 0.04, bobAmp: 0.01 });
}

// ---------- mollusks, myriapods & misc ----------

function snail(k, col, opt = {}) {
  const foot = k.blob(k.root, { rx: 0.11, ry: 0.055, rz: 0.28, at: [0, 0.06, 0.02], color: col.body ?? shade(col.base, 0.4), name: "foot" });
  const head = k.blob(foot, { r: 0.09, at: [0, 0.08, 0.24], color: col.body ?? shade(col.base, 0.4), name: "head" });
  for (const s of [1, -1]) {
    const stalk = k.tube(head, {
      name: `stalk${s}`, r: 0.014, h: 0.16, at: [s * 0.04, 0.07, 0.02],
      rotZ: s * -0.15, rotX: -0.15, color: col.body ?? shade(col.base, 0.4),
    });
    k.blob(stalk, { name: `stalkball${s}`, r: 0.035, at: [0, 0.16, 0], color: APP.paper });
    k.blob(stalk, { name: `stalkpupil${s}`, r: 0.018, at: [0, 0.16, 0.03], color: ink });
    k.cute.swing(stalk, { axis: "x", amp: 0.12, dur: 1.9, phase: s > 0 ? 0 : 0.5 });
    k.tube(head, { name: `tent${s}`, r: 0.01, h: 0.05, at: [s * 0.035, -0.01, 0.07], rotX: 0.9, color: col.body ?? shade(col.base, 0.4) });
  }
  const shelled = opt.kind !== "slug";
  if (shelled) {
    const n = opt.kind === "cone" ? 4 : 3;
    let py = 0.1;
    let pz = -0.05;
    for (let i = 0; i < n; i += 1) {
      const r = (0.13 - i * (opt.kind === "cone" ? 0.024 : 0.033));
      k.blob(k.root, {
        rx: r * 1.1, ry: r * 0.8, rz: r * 1.1, name: `shell${i}`,
        at: [0, py, pz], color: shade(col.base, i * 0.07),
      });
      py += r * 0.9;
      pz -= opt.kind === "cone" ? 0.055 : 0.03;
    }
  } else if (opt.kind === "semislug") {
    k.blob(k.root, { r: 0.06, at: [0, 0.16, -0.06], color: col.base, name: "shellbit" });
  }
  k.idle({ breatheK: 0.05, bobAmp: 0 });
}

function myriapod(k, col, opt = {}) {
  const cent = opt.kind === "centipede";
  const house = opt.kind === "house-centipede";
  const n = cent ? 8 : 7;
  let parent = k.root;
  const segs = [];
  for (let i = 0; i < n; i += 1) {
    const r = 0.065 - i * 0.005;
    const seg = k.blob(parent, {
      rx: r, ry: cent ? r * 0.7 : r, rz: r * 1.3, name: `seg${i}`,
      at: [0, i === 0 ? 0.12 : 0, i === 0 ? 0.12 : -0.14],
      color: opt.banded && i % 2 ? shade(col.base, -0.35) : shade(col.base, -i * 0.02),
    });
    segs.push(seg);
    parent = seg;
  }
  segs.forEach((seg, i) => {
    k.cute.bob(seg, { amp: 0.015, dur: 1.2, phase: i * 0.18 });
  });
  const head = k.blob(k.root, { r: 0.06, at: [0, 0.12, 0.26], color: shade(col.base, -0.15), name: "head" });
  k.antennae(head, { at: [0, 0.02, 0.02], len: cent ? 0.14 : 0.1, r: 0.008, color: darkOf(col) });
  for (let i = 0; i < (house ? 5 : n); i += 1) {
    for (const s of [1, -1]) {
      k.tube(k.root, {
        name: `leg${i}${s}`, r: house ? 0.008 : 0.011, h: house ? 0.16 : 0.07,
        at: [s * 0.04, 0.1, 0.18 - i * 0.11], rotZ: s * -1.3, rotX: 0.2, color: darkOf(col),
      });
    }
  }
  k.idle({ breatheK: 0.03, bobAmp: 0 });
}

function flatworm(k, col) {
  const body = k.blob(k.root, { rx: 0.09, ry: 0.02, rz: 0.3, at: [0, 0.03, 0], color: col.base, name: "body" });
  k.blob(body, { name: "stripe", rx: 0.02, ry: 0.005, rz: 0.28, at: [0, 0.02, 0], color: darkOf(col) });
  k.blob(body, { name: "stripe2", rx: 0.008, ry: 0.005, rz: 0.26, at: [0.045, 0.02, 0], color: darkOf(col) });
  k.blob(body, { name: "stripe3", rx: 0.008, ry: 0.005, rz: 0.26, at: [-0.045, 0.02, 0], color: darkOf(col) });
  k.blob(body, { name: "headfan", rx: 0.14, ry: 0.02, rz: 0.06, at: [0, 0.005, 0.3], color: col.base });
  for (const s of [1, -1]) k.blob(body, { name: `eye${s}`, r: 0.012, at: [s * 0.03, 0.025, 0.33], color: ink });
  k.cute.swing(body, { axis: "z", amp: 0.06, dur: 2.4 });
  k.idle({ breatheK: 0.06, bobAmp: 0 });
}

function crab(k, col) {
  const body = k.blob(k.root, { rx: 0.24, ry: 0.09, rz: 0.18, at: [0, 0.14, 0], color: col.base, name: "body" });
  for (const s of [1, -1]) {
    const arm = k.blob(body, { rx: 0.08, ry: 0.035, rz: 0.05, name: `arm${s}`, at: [s * 0.24, 0.04, 0.1], pivot: [s * 0.12, 0.04, 0.08], rotZ: s * -0.5, color: col.base });
    k.blob(arm, { name: `claw${s}`, rx: 0.07, ry: 0.04, rz: 0.09, at: [s * 0.1, 0.02, 0.02], color: shade(col.base, -0.12) });
    k.cute.swing(arm, { axis: "z", amp: s * 0.15, dur: 1.5, phase: s > 0 ? 0 : 0.4 });
    for (let i = 0; i < 4; i += 1) {
      k.tube(body, {
        name: `leg${i}${s}`, r: 0.014, h: 0.14,
        at: [s * 0.14, 0.02, 0.05 - i * 0.05], rotZ: s * -1.3, rotX: 0.2 - i * 0.25, color: darkOf(col),
      });
    }
  }
  for (const s of [1, -1]) {
    const stalk = k.tube(body, { name: `stalk${s}`, r: 0.012, h: 0.07, at: [s * 0.06, 0.1, 0.12], rotZ: s * -0.1, color: darkOf(col) });
    k.blob(stalk, { name: `eye${s}`, r: 0.03, at: [0, 0.07, 0], color: APP.paper });
    k.blob(stalk, { name: `pupil${s}`, r: 0.016, at: [0, 0.07, 0.025], color: ink });
  }
  k.cute.bob(k.root, { amp: 0.02, dur: 1.8 });
  k.cute.breathe(k.root, { k: 0.03 });
}

function pillbug(k, col) {
  let parent = k.root;
  for (let i = 0; i < 4; i += 1) {
    const r = 0.09 - i * 0.012;
    parent = k.blob(parent, {
      rx: r, ry: r * 0.85, rz: r * 1.1, name: `seg${i}`,
      at: [0, i === 0 ? 0.1 : 0, i === 0 ? 0 : -0.12], color: shade(col.base, i * 0.05),
    });
  }
  const head = k.blob(parent, { r: 0.045, at: [0, -0.02, -0.1], color: darkOf(col), name: "head" });
  k.antennae(head, { at: [0, 0.02, 0.02], len: 0.07, r: 0.006, color: darkOf(col) });
  for (let i = 0; i < 4; i += 1) {
    for (const s of [1, -1]) {
      k.tube(k.root, { name: `leg${i}${s}`, r: 0.008, h: 0.05, at: [s * 0.07, 0.06, 0.05 - i * 0.08], rotZ: s * -1.4, color: darkOf(col) });
    }
  }
  k.idle({ breatheK: 0.05, bobAmp: 0.008 });
}

function worm(k, col) {
  let parent = k.root;
  for (let i = 0; i < 6; i += 1) {
    parent = k.blob(parent, {
      r: 0.028 - i * 0.002, name: `seg${i}`,
      at: [0, i === 0 ? 0.05 : 0, i === 0 ? 0 : -0.05], color: shade(col.base, i * 0.05),
    });
    k.cute.bob(parent, { amp: 0.012, dur: 1.4, phase: i * 0.25 });
  }
  k.idle({ breatheK: 0.04, bobAmp: 0 });
}

export const fauna = {
  bird, mammal, frog, lizard, snake, fish, lepidoptera, odonata, hymenoptera,
  coleoptera, orthoptera, hemiptera, diptera, mantis, blattodea, dermaptera,
  phasmatodea, insectGeneric, spider, scorpion, snail, myriapod, flatworm,
  crab, pillbug, worm,
};
