const logger = require('winston');

const exitHandler = async (options, exitCode) => {
  if (options.cleanup) logger.debug('cleanup');
  if (options.exitCode || exitCode === 0) logger.debug(`ExitCode: ${exitCode}`);
  if (options.exit) {
    logger.info('Shutting down.');
    if (options.onShutdown) {
      const ret = options.onShutdown();
      if (ret && ret.then) return ret;
    }
  }
  return undefined;
};

const wire = (onShutdown) => {
  // do something when app is closing
  process.on('exit', exitHandler.bind(null, { cleanup: true }));

  // catches ctrl+c event
  process.on('SIGINT', exitHandler.bind(null, { exit: true, onShutdown }));

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', exitHandler.bind(null, { exit: true, onShutdown }));
  process.on('SIGUSR2', exitHandler.bind(null, { exit: true, onShutdown }));

  // catches uncaught exceptions
  process.on('uncaughtException', (ex) => {
    logger.error('Unhandled Exception', { err: ex });
  });
};

module.exports = {
  wire,
};
