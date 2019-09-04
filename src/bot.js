const Discord = require('discord.js');

const logger = require('winston');
const auth = require('./config/auth.json');
const botEvents = require('./bot-events.js');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = 'debug';


// Initialize Discord Bot
const client = new Discord.Client();

botEvents.wireEvents(client);

client.login(auth.token);
