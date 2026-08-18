#ifdef GL_ES
precision highp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D u_background;
uniform float u_effect;


void main() {
  vec2 uv = vTexCoord;
  
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;
  
  vec4 tex = texture2D(u_background, uv);
  float noise = (fract(sin(dot(uv, vec2(12.9898,78.233)*2.0)) * 43758.5453));

  float noisef = (fract(sin(dot(uv, vec2(12.9898,78.233)*2000.0)) * 43758.5453));

  float noiseg = (fract(sin(dot(uv, vec2(17.2741,72.1591)*2.5)) * 23920.3612));
  vec3 col = tex.rgb - noise * u_effect + noiseg * u_effect + noisef * u_effect;

  // render the output
  gl_FragColor = vec4(col + 0.02,1.0);
}