const mysql = require('mysql');
const config = require('../config/config')

var pool = mysql.createPool(config.database);

var def = {
    executeQuery: executeQuery
};

module.exports = def;

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, function (err, rows, fields) {
            if (err) {
                throw err;
            } else {
                resolve(rows)
            }
        });
    });
}
