class Plant {
  constructor(t, e, s) {
    (this.loc = t), (this.z = e), (this._elements = s);
  }
  render(t) {
    const e = [];
    for (let t in this._elements) e.push(parseInt(t));
    e.sort((t, e) => t - e),
      e.map((e) => {
        const s = this._elements[e];
        R.shuffle(s), s.map((e) => e.render(t));
      });
  }
}
class PlantElement {
  constructor(t, e, s) {
    (this._loc = t.loc.copy()),
      (this._angle = t.angle),
      (this._len = e * t.scale),
      (this._scale = t.scale),
      (this._palette = s),
      (this._start = t.start.copy()),
      (this._z = t.z),
      (this._shadow = t.shadow);
  }
  render(t) {
    this._palette.applySettings(this._start, this._len, this._z, this._shadow),
      t.push(),
      this._render(t),
      t.pop();
  }
  _render(t) {}
}
class WavyGrass extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s),
      (this._points = grassCurve(
        t,
        this._len,
        (e) => (e / t.scale / H) * 3,
        () => R.norm(t.angle, 60),
        () => R.norm(t.angle, 60),
        () => R.num(15, 35) * R.idx([-1, 1]),
        () => R.int(6, 12)
      )),
      (this._offset = (t) => sin(180 * t) * this._len * 0.01);
  }
  _render(t) {
    const e = new Curve(capCurve(this._points)).extrude(this._offset);
    this._palette.fill.g(t),
      renderCurve(t, e),
      this._palette.stroke.g(t),
      t.noFill(),
      renderCurve(t, e);
  }
}
class StraightGrass extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s),
      (this._points = grassCurve(
        t,
        e,
        (e) => (e / t.scale / H) * 0.5,
        () => R.norm(t.angle, 50),
        () => R.norm(t.angle, 45),
        () => R.num(5, 20),
        () => R.int(6, 12)
      )),
      (this._offset = (t) => sin(180 * t) * e * 0.2);
  }
  _render(t) {
    const e = new Curve(capCurve(this._points)).extrude(this._offset);
    t.stroke(85), t.fill(50), renderCurve(t, e);
  }
}
class AgaveBlade extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s),
      (this._points = grassCurve(
        t,
        this._len,
        (e) => (e / t.scale / H) * 0.05,
        () => R.norm(t.angle, 2),
        () => R.norm(t.angle, 60),
        () => R.num(5, 7),
        () => R.int(6, 6)
      )),
      (this._width = R.num(15, 37) * this._scale),
      (this._offset = toVectors([
        28, 160, 0, 0, 65, -49, 255, -17, 429, 0, 526, -9,
      ]));
  }
  _render(t) {
    let e = new Curve(this._points).offset(this._offset, 100, this._width),
      [s, n] = splitOffsetCurve(this._points, e);
    t.noStroke(),
      this._palette.light.g(t),
      renderCurve(t, s),
      this._palette.dark.g(t),
      renderCurve(t, n),
      t.stroke(0),
      this._palette.stroke.g(t),
      t.drawingContext.setLineDash(
        ARR(
          R.int(4, 12),
          (t) =>
            this._len * ((t % 2 == 0 ? R.norm(3, 0.25) : R.norm(4, 0.5)) / 100)
        )
      ),
      t.noFill(),
      t.strokeWeight(this._scale * U),
      renderCurve(t, e),
      renderCurve(t, this._points);
  }
}
class RoundBlade extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s),
      (this._points = grassCurve(
        t,
        this._len,
        (e) => (e / t.scale / H) * 0.8,
        () => R.norm(t.angle, 30),
        () => R.norm(t.angle, 30),
        () => R.num(15, 35) / R.idx([4, -4]),
        () => R.int(6, 12)
      )),
      (this._width = R.num(5, 25) * this._scale),
      (this._offset = toVectors([
        31, 226, 0, 0, 85, -43, 187, -29, 300, 0, 283, 97,
      ]));
  }
  _render(t) {
    let e = new Curve(this._points).offset(this._offset, 100, this._width);
    this._palette.fill.g(t),
      renderCurve(t, e),
      this._palette.stroke.g(t),
      t.noFill(),
      t.strokeWeight(0.01 * this._len * U),
      renderCurve(t, this._points),
      t.drawingContext.setLineDash(ARR(20, () => R.num(1, 3) * U)),
      renderCurve(t, e);
  }
}
class RufflePetals extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = R.num(35, 70),
      i = t.angle - n,
      o = t.angle + n;
    this._points = ARR(R.int(3, 20), () => {
      const s = R.norm(e, 0.15 * e);
      let r = [t.loc],
        l = i + abs(R.norm(0, 0.3 * n));
      for (; l < min(o, l + R.num(20, 2 * n)); )
        r.push(endpoint(t.loc, l, Math.max(1, R.norm(s, 0.1 * s)))),
          (l += R.num(5, 10));
      return [...r, ...r.slice(0, 3)];
    });
  }
  _render(t) {
    t.strokeWeight(this._len * R.num(0.25, 0.35) * U),
      t.stroke(88),
      t.point(this._loc.x * U, this._loc.y * U),
      t.stroke(70),
      this._points.map((e) => {
        t.strokeWeight(this._len * R.num(0.01, 0.02) * U),
          t.fill(R.num(30, 50)),
          renderCurve(t, e);
      });
  }
}
class DandilionPetals extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s),
      (this._points = ARR(R.int(100, 200), () => [
        this._loc.copy(),
        endpoint(
          this._loc,
          R.norm(this._angle, R.min(10, 60)),
          Math.max(1, R.norm(this._len, 5))
        ),
      ]));
  }
  _render(t) {
    t.noFill(),
      t.strokeWeight(this._len * R.num(0.2, 0.5) * U),
      t.stroke(85),
      t.point(this._loc.x * U, this._loc.y * U),
      this._points.map((e) => {
        const [s, n] = e;
        t.strokeWeight(this._len * R.num(0.04, 0.08) * U),
          t.drawingContext.setLineDash([
            this._len * R.num(0.01, 0.1) * U,
            this._len * R.num(0.03, 0.15) * U,
          ]),
          t.stroke(R.num(40, 60)),
          t.line(s.x * U, s.y * U, n.x * U, n.y * U);
      });
  }
}
class YellowButtonFlower extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
  }
  _render(t) {
    if (
      (t.push(),
      t.noStroke(),
      t.fill(this._palette.receptical.s()),
      t.translate(this._loc.x * U, this._loc.y * U),
      t.rotate(this._angle + 90),
      t.ellipse(0, 0, 0.5 * this._len * U, this._len * U),
      t.pop(),
      R.dec() < 0.5)
    )
      return;
    const e = endpoint(this._loc, this._angle, 0.4 * this._len),
      s = R.int(20, 50),
      n = R.num(30, 100);
    for (let i = 0; i < s; i++) {
      const s = endpoint(
        e,
        this._angle + R.num(-n, n),
        this._len * R.num(0.5, 1)
      );
      this._palette.petal.g(t, this._loc, this._len),
        t.line(e.x * U, e.y * U, s.x * U, s.y * U);
    }
  }
}
class PurpleBellFlower extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s), (this._points = []);
    const n = R.num(0, 360),
      i = toVectors([28, 541, 0, 0, 154, -68, 118, 2, 139, 74, 2, 0, 96, -279]),
      o = max(...i.slice(1, -1).map((t) => t.dist(CV(0, 0))));
    for (let t = 0; t < 2; t++) {
      const e = endpoint(
          this._loc,
          this._angle + R.norm(0, 10),
          this._len * R.dec()
        ),
        s = n + (360 / 7) * t + R.norm(0, 2),
        r = this._len * R.num(0.7, 1),
        l = orientShape(e, s, r, i, o);
      this._points.push(l);
    }
  }
  _render(t) {
    this._points.map((e) => {
      this._palette.fill.g(t),
        t.stroke(this._palette.stroke.s()),
        renderCurve(t, e);
    });
  }
}
class PinkTrumpetFlower extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = toVectors(
      R.idx([
        [-241, -25, 0, 0, 174, -96, 240, -307],
        [-300, 0, 0, 0, 315, 90, 552, 257],
      ])
    );
    this._points = orientCurve(
      endpoint(this._loc, R.num(0, 360), 0.1 * this._len),
      this._angle + R.num(30, 60) * R.idx([-1, 1]),
      this._len,
      n
    );
    const i = R.idx([
      [14, 415, 0, 0, 209, -52, 279, -74, 257, -22, 300, 0, 395, 228],
      [67, 151, 0, 0, 79, -82, 266, -91, 208, -67, 259, -27, 232, 0, 311, 101],
      [
        67, 151, 0, 0, 52, -64, 138, -50, 222, -128, 222, -67, 265, -46, 232, 0,
        311, 101,
      ],
    ]);
    this._offset = toVectors(i);
  }
  _render(t) {
    const e = new Curve(this._points).offset(this._offset, 20);
    t.fill(this._palette.fill.s()),
      this._palette.fill.g(t, this._loc),
      t.stroke(this._palette.stroke.s()),
      renderCurve(t, capCurve(e));
  }
}
class BlueBellFlower extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = toVectors(
      R.idx([
        [-241, -25, 0, 0, 174, -96, 240, -307],
        [-300, 0, 0, 0, 315, 90, 552, 257],
      ])
    );
    this._points = ARR(R.int(1, 5), () =>
      orientCurve(
        endpoint(
          this._loc,
          this._angle - R.norm(180, 2),
          this._len * R.num(0, 1.5)
        ),
        this._angle + R.norm(90, 4) * R.idx([-1, 1]),
        this._len,
        n
      )
    );
    const i = R.idx([
      [
        221, 354, 0, 0, 177, -143, 198, -101, 174, -63, 226, -44, 243, 0, 317,
        141,
      ],
      [221, 354, 0, 0, 112, -78, 198, -101, 181, -45, 243, 0, 317, 141],
      [-68, 240, 0, 0, 198, -101, 181, -45, 243, 0, 252, 290],
    ]);
    this._offset = toVectors(i);
  }
  _render(t) {
    this._points.map((e) => {
      t.push();
      const s = new Curve(e).offset(this._offset, 20);
      t.fill(this._palette.fill.s()),
        this._palette.fill.g(t, this._loc),
        t.stroke(this._palette.stroke.s()),
        renderCurve(t, capCurve(s)),
        t.pop();
    });
  }
}
class PaintbrushFlower extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    this._points = [
      [-74, 322, 0, 0, 252, -77, 252, -17, 192, 0, 243, 65, 0, 1, -149, -171],
      [
        -74, 322, 0, 0, 153, -111, 234, -54, 183, -25, 200, 35, 0, 1, -149,
        -171,
      ],
      [
        167, 315, 0, 0, 153, -111, 169, -61, 234, -54, 183, -25, 244, -4, 200,
        35, 0, 1, 24, -151,
      ],
    ].map((t) => {
      const e = toVectors(t);
      return [e, max(...e.slice(1, -1).map((t) => t.dist(CV(0, 0))))];
    });
  }
  _render(t) {
    const e = this._angle,
      s = this._len,
      n = this._loc,
      i = endpoint(n, e, s),
      o = R.int(5, 12);
    this._palette.stroke.g(t, n),
      t.strokeWeight(0.03 * s * U),
      t.line(n.x * U, n.y * U, i.x * U, i.y * U),
      t.strokeWeight(0.02 * s * U);
    for (let r = 0; r < o; r++) {
      t.push();
      const o = R.dec(),
        r = p5.Vector.lerp(n, i, o),
        l = (map(o, 0, 1, 15, 50) + R.norm(0, 6)) * R.idx([-1, 1]) + e,
        h = map(o, 0, 1, 0.2, 0.4) * s * R.num(0.8, 1.2),
        _ = orientShape(r, l, h, ...R.idx(this._points));
      this._palette.fill.g(t, r, h),
        renderCurve(t, _),
        t.noFill(),
        t.stroke(this._palette.stroke.s()),
        renderCurve(t, _),
        t.pop();
    }
  }
}
class SeedPod extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    let n = R.idx([1, -1]),
      i = t.angle + R.num(10, 25) * n,
      o = i + R.num(15, 45) * n,
      r = endpoint(this._loc, i, this._len),
      l = endpoint(r, o, this._len);
    this._points = [this._loc, this._loc, r, l];
  }
  _render(t) {
    const e = this._palette.stem.s(),
      s = this._palette.seed.s();
    t.noFill(),
      t.strokeWeight(this._len * R.num(0.01, 0.1) * U),
      t.stroke(e),
      renderCurve(t, this._points);
    let n = R.int(30, 80);
    for (let e = 0; e < n; e++) {
      let e = (t) => R.norm(t, 0.25),
        n = curvePointAtT(this._points, R.dec());
      t.strokeWeight(this._len * R.num(0.01, 0.1) * U),
        t.stroke(s),
        t.point(e(n.x) * U, e(n.y) * U);
    }
  }
}
class WheatPod extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    let n = R.idx([1, -1]),
      i = t.angle + R.num(0, 3) * n,
      o = i + R.num(15, 45) * n,
      r = endpoint(this._loc, i, this._len),
      l = endpoint(r, o, this._len);
    this._points = [this._loc, this._loc, r, l];
  }
  _render(t) {
    const e = this._palette.stem.s();
    t.noFill(),
      t.strokeWeight(0.01 * this._len * U),
      t.stroke(e),
      renderCurve(t, this._points);
    let s = R.int(30, 80);
    for (let e = 0; e < s; e++) {
      const e = R.dec(),
        s = curvePointAtT(this._points, e),
        n = map(e, 0, 1, 0.2, 0.1) * this._len,
        i = R.num(7, 15) * R.idx([-1, 1]),
        o = endpoint(s, this._angle + i, n);
      t.strokeWeight(this._len * R.num(0.01, 0.03) * U),
        t.stroke(this._palette.seed.s()),
        t.line(s.x * U, s.y * U, o.x * U, o.y * U);
    }
  }
}
class FlowerBunch extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    let n = R.idx([1, -1]),
      i = t.angle + R.num(10, 25) * n,
      o = i + R.num(15, 45) * n,
      r = endpoint(this._loc, i, this._len),
      l = endpoint(r, o, this._len);
    this._points = [this._loc, this._loc, r, l];
  }
  _render(t) {
    const e = this._palette.stem.s(),
      s = (e, s) => {
        const n = R.num(0, 360);
        let i = 0;
        for (
          t.push(),
            t.fill(0),
            this._palette.flower.g(t),
            t.stroke(this._palette.flower.s()),
            t.beginShape();
          i < 500;

        ) {
          const o = endpoint(e, i + n, s * R.num(0.2, 1));
          t.curveVertex(o.x * U, o.y * U), (i += R.num(30, 100));
        }
        t.endShape(), t.pop();
      };
    t.noFill(),
      t.strokeWeight(0.02 * this._len * U),
      t.stroke(e),
      renderCurve(t, this._points);
    let n = R.dec();
    for (let e = 0; e < 1; e += R.num(0.05, 0.15)) {
      const i = (i) => {
        const o = curvePointAtT(this._points, e),
          r = this._angle + i,
          l = min(0.35 * this._len, this._len * (1 - e) * 0.5),
          h = endpoint(o, r, l);
        if ((t.line(o.x * U, o.y * U, h.x * U, h.y * U), e < n)) {
          const t = R.int(1, 4);
          for (let e = 0; e < t; e++) {
            const t = p5.Vector.lerp(o, h, R.dec());
            s(t, 0.3 * l);
          }
        }
      };
      i(R.norm(50, 3)), i(-R.norm(50, 3));
    }
  }
}
class Leaf extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = toVectors([-17, 244, 0, 0, 111, -64, 357, 0, 717, 275]);
    (this._points = orientCurve(this._loc, this._angle, this._len, n)),
      (this._offset = toVectors([-580, 437, 0, 0, 300, 0, 600, 0]));
  }
  _render(t) {
    const e = new Curve(this._points).offset(this._offset, 20);
    t.fill(this._palette.fill.s()),
      this._palette.fill.g(t),
      t.stroke(this._palette.stroke.s()),
      renderCurve(t, capCurve(e));
  }
}
class WideLeaf extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = toVectors(
      R.idx([
        [-200, 135, 0, 0, 300, 0, 562, -150],
        [-241, -25, 0, 0, 174, -96, 240, -307],
      ])
    );
    this._points = orientCurve(this._loc, this._angle, this._len, n);
    const i = R.idx([
      [-60, 158, 0, 0, 101, -120, 300, 0, 600, 0],
      [-60, 158, 0, 0, 56, -87, 300, 0, 600, 0],
      [-60, 158, 0, 0, 56, -87, 156, -24, 300, 0, 600, 0],
      [-60, 158, 0, 0, 99, -13, 172, -36, 300, 0, 600, 0],
    ]);
    this._offset = toVectors(i);
  }
  _render(t) {
    const e = new Curve(this._points).offset(this._offset, 20);
    t.fill(this._palette.fill.s()),
      this._palette.fill.g(t),
      t.stroke(this._palette.stroke.s()),
      renderCurve(t, capCurve(e));
  }
}
class ThinLeaf extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = toVectors(
      R.idx([
        [-200, 135, 0, 0, 300, 0, 562, -150],
        [-241, -25, 0, 0, 174, -96, 240, -307],
        [-46, 153, 0, 0, 300, 0, 449, -270],
      ])
    );
    this._points = orientCurve(this._loc, this._angle, this._len, n);
    const i = R.idx([[-303, 362, 0, 0, 300, 0, 600, 0]]);
    this._offset = toVectors(i);
  }
  _render(t) {
    const e = new Curve(this._points).offset(this._offset, 20);
    t.fill(this._palette.fill.s()),
      this._palette.fill.g(t),
      t.stroke(this._palette.stroke.s()),
      renderCurve(t, capCurve(e)),
      renderCurve(t, this._points);
  }
}
class GrassLeaf extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s);
    const n = toVectors([-10, 149, 0, 0, 70, -34, 197, -24, 300, 0, 600, 0]),
      i = orientCurve(this._loc, this._angle, this._len, n);
    (this._points = i.map((t, e) =>
      e > 2 ? CV(t.x + R.norm(0, 3), t.y + R.norm(0, 3)) : t
    )),
      (this._offset = toVectors([-580, 437, 0, 0, 300, 0, 600, 0]));
  }
  _render(t) {
    const e = new Curve(this._points).offset(this._offset, 20, 0.1 * this._len);
    t.fill(this._palette.fill.s()),
      this._palette.fill.g(t),
      t.stroke(this._palette.stroke.s()),
      renderCurve(t, capCurve(e));
  }
}
class GroupLeaf extends PlantElement {
  constructor(t, e, s) {
    super(t, e, s), (this._points = []);
    const n = endpoint(this._loc, this._angle, this._len),
      i = R.num(0, 360),
      o = toVectors([
        -273, 133, 0, 0, 192, -37, 279, -19, 342, 0, 282, 19, 195, 41, 0, 0,
        -279, -90,
      ]),
      r = max(...o.slice(1, -1).map((t) => t.dist(CV(0, 0))));
    for (let t = 0; t < 7; t++) {
      const e = i + (360 / 7) * t + R.norm(0, 2),
        s = this._len * R.num(0.7, 1),
        l = endpoint(n, e, s),
        h = orientShape(n, e, s, o, r);
      this._points.push([n, l, h]);
    }
    this._dark = R.dec() < 0.5;
  }
  _render(t) {
    this._points.map((e) => {
      t.push();
      const [s, n, i] = e;
      this._dark
        ? this._palette.dark.g(t, this._start, 10 * this._len)
        : this._palette.light.g(t, this._start, 6 * this._len),
        renderCurve(t, i),
        t.stroke(this.dark ? this._palette.light.s() : this._palette.dark.s()),
        t.noFill(),
        t.line(s.x * U, s.y * U, n.x * U, n.y * U),
        t.pop();
    });
  }
}
class Stem extends PlantElement {
  constructor(t, e, s, n) {
    super(t, e, s), (this._points = n);
  }
  render(t) {
    t.push(),
      this._palette.applySettings(
        this._start,
        this._len,
        this._z,
        this._shadow
      ),
      this._points.map((e) => {
        e.length > 1 && this._renderSegment(t, capCurve(e));
      }),
      t.pop();
  }
  _renderSegment(t, e) {
    renderCurve(t, e);
  }
}
class BasicStem extends Stem {
  constructor(t, e, s, n) {
    super(t, e, s, n),
      (this._offset = toVectors([
        71, 310, 0, 0, 101, -27, 143, -27, 187, -22, 232, -20, 326, 0, 220, 137,
      ]));
  }
  _renderSegment(t, e) {
    t.noStroke(), this._palette.fill.g(t);
    const s = new Curve(e),
      n = min(0.02 * s.len(), 3),
      i = s.offset(this._offset, 25, n);
    renderCurve(t, i);
  }
}
class DecorativeStem extends Stem {
  constructor(t, e, s, n) {
    super(t, e, s, n),
      (this._offset = toVectors([
        28, 160, 0, 0, 69, -77, 61, -24, 116, -67, 121, -23, 161, -46, 189, -13,
        220, -42, 245, -8, 287, -35, 326, -17, 429, 0, 526, -9,
      ]));
  }
  _renderSegment(t, e) {
    t.noStroke(), t.fill(this._palette.fill.s(t));
    const s = new Curve(e),
      n = s.offset(this._offset, 100, s.len() / 10);
    renderCurve(t, n);
  }
}
