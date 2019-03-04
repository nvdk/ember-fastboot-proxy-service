FROM node:10.15.0-alpine
RUN mkdir -p /server
COPY package.json /server/
WORKDIR /server
RUN npm install
COPY server.js /server/
RUN mkdir -p /app
EXPOSE 80
ENV DISTPATH /app
ENTRYPOINT cd $DISTPATH && npm install && cd /server/ && node server.js
