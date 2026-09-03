/**
 * Zero-dependency glTF 2.0 (.glb) writer for the cute species-model pack.
 *
 * Everything is flat-shaded low-poly built from icosphere/cone/cylinder
 * primitives with per-vertex colors — no textures, no external packages.
 * Animation is node-transform only (rotation/translation/scale channels on an
 * "idle" clip), which every glTF viewer (model-viewer included) plays.
 *
 * Coordinate sense used across the pack: +Y up, creature faces +Z, ground at
 * y=0, whole model inside roughly a 1-unit box so one gallery camera fits all.
 */

// ---------- color ----------

export function hex(hexStr) {
  const n = parseInt(hexStr.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };
  return [f(0), f(8), f(4)];
}

export function mix(c1, c2, t) {
  return [c1[0] + (c2[0] - c1[0]) * t, c1[1] + (c2[1] - c1[1]) * t, c1[2] + (c2[2] - c1[2]) * t];
}

export function shade(c, k) {
  // k > 0 lighten toward paper, k < 0 darken toward ink
  return k >= 0 ? mix(c, [0.98, 0.98, 0.96], k) : mix(c, [0.12, 0.13, 0.13], -k);
}

export function pick(list, seed, jitter = 0) {
  const s = typeof seed === "number" ? Math.abs(Math.floor(seed)) : hash32(String(seed));
  const c = list[s % list.length];
  return jitter ? jitterColor(c, s, jitter) : c;
}

export function jitterColor(c, seed, amount) {
  const h = (hash32(String(seed)) % 1000) / 1000 - 0.5;
  return shade(c, h * 2 * amount);
}

