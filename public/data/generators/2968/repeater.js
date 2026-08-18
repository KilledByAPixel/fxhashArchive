"use strict";

let pal = [];
let count = [];
let lineCount = [];
let rndmCopy = [];
let textureRot = [];
let slice, sliceB;
let blineCount;
let bcount, bcount2, rndm, rndm1, rndm2;
let os;
let slice1, slice2, slice3, slice4, slice5;
let smallDim;
let offScreen;
let offW = 2048;
let stripes, tri, tristripes;
let glitchStuffV;
let glitchStuffH;
let stairsStuffV;
let stairsStuffH;
let standardH;
let standardV;
let glitchH;
let glitchV;
let stairsH;
let stairsV;
let style;
let pals;
let palName;
let sliceVal;
let sliceF;
let sliceG;

let styleCh = random_num(0, 1);
let glitchVCh = random_num(0, 1);
let glitchHCh = random_num(0, 1);
let stairsVCh = random_num(0, 1);
let stairsHCh = random_num(0, 1);
let standardVCh = random_num(0, 1);
let standardHCh = random_num(0, 1);
let palsCh = random_num(0, 1);
let sliceVCh = random_num(0, 1);
let sliceHCh = random_num(0, 1)

function setup() {
  let seed = int(fxrand() * 100000000);
  randomSeed(seed);

  let e = displayDensity();
  pixelDensity(e);
  rectMode(CORNER);

  if (styleCh < 0.75) style = 1; // STRIPES
  if (styleCh < 0.25) style = 0; // TRI

  if (standardVCh < 0.5) standardV = 0;
  if (standardHCh < 0.5) standardH = 0;

  if (glitchHCh < 0.1) glitchH = 0;
  if (glitchVCh < 0.1) glitchV = 0;

  if (stairsHCh < 0.25) stairsH = 0;
  if (stairsVCh < 0.25) stairsV = 0;

  if (palsCh < 0.08) {
    pals = 0;
  } else if (palsCh > 0.08 && palsCh < 0.18) {
    pals = 1;
  } else if (palsCh > 0.18 && palsCh < 0.35) {
    pals = 2;
  } else if (palsCh > 0.35 && palsCh < 0.5) {
    pals = 3;
  } else if (palsCh > 0.5 && palsCh < 0.8) {
    pals = 4;
  }

  smallDim = Math.min(window.innerWidth, window.innerHeight);
  createCanvas(smallDim, smallDim);
  noLoop();
  noStroke();

  offScreen = offW;
  os = createGraphics(offScreen, offScreen);
  os.noStroke();

  slice1 = floor(offScreen / 3);
  slice2 = floor(offScreen / 6);
  slice3 = floor(offScreen / 12);
  slice4 = floor(offScreen / 24);
  slice5 = floor(offScreen / 48);

  count = [2, 3, 4, 5];
  lineCount = [2, 4, 8, 16, 32];
  rndmCopy = [0, 1, 2];
  textureRot = [0, 90, 180, 270];

  shuffle(count, true);
  shuffle(pal, true);
  shuffle(rndmCopy, true);
  shuffle(textureRot, true);

  bcount = count[0];
  sliceF = sliceVCh;

  if (sliceVCh < 0.2) {
    slice = slice5;
  } else if (sliceVCh > 0.2 && sliceVCh < 0.4) {
    slice = slice4;
  } else if (sliceVCh > 0.4 && sliceVCh < 0.6) {
    slice = slice3;
  } else if (sliceVCh > 0.6 && sliceVCh < 0.8) {
    slice = slice2;
  } else {
    slice = slice1;
  }

  if (sliceHCh < 0.2) {
    sliceB = slice5;
  } else if (sliceHCh > 0.2 && sliceHCh < 0.4) {
    sliceB = slice4;
  } else if (sliceHCh > 0.4 && sliceHCh < 0.6) {
    sliceB = slice3;
  } else if (sliceHCh > 0.6 && sliceHCh < 0.8) {
    sliceB = slice2;
  } else {
    sliceB = slice1;
  }
  switch (style) {
    case 0:
      tri = true;
      stripes = false;
      break;

    case 1:
      tri = false;
      stripes = true;
      break;

    default:
      tri = false;
      stripes = false;
      tristripes = true;
  }
  switch (pals) {
    case 0:
      pal = ["#1F2120", "#ECE3D1", "#ee8f3d", "#c93918"];
      break;
    case 1:
      pal = [
        "#1F2120",
        "#ECE3D1",
        "#0099cf",
        "#f8aa1f",
        "#005a9d",
        "#f3aacc",
        "#ea5241",
        "#509066",
      ];
      break;
    case 2:
      pal = ["#1f2421", "#216869", "#49a078", "#9cc5a1", "#dce1de", "#ed1c24"];
      break;
    case 3:
      pal = [
        "#1F2120",
        "#FDFDFB",
        "#DCE9E9",
        "#112543",
        "#083074",
        "#41699C",
        "#FA5B23",
        "#f3aacc",
      ];
      break;
    case 4:
      pal = ["#206783", "#E8EBED", "#BD1B0F", "#1f2120"];
      break;
    default:
      pal = ["#1f2120", "#c1c1c1", "#2c4251", "#ff1b1c", "#f0f600"];
  }

  switch (standardV) {
    case 0:
      standardV = true;
      break;
    default:
      standardV = true;
    
  }

  switch (standardH) {
    case 0:    
      standardH = true;   
      break;
    default:
      standardH = false;   
  }

  switch (glitchV) {
    case 0:     
      glitchStuffV = true;     
      break;
    default:   
      glitchStuffV = false;  
  }

  switch (glitchH) {
    case 0:    
      glitchStuffH = true;    
      break;
    default:    
      glitchStuffH = false; 
  }

  switch (stairsV) {
    case 0:    
      stairsStuffV = true;    
      break;
    default:   
      stairsStuffV = false;  
  }

  switch (stairsH) {
    case 0:    
      stairsStuffH = true;     
      break;
    default:     
      stairsStuffH = false;   
  }
}

