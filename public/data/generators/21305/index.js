var time = 0;
var we;
var cwe;
var twe = 0.005;

var yamount;
var xamount;
var q;
var size;
var period = 5000;
var paused = false;

var use_offset = true;
var dense = true;
var outline = true;
var large = true;
var similar_motion = true;
var vertical = true;
var black_and_white = false;
var beige = false;

var nparticles;
var ranvals = [];
var ranused = 20;

var canvas, colors, selected_palette;
var aspect_RATIO;

// color palettes
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
    palette : "ea663ff9cc2784afd77ca994f1bbc9242424" + "f1bbc9".repeat(8),
    background_color : "f1bbc9",
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
    palette : "131313",
    background_color : "131313",
    stroke_color : "eeeeee",
    prob : 1
  },

  {
    palette : "ec2f28 f8cd28 1e95bb fbaab3 fcefdf f05e3b f05e3b f05e3b f05e3b",
    background_color : "fcecda",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "135ce1 eee9db ffcd46 fa4e31",
    background_color : "eee9db",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "39b290 39b290 39b290 39b290 39b290 39b290 39b290 39b290 131313 eeeeee",
    background_color : "39b290",
    stroke_color : "131313",
    prob : 10
  },

  // add new colors palettes here

  {
    palette : "99cb9f cfb610d00701dba78d2e2c1dbfbea2d2cfaf",
    background_color : "99cb9f",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "eee3d3",
    background_color : "eee3d3",
    stroke_color : "131313",
    prob : 4
  },

  {
    palette : "f5f2d3",
    background_color : "f5f2d3",
    stroke_color : "131313",
    prob : 4
  },

  {
    palette : "f8c3df f2e42028b3d0648731ef6a7d",
    background_color : "f8c3df",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "d82e3677a9bd285f88e1515800a591b5d9ceec7d3fffbb3a111b32e1d7c6ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9ece4d9",
    background_color : "ece4d9",
    stroke_color : "131313",
    prob : 10
  },

  {
    palette : "d82e3677a9bd285f88e1515800a591b5d9ceec7d3fffbb3a111b32e1d7c6ece4d9",
    background_color : "ece4d9",
    stroke_color : "131313",
    prob : 10
  },

];

var arrangement, particleSize, nSteps, nColRow, nStepsAndParticles, useBorders, crossHatching;
var useSedi, sediMode, sediRGB, sediRes, sediAgedProb;

