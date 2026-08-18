// need to double check all of these.

function createPaper() {
  let confettiMax = width/70;
  let tenish = 10*sizeAdjust;
  let baselineOne = w/wBase;
  let baselinePointOne = baselineOne/10;
  // print(baselinePointOne);
  var straightAlpha = 0.1*sizeAdjust;
  var straightWeight = 0.1*sizeAdjust;
  var straightColor = random(c);
  var curvedAlpha = 0.1;
  var curvedWeight = 0.1*sizeAdjust;
  var curvedColor = random(c);
  var colorFrothy1 = random(c);
  var frothAlpha = 0.25;
  var confettiAlpha = 0.15;
  var colorConfetti = random(c);
  var fuzzAlpha = 0.1;
  var fuzzWeight = 0.1*sizeAdjust;
  var fuzzColor = random(c);
  var sandAlpha = 0.1;
  var sandWeight = 0.1*sizeAdjust;
  var sandColor = random(c);
  var linenAlpha =0.1;
  var linenWeight = 0.1*sizeAdjust;
  var linenColor = random(c);
  
  
  if (frame == "Background" || frame == "Background/Foreground") {

    edgeMarker = 0;
    paperTrips = 100000 / sqrt(iterations);

    noFill();
    
    // paperType = "Curved";
    // edges = "Clean";
    
    if (paperType == "Curved") {
        let curvedStroke1 = random(c);
        let sizeHelp = 1+randomGaussian(0,1);
      // strokeWeight(random(0, 0.01*sizeAdjust));
      if (paperCount <= paperIterations *0.22) {
          curvedWeight = random(0.005*sizeAdjust, 0.06*sizeAdjust);
          curvedAlpha = random(0.3, 0.5);

        curvedStroke1 = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
      } else if (paperCount <= paperIterations * 0.5) {
        curvedStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
        curvedWeight = random(0.005*sizeAdjust, 0.02*sizeAdjust);
        curvedAlpha = random(0.1, 0.3);
      } else if (paperCount <= paperIterations) {
        curvedStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
        curvedWeight = random(0.001*sizeAdjust, 0.01*sizeAdjust);
          curvedAlpha = random(0.1, 0.2);
      }
        curvedStroke1.setAlpha(curvedAlpha);
        stroke(curvedStroke1);
        strokeWeight(curvedWeight);
      for (b = 1; b <= 1 * paperTrips; b+=3) {
        // arc(
        //   random(0 + frameSizeW, width - frameSizeW),
        //   random(0 + frameSizeH, height - frameSizeH),
        //   random(0, width*sizeHelp),
        //   random(0, height*sizeHelp),
        //   random(PI),
        //   random(PI)
        // );
        arc(
          random(0 + frameSizeW, width - frameSizeW),
          random(0 + frameSizeH, height - frameSizeH),
          random(0, width*sizeHelp),
          random(0, height*sizeHelp),
          random(PI),
          random(PI)
        );
      }
    } else if (paperType == "Straight") {
        let straightStroke1 = random(c);
      if (paperCount <= paperIterations *0.22) {
            strokeWeight(random(0.005*sizeAdjust, 0.06*sizeAdjust));
        straightStroke1 = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
      } else if (paperCount <= paperIterations * 0.5) {
        straightStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
    strokeWeight(random(0.005*sizeAdjust, 0.02*sizeAdjust));
      } else if (paperCount <= paperIterations) {
        straightStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
    strokeWeight(random(0.001*sizeAdjust, 0.01*sizeAdjust));
      }
      stroke(straightStroke1);
      if (edges == "Clean") {
          edgeMarker = 1;
        }
      for (b = 1; b <= 1 * paperTrips; b += 5) {
        if (edges == "Rough") {
          edgeMarker = randomGaussian(0,frameSizeW/w);
        }  

        line(
          random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker),
          random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker),
          random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker),
          random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker)
        );
      }
      // if (edges == "Rough") {
      //   for (b = 1; b <= 1 * paperTrips; b += 250) {
      //     // line(
      //     //   random(width - frameSizeW*6, width+frameSize*0.5) ,
      //     //   random(0-frameSize*0.5, 0 + frameSizeH*6),
      //     //   random(width - frameSizeW*6, width+frameSize*0.5) ,
      //     //   random(0-frameSize*0.5, 0 + frameSizeH*6)
      //     // );
      //     // line(
      //     //   random(0-frameSize*0.5, 0 + frameSizeW *6),
      //     //   random(height - frameSizeH*6, height+frameSize*0.5),
      //     //   random(0-frameSize*0.5, 0 + frameSizeW *6),
      //     //   random(height - frameSizeH*6, height+frameSize*0.5)
      //     // );
      //   }
      // }
    } else if (paperType == "Frothy") {
      let frothyStroke1 = random(c);
      if (edges == "Rough") {
        edgeMarker = random(-tenish*2, tenish*2);
      }
      if (paperCount <= paperIterations *0.22) {
            strokeWeight(random(0.05*sizeAdjust, 0.10*sizeAdjust));
        frothyStroke1 = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
      } else if (paperCount <= paperIterations * 0.5) {
        frothyStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
    strokeWeight(random(0.02*sizeAdjust, 0.04*sizeAdjust));
      } else if (paperCount <= paperIterations) {
        frothyStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
    strokeWeight(random(0.01*sizeAdjust, 0.02*sizeAdjust));
      }
      stroke(frothyStroke1);
          for (b = 1; b <= paperTrips/4; b++) {

        ellipse(
          random(0 + frameSizeW, width - frameSizeW) + edgeMarker,
          random(0 + frameSizeH, height - frameSizeH) + edgeMarker,
          random(-tenish, tenish)
        );
      }
      if (edges == "Rough") {
        for (b = 1; b <= paperTrips/4; b += 400) {
          ellipse( random(0+frameSizeW*0.5, 0 + frameSizeW*2.5),
            random(height - frameSizeH*2.5, height-frameSizeH*0.5),
            random(-tenish, tenish)
          );
          ellipse( random(width - frameSizeW*2.5, width-frameSizeW*0.5),
            random(0+frameSizeH*0.5, 0 + frameSizeH*2.5), random(-tenish,tenish))
        }
      }
    } else if (paperType == "Confetti") {
        if (edges == "Rough") {
          edgeMarker = 1+ randomGaussian(0, 1); 
          // edgeMarker = random(-tenish*2, tenish*2);
        } else if (edges == "Clean") {
          edgeMarker = 1;
        }
      for (b = 1; b <= paperTrips/6; b++) {
         strokeWeight(random(0, confettiMax));
        if (paperCount <= paperIterations *0.25) {
          confettiAlpha = 0.25;
       } else if (paperCount <= paperIterations * 0.5) {
          confettiAlpha = 0.05;
       } else if (paperCount <= paperIterations) {
          confettiAlpha = 0.02;
        }
        colorConfetti = random(c);
        colorConfetti.setAlpha(confettiAlpha);
        stroke(colorConfetti);
        
        point(
          random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker),
          random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker)
        );
        point(
          random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker),
          random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker)
        );
      }
    } else if (paperType == "Sand") {
          sandAlpha = 0.5;
          sandWeight = random(0.2*sizeAdjust, 0.5*sizeAdjust);

      for (b = 0; b <= paperTrips; b++) {
        sandColor = random(c);
        sandColor.setAlpha(sandAlpha);
        stroke(sandColor);
        strokeWeight(sandWeight);
        
        if (edges == "Rough") {
          edgeMarker = 1+randomGaussian(0,1);
        } else if (edges == "Clean") {
          edgeMarker = 1;
        }

        point(
          random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker),
          random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker)
        );
        point(
          random(0 + frameSizeW*edgeMarker, width - frameSizeW*edgeMarker),
          random(0 + frameSizeH*edgeMarker, height - frameSizeH*edgeMarker)
        );
      }

    } else if (paperType == "Fuzz") {
        if (edges == "Rough") {
          edgeMarker = random(-tenish*4, tenish*4);
        } else if (edges == "Clean") {
          edgeMarker = random(-tenish*2, tenish*2);
        }
      let colorFuzz1 = random(c);
      // fuzzWeight = 0.1*sizeAdjust;
      strokeJoin(ROUND);
      noFill();
      for (b = 1; b <= paperTrips/1.4; b++) {
        if (paperCount <= paperIterations *0.25) {
        fuzzColor = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
             fuzzWeight = random(0.10*sizeAdjust, 0.20*sizeAdjust);
          stroke(colorFuzz1);
        } else if (paperCount <= paperIterations * 0.5) {
        
        fuzzColor = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
          fuzzWeight = random(0.005*sizeAdjust, 0.02*sizeAdjust);
        } else if (paperCount <= paperIterations) {
        fuzzColor = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
          // colorFuzz1.setAlpha(0.15);
           fuzzWeight = random(0.001*sizeAdjust, 0.01*sizeAdjust);
        }
        fuzzColor.setAlpha(fuzzAlpha);
        stroke(fuzzColor);
        strokeWeight(fuzzWeight);

        rx = random(0 + frameSizeW, width - frameSizeW);
        ry = random(0 + frameSizeH, height - frameSizeH);

        quad(
          rx + edgeMarker,
          ry + edgeMarker,
          rx + edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust)),
          ry - edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust)),
          rx - edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust)),
          ry + edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust)),
          rx - edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust)),
          ry - edgeMarker * random(-tenish/(10*sizeAdjust), tenish/(10*sizeAdjust))
        );
      }
      if (edges == "Rough") {
        for (b = 1; b <= 1 * paperTrips; b += 2000) {
          edgeMarker = random(-tenish*2, tenish*2);

          quad(random(width - frameSizeW*2, width+frameSizeW*0.5) -
              abs(edgeMarker * 2), random(0-frameSizeH*0.5, 0 + frameSizeH*2) + abs(edgeMarker * 2), random(width - frameSizeW*2, width+frameSizeW*0.5) - abs(edgeMarker * 2), random(0-frameSizeH*0.5, 0 + frameSizeH*2) + abs(edgeMarker * 2), random(width -  frameSizeW*2, width+frameSizeW*0.5) - abs(edgeMarker * 2), random(0-frameSizeH*0.5, 0 + frameSizeH*2) + abs(edgeMarker * 2), random(width -  frameSizeW*2, width+frameSizeW*0.5) - abs(edgeMarker * 2), random(0-frameSizeH*0.5, 0 + frameSizeH*2) + abs(edgeMarker * 2))
          
          quad(random(0-frameSizeW*0.5, 0 + frameSizeW*2) +
              abs(edgeMarker * 2), random(height - frameSizeH-2, height+frameSizeH*0.5) - abs(edgeMarker * 2)  , random(0-frameSizeW*0.5, 0 + frameSizeW*2) + abs(edgeMarker * 2), random(height - frameSizeH-2, height+frameSizeH*0.5) -abs(edgeMarker * 2), random(0-frameSizeW*0.5, 0 + frameSizeW*2) + abs(edgeMarker * 2), random(height - frameSizeH-2, height+frameSizeH*0.5) - abs(edgeMarker * 2), random(0-frameSizeW*0.5, 0 + frameSizeW*2) + abs(edgeMarker * 2), random(height - frameSizeH-2, height+frameSizeH*0.5) - abs(edgeMarker * 2))        

        }
      }
    } else if (paperType == "Linen") {
      if (edges == "Rough") {
        edgeMarker = random(-20*sizeAdjust, 20*sizeAdjust);
      } else if (edges == "Clean") {
        edgeMarker = random(-sizeAdjust, sizeAdjust);
        // edgeMarker =  randomGaussian(0,20)
      }
      for (b = 1; b <= 1 * paperTrips; b+=5) {
        var linenStroke1 = random(c);
      if (paperCount <= paperIterations *0.22) {
        linenAlpha = 0.6;
        linenWeight = random(0.005*sizeAdjust, 0.06*sizeAdjust);
        linenStroke1 = pc24l.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
      } else if (paperCount <= paperIterations * 0.5) {
        linenAlpha = 0.5;
        linenStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
        linenWeight = random(0.005*sizeAdjust, 0.02*sizeAdjust);
      } else if (paperCount <= paperIterations) {
        linenAlpha = 0.4;
        linenStroke1 = pc25d.indexOf(backgroundColor) >= 0 ? random(pc25d) : random(pc24l);
        linenWeight = random(0.001*sizeAdjust, 0.01*sizeAdjust);
      }
        linenAlpha = 1;
        linenStroke = random(c);
        linenStroke.setAlpha(linenAlpha);
        stroke(linenStroke);
        strokeWeight(linenWeight);
        
        
        rect(
          random(0 + frameSizeW, width - frameSizeW) + edgeMarker,
          random(0 + frameSizeH, height - frameSizeH) + edgeMarker,
          random(-tenish, tenish),
          random(-tenish, tenish)
        );

        rect(
          random(0 + frameSizeW, width - frameSizeW) + edgeMarker,
          random(0 + frameSizeH, height - frameSizeH) + edgeMarker,
          random(-tenish, tenish),
          random(-tenish, tenish)
        );
      }
      if (edges == "Rough") {
      for (b = 1; b <= 1 * paperTrips; b+=1800) {
                rect(
            random(width - frameSizeW*(2.5), width-frameSizeW/(2)),
            random(0 + frameSizeH/(2), 0 + frameSizeH*(2.5)),
            random(-tenish, tenish),
            random(-tenish, tenish)
          );
          rect(
            random(0 + frameSizeW/(2), 0 + frameSizeW*(2.5)),
            random(height - frameSizeH*(2.5), height-frameSizeH/(2)),
            random(-tenish, tenish),
            random(-tenish, tenish)
          );
    }
      }
    }
