// Dependency-free 3D renderer. Geometry is illustrative, not benchmark output.
const normalize=p=>{const l=Math.hypot(...p);return p.map(v=>v/l);};
function sphereGeometry(){
  const t=(1+Math.sqrt(5))/2;
  let points=[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(normalize);
  let faces=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  for(let s=0;s<2;s++){
    const cache=new Map();
    const mid=(a,b)=>{const k=[a,b].sort((x,y)=>x-y).join('-');if(cache.has(k))return cache.get(k);const i=points.length;points.push(normalize(points[a].map((v,j)=>(v+points[b][j])/2)));cache.set(k,i);return i;};
    faces=faces.flatMap(([a,b,c])=>{const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);return [[a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]];});
  }
  return {points,faces};
}
function tetraGeometry(){
  const points=[[-.78,-.78,-.78],[.78,-.78,-.78],[.78,.78,-.78],[-.78,.78,-.78],[-.78,-.78,.78],[.78,-.78,.78],[.78,.78,.78],[-.78,.78,.78],[.12,-.1,.02]];
  const shell=[[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],[3,2,6],[3,6,7],[0,3,7],[0,7,4],[1,5,6],[1,6,2]];
  const faces=[...shell];for(const [a,b,c] of shell)faces.push([8,a,b],[8,b,c],[8,c,a]);
  return {points,faces};
}
export class MeshScene{
  constructor(canvas,kind='sphere'){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.kind=kind;this.geometry=kind==='sphere'?sphereGeometry():tetraGeometry();
    this.mode=kind==='sphere'?'edges':'faces';this.angleX=-.17;this.angleY=.5;this.visible=true;this.frame=0;this.last=0;this.dragging=false;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.playing=!this.reduced.matches;
    this.events=new AbortController();const opts={signal:this.events.signal};
    const keys=new Set();this.edges=[];
    for(const [a,b,c] of this.geometry.faces)for(const [x,y] of [[a,b],[b,c],[c,a]]){const key=[x,y].sort((i,j)=>i-j).join('-');if(!keys.has(key)){keys.add(key);this.edges.push([x,y]);}}
    this.resizeObserver=new ResizeObserver(()=>{this.resize();this.draw();});this.resizeObserver.observe(canvas);
    this.intersectionObserver=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.schedule();},{rootMargin:'50px'});this.intersectionObserver.observe(canvas);
    document.addEventListener('visibilitychange',()=>this.schedule(),opts);
    this.reduced.addEventListener('change',()=>{this.setPlaying(!this.reduced.matches);canvas.dispatchEvent(new CustomEvent('motionpreference',{detail:this.playing}));},opts);
    canvas.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')return;this.dragging=true;this.pointer=[event.clientX,event.clientY];canvas.setPointerCapture(event.pointerId);},opts);
    canvas.addEventListener('pointermove',event=>{if(!this.dragging)return;this.angleY+=(event.clientX-this.pointer[0])*.008;this.angleX+=(event.clientY-this.pointer[1])*.008;this.pointer=[event.clientX,event.clientY];this.draw();},opts);
    canvas.addEventListener('pointerup',()=>{this.dragging=false;},opts);canvas.addEventListener('pointercancel',()=>{this.dragging=false;},opts);
    canvas.addEventListener('keydown',event=>{const a={ArrowLeft:[0,-.12],ArrowRight:[0,.12],ArrowUp:[-.12,0],ArrowDown:[.12,0]}[event.key];if(a){event.preventDefault();this.angleX+=a[0];this.angleY+=a[1];this.draw();}},opts);
    this.resize();this.draw();this.schedule();
  }
  resize(){const r=this.canvas.getBoundingClientRect();this.width=r.width;this.height=r.height;this.ratio=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(this.width*this.ratio);this.canvas.height=Math.round(this.height*this.ratio);this.ctx?.setTransform(this.ratio,0,0,this.ratio,0,0);}
  setPlaying(v){this.playing=v;this.schedule();}
  setMode(v){this.mode=v;this.draw();}
  schedule(){cancelAnimationFrame(this.frame);if(this.playing&&this.visible&&!document.hidden){this.last=performance.now();this.frame=requestAnimationFrame(t=>this.tick(t));}}
  tick(time){if(!this.playing||!this.visible||document.hidden)return;const dt=Math.min(time-this.last,60);if(dt>=25){this.angleY+=dt*.00012;this.last=time;if(!this.dragging)this.draw();}this.frame=requestAnimationFrame(t=>this.tick(t));}
  draw(){
    const ctx=this.ctx;if(!ctx||!this.width||!this.height)return;ctx.clearRect(0,0,this.width,this.height);
    const cx=Math.cos(this.angleX),sx=Math.sin(this.angleX),cy=Math.cos(this.angleY),sy=Math.sin(this.angleY),size=Math.min(this.width,this.height)*(this.kind==='sphere'?.44:.38);
    const pts=this.geometry.points.map(([x,y,z])=>{const rx=x*cy+z*sy,rz=-x*sy+z*cy,ry=y*cx-rz*sx,depth=y*sx+rz*cx,p=3.8/(3.8-depth*.25);return [this.width/2+rx*size*p,this.height/2+ry*size*p,depth];});
    if(this.mode==='faces')for(const {face,z} of this.geometry.faces.map(face=>({face,z:face.reduce((a,i)=>a+pts[i][2],0)/3})).sort((a,b)=>a.z-b.z)){ctx.beginPath();face.forEach((i,n)=>n?ctx.lineTo(pts[i][0],pts[i][1]):ctx.moveTo(pts[i][0],pts[i][1]));ctx.closePath();ctx.fillStyle=`rgba(36,93,255,${.018+(z+1)*.025})`;ctx.fill();}
    if(this.mode!=='points')for(const [a,b] of this.edges){const z=(pts[a][2]+pts[b][2])/2;ctx.strokeStyle=`rgba(36,93,255,${this.kind==='sphere'?.12+(z+1)*.24:.22+(z+1)*.18})`;ctx.lineWidth=this.kind==='sphere'?.7:.85;ctx.beginPath();ctx.moveTo(pts[a][0],pts[a][1]);ctx.lineTo(pts[b][0],pts[b][1]);ctx.stroke();}
    for(const [x,y,z] of [...pts].sort((a,b)=>a[2]-b[2])){ctx.beginPath();ctx.arc(x,y,this.kind==='sphere'?1.25+(z+1)*.7:2.6,0,Math.PI*2);ctx.fillStyle=`rgba(36,93,255,${.3+(z+1)*.35})`;ctx.fill();}
  }
  destroy(){cancelAnimationFrame(this.frame);this.events.abort();this.resizeObserver.disconnect();this.intersectionObserver.disconnect();}
}
