/*
   ▄▄▄▄▀ ▄  █ ▄███▄   ██     ▄▄▄▄▀ ▄███▄   █▄▄▄▄   ▄▀  ████▄ ▄███▄   █▄▄▄▄   ▄▄▄▄▄   
▀▀▀ █   █   █ █▀   ▀  █ █ ▀▀▀ █    █▀   ▀  █  ▄▀ ▄▀    █   █ █▀   ▀  █  ▄▀  █     ▀▄ 
    █   ██▀▀█ ██▄▄    █▄▄█    █    ██▄▄    █▀▀▌  █ ▀▄  █   █ ██▄▄    █▀▀▌ ▄  ▀▀▀▀▄   
   █    █   █ █▄   ▄▀ █  █   █     █▄   ▄▀ █  █  █   █ ▀████ █▄   ▄▀ █  █  ▀▄▄▄▄▀    
  ▀        █  ▀███▀      █  ▀      ▀███▀     █    ███        ▀███▀     █             
          ▀             █                   ▀                         ▀              
                       ▀                                                             
*/
// Made with p5js and <3 by Michael Perusse. 

var noiseSeedMaster;
var wobbleFactor;
var seatType;
var numRows;
var numCols;
var wobbleFactorType;
var type;
var noiseType;
var backgroundStyle;
var useOutline;
var showRip;
var allDead;
var useSpiral;
var offSetType;

function setup() {
  var canvasWidth = (windowHeight * 0.97) / (2**0.5);
  var canvasHeight = (windowHeight * 0.97);
  createCanvas(canvasWidth, canvasHeight);
  noLoop();
  colorMode(HSB, 100);
  noiseSeedMaster = map(fxrand(), 0, 1, 0, 100);
  var seed = int(map(fxrand(), 0, 1, 0, 1000000000));
  noiseSeed(map(fxrand(), 0, 1, 0, 10000000000));
  print(seed);
}

function flowField(points, maxPushedAmount) {
  
  var outputPoints = [];
  
  for (var i = 0; i < points.length; i++){
    var x = points[i][0];
    var y = points[i][1];
    
    var noiseX = map(noise(x / (width/4), y / (height/4)), 0, 1, -1 * maxPushedAmount, maxPushedAmount);
    var noiseY = map(noise(x / (width/4), y / (height/4)), 0, 1, -1 * maxPushedAmount, maxPushedAmount)
    
    var vectorFieldX = map(y - x + width/2, -1*width, height, -1 * maxPushedAmount, maxPushedAmount);
    var vectorFieldY = map(-1*x - y + height/2, -1*width - height, 0, -1 * maxPushedAmount, maxPushedAmount);
    
    var noiseWeight = wobbleFactor;
    var vectorFieldWeight = 0.01;
    
    var compositeX = x + (noiseWeight*noiseX) + (vectorFieldWeight*vectorFieldX);
    var compositeY = y + (noiseWeight*noiseY) + (vectorFieldWeight*vectorFieldY);
    
    outputPoints.push([compositeX, compositeY]);
  }
  return outputPoints;
}

function interpolate(a, b, numPoints) {
  
  var interpolatedPoints = [];
  noiseSeed(noiseSeedMaster);
  for (var i = 0; i < numPoints; i++) {
    var nx = a[0] + (b[0] - a[0]) * (1 / numPoints) * i;
    var ny = a[1] + (b[1] - a[1]) * (1 / numPoints) * i;
    interpolatedPoints.push([nx, ny]);
  }
    return interpolatedPoints;
}

function createVertices(points) {
  for (var i = 0; i < points.length; i++){
        vertex(points[i][0], points[i][1])
      }
}

function createCirclePoints(x, y, radius, interpolation, noiseType, circleNoiseX, circleNoiseY) {
  
  var circlePoints = [];
  var angle;

  if (noiseType == "None") {
      for (var i = 0; i < interpolation; i++) {
        angle = map(i, 0, interpolation, 0, 2 * PI);
        circlePoints.push([x + radius*(cos(angle)), y + radius*(sin(angle))]);
      }
  }
  else if (noiseType == "Random") {
      for (var i = 0; i < interpolation; i++) {
        angle = map(i, 0, interpolation, 0, 2 * PI);
        circlePoints.push([x + radius*(cos(angle)) + map(fxrand(), 0, 1, -1*circleNoiseX/2, circleNoiseX/2), y + radius*(sin(angle)) + map(fxrand(), 0, 1, -1*circleNoiseY/2, circleNoiseY/2)]);
      }
  }
  else if (noiseType == "Noise") {
      for (var i = 0; i < interpolation; i++) {
        angle = map(i, 0, interpolation, 0, 2 * PI);
        circlePoints.push([x + radius*(cos(angle)) + map(noise(x, y), 0, 1, -1*circleNoiseX, circleNoiseX), y + radius*(sin(angle)) + map(noise(x, y), 0, 1, -1*circleNoiseY, circleNoiseY)]);
      }
  }
  else if (noiseType == "Sketch") {
      for (var i = 0; i < interpolation; i++) {
        angle = map(i, 0, interpolation, 0, 2 * PI);
        circlePoints.push([x + radius*(cos(angle*11.4)*sin(angle/1)), y + radius*(sin(angle*11.4))]);
      }
  }
  
  return circlePoints;
}

