FROM node:8

WORKDIR /app/back-end

COPY package.json /app/back-end

RUN npm install 

COPY . /app/back-end

RUN cd /app/back-end && npm install

CMD node index.js

EXPOSE 5900


# FROM keymetrics/pm2-docker-alpine:7

# COPY . /app/patient-feedack

# RUN npm install -g babel-cli

# RUN cd /app/patient-feedack && npm install

# CMD ["pm2-docker", "start", "/app/patient-feedack/config/pm2_config.json" ]
