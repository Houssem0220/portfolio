// Concept illustrations only: these animations do not display project results.
export const visualLabels = {
  'trustworthy-ai': {fr: 'Perturbations autour d’une frontière de classification', en: 'Perturbations around a classification boundary'},
  forecasting: {fr: 'Série temporelle et horizons de prévision', en: 'Time series and forecast horizons'},
  'fashion-retrieval': {fr: 'Recherche de vêtements proches dans un espace de représentation', en: 'Finding similar clothing in an embedding space'},
  'reinforcement-learning': {fr: 'Équilibrage d’un pendule inversé sur un chariot', en: 'Balancing an inverted pendulum on a cart'},
  segmentation: {fr: 'Masques et identifiants suivant des objets en mouvement', en: 'Masks and identifiers following moving objects'},
  recommendation: {fr: 'Connexions entre un profil et des films similaires', en: 'Connections between a profile and similar films'},
  'tweet-classification': {fr: 'Du texte aux représentations puis à la classification', en: 'From text to embeddings to classification'},
};

const blue = '#245dff';
const pale = '#a9bfff';
function path(ctx, points, color = blue, width = 1.4) {
  ctx.beginPath();
  points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function dot(ctx, x, y, radius = 3, color = blue) {
  ctx.beginPath(); ctx.arc(x,y,radius,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
}
function box(ctx, x,y,w,h, fill = '#e5edff', stroke = pale) {
  ctx.fillStyle=fill; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=stroke; ctx.lineWidth=1; ctx.strokeRect(x,y,w,h);
}
function label(ctx, text, x,y, color = '#626a78') {
  ctx.font='11px ui-monospace, monospace'; ctx.fillStyle=color; ctx.fillText(text,x,y);
}
function pulse(ctx, a,b, progress) {
  dot(ctx,a[0]+(b[0]-a[0])*progress,a[1]+(b[1]-a[1])*progress,3.5);
}
function grid(ctx) {
  for(let x=40;x<=400;x+=40) path(ctx,[[x,20],[x,164]],'#e5eaf3',.6);
  for(let y=24;y<=164;y+=35) path(ctx,[[40,y],[400,y]],'#e5eaf3',.6);
}
function shirt(ctx,x,y,scale=1,selected=false) {
  ctx.save(); ctx.translate(x,y); ctx.scale(scale,scale);
  const outline=[[-12,-18],[-25,-8],[-17,3],[-11,-1],[-11,23],[11,23],[11,-1],[17,3],[25,-8],[12,-18],[6,-13],[-6,-13],[-12,-18]];
  path(ctx,outline,selected?blue:pale,1.5);
  ctx.fillStyle=selected?'#dce6ff':'#f5f7fb'; ctx.fill(); ctx.restore();
}

const drawings = {
  'trustworthy-ai'(ctx,t) {
    grid(ctx);
    path(ctx,[[190,18],[206,52],[224,78],[215,111],[238,166]],pale,1.6);
    for(let i=0;i<36;i++) {
      const side=i%2, x=(side?262:72)+(i*37%98), y=36+(i*29%113);
      const dx=Math.sin(t*1.2+i)*7, dy=Math.cos(t+i)*5;
      path(ctx,[[x,y],[x+dx,y+dy]],pale);
      dot(ctx,x+dx,y+dy,side?3:2.5,side?blue:'#839bc8');
    }
    const x=202+Math.sin(t)*13,y=91+Math.cos(t*.8)*15;
    ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.strokeStyle=blue;ctx.lineWidth=1;ctx.stroke();
    dot(ctx,x,y,4);
  },
  forecasting(ctx,t) {
    grid(ctx);
    const wave=x=>104-24*Math.sin(x*.034)-12*Math.cos(x*.081)-x*.045;
    const points=Array.from({length:91},(_,i)=>{const x=40+i*4;return [x,wave(x)];});
    const horizon=250+Math.sin(t*.55)*25;
    path(ctx,points.filter(([x])=>x<=horizon),blue,2);
    const forecast=points.filter(([x])=>x>=horizon);
    ctx.beginPath();
    forecast.forEach(([x,y],i)=>{const spread=(x-horizon)*.18+3;i?ctx.lineTo(x,y-spread):ctx.moveTo(x,y-spread);});
    [...forecast].reverse().forEach(([x,y])=>ctx.lineTo(x,y+(x-horizon)*.18+3));
    ctx.closePath();ctx.fillStyle='#245dff12';ctx.fill();
    ctx.setLineDash([4,4]);path(ctx,forecast,blue,1.6);path(ctx,[[horizon,24],[horizon,164]],pale);ctx.setLineDash([]);
    dot(ctx,horizon,wave(horizon),4);
  },
  'fashion-retrieval'(ctx,t) {
    shirt(ctx,77,88,1.3,true);
    path(ctx,[[124,90],[166,90]],pale); pulse(ctx,[124,90],[166,90],(t*.3)%1);
    const centers=[[227,66],[339,111],[248,133]];
    centers.forEach(([x,y],c)=>{
      for(let i=0;i<12;i++){const a=i*2.4, r=12+(i%4)*7;dot(ctx,x+Math.cos(a)*r,y+Math.sin(a)*r*.65,2,c===0?blue:pale);}
    });
    const radius=35+Math.sin(t)*4;
    ctx.beginPath();ctx.ellipse(227,66,radius,radius*.78,0,0,Math.PI*2);ctx.strokeStyle=blue;ctx.stroke();
    shirt(ctx,365,44,.55,true);path(ctx,[[262,58],[344,44]],pale);
  },
  'reinforcement-learning'(ctx,t) {
    const x=220+Math.sin(t*.9)*58, angle=Math.sin(t*1.8)*.16;
    path(ctx,[[48,143],[392,143]],pale);
    ctx.setLineDash([3,5]);path(ctx,[[220,24],[220,143]],'#d4dae4');ctx.setLineDash([]);
    box(ctx,x-27,117,54,19,'#dce6ff',blue);
    dot(ctx,x-17,139,4);dot(ctx,x+17,139,4);
    const tip=[x+Math.sin(angle)*79,117-Math.cos(angle)*79];
    path(ctx,[[x,117],tip],blue,3);dot(ctx,...tip,6);dot(ctx,x,117,4);
    const direction=Math.cos(t*.9)>0?1:-1;
    path(ctx,[[x+direction*40,125],[x+direction*69,125],[x+direction*61,120]],blue);
  },
  segmentation(ctx,t) {
    path(ctx,[[40,145],[400,145]],pale);
    for(let i=0;i<3;i++) {
      const x=70+i*116+Math.sin(t*.6+i)*22,y=67+Math.cos(t*.7+i)*13,w=52+i*7;
      box(ctx,x,y,w,49,'#245dff0c',blue);
      ctx.beginPath();ctx.moveTo(x+6,y+39);ctx.lineTo(x+12,y+18);ctx.lineTo(x+31,y+9);ctx.lineTo(x+w-7,y+21);ctx.lineTo(x+w-4,y+40);ctx.closePath();ctx.fillStyle='#245dff25';ctx.fill();
      dot(ctx,x+w/2,y+27,2.5);label(ctx,`ID 0${i+1}`,x,y-9,blue);
      path(ctx,Array.from({length:16},(_,j)=>[x+w/2-j*3,133+Math.sin(t+j*.18+i)*4]),pale);
    }
  },
  recommendation(ctx,t) {
    const center=[95,92];
    const films=[[228,42],[338,52],[249,135],[365,133]];
    films.forEach(([x,y],i)=>{path(ctx,[center,[x,y]],pale);pulse(ctx,center,[x,y],(t*.25+i*.23)%1);box(ctx,x-17,y-22,34,44,i===Math.floor(t*.65)%4?'#dce6ff':'#f5f7fb',blue);for(let j=0;j<4;j++){dot(ctx,x-12,y-15+j*10,1.2);dot(ctx,x+12,y-15+j*10,1.2);}path(ctx,[[x-4,y-6],[x+6,y],[x-4,y+6],[x-4,y-6]],blue);});
    dot(ctx,...center,24,'#dce6ff');dot(ctx,95,86,6);path(ctx,[[83,103],[86,97],[104,97],[107,103]],blue,2);
  },
  'tweet-classification'(ctx,t) {
    box(ctx,44,55,87,76,'#f5f7fb',pale);
    for(let i=0;i<4;i++)path(ctx,[[56,72+i*13],[117-(i%2)*17,72+i*13]],i===Math.floor(t)%4?blue:pale,2);
    path(ctx,[[140,93],[181,93]],pale);pulse(ctx,[140,93],[181,93],(t*.35)%1);
    for(let i=0;i<5;i++)for(let j=0;j<4;j++){const alpha=.15+.5*(.5+.5*Math.sin(i*2+j+t));box(ctx,194+i*12,65+j*15,8,10,`rgba(36,93,255,${alpha})`,'transparent');}
    [[344,59],[344,125]].forEach((end,i)=>{path(ctx,[[264,93],[289,93],end],pale);pulse(ctx,[289,93],end,(t*.3+i*.5)%1);dot(ctx,...end,14,'#dce6ff');dot(ctx,...end,4);});
  },
};

export class ProjectScene {
  constructor(canvas,button) {
    this.canvas=canvas;this.button=button;this.ctx=canvas.getContext('2d');
    this.drawScene=drawings[canvas.dataset.projectScene];this.time=0;this.visible=false;this.frame=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.playing=!this.reduced.matches;
    this.events=new AbortController();const options={signal:this.events.signal};
    button.addEventListener('click',()=>this.setPlaying(!this.playing),options);
    this.reduced.addEventListener('change',()=>this.setPlaying(!this.reduced.matches),options);
    document.addEventListener('visibilitychange',()=>this.schedule(),options);
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.schedule();});this.observer.observe(canvas);
    this.resize();this.setPlaying(this.playing);
  }
  setPlaying(value) {
    this.playing=value;this.button.setAttribute('aria-pressed',String(value));this.schedule();
  }
  resize() {
    const {width,height}=this.canvas.getBoundingClientRect();
    this.width=width;this.height=height;this.ratio=Math.min(devicePixelRatio||1,2);
    this.canvas.width=Math.round(width*this.ratio);this.canvas.height=Math.round(height*this.ratio);this.draw();
  }
  draw() {
    if(!this.ctx||!this.width||!this.height)return;
    const ctx=this.ctx,scale=Math.min(this.width/440,this.height/184);
    ctx.setTransform(this.ratio,0,0,this.ratio,0,0);ctx.clearRect(0,0,this.width,this.height);
    ctx.translate((this.width-440*scale)/2,(this.height-184*scale)/2);ctx.scale(scale,scale);
    this.drawScene(ctx,this.time);
  }
  schedule() {
    cancelAnimationFrame(this.frame);
    if(!this.playing||!this.visible||document.hidden||!this.ctx)return;
    this.last=performance.now();
    const tick=now=>{
      const elapsed=now-this.last;
      if(elapsed>=33){this.time+=Math.min(elapsed,100)/1000;this.last=now;this.draw();}
      this.frame=requestAnimationFrame(tick);
    };
    this.frame=requestAnimationFrame(tick);
  }
  destroy() {
    cancelAnimationFrame(this.frame);this.events.abort();this.resizeObserver.disconnect();this.observer.disconnect();
  }
}
