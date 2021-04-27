FROM node:12
WORKDIR /app
COPY . .
RUN npm install
ENV PORT=5000
EXPOSE 5000
CMD [ "npm","start" ]