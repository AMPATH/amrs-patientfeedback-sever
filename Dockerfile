FROM node:8

COPY . /opt/patient-feedback-server

RUN cd /opt/patient-feedback-server && npm install

CMD ["node", "/opt/patient-feedback-server/index.js" ]
