var canvas;
var shdr;
var colors;

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
    palette : "fcd307 181818 d5daeb",
    background_color : "fcd307",
    stroke_color : "181818",
    prob : 2
  },

  {
    palette : "fde103 131313 cbdddd edeed8",
    background_color : "fab6c3",
    stroke_color : "131313",
    prob : 2
  },

  {
    palette : "39b290 39b290 39b290 39b290 39b290 39b290 39b290 39b290 131313 eeeeee",
    background_color : "39b290",
    stroke_color : "131313",
    prob : 2
  }

];

var selected_palette, iter_num, aspect_ratio, density, circle_ratio;

var textureMode, partialFlowStructure, partialFlowSize, multipleFlows, noisyDiagonalDirection, noisyDiagonalDensity;

function setup() {

  // allow user to specify size
  possible_size = new URLSearchParams(window.location.search).get('size');
  canvas_size = min(window.innerWidth, window.innerHeight);
  if ((possible_size !== undefined) && (possible_size !== null)) {
    canvas_size = parseInt(possible_size);
  }

  // preference picking
  selected_palette = featureSelection(
    all_scheme.map((x,i) => Object({value: x, label: i, prob: x.prob})));

  // pick the aspect ratio
  aspect_ratio = featureSelection([
    //{value: [canvas_size*1.5,canvas_size], label: "Landscape", prob: 1},
    {value: [canvas_size,canvas_size*1.3125], label: "Portrait", prob: 7},
    {value: [canvas_size,canvas_size], label: "Square", prob: 3},
  ]);

  // texture mode
  textureMode = featureSelection([
    {value: "diagonal_mask", label: "Diagonal Mask", prob:4},
    {value: "partial_flow", label: "Partial Flow", prob:4},
    {value: "diagonal", label: "Noisy Diagonals", prob:3},
  ]);

  partialFlowStructure = featureSelection([
    {value: "line", label: "Line", prob:3},
    {value: "circle", label: "Circle", prob:1},
    {value: "diagonal", label: "Diagonal", prob:3},
    {value: "noisy", label: "Noisy", prob:3}
  ]);
  if (textureMode.value !== "partial_flow") {
    partialFlowStructure = {value: "n/a", label: "N/A"};
  }

  partialFlowSize = featureSelection([
    {value: "small", label: "Small", prob: 6},
    {value: "large", label: "Large", prob: 4},
  ]);
  if (textureMode.value !== "partial_flow") {
    partialFlowSize = {value: "n/a", label: "N/A"};
  }

  multipleFlows = featureSelection([
    {value: true, label: "True", prob: 3},
    {value: false, label: "False", prob: 7}
  ]);

  noisyDiagonalDirection = featureSelection([
    {value: "vertical", label: "Vertical", prob: 3},
    {value: "horizontal", label: "Horizontal", prob: 3},
    {value: "mixed", label: "Mixed", prob: 4}
  ]);
  if (textureMode.value !== "diagonal") {
    noisyDiagonalDirection = {value: "n/a", label: "N/A"};
  }

  noisyDiagonalDensity = featureSelection([
    {value: 6, label: "Dense", prob: (noisyDiagonalDirection.value !== "mixed") * 4},
    {value: 4, label: "Normal", prob: 6}
  ]);
  if (textureMode.value !== "diagonal") {
    noisyDiagonalDensity = {value: "n/a", label: "N/A"};
  }

  window.$fxhashFeatures = {
    "Aspect Ratio" : aspect_ratio.label,
    "Color Palette" : selected_palette.label,
    "Mode" : textureMode.label,
    "Noisy Diagonal Density" : noisyDiagonalDensity.label,
    "Noisy Diagonal Direction" : noisyDiagonalDirection.label,
    "Partial Flow Size" : partialFlowSize.label,
    "Partial Flow Structure" : partialFlowStructure.label,
  };
  console.log(window.$fxhashFeatures);

  canvas = createCanvas(...aspect_ratio.value, WEBGL);
  pixelDensity(1);
  shdr = new Shader();
  colors = parseHexStrings(selected_palette.value.palette);
  randomSeed(fxrand() * 1e8);
  console.log(random());
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
  return randitem(weighted_choices);
}

function noScale(x) {
  return x * width / 946;
}

