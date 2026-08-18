let seed = 0; //seed Hash

function setup() {
	seed=int(fxrand() * 100000000); // FXHASH seed rand
	randomSeed(seed);
	yo2 = 0;
	yo3 = random() * 0.001 - 0.0005;
	fxp = 0;
	myrot = 0;

	const myaname = ["Landscape 16:9", "Square", "Portrait 12:16"];
	myaspect = 2




	if (myaspect == 0) {
		myasratx = 16;
		myasraty = 9;
		myox = 3840;
		myoy = 2160;
	}
	if (myaspect == 1) {
		myasratx = 12;
		myasraty = 12;
		myox = 2880;
		myoy = 2880;
	}
	if (myaspect == 2) {
		myasratx = 12;
		myasraty = 16;
		myox = 2880;
		myoy = 3840;
	}
	gg = min((windowWidth * myasraty) / myasratx, windowHeight);
	mywidth = (gg * myasratx) / myasraty;
	myheight = gg;
	createCanvas((gg * myasratx) / myasraty, gg, WEBGL);

	pg = createGraphics(myox, myoy, WEBGL);
	pg3 = createGraphics(myox, myoy, WEBGL);

	pixelDensity(1);
	pg.pixelDensity(1);

	pg3.pixelDensity(1);

	pg.strokeWeight(0);

	pg3.strokeWeight(0);
pg.colorMode(RGB, 255);

pg3.colorMode(RGB, 255);
colorMode(RGB, 255);
			pg4 = createGraphics(myox, myoy);
	
	

	loopy =-28;
	loopy2 = -25;
	pp =
		24 +
		Math.floor(random() * 4);
	spx = 0;
	spy = 0;
	while (spx + spy < 3.1 || spx + spy > 5.3 || spx < 1.5 || spy < 1.5) {
		spx = (Math.floor(random() * 6) + 2) / 2;
		spy = (Math.floor(random() * 6) + 2) / 2;
	}
	
	
	myzoom = Math.floor(((random()*3)*3+47));
	myzoom2 = Math.floor(((random()*3)*3+47));
	myzoom3 = myzoom*myzoom2;
	pg.translate(0,-200,-myzoom3);
//pg.rotateX(0.1);

	//pg.background(10,20,50);

	spx = 1;
	spy = 1;
	if (random() > 0.4) {
		spx = 1;
		spy = 1.5;
	}
	if (random() > 0.7) {
		spx = 1.5;
		spy = 1;
	}

	if (myaspect == 1 && spy == 1.5) {
		spy = 1;
		spx = 1.5;
	}

	boxer = Math.floor(random() * 4) + 3;

	boxer2 = boxer;
	boxer = (boxer * boxer * boxer) * 1.5 + 40;

	backbx = 1000;
	backby = 1000;
	while ((backbx + backby) > 1000 || (backbx > 200 && backby > 200)) {

		backbx = (Math.floor(random() * (8 - boxer2)) + 1) * 100;
		backby = (Math.floor(random() * (8 - boxer2)) + 1) * 100;
	}


	if (backbx * backby > 49000 && boxer2 > 5) {
		boxer2 = 5;
		boxer = 125;

	}
	if (backbx * backby > 68000 && boxer2 > 4) {
		boxer2 = 4;
		boxer = 64;

	}

	if (backbx * backby < 28000 && boxer2 == 3) {
		boxer2 = 4;
		boxer = 72;

	}
	if (backbx * backby < 18000 && boxer2 == 4) {
		boxer2 = 5;
		boxer = 150;

	}

	if (backbx > (backby)) {
		dum = backbx;
		backbx = backby;
		backby = dum;
	}

	mycl = Math.floor(random() * 5) + 4;
	const mclname = [
		"Full Random",
		"Red",
		"Green",
		"Blue",
		"Wild Red",
		"Wild Yellow",
		"Mono",
		"Wild Green",
		"Wild Blue",
		"Dark Light",
	];
	if (mycl == 7) {
		mycl = 7;
	}
	if (mycl == 2) {
		mycl = 6;
	}
	if (mycl == 3) {
		mycl = 6;
	}
	if (mycl == 1) {
		mycl = 4;
	}
	
	if (mycl==6 && random()>0.4) {
		mycl=Math.floor(random() * 2) + 4;
	}
	if (mycl>6 && random()>0.8) {
		mycl=Math.floor(random() * 2) + 4;
	}
//	mycl=6;
	if (mycl==4) {

		
			pg.background(151,46,46);
		myr5=151;
	myg5=46;
	myb5=46;
		
	}
	if (mycl==5) {
		
			pg.background(128,100,27);
	myr5=128;
	myg5=100;
	myb5=27;
	}
	if (mycl==6) {
		if (random()>0.5) {
			pg.background(32,32,32);
		myr5=32;
	myg5=32;
	myb5=32;
		} else {
			pg.background(144,144,144);
	myr5=144;
	myg5=144;
	myb5=144;			
		}
	}
	if (mycl==7) {
			pg.background(16,78,25);
		myr5=16;
	myg5=78;
	myb5=25;

			
	}
	if (mycl==8) {
			pg.background(16,25,67);
	myr5=16;
	myg5=25;
	myb5=67;
		
	}


	if (random()>0.6) {
		
		pg.background(32, 32, 32);
			myr5=32;
	myg5=32;
	myb5=32;
	}
	

	pg.strokeWeight(1);
	for (a=0;a<myoy;a++) {
		myr5=myr5+random()*2-1;
		myg5=myg5+random()*2-1;
		myb5=myb5+random()*2-1;
	  c5=color(myr5,myg5,myb5);
		pg.stroke(c5);
		pg.fill(c5);
	//	pg.rect(-myox, (a-myoy/2) *2, myox*2, 5);
		
	}

	whiteback = 0;


	if (backbx * backby > 70000) {
		backbx = backbx / 2;
		backby = backby / 2;
	}

	if (whiteback == 1 && backby > 300) {
		backby = 300;
	};


	if (whiteback == 1 && backbx > 300) {
		backbx = 300;
	};

	if (whiteback == 1 && pp > 28) {
		pp = 28;
	};

	if (whiteback == 1 && boxer > 200) {
		boxer = 100;
	};

	if (mycl == 6) {
		backby = backby * 1.2;
	}

	const boname = ["Dark", "Light", "Black", "White"];

	mybo = Math.floor(random() * 4);
	if (mycl == 6 && mybo == 0) {
		mybo = 2;
	}
	if (mybo == 1) {
		mybo = 3;
	}

	somerot = 0;
	bmulti = 0
	if (mybo != 3 && random() < 0.4) {
		somerot = 1;
	}
	somerot2 = 0;
	mysomerot = random() * 40000;
	if (mysomerot > (backbx * backby) && random() > 0.5) {

		somerot2 = 1;
		gowild = 1;
		if (random() > 0.5) {
			gowild = 2;
		} else {
			if (backbx > backby * 3) {
				backbx = backby / 3;
			}
		}

	}
	if (somerot2 == 0 && backbx < 550 && backby < 550) {
		if (random() > 0.4) {
			somerot2 = 2;
			bmulti = Math.floor(random() * 2) + 1;
		//	boxer = boxer * bmulti;


		}
	}

	rore = 0;

	if (random() > 0.3 && (backbx * backby) < 55000 && boxer < 160) {
		rore = 1;
		somerot = 0;
	}

	if (random() > 0.3 & somerot2 == 2) {
		rore = 1;
		somerot = 0;
	}

	if (rore == 0 && random() > 0.4) {
		rore = 1;
		somerot = 0;
	}

	if (backby == backbx) {
		backby = backby * 2;
		backbx = backbx * 0.5;
	}
	if (backby > 1.8 * backbx || backbx > 1.8 * backby) {

	} else {
		if (backbx < backby) {
			backby = backby * 1.6;
			backbx = backbx * 0.6;
			if (backbx > 150) {
				backbx = 100;
			}
		}
		if (backby < backbx) {
			backbx = backbx * 1.6;
			backby = backby * 0.6;
		}
	}

	if ((somerot2 == 0) && (backbx > backby)) {
		dum = backbx;
		backbx = backby;
		backby = dum;
	}
	if ((somerot2 > 0) && (backbx > backby) && random() > 0.3) {
		dum = backbx;
		backbx = backby;
		backby = dum;
	}

	if (backbx * backby < 32000) {
		yo5 = 32000 / (backbx * backby);
		backbx = backbx * yo5;
		backby = backby * yo5;

	}

	if (backbx * backby > 80000) {
		yo5 = 80000 / (backbx * backby);
		backbx = backbx * yo5;
		backby = backby * yo5;

	}

	if (backbx / backby < 1 && backbx / backby > 0.4) {

		backbx = backbx * 0.75;
		backby = backby * 1.25;

	}


	if (backbx * backby * boxer < 2500000) {
		boxer = boxer + 32;
	}

	if (backbx * backby * boxer > 12500000) {
		yo5 = 12500000 / (backbx * backby * boxer);
		boxer = boxer * yo5;
	}
	boxer = boxer * 1.4;
	if (backbx > 140) {
		backbx = backbx / 1.5;
	}
	if (boxer < 150) {
		boxer = 160;
	}


	if (somerot2 == 2 && random() > 0.33) {
		spx = 1;
		spy = 1;
	}

	yoyo4 = 0;
	if (rore == 0 && random() > 0.75) {
		yoyo4 = 3;
	}
	if (rore == 1 || somerot2 == 2) {
		yoyo4 = 1;
	}
	if (rore == 1 && (somerot2 < 2 && random() > 0.5) || (somerot2 == 2 && random() > 0.8)) {
		yoyo4 = 2;

	}

	yoyo5 = Math.floor(random() * 4) * 3 + 2;
	if (rore == 0) {
		boxer = boxer * 1.6;
	} else {
		boxer = boxer * 1.2;
	}
	rore = 1;

	yoyo9 = 2;
	if (rore == 1) {
		yoyo9 = 5;
		if (random() > 0.5) {
			yoyo9 = 10;
		}
	}

	eelsize = Math.floor(random() * 2) + 1;
	myback2 = Math.floor(random() * 3) + 1;
	myback3 = Math.floor(random() * 3)+ Math.floor(random() * 2)+2 ;
	styler7 = Math.floor(random()*4) +1;
		styler7l=1;
		styler7u=11;
	styler7=3;

		somerot2=0;
	

	if (styler7==1) {
	styler7=3;
	}
	if (styler7==3 && somerot2!=2) {
		styler7l=4;
		styler7u=11;
	}
	if (styler7==4) {
		styler7l=1;
		styler7u=9;
	}
	if (styler7==2) {
		styler7l=1;
		styler7u=10;
	}
		//0.7 -interesting - 8
	//0.025 to 0.28 - standard 12
	//0.036 - wide view - 8
	//0.275 - 1 rot - 2
	//-0.177 - reverse interest - 2
	//-0.65 - another spin -1
	//1.911 - many flips -1
	
	overrot = Math.floor(random()*15)+13 ;

	if (overrot<16) {
		overrotname = "14 Spaces";
		overrotrot=-PI/14 +0.01;
	}

	if (overrot>15 && overrot<25) {
		overrotname = "Ground Zero";
		overrotrot=0.698;
	}

	if (overrot>24 && overrot<27) {
		overrotname = "13th Slice";
		overrotrot=PI/13;
	}

	if (overrot>26 && overrot<28) {
		overrotname = "Another Spin";
		overrotrot=-0.177;
	}
	if (overrot>27 && overrot<30) {
		overrotname = "Many Flips";
		overrotrot=1.91;
	}
	
	//overrotrot=-PI/14;
	
	myview = "Straight On";
	if ((styler7l>1 && somerot2!=2)) { 
		myview="Horizon"; 
	}
	//myview="Horizon"; 
	//pg.background(239, 232, 210);
	
	mysonar = "One";
	if (random()>0.5) { 
		mysonar="Many"; 
	}
	
	mysonarstyle = "Angle";
	if (random() > 0.8 || myview=="Horizon") {
		mysonarstyle = "Circle";
		mysonar="One";
	}
mycloudstroke=1;
	if (mycl==6 && random()>0.5) {
	mycloudstroke=500;
}
	
	if (myview=="Horizon") {
	
	mycloudstroke=2;
}
//	console.log(myzoom3 + " " + overrotname);


	doublegas=0;
	if (random()>0.2) {
		doublegas=2;
		
	}
	if (random()>0.7) {
		doublegas=1;
		
	}

	mywave = Math.floor(random() * 6) * 400 - 800;
	if (mywave == 0) {
		mywave = -1200;
	}
	if (somerot2 != 2 && (Math.abs(mywave) == 400)) {
		mywave = mywave * 2.5;
	}
	//mywave=50;
	if (random()>0.4 || somerot2==2) {mywave=mywave/5;}

	boxer = Math.floor(boxer * myback3 * myback3 / 25);
	if (boxer>240) {
		boxer=Math.floor(boxer/2);
	}
	if (boxer<100) {
		boxer=boxer*2;
	}
	backby=backby*(random()*2+1)
	backbx=backbx*(random()*1+1)
	minner=Math.floor(random()*60);
	cgap=Math.floor(random()*12);
	
	xnet = [];
	ynet = [];
	sloop = 5;

	if (somerot2 == 2) {
		sloop = 2;
		boxer=boxer/1.5;
	}
		
	c12 = color(210, 200, 64,64);
	
	myback4 = Math.floor(random()*5);
	myframe = Math.floor(random()*2);
	if (mycl==6) {myframe=1;}
	
	mydd = Math.floor(random()*3)*150+300;
	
	if (random()>0.95) {
		mydd=2000;
		
	}
	if (overrotname == "14 Spaces") {
		mydd=300;
	}
	
	
	cstyle = 32;
	cstylename = "Standard";
	
	if (random()>0.85 && mycl!=6) {
		cstyle=80;
		cstylename = "Heavy Color";
	}	
	
	vstyle=1;
	vstylename = "Angular";
	if (random()>0.95) {
		vstyle=4;
		vstylename = "Regular";
	}
	if (random()>0.95) {
		vstyle=3;
		vstylename = "Hyper Angular";
	}
	if (random()>0.95) {
		vstyle=6;
		vstylename = "High Angular";
	}
	
	if (cstyle==80) {
	vstyle=1;
	vstylename = "Angular";
		
	}
	
	if (random()>0.9) {
		vstyle=2;
		vstylename = "Smooth";
	}
	
	tgon=0;
	tgoy=0;
	trot1 = Math.floor(random()*5)*0.008;

	myzoomshow = Math.floor(myzoom3/200);
//	console.log("Scene:" + overrotname + " Zoom: " + myzoomshow + " Color Start: " + mclname[mycl] + " Back Style 1: " + myback2 + " Back Style 2: " + myback3,
//							"Trunk Wave: " + mywave + " Back Size: " + mydd + " Color Style: " + cstylename + " Vertex Style: " + vstylename + " Frame Style: " + myframe + " Twist: " + trot1 );

		window.$fxhashFeatures = {
		"Scene": overrotname,
		"Color Style": cstylename,
		"Vertext Style": vstylename,
		"Color Start": mclname[mycl],
		"Zoom": myzoomshow,
		"Back Size": mydd,
		"Back Style 1": myback2,
		"Back Style 2": myback3,
		"Frame Style": myframe,
		"Twist": trot1,		
		"Trunk Wave": mywave,		
	};



}

