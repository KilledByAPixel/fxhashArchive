// REDOLS
// Anna Carreras
// 2022

// This code holds a Creative Commons Attribution-NoDerivatives 4.0 International License
// (CC BY-ND 4.0)
// This license lets you reuse the work for any purpose; 
// however, it cannot be shared with others in adapted form, and credit must be provided to author.
// Full legal license: https://creativecommons.org/licenses/by-nd/4.0/legalcode


// www.annacarreras.com

// mecanismes
let tipus = 0; // 0:RES, 
               // 1:RODO, 2:VESPA, 
							 // 3:MANDARINA, 4:MANDARINAUNIFORME, 
							 // 5:MIGMIG, 6:RODA, 7:DISBAUXA,
							 // 8:U, 9:O, 10:ARQUET, 11:MIRO
let mecanismesGrans = [];
let mecanismesPetits = [];
let mecanismesMinis = [];
let girElipseInt, aElipseInt, bElipseInt;
let girElipseExt, aElipseExt, bElipseExt;

// clusters
let angleClusterGran, distxxClusterGran, distyyClusterGran;
let angleClusterPetit, distxxClusterPetit, distyyClusterPetit;

// quantitats
let qdisbauxa = [0,1,1,0,1,2,4,1,0,1,0]; // disbauxa
let qequilibrat = [0,0,3,0,0,1,1,3,3,0,0]; // equilibrat
let qmironia = [0,3,2,1,0,0,1,0,0,0,3]; // mironià 
let qmigmig = [0,2,0,2,0,7,0,0,0,0,0]; // mig mig
let qdegradats = [0,0,2,1,0,5,1,0,1,3,0]; // degradats
let qvespa = [0,9,0,0,0,0,1,0,0,1,1]; // vespa
let qmandarina = [0,0,8,1,2,0,0,0,0,1,0]; // mandarina
let qus = [0,0,1,3,0,0,0,8,0,0,0]; // us
let qos = [0,0,2,0,0,1,0,0,8,0,0]; // os
let qpurpla = [1,1,3,7,0,0,0,0,0,0,0]; // pur pla
let quantis = [qdisbauxa, qequilibrat, qmironia, qmigmig, qdegradats, qvespa, qmandarina, qus, qos, qpurpla];
let rq; // random que escull mecanismes
let iMeca; // quin mecanisme
let quantisGrans;
let quantisPetits;
let quantisMinis;

// gradients
let detail = 38;
let angleFinal;
let dtf;
let vs = [detail];

// colors 2 paletes
let totalColors = 10;
let colorsdoble = [totalColors];
let paletta1 = ["#ED5311", "#26403F", "#F5BB0C", "#FFD745", "#E3EBAE"]; // taronja
let paletta2 = ["#141A18", "#17332B", "#D94800", "#D97E16", "#E0D292"]; // marro
let paletta3 = ["#17505D", "#090306", "#EFECEF", "#F5EDB1", "#FECC3E"]; // blava
let paletta = [paletta1, paletta2, paletta3];
let rp1, rp2; // randoms que escullen les paletes

// fons
let repeH, repeW;
let bisFonsFilled = false;
let iFormaFons = 0; // rects, trianghles o linies
let bdobleEsgarrapa = true;

// escala
let ample = 900;
let alt = 600;
let escalaW, escalaH, escalaTot;
let bisVertical = false;

function setup() {
  print('---- REDOLS -----');
  print('---- setup');
  createCanvas(windowWidth, windowHeight, P2D);
  frameRate(22);
  noCursor();

  setupVarsFixes();
  setupVarsInicials();
  print("---- fi de setup");
}

