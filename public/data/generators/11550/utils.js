function randitem(lst) {
  return lst[randint(0,lst.length)];
}

function randfloat(min,max) {
  return fxrand() * (max - min) + min;
}

function randint(min,max) {
  return Math.floor(min + ((max-0.00001) - min) * fxrand());
}

const pick = (arr) => arr[(random() * arr.length) | 0];
function getWeightedOption(options) {
  let choices = [];
  for (let i in options)
    choices = choices.concat(new Array(options[i][1]).fill(options[i][0]));
  return pick(choices);
};

function hexToRgb(hex) {
  var x = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(x[1],16),parseInt(x[2],16), parseInt(x[3],16)];
}

function parseHexStrings(hs) {
  let hexs = []
  hs = hs.replace(/\s/g, '');
  for (let i=0; i<hs.length/6; i++) {
    hexs.push( hexToRgb(hs.substring(i*6,(i+1)*6)) );
  }
  return hexs;
}

var palettes = ["ee8067f3df7600a9c0f7ab76", "f0865cf2b07b6bc4d21a3643", "fe765affb4684b588ffaf1e0", "e76c4af0d9677f8cb61daeb1ef9640", "f04924fcce09408ac9", "f8c3dff2e42028b3d0648731ef6a7d", "ca3122e5af164a93a20e7e39e2b9bd", "f0afb7f6bc121477bb41bb9b", "395e54e77b4d050006e55486", "809498d3990e000000ecddc5", "ecddc579b27b000000ac6548", "f3cb4df2f5e320191b67875c", "c37c2bf6ecce000000386a7a", "596f7eeae6c7463c21f4cb4c", "c7566900000011706a", "6b5c6e4a2839d9574a", "e9dcad143331ffc000", "c47c2b5f57260000007e8a84", "c15e1fe4a13a0000004d545a", "4bae8cd0c1a02d3538", "f6d700f2d6920000005d3552", "c65f75d3990e000000597e7a", "dd614af5cedb1a1e4f", "ff5937f6f6f44169ff", "ff5937f6f6f4f6f6f4", "f6f6f4ff5937ff5937", "4169fff6f6f4f6f6f4", "f6f6f44169ff4169ff", "d24c237ba6bcf0c667ede2b3672b35142a36", "e8dccce94641eeaeae", "e3937bd93f1d090d15e6cca7", "d03718292b3633762fead7c9ce7028689d8d", "de3f1ade9232007158e6cdaf869679", "a87c2abdc9b1f14616ecbfaf0177240e27332b9ae9", "d57846dfe0ccde442fe7d3c55ec227302f3563bdb3", "c91619fdecd2f4a0004c2653", "ec5526f4ac129ebbc1f7f4e2", "eb5627eebb204e9eb8f7f5d0", "e95145f8b917b8bdc1ffb2a2", "e95145f6bf7a589da1f5d9bc", "ff6555ffb58fd8eecf8c4b47bf7f93", "f75952ffce8474b7b2f6f6f6b17d71", "ff4242fec1011841fefcbdcc82e9b5", "ff4242ffd4801e365dedb14c418dcd", "f73f4ad3e5eb002c3e1aa1b1ec6675", "e31f4ff0ac3f18acab26265aea7d81dcd9d0", "db4549d1e1e13e6a902e3853a3c9d3", "e5475c95b39428343bf7c6a3eb8078", "d75c49f0efea509da4", "f6625a92b29f272c3f", "000000d55a3a2a5c8a7e7d14dbdac9", "dbdac9d55a3a2a5c8ab47b8c7e7d14", "dbdac9d55a3a2a5c8a", "dbdac9d55a3a7e7d14", "fc3032fed53033c3fbff7bacfda929", "e72e81f0bf363056a2", "f13274eed03e405e7f19a198", "ff7bacff921e3ea8f57ac943", "e51c39f1b84436c4b7666666", "29368fe9697b1b164df7d996", "122438dd672e87c7caebebeb", "eab700e648182c6393eecfca", "20342af74713686d2ce9b4a6", "1d3b1aeb4b11e5bc00f29881", "ec643b56b7abf8cb571f1e43", "ff3931007861311f27bab9a4", "25385251222fb53435ecbb51", "ff3250ffb33a008c360085c64c4c4c", "c54514dca21523507f", "f40104f6c0b399673af0f1f4", "bf4a2bcd902a4e4973f5d4bc", "f1594af5b50e14a1602969de885fa4", "ea7251ebf7f002aca5", "e2d574f1f4f769c5ab", "f05e3bebdec4ffdb00", "f2d002f7f5e1ec643b", "a49f4fd4501ef7c558ebbaa6", "ec2f28f8cd281e95bbfbaab3fcefdf", "ff5500f4c1451447142f04fce276af", "ed555dfffcc941b797eda1267b5770", "e8165b401e3866c3b4ee7724584098", "ff6936fddc3f0075ca00bb70", "BCAA8CD8CDBE484A42746B589A8C73", "df456cea6a82270b32471e43", "f6c103f6f6f6d1cdc7e7e6e5", "be1c24d1a082037b68d8b1a51c2738c95a3f", "20357ef44242ffffff", "e16503dc9a0fdfe2b466a7a6", "df302fe5a3200466b30f7963", "e24724c7c7c71f3e7cd29294010203", "4f423af6a74b589286f8e9e22c2825", "1767D2FFFFFFF9AB00212121", "ff7a5a765aa6fee7bc515e8cffc64ab460a6ffffff4781c1", "ae5d9df1e8bcef8fa3f7c04758c9edf77150", "f77656f7f7f7efc545dfe0e23c70bd66bee4", "172a89f7f7f3", "302956f3c507", "eee3d3", "000000a7a7a7", "50978ef7f0df", "ee5d65f0e5cb", "271f47e7ceb5", "6a98a5d24c18", "5d9d88ebb43b", "052e57de8d80", "e5dfcf151513", "ece9e2", "f5f2d3", "f5f2d3f5f2d3fbd6b8", "e3dd3478496bf0527fa7e0e2", "ffce49ede8dcff5736ff99b4", "5c5f46ff7044ffce3966aeaa", "553c60ffb0a0ff6749fbe090", "bbd444fcd744fa7b53423c6f", "0d4a4eff947bead3a25284ab", "363d4a7b8a56ff9369f4c172", "69766f9ed6cbf7e5cc9d8f7f936454bf5c32efad57", "878a87cbdbc8e8e0d4b29e919f736cb76254dfa372", "705f84687d996c843efc9a1adc383aaa3a339c4257", "817c77396c6889e3b7f59647d63644893f494d3240", "fd3741fe4f11ff6800ffa61affc219ffd114fcd82ef4d730ced5628ac38f79b7a072b5b15b9bae6ba1b749619d604791721e7f9b2b77ab2562ca2847", "ec6c26613a53e8ac52639aa0", "d3693e803528f1b15690a798", "f46e2668485f3d273a535d55", "ea720eca5130e9c25a52534f", "ce565e8e1752f8a1003ac1a6", "f5736a925951feba4c9d9b9d", "ea510effd2030255a3039177111111", "ea663ff9cc2784afd77ca994f1bbc9242424", "ea5b19f8c9b91376612a2a2a", "004996567baeff4c48ffbcb3", "004996567baeffc000ffdca4", "004996567bae60bf3cd2deb1", "4d3d9af76975ffffffeff0dd", "abdfdffde50058bdbceff0dd", "fde5002f2043f76975eff0dd", "4aad8be15147f3b551cec8b8d1af84544e47", "75974ac83e3cf39140e4ded2f8c5a4434f55", "687f72cc7d6cdec36fdec7afad8470424637", "c92a28e693011f879313652be7d8b048233be3b3ac", "475b627a999c2a1f1dfbaf3cdf4a33f0e0c6af592c", "13477b2f1b10d18529d72a25e421841388989d27877f311b", "e85b30ef9e28c6ac71e0c1913f6279ee854e180305", "c03a53edd09eaab5af023629eba7358e93806c4127", "df9f001f6f508e6d7fda0607a4a5a7d3d1c342064f25393a", "99cb9fcfb610d00701dba78d2e2c1dbfbea2d2cfaf", "313a429aad2ef0ae3cdf48228eac9bcc3d3fec8b1c1b9268", "f14d42f4fdec4fbe5d265487f6e916f9a0872e99d6", "adb100e5f4e9f4650f4d6838cb9e00689c7de2a1a8151c2e", "f4b232f2dbbd01799ce93e480b1952006748ed817d", "5399b1f4e9d5de4037ed942f4e9e487a6e62", "FBF5E9FF514EFDBC2E4561CC2A303E6CC283A71172238DA59BD7CB231E584E0942", "FBF5E9FF514EFDBC2E4561CC2A303E6CC283238DA59BD7CB", "8bc9c3ffae43ea432c228345d1d7d3524e9c9dc35ef0a1a1", "8bc9c3ffae43ea432c524e9c", "8bc9c3ffae43ea432c524e9cf0a1a1228345", "ffae43ea432c524e9cf0a1a1", "40708c8e998c5d3f37ed6954f2e9e2", "5f9e933d3638733632b66239b0a1a4e3dad2", "87c3ca7b7377b2475d7d3e3eeb7f64d9c67af3f2f2", "d53939b6754da88d5f5246433c5a537d8c7cdad6cd"];

