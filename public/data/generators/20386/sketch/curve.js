class Curve {
  constructor(t) {
    let e = [],
      n = 0;
    for (let s = 0; s < t.length - 3; s++) {
      let r,
        i = n,
        o = t.slice(s, s + 4),
        a = 0,
        h = 0,
        u = curvePointAtT(o, h),
        p = [];
      for (; h < 1; ) {
        let t = a;
        (h += 0.01),
          (r = curvePointAtT(o, h)),
          (a += u.dist(r)),
          p.push({ t0: h - 0.01, t1: h, start: t, end: a }),
          (u = r);
      }
      (n += a), e.push({ start: i, length: a, points: o, values: p });
    }
    e.map((t) => {
      const { start: e, length: s } = t;
      (t.t0 = e / n), (t.t1 = (e + s) / n);
    }),
      (this._points = t),
      (this._segments = e),
      (this._length = n);
  }
  len() {
    return this._length;
  }
  extrude(t, e, n = 100) {
    e || (e = t);
    const s = [],
      r = [],
      i = 1 / n;
    for (let n = 0; n <= 1; n += i) {
      const [i, o] = this.infoAtT(n);
      s.push(endpoint(i, o + 90, t(n, this._length))),
        r.push(endpoint(i, o - 90, e(n, this._length)));
    }
    return r.reverse(), [...s, ...r];
  }
  offset(t, e = 100, n) {
    const s = new Curve(t),
      r = ARR(e, (t) => s.infoAtT(t / e)[0]),
      i = r.map((t) => t.x),
      o = r.map((t) => t.y),
      a = 1e-5,
      h = min(...i) - a,
      u = max(...i) + a,
      p = abs(max(...o) - min(...o)),
      c = n ? n / 2 / p : this._length / abs(h - u),
      l = (t) =>
        r.map((e) => {
          const [n, s] = this.infoAtT(map(e.x, h, u, 0, 1));
          return endpoint(n, s - t, e.y * c);
        }),
      g = l(-90),
      m = l(90);
    return m.reverse(), [...g, ...m];
  }
  render() {
    beginShape(),
      this._points.map((t) => curveVertex(t.x * U, t.y * U)),
      endShape();
  }
  infoAtT(t) {
    t %= 1;
    const e = this._segments.filter((e) => e.t0 <= t && e.t1 >= t)[0],
      n = this._length * t - e.start,
      s = e.values.filter((t) => t.start <= n && t.end >= n)[0],
      r = (n - s.start) / (s.end - s.start),
      i = min(1, s.t0 + (s.t1 - s.t0) * r);
    return [curvePointAtT(e.points, i), curveTangentAtT(e.points, i)];
  }
  infoAtD(t) {
    return this.infoAtT(t / this._length);
  }
}
const curvePointAtT = (t, e) =>
    CV(
      curvePoint(...t.map((t) => t.x), e),
      curvePoint(...t.map((t) => t.y), e)
    ),
  curveTangentAtT = (t, e) =>
    atan2(
      curveTangent(...t.map((t) => t.y), e),
      curveTangent(...t.map((t) => t.x), e)
    );
