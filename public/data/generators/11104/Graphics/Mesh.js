class Face 
{
	constructor(...args)
	{
		this.m_points = [];	
		this.m_points.push(...args);
		this.m_edges = [];		// reference to the edges of this face
	}
	M_setNormal(x,y,z)
	{
		if(this.m_normal==undefined)
			this.m_normal = new RQVec3();
		this.m_normal.M_set(x,y,z);
		return this;
	}
	// Computes this.m_normal
	// returns true if it's been reversed
	// face.O (optionnal) : local center for normal direction computation
	M_computeNormal(unchecked)
	{	let isReverse=false;
		if(this.m_points.length>=3)
		{
			let N = this.M_getNormalRaw().M_normalize();
			// check direction
			if(!unchecked)
			{	let objN = RQMaths.M_getPointsBarycenter(this.m_points).g;
				if(this.O)
					objN.M_sub(this.O);
				objN.M_normalize();
				if(objN.M_dot(N)<0)
				{	N.M_mul(-1);
					isReverse=true;
				}
			}
			//console.log( "normal dot="+objN.M_dot(N));
			this.M_setNormal(N);
		}
		return this;
	
	}
	M_computeBarycenter()
	{	if(!this.m_g)
		{	let g = RQMaths.M_getPointsBarycenter(this.m_points);
			this.m_g = g.g;
		}
		return this.m_g;

	}
	M_computeAABB(andZRange)
	{
		if(!this.m_aabb)
		{
			var r;
			var nb=this.m_points.length;
			let z;
			for( let i=0; i<nb;i++)
			{	let p = this.m_points[i];
				if( i==0)
				{	r = new RQRectangle(p.m_projected.x,p.m_projected.y,0,0);
					if(andZRange)
						z=this.m_zRange={min:p.m_dEye,max:p.m_dEye}
	
				}
				else
				{	r.M_extend	(p.m_projected.x,p.m_projected.y,0,0);
					if(andZRange)
					{	if(p.m_dEye<z.min)	z.min = p.m_dEye;
						else if(p.m_dEye>z.max)	z.max = p.m_dEye;
					}

				}	
			}
			this.m_aabb=r;		
		}
		return this.m_aabb;

	}
	M_getNormalRaw()
	{
		let AB = this.m_points[1].M_minus(this.m_points[0]);
		let AC = this.m_points[2].M_minus(this.m_points[0]);
		return AB.M_cross(AC);

	}
	M_makeLocalBasis()
	{
		if(this.m_points.length>=3)
		{
			let AB = this.m_points[1].M_minus(this.m_points[0]).M_normalize();
			let AC = this.m_points[2].M_minus(this.m_points[0]).M_normalize();
			let N = AB.M_cross(AC).M_normalize();
			let J = N.M_cross(AB);
			this.m_localBasis = {O: this.m_points[0],I:AB,J:J, K:N};


			//console.log("M_makeLocalBasis normal="+this.m_normal.M_getString()+" N="+this.m_localBasis.K.M_getString());
		}

	}
	M_makeLocalBasisTransformed(MV)
	{
		if( !this.m_localBasis)
			this.M_makeLocalBasis();
		if( !this.m_localBasisTransformed)
		if( MV)
		{	this.m_localBasisTransformed={
			O: MV.M_mutlipliedByVector(this.m_localBasis.O),
			I: MV.M_rotateVector(this.m_localBasis.I),
			J: MV.M_rotateVector(this.m_localBasis.J),
			K: MV.M_rotateVector(this.m_localBasis.K) };

			//console.log("M_makeLocalBasis normalTransformed="+this.m_normalTransformed.M_getString()+" N="+this.m_localBasisTransformed.K.M_getString());

			// compute points coordinates in the new basis
			this.m_localPoints = [];
			for(let i=0; i<this.m_points.length; i++)
			{
				let p0 = MV.M_mutlipliedByVector(this.m_points[i]).M_minus(this.m_localBasisTransformed.O);
				let plocal = new RQVec2(this.m_localBasisTransformed.I.M_dot(p0),this.m_localBasisTransformed.J.M_dot(p0));
				this.m_localPoints.push(plocal);
	

			}

			// debug - draw it 
			//A.M_drawDebugBasis(this.m_localBasisTransformed);

		}

	}


	// v is normalized
	// normalTransformed is available
	// basis = O ( x, v, N)
	M_makeBasisWithVector(O,v)
	{
		let X = v.M_cross(this.m_normalTransformed);
		let Y = this.m_normalTransformed.M_cross(X);
		return {O:O,X:X,Y:Y,Z:this.m_normalTransformed};
	}
	
	M_getProjectedSvgPath()
	{
		if(!this.m_svgPath2D)
		{
			var L = new RQPolyLine();
			for(let i=0; i<this.m_points.length; i++)
				L.M_addPoint( this.m_points[i].m_projected);
			let path = L.M_getSVGPath(false);
			this.m_svgPath2D = new Path2D(path);

		}
		return this.m_svgPath2D;
	}
	
	M_interpolatedEyeDist(P)
	{	//https://codeplea.com/triangular-interpolation
		let n=this.m_points.length;
		let dEye=0;
		if(n>=3)
		{	
			let P1 = this.m_points[0].m_projected;
			let P2 = this.m_points[1].m_projected;
			let P3 = this.m_points[2].m_projected;

			let denom = (P2.y-P3.y)*(P1.x-P3.x) + (P3.x-P2.x)*(P1.y-P3.y);
			let W1 = ((P2.y-P3.y)*(P.x-P3.x)+(P3.x-P2.x)*(P.y-P3.y))/denom;
			let W2 = ((P3.y-P1.y)*(P.x-P3.x)+(P1.x-P3.x)*(P.y-P3.y))/denom;
			let W3 = 1-W1-W2;

			dEye = this.m_points[0].m_dEye*W1+this.m_points[1].m_dEye*W2+this.m_points[2].m_dEye*W3;
		}
		else
		{	// should not be
			dEye=0;
			for(let i=0;i<n;i++)
				dEye+=this.m_points[i].m_dEye;
			if(n) dEye/=n;
		}
		return dEye;
	}
	// M_triangulate
	// creates m_triangle = array of {a,b,c} ( indexes in m_points list)
	M_triangulate()
	{
		// Make local basis
		if(!this.m_localBasis)
		{
			this.M_makeLocalBasis();
		}
		let points=[];
		//let flatPoints = [];
		for( let i=0; i<this.m_points.length; i++)
		{	
			let p0 = this.m_points[i].M_minus(this.m_localBasis.O);
			let plocal = new RQVec2(this.m_localBasis.I.M_dot(p0),this.m_localBasis.J.M_dot(p0));
			//flatPoints.push(plocal.x,plocal.y);
			points.push(plocal);
		}
		// Use Delaunator. But we have a problem with not convex shapes  : todo : using Earcut maybe ? 
		// here is a port on three.js : 
		// https://github.com/mrdoob/three.js/blob/master/src/extras/Earcut.js
		
		//let d = new Delaunator(flatPoints);
		
		let d = new RQTriangulate(points)

		let tri = d.triangles;
		let n = tri.length;
		// the triangles		
		this.m_triangles=[];
		for( let i=0; i<n; )
		{	
			let triangle = { a: tri[i++], b: tri[i++] , c: tri[i++] };
			this.m_triangles.push(triangle);
		}
	}
	M_makePolyline( pos, MV)
	{
		let L = new RQPolyLine();
		let el=this.m_edges.length;		
		for( let i=0; i<el; i++)
		{	let isPrev = L.M_nb()>0;
			let e = this.m_edges[i];
			if( e.isSegmented && e.poly)
			{
				for(let j=isPrev?1:0; j<e.poly.M_nb(); j++)
				{
					let pTransformed = MV.M_mutlipliedByVector(e.poly.M_getPoint(j) );
					L.M_addPoint(A.M_projection(pTransformed,pos));
					
				}
			
			}	
			else 
			{	//A.M_log("NO segment ! e.isSegmented="+(e.isSegmented)+" e.poly="+e.poly);
				let pTransformed;
				if( !isPrev)
					L.M_addPoint(A.M_projection( MV.M_mutlipliedByVector(e.A) ,pos)) ;
				L.M_addPoint(A.M_projection( MV.M_mutlipliedByVector(e.B) ,pos)) ;
			}
				
		}			
		return L;	
	
	}
	M_makePolylineClip( pos, MV,opts)
	{
		let L = new RQPolyLine();
		let yClip = opts.yClip;
		let pNext =0;
		let el=this.m_edges.length;
		
		for( let i=0; i<=el; i++)
		{	let e = this.m_edges[ i==el?0:i];
			if( e )
			{
				let pA = MV.M_mutlipliedByVector(e.A);
				let pB = MV.M_mutlipliedByVector(e.B);
				let valid= true;
				if( pA.y<yClip && pB.y<yClip)
				{
					// do Nothing
					valid=false; 
					pNext = 0;
				}
				else if( pA.y>=yClip && pB.y<yClip)
				{
					pNext = pB.M_plus( pA.M_minus(pB).M_mul(  (yClip-pB.y)/(pA.y-pB.y) ));				
				}
				else if( pA.y<yClip && pB.y>=yClip)
				{
					pA = pA.M_plus( pB.M_minus(pA).M_mul(  (yClip-pA.y)/(pB.y-pA.y) ));				
					pNext=0;
				}
				if( valid)
				{	//let Pproj = new RQVec2(pA.x,-pA.y + pA.z*zfact);				
					L.M_addPoint(A.M_projection(pA,pos) /*Pproj.M_plus(pos)*/);
				}
				if( pNext )
				{
					//let Pproj = new RQVec2(pNext.x,-pNext.y + pNext.z*zfact);				
					//L.M_addPoint(Pproj.M_plus(pos));
					L.M_addPoint(A.M_projection(pNext,pos) /*Pproj.M_plus(pos)*/);
					pNext = 0;				
				}
			}
		}
		L.M_closePath();
		return L;	
	
	}
	M_makePolylineClipWithEdges( pos, MV,opts)
	{

		let yClip = opts.yClip;
		let el=this.m_edges.length;
		let out=[];
		let L = null;
		for( let i=0; i<el; i++)
		{	let e = this.m_edges[i];
		
			if(e && !e.friendOrMe().isDrawn )
			{
				e.friendOrMe().isDrawn = true;
				let flat =e.friendOrMe().isFlat; 
				let pA = MV.M_mutlipliedByVector(e.A);
				let pB = MV.M_mutlipliedByVector(e.B);
				let valid=true;
				if( pA.y<yClip && pB.y<yClip)
				{
					valid=false;
				}
				else if( pA.y>=yClip && pB.y<yClip)
				{
					pB = pB.M_plus( pA.M_minus(pB).M_mul(  (yClip-pB.y)/(pA.y-pB.y) ));				
				}
				else if( pA.y<yClip && pB.y>=yClip)
				{
					pA = pA.M_plus( pB.M_minus(pA).M_mul(  (yClip-pA.y)/(pB.y-pA.y) ));				
				}
				if( valid)
				{
					let PprojA = A.M_projection(pA,pos) //new RQVec2(pos.x+pA.x,pos.y -pA.y + pA.z*zfact);				
					let PprojB = A.M_projection(pB,pos) //new RQVec2(pos.x+pB.x,pos.y -pB.y + pB.z*zfact);				
					if( L==null || flat!=L.isFlat || !L.M_endPoint().M_equals(PprojA))
					{	L = new RQPolyLine();
						L.isFlat = flat;
						out.push(L);
						L.M_addPoint(PprojA);
						L.M_addPoint(PprojB);
											
					}
					else
					{
						L.M_addPoint(PprojB);
					}
					

				
				}

			}
									
		
		}
		return out;	
	
	}
	// Face : create a polyline
	// no clipping to ground
	// allows segmentation
	M_makePolylineWithEdges( pos, MV)
	{
		let out=[];
		let prevE=null;			// previously drawn edge
		let el=this.m_edges.length;
		let segments=[];
		let points = null;
		
		// for each edge
		for( let i=0; i<el; i++)
		{	let e = this.m_edges[ i];
			
			// if edge isn't already draw
			if(e && !e.friendOrMe().isDrawn )
			{
				let flat =e.friendOrMe().isFlat; 
				// if line started,  or different stroke width : create a new line 
				if( points==null || flat!=points.flat /*|| !L.M_endPoint().M_equals(PprojA)*/)
				{ 
					points = {flat:flat, p:[]};
					segments.push(points)					
				}
				e.friendOrMe().isDrawn = true; 
			}
			// this edge is already drawn : cut the line 
			else 
			{ 	
				points=null;
			}			
			// if we have a point 
			if( points)
			{
				let isPrev= points.length?true:false;
				if(e.isSegmented && e.poly)
				{
					for(let j= (isPrev? 1:0); j<e.poly.M_nb(); j++)
					{
						points.p.push(e.poly.M_getPoint(j))
					}
				
				}
				else
				{
					if( !isPrev)
						points.p.push(e.A);
					points.p.push(e.B);
				}
			}
		
		}
		for( let i=0; i<segments.length; i++)
		{	points=segments[i];
			let L = new RQPolyLine();
			L.isFlat = points.flat;
			for( let j=0; j<points.p.length; j++)
			{
				let pTransformed = MV.M_mutlipliedByVector(points.p[j]);
				L.M_addPoint(A.M_projection(pTransformed,pos));
			}
			out.push(L);
			
		}
		return out ;	
	
	}

	M_getString()
	{
		let s="";
		s+=" nbPoints = "+this.m_points.length+" [";
		for( let i=0; i<this.m_points.length; i++)
		{
			s+= " "+this.m_points[i].m_index;
		
		}
		s+=" ]";
		return s;
	
	
	
	}
};
class Edge extends RQLine
{
	constructor(...args)
	{
		super(...args);

		this.friend  	= null;
	}
	friendOrMe()
	{
		if(this.friend)
			return this.friend;
		return this;
	}
	M_segment(segLen)
	{
		let e =this.friendOrMe();
		if(!e.isSegmented)
		{	e.isSegmented = true;
			let l=0;
			let P = e.A.clone();
			let dist =e.A.M_dist(e.B); 
			e.poly = new RQPolyLine();
			if( dist>segLen)
			{
				let u = e.B.M_minus(e.A).M_multipliedBy(segLen/dist);
				while(l<dist)
				{	e.poly.M_addPoint(P.clone());
					P.M_add(u);
					l+=segLen;
				
				}
			}
			else
				e.poly.M_addPoint(P);					

			e.poly.M_addPoint(e.B.clone());					
		
		}
		// copy the points to this segment if it's a friend
		if( this.friend && !this.isSegmented)
		{
			this.isSegmented =true;
			// same direction ? 
			if( this.reverse)
			{
				this.poly = new RQPolyLine(/*e.poly.m_points*/);	// will make references to points
				let nb = e.poly.M_nb();
				for( let i=0;i<nb;i++)
					this.poly.M_addPoint( e.poly.M_getPoint(nb-1-i) );
				//this.poly.M_reverseOrder();			
			}
			else 
			{
				this.poly=e.poly;
			}
		}
	
	} 
	
}
class Mesh
{
	constructor(opts)
	{
		this.M_clear();
	}
	
