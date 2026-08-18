// Some functions and code modified version from https://github.com/bmoren/p5.collide2D


// function fxrand_between(c,d) {
//   let randomNumber = fxrand();
//   return ((randomNumber * (d - c)) + c);
// }

// function fxrand_choice(array1) {
//   let randomNumber = fxrand_between(0, 0.999);
//   let indexNumber = floor(randomNumber * array1.length); 
//   return array1[indexNumber];
// }

// function fxrand_int(a,b) {
//   let randomNumber = fxrand_between(0, 0.999);
//   return floor(randomNumber * ((b + 1) - a)) + a;
// }



// function rectRectCollision2(x1, y1, w1, h1, x2, y2, w2, h2) {
//   centerX = x1 + w1/2;
//   centerY = y1 + h1/2;
//   centerX2 = x2 + w2/2;
//   centerY2 = y2 + h2/2;
//   if (centerX - w1/2 >= x2 && centerX )
      
      
function rectRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  
  if (x1 + w1 >= x2 && x1 <= x2 + w2 && y1 + h1 >= y2 && y1 <= y2 + h2) {
        return true;
  }
  return false;
}


function cirRectCollision(rectX, rectY, rectW, rectH, cirX, cirY, d) {
  var testerX = cirX;
  var testerY = cirY;

  if (cirX < rectX){
    testerX = rectX      
  } else if (cirX > rectX + rectW){ 
    testerX = rectX + rectW  
  } 

  if (cirY < rectY){
    testerY = rectY     
  } else if (cirY > rectY + rectH){ 
    testerY = rectY + rectH 
  } 
  var distance = this.dist(cirX, cirY, testerX, testerY)

  if (distance <= d * 0.5) {
    return true;
  }
  return false;
}


function cirCirCollision(x1, y1, d1 , x2, y2, d2) {
  if(this.dist(x1, y1 , x2, y2) <= (d1 *0.5) + (d2 *0.5) ) {
    return true;
  }
  return false;
}











//     } else if (paperType == "Fuzz") {
//            edgeMarker = random(-tenish, tenish);

//       let colorFuzz1 = random(c);
//       // fuzzWeight = 0.1*sizeAdjust;
//       strokeJoin(ROUND);
//       noFill();
//       for (b = 1; b <= paperTrips/1.4; b++) {
//        if (edges == "Rough") {
//           // edgeMarker = random(-tenish*5, tenish*5);
//           edgeMarker = 1+randomGaussian(0,1);
//            sizeMarker = random(sizeAdjust, sizeAdjust*5);
//         }
//         if (paperCount <= paperIterations *0.25) {
//         fuzzColor = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
//              fuzzWeight = random(0.10*sizeAdjust, 0.20*sizeAdjust);
//           stroke(colorFuzz1);
//         } else if (paperCount <= paperIterations * 0.5) {
        
//         fuzzColor = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
//           fuzzWeight = random(0.005*sizeAdjust, 0.02*sizeAdjust);
//         } else if (paperCount <= paperIterations) {
//         fuzzColor = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
//           // colorFuzz1.setAlpha(0.15);
//            fuzzWeight = random(0.001*sizeAdjust, 0.01*sizeAdjust);
//         }
//         fuzzColor.setAlpha(fuzzAlpha);
//         stroke(fuzzColor);
//         strokeWeight(fuzzWeight);

//         // rx = random(0 + frameSizeW, width - frameSizeW);
//         // ry = random(0 + frameSizeH, height - frameSizeH);
//         rx =  random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker);
//         ry = random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker);
        
//         quad(
//           rx + sizeMarker,
//           ry + sizeMarker,
//           rx + sizeMarker,
//           ry - sizeMarker,
//           rx - sizeMarker,
//           ry + sizeMarker ,
//           rx - sizeMarker ,
//           ry - sizeMarker 
//         );
//         // quad(
//         //   rx + edgeMarker,
//         //   ry + edgeMarker,
//         //   rx + edgeMarker * random(-sizeAdjust, sizeAdjust),
//         //   ry - edgeMarker * random(-sizeAdjust, sizeAdjust),
//         //   rx - edgeMarker * random(-sizeAdjust, sizeAdjust),
//         //   ry + edgeMarker * random(-sizeAdjust, sizeAdjust),
//         //   rx - edgeMarker * random(-sizeAdjust, sizeAdjust),
//         //   ry - edgeMarker * random(-sizeAdjust, sizeAdjust)
//         //   // ry - edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust))
//         // );
//       }