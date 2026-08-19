
var sclMult, inc, scl, cls, rws;
let sb;
let sb2;
let color1 = [];
let color2 = [];
var seed;
var inc;
var scl;



//-----feature number generator-----//

function fxrand_weighted(w) {
  // Normalize
  let w_sum = 0;
  for (k = 0; k < w.length; k++) {
    w_sum += w[k];
  }
  for (k = 0; k < w.length; k++) {
    w[k] = w[k] / w_sum;
  }
  //

  // Cumulative sum
  csum = [];
  tsum = 0;
  for (k = 0; k < w.length; k++) {
    tsum += w[k];
    csum[k] = tsum;
  }
  //

  // Run fxrand, return value it is nearest, but not greater than
  droll = fxrand();
  for (k = 0; k < csum.length; k++) {
    if (droll <= csum[k]) {
      return k
    }
  }
  //
}

//---end feature number generator---//

//---fxrand value range generator---//
function fxrand_range(x,y){
return fxrand()*(y-x)+x;
}
//---end fxrand value range generator---//



function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  noiseSeed(int(fxrand()*123456789));
  sb = new Sb();
  sb2 = new Sb2();
  
  var seed = fxrand_weighted([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 5]);
  
  var alphaIndex = [0.3, 0.4, 0.4, 0.5, 0.5]
  var asd = alphaIndex[parseInt(fxrand()*alphaIndex.length)]
  

      //Palettes
      if(seed == 0) {
      Name = "Tulip Fields";
      bg = [255, 240, fxrand_range(225, 250)];
      color1 = [ color(202, 247, 227, asd), color(248, 237, 237, asd), color(246, 223, 235, asd), color(228, 186, 212, asd) ], //crockettNTubbs
      color2 = [ color(34, 100, 45, asd), color(34, 109, 40, asd), color(28, 105, 40, asd), color(50, 140, 60, asd)] //grassColors
      }
      
      if(seed == 1) {
      Name = "Dying Rose";
      bg = [fxrand_range(10, 50), 25, 25];
      color1 = [ color(212, 115, 130, asd), color(226, 187, 192, asd), color(228, 177, 171, asd), color(227, 150, 149, asd), color(220, 134, 136, asd) ], //pinkColors
      color2 = [ color(84, 58, 64, asd), color(51, 50, 55, asd), color(96, 93, 88, asd) ] //killtheDevil
      }
      
      if(seed == 2) {
      Name = "Here it Goes";
      bg = [fxrand_range(180, 240), 150, 180];
      color1 = [ color(185, 22, 70, asd), color(223, 216, 202, asd), color(251, 243, 228, asd), color(16, 86, 82, asd), color(34, 87, 126, asd), color(85, 132, 172, asd), color(149, 209, 204, asd), color(246, 242, 212, asd), color(76, 0, 112, asd), color(22, 0, 64, asd),
       ], //kitchenSink
      color2 = [ color(245, 245, 245, asd), color(244, 242, 240, asd), color(236, 234, 232, asd), color(227, 227, 225, asd), ] //grayMono
      }
      
      if(seed == 3) {
      Name = "Merlot";
      bg = [255, 225, fxrand_range(190, 240)];
      color1 = [ color(139, 38, 53, asd), color(135, 32, 45, asd), color(130, 30, 40, asd), color(142, 42, 58, asd), color(248, 245, 245, asd) ], //deepReds
      color2 = [ color(212, 115, 130, asd), color(226, 187, 192, asd), color(228, 177, 171, asd), color(227, 150, 149, asd), color(220, 134, 136, asd),] //pinkColors
      }

      if(seed == 4) {
      Name = "A Light";
      bg = [fxrand_range(40), 0, 0];
      color1 = [ color(0, 0, 0, asd), color(50, 50, 50, asd), color(200, 200, 200, asd), color(250, 250, 250, asd) ], //zero
      color2 = [ color(245, 245, 245, asd), color(244, 242, 240, asd), color(236, 234, 232, asd), color(227, 227, 225, asd), color(228, 177, 171, asd) ] //grayMono
      }
      
      if(seed == 5) {
      Name = "In a Field";
      bg = [fxrand_range(200, 240), 240, 220];
      color1 = [ color(34, 100, 45, asd), color(34, 109, 40, asd), color(28, 105, 40, asd), color(50, 140, 60, asd) ], //grassColors
      color2 = [ color(0, 184, 169, asd), color(248, 243, 212, asd), color(246, 65, 108, asd), color(255, 222, 125, asd), color(20, 185, 169) ] //nautical
      }
      
      if(seed == 6) {
      Name = "Purple Gelatto";
      bg = [240, 225, fxrand_range(215, 225)];
      color1 = [ color(140, 105, 155, asd), color(161, 125, 154, asd), color(170, 140, 165, asd), color(176, 145, 170, asd), color(245, 245, 245, asd)], //purpleColors
      color2 = [ color(82, 73, 72, asd), color(87, 70, 123, asd), color(124, 180, 184, asd), color(112, 248, 186, asd), color(202, 254, 72, asd) ] //pastelGelatto
      }
      
      if(seed == 7) {
      Name = "Too Loud";
      bg = [250, 250, fxrand_range(235, 250)];
      color1 = [ color(0, 0, 0, asd), color(50, 50, 50, asd), color(200, 200, 200, asd), color(250, 250, 250, asd) ], //zero
      color2 = [ color(250, 5, 110, asd), color(250, 190, 11, asd), color(58, 134, 255, asd)] //loudTrips
      }
      
      if(seed == 8) {
      Name = "Gold Voyage";
      bg = [255, 235, 200];
      color1 = [ color(222, 194, 147, asd), color(255, 233, 191, asd), color(255, 215, 161, asd), color(240, 183, 146, asd), color(248, 248, 248, asd) ], //goldPastels
      color2 = [ color(185, 22, 70, asd),  color(223, 216, 202, asd), color(251, 243, 228, asd), color(16, 86, 82, asd) ] //maroonvoyage
      }
      
      if(seed == 9) {
      Name = "Abercrombie Sea";
      bg = [249, 250, 240];
      color1 = [ color(180, 180, 235, asd), color(185, 185, 237, asd), color(175, 175, 230, asd) ], //goldPastels
      color2 = [ color(212, 115, 130, asd), color(249, 250, 240, asd), color(228, 177, 171, asd), color(175, 203, 255, asd), color(14, 28, 54, asd) ] //abercrombie
      }
      
      if(seed == 10) {
      Name = "Celebration Desperation";
      bg = [250, fxrand_range(160, 210), 11];
      color1 = [ color(245, 245, 245, asd), color(244, 242, 240, asd), color(236, 234, 232, asd), color(227, 227, 225, asd), ], //graymono
      color2 = [ color(250, 5, 110, asd), color(250, 190, 11, asd), color(58, 134, 255, asd)] //loudTrips
      }
      
      if(seed == 11) {
      Name = "All of it";
      bg = [240, 240, 240];
      color1 = [ color(72, 52, 52, asd), color(107, 79, 79, asd), color(149, 110, 110, asd), color(200, 170, 156, asd) ], //browns
      color2 = [ color(73, 198, 172, asd), color(94, 84, 162, asd), color(154, 204, 145, asd), color(255, 200, 0, asd), color(250, 80, 118, asd) ] //allofit
      }
      
      if(seed == 12) {
      Name = "Sparkling";
      bg = [235, 235, fxrand_range(245, 255)];
      color1 = [ color(247, 247, 247, asd), color(255, 188, 151, asd), color(255, 120, 0, asd), color(255, 227, 0, asd) ], //orange
      color2 = [ color(180, 180, 235, asd), color(185, 185, 237, asd), color(175, 175, 230, asd) ] //purples
      }
      
      if(seed == 13) {
      Name = "River";
      bg = [250, 240, 240];
      color1 = [ color(33, 47, 84, asd), color(24, 40, 84, asd), color(32, 44, 79, asd), color(44, 55, 89, asd) ], //deepBlue
      color2 = [ color(206, 228, 208, asd), color(200, 220, 200, asd), color(240, 235, 210, asd) ] //lightGreens
      }
  
      if(seed == 14) {
      Name = "The Devil's Party";
      bg = [250, 250, 250];
      color1 = [ color(84, 58, 64, asd), color(51, 50, 55, asd), color(96, 93, 88, asd) ], //killthedevil
      color2 = [ color(35, 100, 237, asd), color(255, 231, 36, asd), color(254, 60, 179, asd), color(71, 215, 54, asd), color(159, 76, 196, asd), color(250, 47, 57, asd) ] //lightGreens
      }
  
      if(seed == 15) {
      Name = "Cruella"
      bg = [255, 200, 200]
      color1 = [ color(240, 25, 25, asd), color(227, 36, 36, asd), color(217, 46, 46, asd), color(224, 63, 63, asd) ], //reds
      color2 = [ color(0, 0, 0, asd), color(50, 50, 50, asd), color(200, 200, 200, asd), color(250, 250, 250, asd) ]//lightGreens
      }
      
      if(seed == 16) {
      Name = "Beach"
      bg = [250, 250, 250]
      color1 = [ color(162, 210, 248, asd), color(248, 248, 240, asd), color(248, 134, 94, asd), color(248, 228, 64, asd) ], //atthebeach
      color2 = [ color(248, 10, 10, asd), color(248, 248, 248, asd), ] //brightred
      }
      
      if(seed == 17) {
      Name = "Glowsticks"
      bg = [5, 5, 5]
      color1 = [ color(202, 247, 227, asd), color(136, 255, 12, asd), color(176, 255, 8, asd), color(215, 255, 4, asd), color(255, 255, 0, asd) ], //neon puke
      color2 = [ color(185, 131, 255, asd), color(148, 179, 253, asd), color(148, 218, 255, asd), color(153, 254, 255, asd) ] //cottoncandy
      }
  
      if(seed == 18) {
      Name = "Purple Daisy"
      bg = [250, 250, 250]
      color1 = [ color(154, 6, 128, asd), color(121, 1, 140, asd), color(76, 0, 112, asd), color(22, 0, 64, asd), color(250, 250, 250, asd), ], //deep purples
      color2 = [ color(212, 115, 130, asd), color(226, 187, 192, asd), color(228, 177, 171, asd), color(227, 150, 149, asd), color(220, 134, 136, asd) ] //pinkColors
      }
  
      background(bg);
  

    function getBrushType() {
      if (fxrand() <= 0.3) return "Brush Style 1"
      if (fxrand() > 0.3 && fxrand() <= 0.63) return "Brush Style 2"
      if (fxrand() > 0.63 && fxrand() <= 0.81) return "Brush Style 3"
      if (fxrand() > 0.81) return "Brush Style 4"
    }
  
    function colorSwap() {
      if (fxrand() > 0.5) return "Yes"
      if (fxrand() < 0.5) return "No"
    }
  
      function getPalette() {
      return Name;
    }
  
    window.$fxhashFeatures = {
    "Palette": getPalette(),
    "Brush Type": getBrushType(),
    "Color Swap": colorSwap()
  };


 }

