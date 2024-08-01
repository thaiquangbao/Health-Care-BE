FROM node:18
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . .
EXPOSE 9006
CMD [ "node", "index.js" ]
