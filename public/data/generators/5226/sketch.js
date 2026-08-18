/* Ruis
2021, lucas s. reveil
*/

//noprotect
var birds, scene, val, rain, cloudCMax;
let yoff = 0.0;

function setup() {
  birds = 0;
  randomSeed(fxrand() * 12345678);
  noiseSeed(fxrand() * 12345678);
  createCanvas(innerWidth, innerHeight);
  background(200);
  let kl = 100;
  let sKl = 200;
  let xoff = 0;
  val = random([2.5, 4, 5.5]);
  let offset = random(2, 6);

  /* waves
  one wave line: https://p5js.org/examples/math-noise-wave.html
  */

  fill(kl, 255);
  for (var i = 0; i < height - height / 3; i++) {
    stroke(sKl, 80);
    fill(random(kl - 2, kl + 2), 80);
    strokeWeight(0.5);
    beginShape();
    for (let x = 0; x <= width * 1.3; x += val) {
      y = map(noise(xoff), 0, 1, height / 4, height / 3);
      vertex(x, y + i * offset);
      xoff += 0.04;
    }
    vertex(width, height + height / 4);
    vertex(-height / 4, height + height / 4);
    endShape(CLOSE);
    kl -= 1;
    sKl -= 1;
  }
  yoff += 0.1;

  //clouds
  randomSeed(fxrand() * 12345678);
  noiseSeed(fxrand() * 12345678);
  numCl = random([width * 4, width * 5]);
  for (let i = 0; i < numCl; i++) {
    noStroke();
    xCo = random(width);
    yCo = random(0, height / 5);
    var cloudCMax = random(100, 160);
    cloudC = map(yCo, 0, height / 5, cloudCMax - 40, cloudCMax);
    cloudCA = map(yCo, 0, height / 6, 50, 10);
    fill(cloudC, cloudCA);
    ellipse(xCo, yCo, random(80));
  }

  //birds
  randomSeed(fxrand() * 12345678);
  noiseSeed(fxrand() * 12345678);
  if (random() < 0.8) {
    let numBirds = ceil(random(5));
    birds = numBirds;
    if (numBirds === 0) birds = 0;
    for (var i = 0; i < numBirds; i++) {
      push();
      translate(
        width / 8 + random(width - width / 8),
        random(height / 10, height / 3.5)
      );
      rotate(radians(random(-40, 40)));
      drawBird();
      pop();
    }
  }

  //rain
  var rain = false;
  if (random() < 0.5) {
    rain = true;
    for (var i = 0; i < 10000; i++) {
      push();
      translate(random(width), random(height));
      rotate(radians(random(-40, 40)));
      strokeWeight(0.1);
      stroke(30, 120);
      line(0, 0, 0, 20);
      pop();
    }
  }

  loadPixels();
  let pD = pixelDensity();
  let halfImage = 5 * (width * pD) * (height * pD);
  for (let i = 0; i < halfImage; i += 4) {
    grainAmount = random(-30, 30);
    pixels[i] = pixels[i] + grainAmount;
    pixels[i + 1] = pixels[i + 1] + grainAmount;
    pixels[i + 2] = pixels[i + 2] + grainAmount;
    pixels[i + 3] = pixels[i + 3] + grainAmount;
  }
  updatePixels();

  //Features
  function getFeatureString(val) {
    if (val === 2.5) return "storm waves";
    if (val === 4) return "turbulent";
    if (val === 5.5) return "quite rough";
  }

  //Features
  function getFeatureString2(cloudCMax) {
    if (cloudCMax < 150) return "heavily clouded";
    if (cloudCMax < 160) return "clouded";
  }

  window.$fxhashFeatures = {
    // feature can only be "low", "medium" or "high"
    Birds: birds,
    Rain: rain,
    Waves: getFeatureString(val),
    Clouds: getFeatureString2(cloudCMax),
  };
}
function drawBird() {
  var wingL = random(width / 80, width / 23);
  var wingH = random(wingL / 4.5, wingL / 2);
  var sW = map(wingL, width / 80, width / 23, 1, 2);
  strokeWeight(sW);
  noFill();
  stroke(50, 120);
  bezier(
    -wingL,
    0,
    -wingL / 2,
    -wingH / 3,
    -wingL / 3,
    -wingH,
    -wingL / 15,
    -wingL / 15
  );
  bezier(
    wingL / 15,
    -wingL / 15,
    wingL / 3,
    -wingH,
    wingL / 2,
    -wingH / 3,
    wingL,
    0
  );
  strokeWeight(sW / 1.5);
  stroke(180, 200);
  bezier(
    -wingL + 1,
    0,
    -wingL / 2,
    -wingH / 3 + 1,
    -wingL / 3,
    -wingH + 1,
    -wingL / 15,
    -wingL / 15 + 1
  );
  bezier(
    wingL / 15,
    -wingL / 15 + 1,
    wingL / 3,
    -wingH + 1,
    wingL / 2,
    -wingH / 3 + 1,
    wingL - 1,
    0
  );
  noStroke();
  fill(50, 120);
  ellipse(0, 0, wingL / 7, wingL / 6.8);
}

function mousePressed() {
  saveCanvas("waves.jpeg");
}
