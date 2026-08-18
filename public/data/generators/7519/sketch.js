let TWOPI           = 3.141592 * 2.0;
let HALFPI          = 3.141592 * 0.5;

let roads           = [];
let spawns          = [];
let flowers         = [];

let whw;                                // window width / 2
let whh;                                // window height / 2

let scene;
let lowRes          = 800;
let hiRes           = 1600;
let img;
let imageWidth;                         // canvas width
let imageHeight;                        // canvas height
let hw;                                 // half width
let hh;                                 // half height
let minSize;                            // smaller size between windowWidth and windowHeight

                             
let maxFrameCount   = 5000;             // simulation duration in frames

let speed           = 0.55;             // growth speed
let animPer         = 0.0;              // frameCount/maxFrameCount remapped to 0.0 <-> 1.0
let mainRand;
let MAX_GEN         = 25;
let spawnIters      = [];
let lifespans       = [];
let fillFrame       = 150;
let drawIter        = 3;

let nOffsetX;                           // noise x pos offset
let nOffsetY;                           // noise y pos offset

let pd;                                 // pixel density

let c0, c1, c2, c3, bgc;                // palette colors

let bg;                                 // background canvas
let mg;                                 // midground canvas
let fg;                                 // foreground canvas
let tg;                                 // top canvas
let stripes;                            // stripes canvas
let fabric;

let frameNum        = 0;
let SAVEFRAME       = false;
let DEBUG           = false;
let PAUSE           = false;
let RESET           = false;
let HI_RES          = false;

let MONOCHROME      = false;
let FLUFFY          = false;
let VERTICAL        = false;
let MORRIS          = false;
let morrisId        = 0;
let numPetals       = 6;

function wrapTheta( theta ) {
  let t = theta;
  if( t < 0 ){
    t += TWOPI;
  } else if( t >TWOPI ) {
    t -= TWOPI;
  }
  return t;
}


function addRoad( x, y, theta, cd, cdPer, gen )
{
  let t      = wrapTheta( theta );
  let road   = new Road( x, y, t, cd, cdPer, gen );
  roads.push( road );
}

function addSpawn( x, y, theta, cd, cdPer, gen )
{
  let t      = wrapTheta( theta + HALFPI );
  let spawn  = new Spawn( x, y, t, cd, cdPer, gen );
  spawns.push( spawn );
}

function addFlower( x, y, theta, sw )
{
  let t      = wrapTheta( theta );
  let flower = new Flower( x, y, t, sw );
  flowers.push( flower );
}

