var canvas;
var shdr;
var colors;

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
  return randitem(weighted_choices);
}

var all_scheme = [
  {
    palette : "ea663ff9cc2784afd77ca994f1bbc9242424eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    background_color : "eeeeee",
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
    palette : "ff9f29 ff5500 228345 2969de 9BD7CB faf3e3 ff5500 ff5500 ff5500 ff5500 ff5500 ff5500",
    background_color : "faf3e3",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "131313",
    background_color : "131313",
    stroke_color : "eeeeee",
    prob : 3
  },

  {
    palette : "ec5526 f4ac12 9ebbc1 f7f4e2 e4e4ce e4e4ce e4e4ce e4e4ce",
    //palette : "ec5526 f4ac12 9ebbc1 f7f4e2 f05e3b f05e3b f05e3b f05e3b",
    background_color : "e4e4ce",
    stroke_color : "131313",
    prob : 10
  },

  // maybe fix this one ...
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
    palette : "fcd307 181818 d5daeb",
    background_color : "fcd307",
    stroke_color : "181818",
    prob : 3
  },

  {
    palette : "5f8289 d5e4c0 516e5a a5aaa8 ffb511 62c2b1",
    background_color : "d5e4c0",
    stroke_color : "131313",
    prob : 10
  },

  
  {
    palette : "f2cdcf 0078bf fff7e4 e6b5c9 f5d102",
    background_color : "fff7e4",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "fe6a50 ffab5d 424e84 f9efdc f9e1c1",
    background_color : "f9e1c1",
    stroke_color : "131313",
    prob : 10
  },

  // can also go with yellow for the background here
  {
    palette : "135ce1 eee9db ffcd46 fa4e31",
    background_color : "eee9db",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "12775b 14252f 9ed6cb ea432c fcc70d",
    background_color : "14252f",
    stroke_color : "eeeeee",
    prob : 5
  },

  {
    palette : "fde103 14252f cbdddd edeed8",
    background_color : "fab6c3",
    stroke_color : "131313",
    prob : 3
  },

  {
    palette : "39b290 39b290 39b290 39b290 39b290 39b290 39b290 39b290 131313 eeeeee",
    background_color : "39b290",
    stroke_color : "131313",
    prob : 3
  }

];

var algoMode, densityPath, densityDiagonal, negativeSpaceWidth, horizontalOffset, smoothingAmount;

function setup() {
  
  // allow user to specify size
  possible_size = new URLSearchParams(window.location.search).get('size');
  canvas_size = min(window.innerWidth, window.innerHeight);
  if ((possible_size !== undefined) && (possible_size !== null)) {
    canvas_size = parseInt(possible_size);
  }

  let aspect = 1.3125;
  canvas = createCanvas(canvas_size, canvas_size * aspect, WEBGL);

  pixelDensity(1);
  shdr = new Shader();

  selected_palette = featureSelection(
    all_scheme.map((x,i) => Object({value: x, label: i, prob: x.prob})));
  colors = parseHexStrings(selected_palette.value.palette);

  // select other features
  // "pillars", "warped", "diagonals", "paths"
  algoMode = featureSelection([
    {value: "pillars", label: "Pillars", prob: 1},
    {value: "warped", label: "Warped", prob: 9},
    {value: "diagonals", label: "Diagonals", prob: 15},
    {value: "paths", label: "Paths", prob: 15}
  ]);

  densityPath = featureSelection([
    {value: 6, label: "low", prob: 3},
    {value: 10, label: "normal", prob: 4},
    {value: 16, label: "high", prob: 3}
  ]);

  densityDiagonal = featureSelection([
    {value: 2, label: "low", prob: 5},
    {value: 3, label: "normal", prob: 3},
    {value: 4, label: "high", prob: 2}
  ]);

  negativeSpaceWidth = featureSelection([
    {value: 10, label: "small", prob: 6},
    {value: 20, label: "large", prob: 4}
  ]);

  horizontalOffset = featureSelection([
    {value: true, label: true, prob: 8},
    {value: false, label: false, prob: 2}
  ]);

  smoothingAmount = featureSelection([
    {value: {simplify: 50, round: 100}, label: "small", prob: 5},
    //{value: {simplify: 200, round: 400}, label: "large", prob: 5}
  ]);

  // fix density depending on algo
  let density_label = "n/a";
  if (algoMode.value === "paths") {
    density_label = densityPath.label;
  }
  if (algoMode.value === "diagonals") {
    density_label = densityDiagonal.label;
  }
  
  // fix negative space width depending on algo
  let negative_space_width_label = negativeSpaceWidth.label;
  if (algoMode.value === "pillars") {
    negative_space_width_label = "n/a";
  }

  // fix smoothing level
  let smoothing_amount_label = "n/a";
  if (algoMode.value === "warped") {
    smoothing_amount_label = smoothingAmount.label;
  }

  window.$fxhashFeatures = {
    "Color Palette" : selected_palette.label,
    "Density" : density_label,
    "Horizontal Offset" : horizontalOffset.label,
    "Mode" : algoMode.label,
    "Negative Space Width" : negative_space_width_label,
  };
  console.log(window.$fxhashFeatures);

  randomSeed(fxrand() * 1e8);
}

function noscale(x) {
  return x / 950 * width;
}

function noscaleSQ(x) {
  return (sqrt(x) / 950 * width) ** 2;
}

function noscale(x) {
  return x;
}

function noscaleSQ(x) {
  return x;
}

function cons(arr) {
  let out = [];
  for (let i=0; i<arr.length-1; i++) {
    out.push([arr[i],arr[i+1]]);
  }
  return out;
}

function noisify_line(x1, y1, x2, y2, n, scale, magnitude) {
  let points = [];
  let angle = atan2(y2-y1, x2-x1) + 0.5 * PI;
  for (let i=0; i<n; i++) {
    let t = float(i) / (n-1);
    let xh = lerp(x1,x2,t);
    let yh = lerp(y1,y2,t);
    let m = noise(xh * scale + 8123, yh * scale + 7273) * magnitude;
    points.push([xh + cos(angle) * m, yh + sin(angle) * m]);
  }
  return points;
}

