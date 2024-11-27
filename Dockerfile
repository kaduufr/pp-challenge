FROM node:20.15.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx ng config -g cli.analytics false

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
