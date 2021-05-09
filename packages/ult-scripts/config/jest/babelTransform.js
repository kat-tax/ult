const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    [
      require.resolve('babel-preset-react-app'),
      {runtime: 'classic'},
    ],
  ],
  babelrc: false,
  configFile: false,
});
