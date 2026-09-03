/** Smoke-test the engine: build one bird, validate the GLB bytes. */
import { Kit, APP, BIRDS } from "./kit.mjs";

const spec = { species_code: "smoke-bird", scientific_name: "Passer smokeus" };
const k = new Kit(spec, { idleDur: 1.4 });
const base = BIRDS[0];
const body = k.blob(k.root, { rx: 0.3, ry: 0.26, rz: 0.26, at: [0, 0.3, 0], color: base, name: "body" });
const head = k.blob(body, { r: 0.24, at: [0, 0.3, 0.06], color: base, name: "head" });
k.cone(head, { name: "beak", r: 0.05, h: 0.16, at: [0, 0, 0.26], rotX: Math.PI / 2, color: APP.orange });
k.blob(body, { name: "wing-l", rx: 0.2, ry: 0.05, rz: 0.13, at: [0.22, 0.02, 0], pivot: [0.06, 0.02, 0], color: APP.ink });
k.face(head, { r: 0.24, eyeR: 0.075, blink: true });
k.cute.swing(body, { axis: "x", base: 0, amp: 0.3, dur: 1.4 });
k.idle();

const glb = k.finish();
console.log("bytes:", glb.length);

// parse back
const dv = new DataView(glb.buffer, glb.byteOffset, glb.byteLength);
if (dv.getUint32(0, true) !== 0x46546c67) throw new Error("bad magic");
if (dv.getUint32(4, true) !== 2) throw new Error("bad version");
const jsonLen = dv.getUint32(12, true);
const json = JSON.parse(new TextDecoder().decode(glb.slice(20, 20 + jsonLen)));
console.log("nodes:", json.nodes.length, "meshes:", json.meshes.length, "anims:", json.animations?.length);
const verts = json.accessors.filter((a) => a.type === "VEC3" && a.componentType === 5126).reduce((s, a) => s + a.count, 0);
console.log("pos verts:", verts);
const anim = json.animations[0];
if (anim.name !== "idle") throw new Error("clip must be idle");
const chans = anim.channels.map((c) => c.target.path).join(",");
console.log("channels:", chans);
// root scene check
const sceneNodes = json.scenes[0].nodes;
if (!sceneNodes || sceneNodes.length < 1) throw new Error("empty scene");
console.log("scene roots:", sceneNodes.map((i) => json.nodes[i].name));
console.log("OK");
