/* eslint-disable no-console */
// Do this as the first thing so that any code reading it knows the right env.
import webpack from 'webpack';
import config from '../webpack.config.js';

process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

config.mode = 'production';

function callback(err, stats) {
  return;
}

webpack(config).run(callback);
