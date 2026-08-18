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


// how to fix this to work with different things
function extrude_path_v2(path, lw, rw) {
  let angles = [];
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
    angles.push( angle );
  }

  // replace big jumps in angle
  for (let i=0; i<angles.length-1; i++) {
    while (angles[i+1] - angles[i] >= 0.5 * PI) {
      angles[i+1] -= PI;
    }
    while (angles[i+1] - angles[i] <= -0.5 * PI) {
      angles[i+1] += PI;
    }
  }

  /*
  // double check angles are OK
  for (let i=0; i<angles.length; i++) {
    //console.log("ANGLE", angles[i]);
    if ((i>0) && (abs(angles[i-1] - angles[i]) > 0.5*PI)) {
      console.log("BIG DIFF");
    }
  }
  */

  // make shape
  let left = [];
  let right = [];
  for (let k=0; k<path.length; k++) {
    let perp = angles[k] + 0.5 * PI;
    let p1 = [path[k][0] + cos(perp) * lw, path[k][1] + sin(perp) * lw];
    let p2 = [path[k][0] + cos(perp) * rw, path[k][1] + sin(perp) * rw];
    left.push(p1);
    right.push(p2);
  }
  return new Poly(left.concat(right.reverse()));
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

// function to divide interval for subdivisions
function subdivide(minval, maxval, k, pad_weight) {
  if (k === 2) {
    pad_weight = 0.15;
  }
  let size = abs(maxval - minval);
  let pad_unit = (size * pad_weight) / (k-1);
  let unit = (size * (1. - pad_weight)) / k;
  let lws = [];
  let rws = [];
  for (let i=0; i<k; i++) {
    lws.push( minval + (unit + pad_unit) * i );
    rws.push( minval + (unit + pad_unit) * i + unit );
  }
  return [lws, rws];
}

class Path {
  constructor(points) {
    this.points = points;
  }

  static circle(x, y, radius) {
    let n = 60;
    let points = [];
    for (let i=0; i<n; i++) {
      let angle = lerp(0,2*PI,float(i)/(n-1));
      points.push([x + cos(angle)*radius, y + sin(angle)*radius]);
    }
    return new Path(points);
  }

  static equilateral_triangle(x, y, base) {
    let height = sqrt(3) / 2 * base;
    return new Path([[x-base/2,y-height/3],[x+base/2,y-height/3],[x,y+height/3*2]]);
  }

  static squiggle(x, y, minr, maxr, nsegments) {
    let n = 30;
    let xc = x;
    let yc = y;
    let start_angle = random(2*PI);
    let direction = randitem([-1,1]);
    let radius = random(minr,maxr);
    let points = [];
    for (let k=0; k<nsegments; k++) {
      let end_angle = start_angle + direction * random(0.5*PI, 1.5*PI);
      for (let i=0; i<n; i++) {
        let angle = lerp(start_angle, end_angle, float(i)/n);
        points.push([xc + cos(angle)*radius, yc + sin(angle)*radius]);
      }
      let new_radius = random(minr,maxr);
      xc = xc + cos(end_angle) * (radius + new_radius);
      yc = yc + sin(end_angle) * (radius + new_radius);
      direction = direction === 1 ? -1 : 1;
      radius = new_radius;
      start_angle = end_angle + PI;
    }
    return new Path(points);
  }

  static sinewave(amplitude, length) {
    // sine way centered on x,y
    let nperpi = 30;
    let n = int(max(Math.ceil(length / PI * nperpi), 10));
    let points = [];
    for (let i=0; i<n; i++) {
      let x = lerp(-length/2, length/2, float(i)/(n-1));
      points.push([x / (2*PI) * amplitude, sin(x) * amplitude * 0.5]);
    }
    return new Path(points);
  }

