/*

Negative Space

In this piece, special attention is paid to negative space, which is emphasized by simple / bold color palettes.

6 different styles
- Network
- Parachutes
- Flow
- Limbs
- Arcs
- Florals

9 different color palettes
- dark
- light
- yellow
- blue
- red
- green
- blue and yellow
- red and blue
- multi

Press any key to download a hi-res png.

*/


var captureCount = 0;

var canvas;
var shdr;
var colors;
var backColor;
var strokeColor;
var shaderSeed;
var drawSeed;

var manager;
var mode;
var streamers;
var streamerFlip;
var streamerCount;
var straightStreamer;

var networkMode;
var sizeMode;

var localFrameCount;
var completed = false;

var valid_cig_all = [];
var valid_args_all = [];
var valid_colors = [];

function globalSettings() {

  randomSeed(fxrand() * 74653); // control seed
  noiseSeed(fxrand() * 34642); // control seed
  shaderSeed = random() * 567;
  drawSeed = random() * 283742;

  resetShader();
  completed = false;
  localFrameCount = 1;
  valid_cig_all = [];
  valid_args_all = [];
  valid_colors = [];

  color_options = [
    ["dark", 12],
    ["light", 12],
    ["yellow", 11],
    ["blue", 10],
    ["red", 8],
    ["green", 5],
    ["blue and yellow", 14],
    ["red and blue", 14],
    ["multi", 14]
  ];

  color_options_no_multi = [
    ["dark", 12],
    ["light", 12],
    ["yellow", 11],
    ["blue", 10],
    ["red", 8],
    ["green", 5],
    ["blue and yellow", 14],
    ["red and blue", 14],
  ];

  /*
  color_options = [
    ["dark", 1],
    ["light",1],
    ["yellow", 1],
    ["blue", 1],
    ["red", 1],
    ["green", 1],
    ["blue and yellow", 1],
    ["red and blue", 1],
    ["multi",1]
  ];
  */
  color_mode = getWeightedOption(color_options);

  mode_options = [
    ["network", 20],
    ["parachutes", 10],
    ["flow", 10],
    ["limbs", 20],
    ["arcs", 10],
    ["florals", 30]
  ];
  mode = getWeightedOption(mode_options);

  if ((color_mode == "multi") && ((mode == "network") || (mode == "arcs"))) {
    color_mode = getWeightedOption(color_options_no_multi);
  }

  if (color_mode == "dark") {
    colors = parseHexStrings("181818 222222 dddddd");
    backColor = colors[1];
    strokeColor = colors[2];
    stroke(strokeColor);
  }

  else if (color_mode == "light") {
    colors = parseHexStrings("181818 222222 f5f2e7");
    backColor = colors[2];
    strokeColor = colors[1];
    stroke(strokeColor);
  }

  else if (color_mode == "yellow") {
    colors = parseHexStrings("fcd307 181818 d5daeb");
    backColor = colors[0];
    strokeColor = colors[1];
    stroke(strokeColor);
  }

  else if (color_mode == "blue") {
    colors = parseHexStrings("2666cf 181818 d5daeb");
    backColor = colors[0];
    strokeColor = colors[1];
    stroke(strokeColor);
  }

  else if (color_mode == "red") {
    colors = parseHexStrings("ff4c48 181818 222222 eeeeee");
    backColor = colors[0];
    strokeColor = colors[1];
    stroke(strokeColor);
  }

  else if (color_mode == "green") {
    colors = parseHexStrings("439c4c 181818 222222 eeeeee");
    //colors = parseHexStrings("357C3C 181818 222222 eeeeee");
    backColor = colors[0];
    strokeColor = colors[1];
    stroke(strokeColor);
  }

  else if (color_mode == "blue and yellow") {
    colors = parseHexStrings("2c3333 2666cf f5f2e7 fcd307");
    backColor = colors[2];
    strokeColor = parseHexStrings("181818")[0];
    stroke(strokeColor);
  }

  else if (color_mode == "red and blue") {
    colors = parseHexStrings("004996 567bae ff4c48 ffbcb3 fef8e9")
    backColor = colors[2];
    strokeColor = colors[0];
    stroke(strokeColor);
  }

  else if (color_mode == "multi") {
    colors = parseHexStrings("00a19d fff8e5 e05d5d 2c2e43 595260 b2b1b9 ffd523");
    backColor = parseHexStrings("f5f2e7")[0];
    strokeColor = parseHexStrings("181818")[0]
    stroke(strokeColor);
  }
  
  streamers = random() < 0.5;
  streamerFlip = random() < 0.1; // more rare
  straightStreamer = random() < 0.35;
  streamerCount = 80;

  sizeMode = "normal";
  if ((mode == "network") || (mode == "limbs")) {
    sizeMode = getWeightedOption([["small",1],["normal",3],["large",2]]);
  }
  if (mode == "flow") {
    sizeMode = getWeightedOption([["small",1],["normal",4]]);
  }

  let streamerModes = new Set(["parachutes","flow","half flow"]);
  if (!streamerModes.has(mode)) {
    streamers = false;
    streamerFlip = false;
  }

  if (mode != "florals") {
    straightStreamer = false;
  }
  else {
    streamers = true; // always has them
  }

  let streamerString = "none";
  if (streamers) {
    streamerString = "curvy";
  }
  if (straightStreamer) {
    streamerString = "straight";
  }

  window.$fxhashFeatures = {
    "Mode" : mode,
    "Palette" : color_mode,
    "Streamers" : streamerString,
    "Size" : sizeMode
  };

  console.log(window.$fxhashFeatures);

  manager = new NoOverlapFast();
  shdr = new Shader(shaderSeed);
  
}

