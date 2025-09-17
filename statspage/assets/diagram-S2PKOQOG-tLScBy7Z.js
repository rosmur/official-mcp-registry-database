var m;import{_ as f,F as u,K as C,d as v,l as w,b as P,a as z,q as F,t as S,g as W,s as E,G as T,H as D,z as A}from"./mermaid.core-4nVOEVX3.js";import{p as H}from"./chunk-4BX2VUAB-DLxaCNYh.js";import{p as R}from"./treemap-75Q7IDZK-CnuVFbBG.js";import"./index-OC46250R.js";import"./transform-D9VCJYws.js";import"./timer-Bqd5yn_a.js";import"./step-BwsUM5iJ.js";import"./_baseEach-C1FLm7WW.js";import"./_baseUniq-Dk7ZPJ3N.js";import"./min-D259kI3t.js";import"./_baseMap-DBVArUYD.js";import"./clone-DM1YNjEn.js";import"./_createAggregator-Bn38fDd3.js";var Y=D.packet,y=(m=class{constructor(){this.packet=[],this.setAccTitle=P,this.getAccTitle=z,this.setDiagramTitle=F,this.getDiagramTitle=S,this.getAccDescription=W,this.setAccDescription=E}getConfig(){const t=u({...Y,...T().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){A(),this.packet=[]}},f(m,"PacketDB"),m),j=f((e,t)=>{H(e,t);let o=-1,r=[],n=1;const{bitsPerRow:l}=t.getConfig();for(let{start:a,end:i,bits:d,label:c}of e.blocks){if(a!==void 0&&i!==void 0&&i<a)throw new Error(`Packet block ${a} - ${i} is invalid. End must be greater than start.`);if(a??(a=o+1),a!==o+1)throw new Error(`Packet block ${a} - ${i??a} is not contiguous. It should start from ${o+1}.`);if(d===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(i??(i=a+(d??1)-1),d??(d=i-a+1),o=i,w.debug(`Packet block ${a} - ${o} with label ${c}`);r.length<=l+1&&t.getPacket().length<1e4;){const[p,s]=L({start:a,end:i,bits:d,label:c},n,l);if(r.push(p),p.end+1===n*l&&(t.pushWord(r),r=[],n++),!s)break;({start:a,end:i,bits:d,label:c}=s)}}t.pushWord(r)},"populate"),L=f((e,t,o)=>{if(e.start===void 0)throw new Error("start should have been set during first phase");if(e.end===void 0)throw new Error("end should have been set during first phase");if(e.start>e.end)throw new Error(`Block start ${e.start} is greater than block end ${e.end}.`);if(e.end+1<=t*o)return[e,void 0];const r=t*o-1,n=t*o;return[{start:e.start,end:r,label:e.label,bits:r-e.start},{start:n,end:e.end,label:e.label,bits:e.end-n}]},"getNextFittingBlock"),x={parser:{yy:void 0},parse:f(async e=>{var r;const t=await R("packet",e),o=(r=x.parser)==null?void 0:r.yy;if(!(o instanceof y))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");w.debug(t),j(t,o)},"parse")},M=f((e,t,o,r)=>{const n=r.db,l=n.getConfig(),{rowHeight:a,paddingY:i,bitWidth:d,bitsPerRow:c}=l,p=n.getPacket(),s=n.getDiagramTitle(),h=a+i,b=h*(p.length+1)-(s?0:a),k=d*c+2,g=C(t);g.attr("viewbox",`0 0 ${k} ${b}`),v(g,b,k,l.useMaxWidth);for(const[$,B]of p.entries())q(g,B,$,l);g.append("text").text(s).attr("x",k/2).attr("y",b-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),q=f((e,t,o,{rowHeight:r,paddingX:n,paddingY:l,bitWidth:a,bitsPerRow:i,showBits:d})=>{const c=e.append("g"),p=o*(r+l)+l;for(const s of t){const h=s.start%i*a+1,b=(s.end-s.start+1)*a-n;if(c.append("rect").attr("x",h).attr("y",p).attr("width",b).attr("height",r).attr("class","packetBlock"),c.append("text").attr("x",h+b/2).attr("y",p+r/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(s.label),!d)continue;const k=s.end===s.start,g=p-2;c.append("text").attr("x",h+(k?b/2:0)).attr("y",g).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(s.start),k||c.append("text").attr("x",h+b).attr("y",g).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(s.end)}},"drawWord"),G={draw:M},I={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},K=f(({packet:e}={})=>{const t=u(I,e);return`
	.packetByte {
		font-size: ${t.byteFontSize};
	}
	.packetByte.start {
		fill: ${t.startByteColor};
	}
	.packetByte.end {
		fill: ${t.endByteColor};
	}
	.packetLabel {
		fill: ${t.labelColor};
		font-size: ${t.labelFontSize};
	}
	.packetTitle {
		fill: ${t.titleColor};
		font-size: ${t.titleFontSize};
	}
	.packetBlock {
		stroke: ${t.blockStrokeColor};
		stroke-width: ${t.blockStrokeWidth};
		fill: ${t.blockFillColor};
	}
	`},"styles"),N={parser:x,get db(){return new y},renderer:G,styles:K};export{N as diagram};
