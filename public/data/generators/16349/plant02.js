//alg

function plant02(_x, _y, _size, _colPick, colPick_p2) {
  let x = _x;
  let y = _y;
  let colPick = _colPick;

  let colors01 = []; //light
  let colors02 = []; //dark
  let colors03 = []; //stroke

  if (colPick_p2 <= 0.333) {
    colors01 = [
      color(random(100, 120), 100, 60),
      color(10, 90, 95),
      color(100, 80, 60),
    ];
    colors02 = [
      color(random(100, 120), 100, 40),
      color(10, 90, 80),
      color(100, 80, 40),
    ];
    colors03 = [color(120, 80, 50), color(0, 60, 100), color(100, 40, 60)];
  } else if (colPick_p2 > 0.33 && colPick_p2 <= 0.66) {
    colors01 = [
      color(random(100, 120), 100, 60),
      color(10, 90, 95),
      color(40, 100, 100),
    ];
    colors02 = [
      color(random(100, 120), 100, 40),
      color(10, 90, 80),
      color(30, 100, 100),
    ];
    colors03 = [color(120, 80, 50), color(0, 60, 100), color(40, 80, 100)];
  } else {
    colors01 = [color(10, 75, 100), color(10, 90, 95), color(210, 60, 80)];
    colors02 = [color(10, 75, 70), color(10, 90, 80), color(210, 90, 80)];
    colors03 = [color(10, 50, 100), color(0, 60, 100), color(210, 60, 100)];
  }

  let size = random(0.5, 1) * _size;

  strokeWeight(1 * size);
  stroke(colors03[colPick]);

  linearGradient(
    x,
    y - 120 * size, //Start point
    x,
    y - 0 * size, //End point
    color(colors01[colPick]), //tip color
    color(colors02[colPick]) //root color
  );

  let seed = int(random(2));

  if (seed == 0) {
    beginShape();
    vertex(x, y);
    bezierVertex(
      x + 2.5 * size,
      y - 7.5 * size,
      x + 10.5 * size,
      y - 24.5 * size,
      x + 12.5 * size,
      y - 39.5 * size
    );
    bezierVertex(
      x + 15.5 * size,
      y - 55.5 * size,
      x + 12.5 * size,
      y - 68.5 * size,
      x + 7.5 * size,
      y - 77.5 * size
    );
    bezierVertex(
      x + 3.5 * size,
      y - 83.5 * size,
      x - 3.5 * size,
      y - 89.5 * size,
      x + 0.5 * size,
      y - 94.5 * size
    );
    bezierVertex(
      x + 3.5 * size,
      y - 97.5 * size,
      x + 10.5 * size,
      y - 96.5 * size,
      x + 13.5 * size,
      y - 80.5 * size
    );
    bezierVertex(
      x + 16.5 * size,
      y - 64.5 * size,
      x + 18.5 * size,
      y - 52.5 * size,
      x + 15.5 * size,
      y - 37.5 * size
    );
    bezierVertex(
      x + 11.5 * size,
      y - 25.5 * size,
      x + 9.5 * size,
      y - 4.5 * size,
      x + 9 * size,
      y
    );
    endShape();
  } else if (seed == 1) {
    beginShape();
    vertex(x, y);
    bezierVertex(
      x - 0.5 * size,
      y - 6.5 * size,
      x - 7.5 * size,
      y - 35.5 * size,
      x - 11.5 * size,
      y - 47.5 * size
    );
    bezierVertex(
      x - 15.5 * size,
      y - 61.5 * size,
      x - 23.5 * size,
      y - 76.5 * size,
      x - 21.5 * size,
      y - 97.5 * size
    );
    bezierVertex(
      x - 19.5 * size,
      y - 113.5 * size,
      x - 12.5 * size,
      y - 121.5 * size,
      x - 8.5 * size,
      y - 120.5 * size
    );
    bezierVertex(
      x - 2.5 * size,
      y - 119.5 * size,
      x - 10.5 * size,
      y - 104.5 * size,
      x - 13.5 * size,
      y - 97.5 * size
    );
    bezierVertex(
      x - 18.5 * size,
      y - 86.5 * size,
      x - 14.5 * size,
      y - 68.5 * size,
      x - 9.5 * size,
      y - 53.5 * size
    );
    bezierVertex(
      x - 4.5 * size,
      y - 37.5 * size,
      x + 5.5 * size,
      y - 8.5 * size,
      x + 7.5 * size,
      y
    );

    endShape();
  }
}