function extrude_path(path, lw, rw, use_heuristic) {
  if (use_heuristic === undefined) {
    use_heuristic = false;
  }
  let left = [];
  let right = [];
  for (let k=0; k<path.length; k++) {
    let angle = null;
    if (k === 0) {
      angle = atan2(path[k+1][1]-path[k][1], path[k+1][0]-path[k][0]);
    }
    else if (k === path.length-1) {
      angle = atan2(path[k][1]-path[k-1][1], path[k][0]-path[k-1][0]);
    }
    else {
      before = atan2(path[k+1][1]-path[k][1], path[k+1][0]-path[k][0]);
      after = atan2(path[k][1]-path[k-1][1], path[k][0]-path[k-1][0]);
      angle = (before + after) / 2;
    }
    let perp = angle + 0.5 * PI;
    let p1 = [path[k][0] + cos(perp) * lw, path[k][1] + sin(perp) * lw];
    let p2 = [path[k][0] + cos(perp) * rw, path[k][1] + sin(perp) * rw];

    if (use_heuristic) {
      // this logics fixes twisting when angle loops
      if ((left.length > 0) && (dist(...p1,...left[left.length-1]) < dist(...p2,...left[left.length-1]))) {
        left.push(p1);
        right.push(p2);
      }
      else {
        left.push(p2);
        right.push(p1);
      }
    }
    else {
      left.push(p1);
      right.push(p2);
    }
  }
  return new Poly(left.concat(right.reverse()));
}

class LineSet {
  constructor(lines) {
    this.lines = lines;
  }
  concat(lines) {
    this.lines = this.lines.concat(lines.lines);
  }
  draw() {
    for (const [a,b] of this.lines) {
      line(...a,...b);
    }
  }
}

class PolySet {
  constructor(polys, options) {
    this.polys = [];
    //this.colors = [];
    for (const item of polys) {
      if (item instanceof Poly) {
        this.polys.push( item );
      }
      else if (item instanceof PolySet) {
        this.polys = this.polys.concat( item.polys );
      }
      else {
        this.polys.push( new Poly(item) );
      }
    }
    //this.polys = polys.map(p => p instanceof Poly ? p : new Poly(p));
    if ((options !== undefined) && ('scale' in options)) {
      this.polys = this.scale(options.scale, options.cx, options.cy).polys;
    }
    if ((options !== undefined) && ('rotate' in options)) {
      this.polys = this.rotate(options.rotate, options.cx, options.cy).polys;
    }
  }
  concat(polys) {
    this.polys = this.polys.concat(polys.polys);
  }
  random_subset(prob) {
    return new PolySet(this.polys.filter(x => random() < prob));
  }
  to_points() {
    return this.polys.map(p => p.points);
  }

  apply_func(func) {
    return new PolySet(this.polys.map(func));
  }
  apply_funcs(funcs) {
    let result = this;
    for (const func of funcs) {
      result = result.apply_func(func);
    }
    return result;
  }
  translate(dx, dy) {
    return this.apply_func(p => p.translate(dx, dy));
  }
  scale(xfactor, yfactor, cx, cy) {
    return this.apply_func(p => p.scale(xfactor, yfactor, cx, cy));
  }
  rotate(angle, cx, cy) {
    return this.apply_func(p => p.rotate(angle, cx, cy));
  }
  round(radiusAll) {
    return this.apply_func(p => p.round(radiusAll));
  }
  shrink(amount) {
    return this.apply_func(p => p.shrink(amount));
  }

  random_translate(dx, dy, prob) {
    return this.apply_func(p => random()<prob ? p.translate(random(-dx,dx),random(-dy,dy)) : p)
  }
  clip_lines(lines) {
    return new LineSet(this.polys.map(p => p.clip_lines(lines).lines).flat());
  }

  // recursive splitting
  // simple bezier split
  intersection_divide(num_iter) {
    let polys = this;
    for (let i=0; i<num_iter; i++) {
      let step = [];
      for (const poly of polys.polys) {
        if (poly.area() > noscaleSQ(50)) {
          let splitter = poly.diagonal_split();
          let result = splitter.intersect(poly);
          step = step.concat(result.polys);
        }
        else {
          step.push(poly.points);
        }
      }
      step = step.filter(x => x !== undefined);
      polys = new PolySet(step);
    }
    return polys;
  }

  // ====================
  intersect(x) {
    let out = []
    if (x instanceof Poly) {
      for (const p of this.polys) {
        out = out.concat(p.intersect(x));
      }
    } 
    if (x instanceof PolySet) {
      for (const p of this.polys) {
        for (const xx of x.polys) {
          out = out.concat(p.intersect(xx));
        }
      }
    }
    return new PolySet(out);
  }

  difference(x) {
    let out = [];
    if (x instanceof Poly) {
      for (const p of this.polys) {
        out = out.concat(p.difference(x));
      }
    }
    if (x instanceof PolySet) {
      // how to do this
    }
    return new PolySet(out);
  }

  self_difference() {
    let new_polys = [this.polys[0].points];
    for (let i=1; i<this.polys.length; i++) {
      new_polys = new_polys.concat(
        difference([this.polys[i].points], new_polys));
    }
    return new PolySet(new_polys);
  }

  // ====================
  draw() {
    for (const poly of this.polys) {
      poly.draw();
    }
  }
}

