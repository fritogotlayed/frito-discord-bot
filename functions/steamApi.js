const axios = require('axios');

// https://steamcommunity.com/dev
const self = {
  initialize: ({ steamApiKey }) => {
    self.steamApiKey = steamApiKey;
  },

  getUserDetailsBySteamId: async (steamId) => {
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${self.steamApiKey}&steamids=${steamId}&format=json`;
    const reqOptions = {
      headers: {
        'content-type': 'application/json',
      },
    };
    const response = await axios.get(url, reqOptions);
    if (response.status === 200) {
      return response.data.response.players[0];
    }
    throw new Error({ user: steamId, statusCode: response.status });
  },

  getGamesForUser: async (steamId) => {
    // https://developer.valvesoftware.com/wiki/Steam_Web_API#GetOwnedGames_.28v0001.29
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${self.steamApiKey}&steamId=${steamId}&include_appinfo=true&format=json`;
    const reqOptions = {
      headers: {
        'content-type': 'application/json',
      },
    };
    const response = await axios.get(url, reqOptions);
    if (response.status === 200) {
      return response.data.response;
    }
    throw new Error({ user: steamId, statusCode: response.status });
  },

};

module.exports = self;
