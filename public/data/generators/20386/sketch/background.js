const backgroundTexture = (n) => {
  n.push(), n.background(PALETTE.sky.background());
  for (let e = 0; e < 650; e++) {
    n.stroke(PALETTE.sky.lines()), n.strokeWeight(R.num(1, 15) * U);
    const e = CV(R.num(0, W), R.num(0, W)),
      o = endpoint(e, R.num(10, 100), R.num(0, 360));
    n.line(e.x * U, e.y * U, o.x * U, o.y * U);
  }
  let e = R.num(100, 250),
    o = R.norm(W / 2, 40),
    r = R.norm(H / 3, 40),
    u = (n) => n + R.norm(0, 7);
  for (let c = 0; c < 4; c++)
    n.fill(PALETTE.sky.circle()),
      n.stroke(PALETTE.sky.circle()),
      n.circle(u(o) * U, u(r) * U, e * R.num(0.5, 1) * U);
  n.pop();
};
