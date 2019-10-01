# build environment
FROM node:10.16.0 as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app
RUN npm run build:client


# production environment
FROM nginx:1.17.3-alpine
COPY --from=builder /usr/src/app/dist/idlelands /usr/share/nginx/html
COPY --from=builder /usr/src/app/dist/idlelands /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
