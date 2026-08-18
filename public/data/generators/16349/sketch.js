
// Spirit Fields by Juki

let mainSize = 3;

let colPick2;
let vaseCount;
let counterT;
let formation;
let formationSeed;

let layout;
let theme;
let density = fxrand();
let zoom;

let seedR = fxrand()*10000000;

let themes = ["Blue","Yellow","Red"];
let colPick = Math.floor(fxrand()*3);
let colPick_n1 = Math.floor(fxrand()*3);
let colPick_n2 = Math.floor(fxrand()*3);
let colPick_n3 = Math.floor(fxrand()*3);

let colNPick = fxrand();
if (colNPick <= 0.33) {
  colPick_n1 = 0;
  colPick_n2 = 1;
} else if(colNPick > 0.33 && colNPick <= 0.66){
  colPick_n1 = 0;
  colPick_n2 = 2;
} else {
  colPick_n1 = 1;
  colPick_n2 = 2;
}

 let formationCheck = fxrand(1) < 0.4;
 let formationCheck2 = fxrand(1) < 0.4;
 let formationCheck3 = fxrand(1) < 0.1;
 let onlyFlowers = fxrand(1) < 0.02;

 let densityString;

 let shrubDensity;
 let flowerDensity;
 let poppyDensity;
 let algDensity;
 let treeDensity;
 let treeCount;

 if (density <= 0.2 ){
   densityString = "Scarce";
   shrubDensity = 80.25;
   treeDensity = 81.01;
   flowerDensity = 85.3;
   algDensity = 87.05;
   poppyDensity = 88.3;
   treeCount = 1;
   vaseCount = 1;


 } else if (density > 0.2 && density < 0.8){
   densityString = "Moderate";
   shrubDensity = 80.5;
   treeDensity =  81.03;
   flowerDensity = 85.5;
   algDensity = 87.3;
   poppyDensity = 88.5;
   treeCount = 2;
   vaseCount = 2;


 } else if (density >= 0.8){
   densityString = "Dense";
   shrubDensity = 80.8;
   treeDensity = 81.05;
   flowerDensity = 85.8;
   algDensity = 87.6;
   poppyDensity = 88.8;
   treeCount = 3;
   vaseCount = 2;


 } else{

 }

 if (formationCheck && !onlyFlowers) {
   if (formationCheck2) {
     theme = themes[colPick];
     layout = "Circular";
     mainSize = 3;
   } else {
     if (formationCheck3) {
       theme = "Red Yellow Blue";
       layout = "Trio";
       if(fxrand() < 0.5){
         mainSize = 3;
       } else {
         mainSize = 4;
       }
     } else {
       theme = themes[colPick_n1] +" "+ themes[colPick_n2];
       layout = "Duo";
       if(fxrand() < 0.5){
         mainSize = 3;
       } else {
         mainSize = 4;
       }
     }
   }
 } else {
   if(onlyFlowers){
     theme = themes[colPick];
     layout = "Flower Field";
     mainSize = 3;

   }else {
     theme = themes[colPick];
     layout = "Solo";
     if(fxrand() < 0.5){
       mainSize = 3;
     } else {
       mainSize = 4;
     }
   }

 }

 if(mainSize == 3){
   zoom = "Far";
 } else {
   zoom = "Close"
 }

 window.$fxhashFeatures = {
 "Layout": layout,
 "Theme": theme,
 "Density": densityString,
 "Camera" : zoom,
  }

function setup() {
  pixelDensity(1);

  randomSeed(seedR);
  noiseSeed(seedR);

  createCanvas(2500, 2500);
  colorMode(HSB, 360, 100, 100, 100);

  angleMode(DEGREES);

  colPick_f = random(1);
  colPick_p1 = random(1);
  colPick_p2 = random(1);
  colPick_p3 = random(1);
  colPick_p4 = random(1);
  colPick_p5 = random(1);
  colPick_bg = random(1);

  counterT = 0;
  counterV = 0;

  let colors01 = [];

  if (formationCheck && !onlyFlowers) {
    if (colPick_bg <= 0.333) {
      colors01 = [
        color(210, 80, 80),
        color(40, 80, 100),
        color(10, 50, 90),
        color(10, 0, 90),
      ];
    } else if (colPick_bg > 0.33 && colPick_bg <= 0.66) {
      colors01 = [
        color(30, 20, 100),
        color(30, 20, 100),
        color(30, 20, 100),
        color(10, 0, 90),
      ];
    } else {
      colors01 = [
        color(10, 60, 100),
        color(210, 80, 70),
        color(210, 80, 70),
        color(10, 0, 90),
      ];
    }
  } else {
    colors01 = [
      color(210, 80, 80),
      color(40, 80, 100),
      color(10, 70, 90),
      color(10, 0, 90),
    ];
  }

  background(colors01[colPick]);
}

