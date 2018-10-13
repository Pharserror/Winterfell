module.exports = {
  context: __dirname,
  entry: {
    winterfell: [
      './src/index.js'
    ]
  },
  externals : {
    'lodash': 'umd lodash',
    'react': 'umd React'
  },
  mode: 'none',
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
    }, {
      test: /\.scss$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }]
  },
  output: {
    libraryTarget: 'umd',
    library: 'Winterfell',
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.js']
  }
};
