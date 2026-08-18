#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

uniform float seedA;
uniform float seedB;
uniform float seedC;
uniform float seedD;
uniform float seedE;
uniform float seedF;

uniform float PI;
uniform float time;
uniform bool mirror;
uniform bool useWebbing;
uniform bool angled;
uniform bool rotated;

uniform float sectionX;
uniform float sectionY;

uniform bool removeBgColor;

uniform bool addOffsetLayering;
uniform bool useOutline;
uniform float outlineType;

uniform float yResMultiplier;

varying vec2 positionPass;

uniform float zoomDirectionX; 
uniform float zoomDirectionY; 

uniform bool hideBorderChunks;
uniform bool dirtyBorders;

uniform bool internalBlurLayering; 

uniform float shatterType;

// Palette
uniform float numColors;
uniform float palettePreCleaning[300]; // holds up to 100 colors' H, S, B singletons

// Points
uniform float numPoints;
uniform float pointsListPreCleaning[600];

uniform float bgColor[3]; // holds the background color's H, S, B singletons

// Features
uniform int structure; 
uniform int bendiness;
uniform bool colorMirrorShift;

// Random, noise, and rgb <-> hsb utilities via the Book of Shaders https://thebookofshaders.com/10/
float random (in vec2 st) {
    return fract(float(int(sin(dot(st.xy,vec2(12.98,78.23))) * 100.))/100. * 43758.545 + seedA * 10.0);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

// Base
vec2 createStructure(vec2 pos, float animationZoomX, float animationZoomY, float width, float height, float zoomX, float zoomY, float x, float y) {
  
  vec2 aVec2;

  if (structure == 0) {
        zoomX = .0*pos.x/width + 4.0 + animationZoomX + float(int(mix(-5., 5., seedA))) * .1;
        zoomY = 2.0 + animationZoomY + mix(-0.25, 0.25, seedB);
        pos = pos * vec2(zoomX, zoomY);
    
        if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.5, 1.5, seedE);
          }
          else {
              pos.x -= pos.y*mix(0.5, 1.5, seedE);
          }
        }    
    
        if (seedF < 0.1) {
          pos.x = pos.x + float(int(cos(mix(0., 2.0*PI, pos.x/width))*10000.))/10000. * width/10.;
          pos.y = pos.y - float(int(sin(mix(0., 2.0*PI, pos.y/height))*10000.))/10000. * height/10.;
        }
        
        float xPiece = float(floor(float(int(cos(mix(0.25, 1.1, float(int(pow(seedE, 0.125)*10000.))/10000.)*PI*(pos.x - u_resolution.x/2.0)/u_resolution.x) * 10000.))/10000.*mix(-1.*mix(8., 12., seedD), mix(8., 12., seedD), (pos.y - u_resolution.y/mix(1.0, 3.0, seedE))/u_resolution.y)))*20.;

        float resXShift = 1.0;
        if (seedF < 0.5) {
          resXShift = -1.0;
        }
    
        float yPiece = float(floor((float(int(sin(PI*(pos.y - u_resolution.y/2.0)/(2.0*(pos.y - u_resolution.y/2.0)))*10000.))/10000.)*mix(-5.0, 5.0, ((pos.x - u_resolution.x/2.0)*(pos.y - u_resolution.y/2.0))/(u_resolution.x*u_resolution.y))));
        aVec2 = vec2(xPiece, yPiece);
      
  }

  else if (structure == 1) {
        zoomX = 4.0 + animationZoomX + float(int(mix(-1., 1., seedA))) * .2;
        zoomY = 1.35 + animationZoomY + mix(-0.5, 0.3, seedB);
        pos = pos * vec2(zoomX, zoomY);
            if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.3, 0.6, seedE);
          }
          else {
              pos.x -= pos.y*mix(0.3, 0.6, seedE);
          }
        }   

    aVec2 = vec2(float(floor(float(int(cos(PI/mix(0.5, 3., seedE) + PI*(pos.x - u_resolution.x/2.0)/u_resolution.x)*10000.))/10000. + (float(int(sin(PI*(pos.x - u_resolution.x/2.0)*(pos.y - u_resolution.y/2.0)/(mix(1., 30., seedF)*u_resolution.x*u_resolution.y))*10000.))/10000.)*mix(-1. * mix(2., 8., seedD), mix(2., 6., seedD), (pos.x - u_resolution.x/2.0)/u_resolution.x))), float(floor((float(int(sin(mix(2., 4., seedA)*PI*(pos.y - u_resolution.y/200.0)/(mix(0.5, 4., seedA)*u_resolution.y))*10000.))/10000.)*mix(-8.0, 8.0, (pos.x - u_resolution.x/20.0)/(u_resolution.x*mix(0.5, 4., seedA * seedB))))));
  }

  else if (structure == 2) {
    
        zoomX = 5.0 + animationZoomX + float(int(mix(-2., 2., seedA))) * .2;
        zoomY = 5.0 + animationZoomY  +mix(-0.5, 3.0, float(int(pow(seedB, 3.0)*10000.))/10000.);
        pos = pos * vec2(zoomX, zoomY);
    if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.2, 0.5, seedE);
          }
          else {
              pos.x -= pos.y*mix(0.2, 0.5, seedE);
          }
        }   
    aVec2 = vec2(float(floor(float(int(cos((pos.x - u_resolution.x/2.0)*((pos.y - u_resolution.y/2.0)/u_resolution.y)/u_resolution.x)*10000.))/10000.*mix(4., 12., seedD))), float(floor((float(int(sin((pos.y - u_resolution.y/2.0)/(2.*u_resolution.y))*10000.))/10000.)*mix(2., 22., seedF))));
    
  }
  else if (structure == 3) {
    
    zoomX = 3.0 + animationZoomX + float(int(mix(-8., 8., seedA))) * .2;
    zoomY = 2.0 + animationZoomY + mix(-0.5, .25, seedB);
    pos = pos * vec2(zoomX, zoomY);
    
    if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(1.0, 1.5, seedE);
          }
          else {
              pos.x -= pos.y*mix(1.0, 1.5, seedE);
          }
        }  
    
    aVec2 = vec2(float(floor(float(int(sin(mix(0.5, 1.5, seedD)*PI*pos.x/(mix(0.2, 3.5, seedD)*u_resolution.x))*10000.))/10000.*mix(-1.*mix(5., 30., seedE), mix(5., 30., seedE), pos.y/u_resolution.y))), float(floor(float(int(sin(mix(0.8, 1.2, seedF)*PI*pos.y/(2.*u_resolution.y))*10000.))/10000.*mix(-1.0*mix(2., 20., seedA), mix(2., 20., seedA), (pos.x*pos.y)/(u_resolution.x*u_resolution.y)))));
    
  }
  else if (structure == 4) {
    
      zoomX = 2.0 + animationZoomX + float(int(mix(-5., 5., seedA))) * .2;
      zoomY = 2.0 + animationZoomY + mix(-0.25, .25, seedB);
      pos = pos * vec2(zoomX, zoomY);
    
      if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.5, 1.1, seedE);
          }
          else {
              pos.x -= pos.y*mix(0.5, 1.1, seedE);
          }
        }  
    
      aVec2 = vec2(float(floor(float(int(sin(PI*pos.x/(3.5*width))*10000.))/10000.*mix(-1.*mix(8., 14., seedD), mix(8., 14., seedD), pos.x*pos.y/(width*height)))), float(floor(float(int(sin(PI*pos.y/(2.*height))*10000.))/10000.*mix(-1.*mix(4., 8., seedF), mix(4., 8., seedF), pos.x*pos.y/(width*height)))));

  }
  else if (structure == 5) { 
    
      zoomX = 2.0 + animationZoomX + mix(-1.25, 1.25, seedA);
      zoomY = 2.0 + animationZoomY + mix(-.25, .25, seedB);
      pos = pos * vec2(zoomX, zoomY);
    
          if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.1, 0.2, seedE);
          }
          else {
              pos.x -= pos.y*mix(0.1, 0.2, seedE);
          }
        }  
    
      aVec2 = vec2(float(floor(float(int(sin(PI*pos.x*pos.y/(mix(0.75, 1.25, seedF)*width*height))*10000.))/10000.*mix(-1.*mix(8., 14., seedD), mix(8., 14., seedD), pos.x*pos.y/(width*height)))), float(floor(float(int(sin(PI*pos.y/(2.*height))*10000.))/10000.*mix(-10., 10., pos.x*pos.y/(width*height)))));



  }
  else if (structure == 6) {
    
      zoomX = 2.0 + animationZoomX + mix(-1., 1., seedA);
      zoomY = 1.5 + animationZoomY + mix(-0.5, 0.75, seedB);;
      pos = pos * vec2(zoomX, zoomY);
    
     if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.2, 1.2, seedE) / zoomY;
          }
          else {
              pos.x -= pos.y*mix(0.2, 1.5, seedE) / zoomY;
          }
        }  
    
      aVec2 = vec2(float(floor(float(int(sin(PI*pos.x*pos.y/(3.5*width*height))*10000.))/10000.*mix(-5., 5., float(int(pow(pos.x*pos.y, 0.5)*10000.))/10000./(float(int(pow(width*height, 0.5)*10000.))/10000.)))), float(floor(float(int(sin(5.*PI*pos.y/(2.*height))*10000.))/10000.*mix(-8.,5.,pos.x/width))));

  }
  
  else if (structure == 7) {
    
      zoomX = 1.5 + animationZoomX + mix(-.25, .25, seedA);
      zoomY = 2.0 + animationZoomY + mix(-.5, .25, seedB);
      pos = pos * vec2(zoomX, zoomY);  
    
     if (angled) {
              pos.x -= pos.y*mix(0.4, 0.5, seedE) / zoomY;
        }      
      aVec2 = vec2(float(floor(float(int(sin(PI*pos.x*pos.y/(max(abs(mix(-2.,2.,noise(vec2(1.*pos.x/width,1.*pos.y/width)))), 0.3)*width*height))*10000.))/10000.*mix(-10., 10., (pos.x/(log(pos.y)))/(width/(log(float(int(pow(pos.y, mix(0.8, 2.0, float(int(pow(seedD, 2.)*10000.))/10000.))*10000.))/10000.)))))), float(floor(float(int(sin(mix(3.0, 6.0, seedF)*PI*pos.y/(2.*height))*10000.))/10000.*mix(mix(-2.,2.,noise(vec2(1.*pos.x/width,1.*pos.y/width))),5.,pos.x*pos.y/(width*height)))));
    

  }
  else if (structure == 8) {
    
      zoomX = 2.0 + animationZoomX + mix(-1., .45, seedA);
      zoomY = 2.0 + animationZoomY + mix(-0.25, .25, seedA);
      pos = pos * vec2(zoomX, zoomY);    
    
         if (angled) {
          if (seedD < 0.5) {
              pos.x += pos.y*mix(0.2, 0.4, seedE) / zoomY;
          }
          else {
              pos.x -= pos.y*mix(0.2, 1.0, seedE) / zoomY;
          }
        }  
    
      aVec2 = vec2(float(floor(float(int(sin(PI*pos.x*pos.y/(3.5*width*height))*10000.))/10000.*mix(-1.*mix(8.0, 12.0, seedD), mix(8.0, 12.0, seedD), (pos.x/(log(pos.y)))/(width/(log(pos.y)))))), float(floor(float(int(sin(5.*PI*pos.y/(2.*height))*10000.))/10000.*mix(-5.,5.,pos.x*pos.y/(width*height)))));
    
  }
  else if (structure == 14) {
    
    zoomX = -2.0 + float(int(mix(-10., 10., seedA))) * .1;
    if (seedF < 0.2) {
      zoomX *= -1.0;
    }
    zoomY = mix(-1.25, 1.25, seedC);
    
    pos = pos * vec2(zoomX, zoomY);
    
    aVec2 = vec2(floor(mix(-300., 300., seedA) * float(int(pow(pos.x / pos.y, pos.y/(height * 10.0))*10000.))/10000. + (mix(-1., 1., float(int(sin(pos.x/height)*10000.))/10000.))*(min(1.0, float(int(tan(pos.x / width)*10000.))/10000.))), floor(mix(-20., 20., seedB) * (pos.y / height) * floor(mix(-15., 15., float(int(cos(float(int(sin((pos.x /width) + (pos.y / (height)))*10000.))/10000.)*10000.))/10000.))));
      
  }
  
  else if (structure == 15) {
    
    zoomX = -1.0 + float(int(mix(-8., 8., seedA))) * .1;
    if (seedF < 0.1) {
      zoomX *= -1.0;
    }
    zoomY = mix(-1.05, 1.05, seedC);
    
    pos.y *= 2.0;
    
    pos = pos * vec2(zoomX, zoomY);
    
    aVec2 = vec2(floor(mix(-100. * mix(1.0, 2.0, float(int(sin(1.0*pos.y/height)*10000.))/10000.), 100. * mix(1.0, 1.4, float(int(cos(1.0*pos.y/height)*10000.))/10000.), seedA) * float(int(pow(pos.x / pos.y, pos.y/(height * 10.0))*10000.))/10000. + (mix(-1., 1., float(int(sin(pos.x/height)*10000.))/10000.)) + mix(-20., 20., float(int(cos(mix(0.25, 1.1, float(int(pow(seedE, 1.0525)*10000.))/10000.)*PI*(pos.x - width/2.0)/width)*10000.))/10000.)) + floor(mix(-10., 10.0, mix(1.0, 1.5, abs(float(int(sin(float(int(pow(pos.x/width, 1.4)*10000.))/10000.)*10000.))/10000.)))), floor(mix(-10. * mix(1.0, 1.4, float(int(sin(1.0*pos.y/height)*10000.))/10000.), 10., seedB) * (0.1 * pos.y / height) * float(int(cos(mix(0.25, 1.1, float(int(pow(seedE, 0.125)*10000.))/10000.)*PI*(pos.x - width/2.0)/width)*10000.))/10000. * floor(mix(-25. * float(int(cos(3.0 * pos.x / width)*10000.))/10000., 25. * float(int(sin(3.0 * pos.x / width)*10000.))/10000., float(int(cos(float(int(sin(pos.x /width + pos.y / (height))*10000.))/10000.)*10000.))/10000.))));
      
  }
  
  return aVec2;
}


