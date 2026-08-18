function vase(_x, _y, _s, _colPick) {
  let x = _x;
  let y = _y;
  let size = _s; //size
  let colPick = _colPick;

  //light
  let colors01 = [color(40, 40, 100), color(30, 20, 100), color(0, 25, 100)];
  //dark
  let colors02 = [color(40, 40, 80), color(20, 50, 90), color(0, 40, 90)];

  //noFill();
  strokeWeight(1.5);
  //stroke(100);
  //stroke(180,20,80);
  //stroke(210,100,60);

  let h = 40; //hue
  let sat = 40;
  let br = { t: 100, r: 80 };

  linearGradient(
    0,
    -80 * size, //Start point
    0,
    -20 * size, //End point
    color(colors01[colPick]), //tip color
    color(colors02[colPick]) //root color
  );

  stroke(0, 0, 100, 80);

  push();
  translate(x, y);
  beginShape();
  //fill(180,40,80);
  vertex(0, 0);
  bezierVertex(
    7.5 * size,
    0 * size,
    14.5 * size,
    0 * size,
    18.5 * size,
    -3.5 * size
  );
  bezierVertex(
    23.5 * size,
    -7.5 * size,
    27.5 * size,
    -10.5 * size,
    31 * size,
    -20 * size
  );
  bezierVertex(
    35.5 * size,
    -29.5 * size,
    39.5 * size,
    -46.5 * size,
    38 * size,
    -63 * size
  );
  bezierVertex(
    37.5 * size,
    -73.5 * size,
    32.5 * size,
    -84.5 * size,
    21 * size,
    -91 * size
  );
  bezierVertex(
    19.5 * size,
    -91.5 * size,
    19.5 * size,
    -93.5 * size,
    20 * size,
    -95 * size
  );
  bezierVertex(
    19.5 * size,
    -95.5 * size,
    19.5 * size,
    -98.5 * size,
    18.5 * size,
    -99.5 * size
  );
  bezierVertex(
    17.5 * size,
    -100.5 * size,
    11.5 * size,
    -106.5 * size,
    0 * size,
    -107 * size
  );
  bezierVertex(
    -11.5 * size,
    -106.5 * size,
    -18.5 * size,
    -101.5 * size,
    -20 * size,
    -98.5 * size
  );
  bezierVertex(
    -22.5 * size,
    -94.5 * size,
    -20.5 * size,
    -92.5 * size,
    -22 * size,
    -91.5 * size
  );
  bezierVertex(
    -24.5 * size,
    -89.5 * size,
    -34.5 * size,
    -84.5 * size,
    -38 * size,
    -63.5 * size
  );
  bezierVertex(
    -40.5 * size,
    -43.5 * size,
    -36.5 * size,
    -29.5 * size,
    -32.5 * size,
    -20.6 * size
  );
  bezierVertex(
    -28.5 * size,
    -11.5 * size,
    -25.5 * size,
    -7.5 * size,
    -21 * size,
    -4.5 * size
  );
  bezierVertex(
    -15.5 * size,
    -0.5 * size,
    -9.5 * size,
    -0.5 * size,
    0 * size,
    0 * size
  );
  endShape();

  beginShape();
  vertex(-19.5 * size, -87.5 * size);
  bezierVertex(
    -18.5 * size,
    -84.5 * size,
    -8.5 * size,
    -80.5 * size,
    -0.5 * size,
    -80 * size
  );
  bezierVertex(
    7.5 * size,
    -79.5 * size,
    16.5 * size,
    -82.5 * size,
    18.5 * size,
    -87.5 * size
  );
  endShape();

  beginShape();
  linearGradient(
    0,
    -100 * size, //Start point
    0,
    -80 * size, //End point
    color(colors01[colPick]), //tip color
    color(colors02[colPick]) //root color
  );
  vertex(-16.5 * size, -95.5 * size);
  bezierVertex(
    -16.5 * size,
    -100.5 * size,
    -9.5 * size,
    -103.5 * size,
    0 * size,
    -103.5 * size
  );
  bezierVertex(
    8.5 * size,
    -103.5 * size,
    15.5 * size,
    -100.5 * size,
    15.5 * size,
    -95.5 * size
  );
  bezierVertex(
    15.5 * size,
    -91.5 * size,
    8.5 * size,
    -87.5 * size,
    0 * size,
    -87.5 * size
  );
  bezierVertex(
    -9.5 * size,
    -87.5 * size,
    -16.5 * size,
    -91.5 * size,
    -16.5 * size,
    -95.5 * size
  );
  endShape();

  pop();
}
