import{_ as s,g as B,s as E,a as L,b as V,t as _,q,l as z,c as H,F as K,K as G,P as I,d as J,z as Q,H as U}from"./mermaid.core-4nVOEVX3.js";import{p as X}from"./chunk-4BX2VUAB-DLxaCNYh.js";import{p as Y}from"./treemap-75Q7IDZK-CnuVFbBG.js";import"./transform-D9VCJYws.js";import{d as P}from"./arc-Cuwikxov.js";import{o as Z}from"./ordinal-DDUp3AbE.js";import{a as w,t as F,n as ee}from"./step-BwsUM5iJ.js";import"./index-OC46250R.js";import"./_baseEach-C1FLm7WW.js";import"./_baseUniq-Dk7ZPJ3N.js";import"./min-D259kI3t.js";import"./_baseMap-DBVArUYD.js";import"./clone-DM1YNjEn.js";import"./_createAggregator-Bn38fDd3.js";import"./timer-Bqd5yn_a.js";import"./init-DLRA0X12.js";function te(e,r){return r<e?-1:r>e?1:r>=e?0:NaN}function ae(e){return e}var ne=U.pie,O={sections:new Map,showData:!1},k=O.sections,R=O.showData,re=structuredClone(ne),j={getConfig:s(()=>structuredClone(re),"getConfig"),clear:s(()=>{k=new Map,R=O.showData,Q()},"clear"),setDiagramTitle:q,getDiagramTitle:_,setAccTitle:V,getAccTitle:L,setAccDescription:E,getAccDescription:B,addSection:s(({label:e,value:r})=>{if(r<0)throw new Error(`"${e}" has invalid value: ${r}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);k.has(e)||(k.set(e,r),z.debug(`added new section: ${e}, with value: ${r}`))},"addSection"),getSections:s(()=>k,"getSections"),setShowData:s(e=>{R=e},"setShowData"),getShowData:s(()=>R,"getShowData")},ie=s((e,r)=>{X(e,r),r.setShowData(e.showData),e.sections.map(r.addSection)},"populateDb"),le={parse:s(async e=>{const r=await Y("pie",e);z.debug(r),ie(r,j)},"parse")},oe=s(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),se=s(e=>{const r=[...e.values()].reduce((i,o)=>i+o,0),W=[...e.entries()].map(([i,o])=>({label:i,value:o})).filter(i=>i.value/r*100>=1).sort((i,o)=>o.value-i.value);return(function(){var i=ae,o=te,p=null,S=w(0),m=w(F),T=w(0);function l(t){var a,f,D,c,h,u=(t=ee(t)).length,x=0,v=new Array(u),d=new Array(u),g=+S.apply(this,arguments),$=Math.min(F,Math.max(-F,m.apply(this,arguments)-g)),b=Math.min(Math.abs($)/u,T.apply(this,arguments)),C=b*($<0?-1:1);for(a=0;a<u;++a)(h=d[v[a]=a]=+i(t[a],a,t))>0&&(x+=h);for(o!=null?v.sort(function(y,A){return o(d[y],d[A])}):p!=null&&v.sort(function(y,A){return p(t[y],t[A])}),a=0,D=x?($-u*C)/x:0;a<u;++a,g=c)f=v[a],c=g+((h=d[f])>0?h*D:0)+C,d[f]={data:t[f],index:a,value:h,startAngle:g,endAngle:c,padAngle:b};return d}return l.value=function(t){return arguments.length?(i=typeof t=="function"?t:w(+t),l):i},l.sortValues=function(t){return arguments.length?(o=t,p=null,l):o},l.sort=function(t){return arguments.length?(p=t,o=null,l):p},l.startAngle=function(t){return arguments.length?(S=typeof t=="function"?t:w(+t),l):S},l.endAngle=function(t){return arguments.length?(m=typeof t=="function"?t:w(+t),l):m},l.padAngle=function(t){return arguments.length?(T=typeof t=="function"?t:w(+t),l):T},l})().value(i=>i.value)(W)},"createPieArcs"),pe={parser:le,db:j,renderer:{draw:s((e,r,W,N)=>{z.debug(`rendering pie chart
`+e);const i=N.db,o=H(),p=K(i.getConfig(),o.pie),S=18,m=450,T=m,l=G(r),t=l.append("g");t.attr("transform","translate(225,225)");const{themeVariables:a}=o;let[f]=I(a.pieOuterStrokeWidth);f??(f=2);const D=p.textPosition,c=Math.min(T,m)/2-40,h=P().innerRadius(0).outerRadius(c),u=P().innerRadius(c*D).outerRadius(c*D);t.append("circle").attr("cx",0).attr("cy",0).attr("r",c+f/2).attr("class","pieOuterCircle");const x=i.getSections(),v=se(x),d=[a.pie1,a.pie2,a.pie3,a.pie4,a.pie5,a.pie6,a.pie7,a.pie8,a.pie9,a.pie10,a.pie11,a.pie12];let g=0;x.forEach(n=>{g+=n});const $=v.filter(n=>(n.data.value/g*100).toFixed(0)!=="0"),b=Z(d);t.selectAll("mySlices").data($).enter().append("path").attr("d",h).attr("fill",n=>b(n.data.label)).attr("class","pieCircle"),t.selectAll("mySlices").data($).enter().append("text").text(n=>(n.data.value/g*100).toFixed(0)+"%").attr("transform",n=>"translate("+u.centroid(n)+")").style("text-anchor","middle").attr("class","slice"),t.append("text").text(i.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText");const C=[...x.entries()].map(([n,M])=>({label:n,value:M})),y=t.selectAll(".legend").data(C).enter().append("g").attr("class","legend").attr("transform",(n,M)=>"translate(216,"+(22*M-22*C.length/2)+")");y.append("rect").attr("width",S).attr("height",S).style("fill",n=>b(n.label)).style("stroke",n=>b(n.label)),y.append("text").attr("x",22).attr("y",14).text(n=>i.getShowData()?`${n.label} [${n.value}]`:n.label);const A=512+Math.max(...y.selectAll("text").nodes().map(n=>(n==null?void 0:n.getBoundingClientRect().width)??0));l.attr("viewBox",`0 0 ${A} 450`),J(l,m,A,p.useMaxWidth)},"draw")},styles:oe};export{pe as diagram};
