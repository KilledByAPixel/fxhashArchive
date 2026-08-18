function choose(options, weights) {
  if (weights !== undefined) {
    options = options.map((op,i) => Array(weights[i]).fill(op)).flat();
  }
  return options[floor(random(options.length-1e-4))];
}

function hexToRgb(hex) {
  var x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(x[1],16),parseInt(x[2],16), parseInt(x[3],16)];
}

function parseHexStrings(hs) {
  let hexs = []
  hs = hs.replace(/\s/g, '');
  for (let i=0; i<hs.length/6; i++) {
    hexs.push( hexToRgb(hs.substring(i*6,(i+1)*6)) );
  }
  return hexs;
}

function relscale(x) {
  return x * width / 4000;
}

function invscale(x) {
  return x * 4000 / width;
}

let palettes = {
  "Cobalt Violet": "ffae43 ea432c 524e9c f0a1a1 e9dcad 143331 ffc000 524e9c 524e9c 524e9c 524e9c 524e9c 524e9c 524e9c 524e9c", // Cobalt Violet
  "Titan Buff": "c91619 fdecd2 f4a000 4c2653 eab700 e64818 2c6393 eecfca eecfca eecfca eecfca eecfca eecfca eecfca eecfca eecfca", // Titan Buff
  "Titanium White": "1767d2 ffffff f9ab00 212121 f4b232 f2dbbd 01799c e93e48 0b1952 006748 ed817d ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff ffffff", // Titanium White
  "Ultramarine": "8bc9c3 ffae43 ea432c 524e9c ed555d fffcc9 41b797 eda126 7b5770 f4b232 f2dbbd 01799c e93e48 0b1952 006748 ed817d 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952 0b1952", // Ultramarine
  "Ultramarine Violet": "271f47 e7ceb5 e9dcad 143331 ffc000 e3937b d93f1d 090d15 e6cca7 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47 271f47", // Ultramarine Violet
  "Sap Green": "1d3b1a eb4b11 e5bc00 f29881 dbdac9 d55a3a 2a5c8a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a 1d3b1a", // Sap Green
  "Veridian": "004996 567bae ff4c48 ffbcb3 e9dcad 143331 ffc000 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331 143331", // Veridian
  "Neutral Gray": "99cb9f cfb610 d00701 dba78d 2e2c1d bfbea2 d2cfaf ff5937 f6f6f4 f6f6f4 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d 2e2c1d", // Neutral Gray
  "Lead White": "f4b232 f2dbbd 01799c e93e48 0b1952 006748 ed817d ec5526 f4ac12 9ebbc1 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2 f7f4e2", // Lead White
  "Cremnitz White": "5399b1 f4e9d5 de4037 ed942f 4e9e48 7a6e62 e5dfcf 151513 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5 f4e9d5", // Cremnitz White
  //"Cremnitz White III": "ec2f28 f8cd28 1e95bb fbaab3 fcefdf", // Cremnitz White III
  "Indigo": "adb100 e5f4e9 f4650f 4d6838 cb9e00 689c7d e2a1a8 151c2e", // Indigo
  "Van Dyke Brown": "e85b30 ef9e28 c6ac71 e0c191 3f6279 ee854e 180305", // Van Dyke Brown -- Burnt Umber
  "Black on White" : "131313 eeeeee",
  "White on Black" : "eeeeee 131313",
  "Pyrrole Red" : "dad6cd e3dad2 228345 e85b30 ef9e28 c6ac71 e0c191 3f6279 180305 e02424", // Pyrrole Red
  "Cremnitz White II" : "135ce1 ffcd46 fa4e31 135ce1 ffcd46 fa4e31 131313 eee9db", // Cremnitz White III
  "Indanthrone Blue" : "eeeeee FF514E d9c67a 9dc35e 14a160 ffb7c5 30d5c8 2c6393"
};

