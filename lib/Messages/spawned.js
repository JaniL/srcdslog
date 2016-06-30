var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" spawned as ["](.+)["]$/,
  return: function (result) {
    return { type: 'spawned', player: parser.parsePlayer(result[1]), role: result[2] }
  }
};
