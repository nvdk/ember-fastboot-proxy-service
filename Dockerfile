FROM node:10.15.0-alpine
RUN mkdir -p /server
RUN npm install supervisor -g
COPY package.json /server/
WORKDIR /server
RUN npm install
COPY . /server/
RUN mkdir -p /app
EXPOSE 80
CMD [ "/bin/sh", "start.sh"]
