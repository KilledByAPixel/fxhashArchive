/////                                                        /////

// ░█▀█░█░█░█▀█░█▀▀░█░█░█░█░█▀▄░░░█░█░░░▀█▀░█▀▀░█▀█░█▀▄░█▀▀░█▀▄ //
// ░█▀▀░█░█░█░█░█▀▀░▀▄▀░░█░░█▀▄░░░▄▀▄░░░░█░░█▀▀░█░█░█░█░█▀▀░█▀▄ //
// ░▀░░░▀▀▀░▀░▀░▀▀▀░░▀░░░▀░░▀░▀░░░▀░▀░░░░▀░░▀▀▀░▀░▀░▀▀░░▀▀▀░▀░▀ //

/////                                                        /////


doublemargin = 500 / 3
size = 3000//5000
singlemargin = (size - size * .75) / 2
adj = 0

sw = size * .75 * 1600 / size
sh = size * .5 * 1600 / size

dw = 750 + adj * .75
dh = 500 + adj * .5

let marg = 0
let pall
let ymarg, xspac
let boxshadows = fxrand()

let inverse = false
if (fxrand() < .003) inverse = true
let passtype
let darkbg = false
console.log(fxhash)
let boxcolors = [
  [6, 145, 189, 255],
  [27, 180, 228, 255],
  [33, 220, 213, 255],
  [113, 236, 219, 255],
  [165, 4, 68, 255],
  [190, 35, 91, 255],
  [194, 6, 55, 255],
  [204, 20, 164, 255],
  [207, 16, 16, 255],
  [217, 13, 62, 255],
  [217, 82, 12, 255],
  [220, 23, 81, 255],
  [224, 54, 15, 255],
  [227, 77, 231, 255],
  [245, 65, 53, 255],
  [246, 49, 77, 255],
]

let tickcolors = [
  [62, 54, 58, 255],
  [72, 193, 220, 255],
  [88, 241, 205, 255],
  [148, 43, 106, 255],
  [168, 6, 6, 255],
  [183, 28, 73, 255],
  [234, 67, 30, 255],
  [255, 255, 255, 255],
]

let bgcolors = [
  [232, 212, 212, 255],
  [232, 230, 228, 255],
  [233, 228, 218, 255],
  [236, 220, 225, 255],
  [239, 216, 224, 255],
  [245, 223, 226, 255],
  [250, 234, 238, 255],]

let mainboxcolor

let behindorinfront = fxrand()
function setup() {
  createCanvas(2000, 2000)
  colorMode(RGB, 255);
  background(255)
  noiseSeed(boxshadows * 1000)

  if (inverse) strokeWeight(2)
  mainboxcolor = getColor()// create initial box coloring

  push()//create lightly colored bg
  fill(255)
  rect(0, 0, width, height)

  fill(bgcolors[Math.floor(map(fxrand(), 0, 1, 0, bgcolors.length))])

  if (fxrand() < .012) {
    fill(40, 33, 39, 255)
    darkbg = true;
  } //rare dark bg

  if (darkbg) {
    passtype = "Bonus Pass"
  } else if (inverse) {
    passtype = "Grail Pass"
  } else {
    passtype = "Access Pass"
  }
  window.$fxhashFeatures = {
    "Type": passtype
  }

  if (inverse) {
    fill(0)
  }

  rect(0, 0, width, height)
  pop()


  noStroke()


  if (columns == 1) {
    yspac = sh
    xspac = sw
    marg = singlemargin
    ymarg = singlemargin * 2
  } else if (columns == 2) {
    yspac = dh
    xspac = dw
    marg = doublemargin
    ymarg = doublemargin
  }
  else if (columns == 3) {
    yspac = sh / 2.4
    xspac = sw / 2.28
    marg = singlemargin / 3 - 30
    ymarg = singlemargin * 2 / 5
  }
  else {
    yspac = dh / 2
    xspac = dw / 2
    marg = doublemargin - 70
    ymarg = doublemargin / 2
  }
  tendert()//creates t with opac

  backgroundstuff()

  if (behindorinfront < .6) biglines()

  sidetics()

  createRects()

  if (behindorinfront > .8) biglines()

   newcanv = new p5(newcanva);
  noCanvas()
  //downl()
  fxpreview()
}
let newcanv