function setupVarsFixes(){
  print('---- setup vars fixes');
  print(' - colorsdoble');
	rp1 = int(map(fxrand(), 0.,1., 0,3));
	for(let i=0; i<5; i++){	
		colorsdoble[i] = color(paletta[rp1][i]);
	}
	rp2 = int(map(fxrand(), 0.,1., 0,3));
	for(let i=0; i<5; i++){	
		colorsdoble[i+5] = color(paletta[rp2][i]);
	}
  print("> paleta1: " + rp1);
  print("> paleta2: " + rp2);

  print(' - stroke cap');
  strokeCap(SQUARE);

  print(' - quantitats de mecanismes');
  rq = int(map(fxrand(), 0.,1., 0,100));
  if (rq > 98) iMeca = 9; // qpurpla             2  %
  else if (rq > 94) iMeca = 8; // qos            4
  else if (rq > 90) iMeca = 7; // qus            4
  else if (rq > 81) iMeca = 6; // qmandarina     9
  else if (rq > 75) iMeca = 5; // qvespa         6
  else if (rq > 66) iMeca = 4; // qdegradats     9
  else if (rq > 57) iMeca = 3; // qmigmig        9
  else if (rq > 47) iMeca = 2; // qmironia       10
  else if (rq > 18) iMeca = 1; // qequilibrat    29
  else iMeca = 0; // qdisbauxa                  18
  quantisGrans = quantis[iMeca];
  quantisPetits = quantis[iMeca];
  quantisMinis = quantis[iMeca];

  print(' - distribucio eliptica');	
	girElipseInt = radians(map(fxrand(), 0.,1., -25,25));
  aElipseInt = ample*0.7;
  bElipseInt = alt*0.8;
  girElipseExt = radians(map(fxrand(), 0.,1., -25,25));
  aElipseExt = ample*0.95;
  bElipseExt = alt*0.9;
  
  print(' - arrays de mecanismes');
	mecanismesGrans.splice(0, mecanismesGrans.length); // delete all  
	mecanismesPetits.splice(0, mecanismesPetits.length); // delete all  
	mecanismesMinis.splice(0, mecanismesMinis.length); // delete all
	generaGrans();
  generaPetits();
  generaMinis();

  print(' - clusters');
  angleClusterGran = map(fxrand(), 0.,1.,radians(120),radians(140));
  distxxClusterGran = map(fxrand(), 0.,1.,0.75,0.8);
  distyyClusterGran = map(fxrand(), 0.,1.,0.75,0.85);
  angleClusterPetit = map(fxrand(), 0.,1.,radians(300),radians(320));
  distxxClusterPetit = map(fxrand(), 0.,1.,0.75,0.85);
  distyyClusterPetit = map(fxrand(), 0.,1.,0.85,0.95);
  
  print(' - pvector vs per als gradients');
	angleFinal = radians(180);
	dtf = 1.0 / float(detail - 1);

	let itopi = angleFinal / float(detail - 1);
  for (let i = 0; i < detail; ++i) {
    vs[i] = p5.Vector.fromAngle(i * itopi);
  }

  // fons
  print(' - característiques del fons');
  let rf1 = 10*fxrand();
  if(rf1 < 1.5) iFormaFons = 2; // 15% // linies
  else if (rf1 > 7) iFormaFons = 1; // 30% // triangles 
  else iFormaFons = 0; // 55% // rects
  
  let rf2 = fxrand();
  if(rf2 < 0.25)   bisFonsFilled = true; // 25%
  else bisFonsFilled = false;

  let re = fxrand();
  if(re < 0.45) bdobleEsgarrapa = true;
  else bdobleEsgarrapa = false;
	
  print("---- omplim features");
  // FX Features
  window.$fxhashFeatures = {
    "colors": getFeatureStringPaleta(),
    "fons": getFeatureStringFormaFons(),
    "fonsple": bisFonsFilled,
    "redols": getFeatureStringMecanismes(),
    "fons2diagonals": bdobleEsgarrapa,
  };

  print("---- fi features");

  print("---- fi de setupVarsFixes");
  
}

function setupVarsInicials(){
  print('---- setup vars inicials');
  print("> width: " + width);
  print("> height: " + height);
  escalaW = width/ample;
  escalaH = height/alt;
  if(height > width){
    bisVertical = true;
  }
  else{
    bisVertical = false;
  }
  escalaTot = min(escalaW, escalaH);
  print("> bisVertical: " + bisVertical);
  print("> escalaW: " + escalaW);
  print("> escalaH: " + escalaH);

  print("---- fi de setupVarsInicials");
  loop();
  
}

