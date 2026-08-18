// Orbit of Influence

// ************************************************************************************************************

let stageW           = 1240;
let stageH           = 1653;
let halfStageW       = -(stageW/2);
let halfStageH       = -(stageH/2);

let myCanvas;
let myCanvas1;

let myCanvasBlueprint1;
let myCanvasBlueprint2;

let myCanvasOrbit1;
let myCanvasOrbit2;
let myCanvasOrbit3;

let letsLoop         = false;

var orbitTick        = 0;
var orbitToggle      = true;

let useMat           = true;
let matSize          = 55;

// ************************************************************************************************************

let genNodeOrbit1    = 0;
let genNodeOrbit2    = 0;
let genNodeOrbit3    = 0;
let genNodeOrbitStr  = "null";

let genNodeScale1    = 0;
let genNodeScale2    = 0;
let genNodeScale3    = 0;
let genNodeScaleStr  = "null";

let genNodeBrushStr  = "null";

var twinkleTick      = 0;
var twinkleToggle    = true;
var systemToggle     = false;

// ************************************************************************************************************

var scaleFactor;
let numAssets        = 50;
let deathTick        = 1;

// ************************************************************************************************************

let genNode          = [];

let genRadius        = [ 400, 600, 800 ];
let genRadiusLen     = genRadius.length;

let nodeScale        = [ 150, 300, 500 ];
let nodeScaleLen     = nodeScale.length;

let ySpeedArray      = [ -0.1, 0.1 ];
let ySpeedArrayLen   = ySpeedArray.length;

let zSpeedArray      = [ -0.1, 0.1 ];
let zSpeedArrayLen   = zSpeedArray.length;

let rotSpeedArray    = [ -0.003, -0.005, 0.005, 0.003 ];
let rotSpeedArrayLen = rotSpeedArray.length;

let blueprintX       = [];
let blueprintY       = [];
let blueprintZ       = [];

let blueprintS       = 100;
let blueprintM       = 20;

// ************************************************************************************************************

let baseSize         = 1240;
let myTextures       = [];
var numTextures      = 5;
var texLoaded        = 0;

// ************************************************************************************************************

let glitchNum        = 22;
let glitchCanvas;
let glitchString;
let starNum          = 111;
let starCanvas;

// ************************************************************************************************************

var grainCanvas;
var grainMaxGrey     = 255;
var grainMaxAlpha    = 32;
var numOctaves       = 1;
var noisePersistence = 0.5;
var grainXMod        = 1.1;
var grainYMod        = 1.1;

// ************************************************************************************************************

let bgClr;

let clrs = [
	['#245e79', '#CCCCCC', '#8f7788', '#412049', '#e7070e', '#066505'],
	['#ffffff', '#af939f', '#5b274b', '#066505', '#b5e655'],
	['#ffffff', '#8f7788', '#5b274b', '#412049', '#245e79'],
	['#af939f', '#8f7788', '#5b274b', '#e7070e', '#ff530d']
];

let clrString;
let allClrsMax       = [100, 1000, 4000];
let tempClrMax;
let clrStart;

function buildColors(_i, _whichClr, _tempClrMax) {
	let whichClr         = clrs[_whichClr];
	let whichClrLen      = whichClr.length;
	let clrCnt           = -1;
	let clrMaxPerLerp    = floor( _tempClrMax / whichClrLen );
	for (let j = 0; j < _tempClrMax; ++j) {
		if( j%clrMaxPerLerp ==0 ) clrCnt = (clrCnt+1)%whichClrLen;
		let c1               = color( whichClr[clrCnt] );
		let c2               = color( whichClr[(clrCnt+1)%whichClrLen] );
		paramsClrs[_i].push(  lerpColor( c1, c2, map(j, (clrCnt*clrMaxPerLerp), (((clrCnt+1))*clrMaxPerLerp), 0.0, 1.0) ) );
	}
}

// ************************************************************************************************************

let paramsRunning    = [];
let blueprintRunning = [];

let paramsRadius     = [];
let paramsYAngle     = [];
let paramsZAngle     = [];
let paramsYSpeed     = [];
let paramsZSpeed     = [];

let paramsScale      = [];
let paramsScaleMin   = [];
let paramsScaleMax   = [];

let paramsRotSpeed   = [];

let paramsClrsI      = [];
let paramsClrsM      = [];
let paramsClrs       = [];
let paramsClrStart;
let paramsClrBG;

let paramsTextureM;
let paramsTexture    = [];

let paramsGlitch;
let paramsGlitchX    = [];
let paramsGlitchY    = [];
let paramsGlitchS    = [];

let paramsStarX      = [];
let paramsStarY      = [];
let paramsStarG      = [];
let paramsStarGA     = [];
let paramsStarS      = [];
let paramsStarSA     = [];

