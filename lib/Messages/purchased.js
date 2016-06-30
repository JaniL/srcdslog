var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" purchased ["](.+)["]$/,
  return: function (result) {
    return { type: 'purchased', player: parser.parsePlayer(result[1]), item: result[2] }
  }
};