function createBendyCircle(x, y, radius, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline, noiseType, circleNoiseX, circleNoiseY) {
  
  fill(fillColor);
  stroke(strokeColor);
  strokeWeight(strokeThickness);
  
  if (!useOutline){
      noStroke();
  }
  beginShape();
      createVertices(flowField(createCirclePoints(x, y, radius, interpolation, noiseType, circleNoiseX, circleNoiseY), bendMagnitude));
  endShape(CLOSE);
}

function createRectPoints(x, y, width, interpolation) {
  var rectPoints = [];
  
  for (var i = 0; i < interpolation; i++){
    rectPoints.push([x + width*(i/interpolation), y]);
  }
  for (var i = 0; i < interpolation; i++){
    rectPoints.push([x + width, y + width*(i/interpolation)]);
  }
  for (var i = 0; i < interpolation; i++){
    rectPoints.push([x + width - width*(i/interpolation), y + width]);
  }
  for (var i = 0; i < interpolation; i++){
    rectPoints.push([x, y + width - width*(i/interpolation)]);
  }
  
  return rectPoints;
}

function createBendyRect(x, y, width, bendMagnitude) {
  
  var interpolation = width / 10;
  beginShape();
    createVertices(flowField(createRectPoints(x, y, width, interpolation), bendMagnitude));
  endShape(CLOSE);
}

function createBackground(type, noiseType) {
  
  var backgroundColor;
  var blockcolor;
  
  var white = color(13.4, 0, 92);
  var black = color(54, 23, 0);
  
  if (randomFromList([0,1])) {
    backgroundColor = white;
    blockColor = black;
  }
  else {
    backgroundColor = black;
    blockColor = white;
  }
  
  if (noiseType == "Sketch") {
    backgroundColor = black;
    blockColor = black;
  }
  
  background(backgroundColor);
  
  noStroke();
  
  fill(blockColor);
  
  var showSolidColor = randomFromList([0,1,2]);
  
  // Show solid black or white
  if (type == "Solid") {
      beginShape();
        vertex(0, 0);
        vertex(0, height);
        vertex(width, height);
        vertex(width, 0);
      endShape(CLOSE);
  }
  else if (type == "PerfectSlice") {
         var sliceHorizontally = randomFromList([0,1]);
         var blackOnBottomOrLeft = randomFromList([0,1]);

        if (sliceHorizontally) {
            beginShape();
              var slice1Height = map(fxrand(), 0, 1, height * 0.1, height * 0.9);
              var slice2Height = map(fxrand(), 0, 1, height * 0.1, height * 0.9);
              var bendMagnitude = 0;
              var numPoints = 1;


              vertex(width*-0.1, slice1Height);
              createVertices(flowField(interpolate([width*-0.1,slice1Height], [width*1.1, slice2Height], numPoints), bendMagnitude));
              vertex(width*1.1, slice2Height)
              vertex(width, height);
              vertex(0, height); 
            endShape(CLOSE);
        }
        else {

          var slice1Width = map(fxrand(), 0, 1, width * 0.1, width * 0.9);
          var slice2Width = map(fxrand(), 0, 1, width * 0.1, width * 0.9);

          var bendMagnitude = 0;
          var numPoints = 1;


          beginShape();
              vertex(0, 0);
              vertex(0, height);
              createVertices(flowField(interpolate([slice1Width,height *1.1], [slice2Width, height * -0.1], numPoints), bendMagnitude));
              vertex(slice2Width, 0);
              // vertex(width/4, 0);
            endShape(CLOSE);
        }
      
  }
  else if (type == "SmoothSlice") {
       // Slice black or white
         var sliceHorizontally = randomFromList([0,1]);
         var blackOnBottomOrLeft = randomFromList([0,1]);

        if (sliceHorizontally) {
            beginShape();
              var slice1Height = map(fxrand(), 0, 1, height * 0.1, height * 0.9);
              var slice2Height = map(fxrand(), 0, 1, height * 0.1, height * 0.9);
              var bendMagnitude = width/10;
              var numPoints = width;


              vertex(width*-0.1, slice1Height);
              createVertices(flowField(interpolate([width*-0.1,slice1Height], [width*1.1, slice2Height], numPoints), bendMagnitude));
              vertex(width*1.1, slice2Height)
              vertex(width, height);
              vertex(0, height); 
            endShape(CLOSE);
        }
        else {

          var slice1Width = map(fxrand(), 0, 1, width * 0.1, width * 0.9);
          var slice2Width = map(fxrand(), 0, 1, width * 0.1, width * 0.9);

          var bendMagnitude = height/20;
          var numPoints = height;


          beginShape();
              vertex(0, 0);
              vertex(0, height);
              createVertices(flowField(interpolate([slice1Width,height *1.1], [slice2Width, height * -0.1], numPoints), bendMagnitude));
              vertex(slice2Width, 0);
          endShape(CLOSE);
        }
      
  }
  else if (type == "JaggedSlice") {

         var sliceHorizontally = randomFromList([0,1]);
         var blackOnBottomOrLeft = randomFromList([0,1]);

        if (sliceHorizontally) {
            beginShape();
              var slice1Height = map(fxrand(), 0, 1, height * 0.1, height * 0.9);
              var slice2Height = map(fxrand(), 0, 1, height * 0.1, height * 0.9);
              var bendMagnitude = width/2;
              var numPoints = int(map(fxrand(), 0, 1, 2, 4));

              vertex(width*-0.1, slice1Height);
              createVertices(flowField(interpolate([width*-0.1,slice1Height], [width*1.1, slice2Height], numPoints), bendMagnitude));
              vertex(width*1.1, slice2Height)
              vertex(width, height);
              vertex(0, height); 
            endShape(CLOSE);
        }
        else {

          var slice1Width = map(fxrand(), 0, 1, width * 0.1, width * 0.9);
          var slice2Width = map(fxrand(), 0, 1, width * 0.1, width * 0.9);

          var bendMagnitude = height/2;
          var numPoints = int(map(fxrand(), 0, 1, 2, 4));

          beginShape();
              vertex(0, 0);
              vertex(0, height);
              createVertices(flowField(interpolate([slice1Width,height *1.1], [slice2Width, height * -0.1], numPoints), bendMagnitude));
              vertex(slice2Width, 0);
          endShape(CLOSE);
        }
  }
}


