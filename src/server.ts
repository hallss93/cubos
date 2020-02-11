require('module-alias/register');
require('dotenv').config();

process.env.NOVE_ENV = process.env.NODE_ENV || 'development';

import express from 'express';
import * as http from 'http';
import { config } from '@config/config';
import app from '@config/express';
import path from 'path';

const glob = require('glob');

export class Server {
  public static app: express.Express = app;

  public static async initialize(): Promise<http.Server> {
    process.on('uncaughtException', function(err) {
      console.log('Error:', err);
    });

    Server.initializeRoutes();
    Server.initializeInterceptors();

    const server = app.get('server');

    if (process.env.NODE_ENV !== 'test') {
      server.listen(config.port);
    }

    console.log(`App is running at port: ${config.port} in ${process.env.NODE_ENV}`);

    return server;
  }

  public static initializeRoutes() {
    glob.sync('./dist/modules/**/*.api.js').forEach(function(routePath: string) {
      require(path.resolve(routePath));
    });
  }

  public static initializeInterceptors() {
    glob.sync('./dist/interceptors/*.interceptor.js').forEach(function(routePath: string) {
      require(path.resolve(routePath));
    });
  }
}
