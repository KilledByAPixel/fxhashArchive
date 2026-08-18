// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

let A = {
    // user defined settings
    s: {
        frames: 120,
        keyframes: [],
        quality: 400,
        timelinePos: 0,
        smokeSpeed: 0,
    },

    // curve: (x) => Math.pow(Math.abs(Math.sin(Math.PI * x / 2.0)), 2.5),
    curve: (x) => x,

    // internal
    animating: false,
    frame: 0,
}

A.animParams = () => {
    return {
        buildLevel: f.buildLevel,
        smokeOffset: f.smokeOffset,
        shapeAngle: f.shapeAngle,
        twist: f.twist, twistIntensity: f.twistIntensity,
        lightR: f.lightR, lightPhi: f.lightPhi, lightTheta: f.lightTheta,
        cameraZ: f.cameraZ, cameraY: f.cameraY,
        fixedFocalDistance: f.fixedFocalDistance
    }
}

A.refreshGUI = () => {
    gui.controllersRecursive().forEach(c => {
        c.updateDisplay();
    });
}

let agui;

A.setup = () => {

    if (params.pinSettings) {
        A.s = JSON.parse(localStorage.getItem('A.s'));
    }
    else {
        A.s.keyframes[0] = A.animParams();
        A.s.keyframes[1] = A.animParams();
        A.s.keyframes[1].shapeAngle += Math.PI * 2;
    }

    agui = gui.addFolder('animate');
    agui.add(A.s, 'frames').min(1).max(600);
    agui.add(A.s, 'quality').min(8).max(2000);
    agui.p = agui.add(A.s, 'timelinePos').min(0).max(1).listen().onChange(A.updateTimelinePos);
    agui.add(A, 'setStart');
    agui.add(A, 'setEnd');
    agui.add(A, 'render');
    agui.close();
}

A.updateTimelinePos = (v) => {
    A.frame = v * A.s.frames;
    A.step();
}

A.setStart = () => {
    console.log('Set start params')
    A.s.keyframes[0] = A.animParams();
    A.s.timelinePos = 0;
}

A.setEnd = () => {
    console.log('Set end params')
    A.s.keyframes[1] = A.animParams();
    A.s.timelinePos = 1;
}

A.render = () => {
    A.frame = 0;

    params.shareGPU = false;

    A.step(0);

    A.animating = true;
}

// Runs every render iteration
A.animate = () => {
    if (!A.animating) { return; }

    if (frameCount >= A.s.quality) {
        A.saveImage(A.frame);
        A.step();
    }
}

A.lerp = (a, b, p) => a + (b - a) * A.curve(p);

A.step = () => {

    const p = A.s.timelinePos = A.frame / A.s.frames;

    // Stop if done
    if (A.s.timelinePos > 1.0) {
        A.s.timelinePos = 1.0;
        A.animating = false;
        params.shareGPU = true;
        A.refreshGUI();
        if (A.s.webm && !A.previewMode) A.saveVideo();
        return;
    }

    console.log(`A: ${A.frame} / ${A.s.frames}`);

    const from = A.s.keyframes[0];
    const to = A.s.keyframes[1];
    for (const [key, value] of Object.entries(from)) {
        const x = A.lerp(value, to[key], p);
        f[key] = x;
        if (key == 'lightTheta' || key == 'lightPhi' || key == 'lightR') {
            setCartesianLightCoords();
        }
    }
    A.refreshGUI();

    A.frame++;

    frameCount = 0;  // restart render
}

A.saveImage = (frame) => {
    let a = document.createElement('a');
    a.setAttribute('download', A.fileName(frame));
    let url = gl.canvas.toDataURL('image/png').replace(/^data:image\/png/, 'data:application/octet-stream');
    a.setAttribute('href', url);
    a.click();
}


A.fileName = (frame) => {
    const d = new Date();
    const y = String(d.getFullYear()).slice(2, 4);
    return `${fxhash}-${y}-${d.getMonth()}-${d.getDate()}-${frame}.png`;
}
