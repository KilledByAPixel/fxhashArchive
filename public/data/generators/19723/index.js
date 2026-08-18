// Created by Koboljka, 2022

// these are the variables you can use as inputs to your algorithms
console.log(fxhash) // the 64 chars hex number fed to your algorithm
console.log(fxrand()) // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function 
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//	 "Background": "Black",
//	 "Number of lines": 10,
//	 "Inverted": true
// }

let koboljkaWidth = 600;
let koboljkaHeight = 600;
let rotRnd;
let palettes, nagibi_array, palette, palette2, weight;
let kut, debljinaStroke;

let mjesec, pozadina, oblak, oblak_sjena, stablo, krosnja, krosnja_sjena, more, brda;
let sunce_x, sunce_y, sunce_velicina;
let nagib, brdo1_x, brdo1_y, brdo2_x, brdo2_y, brdo3_x, brdo3_y, more_x, more_y;


var vel;

let rnd;
let seed = Math.trunc(fxrand() * 10000000);
let phase = 0;
let zoff = 0;
let yoff = 0;
let xoff = 0;

let sjene_x_brdo = [];
let sjene_x_brdo_2 = [];
let sjene_x_brdo_3 = [];
let sjene_x_more = [];
let sjene_x_vodopad = [];


let oblaci_stupnjevi = [
   [0, 360],
   [60, 300],
   [90, 270],
   [120, 240] /* */
];


let vjetar_array = [
	//[-0.1, 0.1], 
	[-0.2, 0.2],
	[-0.3, 0.3],
	[-0.4, 0.4],   
	[-0.5, 0.5],
	[-0.6, 0.6],
];