function initParams() {
	let prob0 = getOneF(1);
	if      (prob0 < 0.75) { paramsTextureM = 5 }
	else if (prob0 < 0.80) { paramsTextureM = 0 }
	else if (prob0 < 0.85) { paramsTextureM = 1 }
	else if (prob0 < 0.90) { paramsTextureM = 2 }
	else if (prob0 < 0.95) { paramsTextureM = 3 }
	else                   { paramsTextureM = 4 }

	switch (paramsTextureM) {
		case 0 : genNodeBrushStr = "brush 0"; break;
		case 1 : genNodeBrushStr = "brush 1"; break;
		case 2 : genNodeBrushStr = "brush 2"; break;
		case 3 : genNodeBrushStr = "brush 3"; break;
		case 4 : genNodeBrushStr = "brush 4"; break;
		case 5 : genNodeBrushStr = "mixed brushes"; break;
	}

	for (let i = 0; i < numAssets; ++i) {
		paramsRunning[i]    = true;
		blueprintRunning[i] = true;

		let prob1 = genRadius[getOneI(genRadiusLen)];
		switch (prob1) {
			case genRadius[0] : genNodeOrbit1++; break;
			case genRadius[1] : genNodeOrbit2++; break;
			case genRadius[2] : genNodeOrbit3++; break;
		}
		genNodeOrbitStr = genNodeOrbit1 + "." + genNodeOrbit2 + "." + genNodeOrbit3;

		paramsRadius[i]  = prob1;
		paramsYAngle[i]  = getOneI(360);
		paramsZAngle[i]  = getOneI(360);
		paramsYSpeed[i]  = ySpeedArray[getOneI(ySpeedArrayLen)];
		paramsZSpeed[i]  = zSpeedArray[getOneI(zSpeedArrayLen)];

		let prob2 = getOneF(1);

		if(paramsTextureM==4) {
			if      (prob2 < 0.50) { paramsScale[i] = nodeScale[2]; genNodeScale3++; }
			else if (prob2 < 0.98) { paramsScale[i] = nodeScale[1]; genNodeScale2++; }
			else                   { paramsScale[i] = nodeScale[0]; genNodeScale1++; }
		} else {
			if      (prob2 < 0.50) { paramsScale[i] = nodeScale[2]; genNodeScale3++; }
			else if (prob2 < 0.70) { paramsScale[i] = nodeScale[1]; genNodeScale2++; }
			else                   { paramsScale[i] = nodeScale[0]; genNodeScale1++; }
		}
		genNodeScaleStr = genNodeScale1 + "." + genNodeScale2 + "." + genNodeScale3;

		paramsScaleMin[i] = 1.1 + (getOneI(4)*0.5);
		paramsScaleMax[i] = 0.3 + (getOneI(4)*0.2);

		paramsRotSpeed[i] = rotSpeedArray[getOneI(rotSpeedArrayLen)];

		paramsClrs[i] = [];
		let prob3 = getOneF(1);
		if      (prob3 < 0.50) paramsClrsM[i] = allClrsMax[2];
		else if (prob3 < 0.75) paramsClrsM[i] = allClrsMax[1];
		else                   paramsClrsM[i] = allClrsMax[0];
		paramsClrsI[i] = getOneI(3)+1;

		switch (paramsTextureM) {
			case 5 : paramsTexture[i] = getOneI(5); break;
			case 0 : paramsTexture[i] = 0; break;
			case 1 : paramsTexture[i] = 1; break;
			case 2 : paramsTexture[i] = 2; break;
			case 3 : paramsTexture[i] = 3; break;
			case 4 : paramsTexture[i] = 4; break;
		}
	}

	paramsClrStart = getOneI(500);
	paramsClrBG    = getOneI( clrs[0].length );

	let prob4 = getOneF(1);
	if      (prob4 < 0.03) { paramsGlitch = 2; glitchString = "atomic"; glitchNum = Math.floor(glitchNum/2) }
	else if (prob4 < 0.13) { paramsGlitch = 1; glitchString = "subtle knife"; }
	else                   { paramsGlitch = 0; glitchString = "none"; }

	for (let i = 0; i < glitchNum; ++i) {
		paramsGlitchX[i] = getRangeI( -0, (stageW+0) );
		paramsGlitchY[i] = getRangeI( -500, (stageH+500) );
		switch (paramsGlitch) {
			case 2 : paramsGlitchS[i] = 1 + (getOneI(3)*50); break;
			case 1 : paramsGlitchS[i] = getRangeF( 1.0, 2.0 ); break;
			case 0 : paramsGlitchS[i] = getRangeF( 1.0, 2.0 ); break;
		}
	}

	for (let i = 0; i < starNum; ++i) {
		paramsStarX[i]  = getRangeI( 25, (stageW-50) );
		paramsStarY[i]  = getRangeI( 25, (stageH-50) );
		paramsStarG[i]  = getRangeI( 2, 5 );
		paramsStarGA[i] = 10 + (getOneI(3)*5);

		paramsStarS[i]  = getRangeI( 2, 9 );
		paramsStarSA[i] = 150 + (getOneI(5)*25);
	}

	switch (paramsClrBG) {
		case 0 : clrString = "ocean"; break;
		case 1 : clrString = "mist"; break;
		case 2 : clrString = "lilac"; break;
		case 3 : clrString = "amethyst"; break;
		case 4 : clrString = "crimson"; break;
		case 5 : clrString = "emerald"; break;
	}

	$fx.features({
		"Orbit Base Color": clrString,
		"Orbit Glitch": glitchString,
		"Orbit Pattern": genNodeOrbitStr,
		"Orbit Scaling": genNodeScaleStr,
		"Orbit Brush": genNodeBrushStr
	});
}