let tent

function tendert() {
  tent = createGraphics(2400, 2400)
  tent.noStroke()
  tent.blendMode(OVERLAY)
  for (var x = 0; x < 2400; x += 300) {
    for (var y = 0; y < 600; y += 300) {
      ptsx = [x, x + 150, x + 300]
      ptsy = [y, y + 150, y + 300]
      insamnt = 4
      ptamnt = 3 + Math.floor(fxrand * 2)
      for (var i = 0; i < insamnt; i++) {
        let shape = fxrand()

        c = color(boxcolors[Math.floor(map(fxrand(), 0, 1, 0, boxcolors.length))])
        c.setAlpha(80)
        if (columns > 1) c.setAlpha(50 - (columns - 1) * 10)
        tent.fill(c)

        if (inverse) {
          tent.noFill()
          tent.stroke(255)
          tent.strokeWeight(3)
        }

        tent.beginShape()

        if (shape < .15) {//ur triangle
          tent.vertex(x, y)
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 300)
          tent.endShape()
        } else if (shape < .3) { //bl tri
          tent.vertex(x, y)
          tent.vertex(x, y + 300)
          tent.vertex(x + 300, y + 300)
          tent.endShape()
        }
        else if (shape < .45) { //full
          tent.vertex(x, y)
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x, y + 300)
          tent.endShape(CLOSE)
        }
        else if (shape < .6) {// half top
          tent.vertex(x, y)
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 150)
          tent.vertex(x, y + 150)
          tent.endShape(CLOSE)
        }
        else if (shape < .75) {//half bot
          tent.vertex(x, y + 150)
          tent.vertex(x + 300, y + 150)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x, y + 300)
          tent.endShape(CLOSE)
        }
        else if (shape < .9) {//half bot
          tent.vertex(x + 300, y + 150)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x + 150, y + 300)
          tent.endShape(CLOSE)
        }
        else if (shape < 1) {//half bot
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x + 150, y + 300)
          tent.endShape(CLOSE)
        }

      }

    }
  }



  ///bottom part of t


  for (var x = 900; x < 1500; x += 300) {
    for (var y = 600; y < 2400; y += 300) {
      ptsx = [x, x + 150, x + 300]
      ptsy = [y, y + 150, y + 300]
      insamnt = 4
      ptamnt = 3 + Math.floor(fxrand * 2)
      for (var i = 0; i < insamnt; i++) {
        let shape = fxrand()

        c = color(boxcolors[Math.floor(map(fxrand(), 0, 1, 0, boxcolors.length))])

        c.setAlpha(80)
        if (columns > 1) c.setAlpha(40)
        if (columns > 3) c.setAlpha(30)

        tent.fill(c)
        if (inverse) {
          tent.noFill()
          tent.stroke(255)
        }

        tent.beginShape()
        // for(var j = 0;j<ptamnt;j++){

        // }
        if (shape < .15) {//ur triangle
          tent.vertex(x, y)
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 300)
          tent.endShape()
        } else if (shape < .3) { //bl tri
          tent.vertex(x, y)
          tent.vertex(x, y + 300)
          tent.vertex(x + 300, y + 300)
          tent.endShape()
        }
        else if (shape < .45) { //full
          tent.vertex(x, y)
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x, y + 300)
          tent.endShape(CLOSE)
        }
        else if (shape < .6) {// half top
          tent.vertex(x, y)
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 150)
          tent.vertex(x, y + 150)
          tent.endShape(CLOSE)
        }
        else if (shape < .75) {//half bot
          tent.vertex(x, y + 150)
          tent.vertex(x + 300, y + 150)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x, y + 300)
          tent.endShape(CLOSE)
        }
        else if (shape < .9) {//half bot
          tent.vertex(x + 300, y + 150)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x + 150, y + 300)
          tent.endShape(CLOSE)
        }
        else if (shape < 1) {//half bot
          tent.vertex(x + 300, y)
          tent.vertex(x + 300, y + 300)
          tent.vertex(x + 150, y + 300)
          tent.endShape(CLOSE)
        }

        //tent.rect(x,y,300)
      }

    }
  }
  //area one is

  //copy(tent, 0,0,tent.width,tent.height,0,0,800,800)
}

