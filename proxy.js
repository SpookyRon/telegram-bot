const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const options = {
  target: 'http://127.0.0.1:8080', 
  cookieDomainRewrite: 'dev-youthing.com', 
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: function(proxyReq, req, res) {
    if (!req.headers['accept-language']) {
      proxyReq.setHeader('Accept-Language', 'es-ES,es;q=0.9,en;q=0.8');
    } else {
      proxyReq.setHeader('Accept-Language', req.headers['accept-language']);
    }
  }
};


app.use('/api', createProxyMiddleware(options));

options.target = 'http://localhost:5170';
app.use('/admin/login', createProxyMiddleware(options));

options.target = 'http://localhost:5173';
app.use('/login', createProxyMiddleware(options));

options.target = 'http://localhost:5171';
app.use('/admin', createProxyMiddleware(options));

options.target = 'http://localhost:5178';
app.use('/cuenta', createProxyMiddleware(options));

options.target = 'http://localhost:5177';
app.use('/', createProxyMiddleware(options));

const server = app.listen(80, '127.0.0.1', () => {
  console.log('Proxy OK en http://dev-youthing.com (80)')
})

server.on('error', (err) => {
  console.error('Proxy NO pudo levantar el puerto 80:', err.code, err.message)
})