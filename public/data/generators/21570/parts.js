//--------------------------
//Octahedra edge
//--------------------------
class Edge
{
  constructor(_start, _end){
    this.start = _start;
    this.end = _end;
  }
}


//--------------------------
//A triangular face
//--------------------------
class Face
{
  constructor(_pt1, _pt2, _pt3, _type){
    this.type = _type;
    this.facePts = [];
    this.center = new p5.Vector();
    
    this.facePts[0] = createVector(_pt1.x,_pt1.y,_pt1.z);
    this.facePts[1] = createVector(_pt2.x,_pt2.y,_pt2.z);
    this.facePts[2] = createVector(_pt3.x,_pt3.y,_pt3.z);
    
    this.center = vertex_average(this.facePts);
    this.normal = p5.Vector.sub(this.facePts[1], this.facePts[0]).cross(p5.Vector.sub(this.facePts[2], this.facePts[0]));
    this.normal.mult(-1);//don't know why its not pointing the right way
    this.normal.normalize();
  }
}
  
