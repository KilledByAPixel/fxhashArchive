class Texture {
  constructor() {
    this.inc = 0;
    this.noiseScale=0.02;
    this.up = true;
    this.ceiling = -1000
    this.textureAmount = 100
    this.timesCounter = 0
    this.timesCounterPaper = 0
  }
  linesDiagonalPencilL() {
    this.incrementals();
    this.textureAmount = 1000
    push()
    
    rotate(0.5)
    if (this.timesCounter < 0.4) {
      for (let x = -3000; x < height+2000; x += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+x)*this.noiseScale, x*this.noiseScale);
    
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        stroke(colorBackAccent);
        point(
          -this.inc * pow(noiseVal,-5),
          x, 
        );
        
      }
    } else if (this.timesCounter >= 0.4) {
      skyIsDone = true;
    }
    // ========== //
    this.timesCounter += 0.001
    
    pop()
  }
  linesDiagonalPencilR() {
    this.incrementals();
    this.textureAmount = 1000
    push()
  
    rotate(-0.5)
    if (this.timesCounter < 0.4) {
      for (let y = -2000; y < height+2000; y += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+y)*this.noiseScale, y*this.noiseScale);
  
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        stroke(colorBackAccent);
        point(
          2000-(-this.inc * pow(noiseVal,-5)),
          y, 
        );
        
      }
    } else if (this.timesCounter >= 0.4) {
      skyIsDone = true;
    }
    // ========== //
    this.timesCounter += 0.001
    
    pop()
  }
  linesDiagonal() {
    this.incrementals();
    push()
    
    rotate(0.5)
    if (this.timesCounter < 0.4) {
      for (let x = -4000; x < height+2000; x += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+x)*this.noiseScale, x*this.noiseScale);
    
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        stroke(colorBackAccent);
        point(
          -this.inc * pow(noiseVal,-5),
          x, 
        );
        
      }
    } else if (this.timesCounter >= 0.4) {
      skyIsDone = true;
    }
    // ========== //
    this.timesCounter += 0.001
   
    pop()
  }
  linesVertical() {
    this.incrementals();
    push()
    
    if (this.timesCounter < 0.4) {
      for (let x = 0; x < height; x += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+x)*this.noiseScale, x*this.noiseScale);
        
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        stroke(colorBackAccent);
        
        point(
          x, 
          -this.inc * pow(noiseVal,-5),
        );
        point(
          x, 
          this.inc * pow(noiseVal,-5),
        );
          
      }
    } else if (this.timesCounter >= 0.4) {
      skyIsDone = true;
    }
    // ========== //
    this.timesCounter += 0.001
    
    pop()
  }
  linesHorizontal() {
    this.incrementals();
    push()
    
    if (this.timesCounter < 0.4) {
      for (let xN = -8000; xN < width; xN += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+xN)*this.noiseScale, xN*this.noiseScale);
        
        stroke(colorBackAccent);
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        point(
          -this.inc * pow(noiseVal,-5),
          xN, 
        );
      }
    } else if (this.timesCounter >= 0.4) {
      skyIsDone = true;
    }
    // ========== //
    this.timesCounter += 0.001
    pop()
  }

  linesCrossDiagonal() {
    this.incrementals();
    push()
    
    rotate(0.5)
    if (this.timesCounter < 0.4) {
      for (let x = -4000; x < height+2000; x += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+x)*this.noiseScale, x*this.noiseScale);
        
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        stroke(colorBackAccent);
        point(
          -this.inc * pow(noiseVal,-5),
          x, 
        );
        
        
      }
      for (let xN = 0; xN < height; xN += width/this.textureAmount) {
        let noiseVal = noise((this.inc*4+xN)*this.noiseScale, xN*this.noiseScale);
        
        strokeWeight(map(noiseVal, 0, 1, 0, 6));
        point(
          xN, 
          -this.inc * pow(noiseVal,-5),
        );
        point(
          xN, 
          this.inc * pow(noiseVal,-5),
        );
      }
    } else if (this.timesCounter >= 0.4) {
      skyIsDone = true;
    }
    // ========== //
    this.timesCounter += 0.001
    pop()
  }

  paper() {
    // strokeCap(PROJECT);
    strokeWeight(1);
    
      if (this.timesCounterPaper < 0.01) {
        for (let x = 0; x < width; x += 10) {
          for (let y = 0; y < height; y += 10) {
            stroke(colorFront02);
            point(x - random(-10, 10), y + random(-10, 10));
  
            if(!colorDark) {
              stroke('hsba(0, 0%, 100%, 0.2)');
              point(x - random(-10, 10), y + random(-10, 10));
            }
            
            stroke(colorBack02);
            point(x - random(-10, 10), y + random(-10, 10));
          }
        }
      }
      if(this.timesCounterPaper >= 0.01) {
        celestialObjectIsDone = false;
        live = false;
      }
    // }
    
    
    this.timesCounterPaper += 0.001
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