let e = window.p5;
class t {
  constructor(e, t) {
    (this.hash = e), (this.p = t), console.log("Rendering using hash: ", e);
  }
  dec() {
    return fxrand();
  }
  num(e, t) {
    return e + (t - e) * this.dec();
  }
  int(e, t) {
    return this.p.floor(this.num(e, t));
  }
  bool(e = 50) {
    return this.dec() < e / 100;
  }
  choice(e) {
    return e[this.int(0, e.length)];
  }
}
const o = (e, t = 0, n = 1) => (n < e ? o(e, n, t + n) : n - e > e - t ? t : n);
let n = null,
  l = null,
  i = o(82),
  c = null,
  r = null,
  a = null,
  s = null,
  d = null,
  f = null,
  u = {};
const h = (e, t) => {
  83 == t && e.saveCanvas(s, fxhash, "png");
};
let x,
  b = [
    {
      name: "Palace",
      bg: ["#FDB854"],
      line: ["#101D4C"],
      accent: [
        "#F2ECDC",
        "#D8994D",
        "#FFD982",
        "#3D4471",
        "#006799",
        "#6BA9B7",
        "#D8994D",
        "#FFD982",
        "#FFE7AD",
        "#F2ECDC",
      ],
    },
    {
      name: "Sea",
      bg: ["#6ea3c8"],
      line: ["#252218"],
      accent: [
        "#e4e2d5",
        "#e4e2d5",
        "#e4e2d5",
        "#1b4863",
        "#2b715f",
        "#419580",
        "#d75a43",
        "#346eaa",
        "#e7b853",
        "#e4e2d5",
      ],
    },
    {
      name: "Fisherprice Reduced",
      bg: ["#ECE7D9"],
      line: ["#001c2a"],
      accent: [
        "#f9af06",
        "#1e62ad",
        "#f8bdc1",
        "#ECE7D9",
        "#01906d",
        "#e74620",
      ],
    },
    {
      name: "Fisherprice",
      bg: ["#E8E4D9"],
      line: ["#001c2a"],
      accent: [
        "#9e9995",
        "#b4b0a7",
        "#d8d2c4",
        "#F0EDE6",
        "#01906d",
        "#1e62ad",
        "#e74620",
        "#f9af06",
        "#f8bdc1",
        "#E8E4D9",
        "#F0EDE6",
      ],
    },
    {
      name: "Fisherprice Dark",
      bg: ["#d8d2c4"],
      line: ["#0D0F12"],
      accent: [
        "#1A191F",
        "#473d3c",
        "#9e9995",
        "#b4b0a7",
        "#d8d2c4",
        "#F0EDE6",
        "#9e9995",
        "#b4b0a7",
        "#d8d2c4",
        "#2963A2",
        "#ECAA13",
        "#DB4D2C",
        "#F4C1C4",
        "#088969",
        "#F0EDE6",
      ],
    },
    {
      name: "Frank",
      bg: ["#d7d2c9"],
      line: ["#161412"],
      accent: [
        "#9e9995",
        "#b4b0a7",
        "#d8d2c4",
        "#F0EDE6",
        "#181e3e",
        "#dfa82e",
        "#be2a19",
        "#1d3359",
        "#bd3526",
        "#e0a453",
        "#2d5d7d",
        "#d7d2c9",
        "#edeae2",
      ],
    },
    {
      name: "Crystals",
      bg: ["#e3e0d5"],
      line: ["#0d1b25"],
      accent: [
        "#066278",
        "#e28a91",
        "#eac4c5",
        "#f2cd43",
        "#e7d4da",
        "#d94939",
        "#d2d6e2",
        "#e9aa26",
        "#0b2732",
        "#065773",
        "#d7c8a5",
        "#066278",
        "#e28a91",
        "#eac4c5",
      ],
    },
    {
      name: "Rand-ey",
      bg: ["#e6e0d2"],
      line: ["#151418"],
      accent: [
        "#e6e0d2",
        "#686e6e",
        "#e9d9d2",
        "#e6e0d2",
        "#c03145",
        "#6e548b",
        "#077152",
        "#686e6e",
        "#e9d9d2",
        "#e8940e",
        "#295b86",
        "#e6e0d2",
        "#686e6e",
        "#e9d9d2",
        "#e6e0d2",
      ],
    },
    {
      name: "Stone",
      bg: ["#d8d2c4"],
      base: ["#F0EDE6"],
      line: ["#0D0F12"],
      accent: ["#F0EDE6"],
    },
    {
      name: "Sea Dark",
      bg: ["#324A58"],
      line: ["#252218"],
      text: ["#000"],
      accent: [
        "#e4e2d5",
        "#e4e2d5",
        "#e4e2d5",
        "#324A58",
        "#e4e2d5",
        "#DEB55C",
      ],
    },
    {
      name: "Dark Crystals",
      bg: ["#e3e0d5"],
      line: ["#0d1b25"],
      accent: ["#d94939", "#066278", "#e3e0d5"],
    },
    {
      name: "Frank Minimal",
      bg: ["#d7d2c9"],
      base: ["#d7d2c9"],
      line: ["#161412"],
      accent: ["#be2a19", "#be2a19", "#2d5d7d", "#d7d2c9", "#edeae2"],
    },
    {
      name: "Jazz Dark",
      bg: ["#D06249"],
      line: ["#2F2A1E"],
      accent: [
        "#e9e1cc",
        "#e9e1cc",
        "#dc5b3d",
        "#e9e1cc",
        "#08739b",
        "#514834",
        "#e9e1cc",
      ],
    },
    {
      name: "Chalks",
      bg: ["#e26b48"],
      line: ["#070707"],
      accent: [
        "#e9e1cc",
        "#e9e1cc",
        "#e9e1cc",
        "#2e5c53",
        "#d69c88",
        "#f8b97c",
        "#e26b48",
        "#9fbfcb",
        "#e9e1cc",
      ],
    },
    {
      name: "Noir",
      hatching: 95,
      bg: ["#14171E"],
      line: ["#000"],
      text: ["##E1E4EA"],
      accent: [
        "#22252A",
        "#22252A",
        "#2F3237",
        "#2F3237",
        "#62646A",
        "#AEB1B7",
        "#E1E4EA",
      ],
    },
    {
      name: "Ghost",
      hatching: 5,
      bg: ["#14171e"],
      line: ["#F0EDE5"],
      accent: ["#14171e"],
    },
    {
      name: "Rand-ey Dark",
      bg: ["#1D1C21"],
      line: ["#000"],
      text: ["#e6e0d2"],
      accent: [
        "#686e6e",
        "#e9d9d2",
        "#e6e0d2",
        "#6e548b",
        "#e8940e",
        "#c03145",
        "#077152",
        "#295b86",
        "#686e6e",
        "#e6e0d2",
        "#e6e0d2",
      ],
    },
    {
      name: "Organics",
      bg: ["#113940"],
      line: ["#08170F"],
      text: ["#000"],
      accent: ["#7b7432", "#184952", "#f8acaa"],
    },
    {
      name: "Morning Sun In A Dusty Room",
      bg: ["#E3DEDD"],
      line: ["#101933"],
      accent: [
        "#ece1cf",
        "#272125",
        "#7f5076",
        "#de5c4b",
        "#e6922b",
        "#d1ada9",
        "#4f707f",
        "#ece1cf",
        "#ece1cf",
      ],
    },
    {
      name: "Jazz",
      bg: ["#E9DCCE"],
      line: ["#2F2A1E"],
      accent: [
        "#e9e1cc",
        "#e9e1cc",
        "#e9e1cc",
        "#dc5b3d",
        "#08739b",
        "#e69335",
        "#e08572",
        "#e9e1cc",
      ],
    },
  ];
