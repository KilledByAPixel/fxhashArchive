// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

// The ray casting concept used in this shader is not novel, however this
// implementation is custom fit to this project, and written from scratch I
// based it off of several implementation I found on ShaderToy.
// https://www.shadertoy.com/view/MldXWB
// https://www.shadertoy.com/view/Xlsfzl

#ifdef GL_ES
    // precision highp float;
    // precision mediump float;
    precision lowp float;
#endif

uniform vec2 u_resolution;
uniform vec2 mxmy;
uniform sampler2D hMapImg;
uniform sampler2D sinImg;
uniform sampler2D cosImg;
uniform sampler2D tanImg;
// uniform sampler2D colorMapTex;
// uniform sampler2D frameTex;
uniform float lightAngle;
uniform float lightHeightAngle;
uniform vec3 lightVector;
uniform float aoMax;
uniform float minH;
uniform float maxH;
uniform float sn;
uniform float cs;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float _mod(float a, float b) {
    return a - (b * floor(a/b));
}

float TAU = 6.28318530718;

float _cos(float a) {
    return cs;
    // return 0.5;
    // // return 1.0;
    // float angleCoord = map(_mod(a, TAU), 0.0, TAU, 0.0, 1.0);
    // vec4 texC = texture2D(cosImg, vec2(angleCoord, 0.0));
    // return (map(floor(texC.r*255.0), 0.0, 255.0, -1.0, 1.0));
}

float _sin(float a) {
    return sn;
    // return 0.5;
    // // return 0.0;
    // float angleCoord = map(_mod(a, TAU), 0.0, TAU, 0.0, 1.0);
    // vec4 texC = texture2D(sinImg, vec2(angleCoord, 0.0));
    // return map(floor(texC.r*255.0), 0.0, 255.0, -1.0, 1.0);
}

float _tan(float a) {
    return 1.0;
    float angleCoord = map(_mod(a, TAU), 0.0, TAU, 0.0, 1.0);
    vec4 texC = texture2D(tanImg, vec2(angleCoord, 0.0));
    return map(texC.r, 0.0, 1.0, -100.0, 100.0);
}

vec2 PointOnLine(vec2 start, float angle, vec2 length) {
    float x = length.x * _cos(angle);
    float y = length.y * _sin(angle);
    // float x = length.x * lightVector.x/100.0;
    // float y = length.y * lightVector.y/100.0;

    return vec2(start.x + x, start.y + y);
}

vec2 PointOnLine(vec2 start, float angle, float length) {
    float x = length * _cos(angle);
    float y = length * _sin(angle);
    // float x = length * lightVector.x;
    // float y = length * lightVector.y;

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
    return (distance * _tan(LightAngleZ) + height);
}

