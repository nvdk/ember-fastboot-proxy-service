#/bin/sh

# After having a build version of your ember app in dist folder, extra dependencies
# need to be installed. https://ember-fastboot.com/docs/deploying
cd /app;
npm install;
cd /server/;
if [ "$NODE_ENV" == "development" ]
then
    : '
       Debugging is not 100% ok. Consider this a hidden feature.
       Only live reload works for now
       In your docker-compose.override.file, the following should help:
       environment:
         NODE_ENV: "development"
       volumes:
          - /absolute/path/to/your/ember-fastboot-proxy-service/server.js:/server/server.js
    '
    echo "Starting DEBUG"
    supervisor -w . -- --inspect=0.0.0.0:9229 server.js;
else
    echo "Starting PROD"
    node server.js;
fi
