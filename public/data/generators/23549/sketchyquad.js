// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

class SketchyQuad extends SketchyShape {
    // top left: x1, y1
    // top right: x2, y2
    // bottom right: x3, y3
    // bottom left: x4, y4
    constructor(x1, y1, x2, y2, x3, y3, x4, y4, hatchDensity) {
        super();

        this.x = (x1 + x2 + x3 + x4) / 4;
        this.y = (y1 + y2 + y3 + y4) / 4;
        this.x1 = x1 - this.x;
        this.y1 = y1 - this.y;
        this.x2 = x2 - this.x;
        this.y2 = y2 - this.y;
        this.x3 = x3 - this.x;
        this.y3 = y3 - this.y;
        this.x4 = x4 - this.x;
        this.y4 = y4 - this.y;

        let d12 = dist(this.x1, this.y1, this.x2, this.y2);
        let d34 = dist(this.x3, this.y3, this.x4, this.y4);

        this.points = [];
        let x, y;
        let nSubSteps = max(2, round(max(d12, d34) / hatchDensity));
        for (let i = 0; i < nSubSteps; i++) {
            let m = map(i, 0, nSubSteps - 1, 0, 1);
            x = lerp(this.x1, this.x2, m);
            y = lerp(this.y1, this.y2, m);

            let na = noise(x * 0.08, y * 0.08) * TAU;
            x += cos(na) * 1;
            y += sin(na) * 1;

            this.points.push(
                {
                    x: x,
                    y: y
                }
            );

            x = lerp(this.x4, this.x3, m);
            y = lerp(this.y4, this.y3, m);

            na = noise(x * 0.08, y * 0.08) * TAU;
            x += cos(na) * 1;
            y += sin(na) * 1;

            this.points.push(
                {
                    x: x,
                    y: y
                }
            );
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