let y,
  g,
  m,
  p = 0,
  D = 0,
  E = 0,
  k = 40,
  F = 40,
  C = 40,
  w = 0,
  S = !1,
  A = 0,
  W = !1,
  B = 0,
  v = 1,
  N = !0,
  L = "default",
  M = 0.9,
  H = 5,
  V = !1,
  G = !1,
  P = !1,
  $ = 15,
  z = 100,
  I = 1,
  R = 1,
  T = 3,
  q = 0.8,
  J = 1.2,
  O = 1.8 * J,
  Z = 10,
  j = 12,
  K = 12,
  U = 18,
  Y = "basic",
  Q = !0,
  X = !0,
  _ = !0,
  ee = "default";
function te(e, t) {
  let o = null;
  for (const n in t) {
    let t = parseFloat(n);
    t <= e && (o = t);
  }
  return t[o];
}
let oe = () => {
    (ee = "Debug"),
      (S = n.bool(80)),
      (A = n.int(20, 100)),
      (W = n.bool(50)),
      (Z = n.int(0, 10)),
      (L = n.bool(10) ? "fillBoxes" : "default"),
      (Y = n.bool(50) ? "basic" : "slices"),
      ($ = 25),
      (N = n.bool(50)),
      (B = 0.4),
      (k = 45),
      (F = 45),
      (C = 45),
      (j = 11),
      (K = 11),
      (U = 18),
      (w = -30),
      (J = 1.7),
      (O = 1.8 * J);
  },
  ne = () => {
    (ee = "Large"),
      (S = n.bool(50)),
      (A = n.int(50, 200)),
      (W = n.bool(50)),
      (N = n.bool(40)),
      (L = n.bool(5) ? "fillBoxes" : "default"),
      (Z = n.int(0, 5)),
      ($ = 50),
      (B = 0.4),
      (T = 2),
      (R = n.choice([0.5, 1.5, 2, 1, 1.75])),
      (q = 0.9),
      (k = 40),
      (F = 40),
      (C = 40),
      (j = 11),
      (K = 11),
      (U = 20),
      (w = -45),
      (J = 1.7),
      (O = 1.8 * J);
  },
  le = () => {
    (ee = "Chunks"),
      (S = n.bool(50)),
      (L = n.bool(30) ? "fillBoxes" : "default"),
      (A = n.num(0, 250)),
      (W = !1),
      (N = !1),
      (Z = n.int(0, 10)),
      ($ = 40),
      (z = 70),
      (B = 0.6),
      (v = 0.8),
      (T = 2),
      (R = n.choice([1.5])),
      (q = 0.9),
      (k = 35),
      (F = 35),
      (C = 35);
    let e = n.int(18, 22),
      t = n.int(18, 22);
    (j = e),
      (K = t),
      (U = 20),
      (I = n.num(1.5, 2)),
      (w = 40 * I),
      (J = 1.4),
      (O = 1.8 * J),
      (G = !0),
      (P = !0),
      (J = 1.4),
      (O = 1.8 * J);
  },
  ie = () => {
    (ee = "Locked"),
      (S = !1),
      (A = n.int(50, 300)),
      (W = !0),
      (Z = n.int(0, 10)),
      ($ = 40),
      (L = n.bool(30) ? "fillBoxes" : "default"),
      (Y = n.bool(50) ? "basic" : "slices"),
      (k = 40),
      (F = 40),
      (C = 40);
    let e = n.int(10, 14);
    (j = e),
      (K = e),
      (U = 20),
      (w = 25 * (e - 10) - 75),
      (B = 0.5),
      (v = 1),
      (J = 1.4),
      (O = 1.8 * J);
  },
  ce = () => {
    (ee = "Hills"),
      (S = !0),
      (A = 1e3),
      (W = !1),
      (V = !1),
      (B = 0.8),
      (v = 1),
      ($ = 0),
      (N = !1),
      (T = 2),
      (R = n.choice([3, 2.5, 4, 5, 7])),
      (q = 0.9),
      (L = "fillBoxes"),
      (Z = 0),
      (w = 2300);
    let e = n.num(25, 30);
    (k = e),
      (F = e),
      (C = e),
      (j = 180),
      (K = 180),
      (U = 3),
      (G = n.bool(50)),
      (I = n.choice([0.8, 1])),
      (P = !0),
      (J = 1.2),
      (O = 1.8 * J),
      G && (_ = !1);
  },
  re = () => {
    (ee = "Fracture"),
      (S = n.bool(50)),
      (A = n.num(100, 400)),
      (N = n.bool(50)),
      (L = n.bool(20) ? "fillBoxes" : "default"),
      (Y = n.bool(50) ? "basic" : "slices"),
      (W = n.bool(30)),
      (B = 0.4),
      (v = 1),
      (V = !1),
      ($ = 26),
      (z = 100),
      (R = 2),
      (T = 2),
      (q = 0.9),
      (Z = n.int(0, 2));
    let e = n.int(30, 40),
      t = n.int(15, 19);
    (w = -200),
      (k = e),
      (F = e),
      (C = e),
      (j = t),
      (K = t),
      (U = 100),
      (G = !1),
      (I = 1),
      (P = !1),
      (J = 1.5),
      (O = 1.8 * J);
  },
  ae = () => {
    (ee = "Continents"),
      (S = !0),
      (W = !1),
      (Z = 0),
      (Y = n.choice(["basic", "subdivided", "slices"])),
      "slices" == Y && (m = 25),
      (Q = n.bool(30)),
      ($ = 20);
    let e = n.num(23, 32);
    (j = 100),
      (K = 100),
      (U = "fillBoxes" == L ? n.num(2, 3) : n.num(4, 18)),
      (k = e),
      (F = e),
      (C = e),
      (y = j / n.int(6, 14)),
      (g = n.int(2, 7)),
      (B = 0.5),
      (v = 1.1),
      (R = 10),
      (T = 4),
      (q = 0.8),
      (A = n.bool(10) ? 0 : n.num(0, 600)),
      (N = !1),
      (I = 0.7),
      (G = !1),
      (P = !0),
      (w = 1200),
      (J = 1.3),
      (O = 1.8 * J),
      (_ = !0);
  },
  se = () => {
    (ee = "Structure"),
      (Y = n.bool(50) ? "subdivided" : "slices"),
      (Q = n.bool(50)),
      (S = n.bool(33)),
      (W = n.bool(33)),
      (V = !1),
      (B = 0.55),
      (v = 1),
      (R = 10),
      (T = 5),
      (q = 0.9),
      ($ = 18),
      (N = n.bool(50)),
      (T = 2),
      (R = n.choice([3, 2.5, 4])),
      (q = 0.9),
      (A = n.int(50, 250)),
      (Z = 0);
    let e = n.num(25, 28);
    (k = e),
      (F = e),
      (C = e),
      (j = 20),
      (K = 20),
      (U = n.int(28, 32)),
      (y = j / n.int(1, 4)),
      (g = n.int(2, 4)),
      (w = 0 - (28 - 1 * U - 2 * (25 - e))),
      (N = n.bool(50)),
      (J = 1.3),
      (O = 1.8 * J);
  };
