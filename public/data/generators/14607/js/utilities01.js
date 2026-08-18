// Copyright © 2022 Brian Gawlik
// See LICENSE.txt for license information

// this files includes utility funtions
// for the most part, these are functions for handling frequent calculations like picking random values from an array or a range of integers
// also contains functions for handy operations like converting between degrees and radians, solving linear functions, etc.


//////////////////////////////////////////////////////////// Useful Constants
twoPI = Math.PI * 2;
threePIo2 = 3*Math.PI ;
PI = Math.PI;
PIo2 = Math.PI/2;
PIo4 = Math.PI/4;
PIo8 = Math.PI/8;
PIo16 = Math.PI/16;
PIo32 = Math.PI/32;
PIo64 = Math.PI/64;




// UTILITY FUNCTIONS
function getRandomInt(min, max) {
    return Math.floor(myrng() * (max - min + 1) + min);
}
function getRandomFloat(min=0, max=1) {
  return (myrng() * (max - min) + min);
}

function chooseFromArray(array) {
  // return array[Math.floor(myrng() * array.length)];
  let index = getRandomInt( 0, array.length-1 );
  //console.log("index",index)
  return array[ index ];
}

function randomSign() {
  return Math.round(myrng()) * 2 - 1;
}




function lin(  t, [x1,y1], [x2,y2] ) {

  var x = (1-t)*x1 + t*x2;
  var y = (1-t)*y1 + t*y2;

  return [x,y];

}

function bez3( t, [x1,y1], [xC1,yC1], [x2,y2] ) {
    
  var x = (1-t)**2*x1 + 2*(1-t)*t*xC1 + t**2*x2;
  var y = (1-t)**2*y1 + 2*(1-t)*t*yC1 + t**2*y2;
  
  return [x,y];
}


function bez4( t, [x1,y1], [xC1,yC1], [xC2,yC2], [x2,y2] ) {

  var x = (1-t)**3*x1 + 3*(1-t)**2*t*xC1 + 3*(1-t)*t**2*xC2 + t**3*x2;
  var y = (1-t)**3*y1 + 3*(1-t)**2*t*yC1 + 3*(1-t)*t**2*yC2 + t**3*y2;
  
  return [x,y];
}



// function plusOrMinus(amount) {
//   return (Math.round(myrng()) * 2 - 1) * amount;
// }

// function plusOrMinusRange(centerValue, maxAmount) {
//   // var max = amount*value;
//   var newValue = centerValue + randomSign()*getRandomFloat(0,maxAmount);
//   // var sign = (Math.round(myrng()) * 2 - 1) * amount;
//   return newValue;
// }

// function plusOrMinusMax(max) {
//   var randInt = getRandomInt(0,max);
//   return (Math.round(myrng()) * 2 - 1) * randInt;
// }

function plusOrMinus(centerValue, maxAmount) {

  var newValue = centerValue + randomSign()*getRandomFloat(0,maxAmount);

  return newValue;
}


function plusThisMinusThat(centerValue, maxPlusAmount, maxMinusAmount) {

  let maxValue = centerValue + maxPlusAmount
  let minValue = centerValue - maxMinusAmount

  let adjustedCenter = (maxValue + minValue)/2

  let adjustedHalfRange = (maxPlusAmount + maxMinusAmount)/2

  let newValue = adjustedCenter + randomSign()*getRandomFloat(0,adjustedHalfRange);

  return newValue;
}



/////////////////////// vary functions
function vary(parameter, perc) {
  var min = 1-perc/100;
  var max = 1+perc/100;
  var newValue = parameter*getRandomFloat(min, max);
  return newValue;
}

function varyAbove(parameter, perc) {
  var min = 1;
  var max = 1+perc/100;
  var newValue = parameter*getRandomFloat(min, max);
  return newValue;
}

function varyUnder(parameter, perc) {
  var min = 1-perc/100;
  var max = 1;
  var newValue = parameter*getRandomFloat(min, max);
  return newValue;
}






