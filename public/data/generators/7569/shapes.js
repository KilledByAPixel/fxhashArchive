function runShapes(
  shape,
  x,
  y,
  r,
  rotation,
  rotator,
  rounder1,
  rounder2,
  rounder3,
  rounder4,
  cAdj2,
  cAdj3,
  cAdj4,
  cAdj5,
  cAdj6,
  cAdj7,
  finalC1,
  finalC2,
  finalC3,
  finalC4,
  finalC5,
  finalC6,
  finalC7,
  finalC8,  
  fillTranslucent,
  fAdj1,
  finalStroke,
  finalStrokeEmpty,
  finalStrokeEmpty2,
  finalStrokeEmpty3,
  flexer0,
  flexer1,
   filled
) {
  cAdj20 = random(0.25, 0.39);
  cAdj21 = random(0.1, 0.2);
  // if (filled==1) {
    finalC1.setAlpha(filledCol_Alpha);
    finalC2.setAlpha(filledCol_Alpha);
    finalC3.setAlpha(filledCol_Alpha);
    finalC4.setAlpha(filledCol_Alpha);
    finalC5.setAlpha(filledCol_Alpha);
    finalC6.setAlpha(filledCol_Alpha);
    finalC7.setAlpha(filledCol_Alpha);
    finalC8.setAlpha(filledCol_Alpha);
    if (filled==1) {
    finalStroke.setAlpha(filledStrokeCol_Alpha);      
    } else if (filled==0) {
    finalStroke.setAlpha(emptyStrokeCol_Alpha);
    finalStrokeEmpty.setAlpha(emptyStrokeCol_Alpha);
    finalStrokeEmpty2.setAlpha(emptyStrokeCol_Alpha);
    }
    if (fillColorName == "Translucent: Palette" || fillColorName == "Translucent: Light & Dark") {
      fillTranslucent.setAlpha(cTranslucentAlpha);
    }
    
   if (noiseON >0) {
     strokeWeighting = 0.65*sizeAdjust;
   } else  {
     strokeWeighting = 1.05*sizeAdjust;
   }

  rectMode(CENTER);
    strokeJoin(ROUND);

  let rot1 = sin(rotation);
  let rot2 = cos(rotation);
  let rot3 = sin(rotation * TWO_PI);
  let rot4 = cos(rotation * TWO_PI);

  if (symmetricalON !== 0) {
    push();

    if (symmetricalON == 1) {
      translate(width - x, y); //,  r);
    } else if (symmetricalON == 2) {
      translate(x, height - y); //,  r);
    } else if (symmetricalON == 3) {
      translate(width - x, height - y); //,  r);
    }
    if (rotateON == 1) {
      if (rotator == 1) {
        rotate(rot1);
      } else if (rotator == 2) {
        rotate(rot2);
      } else if (rotator == 3) {
        rotate(rot3);
      } else if (rotator == 4) {
        rotate(rot4);
      }
    }
    if (shape == "Square") {
      squareShape(
        x,
        y,
        r,
        rotation,
        rotator,
        cAdj2,
        cAdj3,
        cAdj4,
        cAdj5,
        cAdj6,
        cAdj7,
        finalC1,
        finalC2,
        finalC3,
        finalC4,
        finalC5,
        finalC6,
        finalC7,
        finalC8,  
        fillTranslucent,
        rounder1,
        rounder2,
        rounder3,
        rounder4,
        finalStroke,
        finalStrokeEmpty,
        finalStrokeEmpty2,
        finalStrokeEmpty3,
        flexer0,
        flexer1,
        filled
      );
    } else if (shape == "Circle") {
      circleShape(
        x,
        y,
        r,
        rotation,
        rotator,
        cAdj2,
        cAdj3,
        cAdj4,
        cAdj5,
        cAdj6,
        cAdj7,
        finalC1,
        finalC2,
        finalC3,
        finalC4,
        finalC5,
        finalC6,
        finalC7,
        finalC8,  
        fillTranslucent,
        finalStroke,
        finalStrokeEmpty,
        finalStrokeEmpty2,
        finalStrokeEmpty3,
        flexer0,
        flexer1,
        filled
      );
    } 

    pop();

  }

  push();
  translate(x, y); //,  r);
  rot1 = sin(rotation);
  rot2 = cos(rotation);
  rot3 = sin(rotation * TWO_PI);
  rot4 = cos(rotation * TWO_PI);

  if (rotateON == 1) {
    if (rotator == 1) {
      rotate(rot1);
    } else if (rotator == 2) {
      rotate(rot2);
    } else if (rotator == 3) {
      rotate(rot3);
    } else if (rotator == 4) {
      rotate(rot4);
    }
  }

  if (shape == "Square") {
    squareShape(
      x,
      y,
      r,
      rotation,
      rotator,
      cAdj2,
      cAdj3,
      cAdj4,
      cAdj5,
      cAdj6,
      cAdj7,
      finalC1,
      finalC2,
      finalC3,
      finalC4,
      finalC5,
      finalC6,
      finalC7,
      finalC8,  
      fillTranslucent,
      rounder1,
      rounder2,
      rounder3,
      rounder4,
      finalStroke,
      finalStrokeEmpty,
      finalStrokeEmpty2,
      finalStrokeEmpty3,
      flexer0,
      flexer1,
      filled
    );
  } else if (shape == "Circle") {
    circleShape(
      x,
      y,
      r,
      rotation,
      rotator,
      cAdj2,
      cAdj3,
      cAdj4,
      cAdj5,
      cAdj6,
      cAdj7,
      finalC1,
      finalC2,
      finalC3,
      finalC4,
      finalC5,
      finalC6,
      finalC7,
      finalC8,  
      fillTranslucent,
      finalStroke,
      finalStrokeEmpty,
      finalStrokeEmpty2,
      finalStrokeEmpty3,
      flexer0,
      flexer1,
      filled
    );
  } 

  pop();

}