let palette_probs = {
  "White on Black": 2,
  "Cobalt Violet" : 6,
  "Titan Buff" : 6,
  "Titanium White": 6,
  "Ultramarine": 6,
  "Ultramarine Violet": 6,
  "Sap Green": 6,
  "Veridian": 6,
  "Neutral Gray": 6,
  "Lead White": 6,
  "Cremnitz White": 6,
  "Indigo": 6,
  "Van Dyke Brown": 6,
  "Black on White": 6,
  "Pyrrole Red": 6,
  "Cremnitz White II": 6,
  "Indanthrone Blue" : 6
};

var colors, param, active_color, background_color, canvas_size;
var shader_passes_global = 2;
var aspect = 1.41;
var canvas = null;

function setup() {

  /*
  // disable control
  let possible_pass = new URLSearchParams(window.location.search).get('pass');
  if ((possible_pass !== undefined) && (possible_pass !== null)) {
    shader_passes_global = possible_pass;
  }
  */

  let possible_size = new URLSearchParams(window.location.search).get('size');
  canvas_size = 1500;
  if ((possible_size !== undefined) && (possible_size !== null)) {
    canvas_size = parseInt(possible_size);
  }
  canvas = createCanvas(canvas_size, canvas_size * aspect, WEBGL);
  pixelDensity(1);
  randomSeed(fxrand() * 94726);


  let palette_names = Array.from(Object.keys(palette_probs));
  let probs = Array.from(palette_names.map(k => palette_probs[k]));

  //console.log(JSON.stringify(palette_names), JSON.stringify(probs));

  let color_name = choose(palette_names, probs);
  colors = parseHexStrings(palettes[color_name]);
  active_color = choose(colors);

  let all_keys = ["mode","stroke_max","n","num_nodes","threshold","levels","nodes_per_level","shifts","sloppy", "doShorten"];
  let params = [

    {mode: "Paint Drips", stroke_max: 200, n: 1000, density_label: "Extremely Crowded"},
    {mode: "Paint Drips", stroke_max: 800, n: 200, density_label: "Average"},

    {mode: "Triangulated", stroke_max: 200, num_nodes: 15, threshold: false, density_label: "Low"},
    {mode: "Triangulated", stroke_max: 400, num_nodes: 15, threshold: false, density_label: "Low"},
    {mode: "Triangulated", stroke_max: 800, num_nodes: 15, threshold: false, density_label: "Low"},

    {mode: "Triangulated", stroke_max: 200, num_nodes: 45, threshold: true, density_label: "Average"},
    {mode: "Triangulated", stroke_max: 400, num_nodes: 45, threshold: true, density_label: "Average"},
    {mode: "Triangulated", stroke_max: 600, num_nodes: 45, threshold: true, density_label: "Average"},
    {mode: "Triangulated", stroke_max: 200, num_nodes: 120, threshold: true, density_label: "Dense"},

    {mode: "Triangulated Levels", stroke_max: 100, levels: 80, nodes_per_level: 10, shifts: true, density_label: "Crowded"},
    {mode: "Triangulated Levels", stroke_max: 200, levels: 20, nodes_per_level: 20, shifts: true, density_label: "Average"},
    {mode: "Triangulated Levels", stroke_max: 200, levels: 10, nodes_per_level: 10, shifts: false, density_label: "Low"},
    {mode: "Triangulated Levels", stroke_max: 200, levels: 10, nodes_per_level: 10, shifts: true, density_label: "Low"},
    {mode: "Triangulated Levels", stroke_max: 100, levels: 40, nodes_per_level: 10, shifts: false, density_label: "Dense"},

    {mode: "Random Connections", stroke_max: 200, num_nodes: 10, n: 200, density_label: "Low"},
    {mode: "Random Connections", stroke_max: 800, num_nodes: 100, n: 50, density_label: "Dense"},
    {mode: "Random Connections", stroke_max: 800, num_nodes: 8, n: 100, density_label: "Low"},
    {mode: "Random Connections", stroke_max: 50, num_nodes: 10, n: 400, density_label: "Low"},

    {mode: "Vertical Strokes", stroke_max: 200, n: 200, density_label: "Average"},
    {mode: "Vertical Strokes", stroke_max: 400, n: 100, density_label: "Average"},
    {mode: "Vertical Strokes", stroke_max: 600, n: 100, density_label: "Average"},

  ];

  let stroke_names = {50: "Really Tiny", 100: "Tiny", 200: "Small", 400: "Average", 600: "Large", 800: "Jumbo"};

  //params = params.filter(x => x.mode === "Random Connections");
  param = choose(params);

  // pick sloppy / misaligned if appropriate
  if ((param.mode === "Triangulated") || (param.mode === "Triangulated Levels")) {
    param.sloppy = random() < 0.1; // 10 % chance of sloppy
    param.doShorten = (["Dense","Crowded"].includes(param.density_label)) && (random() < 0.25); // 10% chance of doing shortening
  }

  // pick shake and spray
  param.shake = choose([{value: 0.004, label: "Low"}, {value: 0.01, label: "High"}], [8,2]);
  param.spray = choose([{value: 0.435, label: "Low"}, {value: 0.475, label: "High"}], [2,8]);

  if ((param.mode === "Random Connections") && (param.stroke_max <= 200)) {
    param.shake = {value: 0.001, label: "Nearly Imperceptible"};
  }

  // fill in non-applicable features
  for (const key of all_keys) {
    if (!param.hasOwnProperty(key)) {
      param[key] = "n/a";
    }
  }

  window.$fxhashFeatures = {
    "Density" : param.density_label,
    "Filter Trianglulation" : param.threshold,
    "Horizontal Shifts" : param.shifts,
    "Incomplete Strokes" : param.doShorten,
    "Mode" : param.mode,
    "Misaligned" : param.sloppy,
    "Palette" : color_name,
    "Spray" : param.spray.label,
    "Stroke Size" : stroke_names[param.stroke_max],
    "Tremble" : param.shake.label,
  }
  console.log(window.$fxhashFeatures);
  //console.log(param);
}

