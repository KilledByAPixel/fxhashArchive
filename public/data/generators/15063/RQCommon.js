var DOM = false;
var NS  = false;
var IE 	= false;
if (document.getElementById && !document.all) DOM=true; if (document.layers) NS=true; else if (document.all) IE=true;

function getObj(n, d)
{ var p,i,x;  d??=document; if(DOM) return d.getElementById(n)
  if((p=n.indexOf("?"))>0&&parent.frames.length) {d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=getObj(n,d.layers[i].document); return x;
}

function getImg(id,d)
{	if (!d) d=document;
	if (NS && !DOM) return getObj(id,d);
	else return eval("d."+id);
}

// get Scroll Top
//------------------------
function gSY(w)
{
 if (!w) w=self;
	var x
	return parseInt((x=w.pageYOffset)?x: (w.document.documentElement && (x=w.document.documentElement.scrollTop))?x: w.document.body?w.document.body.scrollTop:0)
}

// get Scroll Left
//------------------------
function gSX(w)
{
 if (!w) w=self;
	var x
	return parseInt((x=w.pageXOffset)?x: (w.document.documentElement && (x=w.document.documentElement.scrollLeft))?x: w.document.body?w.document.body.scrollLeft:0)
}

// Set div bg color
function RQBgColor(o,c)
{	if (o)
	{	if (DOM || IE)	o.style.backgroundColor=c;
		else if (NS) o.style.bgColor=c;
	}	

}

function popup(name,url,w,h,isScroll)
{
	var x =(screen.availWidth-w)/2;
	var y =(screen.availHeight-h)/2;
	if(!isScroll) isScroll='no';
	var P
	P=self.open(url,"Popup"+name,'dependent=yes,scrollbars='+isScroll+',status=no,titlebar=no,personalbar=no,menubar=no,toolbar=no,resizable=no,width='+w+',height='+h+',top='+y+',left='+x);    
	P.moveTo(x,y)
	P.focus();
}

function SwapVisibility(id)
{	var o
	if(o=getObj(id))
		o.style.display=(o.style.display!="none"?"none":"block");
}
function SetVisibility(id,m)
{	var o
	if(o=getObj(id))
		o.style.display=m?"block":"none";
}
function RQSetClassName(id,name)
{
	var o
	if(o=getObj(id))
		o.className=name
}

function SubmitForm(formName)
{	var o
	if( o=getObj(formName))
	{	o.submit();
	}
}
/*
function SetVariable(varname,value)
{	var o
	if(o=getObj(varname)) o.value=value;
}
*/
function SetVariable(varname,value)
{	var objs,i
	if(objs=document.getElementsByName(varname))
	{	for(i=0;i<objs.length;i++)
			objs.item(i).value=value;
		
	}else RQDebug("Variable "+varname+" not found");
}
function RQGetVariableValue(varname)
{	var objs
	if(objs=document.getElementsByName(varname))
	{	if( objs.length)
			return RQGetInputValue(objs.item(0));
	}
}
// RQGetInputValue
// returns the value of an input
function RQGetInputValue(o)
{
	if( typeof o.value !='undefined')
		return o.value;
	// for radio buttons / todo: comboboxes
	if( typeof o.length !=  'undefined')
	{	var i
		for(i=0;i<o.length;i++)
		{	if(o[i].checked) return o[i].value;
		}
	}
	return null;
}

function RQError(txt)
{	var o;
	if( o=getObj('rqDebug'))
	{
		o.innerHTML += "<div class=\"error\">"+txt+"</div>";
	}
	else 	console.log("RQErr:"+txt);

}
function RQDebug(txt)
{	var o;
	if( o=getObj('rqDebug'))
	{
		o.innerHTML += "<div class=\"message\">"+txt+"</div>";
	}
}
var rqImgs=new Array
var rqNbImgs=0
function RQPreload(imname,pth)
{	if( !pth) pth="Data/Img/";
	rqImgs[rqNbImgs]=new Image(); rqImgs[rqNbImgs++].src=pth+imname;
}


function RQMel(host,ext,name,content)
{
	var mel
	mel=name+"@"+host+"."+ext;
	document.write("<a href=\""+"mailto:");
	document.write(mel);
	document.write("\"");
	document.write(">");
	if( !content) content=mel;
	document.write(content);
	document.write("</a>");
}

function RQDelegate(obj,method)
{
	return function(){return method.call(obj);}
}

function RQJumpToAnchor(name)
{
	window.location.hash = name;
}

// RQGetClientSize
// returns window's dimensions
function RQGetClientSize() 
{
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }

	return [myWidth, myHeight];
}

function RQPrintR(o,maxLevel)
{
	maxLevel = 0+maxLevel;
	if( o==null)
		return "(null)";
	if( typeof o==="object")
	{	var s=" { ";
		for(var k in o)
		{
			//s+=k+":"+RQPrintR(o[k])+" ";
			s+=k+":"+( typeof o[k]==="object" ? ( maxLevel>0? 
				 RQPrintR(o[k],maxLevel-1)				
				: "object"				
				) :  o[k]  )+" ";
		}
		s+="} ";
		return s;
	}
	return o;

}
function GetEltBody()
{
	return document.getElementsByTagName('body')[0];
}
const _NS = "http://www.w3.org/2000/svg";
function NewElt(tag,attrs,scope)
{
    let elt=scope? document.createElementNS(scope,tag):document.createElement(tag);
    if(attrs)
    {   for(let a in attrs)
        {   switch(a)
            {   case 'text': elt.innerText=attrs[a]; break;
                case 'html': elt.innerHTML=attrs[a]; break;
                case 'appendTo': attrs[a].appendChild(elt);break;
                default : elt.setAttribute(a,attrs[a]);break;
            }  
        }
    }
    return elt;
}
function NewEltNs(tag,attrs)
{
	return NewElt(tag,attrs,_NS);
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}


function downloadSVG(data,filename)
{
	var blob = new Blob([`<?xml version="1.0" encoding="UTF-8" standalone="no"?>\r<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n`+data], { type: 'image/svg+xml' });
	saveAs(blob, filename);
}

async function mySVG(filename,opt)
{
	if(A)
	{
		if(opt && opt.w && opt.h && A.svg)
		{
			A.svg.setAttribute("width",opt.w);
			A.svg.setAttribute("height",opt.h);
		}
		await A.M_drawLinesToSvg(true).then(()=>{
			console.log("Let's plot this !");			
			downloadSVG(A.svg.outerHTML,filename);
		});
	}
}

const hexToD=(a)=>(a>=48&&a<=57)?a-48 : (a>=97&&a<=102)?(a-97)+10 : (a>=65 && a<=70)?(a-65)+10 : 0;
const bytesToStr=(byteStr)=>{  let n=byteStr.length; let str="";
  for( let k=0;k<n;k+=2) str+=String.fromCharCode(hexToD(byteStr.charCodeAt(k))*16 + hexToD(byteStr.charCodeAt(k+1))); 
  return str;
}
const hexToRGBA=(s,alpha)=>{
	let i,k,r=[0,0,0,alpha??1],t=s.charAt(0)=='#'?1:0;
	for(i=0,k=t;k<6+t;k+=2,i++)
	{	r[i]=hexToD(s.charCodeAt(k))*16 + hexToD(s.charCodeAt(k+1));
	}
	return `rgba(${r[0]},${r[1]},${r[2]},${r[3].toPrecision(2)})`;
}