function draw() {
	// colors a alfa 255
	for(let i=0; i<totalColors; i++){	
		colorsdoble[i].setAlpha(255);
	} 

	// fons
	rectDegradatByLinesVertical(colorsdoble[0],colorsdoble[1], width,height);
	
  // detalls fons
  push();
  drawDetallsFons();
  pop();

	// mecanismes
	alfagral = 150;
  // CERCLES GRANS mes interiors
  push();
  translate(width*0.5, height*0.5);
  if(bisVertical) rotate(HALF_PI);
  rotate(girElipseInt);
  scale(escalaTot);
	for (let i = 0; i < mecanismesGrans.length; i++) {  
		//mecanismesGrans[i].show();		
		mecanismesGrans[i].dibuixa();
  }
	pop();
	// CERCLES exteriors PETITS
  push();
  translate(width*0.5, height*0.5);
  if(bisVertical) rotate(HALF_PI);
  rotate(girElipseExt);
  scale(escalaTot);
	for (let i = 0; i < mecanismesPetits.length; i++) {  
		//mecanismesPetits[i].show();		
		mecanismesPetits[i].dibuixa();
  }
  pop();
  // MINIS detallets
  push();
  translate(width*0.5, height*0.5);
  if(bisVertical) rotate(HALF_PI);
  rotate(girElipseExt);
  scale(escalaTot);
  for (let i = 0; i < mecanismesMinis.length; i++) {  
		//mecanismesMinis[i].show();		
		mecanismesMinis[i].dibuixa();
  }
  pop();

  // clusters repetits
  alfagral = 120;
  push();
  translate(width*0.5, height*0.5);
  if(bisVertical) rotate(HALF_PI);
  let xx = distxxClusterGran*ample*0.5*escalaTot*cos(angleClusterGran);
  let yy = distyyClusterGran*alt*0.5*escalaTot*sin(angleClusterGran);
  translate(xx,yy);
  rotate(girElipseInt);
  scale(escalaTot);
  scale(0.5);
  for (let i = 0; i < mecanismesGrans.length; i++) {  
		//mecanismesGrans[i].show();		
		mecanismesGrans[i].dibuixa();
  }
  pop();
  push();
  translate(width*0.5, height*0.5);
  if(bisVertical) rotate(HALF_PI);
  xx = distxxClusterPetit*ample*0.5*escalaTot*cos(angleClusterPetit);
  yy = distyyClusterPetit*alt*0.5*escalaTot*sin(angleClusterPetit);
  translate(xx,yy);
  rotate(girElipseExt);
  scale(escalaTot);
  scale(0.6);
	for (let i = 0; i < mecanismesPetits.length; i++) {  
		//mecanismesPetits[i].show();		
		mecanismesPetits[i].dibuixa();
  }
  pop();

  fxpreview();
  noLoop();

} // final draw

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupVarsInicials();
}

// -- fons --------------------
function rectDegradatByLinesVertical(col1, col2, w, h){
    let a = 0.0;
    strokeWeight(2);
    for(i=0; i<h; i++){
        a = map(i,0,h, 0.0,1.0);
        let inter = lerpColor(color(col1),color(col2),a);
        stroke(inter);
        line(0,i,w,i);
    }
}

/*
function rectDegradatByLinesInclinat(col1, col2, w, h){
		//TODO    
		let a = 0.0;
    strokeWeight(2);
    for(i=0; i<h; i++){
        a = map(i,0,h, 0.0,1.0);
        let inter = lerpColor(color(col1),color(col2),a);
        stroke(inter);
        line(0,i,w,i);
    }
}*/