function apply_shader(spray_amount, shake_amount) {

  const vertex_shader = `#version 300 es
in vec3 coord;
out vec2 textureCoord;
void main() {
  textureCoord = coord.xy;
  gl_Position = vec4(coord.xy * 2.0 - 1.0, coord.z, 1.0);
}`;

  const fragment_shader = `#version 300 es
precision mediump float;
in vec2 textureCoord;
out vec4 fragColor;
uniform float seed;
uniform float spray_amount;
uniform float shake_amount;
uniform sampler2D pixels;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately/54024653#54024653
// HSV -> RGB conversion
//
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float domain_warp_3(vec2 coord, float scale, float offset) {
  return snoise(vec2(
    snoise(vec2(
      snoise(coord * scale + offset + 123.),
      snoise(coord * scale + offset + 543.)
    )),
    snoise(vec2(
      snoise(coord * scale + offset + 124.),
      snoise(coord * scale + offset + 544.)
    ))
  ));
}

float domain_warp_4(vec2 coord, float scale, float offset) {
  return snoise(vec2(
    snoise(vec2(
      snoise(vec2(
        snoise(coord * scale + offset + 371.),
        snoise(coord * scale + offset + 888.)
      )),
      snoise(vec2(
        snoise(coord * scale + offset + 463.),
        snoise(coord * scale + offset + 219.)
      ))
    )),
    snoise(vec2(
      snoise(vec2(
        snoise(coord * scale + offset + 333.),
        snoise(coord * scale + offset + 255.)
      )),
      snoise(vec2(
        snoise(coord * scale + offset + 744.),
        snoise(coord * scale + offset + 533.)
      ))
    ))
  ));
}

void main() {
  vec2 coord = textureCoord;
  float x = domain_warp_4(coord, 40., seed + 12.);
  x += domain_warp_4(coord, 20., seed + 14.);
  x += domain_warp_4(coord, 10., seed + 13.);

  coord.x = (coord.x + domain_warp_3(vec2(coord.y),1.,seed + 99.) * shake_amount); // 0.01, 0.004

  // using 0.5 instead of 0.45 makes big difference
  // 0.475, 0.435
  float pixel_offset = domain_warp_3(coord, 8., seed + 11.) * max(((domain_warp_4(coord,4.,seed)+1.)*spray_amount)-0.75, 0.);
  vec4 pixel = texture(pixels, coord + pixel_offset);  
  vec3 color_offset = hsv2rgb(vec3(0., 0., x * 0.05));
  fragColor = vec4(pixel.xyz - color_offset, 1.);
}`;

  
  let shader_instance = createShader(vertex_shader,fragment_shader);
  shader(shader_instance);
  shader_instance.setUniform('seed', random(434));
  shader_instance.setUniform('pixels', get());
  shader_instance.setUniform('spray_amount', spray_amount);
  shader_instance.setUniform('shake_amount', shake_amount);
  rect(0,0,width,height); // 0,0,1,1
  image(get(),0,0);
  
}