function biglines() {
  push()
  if (behindorinfront > .8) blendMode(OVERLAY)
  let startx = width * fxrand()
  let endx = width + map(fxrand(), 0, 1, 0, width)
  let boxwidth = 10
  let xspac = 3 * boxwidth
  let yspac = 1 * boxwidth
  let slope = 1
  if (inverse) {
    stroke(255)
    strokeWeight(1)
  }
  c1 = getLineColor()
  type = fxrand()//.8
  //type = .99
  if (type < .4) {//bottom right
    //if (fxrand() < .2) slope = 4//map(fxrand(),0,1,1,15) 
    for (var y = height; y > -boxwidth; y -= yspac) {
      for (var x = startx + (height - y) / slope; x < endx; x += xspac) {
        fill(c1[1])
        rect(x, y, boxwidth)
        fill(c1[0])
        rect(x - boxwidth, y, boxwidth)
      }
    }
  } else if (type < .8) {
    //upper left
    for (var y = 0; y < height; y += yspac) {
      for (var x = -endx + (height - y) / slope; x < startx - y; x += xspac) {
        fill(c1[1])
        rect(x, y, boxwidth)
        fill(c1[0])
        rect(x - boxwidth, y, boxwidth)
      }
    }
  } else if (type < .9) {
    //upper left stright
    for (var y = 0; y < height; y += yspac) {
      for (var x = -endx; x < startx - y; x += xspac) {
        fill(c1[1])
        rect(x, y, boxwidth)
        fill(c1[0])
        rect(x - boxwidth, y, boxwidth)
      }
    }
  }
  else if (type < 1) {
    //bottom right straight
    for (var x = startx; x < endx; x += xspac) {
      for (var y = height; y > height - (x - startx); y -= yspac) {
        fill(c1[1])
        rect(x, y, boxwidth)
        fill(c1[0])
        rect(x - boxwidth, y, boxwidth)
      }
    }
  }

  pop()

}


