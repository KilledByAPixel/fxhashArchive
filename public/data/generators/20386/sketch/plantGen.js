class PlantGenerator {
  constructor(t, e) {
    (this.viewHeight = t), (this.wind = e);
  }
  grow(t, e, n) {
    let { statement: s, rules: a, actions: l, n: i } = t;
    "function" == typeof s && (s = s());
    const r = i();
    for (let t = 0; t < r; t++) {
      let t = "";
      for (let e of s) t += e in a ? a[e] : e;
      s = t;
    }
    const o = t.height / this.viewHeight / n,
      { style: m, idx: h, resistance: c, palette: R } = t.stem,
      u = new PlantState(e, -90, n, o, c, this.wind);
    for (let t of s)
      "[" == t && u.push(), "]" == t && u.pop(), t in l && l[t](u);
    return u.getPlant(m, R, h, n);
  }
}
class PlantState {
  constructor(t, e, n, s, a, l) {
    (this.start = t.copy()),
      (this.loc = t.copy()),
      (this.z = n),
      (this.angle = e),
      (this.len = 0),
      (this.scale = s),
      (this.resistance = a),
      (this.wind = l),
      (this.i = 0),
      (this._branch = new BranchState(t, e)),
      (this._finishedPoints = []),
      (this._stack = []),
      (this._elements = {}),
      (this._totalLen = 0);
  }
  getPlant(t, e, n, s) {
    const a = [...this._finishedPoints, this._branch.points];
    return (
      this.addElement(new t(this, this._totalLen, e, a), n),
      new Plant(this.start.copy(), s, this._elements)
    );
  }
  move(t) {
    this._branch.move(t * this.scale),
      this.i++,
      (this.loc = this._branch.loc.copy()),
      (this.len = this._branch.len),
      this.len > this._totalLen && (this._totalLen = this.len);
  }
  turn(t) {
    const e = this._branch;
    if (this.wind) {
      const n = e.len / this.scale / H,
        s = this.resistance(n),
        a = this.wind.apply(this.start, e.angle, t, s);
      e.turn(a);
    } else e.turn(t);
    this.angle = this._branch.angle;
  }
  addElement(t, e = 0) {
    e in this._elements ? this._elements[e].push(t) : (this._elements[e] = [t]);
  }
  push() {
    this._stack.push(this._branch.copy());
  }
  pop() {
    this._finishedPoints.push(this._branch.points),
      (this._branch = this._stack.pop());
  }
}
class BranchState {
  constructor(t, e, n) {
    (this.loc = t),
      (this.angle = e),
      (this.len = n || 0),
      (this.points = [t.copy()]);
  }
  copy() {
    return new BranchState(this.loc, this.angle, this.len);
  }
  move(t) {
    (this.loc = endpoint(this.loc, this.angle, t)),
      this.points.push(this.loc.copy()),
      (this.len += t);
  }
  turn(t) {
    this.angle += t;
  }
}
const initPlantDefs = () => [
  {
    name: "Flower 1",
    statement: () => "B".repeat(R.int(1, 5)),
    rules: { B: "[FA]", A: "[RLFA]" },
    actions: {
      F: (t) => t.move(R.num(20, 25)),
      R: (t) => t.turn(R.num(-7, 7)),
      A: (t) =>
        t.addElement(
          new FlowerBunch(
            t,
            map(t.len, 0, H, R.norm(30, 3), R.norm(80, 3)),
            PALETTE.plants.flowerBunch
          )
        ),
      L: (t) => {
        const e = () => {
            const e = map(t.i, 0, 15, 60, 20);
            R.dec() < 0.9 &&
              t.addElement(
                new Leaf(t, R.norm(e, 0.1 * e), PALETTE.plants.leaf),
                R.int(0, 3)
              );
          },
          n = R.norm(90, 6);
        t.turn(n), e(), t.turn(2 * -n), e(), t.turn(n);
      },
    },
    n: () => int(R.max(5, 12, 3)),
    height: 36,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStem,
      resistance: (t) => 0.3 * t,
    },
  },
  {
    name: "Grass 1",
    statement: () => "B".repeat(R.int(1, 10)),
    rules: { B: "[SA]", A: "[TTTA]" },
    actions: {
      S: (t) => {
        t.turn(R.num(0, 30) * R.idx([1, -1])), t.move(R.num(3, 20));
      },
      A: (t) =>
        t.addElement(
          new WheatPod(t, R.num(40, 60), PALETTE.plants.wheatPod, 2)
        ),
      T: (t) => {
        if (R.dec() < 0.1) return;
        t.move(R.num(3, 7));
        const e = map(t.len, 0, H / 2, 0.5, 0);
        R.dec() < e &&
          t.len < H / 2 &&
          (() => {
            const e = map(t.len, 0, H / 2, 80, 20),
              n = R.num(0, 360);
            t.turn(n),
              t.addElement(
                new GrassLeaf(t, R.norm(e, 0.1 * e), PALETTE.plants.grassLeaf),
                R.int(0, 3)
              ),
              t.turn(-n);
          })();
        const n =
          t.angle -
          ((s = R.norm(-90, 3)),
          (a = t.angle),
          (l = R.num(0, 3)),
          a < s ? a + l : a - l);
        var s, a, l;
        t.turn(-1 * n);
      },
    },
    n: () => int(R.max(12, 24), 3),
    height: 36,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStem,
      resistance: (t) => 0.2 * t,
    },
  },
  {
    name: "Flower 2",
    statement: "GFRFA",
    rules: { A: "[RFA][RFA][RFA]" },
    actions: {
      F: (t) => t.move(R.num(25, 35)),
      R: (t) => t.turn(R.norm(0, 20)),
      A: (t) =>
        t.addElement(
          new YellowButtonFlower(
            t,
            R.num(5, 10),
            PALETTE.plants.yellowButtonFlower
          ),
          2
        ),
      G: (t) => {
        const e = R.int(13, 25);
        for (let n = 0; n < e; n++)
          t.addElement(
            new RoundBlade(t, R.num(20, 150), PALETTE.plants.roundBlade),
            R.idx([0, 1])
          );
      },
    },
    n: () => 3,
    height: 72,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStemYellow,
      resistance: (t) => 2 * t,
    },
  },
  {
    name: "Flower 3",
    statement: () => "[RA]".repeat(6),
    rules: { A: "[TA]" },
    actions: {
      R: (t) => t.turn(R.max(0, 60, 2) * R.idx([-1, 1])),
      A: (t) =>
        t.addElement(
          new PurpleBellFlower(
            t,
            R.num(5, 10),
            PALETTE.plants.purpleBellFlower
          ),
          2
        ),
      T: (t) => {
        t.move(R.num(17, 27));
        (t.len > H / 4) & (R.dec() < 0.8) &&
          ARR(2, () => {
            t.addElement(
              new PurpleBellFlower(
                t,
                map(t.len, 0, H, 25, 1),
                PALETTE.plants.purpleBellFlower
              ),
              2
            );
          });
        const e = map(t.len, 0, H / 2, 1, 0);
        t.len < H / 3 &&
          R.dec() < e &&
          ARR(3, () =>
            (() => {
              const e = R.num(0, 360);
              t.turn(e),
                t.addElement(
                  new GroupLeaf(t, R.num(20, 30), PALETTE.plants.groupLeaf),
                  R.int(0, 3)
                ),
                t.turn(-e);
            })()
          );
        const n =
          t.angle -
          ((s = R.norm(-90, 3)),
          (a = t.angle),
          (l = R.num(0, 15)),
          a < s ? a + l : a - l);
        var s, a, l;
        t.turn(-1 * n);
      },
    },
    n: () => int(R.max(3, 10, 3)),
    height: 72,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStemRed,
      resistance: (t) => 2 * t,
    },
  },
  {
    name: "Flower 4",
    statement: () => "B".repeat(R.int(3, 5)),
    rules: { B: "[SFAA]", A: "[LRFA]" },
    actions: {
      S: (t) => {
        t.turn(R.num(15, 45) * R.idx([1, -1])), t.move(R.num(5, 15));
      },
      F: (t) => {
        t.move(R.num(25, 30));
        const e =
          t.angle -
          ((n = R.norm(-90, 3)), (s = t.angle), (a = 3), s < n ? s + a : s - a);
        var n, s, a;
        t.turn(-1 * e);
      },
      R: (t) => t.turn(R.num(-7, 7)),
      A: (t) =>
        ARR(R.int(1, 5), () =>
          t.addElement(
            new PinkTrumpetFlower(
              t,
              map(t.len, 0, H, R.norm(20, 3), R.norm(30, 3)),
              PALETTE.plants.pinkTrumpetFlower
            ),
            2
          )
        ),
      L: (t) => {
        const e = () => {
            const e = map(t.len, 0, 0.7 * H, 60, 1);
            R.dec() < 0.9 &&
              t.addElement(
                new WideLeaf(t, R.norm(e, 0.1 * e), PALETTE.plants.leaf),
                R.int(0, 3)
              );
          },
          n = R.norm(90, 6);
        t.turn(n), e(), t.turn(2 * -n), e(), t.turn(n);
      },
    },
    n: () => int(R.max(5, 12, 3)),
    height: 36,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStem,
      resistance: (t) => 0.3 * t,
    },
  },
  {
    name: "Flower 5",
    statement: () => "B".repeat(R.int(1, 3)),
    rules: { B: "[SFAA]", A: "[FLRFA]" },
    actions: {
      S: (t) => {
        t.turn(R.num(15, 45) * R.idx([1, -1])), t.move(R.num(5, 15));
      },
      F: (t) => {
        t.move(R.num(12, 16));
        const e =
          t.angle -
          ((n = R.norm(-90, 3)), (s = t.angle), (a = 6), s < n ? s + a : s - a);
        var n, s, a;
        t.turn(-1 * e);
      },
      R: (t) => t.turn(R.num(-13, 13)),
      A: (t) =>
        t.addElement(
          new PaintbrushFlower(
            t,
            map(t.len, 0, H, R.norm(30, 3), R.norm(60, 3)),
            PALETTE.plants.paintbrushFlower
          ),
          2
        ),
      L: (t) => {
        const e = () => {
            const e = map(t.len, 0, 0.7 * H, 50, 1);
            R.dec() < 0.9 &&
              t.addElement(
                new ThinLeaf(
                  t,
                  R.norm(e, 0.1 * e),
                  PALETTE.plants.paintbrushLeaf
                ),
                R.int(0, 3)
              );
          },
          n = R.norm(45, 6);
        t.turn(n), e(), t.turn(2 * -n), e(), t.turn(n);
      },
    },
    n: () => int(R.max(5, 12, 3)),
    height: 36,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStemPaintbrush,
      resistance: (t) => 0.25 * t,
    },
  },
  {
    name: "Flower 6",
    statement: () => "G" + "A".repeat(R.int(3, 7)),
    rules: { A: "[RFA]" },
    actions: {
      F: (t) => t.move(R.num(50, 100)),
      R: (t) => t.turn(R.norm(0, 10)),
      A: (t) =>
        t.addElement(
          new BlueBellFlower(t, R.num(10, 20), PALETTE.plants.blueBellFlower),
          2
        ),
      G: (t) => {
        const e = R.int(50, 100);
        for (let n = 0; n < e; n++)
          t.addElement(
            new WavyGrass(t, R.num(100, 250), PALETTE.plants.wavyGrass),
            R.idx([0, 1])
          );
      },
    },
    n: () => R.int(2, 4),
    height: 24,
    stem: {
      style: BasicStem,
      idx: 1,
      palette: PALETTE.plants.basicStemYellow,
      resistance: (t) => 2 * t,
    },
  },
];
