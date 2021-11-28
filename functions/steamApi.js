const axios = require('axios');

// https://steamcommunity.com/dev
const self = {
  initialize: ({ steamApiKey }) => {
    self.steamApiKey = steamApiKey;
  },

  getUserDetailsBySteamId: async (steamId) => {
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${self.steamApiKey}&steamids=${steamId}`;
    const postOptions = {
      headers: {
        'content-type': 'application/json',
      },
    };
    const response = await axios.get(url, postOptions);
    return response.data.response.players[0];
  },
};

module.exports = self;