let drveca_array = [

/// najbolje

[35, 0.0075, 130, 440, 120, 200, 600, /***/ 30, 0.01, 110, 340, 120, 170, 600, /***/ 12, 0.03, 40, 90, 30, 50, 500, /***/ 3, 0.2, 30, 50, 15, 30, 500, /***/ 1,1],  // normalni krugovi početne kordinate  
[25, 0.007, 180, 390, 50, 70, 500, /***/ 25, 0.007, 180, 390, 50, 70, 500,/***/ 7, 0.04, 50, 80, 12, 16, 500, /***/ 4, 0.1, 20, 40, 5, 10, 500, /***/ 0.1,0.1], // veliki krugovi ko ruže, tanja stabla   
[37, 0.008, 230, 450, 250, 350, 3000, /***/ 25, 0.007, 180, 390, 200, 320, 2000,/***/ 7, 0.04, 40, 80, 50, 80, 500, /***/ 4, 0.1, 20, 40, 30, 50, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla   
[36, 0.006, 230, 390, 250, 350, 4000, /***/ 25, 0.008, 180, 390, 200, 320, 4000,/***/ 7, 0.04, 40, 80, 50, 80, 1000, /***/ 4, 0.1, 20, 40, 30, 50, 1000, /***/ 12,6], // mali krugovi jesen, tanja stabla, više krugova u krošnji 4000
[20, 0.021, 120, 480, 250, 320, 2000, /***/ 15, 0.03, 90, 120, 100, 150, 500,/***/ 7, 0.04, 50, 100, 50, 90, 500, /***/ 4, 0.1, 20, 50, 30, 70, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla, gužva ODLIČNO   
[26, 0.020, 200, 400, 30, 50, 500, /***/ 13, 0.06, 100, 350, 20, 30, 500,/***/ 4, 0.1, 30, 64, 6, 8, 500, /***/ 2, 0.3, 14, 44, 2, 4, 400, /***/ 4,0.1], // veliki krugovi ko ruže, tanja stabla  

[25, 0.007, 180, 390, 50, 70, 500, /***/ 25, 0.007, 180, 390, 50, 70, 500,/***/ 7, 0.04, 50, 80, 12, 16, 500, /***/ 4, 0.1, 20, 40, 5, 10, 500, /***/ 0.1,0.1], // veliki krugovi ko ruže, tanja stabla   
[37, 0.008, 230, 450, 250, 350, 3000, /***/ 25, 0.007, 180, 390, 200, 320, 2000,/***/ 7, 0.04, 40, 80, 50, 80, 500, /***/ 4, 0.1, 20, 40, 30, 50, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla   
[36, 0.006, 230, 390, 250, 350, 4000, /***/ 25, 0.008, 180, 390, 200, 320, 4000,/***/ 7, 0.04, 40, 80, 50, 80, 1000, /***/ 4, 0.1, 20, 40, 30, 50, 1000, /***/ 12,6], // mali krugovi jesen, tanja stabla, više krugova u krošnji 4000
[20, 0.021, 120, 480, 250, 320, 2000, /***/ 15, 0.03, 90, 120, 100, 150, 500,/***/ 7, 0.04, 50, 100, 50, 90, 500, /***/ 4, 0.1, 20, 50, 30, 70, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla, gužva ODLIČNO   
[26, 0.020, 200, 400, 30, 50, 500, /***/ 13, 0.06, 100, 350, 20, 30, 500,/***/ 4, 0.1, 30, 64, 6, 8, 500, /***/ 2, 0.3, 14, 44, 2, 4, 400, /***/ 4,0.1], // veliki krugovi ko ruže, tanja stabla  


[35, 0.0075, 130, 440, 120, 200, 600, /***/ 30, 0.01, 110, 340, 120, 170, 600, /***/ 12, 0.03, 40, 90, 30, 50, 500, /***/ 3, 0.2, 30, 50, 15, 30, 500, /***/ 1,1],  // normalni krugovi početne kordinate  
[25, 0.007, 180, 390, 50, 70, 500, /***/ 25, 0.007, 180, 390, 50, 70, 500,/***/ 7, 0.04, 50, 80, 12, 16, 500, /***/ 4, 0.1, 20, 40, 5, 10, 500, /***/ 0.1,0.1], // veliki krugovi ko ruže, tanja stabla   
[37, 0.008, 230, 450, 250, 350, 3000, /***/ 25, 0.007, 180, 390, 200, 320, 2000,/***/ 7, 0.04, 40, 80, 50, 80, 500, /***/ 4, 0.1, 20, 40, 30, 50, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla   
[36, 0.006, 230, 390, 250, 350, 4000, /***/ 25, 0.008, 180, 390, 200, 320, 4000,/***/ 7, 0.04, 40, 80, 50, 80, 1000, /***/ 4, 0.1, 20, 40, 30, 50, 1000, /***/ 12,6], // mali krugovi jesen, tanja stabla, više krugova u krošnji 4000
[20, 0.021, 120, 480, 250, 320, 2000, /***/ 15, 0.03, 90, 120, 100, 150, 500,/***/ 7, 0.04, 50, 100, 50, 90, 500, /***/ 4, 0.1, 20, 50, 30, 70, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla, gužva ODLIČNO   
[26, 0.020, 200, 400, 30, 50, 500, /***/ 13, 0.06, 100, 350, 20, 30, 500,/***/ 4, 0.1, 30, 64, 6, 8, 500, /***/ 2, 0.3, 14, 44, 2, 4, 400, /***/ 4,0.1], // veliki krugovi ko ruže, tanja stabla  

[25, 0.007, 180, 390, 50, 70, 500, /***/ 25, 0.007, 180, 390, 50, 70, 500,/***/ 7, 0.04, 50, 80, 12, 16, 500, /***/ 4, 0.1, 20, 40, 5, 10, 500, /***/ 0.1,0.1], // veliki krugovi ko ruže, tanja stabla   
[37, 0.008, 230, 450, 250, 350, 3000, /***/ 25, 0.007, 180, 390, 200, 320, 2000,/***/ 7, 0.04, 40, 80, 50, 80, 500, /***/ 4, 0.1, 20, 40, 30, 50, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla   
[36, 0.006, 230, 390, 250, 350, 4000, /***/ 25, 0.008, 180, 390, 200, 320, 4000,/***/ 7, 0.04, 40, 80, 50, 80, 1000, /***/ 4, 0.1, 20, 40, 30, 50, 1000, /***/ 12,6], // mali krugovi jesen, tanja stabla, više krugova u krošnji 4000
[20, 0.021, 120, 480, 250, 320, 2000, /***/ 15, 0.03, 90, 120, 100, 150, 500,/***/ 7, 0.04, 50, 100, 50, 90, 500, /***/ 4, 0.1, 20, 50, 30, 70, 500, /***/ 12,6], // mali krugovi jesen, tanja stabla, gužva ODLIČNO   
[26, 0.020, 200, 400, 30, 50, 500, /***/ 13, 0.06, 100, 350, 20, 30, 500,/***/ 4, 0.1, 30, 64, 6, 8, 500, /***/ 2, 0.3, 14, 44, 2, 4, 400, /***/ 4,0.1], // veliki krugovi ko ruže, tanja stabla  



////////// male krošnje i čudne krošnje

[10, 0.08, 150, 440, 10, 20, 500, /***/ 7, 0.08, 80, 200, 10, 15, 500,/***/ 7, 0.2, 20, 80, 8, 5, 500, /***/ 4, 0.1, 10, 50, 5, 3, 500, /***/ 0.1,0.1], // skroz mali krugovi ko ruže, mala tanka niska stabla
[26, 0.015, 200, 480, 130, 300, 2500, /***/ 13, 0.02, 100, 350, 120, 130, 2000,/***/ 6, 0.08, 60, 100, 46, 78, 1000, /***/ 2, 0.1, 14, 55, 30, 40, 500, /***/ 12,6], // mali krugovi jesen  
[8, 0.1, 50, 140, 10, 20, 500, /***/ 7, 0.1, 80, 200, 10, 15, 500,/***/ 7, 0.2, 20, 80, 8, 5, 500, /***/ 4, 0.1, 10, 50, 5, 3, 500, /***/ 0.1,0.1], // skroz mali krugovi ko ruže, mala tanka niska stabla
[50, 0.01, 200, 420, 60, 80, 500, /***/ 50, 0.005, 150, 300, 40, 60, 500,/***/ 15, 0.03, 50, 80, 15, 20, 500, /***/ 7, 0.07, 30, 60, 5, 10, 500, /***/ 0.1,0.1], // veliki krugovi ko ruže, deblja stabla  
[20, 0.05, 220, 500, 12, 16, 100, /***/ 15, 0.02, 190, 360, 9, 12, 100,/***/ 7, 0.07, 150, 230, 3, 6, 100, /***/ 4, 0.08, 20, 150, 1, 3, 100, /***/ 0.1,0.1], // skroz mali krugovi ko ruže, tanja duguljasta stabla - apokalipsa  
[20, 0.03, 120, 480, 0, 0, 0, /***/ 15, 0.03, 90, 200, 0, 0, 0,/***/ 7, 0.04, 50, 80, 0, 0, 0, /***/ 4, 0.1, 20, 50, 0, 0, 0, /***/ 12,6], // skroz mali krugovi jesen, tanja stabla, bez krošnje - apokalipsa  
[20, 0.03, 120, 480, 150, 250, 2000, /***/ 15, 0.03, 90, 200, 100, 150, 500,/***/ 7, 0.04, 50, 80, 0, 0, 0, /***/ 4, 0.1, 20, 50, 0, 0, 0, /***/ 12,6], // mali krugovi jesen, tanja stabla, bez krošnje - apokalipsa al samo zanja brda
[20, 0.03, 120, 480, 30, 40, 500, /***/ 15, 0.03, 90, 200, 20, 30, 500,/***/ 7, 0.04, 50, 80, 10, 15, 500, /***/ 4, 0.08, 20, 40, 5, 10, 500, /***/ 12,6], // skroz mali krugovi ko jesen, tanja stabla  - spokalipsa 
  
];

let sredina = [funkcija_vodopad];
let loading_brojac = 0;

function setup() {
	
	let p = fxrand();
	if (p < 0.25) {
		koboljkaWidth = 900;
		koboljkaHeight = 505;		
	} else if (p < 0.60) { 	
		koboljkaWidth = 900;
		koboljkaHeight = 600;			
	} else if (p < 0.70) {   
		koboljkaWidth = 600;
		koboljkaHeight = 600;		
	} else if (p < 0.85) {   
		koboljkaWidth = 600;
		koboljkaHeight = 700;			
	} else {
		koboljkaWidth = 600;
		koboljkaHeight = 800;
	}
	colorMode(HSB, 360,100,255,255)	
	initPerspektive();
	initPalettes();
}


function draw() {
	if (loading_brojac == 0) {
		textAlign(CENTER, CENTER);
		strokeWeight(0)
		text('Loading...', width / 2, height / 2);
		noFill()
		stroke(0)
		strokeWeight(2)
		ellipse(width / 2, height / 2, 75);
	} else {
		let scaleFactor = min(windowWidth / koboljkaWidth, windowHeight / koboljkaHeight);
		let w = int(koboljkaWidth * scaleFactor);
		let h = int(koboljkaHeight * scaleFactor);
		resizeCanvas(w, h);
		console.log('' + w + 'x' + h);
		let img = makeImage(w, h);
		image(img, 0, 0);
		fxpreview();
		noLoop();
	}
	loading_brojac++;
}

function fxrandRange(a, b) {
	return a + fxrand() * (b - a);
}


function windowResized() {
	loading_brojac = 0;
	loop();
}

function keyPressed() {
  if (key == 's' || key == 'S') {
	let img = makeImage(koboljkaWidth * 7, koboljkaHeight * 7);
	img.save('Koboljka (' + fxhash + ').png');
  }
}

function makeImage(w, h) {
	



	phase = 0;
	zoff = 0;
	yoff = 0;
	xoff = 0;
	
	let minSize = min(koboljkaWidth, koboljkaHeight);
	let img = createGraphics(w, h);
	
	
	noiseSeed(seed);
	randomSeed(seed);
	
	img.angleMode(DEGREES);
	img.colorMode(HSB, 360,100,255,255)	
	
	var scaleFactor = min(w / koboljkaWidth, h / koboljkaHeight);
	img.scale(scaleFactor);
		
	
	palette = random(palettes)
	nagibi_random = random(nagibi_array); 
	oblaci_random = random(oblaci_stupnjevi); 
	drveca_random = random(drveca_array);
	vjetar_random = random(vjetar_array);
	
	sredina_random = random(sredina); 

	mjesec =  color(palette[0])
	pozadina = palette [1]
	oblak = palette [2]
	oblak_sjena = palette [3]
	stablo = palette [4]
	krosnja = palette [5]
	krosnja_sjena = palette [6]
	more = palette [7]
	brda = palette [8]	
	
	nagib = random(nagibi_random[10],nagibi_random[11]);  

	brdo1_x = koboljkaHeight*nagibi_random[0]*nagib;
	brdo1_y = koboljkaHeight*nagibi_random[1]*nagib;   
  
	brdo2_x = koboljkaHeight*nagibi_random[2]*nagib;
	brdo2_y = koboljkaHeight*nagibi_random[3]*nagib;

	more_x = koboljkaHeight*nagibi_random[4]*nagib;
	more_y = koboljkaHeight*nagibi_random[5]*nagib;    
  
	brdo3_x = koboljkaHeight*nagibi_random[6]*nagib;
	brdo3_y = koboljkaHeight*nagibi_random[7]*nagib;  
  
	brdo4_x = koboljkaHeight*nagibi_random[8]*nagib;
	brdo4_y = koboljkaHeight*nagibi_random[9]*nagib;   	
	
	
	sunce_velicina = random(koboljkaHeight/11,koboljkaHeight/10);
	sunce_x = random(koboljkaWidth*0.35, koboljkaWidth*0.65);
	
	
	if (brdo4_x > brdo4_y) {   
		sunce_y = random(brdo4_x/2, brdo4_x-sunce_velicina);
	} else {  
	sunce_y = random(brdo4_x+sunce_velicina, koboljkaHeight*0.2);
	}   


	img.background(pozadina);
	funkcija_zvijezde_sitne(img);
	funkcija_zvijezde_krupne(img);
	funkcija_vinjeta_brda(img)
	funkcija_vinjeta_sunca(img)
	funkcija_sunce(img)

	if (nagibi_random[18] == 1) {		
		funkcija_oko_sunca_krosnje(img);
	} 		
	
	if (nagibi_random[17] == 1) {		
		funkcija_oblaci_poredani(img, 0, koboljkaWidth, 100);
	} 		


	if (nagibi_random[16] == 1) {		
 			
/////////////////////// if brda ////////////////////////////////
  
		var brda_if = random();    
		if (brda_if < 0.60) {   

   
	 
			var broj_brda = random(10,10);
	  
			for (var i = 0; i < broj_brda; i++) {
		  
				//var daljina = brightness(pozadina)/broj_brda;
				
				var do_crnog =  map(i, 0, broj_brda, brightness(pozadina)-20, 0)
				
				max_spic = (brdo4_x - brdo4_y)-i*i;   
				img.fill(hue(pozadina), saturation(pozadina), do_crnog, 255); 
				funkcija_brdo_u_daljini_noise(img, 0, brdo4_x, sunce_x + (random(-koboljkaWidth/15*i, koboljkaWidth/15*i)))
				

			} 
		
		///////////////////////////////////////////////////
		
		} else if (brda_if < 0.95) {     

			  
				var broj_brda = random(10,10);
	 
			for (var i = 0; i < broj_brda; i++) {
				var sirina_planina = random(0.25, 0.3)
				//var daljina = brightness(pozadina)/broj_brda
				var do_crnog =  map(i, 0, broj_brda, brightness(pozadina)-20, 0)
				
				max_spic = (brdo4_x - brdo4_y)-i*i;  
				img.fill(hue(pozadina), saturation(pozadina), do_crnog, 255); 
	  
				//// livo  
				funkcija_brdo_u_daljini_noise(img, 0, brdo4_x, sunce_x - koboljkaWidth*sirina_planina +(random(-minSize/15*i, minSize/15*i)))
	  
				//// desno  
				funkcija_brdo_u_daljini_noise(img, 0, brdo4_x, sunce_x + koboljkaWidth*sirina_planina +(random(-minSize/15*i, minSize/15*i)))
			}       

	///////////////////////////////////////////////////    
		
		} else {  
		
			for (var i = 0; i < 10; i++) {

				var do_crnog =  map(i, 0, 10, brightness(pozadina)-50, 0)
	 
				img.fill(hue(pozadina), saturation(pozadina), do_crnog, 255); 
				funkcija_brdo_u_daljini(img, random(i*minSize/50, i*minSize/50))
			}  
		
	////////////////////////////////////////////////////    
		}
	}   	


	
	if (nagibi_random[15] == 1) {		
		funkcija_brdo_antino_3(img) 
	} 		

	if (nagibi_random[14] == 1) {	
		var drobina = random();    
		if (drobina < 0.20) {    		
				funkcija_vodopad(img) 
			} else if (drobina < 0.50) {    
				funkcija_trava(img)
			} else if (drobina < 0.85) {    
				funkcija_more(img)
			} else if (drobina < 0.99) {    
				funkcija_bandere(img)	
			} else {  
		}   	
	} 
	
	if (nagibi_random[13] == 1) {		
		funkcija_brdo_antino_2(img) 
	} 	
	
	if (nagibi_random[12] == 1) {		
		funkcija_brdo_antino(img) 
	} 
		
	
	funkcija_okvir(img);
	noiseFilter(img, scaleFactor, 10);
	
	return img;
}

function funkcija_zvijezde_sitne(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	for (var i=0; i < 400; i++) {
		img.push();
			img.noStroke()
			img.fill(mjesec);
			img.circle(random(0, koboljkaWidth), random(0, koboljkaHeight), random(minSize/1200, minSize/400));
		img.pop();
	}
}

function funkcija_zvijezde_krupne(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);
	for (var i=0; i < 100; i++) {
		img.push();
			img.noStroke()
			img.fill(mjesec);
			img.circle(random(0, koboljkaWidth), random(0, koboljkaHeight), random(minSize/600, minSize/120));
		img.pop();
	}
}

function funkcija_vinjeta_brda(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	var visina_vinjete = (koboljkaHeight-sunce_y)*2;
	
    for (var i = 0; i < visina_vinjete; i++) {
		img.push();
		img.noFill()
		
		var do_bijele = map(i, visina_vinjete, 0, 10, saturation(pozadina))
		var do_bijele_brightness = map(i, visina_vinjete, 0, 255, brightness(pozadina))
		
		img.stroke(hue(pozadina), do_bijele, do_bijele_brightness, 255);  
        
		img.strokeWeight(minSize/600);
		
		img.ellipse(sunce_x, koboljkaHeight, visina_vinjete*2.5, visina_vinjete-i) 
		img.pop();		
	} 	
	
}



function funkcija_vinjeta_sunca(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
    for (var i = 0; i < 1000; i++) {
		img.noFill()
		img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), 50-i/8);          
		img.strokeWeight(minSize/600);
		img.ellipse(sunce_x, sunce_y, sunce_velicina+i)   
	} 	
	
    for (var i = 0; i < 50; i++) {
		img.noFill()
		img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-i*6);         
		img.strokeWeight(minSize/600);
		img.ellipse(sunce_x, sunce_y, sunce_velicina+i)   
	} 
}



function funkcija_sunce(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
      img.push()
        img.noStroke()
        img.fill(mjesec)
        img.ellipse(sunce_x,sunce_y, sunce_velicina)
      img.pop()
}


function funkcija_oko_sunca_krosnje(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	for (var r = 0; r < 10; r++) {
	  
	  for (var g = 0; g < 10; g++) {

		  img.push()
			img.noStroke()
			img.translate(sunce_x, sunce_y)
			img.rotate(random(oblaci_random[0]+r*3,oblaci_random[1]-r*3))
			funkcija_oblak(img, 0, random(minSize/4 + r*minSize/15, minSize/4+r*minSize/15), random(minSize/12+r*minSize/35, minSize/6+r*minSize/35));
		  img.pop()  

		}  
	} 
}


function funkcija_oblaci_poredani(img, od_width, do_width, broj_komada) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	if (random() < 0.80) {

	  for (var r = 0; r < broj_komada; r++) {
	  
			rot = random(od_width, do_width)
			vel = minSize/8 - r/2;
			img.push()
			img.noStroke()
			
			
				if (brdo4_x > brdo4_y) {   
					img.translate(rot, brdo4_x - minSize/30)
					} else {  
					img.translate(rot, sunce_y+sunce_velicina)
					
				}   
			funkcija_oblak(img, 0, -vel/2, vel);
			img.pop()  
	  
	  }    
	  
	}	
}

function funkcija_oblak(img, x, y, velicina_mjeseca) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	  
	velicina_mjeseca;
	
	img.noStroke()
	img.fill(0)
	
	for (let i = 0; i < 500; i++) {
		let theta = random(0, 360);
		let h = randomGaussian(2.0); //experiment with different means
		
		let r = (exp(h) - 1) / (exp(h) + 1);
		let rr = (exp(h) + 1) / (exp(h) - 1);

		
		let x2 = x + velicina_mjeseca / 2 * r * cos(theta);
		let y2 = y + velicina_mjeseca / 2 * r * sin(theta);
		
		let x3= x + velicina_mjeseca / 2 * rr * cos(theta);
		let y3= y + velicina_mjeseca / 2 * rr * sin(theta);
		

		
		let alpha = map(y, y2 - velicina_mjeseca, y2 + velicina_mjeseca, minSize/3, -minSize/6);    
		let alpha2 = map(y, y2 + velicina_mjeseca, y2 - velicina_mjeseca, minSize/3, -minSize/6);    

		img.noStroke()
		
			img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), alpha2-i/5); 
			img.ellipse(x2,y2,random(velicina_mjeseca/5,velicina_mjeseca/5));   
			img.fill(hue(oblak), saturation(oblak), brightness(oblak), alpha2);     
			img.ellipse(x2,y2,random(velicina_mjeseca/5,velicina_mjeseca/5));    
			img.fill(hue(oblak_sjena), saturation(oblak_sjena), brightness(oblak_sjena), alpha);         
			img.ellipse(x2,y2,random(velicina_mjeseca/5,velicina_mjeseca/5));
	}
}


