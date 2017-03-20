const webpack = require('webpack');
const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackManifest = require('./webpackManifest');

// https://github.com/webpack/loader-utils/issues/56
process.noDeprecation = true;
export const buildPath = path.join(__dirname, '../build');
const extractCSS = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true
});
const extractGlobal = new ExtractTextPlugin({
  filename: 'global.[contenthash].css',
  allChunks: true
});

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const pkgPath = path.join(__dirname, '../package.json');
const pkg = fs.existsSync(pkgPath) ? require(pkgPath) : {};
let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  let cfgPath = pkg.theme;
  if (cfgPath.charAt(0) === '.') {
    cfgPath = resolve(args.cwd, cfgPath);
  }
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
}

const web = {
  context: path.resolve(__dirname, '../src'),
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.scss', '.css']
  },
  target: 'web',
  entry: [path.join(__dirname, '../src/web/client.js')],
  output: {
    path: path.join(__dirname, '../build/assets'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "eslint-loader"},
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', {loader: 'css-loader', options: {modules: true, localIdentName: '[local]___[hash:base64:5]', sourceMap: true, importLoaders: 1}}, 'postcss-loader']},
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true, modules: true, localIdentName: '[local]___[hash:base64:5]', importLoaders: 2,}},
            {loader: 'sass-loader', options: {sourceMap: true}},
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.less$/,
        use: extractGlobal.extract({
          fallback: 'style-loader',
          use: [
            {loader: 'css-loader', options: {sourceMap: true, importLoaders: 1,}},
            {loader: 'less-loader', options: {sourceMap: true, modifyVars: theme}}
          ]
        })
      },
      {test: /\.(gif|jpg|jpeg|png)$/, loader: 'url-loader', options: {limit: 10240, name: '[path][name].[ext]?[hash:8]'}},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  },
  plugins: [
    new WebpackManifest({
      fileName: '../manifest.json',
      publicPath: '/assets/',
      writeToFileEmit: true
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      __SERVER__: false,
      __DEVELOPMENT__: false,
      'process.env.NODE_ENV': '"production"'
    }),
    extractCSS,
    extractGlobal,
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        screw_ie8: true,
        warnings: false,
        unused: true,
        dead_code: true,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
const node = {
  context: path.resolve(__dirname, '../src'),
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.json', '.scss', '.css']
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
    console: false,
    global: false,
    process: false,
    Buffer: false,
  },
  entry: path.join(__dirname, '../src/server/index.js'),
  output: {
    path: path.join(__dirname, '../build/assets'),
    filename: '../server.js',
    libraryTarget: 'commonjs2',
    publicPath: '/assets/'
  },
  externals: [/^\.\/manifest\.json$/, nodeModules],
  module: {
    rules: [
      {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
      {test: /\.css$/, use: [{loader: 'css-loader/locals', options: {modules: true, localIdentName: '[local]___[hash:base64:5]', importLoaders: 1}}, 'postcss-loader']},
      {test: /\.scss$/, use: [{loader: 'css-loader/locals', options: {modules: true, localIdentName: '[local]___[hash:base64:5]', importLoaders: 2}}, 'sass-loader', 'postcss-loader']},
      {test: /\.less$/, use: ['css-loader/locals', 'less-loader']},
      {test: /\.(gif|jpg|jpeg|png)$/, loader: 'url-loader', options: {limit: 10240, name: '[path][name].[ext]?[hash:8]'}},
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __SERVER__: true,
      'process.env.NODE_ENV': '"production"',
      __DEVELOPMENT__: false
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.NamedModulesPlugin(),
    new WriteFilePlugin({log: false}),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        screw_ie8: true,
        warnings: false,
        unused: true,
        dead_code: true,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      }
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
};

export default [web, node];