float TraceLight(float LightAngleXY, float LightAngleZ, sampler2D heightMap, vec2 texCoord, vec2 step) {
    vec2 distance;
    float currentHeight;
    float newHeight;
    float rayHeight;

    vec4 texC = texture2D(heightMap, texCoord);
    currentHeight = (texC.r * 65536.0 + texC.g * 256.0 + texC.b) * maxH * 0.5 / (16777215.0);

    for (int i = 1; i < 200; ++i) {
        distance = step * float(i);
        float sx = 0.0001 * float(i);

        newHeight = PixelHeightAtPointOnLine(
            texCoord,
            LightAngleXY,
            distance,
            heightMap) * maxH * 0.5;

        if (newHeight > currentHeight) {
            rayHeight = GetRayHeightAtPoint(currentHeight, LightAngleZ, sx);
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
        float slope = (there - here) / float(i+1) * 100.0;
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

    float ha = map(PixelHeightAtPoint(v1, hMapImg), 0.0, 1.0, minH, maxH);
    float hb = map(PixelHeightAtPoint(v2, hMapImg), 0.0, 1.0, minH, maxH);
    float hc = map(PixelHeightAtPoint(v3, hMapImg), 0.0, 1.0, minH, maxH);
    float hd = map(PixelHeightAtPoint(v4, hMapImg), 0.0, 1.0, minH, maxH);

    vec3 a = vec3(coords.x - offset, 0.0, ha * intensity);
    vec3 b = vec3(coords.x + offset, 0.0, hb * intensity);
    vec3 c = vec3(0.0, coords.y + offset, hc * intensity);
    vec3 d = vec3(0.0, coords.y - offset, hd * intensity);

    return normalize(cross(b-a, c-d));
}

void main() {
    vec2 texCoord = vec2(gl_FragCoord.x / u_resolution.x, 1.0 - gl_FragCoord.y / u_resolution.y);
    vec2 onePixel = vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y);

    vec3 normal = getNormal(texCoord, 5000.0);
    // vec3 lightVector = normalize(vec3(_cos(lightAngle), _sin(lightAngle), 1.0));
    // float shading = max(dot(normal, lightVector), 0.0) + 0.5;
    float shading = pow(max(dot(normal, vec3(lightVector.x/100.0, lightVector.y/100.0, lightVector.z/100.0)), 0.0) + 0.5, 2.0);
    // float highlights = pow(
    //     clamp(
    //         dot(normal, normalize(vec3(lightVector.x, lightVector.y, 5.0))),
    //         0.0,
    //         1.0
    //     ),
    //     400.0
    // );

    float e = 2.71828;
    float pi = 3.14159265359;

    float shadowBr = 0.0;
    const int nShadows = 2;
    float lightHeight = lightHeightAngle;

    float shadowBlur = 0.5;
    shadowBr += TraceLight(lightAngle, lightHeight, hMapImg, texCoord, 1.0 * onePixel);
    // shadowBr += TraceLight(lightAngle, lightHeight, hMapImg, texCoord + vec2(onePixel.x * shadowBlur, 0.0), 1.0 * onePixel);
    // shadowBr += TraceLight(lightAngle, lightHeight, hMapImg, texCoord + vec2(-onePixel.x * shadowBlur, 0.0), 1.0 * onePixel);
    // shadowBr += TraceLight(lightAngle, lightHeight, hMapImg, texCoord + vec2(0.0, onePixel.y * shadowBlur), 1.0 * onePixel);
    // shadowBr += TraceLight(lightAngle, lightHeight, hMapImg, texCoord + vec2(0.0, -onePixel.y * shadowBlur), 1.0 * onePixel);
    // shadowBr /= 5.0;
    
    float aoShadow = 0.0;

    float clampMax = 4.0;
    float clampMin = 0.0;
    const int nAOs = 16;
    for (int i=0; i<nAOs; i++) {
        float angle = (float(i) / float(nAOs)) * 2.0 * pi;
        float aoi = AOLight(angle, hMapImg, texCoord, onePixel);
        // float aoShadowi = 2.0 - clamp(map(aoi, clampMin, clampMax, 0.0, aoMax), 0.0, 1.0);
        float aoShadowi = 2.0 - pow(e, clamp(map(aoi, clampMin, clampMax, 0.0, aoMax), 0.0, 1.0));
        aoShadow += aoShadowi;
    }

    aoShadow = clamp(aoShadow / float(nAOs), 0.0, 1.0);

    // vec4 color = texture2D(hMapImg, texCoord);
    // float currentHeight = 255.0*(texC.r * 256.0*256.0 + texC.g * 256.0 + texC.b) / (16777215.0);
    // vec4 color = vec4(currentHeight, currentHeight, currentHeight, 1.0);

    vec4 color = vec4(1.0, 1.0, 1.0, 1.0); // white
    
    // vec4 color = texture2D(colorMapTex, texCoord);
    gl_FragColor.rgb = color.rgb;
    // gl_FragColor.r *= _sin(texCoord.x*TAU);
    // gl_FragColor.a = 1.0;

    // vec3 shadowCol = vec3(0.0, 0.0, 1.0);
    // vec3 highlightCol = vec3(1.0, 0.0, 0.0);

    // gl_FragColor.rgb = mix(
    //     color.rgb,
    //     mix(
    //         shadowCol,
    //         highlightCol,
    //         clamp(map(shading, 0.5, 1.5, 0.0, 1.0), 0.0, 1.0)
    //     ),
    //     1.0
    // ) * (shading*0.5 + 0.5);
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0, 1.0, 1.0), highlights * 0.5);
    // gl_FragColor.rgb *= (aoShadow*0.5 + 0.5);
    // gl_FragColor.rgb = mix(shadowCol * 0.0005, gl_FragColor.rgb, shadowBr) * (shadowBr*0.5 + 0.5);

    gl_FragColor.rgb *= (shading*0.7 + 0.3);
    gl_FragColor.rgb *= (aoShadow*0.5 + 0.5);
    gl_FragColor.rgb *= shadowBr;
}