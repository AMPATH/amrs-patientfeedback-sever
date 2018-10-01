'use strict';

const Hapi = require('hapi');
const routes = require('./routes');
const config = require('./config/config');
const connection =  require('./connection/connection');

const server = Hapi.Server({
  port: config.application.port,
  host: config.application.host,
  routes: {
    cors: true
  }
});

const validate = async (_request, username, password) => {
  // var authBuffer = new Buffer(username + ":" + password).toString("base64");
  // var headers = {'Authorization': "Basic " + authBuffer};
  return new Promise(
    (resolve, reject) => {
      if (username === 'jgichuhi' && password === 'Jgichuhi@2018') resolve({isValid: true, credentials: {}})
      else resolve({isValid: false, credentials: {}})});
    //   var callback = (error, response, _body) => {
    //     if (error) reject(error);
    //     const data = JSON.parse(response.body);
    //     resolve({isValid: data.authenticated, credentials: {}});
    //   }

    //   request(
    //     { method: 'GET',
    //       url: 'https://ngx.ampath.or.ke/test-amrs/ws/rest/v1/session/',
    //       headers: headers
    //     }, callback
    //   );
    // });
  };

const init = async () => {
  
  await server.register([
    {plugin: require('hapi-auth-basic')},
    {plugin: require('inert')}
  ]);

  server.auth.strategy('simple', 'basic', { validate });

  for (var route of routes.routesFxn(validate)) {
    server.route(route);
  }

  server.auth.default('simple');

  await server.start();
  console.log('Server is running');
}

init();

process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