function getOneF(singleNumber) { return singleNumber*fxrand();        }
function getOneI(singleNumber) { return Math.floor(singleNumber*fxrand());   }
function getRangeF(min, max)   { return min +(max-min)*fxrand();      }
function getRangeI(min, max)   { return Math.floor(min +(max-min)*fxrand()); }

initParams();

// ************************************************************************************************************

function preload() {
	setupSVG();
	seed = int(fxrand() * 999999);

	for (let i = 0; i < numAssets; ++i) {
		buildColors(i, paramsClrsI[i], paramsClrsM[i]);
	}
}

// ************************************************************************************************************

function setup() {
	myCanvas = createCanvas(stageW, stageH);
	setTimeout( () => document.body.appendChild(document.querySelector(".p5Canvas")), 0	);

	bgClr = clrs[0][ paramsClrBG ];

	myCanvas1 = createGraphics(stageW, stageH);
	myCanvas1.imageMode(CENTER);
	myCanvas1.clear();

	myCanvasBlueprint1 = createGraphics(stageW, stageH); myCanvasBlueprint1.clear();
	myCanvasBlueprint2 = createGraphics(stageW, stageH); myCanvasBlueprint2.clear();

	myCanvasOrbit1 = createGraphics(stageW, stageW);
	myCanvasOrbit1.rectMode(CENTER);
	myCanvasOrbit1.clear();
	myCanvasOrbit1.strokeWeight(0);
	myCanvasOrbit1.noStroke();
	myCanvasOrbit1.fill(0,55);
	myCanvasOrbit1.ellipse(stageW/2,stageW/2,stageW,stageW);
	myCanvasOrbit1.fill(bgClr);
	myCanvasOrbit1.ellipse(stageW/2,stageW/2,stageW-100,stageW-100);
	myCanvasOrbit1.fill(0,20);
	myCanvasOrbit1.ellipse(stageW/2,stageW/2,stageW-100,stageW-100);

	myCanvasOrbit2 = createGraphics(stageW, stageW);
	myCanvasOrbit2.rectMode(CENTER);
	myCanvasOrbit2.clear();
	myCanvasOrbit2.strokeWeight(0);
	myCanvasOrbit2.noStroke();
	myCanvasOrbit2.fill(0,55);
	myCanvasOrbit2.ellipse(stageW/2,stageW/2,stageW,stageW);
	myCanvasOrbit2.fill(bgClr);
	myCanvasOrbit2.ellipse(stageW/2,stageW/2,stageW-100,stageW-100);
	myCanvasOrbit2.fill(0,20);
	myCanvasOrbit2.ellipse(stageW/2,stageW/2,stageW-100,stageW-100);

	myCanvasOrbit3 = createGraphics(stageW, stageW);
	myCanvasOrbit3.rectMode(CENTER);
	myCanvasOrbit3.clear();
	myCanvasOrbit3.strokeWeight(0);
	myCanvasOrbit3.noStroke();
	myCanvasOrbit3.fill(0,55);
	myCanvasOrbit3.ellipse(stageW/2,stageW/2,stageW,stageW);
	myCanvasOrbit3.fill(bgClr);
	myCanvasOrbit3.ellipse(stageW/2,stageW/2,stageW-100,stageW-100);
	myCanvasOrbit3.fill(0,20);
	myCanvasOrbit3.ellipse(stageW/2,stageW/2,stageW-100,stageW-100);

	glitchCanvas = createGraphics( stageW, stageH );
	starCanvas = createGraphics( stageW, stageH );

	for (let i = 0; i < numAssets; ++i) {
		genNode[i] = new NodeClass(i, 0, 0, 0);
	}

	glitchCanvas.rectMode(CENTER);
	for (let i = 0; i < glitchNum; ++i) {
		glitchCanvas.push();
			glitchCanvas.translate( paramsGlitchX[i], paramsGlitchY[i], 0 );
			glitchCanvas.noFill();
			glitchCanvas.strokeWeight(paramsGlitchS[i]);
			let _glitchClr = paramsClrs[i%numAssets][ ((frameCount*1)+paramsClrStart)%paramsClrs[i%numAssets].length ];
			_glitchClr.setAlpha( 1 );
			glitchCanvas.stroke(_glitchClr);
			glitchCanvas.line(0, -777, 0, 777);

		glitchCanvas.pop();
	}

	twinkleStars();

	var myNoise = new NOISE.Simplex()
	myNoise.init();
	myNoise.noiseDetail(numOctaves, noisePersistence);

	grainCanvas = createGraphics(stageW, stageH);
	grainCanvas.background(0);
	var pxDensity = grainCanvas.pixelDensity();
	grainCanvas.loadPixels();
	for (let i = 0; i < grainCanvas.width * pxDensity; i++) {
		for (let a = 0; a < grainCanvas.height * pxDensity; a++) {
			const s = 4 * (i + a * grainCanvas.width * pxDensity);
			var o = myNoise.noise(
				Math.round(i / pxDensity / grainCanvas.width  * grainXMod  * 2000), 
				Math.round(a / pxDensity / grainCanvas.height * grainYMod * 2000)
			) * grainMaxGrey;
			grainCanvas.pixels[s]     = Math.min(255, Math.max(0, o)),
			grainCanvas.pixels[s + 1] = Math.min(255, Math.max(0, o)),
			grainCanvas.pixels[s + 2] = Math.min(255, Math.max(0, o)),
			grainCanvas.pixels[s + 3] = grainMaxAlpha;
		}
	}
	grainCanvas.updatePixels();
}

