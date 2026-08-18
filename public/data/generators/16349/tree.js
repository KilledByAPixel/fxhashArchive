//tree

let theta;
let spread = 2;
let inc = 10;

function tree(_x, _y, _s, _h, _t, size, colPick, colPick_p1) {
  plant01(_x, _y, _s, _h, _t, size, colPick, colPick_p1);

  function plant01(_x, _y, _s, _h, _t, size, colPick, colPick_p1) {
    noFill();
    push();
    let t = _t; //trunk boolean
    let s = _s * size; //length

    //primary
    let colors01 = [];
    //secondary
    let colors02 = [];

    if (colPick_p1 <= 0.333) {
      colors01 = [color(20, 25, 100), color(40, 25, 100), color(20, 25, 100)];
      colors02 = [color(2, 25, 100), color(20, 25, 100), color(0, 25, 100)];
    } else if (colPick_p1 > 0.33 && colPick_p1 <= 0.66) {
      colors01 = [color(20, 25, 100), color(40, 25, 100), color(20, 25, 100)];
      colors02 = [color(2, 25, 100), color(20, 25, 100), color(0, 25, 100)];
    } else {
      colors01 = [color(200, 25, 100), color(40, 25, 100), color(20, 25, 100)];
      colors02 = [color(200, 25, 100), color(20, 25, 100), color(0, 25, 100)];
    }

    theta = random(20, 30);
    translate(_x, _y);

    spread = 10 * size;
    inc = 30 * size;

    let rand = random(-spread, spread);

    //trunk
    strokeWeight(10 * size);
    stroke(colors01[colPick]);
    if (t == true) {
      beginShape();
      curveVertex(0, inc);
      curveVertex(0, 0);
      for (let i = inc; i < s; i += inc) {
        curveVertex(rand, -i);
      }
      curveVertex(0, -s);
      curveVertex(0, -s - inc);
      endShape();
    }

    translate(0, -s);
    stroke(colors02[colPick]);
    branch(s, t, size, colPick);
    stroke(colors01[colPick]);
    branch(s, t, size, colPick);
    pop();
  }

  function branch(h, t, size, _colPick) {
    let colors03 = [color(0, 1, 100), color(210, 20, 100)];

    if (t == false) {
      theta = random(15, 18);
    }

    if( h > 60 * size){
      spread = 2;
      inc = 15;
    }else {
      spread = 2;
      inc = 10;
    }

    h *= random(0.6, 0.7);

    strokeWeight((10 / 120) * h);


    if (h > 15 * size) {

      push();
      rotate(theta + random(-10, 10));
      noFill();
      beginShape();
      curveVertex(0, inc);
      curveVertex(0, 0);
      for (let i = inc; i < h; i += inc) {
        curveVertex(random(-spread, spread), -i);
      }
      curveVertex(0, -h);
      curveVertex(0, -h - inc);
      endShape();
      if (h < 60 * size) {
        for (let i = 0; i < 10; i++) {
          strokeWeight(1);

          let abc = _colPick;
          fill(colors03[0]);
          circle(
            0 + random(-20 * size, 20 * size),
            0 + random(-20 * size, 20 * size),
            random(2, 4) * size
          );
        }
      }
      translate(0, -h);
      branch(h, t, size, colPick);
      pop();

      push();
      rotate(-theta + random(-10, 10));
      beginShape();
      curveVertex(0, inc);
      curveVertex(0, 0);
      for (let i = inc; i < h; i += inc) {
        curveVertex(random(-spread, spread), -i);
      }
      curveVertex(0, -h);
      curveVertex(0, -h - inc);
      endShape();
      if (h < 60 * size) {
        for (let i = 0; i < 10; i++) {
          strokeWeight(1);
          fill(colors03[0]);
          circle(
            0 + random(-20 * size, 20 * size),
            0 + random(-20 * size, 20 * size),
            random(2, 8) * size
          );
        }
      }
      translate(0, -h);
      branch(h, t, size, colPick);
      pop();
    }
  }
}
