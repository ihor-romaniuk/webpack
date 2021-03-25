const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_DEV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if(isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
};
const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const cssLoader = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        // hmr: isDev,
        // reloadAll: true
      }
    },
    'css-loader'
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};
const babelOptions = preset => {
  const opts = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties']
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};
const isLoaders = () => {
  const loaders = [{
      loader: 'babel-loader',
      options: babelOptions()
    }];

  if (isDev) {
      loaders.push('eslint-loader');
  }

  return loaders;
};
const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    })
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin())
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.jsx'],
    analytics: './analytics.ts'
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.json', '.png'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@models': path.resolve(__dirname, 'src/models')
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : false,
  plugins: plugins(),

  module: {
    rules: [
      // css files
      {
        test: /\.css$/,
        use: cssLoader()
      },

      // less files
      {
        test: /\.less$/,
        use: cssLoader('less-loader')
      },

      // sass files
      {
        test: /\.s[ac]ss$/,
        use: cssLoader('sass-loader')
      },

      // image files
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },

      // font files
      {
        test: /\.(ttf|woff|woff2|eot)/,
        use: ['file-loader']
      },

      // xml files
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },

      // csv files
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },

      // babel
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: isLoaders()
      },

      // typescript
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions('@babel/preset-typescript')
        }
      },

      // react
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: babelOptions('@babel/preset-react')
        }
      }
    ]
  }
};
