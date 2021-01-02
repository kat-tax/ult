// See https://github.com/webpack/node-libs-browser/blob/214057f118bad5da8b99db33fd16a5b6ceb42d9b/mock/dns.js

'use strict';

module.exports.lookup = module.exports.resolve4 = module.exports.resolve6 = module.exports.resolveCname = module.exports.resolveMx = module.exports.resolveNs = module.exports.resolveTxt = module.exports.resolveSrv = module.exports.resolveNaptr = module.exports.reverse = module.exports.resolve = function() {
  if (!arguments.length) {
    return;
  }

  var callback = arguments[arguments.length - 1];
  if (callback && typeof callback === 'function') {
    callback(null, '0.0.0.0');
  }
};
