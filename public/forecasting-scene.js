// Adapted from BT4222 report, figures 3–5 (PDF pages 11–12).
// Signals illustrate the computation graph, not trained-model predictions.
const blue = '#245dff';
const muted = '#62718a';

function line(ctx, points, color, width = 1.3) {
  ctx.beginPath();
  points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
}

function connection(ctx, points, time, stage) {
  const phase=(time/1.15)%9;
  const active=Math.floor(phase)===stage;
  line(ctx,points,active?blue:'#b6c6e5',active?1.8:1.2);
  const end=points.at(-1),previous=points.at(-2);
  const angle=Math.atan2(end[1]-previous[1],end[0]-previous[0]);
  line(ctx,[[end[0]-5*Math.cos(angle-.5),end[1]-5*Math.sin(angle-.5)],end,[end[0]-5*Math.cos(angle+.5),end[1]-5*Math.sin(angle+.5)]],active?blue:'#b6c6e5');
  if(!active)return;
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
  let distance=lengths.reduce((a,b)=>a+b,0)*(phase%1);
  for(let i=0;i<lengths.length;i++) {
    if(distance<=lengths[i]) {
      const a=points[i],b=points[i+1],p=distance/lengths[i];
      ctx.beginPath();ctx.arc(a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p,3.2,0,Math.PI*2);ctx.fillStyle=blue;ctx.fill();break;
    }
    distance-=lengths[i];
  }
}

function text(ctx,value,x,y,{size=12,color=muted,bold=false,align='center'}={}) {
  ctx.font=`${bold?'600 ':''}${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);
}

function node(ctx,x,y,w,h,title,subtitle,active=false) {
  ctx.beginPath();ctx.roundRect(x,y,w,h,6);
  ctx.fillStyle=active?'#e3ecff':'#fff';ctx.fill();ctx.strokeStyle=active?blue:'#cbd7eb';ctx.lineWidth=active?1.6:1;ctx.stroke();
  text(ctx,title,x+w/2,y+(subtitle?19:h/2+4),{color:active?blue:'#263955',bold:true});
  if(subtitle)text(ctx,subtitle,x+w/2,y+35,{size:10.5});
}

export function drawForecasting(ctx,time,lang='en') {
  const fr=lang==='fr',stage=Math.floor((time/1.15)%9);
  text(ctx,fr?'01 / ENCODEUR':'01 / ENCODER',12,19,{size:11,color:blue,bold:true,align:'left'});
  text(ctx,'Seq2Seq · LSTM',388,19,{size:10,align:'right'});

  // Historical LSTM states join metadata in the initialization path.
  connection(ctx,[[67,84],[67,150],[130,150],[130,164]],time,2);
  connection(ctx,[[200,84],[200,164]],time,2);
  connection(ctx,[[333,84],[333,105]],time,1);
  connection(ctx,[[333,145],[333,187],[310,187]],time,2);
  connection(ctx,[[200,210],[200,236]],time,3);
  connection(ctx,[[200,276],[200,290],[296,290],[296,328]],time,4);

  // Encoder sequence outputs remain a separate K/V path to cross-attention.
  connection(ctx,[[388,125],[396,125],[396,440],[378,440]],time,5);
  connection(ctx,[[170,353],[214,353]],time,4);
  connection(ctx,[[296,378],[296,414]],time,5);
  connection(ctx,[[296,392],[192,392],[192,509],[214,509]],time,6);
  connection(ctx,[[296,466],[296,491]],time,6);
  connection(ctx,[[214,509],[170,509]],time,7);
  connection(ctx,[[91,527],[91,552]],time,8);

  node(ctx,12,36,110,48,fr?'Numériques':'Numerical',fr?'budget, durée…':'budget, runtime…',stage===0);
  node(ctx,145,36,110,48,fr?'Catégories':'Categories','→ embeddings',stage===0);
  node(ctx,278,36,110,48,fr?'Historique':'History',fr?'revenus connus':'known revenue',stage===0);
  if(stage===0)for(const x of [12,145,278]){ctx.fillStyle=blue;ctx.fillRect(x+10,78,90*((time/1.15)%1),2);}
  node(ctx,278,105,110,40,fr?'LSTM encodeur':'Encoder LSTM',null,stage===1);
  text(ctx,'h, c',346,161,{size:10,align:'left'});
  node(ctx,80,164,230,46,fr?'Fusion des caractéristiques':'Feature fusion','Concat → Dropout',stage===2);
  node(ctx,90,236,220,40,fr?'États initiaux du décodeur':'Initial decoder states','Linear → (h₀, c₀)',stage===3);

  text(ctx,fr?'02 / DÉCODEUR':'02 / DECODER',12,311,{size:11,color:blue,bold:true,align:'left'});
  node(ctx,12,328,158,50,fr?'Entrées futures + position':'Future inputs + position','Concat → Linear → ReLU → Drop',stage===4);
  node(ctx,214,328,164,50,fr?'LSTM décodeur':'Decoder LSTM',fr?'initialisé par (h₀, c₀)':'initialized with (h₀, c₀)',stage===4);
  text(ctx,'Q',308,403,{size:10,color:blue});
  text(ctx,'K, V',373,403,{size:10,color:blue});
  node(ctx,214,414,164,52,'Cross-attention',fr?'multi-têtes':'multi-head',stage===5);
  text(ctx,fr?'Résiduel':'Residual',184,449,{size:10,align:'right'});
  node(ctx,214,491,164,36,'Add + LayerNorm',null,stage===6);
  node(ctx,12,491,158,36,'Feedforward',null,stage===7);
  text(ctx,'Linear → ReLU → Drop → Linear',12,482,{size:9,align:'left'});

  node(ctx,12,552,366,46,fr?'Prévision des revenus quotidiens':'Daily revenue forecast',null,stage===8);
  // A small signal below the output indicates successive forecast time steps.
  const progress=(time/1.15)%1;
  for(let i=0;i<12;i++) {
    ctx.fillStyle=stage===8&&i/12<=progress?blue:'#cbd7eb';
    ctx.fillRect(142+i*10,603,6,3);
  }
  ctx.textAlign='left';
}
