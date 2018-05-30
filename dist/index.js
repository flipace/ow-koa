// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({3:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let pm2 = {};

try {
  if ('production' === 'production') {
    pm2 = require('pmx').init({
      network: true,
      ports: true
    });
  } else {
    pm2.notify = m => {
      console.info('pmx notify');
      console.info(m);
    };
    pm2.emit = () => {};
    pm2.action = () => {};
    pm2.probe = () => ({
      histogram: () => ({
        update() {}
      }),
      metric: () => ({
        set() {}
      }),
      meter: () => ({
        mark() {}
      }),
      counter: () => ({
        inc() {}
      })
    });
  }
} catch (err) {
  console.warn(err);
}

exports.default = pm2;
},{}],1:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaHelmet = require('koa-helmet');

var _koaHelmet2 = _interopRequireDefault(_koaHelmet);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaMount = require('koa-mount');

var _koaMount2 = _interopRequireDefault(_koaMount);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _getPort = require('get-port');

var _getPort2 = _interopRequireDefault(_getPort);

var _owCore = require('ow-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class OwKoa extends _owCore.OwModule {
  constructor(app, options = {}) {
    super(app);

    _initialiseProps.call(this);

    this.config = _extends({
      port: undefined,
      bodyParser: true,
      helmet: true,
      staticFolder: _path2.default.join(__dirname, '../../static'),
      pmxTracking: false
    }, options);

    this.koa = undefined;
    this.server = undefined;
    this.port = undefined;
  }

}
exports.default = OwKoa;

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.load = _asyncToGenerator(function* () {
    const app = _this.app,
          config = _this.config;


    app.koa = new _koa2.default();
    app.router = new _koaRouter2.default();

    app.koa.proxy = true;

    if (config.helmet && 'production' !== 'development') {
      app.koa.use((0, _koaHelmet2.default)());
    }

    if (config.bodyParser) {
      app.koa.use((0, _koaBodyparser2.default)());
    }

    if (config.staticFolder) {
      app.koa.use((0, _koaMount2.default)('/static', (0, _koaStatic2.default)(config.staticFolder)));
    }

    if (config.pmxTracking) {
      const pm2 = require('./helpers/pmx').default; // eslint-disable-line
      const probe = pm2.probe();

      const meter = probe.meter({
        name: 'req/sec',
        samples: 1
      });

      app.koa.use(function (ctx, next) {
        meter.mark();
        return next();
      });
    }

    return _this;
  });
  this.setPort = _asyncToGenerator(function* () {
    const config = _this.config;


    _this.port = config.port || undefined || (yield (0, _getPort2.default)());

    if ('production' === 'test' && undefined) {
      _this.port = undefined;
    }

    return _this.port;
  });
  this.ready = _asyncToGenerator(function* () {
    var _app = _this.app;
    const logger = _app.logger,
          koa = _app.koa,
          router = _app.router;


    router.get('/checkConnection', function (ctx) {
      ctx.status = 200;
      ctx.body = 'ok';
    });

    // attach a new $cache objcet for each request
    koa.use((() => {
      var _ref4 = _asyncToGenerator(function* (ctx, next) {
        ctx.$cache = {};
        yield next();
      });

      return function (_x, _x2) {
        return _ref4.apply(this, arguments);
      };
    })());

    // attach request time middleware
    koa.use((() => {
      var _ref5 = _asyncToGenerator(function* (ctx, next) {
        const start = Date.now();

        yield next();

        logger.debug(`Time: ${Date.now() - start}ms`);
      });

      return function (_x3, _x4) {
        return _ref5.apply(this, arguments);
      };
    })());

    koa.use(router.routes());
    koa.use(router.allowedMethods());

    const port = yield _this.setPort();

    _this.app.server = yield koa.listen(port);
    _this.server = _this.app.server;

    _this.app.uri = `http://localhost:${port}`;

    logger.info(`Server listening on http://localhost:${port}`);

    process.on('exit', _this.unload);
  });

  this.unload = () => {
    this.app.logger.info(`Closing server listening on http://localhost:${this.port}`);

    return this.server.close();
  };
};
},{"./helpers/pmx":3}]},{},[1], null)
//# sourceMappingURL=/index.map