function sidetics() {
  let botbar = false
  let topbar = false
  let sidelines = false

  c1 = getTickcolor()
  c = c1[1]
  fill(c)

  if (inverse) {
    noFill()
    stroke(255)
  }

  if (fxrand() < .5) {//bottom bar
    botbar = true
    push()
    rectMode(CENTER)

    amnt = 10 * fxrand()
    startx = marg + (width - marg * 2) * fxrand()
    endx = (marg + (width - marg * 2) - startx) * fxrand() + startx
    hei = 100 * fxrand() + 50
    spacing = 100 * fxrand() + 50
    wid = spacing * .75 + spacing * .25 * fxrand()
    for (var x = startx; x < endx; x += spacing) {
      rect(x, height, wid, hei)
    }
    pop()
  }

  if (fxrand() < .5) {//top bar, doesnt go into the margins
    topbar = true
    push()
    rectMode(CENTER)
    amnt = 20 * fxrand()
    startx = marg + (width - marg * 2) * fxrand()
    endx = (marg + (width - marg * 2) - startx) * fxrand() + startx
    hei = 100 * fxrand() + 50
    spacing = 100 * fxrand() + 50
    wid = spacing * .75 + spacing * .25 * fxrand()
    rect(x, hei / 2, wid, hei / 4)

    pop()
  }


  if (!botbar || !topbar || fxrand() < .8) {//side lines
    push()
    //noStroke()


    coolio = getTickcolor()
    fill(coolio[0])

    if (inverse) {
      noFill()
      stroke(255)
    }

    samedif = fxrand()//determines if lines are mirror or matching
    lchoice = fxrand()
    if (lchoice < .15) { //thinlines

      rows = 30 * fxrand() + 20
      cols = 2
    }
    else if (lchoice < .3) { //longlines

      rows = 2 * fxrand() + 2
      cols = 10
    } else if (lchoice < .3) { //fat

      rows = 1 * fxrand() + 2
      cols = 2
    }
    else {

      rows = 10 * fxrand() + 5
      cols = 5 * fxrand() + 2
    }




    scl = map(fxrand(), 0, 1, .01, .001)
    h = height / rows / 2 + height / rows / 2 * fxrand()
    onecolor = fxrand()


    bothq = fxrand()
    ronly = fxrand()

    amntoflines = 0
    maxlines = Math.max(0, map(fxrand(), 0, 1, -3, 1))
    if (fxrand() < .2) maxlines += 1//Math.floor(fxrand() * 2) 20% chance for 2 lines
    ramnt = map(fxrand(), 0, 1, .1, .3)
    for (var x = 0; x < marg - (marg / cols) * 2; x += marg / cols) {
      for (var y = 0; y < height; y += height / rows) {
        if (fxrand() < ramnt) {
          let near = fxrand()
          if (bothq < .5) {//both left and right
            rect(x, y, doublemargin / cols + 5, h) //left side

            if (near < .8) {
              //add another tick near it
              adjx = (doublemargin / cols + 5) * (-1) ** (Math.floor(fxrand() * 2 + 1))
              adjy = h * (-1) ** (Math.floor(fxrand() * 2 + 1))
              rect(x + adjx, y + adjy, doublemargin / cols + 5, h)

            }

            newh = y
            if (samedif < .5) { //makes rows mirror
              newh = map(y, 0, height, height, 0) - height / rows
            }
            rect(width - x - doublemargin / cols, newh, doublemargin / cols + 5, h)//right side

            if (near < .8) {
              //add another tick near it
              adjx = (doublemargin / cols + 5) * (-1) ** (Math.floor(fxrand() * 2 + 1))
              adjy = h * (-1) ** (Math.floor(fxrand() * 2 + 1))
              rect(x + adjx, y + adjy, doublemargin / cols + 5, h)

            }

          } else if (ronly < .5) {//rightonly
            newh = y
            if (samedif < .5) { //makes rows mirror
              newh = map(y, 0, height, height, 0) - height / rows
            }
            rect(width - x - doublemargin / cols, newh, doublemargin / cols + 5, h)//right side

            if (near < .8) {
              //add another tick near it
              adjx = (doublemargin / cols + 5) * (-1) ** (Math.floor(fxrand() * 2 + 1))
              adjy = h * (-1) ** (Math.floor(fxrand() * 2 + 1))
              rect(x + adjx, y + adjy, doublemargin / cols + 5, h)

            }

          } else {//left only
            rect(x, y, doublemargin / cols + 5, h) //left side

            if (near < .8) {
              //add another tick near it
              adjx = (doublemargin / cols + 5) * (-1) ** (Math.floor(fxrand() * 2 + 1))
              adjy = h * (-1) ** (Math.floor(fxrand() * 2 + 1))
              rect(x + adjx, y + adjy, doublemargin / cols + 5, h)

            }
          }

          amntoflines += 1
        }
        if (amntoflines > maxlines) {
          x += doublemargin
          y += height
        }

      }

    }



    pop()
  }


}

