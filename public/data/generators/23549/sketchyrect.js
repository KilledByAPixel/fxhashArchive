// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

class SketchyRect extends SketchyQuad {
    constructor(x, y, w, h, hatchDensity) {
        let x1 = x - w / 2;
        let y1 = y - h / 2;
        let x2 = x + w / 2;
        let y2 = y - h / 2;
        let x3 = x + w / 2;
        let y3 = y + h / 2;
        let x4 = x - w / 2;
        let y4 = y + h / 2;
        super(x1, y1, x2, y2, x3, y3, x4, y4, hatchDensity);
    }
}