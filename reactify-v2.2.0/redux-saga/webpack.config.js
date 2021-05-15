'use strict';

/**
 * Webpack Config
 */
const path = require('path');
const fs = require('fs');
var webpack = require("webpack");

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// plugin
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin }= require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin  = require("compression-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



var version = 'v.4.2.4';
const OUTPUT_PATH = resolveApp('dist');

var config = {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        // The build folder.
        path: OUTPUT_PATH,
        // Generated JS file names (with nfested folders).
        // There will be one main bundle, and one file per asynchronous chunk.
        // We don't currently advertise code splitting but Webpack supports it.
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: 'static/js/[name].[hash:8].chunk.js',
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: '/'
    },
    devServer: {
        contentBase: './src/index.js',
        compress: true,
        host : '0.0.0.0',
        disableHostCheck: true,
        port: 8888, // port number
        historyApiFallback: true,
        https : true
    },
    // resolve alias (Absolute paths)
    resolve: {
        alias: {
            Actions: path.resolve(__dirname, 'src/actions/'),
            Components: path.resolve(__dirname, 'src/components/'),
            Assets: path.resolve(__dirname, 'src/assets/'),
            Util: path.resolve(__dirname, 'src/util/'),
            Routes: path.resolve(__dirname, 'src/routes-staff/'),
            Constants: path.resolve(__dirname, 'src/constants/'),
            Helpers: path.resolve(__dirname, 'src/helpers/'),
            Api: path.resolve(__dirname, 'src/api/'),
            Validations: path.resolve(__dirname, 'src/validations/'),
            'react-dom': '@hot-loader/react-dom',
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpg|gif|mp3)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            // Scss compiler
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [],
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 8,
            maxInitialRequests: 8,
            automaticNameDelimiter: '-',
            name: true,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              }
            }
          }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "./public/index.html",
            filename: "./index.html",
            favicon: './public/favicon.ico',
            title: 'Tambola Game',
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
            chunkFilename: "static/css/[name].[hash:8].css"
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
};

module.exports = (env, argv) =>
{
  if (argv.mode === 'development') {
    config.output.publicPath  = '/';

    config.plugins.push(new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(version)
    }));
  // config.plugins.push(new BundleAnalyzerPlugin());

  }
  else if (argv.mode === 'production') {
    config.plugins.push(new webpack.DefinePlugin({
        "process.env": {
        "NODE_ENV": JSON.stringify("production") },
        __VERSION__: JSON.stringify(version)
    }));



    config.optimization.minimizer.push(// we specify a custom UglifyJsPlugin here to get source maps in production
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
            compress: true,
            ecma: 6,
            mangle: true
      },
      sourceMap: true,
    }));

    config.optimization.minimizer.push(
    new OptimizeCSSAssetsPlugin({}));

    config.plugins.push(  new webpack.optimize.MinChunkSizePlugin({
          minChunkSize: 3000 // Minimum number of characters
    }));

    config.optimization.minimizer.push(
    new CompressionPlugin({
      deleteOriginalAssets: true,
      threshold : 0.001,
      exclude: /tgp-sw/,
      minRatio: 1.5,
      test: /\.js$|\.css$/
    }));

  }

  return config;
}
