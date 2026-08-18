class Doors {
  constructor() {}

  draw() {
    stroke(strokecolor);
    noStroke();
    fill(fillcolorblockright);
    rect(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5,
      50,
      linelength * 0.5
    );
    strokeWeight(2);
    for (i = 0; i <= 7; i++) {
      stroke(strokecolor);
      t = i / 7;
      x = bezierPoint(
        x3 + (dist(x3, y1, x4, y1) / 2 - 25),
        x3 + (dist(x3, y1, x4, y1) / 2 - 12),
        x3 + (dist(x3, y1, x4, y1) / 2 + 13),
        x3 + (dist(x3, y1, x4, y1) / 2 + 25),
        t
      );
      y = bezierPoint(y1, y1, y2, y2, t);
      ydist = dist(x, y, x, y - linelength / 10);
      op1 = 255;
      nxoffset = random(1.5);
      line(x, y + random(-5, 3), x, y - ydist);
      stroke(r, g, b, random(op1, 255));
      strokeWeight(random(2, 4));
      nxoffset = random(1.5);
      line(x + nxoffset, y - ydist, x + nxoffset, y - ydist * 2);
      stroke(r, g, b, random(op1, 255));
      strokeWeight(random(2, 4));
      nxoffset = random(1.5);
      line(x + nxoffset, y - ydist * 2, x + nxoffset, y - ydist * 3);
      stroke(r, g, b, random(op1, 255));
      strokeWeight(random(2, 4));
      nxoffset = random(1.5);
      line(x + nxoffset, y - ydist * 3, x + nxoffset, y - ydist * 4);
      stroke(r, g, b, random(op1, 255));
      strokeWeight(random(2, 4));
      nxoffset = random(1.5);
      line(x + nxoffset, y - ydist * 4, x + nxoffset, y - ydist * 5);
      stroke(r, g, b, random(op1, 255));
      strokeWeight(random(2, 4));
      nxoffset = random(1.5);
      // line(x + nxoffset, y - ydist * 5, x + nxoffset, y - ydist * 6);
      // stroke(r, g, b, random(op1, 255));
      // strokeWeight(random(2, 4));
      // nxoffset = random(1.5);
      // line(x + nxoffset, y - ydist * 6, x + nxoffset, y - ydist * 7);
      // stroke(r, g, b, random(op1, 255));
      // strokeWeight(random(2, 4));
      // nxoffset = random(1.5);
      // line(x + nxoffset, y - ydist * 7, x + nxoffset, y - ydist * 8);
      // stroke(r, g, b, random(op1, 255));
      // strokeWeight(random(2, 4));
      // nxoffset = random(1.5);
      // line(x + nxoffset, y - ydist * 8, x + nxoffset, y - ydist * 9);
      // stroke(r, g, b, random(op1, 255));
      // strokeWeight(random(2, 4));
      // nxoffset = random(1.5);
      // line(x, y - ydist * 9, x, y - ydist * 10 + random(-3, 5));
    }

    fill(0);
    strokeWeight(1);
    stroke(strokecolorshadows);
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5,
      x3 + (dist(x3, y1, x4, y1) / 2 + 25),
      oldy - oldlinelength - linelength * 0.5
    );
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5 + 3,
      x3 + (dist(x3, y1, x4, y1) / 2 + 18),
      oldy - oldlinelength - linelength * 0.5 + 3
    );
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5 + 6,
      x3 + (dist(x3, y1, x4, y1) / 2 + 11),
      oldy - oldlinelength - linelength * 0.5 + 6
    );
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5 + 9,
      x3 + (dist(x3, y1, x4, y1) / 2 + 4),
      oldy - oldlinelength - linelength * 0.5 + 9
    );
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5 + 12,
      x3 + (dist(x3, y1, x4, y1) / 2 - 3),
      oldy - oldlinelength - linelength * 0.5 + 12
    );
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5 + 15,
      x3 + (dist(x3, y1, x4, y1) / 2 - 10),
      oldy - oldlinelength - linelength * 0.5 + 15
    );
    line(
      x3 + (dist(x3, y1, x4, y1) / 2 - 25),
      oldy - oldlinelength - linelength * 0.5 + 18,
      x3 + (dist(x3, y1, x4, y1) / 2 - 17),
      oldy - oldlinelength - linelength * 0.5 + 18
    );
  }
}
