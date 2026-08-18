var canvas;
var shdr;
var colors;
var genSeed = null;
var oPos = 0;
var oRes = 1;

var shape_mode, level, rot, scratch, push;

/*
const capturer = new CCapture({
  framerate: 5,
  format: "png",
  name: "video_color",
  quality: 100,
  verbose: true,
});
*/

function pickParams() {
  genSeed = fxrand() * 9485763;
  randomSeed(genSeed);
  shape_mode = getWeightedOption([[0,6],[1,4]]);
  level = getWeightedOption([[16,4],[32,3],[64,3]]);
  rot = getWeightedOption([[0,3],[0.25,4],[0.5,3]]);
  scratch = getWeightedOption([[0,3],[1,1],[2,1]]);
  push = getWeightedOption([[0.1,1],[0.5,1]]);

  if (level == 64) {
    rot = 0.25;
  }

  if (scratch == 0) {
    push = 0;
  }

  palettes = {
    "monochrome" : ["181818 131313 101010 e0e0e0", 8],
    "ocean fog" : ["f9dfdc0a81ab0c4271000000", 8],
    "impressions of a sunset" : ["1b1a17f0a500e45826e6d5b8", 8],
    "multi" : ["00a19d fff8e5 e05d5d 2c2e43 595260 b2b1b9 ffd523", 8],
    "seasons" : ["92b4ecffffffffe69affd24c 125b50f8b400faf5e4ff6363", 8],
    "beach towel" : ["21325e3e497af1d00af0f0f0", 8],
    "eagle" : ["04156211468fda1212eeeeee", 8],
    "jaundiced verde" : ["f8b400faf5e42c786c004445", 8],
    "garden green" : ["1fab8962d2a29df3c4d7fbe8", 6],
    "concrete raspberry" : ["f73d9316003b413f427f8487", 8],
    "fresh salmon" : ["194350ff8882ffc2b49dbeb9", 8],
    "bruised" : ["ffe227eb596e4d375d121013", 8]
  };

  color_key = getWeightedOption(
    Object.keys(palettes).map(x => [x,palettes[x][1]]) );
  colors = parseHexStrings(palettes[color_key][0]);


  window.$fxhashFeatures = {
    "triangles": Boolean(shape_mode),
    "size": {16:"large",32:"medium",64:"small"}[level],
    "orientation": {0:"vertical",0.25:"diagonal",0.5:"vertical"}[rot],
    "swurl": {0:"none",1:"vertical",2:"horizontal"}[scratch],
    "offset": {0:"none",0.1:"low",0.5:"high"}[push],
    "palette": color_key,
  }  


  console.log(window.$fxhashFeatures);

}

function setup() {
  var mwh = 1024;
  canvas = createCanvas(mwh, mwh);
  pixelDensity(1);

  pickParams();
}

function qq(x, q) {
  return floor(x / q) * q;
}


function tri_recurse_wc(c, x, y, w, h, limit) {
  if (((w < limit) || (h < limit)) || ((random() < 0.25) && (w < c.width/2))) {
    if (random() < 0.5) {
      c.fill(...randitem(colors));
      c.triangle(x, y, x + w, y, x, y + h);
    }
    return;
  }
  tri_recurse_wc(c,x,y,w/2,h/2,limit);
  tri_recurse_wc(c,x+w/2,y,w/2,h/2,limit);
  tri_recurse_wc(c,x+w/2,y+w/2,w/2,h/2,limit);
  tri_recurse_wc(c,x,y+w/2,w/2,h/2,limit);
}