class Poly {
  constructor(points) {
    // check for zero length segments
    let min_segment_length = 0.001;
    let clean_points = [points[0]];
    for (let i=0; i<points.length-1; i++) {
      let d = dist(...points[i],...points[(i+1)%points.length]);
      if (d > min_segment_length) {
        clean_points.push(points[i+1]);
      }
    }
    //points = clean_points;

    this.points = points;
  }
  // ====================
  // shapes
  static rect(x, y, w, h) {
    return new Poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
  }
  static circle(x, y, r) {
    let n = 20;
    let points = [];
    for (let i=0; i<=n; i++) {
      let angle = lerp(0, 2*PI, float(i)/n);
      points.push([x + cos(angle)*r, y + sin(angle)*r]);
    }
    return new Poly(points);
  }
  static novel(x, y, w, h, ncol, nrow) {
    let wu = w / (ncol-1);
    let hu = h / (nrow-1);
    let cx = x + w/2;
    let cy = y + h/2;
    let points = [];
    for (let i=0; i<ncol; i++) {
      for (let j=0; j<nrow; j++) {
        points.push([x + i*wu, y + j*hu]);
      }
    }
    let angles = points.map(p => atan2(p[1]-cy, p[0]-cx) + PI);
    
    let result = [];
    while (result.length < 10) {

      let index = randitem([...Array(points.length).keys()]);
      let used = new Set([index]);

      // map previous ones up 2*PI
      angles = angles.map(a => a < angles[index] ? a + 2*PI : a);
      result = [points[index]];

      for (let i=0; i<100; i++) {
        let options = [...Array(points.length).keys()].filter(ii => (dist(...points[index],...points[ii]) <= sqrt(wu*wu + hu*hu)*1.05) && (!used.has(ii)) && (angles[ii] >= angles[index]));
        if (options.length > 0) {
          index = randitem(options);
          used.add(index);
          result.push(points[index]);
        }
        else {
          break;
        }
      }
    }
    return new Poly(result).round(500).draw();
  }

  // ====================
  // divisors
  split_on_poly(poly) {
    let result = difference([this.points], [poly.points]);
    return result.map(p => new Poly(p));
  }