function boundsXYWH(ps) {
  let minx = min(...ps.map(p => p[0]));
  let maxx = max(...ps.map(p => p[0]));
  let miny = min(...ps.map(p => p[1]));
  let maxy = max(...ps.map(p => p[1]));
  return [minx, miny, (maxx - minx), (maxy - miny)];
}

function random_point(margin) {
  margin = margin === undefined ? 0 : margin;
  return [random(margin,width-margin), random(margin,height-margin)];
}

function random_bounded_point(x, y, w, h) {
  return [random(x,x+w), random(y,y+h)];
}

function lerp2d(a, b, w) {
  return [lerp(a[0],b[0],w), lerp(a[1],b[1],w)];
}

function project(p, angles, mags) {
  for (let i=0; i<angles.length; i++) {
    p = [p[0] + cos(angles[i]) * mags[i], p[1] + sin(angles[i]) * mags[i]];
  }
  return p;
}

function brushstroke(a, b, w, emp, doShorten) {
  emp = emp === undefined ? choose(colors) : emp;
  let angle = atan2(b[1]-a[1], b[0]-a[0]);
  let perp = angle + 0.5 * PI;

  doShorten = doShorten === undefined ? false : doShorten;
  if (doShorten) {
    let shorten = 0.25;
    let na = lerp2d(a, b, shorten);
    let nb = lerp2d(a, b, 1. - shorten);
    [a,b] = [na,nb];
  }
  

  noFill();
  stroke(0);
  strokeWeight(relscale(4));
  for (let i=0; i<ceil(invscale(w/2)); i++) {
    stroke(...(random() < 0.25 ? choose(colors) : emp));
    let p = random(-1,1);
    let offset = -sqrt((w/2)**2 - (p*w/2)**2) * 0.8;
    let partial = lerp2d(project(a,[perp],[p*w*0.5]), project(b,[perp],[p*w*0.5]), random()**0.5);
    // switch this to a slightly curved line
    let start = project(a,[perp,angle],[p*w*0.5,offset]);
    let end = partial;
    
    //line(...start,...end);
    
    let control = project(lerp2d(start, end, random(0.3,0.7)), [perp], [choose([-1,1]) * random(0.01,0.05) * w]);
    bezier(...start, ...control, ...control, ...end);
  }
}

function sorted_values(generator, n) {
  let values = [...Array(n)].map(generator);
  values.sort((a,b) => (a-b));
  return values.reverse();
}

function center_points(ps) {
  let [x,y,w,h] = boundsXYWH(ps);
  let cx = (width/2 - w/2) - x;
  let cy = (height/2 - h/2) - y;
  ps = ps.map(p => [p[0] + cx, p[1] + cy]);
  //ps.sort((a,b) => (a[1]-b[1]));
  return ps;
}

function group_array(arr, k) {
  return [...Array(arr.length / k)].map((x,i) => arr.slice(i*3,(i+1)*3));
}

