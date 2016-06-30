var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" entered the game$/,
  return: function (result) {
    return { type: 'entered the game', player: parser.parsePlayer(result[1]) }
  }
};