function createColors()
{
  let r    = fxrand();
  let a    = createVector( 0.5, 0.5, 0.5 );
  let b    = createVector( 0.5, 0.5, 0.5 );
  let c    = createVector( 2.0, 1.0, 0.0 );
  let r0   = map( fxrand(), 0.0, 1.0, 0.0, 0.6 );
  let r1   = map( fxrand(), 0.0, 1.0, 0.3, 0.8 );
  let r2   = map( fxrand(), 0.0, 1.0, 0.2, 0.8 );
  let d    = createVector( r0, r1, r2 );
  
  let e, f, g;
  for( let i=0; i<4; i++ )
  {
    let per = float( i ) / 3.0;
    e       = c.mult( per );
    f       = e.add( d );
    f       = f.mult( TWOPI );
    f       = createVector( cos( f.x ), cos( f.y ), cos( f.z ) );
    g       = b.mult( f );
    g       = g.add( a );
    
    let newc = color( g.x * 255.0, g.y * 255.0, g.z * 255.0 );
    if( i == 0 ){
      c0    = newc;
    } else if( i == 1 ){
      c1    = newc;
    } else if( i == 2 ){
      c2    = newc;
    } else if( i == 3 ){
      c3    = newc;
    }
  }
  
  colorMode( HSB, 255 );
  c0 = color( hue( c0 ), saturation( c0 ) * 0.75, brightness( c0 ) );
  c1 = color( hue( c1 ), saturation( c1 ) * 0.75, brightness( c1 ) );
  c2 = color( hue( c2 ), saturation( c2 ) * 0.7, brightness( c2 ) );
  c3 = color( hue( c3 ), saturation( c3 ) * 0.35, brightness( c3 ) );
  colorMode( RGB, 255 );
  
  if( MORRIS ){
    if( morrisId == 0 ){
      c0 = color( 183, 38, 45 );
      c1 = color( 177, 154, 123 );
      c2 = color( 41, 60, 67 );
      c3 = color( 117, 126, 131 );
    } else if( morrisId == 1 ){
      c0 = color( 23, 21, 18 );
      c1 = color( 153, 139, 81 );
      c2 = color( 239, 163, 43 );
      c3 = color( 96, 80, 31 );
    } else if( morrisId == 2 ){
      c0 = color( 61, 54, 46 );
      c1 = color( 103, 97, 85 );
      c2 = color( 121, 114, 98 );
      c3 = color( 99, 26, 46 );
    } else if( morrisId == 3 ){
      c0 = color( 40, 48, 71 );
      c1 = color( 147, 144, 129 );
      c2 = color( 178, 98, 75 );
      c3 = color( 204, 176, 165 );
    } else if( morrisId == 4 ){
      c0 = color( 79, 75, 74 );
      c1 = color( 169, 135, 100 );
      c2 = color( 224, 202, 178 );
      c3 = color( 181, 156, 126 );
    } else if( morrisId == 5 ){
      c0 = color( 63, 19, 18 );
      c1 = color( 249, 108, 122 );
      c2 = color( 55, 115, 159 );
      c3 = color( 151, 180, 184 );
    } else if( morrisId == 6 ){
      c0 = color( 60, 45, 50 );
      c1 = color( 100, 120, 67 );
      c2 = color( 170, 155, 90 );
      c3 = color( 149, 65, 79 );
    } else if( morrisId == 7 ){
      c0 = color( 221, 206, 176 );
      c1 = color( 118, 130, 26 );
      c2 = color( 225, 195, 118 );
      c3 = color( 184, 68, 24 );
    } else if( morrisId == 8 ){
      c0 = color( 26, 41, 58 );
      c1 = color( 205, 69, 53 );
      c2 = color( 148, 152, 153 );
      c3 = color( 255, 242, 250 );
    } else if( morrisId == 9 ){ // kehinde wiley
      c0 = color( 225, 186, 115 );
      c1 = color( 226, 188, 123 );
      c2 = color( 199, 187, 22 );
      c3 = color( 15, 75, 8 );
    }
  }
  
  if( MONOCHROME ){
    c0 = color( brightness( c0 ) * 2.0 );
    //c1 = color( brightness( c1 ) * 1.25 );
    c2 = color( brightness( c2 ) * 0.5 );
    c3 = color( brightness( c3 ) );
  }
}


function readColor( x, y )
{
  let i = ( x + y * imageWidth ) * 4;
  let r = img.pixels[ i + 0 ];
  let g = img.pixels[ i + 1 ];
  let b = img.pixels[ i + 2 ];
  return color( r, g, b, 255 );
}


function writeColor( x, y, r, g, b, a )
{
  let i = ( x + y * imageWidth ) * 4;
  img.pixels[ i + 0 ] = r;
  img.pixels[ i + 1 ] = g;
  img.pixels[ i + 2 ] = b;
  img.pixels[ i + 3 ] = a;
}


function getColor( per )
{
  let p    = fract( per );
  let myc  = color( 0 );
  if( p < 0.25 ){
    myc    = lerpColor( c0, c1, map( p, 0.0, 0.25, 0.0, 1.0 ) );
  } else if( p < 0.5 ){
    myc    = lerpColor( c1, c2, map( p, 0.25, 0.5, 0.0, 1.0 ) );
  } else if( p < 0.75 ){
    myc    = lerpColor( c2, c3, map( p, 0.5, 0.75, 0.0, 1.0 ) );
  } else {
    myc    = lerpColor( c3, c0, map( p, 0.75, 1.0, 0.0, 1.0 ) );
  }
  return myc;
}






