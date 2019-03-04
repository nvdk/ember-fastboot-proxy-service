# ember-fastboot-proxy-service
Hosting an FastBoot Ember app with a backend API

## Running your Ember app
Assumes you've built your FastBoot app.
```
    docker run --name my-app \
        -p "80:80" \
        --link my-backend-container:backend \
        -v /path/to/spa/dist:/app \
        -d cecemel/ember-fastboot-proxy-service
```
All requests with Accept header containing 'html' or requests to a location matching the regex are served by the Ember app.
Remaining requests are proxied to the backend API.
## OPTIONS
The ones found in https://github.com/ember-fastboot/fastboot-app-server#quick-start.
Defaults are:
```
BACKEND: 'http://backend'
ASSETS: '^\/(assets|fonts)\/.*'
DISTPATH: '/app'
GZIP: 'true'
CHUNKED: 'true'
```
