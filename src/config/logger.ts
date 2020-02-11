import winston from 'winston';
import { Tags } from 'opentracing';
import { config } from './config';

let transports = [];

let dateStr = new Date().toISOString();

if (config.toggle.log.files) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/' + dateStr + '-error.log',
      level: 'error'
    })
  );

  transports.push(
    new winston.transports.File({
      filename: 'logs/' + dateStr + '-info.log',
      level: 'info'
    })
  );
}

if (config.toggle.log.console) {
  transports.push(new winston.transports.Console());
}

winston.configure({
  transports: transports
});

/**
 * @param level
 * @param payload
 * @param span
 * @param tagObj
 */
export const log = function(
  level: string,
  payload: string,
  span: any | undefined,
  tagObj: any | undefined
) {
  if (span && tagObj) {
    for (let tag in tagObj) {
      if (Object.prototype.hasOwnProperty.call(tagObj, tag)) {
        span.setTag(tag, tagObj[tag]);
      }
    }
  }

  if (span && level === 'error') {
    span.setTag(Tags.ERROR, true);
  }

  winston.log(level, JSON.stringify(payload));

  if (span) {
    span.log(payload);
  }
};

export default {
  debug: (payload: string, span: any | undefined, tagObj: any | undefined) =>
    log('debug', payload, span, tagObj),
  info: (payload: string, span: any | undefined, tagObj: any | undefined) =>
    log('info', payload, span, tagObj),
  warn: (payload: string, span: any | undefined, tagObj: any | undefined) =>
    log('warn', payload, span, tagObj),
  error: (payload: string, span: any | undefined, tagObj: any | undefined) =>
    log('error', payload, span, tagObj)
};
