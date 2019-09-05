const discord = require('discord.js');

const logger = require('winston');
const auth = require('./config/auth.json');
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

  client.login(auth.token);
}

/* istanbul ignore if */
if (require.main === module) {
  startBot();
} else {
  module.exports = {
    startBot,
  };
}
