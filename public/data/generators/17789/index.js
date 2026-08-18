let gridTopX;
let gridTopY;
let NU;
let picker;
let cube_drawer;

var doFade, structure, doThin, chunkProb, doChunkOffset, stretch, extraMode, blockSize, doWarp, reduceX, doBlockedColor, subdivisionStrategy;

var all_index, palette, background_color, stroke_color, scheme;

var canvas;

/*
const capturer = new CCapture({
  framerate: 5,
  format: "png",
  name: "promo",
  quality: 100,
  verbose: true,
});
*/

palette = "f05e3b";
background_color = "f05e3b";
stroke_color = "eeeeee";

all_scheme = [
  {
    palette : "f6bc12 0075ca 395e54 41bb9b 41bb9b 41bb9b 41bb9b 41bb9b 41bb9b FAF3E3 eeeeee",
    background_color : "41bb9b",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "ffc000 dad6cd 228345 2969de faf3e3 3ea8f5 3ea8f5 3ea8f5 3ea8f5 3ea8f5 765aa6",
    background_color : "faf3e3",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "ff9f29 ff5500 228345 2969de 9BD7CB faf3e3 ff5500 ff5500 ff5500 ff5500 ff5500 ff5500",
    background_color : "faf3e3",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "131313",
    background_color : "131313",
    stroke_color : "eeeeee",
    prob : 2
  },
  {
    palette : "ec5526 f4ac12 9ebbc1 f7f4e2 e4e4ce e4e4ce e4e4ce e4e4ce",
    //palette : "ec5526 f4ac12 9ebbc1 f7f4e2 f05e3b f05e3b f05e3b f05e3b",
    background_color : "e4e4ce",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "ec2f28 f8cd28 1e95bb fbaab3 fcefdf f05e3b f05e3b f05e3b f05e3b",
    background_color : "fcecda",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "567bae ff4c48 ffbcb3 fff7e4 fff7e4 fff7e4 fff7e4",
    background_color : "fff7e4",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "00a19d fff8e5 e05d5d 2c2e43 595260 b2b1b9 ffd523 fff8e5 fff8e5 fff8e5 fff8e5 fff8e5 fff8e5 fff8e5 fff8e5",
    background_color : "fff8e5",
    stroke_color : "131313",
    prob : 10
  },
  {
    palette : "ec5526 f4ac12 9ebbc1 387fc2 387fc2 387fc2 387fc2",
    background_color : "387fc2",
    stroke_color : "eeeeee",
    prob : 2
  }
];

class ColorPicker {
  constructor(main, accent, switchProb) {
    this.main = parseHexStrings(main);
    this.accent = parseHexStrings(main);
    this.current = fxranditem(this.main);
    this.switchProb = switchProb; // 0.1
    this.accentProb = 0.2;
  }
  pick() {
    /*
    if (random() < this.accentProb) {
      return randitem(this.accent);
    }
    */
    if (fxrand() < this.accentProb) {
      return fxranditem(this.accent);
    }
    if (fxrand() < this.switchProb) {
      this.switch_independant();
    }
    return this.current;
  }
  switch_independant() {
    this.current = fxranditem(this.main);
  }
  switch_dependant() {
    this.current = randitem(this.main);
  }
}

class NoiseUnit {
  constructor(n,sc) {
    this.n = n;
    // initialize mat
    let mat = [];
    let maxVal = null;
    let minVal = null;
    for (let i=0; i<=n; i++) {
      let row = [];
      for (let j=0; j<=n; j++) {
        let v = noise(i/n*sc, j/n*sc); // can *10 for y to get style
        if ((maxVal === null) || (v > maxVal)) {
          maxVal = v;
        }
        if ((minVal === null) || (v < minVal)) {
          minVal = v;
        }
        row.push(v);
      }
      mat.push(row);
    }
    // normalize mat
    for (let i=0; i<=n; i++) {
      for (let j=0; j<=n; j++) {
        mat[i][j] = map(mat[i][j], minVal, maxVal, 0, 0.75);
      }
    }
    this.mat = mat;
  }
  get_value(x, y) {
    let xi = round(map(x, 0, 1, 0, this.n));
    let yi = round(map(y, 0, 1, 0, this.n));
    return this.mat[xi][yi];
  }
}

