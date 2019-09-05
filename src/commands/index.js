const fs = require('fs');

function requireDir() {
  const commands = {};

  /* here we have to use the path from the working directory where below we use the current
     directory
   */
  fs.readdirSync(__dirname).forEach((library) => {
    const isLibrary = library.split('.').length > 0 && library.split('.')[1] === 'js';
    const libName = library.split('.')[0].toLowerCase();

    if (isLibrary && libName !== 'index') {
      /* eslint-disable-next-line import/no-dynamic-require, global-require */
      commands[libName] = require(`./${libName}`);
    }
  });

  return commands;
}

module.exports = requireDir('./src/commands');
