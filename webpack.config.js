const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// default env
process.env.NODE_ENV
  ? (process.env.NODE_ENV = process.env.NODE_ENV)
  : (process.env.NODE_ENV = 'production');

// common cofiguration
const commonConfig = {
  entry: {
    app: './src/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext][query]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};

// dev config
if (process.env.NODE_ENV == 'development') {
  commonConfig.module.rules.push({
    test: /\.scss$/i,
    use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
  });

  module.exports = {
    ...commonConfig,
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      watchFiles: ['./src/index.html'],
      hot: true,
      port: 3000,
    },
  };
}

// prod config
if (process.env.NODE_ENV == 'production') {
  commonConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: '[id].css',
    })
  );

  commonConfig.module.rules.push({
    test: /\.scss$/i,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'sass-loader',
    ],
  });

  module.exports = {
    ...commonConfig,
    mode: 'production',
    optimization: {
      minimize: true,
    },
  };
}
