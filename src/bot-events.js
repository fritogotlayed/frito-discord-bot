const logger = require('winston');
const auth = require('./config/auth.json');
const handlers = require('./commands');

function wireEvents(client) {
  client.on('ready', () => {
    logger.info('Connected');
    logger.info(`Logged in as: ${client.username}`);
    logger.debug(`${client.username} - (${client.id})`);
  });

  client.on('message', (event) => {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (event.content.substring(0, 1) === '!') {
      let args = event.content.substring(1).split(' ');
      const cmd = args[0];

      args = args.splice(1);
      const helperArgs = {
        event,
        message: args.join(' '),
      };

      switch (cmd) {
        case 'ping':
          event.channel.sendMessage('Pong!');
          break;
        default:
          if (handlers[cmd]) {
            handlers[cmd](helperArgs);
          } else {
            logger.warn(`Unknown command: ${event.content}`);
          }
          break;
      }
    }
  });

  client.on('presence', (user, userID, status, game, event) => {
    logger.silly({
      user,
      userID,
      status,
      game,
      event,
    });
  });

  client.on('any', (event) => {
    logger.verbose(event);
  });

  client.on('debug', (event) => {
    logger.verbose(event);
  });

  client.on('disconnect', () => {
    logger.warn('Bot disconnected.  Reconnecting...');
    // HACK: until docker / env stuff is in place.
    client.login(auth.token); // Auto reconnect
  });
}

module.exports = {
  wireEvents,
};
