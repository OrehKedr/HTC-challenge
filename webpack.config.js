const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const AutoPrefixer = require('autoprefixer')

//Посмотрим системную переменную.
//NODE_ENV инициализируем при запуске скрипта.
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

//Шаблон для выходного файла
const fileName = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const optimization = () => {
  //Чтобы не дублировать код импортируемых библиотек
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  //Минимизация .css файлов
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const cssLoaders = extra => {
  const loaders = [
    //Перенос стилей в отдельный .css-файл.
    //И подключение в <head><link href="main.css" rel="stylesheet"></head>
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        //Hot module replacement
        hmr: isDev,
        reloadAll: true
      }
    },
    //Учим webpack понимать css-импорты в .js-файлах
    'css-loader',
    //Добавляем браузерные префиксы
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          new AutoPrefixer()
        ]
      }
    },
  ]

  //При работе с .less и .s[ac]ss
  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

const imgLoaders = compress => {
  const loaders = [
    'file-loader'
  ]

  const imgWebpackLoader = {
    loader: 'image-webpack-loader',
    options: {
      mozjpeg: {
        progressive: true,
        quality: 70
      },
      optipng: {
        enabled: false,
      },
      pngquant: {
        quality: [0.65, 0.90],
        speed: 4
      },
      gifsicle: {
        interlaced: false,
      },
      webp: {
        quality: 75
      }
    }
  }

  if (compress) {
    loaders.push(imgWebpackLoader)
  }

  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist')
  },
  optimization: optimization(),
  devServer: {
    port: 3300,
    hot: isDev
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'src/assets/img'),
        to: path.resolve(__dirname, 'dist/assets/img')
      }
    ]),
    new MiniCssExtractPlugin({
      filename: fileName('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: imgLoaders(isProd)
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          }
        ]        
      }
    ]
  }
}