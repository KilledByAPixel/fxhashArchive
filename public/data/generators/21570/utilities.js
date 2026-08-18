
//-------------------------------------
//UTILITY FUNCTIONS
//-------------------------------------
//reflect a point across a plane
function reflect3d(_p,_mFace)
{
  let retV = new p5.Vector(0,0,0);
  let mFace = new Face(_mFace.facePts[0],_mFace.facePts[1],_mFace.facePts[2]);

  //planeVectors
  let pv0 = new p5.Vector(mFace.facePts[0].x,mFace.facePts[0].y,mFace.facePts[0].z);
  let pv1 = p5.Vector.sub(mFace.facePts[1],mFace.facePts[0]);
  let pv2 = p5.Vector.sub(mFace.facePts[2],mFace.facePts[0]);

  let myNormal = pv2.cross(pv1);
  //gTestNorm = new p5.Vector(myNormal.x,myNormal.y,myNormal.z);
  //gTestNorm.normalize();
  //gTestNorm.mult(20);
  myNormal.normalize();
  
  gTestPV0 = pv0;
  gTestPV1 = pv1;
  gTestPV2 = pv2;
  
  //create vector between plane origin and the point
  if(_p.dist(mFace.facePts[0]) == 0 || _p.dist(mFace.facePts[1]) == 0 || _p.dist(mFace.facePts[2]) == 0) {
    retV.x = _p.x;
    retV.y = _p.y;
    retV.z = _p.z;
  }
  else {
    let pvR = p5.Vector.sub(_p,mFace.facePts[0]);

    let ang =Math.abs(pvR.angleBetween(myNormal));
    
    //Parallel
    //cross product of point vector and surface normal
    let cross1 = pvR.cross(myNormal);
    cross1.normalize();
    cross1.mult(20);
    testCross1 = new p5.Vector(cross1.x,cross1.y,cross1.z);
    cross1.normalize();
    
    //cross product of cross1 and surface normal
    let parallelV = myNormal.cross(cross1);
    parallelV.normalize();
    //find proper length
    parallelV.mult(pvR.mag()*sin(ang));

    //perpendicular component
    //length of pvR*cos(ang) along plane normal
    myNormal.normalize();
    
    myNormal.mult(pvR.mag()*cos(ang));
    let perpV = new p5.Vector(myNormal.x,myNormal.y,myNormal.z);
    
    //tests
    //testPvR = new p5.Vector(pvR.x,pvR.y,pvR.z);
    //testParallelV = new p5.Vector(parallelV.x,parallelV.y,parallelV.z);
    //testPerpV = new p5.Vector(perpV.x,perpV.y,perpV.z);

    //Reflect the point
    //-P*Va*P
    perpV.mult(-1.0);
    retV.x = perpV.x;
    retV.y = perpV.y;
    retV.z = perpV.z;
    
    retV1 = new p5.Vector(retV.x,retV.y,retV.z);

    retV.add(parallelV);
    
    retV2 = new p5.Vector(retV.x,retV.y,retV.z);
    
    retV.add(pv0);
    
    retV3 = new p5.Vector(retV.x,retV.y,retV.z);
  }
  return retV;
}


function scale3d( v, b, s) { //point to scale, point to scale about, scale factor
  let retV = new p5.Vector(0,0,0);

  //move everthing to the origin
  /*
  retV.x = v.x.add(-1*b.x);
  retV.y = v.y.add(-1*b.y);
  retV.z = v.z.add(-1*b.z);

  retV.x = (retV.x * s);
  retV.y = (retV.y * s);
  retV.z = (retV.z * s);

  //move it back into place
  retV.x = retV.x.add(b.x);
  retV.y = retV.y.add(b.y);
  retV.z = retV.z.add(b.z);
  */

   
  retV.x = v.x + (-1*b.x);
  retV.y = v.y + (-1*b.y);
  retV.z = v.z + (-1*b.z);

  retV.x = (retV.x * s);
  retV.y = (retV.y * s);
  retV.z = (retV.z * s);

  //move it back into place
  retV.x = retV.x + (b.x);
  retV.y = retV.y + (b.y);
  retV.z = retV.z + (b.z);
  

  /*
 let neg = b.mult(-1.0);

  retV = v.add(neg);
  retV.mult(s);
  retV.add(b);
*/

  return retV;
}

// Vertices Centroid
// in:  an array of vertices
// out: the centroid of them
function vertex_average( vertices )
{
  let retV = new p5.Vector(0,0,0);
  for (let i=0; i<vertices.length; i++) {
    retV.x = retV.x + vertices[i].x;
    retV.y = retV.y + vertices[i].y;
    retV.z = retV.z + vertices[i].z;
  }
  let total = vertices.length;
  retV.x = retV.x / total;
  retV.y = retV.y / total;
  retV.z = retV.z / total;
  
  return retV;
}

function faceNormal(vs,goCenter){ //face pts, go center
           let faceCenter = vertex_average(vs);
           let v1 = createVector(vs[0].x, vs[0].y, vs[0].z);
           let v2 = createVector(vs[1].x, vs[1].y, vs[1].z);
           let v3 = createVector(vs[2].x, vs[2].y, vs[2].z);
           let s1 = p5.Vector.sub(v2,v1);
           let s2 = p5.Vector.sub(v3,v1);
           let myNorm = p5.Vector.cross(s1,s2);
           myNorm.normalize();
           //console.log("myNorm = " + myNorm);
           //check normal direction, make if face "out"
           let myDist = goCenter.dist(faceCenter);
           let add = p5.Vector.add(faceCenter, myNorm);
 
           if( goCenter.dist(add) < myDist ){
             myNorm.mult(-1.0);
           }
 
           /*
           //test
           add = p5.Vector.add(faceCenter, myNorm);
           push();
           translate(add.x,add.y,add.z)
           //translate(faceCenter.x,faceCenter.y,faceCenter.z);
           sphere(2);
           pop();  
           */  
          return myNorm;
}