function draw() {
  let bgColChoice = floor(random_num(0, pal.length));
  background(color(pal[bgColChoice]));
  for (let i = 0; i < bcount; i++) {
    for (let j = 0; j < bcount; j++) {
      rndm = random_num(0, 1);
      rndm2 = random_num(0, 1);
      let lineChoice = floor(random_num(0, lineCount.length));
      blineCount = lineCount[lineChoice];
      if (tristripes == true) {
        if (rndm2 <= 0.5) {
          if (rndm <= 0.4) {
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.rect(
              (i * os.width) / bcount,
              j * (os.height / bcount),
              os.width / bcount,
              os.height / bcount
            );
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.beginShape();
            os.vertex(
              (i * os.width) / bcount,
              (j * os.height) / bcount + os.height / bcount
            );
            os.vertex(
              (i * os.width) / bcount + os.width / bcount,
              (j * os.height) / bcount + os.height / bcount
            );
            os.vertex(
              (i * os.width) / bcount + os.width / bcount,
              (j * os.height) / bcount
            );
            os.endShape();
          } else if (rndm <= 0.8) {
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.rect(
              (i * os.width) / bcount,
              j * (os.height / bcount),
              os.width / bcount,
              os.height / bcount
            );

            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.beginShape();
            os.vertex((i * os.width) / bcount, (j * os.height) / bcount);
            os.vertex(
              (i * os.width) / bcount + os.width / bcount,
              (j * os.height) / bcount
            );
            os.vertex(
              (i * os.width) / bcount + os.width / bcount,
              (j * os.height) / bcount + os.height / bcount
            );
            os.endShape();
          } else {
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.rect(
              (i * os.width) / bcount,
              j * (os.height / bcount),
              os.width / bcount,
              os.height / bcount
            );
          }
        } else {
          if (rndm <= 0.35) {
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.rect(
              (i * os.width) / bcount,
              j * (os.height / bcount),
              os.width / bcount,
              os.height / bcount
            );
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            for (let l = 0; l < blineCount; l++) {
              os.rect(
                (i * os.width) / bcount + (os.width / bcount / blineCount) * l,
                (j * os.height) / bcount,
                os.width / bcount / (blineCount * 2),
                os.height / bcount
              );
            }
          } else if (rndm <= 0.7) {
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            os.rect(
              (i * os.width) / bcount,
              j * (os.height / bcount),
              os.width / bcount,
              os.height / bcount
            );
            os.fill(color(pal[floor(random_num(0, pal.length))]));
            for (let k = 0; k < blineCount; k++) {
              os.rect(
                (i * os.width) / bcount,
                (j * os.height) / bcount +
                  (os.height / bcount / blineCount) * k,
                os.width / bcount,
                os.height / bcount / (blineCount * 2)
              );
            }
          } else {
            os.fill(color(pal[floor(random_num(0, pal.length))]));

            os.rect(
              (i * os.width) / bcount,
              j * (os.height / bcount),
              os.width / bcount,
              os.height / bcount
            );
          }
        }
      }
      if (stripes == true) {
        if (rndm <= 0.35) {
          os.fill(color(pal[floor(random_num(0, pal.length))]));

          os.rect(
            (i * os.width) / bcount,
            j * (os.height / bcount),
            os.width / bcount,
            os.height / bcount
          );
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          for (let l = 0; l < blineCount; l++) {
            os.rect(
              (i * os.width) / bcount + (os.width / bcount / blineCount) * l,
              (j * os.height) / bcount,
              os.width / bcount / (blineCount * 2),
              os.height / bcount
            );
          }
        } else if (rndm <= 0.7) {
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.rect(
            (i * os.width) / bcount,
            j * (os.height / bcount),
            os.width / bcount,
            os.height / bcount
          );
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          for (let k = 0; k < blineCount; k++) {
            os.rect(
              (i * os.width) / bcount,
              (j * os.height) / bcount + (os.height / bcount / blineCount) * k,
              os.width / bcount,
              os.height / bcount / (blineCount * 2)
            );
          }
        } else {
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.rect(
            (i * os.width) / bcount,
            j * (os.height / bcount),
            os.width / bcount,
            os.height / bcount
          );
        }
      }
      if (tri == true) {
        if (rndm <= 0.4) {
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.rect(
            (i * os.width) / bcount,
            j * (os.height / bcount),
            os.width / bcount,
            os.height / bcount
          );
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.beginShape();
          os.vertex(
            (i * os.width) / bcount,
            (j * os.height) / bcount + os.height / bcount
          );
          os.vertex(
            (i * os.width) / bcount + os.width / bcount,
            (j * os.height) / bcount + os.height / bcount
          );
          os.vertex(
            (i * os.width) / bcount + os.width / bcount,
            (j * os.height) / bcount
          );
          os.endShape();
        } else if (rndm <= 0.8) {
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.rect(
            (i * os.width) / bcount,
            j * (os.height / bcount),
            os.width / bcount,
            os.height / bcount
          );
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.beginShape();
          os.vertex((i * os.width) / bcount, (j * os.height) / bcount);
          os.vertex(
            (i * os.width) / bcount + os.width / bcount,
            (j * os.height) / bcount
          );
          os.vertex(
            (i * os.width) / bcount + os.width / bcount,
            (j * os.height) / bcount + os.height / bcount
          );
          os.endShape();
        } else {
          os.fill(color(pal[floor(random_num(0, pal.length))]));
          os.rect(
            (i * os.width) / bcount,
            j * (os.height / bcount),
            os.width / bcount,
            os.height / bcount
          );
        }
      }
    }
  }

  let w = slice; 
  let h = sliceB; 
  let j = 0;
  let k = 0;
  let r1w = int(random_num(0, os.width - w));
  let r3h = int(random_num(0, os.height - h));
  let vRndm = random_num(0, 1);
  let vRndm1 = random_num(0, 1);

  if (standardV == true) {
    if (count[0] >= 5) {
      if (rndmCopy[0] <= 1) {
        for (let x = 0; x < os.width; x += w) {
          let r = int(random_num(0, os.width - w));
          os.copy(r, 0, w, os.height, x, 0, w, os.height);
        }
      } else {
        for (let x = 0; x < os.width; x += w) {
          os.copy(r1w, 0, w, os.height, x, 0, w, os.height);
        }
      }
    } else {
      for (let x = 0; x < os.width; x += w) {
        let r = int(random_num(0, os.width - w));
        os.copy(r, 0, w, os.height, x, 0, w, os.height);
      }
    }
  }

  if (stairsStuffV == true) {
    if (vRndm1 < 0.5) {
      for (let x = 0; x < os.width; x += w) {
        j += w;
        os.copy(j, 0, w, os.height, x, os.height - j, w, os.height); 
      }
    } else {
      for (let x = 0; x < os.width; x += w) {
        j += w;
        os.copy(j, 0, w, os.height, x, j, w, os.height); 
      }
    }
  }

  if (glitchStuffV == true) {
    if (vRndm < 0.5) {
      for (let x = 0; x < os.width; x += w) {
        j += floor(map_range(sin(x), -1, 1, 0, w));
        os.copy(j, 0, w, os.height, x, os.height - j, w, os.height); 
      }
    } else {
      for (let x = 0; x < os.width; x += w) {
        j += floor(map_range(sin(x), -1, 1, 0, w));
        os.copy(j, 0, w, os.height, x, j, w, os.height); 
      }
    }
  }

  if (standardH == true) {
    if (rndmCopy[0] == 1) {
      for (let y = 0; y < os.height; y += h) {
        let r2 = int(random_num(0, os.height - h));
        os.copy(0, r2, os.width, h, 0, y, os.width, h);
      }
    } else if (rndmCopy[0] == 0) {
      for (let y = 0; y < os.height; y += h) {
        os.copy(0, r3h, os.width, h, 0, y, os.width, h);
      }
    } else {
      if (random_num(0, 1) < 0.5) {
        for (let y = 0; y < os.height; y += h) {
          let r2 = int(random_num(0, os.height - h));
          let r4 = int(random_num(-os.height / 2, os.height));
          os.copy(r2, 0, os.width, h, r4, y, os.width, h);
        }
      } else {
        for (let y = 0; y < os.height; y += h) {
          let r2 = int(random_num(0, os.height - h));
          let r4 = int(random_num(0, os.height - h));
          os.copy(r3h, 0, os.width, h, r4, y, os.width, h);
        }
      }
    }
  }

  let hRndm = random_num(0, 1);
  let hRndm1 = random_num(0, 1);
  if (stairsStuffH == true) {
    if (hRndm <= 0.5) {
      for (let y = 0; y < os.height; y += h) {
        k += w;
        os.copy(0, k, os.width, h, os.width - k, y, os.width, h); 
      }
    } else {
      for (let y = 0; y < os.height; y += h) {
        k += w;
        os.copy(0, k, os.width, h, k, y, os.width, h); 
      }
    }
  }

  if (glitchStuffH == true) {
    if (hRndm1 < 0.5) {
      for (let y = 0; y < os.height; y += h) {
        k += floor(map_range(sin(y), -1, 1, 0, h));
        os.copy(0, k, os.width, h, os.width - k, y, os.width, h); 
      }
    } else {
      for (let y = 0; y < os.height; y += h) {
        k += floor(map_range(sin(y), -1, 1, 0, h));
        os.copy(0, k, os.width, h, k, y, os.width, h); 
      }
    }
  }

  image(os, smallDim * 0.1, smallDim * 0.1, smallDim * 0.8, smallDim * 0.8);
  
}