function array_min(arr) {
  let minval = null;
  for (const v of arr) {
    if ((minval === null) || (v < minval)) {
      minval = v;
    }
  }
  return minval;
}

function array_max(arr) {
  let maxval = null;
  for (const v of arr) {
    if ((maxval === null) || (v > maxval)) {
      maxval = v;
    }
  }
  return maxval;
}

function array_median(arr) {
  return arr.sort((a,b) => a-b)[floor(arr.length / 2)];
}

function seglens(ps) {
  return [...Array(ps.length)].map((x,i) => dist(...ps[i],...ps[(i+1)%ps.length]));
}

function draw() {

  background_color = colors[colors.length-1];
  colors = [...[...new Set(colors.map(x => JSON.stringify(x)))].map(x => JSON.parse(x))];

  background(...background_color);
  translate(-width/2,-height/2);
  noStroke();

  if (param.mode === "Triangulated") {

    let ps = [...Array(param.num_nodes)].map(x => random_point(width/8));
    ps = center_points(ps);
    
    emp = undefined;
    let delaunay = new Delaunator(ps.flat());
    let triangles = group_array(Array.from(delaunay.triangles).map(i => ps[i]), 3);

    if (param.threshold === true) {
      // filtering the top 25% largest triangles
      let max_edges = triangles.map(t => array_max(seglens(t)));
      let threshold = max_edges.sort((a,b) => a-b)[floor(3 * triangles.length/4)];
      triangles = triangles.filter(t => seglens(t).every(e => e < threshold));
      triangles = group_array(center_points(triangles.flat()), 3);
    }

    for (let i=0; i<triangles.length; i++) {
      let pss = triangles[i];
      if ((emp === undefined) || (random() < 1.0)) {
        emp = choose(colors);
      }
      let num_edge_strokes = 10;
      let sizval = sorted_values((x) => relscale(lerp(10,param.stroke_max,random()**8)), num_edge_strokes);
      for (let i=0; i<num_edge_strokes; i++) {
        if (param.sloppy === true) {
          let damount = random() < 0.1 ? 400 : 0;
          brushstroke(
            choose(pss).map(x => x + relscale(random(-damount,damount))),
            choose(pss).map(x => x + relscale(random(-damount,damount))),
            sizval[i],
            emp, 
            param.doShorten); // slight distortion on the shapes
        }
        else {
          brushstroke(choose(pss), choose(pss), sizval[i], emp, param.doShorten);
        }
      }
    }
  }
  else if (param.mode === "Triangulated Levels") {

    let levels = param.levels;
    let amount = param.nodes_per_level;
    let vals = sorted_values((x) => random(width/8,height-width/8), levels);
    let choices = [...Array(levels-1)].map((x,i) => [vals[i],vals[i+1]]);
    let xchoices = [...Array(levels)].map(x => [random_point(width/8)[0],random_point(width/8)[0]]);

    let ps = null;
    if (param.shifts) {
      ps = [...Array(amount*choices.length)].map((x,i) => [random(...xchoices[floor(i/amount)]),choose(choices[floor(i/amount)])]);
    }
    else {
      ps = [...Array(amount*choices.length)].map((x,i) => [random_point(width/8)[0],choose(choices[floor(i/amount)])]);
    }
    
    emp = undefined;
    let delaunay = new Delaunator(ps.flat());
    let triangles = group_array(Array.from(delaunay.triangles).map(i => ps[i]), 3);

    let threshold = array_max([...choices.map(x => abs(x[1]-x[0]))]) * 1.4;
    //let threshold = array_median(triangles.map(t => array_max(seglens(t))));
    //let threshold = 1e6;
    //let max_edges = triangles.map(t => array_max(seglens(t)));
    //let threshold = max_edges.sort((a,b) => a-b)[floor(7 * triangles.length/8)];
    
    const calc_min_height = (ps) => min(ps[0][1],min(ps[1][1],ps[2][1]));
    triangles = triangles.sort((a,b) => calc_min_height(a) - calc_min_height(b));
    triangles = triangles.filter(t => seglens(t).every(e => e <= threshold));
    //triangles = triangles.filter(t => random() < 0.75);
    triangles = group_array(center_points(triangles.flat()), 3);

    for (const pss of triangles) {
      if ((emp === undefined) || (random() < 0.025)) {
        emp = choose(colors);
      }
      let use_emp = random() < 0.25 ? choose(colors) : emp; // also pick randomly sometimes
      let num_edge_strokes = 10;
      let sizval = sorted_values((x) => relscale(lerp(10,param.stroke_max,random()**8)), num_edge_strokes);
      for (let i=0; i<num_edge_strokes; i++) {
        if (param.sloppy === true) {
          let damount = random() < 0.1 ? 400 : 0;
          brushstroke(
            choose(pss).map(x => x + relscale(random(-damount,damount))),
            choose(pss).map(x => x + relscale(random(-damount,damount))),
            sizval[i],
            use_emp,
            param.doShorten); // slight distortion on the shapes
        }
        else {
          brushstroke(choose(pss), choose(pss), sizval[i], use_emp, param.doShorten);
        }
      }
    }
  }
  else if (param.mode === "Random Connections") {

    let ps = [...Array(param.num_nodes)].map(x => random_point(width/8));    
    ps = center_points(ps);

    let n = param.n;
    let sizval = sorted_values((x) => relscale(lerp(10,param.stroke_max,random()**8)), n);
    for (let i=0; i<n; i++) {      
      brushstroke(choose(ps), choose(ps), sizval[i]);
    }
  }
  else if (param.mode === "Vertical Strokes") {

    for (let i=0; i<param.n; i++) {
      let [px,py] = random_point(width/8);
      brushstroke([px,py], [px+random(-50,50),random_point(width/8)[1]], relscale(lerp(40,param.stroke_max,random()**4)));
    }
  }
  else if (param.mode === "Paint Drips") {

    let n = param.n; // 100, 1000
    let sizes = [...Array(n)].map(x => relscale(lerp(20,param.stroke_max,random()**6))); // 200, 1000
    sizes.sort((a,b) => (a-b));
    sizes = sizes.reverse();
    
    for (let i=0; i<n; i++) {
      let emp = choose(colors);
      fill(...emp);
      let ss = sizes[i];
      let x = random(width-ss);
      let y = random(ss+width/16,height-height/6);
      let dd = ceil(invscale(ss / 2));
      for (let j=0; j<dd; j++) {
        fill(...(random() < 0.25 ? choose(colors) : emp));
        let ww = relscale(random(5,10));
        let hh = relscale(lerp(40,1000,random()**4)); //andom(10,ss * 4);
        let xh = random(x,x+ss);
        let dc = map(xh, x, x+ss, -1, 1) * ss / 2;
        let offset = -sqrt((ss/2)**2 - dc*dc);
        rect(xh,y+offset,ww,hh);
      }
    }
  }
  
  noStroke();
  border = width/16;
  fill(...background_color);
  rect(0,0,border,height);
  rect(width-border,0,border,height);
  rect(0,0,width,border);
  rect(0,height-border,width,border);

  noStroke();
  fill(0);
  let shader_passes = shader_passes_global;
  for (let i=0; i<shader_passes; i++) {
    apply_shader(param.spray.value, param.shake.value);
  }
  
  fxpreview();
  noLoop();

  //export_as_image();
}

p5.RendererGL.prototype._initContext = function() {
  this.drawingContext = false ||
    this.canvas.getContext('webgl2', this.attributes) ||
    this.canvas.getContext('webgl', this.attributes) ||
    this.canvas.getContext('experimental-webgl', this.attributes);
};

function export_as_image() {
  let features = window.$fxhashFeatures;
  let name = Object.keys(features).sort().map(
    (k,i) => k.split(' ').join('_') + "=" + features[k].toString()).join("&");
  name += "&hash=" + fxhash + "&size=" + canvas_size.toString();
  saveCanvas(fxhash, 'jpg');
}