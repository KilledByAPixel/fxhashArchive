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
  }
];

var selected_palette, iter_num, aspect_ratio, density, circle_ratio;

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
  
  // pick the number of iterations
  iter_num = featureSelection([
    {value: 3, label: "3", prob: 2},
    {value: 4, label: "4", prob: 6},
    {value: 5, label: "5", prob: 2}
  ]);

  // pick the aspect ratio
  aspect_ratio = featureSelection([
    //{value: [canvas_size*1.5,canvas_size], label: "Landscape", prob: 1},
    {value: [canvas_size,canvas_size*1.3125], label: "Portrait", prob: 8},
    {value: [canvas_size,canvas_size], label: "Square", prob: 2},
  ]);

  // pick the circle / rectangle ratio
  circle_ratio = featureSelection([
    {value: 1.0, label: "1.0", prob: 2},
    {value: 0.75, label: "0.75", prob: 3},
    //{value: 0.5, label: "0.5", prob: 1},
    {value: 0.25, label: "0.25", prob: 5}
  ]);

  // pick the density percentage
  density = featureSelection([
    {value: 0.85, label: "default", prob: (circle_ratio.label !== "1.0") * 7},
    //{value: 0.65, label: "sparse", prob: 1},
    {value: 0.98, label: "dense", prob: 3}
  ]);

  // enable or disable small radius
  center_fill_circle = featureSelection([
    {value: true, label: "true", prob: 4},
    {value: false, label: "false", prob: 6}
  ]);
  

  window.$fxhashFeatures = {
    "Aspect Ratio" : aspect_ratio.label,
    "Center Fill Circle" : center_fill_circle.label,
    "Circle Ratio" : circle_ratio.label,
    "Color Palette" : selected_palette.label,
    "Density" : density.label,
    "Recursion Depth" : iter_num.label,
  };
  console.log(window.$fxhashFeatures);

  canvas = createCanvas(...aspect_ratio.value, WEBGL);
  pixelDensity(1);
  shdr = new Shader();
  colors = parseHexStrings(selected_palette.value.palette);
  randomSeed(fxrand() * 1e8);
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

// concentric circles
function splitting_polys(x, y, w, h) {
  let diag = dist(x,y,x+w,y+h);
  let k = floor(random(5,10));
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
  if (center_fill_circle.value) {
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


function draw() {
  background(parseHexStrings(selected_palette.value.background_color)[0]);
  stroke(parseHexStrings(selected_palette.value.stroke_color)[0]);

  translate(-width/2,-height/2);
  strokeWeight(noScale(1));

  let margin = width / 16;
  let bound = rect_wh(margin, margin, width-2*margin, height-2*margin);
  polys = [bound];
  for (let i=0; i<iter_num.value; i++) {
    out = [];
    for (const poly of polys) {
      if (random() < circle_ratio.value) {
        splitter = splitting_polys(...polygonBoundsXYWH(poly));
      }
      else {
        splitter = splitting_polys_lined(...polygonBoundsXYWH(poly));
      }

      for (const s of splitter) {
        try {
          let result = intersect([s], [poly]);
          if (result.length) {
            out = out.concat(result);
          }
        }
        catch {

        }
      }
    }
    polys = [...out.filter(x => x !== undefined)];
    // random drop out
    if (i > 0) {
      polys = polys.filter(x => random() < density.value); // 0.95 , 0.85
    }
  }


  current_color = randitem(colors);
  noFill();
  for (const poly of polys) {
    if (random() < 0.05) {
      current_color = randitem(colors);
    }
    fill(current_color);
    if (random() < 0.05) {
      fill(...randitem(colors));
    }

    //noFill();
    beginShape();
    for (const p of poly) {
      vertex(...p);
    }
    endShape(CLOSE);
  }

  fill(0);
  shdr.draw(false, false);
  
  fxpreview();
  noLoop();
}

