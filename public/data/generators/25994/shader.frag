precision mediump float;

// thank you adam ferriss + book of shaders + Morgan McGuire (noise + fbm)

varying vec2 vTexCoord;

uniform sampler2D u_imageInput;
uniform float u_time;
uniform float u_random_cycle_half;
uniform float u_default_aspect_ratio;
uniform float u_actual_aspect_ratio;

uniform float u_r1;
uniform float u_r2;
uniform float u_r3;
uniform float u_r4;
uniform int u_rOctaves;

// different machines/gpus handle floats a little differently, so this should make it a bit more consistent
// mainly to ensure preview images on fxhash are pretty close to what you see.
float jclean(float x) {
    return float(int(x * 1000.)) / 1000.;
}

float jsin(float x) {
    return jclean(sin(x));
}

float random(vec2 st) {
    return jclean(fract(jsin(dot(st.xy, vec2(12.9 + u_r1, 78.2 + u_r2))) *
        43.) + u_r3);
}

float randomSimple(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9, 78.2))) *
        43642.4);
}

float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1., 0.0));
    float c = random(i + vec2(0.0, 1.));
    float d = random(i + vec2(1., 1.));

    vec2 u = f * f * (3.0 - (2.) * f);

    return mix(a, b, u.x) +
        (c - a) * u.y * clamp(1.0 - u.x, 0., 1.) +
        (d - b) * u.x * u.y;
}

#define MAX_OCTAVES 1000
float fbm(in vec2 st) {
    float value = 0.0;
    float amplitude = 0.5 + u_r4;

    for(int i = 0; i < MAX_OCTAVES; i++) {
        if(i >= u_rOctaves) {
            break;
        }
        value += amplitude * noise(st);
        st *= 2.2 + u_r3 / 4.;
        amplitude *= .4;
    }
    return value;
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;
    float center = 0.5;
    float distanceFromCenterX = abs(uv.x - 0.5);
    if(u_actual_aspect_ratio <= u_default_aspect_ratio) {
        if(uv.x <= center) {
            uv.x = (center - distanceFromCenterX * (u_default_aspect_ratio / u_actual_aspect_ratio));
        } else {
            uv.x = (center + distanceFromCenterX * (u_default_aspect_ratio / u_actual_aspect_ratio));
        }
    }
    uv.y = mod(fbm(uv) + u_time / 10000., 1.);
    if(u_actual_aspect_ratio <= u_default_aspect_ratio) {
        if(uv.x <= center) {
            uv.x = (center - distanceFromCenterX / 2.);
        } else {
            uv.x = (center + distanceFromCenterX / 2.);
        }
    }

    vec4 tex = texture2D(u_imageInput, uv);

    vec2 nc = vTexCoord;
    nc.x = mod(nc.x + u_random_cycle_half, 1.);
    nc.y = mod(nc.y + u_random_cycle_half * u_r1, 1.);
    float noise = (randomSimple(nc) - 0.9) / 9.2;

    vec3 noiseRGB = clamp(tex.rgb + noise, 0., 1.);
    gl_FragColor = vec4(noiseRGB, 1.0);
}
