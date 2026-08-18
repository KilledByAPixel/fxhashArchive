precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform vec2 texelSize;
uniform float time;
uniform float smearLevel;
uniform float smearSize;
uniform vec2 smearDir;

vec3 rgb2hsv(vec3 c)
{
	vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

	float d = q.x - min(q.w, q.y);
	float e = 1.0e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main() {

	vec2 uv = vTexCoord;
	float n = noise(uv*vec2(2000)*vec2(time)) * 2.0;



	vec2 offset = texelSize*1.0 ;

	uv = vec2(uv.x, 1.0 - uv.y);
	float t = time;
	if (t > 1.0) t = 1.0;
	vec4 tex = texture2D(tex0, uv); 
	float v = pow(1.0-rgb2hsv(tex.rgb).b,1.0);


	float nSize = 15.0;
	float nx = (noise(uv*nSize+t*0.01)-0.5) * 1.0 ;/////////////////
	float ny = (noise(uv*nSize+vec2(10.1+t*0.01))-0.5)  * 1.0;
	vec2 randN = vec2(nx,ny);

	uv += randN * pow(t,1.0) * (v*7.0)  * texelSize ;// * texelSize * 300.0 ;


	nSize = 200.0 * smearSize;
	nx = (noise(uv*nSize+t*0.1)-0.3) * 1.0 ;/////////////////
	ny = (noise(uv*nSize+vec2(10.1+t*0.1))-0.3)  * 1.0;
	randN = vec2(nx,ny) - vec2(smearLevel);

	uv += randN * pow(1.0-t,1.0) * (v*3.0*10.0+1.0)  * texelSize * smearLevel * smearDir;// * texelSize * 300.0 ;
	///////



	v *= pow(1.0-time,0.5);
	float rx = (rand(uv+time)-0.5)*1.0* texelSize.x;//////////////////
	float ry = (rand(uv+vec2(0.2)+time)-0.5)*1.0* texelSize.y;
	if (time < 1.0) 
	{
		uv +=  vec2(rx,ry) * texelSize * 26111.5  ;
	}



	nSize = 145.0 ;
	nx = (noise(uv*nSize)-0.5) * 1.0 ;////////////////////////
	ny = (noise(uv*nSize+vec2(10.1))-0.5)  * 1.0;
	float th = 0.003;

	float g = rand((uv+2.0)*100.0 + time*100.0);
	tex = texture2D(tex0, uv ) ;

	tex.rgb += (g-0.5)*0.02;
	tex.rgb = pow(tex.rgb,vec3(1. / 1.007));
	gl_FragColor = tex;
}

