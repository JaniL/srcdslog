var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" position_report (.+)$/,
  return: function (result) {
    return { type: 'position_report', player: parser.parsePlayer(result[1]), text: parser.parseArgs(result[2]) }
  }
};