  static noisy_line_dep(x, y, n, mag, sc) {
    //noiseSeed(random() * 1e8);
    let ux = x;
    let uy = y;
    let offset = 5234; // random() * 1e6;
    let direction = 1; //randitem([-1,1]);
    let points = [];
    for (let i=0; i<n; i++) {
      let angle = (noise(ux*sc + offset,uy*sc + offset)-0.5) * PI;
      ux = ux + cos(angle) * mag * direction;
      uy = uy + sin(angle) * mag * direction;
      points.push([ux,uy]);
    }
    return new Path(points);
  }

  static noisy_line(ax, ay, bx, by, n, w, scale) {
    let angle = atan2(by-ay, bx-ax);
    let perp = angle + 0.5 * PI;
    let offset = random() * 1e4;
    let points = [];
    noiseSeed(random() * 1e8);
    for (let i=0; i<=n; i++) {
      let t = (float(i) / n);
      //let m = (noise(t * 0.5 + offset)-0.5) * w * 2;
      let m = (noise(t*scale + offset)-0.5) * w;
      let px = lerp(ax, bx, t);
      let py = lerp(ay, by, t);
      let ux = px + cos(perp) * m;
      let uy = py + sin(perp) * m;
      points.push([ux,uy]);
    }
    return new Path(points);
  }

  translate(dx, dy) {
    return new Path(this.points.map(p => [p[0]+dx,p[1]+dy]));
  }

  rotate(angle, cx, cy) {
    // cx,cy the points to rotate around
    if (cx === undefined) {
      console.log("FAILED");
    }
    let rotated_points = [];
    for (const [x,y] of this.points) {
      let nx = (cos(angle) * (x - cx)) + (sin(angle) * (y - cy)) + cx;
      let ny = (cos(angle) * (y - cy)) - (sin(angle) * (x - cx)) + cy;
      rotated_points.push([nx,ny]);
    }
    return new Path(rotated_points);
  }

  round(radius) {
    let path = this.points;
    let rpath = new Poly(path).round(radius).points;
    rpath = rpath.slice(20,rpath.length-20);
    return new Path([path[0]].concat(rpath).concat([path[path.length-1]]));
  }

  extend(amount) {
    // replace the end points with points further away
    // extending the path
    // use negative amount to shrink
    let last = this.points.length - 1;
    let a1 = atan2(
      this.points[1][1] - this.points[0][1],
      this.points[1][0] - this.points[0][0]
    );
    let a2 = atan2(
      this.points[last-1][1] - this.points[last][1],
      this.points[last-1][0] - this.points[last][0]
    );
    let start = [
      this.points[0][0] - cos(a1) * amount,
      this.points[0][1] - sin(a1) * amount
    ];
    let end = [
      this.points[last][0] - cos(a2) * amount,
      this.points[last][1] - sin(a2) * amount
    ];
    return new Path([start].concat(this.points.slice(1,last)).concat([end]));
  }

  extrude(lw, rw) {

    // determine angles
    let angles = [];
    for (let k=0; k<this.points.length; k++) {
      let angle = null;
      if (k === 0) {
        angle = atan2(this.points[k+1][1]-this.points[k][1], this.points[k+1][0]-this.points[k][0]);
      }
      else if (k === this.points.length-1) {
        angle = atan2(this.points[k][1]-this.points[k-1][1], this.points[k][0]-this.points[k-1][0]);
      }
      else {
        let before = atan2(this.points[k+1][1]-this.points[k][1], this.points[k+1][0]-this.points[k][0]);
        let after = atan2(this.points[k][1]-this.points[k-1][1], this.points[k][0]-this.points[k-1][0]);
        angle = (before + after) / 2;
      }
      angles.push( angle );
    }

    // replace big jumps in angle
    for (let i=0; i<angles.length-1; i++) {
      while (angles[i+1] - angles[i] >= 0.5 * PI) {
        angles[i+1] -= PI;
      }
      while (angles[i+1] - angles[i] <= -0.5 * PI) {
        angles[i+1] += PI;
      }
    }

    // make shape
    let left = [];
    let right = [];
    for (let k=0; k<this.points.length; k++) {
      let perp = angles[k] + 0.5 * PI;
      let p1 = [this.points[k][0] + cos(perp) * lw, this.points[k][1] + sin(perp) * lw];
      let p2 = [this.points[k][0] + cos(perp) * rw, this.points[k][1] + sin(perp) * rw];
      left.push(p1);
      right.push(p2);
    }
    return new Poly(left.concat(right.reverse()));
  }