// -------------------------------------------------------------------------
// --------------------------- P R E L O A D -------------------------------
// -------------------------------------------------------------------------

function preload() {
  if( HI_RES ){
    imageWidth   = hiRes;
    imageHeight  = hiRes;   
  } else {
    imageWidth   = lowRes;
    imageHeight  = lowRes;
  }

  hw             = imageWidth / 2;   // half width
  hh             = imageHeight / 2;  // half height
  
  img            = createImage( imageWidth, imageHeight );
  bg             = createGraphics( imageWidth, imageHeight );
  mg             = createGraphics( imageWidth, imageHeight );
  fg             = createGraphics( imageWidth, imageHeight );
  tg             = createGraphics( imageWidth, imageHeight );
  stripes        = createGraphics( imageWidth, imageHeight );
  windowResized();
}

function windowResized() {
  minSize        = min( windowWidth, windowHeight );
  resizeCanvas( minSize, minSize );
  whw            = minSize/2;
  whh            = minSize/2;   
  
}

function keyTyped() {
  if( key == 's' ){
    print( "saving image" );
    SAVEFRAME = true;
  } else if( key == 'd' ){
    DEBUG  = !DEBUG;
  } else if( key == ' ' ){
    PAUSE  = !PAUSE;
  } else if( key == 'h' ){
    HI_RES = !HI_RES;
    RESET  = true;
  } else if( key == 'r' ){
    RESET  = true;
  }
}



// -------------------------------------------------------------------------
// ----------------------------- S E T U P ---------------------------------
// -------------------------------------------------------------------------

function setup()
{
  scene = createCanvas( minSize, minSize );

  background( 4 );
  noiseDetail( 5, 0.5 );
  randomSeed( fxrand() );
  noiseSeed( fxrand() );
  pixelDensity( 2 );
  
  if( fxrand() < 0.025 ){
    MONOCHROME = true;
    
    print( "Monochrome" );
  }
  
  if( fxrand() < 0.3 ){
    FLUFFY = true;
    
    print( "Fluffy" );
  }
  
  if( fxrand() < 0.15 ){
    VERTICAL = true;
    
    print( "Directional" );
  }
  
  if( fxrand() < 0.5 ){
    MORRIS = true;
    morrisId = int( map( fxrand(), 0.0, 1.0, 0, 10 )%10 );
    
    print( "Morris Palette " + morrisId );
  }
  
  numPetals  = int( map( fxrand(), 0.0, 1.0, 5, 9 ) );
  
  createColors();

  reset();
}


