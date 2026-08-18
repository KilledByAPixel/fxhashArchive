// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

class SketchyShape {
    constructor() {
        this.wt = 1;
        this.maxV = 3;
        this.acc = 0.005;
        this.c = color(0, 64);
        this.density = 1;
        this.wobble = 0;
        this.angle = 0;

        this.lineLen = 0;
    }

    update() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        if (this.lineLen == 0) {
            if (this.drawBg != undefined) {
                this.drawBg();
            }
        }

        let targetPoint = this.points[this.penTargetIndex];
        let dx = targetPoint.x - this.pen.x;
        let dy = targetPoint.y - this.pen.y;
        let ax = dx * this.acc;
        let ay = dy * this.acc;
        this.penV.x += ax;
        this.penV.y += ay;

        let wobbleV = _rotate({ x: this.wobble, y: 0, z: 0 }, random(TAU), 0, 0);
        this.penV.x += wobbleV.x;
        this.penV.y += wobbleV.y;

        this.penV.x *= 0.8;
        this.penV.y *= 0.8;

        let vMag = _mag(this.penV);
        if (vMag > this.maxV) {
            this.penV = _setMag(this.penV, this.maxV);
        }


        this.lineLen += vMag;

        this._pen.x = this.pen.x;
        this._pen.y = this.pen.y;

        this.pen.x += this.penV.x;
        this.pen.y += this.penV.y;

        let distSq = sq(targetPoint.x - this.pen.x) + sq(targetPoint.y - this.pen.y);
        if (distSq < 9) {
            this.penTargetIndex++;
            if (this.penTargetIndex >= this.points.length) {
                pop();
                this.points = null;
                return "done";
            }
        }

        noStroke();
        fill(this.c);

        let nDots = this.density;
        let offset = { x: 0, y: 0, z: 0 };
        for (let i = 0; i < nDots; i++) {
            offset.x =
                sqrt(random()) *
                map(noise(this.lineLen * 0.001), 0, 1, 0.5, 1) *
                this.wt / 2;
            offset.y = 0;
            offset = _rotate(offset, random(TAU), 0, 0);
            circle(this.pen.x + offset.x, this.pen.y + offset.y, 1);
        }
        pop();
    }

    setWeight(wt) {
        this.wt = wt;
    }

    setMaxV(mv) {
        this.maxV = mv;
    }

    setAcc(a) {
        this.acc = a;
    }

    setColor(c) {
        this.c = c;
    }

    setDensity(d) {
        this.density = d;
    }

    setWobble(w) {
        this.wobble = w;
    }

    setAngle(a) {
        this.angle = a;
    }
}