function min_value(xs) {
  let v = null;
  for (const x of xs) {
    if ((v === null) || (x < v)) {
      v = x;
    }
  }
  return v;
}

function max_value(xs) {
  let v = null;
  for (const x of xs) {
    if ((v === null) || (x > v)) {
      v = x;
    }
  }
  return v;
}

class CubeDrawer {
  constructor() {
    this.cubes = [];
    this.colors = [];
  }
  add(x, y, z, xs, ys, zs, color) {
    this.cubes.push([x, y, z, xs, ys, zs]);
    this.colors.push(color);
  }

  to_cube_iso(x, y, z, xs, ys, zs) {
    let top = [[x,y,z+zs],[x+xs,y,z+zs],[x+xs,y+ys,z+zs],[x,y+ys,z+zs]];
    let right = [[x+xs,y,z],[x+xs,y,z+zs],[x+xs,y+ys,z+zs],[x+xs,y+ys,z]];
    let left = [[x,y+ys,z],[x+xs,y+ys,z],[x+xs,y+ys,z+zs],[x,y+ys,z+zs]];
    top = top.map(v => orth(...v));
    right = right.map(v => orth(...v));
    left = left.map(v => orth(...v));
    return [top, right, left];
  }

  iso_cube_shading(x, y, z, xs, ys, zs) {
    let n = 0;
    // hatch the left
    n = xs / noscale(4);
    for (let i=1; i<n; i++) {
      let xp = lerp(x, x+xs, float(i)/n);
      this.draw_line([xp,y+ys,z],[xp,y+ys,z+zs]); 
    }

    // hatch the right
    n = ys / noscale(8);
    for (let i=1; i<n; i++) {
      let yp = lerp(y, y+ys, float(i)/n);
      this.draw_line([x+xs,yp,z],[x+xs,yp,z+zs]); 
    }
  }

  draw_line(a, b) {
    line(...orth(...a), ...orth(...b));
  }

  draw_poly(ps) {
    push();
    noStroke();
    beginShape();
    for (let i=0; i<=ps.length; i++) {
      vertex(...ps[i % ps.length]);
    }
    endShape();
    pop();
    for (let i=0; i<ps.length; i++) {
      line(...ps[i], ...ps[(i+1) % ps.length]);
    }
  }

  get_range(cubes) {
    let minD = {x:null, y:null, z:null};
    let maxD = {x:null, y:null, z:null};
    for (const [x,y,z,xs,ys,zs] of cubes) {
      minD.x = minD.x === null ? x : min(minD.x,x);
      minD.y = minD.y === null ? y : min(minD.y,y);
      minD.z = minD.z === null ? z : min(minD.z,z);
      maxD.x = maxD.x === null ? x : max(maxD.x,x);
      maxD.y = maxD.y === null ? y : max(maxD.y,y);
      maxD.z = maxD.z === null ? z : max(maxD.z,z);
    }
    return [minD, maxD];
  }

  get_iso_range(cubes) {
    let xs = [];
    let ys = [];
    for (const cube of cubes) {
      let points = this.to_cube_iso(...cube).flat();
      xs.push( points.map(v => v[0]) );
      ys.push( points.map(v => v[1]) );
    }
    xs = xs.flat();
    ys = ys.flat();
    let isr = {
      minX : min_value(xs),
      maxX : max_value(xs),
      minY : min_value(ys),
      maxY : max_value(ys),
    }
    //console.log("CHECK", isr.minY, height - isr.maxY, isr.minX, width - isr.maxX);
    return isr;
  }

  adjust_cubes(func) {
    let adjusted = [];
    for (const cube of this.cubes) {
      adjusted.push(func(...cube));
    }
    this.cubes = adjusted;
  }

