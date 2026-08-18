let selectedPalette, selectedFormat, selectedGrid;

let palettes = [
  {name: "Møller",                   chance: 19},
  {name: "Jacobsen",                 chance: 19},
  {name: "Chamberlin, Powell & Bon", chance: 19},
  {name: "Asplund",                  chance: 14},
  {name: "Le Corbusier",             chance: 14},
  {name: "Wohlert",                  chance: 14},
  {name: "Niemeyer",                 chance: 14},
  {name: "Aalto",                    chance: 14},
  {name: "Archigram",                chance: 5},
  {name: "Superstudio",              chance: 5},
  {name: "Saarinen",                 chance: 5},
  {name: "Engh",                     chance: 8},
  {name: "Ando",                     chance: 14},
  {name: "Fehn",                     chance: 14},
  {name: "Viksjø",                   chance: 14},
  {name: "Breuer",                   chance: 14},
  {name: "Moholy-Nagy",              chance: 12},
  {name: "Mies van der Rohe",        chance: 14},
  {name: "Eikvar & Engebretsen",     chance: 12},
  {name: "Taut",                     chance: 7},
  {name: "Gropius",                  chance: 14},
  {name: "Korsmo",                   chance: 12},
  {name: "Lewerentz",                chance: 19},
  {name: "Wright",                   chance: 12},
  {name: "Price",                    chance: 12},
];

let formats = [
  {name: "A4 portrait",  chance: 95},
  {name: "A3 portrait",  chance: 95},
  {name: "A4 landscape", chance: 12},
  {name: "A3 landscape", chance: 12},
  {name: "30 × 30 cm",   chance: 25},
  {name: "40 × 40 cm",   chance: 25},
  {name: "20 × 40 cm",   chance: 50},
  {name: "40 × 80 cm",   chance: 6},
];

let grids = [
  {name: "Regular",   chance: 160},
  {name: "Silver",    chance: 60},
  {name: "Golden",    chance: 60},
  {name: "Irregular", chance: 40},
];

let chooseFeature = function(feature) {
    let chances = [];

    for (let i = 0; i < feature.length; i++)
        chances[i] = feature[i].chance + (chances[i - 1] || 0);
    
    let r = fxrand() * chances[chances.length - 1];
    
    for (let i = 0; i < chances.length; i++)
        if (chances[i] > r)
            return i;
}

let getFormat = function() {
  selectedFormat = chooseFeature(formats);
  return formats[selectedFormat].name;
}

let getPalette = function() {
  selectedPalette = chooseFeature(palettes);
  return palettes[selectedPalette].name;
}

let getGrid = function() {
  selectedGrid = chooseFeature(grids);
  return grids[selectedGrid].name;
}

window.$fxhashFeatures = {
  "Format": getFormat(),
  "Palette": getPalette(),
  "Grid": getGrid(),
  "Show grid": fxrand() > .1,
  "Texture": fxrand() > .15 ? "varied" : "uniform",
}

