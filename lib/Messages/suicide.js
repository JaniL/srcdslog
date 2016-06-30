var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: ["](.+)["] committed suicide with ["](.+)["] [(]attacker_position ["](.+) (.+) (.+)["][)]$/,
  return: function (result) {
    return { type: 'suicide', player: parser.parsePlayer(result[1]), with: result[2], attacker_position: [parseInt(result[3]), parseInt(result[4]), parseInt(result[5])] }
  }
};
