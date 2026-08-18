// Chrysalis
// Copyright (c) 2022 Arsiliath & Monotau

"use strict";

// Params are things that are GUI specific
// things that wouldn't be animated or styled
const savedParams = JSON.parse(localStorage.getItem('params'));
const defaultParams = {
    pinSettings: false,
    hq: false,
    shareGPU: true,
    smokeSpeed: 0,
}
var params = savedParams || defaultParams;
for (const [key, value] of Object.entries(defaultParams)) {
    params[key] ||= value;
    for (const [key2, value2] of Object.entries(value)) {
        params[key][key2] ||= value2;
    }
}
params.realtime = false;

let gui;

const toggleGUI = () => {
    if (JSON.parse(localStorage.getItem('showGUI'))) {
        localStorage.setItem('showGUI', false);
        gui.hide()
    } else {
        localStorage.setItem('showGUI', true);
        gui.show()
    }
}

const guiTools = {
    resolution: new URLSearchParams(window.location.search).get('height') || 'auto',
    save: () => {
        download();
    },
    setResolution: () => {
        const params = new URLSearchParams(window.location.search);
        if (guiTools.resolution == 'auto') {
            params.delete('height')
        } else {
            params.set('height', guiTools.resolution);
        }
        window.location.search = params;
    },
    togglePause: () => {
        play = !play;
        if (play && !animating) {
            requestAnimationFrame(render);
        }
    },
    pause: () => {
        guiTools.togglePause();
        gui.pause.hide();
        gui.resume.show();
    },
    resumeRender: () => {
        guiTools.togglePause();
        gui.resume.hide();
        gui.pause.show();
    }
}

const onGUIChange = (event) => {
    if (event.property == 'pinSettings') {
        if (!params.pinSettings) { unPinSettings(); }
    }
    else if (event.property != 'realtime' && event.property != 'shareGPU') {
        restartRender(event.property);
    }

    // Save if pinned
    if (params.pinSettings) { pinSettings(); }
}

const setupGUI = () => {
    gui = new lil.GUI({ title: '', width: 300, container: document.querySelector('#gui') });
    if (!JSON.parse(localStorage.getItem('showGUI'))) gui.hide()
    gui.onChange(onGUIChange);


    // SETTINGS
    gui.add(params, 'pinSettings');

    // SHAPE
    const shapeGUI = gui.addFolder('shape');
    if (f.sdfs && !f.sdf_sphere) {
        shapeGUI.add(f, 'metalScale').min(0).max(1.5).step(.01);
    }
    shapeGUI.add(f, 'twistIntensity').min(-2).max(2).step(.01).onChange(e => f.twistIntensity = Math.abs(f.twistIntensity) < .1 ? 0 : f.twistIntensity);
    shapeGUI.add(f, 'buildLevel').min(0).max(1.5).step(.01);
    gui.shapeAngle = gui.add(f, 'shapeAngle');
    gui.shapeAngle.hide();
    shapeGUI.close();

    // LIGHT
    const lightGUI = gui.addFolder('light')
    if (f.lightPhi == undefined) { setSphericalLightCoords(); }

    lightGUI.add(params, 'hq');

    gui.lightBrightness = lightGUI.add(f, 'lightBrightness').min(0).max(2.5).step(.001);

    const lightGUIlights = lightGUI.addFolder('lights')
    lightGUIlights.add(f, 'keyLightR').min(0).max(1).step(.01).listen().onChange(() => balanceLightValues('key'));
    lightGUIlights.add(f, 'rimLightR').min(0).max(1).step(.01).listen().onChange(() => balanceLightValues('rim'));
    lightGUIlights.add(f, 'ambientLightR').min(0).max(1).step(.01).listen().onChange(() => balanceLightValues('ambient'));
    if (f.ground) {
        lightGUIlights.add(f, 'groundLight').min(0).max(2).step(.01);
    }
    lightGUIlights.close();

    lightGUI.add(f, 'lightR').min(10).max(100).step(0.001).onChange(setCartesianLightCoords);
    lightGUI.add(f, 'lightPhi').min(Math.PI * -2).step(0.001).max(Math.PI * 2).onChange(setCartesianLightCoords);
    lightGUI.add(f, 'lightTheta').min(0).max(Math.PI).step(0.001).onChange(setCartesianLightCoords);

    lightGUI.add(f, 'fadeTop');
    lightGUI.add(f, 'vignette');
    lightGUI.close();

    if (!f.bwMode) { lightGUI.add(f, 'sat').min(-.25).max(.5).step(.01); }

    const cameraGUI = gui.addFolder('camera');
    cameraGUI.add(f, 'dof').min(0).max(1).step(0.01)
    cameraGUI.add(f, 'fixedFocalDistance').min(0).max(16).step(0.01)
    cameraGUI.add(f, 'blurEdge');
    cameraGUI.close();

    gui.cameraZ = gui.add(f, 'cameraZ').min(1.5).max(10);
    gui.cameraY = gui.add(f, 'cameraY').min(-1.6).max(6.5);

    gui.cameraZ.hide();
    gui.cameraY.hide();


    const smokeGUI = gui.addFolder('smoke');
    smokeGUI.add(f, 'smokeLevel').min(0).max(1.).step(0.01).onChange((e) => f.smokeEnabled = f.smokeLevel > 0);
    smokeGUI.add(f, 'smokeOffset').min(0).max(10.).step(0.01);
    smokeGUI.close();


    A.setup();

    gui.add(params, 'shareGPU');
    gui.add(guiTools, 'resolution').options(['auto', 1024, 2048, 4096, 8192]).onChange(guiTools.setResolution);
    gui.resume = gui.add(guiTools, 'resumeRender');
    gui.resume.hide();
    gui.pause = gui.add(guiTools, 'pause');
    gui.add(guiTools, 'save');

    gui.canvas = document.querySelector('canvas')
    gui.canvas.addEventListener('mousedown', onMouseDown, false);
    gui.canvas.addEventListener('wheel', onMouseWheel, { passive: false });

    // mobile
    gui.canvas.addEventListener('touchstart', onTouchStart, false);
}

