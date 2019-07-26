const ExpressHTTPServer = require('fastboot-app-server/src/express-http-server');
const FastBootAppServer = require('fastboot-app-server');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

const backendUrl = process.env.BACKEND || 'http://backend' ;
const assetsReg =  new RegExp(process.env.STATIC_FOLDERS_REGEX || '^\/(assets|fonts)\/.*');
const distPath = '/app';
const port = 80;
const gzip = process.env.GZIP == 'true';
const chunkedResponse = process.env.CHUNKED == 'true';

console.log(`Running with config`);
console.log(` ${backendUrl}, ${assetsReg}, ${distPath}, ${gzip}, ${chunkedResponse}`);

const httpServer = new ExpressHTTPServer({port});
const app = httpServer.app;
const proxy = httpProxy.createProxyServer({});

const forward = function(req, resp){
  console.log(`proxying through: ${req.url} with ${req.get('accept')}`);
  proxy.web(req, resp, { target: backendUrl });
};

app.use((req, resp, next) => {

  if(assetsReg.test(req.url)){
    fs.access(path.join(distPath, req.url), (err) => {
      err ? forward(req, resp) : next();
    });
    return;
  }

  if(!/html/.test(req.get('accept'))){
    forward(req, resp);
    return;
  }

  console.log(`pre-rendering: ${req.url}`);
  next();
});

let server = new FastBootAppServer({
  distPath,
  httpServer,
  port,
  gzip,
  chunkedResponse
});

server.start();
