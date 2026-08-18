let c = [];
let cb = ["#D7C7DE","#7E69E8","#FB8900","#EEE8DB","#C4CFCF","#E8EBEA","#89C1BE","#91CCDB","#3C245B","#D0B3F4","#00337C","#4055A1","#8294D8","#DCEF25"];
let duo = [
  ["#FB8900","#BA0F0F",],
  ["#000000","#F5F5F5",],
  ["#FF80D2","#F4BA00",],
  ["#A4ECFF","#F400B5",],
  ["#EEE8DB","#7E69E8",],
  ["#7E69E8","#B7D676",],
];

let systems = [];
let n, a, b, d, e, f, l, w, bc, st, et;
let cam, turn_count; 

let theShader;
let shaderTexture;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  pixelDensity(2);
  smooth();

  shaderTexture = createGraphics(512,512, WEBGL);  
  theShader = shaderTexture.createShader(vertShader ,fragShader); 

  shaderTexture.noStroke();

  cam = createCamera();
  cam.move(0,0,height);
  turn_count = 0;

  noStroke();
  colors();

  st = millis();
  time_diff = 0;

  n = fxrand() < 0.5 ? 10 : 15;
  a = fxrand() < 0.5 ? 0 : 0.5*PI;
  b = fxrand() < 0.6 ? true : false;  
  if (b) {
    d = fxrand() < 0.5 ? true : false;
    if (d) {
      n = 15;
    }
    e = fxrand() < 0.25 ? true : false;   
  } else {
    d = false;
  }
  f = floor(fxrand()*duo.length);    

  w = a > 0 ? height*1.75 : width*1.75;
  l = a > 0 ? width*1.75 : height*1.75;

  for  (let j = 0; j < 2; j++) {
    systems.push(new ParticleSystem());
    for (let i = 0; i < n; i++) {     
      let z = i/(n/2);
      let x = -(w/2) + (w/n)*i;
      systems[j].addParticle(x,z);
    }
  } 

  window.$fxhashFeatures = {
    "Number of Planes": n*2,
    "Direction": a > 0 ? "Horizontal" : "Vertical",
    "Gradients" : b ? "Mixed" : "Simple",
    "Density": d ? "Closed" : "Open",
    "Color": e ? "Duotone" : "Master Palette",
  }

  bc = color(cb[floor(fxrand()*cb.length)]);
}

function draw() {
  background(bc);
  if (e) {
    background(duo[f][0]);
  }

  orbitControl();
  et = (millis() - st - time_diff)/11500;

  for (let j = 0; j < systems.length; j++) {
    push();
    rotateZ(a);
    translate(0,0,height*.5 - j*height);
    systems[j].run();
    pop();
  }

  if (frameCount == 1) {
    fxpreview();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = a > 0 ? height*1.75 : width*1.75;
  l = a > 0 ? width*1.75 : height*1.75;
  turn_count = 0; 
  cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
  cam.move(0,0,height);
}

function keyTyped() {
  if (key === 'b') {
    turn_count += 1;
    cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
    if (turn_count%2 == 0) {
      cam.move(0,0,height);
    } else {
      cam.move(0,0,-1.868*height - (height/2) / tan(PI/6));
      cam.pan(PI);
    }
  }
  if (key === 'o') {
    cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)    
    cam.move(0,0,height);
    turn_count = 0;
  } 
  if (key === '1') {
    pixelDensity(1);
    cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)    
    cam.move(0,0,height);
    turn_count = 0;
  } 
  if (key === '2') {
    pixelDensity(3);
    cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)    
    cam.move(0,0,height);
    turn_count = 0;
  } 
  if (key === '3') {
    pixelDensity(3);
    cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)    
    cam.move(0,0,height);
    turn_count = 0;
  } 
}

function colors() {
  c = ["#D7C7DE","#02B7C7","#7E69E8","#FB8900","#7E5D8E","#FFC100","#EEE8DB","#C4CFCF","#E8EBEA","#FBA8C6","#89C1BE","#91CCDB","#F2E9AA","#B7D676","#3C245B","#8461C9","#D0B3F4","#FFEA92","#FFEB36","#F4BA00","#00337C","#4055A1","#8294D8","#FFD199","#FF9D00","#EF6100","#047294","#A4ECFF","#BA0F0F","#598200","#DCEF25","#C8E281","#FFCFEF","#FF80D2","#F400B5","#006027","#D4FFE6","#ECACFC","#C671DB","#9B06BF"];
};

let Particle = function(position) {
  this.position = position.copy();
  if (e) {
    this.c1 = duo[f][0];
    this.c2 = duo[f][1];
  } else {
    let cp = floor(fxrand()*cb.length); 
    this.c1 = color(c[cp]);
    c.splice(cp,1);
    this.c2 = color(c[floor(fxrand()*c.length)]);
    colors();
  }
  this.dir = b? fxrand() : 0.4;
  this.b = b? floor(fxrand()*4) + 1 : 1;
  if ((!d)&&(b)) { this.b = floor(fxrand()*2) + 1;}
  this.A = d ? fxrand()*2 + 2 : 1.25;
  this.B = fxrand()*4 + 1;
  this.C = 0.2*PI + fxrand()*PI*0.6;
  this.dx = width/n; 
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

Particle.prototype.update = function(){
  dx = (w/n) * this.A * sin(this.B*(et+this.C));
};

Particle.prototype.display = function() {
  shaderTexture.shader(theShader);
  theShader.setUniform("u_resolution", [512, 512]);
  theShader.setUniform('colorA', [red(this.c1)/255,green(this.c1)/255,blue(this.c1)/255]);
  theShader.setUniform('colorB',[red(this.c2)/255,green(this.c2)/255,blue(this.c2)/255]);
  theShader.setUniform('b',[this.b]);
  theShader.setUniform('dir',[this.dir]);

  shaderTexture.rect(0,0,dx,l);
  texture(shaderTexture);

  push();
  translate(this.position.x,this.position.y,this.position.z);
  plane(dx,l);
  pop();
};

let ParticleSystem = function() {
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(x,z) {
  let position = createVector(x, 0, z)
  this.particles.push(new Particle(position));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
  }
};



let vertShader = `
  attribute vec3 aPosition; 
  void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);   
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;     
    gl_Position = positionVec4;
}`;

let fragShader = `

  #ifdef GL_ES
  precision mediump float;
  #endif
    
  uniform vec2 u_resolution;

  uniform vec3 colorA;
  uniform vec3 colorB; 
  uniform float b; 
  uniform float dir;

  void main() { 
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    if (b > 1.) {
      st *= b;
      st = fract(st);
    } else {
      st -= 0.5;
    }

    vec3 pct = vec3(0.);
    vec3 color = vec3(0.0);

    if (dir < 0.3) {
      pct = vec3(st.y);
    } else if (dir < 0.66) {
      pct = vec3(st.x);
    } else {
      pct = vec3((st.x + st.y)/2.);
    }

    color = mix(colorA,colorB, pct);
  
    gl_FragColor = vec4(color,1.0);

}`;
