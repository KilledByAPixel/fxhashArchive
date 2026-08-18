precision mediump float;

uniform float time;
uniform sampler2D texture;
int n=1;
varying vec2 vTexCoord;
uniform vec2 resolution;


mat3 YUVFromRGB = mat3(
  vec3(0.299, -0.14713, 0.615),
  vec3(0.587, -0.28886, -0.51499),
  vec3(0.114, 0.436, -0.10001));

mat3 RGBFromYUV = mat3(
  vec3(1, 1, 1),
  vec3(0.0, -0.394, 2.03211),
  vec3(1.13983, -0.580, 0.0));

float extractLuma(vec3 c) {
  return c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
}

float grain (vec2 st) {
    return fract(sin(dot(st.xy, vec2(17.0,180.)))* 2500. + time);
}

void main() {

  vec2 uv = vTexCoord;
  uv = 1.0 - uv;
  vec4 s = texture2D(texture, uv);
  vec3 yuv = YUVFromRGB * s.rgb;
  vec2 imgSize = vec2(resolution.x, resolution.y);
  vec3 grainPlate = vec3(grain(uv));

  float accumY = 0.0;
  for (int i = -1; i <= 1; ++i) {
    for (int j = -1; j <= 1; ++j) {
      vec2 offset = vec2(i, j) / imgSize;
      float s = extractLuma(texture2D(texture, uv + offset).rgb);
      float notCentre = min(float(i*i + j*j), 1.0);
      accumY += s * (9.0 - notCentre*10.0);
    }
  }
  accumY /= 6.0;
  //defult 9 less is sharpen
  float gain = 1.0;
  accumY = (accumY + yuv.x)*gain;
	vec3 color =vec3(RGBFromYUV * vec3(accumY, yuv.y, yuv.z));
  vec3 mixer = mix(color.rgb, grainPlate, .1);
	if(n==1){
		gl_FragColor = vec4(mixer.rgb,1.0);
	}else{
		gl_FragColor = vec4(1.0-mixer.r,1.0-mixer.g,1.0-mixer.b,1.0);
  }


  // vec2 pixelSize = vec2(1.0) / resolution;
  // vec2 offset = pixelSize * 10.0;
  // vec4 rTex = texture2D(tex0, uv - offset);
  // vec4 gTex = texture2D(tex0, uv);
  // vec4 bTex = texture2D(tex0, uv + offset);
  // vec4 color = vec4(rTex.r, gTex.g, bTex.b, 1.0);
  // gl_FragColor = color;
}