function funkcija_krosnja(img, x,y,velicina_mjeseca, kolicina) {
  
	let minSize = min(koboljkaWidth, koboljkaHeight);	  
  
	velicina_mjeseca;
  
	img.noStroke()  
	img.fill(krosnja)

	for (let i = 0; i < kolicina; i++) {
		let theta = random(0, 360);
		let h = randomGaussian(2.0); //experiment with different means
		let r = (exp(h) - 1) / (exp(h) + 1);
		let rr = (exp(h) + 1) / (exp(h) - 1);
		
		let x2 = x + velicina_mjeseca / 2 * r * cos(theta);
		let y2 = y + velicina_mjeseca / 2 * r * sin(theta);
		
		let x3= x + velicina_mjeseca / 2 * rr * cos(theta);
		let y3= y + velicina_mjeseca / 2 * rr * sin(theta);
		
		let alpha = map(y, y2 - velicina_mjeseca, y2 + velicina_mjeseca, 200, -100);    
		let alpha2 = map(y, y2 + velicina_mjeseca, y2 - velicina_mjeseca, 200, -100);    
		
		let list = random(velicina_mjeseca/5,velicina_mjeseca/5);

		img.noStroke()

		img.fill(hue(krosnja), saturation(krosnja), brightness(krosnja)+random(-25,25),alpha2);
		cvijet(img, x2, y2, list);
		img.fill(hue(krosnja_sjena), saturation(krosnja_sjena), brightness(krosnja_sjena)+random(-25,25),alpha);  
		cvijet(img, x2, y2, list);
		img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)+random(-25,25),alpha2-i/5);    
		cvijet(img, x2, y2, list);
		cvijet(img, x2, y2, list);
		cvijet(img, x2, y2, list);
	}
}


function funkcija_stablo(img, posX,posY, visina, sirina_debljine, velicina_mjeseca, kolicina) {
	
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	let y;
  
	for (y = posY; y > posY - visina; y -= 0.5) {
		let debljina = map(y, posY, posY - visina, sirina_debljine, minSize/60000)  
		let boja= map(y, posY, posY-visina, minSize/6, minSize/12)
    
		img.stroke(stablo)
		img.point(posX, y)

		img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), 20);        
		img.point(posX + (sunce_x - posX)/100, y)    

		img.strokeWeight(debljina)
	  
		posX += map(noise(xoff), 0, 1, vjetar_random[0], vjetar_random[1])

		xoff += 0.01;
	}  
	
	img.push()
		img.noStroke()
        img.translate(posX, y)
        img.rotate(0+(sunce_x-posX)/6)    
        funkcija_krosnja(img, 0, 0, velicina_mjeseca, kolicina);
	img.pop()  

}


function funkcija_stablo_grane(img, posX,posY, visina, sirina_debljine, velicina_mjeseca, kolicina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	let y;

	for (y = posY; y > posY - visina; y-=0.5) {
		let debljina = map(y, posY, posY - visina, sirina_debljine, 0.01)  
		let boja= map(y, posY, posY-visina, 100,50)
		img.stroke(stablo)
		img.point(posX, y)
		img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), 20); 
		img.point(posX+(sunce_x-posX)/100, y)    

		if (y > posY - visina*0.5){
			if (random() < 0.003) {
				funkcija_grana_livo(img, posX, y, random(drveca_random[2], drveca_random[3])/3, drveca_random[0]/3)
			}   
		}
	  
		if (y > posY - visina*0.5){    
			if (random() < 0.003) {
				funkcija_grana_desno(img, posX, y, random(drveca_random[2], drveca_random[3])/3, drveca_random[0]/3)    
			}      
		} 


		img.strokeWeight(debljina)  
		posX += map(noise(xoff), 0,1, vjetar_random[0],vjetar_random[1])
		xoff += 0.01

	}  
  
    img.push()
        img.noStroke()
        img.translate(posX, y)
        img.rotate(0+(sunce_x-posX)/6)    
        funkcija_krosnja(img, 0, 0, velicina_mjeseca, kolicina);
    img.pop()  

}

function funkcija_grana_livo(img, posX,posY, visina, sirina_debljine) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	let y;
  
	for (y = posY; y > posY - visina; y-=0.5) {
		let debljina = map(y, posY, posY - visina, sirina_debljine, 0.01)  
		let boja= map(y, posY, posY-visina, 100,50)
    
		img.stroke(stablo)
		img.point(posX, y)

		img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), 20);     
		img.point(posX+(sunce_x-posX)/100, y)    
		
		img.strokeWeight(debljina)
		posX += map(noise(xoff), 0,1, -0.2,0.9)
		xoff += 0.01
	}  
}

function funkcija_grana_desno(img, posX,posY, visina, sirina_debljine) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	let y;
  
	for (y = posY; y > posY - visina; y-=0.5) {

		let debljina = map(y, posY, posY - visina, sirina_debljine, 0.01)  
		let boja= map(y, posY, posY-visina, 100,50)
    
		img.stroke(stablo)
		img.point(posX, y)
		img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), 20); 

		img.point(posX+(sunce_x-posX)/100, y)    
		img.strokeWeight(debljina)
  
		posX += map(noise(xoff), 0,1, -0.6,0.2)
		xoff += 0.01

	}  
}

function funkcija_brdo_antino(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(hue(brda), saturation(brda), brightness(brda), 255);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, brdo1_x, brdo1_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[0];
				
			if ((x <= sunce_x*0.6) || (x >= sunce_x*1.4)) {
			  
				if (random() < drveca_random[1]) {
					img.push()
					funkcija_stablo_grane(img, x,y, random(drveca_random[2]*minSize/600, drveca_random[3]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[4]*minSize/600, drveca_random[5]*minSize/600), drveca_random[6])
					img.pop()
					sjene_x_brdo.push(x);    
				}    	
			}   
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();
	
	//////// tockice po brdu
	
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, brdo1_x, brdo1_y);
		var a = atan2(y - sunce_y, x - sunce_x);
		for (var k = 0; k < 10; k++) {
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			var usjeni = false;
			var kx = x - cos(a) * (y2 - y);
			for (var i = 0; i < sjene_x_brdo.length; i++) {
				if (kx >= sjene_x_brdo[i]-sirina_debljine/2 && kx <= sjene_x_brdo[i]+sirina_debljine/2) {
					usjeni = true;
					break;
				}
			}
			if (usjeni) {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				img.ellipse(x, y2, k*1.2);
				img.pop()
			} else {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);
				img.ellipse(x, y2, k*1.2);
				img.pop()
			}
		}
	}
		
}

function funkcija_brdo_antino_2(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(hue(brda), saturation(brda), brightness(brda), 255);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, brdo2_x, brdo2_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[7];
				
			if ((x <= sunce_x*0.6) || (x >= sunce_x*1.4)) {
			  
				if (random() < drveca_random[8]) {
					img.push()
					funkcija_stablo(img, x, y, random(drveca_random[9]*minSize/600,drveca_random[10]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[11]*minSize/600, drveca_random[12]*minSize/600), drveca_random[13])
					img.pop()
					sjene_x_brdo_2.push(x);    
				}    	
			}   
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();
	
	//////// tockice po brdu
	
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, brdo2_x, brdo2_y);
		var a = atan2(y - sunce_y, x - sunce_x);
		for (var k = 0; k < 10; k++) {
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			var usjeni = false;
			var kx = x - cos(a) * (y2 - y);
			for (var i = 0; i < sjene_x_brdo_2.length; i++) {
				if (kx >= sjene_x_brdo_2[i]-sirina_debljine/2 && kx <= sjene_x_brdo_2[i]+sirina_debljine/2) {
					usjeni = true;
					break;
				}
			}
			if (usjeni) {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				img.ellipse(x, y2, k*0.8);
				img.pop()
			} else {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);
				img.ellipse(x, y2, k*0.8);
				img.pop()
			}
		}
	}
}

function funkcija_brdo_antino_3(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(hue(brda), saturation(brda), brightness(brda), 255);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, brdo3_x, brdo3_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[21];
				
			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {
			  
				if (random() < drveca_random[22]) {
					img.push()
					funkcija_stablo(img, x, y, random(drveca_random[23]*minSize/600, drveca_random[24]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[25]*minSize/600,drveca_random[26]*minSize/600), drveca_random[27])
					img.pop()
					sjene_x_brdo_3.push(x);    
				}    	
			}   
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();
	
	//////// tockice po brdu
	
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, brdo3_x, brdo3_y);
		var a = atan2(y - sunce_y, x - sunce_x);
		for (var k = 0; k < 10; k++) {
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			var usjeni = false;
			var kx = x - cos(a) * (y2 - y);
			for (var i = 0; i < sjene_x_brdo_3.length; i++) {
				if (kx >= sjene_x_brdo_3[i]-sirina_debljine/2 && kx <= sjene_x_brdo_3[i]+sirina_debljine/2) {
					usjeni = true;
					break;
				}
			}
			if (usjeni) {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				img.ellipse(x, y2, k*0.3);
				img.pop()
			} else {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);
				img.ellipse(x, y2, k*0.3);
				img.pop()
			}
		}
	}
}

