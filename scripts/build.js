// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

import webpack from 'webpack';
import config from '../webpack.config.js';

config.mode = 'production';

const callback = function (err) {
    if (err) throw err;
}

webpack(config).run(callback);
