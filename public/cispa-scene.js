// Illustrations of the documented CISPA methods, not experimental outputs.
const blue='#245dff',pale='#b7c9eb',ink='#263955',muted='#62718a';
function text(ctx,value,x,y,size=12,color=muted,align='left') {
  ctx.font=`${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);
}
function line(ctx,points,color=pale) {
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle=color;ctx.lineWidth=1.3;ctx.stroke();
}
function dot(ctx,x,y,r=3,color=blue) {
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
}
function wire(ctx,points,t,offset=0) {
  line(ctx,points);
  const end=points.at(-1),prev=points.at(-2),angle=Math.atan2(end[1]-prev[1],end[0]-prev[0]);
  line(ctx,[[end[0]-5*Math.cos(angle-.5),end[1]-5*Math.sin(angle-.5)],end,[end[0]-5*Math.cos(angle+.5),end[1]-5*Math.sin(angle+.5)]]);
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
  let distance=((t*.45+offset)%1)*lengths.reduce((a,b)=>a+b,0);
  for(let i=0;i<lengths.length;i++) {
    if(distance<=lengths[i]){const a=points[i],b=points[i+1],u=distance/lengths[i];dot(ctx,a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u);break;}
    distance-=lengths[i];
  }
}
function panel(ctx,x,y,w,h,title,subtitle,selected=false) {
  ctx.beginPath();ctx.roundRect(x,y,w,h,5);ctx.fillStyle=selected?'#e5edff':'white';ctx.fill();ctx.strokeStyle=selected?blue:pale;ctx.lineWidth=1.2;ctx.stroke();
  text(ctx,title,x+w/2,y+h/2+(subtitle?-2:4),12,ink,'center');
  if(subtitle)text(ctx,subtitle,x+w/2,y+h/2+14,10,muted,'center');
}
function image(ctx,x,y,size,t,noise=0) {
  ctx.fillStyle='white';ctx.fillRect(x-3,y-3,size+6,size+6);
  const cell=size/10;
  for(let row=0;row<10;row++)for(let col=0;col<10;col++) {
    const silhouette=Math.exp(-((col-4.5)**2+(row-4.2)**2)/12);
    const detail=.1*Math.sin(col*1.6+row*.9);
    const perturbation=noise*Math.sin(row*17+col*13+t*3);
    ctx.fillStyle=`rgba(36,93,255,${Math.max(.04,Math.min(.85,.12+silhouette*.63+detail+perturbation))})`;
    ctx.fillRect(x+col*cell,y+row*cell,cell-1,cell-1);
  }
}
function heading(ctx,title,subtitle) {
  text(ctx,title,20,26,12,blue);text(ctx,subtitle,20,45,11);
}

function attack(ctx,t,fr) {
  heading(ctx,fr?'01 / TRANSFERT ADVERSARIAL':'01 / ADVERSARIAL TRANSFER','PGD · CNN / ViT · ‖δ‖₂ ≤ ε');
  image(ctx,20,89,64,t);text(ctx,'x',52,173,12,ink,'center');
  wire(ctx,[[84,120],[103,120],[103,96],[120,96]],t);
  wire(ctx,[[103,120],[103,145],[120,145]],t,.25);
  panel(ctx,120,78,88,36,'CNN',null,true);panel(ctx,120,127,88,36,'ViT',null,true);
  wire(ctx,[[208,96],[225,96],[225,120],[232,120]],t,.35);
  wire(ctx,[[208,145],[225,145],[225,120]],t,.65);
  dot(ctx,250,120,18,'#e5edff');text(ctx,'δ',250,125,17,blue,'center');
  wire(ctx,[[268,120],[286,120]],t,.55);
  const strength=.025+.055*(.5+.5*Math.sin(t));
  image(ctx,286,89,64,t,strength);text(ctx,'x + δ',318,173,12,ink,'center');
  wire(ctx,[[350,120],[370,120]],t,.7);
  panel(ctx,370,88,54,64,fr?'Cible':'Target','black-box');
  text(ctx,fr?'Optimisation puis transfert':'Optimize, then transfer',20,214,12,ink);
  for(let i=0;i<12;i++){ctx.fillStyle=i<((t*.8)%12)?blue:'#d7e2f6';ctx.fillRect(20+i*10,226,6,3);}
  text(ctx,fr?'Perturbation L₂ bornée':'Bounded L₂ perturbation',424,231,11,muted,'right');
}

function attribution(ctx,t,fr) {
  heading(ctx,fr?'02 / ATTRIBUTION PAR RECONSTRUCTION':'02 / RECONSTRUCTION-BASED ATTRIBUTION',fr?'Un contenu, plusieurs autoencodeurs':'One input, multiple autoencoders');
  image(ctx,20,98,64,t);text(ctx,fr?'Contenu généré':'Generated input',20,182,11);
  const candidate=Math.floor(t/4)%3;
  for(let i=0;i<3;i++) {
    const y=65+i*48;
    wire(ctx,[[84,130],[106,130],[106,y+17],[132,y+17]],t,i*.25);
    panel(ctx,132,y,110,34,`AE${['₁','₂','₃'][i]}`,null,i===candidate);
    wire(ctx,[[242,y+17],[276,y+17]],t,.25+i*.25);
    image(ctx,276,y+4,26,t,i===candidate?.025:.11);
    text(ctx,`e${['₁','₂','₃'][i]}`,316,y+22,11);
    ctx.fillStyle='#e2eafa';ctx.fillRect(336,y+12,82,10);
    const error=(i===candidate?.22:.6)+.04*Math.sin(t*1.5+i);
    ctx.fillStyle=i===candidate?blue:'#9fb5dc';ctx.fillRect(336,y+12,82*error,10);
  }
  text(ctx,fr?'Reconstructions':'Reconstructions',259,220,11);
  text(ctx,fr?'Comparer les erreurs':'Compare errors',424,239,12,ink,'right');
}

function watermark(ctx,t,fr) {
  heading(ctx,fr?'03 / DÉTECTION DE FILIGRANES':'03 / WATERMARK DETECTION','ResNet-50 · fine-tuning · calibration ROC');
  image(ctx,20,82,64,t,.025);
  for(let i=0;i<8;i++)dot(ctx,24+i*8,143,1.2,blue);
  wire(ctx,[[84,114],[132,114]],t);
  panel(ctx,132,80,126,68,'ResNet-50',fr?'détecteur de filigranes':'watermark detector',true);
  wire(ctx,[[258,114],[294,114]],t,.35);
  text(ctx,fr?'Score de détection':'Detection score',294,76,11);
  ctx.fillStyle='#e2eafa';ctx.fillRect(294,99,126,26);
  const score=.5+.28*Math.sin(t*.8),threshold=.65;
  ctx.fillStyle='#a9bfff';ctx.fillRect(294,99,126*score,26);
  line(ctx,[[294+126*threshold,91],[294+126*threshold,133]],blue);
  dot(ctx,294+126*score,112,4);
  text(ctx,'τ',294+126*threshold,146,12,blue,'center');
  text(ctx,score>threshold?(fr?'Filigrane détecté':'Watermark detected'):(fr?'Sous le seuil':'Below threshold'),357,174,11,ink,'center');
  text(ctx,fr?'Seuil calibré par courbe ROC':'ROC-calibrated threshold',20,213,12,ink);
  text(ctx,fr?'Faux positifs cibles : 1 %':'Target false-positive rate: 1%',20,233,11);
}

export function drawCispa(ctx,t,lang='en',mode='attack') {
  ({attack,attribution,watermark}[mode]||attack)(ctx,t,lang==='fr');
  ctx.textAlign='left';
}