function overunder(perc) {
  return myrng() * (2 * perc / 100) + (1 - perc / 100);
}
function under(perc) {
  return 1.0 - myrng()*(perc/100);
}
function makeChoiceArray(rarity) {
  a = Array(100-rarity).fill(0);
  if (rarity==0){
    c = a;
  } else {
    b = Array(rarity).fill(1);
    c = a.concat(b);
  }
  return c;
}
function makeRandel(rarity) {
  return myrng()<(rarity/100);
}

function makeChoice(rarity) {
  return myrng()<(rarity/100);
}

function deg2rad(thetad) {
  return thetad * Math.PI/180;
}
function rad2deg(thetar) {
  return thetar * 180/Math.PI;
}
function linSolve(x1,y1,x2,y2) {
  m = (y2-y1)/(x2-x1);
  b = y1-m*x1;
  return [b,m];
}

// linear solver given two points
function linSolve ( [x1,y1], [x2,y2] ) {
  var m = (y2-y1)/(x2-x1);
  var b = y1-m*x1;
    let coeffs = [b,m];
    return coeffs;
}
  
  
  
// RANDOM FUNCTIONS
// Make some arrays of random numbers
function createRandomNums(){
  let oneNumList = [];
  var count = 0;
  for (i=0;i<nSeeds;i++) {
      oneNumList = [];
      for (j=0;j<nNums;j++) {
          count += 1;        
          oneNumList.push(Math.random()); 
      }
      randomNums.push(oneNumList);
  }
  return randomNums;
}
// custom random function that is seedable (pulls numbers from randomNums)
function myRandom(seed) {
  randomNumber = randomNums[seed][randCount];
  if(randCount<nNums-1){
    randCount += 1;//add one
  } else {
    randCount = 0;//reset it
  }
  return randomNumber;
}
// function makeTreeSeeds() {
//   for(i=0;i<100;i++) {
//     treeSeed = Math.floor( Math.random()*nSeeds );
//     treeSeeds[i] = treeSeed;
//   }
//   return treeSeeds;
// }

function normal2range(nValue,min,max) {
  return nValue * (max-min) + min;
}

function range2normal(rValue,min,max) {
  return (rValue - min) / (max-min);
}



function makeRandomSegmentation(nDivisions, min, max) {

  var divisionsArray = [];

  for(let k=0; k<nDivisions; k++) {
    divisionsArray.push( getRandomFloat(min,max) );
  }

  divisionsArray.sort();

  return divisionsArray;


}


function sortArrayOfObjectsByKey(array, key, direction) {

  // this function sorts an array of objects (key/value pairs) according to the value of a particular key.
  // can either be ascending or descending. 
  // the value to sort by needs to be numeric.

  if(direction=="ascending") {

      array.sort(function (a, b) {
          return a[key] - b[key];
      });

  } else if (direction=="descending") {

      array.sort(function (a, b) {
          return b[key] - a[key];
      });

  }

  return array;

}







function addImageNoise(squareSize,variation) {

  

  var imageData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  var imageData2 = new ImageData(artboardW, artboardH);
  //ctxToDrawToNow.clearRect(0,0,artboardW,artboardH);

  squareSize = Math.ceil( squareSize * artboardH );

  var squareSizeO2 = Math.ceil(squareSize/2);

  var nW = Math.floor( (artboardW-1)/squareSize );
  var nH = Math.floor( (artboardH-1)/squareSize );

  for(let i=0; i<nW; i++) {
    
    var row = i*squareSize;
    
    for(let j=0; j<nH; j++) {    
      
      var col = j*squareSize;
      
      var A = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 3];
      
      if(A==0) {continue;}

      var R = imageData.data[((row * (artboardW * 4)) + (col * 4))    ];
      var G = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 1];
      var B = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 2];
    
    
      //var R2 = vary(R, variation);
      //var G2 = vary(G, variation);
      //var B2 = vary(B, variation);
      var A2 = vary(A, variation);
      
      //imageData.data[((row * (artboardW * 4)) + (200 * 4))    ] = R2;
      //imageData.data[((row * (artboardW * 4)) + (200 * 4)) + 1] = G2;
      //imageData.data[((row * (artboardW * 4)) + (200 * 4)) + 2] = B2;
      
      for(let k=-squareSizeO2; k<squareSizeO2; k++) {
        
        var row2 = row + k;
        
        for(let l=-squareSizeO2; l<squareSizeO2; l++) {
          
          var col2 = col + l;
          
          imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4))    ] = R;
          imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 1] = G;
          imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 2] = B;
          imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 3] = A2;

        }

      }
      
      
    }
  }


  

  ctxToDrawToNow.putImageData(imageData2,0,0);

}






