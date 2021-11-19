const { Client } = require('discord.js'); /* eslint-disable-line no-unused-vars */

const handlers = require('./commands');

function invokeHandler(cmd, event, logger) {
  // carve off the command
  const args = event.content.substring(1).split(' ').splice(1);
  const helperArgs = {
    event,
  };

  if (handlers[cmd]) {
    if (args[0] === 'help') {
      handlers[cmd].help(helperArgs);
    } else {
      helperArgs.message = args.join(' ');
      handlers[cmd].handler(helperArgs);
    }
  } else {
    logger.warn(`Unknown command: ${event.content}`);
  }
}

function emitHelp(event) {
  const commands = Object.keys(handlers).join(', ');
  const message = `Try "!{command} help" to get more information on a specific command. Available commands: ${commands}`;
  event.channel.send(message);
}

/**
 * Wires up all the appropriate events for the discord client.
 * @param {Client} client the discord client object
 */
function wireEvents(client, logger) {
  /* https://discord.js.org/#/docs/main/stable/general/welcome */
  client.on('ready', () => {
    logger.info('Connected');
    logger.info(`Logged in as: ${client.user.username}`);
    logger.debug(`${client.user.username} - (${client.user.id})`);
  });

  client.on('message', (event) => {
    // Our bot needs to know if it needs to execute a command
    // for this script it will listen for messages that will start with `!`
    if (event.content.substring(0, 1) === '!') {
      const args = event.content.substring(1).split(' ');
      const cmd = args[0];

      switch (cmd) {
        case 'help':
          emitHelp(event);
          break;
        default:
          invokeHandler(cmd, event, logger);
          break;
      }
    }
  });

  client.on('disconnect', () => {
    logger.warn('Bot disconnected.  Reconnecting...');
    // HACK: until docker / env stuff is in place.
    client.login(process.env.AUTH_TOKEN); // Auto reconnect
  });
}

module.exports = {
  wireEvents,
};
