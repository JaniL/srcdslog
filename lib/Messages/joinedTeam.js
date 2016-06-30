var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" joined team ["](.+)["]$/,
  return: function (result) {
    return { type: 'joined team', player: parser.parsePlayer(result[1]), team: result[2] }
  }
};