  // ====================
  bounds() {
    var minX, maxX, minY, maxY;
    for (const [x,y] of this.points) {
      minX = (x < minX || minX == null) ? x : minX;
      maxX = (x > maxX || maxX == null) ? x : maxX;
      minY = (y < minY || minY == null) ? y : minY;
      maxY = (y > maxY || maxY == null) ? y : maxY;
    }
    return [minX, maxX, minY, maxY];
  }
  boundsXYWH() {
    let [minX, maxX, minY, maxY] = this.bounds();
    return [minX, minY, maxX-minX, maxY-minY];
  }
  centroid() {
    let [minX, maxX, minY, maxY] = this.bounds();
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  }
  area() {

    var total = 0;

    for (var i = 0, l = this.points.length; i < l; i++) {
      var addX = this.points[i][0];
      var addY = this.points[i == this.points.length - 1 ? 0 : i + 1][1];
      var subX = this.points[i == this.points.length - 1 ? 0 : i + 1][0];
      var subY = this.points[i][1];

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
  }

  // ====================
  // modifiers
  simplify(dmin) {
    let points = [this.points[0]];
    for (let i=1; i<this.points.length; i++) {
      let d = dist(...this.points[i],...points[points.length-1]);
      if (d > dmin) {
        points.push(this.points[i]);
      }
    }
    return new Poly(points);
  }
  translate(dx, dy) {
    return new Poly(this.points.map(p => [p[0]+dx,p[1]+dy]));
  }

  scale(xfactor, yfactor, cx, cy) {
    // cx,cy the points to rotate around
    if (cx === undefined) {
      [cx,cy] = this.centroid();
    }
    return new Poly(this.points.map(
      p => [(p[0]-cx)*xfactor+cx, (p[1]-cy)*yfactor+cy]));
  }

  rotate(angle, cx, cy) {
    // cx,cy the points to rotate around
    if (cx === undefined) {
      [cx,cy] = this.centroid();
    }
    let rotated_points = [];
    for (const [x,y] of this.points) {
      let nx = (cos(angle) * (x - cx)) + (sin(angle) * (y - cy)) + cx;
      let ny = (cos(angle) * (y - cy)) - (sin(angle) * (x - cx)) + cy;
      rotated_points.push([nx,ny]);
    }
    return new Poly(rotated_points);
  }

  clip(border) {
    return intersect([this.points], [border.points]).map(p => new Poly(p));
  }

  clip_others(polys) {
    let result = polys.map(p => intersect([this.points],[p.points]));
    return result.flat().map(p => new Poly(p));
  }

  intersect(x) {
    if (x instanceof Poly) {
      return new PolySet(intersect([this.points],[x.points]));
    }
  }
  difference(x) {
    if (x instanceof Poly) {
      return new PolySet(difference([this.points],[x.points]));
    }
  }

  shrink(d) {
    let points = [];
    let len = this.points.length;
    for (let k=0; k<len; k++) {
      let before = atan2(
        this.points[(k+1)%len][1]-this.points[k][1],
        this.points[(k+1)%len][0]-this.points[k][0]);
      let after = atan2(
        this.points[k][1]-this.points[(k-1+len)%len][1],
        this.points[k][0]-this.points[(k-1+len)%len][0]);
      
      //let after = atan2(
      //  this.points[(k-1+len)%len][1]-this.points[k][1],
      //  this.points[(k-1+len)%len][0]-this.points[k][0]);

      let angle = (before + after) / 2;
      let perp = angle + 0.5 * PI;
      let p1 = [this.points[k][0] - cos(perp) * d, this.points[k][1] - sin(perp) * d];
      let p2 = [this.points[k][0] + cos(perp) * d, this.points[k][1] + sin(perp) * d];
      if (inside(p1, this.points)) {
        points.push(p1);
      }
      else if (inside(p2, this.points)) {
        points.push(p2);
      }
      //circle(...p1,10);
      //circle(...p2,10);
      //points.push([this.points[k][0] - cos(perp) * d, this.points[k][1] - sin(perp) * d]);
    }
    return new Poly(points);
  }

  // ====================
  // splitting funcs
  /*
  bezier_split() {
    let n = 50;
    let [x,y,w,h] = this.boundsXYWH();
    let c1x = random(x,x+w);
    let c2x = random(x,x+w);
    let c1y = random(y,y+h);
    let c2y = random(y,y+h);
    let points = []
    for (let i=0; i<n; i++) {
      let t = float(i) / (n-1);
      points.push([
        bezierPoint(x, c1x, c2x, x+w, t),
        bezierPoint(y, c1y, c2y, y+h, t)
      ]);
    }
    return new PolySet([
      new Poly(points.concat([[x+w,y]])),
      new Poly(points.concat([[x,y+h]]))
    ]);
  }
  */

  random_path(size) {
    // random stepwise path
    // could work well if path is quantized
    // to some sort of grid
    if (size === undefined) {
      size = 20;
    }
    let [x,y,w,h] = this.boundsXYWH();
    let step_size = w / 16;

    let step = 0;
    let direction = randitem(["horizontal","vertical"]);
    let path = [[x, y + randint(1,h / step_size) * step_size]]; //random(y,y+h)]];
    let index = 0;
    if (direction === "vertical") {
      //path = [[random(x,x+w), y]];
      path = [[x + randint(1,w / step_size) * step_size, y]];
      index = 1;
    }
    
    while (path[path.length-1][index] < x+w) {
      let [xh,yh] = path[path.length-1];
      if (direction === "horizontal") {
        if (step % 2 == 0) {
          //xh += random(0.25 * w, 0.5 * w);
          xh += randint(1,4) * step_size;
        }
        else {
          //yh += random(-0.25 * h, 0.25 * h);
          //yh += randitem([-1,1]) * random(0.1 * h, 0.25 * h);
          yh += randitem([-1,1]) * randint(1,4) * step_size;
        }
      }
      else {
        if (step % 2 == 0) {
          //yh += random(0.25 * h, 0.5 * h);
          yh += randint(1,4) * step_size;
        }
        else {
          //xh += random(-0.25 * w, 0.25 * w);
          //xh += randitem([-1,1]) * random(0.1 * w, 0.25 * w);
          xh += randitem([-1,1]) * randint(1,4) * step_size;
        }
      }
      path.push([xh,yh]);
      step += 1;
    }
    //console.log(path);
    path[0][index] -= 1e5;
    path[path.length - 1][index] += 1e5;
    path = extrude_path(path, -size, size);
    //noFill();
    //path.draw();
    return path;
  }

  bezier_path(size) {
    // pick point on edge and then do split
    let n = 20;
    let [x,y,w,h] = this.boundsXYWH();
    let bound = Poly.rect(x,y,w,h).scale(1.1,1.1).points;
    let diag = sqrt(w*w + h*h);

    let d = 0;
    let a, b, ax, bx, ay, by;
    while (d < 0.5 * diag) {
      let index = [...Array(4).keys()];
      index = shuffle(index);
      //[a,b] = index.slice(0,2);
      a = index[0];
      b = (a + 2) % bound.length;

      ax = lerp(bound[a][0],bound[(a+1)%bound.length][0],random());
      ay = lerp(bound[a][1],bound[(a+1)%bound.length][1],random());

      bx = lerp(bound[b][0],bound[(b+1)%bound.length][0],random());
      by = lerp(bound[b][1],bound[(b+1)%bound.length][1],random());
      d = dist(ax,ay,bx,by);
    }

    
    let aangle = atan2(by-ay, bx-ax);
    let bangle = atan2(ay-by, ax-bx);
    let angle_amount = 0.5 * PI;
    
    let c1angle = random(-angle_amount,angle_amount) + aangle;
    let c1mag = random(0.3*d, 0.4*d);
    let c1x = cos(c1angle) * c1mag + ax;
    let c1y = sin(c1angle) * c1mag + ay;
    
    
    let c2angle = random(-angle_amount,angle_amount) + bangle;
    let c2mag = random(0.3*d, 0.4*d);
    let c2x = cos(c2angle) * c2mag + bx;
    let c2y = sin(c2angle) * c2mag + by;

    // show progress
    /*
    circle(ax,ay,10);
    circle(bx,by,10);
    stroke(0,255,0);
    circle(c1x,c1y,10);
    circle(c2x,c2y,10);
    stroke(255);
    */
    
    let points = []
    for (let i=0; i<n; i++) {
      let t = float(i) / (n-1);
      points.push([
        bezierPoint(ax, c1x, c2x, bx, t),
        bezierPoint(ay, c1y, c2y, by, t)
      ]);
    }

    return extrude_path(points, -size, size, true);
  }

  diagonal_split() {
    let [x,y,w,h] = this.boundsXYWH();
    let large = 8;
    let n = floor(random(4,8)); // 4,16
    let angle = atan2(h,w) + 0.5 * PI;
    let direction = randitem(["right","left"]);
    if (direction === "right") {
      angle = 0.25 * PI;
    }
    else {
      angle = 1.75 * PI;
    }
    /*
    if (broken) {
      angle = randitem([0.25 * PI, 1.75 * PI]);
      direction = "left";
    }
    */

    let diag = sqrt(w*w + h*h)
    let pos = partition_line(0, diag, n);
    let out = [];
    for (let i=0; i<n; i++) {

      let cxs, cys, cxe, cye;
      if (direction == "right") {
        cxs = lerp(x+w, x, pos[i]/diag);
        cys = lerp(y, y+h, pos[i]/diag);
        cxe = lerp(x+w, x, pos[i+1]/diag);
        cye = lerp(y, y+h, pos[i+1]/diag);
      }
      else {
        cxs = lerp(x, x+w, pos[i]/diag);
        cys = lerp(y, y+h, pos[i]/diag);
        cxe = lerp(x, x+w, pos[i+1]/diag);
        cye = lerp(y, y+h, pos[i+1]/diag);
      }
      
      out.push([
        [cxs - cos(angle) * large * diag, cys - sin(angle) * large * diag],
        [cxe - cos(angle) * large * diag, cye - sin(angle) * large * diag],
        [cxe + cos(angle) * large * diag, cye + sin(angle) * large * diag],
        [cxs + cos(angle) * large * diag, cys + sin(angle) * large * diag],
      ])
    }
    return new PolySet(out);
  }

  bezier_split() {
    // pick point on edge and then do split
    let n = 5;
    let [x,y,w,h] = this.boundsXYWH();
    let bound = Poly.rect(x,y,w,h).points;
    let diag = sqrt(w*w + h*h);

    let d = 0;
    let a, b, ax, bx, ay, by;
    while (d < 0.5 * diag) {
      let index = [...Array(4).keys()];
      index = shuffle(index);
      //[a,b] = index.slice(0,2);
      a = index[0];
      b = (a + 2) % bound.length;

      ax = lerp(bound[a][0],bound[(a+1)%bound.length][0],random());
      ay = lerp(bound[a][1],bound[(a+1)%bound.length][1],random());

      bx = lerp(bound[b][0],bound[(b+1)%bound.length][0],random());
      by = lerp(bound[b][1],bound[(b+1)%bound.length][1],random());
      d = dist(ax,ay,bx,by);
    }

    
    let aangle = atan2(by-ay, bx-ax);
    let bangle = atan2(ay-by, ax-bx);
    let angle_amount = 0.25 * PI;
    
    let c1angle = random(-angle_amount,angle_amount) + aangle;
    let c1mag = random(0.1*d, 0.4*d);
    let c1x = cos(c1angle) * c1mag + ax;
    let c1y = sin(c1angle) * c1mag + ay;
    
    
    let c2angle = random(-angle_amount,angle_amount) + bangle;
    let c2mag = random(0.1*d, 0.4*d);
    let c2x = cos(c2angle) * c2mag + bx;
    let c2y = sin(c2angle) * c2mag + by;

    // show progress
    /*
    circle(ax,ay,10);
    circle(bx,by,10);
    stroke(0,255,0);
    circle(c1x,c1y,10);
    circle(c2x,c2y,10);
    stroke(255);
    */
    
    let points = []
    for (let i=0; i<n; i++) {
      let t = float(i) / (n-1);
      points.push([
        bezierPoint(ax, c1x, c2x, bx, t),
        bezierPoint(ay, c1y, c2y, by, t)
      ]);
    }

    // extra points are counter-clockwise and clockwise
    let pos = a;
    let forward = [];
    while (pos !== b) {
      //console.log("FORWARD", (pos+1) % bound.length);
      forward.push( bound[(pos+1) % bound.length] );
      pos = (pos + 1) % bound.length;
    }

    pos = b;
    let backward = [];
    while (pos !== a) {
      //console.log("BWARD", (pos+1) % bound.length);
      backward.push( bound[(pos+1) % bound.length] );
      pos = (pos + 1) % bound.length;
    }

    return new PolySet([
      new Poly(points.concat(forward.reverse())),
      new Poly(points.concat(backward))
    ]);
  }

  // ====================
  // rounding

  arcPoints(x, y, start_angle, end_angle, radius, direc, n) {
    if (n === undefined) {
      n = 20; // 25
    }
    let points = [];
    let sa = start_angle;
    let ea = end_angle;
    while ((direc == true) & (sa < ea)) {
      sa += 2 * PI;
    }
    while ((direc == false) & (sa > ea)) {
      ea += 2 * PI;
    }
    for (let i=0; i<n; i++) {  
      let angle = lerp(sa, ea, float(i) / (n-1));
      points.push([x + cos(angle) * radius, y + sin(angle) * radius]);
    }
    return points;
  }
  
  toXY(points) {
    return points.map(function (p) { return {x:p[0],y:p[1]} });
  }
  
  // ctx is the context to add the path to
  // points is a array of points [{x :?, y: ?},...
  // radius is the max rounding radius 
  // this creates a closed polygon.
  // To draw you must call between 
  //    ctx.beginPath();
  //    roundedPoly(ctx, points, radius);
  //    ctx.stroke();
  //    ctx.fill();
  // as it only adds a path and does not render. 
  round(radiusAll) {
    let points = this.toXY(this.points);
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut,radius;
    // convert 2 points into vector form, polar form, and normalised 
    var asVec = function(p, pp, v) {
      v.x = pp.x - p.x;
      v.y = pp.y - p.y;
      v.len = Math.sqrt(v.x * v.x + v.y * v.y);
      v.nx = v.x / v.len;
      v.ny = v.y / v.len;
      v.ang = Math.atan2(v.ny, v.nx);
    }
    radius = radiusAll;
    v1 = {};
    v2 = {};
    len = points.length;
    p1 = points[len - 1];
    let out = [];
    // for each point
    for (i = 0; i < len; i++) {
      p2 = points[(i) % len];
      p3 = points[(i + 1) % len];
      //-----------------------------------------
      // Part 1
      asVec(p2, p1, v1);
      asVec(p2, p3, v2);
      sinA = v1.nx * v2.ny - v1.ny * v2.nx;
      sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
      angle = Math.asin(sinA < -1 ? -1 : sinA > 1 ? 1 : sinA);
      //-----------------------------------------
      radDirection = 1;
      drawDirection = false;
      if (sinA90 < 0) {
        if (angle < 0) {
          angle = Math.PI + angle;
        } else {
          angle = Math.PI - angle;
          radDirection = -1;
          drawDirection = true;
        }
      } else {
        if (angle > 0) {
          radDirection = -1;
          drawDirection = true;
        }
      }
      if(p2.radius !== undefined){
          radius = p2.radius;
      }else{
          radius = radiusAll;
      }
      //-----------------------------------------
      // Part 2
      halfAngle = angle / 2;
      //-----------------------------------------
  
      //-----------------------------------------
      // Part 3
      lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
      //-----------------------------------------
  
      //-----------------------------------------
      // Special part A
      if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
        lenOut = Math.min(v1.len / 2, v2.len / 2);
        cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
      } else {
        cRadius = radius;
      }
      //-----------------------------------------
      // Part 4
      x = p2.x + v2.nx * lenOut;
      y = p2.y + v2.ny * lenOut;
      //-----------------------------------------
      // Part 5
      x += -v2.ny * cRadius * radDirection;
      y += v2.nx * cRadius * radDirection;
      //-----------------------------------------
      // Part 6
      out = out.concat(this.arcPoints(x, y, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, cRadius, drawDirection));
      //arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
      //-----------------------------------------
      p1 = p2;
      p2 = p3;
    }
    //ctx.closePath();
    return new Poly(out);
  }
  // ====================
  // polygon fills
  grid_fill_no_circle(ncols, nrows, outer_margin, inner_margin, options) {
    let [x,y,w,h] = this.boundsXYWH();
    let wu = (w - outer_margin[0]*2) / ncols;
    let hu = (h - outer_margin[1]*2) / nrows;
    let grid = []
    for (let j=0; j<nrows; j++) {
      for (let i=0; i<ncols; i++) {
        let step = 1;
        grid.push(Poly.rect(
          x + outer_margin[0] + i*wu + wu * inner_margin[0],
          y + outer_margin[1] + j*hu + hu * inner_margin[1],
          wu*step - wu*inner_margin[0]*2,
          hu * (1-inner_margin[1]*2)
        ));
      }
    }
    return new PolySet(grid.map(g => g.clip(this)).flat(), options);
  }

