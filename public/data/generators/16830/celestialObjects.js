class CelestialObjects {
  constructor(steps) {

    this.steps = steps;

    this.up = true;
    this.timesCounter = 0;
    this.timesCounterSky = 0;
    this.ceiling = 30;
    this.inc = 0;

    this.x = 0;
    this.y = 0;
    this.xx = 0;

    this.noiseScale = 0.02;
    this.noiseVal = 900;
    this.pathNoise = this.modificator;

    this.celestialObjPositionX = random(300, width-300);
    this.celestialObjPositionY = random(300, height*0.25);

    // this.radioSun = 100 * 2;
    this.radioSun = random(60, 100) * 2;
    this.speed = 0.5;
    this.sunAngle = 0;
    this.sunIncrementer = 0;
    
    this.xSun = 0;
    this.ySun = 0;
    this.noiseValSunSpiral = 0;
    this.noiseScaleSunSpiral = 0.06

    this.orbitAngle = -1.1
    
    this.plantAngleSelector = random([-30, -20, -10, 0, 10, 20, 30])
    this.plantHeightSelector = random([10, 20, 40, 60])
  }

  celestialBurning() {
    this.incrementals();

    this.sunAngle = QUARTER_PI / 3; 

    push();
    translate(this.celestialObjPositionX, this.celestialObjPositionY);
    noFill();
    // circle(0, 0, this.orbitRadio * 2);
    if (this.timesCounter < 10) {
      fill(colorBack04)
      circle(0, 0, this.radioSun * 2);
    }

    fill(colorBack);
    // strokeWeight(1);
    for (let i = 0; i < this.radioSun; i += 0.1) {
      if(this.timesCounter < 400) {
        this.noiseValSunSpiral = noise((this.sunIncrementer + this.xSun) * this.noiseScaleSunSpiral, this.sunIncrementer + this.ySun * this.noiseScaleSunSpiral);
        this.xSun = (cos(i+(this.inc*0.001)) * this.radioSun * this.noiseValSunSpiral * this.sunIncrementer) / 2 / 2;
        this.ySun = (sin(i+(this.inc*0.001)) * this.radioSun * this.noiseValSunSpiral * this.sunIncrementer) / 2 / 2;
        
        stroke(colorFront02);
        strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
        point(
          cos(this.orbitAngle) + this.radioSun * cos(this.sunAngle) - this.sunIncrementer + this.inc + this.xSun * Math.PI * pow(this.noiseValSunSpiral, 2), 
         sin(this.orbitAngle) + this.radioSun * sin(this.sunAngle) - this.sunIncrementer + this.inc + this.ySun * Math.PI * pow(this.noiseValSunSpiral, 2));


        strokeWeight(map(noise(this.inc), 0, 1, 2, 4))
        stroke(colorBack03)
         point(
          cos(this.orbitAngle) + this.radioSun * cos(this.sunAngle) - this.sunIncrementer + this.inc + this.xSun * Math.PI * this.noiseValSunSpiral, 
         sin(this.orbitAngle) + this.radioSun * sin(this.sunAngle) - this.sunIncrementer + this.inc + this.ySun * Math.PI * this.noiseValSunSpiral);

        this.sunAngle += 0.1;
        this.sunIncrementer = this.sunIncrementer + 0.00006 * this.speed;
        // ========== //
        this.timesCounter += 0.001
      } 
      if(this.timesCounter > 390) {
        celestialObjectIsDone = true
      }
    }
    pop();
  }

  celestialBurning2() {
    this.incrementals();

    this.sunAngle = QUARTER_PI / 3; 
    this.orbitRadio = width/2
    this.radioSun = 60 + seedSlice2 + this.inc * noise(this.inc) * cos(this.inc*0.5);
    // sunAngle = PI * (this.inc*random(0.001)); // flare direction

    push();
    translate(this.celestialObjPositionX, this.celestialObjPositionY);
    
    if (this.timesCounter < 10) {
      fill(colorBack04)
      circle(0, 0, this.radioSun * 2);
    }

    noFill();

    fill(colorBack);
    // strokeWeight(1);
    for (let i = 0; i < this.radioSun; i += 0.1) {
      if(this.timesCounter < 400) {
        this.noiseValSunSpiral = noise((this.sunIncrementer + this.xSun) * this.noiseScaleSunSpiral, this.sunIncrementer + this.ySun * this.noiseScaleSunSpiral);
        this.xSun = (cos(i+(this.inc*0.001)) * this.radioSun * this.noiseValSunSpiral * this.sunIncrementer) / 2 / 2;
        this.ySun = (sin(i+(this.inc*0.001)) * this.radioSun * this.noiseValSunSpiral * this.sunIncrementer) / 2 / 2;
        
        stroke(colorFront02);
        strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
        point(
          cos(this.orbitAngle) + this.radioSun * cos(this.sunAngle) - this.sunIncrementer + this.inc + this.xSun * Math.PI * pow(this.noiseValSunSpiral, 2), 
         sin(this.orbitAngle) + this.radioSun * sin(this.sunAngle) - this.sunIncrementer + this.inc + this.ySun * Math.PI * pow(this.noiseValSunSpiral, 2));


        strokeWeight(map(noise(this.inc), 0, 1, 2, 4))
        stroke(colorBack03)
         point(
          cos(this.orbitAngle) + this.radioSun * cos(this.sunAngle) - this.sunIncrementer + this.inc + this.xSun * Math.PI * this.noiseValSunSpiral, 
         sin(this.orbitAngle) + this.radioSun * sin(this.sunAngle) - this.sunIncrementer + this.inc + this.ySun * Math.PI * this.noiseValSunSpiral);

        this.sunAngle += 0.1;
        this.sunIncrementer = this.sunIncrementer + 0.00006 * this.speed;
        // ========== //
        this.timesCounter += 0.001
      }
      if(this.timesCounter > 390) {
        celestialObjectIsDone = true
      }
    }
    pop();
  }


  celestialEclipse() {
    this.incrementals();

    sunAngle = PI * (this.inc*random(0.001)); // flare direction
    orbitRadio = width / 2;
    push();
    translate(this.celestialObjPositionX, this.celestialObjPositionY);
    
    if (this.timesCounter < 10) {
      fill(colorBack04)
      circle(0, 0, this.radioSun * 2);
    }

    
    noFill();
    

    for (let i = 0; i < this.radioSun; i += 0.1) {
      if(this.timesCounter < 400) {
        this.noiseValSunSpiral = noise((this.sunIncrementer + this.xSun) * this.noiseScaleSunSpiral, this.sunIncrementer + this.ySun * this.noiseScaleSunSpiral);
        this.xSun = (cos(i+(this.inc*0.001)) * this.radioSun * this.noiseValSunSpiral * this.sunIncrementer) / 2 / 2;
        this.ySun = (sin(i+(this.inc*0.001)) * this.radioSun * this.noiseValSunSpiral * this.sunIncrementer) / 2 / 2;
        
        stroke(colorFront01);
        strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
        point(
          cos(this.orbitAngle) + this.radioSun * cos(sunAngle) - this.sunIncrementer + this.inc + this.xSun * Math.PI * pow(this.noiseValSunSpiral, 4), 
         sin(this.orbitAngle) + this.radioSun * sin(sunAngle) - this.sunIncrementer + this.inc + this.ySun * Math.PI * pow(this.noiseValSunSpiral, 4));


        strokeWeight(map(noise(this.inc), 0, 1, 2, 3))
        stroke(colorBack01)
         point(
          cos(this.orbitAngle) + this.radioSun * cos(sunAngle) - this.sunIncrementer + this.xSun * Math.PI * this.noiseValSunSpiral * random(random(random(random(random(seedSlice1))))), 
         sin(this.orbitAngle) + this.radioSun * sin(sunAngle) - this.sunIncrementer + this.ySun * Math.PI * this.noiseValSunSpiral * random(random(random(random(random(seedSlice1))))));

        sunAngle += 0.1;
        this.sunIncrementer = this.sunIncrementer + 0.00006 * this.speed;
        // ========== //
        this.timesCounter += 0.001
      }
      if(this.timesCounter > 390) {
        celestialObjectIsDone = true
      }
    }
    pop();
  }

  celestialFlare() {
    noFill();
    this.incrementals();
    // this.steps = map(seedSlice3, 100, 999, 400, 999);

    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;

      this.x = bezierPoint(width / 2 - 300 + this.noiseVal, width / 2 - 300 * this.noiseVal, width / 2 + 300 * this.noiseVal, width / 2 + 300 + this.noiseVal, t);
      this.y = bezierPoint(500, 900, 900, 500, t);

      // rock
      this.xx = bezierPoint(map(seedSlice3, 100, 999, 200, 470), map(seedSlice3, 100, 999, 300, 543) + this.inc * random(random(random(random()))), map(seedSlice3, 100, 999, 600, 819) + this.inc * random(random(random(random()))), map(seedSlice3, 100, 999, 800, 1104), t);

      this.tmx = bezierTangent(this.ptX1 + this.noiseVal * randomGaussian(), this.ptCtrlX1 + this.noiseScale * random(), this.ptCtrlX2 + this.noiseScale * random(), this.ptX2 + this.noiseVal * randomGaussian(), t);

      this.tmy = bezierTangent(this.ptY1 + this.noiseVal, this.ptCtrlY1 + this.noiseVal, this.ptCtrlY2 + this.noiseVal, this.ptY2 + this.noiseVal, t);
      // console.log(this.xx);
      this.noiseVal = noise((this.inc * seedSlice1 + this.xx) * this.noiseScale, this.xx * this.noiseScale);

      // ========== //
      let a = atan2(this.tmy * this.noise, this.tmx * this.noise);
      a -= HALF_PI;
      if (this.timesCounter < 350) {

        // MEDIO

        push();
        translate(this.celestialObjPositionX, this.celestialObjPositionY);

        this.px = cos(iSt) * map(seedSlice3, 100, 999, 200, 400) * pow(this.noiseVal, map(seedSlice2, 10, 99, 2, 5)) * map(this.noiseVal, 0, 1, 3, (this.inc*0.5));
        this.py = sin(iSt) * map(seedSlice3, 100, 999, 200, 400) * pow(this.noiseVal, map(seedSlice2, 10, 99, 2, 5)) * map(this.noiseVal, 0, 1, 3, (this.inc*0.5));
        
        stroke(colorFront01);
        strokeWeight(map(this.noiseVal, 0, 1, 2, 7));
        point(this.px, this.py);

        stroke(colorBack01);
        strokeWeight(map(this.noiseVal, 0, 1, 1, 3));
        point(this.px + (this.inc*2) * pow(this.noiseVal, 1.5), this.py + (this.inc*2) * pow(this.noiseVal, 1.5));
        

        pop();
      }
      if(this.timesCounter > 340) {
        celestialObjectIsDone = true
      }
      // ========== //
      this.timesCounter += 0.001;
      
    }
  }

  celestialSunVoid() {
    noFill();
    this.incrementals();

    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;

      this.x = bezierPoint(width / 2 - 300 + this.noiseVal, width / 2 - 300 * this.noiseVal, width / 2 + 300 * this.noiseVal, width / 2 + 300 + this.noiseVal, t);
      this.y = bezierPoint(500, 900, 900, 500, t);

      // rock
      this.xx = bezierPoint(map(seedSlice3, 100, 999, 200, 470), map(seedSlice3, 100, 999, 300, 543) + this.inc * random(random(random(random()))), map(seedSlice3, 100, 999, 600, 819) + this.inc * random(random(random(random()))), map(seedSlice3, 100, 999, 800, 1104), t);

      this.tmx = bezierTangent(this.ptX1 + this.noiseVal * randomGaussian(), this.ptCtrlX1 + this.noiseScale * random(), this.ptCtrlX2 + this.noiseScale * random(), this.ptX2 + this.noiseVal * randomGaussian(), t);

      this.tmy = bezierTangent(this.ptY1 + this.noiseVal, this.ptCtrlY1 + this.noiseVal, this.ptCtrlY2 + this.noiseVal, this.ptY2 + this.noiseVal, t);
      // console.log(this.xx);
      this.noiseVal = noise((this.inc * 4 + this.xx) * this.noiseScale, this.xx * this.noiseScale);

      // ========== //
      let a = atan2(this.tmy * this.noise, this.tmx * this.noise);
      a -= HALF_PI;
      if (this.timesCounter < 150) {

        // MEDIO

        push();
        translate(this.celestialObjPositionX, this.celestialObjPositionY);
        
        this.px = cos(iSt * pow(this.noiseVal, map(this.noiseVal, 0, 1, 3, 8))) * this.radioSun * pow(this.noiseVal, map(this.noiseVal, 0, 1, 3, 8)) * map(this.noiseVal, 0, 1, 3, (this.inc));
        this.py = sin(iSt * pow(this.noiseVal, map(this.noiseVal, 0, 1, 3, 8))) * this.radioSun * pow(this.noiseVal, map(this.noiseVal, 0, 1, 3, 8)) * map(this.noiseVal, 0, 1, 3, (this.inc));
        
        stroke(colorFront01);
        strokeWeight(map(this.noiseVal, 0, 1, 2, 7));
        point(this.px, this.py);
        
        stroke(colorBack01);
        strokeWeight(map(this.noiseVal, 0, 1, 1, 3));
        point(this.px + (this.inc*2) * pow(this.noiseVal, 1.5), this.py + (this.inc*2) * pow(this.noiseVal, 1.5));

        pop();
      }
      if(this.timesCounter > 140) {
        celestialObjectIsDone = true
      }
      // ========== //
      this.timesCounter += 0.001;
      // }
    }
  }

  celestialBlackHole() {
    noFill();

    this.incrementals();
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;

      this.x = bezierPoint(width / 2 - 300 + this.noiseVal, width / 2 - 300 * this.noiseVal, width / 2 + 300 * this.noiseVal, width / 2 + 300 + this.noiseVal, t);
      this.y = bezierPoint(500, 900, 900, 500, t);

      // rock
      this.xx = bezierPoint(map(seedSlice3, 100, 999, 200, 470), map(seedSlice3, 100, 999, 300, 543) + this.inc * random(random(random(random()))), map(seedSlice3, 100, 999, 600, 819) + this.inc * random(random(random(random()))), map(seedSlice3, 100, 999, 800, 1104), t);

      this.tmx = bezierTangent(this.ptX1 + this.noiseVal * randomGaussian(), this.ptCtrlX1 + this.noiseScale * random(), this.ptCtrlX2 + this.noiseScale * random(), this.ptX2 + this.noiseVal * randomGaussian(), t);

      this.tmy = bezierTangent(this.ptY1 + this.noiseVal, this.ptCtrlY1 + this.noiseVal, this.ptCtrlY2 + this.noiseVal, this.ptY2 + this.noiseVal, t);

      this.noiseVal = noise((this.inc * 10 + this.xx) * this.noiseScale, this.xx * this.noiseScale);

      // ========== //
      let a = atan2(this.tmy * this.noise, this.tmx * this.noise);
      a -= HALF_PI;
      if (this.timesCounter < 150) {
        // MEDIO

        strokeWeight(map(noise(this.inc), 0, 1, 2, 6));
        push();
        translate(this.celestialObjPositionX, this.celestialObjPositionY);

        this.px = cos(iSt + cos(this.inc * this.noiseVal * 0.01) + this.inc) * 200 * pow(this.noiseVal, 3) * map(this.noiseVal, 0, 1, 3, this.inc/2);

        this.py = sin(iSt + sin(this.inc * this.noiseVal) + this.inc) * 200 * pow(this.noiseVal, 3) * map(this.noiseVal, 0, 1, 3, this.inc/2);
        
        stroke(colorFront01);
        point(this.px, this.py);


        pop();
      }
      // ========== //
      this.timesCounter += 0.001;
      // }
    }
  }

  ravagedSkies() {
    this.incrementals()
    push()
    if(this.timesCounterSky < 1) {
      for (let y = 0; y < height; y++) {
        stroke(colorFront04);
        strokeWeight(random(7))
        point(random(width), y)
        this.timesCounterSky++
      }
    }
    pop()
  }

  incrementals() {
    if (this.up && this.inc <= this.ceiling) {
      this.inc += 0.05 * map(noise(this.inc * 5), 0, 1, 0.1, map(noise(this.inc), 0, 1, 3, 10));
      if (this.inc === this.ceiling) {
        this.up = false;
      }
    } else {
      this.up = false;
      this.inc -= 0.05 * map(noise(this.inc * 5), 0, 1, 0.1, map(noise(this.inc), 0, 1, 3, 10));
      if (this.inc <= 0) {
        this.up = true;
      }
    }
  }
}