  extrude_multi(lws, rws) {
    let result = [];
    for (let i=0; i<min(lws.length,rws.length); i++) {
      result.push( this.extrude(lws[i], rws[i]) );
    }
    return result;
  }

  extrude_multi_dep(kstrips, size) {
    let parts = [];
    for (let i=0; i<kstrips; i++) {
      let lb = (2*size) / (kstrips*2-1) * 2*i - size;
      let ub = (2*size) / (kstrips*2-1) * (2*i + 1) - size;
      parts.push(this.extrude(lb, ub));
    }
    return parts;
  }

  length() {
    let total_length = 0;
    for (let i=0; i<this.points.length-1; i++) {
      total_length += dist(...this.points[i], ...this.points[i+1]);
    }
    return total_length;
  }

  subset(s, e) {
    // s,e are on the range [0,1] with s < e
    let length = 0;
    let cum_lengths = [0];
    for (let i=0; i<this.points.length-1; i++) {
      length += dist(...this.points[i], ...this.points[i+1]);
      cum_lengths.push( length );
    }

    // map s, e, onto range [0, lenght]
    s = s * length;
    e = e * length;

    // determine s and end points using lerp
    // and start_index and end_index
    let start_coord = null;
    let end_coord = null;
    let start_index = null;
    let end_index = null;
    for (let i=0; i<cum_lengths.length-1; i++) {
      if ((s >= cum_lengths[i]) && (s < cum_lengths[i+1])) {
        let t = (s - cum_lengths[i]) / (cum_lengths[i+1] - cum_lengths[i]);
        start_coord = [
          lerp(this.points[i][0],this.points[i+1][0],t),
          lerp(this.points[i][1],this.points[i+1][1],t)
        ];
        start_index = i+1;
      }
      if ((e >= cum_lengths[i]) && (e < cum_lengths[i+1])) {
        let t = (e - cum_lengths[i]) / (cum_lengths[i+1] - cum_lengths[i]);
        end_coord = [
          lerp(this.points[i][0],this.points[i+1][0],t),
          lerp(this.points[i][1],this.points[i+1][1],t)
        ];
        end_index = i;
      }
      if ((start_coord !== null) && (end_coord !== null)) {
        break;
      }
    }
    
    let inner_points = this.points.slice(start_index,end_index+1);
    return new Path([start_coord].concat(inner_points).concat([end_coord]));
  }