function reset()
{
  bgc = c0;
  if( fxrand() < 0.5 ) {
    bgc = c2;
  }
  
  bg.remove();
  mg.remove();
  fg.remove();
  tg.remove();
  stripes.remove();
  
  preload();
  
  bg.clear();
  mg.clear();
  fg.clear();
  tg.clear();
  stripes.clear();
  
  bg.background( bgc );
  drawBgTexture();
  mg.background( 0, 0, 0, 0 );
  fg.background( 0, 0, 0, 0 );
  tg.background( 0, 0, 0, 0 );
  stripes.background( 0, 0, 0, 0 );

  img              = createImage( imageWidth, imageHeight );
  
  roads            = [];
  spawns           = [];
  flowers          = [];
  
  mainRand         = fxrand();
  
  drawIter         = 1;
  if( HI_RES ) drawIter = 1;
  // noise pos offsets
  nOffsetX         = map( fxrand(), 0.0, 1.0, 250.0, 1300.0 );
  nOffsetY         = map( fxrand(), 0.0, 1.0, 250.0, 1300.0 );
  
  for( let i=0; i<MAX_GEN; i++ ){
    let s          = int( map( fxrand(), 0.0, 1.0, 3, 5 ) );
    append( spawnIters, s );
    
    let l          = int( map( fxrand(), 0.0, 1.0, 250, 600 ) );
    append( lifespans, l );
  }
  
  let xRes         = int( map( fxrand(), 0.0, 1.0, 3, 5 ) );
  let yRes         = int( map( fxrand(), 0.0, 1.0, 3, 5 ) );

  let xGap         = float( imageWidth ) / float( xRes * 2 );
  let yGap         = float( imageHeight) / float( yRes * 2 );
  let leaveVoid    = false;
  
  let count        = 0;
  let mainAngle    = map( fxrand(), 0.0, 1.0, 0, TWOPI );
  //print( "xRes = " + xRes + "   yRes = " + yRes );
  for( let y=0; y<yRes; y++ ){
    let yPos       = map( y, 0, yRes, 0.0, imageHeight ) + yGap;

    for( let x=0; x<xRes; x++ ){
      let xPos     = map( x, 0, xRes, 0.0, imageWidth ) + xGap;
      
      
      if( xRes%2==0 && yRes%2==1 ){           // xres is even, yres is odd
        if( x%2==1 ){                         // shift every other column
          yPos       -= yGap;
        }
      } else if( xRes%2==1 && yRes%2==0 ){    // xres is odd, yres is even
        if( y%2==1 ){                         // shift every other row
          xPos       -= xGap;
        }
      } else if( xRes%2==0 && yRes%2==0 ){    // xres is even, yres is even
        /*if( count%2==1 ){
          leaveVoid  = true;
        }*/
      } else {                                // xres is odd, yres is odd
        if( count%2==0 ){
          leaveVoid  = true;
        }
      }
      
      if( count%2==0 ){
        mainAngle += PI;
      }
      
      if( !leaveVoid ){
        xPos  += map( fxrand(), 0.0, 1.0, -100, 100 );
        yPos  += map( fxrand(), 0.0, 1.0, -100, 100 );
        addRoad( xPos, yPos, mainAngle, 0, 0.0, 0 );
      }
      
      leaveVoid = false;
      count ++;
    }
  }
  
  frameNum = 0;
}



// -------------------------------------------------------------------------
// ------------------------------ D R A W ----------------------------------
// -------------------------------------------------------------------------

function draw()
{
  if( !PAUSE ){
    animPer       = map( frameNum, 0, maxFrameCount, 0.0, 1.0, true );
    frameNum      ++;
    
    if( animPer > 0.001 ){
      img.loadPixels();

      if( frameNum < maxFrameCount )
      {
        for( let i=0; i<roads.length; i++ ){
          let road = roads[i];
          road.update();
        }

        for( let i=0; i<spawns.length; i++ ){
          let spawn = spawns[i];
          spawn.update();
        }
        
        for( let i=0; i<flowers.length; i++ ){
          let flower = flowers[i];
          flower.update();
        }
        
        for( let i=0; i<roads.length; i++ ){
          roads[i].render();
        }
      }

      img.updatePixels();

      fg.noStroke();
      mg.noStroke();
      tg.noStroke();
      for( let i=0; i<roads.length; i++ ){
        roads[i].drawCircle( fg );
      }
      
      for( let i=0; i<flowers.length; i++ ){
        flowers[i].draw();
      }
    }

    cleanUp();
  }
  
  if( DEBUG ){
    image( img, whw - minSize/2, whh - minSize/2, minSize, minSize );
  } else {
    drawImageGrid( bg, 1, 1 );
    drawImageGrid( mg, 2, 2 );
    drawImageGrid( fg, 2, 2 );
    drawImageGrid( tg, 2, 2 );
    drawImageGrid( stripes, 2, 2 );
    drawImageGrid( mg, 1, 1 );
    drawImageGrid( fg, 1, 1 );
    drawImageGrid( tg, 1, 1 );
  }
  
  if( !PAUSE ){
    if( fxrand() < 0.04 && frameNum < 2000 ){
      drawStripes();
    }
  }
  
  if( frameCount == 700 ){
    fxpreview();
  }
  
  if( SAVEFRAME ){
    save( 'wallpaper_' + frameCount + '.png' );
    SAVEFRAME = false;
  }
  
  if( RESET ){
    reset();
    RESET = false;
  }
}


