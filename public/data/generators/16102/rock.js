// Author: Nathaniel Sarkissian
// Date: July 8, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

class Rock {
    constructor(sz, i, j) {
        this.sz = sz * 1.1;// / overallZoom;
        this.i = i;
        this.j = j;
        this.offX = floor(frandA(1000));
        this.offY = floor(frandA(1000));
        this.offZ = floor(frandA(1000));

        // this.h = frandAB(1, 1.5);
        this.h = frandAB(1.35, 1.9);

        this.verts = [];
        this.tris = [];

        this.icoVertices();
        this.icoFaces();
        this.subdivide();
        this.subdivide();
        let avgRad = this.averageRadius();
        this.subdivide();

      // print("rock rad:", avgRad);

        // if (avgRad > 0.2) {
        //     this.subdivide();
        // }

        if (avgRad > 0.25) {
            this.subdivide();
        }

        // if (avgRad > 0.4) {
        //     this.subdivide();
        // }

        if (avgRad > 0.6) {
            this.subdivide();
        }

        for (let i = 0; i < this.verts.length; i++) {
            let v = this.verts[i];
            let ns = this.radius(v.x, v.y, v.z);
            ns = fpow(ns, 2);
            this.verts[i].mult(10).mult(ns).mult(20).mult(this.sz).mult(1.2);
            this.verts[i].y *= this.h;
        }

        for (let i = 0; i < this.tris.length; i++) {
            let t = this.tris[i];
            let v1 = this.verts[t[0]];
            let v2 = this.verts[t[1]];
            let v3 = this.verts[t[2]];

            this.tris[i].push((v1.z + v2.z + v3.z) / 3); // third item in array is average z of the three points

            let U = p5.Vector.sub(v2, v1);
            let V = p5.Vector.sub(v3, v1);
            let N = createVector(
                U.y * V.z - U.z * V.y,
                U.z * V.x - U.x * V.z,
                U.x * V.y - U.y * V.x
            ).normalize();

            let br = N.dot(light);
            let specular = min(N.dot(toEye), 1);
            // this.tris[i].push(br);
            // this.tris[i].push(fpow(specular < 0 ? specular : 0, 6) * 0.25 + br * 0.75);
            // this.tris[i].push(fpow(specular < 0 ? specular : 0, 20) * 0.25 + br * 0.75);
            let spec = max(fpow(specular < 0 ? specular : 0, 20), br);
            // this.tris[i].push(spec + frandAB(-1, 1) * 0.3 * br);
            this.tris[i].push(spec + frandAB(-1, 1) * 0.05);// * constrain(map(v1.y, 0, -4, 0, 1), 0, 1));
            // this.tris[i].push(max(fpow(specular < 0 ? specular : 0, 20), br));
            this.tris[i].push(N.dot(toEye));
            // Nx = UyVz - UzVy
            // Ny = UzVx - UxVz
            // Nz = UxVy - UyVx
        }

        this.tris.sort(
            function (a, b) {
                return a[3] - b[3];
            }
        )

        this.drawFlat();
    }

    drawFlat() {
        for (let i = 0; i < this.tris.length; i++) {
            let t = this.tris[i];

            let v1 = this.verts[t[0]].copy();
            let v2 = this.verts[t[1]].copy();
            let v3 = this.verts[t[2]].copy();

            if (v1.y < 0) {
                //     img.push();
                //     img.translate(this.i, this.j);
                //     img.scale(1.9, 1.92);
                //     img.fill(255);
                //     img.noStroke();
                //     // img.stroke(255);
                //     img.triangle(
                //         v1.x,
                //         v1.z,
                //         v2.x,
                //         v2.z,
                //         v3.x,
                //         v3.z);
                //     img.pop();
                // }
                let scX = 1.93;
                let scY = 1.93;
                // let scX = 1.9;
                // let scY = 1.92;
                v1.x *= scX;
                v1.z *= scY;
                v2.x *= scX;
                v2.z *= scY;
                v3.x *= scX;
                v3.z *= scY;

                v1.x += this.i;
                v1.z += this.j;
                v2.x += this.i;
                v2.z += this.j;
                v3.x += this.i;
                v3.z += this.j;

                drawTri(rockMapArr, v1.x, v1.z, v2.x, v2.z, v3.x, v3.z);
            }
        }
    }

