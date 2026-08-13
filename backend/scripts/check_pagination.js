const http = require('http');
const base = 'http://127.0.0.1:3120';
function request(path, method='GET', body=null, token=null){
  const url = new URL(path, base);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return new Promise((resolve,reject)=>{
    const req = http.request(url, { method, headers }, (res)=>{
      const chunks=[]; res.on('data',c=>chunks.push(c)); res.on('end', ()=>{
        const raw = Buffer.concat(chunks).toString('utf8'); let body = raw; try{ body=JSON.parse(raw);}catch(e){}
        resolve({status: res.statusCode, body});
      });
    }); req.on('error', reject); if (body) req.write(JSON.stringify(body)); req.end();
  });
}
(async ()=>{
  try{
    const sign = await request('/auth/sign-in','POST',{identifier:'samsd.sdf@gmail.com',password:'Ammar@123'});
    console.log('signin', JSON.stringify(sign));
    const token = sign.body?.data?.accessToken;
    const paged = await request('/products?page=1&limit=1','GET',null,token);
    console.log('paged', JSON.stringify(paged));
  }catch(e){ console.error('ERROR', e && e.stack ? e.stack : e); process.exit(1);} 
})();