function drawDetallsFons(){
  // QUADRADETS
  let mida = 9*escalaTot;
  let saltH = 27*escalaTot;
  let saltW = 20*escalaTot;
  let margeW = 90*escalaTot;
  let margeH = 50*escalaTot;
  repeH = (height-2*margeH)/saltH;
  repeW = (width-2*margeW)/saltW;
  //print("> repeH: " + repeH);
  //print("> repeW: " + repeW);
  
  for (let j=0; j<int(repeH); j++) {
    for (let i=0; i<int(repeW); i++) {
      strokeWeight(1*escalaTot);
      let cq1 = colorsdoble[2]; 
	    cq1.setAlpha(100);
      stroke(cq1);
      if(bisFonsFilled){
        let cq1f = colorsdoble[5]; 
        cq1f.setAlpha(240);
        fill(cq1f);
      }
      else noFill(); 
      let px = margeW+mida+i*saltW; 
      let py = margeH+mida+j*saltH;
      if(iFormaFons == 0) rect(px, py, mida, mida);
      else if(iFormaFons == 1) triangle(px,py, px,py-mida, px+mida,py);
      else line(px,py, px+mida,py-mida);
      noFill();
      strokeWeight(0.5*escalaTot);
      let cq2 = colorsdoble[4]; 
	    cq2.setAlpha(100);
      stroke(cq2);
      if(iFormaFons == 0) rect(px+3, py+3, mida, mida);
      else if(iFormaFons == 1) triangle(px+3,py+3, px+3,py-mida+3, px+mida+3,py+3);
      else line(px+3,py+3, px+mida+3,py-mida+3);
    }
  }

  // RATLLES
  push();
  translate(width*0.5, height*0.5);
  let sepa = 7*escalaTot; // pixels
  strokeWeight(1*escalaTot);
  let cr = colorsdoble[2]; 
  cr.setAlpha(220);
  stroke(cr);
  for (let i=0; i<int(map(fxrand(), 0.,1.,7, 17)); i++) {
    line(i*sepa, -width*2, i*sepa, width*2);
  }
  strokeWeight(0.5*escalaTot);
  stroke(cr);
  for (let i=0; i<int(map(fxrand(), 0.,1.,7, 17)); i++) {
    line(i*sepa+3, -width*2, i*sepa+3, width*2);
  }
  push();
  strokeWeight(2*escalaTot);
  cr = colorsdoble[3]; 
  cr.setAlpha(220);
  stroke(cr);
  rotate(radians(35));
  for (let i=0; i<int(map(fxrand(), 0.,1.,7, 17)); i++) {
    line(i*sepa, -width*2, i*sepa, width*2);
  }
  strokeWeight(0.5*escalaTot);
  stroke(cr);
  for (let i=0; i<int(map(fxrand(), 0.,1.,7, 17)); i++) {
    line(i*sepa+3, -width*2, i*sepa+3, width*2);
  }

  if(bdobleEsgarrapa){
    push();
    translate(140*escalaTot, 0);
    let cr = colorsdoble[4]; 
    cr.setAlpha(100);
    stroke(cr);
    for (let i=0; i<int(map(fxrand(), 0.,1.,5, 11)); i++) {
      strokeWeight(1*escalaTot);
      line(i*sepa, -width*2, i*sepa, width*2);
      strokeWeight(0.5*escalaTot);
      line(i*sepa+3, -width*2, i*sepa+3, width*2);
    }
    pop(); // del translate 100
  }
  pop(); // del rotate 35
  pop(); // del translate al mig

  // RATLLES big bang
  noFill();
  strokeWeight(1*escalaTot);
  let cc = colorsdoble[4]; 
	cc.setAlpha(180);
  stroke(cc);
  push();
  translate(width*0.5, height*0.5);
  let agg = radians(map(fxrand(), 0.,1.,15, 35)); 
  rotate(agg);
  for (let i=0; i<map(fxrand(), 0.,1.,40, 90); i++) {
    rotate(radians(2));
    line(40, 0, 2*height, 0);
  }
  pop();

  cc = colorsdoble[5]; 
	cc.setAlpha(120);
  stroke(cc);
  strokeWeight(2*escalaTot);
  push();
  translate(width*0.5, height*0.5);
  rotate(agg+radians(0.5));
  for (let i=0; i<map(fxrand(), 0.,1.,30, 90); i++) {
    rotate(radians(2));
    line(40, 0, 2*height, 0);
  }
  pop();
}

// -- classe mecanismes --------------------
class Mecanisme {
  //RES, RODO, VESPA1, VESPA2, MANDARINA, MANDARINAUNIFORME, 
	//MIGMIG, RODA, DISBAUXA, U, O, MIRO;

  constructor(px, py, d, nc, t) {
    this.x = px;
    this.y = py;
    this.mida = d;
    this.numc = nc;
	  this.gir = TAU*fxrand();
	  this.colorsg = [totalColors];
    this.colorsg[0] = colorsdoble[this.numc%totalColors];
    this.colorsg[1] = colorsdoble[this.numc%totalColors];
    this.colorsg[2] = colorsdoble[this.numc%totalColors];
    this.colorsg[3] = colorsdoble[this.numc%totalColors];
    this.colorsg[4] = colorsdoble[this.numc%totalColors];
    this.colorsg[5] = colorsdoble[this.numc%totalColors];
    this.colorsg[6] = lerpColor(colorsdoble[this.numc%totalColors], colorsdoble[(this.numc+1)%totalColors], 0.25);
    this.colorsg[7] = lerpColor(colorsdoble[this.numc%totalColors], colorsdoble[(this.numc+1)%totalColors], 0.50);
    this.colorsg[8] = lerpColor(colorsdoble[this.numc%totalColors], colorsdoble[(this.numc+1)%totalColors], 0.75);
    this.colorsg[9] = colorsdoble[(this.numc+1)%totalColors];
    this.tipusm = t;
  }

