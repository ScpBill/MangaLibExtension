import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
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

function entryGenerate () {
  const entry = {};
  for (const pathes of glob.sync('./src/extensions/*/index.ts')) {
    entry[pathes.split('/').at(-2)] = path.resolve(`./src/extensions/${pathes.split('/').at(-2)}/${pathes.split('/').at(-1)}`);
  }
  return entry;
}


const ASSET_PATH = process.env.ASSET_PATH || '/';
const fileExtensions = [ 'jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'ttf', 'woff', 'woff2' ];


const options = {
  mode: process.env.NODE_ENV || 'development',
  entry: entryGenerate(),
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
          transform: function (content) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              }),
            );
          },
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
