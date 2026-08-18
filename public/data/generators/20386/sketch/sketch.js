class Environment {
  constructor(layout) {
    this.gpIn = mkGraphic();
    this.gpOut = mkGraphic();
    this.gpOutlines = mkGraphic();
    this.gpMask = mkGraphic();

    this.wind = new Wind();
    this.layout = new layout(this.wind);
    this._zMin = R.num(-1, 0);
    this._frame = new Frame();
  }
  render() {
    backgroundTexture(this.gpIn);
    SHADERS.apply("back", this.gpIn);
  }
  draw() {
    const gpIn = this.gpIn,
      gpOut = this.gpOut,
      gpOutlines = this.gpOutlines,
      gpMask = this.gpMask,
      plants = this.layout.getPlants(),
      z = plants[0].z,
      y = plants[0].loc.y;
    gpIn.clear();
    gpOut.clear();
    plants.map((p) => p.render(gpIn));
    SHADERS.setUniform("detail", 0, "uAlphaFactor", map(z, 3, 0.5, 0.8, 2.5));
    SHADERS.setUniform(
      "detail",
      0,
      "uLengths",
      ARR(250, () => R.num(0, map(z, 3, 0.5, 50, 5)) * U)
    );
    SHADERS.apply("detail", gpIn, gpOut);
    gpMask.clear();
    this.wind.render(gpMask, y);
    addImg(gpMask);
    addImg(gpOut);

    this._frame.render(y);

    gpMask.clear();
    SHADERS.apply("inverse", gpOut, gpMask);
    const imgMask = gpToImg(gpMask);
    gpOut.clear();
    SHADERS.setUniform(
      "outline",
      0,
      "uLineWidth",
      map(z, 3, 0.5, this._zMin, 4.5) * U
    );
    SHADERS.apply("outline", gpIn, gpOut);
    const priorOutlines = gpToImg(gpOutlines);

    priorOutlines.mask(imgMask);
    gpOutlines.clear();
    gpOutlines.image(priorOutlines, 0, 0, WU, HU, 0, 0, WU, HU);
    gpOutlines.image(gpOut, 0, 0, WU, HU, 0, 0, WU, HU);
  }
  finished() {
    return this.layout.finished();
  }
  cleanup() {
    addImg(this.gpOutlines);
    this.gpIn.remove();
    this.gpOut.remove();
    this.gpOutlines.remove();
    this.gpMask.remove();
  }
}

class Settings {
  constructor() {
    const layoutOptions = [
      ["Linear", LinearLayout],
      ["Circular", CircleLayout],
      ["Diagonal", DiagonalLayout],
    ];
    const palettes = [
      {
        name: "0",
        title: "8:00 PM",
        weight: 1.8,
      },
      {
        name: "1",
        title: "8:15 PM",
        weight: 1.2,
      },
      {
        name: "2",
        title: "7:00 AM",
        weight: 1.2,
      },
      {
        name: "3",
        title: "3:30 PM",
        weight: 1.2,
      },
      {
        name: "4",
        title: "6:30 AM",
        weight: 1.2,
      },
      {
        name: "5",
        title: "1:00 PM",
        weight: 0.5,
      },
      {
        name: "6",
        title: "8:30 PM",
        weight: 1.6,
      },
      {
        name: "7",
        title: "7:00 PM",
        weight: 1.2,
      },
      {
        name: "8",
        title: "7:30 PM",
        weight: 1.2,
      },
      {
        name: "9",
        title: "11:00 AM",
        weight: 1.2,
      },
      {
        name: "10",
        title: "4:00 AM",
        weight: 1.3,
      },
      {
        name: "11",
        title: "6:00 AM",
        weight: 0.5,
      },
    ];

    const [layoutName, layout] = R.idx(layoutOptions);
    const palette = selectWeighted(palettes);

    this.layout = layout;
    this.layoutName = this.palette = palette.name;
    this.frame = R.dec() < 0.95;
    this.filledFrame = R.dec() < 0.5;
    this.multiFrame = R.dec() < 0.95;

    let frameStyle = "None";
    if (this.frame && !this.filledFrame) frameStyle = "Thin";
    if (this.frame && this.filledFrame) frameStyle = "Filled";

    window.$fxhashFeatures = {
      Palette: palette.title,
      "Frame Style": frameStyle,
      Layout: layoutName,
    };
  }
}
const SET = new Settings();

let ENV, PALETTE, SHADERS, PLANT_DEFS;

function preload() {
  SHADERS = initShaders();
}
function setup() {
  noiseSeed(R.dec());
  angleMode(DEGREES);
  colorMode(HSL, 360, 100, 100, 100);
  createCanvas(WU, HU);
  pixelDensity(1);
  strokeWeight(1 * U);

  PALETTE = new Palette(SET.palette);
  background(PALETTE.sky.background());
  document.body.style.backgroundColor = PALETTE.sky.background();
  PLANT_DEFS = initPlantDefs();
  ENV = new Environment(SET.layout);
  ENV.render();
}

function draw() {
  ENV.draw();
  if (ENV.finished()) {
    noLoop();
    ENV.cleanup();
    SHADERS.cleanup();
    fxpreview();
  }
}

console.log("=============");
console.log("Ephemera");
console.log("M.J. Lindow");
console.log("2022");
console.log("=============");
