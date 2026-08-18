console.log(fxhash)   // the 64 chars hex number fed to your algorithm

/**
 * CENTURY-XXX-METAMOLNAR(S)
 * 
 * 2 of 5 in CENTURY-XXX, Series 1
 * Edition of 1000
 * 
 * Casey Reas
 * 2021
 * 
 * Copyright 2021, all rights reserved
 */

let c;
let delay = 250;
let lastTime = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity();
  c = new Molnar();
  lastTime = millis();
}

function draw() {
  if (millis() > lastTime + delay) {
    c.update();
    lastTime = millis();
  }
  c.display();
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  c.config();
}

class Molnar {

  constructor() {
    this.units = [];
    this.unitDimension;
    this.unitCounter = 0;
    this.maxDivisor = 18;
    this.randomWeight = map(fxrand(), 0, 1, 0.05, 0.95);
    console.log(this.randomWeight);
    this.config();
    this.numUnits = (this.maxDivisor+3)*(this.maxDivisor+3);
    this.divisor = int(map(fxrand(), 0, 1, 2, 7)) * 3;
    for (let i = 0; i < this.numUnits; i++) {
      this.units[i] = new MolnarUnit();
    }
    this.compose();
  }
    
  config() {
    if (width > height) {
      this.unitDimension = width/this.maxDivisor;
    } else {
      this.unitDimension = height/this.maxDivisor;
    }
    if (width > height) {
      this.unitDimension = width/this.divisor;
    } else {
      this.unitDimension = height/this.divisor;
    }
  }

  compose() {
    this.config();
    for (let i = 0; i < this.units.length; i++) {
      this.units[i].composeUnit(this.randomWeight);
    }
  }
  
  update() {
    this.units[this.unitCounter].updateUnit();
    this.unitCounter++;
    if (this.unitCounter >= this.units.length) {
      this.unitCounter = 0; 
    }
  }

  display() {
    background(246);
    let index = 0;
    for (let y = -this.unitDimension/4; y <= height+this.unitDimension/2; y += this.unitDimension) {
      for (let x = -this.unitDimension/4; x <= width+this.unitDimension/2; x += this.unitDimension) {
        this.units[index].displayUnit(x, y, this.unitDimension);
        index++;
      }
    }
  }
}

class MolnarUnit {

  constructor() {
    this.rotateMe = false;
    this.randomOffset = 0.0;
    this.composeUnit();
  }

  composeUnit(randomWeight) {
    if (fxrand() > randomWeight) {
      this.rotateMe = true;
    }
    this.randomOffset = map(fxrand(), 0, 1, -0.1, 0.1);
  }

  updateUnit() {
    this.rotateMe = !this.rotateMe;
  }

  displayUnit(x, y, unit) {
    fill(0);
    noStroke();
    push();
    translate(x, y);
    scale(unit);
    if (this.rotateMe) {
      rotate(HALF_PI);
    }
    let ra = 0.2;
    rotate(this.randomOffset);
    triangle(-0.5, -0.5, -0.5, -ra, -ra, -0.5);
    triangle(0.5, 0.5, ra, 0.5, 0.5, ra);
    beginShape();
    vertex(-0.5, 0.5);
    vertex(-ra, 0.5);
    vertex(0.5, -ra);
    vertex(0.5, -0.5);
    vertex(ra, -0.5);
    vertex(-0.5, ra);
    endShape();
    pop();
  }
}