  creaColorsg(incr) {
    this.colorsg[0] = colorsdoble[(this.numc+incr)%totalColors];
    this.colorsg[1] = colorsdoble[(this.numc+incr)%totalColors];
    this.colorsg[2] = colorsdoble[(this.numc+incr)%totalColors];
    this.colorsg[3] = colorsdoble[(this.numc+incr)%totalColors];
    this.colorsg[4] = colorsdoble[(this.numc+incr)%totalColors];
    this.colorsg[5] = colorsdoble[(this.numc+incr)%totalColors];
    this.colorsg[6] = lerpColor(colorsdoble[(this.numc+incr)%totalColors], colorsdoble[(this.numc+incr+1)%totalColors], 0.25);
    this.colorsg[7] = lerpColor(colorsdoble[(this.numc+incr)%totalColors], colorsdoble[(this.numc+incr+1)%totalColors], 0.50);
    this.colorsg[8] = lerpColor(colorsdoble[(this.numc+incr)%totalColors], colorsdoble[(this.numc+incr+1)%totalColors], 0.75);
    this.colorsg[9] = colorsdoble[(this.numc+incr+1)%totalColors];
  }

  dibuixa() {
    if (this.tipusm === 0) { // RES
    } 
		else if (this.tipusm === 1) {
      this.dibuixaRodo();
    } 
		else if (this.tipusm === 2) {
      this.dibuixaVespa();
    }
		else if (this.tipusm === 3) {
      this.dibuixaMandarina();
    } 
		else if (this.tipusm === 4) {
      this.dibuixaMandarinaUniforme();
    } 
		else if (this.tipusm === 5) {
      this.dibuixaMigmig();
    } 
		else if (this.tipusm === 6) {
      this.dibuixaRoda();
    } 
		else if (this.tipusm === 7) {
      this.dibuixaDisbauxa();
    } 
		else if (this.tipusm === 8) {
      this.dibuixaU();
    } 
		else if (this.tipusm === 9) {
      this.dibuixaO();
    } 
		else if (this.tipusm === 10) {
      this.dibuixaArquet();
    } 
		else if (this.tipusm === 11) {
      this.dibuixaMiro();
    }
  }

