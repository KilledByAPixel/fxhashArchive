

class Decorator {
  constructor(canvas, cells, palette) {
    this.cells = cells
    this.canvas = canvas;
    this.palette = palette;
    this.colors = [];
    this.circleCount = 0;
    this.style;
    this.time;
    this.sky;
    this.chunks = [];
  }

  setStyle = (style) => {
    this.style = style;
  }

  setTime = (dayornight) => {
    this.time = dayornight;
  }

  fillRandomFromPalette = () => {
    for (let i = 0; i < this.getCellCount(); i++) {
      this.colors.push(this.palette.colors[intRandRange(0, this.palette.colors.length)]);
    }
  }

  
 addChaos = (amount)=>{
   this.cells.forEach(element=>{
     element.A.x += (intRandRange(-amount,amount))*width/1000;
     element.A.y += (intRandRange(-amount,amount))*width/1000;
     element.B.x += (intRandRange(-amount,amount))*width/1000;
     element.B.y += (intRandRange(-amount,amount))*width/1000;
     element.C.x += intRandRange(-amount,amount)*width/1000;
     element.C.y += intRandRange(-amount,amount)*width/1000;
     element.D.x += intRandRange(-amount,amount)*width/1000;
     element.D.y += intRandRange(-amount,amount)*width/1000;
   })
 }

  
  fillColorX = (c1=0,c2=40) => {

    this.cells.forEach(element => {


      if (element.center.x < width / 2) {
        element.color = color((map(element.center.x, 0, width / 2, c1, c2)), map(element.center.y, 0, height, 20, 100), map(element.center.y, height / 2, height, 100, 20));
      } else if (element.center.x > width / 2) {
        element.color = color((map(element.center.x, width / 2, width, c1+20, c2+20)), map(element.center.y, 0, height, 20, 100), map(element.center.y, height / 2, height, 100, 20));
      }

      //console.log(element.color)
    })
  }
  
  fillColorGenesis = (gd,c1,c2) => {

    this.cells.forEach(element => {


     if(gd==="td"){
        element.color = color((map(element.center.y, 0, height , c1, c2)), map(element.center.y, 0, height, 20, 100), map(element.center.y, height/2, height, 100, 20));
     }
     if(gd==="rl"){
      element.color = color((map(element.center.x, 0, width , c1, c2)), map(element.center.x, 0, width, 20, 100), map(element.center.y, height/2, height, 100, 20));
   }
      //console.log(element.color)
    })
  }
  


  fillColorGeneric = (dir = "rl", c1l = 0, c1h = 60, light = 100, dark = 0, satMin = 10, satMax = 90, sky = 0) => {
    this.sky = sky;
    this.cells.forEach(element => {

      switch (dir) {
        case "rl":
          if (element.center.x < width) {
            element.color = color((map(element.center.x, 0, width, c1l, c1h)), map(element.center.y, 0, height, satMin, satMax), map(element.center.y, height * sky, height, light, dark));
          };
          break;
        case "td":
          if (element.center.y < height) {
            element.color = color((map(element.center.y, 0, height, c1l, c1h)), map(element.center.y, 0, height, satMin, satMax), map(element.center.y, height * sky, height, light, dark));
          };
          break;

      }
    })
  }

  fillColorGenericSin = (dir = "rl", c1l = 0, c1h = 60, light = 100, dark = 0, satMin = 10, satMax = 90, sky = 0) => {
    this.sky = sky;
    this.cells.forEach(element => {

      switch (dir) {
        case "rl":
          if (element.center.x < width) {
            element.color = color((map(sin(element.center.x), -1, 1, c1l, c1h)), map(element.center.y, 0, height, satMin, satMax), map(element.center.y, height * sky, height, light, dark));
          };
          break;
        case "td":
          if (element.center.y < height) {
            element.color = color((map(sin(element.center.y), -1, 1, c1l, c1h)), map(element.center.y, 0, height, satMin, satMax), map(element.center.y, height * sky, height, light, dark));
          };
          break;

      }
    })
  }



