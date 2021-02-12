const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: './index.html',
})

const config = mode => {
  const isDevelopMode = mode === 'development'
  return {
    entry: './src/index.tsx',
    output: {
      path: path.join(__dirname, '/build'),
      filename: 'index.bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(css)$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDevelopMode
                    ? '[path][name]__[local]--[hash:base64:5]'
                    : '[name]__[local]--[hash:base64:5]',
                },
                importLoaders: 1,
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [htmlPlugin],
  }
}

module.exports = (env, argv) => {
  const { mode } = argv
  return config(mode)
}
