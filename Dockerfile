# FROM node:8

# WORKDIR /app/amrs-patientfeedback-server

# COPY package.json /app/amrs-patientfeedback-server

# RUN npm install 

# COPY . /app/amrs-patientfeedback-server

# RUN cd /app/amrs-patientfeedback-server && npm install

# CMD node index.js

# EXPOSE 5900


FROM node:8

COPY . /opt/patient-feedback-server

RUN cd /opt/patient-feedback-server && npm install

CMD ["node", "/opt/patient-feedback-server/index.js" ]

# EXPOSE 5900