  fillColorNight = (c1l = 0, c1h = 60, light = 100, dark = 0, sky = 0) => {
    this.sky = sky;
    this.cells.forEach(element => {


      if (element.center.x < width) {
        element.color = color((map(element.center.x, 0, width / 2, c1l, c1h)), map(element.center.y, 0, height, 100, 20), map(element.center.y, height * sky, height, dark, light));
      } else if (element.center.x > width / 2) {
        element.color = color((map(element.center.x, width / 2, width, c1l + 20, c1h + 20)), map(element.center.y, 0, height, 100, 20), map(element.center.y, height * sky, height, dark, light));
      }

      //console.log(element.color)
    })
  }

  fillColorDay = (c1l = 0, c1h = 60, light = 60, dark = 0, sky = 0.5,satMin=20,satMax=100) => {

    this.cells.forEach(element => {


      if (element.center.x < width) {
        element.color = color((map(element.center.x, 0, width *randRange(0.3,0.5), c1l, c1h)), map(element.center.y, 0, height, satMin, satMax), map(element.center.y, height * sky, height, light, dark));
      } else if (element.center.x > width / 2) {
        element.color = color((map(element.center.x, width *randRange(0.3,0.5), width, c1l + 20, c1h + 20)), map(element.center.y, 0, height, satMin, satMax), map(element.center.y, height * sky, height, light, dark));
      }

      //console.log(element.color)
    })
  }

  

  fillMonochromeDay = (c1l = 0, c1h = 60, light = 60, dark = 0, sky = 0.1) => {

    this.cells.forEach(element => {


      if (element.center.x < width / 2) {
        element.color = color((map(element.center.x, 0, width / 2, c1l, c1h)), 0, map(element.center.y, height * sky, height, light, dark));
      } else if (element.center.x > width / 2) {
        element.color = color((map(element.center.x, width / 2, width, c1l + 20, c1h + 20)), 0, map(element.center.y, height * sky, height, light, dark));
      }
    })
  }

  fillMonochromeNight = (c1l = 0, c1h = 60, light = 60, dark = 0, sky = 0.1) => {

    this.cells.forEach(element => {


      if (element.center.x < width / 2) {
        element.color = color((map(element.center.x, 0, width / 2, c1l, c1h)), 0, map(element.center.y, height * sky, height, light, dark));
      } else if (element.center.x > width / 2) {
        element.color = color((map(element.center.x, width / 2, width, c1l + 20, c1h + 20)), 0, map(element.center.y, height * sky, height, light, dark));
      }
    })
  }


  getCellCount = () => {
    return this.cells.length;
  }

  displayArea = () => {
    textFont(11 * f);

    fill(0)
    this.cells.forEach(element => {
      text((parseFloat(element.area).toFixed(3)), element.center.x, element.center.y + 20 * f)  //+","+parseFloat(element.ratio.yx).toFixed(1)
    })
  }

  displayArrayIndex = () => {
    textFont(11 * f);

    fill(0)
    this.cells.forEach((element, index) => {
      text((index), element.center.x, element.center.y)  //+","+parseFloat(element.ratio.yx).toFixed(1)
    })
  }
  displayRatio = () => {
    textFont(11 * f);

    fill(0)
    this.cells.forEach(element => {
      text((parseFloat(element.edgeLength.AB).toFixed(1)), element.center.x, element.center.y - element.edgeLength.BC * 0.45)  //+","+parseFloat(element.ratio.yx).toFixed(1)
      push()
      translate(element.center.x + element.edgeLength.AB * 0.5, element.center.y);
      rotate(PI / 2);
      text((parseFloat(element.edgeLength.BC).toFixed(1)), 0, 0)
      pop();
    })
  }



