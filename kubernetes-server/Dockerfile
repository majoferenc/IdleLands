FROM node:10
ENV PORT 8000
EXPOSE 8000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start:server"]
