const {defaultConfiguration} = require('../constants/AppConfig')

// create a rolling file logger based on date/time that fires process events
const opts = {
    errorEventName:'error',
        logDirectory: defaultConfiguration.basePathForLogFile, // NOTE: folder must exist and be writable...
        fileNamePattern:'logs-<DATE>.log',
        dateFormat:'YYYY-MMM-DD a'
};
const log = require('simple-node-logger').createRollingFileLogger( opts );

exports.writeLog = (params) => {

    try {

    log.info((params.client || '') + ' ' + (params.url || '') + ' ' + (params.message || '') + ' ' + ((params.data && JSON.stringify(params.data)) || ''));

    } catch (e) {

    }
}
