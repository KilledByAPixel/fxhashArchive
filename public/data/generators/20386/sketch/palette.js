class Lighting {
  constructor(lighting) {
    this._direct = lighting.direct;
    this._ambient = lighting.ambient;
    this._shadow = lighting.shadow;
    this._tDir = lighting.tDirect;
    this._lDir = lighting.lDirect || 0;
    this._tSh = lighting.tShadow || 0.1;
    this._o = lighting.atmosphereO;
    this._k = lighting.atmosphereK;
    this._fSat = lighting.fSat || 1;
  }
  apply(c, z, s) {
    c = this.sun(c);
    c = this.shadow(c, this._tSh, s);
    c = this.atmosphere(c, z);
    return color(hue(c), saturation(c) * this._fSat, lightness(c), alpha(c));
  }
  sun(c) {
    const lD = lightness(this._direct);
    const lS = lightness(c);
    const l = lS * (1 - this._lDir) + lD * this._lDir;
    c = this._lerp(c, this._direct, this._tDir);
    return color(hue(c), saturation(c), l, alpha(c));
  }
  atmosphere(c, z) {
    const t = sigmoid(z, this._o, this._k);
    return this._lerp(c, this._ambient, t);
  }
  shadow(c, t, s) {
    if (s == 0) return c;
    c = color(hue(c), saturation(c), lightness(c) * t);
    return this._lerp(c, this._shadow, s);
  }
  _lerp(c0, c1, t) {
    const toRGB = (c) =>
      new Color(
        "srgb",
        c.levels.map((l) => l / 255)
      );
    const [h, s, l] = toRGB(c0)
      .range(toRGB(c1), {
        space: "lch",
        outputSpace: "hsl",
      })(t)
      .coords.map((c) => Math.floor(c));
    return color(h, s, l);
  }
}

