const path = require('path');
const replace = require('replace-in-file');

module.exports = async (name, _template) => {
  const root = path.resolve(process.cwd(), name.toLowerCase());
  await replace({
    files: `${root}/windows/${name}/App.cpp`,
    from: `MainComponentName(L"${name}");`,
    to: 'MainComponentName(L"RXApp");',
  });
};
