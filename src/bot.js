let Discord = require("discord.js");

let logger = require("winston");
let auth = require("./config/auth.json");
let botEvents = require("./bot-events.js");


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";


// Initialize Discord Bot
let client = new Discord.Client();

botEvents.wireEvents(client);

client.login(auth.token);
