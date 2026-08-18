let terrainBezCalcs = []
// let pikePositionX = []
// let pikePositionY = []

class Terrain {
  constructor(
    ptX1,
    ptY1,
    ptCtrlX1,
    ptCtrlY1,
    ptCtrlX2,
    ptCtrlY2,
    ptX2,
    ptY2,
    modificator,
    ceiling,
    noiseScale,
    steps
  ) {
    this.ptX1 = ptX1
    this.ptY1 = ptY1
    this.ptCtrlX1 = this.ptX1 * ptCtrlX1
    this.ptCtrlY1 = this.ptY1 + ptCtrlY1
    this.ptCtrlX2 = this.ptX1 * ptCtrlX2
    this.ptCtrlY2 = this.ptY1 + ptCtrlY2
    this.ptX2 = this.ptX1
    this.ptY2 = ptY2
    this.modificator = modificator 
    this.steps = steps
    // this.steps = map(seedSlice3, 100, 999, 200, 500)
    // this.pikePositionX = pikePositionX
    // this.pikePositionY = pikePositionY
    this.up = true
    this.timesCounter = 0
    this.timesCounterDripping = 0
    this.timesCounterAccent = 0
    this.ceiling = ceiling
    this.inc = 0
    this.incDripping = 0
    this.incAccent = 0
    this.incSky = 0
    // 0.02 es el original
    this.noiseScale = noiseScale
    this.noiseVal = 900
    this.pathNoise = this.modificator

    this.howManyTerrainsVar = 0
    this.x = 0
    this.y = 0
    this.xx = 0

    this.celestialObjPositionX = random(width)
    this.celestialObjPositionY = random(height*0.3)
  }

  howManyTerrains() {
    this.howManyTerrainsVar = 1
  }

  separators() {
    if (terrainBase.length === 1) {
      for (let i = 0; i < terrainBase.length; i++) {
        this.pikePositionX.push(width/2 + random(-500, 500))
        this.pikePositionY.push(height * random(0.4, 0.6))
      }
    } else if(terrainBase.length > 1) {
      for (let i = 0; i < terrainBase.length; i++) {

        this.pikePositionY.push(height * random(0.4, 0.8))

        if (i === 0) {

          this.pikePositionX.push(random(100, width - 100))

        } else if (i >= 1) {

          if (this.pikePositionX[i - 1] >= width / 2) {

            this.pikePositionX.push(
              dist(
                0,
                this.pikePositionY[i - 1],
                this.pikePositionX[i - 1],
                this.pikePositionY[i - 1]) / 2
            )
            console.log('arriba de width/2')

          } else if (this.pikePositionX[i - 1] < width / 2) {

            this.pikePositionX.push(
              dist(
                this.pikePositionX[i - 1],
                this.pikePositionY[i - 1],
                width,
                this.pikePositionY[i - 1]) / 2
            )

            console.log('abajo de width/2')
          }
        }
      }
    }
  }

