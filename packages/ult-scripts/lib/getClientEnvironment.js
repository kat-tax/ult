function getClientEnvironment(publicUrl) {
  const raw = Object.keys(process.env)
    .filter(key => /^REACT_APP_/i.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {
      PUBLIC_URL: publicUrl,
      NODE_ENV: process.env.NODE_ENV || 'development',
      WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
      WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
      WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
    });
  const stringified = {
    '__DEV__': NODE_ENV === 'development',
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
  return {raw, stringified};
}

module.exports = getClientEnvironment;
