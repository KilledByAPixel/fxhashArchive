/* global Line noise Blob */
// eslint-disable-next-line no-unused-vars

/**
 * ===============================================================================================
 * ===============================================================================================
 * ===============================================================================================
 *
 * NOTE TO THE READER (that's you)
 *
 * This is my own messy code to make SVG files for sending to the AxiDraw without having
 * to deal with Illustrator.
 *
 * This is NOT good code, this is not the "proper" way to write helpful libraries like this
 * but it does what I need it to do in a way that helps me debug easily in the console
 * etc. etc. etc. The "cull/bisectLines" functions are particularly terrible.
 *
 * There is no versioning, no changelogs, no githib repo, the latest version probable lives here.
 *
 * ===============================================================================================
 * ===============================================================================================
 * ===============================================================================================
 */

const PAPER = { // eslint-disable-line no-unused-vars
  A1: [59.4, 84.1],
  A2: [42.0, 59.4],
  A3: [29.7, 42.0],
  A4: [21.0, 29.7],
  A5: [14.8, 21.0],
  A6: [10.5, 14.8]
}

/**
 * The page object (which you'd expect to be a class but isn't for various dull reasons)
 * controls the display of lines on a canvas, the saving of those lines into svgs
 * and other various bits and bobs
 *
 * Page
 * @namespace
 * @property {function} translate
 * @property {function} rotate
 * @property {function} displace
 * @property {function} scale
 * @property {function} isInside
 * @property {function} intersect
 * @property {function} bisectLines
 * @property {function} cullOutside
 * @property {function} getBoundingBox
 * @property {function} makeCircle
 */
