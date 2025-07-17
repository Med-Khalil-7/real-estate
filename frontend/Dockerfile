FROM node:16
WORKDIR /app/
COPY . /app/
# ADD package-lock.json /app/package-lock.json
RUN npm install
EXPOSE 3000
ENV CHOKIDAR_USEPOLLING=trues
CMD ["npm", "run", "start"]