function createXPoints(x, y, radius, interpolation, strokeDirection) {
  
  var linePoints = [];
  
  if (strokeDirection == "DOWN") {
      for (var i = -1*interpolation/2; i < interpolation/2; i++) {

      linePoints.push([x + i * (radius / interpolation), y + i * (radius / interpolation)])
    }
  }
  
  else if (strokeDirection == "UP") {
    for (var i = -1*interpolation/2; i < interpolation/2; i++) {

      linePoints.push([x + i * (radius / interpolation), y - i * (radius / interpolation)])
    }
  }
  return linePoints;
}


function createHeartPoints(x, y, radius, interpolation, strokeDirection) {
  
  var linePoints = [];
  
  linePoints.push(x,y);
  
  var t;

    for (var i = 0; i <= interpolation; i++) {
      t = map(i, 0, interpolation, 0, 2*PI);

          linePoints.push([x + radius*16*((sin(t)**3)), y - radius*(13*cos(t) - 5*cos(2*t) - 2*cos(3*t) - cos(4*t))])
 
    }
  return linePoints;
}

function createBendyX(x, y, radius, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline) {
    
  fill(fillColor);
  stroke(color('black'));
  strokeWeight(strokeThickness);
  
  radius *= 1.2;
  strokeWeight(strokeThickness*3)
  
  beginShape();
      createVertices(flowField(createXPoints(x, y, radius, interpolation, "UP"), bendMagnitude));
  endShape(CLOSE);
  
  beginShape();
      createVertices(flowField(createXPoints(x, y, radius, interpolation, "DOWN"), bendMagnitude));
  endShape(CLOSE);
}


function createBendyHeart(x, y, radius, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline) {
    
  fill(color(0, 75, 54));
  stroke(color(0, 75, 54));
  strokeWeight(strokeThickness);
  
  strokeWeight(strokeThickness*3)
  
  interpolation = 1000 * (width/600);
  
  beginShape();
      createVertices(flowField(createHeartPoints(x, y, radius, interpolation, "UP"), bendMagnitude));
  endShape(CLOSE);
}

function drawEyeType(i, j, eyeType, xDiffEyes, yDiffEyes, numRows, numCols, radiusHead, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, allAtOneIJ, paddingMultiplier, radiusEyes, useOutline, noiseType, circleNoiseX, circleNoiseY, spiralMagnitude, useSpiral, offSetType, radiusBody) {

         var x = (i * (width * paddingMultiplier) / numRows) - (( width*paddingMultiplier - width)/2);
      var y = (j * (height * paddingMultiplier) / numCols) - ((height*paddingMultiplier - height)/2);
        
  
        if (offSetType == "None") {
          // Do Nothing
        }
        else if (offSetType == "Heads") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Row") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Col") {
          if (i % 2 == 0) {
            y -= radiusBody/2;
          }
          else {
            y += radiusBody/2;
          }
        }

        if (useSpiral) {
          var x2 = spiralXOrY("X", x, y, spiralMagnitude);
          var y2 = spiralXOrY("Y", x, y, spiralMagnitude);
          x = x2;
          y = y2;  
        } 
  
    if (eyeType == "Normal") {
      // Left Eye
      createBendyCircle(x + radiusHead / 2 - xDiffEyes, y - yDiffEyes, radiusEyes, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline, noiseType, circleNoiseX, circleNoiseY);
  
      // Right Eye
      createBendyCircle(x - radiusHead / 2 - xDiffEyes, y - yDiffEyes, radiusEyes, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline, noiseType, circleNoiseX, circleNoiseY);
    }
    else if (eyeType == "X") {
      radiusEyes *= 2;
      strokeThickness = radiusHead/45.714;
      
      createBendyX(x + radiusHead / 2 - xDiffEyes, y - yDiffEyes, radiusEyes, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline);
  
      createBendyX(x - radiusHead / 2 - xDiffEyes, y - yDiffEyes, radiusEyes, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline);
      
    }
}


