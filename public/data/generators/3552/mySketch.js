var colors = "2660a4-edf7f6-f19953-c47335-56351e"
  .split("-")
  .map((a) => "#" + a);
var colors2 = "83b692-f9ada0-f9627d-c65b7c-5b3758"
  .split("-")
  .map((a) => "#" + a);
let signPoints = [
  [126.7180202224328, 74.62338403438254],
  [125.71668153434713, 73.62238102535545],
  [117.70597202966172, 70.61937199827422],
  [112.69927858923334, 69.61836898924713],
  [100.68321433220522, 69.61836898924713],
  [91.67116613943413, 71.62037500730129],
  [87.66581138709144, 72.62137801632838],
  [69.64171500154927, 79.62839907951795],
  [62.63234418494954, 87.63642315173459],
  [57.62565074452115, 96.64545023297832],
  [56.62431205643548, 99.64845926005957],
  [57.62565074452115, 108.6574863413033],
  [58.626989432606834, 109.65848935033038],
  [69.64171500154927, 113.6625013864387],
  [98.68053695603388, 110.65949235935746],
  [112.69927858923334, 105.65447731422206],
  [136.73140710328957, 96.64545023297832],
  [166.77156774585984, 79.62839907951795],
  [170.77692249820254, 75.62438704340963],
  [173.78093856245957, 73.62238102535545],
  [173.78093856245957, 74.62338403438254],
  [169.77558381011687, 78.62739607049086],
  [169.77558381011687, 79.62839907951795],
  [168.7742451220312, 81.63040509757211],
  [168.7742451220312, 81.63040509757211],
  [169.77558381011687, 80.62940208854502],
  [171.77826118628823, 78.62739607049086],
  [177.7862933148023, 76.6253900524367],
  [178.78763200288796, 76.6253900524367],
  [183.79432544331632, 81.63040509757211],
  [183.79432544331632, 82.6314081065992],
  [185.7970028194877, 84.63341412465336],
  [185.7970028194877, 84.63341412465336],
  [202.81976051694417, 79.62839907951795],
  [209.82913133354393, 74.62338403438254],
  [210.8304700216296, 74.62338403438254],
  [210.8304700216296, 76.6253900524367],
  [209.82913133354393, 78.62739607049086],
  [209.82913133354393, 79.62839907951795],
  [226.8518890310004, 79.62839907951795],
  [231.85858247142878, 77.62639306146379],
  [236.86527591185717, 72.62137801632838],
  [237.86661459994284, 72.62137801632838],
  [237.86661459994284, 72.62137801632838],
  [237.86661459994284, 73.62238102535545],
  [241.87196935228556, 73.62238102535545],
  [259.8960657378277, 72.62137801632838],
  [260.8974044259134, 71.62037500730129],
  [260.8974044259134, 71.62037500730129],
  [261.89874311399905, 72.62137801632838],
  [269.9094526186845, 74.62338403438254],
  [275.91748474719856, 74.62338403438254],
  [281.9255168757126, 74.62338403438254],
  [310.9643388301972, 68.61736598022006],
  [326.985757839568, 64.61335394411172],
  [345.0098542251102, 59.60833889897632],
  [366.0379666749094, 54.60332385384092],
  [369.04198273916643, 53.60232084481383],
  [371.04466011533776, 51.60031482675967]
]
let synth

var c;
let mainGraphics, webGLGraphics

let random = (obj, obj2) => {
  //random()
  if (obj == undefined) {
    return R.random_dec();
  }
  //random([1,2,3])
  if (Array.isArray(obj)) {
    return R.random_choice(obj);
  }
  //random(50)
  if (typeof obj == "number" && typeof obj2 == "number") {
    return R.random_num(obj, obj2);
  }
  //random(50)
  if (typeof obj == "number" && obj2 == undefined) {
    return R.random_num(0, obj);
  }
  if (typeof obj == "object") {
    return R.random_choice_weight(obj);
  }
};
let notes = "Eb1,C2,Eb4,G3,C5,Eb6,G6".split(",")
let notes2 = "Db1,F2,Ab4,D3,F5,Ab6,D6".split(",")
let notes3 = "G1,Bb2,D4,G3,Bb4,F5".split(",")
let notes4 = "A1,C1,E1,A2,C2,E2,A3,C3,E3,G5".split(",")
let chordList = {
  "Cm": notes,
  "Db": notes2,
  "Bb": notes3,
  "Am": notes4
}
let features = {}

function renderFeatures() {
  let c = random([...colors, ...colors2]);

  return {
    useColor: c,
    useNotes: random(Object.keys(chordList))
  }
}

let overAllTexture;

var DEFAULT_SIZE = 1200;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var DIM = Math.min(WIDTH, HEIGHT);
var M = DIM / DEFAULT_SIZE;

let theShader

function preload() {
  features = renderFeatures()
  window.$fxhashFeatures = features
}
let branchCount = 0

