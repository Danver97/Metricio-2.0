FROM node:latest

COPY . /app

WORKDIR /app

RUN npm install --only=production

RUN npm install cross-env -g

EXPOSE 3000

CMD npm run production