function eyeCannon(i, j, type, xDiffEyes, yDiffEyes, numRows, numCols, radiusHead, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, allAtOneIJ, paddingMultiplier, radiusEyes, useOutline, noiseType, circleNoiseX, circleNoiseY, showRIP, allDead, spiralMagnitude, useSpiral, offSetType, radiusBody) {
 
        x = (i * (width * paddingMultiplier) / numRows) - (( width*paddingMultiplier - width)/2);
        y = (j * (height * paddingMultiplier) / numCols) - ((height*paddingMultiplier - height)/2);
  
          if (offSetType == "None") {
          // Do Nothing
        }
        else if (offSetType == "Heads") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Row") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Col") {
          if (i % 2 == 0) {
            y -= radiusBody/2;
          }
          else {
            y += radiusBody/2;
          }
        }
  
  if (useSpiral) {
        var x2 = spiralXOrY("X", x, y, 0.7);
        var y2 = spiralXOrY("Y", x, y, 0.7);
        x = x2;
        y = y2;
  }

  if (type == "Random") {
    var isLookingUp = randomFromList([0,1, 2]);
    var isLookingLeft = randomFromList([0,1, 2]);
    
    if (isLookingUp == 0) {
        yDiffEyes += -1 * radiusHead / 2.5;
      }
      else if (isLookingUp == 1) {
        yDiffEyes += 1 * radiusHead / 2.5;
      }
    
    if (isLookingLeft == 0) {
      xDiffEyes += -1 * radiusHead / 2.5;
    }
    else if (isLookingLeft == 1) {
      xDiffEyes += 1 * radiusHead / 2.5;
    }
  }
  else if (type == "UpDownRandom") {
      var isLookingUp = randomFromList([0,1]);

      if (isLookingUp == 0) {
        yDiffEyes += -1 * radiusHead / 2.25;
      }
      else if (isLookingUp == 1) {
        yDiffEyes += 1 * radiusHead / 2.25;
      }
  }
  else if (type == "LeftRightRandom") {
    var isLookingLeft = randomFromList([0,1]);

    if (isLookingLeft == 0) {
      xDiffEyes += -1 * radiusHead / 2.5;
    }
    else if (isLookingLeft == 1) {
      xDiffEyes += 1 * radiusHead / 2.5;
    }
  }
  else if (type == "Straight") {
    // Do Nothing
  }
  else if (type == "Up") {
    yDiffEyes += radiusHead / 2.25;
  }
  else if (type == "Down") {
    yDiffEyes += -1 * radiusHead / 2.25;
  }
  else if (type == "Left") {
    xDiffEyes += radiusHead / 2.25;
  }
  else if (type == "Right") {
    xDiffEyes += -1 * radiusHead / 2.25;
  }
  else if (type == "LeftRightSplitVerticalTowards") {
    if (x < width/2) {
      xDiffEyes -= radiusHead / 2.5;
    }
    else if (x == width/2) {
      xDiffEyes += 0;
    }
    else if (x > width/2){
      xDiffEyes -= -1 * radiusHead / 2.5;
    }
  }
  else if (type == "LeftRightSplitVerticalAway") {
    if (x < width/2) {
      xDiffEyes += radiusHead / 2.5;
    }
    else if (x == width/2) {
      xDiffEyes += 0;
    }
    else if (x > width/2){
      xDiffEyes += -1 * radiusHead / 2.5;
    }
  }
  else if (type == "UpDownSplitHorizontalAway") {
    if (y < height/2) {
      yDiffEyes += radiusHead / 2.5;
    }
    else if (y == height/2) {
      yDiffEyes += 0;
    }
    else if (y > height/2){
      yDiffEyes += -1 * radiusHead / 2.5;
    }
  }
  else if (type == "UpDownSplitHorizontalTowards") {
    if (y < height/2) {
      yDiffEyes -= radiusHead / 2.25;
    }
    else if (y == height/2) {
      yDiffEyes += 0;
    }
    else if (y > height/2){
      yDiffEyes -= -1 * radiusHead / 2.25;
    }
  }
  else if (type == "UpDownSplitVertical1") {
    if (x < width/2) {
      yDiffEyes += radiusHead / 2.25;
    }
    else if (x == width/2) {
      yDiffEyes += 0;
    }
    else if (x > width/2){
      yDiffEyes += -1 * radiusHead / 2.25;
    }
  }
  else if (type == "UpDownSplitVertical2") {
    if (x < width/2) {
      yDiffEyes -= radiusHead / 2.25;
    }
    else if (x == width/2) {
      yDiffEyes += 0;
    }
    else if (x > width/2){
      yDiffEyes -= -1 * radiusHead / 2.25;
    }
  }
  else if (type == "ChosenOne") {
    if (i == allAtOneIJ[0] && j == allAtOneIJ[1]) {
      // do nothing, stare straight forward, chosen one
    }
    else {
      // X shift
      if (i < allAtOneIJ[0]) {
         xDiffEyes -= radiusHead / 2.5;
      }
      else if (i == allAtOneIJ[0]) {
         xDiffEyes += 0;
      }
      else if (i > allAtOneIJ[0]) {
         xDiffEyes += radiusHead / 2.5;
      }
      
      // Y Shift
      if (j < allAtOneIJ[1]) {
         yDiffEyes -= radiusHead / 2.5;
      }
      else if (j == allAtOneIJ[1]) {
         yDiffEyes += 0;
      }
      else if (j > allAtOneIJ[1]) {
         yDiffEyes += radiusHead / 2.5;
      }
    }
  }
  else if (type == "Shunned") {
    if (i == allAtOneIJ[0] && j == allAtOneIJ[1]) {
      // do nothing, stare straight forward, shunned
    }
    else {
      // X shift
      if (i < allAtOneIJ[0]) {
         xDiffEyes += radiusHead / 2.5;
      }
      else if (i == allAtOneIJ[0]) {
         xDiffEyes += 0;
      }
      else if (i > allAtOneIJ[0]) {
         xDiffEyes -= radiusHead / 2.5;
      }

      if (j < allAtOneIJ[1]) {
         yDiffEyes += radiusHead / 2.5;
      }
      else if (j == allAtOneIJ[1]) {
         yDiffEyes += 0;
      }
      else if (j > allAtOneIJ[1]) {
         yDiffEyes -= radiusHead / 2.5;
      }
    }
  }
  else if (type == "Clockwise") {

      // Bottom Left
      if (x < width / 2 && y > height / 2) {
         yDiffEyes += radiusHead / 2.5;
      } // Top Left
      else if (x < width / 2 && y < height / 2) {
         xDiffEyes -= radiusHead / 2.5;
      } // Top Right
      else if (x > width / 2 && y < height / 2) {
           yDiffEyes -= radiusHead / 2.5;
      } // Bottom Right
      else if (x > width / 2 && y > height / 2) {
           xDiffEyes += radiusHead / 2.5;
      }
    
  }
    else if (type == "CounterClockwise") {

      // Bottom Left
      if (x < width / 2 && y > height / 2) {
         xDiffEyes -= radiusHead / 2.5;
      } // Top Left
      else if (x < width / 2 && y < height / 2) {
         yDiffEyes -= radiusHead / 2.5;
      } // Top Right
      else if (x > width / 2 && y < height / 2) {
           xDiffEyes += radiusHead / 2.5;
      } // Bottom Right
      else if (x > width / 2 && y > height / 2) {
           yDiffEyes += radiusHead / 2.5;
      }
  }
  else if (type == "YWaveHorizontal") {

      if (true) {
          yDiffEyes += map(sin(map(i, 0.999, numRows - 1, 0, PI)), 0, 1, -1* radiusHead/2.5, radiusHead/2.5);
      }
      else {
          yDiffEyes += map(-1* sin(map(i, 0.999, numRows - 1, 0, PI)), -1, 1, -1* radiusHead/2.5, radiusHead/2.5);
      }
  }
  else if (type == "XWaveVertical") {

      if (true) {
          xDiffEyes += map(cos(map(j, 0.999, numCols - 1, 0, PI)), -1, 1, -1* radiusHead/2.5, radiusHead/2.5);
      }
      else {
          xDiffEyes += map(-1* sin(map(j, 0.999, numCols - 1, 0, PI)), -1, 1, -1* radiusHead/2.5, radiusHead/2.5);
      }
  }
        
      var eyeType = "Normal";
      
      if (showRIP && i == allAtOneIJ[0] && j == allAtOneIJ[1]) {
        eyeType = "X";
    }
  
      if (allDead) {
        eyeType = "X";
      }
  
      if (allDead && showRIP && i == allAtOneIJ[0] && j == allAtOneIJ[1]) {
        eyeType = "Normal";
      }
  
      drawEyeType(i, j, eyeType, xDiffEyes, yDiffEyes, numRows, numCols, radiusHead, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, allAtOneIJ, paddingMultiplier, radiusEyes, useOutline, noiseType, circleNoiseX, circleNoiseY, spiralMagnitude, useSpiral, offSetType, radiusBody);

}