  elevationCalcs() {
   
    for (let i = 0; i < terrainBase.length; i++) {
      // if (terrainBase.length === 1) {

        

        // point 1
        this.ptX1[i] = this.pikePositionX[i]
        this.ptY1[i] = this.pikePositionY[i]
        // console.log(this.ptX1[i],
        //   this.ptY1[i])
        // console.log(map(noise(this.inc), 0, 1, 0.5, 0.8))
        // control point
        this.ptCtrlX1[i] = this.ptX1[i] + random(200, 500)
        this.ptCtrlY1[i] = this.ptY1[i] + random(200, 500)
        
        // control point
        this.ptCtrlX2[i] = this.ptX1[i] + random(200, 800)
        this.ptCtrlY2[i] = this.ptY1[i] + 400
        
        // point 2
        this.ptX2[i] = this.ptX1[i]
        this.ptY2[i] = height + map(seedSlice3, 100, 999, 0, 500)

      terrainBezCalcs.push(
        [
          this.ptX1[i],
          this.ptY1[i],
          this.ptCtrlX1[i],
          this.ptCtrlY1[i],
          this.ptCtrlX2[i],
          this.ptCtrlY2[i],
          this.ptX2[i],
          this.ptY2[i],
        ]
      )
    }
    
  }
  terrainCreator() {
    // console.log(terrainBezCalcs)
    noFill()
    strokeWeight(8)
    stroke('red')
    line(width/2, 0, width/2, height)
    line(0, height/2, width, height/2)
    stroke('rgba(255, 0, 0, 0.1)')
    for (let i = 0; i < this.howManyTerrainsVar; i++) {
      bezier(
        terrainBezCalcs[i][0],
        terrainBezCalcs[i][1],
        terrainBezCalcs[i][2],
        terrainBezCalcs[i][3],
        terrainBezCalcs[i][4],
        terrainBezCalcs[i][5],
        terrainBezCalcs[i][6],
        terrainBezCalcs[i][7],
      )
    }
  }
  terrainSandModel1() {
   
    
    this.incrementals()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
        
        // sand
        this.xx = bezierPoint(
          map(seedSlice3, 100, 999, 200, 470),
          map(seedSlice3, 100, 999, 300, 543)+this.inc*randomGaussian(this.inc),
          map(seedSlice3, 100, 999, 600, 819)+this.inc*randomGaussian(this.inc),
          map(seedSlice3, 100, 999, 800, 1104),
          t
        )

        // rock
        // this.xx = bezierPoint(
        //  map(seedSlice3, 100, 999, 200, 470),
        //  map(seedSlice3, 100, 999, 300, 543)+this.inc*random(random(random(random()))),
        //  map(seedSlice3, 100, 999, 600, 819)+this.inc*random(random(random(random()))),
        //  map(seedSlice3, 100, 999, 800, 1104),
        //  t
        // )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.inc*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounter < 380) {
          stroke('rgba(64, 51, 43, 0.5)')
          strokeWeight(map(noise(this.inc), 0, 1, 0.1, 1))
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack03)
          point(
            this.x - this.inc * this.noiseVal * this.inc,
            this.y);
          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          point(
            this.x - this.inc * this.noiseVal * this.inc + cos(a) * 8,
            this.y + this.inc * 16 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          
        } else if (this.timesCounter >= 380) {
          terrainIsDone = true;
        }
        // ========== //
        this.timesCounter += 0.001
      // }
    }
    
  }
  terrainSandModel2() {
   
    this.incrementals()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.inc*random(random(random(random(this.inc)))),
         map(seedSlice3, 100, 999, 600, 819)+this.inc*random(random(random(random(this.inc)))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
        // this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.inc*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounter < 380) {
          stroke('rgba(64, 51, 43, 0.5)')
          strokeWeight(map(noise(this.inc), 0, 1, 0.1, 1))
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack02)
          point(
            this.x - this.inc * this.noiseVal * this.inc,
            this.y);
          

          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          point(
            this.x - this.inc * this.noiseVal * this.inc + cos(a) * 8,
            this.y + this.inc * 16 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
        } else if (this.timesCounter >= 380) {
          terrainIsDone = true;
        }
        // ========== //
        this.timesCounter += 0.001
      // }
    }
    
  }
  terrainSandModel3() {
   
    
    this.incrementals()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.inc*random(random(random(random()))),
         map(seedSlice3, 100, 999, 600, 819)+this.inc*random(random(random(random()))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.inc*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounter < 380) {
          stroke('rgba(64, 51, 43, 0.5)')
          strokeWeight(map(noise(this.inc), 0, 1, 0.1, 1))
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack03)
          point(
            this.x - this.inc * this.noiseVal * this.inc,
            this.y);
            
          
            
            
          stroke(colorFront02)
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          // stroke('blue')
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          point(
            this.x - this.inc * this.noiseVal * this.inc + cos(a) * 8,
            this.y + this.inc * 16 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );

        
          
        } else if (this.timesCounter >= 380) {
          terrainIsDone = true;
        }
        // ========== //
        this.timesCounter += 0.001
      // }
    }
    
  }
  terrainSandModel4() {
   
    
    this.incrementals()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.inc*random(random(random(random()))),
         map(seedSlice3, 100, 999, 600, 819)+this.inc*random(random(random(random()))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.inc*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounter < 380) {
          stroke('rgba(64, 51, 43, 0.5)')
          strokeWeight(map(noise(this.inc), 0, 1, 0.1, 1))
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack03)
          point(
            this.x - this.inc * this.noiseVal * this.inc,
            this.y);
          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          point(
            this.x - this.inc * this.noiseVal * this.inc + cos(a) * 8,
            this.y + this.inc * 16 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );

          // EXPERIMENTO
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack03)
          point(
            this.x - this.inc * (this.noiseVal*(this.inc*0.01)) * this.inc,
            this.y + this.inc * 8 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.inc * (this.noiseVal*(this.inc*0.001)) * this.inc,
            this.y + this.inc * 8 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.inc * (this.noiseVal*(this.inc*0.001)) * this.inc,
            this.y + this.inc * 8 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          point(
            this.x - this.inc * (this.noiseVal*(this.inc*0.001)) * this.inc + cos(a) * 8,
            this.y + this.inc * 16 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
        
          
        }
        // ========== //
        this.timesCounter += 0.001
      // }
    }
    
  }

  // Accent
  terrainAccent() {
   
    this.incrementalsAccent()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.incAccent*random(random(random(random(this.incAccent)))),
         map(seedSlice3, 100, 999, 600, 819)+this.incAccent*random(random(random(random(this.incAccent)))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.incAccent*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
        // this.noiseVal = noise((this.incAccent*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.incAccent*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(!terrainIsDone) {
          

          stroke(colorFrontAccent)
          // stroke('blue')
          strokeWeight(map(noise(this.incAccent), 0, 1, 2, 6)-this.incAccent)
          point(
            this.x + (this.incAccent*map(this.noiseVal, 0, 1, 0.1, 1)) * cos(this.incAccent*map(this.noiseVal, 0, 1, 0.1, 0.5)) * this.incAccent * this.noiseVal,
            this.y + (this.incAccent*map(this.noiseVal, 0, 1, 0.1, 1)) * sin(this.incAccent*map(this.noiseVal, 0, 1, 0.1, 0.5)) * this.incAccent/2 * this.noiseVal
            );

            // point(
            //   this.x + (this.incAccent*map(this.noiseVal, 0, 1, 0.1, 1)) * sin(this.incAccent*map(this.noiseVal, 0, 1, 0.1, 0.5)) * this.incAccent * this.noiseVal,
            //   this.y + (this.incAccent*map(this.noiseVal, 0, 1, 0.1, 1)) * cos(this.incAccent*map(this.noiseVal, 0, 1, 0.1, 0.5)) * map(this.noiseVal, 0, 1, 8, seedSlice2) * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.incAccent * 9)
            //   );
          // console.log('test');
        }
        // ========== //
        this.timesCounterAccent += 0.001
      // }
    }
    
  }

  // DRIPPING
  drippingRock() {
   
    
    this.incrementalsDripping()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.incDripping*random(random(random(random()))),
         map(seedSlice3, 100, 999, 600, 819)+this.incDripping*random(random(random(random()))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.incDripping*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.incDripping*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounterDripping < 380) {
          stroke('rgba(64, 51, 43, 0.5)')
          strokeWeight(map(noise(this.incDripping), 0, 1, 0.1, 1))
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



          // EXPERIMENTO
          strokeWeight(map(noise(this.incDripping), 0, 1, 2, 6))
          stroke(colorBack03)
          point(
            this.x - this.incDripping * (this.noiseVal*(this.incDripping*0.01)) * this.incDripping,
            this.y + this.incDripping * 8 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
          );
          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.incDripping * (this.noiseVal*(this.incDripping*0.001)) * this.incDripping,
            this.y + this.incDripping * 8 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.incDripping * (this.noiseVal*(this.incDripping*0.001)) * this.incDripping,
            this.y + this.incDripping * 8 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
          );
          strokeWeight(map(noise(this.incDripping), 0, 1, 2, 6))
          point(
            this.x - this.incDripping * (this.noiseVal*(this.incDripping*0.001)) * this.incDripping + cos(a) * 8,
            this.y + this.incDripping * 16 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
          );
        
          
        }
        // ========== //
        this.timesCounterDripping += 0.001
      // }
    }
    
  }

  drippingSand() {
   
    
    this.incrementalsDripping()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
          map(seedSlice3, 100, 999, 200, 470),
          map(seedSlice3, 100, 999, 300, 543)+this.incDripping*randomGaussian(this.incDripping),
          map(seedSlice3, 100, 999, 600, 819)+this.incDripping*randomGaussian(this.incDripping),
          map(seedSlice3, 100, 999, 800, 1104),
          t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.incDripping*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.incDripping*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounterDripping < 380) {
          
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



           // EXPERIMENTO
           strokeWeight(map(noise(this.incDripping), 0, 1, 2, 6))
           stroke(colorBack03)
           point(
             this.x - this.incDripping * (this.noiseVal*(this.incDripping*0.01)) * this.incDripping,
             this.y + this.incDripping * 8 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
           );
           stroke(colorFront02)
           // stroke('blue')
           point(
             this.x + this.incDripping * (this.noiseVal*(this.incDripping*0.001)) * this.incDripping,
             this.y + this.incDripping * 8 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
           );
 
 
 
 
           strokeWeight(random(0.5, 1))
           point(
             this.x + this.incDripping * (this.noiseVal*(this.incDripping*0.001)) * this.incDripping,
             this.y + this.incDripping * 8 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
           );
           strokeWeight(map(noise(this.incDripping), 0, 1, 2, 6))
           point(
             this.x - this.incDripping * (this.noiseVal*(this.incDripping*0.001)) * this.incDripping + cos(a) * 8,
             this.y + this.incDripping * 16 * this.noiseVal*(this.incDripping*0.5) + map(this.noiseVal, 0, 1, 3, this.incDripping * 9)
           );
        
          
        }
        // ========== //
        this.timesCounterDripping += 0.001
      // }
    }
    
  }

  // windy sand
  windySand() {
   
    
    this.incrementals()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
          map(seedSlice3, 100, 999, 200, 470),
          map(seedSlice3, 100, 999, 300, 543)+this.inc*randomGaussian(this.inc),
          map(seedSlice3, 100, 999, 600, 819)+this.inc*randomGaussian(this.inc),
          map(seedSlice3, 100, 999, 800, 1104),
          t
        )


        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.inc*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounter < 380) {

          // EXPERIMENTO
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack03)
          point(
            this.x + this.inc * random(25, 32) * this.noiseVal * this.inc + cos(a) * 8,
            this.y - this.inc * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          // point(
          //   this.x - this.inc * (this.noiseVal*(this.inc*0.01)) * this.inc,
          //   this.y + this.inc * 8 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          // );
          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.inc * 32 * (this.noiseVal*(this.inc*0.001)) * this.inc + cos(a) * 8,
            this.y - this.inc * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          // strokeWeight(random(0.5, 1))
          // point(
          //   this.x + this.inc * (this.noiseVal*(this.inc*0.001)) * this.inc,
          //   this.y + this.inc * 8 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          // );
          // strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          // point(
          //   this.x - this.inc * (this.noiseVal*(this.inc*0.001)) * this.inc + cos(a) * 8,
          //   this.y + this.inc * 16 * this.noiseVal*(this.inc*0.5) + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          // );
        
          
        }
        // ========== //
        this.timesCounter += 0.001
      // }
    }
    
  }

  // sky
  sky() {
   
    this.incrementals()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.inc*random(random(random(random(this.inc)))),
         map(seedSlice3, 100, 999, 600, 819)+this.inc*random(random(random(random(this.inc)))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
        // this.noiseVal = noise((this.inc*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.inc*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounter < 380) {
          stroke('rgba(64, 51, 43, 0.5)')
          strokeWeight(map(noise(this.inc), 0, 1, 0.1, 1))
          // point(this.lx, this.ly);
          // point(this.rx, this.ry);


          // MEDIO



          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          stroke(colorBack02)
          point(
            this.x - this.inc * this.noiseVal * this.inc,
            this.y);
          

          stroke(colorFront02)
          // stroke('blue')
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );




          strokeWeight(random(0.5, 1))
          point(
            this.x + this.inc * this.noiseVal * this.inc,
            this.y + this.inc * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
          strokeWeight(map(noise(this.inc), 0, 1, 2, 6))
          point(
            this.x - this.inc * this.noiseVal * this.inc + cos(a) * 8,
            this.y + this.inc * 16 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.inc * 9)
          );
        }
        // ========== //
        this.timesCounter += 0.001
      // }
    }
    
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
  incrementalsDripping() {
    if (this.up && this.incDripping <= this.ceiling) {
      this.incDripping += 0.05 * map(noise(this.incDripping * 5), 0, 1, 0.1, map(noise(this.incDripping), 0, 1, 3, 10));
      if (this.incDripping === this.ceiling) {
        this.up = false;
      }
    } else {
      this.up = false;
      this.incDripping -= 0.05 * map(noise(this.incDripping * 5), 0, 1, 0.1, map(noise(this.incDripping), 0, 1, 3, 10));
      if (this.incDripping <= 0) {
        this.up = true;
      }
    }
  }
  incrementalsAccent() {
    if (this.up && this.incAccent <= this.ceiling) {
      this.incAccent += 0.05 * map(noise(this.incAccent * 5), 0, 1, 0.1, map(noise(this.incAccent), 0, 1, 3, 10));
      if (this.incAccent === this.ceiling) {
        this.up = false;
      }
    } else {
      this.up = false;
      this.incAccent -= 0.05 * map(noise(this.incAccent * 5), 0, 1, 0.1, map(noise(this.incAccent), 0, 1, 3, 10));
      if (this.incAccent <= 0) {
        this.up = true;
      }
    }
  }
  incrementalsSky() {
    if (this.up && this.incSky <= this.ceiling) {
      this.incSky += 0.05 * map(noise(this.incSky * 5), 0, 1, 0.1, map(noise(this.incSky), 0, 1, 3, 10));
      if (this.incSky === this.ceiling) {
        this.up = false;
      }
    } else {
      this.up = false;
      this.incSky -= 0.05 * map(noise(this.incSky * 5), 0, 1, 0.1, map(noise(this.incSky), 0, 1, 3, 10));
      if (this.incSky <= 0) {
        this.up = true;
      }
    }
  }
}

