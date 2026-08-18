const SCALE = 1,
  H = 500,
  W = 375,
  U = isFxpreview
    ? 3300 / H
    : window.innerWidth / window.innerHeight < 0.75
    ? (SCALE * window.innerWidth) / W
    : (SCALE * window.innerHeight) / H,
  HU = Math.floor(H * U),
  WU = Math.floor(W * U);

class Random {
  constructor() {
    (this._gaussian_previous = !1), (this._y2 = 0);
  }
  dec() {
    return fxrand();
  }
  num = (e, t) => e + (t - e) * this.dec();
  int = (e, t) => Math.floor(this.num(e, t + 1));
  idx = (e) => e[this.int(0, e.length - 1)];
  max = (e, t, r) => {
    const n = [...Array(r).keys()].map((r) => R.num(e, t));
    return Math.max(...n);
  };
  min = (e, t, r) => {
    const n = [...Array(r).keys()].map((r) => R.num(e, t));
    return Math.min(...n);
  };
  shuffle(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const r = Math.floor(this.dec() * (t + 1)),
        n = e[t];
      (e[t] = e[r]), (e[r] = n);
    }
  }
  choose = (e, t) => {
    const r = [...e];
    if (t >= e.length) return r;
    const n = [];
    for (; n.length < t; ) this.shuffle(r), n.push(r.pop());
    return n;
  };
  norm = (e, t = 1) => {
    let r, n, s, i;
    if (this._gaussian_previous) (r = this._y2), (this._gaussian_previous = !1);
    else {
      do {
        (n = this.num(-1, 1)), (s = this.num(-1, 1)), (i = n * n + s * s);
      } while (i >= 1);
      (i = Math.sqrt((-2 * Math.log(i)) / i)),
        (r = n * i),
        (this._y2 = s * i),
        (this._gaussian_previous = !0);
    }
    return r * t + (e || 0) || e;
  };
}
let R = new Random();

const CV = (e, t) => createVector(e, t),
  mkGraphic = () => {
    const e = createGraphics(WU, HU);
    return (
      e.pixelDensity(1),
      e.strokeWeight(1 * U),
      e.colorMode(HSL, 360, 100, 100, 100),
      e.angleMode(DEGREES),
      e
    );
  },
  addImg = (e) => image(e, 0, 0, WU, HU, 0, 0, WU, HU),
  colorLookup = (e, t, r) => {
    colorMode(RGB, 255, 255, 255, 255);
    let n = (int(r * U) * int(e.width) + int(t * U)) * e.pixelDensity() * 4,
      [s, i, o, a] = e.pixels.slice(n, n + 4),
      h = color(s, i, o, a);
    return (
      colorMode(HSL, 360, 100, 100, 100),
      color(hue(h), saturation(h), lightness(h), 0 == a ? 0 : 65)
    );
  },
  makeImg = (e) => {
    let t = createImage(WU, HU);
    return t.copy(e, 0, 0, WU, HU, 0, 0, WU, HU), t;
  },
  CP = (e, t, r) => curvePoint(...e.map((e) => e[t]), r),
  endpoint = (e, t, r) => CV(e.x + cos(t) * r, e.y + sin(t) * r),
  initPoints = (e, t, r) => {
    let n = CV(e, r),
      s = CV(t, r),
      i = [n, n];
    for (; e < t; ) i.push(CV(e, r)), (e += 1);
    return [...i, s, s];
  },
  loopingSequence = (e) => {
    let t = 0;
    return () => {
      let r = e[t];
      return (t = (t + 1) % e.length), r;
    };
  },
  alternatingLayers = (e, t) => {
    let r = [],
      n = 0,
      s = loopingSequence(e);
    for (; n < 2 * H; ) r.push([n, s()]), (n += t());
    return r;
  },
  randomLayers = (e, t) => {
    let r = [],
      n = 0;
    for (; n < 2 * H; ) r.push([n, R.idx(e)]), (n += t());
    return r;
  },
  renderCurve = (e, t) => {
    e.beginShape(), t.map((t) => e.curveVertex(t.x * U, t.y * U)), e.endShape();
  },
  ARR = (e, t) => [...Array(e).keys()].map((e, r) => t(e, r)),
  gpToImg = (e) => {
    const t = createImage(WU, HU);
    return t.copy(e, 0, 0, WU, HU, 0, 0, WU, HU), t;
  },
  capCurve = (e) => [e[0], ...e, ...e.slice(-1)],
  splitOffsetCurve = (e, t) => {
    const r = t.length / 2,
      n = t.slice(0, r);
    return (
      n.reverse(),
      [
        [...n, ...e],
        [...t.slice(r), ...e],
      ]
    );
  },
  toVectors = (e) => {
    const t = [];
    for (let r = 0; r < e.length; r += 2) t.push(CV(...e.slice(r, r + 2)));
    return t;
  },
  orientCurve = (e, t, r, n) => {
    t = (t %= 360) < 0 ? 360 + t : t;
    const s = (n = n.map((e) =>
        t > 90 && t < 270 ? CV(e.x, -e.y) : e.copy()
      ))[1].copy(),
      i = r / s.dist(n.slice(-2)[0]);
    return n.map((r) =>
      r
        .setMag(r.dist(s) * i)
        .rotate(t)
        .add(e)
    );
  },
  orientShape = (e, t, r, n, s) =>
    n.map((n) =>
      n
        .copy()
        .setMag(n.dist(CV(0, 0)) * (r / s))
        .rotate(t)
        .add(e)
    ),
  grassCurve = (e, t, r, n, s, i, o) => {
    let a = n(),
      h = s(),
      l = e.loc.copy(),
      c = [l],
      u = o(),
      d = t / u,
      p = 0;
    for (let t = 0; t < u; t++) {
      let t = d + R.norm(0, 0.1 * d);
      p += t;
      let n = ((g = a), (m = h), (U = i()), m < g ? m + U : m - U),
        s = r(p),
        o = e.wind && s > 0 ? e.wind.apply(e.start, h, n, s) : n,
        u = endpoint(l, o, t);
      c.push(u),
        (h = o),
        (l = u),
        e.wind && s > 0 && (a = e.wind.apply(e.start, a, o, s));
    }
    var g, m, U;
    return capCurve(c);
  },
  selectWeighted = (e) => {
    const t = e.reduce((e, t) => e + t.weight, 0),
      r = R.num(0, t);
    let n = 0;
    for (let t = 0; t < e.length; t++)
      if (((n += e[t].weight), n >= r)) return e[t];
    return R.idx(e);
  },
  sigmoid = (e, t, r) => 1 / (1 + Math.E ** (-1 * e * r + t));
