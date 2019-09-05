const { Client } = require('discord.js'); /* eslint-disable-line no-unused-vars */

const auth = require('./config/auth.json');
const handlers = require('./commands');

/**
 * Wires up all the appropriate events for the discord client.
 * @param {Client} client the discord client object
 */
function wireEvents(client, logger) {
  /* https://discord.js.org/#/docs/main/stable/general/welcome */
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

      if (handlers[cmd]) {
        handlers[cmd](helperArgs);
      } else {
        logger.warn(`Unknown command: ${event.content}`);
      }
    }
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