function spiralXOrY(axis, x, y, spreadFactor) {
  
        var x2 = (y - height/2) - (x - width/2);
        var y2 = -1*(x - width/2) - (y - height/2);
        var distanceFromCenter = (((x)-(width/2))**2 + ((y)-(height/2))**2)**0.5
        var multiplier = map((distanceFromCenter), 0, ((width/2)**2 +(height/2)**2)**0.5, 0, 1);
        multiplier = map(multiplier**spreadFactor, 0, 1, 0, .75);
  
      if (axis == "X") {
        return x + multiplier*x2;
      }
      else if (axis == "Y") {
        return y + multiplier*y2;
      }
        
}

function randomFromList(arr) {
  var arrLength = arr.length; 
  var chosenIndex = int(map(fxrand(), 0, 1, 0, arr.length));
  
  return arr[chosenIndex];
}

function draw() {

   switch (seatType) {
    case 0:
      background(255);
      break;
    case "intimate":
       numRows = map(fxrand()**2, 0, 1, 1, 3);
       numCols = map(fxrand()**2, 0, 1, 1, 3);
      break;
    case "towers":
       numRows = map(fxrand(), 0, 1, 2, 8);
       numCols = map(fxrand(), 0, 1, 16, 35);
      break;
    case "comfy":
        numRows = map(fxrand(), 0, 1, 12, 15);
        numCols = map(fxrand(), 0, 1, 16, 18);
      break;
    case "soldOut":
        numRows = map(fxrand(), 0, 1, 23, 26);
        numCols = map(fxrand(), 0, 1, 26, 28);
    break;
    case "grid":
        var gridAmount = int(map(fxrand(), 0, 1, 8, 10));
        numRows = gridAmount;
        numCols = gridAmount;
    break;
    case "random":
        numRows = int(map(fxrand(), 0, 1, 2, 18));
        numCols = int(map(fxrand(), 0, 1, 2, 25));
    break;
    case "rows":
        numRows = int(map(fxrand(), 0, 1, 10, 25));
        numCols = int(map(fxrand(), 0, 1, 1, 8));
    break;
    default:
        numRows = int(map(fxrand(), 0, 1, 2, 18));
        numCols = int(map(fxrand(), 0, 1, 2, 25));  
  }
  
     switch (wobbleFactorType) {
    case 0:
      background(255);
      break;
    case "Serious":
       wobbleFactor = 0.25;
      break;
    case "Calm":
       wobbleFactor = 0.35;
      break;
    case "Loose":
       wobbleFactor = 0.5;
      break;
    case "Dali":
       wobbleFactor = map(fxrand(), 0, 1, 2.0, 3.75);
    break;
    default:
      wobbleFactor = 0.25; 
  }
  
  var paddingMultiplier = randomFromList([1, 1, 1.25,1.25, 1.25,1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 2, 3, 0.7, 0.8, 0.9]) 

  var zoomOutFactor = randomFromList([0.2, 0.5, 0.5, 0.5, 0.5, 0.5, 0.75, 0.75, 0.75, 0.75, 1, 1, 1, 1, 2]);
 
  numRows = max(2, int(numRows*zoomOutFactor));
  numCols = max(2, int(numCols*zoomOutFactor));
  
  if (zoomOutFactor == 2) {
    numRows = int(numRows * 0.75) + 1;
    numCols = int(numCols * 0.75) + 1;
    
  }
  
  if (paddingMultiplier == 5) {
    numRows = max(6, numRows);
    numCols = max(6, numCols);
  }
  
  var spiralMagnitude = map(fxrand(), 0, 1, 0.3, 2.5);
  var circleNoiseX;
  var circleNoiseY;
  
  if (noiseType == "Noise") {
      var xYOrBoth = randomFromList([0, 1, 2, 2]);
      if (xYOrBoth == 0) { // X Only
        circleNoiseX = int(map(fxrand(), 0, 1, 20*(width/600), 100*(width/600)));
        circleNoiseY = 0;
      }
      else if (xYOrBoth == 1) { // Y Only
        circleNoiseX = 0;
        circleNoiseY = int(map(fxrand(), 0, 1, 20*(width/600), 100*(width/600)));
      }
      else if (xYOrBoth == 2) { // Both
        circleNoiseX = int(map(fxrand(), 0, 1, 20*(width/600), 100*(width/600)));
        circleNoiseY = int(map(fxrand(), 0, 1, 20*(width/600), 100*(width/600)));
    }  
  }   
  else if (noiseType == "Random") {
    
      var xYOrBoth = randomFromList([1, 1, 2]);
      if (xYOrBoth == 0) { // X Only
        circleNoiseX = int(map(fxrand(), 0, 1, 20*(width/600), 40*(width/600)));
        if (zoomOutFactor == 2) {
          circleNoiseX *= 0.4;
        }
        circleNoiseY = 0;
      }
      else if (xYOrBoth == 1) { // Y Only
        circleNoiseX = 0;
        circleNoiseY = int(map(fxrand(), 0, 1, 20*(width/600), 40*(width/600)));
        if (zoomOutFactor == 2) {
          circleNoiseY *= 0.4;
        }
      }
      else if (xYOrBoth == 2) { // Both
        circleNoiseX = int(map(fxrand(), 0, 1, 5*(width/600), 25*(width/600)));
        circleNoiseY = int(map(fxrand(), 0, 1, 5*(width/600), 25*(width/600)));
        if (zoomOutFactor == 2) {
          circleNoiseX *= 0.75;
          circleNoiseY *= 0.75;
        }
    }  
  }
  else if (noiseType == "None") {
    circleNoiseX = 0;
    circleNoiseY = 0;
  }
  else if (noiseType == "Sketch") {
    backgroundStyle = "Solid";
    useOutline = true;
  }
  
  createBackground(backgroundStyle, noiseType);
  
  if (type == "UpDownSplitVertical") {
    if (fxrand() < 0.5) {
      type = "UpDownSplitVertical1";
    }
    else {
      type = "UpDownSplitVertical2";
    }
  }
  
  if (type == "LeftRightSplitVertical") {
    if (fxrand() < 0.5) {
      type = "LeftRightSplitVerticalTowards";
    }
    else {
      type = "LeftRightSplitVerticalAway";
    }
  }
  
  if (type == "UpDownSplitHorizontal") {
    if (fxrand() < 0.5) {
      type = "UpDownSplitHorizontalTowards";
    }
    else {
      type = "UpDownSplitHorizontalAway";
    }
  }
  
  if (type == "Mono") {
    var monoDirection = fxrand();
    if (monoDirection < 0.25) {
      type = "Up";
    }
    else if (monoDirection < 0.5) {
      type = "Down";
    }
    else if (monoDirection < 0.75) {
      type = "Left";
    }
    else {
      type = "Right";
    }
  }

  if (type == "LeftRightSplitVerticalTowards" || type == "LeftRightSplitVerticalAway" || type == "UpDownSplitVertical1" || type == "UpDownSplitVertical2" || type == "UpDownSplitHorizontalTowards" || type == "UpDownSplitHorizontalAway" || type == "Clockwise" || type == "CounterClockwise") {
    
    if (numRows % 2 == 0) {
      numRows += 1;
    }
    if (numCols % 2 == 0) {
      numCols += 1
    }
    
  }
  
  print("SeatType: " + seatType + "\n" + 
    "NumRows: " + numRows + "\n" + 
        "NumCols: " + numCols  + "\n" +
       "BackgroundStyle: " + backgroundStyle  + "\n" +
       "EyeVariant: " + type  + "\n" +
       "UseOutline: " + useOutline  + "\n" +
       "PaddingMultiplier: " + paddingMultiplier  + "\n" +
       "ZoomOutFactor: " + zoomOutFactor + "\n" + 
       "NoiseType: " + noiseType + "\n" + 
       "ShowRIP: " + showRIP + "\n" +
       "AllDead: " + allDead + "\n" + 
        "UseSpiral: " + useSpiral + "\n" + 
       "OffsetType: " + offSetType + "\n" + 
        "WobbleFactorType: " + wobbleFactorType + "\n");
  
  // BODY
  var widthDivider = int(map(fxrand(), 0, 1, 2, 30))
  var radiusBody = (width) / (20 * zoomOutFactor)  
  var bendMagnitude = (width / 600) * 50;
  var interpolation = 80;
  var strokeColor = color(14.4, 4, 98);
  var fillColor = color(0, 0, 8)
  var strokeThickness = width / 600;
  
    for (var i = 1; i < numRows; i++) {
      for (var j = 1; j < numCols; j++) {
      
        var x = 0;
        var y = 0;
        
        if (offSetType == "None") {
          // Do Nothing
        }
        else if (offSetType == "Heads") {
          // Do Nothing
        }
        else if (offSetType == "Row") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Col") {
          if (i % 2 == 0) {
            y -= radiusBody/2;
          }
          else {
            y += radiusBody/2;
          }
        }
        
        x += (i * (width * paddingMultiplier) / numRows) - (( width*paddingMultiplier - width)/2);
        y += (j * (height * paddingMultiplier) / numCols) - ((height*paddingMultiplier - height)/2);
        
        if (useSpiral) {
          var x2 = spiralXOrY("X", x, y, spiralMagnitude);
          var y2 = spiralXOrY("Y", x, y, spiralMagnitude);
          x = x2;
          y = y2;  
        } 
        
        createBendyCircle(x, y, radiusBody, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline, noiseType, circleNoiseX, circleNoiseY);
        
        var radiusHeart = radiusBody/80;

        if(int(map(fxrand(), 0, 1, 0, 2*(numRows*numCols))) == 0) {
              createBendyHeart(x + radiusBody * 0.4,y - radiusBody * 0.2, radiusHeart, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline)
        }
      }
    }

    var radiusHead = radiusBody / map(fxrand()**2, 0, 1, 1.75, 1.85);
    var xDiffHead = 0;
    var yDiffHead = radiusBody * 5/5;
    strokeThickness = (width / 600) * 1.5;
    bendMagnitude = (width / 600) * 50;

    fillColor = color(13.4, 0, 94)
    for (var i = 1; i < numRows; i++) {
      for (var j = 1; j < numCols; j++) {


        x = (i * (width * paddingMultiplier) / numRows) - (( width*paddingMultiplier - width)/2);
        y = (j * (height * paddingMultiplier) / numCols) - ((height*paddingMultiplier - height)/2);
        
        if (offSetType == "None") {
          // Do Nothing
        }
        else if (offSetType == "Heads") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Row") {
          if (j % 2 == 0) {
            x -= radiusBody/2;
          }
          else {
            x += radiusBody/2;
          }
        }
        else if (offSetType == "Col") {
          if (i % 2 == 0) {
            y -= radiusBody/2;
          }
          else {
            y += radiusBody/2;
          }
        }
        
        
        if (useSpiral) {
          var x2 = spiralXOrY("X", x, y, spiralMagnitude);
          var y2 = spiralXOrY("Y", x, y, spiralMagnitude);
          x = x2;
          y = y2;  
        } 

        createBendyCircle(x, y - yDiffHead, radiusHead, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, useOutline, noiseType, circleNoiseX, circleNoiseY);   
      }
    }
  
    var radiusEyes = radiusHead / map(fxrand()**1.75, 0, 1, 7.75, 8);
    strokeThickness = (width / 600) * (0.5);
    var xDiffEyes = 0;
    var yDiffEyes = yDiffHead;
    bendMagnitude = (width / 600) * 45; 
  
    if (noiseType == "Random") {
      strokeColor = color(0, 0, 8);
      
    }
  
    var allAtOneIJ = [int(map(fxrand(), 0, 1, 1 + int(numRows/10), numRows - int(numRows/10))), int(map(fxrand(), 0, 1, 1 + int(numCols/10), numCols - int(numCols/10)))];
  
  var superSpecialEyes = allAtOneIJ;

    fillColor = color(54, 23, 0);
    for (var i = 1; i < numRows; i++) {
      for (var j = 1; j < numCols; j++) {

        eyeCannon(i, j, type, xDiffEyes, yDiffEyes, numRows, numCols, radiusHead, bendMagnitude, interpolation, strokeColor, fillColor, strokeThickness, allAtOneIJ, paddingMultiplier, radiusEyes, useOutline, noiseType, circleNoiseX, circleNoiseY, showRIP, allDead, spiralMagnitude, useSpiral, offSetType, radiusBody);
        
      }
    }

  fxpreview()
}