//----------//


function draw() {
  
  
    if(fxrand() <= 0.3) {
    drawStyle1();
    }
    else if(fxrand() > 0.3 && fxrand() <= 0.63) {
    drawStyle2();
    }
    else if(fxrand() > 0.63 && fxrand() <= 0.81) {
    drawStyle3();
    }
    else {
    drawStyle4();
    }
  
   
}

//----------//

function drawStyle1() {
  
   var scaleIndex = [3, 3, 4, 4, 5, 5]
   var randomScale = scaleIndex[parseInt(fxrand()*scaleIndex.length)]
   
   var scl = randomScale;
   
   var canvasResize = [0, 0, 0.01, 0.02, 0.04, 0.06]
   var randomResize = canvasResize[parseInt(fxrand()*canvasResize.length)]
   
   var maxLength = [0.25, 0.3, 0.31, 0.34, 0.37, 0.41]
   var randomMaxL = maxLength[parseInt(fxrand()*maxLength.length)]
   
   var minLength = [0.1, 0.11, 0.12, 0.13, 0.14]
   var randomMinL = minLength[parseInt(fxrand()*minLength.length)]
   
   var maxWidth = [0.2, 0.21, 0.25, 0.3, 0.34]
   var randomMaxW = maxWidth[parseInt(fxrand()*maxWidth.length)]
   
   var incIndex = [0.005, 0.01, 0.0125, 0.015, 0.02, 0.03, 0.045, 0.1, 0.15];
   var randomInc = incIndex[parseInt(fxrand()*incIndex.length)]
   
   var inc = randomInc
  
     if (fxrand() >= 0.5) {      
     [color1, color2] = [color2, color1]
   }
  
  var bR = height * (0.95 - randomResize);
  var bL = width * (0.05 + randomResize);
  var bT = height * (0.05 + randomResize);
  var bB = width * (0.95 - randomResize);
   
  
  cls = bB / scl;
  rws = bR / scl;
  var startY =  bL / scl;
  var startX = bT / scl;
  
    var yoff = 0;
    for (var y = startY; y < rws; y++) {
    var xoff = 0;
    for (var x = startX; x < cls; x++) {
      var angle = noise(xoff, yoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      xoff += inc;
      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      if (angle <= 12) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb.xW(angle * scl * fxrand_range(randomMinL, randomMaxW));
      sb.color(color1[parseInt(fxrand()*color1.length)]);
      sb.yW(length);
        } else if (angle => 8) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb.xW(angle * scl * fxrand_range(randomMinL, randomMaxW));
      sb.color(color2[parseInt(fxrand()*color2.length)]);
      sb.yW(length)
        }
      pop();
    }
    yoff += inc;
  }
     noLoop();
}

