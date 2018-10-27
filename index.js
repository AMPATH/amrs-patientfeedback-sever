'use strict';

const Hapi = require('hapi');
const routes = require('./routes');
const config = require('./config/config');

const server = new Hapi.Server();
server.connection({
  port: config.application.port,
  host: config.application.host,
  routes: {
    cors: true
  }
});

for (var route of routes.routesFxn()) {
  server.route(route);
}

server.start((err) => {

  if (err) {
      throw err;
  }
  console.log('Server running at:', server.info.uri);
});
