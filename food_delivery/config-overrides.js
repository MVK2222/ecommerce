module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.resolve.alias = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    vm: require.resolve("vm-browserify"),
  };
  return config;
};