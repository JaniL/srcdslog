var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" say ["](.+)["]$/,
  return: function (result) {
    return { type: 'say', player: parser.parsePlayer(result[1]), text: result[2] }
  }
};
