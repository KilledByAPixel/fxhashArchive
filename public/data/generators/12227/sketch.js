let w = 2000;
let lineamnt, lineamnt2;
let linelength;
let oldlinelength;
let topdist, topdist2;
let xlength;
let x, y, x1, y1, x2, y2, x3, y3, x4, y4;
let newy, oldy;
let xdist, xdist2, xdist3, xdist4;
let xscale;
let ydist;
let op1, op2;
let oldx1, oldx2, oldx4, newx1, newx2, newx4;
let tx1, tx2;
let shadowvar,
  flowervar,
  grassvar,
  doorvar,
  patternsvar,
  pattern2var,
  bgnoisevar,
  colorsvar,
  vinesvar,
  vineshadowvar,
  plantvar;
let so, so2;
let haswindows,
  hasdoor,
  hasshadow,
  hassketchlines,
  hasflower,
  hasgrass,
  beginbuilding,
  hasgrounditems,
  hasnoise,
  hasgradient,
  isgiant,
  issmall,
  scextreme,
  hasflowers,
  hasvines,
  towerheight,
  leavesshape,
  noleaves,
  hasplant;
let grassArray = [];
let grass2Array = [];
let flowerArray = [];
let flower2Array = [];
let fillcolorbg,
  fillcolorbg2,
  fillcolorblockleft,
  fillcolorblockright,
  fillcolorpattern,
  fillcolorpattern2,
  fillcolorgrass,
  fillcolorplant,
  fillcolorflower,
  fillcolorflower2,
  strokecolorshadows,
  strokecolor,
  dotscolorstroke,
  dotscolor,
  r,
  g,
  b,
  r2,
  g2,
  b2;