// ************************************************************************************************************

function draw() {
	background(bgClr);
	blendMode(BLEND);
	noFill();

	if(useMat) {
		strokeWeight(matSize+15);
		stroke(0, 40);
		rect(0, 0, stageW, stageH);
	}

	push();
		translate(stageW/2, stageH/2);

		myCanvas1.blendMode(BLEND);

		if (texLoaded == numTextures) {
			for (let i = 0; i < numAssets; ++i) {
				genNode[i].move();
				if( genNode[i].curScale>0 ) genNode[i].display();
			}
		}

		if(twinkleToggle) { twinkleStars(); twinkleTick++; }

		if(orbitToggle) { orbitSystem(); orbitTick++; }
		image(myCanvasBlueprint1, halfStageW, halfStageH);
		image(myCanvasBlueprint2, halfStageW, halfStageH);

		if(!systemToggle) {
			image(myCanvas1, halfStageW, halfStageH);
			image(starCanvas, halfStageW, halfStageH);
		}

		orbitBlueprint();
		if(systemToggle) {
			image(myCanvasOrbit2, -(blueprintS/2),                                  (stageH/2)-(blueprintS+(blueprintM)+35 ), blueprintS, blueprintS);
			image(myCanvasOrbit1,  (blueprintS/2) + (blueprintM/2),                 (stageH/2)-(blueprintS+(blueprintM)+35 ), blueprintS, blueprintS);
			image(myCanvasOrbit3, -(blueprintS + (blueprintS/2) + (blueprintM/2) ), (stageH/2)-(blueprintS+(blueprintM)+35 ), blueprintS, blueprintS);
		}

		if(paramsGlitch!=0) {
			blendMode(REMOVE);
			myCanvas1.blendMode(REMOVE);
			myCanvas1.image(glitchCanvas, stageW/2, stageH/2);
		}
	pop();

// ************************************************************************************************************

	blendMode(BLEND);
	noFill();

	if(useMat) {
		let matClr = color(bgClr);
		strokeWeight(matSize);
		matClr.setAlpha( 255 );
		stroke(matClr);
		rect(0, 0, stageW, stageH);

		strokeWeight(1);
		stroke(0,120);
		rect( (matSize/2), (matSize/2), stageW-(matSize), stageH-(matSize) );
	}

// ************************************************************************************************************

	blendMode(ADD);
	image(grainCanvas, 0, 0);
	blendMode(BLEND);
}

// ************************************************************************************************************

function twinkleStars() {
	starCanvas.clear();

	for (let i = 0; i < starNum; ++i) {
		starCanvas.push();
			starCanvas.translate( paramsStarX[i], paramsStarY[i], 0 );
			starCanvas.strokeWeight(0);
			starCanvas.noStroke();

			let _starClr = paramsClrs[i%numAssets][ ((twinkleTick*1)+paramsClrStart)%paramsClrs[i%numAssets].length ];

			_starClr.setAlpha( map( sin((twinkleTick*0.05)+i), -1.0, 1.0, 0.1, paramsStarGA[i]) );
			starCanvas.fill(_starClr);
			starCanvas.ellipse(0, 0, paramsStarS[i]*paramsStarG[i], paramsStarS[i]*paramsStarG[i]);

			_starClr.setAlpha( map( sin((twinkleTick*0.05)+i), -1.0, 1.0, 0.1, paramsStarSA[i])  );
			starCanvas.fill(_starClr);
			starCanvas.ellipse(0, 0, paramsStarS[i], paramsStarS[i]);
		starCanvas.pop();
	}
}

// ************************************************************************************************************

function orbitSystem() {
	myCanvasBlueprint2.clear();

	for (let i = 0; i < numAssets; ++i) {
		if(i%5==0) {
			if(paramsRunning[i]) {
				myCanvasBlueprint1.push();
				myCanvasBlueprint1.translate(stageW/2, stageH/2, 0);
				myCanvasBlueprint1.push();
					myCanvasBlueprint1.translate(blueprintX[i], blueprintY[i], blueprintZ[i]);
					myCanvasBlueprint1.strokeWeight(0);
					myCanvasBlueprint1.noStroke();
					myCanvasBlueprint1.fill( paramsClrs[i][ ((orbitTick)+paramsClrStart) % paramsClrs[i].length ] );
					switch (paramsRadius[i]) {
						case genRadius[0] : myCanvasBlueprint1.ellipse(0, 0, 6); break;
						case genRadius[1] : myCanvasBlueprint1.ellipse(0, 0, 4); break;
						case genRadius[2] : myCanvasBlueprint1.ellipse(0, 0, 2); break;
					}
				myCanvasBlueprint1.pop();
				myCanvasBlueprint1.pop();

				myCanvasBlueprint2.push();
				myCanvasBlueprint2.translate(stageW/2, stageH/2, 0);
				myCanvasBlueprint2.push();
					myCanvasBlueprint2.translate(blueprintX[i], blueprintY[i], blueprintZ[i]);
					myCanvasBlueprint2.noFill();
					myCanvasBlueprint2.stroke( "#FFFFFF" );
					myCanvasBlueprint2.strokeWeight(1);
					switch (paramsRadius[i]) {
						case genRadius[0] : myCanvasBlueprint2.ellipse(0, 0, 8); break;
						case genRadius[1] : myCanvasBlueprint2.ellipse(0, 0, 7); break;
						case genRadius[2] : myCanvasBlueprint2.ellipse(0, 0, 6); break;
					}
				myCanvasBlueprint2.pop();
				myCanvasBlueprint2.pop();
			}
		}
	}
}

