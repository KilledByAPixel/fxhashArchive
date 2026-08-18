#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform sampler2D u_background;
uniform sampler2D u_noisebg;
uniform sampler2D u_noisebgb;
uniform float u_effect;
uniform float u_largeNoise;
uniform float u_rand;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 tex = texture2D(u_noisebg, uv);
  vec4 tex2 = texture2D(u_noisebgb, uv);
  vec4 highres = texture2D(u_background, uv);

  float t = 12.9898*uv.x + 78.233*uv.y;
  float light_noise = fract((u_rand * 1.1369 + t) * sin(t));
  float dark_noise = fract((u_rand * 0.85669 + t) * sin(t));

  vec3 col = highres.rgb + u_largeNoise*tex.rgb - u_largeNoise * tex2.rgb - dark_noise * u_effect + light_noise * u_effect;
  gl_FragColor = vec4(col,1.0);
}