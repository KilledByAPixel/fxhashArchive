let TWOPI           = 3.141592 * 2.0;
let HALFPI          = 3.141592 * 0.5;

let numRoads        = 660;
let roads           = [];
let spawns          = [];

let img;
let imageWidth      = 1024;             // canvas width
let imageHeight     = 1024;             // canvas height
let hw              = imageWidth / 2;   // half width
let hh              = imageHeight / 2;  // half height
let minSize;                            // smaller size between windowWidth and windowHeight


// shape attribs
let shapeId;                            // which shape is it
let shapeRadius;                        // general size for the shapes
let shapeInvert     = 0;                // is shape upsidedown

// square attribs
let squarePos0, squarePos1, squarePos2, squarePos3;    // corners of the square

// triangle attribs
let triPos0, triPos1, triPos2;          // corners of the triangle
let triAngle;
let triYOffset;

// line attribs
let linePos0, linePos1, linePos2, linePos3;            // corners of the long rect


let typeThresh;                         // curvey or straight road growth
                             
let maxFrameCount   = 1024;             // simulation duration in frames

let speed           = 0.65;              // growth speed
let animPer         = 0.0;              // frameCount/maxFrameCount remapped to 0.0 <-> 1.0
let introAnimPer    = 0.0;              // frameCount/introAnimDur remapped to 0.0 <-> 1.0
let introAnimDur    = 15;               // duration of the intro anim
let introDotRadius  = 1.5;
let flashAnimDur    = 15;
let fillFrame       = 150;

let nOffsetX;                           // noise x pos offset
let nOffsetY;                           // noise y pos offset

let pd;                                 // pixel density

let c0, c1, c2, c3;                     // palette colors

let bg;                                 // bg canvas
let fg;                                 // fg canvas
let tg;                                 // temp canvas

function wrapTheta( theta ) {
  let t = theta;
  if( t < 0 ){
    t += TWOPI;
  } else if( t >TWOPI ) {
    t -= TWOPI;
  }
  return t;
}

function addRoad( x, y, theta, cd )
{
  let t      = wrapTheta( theta );
  let road   = new Road( x, y, t, cd );
  roads.push( road );
}

function addSpawn( x, y, theta, cd )
{
  let t      = wrapTheta( theta + HALFPI );
  let spawn  = new Spawn( x, y, t, cd );
  spawns.push( spawn );
}

