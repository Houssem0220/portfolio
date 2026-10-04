import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../public/',import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8','.json':'application/json'};
createServer(async(req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let path = resolve(root, '.' + pathname);
    if (path !== root && !path.startsWith(root + sep)) {res.writeHead(403);res.end('Forbidden');return;}
    if (pathname.endsWith('/')) path = resolve(path,'index.html');
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    const body = await readFile(path);
    res.writeHead(200,{'Content-Type':types[extname(path)] || 'application/octet-stream','Cache-Control':'no-cache'});
    res.end(body);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(resolve(root,'404.html')));
  }
}).listen(port,'0.0.0.0',()=>console.log(`Portfolio : http://localhost:${port}`));