// ************************************************************************************************************

function orbitBlueprint() {
	for (let i = 0; i < numAssets; ++i) {
		if(blueprintRunning[i]) {
			switch (paramsRadius[i]) {
				case genRadius[0] :
					myCanvasOrbit1.push();
					myCanvasOrbit1.translate(stageW/2, stageW/2, 0);
					myCanvasOrbit1.scale(1.1);
					myCanvasOrbit1.push();
						myCanvasOrbit1.translate(blueprintX[i], blueprintY[i], blueprintZ[i]);
						myCanvasOrbit1.strokeWeight(0);
						myCanvasOrbit1.noStroke();
						myCanvasOrbit1.fill( paramsClrs[i][ ((frameCount)+paramsClrStart) % paramsClrs[i].length ] );
						myCanvasOrbit1.ellipse(0, 0, 50);
					myCanvasOrbit1.pop();
					myCanvasOrbit1.pop();
				break;
				case genRadius[1] :
					myCanvasOrbit2.push();
					myCanvasOrbit2.translate(stageW/2, stageW/2, 0);
					myCanvasOrbit2.scale(0.7);
					myCanvasOrbit2.push();
						myCanvasOrbit2.translate(blueprintX[i], blueprintY[i], blueprintZ[i]);
						myCanvasOrbit2.strokeWeight(0);
						myCanvasOrbit2.noStroke();
						myCanvasOrbit2.fill( paramsClrs[i][ ((frameCount)+paramsClrStart) % paramsClrs[i].length ] );
						myCanvasOrbit2.ellipse(0, 0, 75);
					myCanvasOrbit2.pop();
					myCanvasOrbit2.pop();
				break;
				case genRadius[2] :
					myCanvasOrbit3.push();
					myCanvasOrbit3.translate(stageW/2, stageW/2, 0);
					myCanvasOrbit3.scale(0.52);
					myCanvasOrbit3.push();
						myCanvasOrbit3.translate(blueprintX[i], blueprintY[i], blueprintZ[i]);
						myCanvasOrbit3.strokeWeight(0);
						myCanvasOrbit3.noStroke();
						myCanvasOrbit3.fill( paramsClrs[i][ ((frameCount)+paramsClrStart) % paramsClrs[i].length ] );
						myCanvasOrbit3.ellipse(0, 0, 95);
					myCanvasOrbit3.pop();
					myCanvasOrbit3.pop();
				break;
			}
		}
	}
}

// ************************************************************************************************************

class NodeClass {
	constructor(_i,_x,_y,_z) {
		this.tick = 0;
		this.i = _i;
		this.x = _x;
		this.y = _y;
		this.z = _z;

		this.death = 0;
		this.deathToggleNeg = false;
		this.deathTogglePos = true;
		this.loopTrigger    = false;

		this.startX  = 0;
		this.startY  = 0;
		this.startZ  = 0;
		this.targetX = 0;
		this.targetY = 0;
		this.targetZ = 0;

		this.radius = paramsRadius[this.i];
		this.yAngle = paramsYAngle[this.i];
		this.zAngle = paramsZAngle[this.i];
		this.ySpeed = paramsYSpeed[this.i];
		this.zSpeed = paramsZSpeed[this.i];

		this.scale = paramsScale[this.i];
		this.whichRanScaleMin = paramsScaleMin[this.i];
		this.whichRanScaleMax = paramsScaleMax[this.i];
		this.curScale = this.scale;

		this.targetRotZ = 0;
		this.targetRotS = paramsRotSpeed[this.i];

		this.clrMax = paramsClrs[this.i].length;

		this.whichTex = paramsTexture[this.i];
	}

