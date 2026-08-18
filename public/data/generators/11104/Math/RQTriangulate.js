 
// COTD Entry submitted by John W. Ratcliff [jratcliff@verant.com]

// ** THIS IS A CODE SNIPPET WHICH WILL EFFICIEINTLY TRIANGULATE ANY
// ** POLYGON/CONTOUR (without holes) AS A STATIC CLASS.  THIS SNIPPET
// ** IS COMPRISED OF 3 FILES, TRIANGULATE.H, THE HEADER FILE FOR THE
// ** TRIANGULATE BASE CLASS, TRIANGULATE.CPP, THE IMPLEMENTATION OF
// ** THE TRIANGULATE BASE CLASS, AND TEST.CPP, A SMALL TEST PROGRAM
// ** DEMONSTRATING THE USAGE OF THE TRIANGULATOR.  THE TRIANGULATE
// ** BASE CLASS ALSO PROVIDES TWO USEFUL HELPER METHODS, ONE WHICH
// ** COMPUTES THE AREA OF A POLYGON, AND ANOTHER WHICH DOES AN EFFICENT
// ** POINT IN A TRIANGLE TEST.
// ** SUBMITTED BY JOHN W. RATCLIFF (jratcliff@verant.com) July 22, 2000

//  Port in C++ RQLibs by Michaël Zancan on 24/09/12.
//  Port in Javascript by Michaël Zancan on 24/11/2021

class RQTriangulate
{
    constructor(contour)
    {
        this.triangles=[];
        if( contour && contour.length)
            this.M_process(contour);

    }



  	// triangulate a contour/polygon, result in member triangles
    // return bool
	M_process(contour)
    {
        this.triangles=[];
        
    
        /* allocate and initialize list of Vertices in polygon */

        let n = contour.length;
        if ( n < 3 ) return false;

        let V = []; for (let i=0;i<n;i++) V.push(0);

        // we want a counter-clockwise polygon in V 

        if ( 0 < RQTriangulate.sM_area(contour) )
           for (let v=0; v<n; v++) V[v] = v;
        else
            for(let v=0; v<n; v++) V[v] = (n-1)-v;

        let nv = n;

        ///  remove nv-2 Vertices, creating 1 triangle every time
        let count = 2*nv;   /* error detection */

        for(let m=0, v=nv-1; nv>2; )
        {
            // if we loop, it is probably a non-simple polygon
            if (0 >= (count--))
            {
                //** Triangulate: ERROR - probable bad polygon!
                return false;
            }

            // three consecutive vertices in current polygon, <u,v,w>
            let u = v  ; if (nv <= u) u = 0;        // previous
            v = u+1; if (nv <= v) v = 0;            // new v
            let w = v+1; if (nv <= w) w = 0;        // next

            if ( RQTriangulate.sM_snip(contour,u,v,w,nv,V) )
            {
                let a,b,c,s,t;

                // true names of the vertices
                a = V[u]; b = V[v]; c = V[w];

                // output Triangle
				this.triangles.push(a,b,c);				


                m++;

                // remove v from remaining polygon
                for(s=v,t=v+1;t<nv;s++,t++) V[s] = V[t]; nv--;

                // reset error detection counter
                count = 2*nv;
            }
        }
        return true;

    }
  
    // compute area of a contour/polygon
    static sM_area(contour)
    {
        let n = contour.length

        let a=0;
      
        for(let p=n-1,q=0; q<n; p=q++)
        {
          a+= contour[p].x*contour[q].y - contour[q].x*contour[p].y;
        }
        return a*0.5;
    }
  
    // decide if point P(x,y) is inside triangle defined by
    // pA, pB, pC
    // returns : true if yes
    static sM_isInsideTriangle(P,pA,pB,pC)
    {
        let ax, ay, bx, by, cx, cy, apx, apy, bpx, bpy, cpx, cpy;
        let cCROSSap, bCROSScp, aCROSSbp;
      
        ax = pC.x - pB.x;  ay = pC.y - pB.y;
        bx = pA.x - pC.x;  by = pA.y - pC.y;
        cx = pB.x - pA.x;  cy = pB.y - pA.y;
        apx= P.x - pA.x;  apy= P.y - pA.y;
        bpx= P.x - pB.x;  bpy= P.y - pB.y;
        cpx= P.x - pC.x;  cpy= P.y - pC.y;
      
        aCROSSbp = ax*bpy - ay*bpx;
        cCROSSap = cx*apy - cy*apx;
        bCROSScp = bx*cpy - by*cpx;
      
        return ((aCROSSbp >= 0) && (bCROSScp >= 0) && (cCROSSap >= 0));
    }


    static sM_snip( contour,u,v,w,n,V)
    {
        const EPSILON=0.0000000001;

        let p;
        let pA,pB,pC,P;
      
        pA= contour[V[u]];      
        pB= contour[V[v]];
        pC= contour[V[w]];
      
        if ( EPSILON > (((pB.x-pA.x)*(pC.y-pA.y)) - ((pB.y-pA.y)*(pC.x-pA.x))) ) return false;
      
        for (p=0;p<n;p++)
        {
          if( (p == u) || (p == v) || (p == w) ) continue;
          P = contour[V[p]];
          if (RQTriangulate.sM_isInsideTriangle(P,pA,pB,pC)) return false;
        }
      
        return true;
    }
	
};
