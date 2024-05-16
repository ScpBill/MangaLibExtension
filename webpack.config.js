import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import fs from 'fs';
import fileSystem from 'fs-extra';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';


const replaceGlobs = (path) => path.replace(/(\/\*\*)*\/\*$/, '');

function tsconfigPathsConverter (tsConfigPath, dirname = '.') {
  const tsConfig = JSON.parse(fileSystem.readFileSync(tsConfigPath).toString());
  const { baseUrl, paths = {} } = tsConfig.compilerOptions;
  return Object.keys(paths).reduce((aliases, pathName) => {
    const alias = replaceGlobs(pathName);
    const path = replaceGlobs(paths[pathName][0]);
    aliases[alias] = path.resolve('.', dirname, baseUrl, path);
    return aliases;
  }, {});
}


function transform (content) {
  const buffer = JSON.parse(content.toString());
  buffer['content_scripts'][0]['js'] = [];
  for (const dirname of fs.readdirSync('./src/extensions')) {
    if (fs.existsSync(`./src/extensions/${dirname}/index.ts`) || fs.existsSync(`./src/extensions/${dirname}/index.tsx`)) {
      buffer['content_scripts'][0]['js'].push(`${dirname}/index.js`);
    }
    if (fs.existsSync(`./src/extensions/${dirname}/background.ts`) || fs.existsSync(`./src/extensions/${dirname}/background.tsx`)) {
      buffer['content_scripts'][0]['js'].push(`${dirname}/background.js`);
    }
  }
  return Buffer.from(
    JSON.stringify({
      description: process.env.npm_package_description,
      version: process.env.npm_package_version,
      ...buffer,
    }),
  );
}


const entry = {};
for (const dirname of fs.readdirSync(path.resolve('./src/extensions'))) {
  const absolute = (filename) => path.join(path.resolve('./src/extensions'), dirname, filename);

  if (fs.existsSync(absolute('index.ts')) && fs.existsSync(absolute('index.tsx'))) throw new Error('conflict between two files named index');
  else if (fs.existsSync(absolute('index.ts'))) entry[`${dirname}/index`] = absolute('index.ts');
  else if (fs.existsSync(absolute('index.tsx'))) entry[`${dirname}/index`] = absolute('index.tsx');

  if (fs.existsSync(absolute('background.ts')) && fs.existsSync(absolute('background.tsx'))) throw new Error('conflict between two files named background');
  else if (fs.existsSync(absolute('background.ts'))) entry[`${dirname}/background`] = absolute('background.ts');
  else if (fs.existsSync(absolute('background.tsx'))) entry[`${dirname}/background`] = absolute('background.tsx');
}


const ASSET_PATH = process.env.ASSET_PATH || '/';
const fileExtensions = [ 'jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'ttf', 'woff', 'woff2' ];


const options = {
  mode: process.env.NODE_ENV || 'development',
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
    clean: true,
    publicPath: ASSET_PATH,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { svgo: false },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: new RegExp(`.(${  fileExtensions.join('|')  })$`),
        type: 'asset/resource',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: tsconfigPathsConverter(path.resolve('./tsconfig.json')),
    extensions: fileExtensions.map((extension) => `.${extension}`).concat([ '.js', '.jsx', '.ts', '.tsx', '.css' ]),
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve('./manifest.json'),
          to: path.resolve('./dist'),
          force: true,
          transform,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve('./src'),
          to: path.resolve('./dist'),
          force: true,
          filter: function (resolvePath) {
            return fileExtensions.includes(resolvePath.split('.').at(-1));
          },
        },
      ],
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
  infrastructureLogging: {
    level: 'info',
  },
  devtool: process.env.NODE_ENV !== 'development' ? false : 'hidden-source-map',
  optimization: process.env.NODE_ENV !== 'development' ? undefined : {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  stats: 'none',
};


export default options;
