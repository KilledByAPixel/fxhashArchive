// Author: Nathaniel Sarkissian
// Date: February 26, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function setPix(ind, col) {
  pixels[ind + 0] = red(col);
  pixels[ind + 1] = green(col);
  pixels[ind + 2] = blue(col);
  pixels[ind + 3] = alpha(col);
}

function blurMap(map, it) {
  let i, j, k, sum, count;
  for (k = 0; k < it; k++) {
    for (i = 0; i < map.length; i++) {
      for (j = 0; j < map[0].length; j++) {
        sum = 0;
        count = 0;

        if (i > 0) {
          count++;
          sum += map[i - 1][j]; // left
          if (j > 0) {
            count++;
            sum += map[i - 1][j - 1]; // top left
          }
          if (j < map[0].length - 1) {
            count++;
            sum += map[i - 1][j + 1]; // bottom left
          }
        }
        if (i < map.length - 1) {
          count++;
          sum += map[i + 1][j]; // right
          if (j > 0) {
            count++;
            sum += map[i + 1][j - 1]; // top right
          }
          if (j < map[0].length - 1) {
            count++;
            sum += map[i + 1][j + 1]; // bottom right
          }
        }

        map[i][j] = sum / count;
      }
    }
  }
}
