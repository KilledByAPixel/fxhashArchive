// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

class SketchyEllipse extends SketchyShape {
    // top left: x1, y1
    // top right: x2, y2
    // bottom right: x3, y3
    // bottom left: x4, y4
    constructor(cx, cy, rx, ry, hatchDensity, outline) {
        super();
        this.x = cx;
        this.y = cy;

        this.w = rx;
        this.h = ry;

        this.points = [];
        if (outline) {
            let nSubSteps = max(2, round(rx / hatchDensity) * 10);
            for (let i = 0; i < nSubSteps; i++) {
                let a = map(i, 0, nSubSteps - 2, 0, TAU);
                let x = rx * cos(a);
                let y = ry * sin(a);

                this.points.push(
                    {
                        x: x,
                        y: y,
                    }
                );
            }
        } else {
            let nSubSteps = max(2, round(rx / hatchDensity));
            for (let i = 0; i < nSubSteps; i++) {
                let x = map(i, 0, nSubSteps - 1, -rx, rx);
                let ht = ry * sqrt(1 - sq(x) / sq(rx))

                this.points.push(
                    {
                        x: x,
                        y: ht,
                    }
                );
                this.points.push(
                    {
                        x: x,
                        y: -ht,
                    }
                );
            }
        }

        this.pen = _createV(
            this.points[0].x,
            this.points[0].y
        );

        this._pen = {
            x: this.pen.x,
            y: this.pen.y
        }

        this.penTargetIndex = 1;

        this.penV = _createV(
            0,
            0
        );
    }
}