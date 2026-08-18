//shrub with leavese

function plant03(_x, _y, _size, colPick, colPick_p3) {
  let x1 = _x;
  let y1 = _y;

  let size = _size;

  let colors01_fill = [];
  let colors01_stroke = [];

  if (colPick_p3 <= 0.333) {
    if (random(1) < 0.5) {
      colors01_fill = [
        color(10, 85, 100),
        color(10, 20, 100),
        color(0, 10, 100),
      ];
      colors01_stroke = [
        color(10, 50, 100),
        color(10, 0, 100),
        color(0, 40, 100),
      ];
    } else {
      colors01_fill = [
        color(40, 100, 100),
        color(210, 90, 80),
        color(210, 90, 80),
      ];
      colors01_stroke = [
        color(40, 50, 100),
        color(210, 50, 80),
        color(210, 50, 80),
      ];
    }
  } else if (colPick_p3 > 0.33 && colPick_p3 <= 0.66) {
    if (random(1) < 0.5) {
      colors01_fill = [
        color(0, 40, 100),
        color(110, 95, 55),
        color(110, 70, 60),
      ];
      colors01_stroke = [
        color(10, 20, 100),
        color(110, 50, 70),
        color(110, 50, 70),
      ];
    } else {
      colors01_fill = [
        color(200, 70, 80),
        color(200, 80, 70),
        color(0, 10, 100),
      ];
      colors01_stroke = [
        color(0, 20, 100),
        color(200, 40, 80),
        color(0, 40, 100),
      ];
    }
  } else {
    if (random(1) < 0.5) {
      colors01_fill = [
        color(40, 100, 100),
        color(10, 95, 90),
        color(40, 100, 100),
      ];
      colors01_stroke = [
        color(40, 50, 100),
        color(10, 50, 90),
        color(40, 60, 100),
      ];
    } else {
      colors01_fill = [
        color(110, 100, 60),
        color(210, 100, 80),
        color(210, 90, 80),
      ];
      colors01_stroke = [
        color(110, 50, 70),
        color(210, 50, 90),
        color(210, 50, 90),
      ];
    }
  }

  if (colPick <= 0.333) {
  } else if (colPick > 0.33 && colPick <= 0.66) {
  } else {
  }

  let p1 = { x: x1 + random(-20, 20) * size, y: y1 + random(80, 150) * size };
  let p2 = { x: x1, y: y1 };
  let p3 = { x: x1 + random(-50, 50) * size, y: y1 + random(-50, -100) * size };
  let p4 = {
    x: x1 + random(-100, 100) * size,
    y: p3.y + random(-50, -100) * size,
  };

  //stem

  noFill();
  stroke(colors01_stroke[colPick]);
  strokeWeight(1 * size);
  curve(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
  let cLength = sqrt(sq(p2.x - p3.x) + sq(p2.y - p3.y));

  strokeWeight(0.5 * size);
  let steps = map(cLength / size, 0, 120, 0, 10);
  fill(colors01_fill[colPick]);
  stroke(colors01_stroke[colPick]);

  //right side leaves
  for (let i = 2; i < steps; i++) {
    let t = i / steps + random(-0.01, 0.01);
    let leafSize = random(0.6, 0.8) * (1.5 - t) * size;
    push();
    translate(
      curvePoint(p1.x, p2.x, p3.x, p4.x, t),
      curvePoint(p1.y, p2.y, p3.y, p4.y, t)
    );
    rotate(
      atan2(
        curveTangent(p1.y, p2.y, p3.y, p4.y, t),
        curveTangent(p1.x, p2.x, p3.x, p4.x, t)
      )
    );
    rotate(random(40, 50));
    ellipse(10 * leafSize, 0, 20 * leafSize, 10 * leafSize);
    line(0, 0, 10 * leafSize, 0);
    pop();
  }

  //left side leaves
  for (let i = 2; i < steps; i++) {
    let t = i / steps + random(-0.01, 0.01);
    let leafSize = random(0.6, 0.8) * (1.5 - t) * size;
    push();
    translate(
      curvePoint(p1.x, p2.x, p3.x, p4.x, t),
      curvePoint(p1.y, p2.y, p3.y, p4.y, t)
    );
    rotate(
      atan2(
        curveTangent(p1.y, p2.y, p3.y, p4.y, t),
        curveTangent(p1.x, p2.x, p3.x, p4.x, t)
      )
    );

    rotate(random(-40, -50));
    ellipse(10 * leafSize, -1, 20 * leafSize, 10 * leafSize);
    line(0, -1, 10 * leafSize, 0);
    pop();
  }

  //top
  fill(colors01_fill[colPick]);
  ellipse(p3.x, p3.y, 5);
}
