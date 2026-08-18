let seed = 0; //seed Hash

function setup() {
   seed=int(fxrand() * 100000000); // FXHASH seed rand
   randomSeed(seed);

	gg = min(windowWidth, windowHeight);
	mywidth = gg;
	myheight = gg;
	createCanvas(gg, gg, WEBGL);
	scaler = 2400;
	pg = createGraphics(scaler, scaler, WEBGL);
	pg3 = createGraphics(scaler, scaler, WEBGL);
	pg2 = createGraphics(scaler, scaler);
	pixelDensity(1);

	pg.pixelDensity(1);
	pg2.pixelDensity(1);

	pg3.pixelDensity(1);
 img5 = createImage(2400, 2400);
		myxcr=random()*100+100;
		myxcg=random()*60+60;
		myxcb=random()*100+100;
		pg.colorMode(HSL,360);
	srot=random()*random() * 0.0015+0.0004;
	mytri=Math.floor(random() * 3)*2+19;
//	srot = 0.00025;
	totrot = 0;
	
	inx1l = 0;
	inx1u = 2400;
	inx2l = scaler*random()*0.8;
	inx2u = inx2l + random()*200+50;
	inx3l = scaler*random()*0.8;
	inx3u = inx3l + random()*200+50;
	iny1l = scaler*random()*0.3+1600;
	iny1u = iny1l + random()*50+20;
	iny2l = scaler*random()*0.8;
	iny2u = iny2l + random()*200+50;
	iny3l = scaler*random()*0.8;
	iny3u = iny3l + random()*200+50;

xcblack = color(32, 32, 32);
xc = color(myxcr, myxcg, myxcb);
	pg.fill(xc);	
	pg.stroke(xc);
	tx1 = 0;
			tx2=0;
			tx3= random()*100;
			ty1= random()*100;
			ty2= random()*100;
			ty3= random()*100;
	
	mytotred=0;
		mytotgreen=0;
		mytotblue=0;
		mytotgo =0; 
	//noprotect
	flyer=Math.floor(random()*4)*3+10;
	hyperframe=Math.floor(random()*4)+2;
	if (hyperframe==2) {hyperframename = "Inverse Light";}
	if (hyperframe==3 || hyperframe==4) {hyperframename = "Standard";}
	if (hyperframe==5) {hyperframename = "Light";}
	myinv=0;
	singcol=0;
	thresh=0;	

	sizback = Math.floor(random()*15)+1;
//sizback=15;
	if (sizback==1 || sizback==5 ) { 
		sizx=19;
		sizy=19;
	srot=srot/2;
			flyer=flyer*3;
				
		
	sizbackname="Deconstruction";	
	}
	if (sizback==2)  { 
		sizback=8;
	}
	if (sizback==3)  { 
		sizback=13;
	}
	if (sizback==4 || sizback==6)  { 
		sizx=10;
		sizy=10;
		
		srot=srot+0.002;
	sizbackname="Heavy rotation";	
	}

	if (sizback==7 || sizback==8 || sizback==13) { 
		sizx=8;
		sizy=12;
			if (flyer<18) {
	flyer=18;
		}
		sizbackname="Large Panel Structure";
	}
	if (sizback==9 || sizback==10 || sizback==11 ) { 
		sizx=8;
		sizy=16;
		if (flyer<20) {
	flyer=20;
		}
		sizbackname="Standard Panel Structure";
	}
	if (sizback==12) { 
		sizx=16;
		sizy=16;

		flyer=flyer+20;
		
		
		sizbackname="Small Panel Structure";
	}
	if (sizback==14) { 
		sizx=2048;
		sizy=128;
		srot=srot/10;
		sizbackname="Space Low Rotation";
	}
	if (sizback==15) { 
		sizx=256;
		sizy=256;
		sizbackname="Classic Space";
	}
	
	if (random()>0.7) {
	
			if (sizback<4 || sizback>5) {
				if (random()>0.5) {
					thresh=1;
					myinv=2;
				} 
				if (random()>0.6) {
					singcol=1;
					myinv=2;
				}

			}
		
	
	}
	//	singcol=1;
	//thresh=1;
	//	myinv=2;
	if (random()>0.9 && myinv==0) {
		myinv=1;
		
	}
youframe=0;
	if (random()>0.9) {
		youframe=1;
	}

		if (sizback==14 && hyperframe==2) {hyperframe=3;} 

	sizbacktype = Math.floor(random()*2);
	if (sizback<6 && sizback!=4) {sizbacktype=0;}
	if (thresh==1) {sizbacktype=0;}
	stroker = Math.floor(random()*3);
	if (sizbacktype==0) {
		stroker = stroker + Math.floor(random()*2);
	}
	stroker = (stroker*stroker +2)/2;
	
	if (stroker==9) {
		stroker=4;
	}
		if ((sizback==4 || sizback==6) && stroker>3) { 
				stroker=2;
				
				}

	if (sizback>3 && sizback<9 && stroker<2) { stroker=stroker+1; }
	if (sizback==12) {
		stroker=stroker/2;
	}
	stroker=stroker/2;
	if (thresh==1) {stroker=stroker+1;}
	redvar = Math.floor(random()*3) +2;
	greenvar = Math.floor(random()*3) +2;
	bluevar = Math.floor(random()*3) +2;
	
	for (a=0; a<scaler; a++) {
	for (b=0; b<flyer; b++) {
			myxcr=myxcr+random()*redvar-redvar/2;
		if (myxcr<28) {myxcr=56;};
		if (myxcr>285) {			
			if (random()>0.5) {
				myxcr=255-random()*128;
			} else {
			
myxcr=255;
			}
		}
				
		myxcg=myxcg+random()*greenvar-greenvar/2;
		if (myxcg<28) {myxcg=56;};
		if (myxcg>285) {
			
			if (random()>0.5) {
				myxcg=255-random()*128;
			} else {
			myxcg=255;
			}
		};

		myxcb=myxcb+random()*bluevar-bluevar/2;
		if (myxcb<28) {myxcb=56;};
		if (myxcb>285) {
			if (random()>0.5) {
				myxcb=255-random()*128;
			} else {
			
myxcb=255;
			}
		}
		xc = color(myxcr, myxcg, myxcb);

	pg.fill(xc);
		xc2 = color(myxcr-random()*128+64, myxcg-random()*128+64, myxcb-random()*128+64);
	//	xc2 = color(240, 235, 210);
	pg.stroke(xc2);
	pg.strokeWeight(random()*stroker);


		if (sizbacktype==0) {
			pg.rect(a*1.4-scaler*0.7, scaler*random()*1.4 - scaler*0.7, random()*random()*scaler/sizx, random()*random()*scaler/sizy);
		} else {
			pg.ellipse(a*1.4-scaler*0.7, scaler*random()*1.4 - scaler*0.7, random()*random()*scaler/sizx, random()*random()*scaler/sizy);
		}

		
		pg.rotate(srot*b/flyer);
		totrot=totrot+srot*b/flyer;
		
		mytotred=mytotred+myxcr;
		mytotgreen=mytotgreen+myxcg;
		mytotblue=mytotblue+myxcb;
		mytotgo =mytotgo+1; 
		//pg.translate(random()*4-2,random()*4-2);
	}
	}
	extrot = (Math.floor(totrot/(2*PI))+1) * 2*PI;
	extrot2 = extrot-totrot;
	pg.rotate(extrot2 + PI/2);

		if (sizbacktype==0) {
			sbtn="Rectangular";
		} else {
			sbtn="Curved";
		}

	cavg=color(mytotred/mytotgo,mytotgreen/mytotgo,mytotblue/mytotgo);
gox = random()*0.001+0.001;
	if (random()>0.5) {
		gox=-gox;
	}
goy = 0.002;
	if (random()>0.5) {
		goy=-goy;
	}
goz  =random()*0.001+0.001;
	if (random()>0.5) {
		goz=-goz;
	}
gorot =random()*0.001+0.001;
		if (random()>0.5) {
		gorot=-gorot;
	}

	loopy=-10;
	harley=0;
	lecx=Math.floor(random()*200)-100;
	lecy=Math.floor(random()*200)-100;
	if (myinv==0) { myinvname="Standard"; }
	if (myinv==1) { myinvname="Inverse"; }
	if (myinv==2) { myinvname="Stylized"; }
	if (youframe==0) { youframename="Standard"; }
	if (youframe==1) { youframename="Square"; }
	
	
	if (sizback>13 && mytri==23) {mytri=21;}
	
	srot2 = Math.floor(srot*10000);
	//console.log ("Type: " + myinvname + " Back style: " + sizbackname + " Panel Style: " + sbtn + " Threshold: " + thresh + " Washed: " + singcol + " Red Variance: " + redvar + " Green Variance: " + greenvar + " Blue Variance: " + bluevar  , "Rotation: " + srot2 +  " Crystal Power : " + mytri + " Stroke Power: " + stroker + " Panel Density: " +  flyer + " Frame Style: " + hyperframename + " Frame Type: " + youframename );
 	
	window.$fxhashFeatures = {
		"Type": myinvname,
		"Threshold": thresh,
		"Washed": singcol,
		"Back Style": sizbackname,
		"Panel Density": flyer,
		"Panel Style": sbtn,
		"Rotation": srot2,
		"Rvar": redvar,
		"Gvar": greenvar,
		"Bvar": bluevar,
		"Crystal Power": mytri,
		"Stroke Power": stroker,
		"Frame Type": youframename,
		"Frame Style":	hyperframename,			
	};

	
}