function setup() {
  var mwh = min(window.innerWidth, window.innerHeight);
  mwh = 2000;
  canvas = createCanvas(mwh, mwh * 1.3125, WEBGL);
  pixelDensity(1);
  
  globalSettings();
}

function complete() {
  console.log("COMPLETE");
  background(...backColor);
  manager.draw(canvas);
  shdr.draw();
  fxpreview();

  // for promo gif
  //save(captureCount.toString() + ".png");
  //captureCount += 1;

  completed = true;
  noLoop();
}

function export_image() {
  console.log("EXPORTING");
  let sc = 2;
  let ww = 2000 * sc;
  let hh = ww * 1.3125;
  let c = createGraphics(ww, hh, WEBGL);
  let s = new Shader(shaderSeed);

  c.pixelDensity(1);
  c.translate(-ww/2,-hh/2);
  c.background(...backColor);
  c.stroke(...strokeColor);
  
  // scale the polys
  manager.scale(sc);

  // adjust the border
  margin = ww / 16;
  manager.border = rect_poly(margin, margin, ww-2*margin, hh-2*margin);
  manager.width = ww;

  manager.draw(c);
  s.draw_wh(c, ww, hh);
  save(c, "export.png");
}

function keyPressed() {
  if (completed) {
    export_image();
  }
  else {
    console.log("NOT COMPLETED DRAWING YET");
  }
}

function noscale(x) {
  return x * (width / 813);
}

function arc_poly(x, y, radius, s, e) {
  let ps = [[x,y]];
  for (let i=0; i<=10; i++) {
    let angle = lerp(s,e,i/10);
    ps.push([cos(angle)*radius + x, sin(angle)*radius + y]);
  }
  return ps;
}

function rect_poly(x, y, w, h) {
  return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
}

function centered_rect(x, y, w, h) {
  return [[x-0.5*w,y-0.5*h],[x+0.5*w,y-0.5*h],[x+0.5*w,y+0.5*h],[x-0.5*w,y+0.5*h]];
}

function draw_poly_stroke(ps) {
  if (ps !== null) {
    for (let i=0; i<ps.length-1; i++) {
      line(...ps[i], ...ps[i+1]);
    }
  }
}

function draw_poly_stroke_fixed(ps,c) {
  if (ps !== null) {
    for (let i=0; i<ps.length; i++) {
      c.line(...ps[i], ...ps[(i+1)%ps.length]);
    }
  }
}

