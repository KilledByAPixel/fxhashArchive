//flowers

function plant04(_x, _y, _s, _colPick, colPick_p4) {
  let x = _x;
  let y = _y;
  let size = _s;
  let colPick = _colPick;
  let colors01 = [];

  if (colPick_p4 <= 0.333) {
    colors01 = [color(0, 30, 100), color(210, 50, 100), color(210, 50, 100)];
  } else if (colPick_p4 > 0.33 && colPick_p4 <= 0.66) {
    colors01 = [color(110, 40, 80), color(20, 50, 100), color(0, 30, 100)];
  } else {
    colors01 = [color(210, 50, 100), color(110, 40, 80), color(110, 50, 60)];
  }

  let h = random(180, 200) * size; //height
  let spread = 20 * size;
  let ro = cos(random(40, 60)); //rotate

  stroke(colors01[colPick]);
  fill(0, 20, 100);

  let flowers = [flower01, flower03];

  push();
  translate(x, y);
  rotate(random(-30, 30));
  stem(0, 0);
  flowers[int(random(flowers.length))](0, 0);
  //flowers[1](0,0);
  pop();

  function stem(x1, y1) {
    strokeWeight(4 * size);
    line(x1, y1, x1, y1 - h);

    for (let i = 0; i < random(4); i++) {
      strokeWeight(2 * size);
      line(x1, y1, x1 + random(-20, 20), y1 - h + random(20, 40));
    }
  }

  function flower01(x1, y1) {
    strokeWeight(1);
    fill(0, 1, 100);
    ellipse(
      x1 + cos(-90) * spread,
      y1 - h + sin(-90) * spread * ro,
      30 * size,
      30 * size * ro
    );
    ellipse(
      x1 + cos(-30) * spread,
      y1 - h + sin(-30) * spread * ro,
      30 * size,
      30 * size * ro
    );
    ellipse(
      x1 + cos(-150) * spread,
      y1 - h + sin(-150) * spread * ro,
      30 * size,
      30 * size * ro
    );

    fill(colors01[colPick]);
    ellipse(x1, y1 - h - 2.5 * size, 40 * size, 40 * size * ro);

    fill(0, 1, 100);
    ellipse(
      x1 + cos(30) * spread,
      y1 - h + sin(30) * spread * ro,
      30 * size,
      30 * size * ro
    );
    ellipse(
      x1 + cos(150) * spread,
      y1 - h + sin(150) * spread * ro,
      30 * size,
      30 * size * ro
    );
    ellipse(
      x1 + cos(90) * spread,
      y1 - h + sin(90) * spread * ro,
      30 * size,
      30 * size * ro
    );
  }

  function flower02(x1, y1) {
    fill(0, 1, 100);
    stroke(0, 1, 100);

    let angle = 40;
    let spread = 0;
    let inc = 6;
    let n = 1; //noise
    let s = 5; //dot size

    for (let i = 0; i < 2; i++) {
      spread += inc;
      for (let j = 0; j < 360; j += (angle / spread) * 10) {
        circle(
          x1 + cos(j) * spread + random(-n, n),
          y1 - h + sin(j) * spread + random(-n, n),
          s
        );
      }
    }
  }

  function flower03(x1, y1) {
    let angle = 120;
    let steps = 12;
    strokeWeight(1);
    fill(0, 1, 100);

    for (let i = 0; i < steps; i++) {
      push();
      translate(x1, y1 - h);
      rotate(angle);

      let scaler = 1;
      scaler = map(abs(sin(angle)), 0, 1, 1, 1.2 * ro);

      ellipse(15 * scaler * size, 0, 40 * scaler * size, 10 * size);
      angle += 360 / steps;
      pop();
    }

    fill(colors01[colPick]);
    ellipse(x1, y1 - h - 2.5 * size, 30 * size, 30 * size * ro);
    fill(0, 1, 100);
  }
}