  grid_fill_circle(ncols, nrows, outer_margin, inner_margin, options) {
    let [x,y,w,h] = this.boundsXYWH();
    let wu = (w - outer_margin[0]*2) / ncols;
    let hu = (h - outer_margin[1]*2) / nrows;
    let grid = []
    for (let j=0; j<nrows; j++) {
      for (let i=0; i<ncols; i++) {
        grid.push(Poly.circle(
          x + outer_margin[0] + i*wu + 0.5*wu,
          y + outer_margin[1] + j*hu + 0.5*hu,
          min(wu,hu) * (1. - 2*inner_margin[0]) / 2,
          min(wu,hu) * (1. - 2*inner_margin[0]) / 2
        ));
      }
    }
    return new PolySet(grid.map(g => g.clip(this)).flat(), options);
  }

  grid_fill(ncols, nrows, outer_margin, inner_margin, options) {
    let [x,y,w,h] = this.boundsXYWH();
    let wu = (w - outer_margin[0]*2) / ncols;
    let hu = (h - outer_margin[1]*2) / nrows;
    let mode = true;
    let grid = []
    for (let j=0; j<nrows; j++) {
      for (let i=0; i<ncols; i++) {
        let step = random() < 1.0 ? 1 : random(2,8); // this gives different behaviour
        //if (random() < 0.3) {
        if (mode) {
          grid.push(Poly.rect(
            x + outer_margin[0] + i*wu + wu * inner_margin[0],
            y + outer_margin[1] + j*hu + hu * inner_margin[1],
            wu*step - wu*inner_margin[0]*2,
            hu * (1-inner_margin[1]*2)
          ));
        }
        else {
          grid.push(Poly.circle(
            x + outer_margin[0] + i*wu + 0.5*wu,
            y + outer_margin[1] + j*hu + 0.5*hu,
            wu * 0.3,
            wu * 0.3
          ));
        }
        i += (step-1);

        if (random() < 0.1) {
          mode = random() < 0.7;
        }
      }
    }
    return new PolySet(grid.map(g => g.clip(this)).flat(), options);
  }

