module.exports = function(api) {
  api.cache.forever();

  const presets = [
    ['module:metro-react-native-babel-preset'],
  ];

  const plugins = [
    ['@babel/proposal-decorators', {legacy: true}],
  ];

  return {presets, plugins};
};
