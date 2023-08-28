FROM --platform=linux/amd64 node:18

WORKDIR /usr/app

COPY ./package*.json ./
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 8000

RUN npm run build

# CMD npm start
CMD [ "node", "dist/src/server.js" ]