  partition_interval(s, e, k) {
    let ps = [s,e];
    for (let i=0; i<k-1; i++) {
      ps.push(random(s,e));
    }
    return ps.sort((a,b) => a-b);
  }

  uneven_grid_fill(ncols, nrows, outer_margin, inner_margin, options) {
    let [x,y,w,h] = this.boundsXYWH();
    let xs = this.partition_interval(x+outer_margin[0],x+w-outer_margin[0]*2,ncols);
    let ys = this.partition_interval(y+outer_margin[1],y+h-outer_margin[1]*2,nrows);
    let out = [];
    for (let i=0; i<xs.length-1; i++) {
      for (let j=0; j<ys.length-1; j++) {
        out.push( Poly.rect(
          xs[i] + inner_margin[0],
          ys[j] + inner_margin[1],
          xs[i+1]-xs[i] - 2*inner_margin[0],
          ys[j+1]-ys[j] - 2*inner_margin[1]));
      }
    }
    return new PolySet(out, options);
  }

  // ====================
  // fills 105.46
  clip_lines(lines) {
    let clines = lines.map(l => linePolyIntersect(...l, this.points));
    return new LineSet(clines.filter(p => (p[0] !== undefined) & (p[1] !== undefined)));
  }
  fill_line_get_lines(d, angle, power) {
    if (power === undefined) {
      power = 1;
    }
    let [x,y,w,h] = this.boundsXYWH();
    let cx = x + w/2;
    let cy = y + h/2;
    let perp = angle + 0.5 * PI;
    let diag = Math.sqrt(w*w + h*h);
    let nlines = Math.ceil(diag / d);

    let lines = [];
    //for (let i=-nlines; i<=nlines; i++) {
    for (let i=0; i<nlines; i++) {
      let t = lerp(-diag/2, diag/2, (float(i)/(nlines-1)) ** power);
      lines.push([
        [
          cx + t*cos(perp) - diag*cos(angle),
          cy + t*sin(perp) - diag*sin(angle)
        ],
        [
          cx + t*cos(perp) + diag*cos(angle),
          cy + t*sin(perp) + diag*sin(angle)
        ]
      ]);
    }
    return lines;
  }
  fill_line(d, angle, power) {
    return this.clip_lines(this.fill_line_get_lines(d,angle,power));
    //lines = lines.map(l => cons(noisify_line(...l[0], ...l[1], 100, 0.002, 200)));
    //return this.clip_lines(lines.flat());
  }

  fill_horizontal_line(d) {
    let [x,y,w,h] = this.boundsXYWH();
    let n = h/d;
    let out = [];
    for (let i=0; i<n; i++) {
      let l = [[x-0.1*w, y+i*d],[x+w+0.1*w, y+i*d]];
      out.push( linePolyIntersect(...l, this.points) );
    }
    out = out.filter(p => (p[0] !== undefined) & (p[1] !== undefined));
    return out;
  }
  fill_triangle_wave(poly, d) {
    let [x,y,w,h] = this.boundsXYWH();
    let ny = h/d;
    let nx = w/d;
    let out = [];
    let eps = 0.1;
    for (let i=0; i<ny; i++) {
      for (let j=0; j<nx; j++) {
        let l = [
          [x+j*d, y+i*d + j%2 * d + eps],
          [x+(j+1)*d, y+i*d + (j+1)%2 * d + eps]
        ];
        out.push( linePolyIntersect(...l, poly) );
      }
    }
    out = out.filter(x => (x[0] !== undefined) & (x[1] !== undefined));
    return out;
  }