function draw_poly(ps, c) {
  if (ps !== null) {
    c.beginShape();
    for (let i=0; i<ps.length; i++) {
      c.vertex(...ps[i]);
    }
    c.endShape(CLOSE);
  }
}

function joiner(a, b) {
  let ds = [];
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      ds.push([i, j, dist(...a[i], ...b[j])]);
    }
  }
  ds = ds.sort((a,b) => a[2]-b[2]);
  
  let c = [
    [...a[ds[0][0]]],
    [...b[ds[0][1]]],
    [...b[ds[1][1]]],
    [...a[ds[1][0]]]
  ];

  return [c, ds[0][2]];
}

function robust_joiner(a, b) {
  let ds = [];
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      ds.push([i, j, dist(...a[i], ...b[j])]);
    }
  }
  ds = ds.sort((a,b) => abs(a[2]-b[2]));

  let pairs = [];
  let used = new Set();
  for (let i=0; i<ds.length; i++) {
    if ((!used.has(ds[i][0])) && (!used.has(ds[i][1]))) {
      pairs.push(ds[i]);
      used.add(ds[i][0]);
      used.add(ds[i][1]);
    }
  }
  ds = pairs;
  
  let c = [
    [...a[ds[0][0]]],
    [...b[ds[0][1]]],
    [...b[ds[1][1]]],
    [...a[ds[1][0]]]
  ];

  return [c, ds[0][2]];
}

function chain_smoker(x, y, step_x, step_y, s, ll, angle) {

  let chain = [];
  let prev = null;
  for (let i=0; i<ll; i++) {
    let f = random() * 0.5 + 0.5;
    let node = centered_rect(x, y, s*f, s*f);
    x += ((i % 2)==0) * step_x;
    y += ((i % 2)==1) * step_y;
    if (prev !== null) {
      let join = joiner(prev, node)[0];
      chain.push( join );
    }
    chain.push( node );
    prev = node;
  }

  let rots = [];
  for (let i=0; i<chain.length; i++) {
    rots.push( rotatePolygon(chain[i], angle, [x,y]) );
  }
  
  return rots;
}

function cigarette(ax, ay, bx, by, as, bs, angle) {

  //bs = max(as * (random() * 0.4 + 0.2), 10);

  let a = centered_rect(ax, ay, as, as);
  let b = centered_rect(bx, by, bs, bs);
  
  out = joiner(a, b);
  let c = out[0];
  let min_dist = out[1];

  /*
  if (min_dist < max(as,bs) * 3) {
    return [];
  }
  */

   /*
  if ((max(ay,by) > (height/3 + lerp(0,2*height/3,min(ax,bx)/width))) & (random() < 0.99)) {
    return;
  }
  */

  /*
  if ((ds[0][2] < width / 2) | (max(ay,by) > (height/3 + lerp(0,2*height/3,min(ax,bx)/width)))) {
    return;
  }
  */

  centre = polygonCentroid(c);

  centre = [ax,ay];
  
  return [rotatePolygon(a,angle,centre), rotatePolygon(b,angle,centre), rotatePolygon(c,angle,centre)];
}

function tri_cigarette(ax, ay, bx, as, bs, angle) {

  let a = centered_rect(ax, ay, as, as);
  let b = centered_rect(bx, ay+0.5*bs, as, bs);
  
  out = robust_joiner(a, b);
  c = out[0];
  //let c = [[ax+0.5*as,ay+0.5*as],[bx-0.5*as,ay+bs], [bx-0.5*as,ay], [ax+0.5*as, ay-0.5*as]];

  centre = polygonCentroid(c);
  centre = [ax,ay];
  
  return [rotatePolygon(a,angle,centre), rotatePolygon(b,angle,centre), rotatePolygon(c,angle,centre)];
}

