//////////////////  Aranda\lasch
//////////////////  Jesse Bassett
/////////////////   5/12/2022 v001

let cam;
let projection = "Perspective";// "Ortho";
let zoom;
let camMove;
let camTheta = 0;
let camPhi = 0;  
let camRho = 8000; 
let dragTheta=0;
let dragPhi=0;
let offsetX = 0;
let offsetY = 0;
//let viewList = [[0,0.01,2500],[Math.PI/4,Math.PI/4,6000],[0,Math.PI/2,3500],[Math.PI/4,Math.PI/2,4000]];
//let viewList = [[Math.PI*5/4,Math.PI/4,6000],[Math.PI/4,Math.PI/4,6000],[Math.PI/4,Math.PI/2,3500],[Math.PI/4,Math.PI/36,4000]];
let viewList = [[Math.PI/4,Math.PI/4,6000],[Math.PI/4,Math.PI/2,3500],[Math.PI/4,0,4000]];
let vCnt = viewList.length;
let zoomMinBound = 500;
let zoomMaxBound = 50000;
let phiMinBound = 0; //5 degrees
let phiMaxBound = Math.PI/2;
 
let fm ; 
   


//function initCam(_t,_p,_r){
function initCam(_l) {
  camTheta = _l[0];
  camPhi = _l[1];
  camRho = _l[2];
  camMove = orientCam(camTheta,camPhi,camRho);
  cam = createCamera();
  cam.perspective(PI / 3.0, width / height, 0.01, 80000);

  if (cams[camIndx].type == "perspective"){
    cam.perspective(PI / 3.0, width / height, 0.01, 80000);
  } else if (cams[camIndx].type == "ortho") { 
    //cam.ortho(-width * zoom, width * zoom, -height * zoom, height * zoom, 0.001, 100000);

    cam.ortho(-1 * zoom, 1 * zoom, -1 * zoom, 1 * zoom, 0.001, 100000);
  } else if (cams[camIndx].type == "frustrum") { 

    //default perspective(); values
    let myFov = PI / 3.0;
    let myAspect = width / height;
    let myNear = 0.1;
    let myFar = 80000;

    //default values for frustrum() call at the end of perspective()
    let ymax = myNear * Math.tan(myFov / 2);//              myNear * Math.tan(myFov);
    let ymin = -ymax;                     //            -myNear * Math.tan(myFov);//-ymax;
    let xmin = ymin * myAspect;           // -myAspect * myNear * Math.tan(myFov);//ymin * myAspect;
    let xmax = ymax * myAspect;  

    let l = xmin;
    let r = xmax;
    let b = ymin * 2 * cams[camIndx].horizon;// (1 - (1 - ((cams[camIndx].horizon - 0.5))));//ymin*(1 - 2/3);  //* 2 * cams[camIndx].horizon;
    let t = ymax * (-2 * cams[camIndx].horizon + 2);// (1 + (cams[camIndx].horizon-0.5));//ymax*(1 + 1/3);
    let n = myNear;
    let f = myFar;

    let X = (2 * n) / (r - l);
    let Y = -(2 * n) / (t - b);
    let A = (r + l) / (r - l);
    let B = (t + b) / (t - b);
    let C = (n + f) / (n - f);
    let D = (2 * f * n) / (n - f);

    fM = [
      X, 0, 0, 0,
      0, Y, 0, 0,
      A, B, C, -1,
      0, 0, D, 0
    ];

    _renderer._curCamera.projMatrix.set(fM);
    _renderer.uPMatrix.set(fM);
  }
 
}

function gimbalCam(){
  cam.camera(camMove[0], camMove[1] - cams[camIndx].height, camMove[2], camMove[3], camMove[4] - cams[camIndx].height,camMove[5],camMove[6],camMove[7],camMove[8]);
  
  if (cams[camIndx].type == "frustrum") {

    //default perspective(); values
    let myFov = PI / 3.0;
    let myAspect = width / height;
    let myNear = 0.1;
    let myFar = 80000;

    //default values for frustrum() call at the end of perspective()
    let ymax = myNear * Math.tan(myFov / 2);//              myNear * Math.tan(myFov);
    let ymin = -ymax;                     //            -myNear * Math.tan(myFov);//-ymax;
    let xmin = ymin * myAspect;           // -myAspect * myNear * Math.tan(myFov);//ymin * myAspect;
    let xmax = ymax * myAspect;

    let l = xmin;
    let r = xmax;
    let b = ymin * 2 * cams[camIndx].horizon;// (1 - (1 - ((cams[camIndx].horizon - 0.5))));//ymin*(1 - 2/3);  //* 2 * cams[camIndx].horizon;
    let t = ymax * (-2 * cams[camIndx].horizon + 2);// (1 + (cams[camIndx].horizon-0.5));//ymax*(1 + 1/3);
    let n = myNear;
    let f = myFar;

    let X = (2 * n) / (r - l);
    let Y = -(2 * n) / (t - b);
    let A = (r + l) / (r - l);
    let B = (t + b) / (t - b);
    let C = (n + f) / (n - f);
    let D = (2 * f * n) / (n - f);

    fM = [
      X, 0, 0, 0,
      0, Y, 0, 0,
      A, B, C, -1,
      0, 0, D, 0
    ];

    _renderer._curCamera.projMatrix.set(fM);
    _renderer.uPMatrix.set(fM);
  }
}