function backgroundstuff() {

  //notes
  //always have anomalies, no bar chart, work on colors once i get them, but different opacities
  backgroundtype = fxrand()
  bgpattern = fxrand()

  al = map(fxrand(), 0, 1, 100, 200)

  cc = fxrand()
  c1 = getbgfacecolor(al, cc)
  g = fxrand() * 175
  gm = g + map(fxrand(), 0, 1, -30, 30)
  console.log(backgroundtype, bgpattern)
  if (backgroundtype < .4) {//30% face
    if (bgpattern < .2) { //small rect patch

      stx = fxrand() * width//starting x
      sty = fxrand() * height
      w = 300 + 700 * fxrand()//grid width
      h = 400 + 700 * fxrand()//grid height
      scl = .001
      sz = 60 * fxrand() + 10//face size
      for (var x = stx; x < stx + w; x += sz) {
        for (var y = sty; y < sty + h; y += sz) {
          n = noise(x * scl, y * scl)
          if (n < .5) {
            // fill(n*255)
            // rect(x,y,sz)
            textSize(sz)
            fill(color(153, 145, 201, al))//purple
            if (inverse) fill(255)
            text(`'`, x, y)
            fill(color(168, 204, 221, al))//blue
            if (inverse) fill(255)
            textSize(sz * .8)
            text(`~`, x + sz / 10, y)
            textSize(sz)
            fill(color(153, 145, 201, al))//purple
            if (inverse) fill(255)
            text(`'`, x + sz / 2, y)
          }

        }
      }
    } else if (bgpattern < .5) {   //weird line things

      scl = .001
      sz = 40 * fxrand() + 10//face size

      for (var x = 0; x < width; x += sz) {
        for (var y = 0; y < height; y += sz) {
          n = noise(x * scl, y * scl)
          if (n < .7) {
            // fill(n*255)
            // rect(x,y,sz)
            textSize(sz)
            fill(c1[0])//purple
            text(`'`, x, y)
            fill(c1[1])//blue
            textSize(sz * .8)
            text(`~`, x + sz / 10, y)
            textSize(sz)
            fill(c1[0])//purple
            text(`'`, x + sz / 2, y)
          } else { //different color maybe?
            //x+=sz
            for (var yy = y; yy < height; yy += sz) {
              textSize(sz)
              fill(color(153, 145, 201, al * 2))//purple
              if (inverse) fill(255)
              text(`'`, x, y)
              fill(color(168, 204, 221, al * 2))//blue
              if (inverse) fill(255)
              textSize(sz * .8)
              text(`~`, x + sz / 10, y)
              textSize(sz)
              fill(color(153, 145, 201, al * 2))//purple
              if (inverse) fill(255)
              text(`'`, x + sz / 2, y)
            }
            x += sz
          }

        }
      }
    } else if (bgpattern < .65) {//sparce face

      sz = 40 * fxrand() + 10//face size

      chunksize = 200 * fxrand() + 50
      stax = 0
      if (fxrand() < .5) stax = chunksize / 2
      for (var x = stax; x < width; x += chunksize) {
        for (var y = stax; y < height; y += chunksize) {


          for (var xx = x; xx < x + chunksize; xx += sz) {
            for (var yy = y; yy < y + chunksize; yy += sz) {
              textSize(sz)
              fill(c1[0])//purple
              text(`'`, x, y)
              fill(c1[1])//blue
              textSize(sz * .8)
              text(`~`, x + sz / 10, y)
              textSize(sz)
              fill(c1[0])//purple
              text(`'`, x + sz / 2, y)
            }
          }


        }
      }
    } else {//noise // changing to blocks

      sz = 100 * fxrand() + 10//face size

      chunksize = sz//200*fxrand()+50
      for (var x = sz / 5; x < width; x += chunksize) {
        if (fxrand() < .1) x += chunksize
        for (var y = sz / 5; y < height; y += chunksize) {


          textSize(sz)
          fill(c1[0])//purple
          text(`'`, x, y)
          fill(c1[1])//purple
          textSize(sz * .8)
          text(`~`, x + sz / 10, y)
          textSize(sz)
          fill(c1[0])//purple
          text(`'`, x + sz / 2, y)



        }
      }
    }
  }
  else if (backgroundtype < .6) {// 30%dot pattern
    if (bgpattern < .3) { //small patch

      stx = fxrand() * width//starting x
      sty = fxrand() * height
      w = 300 + 700 * fxrand()//grid width
      h = 400 + 700 * fxrand()//grid height
      scl = .001
      sz = 4 * fxrand() + 1//face size



      for (var x = stx; x < stx + w; x += sz * 4) {
        for (var y = sty; y < sty + h; y += sz * 4) {
          n = noise(x * scl, y * scl)
          if (n < .8) {

            fill(c1[0])
            ellipse(x, y, sz)
          }

        }
      }
    } else {   //weird linedot 
      scl = .01
      if (fxrand() < .5) scl = .001
      sz = 4 * fxrand() + 1//face size

      nval = .7
      spac = fxrand() * 20 + 10

      for (var x = 0; x < width; x += spac) {
        for (var y = 0; y < height; y += spac) {
          n = noise(x * scl, y * scl)
          if (n < nval) {

            fill(c1[0])
            if (inverse) fill(255)
            ellipse(x, y, sz)
          }

        }
      }
    }
  }
  else if (backgroundtype < .9) {//30% technical, like in refernce
    //big area of grid stuff with blendmode lighten?

    push()
    //blendMode(OVERLAY);
    rectMode(CENTER)
    gridamnt = 50
    innergridamnt = fxrand() * 2 + 2
    outergridwidth = width / gridamnt
    innerboxwidth = width / gridamnt / innergridamnt
    fill(c1[0])
    //darker was just fill(0)
    scl = .1
    n1scl = .1
    marg = map(fxrand(), 0, 1, 100, 400)
    for (var x = 0; x < width; x += outergridwidth + marg) {//main grid
      for (var y = 0; y < height; y += outergridwidth + marg) {
        n1 = noise((x) * n1scl, (y) * n1scl)

        for (var xx = x; xx < x + outergridwidth; xx += innerboxwidth) {//inner grid
          for (var yy = y; yy < y + outergridwidth; yy += innerboxwidth) {
            n = noise((xx - x) * scl, (yy - y) * scl)
            if (n < .4) {
              rect(xx, yy, innerboxwidth)
            }


          }
        }
        if (n1 < .1) {
          x += outergridwidth + marg
        }




      }
    }

    pop()


  }
  else {
    console.log("none")
  }



}