function curly (x, y, flip=false) {
  let left = [];
  let right = [];
  let left_lowscale = [];
  let right_lowscale = [];
  let lowscale_rect = [];
  let w = noscale(random(2,6));
  let sc = 2;
  let step = noscale(10);
  let dir = randitem([-1,1]);
  let kk = randint(20,100);
  for (let j=0; j<=kk; j++) {
    let a = (noise(x/width * sc, y/height * sc) - 0.5) * 2 * PI;
    
    let para = a + 0.5 * PI;
    let perp = a;
    if (flip) {
      para = a;
      perp = a + 0.5 * PI;
    }

    left.push( [x + cos(perp) * w, y + sin(perp) * w] );
    right.push( [x - cos(perp) * w, y - sin(perp) * w] );

    if (j % 4 == 0) {
      left_lowscale.push( left[left.length - 1] );
      right_lowscale.push( right[right.length - 1] );
    }

    lowscale_rect.push([
      [x + cos(perp) * w, y + sin(perp) * w],
      [x - cos(perp) * w, y - sin(perp) * w],
      [x - cos(perp) * w + cos(para) * step * dir, y - sin(perp) * w + sin(para) * step * dir],
      [x + cos(perp) * w + cos(para) * step * dir, y + sin(perp) * w + sin(para) * step * dir]
    ]);

    let astep = step;
    //if ((ai==0)||(ai==2)||(ai==4)||(ai==6)) {
    //  astep = sqrt(step*step*2);
    //}

    x += cos(para) * astep * dir;
    y += sin(para) * astep * dir;
  }
  cig = [left.concat(right.reverse())];
  bound = [left_lowscale.concat(right_lowscale.reverse())];
  return [cig,cig];
}


class NoOverlapFast {
  constructor(progressive_draw=true) {
    this.initialize(progressive_draw);
  }

  initialize(progressive_draw) {
    this.bounds = [];
    this.polys = [];
    this.attrs = [];
    this.radii_center = [];
    this.status = false;
    let margin = width/16;
    this.width = width;
    this.border = rect_poly(margin, margin, width-2*margin, height-2*margin);
    this.progressive_draw = progressive_draw;

    this.segments = [];
  }

  scale(amount) {
    for (let i=0; i<this.polys.length; i++) {
      for (let j=0; j<this.polys[i].length; j++) {
        this.polys[i][j][0] *= amount;
        this.polys[i][j][1] *= amount;
      }
    }
  }
  
  does_not_overlap(p) {

    let radii_center = [];
    for (let i=0; i<p.length; i++) {
      radii_center.push( this.get_radius_and_center(p[i]) );
    }

    for (let j=0; j<this.bounds.length; j++) {

      let possible = false;
      for (let i=0; i<radii_center.length; i++) {
        if (dist(...radii_center[i][1],...this.radii_center[j][1]) < (radii_center[i][0] + this.radii_center[j][0])) {
          possible = true;
          break;
        }
      }

      if (possible) {        
        let inter = intersect(p, [this.bounds[j]]);
        if (inter.length > 0) {
          return false;
        }
        
      }
    }
    return true;
  }
  is_within_border(p) {
    let diff = difference(p, [this.border]);
    if (diff.length > 0) {
      return false;
    }
    return true;
  }
  get_radius_and_center(p) {
    let centre = polygonCentroid(p);
    let radius = 0;
    for (let j=0; j<p.length; j++) {
      let d = dist(...centre,...p[j]);
      if (d > radius) {
        radius = d;
      }
    }
    return [radius, centre];
  }
  add(bound, poly, attr) {
    if (this.does_not_overlap([bound])) {
      this.bounds.push( bound );
      this.polys.push( poly );
      this.attrs.push( attr );
    }
  }
  add_set(bounds, polys, attrs, force=false, index=true) {
    if (force || ((this.does_not_overlap(bounds)))) { //& (this.is_within_border(polys)))) {
      for (let i=0; i<polys.length; i++) {
        this.polys.push( polys[i] );
        this.attrs.push( attrs[i % attrs.length] );
        if (this.progressive_draw) {
          this.draw_poly( this.polys.length - 1 );
        }
      }
      if (index) {
        for (let i=0; i<bounds.length; i++) {
          this.bounds.push( bounds[i] );
          this.radii_center.push( this.get_radius_and_center(bounds[i]) );
          // add line segments
          //for (let j=0; j<bounds[i].length; j++) {
          //  this.segments.push([bounds[i][j], bounds[i][(j+1)%bounds[i].length]]);
          //}
        }
      }
    }
  }
  draw_poly(index,canv=null) {
    let poly = intersect([this.polys[index]], [this.border]);
    if (canv == null) {
      canv = canvas;
    }
    if (poly.length > 0) {
      poly = poly[0];
      //strokeWeight((random(0.5,1)/831)*width);
      canv.strokeWeight((random(1,2)/831)*this.width);
      if (this.attrs[index].color !== null) {
        canv.fill(...this.attrs[index].color);
        draw_poly(poly,canv);
      }
      else {
        draw_poly_stroke_fixed(poly,canv);
      }
    }
  }
  draw(canv=null) {
    randomSeed(drawSeed);
    for (let i=0; i<this.polys.length; i++) {
      this.draw_poly(i,canv);
    }
  }
  draw_bounds() {
    stroke(255,0,0);
    for (let i=0; i<this.bounds.length; i++) {
      draw_poly_stroke_fixed(this.bounds[i]);
    }
  }
}

