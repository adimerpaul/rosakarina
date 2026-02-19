import{b as F,P as x}from"./numeroaletras.735f6b36.js";import{u as E}from"./index.f5457207.js";import{h as Ft}from"./moment.40bc58bf.js";class Ct{constructor(){this.units=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],this.tenToSixteen=["diez","once","doce","trece","catorce","quince","diecis\xE9is"],this.tens=["treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"]}convertirNroMesAtexto(t){switch(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),t){case"1":return"Enero";case"2":return"Febrero";case"3":return"Marzo";case"4":return"Abril";case"5":return"Mayo";case"6":return"Junio";case"7":return"Julio";case"8":return"Agosto";case"9":return"Septiembre";case"10":return"Octubre";case"11":return"Noviembre";case"12":return"Diciembre";default:throw"Numero de mes inv\xE1lido"}}convertToText(t){if(typeof t=="number"&&(t=String(t)),t=this.deleteZerosLeft(t),!this.validateNumber(t))throw"N\xFAmero inv\xE1lido, no se puede convertir!";return this.getName(t)}deleteZerosLeft(t){let e=0,o=!0;for(e=0;e<t.length;e++)if(t.charAt(e)!=0){o=!1;break}return o?"0":t.substr(e)}validateNumber(t){return!(isNaN(t)||t===""||t.indexOf(".")>=0||t.indexOf("-")>=0)}getName(t){return t=this.deleteZerosLeft(t),t.length===1?this.getUnits(t):t.length===2?this.getTens(t):t.length===3?this.getHundreds(t):t.length<7?this.getThousands(t):t.length<13?this.getPeriod(t,6,"mill\xF3n"):t.length<19?this.getPeriod(t,12,"bill\xF3n"):"N\xFAmero demasiado grande."}getUnits(t){let e=parseInt(t);return this.units[e]}getTens(t){let e=t.charAt(1);if(t<17)return this.tenToSixteen[t-10];if(t<20)return"dieci"+this.getUnits(e);switch(t){case"20":return"veinte";case"22":return"veintid\xF3s";case"23":return"veintitr\xE9s";case"26":return"veintis\xE9is"}if(t<30)return"veinti"+this.getUnits(e);let o=this.tens[t.charAt(0)-3];return e>0&&(o+=" y "+this.getUnits(e)),o}getHundreds(t){let e="",o=t.charAt(0),i=t.substr(1);if(t==100)return"cien";switch(o){case"1":e="ciento";break;case"5":e="quinientos";break;case"7":e="setecientos";break;case"9":e="novecientos"}return e===""&&(e=this.getUnits(o)+"cientos"),i>0&&(e+=" "+this.getName(i)),e}getThousands(t){let e="mil",o=t.length-3,i=t.substr(0,o),l=t.substr(o);return i>1&&(e=this.getName(i).replace("uno","un")+" mil"),l>0&&(e+=" "+this.getName(l)),e}getPeriod(t,e,o){let i="un "+o,l=t.length-e,a=t.substr(0,l),c=t.substr(l);return a>1&&(i=this.getName(a).replace("uno","un")+" "+o.replace("\xF3","o")+"es"),c>0&&(i+=" "+this.getName(c)),i}}var C={conversorNumerosALetras:Ct};class It{static numeroALetras(t){if(t=parseInt(t),isNaN(t)||t<0||t>1e6)return"N\xFAmero fuera de rango";const e=["cero","uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve"],o=["","","veinte","treinta","cuarenta","cincuenta","sesenta","setenta","ochenta","noventa"],i={10:"diez",11:"once",12:"doce",13:"trece",14:"catorce",15:"quince",16:"diecis\xE9is",17:"diecisiete",18:"dieciocho",19:"diecinueve"},l=["","cien","doscientos","trescientos","cuatrocientos","quinientos","seiscientos","setecientos","ochocientos","novecientos"];function a(s){if(s<10)return e[s];if(s>=10&&s<20)return i[s];if(s<100){const n=s%10;return`${o[Math.floor(s/10)]}${n>0?" y "+e[n]:""}`}if(s===100)return"cien";const r=s%100;return`${l[Math.floor(s/100)]}${r>0?" "+a(r):""}`}if(t===1e6)return"un mill\xF3n";let c=Math.floor(t/1e3),h=t%1e3,d=c>0?c===1?"mil":`${a(c)} mil`:"",p=h>0?a(h):"";return(d+" "+p).trim()}static imprimirCaja(t){}static async factura(t){return new Promise(async(e,o)=>{var i,l,a,c,h,d,p,s,r,n,v,u,f,T,R,z,w,I,g,N,S;try{const O=C.conversorNumerosALetras,j=new O,$=E().env,b=m=>Number(m||0).toFixed(2),y=m=>(m!=null?m:"").toString(),A=Number((l=(i=t.total)!=null?i:t.montoTotal)!=null?l:0),D=(h=(c=(a=t.numeroFactura)!=null?a:t.numero_factura)!=null?c:t.id)!=null?h:"\u2014",U=(d=t.fechaEmision)!=null?d:t.fecha&&t.hora?`${t.fecha} ${t.hora}`:"\u2014",P=(r=(s=t.nombre)!=null?s:(p=t==null?void 0:t.cliente)==null?void 0:p.nombre)!=null?r:"SN",B=(u=(v=t.complemento)!=null?v:(n=t==null?void 0:t.cliente)==null?void 0:n.complemento)!=null?u:"",k=(R=(T=t.ci)!=null?T:(f=t==null?void 0:t.cliente)==null?void 0:f.ci)!=null?R:"0",V=(I=(w=t.cliente_id)!=null?w:(z=t==null?void 0:t.cliente)==null?void 0:z.id)!=null?I:"\u2014",_=(g=$==null?void 0:$.puntoVenta)!=null?g:0,L=(N=t.cuf)!=null?N:null,M=L?L.match(/.{1,20}/g).join("<br>"):null,ut=L?"FACTURA<br>CON DERECHO A CR\xC9DITO FISCAL":"NOTA DE VENTA",yt=(S=t.leyenda)!=null?S:"Ley N\xB0 453: Puedes acceder a la reclamaci\xF3n cuando tus derechos han sido vulnerados.",ft=Array.isArray(t.venta_detalles)?t.venta_detalles:Array.isArray(t.details)?t.details:[],Z=Math.floor(A),$t=Math.round((A-Z)*100).toString().padStart(2,"0"),bt=`Son ${j.convertToText(Z)} ${$t}/100 Bolivianos`;let H=null;M&&(H=await F.toDataURL(`${$.url2}consulta/QR?nit=${$.nit}&cuf=${M}&numero=${D}&t=2`,{errorCorrectionLevel:"M",type:"png",width:110,margin:0,color:{dark:"#000",light:"#FFF"}}));let q=`${this.head()}
<style>
/* Ticket 80mm ~ 300px */
.ticket { width:300px; margin:0 auto; }
.mono { font-family: "Courier New", Courier, monospace; }
.fs9 { font-size:9px; } .fs10{font-size:10px;} .fs11{font-size:11px;} .fs12{font-size:12px;}
.center{ text-align:center; } .right{ text-align:right; } .left{ text-align:left; }
hr{ border:0; border-top:1px dashed #000; margin:6px 0; }
.title{ font-weight:700; text-transform:uppercase; line-height:1.15; }
.small { font-size:8px; line-height:1.25; }

.tbl{ width:100%; border-collapse:collapse; }
.tbl td{ padding:2px 0; vertical-align:top; }

.lbl{ width:135px; font-weight:700; text-transform:uppercase; }
.val{ width:auto; }

.det-header{ font-weight:700; text-transform:uppercase; margin:4px 0; }
.item-desc{ font-weight:700; }
.item-meta{ color:#111; }

.tot td{ padding:1px 0; }
.tot .l{ width:70%; }
.tot .r{ width:30%; text-align:right; }

.qr{ display:flex; justify-content:center; margin-top:6px; }
@page { margin: 6mm; }
</style>

<div class="ticket mono fs10">
  <div class="title fs12 center">${ut}</div>

  <div class="center small">
    ${y($.razon)}<br>
    Casa Matriz<br>
    No. Punto de Venta ${_}<br>
    ${y($.direccion)}<br>
    Tel. ${y($.telefono)}<br>
    Oruro
  </div>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NIT</td><td class="val">${y($.nit)}</td></tr>
    <tr><td class="lbl">FACTURA N\xB0</td><td class="val">${D}</td></tr>
    <tr><td class="lbl">C\xD3D. AUTORIZACI\xD3N</td><td class="val">${M!=null?M:"\u2014"}</td></tr>
  </table>

  <hr>

  <table class="tbl fs10">
    <tr><td class="lbl">NOMBRE/RAZ\xD3N SOCIAL</td><td class="val">${y(P)}</td></tr>
    <tr><td class="lbl">NIT/CI/CEX</td><td class="val">${y(k)}${y(B?"-"+B:"")}</td></tr>
    <tr><td class="lbl">NRO. CLIENTE</td><td class="val">${y(V)}</td></tr>
    <tr><td class="lbl">FECHA DE EMISI\xD3N</td><td class="val">${y(U)}</td></tr>
  </table>

  <hr>
  <div class="det-header center">DETALLE</div>`;ft.forEach(m=>{var Q,K,W,tt,et,ot,it,st,rt,nt,dt,lt,at,ct,pt,ht,mt,gt;const xt=(tt=(W=(Q=m.producto_id)!=null?Q:m.product_id)!=null?W:(K=m==null?void 0:m.producto)==null?void 0:K.id)!=null?tt:"\u2014",Et=y((st=(it=(et=m.nombre)!=null?et:m.descripcion)!=null?it:(ot=m==null?void 0:m.producto)==null?void 0:ot.nombre)!=null?st:""),Tt=y((dt=(nt=m.unidad)!=null?nt:(rt=m==null?void 0:m.producto)==null?void 0:rt.unidad)!=null?dt:""),Y=Number((at=(lt=m.cantidad)!=null?lt:m.qty)!=null?at:0),J=Number((pt=(ct=m.precio)!=null?ct:m.precioUnitario)!=null?pt:0),X=Number((mt=(ht=m.descuento)!=null?ht:m.montoDescuento)!=null?mt:0),At=(gt=m.subTotal)!=null?gt:Y*J-X;q+=`
      <table class="tbl fs10">
        <tr>
          <td class="left item-desc" colspan="3">${xt} - ${Et}</td>
          <td class="right item-desc">${b(At)}</td>
        </tr>
        <tr><td class="left item-meta" colspan="4">Unidad de Medida: ${Tt||"Unidad (Servicios)"}</td></tr>
        <tr>
          <td class="right" style="width:22%;">${b(Y)}</td>
          <td class="center" style="width:6%;">x</td>
          <td class="right" style="width:32%;">${b(J)} - ${b(X)}</td>
          <td class="right" style="width:40%;"></td>
        </tr>
      </table>`}),q+=`
  <hr>
  <table class="tbl tot fs10">
    <tr><td class="l left strong">TOTAL Bs</td><td class="r strong">${b(A)}</td></tr>
    <tr><td class="l left">(-) DESCUENTO Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">SUBTOTAL A PAGAR Bs</td><td class="r strong">${b(A)}</td></tr>
    <tr><td class="l left">(-) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">MONTO TOTAL A PAGAR Bs</td><td class="r strong">${b(A)}</td></tr>
    <tr><td class="l left">(-) TASAS Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(-) OTROS PAGOS NO SUJETO IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left">(+) AJUSTES NO SUJETOS A IVA Bs</td><td class="r">0.00</td></tr>
    <tr><td class="l left strong">IMPORTE BASE CR\xC9DITO FISCAL</td><td class="r strong">${b(A)}</td></tr>
  </table>

  <div class="fs10" style="margin-top:6px;">${bt}</div>

  <hr>
  <div class="center small">
    ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY
  </div>
  <div class="center small" style="margin-top:4px;">${y(yt)}</div>
  <div class="center small" style="margin-top:4px;">\u201CEste documento es la Representaci\xF3n Gr\xE1fica de un<br>Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n en l\xEDnea\u201D</div>
  ${H?`<div class="qr"><img src="${H}" alt="QR"></div>`:""}
</div>`;const G=document.getElementById("myElement");G&&(G.innerHTML=q),new x().print(G),e(H)}catch(O){o(O)}})}static nota(t,e=!0){return console.log("factura",t),new Promise((o,i)=>{const l=this.numeroALetras(123),a={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}};E().env,F.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,a).then(c=>{let h="",d="";t.producto&&(h="<tr><td class='titder'>PRODUCTO:</td><td class='contenido'>"+t.producto+"</td></tr>"),t.cantidad&&(d="<tr><td class='titder'>CANTIDAD:</td><td class='contenido'>"+t.cantidad+"</td></tr>");let p=`${this.head()}
  <!--div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE VENTA"}</div>
      <div class='titulo2'>${t.tipo_comprobante} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
Calle Beni Nro. 60, entre 6 de Octubre y Potos\xED.<br>
Tel. 25247993 - 76148555<br>
Oruro</div!-->
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
   .mono {
    font-family: Monospace,serif !important;
    font-size: 18px !important;
  }
</style>
<title></title>
</head>
<body>
<div class="mono">
<hr>
<table>
<tr><td class='titder'>ID:</td><td class='titder'>${t.id}</td></tr>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='titder'>${t.nombre}</td></tr>
<tr><!-- td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td --></tr>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
${h}
${d}
</table><hr><div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(s=>{var r;console.log("r",s),p+=`<div style='font-size: 12px'><b> ${(r=s.producto)==null?void 0:r.nombre} </b></div>`,s.visible===1?p+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${s.cantidad}
                    </span>
                    <span>
                    ${parseFloat(s.precio).toFixed(2)}
                    </span>

                    <span style='float:right'>
                        ${parseFloat(s.precio*s.cantidad).toFixed(2)}
                    </span>
                    </div>`:p+=`<div>
                    <span style='font-size: 18px;font-weight: bold'>
                        ${s.cantidad}
                    </span>
                    <span>

                    </span>

                    <span style='float:right'>

                    </span>`}),p+=`<hr>
<div>${t.comentario===""||t.comentario===null||t.comentario===void 0?"":"Comentario: "+t.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='titder'>${parseFloat(t.total).toFixed(2)}</td></tr>
<!--      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='titder'>${parseFloat(t.descuento).toFixed(2)}</td></tr>-->
<!--      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='titder'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>-->
      </table>
      <br>
      <div>Son ${l} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
        <!--div style='display: flex;justify-content: center;'>
          <img  src="${c}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
        </div--!>
      </div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=p,e&&new x().print(document.getElementById("myElement")),o(c)}).catch(c=>{i(c)})})}static cotizacion(t,e,o,i,l=!0){return(i==null||i==="")&&(i=0),new Promise((a,c)=>{const h=C.conversorNumerosALetras,p=new h().convertToText(parseInt(o)),s=Ft().format("YYYY-MM-DD"),r={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},n=E().env;F.toDataURL(`Fecha: ${s} Monto: ${parseFloat(o).toFixed(2)}`,r).then(v=>{let u=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>COTIZACION</div>
      <div class='titulo2'>${n.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${n.direccion}<br>
Tel. ${n.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${e.nombre}</td>
<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${s}</td></tr>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(f=>{u+=`<div style='font-size: 12px'><b> ${f.nombre} </b></div>`,u+=`<div><span style='font-size: 18px;font-weight: bold'>${f.cantidadVenta}</span> ${parseFloat(f.precioVenta).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(f.precioVenta*f.cantidadVenta).toFixed(2)}</span></div>`}),u+=`<hr>
<div>${e.comentario===""||e.comentario===null||e.comentario===void 0?"":"Comentario: "+e.comentario}</div>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(o).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(i).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(o-i).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${p} ${((parseFloat(o)-Math.floor(parseFloat(o)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${v}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=u,l&&new x().print(document.getElementById("myElement")),a(v)}).catch(v=>{c(v)})})}static notaCompra(t){return console.log("factura",t),new Promise((e,o)=>{const i=C.conversorNumerosALetras,a=new i().convertToText(parseInt(t.total)),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=E().env;F.toDataURL(`Fecha: ${t.fecha_emision} Monto: ${parseFloat(t.total).toFixed(2)}`,c).then(async d=>{let p=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 50px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>${t.tipo_venta==="EGRESO"?"NOTA DE EGRESO":"NOTA DE COMPRA"}</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${h.direccion}<br>
Tel. ${h.telefono}<br>
Oruro</div>
<hr>
<table>
<tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.client?t.client.nombre:""}</td>
</tr><tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.client?t.client.nit:""}</td></tr>
<!--<tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha_emision}</td></tr>-->
</table><hr><div class='titulo'>DETALLE</div>`;t.buy_details.forEach(r=>{p+=`<div style='font-size: 12px'><b>${r.nombre} </b></div>`,p+=`<div><span style='font-size: 14px;font-weight: bold'>${r.cantidad}</span> ${parseFloat(r.precio).toFixed(2)} 0.00
                    <span style='float:right'>${parseFloat(r.subtotal).toFixed(2)}</span></div>`}),p+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>Descuento Bs</td><td class='conte2'>${parseFloat(t.descuento).toFixed(2)}</td></tr>
      <tr><td class='titder' style='width: 60%'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total-t.descuento).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${a} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=p,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{o(d)})})}static reportTotal(t,e){const o=t.filter(a=>a.tipoVenta==="Ingreso").reduce((a,c)=>a+c.montoTotal,0),i=t.filter(a=>a.tipoVenta==="Egreso").reduce((a,c)=>a+c.montoTotal,0),l=o-i;return console.log("montoTotal",l),new Promise((a,c)=>{const h=C.conversorNumerosALetras,d=new h,p=Math.abs(l),s=d.convertToText(parseInt(p)),r={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},n=E().env;F.toDataURL(` Monto: ${parseFloat(l).toFixed(2)}`,r).then(v=>{let u=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
  <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>title</div>
      <div class='titulo2'>${n.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
${n.direccion}<br>
Tel. ${n.telefono}<br>
Oruro</div>
<hr>
<table>
</table><hr><div class='titulo'>DETALLE</div>`;t.forEach(T=>{u+=`<div style='font-size: 12px'><b> ${T.user.name} </b></div>`,u+=`<div> ${parseFloat(T.montoTotal).toFixed(2)} ${T.tipoVenta}
          <span style='float:right'> ${T.tipoVenta==="Egreso"?"-":""} ${parseFloat(T.montoTotal).toFixed(2)}</span></div>`}),u+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(l).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${s} ${((parseFloat(l)-Math.floor(parseFloat(l)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${v}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
</body>
</html>`,document.getElementById("myElement").innerHTML=u,new x().print(document.getElementById("myElement")),a(v)}).catch(v=>{c(v)})})}static reciboCompra(t){return new Promise((e,o)=>{const i=C.conversorNumerosALetras,a=new i().convertToText(parseInt(t.total)),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=E().env;console.log("env",h),F.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,c).then(d=>{let p=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE COMPRA</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${h.direccion}<br>
    Tel. ${h.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;t.compra_detalles.forEach(r=>{p+=`<div style='font-size: 12px'><b>${r.nombre} </b></div>`,p+=`<div>${r.cantidad} ${parseFloat(r.precio).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(r.total).toFixed(2)}</span></div>`}),p+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${a} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=p,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{o(d)})})}static reciboPedido(t){return console.log("reciboPedido",t),new Promise((e,o)=>{const i=C.conversorNumerosALetras,a=new i().convertToText(parseInt(t.total)),c={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},h=E().env;F.toDataURL(`Fecha: ${t.date} Monto: ${parseFloat(t.total).toFixed(2)}`,c).then(d=>{let p=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE PEDIDO</div>
      <div class='titulo2'>${h.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${h.direccion}<br>
    Tel. ${h.telefono}<br>
    Oruro</div>
    <hr>
    <div style='display: flex;justify-content: space-between;'>
        <div class='titulo'>FECHA HORA</div>
        <div class='titulo2'>${t.fecha} ${t.hora}</div>
    </div>
    <div style='display: flex;justify-content: space-between;'>
        <div class='titulo'>ID</div>
        <div class='titulo2'>${t.id}</div>
    </div>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.detalles.forEach(r=>{var n;p+=`<div style='font-size: 12px'><b>${(n=r.producto)==null?void 0:n.nombre} </b></div>`,p+=`<div>${r.cantidad} ${parseFloat(r.cantidad).toFixed(2)} 0.00
          <span style='float:right'>${parseFloat(r.cantidad).toFixed(2)}</span></div>`}),p+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      </table>
      <br>
      <div>Son ${a} ${((parseFloat(t.total)-Math.floor(parseFloat(t.total)))*100).toFixed(2)} /100 Bolivianos</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${d}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=p,new x().print(document.getElementById("myElement")),e(d)}).catch(d=>{o(d)})})}static reciboTranferencia(t,e,o,i){return console.log("producto",t,"de",e,"ha",o,"cantidad",i),new Promise((l,a)=>{const c=C.conversorNumerosALetras,d=new c().convertToText(parseInt(i)),p={errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}},s=E().env;F.toDataURL(`de: ${e} A: ${o}`,p).then(r=>{let n=`${this.head()}
    <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">
      <div class='titulo'>RECIBO DE TRANSFERENCIA</div>
      <div class='titulo2'>${s.razon} <br>
      Casa Matriz<br>
      No. Punto de Venta 0<br>
    ${s.direccion}<br>
    Tel. ${s.telefono}<br>
    Oruro</div>
    <hr>
    <table>
    </table><hr><div class='titulo'>DETALLE</div>`;n+=`<div style='font-size: 12px'><b>Producto: ${t} de Sucursal${e} a ${o} </b></div>`,n+=`<hr>
      <table style='font-size: 8px;'>
      <tr><td class='titder' style='width: 60%'>CANTIDAD </td><td class='conte2'>${i+""}</td></tr>
      </table>
      <br>
      <div>Son ${d+""} ${i+""} unidades</div><hr>
      <div style='display: flex;justify-content: center;'>
        <img  src="${r}" style="width: 75px; height: 75px; display: block; margin-left: auto; margin-right: auto;">
      </div></div>
      </div>
    </body>
    </html>`,document.getElementById("myElement").innerHTML=n,new x().print(document.getElementById("myElement")),l(r)}).catch(r=>{a(r)})})}static head(){return`<html>
<style>
      .titulo{
      font-size: 12px;
      text-align: center;
      font-weight: bold;
      }
      .titulo2{
      font-size: 10px;
      text-align: center;
      }
            .titulo3{
      font-size: 10px;
      text-align: center;
      width:70%;
      }
            .contenido{
      font-size: 10px;
      text-align: left;
      }
      .conte2{
      font-size: 10px;
      text-align: right;
      }
      .titder{
      font-size: 12px;
      text-align: right;
      font-weight: bold;
      }
      hr{
  border-top: 1px dashed   ;
}
  table{
    width:100%
  }
  h1 {
    color: black;
    font-family: sans-serif;
  }
  </style>
<body>
<div style="width: 300px;">`}static async printFactura(t){var s,r;const e=C.conversorNumerosALetras,i=new e().convertToText(parseInt(t.total)),l=E().env,a=await F.toDataURL(`${l.url2}consulta/QR?nit=${l.nit}&cuf=${t.cuf}&numero=${t.id}&t=2`,{errorCorrectionLevel:"M",type:"png",quality:.95,width:100,margin:1,color:{dark:"#000000",light:"#FFF"}}),c=t.online?"en":"fuera de";let h=`<style>
    .titulo { font-size: 12px; text-align: center; font-weight: bold; }
    .titulo2 { font-size: 10px; text-align: center; }
    .contenido { font-size: 10px; text-align: left; }
    .conte2 { font-size: 10px; text-align: right; }
    .titder { font-size: 12px; text-align: right; font-weight: bold; }
    hr { border-top: 1px dashed; }
  </style>
  <div style='padding: 0.5cm'>
    <div class='titulo'>FACTURA CON DERECHO A CREDITO FISCAL</div>
    <div class='titulo2'>
      ${l.razon}<br>Casa Matriz<br>No. Punto de Venta 0<br>
      ${l.direccion}<br>Tel. ${l.telefono}<br>Oruro
    </div>
    <hr>
    <div class='titulo'>NIT</div><div class='titulo2'>${l.nit}</div>
    <div class='titulo'>FACTURA N\xB0</div><div class='titulo2'>${t.id}</div>
    <div class='titulo'>C\xD3D. AUTORIZACI\xD3N</div><div class='titulo2'>${t.cuf}</div>
    <hr>
    <table>
      <tr><td class='titder'>NOMBRE/RAZ\xD3N SOCIAL:</td><td class='contenido'>${t.nombre}</td></tr>
      <tr><td class='titder'>NIT/CI/CEX:</td><td class='contenido'>${t.ci}${(s=t.cliente)!=null&&s.complemento?"-"+((r=t.cliente)==null?void 0:r.complemento):""}</td></tr>
      <tr><td class='titder'>COD. CLIENTE:</td><td class='contenido'>${t.cliente.id}</td></tr>
      <tr><td class='titder'>FECHA DE EMISI\xD3N:</td><td class='contenido'>${t.fecha}</td></tr>
    </table>
    <hr>
    <div class='titulo'>DETALLE</div>`;t.venta_detalles.forEach(n=>{h+=`<div style='font-size: 12px'><b>${n.id} - ${n.nombre}</b></div>
             <div>${n.cantidad} ${parseFloat(n.precio).toFixed(2)} 0.00
             <span style='float:right'>${parseFloat(n.cantidad*n.precio).toFixed(2)}</span></div>`}),h+=`<hr>
    <table style='font-size: 8px;'>
      <tr><td class='titder'>SUBTOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>DESCUENTO Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>TOTAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>MONTO GIFT CARD Bs</td><td class='conte2'>0.00</td></tr>
      <tr><td class='titder'>MONTO A PAGAR Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
      <tr><td class='titder'>IMPORTE BASE CR\xC9DITO FISCAL Bs</td><td class='conte2'>${parseFloat(t.total).toFixed(2)}</td></tr>
    </table><br>
    <div>Son ${i} ${((parseFloat(t.total)-Math.floor(t.total))*100).toFixed(0)}/100 Bolivianos</div>
    <hr>
    <div class='titulo2' style='font-size: 9px'>ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA\xCDS,<br>
    EL USO IL\xCDCITO SER\xC1 SANCIONADO PENALMENTE DE ACUERDO A LEY<br><br>
    ${t.leyenda}<br><br>
    \u201CEste documento es la Representaci\xF3n Gr\xE1fica de un Documento Fiscal Digital emitido en una modalidad de facturaci\xF3n ${c} l\xEDnea\u201D</div>
    <div style='display: flex; justify-content: center;'>
      <img src="${a}" />
    </div>
  </div>`;const d=document.getElementById("myElement");d&&(d.innerHTML=h),new x().print(d)}static async reciboVentaSimple(t,e=!0){var o,i,l,a,c,h;try{const d=E().env||{},p=C.conversorNumerosALetras,s=new p,r=g=>Number(g||0).toFixed(2),n=(g,N="")=>(g!=null?g:N).toString(),v=Number((o=t.total)!=null?o:0),u=Math.floor(v),f=Math.round((v-u)*100).toString().padStart(2,"0"),R=`Son ${s.convertToText(u)} ${f}/100 Bolivianos`,z=Array.isArray(t.venta_detalles)?t.venta_detalles:[];let w=`${this.head()}
  <div style='padding-left: 0.5cm;padding-right: 0.5cm'>
    <img src="logo.png" alt="logo" style="width: 100px; height: 100px; display: block; margin-left: auto; margin-right: auto;">

    <div class='titulo'>RECIBO DE VENTA</div>
    <div class='titulo2'>
      ${n(d.razon)} <br>
      Casa Matriz<br>
      No. Punto de Venta ${n((i=d.puntoVenta)!=null?i:0)}<br>
      ${n(d.direccion)}<br>
      Tel. ${n(d.telefono)}<br>
      Oruro
    </div>

    <hr>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">FECHA HORA</div>
      <div class="conte2" style="width:55%;">${n(t.fecha)} ${n(t.hora)}</div>
    </div>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">ID</div>
      <div class="conte2" style="width:55%;">${n(t.id)}</div>
    </div>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">USUARIO</div>
      <div class="conte2" style="width:55%;">${n((l=t.user)==null?void 0:l.name)}</div>
    </div>

    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">PAGO</div>
      <div class="conte2" style="width:55%;">${n((h=(c=(a=t.tipo_pago)!=null?a:t.tipoPago)!=null?c:t.metodo_pago)!=null?h:"")}</div>
    </div>

    ${t.tipo_venta?`
    <div style="display:flex; justify-content: space-between;">
      <div class="titder" style="width:45%;">TIPO</div>
      <div class="conte2" style="width:55%;">${n(t.tipo_venta)}</div>
    </div>`:""}

    <hr>
    <div class='titulo'>DETALLE</div>
`;z.forEach(g=>{var b,y,A,D,U,P,B,k,V,_,L;const N=n((D=(A=(y=(b=g.producto)==null?void 0:b.nombre)!=null?y:g.nombre)!=null?A:g.descripcion)!=null?D:""),S=Number((U=g.cantidad)!=null?U:0),O=Number((P=g.precio)!=null?P:0),j=Number((B=g.subTotal)!=null?B:S*O),$=n((L=(_=(k=g.producto_id)!=null?k:g.product_id)!=null?_:(V=g.producto)==null?void 0:V.id)!=null?L:"");w+=`<div style='font-size: 12px'><b>${$?$+" - ":""}${N}</b></div>`,w+=`
      <div>
        <span style='font-size: 14px;font-weight: bold'>${r(S)}</span>
        <span>${r(O)} 0.00</span>
        <span style='float:right'>${r(j)}</span>
      </div>`}),w+=`
    <hr>
    <table style='font-size: 8px;'>
      <tr>
        <td class='titder' style='width: 60%'>SUBTOTAL Bs</td>
        <td class='conte2'>${r(v)}</td>
      </tr>
    </table>

    <br>
    <div>${R}</div>
    <hr>

    <div class='titulo2' style="font-size: 9px">
      \xA1Gracias por su compra!
    </div>

  </div>
</div>
</body>
</html>`;const I=document.getElementById("myElement");return I&&(I.innerHTML=w),e&&new x().print(document.getElementById("myElement")),!0}catch(d){throw console.error("reciboVentaSimple error:",d),d}}}export{It as I};