function createColors()
{
  let a    = createVector( 0.5, 0.5, 0.5 );
  let b    = createVector( 0.5, 0.5, 0.5 );
  let c    = createVector( 1.0, 1.0, 1.0 );
  let r0   = fxrand() * 0.5 + 0.4;//map( fxrand(), 0.0, 1.0, 0.15, 0.3333 );
  let r1   = r0 * 0.8;//r0 * 2.0;
  let r2   = r0 * 0.5;//r0 * 3.0;
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
  
  colorMode( HSB );
  let h0 = hue( c0 );
  let s0 = lerp( saturation( c0 ), 255, 0.5 );
  let b0 = lerp( brightness( c0 ), 255, 0.5 );
  c0 = color( h0, s0, b0 );
  
  let h1 = hue( c1 );
  let s1 = lerp( saturation( c1 ), 255, 0.2 );
  let b1 = lerp( brightness( c1 ), 255, 0.3 );
  c1 = color( h1, s1, b1 );
  
  
  let h2 = hue( c2 );
  let s2 = saturation( c2 );
  let b2 = lerp( brightness( c2 ), 0, 0.15 );
  c2 = color( h2, s2, b2 );
  
  
  let h3 = hue( c3 );
  let s3 = saturation( c3 );
  let b3 = lerp( brightness( c3 ), 0, 0.6 );
  c3 = color( h3, s3, b3 );
  
  colorMode( RGB );
  
  
  let colorRarity = fxrand();
  if( colorRarity < 0.1 ){    // B&W
    c0 = color( 255 );
    c1 = color( brightness( c1 ) );
    c2 = color( brightness( c2 ) );
    c3 = color( 255 );
  } else if( colorRarity < 0.2 ){
    c0 = color( 255 );
    c1 = color( c1 );
    c2 = color( c1 );
    c3 = color( 255 );
  } else if( colorRarity < 0.22 ){
    c0 = color( 10 );
    c1 = color( 255 );
    c2 = color( 155 );
    c3 = color( 51 );
  } else if( colorRarity < 0.23 ){
    c0 = color( 255, 50, 0 );
    c1 = color( 255, 255, 0 );
    c2 = color( 0, 150, 255 );
    c3 = color( 155, 0, 255 );
  } else if( colorRarity < 0.4 ){
    c0 = color( c1 );
    c1 = color( c2 );
    c2 = color( c2 );
    c3 = color( c2 );
  } else if( colorRarity < 0.6){
    c0 = color( c0 );
    c1 = color( c1 );
    c2 = color( c1 );
    c3 = color( c1 );
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
  let myc  = color( 0 );
  if( per < 0.2 ){
    myc    = lerpColor( c0, c1, map( per, 0.0, 0.2, 0.0, 1.0 ) );
  } else if( per < 0.35 ){
    myc    = lerpColor( c1, c2, map( per, 0.2, 0.35, 0.0, 1.0 ) );
  } else if( per < 0.6 ){
    myc    = lerpColor( c2, c3, map( per, 0.35, 0.6, 0.0, 1.0 ) );
  } else {
    myc    = lerpColor( c3, color( 0 ), map( per, 0.6, 1.0, 0.0, 1.0 ) );
  }
  return myc;
}



// CIRCLE
//
function circleStart() {  
  let cd       = color( 0, 0, 255 );
  for( let i=0; i<numRoads; i++ )
  {
    let per    = float( i ) / float( numRoads - 1 );
    let angle  = per * TWOPI;
    let x      = cos( angle ) * shapeRadius;
    let y      = sin( angle ) * shapeRadius;

    addRoad( hw + x, hh + y, angle, color( 0 ), 0 );
  }
}

function circleFlash() {
  let c = getColor( animPer * 0.666 );
  
  tg.fill( c );
  tg.circle( hw, hh, shapeRadius * 2.0 );
}



// SQUARE
//
function squareStart() {
  let cd       = color( 0, 0, 255 );
  let numSide  = numRoads;
  
  for( let i=0; i<numSide; i++ )
  {
    let per    = float( i ) / float( numSide - 1 );
    let angle;
    let p      = createVector();
    if( per < 0.25 ){
      let v    = map( per, 0.0, 0.25, 0.0, 1.0 );
      p        = p5.Vector.lerp( squarePos0, squarePos1, v );
      angle    = -HALFPI;
    } else if( per < 0.5 ){
      let v    = map( per, 0.25, 0.5, 0.0, 1.0 );
      p        = p5.Vector.lerp( squarePos1, squarePos2, v );
      angle    = 0;
    } else if( per < 0.75 ){
      let v    = map( per, 0.5, 0.75, 0.0, 1.0 );
      p        = p5.Vector.lerp( squarePos2, squarePos3, v );
      angle    = HALFPI;
    } else {
      let v    = map( per, 0.75, 1.0, 0.0, 1.0 );
      p        = p5.Vector.lerp( squarePos3, squarePos0, v );
      angle    = PI;
    }
    
    addRoad( p.x, p.y, angle, cd, 0 );
  }
}

function squareFlash() {
  let c = getColor( animPer * 0.666 );
  
  tg.fill( c );
  tg.rect( squarePos0.x, squarePos0.y, squareSize * 2.0, squareSize * 2.0 );
}



// TRIANGLE
//
function triangleStart()
{
  let cd       = color( 0, 0, 255 );
  let numSide  = int( numRoads/3 );
  for( let i=0; i<numSide; i++ )
  {
    let per    = float( i ) / float( numSide - 1 );
    let x      = map( per, 0.0, 1.0, triPos0.x, triPos1.x );
    let y      = map( per, 0.0, 1.0, triPos0.y, triPos1.y );
    let a      = triAngle + triAngle * 0.25;
    if( shapeInvert == 1 ) a += PI;
    addRoad( x, y, a, cd, 0 );
  }
  
  for( let i=0; i<numSide; i++ )
  {
    let per    = float( i ) / float( numSide - 1 );
    let x      = map( per, 0.0, 1.0, triPos1.x, triPos2.x );
    let y      = map( per, 0.0, 1.0, triPos1.y, triPos2.y );
    let a      = triAngle * 2.0 + triAngle * 0.25;
    if( shapeInvert == 1 ) a += PI;
    addRoad( x, y, a, cd, 0 );
  }

  for( let i=0; i<numSide; i++ )
  {
    let per    = float( i ) / float( numSide - 1 );
    let x      = map( per, 0.0, 1.0, triPos2.x, triPos0.x );
    let y      = map( per, 0.0, 1.0, triPos2.y, triPos0.y );
    let a      = triAngle * 3.0 + triAngle * 0.25;
    if( shapeInvert == 1 ) a += PI;
    addRoad( x, y, a, cd, 0 );
  }
}

function triangleFlash() {
  let c = getColor( animPer * 0.666 );
  
  tg.fill( c );
  tg.triangle( triPos0.x, triPos0.y, triPos1.x, triPos1.y, triPos2.x, triPos2.y );
}



// LINE
//
function lineStart()
{
  let cd       = color( 0, 0, 255 );
  let numSide  = numRoads/2;
  
  for( let i=0; i<numSide; i++ )
  {
    let per    = float( i ) / float( numSide - 1 );
    let angle;
    let p0     = p5.Vector.lerp( linePos0, linePos1, per );
    addRoad( p0.x, p0.y, -HALFPI, cd, 0 );

    let p1     = p5.Vector.lerp( linePos2, linePos3, per );
    addRoad( p1.x, p1.y, HALFPI, cd, 0 );
  }
}

function lineFlash() {
  let c = getColor( animPer * 0.666 );
  
  tg.fill( c );
  tg.rect( linePos0.x, linePos0.y, linePos2.x - linePos0.x, linePos2.y - linePos0.y );
}






function edgeDetail()
{
  let cd    = color( 255, 255, 255 );
  
  let c     = getColor( animPer * 0.666 );
  
  tg.stroke( c );
  tg.strokeWeight( 0.1 );
  tg.noFill();
  tg.rect( 5, 5, imageWidth - 11, imageHeight - 11 );
}








// -------------------------------------------------------------------------
// --------------------------- P R E L O A D -------------------------------
// -------------------------------------------------------------------------

function preload()
{
  img          = createImage( imageWidth, imageHeight );
  bg           = createGraphics( imageWidth, imageHeight );
  fg           = createGraphics( imageWidth, imageHeight );
  tg           = createGraphics( imageWidth, imageHeight );
  windowResized();
}


function windowResized()
{
  resizeCanvas( windowWidth, windowHeight );
  minSize      = min( windowWidth, windowHeight );
}



// -------------------------------------------------------------------------
// ----------------------------- S E T U P ---------------------------------
// -------------------------------------------------------------------------

function setup()
{
  createCanvas( windowWidth, windowHeight );

  background( 4 );
  noiseDetail( 6, 0.5 );
  randomSeed( fxrand() );
  noiseSeed( fxrand() );

  typeThresh   = map( fxrand(), 0.0, 1.0, 0.35, 0.6 ); 
  pd           = 2;
  pixelDensity( pd );
  
  bg.background( 0, 0, 0, 0 );
  fg.background( 0, 0, 0, 0 );
  tg.background( 0, 0, 0, 0 );
  
  fg.noStroke();
  
    // noise pos offsets
  nOffsetX           = map( fxrand(), 0.0, 1.0, 50.0, 300.0 );
  nOffsetY           = map( fxrand(), 0.0, 1.0, 50.0, 300.0 );
  
  createColors();  

  // SHAPE ATTRIBS
  shapeRadius        = map( fxrand(), 0.0, 1.0, 75, 175 );
  
  // CREATE SQUARE POSITIONS
  squareSize         = shapeRadius * 0.75;
  squarePos0         = createVector( hw - squareSize, hh - squareSize );
  squarePos1         = createVector( hw + squareSize, hh - squareSize );
  squarePos2         = createVector( hw + squareSize, hh + squareSize );
  squarePos3         = createVector( hw - squareSize, hh + squareSize );
  
  // CREATE TRIANGLE POSITIONS
  triAngle           = TWOPI/3.0;
  triYOffset         = -25;
  let triOffset      = HALFPI;
  if( fxrand() < 0.5 ) {
    shapeInvert      = 1;
    triOffset        = -triOffset;
    triYOffset       = -triYOffset;
  }
  let tsr            = shapeRadius;
  let tx0            = cos( triAngle * 0.0 + triOffset ) * tsr;
  let ty0            = sin( triAngle * 0.0 + triOffset ) * tsr;
  let tx1            = cos( triAngle * 1.0 + triOffset ) * tsr;
  let ty1            = sin( triAngle * 1.0 + triOffset ) * tsr;
  let tx2            = cos( triAngle * 2.0 + triOffset ) * tsr;
  let ty2            = sin( triAngle * 2.0 + triOffset ) * tsr;
  triPos0            = createVector( hw + tx0, hh + ty0 + triYOffset );
  triPos1            = createVector( hw + tx1, hh + ty1 + triYOffset );
  triPos2            = createVector( hw + tx2, hh + ty2 + triYOffset );
  
  // CREATE LINE POSITIONS
  let lw             = shapeRadius * 2.0;
  let lh             = map( fxrand(), 0.0, 1.0, lw * 0.05, lw * 0.15 );
  linePos0           = createVector( hw - lw, hh - lh );
  linePos1           = createVector( hw + lw, hh - lh );
  linePos2           = createVector( hw + lw, hh + lh );
  linePos3           = createVector( hw - lw, hh + lh );
  
  // CREATE STARTING ROADS
  let r = fxrand();

  if( r < 0.25 ){
    shapeId    = 0;
    circleStart();
  } else if( r < 0.5 ){
    shapeId    = 1;
    squareStart();
  } else if( r < 0.55 ){
    shapeId    = 2;
    triangleStart();
  } else {
    shapeId    = 3;
    lineStart();
  }
}






// -------------------------------------------------------------------------
// ------------------------------ D R A W ----------------------------------
// -------------------------------------------------------------------------

function draw()
{
  introAnimPer  = map( frameCount, 0, introAnimDur, 0.0, 1.0, true );
  animPer       = map( frameCount, introAnimDur, maxFrameCount, 0.0, 1.0, true );
  
  background( 4 );
  tg.clear();
  
  if( animPer > 0.001 ){                    // DRAW MAIN CONTENT
    img.loadPixels();

    if( frameCount < maxFrameCount )
    {
      for( let i=0; i<roads.length; i++ ){  // UPDATE ROADS
        let road = roads[i];
        road.update();
        if( road.isDead() > 0.5 ) roads.splice( i, 1 );
      }

      for( let i=0; i<spawns.length; i++ ){ // UPDATE SPAWNS
        let spawn = spawns[i];
        spawn.update();
        if( spawn.isDead() > 0.5 ) spawns.splice( i, 1 );
      }

      for( let i=0; i<roads.length; i++ ){  // RENDER
        roads[i].render();
      }
      
      // DRAW DOTS
      tg.noStroke();
      tg.fill( 255 );
      for( let i=0; i<roads.length; i++ ){  // RENDER
        roads[i].drawDot();
      }
      
      // DRAW LINES
      bg.noStroke();
      for( let i=0; i<roads.length; i++ ){  // RENDER
        roads[i].drawLine();
      }
    }

    img.updatePixels();
  }
  
  if( shapeId == 0 ){
    circleFlash();
  } else if( shapeId == 1 ){
    squareFlash();
  } else if( shapeId == 2 ){
    triangleFlash();
  } else if( shapeId == 3 ){
    lineFlash();
  }

  edgeDetail();
  
  
  //image( img, windowWidth/2 - minSize/2, windowHeight/2 - minSize/2, minSize, minSize );
  
  image( bg, windowWidth/2 - minSize/2, windowHeight/2 - minSize/2, minSize, minSize );  
  image( fg, windowWidth/2 - minSize/2, windowHeight/2 - minSize/2, minSize, minSize );
  image( tg, windowWidth/2 - minSize/2, windowHeight/2 - minSize/2, minSize, minSize );
  
  /*
  if( frameCount == maxFrameCount ){
    saveFrames( 'out62', 'png', 1, 1 );
  }
  */
}






//-------------------------------------------------------
//------------- S P A W N  P O I N T --------------------
//-------------------------------------------------------

function Spawn( x, y, theta, cd )
{
  this.x       = x;
  this.y       = y;
  this.theta   = theta;
  this.cd      = cd;
  this.age     = 0;
  this.thresh  = 50;
  this.dead    = 0;
}

Spawn.prototype.update = function()
{
  this.age ++;
  if( this.age > this.thresh ) {
    addRoad( this.x, this.y, this.theta, this.cd );
    this.dead = 1;
  }
}

Spawn.prototype.isDead = function()
{
  return this.dead > 0.5;
}







//-------------------------------------------------------
//------------------- R O A D ---------------------------
//-------------------------------------------------------

function Road( x, y, theta, cd )
{
  this.var     = pow( fxrand(), 2.0 );
  
  this.x       = x;
  this.y       = y;
  this.theta   = theta;
  
  let vx       = cos( this.theta ) * speed;
  let vy       = sin( this.theta ) * speed;
  this.px      = x - vx;
  this.py      = y - vy;
  
  
  this.cd      = color( fxrand() * 255.0, fxrand() * 255.0, fxrand() * 255.0 );
  this.dead    = 0;
  this.age     = 0;
  this.life    = map( fxrand(), 0.0, 1.0, 100, 1000 );
  this.thresh  = 5; // map( noise( this.pos.x * 0.001, this.pos.y * 0.001 ), 0.0, 1.0, 1, 5 );
  this.maxRadius  = map( this.var, 0.0, 1.0, 0.5, 1.0 );
  
  let n0       = noise( this.x * 0.01 + nOffsetX, this.y * 0.01 + nOffsetY );
  let n1       = noise( this.x * 0.003 + nOffsetX, this.y * 0.003 + nOffsetY );
  this.delta   = map( n0, 0.0, 1.0, -0.01, 0.01 );
  this.delta2  = map( n1, 0.0, 1.0, -0.005, 0.005 );

  this.fillThresh = map( fxrand(), 0.0, 1.0, 150.0, 200.0 );
}

Road.prototype.update = function ()
{
  let vx       = cos( this.theta ) * speed;
  let vy       = sin( this.theta ) * speed;
  
  this.px      = this.x;
  this.py      = this.y;
  this.x       += vx;
  this.y       += vy;
  
  
  // CHECK FOR OVERLAP ( NEEDS WORK )
  //
  let nx       = this.x + vx;
  let ny       = this.y + vy;
  let xi       = int( nx );
  let yi       = int( ny );
  let nc0      = readColor( xi, yi );
  let nr0      = brightness( nc0 );
  if( nr0 > 20 )    // if brighter than bg color
  {
    if( nc0.toString() != this.cd.toString() )    // if color isnt my color 
    {
      this.dead = 1;
    }
  }
  
  
  // CHECK FOR WHICH TYPE TO DRAW, LINES OR CURVES
  //
  let n        = noise( this.x * 0.025 + nOffsetY, this.y * 0.025 + nOffsetX ); // yeah, its inverted
  if( n > typeThresh )
  {
    let ns     = 0.025;
    let n      = noise( this.x * ns + nOffsetX, this.y * ns + nOffsetY );
    this.theta += map( n, 0.0, 1.0, -0.02, 0.02 );
    this.theta += this.delta;
    this.delta += this.delta2;
    this.theta = wrapTheta( this.theta );
  }


  if( fxrand() < 0.05 && this.age > 5 && this.dead == 0 ) {                      // CREATE SIDE ROADS
    addSpawn( this.x, this.y, this.theta + PI, this.cd, 0 );
  }
  

  if( this.age % 4 == 0 && this.age > this.fillThresh && this.dead == 0 ) {       // CREATE FILL ROADS
    addSpawn( nx, ny, this.theta, this.cd, 1 );
  }
  /*
  if( this.age > 300 && this.age < 310 )
  {
    let r = map( this.age, 300.0, 310.0, 0.2, 7.0 );
    this.drawCircle( r );
  }*/
  
  if( abs( this.delta ) > 0.01 ){
    let r     = sin( map( abs( this.delta ), 0.01, 0.3, 0.0, PI ) );
    let r2    = map( r, 0.0, 1.0, 0.01, 2.0 );
    let ci    = animPer * 0.5 + r * 0.5;
    this.drawCircle( r2, getColor( pow( animPer, 2 ) ) );
  }
  
  this.age += 1;
  if( this.age > this.life ) this.dead = 1;
  
  this.clipBorder();
};


Road.prototype.drawLine = function(){
  let sw         = map( animPer, 0.0, 1.0, this.maxRadius, 0.3 );
  let myc        = getColor( animPer );                   
  
  if( this.dead == 0 ){
    //bg.stroke( myc );
    //bg.strokeWeight( sw );
    //bg.line( this.x, this.y, this.px, this.py );
    bg.fill( myc );
    bg.circle( this.x, this.y, sw*1.0 );
  }
}


Road.prototype.drawCircle = function( r, c ){
  fg.fill( c );
  fg.circle( this.x, this.y, r ); 
}


Road.prototype.drawDot = function(){
  tg.circle( this.x, this.y, map( fxrand(), 0.0, 1.0, 1.5, 2.5 ) * ( 1.0 - animPer ) ); 
}

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
  return this.dead > 0.5;
};


Road.prototype.clipBorder = function()
{
  if( this.x <= 5 ) this.dead = 1;
  if( this.y <= 5 ) this.dead = 1;
  if( this.x >= imageWidth-6 ) this.dead = 1;
  if( this.y >= imageHeight-6 ) this.dead = 1;
};


