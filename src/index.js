import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import koaStatic from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import getPort from 'get-port';

import {
  OwModule
} from 'ow-core';

export default class OwKoa extends OwModule {
  constructor(app, options = {}) {
    super(app);

    this.config = {
      port: undefined,
      bodyParser: true,
      helmet: true,
      staticFolder: path.join(__dirname, '../../static'),
      pmxTracking: false,
      ...options,
    };

    this.koa = undefined;
    this.server = undefined;
    this.port = undefined;
  }

  load = async () => {
    const {
      app,
      config
    } = this;

    app.koa = new Koa();
    app.router = new KoaRouter();

    app.koa.proxy = true;

    if (config.helmet && process.env.NODE_ENV !== 'development') {
      app.koa.use(helmet());
    }

    if (config.bodyParser) {
      app.koa.use(bodyParser());
    }

    if (config.staticFolder) {
      app.koa.use(mount('/static', koaStatic(config.staticFolder)));
    }

    if (config.pmxTracking) {
      const pm2 = require('./helpers/pmx').default; // eslint-disable-line
      const probe = pm2.probe();

      const meter = probe.meter({
        name: 'req/sec',
        samples: 1,
      });

      app.koa.use((ctx, next) => {
        meter.mark();
        return next();
      });
    }

    return this;
  }

  setPort = async () => {
    const {
      config
    } = this;

    this.port = config.port || process.env.PORT || await getPort();

    if (process.env.NODE_ENV === 'test' && process.env.TEST_PORT) {
      this.port = process.env.TEST_PORT;
    }

    return this.port;
  }

  ready = async () => {
    const {
      app: {
        logger,
        koa,
        router
      }
    } = this;

    router.get('/checkConnection', (ctx) => {
      ctx.status = 200;
      ctx.body = 'ok';
    });

    // attach a new $cache objcet for each request
    koa.use(async (ctx, next) => {
      ctx.$cache = {};
      await next();
    });

    // attach request time middleware
    koa.use(async (ctx, next) => {
      const start = Date.now();

      await next();

      logger.debug(`Time: ${Date.now() - start}ms`);
    });

    koa.use(router.routes());
    koa.use(router.allowedMethods());

    const port = await this.setPort();

    this.app.server = await koa.listen(port);
    this.server = this.app.server;

    this.app.uri = `http://localhost:${port}`;

    logger.info(`Server listening on http://localhost:${port}`);

    process.on('exit', this.unload);
  }


  unload = () => {
    this.app.logger.info(`Closing server listening on http://localhost:${this.port}`);

    return this.server.close();
  }
}
