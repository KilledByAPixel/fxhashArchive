
let paper;
let theShader;
let art;
function preload(){
  theShader = loadShader('shader.vert', 'shader.frag');
}
let base_colors = [ 
  "#E0DDD1",
  "#726c5d",
  "#392b24",
];
let palettes = [ 
  [
    "#FFEA92",
    "#FFEB36",
    "#F4BA00",
    "#FF6EA6", 
    "#FF0D81", 
    "#FF0000",
    "#00AF57",
    "#D7C7DE",
    "#D0B3F4",
  ],
  [
    "#EF6100",
    "#EF6100",
    "#FF9D00",
    "#FFC100",
    "#0070F6",
    "#D7C7DE",
    "#D0B3F4",
  ],
  [ 
    "#D0B3F4",
    "#FF9D00",
    "#EF6100",
    "#DCEF25",
    "#0070F6",
    "#00AF57",
    "#FF0000",
  ],
  [ 
    "#A4ECFF", 
    "#8461C9",
    "#D0B3F4",
    "#FF80D2",
    "#FFEB36",
    "#FF9D00",
    "#EF6100",
    "#598200",
    "#DCEF25",
    "#FF0097",
    "#0070F6",
    "#00AF57",
    "#FF0000",
  ],
];
let cols; 
let n_lines,chai_res, w, zoom, x, y, where_we_are_going, where_we_left_off, size, buggy;
let paths = [];
let lines = [];
let rotation;

function setup() {
  randomSeed(fxrand()*1000000);
  setAttributes('antialias', true);
  setAttributes('perPixelLighting', true);
  size = windowWidth > windowHeight ? windowHeight : windowWidth;
  size *= 0.9;
  createCanvas(size, size, WEBGL);
  pd = min(displayDensity(),2);
  artsize = size;
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    pd = 1;
    artsize /= 2;
  }
  pixelDensity(pd);
  noStroke();
  art = createGraphics(size,size,WEBGL);
  paper = createGraphics(2060,2060);
  paper.background("#E0DDD1");
  paper.noStroke();
  paper.strokeJoin(ROUND);
  paper.noFill();

  chai_res = 5;
  cols = base_colors.concat(palettes[floor(random(palettes.length))]);
  if (random() < 0.1) {
    cols = base_colors.concat(["#FF0000"]);
  }
  zoom = [random(0.15,0.3),random(0.7,0.85)];
  n_lines = random([17,30,45]);
  let n_paths = random([6,10,15,21,30]);
  buggy = random([0.01,0.05,0.20,0.05]); //𓆣
  lines = base_lines(lines, n_lines);
  for (let i = 0; i < n_paths; i++) {
    let p_obj = {
      col: random(cols),
      path: add_path(),
    }
    paths.push(p_obj);
  }
  for (let i = 0; i < 3; i++) {
    let p_obj = {
      col: color("#E0DDD1"),
      path: add_path(),
    }
    paths.push(p_obj);
  }

  draw_final()
  rotation = floor(random(4))*PI/2;
}

function draw() {
  rotate(rotation);
  clear();
  background(255,0,255);
  art.clear();

  art.shader(theShader);
  theShader.setUniform('tex0', paper);
  theShader.setUniform('u_resolution', [art.width,art.height]);
  theShader.setUniform('z', zoom);
  art.rect(0,0,width,height);

  if (frameCount == 2) {
    fxpreview();
  }

  image(art,-width/2,-height/2,width,height);
}

function draw_final() {
  for (let p of paths) {
    let st = 5.8-chai_res;
    paper.strokeWeight(st);
    p.col = color(p.col);
    paper.stroke(p.col);
    let chai_paths = []; 
    let n = random([10,30,60]); 
    let off = n/15; 
    if (chai_res == 0) n = 1;
    if (p.path.length > 0) {
      for (let k = 0; k < n; k++) {
        let new_p = [];
        new_p = p.path.slice();
        for (let i = 0; i < p.path.length-1; i++) {
          new_p[i].add(random(-off,off),random(-off,off));     //use Gaussian distribution?!
        }
        new_p = chaikin(new_p, 0.25, chai_res)
        chai_paths.push(new_p);
      }
  
      for (let k = 0; k < chai_paths.length; k++) {
        if (random() < 0.1) {
          paper.strokeWeight(random(5.5,15.5)-chai_res);
        } else {
          paper.strokeWeight(st);
        }
        paper.beginShape();
        for (let i = 0; i < chai_paths[k].length; i++) {
          paper.vertex(chai_paths[k][i].x, chai_paths[k][i].y);
        }
        paper.endShape();
      }
    }
  }
}

