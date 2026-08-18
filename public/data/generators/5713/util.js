function tooClose(p1, p2, minDist){
  let d = dist(p1.x, p1.y, p2.x, p2.y);
  if (d < minDist) return true;
  else return false;
}

function getAngle(p0, p1){
  let checkPoint = createVector(
    p1.x - p0.x,
    p1.y - p0.y
  );

  let origin = createVector(0, 100);

  let ab = origin.angleBetween(checkPoint);

  if (ab < 0) ab = abs(ab);
  else ab = map(ab, 180, 0, 180, 360);

  return ab;

}