  #drawCells(f = true) {
    let m=1
    this.cells.sort();
    this.cells.forEach(element => {
      if (f === true) {
        element.color !== undefined ? fill(element.color) : noFill();
      } else noFill();
      fill(element.color)
     
      //rect(element.A.x-m*width/1000,element.A.y+m*width/1000,element.edgeLength.AB+m*width/1000,element.edgeLength.BC+m*width/1000)
      beginShape();
     
      vertex(element.A.x-m*width/1000, element.A.y-m*width/1000),
        vertex(element.B.x+m*width/1000, element.B.y-m*width/1000),
        vertex(element.C.x+m*width/1000, element.C.y+m*width/1000),
        vertex(element.D.x-m*width/1000, element.D.y+m*width/1000)
      vertex(element.A.x-m*width/1000, element.A.y-m*width/1000)
      endShape();
    });
  }


  displayDebugView(strokeColor, sw) {

    this.cells.forEach(element => {
      
      stroke(strokeColor)
    
      element.drawBorder(sw);
    })
  }
  paintCells() {

    for (let i = 0; i < this.getCellCount(); i++) {
      if (this.cells[i].color === undefined) {
        this.cells[i].color = this.colors[i]
      }

    }
    noStroke();
    this.#drawCells();

  const chunkSize = 10;
  
  
  }




  fillWithCircles(hasStroke = false, invertedStroke = false, black = false, surprise = true, surpriseColor,addMode = BLEND) {
    blendMode(addMode);
    this.cells.forEach(element => {

      if (!element.occupied) {
        if (element.ratio.xy > 0.9 && element.ratio.xy < 1.1 || (element.ratio.yx > 0.9 && element.ratio.yx < 1.1)) {

          let c;
          if (hasStroke === false) {
            noStroke()
          } else {
            if (invertedStroke) {
              stroke(invertHSB(element.color));
              strokeWeight((intRandRange(6, 12)) * width / 1000);
            } else stroke(0);
            strokeWeight((intRandRange(2, 4)) * width / 1000);
          } if (black === true) {
            c = color(0, 0, 0);
            fill(c);
          } if (black === false) {
            c = (this.palette.colors[intRandRange(0, this.palette.colors.length)]);
            fill(c)
          } if (black === true && hasStroke === true) {
            stroke(0);
            strokeWeight(intRandRange(1, 3) * width / 1000)
            noFill();


          }


          ellipse(element.center.x, element.center.y, element.edgeLength.AB * 0.85, element.edgeLength.AB * 0.85);

          element.occupied = true;
          if (surprise === true && element.color._getBrightness() < 50 && element.color._getBrightness() > 10 && this.time === "dayTime") {
            fill(surpriseColor)
            ellipse(element.center.x, element.center.y, element.edgeLength.AB * 0.35, element.edgeLength.AB * 0.35);
          }

          if (surprise === true && element.color._getBrightness() > 70 && this.time === "night") {
            fill(surpriseColor)
            ellipse(element.center.x, element.center.y, element.edgeLength.AB * 0.35, element.edgeLength.AB * 0.35);
          }

        }
     


        if (this.style === "monochrome" && this.time === "night") {
          if (element.ratio.xy > 0.4 && element.ratio.xy < 0.8 && !element.occupied && element.area < 0.05 && element.color._getBrightness() < 40) {

            fill(50, 0, 100)

            ellipse(element.center.x, element.center.y, element.edgeLength.AB * 0.85, element.edgeLength.AB * 0.85);


            element.occupied = true;

          }
        }
        else if (this.style === "monochrome" && this.time === "dayTime" && element.ratio.xy > 0.5 && element.ratio.xy < 0.7 && !element.occupied && element.area < 0.8 && element.color._getBrightness() > 80) {

          fill(50, 0, 0)

          ellipse(element.center.x, element.center.y, element.edgeLength.AB * 0.85, element.edgeLength.AB * 0.85);

          element.occupied = true;
        }

        if (this.style === "monochrome" && this.time === "dayTime" && element.area < 0.01 && element.color._getBrightness() < 30 && element.ratio.xy > 0.5 && element.ratio.xy < 0.9) {
          fill(0, 0, 100)
          ellipse(element.center.x, element.center.y, element.edgeLength.AB * 0.85, element.edgeLength.AB * 0.85);

          element.occupied = true;
        }


      }


    });
    blendMode(BLEND)
  }

  fillVerticalLines(ratio = 4, hasRect = true, hasRectStroke = false, hasGlitch = false, white = false, inverted = false) {
    let fillcolor;
    this.cells.forEach((element, index) => {
      if (element.ratio.xy > element.ratio.yx * ratio && !element.occupied) {

        randomSeed(seed)
        this.#verticalLines(element.A.x + 5 * f,
          element.A.y + 5 * f,
          element.B.x - 20 * f - element.cellIndex * f * 4,
          element.edgeLength.BC - 10 * f, map(element.ratio.xy, 0, 10, 1, 80), color(0, 0, 100))//inverted===true?fillcolor:invertColor(fillcolor))

        element.occupied = true;

      }
    })
  }

  fillHorizontalLines(addMode = true, dotAddMode = false, hasDots = true, lerpcolor = true, count = 20, maxHeight = 0.5,sw) {
    this.cells.forEach(element => {
      if (!element.occupied && element.center.y > height * maxHeight) {// if (!element.occupied && element.color._getBrightness() < 40) {
        let vBarRatio = 0
        let c = (varyColor(element.color, 20));
        //console.log(c)

        fill(c)
        stroke(c)
        //rect(element.A.x + (element.edgeLength.AB) * 0.15, element.A.y, (element.edgeLength.AB) * 0.70, element.edgeLength.BC)
      
        rect(element.A.x + (element.edgeLength.AB) * 0.15, element.A.y, (element.edgeLength.AB) * 0.70, element.edgeLength.BC)
        this.#horizontalLines(addMode, dotAddMode, hasDots, lerpcolor, element.A.x + (element.edgeLength.AB) * 0.15, element.A.y, element.C.y - vBarRatio * f, element.edgeLength.AB - element.edgeLength.AB * 0.30, map(element.ratio.yx, 0, 20, 1, count), lightenColor(element.color, 10), element.color,sw);
        element.occupied = true;
      }
    })
  }

  #horizontalLines(addMode, dotAddMode, hasDots, lerpcolor, xstart, ystart, yend, w, count, color1, color2,sw=1.5) {
    {
      let dt = 3
      let c;
      if (!lerpcolor) {
        c = color1;
      }

      randomSeed(seed)
      for (let i = ystart; i < yend; i += (yend - ystart) / count) {
        if (addMode) {
          blendMode(ADD)
        } else blendMode(BLEND)
        
        //blendMode(ADD)
        stroke(c);
        //stroke(0,0,100)
        strokeWeight(sw * width / 1000);
        let rand = random(5, 20);
        line(xstart, i + rand * w / 1000, xstart + w, i + rand * w / 1000);
        blendMode(BLEND)
        if (hasDots) {
          if (dotAddMode) blendMode(ADD);
          
          fill(varyColor(c, 50));
          ellipse(xstart, i + rand * w/1000, 2 * width/1000, 2 * width/1000);
          ellipse(xstart + w, i + rand * w/1000, 2 * width/1000, 2 * width/1000);
          blendMode(BLEND)
        }

      }
    }

  }

  #verticalLines(xstart, ystart, xend, height, count, color) {


    for (let i = xstart; i < xend; i += (xend - xstart) / count) {

      stroke(color);
      strokeWeight(random(0.5, 3) * f);
      let rand = 0 * f;
      line(i + rand, ystart, i + rand, ystart + height);
      noStroke();
    }
  }

  fillwithTriangles(addmode = BLEND) {
    randomSeed(seed);
    let br;
    blendMode(addmode)
    this.cells.forEach(element => {
      
      if (element.ratio.yx > 1 && element.ratio.yx < 1.5 && element.area < 0.4 && !element.occupied) {
        //this.#drawCell(this.color)

        let c1, c2;
        if (this.style === "monochrome" && this.time === "dayTime") {

          c1 = lightenColor(color(0, 0, 0), 10);
          c2 = lightenColor(color(0, 0, 0), 20);


        } else if (this.style === "monochrome" && this.time === "night") {
          c1 = (color(0, 0, 100));
          c2 = (color(0, 0, 100));;
        }
        else {
          c1 = this.palette.colors[(intRandRange(0, this.palette.colors.length))];
          c2 = this.palette.colors[(intRandRange(0, this.palette.colors.length))];
        }
        
        let triangleRatio = intRandRange(2, 9);
        fill(c1);
        noStroke();
        triangle(element.A.x + (element.B.x - element.A.x) / 2, element.A.y + (element.C.y - element.A.y) / triangleRatio, element.C.x, element.C.y, element.D.x, element.D.y);
        fill(c2);
        triangle(element.A.x + (element.B.x - element.A.x) / 2, element.A.y + (element.C.y - element.A.y) / triangleRatio, element.A.x, element.A.y, element.B.x, element.B.y);
        element.occupied = true;
      }

    })
    blendMode(BLEND)
  }

  makeChunks(){
    const chunkSize = 10;
    
    for (let i = 0; i < this.cells.length; i += chunkSize) {
      this.chunks.push(this.cells.slice(i, i + chunkSize));
    }
  console.log(this.chunks)
  }