  draw_cubes() {

    // determine range of cubes
    let [minD, maxD] = this.get_range(this.cubes);

    // warping
    if (doWarp.value) {
      this.adjust_cubes((x,y,z,xs,ys,zs) => [
        x,
        y,
        z + (NU.get_value(
          map(x, minD.x, maxD.x, 0, 1), 
          map(y, minD.y, maxD.y, 0, 1)) - 0.5) * noscale(400),
        xs,
        ys,
        zs
      ]);
    }
    
    // explode
    if (extraMode.value === "explode") {
      this.adjust_cubes((x,y,z,xs,ys,zs) => {
        let shrinkage = map(x, minD.x, maxD.x, 0.25, 1);
        //let shrinkage = map(z, minD.z, maxD.z, 1, 0.25);
        // random offset 
        let amount = map(x, minD.x, maxD.x, 1, 0);
        x += (random()-0.5) * amount * noscale(100);
        y += (random()-0.5) * amount * noscale(100);
        z += (random()-0.5) * amount * noscale(100);
        return [x, y, z, xs * shrinkage, ys * shrinkage, zs * shrinkage];
      });
    }

    // partial flatten
    if (extraMode.value === "partial_flatten") {
      this.adjust_cubes((x,y,z,xs,ys,zs) => {
        let amount = map(z, minD.z, maxD.z, 0, 1) ** 2;
        let shrink = map(amount, 0, 1, 1, 0.25);
        let expand = map(amount, 0, 1, 1, 1.1);
        let push = map(amount, 0, 1, 1, 4);
        return [x, y, z * push, xs * expand, ys * expand, zs * shrink];
      });
    }

    // complete flatten
    if (extraMode.value === "flatten") {
      this.adjust_cubes((x,y,z,xs,ys,zs) => {
        return [x, y, z, xs, ys, zs * 0.025];
      });
    }

    // apply sine offset
    if (extraMode.value == "sine") {
      let soff = fxrand() * 2 * PI;
      let amount = lerp(0.25, 0.5, fxrand());
      this.adjust_cubes((x,y,z,xs,ys,zs) => {
        let ny = y + sin(map(z, minD.z, maxD.z, soff, soff + amount*PI)) * noscale(200);
        return [x, ny, z, xs, ys, zs];
      });
    }

    // stretch along y axis
    // this does not work with thinning on y axis
    /*
    if (true) {
      this.adjust_cubes((x,y,z,xs,ys,zs) => {
        let pow = 8;
        let sc = 1;
        let ny = map(
          map(y, minD.y, maxD.y, 0, 1)**pow, 0, 1, minD.y*sc, maxD.y*sc);
        let e = map(
          map(y+ys, minD.y, maxD.y, 0, 1)**pow, 0, 1, minD.y*sc, maxD.y*sc);
        let nys = e - ny;
        return [x, ny, z, xs, nys, zs];
      });
    }
    */
    
    // change cube param
    /*
    for (let i=0; i<this.cubes.length; i++) {
      let [x,y,z,xs,ys,zs] = this.cubes[i];
      zs *= map(z,minD.z,maxD.z,1,0.1);
      ys *= map(z,minD.z,maxD.z,1,0.5);
      z += map(map(z,minD.z,maxD.z,0,1) ** 2, 0, 1, 0, noscale(500));
      //x += map(map(z,minD.z,maxD.z,0,1) ** 2, 0, 1, 0, noscale(50));
      this.cubes[i] = [x,y,z,xs,ys,zs];
    }
    */
    
    let minMargin = noscale(100);
    let isr = null;
    let vmargin = null;
    let vsc = null;
    let hmargin = null;
    let hsc = null;
    let max_iter_count = 10;
    let iter_count = null;

    // center and scale vertically and horizontally
    // has to be done iteratively i think ...

    // vertical scale
    iter_count = 0;
    isr = this.get_iso_range(this.cubes);
    vsc = min(1, (height-(minMargin*2)) / abs(isr.maxY - isr.minY));
    while ((vsc < 0.999) && (iter_count < max_iter_count)) {
      //console.log("VERTICAL SCALE : ", vsc);
      this.adjust_cubes((x,y,z,xs,ys,zs) => [
        x,
        y,
        z*vsc,
        xs,
        ys,
        zs*vsc
      ]);
      isr = this.get_iso_range(this.cubes);
      vsc = min(1, (height-(minMargin*2)) / abs(isr.maxY - isr.minY));
      iter_count++;
    }

    // horizontal scale
    iter_count = 0;
    isr = this.get_iso_range(this.cubes);
    hsc = min(1, (width-(minMargin*2)) / abs(isr.maxX - isr.minX));
    while ((hsc < 0.999) && (iter_count < max_iter_count)) {
      //console.log("HORIZONTAL SCALE : ", hsc);
      this.adjust_cubes((x,y,z,xs,ys,zs) => [
        x*hsc,
        y*hsc,
        z,
        xs*hsc,
        ys*hsc,
        zs
      ]);
      isr = this.get_iso_range(this.cubes);
      hsc = min(1, (width-(minMargin*2)) / abs(isr.maxX - isr.minX));
      iter_count++;
    }

    // horizontal center
    isr = this.get_iso_range(this.cubes);
    hmargin = (isr.minX + (width-isr.maxX)) / 2;
    this.adjust_cubes((x,y,z,xs,ys,zs) => [
      x - (isr.minX - hmargin)*(1/sqrt(3)),
      y + (isr.minX - hmargin)*(1/sqrt(3)),
      z,
      xs,
      ys,
      zs
    ]);

    // vertical center
    isr = this.get_iso_range(this.cubes);
    vmargin = (isr.minY + (height-isr.maxY)) / 2;
    this.adjust_cubes((x,y,z,xs,ys,zs) => [
      x,
      y,
      (z + isr.minY - vmargin),
      xs,
      ys,
      zs
    ]);

    isr = this.get_iso_range(this.cubes);

    // sort along y first then x then z
    /*
    this.cubes = this.cubes.sort((a,b) => {
      return a[0] < b[0];
      if (a[1] === b[1]) {
        if (a[0] === b[0]) {
          return a[2] < b[2];
        }
        return a[0] < b[0];
      }
      return a[1] < b[1];
    });
    */


    // determine color map if there is emphasis color
    /*
    let counts = {};
    for (let i=0; i<this.colors.length; i++) {
      if (this.colors[i] in counts) {
        counts[this.colors[i]] = counts[this.colors[i]] + 1;
      }
      else {
        counts[this.colors[i]] = 1;
      }
    }
    counts = Object.entries(counts).sort((a,b) => a[1]-b[1]).reverse();
    let emphasis = background_color;
    let other = parseHex(palette).filter(x => x !== emphasis);
    let colors = parseHexStrings(emphasis + other.join(''));
    let cmap = {};
    let index = 0;
    for (const [k,v] of counts) {
      cmap[k] = colors[index];
      index++;
    }
    */


    // draw the cubes
    fill(245);
    for (let i=0; i<this.cubes.length; i++) {
      let cube = this.cubes[i];
      let alpha = 255;

      if (doFade.value) {
        alpha = constrain(
          map(orth(...cube.slice(0,3))[1],0,height*0.75,0,255),0,255);
      }
      
      // alpha as a map of noise
      //alpha = noise(...cube.slice(0,3).map(x => x/width*4)) * 255;
      fill(...this.colors[i], alpha);
      //fill(...palette_RGB[this.colors[i]], alpha);
      //fill(...cmap[this.colors[i]], alpha);
      stroke(...parseHexStrings(stroke_color)[0], alpha);
      
      let [top, right, left] = this.to_cube_iso(...cube);
      this.draw_poly(top);
      this.draw_poly(right);
      this.draw_poly(left);
      this.iso_cube_shading(...cube);
    }
  }
}


