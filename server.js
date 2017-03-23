const ExpressHTTPServer = require('fastboot-app-server/src/express-http-server');
const FastBootAppServer = require('fastboot-app-server');
const httpProxy = require('http-proxy');

const backend = process.env.BACKEND;
const serverPort = process.env.PORT || 80;
const emberPath =  /(^\/(assets|fonts).*)|(^\/$)/;

const httpServer = new ExpressHTTPServer({});
const app = httpServer.app;
const proxy = httpProxy.createProxyServer({});

app.use((request, response, next) => {
    if(emberPath.test(request.url)){
        next();
        return;
    }
    proxy.web(request, response, {
        target: backend
    });

});

let server = new FastBootAppServer({
    distPath: '/dist',
    httpServer: httpServer,
});

server.start();