class Sky {
  constructor(
    ptX1,
    ptY1,
    ptCtrlX1,
    ptCtrlY1,
    ptCtrlX2,
    ptCtrlY2,
    ptX2,
    ptY2,
    modificator,
    ceiling,
    noiseScale,
    steps
  ) {
    this.ptX1 = ptX1
    this.ptY1 = ptY1
    this.ptCtrlX1 = this.ptX1 * ptCtrlX1
    this.ptCtrlY1 = this.ptY1 + ptCtrlY1
    this.ptCtrlX2 = this.ptX1 * ptCtrlX2
    this.ptCtrlY2 = this.ptY1 + ptCtrlY2
    this.ptX2 = ptX2
    this.ptY2 = ptY2
    this.modificator = modificator 
    this.steps = steps
    // this.steps = map(seedSlice3, 100, 999, 200, 500)
    // this.pikePositionX = pikePositionX
    // this.pikePositionY = pikePositionY
    this.up = true
    this.timesCounter = 0
    this.timesCounterDripping = 0
    this.timesCounterAccent = 0
    this.timesCounterSky = 0
    this.ceiling = ceiling
    this.inc = 0
    this.incDripping = 0
    this.incAccent = 0
    this.incSky = 0
    // 0.02 es el original
    this.noiseScale = noiseScale
    this.noiseVal = 900
    this.pathNoise = this.modificator

    this.howManyTerrainsVar = 0
    this.x = 0
    this.y = 0
    this.xx = 0

    this.celestialObjPositionX = random(width)
    this.celestialObjPositionY = random(height*0.3)
  }

