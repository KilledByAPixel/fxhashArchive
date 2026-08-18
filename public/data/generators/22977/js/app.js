let effect;
let postEffect;
let canv;
let ctx;
let finishedCanv;
let frame;
let palette = 0;
let accentClr;
let time = 0;
let timeInc = 0.005;

let postFrames = 25;
let finished = false;
let noFinish = false;
let drawDone = false;

let iterations = 3;
let finishIterations = 1;
let currentFinishIteration = 0;

let oriented = false;
let maximumsX = {
    left: Infinity,
    right: -Infinity,
}
let maximumsY = {
    top: Infinity,
    bottom: -Infinity,
}
let xOffset = 0;
let yOffset = 0;
let scaling = 1;

let randomPoints = [];

let paperMult;

let bgColor;

let drawingSpeed = 1;
let removeRandom = true;

let absoluteMouse = { x: 0, y: 0 };
window.addEventListener("mousemove", e => {
    absoluteMouse.x = e.clientX;
    absoluteMouse.y = e.clientY;
});
window.addEventListener("touchmove", e => {
    absoluteMouse.x = e.touches[0].clientX;
    absoluteMouse.y = e.touches[0].clientY;
});
// also on touch start
window.addEventListener("touchstart", e => {
    absoluteMouse.x = e.touches[0].clientX;
    absoluteMouse.y = e.touches[0].clientY;
});

const overlayElement = document.getElementsByClassName("overlay")[0];

// ------------------------------------------
let rotationAmount = 0;
let minDotSize = 0.5;
let maxDotSize = 3;
let xRadMult = 1;
let yRadMult = 1;
let noiseScale = 0;
let noiseStrength = 0;
let randomMag = 0.;
let paddingMult = .85;

let postNoiseMag = 10;
let postNoiseSpeed = 0.001;
let postNoiseMix = 0.;
let postNoiseAngleMult = 1.;
let postBgSplot = false;

let bgMode = 0; // 0 = light, 1 = dark
let xMode = 0; // 0 = noise, 1 = constant

let randomSeed = 0;

// ------------------------------------------

let exporting = false;
let zoomTarget = 1;
let zoomAmount = 1;
let zoomSpeed = 0.1;

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}
let isIOS = iOS();

// custom random function with fxhash support, can randomize arrays, ranges, or just 0-1
function fxRandom(min, max) {
    if (typeof min == "object" && min.length > 0) {
        return min[floor(fxrand() * min.length)];
    }
    else if (min && max) {
        return fxrand() * (max - min) + min;
    }
    else if (min && !max) {
        return fxrand() * min;
    }
    else if (!min && !max) {
        return fxrand();
    }
}

// custom function to reset the hash or get a new one to refresh a generation
function newHash(custom) {
    fxhash = "oo" + Array(49).fill(0).map(_ => alphabet[(Math.random() * alphabet.length) | 0]).join('');
    if (custom) fxhash = custom;
    b58dec = str => [...str].reduce((p, c) => p * alphabet.length + alphabet.indexOf(c) | 0, 0)
    fxhashTrunc = fxhash.slice(2)
    regex = new RegExp(".{" + ((fxhashTrunc.length / 4) | 0) + "}", 'g')
    hashes = fxhashTrunc.match(regex).map(h => b58dec(h))
    sfc32 = (a, b, c, d) => {
        return () => {
            a |= 0; b |= 0; c |= 0; d |= 0
            var t = (a + b | 0) + d | 0
            d = d + 1 | 0
            a = b ^ b >>> 9
            b = c + (c << 3) | 0
            c = c << 21 | c >>> 11
            c = c + t | 0
            return (t >>> 0) / 4294967296
        }
    }
    fxrand = sfc32(...hashes)
}

