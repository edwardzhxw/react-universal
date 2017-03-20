import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import browserSync from 'browser-sync';
import config, { buildPath } from './webpack.dev.config';

const compilers = webpack(config);
const host = process.env.PORT || 'localhost';
const port = process.env.PORT || 4000;

fs.removeSync(buildPath);
fs.copySync(path.join(__dirname, '..', 'src', 'public', 'favicon.ico'), path.join(buildPath, 'favicon.ico'));
const devMiddleware = webpackDevMiddleware(compilers, {
  hot: true,
  publicPath: config[0].output.publicPath,
  stats: {
    colors: true,
    chunks: false
  },
  headers: { 'Access-Control-Allow-Origin': '*' }
});

let child;
const BrowserSync = browserSync.create('react-universal');
let BrowserSyncPending = false;
compilers.plugin('done', (stats) => {
  if (child) {
    child.kill('SIGTERM')
  }
  if (stats.stats[1].compilation.errors.length) {
    console.log(stats.stats[1].compilation.errors);
    return;
  }
  child = spawn('node', [path.join(config[1].output.path, config[1].output.filename)], {
    env: Object.assign({ NODE_ENV: 'development' }, process.env)
  });
  child.stderr.on('data', err => process.stdout.write(err));
  child.stdout.on('data', data => {
    if (!BrowserSync.active && !BrowserSyncPending) {
      BrowserSyncPending = true;
      BrowserSync.init({
        port: port + 1,
        proxy: {
          target: `http://${host}:${port}`,
          middleware: [devMiddleware, webpackHotMiddleware(compilers.compilers[0])]
        },
        ui: {
          port: port + 2,
        }
      });
    }
    process.stdout.write(data)
  });
});