function funkcija_bandere(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(hue(brda), saturation(brda), brightness(brda), 255);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
			img.vertex(x, y); 
			sirina_debljine_bandere = minSize/35;
			sirina_debljine = drveca_random[14];
				
			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {
			  
				//if (random() < drveca_random[15]) {
				if (random() < 0.030) {

					img.push()
						img.strokeWeight(0);
						img.fill(255)
						img.rectMode(CENTER);
						img.rect(x,y, minSize/40, minSize/17, minSize/100)					
						img.strokeWeight(minSize/200);
						img.stroke(255)

						//img.line(x, y, x, y-minSize/5)
						img.fill(255)
						//img.ellipse(x, y-minSize/5, 3, 3)
					img.pop()
   					
					if (random() < 0.3) {					
						img.push()
						funkcija_stablo(img, x, y, random(drveca_random[16]*minSize/600, drveca_random[17]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600,drveca_random[19]*minSize/600), drveca_random[20])
						funkcija_stablo(img, x, y, random(drveca_random[16]*minSize/600, drveca_random[17]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600,drveca_random[19]*minSize/600), drveca_random[20])
						funkcija_stablo(img, x, y, random(drveca_random[16]*minSize/600, drveca_random[17]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600,drveca_random[19]*minSize/600), drveca_random[20])

						img.pop()
					}
					 sjene_x_more.push(x);    
				}   
///// ograda     

			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {
  
				if (random() < 0.1) {
					img.push()
						img.stroke(255)
						img.strokeWeight(minSize/200);
						//img.line(x,y, x, y-minSize/42)
					img.pop()
				}    	
				
					
				
			}       
			img.push()
				img.fill(255)
				img.noStroke()
				img.ellipse(x, y - minSize/60, minSize/200)
				img.ellipse(x, y - minSize/120, minSize/200)
			img.pop()
			
			
		
			
    
///////////  	
				
			}   
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();
	
	//////// tockice po brdu
	
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
		var a = atan2(y - sunce_y, x - sunce_x);		
		
		for (var k = 0; k < 20; k++) {
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			var usjeni = false;
			var kx = x - cos(a) * (y2 - y);
			for (var i = 0; i < sjene_x_more.length; i++) {
				if (kx >= sjene_x_more[i]-sirina_debljine_bandere/2 && kx <= sjene_x_more[i]+sirina_debljine_bandere/2) {
					usjeni = true;
					break;
				}
				
				
			}
			if (usjeni) {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				img.ellipse(x, y2, k*0.5);
				img.pop()
				
		
				
				
			} else {
				img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);
				img.ellipse(x, y2, k*0.5);
				img.pop()
			}
		}
	}
}

function funkcija_brdo(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(hue(brda), saturation(brda), brightness(brda), 255);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, brdo1_x, brdo1_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[0];
				
			if ((x <= sunce_x*0.6) || (x >= sunce_x*1.4)) {
			  
				if (random() < drveca_random[1]) {
					img.push()
					
					funkcija_stablo_grane(img, x,y, random(drveca_random[2]*minSize/600, drveca_random[3]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[4]*minSize/600, drveca_random[5]*minSize/600), drveca_random[6])
					img.pop()
					sjene_x_brdo.push(x);    
				}    	
			}   
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();

  //////// tockice po brdu

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, brdo1_x, brdo1_y);
    
		for (var k = 0; k < 10; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			
			img.push()
			img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);
          
			for (var r = 0; r < 200; r++) {
				if (x >= sjene_x_brdo[r]-sirina_debljine/2 && x <= sjene_x_brdo[r]+sirina_debljine/2) {
					img.noFill()
					//img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				}  
			}    
			img.ellipse(x, y2, k*1.2);
			img.pop()
		}		
	}  
}

function funkcija_brdo_2(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(brda);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, brdo2_x, brdo2_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[7];    
			if ((x <= sunce_x*0.7) || (x >= sunce_x*1.3)) {
				if (random() < drveca_random[8]) {
					img.push()
					funkcija_stablo(img, x, y, random(drveca_random[9]*minSize/600,drveca_random[10]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[11]*minSize/600, drveca_random[12]*minSize/600), drveca_random[13])
					img.pop()
					sjene_x_brdo_2.push(x); 
				}    	
			}       
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();

  
  //////// tockice po brdu

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, brdo2_x, brdo2_y);
		for (var k = 0; k < 10; k++) {
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			
			img.push()
			img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);			
			for (var r = 0; r < 200; r++) {
				if (x >= sjene_x_brdo_2[r]-sirina_debljine/2 && x <= sjene_x_brdo_2[r]+sirina_debljine/2) {
					img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				}  
			}         

			img.ellipse(x, y2, k*0.8);
			img.pop()
		}
	}
  
}

function funkcija_brdo_3(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	

	img.strokeWeight(0)
	img.stroke(0);
	img.fill(brda);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.01;
			var y = map(sin(angle + phase), -strum, strum, brdo3_x, brdo3_y);
			vertex(x, y); 
			sirina_debljine = drveca_random[21];             
			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {
  
				if (random() < drveca_random[22]) {
					img.push()
					funkcija_stablo(img, x, y, random(drveca_random[23]*minSize/600, drveca_random[24]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[25]*minSize/600,drveca_random[26]*minSize/600), drveca_random[27])
					img.pop()
					sjene_x_brdo_3.push(x); 
				}    	
			}       
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();

  
  
  //////// tockice po brdu 
   

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.01;
		var y = map(sin(angle + phase), -strum, strum, brdo3_x, brdo3_y);
    
		for (var k = 0; k < 10; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			img.push()
			img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);

       
				for (var r = 0; r < 200; r++) {
					if ( x >= sjene_x_brdo_3[r] - sirina_debljine/2 && x <= sjene_x_brdo_3[r] + sirina_debljine/2) {
					img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
				}  
			}         
			img.ellipse(x, y2, k/3);
			img.pop()
		}    
	}

}

function funkcija_brdo_u_daljini(img, v) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.006;
			var y = map(sin(angle + phase), -strum, strum, v+brdo4_x, v+brdo4_y);
			img.vertex(x, y); 
		}		
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();

  
  
  //////// tockice po brdu
  

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.006;
		var y = map(sin(angle + phase), -strum, strum, v+brdo4_x, v+brdo4_y);
    
		let t;
		if (x < sunce_x)
			t = map(x, 0, sunce_x, 0, minSize/12);
			else
			t = map(x, sunce_x, koboljkaWidth, minSize/12, 0);    
    
		for (var k = 0; k < 20; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * minSize/4;
			img.push()
			img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), t);
			img.ellipse(x, y2, k/10);
			img.pop()
		}
	}
  
}

function funkcija_brdo_u_daljini_noise(img, x, y, vrhovi) {
	let minSize = min(koboljkaWidth, koboljkaHeight);		
	
	//var naboranost = random(minSize/60000, minSize/10000);
	var naboranost = random(0.03, 0.05);
	var max_osc = 30;
	var spic_fact = koboljkaWidth/50;
  
	img.strokeWeight(0)

	img.beginShape();  
		img.vertex(0, y);
		for (let i = x; i <= koboljkaWidth; i += 1) {
      
			
      
			if (i < vrhovi)
				spic_fact = map(i, -koboljkaWidth*koboljkaWidth/6000, vrhovi, 0, minSize/600);
			else
				spic_fact = map(i, vrhovi, koboljkaWidth*koboljkaWidth/540, minSize/600, 0);
      
			img.vertex(i , y + noise(i * naboranost) * max_osc - max_spic * pow(spic_fact, minSize/200));        
		}
		img.vertex(koboljkaWidth, y);
		img.vertex(koboljkaWidth, koboljkaHeight)
		img.vertex(0, koboljkaHeight)
	img.endShape(CLOSE);  
  
  
  // sjencenje    
	for (let i = x; i <= koboljkaWidth; i += 1) {  
    
    
		if (i < sunce_x)
			t = map(i, koboljkaWidth*0.15, sunce_x, 0, 50);
			else 
			t = map(i, sunce_x, koboljkaWidth*0.85, 50, 0);     
    

    
			if (i < vrhovi)
				spic_fact = map(i, -koboljkaWidth*koboljkaWidth/6000, vrhovi, 0, minSize/600);
			else
				spic_fact = map(i, vrhovi, koboljkaWidth*koboljkaWidth/540, minSize/600, 0);
    
		for (var k = 0; k < 20; k++) {      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + noise(i * naboranost) * max_osc + r * minSize/4.5 -  max_spic * pow(spic_fact, minSize/200);
			
			img.push()
			img.stroke(hue(mjesec), saturation(mjesec), brightness(mjesec), t);
			img.strokeWeight(random(minSize/900, minSize/600))
			img.point(i+random(-minSize/300, minSize/300), y2);
			img.pop()
		} 
	}
}

function funkcija_more(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);		
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(more);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[14];    
    
			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {
  
				if (random() < drveca_random[15]) {
					img.push()
						funkcija_stablo(img, x, y, random(drveca_random[16]*minSize/600, drveca_random[17]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600, drveca_random[19]*minSize/600), drveca_random[20]*minSize/600)
					img.pop()
					sjene_x_more.push(x); 
				}    	
			}     
///// ograda     

			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {
  
				if (random() < 0.1) {
					img.push()
						img.stroke(255)
						img.strokeWeight(minSize/200);
						img.line(x,y, x, y-minSize/42)
					img.pop()
				}    	
			}       
			img.push()
				img.fill(255)
				img.noStroke()
				img.ellipse(x, y - minSize/60, minSize/200)
				img.ellipse(x, y - minSize/120, minSize/200)
			img.pop()
    
///////////       
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();
  

//////// layeri vode
  
	for (var i = 0; i < 20; i++) {

		img.fill(hue(more), saturation(more), brightness(more)-i*10, 255);
		
		img.beginShape();
			img.vertex(0, koboljkaHeight);
			for(var x = 0; x <= koboljkaWidth; x++){
				var angle = offset + x * 0.005;
				var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
				img.vertex(x, y+i*i/1.7); 
			}
			vertex(koboljkaWidth, koboljkaHeight);
		img.endShape();
	}    
  

////// tockice odsjaj mjeseca ili sunca u vodi
  
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);

		let t;
		if (x < sunce_x)
			t = map(x, sunce_x*0.8, sunce_x, 0, 255);
		else
			t = map(x, sunce_x, sunce_x*1.2, 255, 0);    
    
		for (var k = 0; k < 35; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);       
			y2 = y + r * 150;
			
			img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), t);       
				img.ellipse(x, y2, k/14);
			img.pop()
		}
	}  
  
   
  
//////// tockice po vodi
  

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);

		for (var k = 0; k < 20; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 150;
			img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);       
				for (var r = 0; r < 200; r++) { /* */
					if (x >= sjene_x_more[r]-sirina_debljine/2 && x <= sjene_x_more[r]+sirina_debljine/2) {
						img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-200, 255-k*30);
					}   
				}         
				img.ellipse(x, y2, k/2);
			img.pop()
		}
	} 
}

