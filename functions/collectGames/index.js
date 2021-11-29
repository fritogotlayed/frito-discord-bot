const _ = require('lodash');
const { MongoClient } = require('mongodb');

const steamApi = require('../steamApi');

const self = {
  main: async (input, context) => {
    try {
      steamApi.initialize({
        steamApiKey: context.steamApiKey,
      });

      const connOptions = { useNewUrlParser: true, useUnifiedTopology: true };
      const client = await MongoClient.connect(context.mongoConnString, connOptions);
      const db = client.db('FritoDiscordBot');
      const col = db.collection('users');
      const user = await col.findOne({ discordId: input.discordId });

      const gamesData = await steamApi.getGamesForUser(user.steamId);
      const games = _.map(gamesData.games, (e) => _.pick(e, ['appid', 'name']));

      await col.updateOne(
        { discordId: input.discordId },
        {
          $set: {
            games,
          },
        },
      );
      return 'Updated games for user';
    } catch (err) {
      console.log(err);
      console.dir(err);
      return 'An error was encountered while collecting your games. Please verify the information and try again.';
    }
  },
};

module.exports = self;