function preset() {

  background(255,255,255);
  noiseSeed(fxrand() * (2**24));

  mw = min(width,height);

  vertical = fxrand() < 0.15;
  use_offset = fxrand() < 0.6 || vertical;
  dense = fxrand() < 0.3;
  outline = fxrand() < 0.4;
  large = fxrand() < 0.25;
  similar_motion = fxrand() < 0.6;
  black_and_white = fxrand() < 0.01;
  beige = fxrand() < 0.25 && !black_and_white;

  black_and_white = false;
  beige = false;
  large = true;
  outline = true;

  if (dense) {
    nparticles = 1600;
  }
  else {
    nparticles = 800;
  }
  if (outline) {
    strokeWeight(mw / 800);
  }
  else {
    strokeWeight(mw / 8000);
  }
  if (large) {
    q = min(width,height) / 100;
  }
  else {
    q = min(width,height) / 200;
  }
  

  selected_palette = featureSelection(
    all_scheme.map((x,i) => Object({value: x, label: i, prob: x.prob})));
  colors = parseHexStrings(selected_palette.value.palette);

  // other choices
  arrangement = featureSelection([
    {value: "unpreturbed", label: "Unpreturbed", prob: 1},
    {value: "diagonal", label: "Diagonal", prob: 1},
    {value: "parabolic", label: "Parabolic", prob: 1},
    {value: "peak", label: "Single Peak", prob: 1},
    {value: "vertical", label: "Vertical Noise", prob: 1},
    {value: "horizontal", label: "Horizontal Noise", prob: 1},
    {value: "skewed", label: "Skewed", prob: 1},
    {value: "full", label: "Full Screen", prob: 1}
  ]);

  nStepsAndParticles = featureSelection([
    {value: [2000,100], label: "Sparse", prob: 3},
    {value: [250,2000], label: "Normal", prob: 7}
  ]);

  particleSize = featureSelection([
    {value: min(width,height) / 100, label: "Small", prob: 4},
    {value: min(width,height) / 50, label: "Large", prob: 5},
    {value: min(width,height) / 25, label: "Huge", prob: nStepsAndParticles.label === "Sparse" ? 0 : 1},
  ]);

  nColRow = featureSelection([
    {value: [4,8], label: "default", prob: 3},
    {value: [12,16], label: "default", prob: 6},
    {value: [24,16], label: "default", prob: 6},
    {value: [48,16], label: "default", prob: 3},
  ]);

  useBorders = featureSelection([
    {value: false, label: false, prob: 1},
    {value: true, label: true, prob: ((nStepsAndParticles.label === "Sparse") || (arrangement.value === "full")) ? 0 : 1}
  ]);

  crossHatching = featureSelection([
    {value: false, label: false, prob: 8},
    {value: true, label: true, prob: ((arrangement.value === "full") || (nColRow.value[0] <= 12) || (arrangement.value === "horizontal")) ? 0 : 2}
  ]);

  // sedi features here 
  /*
  sh.setUniform('mode', randitem([0,4,6])); // 4, 6
  sh.setUniform('agedProb', randitem([0.,0.25,0.75]));
  sh.setUniform('rgbFilter', randitem([0.,1.]));
  sh.setUniform('ress', 32);
  var useSedi, sediMode, sediRGB, sediRes, sediAgedProb;
  */
  useSedi = featureSelection([
    {value: true, label: true, prob: 1},
    {value: false, label: false, prob: 9},
  ]);

  sediMode = featureSelection([
    {value: 0, label: "Default", prob: 1},
    {value: 3, label: "Rotate", prob: 1},
    {value: 4, label: "Wobble", prob: 1},
    {value: 6, label: "Horizontal Shift", prob: 1}
  ]);

  sediRGB = featureSelection([
    {value: true, label: true, prob: 1},
    {value: false, label: false, prob: 10},
  ]);

  sediRes = featureSelection([
    {value: 32, label: 32, prob: 1},
    {value: 64, label: 64, prob: 1},
    {value: 128, label: 128, prob: 1},
  ]);

  sediAgedProb = featureSelection([
    {value: 0.05, label: "Low", prob: 4},
    {value: 0.25, label: "Medium", prob: 4},
    {value: 0.75, label: "High", prob: 1}, // 1
  ]);

  if (useSedi.value === false) {
    sediMode = {value: null, label: "n/a"};
    sediRGB = {value: null, label: "n/a"};
    sediRes = {value: null, label: "n/a"};
    sediAgedProb = {value: null, label: "n/a"};
  }


  q = particleSize.value;
  nparticles = nStepsAndParticles.value[1];

  if (nStepsAndParticles.label === "Sparse") {
    similar_motion = false;
  }


  if (similar_motion) {
    we = 0.2;
    cwe = 0.005;
  }
  else {
    we = 2;
    cwe = 0.05;
  }
  if (vertical) {
    xamount = mw / 10;
    yamount = mw * 2;
  }
  else {
    xamount = mw;
    yamount = mw;
  }


  ranvals = [];
  for (var i=0; i<nparticles*ranused; i++) {
    ranvals.push(int(fxrand()*(2**24)));
  }

  window.$fxhashFeatures = {
    "Arrangement": arrangement.label,
    "Borders": useBorders.label,
    "Cross Hatching": crossHatching.label,
    "Color Palette": selected_palette.label,
    "Density": nStepsAndParticles.label,
    "Particle Size" : particleSize.label,
    "SD Shader": useSedi.label,
    "SD Shader Mode": sediMode.label,
    "SD Shader RGB": sediRGB.label,
    "SD Shader Number of Layers": sediRes.label,
    "SD Shader Erosion Probability": sediAgedProb.label
  }
  console.log(window.$fxhashFeatures);

}

function decimalToHex(d, padding) {
  var hex = Number(d).toString(16);
  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
  while (hex.length < padding) {
      hex = "0" + hex;
  }
  return hex;
}

