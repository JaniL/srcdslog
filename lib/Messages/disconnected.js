var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" disconnected \(reason "(.+)"\)$/,
  return: function (result) {
    return { type: 'disconnected', player: parser.parsePlayer(result[1]), reason: result[2] }
  }
};
