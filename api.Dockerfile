FROM node:20.15.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g json-server --unsafe-perm=true

COPY . .

EXPOSE 3030

CMD ["npm" , "run", "start"]