	dibuixaRodo() {
    noStroke();
    push();
    translate(this.x, this.y);
    let cc = colorsdoble[this.numc]; 
		cc.setAlpha(alfagral);
    fill(cc);
    circle(0, 0, this.mida);
    pop();
  }
	dibuixaVespa() {
    noStroke();
    push();
    translate(this.x, this.y);
    let cc = colorsdoble[this.numc]; 
		cc.setAlpha(alfagral);
    fill(cc);
    circle(0, 0, this.mida);
		cc = colorsdoble[(this.numc+1)%totalColors]; 
		cc.setAlpha(alfagral);
    fill(cc);
    circle(0, 0, this.mida*0.6);
		cc = colorsdoble[(this.numc+3)%totalColors]; // centre 2
		cc.setAlpha(alfagral);
    fill(cc);
    circle(0, 0, this.mida*0.3);
    pop();
  }
	dibuixaMandarina() {
		let cc = colorsdoble[this.numc]; 
		cc.setAlpha(alfagral);
    fill(cc);
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    circle(0, 0, this.mida);
    let p = map(fxrand(), 0.,1.,0.77, 0.89);
    arc(0, 0, this.mida*p, this.mida*p, 0, PI);
		cc = colorsdoble[(this.numc+3)%totalColors];
    cc.setAlpha(alfagral);
    fill(cc); // centre
    circle(0, 0, this.mida*map(fxrand(), 0.,1.,0.3, 0.65));
    pop();
  }
	dibuixaMandarinaUniforme() {
    let cc = colorsdoble[this.numc]; 
		cc.setAlpha(alfagral);
    fill(cc);
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    //circle(0, 0, this.mida);
    let p = map(fxrand(), 0.,1.,0.77, 0.89);
    arc(0, 0, this.mida*p, this.mida*p, 0, PI);
    circle(0, 0, this.mida*map(fxrand(), 0.,1.,0.3, 0.65)); // centre
    pop();
  }
	dibuixaMigmig() {
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    let cc = colorsdoble[this.numc]; 
		cc.setAlpha(alfagral);
    fill(cc);
    arc(0, 0, this.mida, this.mida, 0, PI);
		cc = colorsdoble[(this.numc+2)%totalColors]; 
		cc.setAlpha(alfagral);
    fill(cc);
    arc(0, 0, this.mida, this.mida, PI, TWO_PI);
    cc = colorsdoble[(this.numc+4)%totalColors]; // centre 
		cc.setAlpha(alfagral);
    fill(cc);
    circle(0, 0, this.mida*map(fxrand(), 0.,1.,0.3, 0.65));
    pop();
  }
	dibuixaRoda() {
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    this.creaColorsg(0);
    drawMigGradient(0.5*this.mida, this.colorsg);
    rotate(PI);
    drawMigGradient(0.5*this.mida, this.colorsg);
    let cc = colorsdoble[this.numc]; 
		cc.setAlpha(alfagral);
    fill(cc);
    noStroke();
    circle(0, 0, this.mida*map(fxrand(), 0.,1.,0.3, 0.65));
    pop();
  }
	dibuixaDisbauxa() {
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    this.creaColorsg(0);
    drawMigGradient(0.5*this.mida, this.colorsg);
    rotate(PI);
    this.creaColorsg(int(map(fxrand(), 0.,1.,2, 4)));
    drawMigGradient(0.5*this.mida, this.colorsg);
		let cc = colorsdoble[(this.numc+4)%totalColors]; // centre 
		cc.setAlpha(alfagral);
    fill(cc);
    noStroke();
    circle(0, 0, this.mida*map(fxrand(), 0.,1.,0.3, 0.65));
    pop();
  }
	dibuixaU() {
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    this.creaColorsg(0);
    let midapetita = map(fxrand(), 0.,1.,0.4, 0.65)*0.5*this.mida;
    drawMigArcGradient(midapetita, 0.5*this.mida, this.colorsg);
		let cc = colorsdoble[(this.numc+4)%totalColors]; // centre 
		cc.setAlpha(alfagral);
    fill(cc);
		noStroke();
    circle(0, 0, 2*midapetita*map(fxrand(), 0.,1.,0.75, 0.88));
    pop();
  }
	dibuixaO() {
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    this.creaColorsg(0);
    let midapetita = map(fxrand(), 0.,1.,0.4, 0.65)*0.5*this.mida;
    drawMigArcGradient(midapetita, 0.5*this.mida, this.colorsg);
    this.creaColorsg(3);
    rotate(PI);
    drawMigArcGradient(midapetita, 0.5*this.mida, this.colorsg);
    let cc = colorsdoble[(this.numc+4)%totalColors]; // centre 
		cc.setAlpha(alfagral);
    fill(cc);
		noStroke();
    circle(0, 0, 2*midapetita*map(fxrand(), 0.,1.,0.75, 0.88));
    pop();
  }
	dibuixaArquet() {
    this.dibuixaO();
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(-HALF_PI);
    let cc = colorsdoble[(this.numc+4)%totalColors];
		cc.setAlpha(alfagral);
    fill(cc);
		arc(0, 0, this.mida, this.mida, radians(-30), radians(30));
    pop();
  }
	dibuixaMiro() {
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    let salts = int(map(fxrand(), 0.,1.,2, 5));
    let dd = this.mida/salts;
    for (let i=salts; i>0; i--) {
      let mm = dd*i + map(fxrand(), 0.,1.,-dd*0.3, dd*0.3);
      let n = int(map(fxrand(), 0.,1.,6, 12));
      let anglet = radians(360./n);
      for (let j = 0; j < n; j++) {
        rotate(anglet);
        let cc = colorsdoble[int(map(fxrand(), 0.,1.,0, totalColors))];
				cc.setAlpha(alfagral);
    		fill(cc);
		    arc(0, 0, mm, mm, 0, anglet, PIE);
      }
    }
    pop();
  }