//make it so all the same color, or all different
let goodvariablename = fxrand()
columns = Math.floor(1 + fxrand() * 2)//either 1 or 2
if (fxrand() < .05) columns = 3
if (fxrand() < .05) columns = 4

let startpos = fxrand()

function createRects() {//creates columns of rects 
  boxcolor = mainboxcolor
  boxcolor[0].setAlpha(255)
  boxcolor[1].setAlpha(255)

  if (startpos < .5) {
    starty = map(fxrand(), 0, 1, -height / 2, height / 2)
  } else {
    if (columns == 1) starty = 800
    if (columns == 2) starty = -600
    if (columns == 3) starty = 90
    if (columns == 4) starty = 45
  }


  if (columns == 1) {
    yspac = sh
    xspac = sw
    marg = singlemargin
    ymarg = singlemargin * 2
  } else if (columns == 2) {
    yspac = dh
    xspac = dw
    marg = doublemargin
    ymarg = doublemargin
  }
  else if (columns == 3) {
    yspac = sh / 2.4
    xspac = sw / 2.28
    marg = singlemargin / 3 - 30
    ymarg = singlemargin * 2 / 5
  }
  else {
    yspac = dh / 2
    xspac = dw / 2
    marg = doublemargin - 70
    ymarg = doublemargin / 2
  }

  if (columns == 1 || columns == 2) { //5% chance that the boxes will be bigger by some amoutn
    if (fxrand() < .05) {
      bigger = fxrand() + 1
      yspac = yspac * bigger
      xspac = xspac * bigger
      marg = marg * bigger
      ymarg = ymarg * bigger

    }


  }



  bigboy = createGraphics(xspac + outcropamnt * 2, yspac + outcropamnt * 2)
  dsdarkness = map(fxrand(), 0, 1, 50, 100)
  for (x = marg; x < width - xspac / 2; x += xspac + marg) {
    for (y = starty; y < height; y += yspac + ymarg) {
      if (goodvariablename < .05) { //5       %chance boxes wil all be diff color
        boxcolor = getColor()
      }
      if (columns == 1) {
        if (boxshadows < .95) { //05% chance no box shadow
          bgbc = boxcolor[0]
          fill(color(red(bgbc) - dsdarkness, green(bgbc) - dsdarkness, blue(bgbc) - dsdarkness))
          rect(x + 10, y + 10, xspac, yspac)//shadows
        }

        fill(boxcolor[0])
        rect(x, y, xspac, yspac)//mainrects

        // tender t
        copy(tent, 0, 0, tent.width, tent.height, x + xspac / 6, y + yspac / 3, xspac - xspac / 6 * 2, yspac / 1.05)

        // if (lines) 
        fillrect(x - outcropamnt, y - outcropamnt, xspac + outcropamnt * 2, yspac + outcropamnt * 2)
      } else {
        if (fxrand() > .03) {//3%chance it doesnt show
          if (boxshadows < .95) { //05% chance no box shadow
            bgbc = boxcolor[0]
            fill(color(red(bgbc) - dsdarkness, green(bgbc) - dsdarkness, blue(bgbc) - dsdarkness))
            rect(x + 10, y + 10, xspac, yspac)//shadows
          }

          fill(boxcolor[0])
          rect(x, y, xspac, yspac)//mainrects




          // if (lines) 
          fillrect(x - outcropamnt, y - outcropamnt, xspac + outcropamnt * 2, yspac + outcropamnt * 2)


          //tender t
          copy(tent, 0, 0, tent.width, tent.height, x + xspac / 6, y + yspac / 3, xspac - xspac / 6 * 2, yspac / 1.05)
        }
      }

    }
  }

}




