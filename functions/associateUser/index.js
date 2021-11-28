const { MongoClient } = require('mongodb');

const steamApi = require('../steamApi');

const self = {
  main: async (input, context) => {
    try {
      steamApi.initialize({
        steamApiKey: context.steamApiKey,
      });

      const steamData = await steamApi.getUserDetailsBySteamId(input.steamId);
      // cspell: disable-next
      const { personaname: personaName, avatarfull: avatarUrl } = steamData;

      const connOptions = { useNewUrlParser: true, useUnifiedTopology: true };
      const client = await MongoClient.connect(context.mongoConnString, connOptions);
      const db = client.db('FritoDiscordBot');
      const col = db.collection('users');
      const existingData = await col.find({ discordId: input.discordId }).toArray();

      if (existingData.length > 0) {
        // User exists. update it
        await col.updateOne(
          { discordId: input.discordId },
          {
            $set: {
              steamId: input.steamId,
            },
          },
        );
        return `updated user with persona ${personaName} - ${avatarUrl}`;
      }

      // New user. Insert them
      await col.insertOne({
        discordId: input.discordId,
        steamId: input.steamId,
      });
      return `created user with persona ${personaName}`;
    } catch (err) {
      return 'An error was encountered while associating your account. Please verify the information and try again.';
    }
  },
};

module.exports = self;
