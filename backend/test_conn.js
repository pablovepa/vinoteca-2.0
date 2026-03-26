import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/ventas',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer undefined' // trigger 401
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});
req.on('error', console.error);
req.end(JSON.stringify({}));