function rect_wh(x, y, w, h) {
  return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
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

function partition_line(s, e, k) {
  let ps = [s,e];
  for (let i=0; i<k-1; i++) {
    ps.push(random(s,e));
  }
  return ps.sort((a,b) => a-b);
}

// random lines
function splitting_polys_lined(x, y, w, h) {
  if (random() < 0.5) {
    let n = floor(random(4,16));
    let top = partition_line(x, x+w, n);
    let bottom = top; //partition_line(x, x+w, n);
    let out = [];
    for (let i=0; i<n; i++) {
      out.push([[top[i],y],[top[i+1],y],[bottom[i+1],y+h],[bottom[i],y+h]]);
    }
    return out;
  }
  else {
    let n = floor(random(4,16));
    let left = partition_line(y, y+h, n);
    let right = left; //partition_line(y, y+h, n);
    let out = [];
    for (let i=0; i<n; i++) {
      out.push([[x,left[i]],[x,left[i+1]],[x+w,right[i+1]],[x+w,right[i]]]);
    }
    return out;
  }
}

function splitting_polys_diagonal(x, y, w, h, broken) {
  let large = 8;
  let n = floor(random(4,16));
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

function arc_points(xc, yc, start_angle, end_angle, radius, n) {
  let ps = [];
  for (let i=0; i<n; i++) {
    let angle = lerp(start_angle, end_angle, float(i) / (n-1));
    ps.push([xc + cos(angle) * radius, yc + sin(angle) * radius]);
  }
  return ps;
}

// apply warping to a polygon
function warp_polygon(poly) {
  let sc = 2;
  let new_poly = [];
  for (const [x,y] of poly) {
    new_poly.push([
      x + (noise(x/width*sc + 4553, y/width*sc + 5437)-0.5) * 100,
      y + (noise(x/width*sc + 8459, y/width*sc + 3128)-0.5) * 100
    ])
  }
  return new_poly;
}

function translate_polygon(poly, dx, dy) {
  return poly.map(x => [x[0]+dx,x[1]+dy]);
}

function polygonCentroid(arr) {
  var minX, maxX, minY, maxY;
  for (var i = 0; i < arr.length; i++) {
          minX = (arr[i][0] < minX || minX == null) ? arr[i][0] : minX;
          maxX = (arr[i][0] > maxX || maxX == null) ? arr[i][0] : maxX;
          minY = (arr[i][1] < minY || minY == null) ? arr[i][1] : minY;
          maxY = (arr[i][1] > maxY || maxY == null) ? arr[i][1] : maxY;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

function scale_polygon(poly, factor) {
  let c = polygonCentroid(poly);
  return poly.map(p => [(p[0]-c[0])*factor+c[0], (p[1]-c[1])*factor+c[1]]);
}

// concentric circles
function splitting_polys_circle(x, y, w, h) {
  let diag = dist(x,y,x+w,y+h);
  let k = floor(random(10,40));
  //let k = floor(random(5,20));
  let radius_step = diag / k;
  let radius_step_min = radius_step * 0.5;
  let radius_step_max = radius_step * 1.5;
  // top right corner
  // 1.5 PI -> 0
  let s, e, xc, yc;
  xc = random(x,x+w);
  yc = random(y,y+h);

  noiseSeed(random() * 1e8);

  let out = [];
  let radius = random(radius_step_min,radius_step_max);
  if (true) {
    radius = noScale(5);
  }
  while (radius < diag) {
    let step = random(radius_step_min,radius_step_max);
    s = random(0,2*PI);
    e = s + 1.99*PI; // 1.99

    /*
    segs = partition_line(0,2*PI,4);
    for (let i=0; i<4; i++) {
      s = segs[i];
      e = segs[i+1] - 0.25;
      let arc = arc_points(xc, yc, s, e, radius, 50).concat( arc_points(xc, yc, e, s, radius + step, 50) );
      //arc = warp_polygon(arc);
      out.push( arc );
    }
    */

    let arc = arc_points(xc, yc, s, e, radius, 50).concat( arc_points(xc, yc, e, s, radius + step, 50) );
    //arc = warp_polygon(arc);
    out.push( arc );

    radius += step;
  }
  return out;
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

function splitting_polys_circle_or_lined(x, y, w, h) {
  if (random() < 0.5) {
    return splitting_polys_circle(x, y, w, h);
  }
  return splitting_polys_lined(x, y, w, h);
}

function noise_curl(x, y, n, w) {
  // using noise space traverse for n steps
  // and then make it have a width of w
  let factor = 10;
  let sc = 0.75; //0.75; //1.5; //0.75;
  let step = noScale(2) * factor;
  n = n / factor;
  let left = [];
  let right = [];
  for (let i=0; i<n; i++) {
    let nval = noise(x/width*sc, y/width*sc);
    let angle = nval * 2 * PI;
    //angle = floor(nval * 8) / 8 * 2 * PI;
    let perp = angle + 0.5 * PI;
    x = x + cos(angle) * step;
    y = y + sin(angle) * step;
    left.push([x - cos(perp) * w, y - sin(perp) * w]);
    right.push([x + cos(perp) * w, y + sin(perp) * w]);
  } 
  return left.concat(right.reverse());
}

// function to fill up the space
function fill_polygon(border_poly, poly_func, niter) {
  let [x,y,w,h] = polygonBoundsXYWH(border_poly);
  let polys = [];
  let bounds = [];
  for (let i=0; i<niter; i++) {
    let t = (float(i)/niter) ** 0.5;
    let extra_w = w * 0.5;
    let extra_h = h * 0.5;
    let xh = random(x - extra_w, x+w + extra_w);
    let yh = random(y - extra_h, y+h + extra_h);
    poly = poly_func(xh, yh, t);

    if (poly !== undefined) {
      //check_poly = scale_polygon(poly,1.25);
      bb = rect_wh(...polygonBoundsXYWH(poly));
      any_intersection = false;
      for (let k=0; k<polys.length; k++) {
        if (intersect([bb], [bounds[k]]).length > 0) {
          if (intersect([poly], [polys[k]]).length > 0) {
            any_intersection = true;
            break;
          }
        }
      }
      if ((polys.length == 0) || (any_intersection === false)) {
        polys.push(poly);
        bounds.push(bb);
      }
    }
    //console.log(i, polys.length);
  }

  // filter polys by border
  let filtered_polys = [];
  for (const poly of polys) {
    let result = intersect([poly],[border_poly]);
    if (result.length > 0) {
      filtered_polys.push(result[0]);
    }
  }
  return filtered_polys;
}

// division functions
function intersection_divide(polys, splitter_func, num_iter, density, splitter_func_args) {
  if (splitter_func_args === undefined) {
    splitter_func_args = [];
  }
  for (let i=0; i<num_iter; i++) {
    let out = [];
    for (const poly of polys) {
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
    polys = [...out.filter(x => x !== undefined)];
    if (i > 0) {
      polys = polys.filter(x => random() < density);
    }
  }
  return polys;
}

//

// 
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

function make_drawing(polys, poly_colors, filter_prob) {
  if (poly_colors === undefined) {
    poly_colors = pick_poly_colors(polys, 0.05, 0.01, 0.01);
  }
  if (filter_prob === undefined) {
    filter_prob = 1;
  }
  for (let i=0; i<polys.length; i++) {
    if (true) {
      if (poly_colors[i] !== null) {
        fill(...poly_colors[i]);
      }
      else {
        noFill();
      }
      //console.log(polys[i])
      beginShape();
      for (const p of polys[i]) {
        vertex(...p);
      }
      endShape(CLOSE);
    }
  }
  return;
}

function draw() {
  background(parseHexStrings(selected_palette.value.background_color)[0]);
  stroke(parseHexStrings(selected_palette.value.stroke_color)[0]);

  translate(-width/2,-height/2);
  strokeWeight(noScale(1));

  let marg = noScale(50);
  border = rect_wh(marg, marg, width-2*marg, height-2*marg);

  var noise_curl_func = function(x, y, t) {
    let size = noScale(random(4,10)) * lerp(3,0.5,t);
    if (partialFlowSize.value === "large") {
      size = noScale(random(10,20)) * lerp(3,0.5,t);
    }
    return noise_curl(
      x,y, 
      random(100,500) / lerp(2,4,t),
      size); // 10,20 -- 4,10
  };
    
  if (textureMode.value == "diagonal_mask") {

    mask_iters = randitem([2,3]);

    polys_a = intersection_divide(
      [border], splitting_polys_lined, mask_iters, 1);
    poly_colors_a = pick_poly_colors(polys_a, 0.1, 0.05, 0.05);

    polys_b = [border];
    poly_colors_b = parseHexStrings(selected_palette.value.background_color);

    sections = intersection_divide([border], splitting_polys_diagonal, 3, 1.);

    out_colors = [];
    out = [];
    for (const section of sections) {

      if (random() < 0) {
        polys = intersection_divide(
          [section], splitting_polys_diagonal, 1, 1.);
      }
      else {
        polys = [section];
      }

      let backdrop_polys, backdrop_colors;
      if (random() < 0.5) {
        backdrop_polys = polys_a;
        backdrop_colors = poly_colors_a;
      }
      else {
        backdrop_polys = polys_b;
        backdrop_colors = poly_colors_b;
      }

      for (const poly of polys) {

        for (let i=0; i<backdrop_polys.length; i++) {
          let result = intersect([poly], [backdrop_polys[i]]);
          if (result.length > 0) {
            out = out.concat(result);
            out_colors = out_colors.concat(
              result.map(x => backdrop_colors[i]));
          }
        }
      }
    }
    
    make_drawing(out, out_colors);
  }
  else if (textureMode.value == "diagonal") {

    // use the backdrop method
    backdrop_polys = intersection_divide(
      [border], splitting_polys_lined, 2, 1);
    backdrop_colors = pick_poly_colors(backdrop_polys, 0.1, 0.05, 0.05);
    

    if (noisyDiagonalDirection.value === "vertical") {
      sections = intersection_divide(
        [border], splitting_polys, noisyDiagonalDensity.value, 1., [1]);
    }
    else if (noisyDiagonalDirection.value === "horizontal") {
      sections = intersection_divide(
        [border], splitting_polys, noisyDiagonalDensity.value, 1., [0]);
    }
    else if (noisyDiagonalDirection.value === "mixed") {
      sections = intersection_divide(
        [border], splitting_polys, noisyDiagonalDensity.value, 1.);
    }
    else {
      console.log("FATAL ERROR");
    }
    
    out = [];
    out_colors = [];
    for (section of sections) {
      polys = intersection_divide(
        [section], splitting_polys_diagonal, 2, 1., [true]); // 2

      if (random() < 0.75) {
        for (const poly of polys) {
          for (let i=0; i<backdrop_polys.length; i++) {
            let result = intersect([poly], [backdrop_polys[i]]);
            if (result.length > 0) {
              out = out.concat(result);
              out_colors = out_colors.concat(
                result.map(x => backdrop_colors[i]));
            }
          }
        }
      }
      else {
        out = out.concat(polys);
        out_colors = out_colors.concat(
          pick_poly_colors(polys, 0.05, 0.05, 0.5));
      }
    }

    //polys = intersection_divide(segs, splitting_polys_diagonal, 2, 1., [true]);
    //poly_colors = pick_poly_colors(polys, 0.05, 0.05, 0.5);
    make_drawing(out, out_colors);
  }
  else if (textureMode.value == "partial_flow") {
    polys = intersection_divide([border], splitting_polys_lined, 3, 1);
    //polys = intersection_divide([border], splitting_polys_circle, 2, 1);
    poly_colors = pick_poly_colors(polys, 0.1, 0.05, 0.05);

    sections = [];
    if (partialFlowStructure.value === "line") {
      sections = intersection_divide([border], splitting_polys_lined, 1, 1);
    }
    else if (partialFlowStructure.value === "noisy") {
      sections = intersection_divide([border], splitting_polys, 4, 1);
    }
    else if (partialFlowStructure.value === "circle") {
      sections = intersection_divide([border], splitting_polys_circle, 1, 1);
    }
    else if (partialFlowStructure.value === "diagonal") {
      sections = intersection_divide([border], splitting_polys_diagonal, 2, 1);
    }
    else {
      console.log("FATAL ERROR");
    }

    noiseSeed(random() * 1e8); // make noiseSeed deterministic

    out_colors = [];
    out = [];
    for (const section of sections) {

      if (multipleFlows.value) {
        noiseSeed(random() * 1e8);
      }

      if (random() < 0.75) {
        curls = fill_polygon(section, noise_curl_func, 1000);
      }
      else {
        curls = [section];
      }

      for (const curl of curls) {
        for (let i=0; i<polys.length; i++) {
          let result = intersect([curl], [polys[i]]);
          if (result.length > 0) {
            out = out.concat(result);
            out_colors = out_colors.concat(result.map(x => poly_colors[i]));
          }
        }
      }

    }

    make_drawing(out, out_colors);
  }

  fill(0);
  shdr.draw(false, false);
  
  fxpreview();
  noLoop();
}