function addImageNoiseCirc(squareSize, variation, spread) {


  // just return immediately if the spread is zero
  if(spread==0) {return;}


  var imageData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  //var imageData2 = new ImageData(artboardW, artboardH);
  ctxToDrawToNow.clearRect(0,0,artboardW,artboardH);

  squareSize = Math.floor( squareSize * artboardH );

  spread = Math.floor( spread * artboardH );

  var circRad0 = Math.ceil(squareSize/2);

  // how many "squares" there are 
  var nW = Math.floor( (artboardW-1) / squareSize );
  var nH = Math.floor( (artboardH-1) / squareSize );

  for(let i=0; i<nH; i++) {
    
    var row = i*squareSize;
    
    for(let j=0; j<nW; j++) {    
      
      var col = j*squareSize;
      
      var A = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 3];
      
      if(A==0) {continue;}

      var R = imageData.data[((row * (artboardW * 4)) + (col * 4))    ];
      var G = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 1];
      var B = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 2];

      // note that alpha comes from the pixel as 0-255 but needs to be in 0-1.
      var Anorm = A/255;
    
    
      //var R2 = vary(R, variation);
      //var G2 = vary(G, variation);
      //var B2 = vary(B, variation);
      //var R2 = vary(R, variation);

      //console.log(A2);
      
      //imageData.data[((row * (artboardW * 4)) + (200 * 4))    ] = R2;
      //imageData.data[((row * (artboardW * 4)) + (200 * 4)) + 1] = G2;
      //imageData.data[((row * (artboardW * 4)) + (200 * 4)) + 2] = B2;
      
      //for(let k=-squareSizeO2; k<squareSizeO2; k++) {
        
        //var row2 = row + k;
        
        //for(let l=-squareSizeO2; l<squareSizeO2; l++) {
          
          //var col2 = col + l;
          
          //imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4))    ] = R;
          ///imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 1] = G;
          //imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 2] = B;
          //imageData2.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 3] = A2;

      var row2 = plusOrMinus(row,spread);
      var col2 = plusOrMinus(col,spread);

      var circRad = vary(circRad0,50);

      ctxToDrawToNow.beginPath();
      ctxToDrawToNow.ellipse(col2, row2, circRad, circRad, 0, 0, twoPI);
      ctxToDrawToNow.fillStyle = 'rgba(' + R + ', ' +  G + ', ' + B + ', '  + Anorm + ')'; 
      ctxToDrawToNow.fill();

      //var str = 'rgba(' + R + ', ' +  G + ', ' + B + ', '  + Anorm + ')';
      //console.log(str);

      

       // }

     // }
      
      
    }
  }


  

  //ctxToDrawToNow.putImageData(imageData2,0,0);

}








