class Sb2 {
    color(col) {
        this.col = col;
    }
  
    xW(pixels) {
        this.cK = pixels;
    }
  
    yW(length) {
        
        var curve = this.Kt(this.cK, length); 
        var nS = this.vT(this.cK);

        for (let i=0; i<nS; i++) {
            var points = this.rC(curve, this.cK);
            var c = this.rCol(this.col);
            var weight = this.rmS(this.cK);
    
            noFill();
            stroke(c);
            strokeWeight(weight);

            beginShape();
            for (let point of points) {
                curveVertex(point.x, point.y);
            }
            endShape();
        }
    }

    Kt(cK, length) {
        var nPoints = length;
        var points = [];
        var direction = fxrand_range(-5, 5); 
        for (let i=0; i<=nPoints; i++) {
            points.push({x: lerp(0, length, float(i)/nPoints), y: lerp(0, cK/4.0, direction * pow(float(i)/nPoints,3))});
        }
        return points;
    }

    vT(cK) {
        var {minWeight, maxWeight} = this.mmS(cK);
        var aT = 0.5 * (minWeight + maxWeight); 
        var nS = 4 * cK / aT;
        return nS;
    }

    rC(curve, cK) {
        var w = cK;
        var length = max(curve.map(point => point.x));
        var deltaY = fxrand_range(-w/2, w/2);
        var begin = fxrand_range(0, 42);
        var end = (curve.length - w * pow(deltaY/w, 2) - (w / 3.0) * (0.7 - noise(3 * deltaY / w)) - fxrand_range(0, 10.0));
        let points = curve.slice(begin, end);
        points = points.map(point => {
            var newY = (point.y + deltaY + deltaY / 3.0 * pow(point.x / float(length), 2) * noise(point.x / 100.0, point.y/ 100.0));
            return {x: point.x, y: newY,};})
        return points;
    }

    rCol(col) {
        var cMode = colorMode();
        colorMode(HSB);
        var newColor = color(col._getHue() + fxrand_range(0, 10), col._getSaturation() + fxrand_range(-10, 10), col._getBrightness() + fxrand_range(-10, 10), col._getAlpha(),);
        colorMode(cMode);
        return newColor
    }


    mmS(cK) {
        var maxWeight = min(cK / 10.0, 3);
        var minWeight = maxWeight / 10.0;
        return {minWeight, maxWeight}
    }

    rmS(cK) {
        var {minWeight, maxWeight} = this.mmS(cK);
        return fxrand_range(minWeight, maxWeight);
    }

}