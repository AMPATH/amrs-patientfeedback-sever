const mysql = require('mysql');
const config = require('../config/config')

var pool = mysql.createPool(config.database);

var def = {
    executeQuery: executeQuery
};


module.exports = def;

function executeQuery(query) {
    return new Promise((resolve, reject) => {
        pool.query(query, (err, rows) => {
            if (!err) {
                resolve(rows);
                return;
            } else {
                throw err;
            }
        });

    });
}
