FROM node:6.9.5
RUN mkdir -p /server
COPY package.json /server/
WORKDIR /server
RUN npm install
COPY server.js /server/
RUN mkdir -p /dist
WORKDIR /dist
ENTRYPOINT npm install && cd /server/ && export PORT=80 && export BACKEND="http://backend" && node server.js
