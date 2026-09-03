/** Dump node tree + bounds of one generated model. Usage: node inspect.mjs <code> */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const code = process.argv[2] ?? "passer-montanus";
const buf = readFileSync(join(import.meta.dirname, "..", "..", "public", "model", "species", `${code}.glb`));
const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
const jsonLen = dv.getUint32(12, true);
const json = JSON.parse(new TextDecoder().decode(buf.slice(20, 20 + jsonLen)));

console.log(`nodes: ${json.nodes.length}, meshes: ${json.meshes.length}`);
json.nodes.forEach((n, i) => {
  console.log(
    `${i} ${n.name} mesh=${n.mesh ?? "-"} t=[${(n.translation ?? []).map((v) => v.toFixed(2))}] children=[${n.children ?? "-"}]`,
  );
});
let min = [1e9, 1e9, 1e9], max = [-1e9, -1e9, -1e9];
for (const m of json.meshes) {
  const a = json.accessors[m.primitives[0].attributes.POSITION];
  for (let k = 0; k < 3; k += 1) {
    min[k] = Math.min(min[k], a.min[k]);
    max[k] = Math.max(max[k], a.max[k]);
  }
}
console.log("mesh-local bounds min", min.map((v) => v.toFixed(2)), "max", max.map((v) => v.toFixed(2)));
const acc0 = json.meshes[0].primitives[0];
console.log("mesh0 attrs:", JSON.stringify(acc0.attributes), "verts:", json.accessors[acc0.attributes.POSITION].count);