const balanceLightValues = (fixed) => {
    const sum = f.ambientLightR + f.keyLightR + f.rimLightR;
    f.ambientLight = f.ambientLightR / sum;
    f.rimLight = f.rimLightR / sum;
}

const stash = {
    index: localStorage.getItem('stashIndex') || 0,
    load: () => {
        let saved = JSON.parse(localStorage.getItem('stash'));
        if (saved.length == 0) return;
        const settings = saved[stash.index];
        localStorage.setItem('f', JSON.stringify(settings.f));
        localStorage.setItem('style', JSON.stringify(settings.style));
        localStorage.setItem('params', JSON.stringify(settings.params));
        localStorage.setItem('A.s', JSON.stringify(settings['A.s']));
        localStorage.setItem('stashIndex', ++stash.index % saved.length);
        location.reload();
    },
    stash: () => {
        let stash = JSON.parse(localStorage.getItem('stash'));
        stash ||= [];
        let savedParams = structuredClone(params);
        savedParams.pinSettings = true;
        localStorage.setItem('stash', JSON.stringify(stash));
        console.log(stash);
        console.log(`Stashed.`);
    }
}

let gThreadCnt = 0;
const restartRender = (prop) => {
    params.realtime = true;

    if (animating == false) {
        requestAnimationFrame(render)
    }

    gThreadCnt++;
    let currentThreadCnt = gThreadCnt;

    let time = 10;
    if (prop == 'cameraZ' || prop == 'cameraY') {
        time = 500;
    }
    setTimeout(() => {
        if (currentThreadCnt == gThreadCnt) {
            params.realtime = false;
            if (!params.realtime) {
                frameCount = 4;
                play = true;
            } else {
                if (animating == false) {
                    frameCount = 4;
                    play = true;
                    requestAnimationFrame(render)
                }
            }
            gui.controllers[0].updateDisplay()
        }
    }, time);

}

const pinSettings = () => {
    localStorage.setItem('f', JSON.stringify(f));
    localStorage.setItem('style', JSON.stringify(styles[f.styleIndex]));
    localStorage.setItem('params', JSON.stringify(params));
    localStorage.setItem('A.s', JSON.stringify(A.s));
}

const unPinSettings = () => {
    localStorage.removeItem('f');
    localStorage.removeItem('style');
    localStorage.removeItem('params');
    localStorage.removeItem('A.s');
}

const onMouseWheel = (event) => {
    if (!A.animating) {
        // wheelDelta is high on mouse wheel, low on track pad
        const denom = Math.abs(event.wheelDelta) > 100 ? 512.0 : 64;
        let z = f.cameraZ + event.deltaY / denom;

        f.cameraZ = Math.max(gui.cameraZ._min, Math.min(gui.cameraZ._max, z));
        gui.cameraZ.setValue(f.cameraZ);

        event.preventDefault();
        event.stopPropagation();
    }
}

