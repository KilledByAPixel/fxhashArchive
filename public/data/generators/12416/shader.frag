// Author: Nathaniel Sarkissian
// Date: May 4, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

// The ray casting concept used in this shader is not novel, however this
// implementation is custom fit to this project, and written from scratch I
// based it off of several implementation I found on ShaderToy.
// https://www.shadertoy.com/view/MldXWB
// https://www.shadertoy.com/view/Xlsfzl

#ifdef GL_ES
    precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 mxmy;
uniform sampler2D hMapTex;
uniform sampler2D colorMapTex;
uniform sampler2D frameTex;
uniform float lightAngle;
uniform float lightHeightAngle;
uniform float aoMax;
uniform float minH;
uniform float maxH;
uniform float windowScale;
uniform vec3 highlightCol;
uniform vec3 shadowCol;
uniform bool lighting;
uniform bool frame;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float random( vec2 p ) {
    vec2 K1 = vec2(
        23.14069263277926,
         2.665144142690225
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

vec2 PointOnLine(vec2 start, float angle, vec2 length) {
    float x = length.x * cos(angle);
    float y = length.y * sin(angle);

    return vec2(start.x + x, start.y + y);
}

vec2 PointOnLine(vec2 start, float angle, float length) {
    float x = length * cos(angle);
    float y = length * sin(angle);

    return vec2(start.x + x, start.y + y);
}

float PixelHeightAtPoint(vec2 texCoord, sampler2D heightMap) {
    vec4 texC = texture2D(heightMap, texCoord);
    return (texC.r * 65536.0 + texC.g * 256.0 + texC.b) / (16777215.0);
}

float PixelHeightAtPointOnLine(vec2 texCoord, float LightAngleXY, float distance, sampler2D heightMap) {
    vec2 newTexCoord = PointOnLine(texCoord, LightAngleXY, distance);
    return PixelHeightAtPoint(newTexCoord, heightMap);
}

float PixelHeightAtPointOnLine(vec2 texCoord, float LightAngleXY, vec2 distance, sampler2D heightMap) {
    vec2 newTexCoord = PointOnLine(texCoord, LightAngleXY, distance);
    return PixelHeightAtPoint(newTexCoord, heightMap);
}

float GetRayHeightAtPoint(float height, float LightAngleZ, float distance) {
    return (distance * tan(LightAngleZ) + height);
}

float TraceLight(float LightAngleXY, float LightAngleZ, sampler2D heightMap, vec2 texCoord, vec2 step) {

    vec2 resFact = vec2(u_resolution.x / 1000.0, u_resolution.y / 1000.0);

    vec2 distance;
    float currentHeight;
    float newHeight;
    float rayHeight;

    vec4 texC = texture2D(heightMap, texCoord);
    currentHeight = (texC.r * 65536.0 + texC.g * 256.0 + texC.b) * maxH * windowScale * 0.5 / (16777215.0);

    for (int i = 1; i < 100; ++i) {
        distance = step * float(i);
        float sx = 0.0001 * float(i);

        newHeight = PixelHeightAtPointOnLine(
            texCoord,
            LightAngleXY,
            distance,
            heightMap) * maxH * windowScale * 0.5;

        if (newHeight > currentHeight) {
            rayHeight = GetRayHeightAtPoint(currentHeight, LightAngleZ, sx);
            float dh = newHeight - rayHeight;
            if (rayHeight <= newHeight) {
                return 0.5;
            }
        }
    }

    return 1.0;
}


float AOLight(float LightAngleXY, sampler2D heightMap, vec2 texCoord, vec2 step) {
    vec2 distance;
    float here;
    float there;

    vec4 texC = texture2D(heightMap, texCoord);
    here = maxH * (texC.r * 65536.0 + texC.g * 256.0 + texC.b) / (16777215.0);
    float maxSlope = 0.0;

    for (int i = 0; i < 10; ++i) {
        distance = step * float(i);
        there = PixelHeightAtPointOnLine(texCoord, LightAngleXY, distance, heightMap) * maxH;
        float slope = (there - here) / float(i+1) * 100.0 * windowScale;
        if (slope > maxSlope) {
            maxSlope = slope;
        }
    }

    return maxSlope * 255.0;
}

vec3 getNormal(vec2 coords, float intensity) {
    float offset = 1.0;

    vec2 v1 = vec2(coords.x - offset / u_resolution.x, coords.y);
    vec2 v2 = vec2(coords.x + offset / u_resolution.x, coords.y);
    vec2 v3 = vec2(coords.x,                           coords.y + offset / u_resolution.y);
    vec2 v4 = vec2(coords.x,                           coords.y - offset / u_resolution.y);

    float ha = map(PixelHeightAtPoint(v1, hMapTex), 0.0, 1.0, minH, maxH);
    float hb = map(PixelHeightAtPoint(v2, hMapTex), 0.0, 1.0, minH, maxH);
    float hc = map(PixelHeightAtPoint(v3, hMapTex), 0.0, 1.0, minH, maxH);
    float hd = map(PixelHeightAtPoint(v4, hMapTex), 0.0, 1.0, minH, maxH);

    vec3 a = vec3(coords.x - offset, 0.0, ha * intensity);
    vec3 b = vec3(coords.x + offset, 0.0, hb * intensity);
    vec3 c = vec3(0.0, coords.y + offset, hc * intensity);
    vec3 d = vec3(0.0, coords.y - offset, hd * intensity);

    return normalize(cross(b-a, c-d));
}

void main() {
    vec2 texCoord = vec2(gl_FragCoord.x / u_resolution.x, 1.0 - gl_FragCoord.y / u_resolution.y);
    vec2 onePixel = vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y);

    vec3 normal = getNormal(texCoord, 5000.0 * windowScale);
    vec3 lightVector = normalize(vec3(cos(lightAngle), sin(lightAngle), 1.0));
    float shading = pow(max(dot(normal, lightVector), 0.0) + 0.5, 2.0);
    float highlights = pow(
        clamp(
            dot(normal, normalize(vec3(lightVector.x, lightVector.y, 5.0))),
            0.0,
            1.0
        ),
        400.0
    );

    float e = 2.71828;
    float pi = 3.14159265359;

    float shadowBr = 0.0;
    const int nShadows = 2;
    float lightHeight = lightHeightAngle;

    float shadowBlur = 0.5;
    shadowBr += TraceLight(lightAngle, lightHeight, hMapTex, texCoord, 1.0 * onePixel);
    shadowBr += TraceLight(lightAngle, lightHeight, hMapTex, texCoord + vec2(onePixel.x * shadowBlur, 0.0), 1.0 * onePixel);
    shadowBr += TraceLight(lightAngle, lightHeight, hMapTex, texCoord + vec2(-onePixel.x * shadowBlur, 0.0), 1.0 * onePixel);
    shadowBr += TraceLight(lightAngle, lightHeight, hMapTex, texCoord + vec2(0.0, onePixel.y * shadowBlur), 1.0 * onePixel);
    shadowBr += TraceLight(lightAngle, lightHeight, hMapTex, texCoord + vec2(0.0, -onePixel.y * shadowBlur), 1.0 * onePixel);
    shadowBr /= 5.0;

    float aoShadow = 0.0;

    float clampMax = 4.0;
    float clampMin = 0.0;
    const int nAOs = 16;
    for (int i=0; i<nAOs; i++) {
        float angle = (float(i) / float(nAOs)) * 2.0 * pi;
        float aoi = AOLight(angle, hMapTex, texCoord, onePixel);
        float aoShadowi = 2.0 - pow(e, clamp(map(aoi, clampMin, clampMax, 0.0, aoMax), 0.0, 1.0));
        aoShadow += aoShadowi;
    }

    aoShadow = clamp(aoShadow / float(nAOs), 0.0, 1.0);

    // vec4 texC = texture2D(hMapTex, texCoord);
    // float currentHeight = 255.0*(texC.r * 256.0*256.0 + texC.g * 256.0 + texC.b) / (16777215.0);
    // vec4 color = vec4(currentHeight, currentHeight, currentHeight, 1.0);

    // vec4 color = vec4(1.0, 1.0, 1.0, 1.0); // white
    
    vec4 color = texture2D(colorMapTex, texCoord);
    gl_FragColor = color;

    if (lighting) {
        gl_FragColor.rgb = mix(
            color.rgb,
            mix(
                shadowCol,
                highlightCol,
                clamp(map(shading, 0.5, 1.5, 0.0, 1.0), 0.0, 1.0)
            ),
            0.001
        ) * (shading*0.5 + 0.5);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 1.0, 1.0), highlights * 0.5);
        gl_FragColor.rgb *= (aoShadow*0.5 + 0.5);
        gl_FragColor.rgb = mix(shadowCol * 0.0005, gl_FragColor.rgb, shadowBr) * (shadowBr*0.5 + 0.5);
    } else {
        gl_FragColor.rgb *= shading;
        gl_FragColor.rgb *= (aoShadow*0.5 + 0.5);
        gl_FragColor.rgb *= shadowBr;
    }
}