  show() { // debug
    fill(255, alfagral);
    noStroke();
    push();
    translate(this.x, this.y);
    rotate(this.gir);
    arc(0, 0, this.mida, this.mida, 0, PI);
    pop();
  }
} // fi class

// -- genera mecanismes --------------------
// 1:RODO, 2:VESPA, 
// 3:MANDARINA, 4:MANDARINAUNIFORME, 
// 5:MIGMIG, 6:RODA, 7:DISBAUXA,
// 8:U, 9:O, 10:ARQUET, 11:MIRO

function generaGrans() {
  for (let i=0; i<quantisGrans[0]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,totalColors)), 1));
  }
  for (let i=0; i<quantisGrans[1]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,totalColors)), 2));
  }
  for (let i=0; i<quantisGrans[2]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 3));
  }
  for (let i=0; i<quantisGrans[3]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 4));
  }
  for (let i=0; i<quantisGrans[4]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 5));
  }
  for (let i=0; i<quantisGrans[5]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 6));
  }
  for (let i=0; i<quantisGrans[6]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 7));
  }
  for (let i=0; i<quantisGrans[7]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,totalColors)), 8));
  }
  for (let i=0; i<quantisGrans[8]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,totalColors)), 9));
  }
  for (let i=0; i<quantisGrans[9]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 10));
  }
  for (let i=0; i<quantisGrans[10]; i++) {
    let angle = TAU*fxrand();
    let xx = fxrand()*0.5*aElipseInt*cos(angle);
    let yy = fxrand()*0.5*bElipseInt*sin(angle);
    let mida = map(fxrand(), 0.,1., 156,209);
    mecanismesGrans.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,totalColors)), 11));
  }

}

// 1:RODO, 2:VESPA, 
// 3:MANDARINA, 4:MANDARINAUNIFORME, 
// 5:MIGMIG, 6:RODA, 7:DISBAUXA,
// 8:U, 9:O, 10:ARQUET, 11:MIRO

function generaPetits() {
  for (let i=0; i<quantisPetits[0]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 1));
  }
  for (let i=0; i<quantisPetits[1]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 2));
  }
  for (let i=0; i<quantisPetits[2]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 3));
  }
  for (let i=0; i<quantisPetits[3]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 4));
  }
  for (let i=0; i<quantisPetits[4]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 5));
  }
  for (let i=0; i<quantisPetits[5]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 6));
  }
  for (let i=0; i<quantisPetits[6]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 7));
  }
  for (let i=0; i<quantisPetits[7]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 8));
  }
  for (let i=0; i<quantisPetits[8]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 9));
  }
  for (let i=0; i<quantisPetits[9]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 10));
  }
  for (let i=0; i<quantisPetits[10]; i++) {
    let angle = HALF_PI*fxrand();
    let xx = map(fxrand(), 0.,1., 0.1,1)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.1,1)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 36, 109);
    mecanismesPetits.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 11));
  }
}

// 1:RODO, 2:VESPA, 
// 3:MANDARINA, 4:MANDARINAUNIFORME, 
// 5:MIGMIG, 6:RODA, 7:DISBAUXA,
// 8:U, 9:O, 10:ARQUET, 11:MIRO
function generaMinis() {
  for (let i=0; i<quantisMinis[0]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 1));
  }
  for (let i=0; i<quantisMinis[1]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 2));
  }
  for (let i=0; i<quantisMinis[2]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 3));
  }
  for (let i=0; i<quantisMinis[3]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 4));
  }
  for (let i=0; i<quantisMinis[4]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 5));
  }
  for (let i=0; i<quantisMinis[5]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 6));
  }
  for (let i=0; i<quantisMinis[6]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 7));
  }
  for (let i=0; i<quantisMinis[7]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 8));
  }
  for (let i=0; i<quantisMinis[8]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 9));
  }
  for (let i=0; i<quantisMinis[9]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 10));
  }
  for (let i=0; i<quantisMinis[10]; i++) {
    let angle = TAU*fxrand();
    let xx = map(fxrand(), 0.,1., 0.5,1.)*0.5*aElipseExt*cos(angle);
    let yy = map(fxrand(), 0.,1., 0.5,1.)*0.5*bElipseExt*sin(angle);
    let mida = map(fxrand(), 0.,1., 16, 36);
    mecanismesMinis.push(new Mecanisme(xx, yy, mida, int(map(fxrand(), 0.,1., 0,5)), 11));
  }
}

