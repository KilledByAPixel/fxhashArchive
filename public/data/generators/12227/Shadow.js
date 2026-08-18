class Shadow {
  constructor(so, so2) {
    this.shadowoffset = so;
    this.shadowdirection = so2;
    this.density = 4;
  } /////////////////////////////////////////////////////////////

  draw() {
    if (loops > 0) {
      stroke(strokecolorshadows);
      strokeWeight(1);
      if (newy1 < oldy) {
        if (newx1 <= oldx1) {
          newx1 = oldx1;
        } else {
          newx1 = newx1 + random(25, 75);
        }
        if (newx4 >= oldx4) {
          newx4 = oldx4;
        } else {
          newx4 = newx4 - random(25, 75);
        }
        if (newx4 < newx1) {
          newx4 = newx1;
        }
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        if (newx1 > oldx1) {
          newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        }
        if (newx4 < oldx4) {
          newx4 = newx4 - this.shadowoffset;
        }
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      //////point the shadow
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
      if (newy1 < oldy) {
        line(newx1, newy1 + 5, newx4, newy1 + 5);
        newx1 = newx1 + this.shadowoffset + this.shadowdirection;
        newx4 = newx4 - this.shadowoffset;
        newy1 = newy1 + this.density;
        if (newx4 < newx1) {
          newx4 = newx1;
          noStroke();
        }
      }
    }
  }
}
