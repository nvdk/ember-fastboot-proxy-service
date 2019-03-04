FROM node:10.15.0-alpine
RUN mkdir -p /server
COPY package.json /server/
WORKDIR /server
RUN npm install
COPY server.js /server/
RUN mkdir -p /dist
WORKDIR /dist
EXPOSE 80
ENTRYPOINT npm install && cd /server/ && export PORT=80 && export BACKEND=backend && node server.js
