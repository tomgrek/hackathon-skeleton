FROM node:latest
RUN mkdir -p /usr/src/zig
COPY package.json /usr/src/zig/
COPY *.js /usr/src/zig/
RUN mkdir /usr/src/zig/app
COPY app/*.* /usr/src/zig/app/
WORKDIR /usr/src/zig/
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]