var palette_names = ["iiso_zeitung", "iiso_curcuit", "iiso_airlines", "iiso_daily", "jud_playground", "jud_horizon", "jud_mural", "jud_cabinet", "ducci_jb", "ducci_a", "ducci_b", "ducci_d", "ducci_e", "ducci_f", "ducci_g", "ducci_h", "ducci_i", "ducci_j", "ducci_o", "ducci_q", "ducci_u", "ducci_v", "ducci_x", "spatial01", "spatial02", "spatial02i", "spatial03", "spatial03i", "kov_01", "kov_02", "kov_03", "kov_04", "kov_05", "kov_06", "kov_06b", "kov_07", "hilda01", "hilda02", "hilda03", "hilda04", "hilda05", "hilda06", "system#01", "system#02", "system#03", "system#04", "system#05", "system#06", "system#07", "system#08", "cako1", "cako2", "cako2_sub1", "cako2_sub2", "jung_bird", "jung_horse", "jung_croc", "jung_hippo", "jung_wolf", "frozen-rose", "winter-night", "saami", "knotberry1", "knotberry2", "tricolor", "foxshelter", "hermes", "olympia", "byrnes", "butterfly", "floratopia", "verena", "florida_citrus", "lemon_citrus", "yuma_punk", "yuma_punk2", "moir", "sprague", "bloomberg", "revolucion", "sneaker", "miradors", "kaffeprat", "jrmy", "animo", "book", "juxtapoz", "hurdles", "ludo", "riff", "san ramon", "one-dress", "dale_paddle", "dale_night", "dale_cat", "dt01", "dt02", "dt02b", "dt03", "dt04", "dt05", "dt06", "dt07", "dt08", "dt09", "dt10", "dt11", "dt12", "dt13", "cc239", "cc234", "cc232", "cc238", "cc242", "cc245", "cc273", "retro", "retro-washedout", "roygbiv-warm", "roygbiv-toned", "present-correct", "rag-mysore", "rag-gol", "rag-belur", "rag-bangalore", "rag-taj", "rag-virupaksha", "mayo1", "mayo2", "mayo3", "rohlfs_1R", "rohlfs_1Y", "rohlfs_1G", "rohlfs_2", "rohlfs_3", "rohlfs_4", "tsu_arcade", "tsu_harutan", "tsu_akasaka", "empusa", "delphi", "mably", "nowak", "jupiter", "hersche", "cherfi", "harvest", "honey", "jungle", "skyspider", "atlas", "giftcard", "giftcard_sub", "exposito", "exposito_sub1", "exposito_sub2", "exposito_sub3", "tundra1", "tundra2", "tundra3", "tundra4"];


function random_palette(index) {
  if (index === undefined) {
    index = randint(0,palettes.length);
  }
	console.log("PALLETE :: " + palette_names[index], index, palettes[index]);
  return parseHexStrings(palettes[index]);
}

function palette_by_name(name) {
  for (let i=0; i<palettes.length; i++) {
    if (palette_names[i] == name) {
      return palettes[i];
    }
  }
  return null;
}

