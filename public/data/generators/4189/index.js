console.log(fxhash)   // the 64 chars hex number fed to your algorithm

/**
 * CENTURY-XXX-METAMETAMALEVICH
 * 1 of 5 in CENTURY-XXX, Series 1
 * Edition of 1000
 * 
 * Casey Reas
 * 2021
 * 
 * Copyright 2021, all rights reserved
 */

let c;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity();
  c = new MetaMetaMalevich();
}

function draw() {
  c.display();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

class MetaMetaMalevich {

  constructor () {
    this.lines = [];
    this.angleOffset = 0.0;
    for (let i = 0; i < 9; i++) {
      this.lines[i] = new Line();
    }
  }

  compose() {
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].compose();
    }
  }

  display() {
    background(246);
    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].update();
      this.lines[i].display();
    }
  }
}

class Line {

  constructor() {
    this.x = map(fxrand(), 0, 1.0, 0.1, 0.9);
    console.log(this.x);
    this.y = map(fxrand(), 0, 1.0, 0.1, 0.9);
    this.angle = map(fxrand(), 0, 1.0, 0.0, TWO_PI);
    this.captureAngle = 0;
    this.d = dist(0, 0, width, height);
    this.length = map(fxrand(), 0, 1.0, this.d*0.05, this.d*0.7);
    this.weight = map(this.length, this.d*0.05, this.d*0.7, this.d/200, this.d/30);
    this.pivot = map(fxrand(), 0, 1.0, -this.length/2, this.length/2);
    this.colorVal = color(176, 0, 0);
    this.speed = map(fxrand(), 0, 1.0, 0.0001, 0.002);
  }

  update() {
    this.angle += this.speed;
  }

  display() {
    this.xx = map(this.x, 0, 1.0, 0, width);
    this.yy = map(this.y, 0, 1.0, 0, height);
    strokeWeight(this.weight);
    stroke(this.colorVal);
    strokeCap(SQUARE);
    push();
    translate(this.xx, this.yy);
    rotate(this.angle);
    line(-this.length/2 + this.pivot, 0, this.length/2 + this.pivot, 0);
    pop();
  }
}