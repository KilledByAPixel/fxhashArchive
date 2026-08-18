function pan() {
  let dx = mouseX - prevMouseX;
  let dy = mouseY - prevMouseY;

  panX += dx;
  panY += dy;
  
  let bx = 0.99*(w_scarf)/2;
  let by = 0.99*(height)/2;
  let z = map(zoom,min_zoom,max_zoom,0,max_zoom);   

  panX = constrain(panX, -bx * z, bx * z);
  panY = constrain(panY, -by * z, by * z);
   
  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

function mousePressed() {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    isPanning = true;
  }
  
  function mouseReleased() {
    isPanning = false;
  }
  
  function mouseWheel(event) {
    let scaleFactor = 0.025;
    if (event.delta > 0) {
      zoom -= scaleFactor;
    } else {
      zoom += scaleFactor;
    }
  
    zoom = constrain(zoom, min_zoom, max_zoom);
  
    let bx = 0.99*(width)/2;
    let by = 0.99*(height)/2;
    let z = map(zoom,min_zoom,max_zoom,0,max_zoom);   
  
    panX = constrain(panX, -bx * z, bx * z);
    panY = constrain(panY, -by * z, by * z);
     
     
    return false; 
  }

  function windowResized() {
    createCanvas(windowWidth, windowHeight, WEBGL);  
    zoom = 1;
  }

  let initialDist = null;
  function touchMoved() {
    if (touches.length == 2) { 
      let currentDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
      if (initialDist !== null) {
        let scale = currentDist / initialDist;
        zoom *= scale; 
        zoom = constrain(zoom, min_zoom, max_zoom); 
        initialDist = currentDist; 
      } else {
        initialDist = currentDist;
      }
    }
    return false; 
  }

  function touchEnded() {
    initialDist = null; 
    return false;
  }

  
  