# ember-fastboot-proxy-service
Hosting an FastBoot Ember app with a backend API

## Running your Ember app
    docker run --name my-app \
        -p "80:80" \
        --link my-backend-container:backend \
        -v /path/to/spa/dist:/dist \
        -d cecemel/ember-fastboot-proxy-service

All HTML requests or requests to a location matching the regex `/(assets|fonts)/.*` are served by the Ember app.
Remaining requests are proxied to the backend API.