////////////////////////////////////////////

    stroke(gc1);
  } else if (frame !== "Background") {

    xStarter = random(-tenish*2, tenish*2);
    yStarter = random(-tenish*2, tenish*2);
    
        x = random(0,width);
        y = random(0,height);

        x2 = random(0, width);
        y2 = random(0, height);
        x3 = x + xStarter;
        y3 = y + yStarter;

        paperTrips = 50000 / sqrt(iterations);

        strokeWeight(random(0, baselinePointOne/2));
        noFill();
    
// paperType = "Sand";
        if (paperType == "Curved") {
          if (paperCount <= paperIterations * 0.25) {
              curvedWeight = random(baselinePointOne/2, baselinePointOne);
              curvedAlpha = 0.2;

          } else if (paperCount <= paperIterations) {
              curvedWeight = random(baselinePointOne/10, baselinePointOne/2);
              curvedAlpha = 0.15;
          }

          for (let s = 0; s<paperTrips/2; s++) {
            curvedColor = random(c);
            curvedColor.setAlpha(curvedAlpha);
            stroke(curvedColor);
            strokeWeight(curvedWeight);
            arc(
            random(width * -0.1, width * 1.1),
            random(height * -0.1, height * 1.1),
            random(width * -0.1, width * 1.1),
            random(height * -0.1, height * 1.1),
            random(0, TWO_PI),
            random(0, TWO_PI)
          );
          }
        } else if (paperType == "Straight") {
            if (paperCount <= paperIterations * 0.75) {
              straightWeight = random(baselineOne/2, baselineOne);
              straightAlpha = 0.06;
            } else  {
              straightWeight = random(baselineOne/4, baselineOne/1.5);
              straightAlpha = 0.03;
            }
          for (b = 0; b <= paperTrips/8; b ++) {
            straightColor = random(c);
            straightColor.setAlpha(straightAlpha);
            stroke(straightColor);
            strokeWeight(straightWeight);
            line(random(width*-0.1, width * 1.1), random(height*-0.1, height * 1.1), random(width*-0.1, width * 1.1), random(height*-0.1, height * 1.1));
          }

        } else if (paperType == "Frothy") {
          noFill();
          if (paperCount <= paperIterations * 0.25) {
            frothAlpha = 0.25;
            frothWeight = random(0.3*sizeAdjust,0.5*sizeAdjust);
          } else if (paperCount <= paperIterations * 0.5) {
            frothAlpha = 0.20;
            frothWeight = random(0.2*sizeAdjust,0.3*sizeAdjust);
          } else if (paperCount <= paperIterations) {
            frothAlpha = 0.15;
            frothWeight = random(0.1*sizeAdjust,0.2*sizeAdjust);
          } 
            colorFrothy1 = random(c);
            colorFrothy1.setAlpha(frothAlpha);
            stroke(colorFrothy1);
            strokeWeight(frothWeight);
            for (let s=0; s<paperTrips/2; s++) {

                          
              ellipse(
              random(width * -0.1, width * 1.1),
              random(height * -0.1, height * 1.1),
              random(0, TWO_PI * 2*sizeAdjust)
            );
          }
        } else if (paperType == "Confetti") {
          strokeWeight(random(0, confettiMax*sizeAdjust));
          if (paperCount <= paperIterations * 0.25) {
            confettiAlpha = 0.25;
          } else if (paperCount <= paperIterations * 0.5) {
            confettiAlpha = 0.2;
          } else if (paperCount <= paperIterations) {
            confettiAlpha = 0.15;
          }

            for (let s=0; s<paperTrips/2; s++) {
            colorConfetti = random(c);
            colorConfetti.setAlpha(confettiAlpha);
            stroke(colorConfetti);
            strokeWeight(random(0, confettiMax));              
            point(
              random(width * -0.1, width * 1.1),
              random(height * -0.1, height * 1.1)
            );
          }
        } else if (paperType == "Sand") {
          sandAlpha = 0.5;
          sandWeight = random(0.7*sizeAdjust, 0.9*sizeAdjust);
          strokeWeight(sandWeight);
          noFill();
            sandColor = random(c);
            sandColor.setAlpha (sandAlpha);
            stroke(sandColor);
          for (b = 0; b <= paperTrips; b++) {
            point(
              random(0, width),
              random(0, height)
            );
          }
        } else if (paperType == "Fuzz") {
          if (paperCount <= paperIterations * 0.75) {
             fuzzAlpha = 0.25;
            fuzzWeight = random(0.1*sizeAdjust, 0.2*sizeAdjust);
          } 
          else {
             fuzzAlpha = 0.10;
              fuzzWeight = random(0.05*sizeAdjust, 0.1*sizeAdjust);
          } 
            noFill();
            strokeWeight(fuzzWeight);
            fuzzColor = random(c)
            fuzzColor.setAlpha(fuzzAlpha);
            stroke(fuzzColor);
          for (b = 1; b <= paperTrips/4; b++) {
            
          rx = random(width * -0.1, width * 1.1);
          ry = random(height * -0.1, height * 1.1);

            quad(
              rx + random(-tenish*5, tenish*5),
              ry + random(-tenish*5, tenish*5),
              rx + random(-tenish*5, tenish*5),
              ry + random(-tenish*5, tenish*5),
              rx + random(-tenish*5, tenish*5),
              ry + random(-tenish*5, tenish*5),
              rx + random(-tenish*5, tenish*5),
              ry + random(-tenish*5, tenish*5)
            );

          }
        } else if (paperType == "Linen") {
            if (paperCount <= paperIterations * 0.75) {

              stroke(random(c));
              strokeWeight(random(0.01*sizeAdjust, 0.05*sizeAdjust));
            } else if (paperCount <= paperIterations) {

              stroke(random(pc24l));
              strokeWeight(random(0.001*sizeAdjust, 0.01*sizeAdjust));
            }
            for (let s = 0; s<paperTrips; s++) {
            rect(
              random(width * -0.1, width * 1.1),
              random(height * -0.1, height * 1.1),
              random(0, TWO_PI * 2*sizeAdjust),
              random(0, TWO_PI * 2*sizeAdjust)
            );
            }
        }
      }
}
