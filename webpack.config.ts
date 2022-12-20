const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  devtool: 'inline-source-map', // карта исходников

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)([\?]?.*)$/,
        use: [
          {
            loader: 'file-loader?name=assets/fonts/[name].[ext]',
          },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/views/index.pug',
      favicon: './src/assets/icons/favicon.ico',
      // minify: {
      //   collapseWhitespace: true,
      //   removeComments: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      // },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    // new MiniCssExtractPlugin({
    //   filename: 'style.css',
    // }),
    // new SpriteLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, 'src', 'assets'),
          to: './assets',
        },
      ],
    }),
  ],

  resolve: {
    extensions: ['*', '.tsx', '.ts', '.js'],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },

  // watch: true,
  // watchOptions: {
  //   ignored: ['/node_modules/'],
  // },
};