function draw() {
	pg.translate(0,0,26);
//	pg.rotateX(PI*(random()-0.5)/100);
//	pg.rotateY(PI*(random()-0.5)/100);
	loopy = loopy + 1;
	goy = random()*trot1-trot1/2;
	gon = random()*trot1-trot1/2;
	tgoy = tgoy+goy;
	tgon = tgon+gon;
	if ((tgoy>0.08 && goy>0) || (tgoy<-0.08 && goy<0)) {
		goy=-goy;
		tgoy = tgoy+2*goy;
	}
	if ((tgon>0.08 && gon>0) || (tgon<-0.08 && gon<0)) {
		gon=-gon;
		tgon = tgon+2*gon;
	}
pg.rotateY(goy);
pg.rotate(gon);
	if (loopy<0 && myview=="Horizon") {pg.rotateX(overrotrot);}
	
	if (loopy<0 && myview!="Horizon") {pg.rotateX(0.0);}
	//noprotect
	c = color(32, 32, 32);
	cwhite = color(240, 240, 240);
	cwhite2 = color(240, 240, 240);



	if (loopy == -27) {

		xr = random() * 255;
		xg = random() * 255;
		xb = random() * 255;

		yox = random() * myox - myox / 2;
		yoy = random() * myoy - myoy / 2;
		if (mycl == 6) {
			r27 = 3.00;
			g27 = 3.00;
			b27 = 3.00;
			c12 = color(210, 210, 210,32);

		}
		if (mycl == 4) {
			r27 = 2.98;
			g27 = 3.01;
			b27 = 3.00;
			c12 = color(210, 120, 100,32);
		}
		if (mycl == 5) {
			r27 = 2.97;
			g27 = 2.98;
			b27 = 3.01;
			c12 = color(220, 210, 50,32);
		}
		if (mycl == 7) {
			r27 = 3.0;
			g27 = 2.98;
			b27 = 3.00;
			c12 = color(56, 220, 110,32);
		}
		if (mycl == 8) {
			r27 = 3.00;
			g27 = 3.00;
			b27 = 2.96;
			c12 = color(56, 110, 220,32);
		}

		if (myback2 == 2) {
			if (mycl == 6) {
				r27 = 3.01;
				g27 = 3.01;
				b27 = 3.01;
			} else {
			r27 = 3.02;
			g27 = 3.02;
			b27 = 3.02;
			}
		}
		if (myback2 == 3) {
			if (mycl == 6) {
				r27 = 2.98;
				g27 = 2.98;
				b27 = 2.98;
			}
			if (mycl == 4) {
				r27 = 3.0;
				g27 = 3.01;
				b27 = 2.96;
			}
			if (mycl == 5) {
				r27 = 3.0;
				g27 = 3.01;
				b27 = 2.96;
			}
			if (mycl ==7) {
				r27 = 2.97;
				g27 = 2.97;
				b27 = 3.01;
			}
			if (mycl == 8) {
				r27 = 3.01;
				g27 = 2.98;
				b27 = 2.97;
			}
		}

	}
	if (loopy==-26 ) {
		golights();
		pg.translate(0,0,400);
			//pg.rotateX(0.9);
	}
	if (loopy<1) {

		for (d = (loopy+60); d < (loopy+61); d++) {
			yox = random() * myox - myox / 2;
			yoy = random() * myoy - myoy / 2;
	//	(yox,yoy, xr, xg, xb);
			pg.strokeWeight(20 / (d + 1));
			dd = myox * (130 - d) / 250;
			yox = yox + random() * 400 - 200;
			if (yox < -myox / 2) {
				yox = -myox / 2;
			}
			if (yox > myox / 2) {
				yox = myox / 2;
			}
			yoy = yoy + random() * 400 - 200;
			if (yoy < -myoy / 2) {
				yoy = -myoy / 2;
			}
			if (yoy > myoy / 2) {
				yoy = myoy / 2;
			}
			for (q = 0; q < dd+mydd; q++) {
				yox = yox + random() * 200 - 100;
				if (yox < -myox / 2) {
					yox = -myox / 2;
				}
				if (yox > myox / 2) {
					yox = myox / 2;
				}
				yoy = yoy + random() * 200 - 100;
				if (yoy < -myoy / 2) {
					yoy = -myoy / 2;
				}
				if (yoy > myoy / 2) {
					yoy = myoy / 2;
				}

				xr = xr + (random() * 6 - r27) * d / 60;
				if (xr > 240) {
					xr = 240
				};
				if (xr < 16) {
					xr = 16
				};
				if (mycl == 6) {
					xg = xr;
					xb = xr;
				} else {

					xg = xg + (random() * 6 - g27) * d / 60;
					if (xg > 240) {
						xg = 240
					};
					if (xg < 16) {
						xg = 16
					};
					xb = xb + (random() * 6 - b27) * d / 60;
					if (xb > 240) {
						xb = 240
					};
					if (xb < 16) {
						xb = 16
					};
				}
				//		if ((yoy*yoy + yox*yox)<1600000) {
			//	if ((yoy) > random() * 400 - 200) {
				rx=(random() * q+1)*2;
				ry=(random() * q+1)*2;
					
				
				if (mycl==6) {
					cs = color(xr, xg, xb, random()*64);
				//	cs = color(xr, xg, xb,255);
					c = color(xr, xg, xb, 32);
				} else {
					c = color(xr, xg, xb, cstyle);
		//		cs = color(xr-128*random()+64, xg-128*random()+64, xb-128*random()+64,random()*64);
				cs = color(xr-128*random()+64, xg-128*random()+64, xb-128*random()+64,random()*64);
				}
				pg.stroke(cs);
				pg.fill(c);
pg.strokeWeight(random()*mycloudstroke);
				if (vstyle==4) {
				jj = Math.floor(random()*3)*1+4;
					
				}

				if (vstyle==2) {
				jj = 50
				} 
				
								if (vstyle==1) {

				jj = Math.floor(random()*4)*2+4;
							//	jj = Math.floor(random()*5)*1+3;
				}
								if (vstyle==6) {

				jj = Math.floor(random()*3)*2+4;
							//	jj = Math.floor(random()*5)*1+3;
				}
							if (vstyle==3) {

				jj = Math.floor(random()*5)*1+3;
				}
	
			pg.ellipse(yox, yoy, rx, ry,jj);
			//	} else {
				//	pg.ellipse(yox, yoy, q, q);

			//	}

			}
		}


	}
	
	if (loopy==1) {
		golights();
		gobirds();
		rectwalk();
	}
	if (loopy == 200) {


		pg.fill(c);
		pg.stroke(cwhite);
		c = color(32, 32, 32);
		pg.rect(-myox / 2, -myoy / 2, myox, myoy);
		for (tx = -myox / 2; tx < myox / 2; tx += backbx / yoyo5) {
			for (ty = -myoy / 2; ty < myoy / 2; ty += backby / yoyo5) {
				pg.strokeWeight(random() * random() * random() * random() * 2);
				// pg.strokeWeight(0);
				cw2 = random() * 4 * random() * 4 * random() * 4;
				cwhite2 = color(cw2, cw2, cw2);
				pg.fill(cwhite2);


				if (yoyo4 == 0) {
					pg.rect(tx, ty, (backbx - 2) / yoyo5, (backby - 2) / yoyo5);
				}
				if (yoyo4 == 2) {
					pg.ellipse(tx, ty, (backbx - 2) / yoyo5, (backby - 2) / yoyo5);
				}
				if (yoyo4 == 3) {
					pg.rect(tx, ty, (backbx - 2), (backby - 2));
				}

			}
			if (tx < 0) {
				if (somerot2 == 2 && yoyo4 == 1) {

					pg.ellipse(0, 0, -tx * 3, -tx * 3);

				} else {
					if (yoyo4 == 1) {
						pg.ellipse(0, 0, -tx * 3 * spx, -tx * 3 * spy);
					}
				}
			}

		}
	}
	if (loopy > styler7l & loopy < styler7u) {
		
			for (d = boxer * (loopy - 2) / 10; d < boxer * (loopy - 1) / 10; d++) {
			if (somerot2 == 1) {
				if (gowild == 1) {
					yo2 = yo2 + yo3;
					//yo=random()*3.14;
					yo = yo2;
				}
				if (gowild == 2) {
					yo = random() * 0.3 - 0.15;
				}
				pg.rotate(yo);
				myrot = myrot + yo;
			}
			if (somerot2 == 2) {
				yo = random() * PI - PI / 2;
				pg.rotate(yo);
				myrot = myrot + yo;

			}
				c1 = random() * 180 + 75;
			c2 = random() * 180 + 75;
			c3 = random() * 180 + 75;

			if (mycl == 6) {
				c1 = random() * 100 + 100;
				c2 = random() * 180 + 75;
				c3 = random() * 180 + 75;
			}
			if (mycl == 4) {
				c1 = random() * 100 + 100;
				c2 = random() * 100 + 50;
				c3 = random() * 100 + 50;
			}
			if (mycl == 5) {
				c1 = random() * 100 + 100;
				c2 = random() * 100 + 100;
				c3 = random() * 100 + 24;
			}
			if (mycl == 7) {
				c1 = random() * 100 + 24;
				c2 = random() * 100 + 100;
				c3 = random() * 100 + 60;
			}
			if (mycl == 8) {
				c1 = random() * 100 + 60;
				c2= random() * 100 + 80;
				c3 = random() * 100 + 100;
			}

			if (mycl == 4) {
				c1a = c1 * 1.3;
				c2a = c2 / 1.7;
				c3a = c3 / 1.5;
			}
			if (mycl == 5) {
				c1a = c1 + c2 / 2.5;
				c2a = c2 / 1.5 + c1d / 4;
				c3a = c3 / 3;
			}
			if (mycl == 6) {
				c1a = c1;
				c2a = c1;
				c3a = c1;
			}
			if (mycl == 7) {
				c1a = c1 / 1.2;
				c2a = c2 * 1.3;
				c3a= c3 / 2;
			}
			if (mycl == 8) {
				c1a = c1 / 1.5;
				c2a = c2 / 2.2;
				c3a = c3 * 2;
			}

	c=color(c1a,c2a, c3a);
			
			
			
			if (mybo == 2) {
				c5 = color(32, 32, 32,192);
			}
			if (mybo == 3) {
				c5 = color((224+c1)/2, (224+c2)/2, (224+c3)/2,192);
			}
			if (mybo == 0) {
				c5 = color(c1 - 64, c2 - 64, c3 - 64,192);
			}
			if (mybo == 1) {
				c5 = color(c1 + 64, c2 + 64, c3 + 64,192);
			}

			if (rore == 0) {
				bbx = random() * backbx * 0.5 + 10;
				bby = random() * backby * 0.9 + 100;
			} else {
				if (eelsize == 1 || boxer < 400 || somerot2 != 2) {
					bbx = random() * backbx * 0.4 + 20;
					bby = random() * backby * 0.7 + 120;
				} else {
					bbx = random() * backbx * 0.1 + 20;
					bby = random() * backby * 0.3 + 50;

				}
			}

starx=0;
stary=0;
			if (somerot2 == 2) {
				ss = bbx * bby / 50;
				
				if (myaspect == 1) {


					starx = random() * -myox / 1.3 - ss - (spy + spx) * 25 * cgap;
				} else {
					starx = random() * -myox / 1.2 - ss - (spy + spx) * 25 *cgap;

				}
				stary = 0;
				if (backbx > backby) {
					stary = stary + random() * 600 - 300;
				}
			}

			if (somerot2 < 2) {
				starx = 0;
				stary = 0;
				loop25 = 0;
				while ((((starx * starx / (spx * 2.5)) + ((stary + 150) * (stary + 150) / (spy * 2.5))) < (minner *10000)) & loop25 < 150) {
					loop25 = loop25 + 1;
					starx = random() * myox / (1.7-loop25*0.01);
					if (yoyo9 > 3) {
						if (yoyo9 == 5) {
							stary = (d / boxer) * myoy * 1.4 - myoy * 1.4 / 2 - random() * 200 + 100;

						} else {
							stary = (d / boxer) * myoy * 1.4 - myoy * 1.4 / 2 - random() * 200 + 100;
						}

					} else {
						stary = (d / boxer) * myoy * 1.4 - myoy * 1.4 / 2 - random() * 200 + 100;
					}
					if (random() > 0.5) {
						starx = -starx;
					}
				}

			}
			if (random()>0.95){
						drawws2(starx,stary-2400 , c1a-32, c2a-32,c3a-32);
			}
			pg.fill(c5);
			pg.strokeWeight(1);

			if (rore == 1) {

				pg.ellipse(starx - 9, stary - 3, bbx, bby);

				pg.fill(c);
				pg.strokeWeight(1);

				c1a = c1a * 1.2;
				c2a = c2a * 1.2;
				c3a = c3a * 1.2;

				c1b = c1a;
				c2b = c2a;
				c3b = c3a;
				for (st = 1; st < bby; st++) {


					if (mycl == 6) {
						yo6 = (8.45 - random()) * 12.5 / 100;
						c1a = c1a * yo6;
						c2a = c2a * yo6;
						c3a = c3a * yo6;
					} else {
						c1a = c1a * (8.45 - random()) * 12.5 / 100;
						c2a = c2a * (8.45 - random()) * 12.5 / 100;
						c3a = c3a * (8.45 - random()) * 12.5 / 100;
					}
					if ((bby - st) < 1) {
						c1a = c1a * 0.9;
						c2a = c2a * 0.9;
						c3a = c3a * 0.9;
					}


					if (st == 100000) {
						xnet[d] = starx;
						ynet[d] = stary - bby / 2 - 27;
						if (200 / (random() * (boxer) + 1) > 1) {
							c = color(255, 255, 255,32);
							pg.stroke(c);
							pg.strokeWeight(random() * random() * random() * 2);
							pg.line(xnet[d], ynet[d], random() * 400 - 200, random() * 400 - 200);
							pg.strokeWeight(1);
						}
					}
					c = color(c1a, c2a, c3a, random()*255);
					pg.stroke(c);
					if (st == 1 && random() > 0.75) {
						//pg.ellipse(starx, stary-20, bbx/3, bby);
						pg.strokeWeight(80);
						yo8 = 4;
						if (random() > 0.8) {
							yo8 = 8;
						}
						pg.stroke(c12);
						pg.fill(c12);
						pg.ellipse(starx, stary - bby / 2 - 27, yo8, yo8);
						pg.strokeWeight(1);
					}

					pg.stroke(c);

					pg.fill(c);
					starx = starx - Math.abs(stary*3) / mywave;
					stary = stary + random()* yoyo9*6;
					pg.ellipse(starx, stary + st / 3, bbx - (st / bby) * bbx + 3, bby - st / 2.8);
	
				}

				robby = 0;
			} else {
				pg.strokeWeight(800);
				pg.stroke(cwhite);
				pg.strokeWeight(0);

				pg.ellipse(starx - 9 - bbx / 2, stary - 3 - bby / 2, bbx, bby);

				pg.fill(c);
				pg.strokeWeight(1);

				robby = bby;


			}

			c1a = c1a * 1.4;
			c2a = c2a * 1.4;
			c3a = c3a * 1.4;
			c = color(c1a, c2a, c3a);

			for (st = 1; st < robby; st++) {
				starx = starx + random() * 4 - 2;
				stary = stary + 1;

				if (mycl == 6) {
					yo6 = (20.47 - random()) * 5 / 100;
					//yo6 = 0.995;
					c1a = c1a * yo6;
					c2a = c2a * yo6;
					c3a = c3a * yo6;
				} else {
			//		c1a = c1a * 0.995; //(20.35-random())*5/100;
			//		c2a = c2a * 0.995; //(20.35-random())*5/100;
			//		c3a = c3a * 0.995; //(20.35-random())*5/100;
			//		c1a=c1a * (8.45 - random()) * 12.5 / 100;
			//		c2a=c2a * (8.45 - random()) * 12.5 / 100;
			//		c3a=c3a * (8.45 - random()) * 12.5 / 100;
					c1a=c1a * (20.47 - random()) * 5 / 100;
					c2a=c2a * (20.47 - random()) * 5 / 100;
					c3a=c3a * (20.47 - random()) * 5 / 100;
				}

				c = color(c1a, c2a, c3a);
				pg.stroke(c);
				pg.fill(c)

				if (st == 1 && random() > 0.15) {
					//pg.ellipse(starx, stary-20, bbx/3, bby);
					pg.strokeWeight(10);
					yo8 = random() * 80;
					c9 = color(240, 240, 240);
					pg.stroke(c9);
					pg.fill(c9)

					pg.ellipse(starx, stary - bby / 2 - 27, yo8, yo8);
					pg.strokeWeight(1);
				}

				pg.stroke(c);
				if (somerot == 1) {
					pg.rotate((starx - bbx / 2) / 10000000 + (stary - bby / 2 + st) / 10000000);
					myrot = myrot + (starx - bbx / 2) / 10000000 + (stary - bby / 2 + st) / 10000000;
					pg.line(starx - bbx / 2 - 9, stary - bby / 2 + st - 3, starx + bbx / 2 - 9, stary - bby / 2 + st - 3);
				} else {
					pg.line(starx - bbx / 2, stary - bby / 2 + st, starx + bbx / 2, stary - bby / 2 + st);
				}
			}


			if (somerot2 == 1) {
				pg.rotate(-myrot);
				myrot = 0;
			}

			if (somerot == 1 && somerot2 < 2) {
				pg.rotate(-myrot);
				myrot = 0;
			}



		}
		if (somerot2 == 2) {
			//  pg.rotate(-myrot);
			myrot = 0;

		}

	}
	
	//top sunlight - not used
		if (loopy == 0) {
			
		yebo=0;
						c1 = random() * 180 + 75;
			c2 = random() * 180 + 75;
			c3 = random() * 180 + 75;

			if (mycl == 6) {
				c1 = random() * 100 + 100;
				c2 = random() * 180 + 75;
				c3 = random() * 180 + 75;
			}
			if (mycl == 4) {
				c1 = random() * 100 + 100;
				c2 = random() * 100 + 50;
				c3 = random() * 100 + 50;
			}
			if (mycl == 5) {
				c1 = random() * 100 + 100;
				c2 = random() * 100 + 100;
				c3 = random() * 100 + 24;
			}
			if (mycl == 7) {
				c1 = random() * 100 + 24;
				c2 = random() * 100 + 100;
				c3 = random() * 100 + 60;
			}
			if (mycl == 8) {
				c1 = random() * 100 + 60;
				c2 = random() * 100 + 80;
				c3 = random() * 100 + 100;
			}

			if (mycl == 0) {
				c1a = c1;
				c2a = c2;
				c3a = c3;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 1) {
				c1a = c1;
				c2a = 64;
				c3a = 64;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 2) {
				c1a = 64;
				c2a = c2;
				c3a = 64;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 3) {
				c1a = 64 + c3 / 4;
				c2a = 64 + c3 / 3;
				c3a = c3 * 1.5;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 4) {
				c1a = c1 * 1.5;
				c2a = c2 / 1.7;
				c3a = c3 / 1.5;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 5) {
				c1a = c1 + c2 / 2.5;
				c2a = c2 / 1.5 + c1 / 4;
				c3a = c3 / 3;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 6) {
				c1a = c1;
				c2a = c1;
				c3a = c1;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 7) {
				c1a = c1 / 1.2;
				c2a = c2 * 1.3;
				c3a = c3 / 2;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 8) {
				c1a = c1 / 1.5;
				c2a = c2 / 2.2;
				c3a = c3 * 2;
				c = color(c1a, c2a, c3a);
			}
			if (mycl == 9) {
				c1a = (c1 / 16) ** 2;
				c2a = (c2 / 16) ** 2;
				c3a = (c3 / 16) ** 2;
				c = color(c1a, c2a, c3a);
			}
		topsunx = random()*myox - myox/2;
		topsuny = -60 - myoy/2;
		
		for (a=1; a<500; a++) {

		ccol2=color(c1a/3,c2a/3,c3a/3,255-a/1.6);
			pg.stroke(ccol2);
			pg.fill(ccol2);
			pg.strokeWeight(3);
	//	pg.ellipse(topsunx, topsuny,a*4, a*4) 
		}
	}
	
	if (loopy == sloop) {
		yebo=0;

		pg.translate(0,0,-12*sloop)
		if (mysonar=="One") {a3=2;} else {a3=4;}
		sonarx=0;
		sonarx2=0;
		sonary=0;
		for (a2=1; a2<a3; a2++) {
			nx=0;
			while (Math.abs(nx)<900) {
			nx=random()*3000-1500;
			}

				//	ny=random()*4000-2000;
			if (somerot2==2) {
			ny=-200-random()*300;
			} else {
				ny=-200-a2*1350 -random()*250;;
			}
		//	pg.translate(0,0,200);
			for (a=1; a<300; a+=30) {
				if (mycl==6) {
				ccol2=color(c1b*0.8-a/8,c2b*0.8-a/8,c3b*0.8-a/8,90);
					
				} else {
				ccol2=color(c1b*0.8-a/8,c2b*0.8-a/8,c3b*0.8-a/8,90);
			
				}

				cwh=color(255,255,255);
			pg.strokeWeight(0);
			pg.stroke(ccol2);
			pg.fill(ccol2);
				cblack = color(32,32,32,180-a/1.2);
			pg.stroke(ccol2);
			pg.fill(ccol2);
				pg.translate(0,0,-0.5);
				
				if (somerot2==2) {
					sonarx=a*8/(a2+1);
					sonarx2=a*7.96/(a2+1);
					sonary=a*2.5/(a2+1);
				} else {
					sonarx=a*6/(a2+1);
					sonarx2=a*5.96/(a2+1);
					sonary=a*6/(a2+1);					
				}
		pg.ellipse(nx,ny,sonarx,sonary) ;
				pg.translate(0,0,-0.1);

			cblack = color(240,240,240,180-a/1.2);
			pg.stroke(cblack);
			pg.fill(cblack);
			pg.ellipse(nx+6,ny,sonarx2,sonary) ;
			

				pg.strokeWeight(500*random());
			//if (random()>0.95 && yebo<7) {
				yebo=yebo+1;
	//	pg.ellipse(random()*1200-600,random()*1200-600,10*random()+1,10*random()+1) 
		//	}
		}
		}
		
		//			pg.translate(0,0,-200);

				pg.translate(0,0,sloop*10)
			drawws(0, -100, c1b+random()*64-32, c2b+random()*64-32, c3b+random()*64-32);
		

			wsnx = random()*myox/3.5-myox/7;
			wsny = random()*myoy/8;
		if (overrotname == "Radix") {
			wsnx = 0;
			wsny = -100;
		}
	//		drawws(random()*(sp*50)-sp*25, sp*50-3000, c1b+random()*64-32, c2b+random()*64-32, c3b+random()*64-32);
			drawws(wsnx, wsny, c1b+random()*64-32, c2b+random()*64-32, c3b+random()*64-32);
			drawws(-wsnx, wsny, c1b+random()*64-32, c2b+random()*64-32, c3b+random()*64-32);

		for (sp=0;sp<120;sp++) {
		//	drawws2(random()*500-250, random()*1000-500, c1b-random()*256+128, c2b-random()*256+128, c3b-random()*256+128);
	//	drawws(0, 40, c1b, c2b, c3b);
		}
	

	}
	
	
//orginal light - not used
	if (loopy < (pp) && loopy > 15) {
		c1 = 140 + (6 * loopy - pp); //random() * (230-(pp-loopy)*4)+80;//( (loopy-10) * (42-pp));
		c2 = 140 + (6 * loopy - pp); //random() * (230-(pp-loopy)*4)+80;// ( (loopy-10) * (42-pp));
		c3 = 140 + (6 * loopy - pp); //random() * (230-(pp-loopy)*4)+80;// ((loopy-10) * (42-pp));
		if (whiteback == 1) {
			c1 = 255 - c1;
			c2 = 255 - c2;
			c3 = 255 - c3;

		}

		if (mycl == 4) {
			c = color(c1 * 1.2, c2 / 1.6, c3 / 1.4);
		}
		if (mycl == 5) {
			c = color(c1 * 0.7 + c2 / 3, c2 * 0.6 + c1 / 3, c3 / 1.7);
		}
		if (mycl == 6) {
			c = color(1.1 * c1, 1.1 * c1, 1.1 * c1);
		}
		if (mycl == 7) {
			c = color(c1 / 1.7, c2, c3 / 1.5);
			if (myback2 == 3) {
				c = color(c1 / 1.6, c2 * 1.2, c3 / 1.4);

			}
		}
		if (mycl == 8) {
			c = color(c1 / 1.5, c2 / 1.3, c3 * 1.3);
			if (myback2 == 3) {
				c = color(c1 / 1.2, c2, c3 * 1.5);

			}
		}
		if (mycl == 9) {
			c = color((c1 / 14) ** 2, (c2 / 15) ** 2, (c3 / 14) ** 2);
		}

		pg.fill(c);
		pg.stroke(c);

		pg.strokeWeight(random() * (loopy * 5));

		for (d = 1; d < 15; d++) {
			pg.ellipse(
				((random() * myox - myox / 2) * 1) / (loopy + 132) ** (random() / spx),
				((random() * myoy - myoy / 2) * 1) / (loopy + 132) ** (random() / spy),
				random() * ((pp - loopy) / 1.6) + 0.01,
				random() * ((pp - loopy) / 1.6) + 0.01
			);
			if (random() > 0.99) {
				pg.ellipse(
					((random() * myox - myox / 2) * 1) / loopy ** (random() / spx),
					((random() * myoy - myoy / 2) * 1) / loopy ** (random() / spy),
					random() * ((pp - loopy) / 2) + 5,
					random() * ((pp - loopy) / 2) + 5
				);

			}
		}
	}

	if (loopy == 11) {

		pg.reset();
	mylight(0,0,0,0,0,0);
//edger();
	}

	if (loopy > 10) {
	

		fxpreview();
		noLoop();


	}

//output
	if (loopy > -60) {
//pg3.blendMode(BLEND);
		pg3.height = myoy;
		pg3.width = myox;
		pg3.image(pg, -myox / 2, -myoy / 2);
		pg3.height = myheight;
		pg3.width = mywidth;
		if (whiteback == 1) {
		pg4.height = myoy;
		pg4.width = myox;
		pg4.image(pg, 0, 0);
			pg4.filter(INVERT);
			pg4.width = mywidth;
			pg4.height = myheight;
			image(pg4, -mywidth / 2, -myheight / 2);
		} else {

			image(pg3, -mywidth / 2, -myheight / 2);
		}

	}
}