function funkcija_vodopad(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	

	img.strokeWeight(0)
	img.stroke(0);
	img.fill(more);
  
	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[14];    
    
			if ((x <= koboljkaWidth*0.5) || (x >= koboljkaWidth*0.5)) {

				if (random() < drveca_random[15]) {
					img.push()
					funkcija_stablo(img, x, y, random(drveca_random[16]*minSize/600, drveca_random[17]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600, drveca_random[19]*minSize/600), drveca_random[20]*minSize/600)
					img.pop()
					sjene_x_vodopad.push(x); 
				}    	
			}     
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();


//////// vodopad krugovi
 
	img.noFill()

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
   
		for (var w = 0; w < koboljkaWidth/13; w++) {
      
			var r = random();
			r = random(r);
			//r = random(r);
			y2 = y + r * (koboljkaHeight-y);
			

			img.push()
				img.fill(hue(more), saturation(more), brightness(more)+random(-w*2,-w), random(0,255));
				
				for (var r = 0; r < 200; r++) {
					if (x >= sjene_x_vodopad[r]-sirina_debljine/2 && x <= sjene_x_vodopad[r]+sirina_debljine/2) {
						img.fill(hue(0), saturation(0), brightness(255), 255);
					}  
				}        
				img.ellipse(x, y2+w/2, w);     
			img.pop()
		}
	}

//////// vodopad baloncici krugovi na dnu
  
	img.noFill()
	
	for(var x = 0; x <= koboljkaWidth; x++){
    
		for (var w = 0; w < 20; w++) {
      
			var r = random();
			r = random(r);
			//r = random(r);
			y2 = koboljkaHeight - r * (koboljkaHeight-y);
			y3 = koboljkaHeight - r * (koboljkaHeight-y)/3;
			
			img.push()
				img.fill(hue(0), saturation(0), brightness(255), random(50,100));
				img.ellipse(x, y2, w*random(minSize/12000,minSize/2000)); 
				img.ellipse(x, y3, w*random(minSize/3000,minSize/650)); 
				
				img.fill(hue(more), saturation(more), brightness(more)-w*2, random(0,50));       
				img.ellipse(x, y2, w*random(minSize/12000,minSize/6000));
			img.pop()
		}
	}  
  
//// tockice po vodopadu
  
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
    
		let t;
 
		for (var k = 0; k < 20; k++) {
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * 350;
			
			img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec)-random(0,30), 255-k*15);
				img.ellipse(x, y2, k/8);
				img.fill(hue(oblak), saturation(oblak), brightness(oblak)-random(0,30), 255-k*15);
				img.ellipse(x, y2, k/8);       
			img.pop()
		}
    }

//// tockice po zraku iznad vodopada
  
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
    
		let t;
 
		for (var k = 0; k < 5; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y - r * 10;
			
			img.push()
				img.fill(hue(oblak), saturation(oblak), brightness(oblak)-random(0,30), 255-k*15);
				img.ellipse(x, y2, k/3);       
			img.pop()
		}
	}  
  
////// tockice odsjaj mjeseca ili sunca u vodi
  
	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);

		let t;
		
		if (x < sunce_x)
			t = map(x, sunce_x*0.1, sunce_x, 0, 50);
		else
			t = map(x, sunce_x, sunce_x*1.9, 50, 0);    
    
		for (var k = 0; k < 45; k++) {
			var r = random();
			r = random(r);
			r = random(r);       
			y2 = y + r * 350;
      
			img.push()	
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), t);
				img.ellipse(x, y2, k/14);
			img.pop()
		}
	}  
}

function funkcija_trava(img) { 
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	
	img.strokeWeight(0)
	img.stroke(0);
	img.fill(krosnja);

	var offset = 0;
	var strum = 1;  
	var phase = random(360);
  
	img.beginShape();
		img.vertex(0, koboljkaHeight);
		for(var x = 0; x <= koboljkaWidth; x++){
			var angle = offset + x * 0.005;
			var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
			img.vertex(x, y); 
			sirina_debljine = drveca_random[14];    
		
			if ((x <= width*0.5) || (x >= width*0.5)) {
	  
				if (random() < drveca_random[15]) {
					img.push()
						funkcija_stablo(img, x,y, random(drveca_random[16]*minSize/600, drveca_random[17]*minSize/600), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600, drveca_random[19]*minSize/600), drveca_random[20]*minSize/600)
					img.pop()
					sjene_x_more.push(x); 
				}    	
			}     
///// ograda     		
			if ((x <= sunce_x*1) || (x >= sunce_x*1)) {
				if (random() < 0.1) {
					img.push()
						img.stroke(255)
						img.strokeWeight(3);
						img.strokeCap(ROUND);
						img.line(x,y, x, y-minSize/42)
					img.pop()
				}    	
				img.push()
					img.fill(255)
					img.noStroke()
					img.ellipse(x, y-minSize/60, minSize/200)
					img.ellipse(x, y-minSize/120, minSize/200)
				img.pop()
			} 
		}
		img.vertex(koboljkaWidth, koboljkaHeight);
	img.endShape();
  
  
  
//////// layeri trave
  
	for (var i = 0; i < 20; i++) {
		
		var do_crnog =  map(i, 0, 20, brightness(mjesec), 50)
		
		img.fill(hue(krosnja), saturation(krosnja), do_crnog, 255);  
  
		img.beginShape();
		img.vertex(0, koboljkaHeight);
			for(var x = 0; x <= koboljkaWidth; x++){
    
				do_dna = (koboljkaHeight - y)/18
 
				var angle = offset + x * 0.005;
				var y = map(sin(angle + phase), -strum, strum, more_x, more_y);
				vertex(x, y+i*do_dna); 
    
				if (random() < 0.5) {
					img.push()
					img.noStroke()
					img.translate(x, y+i*do_dna)      
					img.stroke(hue(krosnja), saturation(krosnja), do_crnog + random(-30,0), 255);  

					img.strokeWeight(random(0.3,2))
					img.line(0, 0, random(-koboljkaWidth/20,koboljkaWidth/20), random(-do_dna*i*0.4,-do_dna*i*0.6))
					img.pop()   										
				}

				// if (random() < 0.0005) {					
					// img.push()
					// funkcija_stablo(img, x, y+i*do_dna, random(drveca_random[16]*minSize/600*4, drveca_random[17]*minSize/600*4), sirina_debljine*minSize/600, random(drveca_random[18]*minSize/600,drveca_random[19]*minSize/600), drveca_random[20])
					// img.pop()
				// }	
			}
			img.vertex(koboljkaWidth, koboljkaHeight);
		img.endShape();
	}    
  

  
//////// tockice po travi
  

	for(var x = 0; x <= koboljkaWidth; x++){
		var angle = offset + x * 0.005;
		var y = map(sin(angle + phase), -strum, strum, more_x, more_y);

        for (var k = 0; k < 20; k++) {
      
			var r = random();
			r = random(r);
			r = random(r);
			y2 = y + r * do_dna*11;
			y4 = y - r * minSize/20;
			
			img.push()
				img.fill(hue(mjesec), saturation(mjesec), brightness(mjesec), 255-k*30);
				img.ellipse(x, y2, k/1.5);
       
//// točkice izliću iz trave
				if (random() < 0.7) {
					img.ellipse(x, y4, k/1.5);
				}
			img.pop()
		}
    }
}

function cvijet(img, x, y, velicina) {
	let minSize = min(koboljkaWidth, koboljkaHeight);		
	img.ellipse(x, y, random(velicina/drveca_random[28]*minSize/600, velicina/drveca_random[29]*minSize/600)); 
}

function funkcija_okvir(img) {
	let minSize = min(koboljkaWidth, koboljkaHeight);	
	img.stroke(brda)
	img.strokeWeight(minSize/30)

	img.line(0, 0, koboljkaWidth, 0)
	img.line(koboljkaWidth, 0, koboljkaWidth, koboljkaHeight)
	img.line(koboljkaWidth, koboljkaHeight, 0, koboljkaHeight)
	img.line(0, koboljkaHeight, 0, 0)  

}