function blurPixBez(squareSize, radOffset, spread, originalOn=0, onOff=1) {

  


  // just return immediately if set to off
  if(onOff==0) {return;}

  // just return immediately if the spread is zero
  if(spread==0) {return;}



  ///////////////////////////////// Build thetaArray
  var radArray = [];

  var nChoices = 100;

  var radMax = Math.floor( spread * artboardH );

  var radMid = radOffset * radMax;

  for(let i=0; i<nChoices; i++) {
    
    var t = i/nChoices;
    
    var [rad, nTimes] = bez3(t,  [0,100], [radMid, 1], [radMax,1] ); 
        
    for(let j=0; j<nTimes; j++) {
      
      radArray.push(rad);
      
    }
      
  }

 // console.log(radArray);




  var imageData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  //var imageDataOriginal = imageData;

  if(originalOn==0) {
    ctxToDrawToNow.clearRect(0,0,artboardW,artboardH);
  }

  squareSize = Math.floor( squareSize * artboardH );

  spread = Math.floor( spread * artboardH );

  var circRad0 = Math.ceil(squareSize/2);

  // how many "squares" there are 
  var nW = Math.floor( (artboardW-1) / squareSize );
  var nH = Math.floor( (artboardH-1) / squareSize );

  for(let i=0; i<nH; i++) {

    
    
    var row = i*squareSize;
    
    for(let j=0; j<nW; j++) {    
      
      var col = j*squareSize;
      
      var A = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 3];

      // console.log("A",A)
      
      if(A==0) {continue;}

      var R = imageData.data[((row * (artboardW * 4)) + (col * 4))    ];
      var G = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 1];
      var B = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 2];

      // if( makeChoice(blackProb) ) {
      //   R = 0;
      //   G = 0;
      //   B = 0;
      // }

      // note that alpha comes from the pixel as 0-255 but needs to be in 0-1.
      var Anorm = A/255;
      // var Anorm = 1;

      
    
  
      rad = chooseFromArray(radArray);

      var thetaR = getRandomFloat(0,twoPI);

      var row2 = row + rad * Math.cos(thetaR);
      var col2 = col + rad * Math.sin(thetaR);

      var circRad = vary(circRad0,50);

      ctxToDrawToNow.beginPath();
      ctxToDrawToNow.ellipse(col2, row2, circRad, circRad, 0, 0, twoPI);
      ctxToDrawToNow.fillStyle = 'rgba(' + R + ', ' +  G + ', ' + B + ', '  + Anorm + ')'; 
      ctxToDrawToNow.fill();


    }
  }


}








function blurLinesA(squareSize, radOffset, spread, originalOn=0, onOff=1) {


  // just return immediately if set to off
  if(onOff==0) {return;}

  // just return immediately if the spread is zero
  if(spread==0) {return;}


  //nChoices = dog * 3;





  ///////////////////////////////// Build thetaArray
  var radArray = [];

  var nChoices = 100;

  var radMax = Math.floor( spread * artboardH );

  var radMid = radOffset * radMax;

  for(let i=0; i<nChoices; i++) {
    
    var t = i/nChoices;
    
    var [rad, nTimes] = bez3(t,  [0,100], [radMid, 1], [radMax,1] ); 
        
    for(let j=0; j<nTimes; j++) {
      
      radArray.push(rad);
      
    }
      
  }

 // console.log(radArray);




  var imageData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  //var imageDataOriginal = imageData;

  if(originalOn==0) {
    ctxToDrawToNow.clearRect(0,0,artboardW,artboardH);
  }

  squareSize = Math.floor( squareSize * artboardH );

  spread = Math.floor( spread * artboardH );

  var circRad0 = Math.ceil(squareSize/2);

  // how many "squares" there are 
  var nW = Math.floor( (artboardW-1) / squareSize );
  var nH = Math.floor( (artboardH-1) / squareSize );

  for(let i=0; i<nH; i++) {
    
    var row = i*squareSize;
    
    for(let j=0; j<nW; j++) {    
      
      var col = j*squareSize;
      
      var A = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 3];
      
      if(A==0) {continue;}

      var R = imageData.data[((row * (artboardW * 4)) + (col * 4))    ];
      var G = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 1];
      var B = imageData.data[((row * (artboardW * 4)) + (col * 4)) + 2];

      // note that alpha comes from the pixel as 0-255 but needs to be in 0-1.
      var Anorm = A/255;

      var R = vary(R,10);
      var G = vary(G,10);
      var B = vary(B,10);
    
  
      //rad = chooseFromArray(radArray);

      rad = getRandomFloat(0,radMax);

      var thetaR = getRandomFloat(0,twoPI);

      var row2 = row + rad * Math.cos(thetaR);
      var col2 = col + rad * Math.sin(thetaR);

      var circRad = vary(circRad0,50);

      ctxToDrawToNow.beginPath();
      //ctxToDrawToNow.ellipse(col2, row2, circRad, circRad, 0, 0, twoPI);

      ctxToDrawToNow.moveTo(col2+circRad, row2);
      ctxToDrawToNow.lineTo(col2, row2);
      ctxToDrawToNow.lineWidth = 1;

      ctxToDrawToNow.strokeStyle = 'rgba(' + R + ', ' +  G + ', ' + B + ', '  + Anorm + ')'; 
      ctxToDrawToNow.stroke();


    }
  }


}








