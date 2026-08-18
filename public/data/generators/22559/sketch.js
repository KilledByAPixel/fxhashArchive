// Archiplex Bauhaus Poster
// by Andrew Strauss
// studiostrauss.com.au
// 16 December 2022


let seed = 0; 
let M

function preload()  
{  seed = int(fxrand() * 999999);
  colorMode(HSB, 360, 100, 100, 100);
 }


//Archiplex Colour Palettes

//background palette
let palettesBackground = [
  ["#1d457f", 
   "#c29d33",
   "#8C8B7B",
   "#ae2d22", 
   "#bfb6a8",
   "#038C4C",
   "#8F073F"]
];

//Colour palette
let palettesFillS = [
  ["#265aa7", 
   "#ecbf3e", 
   "#d8382a"]
];

//Dark palette
let palettesFillG = [
  ["#221f20", 
   "#e9decc"]
];

var paper;
  
//___________________________________________________

function setup() {
  
  AR = [1,34/24];
  let whMult = min(windowWidth / AR[0], windowHeight / AR[1]);
  WIDTH = whMult * AR[0];
  HEIGHT = whMult * AR[1];
  mainCanvas = createCanvas(WIDTH, HEIGHT,WEBGL);
  DIM = Math.min(WIDTH, HEIGHT);
  M = DIM / 2400;
  
  background("f1f2f2");
  createpaper();                //Paper Texture
  noStroke();  

}

