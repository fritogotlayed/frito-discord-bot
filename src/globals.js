const _ = require('lodash');

const self = {
  /**
   * Provides a wrapper around process.env for testing
   * @param {string} key the environment variable key
   * @param {string} defaultValue the value to return when the key does not contain a value
   * @return {string} the environment variable value
   */
  getEnvVar: (key, defaultValue) => _.get(process.env, [key], defaultValue),
};

module.exports = self;