function setup() {

  console.log("HASH :: ", fxhash);
  
  // allow user to specify size
  possible_size = new URLSearchParams(window.location.search).get('size');
  canvas_size = min(window.innerWidth, window.innerHeight);
  if ((possible_size !== undefined) && (possible_size !== null)) {
    canvas_size = parseInt(possible_size);
  }

  canvas_size = max(canvas_size, 1000); // enfore minimum

  aspect_RATIO = 1.3125;
  canvas = createCanvas(canvas_size, canvas_size * aspect_RATIO);
  preset();
  pixelDensity(1);
  randomSeed(fxrand() * 1e8);
  noiseSeed(fxrand() * 1e8);
}

function create_value_image(data, use_random) {
  // begin generate random values to use in shader
  let n = 512;
  ranimg = createImage(n, n);
  ranimg.loadPixels();
  for (let i = 0; i < ranimg.width; i++) {
    for (let j = 0; j < ranimg.height; j++) {
      let index = j*n + i;
      if (use_random !== undefined) {
        ranimg.set(i, j, [random(255),random(255),random(255),255.]);
      }
      else {
        if (index < data.length) {
          ranimg.set(i, j, data[index].concat([255.]));
        }
        else {
          ranimg.set(i, j, [0., 0., 0., 255.]);
        }
      }
    }
  }
  ranimg.updatePixels();
  // end generate random values to use in shader
  return ranimg;
}

function difference_one_to_many(a, bs) {
	var segments = PolyBool.segments({regions: [a], inverted: false});
	for (const b of bs){
		var seg2 = PolyBool.segments({regions: [b], inverted: false});
		var comb = PolyBool.combine(segments, seg2);
		segments = PolyBool.selectDifference(comb);
	}
	return PolyBool.polygon(segments).regions;
}