function hexToRgb(hex) {
  var x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(x[1],16),parseInt(x[2],16), parseInt(x[3],16)];
}

function rgbToHsv(r, g, b) {
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if(max == min) {
      h = 0; // achromatic
  }
  else {
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return [h*360, s*100, v/255 * 100];
}

function parseHex(hs) {
  let hexs = []
  hs = hs.replace(/\s/g, '');
  for (let i=0; i<hs.length/6; i++) {
    hexs.push( hs.substring(i*6,(i+1)*6) );
  }
  return hexs;
}

function parseHexStrings(hs) {
  let hexs = []
  hs = hs.replace(/\s/g, '');
  for (let i=0; i<hs.length/6; i++) {
    hexs.push( hexToRgb(hs.substring(i*6,(i+1)*6)) );
  }
  return hexs;
}

function fxranditem(lst) {
  return lst[Math.floor((lst.length-0.00001) * fxrand())];
}

function fxrandint(min,max) {
  return Math.floor(min + ((max-0.00001) - min) * fxrand());
}

function randitem(lst) {
  return lst[randint(0,lst.length)];
}

function randfloat(min,max) {
  return random() * (max - min) + min;
}

function randint(min,max) {
  return Math.floor(min + ((max-0.00001) - min) * random());
}

function orth(x, y, z) {
  return [gridTopX + (x - y) * sqrt(3) / 2, gridTopY + (x + y) / 2 - z];
}

function draw_poly(ps) {
  beginShape();
  for (let i=0; i<=ps.length; i++) {
    vertex(...orth(...ps[i % ps.length]));
  }
  endShape();
}

function draw_line(a, b) {
  line(...orth(...a), ...orth(...b));
}

function cube(x, y, z, xs, ys, zs) {

  if (min(xs, ys, zs) < 0) {
    //console.log("NEGATIVE SIZE OF CUBE!!");
    return;
  }

  useColor = picker.pick();
  cube_drawer.add(x, y, z, xs, ys, zs, useColor);
  return;
  
}

function ape(x, y, z, w, h, d, thresh, depth) {
  if (min(w, h, d) <= 0) {
    return;
  }
  // changing depth > 0 or depth > 1 gives very different results
  // sometimes random() < 0.5 is used instead
  if ((min(w,h,d) < thresh) | ((depth >= blockSize.value) && (fxrand() < 0.5))) {
    if (random() < 0.99) { // 0.99
      pad = noscale(5);
      cube(x+pad, y+pad, z+pad, w-2*pad, h-2*pad, d-2*pad);
    }
    return;
  }
  let sx,sy,sz;
  if (subdivisionStrategy.value === "even") {
    [sx,sy,sz] = [...Array(3)].map(x => 0.5);
  }
  else if (subdivisionStrategy.value === "varied") {
    [sx,sy,sz] = [...Array(3)].map(x => 0.25 + random()*0.5);
  }
  else if (subdivisionStrategy.value === "skewed") {
    [sx,sy,sz] = [...Array(3)].map(x => 0.1 + random()*0.8);
  }
  else {
    alert("FEATURE SELECTION FAILURE");
  }
  
  //let [sx,sy,sz] = [...Array(3)].map(x => 0.4 + random()*0.2);
  if (doThin.value) {
    sy = 1;
  }

  // subdivide
  ape(x,      y,      z,      sx*w,       sy*h,       sz*d,       thresh, depth+1);
  ape(x+sx*w, y,      z,      (1.-sx)*w,  sy*h,       sz*d,       thresh, depth+1);
  ape(x,      y+sy*h, z,      sx*w,       (1.-sy)*h,  sz*d,       thresh, depth+1);
  ape(x+sx*w, y+sy*h, z,      (1.-sx)*w,  (1.-sy)*h,  sz*d,       thresh, depth+1);
  ape(x,      y,      z+sz*d, sx*w,       sy*h,       (1.-sz)*d,  thresh, depth+1);
  ape(x+sx*w, y,      z+sz*d, (1.-sx)*w,  sy*h,       (1.-sz)*d,  thresh, depth+1);
  ape(x,      y+sy*h, z+sz*d, sx*w,       (1.-sy)*h,  (1.-sz)*d,  thresh, depth+1);
  ape(x+sx*w, y+sy*h, z+sz*d, (1.-sx)*w,  (1.-sy)*h,  (1.-sz)*d,  thresh, depth+1);

}

// split and seed
// get point along interval
function gripe(s, e, k, n) {
  let vals = [...Array(n-1)].map((x,i) => lerp(s,e,(i+1)/n));
  vals = shuffle(vals);
  vals = vals.slice(0,k).sort((a,b) => a-b);
  return [s].concat( vals ).concat([e]);
}

function tripe(x, y, z, w, h, d) {

  let div, sec, xs, ys, zs;

  if (structure.value == "default") {
    div = 4;
    sec = 2;
    xs = gripe(x, x+w, sec, div);
    ys = gripe(y, y+h, sec, div);
    zs = gripe(z, z+d, sec, div);
  }
  else if (structure.value == "vert_split") {
    div = 8;
    sec = 4;
    xs = gripe(x, x+w, 1, 1);
    ys = gripe(y, y+h, 1, 1);
    zs = gripe(z, z+d, sec, div);
  }
  else if (structure.value == "hor_split") {
    div = 8;
    sec = 4;
    xs = gripe(x, x+w, sec, div);
    ys = gripe(y, y+h, 1, 1);
    zs = gripe(z, z+d, 1, 1);
  }
  else {
    alert("FEATURE SELECTION FAILURE");
  }

  let section_seed = fxrand() * 1e6;
  for (let i=0; i<xs.length-1; i++) {
    for (let j=0; j<ys.length-1; j++) {
      for (let k=0; k<zs.length-1; k++) {
        //if (noise(xs[i]/width*sc, ys[j]/width*sc, zs[k]/width*sc) < 0.75) {
        //if ((fxrand() < 0.25) | (k==0)) {
        //if (true) {
        if ((fxrand() < chunkProb.value) && (i > reduceX.value)) {
          zoffset = doChunkOffset.value ? noscale(lerp(-600,600,fxrand())) : 0; // 300
          xoffset = 0; //doChunkOffset.value ? noscale(lerp(-50,50,fxrand())) : 0;
          yoffset = 0; //doChunkOffset.value ? noscale(lerp(-50,50,fxrand())) : 0;

          randomSeed(section_seed);
          if (doBlockedColor.value) {
            picker.switch_dependant();
          }
          ape(xs[i]+xoffset, ys[j]+yoffset, zs[k]+zoffset, xs[i+1]-xs[i], ys[j+1]-ys[j], zs[k+1]-zs[k], noscale(20), 0);
        }
      }
    }
  }
}

function noscale(x) {
  return x * (width/1000);
}

function featureSelection(choices, force) {
  // choices are {value: ?, label: ?, prob: ?}
  if (force !== undefined) {
    return choices[force];
  }
  let weighted_choices = [];
  for (const choice of choices) {
    for (let i=0; i<choice.prob; i++) {
      weighted_choices.push(choice);
    }
  }
  return fxranditem(weighted_choices);
}

function select_features() {
  doFade = featureSelection([
    {value: true, label: "true", prob: 1},
    {value: false, label: "false", prob: 1}
  ]);

  structure = featureSelection([
    {value: "default", label: "Default", prob: 8},
    {value: "vert_split", label: "Vertical Split", prob: 2},
    //{value: "hor_split", label: "Horizontal Split", prob: 1}
  ]);

  doThin = featureSelection([
    {value: true, label: "true", prob: structure.value==="default" ? 1 : 0},
    {value: false, label: "false", prob: 7}
  ]);

  chunkProb = featureSelection([
    {value: 0.6, label: "Sparse", prob: structure.value==="default" ? 3 : 0},
    {value: 0.8, label: "Default", prob: structure.value==="default" ? 5 : 0},
    {value: 1.0, label: "Dense", prob: 2}
  ]);

  doChunkOffset = featureSelection([
    {value: true, label: "true", prob: structure.value==="vert_split" ? 0 : 1},
    {value: false, label: "false", prob: 1}
  ]);

  stretch = featureSelection([
    {value: {zScale:1, yScale:1}, label: "Default", prob: 2},
    {value: {zScale:1.5, yScale:1}, label: "Vertical Stretch", prob: 1},
    {value: {zScale:1, yScale:2}, label: "Horizontal Stretch", prob: 1},
  ])

  extraMode = featureSelection([
    {value: "partial_flatten", label: "Partial Flatten", prob: structure.value === "default" ? 1 : 0},
    //{value: "flatten", label: "Flatten", prob: structure.value === "default" ? 1 : 0},
    {value: "sine", label: "Sinusoid Sway", prob: 1},
    {value: "explode", label: "Explode", prob: (structure.value === "default") && (doThin.value === false) ? 1 : 0},
    {value: "none", label: "None", prob: 7}
  ]);

  let avoid_large = (doThin.value) || (structure.value !== "default") || (chunkProb.label == "Sparse");
  blockSize = featureSelection([
    {value: 0, label: "Large", prob: avoid_large ? 0 : 3},
    {value: 1, label: "Medium", prob: 5},
    {value: 2, label: "Small", prob: 2}
  ]);

  let do_not_warp = (structure.value !== "default") || (extraMode.value === "explode") || (extraMode.value === "sine");
  doWarp = featureSelection([
    {value: true, label: "true", prob: do_not_warp ? 0 : 1},
    {value: false, label: "false", prob: 1}
  ]);

  let reduceX_condition = (structure.value === "default") && (doChunkOffset.value) && (doThin.value === false) && (stretch.label === "Default");
  reduceX = featureSelection([
    {value: 0, label: "true", prob:reduceX_condition ? 1 : 0},
    {value: -1, label: "false", prob: 1}
  ]);

  doBlockedColor = featureSelection([
    {value: true, label: true, prob: 1},
    {value: false, label: false, prob: 1}
  ]);

  subdivisionStrategy = featureSelection([
    {value: "even", label: "Even", prob: 1},
    {value: "varied", label: "Varied", prob: 6},
    {value: "skewed", label: "Skewed", prob: blockSize.label==="Large" ? 0 : 3}
  ]);

  // pick color
  selected_palette = featureSelection(
    all_scheme.map((x,i) => Object({value: x, label: i, prob: x.prob})));

  palette = selected_palette.value.palette;
  background_color = selected_palette.value.background_color;
  stroke_color = selected_palette.value.stroke_color;
  scheme = selected_palette.value;

  stroke(...parseHexStrings(stroke_color)[0]);
  strokeWeight(noscale(1));

  window.$fxhashFeatures = {
    "Chunk Offset" : doChunkOffset.label,
    "Chunk Probability" : chunkProb.label,
    "Color Palette" : selected_palette.label,
    "Distortion Mode" : extraMode.label,
    "Fade" : doFade.label,
    "Global Structure" : structure.label,
    "Size" : blockSize.label,
    "Stretch" : stretch.label,
    "Subdivision Strategy" : subdivisionStrategy.label,
    "Thin" : doThin.label,
    "Reduce X" : reduceX.label,
    "Warp" : doWarp.label,
  }

  console.log(window.$fxhashFeatures);

  randomSeed(fxrand() * 1e8); // deterministic based on hash
  noiseSeed(fxrand() * 1e8);

  picker = new ColorPicker(scheme.palette, scheme.sprinkle, doBlockedColor.value ? 0 : 0.025);
  NU = new NoiseUnit(100, 0.5);
  cube_drawer = new CubeDrawer();
}

function setup() {
  // allow for output of different resolutions
  possible_size = new URLSearchParams(window.location.search).get('size');
  canvas_size = min(window.innerWidth, window.innerHeight);
  if ((possible_size !== undefined) && (possible_size !== null)) {
    canvas_size = parseInt(possible_size);
  }
  canvas = createCanvas(canvas_size, 1.25 * canvas_size);
  //canvas = createCanvas(1000 * size_factor, 1250 * size_factor);
  gridTopX = width/2;
  gridTopY = height/2;

  select_features();
}

function draw() {

  background(245);
  background(...parseHexStrings(background_color)[0]);

  let size = noscale(450);
  zScale = stretch.value.zScale;
  yScale = stretch.value.yScale;
  tripe(
    -size/2, -size/2*yScale, -size/2*zScale,
    size, size*yScale, size*zScale);

  cube_drawer.draw_cubes();
  fxpreview();
  

  /*
  if (frameCount === 1) capturer.start();
  capturer.capture(canvas.canvas);
  if (frameCount === 80) {
      noLoop();
      capturer.stop();
      capturer.save();
  }
  select_features();
  */
  
  noLoop();
}