function keyPressed() {
  if (key == 's') {
    save("Theatergoers.png");
  }
  if (key == 'h') {
    window.location.href = "mailto:michaelrperusse@gmail.com";
  }
}

function getFeatureStringSeats(value) {
  
  if (value < 4.0/13.0) {
    seatType = "random"
    return "Random"
  }
  else if (value < 6.0/13.) {
    seatType = "soldOut"
    return "Sold Out"
  }
  else if (value < 9.0/13.) {
    seatType = "comfy"
    return "Comfy"
  }
  else if (value < 10.0/13.) {
    seatType = "towers"
    return "Towers"
  }
  else if (value < 11.0/13.) {
    seatType = "rows"
    return "Rows"
  }
  else if (value < 12.0/13.) {
    seatType = "intimate"
    return "Intimate"
  }
  else {
    seatType = "grid"
    return "Grid"
  }
}

function getFeatureStringWobble(value) {

  if (value < 3.0/29.0) {
    wobbleFactorType = "Serious"
    return "Stern"
  }
  else if (value < 6.0/29.0) {
    wobbleFactorType = "Calm"
    return "Calm"
  }
  else if (value < 7.75/29.0) {
    wobbleFactorType = "Dali"
    return "Dali"
  }
  else {
    wobbleFactorType = "Loose"
    return "Loose"
  }
}

