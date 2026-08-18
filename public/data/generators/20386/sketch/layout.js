class Layout {
  constructor() {
    (this._plants = []), (this._i = 0);
  }
  getPlants() {
    return this._i++, this._plants[this._i - 1];
  }
  finished() {
    return this._i >= this._plants.length;
  }
}
class LinearLayout extends Layout {
  constructor(t) {
    super();
    const n = R.min(15, 40, 2),
      a = Math.ceil(map(n, 15, 40, 1, 2)),
      s = Math.ceil(map(n, 15, 40, 3, 8)),
      o = 0.2 * H,
      e = H * map(n, 15, 40, 1.6, 1.1),
      i = e - o,
      r = new PlantGenerator(n, t);
    let l = o;
    for (; l <= e; ) {
      const t = Math.ceil(map(l, o, e, s, a)),
        n = map(l, o, e, 3, 1);
      for (let a = 0; a < t; a++) {
        const t = R.int(1, 2),
          a = ARR(t, () =>
            r.grow(R.idx(PLANT_DEFS), CV(R.num(-50, W + 50), l), n)
          );
        this._plants.push(a);
      }
      l += map(l, o, e, 0.05 * i, 0.2 * i);
    }
  }
}
class DiagonalLayout extends Layout {
  constructor(t) {
    super();
    const n = R.min(15, 40, 2),
      a = Math.ceil(map(n, 15, 40, 1, 2)),
      s = Math.ceil(map(n, 15, 40, 3, 8)),
      o = 0.2 * H,
      e = H * map(n, 15, 40, 1.6, 1.1),
      i = e - o,
      r = new PlantGenerator(n, t),
      l = R.dec() < 0.5,
      m = l ? R.min(-20, 0.25 * W) : W - R.min(-20, 0.25 * W),
      p = l ? W + R.min(20, 0) : R.min(-20, 0);
    let c = o;
    for (; c <= e; ) {
      const t = Math.ceil(map(c, o, e, s, a)),
        n = map(c, o, e, 3, 1);
      for (let a = 0; a < t; a++) {
        let t = R.int(1, 2),
          a = 0,
          s = 0,
          o = [];
        for (; s < t && (a++, !(a > 20)); ) {
          const t = lerp(m, p, map(c, 0, H, 0, 1)),
            a = l ? R.num(-50, t) : R.num(t, W + 50),
            e = CV(a, c);
          o.push(r.grow(R.idx(PLANT_DEFS), e, n)), s++;
        }
        o.length > 0 && this._plants.push(o);
      }
      c += map(c, o, e, 0.05 * i, 0.2 * i);
    }
  }
}
class CircleLayout extends Layout {
  constructor(t) {
    super();
    const n = R.min(15, 40, 2),
      a = 0.2 * H,
      s = H * map(n, 15, 40, 1.6, 1.1),
      o = new PlantGenerator(n, t),
      e = CV(R.norm(W / 2, 20), R.norm(0.75 * H, 20)),
      i = R.num(150, 200),
      r = ARR(R.int(25, 40), () => endpoint(e, R.num(0, 360), i)).filter(
        (t) => t.y >= a && t.y <= s
      );
    r.sort((t, n) => t.y - n.y),
      (this._plants = r.map((t) => {
        const n = map(t.y, a, s, 3, 1);
        return [o.grow(R.idx(PLANT_DEFS), t, n)];
      }));
  }
}