const onMouseDown = (event) => {
    if (!A.animating) {
        gui.mouseDownStartX = event.clientX;
        gui.mouseDownStartY = event.clientY;
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mouseup', onMouseUp, false);

        document.querySelector('body').style.cursor = 'none';
    }
}

const onMouseMove = (event) => {
    if (!A.animating) {
        let r = f.shapeAngle + (gui.mouseDownStartX - event.clientX) / 128.0;
        gui.mouseDownStartX = event.clientX;
        f.shapeAngle = r;
        gui.shapeAngle.setValue(f.shapeAngle);

        let y = f.cameraY - (gui.mouseDownStartY - event.clientY) / 32.0;
        gui.mouseDownStartY = event.clientY;
        f.cameraY = Math.max(gui.cameraY._min, Math.min(gui.cameraY._max, y));
        gui.cameraY.setValue(f.cameraY);
    }
}
const onMouseUp = (event) => {
    window.removeEventListener('mousemove', onMouseMove, false);
    window.removeEventListener('mouseup', onMouseUp, false);
    document.querySelector('body').style.cursor = 'default';
}

const onTouchStart = (event) => {
    if (!A.animating) {
        if (event.touches.length == 1) {
            // Pan
            gui.mouseDownStartX = event.touches[0].clientX;
            gui.mouseDownStartY = event.touches[0].clientY;
            window.addEventListener('touchmove', onTouchMove, false);
            window.addEventListener('touchend', onTouchEnd, false);
        } else {

            // Zoom
            gui.pinchStartDistance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY);
            window.addEventListener('touchmove', onTouchMovePinch, false);
            window.addEventListener('touchend', onTouchEndPinch, false);

        }
    }
}

const onTouchMovePinch = (event) => {
    if (event.touches.length > 1) {
        let currentDist = Math.hypot(
            event.touches[0].pageX - event.touches[1].pageX,
            event.touches[0].pageY - event.touches[1].pageY);

        let z = f.cameraZ * gui.pinchStartDistance / currentDist;

        gui.pinchStartDistance = currentDist;

        f.cameraZ = Math.max(gui.cameraZ._min, Math.min(gui.cameraZ._max, z));
        gui.cameraZ.setValue(f.cameraZ);

        event.preventDefault();
        event.stopPropagation();
    }
}

const onTouchEndPinch = () => {
    window.removeEventListener('touchmove', onTouchMovePinch, false);
    window.removeEventListener('touchend', onTouchEndPinch, false);
}

const onTouchMove = (event) => {
    if (!A.animating) {
        let r = f.shapeAngle + (gui.mouseDownStartX - event.touches[0].clientX) / 128.0;
        gui.mouseDownStartX = event.touches[0].clientX;
        f.shapeAngle = r;
        gui.shapeAngle.setValue(f.shapeAngle);

        let y = f.cameraY - (gui.mouseDownStartY - event.touches[0].clientY) / 32.0;
        gui.mouseDownStartY = event.touches[0].clientY;
        f.cameraY = Math.max(gui.cameraY._min, Math.min(gui.cameraY._max, y));
        gui.cameraY.setValue(f.cameraY);
    }
}

const onTouchEnd = (event) => {
    window.removeEventListener('touchmove', onTouchMove, false);
    window.removeEventListener('touchend', onTouchEnd, false);
    document.querySelector('body').style.cursor = 'default';
}

// Remove default zoom gesture for iOS
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener('gesturechange', function (e) {
    e.preventDefault();
    document.body.style.zoom = 0.99;
});

document.addEventListener('gestureend', function (e) {
    e.preventDefault();
    document.body.style.zoom = 0.99;
});

const setSphericalLightCoords = () => {
    f.lightR = Math.sqrt(f.lightPosX ** 2 + f.lightPosY ** 2 + f.lightPosZ ** 2);
    f.lightPhi = Math.atan2(f.lightPosX, f.lightPosZ);
    f.lightTheta = Math.asin(f.lightPosY / f.lightR);
}

const setCartesianLightCoords = () => {
    f.lightPosX = f.lightR * Math.cos(f.lightTheta) * Math.cos(f.lightPhi);
    f.lightPosY = f.lightR * Math.sin(f.lightTheta);
    f.lightPosZ = f.lightR * Math.cos(f.lightTheta) * Math.sin(f.lightPhi);
}
