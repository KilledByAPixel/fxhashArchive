// Author: Nathaniel Sarkissian
// Date: January 12, 2023
// This file, and all other files in this
// project are covered by the license
// described in LICENSE.txt.

function preparePalette(paletteIndex) {
  palettes.push([ //0
    color('#000'),
    color('#222'),
    color('#444'),
    color('#777'),
    color('#ddd'),
    color('#fff'),
  ]);
  treePalettes.push([ //0
    color('#000'),
    color('#222'),
    color('#444'),
    color('#777'),
    color('#ddd'),
    color('#fff'),
  ]);


  palettes.push([ //1
    color('#0f0347'),
    color('#1c0682'),
    color('#114ff2'),
    color('#114ff2'),
    color('#d91c2f'),
    color('#d91c2f'),
    color('#fe3da7'),
    color('#fe3da7'),
    color('#f79357'),
    color('#f79357'),
    color('#fbc442'),
    color('#fbc442'),
  ]);
  treePalettes.push([ //1
    color('#0f0347'),
    color('#1c0682'),
    color('#114ff2'),
    color('#5f317d'),
    color('#5f317d'),
    color('#bb39a2'),
    color('#bb39a2'),
    color('#f45969'),
    color('#f45969'),
    color('#fbc442'),
  ]);

  palettes.push([ //2
    color('#1a1d28'),
    color('#377D71'),
    color('#8879B0'),
    color('#FBA1A1'),
    color('#FBC5C5'),
  ]);
  treePalettes.push([ //2
    color('#1a1d28'),
    color('#2d3351'),
    color('#214942'),
    color('#214942'),
    color('#704723'),
    color('#6dad9f'),
    color('#6dad9f'),
    color('#f99d9d'),
    color('#f8b861'),
  ]);

  palettes.push([ //3
    color('#29264E'),
    lerpColor(
      color('#29264E'),
      color('#9881F5'), 0.5),
    color('#9881F5'),
    lerpColor(
      color('#9881F5'),
      color('#82AFF9'), 0.5),
    color('#F97D81'),
    lerpColor(
      color('#F97D81'),
      color('#fcbcbe'), 0.5),
    color('#fcbcbe'),
    color('#f7c066'),
  ]);
  treePalettes.push([ //3
    color('#29264E'),
    color('#354e6f'),
    color('#8475bd'),
    color('#6daba5'),
    color('#fcbcde'),
    color('#f7c066'),
  ]);

  palettes.push([ //4
    color('#232601'),
    color('#4a69fe'),
    color('#226330'),
    color('#ef412f'),
    color('#efac25'),
    color('#eeefd0'),
  ]);
  treePalettes.push([ //4
    color('#232601'),
    color('#232601'),
    color('#6b8adc'),
    color('#226330'),
    color('#c4685b'),
    color('#c1a953'),
    color('#eeefd0'),
  ]);

  palettes.push([ //5
    color('#040B21'),
    color('#0C282D'),
    color('#2B4039'),
    color('#9A422E'),
    color('#d87d1b'),
    color('#DFB4BF'),
    color('#F3E7DC'),
  ]);
  treePalettes.push([ //5
    color('#040B21'),
    color('#0C282D'),
    color('#2B4039'),
    color('#9A422E'),
    color('#d87d1b'),
    color('#DFB4BF'),
    color('#F3E7DC'),
  ]);

  palette = palettes[paletteIndex];
  treePalette = treePalettes[paletteIndex];
}

function paletteColor(br) {
  let ind = constrain(floor(br * palette.length), 0, palette.length - 1);
  return palette[ind];
}

function treePaletteColor(br) {
  let ind = constrain(floor(br * treePalette.length), 0, treePalette.length - 1);
  return treePalette[ind];
}

function landscapeColor(i, j) {
  return paletteColor(
    map(
      hMap[i][j],
      0,
      TWO_PI * 2,
      0,
      noise(i * noiseScale * 4 + 1000, j * noiseScale * 4 + 1000)
    )
  );
}

function lightColor(br) {
  return paletteColor(br);
}