function draw() { 
  
  randomSeed(seed);
  noiseSeed(seed);
  push()
  translate(-width*0.5, -height*0.5);
  scale(M)
  
//Call Palettes______________________________________
  
  let coloursBackground = random(palettesBackground);
  let coloursFillS = random(palettesFillS);
  let coloursFillG = random(palettesFillG);
    
//___________________________________________________
  
//Background
  beginShape();
    fill(random(coloursBackground));
    vertex(100,100);
    vertex(2300,100);
    vertex(2300,3300);
    vertex(100,3300);
  endShape(CLOSE);
  
//___________________________________________________
  
//Archiplex Points
  
//Static p1 // row 1 (1 points)
  let p1_1 = 1200;
  let p1_2 = 340;
  
//Dynamic p2 // row 2 (2 points)
  let p2_1 = random(300,1200);
  let p2_2 = 500;
  
  let p3_1 = random(1200,2100);
  let p3_2 = 500;
  
//Dynamic p3 // row 3 (4 points)
  let p4_1 = random(300,900);
  let p4_2 = 720;
  
  let p5_1 = random(900,1200);
  let p5_2 = 720;
  
  let p6_1 = random(1200,1500);
  let p6_2 = 720;
  
  let p7_1 = random(1500,2100);
  let p7_2 = 720;
  
//Dynamic p3 // row 3 (4 points)
  let p8_1 = random(300,900);
  let p8_2 = 1016;

  let p9_1 = random(900,1200);
  let p9_2 = 1016;
  
  let p10_1 = random(1200,1500);
  let p10_2 = 1016;
  
  let p11_1 = random(1500,2100);
  let p11_2 = 1016;
  
//Dynamic p4 // row 4 (6 points)
  let p12_1 = random(300,660);
  let p12_2 = 1300;
  
  let p13_1 = random(660,1020);
  let p13_2 = 1300;
  
  let p14_1 = random(1020,1200);
  let p14_2 = 1300;
  
  let p15_1 = random(1200,1380);
  let p15_2 = 1300;

  let p16_1 = random(1380,1740);
  let p16_2 = 1300;
  
  let p17_1 = random(1740,2100);
  let p17_2 = 1300;
  
  
  
  
//Dynamic p5// row 5 (6 points)
  let p18_1 = random(300,660);
  let p18_2 = 1700;
  
  let p19_1 = random(660,1020);
  let p19_2 = 1700;
  
  let p20_1 = random(1020,1200);
  let p20_2 = 1700;
  
  let p21_1 = random(1200,1380);
  let p21_2 = 1700;

  let p22_1 = random(1380,1740);
  let p22_2 = 1700;
  
  let p23_1 = random(1740,2100);
  let p23_2 = 1700;
  
//Dynamic p6// row 6 (6 points)
  let p24_1 = random(300,660);
  let p24_2 = 2100;
  
  let p25_1 = random(660,1020);
  let p25_2 = 2100;
  
  let p26_1 = random(1020,1200);
  let p26_2 = 2100;
  
  let p27_1 = random(1200,1380);
  let p27_2 = 2100;

  let p28_1 = random(1380,1740);
  let p28_2 = 2100;
  
  let p29_1 = random(1740,2100);
  let p29_2 = 2100;
  
//Dynamic p7 // row 7 (4 points)
  let p30_1 = random(300,900);
  let p30_2 = 2420;
  
  let p31_1 = random(660,1200);
  let p31_2 = 2420;
  
  let p32_1 = random(1200,1500);
  let p32_2 = 2420;
  
  let p33_1 = random(1500,2100);
  let p33_2 = 2420;
  
//Dynamic p8 // row 8 (4 points)
  let p34_1 = random(300,900);
  let p34_2 = 2680;
  
  let p35_1 = random(900,1200);
  let p35_2 = 2680;
  
  let p36_1 = random(1200,1500);
  let p36_2 = 2680;
  
  let p37_1 = random(1500,2100);
  let p37_2 = 2680;
  
//Dynamic p9 // row 9 (2 points)
  let p38_1 = random(300,900);
  let p38_2 = 2920;
  
  let p39_1 = random(900,2100);
  let p39_2 = 2920;
  
//Static p10 // row 10 (1 points)
  let p40_1 = 1200;
  let p40_2 = 3060;
  
//___________________________________________________
  
//Archiplex Structure
  
//Fill G
  
  fill(random(coloursFillG));
  triangle(p1_1,p1_2, p2_1,p2_2, p3_1,p3_2);  //01
  
  fill(random(coloursFillG));
  triangle(p2_1,p2_2, p4_1,p4_2, p5_1,p5_2);  //02
  
  fill(random(coloursFillG));
  triangle(p3_1,p3_2, p5_1,p5_2, p6_1,p6_2);  //04
  
  fill(random(coloursFillG));
  triangle(p5_1,p5_2, p8_1,p8_2, p9_1,p9_2);  //07
  
  fill(random(coloursFillG));
  triangle(p5_1,p5_2, p8_1,p8_2, p9_1,p9_2);  //07
  
  fill(random(coloursFillG));
  triangle(p6_1,p6_2, p9_1,p9_2, p10_1,p10_2);  //09
  
  fill(random(coloursFillG));
  triangle(p7_1,p7_2, p10_1,p10_2, p11_1,p11_2);  //11
  
  fill(random(coloursFillG));
  triangle(p9_1,p9_2, p12_1,p12_2, p13_1,p13_2);  //13
  
  fill(random(coloursFillG));
  triangle(p9_1,p9_2, p14_1,p14_2, p10_1,p10_2);  //15--
  
  fill(random(coloursFillG));
  triangle(p10_1,p10_2, p15_1,p15_2, p16_1,p16_2);  //17
  
  fill(random(coloursFillG));
  triangle(p10_1,p10_2, p17_1,p17_2, p11_1,p11_2);  //19--
  
  fill(random(coloursFillG));
  triangle(p13_1,p13_2, p18_1,p18_2, p19_1,p19_2);  //21
  
  fill(random(coloursFillG));
  triangle(p14_1,p14_2, p19_1,p19_2, p20_1,p20_2);   //23
  
  fill(random(coloursFillG));
  triangle(p15_1,p15_2, p20_1,p20_2, p21_1,p21_2);  //25
  
  fill(random(coloursFillG));
  triangle(p16_1,p16_2, p21_1,p21_2, p22_1,p22_2);  //27
  
  fill(random(coloursFillG));
  triangle(p17_1,p17_2, p22_1,p22_2, p23_1,p23_2);  //29
  
  fill(random(coloursFillG));
  triangle(p19_1,p19_2, p24_1,p24_2, p25_1,p25_2);  //31
  
  fill(random(coloursFillG));
  triangle(p20_1,p20_2, p25_1,p25_2, p26_1,p26_2);  //33
  
  fill(random(coloursFillG));
  triangle(p21_1,p21_2, p26_1,p26_2, p27_1,p27_2);  //35
  
  fill(random(coloursFillG));
  triangle(p22_1,p22_2, p27_1,p27_2, p28_1,p28_2);  //37
  
  fill(random(coloursFillG));
  triangle(p23_1,p23_2, p28_1,p28_2, p29_1,p29_2);  //39
  
  fill(random(coloursFillG));
  triangle(p24_1,p24_2, p30_1,p30_2, p31_1,p31_2);  //40
  
  fill(random(coloursFillG));
  triangle(p25_1,p25_2, p31_1,p31_2, p26_1,p26_2);  //42
  
  fill(random(coloursFillG));
  triangle(p27_1,p27_2, p31_1,p31_2, p32_1,p32_2);  //44
  
  fill(random(coloursFillG));
  triangle(p28_1,p28_2, p32_1,p32_2, p29_1,p29_2);  //46
  
  fill(random(coloursFillG));
  triangle(p31_1,p31_2, p34_1,p34_2, p35_1,p35_2);  //49
  
  fill(random(coloursFillG));
  triangle(p32_1,p32_2, p35_1,p35_2, p36_1,p36_2);  //51
  
  fill(random(coloursFillG));
  triangle(p33_1,p33_2, p36_1,p36_2, p37_1,p37_2);  //53
  
  fill(random(coloursFillG));
  triangle(p34_1,p34_2, p38_1,p38_2, p35_1,p35_2);  //54
  
  fill(random(coloursFillG));
  triangle(p36_1,p36_2, p38_1,p38_2, p39_1,p39_2);  //56
  

//Fill S
  
  fill(random(coloursFillS));
  triangle(p2_1,p2_2, p5_1,p5_2, p3_1,p3_2);  //03
  
  fill(random(coloursFillS));
  triangle(p3_1,p3_2, p6_1,p6_2, p7_1,p7_2);  //05
  
  fill(random(coloursFillS));
  triangle(p4_1,p4_2, p8_1,p8_2, p5_1,p5_2);  //06
  
  fill(random(coloursFillS));
  triangle(p5_1,p5_2, p9_1,p9_2, p6_1,p6_2);  //08
  
  fill(random(coloursFillS));
  triangle(p6_1,p6_2, p10_1,p10_2, p7_1,p7_2);  //10

  fill(random(coloursFillS));
  triangle(p8_1,p8_2, p12_1,p12_2, p9_1,p9_2);  //12
  
  fill(random(coloursFillS));
  triangle(p9_1,p9_2, p13_1,p13_2, p14_1,p14_2);  //14
  
  fill(random(coloursFillS));
  triangle(p10_1,p10_2, p14_1,p14_2, p15_1,p15_2); //16
  
  fill(random(coloursFillS));
  triangle(p10_1,p10_2, p16_1,p16_2, p17_1,p17_2);  //18

  fill(random(coloursFillS));
  triangle(p12_1,p12_2, p18_1,p18_2, p13_1,p13_2);  //20
  
  fill(random(coloursFillS));
  triangle(p13_1,p13_2, p19_1,p19_2, p14_1,p14_2);  //22
  
  fill(random(coloursFillS));
  triangle(p14_1,p14_2, p20_1,p20_2, p15_1,p15_2);  //24
  
  fill(random(coloursFillS));
  triangle(p15_1,p15_2, p21_1,p21_2, p16_1,p16_2);  //26
  
  fill(random(coloursFillS));
  triangle(p16_1,p16_2, p22_1,p22_2, p17_1,p17_2);  //28
  
  fill(random(coloursFillS));
  triangle(p18_1,p18_2, p24_1,p24_2, p19_1,p19_2);  //30
  
  fill(random(coloursFillS));
  triangle(p19_1,p19_2, p25_1,p25_2, p20_1,p20_2);  //32
  
  fill(random(coloursFillS));
  triangle(p20_1,p20_2, p26_1,p26_2, p21_1,p21_2);  //34

  fill(random(coloursFillS));
  triangle(p21_1,p21_2, p27_1,p27_2, p22_1,p22_2);  //36
  
  fill(random(coloursFillS));
  triangle(p22_1,p22_2, p28_1,p28_2, p23_1,p23_2);  //38

  fill(random(coloursFillS));
  triangle(p24_1,p24_2, p31_1,p31_2, p25_1,p25_2);  //41
  
  fill(random(coloursFillS));
  triangle(p26_1,p26_2, p31_1,p31_2, p27_1,p27_2);  //43
  
  fill(random(coloursFillS));
  triangle(p27_1,p27_2, p32_1,p32_2, p28_1,p28_2);  //45
  
  fill(random(coloursFillS));
  triangle(p29_1,p29_2, p32_1,p32_2, p33_1,p33_2);  //47
  
  fill(random(coloursFillS));
  triangle(p30_1,p30_2, p34_1,p34_2, p31_1,p31_2);  //48
  
  fill(random(coloursFillS));
  triangle(p31_1,p31_2, p35_1,p35_2, p32_1,p32_2);  //50
  
  fill(random(coloursFillS));
  triangle(p32_1,p32_2, p36_1,p36_2, p33_1,p33_2);  //52

  fill(random(coloursFillS));
  triangle(p35_1,p35_2, p38_1,p38_2, p36_1,p36_2);  //55
  
  fill(random(coloursFillS));
  triangle(p36_1,p36_2, p39_1,p39_2, p37_1,p37_2);  //57

  fill(random(coloursFillS));
  triangle(p38_1,p38_2, p40_1,p40_2, p39_1,p39_2);  //57
  
  pop()
  image(paper,-width/2,-height/2);  //Paper Texture
  
    i = 0;
  while (i != 1) 
    {
      if ((isFxpreview = true)) {fxpreview(); i = 1;}
    }
  
   noLoop();

}

function createpaper(){                            //Paper Texture
	paper = createGraphics(width, height);
    paper.noStroke();
	paper.fill(200,100);
  for (let i = 0; i < 300000; i++) {
    let x = random(paper.width);
    let y = random(paper.height);
    paper.circle(x, y, random(M,2*M));
	}
  
  
}

function keyPressed()
{  
  if (key == 's' || key == 'S')
   {
    saveCanvas('Archiplex' + seed, 'png');
   }
}