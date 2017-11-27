'use strict'

var winston = require('winston');
module.exports = {

    load_winston: function() {
        var date = new Date()

         
        // winston.log('info', 'Hello distributed log files!');
        // winston.info('Hello again distributed logs');

        winston.level = 'silly';
        // winston.log('debug', 'Now my debug messages are written to console!');
        winston.add(winston.transports.File, { filename: 'logfile.log', level: 'debug' });
        winston.debug(date)
        winston.debug('Winston loaded ' + date.toISOString() )

        return winston
    }
   
}