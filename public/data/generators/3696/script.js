var p = {};
var tipoObjeto;
t=0;
var strokeprob;
var rand;
var size;
var pintaRojo = false;
var pg;
var fSize = 1000;


function initFxRand(){
  print("init fxrand")
  let b58dec = (str) => str.split('').reduce((p,c,i) => p + alphabet.indexOf(c) * (Math.pow(alphabet.length, str.length-i-1)), 0)
  let fxhashTrunc = fxhash.slice(2)
  let regex = new RegExp(".{" + ((fxhashTrunc.length/4)|0) + "}", 'g')
  let hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
  let sfc32 = (a, b, c, d) => {
    return () => {
      a |= 0; b |= 0; c |= 0; d |= 0
      var t = (a + b | 0) + d | 0
      d = d + 1 | 0
      a = b ^ b >>> 9
      b = c + (c << 3) | 0
      c = c << 21 | c >>> 11
      c = c + t | 0
      return (t >>> 0) / 4294967296
    }
  }
  fxrand = sfc32(...hashes)
}

function setup(){
  initFxRand();
  size = (windowHeight < windowWidth)? windowHeight:windowWidth;
  createCanvas(size, size);
  pg = createGraphics(fSize,fSize)
  pixelDensity(2);
  pg.pixelDensity(2);
  pg.translate(-fSize/2, fSize/2);
  noLoop();
  pg.fill(200, 229, 226 ,0);
  pg.background("#FCF0D2");
  pg.stroke(0);
  pg.strokeWeight((0.01));
  frameRate(30);

  setupArt();
  art();

  print(tipoObjeto);
};


function keyPressed(){
  if (key == 'h') {
    initFxRand();
    pixelDensity(10);
    pg = createGraphics(fSize,fSize);
    pg.pixelDensity(10);
    pg.translate(-fSize/2, fSize/2);
    pg.fill(200, 229, 226 ,0);
    pg.background("#FCF0D2");
    pg.stroke(0);
    pg.strokeWeight((0.01));
    setupArt();
    art();
    redraw();
  } else if (key == 's') {
    save("unhabitable-" + tipoObjeto +"-"+fxhash+".png");
  }
}

function draw(){

  image(pg,0,0, width, height);

window.$fxhashFeatures = {
  "Place": tipoObjeto,
  "Stroke": p.s1w,
  "Red light": pintaRojo,

}
}; //fin draw

function art() {
  pg.background("#FCF0D2");


  for(let i = 0;i<500;i+=2){
    if (tipoObjeto == "City") {
      grad2_normal(i*50*fxrand(),-i*fxrand(),(i)*1);
    } else if (tipoObjeto == "Forest") {
      grad2_fuerte(i*75*fxrand(),-i*fxrand(),(i)*1);
    } else if (tipoObjeto == "Downtown") {
      grad2_paul(i*30*fxrand(),-i*fxrand()*2,(i)/30);
    } else if (tipoObjeto == "Nowhere") {
      grad2_difuso(i*30*fxrand(),-i*fxrand(),(i)*1);
    };
  };
}

function setupArt(){
  decideForma();
  decideLinea();
  if ((p.s1w == 0.1) && (fxrand()<0.5)) pintaRojo = true;
}

function windowResized(){
  print("yuhu!")
  sizeNew = (windowHeight < windowWidth)? windowHeight:windowWidth;
  let theScale = sizeNew/size;
  resizeCanvas(sizeNew,sizeNew);
  pg.scale(theScale)
}

function decideForma(){
  rand = fxrand();
  prob1 = 0.1;
  prob2 = 0.2;
  prob3 = 0.3;
  prob4 = 0.4;
  prob5 = 0.5;
  prob6 = 0.6;
  prob7 = 0.7;
  prob8 = 0.8;
  prob9 = 0.96;
  prob10 = 1;
  if (rand <= prob5) {
    tipoObjeto = "City";
  } else if ((prob5 < rand) && (rand <= prob7)) {
    tipoObjeto = "Forest";
  } else if ((prob7 < rand) && (rand <= prob9)) {
    tipoObjeto = "Downtown";
  } else if ((prob9 < rand) && (rand <= prob10)) {
    tipoObjeto = "Nowhere";
  }};

  function decideLinea(){
    let pSW = fxrand();
    if (tipoObjeto == "City") {
      p.s1w = pSW<0.3?0.01:pSW<0.7?0.1:1;
    } else if (tipoObjeto == "Forest") {
      p.s1w = 0.01;
    } else if (tipoObjeto == "Nowhere") {
      p.s1w = 0.01;
    } else if (tipoObjeto == "Downtown") {
      p.s1w = 1;
    }

    pg.strokeWeight(p.s1w);
  };

function grad2_normal(x,y,r){
  for(let i = 0;i<5000;i+=2){
    if (pintaRojo) {
      pg.push();
      pg.stroke(250,50,50);
      pg.strokeWeight(0.03);
      pg.ellipse(x*fxrand(), y*fxrand(), r*sin((r)*r), r*cos((r)));
      pg.pop();
    }
    pg.ellipse(x, y*fxrand(), r*sin((r)), r*cos((r))*PI/(320*fxrand()));

}};

function grad2_fuerte(x,y,r){
    for(let i = 0;i<5000;i+=2){
      if (pintaRojo) {
   pg.push();
    pg.stroke(250,50,50);
    pg.strokeWeight(0.01);
    pg.ellipse(random(x), random(y), r*sin((r)*r), r*cos((r)));
    pg.pop();
}

  pg.ellipse(x, y*fxrand(), r*sin((r)*r/140), r*cos((r))*PI/(20*fxrand()));

}};

function grad2_difuso(x,y,r){
  for(let i = 0;i<5000;i+=2){
  pg.ellipse(x*fxrand(), y*fxrand(), r*sin((r)*r), r*cos((r)));


}};
function grad2_paul(x,y,r){
  for(let i = 0;i<5000;i+=2){
  pg.ellipse(x/2, y*fxrand(), r*sin((r))*5, r*cos((r))*PI/(320*fxrand())*5);
  pg.rotate(-PI*(r));

}};
