// Author: Nathaniel Sarkissian
// Date: August 7, 2022
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function pickPalette() {
  colorR = random([
    0, 0, 0,
    1, 1, 1,
    2, 2, 2,
    3, 3, 3,
    5, 5,
    8, 8, 8,
    9,
    10, 10,
    12, 12,
    13, 13
  ]);

  strokeCol = color('#000000');
  speckleCol = color('#ffffff');
  if (colorR == 0) {
    lightCol = color('#ffffff');
    midCol = color('#ffffff');
    darkCol = color('#000000');
    accentCol = color('#ff0000');
    shading = "hard";
  } else if (colorR == 1) {
    lightCol = color('#ea00d2');
    midCol = color('#000fbf');
    darkCol = color('#000000');
    accentCol = color('#000fbf');
    strokeCol = color('#a6d2ff');
    shading = "hard";
  } else if (colorR == 2) {
    lightCol = color('#ffc600');
    midCol = color('#e324ff');
    darkCol = color('#0072ce');
    accentCol = color('#4f2fce');
  } else if (colorR == 3) {
    lightCol = color('#ffb70d');
    midCol = color('#911dcf');
    darkCol = color('#1c56d0');
    accentCol = color('#ffb70d');
    shading = "soft";
  } else if (colorR == 4) {
    lightCol = color('#ffffff');
    midCol = color('#ffffff');
    darkCol = color('#ffffff');
    accentCol = color('#ffffff');
    subdivDistribution = "shading";
  } else if (colorR == 5) {
    lightCol = color('#79fb6a');
    midCol = color('#e4236b');
    darkCol = color('#000000');
    accentCol = color('#e4236b');
    shading = "soft";
  } else if (colorR == 6) {
    lightCol = color('#ffffff');
    midCol = color('#ff40ae');
    darkCol = color('#00def0');
    if (floor(random(10)) < 5) {
      accentCol = color('#ffffff');
    } else {
      accentCol = color('#00bcfb');
    }
    shading = "hard";
  } else if (colorR == 7) {
    lightCol = color('#f1db5f');
    midCol = color('#8dbe98');
    darkCol = color('#7147a9');
    accentCol = color('#e07458');
  } else if (colorR == 8) {
    lightCol = color('#ff4600');
    midCol = color('#7624ff');
    darkCol = color('#00cec4');
    accentCol = color('#2f5fce');
  } else if (colorR == 9) {
    lightCol = color('#000000');
    midCol = color('#000000');
    darkCol = color('#000000');
    accentCol = color('#000000');
    strokeCol = color('#ffffff');
    speckleCol = color('#ffffff');
    speckledShading = true;
    shading = "hard";
  } else if (colorR == 10) {
    lightCol = color('#74d7c0');
    midCol = color('#f273b6');
    darkCol = color('#a44dd2');
    accentCol = color('#faf59e');
    strokeCol = color('#060079');
    shading = "soft";
  } else if (colorR == 11) {
    lightCol = color('#5ec50b');
    midCol = color('#f4eb20');
    darkCol = color('#484bf5');
    accentCol = color('#9c51f9');
  } else if (colorR == 12) {
    lightCol = color('#ff0000');
    midCol = color('#000000');
    darkCol = color('#000000');
    accentCol = color('#000000');
    strokeCol = color('#ffa6d5');
    speckleCol = strokeCol;
    shading = "hard";
    speckledShading = true;
  } else if (colorR == 13) {
    lightCol = color('#ffe240');
    midCol = color('#000000');
    darkCol = color('#000000');
    accentCol = color('#000000');
    strokeCol = color('#ffb70f');
    speckleCol = strokeCol;
    shading = "hard";
    speckledShading = true;
  }
}