  howManyTerrains() {
    this.howManyTerrainsVar = 1
  }

  separators() {
    if (terrainBase.length === 1) {
      for (let i = 0; i < terrainBase.length; i++) {
        this.pikePositionX.push(width/2 + random(-500, 500))
        this.pikePositionY.push(height * random(0.4, 0.6))
      }
    } else if(terrainBase.length > 1) {
      for (let i = 0; i < terrainBase.length; i++) {

        this.pikePositionY.push(height * random(0.4, 0.8))

        if (i === 0) {

          this.pikePositionX.push(random(100, width - 100))

        } else if (i >= 1) {

          if (this.pikePositionX[i - 1] >= width / 2) {

            this.pikePositionX.push(
              dist(
                0,
                this.pikePositionY[i - 1],
                this.pikePositionX[i - 1],
                this.pikePositionY[i - 1]) / 2
            )
            console.log('arriba de width/2')

          } else if (this.pikePositionX[i - 1] < width / 2) {

            this.pikePositionX.push(
              dist(
                this.pikePositionX[i - 1],
                this.pikePositionY[i - 1],
                width,
                this.pikePositionY[i - 1]) / 2
            )

            console.log('abajo de width/2')
          }
        }
      }
    }
  }

  elevationCalcs() {
   
    for (let i = 0; i < terrainBase.length; i++) {
      // if (terrainBase.length === 1) {

        

        // point 1
        this.ptX1[i] = this.pikePositionX[i]
        this.ptY1[i] = this.pikePositionY[i]
        // console.log(this.ptX1[i],
        //   this.ptY1[i])
        // console.log(map(noise(this.inc), 0, 1, 0.5, 0.8))
        // control point
        this.ptCtrlX1[i] = this.ptX1[i] + random(200, 500)
        this.ptCtrlY1[i] = this.ptY1[i] + random(200, 500)
        
        // control point
        this.ptCtrlX2[i] = this.ptX1[i] + random(200, 800)
        this.ptCtrlY2[i] = this.ptY1[i] + 400
        
        // point 2
        this.ptX2[i] = this.ptX1[i]
        this.ptY2[i] = height + map(seedSlice3, 100, 999, 0, 500)

      terrainBezCalcs.push(
        [
          this.ptX1[i],
          this.ptY1[i],
          this.ptCtrlX1[i],
          this.ptCtrlY1[i],
          this.ptCtrlX2[i],
          this.ptCtrlY2[i],
          this.ptX2[i],
          this.ptY2[i],
        ]
      )
    }
    
  }
  terrainCreator() {
    // console.log(terrainBezCalcs)
    noFill()
    strokeWeight(8)
    stroke('red')
    line(width/2, 0, width/2, height)
    line(0, height/2, width, height/2)
    stroke('rgba(255, 0, 0, 0.1)')
    for (let i = 0; i < this.howManyTerrainsVar; i++) {
      bezier(
        terrainBezCalcs[i][0],
        terrainBezCalcs[i][1],
        terrainBezCalcs[i][2],
        terrainBezCalcs[i][3],
        terrainBezCalcs[i][4],
        terrainBezCalcs[i][5],
        terrainBezCalcs[i][6],
        terrainBezCalcs[i][7],
      )
    }
  }
 
