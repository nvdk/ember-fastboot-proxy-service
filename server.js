const ExpressHTTPServer = require('fastboot-app-server/src/express-http-server');
const FastBootAppServer = require('fastboot-app-server');
const httpProxy = require('http-proxy');

const backendUrl = process.env.BACKEND || 'http://backend' ;
const assetsReg =  new RegExp(process.env.ASSETS || '^\/(assets|fonts)\/.*');
const distPath = process.env.DISTPATH || '/app';
const port = 80;
const gzip = process.env.GZIP == 'true';
const chunked = process.env.CHUNKED == 'true';


console.log(`Running with config`);
console.log(` ${backendUrl},  ${assetsReg},  ${distPath}, ${gzip}, ${chunked}`);

const httpServer = new ExpressHTTPServer({port});
const app = httpServer.app;
const proxy = httpProxy.createProxyServer({});

app.use((req, resp, next) => {
  if(!/html/.test(req.get('accept')) && !assetsReg.test(req.url)){

    console.log(`proxying through: ${req.url} with ${req.get('accept')}`);
    proxy.web(req, resp, {
            target: backendUrl
    });

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
  chunked
});

server.start();
