function fireflies(_x, _y, _colPick, colPick_f) {
  let colPick = _colPick;
  let x = _x;
  let y = _y;
  let spread = 20;

  let colors01 = [];

  if (colPick_f <= 0.333) {
    colors01 = [color(40, 100, 100), color(200, 80, 70), color(200, 80, 70)];
  } else if (colPick_f > 0.33 && colPick_f <= 0.66) {
    colors01 = [color(0, 1, 100), color(200, 80, 70), color(40, 100, 100)];
  } else {
    colors01 = [color(10, 70, 100), color(200, 80, 70), color(110, 50, 60)];
  }

  for (let i = 0; i < 5; i++) {
    noStroke();
    let rX = random(-spread, spread);
    let rY = random(-spread, spread);
    let radius = random(2, 7);
    fill(colors01[colPick]);

    circle(x + rX, y - 50 * mainSize + rY, radius * mainSize);
  }
}
