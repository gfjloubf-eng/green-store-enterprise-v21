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
  const sign = await request('/auth/sign-in','POST',{identifier:'samsd.sdf@gmail.com',password:'Ammar@123'});
  const token = sign.body?.data?.accessToken;
  console.log('token?', !!token);
  const res1 = await request('/products','POST',{},token);
  console.log('empty body', res1);
  const res2 = await request('/products','POST',{name:''},token);
  console.log('name empty', res2);
  const res3 = await request('/products','POST',{name:'x'},token);
  console.log('name only', res3);
})();