  // sky
  sky() {
   
    this.incrementalsSky()
    
    for (let iSt = 0; iSt < this.steps; iSt++) {
      let t = iSt / this.steps;
      
      // for (let i = 0; i < terrainBase.length; i++) {
        this.x = bezierPoint(
          this.ptX1+this.noiseVal,
          this.ptCtrlX1*this.noiseVal,
          this.ptCtrlX2*this.noiseVal,
          this.ptX2+this.noiseVal,
          t
        );
        this.y = bezierPoint(
          this.ptY1,
          this.ptCtrlY1,
          this.ptCtrlY2,
          this.ptY2,
          t
        );
      
        // rock
        this.xx = bezierPoint(
         map(seedSlice3, 100, 999, 200, 470),
         map(seedSlice3, 100, 999, 300, 543)+this.incSky*random(random(random(random(this.incSky)))),
         map(seedSlice3, 100, 999, 600, 819)+this.incSky*random(random(random(random(this.incSky)))),
         map(seedSlice3, 100, 999, 800, 1104),
         t
        )

        this.tmx = bezierTangent(
          this.ptX1+this.noiseVal*randomGaussian(), 
          this.ptCtrlX1+this.noiseScale*random(), 
          this.ptCtrlX2+this.noiseScale*random(), 
          this.ptX2+this.noiseVal*randomGaussian(), 
          t);
  
        this.tmy = bezierTangent(
         this.ptY1+this.noiseVal, 
         this.ptCtrlY1+this.noiseVal, 
         this.ptCtrlY2+this.noiseVal, 
         this.ptY2+this.noiseVal, 
          t);
        // console.log(this.xx);
        this.noiseVal = noise((this.incSky*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
        // this.noiseVal = noise((this.incSky*this.pathNoise+this.xx)*this.noiseScale, this.xx*this.noiseScale);
     // this.noiseVal = noise((this.incSky*this.pathNoise+this.rx)*this.noiseScale, this.rx*this.noiseScale);

        // ========== //
        let a = atan2(this.tmy, this.tmx);
        a += PI;
        if(this.timesCounterSky < 100) {
          
          strokeWeight(map(noise(this.incSky), 0, 1, 2, 6))
          // stroke(colorBack02)
          // point(
          //   this.x - this.incSky * this.noiseVal * this.incSky,
          //   this.y);
          

          stroke(colorFront01)
          // stroke('blue')
          point(
            this.x + this.incSky * this.noiseVal * cos(this.incAccent*map(this.noiseVal, 0, 1, 0.1, 0.5)) + this.incSky,
            this.y + pow(this.incSky, 4) * sin(this.incAccent*map(this.noiseVal, 0, 1, 0.1, 0.5)) * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.incSky * 9)
          );




          // strokeWeight(random(0.5, 1))
          // point(
          //   this.x + this.incSky * this.noiseVal * this.incSky,
          //   this.y + this.incSky * 8 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.incSky * 9)
          // );
          // strokeWeight(map(noise(this.incSky), 0, 1, 2, 6))
          // point(
          //   this.x - this.incSky * this.noiseVal * this.incSky + cos(a) * 8,
          //   this.y + this.incSky * 16 * this.noiseVal + map(this.noiseVal, 0, 1, 3, this.incSky * 9)
          // );
        }
        // ========== //
        this.timesCounterSky += 0.001
      // }
    }
    
  }
  
  incrementalsSky() {
    if (this.up && this.incSky <= this.ceiling) {
      this.incSky += 0.05 * map(noise(this.incSky * 5), 0, 1, 0.1, map(noise(this.incSky), 0, 1, 3, 10));
      if (this.incSky === this.ceiling) {
        this.up = false;
      }
    } else {
      this.up = false;
      this.incSky -= 0.05 * map(noise(this.incSky * 5), 0, 1, 0.1, map(noise(this.incSky), 0, 1, 3, 10));
      if (this.incSky <= 0) {
        this.up = true;
      }
    }
  }
}

class GridRef {
  constructor() {
    this.gridPosX = [200, 600, 1000, 1400, 1800]
    this.gridPosY = [height*0.45, height*0.5, height*0.6, height*0.7, height*0.8]
  }

  lines() {
    push()
    strokeWeight(2)
    stroke('#1d3557')
    
    // line(0, height*0.45, width, height*0.45)
    // line(0, height*0.5, width, height*0.5)
    // line(0, height*0.6, width, height*0.6)
    // line(0, height*0.7, width, height*0.7)
    // line(0, height*0.8, width, height*0.8)
    for (let horizontal = 0; horizontal < gridPosX.length; horizontal++) {
      line(gridPosX[horizontal], 0, gridPosX[horizontal], height)
    }
    for (let vertical = 0; vertical < gridPosY.length; vertical++) {
      line(0, gridPosY[vertical], width, gridPosY[vertical])
    }
    pop()
  }
}

// class Plant {
//   constructor() {
//   }

// }