function draw() {
  for (let i = 0; i < height + 50; i += random(5, 15) * mainSize) {
    for (let j = 0; j < width + 50; j += random(5, 15) * mainSize) {
      let seed = random(100);
      let x1 = width / 2;
      let y1 = height / 2 + height / 32;

      if (formationCheck && !onlyFlowers) {
        if (formationCheck2) {
          formation = sqrt(sq(j - x1) + sq(i - y1 - 25*mainSize )) < height / 4;
        } else {
          if (formationCheck3) {
            if (noise(j / (150 * mainSize), i / (150 * mainSize)) < 0.4) {
              colPick = 0;
              formation = true;
            } else {
              if (noise(j / (100 * mainSize), i / (100 * mainSize)) < 0.5) {
                colPick = 1;
                formation = true;
              } else {
                colPick = 2;
                formation = true;
              }
            }
          } else {
            if (noise(j / (150 * mainSize), i / (150 * mainSize)) < 0.5) {
              colPick = colPick_n1;
              formation = true;
            } else {
              colPick = colPick_n2;
              formation = true;
            }
          }
        }
      } else {
        formation = true;
      }

      if (seed <= 80 && formation) {
        grass(j, i, mainSize, colPick);
      } else if (
        seed > 80 &&
        seed <= shrubDensity &&
        formation &&
        !onlyFlowers
      ) {
        for (let c = 0; c < random(5, 10); c++) {
          //shrub
          plant03(
            j + random(-20, 20),
            i + random(-20, 20),
            1.5 * mainSize,
            colPick,
            colPick_p3
          );
        }
      } else if (seed > 81 && seed <= treeDensity && formation && !onlyFlowers) {
        if (i > height / 3) {
          if (counterT < treeCount) {
            counterT++;
            //tree
            tree(j, i, 120, 20, true, mainSize, colPick, colPick_p1);
          }
        }
      } else if (seed > 82 && seed <= 85 && formation && !onlyFlowers) {
        fireflies(j, i, colPick, colPick_f);
      } else if (seed > 85 && seed <= flowerDensity && formation) {
        for (let c = 0; c < 6; c++) {
          //flowers
          plant04(
            j + random(-20, 20),
            i + random(-20, 20),
            0.4 * mainSize,
            colPick,
            colPick_p4
          );
        }
      } else if (seed > 86 && seed <= 86.5 && formation && !onlyFlowers) {
        if (counterV < vaseCount) {
          counterV++;
          vase(j, i, random(0.8, 1)*mainSize, colPick);
        }
      } else if (seed > 87 && seed <= algDensity && formation && !onlyFlowers) {
        for (let c = 0; c < 10; c++) {
          //alg
          plant02(
            j + random(-20, 20),
            i + random(-20, 20),
            mainSize,
            colPick,
            colPick_p2
          );
        }
      } else if (
        seed > 88 &&
        seed <= poppyDensity &&
        formation &&
        !onlyFlowers
      ) {
        for (let c = 0; c < random(30, 50); c++) {
          //poppies
          plant05(
            j + random(-20, 20),
            i + random(-20, 20),
            mainSize,
            colPick,
            colPick_p5
          );
        }
      } else {
      }
    }
  }

  borders();
  grain();
  fxpreview();
  noLoop();
}

function borders() {
  let x;
  let y;
  let gap = 75;
  let circleRadius = 10 * mainSize;
  let circleSpread = 2 * mainSize;
  noStroke();
  fill(30, 5, 100);
  rect(0, 0, gap, height);
  rect(0, 0, width, gap);
  rect(width - gap, 0, gap, height);
  rect(0, height - gap, width, gap);

  for (let i = 0; i < width; i++) {
    x = gap;
    y = gap + random(-circleSpread, circleSpread);
    circle(i, y, circleRadius);
  }
  for (let i = 0; i < width; i++) {
    x = gap;
    y = height - gap + random(-circleSpread, circleSpread);
    circle(i, y, circleRadius);
  }
  for (let i = 0; i < height; i++) {
    x = gap + random(-circleSpread, circleSpread);
    y = gap;
    circle(x, i, circleRadius);
  }
  for (let i = 0; i < height; i++) {
    x = width - gap + random(-circleSpread, circleSpread);
    y = gap;
    circle(x, i, circleRadius);
  }
}

function linearGradient(sX, sY, eX, eY, colorS, colorE) {
  let gradient = drawingContext.createLinearGradient(sX, sY, eX, eY);
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);
  drawingContext.fillStyle = gradient;
  // drawingContext.strokeStyle = gradient;
}

function radialGradient(sX, sY, sR, eX, eY, eR, colorS, colorE) {
  let gradient = drawingContext.createRadialGradient(sX, sY, sR, eX, eY, eR);
  gradient.addColorStop(0, colorS);
  gradient.addColorStop(1, colorE);

  drawingContext.fillStyle = gradient;
}

function grain() {
  loadPixels();

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      let spread = 20 ; //colorshift
      var index = (x + y * width) * 3 * mainSize;
      pixels[index + 0] = pixels[index + 0] + random(-spread,spread);
      pixels[index + 1] = pixels[index + 1] + random(-spread,spread);
      pixels[index + 2] = pixels[index + 2] + random(-spread,spread);
      pixels[index + 3] = pixels[index + 3] ; //alphashift
    }
  }
  updatePixels();
}
