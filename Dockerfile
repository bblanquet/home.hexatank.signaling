FROM node:12
WORKDIR /app
COPY *.json ./
COPY webpack.config.js ./
RUN npm install
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD [ "npm","start" ]