module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /node_modules\/react-helmet-async/, // Force Babel to transpile react-helmet-async
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-private-methods',
                '@babel/plugin-proposal-private-property-in-object'
              ]
            }
          }
        }
      ]
    }
  };
  