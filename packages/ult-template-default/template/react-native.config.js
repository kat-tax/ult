const fs = require('fs');
const path = require('path');
const pathRNW = require.resolve('react-native-windows/package.json');

module.exports = {
  reactNativePath: path.resolve(fs.realpathSync(pathRNW), '..'),
};