    averageRadius() {
        let avg = 0;
        // for (let i = 0; i < this.verts.length; i++) {
        //     let v = this.verts[i];
        //     let ns = this.radius(v.x, v.y, v.z);
        //     ns = fpow(ns, 2);
        //     let mag = sqrt(sq(v.x * ns) + sq(v.y * ns) + sq(v.z * ns)) * this.sz;
        //     avg += mag / this.verts.length;
        // }

        for (let i = 0; i < this.tris.length; i++) {
            let t = this.tris[i];

            let a = this.verts[t[0]].copy();
            let b = this.verts[t[1]].copy();
            let c = this.verts[t[2]].copy();

            let ns = this.radius(a.x, a.y, a.z);
            ns = fpow(ns, 2) * this.sz;

            a.mult(ns);
            b.mult(ns);
            c.mult(ns);

            let ar = abs(a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2;
            avg += ar / this.tris.length;
        }

        return avg * 100000;
    }


    draw() {
        for (let i = 0; i < this.tris.length; i++) {
            let t = this.tris[i];

            if (t[5] > 0) {
                let v1 = this.verts[t[0]];
                let v2 = this.verts[t[1]];
                let v3 = this.verts[t[2]];

                let br = fmap(t[4], 0, 1, 0.5, 1);
                let triangleCol = lightColor(constrain(t[4] + frandAB(-1, 1) * 0.3, 0, 1));
                triangleCol = color(
                    red(triangleCol) * br,
                    green(triangleCol) * br,
                    blue(triangleCol) * br
                )

               canv.fill(triangleCol);
               canv.stroke(triangleCol);
                canv.triangle(
                    v1.x,
                    v1.y,
                    v2.x,
                    v2.y,
                    v3.x,
                    v3.y);
            }
        }
        // rect(0, 0, 2, 20);
    }

    radius(_x, _y, _z) {
        let x = _x + this.offX;//*scaleX/2;
        let y = _y + this.offY * this.h;//*scaleY;
        let z = _z + this.offZ;//*scaleZ/2;

        let rockNoiseScale = 0.5;

        let n5 = noise(x * rockNoiseScale, y * rockNoiseScale, z * rockNoiseScale) * TAU;
        let offsetStrength = 0.2;
        let cs = offsetStrength * cos(n5);
        let sn = offsetStrength * sin(n5);

        // return (noise(x * rockNoiseScale + 10, y * rockNoiseScale + 20, z * rockNoiseScale + 30) * 0.5 + 0.5) * 100;
        let n0 = worleyNoise.Euclidean(x * rockNoiseScale + 10, y * rockNoiseScale + 20, z * rockNoiseScale + 30)[1];
        let n00 = worleyNoise.Euclidean(x * rockNoiseScale * 0.7 + 10, y * rockNoiseScale * 0.7 + 20, z * rockNoiseScale * 0.7 + 30)[0];
        let n1 = worleyNoise.Euclidean(x * rockNoiseScale + 10 + cs, y * rockNoiseScale + 20 + sn, z * rockNoiseScale + 30)[0];
        let n2 = worleyNoise.Euclidean(x * rockNoiseScale * 4 + 10, y * rockNoiseScale * 4 + 20, z * rockNoiseScale * 4 + 30)[0];
        let n3 = worleyNoise.Euclidean(x * rockNoiseScale * 8 + 10, y * rockNoiseScale * 8 + 20, z * rockNoiseScale * 8 + 30)[0];
        let n4 = worleyNoise.Euclidean(x * rockNoiseScale * 16 + 10, y * rockNoiseScale * 16 + 20, z * rockNoiseScale * 16 + 30)[0];
        let n6 = worleyNoise.Euclidean(x * rockNoiseScale * 32 + 10, y * rockNoiseScale * 32 + 20, z * rockNoiseScale * 32 + 30)[0];
        // let n = n00;


        let n = fmap(n00 * 6 + n1 * 4 + n2 * 1 + n3 * 0.15 + n4 * 0.1 + n6 * 0.1, 0, 6 + 4 + 1 + 0.15 + 0.1 + 0.1, 0.0, 1);
        // let n = fmap(n00 * 6 + n1 * 4 + n2 * 1 + n3 * 0.15 + n4 * 0.1 + n6 * 0.1, 0, 6 + 4 + 1 + 0.15 + 0.1 + 0.1, 0.0, 1);
        // let n = fmap(n00 * 6 + n1 * 4 + n2 * 1 + n3 * 0.15 + n4 * 0.1, 0, 6 + 4 + 1 + 0.15 + 0.1, 0.0, 1);
        // n = fmap(n00*8 + n1*2 + n2*1, 0, 8+2+1, 0, 1);
        // n = n1;
        return fmap(n, 0, 1, 0.4, 1);
        // // return 100;

    }

    subdivide() {
        // print("subdividing");
        let newTris = [];
        for (let i = this.tris.length - 1; i >= 0; i--) {
            let t = this.tris[i];
            let v1 = this.verts[t[0]];
            let v2 = this.verts[t[1]];
            let v3 = this.verts[t[2]];

            // let v1 = this.verts[t.x];
            // let v2 = this.verts[t.y];
            // let v3 = this.verts[t.z];
            let a = createVector(
                lerp(v1.x, v2.x, 0.5),
                lerp(v1.y, v2.y, 0.5),
                lerp(v1.z, v2.z, 0.5));
            let b = createVector(
                lerp(v1.x, v3.x, 0.5),
                lerp(v1.y, v3.y, 0.5),
                lerp(v1.z, v3.z, 0.5));
            let c = createVector(
                lerp(v3.x, v2.x, 0.5),
                lerp(v3.y, v2.y, 0.5),
                lerp(v3.z, v2.z, 0.5));
            a.setMag(1);
            b.setMag(1);
            c.setMag(1);
            this.verts.push(a);
            this.verts.push(b);
            this.verts.push(c);
            let indA = this.verts.length - 3;
            let indB = this.verts.length - 2;
            let indC = this.verts.length - 1;

            let tri1 = [indA, indB, t[0]];
            let tri2 = [indC, indA, t[1]];
            let tri3 = [indB, indC, t[2]];
            let tri4 = [indC, indB, indA];
            // let tri1 = createVector(indA, indB, t.x);
            // let tri2 = createVector(indC, indA, t.y);
            // let tri3 = createVector(indB, indC, t.z);
            // let tri4 = createVector(indC, indB, indA);
            newTris.push(tri1);
            newTris.push(tri2);
            newTris.push(tri3);
            newTris.push(tri4);
        }

        this.tris = newTris;
    }

    icoFaces() {
        // top cap
        this.tris.push([0, 1, 2]);
        this.tris.push([0, 2, 3]);
        this.tris.push([0, 3, 4]);
        this.tris.push([0, 4, 5]);
        this.tris.push([0, 5, 1]);
        // this.tris.push(createVector(0, 1, 2));
        // this.tris.push(createVector(0, 2, 3));
        // this.tris.push(createVector(0, 3, 4));
        // this.tris.push(createVector(0, 4, 5));
        // this.tris.push(createVector(0, 5, 1));
        // sides pointing down
        this.tris.push([7, 2, 1]);
        this.tris.push([8, 3, 2]);
        this.tris.push([9, 4, 3]);
        this.tris.push([10, 5, 4]);
        this.tris.push([6, 1, 5]);
        // this.tris.push(createVector(7, 2, 1));
        // this.tris.push(createVector(8, 3, 2));
        // this.tris.push(createVector(9, 4, 3));
        // this.tris.push(createVector(10, 5, 4));
        // this.tris.push(createVector(6, 1, 5));
        // sides pointing up
        this.tris.push([1, 6, 7]);
        this.tris.push([2, 7, 8]);
        this.tris.push([3, 8, 9]);
        this.tris.push([4, 9, 10]);
        this.tris.push([5, 10, 6]);
        // this.tris.push(createVector(1, 6, 7));
        // this.tris.push(createVector(2, 7, 8));
        // this.tris.push(createVector(3, 8, 9));
        // this.tris.push(createVector(4, 9, 10));
        // this.tris.push(createVector(5, 10, 6));

        // bottom cap
        this.tris.push([7, 6, 11])
        this.tris.push([8, 7, 11])
        this.tris.push([9, 8, 11])
        this.tris.push([10, 9, 11])
        this.tris.push([6, 10, 11])
        // this.tris.push(createVector(7, 6, 11))
        // this.tris.push(createVector(8, 7, 11))
        // this.tris.push(createVector(9, 8, 11))
        // this.tris.push(createVector(10, 9, 11))
        // this.tris.push(createVector(6, 10, 11))
    }

    icoVertices() {
        let r = 2 * sqrt(5) / 5;
        let h = r / 2;
        let theta = TWO_PI / 5;
        let offset = theta / 2;
        let v = createVector(0, 0, 1);
        v.setMag(1);
        this.verts.push(v);
        for (let i = 0; i < 5; i++) {
            let x = cos(theta * i) * r;
            let y = sin(theta * i) * r;
            let z = h;
            v = createVector(x, y, z);
            v.setMag(1);
            this.verts.push(v);
        }
        for (let i = 0; i < 5; i++) {
            let x = cos(theta * i - offset);
            let y = sin(theta * i - offset);
            let z = -h;
            v = createVector(x, y, z);
            v.setMag(1);
            this.verts.push(v);
        }
        v = createVector(0, 0, -1);
        v.setMag(1);
        this.verts.push(v);
    }
}