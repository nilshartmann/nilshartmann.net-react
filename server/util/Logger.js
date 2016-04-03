// --------------------------------------------------------------------------------------
// --- Nils Hartmann (http://nilshartmann.net).
// -------------------------------------------------------------------------------------
import moment from 'moment';
import winston from 'winston';
import winstonConfig from 'winston/lib/winston/config';
import _ from 'lodash';

// https://github.com/winstonjs/winston?PHPSESSID=02b65463441ebb6580ba41bde8f03247
//
// Custom Log Format
//
// To specify custom log format you should set formatter function for transport. Currently supported transports are: Console, File, Memory. Options object will be passed to the format function. It's general properties are: timestamp, level, message, meta. Depending on the transport type may be additional properties.
const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: false,
      level:            'debug',
      timestamp: function() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
      },
      formatter: function(options) {
        const colorizedLevel = winstonConfig.colorize(_.padRight(options.level.toUpperCase(), 5));
        // Return string will be passed to logger.
        const str = options.timestamp() + ' ' + colorizedLevel + ' ' + (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
        return str;
      }
    })
  ]
});

winstonLogger.setLevels({
  'debug': 2,
  'info':  4,
  'warn':  5,
  'error': 6
});

winston.addColors({
  'ERROR': 'red',
  'WARN ': 'red',
  'INFO ': 'green',
  'DEBUG': 'blue'
});

const knownLoggers = {};

export default class Logger {
  constructor(name) {
    this.name = _.chain(name).padRight(17).trunc({
      length:     17,
      'omission': ''
    });
  }

  error() {
    arguments[0] = this.name + ' ' + arguments[0];
    winstonLogger.error.apply(winstonLogger, arguments);
  }

  warn() {
    arguments[0] = this.name + ' ' + arguments[0];
    winstonLogger.warn.apply(winstonLogger, arguments);
  }

  info() {
    arguments[0] = this.name + ' ' + arguments[0];
    winstonLogger.info.apply(winstonLogger, arguments);
  }

  debug() {
    arguments[0] = this.name + ' ' + arguments[0];
    winstonLogger.debug.apply(winstonLogger, arguments);
  }

  static getLogger(name) {
    if (!_.has(knownLoggers, name)) {
      knownLoggers[name] = new Logger(name);
    }
    return knownLoggers[name];
  }
}