let outcropamnt = doublemargin / 4

let ok
let bigboy

sameordiff = fxrand()
sadv = .96 //odds that they are the same among all rects
donefirst = false

let overlaypercent = fxrand()
function fillrect(x1, y1, w, h) {
  push()
  if (overlaypercent < .5) blendMode(OVERLAY);

  insam = Math.floor(fxrand() * 2 + 1)//9*fxrand()+1
  rotamnt = 90//90*fxrand()//map() //90,30, CHANGE THIS


  for (var i = 0; i < insam; i++) {
    ok = createGraphics(w, h)
    ok.rectMode(CORNER)
    ok.noStroke()
    if (inverse) {
      ok.stroke(255)
    }
    ok.angleMode(DEGREES)

    boxwidth = 10
    boxheight = 10

    ram = rotamnt * Math.floor(fxrand() * 4)//360/rotamnt)

    ok.translate(w / 2, h / 2)
    ok.rotate(ram)
    ok.translate(-w / 2, -h / 2)

    slope = Math.ceil(fxrand(), 0, 1, -1, 1)//Math.floor(map(fxrand(), 0, 1, -1, 2))

    startxx = 0//Math.min(0,map(fxrand(), 0, 1, -400, 300)) //changes height further negative you go for some math reason
    startyy = Math.min(0, map(fxrand(), 0, 1, startxx - 1000, startxx + 450)) //changes width further negative you go for some math reason

    endxx = w * 2 * fxrand() + startxx
    endyy = h * 2 * fxrand() + startyy

    xxspac = 1
    yyspac = 3

    c1 = getLineColor()

    for (var y = startyy; y < endyy; y += boxheight * yyspac) {
      sy = 0
      for (var x = startxx; x < endxx; x += boxwidth * xxspac) {
        tty = y + sy * boxheight * slope

        ok.fill(c1[0])
        ok.rect(x, tty, boxwidth, boxheight)
        ok.fill(c1[1])
        ok.rect(x, tty - boxheight, boxwidth, boxheight)
        sy += 1
      }
    }

    ok.translate(w / 2, h / 2)
    ok.rotate(-ram) //bring it back to og rot
    ok.translate(-w / 2, -h / 2)


    chancehidden = .3
    if (fxrand() < chancehidden) {
      ok.erase()
      ok.rect(0, 0, outcropamnt, height) //l
    }
    if (fxrand() < chancehidden) {
      ok.erase()
      ok.rect(w - outcropamnt, 0, outcropamnt * 2, height) //r
    }
    if (fxrand() < chancehidden) {

      ok.erase()
      ok.rect(0, 0, width, outcropamnt) // t
    }
    if (fxrand() < chancehidden) {
      ok.erase()
      ok.rect(0, h - outcropamnt, width, outcropamnt * 2) // b

    }




    if (donefirst && sameordiff < sadv) {
      copy(bigboy, 0, 0, ok.width, ok.height, x1, y1, w, h)
    } else {
      copy(ok, 0, 0, ok.width, ok.height, x1, y1, w, h)
      copy(ok, 0, 0, ok.width, ok.height, x1, y1, w, h)//mult copies loks better
      copy(ok, 0, 0, ok.width, ok.height, x1, y1, w, h)
      bigboy.copy(ok, 0, 0, ok.width, ok.height, 0, 0, w, h)
      bigboy.copy(ok, 0, 0, ok.width, ok.height, 0, 0, w, h)
      bigboy.copy(ok, 0, 0, ok.width, ok.height, 0, 0, w, h)
    }


  }
  donefirst = true
  pop()
}