function edger () {
	
	 edgeImg = createImage(myox, myoy);
	edgeImg.copy(pg, -myox/2, -myoy/2, myox, myoy, 0, 0, myox, myoy);
 
	  edgeImg.loadPixels();


  for (let x = 1; x < myox/20 ; x+=1) {
    for (let y = 1; y < myoy/20; y+=1) {

      let sum = 0; 

      for (kx = -1; kx <= 1; kx++) {
        for (ky = -1; ky <= 1; ky++) {
          
          let xpos = x + kx;
          let ypos = y + ky;
          let pos = (y + ky)*myox + (x + kx);

          let val = red(pg.get(xpos, ypos));

          sum += kernel[ky+1][kx+1] * val;
        }
      }
      

      edgeImg.set(x, y, color(sum, sum, sum));
    }
  }
  

  edgeImg.updatePixels();
  

	pg.image(edgeImg,-myox/2, -myoy/2);

	
	
}

function mylight(colr, colg, colb, lightx, lighty, lightsize) {
	
	img5 = createImage(myox, myoy);
	img5.copy(pg, -myox/2, -myoy/2, myox, myoy, 0, 0, myox, myoy);
 
	  img5.loadPixels();

    		xgrain=[];
				totr=0;
				totg=0;
				totb=0;
				tottot=0;

	   for (var y = 0; y < myox; y += 3) {
      for (var x = 0; x < myoy; x += 3) {
				var index = (x*myox + y ) * 4;
        var r = img5.pixels[index + 0];
        var g = img5.pixels[index + 1];
        var b = img5.pixels[index + 2];

				totr=totr+r;
				totg=totg+g;
				totb=totb+b;
				tottot=tottot+1;
				
			}
		 }

			thresher2 = (totr+totg+totb)/tottot;
	
	
	
    for (var y = 0; y < myox; y += 1) {
				pgrain = random()*random()*random()*10;
      for (var x = 0; x < myoy; x += 1) {
        //var index = (x + y * myoy) * 4;
				var index = (x*myox + y ) * 4;
        var r = img5.pixels[index + 0];
        var g = img5.pixels[index + 1];
        var b = img5.pixels[index + 2];
        var a = img5.pixels[index + 3];
				
				if (y==0) {
				xgrain[x] = random()*random()*random()*15;
					if (random()>0.8) {
						xgrain[x]=-xgrain[x];
					}
				}


				redt1=r - pgrain;
				greent1=g-pgrain;
				bluet1=b-pgrain;
			
				
				gray = 0.2989*redt1 + 0.5870*greent1 + 0.1140*bluet1;
				
				redt1 = (gray+redt1*2.5)/3.5+12;
				greent1 = (gray+greent1*2.5)/3.5+12;
				bluet1 = (gray+bluet1*2.5)/3.5+12;
				

		
				if (redt1>216) { redt1=255 }
				if (greent1>216) { greent1=255 }
				if (bluet1>216) { bluet1=255 }
				if ((redt1<6400/thresher2)  || redt1<36) { redt1=0 }
				if ((greent1<6400/thresher2)  || greent1<36) { greent1=0 }
				if ((bluet1<6400/thresher2)  || bluet1<36) { bluet1=0 }
				
				thresher = redt1+bluet1+greent1;

				
				if ((y>0 && y<40) || (y>(myox-40) &&(y<(myox-0))) || (x>0 && x<40) || (x>(myoy-40) &&(x<(myoy-0))))  {
					
		if (myframe==0 ) {
			if ((redt1+greent1+bluet1)<600) {
					redt1=240;
					greent1=230;
					bluet1=210;
		}
			
		}
		if (myframe==1 ) {
			
						redt1=240;
					greent1=230;
					bluet1=210;
			
			
		}
					

					
		
	
				}
				
				if (thresher2<300 ) {
				redt1= (redt1*300/thresher2 + redt1)/2;
				greent1= (greent1*300/thresher2 + greent1)/2;
				bluet1= (bluet1*300/thresher2 + bluet1)/2;
				}
				
					if (thresher2>300 && mycl==6 && thresher<400 && (y>40 && y<(myox-39)) && (x>40 && x<(myoy-39))) {
						redt1=redt1*300/thresher2 ;
						greent1=greent1*300/thresher2 ;
						bluet1=bluet1*300/thresher2 ;
					}
				
				redt1=redt1+random()*50-25;
				greent1=greent1+random()*50-25;
				bluet1=bluet1+random()*50-25;

				

				
		
				
        img5.pixels[index + 0] = redt1;
        img5.pixels[index + 1] = greent1;
        img5.pixels[index + 2] = bluet1;
        img5.pixels[index + 3] = a;
      }
    }

    img5.updatePixels();
	pg.blendMode(REPLACE);
	pg.image(img5,-myox/2, -myoy/2);

	
	

	
	
}

