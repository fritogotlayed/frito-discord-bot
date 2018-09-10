let logger = require("winston");
let auth = require('./config/auth.json');
let handlers = require("./bot-command-handlers.js");

module.exports = {
    wireEvents: function(client) {
        client.on("ready", function (evt) {
            logger.info("Connected");
            logger.info("Logged in as: " + client.username);
            logger.debug(client.username + " - (" + client.id + ")");
        });

        client.on("message", function (event) {
            // Our bot needs to know if it needs to execute a command
            // for this script it will listen for messages that will start with `!`
            if (event.content.substring(0, 1) === "!") {
                let args = event.content.substring(1).split(" ");
                let cmd = args[0];

                args = args.splice(1);
                let helperArgs = {
                    event: event,
                    message: args.join(" ")
                };

                switch (cmd) {
                case "ping":
                    event.channel.sendMessage("Pong!")
                    break;
                case "echo":
                    handlers.echo(helperArgs);
                    break;
                case "roll":
                    handlers.roll(helperArgs);
                    break;
                default:
                    console.log("Unknown command: " + event.content);
                    break;
                }
            }
        });

        /*
        client.on("presence", function (user, userID, status, game, event) {
            console.log(user + " is now: " + status);
        });
        */

        client.on("any", function (event) {
            console.log(event) //Logs every event
        });

        client.on("debug", function (event) {
            console.log(event) //Logs every event
        });

        client.on("disconnect", function () {
            console.log("Bot disconnected");

            // HACK: until docker / env stuff is in place.
            client.login(auth.token); //Auto reconnect
        });
    }
};
