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


const init = async () => {

  for (var route of routes.routesFxn()) {
    server.route(route);
  }

  await server.start();
  console.log('Server is running');
}

init();