let sketch = function(p) {
  let pg, ps, width, height, noise_scale, darkNoise, lightNoise, rowHeight, roundFactors, roundFactor, currentPalette, currentFormat, currentGridType, currentColor;
  let rows = [];
  let shapes = [];
  let lines = [];
  let rands = [];

  let sizeMultiplier = 1;
  let shapeDensity = 4 * sizeMultiplier;
  let shapeStrokeWeight = 3.2 * sizeMultiplier;
  let waveStrokeWeight = 5 * sizeMultiplier;
  let shapeStrokeOffsetRand = .01;
  let interruptionSize = 6 * sizeMultiplier;
  let maxInterruptionSize = 10 * sizeMultiplier;
  let minInterruptionSize = 0 * sizeMultiplier;

  let roundFactorPerShape = fxrand() > .6;
  let mirrored = fxrand() > .5;
  let mirrorPerShape = fxrand() > .9;
  let interruptionSizePerShape = true;
  let doDrawLines = window.$fxhashFeatures["Show grid"];
  let variateFillType = window.$fxhashFeatures["Texture"] === "varied";

  let zoomFactor;
  let randCount = 0;   
  let grainShader;
  let useShader = true;
  let fxhashCode;
  let faintLines = false;
  let exportPrint = false;
  
  let palettes = [
    {
      name: "Møller",
      bgColor: "#F1F0E6",
      lineColor: "#000",
      colors: ["#000","#FFF", "rgba(245,173,25,1)"]
    },
    {
      name: "Jacobsen",
      bgColor: "#E5E4D9",
      lineColor: "#000",
      colors: ["#000","#000","#FFF","#20658B","#20658B"]
    },
    {
      name: "Chamberlin, Powell & Bon",
      bgColor: "#EAEAE3",
      lineColor: "#000",
      colors: ["#000","#000","#000","#E46A11","#E46A11","#FFF"]
    },
    {
      name: "Asplund",
      bgColor: "#F9EBE5",
      colors: ["#FEFCFB","#FEFCFB","#F3BDA5","#E77B4B","#B44818","#2D1206","#000","#000",],
      lineColor: "#2D1206",
    },
    {
      name: "Le Corbusier",
      bgColor: "#3E3D3C",
      colors: ["#FFF","#FBEDCA","#5E81A0","#BA4038","#2D1A0E","#D67E50","#729CAE","#000"],
      lineColor: "#2D1206",
    },
    {
      name: "Wohlert",
      bgColor: "#ECE1C4",
      colors: ["#B2AEA1","#88542C","#7C3F1C","#010000","#A27444","#582210"],
      lineColor: "#231D18",
    },
    {
      name: "Niemeyer",
      bgColor: "#F7FFFF",
      colors: ["#F7FFFF","#B6D4EF","#77809B","#1A1A16"],
      lineColor: "#ccc",
    },
    {
      name: "Aalto",
      bgColor: "#F6F6F7",
      colors: ["#010000","#000013","#000013","#3A393A","#D9D9D9","#FFFFFF"],
      lineColor: "#4D4C4D",
    },
    {
      name: "Archigram",
      bgColor: "#F6DB4B",
      colors: ["#F6F5EB","#1A1910"],
      lineColor: "#4D4C4D",
    },
    {
      name: "Superstudio",
      bgColor: "#397369",
      colors: ["#E2534B","#CDC0B4","#091515"],
      lineColor: "#316A5C",
    },
    {
      name: "Saarinen",
      bgColor: "#D04525",
      colors: ["#FCF8E6","#FCF8E6","#D04525","#FFF"],
      lineColor: "#C53419",
    },
    {
      name: "Engh",
      bgColor: "#1D4154",
      lineColor: "#85B6CB",
      colors: ["#0F1E26","#fff","#447E9D"],
    },
    {
      name: "Ando",
      bgColor: "#F9F7F6",
      lineColor: "#faf3f1",
      colors: ["#EBAE5E", "#EBAE5E", "#888FA2","#888FA2","#000","#000","#000","#FFF","#FFF"]
    },
    {
      name: "Fehn",
      bgColor: "#242A24",
      colors: ["#46594D","#95ADB6","#DFE3C8","#1F2621","#B9A35B"],
      lineColor: "#FAFAFA",
    },
    {
      name: "Viksjø",
      bgColor: "#D4CBB2",
      colors: ["#E9E5CA","#0E0C04","#1C1910","#C7C5B2","#6C6C61"],
      lineColor: "#FAFAFA",
    },
    {
      name: "Breuer",
      bgColor: "#01232E",
      lineColor: "#01323A",
      colors: ["#EBF0F1","#EBF0F1","#01232E","#EDCA4E"],
    },
    {
      name: "Moholy-Nagy",
      bgColor: "#1E1D1C",
      lineColor: "#191817",
      colors: ["#75322C","#2E2223","#A44136","#B05937","#C6885A","#51494E"],
    },
    {
      name: "Mies van der Rohe",
      bgColor: "#F7E5CB",
      lineColor: "#474035",
      colors: ["#111118","#766750","#F67A3B","#FDEDCD"],
    },
    {
      name: "Eikvar & Engebretsen",
      bgColor: "#11171C",
      lineColor: "#11171C",
      colors: ["#000000","#FFFFFF", "#221A21", "#254572", "#8C9FBD", "#B5531D"]
    },
    {
      name: "Taut",
      bgColor: "#3D080B",
      lineColor: "#000",
      colors: ["#8C2517","#AD3626","#D04525"]
    },
    {
      name: "Gropius",
      bgColor: "#4F586A",
      lineColor: "#000",
      colors: ["#000","#000","#FFF","#FFF","#263148"]
    },
    {
      name: "Korsmo",
      bgColor: "#11171C",
      lineColor: "#000",
      colors: ["#A0A5A5", "#EBAE5E", "#EBAE5E", "#888FA2","#888FA2","#F9F7F6","#000"],
    },
    {
      name: "Lewerentz",
      bgColor: "#D2D3C3",
      lineColor: "#1D1C18",
      colors: ["#1D1C18","#FFF","#15422D","#386952"]
    },
    {
      name: "Wright",
      bgColor: "#13100F",
      lineColor: "#D1CFC9",
      colors: ["#13100F","#FBFAF4","rgba(245,173,25,1)"]
    },
    {
      name: "Price",
      bgColor: "#13100F",
      lineColor: "#D1CFC9",
      colors: ["#faf3f1","#13100F","#FFF"]
    },
  ];

  let formats = [
    {
      name: "A4 portrait",
      width: 2480,
      height: 3508,
      zoomFactor: 1,
      margin: 1/9,
      gridTop: 16/100,
      gridBottom: 88/100,
      rows: fxrand() > .5 ? 6 : 8,
      shapeMinWidth: 0.3,
      shapeMaxWidth: 0.8,
      shapeStartUntil: 0.5,
      shapeMinCount: 5,
      shapeMaxCount: 10,
    },
    {
      name: "A3 portrait",
      width: 3508,
      height: 4960,
      zoomFactor: .5,
      margin: 1/9,
      gridTop: 16/100,
      gridBottom: 88/100,
      rows: fxrand() > .5 ? 6 : 8,
      shapeMinWidth: 0.3,
      shapeMaxWidth: 0.8,
      shapeStartUntil: 0.5,
      shapeMinCount: 5,
      shapeMaxCount: 10,
    },
    {
      name: "A4 landscape",
      width: 3508,
      height: 2480,
      zoomFactor: 1,
      margin: 1/12,
      gridTop: 17/100,
      gridBottom: 86/100,
      rows: 6,
      shapeMinWidth: 0.2,
      shapeMaxWidth: 0.6,
      shapeStartUntil: 0.65,
      shapeMinCount: 7,
      shapeMaxCount: 13,
    },
    {
      name: "A3 landscape",
      width: 4960,
      height: 3508,
      zoomFactor: .5,
      margin: 1/12,
      gridTop: 17/100,
      gridBottom: 86/100,
      rows: 6,
      shapeMinWidth: 0.2,
      shapeMaxWidth: 0.6,
      shapeStartUntil: 0.65,
      shapeMinCount: 7,
      shapeMaxCount: 13,
    },
    {
      name: "30 × 30 cm",
      width: 3543,
      height: 3543,
      zoomFactor: 1,
      margin: 1/12,
      gridTop: 16/100,
      gridBottom: 88/100,
      rows: 6,
      shapeMinWidth: 0.3,
      shapeMaxWidth: 0.6,
      shapeStartUntil: 0.6,
      shapeMinCount: 5,
      shapeMaxCount: 11,
    },
    {
      name: "40 × 40 cm",
      width: 4724,
      height: 4724,
      zoomFactor: .5,
      margin: 1/12,
      gridTop: 16/100,
      gridBottom: 88/100,
      rows: 6,
      shapeMinWidth: 0.3,
      shapeMaxWidth: 0.6,
      shapeStartUntil: 0.6,
      shapeMinCount: 5,
      shapeMaxCount: 11,
    },
    {
      name: "20 × 40 cm",
      width: 2362,
      height: 4724,
      zoomFactor: 1,
      margin: 1/10,
      gridTop: 10/100,
      gridBottom: 92/100,
      rows: 12,
      shapeMinWidth: 0.3,
      shapeMaxWidth: 0.65,
      shapeStartUntil: 0.55,
      shapeMinCount: 4,
      shapeMaxCount: 6,
    },
    {
      name: "40 × 80 cm",
      width: 4724,
      height: 9448,
      zoomFactor: .5,
      margin: 1/10,
      gridTop: 10/100,
      gridBottom: 92/100,
      rows: 12,
      shapeMinWidth: 0.3,
      shapeMaxWidth: 0.65,
      shapeStartUntil: 0.55,
      shapeMinCount: 4,
      shapeMaxCount: 6,
    },
  ];

  let LCG = function(a) {
    a = Math.imul(48271, a) | 0 % 2147483647
    return (a & 2147483647) / 2147483648
  };

  let hashCode = function(s){
    return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }

  let mrand = function(min,max) {
    if (min > max) {
      let temp = min;
      min = max;
      max = temp;
    }
    return min + fxrand() * (max-min);
  }

  let rand = function(min, max) {
    randCount++;
    if (rands[randCount]) {
      return rands[randCount];
    }

    let result;
    if (min !== undefined && max !== undefined) {
      result = min + fxrand() * (max-min);
    } else {
      result = fxrand();
    }
    rands.push(result);
    return result;
  }

  let autoZoom = function() {
    zoomFactor = currentFormat.zoomFactor;
    return;
  }

  p.preload = function(){
    grainShader = p.loadShader('shader.vert', 'shader.frag');
  }
  
  p.setup = function() {
    console.log("Elevation");
    console.log("Generative artwork by Andreas Rau · Oslo, 2022");
    console.log("All rights reserved · Using the p5.js library");
    console.log("---");
    console.log("fx(hash)",fxhash);
    console.log(window.$fxhashFeatures);

    currentPalette = palettes[selectedPalette];
    currentFormat = formats[selectedFormat];

    p.pixelDensity(1);
    p.noSmooth();

    autoZoom();

    width = currentFormat.width;
    height = currentFormat.height;
    currentFormat.margin = currentFormat.width * currentFormat.margin;
    currentFormat.gridTop = currentFormat.height * currentFormat.gridTop;
    currentFormat.gridBottom = currentFormat.height * currentFormat.gridBottom;
    roundFactors = [currentFormat.width / 4.25, currentFormat.width / 7, currentFormat.width / 2.5,currentFormat.width / 2.5];
    roundFactor = roundFactors[p.floor(fxrand() * roundFactors.length)];
    currentGridType = window.$fxhashFeatures["Grid"];

    rowHeight = (currentFormat.gridBottom-currentFormat.gridTop) / (currentFormat.rows-1);
    noise_scale = currentFormat.width * .5;

    pg = p.createGraphics(width * zoomFactor,height * zoomFactor);
    pg.id('elevation');
    ps = p.createGraphics(width*zoomFactor,height*zoomFactor,p.WEBGL);  
    
    p.noiseSeed(fxrand() * 62259);
    fxhashCode = hashCode(fxhash);

    p.noiseDetail(2, .5);

    let totalHeight = currentFormat.gridBottom-currentFormat.gridTop;
    let pos = 0;
    rows.push(currentFormat.gridTop);

    let ratio = currentGridType == "Golden" ? 1.61803398875 : Math.sqrt(2);
    let largePortion = totalHeight / ratio;
    let smallPortion = totalHeight - largePortion;

    let numberOfSmallRows = currentFormat.rows / 3;
    let smallSize = smallPortion / numberOfSmallRows;
    let largeSize = currentGridType == "Golden" ? largePortion / (currentFormat.rows-numberOfSmallRows-2) : largePortion / (currentFormat.rows-numberOfSmallRows-2+p.round(fxrand()));

    for (let i = 1; i < currentFormat.rows-1; i++) {
      if (currentGridType == "Golden" || currentGridType == "Silver") {
        if (i <= numberOfSmallRows)
          rows.push(currentFormat.gridTop + smallSize * i);
        else 
          rows.push(currentFormat.gridTop + numberOfSmallRows * smallSize + largeSize * (i-numberOfSmallRows));
        continue;
      } else if (currentGridType == "Regular") {
        rows.push(currentFormat.gridTop + i * rowHeight)
        continue;
      } else {
        pos = p.max(pos+1/(currentFormat.rows*2),fxrand() * ((i+1) / currentFormat.rows - pos) + pos);
        let h = currentFormat.gridTop + pos * totalHeight;
        rows.push(h);
      }
    }

    rows.push(currentFormat.gridTop + totalHeight);

    p.noStroke();
    p.noFill();
  
    generateShapes();
    generateLines();
  };

  let restart = function() {
    document.getElementById("load").classList.remove("hidden");
    randCount = -1;
    pg.clear();
    pg.resizeCanvas(currentFormat.width * zoomFactor, currentFormat.height * zoomFactor);
    pg.background(currentPalette.bgColor);

    if (useShader) {
      ps.clear();
      ps.resizeCanvas(currentFormat.width * zoomFactor, currentFormat.height * zoomFactor);
      ps.background(currentPalette.bgColor);
    }
    
    drawShapes();
    if (doDrawLines)
      drawLines();

    if (isFxpreview)
      fxpreview();

    if (exportPrint)
      pg.save('Elevation '+currentFormat.name+' 300dpi '+fxhash+'.png');
    else
      render();
  };

  let generateNoise = function() {
    let reduceSize = 6;
    let maxDeviation = 20;
    let w = (currentFormat.width)/reduceSize;
    let h = (currentFormat.height)/reduceSize;
    darkNoise = p.createGraphics(w,h);
    lightNoise = p.createGraphics(w,h);

    darkNoise.image(pg,0,0,w,h);
    lightNoise.image(pg,0,0,w,h);

    darkNoise.loadPixels();
    for (let i = 0; i < darkNoise.pixels.length-4; i+=4) {
      let deviate = (LCG(p.noise(i * 43625.3467) * fxhashCode * 852.26))*maxDeviation-maxDeviation/2;
      darkNoise.pixels[i] = darkNoise.pixels[i] + deviate;
      darkNoise.pixels[i+1] = darkNoise.pixels[i+1] + deviate;
      darkNoise.pixels[i+2] = darkNoise.pixels[i+2] + deviate;
    }
    darkNoise.updatePixels();
    lightNoise.loadPixels();
    for (let i = 0; i < lightNoise.pixels.length-4; i+=4) {
      let deviate = (LCG(p.noise(i * 6302.2927) * fxhashCode * 298.26))*maxDeviation-maxDeviation/2;
      lightNoise.pixels[i] = lightNoise.pixels[i] + deviate;
      lightNoise.pixels[i+1] = lightNoise.pixels[i+1] + deviate;
      lightNoise.pixels[i+2] = lightNoise.pixels[i+2] + deviate;
    }
    lightNoise.updatePixels();
  }

  let renderShader = function(targetCanvas, targetShader) {
    targetCanvas.shader(targetShader);
    if (!darkNoise) {
      generateNoise();
    }
    
    targetShader.setUniform('u_background', pg);
    targetShader.setUniform('u_noisebg', darkNoise);
    targetShader.setUniform('u_noisebgb', lightNoise);
    targetShader.setUniform('u_effect', .04 * zoomFactor);
    targetShader.setUniform('u_largeNoise', 0.15);
    targetShader.setUniform('u_rand', fxhashCode * 0.00063);

    targetCanvas.fill(0);
    targetCanvas.noStroke();
    targetCanvas.rect(0,0,targetCanvas.width, targetCanvas.height);
  }

  let render = function() {    
    if (useShader) {
      if (!(currentFormat == formats[7] && zoomFactor == 1)) {
        renderShader(ps, grainShader);
        pg.image(ps,0,0,currentFormat.width*zoomFactor,currentFormat.height*zoomFactor);
      }
    }

    let cc = document.getElementById('elevation');
    let ii = cc.toDataURL('image/png')
    let lengthText = ii.length === 6 ? ii.length + " " + ii : ii.length;
    document.getElementById("result").src = ii;
    document.getElementById("load").classList.add("hidden");
  };

  let randomColor = function() {
    let index = p.floor(fxrand() * currentPalette.colors.length);
    return p.color(currentPalette.colors[index]);
  };

  let lineSegment = function(x1,y1,x2,y2) {
    pg.stroke(deviate(currentColor,x1,y1));
    pg.line(x1 * zoomFactor,y1 * zoomFactor,x2 * zoomFactor,y2 * zoomFactor);
  }

  let lineLine = function(x1,y1,x2,y2) {
    
    let interruptions = [];
    let dist = p.dist(x1,y1,x2,y2);
    let interruption_count = dist / 12;
    let pos = 0;
    let distanceBetweenLineSegments = interruptionSizePerShape ? p.max(minInterruptionSize/dist,p.min(maxInterruptionSize/dist,0.0075)) : interruptionSize/dist
    for (let i = 0; i < interruption_count-1; i++) {
      pos = p.max(distanceBetweenLineSegments,rand(pos,(i+1) / interruption_count));
      interruptions.push(pos);
    }

    lineSegment(x1,y1,p.lerp(x1,x2,interruptions[0]),p.lerp(y1,y2,interruptions[0]),0);
    for (let i = 0; i < interruptions.length; i++) {
      lineSegment(
        p.lerp(x1,x2,interruptions[i]),
        p.lerp(y1,y2,interruptions[i]),
        p.lerp(x1,x2,interruptions[i+1] - distanceBetweenLineSegments), 
        p.lerp(y1,y2,interruptions[i+1] - distanceBetweenLineSegments)
      )
    }
    lineSegment(p.lerp(x1,x2,interruptions[interruptions.length-1]),p.lerp(y1,y2,interruptions[interruptions.length-1]),x2,y2,1);

  };

  let deviate = function(color,x,y,forceVariateAlpha) {
    let noiseVal = p.noise(x/noise_scale*.1,y/noise_scale*.1);
    newColor = p.color(0);
    
    newColor.setRed(color.levels[0] + (noiseVal - 0.5) * 80);
    newColor.setGreen(color.levels[1] + (noiseVal - 0.5) * 80);
    newColor.setBlue(color.levels[2] + (noiseVal - 0.5) * 80);
    newColor.setAlpha(interruptionSizePerShape ? 255 : rand(200,255));
  
    if (faintLines) {
      newColor.setAlpha(rand(55,75));
    }

    noiseVal = p.noise(x/noise_scale*18,y/noise_scale*18);
    if (noiseVal < .025)
      newColor.setAlpha(128);
    return newColor;
  };

  let drawArc = function(midpoint, radius, startAngle, endAngle, offset) {
    startAngle -= p.PI/2;
    endAngle -= p.PI/2;

    let a = startAngle;
    let stepSize = 0.1;

    while (a <= endAngle) {
      let x = midpoint.x - p.sin(a) * radius;
      let y = midpoint.y + p.cos(a) * radius;

      pg.vertex(x+offset,y+offset);

      a += stepSize;
    }
  }

  let generateRoundedCorner = function(p1,pm,p2,r,offset) {
    let angle = p.atan2(pm.y-p1.y, pm.x-p1.x) - p.atan2(pm.y-p2.y, pm.x-p2.x);
    let segment = r / p.abs(p.tan(angle / 2));
    let pp1 = p.dist(pm.x,pm.y,p1.x,p1.y);
    let pp2 = p.dist(pm.x,pm.y,p2.x,p2.y);
    let min = p.min(pp1,pp2);
    if (segment > min) {
      segment = min;
      r = segment * p.abs(p.tan(angle/2));
    }

    let po = Math.sqrt(r * r + segment * segment);

    let c1 = p.createVector();
    c1.x = pm.x - (pm.x - p1.x) * segment / pp1;
    c1.y = pm.y - (pm.y - p1.y) * segment / pp1;

    let c2 = p.createVector();
    c2.x = pm.x - (pm.x - p2.x) * segment / pp2;
    c2.y = pm.y - (pm.y - p2.y) * segment / pp2;

    let c = p.createVector();
    c.x = c1.x + c2.x - pm.x;
    c.y = c1.y + c2.y - pm.y;

    let pc = p.dist(pm.x,pm.y,c.x,c.y);
    let dx = pm.x - c.x;
    let dy = pm.y - c.y;

    let o = p.createVector();
    o.x = pm.x - dx * po / pc;
    o.y = pm.y - dy * po / pc;

    let startAngle = p.atan2((c1.y-o.y), (c1.x-o.x));
    let endAngle = p.atan2((c2.y-o.y), (c2.x-o.x));


    let sweepAngle = endAngle - startAngle;
    if (sweepAngle < 0) {
      sweepAngle = -sweepAngle;
      startAngle = endAngle;
      endAngle = startAngle + sweepAngle;
    }

    if (sweepAngle > p.PI) {
      startAngle = startAngle + sweepAngle;
      sweepAngle = 2 * p.PI - sweepAngle;
      endAngle = startAngle + sweepAngle;
    }

    
    drawArc(o,r,startAngle,endAngle,offset)
  }

  let waveLine = function(x,y1,y2) {
    let t = 0;
    let t1 = 1;

    let step = 0.01 * sizeMultiplier + rand(-1,1) / (900/sizeMultiplier)
    while (t < t1) {
      let y = p.lerp(y1,y2,t/t1);
      pg.point(x * zoomFactor,y * zoomFactor);
      t += step;
    }
  }

  let generateShapes = function() {
    for (let row = 1; row < currentFormat.rows; row+=2) {

      let popStart = (fxrand() + 0.2) * p.noise(row) * (0.4 * (1-(row+1)/currentFormat.rows));
      let popEnd = popStart;

      let populationStart = popStart * (currentFormat.width-2*currentFormat.margin);
      let populationEnd = popEnd * (currentFormat.width-2*currentFormat.margin);

      for (let i = 0; i < currentFormat.shapeMinCount + fxrand() * (currentFormat.shapeMaxCount-currentFormat.shapeMinCount); i++) {

        p.noiseSeed(fxrand() * 946832);

        let p1 = p.createVector(
          currentFormat.margin + populationStart + fxrand() * (currentFormat.width-2*currentFormat.margin-populationStart-populationEnd) * currentFormat.shapeStartUntil,
          rows[row]
        );

        let p3 = p.createVector(
          p.min(p1.x + mrand((currentFormat.width-2*currentFormat.margin) * currentFormat.shapeMinWidth,(currentFormat.width-2*currentFormat.margin) * currentFormat.shapeMaxWidth),currentFormat.width-currentFormat.margin-populationEnd),
          rows[row]
        );
        let p2 = p.createVector(
          mrand(p1.x + currentFormat.margin/7,p3.x - currentFormat.margin/7),
          p.max(currentFormat.gridTop - rowHeight * 0.1,rows[row] - mrand(0.2 * rowHeight,1.5*rowHeight))
        );

        let shape = {
          fillType: variateFillType ? p.floor(fxrand() * 3 + 0) : 1,
          cornerRadius: mrand(2,4),
          sinOffset: mrand(-width * 0.1,width * 0.1),
          color: randomColor(),
          mirrored: mirrorPerShape ? fxrand() > .5 : mirrored,
          roundFactor: roundFactorPerShape ? roundFactors[p.floor(fxrand() * roundFactors.length)] : roundFactor,
          p1: p1,
          p2: p2,
          p3: p3,
        };

        if (shape.fillType === 0 && fxrand() > .0) {
          shape.fillType = 1
        }

        shapes.push(shape);
      }
    }  
  }

  let drawShapes = function() {
    for (let shape = 0; shape < shapes.length; shape++) {

      pg.strokeWeight(shapeStrokeWeight * zoomFactor);
    
      pg.noFill();
      p.noiseSeed(rand() * 32359)

      currentColor = shapes[shape].color;
      pg.stroke(currentColor);

      let offset = shapeDensity;

      for (let x = shapes[shape].p1.x; x < shapes[shape].p3.x; x+=offset + rand() * shapeStrokeOffsetRand) {
        let y;
        if (x < shapes[shape].p2.x) {
          y = p.min(currentFormat.gridBottom + rowHeight/10,p.min(currentFormat.gridBottom,p.max(currentFormat.gridTop,p.lerp(shapes[shape].p1.y,shapes[shape].p2.y,x / (shapes[shape].p2.x-shapes[shape].p1.x)))) + p.sin(x / shapes[shape].roundFactor+shapes[shape].sinOffset) * rowHeight/2);
        } else {
          y = p.min(currentFormat.gridBottom + rowHeight/10,p.min(currentFormat.gridBottom,p.max(currentFormat.gridTop,p.lerp(shapes[shape].p2.y,shapes[shape].p3.y,x / (shapes[shape].p3.x-shapes[shape].p2.x)))) + p.sin(x / shapes[shape].roundFactor+shapes[shape].sinOffset) * rowHeight/2);
        }
        let maxDeviation = 0;
        let xPos = shapes[shape].mirrored ? currentFormat.width-x : x;


        if (shapes[shape].fillType == 0) {
          pg.line(xPos * zoomFactor,shapes[shape].p1.y * zoomFactor,xPos * zoomFactor,y * zoomFactor);
        } else if (shapes[shape].fillType == 1) {          
          lineLine(xPos, shapes[shape].p1.y, xPos, y);
        } else if (shapes[shape].fillType == 2) {
          pg.strokeWeight(waveStrokeWeight * sizeMultiplier * zoomFactor + rand(-0.5,0.5));
          waveLine(xPos,shapes[shape].p1.y,y)
        }
      }

      let p1 = shapes[shape].p1.copy();
      let p2 = shapes[shape].p2.copy();
      let p3 = shapes[shape].p3.copy();

      if (shapes[shape].mirrored) {
        p1.x = currentFormat.width-p1.x;
        p2.x = currentFormat.width-p2.x;
        p3.x = currentFormat.width-p3.x;

        let pt = p3;
        p3 = p1;
        p1 = pt;
      }

      p1.mult(zoomFactor);
      p2.mult(zoomFactor);
      p3.mult(zoomFactor);

      pg.strokeWeight(2 * zoomFactor);
      pg.beginShape();
      generateRoundedCorner(p3,p1,p2,shapes[shape].cornerRadius * zoomFactor,0);
      generateRoundedCorner(p1,p2,p3,shapes[shape].cornerRadius * zoomFactor,0);
      generateRoundedCorner(p2,p3,p1,shapes[shape].cornerRadius * zoomFactor,0);
      pg.endShape(p.CLOSE);
    }
  }


  let generateMainLine = function(row) {
    let line = {
      type: "main",
      x1: currentFormat.margin + (p.noise(row * 100) - .5) * 180,
      y1: rows[row],
      x2: currentFormat.width-currentFormat.margin + (p.noise(row * 6000)-.5) * 180,
      y2: rows[row],
    }
    lines.push(line);
  }

  let generateConnectors = function(row) {
    for (let verticalLines = 0; verticalLines < fxrand() * 2; verticalLines++) {
      let x = currentFormat.margin * 1.2 + fxrand() * (currentFormat.width-2*currentFormat.margin*1.2);
      let length = p.min(currentFormat.rows-row-1,p.floor(fxrand() * 3 + 1));
      let line = {
        type: "connector",
        x1: x,
        y1: rows[row],
        x2: x,
        y2: rows[row + length],
      }

      if (p.abs(rows[row] - rows[row+length]) < 5)
        continue;

      lines.push(line);

      if (fxrand() > .9) {
        let offset = 12;
        line = {
          type: "connector",
          x1: x + offset,
          y1: rows[row],
          x2: x + offset,
          y2: rows[row + length],
        }
        lines.push(line);
      }
    }
  }

  let drawConnector = function(x1,y1,x2,y2) {
    pg.strokeWeight(3 * zoomFactor);
    pg.circle(x1 * zoomFactor,y1 * zoomFactor,12 * zoomFactor);
    lineLine(x1, y1, x2, y2);
    pg.circle(x2 * zoomFactor,y2 * zoomFactor,12 * zoomFactor);
  }

  let generateSubLines = function(row) {
    if (row >= currentFormat.rows-1)
         return;

    let subLineDistance = rowHeight/20;
    let subLineCount = p.round((rows[row+1]-rows[row]) / subLineDistance);
    subLineDistance = (rows[row+1]-rows[row])/subLineCount;
    for (let i = 0; i < subLineCount; i++) {
      let y = rows[row] + i * subLineDistance;
      let line = {
        type: "subline",
        x1: currentFormat.margin * 1.2 + (p.noise(i * 100) - .5) * 100,
        y1: y,
        x2: currentFormat.width-currentFormat.margin * 1.2 + (p.noise(i * 6000)-.5) * 100,
        y2: y,
      }

      lines.push(line);

      for (let verticalLines = 0; verticalLines < fxrand() * 3; verticalLines++) {
        let x = currentFormat.margin + fxrand() * (currentFormat.width-2*currentFormat.margin);
        line = {
          type: "subline",
          x1: x,
          y1: currentFormat.gridTop + row * rowHeight + i * rowHeight/subLineCount,
          x2: x,
          y2: p.min(currentFormat.gridBottom,currentFormat.gridTop + row * rowHeight + i * rowHeight/subLineCount+fxrand() * rowHeight / 2 + rowHeight / 2),
        }
        lines.push(line);
      }
    }
  }


  let generateLines = function() {
    for (let row = 0; row < currentFormat.rows; row++) {
      generateSubLines(row);
      generateMainLine(row);
      if (row >= currentFormat.rows-1)
         continue;
      generateConnectors(row);
    }
  };

  let drawLines = function() {
    pg.stroke(currentPalette.lineColor);
    currentColor = p.color(currentPalette.lineColor);
    pg.noFill();

    for (let line = 0; line < lines.length; line++) {
      if (lines[line].type === "connector") {
        drawConnector(lines[line].x1,lines[line].y1,lines[line].x2,lines[line].y2);
        continue;
      }
      
      if (lines[line].type === "main") {
        pg.strokeWeight(3 * zoomFactor);
      } else if (lines[line].type === "subline") {
        faintLines = true;
        pg.strokeWeight(1 * zoomFactor);
      }

      lineLine(lines[line].x1, lines[line].y1, lines[line].x2, lines[line].y2);
      faintLines = false;
    }
  };


  p.draw = function() {
    restart();
    p.noLoop();
  };

  let doResize = function() {
    autoZoom();
    restart();
  };

  p.windowResized = function() {

  };

  p.keyPressed = function() {
    if (p.keyCode === 80) {
      zoomFactor = 1;
      useShader = false;
      exportPrint = true;
      restart();
      useShader = true;
      exportPrint = false;
    } else if (p.keyCode === 83) {
      pg.save('Elevation '+currentFormat.name+' '+fxhash+'.png');
    } else if (p.keyCode === 32) {
      useShader = !useShader;
      restart();
    } else if (p.keyCode === 78) {
      overlayNoise = !overlayNoise;
      restart();
    } else if (p.keyCode === 49) {
      autoZoom();
      restart();
    } else if (p.keyCode === 50) {
      zoomFactor = 0.5;
      restart();
    } else if (p.keyCode === 51) {
      zoomFactor = 1;
      restart();
    }
  };

  let mod = function(x, n) {
    return (x % n + n) % n;
  };

  let degToRad = function(degrees) {
    return degrees * p.PI / 180.
  };
};

new p5(sketch);