function addImageBlur(squareSize) {

  var imageData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  squareSize = Math.ceil( squareSize * artboardH );

  for(let i=0; i<artboardW; i++) {
    
    var row = i;
    
    for(let j=0; j<artboardH; j++) {    
      
      var col = j;      
      
      var m = 0;
      var R = [];
      var G = [];
      var B = [];
      var A = [];
      
      for(let k=-squareSize; k<squareSize; k++) {
        
        var row2 = row + k;
        
        for(let l=0; l<1; l++) {
          
          var col2 = col + l;          
          
          R[m] = imageData.data[((row2 * (artboardW * 4)) + (col2 * 4))    ];
          G[m] = imageData.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 1];
          B[m] = imageData.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 2];
          A[m] = imageData.data[((row2 * (artboardW * 4)) + (col2 * 4)) + 3];

          m = m + 1; 

        }

      }

      var R2 = R.reduce((a,b) => a + b, 0) / m;
      var G2 = G.reduce((a,b) => a + b, 0) / m;
      var B2 = B.reduce((a,b) => a + b, 0) / m;
      var A2 = A.reduce((a,b) => a + b, 0) / m;

      imageData.data[((row * (artboardW * 4)) + (col * 4))    ] = R2;
      imageData.data[((row * (artboardW * 4)) + (col * 4)) + 1] = G2;
      imageData.data[((row * (artboardW * 4)) + (col * 4)) + 2] = B2;
      imageData.data[((row * (artboardW * 4)) + (col * 4)) + 3] = A2;
      
      
    }
  }


  //ctxToDrawToNow.clearRect(0,0,artboardW,artboardH);

  ctxToDrawToNow.putImageData(imageData,0,0);

}









