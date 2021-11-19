const discord = require('discord.js');

const logger = require('winston');
const botEvents = require('./bot-events');
const appShutdown = require('./app_shutdown');

function startBot() {
  // Configure logger settings
  logger.remove(logger.transports.Console);
  logger.add(new logger.transports.Console(), {
    colorize: true,
  });
  logger.level = 'debug';

  // Initialize Discord Bot
  // https://discord.com/developers/docs/topics/gateway#list-of-intents
  const client = new discord.Client({
    intents: [
      discord.Intents.FLAGS.GUILDS,
      discord.Intents.FLAGS.GUILD_MESSAGES,
      // discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    ],
  });
  appShutdown.wire(() => client.destroy());

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