class Palette {
  constructor(paletteName) {
    const palettes = [
      {
        name: "0",
        weight: 1.8,
        sky: {
          background: varyNorm(color(5, 60, 25), 2, 2),
          lines: varyNum(color(365, 57, 50), 25),
          circle: varyNorm(color(40, 75, 50), 5, 5, 2),
          frame: varyNorm(color(37, 75, 50)),
        },
        lighting: {
          ambient: color(290, 40, 20),
          direct: color(57, 100, 97),
          shadow: color(240, 30, 5),
          tDirect: 0.05,
          atmosphereO: 5,
          atmosphereK: 1.5,
        },
      },
      {
        name: "1",
        weight: 1.2,
        sky: {
          background: varyNorm(color(5, 60, 25), 2, 2),
          lines: varyNum(color(365, 57, 50), 25),
          circle: varyNorm(color(40, 75, 50), 5, 5, 2),
          frame: varyNorm(color(340, 50, 20)),
        },
        lighting: {
          ambient: color(35, 45, 25),
          direct: color(0, 100, 97),
          shadow: color(0, 30, 5),
          tDirect: min(0.7, max(0.05, R.norm(0.5, 0.15))),
          atmosphereO: 5,
          atmosphereK: 1.5,
        },
      },
      {
        name: "2",
        weight: 1.2,
        sky: {
          background: varyNorm(color(190, 60, 50), 2, 2),
          lines: varyNum(color(0, 15, 60), 25),
          circle: varyNorm(color(57, 75, 85), 5, 5, 2),
          frame: varyNorm(color(57, 40, 80)),
        },
        lighting: {
          ambient: color(240, 40, 20),
          direct: color(57, 100, 97),
          shadow: color(210, 30, 5),
          tDirect: min(0.2, max(0.05, R.norm(0, 0.1))),
          atmosphereO: 6,
          atmosphereK: 2,
        },
      },
      {
        name: "3",
        weight: 1.2,
        sky: {
          background: varyNorm(color(45, 60, 50), 2, 2),
          lines: varyNum(color(50, 40, 60), 25),
          circle: varyNorm(color(60, 50, 80), 5, 5, 2),
          frame: varyNorm(color(35, 65, 70)),
        },
        lighting: {
          ambient: color(0, 30, 20),
          direct: color(45, 50, 65),
          shadow: color(57, 30, 15),
          tDirect: min(0.7, max(0.3, R.norm(0.5, 0.15))),
          lDirect: 0.5,
          atmosphereO: 5,
          atmosphereK: 1.75,
        },
      },
      {
        name: "4",
        weight: 1.2,
        sky: {
          background: varyNorm(color(290, 60, 25), 2, 2),
          lines: varyNum(color(320, 50, 35), 5),
          circle: varyNorm(color(30, 80, 60), 5, 5, 1),
          frame: varyNorm(color(30, 80, 55)),
        },
        lighting: {
          ambient: color(330, 35, 15),
          direct: color(0, 35, 50),
          shadow: color(270, 30, 15),
          tDirect: min(0.5, max(0.1, R.norm(0.3, 0.1))),
          lDirect: 0.5,
          atmosphereO: 4,
          atmosphereK: 1.65,
        },
      },
      {
        name: "5",
        weight: 1.2,
        sky: {
          background: varyNorm(color(250, 60, 60), 2, 2),
          lines: varyNum(color(220, 50, 75), 5),
          circle: varyNorm(color(60, 40, 85), 5, 5, 1),
          frame: varyNorm(color(60, 40, 75)),
        },
        lighting: {
          ambient: color(165, 32, 75),
          direct: color(95, 35, 40),
          shadow: color(240, 30, 15),
          tDirect: 0.2,
          atmosphereO: 5,
          atmosphereK: 1.65,
        },
      },
      {
        name: "6",
        weight: 1.5,
        sky: {
          background: varyNorm(color(250, 60, 20), 2, 2),
          lines: varyNum(color(220, 50, 40), 5),
          circle: varyNorm(color(30, 60, 45), 2, 2),
          frame: varyNorm(color(35, 60, 42)),
        },
        lighting: {
          ambient: color(250, 32, 20),
          direct: color(35, 60, 45),
          shadow: color(280, 50, 15),
          tDirect: min(0.7, max(0.5, R.norm(0.6, 0.07))),
          lDirect: 0.8,
          atmosphereO: 6.5,
          atmosphereK: 3.5,
        },
      },
      {
        name: "7",
        weight: 1.2,
        sky: {
          background: varyNorm(color(40, 60, 50), 2, 2),
          lines: varyNum(color(30, 65, 50), 2),
          circle: varyNorm(color(5, 60, 50), 2, 2),
          frame: varyNorm(color(355, 60, 53)),
        },
        lighting: {
          ambient: color(0, 25, 15),
          direct: color(0, 65, 55),
          shadow: color(0, 50, 15),
          tDirect: min(0.8, max(0.7, R.norm(0.75, 0.05))),
          lDirect: 0.8,
          atmosphereO: 6.5,
          atmosphereK: 3.5,
        },
      },
      {
        name: "8",
        weight: 1.2,
        sky: {
          background: varyNorm(color(40, 60, 50), 2, 2),
          lines: varyNum(color(30, 65, 50), 2),
          circle: varyNorm(color(5, 60, 50), 2, 2),
          frame: varyNorm(color(255, 36, 40)),
        },
        lighting: {
          ambient: color(42, 40, 65),
          direct: color(35, 50, 45),
          shadow: color(0, 50, 15),
          tDirect: R.max(0.7, 0.8, 3),
          lDirect: 0.8,
          atmosphereO: 4,
          atmosphereK: 1.65,
        },
      },
      {
        name: "9",
        weight: 1.2,
        sky: {
          background: varyNorm(color(210, 25, 65), 2, 2),
          lines: varyNum(color(240, 35, 70), 2),
          circle: varyNorm(color(180, 60, 95), 2, 2),
          frame: varyNorm(color(240, 45, 65)),
        },
        lighting: {
          ambient: color(175, 25, 70),
          direct: color(47, 100, 50),
          shadow: color(260, 50, 15),
          tDirect: 0.05,
          fSat: 0.9,
          atmosphereO: 4,
          atmosphereK: 1.65,
        },
      },
      {
        name: "10",
        weight: 1.2,
        sky: {
          background: varyNorm(color(240, 25, 10), 2, 2),
          lines: varyNum(color(240, 35, 35), 3),
          circle: varyNorm(color(180, 15, 65), 2, 2),
          frame: varyNorm(color(195, 25, 70)),
        },
        lighting: {
          ambient: color(260, 50, 5),
          direct: color(210, 35, 80),
          shadow: color(260, 50, 15),
          tDirect: 0.5,
          fSat: 0.9,
          atmosphereO: 4,
          atmosphereK: 1.65,
        },
      },
      {
        name: "11",
        weight: 0.5,
        sky: {
          background: varyNorm(color(150, 25, 20), 2, 2),
          lines: varyNum(color(160, 35, 45), 3),
          circle: varyNorm(color(65, 40, 55), 2, 2),
          frame: varyNorm(color(80, 25, 60)),
        },
        lighting: {
          ambient: color(150, 50, 5),
          direct: color(75, 100, 80),
          shadow: color(170, 50, 15),
          tDirect: 0,
          atmosphereO: 8,
          atmosphereK: 3.5,
        },
      },
    ];

    let palette = palettes.filter((p) => p.name == paletteName);
    palette = palette.length == 0 ? R.idx(palettes) : palette[0];

    this.light = new Lighting(palette.lighting);
    this.name = palette.name;
    this.sky = palette.sky;

    this.plants = {
      seedPod: {
        stem: varyNorm(color(0, 50, 10), 10, 5),
        seed: varyNorm(color(0, 20, 50), 2, 6, 1),
      },
      wheatPod: {
        stem: varyNorm(color(290, 30, 10), 10, 5),
        seed: varyNorm(color(300, 5, 55), 10, 2, 1),
      },
      agaveBlade: {
        light: varyNorm(color(0, 50, 50), 10, 5),
        dark: varyNorm(color(0, 50, 50), 10, 5),
        stroke: varyNorm(color(330, 50, 75), 10, 5),
      },
      roundBlade: {
        fill: varyNorm(color(80, 50, 50), 7, 5, 5),
        stroke: varyNorm(color(70, 30, 80), 3, 5),
      },
      wavyGrass: {
        fill: randHue([65, 70, 68], 65, 50),
        stroke: varyNorm(color(70, 30, 80), 5, 5),
      },
      basicStem: {
        fill: varyNorm(color(155, 20, 50), 10, 5),
      },
      basicStemYellow: {
        fill: varyNorm(color(65, 20, 70), 2, 5),
      },
      basicStemRed: {
        fill: varyNorm(color(280, 15, 40), 2, 5),
      },
      basicStemPaintbrush: {
        fill: varyNorm(color(70, 15, 50), 2, 5),
      },
      leaf: {
        fill: varyNorm(color(140, 45, 45), 10, 10, 2),
        stroke: varyNorm(color(160, 50, 60), 10, 5, 10),
      },
      grassLeaf: {
        fill: varyNorm(color(130, 45, 45), 15, 10, 2),
        stroke: varyNorm(color(90, 30, 70), 10, 5, 10),
      },
      groupLeaf: {
        light: varyNorm(color(85, 30, 65), 2, 10, 2),
        dark: varyNorm(color(100, 40, 30), 3, 5, 5),
      },
      paintbrushLeaf: {
        fill: varyNorm(color(100, 45, 45), 15, 10, 2),
        stroke: varyNorm(color(90, 30, 70), 10, 5, 10),
      },
      flowerBunch: {
        stem: varyNorm(color(0, 40, 55), 5, 1, 1),
        flower: varyNorm(color(280, 50, 60), 10, 10, 10),
      },
      yellowButtonFlower: {
        receptical: varyNorm(color(65, 35, 40), 10, 1, 5),
        petal: varyNorm(color(55, 60, 55), 6, 1, 1),
      },
      purpleBellFlower: {
        fill: varyNorm(color(230, 45, 50), 5, 1, 5),
        stroke: varyNorm(color(225, 35, 75), 6, 1, 1),
      },
      pinkTrumpetFlower: {
        fill: varyNorm(color(300, 45, 50), 5, 1, 5),
        stroke: varyNorm(color(300, 35, 75), 6, 1, 3),
      },
      blueBellFlower: {
        fill: varyNorm(color(220, 45, 75), 8, 1, 5),
        stroke: varyNorm(color(240, 35, 80), 6, 1, 3),
      },
      paintbrushFlower: {
        fill: varyNorm(color(0, 55, 50), 7, 1, 5),
        stroke: varyNorm(color(35, 60, 62), 6, 1, 3),
      },
    };

    for (const [key, value] of Object.entries(this.plants)) {
      this.plants[key] = new PlantPalette(value, this.light);
    }
  }
}