let sc, scoptions, scoffset;
let scgrass = 1;
let patchgrass;
let loops = 0;
function setup() {
  let seed = floor(999999 * fxrand());
  randomSeed(seed);
  noiseSeed(seed);
  let tempcan = createCanvas(w, w * 1.3);
  tempcan.parent("fullscreen");
  pixelDensity(1);
  hasgradient = random(1);
  colorsvar = new Colors();
  colorsvar.choose();

  strokecolor = color(r, g, b);
  background(fillcolorbg);
  if (hasgradient > 0.3) {
    for (var y = 0; y < height; y++) {
      m = map(y, 0, height / 2, 0, 1);
      var gradientboth = lerpColor(fillcolorbg, fillcolorbg2, m);
      stroke(gradientboth);
      line(0, y, height, y);
    }
  }
  hasnoise = random(1);
  if (hasnoise > 0.25) {
    bgnoisevar = new BGnoise();
    bgnoisevar.draw();
  }
  pattern2var = new Pattern2();
  pattern2var.draw();
  patternsvar = new Patterns();
  patternsvar.draw();
  strokeWeight(1);
  stroke(strokecolor);
  towerheight = random(100, 350);
  hasflowers = random(1);
  hasgrounditems = random(1);

  hassketchlines = random(1);
  haswindows = random(1);
  patchgrass = random(1);
  hasvines = random(1);
  hasplant = random(1);
  scextreme = random(1);
  scoptions = [1.25];
  // scoptions = [1];
  sc = random(1, 1.85);
  if (scextreme > 0.98) {
    sc = 0.5;
  }
  scoffset = 135;
  so = random(20, 30);
  so2 = random(-10, 10);
  op1 = 125;
  isgiant = 0;
  issmall = random(1);
  linelength = random(55, 275);
  xlength = random(250, 600);
  if (isgiant > 0.99) {
    linelength = height / sc / 3;
    xlength = xlength * 1.4;
  }
  if (issmall > 0.98) {
    linelength = height / sc / 20;
    xlength = xlength * 1.3;
  }
  lineamnt = xlength / 10;
  lineamnt2 = lineamnt * 0.25;

  xscale = random(500, 1000);
  x1 = width / 3 + random(-50, 50);

  y1 = height - 400;
  if (sc >= 1) {
    x1 = width / sc / 4;
    y1 = height / sc - random(75, 300);
    scoffset = 135 / 2;
  }
  if (sc < 1) {
    x1 = width / sc / 2.3;
    y1 = height / sc - random(200, 1000);
    scoffset = 135 / 2;
  }
  x2 = x1 + xlength;
  y2 = y1;

  x3 = x2;
  x4 = x3 + xlength / 2;

  xdist = dist(x1, y1, x2, y2);
  xdist2 = xdist / 3;

  xdist3 = dist(x3, y1, x4, y2);
  xdist4 = xdist3 / 3;

  shadowvar = new Shadow(so, so2);
  doorvar = new Doors();
  vinesvar = new Vine();
  vineshadowvar = new Vineshadow();
  plantvar = new Plant();

  for (let i = 0; i < 4; i++) {
    let x = random(x1, x4);
    let y = height * 2;
    flower2Array[i] = new Flower2(x, y);
  }

  if (hasgrounditems > 0.5) {
    grasslocy = y1 - 100;

    for (let i = 0; i < 255; i++) {
      let x = random(0, width);
      let y = height * 2;
      grassArray[i] = new Grass(x, y);
    }
    for (let i = 0; i < 170; i++) {
      let x = random(x1, x4);
      let y = height * 2;
      grass2Array[i] = new Grass2(x, y);
    }
    for (let i = 0; i < 2; i++) {
      let x = random(x1, x4);
      let y = height * 2;
      flowerArray[i] = new Flower(x, y);
    }
    if (sc < 1) {
      for (let i = 0; i < 255; i++) {
        let x = random(0, width);
        let y = height * 2;
        grassArray[i] = new Grass(x, y);
      }
      for (let i = 0; i < 320; i++) {
        let x = random(x1, x4);
        let y = height * 2;
        grass2Array[i] = new Grass2(x, y);
      }
      for (let i = 0; i < 2; i++) {
        let x = random(x1, x4);
        let y = height * 2;
        flowerArray[i] = new Flower(x, y);
      }
    }
  } else {
    grasslocy = y1;
    x1 = width / 3 + random(-50, 50);
    y1 = height - 150;
    if (sc >= 1) {
      x1 = width / sc / 4;
      y1 = height / sc - 60 / sc;
      scoffset = 135 / 2;
    }
    if (sc < 1) {
      x1 = width / sc / 2.3;
      y1 = height / sc - 60 / sc;
      scoffset = 135 / 2;
    }
    x2 = x1 + xlength;
    y2 = y1;

    x3 = x2;
    x4 = x3 + xlength / 2;

    xdist = dist(x1, y1, x2, y2);
    xdist2 = xdist / 3;

    xdist3 = dist(x3, y1, x4, y2);
    xdist4 = xdist3 / 3;

    for (let i = 0; i < 0; i++) {
      let x = random(0, width);
      let y = height * 2;
      grassArray[i] = new Grass(x, y);
    }
    for (let i = 0; i < 170; i++) {
      let x = random(x1 - 100, x4 + 100);
      let y = y1;
      grass2Array[i] = new Grass2(x, y);
    }
  }
  if (hasgrounditems <= 0.5) {
    for (let i = 0; i < 30; i++) {
      let x = random(x1 - 100, x4 + 100);
      let y = y1;
      flower2Array[i] = new Flower2(x, y);
    }
  }
  beginbuilding = 0;
  if (hasgrounditems < 0.5) {
    grasslocy = height / sc + 50;
  }
  push();
}