  // ====================
  draw() {
    beginShape();
    for (const p of this.points) {
      vertex(...p);
    }
    endShape(CLOSE);
  }
}

function partition_line(s, e, k) {
  let ps = [s,e];
  for (let i=0; i<k-1; i++) {
    ps.push(random(s,e));
  }
  return ps.sort((a,b) => a-b);
}

function polygonBounds(poly) {
  var minX, maxX, minY, maxY;
  for (const [x,y] of poly) {
          minX = (x < minX || minX == null) ? x : minX;
          maxX = (x > maxX || maxX == null) ? x : maxX;
          minY = (y < minY || minY == null) ? y : minY;
          maxY = (y > maxY || maxY == null) ? y : maxY;
  }
  return [minX, maxX, minY, maxY];
}

function polygonBoundsXYWH(poly) {
  let [minX, maxX, minY, maxY] = polygonBounds(poly);
  return [minX, minY, maxX-minX, maxY-minY];
}

function noisy_line(ax, ay, bx, by, n, w) {
  let angle = atan2(by-ay, bx-ax);
  let perp = angle + 0.5 * PI;
  let offset = random() * 1e4;
  let out = [];
  noiseSeed(random() * 1e8);
  for (let i=0; i<=n; i++) {
    let t = (float(i) / n);
    //let m = (noise(t * 0.5 + offset)-0.5) * w * 2;
    let m = (noise(t + offset)-0.5) * w;
    let px = lerp(ax, bx, t);
    let py = lerp(ay, by, t);
    let ux = px + cos(perp) * m;
    let uy = py + sin(perp) * m;
    out.push([ux,uy]);
  }
  return out;
}

function splitting_polys(x, y, w, h, vertical_prob) {

  // vertical split
  if (vertical_prob === undefined) {
    vertical_prob = 0.5;
  }
  if (random() < vertical_prob) {
    let top = random(0.25, 0.75);
    let bottom = random(0.25, 0.75);
    let line = noisy_line(x+top*w,y,x+bottom*w,y+h,100,w*0.6);
    //let a = [[x,y],...line,[x,y+h]];
    //let b = [...line,[x+w,y+h],[x+w,y]];
    let a = [[x,y],[x,y+h],...line.reverse()];
    let b = [...line.reverse(),[x+w,y+h],[x+w,y]];
    return [a,b];
  }

  let left = random(0.25, 0.75);
  let right = random(0.25, 0.75);
  let line = noisy_line(x,y+left*h,x+w,y+right*h,100,h*0.6);
  let a = [[x,y],[x+w,y],...line.reverse()];
  let b = [...line.reverse(),[x+w,y+h],[x,y+h]];
  return [a,b];
}

function splitting_polys_diagonal(x, y, w, h, broken) {
  let large = 8;
  let n = floor(random(4,8)); // 4, 16
  let angle = atan2(h,w) + 0.5 * PI;
  
  //angle = 1.75 * PI;
  //angle = randitem([0.25 * PI, 1.75 * PI]);
  //angle = 0.25 * PI;

  let direction = randitem(["right","left"]);
  if (direction === "right") {
    angle = 0.25 * PI;
  }
  else {
    angle = 1.75 * PI;
  }

  if (broken) {
    angle = randitem([0.25 * PI, 1.75 * PI]);
    direction = "left";
  }

  let diag = sqrt(w*w + h*h)
  let pos = partition_line(0, diag, n);
  let out = [];
  for (let i=0; i<n; i++) {

    let cxs, cys, cxe, cye;
    if (direction == "right") {
      cxs = lerp(x+w, x, pos[i]/diag);
      cys = lerp(y, y+h, pos[i]/diag);
      cxe = lerp(x+w, x, pos[i+1]/diag);
      cye = lerp(y, y+h, pos[i+1]/diag);
    }
    else {
      cxs = lerp(x, x+w, pos[i]/diag);
      cys = lerp(y, y+h, pos[i]/diag);
      cxe = lerp(x, x+w, pos[i+1]/diag);
      cye = lerp(y, y+h, pos[i+1]/diag);
    }
    
    out.push([
      [cxs - cos(angle) * large * diag, cys - sin(angle) * large * diag],
      [cxe - cos(angle) * large * diag, cye - sin(angle) * large * diag],
      [cxe + cos(angle) * large * diag, cye + sin(angle) * large * diag],
      [cxs + cos(angle) * large * diag, cys + sin(angle) * large * diag],
    ])
  }
  return out;
}

function intersection_divide(polys, splitter_func, num_iter, density, splitter_func_args) {
  if (splitter_func_args === undefined) {
    splitter_func_args = [];
  }
  for (let i=0; i<num_iter; i++) {
    let out = [];
    for (const poly of polys) {
      //if (true) {
      if (new Poly(poly).area() > noscaleSQ(50)) {
        splitter = splitter_func(
          ...polygonBoundsXYWH(poly), ...splitter_func_args);
        for (const s of splitter) {
          try {
            let result = intersect([s], [poly]);
            if (result.length) {
              out = out.concat(result);
            }
          }
          catch {
            console.log("FAILER ...");
          }
        }
      }
    }
    polys = [...out.filter(x => x !== undefined)];
    if (i > 0) {
      polys = polys.filter(x => random() < density);
    }
  }
  return polys;
}

function pick_poly_colors(polys, color_change_prob, random_color_prob, no_color_prob) {
  let poly_colors = [];
  current_color = randitem(colors);
  for (let i=0; i<polys.length; i++) {
    let use_color = null;
    if (random() < color_change_prob) {
      current_color = randitem(colors);
    }
    if (random() < random_color_prob) {
      use_color = randitem(colors);
    }
    else {
      use_color = current_color;
    }
    if (random() < no_color_prob) {
      use_color = null;
    }
    poly_colors.push( use_color );
  }
  return poly_colors;
}


