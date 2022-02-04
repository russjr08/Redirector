FROM node:16

WORKDIR /app/redirector

COPY package*.json ./
COPY wait-for-it.sh ./

RUN chmod +x wait-for-it.sh

RUN npm ci --only=production

COPY . .

EXPOSE 9500

CMD ["node", "src/index.js"]