function trace_line(x,y,n) {
  lins = lines.slice();
  x1 = x;
  y1 = y;

  let boundaries = [100,1960];
  if (random() < 0.2) {
    boundaries = [-200,2260];
  }

  let passed_intersections = [];
  let tracers = [];
  for (let i = 0; i < n; i++) {
    let intersections = [];
    for (let l of lins) {
      if (l != where_we_are_going && l != where_we_left_off) {
        let x = (l.b - where_we_are_going.b) / (where_we_are_going.a - l.a);
        let y = where_we_are_going.a * x + where_we_are_going.b;
        if (x > boundaries[0] && x < boundaries[1] && y > boundaries[0] && y < boundaries[1]) { 
          intersections.push({p:createVector(x,y),l:l});
        }
      }
    }

    let closest;
    let close_points = [];
    for (let j = 0; j < 5; j++) {
      let closest_dist = 1000000;
      for (let i of intersections) {
        let dist = p5.Vector.dist(i.p,createVector(x,y));
        if (dist < closest_dist && !close_points.includes(i) && !passed_intersections.includes(i)) {
          closest_dist = dist;
          closest = i;
        }
      }
      close_points.push(closest);
    }

    
    let next_point;
    if (close_points.length == 0 || intersections.length == 0) {
      break;
    } else {
      next_point = random(close_points);
      passed_intersections.push(next_point.p);
      let trace = createVector(next_point.p.x,next_point.p.y);
      tracers.push(trace);
      where_we_left_off = where_we_are_going;
      where_we_are_going = next_point.l;
      x1 = next_point.p.x;
      y1 = next_point.p.y;
      if (random() < 1) {      
        lins.splice(lins.indexOf(where_we_left_off),1);
      }
    }
  }

  return tracers; 
}

function add_path() {
  for (let j = 0; j < 1; j++) {
    y = -10;
    while (y < 300 || y > 1760) {
      where_we_are_going = random(lines);
      x = random(400,1660)
      y = where_we_are_going.a * x + where_we_are_going.b;
    }
    let n_points = random(5,50);
    return trace_line(x,y,n_points);
  }
}

function chaikin(vertices, ratio, iterations) {
  let next_vertices = [];

  if (iterations == 0) {
    return vertices;
  }

  next_vertices.push(vertices[0]);
  for (let i = 0; i < vertices.length-1; i++) {
    let a = vertices[i];
    let b = vertices[i+1];
    let n = cut_corner(a,b,ratio);
    next_vertices.push(n[0]);
    next_vertices.push(n[1]);
  }
  return chaikin(next_vertices, ratio, iterations-1); 
}

function cut_corner(a,b,ratio) {
  n = []; 
  if (ratio > 0.5) {
    ratio = 1 - ratio;
  }
  if (random() < buggy) {
    let x = a.x + (b.x - a.x) * ratio;
    let y = a.y + (b.y - a.y) * ratio;
    n.push(createVector(x,y));
    x = b.x - (a.x - b.x) * ratio;
    y = b.y - (a.y - b.y) * ratio;
  n.push(createVector(x,y));
  } else {
    let x = lerp(a.x,b.x,ratio)
    let y = lerp(a.y,b.y,ratio)
    n.push(createVector(x,y));
    x = lerp(b.x,a.x,ratio);
    y = lerp(b.y,a.y,ratio);
    n.push(createVector(x,y));
  }

  return n; 
}

function base_lines(lins, n_lines) {

  let x1, x2, y1, y2;

  for (let i = 0; i < n_lines; i++) {
    if (random() < 0.5) {
      x1 = 0;
      x2 = 2060;
      y1 = random() * 2060;
      y2 = random() * 2060;
    } else { 
      y1 = 0;
      y2 = 2060;
      x1 = random() * 2060;
      x2 = random() * 2060;
    }
    let a = (y2 - y1) / (x2 - x1);
    let b = y1 - a * x1;
    line = {
      a: a,
      b: b,
    }
    lins.push(line);
  }
  return lins;
}

function export_high_res() {
  art.resizeCanvas(5000,5000);
  draw();
  save(art, 'ACTION_SYSTEM_' + fxhash, 'png');
  art.resizeCanvas(size,size);
  draw();
}

function export_low_res() {
  art.resizeCanvas(1000,1000);
  draw();
  save(art, 'ACTION_SYSTEM_' + fxhash, 'png');
  art.resizeCanvas(size,size);
  draw();
}

function new_output() {
  randomSeed(millis());
  rotation = floor(random(4))*PI/2;
  zoom = [random(0.15,0.3),random(0.7,0.85)];
  paper.fill("#E0DDD1");
  paper.noStroke();
  paper.rect(0,0,2160,2160);
  paper.noFill();

  for (let p of paths) {
    p.path = add_path();
  }
  draw_final()

}

function doubleClicked() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function windowResized() {
size = windowWidth > windowHeight ? windowHeight : windowWidth;
size *= 0.9;
resizeCanvas(size,size);  
art.resizeCanvas(size,size);
}

function keyReleased() {
if (key == 'r' || key == 'R') new_output();
if (key == 'e' || key == 'E') export_high_res();
if (key == 's' || key == 'S') export_low_res();
}

