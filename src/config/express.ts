import http from 'http';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import controller from 'express-power-router';

const methodOverride = require('method-override');
const helmet = require('helmet');
const xss = require('xss-clean');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

import { config } from './config';

let app = express();

app.locals.title = config.app.title;
app.locals.description = config.app.description;

app.set('showStackError', true);

if (process.env.NODE_ENV === 'development') {
  let morgan = require('morgan');
  app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(xss());
app.use(methodOverride());

app.use(
  helmet({
    frameguard: false
  })
);
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.removeHeader('X-Frame-Options');
  next();
});

app.set('jsonp callback', true);

if (config.toggle.apidoc) {
  //TODO Fazer swagger
  const swaggerDocument = YAML.load(path.join(__dirname, '../../apidoc.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(config.basePath, controller.router);

app.get(config.basePath, (req, res) => {
  res.send({ status: 'UP', path: config.basePath });
});

const server = http.createServer(app);

app.set('server', server);

export default app;