const page = {

  /**
   * A utility method to translate a single line or an array of lines
   * by the passed values. It always returns an array of lines
   * @param {(Array|object)}  lines An array of {@link Line} objects, or a single {@link Line} object
   * @param {number}          x     The x offset
   * @param {number}          y     The y offset
   * @param {number}          z     The z offset
   * @returns {Array}               An array of {@link Line} objects
   */
  translate: (lines, x, y, z = 0) => {
    const newLines = []
    if (!Array.isArray(lines)) lines = [lines]
    lines.forEach((line) => {
      const newLine = new Line(line.getZindex())
      const points = line.getPoints()
      points.forEach((point) => {
        newLine.addPoint(point.x + x, point.y + y, point.z + z)
      })
      newLines.push(newLine)
    })
    return newLines
  },

  /**
   * A utility method to translate a single line or an array of lines
   * by the passed values. It always returns an array of lines
   * @param {(Array|object)}  lines             An array of {@link Line} objects, or a single {@link Line} object
   * @param {number}          angle             The angle in degrees to rotate around
   * @param {boolean}         aroundOwnMidpoint Rotate around it's own middle if true, around 0,0 origin if false
   * @returns {Array}                 An array of {@link Line} objects
   */
  rotate: (lines, angle, aroundOwnMidpoint = true) => {
    //  Convert the angle from degree to radians
    const adjustedAngle = (-angle * Math.PI / 180)

    //  This will hold our final lines for us
    let newLines = []
    //  Make sure the lines are an array
    if (!Array.isArray(lines)) lines = [lines]
    //  Grab the bouding box in case we need it
    const bb = page.getBoundingBox(lines)

    //  If we are rotating around it's own center then translate it to 0,0
    if (aroundOwnMidpoint) {
      lines = page.translate(lines, -bb.mid.x, -bb.mid.y)
    }

    //  Now rotate all the points
    lines.forEach((line) => {
      const newLine = new Line(line.getZindex())
      const points = line.getPoints()
      points.forEach((point) => {
        newLine.addPoint((Math.cos(adjustedAngle) * point.x) + (Math.sin(adjustedAngle) * point.y), (Math.cos(adjustedAngle) * point.y) - (Math.sin(adjustedAngle) * point.x), point.z)
      })
      newLines.push(newLine)
    })

    //  If we are rotating around the center now we need to move it back
    //  to it's original position
    if (aroundOwnMidpoint) {
      newLines = page.translate(newLines, bb.mid.x, bb.mid.y)
    }
    //  Send the lines back
    return newLines
  },

  /**
   * A utility method to translate a single line or an array of lines
   * by the passed values. It always returns an array of lines
   * @param {(Array|object)}  lines             An array of {@link Line} objects, or a single {@link Line} object
   * @param {displacement}    vectorObjects     The angle in degrees to rotate around
   * @returns {Array}                           An array of {@link Line} objects
   */
  displace: (lines, displacement) => {
    //  This will hold our final lines for us
    const newLines = []
    //  Make sure the lines are an array
    if (!Array.isArray(lines)) lines = [lines]

    //  Now displace all the points
    lines.forEach((line) => {
      const newLine = new Line(line.getZindex())
      const points = line.getPoints()
      points.forEach((point) => {
        const newPoint = {
          x: point.x,
          y: point.y,
          z: point.z
        }

        let finalWeightingMod = 1
        if (displacement.weighting !== 0) finalWeightingMod *= displacement.weighting
        if (displacement.invert) finalWeightingMod = 1 - finalWeightingMod

        newPoint.x += noise.perlin3((point.x + displacement.xNudge) / displacement.resolution, (point.y + displacement.xNudge) / displacement.resolution, (point.z + displacement.xNudge) / displacement.resolution) * displacement.xScale * displacement.amplitude * finalWeightingMod
        newPoint.y += noise.perlin3((point.x + displacement.yNudge) / displacement.resolution, (point.y + displacement.yNudge) / displacement.resolution, (point.z + displacement.yNudge) / displacement.resolution) * displacement.yScale * displacement.amplitude * finalWeightingMod
        newPoint.z += noise.perlin3((point.x + displacement.zNudge) / displacement.resolution, (point.y + displacement.zNudge) / displacement.resolution, (point.z + displacement.zNudge) / displacement.resolution) * displacement.zScale * displacement.amplitude * finalWeightingMod
        newLine.addPoint(newPoint.x, newPoint.y, newPoint.z)
        // newLine.addPoint((Math.cos(adjustedAngle) * point.x) + (Math.sin(adjustedAngle) * point.y), (Math.cos(adjustedAngle) * point.y) - (Math.sin(adjustedAngle) * point.x))
      })
      newLines.push(newLine)
    })

    //  Send the lines back
    return newLines
  },

  /**
   * A utility method to scale a single line or an array of lines
   * by the passed values. It always returns an array of lines
   * @param {(Array|object)}  lines             An array of {@link Line} objects, or a single {@link Line} object
   * @param {number}          xScale            The amount to scale in the x direction
   * @param {number}          yScale            The amount to scale in the y direction, if null, then uses the same value as xScale
   * @param {number}          zScale            The amount to scale in the z direction, if null, then uses the same value as xScale
   * @param {boolean}         aroundOwnMidpoint Scale around it's own middle if true, around 0,0 origin if false
   * @returns {Array}                           An array of {@link Line} objects
   */
  scale: (lines, xScale, yScale = null, zScale = null, aroundOwnMidpoint = true) => {
    //  This will hold our final lines for us
    let newLines = []
    //  Make sure the lines are an array
    if (!Array.isArray(lines)) lines = [lines]
    //  Grab the bouding box in case we need it
    const bb = page.getBoundingBox(lines)

    //  If we are rotating around it's own center then translate it to 0,0
    if (aroundOwnMidpoint) {
      lines = page.translate(lines, -bb.mid.x, -bb.mid.y)
    }

    if (yScale === null) yScale = xScale
    if (zScale === null) zScale = xScale

    //  Now scale all the points
    lines.forEach((line) => {
      const newLine = new Line(line.getZindex())
      const points = line.getPoints()
      points.forEach((point) => {
        newLine.addPoint(xScale * point.x, yScale * point.y, zScale * point.z)
      })
      newLines.push(newLine)
    })

    //  If we are scaling around the center now we need to move it back
    //  to it's original position
    if (aroundOwnMidpoint) {
      newLines = page.translate(newLines, bb.mid.x, bb.mid.y, bb.mid.z)
    }
    //  Send the lines back
    return newLines
  },

  getDistance: (p1, p2) => {
    if (!p1.z || isNaN(p1.z)) p1.z = 0
    if (!p2.z || isNaN(p2.z)) p2.z = 0
    return Math.cbrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2))
  },

  cleanLines: (lines) => {
    const keepLines = []

    const wasArray = Array.isArray(lines)
    if (!Array.isArray(lines)) lines = [lines]
    //  Go through each line
    lines.forEach((line) => {
      const points = line.getPoints()
      const minDist = 0.01
      //  This is going to keep track of the points we want to keep
      const newPoints = []
      //  grab the first point
      let previousPoint = points.shift()
      newPoints.push(previousPoint)
      while (points.length) {
        //  grab the next point
        const checkPoint = points.shift()
        //  work out the distance
        const xs = checkPoint.x - previousPoint.x
        const ys = checkPoint.y - previousPoint.y
        const zs = checkPoint.z - previousPoint.z
        const dist = Math.cbrt(Math.abs(xs) + Math.abs(ys) + Math.abs(zs))
        //  if the distance is greater then the minimum allowed, we keep the point
        if (dist >= minDist) {
          //  Keep the point
          newPoints.push(checkPoint)
          //  set the previous point to the one we just had
          previousPoint = checkPoint
        }
      }
      //  Set the points back into the line
      line.points = newPoints
      if (line.points.length > 1) keepLines.push(line)
    })
    if (!wasArray) return keepLines[0]
    return keepLines
  },

  /**
   * Calculates if a point is inside a polygon defined by an array of points
   * @param {object}  point A single point in the format of [x, y]
   * @param {Array}   vs    An array of points (vertexes) that make up the polygon i.e. [[0, 0], [10, 0], [10, 10], [0, 10]]
   * @returns {boolean} Is the point inside the array or not
   */
  isInside: (point, vs, forceSort = false) => {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    const x = point.x
    const y = point.y
    let sortedVs = vs
    if (forceSort) sortedVs = page.sortPointsClockwise(vs)

    let inside = false
    for (let i = 0, j = sortedVs.length - 1; i < sortedVs.length; j = i++) {
      const xi = sortedVs[i].x
      const yi = sortedVs[i].y
      const xj = sortedVs[j].x
      const yj = sortedVs[j].y

      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      if (intersect) inside = !inside
    }

    return inside
  },

  /**
   * Determine the intersection point of two line segments
   * line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
   * @param {object} line1 A single {@link Line} object, consisting of two points, a start and end point.
   * @param {object} line2 A single {@link Line} object, consisting of two points, a start and end point.
   * @returns {boolean} Returns if the lines intersect or not
   */
  intersect: (line1, line2) => {
    //  Round all this stuff off

    // Check if none of the lines are of length 0
    if ((line1.x1 === line1.x2 && line1.y1 === line1.y2) || (line2.x1 === line2.x2 && line2.y1 === line2.y2)) {
      return false
    }

    const denominator = ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1))

    // Lines are parallel
    if (denominator === 0) {
      return false
    }

    const ua = ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) - (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) / denominator
    const ub = ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) - (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false
    }

    // Return a object with the x and y coordinates of the intersection
    const x = (line1.x1 + ua * (line1.x2 - line1.x1))
    const y = (line1.y1 + ua * (line1.y2 - line1.y1))

    //  If the intersection point is the same as any of the line1 points, then it
    //  doesn't count
    // if (line1.x1 === x && line1.y1 === y) return false
    // if (line1.x2 === x && line1.y2 === y) return false

    return {
      x,
      y
    }
  },

  /**
   * This takes in an array of lines, and then splits the lines based on a "cutter/culler"
   * second set of lines, returning the new cut lines. For example if a single line passing
   * through a square is passed in. The line will be split into three parts the two outside
   * the square parts, and the single inside part. This function is normally used in conjunction
   * with the cullInside/Outside functions. But you could bisect something (say inside a circle)
   * duplicate the results. Then cull the inside of one copy and the outside of the other, so you
   * can rotate the inside set of lines independently of the outside ones.
   *
   * NOTE:
   * REALLY NOTE:
   *
   * This code kinda, sorta, doesn't work, like 100% of the time. After the line is bisected we end
   * up with line who's point falls exactly on the bisecting line, which will count as bisecting, and
   * therefor will bisect again and again. We have a counter to bail us out of this, but it does mean
   * we need to clean up lines that are like 0 distance long. And I haven't written the code to do that
   * yet.
   *
   * TODO:
   *
   * Write code to remove lines are are under a certain threshold in length
   * Write code to remove duplicate lines when they are within a certain threshold of each other
   * Join lines up when the end points of the line are close enough to the end points of another
   * line
   *
   * @param {(Array|object)}  lines   An array of {@link Line} objects, or a single {@link Line} object
   * @param {object}          culler  A single {@link Line} object
   * @returns {Array}                 An array of {@link Line} objects
   */
  bisectLines: (lines, culler) => {
    // Make sure we have an array of lines
    let counter = 0
    let maxDepth = 0
    if (!Array.isArray(lines)) lines = [lines]

    //  Turn the culler into a set of lines we can check against
    const cullLines = []
    const points = culler.getPoints()
    for (let p = 0; p < points.length - 1; p++) {
      const subline = {
        x1: points[p].x,
        y1: points[p].y,
        x2: points[p + 1].x,
        y2: points[p + 1].y
      }
      cullLines.push(subline)
    }

    const keepLines = []
    let checkLines = lines

    while (counter < 10000 && checkLines.length > 0) {
      if (counter > maxDepth) maxDepth = counter
      //  Now go through all the lines we want to bisect
      const checkedLines = []
      checkLines.forEach((line) => {
        //  Now loop through all the lines to check against all the lines
        //  in the culler, each time the line doesn't bisect then we add it
        //  to the newLine
        let newLine = new Line(line.getZindex())
        newLine.splitHappened = false
        let splitFound = false

        //  Go through all the points, turning them into lines
        const points = line.getPoints()
        for (let p = 0; p < points.length - 1; p++) {
          const subline = {
            x1: points[p].x,
            y1: points[p].y,
            x2: points[p + 1].x,
            y2: points[p + 1].y
          }

          const isFirstPoint = (p === 0)
          const isLastPoint = (p === points.length - 2)

          //  Always add the first point to the line
          newLine.addPoint(subline.x1, subline.y1)
          if (splitFound === false) {
            cullLines.forEach((cullLine) => {
              if (splitFound === false) {
                const result = page.intersect(subline, cullLine)
                //  If we have an intersection then we need to stop this line
                //  and start a new one
                let setTrue = true
                if (result) {
                  if (isFirstPoint && page.getDistance({
                    x: subline.x1,
                    y: subline.y1
                  }, result) < 0.0001) setTrue = false
                  if (isLastPoint && page.getDistance({
                    x: subline.x2,
                    y: subline.y2
                  }, result) < 0.0001) setTrue = false
                } else {
                  setTrue = false
                }

                if (result !== false && setTrue === true) {
                  splitFound = true
                  newLine.addPoint(result.x, result.y) // Add the bisection point
                  newLine.splitHappened = true
                  checkedLines.push(newLine)
                  newLine = new Line(newLine.getZindex()) //  Start a new line
                  newLine.splitHappened = true
                  newLine.addPoint(result.x, result.y) //  Add this point onto it
                }
              }
            })
          }
        }
        newLine.addPoint(points[points.length - 1].x, points[points.length - 1].y)
        if (newLine.getPoints().length > 1) checkedLines.push(newLine) //  Add it to the list of returned lines
      })

      //  Go through the checkedLines and push them onto one array or another
      checkLines = []
      checkedLines.forEach((line) => {
        if (line.splitHappened === true) {
          checkLines.push(line)
        } else {
          keepLines.push(line)
        }
      })
      counter++
    }
    return page.cleanLines(keepLines)
  },

  /**
   * When passed an array of lines, and a single line to act as a "culler",
   * this method will remove all the lines on the outside of the "culler"
   * and return a new array of lines.
   * NOTE: The culler needs to be a closed polygon, i.e. the last point
   * needs to be the same as the first point, otherwise the inside/outside
   * part of the calculation will not function correctly
   * @param {(Array|object)}  lines   An array of {@link Line} objects, or a single {@link Line} object
   * @param {object}          culler  A single {@link Line} object
   * @returns {Array}                 An array of {@link Line} objects
   */
  cullOutside: (lines, culler, forceSort = false) => {
    // TODO: Add a check in to make sure the culler is closed
    const newLines = page.bisectLines(lines, culler) // gets an array of lines back
    const keepLines = []
    newLines.forEach((line) => {
      let anyPointOutside = false
      const points = line.getPoints()

      for (let p = 0; p < points.length - 1; p++) {
        const subline = {
          x1: points[p].x,
          y1: points[p].y,
          x2: points[p + 1].x,
          y2: points[p + 1].y
        }
        const midPoint = {
          x: subline.x1 + ((subline.x2 - subline.x1) / 2),
          y: subline.y1 + ((subline.y2 - subline.y1) / 2)
        }
        const isInside = page.isInside(midPoint, culler.getPoints(), forceSort)
        if (isInside === false) anyPointOutside = true
      }
      if (anyPointOutside === false) keepLines.push(line)
    })
    return keepLines
  },

  /**
   * This utility method gets the bounding box from an array of lines, it also
   * calculates the midpoint
   * @param {(Array|object)}  lines  An array of {@link Line} objects, or a single {@link Line} object
   * @returns {object}        And object containing the min/max points and the mid points
   */
  getBoundingBox: (lines) => {
    if (!Array.isArray(lines)) lines = [lines]

    const max = {
      x: -999999999,
      y: -999999999,
      z: -999999999
    }
    const min = {
      x: 999999999,
      y: 999999999,
      z: 999999999
    }
    lines.forEach((line) => {
      const points = line.getPoints()
      points.forEach((point) => {
        if (point.x < min.x) min.x = point.x
        if (point.x > max.x) max.x = point.x
        if (point.y < min.y) min.y = point.y
        if (point.y > max.y) max.y = point.y
        if (point.z < min.z) min.z = point.z
        if (point.z > max.z) max.z = point.z
      })
    })
    return {
      min,
      max,
      mid: {
        x: min.x + ((max.x - min.x) / 2),
        y: min.y + ((max.y - min.y) / 2),
        z: min.z + ((max.z - min.z) / 2)
      }
    }
  },

  /**
   * A utility method that will return a circle, well, technically a
   * polygon based on the number of segments and radius. The zIndex is
   * also set here. The polygon returned is centered on 0,0.
   * @param   {number}  segments  The number of segments in the circle
   * @param   {number}  radius    The radius of the polygon
   * @param   {number}  zIndex    The zIndex to be applied to the returned {@link Line}
   * @returns {Array}             Returns an Array containing a single {@link Line} object
   */
  makeCircle: (segments, radius, zIndex) => {
    const circle = new Line(zIndex)
    const angle = 360 / segments
    for (let s = 0; s <= segments; s++) {
      const adjustedAngle = ((angle * s) * Math.PI / 180)
      const x = Math.cos(adjustedAngle) * radius
      const y = Math.sin(adjustedAngle) * radius
      circle.addPoint(x, y)
    }
    return [circle]
  },

  wrapSVG: async (lines, size, filename, scale) => {
    //  Turn the points into an array of lines
    let output = `<?xml version="1.0" standalone="no" ?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
        "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        <svg version="1.1" id="lines" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0" y="0"
        viewBox="0 0 ${size[0]} ${size[1]}"
        width="${size[0]}cm"
        height="${size[1]}cm" 
        xml:space="preserve">`

    output += `
        <g>
        <path d="`
    lines.forEach(line => {
      const points = line.points
      //  Grab the points and scale them down
      output += `M ${points[0].x * size[0]} ${points[0].y * size[1]} `
      for (let p = 1; p < points.length; p++) {
        output += `L ${points[p].x * size[0]} ${points[p].y * size[1]} `
      }
    })
    output += `"  fill="none" stroke="black" stroke-width="0.05"/>
      </g>`
    output += '</svg>'

    const element = document.createElement('a')
    element.setAttribute('download', `${filename}.svg`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.setAttribute('href', window.URL.createObjectURL(new Blob([output], {
      type: 'text/plain;charset=utf-8'
    })))
    element.click()
    document.body.removeChild(element)
  }
}