function preload() {
    // loading the two shader files we will apply to the canvas
    effect = loadShader('./js/effect.vert', './js/effect.frag');
    postEffect = loadShader('./js/effect.vert', './js/post.frag');

    // adding the hue palette to the colors array
    // let hueColors = [];
    // let hueMin = fxRandom(360);
    // let hueMax = fxRandom(hueMin, hueMin + 360);
    // for (let hue = hueMin; hue < hueMax; hue += 360 / 12) {
    //     hueColors.push(hslToHex((hue / 360) % 1, fxRandom(.4, .6), fxRandom(.3, .5)));
    // }
    // colors.push({
    //     name: "hue",
    //     hsl: [],
    //     hex: hueColors,
    //     rgb: [],
    //     bgColors: ["#1d2024", "#EFEFEF"]
    // })


    palette = floor(fxRandom(colors.length));
    rotationAmount = 0;//fxRandom([0, .25, .5, .75, 1, 1.25, 1.5, 1.75, 2]);
    minDotSize = fxRandom(2, 3);
    maxDotSize = fxRandom(minDotSize, minDotSize + 2.5);
    xRadMult = fxRandom(0.5, 1.5);
    yRadMult = fxRandom(0.5, 1.5);
    noiseScale = fxRandom(50, 200);
    noiseStrength = fxRandom(0.1, 10);
    randomMag = fxRandom([0, fxRandom(0.1, 3)]);
    let paddingMultIndex = floor(fxRandom(3));
    paddingMult = [.9, .8, .7][paddingMultIndex];

    xMode = fxRandom() <= .1 ? 1 : 0;
    bgMode = fxRandom([0, 1]);

    paperMult = fxRandom([
        createVector(800, 800),
        createVector(800, 100),
        createVector(100, 800)
    ])

    noFinish = fxRandom() < .05;
    postFrames = floor(fxRandom(15, 50));
    if (noFinish) postFrames = min(postFrames, 15);

    postNoiseMag = fxRandom([fxRandom(15, 50), fxRandom(500, 1000)]);
    postNoiseSpeed = 0.001;
    postNoiseMix = fxRandom([0, .01, .025, .05]);
    postNoiseAngleMult = fxRandom([1, 2, 3, 4, 5, 6, 7]);
    postBgSplot = fxRandom() <= .5;

    let dilutionString = "None";
    if (postNoiseMix == .01) dilutionString = "Very Light";
    if (postNoiseMix == .025) dilutionString = "Light";
    if (postNoiseMix == .05) dilutionString = "Medium";

    let dilutionMovementString = "None";
    if (postNoiseAngleMult > 1) dilutionMovementString = "Low";
    if (postNoiseAngleMult > 3) dilutionMovementString = "Medium";
    if (postNoiseAngleMult > 5) dilutionMovementString = "High";

    let dilutionDurationString = "Low";
    if (postFrames > 25) dilutionDurationString = "Medium";
    if (postFrames > 40) dilutionDurationString = "High";

    window.$fxhashFeatures = {
        "Palette": colors[palette].name,
        "Background": ["Light", "Dark"][bgMode],
        "Background Splotch": (postBgSplot ? "Yes" : "No"),
        "Rough": (noFinish ? "Yes" : "No"),
        "Dilution Amount": dilutionString,
        "Dilution Movement": dilutionMovementString,
        "Dilution Duration": dilutionDurationString,
        "Padding": ["Low", "Medium", "High"][paddingMultIndex],
    }

    console.table(window.$fxhashFeatures);

    // postFrames = floor(fxRandom(10, 200));// fxRandom([10, 15, 20, 25]);
}