void main() {
  
    vec2 st = vec2(positionPass.x, positionPass.y);
    
    float width = u_resolution.x;
    float height = u_resolution.y;
  
    st /= 1.0;
    st.x += sectionX / 2.0;
    st.y += sectionY / 2.0;

    float superBendMultiplierX, superBendMultiplierY;
    float xNoiseOffset = 0.;
    float yNoiseOffset = 0.;
    float signX = 1.0;
    float signY = 1.0;
  
    if (bendiness == 1) { // SuperBend
      if (seedA < 0.5) {
        signX = -1.0;
      };
      if (seedB < 0.5) {
        signY = -1.0;
      };
      superBendMultiplierX = mix(0.25, 0.35, seedB);
      superBendMultiplierY = mix(-1.15, -.85, seedC);;
      xNoiseOffset = width/9.25 * signX;
      yNoiseOffset = width/9.25 * signX;
    }
    else if (bendiness == 0) { // None
      superBendMultiplierX = 1.0;
      superBendMultiplierY = -1.0;
    }
    else if (bendiness == 2) { // Xbend
      superBendMultiplierX = mix(0.8, 1.2, seedA);
      superBendMultiplierY = -1.0;
      xNoiseOffset = mix(-1.0 * width/4.0, width/4.0, seedB);
      yNoiseOffset = mix(-1.0 * width/8.0, width/8.0, seedC);
    }
    else if (bendiness == 3) { // Ybend
      superBendMultiplierX = 1.0;
      superBendMultiplierY = mix(-1.5, -0.5, seedA);
      xNoiseOffset = mix(-1.0 * width/8.0, width/8.0, seedB);
      yNoiseOffset = mix(width/4., width, seedC);;
    }
  
    float x = ((st.x * u_resolution.x)/2.0 + u_resolution.x/2.) * superBendMultiplierX;
    float y = ((((st.y * u_resolution.y)/2.0 - u_resolution.y/1.0)) + u_resolution.y*0.5) * superBendMultiplierY;
  
  
    vec3 palette[100]; // array of max 100 colors, only filled up to numColors amount
    const float count = 300.;
    for( float i = 0.0; i <= count; i += 3.0 ){
      if (i <= numColors*3.0 + 3.0) {
        vec3 addition;
        addition.x = palettePreCleaning[int(i)];
        addition.y = palettePreCleaning[int(i+1.)];
        addition.z = palettePreCleaning[int(i+2.)];
        palette[int(i / 3.0)] = addition;
      }
    }
  
     float numStriations = 100.; 
     float striationID;

      // Moves fragments based on bendiness
      vec2 pos = vec2(x + mix(-1. * xNoiseOffset, xNoiseOffset, noise(vec2(1.*x/(u_resolution.x/2.), 1.*y/(u_resolution.y/2.)))), y + mix(-1. * yNoiseOffset, yNoiseOffset, noise(vec2(1.*x/(u_resolution.x), 1.*y/(u_resolution.y)))));
  

  if (rotated) {
    
    float minRotationDisplacement = mix(0.3, 1.0, seedA);
    float maxRotationDisplacement = mix(0.3, 1.0, seedC);
    
      float angle = mix(-1.0 * minRotationDisplacement, maxRotationDisplacement, float(int(pow(pos.y / (2.0*height), 1.04)*10000.))/10000.);
    
    if (seedD < 0.5) {
      angle *= -1.0;
    }
  
    pos.x = pos.x * float(int(cos(angle)*10000.))/10000. - pos.y * float(int(sin(angle)*10000.))/10000.;
    pos.y = pos.x * float(int(sin(angle)*10000.))/10000. + pos.y * float(int(cos(angle)*10000.))/10000.;
  }
  

  // Mirror
    if (pos.x > u_resolution.x/2. && mirror) {
      pos = vec2(u_resolution.x/2. - (pos.x - u_resolution.x/2.), pos.y);
    }
  
  float zoomX;
  float zoomY;
  float shiftX;
  float shiftY;
  
  vec2 aVec2 = pos; 
  
  float animationZoomX = 0.0;
  float animationZoomY = 0.0;
  float isOutline = 0.0;
  float intensityFactor = float(int(pow(mix(0.85, 1.25, noise(vec2(x / width, y / height))), 1.5)*10000.))/10000.;
  vec2 originalAVec2 = createStructure(pos, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
  float originalN = noise(originalAVec2);
  float originalStriationID = floor(originalN * numStriations * 20.);
  

  if (shatterType == 0.0) {
    // do nothing!
  }
  else if (shatterType == 1.0) {
       for (float i = 0.; i < 4.; i += 1.0) {
        if (mod(float(int(pow(1000. * pos.x / width, 1.0)*10000.))/10000. + (pos.y * 1000. / width) / i, mix(100., 400., seedC)) < width/160. * mix(.5, 20.0, pos.x/width) ) { 
          pos.x += width / 30. * mix(.5, 1.5, i / 4.);
          pos.y += width / 15. * mix(.75, 1.25, i / 4.);
        }

          if (mod(float(int(pow(1000. * pos.y / width, 1.0)*10000.))/10000. * float(int(pow(mix(.25, 2.5, y / height), 1.25)*10000.))/10000. - (pos.x * 1000./width) / i, mix(100., 400., seedD)) < width/160. * mix(.5, 20.0, pos.x/width)) {
          pos.x += width / 30.;
          pos.y += width / 15.;
        }
    }
  }
  else if (shatterType == 2.0) {
        
        float direction = 1.0;
        if (seedA < 0.5) {
          direction = -1.0;
        }
    
        if (mod(y + direction * (x / 4.), width / 10.) < mix(width/24., width/18., seedB)) {
          pos.x += width / 20.;
          pos.y += width / 10.;
        }
  }
  
  
  float sameDisplacement = 1.0;
  float maxXDisplacement = width;
  float maxYDisplacement = width;
  
  vec2 originalPos = pos;
  
  if (internalBlurLayering) {
      maxXDisplacement = width / 20.;
      maxYDisplacement = width / 22.;
  }
  else {
     maxXDisplacement = width / 25.;
     maxYDisplacement = width / 25.;
  }
  
  
  if (originalStriationID < (numStriations * 20.) / 3.0) { // blur layer potential layer 2
    pos.x += mix(maxXDisplacement, maxYDisplacement, float(int(pow(noise(vec2(pos.x / float(int(sin(pos.y)*10000.))/10000., pos.y / float(int(cos(pos.x)*10000.))/10000. )), 1.5)*10000.))/10000.) * intensityFactor;
    pos.y += mix(maxXDisplacement, maxYDisplacement, noise(vec2(pos.x / float(int(sin(pos.y)*10000.))/10000., pos.y / float(int(cos(pos.x)*10000.))/10000. ))) * intensityFactor;
  }
  
  // Determine first ID here:
  aVec2 = createStructure(pos, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
  
  
  float n = noise(aVec2);
  striationID = floor(n * numStriations * 20.);

  float maxStriationID = n * numStriations * 20.;
  
  if (addOffsetLayering) {
    float offsetMax = mix(width/20.0, width/1.0, n);

    // If the below point is a chosen ID, become that point
    vec2 belowXY = createStructure(vec2(pos.x , pos.y - mix(-1.0*offsetMax, 1.0*offsetMax, noise(vec2(1.*x/width, 1.*y/height)))), animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
    float n2 = noise(belowXY);
    float striationID2 = floor(n2 * numStriations * 20.);
  
    if (n2 <= seedA) {
      striationID = striationID2;
      n = 1.05*n;
    }
  }

  float r, g, b, a;
  
  n *= 500.;
  int nTemp = int(n);
  n = float(nTemp) / 500.;

  float xDiff = 0.0;
  if (x > width/2. + mix(-1.0 * width / 200., width / 200., noise(vec2(x, y))) && colorMirrorShift) {
    xDiff = 1.;
  }

  // choose color
  int paletteColor = int(mod(float(mix(0., numColors, n) + xDiff + 0.0), numColors));

  int MAX_COLORS = 30; // maximum palette size for colors
  for (int k = 0; k < 30; k++) {
    if (paletteColor == k) {
      r = palette[k].x;
      g = palette[k].y;
      b = palette[k].z;
      break;
    }
  }

  a = 1.0;

  vec3 baseColor = vec3(r, g, b);
  vec3 hsbBaseColor = rgb2hsb(baseColor);
  float h1 = hsbBaseColor.x;
  float s1 = hsbBaseColor.y;
  float b1 = hsbBaseColor.z;

  // Striation specific
  float hueDisplacementMax = .01;
  float numHueBands = 0.0; 
  h1 = h1 + mix(-1. *hueDisplacementMax, hueDisplacementMax, mod(mod(striationID, numStriations)/numStriations, numHueBands));
  
   float brightnessDisplacementMax = 0.04;
   float numBrightnessBands = 40.;
   b1 = b1 + mix(-1. *brightnessDisplacementMax, brightnessDisplacementMax, mod(mod(striationID, numStriations)/numStriations, numBrightnessBands));

  // Striation agnostic fuzz
  b1 += mix(-0.015, 0.015, noise(vec2(1000.*pos.x/width, 1000.*pos.y/height)));
  s1 += mix(-0.015, 0.015, noise(vec2(1000.*pos.y/height, 1000.*pos.x/width)));

  // Light
  b1 += mix(-0.04, 0.04, noise(vec2(pos.x/width, float(striationID/numStriations))));
  s1 += mix(-0.01, 0.01, noise(vec2(pos.y/width, float(striationID/numStriations))));
  
  // Border
  vec3 bgColorVec = vec3(float(bgColor[0]), float(bgColor[1]), float(bgColor[2]));
  vec3 bgHSBColor = rgb2hsb(bgColorVec);
  
  // Outlines
  if (useOutline) {
    
    if (outlineType == 3.0 || outlineType == 0.0) {
        // Shadow Up
        vec2 pos2 = vec2(pos.x, pos.y - width/300.);
        vec2 aVec2Point2 = createStructure(pos2, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
        float nPos2 = noise(aVec2Point2);
        float striationIDPoint2 = floor(nPos2 * numStriations * 20.);

          if (striationIDPoint2 != striationID) {
            b1 *= 0.90; // was .85
            h1 *= 0.95;
          }

        // Shadow Right
        vec2 pos3 = vec2(pos.x - width/300., pos.y);
        vec2 aVec2Point3 = createStructure(pos3, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
        float nPos3 = noise(aVec2Point3);
        float striationIDPoint3 = floor(nPos3 * numStriations * 20.);

          if (striationIDPoint3 != striationID) {
            b1 *= 0.87;
            h1 *= 0.99;
          }
    }
    
    if (outlineType == 0.0) {
      // Line
      vec2 pos4 = vec2(pos.x, pos.y + mix(width / 350., width / 350., noise(vec2(x * 10., y * 10.))));
      vec2 aVec2Point4 = createStructure(pos4, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
      float nPos4 = noise(aVec2Point4);
      float striationIDPoint4 = floor(nPos4 * numStriations * 20.);

      if (striationIDPoint4 != striationID) { // NEED TO CHECK POX.X without width divider
        b1 -= mix(1.05, 1.2, noise(vec2(100.*pos.x/width, 100.*pos.y/height)));
        h1 *= 1.0 * mix(.96, 1.04, noise(vec2(100.*pos.x/width + width / 10., 100.*pos.y/height + width / 10.)));
        s1 *= 1.0 * mix(.9, 1.1, noise(vec2(100.*pos.x/width + width / 20., 100.*pos.y/height + width / 20.)));
      }
    }
    
    if (outlineType == 1.0) {
      // Line
      vec2 pos4 = vec2(pos.x, pos.y + (width / 250.));
      vec2 aVec2Point4 = createStructure(pos4, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
      float nPos4 = noise(aVec2Point4);
      float striationIDPoint4 = floor(nPos4 * numStriations * 20.);

      if (striationIDPoint4 != striationID) {
        h1 = bgHSBColor.x;
        s1 = bgHSBColor.y;
        b1 = bgHSBColor.z;
      }
    }
    
    if (outlineType == 2.0) {
      
          vec2 pos4 = vec2(pos.x, pos.y + mix(width / 100., width / 100., noise(vec2(x * 10., y * 10.))));
          vec2 aVec2Point4 = createStructure(pos4, animationZoomX, animationZoomY, width, height, zoomX, zoomY, x, y);
          float nPos4 = noise(aVec2Point4);
          float striationIDPoint4 = floor(nPos4 * numStriations * 20.);

          if (striationIDPoint4 != striationID) {

              float r, g, b, a;

              float xDiff = 0.0;
              if (x > width/2. + mix(-1.0 * width / 200., width / 200., noise(vec2(x, y))) && colorMirrorShift) {
                xDiff = 1.;
              }

              // choose color
              int paletteColor = int(mod(float(mix(0., numColors, n) + xDiff + 1.0), numColors));


              int MAX_COLORS = 30; // maximum palette size for colors
              for (int k = 0; k < 30; k++) {
                if (paletteColor == k) {
                  r = palette[k].x;
                  g = palette[k].y;
                  b = palette[k].z;
                  break;
                }
              }

              a = 1.0;

              vec3 baseColor = vec3(r, g, b);
              vec3 hsbBaseColor = rgb2hsb(baseColor);
              h1 = hsbBaseColor.x;
              s1 = hsbBaseColor.y;
              b1 = hsbBaseColor.z;
          }
      }
  }
  
  vec3 outputColor;
  float thicknessX = width/15.;
  float thicknessY = thicknessX*1.15;

  float colorConstant = mix(width / 100., width, float(paletteColor) / numColors);
  
  b1 *= mix(0.70, 1.05, float(int(pow(noise(vec2(colorConstant + pos.x / width * 5., colorConstant + pos.y / height * 5.)), 0.25)*10000.))/10000.);
  s1 *= mix(0.95, 1.0, float(int(pow(noise(vec2(colorConstant + pos.x / width * 5., colorConstant + pos.y / height * 5.)), 0.25)*10000.))/10000.);

  // Lighting, distance from a source
  if (n < mix(0.3, 0.8, float(int(pow(seedC, 0.9)*10000.))/10000.)) {
      b1 *= 1.20 - float(int(pow(mix(0.0, 0.35, distance(vec2(x,y), vec2(mix(0., width, seedD), mix(0., height, seedF))) / (height)), 1.35)*10000.))/10000.;
  }
  
  float heightBite = width / 18. * mix(.65, 1.45, seedC);
  float widthBite = width / 25. * mix(.65, 1.45, seedB);
  
  if (seedA < 0.15) {
    heightBite = width / 130.;
    widthBite = width / 180.;
  }
  
  // Edge splatter and border removal
  if (dirtyBorders) {
    heightBite *= mix(.5, 3.0, float(int(pow(noise(vec2(n * 100., n)), 1.50)*10000.))/10000.); 
    widthBite *= mix(.5, 3.0, float(int(pow(noise(vec2(n * 100., n)), 1.50)*10000.))/10000.);
    
    heightBite *= mix(.9, 1.55, float(int(pow(noise(vec2(1500. * pos.x / width, 1500. * pos.y / height)), .05)*10000.))/10000.); 
    widthBite *= mix(.9, 1.15, float(int(pow(noise(vec2(1500. * pos.x / width, 1500. * pos.y / height)), .05)*10000.))/10000.); // change the '0.05' to change the splatter at the edges
  }
  
  float bendConstant = 1.0;
  if (superBendMultiplierY < 0.) {
    bendConstant = -1.0;
  }
  
  if (x < widthBite || x > superBendMultiplierX*width - (widthBite) || y < heightBite || y > height * superBendMultiplierY * bendConstant - heightBite) {

    if (hideBorderChunks) {
        h1 = bgHSBColor.x;
        s1 = bgHSBColor.y;
        b1 = bgHSBColor.z;
    }
  }

  // Texture
  float noiseVal = noise(vec2(pos.x / width * 10000. + (striationID * 100.), pos.y / height * 100. + (striationID * 1000.)));
  
  if (striationID < numStriations / 2.0) {
   float noiseVal = noise(vec2(pos.x / width * 10. + (striationID * 1000.), pos.y / height * 10000. + (striationID * 100.)));
  }
  
  if (noiseVal <= mix(0.0, 0.8, float(paletteColor) / numColors)) { // can change threshold
    
    b1 *= (mix(.92, 1.02, float(int(pow(noiseVal, 0.45)*10000.))/10000.));
    s1 *= (mix(.94, 1.01, float(int(pow(noiseVal, 0.35)*10000.))/10000.));
        
    if (float(paletteColor) * 1.75 >= numColors) { // affect some of the colors
         b1 *= (mix(.95, 1.04, float(int(pow(noiseVal, 0.75)*10000.))/10000.));

    }

    if (float(int(pow(noise(vec2(pos.y / height * 10., pos.x / height * 10.)), 2.0)*10000.))/10000. > 0.5) {
      s1 *= (mix(.94, 1.05, float(int(pow(noiseVal, 0.75)*10000.))/10000.));
    }
  }
  
  if (removeBgColor) {
    if (bgHSBColor.x == hsbBaseColor.x && 
        bgHSBColor.y == hsbBaseColor.y && 
        bgHSBColor.z == hsbBaseColor.z) {
      h1 = hsbBaseColor.x;
      s1 = hsbBaseColor.y;
      b1 = hsbBaseColor.z;
    }
  }
  
  outputColor = hsb2rgb(vec3(h1, s1, b1));

  vec3 preColor3 = outputColor;
  vec4 preColor = vec4(outputColor, a);

  gl_FragColor = preColor;
}
