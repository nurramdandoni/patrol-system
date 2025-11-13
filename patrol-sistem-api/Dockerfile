FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# pastikan folder uploads tetap ada
RUN mkdir -p /app/uploads

EXPOSE 5050
CMD ["npm", "start"]