function getFeatureStringEyes(value) {
  
  if (value < 8.0/33.0) {
    type = "ChosenOne"
    return "Chosen One"
  }
  else if (value < 11.0/33.0) {
    type = "Random"
    return "Random"
  }
  else if (value < 15.0/33.0) {
    type = "Straight"
    return "Straight"
  }
    else if (value < 17.0/33.0) {
    type = "Clockwise"
    return "Clockwise"
  }
    else if (value < 19.0/33.0) {
    type = "CounterClockwise"
    return "CounterClockwise"
  }
    else if (value < 21.0/33.0) {
    type = "Shunned"
    return "Shunned"
  }
    else if (value < 22.0/33.0) {
    type = "YWaveHorizontal"
    return "Y Wave"
  }
    else if (value < 23.0/33.0) {
    type = "XWaveVertical"
    return "X Wave"
  }
    else if (value < 25.0/33.0) {
    type = "LeftRightSplitVertical"
    return "Left Right Vertical Split"
  }
    else if (value < 27.0/33.0) {
    type = "UpDownSplitVertical"
    return "Up Down Vertical Split"
  }
    else if (value < 29.0/33.0) {
    type = "UpDownSplitHorizontal"
    return "Up Down Horizontal Split"
  }
    else if (value < 30.0/33.0) {
    type = "UpDownRandom"
    return "Up Down Random"
  }
    else if (value < 31.0/33.0) {
    type = "LeftRightRandom"
    return "Left Right Random"
  }
    else {
    type = "Mono"
    return "Mono"
  }
}