function setup() {
    // getting canvas size, and setting a constant one if we are in the preview engine.
    let canvSize = 2000;
    if (isIOS) canvSize = 1000;

    // setting up canvas and hidden canvas for shader
    ctx = createCanvas(canvSize * .75, canvSize, WEBGL);
    frame = createGraphics(canvSize * .75, canvSize);
    canv = createGraphics(width, height, WEBGL);

    // get density from url
    let url = new URL(window.location.href);
    let density = url.searchParams.get("density");
    if (density == null) density = 1;
    if (density) {
        density = parseFloat(density);
        density = min(density, 3);
        pixelDensity(density);
        frame.pixelDensity(density);
        canv.pixelDensity(density);
    }

    // frame.colorMode(HSB, 360, 100, 100, 100);

    // prepare colors from color schemes (comment out when you don't use colors.js!!)
    getColorValues();

    // set a noise seed according to the fxhash
    noiseSeed(floor(fxRandom(1000)));
    randomSeed = fxRandom(100);

    bgColor = fxRandom(colors[palette].hex);
    bgColor = hexToHsl(bgColor);
    bgColor[2] = [0.9, .1][bgMode];
    bgColor[1] = min(bgColor[1], .5);

    if (bgColor[2] == 0.9) removeRandom = true;
    else removeRandom = false;

    frame.blendMode(BLEND);

    bgColor = hslToHex(bgColor[0], bgColor[1], bgColor[2]);

    if (fxRandom() <= .25) bgColor = [colors[palette].bgColors[1], colors[palette].bgColors[0]][bgMode];

    frame.background(bgColor);
    frame.translate(width / 2, height / 2);

    accentClr = fxRandom(colors[palette].hex);

    overlayElement.style.setProperty("--bg-color", bgColor);
    overlayElement.style.setProperty("--color", [colors[palette].bgColors[0], colors[palette].bgColors[1]][bgMode]);

    calculateMaxima();
}

function draw() {
    if (drawDone) {
        if (isFxpreview) fxpreview();

        // set the zoom target higher if the mouse is pressed
        if (mouseIsPressed) zoomTarget = 3.5;
        else zoomTarget = 1;

        // lerp towards the zoom target
        zoomAmount = lerp(zoomAmount, zoomTarget, zoomSpeed);
        if (exporting) zoomAmount = 1;

        // save the current transformation matrix
        push();

        // the mouseX value where the mouse is on the edge of the canvas
        let minMouseX = (window.innerWidth - (window.innerHeight * 0.75)) / 2;

        // constrain the mouseX value to the minMouseX value to fit it in the canvas
        let mX = constrain(absoluteMouse.x, minMouseX, window.innerWidth - minMouseX);
        // remap the mX value to a value between 0 and 1
        mX = map(mX, minMouseX, window.innerWidth - minMouseX, 1, 0);

        let mY = constrain(absoluteMouse.y, 0, window.innerHeight);
        // flip the mY value so that the top of the canvas is 0 and the bottom is 1
        mY = map(mY, 0, window.innerHeight, 1, 0);

        // translate to where the mouse is, taking into account the zoom amount
        let transX = width * (zoomAmount - 1) * mX - width / 2 * (zoomAmount - 1);
        let transY = height * (zoomAmount - 1) * mY - height / 2 * (zoomAmount - 1);

        // make sure the borders of the scaled canvas are not visible
        translate(transX, transY);

        // scale the canvas
        scale(zoomAmount, zoomAmount);

        // show whats stored in finishedCanv on screen
        image(finishedCanv, -width / 2, -height / 2, width, height);

        // restore the transformation matrix
        pop();

        return;
    }

    if (time > TWO_PI * iterations) {
        if (time < TWO_PI * iterations + postFrames) {
            // get the ctx texture and use it in postEffect to call the shader recursively
            canv.shader(postEffect);

            // set uniforms for the shader
            if (time < TWO_PI * iterations + 1) {
                // set the ogTex uniform to the current ctx texture
                let origin = createGraphics(width, height);
                origin.image(ctx, 0, 0, width, height);
                postEffect.setUniform('ogTex', origin);
            }

            postEffect.setUniform("postNoiseMag", postNoiseMag);
            postEffect.setUniform("postNoiseSpeed", postNoiseSpeed);
            postEffect.setUniform("postNoiseMix", postNoiseMix);
            postEffect.setUniform("postNoiseAngleMult", postNoiseAngleMult);

            postEffect.setUniform("randomSeed", randomSeed);
            postEffect.setUniform("frames", time - TWO_PI * iterations);
            postEffect.setUniform("framesMax", postFrames);
            postEffect.setUniform('tex0', ctx);
            postEffect.setUniform('resolution', [width, height]);
            postEffect.setUniform('u_time', frameCount);

            postEffect.setUniform("bgSplot", postBgSplot);

            // color uniforms
            let bgRgb = hexToRgb(bgColor);
            postEffect.setUniform("bgColor", [bgRgb[0] / 255, bgRgb[1] / 255, bgRgb[2] / 255]);
            let accentRgb = hexToRgb(accentClr);
            postEffect.setUniform("accentColor", [accentRgb[0] / 255, accentRgb[1] / 255, accentRgb[2] / 255]);

            // draw a rectangle to cover the whole canvas
            canv.rect(0, 0, width, height);

            // draw the canvas texture to the screen
            image(canv, -width / 2, -height / 2, width, height);

            time++;
            // if (time == TWO_PI * iterations + 10) {
            //     // draw the result to the frame canvas
            //     let img = get();
            //     frame.image(img, 0, 0, width, height);
            // }

            if ((finished && time > TWO_PI * iterations + 2) || // normal finish, doubling over the shape
                (noFinish && time > TWO_PI * iterations + postFrames)) { // no finish, just post effect and no doubling over the shape
                applyShader(ctx, true);
                drawDone = true;

                // save the current canvas in finished
                finishedCanv = createGraphics(width, height);
                finishedCanv.image(ctx, 0, 0, width, height);
                // finishedCanv.pixelDensity(pixelDensity());

                return;
            }
        } else {
            if (!finished) {
                currentFinishIteration++;
                if (currentFinishIteration >= finishIterations) {
                    iterations = 2;
                    finished = true;
                }

                frame.image(ctx, -width / 2, -height / 2, width, height);

                time = 0;
                randomSeed = fxRandom(100);

                // restart the loop
                return;
            }

        }
    } else {
        if (isFxpreview) drawingSpeed = TWO_PI / timeInc;
        for (let i = 0; i < drawingSpeed; i++) {
            frame.push();
            frame.scale(scaling, scaling);

            if (time > TWO_PI * (iterations - 1)) {
                let bgHsl = hexToHsl(bgColor);

                if (bgHsl[2] < .5) frame.blendMode(ADD);
                else frame.blendMode(MULTIPLY);
            } else {
                frame.blendMode(BLEND);
            }

            // draw a noisey circle
            frame.noStroke();
            // frame.fill(colors[palette].bgColors[0]);
            // frame.fill(fxRandom(colors[palette].hex) + "3f");

            let yOff = getVar("y");
            let xOff = getVar("x");
            let radius = getVar("r");
            // radius.mult(map(time, 0, TWO_PI * iterations, 1, .1));

            noiseyCircle(
                xOff + xOffset,
                yOff + yOffset,
                radius,
                noiseScale, noiseStrength, randomMag, 0
            );

            time += timeInc;

            frame.pop();
        }

        // dynamic framerate
        if (!isFxpreview) {
            if (deltaTime > 30) drawingSpeed -= deltaTime;
            else drawingSpeed += 3;

            drawingSpeed = constrain(drawingSpeed, 1, Infinity);
        }

        applyShader();
    }
}

