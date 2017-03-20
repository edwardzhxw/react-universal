import fs from 'fs-extra';
import path from 'path';
import webpack from 'webpack';
import webpackConfig, { buildPath } from './webpack.prod.config';

fs.removeSync(buildPath);
fs.copySync(path.join(__dirname, '..', 'src', 'public', 'favicon.ico'), path.join(buildPath, 'favicon.ico'));
const compiler = webpack(webpackConfig);
compiler.run((err, stats) => {
  if (err) {
    console.log(err);
  }
  console.log(stats.toString({ colors: true, chunks: false }))
});
