<img src="docs/_media/ow-logo.png" width="100" />

# ow-koa

**ow-koa** gives you everything you need to create a modular application using **ow-core** and a selection of koa middlewares, such as koa-helmet, koa-router, koa-mount, koa-static and koa-bodyparser.

With this module it's as easy as pie to add routes for your ow modules.

# Quick Start

```bash
yarn add ow-koa
```

## Usage

Creating and starting a new app is as simple as writing 3 lines (or 1, if you dare to do so) of code.

```js
import Ow from 'ow-core';
import OwKoa from 'ow-koa';

async function boot() {
  const app = new Ow();

  await app.addModules([
    OwKoa
  ]);

  app.start();
}

boot();
```

```bash
yarn start
```

This is going to add and configure a koa server which will listen on a random port.
Your log output should display that the server is listening on this port and a route /checkConnection
will be available to check whether everything works as expected.


## Adding routes

Adding routes or middleware is really easy.

For infos about koa-router, please refer to its documentation: [alexmingoia/koa-router](https://github.com/alexmingoia/koa-router)

**ow-koa** attaches:

```js
app.koa // the koa instance
app.router // the koa-router instance
```

You can access them from within
all modules you added to your **ow** application. 

```js
import { OwModule } from 'ow-core';

class MyModule extends OwModule {
  static dependencies = ['OwKoa'];

  load() {
    const { router } = this.app;

    router.get('/my-module', ctx => ctx.body = 'My Module!');
  }
}
```

```bash
yarn start
```

Now you can go to http://localhost:{PORT}/my-module and you should see 'My Module!'

### About

Built with <3 by the folks at [ovos](https://ovos.at)

Contributions are very welcome!

### License

[MIT License](LICENSE)