let w = 2000;
let loops = 0;
let loopY = 0;
let x = 0;
let y = 0;
let zoffset = 0;
let Yoffset = 0;
let background1var;
let plant1var;
let plant1Array = [];
let plant2var;
let plant2Array = [];
let plant3var;
let plant3Array = [];
let plant4var;
let plant4Array = [];
let plant5var;
let plant5Array = [];
let plant6var;
let plant6Array = [];
let tree1var;
let tree1Array = [];
let tree2var;
let tree2Array = [];
let bugsvar;
let bugsArray = [];
let op = 0.0;
let sc = 2;
let loadvar;
let stairsvar;
let xstairstart;
let xstairend;
let ystairoffset;
let Palette;
let canplant1, canplant2, canplant3, canplant4, canplant6, cantree, cantree2;
let bgstairs;
let reset;
let arraywidth;
let canvascolor;
let canvascolors = [];
let strokecolor;
///////////////////////////////////////////////////////////////////
function setup() {
  let seed = floor(999999 * fxrand());
  randomSeed(seed);
  let tempcan = createCanvas(w, w * 1.3, WEBGL);
  tempcan.parent("fullscreen");
  palette = int(random(1, 15.999));
  canvas1 = color(235, 236, 220);
  canvas2 = color(225, 236, 235);
  canvas3 = color(235, 230, 220);
  canvas4 = color(225, 236, 220);
  canvas5 = color(245, 246, 230);
  canvas6 = color(250, 251, 235);
  canvas7 = color(255, 255, 241);
  canvas8 = color(255, 255, 250);
  canvascolors = [
    canvas1,
    canvas1,
    canvas2,
    canvas3,
    canvas4,
    canvas5,
    canvas6,
    canvas7,
    canvas8,
  ];
  canvascolor = random(canvascolors);
  background(canvascolor);
  strokecolor = 20;
  background1var = new Background();
  background1var.spawn();
  bgstairs = random(1);
  canplant1 = random(1);
  if (canplant1 > 0.35) {
    amnt1 = int(random(1, 12));
  } else {
    amnt1 = 0;
  }
  canplant2 = random(1);
  if (canplant2 > 0.35) {
    amnt2 = int(random(1, 10));
  } else {
    amnt2 = 0;
  }
  canplant3 = random(1);
  if (canplant3 > 0.35) {
    amnt3 = int(random(1, 10));
  } else {
    amnt3 = 0;
  }
  canplant4 = random(1);
  if (canplant4 > 0.35) {
    amnt4 = int(random(1, 12));
  } else {
    amnt4 = 0;
  }
  canplant6 = random(1);
  if (canplant6 > 0.7) {
    amnt6 = int(random(1, 2));
  } else {
    amnt6 = 0;
  }
  cantree = random(1);
  if (cantree > 0.5) {
    amnt7 = int(random(0, 5));
  } else {
    amnt7 = 0;
  }
  cantree2 = random(1);
  if (cantree2 > 0.4) {
    amnt8 = int(random(1, 6));
  } else {
    amnt8 = 0;
  }
  amnt5 = int(random(200, 300)); //grass
  amnt9 = int(random(0, 3)); // bugs

  Yoffset = random(0, 600);

  if (Yoffset > 400) {
    op = 0.006;
  }
  if (Yoffset > 750) {
    op = 0.000651;
  }
  arraywidth = 2;
  if (bgstairs > 0.6) {
    fill(20);
    rect(-1000, 0 + 100, 2000, 2500);
    Yoffset = random(900, 1200);
    sc = 0.75;
    arraywidth = 1.5;
    amnt1 = amnt1 / 2;
    amnt2 = amnt2 / 2;
    amnt3 = amnt3 / 2;
    amnt4 = amnt4 / 2;
    amnt5 = amnt5 / 2;
    amnt6 = amnt6 / 2;
    amnt7 = amnt7 / 2;
    amnt8 = amnt8 / 2;
    amnt9 = amnt9 / 2;
  } else {
    fill(20);
    rect(-1000, -Yoffset * 2 + 100, 2000, 2500); //background rectangle
  }
  loadvar = new Preload();
  loadvar.load();
  stairsvar = new Stairs();

  fill(0);
  strokeWeight(1);
  angleMode(DEGREES);
  rectMode(CENTER);
  push();
} //////////////////////////////////////////////////////////////////CLOSE SETUP
function draw() {
  scale(sc, sc);
  loops = loops + 1;
  op = op + op;
  stairsvar.spawn();

  for (let i = 0; i < plant1Array.length; i++) plant1Array[i].spawn();

  for (let i = 0; i < amnt1; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    plant1Array[i] = new Plant(x, y, z, o);
  }
  for (let i = 0; i < plant2Array.length; i++) plant2Array[i].spawn();

  for (let i = 0; i < amnt2; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    plant2Array[i] = new Plant2(x, y, z, o);
  }
  for (let i = 0; i < plant3Array.length; i++) plant3Array[i].spawn();

  for (let i = 0; i < amnt3; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    plant3Array[i] = new Plant3(x, y, z, o);
  }
  for (let i = 0; i < plant4Array.length; i++) plant4Array[i].spawn();

  for (let i = 0; i < amnt4; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    plant4Array[i] = new Plant4(x, y, z, o);
  }

  for (let i = 0; i < plant5Array.length; i++) plant5Array[i].spawn();

  for (let i = 0; i < amnt5; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset + 25;
    let z = zoffset + random(1);
    let o = op;
    plant5Array[i] = new Plant5(x, y, z, o);
  }

  for (let i = 0; i < plant5Array.length; i++) plant5Array[i].spawn();

  for (let i = 0; i < amnt5; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    plant5Array[i] = new Plant5(x, y, z, o);
  }

  for (let i = 0; i < plant5Array.length; i++) plant5Array[i].spawn();

  for (let i = 0; i < amnt5; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset - 25;
    let z = zoffset + random(1);
    let o = op;
    plant5Array[i] = new Plant5(x, y, z, o);
  }

  for (let i = 0; i < tree1Array.length; i++) tree1Array[i].spawn();

  for (let i = 0; i < amnt7; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    tree1Array[i] = new Tree(x, y, z, o);
  }

  for (let i = 0; i < tree2Array.length; i++) tree2Array[i].spawn();

  for (let i = 0; i < amnt8; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    tree2Array[i] = new Tree2(x, y, z, o);
  }
  for (let i = 0; i < plant6Array.length; i++) plant6Array[i].spawn();

  for (let i = 0; i < amnt6; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    plant6Array[i] = new Plant6(x, y, z, o);
  }

  for (let i = 0; i < bugsArray.length; i++) bugsArray[i].spawn();

  for (let i = 0; i < amnt9; i++) {
    let x = random(-width / arraywidth, width / arraywidth);
    let y = ystairoffset;
    let z = zoffset + random(1);
    let o = op;
    bugsArray[i] = new Bugs(x, y, z, o);
  }

  if (ystairoffset > height / 2.3 && bgstairs < 0.6) {
    pop();
    scale(1, 1);
    noLoop();
    stroke(canvascolor);
    strokeWeight(100);
    noFill();
    rect(0, 0, width, height);
    stroke(20);
    strokeWeight(1);
    rect(0,0,width-100,height-100);
    fxpreview();
  }
  if (ystairoffset > height / 6 && bgstairs > 0.6) {
    fill(0, 0, 0, 6);
    rect(0, 0, width * 2, height * 2);
    Yoffset = random(0, 125);
    ystairoffset = -Yoffset;
    bgstairs = 0;
    sc = 2;
    reset = 1;
    arraywidth = 2;
    amnt1 = amnt1 * 2;
    amnt2 = amnt2 * 2;
    amnt3 = amnt3 * 2;
    amnt4 = amnt4 * 2;
    amnt5 = amnt5 * 2;
    amnt6 = amnt6 * 2;
    amnt7 = amnt7 * 2;
    amnt8 = amnt8 * 2;
    amnt9 = amnt9 * 2;
    op = 0.06;
  }
} /////////////////////////////////////////////////////////////////CLOSE DRAW