function drawws(wsx, wsy, wsr, wsg, wsb) {
	pg.translate(0,0,600);
//	pg.rotateX(-0.52);
	wmx = wsx;
	wmy = wsy;
	x1 = wmx;//wmx + random() * 800 - 400;
	y1 = wmy + random() * 100;
	x2 = wmx + random() * 800 - 400;
	y2 = wmy + random() * 800 - 500;
	x3 = wmx + random() * 800 - 400;
	y3 = wmy + random() * 800 - 500;
	x4 = wmx + random() * 800 - 400;
	y4 = wmy + random() * 800 - 500;
	x5 = wmx + random() * 800 - 400;
	y5 = wmy + random() * 800 - 500;
	x6 = wmx + random() * 800 - 400;
	y6 = wmy + random() * 800 - 500;
	wsr = wsr * 1.5;
	wsg = wsg * 1.5;
	wsb = wsb * 1.5;
	myshape = x1 + "," + y1 + " : " + x2 + "," + y2 + " : " + x3 + "," + y3 + " : " + x4 + "," + y4 + " : " + x5 + "," + y5 + " : " + x6 + "," + y6;
	//console.log(myshape);
wsr1=wsr;
wsg1=wsg;
wsb1=wsb;
	if (mycl == 6) {
		wsg = wsr;
		wsb = wsr;
	}

	pg.strokeWeight(2);
	fgx1=random()*40-10;
	fgy1=random()*20+5;
	fgx2=random()*10+fgx1;
	fgy2=random()*20+5;
	fgx3=random()*10+fgx2;
	fgy3=random()*20+5;
	fgx4=random()*40-20;
	fgy4=random()*20+30;

	for (z = 1; z < 400; z+=3) {
				//		wsr = wsr * (8.45 - random()) * 12.5 / 100;
				//		wsg = wsg * (8.45 - random()) * 12.5 / 100;
				//		wsb = wsb * (8.45 - random()) * 12.5 / 100;
						wsr = wsr * 0.99; //(20.42 - random()) * 5 / 100;
						wsg = wsg * 0.99; //(20.42 - random()) * 5 / 100;
						wsb = wsb * 0.99; //(20.42 - random()) * 5 / 100;

	//	wsr = wsr * (0.995 -random()*0.005) ;
	//	wsg = wsg * (0.995 -random()*0.005) ;
	//	wsb = wsb * (0.995 -random()*0.005) ;
		
		if (mycl == 6) {
			mybw= (wsr+wsg+wsb)/3;
		wsr = mybw;
		wsg = mybw;
		wsb = mybw;

	}
		
	
		if (wsr<32) { wsr=32; }
		if (wsg<32) { wsg=32; }
		if (wsb<32) { wsb=32; }
		if (whiteback==1) {
				if (wsr<33) { wsr=160; }
				if (wsg<33) { wsg=160; }
				if (wsb<33) { wsb=160; }
		//	wsr = wsr*1.002;
		//	wsg = wsg*1.002;
	//		wsb = wsb*1.002;
		}
		if (wsr>240) { wsr=240; }
		if (wsg>240) { wsg=240; }
		if (wsb>240) { wsb=240; }
		x1 = x1 + random() * 20-10;
		y1 = y1 + 1;
	//	x2 = x2 + random() * 10 - 5;
//		x3 = x3 + random() * 8 - 4;
//		x4 = x4 + random() * 8 - 4;
//		x5 = x5 + random() * 8 - 4;
//		x6 = x6 + random() * 8 - 4;
		miniy=y1;
		minix=x1;
		if (y2>miniy) { 
			miniy=y2;
			minix=x2;
		}
		if (y3>miniy) { 
			miniy=y3;
			minix=x3;
		}
		if (y4>miniy) { 
			miniy=y4;
			minix=x4;
		}
		if (y5>miniy) { 
			miniy=y5;
			minix=x5;
		}
		if (y6>miniy) { 
			miniy=y6;
			minix=x6;
		}
	//	y1 = y1 + random() * 8 - 4;
//		y2 = y2 + random() * 8 - 4;
//		y3 = y3 + random() * 8 - 4;
//		y4 = y4 + random() * 8 - 4;
//		y5 = y5 + random() * 8 - 4;
//		y6 = y6 + random() * 8 - 4;
		c = color(wsr, wsg, wsb, 255);

		pg.strokeWeight(6);
		//pg.noFill();
		pg.stroke(c);
		pg.beginShape();
		pg.vertex(x1, y1 + z); // first point
		pg.bezierVertex(x1, y1, x2, y2 + z, x1 + 10, y1 + z + 10);
		pg.bezierVertex(x1, y1 + 10, x3, y3 + z, x2, y2 + z);
		pg.bezierVertex(x1, y1, x3, y3 + z, x2, y2 + z);
		pg.bezierVertex(x2, y2, x4, y4 + z, x3, y3 + z);
		pg.bezierVertex(x3, y3, x5, y5 + z, x4, y4 + z);
		pg.bezierVertex(x4, y4, x6, y6 + z, x5, y5 + z);
	//	pg.bezierVertex(x5, y5, x1, y1 + z, x6, y6 + z);
		pg.endShape();
c = color(wsr*2, wsg*2, wsb*2, 128);		
		pg.fill(c);
		pg.stroke(c);
			//pg.rect(x1+random()*200-100, y1+random()*200-100,10*random(), 10*random());
		c = color(wsr, wsg, wsb, 64);
		pg.fill(c);
		pg.stroke(c);

			pg.translate(0,0,-385);
		pg.strokeWeight(15);

		if (random()>0.2){
			mysmallgassize=random()*16+4;
	pg.ellipse(x1+z*fgx1 +random()*16, y1 + z * fgy1+random()*16, mysmallgassize, mysmallgassize);
	pg.ellipse(x2+z*fgx2+random()*16, y2 + z * fgy2+random()*16, mysmallgassize, mysmallgassize);
				if (doublegas==2) {

			pg.ellipse(x3+z*fgx3+random()*16, y3 + z * fgy3+random()*16, mysmallgassize, mysmallgassize);
				}
			if (random()>0.2) {
			cs = color(wsr+60, wsg+60, wsb+60,96-random()*96);
		pg.fill(cs);
		pg.stroke(cs);
			mco=random()*16-8;
	pg.ellipse(minix+z*fgx4/1.5+sin(z)*30+ random()*20-10, miniy + z * fgy4/1.5 , z+mco, z+mco, 50);
				if (doublegas==1) {
	pg.ellipse(minix+z*(fgx4+8)/1.5+sin(z)*30+ random()*20-10, miniy + z * fgy4/1.5, z+mco, z+mco, 50);
				}
			}
	
		}
			pg.translate(0,0,385);

	}
//	pg.rotateX(0.52);
	pg.translate(0,0,-600);


}