class PlantPalette {
  constructor(colors, light) {
    this._colors = colors;
    this._light = light;
    this._loc = undefined;
    this._len = 0;
    this._z = 0;
    this._shadow = 0;

    const solid = (c) => () => this._light.apply(c(), this._z, this._shadow);
    const gradient = (c) => (gp, loc, len) => {
      loc = loc || this._loc;
      len = abs(len || this._len);
      let x = loc.x,
        y = loc.y,
        z = this._z,
        s = this._shadow,
        light = this._light,
        ctx = gp.drawingContext,
        grad = ctx.createRadialGradient(x * U, y * U, 0, x * U, y * U, len * U),
        c0 = light.apply(light.shadow(c(), 0.1, 0.4), z, s),
        c1 = light.apply(light.shadow(c(), 0.8, 0.2), z, s),
        c2 = light.apply(c(), z, s);
      grad.addColorStop(0, c0);
      grad.addColorStop(0.3, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.strokeStyle = grad;
    };

    for (const [key, func] of Object.entries(colors)) {
      const api = {
        b: func,
        s: solid(func).bind(this),
        g: gradient(func).bind(this),
      };
      this[key] = api;
    }
  }
  applySettings(loc, len, z, shadow) {
    this._loc = loc.copy();
    this._len = len || 0;
    this._z = z || 0;
    this._shadow = shadow || 0;
  }
}

const varyNorm = (c, h, s, l, a) => () =>
  color(
    R.norm(hue(c), h || 0),
    R.norm(saturation(c), s || 0),
    R.norm(lightness(c), l || 0),
    R.norm(alpha(c), a || 0)
  );
const varyNum = (c, h, s, l, a) => () =>
  color(
    hue(c) + R.num(-h || 0, h || 0),
    saturation(c) + R.num(-s || 0, s || 0),
    lightness(c) + R.num(-l || 0, l || 0),
    alpha(c) + R.num(-a || 0, a || 0)
  );
const randHue = (hArr, s, l) => () => color(R.idx(hArr), s, l);
