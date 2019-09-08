const discord = require('discord.js');

const logger = require('winston');
const botEvents = require('./bot-events.js');


function startBot() {
  // Configure logger settings
  logger.remove(logger.transports.Console);
  logger.add(new logger.transports.Console(), {
    colorize: true,
  });
  logger.level = 'debug';


  // Initialize Discord Bot
  const client = new discord.Client();

  botEvents.wireEvents(client, logger);

  client.login(process.env.AUTH_TOKEN);
}

/* istanbul ignore if */
if (require.main === module) {
  startBot();
} else {
  module.exports = {
    startBot,
  };
}
