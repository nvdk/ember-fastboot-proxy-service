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
services:
  fastboot:
    environment:
      - BACKEND: 'http://backend'
      - STATIC_FOLDERS_REGEX: '^\/(assets|fonts)\/.*'
      - GZIP: 'false'
      - CHUNKED: 'false'
      - LIVE_RELOAD: 'false'
```
## Quirks
### Redirects
E.g. your server redirects https to http. As a workaround some additional mapping is needed to make sure the rendering by the fastboot app works. (If you have better solution, let me know)
In docker-compose
```
services:
  fastboot:
    extra_hosts
     - "target.hostname.of.incoming.request:127.0.0.1"
```
As single container, you could use the --add-host parameter. (Never tested this though)