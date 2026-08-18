const PI = Math.PI;
const BLOCK_CUBOID      =0
const BLOCK_CUBE        =1
const BLOCK_PYRAMID     =2
const BLOCK_ROOF        =3
const BLOCK_CYLINDER    =4
const BLOCK_ARCH        =5
const BLOCK_PEOPLE      =6
const BLOCK_BILLBOARD   =7
const BLOCK_TREE        =8
const BLOCK_TRAFFICLIGHT=9
const BLOCK_HALFCIRCLE  =10

class SpeciesExample extends SpecyDefault
{
    constructor(name)
    {
        super(name);
    }
    // factory function : creates an instance of the class
    static create(name)
    {
        return new SpeciesExample(name);
    }

    // M_init
    M_init(_)
    {
        let N=(what,nb)=>Array(nb??1).fill(what);

        // Blocks
        this.m_availableBlocks = [
            BLOCK_CUBOID,
            BLOCK_CUBE,
            BLOCK_PYRAMID,
            BLOCK_ROOF,
            BLOCK_CYLINDER,
            BLOCK_ARCH,
            BLOCK_HALFCIRCLE,
            BLOCK_PEOPLE,
            BLOCK_BILLBOARD,
            BLOCK_TREE,
            BLOCK_TRAFFICLIGHT,
        ];
        this.m_stackableBlocks = [
            BLOCK_CUBOID,
            BLOCK_CUBE,
            BLOCK_CYLINDER,
            ...N(BLOCK_ARCH,1),
        ]
        this.m_groundBlocks = [
            BLOCK_CUBOID,
            BLOCK_CUBE,
            BLOCK_CYLINDER,
            BLOCK_ARCH,
            /*BLOCK_BILLBOARD,
            BLOCK_TREE,
            BLOCK_TRAFFICLIGHT*/
        ];
        this.m_roofBlocks = [
            BLOCK_PYRAMID,
            BLOCK_ROOF,
            BLOCK_HALFCIRCLE,
            ...N(BLOCK_PEOPLE,2),
            BLOCK_BILLBOARD,
            BLOCK_TREE,
            BLOCK_TRAFFICLIGHT,
        ];
        this.m_distributions =
        [   'random',
            'circular',
            'spiral',
            'grid',
            'single-row',
            'citadel'
        ];



		// Declare groups
		this.M_declareSvgGroup(_,"Faces");
		this.MAXGROUPS=5;
        for(let i=0; i<this.MAXGROUPS; i++)
        {   let groupName = this.M_getGroupName(i);
            this.M_declareSvgGroup(_,groupName);
            this.m_groups[groupName].m_paletteTag="custom";
        }


        // call default
        SpecyDefault.prototype.M_init.call(this,_);
    }
    M_getGroupName(index)
    {   index=RQMaths.M_clamp(index??0,0,this.MAXGROUPS-1);
        return `Lines${index+1}`;

    }
    // ------------------------------------------------------------
    //  M_layout
    // ------------------------------------------------------------
    M_layout(_,layout)
    {
        // layout 
        // -------
        //      scale   : a general scale factor 
        //      yRotate : the rotation of the world around Y axis ( 0 or degrees)
        //      world   : the current world   { name, bgColor, earthColor }
        //      grid    : a grid object, see below

        let out = [];
        let grid = layout.grid;
        if( grid)
        {
            // Grid
            // -----                              ^ Z
            //                                   / 
            // nbX          : nb cells in X     /
            // nbZ          : nb cells in Z    +------> X
            // 
            // width,depth  : the dimensions (in 3D space of the ground rectangle)
            // stepX, stepZ : the dimensions of the cells  ( width=nbX*stepX)
            // coord(ix,iz) : returns a RQVec2 of a grid point projected on the screen

            // OUTPUT
            // you must provide a list of objects with the following values in them :
            // x,y          : screen coordinates of your instance
            // ix,iz        : grid (ground) coordinates of your instance
            
            // layout.map
            // getScale     : returns a scale value depending on the position, for simulating the size discreasing with perspective. 
            // scales{min,max} : returns the minimum and maximum scales on the map
            

            let dist = _.world.dist ?? rndArray(this.m_distributions,this.random);
            _.M_log(`Block-layout dist=<b>${dist}</b>`);
            let objectW=0;
            let circleRadius;

            // Define some parameters depending on the distribution style
            let nb;
            let gridDef ={};
            switch(dist)
            {
                case 'random':
                    nb=1+Math.round(this.random()*40);
                    //console.log("random nb="+nb);

                    // compute an object size that could fit in 
                    // nb*objectW² < area  with area = grid.width*grid.height
                    objectW =  Math.min( grid.width/6, 14*_.upscale,Math.sqrt(grid.width*grid.depth/nb)/1.5);
                    break;
                case 'spiral':
                    objectW = 12*layout.map.scales.max*_.upscale;
                    nb = 100;
                    this.spiralRadius = 2*objectW;
                    this.spiralAng = this.random()*Math.PI;
                    objectW/=layout.map.scales.max;
                    circleRadius= (grid.width/2 - 2*objectW);
                    break;
                case 'circular':
                    objectW = 12*layout.map.scales.max*_.upscale;
                    circleRadius= (grid.width/2 - objectW)*(0.5+this.random()*0.5);
                    
                    // how many can we fit on a circle ? 
                    // circle length = 2*PI*circleRadius => nb = 2*PI*circleRadius/objectW
                    nb = Math.floor( 2*PI*circleRadius/(objectW*1.5));
                    objectW/=layout.map.scales.max;
                    break;
                case 'grid':
                case 'single-row':
                    // let's define an object's width and see the number of them we can fit
                    objectW = Math.max( 8*layout.scale/layout.map.scales.max*_.upscale*(0.5 +0.5*this.random()),grid.width/10);
                    gridDef.step = objectW*1.5;
                    gridDef.nbX = Math.floor( grid.width / gridDef.step);
                    gridDef.nbZ = Math.floor( grid.depth / gridDef.step);
                    gridDef.x0 = (grid.width-gridDef.nbX*gridDef.step)/2;
                    gridDef.z0 = (grid.depth-gridDef.nbZ*gridDef.step)/2;
                    
                    if(dist=='grid'){
                        nb = gridDef.nbX*gridDef.nbZ;
                    } else {
                        nb = Math.ceil(gridDef.nbX*(0.5+this.random()*0.5));
                        gridDef.jSingleRow=1+Math.round( this.random()*(gridDef.nbZ-2));
                    }
                    break;
                case 'citadel':
                {   objectW = RQMaths.M_clamp(10/layout.map.scales.max*_.upscale*(0.5 +1.5*this.random()),grid.width/15,grid.width/4);
                    gridDef.step = objectW*1.5;
                    let rndScale = 0.3+0.7*this.random();
                    let w=Math.min(grid.width-2*objectW,rndScale*grid.width);
                    let h=Math.min(grid.depth-2*objectW,rndScale*grid.depth);
                    gridDef.nbX = Math.ceil( w / gridDef.step);
                    gridDef.nbZ = Math.ceil( h / gridDef.step);
                    gridDef.step = Math.min(h/gridDef.nbX, w/gridDef.nbZ);
                    gridDef.x0 = (grid.width-gridDef.nbX*gridDef.step)/2;
                    gridDef.z0 = (grid.depth-gridDef.nbZ*gridDef.step)/2;
                    nb = gridDef.nbX*gridDef.nbZ;
                }                       
                    break;
                case 'none':
                    nb=0;
                    break;

            }

            

            for( let i=0; i<nb; i++)
            {
                // this is the mandatory options that you must pass 
                let opt={ix:0,iz:0,x:0,y:0}

                // Note to Yazid : 
                // I found it more convenient to work in the world dimensions 
                // then convert to coordinates on the grid with ix = round( x / grid.stepX)

                switch(dist){
                    case 'random':
                    {    // get a random point on the grid
                        let margin=1.5*objectW/2*1.414;
                        // TODO : compare with other previous values issued to avoid collisions
                        opt.ix = (margin+(grid.width-2*margin)*this.random())/grid.stepX;
                        opt.iz = (margin+(grid.depth-2*margin)*this.random())/grid.stepZ;
                        opt.nbLevels = Math.round( 1.2+Math.pow(this.random(),3)*12 ) ;
                    }
                       break;
                    case 'circular':
                     {  let ang=2*Math.PI*i/nb;

                        opt.iz = (grid.depth*0.5 + circleRadius*Math.sin(ang))/grid.stepZ;
                        opt.ix = (grid.width*0.5 + circleRadius*Math.cos(ang))/grid.stepX;
                        
                        let scaleAtPoints = layout.map.getScale(opt.ix,opt.iz);

                        // revised radius and coordinates
                        let circleRadiusRevised = scaleAtPoints*circleRadius/layout.map.scales.max;
                        opt.iz = (grid.depth*0.5 + circleRadius*Math.sin(ang))/grid.stepZ;
                        opt.ix = (grid.width*0.5 + circleRadiusRevised*Math.cos(ang))/grid.stepX;


                        opt.nbLevels = Math.round( map( opt.iz, 0,grid.nbZ, 2,10) ) ;
                        // Fixed rotation in circular mode, constrained to [-45;45]
                        const maxAng=45;
                        opt.yRotation = /*layout.yRotate+*/(ang/DEGTORAD);
                        while(opt.yRotation>maxAng) opt.yRotation-=90;
                        while(opt.yRotation<-maxAng) opt.yRotation+=90;

                     }
                        break;

                    case 'grid':
                    case 'single-row':
                    case 'citadel':
                    {   let isGridDist = (dist=='grid');
                        let isGridCitadel = (dist=='citadel');
                        let isSingleRow = (dist=='single-row');
                        // just skip some objects
                        if( isGridDist && this.random()<0.5)
                            continue;
                        

                        // get coordinates from the index i
                        let iObjGrid= (i%gridDef.nbX);
                        let jObjGrid = Math.floor(i/gridDef.nbX);

                        // skip inside citadel
                        if(isGridCitadel && iObjGrid>0 && iObjGrid<(gridDef.nbX-1) && jObjGrid>0 && jObjGrid<(gridDef.nbZ-1))
                            continue;

                        if(isGridDist || isGridCitadel)
                        {   if(Math.abs(layout.yRotate)>5)
                                opt.yRotation = 0;
                            opt.iz =   ( gridDef.z0 + (jObjGrid+0.5)*gridDef.step)  /grid.stepZ;
                            
                            if(isGridCitadel)
                            {   // corners
                                if( (jObjGrid==0 || jObjGrid==(gridDef.nbZ-1)) && (iObjGrid==0 || iObjGrid==(gridDef.nbX-1))     )
                                    opt.nbLevels = Math.round( 6+6*this.random()  ) ;
                                // walls 
                                else 
                                {
                                    opt.nbLevels = Math.round( 1+this.random()*3 ) ;

                                }
                            }
                            else
                                opt.nbLevels = Math.round( this.random()*RQMaths.M_map( jObjGrid, 0,gridDef.nbZ-1, 3,10) ) ;
                        }
                        else if(isSingleRow)
                        {
                            opt.yRotation = 0;
                            opt.nbLevels = Math.round(rndRange( {min:1,max:12},this.random ) );
                            jObjGrid = gridDef.jSingleRow;
                            opt.iz =   ( gridDef.z0 + (jObjGrid+0.5)*gridDef.step)  /grid.stepZ;
                        }
                        opt.ix =   ( gridDef.x0 + (iObjGrid+0.5)*gridDef.step)  /grid.stepX;
                        opt.blockW  = layout.map.getScale(opt.ix,opt.iz)*objectW;
                    }
                    break;
                    
                    case 'spiral':
                    {    //let radius = i*objectW*0.4
                        let radius  = this.spiralRadius;
                        let ang     = this.spiralAng;
                        opt.ix      = (grid.width*0.5 + radius*Math.cos(ang))/grid.stepX;
                        opt.iz      = (grid.depth*0.5 + radius*Math.sin(ang))/grid.stepZ;
                        opt.blockW  = layout.map.getScale(opt.ix,opt.iz)*objectW;
                        opt.nbLevels = Math.round( map( opt.iz, 0,grid.nbZ, 1,8) ) ;    // temp
                        
                        opt.yRotation = (ang/DEGTORAD);
                        const maxAng=45;
                        while(opt.yRotation>maxAng) opt.yRotation-=90;
                        while(opt.yRotation<-maxAng) opt.yRotation+=90;

                        
                        // ang * r = dist -> ang = dist / r    
                        this.spiralAng+= opt.blockW/radius*1.2;

                        this.spiralRadius= this.spiralAng/(2*Math.PI)*4.5*objectW;    // Controls the growth of radius
                        if(this.spiralRadius>circleRadius || ( opt.ix>=grid.nbX || opt.iz>grid.nbZ || opt.ix<=0 || opt.iz<=0))
                        {   i=nb;      // will break
                            opt=null;   // discard the object
                        }
                    }
                    break;
                }


                // x,y coordinates on screen ( that will be sent to M_draw)
                if(opt)
                {
                    let p = grid.projected(opt.ix,opt.iz);      // we won't need this
                    if(p)
                    {
                        opt.x=p.x;
                        opt.y=p.y;
                        if( false )
                        {   // Debug 
                            _.m_groups.Debug.m_strokeColor="red";
                            _.M_drawPoints(_.m_groups.Debug,[{x:p.x,y:p.y,r:1*_.upscale}]);
                        }                    
                        // a scale value 
                        opt.scale = layout.map.getScale(opt.ix,opt.iz); 

                        // let's set the block width in advance
                        opt.blockW ??= objectW*opt.scale;

                        // an optional information, the imprintRadius of a circle that will be drawn in the implantation mask to prevent planting anything in that zone
                        opt.imprintRadius = opt.blockW/2*1.3*layout.map.mmtoCoord;    // later on we will provide a imprintShape instead of just a circle radius

                        // Create the parameters for the stack here
                        this.M_createStackOfBlocks(_,opt,layout);
                        

                        // add this instance to the layout
                        out.push(opt);
                    }
                }
            }
        
            // Attribute heights 
            if( dist=="spiral")
            {   nb=out.length;
                console.log("Dist="+dist+" nb="+nb);
                for (let i=0; i<nb; i++)
                {   let opt=out[i];
                    opt.nbLevels = Math.ceil( RQMaths.M_map( i, 0,nb, 1,10) ) ;
                    //console.log("Setting level for spiral "+i+" "+opt.nbLevels);

                }

            }
        
        }
        return out;

    }
    // ------------------------------------------------------------
    //  M_createStackOfBlocks
    // ------------------------------------------------------------
    M_createStackOfBlocks(_,opt,layout)
    {

        let w= opt.blockW ?? 8*_.upscale*opt.scale;  // _.upscale is a value that translate units in millimeter into units on the canvas.
        let h=w; //8*_.upscale*opt.scale;                 
        let depth=w;


        let blocks = []
        let levels = opt.nbLevels ?? 1+Math.round(this.random()*7);
        let floor=0;

        //let nbColorsAvailable = Math.max((_.world.blocks && _.world.blocks.colors)? Object.keys(_.world.blocks.colors).length:1,1);
        
        // Get nb of colors availables ( keys named Lines1, Lines2 in blocks.colors)
        const rexp = /Lines[1-6]/
        let nbColorsAvailable = (_.world.blocks && _.world.blocks.colors) ? 
            Object.keys(_.world.blocks.colors).filter((k)=>k.match(rexp)).length : 1;
        //console.log(`got nbColorsAvailable=${nbColorsAvailable}`);


        for(let i=0;i<levels;i++){
            
            
            let typesList = (i==0)? this.m_groundBlocks : (i<(levels-1))? this.m_stackableBlocks : this.m_roofBlocks;
            let blockType =  rndArray(typesList,this.random)
            
            let colorIndex = Math.floor(this.random()*nbColorsAvailable);              
            let B = {
                blockType:  blockType,
                floorY      : floor,
                w:          w*(0.8+this.random()*0.2),
                h:          h,
                depth:      depth,
                // color:      this.colors[colorIndex],   // Will not be used directly
                group:      this.m_groups[this.M_getGroupName(colorIndex)],
                yRotate     :opt.yRotation?? -30+(this.random()*60)

            }
            // adjust block size/height 
            switch(blockType)
            {
                default:
                case BLOCK_CUBE:
                case BLOCK_PYRAMID:
                    B.w*=0.8+this.random()*0.2
                    B.h=B.w;
                    break;
                case BLOCK_CUBOID:
                case BLOCK_ROOF:
                    B.w*=0.8+this.random()*0.2
                    B.h*=0.3+this.random()*1.3
                    break;
                case BLOCK_CYLINDER:
                    B.w*=0.8+this.random()*0.2
                    B.h*=0.3+this.random()*1.3
                    B.depth=B.w;
                    break;
                case BLOCK_ARCH:
                    B.w*=0.8+this.random()*0.2;
                    B.h=B.w/2*(0.8+0.5*this.random())   
                    B.depth=B.h;
                    break;
                case BLOCK_HALFCIRCLE:
                    B.w*=0.5+this.random()*0.6
                    B.h=B.w/2;
                    B.depth=B.h*(1+0.5*this.random());
                    break;
                case BLOCK_TREE:
                    B.yRotate=-_.world.yRotate;
                    break;
                case BLOCK_BILLBOARD:
                case BLOCK_PEOPLE:
                case BLOCK_TRAFFICLIGHT:
                    B.yRotate = -_.world.yRotate +RQMaths.M_clamp(B.yRotate,-20,20);
                    break;
            }
            // First block : get relief information
            if( i==0 )
            {

                opt.yRotation??=B.yRotate;
            
                // blocks position must shift behind the origin, to avoid z-sorting issue.
                // compute how much they must shift by considering their imprint is a rectangle of width*height
                let rot = opt.yRotation;
                let p = (new RQVec2( -Math.sign(rot)*B.w/2,B.depth/2)).M_rotate(rot);
                opt.zShift = p.y;   // !!
    
                // give a shape for implantation mask
                switch(B.blockType)
                {
                    case BLOCK_CYLINDER:
                        opt.imprintShape={type:"circle", radius: B.w/2*layout.map.mmtoCoord}
                        break;
                    default:
                        opt.imprintShape={type:"rectangle", width: B.w*layout.map.mmtoCoord, depth:B.depth*layout.map.mmtoCoord, rot:rot}
                        break;
    
                }
    
    
                // Ground height
                opt.refOnMap = layout.map.pointOnMap(opt.ix,opt.iz);
    




            }


            // increase the block's floor
            if( (opt.y-(floor+B.h+(B.depth/2)*_.m_perspectiveFactor))<layout.bounds.y)
            {   // we are overflowing
                opt.nbLevels=blocks.length;
                break;
            }
            else 
            {   blocks.push(B)
                floor+=B.h;
            }
            // continue if stackable, else end the stack
            if(!this.m_stackableBlocks.includes(blockType)){
                levels=i+1
                break;
            }
        }
        opt.totalHeight = floor;
        opt.blocks= blocks;

    }