function draw() {
	pg.strokeWeight(1);
	loopy=loopy+1
	myxcr1=myxcr;
	myxcg1=myxcg;
	myxcb1=myxcb;
			myxo1 = scaler +400;
		myxo4 = -scaler -400;
		myxo3 = random()*scaler -scaler/2;
		myxo2 = random()*scaler -scaler/2;
		myyo1 = random()*scaler -scaler/2;
		myyo2 = random()*scaler -scaler/2;
		myyo3 = random()*scaler -scaler/2;
		myyo4 = random()*scaler -scaler/2;
			myxo1a = scaler +400;
		myxo4a = -scaler -400;
		myxo3a = random()*scaler -scaler/2;
		myxo2a = random()*scaler -scaler/2;
		myyo1a = random()*scaler -scaler/2;
		myyo2a = random()*scaler -scaler/2;
		myyo3a = random()*scaler -scaler/2;
		myyo4a = random()*scaler -scaler/2;
			myxo1b = random()*scaler -scaler/2;
		myxo4b = random()*scaler -scaler/2;
		myxo3b = random()*scaler -scaler/2;
		myxo2b = random()*scaler -scaler/2;
		myyo1b = scaler +400;
		myyo4b = -scaler -400;
		myyo3b = random()*scaler -scaler/2;
		myyo2b = random()*scaler -scaler/2;
	if (loopy ==1 ) {
		

		myxcr=32;
		myxcg=32;
		myxcb=32;
			for (a=0; a<500;a++) {
		if (random()>0.995 && a>150) {
						myxo1 = scaler +random()*200+300;
		myxo4 = -scaler -random()*200-300;
		myxo3 = random()*scaler -scaler/2;
		myxo2 = random()*scaler -scaler/2;
		myyo1 = random()*scaler -scaler/2;
		myyo2 = random()*scaler -scaler/2;
		myyo3 = random()*scaler -scaler/2;
		myyo4 = random()*scaler -scaler/2;
			myxo1a = scaler +random()*200+300;
		myxo4a = -scaler -random()*200-300;
		myxo3a = random()*scaler -scaler/2;
		myxo2a = random()*scaler -scaler/2;
		myyo1a = random()*scaler -scaler/2;
		myyo2a = random()*scaler -scaler/2;
		myyo3a = random()*scaler -scaler/2;
		myyo4a = random()*scaler -scaler/2;
			myxo1b = random()*scaler -scaler/2;
		myxo4b = random()*scaler -scaler/2;
		myxo3b = random()*scaler -scaler/2;
		myxo2b = random()*scaler -scaler/2;
		myyo1b = scaler  +random()*200+300;
		myyo4b = -scaler -random()*200-300;
		myyo3b = random()*scaler -scaler/2;
		myyo2b = random()*scaler -scaler/2;
			if (random()>0.9) {
				myxcr=0;
				myxcg=0;
				myxcb=0;			
			} else {
				myxcr=mytotred/mytotgo -32;
				myxcg=mytotgreen/mytotgo-32;
				myxcb=mytotblue/mytotgo-32;			
				
			}
		}
				myxcr=myxcr+random()*2.6-1.15;
		if (myxcr<0) {myxcr=0;};
		if (myxcr>255) {myxcr=255;};
		myxcg=myxcg+random()*2.6-1.15;
		if (myxcg<0) {myxcg=0;};
		if (myxcg>255) {myxcg=255;};
		myxcb=myxcb+random()*2.6-1.15;
		if (myxcb<0) {myxcb=0;};
		if (myxcb>255) {myxcb=255;};
				c= color(myxcr,myxcg,myxcb,255);
		pg.stroke(c);
		myxo1=myxo1+random()*10;
		myxo4=myxo4+random()*10;
		myxo1a=myxo1+random()*10;
		myxo4a=myxo4+random()*10;
		myyo1b=myxo1+random()*10;
		myyo4b=myxo4+random()*10;
		pg.strokeWeight(1);
		pg.noFill();
		pg.bezier(myxo1,myyo1,myxo2,myyo2,myxo3,myyo3,myxo4,myyo4);
		pg.bezier(myxo1a,myyo1a,myxo2a,myyo2a,myxo3a,myyo3a,myxo4a,myyo4a);
		
			}
		
	}
	
	if (loopy==4) {
			myxcr=myxcr1;
	myxcg=myxcg1;
	myxcb=myxcb1;
	pg.strokeWeight(0.2);
		//	pg.rotateY(0.01);
		avgmoonsize=140+Math.floor(random()*140);
		gx=random()*0.02+0.01;
		gx2=random()*1400+700;
		gx3=random()*3000+2000;
			pg.rotate(random()*PI*2);
		if (sizback>13) { 
			gx2=gx2/2;
		}

		for (opi=0; opi<gx2; opi++) {
			pg.rotateX(random()*gx);
			pg.rotateY(random()*gx);
			pg.rotateZ(random()*gx);
			//pg.rotate(random()*gx);
			for (p=1;p<100;p++) {
			cavg2=color(mytotred/mytotgo+random()*60-20-opi/50,mytotgreen/mytotgo+random()*60-20-opi/50,mytotblue/mytotgo+random()*60-20-opi/50);
		cblack=color(40+random()*40,40+random()*40,40+random()*40,255);

			pg.stroke(cblack);
	pg.fill(cavg2);
				
				
		
		pg.ellipse ((myxo4a-500)/4 +random()*20-10, (myyo4a+200)/2+random()*20-10, (avgmoonsize+opi/20)*random()*(p)/100,(avgmoonsize+opi/20)*random()*(p)/100);
		}
		}
			pg.rotate(random()*PI);
			pg.rotateX(random()*PI);
			pg.rotateY(random()*PI);
	blackmoonsize=8+Math.floor(random()*10);
		myxo4a=random()*600-300;
		myyo4a=random()*600-300;
		myxo4a1=myxo4a;
		myyo4a1=myyo4a;
		bmex=0;
		pg.strokeWeight(2);
			for (opi=0; opi<gx3; opi++) {
			//pg.rotate(random()*0.01);
			pg.rotateX(random()*0.002);
			pg.rotateY(random()*0.002);
		cblack=color(mytotred/mytotgo+random()*60-60,mytotgreen/mytotgo+random()*60-60,mytotblue/mytotgo+random()*60-60);
				if (sizback>13) {
					c23=color(176+random()*60-50,170+random()*60-50,130+random()*60-50); } else {
		c23=color(30+random()*60-30,30+random()*60-30,30+random()*30);
					}
	pg.stroke(c23);
	pg.fill(c23);
myxo4a=myxo4a+1;
				myyo4a=myyo4a+1;
				bmex =bmex+ 0.3;
				if (random()>0.998) {
					myxo4a=myxo4a;
					myyo4a=myyo4a;
					bmex=0;
				}

	//	pg.ellipse (myxo4a, myyo4a, blackmoonsize+bmex+random()*20,blackmoonsize+bmex+random()*20);
				
			}
		persy=140;
		for (i=0;i<0;i++) {
				mtr2=((14-i)*mytotred) /(14*mytotgo);
				mtg2=((14-i)*mytotgreen) /(14*mytotgo);
				mtb2=((14-i)*mytotblue) /(14*mytotgo);
				cavg2=color(mtr2,mtg2,mtb2);		
			pg.rotateX(0.1)
			pg.fill(cavg2);
			persy=persy+3;
			pg.rect (-320+i*persy, 980-i*40, 10,500);
	//		pg.rect (-320+i*persy, 880, 10,50);

			pg.rotateX(-0.1)
			
			

	}
pg.rotateY(0.2)		
		

	}
	
	
	if (loopy>15) {
	cblack=color(0,0,0);
	pg.strokeWeight(0);
	pg.stroke(cblack);
				pg.rotateY(0.2);
				pg.rotateX(0.2);
			tx1 = 0;
			tx2=0;
			tx3= random()*120;
			ty1= random()*120;
			ty2= random()*120;
			ty3= random()*120;
if (sizback<14) {
	iter1=180; } else {
		iter1=140;}
	for (a=0; a<iter1;a++) {

		myxcr=myxcr+random()*2.4-1.2;
		if (myxcr<(mytotred/mytotgo)-40) {myxcr=(mytotred/mytotgo)-40;};
		if (myxcr>(mytotred/mytotgo)+40) {myxcr=(mytotred/mytotgo)+40;};
		myxcg=myxcg+random()*2.4-1.2;
		if (myxcg<(mytotgreen/mytotgo)-40) {myxcg=(mytotgreen/mytotgo)-40;};
		if (myxcg>(mytotgreen/mytotgo)+40) {myxcg=(mytotgreen/mytotgo)+40;};
		myxcb=myxcb+random()*2.4-1.2;
		if (myxcb<(mytotblue/mytotgo)-40) {myxcb=(mytotblue/mytotgo)-40;};
		if (myxcb>(mytotblue/mytotgo)+40) {myxcb=(mytotblue/mytotgo)+40;};
		xc = color(myxcr, myxcg, myxcb);	
		if (harley==0) {
			xc = color(myxcr/4+192, myxcg/4+192, myxcb/4+192, random()*128);
			harley=1;
		} else {
			xc = color(myxcr/4, myxcg/4, myxcb/4,random()*128);		
			harley=0;
		}
	pg.fill(xc);
		
		xc2 = color(myxcr, myxcg, myxcb);
	pg.stroke(xc2);

	if (random()>0.99) {
	//pg.rect (tx1, ty1, random()*(300-loopy),random()*(300-loopy));
	}
	if (random()>0.99) {
	//pg.ellipse (tx1, ty1, random()*(300-loopy),random()*(300-loopy));
	}
	if (random()>0.01) {
		for (f=0; f<20; f++) {

		if (harley==0) {
			myxcr=myxcr+random()*1-0.2;
			if (myxcr<0) {myxcr=0;};
			if (myxcr>255) {myxcr=255;};
			myxcg=myxcg+random()*1-0.2;
			if (myxcg<0) {myxcg=0;};
			if (myxcg>255) {myxcg=255;};
			myxcb=myxcb+random()*1-0.2;
			if (myxcb<0) {myxcb=0;};
			if (myxcb>255) {myxcb=255;};
			if (random()>0.5) {
			xc = color(myxcr, myxcg, myxcb, random()*128);
			} else{
				xc = color(240, 235, 210, random()*128);
			}
			
		} else {
		myxcr=myxcr+random()*1-0.8;
			if (myxcr<0) {myxcr=0;};
			if (myxcr>255) {myxcr=255;};
			myxcg=myxcg+random()*1-0.8;
			if (myxcg<0) {myxcg=0;};
			if (myxcg>255) {myxcg=255;};
			myxcb=myxcb+random()*1-0.8;
			if (myxcb<0) {myxcb=0;};
			if (myxcb>255) {myxcb=255;};
			xc = color(myxcr/4, myxcg/4, myxcb/4,random()*128);		
			
		}
	pg.fill(xc);	
			pg.strokeWeight(0);
			pg.stroke(xc);
			jx = (tx1+tx2+tx3)/3;
			jy = (ty1+ty2+ty3)/3;
				pg.triangle ( (tx1 + jx*f)/(f+1), (ty1 + jy*f)/(f+1),tx2+random()*f,  ty2+random()*f , tx3+random()*f , ty3+random()*f );
			//pg.ellipse(tx1+random()*400-200,tx2+random()*400-200, random()*50, random()*50);
			
		}
		
		
		
	}
	txd=tx1;
	tyd=ty1;
		
	tx1=tx2;
	ty1=ty2;
	tx2=tx3;
	ty2=ty3;
	tx3 = tx3+random()*(120-loopy/10)-(60-loopy/20);
	ty3 = ty3+random()*(120-loopy/10)-(60-loopy/20);
		if (random()>0.1) {
			tx3=txd;
		} else {
			ty3=tyd;
			
		}
			
	if (Math.abs(tx3)>(scaler/2-loopy*2)) { tx3=tx3*0.9; }
	if (Math.abs(ty3)>(scaler/2-loopy*2)) { ty3=ty3*0.9; }
	if (Math.abs(tx3)<scaler/200) { tx3=tx3*1.1; }
	if (Math.abs(ty3)<scaler/200) { ty3=ty3*1.1; }
		pg.rotate(srot*2*random());
	pg.rotateX(srot*random()-srot/2+0.0001);
	pg.rotateY(srot*random()-srot/2 +0.0001);

		if (random()>0.5) {
			ttt=Math.floor(random()*4);
			for (f=1; f<ttt;f++){
				if (random()>0.1) {
			xcv = color(255-random()*55,255-random()*55,255-random()*55, random()*255);
				} else {
			xcv = color(random()*55,random()*55,random()*55, random()*255);
					
				}
				pg.strokeWeight(0);
			pg.fill(xcv);
			pg.rect(tx3+random()*200,ty3+random()*200,1*random(),1*random());
			}
		}
	}
	
	}
	
	
	if (loopy==7 || (loopy==8 && sizback<15) || (loopy==9 && sizback<14)) { 
		
		//pg.blendMode(REPLACE);
		mydirectx=0;
		mydirecty=0;
		
		myrotx = random()*0.005;
		myroty = random()*0.005;
		if (loopy==8 && sizback==14) {
	//	myrotx = random()*0.001;
	//	myroty = random()*0.001;
			
		}
		while ((Math.abs(mydirectx) + Math.abs(mydirecty))<1.2) {
		mydirectx = random()*2-1;
		mydirecty = random()*2-1;
		}
					pg.rotate(random()*PI);
			pg.rotateX(random()*PI);
			pg.rotateY(random()*PI);
	blackmoonsize=8+Math.floor(random()*10);
		myxo4a=lecx;
		myyo4a=lecy;
		myxo4a1=myxo4a;
		myyo4a1=myyo4a;
		bmex=0;
		pg.strokeWeight(2);
		gx3=random()*3000+4000;
			for (opi=0; opi<gx3; opi++) {
			//pg.rotate(random()*0.01);
			pg.rotateX(random()*myrotx);
			pg.rotateY(random()*myroty);
		cblack=color(mytotred/mytotgo+random()*60-60,mytotgreen/mytotgo+random()*60-60,mytotblue/mytotgo+random()*60-60);
				if (sizback>13) {
					c23=color(146+random()*60-50,140+random()*60-50,100+random()*60-50); } else {
		c23=color(30+random()*60-30,30+random()*60-30,30+random()*30);
					}
	pg.stroke(c23);
	pg.fill(c23);
myxo4a=myxo4a+mydirectx;
				myyo4a=myyo4a+mydirecty;
				bmex =bmex+ 0.01;
				if (random()>0.99999) {
					myxo4a=myxo4a;
					myyo4a=myyo4a;
					bmex=0;
				}

		pg.rect (myxo4a+(blackmoonsize+bmex+20)/2, myyo4a+(blackmoonsize+bmex+20)/2, blackmoonsize+bmex+random()*20,blackmoonsize+bmex+random()*20);
				
			}
		
		
	}
	
	pg3.height = scaler;
	pg3.width = scaler;
	pg3.image(pg, -scaler / 2, -scaler / 2);
	pg3.height = gg;
	pg3.width = gg;
	image(pg3, -gg / 2, -gg / 2);

	
	//pg.rotateZ(0.1);
	if (loopy==mytri+12) {

    img5.copy(pg, -1200, -1200, 2400, 2400, 0, 0, 2400, 2400);
    img5.loadPixels();

		halfway = (mytotred + mytotgreen +mytotblue)/mytotgo;
	//console.log(halfway);
		xgrain=[];
    for (var y = 0; y < 2400; y += 1) {
			
		//	ygrain = 1.02-random()*random()*random()*random()*0.2;
      for (var x = 0; x < 2400; x += 1) {
        var index = (x + y * 2400) * 4;
        var r = img5.pixels[index + 0];
        var g = img5.pixels[index + 1];
        var b = img5.pixels[index + 2];
        var a = img5.pixels[index + 3];
mehow=0;
				if (y==0) {
					xgrain[x]= 1.02-random()*random()*random()*random()*0.2;
				}
				r1=r;
				g1=g;
				
				b1=b;

		if ((r+g+b)>400) { 

				mehow=1;
			}

		hw1=450;
			//	if (sizback>13) {halfway=halfway+50;}
		if (halfway<hw1) {	
				r1=r1*450/halfway;
				g1=g1*450/halfway;
				b1=b1*450/halfway;
		} 
			
		

				if (thresh==1) {
	nosy = random()*40-20;
					r1 = r1+nosy;
					g1 = g1+nosy;
					b1 = b1+nosy;
				} else {
	nosy = random()*60-30;
					r1 = r1+nosy;
					g1 = g1+nosy;
					b1 = b1+nosy;
				}
				

				
				
				if ((r1+g1+b1)>halfway+100) {
					//r1=r1*1.5;
					//g1=g1*1.5;
					//b1=b1*1.5;

				} 
				if ((r1+g1+b1)<halfway/2) {
				
				
					//r1=r1/8;
				//	g1=g1/8;
				//	b1=b1/8;
					
				}

				
				
						if ((((x<300) || (x>2100) || (y<60) || (y>2340) ) && youframe==0) || (((x<40) || (x>2360) || (y<40) || (y>2360) ) && youframe==1))  {
					
							if (myinv==1) {
								if (sizback<14) {
									if ((r1+g1+b1)>120) {
								   r1=16;
									 g1=25;
									 b1=45;
								} else {
									r1=235;
							g1=235;
							b1=235;
									
								}
								} else {
											if ((r1+g1+b1)>500) {
								   r1=16;
									 g1=25;
									 b1=45;
								} 
									
								}							
									
								
								
								
							} else {
							
							if (sizback<14) {

						if (hyperframe==2) {
							r1=(255-r1)+190;
							g1=(255-g1)+190;
							b1=(255-b1)+190;	
						} 
							if (hyperframe==3 || hyperframe==4) {
							
								if ((r1+g1+b1)>130) {
									r1=239;
									g1=232;
									b1=210;
								}
							}
							
							if  (hyperframe==5)  {
				r1=r1+180;
									g1=g1+180;
									b1=b1+180;
								}							

								
								if (r1>239) {r1=239;}
								if (g1>232) {g1=232;}
								if (b1>210) {b1=210;}
								
						} else {
							
							if (hyperframe==2) {
								r1=(255-r1)+190;
								g1=(255-g1)+190;
								b1=(255-b1)+190;
								if (r1>239) {r1=239;}
								if (g1>232) {g1=232;}
								if (b1>210) {b1=210;}
							}
							if (hyperframe==3) {						
									if (r1+g1+b1<400) { 
										r1=239;
										g1=232;
										b1=210;
									}
							}
							if (hyperframe==4) {
									r1=239;
									g1=232;
									b1=210;			
						}
							if (hyperframe==5) {
									if (r1+g1+b1<500) { 
										r1=239;
										g1=232;
										b1=210;
									}
						}
				

						}
							
						}		
						}
				
				if (myinv==0) {
					
							 bw=(r1+g1+b1)/3;
						if (r1!=239) {
							r1=(r1*3+bw)/4;
							g1=(g1*3+bw)/4;
							b1=(b1*3+bw)/4;
						}
							
					
				}
				
					

				if (myinv==1) {
					r1=(265-r1) ;
					g1=(265-g1);
					b1=(265-b1);
					
							 bw=(r1+g1+b1)/3;
						if ( bw<200) {
			
						r1=(r1*3)/3;
						g1=(g1+bw*2)/3;
						b1=(b1*2+bw)/3;
						}
		//							if (r1<239) { r1=(Math.floor(r1+bw)/27) **2; }
		//			if ( g1<232 ) { g1=(Math.floor(g1+bw)/27) **2; }
		//			if (b1<210 && r1<239) { b1=(Math.floor(b1+bw)/27) **2;}
						 bw=(r1+g1+b1)/3;
		
				if ( bw>220 || r1>240 || g1>240 || b1>240) {
								r1=239;
							g1=232;
							b1=210;
			
					
				}
				if ( r1<70 || b1<70 || g1<70) {
								r1=32;
							g1=32;
							b1=32;
			
					
				}
					
				}

				
				
						if (myinv==2) {
							bw = (r1+g1+b1)/3;
							//bw=r1*0.299 + g1*0.587 + b1*0.0114
						//	if (r1<239) { r1=(r1+bw)/2+20; }
						//	if ( g1<232) { g1=(g1+bw)/2+20; }
						//	if (b1<210) { b1=(b1+bw)/2+20; }
						if (bw<80) {bw=20;}
						if (bw>200) {
							r1=239;
							g1=232;
							b1=210;
						
						
						} else {
							if (singcol==1) {
						if (r1!=239) { r1=(Math.floor(r1/13)) **2; }
					//	r1=(Math.floor(r1/13)) **2; 
							if ( g1<232 ) { g1=(Math.floor(g1/13)) **2; }
							if (b1<210 && r1<239) { b1=(Math.floor(b1/13)) **2;}

								
								if (r1!=239) {
								r1=(r1+r1+r1+g1+b1)/5;
								g1=(r1+g1+g1+g1+b1)/5;
								b1=(r1+g1+b1+b1+b1)/5;
								}
								
								
							} 
							
							if (singcol==2) {

						if (r1<239) { r1=(Math.floor(r1+bw)/54) **3; }
							if ( g1<232 ) { g1=(Math.floor(g1+bw)/54) **3; }
							if (b1<210 && r1<239) { b1=(Math.floor(b1+bw)/54) **3;}
								
								if (r1<239) {
								r1=(r1+r1+g1+b1)/4;
								g1=(r1+g1+g1+b1)/4;
								b1=(r1+g1+b1+b1)/4;
								}
								
								
							} 
							
							
							
							if (singcol==0) {
							if (r1<239 || r1>239) { r1=bw; }
							if ( g1<232  || g1>232) { g1=bw; }
							if (b1<210 || b1>210) { b1=bw; }
							}
							
							
						}
							
						if (thresh==1) {
							
				    if (r1<64) { 
							r1=20;
							g1=20;
							b1=20; } 
			    if (r1>64 && r1<120) { 
							r1=105;
							g1=105;
							b1=105; } 
			    if (r1>120 && r1<180) { 
							r1=160;
							g1=160;
							b1=160; } 
							
							if (r1>180) {
							r1=239;
							g1=232;
							b1=210;							}
							
						}
						}
							
						if ((((x<300) || (x>2100) || (y<60) || (y>2340) ) && youframe==0) || (((x<40) || (x>2360) || (y<40) || (y>2360) ) && youframe==1))  {
				
						} else {
							
							r1=r1*xgrain[x];
				g1=g1*xgrain[x];
				b1=b1*xgrain[x];
						}
				
				
              img5.pixels[index + 0] = r1;
              img5.pixels[index + 1] = g1;
              img5.pixels[index + 2] = b1;
			
				
				
				

        img5.pixels[index + 3] = 255;
      }
    }
    img5.updatePixels();

    pg2.blendMode(REPLACE);
    pg2.width = 2400;
    pg2.height = 2400;

    pg2.image(img5, 0, 0,2400,2400);
   // pg.image(img5, 0, 0,2400,2400);
    pg2.width = mywidth;
    pg2.height = myheight;
    image(pg2,-mywidth/2, -myheight/2);
	fxpreview();
    noLoop();
	}
	
}


function windowResized() {
	gg = min(windowWidth, windowHeight);
	mywidth = gg;
	myheight = gg;
	resizeCanvas(gg, gg);
	pg3.height = scaler;
	pg3.width = scaler;
	pg3.image(img5, -scaler / 2, -scaler / 2);
	pg3.height = myheight;
	pg3.width = mywidth;
	image(pg3, -gg/2, -gg/2);
	
	
}


function keyTyped() {
	if (key == "s") {
		pgs = createGraphics(scaler, scaler, WEBGL);
		pg2.width=2400;
		pg2.height=2400;
 pg2.image(img5, 0, 0,2400,2400);
		pgs.image(pg2, -scaler / 2, -scaler / 2);

		saveCanvas(pgs, "Continuum", "jpg");
	}
}