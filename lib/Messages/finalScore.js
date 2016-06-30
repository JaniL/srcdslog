var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: Team "(.+)" final score "(\d+)" with "(\d+)" players$/,
  return: function (result) {
    return { type: 'finalScore', team: result[1], score: parseInt(result[2]), players: parseInt(result[3]) }
  }
};
