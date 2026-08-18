class FlowField {
  constructor(_loc, _dir, _speed, _r, x, y, ffCount, id) {
    this.dir = _dir;
    this.r = 0;
    this.id = id;
    this.p = 0;
    this.loc = createVector(x, y);
    this.arrayIncreaser = arrayIncreaser;
    this.index = index;
    this.emptyFillColor = emptyFillColor;
    this.emptyFillColor2 = emptyFillColor;
    this.fillColorName = fillColorName;
    this.filled = filled;
    this.counter = counter;

    this.x = x;
    this.y = y;
    this.hit = true;
    this.bodyColor = c;
    if (colorChange == "Inside Out") {
      this.flexer = 0.1;
      this.fIncreaser = fIncreaser;
    } 

    
    if (noiseON ==1) {
      this.loc.x = random(0, width*1.25)
    }
    if (noiseON ==2) {
      this.loc.y = random(0, height*1.25);
    }
    if (noiseON ==3) {
      this.loc.y = random(-height*0.25, height);
    } 
    if (noiseON ==4) {
      this.loc.x = random(-width*0.25, width)
    }
    this.c = c;
    this.c2_9 = c2_9;
    finalC1 = gc1;
    finalC2 = gc2;
    finalC3 = gc3;
    finalC4 = gc4;
    finalC5 = gc5;
    finalC6 = gc6;
    finalC7 = gc7;
    finalC8 = gc8;
    this.clonedC = [];
    this.finalC1 = finalC1;
    this.finalC2 = finalC2;
    this.finalC3 = finalC3;
    this.finalC4 = finalC4;
    this.finalC5 = finalC5;
    this.finalC6 = finalC6;
    this.finalC7 = finalC7;
    this.finalC8 = finalC8;
    this.col1 = random(c);
    this.col2 = random(c2_9);
    this.col3 = random(c);
    this.col4 = random(c);
    this.col5 = random(c);
    this.col6 = random(c);
    this.col7 = random(c);
    this.col8 = random(c);
    this.strokeA = random(this.c2_9);

    this.x2 = x;
    this.y2 = y;
    let other = flowField[i];

    let rRounder1 = random(0,1);
    let rRounder2 = random(0,1);
    let rRounder3 = random(0,1);
    let rRounder4 = random(0,1);
    let fortyfive = this.r / sqrt(2);
    
    if (rRounder1 <= 0.5) {
      this.rounder1 = random(2, 10)*sizeAdjust;
    } else if (rRounder1 <= 1) {
      this.rounder1 =1;
    }
        if (rRounder2 <= 0.5) {
      this.rounder2 = random(2, 10)*sizeAdjust;
    } else if (rRounder2 <= 1) {
      this.rounder2 =1;
    }
        if (rRounder3 <= 0.5) {
      this.rounder3 = random(2, 10)*sizeAdjust;
    } else if (rRounder3 <= 1) {
      this.rounder3 =1;
    }
        if (rRounder4 <= 0.5) {
      this.rounder4 = random(2, 10)*sizeAdjust;
    } else if (rRounder4 <= 1) {
      this.rounder4 =1;
    }
    this.strokeColorUniform = strokeColorUniform;
    this.strokeColorUniform2 = strokeColorUniform2;
    this.cAdj2 = cAdj2;
    this.cAdj3 = cAdj3;
    this.cAdj4 = cAdj4;
    this.cAdj5 = cAdj5;
    this.cAdj6 = cAdj6;
    this.cAdj7 = cAdj7;

    let rFAdj1 = random(0, 1);
    if (rFAdj1 <= 0.5) {
      this.fAdj1 = random(0, 0.5);
    } else if (rFAdj1 <= 1) {
      this.fAdj1 = random(0.5, 1);
    }

    this.rotation = 0;
    this.shape = shape;

    this.rotator = floor(random(1, 5));
    // print(this.rotator);
    this.ffCount = ffCount;
    if (hatchedON == 1) {
      this.hatchSize = 0;
      this.r = 0;
    } else if (hatchedON == 0) {
      this.hatchSize = 0.00001*sizeAdjust;
      this.r = 0.00001*sizeAdjust;
    }
    //   print('this.shape = ' + this.shape)
    if (this.fillColorName == "Varied") {
      this.rFill = random(0, 1);
      if (this.rFill <= 0.5) {
        this.filled = 1;
      } else if (this.rFill <= 1) {
        this.filled = 0;
      }
    } 
    
    if (this.shape == "Squircle") {
      this.rShape = random(0, 1);
      if (this.rShape <= 0.5) {
        this.shape = "Square";
      } else if (this.rShape <= 1) {
        this.shape = "Circle";
      }
    } else if (this.shape == "Square") {
      this.shape = "Square";
    } else if (this.shape == "Circle") {
      this.shape = "Circle";
    }

    flowField[flowField.length] = this;
    this.speed = _speed;
    this.d = 0.75*sizeAdjust; 
    if (
      fillColorName == "Translucent" ||
      fillColorName == "Translucent: Light" ||
      fillColorName == "Translucent: Light & Dark" ||
      fillColorName == "Translucent: Black"
    ) {
      // if (rotateON == 1) {
        this.speed = 1.2;
        this.d = 0.75*sizeAdjust; 
        rotateAmount = 0.005;
      // } else if (rotateON == 0) {
      //   this.speed = 1.2*sizeAdjust;
      //   this.d = 0.75; 
      // }
    }

      this.finalStroke =random(c);
      this.finalStrokeEmpty = random(c2_9);
      this.finalStrokeEmpty2 = random(c2_9);
      this.finalStrokeEmpty3 = random(c2_9);
    // }
    if (colorChange != "Inside Out") {
      this.flexer = 1;
      this.fIncreaser = 0;
      this.flexer1 = 1;
      this.flexer0 = 0;
    }
    this.fillTranslucent = fillTranslucent;
    
    if (filled==1) {
      this.finalC3 =
        pc24l.indexOf(this.finalC4) >=0  ? random(pc25d)
          : random(pc24l);
    this.finalC1 =
        pc24l.indexOf(this.finalC2) >=0  ? random(pc25d)
          : random(pc24l);
    this.finalStrokeEmpty =
        pc24l.indexOf(this.finalC1) >=0  ? random(pc25d)
          : random(pc24l);
    }
    
    if (fillColorName == "Translucent: Black") {
        this.fillTranslucent = fillBlack; 
        this.finalStrokeEmpty = random(this.c2_9)
        this.finalStrokeEmpty2 = random(this.c2_9)
    }
    if (fillColorName == "Translucent: Palette") {
      this.fillTranslucent = random(c);
      this.p = c.indexOf(this.fillTranslucent);
      this.clonedC = this.c.slice();
      this.clonedC.splice(this.p,1);
      this.finalStrokeEmpty = random(this.clonedC);
      this.finalStrokeEmpty2 = random(this.clonedC);
      this.fillTranslucent.setAlpha(cTranslucentAlpha);
    }
    if (fillColorName == "Translucent: Light") {
      this.q = this.c2_9.indexOf(backgroundColor);
      this.clonedC = this.c2_9.slice();
      this.clonedC.splice(this.q,1);
      this.finalStrokeEmpty = random(this.clonedC);
        if (this.fillTranslucent == c11) {
        this.finalStrokeEmpty = random(this.c2_9)
        this.finalStrokeEmpty2 = random(this.c2_9)
        }
    }
    if (fillColorName == "Translucent: Light & Dark") {
      let rFillTranslucent = random(0, 1);
      if (rFillTranslucent <= 0.5) {
        this.fillTranslucent = fillBlack; 
        this.finalStrokeEmpty = random(fillLight)
        this.finalStrokeEmpty2 = random(fillLight)
      } else if (rFillTranslucent <= 1) {
        this.fillTranslucent = c11;
        this.finalStrokeEmpty = random(fillDark)
        this.finalStrokeEmpty2 = random(fillDark)
      }

    }    
  }

  getLocation() {

    if (unique == "#lostNotLost") { 
     angle =
      noise(((this.loc.x/w)*582)  / noiseScale, ((this.loc.y/h)*582) / noiseScale, noiseScale) * TWO_PI * TWO_PI*TWO_PI; 
    } else if (unique == "#clewFoLlOWclew") {
     angle =
      noise(((this.loc.x/w)*582)  / noiseScale, ((this.loc.y/h)*582) / noiseScale, noiseScale) *TWO_PI *HALF_PI; 
    } else if (perspectiv == "Indirect") {
     angle =
      // noise(((this.loc.x/w) *582)/noiseScale, ((this.loc.y/h)*582)/noiseScale, frameCount / noiseScale )  * noiseAdj * noiseStrength + 100; 
      noise((-noiseAdj*10)/noiseScale, noiseAdj/noiseScale, frameCount/noiseScale)+noiseStrength*1.48//*(1+random(0,1));
      // noise(-.10, 0.5, PI)+noiseStrength*2.25//*(1+random(0,1));
    } else if (perspectiv == "Very Direct") {
     angle =
      noise(noiseAdj/noiseScale, noiseAdj/noiseScale)+noiseStrength;
    } else { angle = 
      noise(((this.loc.x/w) *582)/noiseScale, ((this.loc.y/h)*582)/noiseScale, frameCount / noiseScale )  * noiseAdj * noiseStrength + 100; 
            // noise((this.loc.x/w) , (this.loc.y/h)  ); 
    }
  
    
    this.dir.x = cos(angle); //
    this.dir.y = sin(angle); //
    var vel = this.dir.copy();
    vel.mult(this.speed * this.d);
    this.loc.add(vel); 
  }

  checkLocation() {
    if (this.loc.x < width * -0.25 && noiseON == 1) {
      this.loc.x = random(width, width * 1.2);
      this.loc.y = random(height * -0.2, height * 1.2);
      this.r = random((this.counter*increaser)/2, this.counter * increaser);
    } else if (this.loc.y < height * -0.25 && noiseON == 2) {
      this.loc.x = random(width * -0.2, width * 1.2);
      this.loc.y = random(height, height * 1.23);
      this.r = random((this.counter*increaser)/2, this.counter * increaser);
    } else if (this.loc.y > height * 1.25 && noiseON == 3) {
      this.loc.x = random(width * -0.2, width * 1.2);
      this.loc.y = random(height * -0.2, height * 0);
      this.r = random((this.counter*increaser)/2, this.counter * increaser);
    } else if (this.loc.x > width * 1.25 && noiseON == 4) {
      this.loc.x = random(-width / 8, 0);
      this.loc.y = random(height * -0.2, height * 1.2);
      this.r = random((this.counter*increaser)/2, this.counter * increaser);
    }

    if (symmetricalON == 1 && this.loc.x > width / 2) {

      this.loc.x = random(0, width / 2);
      // if (noiseON>=0) {
      this.r = 0;
      // }
    } else if (symmetricalON == 2 && this.loc.y > height / 2) {

      // this.loc.y = random(height / 2, height);
      this.loc.y = random(0, height / 2);
      // if (noiseON>=0) {
      this.r = 0;
      // }
    } else if (symmetricalON == 3 && this.loc.y > height / 2) {
        this.loc.y = random(0, height / 2);
      // if (noiseON>=0) {
      this.r = 0;
      // }
    }

    if (noiseON == 0) {
      if (
        // sBigS==0 ||
        (this.loc.x < width * -1.1 + width && ffCount < reproductionStopper) ||
        (this.loc.x > width * 1.1 && ffCount < reproductionStopper) ||
        (this.loc.y < height * -1.1 + height &&
          ffCount < reproductionStopper) ||
        (this.loc.y > height * 1.1 && ffCount < reproductionStopper)
      ) {
        let rando = random(0, 1);
        if (rando <= 0.25) {
          this.loc.x = random(width * -1.1, 0);
          this.loc.y = random(0, height);
        } else if (rando <= 0.5) {
          this.loc.x = random(width, width * 1.1);
          this.loc.y = random(0, height);
        } else if (rando <= 0.75) {
          this.loc.x = random(0, width);
          this.loc.y = random(height * -1.1, 0);
        } else if (rando <= 1) {
          this.loc.x = random(0, width);
          this.loc.y = random(height, height * 1.1);
        }
        this.r = 0;
      }
    } else if (frame == "Foreground" || frame == "Background/Foreground") {
      this.loc.x = constrain(this.loc.x, 0 + frameSizeW, width - frameSizeW);
      this.loc.y = constrain(this.loc.y, 0 + frameSizeH, height - frameSizeH);
    } else if (splitStyle == "None") {
      this.loc.x = constrain(this.loc.x, width * -0.1, width * 1.1);
      this.loc.y = constrain(this.loc.y, height * -0.1, height * 1.1);
    }
  }

  checkCollision(f) {
    for (let other of fields) {
      if (f !== other) {
        this.hit = cirCirCollision(
          this.loc.x,
          this.loc.y,
          this.r * 2,
          other.loc.x,
          other.loc.y,
          other.r * 2
        );
        this.hit2 = rectRectCollision(
          this.loc.x,
          this.loc.y,
          this.r,
          this.r,
          other.loc.x,
          other.loc.y,
          other.r,
          other.r
        );
        this.hit3 = cirRectCollision(
          this.loc.x,
          this.loc.y,
          this.r,
          this.r,
          other.loc.x,
          other.loc.y,
          other.r * 2
        );
        
        if (this.hit == true  && bigSurvive=="Big" && other.r>= this.r || this.hit2 == true  && bigSurvive=="Big" && other.r>= this.r || this.hit3 == true  && bigSurvive=="Big" && other.r>= this.r ) {
          if (ffCount < totalRunsEst * 0.97) {
            this.loc.x = random(0, width);
            this.loc.y = random(0, height);
            this.speed = this.speed;
            this.r = this.hatchSize;
            f.checkLocation2();
          } else if (ffCount >= totalRunsEst * 0.97) {
            this.loc.x = random(width * -1, width * -0.5);
            this.loc.y = random(height * -1, height * -0.5);
            this.speed = this.speed;
            this.r = this.hatchSize;
          }
        } else if (this.hit == true  && bigSurvive=="Small" && other.r<= this.r || this.hit2 == true  && bigSurvive=="Small" && other.r<= this.r || this.hit3 == true  && bigSurvive=="Small" && other.r<= this.r ) {
          if (ffCount < totalRunsEst * 0.97) {
            this.loc.x = random(0, width);
            this.loc.y = random(0, height);
            this.speed = this.speed;
            this.r = this.hatchSize;
            f.checkLocation2();
          } else if (ffCount >= totalRunsEst * 0.97) {
            this.loc.x = random(width * -1, width * -0.5);
            this.loc.y = random(height * -1, height * -0.5);
            this.speed = this.speed;
            this.r = this.hatchSize;
          }
        } else if (this.hit == true  && bigSurvive=="Random"   && (this.id/other.id) <= 1 || this.hit2 == true  && bigSurvive=="Random" && (this.id/other.id) <= 1 || this.hit3 == true  && bigSurvive=="Random" && (this.id/other.id) <= 1 ) {
          if (ffCount < totalRunsEst * 0.75) {
            this.loc.x = random(0, width);
            this.loc.y = random(0, height);
            this.speed = this.speed;
            this.r = this.hatchSize;
            f.checkLocation2();
          } else if (ffCount >= totalRunsEst * 0.75) {
            this.loc.x = random(width * -1, width * -0.5);
            this.loc.y = random(height * -1, height * -0.5);
            this.speed = this.speed;
            this.r = this.hatchSize;
          }
        }    
      }
    // if (this.id==40) {
    //   print('this.id = ' + this.id + " other.id = " + other.id)
    // }
    }
  }

  display() {
    i++;

    if (colorChange == "Chaos") {
      this.finalC1 = random(c);
      this.finalC2 = random(c2_9);
      this.finalC3 = random(c);
      this.finalC4 = random(c);
      this.finalC5 = random(c);
      this.finalC6 = random(c);
      this.finalC7 = random(c);
      this.finalC8 = random(c);
      this.finalStrokeEmpty = random(c);
      this.finalStroke = random(c);
    }
    if (colorCounter >= colorLength / 1.5 && colorChange == "Sporadic Chaos") {
        this.finalC1 = random(c);
        this.finalC2 = random(c2_9);
        this.finalC3 = random(c);
        this.finalC4 = random(c);
        this.finalC5 = random(c);
        this.finalC6 = random(c);
        this.finalC7 = random(c);
        this.finalC8 = random(c);
        this.finalStroke = random(c);
        this.finalStrokeEmpty = random(c);
        this.finalStrokeEmpty =
        pc24l.indexOf(this.finalC1) >=0  ? random(pc25d)
          : random(pc24l);
    }
    
    
    if (colorCounter == round(colorLength) && colorChange == "Switch") {
        this.finalC1 = random(c);
        this.finalC2 = random(c2_9);
        this.finalC3 = random(c);
        this.finalC4 = random(c);
        this.finalC5 = random(c);
        this.finalC6 = random(c);
        this.finalC7 = random(c);
        this.finalC8 = random(c);
        this.finalStroke = random(c);
        this.finalStrokeEmpty = random(c2_9);
        this.finalStrokeEmpty =
        pc24l.indexOf(this.finalC1) >=0  ? random(pc25d)
          : random(pc24l);
          if (fillColorName == "Translucent: Palette") {
              this.finalStrokeEmpty = random(this.clonedC)
      }
    }

    if (this.filled==1) {
      if (colorName == "Black && White" ) {
        if (pc24l.indexOf(this.finalC1) >=0) {
        this.finalStrokeEmpty = c1;
          this.finalStroke = c1; 
      } else if (pc25d.indexOf(this.finalC1) >=0) {
        this.finalStrokeEmpty = c10;
        this.finalStroke = c10;
      }
      this.finalStrokeEmpty.setAlpha(filledStrokeCol_Alpha);     
      }
    } else if (this.filled==0) {
      if (colorName == "Black && White" ) {
        if (this.fillTranslucent == fillBlack) {
        this.finalStrokeEmpty = c10;
          this.finalStroke = c10; 
      } else {
        this.finalStrokeEmpty = c1;
        this.finalStroke = c1;
      }
      this.finalStrokeEmpty.setAlpha(filledStrokeCol_Alpha);     
      }
    this.finalStrokeEmpty.setAlpha(emptyStrokeCol_Alpha);
    }
  

    
    ////////////////////////--------------------------------------------
    
    
    if (
    colorChange == "Inside Out" || colorChange == "Diverse"
  ) {
    this.finalC1 = this.col1;
    this.finalC2 = this.col2;
    this.finalC3 = this.col3;
    this.finalC4 = this.col4;
    this.finalC5 = this.col5;
    this.finalC6 = this.col6;
    this.finalC7 = this.col7;
    this.finalC8 = this.col8;
    this.finalStroke = colorChange == "Inside Out" ? this.strokeA : this.finalStrokeEmpty;
    } 
    
    
  ////////////////////////--------------------------------------------  

    
    
    runShapes(
      this.shape,
      this.loc.x,
      this.loc.y,
      this.r,
      this.rotation,
      this.rotator,
      this.rounder1,
      this.rounder2,
      this.rounder3,
      this.rounder4,
      this.cAdj2,
      this.cAdj3,
      this.cAdj4,
      this.cAdj5,
      this.cAdj6,
      this.cAdj7,
      this.finalC1,
      this.finalC2,
      this.finalC3,
      this.finalC4,
      this.finalC5,
      this.finalC6,
      this.finalC7,
      this.finalC8,
      this.fillTranslucent,
      this.fAdj1,
      this.finalStroke,
      this.finalStrokeEmpty,
      this.finalStrokeEmpty2,
      this.finalStrokeEmpty3,
      this.flexer0,
      this.flexer1,
      this.filled
    );

    noFill();

    this.rotation = this.rotation + rotateAmount;
    ffCount = ffCount + 1;
    if (sBigS == 1 && ffCount >= round(totalRunsEst * 0.61)) {
      forwardON = 0;
    }
    if (forwardON == 0 && this.r >= increaser * (iterations * 0.2)) {
      this.r = this.r - increaser;
    } else if (
      forwardON == 1 ||
      (forwardON == 0 && this.r <= increaser * (iterations * 0.4))
    ) {
      this.r = this.r + increaser;
    }
    if (colorChange == "Inside Out") {
      if (this.flexer <= 0 || this.flexer >= 1) {
        this.fIncreaser = this.fIncreaser * -1;
      }
      this.flexer = this.flexer + this.fIncreaser;
      this.flexer1 = this.flexer;
      this.flexer0 = this.flexer;
    }
    this.counter++
  }

  checkLocation2() {
    
    if (noiseON == 1) {
      this.loc.x = random(width, width * 1.2);
      this.loc.y = random(height * -0.2, height * 1.2);
      // this.r = random(0, (this.counter/numWorms) * sizeAdjust);      /// change others to this? 
      this.r = random(0, ffCount / 40000*sizeAdjust);
 
    } else if (noiseON == 2) {
      this.loc.x = random(width * -0.2, width * 1.2);
      this.loc.y = random(height, height * 1.23);
      this.r = random(0, ffCount / 40000*sizeAdjust);
    } else if (noiseON == 3) {
      this.loc.x = random(width * -0.2, width * 1.2);
      this.loc.y = random(height * -0.2, height * 0);
      this.r = random(0, ffCount / 40000*sizeAdjust);
    } else if (noiseON == 4) {
      this.loc.x = random(-width / 8, 0);
      this.loc.y = random(height * -0.2, height * 1.2);
      this.r = random(0, ffCount / 40000*sizeAdjust);
    }

    if (symmetricalON == 1) {

      this.loc.x = random(0, width / 2);
      this.loc.y = random(0, height);
    } else if (symmetricalON == 2) {

      this.loc.y = random(0, height / 2);
      this.loc.x = random(0, width);
    } else if (symmetricalON == 3) {
      this.loc.y = random(0, height / 2);
      this.loc.x = random(0, width);
    }

    if (noiseON == 0) {
      let rando = random(0, 1);
      if (rando <= 0.25) {
        this.loc.x = random(width * -1.1, 0);
        this.loc.y = random(0, height);
      } else if (rando <= 0.5) {
        this.loc.x = random(width, width * 1.1);
        this.loc.y = random(0, height);
      } else if (rando <= 0.75) {
        this.loc.x = random(0, width);
        this.loc.y = random(height * -1.1, 0);
      } else if (rando <= 1) {
        this.loc.x = random(0, width);
        this.loc.y = random(height, height * 1.1);
      }
      this.r = this.hatchSize;
    } else if (frame == "Foreground" || frame == "Background/Foreground") {
      this.loc.x = constrain(this.loc.x, 0 + frameSizeW, width - frameSizeW);
      this.loc.y = constrain(this.loc.y, 0 + frameSizeH, height - frameSizeH);
    } else if (splitStyle == "None") {
      this.loc.x = constrain(this.loc.x, width * -0.1, width * 1.1);
      this.loc.y = constrain(this.loc.y, height * -0.1, height * 1.1);
    }
  }
}