// -- lerp colors --------------------
function lerpColors(amt, colors) {
  if (colors.length === 1) { 
    return colors[0];
  }
  let cunit = 1.0/(colors.length-1);
  return lerpColor(colors[floor(amt / cunit)], colors[ceil(amt / cunit)], amt%cunit/cunit);
}

// -- cercles i arcs amb gradients --------------------
function drawMigGradient(mida, cols) {
	push();	
	strokeWeight(1);
  beginShape(QUADS); //180
  for (let i=0, j; i<detail-1; ++i) {
    // draw edge n.
    let iprc = i * dtf;
    let itheta = iprc * angleFinal;
    vs[i].set(cos(itheta), sin(itheta));
		let cc = lerpColors(iprc, cols); 
		cc.setAlpha(alfagral);
    fill(cc);
    cc.setAlpha(10);
    stroke(cc);
		vertex(0, 0);
    vertex(vs[i].x*mida, vs[i].y*mida);

    // Draw edge n + 1.
    j = i + 1;
    let jprc = j * dtf;
    let jtheta = jprc * angleFinal;
    vs[j].set(cos(jtheta), sin(jtheta));
    cc = lerpColors(jprc, cols); 
		cc.setAlpha(alfagral);
    fill(cc);
    cc.setAlpha(10);
    stroke(cc);
		vertex(vs[j].x*mida, vs[j].y*mida);
    vertex(0, 0);
  }
  endShape();
	pop();
}

function drawMigArcGradient(midaP, midaG, cols) {
  push();	
	strokeWeight(1);
  beginShape(QUADS); //180
  for (let i=0, j; i<detail-1; ++i) {
    let iprc = i * dtf;
    let itheta = iprc * angleFinal;
    vs[i].set(cos(itheta), sin(itheta));
    let cc = lerpColors(iprc, cols); 
		cc.setAlpha(alfagral);
    fill(cc);
    cc.setAlpha(10);
    stroke(cc);
    vertex(vs[i].x*midaP, vs[i].y*midaP);
    vertex(vs[i].x*midaG, vs[i].y*midaG);

    j = i + 1;
    let jprc = j * dtf;
    let jtheta = jprc * angleFinal;
    vs[j].set(cos(jtheta), sin(jtheta));
    cc = lerpColors(jprc, cols); 
		cc.setAlpha(alfagral);
    fill(cc);
    cc.setAlpha(10);
    stroke(cc);
    vertex(vs[j].x*midaG, vs[j].y*midaG);
    vertex(vs[j].x*midaP, vs[j].y*midaP);
  }
  endShape();
	pop();
}

// -- poblem features --------------------
function getFeatureStringPaleta() {
  // taronja marro blava
  if(rp1===0 && rp2===0) return "super taronja"
  if(rp1===1 && rp2===1) return "super fosc marro"
  if(rp1===2 && rp2===2) return "super blau"
  if(rp1===0 && rp2===1) return "taronja-marro"
  if(rp1===0 && rp2===2) return "taronja-blau"
  if(rp1===1 && rp2===0) return "marro-taronja"
  if(rp1===1 && rp2===2) return "marro-blau"
  if(rp1===2 && rp2===0) return "blau-taronja"
  if(rp1===2 && rp2===1) return "blau-marro"
  else return "no se el color :-("
}

function getFeatureStringFormaFons() {
  // rects triangles linies
  if(iFormaFons===0) return "quadradets"
  if(iFormaFons===1) return "escaires"
  if(iFormaFons===2) return "diagonals"
  else return "no se la forma del fons :-("
}

function getFeatureStringMecanismes() {
  // disbauxa  equilibrat  mironià mig-mig degradats vespa mandarina us os pur-pla
  if(iMeca===0) return "disbauxa"
  if(iMeca===1) return "equilibrat"
  if(iMeca===2) return "mironia"
  if(iMeca===3) return "migmig"
  if(iMeca===4) return "degradats"
  if(iMeca===5) return "vespa"
  if(iMeca===6) return "mandarina"
  if(iMeca===7) return "us"
  if(iMeca===8) return "os"
  if(iMeca===9) return "pla"
  else return "no se quins mecanismes uso :-("
}