function getFeatureStringBlobs(value) {

  if (wobbleFactorType == "Dali") {
      if (value < 3.0/16.0) {
        noiseType = "None"
        return "Classic"
      }
      else if (value < 7.0/16.0) {
        noiseType = "Random"
        return "Paranormal"
      }
      else if (value < 12.0/16.0) {
        noiseType = "Noise"
        return "Loopy"
      }
      else {
        noiseType = "Sketch"
        return "Bones"
      }
  }
  
  if (value < 11.0/16.0) {
    noiseType = "None"
    return "Classic"
  }
  else if (value < 13.0/16.0) {
    noiseType = "Random"
    return "Paranormal"
  }
  else if (value < 15.0/16.0) {
    noiseType = "Noise"
    return "Loopy"
  }
  else {
    noiseType = "Sketch"
    return "Bones"
  }
}

function getFeatureStringBackground(value) {

  if (noiseType == "Sketch") {
    backgroundStyle = "Solid"
    return "Solid"
  }
  
  if (value < 2.0/10.0) {
    backgroundStyle = "Solid"
    return "Solid"
  }
  else if (value < 3.0/10.0) {
    backgroundStyle = "PerfectSlice"
    return "Perfect Slice"
  }
  else if (value < 8.0/10.0) {
    backgroundStyle = "SmoothSlice"
    return "Smooth Slice"
  }
  else {
    backgroundStyle = "JaggedSlice"
    return "Jagged Slice"
  }
}

function getFeatureStringOutline(value) {

  if (value < 2.0/3.0) {
    useOutline = true
    return "Yes"
  }
  else {
    useOutline = false
    return "No"
  }
}

function getFeatureStringRIP(value) {

  if (value < 1.0/4.0) {
    showRIP = true
    return "Yes"
  }
  else {
    showRIP = false
    return "No"
  }
}

function getFeatureStringAllDead(value) {

  if (value < 1.0/12.0) {
    allDead = true
    return "Yes"
  }
  else {
    allDead = false
    return "No"
  }
}

function getFeatureStringWave(value) {

  if (value < 1.0/30.0) {
    useSpiral = true
    return "Yes"
  }
  else {
    useSpiral = false
    return "No"
  }
}

function getFeatureStringOffset(value) {

  if (value < 2.0/5.0) {
    offSetType = "None"
    return "None"
  }
  else if (value < 3.0/5.0) {
    offSetType = "Heads"
    return "Heads"
  }
  else if (value < 3.0/5.0) {
    offSetType = "Row"
    return "Rows"
  }
  else {
    offSetType = "Col"
    return "Columns"
  }
}

function getFeatureStringLove(value) {
  return "Hey, it's always possible. <3"
}

window.$fxhashFeatures = {
  "Seats": getFeatureStringSeats(fxrand()),
  "Wobble": getFeatureStringWobble(fxrand()),
  "Eyes": getFeatureStringEyes(fxrand()),
  "Blobs": getFeatureStringBlobs(fxrand()),
  "Background": getFeatureStringBackground(fxrand()),
  "Outlined": getFeatureStringOutline(fxrand()),
  "RIP": getFeatureStringRIP(fxrand()),
  "Wave": getFeatureStringWave(fxrand()),
  "All Dead": getFeatureStringAllDead(fxrand()),
  "Offset": getFeatureStringOffset(fxrand()),
  "Love": getFeatureStringLove(fxrand()),
}

// Thanks for reading <3 - MP
// License: CC BY-NC-ND