function drawImageGrid( c, xr, yr )
{
  let xs = float( minSize ) / float( xr );
  let ys = float( minSize) / float( yr );
  for( let x=0; x<xr; x++ ){
    let xp       = map( x, 0, xr, 0.0, minSize );
    for( let y=0; y<yr; y++ ){
      let yp     = map( y, 0, yr, 0.0, minSize );
      image( c, xp + whw - minSize/2, yp + whh - minSize/2, xs, ys );
    }
  }
}


function drawStripes()
{
  if( this.age == this.life && fxrand() < 0.3 ){
    let r = fxrand();
    let myc = c0;
    if( r < 0.2 ){
      myc = c1;
    } else if( r < 0.4 ){
      myc = c2;
    } else if( r < 0.7 ){
      myc = c3;
    }

    let xp     = map( fxrand(), 0.0, 1.0, 30, imageWidth-30 );
    let sw     = map( fxrand(), 0.0, 1.0, 4, 15 );
    
    if( fxrand() < 0.1 ){
      sw *= 8.0;
    }
    let numDupes = 1;
    if( fxrand() < 0.2 ){
      numDupes = 2;
    }
    for( let i=0; i<numDupes; i++ ){
      stripes.stroke( 0, 0, 0, 50 );
      stripes.strokeWeight( sw + 7 );
      stripes.line( xp - 2, 0, xp - 2, imageHeight );
      
      stripes.stroke( 0, 0, 0, 100 );
      stripes.strokeWeight( sw + 4 );
      stripes.line( xp, 0, xp, imageHeight );

      stripes.stroke( myc );
      stripes.strokeWeight( sw );
      stripes.line( xp, 0, xp, imageHeight );
      
      xp += 25.0;
    }
  }
}

function drawBgTexture()
{
  let tooth = 300;
  for( let i=0; i<tooth; i++ ){
    let per = map( i, 0, tooth-1, 0.0, 1.0 );
    bg.stroke( 0, 0, 0, 13 );
    bg.strokeWeight( 4 );
    let x = per * imageWidth;
    bg.line( x, 0, x, imageHeight );
    bg.strokeWeight( 2 );
    bg.line( x, 0, x, imageHeight );
  }
}


function cleanUp()
{
  for( let i=0; i<roads.length; i++ ){  // UPDATE ROADS
    if( roads[i].isDead() ){
      roads.splice( i, 1 );
    } 
  }

  for( let i=0; i<spawns.length; i++ ){ // UPDATE SPAWNS
    if( spawns[i].isDead() ) spawns.splice( i, 1 );
  }
  
  for( let i=0; i<flowers.length; i++ ){ // UPDATE SPAWNS
    if( flowers[i].isDead() ) flowers.splice( i, 1 );
  }
}





//-------------------------------------------------------
//------------- S P A W N  P O I N T --------------------
//-------------------------------------------------------

function Spawn( x, y, theta, cd, cdPer, gen )
{
  this.x       = x;
  this.y       = y;
  this.theta   = theta;
  this.cd      = cd;
  this.cdPer   = cdPer;
  this.gen     = gen;
  
  this.age     = 0;
  this.life    = 50;
  this.dead    = false;
}

Spawn.prototype.update = function()
{
  this.age ++;
  if( this.age > this.life ) {
    addRoad( this.x, this.y, this.theta, this.cd, this.cdPer, this.gen );
    this.dead = true;
  }
}

Spawn.prototype.isDead = function()
{
  return this.dead;
}




//-------------------------------------------------------
//----------------- F L O W E R -------------------------
//-------------------------------------------------------

