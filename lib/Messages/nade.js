var parser = require('../parseutils');

module.exports = {
  pattern: /^L \d\d\/\d\d\/\d\d\d\d - \d\d:\d\d:\d\d: "(.+)" threw (.+) \[(-?\d+) (-?\d+) (-?\d+)\]$/,
  return: function (result) {
    return {
      type: 'nade',
      nadeType: result[2],
      player: parser.parsePlayer(result[1]),
    }
  }
};
