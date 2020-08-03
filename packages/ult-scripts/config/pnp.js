const {resolveModuleName} = require('ts-pnp');

exports.resolveModuleName = (ts, name, file, compiler, resolution) => {
  return resolveModuleName(name, file, compiler, resolution, ts.resolveModuleName);
};

exports.resolveTypeReferenceDirective = (ts, name, file, compiler, resolution) => {
  return resolveModuleName(name, file, compiler, resolution, ts.resolveTypeReferenceDirective);
};
