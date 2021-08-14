const babelJest = require('babel-jest');
const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true')
    return false;
  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

module.exports = babelJest.createTransformer({
  babelrc: false,
  configFile: false,
  presets: [
    [
      require.resolve('babel-preset-ult-app'),
      {runtime: hasJsxRuntime ? 'automatic' : 'classic'},
    ],
  ],
});
