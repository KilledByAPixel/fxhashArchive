const _DEBUG=false;
if(_DEBUG)
{
var scrbase="./";
var scrend=".js?v="+fxhash;
var scr=['RQCommon','FileSaver.min','Math/RQMaths','Math/RQVec2','Math/RQVec3','Math/RQMatrix4','Math/RQRectangle','Math/RQTriangulate','Math/RQLines','Graphics/Texture','Graphics/Color','Algorithms/PatternAlgorithm','Algorithms/YZ','Plants/SpeciesLibrary','Graphics/Backgrounds','Plants/Leaf','Plants/SpeciesTrees','Collab/YazidUtils','Collab/Yazid','Collab/Examples','Collab/BigFlower','Collab/SkyPattern','v','va1','index'];
for( let i=0; i<scr.length;i++)
document.write(`<script src="${scrbase}${scr[i]}${scrend}"><\/script>`);  // dynamic loading not working in sandbox
}
