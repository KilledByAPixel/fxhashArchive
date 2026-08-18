class Wind {
  constructor() {
    (this._b = R.num(10, 300)),
      (this._off = R.num(0, 5e3)),
      (this._w = 0),
      (this._wMax = int(R.min(1, 5, 2)));
  }
  apply(n, t, s, e) {
    t %= 360;
    const [o, i] = this._getForce(n);
    t < 0 && (t += 360);
    const a = o - t,
      r = atan2(sin(a), cos(a));
    return s + i * map(abs(r), 0, 180, 0, 1) * e * (r < 0 ? -1 : 1);
  }
  _getForce(n) {
    const t = noise(n.y / this._b + this._off),
      s = map(t, 0, 1, -8, 8),
      e = ((o = s), 1 / (1 + Math.pow(Math.E, -o)));
    var o;
    return [s < 0 ? 180 : 0, abs(180 * e)];
  }
  render(n, t) {
    if (
      !((n) =>
        R.dec() < 0.15 && n > 0.3 * H && n < 1.1 * H && this._w < this._wMax)(t)
    )
      return;
    const [s, e] = this._getForce(CV(0, t));
    new Wave(t, e, s).render(n);
    this._w++;
  }
}
class Wave {
  constructor(n, t, s) {
    const e = 0 == s ? R.num(15, 75) : R.num(105, 175),
      o = (n) => {
        const t = e - n,
          s = e + n,
          o = abs(atan2(sin(t), cos(t))),
          i = abs(atan2(sin(s), cos(s)));
        return o < 4 || i < 4;
      },
      i = () => map(t, 0, 180, 7, 15) * R.norm(1, 0.05);
    let a = 180 == s ? W + 50 : -50,
      r = CV(a, 0),
      c = map(t, 0, 180, 10, 20),
      h = R.norm(0, 10),
      p = i(),
      m = [r.copy()];
    let u = 0;
    for (let n = 0; n < 1e3; n++) {
      u++, (p *= 1.05), (h += p);
      let n = endpoint(r, h, c);
      m.push(n.copy()),
        (r = n.copy()),
        ((o(h) && R.dec() < 0.85) || u > 35 || abs(p) > 37) &&
          ((p = i() * Math.sign(p)), (p *= -1), (u = 0));
    }
    this._points = m;
  }
  render(n) {
    n.push(), n.noFill();
    const c = R.int(4, 10);
    for (let t = 0; t < c; t++) {
      const b = R.norm(150, 10),
        s = R.num(0, 1e3),
        e = R.num(0, 1e3),
        o = this._points.map((n) =>
          CV(
            n.x + map(noise(n.x / b + s), 0, 1, -6, 6),
            n.y + map(noise(n.y / b + e), 0, 1, -6, 6)
          )
        ),
        i = PALETTE.sky.wind ? PALETTE.sky.wind() : PALETTE.sky.circle();
      n.strokeWeight(R.num(0.5, 2) * U),
        n.stroke(hue(i), saturation(i), lightness(i), R.num(5, 25)),
        n.beginShape(),
        o.map((t) => n.curveVertex(t.x * U, t.y * U)),
        n.endShape();
    }
    n.pop();
  }
}