function Flower( x, y, theta, sw )
{
  let off        = map( sw, 10, 25, 60.0, 0.0 );
  this.restx     = x + map( fxrand(), 0.0, 1.0, -off, off );
  this.resty     = y + map( fxrand(), 0.0, 1.0, -off, off );
  this.x         = this.restx;
  this.y         = this.resty;
  this.theta     = theta;
  this.sw        = sw;
  this.radius    = sw * 0.65;
  this.radMulti  = map( fxrand(), 0.0, 1.0, 0.5, 1.0 );
  this.decay     = map( sw, 10, 25, 0.85, 0.93 );
  this.xs        = [];
  this.ys        = [];
  this.vxs       = [];
  this.vys       = [];
  this.c         = lerpColor( c1, color( 255 ), 0.5 );
  let v          = map( fxrand(), 0.0, 1.0, 0.7, 1.25 );
  
  for( let i=0; i<numPetals; i++ ){
    let per      = map( i, 0, numPetals, 0.0, 1.0 );
    let a        = this.theta + per * TWOPI;
    append( this.xs, this.x );
    append( this.ys, this.y );
    
    append( this.vxs, Math.cos( a ) * v );
    append( this.vys, Math.sin( a ) * v ); 
  }
  
  this.age       = 0;
  this.life      = map( fxrand(), 0.0, 1.0, sw, sw*2 );
  this.agePer    = 0.0;
  this.sinPer    = 0.0;
  this.dead      = false;
  
  tg.fill( 0 );
  tg.circle( this.restx, this.resty, this.life/2 );
  tg.fill( c2 );
  tg.circle( this.restx, this.resty, this.life/2-3 );
}

Flower.prototype.update = function()
{
  for( let i=0; i<numPetals; i++ ){
    this.xs[i] += this.vxs[i];
    this.ys[i] += this.vys[i];
    
    this.vxs[i] *= this.decay;
    this.vys[i] *= this.decay;
  }
  
  this.age ++;
  if( this.age > this.life ) {
    this.dead = true;
  }
  this.agePer    = float( this.age ) / float( this.life );
  this.sinPer    = Math.sin( this.agePer * PI );
}

Flower.prototype.draw = function()
{
  let s = this.sinPer * this.radMulti;
  for( let i=0; i<numPetals; i++ ){
    fg.fill( 0 );
    fg.circle( this.xs[i], this.ys[i], s * ( this.radius + 3 ) );
    fg.fill( this.c );
    fg.circle( this.xs[i], this.ys[i], s * ( this.radius + 0 ) );
    tg.fill( 0, 20 );
    tg.circle( this.xs[i], this.ys[i], s * ( this.radius + 2 ) );
    tg.fill( this.c );
    tg.circle( this.xs[i], this.ys[i], s * ( this.radius - 1 ) );
  }
}

Flower.prototype.isDead = function()
{
  return this.dead;
}







//-------------------------------------------------------
//------------------- R O A D ---------------------------
//-------------------------------------------------------

function Road( x, y, theta, cd, cdPer, gen )
{
  this.var     = pow( fxrand(), 2.0 );
  
  this.x       = x;
  this.y       = y;
  this.theta   = theta;
  this.gen     = gen;
  this.myRand  = fxrand();
    
  this.yVel    = map( mainRand, 0.0, 1.0, -0.15, 0.15 );
  this.xVel    = map( fxrand(), 0.0, 1.0, -0.15, 0.15 );
  
  if( VERTICAL ){
    let yOff   = map( fxrand(), 0.0, 1.0, 0.1, 0.2 );
    if( fxrand() < 0.5 ) yOff = -yOff;
    this.yVel  += yOff;
    this.theta = -PI * 0.15;
  }
  
  let vx       = Math.cos( this.theta ) * speed;
  let vy       = Math.sin( this.theta ) * speed;
  this.px      = x - vx;
  this.py      = y - vy;
  
  this.cdPer   = cdPer;
  this.cd      = color( fxrand() * 255.0, fxrand() * 255.0, fxrand() * 255.0 );
  this.dead    = false;
  this.age     = 0;
  this.life    = lifespans[ gen ];
  this.agePer  = this.age / float( this.life );

  let n0       = noise( this.x * 0.03 + nOffsetX, this.y * 0.03 + nOffsetY );
  let n1       = noise( this.x * 0.03 + nOffsetY, this.y * 0.03 + nOffsetX );
  this.delta   = map( n0, 0.0, 1.0, -0.03, 0.01, true );
  this.delta2  = map( n1, 0.0, 1.0, -0.0015, 0.0015, true );
  this.spawnIter = spawnIters[ gen ];

  if( this.gen == 0 ){
    this.delta  = map( mainRand, 0.0, 1.0, -0.01, -0.04 );
    this.delta2 = 0.00015;
  }
  
  if( this.gen % 2 == 1 ){
    this.delta = -this.delta;
    this.delta2 = -this.delta2;
  }
  
  this.fillThresh = map( gen, 0, 4, 50, 250 );
}

