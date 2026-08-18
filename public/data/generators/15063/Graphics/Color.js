class RQColor
{

    constructor(c)
    {

        this.m_gradient = RQColor.sM_convert(c);
        

    }
  
    static sM_convert(c)
    {
        let matches = c.match(/linear\-gradient\(([0-9\.\%\,\sa-zA-Z\(\)]+)\)\;?/);
        if( matches!=null)
        {
            let gradient={stops:[]};
            let grad = matches[1];
            // example = 90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%
            var colorRegexp = /((rgba\([0-9\.\,]+\)|[a-zA-Z]+)\s+([0-9\.]+)\%)/g,
            colmatches;

            while (colmatches = colorRegexp.exec(grad)) {
                // 2 : color
                // 3 : %
               gradient.stops.push({color:colmatches[2],percent:parseFloat(colmatches[3])});   
            }
            return gradient;
        }

    }
    M_createContextGradient(ctx,p1,p2)
    {
        if(this.m_gradient && ctx)
        {
            var gradient = ctx.createLinearGradient(p1.x,p1.y, p2.x, p2.y);
            for( let i=0; i<this.m_gradient.stops.length; i++)
            {   let stop=this.m_gradient.stops[i];
                gradient.addColorStop(stop.percent/100, stop.color );
            }
            ctx.fillStyle = gradient;
            return gradient;
        }

    }

};