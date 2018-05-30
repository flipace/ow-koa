let pm2 = {};

try {
  if (process.env.NODE_ENV === 'production') {
    pm2 = require('pmx').init({
      network: true,
      ports: true,
    });
  } else {
    pm2.notify = (m) => {
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
      }),
    });
  }
} catch (err) {
  console.warn(err);
}

export default pm2;
