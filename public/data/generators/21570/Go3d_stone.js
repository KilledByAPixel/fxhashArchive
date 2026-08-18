class Stone3d{
  constructor(_method,_voronoi,_h,_l,_w,_r,_x,_y,_htemp){
    this.verts = [],
    this.faceIndx = [],
    this.face = [],
    this.uvs = [],
    this.faces = [],
    this.vPts = []




    if(_method == 0){
      let centers  = polyCenter(_voronoi);
      let pts = [];
      let v = [];
      let f =[];
      let vorDist = 0;
      let vorDist2 = [0,0];
      let texPts = [];

      //move voronoi points to origin
      for(let i = 0; i < _voronoi.length ; i++){
         _voronoi[i][0] = _voronoi[i][0] - centers [0];
         _voronoi[i][1] = _voronoi[i][1] - centers [1];

      }
      centers [0] = 0;
      centers [1] = 0;

      //scale voronoi with w,l values

      //2d points
      pts.push(centers);
      for(let i = 0; i < _voronoi.length ; i++){
        pts.push(_voronoi[i]);

        let temp = 0; 
        temp = dist(0,0,_voronoi[i][0],_voronoi[i][1]);
        if(temp > vorDist){
          vorDist = temp;
          vorDist2 = [ _voronoi[i][0], _voronoi[i][1] ];
        }
      }

      //scale voronoi with w,l values
      let pts2 = [];
      for(let i = 0; i < pts.length ; i++){
        pts2[i] = [ pts[i][0] /vorDist *_w/2 ,pts[i][1]/ vorDist *_l/2 ];
        
      //  print(pts[i])
      //  print(vorDist);
      //  print(pts2[i])
      //  print('_____')
      }
      //rotate pts so texture mapping is correct;
      
      pts = [];
      pts=pts2;



      for(let i = 0; i < pts.length ; i++){//top/bottom texture mapping
        //texPts.push(createVector(pts[i][0]/(2*vorDist)+.5,pts[i][1]/(2*vorDist)+.5)); // remap numbers for texture mapping
        texPts.push(createVector(
          //pts[i][0] / (2 * vorDist) + .5,
          //pts[i][1] / (2 * vorDist) + .5,

          pts[i][0] / (_w) + .5,
          pts[i][1] / (_l) + .5,
          
         // pts[i][0] / (2 * vorDist) + .5

          ));
      }

      //VERTICES
      for(let i = 0; i < pts.length ; i++){
        v.push(createVector(pts[i][0] + _x, -_htemp, pts[i][1] + _y) );
        //v[i].x += 0;
        //v[i].y += 0;
        //v[i].y += 0;
      }
      for(let i = 0; i < pts.length ; i++){
        v.push(createVector(pts[i][0] + _x, -_h - _htemp, pts[i][1] + _y) );
        //v[i].x += 0;
        //v[i].y += 0;
        //v[i].z += 0;
      }

      for (let i = 0; i < v.length; i++) {
        //console.log(v[i]);
        let tv = v[i];
        v[i].x = Math.cos(_r / 360 * Math.PI) * tv.x - Math.sin(_r / 360 * Math.PI) * tv.z ;
        v[i].z = Math.sin(_r / 360 * Math.PI) * tv.x + Math.cos(_r / 360 * Math.PI) * tv.z ;
        //console.log(v[i]);
        //console.log(" ");
        
      }




      //FACES
      //bottom
      let a = v.length/2;
      for(let i = 1; i < (a - 1); i++){
        f.push([0,i+1,i]);
        //f.push([0, i, i + 1]);
      }
      f.push([0,1,a - 1]);
      this.vBottom = f.length;//index for texture mapping
      //top
      for(let i = a  ; i < 2*a-2; i++){
        f.push([a,i+2,i+1]);
        //f.push([a, i + 1, i + 2]);
      }
      f.push([a,a+1 ,2*a-1])
      this.vTop = f.length;//index for texture mapping
      // side
      for(let i = 1; i < (v.length/2 - 1); i++){
        f.push([i,a+i,i+1]);
      }
      f.push([a-1,2*a-1,1]);
      this.vSide = f.length;//index for texture mapping
      for(let i = 1; i < (v.length/2 - 1); i++){
        f.push([i+1,a+i,a+i+1]);
      }
      f.push([1,2*a-1,a+1]);
      //this.vSide = f.length;//index for texture mapping

        

      //List of Verts inside new Face for texturemapping
      for(let i = 0; i < f.length; i++){
        this.faces.push(  new Face( v[f[i][0]], v[f[i][1]], v[f[i][2]]  ) );
      }

      for(let i = 0; i < this.vBottom; i++){
        this.vPts.push(  new Face( texPts[f[i][0]], texPts[f[i][1]], texPts[f[i][2]]  ) );
      }


      this.verts = v;
      this.faceIndx= f;

      this.vmDist = vorDist;

      //console.log(this.verts);
      //print('0');
      //print(this.vBottom);
      //print(this.vTop);
      //print(this.vSide);
      //this.vPts = texPts;
      //print(  this.vPts )
    }
  } //end constuctor
} //end class
