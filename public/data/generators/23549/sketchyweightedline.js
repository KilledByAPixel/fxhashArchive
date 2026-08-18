// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

class SketchyWeightedLine extends SketchyRect {
    constructor(x1, y1, x2, y2, weight, hatchDensity) {
        let ht = dist(
            x1,
            y1,
            x2,
            y2
        );
        let ang = atan2(y2 - y1, x2 - x1);
        let cx = lerp(x1, x2, 0.5);
        let cy = lerp(y1, y2, 0.5);
        super(
            cx,
            cy,
            weight,
            ht,
            hatchDensity);

        this.angle = ang + PI/2;
    }
}