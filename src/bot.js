const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const discord = require('discord.js');
const logger = require('winston');

const botEvents = require('./bot-events');
const appShutdown = require('./app_shutdown');
const globals = require('./globals');

async function startBot() {
  // Configure logger settings
  logger.remove(logger.transports.Console);
  logger.add(new logger.transports.Console(), {
    colorize: true,
  });
  logger.level = 'debug';

  // Initialize MDS SDK
  await mdsSdk.initialize({
    account: globals.getEnvVar('MDS_ACCOUNT'),
    userId: globals.getEnvVar('MDS_USER_ID'),
    password: globals.getEnvVar('MDS_PASSWORD'),
    allowSelfSignCert: globals.getEnvVar('MDS_ALLOW_SELF_SIGN_CERT'),
    identityUrl: globals.getEnvVar('MDS_IDENTITY_URL'),
    sfUrl: globals.getEnvVar('MDS_SF_URL'),
  });

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
