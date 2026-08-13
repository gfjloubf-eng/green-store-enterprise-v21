const http = require('http');

const base = 'http://127.0.0.1:3120';

async function request(path, method='GET', body=null, auth=null) {
  const url = new URL(path, base);
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${auth}`;
  const opts = { method, headers };
  return new Promise((resolve, reject) => {
    const req = http.request(url, opts, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let body = raw;
        try { body = JSON.parse(raw); } catch (e) {}
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

(async () => {
  try {
    const signIn = await request('/auth/sign-in', 'POST', { identifier: 'samsd.sdf@gmail.com', password: 'Ammar@123' });
    const authOk = signIn.status === 200 && typeof signIn.body?.data?.accessToken === 'string' && signIn.body.data.accessToken.length > 0;
    const accessToken = authOk ? signIn.body.data.accessToken : null;

    const without = await request('/products', 'GET', null, null);
    const withoutOk = without.status === 401;

    const withAuth = await request('/products', 'GET', null, accessToken);
    const withAuthOk = withAuth.status === 200;

    // Do not print tokens or sensitive data
    console.log(JSON.stringify({ authOk, withoutOk, withAuthOk }));
    process.exit(0);
  } catch (err) {
    console.error(JSON.stringify({ error: String(err) }));
    process.exit(1);
  }
})();