function orientCam(_theta,_phi,_rho,_panX,_panZ){
  let camVector = [];
  let f3 = cos(_theta);
  let f4 = sin(_theta);
  let f6 = cos(_phi+Math.PI/2);
  let f7 = sin(_phi+Math.PI/2);
  let f8 = cos(_theta+Math.PI/2);
  let f9 = sin(_theta+Math.PI/2);
  let camL = createVector(_rho*f3*f7, _rho*f6, _rho*f4*f7);
  let camT = createVector(0,0,0);
  let camD = createVector(_rho*f8,0,_rho*f9);
  let camU = p5.Vector.cross(camL, camD);
  camU.mult(-1);
  camVector = [camL.x,camL.y,camL.z, camT.x, camT.y, camT.z, camU.x, camU.y,camU.z];
  return camVector;
}

/*

function mousePressed() {
  if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){
    offsetX = mouseX;
    offsetY = mouseY;
  }
}

function mouseDragged(event) {
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){
    dragTheta = Math.PI*2*(mouseX-offsetX)/width;
    dragPhi = Math.PI*(mouseY-offsetY)/height;
    let tempT = camTheta + dragTheta;
    let tempP = camPhi + dragPhi;
    if(tempP > Math.PI/2){
       tempP = Math.PI/2;
    }
    else if(tempP < Math.PI/36){
       tempP = Math.PI/36;
    }
    camMove = orientCam(tempT ,tempP,camRho);
    return false;
  }
}

function mouseReleased() {
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0){
    camTheta = camTheta + dragTheta;
    let tempP = camPhi + dragPhi;
    if(tempP > phiMaxBound ){
       tempP =  phiMaxBound;
    }
    else if(tempP < phiMinBound  ){
       tempP = phiMinBound  ;
    }
    //console.log(tempP)
    camPhi = tempP;

    
  }
}

function mouseWheel(event) {
  //if P in Bound then:

  const mouseInCanvas = // disable zooming when not in canvass
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) return;

  camRho = camRho + event.delta;
  if (camRho < zoomMinBound) {
    camRho = zoomMinBound;
  }
  else if (camRho > zoomMaxBound) {
    camRho = zoomMaxBound;
  }
  //print(camRho);
  camMove = orientCam(camTheta, camPhi, camRho);
  //ortho zoom stuff
  zoom = plotMaxsize * 0.00016074 * zoomFactor * camRho;
  //cam = ortho(-width * zoom, width * zoom, -height * zoom, height * zoom, 0.001, 100000);
  //print(zoom);
}
*/




function rArrow(){

  viewOrgIndx++
  if (viewOrgIndx > viewOrg.length - 1) {
    viewOrgIndx = 0;
  }
  camIndx = viewOrg[viewOrgIndx];


  /*//camSWAP
  camIndx++;
  if (camIndx > cams.length - 1) {
    camIndx = 0;
  }
  */


  camTheta = cams[camIndx].O[0];
  camPhi = cams[camIndx].O[1];
  camRho = cams[camIndx].O[2];

  
  //initCam(cams[camIndx].O);
  //console.log(printList[camIndx]);
  //redraw();
  //camMove = orientCam(camTheta,camPhi,camRho);
}

function lArrow(){

  viewOrgIndx--
  if (viewOrgIndx < 0) {
    viewOrgIndx = viewOrg.length - 1;
  }
  camIndx = viewOrg[viewOrgIndx];

  /*//camSWAP
  camIndx--;
  if (camIndx < 0) {
    camIndx = cams.length - 1;
  }
  */
  camTheta = cams[camIndx].O[0];
  camPhi = cams[camIndx].O[1];
  camRho = cams[camIndx].O[2];
  /*
  console.log(camIndx);
  camMove = orientCam(camTheta, camPhi, camRho);
  */

  /////////
  //initCam(cams[camIndx].O);
  //console.log(printList[camIndx]);
  //redraw();
  //camMove = orientCam(camTheta,camPhi,camRho);
}



