var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" changed role to ["](.+)["]$/,
  return: function (result) {
    return { type: 'changed role', player: parser.parsePlayer(result[1]) , role: result[2] }
  }
};