//----------//
  
function drawStyle2() {
  
   var scaleIndex = [3, 3, 4, 4, 4, 5, 5, 6]
   var randomScale = scaleIndex[parseInt(fxrand()*scaleIndex.length)]
   
   var scl = randomScale;
   
   var canvasResize = [0, 0, 0.01, 0.02, 0.04, 0.06]
   var randomResize = canvasResize[parseInt(fxrand()*canvasResize.length)]
   
   var maxLength = [0.25, 0.3, 0.31, 0.34, 0.37, 0.41]
   var randomMaxL = maxLength[parseInt(fxrand()*maxLength.length)]
   
   var minLength = [0.1, 0.11, 0.12, 0.13, 0.14]
   var randomMinL = minLength[parseInt(fxrand()*minLength.length)]
   
   var maxWidth = [0.2, 0.21, 0.25, 0.3, 0.34]
   var randomMaxW = maxWidth[parseInt(fxrand()*maxWidth.length)]
   
   var incIndex = [0.005, 0.01, 0.015, 0.018, 0.02, 0.025];
   var randomInc = incIndex[parseInt(fxrand()*incIndex.length)]
   
   var inc = randomInc;
  
     if (fxrand() >= 0.5) {      
     [color1, color2] = [color2, color1]
   }
  
  var bR = height * (0.95 - randomResize);
  var bL = width * (0.05 + randomResize);
  var bT = height * (0.05 + randomResize);
  var bB = width * (0.95 - randomResize);
   
  
  cls = bB / scl;
  rws = bR / scl;
  var startY =  bL / scl;
  var startX = bT / scl;
  
    var yoff = 0;
    for (var y = startY; y < rws; y++) {
    var xoff = 0;
    for (var x = startX; x < cls; x++) {
      var angle = noise(xoff, yoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      xoff += inc;
      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      if (angle <= 12) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb.xW(angle * scl * fxrand_range(randomMinL, randomMaxW)); 
      sb.color(color1[parseInt(fxrand()*color1.length)]);
        } else if (angle => 8) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb2.xW(angle * scl * fxrand_range(randomMinL, randomMaxW)); 
      sb2.color(color2[parseInt(fxrand()*color2.length)]);
        }
      sb.yW(length);
      sb2.yW(length);
      pop();
    }
    yoff += inc;
  }
     noLoop();
}

