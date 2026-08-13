const http = require('http');
const base = 'http://127.0.0.1:3120';
async function request(path, method='GET', body=null) {
  const url = new URL(path, base);
  const headers = { 'Content-Type': 'application/json' };
  const opts = { method, headers };
  return new Promise((resolve, reject) => {
    const req = http.request(url, opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let parsed = raw;
        try { parsed = JSON.parse(raw); } catch(e){}
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}
(async()=>{
  try {
    const res = await request('/auth/sign-in', 'POST', { identifier: 'samsd.sdf@gmail.com', password: 'Ammar@123' });
    console.log(JSON.stringify(res));
  } catch (e) { console.error(e); process.exit(1);} 
})();