export function hash32(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---------- mat4 (column-major) ----------

const M = () => new Float32Array(16);

export function mIdentity() {
  const m = M();
  m[0] = m[5] = m[10] = m[15] = 1;
  return m;
}

export function mMul(a, b) {
  const out = M();
  for (let c = 0; c < 4; c += 1)
    for (let r = 0; r < 4; r += 1) {
      let v = 0;
      for (let k = 0; k < 4; k += 1) v += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = v;
    }
  return out;
}

export function mT([x, y, z]) {
  const m = mIdentity();
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

export function mS([x, y, z]) {
  const m = mIdentity();
  m[0] = x;
  m[5] = y;
  m[10] = z;
  return m;
}

export function mRx(a) {
  const m = mIdentity();
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[5] = c;
  m[6] = s;
  m[9] = -s;
  m[10] = c;
  return m;
}

export function mRy(a) {
  const m = mIdentity();
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c;
  m[2] = -s;
  m[8] = s;
  m[10] = c;
  return m;
}

export function mRz(a) {
  const m = mIdentity();
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c;
  m[1] = s;
  m[4] = -s;
  m[5] = c;
  return m;
}

/** Apply ops left-to-right: compose(mS, mRx, mT) scales, tilts, then moves. */
export function mCompose(...ops) {
  let m = mIdentity();
  for (const op of ops) m = mMul(m, op);
  return m;
}

export function apply(m, [x, y, z]) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

export function quatAxisAngle(axis, rad) {
  const [x, y, z] = axis;
  const len = Math.hypot(x, y, z) || 1;
  const s = Math.sin(rad / 2);
  return [(x / len) * s, (y / len) * s, (z / len) * s, Math.cos(rad / 2)];
}

export function quatMul(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

// ---------- primitives ----------

const icoCache = new Map();

/** Unit icosphere. subdiv 0 = 20 faces, 1 = 80 faces. */
export function icosphere(subdiv) {
  const key = String(subdiv);
  if (icoCache.has(key)) return icoCache.get(key);

  const t = (1 + Math.sqrt(5)) / 2;
  const verts = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(norm3);
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  let pos = verts;
  let idx = faces;
  for (let s = 0; s < subdiv; s += 1) {
    const cache = new Map();
    const mid = (a, b) => {
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (cache.has(key)) return cache.get(key);
      const m = norm3([
        (pos[a][0] + pos[b][0]) / 2,
        (pos[a][1] + pos[b][1]) / 2,
        (pos[a][2] + pos[b][2]) / 2,
      ]);
      pos.push(m);
      cache.set(key, pos.length - 1);
      return pos.length - 1;
    };
    const next = [];
    for (const [a, b, c] of idx) {
      const ab = mid(a, b);
      const bc = mid(b, c);
      const ca = mid(c, a);
      next.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    idx = next;
  }
  const geo = { positions: pos, indices: idx };
  icoCache.set(key, geo);
  return geo;
}

function norm3([x, y, z]) {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

/** Truncated cone along +Y from y=0 to y=h, radius r1 at base, r2 at top. */
export function cylinderGeo(r1, r2, h, seg = 7) {
  const positions = [];
  const indices = [];
  for (let i = 0; i <= seg; i += 1) {
    const a = (i / seg) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    positions.push([c * r1, 0, s * r1], [c * r2, h, s * r2]);
  }
  for (let i = 0; i < seg; i += 1) {
    const a = i * 2;
    indices.push([a, a + 1, a + 2], [a + 1, a + 3, a + 2]);
  }
  // caps (top disc at y=h, base disc at y=0)
  const topC = positions.length;
  positions.push([0, h, 0]);
  const baseC = positions.length;
  positions.push([0, 0, 0]);
  for (let i = 0; i < seg; i += 1) {
    const a = i * 2;
    indices.push([a + 1, topC, a + 3]);
    indices.push([a, baseC, a + 2]);
  }
  return { positions, indices };
}

/** Square-tube torus arc in the XY plane (around +Z), angles in radians. */
export function torusArcGeo(R, r, a0, a1, segs = 8) {
  const positions = [];
  const indices = [];
  for (let i = 0; i <= segs; i += 1) {
    const a = a0 + ((a1 - a0) * i) / segs;
    const cx = Math.cos(a) * R;
    const cy = Math.sin(a) * R;
    positions.push(
      [cx - r, cy - r, 0], [cx + r, cy - r, 0], [cx + r, cy + r, 0], [cx - r, cy + r, 0],
    );
  }
  for (let i = 0; i < segs; i += 1) {
    const a = i * 4;
    indices.push([a, a + 1, a + 4], [a + 1, a + 5, a + 4]);
    indices.push([a + 1, a + 2, a + 5], [a + 2, a + 6, a + 5]);
    indices.push([a + 2, a + 3, a + 6], [a + 3, a + 7, a + 6]);
    indices.push([a + 3, a, a + 7], [a, a + 4, a + 7]);
  }
  return { positions, indices };
}

// ---------- scene ----------

/**
 * A cute model under construction. Each part becomes one mesh on one node, so
 * animation targets exactly the parts that should move, and mirrored parts can
 * share one mesh (`linkMesh`) to keep files small.
 */
export class Cute {
  constructor(name, { idleDur = 1.6 } = {}) {
    this.name = name;
    this.idleDur = idleDur;
    this.nodes = [];
    this.channels = [];
    this.root = this.node("root");
  }

  node(name, { parent = null, at = [0, 0, 0], rot = null, scale = [1, 1, 1], meshOf = null } = {}) {
    const node = {
      name,
      parent: parent ?? this.root,
      at,
      rot, // euler [x,y,z] radians — exported as quaternion
      scale,
      parts: [],
      meshOf,
      anim: [],
    };
    this.nodes.push(node);
    return node;
  }

  /**
   * Add a transformed primitive to a node.
   * geo: {positions, indices} in unit/local space.
   * opts: {at, rotX, rotY, rotZ, scale, color | colorFn, subdiv}
   */
  add(node, geo, opts = {}) {
    const { at = [0, 0, 0], rotX = 0, rotY = 0, rotZ = 0, scale = [1, 1, 1], color, colorFn } = opts;
    const m = mCompose(
      mS(scale),
      rotX ? mRx(rotX) : mIdentity(),
      rotY ? mRy(rotY) : mIdentity(),
      rotZ ? mRz(rotZ) : mIdentity(),
      mT(at),
    );
    const positions = geo.positions.map((p) => apply(m, p));
    node.parts.push({ positions, indices: geo.indices, color, colorFn });
    return node;
  }

  /** Convenience: create a node holding one primitive. */
  blob(parent, geo, opts = {}) {
    const { name = "part", at = [0, 0, 0], rot = null, ...rest } = opts;
    const node = this.node(name, { parent, at, rot });
    this.add(node, geo, rest);
    return node;
  }

  /** Second node reusing another node's mesh (for mirrored pairs). */
  linkMesh(src, dst) {
    dst.meshOf = src;
    return dst;
  }

  // ---- idle-clip helpers (all sample a seamless sine loop) ----

  samples(dur, phase, n = 10) {
    const times = [];
    const at = (i) => phase + (dur * i) / n;
    for (let i = 0; i < n; i += 1) times.push(at(i) % dur);
    // ensure strictly ascending times (phase wrapping can collide)
    for (let i = 1; i < times.length; i += 1) if (times[i] <= times[i - 1]) times[i] = times[i - 1] + 1e-4;
    times.push(dur);
    return times;
  }

  /** Rotation swing around one axis, radians, around the node's rest pose. */
  swing(node, { axis = "z", base = 0, amp = 0.4, dur, phase = 0, n = 10 } = {}) {
    const D = dur ?? this.idleDur;
    const ax = axis === "x" ? [1, 0, 0] : axis === "y" ? [0, 1, 0] : [0, 0, 1];
    const times = this.samples(D, phase, n);
    const vals = times.map((t) => quatAxisAngle(ax, base + amp * Math.sin(2 * Math.PI * (t / D))));
    this.channels.push({ node, path: "rotation", times, vals, vec: 4 });
  }

  /** Y bob around the node's rest translation. */
  bob(node, { amp = 0.05, dur, phase = 0, n = 10 } = {}) {
    const D = dur ?? this.idleDur;
    const times = this.samples(D, phase, n);
    const vals = times.map((t) => [node.at[0], node.at[1] + amp * Math.sin(2 * Math.PI * (t / D)), node.at[2]]);
    this.channels.push({ node, path: "translation", times, vals, vec: 3 });
  }

  /** Squash-and-stretch breathing on the node's scale. */
  breathe(node, { k = 0.05, dur, phase = 0, n = 10 } = {}) {
    const D = dur ?? this.idleDur;
    const times = this.samples(D, phase, n);
    const vals = times.map((t) => {
      const s = Math.sin(2 * Math.PI * (t / D));
      return [1 - k * 0.5 * s, 1 + k * s, 1 - k * 0.5 * s];
    });
    this.channels.push({ node, path: "scale", times, vals, vec: 3 });
  }

  /** One quick blink at fraction t0 of the clip (scale-y squash on the eyes). */
  blink(node, { dur, at = 0.55, span = 0.14 } = {}) {
    const D = dur ?? this.idleDur;
    const t1 = D * at;
    const times = [0, t1, t1 + span / 2, t1 + span, D];
    const vals = [
      [1, 1, 1], [1, 1, 1], [1, 0.06, 1], [1, 1, 1], [1, 1, 1],
    ];
    this.channels.push({ node, path: "scale", times, vals, vec: 3 });
  }

  // ---- export ----

  toGLB() {
    // node indices in creation order; root first
    const nodeIndex = new Map(this.nodes.map((n, i) => [n, i]));

    // resolve meshes: a node either owns merged parts or links to another node
    const buffers = []; // {data: Uint8Array, target}
    const accessors = [];
    const bufferViews = [];
    let offset = 0;

    const pushView = (bytes, target) => {
      const pad = (4 - (offset % 4)) % 4;
      if (pad) buffers.push({ data: new Uint8Array(pad), target: 0 });
      offset += pad;
      const view = { buffer: 0, byteOffset: offset, byteLength: bytes.byteLength };
      if (target) view.target = target;
      bufferViews.push(view);
      buffers.push({ data: bytes, target });
      offset += bytes.byteLength;
      return bufferViews.length - 1;
    };

    const pushAccessor = (typed, componentType, type, count, extras = {}, target) => {
      const view = pushView(new Uint8Array(typed.buffer, typed.byteOffset, typed.byteLength), target);
      accessors.push({ bufferView: view, componentType, type, count, ...extras });
      return accessors.length - 1;
    };

    const meshes = [];
    const meshKey = new Map(); // src node -> mesh index

    // First pass: nodes that own parts
    const owners = this.nodes.filter((n) => !n.meshOf && n.parts.length > 0);
    for (const node of owners) {
      const positions = [];
      const normals = [];
      const colors = [];
      const indices = [];
      for (const part of node.parts) {
        const base = positions.length / 3;
        // flat shading: duplicate every vertex per face so normals are per-face
        let vi = 0; // vertex count added by this part so far
        for (const [a, b, c] of part.indices) {
          const A = part.positions[a];
          const B = part.positions[b];
          const C = part.positions[c];
          const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
          const v = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
          let nx = u[1] * v[2] - u[2] * v[1];
          let ny = u[2] * v[0] - u[0] * v[2];
          let nz = u[0] * v[1] - u[1] * v[0];
          const len = Math.hypot(nx, ny, nz) || 1;
          nx /= len;
          ny /= len;
          nz /= len;
          for (const P of [A, B, C]) {
            positions.push(P[0], P[1], P[2]);
            normals.push(nx, ny, nz);
            const col = part.colorFn ? part.colorFn(P) : (part.color ?? [0.8, 0.8, 0.8]);
            colors.push(
              Math.max(0, Math.min(255, Math.round(col[0] * 255))),
              Math.max(0, Math.min(255, Math.round(col[1] * 255))),
              Math.max(0, Math.min(255, Math.round(col[2] * 255))),
            );
            vi += 1;
          }
          indices.push(base + vi - 3, base + vi - 2, base + vi - 1);
        }
      }
      const vCount = positions.length / 3;
      const posMin = [Infinity, Infinity, Infinity];
      const posMax = [-Infinity, -Infinity, -Infinity];
      for (let i = 0; i < positions.length; i += 3)
        for (let k = 0; k < 3; k += 1) {
          posMin[k] = Math.min(posMin[k], positions[i + k]);
          posMax[k] = Math.max(posMax[k], positions[i + k]);
        }
      const posArr = new Float32Array(positions);
      const nrmArr = new Int8Array(normals.length);
      for (let i = 0; i < normals.length; i += 1) nrmArr[i] = Math.round(normals[i] * 127);
      const colArr = new Uint8Array(colors);
      const idxArr = new Uint16Array(indices);

      const mesh = {
        primitives: [
          {
            attributes: {
              POSITION: pushAccessor(posArr, 5126, "VEC3", vCount, { min: posMin, max: posMax }, 34962),
              NORMAL: pushAccessor(nrmArr, 5120, "VEC3", vCount, { normalized: true }, 34962),
              COLOR_0: pushAccessor(colArr, 5121, "VEC3", vCount, { normalized: true }, 34962),
            },
            indices: pushAccessor(idxArr, 5123, "SCALAR", indices.length, {}, 34963),
            material: 0,
            mode: 4,
          },
        ],
      };
      meshes.push(mesh);
      meshKey.set(node, meshes.length - 1);
    }
    for (const node of this.nodes) {
      if (node.meshOf && node.parts.length === 0) {
        // link node: reference the source's mesh (source must own parts)
        const src = node.meshOf;
        if (!meshKey.has(src)) throw new Error(`linkMesh source has no mesh: ${src.name}`);
        node._meshIndex = meshKey.get(src);
      }
    }
    for (const node of owners) node._meshIndex = meshKey.get(node);

    // nodes
    const gltfNodes = this.nodes.map((node) => {
      const out = { name: node.name };
      if (node._meshIndex !== undefined) out.mesh = node._meshIndex;
      if (node.at.some((v) => v !== 0)) out.translation = [...node.at];
      if (node.rot) out.rotation = eulerToQuat(node.rot);
      if (node.scale.some((v) => v !== 1)) out.scale = [...node.scale];
      return out;
    });
    // children lists
    for (const node of this.nodes) {
      if (node.parent && node.parent !== node) {
        const p = nodeIndex.get(node.parent);
        if (p !== undefined && node.parent !== this.root) {
          gltfNodes[p].children = gltfNodes[p].children ?? [];
          gltfNodes[p].children.push(nodeIndex.get(node));
        }
      }
    }
    const roots = this.nodes
      .filter((n) => n.parent === this.root && n !== this.root)
      .map((n) => nodeIndex.get(n));

    // animations
    const samplers = [];
    const gltfChannels = [];
    for (const ch of this.channels) {
      const input = pushAccessor(
        new Float32Array(ch.times),
        5126,
        "SCALAR",
        ch.times.length,
        { min: [Math.min(...ch.times)], max: [Math.max(...ch.times)] },
      );
      const flat = ch.vals.flat();
      const output = pushAccessor(new Float32Array(flat), 5126, ch.vec === 4 ? "VEC4" : "VEC3", ch.vals.length);
      samplers.push({ input, output, interpolation: "LINEAR" });
      gltfChannels.push({
        sampler: samplers.length - 1,
        target: { node: nodeIndex.get(ch.node), path: ch.path },
      });
    }

    const gltf = {
      asset: { version: "2.0", generator: "yclap species-model builder (hand-rolled, no deps)" },
      scene: 0,
      scenes: [{ name: this.name, nodes: roots }],
      nodes: gltfNodes,
      meshes,
      materials: [
        {
          name: "flat",
          pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: 1 },
          doubleSided: true,
        },
      ],
      accessors,
      bufferViews,
      buffers: [{ byteLength: offset }],
    };
    if (gltfChannels.length) {
      gltf.animations = [{ name: "idle", channels: gltfChannels, samplers }];
    }

    // GLB container
    const jsonBytes = strToU8(JSON.stringify(gltf), 0x20);
    const binPad = (4 - (offset % 4)) % 4;
    const bin = new Uint8Array(offset + binPad);
    let o = 0;
    for (const b of buffers) {
      bin.set(b.data, o);
      o += b.data.byteLength;
    }
    const total = 12 + 8 + jsonBytes.length + 8 + bin.length;
    const out = new Uint8Array(total);
    const dv = new DataView(out.buffer);
    dv.setUint32(0, 0x46546c67, true); // "glTF"
    dv.setUint32(4, 2, true);
    dv.setUint32(8, total, true);
    dv.setUint32(12, jsonBytes.length, true);
    dv.setUint32(16, 0x4e4f534a, true); // "JSON"
    out.set(jsonBytes, 20);
    const binHeaderAt = 20 + jsonBytes.length;
    dv.setUint32(binHeaderAt, bin.length, true);
    dv.setUint32(binHeaderAt + 4, 0x004e4942, true); // "BIN\0"
    out.set(bin, binHeaderAt + 8);
    return out;
  }
}

function eulerToQuat([rx, ry, rz]) {
  // applied as Rz*Ry*Rx (matching mCompose order rotX -> rotY -> rotZ)
  const qx = quatAxisAngle([1, 0, 0], rx);
  const qy = quatAxisAngle([0, 1, 0], ry);
  const qz = quatAxisAngle([0, 0, 1], rz);
  return quatMul(qz, quatMul(qy, qx));
}

function strToU8(str, padByte) {
  const enc = new TextEncoder();
  const raw = enc.encode(str);
  const pad = (4 - (raw.length % 4)) % 4;
  const out = new Uint8Array(raw.length + pad);
  out.set(raw);
  if (pad) out.fill(padByte, raw.length);
  return out;
}