    // ------------------------------------------------------------
    //  M_draw
    // ------------------------------------------------------------

   async M_draw(_,opt,layout)
    {

		let C=new RQVec2(opt.x,opt.y);                  // C is a vec2 point on the screen, where the specie is planted
                                                        // but we don't need it anymore
        let rnd = this.random();
        
        let ThicknessMult = 0.175*_.upscale;


        let hatchOpts=
        {   gap             : 1,
            angle           : Math.round(8*this.random())*45,
            thicknessMult   : ThicknessMult,
            group           : this.m_groups.Lines1,
            thres           : 60
        };


        // Simple ellipse demo
        if( rnd<0.0)
        {
            let shape=(new RQCircle(C.x,C.y,w/2,h/2)).M_createPolyline(80);
            shape.M_translate(0,-h/2);
            this.m_groups.Lines1.m_strokeColor="rgba(0,60,0,0.8)";
            _.M_drawJaggedLine(shape,ThicknessMult,this.m_groups.Lines1 ,true);
            _.M_jaggedHatchShape(shape,hatchOpts);
            _.M_drawInMask(shape);
        }
        
        // 3D shapes
        else 
        {  

            // Create a transformation matrix
            let MV = new RQMatrix4();

            // P : creates a vec3 (convenient shortcut for readability)
            const P = (x,y,z)=>new RQVec3(x,y,z);

            // orientation : takes a vector in space, and computes the projected stroke orientation to pass to the hatch function
            // ( PS : no need to understand this to make it work )
            const orientation= (u)=> { let proj= _.M_projection( layout.grid.rotateVector(MV.M_rotateVector(u)),new RQVec2()).M_normalize(); return Math.atan2(proj.y,proj.x)/DEGTORAD-90;}
            
            // PointsToPolyline
            const PointsToPolyline=(points)=>new RQPolyLine(  points.map( (p)=>layout.grid.projection( MV.M_mutlipliedByVector(p)   )));

            // computeNormal 
            const computeNormal =(points)=>points[2].M_minus(points[1]).M_cross( points[0].M_minus(points[1])).M_normalize();
            // NewFace : creates a shape ( polyline ) from a set of 2D points, by transforming with MV + projecting each point
            let groundClip=false;
            const NewFace  = (points,uHatch,normal)=> { 
                    let shape;
                    let N = normal??computeNormal(points);
                    let Ntransf     = layout.grid.rotateVector(MV.M_rotateVector(N));
                    let isBackface  = Ntransf.M_dot(_.m_toEyeVector)<0;
                    
                    if(groundClip&&!isBackface)
                        shape=_.M_groundClip(points,MV,opt,N,isBackface)
                    if(!shape)
                        shape=PointsToPolyline(points);
                    shape.isBackface = isBackface;
                    shape.hatchOrientation = orientation(uHatch?? P(1,0,0));
                    shape.normalTransformed = Ntransf;
                    return shape;
            }

            
            let blocks = opt.blocks;
            let levels = blocks.length;

            for(let i=levels-1;i>=0;i--){
                if(i==0) groundClip=true;

                let B = blocks[i]
                MV.M_setIdentity();
                MV.M_translate(opt.refOnMap.x,opt.refOnMap.y,opt.refOnMap.z/*-opt.zShift*/);  // Temp zShift deactivated
                let rot=(B.yRotate??0)/*+_.world.yRotate*/;


                // to shift the origins to center of the shape
                //let startX = B.w/2
                //let startZ = B.depth/2


                // Definition of points (vertices) for each face
                //      y   
                //      ^
                //      |
                //      |
                //      +----->  x
                //     /
                //    /
                //   z
                let faces=[];
                let drawMasksInRow = false;
                let fRight,fFront,fTop,fLeft
                switch(B.blockType){
                    case BLOCK_CUBOID:
                    case BLOCK_CUBE: // cube

                        fRight= [ P(0,B.h,0), P(0,0,0),   P(0,0,-B.depth),  P(0,B.h,-B.depth)];
                        fLeft= [ P(-B.w,B.h,0), P(-B.w,B.h,-B.depth),P(-B.w,0,-B.depth), P(-B.w,0,0) ];
                        fFront= [ P(0,0,0), P(0,B.h,0),   P(-B.w,B.h,0),      P(-B.w,0,0), P(0,0,0)];
                        fTop=   [ P(0,B.h,0), P(0,B.h,-B.depth), P(-B.w,B.h,-B.depth), P(-B.w,B.h,0)   ];
                        if(rot)
                            MV.M_rotate(rot,0,1,0);
                        MV.M_translate(B.w/2,B.floorY,B.depth/2);

                        faces.push( 
                            NewFace(fTop ,  P(1,0,1)), 
                            NewFace(fFront, P(1,0,0)) ,
                            NewFace(fRight, P(0,0,1)), 
                            NewFace(fLeft, P(0,0,1))
                        );
            
                    break;
                    case BLOCK_PYRAMID:

                        fRight= [ P(-B.w/2,B.h,-B.depth/2), P(0,0,0),   P(0,0,-B.depth),  P(-B.w/2,B.h,-B.depth/2)];
                        fLeft= [ P(-B.w/2,B.h,-B.depth/2),   P(-B.w,0,-B.depth),  P(-B.w,0,0), P(-B.w/2,B.h,-B.depth/2)];
                        fFront= [ P(0,0,0), P(-B.w/2,B.h,-B.depth/2),   P(-B.w/2,B.h,-B.depth/2), P(-B.w,0,0), P(0,0,0)];
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(B.w/2,B.floorY,B.depth/2);
                        
                        faces.push( 
                            NewFace(fRight, P(0,0,1)), 
                            NewFace(fLeft, P(0,0,1)), 
                            NewFace(fFront, P(1,0,0)) 
                        );

                    break;
                    case BLOCK_ROOF:
                        fRight= [ P(-B.w/2,B.h,0), P(0,0,0),   P(0,0,-B.depth),  P(-B.w/2,B.h,-B.depth),P(-B.w/2,B.h,0)]    
                        fFront= [ P(0,0,0), P(-B.w/2,B.h,0),   P(-B.w/2,B.h,0), P(-B.w,0,0), P(0,0,0)];
                        fTop =  [ P(-B.w,0,0), P(-B.w/2,B.h,0),  P(-B.w/2,B.h,-B.depth), P(-B.w,0,-B.depth), P(-B.w,0,0) ];
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(B.w/2,B.floorY,B.depth/2);

                        faces.push( 
                            NewFace(fTop,   P(0,0,1)), 
                            NewFace(fRight, P(0,0,1)), 
                            NewFace(fFront, P(1,0,0)) 
                        );
                    break;
                    case BLOCK_CYLINDER:
                    {   
                        MV.M_translate(0,B.floorY,0);
                        MV.M_rotate(-_.world.yRotate,0,1,0);    // always frontfacing

                        // Top
                        let r=B.w/2
                        fTop = []
                        let nbPoints=30;
                        let step=Math.PI*2/nbPoints;
                        for(let t=Math.PI*2,k=0;k<=nbPoints;t-=step,k++){
                            let cX = r*Math.cos(t)
                            let cY = r*Math.sin(t)
                            fTop.push(P(cX,B.h,cY))
                        }
                        fTop.push(P(r*Math.cos(PI*2),B.h,r*Math.sin(PI*2)))
                        // Front
                        fFront = []
                        nbPoints/=2;
                        step=Math.PI/nbPoints;
                        for(let t=Math.PI,k=0;k<=nbPoints;t-=step,k++){
                            let cX = r*Math.cos(t)
                            let cY = r*Math.sin(t)
                            fFront.push(P(cX,B.h,cY))       // append the top point to the end
                            fFront.splice(0,0,P(cX,0,cY));  // insert the bottom point in the begining of the array
                        }
                        fFront.push(fFront[0].clone());  // close the shape
                        
                        // make an arc
                        let arc = [];
                        let isDither=true || this.random()>0.6;
                        if(isDither)
                            nbPoints=100;
                        let kGap=0.95;
                        step=kGap*Math.PI/nbPoints;
                        for(let t=kGap*Math.PI,k=0;k<=nbPoints;t-=step,k++){
                            arc.push(P(r*Math.cos(t),0,r*Math.sin(t)));           // create a arc at y=0 to use for hatches
                        }

                       let f1;
                       faces.push(
                            NewFace(fTop,   P(1,0,1), P(0,1,0)),
                            f1=NewFace(fFront,   P(0,1,0), P(0,0,1))
                        )
                        // note that we will do our own hatch
                        f1.arc= PointsToPolyline(arc);
                        f1.customHatch=(face,B,hatchOpts)=>{
                            let OBB = _.M_makeClipOBB(face,{thres:hatchOpts.thres});
                            if(OBB)
                            {   
                                let minY = face.minY??0;
                                let nbPoints=face.arc.m_points.length;
                                let gap  = hatchOpts.gap*(isDither?0.8:1);
                                let nbJ=Math.ceil((B.h-minY)/gap)
                                if(minY)
                                    face.arc.M_translate(0,-minY);

                                for(let j=0; j<nbJ; j++)
                                {   if(isDither)
                                        for(let u=0;u<nbPoints;u++ )
                                        {   //face.arc.m_points[u].penUp=(j%2) && Math.pow((u/nbPoints),0.8)*Math.random()<0.3;
                                            face.arc.m_points[u].penUp=((j+u)%2)>=0 && ((u+j%4)%5)>=(u/10);
                                        }
                                    _.M_drawJaggedLine(face.arc,ThicknessMult,hatchOpts.group ,true,OBB.clipOpts);
                                    face.arc.M_translate(0,-gap);
                                }
                            }
                        };

                    }
                    break;
                    case BLOCK_HALFCIRCLE:
                    {
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(B.w/2,B.floorY,B.depth/2);
                        let radius=B.w/2;

                        let nbPoints=40;
                        let step=Math.PI/nbPoints;
                        fFront=[];
                        let p=new RQVec2();
                        let prevP; 
                        let arcFront=[], arcBack=[];
                        for(let t=Math.PI,iPoint=0;iPoint<=nbPoints;t-=step,iPoint++){
                            p.M_set( -B.w/2+radius*Math.cos(t) , radius*Math.sin(t) )
                            // Font face is just the arc
                            fFront.push(P(p.x,p.y,0))
                            // Top face : 
                            // we make a small rectangle which is only the width of a step
                            // we compute its normal, and if it's not a backface, we accumulate this small rectangle into a bigger shape 
                            if(iPoint>0)
                            {   let points=[P(prevP.x,prevP.y,0),P(p.x,p.y,0),P(p.x,p.y,-B.depth),P(prevP.x,prevP.y,-B.depth)];
                                let Ntransf     = layout.grid.rotateVector(MV.M_rotateVector(computeNormal(points)));
                                let isBackface  = Ntransf.M_dot(_.m_toEyeVector)<0;
                                if(!isBackface)
                                {   if(arcFront.length==0)
                                    {   arcFront.push(points[0]);
                                        arcBack.push(points[3]);
                                    }
                                    arcFront.push(points[1]);
                                    arcBack.splice(0,0,points[2]);
                                }
                            }
                            prevP=p.clone();
                        }
                        fFront.push(fFront[0].clone())   // close path
                        if(arcFront.length)
                        {   arcFront.push(...arcBack,arcFront[0]);  // merge front/back and close path                                
                            faces.push(NewFace( arcFront,P(0,0,1),P(0,1,0)));
                        }
                        faces.push( 
                            NewFace(fFront ,  P(1,1,0),   P(0,0,1)), 
                        );
                    }
                    break;
                    case BLOCK_ARCH:
                     {  
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(B.w/2,B.floorY,B.depth/2);
                        let radius=Math.min(B.h*0.9,B.w/2*0.6);

                        fRight= [ P(0,B.h,0), P(0,0,0),   P(0,0,-B.depth),  P(0, B.h,-B.depth)];
                        fLeft= [ P(-B.w,B.h,0), P(-B.w,B.h,-B.depth),P(-B.w,0,-B.depth), P(-B.w,0,0) ];
                        fFront= [ P(0,0,0), P(0,B.h,0),   P(-B.w,B.h,0),      P(-B.w,0,0)];
                        let fArcLeft=[],fArcRight=[];
                        let nbPoints=20;
                        let step=Math.PI/nbPoints;
                        for(let t=Math.PI,iPoint=0;iPoint<=nbPoints;t-=step,iPoint++){
                            let cX = -B.w/2+radius*Math.cos(t)
                            let cY = radius*Math.sin(t)
                            fFront.push(P(cX,cY,0))
                            if(iPoint<(nbPoints/2))
                            {   fArcLeft.splice(0,0,P(cX,cY,0))
                                fArcLeft.push(P(cX,cY,-B.depth))
                            }else 
                            {   fArcRight.push(P(cX,cY,0))
                                fArcRight.splice(0,0,P(cX,cY,-B.depth))
                            }
                        }
                        fFront.push(P(0,0,0))
                        fArcLeft.push(fArcLeft[0].clone());
                        fArcRight.push(fArcRight[0].clone());
                        fTop=   [ P(0,B.h,0), P(0,B.h,-B.depth),  P(-B.w,B.h,-B.depth), P(-B.w,B.h,0) , P(0,B.h,0)];
                        let f1;
                        faces.push( 
                            NewFace(fTop ,  P(1,0,1),   P(0,1,0)), 
                            NewFace(fRight, P(0,0,1),   P(1,0,0)), 
                            NewFace(fLeft, P(0,0,1),   P(-1,0,0)), 
                            NewFace(fFront, P(1,0,0),  P(0,0,1)),
                            f1=NewFace(fArcLeft,P(0,0,1),  P(1,0,0)),
                            NewFace(fArcRight,P(0,0,1),   P(-1,0,0))
                        );
                        f1.maskBefore=true;
                    }
                    break;
                    case BLOCK_PEOPLE:
                        // B.color='#f1f1f1'
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(0,B.floorY,0);
                        fFront = []
                        // head
                        let r = B.w/20
                        for(let t=-PI*1.5;t<=PI*0.5;t+=PI/30){
                            let cX = r*Math.cos(t)
                            let cY = B.h/2+r*Math.sin(t)
                            fFront.push(P(cX,cY,0))
                        }
                        let f6;
                        faces.push( 
                            f6=NewFace(fFront, P(1,0,0)) 
                        );
                        f6.maskBefore=true;
                        if(this.random()>0.5){ // girl body
                            fFront = [
                                P(0,0,0), 
                                P(B.w/10,0,0),
                                P(0,B.h/2,0),  
                                P(-B.w/10,0,0),
                                P(0,0,0)
                            ];
                            faces.push( 
                                NewFace(fFront, P(1,0,0)) 
                            );
                        } else { // boy body
                            fFront = [
                                P(0,0,0), 
                                P(B.w/10,0,0),
                                P(B.w/10,B.h/2-r,0),  
                                P(-B.w/10,B.h/2-r,0),
                                P(-B.w/10,0,0),
                                P(0,0,0)  
                            ];
                            faces.push( 
                                NewFace(fFront, P(1,0,0)) 
                            );
                        }

                        break;
                    case BLOCK_BILLBOARD:
                        // B.color='#f1f1f1'
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(0,B.floorY,0);
                        fFront = [
                            P(B.w/2.5,0,0), 
                            P(B.w/2.5,B.h*0.45,0),  
                            P(B.w/2.5-B.w/20,B.h*0.45,0),  
                            P(B.w/2.5-B.w/20,0,0),
                            P(B.w/2.5,0,0)
                        ];
                        faces.push( 
                            NewFace(fFront, P(1,0,0)) 
                        );

                        fFront = [
                            P(-B.w/2.5+B.w/20,0,0), 
                            P(-B.w/2.5+B.w/20,B.h*0.45,0),  
                            P(-B.w/2.5,B.h*0.45,0),
                            P(-B.w/2.5,0,0),
                            P(-B.w/2.5+B.w/20,0,0)
                        ];
                        faces.push( 
                            NewFace(fFront, P(1,0,0)) 
                        );

                        fFront = [
                            P(B.w/2.5,B.h*0.45,0), 
                            P(B.w/2.5,B.h*0.9,0), 
                            P(-B.w/2.5,B.h*0.9,0), 
                            P(-B.w/2.5,B.h*0.45,0),   
                            P(B.w/2.5,B.h*0.45,0),     
                        ];
                        faces.push( 
                            NewFace(fFront, P(1,0,0)) 
                        );
                    break;
                    case BLOCK_TREE:
                    {    // B.color='#127740'
                        //if(rot) MV.M_rotate(rot,0,1,0);
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(0,B.floorY,0);
                        let treeH = B.h/(1+this.random()*1)
                        fFront = [
                            P(0,0,0), 
                            P(B.w/20,0,0),
                            P(B.w/20,treeH,0),  
                            P(0,treeH,0),  
                            P(0,treeH,0),
                            P(-B.w/20,treeH,0),
                            P(-B.w/20,0,0),
                            P(0,0,0)
                        ];
                        faces.push( 
                            NewFace(fFront, P(1,0,0)) 
                        );
                        fFront = []
                        let treeR = B.w/(1.5+this.random()*1.5)
                        let nbPts=60;
                        let step=2*PI/nbPts;
                        
                        for(let t=-PI*1.5,j=0;j<=nbPts;t+=step,j++){
                            let r = treeR
                            let cX = +r*Math.cos(t)
                            let cY = treeH+r+r*Math.sin(t)
                            fFront.push(P(cX,cY,0))
                        }
                        faces.push( 
                            NewFace(fFront, P(1,0,0)) 
                        );
                    }
                    break;
                    case BLOCK_TRAFFICLIGHT:
                        // B.color='#23120b'
                        if(rot) MV.M_rotate(rot,0,1,0);
                        MV.M_translate(0,B.floorY,0);
                        let poleH = B.h/1.5
                        let f9;
                        fFront = [
                            P(0,0,0), 
                            P(B.w/40,0,0),
                            P(B.w/40,poleH,0),  
                            P(0,poleH,0),  
                            P(0,poleH,0),
                            P(-B.w/40,poleH,0),
                            P(-B.w/40,0,0),
                            P(0,0,0)
                        ];
                        faces.push( 
                            f9=NewFace(fFront, P(1,0,0)) 
                        );
                        f9.maskBefore=true;

                        let panelH = B.h/1.25

                        let lightR = B.w/10/2
                        for(let i=1;i<4;i++){
                            fFront = []
                            for(let t=-PI*1.5;t<=PI*0.5;t+=PI/30){
                                let r = lightR
                                let cX = r*Math.cos(t)
                                let cY = poleH+(panelH/4*i)+r+r*Math.sin(t)
                                fFront.push(P(cX,cY,0))
                            }
                            faces.push( 
                                NewFace(fFront, P(1,0,0)) 
                            );
                        }

                        fFront = [
                            P(0,poleH,0), 
                            P(B.w/10,poleH,0),
                            P(B.w/10,poleH+panelH,0),  
                            P(0,poleH+panelH,0),  
                            P(0,poleH+panelH,0),
                            P(-B.w/10,poleH+panelH,0),
                            P(-B.w/10,poleH,0),
                            P(0,poleH,0)
                        ];
                        faces.push( 
                            NewFace(fFront, P(1,0,0)) 
                        );

                        fTop = []
                        for(let t=-PI*1.5;t<=PI*0.5;t+=PI/30){
                            let r = B.w/10
                            let cX = r*Math.cos(t)
                            let cY = r*Math.sin(t)
                            fTop.push(P(cX,0,cY))
                        }
                        faces.push( 
                            NewFace(fTop,   P(0,0,1), P(0,1,0)),
                        );
                    break;
                }
                // 
                let hatchDensity = 0.5+0.5*this.random();
                // draw each shape the way we know
                for( let i=0; i<faces.length; i++)
                {   
                    let f=faces[i]
        
                    // little trick we need for face masking 
                    if(f.maskBefore)
                    {   drawMasksInRow=true;
                        for(let j=0;j<i;j++)
                        {   if(!faces[j].isBackface)
                                _.M_drawInMask(faces[j],faces[j].maskOpt??{});

                        }
                    }

                    if(!f.isBackface)
                    {   

                        let isOutlines = this.m_groups.Faces.m_active;

                        // We can use the face normal, and dot product with a light direction to make a simplistic lighting effect
                        // We adjust the gap depending on the orientation of the face
                        if( true )
                        {
                            let lighting = (1+f.normalTransformed.M_dot(_.m_lightSource))*0.5;
                            lighting=RQMaths.smoothStep(lighting);// Math.pow(lighting,1.5);
                
                            hatchOpts.gap = (0.1+lighting*(isOutlines?0.6:1.2))*_.upscale*hatchDensity;

                        }

                        if(groundClip && !f.isBackface)
                            _.M_drawSandLines();
                        


                        // Draw hatches
                        if(!isOutlines) f.maskOpt={protect:0}
                        hatchOpts.angle = f.hatchOrientation;
                        hatchOpts.group = B.group;
                        if(f.customHatch)
                            f.customHatch(f,B,hatchOpts)
                        else
                            _.M_jaggedHatchShape(f,hatchOpts);

                        
                        // Draw outlines                        
                        if(isOutlines)
                        {    _.M_drawJaggedLine(f,ThicknessMult*1.6,this.m_groups.Faces ,true,{thres:60});
                        }


                        // Fill face
                        
                        let F=B.group.fill?B.group.fill: this.m_groups.Faces.fill;
                        if(F && F.m_active)
                            _.M_fillShape(F,f,{});

    

                        if(drawMasksInRow)
                            _.M_drawInMask(f,f.maskOpt??{});

                    }
                }
                
                // Mask 
                if(!drawMasksInRow)
                    for( let i=0; i<faces.length; i++)
                        if(!faces[i].isBackface )
                            _.M_drawInMask(faces[i],faces[i].maskOpt??{});


            }

        }

    }



}

PlantSpecies.M_register("RootsExamples",{ factory:SpeciesExample.create});