function getVar(varName) {
    if (varName == "x") { // xoff
        let n = getVar("n");
        if (xMode == 0) return map(n, 0, 1, -width * 0.5, width * 0.5);
        if (xMode == 1) return 0;
    }
    else if (varName == "y") { // yoff
        return map(time % TWO_PI, 0, TWO_PI, -height / 3, height / 3);
        // let n = noise(time % TWO_PI, 10);
        // return map(n, 0, 1, -height / 2, height / 2);
    }
    else if (varName == "n") { // noise
        return noise((time % TWO_PI), getVar("y") / height * 4);
    }
    else if (varName == "r") { // radius
        let n = getVar("n");
        xRadMult = map(time % TWO_PI, 0, TWO_PI, 0.5, 2);
        let rad = createVector(abs(width * (noise(getVar("y") / height) / 4) * sin(n * 10)) * xRadMult, abs(height * 0.1 * cos(n * 10)) * yRadMult);
        if (xMode == 1) rad.x *= 2;
        return rad;
        // return createVector(width * .1 * xRadMult, height * .1 * yRadMult);
    }
}


function calculateMaxima() {
    let prevTime = time;

    time = 0;
    // calculate the maximums of the shape, to center it later, make sure to use the radius vector to get the maximums of the shape
    while (time < TWO_PI) {
        let xOff = getVar("x");
        let yOff = getVar("y");
        let radius = getVar("r");

        // take the rotation into account, this rotation controls the rotation of the spheres with a radius of radius.x and radius.y
        let rot = (time % TWO_PI) * rotationAmount; // rotation amount is in radians

        // rotate the radius vector
        radius.rotate(rot);
        radius.x = abs(radius.x);
        radius.y = abs(radius.y);

        // calculate the maximums
        if (xOff + radius.x > maximumsX.right) maximumsX.right = xOff + radius.x;
        if (xOff - radius.x < maximumsX.left) maximumsX.left = xOff - radius.x;
        if (yOff + radius.y > maximumsY.bottom) maximumsY.bottom = yOff + radius.y;
        if (yOff - radius.y < maximumsY.top) maximumsY.top = yOff - radius.y;

        time += timeInc;

        if (fxRandom() <= .01) {
            let angle = fxRandom(TWO_PI);
            let xPos = xOff + radius.x * cos(angle);
            let yPos = yOff + radius.y * sin(angle);
            randomPoints.push({ x: xPos, y: yPos, angle: angle });
        }
    }

    oriented = true;
    time = prevTime;

    // calculate the offset to center the shape, using the left and right borders of the shape, and using the distance between them as the width of the shape
    xOffset = -((maximumsX.right - maximumsX.left) / 2 + maximumsX.left);
    yOffset = -((maximumsY.bottom - maximumsY.top) / 2 + maximumsY.top);

    // caluclate the scale to fit the shape in the canvas but leave some space
    let xScale = width / (maximumsX.right - maximumsX.left) * paddingMult;
    let yScale = height / (maximumsY.bottom - maximumsY.top) * paddingMult;
    scaling = min(xScale, yScale);

    // DEBUG:: draw lines on the frame canvas to see the borders of the shape
    // frame.push();
    // frame.translate(xOffset, yOffset);
    // frame.stroke(255, 0, 0);
    // frame.line(maximumsX.left, maximumsY.top, maximumsX.right, maximumsY.top);
    // frame.line(maximumsX.left, maximumsY.bottom, maximumsX.right, maximumsY.bottom);
    // frame.line(maximumsX.left, maximumsY.top, maximumsX.left, maximumsY.bottom);
    // frame.line(maximumsX.right, maximumsY.top, maximumsX.right, maximumsY.bottom);
    // frame.pop();

    // draw the shape from randomPoints
    // frame.noFill();
    // for (let i = 1; i < randomPoints.length; i++) {
    //     // draw a line between the points
    //     frame.stroke(colors[palette].hex[floor(map(randomPoints[i].angle, 0, TWO_PI, 0, colors[palette].hex.length))]);
    //     frame.strokeWeight(1);
    //     frame.line(randomPoints[i - 1].x, randomPoints[i - 1].y, randomPoints[i].x, randomPoints[i].y);
    // }
}