function make_drawing(polys, poly_colors) {
  for (let i=0; i<polys.length; i++) {
    if ((poly_colors[i] === undefined) | (poly_colors[i] === null)) {
      noFill();
    }
    else {
      fill(...poly_colors[i]);
    }
    draw_poly_safe(polys[i]);
  }
}

function draw_poly_safe(points) {
  let poly = new Poly(points);
  let bounds = poly.scale(1.25,1.25);
  let [x,y,w,h] = bounds.boundsXYWH();
  let slabs = bounds.grid_fill_no_circle(1,int(h/5), [0,0],[0,0]);
  slabs = slabs.intersect(poly);
  push();
  noStroke();
  for (const s of slabs.polys) {
    draw_poly(s.points);
  }
  pop();
  push();
  noFill();
  poly.draw();
  pop();
}

function draw_poly(points) {
  beginShape();
  for (const p of points) {
    vertex(...p);
  }
  endShape(CLOSE);
}

function draw() {
  strokeWeight(1.0/950*width);
  background(245);
  background(...randitem(colors));
  //background(colors[1]);

  //noFill();
  //background(13, 13, 13);
  //stroke(240, 240, 240);
  
  //background(240, 240, 240);
  //stroke(13, 13, 13);

  background(parseHexStrings(selected_palette.value.background_color)[0]);
  stroke(parseHexStrings(selected_palette.value.stroke_color)[0]);

  translate(-width/2,-height/2);

  let use_width = 950;
  let use_height = use_width * 1.3125;

  let margin = 20/297 * use_width;
  let border = Poly.rect(margin, margin, use_width-2*margin, use_height-2*margin);
  let page = Poly.rect(0, 0, use_width, use_height);

  if (algoMode.value === "pillars") {
    // make this really rare!
    
    let polys = border.grid_fill_no_circle(5, 1, [0,0], [0.1,0]);
    polys = polys.round(noscale(50));
    polys = polys.intersection_divide(4);

    if (horizontalOffset.value) {
      let am = noscale(50);
      polys = polys.apply_func(p => random() < 0.25 ? p.translate(random(-am,am),0) : p).intersect(border);
    }

    polys = polys.scale(width/use_width,width/use_width,0,0);
    polys = polys.to_points();

    poly_colors = pick_poly_colors(polys, 0.05, 0.05, 0.05);
    make_drawing(polys, poly_colors);

  }

  if (algoMode.value === "warped") {

    let polys = new PolySet([border]);
    for (let i=0; i<3; i++) { // 3
      polys = polys.apply_func(p => p.difference(p.bezier_path(noscale(negativeSpaceWidth.value))));
    }

    polys = polys.apply_func(
      p => p.simplify(noscale(smoothingAmount.value.simplify)));
    polys = polys.round(noscale(smoothingAmount.value.round));

    polys = new PolySet(polys.polys.filter(p => p.area() > (use_width/16)**2));

    polys = polys.intersection_divide(4);

    if (horizontalOffset.value) {
      let am = noscale(50);
      polys = polys.apply_func(p => random() < 0.25 ? p.translate(random(-am,am),0) : p).intersect(border);
    }
    
    // diagonal hatching
    //cuts = page.scale(2,2).grid_fill_no_circle(1, 80, [0,0], [0,0.25], {rotate : 0.25*PI, cx: width/2, cy: height/2});
    //polys = polys.intersect(cuts);
    
    polys = polys.scale(width/use_width,width/use_width,0,0);
    polys = polys.to_points();

    poly_colors = pick_poly_colors(polys, 0.05, 0.05, 0.05);
    make_drawing(polys, poly_colors);
  }

  if (algoMode.value === "diagonals") {
    // nice in mint

    let o = new PolySet([border]).intersection_divide(densityDiagonal.value); // PARAM 2, 3, 4
    //polys = o.round(100).polys.map(p => p.points); // 100
    polys = o.shrink(noscale(negativeSpaceWidth.value)).round(noscale(50)).polys.map(p => p.points); // 100

    // do an overlay 
    // use intersection divide of 1
    //sections = new PolySet(intersection_divide([border.points], splitting_polys, 3, 1)).random_subset(0.8);
    //o = new PolySet(o).intersect(sections).to_points();
    
    
    // extra rare something ...
    //polys = intersection_divide(polys, splitting_polys, 5, 1); // 3
    polys = intersection_divide(polys, splitting_polys_diagonal, 3, 1); // 3

    if (horizontalOffset.value) {
      let am = noscale(50);
      polys = polys.map(p => random() < 0.1 ? new Poly(p).translate(random(-am,am),0).points : p);
    }
    
    polys = new PolySet(polys).intersect(border);
    polys = polys.scale(width/use_width,width/use_width,0,0);
    polys = polys.to_points();
    
    // diagonal hatching
    //cuts = page.scale(2,2).grid_fill_no_circle(1, 80, [0,0], [0,0.25], {rotate : 0.25*PI, cx: width/2, cy: height/2});
    //polys = new PolySet(polys).intersect(cuts).to_points();
    
    poly_colors = pick_poly_colors(polys, 0.05, 0.05, 0.05);
    make_drawing(polys, poly_colors);
  }

  if (algoMode.value === "paths") {

    let polys = new PolySet([border]);
    for (let i=0; i<densityPath.value; i++) { // 6 , 10, 16
      polys = polys.difference(
        page.random_path(noscale(negativeSpaceWidth.value))); // 10, 20
    }
    polys = polys.round(noscale(50));
    //polys = polys.random_subset(0.8);
    
    polys = intersection_divide(
      polys.to_points(), splitting_polys_diagonal, 3, 1);
    polys = new PolySet(polys);

    if (horizontalOffset.value) {
      let am = noscale(25);
      polys = polys.apply_func(p => random() < 0.25 ? p.translate(random(-am,am),0) : p);
    }

    polys = polys.intersect(border);
    polys = polys.scale(width/use_width,width/use_width,0,0);
    polys = polys.to_points();

    poly_colors = pick_poly_colors(polys, 0.05, 0.05, 0.05);
    make_drawing(polys, poly_colors);
  }

  fill(0);
  shdr.draw();
  
  fxpreview();
  noLoop();
}