function getColor() {
  //
  damnt = 20
  c = color(boxcolors[Math.floor(map(fxrand(), 0, 1, 0, boxcolors.length))])
  c1 = color(boxcolors[Math.floor(map(fxrand(), 0, 1, 0, boxcolors.length))])
  // color(red(c)-damnt, green(c)-damnt, blue(c)-damnt)//
  if (inverse) {
    c = color(0)
    c1 = color(255)
  }
  return [c, c1]

}

function getLineColor() {
  c = color(boxcolors[Math.floor(map(fxrand(), 0, 1, 0, boxcolors.length))])
  c1 = color(boxcolors[Math.floor(map(fxrand(), 0, 1, 0, boxcolors.length))])

  if (inverse) {
    c1 = 0
    c = 0
  }

  return [c, c1]
}


function getbgfacecolor(a, colchoi) {
  c = mainboxcolor[0]
  c.setAlpha(a)
  c1 = mainboxcolor[1]
  c1.setAlpha(a)

  if (inverse) {
    c1 = 255
    c = 255
  }

  return [c, c1]

}

function getTickcolor() {
  c = color(tickcolors[Math.floor(map(fxrand(), 0, 1, 0, tickcolors.length))])
  c1 = color(tickcolors[Math.floor(map(fxrand(), 0, 1, 0, tickcolors.length))])

  if (inverse) {
    c1 = 0
    c = 0
  }

  return [c, c1]

}



let maincopy

let newcanva = function (p) {
  let bgimg
  p.preload = function(){
    bgimg = p.loadImage("./cbg.png")
  }
  p.setup = function () {
    p.createCanvas(5000, 5000);
    p.image(bgimg, 0, 0, p.width, p.height)//background shadow
    p.copy(get(), 2, 2, width - 5, height - 5, p.width / 20, p.height / 20, p.width - p.width / 10, p.height - p.height / 10)
    maincopy = p.get()
 
  };

  p.draw = function () {
      document.getElementById("defaultCanvas0").style.display = "block"

      sz = Math.min(window.innerWidth, window.innerHeight)
      p.resizeCanvas(sz, sz)
      p.image(bgimg, 0, 0, p.width, p.height)//background shadow
      p.copy(get(), 2, 2, width - 5, height - 5, p.width / 20, p.height / 20, p.width - p.width / 10, p.height - p.height / 10)
    

  }

};



let keys = ""
function keyPressed() {

  keys += key
  if (keys.includes("heythat")) {
    if (keys.includes("heythatstoosmall")) {
      let oklol = new p5(tinything);
    }
  } else {
    if (key == "s") {
      let oh = new p5(dwn9k);
    }

  }

}

let dwn9k = function (p) {

  p.setup = function () {
    p.createCanvas(9000/p.pixelDensity(), 9000/p.pixelDensity());
    p.copy(maincopy, 0, 0, maincopy.width, maincopy.height, 0, 0, p.width, p.height)
    var canvas = document.getElementById(p.canvas.id);
    var anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `TENDER_Pass_Art.PNG`;
    anchor.click();
    p.noCanvas()
  };

};

let tinything = function (p) {
  p.setup = function () {
    p.createCanvas(16, 16);
    p.copy(maincopy, 0, 0, maincopy.width, maincopy.height, 0, 0, p.width, p.height)
    var canvas = document.getElementById(p.canvas.id);
    var anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `t i n y _TENDER_Pass_Art.PNG`;
    anchor.click();
    p.noCanvas()
  };
};
