module.exports = {
  context: __dirname,
  entry: {
    winterfell: [
      './src/index.js'
    ]
  },
  mode: 'none',
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader'
    }]
  },
  externals : {
    'lodash': 'umd lodash',
    'prop-types': 'umd prop-types',
    'react': 'umd react'
  },
  output: {
    libraryTarget: 'umd',
    library: 'Winterfell',
    filename: '[name].js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
