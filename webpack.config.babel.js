import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import paths from './config/paths';

function getNamesAndPaths(folder) {
  return fs.readdirSync(folder).reduce((accu, file) => {
    const fileName = path.basename(file, '.jsx');
    const filePath = path.join(folder, file);

    return Object.assign({}, accu, { [fileName]: filePath });
  }, {});
}

console.log("NOME PATH!!!! \n" + JSON.stringify(getNamesAndPaths(paths.dashboards)));

const webConfig = {
  devServer: {
    historyApiFallback: true
  },
  mode: process.env.NODE_ENV || 'development',
  entry: getNamesAndPaths(paths.dashboards),
  target: 'web',
  output: { path: '/dist/', filename: '[name].dashboard.bundle.js', publicPath: '/' },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        },
        include: [paths.dashboards, paths.reactviews, paths.reactelements, paths.widgets, paths.lib],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [paths.styles, paths.reactviews, paths.reactelements, paths.widgets],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en)$/),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    modules: [path.resolve(__dirname), 'node_modules'],
  },
};

export default webConfig;