function makeArt_wc(c) {
  
  c.background(...randitem(colors));
  c.rotate(rot * PI);
  if (rot == 0.25) {
    c.scale(sqrt(2));
  }
  c.translate(-c.width/2,-c.height/2);
  c.noStroke();
  
  if (shape_mode < 2) {
    let n = level;
    let q = c.width / n;
    let m = 0;
    let nn = 50;
    let sub = 4;
    if (level == 64) {
      nn = 100; //500;
      sub = 16; //4 //16;
    }
    for (let i=0; i<nn; i++) {
      c.fill(...randitem(colors));
      
      //let k = randint(4,max(n/4,8)); // 8
      let k = randint(4,8);
      let x = qq(random(m,c.width-m),q);
      let y = qq(random(m,c.height-m),q);
      let s = q * randint(1,sub) * 2; // 4

      for (let j=-k/2; j<k/2; j++) {
        c.rect(x + 2*j*q, y - s/2, q, s);
      }
    }
  }
  
  if (shape_mode >= 1) {
    tri_recurse_wc(c, 0, 0, c.width, c.height, c.width/16);
  }
}

/*
function tri_recurse(c, x, y, w, h, limit) {
  if (((w < limit) || (h < limit)) || ((random() < 0.25) && (w < width/2))) {
    if (random() < 0.5) {
      fill(...randitem(colors));
      triangle(x, y, x + w, y, x, y + h);
    }
    return;
  }
  tri_recurse(c,x,y,w/2,h/2,limit);
  tri_recurse(c,x+w/2,y,w/2,h/2,limit);
  tri_recurse(c,x+w/2,y+w/2,w/2,h/2,limit);
  tri_recurse(c,x,y+w/2,w/2,h/2,limit);
}

function makeArt(c) {
  
  background(...randitem(colors));
  rotate(rot * PI);
  if (rot == 0.25) {
    scale(sqrt(2));
  }
  translate(-width/2,-height/2);
  noStroke();
  
  if (shape_mode < 2) {
    let n = level;
    let q = width / n;
    let m = 0;
    let nn = 50;
    let sub = 4;
    if (level == 64) {
      nn = 100; //500;
      sub = 16; //4 //16;
    }
    for (let i=0; i<nn; i++) {
      fill(...randitem(colors));
      
      //let k = randint(4,max(n/4,8)); // 8
      let k = randint(4,8);
      let x = qq(random(m,width-m),q);
      let y = qq(random(m,height-m),q);
      let s = q * randint(1,sub) * 2; // 4

      for (let j=-k/2; j<k/2; j++) {
        rect(x + 2*j*q, y - s/2, q, s);
      }
    }
  }
  
  if (shape_mode >= 1) {
    tri_recurse(c, 0, 0, width, height, width/16);
  }
}
*/

function draw() {

  mwh = 1024;
  randomSeed(genSeed);
  shdr = new Shader();
  c = createGraphics(mwh, mwh, WEBGL);
  makeArt_wc(c);
  shdr.draw_wc(c, scratch, push, 1., [0.,0.]);
  image(c.get(), 0, 0, c.width, c.height);

  //makeArt(null);
  //shdr.draw(scratch, push);

  /*
  if (frameCount === 1) capturer.start();
    capturer.capture(canvas.canvas);
    pickParams();
  if (frameCount === 30) {
    noLoop();
    capturer.stop();
    capturer.save();
  }
  */

  fxpreview();
  noLoop();
}

function keyPressed() {
  if (keyCode == 49) {
    oRes = 1;
    oPos = 0;
  }
  else if (keyCode == 50) {
    oRes = 2;
    oPos = 0;
  }
  else if (keyCode == 52) {
    oRes = 4;
    oPos = 0;
  }
  else if (keyCode == 56) {
    oRes = 8;
    oRes = 0;
  }
  if (keyCode == 80) {
    let rp = 1. / oRes; 
    mwh = 1024;
    randomSeed(genSeed);
    shdr = new Shader();
    c = createGraphics(mwh, mwh, WEBGL);
    makeArt_wc(c);
    shdr.draw_wc(c, scratch, push, rp, [rp*floor(oPos/oRes), rp*(oPos%oRes)]);
    save(c.get(), "export_" + oPos.toString() + ".png");
    oPos = (oPos + 1) % (oRes * oRes);
  }
}
