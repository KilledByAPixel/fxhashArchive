class Preload {
  load() {
    for (let i = 0; i < amnt1; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      plant1Array[i] = new Plant(x, y, z, o);
    }

    for (let i = 0; i < amnt2; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      plant2Array[i] = new Plant2(x, y, z, o);
    }

    for (let i = 0; i < amnt3; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      plant3Array[i] = new Plant3(x, y, z, o);
    }

    for (let i = 0; i < amnt4; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      plant4Array[i] = new Plant4(x, y, z, o);
    }

    for (let i = 0; i < amnt5 / 2; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1) + 1;
      let o = op;
      plant5Array[i] = new Plant5(x, y, z, o);
    }

    for (let i = 0; i < amnt5 / 2; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset - 25;
      let z = zoffset + random(1);
      let o = op;
      plant5Array[i] = new Plant5(x, y, z, o);
    }

    for (let i = 0; i < amnt6; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      plant6Array[i] = new Plant6(x, y, z, o);
    }

    for (let i = 0; i < amnt7; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      tree1Array[i] = new Tree(x, y, z, o);
    }

    for (let i = 0; i < amnt8; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      tree2Array[i] = new Tree2(x, y, z, o);
    }

    for (let i = 0; i < amnt9; i++) {
      let x = random(-width / 2, width / 2);
      let y = -Yoffset;
      let z = zoffset + random(1);
      let o = op;
      bugsArray[i] = new Bugs(x, y, z, o);
    }
  }
}
