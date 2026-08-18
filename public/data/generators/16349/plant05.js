//poppies

function plant05(_x, _y, _size, _colPick, colPick_p5) {
  let x1 = _x;
  let y1 = _y;
  let size = _size * 0.8;
  let colPick = _colPick;

  //stroke

  //fill

  let colors01_fill = [];
  let colors01_stroke = [];

  if (colPick_p5 <= 0.333) {
    colors01_fill = [
      color(200, 60, 90),
      color(10, 80, 95),
      color(40, 100, 100),
    ];
    colors01_stroke = [
      color(200, 80, 80),
      color(10, 90, 90),
      color(40, 90, 100),
    ];
  } else if (colPick_p5 > 0.33 && colPick_p5 <= 0.66) {
    colors01_fill = [color(10, 0, 95), color(200, 80, 70), color(200, 80, 60)];
    colors01_stroke = [
      color(10, 5, 90),
      color(200, 50, 70),
      color(200, 50, 60),
    ];
  } else {
    colors01_fill = [
      color(40, 100, 100),
      color(110, 90, 60),
      color(110, 70, 60),
    ];
    colors01_stroke = [
      color(40, 90, 100),
      color(110, 80, 60),
      color(110, 60, 60),
    ];
  }

  noFill();
  stroke(colors01_stroke[colPick]);
  strokeWeight(random(1, 2) * size);

  let p1 = { x: x1 + random(-20, 20) * size, y: y1 + random(80, 150) * size };
  let p2 = { x: x1, y: y1 };
  let p3 = { x: x1 + random(-50, 50) * size, y: y1 + random(-50, -100) * size };
  let p4 = {
    x: p3.x + random(-50, 50) * size,
    y: p3.y + random(-50, -100) * size,
  };

  curve(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);

  fill(colors01_fill[colPick]);
  if (random(1) < 0.1) {
    ellipse(p3.x, p3.y, random(2, 4));
  }
}