Road.prototype.update = function ()
{
  let vx       = Math.cos( this.theta ) * speed + this.xVel;
  let vy       = Math.sin( this.theta ) * speed + this.yVel;
  
  this.px      = this.x;
  this.py      = this.y;
  this.x       += vx;
  this.y       += vy;
  
  
  // CHECK FOR OVERLAP ( NEEDS WORK )
  //
  let nx       = constrain( this.x + vx * 3.0, 0, imageWidth - 1 );
  let ny       = constrain( this.y + vy * 3.0, 0, imageHeight - 1 );
  let xi       = int( nx );
  let yi       = int( ny );
  let nc0      = readColor( xi, yi );
  let nr0      = brightness( nc0 );
  if( nr0 > 20 )    // if brighter than bg color
  {
    if( nc0.toString() != this.cd.toString() )    // if color isnt my color 
    {
      this.dead = true;
    }
  }
  
  
  // CHECK FOR WHICH TYPE TO DRAW, LINES OR CURVES
  //
  let n        = 1.0;//noise( this.x * 0.025 + nOffsetY, this.y * 0.025 + nOffsetX ); // yeah, its inverted
  if( true )
  {
    let ns     = 0.025;
    let n      = noise( this.x * ns + nOffsetX, this.y * ns + nOffsetY );
    //this.theta += map( n, 0.0, 1.0, -0.02, 0.02 );
    this.theta += this.delta;
    this.delta += this.delta2;
    this.theta = wrapTheta( this.theta );
  }
  
  this.age     += 1;
  this.agePer  = this.age / float( this.life );
  this.cdPer   = fract( this.cdPer + 0.001 );
  if( this.age >= this.life ){
    this.dead = true;
  } 
  
  if( this.age % this.spawnIter == 0 && this.age > this.fillThresh && !this.dead && this.gen < MAX_GEN ) {
    if( this.gen % 2 == 1 ){
      addSpawn( this.x, this.y, this.theta, this.cd, this.cdPer, this.gen + 1 );
    } else {
      addSpawn( this.x, this.y, this.theta + PI, this.cd, this.cdPer, this.gen + 1 );
    }
  }
  
  this.wrapBorder();
};