function drawws2(wsx, wsy, wsr, wsg, wsb) {
	pg.translate(0,0,30);
	wmx = wsx;
	wmy = wsy;
	x1 = wmx;//wmx + random() * 800 - 400;
	y1 = wmy + random() * 100;
	x2 = wmx + random() * 200 - 100;
	y2 = wmy + random() * 200 - 100;
	x3 = wmx + random() * 200 - 100;
	y3 = wmy + random() * 200 - 100;
	x4 = wmx + random() * 200 - 100;
	y4 = wmy + random() * 200 - 100;
	x5 = wmx + random() * 200 - 100;
	y5 = wmy + random() * 200 - 100;
	x6 = wmx + random() * 200 - 100;
	y6 = wmy + random() * 200 - 100;
	wsr = wsr * 1.5;
	wsg = wsg * 1.5;
	wsb = wsb * 1.5;
	myshape = x1 + "," + y1 + " : " + x2 + "," + y2 + " : " + x3 + "," + y3 + " : " + x4 + "," + y4 + " : " + x5 + "," + y5 + " : " + x6 + "," + y6;
	//console.log(myshape);
wsr1=wsr;
wsg1=wsg;
wsb1=wsb;
	if (mycl == 6) {
		wsg = wsr;
		wsb = wsr;
	}

	pg.strokeWeight(2);
	fgx1=random()*10-5;
	fgy1=random()*10+5;
	fgx2=random()*10+fgx1;
	fgy2=random()*10+5;
	fgx3=random()*10+fgx2;
	fgy3=random()*10+5;
	fgx4=random()*10-5;
	fgy4=random()*10+5;

	for (z = 1; z < 160; z+=3) {
				//		wsr = wsr * (8.45 - random()) * 12.5 / 100;
				//		wsg = wsg * (8.45 - random()) * 12.5 / 100;
				//		wsb = wsb * (8.45 - random()) * 12.5 / 100;
						wsr = wsr * 0.99; //(20.42 - random()) * 5 / 100;
						wsg = wsg * 0.99; //(20.42 - random()) * 5 / 100;
						wsb = wsb * 0.99; //(20.42 - random()) * 5 / 100;

	//	wsr = wsr * (0.995 -random()*0.005) ;
	//	wsg = wsg * (0.995 -random()*0.005) ;
	//	wsb = wsb * (0.995 -random()*0.005) ;
		
		if (mycl == 6) {
			mybw= (wsr+wsg+wsb)/3;
		wsr = mybw;
		wsg = mybw;
		wsb = mybw;

	}
		
	
		if (wsr<32) { wsr=32; }
		if (wsg<32) { wsg=32; }
		if (wsb<32) { wsb=32; }
		if (whiteback==1) {
				if (wsr<33) { wsr=160; }
				if (wsg<33) { wsg=160; }
				if (wsb<33) { wsb=160; }
		//	wsr = wsr*1.002;
		//	wsg = wsg*1.002;
	//		wsb = wsb*1.002;
		}
		if (wsr>240) { wsr=240; }
		if (wsg>240) { wsg=240; }
		if (wsb>240) { wsb=240; }
		x1 = x1 + random() * 20-10;
		y1 = y1 + 1;
	//	x2 = x2 + random() * 10 - 5;
//		x3 = x3 + random() * 8 - 4;
//		x4 = x4 + random() * 8 - 4;
//		x5 = x5 + random() * 8 - 4;
//		x6 = x6 + random() * 8 - 4;
		miniy=y1;
		minix=x1;
		if (y2>miniy) { 
			miniy=y2;
			minix=x2;
		}
		if (y3>miniy) { 
			miniy=y3;
			minix=x3;
		}
		if (y4>miniy) { 
			miniy=y4;
			minix=x4;
		}
		if (y5>miniy) { 
			miniy=y5;
			minix=x5;
		}
		if (y6>miniy) { 
			miniy=y6;
			minix=x6;
		}
	//	y1 = y1 + random() * 8 - 4;
//		y2 = y2 + random() * 8 - 4;
//		y3 = y3 + random() * 8 - 4;
//		y4 = y4 + random() * 8 - 4;
//		y5 = y5 + random() * 8 - 4;
//		y6 = y6 + random() * 8 - 4;
		c = color(wsr, wsg, wsb, 64);

		pg.strokeWeight(10);
		pg.fill(c);
		pg.stroke(c);
		pg.beginShape();
		pg.vertex(x1, y1 + z); // first point
		pg.bezierVertex(x1, y1, x2, y2 + z, x1 + 10, y1 + z + 10);
		pg.bezierVertex(x1, y1 + 10, x3, y3 + z, x2, y2 + z);
		pg.bezierVertex(x1, y1, x3, y3 + z, x2, y2 + z);
		pg.bezierVertex(x2, y2, x4, y4 + z, x3, y3 + z);
		pg.bezierVertex(x3, y3, x5, y5 + z, x4, y4 + z);
		pg.bezierVertex(x4, y4, x6, y6 + z, x5, y5 + z);
	//	pg.bezierVertex(x5, y5, x1, y1 + z, x6, y6 + z);
		pg.endShape();
			pg.translate(0,0,-5);
		pg.strokeWeight(15);

		if (random()>0.2){
			mysmallgassize=1;
	pg.ellipse(x1+z*fgx1 +random()*16, y1 + z * fgy1+random()*16, mysmallgassize, mysmallgassize);
	pg.ellipse(x2+z*fgx2+random()*16, y2 + z * fgy2+random()*16, mysmallgassize, mysmallgassize);
				if (doublegas==2) {

			pg.ellipse(x3+z*fgx3+random()*16, y3 + z * fgy3+random()*16, mysmallgassize, mysmallgassize);
				}
			if (random()>0.2) {
			cs = color(wsr+60, wsg+60, wsb+60,96-random()*96);
		pg.fill(cs);
		pg.stroke(cs);
			mco=random()*16-8;
	pg.ellipse(minix+z*fgx4/1.5+sin(z)*30+ random()*20-10, miniy + z * fgy4/1.5 , (z/20+mco),(z/20+mco));
				if (doublegas==1) {
	pg.ellipse(minix+z*(fgx4+8)/1.5+sin(z)*30+ random()*20-10, miniy + z * fgy4/1.5, (z/20+mco), (z/20+mco));
				}
			}
	
		}
			pg.translate(0,0,5);

	}

	pg.translate(0,0,-30);


}


