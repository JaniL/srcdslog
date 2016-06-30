var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" say_team ["](.+)["]$/,
  return: function (result) {
    return { type: 'say_team', player: parser.parsePlayer(result[1]), text: result[2] }
  }
};
