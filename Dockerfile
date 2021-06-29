FROM node:12
RUN npm install pm2 -g
WORKDIR /app
RUN mkdir node_modules
COPY /node_modules/ ./node_modules/
COPY /dist/ .
ENV PORT=5000
EXPOSE 5000
RUN pm2 init simple
CMD ["pm2-runtime", "app.js"]