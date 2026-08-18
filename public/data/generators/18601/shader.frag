#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform sampler2D u_background;
uniform float u_effect;
uniform float u_millis_a;
uniform float u_millis_b;
uniform float u_millis_c;
uniform float u_time;
uniform float u_glitch;
uniform vec2 u_resolution;


vec3 vignette(vec3 color, float intensity)
{
    vec2 position = (gl_FragCoord.xy / u_resolution) - vec2(0.5);           
    float dist = length(position);
    //float dist = length(position * vec2(u_resolution.x/u_resolution.y, 1.0));

    float radius = 1.0;
    float softness = 0.9;
    float v = smoothstep(radius, radius - softness, dist);
    v = pow(v, intensity);

    color.rgb = color.rgb - (1.0 - v);

    return color;
}

float rand(vec2 uv, float a, float b, float c, float d, float e){
  return fract(sin(dot(uv.xy ,vec2(a,b) * c) + d) * e);
}

float offset(float blocks, vec2 uv, float intensity) {
  float shaderTime = u_time*intensity;
  return rand(vec2(shaderTime, floor(uv.y * blocks)), 12.9898, 78.233, 1.0, 0.0, 43758.5453) * 2.0 - 1.0;
}

vec3 glitch(vec3 color, vec2 uv, float intensity)
{
    vec3 glitchColor = color;
    float blocks = 2048.0;
    glitchColor.r = texture2D(u_background, uv + vec2(offset(blocks, uv, intensity) * 0.03, 0.0)).r;
    glitchColor.g = texture2D(u_background, uv + vec2(offset(blocks, uv, intensity) * 0.03 * 0.16666666, 0.0)).g;
    glitchColor.b = texture2D(u_background, uv + vec2(offset(blocks, uv, intensity) * 0.03, 0.0)).b;

    color.r = color.r * (1.0 - intensity) + glitchColor.r * intensity;
    color.g = color.g * (1.0 - intensity) + glitchColor.g * intensity;
    color.b = color.b * (1.0 - intensity) + glitchColor.b * intensity;

    return color;
}


void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 tex = texture2D(u_background, uv);
  vec3 col = tex.rgb;
  col = glitch(col,uv,u_glitch);
  float noise = rand(uv, 12.9898, 78.233, 2.0, u_millis_a, 43758.5453);
  float noisef = rand(uv, 12.9898, 78.233, 2000.0, u_millis_b, 43758.5453);
  float noiseg = rand(uv, 17.2741, 72.1591, 2.5, u_millis_c, 23920.3612);
  col = col - noise * u_effect + noiseg * u_effect + noisef * u_effect;

  col = vignette(col,0.12);
  

  gl_FragColor = vec4(col + 0.02,1.0);
  //gl_FragColor = vec4(vig);
}