function squareShape(
  x,
  y,
  r,
  rotation,
  rotator,
  cAdj2,
  cAdj3,
  cAdj4,
  cAdj5,
  cAdj6,
  cAdj7,
  finalC1,
  finalC2,
  finalC3,
  finalC4,
  finalC5,
  finalC6,
  finalC7,
  finalC8,  
  fillTranslucent,
  rounder1,
  rounder2,
  rounder3,
  rounder4,
  finalStroke,
  finalStrokeEmpty,
  finalStrokeEmpty2,
  finalStrokeEmpty3,
  flexer0,
  flexer1,
   filled
) {
  //  rectMode(CENTER);

  if (filled == 1) {
    stroke(finalStroke);
    strokeWeight(1*sizeAdjust);
    fill(finalC1);
    if (hatchedON ==1 && r<=sizeAdjust) {
      stroke(eclosionColor);
      eclosionColor.setAlpha(1)
      r = -0.5*sizeAdjust;
      strokeWeight((2*sizeAdjust)-(abs(r)));
    }

    square(0, 0, r * 2 * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
    noStroke();
    fill(finalC2);
    square(0, 0, r * 2 * cAdj2 * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
    fill(finalC3);
    square(0, 0, r * 2 * cAdj3 * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
    fill(finalC4);
    square(0, 0, r * 2 * cAdj4 * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
    fill(finalC5);
    square(0, 0, r * 2 * cAdj5 * flexer1, rounder1, rounder2, rounder3, rounder4);
    fill(finalC6);
    square(0, 0, r * 2 * cAdj6 * flexer1, rounder1, rounder2, rounder3, rounder4);
    fill(finalC7);
    square(0, 0, r * 2 * cAdj7 * flexer1, rounder1, rounder2, rounder3, rounder4);
    fill(finalC8);
    square(0, 0, r * 2 * cAdj8 * flexer1, rounder1, rounder2, rounder3, rounder4);
    
  } else if (filled == 0) {
    stroke(finalStrokeEmpty);
    fill(fillTranslucent);
    strokeWeight(strokeWeighting);
    if (hatchedON ==1 && r<=sizeAdjust) {
      stroke(eclosionColor);
      eclosionColor.setAlpha(1)
      r = -0.5*sizeAdjust
      strokeWeight((2*sizeAdjust)-(abs(r)));
    }
    square(0, 0, r * 2 * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
    if (innerWorm == "Dense") {
      fill(finalC3);
      noStroke();
      square(0, 0, r * 2 * iWorm * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
      fill(finalC4);
      square(0, 0, r * 2 * (iWorm / 2) * flexer1, rounder1, rounder2, rounder3, rounder4);
    } else if (innerWorm !== "Dense") {
      fill(fillTranslucent);
      stroke(finalStrokeEmpty2);
      square(0, 0, r * 2 * iWorm * (1 - flexer0), rounder1, rounder2, rounder3, rounder4);
      stroke(finalStrokeEmpty3);
      square(0, 0, r * 2 * iWorm/1.25 * flexer1, rounder1, rounder2, rounder3, rounder4);
    }
  }
}

function circleShape(
  x,
  y,
  r,
  rotation,
  rotator,
  cAdj2,
  cAdj3,
  cAdj4,
  cAdj5,
  cAdj6,
  cAdj7,
  finalC1,
  finalC2,
  finalC3,
  finalC4,
  finalC5,
  finalC6,
  finalC7,
  finalC8,  
  fillTranslucent,
  finalStroke,
  finalStrokeEmpty,
  finalStrokeEmpty2,
  finalStrokeEmpty3,
  flexer0,
  flexer1,
   filled
) 
{
  ellipseMode(CENTER);

  if (filled == 1) {
    stroke(finalStroke);
    fill(finalC1);
    strokeWeight(1*sizeAdjust);
    if (hatchedON ==1 && r<=sizeAdjust) {
      stroke(eclosionColor);
      // r = -0.5;
      eclosionColor.setAlpha(1)
      r = -0.5*sizeAdjust;
      strokeWeight((2*sizeAdjust)-(abs(r)));
    }
    circle(0, 0, r * 2 * (1 - flexer0));
    noStroke();
    fill(finalC2);
    circle(0, 0, r * 2 * cAdj2 * (1 - flexer0));
    fill(finalC3);
    circle(0, 0, r * 2 * cAdj3 * (1 - flexer0));
    fill(finalC4);
    circle(0, 0, r * 2 * cAdj4 * (1 - flexer0));
    fill(finalC5);
    circle(0, 0, r * 2 * cAdj5 * flexer1);
    fill(finalC6);
    circle(0, 0, r * 2 * cAdj6 * flexer1);
    fill(finalC7);
    circle(0, 0, r * 2 * cAdj7 * flexer1);
    fill(finalC8);
    circle(0, 0, r * 2 * cAdj8 * flexer1);
    
  } else if (filled == 0) {
    stroke(finalStrokeEmpty);
    fill(fillTranslucent);
    strokeWeight(strokeWeighting);
    if (hatchedON ==1 && r<=sizeAdjust) {
      stroke(eclosionColor);
      eclosionColor.setAlpha(1)
      r = -0.5*sizeAdjust;
      strokeWeight((2*sizeAdjust)-abs(r));
    }
    circle(0, 0, r * 2 * (1 - flexer0));
    if (innerWorm == "Dense") {
      fill(finalC3);
      noStroke();
      circle(0, 0, r * 2 * iWorm * flexer1);
      fill(finalC5);
      circle(0, 0, r * 2 * (iWorm / 2) * (1 - flexer0));
    } else if (innerWorm !== "Dense") {
      fill(fillTranslucent);
      stroke(finalStrokeEmpty2);
      strokeWeight(1*sizeAdjust);
      circle(0, 0, r * 2 * iWorm * (1 - flexer0));
      stroke(finalStrokeEmpty3);
      circle(0, 0, r * 2 * iWorm/1.25 * flexer1);
    }
  }

}
