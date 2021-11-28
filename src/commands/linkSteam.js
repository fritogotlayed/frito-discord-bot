const _ = require('lodash');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

function help(args) {
  args.event.channel.send('Registers the users steam account with the users discord account.');
}

async function handler(args) {
  const { id: authorId } = args.event.author;
  const sfClient = await mdsSdk.getServerlessFunctionsClient();

  args.event.channel.send(`<@!${authorId}> Processing your request`);

  const funcs = await sfClient.listFunctions();
  const associateFunc = _.filter(funcs, (e) => e.name === 'associateUser')[0];

  if (associateFunc) {
    const result = await sfClient.invokeFunction(associateFunc.orid, {
      discordId: authorId,
      steamId: args.message,
    });
    args.event.channel.send(`<@!${authorId}> result : ${result}`);
  } else {
    args.event.channel.send(`<@!${authorId}> I couldn't associate you right now. Please try again later.`);
  }
}

module.exports = {
  help,
  handler,
};