function draw() {


  let bgcolor = parseHexStrings(selected_palette.value.background_color)[0];
  let stcolor = parseHexStrings(selected_palette.value.stroke_color)[0];
  background(...bgcolor);
  stroke(...stcolor);

  //nStepsAndParticles.value[0] = 5;

  let x,y,xs,ys;
  for (let time=0; time<nStepsAndParticles.value[0]; time++) {
    for (var i=0; i<nparticles; i++) {

      x = (float(gr(i,0) % 1e4) / 1e4) * (2*width) - width/2;
      y = (float(gr(i,1) % 1e4) / 1e4) * (2*height) - height/2;
      
      //x = gr(i,0) % (2*width) - width/2;
      //y = gr(i,1) % (2*height) - height/2;
      xs = x/width*we;
      ys = y/height*we;
      x += (noise(xs + gr(0,2), ys + gr(0,3), time*twe + gr(0,6))-0.5) * xamount;
      y += (noise(xs + gr(0,4), ys + gr(0,5), time*twe + gr(0,7))-0.5) * yamount;

      //psize = noise(xs + gr(0,8), ys + gr(0,9), time*twe + gr(0,10)) * 4;
      
      fill(colors[gr(i,3) % colors.length]);
      circle(x,y, (gr(i,4) % 4) * q);

    }
  }

  // apply shader
  buffer = createGraphics(width, height, WEBGL);
  sh = buffer.createShader(vert, frag);
  buffer.shader(sh);
  buffer.translate(-width/2,-height/2);

  sh.setUniform('imgTex', get());


  let col = nColRow.value[0];
  let row = nColRow.value[1];


  // this section should be size invariant
  let use_width = 1000;
  let use_height = use_width * aspect_RATIO;

  let margin = use_width/16;
  let border = Poly.rect(margin,margin,use_width-2*margin,use_height-2*margin);
  let highness = Poly.rect(margin,-use_height/2,use_width-2*margin,2*use_height);
  let wideness = Poly.rect(-use_width/2,margin,2*use_width,use_height-2*margin);
  
  let bigpad = use_width/900 * 10;
  let smallpad = use_width/900 * 2;

  if (nColRow.value[0] <= 12) {
    smallpad = use_width/900 * 10;
  }

  p = highness.uneven_grid_fill(1,row,[0,0],[0,bigpad]).apply_func(p => p.grid_fill_even(col,1, [0,0], [smallpad,0]));
  
  if (arrangement.value === "diagonal") {
    p = p.apply_func(p => p.translate(0,p.centroid()[0]/2));
  }
  else if (arrangement.value === "parabolic") {
    p = p.apply_func(p => p.translate(0,((p.centroid()[0]/use_width)**2)*use_height));
  }
  else if (arrangement.value === "peak") {
    p = p.apply_func(p => p.translate(0,abs((p.centroid()[0]/use_width)-0.5)*use_height/2));
  }
  else if (arrangement.value === "vertical") {
    p = p.apply_func(p => p.translate(0,(noise(p.centroid()[0]/use_width + 1534)-0.5)*use_width/2)); // vertical noise
  }
  else if (arrangement.value === "horizontal") {
    p = wideness.uneven_grid_fill(1,row,[0,0],[0,bigpad]).apply_func(p => p.grid_fill_even(col*2,1, [0,0], [smallpad,0]));
    p = p.apply_func(p => p.densify().warp(p => [p[0] + (noise(p[1]/use_height + 1534)-0.5)*use_height,p[1]])); // horizontal noise
  }
  else if (arrangement.value === "skewed") {
    p = p.apply_func(p => p.translate(0,(noise(p.centroid()[0]/use_width + 1534)-0.5)*use_width/2)); // vertical noise
    p = p.apply_func(p => p.rotate((noise(p.centroid()[0]/use_width + 5823,p.centroid()[1]/use_height + 8234)-0.5)*0.75*PI));
  }
  else if (arrangement.value === "unpreturbed") {
    // no transforms
  }

  if (crossHatching.value === true) {
    angle = random(0.0625,0.25) * randitem([-1,1]) * PI;
    b = highness.uneven_grid_fill(1,row,[0,0],[0,bigpad]).apply_func(p => p.grid_fill_even(col,1, [0,0], [smallpad,0]));
    b = b.rotate(angle,use_width/2,use_height/2);
    p = b.intersect(p);
  }

  p = p.center(0,0,use_width,use_height);


  p = p.intersect(border);
  rawp = p.scale(width/use_width,height/use_height,0,0); // scale to size of canvas
  p = p.scale(1/use_width,-1/use_height,0,1);

  if (arrangement.value === "full") {
    aspect = (height/width);
    p = new PolySet([Poly.rect(1/16, 1/16/aspect, 1-1/8, 1-1/8/aspect)]);
  }
  

  let index = [];
  let tris = new PolySet([]);
  for (let i=0; i<p.polys.length; i++) {
    let sub = p.polys[i].triangulate();
    tris = tris.concat(sub);
    index = index.concat(sub.polys.map(x => i));
  }

  const rma = x => x/index[index.length-1]*255; 
  index = create_value_image(index.map(x => [rma(x),rma(x),rma(x)]));
  sh.setUniform('indexMap', index);
  sh.setUniform('randvals', create_value_image([], true));

  buffer.beginShape(TRIANGLES);
  for (const tri of tris.polys) {
    for (const p of tri.points) {
      buffer.vertex(...p);
    }
  }
  buffer.endShape();

  background(...bgcolor);
  image(buffer.get(), 0, 0);
  
  if (useBorders.value === true) {
    rawp.draw_outline();
  }

  // sometimes apply sedi shader
  if (useSedi.value === true) {

    buffer.clear();
    sh = buffer.createShader(sedi_vert, sedi_frag);
    buffer.shader(sh);
    buffer.background(...bgcolor);
    sh.setUniform('imgTex', get());
    sh.setUniform('randvals', create_value_image([], true));
    sh.setUniform('seed', random() * 1e4);
    sh.setUniform('mode', sediMode.value);
    sh.setUniform('agedProb', sediAgedProb.value);
    sh.setUniform('marg', 0.);
    sh.setUniform('rgbFilter', sediRGB.value);
    sh.setUniform('mu', [random(),random()]);
    sh.setUniform('ress', sediRes.value);
    buffer.rect(0,0,width,height);
    image(buffer.get(), 0, 0);
  }
  

  fxpreview();
  noLoop();
}

function gr(i, j) {
  return ranvals[i*ranused + j];
}


// Hack to enable WEBGL2 and set a sane blend mode
// https://github.com/processing/p5.js/issues/2536
// https://github.com/diwi/p5.EasyCam/blob/master/examples/ReactionDiffusion_Webgl2/ReactionDiffusion_Webgl2.js#L563
p5.RendererGL.prototype._initContext = function() {
  this.drawingContext = false ||
    this.canvas.getContext('webgl2', this.attributes) ||
    this.canvas.getContext('webgl', this.attributes) ||
    this.canvas.getContext('experimental-webgl', this.attributes);
  let gl = this.drawingContext;
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