function initPerspektive() {

if ( (koboljkaWidth == 600 && koboljkaHeight == 800) || (koboljkaWidth == 600 && koboljkaHeight == 700) || (koboljkaWidth == 600 && koboljkaHeight == 600) ) {   

	nagibi_array = [

// /////// POLOVINE  

[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.50, 0.505, /***/  0.50, 0.49, /***/ 0.50, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3, otok 
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.50, 0.505, /***/  0.50, 0.49, /***/ 0.49, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3   
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.60, 0.605, /***/  0.60, 0.59, /***/ 0.49, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3
    

///// TRECINE  

[0.90, 0.80, /***/ 0.78, 0.73, /***/ 0.665, 0.66, /***/  0.625, 0.62, /***/ 0.50, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, brda 4 u daljini SUPER
[0.92, 0.82, /***/ 0.79, 0.74, /***/ 0.665, 0.66, /***/  0.67, 0.58, /***/ 0.48, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, brda 4 u daljini malo veća SUPER
[0.95, 0.85, /***/ 0.85, 0.75, /***/ 0.665, 0.66, /***/  0.665, 0.66, /***/ 0.60, 0.46, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, brda 4 u daljini malo veća SUPER
[0.94, 0.92, /***/ 0.90, 0.87, /***/ 0.70, 0.69, /***/  0.66, 0.62, /***/ 0.48, 0.42, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.48, 0.33, /***/ 0.9, 1.1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK 
[0.79, 0.75, /***/ 0.75, 0.69, /***/ 0.665, 0.66, /***/  0.65, 0.62, /***/ 0.61, 0.55, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 URAVNO SVE
[0.83, 0.77, /***/ 0.75, 0.69, /***/ 0.665, 0.66, /***/  0.65, 0.62, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 URAVNO SVE
[0.95, 0.71, /***/ 0.80, 0.70, /***/ 0.66, 0.665, /***/  0.65, 0.62, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA se vide izmedju BRDO 3
[0.95, 0.86, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.86, /***/ 0.89, 0.85, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3      
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.51, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3     
[0.91, 0.80, /***/ 0.85, 0.78, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.49, 0.27, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 ravna, BRDO 3 na 2/3     
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 jajasta, BRDO 3 na 2/3       
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.25, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA dp 1/5 jajasta, BRDO 3 na 2/3 TAK TAK        
   
  
// /////// PETINE    
  
[0.91, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.45, 0.39, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER    
[0.90, 0.81, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.50, 0.46, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA RAVNA ODMA IZNAD BRDA 3    
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.35, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA GORE MANJE RAVNA    
[0.90, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.54, 0.49, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER
[0.95, 0.98, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.50, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.94, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.95, 0.86, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER 
[0.95, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.66, 0.61, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA DOLE      
[0.96, 0.85, /***/ 0.95, 0.90, /***/ 0.80, 0.79, /***/  0.71, 0.78, /***/ 0.56, 0.36, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA SREDINA 
[0.95, 0.85, /***/ 0.95, 0.88, /***/ 0.82, 0.81, /***/  0.75, 0.78, /***/ 0.72, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.71, /***/ 0.60, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.88, /***/ 0.92, 0.86, /***/ 0.825, 0.82, /***/  0.76, 0.71, /***/ 0.73, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA  
[1.05, 0.92, /***/ 1.05, 0.92, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, NEMA PRVO I DRUGO BRDO
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.80, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA KO OTOK
[0.96, 0.93, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA
[0.96, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE 
[0.98, 0.84, /***/ 0.98, 0.77, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.39, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5, prednja brda ekstremna 
[0.895, 0.88, /***/ 0.895, 0.88, /***/ 0.895, 0.88, /***/  0.895, 0.88, /***/ 0.66, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ, SAMO VEĆA BRDA 

// /////// POLOVINE  

[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.50, 0.505, /***/  0.50, 0.49, /***/ 0.50, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3, otok 
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.50, 0.505, /***/  0.50, 0.49, /***/ 0.49, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3   
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.60, 0.605, /***/  0.60, 0.59, /***/ 0.49, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3
    

///// TRECINE  

[0.90, 0.80, /***/ 0.78, 0.73, /***/ 0.665, 0.66, /***/  0.625, 0.62, /***/ 0.50, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, brda 4 u daljini SUPER
[0.92, 0.82, /***/ 0.79, 0.74, /***/ 0.665, 0.66, /***/  0.67, 0.58, /***/ 0.48, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, brda 4 u daljini malo veća SUPER
[0.95, 0.85, /***/ 0.85, 0.75, /***/ 0.665, 0.66, /***/  0.665, 0.66, /***/ 0.60, 0.46, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, brda 4 u daljini malo veća SUPER
[0.94, 0.92, /***/ 0.90, 0.87, /***/ 0.70, 0.69, /***/  0.66, 0.62, /***/ 0.48, 0.42, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.48, 0.33, /***/ 0.9, 1.1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK 
[0.79, 0.75, /***/ 0.75, 0.69, /***/ 0.665, 0.66, /***/  0.65, 0.62, /***/ 0.61, 0.55, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 URAVNO SVE
[0.83, 0.77, /***/ 0.75, 0.69, /***/ 0.665, 0.66, /***/  0.65, 0.62, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 URAVNO SVE
[0.95, 0.71, /***/ 0.80, 0.70, /***/ 0.66, 0.665, /***/  0.65, 0.62, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA se vide izmedju BRDO 3
[0.95, 0.86, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.86, /***/ 0.89, 0.85, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3      
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.51, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3     
[0.91, 0.80, /***/ 0.85, 0.78, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.49, 0.27, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 ravna, BRDO 3 na 2/3     
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 jajasta, BRDO 3 na 2/3       
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.25, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA dp 1/5 jajasta, BRDO 3 na 2/3 TAK TAK        
   
  
// /////// PETINE    
  
[0.91, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.45, 0.39, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER    
[0.90, 0.81, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.50, 0.46, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA RAVNA ODMA IZNAD BRDA 3    
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.35, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA GORE MANJE RAVNA    
[0.90, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.54, 0.49, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER
[0.95, 0.98, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.50, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.94, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.95, 0.86, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER 
[0.95, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.66, 0.61, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA DOLE      
[0.96, 0.85, /***/ 0.95, 0.90, /***/ 0.80, 0.79, /***/  0.71, 0.78, /***/ 0.56, 0.36, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA SREDINA 
[0.95, 0.85, /***/ 0.95, 0.88, /***/ 0.82, 0.81, /***/  0.75, 0.78, /***/ 0.72, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.71, /***/ 0.60, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.88, /***/ 0.92, 0.86, /***/ 0.825, 0.82, /***/  0.76, 0.71, /***/ 0.73, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA  
[1.05, 0.92, /***/ 1.05, 0.92, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, NEMA PRVO I DRUGO BRDO
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.80, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA KO OTOK
[0.96, 0.93, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA
[0.96, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE 
[0.98, 0.84, /***/ 0.98, 0.77, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.39, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5, prednja brda ekstremna 
[0.895, 0.88, /***/ 0.895, 0.88, /***/ 0.895, 0.88, /***/  0.895, 0.88, /***/ 0.66, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ, SAMO VEĆA BRDA 



// RIJETKE 

[0.95, 0.78, /***/ 0.895, 0.68, /***/ 0.605, 0.60, /***/  0.50, 0.30, /***/ 0.35, 0.18, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA 3 SKORO PRELAZE NOISE BRDA
[0.95, 0.78, /***/ 0.895, 0.70, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.70, 0.65, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 0], // SAMO BRDO 1, BRDO 2, MALO POVIRUJU PLANINE  
[0.95, 0.78, /***/ 0.895, 0.70, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.85, 0.70, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 0], // SAMO BRDO 1, BRDO 2, MALO POVIRUJU PLANINE  
[0.95, 0.78, /***/ 0.895, 0.70, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.80, 0.70, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 1], // SAMO BRDO 1, BRDO 2, MALO POVIRUJU PLANINE  
[0.95, 0.90, /***/ 0.895, 0.80, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.80, 0.70, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 1], // SAMO BRDO 1, BRDO 2, MALO POVIRUJU PLANINE  
[0.85, 0.80, /***/ 0.85, 0.75, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.75, 0.65, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 1], // SAMO BRDO 1, BRDO 2, MALO POVIRUJU PLANINE   
[0.95, 0.90, /***/ 0.80, 0.60, /***/ 0.54, 0.53, /***/  0.53, 0.45, /***/ 0.40, 0.20, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, TAK TAK    
[0.98, 0.84, /***/ 0.98, 0.77, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.50, 0.37, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5, prednja brda ekstremna  
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.605, 0.600, /***/  0.60, 0.58, /***/ 0.33, 0.69, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3, brda prema unutra  
[0.95, 0.71, /***/ 0.80, 0.70, /***/ 0.665, 0.66, /***/  0.66, 0.665, /***/ 0.65, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, nema BRDO 3, otok 
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.31, 0.59, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 2/3 TAK TAK  
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.30, 0.95, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 ravna, BRDO 3 na 2/3  TAK TAK  
[0.90, 0.80, /***/ 0.85, 0.80, /***/ 0.465, 0.46, /***/ 0.46, 0.45, /***/ 0.37, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/5 NEMA BRDA   
[1.00, 0.68, /***/ 0.69, 0.63, /***/ 0.485, 0.48, /***/ 0.47, 0.43, /***/ 0.39, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/5 NAPRID VALOVITO   
[0.90, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.59, 0.56, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA RAVNA ODMA IZNAD BRDA 3  
[0.96, 0.86, /***/ 0.95, 0.84, /***/ 0.81, 0.80, /***/  0.79, 0.67, /***/ 0.35, 0.66, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA JAJASTA  
[0.925, 0.92, /***/ 0.915, 0.91, /***/ 0.895, 0.89, /***/  0.885, 0.88, /***/ 0.85, 0.50, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ, SAMO VEĆA BRDA
[0.925, 0.92, /***/ 0.915, 0.91, /***/ 0.895, 0.89, /***/  0.885, 0.88, /***/ 0.85, 0.80, /***/ 1, 1, /***/ 1, 1, 1, 1, 0, 1, 1], // horizont 4/5 URAVNO SVE SKROZ  
[0.925, 0.92, /***/ 0.915, 0.91, /***/ 0.895, 0.89, /***/  0.885, 0.88, /***/ 0.80, 0.73, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ  
[0.85, 0.65, /***/ 0.70, 0.40, /***/ 0.335, 0.33, /***/ 0.35, 0.25, /***/ 0.25, 0.15, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/3 SUPER   
[0.90, 0.90, /***/ 0.90, 0.90, /***/ 0.88, 0.88, /***/ 0.90, 0.90, /***/ 0.80, 0.75, /***/ 1, 1, /***/ 1, 0, 1, 0, 1, 1, 1], // horizont 4/5 SUPER 
[0.90, 0.90, /***/ 0.90, 0.90, /***/ 0.88, 0.88, /***/ 0.88, 0.85, /***/ 0.80, 0.70, /***/ 1, 1, /***/ 0, 0, 1, 1, 1, 1, 1], // horizont 4/5 SUPER 
[0.85, 0.85, /***/ 0.80, 0.80, /***/ 0.85, 0.85, /***/ 0.85, 0.83, /***/ 0.75, 0.56, /***/ 1, 1, /***/ 0, 0, 1, 1, 1, 1, 0], // horizont 4/5 SUPER 
  
]; 

	} else {  


	nagibi_array = [


//////// NAJBOLJE



[0.895, 0.88, /***/ 0.895, 0.88, /***/ 0.895, 0.88, /***/  0.895, 0.88, /***/ 0.66, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ, SAMO VEĆA BRDA
[1.05, 0.92, /***/ 1.05, 0.92, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, NEMA PRVO I DRUGO BRDO
[1.05, 0.92, /***/ 1.05, 0.92, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.80, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, NEMA PRVO I DRUGO BRDO
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.80, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA KO OTOK
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE 
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.70, 0.69, /***/  0.61, 0.58, /***/ 0.44, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 0.9, 1.1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.98, 0.84, /***/ 0.98, 0.77, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.37, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5, prednja brda ekstremna 

    

  
///// POLOVINA  
  
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.505, 0.50, /***/  0.50, 0.49, /***/ 0.50, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3, otok 
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.505, 0.50, /***/  0.50, 0.49, /***/ 0.49, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3   
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.605, 0.60, /***/  0.60, 0.59, /***/ 0.49, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.605, 0.60, /***/  0.60, 0.59, /***/ 0.59, 0.19, /***/ 1, 1, /***/ 1, 1, 1, 0, 1, 1, 0], // horizont 1/2, nema BRDO 3 bez oblaka u krug
 
  
/// TRECINE  


[0.95, 0.71, /***/ 0.80, 0.70, /***/ 0.66, 0.665, /***/  0.65, 0.62, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA se vide izmedju BRDO 3
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.86, /***/ 0.89, 0.85, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3      
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.51, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3     
[0.90, 0.80, /***/ 0.85, 0.78, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.49, 0.27, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 ravna, BRDO 3 na 2/3     
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 jajasta, BRDO 3 na 2/3       
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.25, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA dp 1/5 jajasta, BRDO 3 na 2/3 TAK TAK        
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.59, 0.21, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA dp 1/5 jajasta, BRDO 3 na 2/3 TAK TAK  
  
/////// PETINE    
  
[0.90, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.45, 0.39, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER    
[0.91, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.50, 0.46, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA RAVNA ODMA IZNAD BRDA 3    
[0.90, 0.81, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.35, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA GORE MANJE RAVNA    
[0.91, 0.81, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.54, 0.49, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER
[0.95, 0.98, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.50, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.95, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.96, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER 
[0.95, 0.86, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.66, 0.61, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA DOLE      
[0.96, 0.85, /***/ 0.95, 0.90, /***/ 0.80, 0.79, /***/  0.71, 0.78, /***/ 0.56, 0.36, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA SREDINA 
[0.95, 0.86, /***/ 0.95, 0.88, /***/ 0.82, 0.81, /***/  0.75, 0.78, /***/ 0.72, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.71, /***/ 0.60, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5  


//////// NAJBOLJE



[0.895, 0.88, /***/ 0.895, 0.88, /***/ 0.895, 0.88, /***/  0.895, 0.88, /***/ 0.66, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ, SAMO VEĆA BRDA
[1.05, 0.92, /***/ 1.05, 0.92, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, NEMA PRVO I DRUGO BRDO
[1.05, 0.92, /***/ 1.05, 0.92, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.80, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, NEMA PRVO I DRUGO BRDO
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.80, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA KO OTOK
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE, MALO BRDA VEĆA
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE 
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.70, 0.69, /***/  0.61, 0.58, /***/ 0.44, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 0.9, 1.1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.98, 0.84, /***/ 0.98, 0.77, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.37, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5, prednja brda ekstremna 

    

  
///// POLOVINA  
  
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.505, 0.50, /***/  0.50, 0.49, /***/ 0.50, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3, otok 
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.505, 0.50, /***/  0.50, 0.49, /***/ 0.49, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3   
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.605, 0.60, /***/  0.60, 0.59, /***/ 0.49, 0.35, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/2, nema BRDO 3
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.605, 0.60, /***/  0.60, 0.59, /***/ 0.59, 0.19, /***/ 1, 1, /***/ 1, 1, 1, 0, 1, 1, 0], // horizont 1/2, nema BRDO 3 bez oblaka u krug
 
  
/// TRECINE  


[0.95, 0.71, /***/ 0.80, 0.70, /***/ 0.66, 0.665, /***/  0.65, 0.62, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA se vide izmedju BRDO 3
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.61, 0.58, /***/ 0.51, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 1/3 TAK TAK  
[0.90, 0.86, /***/ 0.89, 0.85, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3      
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.59, 0.51, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/3 BRDO 3 na 2/3     
[0.90, 0.80, /***/ 0.85, 0.78, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.49, 0.27, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 ravna, BRDO 3 na 2/3     
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 2/5 jajasta, BRDO 3 na 2/3       
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.39, 0.25, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA dp 1/5 jajasta, BRDO 3 na 2/3 TAK TAK        
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.59, 0.21, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA dp 1/5 jajasta, BRDO 3 na 2/3 TAK TAK  
  
/////// PETINE    
  
[0.90, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.45, 0.39, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER    
[0.91, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.50, 0.46, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA RAVNA ODMA IZNAD BRDA 3    
[0.90, 0.81, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.35, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER, BRDA GORE MANJE RAVNA    
[0.91, 0.81, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.54, 0.49, /***/ 0.45, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 3/5 SUPER
[0.95, 0.98, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.50, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.95, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER    
[0.96, 0.85, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.69, 0.65, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 SUPER 
[0.95, 0.86, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.79, 0.76, /***/ 0.66, 0.61, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA DOLE      
[0.96, 0.85, /***/ 0.95, 0.90, /***/ 0.80, 0.79, /***/  0.71, 0.78, /***/ 0.56, 0.36, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA RAVNA SREDINA 
[0.95, 0.86, /***/ 0.95, 0.88, /***/ 0.82, 0.81, /***/  0.75, 0.78, /***/ 0.72, 0.60, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.45, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA     
[0.96, 0.84, /***/ 0.95, 0.85, /***/ 0.81, 0.80, /***/  0.76, 0.71, /***/ 0.60, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5  




  
///// RIJETKE 
  
[0.95, 0.78, /***/ 0.895, 0.68, /***/ 0.605, 0.60, /***/  0.50, 0.30, /***/ 0.50, 0.18, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA 3 SKORO PRELAZE NOISE BRDA  
[0.96, 0.88, /***/ 0.92, 0.86, /***/ 0.825, 0.82, /***/  0.82, 0.75, /***/ 0.70, 0.15, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 BRDA 4/5 MALO JAJASTA    
[0.95, 0.78, /***/ 0.895, 0.70, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.85, 0.60, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 0], // SAMO BRDO 1, BRDO 2, brdo 4 ispod, nema oblaka u krug  
[0.95, 0.78, /***/ 0.895, 0.70, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.90, 0.60, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 0], // SAMO BRDO 1, BRDO 2, brdo 4 ispod, nema oblaka u krug  
[0.95, 0.78, /***/ 0.895, 0.70, /***/ 1.605, 1.60, /***/  1.50, 1.30, /***/ 0.90, 0.60, /***/ 1, 1, /***/ 1, 1, 0, 0, 1, 1, 1], // SAMO BRDO 1, BRDO 2, brdo 4 ispod, nema oblaka u krug  
[0.95, 0.90, /***/ 0.80, 0.60, /***/ 0.54, 0.53, /***/  0.53, 0.52, /***/ 0.50, 0.30, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 1/5, TAK TAK    
[0.98, 0.84, /***/ 0.98, 0.77, /***/ 0.81, 0.80, /***/  0.76, 0.66, /***/ 0.56, 0.37, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5, prednja brda ekstremna  
[0.92, 0.82, /***/ 0.85, 0.75, /***/ 0.605, 0.600, /***/  0.60, 0.58, /***/ 0.33, 0.69, /***/ 1, 1, /***/ 1, 1, 1, 0, 1, 1, 1], // horizont 1/2, nema BRDO 3, brda prema unutra  
[0.95, 0.71, /***/ 0.80, 0.70, /***/ 0.665, 0.66, /***/  0.66, 0.665, /***/ 0.65, 0.40, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3, nema BRDO 3, otok 
[0.90, 0.80, /***/ 0.90, 0.75, /***/ 0.66, 0.67, /***/  0.63, 0.59, /***/ 0.31, 0.59, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 BRDO 3 na 2/3 TAK TAK  
[0.90, 0.81, /***/ 0.85, 0.77, /***/ 0.66, 0.67, /***/  0.63, 0.58, /***/ 0.30, 0.95, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/3 BRDA na 1/5 ravna, BRDO 3 na 2/3  TAK TAK  
[0.90, 0.80, /***/ 0.85, 0.80, /***/ 0.465, 0.46, /***/ 0.46, 0.45, /***/ 0.37, 0.33, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/5 NEMA BRDA   
[1.00, 0.68, /***/ 0.69, 0.63, /***/ 0.485, 0.48, /***/ 0.47, 0.43, /***/ 0.39, 0.29, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 2/5 NAPRID VALOVITO   
[0.90, 0.80, /***/ 0.85, 0.75, /***/ 0.61, 0.60, /***/ 0.59, 0.56, /***/ 0.59, 0.56, /***/ 1, 1, /***/ 1, 1, 1, 1, 0, 1, 1], // horizont 3/5 SUPER, BRDA RAVNA ODMA IZNAD BRDA 3  
[0.96, 0.86, /***/ 0.95, 0.84, /***/ 0.81, 0.80, /***/  0.79, 0.67, /***/ 0.35, 0.66, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 0, 1], // horizont 4/5 BRDA JAJASTA  nema uravno oblaka
[0.925, 0.92, /***/ 0.915, 0.91, /***/ 0.895, 0.89, /***/  0.885, 0.88, /***/ 0.85, 0.50, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ, SAMO VEĆA BRDA
[0.925, 0.92, /***/ 0.915, 0.91, /***/ 0.895, 0.89, /***/  0.885, 0.88, /***/ 0.85, 0.80, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE SKROZ  
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.80, /***/ 0.75, 0.15, /***/ 1, 1, /***/ 1, 1, 1, 1, 1, 1, 1], // horizont 4/5 URAVNO SVE samo velika zadnja brda
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.75, /***/ 0.75, 0.40, /***/ 1, 1, /***/ 0, 0, 1, 1, 1, 1, 0], // horizont 4/5 URAVNO SVE samo velika zadnja brda
[0.95, 0.92, /***/ 0.92, 0.88, /***/ 0.85, 0.84, /***/  0.82, 0.75, /***/ 0.75, 0.50, /***/ 1, 1, /***/ 0, 0, 1, 1, 1, 0, 1], // horizont 4/5 URAVNO SVE samo velika zadnja brda
  
];  

}

}

function initPalettes() {
	
	palettes = [
		

///// niko palete dnevne

['#FFEB3B', '#12a2f3', '#ffffff', '#12a2f3', '#340f0f', '#e22c2c', '#690b68', '#6ac9ff', '#5c1919'],
['#faf71c', '#6ac9ff', '#ffffff', '#6ac9ff', '#340f0f', '#e0dd19', '#134213', '#6ac9ff', '#5c1919'],
['#faf71c', '#6ac9ff', '#ffffff', '#6ac9ff', '#340f0f', '#faf71c', '#d55500', '#6ac9ff', '#5c1919'],
['#fbac0a', '#17b4ba', '#FFFFFF', '#17b4ba', '#02131a', '#fa1c5d', '#02131a', '#99e4e7', '#052532'], // tirkizno nebo
['#ffc107', '#136665', '#FFFFFF', '#136665', '#021606', '#ff9000', '#5c0000', '#46d1ff', '#032020'], // odlična zeleno nebo
['#ffc107', '#46d1ff', '#FFFFFF', '#cccccc', '#021606', '#ff9000', '#5c0000', '#46d1ff', '#3a0f00'],
['#ffc107', '#84cbe3', '#FFFFFF', '#cccccc', '#1f1202', '#ff9000', '#7b2000', '#5799cc', '#3a0f00'],
['#ffc107', '#84cbe3', '#FFFFFF', '#cccccc', '#140324', '#f94dd3', '#280746', '#5799cc', '#0a3507'],
['#ffc107', '#82a39d', '#FFFFFF', '#82a39d', '#450822', '#dc20b2', '#280746', '#5799cc', '#0a3507'], // zelena brda, krosnja pink i ljubicasta
['#ffc107', '#9dcbff', '#FFFFFF', '#9dcbff', '#450822', '#61a513', '#0a3507', '#9dcbff', '#0a3507'], // zelena brda i krosnje, stabla kafena
['#ffe538', '#92dfff', '#FFFFFF', '#92dfff', '#0c1e0b', '#ab1db0', '#3b0760', '#92dfff', '#0c1e0b'], // zelena stabla i brda, pink krošnje
['#f1ec5f', '#1cb9c3', '#e0f7f8', '#1cb9c3', '#271608', '#39983f', '#574122', '#1cb9c3', '#2d1c08'], // sestra ana
['#ffc107', '#2196F3', '#FFFFFF', '#1c94f1', '#271109', '#DFB22C', '#850933', '#1c94f1', '#42130F'],
['#ffc107', '#63b6f7', '#FFFFFF', '#1c94f1', '#271109', '#DFB22C', '#850933', '#1c94f1', '#031303'],
['#ffeb3b', '#d8f2ff', '#FFFFFF', '#d8f2ff', '#321004', '#ebdb43', '#032404', '#3D76A5', '#032305'],
['#FFEB3B', '#83D9FF', '#FFFFFF', '#A4E2FE', '#4E1B08', '#FF9800', '#C1431B', '#CCECAD', '#4E1B08'],
['#FFEB3B', '#AFE6FF', '#FFFFFF', '#AFE6FF', '#240C03', '#1E8621', '#062C07', '#83D9FF', '#240C03'],
['#FFEB3B', '#C2ECFF', '#ffffff', '#C2ECFF', '#3D1405', '#C04213', '#3D1405', '#88C3BA', '#3D1405'],
['#FFEB3B', '#C7EBFF', '#ffffff', '#8DACBD', '#271109', '#9C27B0', '#3F0748', '#8DACBD', '#072108'],
['#FFC107', '#AFE6FF', '#EDF9FF', '#AFE6FF', '#1D0D05', '#3a913c', '#0B1B0B', '#5D9DB9', '#1D0D05'],
['#fffc00', '#009DFF', '#FFFFFF', '#009DFF', '#441d00', '#ff0000', '#780000', '#009DFF', '#031C00'],
['#FFEB3B', '#ACF0FB', '#ffffff', '#ACF0FB', '#271109', '#F44336', '#c60506', '#8DACBD', '#1D021B'],
['#ffba31', '#ACF0FB', '#ffffff', '#ACF0FB', '#020308', '#c60506', '#300000', '#8DACBD', '#140101'],
['#ffba31', '#D4EFFF', '#ffffff', '#D4EFFF', '#020308', '#c60506', '#300000', '#8DACBD', '#140101'],
['#FFEB3B', '#579cc6', '#ffffff', '#579cc6', '#452b15', '#89a23d', '#176126', '#8DACBD', '#301B08'],
['#ffb643', '#00c5e8', '#ffffff', '#00c5e8', '#2e0100', '#db5201', '#ba0400', '#00c5e8', '#230D00'],


 
///// niko palete sumrak noc zalazak

['#ff9000', '#29404c', '#FFFFFF', '#29404c', '#310f00', '#990c0c', '#2c0303', '#789ca0', '#1b1014'], // crvena krosnja
['#ffeb3b', '#0d2836', '#FFFFFF', '#0d2836', '#28000e', '#BA0D00', '#2A0300', '#3D76A5', '#020D04'],
['#FFEB3B', '#FF5722', '#FFFFFF', '#FF5722', '#240C03', '#A20000', '#3F0000', '#43829E', '#180903'], // crvena krosnja, stabla kafena ODLIČNA
['#FFEB3B', '#C04213', '#ffffff', '#C04213', '#3D1405', '#C04213', '#3D1405', '#88C3BA', '#1B0903'],
['#FF9800', '#38678D', '#F2F2F2', '#38678D', '#1D0721', '#CA0000', '#230000', '#38678D', '#1D0721'],
['#FFEB3B', '#254A68', '#EDF7FF', '#254A68', '#0F0603', '#BE007E', '#240035', '#38678D', '#0F0603'],
['#FFC107', '#004A78', '#FFFFFF', '#004A78', '#1C0C00', '#FFEB3B', '#54004C', '#004A78', '#1C0C00'],
['#e9c46a', '#165A52', '#ffffff', '#165A52', '#271109', '#287271', '#14252C', '#447C92', '#132830'],

///// niko palete dnevne

['#FFEB3B', '#12a2f3', '#ffffff', '#12a2f3', '#340f0f', '#e22c2c', '#690b68', '#6ac9ff', '#5c1919'],
['#faf71c', '#6ac9ff', '#ffffff', '#6ac9ff', '#340f0f', '#e0dd19', '#134213', '#6ac9ff', '#5c1919'],
['#faf71c', '#6ac9ff', '#ffffff', '#6ac9ff', '#340f0f', '#faf71c', '#d55500', '#6ac9ff', '#5c1919'],
['#fbac0a', '#17b4ba', '#FFFFFF', '#17b4ba', '#02131a', '#fa1c5d', '#02131a', '#99e4e7', '#052532'], // tirkizno nebo
['#ffc107', '#136665', '#FFFFFF', '#136665', '#021606', '#ff9000', '#5c0000', '#46d1ff', '#032020'], // odlična zeleno nebo
['#ffc107', '#46d1ff', '#FFFFFF', '#cccccc', '#021606', '#ff9000', '#5c0000', '#46d1ff', '#3a0f00'],
['#ffc107', '#84cbe3', '#FFFFFF', '#cccccc', '#1f1202', '#ff9000', '#7b2000', '#5799cc', '#3a0f00'],
['#ffc107', '#84cbe3', '#FFFFFF', '#cccccc', '#140324', '#f94dd3', '#280746', '#5799cc', '#0a3507'],
['#ffc107', '#82a39d', '#FFFFFF', '#82a39d', '#450822', '#dc20b2', '#280746', '#5799cc', '#0a3507'], // zelena brda, krosnja pink i ljubicasta
['#ffc107', '#9dcbff', '#FFFFFF', '#9dcbff', '#450822', '#61a513', '#0a3507', '#9dcbff', '#0a3507'], // zelena brda i krosnje, stabla kafena
['#ffe538', '#92dfff', '#FFFFFF', '#92dfff', '#0c1e0b', '#ab1db0', '#3b0760', '#92dfff', '#0c1e0b'], // zelena stabla i brda, pink krošnje
['#f1ec5f', '#1cb9c3', '#e0f7f8', '#1cb9c3', '#271608', '#39983f', '#574122', '#1cb9c3', '#2d1c08'], // sestra ana
['#ffc107', '#2196F3', '#FFFFFF', '#1c94f1', '#271109', '#DFB22C', '#850933', '#1c94f1', '#42130F'],
['#ffc107', '#63b6f7', '#FFFFFF', '#1c94f1', '#271109', '#DFB22C', '#850933', '#1c94f1', '#031303'],
['#ffeb3b', '#d8f2ff', '#FFFFFF', '#d8f2ff', '#321004', '#ebdb43', '#032404', '#3D76A5', '#032305'],
['#FFEB3B', '#83D9FF', '#FFFFFF', '#A4E2FE', '#4E1B08', '#FF9800', '#C1431B', '#CCECAD', '#4E1B08'],
['#FFEB3B', '#AFE6FF', '#FFFFFF', '#AFE6FF', '#240C03', '#1E8621', '#062C07', '#83D9FF', '#240C03'],
['#FFEB3B', '#C2ECFF', '#ffffff', '#C2ECFF', '#3D1405', '#C04213', '#3D1405', '#88C3BA', '#3D1405'],
['#FFEB3B', '#C7EBFF', '#ffffff', '#8DACBD', '#271109', '#9C27B0', '#3F0748', '#8DACBD', '#072108'],
['#FFC107', '#AFE6FF', '#EDF9FF', '#AFE6FF', '#1D0D05', '#3a913c', '#0B1B0B', '#5D9DB9', '#1D0D05'],
['#fffc00', '#009DFF', '#FFFFFF', '#009DFF', '#441d00', '#ff0000', '#780000', '#009DFF', '#031C00'],
['#FFEB3B', '#ACF0FB', '#ffffff', '#ACF0FB', '#271109', '#F44336', '#c60506', '#8DACBD', '#1D021B'],
['#ffba31', '#ACF0FB', '#ffffff', '#ACF0FB', '#020308', '#c60506', '#300000', '#8DACBD', '#140101'],
['#ffba31', '#D4EFFF', '#ffffff', '#D4EFFF', '#020308', '#c60506', '#300000', '#8DACBD', '#140101'],
['#FFEB3B', '#579cc6', '#ffffff', '#579cc6', '#452b15', '#89a23d', '#176126', '#8DACBD', '#301B08'],
['#ffb643', '#00c5e8', '#ffffff', '#00c5e8', '#2e0100', '#db5201', '#ba0400', '#00c5e8', '#230D00'],


 
///// niko palete sumrak noc zalazak

['#ff9000', '#29404c', '#FFFFFF', '#29404c', '#310f00', '#990c0c', '#2c0303', '#789ca0', '#1b1014'], // crvena krosnja
['#ffeb3b', '#0d2836', '#FFFFFF', '#0d2836', '#28000e', '#BA0D00', '#2A0300', '#3D76A5', '#020D04'],
['#FFEB3B', '#FF5722', '#FFFFFF', '#FF5722', '#240C03', '#A20000', '#3F0000', '#43829E', '#180903'], // crvena krosnja, stabla kafena ODLIČNA
['#FFEB3B', '#C04213', '#ffffff', '#C04213', '#3D1405', '#C04213', '#3D1405', '#88C3BA', '#1B0903'],
['#FF9800', '#38678D', '#F2F2F2', '#38678D', '#1D0721', '#CA0000', '#230000', '#38678D', '#1D0721'],
['#FFEB3B', '#254A68', '#EDF7FF', '#254A68', '#0F0603', '#BE007E', '#240035', '#38678D', '#0F0603'],
['#FFC107', '#004A78', '#FFFFFF', '#004A78', '#1C0C00', '#FFEB3B', '#54004C', '#004A78', '#1C0C00'],
['#e9c46a', '#165A52', '#ffffff', '#165A52', '#271109', '#287271', '#14252C', '#447C92', '#132830'],



// //// niko palete monokromatske ili čudne palete

['#c0ced9', '#c0ced9', '#c0ced9', '#8b99a7', '#1f1712', '#434b26', '#192413', '#c0ced9', '#192413'], // kiša
['#faf71c', '#fbac0a', '#ffffff', '#fbac0a', '#0e142c', '#faf71c', '#d55500', '#faf71c', '#173a11'], // limun
['#e3e8ec', '#ced5dc', '#e3e8ec', '#b3bec8', '#141814', '#c7d1c6', '#141814', '#f0f5f8', '#2b332a'], // zimska 
['#ff9000', '#7c515f', '#FFFFFF', '#7c515f', '#310f00', '#b55071', '#3c0028', '#789ca0', '#1b1014'], // nekakva purple paleta
['#ffc600', '#00a8ff', '#FFFFFF', '#00a8ff', '#310f00', '#ff3c00', '#3c0028', '#00a8ff', '#003107'], // RGB gori sve
['#ffc600', '#539fde', '#FFFFFF', '#478cc5', '#450822', '#539fde', '#081016', '#4883a1', '#210410'], // plavo nebo i krosnje, avatar
['#fdfb34', '#e7998c', '#FFFFFF', '#c16151', '#450822', '#f44221', '#6f0c49', '#8cbbe7', '#37231f'], // nebo blijeda roza, krosnja narancasto pink
['#ffc107', '#fff5c2', '#FFFFFF', '#fff5c2', '#450822', '#b21f1f', '#2a0707', '#9dcbff', '#241a0a'], // žuta pješčana paleta, crvene krošnje
['#bbd4ea', '#0c243a', '#13263f', '#091320', '#06101c', '#02131f', '#010a11', '#537481', '#091320'],
['#FFC107', '#39005F', '#F0D9FF', '#39005F', '#0F0603', '#7700C6', '#11001C', '#38678D', '#0F0603'],
['#FFC107', '#BE007E', '#EDF7FF', '#BE007E', '#0F0603', '#BE007E', '#230000', '#38678D', '#0F0603'],
['#FFC107', '#AC0C00', '#ffffff', '#F44336', '#1D0721', '#388D49', '#150A28', '#38678D', '#0D0803'],
['#CCCCCC', '#000000', '#000000', '#B90000', '#1C0303', '#000000', '#520808', '#BE1010', '#1C0303'],
['#F2F2F2', '#000000', '#D8D8D8', '#000000', '#000000', '#161616', '#000000', '#929292', '#000000'],
['#F44336', '#264C6A', '#F2F2F2', '#1A3952', '#1D0721', '#CA0000', '#230000', '#38678D', '#050301'],
['#42FF3F', '#001A00', '#014D00', '#001A00', '#001A00', '#02AE00', '#001A00', '#6D0000', '#001A00'],
['#E4E4E4', '#191919', '#4E4E4E', '#161616', '#161616', '#818181', '#000000', '#0092AA', '#161616'],


 
	];
}

function noiseFilter(img, scaleFactor, amount) {
	img.loadPixels();
	let change = amount * sqrt(scaleFactor);
	let size = 4 * (img.width * img.pixelDensity()) * (img.height * img.pixelDensity());
	let pixels = img.pixels;
	
	for (let i = 0; i < size; i += 4) {
		var n = -change + random() * change * 2;
		pixels[i] += n;
		pixels[i + 1] += n;
		pixels[i + 2] += n;
	}
	img.updatePixels();
}