function blurImageClipA(blur, drawingImageData, shadowImageBitmap, maskImgData) {

  //if(blur==0) {return;}


  // get your original image (pre-clip, pre-blur)
  //var imageData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);


  // apply the blur to the ctx and redraw the drawing
  var blurPX = (blur*artboardH);

  // console.log(blurPX)

  ctxToDrawToNow.filter = "blur(" + blurPX.toString() + 'px)';

  //// was here for testing purposes
  // ctxToDrawToNow.rect(0, 0, 200, 200);
  // ctxToDrawToNow.fillStyle = 'hsla(' + 100 + ', ' +  100 + '%, ' + 50 + '%,'  + 255 + ')'; 
  // ctxToDrawToNow.fill();

  //ctxToDrawToNow.putImageData(shadowImageData, 0, 0);

  ctxOff_1.drawImage(shadowImageBitmap, 0, 0, artboardW, artboardH);

  var shadowImageBitmap_Blurred = canvasOff_1.transferToImageBitmap(); 
  
  ctxOff_1.drawImage(shadowImageBitmap_Blurred, 0, 0, artboardW, artboardH);

  var shadowImageData_Blurred = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);





  //




  
  var shadowImageData_Blurred = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  ctxToDrawToNow.clearRect(0, 0, artboardW, artboardH);



  //var maskImgData = ctxToDrawToNow.getImageData(0, 0, artboardW, artboardH);

  var shadowImageData_Clipped = new ImageData(artboardW,artboardH);

  // squareSize = Math.ceil( squareSize * artboardH );

  for(let i=0; i<artboardW; i++) {
    
    var row = i;
    
    for(let j=0; j<artboardH; j++) {    
      
      var col = j;   

      


      var maskA = maskImgData.data[((row * (artboardW * 4)) + (col * 4)) + 3];

      if( maskA==255 ) {

        var R_Clipped = shadowImageData_Blurred.data[((row * (artboardW * 4)) + (col * 4))    ];
        var G_Clipped = shadowImageData_Blurred.data[((row * (artboardW * 4)) + (col * 4)) + 1];
        var B_Clipped = shadowImageData_Blurred.data[((row * (artboardW * 4)) + (col * 4)) + 2];
        var A_Clipped = shadowImageData_Blurred.data[((row * (artboardW * 4)) + (col * 4)) + 3];

        //console.log("A_Clipped", A_Clipped);

      } else {

        var R_Clipped = 0;
        var G_Clipped = 0;
        var B_Clipped = 0;
        var A_Clipped = 0;

        // do nothing?

      }


      shadowImageData_Clipped.data[((row * (artboardW * 4)) + (col * 4))    ] = R_Clipped;
      shadowImageData_Clipped.data[((row * (artboardW * 4)) + (col * 4)) + 1] = G_Clipped;
      shadowImageData_Clipped.data[((row * (artboardW * 4)) + (col * 4)) + 2] = B_Clipped;
      shadowImageData_Clipped.data[((row * (artboardW * 4)) + (col * 4)) + 3] = A_Clipped;      
      
    }

  }

  // reset the filter so blur is off
  ctxToDrawToNow.filter = 'none';

  // get the imageBitmap for the clipped shadow
  ctxToDrawToNow.clearRect(0, 0, artboardW, artboardH);
  ctxToDrawToNow.putImageData(shadowImageData_Clipped,0,0);
  var shadowImageBitmap_Clipped = canvasOff_1.transferToImageBitmap();


  // draw the base object
  ctxToDrawToNow.putImageData(drawingImageData,0,0);

  


  //ctxToDrawToNow.clearRect(0,0,artboardW,artboardH);

  //ctxToDrawToNow.putImageData(maskImgData,0,0);

  //ctxToDrawToNow.putImageData(shadowImageData,0,0);


  
// draw the clipped shadow
  ctxToDrawToNow.drawImage(shadowImageBitmap_Clipped, 0, 0, artboardW, artboardH);

  //ctxToDrawToNow.putImageData(shadowImageData_Blurred,0,0);

  

  //ctxToDrawToNow.putImageData(shadowImageData_Clipped,0,0);

  
}









function redraw() {

  // turn off noDrawMode
  noDrawMode = 0;

  // redraw and redraw images
  drawAll();
  drawAllImages();

}









// convenience function for listing out the parameters in an algorithm. takes the string algName (e.g. "treeLineB").
function listAlgParams( algName ) {

  var algDict = window[algName];

  var algName = algName.substr(0,algName.length-1);

  var keys = Object.keys(algDict);

  let string = "\n";

  for(let i=0; i<keys.length; i++) {

    let key = keys[i];

    let className = algDict[key].class;

    if(className=="text") {continue;}

    let defaultValue = algDict[key].default;

    string = string + algName + "." + key + " = " + "{value:" + defaultValue + "}" + "\n"

    console.log( string )

  }

}










function evenlySpacedInterval(min,max,N) {

  let array = [];

  if(N==1) {

    array[0] = (max+min)/2

  } else if (N>1) {

    let step = (max-min)/(N-1);

    for(let i=0; i<N; i++) {
      array[i] = min + step*i;
    }

  } else {

    console.warn("interval has less than 1 step, and that don't work right...")
    
  }

  return array;

}





function evenlySpacedIntervalRand(min,max,N) {


  let array = evenlySpacedInterval(min,max,N);

  let arrayJumbled = []

  let nRemaining = N;

  for(let i=0; i<N; i++) {

    let randIndex = getRandomInt(0,nRemaining-1)

    arrayJumbled.push( array[randIndex] );

    array.splice( randIndex,1 );

    nRemaining = nRemaining - 1;
    
  }

  return arrayJumbled;

}