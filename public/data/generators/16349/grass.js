function grass(_x, _y, _s, colPick) {
  let size = random(0.8, 1.2) * _s;
  let x = _x;
  let y = _y;

  //light
  let colors01 = [
    color(random(210, 215), 100, 85),
    color(40, 100, 100),
    color(10, 85, 95),
    color(30, 10, 90),
  ];

  //dark
  let colors02 = [
    color(random(210, 215), 100, 40),
    color(25, 100, 90),
    color(0, 90, 60),
    color(30, 10, 80),
  ];

  //stroke
  let colors03 = [
    color(210, 100, 80),
    color(40, 95, 100),
    color(10, 75, 90),
    color(30, 10, 95),
  ];

  strokeWeight(1);
  stroke(colors03[colPick]);
  //noStroke();
  fill(255);

  linearGradient(
    x,
    y - 80 * size, //Start point
    x,
    y + 0 * size, //End point
    color(colors01[colPick]), //tip color
    color(colors02[colPick]) //root color
  );

  let seed = int(random(4));

  if (seed == 0) {
    beginShape();
    vertex(x, y);
    bezierVertex(
      x,
      y - 10 * size,
      x,
      y - 32 * size,
      x - 23.5 * size,
      y - 48.5 * size
    );
    bezierVertex(
      x - 34.5 * size,
      y - 56.5 * size,
      x - 26.5 * size,
      y - 56.5 * size,
      x - 20.5 * size,
      y - 53.5 * size
    );
    bezierVertex(
      x - 10 * size,
      y - 50 * size,
      x + 10 * size,
      y - 35 * size,
      x + 10 * size,
      y
    );
    endShape();
  } else if (seed == 1) {
    beginShape();
    vertex(x, y);
    bezierVertex(
      x,
      y - 10 * size,
      x,
      y - 32 * size,
      x + 23.5 * size,
      y - 48.5 * size
    );
    bezierVertex(
      x + 34.5 * size,
      y - 56.5 * size,
      x + 26.5 * size,
      y - 56.5 * size,
      x + 20.5 * size,
      y - 53.5 * size
    );
    bezierVertex(
      x + 10 * size,
      y - 50 * size,
      x - 10 * size,
      y - 35 * size,
      x - 10 * size,
      y
    );
    endShape();
  } else if (seed == 2) {
    beginShape();
    vertex(x, y);
    bezierVertex(
      x - 0.5 * size,
      y - 8.5 * size,
      x + 1.5 * size,
      y - 23.5 * size,
      x - 3.5 * size,
      y - 39.5 * size
    );
    bezierVertex(
      x - 6.5 * size,
      y - 48.5 * size,
      x - 12.5 * size,
      y - 57.5 * size,
      x - 9.5 * size,
      y - 74.5 * size
    );
    bezierVertex(
      x - 8.5 * size,
      y - 82.5 * size,
      x - 3.5 * size,
      y - 81.5 * size,
      x - 4.5 * size,
      y - 77.5 * size
    );
    bezierVertex(
      x - 6.5 * size,
      y - 62.5 * size,
      x - 1.5 * size,
      y - 53.5 * size,
      x + 3.5 * size,
      y - 41.5 * size
    );
    bezierVertex(
      x + 8.5 * size,
      y - 29.5 * size,
      x + 10.5 * size,
      y - 15.5 * size,
      x + 10 * size,
      y
    );
    endShape();
  } else if (seed == 3) {
    beginShape();
    vertex(x, y);
    bezierVertex(
      x + 0.5 * size,
      y - 8.5 * size,
      x + 3.5 * size,
      y - 16.5 * size,
      x + 0.5 * size,
      y - 34.5 * size
    );
    bezierVertex(
      x - 3.5 * size,
      y - 56.5 * size,
      x + 9.5 * size,
      y - 63.5 * size,
      x + 5.5 * size,
      y - 79.5 * size
    );
    bezierVertex(
      x + 2.5 * size,
      y - 90.5 * size,
      x + 6.5 * size,
      y - 91.5 * size,
      x + 10.5 * size,
      y - 80.5 * size
    );
    bezierVertex(
      x + 15.5 * size,
      y - 66.5 * size,
      x + 6.5 * size,
      y - 50.5 * size,
      x + 8.5 * size,
      y - 38.5 * size
    );
    bezierVertex(
      x + 11.5 * size,
      y - 22.5 * size,
      x + 13.5 * size,
      y - 17.5 * size,
      x + 11.5 * size,
      y
    );
    endShape();
  }
}