//----------//


function drawStyle3() {
  
   var scaleIndex = [3, 3, 4, 4, 4, 5, 5]
   var randomScale = scaleIndex[parseInt(fxrand()*scaleIndex.length)]
   
   var scl = randomScale
   
   var canvasResize = [0, 0, 0.01, 0.02, 0.04, 0.06]
   var randomResize = canvasResize[parseInt(fxrand()*canvasResize.length)]
   
   var maxLength = [0.26, 0.3, 0.31, 0.34, 0.37, 0.41]
   var randomMaxL = maxLength[parseInt(fxrand()*maxLength.length)]
   
   var minLength = [0.12, 0.13, 0.14, 0.16]
   var randomMinL = minLength[parseInt(fxrand()*minLength.length)]
   
   var maxWidth = [0.3, 0.34, 0.38, 0.42]
   var randomMaxW = maxWidth[parseInt(fxrand()*maxWidth.length)]
   
   var incIndex = [0.005, 0.01, 0.0125, 0.015, 0.02, 0.03, 0.045, 0.1, 0.15];
   var randomInc = incIndex[parseInt(fxrand()*incIndex.length)]
   
   var inc = randomInc;
  
     if (fxrand() >= 0.5) {      
     [color1, color2] = [color2, color1]
   }
  
  var bR = height * (0.95 - randomResize);
  var bL = width * (0.05 + randomResize);
  var bT = height * (0.05 + randomResize);
  var bB = width * (0.95 - randomResize);
   
  
  cls = bB / scl;
  rws = bR / scl;
  var startY =  bL / scl;
  var startX = bT / scl;
  
    var yoff = 0;
    for (var y = startY; y < rws; y++) {
    var xoff = 0;
    for (var x = startX; x < cls; x++) {
      var angle = noise(xoff, yoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      xoff += inc;
      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      if (angle <= 12) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb.xW(angle * scl * fxrand_range(0.2, randomMaxW)); 
      sb.color(color1[parseInt(fxrand()*color1.length)]);
      sb.yW(length);
        } else if (angle => 8) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb2.xW(angle * scl * fxrand_range(0.2, randomMaxW));
      sb2.color(color2[parseInt(fxrand()*color2.length)]);
      sb2.yW(length)
        }
      pop();
    }
    yoff += inc;
  }
     noLoop();
}

