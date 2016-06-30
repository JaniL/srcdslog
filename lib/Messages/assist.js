var parser = require('../parseutils');

module.exports = {
  pattern: /^L (\d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d): "(.+)" assisted killing "(.+)"$/,
  return: function (result) {
    return {
      time: parser.parseTime(result[0]),
      type: 'assist',
      player: parser.parsePlayer(result[2]),
      killed: parser.parsePlayer(result[3]),
    }
  }
};
