const ExpressHTTPServer = require('fastboot-app-server/src/express-http-server');
const FastBootAppServer = require('fastboot-app-server');
const httpProxy = require('http-proxy');

const backendUrl = 'http://' + process.env.BACKEND;
const assetsReg =  /^\/(assets|fonts)\/.*/;

const httpServer = new ExpressHTTPServer({});
const app = httpServer.app;
const proxy = httpProxy.createProxyServer({});

app.use((req, resp, next) => {
    if(!/html/.test(req.get('accept')) && !assetsReg.test(req.url)){
        proxy.web(req, resp, {
            target: backendUrl
        });
        return;
    }
    next();
});

let server = new FastBootAppServer({
    distPath: '/dist',
    httpServer: httpServer,
});

server.start();
