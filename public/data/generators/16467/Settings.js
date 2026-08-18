
function setStyle() {
  basePalleteName =  $fxhashFeatures["Base Pallete"];
  print("Base Pallete: " + basePalleteName);

  bloomPalleteName = $fxhashFeatures["Bloom Pallete"];
  print("Bloom Pallete: " + bloomPalleteName);

  numFlowers = $fxhashFeatures["Flowers Number"];
  print("Flowers Number: " + numFlowers);

  leavesNumber = $fxhashFeatures["Leaves Number"];
  print("Leaves Number: " + leavesNumber);

  smearSize = $fxhashFeatures["Smear Size"];
  print("Smear Size: " + smearSize);

  smearLevel = $fxhashFeatures["Smear Level"];
  print("Smear Level: " + smearLevel);

  numbersWonders = $fxhashFeatures["Winds"];
  print("Winds: " + numbersWonders);

  isStripes = $fxhashFeatures["Stripes"];
  print("Stripes: " + isStripes);

  isMonochrome = $fxhashFeatures["Monochrome"];
  print("Monochrome: " + isMonochrome);
  

}

window.$fxhashFeatures = {

  "Bloom Pallete":
get_bloomPallete(),

  "Base Pallete":
get_basePalleteName(),


  "Flowers Number":
get_flowersNumber(),

  "Leaves Number":
get_leavesDensity(),

  "Smear Size":
get_smearSize(),

  "Smear Level":
get_smearLevel(),

  "Winds":
get_numbersWonders(),

  "Stripes":
get_isStripes(),

  "Monochrome":
get_isMonochrome()

  }


function get_bloomPallete() {
  let BLOOM_NAME = ["Rachel", "Jacob", "Margaretha", "Barbara", "Clemntine", "Arnoldus", "Nicholas", "Amaile", "Ambrosius", "Maria", "Hiroshige", "Marianne", "Paul", "Elisabeth", "Peter", "Jan", "Clude", "Vincent", "Georgia", "Odioln", "Pierre", "Henri", "Valentine", "Johannes", "Catharina", "Emil", "Judith"];
  let r = fxrand();
  bloomPallete = Math.floor(r*27);
  let bloomName = BLOOM_NAME[bloomPallete];
  return bloomName;
}

function get_basePalleteName() {
  let LEAVES_NAMES = ["Van", "O'Keeffe", "Latour", "Bosschaert", "Ruysch", "Hunter", "Bonahuida", "Gogh", "Redon", "Haverman", "Matisse", "Redoute", "Huysum", "Aubriet", "North", "Robert", "Dali", "Kahlo", "de Vinci", "Monet", "Leyster", "Nolde", "Cassatt"];
  let r = fxrand();
  basePalleteName = Math.floor(r*22);
  let baseName = LEAVES_NAMES[basePalleteName];
  return baseName;
}

function get_flowersNumber() {
  let r = fxrand();
  numFlowers = Math.floor(r * 97 + 10);
  return numFlowers;
}

function get_leavesDensity() {
  let r = fxrand();
  leavesNumber = Math.floor(r * 12 + 9);
  return leavesNumber;
}

function get_smearSize() {
  let r = fxrand();
  smearSize = r;
  return smearSize;
}

function get_smearLevel() {
  let r = fxrand();
  smearLevel = r * 1.3 + 0.5;
  return smearLevel;
}

function get_numbersWonders() {
  let r = fxrand();
  numbersWonders = Math.floor(r * 1300 + 100);

  return numbersWonders;
}

function  get_isStripes() {
  let r = fxrand();

  if ( r < 0.21 ) isStripes = "Yes";
  else
    isStripes = "No";

  return isStripes;
}

function  get_isMonochrome() {
  let r = fxrand();

  if ( r < 0.06 ) isMonochrome = "Yes";
  else
    isMonochrome = "No";

  return isMonochrome;
}