	move() {
		if ( this.curScale <= 0 ) {
			this.deathToggleNeg = true;
			if (this.deathToggleNeg && this.deathTogglePos) {
				this.death++;
				this.deathTogglePos = false;

				this.curScale = paramsScale[this.i];
				this.loopTrigger = true; 
			}
		} else {
			this.deathToggleNeg = false;
			this.deathTogglePos = true;
		}

		this.startX = this.x;
		this.startY = this.y;
		this.startZ = this.z;

		this.s = radians(this.yAngle);
		this.t = radians(this.zAngle);

		this.targetX = this.radius * cos(this.s) * sin(this.t) + this.startX;
		this.targetY = this.radius * sin(this.s) * sin(this.t) + this.startY;
		this.targetZ = this.radius * cos(this.t) + this.startZ;

		this.yAngle += this.ySpeed;
		this.zAngle += this.zSpeed;

		this.targetRotZ = map( sin((this.tick+this.i)*this.targetRotS), -1.0, 1.0, -180, 180 ) ;

		if(this.death < deathTick) {
			this.curScale = map( sin(this.tick*0.008), -1.0, 1.0, this.scale-(this.scale*this.whichRanScaleMin), this.scale+(this.scale*this.whichRanScaleMax) ) ;
		} else {
			this.curScale = -0.1;
			blueprintRunning[this.i] = false;
		}
		this.tick++;

		if(letsLoop && this.loopTrigger) {
			this.loopTrigger = false;
			this.tick = 0;
			this.death = 0;

			this.startX = 0;
			this.startY = 0;
			this.startZ = 0;

			this.yAngle = paramsYAngle[this.i];
			this.zAngle = paramsZAngle[this.i];
			this.curScale = 0.1;
			this.targetRotZ = 0;
		}

		blueprintX[this.i] = this.targetX;
		blueprintY[this.i] = this.targetY;
		blueprintZ[this.i] = this.targetZ;
	}

	display() {
		if(this.scale>0) {
			myCanvas1.push();
				myCanvas1.translate(stageW/2, stageH/2, 0);
					myCanvas1.push();
						myCanvas1.translate(this.targetX, this.targetY, this.targetZ);

						myCanvas1.strokeWeight( 0 );
						myCanvas1.noStroke();
						myCanvas1.fill(255);

						let orbitClr = paramsClrs[this.i][ ((this.tick*1)+paramsClrStart)%this.clrMax ];
						orbitClr.setAlpha( 225 );
						myCanvas1.tint( orbitClr );

						myCanvas1.push();
							myCanvas1.scale(this.curScale);
							myCanvas1.rotate( radians(this.targetRotZ) );
							myCanvas1.image(myTextures[ this.whichTex ], 0, 0, 1, 1);
						myCanvas1.pop();
					myCanvas1.pop();
			myCanvas1.pop();
		}
	}
}

// ************************************************************************************************************

function keyTyped() {
	if      (key === '1') { bgClr = clrs[0][0]; }
	else if (key === '2') { bgClr = clrs[0][1]; }
	else if (key === '3') { bgClr = clrs[0][2]; }
	else if (key === '4') { bgClr = clrs[0][3]; }
	else if (key === '5') { bgClr = clrs[0][4]; }
	else if (key === '6') { bgClr = clrs[0][5]; }

	else if (key === 'l') { letsLoop = !letsLoop; }
	else if (key === 's') { systemToggle = !systemToggle; }

	else if (key === 'g') { paramsGlitch = !paramsGlitch; }
	else if (key === 't') { twinkleToggle = !twinkleToggle; }
	else if (key === 'o') { orbitToggle = !orbitToggle; }
	else if (key === 'r') { orbitToggle=true; twinkleToggle=true; }
	else if (key === 'p') { orbitToggle=false; twinkleToggle=false; letsLoop=false; systemToggle=false; }
	else if (key === 'm') { useMat = !useMat; }

	return false;
}

// ************************************************************************************************************

var NOISE = NOISE || { };
NOISE.Simplex = (function() {
	var iOctaves = 1, fPersistence = 0.5, fResult, fFreq, fPers, aOctFreq, aOctPers, fPersMax;

	var octaveFreq = function() {
		var fFreq, fPers;
		aOctFreq = new Array();
		aOctPers = new Array();
		fPersMax = 0;

		for (var i=0; i < iOctaves; i++) {
			fFreq = Math.pow(2,i);
			fPers = Math.pow(fPersistence, i);
			fPersMax += fPers;
			aOctFreq.push(fFreq);
			aOctPers.push(fPers);
		}
		fPersMax = 1 / fPersMax;
	}

	var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
	var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

	var perm = new Uint8Array(512);
	var permMod12 = new Uint8Array(512);

	var p = new Uint8Array(256);

	var grad3 = new Float32Array( [1,1,0, -1,1,0, 1,-1,0, -1,-1,0,1,0,1, -1,0,1, 1,0,-1, -1,0,-1,0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1] );

	function seed(x) {
		x = (x<<13) ^ x;
		return ( 1.0 - ( (x * (x * x * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
	}    

	function init() {
		for (var i = 0; i < 256; i++) {
			p[i] = Math.abs(~~(seed(i) * 256));
		}
		for (var i=0; i < 512; i++) {
			perm[i] = p[i & 255];
			permMod12[i] = perm[i] % 12;
		}
	}    

	function noise2D (xin, yin) {
		var n0, n1, n2, i1, j1;
		var s = (xin + yin) * F2;
		var i = Math.floor(xin + s);
		var j = Math.floor(yin + s);
		var t = (i + j) * G2;
		var X0 = i - t;
		var Y0 = j - t;
		var x0 = xin - X0;
		var y0 = yin - Y0;
		if (x0 > y0) { i1 = 1; j1 = 0}
		else {i1 = 0; j1 = 1}
		var x1 = x0 - i1 + G2;
		var y1 = y0 - j1 + G2;
		var x2 = x0 - 1.0 + 2.0 * G2;
		var y2 = y0 - 1.0 + 2.0 * G2;
		var ii = i & 255;
		var jj = j & 255;
		var t0 = 0.5 - x0*x0 - y0*y0;

		if(t0 < 0) n0 = 0.0;
		else {
			var gi0 = permMod12[ii+perm[jj]];
			t0 *= t0;
			n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0+1] * y0);
		}

		var t1 = 0.5 - x1*x1 - y1*y1;
		if (t1 < 0 ) n1 = 0.0;
		else {
			var gi1 = permMod12[ii + i1 + perm[jj+j1]];
			t1 *= t1;
			n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1+1] * y1);
		}

		var t2 = 0.5 - x2*x2 - y2*y2;
		if (t2 < 0 ) n2 = 0.0;
		else {
			var gi2 = permMod12[ii + 1 + perm[jj+1]];
			t2 *= t2;
			n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2+1] * y2);
		}
		return 70.0 * (n0 + n1 + n2);
	}

	function SimplexNoise(){}

	SimplexNoise.prototype = {
		init : init,
		noise : function(x, y) {
			fResult = 0;
			for (var i=0; i < iOctaves; i++) {
				fFreq = aOctFreq[i];
				fPers = aOctPers[i];

				fResult += fPers * noise2D(fFreq*x, fFreq*y);
			}
			return (fResult * fPersMax + 1) * 0.5;
		},
		noiseDetail : function(octaves, persistance) {
			iOctaves = octaves || iOctaves;
			fPersistence = persistance || fPersistence;
			octaveFreq();
		}
	}
	return SimplexNoise;
}).call(this);

