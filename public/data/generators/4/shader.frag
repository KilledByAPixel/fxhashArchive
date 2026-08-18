#ifdef GL_ES
precision highp float;
#endif

varying float r;
varying float r2;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
uniform float time;
varying vec3 v_normals;
uniform float seed;
uniform float pal;
uniform float spal;
uniform float str;

 void main(){
     vec3 normal = normalize(v_normals);
     vec3 light_dir = vec3(1.,-1.0,1);
	light_dir = normalize(light_dir);
    vec3 light_col = vec3(1.);
    vec3 ambient_light = 0.15 * light_col;

    vec3 diffuse_light = max(dot(light_dir, normal),0.0) * light_col;
     vec3 col;
     vec3 col2;
     float rx = r * str * 4.0;
     if(pal == 0.){
     col = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0,0.7,0.4),
         vec3(0.0,0.15,0.2)
     );
     }
     if(pal == 1.){
     col = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0),
         vec3(0.0,0.1,0.2)
     );
     }
if(pal == 2.){
     col = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0),
         vec3(0.0,0.0,0.0)
     );
     }
if(pal == 3.){
     col = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0),
         vec3(0.0,0.33,0.66)
     );
     }
if(pal == 4.){
     col = palette(
         rx-time*0.013+seed,
         vec3(0.8,0.5,0.4),
         vec3(0.2,0.4,0.2),
         vec3(2.,1.,1.0),
         vec3(0.0,0.25,0.25)
     );
     }
if(spal == 0.){
     col2 = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0,0.7,0.4),
         vec3(0.0,0.15,0.2)
     );
     }
     if(spal == 1.){
     col2 = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0),
         vec3(0.0,0.1,0.2)
     );
     }
if(spal == 2.){
     col2 = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0),
         vec3(0.0,0.0,0.0)
     );
     }
if(spal == 3.){
     col2 = palette(
         rx-time*0.013+seed,
         vec3(0.5),
         vec3(0.5),
         vec3(1.0),
         vec3(0.0,0.33,0.66)
     );
     }
if(spal == 4.){
     col2 = palette(
         rx-time*0.013+seed,
         vec3(0.8,0.5,0.4),
         vec3(0.2,0.4,0.2),
         vec3(2.,1.,1.0),
         vec3(0.0,0.25,0.25)
     );
     }
     col = mix(col,col2,r2);
     col = col * (ambient_light + diffuse_light);
     gl_FragColor = vec4(col,1.);
 }
