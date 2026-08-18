const initShaders = () => {
  const s = "sketch/shaders/noise.frag",
    e = "sketch/shaders/soften.frag",
    t = (s) => (e) => ARR(e, () => s() * U),
    u = (s, e) => {
      const t = {
        uSampleCnt: s,
        uAngles: ARR(s, () => radians(R.num(0, 360))),
        uLengths: ARR(s, () => 1 * U),
        uConstrainEdge: 1,
        uResolution: [WU, HU],
        uRandN: R.num(100, 1e4),
        uRandOffset: [R.num(1, 100), R.num(1, 100)],
        uAlphaFactor: 1,
        uNoiseBase: 14,
        uOctaves: 4,
        uAmpFalloff: 0.95,
        uLineWidth: 4 * U,
      };
      for (const [u, i] of Object.entries(e))
        t[u] = "function" == typeof i ? i(s) : i;
      return t;
    },
    i = [
      {
        n: "detail",
        s: [
          {
            f: s,
            u: u(17, {
              uLengths: t(() => R.min(0, 15, 1)),
              uNoiseBase: 14,
              uOctaves: 4,
              uAmpFalloff: 0.95,
              uConstrainEdge: 1,
            }),
          },
        ],
      },
      {
        n: "inverse",
        s: [
          {
            f: "sketch/shaders/inverse.frag",
            u: u(1, { uLengths: t(() => 1) }),
          },
        ],
      },
      {
        n: "outline",
        s: [
          {
            f: "sketch/shaders/outline.frag",
            u: u(250, {
              uLengths: t(() => R.num(0, 1)),
              uNoiseBase: 3,
              uOctaves: 4,
              uAmpFalloff: 0.6,
            }),
          },
        ],
      },
      {
        n: "mid",
        s: [
          {
            f: e,
            u: u(50, {
              uLengths: t(() => R.num(0, 70)),
              uConstrainEdge: 1,
              uDiff: 0.93,
            }),
          },
          {
            f: s,
            u: u(14, {
              uLengths: t(() => R.min(0, 14, 1)),
              uNoiseBase: 400,
              uOctaves: 4,
              uAmpFalloff: 0.5,
            }),
          },
          {
            f: e,
            u: u(50, {
              uLengths: t(() => R.num(0, 10)),
              uConstrainEdge: 1,
              uDiff: 0.01,
            }),
          },
        ],
      },
      {
        n: "back",
        s: [
          {
            f: s,
            u: u(14, {
              uLengths: t(() => R.min(0, 250, 1)),
              uNoiseBase: 35,
              uOctaves: 4,
              uAmpFalloff: 0.64,
            }),
          },
          { f: e, u: u(20, { uLengths: t(() => R.num(0, 75)), uDiff: 0.01 }) },
        ],
      },
    ],
    n = new ShaderCollection();
  return (
    i.map((s) => {
      const { n: e, s: t } = s,
        u = [];
      t.map((s) => {
        const { f: e, u: t } = s;
        u.push(new Shader("sketch/shaders/basic.vert", e, t));
      }),
        n.add(e, new MultiShader(u));
    }),
    n
  );
};
class Shader {
  constructor(s, e, t) {
    (this._uniforms = t), (this._shader = loadShader(s, e));
  }
  setShader(s) {
    s.setAttributes("alpha", !0), s.shader(this._shader);
    for (const [s, e] of Object.entries(this._uniforms))
      this._shader.setUniform(s, e);
  }
  setUniform(s, e) {
    (this._uniforms[s] = e), this._shader.setUniform(s, e);
  }
}
class MultiShader {
  constructor(s) {
    this._shaders = s;
  }
  setBuffers(s, e) {
    (this.gpWEBGL = s),
      (this.gpTexture = e),
      this._shaders.map((s) => s.setUniform("uTexture", e));
  }
  setUniform(s, e, t) {
    this._shaders[s].setUniform(e, t);
  }
  apply(s, e) {
    const t = this.gpWEBGL;
    this._shaders.map((e, u) => {
      const i = 0 == u ? s : t;
      this.gpTexture.clear(),
        this.gpTexture.image(i, 0, 0, WU, HU, 0, 0, WU, HU),
        e.setShader(t),
        t.rect(0, 0, WU, HU);
    }),
      e
        ? e.image(t, 0, 0, WU, HU, 0, 0, WU, HU)
        : image(t, 0, 0, WU, HU, 0, 0, WU, HU);
  }
}
class ShaderCollection {
  constructor() {
    (this._multiShaders = {}),
      (this.gpWEBGL = createGraphics(WU, HU, WEBGL)),
      this.gpWEBGL.pixelDensity(1),
      (this.gpTexture = mkGraphic());
  }
  add(s, e) {
    e.setBuffers(this.gpWEBGL, this.gpTexture), (this._multiShaders[s] = e);
  }
  apply(s, e, t) {
    return this._multiShaders[s].apply(e, t), t;
  }
  setUniform(s, e, t, u) {
    this._multiShaders[s].setUniform(e, t, u);
  }
  cleanup() {
    this.gpWEBGL.remove(), this.gpTexture.remove();
  }
}
