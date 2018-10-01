'use strict';

const config = require('../config/config');
const mysql = require('mysql');

module.exports = function()  {
    return mysql.createConnection({
        host     : config.database.host,
        user     : config.database.user,
        password : config.database.password,
        database : config.database.database,
        multipleStatements: true 
    });
}();