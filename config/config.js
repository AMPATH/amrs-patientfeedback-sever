"use strict";
module.exports = function () {
    var obj = {
        application: {
            host: '0.0.0.0',
            port: 5000,
            tls: false
        },
        database: {
            host: '10.50.80.115',
            port: '3307',
            user: 'etl_user',
            password: '%RTF:zCML2K',
            database: 'patient_feedback',
        }
    };

    if (!obj.application['host']) {
        throw new Error('Missing constant application.host.');
    } else if (!obj.application['port']) {
        throw new Error('Missing constant application.port.');
    } else if (!obj.database['host']) {
        throw new Error('Missing constant database.host.');
    } else if (!obj.database['user']) {
        throw new Error('Missing constant database.user.');
    } else if (!obj.database['database']) {
        throw new Error('Missing constant database.database.');
    }

    return obj;

}();