function golights() {
						lightx=myox*random() - myox/2;
					lighty=myoy*random() - myoy/2;
		for (al=1; al<50; al++) {
			
			lightx=(lightx + random()*1000 - 500);
			lighty=(lighty + random()*1000 - 500);
			if (lightx<-myox/1.6) { lightx= -myoy/1.6 + random()*200;}
				if (lighty<-myoy/1.6) {lighty= -myoy/1.6 + random()*200;}
			if (lightx>myox/1.6) { lightx= myoy/1.6 - random()*200;}
				if (lighty>myoy/1.6) {lighty= myoy/1.6 - random()*200;}
				if (styler7==3 && somerot2!=2) {	lighty=lighty-50; }
																				
			

			
				c1d = random() * 180 + 75;
			c2d = random() * 180 + 75;
			c3d = random() * 180 + 75;

			if (mycl == 6) {
				c1d = random() * 100 + 100;
				c2d = random() * 180 + 75;
				c3d = random() * 180 + 75;
			}
			if (mycl == 4) {
				c1d = random() * 100 + 50;
				c2d = random() * 100 + 50;
				c3d = random() * 100 + 50;
			}
			if (mycl == 5) {
				c1d = random() * 100 + 100;
				c2d = random() * 100 + 100;
				c3d = random() * 100 + 24;
			}
			if (mycl == 7) {
				c1d = random() * 100 + 24;
				c2d = random() * 100 + 100;
				c3d = random() * 100 + 60;
			}
			if (mycl == 8) {
				c1d = random() * 100 + 60;
				c2d= random() * 100 + 80;
				c3d = random() * 100 + 100;
			}

			if (mycl == 4) {
				c1da = c1d * 1.3;
				c2da = c2d / 1.7;
				c3da = c3d / 1.5;
			}
			if (mycl == 5) {
				c1da = c1d + c2d / 2.5;
				c2da = c2d / 1.5 + c1d / 4;
				c3da = c3d / 3;
			}
			if (mycl == 6) {
				c1da = c1d;
				c2da = c1d;
				c3da = c1d;
			}
			if (mycl == 7) {
				c1da = c1d / 1.2;
				c2da = c2d * 1.3;
				c3da= c3d / 2;
			}
			if (mycl == 8) {
				c1da = c1d / 1.5;
				c2da = c2d / 2.2;
				c3da = c3d * 2;
			}
			

					yo7 = random() * 90+10;
						pg.strokeWeight(yo7);
					yo8 = random() * 6;
			if (whiteback==1) {
					c19 = color(255-c1da*2, 255-c2da*2, 255-c3da*2);
			} else {
					c19 = color(c1da*2, c2da*2, c3da*2);
			}
					pg.stroke(c19);
					pg.fill(c19)

					pg.ellipse(lightx, lighty, yo8, yo8);
					pg.strokeWeight(1);
	}
	
}

