console.log(fxrand());
const _DEBUG=false;
if(_DEBUG)
{
var scrbase="./";
var scrend=".js?v="+fxhash;
var scr=['index','Gr','Pa','v','va1','Tx','Math'];
let i; while(i=scr.pop())
document.write('<script src="'+scrbase+i+scrend+'"><\/script>');  // dynamic loading not working in sandbox
}