function de(e, t, o = 0, n = 10, i = 3, c = 0.6, r = 0) {
  return (
    l.noiseDetail(i, c),
    l.noise((e + D + r) / n, (t + E + r) / n, (o + 0 + r) / n)
  );
}
function fe(e) {
  return { h: l.hue(e), s: l.saturation(e), l: l.lightness(e), o: l.alpha(e) };
}
function ue(e, t, o, n, i) {
  let c = e + (o / 2) * l.cos(i),
    r = t + (n / 2) * l.sin(i);
  return l.createVector(c, r);
}
function he(e, t, o, n, i = 10, c = !1, r, a) {
  let s = [];
  for (let c = 0; c <= i; c++) {
    let d = l.map(c, 0, i, r, a);
    s.push(ue(e, t, o, n, d));
  }
  return c ? s.reverse() : s;
}
function xe({ center: e, xwidth: t = k, ywidth: o = F, rescale: n = 1 }) {
  let i = [];
  for (let c = l.PI / 6; c < 2 * l.PI; c += l.PI / 3)
    i.push(l.createVector(e.x + l.cos(c) * t * n, e.y + l.sin(c) * o * n));
  return i;
}
function be(t, o = 10) {
  let n = [],
    i = l.floor(o);
  if (i <= 1) return;
  let c = 1 / i;
  for (let o = c; o <= 1; o += c) n.push(e.Vector.lerp(t[0], t[1], o));
  return n;
}
function ye(e, t, o, i = !0) {
  let c = de(e, t, o, H, 4, M),
    r = l.map(l.min(c, 1), 0, 1, 0, x.accent.length - 1);
  return n.bool(i ? Z : 0)
    ? l.color("rgba(255,255,255,0)")
    : x.accent[l.floor(r)];
}
function ge(e) {
  for (let t = 0; t < e.length - 1; t++) {
    let o = e[t],
      n = e[t + 1];
    l.line(o.x, o.y, n.x, n.y);
  }
}
function me(e) {
  l.beginShape();
  for (const t of e) l.vertex(t.x, t.y);
  l.endShape(l.CLOSE);
}
function pe(e, t, o) {
  let n = (k / 5) * o,
    i = be(e, n),
    c = be(t, n),
    r = l.color(x.line[0]);
  r.setAlpha(0.9), l.push(), l.stroke(r), l.strokeWeight(J / 2);
  for (const [e, t] of i.entries()) ge([t, c[e]]);
  l.pop();
}
function De(e, t, o, n = 1) {
  let i = we(e, t, o),
    c = xe({ center: i, rescale: n }),
    r = l.createVector,
    a = fe(ye(e, t, o, false)),
    s = 0 !== a.o;
  l.push(),
    s &&
      (l.noStroke(),
      l.fill(a.h, a.s, a.l - 5, a.o),
      l.quad(i.x, i.y, c[4].x, c[4].y, c[0].x, c[0].y, c[1].x, c[1].y),
      l.fill(a.h, a.s, a.l + 5, a.o),
      l.quad(i.x, i.y, c[1].x, c[1].y, c[2].x, c[2].y, c[4].x, c[4].y)),
    l.stroke(x.line[0]),
    ge([r(c[4].x, c[4].y), r(c[1].x, c[1].y)]),
    s &&
      X &&
      (pe(
        [r(c[4].x, c[4].y), r(c[1].x, c[1].y)],
        [r(c[4].x, c[4].y), r(c[0].x, c[0].y)],
        2.88
      ),
      pe(
        [r(c[4].x, c[4].y), r(c[2].x, c[2].y)],
        [r(c[4].x, c[4].y), r(c[1].x, c[1].y)],
        1.5
      )),
    s ||
      (ge([r(c[0].x, c[0].y), r(i.x, i.y)]),
      ge([r(c[2].x, c[2].y), r(i.x, i.y)])),
    l.strokeWeight(O),
    ge([
      r(c[0].x, c[0].y),
      r(c[1].x, c[1].y),
      r(c[2].x, c[2].y),
      r(c[4].x, c[4].y),
      r(c[0].x, c[0].y),
    ]),
    l.pop();
}
function Ee(e, t, o) {
  let n = we(e, t, o, V);
  l.push(), l.strokeWeight(3), l.stroke(x.line[0]), l.point(n.x, n.y), l.pop();
}
function ke(t, o, i, c) {
  let r = we(t, o, i),
    a = F * c,
    s = 1.2 * (k * c),
    d = fe(ye(t, o, i, false)),
    f = 0 !== d.o,
    u = [
      ...he(r.x, r.y + a / 2, s, 0.6 * a, 30, !1, l.radians(0), l.radians(180)),
      ...he(
        r.x,
        r.y - a / 2,
        s,
        0.6 * a,
        30,
        !1,
        l.radians(180),
        l.radians(360)
      ),
    ];
  u.push(u[0]);
  let h = he(
      r.x,
      r.y - a / 2,
      s,
      0.6 * a,
      f ? 60 : 30,
      !1,
      l.radians(0),
      l.radians(f ? 360 : 180)
    ),
    b = he(
      r.x,
      r.y + a / 2,
      s,
      0.6 * a,
      30,
      !1,
      l.radians(180),
      l.radians(360)
    );
  if (
    (l.push(),
    f &&
      (l.noStroke(),
      l.fill(d.h, d.s, d.l - 5, d.o),
      me(u),
      l.fill(d.h, d.s, d.l, d.o),
      me(h)),
    l.stroke(x.line[0]),
    l.noFill(),
    l.strokeWeight(O),
    ge(u),
    l.strokeWeight(J),
    ge(h),
    f || ge(b),
    f && X)
  ) {
    let t = [
        l.createVector(r.x, r.y - a / 2),
        l.createVector(r.x, r.y + a / 2),
      ],
      o = [];
    for (let n = 0; n < t.length; n++) {
      let i = 1 / l.floor(9.6);
      for (let l = i; l <= 1; l += i) o.push(e.Vector.lerp(t[n], t[n + 1], l));
    }
    for (const e of o)
      l.strokeWeight(J / 2),
        ge(
          he(
            e.x,
            e.y,
            s,
            0.6 * a,
            15,
            !1,
            l.radians(0),
            l.radians(80 + n.int(0, 20) - 10)
          )
        ),
        ge(
          he(
            e.x,
            e.y,
            s,
            0.6 * a,
            15,
            !1,
            l.radians(180),
            l.radians(150 - n.int(0, 20) + 10)
          )
        );
  }
  l.pop();
}
function Fe(e, t, o, n, i = 1, c = !0, r = !1) {
  let a = we(e, t, o);
  r && ((a.x = e), (a.y = t));
  let s = xe({ center: a, rescale: i, xwidth: r ? 45 : k, ywidth: r ? 45 : F }),
    d = l.createVector;
  if (("o" == n && (s.push(s[0]), c ? me(s) : ge(s)), "io" == n)) {
    let e = [
      [d(a.x, a.y), d(s[5].x, s[5].y)],
      [d(a.x, a.y), d(s[3].x, s[3].y)],
      [d(a.x, a.y), d(s[1].x, s[1].y)],
    ];
    for (const t of e) ge(t);
  }
  if ("iot" == n) {
    let e = [];
    for (const t of s) e.push([d(a.x, a.y), d(t.x, t.y)]);
    for (const t of e) ge(t);
  }
  if ("b" == n) {
    let e = [
      d(s[1].x, s[1].y),
      d(s[2].x, s[2].y),
      d(a.x, a.y),
      d(s[0].x, s[0].y),
      d(s[1].x, s[1].y),
    ];
    c ? me(e) : ge(e);
  }
  if ("fr" == n) {
    let e = [
      d(a.x, a.y),
      d(s[5].x, s[5].y),
      d(s[0].x, s[0].y),
      d(s[1].x, s[1].y),
      d(a.x, a.y),
    ];
    c ? me(e) : ge(e),
      X &&
        pe(
          [d(a.x, a.y), d(s[1].x, s[1].y)],
          [d(s[5].x, s[5].y), d(s[0].x, s[0].y)],
          1.5 * 1.2
        );
  }
  if ("fl" == n) {
    let e = [
      d(a.x, a.y),
      d(s[1].x, s[1].y),
      d(s[2].x, s[2].y),
      d(s[3].x, s[3].y),
      d(a.x, a.y),
    ];
    c ? me(e) : ge(e),
      X &&
        pe(
          [d(s[2].x, s[2].y), d(s[3].x, s[3].y)],
          [d(s[1].x, s[1].y), d(a.x, a.y)],
          0.84
        );
  }
  if ("t" == n) {
    let e = [
      d(a.x, a.y),
      d(s[3].x, s[3].y),
      d(s[4].x, s[4].y),
      d(s[5].x, s[5].y),
      d(a.x, a.y),
    ];
    c ? me(e) : ge(e);
  }
}
function Ce(e, t, o, n = 1) {
  let i = fe(ye(e, t, o, true)),
    c = 0 !== i.o;
  l.push(),
    l.stroke(x.line[0]),
    l.noFill(),
    c
      ? (l.noStroke(),
        l.fill(i.h, i.s, i.l, i.o),
        Fe(e, t, o, "t", n, c),
        l.fill(i.h, i.s, i.l - 7, i.o),
        Fe(e, t, o, "fr", n, c),
        l.fill(i.h, i.s, i.l + 3, i.o),
        Fe(e, t, o, "fl", n, c),
        l.strokeWeight(O),
        l.stroke(x.line[0]),
        Fe(e, t, o, "o", n, !1),
        l.strokeWeight(J),
        Fe(e, t, o, "io", n, !1))
      : (l.strokeWeight(O),
        Fe(e, t, o, "o", n, !1),
        l.strokeWeight(J),
        Fe(e, t, o, "iot", n, !1)),
    l.pop();
}
function we(e, t, o, n = S) {
  let i = n ? A : 0,
    c = de(e, t, o, 10 * R, T, q) * i,
    s = de(e, t, o, 13 * R, T, q) * i;
  return {
    x: r / 2 + ((e - t) * k * l.sqrt(3)) / 2 + (N ? s - i / 2 : 0),
    y: a / 2 - w + (C * U) / 6 + ((e + t) * F) / 2 - C * o + +(c - i / 2),
  };
}
function Se() {
  if (_) {
    let e = i / 1.5;
    l.fill("#fff"),
      l.noStroke(),
      l.rect(0, 0, r, e),
      l.rect(0, 0, e, a),
      l.rect(r - e, 0, e, a),
      l.rect(0, a - e, r, e + 10);
  }
}
function Ae(e, t, o) {
  let n = G ? -120 * I : 300,
    l = !0;
  return (
    (e.x > t + n || e.x < 0 - n || e.y > o + n || e.y < 0 - n) && (l = !1), l
  );
}
function We() {
  const e = u["grid"];
  l.background(x.bg[0]), Se();
  for (let t = 0; t < U; t++)
    for (let o = 0; o < K; o++)
      for (let n = 0; n < j; n++) {
        let i = W ? l.map(de(n, o, t, 15, 3, 0.9), 0, 1, B, v) : 1,
          c = e[n][o][t],
          s = we(n, o, t, "default" != L || (c < 0.72 && P));
        Ae(s, r, a) &&
          "default" == L &&
          (c >= 0.5 && c <= 0.65
            ? Ce(n, o, t, i)
            : c >= 0.65 && c <= 0.7
            ? De(n, o, t, i)
            : c >= 0.7 && c <= 0.72
            ? ke(n, o, t, i)
            : c >= 0.45 && c <= 1 && Ee(n, o, t)),
          Ae(s, r, a) &&
            "fillBoxes" == L &&
            (c >= 0 && c <= 0.65
              ? Ce(n, o, t, i)
              : c >= 0.65 && c <= 0.75
              ? De(n, o, t, i)
              : c >= 0.75 && c <= 0.77
              ? ke(n, o, t, i)
              : Ce(n, o, t, i));
      }
  return Se(), !0;
}
let Be = null;
function ve(e, t = j, o = K, i = U) {
  let c = [],
    r = l.floor(y),
    a = l.floor(g);
  for (let n = 0; n < t; n++) {
    c[n] = Array(t);
    for (let t = 0; t < o; t++) {
      c[n][t] = Array(o);
      for (let o = 0; o < i; o++) c[n][t][o] = de(n, t, o, 40, 4, 0.7, e);
    }
  }
  if ("basic" == Y) return c;
  if ("subdivided" == Y) {
    for (let n = 0; n < t; n++)
      for (let t = 0; t < o; t++)
        for (let o = 0; o < i; o++)
          o >= 2
            ? (n % r < a || t % r < a || (o % r) * 3 < a) && (c[n][t][o] = 0)
            : Q &&
              (c[n][t][o] = l.map(de(n, t, o, 40, 4, 0.7, e), 0, 1, 0.5, 0.71));
    return c;
  }
  if ("slices" == Y) {
    let e = [],
      r = n.int(2, m || l.min([i, o, t]) / 2);
    for (let t = 0; t < r; t++) e.push(n.int(0, K));
    for (let n = 0; n < t; n++)
      for (let t = 0; t < o; t++)
        for (let o = 0; o < i; o++)
          (e.includes(o) || e.includes(n) || e.includes(t)) && (c[n][t][o] = 0);
    return c;
  }
}
document.complete = !1;
new e((e) => {
  var o;
  (Be = Date.now()),
    e.colorMode(e.HSL),
    ((e) => {
      n = new t(fxhash, e);
      let o = n.num(0, 1e10);
      e.randomSeed(o),
        e.noiseSeed(o),
        (l = e),
        (r = e.floor(1215.5)),
        (a = e.floor(1700)),
        e.windowWidth < 0.715 * e.windowHeight
          ? ((f = e.floor(e.windowWidth * (1 / 0.715))), (d = e.windowWidth))
          : ((f = e.windowHeight - 10),
            (d = e.floor(0.715 * (e.windowHeight - 10)))),
        (c = d / r),
        console.log("Canvas scale factor:", d / r);
    })(e),
    (D = n.num(0, 1e4)),
    (E = n.num(0, 1e4)),
    (p = n.int(0, 9999999999)),
    (y = j / n.int(2, 4)),
    (g = n.int(2, 3)),
    (x = n.choice(b)),
    (M = n.num(0.85, 1)),
    (H = n.int(3, 13)),
    n.choice([oe, ie, re, ce, ae, ne, le, se])(),
    void 0 !== x.hatching && (X = n.bool(x.hatching)),
    ($fxhashFeatures = {
      Palette: x.name,
      Genome: ee,
      Zoom: te(Math.max(k, F, C), {
        15: "Really far",
        20: "Far",
        30: "Medium",
        40: "Close",
        45: "Zoomed",
      }),
      "Grid Mutation": ((o = Y), o.charAt(0).toUpperCase() + o.slice(1)),
      "Warp Shape Sizes": W ? "Yes" : "No",
      "Wireframe Shapes": Z > 0.5 ? "Allowed" : "No",
      "Colour Density": te(H * M, {
        0: "Tightest",
        1: "Tight",
        3: "Medium",
        6: "Loose",
        8: "Looser",
        11: "Slack",
      }),
      "Colour Application": te(M, {
        0.8: "Low-pass",
        0.9: "Normal",
        0.95: "High-pass",
      }),
      "Grid Style": "fillBoxes" == L ? "Boxes" : "Threshold",
      "Grid Warp": S
        ? te(T * q * A, {
            0: "None",
            1: "Almost None",
            100: "Low",
            180: "Low-Medium",
            250: "Medium",
            800: "High",
            1300: "Intense",
            1500: "Swoopy",
          })
        : "None",
      "Grid Warp Dimensions": S && A ? Number(N) + Number(!0) : "None",
    }),
    console.table($fxhashFeatures);
  let i = 0,
    m = [
      () => {
        let t = "STACKING SHAPES".split("").join(" "),
          o = fe(n.choice(x.accent)),
          l = x.line[0];
        x.text?.[0] && (x.line[0] = x.text[0]),
          e.background(x.bg[0]),
          e.textSize(16),
          e.textStyle("normal"),
          e.fill(x.line[0]),
          e.text(t, r / 2 - e.textWidth(t) / 2, a / 2 + 80);
        let i = r / 2,
          c = a / 2;
        return (
          e.noStroke(),
          e.fill(o.h, o.s, o.l, o.o),
          Fe(i, c, 0, "t", 1, !1, !0),
          e.fill(o.h, o.s, o.l - 5, o.o),
          Fe(i, c, 0, "fr", 1, !1, !0),
          e.fill(o.h, o.s, o.l + 5, o.o),
          Fe(i, c, 0, "fl", 1, !1, !0),
          e.strokeWeight(O),
          e.stroke(x.line[0]),
          Fe(i, c, 0, "o", 1, !1, !0),
          e.strokeWeight(J),
          Fe(i, c, 0, "io", 1, !1, !0),
          Se(),
          x.text?.[0] && (x.line[0] = l),
          !0
        );
      },
      () => {
        let e,
          t = !1,
          o = 0;
        for (; o < 100 && !t; ) {
          e = ve(o + n.int(100, 1e5));
          let l = 0,
            i = e.flat(3),
            c = i.length * ($ / 100),
            r = i.length * (z / 100);
          for (let e of i) e >= 0.5 && e <= 0.72 && l++;
          l >= c &&
            l <= r &&
            ((t = !0),
            console.log(`grid score: ${l} of a min ${c} and max ${r}`)),
            o++;
        }
        var l;
        return console.log(`tested ${o} grids`), (l = e), (u["grid"] = l), !0;
      },
      We,
    ];
  (e.keyPressed = () => {
    h(e, e.keyCode);
  }),
    (e.setup = () => {
      var t;
      (t = e.createCanvas(d, f)), (s = t), e.pixelDensity(2);
    }),
    (e.draw = () => {
      e.scale(d / r),
        m[i]() &&
          (i + 1 < m.length
            ? i++
            : (e.noLoop(),
              console.log(`render time: ${(Date.now() - Be) / 1e3} seconds`),
              (document.complete = !0),
              fxpreview()));
    });
});
