precision highp float;
#define maxN 200
varying vec2 vTexCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution;

void main(){
    vec2 uv = vTexCoord;
    uv.y = 1. - uv.y;
    gl_FragColor = vec4(0.,0.,0.,texture2D(uTexture, uv).a > 0. ? 0. : 1.);
}
