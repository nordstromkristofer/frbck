const { 
    createLogger, 
    transports,
    format 
} = require ('winston');
require('winston-mongodb');

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'info.log',
            format: format.combine(format.timestamp(), format.simple())
        }),
        new transports.MongoDB({
            db: process.env.DB_CONNECT,
            options: {useUnifiedTopology: true},
            collection:'logins',
            format: format.combine(format.timestamp(), format.json())
        })
    ]
})

module.exports = logger;