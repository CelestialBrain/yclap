/**
 * Build the Field Guide companion character — four growth stages from the 3D
 * build spec (T4.3): egg → seedling → sapling → tree. Same cute kit as the
 * species pack, so the buddy and the wildlife share one art style.
 *
 * Output: public/model/character-egg.glb, character-seedling.glb,
 * character-sapling.glb, character-tree.glb, plus character.glb (the full
 * tree — the default file at the CHARACTER_MODEL_SLOT path).
 *
 * Usage: node script/build-character-model.mjs
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Kit, APP, LEAVES, grad, shade, hex } from "./species-model/kit.mjs";
import { flora } from "./species-model/flora.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "public", "model");

const hex2 = hex;
const leaf = LEAVES[0];
const leafDeep = APP.greenDeep;
const trunk = hex2("#8a5a33");

function soil(k, r = 0.16) {
  k.blob(k.root, {
    name: "soil", rx: r * 1.6, ry: r * 0.55, rz: r * 1.3, at: [0, r * 0.3, 0],
    color: hex2("#6b4a2f"),
  });
}

// 1 — egg: white, wobbling, waiting
function egg() {
  const k = new Kit({ species_code: "character-egg", scientific_name: "field guide egg" }, { idleDur: 2.0 });
  soil(k);
  const shell = k.blob(k.root, {
    name: "shell", rx: 0.17, ry: 0.22, rz: 0.17, at: [0, 0.3, 0],
    color: hex2("#f6f1e4"),
  });
  k.arc(shell, { name: "crack", R: 0.09, r: 0.018, a0: Math.PI * 1.05, a1: Math.PI * 1.5, at: [0.02, 0.12, 0.14], rotX: 0.25, rotY: -0.3, color: hex2("#c9bfa8"), segs: 5 });
  k.face(shell, { r: 0.17, gap: 0.42, eyeR: 0.32, blink: true });
  k.cute.swing(k.root, { axis: "z", amp: 0.09, dur: 1.1, phase: 0.2 });
  k.cute.breathe(k.root, { k: 0.02 });
  return k.finish();
}

// 2 — seedling: sprouted, two proud leaves
function seedling() {
  const k = new Kit({ species_code: "character-seedling", scientific_name: "field guide seedling" }, { idleDur: 2.0 });
  soil(k);
  const stem = k.tube(k.root, { name: "stem", r: 0.028, r2: 0.02, h: 0.2, color: leafDeep, seg: 6 });
  for (const s of [1, -1]) {
    k.blob(stem, {
      name: `leaf${s}`, rx: 0.11, ry: 0.016, rz: 0.07,
      at: [s * 0.09, 0.2, 0.01], pivot: [s * 0.015, 0.2, 0],
      rotZ: s * -0.55, color: s > 0 ? leaf : leafDeep,
      colorFn: grad(shade(leaf, 0.2), leafDeep, -0.02, 0.02),
    });
  }
  const heart = k.blob(stem, { name: "heart", r: 0.06, at: [0, 0.24, 0.02], color: leaf });
  k.face(heart, { r: 0.06, gap: 0.42, eyeR: 0.36, blink: true });
  k.cute.swing(heart, { axis: "z", amp: 0.12, dur: 2.0 });
  k.cute.breathe(k.root, { k: 0.03 });
  return k.finish();
}

// 3 — sapling: a trunk and a proper little crown
function sapling() {
  const k = new Kit({ species_code: "character-sapling", scientific_name: "field guide sapling" }, { idleDur: 2.2 });
  soil(k, 0.18);
  const trunkNode = k.tube(k.root, { name: "trunk", r: 0.055, r2: 0.04, h: 0.34, color: trunk, seg: 7 });
  k.face(trunkNode, { center: [0, 0.17, 0.055], r: 0.055, gap: 0.42, eyeR: 0.36, blink: true });
  for (const [i, [x, y, z, r]] of [[0, 0.44, 0, 0.2], [0.13, 0.36, 0.04, 0.14], [-0.12, 0.38, -0.03, 0.14]].entries()) {
    const c = k.blob(trunkNode, {
      name: `canopy${i}`, r, at: [x, y, z],
      color: i % 2 ? leaf : leafDeep,
      colorFn: grad(shade(leaf, 0.2), leafDeep, -0.25, 0.25),
    });
    k.cute.swing(c, { axis: "x", amp: 0.03, dur: 2.4 + i * 0.3, phase: i * 0.4 });
  }
  k.cute.breathe(k.root, { k: 0.018 });
  return k.finish();
}

// 4 — tree: the full companion, fruit and all
function tree() {
  const k = new Kit({ species_code: "character-tree", scientific_name: "field guide tree" }, { idleDur: 2.4 });
  soil(k, 0.2);
  const opt = { thick: true, trunkH: 0.42, fruit: true, fruitCount: 5, blobs: 4 };
  flora.tree(k, { base: leaf, dark: leafDeep, trunk, accent: APP.orange }, opt);
  return k.finish();
}

for (const [name, bytes] of [
  ["character-egg.glb", egg()],
  ["character-seedling.glb", seedling()],
  ["character-sapling.glb", sapling()],
  ["character-tree.glb", tree()],
  ["character.glb", tree()],
]) {
  writeFileSync(join(out, name), bytes);
  console.log(`${name} ${(bytes.length / 1024).toFixed(1)} kB`);
}
