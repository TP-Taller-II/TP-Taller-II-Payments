FROM node:12

WORKDIR /app
COPY package*.json ./

RUN npm install nodemon
RUN npm install --production

COPY . .

EXPOSE $PORT
CMD [ "npm", "run", "heroku:start" ]