function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}
function random_num(a, b) {
  return a + (b - a) * fxrand();
}

function random_int(a, b) {
  return Math.floor(random_num(a, b + 1));
}

function palsName() {
  if (palsCh < 0.08) return "Analog";
  if (palsCh < 0.18) return "Global";
  if (palsCh < 0.35) return "Mint";
  if (palsCh < 0.5) return "Bug";
  if (palsCh < 0.8) return "Frederick";
  else return "Y2K";
}

function styleName() {
  if (styleCh < 0.25) return "Triangles";
  if (styleCh < 0.75) return "Lines";
  else return "Mixed";
}

function glitch() {
  if (glitchHCh < 0.1 && glitchVCh < 0.1) return "H&V";
  if (glitchHCh < 0.1) return "H";
  if (glitchVCh < 0.1) return "V";
  else return "None";
}

function stairs() {
  if (stairsVCh < 0.25 && stairsHCh < 0.25) return "Up&Down";
  if (stairsHCh < 0.25) return "Upstairs";
  if (stairsVCh < 0.25) return "Downstairs";
  else return "None";
}

function sliceType() {
  if (standardVCh < 0.5 && standardHCh < 0.5) return "H&V";
  if (standardVCh < 0.5) return "Vert";
  if (standardHCh < 0.5) return "Horz";
  else return "None";
}

function sliceScaleVert() {  
  if (sliceVCh < 0.2) return "XS"
  if (sliceVCh < 0.4) return "S"
  if (sliceVCh < 0.6) return "M"
  if (sliceVCh < 0.8) return "L"
  else return "XL"
}

function sliceScaleHorz() {  
  if (sliceHCh < 0.2) return "XS"
  if (sliceHCh < 0.4) return "S"
  if (sliceHCh < 0.6) return "M"
  if (sliceHCh < 0.8) return "L"
  else return "XL"
}

  window.$fxhashFeatures = {
    Palette: palsName(),
    Style: styleName(),
    Glitch: glitch(),
    Stairs: stairs(),
    Slice: sliceType(),
    ScaleV: sliceScaleVert(),
    ScaleH: sliceScaleHorz()
  }