Road.prototype.drawCircle = function( context ){
  let agePer     = map( this.age, 0, 25, 0.0, 1.0, true );
  let ageSin     = Math.sin( this.agePer * PI );
  let sw         = map( abs( this.delta ), 0.0, 0.25, 0.0, 1.0 );
  sw             = map( pow( sw, 1.35 ), 0.0, 1.0, ageSin * 5.0 + 0.5, 125.0 * agePer * ageSin, true );
  let myc        = getColor( this.cdPer + this.myRand * 0.01 + sw * 0.02 );
  let myc2       = lerpColor( myc, color( 0 ), 0.725 );
  
  if( sw > 25.0 ){
    this.dead = true;
  }
  
  if( this.dead ){
    if( sw > 13 ){
      addFlower( this.x, this.y, this.theta, sw );
    
      // needed for seamless tiling
      if( this.x < 50 ){
        addFlower( this.x + imageWidth, this.y, this.theta, sw );
      } else if( this.x > imageWidth - 50 ){
        addFlower( this.x - imageWidth, this.y, this.theta, sw );
      }

      if( this.y < 50 ){
        addFlower( this.x, this.y + imageHeight, this.theta, sw );
      } else if( this.y > imageHeight - 50 ){
        addFlower( this.x, this.y - imageHeight, this.theta, sw );
      }
    }
  }
  

  
  if( this.gen == 1 && FLUFFY ){
    sw += cos( map( this.age, 0, 10.0, 1.0, 0.0 ) ) * 5.0;
    sw = max( 2.0, sw );
  }
  
  if( this.age%drawIter == 0 && this.age > 9 ){
    this.drawCircleSet( context, this.x, this.y, sw, myc, myc2 );
    
    // needed for seamless tiling
    if( this.x < 50 ){
      this.drawCircleSet( context, this.x + imageWidth, this.y, sw, myc, myc2 );
    } else if( this.x > imageWidth - 50 ){
      this.drawCircleSet( context, this.x - imageWidth, this.y, sw, myc, myc2 );
    }

    if( this.y < 50 ){
      this.drawCircleSet( context, this.x, this.y + imageHeight, sw, myc, myc2 );
    } else if( this.y > imageHeight - 50 ){
      this.drawCircleSet( context, this.x, this.y - imageHeight, sw, myc, myc2 );
    }
  }
}

Road.prototype.drawCircleSet = function( context, x, y, sw, myc, myc2 )
{
  // black bg circle
  mg.fill( myc2 );
  mg.circle( x, y, sw + 4 );

  // dark alpha circle
  context.fill( 0, 0, 0, 25 );
  context.circle( x - sw*0.1, y + sw*0.1, sw * 1.1 );
  
  // color circle
  context.fill( red( myc ), green( myc ), blue( myc ), map( this.age, 9, 22, 0.0, 1.0 ) * 255.0 );
  context.circle( x, y, sw );
  
  if( HI_RES ){
    let speed = map( mainRand, 0.0, 1.0, 75.0, 300.0 );
    for( let i=0; i<7; i++ ){
      let a = animPer * speed + map( i, 0, 7, 0.0, TWOPI );
      let nx = x + Math.cos( a ) * sw * 0.45;
      let ny = y + Math.sin( a ) * sw * 0.45;
      context.fill( 0, 0, 0, 40 );
      context.circle( nx, ny, sw * 0.1 );

      a += 0.45;
      nx = x + Math.cos( a ) * sw * 0.45;
      ny = y + Math.sin( a ) * sw * 0.45;
      context.fill( 255, 40 );
      context.circle( nx, ny, sw * 0.1 );
    }
  }
};

Road.prototype.render = function(){
  let x      = int( this.x );
  let y      = int( this.y );
  let r      = red( this.cd );
  let g      = green( this.cd );
  let b      = blue( this.cd );
  writeColor( x, y, r, g, b, 255 );
};

Road.prototype.isDead = function()
{
  return this.dead;
};

Road.prototype.clipBorder = function()
{
  if( this.x <= 5 ) this.dead = 1;
  if( this.y <= 5 ) this.dead = 1;
  if( this.x >= imageWidth-6 ) this.dead = 1;
  if( this.y >= imageHeight-6 ) this.dead = 1;
};

Road.prototype.wrapBorder = function()
{
  if( this.x < 0 ){
    this.x += imageWidth;
    this.px += imageWidth;
  }
  if( this.x >= imageWidth ){
    this.x -= imageWidth;
    this.px -= imageWidth;
  }
  if( this.y < 0 ){
    this.y += imageHeight;
    this.py += imageHeight;
  }
  if( this.y >= imageHeight ){
    this.y -= imageHeight;
    this.py -= imageHeight;
  }
};



