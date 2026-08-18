// CENTURY-XXX-METAFRANKE

let r;
let usize = 0;
let unum = 0;
let rez = 0; //64; //32; //64; //128;
let range = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  defineRez();
  r = new Raster();
  noSmooth();
  background(102);
  noCursor();
  for (let i = 0; i < 100000; i++) {
    r.scan();
  }
}

let numTemp = 0;

function draw() {
  r.scan();
}

function newColorSet() {
  let rr = fxrand();
  if (rr > 0.95) {
    // Gray
    range = 100;
  } else if (rr > 0.85) {
    // Spectrum
    range = 0;
  } else if (rr > 0.75) {
    // XtraLight
    range = 4;
  } else {
    // Light
    range = 3;
  }
}

function defineRez() {
  let rr = fxrand();
  if (rr > 0.95) {
    rez = 128;
  } else if (rr > 0.8) {
    rez = 32;
  } else {
    rez = 64;
  }
  usize = width / rez; // Unit size
  unum = width / usize; // Unit number
}

function newColor() {
  let r, g, b;
  if (range == 100) {
    let gray = int(fxrand() * 6) * 51;
    r = gray;
    g = gray;
    b = gray;
  } else {
    r = int(range + fxrand()*(6-range)) * 51;
    g = int(range + fxrand()*(6-range)) * 51;
    b = int(range + fxrand()*(6-range)) * 51;
    if (fxrand() > 0.95) {
      if (range == 4) {
        r = 153;
        g = 153;
        b = 153;
      }
      if (range == 3) {
        r = 102;
        g = 102;
        b = 102;
      }
    }
  }
  return color(r, g, b);
}

class Raster {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.xmin = 0;
    this.xmax = 0;
    this.ymin = 0;
    this.ymax = 0;
    this.c = 0;
    this.counter = 0;
    this.repeat = 0;

    this.type = 0;
    this.THIN_H = 0;
    this.THIN_V = 1;
    this.THICK_H = 2;

    newColorSet();
    this.next();
  }

  // Outer "loop"
  next() {
    let rr = fxrand();
    if (rr > 0.9) {
      this.type = this.THIN_H;
      this.xmin = 0;
      this.xmax = width;
    } else if (rr > 0.8) {
      this.type = this.THIN_V;
      this.xmin = int(fxrand()*unum) * usize;
      //this.xmax = this.xmin + int(random(1, unum / 20)) * usize;
      this.xmax = this.xmin + 1 + int(fxrand()*unum/20) * usize;
    } else {
      this.type = this.THICK_H;
      this.xmin = int(fxrand()*unum) * usize;
      this.xmax = this.xmin + 1 + int(fxrand()*unum/3) * usize;
    }
    this.x = this.xmin;
    if (this.xmax > width + usize) {
      this.xmax = width;
    }
    this.c = newColor();
    this.counter = 0;
    this.repeat = 3 + int(fxrand()*7);
    this.narxt();
  }

  // Inner "loop"
  narxt() {
    if (this.type == this.THIN_H) {
      this.ymin = int(fxrand() * unum) * usize;
      this.ymax = this.ymin + 1 + int(fxrand()*unum/20) * usize;
    } else if (this.type == this.THIN_V) {
      this.ymin = 0;
      this.ymax = height;
      this.xmin = int(fxrand() * unum) * usize;
      this.xmax = this.xmin + 1 + int(fxrand()*unum/20) * usize;
      if (this.xmax > width + usize) {
        this.xmax = width;
      }
      this.x = this.xmin;
    } else {
      this.ymin = int(fxrand() * unum) * usize;
      this.ymax = this.ymin + 1 + int(fxrand()*unum/4) * usize;
    }
    this.y = this.ymin;
    this.c = newColor();
  }

  scan() {
    stroke(this.c);
    fill(this.c);
    rect(this.x, this.y, usize, usize);

    // Update position
    this.x += usize;
    if (this.x >= this.xmax) {
      this.x = this.xmin;
      //println(x);
      this.y += usize;
      if (this.y >= this.ymax) {
        this.narxt();
        this.counter++;
        if (this.counter >= this.repeat) {
          this.next();
        }
      }
    }
  }
}

function origin() {
  background(102);
  defineRez();
  newColorSet();
  r.next();
}

function keyPressed() {
  if (key == "c" || key == "C") {
    origin();
    for (let i = 0; i < 100000; i++) {
      r.scan();
    }
  }
}
