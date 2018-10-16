'use strict';

const Hapi = require('hapi');
const routes = require('./routes');
const config = require('./config/config');


const server = Hapi.Server({
  port: config.application.port,
  host: config.application.host,
  routes: {
    cors: true
  }
});

for (var route of routes.routesFxn()) {
  server.route(route);
}

const init = async () => {

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();