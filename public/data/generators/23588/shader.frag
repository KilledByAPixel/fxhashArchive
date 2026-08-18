  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec2 vTexCoord;

  uniform sampler2D tex0;
  uniform vec2 u_resolution;
  uniform vec2 z;

  const int directions = 12;  
  const int rings = 2;

  float map(float x, float imin, float imax, float omin, float omax) {
    return imin + (x-omin)*((imax-imin)/(omax-omin));
  }

  float rand(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898,78.233)))*43578.5453);   
  }

  vec4 blur(sampler2D txt, vec2 st, float s, float ph, float dr) {
    vec4 col = vec4(0.0);
    vec2 d = dr*(1.0/u_resolution);
    for (int j = 1; j < rings+1; j++) {
      for (int i = 0; i<directions; i++) {
        float a = float(i)*(ph/float(directions));
        vec2 p = st + (vec2(cos(a),sin(a)))*s;
        float r1 = clamp(rand(st * float(i))*2.0-1.0, -d.x, d.x);
        float r2 = clamp(rand(st * float(i+directions))*2.0-1.0, -d.y, d.y);          
        p += vec2(r1,r2);
        vec4 cs = texture2D(txt, p);
        cs = pow(cs,vec4(2.2));
        col += cs;
      }
    }  
    return col/(float(rings)*float(directions)); 
  }

  void main() { 
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    uv.x = map(uv.x, z.x, z.y, 0.0, 1.0);
    uv.y = map(uv.y, z.x, z.y, 0.0, 1.0);
    vec4 bg = blur(tex0, uv, 0.002, 6.28, 0.07);
    float avg = dot(bg.rgb, vec3(0.333));
    avg = avg*2.0 - 1.0;
    vec2 st = uv;
    st += 0.002*avg + 0.0003*rand(st);
    float offset = 0.0002;
    vec4 col = blur(tex0, st,offset, 2.14, 0.0);
    col = pow(col, vec4(1.0 / 2.2));
    gl_FragColor = vec4(col);
}