const { createLogger, format, transports } = require('winston');

const logger = createLogger({     
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss |'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize({
                    // all: true
                }),
                // this is repeated because for some reason colorize() won't work otherwise
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)            
            )
        }),
        new transports.File({ filename: './logs.log' })
    ]
});

module.exports = logger;