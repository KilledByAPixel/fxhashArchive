// these are the variables you can use as inputs to your algorithms
console.log(fxhash)   // the 64 chars hex number fed to your algorithm
//console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

function getBorder() {
  if (fxrand() > .99) return "None"
  if (fxrand() > .6) return "Narrow"
  return "Wide"
}

function getPalette() {
  if (fxrand() > .99) return "Hilma"
  if (fxrand() > .8) return "Gunta"
  if (fxrand() > .5) return "Sophie"
  return "Anni"
}

function getGrid() {
  if (fxrand() > .9) return false
  return true
}

function getCols() {
  return 4 + Math.floor(fxrand() * 9);
}

function getRows() {
  return 12 + Math.floor(fxrand() * 37);
}

window.$fxhashFeatures = {
  "Palette": getPalette(),
  "Border": getBorder(),
  "Show grid": getGrid(),
  "Columns": getCols(),
  "Rows": getRows(),
}


let sketch = function(p) {
  let pg;
  let width = p.min(p.windowHeight,p.windowWidth);
  let height = width;
  let margin = window.$fxhashFeatures["Border"] === "Wide" ? 1/15 * width : window.$fxhashFeatures["Border"] === "Narrow" ? 1/45 * width : 1/100 * width;

  let grid = {
    x: window.$fxhashFeatures["Columns"],
    y: window.$fxhashFeatures["Rows"]
  };
  
  let shapeCount = 24 + Math.floor(fxrand() * 25);
  let shapes = [];

  let palettes = [
    {
      name: "Anni",
      bgcolor: "rgb(215,202,176)",
      gridcolor: "rgb(140,126,107)",
      fillcolor: "rgb(190,177,157)",
      colors: ["rgb(104,103,107)","rgb(180,69,52)","rgb(50,49,47)","rgb(158,144,129)"],
    },

    {
      name: "Gunta",
      bgcolor: "rgb(225,222,211)",
      gridcolor: "rgb(128,128,132)",
      fillcolor: "rgb(201,188,189)",
      colors: ["rgb(30,26,39)","rgb(144,53,30)","rgb(170,173,196)","rgb(226,153,64)","rgb(152,149,140)","rgb(103,118,148)"],
    },

    {
      name: "Sophie",
      bgcolor: "rgb(234,221,189)",
      gridcolor: "rgb(78,61,37)",
      fillcolor: "rgb(202,180,120)",
      colors: ["rgb(37,35,31)","rgb(189,57,35)","rgb(200,139,74)","rgb(84,88,97)","rgb(191,118,83)"],
    },

    {
      name: "Hilma",
      bgcolor: "rgb(209,202,179)",
      gridcolor: "rgb(170,156,134)",
      fillcolor: "rgb(199,181,156)",
      colors: ["rgb(29,29,29)","rgb(110,47,35)","rgb(156,73,50)","rgb(203,168,91)","rgb(203,151,135)","rgb(208,202,192)","rgb(84,124,167)"],
    },

  ];

  let lineWidth = {
    min: width/400,
    max: width/200
  }


  let density = width / 1600;

  let paletteIndex = function(paletteName) {
    for (let i = 0; i < palettes.length; i++) {
      if (palettes[i].name === paletteName)
        return i;
    }
    return -1;
  }

  let palette = paletteIndex(window.$fxhashFeatures["Palette"]) ;

  // a shader variable
  let grainShader;
  let counter = 0;

  

  p.preload = function(){
    // load the shader
    grainShader = p.loadShader('shader.vert', 'shader.frag');
  }

  p.setup = function() {
    // disables scaling for retina screens which can create inconsistent scaling between displays
    p.pixelDensity(1);
  
    // shaders require WEBGL mode to work
    p.createCanvas(width, height, p.WEBGL);
    pg = p.createGraphics(width * p.pixelDensity(),height * p.pixelDensity());
    p.noStroke();
    p.noFill();

    generateShapes();
    restart();
  }

  p.draw = function() {  
    if (counter === 1) grainShader.setUniform('u_background', pg);
    
    drawGrain();
    counter++;
  }

  let lineSegment = function(x1,y1,x2,y2) {
    pg.stroke(deviate(currentColor,x1,y1));
    pg.strokeWeight(fxrand() * lineWidth.max + lineWidth.min);
    pg.line(x1,y1,x2,y2);
  }

  let lineLine = function(x1,y1,x2,y2) {
    let interruptions = [];
    let interruption_count = p.dist(x1,y1,x2,y2) / 10;
    let pos = 0;
    for (let i = 0; i < interruption_count-1; i++) {
      pos = p.random(pos,(i+1) / interruption_count);
      interruptions.push(pos);
    }

    if (interruptions.length == 0) {
      lineSegment(x1,y1,x2,y2);
      return;
    }

    lineSegment(x1,y1,p.lerp(x1,x2,interruptions[0]),p.lerp(y1,y2,interruptions[0]));
    for (let i = 0; i < interruptions.length; i++) {
      lineSegment(
        p.lerp(x1,x2,interruptions[i]),
        p.lerp(y1,y2,interruptions[i]),
        p.lerp(x1,x2,interruptions[i+1] - 0.0075),
        p.lerp(y1,y2,interruptions[i+1] - 0.0075)
      )
    }
    lineSegment(p.lerp(x1,x2,interruptions[interruptions.length-1]),p.lerp(y1,y2,interruptions[interruptions.length-1]),x2,y2);

  };

  let deviate = function(color,x,y) {
    let randVal = fxrand();
    newColor = p.color(0);
    newColor.setRed(color.levels[0] + (randVal - 0.5) * 10);
    newColor.setGreen(color.levels[1] + (randVal - 0.5) * 10);
    newColor.setBlue(color.levels[2] + (randVal - 0.5) * 10);
    newColor.setAlpha(randVal * 48 + 64);
    return newColor;
  };

  let generateShape = function() {
    let horizontal = fxrand() > .85;
    let vertical = horizontal ? false : fxrand() > .96;
    let thin = (vertical && grid.x > 6 && fxrand() > 0.5);

    let x1 = p.floor(fxrand() * (grid.x-1));
    let y1 = p.floor(fxrand() * (grid.y-1));

    let xOffset = vertical ? .125 : horizontal ? p.max(3,p.min(p.floor(fxrand() * (grid.x-x1)) + 1,p.floor(grid.x * 0.75))) : p.max(1,p.min(p.floor(fxrand() * (grid.x-x1)) + 1,4));
    let yOffset = horizontal ? 1 + p.floor(fxrand() * 2) : vertical ? p.max(4,p.min(p.floor(fxrand() * (grid.y-y1)) + 1,12)) : p.max(1,p.min(p.floor(fxrand() * (grid.y-y1)) + 1,3));

    if (thin) xOffset = 0.03125;

    let x3 = p.max(0,p.min(x1 + xOffset,grid.x));
    let y3 = p.max(0,p.min(y1 + yOffset,grid.y));

    let x2 = x3;
    let y2 = y1; 
    
    let x4 = x1;
    let y4 = y3;

    let color = randomColor()

    shapes.push({
      x1: x1,
      x2: x2,
      x3: x3,
      x4: x4,
      y1: y1,
      y2: y2,
      y3: y3,
      y4: y4,
      col: color
    });

    if (horizontal) {
      let repeatCount = 1 + p.floor(fxrand() * fxrand() * 12);
      for (let offset = 1; offset <= repeatCount; offset++) {
        if (y4 + offset * yOffset * 2 >= grid.y) return;
        shapes.push({
          x1: x1,
          x2: x2,
          x3: x3,
          x4: x4,
          y1: y1 + offset * yOffset * 2,
          y2: y2 + offset * yOffset * 2,
          y3: y3 + offset * yOffset * 2,
          y4: y4 + offset * yOffset * 2,
          col: color
        });
      }
    }

    if (vertical) {
      let repeatCount = 3 + p.floor(fxrand() * 2) * 4;
      let margin = thin ? 8 : 2;
      for (let offset = 1; offset <= repeatCount; offset++) {
        if (x4 + offset * xOffset * margin >= grid.x) return;
        shapes.push({
          x1: x1 + offset * xOffset * margin,
          x2: x2 + offset * xOffset * margin,
          x3: x3 + offset * xOffset * margin,
          x4: x4 + offset * xOffset * margin,
          y1: y1,
          y2: y2,
          y3: y3,
          y4: y4,
          col: color
        });
      }
    }

  };

  let randomColor = function() {
    let colors = palettes[palette].colors;
    return p.color(colors[p.floor(fxrand() * colors.length)]);
  }

  let generateShapes = function() {
    for (let i = 0; i < shapeCount; i++) {
      generateShape();  
    }
  }

  let convertXToPixels = function(x) {
    let canvasSize = width - 2 * margin;
    return margin + (x/grid.x) * canvasSize;
  } 

  let convertYToPixels = function(y) {
    let canvasSize = width - 2 * margin;
    return margin + (y/grid.y) * canvasSize;
  }

  let drawShape = function(i) {
    let s = shapes[i];
    currentColor = s.col;

    dist = p.dist(convertXToPixels(s.x1), convertYToPixels(s.y1), convertXToPixels(s.x4), convertYToPixels(s.y4));
    for (let j = 0; j < dist; j+=density) {
      let x1 = p.lerp(convertXToPixels(s.x1),convertXToPixels(s.x4), j/dist);
      let y1 = p.lerp(convertYToPixels(s.y1),convertYToPixels(s.y4), j/dist);
      let x2 = p.lerp(convertXToPixels(s.x2),convertXToPixels(s.x3), j/dist);
      let y2 = p.lerp(convertYToPixels(s.y2),convertYToPixels(s.y3), j/dist);

      lineLine(x1,y1,x2,y2);  
    }   
  }

  let drawShapes = function() {
    for (let i = 0; i < shapes.length; i++) {
      drawShape(i);
    }
  }

  let drawGrid = function() {
    let origLineWidth = lineWidth;
    lineWidth = {
      min: width/1000,
      max: width/2000
    }
    currentColor = p.color(palettes[palette].gridcolor);
    pg.strokeWeight(width/800);
    let canvasSize = width - 2 * margin;
    for (let x = 0; x <= grid.x; x++) {
      lineLine(margin + x/grid.x * canvasSize,margin,margin + x/grid.x * canvasSize,height-margin);
    }

    for (let y = 0; y <= grid.y; y++) {
      lineLine(margin,margin + y/grid.y * canvasSize,width-margin,margin + y/grid.y * canvasSize);
    }

    lineWidth = origLineWidth;
  }

  let drawFill = function() {
    currentColor = p.color(palettes[palette].fillcolor);
    for (let y = margin; y < height-margin; y += density) {
      lineLine(margin,y,width-margin,y);
    }
  }

  let drawGrain = function() {
    grainShader.setUniform('u_effect', .056);
    // shader() sets the active shader with our shader
    p.shader(grainShader);

    p.fill(0);
    p.noStroke();
    // rect gives us some geometry on the screen
    p.rect(0,0,width, height);
  }

  restart = function() {
    p.clear();
    counter = 0;
    p.resizeCanvas(width, height);
    pg = p.createGraphics(width * p.pixelDensity(),height * p.pixelDensity());
    pg.background(palettes[palette].bgcolor);

    drawFill();

    if (window.$fxhashFeatures["Show grid"]) drawGrid();
    drawShapes();
  };

  p.windowResized = function() {
    width = p.min(p.windowHeight,p.windowWidth);
    height = width;
    margin = window.$fxhashFeatures["Border"] === "Wide" ? 1/15 * width : window.$fxhashFeatures["Border"] === "Narrow" ? 1/45 * width : 1/100 * width;

    restart();
  };

};

new p5(sketch);