function keyTyped() {
    // save image on spacebar
    if (key == " ") {
        exportCurrent();
    }

    if (key == "m") {
        // open the overlay
        overlayElement.classList.toggle("hidden");
    }
}

function exportCurrent() {
    exporting = true; // to turn off the zooming
    setTimeout(() => {
        save("Circumscript-" + fxhash);
        exporting = false;
    }, 100);
}

function doubleClicked() {
    overlayElement.classList.toggle("hidden");
}

function applyShader(tex = frame, f = false) {
    if (f) console.log("finishing");
    // setting uniforms and applying shader to frame canvas, then displaying the "shadered" frame canvas onto the visible canvas
    effect.setUniform("tex0", tex);
    effect.setUniform("u_time", frameCount * 0.01);
    let bgRgb = hexToRgb(bgColor);
    effect.setUniform("borderColor", [bgRgb[0] / 255, bgRgb[1] / 255, bgRgb[2] / 255]);
    let accentRgb = hexToRgb(accentClr);
    effect.setUniform("accentColor", [accentRgb[0] / 255, accentRgb[1] / 255, accentRgb[2] / 255]);
    effect.setUniform("finished", f);
    effect.setUniform("removeRandom", removeRandom);
    effect.setUniform("paperMult", [paperMult.x, paperMult.y]);
    effect.setUniform("randomSeed", randomSeed);
    shader(effect);
    rect(-width / 2, -height / 2, width, height);
}