// ************************************************************************************************************

function setupSVG() {
	for (let i = 0; i < 5; ++i) {
		let tex = eval("texture"+i);
		svgToPng( tex, baseSize, baseSize).then(value => {
			loadImage(value, (img) => {
				image(img, 0, 0);
				background(255,255,255);
				clear();
				texLoaded++;
				myTextures[i] = img;
			});
		});
	}
}

var svgToPng = function (svgText, w, h) {
	return new Promise(function(resolve, reject) {
		try {
			var domUrl = window.URL || window.webkitURL || window;
			if (!domUrl) { throw new Error("(browser doesnt support this)"); }
			svgText = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">' + svgText + '</svg>';
			var canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			var ctx = canvas.getContext("2d");
			var svg = new Blob([svgText], {type: "image/svg+xml;charset=utf-8"});
			var url = domUrl.createObjectURL(svg);
			var img = new Image;
			img.onload = function() {
				ctx.drawImage(this, 0, 0);
				domUrl.revokeObjectURL(url);
				resolve(canvas.toDataURL());
			};
			img.src = url;
			} catch (err) {
				reject('failed to convert svg to png ' + err);
			}
		}
	);
}

let so='<style type="text/css">'
let sc="</style>";

var texture0=so+`
.st0{
	stroke:#000000;
	stroke-opacity:0.3;
	stroke-width:0.6;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:none;
	}
.st1{
	fill:#FFFFFF;
	fill-opacity:0.02;
	}
.st2{
	stroke:#000000;
	stroke-opacity:0.5;
	stroke-width:0.8;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:#FFFFFF;
	fill-opacity:0.75;
	}
`+sc+`
<circle class="st0" cx="250" cy="250" r="150"/>
<circle class="st1" cx="250" cy="250" r="140"/>
<circle class="st2" cx="250" cy="250" r="50"/>
<circle class="st0" cx="750" cy="750" r="40"/>
<circle class="st1" cx="750" cy="750" r="40"/>
<circle class="st2" cx="750" cy="750" r="10"/>
`;

var texture1=so+`
.st0{
	stroke-width:0.0;
	stroke:none;
	fill:#FFFFFF;
	}
`+sc+`
<circle class="st0" cx="750" cy="750" r="20"/>
<circle class="st0" cx="250" cy="250" r="60"/>
<circle class="st0" cx="150" cy="250" r="2.5"/>
<circle class="st0" cx="320" cy="250" r="2.5"/>
<circle class="st0" cx="250" cy="320" r="2.5"/>
<circle class="st0" cx="250" cy="180" r="2.5"/>
`;

