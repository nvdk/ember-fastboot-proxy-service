const ExpressHTTPServer = require('fastboot-app-server/src/express-http-server');
const FastBootAppServer = require('fastboot-app-server');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');
const FSNotifier = require('fastboot-fs-notifier');

console.log(`Running with config:`);

const onlyRunFastboot = process.env.ONLY_RUN_FASTBOOT == 'true';
console.log(`ONLY_RUN_FASTBOOT: ${onlyRunFastboot}`);

const backendHost = process.env.BACKEND_HOST || 'backend';
console.log(`BACKEND: ${backendHost}`);

const assetsReg =  new RegExp(process.env.STATIC_FOLDERS_REGEX || '^\/(assets|fonts)\/.*');
console.log(`STATIC_FOLDERS_REGEX: ${assetsReg}`);

const distPath = '/app';
console.log(`distPath: ${distPath}`);

const port = 80;
console.log(`port: ${port}`);

const gzip = process.env.GZIP == 'false' ? false : true;
console.log(`GZIP: ${gzip}`);

const chunkedResponse = process.env.CHUNKED == 'true';
console.log(`CHUNKED: ${chunkedResponse}`);

const liveReload = process.env.LIVE_RELOAD == 'true';
console.log(`LIVE_RELOAD: ${liveReload}`);


let config = {
  distPath,
  port,
  gzip,
  chunkedResponse
};

//Notifier: manages live reload.
const notifier = new FSNotifier({
  targetDir: distPath
});

if(liveReload){
  console.log('Live reload enabled');
  config["notifier"] = notifier;
}

const httpServer = new ExpressHTTPServer({port});
config["httpServer"] =  httpServer;

const proxy = httpProxy.createProxyServer({});
const forward = function(req, resp){
  console.log(`proxying through: ${req.url} with ${req.get('accept')}`);
  proxy.web(req, resp, { target: `http://${backendHost}` });
};

const app = httpServer.app;
app.use((req, resp, next) => {

  if(!onlyRunFastboot){

    if(assetsReg.test(req.url)){
      fs.access(path.join(distPath, req.url), (err) => {
        if(err) forward(req, resp);
        else {
          console.log(`fetching from assets folder: ${req.url}`);
          next();
        }
      });
      return;
    }

    if(!/html/.test(req.get('accept'))){
      forward(req, resp);
      return;
    }

  }

  req.headers.host = backendHost;

  console.log(`pre-rendering: ${req.url} with headers: ${JSON.stringify(req.headers, null, 4)}`);
  next();

});

let server = new FastBootAppServer(config);

server.start();
