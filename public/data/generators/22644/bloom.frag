#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D tex;
uniform sampler2D blurTex;
uniform sampler2D layer;
uniform float gradModifier;


float brightness = 0.9;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  
  vec4 image = texture2D(tex, uv);
  vec4 blurImage = texture2D(blurTex, uv);
  
  vec4 layerImage = texture2D(layer, uv);
  float avg = blurImage.r + blurImage.g + blurImage.b;
  float brImage =image.r*brightness + image.g*brightness + image.b*brightness;//dot(image.rgb, vec3(0.299, 0.587, 0.114));// image.r*brightness + image.g*brightness + image.b*brightness;
  float blurBri = dot(blurImage.rgb, vec3(0.299, 0.587, 0.114));//blurImage.r*blurBrightness + blurImage.g*blurBrightness + blurImage.b*blurBrightness;
  avg /= 300.0;
  
  avg *= 0.5;
  
  avg = clamp(avg, 0.0, 1.0);
  
  float grad = length(uv - 0.4) * gradModifier;
  
  vec4 bloom = mix(image, blurImage, grad);
  
  vec4 bi = blurImage*4.0;
 

  bloom += bi+blurBri;//blurImage*4.5;
  bloom += image*0.5+brImage/0.9;

  
  gl_FragColor = bloom;
}