function draw() {
  scale(sc, sc);
  strokeWeight(4);
  so2 = random(-10, 10);
  so = random(20, 30);
  if (beginbuilding < 1) {
    if (sc >= 1) {
      for (let i = 0; i < flowerArray.length; i++) flowerArray[i].spawn();
      for (let i = 0; i < flowerArray.length; i++) {
        let x = random(0, width);
        let y = grasslocy;
        flowerArray[i] = new Flower(x, y);
      }

      for (let i = 0; i < grassArray.length; i++) grassArray[i].spawn();
      for (let i = 0; i < grassArray.length; i++) {
        let x = random(0, width);
        let y = grasslocy;
        grassArray[i] = new Grass(x, y);
      }
      plantvar.draw();
    }
    if (sc < 1) {
      for (let i = 0; i < flowerArray.length; i++) flowerArray[i].spawn();
      for (let i = 0; i < flowerArray.length; i++) {
        let x = random(0, width * 2);
        let y = grasslocy;
        flowerArray[i] = new Flower(x, y);
      }

      for (let i = 0; i < grassArray.length; i++) grassArray[i].spawn();
      for (let i = 0; i < grassArray.length; i++) {
        let x = random(0, width * 2);
        let y = grasslocy;
        grassArray[i] = new Grass(x, y);
      }
      plantvar.draw();
    }
    grasslocy = grasslocy + 7 + scgrass * 2;

    if (grasslocy > y1) {
      beginbuilding = 1;
    }
  } else {
    if (beginbuilding == 1) {
      if (sc >= 1) {
        for (let i = 0; i < flowerArray.length; i++) flowerArray[i].spawn();
        for (let i = 0; i < flowerArray.length; i++) {
          let x = random(0, width);
          let y = grasslocy;
          flowerArray[i] = new Flower(x, y);
        }

        for (let i = 0; i < grassArray.length; i++) grassArray[i].spawn();
        for (let i = 0; i < grassArray.length; i++) {
          let x = random(0, width);
          let y = grasslocy;
          grassArray[i] = new Grass(x, y);
        }
        plantvar.draw();
      }
      if (sc < 1) {
        for (let i = 0; i < flowerArray.length; i++) flowerArray[i].spawn();
        for (let i = 0; i < flowerArray.length; i++) {
          let x = random(0, width * 2);
          let y = grasslocy;
          flowerArray[i] = new Flower(x, y);
        }

        for (let i = 0; i < grassArray.length; i++) grassArray[i].spawn();
        for (let i = 0; i < grassArray.length; i++) {
          let x = random(0, width * 2);
          let y = grasslocy;
          grassArray[i] = new Grass(x, y);
        }
        plantvar.draw();
      }

      grasslocy = grasslocy + 7 + scgrass * 2;

      if (grasslocy > height / sc + 50) {
        beginbuilding = 2;
      }
    }
    if (y1 >= towerheight) {
      strokeWeight(0);
      fill(fillcolorblockleft);
      rect(x1, y1 - linelength, dist(x1, y1, x4, y1), linelength);
      fill(fillcolorblockright);
      rect(x2, y1 - linelength, dist(x2, y1, x4, y1), linelength);
      strokeWeight(4);
      for (i = 0; i <= lineamnt; i++) {
        stroke(strokecolor);
        t = i / lineamnt;
        x = bezierPoint(x1, x1 + xdist2, x2 - xdist2, x2, t);
        y = bezierPoint(y1, y1, y2, y2, t);
        ydist = dist(x, y, x, y - linelength / 20);
        op1 = 255;
        nxoffset = random(1.5);
        line(x, y + random(-5, 3), x, y - ydist);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist, x + nxoffset, y - ydist * 2);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 2, x + nxoffset, y - ydist * 3);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 3, x + nxoffset, y - ydist * 4);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 4, x + nxoffset, y - ydist * 5);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 5, x + nxoffset, y - ydist * 6);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 6, x + nxoffset, y - ydist * 7);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 7, x + nxoffset, y - ydist * 8);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 8, x + nxoffset, y - ydist * 9);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 9, x + nxoffset, y - ydist * 10);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 10, x + nxoffset, y - ydist * 11);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 11, x + nxoffset, y - ydist * 12);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 12, x + nxoffset, y - ydist * 13);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 13, x + nxoffset, y - ydist * 14);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 14, x + nxoffset, y - ydist * 15);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 15, x + nxoffset, y - ydist * 16);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 16, x + nxoffset, y - ydist * 17);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 17, x + nxoffset, y - ydist * 18);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 18, x + nxoffset, y - ydist * 19);
        stroke(r, g, b, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x, y - ydist * 19, x, y - ydist * 20 + random(-3, 5));
      }

      if (haswindows > 0.5) {
        let windowsamnt = int(random(1, 4.99));
        for (i = 0; i <= windowsamnt; i++) {
          stroke(strokecolor);
          strokeWeight(3);
          s = random(30, 30);
          t = i / windowsamnt;
          x = bezierPoint(
            x1 + s,
            x1 + xdist2,
            x2 - s / 2.5 - xdist2,
            x2 - s,
            t
          );
          y = bezierPoint(y1, y1, y2, y2, t);
          fill(r, g, b, 200);
          ylinestart = random(y - s, y - linelength);
          line(x, ylinestart, x + s / 2, ylinestart);
          line(x, ylinestart + 5, x + s / 2, ylinestart + 5);
          line(x, ylinestart + 10, x + s / 2, ylinestart + 10);
          line(x, ylinestart + 15, x + s / 2, ylinestart + 15);
          line(x, ylinestart + 20, x + s / 2, ylinestart + 20);
          line(x, ylinestart + 25, x + s / 2, ylinestart + 25);
          line(x, ylinestart + 30, x + s / 2, ylinestart + 30);
        }
      }

      for (i = 0; i <= lineamnt2; i++) {
        stroke(r2, g2, b2);
        t = i / lineamnt2;
        x = bezierPoint(x3, x3 + xdist4, x4 - xdist4, x4, t);
        y = bezierPoint(y1, y1, y2, y2, t);
        ydist = dist(x, y, x, y - linelength / 20);
        op1 = 255;
        line(x, y + random(-5, 3), x, y - ydist);
        op1 = 0;
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        stroke(r2, g2, b2, random(op1, 255));
        line(x + nxoffset, y - ydist, x + nxoffset, y - ydist * 2);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 2, x + nxoffset, y - ydist * 3);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 3, x + nxoffset, y - ydist * 4);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 4, x + nxoffset, y - ydist * 5);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 5, x + nxoffset, y - ydist * 6);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 6, x + nxoffset, y - ydist * 7);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 7, x + nxoffset, y - ydist * 8);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 8, x + nxoffset, y - ydist * 9);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 9, x + nxoffset, y - ydist * 10);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 10, x + nxoffset, y - ydist * 11);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 11, x + nxoffset, y - ydist * 12);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 12, x + nxoffset, y - ydist * 13);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 13, x + nxoffset, y - ydist * 14);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 14, x + nxoffset, y - ydist * 15);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 15, x + nxoffset, y - ydist * 16);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 16, x + nxoffset, y - ydist * 17);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 17, x + nxoffset, y - ydist * 18);
        stroke(r2, g2, b2, random(op1, 255));
        strokeWeight(random(2, 4));
        nxoffset = random(1.5);
        line(x + nxoffset, y - ydist * 18, x + nxoffset, y - ydist * 19);

        op1 = 255;
        stroke(r2, g2, b2, random(op1, 255));
        line(x, y - ydist * 19, x, y - ydist * 20 + random(-3, 5));
      }
      if (hassketchlines > 0.6) {
        strokeWeight(random(0, 1));
        stroke(r, g, b, random(255));
        line(
          0 + random(50, 150),
          y - linelength,
          width - random(50, 150),
          y - linelength
        );
        line(x1, height - random(50), x1, 0 + random(50));
        line(x4, height - random(50), x4, 0 + random(50));
        stroke(strokecolor);
      }
      hasshadow = random(1);
      if (hasshadow > 0.45) {
        shadowvar.draw();
      }
      hasdoor = random(1);
      if (hasdoor > 0.5 && x4 < oldx4) {
        doorvar.draw();
      }
      if (hasshadow <= 0.45) {
        for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
        for (let i = 0; i < topdist / 22; i++) {
          let middledist = dist(oldx1, y1, oldx2, y1);
          let mdist2 = middledist / 5;
          let x = random(oldx1 + mdist2 * 2, oldx2 - mdist2 * 1);
          let y = oldy - oldlinelength;
          grass2Array[i] = new Grass2(x, y);
        }
        if (hasflowers > 0.5) {
          for (let i = 0; i < 1; i++) flower2Array[i].spawn();
          for (let i = 0; i < topdist / 22; i++) {
            let middledist = dist(oldx1, y1, oldx2, y1);
            let mdist2 = middledist / 5;
            let x = random(oldx1 + mdist2 * 2, oldx2 - mdist2 * 1);
            let y = oldy - oldlinelength;
            flower2Array[i] = new Flower2(x, y);
          }
        }
      }
      if (hasvines > 0.5) {
        vineshadowvar.draw();
      }
      if (hasvines > 0.5) {
        vinesvar.draw();
      }
      if (loops > 0) {
        topdist = dist(x4, y1, oldx4, y1);
        topdist2 = dist(x1, y1, oldx1, y1);
      }
      if (patchgrass < 0.4) {
        if (x4 < oldx4) {
          for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
          for (let i = 0; i < topdist / 8; i++) {
            let x = random(x3, oldx4 - 10);
            let y = oldy - oldlinelength;
            grass2Array[i] = new Grass2(x, y);
          }
        }
        if (hasflowers > 0.5) {
          if (x4 < oldx4) {
            for (let i = 0; i < 4; i++) flower2Array[i].spawn();
            for (let i = 0; i < topdist / 8; i++) {
              let x = random(x3, oldx4 - 10);
              let y = oldy - oldlinelength;
              flower2Array[i] = new Flower2(x, y);
            }
          }
        }
        if (x1 > oldx1) {
          for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
          for (let i = 0; i < topdist2 / 8; i++) {
            let x = random(oldx1, x1);
            let y = oldy - oldlinelength;
            grass2Array[i] = new Grass2(x, y);
          }
        }
        if (hasflowers > 0.5) {
          if (x1 > oldx1) {
            for (let i = 0; i < 2; i++) flower2Array[i].spawn();
            for (let i = 0; i < topdist2 / 8; i++) {
              let x = random(oldx1, x1);
              let y = oldy - oldlinelength;
              flower2Array[i] = new Flower2(x, y);
            }
          }
        }
      }

      if (patchgrass >= 0.4) {
        if (x4 < oldx4) {
          for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
          for (let i = 0; i < topdist / 22; i++) {
            let rightsidedist = dist(x4, y1, oldx4, y1);
            let rsdist2 = rightsidedist / 5;
            let x = random(x4 + rsdist2, x4 + rsdist2 * 1.5);
            let y = oldy - oldlinelength;
            grass2Array[i] = new Grass2(x, y);
          }
        }
        if (hasflowers > 0.5) {
          if (x4 < oldx4) {
            for (let i = 0; i < int(random(0, 1.99)); i++)
              flower2Array[i].spawn();
            for (let i = 0; i < topdist / 22; i++) {
              let rightsidedist = dist(x4, y1, oldx4, y1);
              let rsdist2 = rightsidedist / 5;
              let x = random(x4 + rsdist2, x4 + rsdist2 * 1.2);
              let y = oldy - oldlinelength;
              flower2Array[i] = new Flower2(x, y);
            }
          }
        }
        if (x4 < oldx4) {
          for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
          for (let i = 0; i < topdist / 22; i++) {
            let rightsidedist = dist(x4, y1, oldx4, y1);
            let rsdist2 = rightsidedist / 5;
            let x = random(x4 + rsdist2 * 3, oldx4 - rsdist2);
            let y = oldy - oldlinelength;
            grass2Array[i] = new Grass2(x, y);
          }
        }
        if (hasflowers > 0.5) {
          if (x4 < oldx4) {
            for (let i = 0; i < int(random(0, 1.99)); i++)
              flower2Array[i].spawn();
            for (let i = 0; i < topdist / 22; i++) {
              let rightsidedist = dist(x4, y1, oldx4, y1);
              let rsdist2 = rightsidedist / 5;
              let x = random(x4 + rsdist2 * 3, oldx4 - rsdist2);
              let y = oldy - oldlinelength;
              flower2Array[i] = new Flower2(x, y);
            }
          }
        }
        if (x1 > oldx1) {
          for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
          for (let i = 0; i < topdist2 / 22; i++) {
            let leftsidedist = dist(x1, y1, oldx1, y1);
            let lsdist2 = leftsidedist / 5;
            let x = random(oldx1 + lsdist2, oldx1 + lsdist2 * 1.5);
            let y = oldy - oldlinelength;
            grass2Array[i] = new Grass2(x, y);
          }
        }
        if (hasflowers > 0.5) {
          if (x1 > oldx1) {
            for (let i = 0; i < int(random(0, 1.99)); i++)
              flower2Array[i].spawn();
            for (let i = 0; i < topdist2 / 22; i++) {
              let leftsidedist = dist(x1, y1, oldx1, y1);
              let lsdist2 = leftsidedist / 5;
              let x = random(oldx1 + lsdist2, oldx1 + lsdist2 * 1.5);
              let y = oldy - oldlinelength;
              flower2Array[i] = new Flower2(x, y);
            }
          }
        }
        if (x1 > oldx1) {
          for (let i = 0; i < grass2Array.length; i++) grass2Array[i].spawn();
          for (let i = 0; i < topdist2 / 22; i++) {
            let leftsidedist = dist(x1, y1, oldx1, y1);
            let lsdist2 = leftsidedist / 5;
            let x = random(oldx1 + lsdist2 * 3, x1 - lsdist2);
            let y = oldy - oldlinelength;
            grass2Array[i] = new Grass2(x, y);
          }
        }
        if (hasflowers > 0.5) {
          if (x1 > oldx1) {
            for (let i = 0; i < int(random(0, 1.99)); i++)
              flower2Array[i].spawn();
            for (let i = 0; i < topdist2 / 22; i++) {
              let leftsidedist = dist(x1, y1, oldx1, y1);
              let lsdist2 = leftsidedist / 5;
              let x = random(oldx1 + lsdist2 * 3, x1 - lsdist2);
              let y = oldy - oldlinelength;
              flower2Array[i] = new Flower2(x, y);
            }
          }
        }
      }

      newy = y - linelength;
      oldy = y;
      oldlinelength = linelength;
      noFill();
      oldx1 = x1;
      oldx2 = x2;
      oldx4 = x4;
      loops = loops + 1;
      strokeWeight(5);
      op1 = 125;
      linelength = random(65, 275);
      xlength = random(250, 600);
      if (isgiant > 0.99) {
        linelength = height / sc / 3;
        xlength = xlength * 1.7;
      }
      if (issmall > 0.98) {
        linelength = height / sc / 20;
        xlength = xlength * 1.3;
      }
      lineamnt = xlength / 10.5;
      lineamnt2 = lineamnt * 0.25;

      xscale = random(500, 1000);
      x1 = x1 + random(-175, 175);
      if (x1 < 100 / sc) {
        x1 = x1 + 175;
      }
      y1 = newy;
      x2 = x1 + xlength;
      if (x2 + xlength / 2 > width / sc - 100) {
        x1 = x1 - 175;
        x2 = x1 + xlength;
      }
      y2 = y1;
      x3 = x2;
      x4 = x3 + xlength / 2;
      xdist = dist(x1, y1, x2, y2);
      xdist2 = xdist / 3;
      xdist3 = dist(x3, y1, x4, y2);
      xdist4 = xdist3 / 3;
      newx1 = x1 + scoffset;
      newx4 = x4 - scoffset;
      newy1 = y1;
    }
    if (y1 < towerheight && grasslocy >= height / sc + 50) {
      noLoop();
      pop();
      noFill();
      stroke(fillcolorbg);
      strokeWeight(70);
      rect(0, 0, width, height);
      stroke(strokecolor);
      strokeWeight(1);
      rect(35, 35, width - 70, height - 70);
      loadPixels();
      for (g = 0; g < height; g++) {
        for (f = 0; f < width; f++) {
          var rgbs = (f + g * width) * 4;
          pixels[rgbs + 0] = pixels[rgbs + 0] - random(40);
          pixels[rgbs + 1] = pixels[rgbs + 1] - random(40);
          pixels[rgbs + 2] = pixels[rgbs + 2] - random(40);
          pixels[rgbs + 3] = pixels[rgbs + 3] - random(30);
        }
      }
      updatePixels();
      fxpreview();
    }
  }
}