//----------//

function drawStyle4() {
  
   var scaleIndex = [3, 3, 4, 4, 4, 5, 5]
   var randomScale = scaleIndex[parseInt(fxrand()*scaleIndex.length)]
   
   var scl = randomScale;
   
   var canvasResize = [0, 0, 0.01, 0.02, 0.04, 0.06]
   var randomResize = canvasResize[parseInt(fxrand()*canvasResize.length)]
   
   var maxLength = [0.25, 0.3, 0.31, 0.34, 0.38, 0.44]
   var randomMaxL = maxLength[parseInt(fxrand()*maxLength.length)]
   
   var minLength = [0.1, 0.11, 0.12, 0.13, 0.14]
   var randomMinL = minLength[parseInt(fxrand()*minLength.length)]
   
   var maxWidth = [0.3, 0.33, 0.4, 0.45, 0.5]
   var randomMaxW = maxWidth[parseInt(fxrand()*maxWidth.length)]
   
   var incIndex = [0.005, 0.01, 0.0125, 0.015, 0.02, 0.03, 0.045, 0.1, 0.15];
   var randomInc = incIndex[parseInt(fxrand()*incIndex.length)]
   
   var inc = randomInc;
  
     if (fxrand() >= 0.5) {      
     [color1, color2] = [color2, color1]
   }
  
  var bR = height * (0.95 - randomResize);
  var bL = width * (0.05 + randomResize);
  var bT = height * (0.05 + randomResize);
  var bB = width * (0.95 - randomResize);
   
  
  cls = bB / scl;
  rws = bR / scl;
  var startY =  bL / scl;
  var startX = bT / scl;
  
    var yoff = 0;
  for (var y = startY; y < rws; y++) {
    var xoff = 0;
    for (var x = startX; x < cls; x++) {
      var angle = noise(xoff, yoff) * TWO_PI * 4;
      var v = p5.Vector.fromAngle(angle);
      xoff += inc;
      push();
      translate(x * scl, y * scl);
      rotate(v.heading());
      if (angle <= 12) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb.xW(angle * scl * fxrand_range(randomMinL, randomMaxW)); 
      sb.color(color1[parseInt(fxrand()*color1.length)]);
      sb.yW(length);
        } else if (angle => 8) {
      var length = angle * scl * fxrand_range(randomMinL, randomMaxL);
      sb2.xW(angle * scl * fxrand_range(randomMinL, randomMaxW));
      sb2.color(color2[parseInt(fxrand()*color2.length)]);
        }
      sb2.yW(length)
      pop();
    }
    yoff += inc;
  }
     noLoop();
}

