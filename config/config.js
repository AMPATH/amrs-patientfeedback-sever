"use strict";
module.exports = function () {
    var obj = {
        application: {
            host: '0.0.0.0',
            port: 5100,
            tls: false
        },
        database: {
            host: '10.50.80.240',
            port: '3307',
            user: 'etl_user',
            password: '%RTF:zCML2K',
            database: 'patient_feedback',
            multipleStatement: true
        }
    };

    return obj;

}();
