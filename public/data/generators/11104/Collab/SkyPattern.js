class SkyPattern
{
    constructor(rnd,type,group)
    {
        this.random=rnd;
        this.m_type=type;
        this.m_group=group;
    }

    // M_draw
    // draws a pattern inside a shape (screen context, 2D)
    M_draw(_,shape)
    {
        let strokeWidth=this.m_group.m_strokeWidth*_.upscale;   
        // bounds : you get a rectangle object {x,y,w,h}  with origin top left of screen
        let bounds = shape.M_getAABB();

        // P : utility function to create a vec2 
        const P = (x,y)=>new RQVec2(x,y);

        // Debug draw the shape
        //_.M_drawLines(this.m_group,shape,false);

        // If we want to clip lines to the shape
        let clipOpts;
        if( true)   
        {   let OBB = _.M_makeClipOBB(shape);
            if(OBB)
                clipOpts=OBB.clipOpts
        }
        _.M_log(`Drawing sky pattern "${this.m_type}" bounds=${bounds.M_getString()}`);
        
        let ThicknessMult=strokeWidth??0.25*this.upscale;           
        
        switch(this.m_type)
        {
            case "default":
                for(let i=0; i<500; i++)
                {
                    let p0 = P( bounds.x+bounds.w*this.random(), bounds.y+bounds.h*this.random());
                    let a = this.random()*180*DEGTORAD;
                    let r = ( 2+5*this.random())*_.upscale;

                    let u = P(r*Math.cos(a), r*Math.sin(a));
                    let line = new RQPolyLine([ P(p0.x-u.x,p0.y-u.y),P(p0.x+u.x, p0.y+u.y) ]);      // you can either create a RQPolyline and passing an array of points, or create an empty RQPolyLine and use M_addPoint to append points

                    _.M_drawLines(this.m_group,line,true,clipOpts);
                }
                break;
            case "none":
                break;
            case "dummy":
                {   _.M_drawLines(this.m_group, new RQLine( bounds.topLeft(), bounds.bottomRight() ),true,clipOpts);
                    _.M_drawLines(this.m_group, new RQLine( bounds.bottomLeft(), bounds.topRight() ),true,clipOpts);

                }
                break;
            case "sun":
                {   let gap = 15
                    let nbRows = Math.round(bounds.h/gap);  // --> finite number of rows
                    gap = bounds.h/nbRows;                  // --> gap gets the floating point value

                    for(let i=0;i<nbRows;i++){              // --> we are 100% sure we cover the zone perfectly
                        let line = new RQPolyLine([ P(bounds.x,bounds.y+(i+0.5)*gap),P(bounds.x+bounds.w, bounds.y+(i+0.5)*gap) ]); // +0.5 --> place the line in the middle of a row, so that we have a half space at start and end

                        // hatched
                        ThicknessMult = strokeWidth*1.5;
                        /*
                        let hatchOpts=
                        {   gap             : 1*_.upscale,//Math.round(0.5+this.random()*2)*_.upscale,
                            angle           : 90,                             // 0 = vertical 90 = horizontal
                            thicknessMult   : ThicknessMult,
                            group           : this.m_group
                        };
                        */
                        _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                    }
                }
                break;
            case "leaves":
            {
                let gridSize = 50
                let cols = Math.ceil(bounds.w/gridSize)
                let rows = Math.ceil(bounds.h/gridSize)

                for(let i=0;i<rows;i++){
                    for(let j=0;j<cols;j++){
                        let line = new RQPolyLine()
                        let startAngle = (j%2==0)?PI/2:0
                        let endAngle = (j%2==0)?PI:PI/2
                        let originX = bounds.x+(((j%2==0)?j+1:j+0)*gridSize)
                        let originY = bounds.y+(((j%2==0)?i+0:i+0)*gridSize)
                        for(let k=startAngle;k<endAngle;k+=PI/4/20){
                            let x = originX + gridSize*Math.cos(k)
                            let y = originY + gridSize*Math.sin(k)
                            line.M_addPoint(x,y)
                        }
                        startAngle = (j%2==0)?-PI/2:PI
                        endAngle = (j%2==0)?0:PI*1.5
                        originX = bounds.x+(((j%2==0)?j+0:j+1)*gridSize)
                        originY = bounds.y+(((j%2==0)?i+1:i+1)*gridSize)
                        for(let k=startAngle;k<endAngle;k+=PI/4/20){
                            let x = originX + gridSize*Math.cos(k)
                            let y = originY + gridSize*Math.sin(k)
                            line.M_addPoint(x,y)
                        }
                        line.M_closePath()
                        // _.M_drawLines(this.m_group,line,true,clipOpts);

                        // hatched
                        ThicknessMult = strokeWidth;
                        /*
                        let hatchOpts=
                        {   gap             : 1*_.upscale,//Math.round(0.5+this.random()*2)*_.upscale,
                            angle           : 90,                             // 0 = vertical 90 = horizontal
                            thicknessMult   : ThicknessMult,
                            group           : this.m_group
                        };
                        */
                        _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                    }
                }
            }
                break;
            case "grid":
            {   let gap=50;
                let nb=Math.round(bounds.w/gap);    // --> finite number of cells accross the width
                gap = bounds.w/nb;                  // --> floating point gap


                ThicknessMult = strokeWidth;
                for(let i=0;i<bounds.h/gap;i++){
                    let line = new RQPolyLine([ P(bounds.x,bounds.y+i*gap),P(bounds.x+bounds.w, bounds.y+i*gap) ]);
                    // _.M_drawLines(this.m_group,line,true,clipOpts);
                    _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                }
                for(let i=0;i<nb;i++){
                    let line = new RQPolyLine([ P(bounds.x+i*gap,bounds.y),P(bounds.x+i*gap, bounds.y+bounds.h) ]);
                    // _.M_drawLines(this.m_group,line,true,clipOpts);
                    _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                }
            }
                break;
            case "dots":
            {
                let gridSize = 50
                let cols = Math.ceil(bounds.w/gridSize)
                let rows = Math.ceil(bounds.h/gridSize)
                let r = 10
                ThicknessMult = strokeWidth;
                for(let i=0;i<rows;i++){
                    for(let j=0;j<cols+1;j++){
                        let originX = bounds.x+(((i%2==0)?j+0.5:j-1)*gridSize)
                        let originY = bounds.y+((i+0.5)*gridSize)

                        let lineSpacing = 2;
                        let circleLines = (r*2) / lineSpacing;
                        
                        for (let k=0;k<=circleLines;k++) {
                            let line = new RQPolyLine()
                            let sagittaLength = (k*lineSpacing) + lineSpacing;
                            let chordLength = (Math.sqrt((2*sagittaLength*r) - (sagittaLength*sagittaLength))*2);
                            let x1 = originX - (chordLength/2)
                            let y1 = originY - r + (k*lineSpacing)
                            let x2 = originX - (chordLength/2) + chordLength
                            line.M_addPoint(x1,y1)
                            line.M_addPoint(x2,y1)
                            line.M_closePath()
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                        }

                    }
                }
            }
                break;
            case "chevron":
            {
                let gridSize = 100
                let cols = Math.ceil(bounds.w/gridSize)
                let rows = Math.ceil(bounds.h/gridSize)
                ThicknessMult = strokeWidth;
                for(let i=0;i<rows;i++){
                    for(let j=0;j<cols+1;j++){                            
                        let line = new RQPolyLine()
                        line.M_addPoint(bounds.x+(j+0)*gridSize,bounds.y+(i+0)*gridSize)
                        line.M_addPoint(bounds.x+(j+0)*gridSize,bounds.y+(i+0.5)*gridSize)
                        line.M_addPoint(bounds.x+(j+0.5)*gridSize,bounds.y+(i+0)*gridSize)
                        _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                        line = new RQPolyLine()
                        line.M_addPoint(bounds.x+(j+0.5)*gridSize,bounds.y+(i+0)*gridSize)
                        line.M_addPoint(bounds.x+(j+1.0)*gridSize,bounds.y+(i+0.5)*gridSize)
                        line.M_addPoint(bounds.x+(j+1.0)*gridSize,bounds.y+(i+1.0)*gridSize)
                        line.M_addPoint(bounds.x+(j+0.5)*gridSize,bounds.y+(i+0.5)*gridSize)
                        line.M_closePath()
                        _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                        line = new RQPolyLine()
                        line.M_addPoint(bounds.x+(j+0)*gridSize,bounds.y+(i+1.0)*gridSize)
                        line.M_addPoint(bounds.x+(j+0.5)*gridSize,bounds.y+(i+0.5)*gridSize)
                        line.M_addPoint(bounds.x+(j+0.5)*gridSize,bounds.y+(i+1.0)*gridSize)
                        _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                    }
                }
            }
                break;
            case "jellybeans":
            {
                let gridW = 40
                let gridH = gridW/1.25
                let cols = Math.ceil(bounds.w/gridW)
                let rows = Math.ceil(bounds.h/gridH)
                ThicknessMult = strokeWidth;
                for(let i=0;i<rows;i++){
                    for(let j=0;j<cols+1;j++){
                        if(j%2==0){
                            let line = new RQPolyLine()
                            line.M_addPoint(bounds.x+((i%2==0)?j+0:j-1)*gridW,bounds.y+(i+0.15)*gridH)
                            line.M_addPoint(bounds.x+((i%2==0)?j+1:j+0)*gridW,bounds.y+(i+0.15)*gridH)
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                            line = new RQPolyLine()
                            line.M_addPoint(bounds.x+((i%2==0)?j+0:j-1)*gridW,bounds.y+(i+0.85)*gridH)
                            line.M_addPoint(bounds.x+((i%2==0)?j+1:j+0)*gridW,bounds.y+(i+0.85)*gridH)
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                        } else {
                            let startAngle = -PI/2
                            let endAngle = PI/2
                            let originX = bounds.x+(((i%2==0)?j+0:j-1)*gridW)
                            let originY = bounds.y+((i+0.5)*gridH)
                            line = new RQPolyLine()
                            for(let k=startAngle;k<endAngle;k+=PI/2/10){
                                let x = originX + gridH*0.7/2*Math.cos(k)
                                let y = originY + gridH*0.7/2*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                            startAngle = PI/2
                            endAngle = PI*1.5
                            originX = bounds.x+(((i%2==0)?j+1:j+0)*gridW)
                            originY = bounds.y+((i+0.5)*gridH)
                            line = new RQPolyLine()
                            for(let k=startAngle;k<endAngle;k+=PI/2/10){
                                let x = originX + gridH*0.7/2*Math.cos(k)
                                let y = originY + gridH*0.7/2*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                        }
                    }
                }
            }
                break;
            case "ocean":
            {
                let gridSize = 120
                let cols = Math.ceil(bounds.w/gridSize)
                let rows = Math.ceil(bounds.h/gridSize)
                ThicknessMult = strokeWidth;
                for(let i=0;i<rows;i++){
                    for(let j=0;j<cols+1;j++){
                        let startAngle = -PI
                        let endAngle = 0
                        let originX = bounds.x+((j+0.5)*gridSize)
                        let originY = bounds.y+((i+1)*gridSize)
                        let r = gridSize/2
                        for(let l=0;l<2;l++){
                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                            r = r*0.8
                        }

                        startAngle = -PI/2
                        endAngle = 0
                        originX = bounds.x+((j+0)*gridSize)
                        originY = bounds.y+((i+0.5)*gridSize)
                        r = gridSize/2
                        for(let l=0;l<2;l++){
                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                            r = r*0.8
                        }

                        startAngle = -PI
                        endAngle = -PI/2
                        originX = bounds.x+((j+1)*gridSize)
                        originY = bounds.y+((i+0.5)*gridSize)
                        r = gridSize/2
                        for(let l=0;l<2;l++){
                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                            r = r*0.8
                        }
                    }
                }
            }
                break;
            case "flowers":
                {
                    let gridSize = 120
                    let cols = Math.ceil(bounds.w/gridSize)
                    let rows = Math.ceil(bounds.h/gridSize)
                    ThicknessMult = strokeWidth;
                    for(let i=0;i<rows;i++){
                        for(let j=0;j<cols+1;j++){
                            let startAngle = -PI/2
                            let endAngle = PI/2
                            let originX = bounds.x+((j+0)*gridSize)
                            let originY = bounds.y+((i+0.5)*gridSize)
                            let r = gridSize/2

                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
    
                            startAngle = PI/2
                            endAngle = PI*1.5
                            originX = bounds.x+((j+1)*gridSize)
                            originY = bounds.y+((i+0.5)*gridSize)

                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                            startAngle = 0
                            endAngle = PI
                            originX = bounds.x+((j+0.5)*gridSize)
                            originY = bounds.y+((i+0)*gridSize)

                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);

                            startAngle = PI
                            endAngle = PI*2
                            originX = bounds.x+((j+0.5)*gridSize)
                            originY = bounds.y+((i+1)*gridSize)

                            line = new RQPolyLine()
                            for(let k=startAngle;k<=endAngle;k+=PI/20){
                                let x = originX + r*Math.cos(k)
                                let y = originY + r*Math.sin(k)
                                line.M_addPoint(x,y)
                            }
                            _.M_drawJaggedLine(line,ThicknessMult,this.m_group,true,clipOpts);
                        }
                    }
                }
                    break;
        }



    }

}