function setup() {
  console.log("Artist: Che-Yu Wu")
  console.log("https://twitter.com/cheyuwu345")
  console.log("Special Thanks to Tinaaaaalee", "https://twitter.com/tinaaaaalee")

  theShader = new p5.Shader(this.renderer, vert, frag)
  synth = new Tone.PolySynth().toDestination();
  createCanvas(DIM, DIM);
  mainGraphics = createGraphics(DEFAULT_SIZE, DEFAULT_SIZE)
  webGLGraphics = createGraphics(DEFAULT_SIZE, DEFAULT_SIZE, WEBGL)
  noiseSeed(seed)
  width = DEFAULT_SIZE;
  height = DEFAULT_SIZE;
  let ratio = map(sin(PI / 2), -1, 1, 0, 1)
  let currentLevel = int(ratio * 11)
  drawTri(currentLevel);
  if (firstRun) {
    features.branchCount = branchCount
    window.$fxhashFeatures = features
  }
  firstRun = false
}

function drawTri(d, branchId) {
  if (firstRun) {
    branchCount++
  }
  mainGraphics.push()
  mainGraphics.blendMode(SCREEN);
  mainGraphics.noStroke();
  let random = (a = 0, b = 1, args = []) => {
    if (Array.isArray(a)) {
      let index = 4
      // console.log(index)
      let clr = a[rawParams[0] % a.length]
      // console.log(clr)
      return clr
    } else {
      return map(noise(d, ...args), 0, 1, a, b)

    }
  }
  let xspan = random(1, 8, [rawParams[0] + d * 50, frameCount / 600, branchId]);
  let yspan = random(40, 200, [rawParams[1] + d * 50, frameCount / 600, branchId]);

  let c = color(features.useColor)
  let exp = random(2.5, 5);
  mainGraphics.stroke(c);
  c.setAlpha(220);
  mainGraphics.fill(c);
  let sc = map(noise(d, branchId, frameCount / 200), 0, 1, 0.8, 0.99);
  // stroke(c)
  mainGraphics.triangle(0, 0, -xspan, yspan, xspan, yspan);
  mainGraphics.ellipse(0, 0, xspan * 3);
  if (random() < 0.15) {
    d -= 1;
  }
  if (random() < 0.3) {
    for (var i = 0; i < 5; i++) {
      mainGraphics.ellipse(random(-100, 100), random(-100, 100), xspan * random(3));
    }
  }

  if (d > 0) {
    mainGraphics.push();
    mainGraphics.translate(-xspan, yspan);
    mainGraphics.rotate(sin(d / 10) / exp + noise(d / 50 - 0.5, branchId) / exp + sin(frameCount / 50) * 0.1);
    mainGraphics.scale(sc);
    drawTri(d - 1, d * 500);
    mainGraphics.pop();
    mainGraphics.push();
    mainGraphics.translate(xspan, yspan);
    mainGraphics.rotate(-sin(d / 10) / exp - noise(d / 2 - 0.5, branchId) / exp + sin(frameCount / 50) * 0.1);
    mainGraphics.scale(sc);
    drawTri(d - 1, d * 123);
    mainGraphics.pop();
  }


  mainGraphics.pop()
}
let lastLevel = 0
let firstRun = true

function draw() {


  mainGraphics.push()

  mainGraphics.background(200);
  mainGraphics.fill(0);
  mainGraphics.noStroke()
  mainGraphics.rect(0, 0, width, height);

  for (var i = 0; i < 500; i++) {
    mainGraphics.noStroke()
    mainGraphics.fill(255)
    let y = (frameCount / (2 + noise(i) * 5) + noise(i * 2000) * height + i)
    mainGraphics.circle(noise(i) * width + sin(y / 5) * 10, y % height, noise(i * 500) * 1.2)
  }
  mainGraphics.translate(width * 0.42, height * 0.78);


  noise(seed)
  mainGraphics.rotate(PI);
  mainGraphics.stroke(255, 150);
  mainGraphics.ellipse(0, 0, 80, 20);
  let ratio = map(sin(PI / 2 + frameCount / 40), -1, 1, 0, 1)
  let currentLevel = int(ratio * 11)
  if (currentLevel != lastLevel) {

    synth.set({
      detune: 0
    });
    synth.triggerAttackRelease(chordList[features.useNotes].slice(0, int(currentLevel / 1.25)), 0.1);
    lastLevel = currentLevel
  }
  drawTri(currentLevel);

  mainGraphics.pop()

  webGLGraphics.push()
  // webGLGraphics.scale(DIM/DEFAULT_SIZE)
  webGLGraphics.clear(0, 0, width, height)
  webGLGraphics.background(0)
  webGLGraphics.shader(theShader)
  theShader.setUniform('u_resolution', [width / 1000, height / 1000])
  theShader.setUniform('u_time', millis() / 1000)
  theShader.setUniform('u_mouse', [mouseX / width, mouseY / height])
  theShader.setUniform('u_tex', mainGraphics)
  // rotateY(frameCount/100)
  webGLGraphics.rect(-width / 2, -height / 2, width, height)
  webGLGraphics.pop()


  push()
  scale(DIM / DEFAULT_SIZE);
  image(webGLGraphics, 0, 0, width, height)

  stroke(255)
  beginShape()
  noFill()
  translate(width / 500, 0)
  scale(0.9)
  rotate(0.05)
  for (let i = 0; i < signPoints.length; i++) {
    if (i < frameCount % (signPoints.length * 50)) {
      let p = signPoints[i]
      curveVertex(p[0], p[1])
    }
  }
  strokeWeight(2.5)
  endShape()
  pop()
  // ellipse(mouseX, mouseY, 20, 20);
}