noFeature=()=>{
  let sCells = [];
  this.cells.forEach(element=>{
    if (element.ratio.xy > 0.9 && element.ratio.xy < 1.1 || (element.ratio.yx > 0.9 && element.ratio.yx < 1.1) && element.area>1) {
    sCells.push(element);
    }
  })
  console.log(sCells)
  let e = sCells[0];
  console.log(e)
  fill(0)
  circle(e.center.x,e.center.y,min(e.edgeLength.AB,e.edgeLength.BC)*width/1000)
  // blendMode(ADD);
  // stroke(this.palette[intRandRange(0,this.palette.length)]);
  // drawCircle(e,min(e.edgeLength.AB,e.edgeLength.BC),8);
  // blendMode(BLEND);

}

}




//applyDrawingRules() {







// if(!this.occupied && this.ratio.xy>this.ratio.yx*2){

//   //this.drawCell(this.color)
//  // this.drawCell(settings.unOccupiedColors.colors[Math.floor(random(0,settings.unOccupiedColors.colors.length))])

//   if(this.ratio.xy>this.ratio.yx){

//     if(settings.isUODotColored){
//       let color = settings.unOccupiedColors.colors[(intRandRange(0,settings.unOccupiedColors.colors.length))]
//     if(settings.isUODotFilled){
//       fill(color)
//     }else{
//       stroke(color);
//       strokeWeight(3*f)
//       noFill();
//     }
//     }else{
//       if(settings.isUODotFilled){
//         fill(0,0,0);
//       }else{
//         stroke(0,0,0);
//         strokeWeight(3*f);
//       }

//    }

//     ellipse(this.center.x,this.center.y,this.edgeLength.BC*width*0.8,this.edgeLength.BC*height*0.8)
//   }

// }


//}

let surpiseColor = () => {
  let r = intRandRange(0, 2);
  sc = r < 1 ? color(45, 80, 70) : color(0, 80, 70);
  return sc;
}

let drawCircle = (element,size,level)=>{
  noFill();
  ellipse(element.center.x,element.center.y,size-level*10*width/1000,size-level*10*width/1000);
  if(level>1){
    level--;
    drawCircle(size,level)
    
  }
}