function draw() {

  if (completed) {
    globalSettings(); // make a new one
  }

  if (localFrameCount <= 1) {
    background(...backColor);
  }
  
  translate(-width/2,-height/2);

  let space = 10;
  let mq = 4;
  let q = width / 128;

  if (mode == "limbs") {
    
    let minSize = 10;
    let maxSize = 200;
    if (sizeMode == "small") {
      minSize = 5;
      maxSize = 100;
    }
    else if (sizeMode == "large") {
      minSize = 25;
      maxSize = 400;
    }

    if (localFrameCount < 400) {
      for (let i=0; i<50; i++) {
        x = random() * width;
        y = random() * height;
        dir = randitem([-1,1]);
        x2 = x + noscale(random(minSize,maxSize));
        w = noscale(lerp(minSize/2.5,maxSize/2,random()**4));
        a = randitem([0,0.5*PI,PI,1.5*PI]) + 0.25*PI; //noise((x/width)*sc,(y/width)*sc) * PI * 2;
        cig = tri_cigarette(x, y, x2, w, dir*noscale(lerp(minSize,maxSize,random()**2)),a);
        c = randitem(colors);
        manager.add_set(cig, cig, [{color:c},{color:c},{color:null}]);
      }
    }
    else {
      complete();
    }
  }

  

  // parachutes
  if (mode == "parachutes") {
    let sc = 0.001;
    space = 4;
    if (localFrameCount < 400) {

      if ((localFrameCount == 1) && (streamers)) {
        for (let i=0; i<streamerCount; i++) {
          c = randitem(colors);
          x = random() * width;
          y = random() * height;
          manager.add_set(...curly(x,y,streamerFlip), [{color:null},{color:null},{color:null}],false);
        }
      }

      for (let k=0; k<50; k++) {

        x = random() * width;
        y = random() * height;
        angle = noise(x*sc,y*sc) * PI * 2;
        
        w = lerp(width/128, width/32, 1 - (y/height));
        //w = lerp(width/256, width/64, 1 - (y/height));
        if (random() < 0.5) {
          w = random(width/128, width/32);
        }

        step = random(w*4, width/8);

        let c = randitem(colors);
        let ws = max(w * (random() * 0.4 + 0.2), 10)
        let extra = random(1,4);
        let chain = cigarette(x, y, x, y + step, ws, w*extra, angle);
        let bound = cigarette(x, y, x, y + step, ws + space, w*extra*0.5 + space, angle);
        manager.add_set(chain, chain, [{color:c},{color:c},{color:null}], false);

      }
    }
    else {
      complete();
    }
  }

  // network
  if (mode == "network") {
    let num = 400;
    let maxSize = 4;
    if (sizeMode == "normal") {
      num = 200;
      maxSize = 8;
    }
    if (sizeMode == "large") {
      num = 100;
      maxSize = 16;
    }
    space = (4/831) * width;
    if (localFrameCount < num) {

      x = random() * width;
      y = random() * height;
      w = random(width/128, width/32);
      step = random(w*4, width/8); // /4

      let c = randitem(colors);
      let ws = max(w * (random() * 0.4 + 0.2), (width/81))
      let extra = random(1,maxSize); //1;

      let ll = randint(1,4); //randint(1,32);
      let base_angle = random() * 2 * PI;
      let chain = [];
      let bound = [];

      for (let i=0; i<ll; i++) {
        angle = base_angle + i*PI*0.2;
        //angle = base_angle + i*PI*0.05;
        chain = chain.concat(cigarette(x, y, x, y + step, ws, w*extra, angle));
        bound = bound.concat(cigarette(x, y, x, y + step, ws + space, w*extra + space, angle));
      }
      //bound = [centered_rect(x,y,(step + w*extra), (step + w*extra))];
      //bound = [centered_rect(x,y,(step * 0.5), (step * 0.5))];
      bound = [arc_poly(x, y, step + w + space, base_angle + 0.5*PI - 0.2, base_angle + 0.05*PI*(ll-1) + 0.5*PI + 0.2)];
      manager.add_set(bound, chain, [{color:c},{color:c},{color:null}], true);
    }
    else {
      complete();
    }
  }

  // arcs
  if (mode == "arcs") {
    space = (4/831) * width;
    if (localFrameCount < 80) {

      x = random() * width;
      y = random() * height;
      w = random(width/128, width/32);
      step = random(w*4, width/4); // /4

      let c = randitem(colors);
      let ws = max(w * (random() * 0.4 + 0.2), (width/81))
      let extra = 1; //random(1,8); //1;

      let ll = randint(1,32);
      let base_angle = random() * 2 * PI;
      let chain = [];
      let bound = [];

      for (let i=0; i<ll; i++) {
        angle = base_angle + i*PI*0.05;
        chain = chain.concat(cigarette(x, y, x, y + step, ws, w*extra, angle));
        bound = bound.concat(cigarette(x, y, x, y + step, ws + space, w*extra + space, angle));
      }
      //bound = [centered_rect(x,y,(step + w*extra), (step + w*extra))];
      //bound = [centered_rect(x,y,(step * 0.5), (step * 0.5))];
      bound = [arc_poly(x, y, step + w + space, base_angle + 0.5*PI - 0.2, base_angle + 0.05*PI*(ll-1) + 0.5*PI + 0.2)];
      manager.add_set(bound, chain, [{color:c},{color:c},{color:null}], true);
    }
    else {
      complete();
    }
  }
  

  // classic flow field
  if (mode == "flow") {

    let hmin = 24;
    let hmax = 2000;
    let wmin = noscale(10);
    if (sizeMode == "small") {
      hmin = 12;
      hmax = 500;
      wmin = noscale(5);
    }

    let sc = 813 * 0.001; //0.001
    let mm = noscale(3);
    //let margin = width/16;
    //border = rect_poly(margin, margin, width-2*margin, height-2*margin);
    strokeWeight(noscale(1));

    if ((localFrameCount == 1) && (streamers)) {
      for (let i=0; i<streamerCount; i++) {
        c = randitem(colors);
        x = random() * width;
        y = random() * height;
        manager.add_set(...curly(x,y,streamerFlip), [{color:null},{color:null},{color:null}],false);
      }
    }

    if (localFrameCount < 500) {
      for (let i=0; i<50; i++) {
        let dofill = random() < 0.2;
        x = random() * width;
        y = random() * height;
        //a = floor(noise(x*sc,y*sc)*8)/8 * PI * 2;
        a = noise((x/width)*sc,(y/width)*sc) * PI * 2;
        //wmin = noscale(5);
        //w = random(wmin,noscale(20)); // 20
        h = noscale(lerp(hmin,hmax,random()**2)); // 2000
        w = max(h * 0.05, wmin);
        kk = 1; //randint(1,2);
        wf = max(w * (random() * 0.2 + 0.4), wmin);

        let c = randitem(colors);
        for (let k=0; k<kk; k++) {
          let bound = cigarette(x, y, x, y+h-wf, w+mm*2, wf+mm*2, a);
          let cig = cigarette(x, y, x, y+h-wf, w, wf, a);

          x += cos(a) * w * 1.2;
          y += sin(a) * w * 1.2;

          if (dofill) {
            manager.add_set(bound, cig, [{color:c},{color:c},{color:c}], false);
          }
          else {
            manager.add_set(bound, cig, [{color:c},{color:c},{color:null}], false);
          }
          
        }
      }
    }
    else {
      complete();
    }
  }

  // half flow
  if (mode == "half flow") {
    let sc = 813 * 0.001; //0.001
    let mm = noscale(3);
    let margin = width/16;
    border = rect_poly(margin, margin, width-2*margin, height-2*margin);
    strokeWeight(noscale(1));

    if ((localFrameCount == 1) && (streamers)) {
      for (let i=0; i<streamerCount; i++) {
        c = randitem(colors);
        x = random() * width;
        y = random() * height;
        manager.add_set(...curly(x,y,streamerFlip), [{color:null},{color:null},{color:null}],false);
      }
    }

    if (localFrameCount < 50) {
      for (let i=0; i<10; i++) {
        let dofill = random() < 0.2;
        x = random() * width;
        y = random() * height;
        //a = floor(noise(x*sc,y*sc)*8)/8 * PI * 2;
        a = (noise((x/width)*sc,(y/width)*sc)-0.5) * PI * 0.5;
        wmin = noscale(10);
        w = random(wmin,noscale(20)); // 20
        h = noscale(lerp(20,500,random()**2)); // 2000
        w = max(h * 0.05, wmin);
        kk = 1; //randint(1,2);
        wf = max(w * (random() * 0.2 + 0.4), wmin);
        dir = randitem([-1,1]);

        let c = randitem(colors);
        kk = randint(4,16);
        for (let k=0; k<kk; k++) {
          let bound = cigarette(x, y, x, y+h-wf, w+mm*2, wf+mm*2, a);
          let cig = cigarette(x, y, x, y+h-wf, w, wf, a);

          x += cos(a) * w * 1.2 * dir;
          y += sin(a) * w * 1.2 * dir;

          if (dofill) {
            manager.add_set(bound, cig, [{color:c},{color:c},{color:c}], false);
          }
          else {
            manager.add_set(bound, cig, [{color:c},{color:c},{color:null}], false);
          }
          
        }
      }
    }
    else {
      complete();
    }
  }

  
  // vert horizontal
  // or curves
  if (mode == "florals") {
    if (localFrameCount == 1) {
      circle(width/2 - noscale(20),height/2,noscale(10));
      circle(width/2,height/2,noscale(10));
      circle(width/2 + noscale(20),height/2,noscale(10));
    }
    else if (localFrameCount == 2) {
      background(...backColor); // hide dots
      let workmanager = new NoOverlapFast(progressive_draw=false);
      for (let k=0; k<1000; k++) {
        let sc = 2;
        let x = random() * width;
        let y = random() * height;
        let w = noscale(random(5,10));
        let m = noscale(random(5,50)); // 5,50
        let c = randitem(colors);
        let dir = randitem([-1,1]);
        let nseed = random() * 81238;
        let valid_cig = [];
        let valid_args = [];

        let slug_left = [];
        let slug_right = [];
        let valid_slug = [];
        
        for (let i=0; i<100; i++) {
          //let m = noscale(lerp(10,200,noise(x/width * sc + nseed, y/height * sc + nseed)));
          let a = (noise(x/width * sc, y/height * sc)-0.5) * 2 * PI;
          //let a = floor((noise(x/width * sc, y/height * sc)-0.5)*8)/8 * 2 * PI;
          cig = cigarette(x, y, x + m, y, w, w, a + 0.5*PI);

          
          if (workmanager.does_not_overlap(cig)) {
          //if (true) {
            let fracture = random() < 0.05; // 0.05
            if (fracture) {
              valid_args.push([x, y, x + m, y, w, w, a + 0.5*PI]);
            }
            else {
              valid_cig.push( cig );
              valid_slug.concat( cig );
            }

            slug_left.push(cig[0][0]);
            slug_right.push(cig[1][3]);
          }
          else {
            break;
          }

          x += cos(a) * w * 2 * dir;
          y += sin(a) * w * 2 * dir;
        }

        if (valid_cig.length > 5) {

          //let slug = slug_left.concat(slug_right.reverse());
          //workmanager.add_set([slug],valid_slug, [{color:c},{color:c},{color:null}], true);

          
          for (let i=0; i<valid_cig.length; i++) {
            let cig = valid_cig[i];
            workmanager.add_set(cig, cig, [{color:c},{color:c},{color:null}], true);
          }
          
        }

        valid_args_all.push( valid_args );
        valid_cig_all.push( valid_cig );
        valid_colors.push( c );
      }

      if (true) {
      
        for (let k=0; k<valid_cig_all.length; k++) {
          if (valid_cig_all[k].length > 5) {
            for (let i=0; i<valid_args_all[k].length; i++) {

              let c = valid_colors[k];
              let x = valid_args_all[k][i][0];
              let y = valid_args_all[k][i][1];
              let left = [];
              let right = [];
              let left_lowscale = [];
              let right_lowscale = [];
              let lowscale_rect = [];
              let w = noscale(5);
              let sc = 2;
              let step = noscale(10);
              let dir = randitem([-1,1]);

              if (!straightStreamer) {

                for (let j=0; j<=100; j++) {
                  let a = (noise(x/width * sc, y/height * sc)-0.5) * 2 * PI;
                  
                  //let para = a + 0.5 * PI;
                  //let perp = a;

                  let para = a;
                  let perp = a + 0.5 * PI;

                  left.push( [x + cos(perp) * w, y + sin(perp) * w] );
                  right.push( [x - cos(perp) * w, y - sin(perp) * w] );

                  if (j % 4 == 0) {
                    left_lowscale.push( left[left.length - 1] );
                    right_lowscale.push( right[right.length - 1] );
                  }

                  lowscale_rect.push([
                    [x + cos(perp) * w, y + sin(perp) * w],
                    [x - cos(perp) * w, y - sin(perp) * w],
                    [x - cos(perp) * w + cos(para) * step * dir, y - sin(perp) * w + sin(para) * step * dir],
                    [x + cos(perp) * w + cos(para) * step * dir, y + sin(perp) * w + sin(para) * step * dir]
                  ]);

                  x += cos(para) * step * dir;
                  y += sin(para) * step * dir;
                }
                cig = [left.concat(right.reverse())];
                bound = [left_lowscale.concat(right_lowscale.reverse())];
              }
              else {
                valid_args_all[k][i][2] += height; //noscale(random(100,500));
                cig = cigarette(...valid_args_all[k][i]); 
                lowscale_rect = cig;
              }

              if (random() < 0.1) {
                manager.add_set(lowscale_rect, cig, [{color:c},{color:c},{color:c}], true);
              }
              else {
                manager.add_set(lowscale_rect, cig, [{color:c},{color:c},{color:null}], true);
              }
            }
          }
        }
      }
    }
    
    else if (localFrameCount <= valid_cig_all.length) { /// 5) {
      let k = localFrameCount - 1;
      //for (let k=ll*5; k<min((ll+1)*5,valid_cig_all.length); k++) {
        if (valid_cig_all[k].length > 5) {
          for (let i=0; i<valid_cig_all[k].length; i++) {
            let c = valid_colors[k];
            cig = valid_cig_all[k][i];
            manager.add_set(cig, cig, [{color:c},{color:c},{color:null}], !straightStreamer, false);
          }
        }
      //}
    }
    else {
      complete();
    }
  }

  localFrameCount += 1;
}

