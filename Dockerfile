FROM node:latest
RUN mkdir -p /usr/src/zig
COPY package.json /usr/src/zig/
COPY *.js /usr/src/zig/
RUN mkdir /usr/src/zig/dist
COPY dist/* /usr/src/zig/dist/
WORKDIR /usr/src/zig/
RUN npm install
EXPOSE 3000
# CMD ["npm", "start"]
ENV NODE_ENV production
ENV PORT 3000
CMD ["npm", "run", "build"]
CMD ["npm", "start"]