var texture2=so+`
.st0{
	stroke:#000000;
	stroke-opacity:0.5;
	stroke-width:0.5;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:#FFFFFF;
	fill-opacity:1.0;
	}
.st1{
	stroke-width:0.0;
	stroke:none;
	fill:#FFFFFF;
	fill-opacity:0.1;
	}
.st2{
	stroke:#000000;
 	stroke-opacity:0.5;
	stroke-width:1.0;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:none;
	}
.st3{
	stroke-width:0.0;
	stroke:none;
	fill:#FFFFFF;
	}
`+sc+`
<polygon class="st0" points="799.2,562.6 584.2,673.4 830.2,664.8 "/>
<polygon class="st1" points="937.7,545.9 799.2,562.6 830.2,664.8 "/>
<line class="st2" x1="0" y1="600.6" x2="584.2" y2="673.4"/>
<line class="st2" x1="1000" y1="507.1" x2="937.7" y2="545.9"/>
<circle class="st3" cx="454.7" cy="462.8" r="2.4"/>
<circle class="st3" cx="503.6" cy="468.7" r="2.4"/>
<circle class="st3" cx="552.5" cy="474.5" r="2.4"/>
<circle class="st3" cx="601.4" cy="480.4" r="2.4"/>
<circle class="st3" cx="650.3" cy="486.3" r="2.4"/>
<circle class="st3" cx="699.2" cy="492.1" r="2.4"/>
<circle class="st3" cx="748.1" cy="498" r="2.4"/>
<circle class="st3" cx="797" cy="503.8" r="2.4"/>
<circle class="st3" cx="845.9" cy="509.7" r="2.4"/>
<circle class="st3" cx="894.8" cy="515.5" r="2.4"/>
<circle class="st3" cx="479.2" cy="544.8" r="3.3"/>
<circle class="st3" cx="625.8" cy="562.4" r="3.3"/>
<circle class="st3" cx="454.7" cy="615.1" r="4.1"/>
<circle class="st3" cx="430.3" cy="691.2" r="4.9"/>
`;

var texture3=so+`
.st0{
	stroke-width:0.0;
	stroke:none;
	fill:#FFFFFF;
	fill-opacity:0.5;
	}
.st1{
	stroke-width:0.0;
	stroke:none;
	fill:#FFFFFF;
	fill-opacity:0.75;
	}
.st2{
	stroke-width:0.0;
	stroke:none;
	fill:#000000;
	fill-opacity:0.2;
	}
.st3{
	stroke-width:0.0;
	stroke:none;
	fill:#000000;
	fill-opacity:0.4;
	}
.st4{
	stroke-width:0.0;
	stroke:none;
	fill:#FFFFFF;
	fill-opacity:0.1;
	}
`+sc+`
<circle class="st0" cx="0" cy="350" r="200"/>
<circle class="st2" cx="0" cy="120" r="20"/>
<circle class="st3" cx="0" cy="120" r="5"/>
<circle class="st4" cx="0" cy="40" r="40"/>
<circle class="st1" cx="0" cy="40" r="20"/>
<circle class="st2" cx="0" cy="580" r="20"/>
<circle class="st3" cx="0" cy="580" r="5"/>
<circle class="st4" cx="0" cy="700" r="10"/>
<circle class="st1" cx="0" cy="700" r="5"/>
`;

var texture4=so+`
.st0{
	fill:#FFFFFF;
	fill-opacity:0.1;
	}
.st1{
	stroke:#000000;
	stroke-opacity:0.15;
	stroke-width:20;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:none;
	}
.st2{
	stroke:#000000;
	stroke-opacity:0.3;
	stroke-width:5;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	enable-background:new;
	fill:none;
	}
.st3{
	fill:#FFFFFF;
	fill-opacity:1.0;
	}
.st4{
	stroke:#FFFFFF;
	stroke-opacity:0.2;
	stroke-width:10;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:none;
	}
.st5{
	stroke:#FFFFFF;
	stroke-opacity:0.2;
	stroke-width:20;
	stroke-linecap:round;
	stroke-linejoin:round;
	stroke-miterlimit:10;
	fill:none;
	}
`+sc+`
<circle class="st2" cx="250" cy="250" r="81.25"/>
<path class="st0" d="M250,136.25c62.13,0,112.5,50.37,112.5,112.5s-50.37,112.5-112.5,112.5s-112.5-50.37-112.5-112.5S187.87,136.25,250,136.25z M331.25,248.75c0-44.88-36.38-81.25-81.25-81.25s-81.25,36.38-81.25,81.25S205.12,330,250,330S331.25,293.62,331.25,248.75z"/>
<circle class="st1" cx="307.5" cy="136.25" r="5"/>
<circle class="st2" cx="307.5" cy="136.25" r="5"/>
<circle class="st3" cx="307.5" cy="136.25" r="5"/>
<circle class="st1" cx="162.5" cy="358.75" r="5"/>
<circle class="st2" cx="162.5" cy="358.75" r="5"/>
<circle class="st3" cx="162.5" cy="358.75" r="5"/>
<circle class="st4" cx="210" cy="248.75" r="2.5"/>
<circle class="st4" cx="290" cy="248.75" r="2.5"/>
<circle class="st4" cx="250" cy="208.75" r="2.5"/>
<circle class="st4" cx="250" cy="288.75" r="2.5"/>
<circle class="st3" cx="210" cy="248.75" r="2.5"/>
<circle class="st3" cx="290" cy="248.75" r="2.5"/>
<circle class="st3" cx="250" cy="208.75" r="2.5"/>
<circle class="st3" cx="250" cy="288.75" r="2.5"/>
<circle class="st5" cx="150" cy="248.75" r="6.25"/>
<circle class="st5" cx="350" cy="248.75" r="6.25"/>
<circle class="st5" cx="250" cy="148.75" r="6.25"/>
<circle class="st5" cx="250" cy="348.75" r="6.25"/>
<circle class="st3" cx="150" cy="248.75" r="6.25"/>
<circle class="st3" cx="250" cy="348.75" r="6.25"/>
<circle class="st3" cx="350" cy="248.75" r="6.25"/>
<circle class="st3" cx="250" cy="148.75" r="6.25"/>
`;