function gobirds () {
birdno=32;
		pg.translate(0,0,400);

	if (styler7==3 && somerot2!=2) {
		birdno=50;
	}
	if (styler7 !=1  && somerot2!=2) {
		birdno=birdno+(Math.floor(random()*20));
	}
   for (p = 1; p < birdno; p++) {
      kx1 = 0;
      kx2 = 0;
      kx3 = 0;
      kx4 = 0;
      ky1 = 0;
      ky2 = 0;
      ky3 = 0;
      ky4 = 0;
      kx1 = Math.floor(random() * 100) + Math.floor(random() * 2) * 300;
      ky1 = Math.floor(random() * 100) + Math.floor(random() * 2) * 300;
      kx4 = 400 - kx1;
      ky4 = 400 - ky1;

      xdirect = kx4 - kx1;
      ydirect = ky4 - ky1;

      adirect = Math.floor((xdirect * 100) / ydirect) / 100;

      if (adirect > 0.3 && adirect < 4) {
        kx2 = (kx1 + kx4) / 2 + 30 + random() * 70;
        ky2 = (ky1 + ky4) / 2 - 30 - random() * 70;

        kx3 = (kx1 + kx4) / 2 - 30 - random() * 70;
        ky3 = (ky1 + ky4) / 2 + 30 + random() * 70;
      } else {
        kx2 = (kx1 + kx4) / 2 + 30 + random() * 70;
        ky2 = (ky1 + ky4) / 2 + 30 + random() * 70;

        kx3 = (kx1 + kx4) / 2 - 30 - random() * 70;
        ky3 = (ky1 + ky4) / 2 - 30 - random() * 70;
      }
			mymin = min(myoy, myox);
		 	if (mymin==2800) {
				mymin=2400;
			}
		 	if (myox>myoy) {
				mymin=2400;
			}
      birdx = random() * mymin*0.8 - mymin*0.4;
		 	birdabs = Math.abs(birdx);
      birdy = random() * (mymin*0.8 - birdabs) - (mymin*0.8 - birdabs)/2;
	if (styler7 !=1  && somerot2!=2) {
      birdx = random() * 1600 - 800;
      birdy = random() * myoy - myoy/2;
	}
		 
	if (styler7==3 && somerot2!=2) {
			birdy = -myoy/2 + random() * random() * myoy/1.8;
			birdx = random() * birdy * 4 - birdy*2;
	}
		 if (p<3) {
			birdy = random() * myoy - myoy*0.5;
			birdx = random() *  myox - myox*0.5;
			 
		 }
	
	

 

      c2 = color(32, 32, 32,192);
      if (random() > 0.3) {
        c2 = color(240, 240, 240,192);
      }
      if (random() > 0.9) {
        rbird = 130 + random()*110;
        gbird = 130 + random()*110;
        bbird = 130 + random()*110;
        c2 = color(rbird, gbird, bbird,192);
      }
		 
		 			birdsize= random()*random()*0.6 +0.1;

        kx1a = kx1 * birdsize + birdx;
        kx2a = kx2 * birdsize + birdx;
        kx3a = kx3 * birdsize + birdx;
        kx4a = kx4 * birdsize + birdx;
        ky1a = ky1 * birdsize + birdy;
        ky2a = ky2 * birdsize + birdy;
        ky3a = ky3 * birdsize + birdy;
        ky4a = ky4 * birdsize + birdy;
 
  				pg.strokeWeight(1);
    pg.stroke(c2);
      pg.fill(c2);
      pg.beginShape();
      pg.vertex(kx1a, ky1a); // first point
      pg.bezierVertex(kx1a, ky1a, kx3a, ky3a, kx2a, ky2a);
      pg.bezierVertex(kx2a, ky2a, kx1a, ky1a, kx3a, ky3a);
      pg.bezierVertex(kx3a, ky3a, kx1a, ky1a, kx4a, ky4a);
      pg.endShape();
    
		 for (bc=17; bc<24; bc++) {
		  birdcentx = kx4a+(kx1a-kx4a)*bc/32+ (kx3a-kx2a)/16;
		  birdcenty = ky4a+(ky1a-ky4a)*bc/32+ (ky3a-ky2a)/16;
		 pg.ellipse(birdcentx, birdcenty,32*birdsize);
		 }

	 }
	
  				pg.strokeWeight(1);
		pg.translate(0,0,-400);


}

