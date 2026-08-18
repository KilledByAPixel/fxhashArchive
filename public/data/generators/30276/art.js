let theShader;
let thePixels;
let art;
let noise;
function preload(){
  theShader = loadShader('shader.vert', 'magic.frag');
  loadFont('font.ttf');
}

let zoom = 1;
let min_zoom = 0.95;
let max_zoom = 6.0; 

let panX = 0;
let panY = 0;

let prevMouseX;
let prevMouseY;
let isPanning = false;

let knit_l = 1200;
let knit_w = 194; 
let ar_scarf = knit_l/knit_w;
let h_scarf, w_scarf;
let margin = 0.025;

let pd, pm; 
let bg1, bg11, bg2, bg3, r1, r2, sc, fb, sv, col;

let params_updated = false; 
let v, vo1, vo2; 

function setup() {
  setAttributes('perPixelLighting', true);
  setAttributes('antialias', true);

  if ($fx.context === "minting") {
    createCanvas(windowWidth, windowHeight-60, WEBGL); 
  } else {
    createCanvas(windowWidth, windowHeight, WEBGL);     
  }

  pixelDensity(min(displayDensity(),2));  
  document.body.style.backgroundColor = color("#1A1A1A");

  h_scarf = height*(1-2*margin);
  w_scarf = h_scarf/ar_scarf; 

  zoom = 1.0;
  if (isMobile()) {
    pd = 1.0;
    pm = 2.0; 
  } else {
    pd = min(displayDensity(),2);
    pm = 3.5;
  }  

  max_zoom = 1.35*(width/w_scarf); 

  art = createGraphics(w_scarf*pm,h_scarf*pm,WEBGL);
  art.pixelDensity(pd); 

  bg1 = createGraphics(w_scarf*pm,h_scarf*pm,WEBGL);
  bg1.pixelDensity(pd); 
  bg1.rectMode(CENTER);

  bg11 = createGraphics(w_scarf*pm,h_scarf*pm,WEBGL);
  bg11.pixelDensity(pd); 
  bg11.rectMode(CENTER);

  bg2 = createGraphics(w_scarf*pm,h_scarf*pm,WEBGL);
  bg2.pixelDensity(pd); 
  bg2.rectMode(CENTER);

  bg3 = createGraphics(w_scarf*pm,h_scarf*pm);
  bg3.pixelDensity(pd); 
  bg3.rectMode(CENTER);

  sc = 1.0;
  fb = 1.0; 
  sv = 0.0;
  if ($fx.context == "standalone") {
    addVoice();
  } 
}

function draw() {
  clear();
  background("#1A1A1A");
  translate(panX,panY); 
  scale(zoom);

  if (zoom > 0.95*(width/w_scarf)) {
    sc = 0.5;
  } else {
    sc = 1.0;
  }

  if ($fx.context == "capture") {
    // sc = 0.5;
    scale(width/w_scarf);
    addVoice();
    $fx.preview();
  } 

  v = $fx.getParam('voice1');
  if (v[0] != vo1 || v[1] != vo2) {
    params_updated = true; 
  }
  if (params_updated) {
    addVoice();
    params_updated = false; 
  }
  vo1 = v[0];
  vo2 = v[1];

  if (!$fx.getParam('recorded') && $fx.context == "minting") {
    bg1.fill(0);
    bg1.rect(0,0,bg1.width,bg1.height);
    bg11.fill(0);
    bg11.rect(0,0,bg2.width,bg2.height);
    bg2.fill(0);
    bg2.rect(0,0,bg2.width,bg2.height);
  } 

  art.shader(theShader);
  theShader.setUniform('u_scarfsize', [knit_w,knit_l]);
  theShader.setUniform('tex0', bg1);
  theShader.setUniform('tex1', bg2);
  theShader.setUniform('tex2', bg3);
  theShader.setUniform('tex3', bg11);
  theShader.setUniform('r1', r1);
  theShader.setUniform('r2', r2);
  theShader.setUniform('sc', sc);
  theShader.setUniform('sv', sv);
  theShader.setUniform('fb', fb);
  theShader.setUniform('kleur', col);
  theShader.setUniform('sd', $fx.getParam('scarf'));

  art.rect(0,0,width,height);


  if (isMobile() && $fx.context == "minting") {
    rotate(0.5*PI);
    let q = windowWidth/h_scarf*0.95;
    image(art,-w_scarf/2,-h_scarf*q/2,w_scarf*q,h_scarf*q);
  } else {
    image(art,-w_scarf/2,-h_scarf/2,w_scarf,h_scarf);
  }

  if (isPanning) {
    pan();
  }

}

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent) || ('ontouchstart' in window);
}

function keyPressed() {
  if (key === 'S' || key === 's') {
    sv = 1.0;
    draw();
    export_scarf(knit_w,knit_l + 18); 
    sv = 0.0;
    draw();
  }
  if (key === 'B' || key === 'b') {
    fb *= -1;
  }
}

function export_scarf(w, h) {
  let tempCanvas = createGraphics(w, h);
  tempCanvas.pixelDensity(1);
  tempCanvas.image(art, 0, 0, knit_w, knit_l);

  tempCanvas.noStroke();
  tempCanvas.fill(255,0,0);
  tempCanvas.rect(0,knit_l,knit_w,18);

  tempCanvas.noStroke();
  tempCanvas.fill(0,0,255);
  tempCanvas.rect(0,knit_l,knit_w,2);  

  let address = $fx.minter; 
  let short_address = address.substring(0, 20);

  textFont("font");
  tempCanvas.textSize(15);
  tempCanvas.textAlign(CENTER);
  tempCanvas.fill(76);
  tempCanvas.text(short_address,knit_w/2,knit_l + 14);

  let filename = 'scarf_' + short_address + '.png'; // filename with resolution
  save(tempCanvas, filename);
}
