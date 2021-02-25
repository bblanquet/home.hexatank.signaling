FROM node:12
WORKDIR /app
COPY *.json ./
COPY webpack.config.js ./
RUN npm install
COPY . .
ENV PORT=5000
EXPOSE 5000
CMD [ "npm","start" ]