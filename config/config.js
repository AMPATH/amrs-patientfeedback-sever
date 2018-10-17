"use strict";
module.exports = function () {
    var obj = {
        application: {
            host: '0.0.0.0',
            port: 5100,
            tls: false
        },
         database: {
             host: 'localhost',
             port: '3306',
             user: 'root',
             password: '',
             database: 'patient_feedback',
             multipleStatement: true
        }
    };

    return obj;

}();