function windowResized() {
	gg = min((windowWidth * myasraty) / myasratx, windowHeight);
	mywidth = (gg * myasratx) / myasraty;
	myheight = gg;
	if (loopy>9) {loopy=100; }
	resizeCanvas((gg * myasratx) / myasraty, gg);
	pg3.height = myoy;
	pg3.width = myox;
	pg3.image(pg, -myox / 2, -myoy / 2);
	pg3.height = myheight;
	pg3.width = mywidth;
	image(pg3, -myox / 2, -myoy / 2);
	
}

function keyTyped() {
	if (key == "s") {
		pgs = createGraphics(myox, myoy);

		pgs.image(pg, 0, 0);
		
		if (whiteback==1) {
			pgs.filter(INVERT);
		}
		saveCanvas(pgs, "Sentience", "jpg");
	}
	if (key == "f") {
		
		


	}


}

function rectwalk() {
	

	if (myback4==0) {
		xblock=32;
		yblock=32;
	}
	if (myback4==1) {
		xblock=210;
		yblock=5;
	}	
	if (myback4==2) {
		xblock=5;
		yblock=150;
	}
	if (myback4>2) {
		xblock=210;
		yblock=5;
	}
	
	for (xgo=64; xgo<(myox*2-64)-xblock; xgo+=10) {
	for (ygo=64; ygo<(myoy*2-64)-yblock; ygo+=30) {
		if (myback4>2) {
		csq2=color(255,255,255,random()*random()*20);
		} else {
		csq2=color(c1a-64,c2a-64,c3a-64,random()*random()*32);
		}
		pg.fill(csq2);
		pg.stroke(csq2);
		pg.strokeWeight(1);
		pg.rect(xgo-myox,ygo-myoy,xblock,yblock);
//	pg.rect(xgo-myox,ygo-myoy,random()*180,random()*10);
		
	}
	}
	if (somerot2!=2) {
	for (xgo=0; xgo<myox*2; xgo+=10) {
		if (mycl!=6) {
		csq=color(random()*128,random()*128,random()*128,random()*190);
		} else {
			bwb = random()*128;
			csq= color(bwb,bwb,bwb,random()*190);
		}
		pg.fill(csq);
		pg.stroke(csq);
		pg.strokeWeight(2);
		pg.rect(xgo-myox,myoy/4 +random()*4000,random()*random()*1000,4000);
		
		
	}
	}
	
}