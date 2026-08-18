// Copyright © 2022 Brian Gawlik
// See LICENSE.txt for license information


function handleResize() {

    // console.log("resize")

    pageContainer = document.getElementById("pageContainer");
    pageContainer_width  = pageContainer.clientWidth;
    pageContainer_height = pageContainer.clientHeight;

    pageContainer_AR = pageContainer_height/pageContainer_width;

    var canvas_style_height;
    var canvas_style_width;

    if( pageContainer_AR < artboardAR ){
        //console.log("lower than")
        canvas_style_height = pageContainer_height * (1-canvasPad);
        canvas_style_width  = canvas_style_height / artboardAR;
    } else {
        //console.log("greater than")
        canvas_style_width  = pageContainer_width * (1-canvasPad);
        canvas_style_height = canvas_style_width * artboardAR;
    }

    canvas0.style.height = canvas_style_height.toString() + "px";
    canvas0.style.width  = canvas_style_width.toString()  + "px";

    canvas0.height = artboardH; 
    canvas0.width  = artboardW;

    xCenterOffset = 1/artboardAR * xOrigin;
    yCenterOffset = yOrigin;


    for(i=0; i<IMAGES.length; i++) {
        ctx0.drawImage(IMAGES[i], 0, 0, artboardW, artboardH);
    }

}








function sizeCanvasInitial() {

    // console.log("initial sizing")

    pageContainer = document.getElementById("pageContainer");
    pageContainer_width  = pageContainer.clientWidth;
    pageContainer_height = pageContainer.clientHeight;

    pageContainer_AR = pageContainer_height/pageContainer_width;

    var canvas_style_height;
    var canvas_style_width;

    if( pageContainer_AR < artboardAR ){
        //console.log("lower than")
        canvas_style_height = pageContainer_height * (1-canvasPad);
        canvas_style_width  = canvas_style_height / artboardAR;
    } else {
        //console.log("greater than")
        canvas_style_width  = pageContainer_width * (1-canvasPad);
        canvas_style_height = canvas_style_width * artboardAR;
    }

    canvas0.style.height = canvas_style_height.toString() + "px";
    canvas0.style.width  = canvas_style_width.toString()  + "px";

    auxCanvas01.style.height = "0px";
    auxCanvas01.style.width  = "0px";
    auxCanvas02.style.height = "0px";
    auxCanvas02.style.width  = "0px";

    canvas0.height = artboardH; 
    canvas0.width  = artboardW;

    xCenterOffset = 1/artboardAR * xOrigin;
    yCenterOffset = yOrigin;

}