  draw() {
    for (let i=0; i<this.points.length-1; i++) {
      line(...this.points[i],...this.points[i+1]);
    }
  }
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
    return new PolySet(this.polys.concat(polys.polys));
  }
  random_subset(prob) {
    return new PolySet(this.polys.filter(x => random() < prob));
  }
  indexed_subset(index) {
    return new PolySet(this.polys.filter((x,i) => index.includes(i)));
  }
  to_points() {
    return this.polys.map(p => p.points);
  }
  boundsXYWH() {
    return new Poly(this.to_points().flat()).boundsXYWH();
  }
  
  center_relative(tx, ty, tw, th, pset) {
    let [x,y,w,h] = pset.boundsXYWH();
    let dx = tx + (tw/2 - w/2) - x;
    let dy = ty + (th/2 - h/2) - y;
    return this.translate(dx, dy);
  }
  center(tx, ty, tw, th) {
    return this.center_relative(tx, ty, tw, th, this);
  }

  fit_scale_relative(tw, th, fit_factor, pset) {
    let [x,y,w,h] = pset.boundsXYWH();
    let factor = min((tw*fit_factor)/w, (th*fit_factor)/h);
    return this.scale(factor, factor, x + w/2, y + h/2);
  }
  fit_scale(tw, th, fit_factor) {
    return this.fit_scale_relative(tw, th, fit_factor, this);
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
  flip(angle, cx, cy) {
    return this.apply_func(p => p.flip(angle, cx, cy));
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
  intersect_slow(x) {
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

  intersect(x) {
    let out = [];
    const to_segments = (p) => {return PolyBool.segments({regions:[p.points], inverted:false})};
    let segs1 = this.polys.map(to_segments);
    if (x instanceof Poly) {
      let seg2 = to_segments(x);
      for (const seg1 of segs1) {
        try {
          let comb = PolyBool.combine(seg1,seg2);
          out = out.concat(PolyBool.polygon(PolyBool.selectIntersect(comb)).regions);
        }
        catch {
          console.log("skipping intersection ...");
        }
      }
    }
    if (x instanceof PolySet) {
      let segs2 = x.polys.map(to_segments);
      for (const seg1 of segs1) {
        for (const seg2 of segs2) {
          try {
            let comb = PolyBool.combine(seg1,seg2);
            out = out.concat(PolyBool.polygon(PolyBool.selectIntersect(comb)).regions);
          }
          catch {
            console.log("skipping intersection ...");
          }
        }
      }
    }
    return new PolySet(out);
  }

  intersect_w_colors(x, cs) {
    let out = [];
    let colors = [];
    const to_segments = (p) => {return PolyBool.segments({regions:[p.points], inverted:false})};
    let segs1 = this.polys.map(to_segments);
    if (x instanceof PolySet) {
      let segs2 = x.polys.map(to_segments);
      for (const seg1 of segs1) {
        for (let i=0; i<segs2.length; i++) {
          try {
            let comb = PolyBool.combine(seg1,segs2[i]);
            let regions = PolyBool.polygon(
              PolyBool.selectIntersect(comb)).regions;
            out = out.concat(regions);
            colors = colors.concat(regions.map(r => cs[i]));
          }
          catch {
            console.log("skipping intersection ...");
          }
        }
      }
    }
    return [new PolySet(out), colors];
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

  self_difference_fatt(fats) {
    push();
    noFill();
    new PolySet(fats).draw();
    pop();
    let new_polys = [this.polys[0].points];
    for (let i=1; i<this.polys.length; i++) {
      new_polys = new_polys.concat(
        difference([this.polys[i].points], fats.slice(0,i)));
    }
    return new PolySet(new_polys);
  }

  // ====================
  draw() {
    for (const poly of this.polys) {
      poly.draw();
    }
  }
  draw_outline() {
    for (const poly of this.polys) {
      poly.draw_outline();
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
    this.holes = [];
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
  static equilateral_triangle(x, y, base) {
    let height = sqrt(3) / 2 * base;
    return new Poly([[x-base/2,y-height/3],[x+base/2,y-height/3],[x,y+height/3*2]]);
  }
  static partial_circle(x, y, r, start_angle, end_angle) {
    let n = 40;
    let points = [];
    for (let i=0; i<=n; i++) {
      let angle = lerp(start_angle, end_angle, float(i)/n);
      points.push([x + cos(angle)*r, y + sin(angle)*r]);
    }
    points.push([x,y]);
    return new Poly(points);
  }

  /*
  static smooth_stair(path, size, radius, kstrips) {

    let rpath = new Poly(path).round(radius).points;
    rpath = rpath.slice(20,rpath.length-20);
    rpath = [path[0]].concat(rpath).concat([path[path.length-1]]);

    if (kstrips > 1) {
      let bounds = [];
      for (let i=0; i<kstrips; i++) {
        let lb = (2*size) / (kstrips*2-1) * 2*i - size;
        let ub = (2*size) / (kstrips*2-1) * (2*i + 1) - size;
        bounds.push([lb, ub]);
      }
      return bounds.map(b => extrude_path_v2(rpath, b[0], b[1]));
    }
    return extrude_path_v2(rpath, -size, size);
  }

  static squiggle(x, y, minr, maxr, nsegments, size) {
    let n = 30;
    let xc = x;
    let yc = y;
    let start_angle = random(2*PI);
    let direction = randitem([-1,1]);
    let radius = random(minr,maxr);
    //let centers = [];
    let points = [];
    for (let k=0; k<nsegments; k++) {
      //circle(xc, yc, 10);
      let end_angle = start_angle + direction * random(0.5*PI, 1.5*PI);
      //centers.push([xc,yc,radius + size + 5, start_angle, end_angle]);
      for (let i=0; i<n; i++) {
        let angle = lerp(start_angle, end_angle, float(i)/n);
        points.push([xc + cos(angle)*radius, yc + sin(angle)*radius]);
      }
      let new_radius = random(minr,maxr);
      xc = xc + cos(end_angle) * (radius + new_radius); //+ cos(end_angle+0.5*PI) * 50;
      yc = yc + sin(end_angle) * (radius + new_radius); //+ sin(end_angle+0.5*PI) * 50;
      direction = direction === 1 ? -1 : 1;
      radius = new_radius;
      start_angle = end_angle + PI;
    }
    let pad = 10;
    let outer = extrude_path_v2(points, -(size+pad), size+pad)
    let inner = extrude_path_v2(points.slice(2,points.length-2), -size, size);

    let kstrips = randitem([2,3,5]);
    let parts = [];
    for (let i=0; i<kstrips; i++) {
      let lb = (2*size) / (kstrips*2-1) * 2*i - size;
      let ub = (2*size) / (kstrips*2-1) * (2*i + 1) - size;
      parts.push(extrude_path_v2(points, lb, ub));
      //parts.push(extrude_path_v2(points.slice(1,points.length-1), lb, ub));
    }

    return [parts,outer,inner];
    
    return [
      [
        extrude_path_v2(points.slice(1,points.length-1), -size, -0.1*size),
        extrude_path_v2(points.slice(1,points.length-1), 0.1*size, size),
      ],  
      bound
    ];

    let a = extrude_path(points.slice(1,points.length-1), -size, size, false);
    let b = extrude_path_v2(points, -(size+10), -(size+20));
    a.draw_outline();
    b.draw_outline();
    return [new Poly([]), extrude_path(points, -(size+pad), size+pad, true)];

    return new PolySet([
      extrude_path(points, -size, size, true),
      extrude_path(points, -size*2, -size*1.5, true)
    ])
  }
  */
  
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
  // support for holes
  add_holes(holes) {
    let wholes = new Poly(this.points);
    wholes.holes = wholes.holes.concat(holes);
    return wholes;
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

  // triangulate into triangles
  triangulate() {
    let triangles = [];
    let tris = triangulate([this.points]);
    for (let k=0; k<tris.length / 6; k++) {
      let i = k*6;
      triangles.push( [[tris[i],tris[i+1]], [tris[i+2],tris[i+3]], [tris[i+4],tris[i+5]]] );
    }
    return new PolySet(triangles);
  }

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

  densify(n) {
    // insert n points between each vertex
    if (n === undefined) {
      n = 50;
    }
    let points = [];
    for (let i=0; i<this.points.length; i++) {
      let a = this.points[i];
      let b = this.points[(i+1) % this.points.length];
      for (let j=0; j<n; j++) {
        let t = float(j) / n;
        points.push([lerp(a[0],b[0],t), lerp(a[1],b[1],t)]);
      }
    }
    return new Poly(points);
  }

  translate(dx, dy) {
    return new Poly(this.points.map(p => [p[0]+dx,p[1]+dy]));
  }

  warp(func) {
    return new Poly(this.points.map(func));
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

  flip(angle, cx, cy) {
    // flip around line defined by point (cx,cy) and angle
    let axis_length = 1e5;
    let perp = angle + 0.5 * PI;
    let axis = [
      [cx + cos(angle) * axis_length, cy + sin(angle) * axis_length],
      [cx - cos(angle) * axis_length, cy - sin(angle) * axis_length]
    ];
    let flipped_points = [];
    for (const [x,y] of this.points) {
      let pline = [
        [x + cos(perp) * axis_length, y + sin(perp) * axis_length],
        [x - cos(perp) * axis_length, y - sin(perp) * axis_length]
      ];
      let p = lineLineIntersection(
        ...axis[0],...axis[1],...pline[0],...pline[1]);
      let d = dist(...p,x,y);
      let a = atan2(p[1]-y,p[0]-x);
      flipped_points.push([x + cos(a)*d*2, y + sin(a)*d*2]);
    }
    return new Poly(flipped_points);
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
      return new PolySet(intersect(this.holes.concat([this.points]),[x.points]));
    }
  }
  difference(x) {
    if (x instanceof Poly) {
      return new PolySet(difference(this.holes.concat([this.points]),[x.points]));
    }
  }
  union(x) {
    if (x instanceof Poly) {
      return new PolySet(union(this.holes.concat([this.points]),[x.points]));
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
      //path.push([constrain(xh,x+step_size,x+w-step_size),constrain(yh,y+step+size,y+h-step_size)]);
      step += 1;
    }

    /*
    if (direction !== "horizontal") {
      path = path.map(p => [p[0],constrain(p[1],y+step_size,y+h-step_size)]);
    }
    else {
      path = path.map(p => [constrain(p[0],x+step_size,x+w-step_size),p[1]]);
    }
    */

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

  grid_fill_even(ncols, nrows, outer_margin, inner_margin, options) {
    let [x,y,w,h] = this.boundsXYWH();
    let wu = (w - outer_margin[0]*2) / ncols;
    let hu = (h - outer_margin[1]*2) / nrows;
    let grid = []
    for (let j=0; j<nrows; j++) {
      for (let i=0; i<ncols; i++) {
        grid.push(Poly.rect(
          x + outer_margin[0] + i*wu + inner_margin[0],
          y + outer_margin[1] + j*hu + inner_margin[1],
          wu - inner_margin[0]*2,
          hu - inner_margin[1]*2
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
    let d = abs(e - s);
    let ps = [s,e];
    for (let i=0; i<k-1; i++) {
      ps.push(random(s+0.1*d,e-0.1*d));
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
  draw_outline() {
    push();
    noFill();
    this.draw();
    pop();
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
    angle = 1.75 * PI;
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
  let excess = 100;
  let [x,y,w,h] = poly.boundsXYWH();
  let bounds = Poly.rect(x-excess, y-excess, w+2*excess, h+2*excess);
  let slabs = bounds.grid_fill_no_circle(1,int(h), [0,0],[0,0]); // h/5
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


var tessy = (function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    // console.log(data[0], data[1]);
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
  }
  function begincallback(type) {
    if (type !== libtess.primitiveType.GL_TRIANGLES) {
      console.log('expected TRIANGLES but got type: ' + type);
    }
  }
  function errorcallback(errno) {
    console.log('error callback');
    console.log('error number: ' + errno);
  }
  // callback for when segments intersect and must be split
  function combinecallback(coords, data, weight) {
    // console.log('combine callback');
    return [coords[0], coords[1], coords[2]];
  }
  function edgeCallback(flag) {
    // don't really care about the flag, but need no-strip/no-fan behavior
    // console.log('edge flag: ' + flag);
  }

  var tessy = new libtess.GluTesselator();
  // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

  return tessy;
})();

function triangulate(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  tessy.gluTessNormal(0, 0, 1);

  var triangleVerts = [];
  tessy.gluTessBeginPolygon(triangleVerts);

  for (var i = 0; i < contours.length; i++) {
    tessy.gluTessBeginContour();
    var contour = contours[i];
    // for (var j = 0; j < contour.length; j += 2) {
    //   var coords = [contour[j], contour[j + 1], 0];
    for (var j = 0; j < contour.length; j++) {
      var coords = [contour[j][0], contour[j][1], 0];
      tessy.gluTessVertex(coords, coords);
    }
    tessy.gluTessEndContour();
  }

  // finish polygon (and time triangulation process)
  // var startTime = window.nowish();
  tessy.gluTessEndPolygon();
  // var endTime = window.nowish();
  // console.log('tesselation time: ' + (endTime - startTime).toFixed(2) + 'ms');

  return triangleVerts;
}