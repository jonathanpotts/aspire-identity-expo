module.exports = function (/** @type {import('@babel/core').ConfigAPI} */ api) {
  api.cache(true);

  /** @type {import('@babel/core').TransformOptions} */
  const config = {
    presets: [["babel-preset-expo"]],
  };

  return config;
};