function noiseyCircle(x, y, radius, noiseScale, noiseStrength, randomMag, noiseOffset) {
    // drawing a circle made of dots that move according to noise
    let angle = 0;
    let angleStep = 360 / 100;
    if (angleStep < 0) angleStep = 0.1;
    let noiseStep = 0.01;

    frame.noFill();
    // let colorIndex = floor(map(noise(xPos / width * 10, yPos / height * 10, angle / angleStep + (time % TWO_PI) / TWO_PI * 100), 0, 1, 0, colors[palette].hex.length));
    let colorIndex = floor(fxRandom(colors[palette].hex.length))
    // let colorIndex = floor(noise(time / TWO_PI * 10) * colors[palette].hex.length);
    frame.stroke(colors[palette].hex[colorIndex] + "1f");
    if (time > TWO_PI * (iterations - 1)) frame.stroke(colors[palette].hex[colorIndex] + "0a");
    // if (fxRandom() <= .01) frame.fill(colors[palette].hex[colorIndex] + "1f");

    frame.beginShape();
    frame.push();
    frame.translate(x, y);
    // frame.rotate(noise(time % TWO_PI) * TWO_PI);
    frame.rotate((time % TWO_PI) * rotationAmount);
    while (angle < 360) {
        let n = noise((cos(radians(angle)) + 1) * noiseScale, (sin(radians(angle)) + 1) * noiseScale, noiseOffset) * noiseStrength;
        let nx = cos(radians(angle)) * (radius.x + n);
        let ny = sin(radians(angle)) * (radius.y + n);

        let randomOffset = createVector(fxRandom(-randomMag, randomMag), fxRandom(-randomMag, randomMag));

        let xPos = nx;
        let yPos = ny;

        let dotSize = fxRandom(minDotSize, maxDotSize);
        frame.vertex(xPos, yPos);

        frame.push();
        let colorIndex = floor(map(noise(xPos / width * 10, yPos / height * 10, angle), 0, 1, 0, colors[palette].hex.length));
        colorIndex = floor(map((time + noise(0) * TWO_PI) % TWO_PI, 0, TWO_PI, 0, 1) * colors[palette].hex.length);
        colorIndex += (angle / 360 + time / TWO_PI) * colors[palette].hex.length;
        colorIndex = floor(colorIndex) % colors[palette].hex.length;

        let mixedColor = colors[palette].hex[colorIndex];

        // let mixedColor = lerpColor(color(colors[palette].hex[prevColorIndex]), color(colors[palette].hex[colorIndex]), (time % TWO_PI) / TWO_PI);
        // mixedColor = rgbToHex(floor(mixedColor.levels[0]), floor(mixedColor.levels[1]), floor(mixedColor.levels[2]));

        frame.fill(mixedColor + "1a");
        if (time > TWO_PI * (iterations - 1)) frame.fill(mixedColor + "0a");
        frame.noStroke();
        frame.ellipse(xPos + randomOffset.x, yPos + randomOffset.y, dotSize, dotSize);
        // frame.fill("#FFFFFF" + "0a");
        // frame.ellipse(xPos + randomOffset.x + 3, yPos + randomOffset.y + 3, dotSize, dotSize);
        // frame.fill("#000000" + "0a");
        // frame.ellipse(xPos + randomOffset.x - 3, yPos + randomOffset.y - 3, dotSize, dotSize);
        frame.pop();

        angle += angleStep;
    }
    frame.endShape(CLOSE);
    frame.pop();
}

function updateURLParameter(url, param, paramVal) {
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function changeDensity() {
    // read density value from #densityOptions
    let density = document.getElementById("densityOptions").value;
    // reload window with density=x to the url
    var newURL = updateURLParameter(window.location.href, 'density', density);
    window.history.replaceState('', '', newURL);
    window.location.reload();
}