	M_clear()
	{
		this.m_points = [];
		this.m_faces = [];
		this.m_edges = [];
	
	
	}
	M_getString()
	{
		let s ="";
		s+="POINTS : "+this.m_points.length+"\n";
		for( let i=0; i<this.m_points.length; i++)
			s+=" "+i+" "+this.m_points[i].M_getString()+"\n";	

		s+="FACES : "+this.m_faces.length+"\n";
		for( let i=0; i<this.m_faces.length; i++)
			s+=" "+i+" "+this.m_faces[i].M_getString()+"\n";	

	
		return s;
	}
	M_addFace(f)
	{
		this.m_faces.push(f);
	}

	M_computeEdges()
	{
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			if(F.m_points)
			{
				let nbPts = F.m_points.length;
				for( let i=0; i<nbPts; i++)
				{
					let i2 = (i+1)%nbPts; 
					F.m_edges.push(this.M_addEdge(F.m_points[i],F.m_points[i2]));
				
				}
			}
		}
	
	}
	M_addEdge(A,B)
	{
		// look up for existing edge
		let E=new Edge(A,B);
		for(let i=this.m_edges.length-1; i>=0; i--)
		{
			let e= this.m_edges[i];
			let k=0; 
			if( e.A.m_index == A.m_index && e.B.m_index==B.m_index)
				k=1;
			else if( e.A.m_index == B.m_index && e.B.m_index==A.m_index)
				k=2;
			if(k)
			{	E.friend = e;
				if( k==2)
					E.reverse=true;
				return E;
			} 
		}
		this.m_edges.push(E);
		return E;
	
	}
	M_segmentEdges(segLen)
	{	
		/*
		for(let i=0; i<this.m_edges.length; i++)
		{
			let e= this.m_edges[i];		
			e.M_segment(segLen);
		}
		*/
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
		
			for(let i=0; i<F.m_edges.length; i++)
			{
				F.m_edges[i].M_segment(segLen);
			}
		}
		
	
	
	}


	M_resetEdgesDrawFlag()
	{
		for(let i=this.m_edges.length-1; i>=0; i--)
		{
			let e= this.m_edges[i];
			if( !e.friend)
			{
				e.isDrawn = false;
				e.isFlat = false;			
				e.fNormals=[];			//faces normals 
			}
		}	
	
	}
	M_findFacesWithEdge(E)
	{	let out=[];
		let e1 = E.friendOrMe();
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			let el=F.m_edges.length;
			for( let i=0; i<el; i++)
			{	let e = F.m_edges[i].friendOrMe();
				if( e==e1)
				{	out.push(F);
					break;
				}
			}

		}
		return out;

	}
	// faces->m_normalTransformed and faces->m_isBackface must be set
	M_computeAngleLimit(angLimit)
	{	let cosMax = Math.cos(angLimit*DEGTORAD);
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];
			if( !F.m_isBackface)
			{
				let el=F.m_edges.length;
				for( let i=0; i<el; i++)
				{	let e = F.m_edges[i].friendOrMe();
					e.fNormals.push( F.m_normalTransformed);					
				}
			}		
		}
		for(let i=this.m_edges.length-1; i>=0; i--)
		{
			let e= this.m_edges[i];
			if( !e.friend)
			{
				if( e.fNormals.length>=2)
				{
					let cosAng = e.fNormals[0].M_dot(e.fNormals[1]);
					if(cosAng>cosMax)
						e.isFlat = true; 
					//console.log("nbNormals="+e.fNormals.length+" cosAng="+cosAng+" ang="+ang+" "+(e.isFlat?"flat=true":""));
				}
			}			
		}
	}
	M_getGroundLine(MV,groundY)
	{
		const Y0 = new RQVec3(0,1,0);
		let skipBackfaces=true;
		let out=[];
		for(let iF=0; iF<this.m_faces.length; iF++)
		{
			let F=this.m_faces[iF];
			if( !(skipBackfaces&&F.m_isBackface) && ! (F.m_normalTransformed.M_dot(Y0)<-0.5 ))		// skip backfaces and faces looking downwards too much
			{
				let n = F.m_points.length;
				let L = null,gr=null;
				let pA=null,pB;
				let A_,B_;
				for( let i=0; i<=n; i++)
				{	pB = F.m_points[i%n];
					B_=MV.M_mutlipliedByVector(pB);
					if( i==0)
					{	pA=pB;
						A_ = MV.M_mutlipliedByVector(pA);					
					}
					else
					{
						if( (A_.y>=groundY && B_.y<=groundY) || (B_.y>=groundY && A_.y<=groundY)) 
						{
							// segment crosses the ground
							let lenY = Math.abs(A_.y-B_.y);
							let P = B_.M_minus(A_).M_multipliedBy( lenY>0? Math.abs(groundY-A_.y)/lenY:0.5).M_plus(A_);
							if( !L){L=[]; gr={F:F,L:L,len:0};out.push(gr); }
							if( L.length)
							{	P.dist = L[L.length-1].M_dist(P);
								gr.len+= P.dist;
							}
							L.push(P);

						}
						
					}
					pA=pB;A_=B_;
				}
			}
		}
		//console.log("Returning out="+RQPrintR(out,2));
		return out;
	}
	M_setMV(MV)
	{
		this.MV = MV;
	}

	// M_painterSort
	// sorts faces by barycenter distance ( basic, temporary )
	M_painterSort(eyeVector,pos,MV)
	{
		// Compute projected points
		for(let i=0; i<this.m_points.length; i++)
		{	let p=this.m_points[i];
			p.m_transformed=MV.M_mutlipliedByVector(p);
			p.m_projected =A.M_projection(p.m_transformed,pos);
		
			// project on eyeVector to get a distance = dist to obj origin in eye direction. Greatest =closer to eye
			p.m_dEye = eyeVector.M_dot(p.m_transformed);	

		}
		// Compute AABBs for faces
		for( let iF=0; iF<this.m_faces.length; iF++)
		{
			let F= this.m_faces[iF];

			// Compute AABB on projected points
			F.M_computeAABB(true);		// will compute m_aabb and m_zRange

			// Compute z  ( TODO : remove this) 
			let g=F.M_computeBarycenter();
			let pTransf = MV.M_mutlipliedByVector(g);

			// project on eyeVector to get a distance
			F.dEye = eyeVector.M_dot(pTransf);	
		}
		// sort the MV
		//this.m_ints=[];	// temp
		this.m_faces.sort( function(a,b)
		{ 
			// 1 ) zRange exclusion
			
			if(a.m_zRange.max<=b.m_zRange.min)			// a is far, return 1 so b is sorted first
				return 1;
			if(b.m_zRange.max<=a.m_zRange.min)
				return -1;
			
			// Default 
			let defaultSort = a.dEye<b.dEye?1 : -1;

			// 2 ) backface exclusion - backface is sent to end of list back
			if( a.m_isBackface && b.m_isBackface) return defaultSort;
			if( a.m_isBackface ) return 1;
			if( b.m_isBackface) return -1;
			/*let flg=(a.m_isBackface?1:0)+(b.m_isBackface?2:0);
			if(flg) return flg==1?1: flg==2? -1 : defaultSort;*/
			

			// 3) AABB exclusion
			let int=a.m_aabb.M_getIntersection(b.m_aabb);
			if(int)
			{	int.M_rounding();
			}
			if((!int) || int.w<1 || int.h<1 )
				return defaultSort;

			// 3) Intersections to handle
			//this.m_ints.push(int);	// temp for debug, looks ok.
			
			// todo :
			// find a point that is at the intersection of the two faces in projected space ( efficient way ? )
			// interpolate the dEye at this point
			// sort by dEye

			// 1 create a canvas with intersection AABB
			// draw each shape with color mode, one red, one green
			// get pixels and scan for a yellow color
			// 
			let canvas = document.createElement('canvas');
			let pixelSize=4;
			if( int.w<(4*pixelSize)||int.h<(4*pixelSize))
				pixelSize=1;
			let w,h;
			canvas.width  = w=parseInt(int.w/pixelSize);
			canvas.height = h=parseInt(int.h/pixelSize);

			let ctx = canvas.getContext('2d');
			//ctx.fillStyle="black";
			//ctx.fillRect(0, 0, canvas.width, canvas.height);
			if(pixelSize>1 )
				ctx.scale(1/pixelSize,1/pixelSize);	
			ctx.translate(-int.x, -int.y);	
			ctx.globalCompositeOperation = 'lighter';
			ctx.fillStyle = 'rgba(128,0,0,1)';
			let path=a.M_getProjectedSvgPath();
			ctx.fill(path);
			path=b.M_getProjectedSvgPath();
			ctx.fill(path);

			ctx.globalCompositeOperation = 'source-over';

			// parse the data to find a common point 
			let data=ctx.getImageData(0,0,w,h).data;
			let t=0;
			let pt=null;
			for(let j=0;j<h;j++)
			{	for(let i=0;i<w;i++)
				{	if(data[t]>250)
					{
						pt=new RQVec2(int.x+i*pixelSize,int.y+j*pixelSize);
						break;
					}
					t+=4;
				}
				if(pt)
					break;

			}
			// given this point, interpolate the face's points coordinates
			// to get dEye at this point which gives us the result
			if( pt)
			{	// draw the canvas for debug
				//A.M_drawImage(canvas,int,"lighter");

				return a.M_interpolatedEyeDist(pt) <b.M_interpolatedEyeDist(pt)? 1:-1;
			}
			return defaultSort;
		
		}.bind(this));



	}


	// M_testFace
	// test whether the point is inside the given face
	M_testFace(face,P,prevP)
	{	if(!this.MV)
			return false;
		let B;
		if( !face.m_localBasisTransformed)
		{
			//console.log("Making local basis");
			face.M_makeLocalBasisTransformed(this.MV);
			
		}		
		B=face.m_localBasisTransformed;

		// project P and prevP in local basis transformed
		// p will get the coordinates on the face's local basis
		let OP = P.M_minus(B.O);
		let p = new RQVec2(  OP.M_dot(B.I),OP.M_dot(B.J) /*,OP.M_dot(B.K)*/ );
		let prevOP = prevP.M_minus(B.O);
		let prevp = new RQVec2(  prevOP.M_dot(B.I),prevOP.M_dot(B.J));


		let isIn = false;
		let isPrevIn = false;
		let prevTri = null;
		//let nb=face.pts.length;
		let adjEdge=null;
		let edgeVecUnit=null;
		let edgeOrigin = null;
		let edgeFoundCount =0;
		let edgeIntersect=null;


		// draw P
		//A.M_drawDebugVector(P,new RQVec3(0,0,0));
		if( false ) // debug
		{
			// build P back from face equations
			let Ptest = B.O.clone();
			Ptest.M_add(B.I.M_multipliedBy(p.x));
			Ptest.M_add(B.J.M_multipliedBy(p.y));
			A.M_drawDebugVector(Ptest,new RQVec3(0,0,0));

		}


		for( let iTri = 0; iTri<face.m_triangles.length; iTri++)
		{
			let tri=face.m_triangles[iTri];
			//console.log("Testing p"+p.M_getString()+" vs ("+face.m_points[tri.a].local.M_getString()+" / "+face.m_points[tri.b].local.M_getString()+" / "+face.m_points[tri.c].local.M_getString());

			if( false)	// Draw triangulation result
			{	let L = new RQPolyLine( [
						A.M_projection(this.MV.M_mutlipliedByVector(face.m_points[tri.a])),
						A.M_projection(this.MV.M_mutlipliedByVector(face.m_points[tri.b])),
						A.M_projection(this.MV.M_mutlipliedByVector(face.m_points[tri.c])) 
					]);
				A.m_groups.Debug.m_strokeColor = "#FF00FF";
				A.M_drawLines(A.m_groups.Debug,L,false);
			}

			//let report = p.M_isInTriangle(face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c]);  
			let report = {in:RQTriangulate.sM_isInsideTriangle(p,face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c])};
			if(!isPrevIn)
			{	//let reportPrev = prevp.M_isInTriangle(face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c]);  
				let reportPrev = {in : RQTriangulate.sM_isInsideTriangle(prevp,face.m_localPoints[tri.a],face.m_localPoints[tri.b],face.m_localPoints[tri.c])};  
				if(reportPrev.in)
				{	isPrevIn=true;
					prevTri=tri;
				}
			}
				//console.log("Report : "+RQPrintR(report));
			//let report = p.M_isInTriangle(face.G,face.pts[iF-1],face.pts[iF%nb],true);
			//	{in:isIn, x:x,y:y}
			if(report.in)
			{	isIn=true;
				break;
			}
			

		}
		if( (!isIn) && isPrevIn)
		{
			//console.log("We have a crossing triangle");
			// find the edge that crosses
			/*
			P+k.U , k€[0,1]
			M tq P+k.U  = Q+l.V 
			P.x + k*U.x = Q.x + l*V.x
			P.y + k*U.y = Q.y + l*V.y
			
			k = (Q.x + l*V.x - P.x)/U.x
			P.y + (Q.x + l*V.x - P.x)*U.y/U.x = Q.y + l*V.y
			P.y-Q.y + (Q.x-P.x)*U.y/U.x  = l*(V.y-V.x*U.y/U.x)
			[*U.x] => U.x*(P.y-Q.y) + U.y*(Q.x-P.x) = l * ( V.y*U.x - V.x*U.y)
					U.x*(P.y-Q.y) + U.y*(Q.x-P.x)		(U.x*P.y - U.y*P.x)  - (U.x*Q.y - U.y*Q.x )     U x P - U x Q
			l = 	-----------------------------  =    -------------------------------------        = ---------------
						V.y*U.x - V.x*U.y					   U.x*V.y - V.x*U.y                            U x V
			
			kU = Q-P + (U x P - U x Q)/(U x V) * V
			k U * (U x V) = (Q-P) (U x V) *V (U x P - U x Q ) 
			k [ U.x * (U.x*V.y + U.y*V.x)  ] = ( Q.x - P.x) *  ( U.x *V.y-U.y*V.x   ) * V.x * ( U.x*P.y - U.y*P.x - U.x*Q.y + U.y*Q.x)
			...			
			*/
			let n= face.m_points.length;
			let P_ = prevp;
			let U_ = p.M_minus(prevp);
			
			let distToEdge = 1;
			for( let i=0; i<n; i++)
			{
				let Q_=face.m_localPoints[i];
				let V_=face.m_localPoints[(i+1)%n].M_minus(Q_);
				try{
				let UxV = U_.M_cross(V_);
				if( UxV != 0)
				{
					let l = ( U_.M_cross(P_) - U_.M_cross(Q_)) / UxV;
					if( l>=0 && l<=1)
					{
						let M = Q_.M_plus( V_.M_multipliedBy(l));
						let PM = M.M_minus(P_);
						let k = PM.M_length() / U_.M_length();
						if( k>=0 && k<=1)
						{
							// we found an edge ! 
							if(distToEdge> Math.abs(l-0.5))
							{	distToEdge = Math.abs(l-0.5);
								// adjust M to avoid being too close to corners
								if( distToEdge>0.48)
								{	l = 0.5+0.48*Math.sign(l-0.5);
									let M = Q_.M_plus( V_.M_multipliedBy(l));
								}
								
								adjEdge={A:face.m_points[i],B:face.m_points[(i+1)%n]};
								edgeOrigin = this.MV.M_mutlipliedByVector( face.m_points[i]);
								edgeVecUnit = this.MV.M_mutlipliedByVector( adjEdge.B).M_minus( edgeOrigin).M_normalize();
								edgeIntersect = B.O.M_plus( B.I.M_multipliedBy(M.x)).M_plus(B.J.M_multipliedBy(M.y));
								// draw the intersection
								//A.M_drawDebugVector(edgeIntersect,new RQVec3(0,0,0));
							}
						}
						
					}
				}
				}
				catch(e)
				{
					console.error(e);
					console.log("U_ = "+U_.M_getString()+" V_="+V_.M_getString());
				}
				
			}
			
		}
		if( isIn)
		{
			//console.log("isIn !");
		}

		// if not inside, find adjacent face
		// HOW ??? 
		// it should be like folding the neighbor faces to be flat aligned with the current face. 
		let Fnew=null;
		if( (!isIn) && adjEdge)
		{
			let E = this.M_addEdge(adjEdge.A,adjEdge.B);
			// find face with that edge
			let Fnews = this.M_findFacesWithEdge(E);
			for(let i=0; i<Fnews.length; i++)
			{
				if( Fnews[i]!=face)
					Fnew=Fnews[i];
			}
		}
		if( Fnew)
		{
			// make a basis for face 			
			return {newF:Fnew, intersect: edgeIntersect,basis:face.M_makeBasisWithVector(edgeOrigin,edgeVecUnit),newBasis:Fnew.M_makeBasisWithVector(edgeOrigin,edgeVecUnit)  };
		}
		return isIn;
	}


	M_createBlock(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;


		this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
		
		this.M_breakCorners({pass:2, kMin:0.1, kMax:0.96, rndFunc:o.rndFunc });
	}
	M_createRock(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;


		this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
		
		this.M_breakCorners({pass:2, kMin:0.1, kMax:0.96, rndFunc:o.rndFunc });
	}

	M_createPile(o)
	{
		if(!o) o={width:50,height:90,depth:50}
		if( o.rndFunc==undefined)
			o.rndFunc = Math.random;

		let shift=new RQVec3(0,0,0);
		let sz = new RQVec3(0,0,0);
		let nb = 1+Math.round(o.rndFunc()*5);
		o.height/=nb;
		this.O = new RQVec3(0,0,0)
		let cubes=[];
		let dim;
		
		for( let i=0; i<3; i++)
		{
			sz.M_set(o.width,o.height,o.depth);
			sz.x*=1+(o.rndFunc()-0.5)*1.2;
			sz.y*=1+(o.rndFunc()-0.5)*1.6;
			sz.z*=1+(o.rndFunc()-0.5)*0.4;
			if(i==0)
			{	dim=sz.clone();
				this.m_floorY=-dim.y/2;
			}
			else
				dim.y+=sz.y;
			shift.y+=sz.y/2;
			cubes.push({sz:sz.clone(),shift:shift.clone()});
			//this.M_createCube(sz.x,sz.y,sz.z,{noEdge:true,noClear:i>0,shift:shift });
			shift.y += sz.y/2;
		}
		let c;
		let i=0;
		while(c=cubes.pop())
		{
			this.M_createCube(c.sz.x,c.sz.y,c.sz.z,{noEdge:true,noClear:i>0,shift:c.shift,O:c.shift });
			i++;
		}
		this.m_dimensions=dim;
		this.M_breakCorners({pass:1+Math.round(o.rndFunc()*2), kMin:0.1, kMax:0.96, rndFunc:o.rndFunc,useO:true });
	}
	// M_computeVertexNormals
	// for each face, add the face normal to its points, with weight equals to the face's surface ()
	// Normalize the normal for each vertex
	M_computeVertexNormals()
	{
		// clean array
		for( let i=0; i<this.m_points.length; i++)
		{	this.m_points[i].Ns=[];
		}

		// push faces normals at points
		for(let iF=0; iF<this.m_faces.length; iF++)
		{	let F=this.m_faces[iF];
			F.M_computeBarycenter();
			let n=F.m_points.length;
			if(n>=3)
			{	let N = F.m_normal; //F.M_getNormalRaw();
				for( let i=0; i<n;i++)
				{	let p = F.m_points[i];
					p.Ns.push({N:N,v:F.m_points[i].M_minus(F.m_g).M_normalize()}); 

				}
			}
		}
		for( let i=0; i<this.m_points.length; i++)
		{	let p = this.m_points[i];
			let n;
			;
			if(p.Ns && (n=p.Ns.length))
			{	let N=new RQVec3();
				for(let iN=0; iN<n;iN++)
					N.M_add(p.Ns[iN].N);
				N.M_normalize();
				p.m_normal=N;
				
				// test with normals to get the peek angle 
				p.m_peek=-1;
				let peek;
				for(let iN=0; iN<n;iN++)
				{	if(p.Ns[iN].v)
					{	
						peek=N.M_dot(p.Ns[iN].v);
						if(peek>p.m_peek)
							p.m_peek=peek;
					}

				}

			}
			else { p.m_peek=0;}
		}
	}
	M_breakCorners(opts)
	{
		this.M_computeEdges();
		let k=0.15;
		let kMax = opts.kMax || 0.9;
		let kMin = opts.kMin || 0.1;
		let nbPass = opts.pass || 1;
		let rnd = opts.rndFunc || Math.random();
		let peekThres=0.6;
		for( let pass=0; pass<nbPass; pass++)
		{
			// First we compute the vertex normal
			this.M_computeVertexNormals();
			// Now create 2 points on each edge, for points that are breakable
			let newPoints=[];
			for(let i=0; i<this.m_edges.length; i++)
			{
				k = (kMin+(kMax-kMin)*rnd())*0.5;
				let E = this.m_edges[i];
				if( !E.friend)
				{
					// split the edge
					// created 2 new points on this edge, and listed them in each edge's point 
					let oldA=E.A;
					if(E.A.m_peek>peekThres)
					{	let pA = E.A.M_plus( E.B.M_minus(E.A).M_multipliedBy(k) ); pA.m_index = this.m_points.length;
						this.m_points.push(pA); 
						if( !E.A.newP) E.A.newP=[]; E.A.newP.push(pA);
						E.oldA=E.A;
						pA.m_normal = E.A.m_normal;
						E.A = pA;
					}

					if( E.B.m_peek>peekThres)
					{	let pB = oldA.M_plus( E.B.M_minus(oldA).M_multipliedBy(1-k) ); pB.m_index = this.m_points.length;
						this.m_points.push(pB);
						if( !E.B.newP) E.B.newP=[]; E.B.newP.push(pB);
						E.oldB=E.B;
						pB.m_normal = E.B.m_normal;
						E.B = pB; 
					}
					
					// edge is modified
					// it is now made of the 2 new points
					/*E.oldA=E.A;E.oldB=E.B;	// store ref to old points
					E.A = pA;
					E.B = pB; */
				}
			}		

			// For each face's edge, 
			// copy new points from friend edges, is there are any
			for( let iF=0; iF<this.m_faces.length; iF++)
			{
				let F= this.m_faces[iF];
				F.m_points = [];
				let pPrev=null;
				for(let ie=0; ie<F.m_edges.length; ie++)
				{
					let E = F.m_edges[ie];
					if( E.friend)
					{
						E.A = E.reverse?E.friend.B : E.friend.A; 
						E.B = E.reverse?E.friend.A : E.friend.B; 
					}
					// copy O center
					if(F.O && E.oldB && !E.oldB.O ) {E.oldB.O = F.O;}
					
					// add the points to the ring
					if( E.A!=pPrev)
						F.m_points.push(E.A);
					if(E.B!=F.m_points[0])
						F.m_points.push(E.B);
					pPrev= E.B;
				}
				F.m_edges=[];
			}
			// for each point, make a face with all the points that have been registered at this point
			for(let i = this.m_points.length -1; i >= 0 ; i--)
			{
				let P = this.m_points[i];
				if( P.newP && P.newP.length>=3)
				{	let F = new Face(...P.newP);
					if( P.O)
					{	F.O=P.O;					
					}
					// how to have the right order of points ? 	
					if(opts.useO)
						F.M_computeNormal();
					else 
					{	// TODO : to make better
						F.M_computeNormal(true);
						if(F.m_normal.M_dot(P.newP[0].m_normal)<0)
						{	F.m_normal.M_mul(-1);
							F.m_points.reverse();

						}
					}
					this.m_faces.push(F);
										
					this.m_points.splice(i,1);
				}
				// remove point

				P.newP = null;

			}

			// redo indexes
			for( let i =0; i<this.m_points.length; i++)
			{	this.m_points[i].m_index = i;

			}
			// redo edges			
			this.m_edges=[];
			this.M_computeEdges();


		} // pass




	}
	M_createPowerPlant(o)
	{
		o??={width:50,height:90,depth:50}
		o.rndFunc ??= Math.random;

		// list of faces extruded faces
		let out=[];

		let typeRnd=o.rndFunc();

		if( typeRnd <=0.5)
		{
			let nbx=3;
			let nby=2;
			let x=0;
			let y=0;
			for(let i=0; i<nbx;i++)
			{
				y=0;
				for(let j=0; j<nby;j++)
				{	let shift=new RQVec3(x,0,y);
					let index0=this.m_faces.length;
					let wFac=0.5+0.5*o.rndFunc();
					this.M_createCube(o.width*wFac,o.height*0.5+o.height*o.rndFunc(),o.depth*wFac,{noEdge:true,noClear:true,shift:shift});
					let newFs=this.M_extrudeFace(this.m_faces[index0+3],o.width/2 );
					
					if(i==0)
						out.push(newFs[0]);
					if(i==(nbx-1))
						out.push(newFs[2]);
					if(j==0)
						out.push(newFs[1]);
					if(j==(nby-1))
						out.push(newFs[3]);

					y+=o.depth*1.1;
				}
				x+=o.width*1.1;

			}
			this.M_breakCorners({pass:1, kMin:0.2, kMax:0.9, rndFunc:o.rndFunc });

		}
	    else if( typeRnd>0.5)
		{
			this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
			this.M_breakCorners({pass:1, kMin:0.2, kMax:0.9, rndFunc:o.rndFunc });
			for( let ip=0; ip<3; ip++)
			{
				let newFs=this.M_extrudeFace(this.m_faces[3],o.width/2 );
				for( let i=0; i<newFs.length; i++)
				{	let k=0;
					if(o.rndFunc()<0.2)
					{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
						k++;
					}
					if(o.rndFunc()<0.5)
					{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
						k++;
					}
					if( k>0)
						out.push(newFs[i]);
				}
				this.M_extrudeFace(this.m_faces[3],o.width/2 );
			}
		}
		//this.M_breakCorners({pass:1, kMin:0.2, kMax:0.8, rndFunc:o.rndFunc });
		this.M_computeEdges();
		return out;
	}
	M_createExtrude(o)
	{	o??={width:50,height:90,depth:50}
		o.rndFunc ??= Math.random;

		// list of faces extruded faces
		let out=[];

		this.M_createCube(o.width,o.height,o.depth,{noEdge:true});
		this.M_breakCorners({pass:1, kMin:0.2, kMax:0.9, rndFunc:o.rndFunc });
		for( let ip=0; ip<3; ip++)
		{
			let newFs=this.M_extrudeFace(this.m_faces[3],o.width/2 );
			for( let i=0; i<newFs.length; i++)
			{	let k=0;
				if(o.rndFunc()<0.2)
				{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
					k++;
				}
				if(o.rndFunc()<0.5)
				{	this.M_extrudeFace(newFs[i],o.height*0.2/(ip+1) );
					k++;
				}
				if( k>0)
					out.push(newFs[i]);
			}
			this.M_extrudeFace(this.m_faces[3],o.width );
		}
		this.M_breakCorners({pass:1, kMin:0.2, kMax:0.8, rndFunc:o.rndFunc });
		//this.M_computeEdges();
		return out;
	}
	M_extrudeFace(F,d)
	{
		let index0=this.m_points.length;
		let out=[];
		for( let i=0; i<F.m_points.length; i++)
		{
			let fp = F.m_points[i];
			let p = fp.clone();
			p.M_add( F.m_normal.M_multipliedBy(d) );
			p.m_index = index0+i;
			this.m_points.push( p);

		}
		// a face on each contour
		let fNb=F.m_points.length;
		for( let i=0; i<fNb; i++)
		{
			let newF = 
			new Face(	F.m_points[i],
						F.m_points[(i+1)%fNb],
						this.m_points[index0+(i+1)%fNb],
						this.m_points[index0+i]
					);
			newF.M_computeNormal(true/*unchecked directon*/);
			this.m_faces.push(newF);
			out.push(newF);

		}
		// change points in face
		for( let i=0; i<fNb; i++)
		{
			F.m_points[i]=this.m_points[index0+i];

		}
		return out;
	}

	M_createCube	(sizeX,sizeY,sizeZ,opt)
	{
		if( !opt) opt={};
		let noEdgeCompute = opt.noEdge;
		let noClear = opt.noClear;
		if(!opt.shift) opt.shift=new RQVec3(0,0,0);
		this.m_dimensions = new RQVec3(sizeX,sizeY,sizeZ);
		//if( 8!=this.m_points.length || 6!=this.m_faces.length || 12!=this.m_edges.length)
		{
			if(!noClear)
				this.M_clear();
			// Points
			let i,j,k;
			let index0 = this.m_points.length;
			let index=index0;
			for( k=-1; k<=1; k+=2)
			{
				for( j=-1; j<=1; j+=2)
				{
					for( i=-1; i<=1; i+=2)
					{	let p = new RQVec3( i*sizeX*0.5+opt.shift.x, j*sizeY*0.5+opt.shift.y, k*sizeZ*0.5+opt.shift.z);
						p.m_index = index++;
						this.m_points.push( p);
											
					}			
				
				}
			}
			let corner = (i,j,k)=>this.m_points[index0+ (i+1)/2  + 2*(j+1)/2 + 4*(k+1)/2];

			// X
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,-1,1), corner(-1,1,1),corner(-1,1,-1))).M_setNormal(-1,0,0)  );			
			this.m_faces.push( (new Face( corner( 1,-1,-1), corner( 1,1,-1), corner( 1,1,1), corner( 1,-1,1) )).M_setNormal(+1,0,0)  );			

			// Y
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(1,-1,-1), corner(1,-1,1),corner( -1,-1,1)  )).M_setNormal(0,-1,0)  );			
			this.m_faces.push( (new Face( corner(-1,1,-1), corner(-1,1,1), corner(1,1,1),corner( 1,1,-1)  )).M_setNormal(0,+1,0)  );			

			// Z
			this.m_faces.push( (new Face( corner(-1,-1,-1), corner(-1,1,-1), corner(1,1,-1),corner( 1,-1,-1)  )).M_setNormal(0,0,-1)  );			
			this.m_faces.push( (new Face( corner(-1,-1,1), corner(1,-1,1), corner(1,1,1),corner( -1,1,1)  )).M_setNormal(0,0,1)  );			

			// assign face ref. center if any was provided
			if( opt.O)
			{
				for(let i=this.m_faces.length-6; i<this.m_faces.length; i++)
				{	this.m_faces[i].O = opt.O;

				}
			}

			if(!noEdgeCompute)
				this.M_computeEdges();
		}
		
	}
	// nbStairs
	// stairHeight
	// stairDepth
	// width
	// torsion
	M_createStairsObject(opt)
	{
		let nb = opt.nbStairs;
		let h = opt.stairHeight;
		let d = opt.stairDepth;
		let depth = nb*d;
		let w=opt.width;
		let Fside = [new Face(),new Face()];				
		let isStraightBack = false;
		this.m_dimensions = new RQVec3(w,h*nb,depth);
		
		let y = 0;
		let z = depth/2; 
		let index=0;
		var pEnd1,pEnd2;
		let alpha = opt.torsion / nb;
		for( let iStair=0; iStair<=nb; iStair++)
		{
			var p1,p2,p3,p4;
		
			p1 = new RQVec3( w/2,y  ,z);	p1.m_index = index++;
			this.m_points.push(p1)
			p4 = new RQVec3(-w/2,y  ,z);	p4.m_index = index++;
			this.m_points.push(p4);

			if(iStair<nb)
			{
				p2 = new RQVec3( w/2,y+h,z);	p2.m_index = index++; 
				p3 = new RQVec3(-w/2,y+h,z);	p3.m_index = index++; 
				this.m_points.push(p2,p3);
			}

			
			if(iStair<nb)
			{
				let F = new Face();				
				F.m_points.push(p1,p2,p3,p4);
				F.M_setNormal(0,0,1);
				//F.M_computeNormal();				
				this.m_faces.push(F);
				Fside[0].m_points.push(p1,p2);
				Fside[1].m_points.push(p4,p3);
			}
			else
			{
				Fside[0].m_points.push(p1);
				Fside[1].m_points.push(p4);
				pEnd1=p1;
				pEnd2=p4;	
			}

			// flat step face
			if( iStair>0)
			{
				let F2 = new Face(this.m_points[p1.m_index-2],this.m_points[p1.m_index],this.m_points[p4.m_index],this.m_points[p4.m_index-2]).M_setNormal(0,1,0);				
				//F2.M_computeNormal();				
				this.m_faces.push(F2);				
			}
			if( iStair<nb)
			{
				z-=d;
				y+=h;
			}
		}
		let pBack=[];
		let pGround=[];
		for( let i=0; i<2;i++)
		{

			let	p = new RQVec3( w/2*(i==0?1:-1), isStraightBack? 0 : y-h  ,z);	p.m_index = index++;
			this.m_points.push(p);
			pBack[i]=p;
			Fside[i].m_points.push(p);

			if( !isStraightBack)
			{	// create a point on the ground 
				let	p2 = new RQVec3( w/2*(i==0?1:-1), 0  ,depth/2-d);	p2.m_index = index++;
				this.m_points.push(p2);
				Fside[i].m_points.push(p2);
				pGround[i]=p2;
			}

			if( i==0)
				Fside[i].m_points.reverse();

			Fside[i].M_setNormal(i==0?1:-1,0,0);				
			this.m_faces.push(Fside[i]);				
		
		}
		// back stair face
		if( true )
		{	let Fback = new Face();
			Fback.m_points.push(pBack[0],pBack[1],pEnd2,pEnd1);
			Fback.M_computeNormal();
			this.m_faces.push(Fback);
		}	
		if( !isStraightBack )
		{	let Fback = new Face();
			Fback.m_points.push(pGround[0],pGround[1], pBack[1],pBack[0]);
			Fback.M_computeNormal();
			this.m_faces.push(Fback);
		}	
		
		this.M_computeEdges();	
	
	}

	M_createColumnObject(height,opt)
	{
		opt.rndFunc??=Math.random;
		opt.column=true;
		opt.polygonNb ??= 3+Math.round(opt.rndFunc()*9);
		// in column, each face gets 1 carving made of n points
		//opt.columnCarvePts=4;
		this.M_createTrunkObject(height,opt);


	}

	M_createTrunkObject(height,opt)
	{
		opt??={}
		opt.rndFunc ??= Math.random;
		let nbH = opt.nbSeg??  5;		// nbSegmentsHeight
		let r = opt.sz?  opt.sz/2 : height/6;
		let nbPointsCircle = opt.polygonNb?? 12;
		let nbRotationPoints = nbPointsCircle;
		let isColumn = opt.column?true:false;
		let decal = opt.centerDecal===undefined? 0.2 : opt.centerDecal;
		let nbCarvingPoints = 0;
		let carvingShrink = 0.4;
		if( isColumn)
		{	nbCarvingPoints = opt.columnCarvePts==undefined?  3 : opt.columnCarvePts;
			nbPointsCircle = nbPointsCircle*nbCarvingPoints;
		}
		this.m_dimensions = new RQVec3(2*r,height,2*r);

		let index = 0;
		let p;
		let y = -height/2; 
		let aInc = 2*Math.PI/nbRotationPoints;
		for( let j=0; j<=nbH; j++)
		{
			let a = 0;
			// center with random decal
			let C = decal==0? new RQVec2() : new RQVec2( (opt.rndFunc()-0.5)*r*decal,(opt.rndFunc()-0.5)*r*decal);
			for( let i =0; i<nbRotationPoints; i++)
			{
				
				// column carving points
				if(isColumn)
				{	let a2 = a + aInc*(0.5-carvingShrink/2); 
					let a2Inc= aInc*carvingShrink/(nbCarvingPoints-1);
					let wCarving = aInc*carvingShrink*r;
					let rCarving = wCarving/2;
					let aCarv=0;
					let aCarvInc = Math.PI/(nbCarvingPoints-1);
					for(let i2=0; i2<nbCarvingPoints; i2++)
					{
						let r2 = r-rCarving*Math.sin(aCarv);
						p = new RQVec3( r2*Math.cos(-a2)+C.x, y, r2*Math.sin(-a2)+C.y);
						p.m_index = index++;
						this.m_points.push(p);
						a2+=a2Inc;
						aCarv+=aCarvInc;
					}

				}
				else 
				{	p = new RQVec3( r*Math.cos(-a)+C.x, y, r*Math.sin(-a)+C.y);
					p.m_index = index++;
					this.m_points.push(p);
				}

				a+=aInc;
			}
			y+= height/nbH;
		}

		// make faces
		let pt = (i,j)=>this.m_points[ j*nbPointsCircle +i];
		let F;
		for( let j=0; j<=nbH; j++)
		{
			if( j==0 || j==nbH)
			{
				F = new Face();				
			}
			for( let i =0; i<nbPointsCircle; i++)
			{
				let i2 = (i+1)%nbPointsCircle;
				if( j==0)
					F.m_points.push( pt(nbPointsCircle-1-i,j) );
				else if( j==nbH)
					F.m_points.push( pt(i,j) );
				if( j>0)
				{
					this.m_faces.push( (new Face( pt(i,j),pt(i,j-1),pt(i2,j-1),pt(i2,j) )).M_computeNormal()  );			
				}
				
			}
			if( j==0 || j==nbH)
			{
				F.M_computeNormal();				
				this.m_faces.push(F);
			}


		}
		this.M_computeEdges();	
	
	}	
	M_triangulate()
	{
		let fN = this.m_faces.length;
		for(let iF=0; iF<fN; iF++)
		{
			let F = this.m_faces[iF];
			F.M_triangulate();
		}
	}
	M_createIsosphere(radius, nbIterations)
	{
		let index = 0;
		let p;
		let a = 0;
		let r = radius; 
		// make pyramide
		for( let i =0; i<3; i++)
		{
			p = new RQVec3( r*Math.cos(a), 0, r*Math.sin(a));
			p.m_index = index++;
			this.m_points.push( p);
			a+=2*Math.PI/3;
		}	
		// Make top point 
		let s = this.m_points[0].M_dist(this.m_points[1]);
		let l = s*0.5*Math.tan(Math.PI/3);
		let d= this.m_points[1].z;
		let h = Math.sqrt( l*l-d*d);
		
		p = new RQVec3( 0, h, 0);
		p.m_index = index++;
		this.m_points.push( p);


		// find barycenter 
		let g = new RQVec3(0,0,0);
		for( let i=0; i<this.m_points.length; i++)
		{
			g.M_add(this.m_points[i]);
		
		}
		g.M_mul(1/this.m_points.length);
		
		// translate all the points to center 
		for( let i=0; i<this.m_points.length; i++)
		{
			this.m_points[i].M_sub(g);
		
		}
		// real sph radius = dist points to center 
		r = this.m_points[0].M_dist(0,0,0);
		for( let i=0; i<this.m_points.length; i++)
		{
			this.m_points[i].M_mul(radius/r);
		
		}


		// Make faces 
		let pt = (i)=>this.m_points[i];

		this.m_faces.push( (new Face( pt(1),pt(0),pt(3) )).M_computeNormal()  );			
		this.m_faces.push( (new Face( pt(2),pt(1),pt(3) )).M_computeNormal()  );			
		this.m_faces.push( (new Face( pt(0),pt(2),pt(3) )).M_computeNormal()  );			
		this.m_faces.push( (new Face( pt(0),pt(1),pt(2) )).M_setNormal(0,-1,0)  );			


		// We have a pyramid. 
		// Let's iterate  
		for(let iter=0; iter<3; iter++)
		{
			let fN = this.m_faces.length;
			for(let iF=0; iF<fN; iF++)
			{
				let F = this.m_faces[0];
				let nb = F.m_points.length;
				let newp = [];
				for( let i=0; i<nb; i++)
				{	let i2 = (i+1)%nb;
					let p = F.m_points[i2].M_plus( F.m_points[i]);
					p.M_mul(0.5);
					p.M_normalize();
					p.M_mul(radius);
					this.m_points.push(p);
					p.m_index = this.m_points.length-1;
					newp.push(p);



				}
				for( let i=0; i<nb; i++)
				{	let i2 = (i+1)%nb;
					// make faces
					this.m_faces.push( (new Face( F.m_points[i2],newp[i2], newp[i] )).M_computeNormal()  );			
				}


				//make central face 
				this.m_faces.push( (new Face( newp[0],newp[1], newp[2] )).M_computeNormal()  );			



				
				// remove the face
				this.m_faces.splice(0, 1); 
			
			}
		}
		this.M_computeEdges();

	}

};
