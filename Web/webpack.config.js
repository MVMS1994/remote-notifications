const path = require('path');
const BAP  = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

var baseConfig = {
  entry: {
    app: './dist/pulp.js',
    ui: './react/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [],
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: ['file-loader']
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: ['file-loader']
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader"
      }
    }]
  }
};


module.exports = (env) => {
  if (env == "dev") {
    baseConfig["devServer"] = {
      port: 8090,
      contentBase: './dist',
      disableHostCheck: true
    }
    baseConfig["mode"]    = 'development'
    baseConfig["stats"]   = 'errors-only'
    baseConfig["devtool"] = 'inline-source-map'
  } else {
    baseConfig["optimization"] = {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin()
      ]
    }
    baseConfig["mode"]    = "production"
    baseConfig["devtool"] = "none"
  }

  return baseConfig;
}